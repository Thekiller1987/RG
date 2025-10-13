// features/pos/components/PaymentModal.jsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  FaCreditCard, FaWindowClose, FaMoneyBillWave, FaDollarSign, FaCheckCircle,
  FaHashtag, FaExchangeAlt, FaUserTag, FaCoins, FaMinusCircle, FaBalanceScale,
  FaCashRegister, FaHandshake
} from 'react-icons/fa';

import {
  ModalOverlay, ModalContent, Button, SearchInput, TotalsRow, InfoBox
} from '../POS.styles.jsx';

// Helper: convertir string a número con tolerancia a casi-cero
const cleanFloat = (v) => {
  const n = parseFloat(v);
  if (Number.isNaN(n)) return 0;
  return Math.abs(n) < 0.001 ? 0 : n;
};

const PaymentModal = ({
  total = 0,
  tasaDolar = 1,
  onClose,
  onFinishSale,
  clientes = [],
  showAlert,
  initialClientId = '0',
  // se acepta para compatibilidad, pero NO se usa aquí para evitar bucles
  onCloseTicket, // eslint-disable-line no-unused-vars
}) => {
  // ====== STATE ======
  const [efectivo, setEfectivo] = useState('0.00');
  const [tarjeta, setTarjeta] = useState('0.00');
  const [dolares, setDolares] = useState('0.00');
  const [transferencia, setTransferencia] = useState('0.00');
  const [referenciaTarjeta, setReferenciaTarjeta] = useState('');
  const [tipoPagoPrincipal, setTipoPagoPrincipal] = useState('contado'); // 'contado' | 'credito'
  const [clienteSeleccionado, setClienteSeleccionado] = useState(initialClientId ?? '0');
  const [saving, setSaving] = useState(false);

  // ====== DERIVADOS ======
  const finalClienteId = useMemo(() => {
    const n = parseInt(clienteSeleccionado, 10);
    return Number.isNaN(n) ? 0 : n;
  }, [clienteSeleccionado]);

  const isClientValid = finalClienteId !== 0;

  const numEfectivo = useMemo(() => cleanFloat(efectivo), [efectivo]);
  const numTarjeta = useMemo(() => cleanFloat(tarjeta), [tarjeta]);
  const numDolares = useMemo(() => cleanFloat(dolares), [dolares]);
  const numTransferencia = useMemo(() => cleanFloat(transferencia), [transferencia]);

  const dolaresEnMonedaLocal = useMemo(
    () => numDolares * Number(tasaDolar || 1),
    [numDolares, tasaDolar]
  );

  const pagosContadoTotal = useMemo(
    () => numEfectivo + numTarjeta + numTransferencia + dolaresEnMonedaLocal,
    [numEfectivo, numTarjeta, numTransferencia, dolaresEnMonedaLocal]
  );

  const needsReference = useMemo(() => numTarjeta > 0.01, [numTarjeta]);

  const restanteTotal = useMemo(
    () => Number(total) - pagosContadoTotal,
    [total, pagosContadoTotal]
  );

  const credito = useMemo(() => {
    if (tipoPagoPrincipal === 'credito' && isClientValid && restanteTotal > 0.01) return restanteTotal;
    if (pagosContadoTotal >= Number(total) - 0.0001) return 0;
    return 0;
  }, [tipoPagoPrincipal, isClientValid, restanteTotal, pagosContadoTotal, total]);

  const saldoPendienteDePago = useMemo(() => {
    const saldo = cleanFloat(restanteTotal);
    if (saldo <= 0.01) return 0;
    if (tipoPagoPrincipal === 'credito' && isClientValid) return 0;
    return saldo;
  }, [restanteTotal, tipoPagoPrincipal, isClientValid]);

  const cambio = useMemo(() => Math.max(0, -restanteTotal), [restanteTotal]);

  const tipoVentaFinal = useMemo(() => {
    const tieneCredito = credito > 0.01;
    if (tieneCredito) return pagosContadoTotal > 0.01 ? 'mixto' : 'credito_total';
    return 'contado';
  }, [credito, pagosContadoTotal]);

  const displayTipoVenta = useMemo(() => {
    if (saldoPendienteDePago > 0.01) return 'PAGO INCOMPLETO';
    if ((tipoVentaFinal === 'mixto' || tipoVentaFinal === 'credito_total') && !isClientValid) return 'CLIENTE NO SELECCIONADO';
    switch (tipoVentaFinal) {
      case 'mixto': return 'PAGO MIXTO (Contado + Crédito)';
      case 'credito_total': return 'CRÉDITO TOTAL';
      default: return 'CONTADO';
    }
  }, [tipoVentaFinal, saldoPendienteDePago, isClientValid]);

  const disableInputs = useMemo(
    () => (tipoPagoPrincipal === 'credito' && !isClientValid),
    [tipoPagoPrincipal, isClientValid]
  );

  // Precarga de efectivo para contado (sin bucles)
  useEffect(() => {
    if (tipoPagoPrincipal === 'contado' && pagosContadoTotal === 0 && Number(total) > 0) {
      setEfectivo(Number(total).toFixed(2));
    }
    if (tipoPagoPrincipal === 'credito' && !isClientValid) {
      setClienteSeleccionado('0');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipoPagoPrincipal, total]);

  // ====== HANDLERS UI ======
  const handleClientChange = useCallback((e) => {
    const val = String(e.target.value);
    setClienteSeleccionado(val);
    const id = parseInt(val, 10) || 0;
    if (id !== 0) {
      setTipoPagoPrincipal('contado');
      if (pagosContadoTotal < Number(total) && pagosContadoTotal === 0) {
        setEfectivo(Number(total).toFixed(2));
      }
    }
  }, [pagosContadoTotal, total]);

  const handleSetTipoContado = useCallback(() => {
    setTipoPagoPrincipal('contado');
    const pagosNoEfectivo = numTarjeta + numTransferencia + dolaresEnMonedaLocal;
    const efectivoFaltante = Math.max(0, Number(total) - pagosNoEfectivo);
    setEfectivo(Number(efectivoFaltante).toFixed(2));
  }, [numTarjeta, numTransferencia, dolaresEnMonedaLocal, total]);

  const handleSetTipoCredito = useCallback(() => {
    if (!isClientValid) {
      showAlert?.({
        title: 'Cliente Requerido',
        message: 'Debe seleccionar un cliente para habilitar la opción de Crédito.',
        type: 'error'
      });
      return;
    }
    setTipoPagoPrincipal('credito');
    setEfectivo('0.00');
    setTarjeta('0.00');
    setDolares('0.00');
    setTransferencia('0.00');
    setReferenciaTarjeta('');
  }, [isClientValid, showAlert]);

  const handlePayFullCash = useCallback(() => {
    setEfectivo(Number(total).toFixed(2));
    setTarjeta('0.00');
    setDolares('0.00');
    setTransferencia('0.00');
    setReferenciaTarjeta('');
    setTipoPagoPrincipal('contado');
  }, [total]);

  // ====== FINALIZAR (ASÍNCRONO) ======
  const handleFinish = async () => {
    // Validaciones
    if ((tipoVentaFinal === 'credito_total' || tipoVentaFinal === 'mixto') && finalClienteId === 0) {
      showAlert?.({ title: 'Cliente Requerido', message: 'Debe seleccionar un cliente para ventas a crédito o mixtas.', type: 'error' });
      return;
    }
    if (saldoPendienteDePago > 0.01) {
      showAlert?.({ title: 'Pago Incompleto', message: `Faltan C$${saldoPendienteDePago.toFixed(2)} para completar la venta.`, type: 'warning' });
      return;
    }
    if (needsReference && !referenciaTarjeta.trim()) {
      showAlert?.({ title: 'Dato Requerido', message: 'Ingrese el número de referencia para el pago con tarjeta.', type: 'warning' });
      return;
    }
    if (saving) return;
    setSaving(true);

    // Ingreso real a caja: EFECTIVO + DÓLARES (en moneda local) - CAMBIO
    const ingresoRealEnCaja = Math.max(0, numEfectivo + dolaresEnMonedaLocal - cambio);

    // Tipo de venta por montos (dólares cuentan como contado)
    const tipoVenta = computeTipoVenta({
      efectivo: numEfectivo,
      tarjeta: numTarjeta,
      transferencia: numTransferencia,
      dolaresLocal: dolaresEnMonedaLocal,
      credito: tipoPagoPrincipal === 'credito'
    });

    // Crédito que viaja en el payload
    const creditoPayload = Number(
      tipoPagoPrincipal === 'credito'
      ? Math.max(0, Number(total) - (numEfectivo + numTarjeta + numTransferencia + dolaresEnMonedaLocal))
      : 0
    );

    // Payload hacia POS/backend
    const pagoDetalles = {
      totalVenta: Number(total),
      efectivo: numEfectivo,
      tarjeta: numTarjeta,
      transferencia: numTransferencia,
      dolares: numDolares,
      tasaDolarAlMomento: Number(tasaDolar),
      referenciaTarjeta: numTarjeta > 0.01 ? referenciaTarjeta.trim() : null,
      credito: creditoPayload,
      clienteId: finalClienteId,
      tipoVenta, 					// 'contado' | 'mixto' | 'credito_total'
      cambio: Number(cambio),
      ingresoCaja: Number(ingresoRealEnCaja)
    };

    try {
      const ok = await onFinishSale?.(pagoDetalles); // el POS devuelve true/false
      if (ok !== false) {
        onClose?.(); // solo cerramos el modal; el POS cierra el ticket
      }
    } catch (err) {
      showAlert?.({ title: 'Error', message: err?.message || 'No se pudo completar la venta.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Contabiliza dólares dentro de contado
  function computeTipoVenta({ efectivo, tarjeta, transferencia, dolaresLocal, credito }) {
    const contado = (efectivo + tarjeta + transferencia + dolaresLocal) > 0.01;
    if (credito && contado) return 'mixto';
    if (credito && !contado) return 'credito_total';
    return 'contado';
  }

  const alertColor =
    saldoPendienteDePago > 0.01 || !isClientValid
    ? '#dc3545'
    : (cambio > 0.01 ? '#28a745' : '#17a2b8');

  const alertMessage =
    !isClientValid && (tipoPagoPrincipal === 'credito' || tipoVentaFinal === 'mixto' || tipoVentaFinal === 'credito_total')
    ? 'CLIENTE NO SELECCIONADO'
    : (saldoPendienteDePago > 0.01
      ? `¡FALTA CUBRIR! C$${saldoPendienteDePago.toFixed(2)}`
      : (cambio > 0.01 ? `CAMBIO A ENTREGAR: C$${cambio.toFixed(2)}` : 'BALANCE PERFECTO'));

  // ====== RENDER ======
  return (
    <ModalOverlay>
      <ModalContent
        style={{
          maxWidth: '950px',
          width: '96%',
          maxHeight: '90vh',
          overflow: 'hidden',
          borderRadius: 12,
          backgroundColor: '#f8f9fa'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '2px solid #007bff',
            paddingBottom: 10,
            marginBottom: 15
          }}
        >
          <h2 style={{ margin: 0, color: '#333', fontSize: '1.3rem' }}>
            <FaCreditCard /> PROCESAR PAGO
          </h2>
          <Button
            $cancel
            onClick={onClose}
            style={{
              borderRadius: '50%', width: 36, height: 36, padding: 0,
              fontSize: '1.05rem', backgroundColor: '#dc3545', borderColor: '#dc3545'
            }}
          >
            <FaWindowClose />
          </Button>
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '5fr 4fr',
            gap: '1.5rem',
            height: 'calc(90vh - 120px)'
          }}
        >
          {/* Left panel */}
          <div style={{ paddingRight: 10, borderRight: '1px solid #dee2e6', overflowY: 'auto', paddingBottom: 10 }}>
            {/* Opciones de venta */}
            <div style={{ padding: 15, border: '1px solid #ddd', borderRadius: 8, backgroundColor: '#fff', marginBottom: 15 }}>
              <h4 style={{ marginTop: 0, color: '#007bff', fontSize: '1.05rem' }}>
                <FaCashRegister /> Opciones de Venta
              </h4>

              <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
                <Button
                  onClick={handleSetTipoContado}
                  style={{
                    flex: 1, padding: '8px 0',
                    backgroundColor: tipoPagoPrincipal === 'contado' ? '#17a2b8' : '#f0f0f0',
                    color: tipoPagoPrincipal === 'contado' ? '#fff' : '#333',
                    border: `1px solid ${tipoPagoPrincipal === 'contado' ? '#007bff' : '#ccc'}`,
                    fontWeight: '700'
                  }}
                >
                  <FaCashRegister /> CONTADO
                </Button>
                <Button
                  onClick={handleSetTipoCredito}
                  disabled={!isClientValid}
                  style={{
                    flex: 1, padding: '8px 0',
                    backgroundColor: tipoPagoPrincipal === 'credito' ? '#ffc107' : '#f0f0f0',
                    border: `1px solid ${tipoPagoPrincipal === 'credito' ? '#e65100' : '#ccc'}`,
                    fontWeight: '700',
                    opacity: !isClientValid ? 0.6 : 1
                  }}
                >
                  <FaHandshake /> CRÉDITO
                </Button>
              </div>

              {/* Selector Cliente */}
              <label
                style={{ display: 'block', fontWeight: '700', marginBottom: 6, color: '#007bff' }}
              >
                <FaUserTag /> Seleccionar Cliente
              </label>
              <SearchInput
                as="select"
                value={clienteSeleccionado}
                onChange={handleClientChange}
                style={{
                  height: 36, padding: '0 8px', width: '100%', fontSize: '0.95rem',
                  border: isClientValid ? '2px solid #28a745' : '2px solid #dc3545',
                  backgroundColor: isClientValid ? '#f6fff6' : '#fff0f0'
                }}
              >
                <option value="0" disabled>-- Seleccionar Cliente --</option>
                {(clientes || []).map(c => (
                  <option key={c.id_cliente ?? c.id} value={c.id_cliente ?? c.id}>
                    {c.nombre}{Number(c.saldo_pendiente || 0) > 0 ? ` (C$${Number(c.saldo_pendiente).toFixed(2)})` : ''}
                  </option>
                ))}
              </SearchInput>

              {!isClientValid && (tipoPagoPrincipal === 'credito' || tipoVentaFinal === 'mixto' || tipoVentaFinal === 'credito_total') && (
                <p style={{ color: '#dc3545', margin: '8px 0 0', fontSize: '0.85rem', fontWeight: '700' }}>
                  ¡Atención! Debe seleccionar un cliente para crédito/mixto.
                </p>
              )}
            </div>

            {/* Medios de pago */}
            <div style={{ padding: 15, border: '1px solid #ddd', borderRadius: 8, backgroundColor: '#fff' }}>
              <h4 style={{ marginTop: 0, color: '#333', fontSize: '1.05rem', borderBottom: '1px solid #eee', paddingBottom: 6 }}>
                Medios de Pago (C$)
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 15px', marginTop: 8 }}>
                {/* EFECTIVO */}
                <div>
                  <label style={{ display: 'block', fontWeight: '700', fontSize: '0.85rem', marginBottom: 4 }}>
                    <FaMoneyBillWave /> Efectivo
                  </label>
                  <SearchInput
                    type="number" step="0.01" value={efectivo}
                    onChange={e => setEfectivo(e.target.value)}
                    style={{ height: 34, fontSize: '0.95rem' }}
                    disabled={disableInputs}
                  />
                </div>

                {/* DÓLARES */}
                <div>
                  <label style={{ display: 'block', fontWeight: '700', fontSize: '0.85rem', marginBottom: 4 }}>
                    <FaDollarSign /> Dólares (USD)
                  </label>
                  <SearchInput
                    type="number" step="0.01" value={dolares}
                    onChange={e => setDolares(e.target.value)}
                    style={{ height: 34, fontSize: '0.95rem' }}
                    disabled={disableInputs}
                  />
                </div>

                {/* TARJETA */}
                <div>
                  <label style={{ display: 'block', fontWeight: '700', fontSize: '0.85rem', marginBottom: 4 }}>
                    <FaCreditCard /> Tarjeta
                  </label>
                  <SearchInput
                    type="number" step="0.01" value={tarjeta}
                    onChange={e => setTarjeta(e.target.value)}
                    style={{ height: 34, fontSize: '0.95rem' }}
                    disabled={disableInputs}
                  />
                </div>

                {/* TRANSFERENCIA */}
                <div>
                  <label style={{ display: 'block', fontWeight: '700', fontSize: '0.85rem', marginBottom: 4 }}>
                    <FaExchangeAlt /> Transferencia
                  </label>
                  <SearchInput
                    type="number" step="0.01" value={transferencia}
                    onChange={e => setTransferencia(e.target.value)}
                    style={{ height: 34, fontSize: '0.95rem' }}
                    disabled={disableInputs}
                  />
                </div>
              </div>

              {/* Monto a crédito (visual) */}
              {tipoPagoPrincipal === 'credito' && (
                <div style={{ marginTop: 12 }}>
                  <label
                    style={{ display: 'block', fontWeight: '700', fontSize: '0.85rem', marginBottom: 4, color: '#e65100' }}
                  >
                    <FaMinusCircle /> MONTO A CRÉDITO (Calculado)
                  </label>
                  <SearchInput
                    type="text"
                    value={`C$${credito.toFixed(2)}`}
                    readOnly
                    style={{ height: 34, fontSize: '0.95rem', backgroundColor: '#fff3e0', color: '#e65100', fontWeight: '700' }}
                  />
                  <p style={{ margin: '6px 0 0', fontSize: '0.8rem', textAlign: 'center' }}>
                    Abono: C${pagosContadoTotal.toFixed(2)}. Falta (Crédito): C${credito.toFixed(2)}
                  </p>
                </div>
              )}

              {/* Referencia (solo tarjeta) */}
              {needsReference && (
                <div style={{ marginTop: 12, padding: 10, border: '1px dashed #ffc107', borderRadius: 6, backgroundColor: '#fffbe6' }}>
                  <label style={{ display: 'block', fontWeight: '700', fontSize: '0.85rem', color: '#856404' }}>
                    <FaHashtag /> Nº de Referencia (Obligatorio)
                  </label>
                  <SearchInput
                    type="text"
                    placeholder="Referencia de pago"
                    value={referenciaTarjeta}
                    onChange={e => setReferenciaTarjeta(e.target.value)}
                    style={{ height: 32, fontSize: '0.9rem' }}
                  />
                </div>
              )}

              {/* Botón rápido contado */}
              {tipoPagoPrincipal === 'contado' ? (
                <Button
                  info onClick={handlePayFullCash}
                  style={{ width: '100%', padding: '10px 0', marginTop: 14, backgroundColor: '#17a2b8', fontSize: '1rem' }}
                >
                  <FaCoins /> VENTA DE CONTADO RÁPIDA (C$ {Number(total).toFixed(2)})
                </Button>
              ) : (
                <div style={{ marginTop: 14, padding: 10, textAlign: 'center', border: '1px solid #ddd', borderRadius: 6, backgroundColor: '#f9f9f9' }}>
                  <small style={{ fontWeight: '700' }}>
                    {credito > 0.01
                      ? `Crédito de C$${credito.toFixed(2)} aplicado.`
                      : (pagosContadoTotal >= Number(total)
                        ? '¡VENTA PAGADA TOTALMENTE!'
                        : 'Deje en cero para Crédito Total o ingrese abono para Venta Mixta.')}
                  </small>
                </div>
              )}
            </div>
          </div>

          {/* Right panel */}
          <div style={{ paddingLeft: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: 10 }}>
            <div>
              <InfoBox style={{ marginBottom: 10, padding: 15, backgroundColor: '#e9f7ff', border: '2px solid #007bff', borderRadius: 8 }}>
                <TotalsRow $bold style={{ fontSize: '1.4rem', color: '#007bff' }}>
                  <span>TOTAL VENTA:</span>
                  <span>C$ {Number(total).toFixed(2)}</span>
                </TotalsRow>
                <TotalsRow style={{ borderTop: '1px dashed #b3d9ff', paddingTop: 6, fontSize: '0.85rem' }}>
                  <span><FaDollarSign /> Tasa USD:</span>
                  <span>C$ {Number(tasaDolar).toFixed(2)}</span>
                </TotalsRow>
              </InfoBox>

              <div style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6, marginBottom: 10, backgroundColor: '#fff' }}>
                <TotalsRow style={{ color: '#333', borderBottom: '1px solid #eee', paddingBottom: 6, fontSize: '0.95rem' }}>
                  <span>TOTAL PAGADO (Contado):</span>
                  <span style={{ fontWeight: '700' }}>C$ {pagosContadoTotal.toFixed(2)}</span>
                </TotalsRow>

                <TotalsRow style={{ marginTop: 8, fontSize: '0.95rem' }}>
                  <span>Clasificación Final:</span>
                  <span style={{ fontWeight: '700', color: credito > 0.01 ? '#e65100' : (isClientValid ? '#2e7d32' : '#dc3545') }}>
                    {displayTipoVenta}
                  </span>
                </TotalsRow>
              </div>

              <InfoBox
                style={{
                  marginBottom: 10,
                  padding: 12,
                  backgroundColor: alertColor === '#dc3545' ? '#f8d7da' : (alertColor === '#28a745' ? '#d4edda' : '#cce5ff'),
                  color: alertColor,
                  fontWeight: '700',
                  fontSize: '1.05rem',
                  textAlign: 'center',
                  borderRadius: 8,
                  border: `2px solid ${alertColor}`
                }}
              >
                <FaBalanceScale style={{ marginRight: 8 }} /> {alertMessage}
              </InfoBox>
            </div>

            {/* Botón final */}
            <div style={{ marginTop: 'auto' }}>
              <Button
                pay
                onClick={handleFinish}
                disabled={
                  saving ||
                  saldoPendienteDePago > 0.01 ||
                  ((tipoVentaFinal === 'mixto' || tipoVentaFinal === 'credito_total') && !isClientValid)
                }
                style={{
                  padding: '12px 0',
                  fontSize: '1.15rem',
                  width: '100%',
                  fontWeight: 800,
                  opacity: saving ? 0.7 : 1,
                  backgroundColor:
                    (saving ||
                      saldoPendienteDePago > 0.01 ||
                      ((tipoVentaFinal === 'mixto' || tipoVentaFinal === 'credito_total') && !isClientValid))
                      ? '#6c757d' : '#28a745'
                }}
              >
                <FaCheckCircle /> {saving ? 'PROCESANDO…' : `FINALIZAR VENTA (${cambio > 0.01 ? `CAMBIO C$${cambio.toFixed(2)}` : 'OK'})`}
              </Button>
            </div>
          </div>
        </div>
      </ModalContent>
    </ModalOverlay>
  );
};

export default PaymentModal;
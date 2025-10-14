// client/src/pages/pos/components/PaymentModal.jsx
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import {
  FaCreditCard, FaWindowClose, FaMoneyBillWave, FaDollarSign, FaCheckCircle,
  FaHashtag, FaExchangeAlt, FaUserTag, FaCoins, FaMinusCircle, FaBalanceScale,
  FaCashRegister, FaHandshake, FaCreditCard as FaCreditCardIcon
} from 'react-icons/fa';

import {
  ModalOverlay, ModalContent, Button, SearchInput, TotalsRow, InfoBox
} from '../POS.styles.jsx';

/* ========== Helpers ========== */
const cleanFloat = (v) => {
  const n = parseFloat(v);
  if (Number.isNaN(n)) return 0;
  return Math.abs(n) < 0.001 ? 0 : n;
};
const fmt = (n) =>
  new Intl.NumberFormat('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(n || 0));

/* ========== Payment Modal ========== */
const PaymentModal = ({
  total = 0,
  tasaDolar = 1,
  onClose,
  onFinishSale,       // el padre (POS.jsx) guarda la venta y maneja la impresión
  clientes = [],
  users = [],         // opcional: solo para mostrar info si quisieras
  showAlert,
  initialClientId = '0',

  // datos para duplicados/consistencia (no imprimimos aquí)
  cartSnapshot = [],
  currentUserId = undefined,
  orderSubtotal = undefined,
  orderDiscountAmount = undefined,
}) => {
  /* ---- UI State ---- */
  const [efectivo, setEfectivo] = useState('0.00');
  const [tarjeta, setTarjeta] = useState('0.00');
  const [dolares, setDolares] = useState('0.00');
  const [transferencia, setTransferencia] = useState('0.00');
  const [referenciaTarjeta, setReferenciaTarjeta] = useState('');
  const [tipoPagoPrincipal, setTipoPagoPrincipal] = useState('contado');
  const [clienteSeleccionado, setClienteSeleccionado] = useState(initialClientId ?? '0');
  const [saving, setSaving] = useState(false);

  // hover del botón pagar
  const [isHovering, setIsHovering] = useState(false);

  /* ---- Derivados ---- */
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
  const restanteTotal = useMemo(() => Number(total) - pagosContadoTotal, [total, pagosContadoTotal]);

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

  const isButtonDisabled = useMemo(() => (
    saving ||
    saldoPendienteDePago > 0.01 ||
    ((tipoVentaFinal === 'mixto' || tipoVentaFinal === 'credito_total') && !isClientValid) ||
    (needsReference && !referenciaTarjeta.trim())
  ), [saving, saldoPendienteDePago, tipoVentaFinal, isClientValid, needsReference, referenciaTarjeta]);

  /* ---- Carrito local (para coherencia de totales) ---- */
  const normalizedItems = useMemo(() => {
    if (!Array.isArray(cartSnapshot)) return [];
    return cartSnapshot.map(({ raw, costo, existencia, ...rest }) => ({
      id: rest.id || rest.id_producto,
      nombre: rest.nombre ?? rest.descripcion ?? rest.producto ?? '',
      quantity: Number(rest.quantity || 0),
      precio: Number(rest.precio_venta ?? rest.precio ?? 0),
    })).filter(i => i.quantity > 0);
  }, [cartSnapshot]);

  const localSubtotal = useMemo(() => {
    if (typeof orderSubtotal === 'number') return Number(orderSubtotal);
    return normalizedItems.reduce((s, i) => s + Number(i.precio || 0) * Number(i.quantity || 0), 0);
  }, [orderSubtotal, normalizedItems]);

  const localDescuento = useMemo(() => {
    if (typeof orderDiscountAmount === 'number') return Number(orderDiscountAmount);
    const d = Number(localSubtotal) - Number(total);
    return d > 0 ? d : 0;
  }, [orderDiscountAmount, localSubtotal, total]);

  /* ---- Efectos ---- */
  useEffect(() => {
    if (tipoPagoPrincipal === 'contado' && pagosContadoTotal === 0 && Number(total) > 0) {
      setEfectivo(Number(total).toFixed(2));
    }
    if (tipoPagoPrincipal === 'credito' && !isClientValid) {
      setClienteSeleccionado('0');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipoPagoPrincipal, total]);

  /* ---- Handlers ---- */
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

  const computeTipoVenta = ({ efectivo, tarjeta, transferencia, dolaresLocal, credito }) => {
    const contado = (efectivo + tarjeta + transferencia + dolaresLocal) > 0.01;
    if (credito && contado) return 'mixto';
    if (credito && !contado) return 'credito_total';
    return 'contado';
  };

  /* ---- Finalizar Venta (sin imprimir aquí) ---- */
  const handleFinish = async (shouldPrintNow) => {
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

    const ingresoRealEnCaja = Math.max(0, numEfectivo + dolaresEnMonedaLocal - cambio);

    const pagoDetalles = {
      totalVenta: Number(total),
      efectivo: numEfectivo,
      tarjeta: numTarjeta,
      transferencia: numTransferencia,
      dolares: numDolares,
      tasaDolarAlMomento: Number(tasaDolar),
      referenciaTarjeta: numTarjeta > 0.01 ? referenciaTarjeta.trim() : null,
      credito: credito,
      clienteId: finalClienteId,
      tipoVenta: computeTipoVenta({
        efectivo: numEfectivo, tarjeta: numTarjeta, transferencia: numTransferencia,
        dolaresLocal: dolaresEnMonedaLocal, credito: tipoPagoPrincipal === 'credito'
      }),
      cambio: Number(cambio),
      ingresoCaja: Number(ingresoRealEnCaja),
      // 👉 bandera para que el POS pregunte si deseas imprimir y abra TicketModal
      shouldPrintNow: shouldPrintNow
    };

    try {
      if (typeof onFinishSale === 'function') {
        await onFinishSale(pagoDetalles); // el padre maneja éxito/alerta/confirmación e impresión
      }
      onClose?.(); // cerrar el modal siempre al terminar
    } catch (err) {
      showAlert?.({ title: 'Error', message: err?.message || 'No se pudo completar la venta.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const alertColor =
    saldoPendienteDePago > 0.01 || !isClientValid ? '#dc3545' : (cambio > 0.01 ? '#28a745' : '#17a2b8');

  const alertMessage =
    !isClientValid && (tipoPagoPrincipal === 'credito' || tipoVentaFinal === 'mixto' || tipoVentaFinal === 'credito_total')
      ? 'CLIENTE NO SELECCIONADO'
      : (saldoPendienteDePago > 0.01
        ? `¡FALTA CUBRIR! C$${saldoPendienteDePago.toFixed(2)}`
        : (cambio > 0.01 ? `CAMBIO A ENTREGAR: C$${cambio.toFixed(2)}` : 'BALANCE PERFECTO'));

  const buttonBgColor = isHovering ? '#28a745' : '#6c757d';
  const buttonBorderColor = isHovering ? '#28a745' : '#6c757d';

  const handleMouseEnter = () => !isButtonDisabled && setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  /* ---- Render ---- */
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
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderBottom: '2px solid #007bff', paddingBottom: 10, marginBottom: 15
          }}
        >
          <h2 style={{ margin: 0, color: '#333', fontSize: '1.3rem' }}>
            <FaCreditCardIcon /> PROCESAR PAGO
          </h2>
          <Button
            $cancel onClick={onClose}
            style={{ borderRadius: '50%', width: 36, height: 36, padding: 0, fontSize: '1.05rem', backgroundColor: '#dc3545', borderColor: '#dc3545' }}
          >
            <FaWindowClose />
          </Button>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '5fr 4fr', gap: '1.5rem', height: 'calc(90vh - 120px)' }}>
          {/* Left */}
          <div style={{ paddingRight: 10, borderRight: '1px solid #dee2e6', overflowY: 'auto', paddingBottom: 10 }}>
            {/* Opciones */}
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
                    opacity: !isClientValid ? 0.6 : 1
                  }}
                >
                  <FaHandshake /> CRÉDITO
                </Button>
              </div>

              {/* Cliente */}
              <label style={{ display: 'block', fontWeight: '700', marginBottom: 6, color: '#007bff' }}>
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
                  <option key={(c.id_cliente ?? c.id)} value={(c.id_cliente ?? c.id)}>
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
                <div>
                  <label style={{ display: 'block', fontWeight: '700', fontSize: '0.85rem', marginBottom: 4 }}>
                    <FaMoneyBillWave /> Efectivo
                  </label>
                  <SearchInput type="number" step="0.01" value={efectivo} onChange={e => setEfectivo(e.target.value)} style={{ height: 34, fontSize: '0.95rem' }} disabled={disableInputs} />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '700', fontSize: '0.85rem', marginBottom: 4 }}>
                    <FaDollarSign /> Dólares (USD)
                  </label>
                  <SearchInput type="number" step="0.01" value={dolares} onChange={e => setDolares(e.target.value)} style={{ height: 34, fontSize: '0.95rem' }} disabled={disableInputs} />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '700', fontSize: '0.85rem', marginBottom: 4 }}>
                    <FaCreditCardIcon /> Tarjeta
                  </label>
                  <SearchInput type="number" step="0.01" value={tarjeta} onChange={e => setTarjeta(e.target.value)} style={{ height: 34, fontSize: '0.95rem' }} disabled={disableInputs} />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '700', fontSize: '0.85rem', marginBottom: 4 }}>
                    <FaExchangeAlt /> Transferencia
                  </label>
                  <SearchInput type="number" step="0.01" value={transferencia} onChange={e => setTransferencia(e.target.value)} style={{ height: 34, fontSize: '0.95rem' }} disabled={disableInputs} />
                </div>
              </div>

              {tipoPagoPrincipal === 'credito' && (
                <div style={{ marginTop: 12 }}>
                  <label style={{ display: 'block', fontWeight: '700', fontSize: '0.85rem', marginBottom: 4, color: '#e65100' }}>
                    <FaMinusCircle /> MONTO A CRÉDITO (Calculado)
                  </label>
                  <SearchInput type="text" value={`C$${credito.toFixed(2)}`} readOnly style={{ height: 34, fontSize: '0.95rem', backgroundColor: '#fff3e0', color: '#e65100', fontWeight: '700' }} />
                  <p style={{ margin: '6px 0 0', fontSize: '0.8rem', textAlign: 'center' }}>
                    Abono: C${pagosContadoTotal.toFixed(2)}. Falta (Crédito): C${credito.toFixed(2)}
                  </p>
                </div>
              )}

              {needsReference && (
                <div style={{ marginTop: 12, padding: 10, border: '1px dashed #ffc107', borderRadius: 6, backgroundColor: '#fffbe6' }}>
                  <label style={{ display: 'block', fontWeight: '700', fontSize: '0.85rem', color: '#856404' }}>
                    <FaHashtag /> Nº de Referencia (Obligatorio)
                  </label>
                  <SearchInput type="text" placeholder="Referencia de pago" value={referenciaTarjeta} onChange={e => setReferenciaTarjeta(e.target.value)} style={{ height: 32, fontSize: '0.9rem' }} />
                </div>
              )}

              {tipoPagoPrincipal === 'contado' ? (
                <Button info onClick={handlePayFullCash} style={{ width: '100%', padding: '10px 0', marginTop: 14, backgroundColor: '#17a2b8', fontSize: '1rem' }}>
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

          {/* Right */}
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
                  marginBottom: 10, padding: 12,
                  backgroundColor: alertColor === '#dc3545' ? '#f8d7da' : (alertColor === '#28a745' ? '#d4edda' : '#cce5ff'),
                  color: alertColor, fontWeight: '700', fontSize: '1.05rem',
                  textAlign: 'center', borderRadius: 8, border: `2px solid ${alertColor}`
                }}
              >
                <FaBalanceScale style={{ marginRight: 8 }} /> {alertMessage}
              </InfoBox>
            </div>

            {/* Acciones */}
            <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
              <Button
                $cancel
                onClick={() => handleFinish(true)}   // shouldPrintNow=true → POS pregunta e imprime
                disabled={isButtonDisabled}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                  flex: 1,
                  padding: '12px 0',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  backgroundColor: isButtonDisabled ? '#adb5bd' : buttonBgColor,
                  color: 'white',
                  transition: 'background-color 0.15s ease-in-out',
                  borderColor: buttonBorderColor
                }}
              >
                <FaCheckCircle /> Pagar
              </Button>
            </div>
          </div>
        </div>
      </ModalContent>
    </ModalOverlay>
  );
};

export default PaymentModal;

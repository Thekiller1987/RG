import React, { useState, useMemo } from 'react';
import { ModalOverlay, ModalContent, Button, SearchInput, TotalsRow } from '../POS.styles';
import { FaLockOpen, FaFileInvoiceDollar, FaRegCreditCard, FaMoneyBillWave, FaExchangeAlt } from 'react-icons/fa';

const CajaModal = ({
    currentUser, isCajaOpen, session, onOpenCaja, onCloseCaja, onAddTransaction,
    onClose, isAdmin, showConfirmation, showAlert, initialTasaDolar
}) => {
    const [montoApertura, setMontoApertura] = useState('');
    const [tasaDolar, setTasaDolar] = useState(initialTasaDolar || 36.60);
    const [montoContado, setMontoContado] = useState('');
    const [viewingReport, setViewingReport] = useState(false);
    const [newTxAmount, setNewTxAmount] = useState('');
    const [newTxNote, setNewTxNote] = useState('');
    const [newTxType, setNewTxType] = useState('entrada');

    const transactions = useMemo(() => Array.isArray(session?.transactions) ? session.transactions : [], [session]);

    const summary = useMemo(() => {
        const cajaInicial = Number(session?.initialAmount || 0);
        
        // 🚨 CORRECCIÓN CLAVE: Calcular el efectivo que realmente ingresó a la caja (cash) 🚨
        const movimientoNetoEfectivo = transactions.reduce((total, tx) => {
            // Las ventas a crédito y los abonos no afectan la caja chica (se manejan en Saldos)
            if (tx.type === 'venta_credito') {
                 return total;
            }
            
            // Para ventas de contado/mixtas y transacciones manuales:
            // El valor 'ingresoCaja' DEBE contener solo el efectivo (efectivo - cambio + entradas/salidas manuales).
            // El pagoDetalles.ingresoCaja ya debe excluir tarjeta/transferencia en el POS.
            // Usaremos tx.pagoDetalles?.efectivo para las ventas y tx.pagoDetalles?.ingresoCaja para las manuales/cancelaciones
            
            // Usamos la propiedad 'ingresoCaja' para las transacciones que ya están sumando/restando el neto de efectivo
            return total + Number(tx.pagoDetalles?.ingresoCaja || 0);

        }, 0);

        const efectivoEsperado = cajaInicial + movimientoNetoEfectivo;

        // Resumen de pagos (para el informe, aquí SÍ incluimos todo)
        const ventas = transactions.filter(tx => tx.type && tx.type.startsWith('venta')); 
        
        const totalTarjeta = ventas.reduce((total, tx) => total + Number(tx.pagoDetalles?.tarjeta || 0), 0);
        const totalTransferencia = ventas.reduce((total, tx) => total + Number(tx.pagoDetalles?.transferencia || 0), 0);
        const totalCredito = ventas.reduce((total, tx) => total + Number(tx.pagoDetalles?.credito || 0), 0);
        // El total no efectivo es la suma de Tarjeta, Transferencia y Crédito
        const totalNoEfectivo = totalTarjeta + totalTransferencia + totalCredito;


        return { cajaInicial, movimientoNetoEfectivo, efectivoEsperado, totalTarjeta, totalCredito, totalTransferencia, totalNoEfectivo };
    }, [transactions, session]);

    const diferencia = (Number(montoContado || 0) - summary.efectivoEsperado);

    const handleOpen = () => {
        onOpenCaja(parseFloat(montoApertura || 0), Number(tasaDolar || 36.60));
    };

    const handleAddTx = () => {
        const amt = parseFloat(newTxAmount);
        if (isNaN(amt) || amt <= 0) {
            showAlert({ title: 'Monto inválido', message: 'Ingrese un monto válido mayor que 0.' }); return;
        }
        // Las entradas/salidas manuales afectan DIRECTAMENTE el efectivo
        const ingresoCaja = newTxType === 'entrada' ? amt : -amt; 
        onAddTransaction({
            id: `manual-${Date.now()}`,
            type: newTxType,
            amount: amt,
            note: newTxNote || (newTxType === 'entrada' ? 'Entrada manual' : 'Salida manual'),
            at: new Date().toISOString(),
            pagoDetalles: { ingresoCaja }, // Se usa ingresoCaja para el arqueo
            manual: true,
        });
        setNewTxAmount(''); setNewTxNote('');
    };

    const handlePrepareClose = () => {
        if (isNaN(parseFloat(montoContado))) {
            showAlert({ title: 'Dato requerido', message: 'Ingrese el monto contado para generar el arqueo.' });
            return;
        }
        setViewingReport(true);
    };

    const handleConfirmClose = () => {
        const proceedClose = () => onCloseCaja(Number(montoContado));
        if (Math.abs(diferencia) > 0.01) {
            showConfirmation({
                title: 'Diferencia en Arqueo',
                message: `Hay una diferencia de C$${diferencia.toFixed(2)}. ¿Cerrar caja de todos modos?`,
                onConfirm: proceedClose
            });
        } else {
            proceedClose();
        }
    };
    
    return (
        <ModalOverlay>
            <ModalContent style={{ maxWidth: 700 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h2 style={{ margin: 0 }}>Gestión de Caja</h2>
                    <Button $cancel onClick={onClose} style={{ borderRadius: '50%', width: '30px', height: '30px', padding: 0 }}>✕</Button>
                </div>
                
                {!isCajaOpen ? (
                    <>
                        <h3 style={{ color: '#28a745', marginTop: '1rem', borderBottom: '2px solid #28a745', paddingBottom: '10px' }}><FaLockOpen /> Abrir Caja</h3>
                        <label style={{ display: 'block', fontWeight: 600, marginTop: 12 }}>Monto Inicial de Caja (C$)</label>
                        <SearchInput type="number" step="0.01" placeholder="Ej: 100.00" value={montoApertura} onChange={e => setMontoApertura(e.target.value)} autoFocus/>
                        <label style={{ display: 'block', fontWeight: 600, marginTop: 12 }}>Tasa del Dólar para Hoy</label>
                        <SearchInput type="number" step="0.01" value={tasaDolar} onChange={e => setTasaDolar(e.target.value)} />
                        <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
                            <Button primary onClick={handleOpen} style={{ flex: 1, padding: '10px' }}>Abrir Caja</Button>
                        </div>
                    </>
                ) : viewingReport ? (
                    <>
                        <h3 style={{ color: '#007bff', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}><FaFileInvoiceDollar /> Reporte de Arqueo</h3>
                        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', backgroundColor: '#f9f9f9' }}>
                            <TotalsRow>
                                <span><FaMoneyBillWave /> Fondo Inicial:</span>
                                <span>C${summary.cajaInicial.toFixed(2)}</span>
                            </TotalsRow>
                            <TotalsRow>
                                <span>Movimiento Neto Efectivo:</span>
                                <span>C${summary.movimientoNetoEfectivo.toFixed(2)}</span>
                            </TotalsRow>
                            <hr style={{margin: '0.5rem 0', border: 'none', borderTop: '2px dashed #ccc'}}/>
                            <TotalsRow $bold>
                                <span>Efectivo Esperado:</span>
                                <span>C${summary.efectivoEsperado.toFixed(2)}</span>
                            </TotalsRow>
                            <TotalsRow>
                                <span>Monto Físico Contado:</span>
                                <span>C${Number(montoContado).toFixed(2)}</span>
                            </TotalsRow>
                            <TotalsRow $bold style={{ color: diferencia !== 0 ? '#dc3545' : '#28a745', fontSize: '1.2rem', padding: '0.5rem', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
                                <span>DIFERENCIA:</span>
                                <span>C${diferencia.toFixed(2)}</span>
                            </TotalsRow>
                             <hr style={{margin: '0.5rem 0', border: 'none', borderTop: '1px solid #eee'}}/>
                             <p style={{fontWeight: 'bold', color: '#6c757d', margin: '0.5rem 0 0'}}>Resumen de Ingresos (No Efectivo):</p>
                             <TotalsRow>
                                <span><FaRegCreditCard /> Total Tarjeta:</span>
                                <span>C${summary.totalTarjeta.toFixed(2)}</span>
                            </TotalsRow>
                             <TotalsRow>
                                <span><FaExchangeAlt /> Total Transferencia:</span>
                                <span>C${summary.totalTransferencia.toFixed(2)}</span>
                            </TotalsRow>
                            <TotalsRow style={{ color: summary.totalCredito > 0 ? '#dc3545' : 'inherit' }}>
                                <span>Total al Crédito:</span>
                                <span>C${summary.totalCredito.toFixed(2)}</span>
                            </TotalsRow>
                            <TotalsRow $bold>
                                <span>Total No Efectivo:</span>
                                <span>C${summary.totalNoEfectivo.toFixed(2)}</span>
                            </TotalsRow>
                        </div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                            <Button primary onClick={handleConfirmClose} style={{flex: 1}} disabled={!isAdmin}>Confirmar y Cerrar Caja</Button>
                            <Button onClick={() => setViewingReport(false)} style={{flex: 0.5}}>Volver</Button>
                        </div>
                        {!isAdmin && <p style={{color: '#dc3545', marginTop: 8, textAlign: 'center', fontSize: '0.9rem'}}>Solo un Administrador puede cerrar la caja.</p>}
                    </>
                ) : (
                    <>
                        <h3 style={{ color: '#dc3545', borderBottom: '2px solid #dc3545', paddingBottom: '10px' }}>Arqueo y Cierre de Caja</h3>
                        <TotalsRow $bold style={{ backgroundColor: '#fff3cd', padding: '10px', borderRadius: '4px' }}>
                            <span><FaMoneyBillWave /> Efectivo Esperado:</span>
                            <span>C${summary.efectivoEsperado.toFixed(2)}</span>
                        </TotalsRow>
                        <label style={{ display: 'block', marginTop: 12, fontWeight: 600 }}>Monto Contado Físico (C$)</label>
                        <SearchInput type="number" step="0.01" placeholder="Ingrese el total contado" value={montoContado} onChange={e => setMontoContado(e.target.value)} />
                        {montoContado && <TotalsRow $bold style={{color: diferencia !== 0 ? '#dc3545' : '#28a745', fontSize: '1.1rem'}}><span>Diferencia:</span><span>C${diferencia.toFixed(2)}</span></TotalsRow>}

                        <hr style={{ margin: '1.5rem 0', border: 'none', borderTop: '1px solid #ccc' }} />
                        <h4>Registrar Entrada / Salida Manual</h4>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
                            <select value={newTxType} onChange={e => setNewTxType(e.target.value)} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', flexShrink: 0 }}>
                                <option value="entrada">Entrada</option><option value="salida">Salida</option>
                            </select>
                            <SearchInput type="number" step="0.01" placeholder="Monto" value={newTxAmount} onChange={e => setNewTxAmount(e.target.value)} style={{flex: 1}}/>
                            <SearchInput placeholder="Nota (opcional)" value={newTxNote} onChange={e => setNewTxNote(e.target.value)} style={{flex: 2}}/>
                            <Button onClick={handleAddTx} style={{ flexShrink: 0, backgroundColor: '#007bff', color: 'white' }}>Agregar</Button>
                        </div>

                        <div style={{ display: 'flex', gap: 8, marginTop: '2rem' }}>
                            <Button primary onClick={handlePrepareClose} disabled={!isAdmin} style={{flex: 1, padding: '12px'}}>Generar Reporte y Cerrar</Button>
                        </div>
                    </>
                )}
            </ModalContent>
        </ModalOverlay>
    );
};

export default CajaModal;

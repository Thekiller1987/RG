import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { ModalOverlay, ModalContent, Button, SearchInput, TotalsRow } from '../POS.styles.jsx';
import { FaUserSecret, FaMask, FaMagic } from 'react-icons/fa';

const AdjustRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 6px;
  
  label { font-weight: bold; color: #495057; }
  input { width: 120px; text-align: right; }
`;

const SecretAdjustModal = ({ isOpen, onClose, currentStats, onConfirm }) => {
    const [mode, setMode] = useState('manual'); // 'manual' | 'override'
    const [adjustments, setAdjustments] = useState({
        efectivo: '',
        credito: '',
        tarjeta: '',
        dolares: '',
        ventas_totales: ''
    });

    // Override Mode States
    const [override, setOverride] = useState({
        cordobas: '',
        dolares: '',
        ventas_totales: ''
    });

    const handleChange = (field, val) => {
        setAdjustments(prev => {
            const next = { ...prev, [field]: val };
            if (field === 'efectivo' || field === 'credito' || field === 'tarjeta') {
                const efec = parseFloat(field === 'efectivo' ? val : next.efectivo) || 0;
                const cred = parseFloat(field === 'credito' ? val : next.credito) || 0;
                const tarj = parseFloat(field === 'tarjeta' ? val : next.tarjeta) || 0;
                const sum = efec + cred + tarj;
                next.ventas_totales = sum !== 0 ? String(Number(sum.toFixed(2))) : '';
            } else if (field === 'ventas_totales') {
                const vt = parseFloat(val);
                const cred = parseFloat(next.credito) || 0;
                const tarj = parseFloat(next.tarjeta) || 0;
                if (!isNaN(vt)) {
                    const efec = vt - cred - tarj;
                    next.efectivo = String(Number(efec.toFixed(2)));
                } else if (val === '') {
                    next.efectivo = '';
                }
            }
            return next;
        });
    };

    const handleOverrideChange = (field, val) => {
        const currentC = Number(currentStats?.efectivoEsperadoCordobas !== undefined 
            ? currentStats.efectivoEsperadoCordobas 
            : (Number(currentStats?.cajaInicial || 0) + Number(currentStats?.netCordobas || 0)));
        const currentVT = Number(currentStats?.totalVentasDia || 0);

        setOverride(prev => {
            const next = { ...prev, [field]: val };
            if (field === 'cordobas') {
                const parsedC = parseFloat(val);
                if (!isNaN(parsedC)) {
                    const diffC = parsedC - currentC;
                    next.ventas_totales = String(Math.max(0, Number((currentVT + diffC).toFixed(2))));
                } else if (val === '') {
                    next.ventas_totales = '';
                }
            } else if (field === 'ventas_totales') {
                const parsedVT = parseFloat(val);
                if (!isNaN(parsedVT)) {
                    const diffVT = parsedVT - currentVT;
                    next.cordobas = String(Math.max(0, Number((currentC + diffVT).toFixed(2))));
                } else if (val === '') {
                    next.cordobas = '';
                }
            }
            return next;
        });
    };

    const handleSave = () => {
        const activeAdjustments = [];

        if (mode === 'manual') {
            let efec = parseFloat(adjustments.efectivo) || 0;
            const cred = parseFloat(adjustments.credito) || 0;
            const tarj = parseFloat(adjustments.tarjeta) || 0;
            const vt = parseFloat(adjustments.ventas_totales);

            // Si el usuario modificó Ventas Totales manualmente con una diferencia adicional,
            // aplicarla directamente a Efectivo para que Caja POS y Gestión de Cajas cuadren 100%
            if (!isNaN(vt) && vt !== 0) {
                const methodSum = efec + cred + tarj;
                const extraVT = vt - methodSum;
                if (Math.abs(extraVT) > 0.01) {
                    efec += extraVT;
                }
            }

            if (Math.abs(efec) > 0.01) activeAdjustments.push({ target: 'efectivo', amount: Number(efec.toFixed(2)) });
            if (Math.abs(cred) > 0.01) activeAdjustments.push({ target: 'credito', amount: Number(cred.toFixed(2)) });
            if (Math.abs(tarj) > 0.01) activeAdjustments.push({ target: 'tarjeta', amount: Number(tarj.toFixed(2)) });
        } else {
            // OVERRIDE MODE (Magic Fix)
            const targetC = parseFloat(override.cordobas);
            const targetD = parseFloat(override.dolares);
            const targetVT = parseFloat(override.ventas_totales);

            const currentC = Number(currentStats?.efectivoEsperadoCordobas !== undefined 
                ? currentStats.efectivoEsperadoCordobas 
                : (Number(currentStats?.cajaInicial || 0) + Number(currentStats?.netCordobas || 0)));
            const currentVT = Number(currentStats?.totalVentasDia || 0);

            if (!isNaN(targetC)) {
                const diffC = targetC - currentC;
                if (Math.abs(diffC) > 0.01) {
                    activeAdjustments.push({ target: 'efectivo', amount: Number(diffC.toFixed(2)) });
                }
            } else if (!isNaN(targetVT)) {
                const diffVT = targetVT - currentVT;
                if (Math.abs(diffVT) > 0.01) {
                    activeAdjustments.push({ target: 'efectivo', amount: Number(diffVT.toFixed(2)) });
                }
            }

            if (!isNaN(targetD)) {
                const currentD = Number(currentStats?.netDolares || 0);
                const diffD = targetD - currentD;
                if (Math.abs(diffD) > 0.01) {
                    activeAdjustments.push({ target: 'dolares', amount: Number(diffD.toFixed(2)) });
                }
            }
        }

        if (activeAdjustments.length > 0) {
            onConfirm(activeAdjustments);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <ModalOverlay style={{ background: 'rgba(0,0,0,0.95)', zIndex: 9999 }}>
            <ModalContent style={{ maxWidth: '450px', background: '#212529', color: '#fff', border: '1px solid #495057', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h2 style={{ margin: 0, color: '#ffc107', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <FaUserSecret /> GOD MODE
                    </h2>
                    <Button $cancel onClick={onClose} style={{ background: 'transparent', color: '#6c757d', border: 'none' }}>✕</Button>
                </div>

                <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                    <Button
                        onClick={() => setMode('manual')}
                        style={{ flex: 1, background: mode === 'manual' ? '#ffc107' : '#343a40', color: mode === 'manual' ? '#000' : '#fff', border: 'none' }}
                    >
                        Ajuste Manual (+/-)
                    </Button>
                    <Button
                        onClick={() => setMode('override')}
                        style={{ flex: 1, background: mode === 'override' ? '#ffc107' : '#343a40', color: mode === 'override' ? '#000' : '#fff', border: 'none' }}
                    >
                        Fijar Monto (=)
                    </Button>
                </div>

                {mode === 'manual' ? (
                    <>
                        <p style={{ color: '#adb5bd', fontSize: '0.85rem', marginBottom: 15 }}>
                            Suma o resta cantidades a los contadores ocultamente.
                        </p>
                        <AdjustRow style={{ background: '#343a40' }}>
                            <label style={{ color: '#fff' }}>Efectivo (C$)</label>
                            <SearchInput type="number" step="0.01" placeholder="+/- 0.00" value={adjustments.efectivo} onChange={e => handleChange('efectivo', e.target.value)} style={{ background: '#495057', color: '#fff' }} />
                        </AdjustRow>
                        <AdjustRow style={{ background: '#343a40' }}>
                            <label style={{ color: '#fff' }}>Crédito</label>
                            <SearchInput type="number" step="0.01" placeholder="+/- 0.00" value={adjustments.credito} onChange={e => handleChange('credito', e.target.value)} style={{ background: '#495057', color: '#fff' }} />
                        </AdjustRow>
                        <AdjustRow style={{ background: '#343a40' }}>
                            <label style={{ color: '#fff' }}>Tarjeta</label>
                            <SearchInput type="number" step="0.01" placeholder="+/- 0.00" value={adjustments.tarjeta} onChange={e => handleChange('tarjeta', e.target.value)} style={{ background: '#495057', color: '#fff' }} />
                        </AdjustRow>
                        <AdjustRow style={{ background: '#2a1a00', border: '1px solid #ffc107' }}>
                            <label style={{ color: '#ffc107' }}>Ventas Totales</label>
                            <SearchInput type="number" step="0.01" placeholder="+/- 0.00" value={adjustments.ventas_totales} onChange={e => handleChange('ventas_totales', e.target.value)} style={{ background: '#495057', color: '#ffc107', border: '1px solid #ffc107' }} />
                        </AdjustRow>
                    </>
                ) : (
                    <>
                        <p style={{ color: '#adb5bd', fontSize: '0.85rem', marginBottom: 15 }}>
                            Define EXACTAMENTE cuánto dinero físico hay. El sistema creará un ajuste mágico para cuadrar.
                        </p>
                        <div style={{ background: '#343a40', padding: 10, borderRadius: 6, marginBottom: 10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#aaa', marginBottom: 5 }}>
                                <span>Sistema Actual (Total en Cajón):</span>
                                <span>C$ {Number(currentStats?.efectivoEsperadoCordobas !== undefined ? currentStats.efectivoEsperadoCordobas : (Number(currentStats?.cajaInicial || 0) + Number(currentStats?.netCordobas || 0))).toFixed(2)}</span>
                            </div>
                            <AdjustRow style={{ background: 'transparent', padding: 0, marginBottom: 0 }}>
                                <label style={{ color: '#fff' }}>Real en Caja (C$)</label>
                                <SearchInput type="number" step="0.01" placeholder="0.00" value={override.cordobas} onChange={e => handleOverrideChange('cordobas', e.target.value)} style={{ background: '#495057', color: '#fff', border: '1px solid #ffc107' }} />
                            </AdjustRow>
                        </div>

                        <div style={{ background: '#343a40', padding: 10, borderRadius: 6 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#aaa', marginBottom: 5 }}>
                                <span>Sistema Actual:</span>
                                <span>$ {Number(currentStats?.netDolares || 0).toFixed(2)}</span>
                            </div>
                            <AdjustRow style={{ background: 'transparent', padding: 0, marginBottom: 0 }}>
                                <label style={{ color: '#fff' }}>Real en Caja ($)</label>
                                <SearchInput type="number" step="0.01" placeholder="0.00" value={override.dolares} onChange={e => handleOverrideChange('dolares', e.target.value)} style={{ background: '#495057', color: '#fff', border: '1px solid #ffc107' }} />
                            </AdjustRow>
                        </div>

                        <div style={{ background: '#2a1a00', padding: 10, borderRadius: 6, border: '1px solid #ffc107', marginTop: 10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#ffc107', marginBottom: 5 }}>
                                <span>Sistema Actual:</span>
                                <span>C$ {Number(currentStats?.totalVentasDia || 0).toFixed(2)}</span>
                            </div>
                            <AdjustRow style={{ background: 'transparent', padding: 0, marginBottom: 0 }}>
                                <label style={{ color: '#ffc107' }}>Ventas Totales (C$)</label>
                                <SearchInput type="number" step="0.01" placeholder="0.00" value={override.ventas_totales} onChange={e => handleOverrideChange('ventas_totales', e.target.value)} style={{ background: '#495057', color: '#ffc107', border: '1px solid #ffc107' }} />
                            </AdjustRow>
                        </div>
                    </>
                )}

                <div style={{ marginTop: 25, display: 'flex', gap: 10 }}>
                    <Button onClick={onClose} style={{ flex: 1, background: '#495057', border: 'none' }}>Cancelar</Button>
                    <Button onClick={handleSave} style={{ flex: 1, background: '#ffc107', color: '#000', fontWeight: 'bold', border: 'none' }}>
                        <FaMagic style={{ marginRight: 6 }} /> {mode === 'manual' ? 'APLICAR AJUSTE' : 'CUADRAR MÁGICAMENTE'}
                    </Button>
                </div>

            </ModalContent>
        </ModalOverlay>
    );
};

export default SecretAdjustModal;

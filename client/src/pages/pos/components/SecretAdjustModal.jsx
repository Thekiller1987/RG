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

const SecretAdjustModal = ({ isOpen, onClose, session, onConfirm }) => {
    const [adjustments, setAdjustments] = useState({
        efectivo: '',
        credito: '',
        tarjeta: ''
    });

    const handleChange = (field, val) => {
        setAdjustments(prev => ({ ...prev, [field]: val }));
    };

    const handleSave = () => {
        // Solo enviar los que tengan valor
        const activeAdjustments = [];

        if (parseFloat(adjustments.efectivo)) {
            activeAdjustments.push({ target: 'efectivo', amount: parseFloat(adjustments.efectivo) });
        }
        if (parseFloat(adjustments.credito)) {
            activeAdjustments.push({ target: 'credito', amount: parseFloat(adjustments.credito) });
        }
        if (parseFloat(adjustments.tarjeta)) {
            activeAdjustments.push({ target: 'tarjeta', amount: parseFloat(adjustments.tarjeta) });
        }

        if (activeAdjustments.length > 0) {
            onConfirm(activeAdjustments);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <ModalOverlay style={{ background: 'rgba(0,0,0,0.85)' }}>
            <ModalContent style={{ maxWidth: '400px', background: '#212529', color: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h2 style={{ margin: 0, color: '#ffc107', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <FaUserSecret /> AJUSTES INTERNOS
                    </h2>
                    <Button $cancel onClick={onClose} style={{ background: 'transparent', color: '#6c757d', border: 'none' }}>✕</Button>
                </div>

                <p style={{ color: '#adb5bd', fontSize: '0.9rem', marginBottom: 20 }}>
                    Modifica los contadores internos. Estos ajustes afectarán el resultado final pero serán invisibles en los reportes.
                </p>

                <AdjustRow style={{ background: '#343a40' }}>
                    <label style={{ color: '#fff' }}>Efectivo Esperado</label>
                    <SearchInput
                        type="number" step="0.01"
                        placeholder="+/- 0.00"
                        value={adjustments.efectivo}
                        onChange={e => handleChange('efectivo', e.target.value)}
                        style={{ background: '#495057', color: '#fff', border: '1px solid #6c757d' }}
                    />
                </AdjustRow>

                <AdjustRow style={{ background: '#343a40' }}>
                    <label style={{ color: '#fff' }}>Total Crédito</label>
                    <SearchInput
                        type="number" step="0.01"
                        placeholder="+/- 0.00"
                        value={adjustments.credito}
                        onChange={e => handleChange('credito', e.target.value)}
                        style={{ background: '#495057', color: '#fff', border: '1px solid #6c757d' }}
                    />
                </AdjustRow>

                <AdjustRow style={{ background: '#343a40' }}>
                    <label style={{ color: '#fff' }}>Total Tarjeta</label>
                    <SearchInput
                        type="number" step="0.01"
                        placeholder="+/- 0.00"
                        value={adjustments.tarjeta}
                        onChange={e => handleChange('tarjeta', e.target.value)}
                        style={{ background: '#495057', color: '#fff', border: '1px solid #6c757d' }}
                    />
                </AdjustRow>

                <div style={{ marginTop: 25, display: 'flex', gap: 10 }}>
                    <Button onClick={onClose} style={{ flex: 1, background: '#495057', border: 'none' }}>Cancelar</Button>
                    <Button onClick={handleSave} style={{ flex: 1, background: '#ffc107', color: '#000', fontWeight: 'bold', border: 'none' }}>
                        <FaMagic style={{ marginRight: 6 }} /> APLICAR
                    </Button>
                </div>

            </ModalContent>
        </ModalOverlay>
    );
};

export default SecretAdjustModal;

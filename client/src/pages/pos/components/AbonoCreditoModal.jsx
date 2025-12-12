// El nombre del archivo es: AbonoCreditoModal.jsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { FaTimes, FaSave, FaSpinner, FaMoneyBillWave, FaCreditCard } from 'react-icons/fa';
import * as api from '../../../service/api'; // Revisa que la ruta sea correcta
import { useAuth } from '../../../context/AuthContext.jsx'; // Revisa que la ruta sea correcta

// ===================== Styled Components (Sin cambios, pero incluidos para integridad) =====================
const ModalOverlay = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1050;
  backdrop-filter: blur(5px);
`;

const ModalContainer = styled.div`
  background: white; padding: 2rem; border-radius: 8px; width: 450px; max-width: 90%;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
`;

const Header = styled.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;
  border-bottom: 1px solid #e9ecef; padding-bottom: 1rem;
`;

const Title = styled.h2`margin: 0; font-size: 1.5rem; color: #333;`;

const CloseButton = styled.button`
  border: none; background: none; font-size: 1.5rem; cursor: pointer; color: #888; 
  &:hover { color: #333; }
`;

const Form = styled.form`display: flex; flex-direction: column; gap: 1.25rem;`;

const InputGroup = styled.div`
  display: flex; flex-direction: column; gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600; color: #495057; font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.75rem; border: 1px solid #ccc; border-radius: 6px; font-size: 1rem;
  &:focus { border-color: #007bff; outline: none; box-shadow: 0 0 0 2px rgba(0,123,255,0.25); }
`;

const Select = styled(Input).attrs({ as: 'select' })``;

const Button = styled.button`
  padding: 0.85rem 1.5rem; background: #28a745; color: white; border: none;
  border-radius: 6px; font-weight: bold; display: flex; align-items: center; gap: 0.5rem;
  justify-content: center; cursor: pointer; transition: background-color 0.2s; font-size: 1rem;
  &:hover:not(:disabled) { background: #218838; }
  &:disabled { background: #6c757d; cursor: not-allowed; }
`;

const InfoText = styled.p`
  margin: 0 0 1rem 0; padding: 0.75rem; background-color: #e9ecef; border-radius: 6px;
  color: #495057; text-align: center; font-size: 1rem;
  strong { color: #dc3545; }
`;

const ErrorText = styled.p`
  margin-top: -1rem; margin-bottom: 0.5rem; padding: 0.5rem; color: #dc3545; font-size: 0.9rem; text-align: center;
`;

const SpinAnimation = styled(FaSpinner)`
  animation: spin 1s linear infinite;
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;

// ===================== Utilidades =====================
/** Función pura para formatear moneda. Se saca del componente para no redeclararla. */
const formatCurrency = (amount) => `C$${Number(amount || 0).toFixed(2)}`;

// ===================== Componente Principal Optimizado =====================
const AbonoCreditoModal = ({ client, onClose, onAbonoSuccess, showAlert }) => {
  const { addCajaTransaction, user } = useAuth();

  const [monto, setMonto] = useState('');
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMonto, setErrorMonto] = useState('');

  // Usamos useMemo para evitar recalcular esto en cada render si el cliente no cambia.
  const saldoPendiente = useMemo(() => Number(client?.saldo_pendiente) || 0, [client]);

  // useEffect para la validación del monto
  useEffect(() => {
    if (!monto) {
      setErrorMonto('');
      return;
    }
    const montoNum = parseFloat(monto);
    if (isNaN(montoNum) || montoNum <= 0) {
      setErrorMonto('Ingrese un monto válido mayor a cero.');
    } else if (montoNum > saldoPendiente) {
      setErrorMonto('El monto no puede superar el saldo pendiente.');
    } else {
      setErrorMonto('');
    }
  }, [monto, saldoPendiente]);

  // useCallback para memoizar la función de envío y evitar que se recree.
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const montoNum = parseFloat(monto);
    const token = localStorage.getItem('token'); // Se obtiene justo cuando se necesita

    if (errorMonto || !montoNum || montoNum <= 0) {
      showAlert({ title: "Monto Inválido", message: errorMonto || "Revise el monto ingresado." });
      return;
    }

    setIsLoading(true);
    try {
      // 1. Registrar el pago en el backend
      await api.addCreditPayment(client.id_cliente, {
        monto: montoNum,
        pagoDetalles: { metodo: metodoPago, usuario: user?.nombre_usuario || 'Desconocido' }
      }, token);

      // 2. Registrar la transacción en la caja local (si es un ingreso)
      const esIngresoEnCaja = metodoPago === 'Efectivo';
      const txCaja = {
        id: `abono-${Date.now()}`,
        type: 'abono',
        amount: montoNum,
        note: `Abono Cliente #${client.id_cliente} (${metodoPago})`,
        at: new Date().toISOString(),
        pagoDetalles: {
          ingresoCaja: esIngresoEnCaja ? montoNum : 0,
          tarjeta: metodoPago === 'Tarjeta' ? montoNum : 0,
          transferencia: metodoPago === 'Transferencia' ? montoNum : 0,
          credito: 0
        }
      };

      addCajaTransaction(txCaja);

      // PERSISTIR EN SERVIDOR (Crucial)
      if (token) {
        try {
          await api.addCajaTx({ userId: user?.id_usuario || user?.id, tx: txCaja }, token);
        } catch (e) { console.error("Error persistiendo caja", e); }
      }

      onAbonoSuccess?.(txCaja);
      onClose?.();

      onAbonoSuccess?.();
      onClose?.();

    } catch (err) {
      console.error("Error al registrar abono:", err);
      showAlert({ title: "Error", message: `No se pudo registrar el abono. ${err.message}` });
    } finally {
      setIsLoading(false);
    }
  }, [monto, metodoPago, errorMonto, saldoPendiente, client, user, addCajaTransaction, onAbonoSuccess, onClose, showAlert]);

  const isSubmitDisabled = isLoading || saldoPendiente <= 0 || !!errorMonto || !monto;

  return (
    <ModalOverlay>
      <ModalContainer>
        <Header>
          <Title>Registrar Abono</Title>
          <CloseButton onClick={onClose} disabled={isLoading}><FaTimes /></CloseButton>
        </Header>

        <p>Cliente: <strong>{client?.nombre || 'Desconocido'}</strong></p>
        <InfoText>
          Saldo Pendiente: <strong>{formatCurrency(saldoPendiente)}</strong>
        </InfoText>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="montoAbono">Monto a Abonar (C$)</Label>
            <Input
              id="montoAbono"
              type="number"
              value={monto}
              onChange={e => setMonto(e.target.value)}
              placeholder="0.00"
              required
              autoFocus
              step="0.01"
              min="0.01"
              max={saldoPendiente ? saldoPendiente.toFixed(2) : undefined}
              disabled={isLoading || saldoPendiente <= 0}
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="metodoPago">Método de Pago</Label>
            <Select
              id="metodoPago"
              value={metodoPago}
              onChange={e => setMetodoPago(e.target.value)}
              disabled={isLoading}
            >
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Transferencia">Transferencia</option>
            </Select>
          </InputGroup>

          {errorMonto && <ErrorText>{errorMonto}</ErrorText>}

          <Button type="submit" disabled={isSubmitDisabled}>
            {isLoading ? <><SpinAnimation /> Procesando...</> : <><FaSave /> Registrar Abono</>}
          </Button>
        </Form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default React.memo(AbonoCreditoModal);
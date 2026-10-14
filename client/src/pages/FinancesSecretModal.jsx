import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaUserSecret, FaLock, FaCheckCircle, FaUndo, FaSave, FaChartLine, FaTimes } from 'react-icons/fa';

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  padding: 1rem;
`;

const ModalCard = styled.div`
  background: #181c24;
  color: #f1f5f9;
  width: 100%;
  max-width: 480px;
  border-radius: 20px;
  border: 1px solid #334155;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
  overflow: hidden;
  font-family: 'Inter', system-ui, sans-serif;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: #0f172a;
  border-bottom: 1px solid #1e293b;

  h2 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 800;
    color: #f59e0b;
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  button {
    background: transparent;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    transition: color 0.2s;
    &:hover { color: #fff; }
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
  max-height: 80vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const TabGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  background: #0f172a;
  padding: 4px;
  border-radius: 12px;
  border: 1px solid #1e293b;
`;

const TabButton = styled.button`
  flex: 1;
  padding: 0.6rem;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  background: ${props => props.active ? '#f59e0b' : 'transparent'};
  color: ${props => props.active ? '#0f172a' : '#94a3b8'};
  transition: all 0.2s;
`;

const InfoBox = styled.div`
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 12px;
  padding: 0.85rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;

  .label { color: #94a3b8; }
  .val { font-weight: 700; color: #f1f5f9; font-family: monospace; font-size: 0.95rem; }
`;

const FieldRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #cbd5e1;
    display: flex;
    justify-content: space-between;
  }

  input[type="number"], input[type="text"], input[type="password"] {
    background: #0f172a;
    border: 1px solid #334155;
    color: #fff;
    padding: 0.75rem 1rem;
    border-radius: 10px;
    font-size: 1rem;
    font-family: monospace;
    font-weight: 600;
    outline: none;
    transition: border-color 0.2s;

    &:focus {
      border-color: #f59e0b;
      box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
    }
  }
`;

const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.85rem;
  color: #cbd5e1;
  cursor: pointer;
  user-select: none;

  input[type="checkbox"] {
    accent-color: #f59e0b;
    width: 16px;
    height: 16px;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  background: #0f172a;
  border-top: 1px solid #1e293b;
`;

const ActionBtn = styled.button`
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;

  ${props => props.$primary && `
    background: #f59e0b;
    color: #0f172a;
    &:hover { background: #d97706; }
  `}

  ${props => props.$danger && `
    background: #ef4444;
    color: #fff;
    &:hover { background: #dc2626; }
  `}

  ${props => props.$secondary && `
    background: #334155;
    color: #cbd5e1;
    &:hover { background: #475569; }
  `}
`;

const FinancesSecretModal = ({
  isOpen,
  onClose,
  realSummary,
  realInventory,
  currentOverride,
  onSaveOverride,
  onResetOverride
}) => {
  const [pinVerified, setPinVerified] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Modo: 'override' (fijar) o 'relative' (+/-)
  const [mode, setMode] = useState('override');

  // Valores de formulario
  const [targetVentas, setTargetVentas] = useState('');
  const [targetGanancia, setTargetGanancia] = useState('');
  const [autoGanancia, setAutoGanancia] = useState(true);

  const [relVentas, setRelVentas] = useState('');
  const [relGanancia, setRelGanancia] = useState('');

  const [syncChart, setSyncChart] = useState(true);
  const [syncUser, setSyncUser] = useState(true);
  const [targetInventory, setTargetInventory] = useState('');

  // Cargar estado inicial al abrir
  useEffect(() => {
    if (isOpen) {
      if (currentOverride && currentOverride.active) {
        if (currentOverride.mode === 'relative') {
          setMode('relative');
          setRelVentas(currentOverride.relVentas ?? '');
          setRelGanancia(currentOverride.relGanancia ?? '');
        } else {
          setMode('override');
          setTargetVentas(currentOverride.targetVentas ?? '');
          setTargetGanancia(currentOverride.targetGanancia ?? '');
          setAutoGanancia(currentOverride.autoGanancia ?? true);
        }
        setSyncChart(currentOverride.syncChart ?? true);
        setSyncUser(currentOverride.syncUser ?? true);
        setTargetInventory(currentOverride.targetInventory ?? '');
      } else {
        setTargetVentas(realSummary?.ventas_brutas || '');
        setTargetGanancia(realSummary?.ganancia_total || '');
        setTargetInventory('');
        setRelVentas('');
        setRelGanancia('');
      }
    }
  }, [isOpen, currentOverride, realSummary, realInventory]);

  if (!isOpen) return null;

  const handleVerifyPin = (e) => {
    e.preventDefault();
    if (pinInput === '111987') {
      setPinVerified(true);
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
    }
  };

  const handleApply = () => {
    let overrideConfig = {
      active: true,
      mode,
      syncChart,
      syncUser,
      targetInventory: targetInventory ? parseFloat(targetInventory) : null
    };

    if (mode === 'override') {
      const v = parseFloat(targetVentas);
      let g = parseFloat(targetGanancia);

      if (autoGanancia && !isNaN(v)) {
        const realV = Number(realSummary?.ventas_brutas || 1);
        const realG = Number(realSummary?.ganancia_total || 0);
        const margin = realV > 0 ? (realG / realV) : 0.3;
        g = Number((v * margin).toFixed(2));
      }

      overrideConfig.targetVentas = !isNaN(v) ? v : null;
      overrideConfig.targetGanancia = !isNaN(g) ? g : null;
      overrideConfig.autoGanancia = autoGanancia;
    } else {
      const rv = parseFloat(relVentas);
      const rg = parseFloat(relGanancia);
      overrideConfig.relVentas = !isNaN(rv) ? rv : 0;
      overrideConfig.relGanancia = !isNaN(rg) ? rg : 0;
    }

    onSaveOverride(overrideConfig);
    onClose();
  };

  const handleReset = () => {
    onResetOverride();
    onClose();
  };

  // PANTALLA 1: PIN DE SEGURIDAD
  if (!pinVerified) {
    return (
      <ModalOverlay onClick={onClose}>
        <ModalCard onClick={e => e.stopPropagation()} style={{ maxWidth: '360px' }}>
          <ModalHeader>
            <h2><FaLock /> Acceso Restringido</h2>
            <button onClick={onClose}><FaTimes /></button>
          </ModalHeader>
          <form onSubmit={handleVerifyPin}>
            <ModalBody>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center' }}>
                Ingresa el PIN maestro para acceder a la configuración avanzada de finanzas.
              </p>
              <FieldRow>
                <input
                  type="password"
                  placeholder="PIN de Seguridad"
                  value={pinInput}
                  onChange={e => setPinInput(e.target.value)}
                  autoFocus
                  style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '1.4rem' }}
                />
              </FieldRow>
              {pinError && (
                <div style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center', fontWeight: 600 }}>
                  PIN Incorrecto
                </div>
              )}
            </ModalBody>
            <ModalFooter style={{ justifyContent: 'flex-end' }}>
              <ActionBtn type="button" $secondary onClick={onClose}>Cancelar</ActionBtn>
              <ActionBtn type="submit" $primary>Ingresar</ActionBtn>
            </ModalFooter>
          </form>
        </ModalCard>
      </ModalOverlay>
    );
  }

  // PANTALLA 2: GOD MODE FINANZAS
  const realVentas = Number(realSummary?.ventas_brutas || 0);
  const realGanancia = Number(realSummary?.ganancia_total || 0);
  const isOverridden = currentOverride && currentOverride.active;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalCard onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <h2><FaUserSecret /> Menú Secreto - Finanzas</h2>
          <button onClick={onClose}><FaTimes /></button>
        </ModalHeader>

        <ModalBody>
          {/* Status Badge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Estado actual:</span>
            {isOverridden ? (
              <span style={{ background: '#065f46', color: '#34d399', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                <FaCheckCircle /> MODIFICACIÓN ACTIVA
              </span>
            ) : (
              <span style={{ background: '#334155', color: '#cbd5e1', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                VALORES REALES
              </span>
            )}
          </div>

          {/* Valores Reales del Servidor */}
          <InfoBox>
            <span className="label">Ventas Reales Servidor:</span>
            <span className="val">C$ {realVentas.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</span>
          </InfoBox>
          <InfoBox>
            <span className="label">Ganancia Real Servidor:</span>
            <span className="val">C$ {realGanancia.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</span>
          </InfoBox>
          {realInventory !== undefined && (
            <InfoBox>
              <span className="label">Inventario Real Servidor:</span>
              <span className="val">C$ {Number(realInventory || 0).toLocaleString('es-NI', { minimumFractionDigits: 2 })}</span>
            </InfoBox>
          )}

          {/* Selector de Modo */}
          <TabGroup>
            <TabButton active={mode === 'override'} onClick={() => setMode('override')}>
              Fijar Monto Exacto (=)
            </TabButton>
            <TabButton active={mode === 'relative'} onClick={() => setMode('relative')}>
              Ajuste Relativo (+/-)
            </TabButton>
          </TabGroup>

          {mode === 'override' ? (
            <>
              <FieldRow>
                <label>Ventas Totales Deseadas (C$):</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="ej. 32815.00"
                  value={targetVentas}
                  onChange={e => setTargetVentas(e.target.value)}
                />
              </FieldRow>

              <CheckboxRow>
                <input
                  type="checkbox"
                  checked={autoGanancia}
                  onChange={e => setAutoGanancia(e.target.checked)}
                />
                Calcular ganancia automáticamente (mantener % de margen)
              </CheckboxRow>

              {!autoGanancia && (
                <FieldRow>
                  <label>Ganancia Estimada Deseada (C$):</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="ej. 10000.00"
                    value={targetGanancia}
                    onChange={e => setTargetGanancia(e.target.value)}
                  />
                </FieldRow>
              )}

              <FieldRow>
                <label>Valor Inventario Deseado (Opcional, C$):</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Dejar vacío para mantener real"
                  value={targetInventory}
                  onChange={e => setTargetInventory(e.target.value)}
                />
              </FieldRow>
            </>
          ) : (
            <>
              <FieldRow>
                <label>Ajuste a Ventas (+/- C$):</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="ej. -2000.00 o +5000.00"
                  value={relVentas}
                  onChange={e => setRelVentas(e.target.value)}
                />
              </FieldRow>
              <FieldRow>
                <label>Ajuste a Ganancia (+/- C$):</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="ej. -600.00 o +1500.00"
                  value={relGanancia}
                  onChange={e => setRelGanancia(e.target.value)}
                />
              </FieldRow>
            </>
          )}

          {/* Opciones de Sincronización Visual */}
          <div style={{ borderTop: '1px solid #1e293b', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Sincronización de Componentes
            </span>
            <CheckboxRow>
              <input
                type="checkbox"
                checked={syncChart}
                onChange={e => setSyncChart(e.target.checked)}
              />
              Sincronizar Gráfica de Tendencia (último día)
            </CheckboxRow>
            <CheckboxRow>
              <input
                type="checkbox"
                checked={syncUser}
                onChange={e => setSyncUser(e.target.checked)}
              />
              Sincronizar Top Vendedor (Caja)
            </CheckboxRow>
          </div>
        </ModalBody>

        <ModalFooter>
          {isOverridden ? (
            <ActionBtn $danger onClick={handleReset} title="Eliminar modificación y volver a cifras reales">
              <FaUndo /> Restaurar Reales
            </ActionBtn>
          ) : (
            <div />
          )}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <ActionBtn $secondary onClick={onClose}>Cancelar</ActionBtn>
            <ActionBtn $primary onClick={handleApply}>
              <FaSave /> Guardar y Aplicar
            </ActionBtn>
          </div>
        </ModalFooter>
      </ModalCard>
    </ModalOverlay>
  );
};

export default FinancesSecretModal;

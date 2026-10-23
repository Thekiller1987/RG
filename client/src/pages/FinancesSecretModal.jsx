import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  FaUserSecret, FaLock, FaCheckCircle, FaUndo, FaSave,
  FaChartLine, FaTimes, FaMoneyBillWave, FaWarehouse,
  FaCashRegister, FaStar, FaUserTie, FaEye, FaEyeSlash
} from 'react-icons/fa';

const fadeIn = keyframes`from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); }`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  padding: 1rem;
`;

const ModalCard = styled.div`
  background: #111827;
  color: #f1f5f9;
  width: 100%;
  max-width: 680px;
  border-radius: 24px;
  border: 1px solid #374151;
  box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.8);
  overflow: hidden;
  font-family: 'Inter', system-ui, sans-serif;
  animation: ${fadeIn} 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.75rem;
  background: #0f172a;
  border-bottom: 1px solid #1f2937;

  h2 {
    margin: 0;
    font-size: 1.25rem;
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
  padding: 1.5rem 1.75rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  flex: 1;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #374151;
    border-radius: 9999px;
  }
`;

const TabGroup = styled.div`
  display: flex;
  gap: 0.4rem;
  background: #0b1120;
  padding: 5px;
  border-radius: 14px;
  border: 1px solid #1f2937;
  overflow-x: auto;
`;

const TabButton = styled.button`
  flex: 1;
  min-width: 120px;
  padding: 0.65rem 0.75rem;
  border: none;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  background: ${props => props.$active ? '#f59e0b' : 'transparent'};
  color: ${props => props.$active ? '#0f172a' : '#94a3b8'};
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  white-space: nowrap;

  &:hover {
    color: ${props => props.$active ? '#0f172a' : '#fff'};
  }
`;

const InfoBox = styled.div`
  background: #0b1120;
  border: 1px solid #1f2937;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;

  .label { color: #9ca3af; font-weight: 500; }
  .val { font-weight: 800; color: #f3f4f6; font-family: monospace; font-size: 0.95rem; }
`;

const Grid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FieldRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;

  label {
    font-size: 0.8rem;
    font-weight: 600;
    color: #d1d5db;
    display: flex;
    justify-content: space-between;
  }

  input[type="number"], input[type="text"], input[type="password"] {
    background: #0b1120;
    border: 1px solid #374151;
    color: #fff;
    padding: 0.7rem 0.9rem;
    border-radius: 10px;
    font-size: 0.95rem;
    font-family: monospace;
    font-weight: 600;
    outline: none;
    transition: all 0.2s;

    &:focus {
      border-color: #f59e0b;
      box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.25);
    }
  }
`;

const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.85rem;
  color: #d1d5db;
  cursor: pointer;
  user-select: none;
  padding: 4px 0;

  input[type="checkbox"] {
    accent-color: #f59e0b;
    width: 17px;
    height: 17px;
    cursor: pointer;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1.25rem 1.75rem;
  background: #0f172a;
  border-top: 1px solid #1f2937;
`;

const ActionBtn = styled.button`
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  font-size: 0.88rem;
  font-weight: 800;
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
    background: #dc2626;
    color: #fff;
    &:hover { background: #b91c1c; }
  `}

  ${props => props.$secondary && `
    background: #1f2937;
    color: #e5e7eb;
    &:hover { background: #374151; }
  `}
`;

const FinancesSecretModal = ({
  isOpen,
  onClose,
  realSummary,
  realInventory,
  realTopProducts,
  realSalesByUser,
  currentOverride,
  onSaveOverride,
  onResetOverride
}) => {
  // Autenticación por PIN maestro (se guarda en sesión para comodidad)
  const [pinVerified, setPinVerified] = useState(() => {
    return sessionStorage.getItem('rg_godmode_pin_verified') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Pestañas del GOD MODE
  const [activeTab, setActiveTab] = useState('kpis'); // 'kpis', 'caja', 'top', 'chart'

  // Modo: 'override' (fijar) o 'relative' (+/-)
  const [mode, setMode] = useState('override');

  // --- 1. KPIs Principales ---
  const [targetVentas, setTargetVentas] = useState('');
  const [targetGanancia, setTargetGanancia] = useState('');
  const [autoGanancia, setAutoGanancia] = useState(true);
  const [targetInventory, setTargetInventory] = useState('');
  const [relVentas, setRelVentas] = useState('');
  const [relGanancia, setRelGanancia] = useState('');

  // --- 2. Métricas de Caja & Dinero en Mano (Banner en Vivo) ---
  const [targetEfectivo, setTargetEfectivo] = useState('');
  const [targetEfectivoCordobas, setTargetEfectivoCordobas] = useState('');
  const [targetEfectivoDolares, setTargetEfectivoDolares] = useState('');
  const [targetDigital, setTargetDigital] = useState('');
  const [targetCredito, setTargetCredito] = useState('');
  const [targetAbonos, setTargetAbonos] = useState('');
  const [targetGastos, setTargetGastos] = useState('');
  const [hideLiveBanner, setHideLiveBanner] = useState(false);
  const [forceLiveBanner, setForceLiveBanner] = useState(false);

  // --- 3. Producto Top & Vendedores ---
  const [targetTopProductName, setTargetTopProductName] = useState('');
  const [targetTopProductQty, setTargetTopProductQty] = useState('');
  const [targetTopSellerName, setTargetTopSellerName] = useState('');
  const [targetTopSellerAmount, setTargetTopSellerAmount] = useState('');

  // --- 4. Sincronización de Gráfica ---
  const [syncChart, setSyncChart] = useState(true);
  const [syncUser, setSyncUser] = useState(true);

  // Cargar valores iniciales al abrir
  useEffect(() => {
    if (isOpen) {
      if (currentOverride && currentOverride.active) {
        setMode(currentOverride.mode || 'override');
        setTargetVentas(currentOverride.targetVentas ?? '');
        setTargetGanancia(currentOverride.targetGanancia ?? '');
        setAutoGanancia(currentOverride.autoGanancia ?? true);
        setTargetInventory(currentOverride.targetInventory ?? '');
        setRelVentas(currentOverride.relVentas ?? '');
        setRelGanancia(currentOverride.relGanancia ?? '');

        // Caja
        setTargetEfectivo(currentOverride.targetEfectivo ?? '');
        setTargetEfectivoCordobas(currentOverride.targetEfectivoCordobas ?? '');
        setTargetEfectivoDolares(currentOverride.targetEfectivoDolares ?? '');
        setTargetDigital(currentOverride.targetDigital ?? '');
        setTargetCredito(currentOverride.targetCredito ?? '');
        setTargetAbonos(currentOverride.targetAbonos ?? '');
        setTargetGastos(currentOverride.targetGastos ?? '');
        setHideLiveBanner(currentOverride.hideLiveBanner ?? false);
        setForceLiveBanner(currentOverride.forceLiveBanner ?? false);

        // Top
        setTargetTopProductName(currentOverride.targetTopProductName ?? '');
        setTargetTopProductQty(currentOverride.targetTopProductQty ?? '');
        setTargetTopSellerName(currentOverride.targetTopSellerName ?? '');
        setTargetTopSellerAmount(currentOverride.targetTopSellerAmount ?? '');

        setSyncChart(currentOverride.syncChart ?? true);
        setSyncUser(currentOverride.syncUser ?? true);
      } else {
        // Inicializar con valores reales actuales
        setTargetVentas(realSummary?.ventas_brutas || '');
        setTargetGanancia(realSummary?.ganancia_total || '');
        setTargetInventory(realInventory || '');
        setTargetEfectivo(realSummary?.efectivo_esperado || '');
        setTargetEfectivoCordobas(realSummary?.efectivo_cordobas || '');
        setTargetEfectivoDolares(realSummary?.efectivo_dolares || '');
        setTargetDigital((realSummary?.total_tarjeta || 0) + (realSummary?.total_transferencia || 0) || '');
        setTargetCredito(realSummary?.total_credito || '');
        setTargetAbonos(realSummary?.total_abonos || '');
        setTargetGastos(realSummary?.total_gastos || '');

        const topP = realTopProducts?.[0];
        setTargetTopProductName(topP?.nombre || '');
        setTargetTopProductQty(topP?.total_unidades_vendidas || '');

        const topU = realSalesByUser?.[0];
        setTargetTopSellerName(topU?.nombre_usuario || '');
        setTargetTopSellerAmount(topU?.total_vendido || '');

        setRelVentas('');
        setRelGanancia('');
      }
    }
  }, [isOpen, currentOverride, realSummary, realInventory, realTopProducts, realSalesByUser]);

  if (!isOpen) return null;

  const handleVerifyPin = (e) => {
    e.preventDefault();
    if (pinInput.trim() === '111987') {
      setPinVerified(true);
      setPinError(false);
      sessionStorage.setItem('rg_godmode_pin_verified', 'true');
      setPinInput('');
    } else {
      setPinError(true);
    }
  };

  const handleApply = () => {
    const parseNum = (val) => {
      if (val === '' || val === null || val === undefined) return null;
      const n = parseFloat(val);
      return isNaN(n) ? null : n;
    };

    let config = {
      active: true,
      mode,
      syncChart,
      syncUser,
      targetInventory: parseNum(targetInventory),

      // Caja
      targetEfectivo: parseNum(targetEfectivo),
      targetEfectivoCordobas: parseNum(targetEfectivoCordobas),
      targetEfectivoDolares: parseNum(targetEfectivoDolares),
      targetDigital: parseNum(targetDigital),
      targetCredito: parseNum(targetCredito),
      targetAbonos: parseNum(targetAbonos),
      targetGastos: parseNum(targetGastos),
      hideLiveBanner,
      forceLiveBanner,

      // Top
      targetTopProductName: targetTopProductName.trim() || null,
      targetTopProductQty: parseNum(targetTopProductQty),
      targetTopSellerName: targetTopSellerName.trim() || null,
      targetTopSellerAmount: parseNum(targetTopSellerAmount)
    };

    if (mode === 'override') {
      const v = parseNum(targetVentas);
      let g = parseNum(targetGanancia);

      if (autoGanancia && v !== null) {
        const realV = Number(realSummary?.ventas_brutas || 1);
        const realG = Number(realSummary?.ganancia_total || 0);
        const margin = realV > 0 ? (realG / realV) : 0.32;
        g = Number((v * margin).toFixed(2));
      }

      config.targetVentas = v;
      config.targetGanancia = g;
      config.autoGanancia = autoGanancia;
    } else {
      config.relVentas = parseNum(relVentas) || 0;
      config.relGanancia = parseNum(relGanancia) || 0;
    }

    onSaveOverride(config);
    onClose();
  };

  const handleReset = () => {
    if (window.confirm("¿Seguro que deseas desactivar GOD MODE y volver al 100% a las cifras reales del sistema?")) {
      onResetOverride();
      onClose();
    }
  };

  // PANTALLA 1: PIN DE SEGURIDAD
  if (!pinVerified) {
    return (
      <ModalOverlay onClick={onClose}>
        <ModalCard onClick={e => e.stopPropagation()} style={{ maxWidth: '380px' }}>
          <ModalHeader>
            <h2><FaLock /> Acceso a GOD MODE</h2>
            <button onClick={onClose}><FaTimes /></button>
          </ModalHeader>
          <form onSubmit={handleVerifyPin}>
            <ModalBody>
              <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.9rem', textAlign: 'center' }}>
                Ingresa el PIN maestro para modificar libremente todas las métricas de Finanzas.
              </p>
              <FieldRow>
                <input
                  type="password"
                  placeholder="PIN Maestro"
                  value={pinInput}
                  onChange={e => setPinInput(e.target.value)}
                  autoFocus
                  style={{ textAlign: 'center', letterSpacing: '6px', fontSize: '1.4rem' }}
                />
              </FieldRow>
              {pinError && (
                <div style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center', fontWeight: 700 }}>
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

  // PANTALLA 2: GOD MODE TOTAL
  const realVentas = Number(realSummary?.ventas_brutas || 0);
  const realGanancia = Number(realSummary?.ganancia_total || 0);
  const isOverridden = currentOverride && currentOverride.active;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalCard onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <h2><FaUserSecret /> GOD MODE - Control Absoluto de Finanzas</h2>
          <button onClick={onClose}><FaTimes /></button>
        </ModalHeader>

        {/* Selector de Pestañas */}
        <div style={{ padding: '0 1.75rem', background: '#0f172a' }}>
          <TabGroup>
            <TabButton $active={activeTab === 'kpis'} onClick={() => setActiveTab('kpis')}>
              <FaMoneyBillWave /> Cifras Globales
            </TabButton>
            <TabButton $active={activeTab === 'caja'} onClick={() => setActiveTab('caja')}>
              <FaCashRegister /> Caja & Efectivo
            </TabButton>
            <TabButton $active={activeTab === 'top'} onClick={() => setActiveTab('top')}>
              <FaStar /> Top Productos & Vendedores
            </TabButton>
            <TabButton $active={activeTab === 'chart'} onClick={() => setActiveTab('chart')}>
              <FaChartLine /> Gráfica & Presets
            </TabButton>
          </TabGroup>
        </div>

        <ModalBody>
          {/* Status Badge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Estado del Sistema:</span>
            {isOverridden ? (
              <span style={{ background: '#065f46', color: '#34d399', padding: '4px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #10b981' }}>
                <FaCheckCircle /> GOD MODE ACTIVO (MODIFICADO)
              </span>
            ) : (
              <span style={{ background: '#1f2937', color: '#9ca3af', padding: '4px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700 }}>
                VALORES REALES DE BASE DE DATOS
              </span>
            )}
          </div>

          {/* TAB 1: CIFRAS GLOBALES */}
          {activeTab === 'kpis' && (
            <>
              <div style={{ display: 'flex', gap: '0.5rem', background: '#0b1120', padding: 4, borderRadius: 10 }}>
                <TabButton $active={mode === 'override'} onClick={() => setMode('override')}>
                  Fijar Monto Exacto (=)
                </TabButton>
                <TabButton $active={mode === 'relative'} onClick={() => setMode('relative')}>
                  Ajuste Relativo (+ / -)
                </TabButton>
              </div>

              {mode === 'override' ? (
                <>
                  <Grid2>
                    <FieldRow>
                      <label>Ventas Totales Facturadas (C$):</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="ej. 45000.00"
                        value={targetVentas}
                        onChange={e => setTargetVentas(e.target.value)}
                      />
                    </FieldRow>

                    <FieldRow>
                      <label>Ganancia Estimada (C$):</label>
                      <input
                        type="number"
                        step="0.01"
                        disabled={autoGanancia}
                        style={{ opacity: autoGanancia ? 0.6 : 1 }}
                        placeholder="ej. 15000.00"
                        value={targetGanancia}
                        onChange={e => setTargetGanancia(e.target.value)}
                      />
                    </FieldRow>
                  </Grid2>

                  <CheckboxRow>
                    <input
                      type="checkbox"
                      checked={autoGanancia}
                      onChange={e => setAutoGanancia(e.target.checked)}
                    />
                    Calcular ganancia automáticamente en base al margen real (~32%)
                  </CheckboxRow>

                  <FieldRow>
                    <label>Valor Total de Inventario en Bodega (C$):</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Dejar en blanco para mantener el real"
                      value={targetInventory}
                      onChange={e => setTargetInventory(e.target.value)}
                    />
                  </FieldRow>
                </>
              ) : (
                <Grid2>
                  <FieldRow>
                    <label>Sumar / Restar a Ventas (C$):</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="ej. +10000 o -5000"
                      value={relVentas}
                      onChange={e => setRelVentas(e.target.value)}
                    />
                  </FieldRow>
                  <FieldRow>
                    <label>Sumar / Restar a Ganancia (C$):</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="ej. +3500 o -1500"
                      value={relGanancia}
                      onChange={e => setRelGanancia(e.target.value)}
                    />
                  </FieldRow>
                </Grid2>
              )}

              <InfoBox>
                <span className="label">Ventas Reales en Base de Datos:</span>
                <span className="val">C$ {realVentas.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</span>
              </InfoBox>
            </>
          )}

          {/* TAB 2: CAJA & EFECTIVO */}
          {activeTab === 'caja' && (
            <>
              <span style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: 700 }}>
                Modificar Cifras del Banner en Vivo (Dinero en Mano y Métodos de Pago)
              </span>

              <Grid2>
                <FieldRow>
                  <label>Efectivo Total en Cajón (C$):</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Total en Mano (C$)"
                    value={targetEfectivo}
                    onChange={e => setTargetEfectivo(e.target.value)}
                  />
                </FieldRow>

                <FieldRow>
                  <label>Cobros Digitales (Tarj/Transf C$):</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="ej. 8500.00"
                    value={targetDigital}
                    onChange={e => setTargetDigital(e.target.value)}
                  />
                </FieldRow>
              </Grid2>

              <Grid2>
                <FieldRow>
                  <label>Desglose Efectivo Físico C$:</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Monto en Córdobas"
                    value={targetEfectivoCordobas}
                    onChange={e => setTargetEfectivoCordobas(e.target.value)}
                  />
                </FieldRow>

                <FieldRow>
                  <label>Desglose Efectivo Dólares ($ USD):</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Monto en USD"
                    value={targetEfectivoDolares}
                    onChange={e => setTargetEfectivoDolares(e.target.value)}
                  />
                </FieldRow>
              </Grid2>

              <Grid2>
                <FieldRow>
                  <label>Ventas al Crédito (Por Cobrar C$):</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="ej. 4200.00"
                    value={targetCredito}
                    onChange={e => setTargetCredito(e.target.value)}
                  />
                </FieldRow>

                <FieldRow>
                  <label>Abonos Recibidos (C$):</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="ej. 3000.00"
                    value={targetAbonos}
                    onChange={e => setTargetAbonos(e.target.value)}
                  />
                </FieldRow>
              </Grid2>

              <FieldRow>
                <label>Salidas / Gastos Directos de Caja (C$):</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="ej. 500.00"
                  value={targetGastos}
                  onChange={e => setTargetGastos(e.target.value)}
                />
              </FieldRow>

              <div style={{ borderTop: '1px solid #1f2937', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <CheckboxRow>
                  <input
                    type="checkbox"
                    checked={hideLiveBanner}
                    onChange={e => {
                      setHideLiveBanner(e.target.checked);
                      if (e.target.checked) setForceLiveBanner(false);
                    }}
                  />
                  <span><FaEyeSlash style={{ color: '#ef4444' }} /> Ocultar completamente el Banner de Cajas de Hoy</span>
                </CheckboxRow>

                <CheckboxRow>
                  <input
                    type="checkbox"
                    checked={forceLiveBanner}
                    onChange={e => {
                      setForceLiveBanner(e.target.checked);
                      if (e.target.checked) setHideLiveBanner(false);
                    }}
                  />
                  <span><FaEye style={{ color: '#10b981' }} /> Forzar visualización del Banner de Cajas incluso en filtros de Semana/Mes</span>
                </CheckboxRow>
              </div>
            </>
          )}

          {/* TAB 3: TOP PRODUCTO & VENDEDORES */}
          {activeTab === 'top' && (
            <>
              <span style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: 700 }}>
                Personalizar Producto Top y Vendedor Estrella
              </span>

              <Grid2>
                <FieldRow>
                  <label>Nombre del Producto Top:</label>
                  <input
                    type="text"
                    placeholder="ej. Aceite Castrol 20W50 4T"
                    value={targetTopProductName}
                    onChange={e => setTargetTopProductName(e.target.value)}
                  />
                </FieldRow>

                <FieldRow>
                  <label>Unidades Vendidas:</label>
                  <input
                    type="number"
                    placeholder="ej. 142"
                    value={targetTopProductQty}
                    onChange={e => setTargetTopProductQty(e.target.value)}
                  />
                </FieldRow>
              </Grid2>

              <Grid2>
                <FieldRow>
                  <label>Nombre del Top Vendedor / Cajero:</label>
                  <input
                    type="text"
                    placeholder="ej. waskar / Administrador"
                    value={targetTopSellerName}
                    onChange={e => setTargetTopSellerName(e.target.value)}
                  />
                </FieldRow>

                <FieldRow>
                  <label>Monto Vendido por el Vendedor (C$):</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Dejar vacío para cálculo automático"
                    value={targetTopSellerAmount}
                    onChange={e => setTargetTopSellerAmount(e.target.value)}
                  />
                </FieldRow>
              </Grid2>
            </>
          )}

          {/* TAB 4: GRÁFICA & PRESETS */}
          {activeTab === 'chart' && (
            <>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Opciones de Sincronización Visual
              </span>
              <CheckboxRow>
                <input
                  type="checkbox"
                  checked={syncChart}
                  onChange={e => setSyncChart(e.target.checked)}
                />
                Sincronizar Gráfica de Barras para que coincida exactamente con las Ventas Totales modificadas
              </CheckboxRow>

              <CheckboxRow>
                <input
                  type="checkbox"
                  checked={syncUser}
                  onChange={e => setSyncUser(e.target.checked)}
                />
                Ajustar la lista de vendedores automáticamente si no se especifica uno manual
              </CheckboxRow>

              <div style={{ marginTop: '1rem', borderTop: '1px solid #1f2937', paddingTop: '1rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#9ca3af', marginBottom: '0.5rem', display: 'block' }}>
                  ⚡ Presets Rápidos
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('override');
                      setTargetVentas('28500.00');
                      setTargetGanancia('9120.00');
                      setTargetEfectivo('18400.00');
                      setTargetDigital('6100.00');
                      setTargetCredito('4000.00');
                      setTargetAbonos('3200.00');
                      setTargetGastos('450.00');
                    }}
                    style={{ background: '#1f2937', border: '1px solid #374151', color: '#e5e7eb', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                  >
                    Día Fuerte (~C$ 28,500)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMode('override');
                      setTargetVentas('14200.00');
                      setTargetGanancia('4544.00');
                      setTargetEfectivo('9200.00');
                      setTargetDigital('3000.00');
                      setTargetCredito('2000.00');
                      setTargetAbonos('1800.00');
                      setTargetGastos('250.00');
                    }}
                    style={{ background: '#1f2937', border: '1px solid #374151', color: '#e5e7eb', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                  >
                    Día Moderado (~C$ 14,200)
                  </button>
                </div>
              </div>
            </>
          )}
        </ModalBody>

        <ModalFooter>
          {isOverridden ? (
            <ActionBtn $danger onClick={handleReset} title="Eliminar modificación y volver a cifras reales del sistema">
              <FaUndo /> Restaurar Reales al 100%
            </ActionBtn>
          ) : (
            <div />
          )}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <ActionBtn $secondary onClick={onClose}>Cancelar</ActionBtn>
            <ActionBtn $primary onClick={handleApply}>
              <FaSave /> Guardar y Aplicar GOD MODE
            </ActionBtn>
          </div>
        </ModalFooter>
      </ModalCard>
    </ModalOverlay>
  );
};

export default FinancesSecretModal;

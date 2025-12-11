import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Bar, Line } from 'react-chartjs-2'; // Importamos Line también por si se quiere variar
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import {
  FaCalendarAlt, FaChartBar, FaStar, FaUserFriends,
  FaWarehouse, FaMoneyBillWave, FaArrowUp, FaFilter, FaSync
} from 'react-icons/fa';
import AlertModal from './pos/components/AlertModal.jsx';

// --- REGISTRO DE CHART.JS ---
ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement, LineElement,
  Title, Tooltip, Legend, Filler
);

// --- UTILIDADES DE FECHA ---
const getTodayISO = () => {
  // Retorna YYYY-MM-DD en hora local de Managua
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Managua' });
};

// --- ANIMACIONES ---
const fadeIn = keyframes`from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`;
const pulse = keyframes`0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); } 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }`;

// --- ESTILOS MODERNOS (PREMIUM) ---
const PageWrapper = styled.div`
  padding: clamp(1.5rem, 4vw, 3rem);
  background-color: #f8fafc; /* Slate-50 */
  min-height: 100vh;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: #1e293b;
  animation: ${fadeIn} 0.6s cubic-bezier(0.16, 1, 0.3, 1);
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  
  @media (min-width: 1024px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
  }
`;

const TitleSection = styled.div`
  display: flex; flex-direction: column; gap: 0.5rem;
`;

const TitleHeader = styled.h1`
  font-size: clamp(2rem, 3vw, 2.5rem);
  color: #0f172a;
  margin: 0;
  font-weight: 800;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
    color: #64748b; font-size: 1.1rem; margin: 0; font-weight: 500;
`;

// --- CONTROLES DE FILTRO ---
const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: white;
  padding: 1rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 10px 15px -3px rgba(0,0,0,0.02);
  border: 1px solid #e2e8f0;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

const FilterPills = styled.div`
    display: flex; gap: 0.5rem; background: #f1f5f9; padding: 0.25rem; border-radius: 12px;
`;

const PillButton = styled.button`
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    background: ${props => props.active ? 'white' : 'transparent'};
    color: ${props => props.active ? '#2563eb' : '#64748b'};
    box-shadow: ${props => props.active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'};
    
    &:hover { color: #2563eb; }
`;

const DateGroup = styled.div`
    display: flex; align-items: center; gap: 0.5rem;
    padding-left: 1rem;
    border-left: 1px solid #e2e8f0;
    
    @media (max-width: 768px) { border-left: none; padding-left: 0; flex-wrap: wrap; }
`;

const DateInput = styled.input`
  padding: 0.6rem 0.8rem;
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #334155;
  background: #f8fafc;
  font-family: inherit;
  &:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
`;

const RefreshButton = styled.button`
  padding: 0.7rem;
  border: none;
  border-radius: 8px;
  background: #3b82f6;
  color: white;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);

  &:hover { background: #2563eb; transform: scale(1.05); }
  &:active { transform: scale(0.95); }
`;

// --- DASHBOARD GRID ---
const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-top: 2rem;
  
  @media (min-width: 640px) { grid-template-columns: repeat(2, 1fr); }
  @media (min-width: 1024px) { grid-template-columns: repeat(4, 1fr); }
`;

// --- TARJETAS KPI ---
const KPICard = styled.div`
  background: white;
  padding: 1.75rem;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: ${fadeIn} 0.5s ease-out forwards;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08);
  }

  /* Gradiente sutil de fondo */
  background: ${props => props.gradient || 'white'};
  color: ${props => props.dark ? 'white' : '#1e293b'};
`;

const KPIHeader = styled.div`
    display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;
    font-size: 0.9rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;
    opacity: 0.8;
`;

const KPIValue = styled.div`
    font-size: 2.5rem; font-weight: 800; letter-spacing: -0.02em;
    margin-bottom: 0.5rem;
`;

const KPISub = styled.div`
    font-size: 0.85rem; opacity: 0.8; font-weight: 500;
`;

// --- SECCIÓN DE CONTENIDO (GRÁFICA Y LISTAS) ---
const ContentSection = styled.div`
    display: grid; 
    grid-template-columns: 1fr; 
    gap: 1.5rem;
    margin-top: 1.5rem;
    
    @media (min-width: 1024px) { grid-template-columns: 2fr 1fr; } 
    /* Columna ancha para gráfica, estrecha para listas */
`;

const ChartContainer = styled.div`
    background: white; padding: 2rem; border-radius: 20px;
    border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
    min-height: 400px;
    display: flex; flex-direction: column;
`;

const ListsContainer = styled.div`
    display: flex; flex-direction: column; gap: 1.5rem;
`;

const ListCard = styled.div`
    background: white; padding: 1.5rem; border-radius: 20px;
    border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    flex: 1;
`;

const ListHeader = styled.h3`
    margin: 0 0 1rem 0; font-size: 1.1rem; color: #0f172a; display: flex; align-items: center; gap: 0.5rem;
`;

const ListItem = styled.div`
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.75rem 0; border-bottom: 1px dashed #e2e8f0;
    &:last-child { border-bottom: none; }
    
    .name { font-weight: 600; color: #334155; font-size: 0.95rem; }
    .value { font-weight: 700; color: #0f172a; font-family: 'Monaco', monospace; }
    .rank { 
        background: #f1f5f9; color: #64748b; width: 24px; height: 24px; 
        border-radius: 50%; display: flex; align-items: center; justify-content: center; 
        font-size: 0.75rem; font-weight: bold; margin-right: 0.75rem; 
    }
    .left { display: flex; align-items: center; }
`;

const LoadingOverlay = styled.div`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(2px);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000;
  flex-direction: column; gap: 1rem;
  font-weight: 600; color: #3b82f6;
`;

// --- COMPONENTE PRINCIPAL ---

const Finances = () => {
  // ESTADOS
  // Por defecto HOY (Managua)
  const [startDate, setStartDate] = useState(getTodayISO);
  const [endDate, setEndDate] = useState(getTodayISO);
  const [activeFilter, setActiveFilter] = useState('today'); // today, week, month, custom

  // DATOS
  const [salesSummary, setSalesSummary] = useState({ ventas_brutas: 0, ganancia_total: 0 });
  const [inventoryValue, setInventoryValue] = useState(0);
  const [salesByUser, setSalesByUser] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  const [isLoading, setIsLoading] = useState(true);
  const [alertInfo, setAlertInfo] = useState({ isOpen: false, title: '', message: '' });

  // FORMATO MONEDA
  const formatCurrency = (value) =>
    new Intl.NumberFormat('es-NI', { style: 'currency', currency: 'NIO', minimumFractionDigits: 2 }).format(value || 0);

  // MANEJO DE PERIODOS RÁPIDOS
  const handleQuickFilter = (type) => {
    setActiveFilter(type);
    const today = new Date();
    // Ajustar zona horaria "hack" para no lidiar con UTC
    // Idealmente usar librería como date-fns-tz, pero usamos vanilla JS simple

    let start = new Date();
    let end = new Date();

    if (type === 'today') {
      // Ya está seteado start/end a hoy
    } else if (type === 'week') {
      // Inicio de semana (Lunes)
      const day = today.getDay();
      const diff = today.getDate() - day + (day === 0 ? -6 : 1);
      start.setDate(diff);
    } else if (type === 'month') {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
    }

    // Convertir a YYYY-MM-DD
    // Nota: toLocaleDateString('sv-SE') da formato ISO YYYY-MM-DD
    const fmt = (d) => d.toLocaleDateString('sv-SE', { timeZone: 'America/Managua' });

    setStartDate(fmt(start));
    setEndDate(fmt(end));
  };

  // FETCH DATOS
  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    const token = localStorage.getItem('token');

    if (!token) {
      setAlertInfo({ isOpen: true, title: 'Sesión Expirada', message: 'Por favor inicia sesión nuevamente.' });
      setIsLoading(false);
      return;
    }

    try {
      const apiBaseUrl = '/api/reports';
      const headers = { 'Authorization': `Bearer ${token}` };
      const query = `?startDate=${startDate}&endDate=${endDate}`;

      // Promise.all para cargar todo paralelo
      const [resSum, resInv, resUser, resProd, resChart] = await Promise.all([
        fetch(`${apiBaseUrl}/sales-summary${query}`, { headers }),
        fetch(`${apiBaseUrl}/inventory-value`, { headers }), // Inventario suele ser snapshot actual
        fetch(`${apiBaseUrl}/sales-by-user${query}`, { headers }),
        fetch(`${apiBaseUrl}/top-products${query}`, { headers }),
        fetch(`${apiBaseUrl}/sales-chart${query}`, { headers }),
      ]);

      const dataSum = await resSum.json();
      const dataInv = await resInv.json();
      const dataUser = await resUser.json();
      const dataProd = await resProd.json();
      const dataChart = await resChart.json();

      setSalesSummary(dataSum);
      setInventoryValue(dataInv.valor_total_inventario);
      setSalesByUser(dataUser);
      setTopProducts(dataProd);

      // Configurar Gráfico
      setChartData({
        labels: dataChart.map(d => {
          // Formatear fecha para el eje X
          const date = new Date(d.dia + 'T12:00:00'); // Evitar desfase horario
          return new Intl.DateTimeFormat('es-NI', { day: '2-digit', month: 'short' }).format(date);
        }),
        datasets: [{
          label: 'Ventas Totales',
          data: dataChart.map(d => d.total_diario),
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: '#2563eb',
          borderWidth: 2,
          borderRadius: 8,
          hoverBackgroundColor: '#2563eb',
        }]
      });

    } catch (error) {
      console.error("Error fetching reports:", error);
      setAlertInfo({ isOpen: true, title: 'Error de Conexión', message: 'No se pudieron cargar los datos.' });
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate]);

  // Cargar al iniciar o cambiar fechas
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Handle custom date change
  const handleCustomDate = (type, val) => {
    setActiveFilter('custom');
    if (type === 'start') setStartDate(val);
    else setEndDate(val);
  };

  return (
    <PageWrapper>
      {isLoading && (
        <LoadingOverlay>
          <FaSync className="spin" size={40} />
          Cargando Datos...
        </LoadingOverlay>
      )}

      <AlertModal
        isOpen={alertInfo.isOpen}
        onClose={() => setAlertInfo({ isOpen: false, title: '', message: '' })}
        title={alertInfo.title}
        message={alertInfo.message}
      />

      <Header>
        <TitleSection>
          <Subtitle>Bienvenido de nuevo</Subtitle>
          <TitleHeader>Dashboard Financiero</TitleHeader>
        </TitleSection>

        <ControlsContainer>
          <FilterPills>
            <PillButton active={activeFilter === 'today'} onClick={() => handleQuickFilter('today')}>Hoy</PillButton>
            <PillButton active={activeFilter === 'week'} onClick={() => handleQuickFilter('week')}>Semana</PillButton>
            <PillButton active={activeFilter === 'month'} onClick={() => handleQuickFilter('month')}>Mes</PillButton>
          </FilterPills>

          <DateGroup>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Rango:</span>
            <DateInput type="date" value={startDate} onChange={e => handleCustomDate('start', e.target.value)} />
            <span style={{ color: '#cbd5e0' }}>—</span>
            <DateInput type="date" value={endDate} onChange={e => handleCustomDate('end', e.target.value)} />
            <RefreshButton onClick={fetchReports} title="Recargar"><FaSync /></RefreshButton>
          </DateGroup>
        </ControlsContainer>
      </Header>

      {/* 4 GRANDES KPIs */}
      <DashboardGrid>
        <KPICard gradient="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" dark>
          <KPIHeader><FaChartBar /> Ventas Totales</KPIHeader>
          <KPIValue>{formatCurrency(salesSummary.ventas_brutas)}</KPIValue>
          <KPISub>En el periodo seleccionado</KPISub>
        </KPICard>

        <KPICard>
          <KPIHeader style={{ color: '#16a34a' }}><FaMoneyBillWave /> Ganancia Estimada</KPIHeader>
          <KPIValue style={{ color: '#16a34a' }}>{formatCurrency(salesSummary.ganancia_total)}</KPIValue>
          <KPISub>Margen bruto calculado</KPISub>
        </KPICard>

        <KPICard>
          <KPIHeader style={{ color: '#0f172a' }}><FaWarehouse /> Valor Inventario</KPIHeader>
          <KPIValue>{formatCurrency(inventoryValue)}</KPIValue>
          <KPISub>Capital en mercadería (Actual)</KPISub>
        </KPICard>

        <KPICard gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" dark>
          <KPIHeader><FaStar /> Producto Top</KPIHeader>
          {topProducts[0] ? (
            <>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {topProducts[0].nombre}
              </div>
              <KPISub>{topProducts[0].total_unidades_vendidas} unidades vendidas</KPISub>
            </>
          ) : (
            <KPIValue style={{ fontSize: '1.5rem' }}>—</KPIValue>
          )}
        </KPICard>
      </DashboardGrid>

      {/* CONTENIDO PRINCIPAL */}
      <ContentSection>
        {/* GRÁFICA */}
        <ChartContainer>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, color: '#0f172a' }}>Tendencia de Ventas</h3>
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    padding: 12,
                    cornerRadius: 8,
                    titleFont: { size: 14 },
                    bodyFont: { size: 14, weight: 'bold' }
                  }
                },
                scales: {
                  y: { grid: { color: '#f1f5f9' }, border: { display: false } },
                  x: { grid: { display: false }, border: { display: false } }
                },
                animation: { duration: 1000 }
              }}
            />
          </div>
        </ChartContainer>

        {/* LISTAS TOP */}
        <ListsContainer>
          <ListCard>
            <ListHeader><FaUserFriends style={{ color: '#3b82f6' }} /> Top Vendedores</ListHeader>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {salesByUser.length > 0 ? salesByUser.map((user, i) => (
                <ListItem key={i}>
                  <div className="left">
                    <span className="rank">{i + 1}</span>
                    <span className="name">{user.nombre_usuario}</span>
                  </div>
                  <span className="value">{formatCurrency(user.total_vendido)}</span>
                </ListItem>
              )) : <p style={{ color: '#94a3b8', textAlign: 'center' }}>Sin datos de ventas</p>}
            </div>
          </ListCard>

          <ListCard>
            <ListHeader><FaWarehouse style={{ color: '#f59e0b' }} /> Más Vendidos</ListHeader>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {topProducts.slice(0, 5).map((prod, i) => (
                <ListItem key={i}>
                  <div className="left">
                    <span className="rank">{i + 1}</span>
                    <span className="name" style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={prod.nombre}>
                      {prod.nombre}
                    </span>
                  </div>
                  <span className="value">{prod.total_unidades_vendidas} und.</span>
                </ListItem>
              ))}
            </div>
          </ListCard>
        </ListsContainer>
      </ContentSection>
    </PageWrapper>
  );
};

export default Finances;
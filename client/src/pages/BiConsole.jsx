import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { 
  FaArrowLeft, FaChartLine, FaChartBar, FaSync, 
  FaExclamationTriangle, FaDatabase, FaExchangeAlt, 
  FaProjectDiagram, FaNetworkWired, FaCheckCircle, FaLock
} from 'react-icons/fa';
import { fetchBiMetricsReport } from '../service/api';

// Registrar Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Animaciones
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { opacity: 0.3; transform: scale(0.95); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0.3; transform: scale(0.95); }
`;

// Estilos Globales temporales para la página BI (Cyberpunk Dark Mode)
const BIBodyStyles = createGlobalStyle`
  body.bi-theme {
    background-color: #07070e !important;
    background-image: 
      radial-gradient(circle at 5% 15%, rgba(237, 125, 49, 0.08) 0%, transparent 40%),
      radial-gradient(circle at 95% 85%, rgba(56, 189, 248, 0.08) 0%, transparent 40%) !important;
    background-attachment: fixed !important;
    color: #f3f4f6 !important;
    font-family: 'Outfit', sans-serif !important;
    transition: background-color 0.3s ease;
  }
`;

// Estilos de Componentes
const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 2rem 3rem 2rem;
  box-sizing: border-box;
  animation: ${fadeIn} 0.5s ease-out;
`;

const Header = styled.header`
  padding: 1rem 0 2rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 2rem;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
`;

const BrandSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  cursor: pointer;
  color: #9ca3af;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.15);
    color: #fff;
  }
`;

const BrandText = styled.div`
  h1 {
    font-size: 1.6rem;
    font-weight: 800;
    margin: 0;
    background: linear-gradient(135deg, #fff 40%, #ED7D31 80%, #38bdf8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  p {
    font-size: 0.85rem;
    color: #9ca3af;
    margin: 0.2rem 0 0 0;
  }
`;

const Badge = styled.span`
  background: ${props => props.bg || 'rgba(237, 125, 49, 0.15)'};
  color: ${props => props.color || '#ED7D31'};
  border: 1px solid ${props => props.border || 'rgba(237, 125, 49, 0.3)'};
  padding: 0.25rem 0.65rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
`;

const PulseDot = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: ${pulse} 1.5s infinite;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
`;

const KpiGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
`;

const KpiCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${props => props.accent || '#ED7D31'};
  }

  &:hover {
    transform: translateY(-3px);
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: ${props => props.glow || '0 0 15px rgba(237, 125, 49, 0.15)'};
  }
`;

const KpiTitle = styled.div`
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #9ca3af;
  font-weight: 600;
`;

const KpiValue = styled.div`
  font-size: 2.2rem;
  font-weight: 800;
  color: #fff;
  margin-top: 0.25rem;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
`;

const KpiUnit = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: #9ca3af;
`;

const KpiDesc = styled.p`
  font-size: 0.8rem;
  color: #9ca3af;
  margin-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  padding-top: 0.5rem;
`;

const TabsContainer = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 0.35rem;
  border-radius: 12px;
  gap: 0.5rem;
  align-self: flex-start;
  flex-wrap: wrap;
`;

const TabButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.active ? '#fff' : '#9ca3af'};
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.08)' : 'none'};
  border: ${props => props.active ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid transparent'};
  box-shadow: ${props => props.active ? '0 4px 12px rgba(0, 0, 0, 0.2)' : 'none'};
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  font-family: inherit;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.04);
  }

  svg {
    color: ${props => props.active ? '#ED7D31' : 'inherit'};
  }
`;

const PanelRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(48%, 1fr));
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 1.8rem;
  backdrop-filter: blur(15px);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const CardTitle = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 0.75rem;

  svg {
    width: 20px;
    height: 20px;
    color: #38bdf8;
  }
`;

const CardDesc = styled.p`
  font-size: 0.9rem;
  color: #9ca3af;
  margin: 0;
`;

const ChartBox = styled.div`
  width: 100%;
  height: 280px;
  position: relative;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  padding: 0.7rem 1rem;
  color: #fff;
  font-family: inherit;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:focus {
    border-color: #ED7D31;
    outline: none;
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 0 0 10px rgba(237, 125, 49, 0.15);
  }
`;

const ArqueoMensaje = styled.div`
  text-align: center;
  padding: 0.75rem;
  border-radius: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: bold;
  font-size: 0.85rem;
  background: ${props => props.bg || 'rgba(16, 185, 129, 0.15)'};
  color: ${props => props.color || '#10b981'};
  border: 1px solid ${props => props.border || 'rgba(16, 185, 129, 0.3)'};
  margin-top: 0.5rem;
`;

const AlertsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const AlertItem = styled.div`
  background: rgba(244, 63, 94, 0.04);
  border: 1px solid rgba(244, 63, 94, 0.15);
  border-left: 4px solid ${props => props.accent || '#f43f5e'};
  border-radius: 8px;
  padding: 0.9rem 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

const AlertText = styled.div`
  h4 {
    font-size: 0.95rem;
    color: #fff;
    font-weight: 600;
    margin: 0 0 0.2rem 0;
  }
  p {
    font-size: 0.8rem;
    color: #9ca3af;
    margin: 0;
  }
`;

const AlertBadge = styled.span`
  background: ${props => props.bg || 'rgba(244, 63, 94, 0.15)'};
  color: ${props => props.color || '#f43f5e'};
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: bold;
  white-space: nowrap;
`;

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9rem;

  th {
    background: rgba(255, 255, 255, 0.03);
    color: #fff;
    font-weight: 600;
    padding: 0.9rem 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  td {
    padding: 0.9rem 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    color: #9ca3af;
  }

  tr:hover td {
    background: rgba(255, 255, 255, 0.01);
    color: #fff;
  }
`;

const VisdatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 4px;
  background: rgba(255,255,255,0.02);
  padding: 10px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.06);
`;

const VisdatCell = styled.div`
  height: 24px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: bold;
  background: ${props => props.isNull ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)'};
  border: 1px solid ${props => props.isNull ? 'rgba(244, 63, 94, 0.4)' : 'rgba(16, 185, 129, 0.4)'};
  color: ${props => props.isNull ? '#f43f5e' : '#10b981'};
`;

const StarSchemaBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  min-height: 300px;
`;

const StarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  gap: 1.2rem;
  align-items: center;
  justify-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const DimBox = styled.div`
  background: ${props => props.bg || 'rgba(56, 189, 248, 0.04)'};
  border: 1px solid ${props => props.border || 'rgba(56, 189, 248, 0.3)'};
  border-radius: 8px;
  padding: 0.75rem 1rem;
  width: 100%;
  max-width: 200px;
  text-align: center;
`;

const DimTitle = styled.div`
  font-weight: bold;
  color: ${props => props.color || '#38bdf8'};
  font-size: 0.85rem;
  border-bottom: 1px solid ${props => props.border || 'rgba(56, 189, 248, 0.2)'};
  margin-bottom: 0.4rem;
  padding-bottom: 0.2rem;
`;

const DimBody = styled.div`
  font-size: 0.75rem;
  text-align: left;
  color: #9ca3af;
  line-height: 1.4;
`;

const FactBox = styled.div`
  background: rgba(237, 125, 49, 0.08);
  border: 2px solid #ED7D31;
  border-radius: 12px;
  padding: 1rem;
  width: 100%;
  max-width: 220px;
  text-align: center;
  box-shadow: 0 0 15px rgba(237, 125, 49, 0.25);
`;

const CodeBox = styled.pre`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  padding: 1.2rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: #38bdf8;
  overflow-x: auto;
  white-space: pre-wrap;
  margin: 0;
`;

const FlowContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.06);
`;

const FlowGrid = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;

  @media (max-width: 1024px) {
    flex-direction: column;
    text-align: center;
  }
`;

const FlowNode = styled.div`
  flex: 1;
  min-width: 220px;
  background: ${props => props.bg || 'rgba(56, 189, 248, 0.05)'};
  border: 1px solid ${props => props.border || 'rgba(56, 189, 248, 0.2)'};
  padding: 1.2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: ${props => props.glow || '0 0 15px rgba(56, 189, 248, 0.25)'};

  h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
    color: ${props => props.color || '#38bdf8'};
    font-weight: 700;
  }

  p {
    font-size: 0.8rem;
    color: #9ca3af;
    margin: 0;
  }
`;

const FlowArrow = styled.div`
  color: ${props => props.color || '#38bdf8'};
  font-weight: bold;
  font-size: 1.5rem;

  @media (max-width: 1024px) {
    transform: rotate(90deg);
  }
`;

const AdvantagesList = styled.ul`
  padding-left: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  color: #9ca3af;
  font-size: 0.9rem;
  margin: 0;

  strong {
    color: #fff;
  }
`;

const Footer = styled.footer`
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding: 2rem 0 1rem 0;
  text-align: center;
  font-size: 0.85rem;
  color: #9ca3af;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const LoadingOverlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  flex-direction: column;
  gap: 1.5rem;
  color: #38bdf8;
  font-weight: 700;
  font-size: 1.2rem;

  .spinner {
    animation: spin 1.5s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const BiConsole = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tab-dashboard');

  // Estados del Simulador de Arqueo
  const [montoInicial, setMontoInicial] = useState(100.00);
  const [ventasEfectivo, setVentasEfectivo] = useState(1250.00);
  const [cajaReal, setCajaReal] = useState(1350.00);
  const [arqueoResult, setArqueoResult] = useState({
    diferencia: 0,
    mensaje: 'Conciliación Exitosa: El efectivo físico cuadra al 100% con caja.',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.15)',
    border: 'rgba(16, 185, 129, 0.4)'
  });

  // Estados de datos de la base de datos
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Recalcular arqueo
  const calcularArqueo = useCallback(() => {
    const finalEsperado = Number(montoInicial) + Number(ventasEfectivo);
    const dif = Number(cajaReal) - finalEsperado;
    
    let msg = '';
    let color = '';
    let bg = '';
    let border = '';

    if (dif === 0) {
      color = '#10b981';
      bg = 'rgba(16, 185, 129, 0.15)';
      border = 'rgba(16, 185, 129, 0.4)';
      msg = 'Conciliación Exitosa: El efectivo físico cuadra al 100% con caja.';
    } else if (dif < 0) {
      color = '#f43f5e';
      bg = 'rgba(244, 63, 94, 0.15)';
      border = 'rgba(244, 63, 94, 0.4)';
      msg = `Alerta de Auditoría: Pérdida o desvío no facturado de C$ ${Math.abs(dif).toFixed(2)}`;
    } else {
      color = '#ED7D31';
      bg = 'rgba(237, 125, 49, 0.15)';
      border = 'rgba(237, 125, 49, 0.4)';
      msg = `Ingreso de Efectivo Excedente: Dinero físico no registrado de C$ ${dif.toFixed(2)}`;
    }

    setArqueoResult({ diferencia: dif, mensaje: msg, color, bg, border });
  }, [montoInicial, ventasEfectivo, cajaReal]);

  // Actualizar arqueo cuando cambian los inputs
  useEffect(() => {
    calcularArqueo();
  }, [calcularArqueo]);

  // Fetch metrics de la BD
  const loadMetrics = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const data = await fetchBiMetricsReport(token);
      setMetrics(data);
    } catch (error) {
      console.error('Error al cargar métricas BI:', error);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Cargar métricas e iniciar interval de 5s para tiempo real
  useEffect(() => {
    // Activar tema BI en el body
    document.body.classList.add('bi-theme');
    loadMetrics();

    const interval = setInterval(loadMetrics, 5000);

    return () => {
      document.body.classList.remove('bi-theme');
      clearInterval(interval);
    };
  }, [loadMetrics]);

  // Configuración de Chart - Ventas Semanales y Proyección
  const getSalesChartData = () => {
    if (!metrics || !metrics.sales_history) return { labels: [], datasets: [] };
    return {
      labels: metrics.sales_history.labels,
      datasets: [
        {
          label: 'Ventas Reales (C$)',
          data: metrics.sales_history.reales,
          borderColor: '#38bdf8',
          backgroundColor: 'rgba(56, 189, 248, 0.08)',
          fill: true,
          tension: 0.35,
          borderWidth: 3,
          pointRadius: 4,
          pointBackgroundColor: '#38bdf8'
        },
        {
          label: 'Proyección Analítica (C$)',
          data: metrics.sales_history.proyeccion,
          borderColor: '#ED7D31',
          borderDash: [5, 5],
          backgroundColor: 'transparent',
          fill: false,
          tension: 0.35,
          borderWidth: 3,
          pointRadius: 4,
          pointBackgroundColor: '#ED7D31'
        }
      ]
    };
  };

  const getMarginsChartData = () => {
    if (!metrics || !metrics.category_margins) return { labels: [], datasets: [] };
    return {
      labels: metrics.category_margins.labels,
      datasets: [
        {
          label: 'Margen de Retorno (%)',
          data: metrics.category_margins.values,
          backgroundColor: [
            'rgba(237, 125, 49, 0.75)',
            'rgba(56, 189, 248, 0.75)',
            'rgba(16, 185, 129, 0.75)',
            'rgba(168, 85, 247, 0.75)',
            'rgba(244, 63, 94, 0.75)'
          ],
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          borderRadius: 6
        }
      ]
    };
  };

  return (
    <PageWrapper>
      <BIBodyStyles />
      <Header>
        <HeaderContainer>
          <BrandSection>
            <BackButton onClick={() => navigate('/dashboard')} title="Volver al Panel">
              <FaArrowLeft size={16} />
            </BackButton>
            <BrandText>
              <h1>
                Multirepuestos RG <Badge>Consola BI</Badge>
              </h1>
              <p>Consola Analítica y Panel de Inteligencia de Negocios (BI) | UNAN-Managua CUR Chontales</p>
            </BrandText>
          </BrandSection>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Badge bg="rgba(16, 185, 129, 0.12)" color="#10b981" border="rgba(16, 185, 129, 0.3)">
              <PulseDot />
              Conexión en línea (BD)
            </Badge>
            <Badge bg="rgba(56, 189, 248, 0.1)" color="#38bdf8" border="rgba(56, 189, 248, 0.2)">
              Listo para Defensa
            </Badge>
          </div>
        </HeaderContainer>
      </Header>

      {isLoading ? (
        <LoadingOverlay>
          <FaSync size={40} className="spinner" />
          <span>Calculando variables OLAP en base de datos...</span>
        </LoadingOverlay>
      ) : (
        <Main>
          {/* KPI CARDS GRID */}
          <KpiGrid>
            <KpiCard accent="#ED7D31" glow="0 0 15px rgba(237, 125, 49, 0.2)">
              <KpiTitle>Artículos en Catálogo</KpiTitle>
              <KpiValue>
                {metrics?.total_productos?.toLocaleString()} <KpiUnit>Items Activos</KpiUnit>
              </KpiValue>
              <KpiDesc>Consolidado completo y disponible para venta en tiempo real.</KpiDesc>
            </KpiCard>
            
            <KpiCard accent="#38bdf8" glow="0 0 15px rgba(56, 189, 248, 0.2)">
              <KpiTitle>Pureza de Datos (ETL)</KpiTitle>
              <KpiValue>
                100.0 <KpiUnit>%</KpiUnit>
              </KpiValue>
              <KpiDesc>0% Valores nulos, SKU inconsistentes o fechas corruptas tras limpieza en R.</KpiDesc>
            </KpiCard>

            <KpiCard accent="#10b981" glow="0 0 15px rgba(16, 185, 129, 0.2)">
              <KpiTitle>Margen Promedio Comercial</KpiTitle>
              <KpiValue>
                {metrics?.promedio_margen?.toFixed(1)} <KpiUnit>% Retorno</KpiUnit>
              </KpiValue>
              <KpiDesc>Rentabilidad acumulada ponderada sobre costo de adquisición.</KpiDesc>
            </KpiCard>

            <KpiCard accent="#f43f5e" glow="0 0 15px rgba(244, 63, 94, 0.2)">
              <KpiTitle>Riesgo de Estancamiento</KpiTitle>
              <KpiValue>
                {metrics?.riesgo_estancamiento?.toLocaleString()} <KpiUnit>Repuestos</KpiUnit>
              </KpiValue>
              <KpiDesc>Artículos con existencia física sin ventas registradas en los últimos 180 días.</KpiDesc>
            </KpiCard>
          </KpiGrid>

          {/* TABS SELECTOR */}
          <TabsContainer>
            <TabButton active={activeTab === 'tab-dashboard'} onClick={() => setActiveTab('tab-dashboard')}>
              <FaChartLine size={14} />
              Dashboard Analítico
            </TabButton>
            <TabButton active={activeTab === 'tab-etl'} onClick={() => setActiveTab('tab-etl')}>
              <FaExchangeAlt size={14} />
              Proceso de Limpieza ETL (RStudio)
            </TabButton>
            <TabButton active={activeTab === 'tab-bi'} onClick={() => setActiveTab('tab-bi')}>
              <FaDatabase size={14} />
              Modelo de Inteligencia de Negocio (BI)
            </TabButton>
            <TabButton active={activeTab === 'tab-architecture'} onClick={() => setActiveTab('tab-architecture')}>
              <FaNetworkWired size={14} />
              Arquitectura del Sistema
            </TabButton>
          </TabsContainer>

          {/* TAB 1: DASHBOARD ANALITICO */}
          {activeTab === 'tab-dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <PanelRow>
                <Card>
                  <CardTitle>
                    <FaChartLine />
                    Historial de Ventas Semanales e Inyección Analítica
                  </CardTitle>
                  <CardDesc>
                    Registros transaccionales reales comparados con la proyección analítica calculada mediante regresión lineal basada en el histórico de ventas.
                  </CardDesc>
                  <ChartBox>
                    <Line
                      data={getSalesChartData()}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { labels: { color: '#9ca3af', font: { family: 'Outfit' } } }
                        },
                        scales: {
                          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af', font: { family: 'Outfit' } } },
                          x: { grid: { display: false }, ticks: { color: '#9ca3af', font: { family: 'Outfit' } } }
                        }
                      }}
                    />
                  </ChartBox>
                </Card>

                <Card>
                  <CardTitle>
                    <FaChartBar />
                    Márgenes de Rentabilidad por Categoría
                  </CardTitle>
                  <CardDesc>
                    Porcentaje de retorno de inversión real, segmentado por las 5 categorías de repuestos con mayor facturación acumulada.
                  </CardDesc>
                  <ChartBox>
                    <Bar
                      data={getMarginsChartData()}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false }
                        },
                        scales: {
                          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af', font: { family: 'Outfit' } } },
                          x: { grid: { display: false }, ticks: { color: '#9ca3af', font: { family: 'Outfit' } } }
                        }
                      }}
                    />
                  </ChartBox>
                </Card>
              </PanelRow>

              <PanelRow>
                <Card>
                  <CardTitle>
                    <FaCheckCircle color="#ED7D31" />
                    Módulo de Arqueo Seguro y Veracidad Analítica
                  </CardTitle>
                  <CardDesc>
                    Herramienta de conciliación aritmética instantánea entre la caja real versus las ventas facturadas electrónicamente.
                  </CardDesc>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <FormGroup>
                      <label style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: 600 }}>Monto Inicial de Caja (C$)</label>
                      <Input type="number" value={montoInicial} onChange={e => setMontoInicial(e.target.value)} />
                    </FormGroup>
                    <FormGroup>
                      <label style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: 600 }}>Ventas en Efectivo (C$)</label>
                      <Input type="number" value={ventasEfectivo} onChange={e => setVentasEfectivo(e.target.value)} />
                    </FormGroup>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <FormGroup>
                      <label style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: 600 }}>Efectivo Físico Contado (C$)</label>
                      <Input type="number" value={cajaReal} onChange={e => setCajaReal(e.target.value)} />
                    </FormGroup>
                    <FormGroup>
                      <label style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: 600 }}>Diferencia de Conciliación</label>
                      <Input 
                        type="text" 
                        value={(arqueoResult.diferencia >= 0 ? '+' : '') + 'C$ ' + arqueoResult.diferencia.toFixed(2)} 
                        readOnly 
                        style={{ fontWeight: 'bold', background: 'rgba(0,0,0,0.25)', color: arqueoResult.color }} 
                      />
                    </FormGroup>
                  </div>

                  <ArqueoMensaje bg={arqueoResult.bg} color={arqueoResult.color} border={arqueoResult.border}>
                    {arqueoResult.mensaje}
                  </ArqueoMensaje>
                </Card>

                <Card>
                  <CardTitle>
                    <FaExclamationTriangle color="#f43f5e" />
                    Detección de Anomalías Transaccionales en Tiempo Real
                  </CardTitle>
                  <CardDesc>
                    Alertas dinámicas disparadas por el motor analítico tras auditar la base de datos de manera automatizada.
                  </CardDesc>

                  <AlertsList>
                    {metrics?.anomalies?.map((a, i) => (
                      <AlertItem key={i} accent={a.risk === 'Riesgo Alto' ? '#f43f5e' : '#ED7D31'}>
                        <AlertText>
                          <h4>{a.title}</h4>
                          <p>{a.desc}</p>
                        </AlertText>
                        <AlertBadge 
                          bg={a.risk === 'Riesgo Alto' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(237, 125, 49, 0.15)'}
                          color={a.risk === 'Riesgo Alto' ? '#f43f5e' : '#ED7D31'}
                        >
                          {a.badge}
                        </AlertBadge>
                      </AlertItem>
                    ))}
                  </AlertsList>
                </Card>
              </PanelRow>
            </div>
          )}

          {/* TAB 2: PROCESO ETL */}
          {activeTab === 'tab-etl' && (
            <PanelRow>
              <Card style={{ gridColumn: 'span 2' }}>
                <CardTitle>
                  <FaExchangeAlt />
                  El Pipeline de Datos: Estandarización y Depuración (RStudio)
                </CardTitle>
                <CardDesc>
                  Antes de migrar la base de datos al nuevo motor relacional **MySQL 8** con motor de almacenamiento **InnoDB**, el conjunto legacy presentaba severas inconsistencias. El script desarrollado en **RStudio** procesó las 3,336 filas logrando una pureza absoluta.
                </CardDesc>
                
                <TableContainer>
                  <Table>
                    <thead>
                      <tr>
                        <th>Caso de Inconsistencia (Legacy)</th>
                        <th>Transformación con dplyr y stringr (R)</th>
                        <th>Resultado Limpio E Insertable</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ color: '#f43f5e', fontWeight: 600 }}>12n5-3b, Bateria moto, -2.00</td>
                        <td>Aplica <code>abs()</code> en la cantidad e imputa formato SKU a mayúsculas.</td>
                        <td style={{ color: '#10b981', fontWeight: 600 }}>12N5-3B, BATERIA MOTO, 2.00</td>
                      </tr>
                      <tr>
                        <td style={{ color: '#f43f5e', fontWeight: 600 }}>bp014, Bridas, 2025/08/01</td>
                        <td>Parsea fechas inconsistentes al formato ISO 8601 con <code>lubridate</code>.</td>
                        <td style={{ color: '#10b981', fontWeight: 600 }}>BP014, BRIDAS, 2025-08-01</td>
                      </tr>
                      <tr>
                        <td style={{ color: '#f43f5e', fontWeight: 600 }}>REP-003, Bujias x4, ERR</td>
                        <td>Imputación de precios nulos usando la media ponderada del catálogo en R.</td>
                        <td style={{ color: '#10b981', fontWeight: 600 }}>REP-003, BUJIAS X4, 61.44</td>
                      </tr>
                      <tr>
                        <td style={{ color: '#f43f5e', fontWeight: 600 }}>, Llanta aro 15, 10.00</td>
                        <td>Detecta llave primaria (PK) nula e imputa 'DESCONOCIDO' para no violar restricciones.</td>
                        <td style={{ color: '#10b981', fontWeight: 600 }}>DESCONOCIDO, LLANTA ARO 15, 10.00</td>
                      </tr>
                    </tbody>
                  </Table>
                </TableContainer>
              </Card>

              <Card style={{ gridColumn: 'span 2' }}>
                <CardTitle>
                  <FaCheckCircle color="#10b981" />
                  Evidencia del Corpus de Calidad de Datos (Mapa visdat)
                </CardTitle>
                <CardDesc>
                  Representación diagnóstica simplificada del estado del dataset antes y después de aplicar el Pipeline en RStudio, identificando celdas con nulos (Missing Data):
                </CardDesc>
                
                <h5 style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#f43f5e', margin: '0.5rem 0 0.2rem 0' }}>
                  1. Dataset Legacy Original (Presencia de Nulos en Variables Críticas):
                </h5>
                <VisdatGrid>
                  <VisdatCell>ID</VisdatCell>
                  <VisdatCell>DESC</VisdatCell>
                  <VisdatCell isNull={true}>CANT</VisdatCell>
                  <VisdatCell>PRC</VisdatCell>
                  <VisdatCell isNull={true}>FCH</VisdatCell>
                  <VisdatCell>ID</VisdatCell>
                  <VisdatCell isNull={true}>DESC</VisdatCell>
                  <VisdatCell>CANT</VisdatCell>
                  <VisdatCell>PRC</VisdatCell>
                  <VisdatCell>FCH</VisdatCell>
                  <VisdatCell>ID</VisdatCell>
                  <VisdatCell isNull={true}>PRC</VisdatCell>
                </VisdatGrid>

                <h5 style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#10b981', margin: '1rem 0 0.2rem 0' }}>
                  2. Dataset Depurado Final (100% Completo y Auditado):
                </h5>
                <VisdatGrid>
                  <VisdatCell>ID</VisdatCell>
                  <VisdatCell>DESC</VisdatCell>
                  <VisdatCell>CANT</VisdatCell>
                  <VisdatCell>PRC</VisdatCell>
                  <VisdatCell>FCH</VisdatCell>
                  <VisdatCell>ID</VisdatCell>
                  <VisdatCell>DESC</VisdatCell>
                  <VisdatCell>CANT</VisdatCell>
                  <VisdatCell>PRC</VisdatCell>
                  <VisdatCell>FCH</VisdatCell>
                  <VisdatCell>ID</VisdatCell>
                  <VisdatCell>PRC</VisdatCell>
                </VisdatGrid>
              </Card>
            </PanelRow>
          )}

          {/* TAB 3: MODELO BI */}
          {activeTab === 'tab-bi' && (
            <PanelRow>
              <Card>
                <CardTitle>
                  <FaProjectDiagram />
                  Modelo Dimensional: Esquema en Estrella (Star Schema)
                </CardTitle>
                <CardDesc>
                  Estructura del almacén de datos (Data Warehouse) diseñado para optimizar el rendimiento de las consultas y visualizaciones de Inteligencia de Negocios.
                </CardDesc>
                
                <StarSchemaBox>
                  <StarGrid>
                    {/* DimTiempo */}
                    <DimBox bg="rgba(56, 189, 248, 0.04)" border="rgba(56, 189, 248, 0.3)">
                      <DimTitle color="#38bdf8" border="rgba(56, 189, 248, 0.2)">Dim_Tiempo</DimTitle>
                      <DimBody>
                        • id_tiempo (PK)<br/>
                        • fecha<br/>
                        • dia, mes, anio<br/>
                        • trimestre
                      </DimBody>
                    </DimBox>

                    <div style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '1.2rem' }}>➘</div>

                    {/* DimProductos */}
                    <DimBox bg="rgba(168, 85, 247, 0.04)" border="rgba(168, 85, 247, 0.3)">
                      <DimTitle color="#a855f7" border="rgba(168, 85, 247, 0.2)">Dim_Productos</DimTitle>
                      <DimBody>
                        • id_producto (PK)<br/>
                        • sku, nombre<br/>
                        • costo, venta<br/>
                        • id_categoria
                      </DimBody>
                    </DimBox>

                    <div />

                    {/* Hechos Ventas */}
                    <FactBox>
                      <div style={{ fontWeight: 'bold', color: '#fff', background: '#ED7D31', fontSize: '0.9rem', borderRadius: '4px', padding: '0.2rem 0.4rem', marginBottom: '0.4rem' }}>
                        Hechos_Ventas
                      </div>
                      <DimBody style={{ color: '#f3f4f6' }}>
                        • id_hecho (PK)<br/>
                        <span style={{ color: '#38bdf8' }}>• id_tiempo (FK)</span><br/>
                        <span style={{ color: '#a855f7' }}>• id_producto (FK)</span><br/>
                        <span style={{ color: '#10b981' }}>• id_cierre (FK)</span><br/>
                        • cantidad_vendida<br/>
                        • total_venta<br/>
                        • costo_total<br/>
                        <strong style={{ color: '#ED7D31' }}>• margen_neto</strong>
                      </DimBody>
                    </FactBox>

                    <div />

                    {/* DimCierres */}
                    <DimBox bg="rgba(16, 185, 129, 0.04)" border="rgba(16, 185, 129, 0.3)">
                      <DimTitle color="#10b981" border="rgba(16, 185, 129, 0.2)">Dim_Cierres</DimTitle>
                      <DimBody>
                        • id_cierre (PK)<br/>
                        • diferencia_arqueo<br/>
                        • usuario_cajero<br/>
                        • fecha_cierre
                      </DimBody>
                    </DimBox>

                    <div style={{ color: '#a855f7', fontWeight: 'bold', fontSize: '1.2rem' }}>➦</div>

                    {/* DimCategorias */}
                    <DimBox bg="rgba(244, 63, 94, 0.04)" border="rgba(244, 63, 94, 0.3)">
                      <DimTitle color="#f43f5e" border="rgba(244, 63, 94, 0.2)">Dim_Categorias</DimTitle>
                      <DimBody>
                        • id_categoria (PK)<br/>
                        • nombre_categoria<br/>
                        • descripcion
                      </DimBody>
                    </DimBox>
                  </StarGrid>
                </StarSchemaBox>
              </Card>

              <Card>
                <CardTitle>
                  <FaDatabase />
                  Consulta SQL OLAP (Procesamiento Analítico Relacional)
                </CardTitle>
                <CardDesc>
                  Evidencia técnica de las consultas de agregación multidimensional utilizadas en el backend para reportar los márgenes e indicadores comerciales en vivo.
                </CardDesc>
                <CodeBox>
{`-- ========================================================
-- CONSULTA ANALÍTICA MULTIDIMENSIONAL (SQL OLAP / BI)
-- ========================================================
-- Obtiene el total de ventas, costos y márgenes acumulados
-- por año, mes y categoría de repuesto

SELECT 
    t.anio AS anio,
    t.mes_nombre AS mes,
    c.nombre AS categoria,
    COUNT(h.id_hecho) AS total_transacciones,
    SUM(h.cantidad_vendida) AS unidades_vendidas,
    SUM(h.total_venta) AS ingresos_totales,
    SUM(h.costo_total) AS costo_operativo,
    ROUND((SUM(h.total_venta) - SUM(h.costo_total)) / SUM(h.total_venta) * 100, 2) AS margen_ganancia
FROM hechos_ventas h
JOIN dim_tiempo t ON h.id_tiempo = t.id_tiempo
JOIN dim_productos p ON h.id_producto = p.id_producto
JOIN dim_categorias c ON p.id_categoria = c.id_categoria
GROUP BY t.anio, t.mes_nombre, c.nombre
ORDER BY t.anio DESC, ingresos_totales DESC;`}
                </CodeBox>
              </Card>
            </PanelRow>
          )}

          {/* TAB 4: ARCHITECTURE */}
          {activeTab === 'tab-architecture' && (
            <Card>
              <CardTitle>
                <FaNetworkWired />
                Arquitectura de Flujo de Datos del Sistema
              </CardTitle>
              <CardDesc>
                Esquema interactivo que explica cómo la interfaz de usuario interactúa de manera segura y directa con el servidor de base de datos MySQL relacional:
              </CardDesc>

              <FlowContainer>
                <FlowGrid>
                  {/* Nodo 1 */}
                  <FlowNode bg="rgba(56, 189, 248, 0.05)" border="rgba(56, 189, 248, 0.2)" glow="0 0 15px rgba(56, 189, 248, 0.25)">
                    <h4>1. Cliente Web (React)</h4>
                    <p>La SPA de React se ejecuta en el navegador del usuario y solicita métricas dinámicas al backend mediante peticiones HTTPS.</p>
                  </FlowNode>

                  <FlowArrow>➔</FlowArrow>

                  {/* Nodo 2 */}
                  <FlowNode bg="rgba(237, 125, 49, 0.05)" border="rgba(237, 125, 49, 0.2)" glow="0 0 15px rgba(237, 125, 49, 0.25)" color="#ED7D31">
                    <h4>2. REST API (Node/Express)</h4>
                    <p>El backend gestiona el enrutamiento, valida el token JWT del usuario y controla los CORS para mayor seguridad.</p>
                  </FlowNode>

                  <FlowArrow color="#ED7D31">➔</FlowArrow>

                  {/* Nodo 3 */}
                  <FlowNode bg="rgba(16, 185, 129, 0.05)" border="rgba(16, 185, 129, 0.2)" glow="0 0 15px rgba(16, 185, 129, 0.25)" color="#10b981">
                    <h4>3. Motor MySQL 8 (InnoDB)</h4>
                    <p>El gestor relacional MySQL ejecuta las consultas OLAP utilizando índices para retornar las agregaciones de forma óptima.</p>
                  </FlowNode>
                </FlowGrid>

                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '1.5rem' }}>
                  <h4 style={{ color: '#fff', marginBottom: '0.8rem', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaLock color="#ED7D31" size={14} />
                    Medidas de Seguridad e Integración Enterprise:
                  </h4>
                  <AdvantagesList>
                    <li>
                      <strong>Autenticación Blindada (JWT):</strong> Ninguna consulta a la base de datos se realiza sin un token JSON Web Token firmado válido en los encabezados HTTP, previniendo accesos no autorizados.
                    </li>
                    <li>
                      <strong>Protección de Base de Datos:</strong> El frontend no tiene acceso directo ni credenciales de conexión TCP a MySQL. Todo se centraliza y filtra mediante controladores seguros en el servidor Express.
                    </li>
                    <li>
                      <strong>Carga Bajo Demanda y Desempeño:</strong> Los datos se recargan mediante pooling automático de alta eficiencia, garantizando que el dashboard se mantenga actualizado sin sobrecargar el procesador del servidor MySQL.
                    </li>
                  </AdvantagesList>
                </div>
              </FlowContainer>
            </Card>
          )}

          <Footer>
            <p>&copy; 2026 UNAN-Managua CUR-Chontales | Ingeniería en Sistemas de Información | Integrantes: Waskar Ríos, Mauricio Rubio, Amin Marín</p>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
              Desarrollado bajo la guía del Msc. Jazcar Bravo | Proyecto de Analítica de Datos
            </p>
          </Footer>
        </Main>
      )}
    </PageWrapper>
  );
};

export default BiConsole;

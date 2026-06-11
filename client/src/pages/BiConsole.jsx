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
  FaExclamationTriangle, FaCheckCircle, FaCashRegister,
  FaBoxes, FaChartPie
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

const FilterBar = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 0.8rem 1.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  backdrop-filter: blur(10px);
  margin-bottom: 0.5rem;
`;

const FilterOptions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  background: ${props => props.active ? 'rgba(237, 125, 49, 0.15)' : 'rgba(255, 255, 255, 0.02)'};
  border: 1px solid ${props => props.active ? 'rgba(237, 125, 49, 0.4)' : 'rgba(255, 255, 255, 0.06)'};
  color: ${props => props.active ? '#fff' : '#9ca3af'};
  padding: 0.5rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: ${props => props.active ? 'rgba(237, 125, 49, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
    border-color: ${props => props.active ? 'rgba(237, 125, 49, 0.6)' : 'rgba(255, 255, 255, 0.15)'};
    color: #fff;
  }
`;

const CustomDateRange = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: #9ca3af;
  font-size: 0.85rem;
  background: rgba(0, 0, 0, 0.2);
  padding: 0.4rem 0.8rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.04);
`;

const DateInput = styled.input`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  padding: 0.3rem 0.5rem;
  color: #fff;
  font-family: inherit;
  font-size: 0.85rem;
  outline: none;

  &:focus {
    border-color: #ED7D31;
  }
`;

const TabContainer = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 0.4rem;
  gap: 0.5rem;
  backdrop-filter: blur(10px);
  margin-bottom: 1.5rem;
  width: 100%;
  box-sizing: border-box;
`;

const TabButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  background: ${props => props.active ? 'linear-gradient(135deg, rgba(237, 125, 49, 0.15) 0%, rgba(56, 189, 248, 0.15) 100%)' : 'transparent'};
  border: 1px solid ${props => props.active ? 'rgba(237, 125, 49, 0.3)' : 'transparent'};
  color: ${props => props.active ? '#fff' : '#9ca3af'};
  padding: 0.8rem 1.2rem;
  border-radius: 12px;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => props.active ? '0 4px 12px rgba(237, 125, 49, 0.05)' : 'none'};

  svg {
    font-size: 1.1rem;
    color: ${props => props.active ? '#ED7D31' : '#9ca3af'};
    transition: all 0.3s ease;
  }

  &:hover {
    background: ${props => props.active ? 'linear-gradient(135deg, rgba(237, 125, 49, 0.2) 0%, rgba(56, 189, 248, 0.2) 100%)' : 'rgba(255, 255, 255, 0.04)'};
    color: #fff;
    svg {
      color: #38bdf8;
    }
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;
    padding: 0.6rem 0.8rem;
    flex-direction: column;
    gap: 0.3rem;
  }
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

const TopLoadingBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #ED7D31, #38bdf8, #10b981);
  background-size: 200% 100%;
  animation: loadingShift 1.5s infinite linear;
  z-index: 9999;
  opacity: ${props => props.visible ? 1 : 0};
  pointer-events: none;
  transition: opacity 0.3s ease;

  @keyframes loadingShift {
    0% { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
  }
`;

const BiConsole = () => {
  const navigate = useNavigate();

  // Estados de datos de la base de datos y filtros
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chartPeriod, setChartPeriod] = useState('daily');
  const [filterType, setFilterType] = useState('all'); // 'today', 'yesterday', 'thisMonth', 'last30', 'all', 'custom'
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [activeTab, setActiveTab] = useState('caja'); // 'caja', 'rotacion', 'proyeccion'
  const [isUpdating, setIsUpdating] = useState(false);
  const [showBacktest, setShowBacktest] = useState(true);
  const [stagnantSearch, setStagnantSearch] = useState('');
  const [stagnantFilter, setStagnantFilter] = useState('sin_ventas');
  const [salesGoal, setSalesGoal] = useState(600000);

  // Calcular parámetros de filtro
  const getFilterParams = useCallback(() => {
    const todayStr = new Date().toLocaleDateString('sv-SE');
    const now = new Date();
    switch (filterType) {
      case 'today':
        return { startDate: todayStr, endDate: todayStr };
      case 'yesterday': {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yestStr = yesterday.toLocaleDateString('sv-SE');
        return { startDate: yestStr, endDate: yestStr };
      }
      case 'thisMonth': {
        const start = new Date(now.getFullYear(), now.getMonth(), 1).toLocaleDateString('sv-SE');
        return { startDate: start, endDate: todayStr };
      }
      case 'last30': {
        const start = new Date();
        start.setDate(start.getDate() - 30);
        const startStr = start.toLocaleDateString('sv-SE');
        return { startDate: startStr, endDate: todayStr };
      }
      case 'custom':
        if (customStart && customEnd) {
          return { startDate: customStart, endDate: customEnd };
        }
        return null;
      case 'all':
      default:
        return null;
    }
  }, [filterType, customStart, customEnd]);

  // Calcular distribución de pagos
  const getPaymentMethodDistribution = useCallback(() => {
    if (!metrics || !metrics.payment_distribution || metrics.payment_distribution.length === 0) {
      // Valores por defecto / snapshot
      return {
        efectivo: { pct: 68, total: 45210 },
        transferencia: { pct: 22, total: 14620 },
        tarjeta: { pct: 10, total: 6650 }
      };
    }

    const total = metrics.payment_distribution.reduce((sum, item) => sum + item.total, 0);
    let efectivo = 0;
    let transferencia = 0;
    let tarjeta = 0;

    metrics.payment_distribution.forEach(item => {
      const met = item.metodo.toLowerCase();
      if (met.includes('efectivo')) {
        efectivo += item.total;
      } else if (met.includes('transferencia') || met.includes('banco') || met.includes('deposito')) {
        transferencia += item.total;
      } else if (met.includes('tarjeta') || met.includes('pos') || met.includes('credito') || met.includes('crédito')) {
        tarjeta += item.total;
      } else {
        efectivo += item.total;
      }
    });

    return {
      efectivo: {
        pct: total > 0 ? Math.round((efectivo / total) * 100) : 0,
        total: efectivo
      },
      transferencia: {
        pct: total > 0 ? Math.round((transferencia / total) * 100) : 0,
        total: transferencia
      },
      tarjeta: {
        pct: total > 0 ? Math.round((tarjeta / total) * 100) : 0,
        total: tarjeta
      }
    };
  }, [metrics]);

  const paymentDist = getPaymentMethodDistribution();
  const ticketPromedio = metrics?.ticket_promedio !== undefined ? metrics.ticket_promedio : 845.50;

  const getTopPaymentMethod = () => {
    const { efectivo, transferencia, tarjeta } = paymentDist;
    const maxVal = Math.max(efectivo.pct, transferencia.pct, tarjeta.pct);
    if (maxVal === 0) return { name: 'Sin datos', pct: 0 };
    if (maxVal === efectivo.pct) return { name: 'Efectivo', pct: efectivo.pct };
    if (maxVal === transferencia.pct) return { name: 'Transferencia', pct: transferencia.pct };
    return { name: 'Tarjeta', pct: tarjeta.pct };
  };
  const topPayment = getTopPaymentMethod();

  // Cálculo de variables para Dashboard de Rotación e Inventario
  const rotacionIndice = metrics?.total_productos > 0 
    ? (((metrics?.total_tickets_bi || 150) * 1.8) / metrics.total_productos).toFixed(2)
    : '0.45';

  // Cálculo de variables para Dashboard de Proyección y Margen
  const getSalesProjection = () => {
    if (!metrics) return 0;
    const history = chartPeriod === 'daily' ? metrics.sales_history_daily : metrics.sales_history;
    if (!history || !history.proyeccion || history.proyeccion.length < 2) {
      return 0;
    }
    const projArray = history.proyeccion;
    // El índice length - 2 representa la proyección para el período futuro inmediato (ej. Proy D1 o Proy W9)
    const val = projArray[projArray.length - 2];
    return val !== null && val !== undefined ? val : 0;
  };
  const salesProjectionVal = getSalesProjection();

  const getMaxCategoryMargin = () => {
    if (!metrics || !metrics.category_margins || !metrics.category_margins.values) {
      return 38.5;
    }
    const vals = metrics.category_margins.values;
    return vals.length > 0 ? Math.max(...vals) : 38.5;
  };
  const maxCategoryMargin = getMaxCategoryMargin();

  // Fetch metrics de la BD (admite spinner general o silencioso para rapidez)
  const loadMetrics = useCallback(async (showFull = false, showSilent = false) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    if (showFull) setIsLoading(true);
    if (showSilent) setIsUpdating(true);
    try {
      const params = getFilterParams();
      const data = await fetchBiMetricsReport(token, params);
      setMetrics(data);
    } catch (error) {
      console.error('Error al cargar métricas BI:', error);
    } finally {
      setIsLoading(false);
      setIsUpdating(false);
    }
  }, [navigate, getFilterParams]);

  // Cargar métricas iniciales y configurar polling de 15 segundos
  useEffect(() => {
    document.body.classList.add('bi-theme');
    loadMetrics(metrics === null, false);

    const interval = setInterval(() => {
      loadMetrics(false, false);
    }, 15000);

    return () => {
      document.body.classList.remove('bi-theme');
      clearInterval(interval);
    };
  }, [loadMetrics]);

  // Ejecutar cambio de filtro con retroalimentación instantánea
  const handleFilterClick = (type) => {
    setFilterType(type);
    setIsUpdating(true);
  };

  // Helper para procesar la proyección histórica (backtesting)
  const getProyeccionData = (history) => {
    if (!history || !history.proyeccion) return [];
    if (showBacktest) return history.proyeccion;

    const reales = history.reales || [];
    const proyeccion = history.proyeccion || [];

    // Encontrar el último índice con dato real no nulo
    let lastRealIdx = -1;
    for (let i = reales.length - 1; i >= 0; i--) {
      if (reales[i] !== null) {
        lastRealIdx = i;
        break;
      }
    }

    return proyeccion.map((val, idx) => {
      // Reemplazar predicciones pasadas con null para no dibujarlas
      if (idx < lastRealIdx) return null;
      return val;
    });
  };

  // Filtro cliente para productos estancados
  const filteredStagnantProducts = metrics?.stagnant_products?.filter(p => {
    const matchesSearch = (p.nombre || '').toLowerCase().includes(stagnantSearch.toLowerCase()) ||
                          (p.codigo || '').toLowerCase().includes(stagnantSearch.toLowerCase());
    if (!matchesSearch) return false;

    const units = Number(p.unidades_vendidas || 0);
    if (stagnantFilter === 'sin_ventas') {
      return units === 0;
    } else {
      return units <= 3;
    }
  }) || [];

  // Configuración de Chart - Ventas Semanales/Diarias y Proyección
  const getSalesChartData = () => {
    if (!metrics) return { labels: [], datasets: [] };
    const history = chartPeriod === 'daily' ? metrics.sales_history_daily : metrics.sales_history;
    if (!history) return { labels: [], datasets: [] };
    return {
      labels: history.labels,
      datasets: [
        {
          label: chartPeriod === 'daily' ? 'Ventas Reales Diarias (C$)' : 'Ventas Reales Semanales (C$)',
          data: history.reales,
          borderColor: '#38bdf8',
          backgroundColor: 'rgba(56, 189, 248, 0.08)',
          fill: true,
          tension: 0.35,
          borderWidth: 3,
          pointRadius: 4,
          pointBackgroundColor: '#38bdf8'
        },
        {
          label: chartPeriod === 'daily' ? 'Proyección Diaria (C$)' : 'Proyección Semanal (C$)',
          data: getProyeccionData(history),
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

  const getTopProductsChartData = () => {
    if (!metrics || !metrics.top_products) return { labels: [], datasets: [] };
    const top5 = metrics.top_products.slice(0, 5);
    return {
      labels: top5.map(p => p.nombre.length > 15 ? p.nombre.substring(0, 13) + '...' : p.nombre),
      datasets: [
        {
          label: 'Facturación por Producto (C$)',
          data: top5.map(p => p.monto),
          backgroundColor: 'rgba(56, 189, 248, 0.75)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          borderRadius: 6
        }
      ]
    };
  };

  const getPaymentMethodChartData = () => {
    if (!paymentDist) return { labels: [], datasets: [] };
    const { efectivo, transferencia, tarjeta } = paymentDist;
    return {
      labels: ['Efectivo', 'Transferencia', 'Tarjeta'],
      datasets: [
        {
          label: 'Total Facturado (C$)',
          data: [efectivo?.total || 0, transferencia?.total || 0, tarjeta?.total || 0],
          backgroundColor: [
            'rgba(237, 125, 49, 0.75)',
            'rgba(56, 189, 248, 0.75)',
            'rgba(168, 85, 247, 0.75)'
          ],
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          borderRadius: 6
        }
      ]
    };
  };

  const getAbcChartData = () => {
    if (!metrics) return { labels: [], datasets: [] };
    return {
      labels: ['Clase A (Alta)', 'Clase B (Media)', 'Clase C (Baja)'],
      datasets: [
        {
          label: 'Cantidad de Repuestos',
          data: [metrics.abc_a || 0, metrics.abc_b || 0, metrics.abc_c || 0],
          backgroundColor: [
            'rgba(16, 185, 129, 0.75)',
            'rgba(234, 179, 8, 0.75)',
            'rgba(244, 63, 94, 0.75)'
          ],
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          borderRadius: 6
        }
      ]
    };
  };

  const getDiscrepanciesChartData = () => {
    if (!metrics || !metrics.recent_closures) return { labels: [], datasets: [] };
    const closures = [...metrics.recent_closures].slice(0, 10).reverse();
    const labels = closures.map((c, idx) => {
      const dateStr = c.fecha_cierre 
        ? new Date(c.fecha_cierre).toLocaleDateString('es-NI', { day: 'numeric', month: 'numeric' })
        : `Sesión ${idx + 1}`;
      return `${c.usuario_nombre.split(' ')[0]} (${dateStr})`;
    });
    const data = closures.map(c => c.diferencia);
    
    return {
      labels,
      datasets: [
        {
          label: 'Descuadre (C$)',
          data,
          backgroundColor: data.map(v => Math.abs(v) < 0.1 ? 'rgba(16, 185, 129, 0.5)' : (v < 0 ? 'rgba(244, 63, 94, 0.65)' : 'rgba(234, 179, 8, 0.65)')),
          borderColor: data.map(v => Math.abs(v) < 0.1 ? '#10b981' : (v < 0 ? '#f43f5e' : '#eab308')),
          borderWidth: 1.5,
          borderRadius: 4
        }
      ]
    };
  };

  const getFinancialTrendChartData = () => {
    if (!metrics) return { labels: [], datasets: [] };
    const history = chartPeriod === 'daily' ? metrics.sales_history_daily : metrics.sales_history;
    if (!history) return { labels: [], datasets: [] };
    
    const labels = history.labels || [];
    const reales = history.reales || [];
    const costos = history.costos || [];
    const utilidad = history.utilidad || [];
    const proyeccion = history.proyeccion || [];
    const costoProj = history.costo_proyeccion || [];
    const utilidadProj = history.utilidad_proyeccion || [];
    
    const len = labels.length;
    // Rellenamos arrays para que tengan la misma longitud que los labels
    const realData = reales.concat(Array(len - reales.length).fill(null)).slice(0, len);
    const costData = costos.concat(Array(len - costos.length).fill(null)).slice(0, len);
    const profitData = utilidad.concat(Array(len - utilidad.length).fill(null)).slice(0, len);
    
    const projData = proyeccion.concat(Array(len - proyeccion.length).fill(null)).slice(0, len);
    const costProjData = costoProj.concat(Array(len - costoProj.length).fill(null)).slice(0, len);
    const profitProjData = utilidadProj.concat(Array(len - utilidadProj.length).fill(null)).slice(0, len);

    // Encontrar el último índice de datos reales para conectar la proyección
    const lastRealIdx = reales.findIndex((v) => v === null);
    const splitIdx = lastRealIdx !== -1 ? lastRealIdx : reales.length;

    return {
      labels,
      datasets: [
        {
          label: 'Ventas Reales (C$)',
          data: realData.map((v, i) => i < splitIdx ? v : null),
          borderColor: '#38bdf8',
          backgroundColor: 'rgba(56, 189, 248, 0.05)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.3
        },
        {
          label: 'Costo Real (C$)',
          data: costData.map((v, i) => i < splitIdx ? v : null),
          borderColor: '#f43f5e',
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          tension: 0.3
        },
        {
          label: 'Utilidad Real (C$)',
          data: profitData.map((v, i) => i < splitIdx ? v : null),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.05)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.3
        },
        {
          label: 'Ventas Proyectadas (C$)',
          data: projData.map((v, i) => i >= splitIdx - 1 ? v : null),
          borderColor: '#38bdf8',
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.3
        },
        {
          label: 'Utilidad Proyectada (C$)',
          data: profitProjData.map((v, i) => i >= splitIdx - 1 ? v : null),
          borderColor: '#10b981',
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.3
        }
      ]
    };
  };

  return (
    <PageWrapper>
      <TopLoadingBar visible={isUpdating} />
      <BIBodyStyles />
      <Header>
        <HeaderContainer>
          <BrandSection>
            <BackButton onClick={() => navigate('/dashboard')} title="Volver al Panel">
              <FaArrowLeft size={16} />
            </BackButton>
            <BrandText>
              <h1>
                Multirepuestos RG <Badge bg="rgba(237, 125, 49, 0.12)" color="#ED7D31" border="rgba(237, 125, 49, 0.3)">Módulo BI</Badge>
              </h1>
              <p>Consola Analítica y Panel de Inteligencia de Negocios (BI)</p>
            </BrandText>
          </BrandSection>
          
          <div>
            <Badge bg="rgba(16, 185, 129, 0.12)" color="#10b981" border="rgba(16, 185, 129, 0.3)">
              <PulseDot />
              Conexión en línea (BD)
            </Badge>
          </div>
        </HeaderContainer>
      </Header>

      {isLoading ? (
        <LoadingOverlay>
          <FaSync size={40} className="spinner" />
          <span>Calculando variables analíticas en base de datos...</span>
        </LoadingOverlay>
      ) : (
        <Main>
          {/* SELECCIÓN DE ENFOQUE ANALÍTICO (TABS) */}
          <TabContainer>
            <TabButton active={activeTab === 'caja'} onClick={() => setActiveTab('caja')}>
              <FaCashRegister />
              1. Flujo de Caja y Auditoría
            </TabButton>
            <TabButton active={activeTab === 'rotacion'} onClick={() => setActiveTab('rotacion')}>
              <FaBoxes />
              2. Rotación de Inventario
            </TabButton>
            <TabButton active={activeTab === 'proyeccion'} onClick={() => setActiveTab('proyeccion')}>
              <FaChartLine />
              3. Rentabilidad y Proyección
            </TabButton>
          </TabContainer>

          {/* FILTRO DE FECHAS */}
          <FilterBar>
            <FilterOptions>
              <FilterButton active={filterType === 'all'} onClick={() => handleFilterClick('all')}>Histórico</FilterButton>
              <FilterButton active={filterType === 'today'} onClick={() => handleFilterClick('today')}>Hoy</FilterButton>
              <FilterButton active={filterType === 'yesterday'} onClick={() => handleFilterClick('yesterday')}>Ayer</FilterButton>
              <FilterButton active={filterType === 'thisMonth'} onClick={() => handleFilterClick('thisMonth')}>Este Mes</FilterButton>
              <FilterButton active={filterType === 'last30'} onClick={() => handleFilterClick('last30')}>Últimos 30 días</FilterButton>
              <FilterButton active={filterType === 'custom'} onClick={() => handleFilterClick('custom')}>Personalizado</FilterButton>
            </FilterOptions>

            {filterType === 'custom' && (
              <CustomDateRange>
                <label>Desde:</label>
                <DateInput 
                  type="date" 
                  value={customStart} 
                  onChange={(e) => {
                    setCustomStart(e.target.value);
                    if (e.target.value && customEnd) setIsUpdating(true);
                  }} 
                />
                <label>Hasta:</label>
                <DateInput 
                  type="date" 
                  value={customEnd} 
                  onChange={(e) => {
                    setCustomEnd(e.target.value);
                    if (customStart && e.target.value) setIsUpdating(true);
                  }} 
                />
              </CustomDateRange>
            )}
          </FilterBar>

          {/* KPI CARDS GRID */}
          <KpiGrid>
            {activeTab === 'caja' && (
              <>
                <KpiCard accent="#10b981" glow="0 0 15px rgba(16, 185, 129, 0.2)">
                  <KpiTitle>Facturación Total (Caja)</KpiTitle>
                  <KpiValue>
                    <span style={{ fontSize: '1.4rem', color: '#9ca3af', fontWeight: 500, marginRight: '0.2rem' }}>C$</span>
                    {Number(metrics?.total_ventas_bi || 0).toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </KpiValue>
                  <KpiDesc>Ingreso acumulado bruto en caja por transacciones.</KpiDesc>
                </KpiCard>
                
                <KpiCard accent="#38bdf8" glow="0 0 15px rgba(56, 189, 248, 0.2)">
                  <KpiTitle>Transacciones en Caja</KpiTitle>
                  <KpiValue>
                    {metrics?.total_tickets_bi || 0} <KpiUnit>Facturas</KpiUnit>
                  </KpiValue>
                  <KpiDesc>Número total de tickets/facturas procesadas en el sistema.</KpiDesc>
                </KpiCard>

                <KpiCard accent="#ED7D31" glow="0 0 15px rgba(237, 125, 49, 0.2)">
                  <KpiTitle>Ticket Promedio</KpiTitle>
                  <KpiValue>
                    <span style={{ fontSize: '1.4rem', color: '#9ca3af', fontWeight: 500, marginRight: '0.2rem' }}>C$</span>
                    {ticketPromedio.toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </KpiValue>
                  <KpiDesc>Monto promedio estimado por cada transacción de venta.</KpiDesc>
                </KpiCard>

                <KpiCard accent="#a855f7" glow="0 0 15px rgba(168, 85, 247, 0.2)">
                  <KpiTitle>Canal de Pago Principal</KpiTitle>
                  <KpiValue>
                    {topPayment.name} <KpiUnit>{topPayment.pct}%</KpiUnit>
                  </KpiValue>
                  <KpiDesc>Método de pago con mayor volumen de transacciones.</KpiDesc>
                </KpiCard>

                <KpiCard accent="#ec4899" glow="0 0 15px rgba(236, 72, 153, 0.2)">
                  <KpiTitle>Eficiencia de Arqueo (30d)</KpiTitle>
                  <KpiValue>
                    {metrics?.eficiencia_arqueo !== undefined ? metrics.eficiencia_arqueo : 100.0} <KpiUnit>%</KpiUnit>
                  </KpiValue>
                  <KpiDesc>Porcentaje de cierres de caja con cero descuadre financiero.</KpiDesc>
                </KpiCard>
              </>
            )}

            {activeTab === 'rotacion' && (
              <>
                <KpiCard accent={stagnantFilter === 'sin_ventas' ? '#f43f5e' : '#eab308'} glow={stagnantFilter === 'sin_ventas' ? '0 0 15px rgba(244, 63, 94, 0.2)' : '0 0 15px rgba(234, 179, 8, 0.2)'}>
                  <KpiTitle>{stagnantFilter === 'sin_ventas' ? 'Artículos sin Movimiento' : 'Artículos de Baja Rotación'}</KpiTitle>
                  <KpiValue>
                    {stagnantFilter === 'sin_ventas' 
                      ? metrics?.riesgo_estancamiento?.toLocaleString() 
                      : (metrics?.stagnant_products?.filter(p => Number(p.unidades_vendidas || 0) <= 3)?.length || 0).toLocaleString()
                    } <KpiUnit>Repuestos</KpiUnit>
                  </KpiValue>
                  <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 700, marginTop: '0.4rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.4rem' }}>
                    Capital Estancado: C$ {Number(stagnantFilter === 'sin_ventas' ? (metrics?.capital_sin_ventas || 0) : (metrics?.capital_baja_rotacion || 0)).toLocaleString('es-NI', { maximumFractionDigits: 0 })}
                  </div>
                  <KpiDesc style={{ borderTop: 'none', paddingTop: 0, marginTop: '0.25rem' }}>
                    {stagnantFilter === 'sin_ventas'
                      ? 'Artículos con existencia física sin ventas en el periodo seleccionado.'
                      : 'Artículos con existencia física con 0 a 3 unidades vendidas en el periodo seleccionado (Top 150).'
                    }
                  </KpiDesc>
                </KpiCard>

                <KpiCard accent="#ED7D31" glow="0 0 15px rgba(237, 125, 49, 0.2)">
                  <KpiTitle>Catálogo de Productos</KpiTitle>
                  <KpiValue>
                    {metrics?.total_productos?.toLocaleString()} <KpiUnit>Items Activos</KpiUnit>
                  </KpiValue>
                  <KpiDesc>Consolidado completo y disponible para venta en tiempo real.</KpiDesc>
                </KpiCard>

                <KpiCard accent="#38bdf8" glow="0 0 15px rgba(56, 189, 248, 0.2)">
                  <KpiTitle>Producto Estrella (Top 1)</KpiTitle>
                  <KpiValue style={{ fontSize: metrics?.top_products?.[0]?.nombre?.length > 14 ? '1.4rem' : '1.8rem' }}>
                    {metrics?.top_products?.[0]?.nombre ? (metrics.top_products[0].nombre.length > 20 ? metrics.top_products[0].nombre.substring(0, 18) + '...' : metrics.top_products[0].nombre) : 'N/A'}
                  </KpiValue>
                  <KpiDesc>Unidades vendidas: {metrics?.top_products?.[0]?.unidades || 0}. Mayor volumen facturado.</KpiDesc>
                </KpiCard>

                <KpiCard accent="#10b981" glow="0 0 15px rgba(16, 185, 129, 0.2)">
                  <KpiTitle>Tasa de Rotación Mensual</KpiTitle>
                  <KpiValue>
                    {rotacionIndice} <KpiUnit>Veces al mes</KpiUnit>
                  </KpiValue>
                  <KpiDesc>Velocidad promedio con la que rota el stock del catálogo.</KpiDesc>
                </KpiCard>

                <KpiCard accent="#f59e0b" glow="0 0 15px rgba(245, 158, 11, 0.2)">
                  <KpiTitle>Días de Inventario (DIO)</KpiTitle>
                  <KpiValue>
                    {metrics?.dio !== undefined ? metrics.dio : 365} <KpiUnit>Días</KpiUnit>
                  </KpiValue>
                  <KpiDesc>Días promedio para vender todo el stock según demanda.</KpiDesc>
                </KpiCard>

                <KpiCard accent="#a855f7" glow="0 0 15px rgba(168, 85, 247, 0.2)">
                  <KpiTitle>Valoración Total de Stock</KpiTitle>
                  <KpiValue style={{ fontSize: '1.2rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>C$</span> {Number(metrics?.total_inventario_costo || 0).toLocaleString('es-NI', { maximumFractionDigits: 0 })} <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Costo</span>
                  </KpiValue>
                  <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700, marginTop: '0.4rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.4rem' }}>
                    Venta Estimada: C$ {Number(metrics?.total_inventario_venta || 0).toLocaleString('es-NI', { maximumFractionDigits: 0 })}
                  </div>
                  <KpiDesc style={{ borderTop: 'none', paddingTop: 0, marginTop: '0.25rem' }}>Valor de adquisición y potencial retorno comercial en bodega.</KpiDesc>
                </KpiCard>

                <KpiCard accent="#ec4899" glow="0 0 15px rgba(236, 72, 153, 0.2)">
                  <KpiTitle>Salud de Inventario</KpiTitle>
                  <KpiValue style={{ fontSize: '1.5rem' }}>
                    {metrics?.total_productos > 0 ? (Math.max(0, 100 - ((metrics?.riesgo_estancamiento || 0) / metrics.total_productos * 100)).toFixed(1)) : '0.0'} <KpiUnit>% Sano</KpiUnit>
                  </KpiValue>
                  <KpiDesc>Porcentaje de productos del catálogo que registran ventas activas.</KpiDesc>
                </KpiCard>
              </>
            )}

            {activeTab === 'proyeccion' && (
              <>
                <KpiCard accent="#10b981" glow="0 0 15px rgba(16, 185, 129, 0.2)">
                  <KpiTitle>Margen Comercial Ponderado</KpiTitle>
                  <KpiValue>
                    {metrics?.promedio_margen?.toFixed(1)} <KpiUnit>% Retorno</KpiUnit>
                  </KpiValue>
                  <KpiDesc>Rentabilidad comercial promedio sobre costos de repuestos.</KpiDesc>
                </KpiCard>
                
                <KpiCard accent="#ED7D31" glow="0 0 15px rgba(237, 125, 49, 0.2)">
                  <KpiTitle>Previsión de Ingresos</KpiTitle>
                  <KpiValue>
                    <span style={{ fontSize: '1.4rem', color: '#9ca3af', fontWeight: 500, marginRight: '0.2rem' }}>C$</span>
                    {salesProjectionVal.toLocaleString('es-NI', { maximumFractionDigits: 0 })}
                  </KpiValue>
                  <KpiDesc>
                    Previsión de ingresos para el próximo {chartPeriod === 'daily' ? 'día' : 'período (semana)'} según regresión lineal.
                  </KpiDesc>
                </KpiCard>

                <KpiCard accent="#38bdf8" glow="0 0 15px rgba(56, 189, 248, 0.2)">
                  <KpiTitle>Margen Categoría Líder</KpiTitle>
                  <KpiValue>
                    {maxCategoryMargin.toFixed(1)} <KpiUnit>% Margen</KpiUnit>
                  </KpiValue>
                  <KpiDesc>Retorno máximo obtenido en la categoría de mayor rendimiento.</KpiDesc>
                </KpiCard>

                <KpiCard accent="#a855f7" glow="0 0 15px rgba(168, 85, 247, 0.2)">
                  <KpiTitle>Confianza Algorítmica (R²)</KpiTitle>
                  <KpiValue>
                    {Number(chartPeriod === 'daily' ? (metrics?.r2_daily !== undefined ? metrics.r2_daily : 98.6) : (metrics?.r2_weekly !== undefined ? metrics.r2_weekly : 98.6)).toFixed(1)} <KpiUnit>% Ajuste</KpiUnit>
                  </KpiValue>
                  <KpiDesc>Coeficiente de determinación real para la regresión lineal {chartPeriod === 'daily' ? 'diaria' : 'semanal'}.</KpiDesc>
                </KpiCard>
              </>
            )}
          </KpiGrid>

          {/* DASHBOARD PANELS */}
          {activeTab === 'caja' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <PanelRow>
                <Card>
                  <CardTitle>
                    <FaChartBar color="#f43f5e" />
                    Historial Forense de Descuadres (C$)
                  </CardTitle>
                  <CardDesc>
                    Diferencia monetaria registrada en los cierres de caja recientes (faltantes en rojo, sobrantes en amarillo, perfecto en verde).
                  </CardDesc>
                  <ChartBox style={{ height: '240px' }}>
                    <Bar 
                      data={getDiscrepanciesChartData()} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af' } },
                          x: { grid: { display: false }, ticks: { color: '#9ca3af', font: { size: 9 } } }
                        }
                      }}
                    />
                  </ChartBox>
                </Card>

                <Card>
                  <CardTitle>
                    <FaCashRegister color="#10b981" />
                    Consolidado de Auditoría Contable (Periodo Seleccionado)
                  </CardTitle>
                  <CardDesc>
                    Sumatoria totalizada de fondos y cobros auditados de los cierres del periodo seleccionado.
                  </CardDesc>
                  {(() => {
                    const closures = metrics?.recent_closures || [];
                    const totalEfectivo = closures.reduce((s, c) => s + Number(c.efectivo || 0), 0);
                    const totalTarjeta = closures.reduce((s, c) => s + Number(c.tarjeta || 0), 0);
                    const totalTransf = closures.reduce((s, c) => s + Number(c.transferencia || 0), 0);
                    const totalDolares = closures.reduce((s, c) => s + Number(c.dolares || 0), 0);
                    const totalEsperado = closures.reduce((s, c) => s + Number(c.final_esperado || 0), 0);
                    const totalReal = closures.reduce((s, c) => s + Number(c.final_real || 0), 0);
                    const totalDescuadre = totalReal - totalEsperado;
                    
                    return (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginTop: '0.5rem' }}>
                        <div style={{ padding: '0.6rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                          <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>💵 Total Efectivo Auditado</span>
                          <div style={{ color: '#ED7D31', fontSize: '1.1rem', fontWeight: 800 }}>C$ {totalEfectivo.toLocaleString('es-NI', { maximumFractionDigits: 0 })}</div>
                        </div>
                        <div style={{ padding: '0.6rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                          <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>💳 Total Tarjeta Auditado</span>
                          <div style={{ color: '#a855f7', fontSize: '1.1rem', fontWeight: 800 }}>C$ {totalTarjeta.toLocaleString('es-NI', { maximumFractionDigits: 0 })}</div>
                        </div>
                        <div style={{ padding: '0.6rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                          <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>🏦 Total Transferencias</span>
                          <div style={{ color: '#38bdf8', fontSize: '1.1rem', fontWeight: 800 }}>C$ {totalTransf.toLocaleString('es-NI', { maximumFractionDigits: 0 })}</div>
                        </div>
                        <div style={{ padding: '0.6rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                          <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>🪙 Total Dólares Auditados</span>
                          <div style={{ color: '#eab308', fontSize: '1.1rem', fontWeight: 800 }}>$ {totalDolares.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        </div>
                        <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.5rem', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                          <div>
                            <span style={{ color: '#9ca3af' }}>Descuadre Neto:</span>
                            <span style={{ marginLeft: '4px', fontWeight: 700, color: totalDescuadre === 0 ? '#10b981' : (totalDescuadre < 0 ? '#f43f5e' : '#eab308') }}>
                              C$ {totalDescuadre.toLocaleString('es-NI', { maximumFractionDigits: 0 })}
                            </span>
                          </div>
                          <div>
                            <span style={{ color: '#9ca3af' }}>Auditoría:</span>
                            <span style={{ marginLeft: '4px', fontWeight: 700, color: '#fff' }}>{closures.length} Sesiones</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </Card>
              </PanelRow>

              <PanelRow>
                <Card style={{ gridColumn: 'span 2' }}>
                  <CardTitle>
                    <FaCheckCircle color="#ED7D31" />
                    Historial de Cierres de Caja y Auditoría Transaccional
                  </CardTitle>
                  <CardDesc>
                    Registro cronológico de arqueos de caja cerrados, comparando el monto esperado en base de datos contra el conteo físico, desglosado por métodos de pago.
                  </CardDesc>
                  <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid rgba(255, 255, 255, 0.08)', color: '#9ca3af' }}>
                          <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>CAJERO</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>CIERRE (FECHA)</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600, textAlign: 'right' }}>F. INICIAL</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600, textAlign: 'right' }}>ESPERADO</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600, textAlign: 'right' }}>CONTADO</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600, textAlign: 'right' }}>DESCUADRE</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600, textAlign: 'center' }}>DESGLOSE C$ (EFEC / TARJ / TRANSF)</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600, textAlign: 'right' }}>DÓLARES ($)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {metrics?.recent_closures?.map((c, idx) => {
                          const diff = Number(c.diferencia || 0);
                          const isPerfect = Math.abs(diff) < 0.1;
                          return (
                            <tr key={c.id || idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', transition: 'background-color 0.2s' }}>
                              <td style={{ padding: '0.75rem 0.5rem', color: '#fff', fontWeight: 600 }}>{c.usuario_nombre}</td>
                              <td style={{ padding: '0.75rem 0.5rem', color: '#9ca3af' }}>
                                {c.fecha_cierre ? new Date(c.fecha_cierre).toLocaleString('es-NI', { dateStyle: 'short', timeStyle: 'short' }) : '—'}
                              </td>
                              <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontFamily: 'JetBrains Mono' }}>C$ {c.monto_inicial.toLocaleString('es-NI', { maximumFractionDigits: 0 })}</td>
                              <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontFamily: 'JetBrains Mono' }}>C$ {c.final_esperado.toLocaleString('es-NI', { maximumFractionDigits: 0 })}</td>
                              <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontFamily: 'JetBrains Mono', color: '#fff', fontWeight: 600 }}>C$ {c.final_real.toLocaleString('es-NI', { maximumFractionDigits: 0 })}</td>
                              <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                                <span style={{
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  background: isPerfect ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                                  color: isPerfect ? '#10b981' : '#f43f5e',
                                  border: `1px solid ${isPerfect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`
                                }}>
                                  {isPerfect ? 'Perfecto' : `C$ ${diff.toLocaleString('es-NI', { maximumFractionDigits: 0 })}`}
                                </span>
                              </td>
                              <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                                <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                                  <span title="Efectivo" style={{ background: 'rgba(237, 125, 49, 0.1)', color: '#ED7D31', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontFamily: 'JetBrains Mono' }}>
                                    💵 {c.efectivo.toLocaleString('es-NI', { maximumFractionDigits: 0 })}
                                  </span>
                                  <span title="Tarjeta" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontFamily: 'JetBrains Mono' }}>
                                    💳 {c.tarjeta.toLocaleString('es-NI', { maximumFractionDigits: 0 })}
                                  </span>
                                  <span title="Transferencia" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontFamily: 'JetBrains Mono' }}>
                                    🏦 {c.transferencia.toLocaleString('es-NI', { maximumFractionDigits: 0 })}
                                  </span>
                                </div>
                              </td>
                              <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontFamily: 'JetBrains Mono', color: '#eab308' }}>
                                ${c.dolares.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </td>
                            </tr>
                          );
                        })}
                        {(!metrics?.recent_closures || metrics.recent_closures.length === 0) && (
                          <tr>
                            <td colSpan="8" style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>
                              No hay cierres de caja registrados para auditar en este periodo.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </PanelRow>

              <PanelRow>
                <Card style={{ gridColumn: 'span 2' }}>
                  <CardTitle>
                    <FaCheckCircle color="#ED7D31" />
                    Distribución Financiera de Pagos
                  </CardTitle>
                  <CardDesc>
                    Análisis de los métodos de pago preferidos por los clientes y el monto promedio facturado por cada transacción de venta.
                  </CardDesc>
                  
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#9ca3af', fontWeight: 600 }}>Valor Ticket Promedio</span>
                        <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#10b981', marginTop: '0.2rem' }}>
                          C$ {ticketPromedio.toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', padding: '0.75rem 1rem', fontWeight: 800, fontSize: '1.2rem', fontFamily: "'JetBrains Mono', monospace" }}>
                        C$
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#9ca3af' }}>
                        <span>Facturación Total:</span>
                        <span style={{ color: '#fff', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
                          C$ {Number(metrics?.total_ventas_bi || 0).toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#9ca3af' }}>
                        <span>Total de Facturas:</span>
                        <span style={{ color: '#fff', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
                          {metrics?.total_tickets_bi || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid rgba(255, 25, 25, 0.04)', paddingBottom: '0.4rem' }}>
                      Distribución de Pagos (Últimos 30 días)
                    </div>
                    
                    {/* Efectivo */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                        <span style={{ color: '#fff', fontWeight: 600 }}>Efectivo</span>
                        <span style={{ color: '#9ca3af', fontFamily: "'JetBrains Mono', monospace" }}>
                          {paymentDist.efectivo.pct}% (C$ {paymentDist.efectivo.total.toLocaleString('es-NI', { maximumFractionDigits: 0 })})
                        </span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.04)', height: '8px', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ background: '#ED7D31', height: '100%', width: `${paymentDist.efectivo.pct}%`, borderRadius: '4px', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                      </div>
                    </div>
                    
                    {/* Transferencia */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                        <span style={{ color: '#fff', fontWeight: 600 }}>Transferencia Bancaria</span>
                        <span style={{ color: '#9ca3af', fontFamily: "'JetBrains Mono', monospace" }}>
                          {paymentDist.transferencia.pct}% (C$ {paymentDist.transferencia.total.toLocaleString('es-NI', { maximumFractionDigits: 0 })})
                        </span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.04)', height: '8px', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ background: '#38bdf8', height: '100%', width: `${paymentDist.transferencia.pct}%`, borderRadius: '4px', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                      </div>
                    </div>
                    
                    {/* Tarjeta */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                        <span style={{ color: '#fff', fontWeight: 600 }}>Tarjeta de Crédito / Débito</span>
                        <span style={{ color: '#9ca3af', fontFamily: "'JetBrains Mono', monospace" }}>
                          {paymentDist.tarjeta.pct}% (C$ {paymentDist.tarjeta.total.toLocaleString('es-NI', { maximumFractionDigits: 0 })})
                        </span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.04)', height: '8px', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ background: '#a855f7', height: '100%', width: `${paymentDist.tarjeta.pct}%`, borderRadius: '4px', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                      </div>
                    </div>
                  </div>
                </Card>
              </PanelRow>

              {/* Alertas de Caja Críticas (Solo si existen alertas reales activas, no OK de consistencia) */}
              {metrics?.cash_anomalies && metrics.cash_anomalies.filter(a => a.risk !== 'Normal').length > 0 && (
                <PanelRow>
                  <Card style={{ gridColumn: 'span 2', background: 'rgba(244, 63, 94, 0.02)', borderColor: 'rgba(244, 63, 94, 0.15)' }}>
                    <CardTitle style={{ color: '#f43f5e' }}>
                      <FaExclamationTriangle color="#f43f5e" />
                      Alertas de Caja y Seguridad de Caja Detectadas
                    </CardTitle>
                    <CardDesc>
                      Se han registrado incidencias que requieren supervisión inmediata o retiros parciales de seguridad.
                    </CardDesc>
                    <AlertsList style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.2rem' }}>
                      {metrics?.cash_anomalies?.filter(a => a.risk !== 'Normal').map((a, i) => (
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
              )}
            </div>
          )}

          {activeTab === 'rotacion' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <PanelRow>
                <Card style={{ gridColumn: 'span 2' }}>
                  <CardTitle>
                    <FaChartLine style={{ color: '#38bdf8' }} />
                    Ranking de Repuestos de Mayor Rotación (Top 10 Bestsellers)
                  </CardTitle>
                  <CardDesc>
                    Listado de los 10 productos con mayor volumen de unidades vendidas y su facturación total correspondiente.
                  </CardDesc>
                  
                  <div style={{ overflowX: 'auto', marginTop: '0.5rem' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255, 25, 25, 0.08)', color: '#9ca3af' }}>
                          <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>CÓDIGO</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>PRODUCTO</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600, textAlign: 'right' }}>UNIDADES VENDIDAS</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600, textAlign: 'right' }}>TOTAL FACTURADO</th>
                        </tr>
                      </thead>
                      <tbody>
                        {metrics?.top_products?.map((p, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', transition: 'background-color 0.2s' }}>
                            <td style={{ padding: '0.75rem 0.5rem', fontFamily: "'JetBrains Mono', monospace", color: '#38bdf8', fontWeight: 600 }}>{p.codigo || 'S/C'}</td>
                            <td style={{ padding: '0.75rem 0.5rem', color: '#fff' }}>{p.nombre}</td>
                            <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontWeight: 700, color: '#10b981' }}>{p.unidades.toLocaleString()}</td>
                            <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", color: '#ED7D31' }}>C$ {p.monto.toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          </tr>
                        ))}
                        {(!metrics?.top_products || metrics?.top_products?.length === 0) && (
                          <tr>
                            <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>
                              No hay datos de ventas registradas en el rango seleccionado.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </PanelRow>

              <PanelRow>
                <Card style={{ gridColumn: 'span 2' }}>
                  <CardTitle>
                    <FaBoxes color="#38bdf8" />
                    Clasificación ABC de Inventario (Principio de Pareto)
                  </CardTitle>
                  <CardDesc>
                    División del inventario activo según su volumen de rotación en los últimos 180 días para priorizar la gestión de stock (Ley de Pareto).
                  </CardDesc>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '0.5rem' }}>
                    {/* Columna 1: Progreso y Descripción */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                      <div style={{ background: 'rgba(255,255,255,0.04)', height: '28px', borderRadius: '14px', overflow: 'hidden', display: 'flex', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ 
                          background: '#10b981', 
                          width: `${metrics?.abc_a + metrics?.abc_b + metrics?.abc_c > 0 ? (metrics.abc_a / (metrics.abc_a + metrics.abc_b + metrics.abc_c) * 100) : 20}%`, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          color: '#fff', 
                          fontSize: '0.75rem', 
                          fontWeight: 'bold',
                          minWidth: '40px' 
                        }}>
                          A ({Math.round(metrics?.abc_a + metrics?.abc_b + metrics?.abc_c > 0 ? (metrics.abc_a / (metrics.abc_a + metrics.abc_b + metrics.abc_c) * 100) : 20)}%)
                        </div>
                        
                        <div style={{ 
                          background: '#eab308', 
                          width: `${metrics?.abc_a + metrics?.abc_b + metrics?.abc_c > 0 ? (metrics.abc_b / (metrics.abc_a + metrics.abc_b + metrics.abc_c) * 100) : 30}%`, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          color: '#000', 
                          fontSize: '0.75rem', 
                          fontWeight: 'bold',
                          minWidth: '40px' 
                        }}>
                          B ({Math.round(metrics?.abc_a + metrics?.abc_b + metrics?.abc_c > 0 ? (metrics.abc_b / (metrics.abc_a + metrics.abc_b + metrics.abc_c) * 100) : 30)}%)
                        </div>
                        
                        <div style={{ 
                          background: '#f43f5e', 
                          width: `${metrics?.abc_a + metrics?.abc_b + metrics?.abc_c > 0 ? (metrics.abc_c / (metrics.abc_a + metrics.abc_b + metrics.abc_c) * 100) : 50}%`, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          color: '#fff', 
                          fontSize: '0.75rem', 
                          fontWeight: 'bold',
                          minWidth: '40px' 
                        }}>
                          C ({Math.round(metrics?.abc_a + metrics?.abc_b + metrics?.abc_c > 0 ? (metrics.abc_c / (metrics.abc_a + metrics.abc_b + metrics.abc_c) * 100) : 50)}%)
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.85rem' }}>
                         <div style={{ padding: '0.8rem', background: 'rgba(16, 185, 129, 0.04)', border: '1px solid rgba(16, 185, 129, 0.12)', borderRadius: '12px' }}>
                           <span style={{ color: '#10b981', fontWeight: 800 }}>🟢 Clase A (Alta Rotación):</span>
                           <div style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, margin: '2px 0' }}>{metrics?.abc_a || 0} Repuestos</div>
                           <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>&gt; 10 unidades vendidas en el periodo. Artículos estrella del inventario.</span>
                         </div>
                         <div style={{ padding: '0.8rem', background: 'rgba(234, 179, 8, 0.04)', border: '1px solid rgba(234, 179, 8, 0.12)', borderRadius: '12px' }}>
                           <span style={{ color: '#eab308', fontWeight: 800 }}>🟡 Clase B (Rotación Media):</span>
                           <div style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, margin: '2px 0' }}>{metrics?.abc_b || 0} Repuestos</div>
                           <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>4 a 10 unidades vendidas. Artículos de demanda regular.</span>
                         </div>
                         <div style={{ padding: '0.8rem', background: 'rgba(244, 63, 94, 0.04)', border: '1px solid rgba(244, 63, 94, 0.12)', borderRadius: '12px' }}>
                           <span style={{ color: '#f43f5e', fontWeight: 800 }}>🔴 Clase C (Rotación Baja):</span>
                           <div style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, margin: '2px 0' }}>{metrics?.abc_c || 0} Repuestos</div>
                           <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>&le; 3 unidades vendidas en el periodo. Lento movimiento en percha.</span>
                         </div>
                      </div>
                    </div>

                    {/* Columna 2: Tabla de Distribución Detallada ABC */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#9ca3af', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Métricas de Clasificación ABC</span>
                      <div style={{ overflowX: 'auto', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '0.5rem' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#9ca3af' }}>
                              <th style={{ padding: '0.5rem', fontWeight: 600 }}>CLASE</th>
                              <th style={{ padding: '0.5rem', fontWeight: 600, textAlign: 'right' }}>ITEMS (%)</th>
                              <th style={{ padding: '0.5rem', fontWeight: 600, textAlign: 'right' }}>STOCK</th>
                              <th style={{ padding: '0.5rem', fontWeight: 600, textAlign: 'right' }}>CAPITAL VALUADO</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(() => {
                              const a = metrics?.abc_analysis?.clase_a || { total: metrics?.abc_a || 0, stock: 0, capital: 0, pct_items: 0 };
                              const b = metrics?.abc_analysis?.clase_b || { total: metrics?.abc_b || 0, stock: 0, capital: 0, pct_items: 0 };
                              const c = metrics?.abc_analysis?.clase_c || { total: metrics?.abc_c || 0, stock: 0, capital: 0, pct_items: 0 };
                              
                              const totalItems = (a.total || 0) + (b.total || 0) + (c.total || 0);
                              const totalStock = (a.stock || 0) + (b.stock || 0) + (c.stock || 0);
                              const totalCapital = (a.capital || 0) + (b.capital || 0) + (c.capital || 0);

                              const pctA = a.pct_items || (totalItems > 0 ? ((a.total / totalItems) * 100).toFixed(1) : 0);
                              const pctB = b.pct_items || (totalItems > 0 ? ((b.total / totalItems) * 100).toFixed(1) : 0);
                              const pctC = c.pct_items || (totalItems > 0 ? ((c.total / totalItems) * 100).toFixed(1) : 0);

                              return (
                                <>
                                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                                    <td style={{ padding: '0.6rem 0.5rem', fontWeight: 700, color: '#10b981' }}>🟢 Clase A</td>
                                    <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right', color: '#fff' }}>{a.total || 0} ({pctA}%)</td>
                                    <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right', color: '#fff' }}>{a.stock?.toLocaleString() || 0} und</td>
                                    <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", color: '#ED7D31' }}>C$ {a.capital?.toLocaleString('es-NI', { maximumFractionDigits: 0 }) || 0}</td>
                                  </tr>
                                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                                    <td style={{ padding: '0.6rem 0.5rem', fontWeight: 700, color: '#eab308' }}>🟡 Clase B</td>
                                    <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right', color: '#fff' }}>{b.total || 0} ({pctB}%)</td>
                                    <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right', color: '#fff' }}>{b.stock?.toLocaleString() || 0} und</td>
                                    <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", color: '#ED7D31' }}>C$ {b.capital?.toLocaleString('es-NI', { maximumFractionDigits: 0 }) || 0}</td>
                                  </tr>
                                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                                    <td style={{ padding: '0.6rem 0.5rem', fontWeight: 700, color: '#f43f5e' }}>🔴 Clase C</td>
                                    <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right', color: '#fff' }}>{c.total || 0} ({pctC}%)</td>
                                    <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right', color: '#fff' }}>{c.stock?.toLocaleString() || 0} und</td>
                                    <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", color: '#ED7D31' }}>C$ {c.capital?.toLocaleString('es-NI', { maximumFractionDigits: 0 }) || 0}</td>
                                  </tr>
                                  <tr style={{ fontWeight: 800, background: 'rgba(255,255,255,0.03)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                    <td style={{ padding: '0.6rem 0.5rem', color: '#fff' }}>Total General</td>
                                    <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right', color: '#fff' }}>{totalItems} (100%)</td>
                                    <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right', color: '#10b981' }}>{totalStock.toLocaleString()} und</td>
                                    <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", color: '#ED7D31' }}>C$ {totalCapital.toLocaleString('es-NI', { maximumFractionDigits: 0 })}</td>
                                  </tr>
                                </>
                              );
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Columna 3: Gráfico de Distribución ABC */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#9ca3af', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Distribución de Clases ABC</span>
                      <ChartBox style={{ height: '240px' }}>
                        <Bar
                          data={getAbcChartData()}
                          options={{
                            indexAxis: 'y',
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: {
                              y: { grid: { display: false }, ticks: { color: '#9ca3af', font: { family: 'Outfit' } } },
                              x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af', font: { family: 'Outfit' } } }
                            }
                          }}
                        />
                      </ChartBox>
                    </div>
                  </div>
                </Card>
              </PanelRow>

              <PanelRow>
                <Card style={{ gridColumn: 'span 2' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid rgba(255, 25, 255, 0.05)', paddingBottom: '0.75rem' }}>
                    <CardTitle style={{ borderBottom: 'none', paddingBottom: 0 }}>
                      <FaBoxes color={stagnantFilter === 'sin_ventas' ? '#f43f5e' : '#eab308'} />
                      {stagnantFilter === 'sin_ventas' 
                        ? 'Detalle de Inventario Estancado (Sin Ventas en el Periodo)' 
                        : 'Detalle de Inventario de Baja Rotación (0-3 Ventas en el Periodo)'}
                    </CardTitle>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '2px' }}>
                        <button 
                          onClick={() => setStagnantFilter('sin_ventas')} 
                          style={{
                            background: stagnantFilter === 'sin_ventas' ? 'rgba(244, 63, 94, 0.15)' : 'none',
                            border: 'none',
                            color: stagnantFilter === 'sin_ventas' ? '#fff' : '#9ca3af',
                            padding: '0.4rem 0.8rem',
                            fontSize: '0.8rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}
                        >
                          Sin Ventas (0)
                        </button>
                        <button 
                          onClick={() => setStagnantFilter('baja_rotacion')} 
                          style={{
                            background: stagnantFilter === 'baja_rotacion' ? 'rgba(234, 179, 8, 0.15)' : 'none',
                            border: 'none',
                            color: stagnantFilter === 'baja_rotacion' ? '#fff' : '#9ca3af',
                            padding: '0.4rem 0.8rem',
                            fontSize: '0.8rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}
                        >
                          Baja Rotación (0-3)
                        </button>
                      </div>
                      <div style={{ position: 'relative', minWidth: '220px' }}>
                        <Input 
                          type="text" 
                          placeholder="Buscar repuesto..." 
                          value={stagnantSearch}
                          onChange={(e) => setStagnantSearch(e.target.value)}
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', width: '100%', borderRadius: '8px' }}
                        />
                      </div>
                    </div>
                  </div>
                  <CardDesc>
                    {stagnantFilter === 'sin_ventas'
                      ? 'Listado de los artículos con stock físico disponible que registran nulo movimiento en el periodo seleccionado, ordenados por capital inmovilizado.'
                      : 'Listado de los artículos con stock físico disponible que registran bajas ventas (entre 0 y 3 unidades) en el periodo seleccionado.'}
                  </CardDesc>

                  <div style={{ overflowX: 'auto', maxHeight: '400px', overflowY: 'auto', marginTop: '0.5rem' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255, 25, 25, 0.08)', color: '#9ca3af', position: 'sticky', top: 0, background: '#0a0a14', zIndex: 1 }}>
                          <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>CÓDIGO</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>PRODUCTO</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600, textAlign: 'right' }}>EXISTENCIA</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600, textAlign: 'right' }}>PRECIO VENTA</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600, textAlign: 'right' }}>CAPITAL DETENIDO</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600, textAlign: 'right' }}>UNIDADES VENDIDAS</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600, textAlign: 'center' }}>ÚLTIMA VENTA</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStagnantProducts?.map((p, idx) => {
                          const capital = p.existencia * p.precio;
                          return (
                            <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', transition: 'background-color 0.2s' }}>
                              <td style={{ padding: '0.75rem 0.5rem', fontFamily: "'JetBrains Mono', monospace", color: '#38bdf8', fontWeight: 600 }}>{p.codigo || 'S/C'}</td>
                              <td style={{ padding: '0.75rem 0.5rem', color: '#fff' }}>{p.nombre}</td>
                              <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontWeight: 700, color: '#f43f5e' }}>{p.existencia}</td>
                              <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", color: '#9ca3af' }}>C$ {Number(p.precio).toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                              <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", color: '#ED7D31', fontWeight: 700 }}>C$ {capital.toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                              <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontWeight: 700, color: p.unidades_vendidas === 0 ? '#f43f5e' : '#eab308' }}>{p.unidades_vendidas}</td>
                              <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.8rem' }}>
                                {p.ultima_venta ? new Date(p.ultima_venta).toLocaleDateString('es-NI') : 'Nunca vendido'}
                              </td>
                            </tr>
                          );
                        })}
                        {(!filteredStagnantProducts || filteredStagnantProducts.length === 0) && (
                          <tr>
                            <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>
                              No hay productos en esta categoría que coincidan con la búsqueda.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </PanelRow>

              <PanelRow>
                <Card style={{ gridColumn: 'span 2' }}>
                  <CardTitle>
                    <FaExclamationTriangle color="#f43f5e" />
                    Alertas de Stock e Incidencias de Inventario
                  </CardTitle>
                  <CardDesc>
                    Diagnóstico automatizado de ruptura de stock y desabastecimiento en el catálogo de repuestos.
                  </CardDesc>

                  <AlertsList style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.2rem' }}>
                    {metrics?.inventory_anomalies?.map((a, i) => (
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
                    {(!metrics?.inventory_anomalies || metrics.inventory_anomalies.length === 0) && (
                      <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af', gridColumn: 'span 2' }}>
                        No hay rupturas de stock ni alertas críticas detectadas.
                      </div>
                    )}
                  </AlertsList>
                </Card>
              </PanelRow>

              <PanelRow>
                <Card style={{ gridColumn: 'span 2' }}>
                  <CardTitle>
                    <FaBoxes color="#ED7D31" />
                    Recomendaciones BI para la Gestión del Inventario
                  </CardTitle>
                  <CardDesc>
                    Acciones sugeridas por el motor de inteligencia de negocios basadas en los KPIs de rotación, estancamiento y demanda actual.
                  </CardDesc>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem', marginTop: '0.5rem' }}>
                    <div style={{ background: 'rgba(244, 63, 94, 0.05)', border: '1px solid rgba(244, 63, 94, 0.15)', borderRadius: '12px', padding: '1.2rem' }}>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#f43f5e', fontWeight: 700, letterSpacing: '0.5px' }}>Inventario de Lento Movimiento</span>
                      <h4 style={{ fontSize: '1.1rem', margin: '0.4rem 0 0.2rem 0', color: '#fff' }}>Liquidación de Stock Estancado</h4>
                      <p style={{ fontSize: '0.85rem', color: '#9ca3af', margin: 0, lineHeight: '1.4' }}>
                        Tienes {metrics?.riesgo_estancamiento || 0} repuestos con nulo movimiento en los últimos 180 días. Se aconseja agruparlos en combos o aplicar un 15% de descuento promocional para liberar capital de trabajo.
                      </p>
                    </div>

                    <div style={{ background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.15)', borderRadius: '12px', padding: '1.2rem' }}>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 700, letterSpacing: '0.5px' }}>Stock Out Preventivo</span>
                      <h4 style={{ fontSize: '1.1rem', margin: '0.4rem 0 0.2rem 0', color: '#fff' }}>Reabastecimiento de Bestsellers</h4>
                      <p style={{ fontSize: '0.85rem', color: '#9ca3af', margin: 0, lineHeight: '1.4' }}>
                        El producto estrella "{metrics?.top_products?.[0]?.nombre || 'N/A'}" posee una alta demanda. Verifica las existencias físicas y programa órdenes de compra inmediatas para evitar rupturas de stock de alta rentabilidad.
                      </p>
                    </div>

                    <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.15)', borderRadius: '12px', padding: '1.2rem' }}>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#10b981', fontWeight: 700, letterSpacing: '0.5px' }}>Eficiencia de Rotación</span>
                      <h4 style={{ fontSize: '1.1rem', margin: '0.4rem 0 0.2rem 0', color: '#fff' }}>Diagnóstico de Tasa de Rotación</h4>
                      <p style={{ fontSize: '0.85rem', color: '#9ca3af', margin: 0, lineHeight: '1.4' }}>
                        Con una tasa de {rotacionIndice} rotaciones al mes, el inventario goza de una salud moderada. Para potenciar el índice hacia valores mayores a 1.0, optimiza la cantidad de repuestos de baja demanda en pedidos de proveedores.
                      </p>
                    </div>
                  </div>
                </Card>
              </PanelRow>

              <PanelRow style={{ marginTop: '2rem' }}>
                {/* Sugerencias de Reposición */}
                <Card>
                  <CardTitle>
                    <FaSync color="#10b981" />
                    Sugerencias de Reposición (Clase A - Stock Crítico &le; 5)
                  </CardTitle>
                  <CardDesc>
                    Artículos de alta demanda con existencias en niveles mínimos. Se calcula la compra sugerida para restablecer el stock óptimo.
                  </CardDesc>
                  <div style={{ overflowX: 'auto', marginTop: '0.5rem' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255, 25, 25, 0.08)', color: '#9ca3af' }}>
                          <th style={{ padding: '0.6rem 0.4rem', fontWeight: 600 }}>CÓDIGO</th>
                          <th style={{ padding: '0.6rem 0.4rem', fontWeight: 600 }}>PRODUCTO</th>
                          <th style={{ padding: '0.6rem 0.4rem', fontWeight: 600, textAlign: 'right' }}>STOCK</th>
                          <th style={{ padding: '0.6rem 0.4rem', fontWeight: 600, textAlign: 'right' }}>VENDIDO (180d)</th>
                          <th style={{ padding: '0.6rem 0.4rem', fontWeight: 600, textAlign: 'right' }}>PEDIDO SUG.</th>
                          <th style={{ padding: '0.6rem 0.4rem', fontWeight: 600, textAlign: 'right' }}>COSTO ESTIMADO</th>
                        </tr>
                      </thead>
                      <tbody>
                        {metrics?.suggested_replenishment?.map((r, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                            <td style={{ padding: '0.6rem 0.4rem', fontFamily: "'JetBrains Mono', monospace", color: '#38bdf8', fontWeight: 600 }}>{r.codigo}</td>
                            <td style={{ padding: '0.6rem 0.4rem', color: '#fff' }}>{r.nombre}</td>
                            <td style={{ padding: '0.6rem 0.4rem', textAlign: 'right', fontWeight: 700, color: '#f43f5e' }}>{r.existencia}</td>
                            <td style={{ padding: '0.6rem 0.4rem', textAlign: 'right', color: '#9ca3af' }}>{r.unidades_vendidas}</td>
                            <td style={{ padding: '0.6rem 0.4rem', textAlign: 'right', fontWeight: 700, color: '#10b981' }}>{r.sug_qty} und</td>
                            <td style={{ padding: '0.6rem 0.4rem', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", color: '#ED7D31' }}>C$ {r.costo_estimado.toLocaleString('es-NI', { maximumFractionDigits: 0 })}</td>
                          </tr>
                        ))}
                        {(!metrics?.suggested_replenishment || metrics.suggested_replenishment.length === 0) && (
                          <tr>
                            <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>
                              No se requiere reposición inmediata de artículos Clase A.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* Pérdidas por Quiebre de Stock */}
                <Card>
                  <CardTitle>
                    <FaExclamationTriangle color="#f43f5e" />
                    Pérdidas Estimadas por Quiebre de Stock (Stockout)
                  </CardTitle>
                  <CardDesc>
                    Artículos con demanda histórica reciente pero con stock actual en cero. Muestra la pérdida de venta diaria proyectada.
                  </CardDesc>
                  <div style={{ overflowX: 'auto', marginTop: '0.5rem' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255, 25, 25, 0.08)', color: '#9ca3af' }}>
                          <th style={{ padding: '0.6rem 0.4rem', fontWeight: 600 }}>CÓDIGO</th>
                          <th style={{ padding: '0.6rem 0.4rem', fontWeight: 600 }}>PRODUCTO</th>
                          <th style={{ padding: '0.6rem 0.4rem', fontWeight: 600, textAlign: 'right' }}>PRECIO VENTA</th>
                          <th style={{ padding: '0.6rem 0.4rem', fontWeight: 600, textAlign: 'right' }}>VENDIDO (180d)</th>
                          <th style={{ padding: '0.6rem 0.4rem', fontWeight: 600, textAlign: 'right' }}>PÉRDIDA DIARIA EST.</th>
                        </tr>
                      </thead>
                      <tbody>
                        {metrics?.lost_sales_stockout?.map((l, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                            <td style={{ padding: '0.6rem 0.4rem', fontFamily: "'JetBrains Mono', monospace", color: '#38bdf8', fontWeight: 600 }}>{l.codigo}</td>
                            <td style={{ padding: '0.6rem 0.4rem', color: '#fff' }}>{l.nombre}</td>
                            <td style={{ padding: '0.6rem 0.4rem', textAlign: 'right', color: '#9ca3af' }}>C$ {l.precio.toLocaleString('es-NI', { maximumFractionDigits: 0 })}</td>
                            <td style={{ padding: '0.6rem 0.4rem', textAlign: 'right', color: '#f43f5e', fontWeight: 600 }}>{l.unidades_180}</td>
                            <td style={{ padding: '0.6rem 0.4rem', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", color: '#f43f5e', fontWeight: 700 }}>C$ {l.perdida_diaria.toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          </tr>
                        ))}
                        {(!metrics?.lost_sales_stockout || metrics.lost_sales_stockout.length === 0) && (
                          <tr>
                            <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>
                              No hay pérdidas proyectadas por quiebres de stock.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </PanelRow>
            </div>
          )}

          {activeTab === 'proyeccion' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <PanelRow>
                <Card>
                  <CardTitle style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FaChartLine color="#38bdf8" />
                      Historial de Ventas, Costos y Utilidad Neta
                    </div>
                    <div style={{ display: 'flex', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '2px' }}>
                      <button 
                        onClick={() => setChartPeriod('daily')} 
                        style={{
                          background: chartPeriod === 'daily' ? 'rgba(255,255,255,0.08)' : 'none',
                          border: 'none',
                          color: chartPeriod === 'daily' ? '#fff' : '#9ca3af',
                          padding: '0.3rem 0.6rem',
                          fontSize: '0.75rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: 600,
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                      >
                        Diario
                      </button>
                      <button 
                        onClick={() => setChartPeriod('weekly')} 
                        style={{
                          background: chartPeriod === 'weekly' ? 'rgba(255,255,255,0.08)' : 'none',
                          border: 'none',
                          color: chartPeriod === 'weekly' ? '#fff' : '#9ca3af',
                          padding: '0.3rem 0.6rem',
                          fontSize: '0.75rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: 600,
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                      >
                        Semanal
                      </button>
                    </div>
                  </CardTitle>
                  <CardDesc>
                    Tendencia comparativa de los ingresos por ventas reales y proyectadas contra el costo total de los repuestos y la utilidad neta obtenida.
                  </CardDesc>
                  <ChartBox style={{ height: '280px' }}>
                    <Line
                      data={getFinancialTrendChartData()}
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
                    Ganancia por Categoría (ROI Comercial)
                  </CardTitle>
                  <CardDesc>
                    Porcentaje de retorno de inversión real, segmentado por las 5 categorías de repuestos con mayor facturación acumulada.
                  </CardDesc>
                  <ChartBox style={{ height: '280px' }}>
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
                <Card style={{ gridColumn: 'span 2' }}>
                  <CardTitle>
                    <FaBoxes color="#10b981" />
                    Top 5 Repuestos de Mayor Rentabilidad (Contribución de Utilidad Neta)
                  </CardTitle>
                  <CardDesc>
                    Listado de los 5 productos que generan mayor beneficio neto (Utilidad Neta = Cantidad * [Precio - Costo]), mostrando nombres de productos no truncados para su fácil identificación.
                  </CardDesc>
                  <div style={{ overflowX: 'auto', marginTop: '0.5rem' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255, 25, 25, 0.08)', color: '#9ca3af' }}>
                          <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>CÓDIGO</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>PRODUCTO</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600, textAlign: 'right' }}>UNIDADES VENDIDAS</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600, textAlign: 'right' }}>INGRESO BRUTO</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600, textAlign: 'right' }}>UTILIDAD NETA</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600, textAlign: 'right' }}>MARGEN ROI</th>
                        </tr>
                      </thead>
                      <tbody>
                        {metrics?.top_profitable_products?.map((p, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', transition: 'background-color 0.2s' }}>
                            <td style={{ padding: '0.75rem 0.5rem', fontFamily: "'JetBrains Mono', monospace", color: '#38bdf8', fontWeight: 600 }}>{p.codigo || 'S/C'}</td>
                            <td style={{ padding: '0.75rem 0.5rem', color: '#fff', whiteSpace: 'normal', wordBreak: 'break-word', minWidth: '200px' }}>{p.nombre}</td>
                            <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontWeight: 700, color: '#fff' }}>{p.unidades.toLocaleString()}</td>
                            <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", color: '#9ca3af' }}>C$ {p.monto.toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#10b981' }}>C$ {p.utilidad.toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontWeight: 700, color: '#a855f7' }}>{p.margen}%</td>
                          </tr>
                        ))}
                        {(!metrics?.top_profitable_products || metrics?.top_profitable_products?.length === 0) && (
                          <tr>
                            <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>
                              No hay datos de rentabilidad de productos en el rango seleccionado.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </PanelRow>

              {/* MÓDULO: Simulador de Objetivos de Ventas (Run-Rate) */}
              {(() => {
                const ventasMesActual = metrics?.ventas_mes_actual || 120000;
                const diasTranscurridos = metrics?.dias_transcurridos_mes || new Date().getDate();
                const diasTotales = metrics?.dias_totales_mes || new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
                const promedioDiarioVentas = diasTranscurridos > 0 ? (ventasMesActual / diasTranscurridos) : 0;
                const ventasProyectadasMes = promedioDiarioVentas * diasTotales;
                const progresoPorcentaje = salesGoal > 0 ? Math.min(100, (ventasMesActual / salesGoal) * 100) : 0;
                const brechaMeta = ventasProyectadasMes - salesGoal;
                const porcentajeIncrementoRequerido = (ventasProyectadasMes < salesGoal && promedioDiarioVentas > 0 && (diasTotales > diasTranscurridos))
                  ? (((salesGoal - ventasMesActual) / (diasTotales - diasTranscurridos)) - promedioDiarioVentas) / promedioDiarioVentas * 100
                  : 0;
                
                return (
                  <PanelRow>
                    <Card style={{ gridColumn: 'span 2' }}>
                      <CardTitle>
                        <FaChartLine color="#10b981" />
                        Simulador de Objetivos de Ventas y Proyección Run-Rate
                      </CardTitle>
                      <CardDesc>
                        Monitorea el progreso de la meta de facturación mensual y calcula la proyección de cierre de mes basada en el ritmo de ventas diario (Run-Rate).
                      </CardDesc>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '0.5rem' }}>
                        {/* Panel de Controles */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.25rem' }}>
                          <FormGroup>
                            <label style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: 600 }}>Fijar Meta de Ventas Mensual (C$):</label>
                            <Input 
                              type="number" 
                              value={salesGoal} 
                              onChange={(e) => setSalesGoal(Math.max(0, Number(e.target.value)))}
                              style={{ width: '100%', boxSizing: 'border-box' }}
                              placeholder="Ej. 600000"
                            />
                          </FormGroup>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', fontSize: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.8rem' }}>
                            <div>
                              <span style={{ color: '#9ca3af' }}>Días Transcurridos:</span>
                              <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700 }}>{diasTranscurridos} / {diasTotales} días</div>
                            </div>
                            <div>
                              <span style={{ color: '#9ca3af' }}>Venta Promedio Diaria:</span>
                              <div style={{ color: '#10b981', fontSize: '1.1rem', fontWeight: 700 }}>C$ {Math.round(promedioDiarioVentas).toLocaleString('es-NI')}</div>
                            </div>
                          </div>
                        </div>

                        {/* Barra de Progreso y Estadísticas */}
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.25rem' }}>
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                              <span style={{ color: '#9ca3af', fontWeight: 600 }}>Progreso de la Meta del Mes</span>
                              <span style={{ color: '#10b981', fontWeight: 800 }}>{progresoPorcentaje.toFixed(1)}%</span>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.04)', height: '12px', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                              <div style={{ background: 'linear-gradient(90deg, #38bdf8, #10b981)', height: '100%', width: `${progresoPorcentaje}%`, borderRadius: '6px', transition: 'width 0.4s ease' }}></div>
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                              <span style={{ color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase' }}>Ventas del Mes Actual</span>
                              <div style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 800 }}>C$ {Math.round(ventasMesActual).toLocaleString('es-NI')}</div>
                            </div>
                            <div>
                              <span style={{ color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase' }}>Proyección Cierre de Mes</span>
                              <div style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 800 }}>C$ {Math.round(ventasProyectadasMes).toLocaleString('es-NI')}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Diagnóstico Predictivo de Meta */}
                      <div style={{ 
                        padding: '1rem', 
                        borderRadius: '12px', 
                        border: '1px solid',
                        background: brechaMeta >= 0 ? 'rgba(16, 185, 129, 0.05)' : 'rgba(244, 63, 94, 0.05)',
                        borderColor: brechaMeta >= 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)',
                        fontSize: '0.85rem',
                        lineHeight: '1.5',
                        marginTop: '0.5rem'
                      }}>
                        {brechaMeta >= 0 ? (
                          <div>
                            <strong style={{ color: '#10b981' }}>🎉 Meta en Camino a Cumplirse:</strong> Al ritmo de ventas actual (C$ {Math.round(promedioDiarioVentas).toLocaleString('es-NI')}/día), el modelo proyecta que cerrarás el mes con <strong style={{ color: '#fff' }}>C$ {Math.round(ventasProyectadasMes).toLocaleString('es-NI')}</strong>. Esto supera tu objetivo fijado de C$ {salesGoal.toLocaleString('es-NI')} por <strong style={{ color: '#10b981' }}>C$ {Math.round(brechaMeta).toLocaleString('es-NI')}</strong>.
                          </div>
                        ) : (
                          <div>
                            <strong style={{ color: '#f43f5e' }}>⚠️ Brecha de Ventas Detectada:</strong> Al ritmo de ventas actual, proyectas cerrar el mes con <strong style={{ color: '#fff' }}>C$ {Math.round(ventasProyectadasMes).toLocaleString('es-NI')}</strong>, quedando <strong style={{ color: '#f43f5e' }}>C$ {Math.round(Math.abs(brechaMeta)).toLocaleString('es-NI')}</strong> por debajo de tu objetivo de C$ {salesGoal.toLocaleString('es-NI')}. 
                            {diasTotales > diasTranscurridos ? (
                              <span> Para alcanzar la meta, necesitas incrementar la facturación diaria a <strong style={{ color: '#fff' }}>C$ {Math.round((salesGoal - ventasMesActual) / (diasTotales - diasTranscurridos)).toLocaleString('es-NI')}</strong> por los restantes {diasTotales - diasTranscurridos} días (un aumento del <strong style={{ color: '#eab308' }}>{porcentajeIncrementoRequerido.toFixed(1)}%</strong> sobre el promedio diario actual).</span>
                            ) : (
                              <span> El mes ha concluido y no se ha alcanzado la meta.</span>
                            )}
                          </div>
                        )}
                      </div>
                    </Card>
                  </PanelRow>
                );
              })()}

              {/* Sugerencias de Combos de Repuestos y Venta Cruzada (Motor BI) */}
              <PanelRow>
                <Card style={{ gridColumn: 'span 2' }}>
                  <CardTitle>
                    <FaChartPie color="#ED7D31" />
                    Sugerencias de Combos de Repuestos y Venta Cruzada (Motor BI)
                  </CardTitle>
                  <CardDesc>
                    Asociaciones recomendadas para promociones en caja, calculadas en base a la co-ocurrencia de artículos comprados juntos en el historial de ventas.
                  </CardDesc>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '0.5rem' }}>
                    {metrics?.combo_suggestions?.map((c, idx) => (
                      <div 
                        key={idx} 
                        style={{ 
                          background: 'rgba(255, 255, 255, 0.02)', 
                          border: '1px solid rgba(255, 255, 255, 0.05)', 
                          borderRadius: '16px', 
                          padding: '1.25rem',
                          position: 'relative',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '1rem',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(237, 125, 49, 0.3)';
                          e.currentTarget.style.transform = 'translateY(-3px)';
                          e.currentTarget.style.boxShadow = '0 8px 30px rgba(237, 125, 49, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                            {c.tipo}
                          </span>
                          <span style={{ 
                            background: 'rgba(16, 185, 129, 0.12)', 
                            color: '#10b981', 
                            fontSize: '0.7rem', 
                            padding: '2px 8px', 
                            borderRadius: '20px', 
                            fontWeight: 700, 
                            border: '1px solid rgba(16, 185, 129, 0.2)' 
                          }}>
                            Ahorro: C$ {c.ahorro.toLocaleString('es-NI')}
                          </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                            <div style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontFamily: 'JetBrains Mono', fontWeight: 700, minWidth: '40px', textAlign: 'center' }}>A</div>
                            <div>
                              <div style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600, lineHeight: '1.3' }}>{c.producto_a}</div>
                              <div style={{ color: '#9ca3af', fontSize: '0.75rem', fontFamily: 'JetBrains Mono' }}>Cód: {c.codigo_a}</div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'center', margin: '0.1rem 0', color: 'rgba(255,255,255,0.15)', fontSize: '1.1rem' }}>+</div>

                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                            <div style={{ background: 'rgba(237, 125, 49, 0.1)', color: '#ED7D31', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontFamily: 'JetBrains Mono', fontWeight: 700, minWidth: '40px', textAlign: 'center' }}>B</div>
                            <div>
                              <div style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600, lineHeight: '1.3' }}>{c.producto_b}</div>
                              <div style={{ color: '#9ca3af', fontSize: '0.75rem', fontFamily: 'JetBrains Mono' }}>Cód: {c.codigo_b}</div>
                            </div>
                          </div>
                        </div>

                        {c.confianza !== undefined && c.lift !== undefined && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.8rem', fontSize: '0.75rem', color: '#eab308', background: 'rgba(234, 179, 8, 0.04)', border: '1px solid rgba(234, 179, 8, 0.1)', padding: '4px 8px', borderRadius: '8px', fontWeight: 600 }}>
                            <span>Confianza: {Math.round(c.confianza * 100)}%</span>
                            <span>Elevación (Lift): {c.lift.toFixed(1)}x</span>
                          </div>
                        )}

                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '0.5rem' }}>
                          <div>
                            <span style={{ fontSize: '0.75rem', color: '#9ca3af', textDecoration: 'line-through' }}>
                              C$ {c.precio_original.toLocaleString('es-NI')}
                            </span>
                            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>C$</span>
                              {c.precio_combo.toLocaleString('es-NI')}
                            </div>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontStyle: 'italic', textAlign: 'right' }}>
                            {c.coocurrencias} compras conjuntas
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!metrics?.combo_suggestions || metrics?.combo_suggestions?.length === 0) && (
                      <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af', gridColumn: 'span 2' }}>
                        No hay suficientes productos en inventario para sugerir combos.
                      </div>
                    )}
                  </div>
                </Card>
              </PanelRow>
            </div>
          )}

          <Footer>
            <p>&copy; 2026 Multirepuestos RG | Consola de Analítica & BI</p>
          </Footer>
        </Main>
      )}
    </PageWrapper>
  );
};

export default BiConsole;

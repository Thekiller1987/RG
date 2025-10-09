import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { FaArrowLeft, FaPrint, FaCalendarAlt, FaChartBar, FaStar, FaUserFriends, FaWarehouse, FaFileInvoiceDollar, FaChartLine } from 'react-icons/fa';

import {
    fetchSalesSummaryReport,
    fetchInventoryValueReport,
    fetchSalesByUserReport,
    fetchTopProductsReport,
    fetchSalesChartReport
} from '../service/api.js'; // <- TODAS LAS LLAMADAS ESTÁN CENTRALIZADAS AQUÍ

import AlertModal from './pos/components/AlertModal';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// --- ESTILOS GLOBALES PARA IMPRESIÓN ---
const PrintStyles = createGlobalStyle`
    @media print {
        body * {
            visibility: hidden;
        }
        #printableArea, #printableArea * {
            visibility: visible;
        }
        #printableArea {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
            box-sizing: border-box;
        }
        header, footer, nav, .TopBar, .FilterContainer {
            display: none !important;
        }
        h1 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: #1a202c;
        }
        .DashboardGrid {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1.5rem !important;
        }
        .ReportCard {
            break-inside: avoid;
            page-break-inside: avoid;
            box-shadow: none !important;
            border: 1px solid #e2e8f0;
        }
        .ReportCard:first-child {
            grid-column: 1 / -1;
            height: 400px;
        }
    }
`;

// --- ANIMACIONES Y ESTILOS MEJORADOS ---
const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
`;
const spin = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
`;
const popIn = keyframes`
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
`;
const shimmer = keyframes`
    0% { background-position: -468px 0; }
    100% { background-position: 468px 0; }
`;

const PageWrapper = styled.div`
    padding: 2rem;
    background-color: #f0f2f5;
    min-height: 100vh;
    animation: ${fadeIn} 0.5s ease-out;
    @media (max-width: 768px) { padding: 1rem; }
`;

const TopBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
`;

const ActionButton = styled.button`
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    color: white;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s, transform 0.1s;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    &:active { transform: translateY(1px); }
`;

const BackButton = styled(ActionButton)`
    background-color: #6c757d;
    &:hover { background-color: #5a6268; }
`;

const PrintButton = styled(ActionButton)`
    background-color: #17a2b8;
    &:hover { background-color: #138496; }
`;

const Header = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1.5rem;
`;

const TitleHeader = styled.h1`
    font-size: 2.25rem;
    color: #1a202c;
    margin: 0;
`;

const FilterContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.5rem;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    label {
        color: #4a5568;
        font-size: 1.2rem;
    }
    @media (max-width: 600px) {
        flex-direction: column;
        align-items: stretch;
        padding: 1rem;
    }
`;

const DateInput = styled.input`
    padding: 0.6rem 1rem;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    font-size: 1rem;
    &:focus { border-color: #2b6cb0; outline: none; }
`;

const ReportButton = styled(ActionButton)`
    background-color: #007bff;
    &:hover { background-color: #0069d9; }
`;

const DashboardGrid = styled.div.attrs({ className: 'DashboardGrid' })`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
`;

const ReportCard = styled.div.attrs({ className: 'ReportCard' })`
    background-color: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    animation: ${popIn} 0.3s ease-out;
    transition: transform 0.3s;
    &:hover {
        transform: translateY(-3px);
    }
    border-left: 5px solid ${props => props.accentColor || '#6c757d'};
`;

const CardHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    color: #4a5568;
    margin-bottom: 1rem;
`;

const CardValue = styled.p`
    font-size: 2.5rem;
    font-weight: 700;
    color: #1a202c;
    margin: 0;
`;

const ListItem = styled.li`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid #e2e8f0;
    font-size: 0.95rem;
    color: #2d3748;
    &:last-child { border-bottom: none; }
    span {
        display: block;
        font-weight: 500;
    }
    strong {
        font-weight: 700;
        color: #38a169;
    }
    animation: ${fadeIn} 0.5s ease-out forwards;
    animation-delay: ${props => props.delay * 0.1}s;
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 1rem 0;
    color: #a0aec0;
    font-style: italic;
`;

const LoadingSpinner = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    &::after {
        content: '';
        width: 50px;
        height: 50px;
        border: 5px solid #007bff;
        border-top-color: transparent;
        border-radius: 50%;
        animation: ${spin} 0.8s linear infinite;
    }
`;


// --- COMPONENTE PRINCIPAL ---

const Reports = () => {
  const navigate = useNavigate();
  const getInitialStartDate = () => new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  
  const [startDate, setStartDate] = useState(getInitialStartDate);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const [salesSummary, setSalesSummary] = useState({ ventas_brutas: 0, ganancia_total: 0 });
  const [inventoryValue, setInventoryValue] = useState(0);
  const [salesByUser, setSalesByUser] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  
  const [isLoading, setIsLoading] = useState(true);
  const [alertInfo, setAlertInfo] = useState({ isOpen: false, title: '', message: '' });

  const formatCurrency = (value) => new Intl.NumberFormat('es-NI', { style: 'currency', currency: 'NIO' }).format(value || 0);

  const fetchAllReports = useCallback(async () => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setAlertInfo({ isOpen: true, title: 'Error de Autenticación', message: 'No se encontró tu sesión.' });
      setIsLoading(false);
      return;
    }
    try {
      // TODAS ESTAS LLAMADAS USAN EL ARCHIVO api.js, por lo tanto, usan la URL correcta.
      const params = { startDate, endDate };
      const [summary, inventory, userSales, topProds, chart] = await Promise.all([
        fetchSalesSummaryReport(token, params),
        fetchInventoryValueReport(token),
        fetchSalesByUserReport(token, params),
        fetchTopProductsReport(token, params),
        fetchSalesChartReport(token, params)
      ]);
      setSalesSummary(summary);
      setInventoryValue(inventory.valor_total_inventario);
      setSalesByUser(userSales);
      setTopProducts(topProds);
      setChartData({
        labels: chart.map(d => new Date(d.dia).toLocaleDateString('es-NI', { day: 'numeric', month: 'short' })),
        datasets: [{
          label: 'Ventas por Día',
          data: chart.map(d => d.total_diario),
          backgroundColor: 'rgba(59, 130, 246, 0.7)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
          borderRadius: 4,
          hoverBackgroundColor: 'rgba(59, 130, 246, 1)',
        }]
      });
    } catch (error) {
      // En un entorno de producción, es mejor no exponer 'error.message'
      setAlertInfo({ isOpen: true, title: 'Error de Conexión', message: 'No se pudieron cargar los reportes. Revisa la conexión con el servidor.' });
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchAllReports();
  }, [fetchAllReports]);

  // --- FUNCIÓN PARA IMPRIMIR ---
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <PrintStyles />
      <PageWrapper>
        {isLoading && <LoadingSpinner />}
        <AlertModal
          isOpen={alertInfo.isOpen}
          onClose={() => setAlertInfo({ isOpen: false, title: '', message: '' })}
          title={alertInfo.title}
          message={alertInfo.message}
        />
        
        <TopBar className="TopBar">
          <BackButton onClick={() => navigate(-1)}>
            <FaArrowLeft /> Regresar
          </BackButton>
          <PrintButton onClick={handlePrint}>
            <FaPrint /> Imprimir Reporte
          </PrintButton>
        </TopBar>

        <Header>
          <TitleHeader>Dashboard de Reportes</TitleHeader>
          <FilterContainer className="FilterContainer">
            <label><FaCalendarAlt /></label>
            <DateInput type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            <DateInput type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            <ReportButton onClick={fetchAllReports}>Generar</ReportButton>
          </FilterContainer>
        </Header>
        
        <div id="printableArea">
          <DashboardGrid>
            <ReportCard style={{ gridColumn: '1 / -1' }} accentColor="var(--primary-color)">
              <CardHeader><FaChartBar /> Rendimiento de Ventas en el Período</CardHeader>
              <div style={{ position: 'relative', height: '350px' }}>
                <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
              </div>
            </ReportCard>

            <ReportCard accentColor="#10b981">
              <CardHeader><FaFileInvoiceDollar /> Ventas Totales</CardHeader>
              <CardValue>{formatCurrency(salesSummary.ventas_brutas)}</CardValue>
            </ReportCard>

            <ReportCard accentColor="#f59e0b">
              <CardHeader><FaChartLine /> Ganancias Totales</CardHeader>
              <CardValue>{formatCurrency(salesSummary.ganancia_total)}</CardValue>
            </ReportCard>

            <ReportCard accentColor="#6366f1">
              <CardHeader><FaWarehouse /> Capital en Inventario</CardHeader>
              <CardValue>{formatCurrency(inventoryValue)}</CardValue>
            </ReportCard>

            <ReportCard style={{ gridColumn: 'span 1 / auto' }}>
              <CardHeader><FaUserFriends /> 🏆 Top Vendedores</CardHeader>
              <ul>
                {salesByUser.length > 0 ? salesByUser.map((user, i) => (
                  <ListItem key={i} delay={i + 1}>
                    <span>{i + 1}. {user.nombre_usuario}</span>
                    <strong>{formatCurrency(user.total_vendido)}</strong>
                  </ListItem>
                )) : <EmptyState>No hay datos de vendedores.</EmptyState>}
              </ul>
            </ReportCard>
            
            <ReportCard style={{ gridColumn: 'span 1 / auto' }}>
              <CardHeader><FaStar /> ⭐ Productos Más Vendidos</CardHeader>
              <ul>
                {topProducts.length > 0 ? topProducts.map((prod, i) => (
                  <ListItem key={i} delay={i + 1}>
                    <span>{i + 1}. {prod.nombre}</span>
                    <strong>{prod.total_unidades_vendidas} und.</strong>
                  </ListItem>
                )) : <EmptyState>No hay datos de productos.</EmptyState>}
              </ul>
            </ReportCard>
          </DashboardGrid>
        </div>
      </PageWrapper>
    </>
  );
};

export default Reports;
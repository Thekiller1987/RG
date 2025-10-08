import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { FaCalendarAlt, FaChartBar, FaStar, FaUserFriends, FaWarehouse } from 'react-icons/fa';
import AlertModal from './pos/components/AlertModal.jsx';

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// --- ANIMACIONES Y ESTILOS ---

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PageWrapper = styled.div`
  padding: 1.5rem;
  background-color: #f0f2f5;
  min-height: 100vh;
  font-family: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const TitleHeader = styled.h1`
  font-size: 1.8rem;
  color: #1a202c;
  margin: 0;
`;

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: white;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

const DateInput = styled.input`
  padding: 0.6rem;
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  font-size: 0.9rem;
`;

const ReportButton = styled.button`
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 8px;
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  color: white;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
   @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const ReportCard = styled.div`
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.5s ease-out forwards;
  grid-column: ${props => props.span || 'span 1'};
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: #4a5568;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
`;

const CardValue = styled.p`
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 0.2rem;
  border-bottom: 1px solid #edf2f7;
  &:last-child {
    border-bottom: none;
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  z-index: 1000;
`;


// --- COMPONENTE PRINCIPAL ---

const Finances = () => {
  const getInitialStartDate = () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  };

  const [startDate, setStartDate] = useState(getInitialStartDate);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const [salesSummary, setSalesSummary] = useState({ ventas_brutas: 0, ganancia_total: 0 });
  const [inventoryValue, setInventoryValue] = useState(0);
  const [salesByUser, setSalesByUser] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  
  const [isLoading, setIsLoading] = useState(true);
  const [alertInfo, setAlertInfo] = useState({ isOpen: false, title: '', message: '' });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-NI', { style: 'currency', currency: 'NIO', minimumFractionDigits: 2 }).format(value || 0);
  };

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    const token = localStorage.getItem('token'); // <-- Asumo que guardas el token aquí

    if (!token) {
      setAlertInfo({ isOpen: true, title: 'Error de Autenticación', message: 'No se encontró tu sesión. Por favor, inicia sesión de nuevo.' });
      setIsLoading(false);
      return;
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    const apiBaseUrl = '/api/reports'; // Ya no necesitas el http://localhost:3001
    
    try {
      const endpoints = [
        `${apiBaseUrl}/sales-summary?startDate=${startDate}&endDate=${endDate}`,
        `${apiBaseUrl}/inventory-value`,
        `${apiBaseUrl}/sales-by-user?startDate=${startDate}&endDate=${endDate}`,
        `${apiBaseUrl}/top-products?startDate=${startDate}&endDate=${endDate}`,
        `${apiBaseUrl}/sales-chart?startDate=${startDate}&endDate=${endDate}`,
      ];

      const responses = await Promise.all(endpoints.map(url => fetch(url, { headers })));

      // Verificar si alguna respuesta no fue exitosa (ej. token expirado)
      for (const res of responses) {
        if (!res.ok) {
          throw new Error(`Error en la solicitud: ${res.status} ${res.statusText}`);
        }
      }

      const [summary, inventory, userSales, topProds, chart] = await Promise.all(responses.map(res => res.json()));

      setSalesSummary(summary);
      setInventoryValue(inventory.valor_total_inventario);
      setSalesByUser(userSales);
      setTopProducts(topProds);
      setChartData({
        labels: chart.map(d => new Date(d.dia).toLocaleDateString('es-NI')),
        datasets: [{
          label: 'Ventas por Día',
          data: chart.map(d => d.total_diario),
          backgroundColor: '#2563eb',
          borderRadius: 4,
        }]
      });

    } catch (error) {
      console.error("Error al cargar los reportes:", error);
      setAlertInfo({ isOpen: true, title: 'Error de Conexión', message: 'No se pudieron cargar los datos de los reportes. Revisa tu conexión o intenta más tarde.' });
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);


  return (
    <PageWrapper>
      {isLoading && <LoadingOverlay>Cargando reportes...</LoadingOverlay>}
      
      <AlertModal
        isOpen={alertInfo.isOpen}
        onClose={() => setAlertInfo({ isOpen: false, title: '', message: '' })}
        title={alertInfo.title}
        message={alertInfo.message}
      />

      <Header>
        <TitleHeader>Dashboard de Reportes</TitleHeader>
        <FilterContainer>
          <label><FaCalendarAlt /></label>
          <DateInput type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          <DateInput type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          <ReportButton onClick={fetchReports}>Generar</ReportButton>
        </FilterContainer>
      </Header>
      
      <DashboardGrid>
        <ReportCard style={{gridColumn: '1 / -1'}}>
          <CardHeader><FaChartBar size="1.2em"/><CardTitle>Rendimiento de Ventas en el Período</CardTitle></CardHeader>
          <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
        </ReportCard>

        <ReportCard>
          <CardHeader><CardTitle>Ventas Totales</CardTitle></CardHeader>
          <CardValue>{formatCurrency(salesSummary.ventas_brutas)}</CardValue>
        </ReportCard>

        <ReportCard>
          <CardHeader><CardTitle>Ganancias Totales</CardTitle></CardHeader>
          <CardValue>{formatCurrency(salesSummary.ganancia_total)}</CardValue>
        </ReportCard>

        <ReportCard>
          <CardHeader><FaWarehouse /><CardTitle>Capital en Inventario</CardTitle></CardHeader>
          <CardValue>{formatCurrency(inventoryValue)}</CardValue>
        </ReportCard>

        <ReportCard style={{ gridColumn: 'span 1 / span 2' }}>
          <CardHeader><FaUserFriends size="1.2em"/><CardTitle>🏆 Top Vendedores</CardTitle></CardHeader>
          <List>
            {salesByUser.map((user, i) => (
              <ListItem key={i}>
                <span>{i + 1}. {user.nombre_usuario}</span>
                <strong>{formatCurrency(user.total_vendido)}</strong>
              </ListItem>
            ))}
          </List>
        </ReportCard>
        
        <ReportCard style={{ gridColumn: 'span 1 / span 2' }}>
          <CardHeader><FaStar size="1.2em" /><CardTitle>⭐ Productos Más Vendidos</CardTitle></CardHeader>
          <List>
            {topProducts.map((prod, i) => (
              <ListItem key={i}>
                <span>{i + 1}. {prod.nombre}</span>
                <strong>{prod.total_unidades_vendidas} und.</strong>
              </ListItem>
            ))}
          </List>
        </ReportCard>
      </DashboardGrid>
    </PageWrapper>
  );
};

export default Finances;
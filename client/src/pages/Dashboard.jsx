import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.jsx';

const PageWrapper = styled.div`
    padding: 2rem 4rem;
    background-color: #f8f9fa;
    min-height: 100vh;
    box-sizing: border-box;
    @media (max-width: 768px) { padding: 1rem; }
`;
const Content = styled.div`
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
`;
const TopBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2.5rem;
    gap: 1rem;
    flex-wrap: wrap;
`;
const Header = styled.div`min-width: 0;`;
const WelcomeTitle = styled.h1`
    font-size: 2.1rem;
    color: #343a40;
    font-weight: 700;
    margin: 0;
    line-height: 1.05;
    @media (max-width: 768px) { font-size: 1.6rem; }
`;
const WelcomeSubtitle = styled.p`
    font-size: 1rem;
    color: #6c757d;
    margin: 0.35rem 0 0;
    @media (max-width: 768px) { font-size: 0.95rem; }
`;
const LogoutButton = styled.button`
    padding: 0.7rem 1.2rem;
    border: 2px solid #ff6b6b;
    background: none;
    color: #ff6b6b;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 700;
    font-size: 0.95rem;
    transition: all 0.15s;
    display: inline-flex;
    gap: 0.5rem;
    align-items: center;
    &:hover, &:focus { background: #ff6b6b; color: #fff; outline: none; }
`;
const GridContainer = styled.main`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.2rem;
`;
const Card = styled(Link)`
    background-color: #fff;
    border-radius: 12px;
    padding: 1.4rem;
    box-shadow: 0 6px 20px rgba(2,6,23,0.06);
    transition: transform .18s, box-shadow .18s;
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
    min-height: 110px;
    border-top: 5px solid ${props => props.color || '#007bff'}; 
    &:hover, &:focus { transform: translateY(-6px); box-shadow: 0 10px 30px rgba(2,6,23,0.09); outline: none; }
    h2 { margin: 0 0 .35rem 0; font-size: 1.05rem; color: #233547; font-weight:700; }
    p { margin:0; color:#6b7a86; font-size: .95rem; }
`;
const CardIcon = styled.div` font-size: 1.9rem; margin-bottom: 0.5rem; line-height:1; color: ${props => props.color || '#007bff'}; `;

const Dashboard = () => {
    const { user, logout } = useAuth();

    if (!user) {
        return (
            <PageWrapper>
                <Content><WelcomeTitle>Cargando...</WelcomeTitle></Content>
            </PageWrapper>
        );
    }
    
    const userRole = user.rol || 'N/A';
    const isAdmin = userRole === 'Administrador';
    
    // CORRECCIÓN: Se hace más flexible la obtención del nombre de usuario
    const displayName = user.nombre_usuario || user.nombre || user.name || 'Usuario'; 

    return (
        <PageWrapper>
            <Content>
                <TopBar>
                    <Header>
                        <WelcomeTitle>Bienvenido, {displayName}</WelcomeTitle> 
                        <WelcomeSubtitle>Rol: {userRole}. Selecciona un módulo para empezar a trabajar.</WelcomeSubtitle>
                    </Header>
                    <LogoutButton aria-label="Cerrar sesión" onClick={logout}>
                        <FaSignOutAlt /> Cerrar sesión
                    </LogoutButton>
                </TopBar>

                <GridContainer>
                    <Card to="/pos" color="#007bff"> <CardIcon color="#007bff">🛒</CardIcon> <h2>Punto de Venta</h2> <p>Registra ventas y gestiona transacciones.</p> </Card>
                    <Card to="/inventory" color="#28a745"> <CardIcon color="#28a745">📦</CardIcon> <h2>Inventario</h2> <p>Controla el stock de tus productos.</p> </Card>
                    <Card to="/orders" color="#ffc107"> <CardIcon color="#ffc107">📝</CardIcon> <h2>Pedidos y Apartados</h2> <p>Administra pedidos y seguimientos.</p> </Card>
                    <Card to="/credits" color="#17a2b8"> <CardIcon color="#17a2b8">💳</CardIcon> <h2>Clientes y Créditos</h2> <p>Gestiona clientes, saldos y abonos.</p> </Card>
                    <Card to="/finances" color="#dc3545"> <CardIcon color="#dc3545">💸</CardIcon> <h2>Finanzas</h2> <p>Controla ingresos y egresos del negocio.</p> </Card>
                    <Card to="/reports" color="#6c757d"> <CardIcon color="#6c757d">📊</CardIcon> <h2>Reportes</h2> <p>Visualiza el rendimiento de ventas.</p> </Card>
                    {isAdmin && <Card to="/admin/users" color="#6f42c1"> <CardIcon color="#6f42c1">👥</CardIcon> <h2>Usuarios</h2> <p>Administra roles y accesos.</p> </Card>}
                </GridContainer>
            </Content>
        </PageWrapper>
    );
};

export default Dashboard;
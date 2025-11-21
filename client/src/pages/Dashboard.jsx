import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
    FaSignOutAlt, FaShoppingCart, FaBoxOpen, FaFileInvoice, 
    FaCreditCard, FaCloudUploadAlt, FaChartBar, FaBriefcase, FaUsers 
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.jsx'; 

// 🚨 CORRECCIÓN DE RUTA: Ajustada para reflejar la ubicación real en pages/pos/components
import ConfirmationModal from './pos/components/ConfirmationModal.jsx'; 

// --- ESTILOS MEJORADOS Y RESPONSIVOS ---
const PageWrapper = styled.div`
    padding: clamp(1rem, 5vw, 2.5rem); 
    background-color: #f0f2f5; 
    min-height: 100vh;
    box-sizing: border-box;
`;
const Content = styled.div`
    width: 100%;
    max-width: 1300px;
    margin: 0 auto;
`;
const TopBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center; 
    margin-bottom: 3rem; 
    gap: 1.5rem;
    flex-wrap: wrap;
`;
const Header = styled.div`min-width: 0;`;
const WelcomeTitle = styled.h1`
    font-size: clamp(1.8rem, 4vw, 2.4rem); 
    color: #1e293b; 
    font-weight: 800;
    margin: 0;
    line-height: 1.2;
`;
const WelcomeSubtitle = styled.p`
    font-size: clamp(0.9rem, 2vw, 1.1rem);
    color: #64748b;
    margin: 0.4rem 0 0;
`;
const LogoutButton = styled.button`
    padding: 0.7rem 1.4rem;
    border: none; 
    background: #fecaca; 
    color: #dc2626; 
    border-radius: 12px;
    cursor: pointer;
    font-weight: 700;
    font-size: 1rem;
    transition: all 0.2s ease;
    display: inline-flex;
    gap: 0.6rem;
    align-items: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); 
    
    &:hover, &:focus { 
        background: #dc2626; 
        color: #fff; 
        box-shadow: 0 6px 10px rgba(220, 38, 38, 0.3); 
        transform: translateY(-2px);
        outline: none; 
    }
`;
const GridContainer = styled.main`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
    gap: clamp(1rem, 2vw, 1.5rem);
`;
const Card = styled(Link)`
    background-color: #ffffff;
    border-radius: 16px; 
    padding: 1.5rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08); 
    transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.25s ease; 
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
    min-height: 130px;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 6px;
        height: 100%;
        background-color: ${props => props.color || '#007bff'};
    }

    &:hover, &:focus { 
        transform: translateY(-4px); 
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15); 
        outline: none; 
    }
    
    h2 { 
        margin: 0 0 .35rem 0; 
        font-size: 1.15rem; 
        color: #233547; 
        font-weight: 700; 
        letter-spacing: -0.5px;
    }
    p { 
        margin:0; 
        color:#6b7a86; 
        font-size: 1rem; 
    }
`;
const CardIcon = styled.div` 
    font-size: 2.2rem; 
    margin-bottom: 0.75rem; 
    line-height:1; 
    color: ${props => props.color || '#007bff'}; 
`;

// --- Componente Dashboard ---
const Dashboard = () => {
    const { user, logout } = useAuth();
    // Estado para controlar el modal de cierre de sesión
    const [showLogoutModal, setShowLogoutModal] = useState(false); 

    if (!user) {
        return (
            <PageWrapper>
                <Content><WelcomeTitle>Cargando...</WelcomeTitle></Content>
            </PageWrapper>
        );
    }
    
    // ----------------------------------------------------
    // LÓGICA DE ROLES
    // ----------------------------------------------------
    const userRole = user.rol || 'N/A';
    const isAdmin = userRole === 'Administrador';
    const isVendedor = userRole === 'Vendedor';
    // Asumiendo que "Contador" usa el mismo rol de API que "Encargado de Finanzas"
    const isContador = userRole === 'Encargado de Finanzas' || userRole === 'Contador'; 
    
    // Permisos combinados:
    const isInventoryManager = isAdmin || userRole === 'Encargado de Inventario';
    
    const canAccessPOS = isAdmin;
    const canAccessOrders = isAdmin || isVendedor;
    const canAccessCredits = isAdmin || isVendedor || isContador; 
    const canAccessInventory = isInventoryManager && !isVendedor && !isContador;
    const canAccessMassUpload = isInventoryManager && !isVendedor && !isContador;
    const canAccessReports = isAdmin || userRole === 'Gerente' || isContador; 
    const canAccessCashReports = isAdmin || userRole === 'Gerente' || isContador; 
    const canAccessAdminUsers = isAdmin;

    const displayName = user.nombre_usuario || user.nombre || user.name || 'Usuario';
    // ----------------------------------------------------

    const handlePrepareLogout = () => {
        setShowLogoutModal(true);
    };

    const handleConfirmLogout = () => {
        setShowLogoutModal(false);
        logout();
    };

    return (
        <PageWrapper>
            <Content>
                <TopBar>
                    <Header>
                        <WelcomeTitle>Bienvenido, {displayName} 👋</WelcomeTitle> 
                        <WelcomeSubtitle>Rol: {userRole}. Selecciona un módulo para empezar a trabajar.</WelcomeSubtitle>
                    </Header>
                    <LogoutButton aria-label="Cerrar sesión" onClick={handlePrepareLogout}>
                        <FaSignOutAlt /> Cerrar sesión
                    </LogoutButton>
                </TopBar>

                <GridContainer>
                    {/* 1. Punto de Venta (VENDEDOR) */}
                    {canAccessPOS && (
                        <Card to="/pos" color="#007bff"> 
                            <CardIcon color="#007bff"><FaShoppingCart /></CardIcon> 
                            <h2>Punto de Venta</h2> 
                            <p>Registra ventas y gestiona transacciones diarias.</p> 
                        </Card>
                    )}

                    {/* 2. Pedidos y Apartados (VENDEDOR) */}
                    {canAccessOrders && (
                        <Card to="/orders" color="#ffc107"> 
                            <CardIcon color="#ffc107"><FaFileInvoice /></CardIcon> 
                            <h2>Pedidos y Apartados</h2> 
                            <p>Administra pedidos de clientes y artículos reservados.</p> 
                        </Card>
                    )}
                    
                    {/* 3. Clientes y Créditos (VENDEDOR, CONTADOR) */}
                    {canAccessCredits && (
                        <Card to="/credits" color="#17a2b8"> 
                            <CardIcon color="#17a2b8"><FaCreditCard /></CardIcon> 
                            <h2>Clientes y Créditos</h2> 
                            <p>Gestiona clientes, saldos pendientes y abonos.</p> 
                        </Card>
                    )}

                    {/* 4. Inventario (ADMIN, INVENTARIO) */}
                    {canAccessInventory && (
                        <Card to="/inventory" color="#28a745"> 
                            <CardIcon color="#28a745"><FaBoxOpen /></CardIcon> 
                            <h2>Inventario</h2> 
                            <p>Controla el stock de tus productos y mercancía.</p> 
                        </Card>
                    )}

                    {/* 5. Carga Masiva (ADMIN, INVENTARIO) */}
                    {canAccessMassUpload && (
                        <Card to="/upload/inventory" color="#6f42c1"> 
                            <CardIcon color="#6f42c1"><FaCloudUploadAlt /></CardIcon> 
                            <h2>Carga Masiva</h2> 
                            <p>Actualiza grandes volúmenes de inventario desde archivos CSV.</p> 
                        </Card>
                    )}

                    {/* 6. Reportes (ADMIN, GERENTE, CONTADOR) */}
                    {canAccessReports && (
                        <Card to="/reports" color="#6c757d"> 
                            <CardIcon color="#6c757d"><FaChartBar /></CardIcon> 
                            <h2>Reportes</h2> 
                            <p>Visualiza el rendimiento general de ventas y operaciones.</p> 
                        </Card>
                    )}

                    {/* 7. Gestión de Cajas (ADMIN, GERENTE, CONTADOR) */}
                    {canAccessCashReports && (
                        <Card to="/cash-report" color="#dc3545"> 
                            <CardIcon color="#dc3545"><FaBriefcase /></CardIcon>
                            <h2>Gestión de Cajas</h2>
                            <p>Consulta el estado de cajas abiertas y reportes de cierres.</p>
                        </Card>
                    )}

                    {/* 8. Usuarios (ADMIN) */}
                    {canAccessAdminUsers && (
                        <Card to="/admin/users" color="#ff6b6b"> 
                            <CardIcon color="#ff6b6b"><FaUsers /></CardIcon> 
                            <h2>Usuarios</h2> 
                            <p>Administra roles, accesos y permisos de usuario.</p> 
                        </Card>
                    )}
                </GridContainer>
            </Content>

            {/* Renderizar el Modal de Confirmación */}
            <ConfirmationModal
                isOpen={showLogoutModal}
                title="Confirmar Cierre de Sesión"
                message="¿Estás seguro de que quieres cerrar tu sesión actual?"
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleConfirmLogout}
            />
        </PageWrapper>
    );
};

export default Dashboard;

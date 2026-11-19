import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
    FaSignOutAlt,
    FaCashRegister,
    FaCrown,
    FaFileSignature,
    FaFileInvoiceDollar,
    FaHandHoldingUsd,
    FaChartPie,
    FaMoneyCheckAlt,
    FaBoxes,
    FaCloudUploadAlt,
    FaTruckMoving,
    FaCoins,
    FaChartBar,
    FaRocket,
    FaUserShield,
    FaClipboardCheck,
    FaSlidersH
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.jsx';

import ConfirmationModal from './pos/components/ConfirmationModal.jsx';
import SettingsModal from './pos/components/SettingsModal.jsx';
import WholesaleAuthModal from '../components/WholesaleAuthModal.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx'; // Assuming ProtectedRoute is in this path


// --- ESTILOS MEJORADOS Y RESPONSIVOS ---
const PageWrapper = styled.div`
    padding: clamp(1rem, 4vw, 2.5rem); 
    background-color: #f0f2f5; 
    min-height: 100vh;
    min-height: 100dvh;
    box-sizing: border-box;
    width: 100%;
    touch-action: pan-y;
    -webkit-overflow-scrolling: touch;
`;
const Content = styled.div`
    width: 100%;
    max-width: 1300px;
    margin: 0 auto;
    touch-action: pan-y;
`;
const TopBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center; 
    margin-bottom: 2rem; 
    gap: 1.2rem;
    flex-wrap: wrap;

    @media (max-width: 768px) {
        margin-bottom: 1.5rem;
    }
`;
const Header = styled.div`min-width: 0;`;
const WelcomeTitle = styled.h1`
    font-size: clamp(1.6rem, 4vw, 2.4rem); 
    color: #1e293b; 
    font-weight: 800;
    margin: 0;
    line-height: 1.2;
`;
const WelcomeSubtitle = styled.p`
    font-size: clamp(0.85rem, 2vw, 1.1rem);
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
    touch-action: manipulation;
    
    &:hover, &:focus { 
        background: #dc2626; 
        color: #fff; 
        box-shadow: 0 6px 10px rgba(220, 38, 38, 0.3); 
        outline: none; 
    }
`;
const GridContainer = styled.main`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
    gap: clamp(1rem, 2vw, 1.5rem);
    width: 100%;
    touch-action: pan-y;
    padding-bottom: calc(2.5rem + env(safe-area-inset-bottom, 0px));
`;
const Card = styled(Link)`
    background-color: #ffffff;
    border-radius: 16px; 
    padding: 1.5rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08); 
    transition: transform 0.2s ease, box-shadow 0.2s ease; 
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
    min-height: 130px;
    position: relative;
    overflow: hidden;
    touch-action: pan-y;
    -webkit-tap-highlight-color: transparent;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 6px;
        height: 100%;
        background-color: ${props => props.color || '#007bff'};
    }

    @media (hover: hover) {
        &:hover, &:focus { 
            transform: translateY(-4px); 
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15); 
            outline: none; 
        }
    }

    &:active {
        transform: scale(0.98);
        background-color: #f8fafc;
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
    width: 54px;
    height: 54px;
    border-radius: 16px;
    font-size: 1.55rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    background: linear-gradient(135deg, ${props => props.color || '#2563eb'} 0%, ${props => props.$secondary || props.color || '#1d4ed8'} 100%);
    box-shadow: 0 10px 20px -5px ${props => (props.color ? `${props.color}66` : 'rgba(37, 99, 235, 0.4)')},
                inset 0 1px 1px rgba(255, 255, 255, 0.35);
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;

    ${Card}:hover & {
        transform: scale(1.08) rotate(-3deg);
    }
`;

// --- Componente Dashboard ---
const Dashboard = () => {
    const { user, logout, hasPermission, isMasterAdmin } = useAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showWholesaleModal, setShowWholesaleModal] = useState(false);

    if (!user) {
        return (
            <PageWrapper>
                <Content><WelcomeTitle>Cargando...</WelcomeTitle></Content>
            </PageWrapper>
        );
    }

    // ----------------------------------------------------
    // CONTROL GRANULAR DE ACCESOS POR CASILLAS DE PERMISOS
    // ----------------------------------------------------
    const userRole = user.rol || 'N/A';

    const canAccessPOS = hasPermission('pos.acceso');
    const canAccessWholesale = hasPermission('pos_mayorista.acceso');
    const canAccessOrders = hasPermission('pedidos_apartados.acceso');
    const canAccessInvoices = hasPermission('facturas_proveedores.acceso');
    const canAccessCredits = hasPermission('clientes_creditos.ver');
    const canAccessFinances = hasPermission('finanzas.ver');
    const canAccessEmpleados = hasPermission('planilla.acceso') || hasPermission('empleados.acceso');
    const canAccessInventory = hasPermission('inventario.ver');
    const canAccessMassUpload = hasPermission('carga_masiva.acceso');
    const canAccessTraslados = hasPermission('salidas_inventario.acceso');
    const canAccessCashReports = hasPermission('caja_reportes.ver');
    const canAccessReports = hasPermission('reportes_ventas.ver');
    const canAccessBiConsole = hasPermission('bi_consola.ver');
    const canAccessAdminUsers = hasPermission('usuarios.acceso');
    const canAccessSolicitudes = hasPermission('solicitudes.acceso');
    const canAccessSettings = hasPermission('configuracion.acceso');

    const displayName = user.nombre_completo || user.nombre_usuario || user.nombre || user.name || 'Usuario';
    // ----------------------------------------------------

    const handlePrepareLogout = () => {
        setShowLogoutModal(true);
    };

    const handleConfirmLogout = () => {
        setShowLogoutModal(false);
        logout();
    };

    // --- PRE-FETCHING LOGIC FOR "INSTANT" FEEL ---
    const prefetch = (path) => {
        switch (path) {
            case '/pos': import('./pos/POS.jsx'); break;
            case '/inventory': import('./InventoryManagement.jsx'); break;
            case '/traslados': import('./InventoryOutflowPage.jsx'); break;
            case '/credits': import('./ClientesYCreditos.jsx'); break;
            case '/invoices': import('./FacturasProveedores.jsx'); break;
            case '/orders': import('./PedidosYApartados.jsx'); break;
            case '/finances': import('./Finances.jsx'); break; // Corrected path
            case '/detailed-sales-report': import('./DetailedSalesReport.jsx'); break;
            case '/empleados': import('./Empleados.jsx'); break; // Corrected path
            case '/bi-console': import('./BiConsole.jsx'); break;
            default: break;
        }
    };

    return (
        <PageWrapper>
            <Content>
                <TopBar>
                    <Header>
                        <WelcomeTitle>Bienvenido, {displayName} 👋</WelcomeTitle>
                        <WelcomeSubtitle>
                            Rol: <strong>{userRole}</strong>
                            {isMasterAdmin && (
                                <span style={{ marginLeft: 8, padding: '2px 9px', borderRadius: 999, background: '#dcfce7', color: '#166534', fontSize: '0.78rem', fontWeight: 700 }}>
                                    🔒 Admin Principal (1987)
                                </span>
                            )}
                            {' · '}Selecciona un módulo autorizado para empezar.
                        </WelcomeSubtitle>
                    </Header>
                    <LogoutButton aria-label="Cerrar sesión" onClick={handlePrepareLogout}>
                        <FaSignOutAlt /> Cerrar sesión
                    </LogoutButton>
                </TopBar>

                <GridContainer>
                    {/* 1. Punto de Venta */}
                    {canAccessPOS && (
                        <Card to="/pos" color="#2563eb" onMouseEnter={() => prefetch('/pos')}>
                            <CardIcon color="#2563eb" $secondary="#1d4ed8"><FaCashRegister /></CardIcon>
                            <h2>Punto de Venta</h2>
                            <p>Registra ventas y gestiona transacciones diarias.</p>
                        </Card>
                    )}

                    {/* Venta Mayorista */}
                    {canAccessWholesale && (
                        <Card as="div" onClick={() => setShowWholesaleModal(true)} color="#7c3aed" style={{ cursor: 'pointer' }}>
                            <CardIcon color="#8b5cf6" $secondary="#6d28d9"><FaCrown /></CardIcon>
                            <h2>Venta Mayorista</h2>
                            <p>Portal exclusivo para ventas al por mayor.</p>
                        </Card>
                    )}



                    {/* 2. Pedidos y Apartados */}
                    {canAccessOrders && (
                        <Card to="/orders" color="#d97706" onMouseEnter={() => prefetch('/orders')}>
                            <CardIcon color="#f59e0b" $secondary="#d97706"><FaFileSignature /></CardIcon>
                            <h2>Proformas y precios</h2>
                            <p>Crear Proformas y ver Productos</p>
                        </Card>
                    )}

                    {/* NUEVO: Facturas Proveedores */}
                    {canAccessInvoices && (
                        <Card to="/invoices" color="#db2777" onMouseEnter={() => prefetch('/invoices')}>
                            <CardIcon color="#ec4899" $secondary="#be185d"><FaFileInvoiceDollar /></CardIcon>
                            <h2>Facturas Proveedores</h2>
                            <p>Gestionar pagos, vencimientos y proveedores.</p>
                        </Card>
                    )}

                    {/* 3. Clientes y Créditos */}
                    {canAccessCredits && (
                        <Card to="/credits" color="#0284c7" onMouseEnter={() => prefetch('/credits')}>
                            <CardIcon color="#0ea5e9" $secondary="#0369a1"><FaHandHoldingUsd /></CardIcon>
                            <h2>Clientes y Créditos</h2>
                            <p>Gestiona clientes, saldos pendientes y abonos.</p>
                        </Card>
                    )}
                    {/* TARJETA: Finanzas (Admin/Gerente/Contador) */}
                    {canAccessFinances && (
                        <Card to="/finances" color="#059669" onMouseEnter={() => prefetch('/finances')}>
                            <CardIcon color="#10b981" $secondary="#047857"><FaChartPie /></CardIcon>
                            <h2>Finanzas y Estadísticas</h2>
                            <p>Gestión de ingresos, gastos y analítica general.</p>
                        </Card>
                    )}

                    {/* TARJETA: Planilla y Comisiones (Dueño / Usuarios Especiales) */}
                    {canAccessEmpleados && (
                        <Card to="/empleados" color="#0f766e" onMouseEnter={() => prefetch('/empleados')}>
                            <CardIcon color="#14b8a6" $secondary="#0f766e"><FaMoneyCheckAlt /></CardIcon>
                            <h2>Planilla y Comisiones</h2>
                            <p>Nómina, reglas de comisión sobre ganancia y liquidación de pagos.</p>
                        </Card>
                    )}

                    {/* 4. Inventario */}
                    {canAccessInventory && (
                        <Card to="/inventory" color="#16a34a" onMouseEnter={() => prefetch('/inventory')}>
                            <CardIcon color="#22c55e" $secondary="#15803d"><FaBoxes /></CardIcon>
                            <h2>Inventario</h2>
                            <p>Controla el stock de tus productos y mercancía.</p>
                        </Card>
                    )}

                    {/* 5. Carga Masiva */}
                    {canAccessMassUpload && (
                        <Card to="/upload/inventory" color="#6d28d9">
                            <CardIcon color="#8b5cf6" $secondary="#5b21b6"><FaCloudUploadAlt /></CardIcon>
                            <h2>Carga Masiva</h2>
                            <p>Actualiza inventario desde archivos CSV.</p>
                        </Card>
                    )}

                    {/* NUEVO: TRASLADOS / SALIDAS */}
                    {canAccessTraslados && (
                        <Card to="/traslados" color="#dc2626" onMouseEnter={() => prefetch('/traslados')}>
                            <CardIcon color="#ef4444" $secondary="#b91c1c"><FaTruckMoving /></CardIcon>
                            <h2>Traslados / Salidas</h2>
                            <p>Descontar mercancía por traslados o merma.</p>
                        </Card>
                    )}

                    {/* 7. Gestión de Cajas */}
                    {canAccessCashReports && (
                        <Card to="/cash-report" color="#e11d48">
                            <CardIcon color="#f43f5e" $secondary="#be123c"><FaCoins /></CardIcon>
                            <h2>Gestión de Cajas</h2>
                            <p>Cierres y arqueos de caja.</p>
                        </Card>
                    )}

                    {/* Reportes de Ventas Detallado */}
                    {canAccessReports && (
                        <Card to="/detailed-sales-report" color="#4f46e5" onMouseEnter={() => prefetch('/detailed-sales-report')}>
                            <CardIcon color="#6366f1" $secondary="#4338ca"><FaChartBar /></CardIcon>
                            <h2>Reporte de Ventas Detallado</h2>
                            <p>Ventas, devoluciones y rastreo por producto.</p>
                        </Card>
                    )}

                    {/* Consola de Inteligencia de Negocios (BI) */}
                    {canAccessBiConsole && (
                        <Card to="/bi-console" color="#ea580c" onMouseEnter={() => prefetch('/bi-console')}>
                            <CardIcon color="#f97316" $secondary="#c2410c"><FaRocket /></CardIcon>
                            <h2>Consola BI & Analítica</h2>
                            <p>Panel de Inteligencia de Negocios y Proyección.</p>
                        </Card>
                    )}

                    {/* 8. Usuarios */}
                    {canAccessAdminUsers && (
                        <Card to="/admin/users" color="#be123c">
                            <CardIcon color="#e11d48" $secondary="#9f1239"><FaUserShield /></CardIcon>
                            <h2>Usuarios y Trazabilidad</h2>
                            <p>Control de permisos por casillas y bitácora de actividad.</p>
                        </Card>
                    )}

                    {/* 9. Solicitudes */}
                    {canAccessSolicitudes && (
                        <Card to="/solicitudes" color="#f97316">
                            <CardIcon color="#fb923c" $secondary="#ea580c"><FaClipboardCheck /></CardIcon>
                            <h2>Solicitudes</h2>
                            <p>Realizar pedidos y requerimientos.</p>
                        </Card>
                    )}

                    {/* 10. Configuración */}
                    {canAccessSettings && (
                        <Card as="button" onClick={() => setShowSettings(true)} color="#334155" style={{ textAlign: 'left', border: 'none', cursor: 'pointer' }}>
                            <CardIcon color="#475569" $secondary="#1e293b"><FaSlidersH /></CardIcon>
                            <h2>Configuración</h2>
                            <p>Datos de empresa y tickets.</p>
                        </Card>
                    )}
                </GridContainer>
            </Content>

            <ConfirmationModal
                isOpen={showLogoutModal}
                title="Confirmar Cierre de Sesión"
                message="¿Estás seguro de que quieres cerrar tu sesión actual?"
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleConfirmLogout}
            />

            <SettingsModal
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
            />

            <WholesaleAuthModal
                isOpen={showWholesaleModal}
                onClose={() => setShowWholesaleModal(false)}
            />
        </PageWrapper >
    );
};

export default Dashboard;
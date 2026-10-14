import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
    FaShoppingCart, FaTags, FaChartLine, FaArrowLeft, FaBoxOpen
} from 'react-icons/fa';

const PageWrapper = styled.div`
    padding: clamp(1rem, 4vw, 2rem);
    background-color: #f0f2f5;
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    touch-action: pan-y;
    -webkit-overflow-scrolling: touch;
`;

const Content = styled.div`
    width: 100%;
    max-width: 1000px;
    touch-action: pan-y;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    width: 100%;

    @media (max-width: 768px) {
        margin-bottom: 1.5rem;
    }
`;

const Title = styled.h1`
    color: #8b5cf6;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 15px;
    font-size: clamp(1.8rem, 4vw, 2.5rem);
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.5rem;
    width: 100%;
    touch-action: pan-y;
    padding-bottom: calc(2.5rem + env(safe-area-inset-bottom, 0px));
`;

const MenuCard = styled(Link)`
    background: white;
    padding: 2rem;
    border-radius: 16px;
    text-decoration: none;
    color: inherit;
    box-shadow: 0 10px 25px rgba(0,0,0,0.05);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    border: 2px solid transparent;
    touch-action: pan-y;
    -webkit-tap-highlight-color: transparent;

    @media (hover: hover) {
        &:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(139, 92, 246, 0.15);
            border-color: #8b5cf6;
        }
    }

    &:active {
        transform: scale(0.98);
        background-color: #f8fafc;
    }

    h2 { margin: 1rem 0 0.5rem; color: #1e293b; }
    p { color: #64748b; margin: 0; }
`;

const IconWrapper = styled.div`
    background: ${props => props.bg || '#f3e8ff'};
    color: ${props => props.color || '#8b5cf6'};
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
`;

const BackButton = styled(Link)`
    display: flex;
    align-items: center;
    gap: 8px;
    color: #64748b;
    text-decoration: none;
    font-weight: 600;
    padding: 10px 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    transition: all 0.2s;

    &:hover { color: #1e293b; transform: translateX(-2px); }
`;

const WholesaleMenu = () => {
    return (
        <PageWrapper>
            <Content>
                <Header>
                    <BackButton to="/dashboard"><FaArrowLeft /> Volver al Dashboard</BackButton>
                </Header>

                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <Title style={{ justifyContent: 'center' }}>
                        <FaTags /> Módulo Mayorista
                    </Title>
                    <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '10px' }}>
                        Área exclusiva para gestión de ventas al por mayor.
                    </p>
                </div>

                <Grid>
                    <MenuCard to="/wholesale-pos">
                        <IconWrapper bg="#fff7ed" color="#ea580c">
                            <FaShoppingCart />
                        </IconWrapper>
                        <h2>Punto de Venta</h2>
                        <p>Facturación y pedidos mayoristas</p>
                    </MenuCard>

                    <MenuCard to="/admin/wholesale-promotions">
                        <IconWrapper bg="#eff6ff" color="#3b82f6">
                            <FaTags />
                        </IconWrapper>
                        <h2>Promociones</h2>
                        <p>Gestionar precios y ofertas</p>
                    </MenuCard>

                    <MenuCard to="/detailed-sales-report?tab=mayorista">
                        <IconWrapper bg="#f0fdf4" color="#16a34a">
                            <FaChartLine />
                        </IconWrapper>
                        <h2>Reportes</h2>
                        <p>Ventas y rendimiento mayorista</p>
                    </MenuCard>

                    <MenuCard to="/wholesale-catalog">
                        <IconWrapper bg="#fefce8" color="#ca8a04">
                            <FaBoxOpen />
                        </IconWrapper>
                        <h2>Catálogo de Productos</h2>
                        <p>Consultar precios mayoristas</p>
                    </MenuCard>
                </Grid>
            </Content>
        </PageWrapper>
    );
};

export default WholesaleMenu;

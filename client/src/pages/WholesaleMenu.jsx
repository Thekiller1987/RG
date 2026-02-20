import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
    FaShoppingCart, FaTags, FaChartLine, FaArrowLeft, FaBoxOpen
} from 'react-icons/fa';

const PageWrapper = styled.div`
    padding: 2rem;
    background-color: #f0f2f5;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Content = styled.div`
    width: 100%;
    max-width: 1000px;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3rem;
    width: 100%;
`;

const Title = styled.h1`
    color: #8b5cf6;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 15px;
    font-size: 2.5rem;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
`;

const MenuCard = styled(Link)`
    background: white;
    padding: 2rem;
    border-radius: 16px;
    text-decoration: none;
    color: inherit;
    box-shadow: 0 10px 25px rgba(0,0,0,0.05);
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    border: 2px solid transparent;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 35px rgba(139, 92, 246, 0.15);
        border-color: #8b5cf6;
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

                    <MenuCard to="/inventory?view=wholesale">
                        <IconWrapper bg="#fefce8" color="#ca8a04">
                            <FaBoxOpen />
                        </IconWrapper>
                        <h2>Inventario General</h2>
                        <p>Consultar existencias</p>
                    </MenuCard>
                </Grid>
            </Content>
        </PageWrapper>
    );
};

export default WholesaleMenu;

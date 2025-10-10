import styled, { keyframes, css } from 'styled-components';
import { FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// ----------------------------------------------------------------
// --- ANIMACIONES ---
// ----------------------------------------------------------------
export const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
`;

export const slideInFromLeft = keyframes`
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
`;

export const slideInFromRight = keyframes`
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
`;

export const spin = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
`;

export const pulseGreen = keyframes`
    0% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(40, 167, 69, 0); }
    100% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0); }
`;

export const scaleUp = keyframes`
    from { transform: scale(1); }
    to { transform: scale(1.03); }
`;

export const SpinningSpinner = styled(FaSpinner)`
    animation: ${spin} 1s linear infinite;
`;

// ----------------------------------------------------------------
// --- CONTENEDORES PRINCIPALES ---
// ----------------------------------------------------------------
export const PageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f5f7fa; 
    font-family: 'Inter', 'Poppins', sans-serif;
    color: #333;
`;

export const HeaderActions = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 1rem 2rem;
    background-color: #ffffff;
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    box-sizing: border-box;
    z-index: 1000;
    position: sticky;
    top: 0;

    .header-buttons {
        display: flex;
        gap: 10px;
        align-items: center;
    }

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 0.75rem; 
        align-items: flex-start;
        padding: 0.75rem;

        .header-buttons {
            width: 100%;
            justify-content: space-between;
            flex-wrap: wrap;
        }
    }
`;

export const PageContentWrapper = styled.div`
    display: flex;
    flex-grow: 1;
    width: 100%;
    gap: 1.5rem;
    padding: 1.5rem;
    box-sizing: border-box;
    
    @media (max-width: 1024px) {
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
        min-height: 1px; 
    }
`;

export const Panel = styled.div`
    background: white;
    border-radius: 16px;
    box-shadow: 0 12px 30px rgba(0, 30, 80, 0.08); 
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: hidden;

    @media (max-width: 1024px) {
        padding: 1rem;
    }
`;

export const MainPanel = styled(Panel)`
    flex: 2;
    min-width: 50%;
    animation: ${slideInFromLeft} 0.6s ease-out forwards;

    @media (max-width: 1024px) {
        flex: 1;
        min-width: 100%;
        min-height: 55vh; 
    }
`;

export const CartPanel = styled(Panel)`
    flex: 1;
    min-width: 380px;
    max-width: 450px;
    animation: ${slideInFromRight} 0.6s ease-out forwards;
    
    @media (max-width: 1024px) {
        min-width: 100%;
        max-width: 100%; 
        order: -1; 
        min-height: 35vh; 
        max-height: 60vh;
    }
`;

// ----------------------------------------------------------------
// --- COMPONENTES DE UI ---
// ----------------------------------------------------------------
const blocked = ['pay','primary','info','cancel','dark','mt','outOfStock','lowStock', '$pulsate', '$bordered', '$bold', 'ref'];

const shouldForwardProp = (prop) => !blocked.includes(prop);

export const Button = styled.button.withConfig({ shouldForwardProp })`
    min-height: 44px; 
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.95rem;
    transition: all 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin-top: ${p => p.mt ? '1rem' : '0'};
    box-shadow: 0 4px 10px rgba(0,0,0,0.08);
    flex-shrink: 0; /* Asegura que los botones no se encojan forzosamente */

    background-color: ${p => {
        if (p.primary) return '#28a745';
        if (p.cancel) return '#dc3545';
        if (p.pay) return '#007bff';
        if (p.info) return '#ffc107';
        if (p.dark) return '#343a40';
        return '#6c757d';
    }};
    color: white;
    
    &:hover:not(:disabled) {
        transform: translateY(-3px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        opacity: 0.9;
    }
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }

    ${p => p.outOfStock && 'opacity: 0.6; pointer-events: none;'}

    @media (max-width: 768px) {
        padding: 0.6rem 1rem; 
        font-size: 0.85rem;
        gap: 0.5rem;
    }
`;

export const SearchInput = styled.input`
    width: 100%;
    min-height: 50px; 
    padding: 0.9rem 1.2rem;
    border-radius: 12px;
    border: 1px solid #c7d2e0;
    background-color: #ffffff;
    font-size: 1.05rem;
    transition: all 0.2s ease;
    box-shadow: inset 0 2px 5px rgba(0,0,0,0.05);
    
    &:focus {
        border-color: #007bff;
        box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.15), inset 0 2px 5px rgba(0,0,0,0.05);
        outline: none;
    }
    
    @media (max-width: 768px) {
        min-height: 44px;
        font-size: 1rem;
    }
`;

export const ProductGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); 
    gap: 1.5rem;
    overflow-y: auto;
    flex-grow: 1; 
    padding: 0.5rem 0.25rem;
    align-content: start;
    
    @media (max-width: 768px) {
        grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); 
        gap: 0.75rem;
        height: 100%;
    }
`;

export const ProductCard = styled.div`
    border: 1px solid #e0e6ed;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
    text-align: center;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    
    /* CRÍTICO: Estilo rojo cuando está agotado (Alta prioridad) */
    ${p => p.outOfStock && css`
        background-color: #fef0f0 !important; /* Más claro para el fondo */
        border: 2px solid #dc3545 !important; /* Borde más fuerte */
        opacity: 0.8; 
        cursor: not-allowed;
        box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3); /* Sombra roja */
    `}
    
    ${p => !p.outOfStock && css`
        background-color: white;
        box-shadow: 0 4px 15px rgba(0,0,0,0.08);

        &:active {
            transform: scale(0.98); 
            box-shadow: 0 2px 8px rgba(0, 30, 80, 0.15);
        }
        &:hover {
            transform: translateY(-5px) scale(1.02);
            box-shadow: 0 15px 40px rgba(0, 30, 80, 0.15);
            border-color: #007bff;
        }
    `}

    .image-placeholder {
        height: 100px;
        background-color: #f4f7fa;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        font-weight: bold;
        color: #ced4da;
        border-bottom: 1px solid #e9ecef;
        
        @media (max-width: 768px) {
            height: 70px;
            font-size: 2rem;
        }
    }
    
    .info {
        padding: 0.75rem;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    p { 
        margin: 0; 
        font-size: 0.95em; 
        color: #495057;
        flex-grow: 1;
        font-weight: 600;
        line-height: 1.4;
        
        @media (max-width: 768px) {
            font-size: 0.8em;
        }
    }
    .price { 
        font-weight: 700; 
        color: #007bff; 
        font-size: 1.3em;
        margin-top: 0.5rem; 
        
        @media (max-width: 768px) {
            font-size: 1.1em;
        }
    }
`;

export const StockBadge = styled.div`
    position: absolute;
    top: 8px;
    right: 8px;
    padding: 3px 8px;
    border-radius: 16px;
    font-size: 0.75em;
    font-weight: 700;
    color: white;
    /* CRÍTICO: Aseguramos el color rojo para stock 0 */
    background-color: ${p => {
        if (p.outOfStock) return '#dc3545 !important'; 
        if (p.lowstock) return '#ffc107';
        return '#28a745';
    }};
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
`;

export const InfoBox = styled.div`
    background-color: #e6f7ff;
    color: #0056b3;
    padding: 1rem;
    border-radius: 12px;
    margin-bottom: 1rem;
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #bde0ff;
    ${p => p.$pulsate && css`animation: ${pulseGreen} 2s infinite;`}
    box-shadow: 0 2px 10px rgba(0, 123, 255, 0.1);

    strong {
        font-weight: 700;
        color: #007bff;
    }
`;

export const TotalsRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.1rem;
    font-weight: ${p => p.$bold ? '600' : 'normal'};
    padding: 0.75rem 0;
    border-top: ${p => p.$bordered ? '1px solid #e0e6ed' : 'none'};

    &.grand-total {
        font-size: 2rem;
        font-weight: 800;
        color: #28a745;
        padding: 1rem 0;
    }

    @media (max-width: 768px) {
        font-size: 1rem;
        &.grand-total {
            font-size: 1.8rem;
        }
    }
`;

export const CartItemWrapper = styled.div`
    display: flex;
    align-items: center;
    padding: 0.8rem 0;
    border-bottom: 1px solid #f0f2f5;
    &:last-child {
        border-bottom: none;
    }

    .item-info {
        flex-grow: 1;
        margin-right: 1rem;
    }
    .item-name {
        font-weight: 600;
        color: #343a40;
        margin: 0;
        font-size: 1.05rem;
    }
    .item-details {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-top: 0.25rem;
        font-size: 0.9em;
        color: #6c757d;
        flex-wrap: wrap;
    }
    .item-price {
        font-weight: 700;
        color: #007bff;
        min-width: 100px;
        text-align: right;
        font-size: 1.2rem;
    }
    input[type="number"] {
        width: 65px;
        padding: 6px;
        border-radius: 8px;
        border: 1px solid #c7d2e0;
        text-align: center;
        background-color: #fcfcfc;
        min-height: 38px;

        &:focus {
            border-color: #007bff;
            box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
            outline: none;
        }

        @media (max-width: 768px) {
            width: 50px; 
            font-size: 0.9rem;
        }
    }
`;

export const BackButton = styled(Link)` 
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: #495057;
    font-weight: 600;
    font-size: 1.1rem;
    transition: color 0.2s, transform 0.2s;
    
    padding: 8px;
    margin: -8px; 
    
    &:hover {
        color: #007bff;
        transform: translateX(-3px);
    }
`;

export const ActionButton = styled.button`
    background: none;
    border: 1px solid #e0e6ed;
    color: #6c757d;
    padding: 6px;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px; 
    cursor: pointer;
    line-height: 1;
    transition: all 0.2s ease;
    
    min-width: 38px;
    min-height: 38px;
    
    &:hover {
        background-color: #e9f5ff;
        color: #007bff;
        border-color: #bde0ff;
    }
`;

// Agregando estilos para el contenedor de tickets
export const TicketContainer = styled.div`
    display: flex;
    gap: 5px;
    overflow-x: auto;
    padding-bottom: 5px;
    
    /* Asegura que los botones dentro de este contenedor no crezcan a lo loco */
    & > ${Button} {
        flex-shrink: 0;
        padding: 0.5rem 0.75rem; /* Más pequeño para ahorrar espacio */
        font-size: 0.85rem;
    }
    
    /* Estilos de scrollbar más discretos */
    scrollbar-width: thin;
    scrollbar-color: #007bff #f0f2f5;

    &::-webkit-scrollbar {
        height: 6px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: #007bff;
        border-radius: 3px;
    }
    &::-webkit-scrollbar-track {
        background: #f0f2f5;
    }
`;

// ----------------------------------------------------------------
// --- MODAL COMPONENTS (CRITICAL FOR YOUR OTHER FILES) ---
// ----------------------------------------------------------------
export const ModalOverlay = styled.div`
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    backdrop-filter: blur(5px);
`;

export const ModalContent = styled.div`
    background: white;
    padding: 2.5rem;
    border-radius: 16px;
    width: 90%;
    max-width: ${p => p.$large ? '900px' : '700px'};
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
    max-height: 90vh;
    overflow-y: auto;
    animation: ${fadeIn} 0.4s ease-out;

    @media (max-width: 768px) {
        padding: 1.5rem; 
        max-height: 95vh;
    }
`;
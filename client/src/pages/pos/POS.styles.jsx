// POS.styles.jsx
import styled, { keyframes, css } from 'styled-components';
import { FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// --- ANIMACIONES ---
export const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
`;

export const spin = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
`;

export const pulsate = keyframes`
    0% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(40, 167, 69, 0); }
    100% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0); }
`;

export const SpinningSpinner = styled(FaSpinner)`
    animation: ${spin} 1s linear infinite;
`;

// --- CONTENEDORES PRINCIPALES ---
export const PageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f4f7fa; 
    font-family: 'Poppins', sans-serif;
`;

export const HeaderActions = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0.75rem 1.5rem;
    background-color: #ffffff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    box-sizing: border-box;
    z-index: 1000;
    position: sticky;
    top: 0;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 10px;
        align-items: flex-start;
        padding: 0.75rem;
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
    }
`;

export const Panel = styled.div`
    background: white;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0, 30, 80, 0.06);
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    animation: ${fadeIn} 0.5s ease-out;

    @media (max-width: 1024px) {
        padding: 1rem;
    }
`;

export const MainPanel = styled(Panel)`
    flex: 2;
    min-width: 50%;
    overflow: hidden; 
`;

export const CartPanel = styled(Panel)`
    flex: 1;
    min-width: 380px;
    max-width: 450px;
    
    @media (max-width: 1024px) {
        min-width: 100%;
        order: -1; 
    }
`;

// --- COMPONENTES DE UI ---
const blocked = ['pay','primary','info','cancel','dark','mt','outOfStock','lowStock'];

const shouldForwardProp = (prop) => !blocked.includes(prop);

export const Button = styled.button.withConfig({ shouldForwardProp })`
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.95rem;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin-top: ${p => p.mt ? '1rem' : '0'};
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);

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
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    ${p => p.outOfStock && 'opacity: 0.6; pointer-events: none;'}
`;

export const SearchInput = styled.input`
    width: 100%;
    padding: 0.8rem 1rem;
    border-radius: 10px;
    border: 1px solid #e0e6ed;
    background-color: #f4f7fa;
    font-size: 1rem;
    transition: all 0.2s ease;
    &:focus {
        border-color: #007bff;
        background-color: white;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }
`;

export const ProductGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1.25rem;
    overflow-y: auto;
    flex-grow: 1;
    padding: 0.5rem 0.25rem;
    align-content: start;
    
    @media (max-width: 768px) {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    }
`;

export const ProductCard = styled.div`
    border: 1px solid #e0e6ed;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background-color: ${p => p.outOfStock ? '#fdf2f2' : 'white'};
    
    ${p => !p.outOfStock && css`
        &:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0, 30, 80, 0.08);
            border-color: #007bff;
        }
    `}

    .image-placeholder {
        height: 80px;
        background-color: #f4f7fa;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.5rem;
        font-weight: bold;
        color: #ced4da;
    }
    
    .info {
        padding: 1rem;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    strong { 
        color: #343a40; 
        font-size: 0.9em; 
        display: block; 
        margin-bottom: 0.25rem; 
    }
    p { 
        margin: 0; 
        font-size: 0.8em; 
        color: #6c757d;
        flex-grow: 1;
    }
    .price { 
        font-weight: bold; 
        color: #007bff; 
        font-size: 1.1em; 
        margin-top: 0.75rem; 
    }
`;

export const StockBadge = styled.div`
    position: absolute;
    top: 8px;
    right: 8px;
    padding: 3px 8px;
    border-radius: 20px;
    font-size: 0.75em;
    font-weight: bold;
    color: white;
    background-color: ${p => p.lowStock ? '#ffc107' : '#28a745'};
    ${p => p.outOfStock && css`background-color: #dc3545;`}
`;

export const InfoBox = styled.div`
    background-color: #e9f5ff;
    color: #0056b3;
    padding: 1rem;
    border-radius: 12px;
    margin-bottom: 1rem;
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #bde0ff;
    ${p => p.$pulsate && css`animation: ${pulsate} 2s infinite;`}
`;

export const TotalsRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.1rem;
    font-weight: ${p => p.$bold ? '600' : 'normal'};
    padding: 0.75rem 0;
    border-top: ${p => p.bordered ? '1px solid #e0e6ed' : 'none'};

    &.grand-total {
        font-size: 1.6rem;
        font-weight: 700;
        color: #28a745;
        padding: 1rem 0;
    }
`;

export const CartItemWrapper = styled.div`
    display: flex;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid #f4f7fa;

    .item-info {
        flex-grow: 1;
        margin-right: 1rem;
    }
    .item-name {
        font-weight: 600;
        color: #343a40;
        margin: 0;
    }
    .item-details {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 0.25rem;
    }
    .item-price {
        font-weight: bold;
        color: #007bff;
        min-width: 80px;
        text-align: right;
    }
    input[type="number"] {
        width: 50px;
        padding: 4px;
        border-radius: 6px;
        border: 1px solid #e0e6ed;
        text-align: center;
    }
`;

export const BackButton = styled(Link)` 
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: #495057;
    font-weight: 600;
    font-size: 1rem;
    transition: color 0.2s;
    &:hover {
        color: #007bff;
    }
`;

export const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" 
        viewBox="0 0 24 24" fill="none" stroke="currentColor" 
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m15 18-6-6 6-6"/>
    </svg>
);

export const ModalOverlay = styled.div`
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    backdrop-filter: blur(4px);
`;

export const ModalContent = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 16px;
    width: 90%;
    max-width: ${p => p.$large ? '900px' : '700px'};
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    max-height: 90vh;
    overflow-y: auto;
    animation: ${fadeIn} 0.3s ease-out;
`;

export const ActionButton = styled.button`
  background: none;
  border: 1px solid #ccc;
  color: #555;
  padding: 4px;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
  line-height: 1;
  
  &:hover {
    background-color: #e9ecef;
    color: #000;
  }
`;
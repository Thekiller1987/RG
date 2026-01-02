// client/src/pages/POS/POS.styles.jsx
import styled, { keyframes, css } from 'styled-components';
import { FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

/* ───────────────────────── ANIMACIONES ───────────────────────── */
export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;
export const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;
export const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const SpinningSpinner = styled(FaSpinner)`
  animation: ${spin} 1s linear infinite;
`;

/* ─────────────────────── LAYOUT PRINCIPAL ───────────────────── */
export const PageWrapper = styled.div`
  display: flex; flex-direction: column; height: 100vh;
  background-color: #f0f4f8; /* Un gris azulado muy suave */
  font-family: 'Inter', sans-serif;
  color: #1e293b;
  overflow: hidden; /* Evitar scroll en el body, lo manejamos internamente */
`;

/* Header Glassmorphism */
export const HeaderActions = styled.header`
  position: sticky; top: 0; z-index: 50;
  width: 100%; height: 70px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 1.5rem;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);

  .right-actions {
    display: flex; gap: 10px; align-items: center;
  }

  @media (max-width: 768px) {
    padding: 0 1rem;
    height: 60px;
    .right-actions { gap: 5px; }
  }
`;

export const PageContentWrapper = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden; /* Para que el scroll sea interno en los paneles */
  gap: 1.5rem;
  padding: 1.5rem;
  position: relative;

  @media (max-width: 960px) {
    padding: 10px;
    gap: 0; /* En móvil, stackeamos o superponemos */
  }
`;

/* Panel Base */
export const Panel = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
  border: 1px solid rgba(255, 255, 255, 0.5);
  display: flex; flex-direction: column;
  overflow: hidden;
`;

/* Panel Izquierdo (Productos) */
export const MainPanel = styled(Panel)`
  flex: 1; /* Ocupa todo el espacio disponible */
  padding: 1.5rem;
  animation: ${fadeIn} 0.5s ease-out;

  @media (max-width: 960px) {
    width: 100%;
    padding: 1rem;
    background: transparent; /* En móvil, quitamos el fondo del contenedor mcpal para dar aire */
    box-shadow: none; border: none; backdrop-filter: none;
    border-radius: 0;
  }
`;

/* Panel Derecho (Carrito) */
export const CartPanel = styled(Panel)`
  width: 400px;
  padding: 1.5rem;
  animation: ${fadeIn} 0.5s ease-out;
  display: flex; flex-direction: column;
  
  @media (max-width: 960px) {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    top: 0; /* Full screen en móvil */
    width: 100%; height: 100%;
    z-index: 2000;
    border-radius: 0;
    transform: translateY(${p => (p.isOpen ? '0' : '110%')}); /* Slide up logic */
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 -10px 50px rgba(0,0,0,0.2);
  }
`;

/* Botón flotante para ver carrito en móvil */
export const MobileCartToggle = styled.button`
  display: none;
  @media (max-width: 960px) {
    display: flex; align-items: center; justify-content: space-between;
    position: fixed; bottom: 20px; left: 20px; right: 20px;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    color: white;
    padding: 15px 20px;
    border-radius: 50px;
    border: none;
    box-shadow: 0 10px 25px rgba(37, 99, 235, 0.5);
    z-index: 1000;
    font-weight: 700; font-size: 1.1rem;
    animation: ${slideUp} 0.4s ease-out;
  }
`;

/* ───────────────────────── COMPONENTES UI ───────────────────────── */

export const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  overflow-y: auto;
  padding-bottom: 80px; /* Espacio para el botón flotante en móvil */
  padding-right: 5px;

  /* Scrollbar bonita */
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); /* Tarjetas más pequeñas en móvil */
    gap: 10px;
  }
`;

export const ProductCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  display: flex; flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border-color: #bfdbfe;
  }

  ${p => p.outOfStock && css`
    opacity: 0.6; pointer-events: none; filter: grayscale(1);
    background: #f1f5f9;
  `}

  .image-placeholder {
    width: 100%; height: 140px;
    background: #f8fafc;
    display: flex; align-items: center; justify-content: center;
    position: relative;
    
    img { width: 100%; height: 100%; object-fit: cover; }
    .no-image-icon { font-size: 2.5rem; color: #cbd5e1; }
  }

  .info {
    padding: 12px;
    flex-grow: 1;
    display: flex; flex-direction: column; justify-content: space-between;
  }

  .product-name {
    font-weight: 600; font-size: 0.95rem; color: #334155; margin-bottom: 5px;
    line-height: 1.3;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }

  .price {
    font-weight: 800; color: #2563eb; font-size: 1.1rem;
  }
`;

export const StockBadge = styled.div`
  position: absolute; top: 10px; right: 10px;
  background: ${p => p.outOfStock ? '#ef4444' : p.lowstock ? '#f59e0b' : '#10b981'};
  color: white;
  font-size: 0.7rem; font-weight: 800;
  padding: 4px 8px;
  border-radius: 20px;
  z-index: 10;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
  
  &:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
`;

/* Botones Modernos (Pill Shapes) */
export const Button = styled.button`
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 10px 20px;
  border-radius: 50px; /* Pill shape */
  font-weight: 600;
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

  /* Variantes */
  ${p => p.primary && css`
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white;
    &:hover { box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3); transform: translateY(-1px); }
  `}

  ${p => p.secondary && css`
    background: white; color: #475569; border: 1px solid #e2e8f0;
    &:hover { background: #f8fafc; border-color: #cbd5e1; color: #1e293b; }
  `}

  ${p => p.danger && css`
    background: #fee2e2; color: #991b1b;
    &:hover { background: #fecaca; }
  `}

  ${p => p.success && css`
    background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white;
  `}

  &:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }
`;

export const BackButton = styled(Link)`
  display: flex; align-items: center; gap: 8px;
  color: #64748b; text-decoration: none; font-weight: 600;
  padding: 8px 12px; border-radius: 12px;
  &:hover { background: #f1f5f9; color: #334155; }
`;

/* Elementos del Carrito */
export const CartItemWrapper = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px;
  border-bottom: 1px solid #f1f5f9;
  background: white; margin-bottom: 8px; border-radius: 12px;
  transition: background 0.2s;
  &:hover { background: #f8fafc; }
`;

export const QtyControl = styled.div`
  display: flex; align-items: center; gap: 8px;
  background: #f1f5f9; padding: 4px; border-radius: 50px;
`;

export const RoundBtn = styled.button`
  width: 28px; height: 28px; border-radius: 50%;
  border: none; background: white;
  color: #475569;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  cursor: pointer;
  &:hover { color: #2563eb; transform: scale(1.1); }
`;

export const TotalsRow = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  padding: 8px 0;
  font-size: 1rem; color: #64748b; font-weight: 500;

  &.grand-total {
    font-size: 1.5rem; color: #1e293b; font-weight: 800;
    border-top: 2px dashed #e2e8f0; margin-top: 10px; padding-top: 15px;
  }
`;

export const InfoBox = styled.div`
  background: #eff6ff; border: 1px solid #dbeafe;
  color: #1e40af; padding: 10px 15px; border-radius: 12px;
  font-size: 0.9rem; display: flex; align-items: center; gap: 8px;
`;

export const TicketContainer = styled.div`
  display: flex; gap: 8px; overflow-x: auto; padding: 5px 0;
  margin-bottom: 10px;
  &::-webkit-scrollbar { height: 4px; }
`;

/* Modales */
export const ModalOverlay = styled.div`
  position: fixed; inset: 0; z-index: 3000;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(5px);
  display: flex; align-items: center; justify-content: center;
`;

export const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 20px;
  width: 90%; max-width: 600px;
  max-height: 90vh; overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: ${fadeIn} 0.3s ease-out;

  h2 { margin-top: 0; color: #1e293b; }
`;

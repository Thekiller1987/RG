// client/src/pages/pos/POS.styles.jsx
import styled, { keyframes, css } from 'styled-components';
import { FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

/* ===========================
   VARIABLES & THEME (Light Premium Glassmorphism)
   =========================== */
const C_BG_APP = '#f3f8fb';        // Un gris/celeste muy pálido, casi blanco
const C_BG_CARD = 'rgba(255, 255, 255, 0.7)'; // Vidrio esmerilado claro
const C_ACCENT = '#0ea5e9';        // Sky blue elegante
const C_ACCENT_HOVER = '#0284c7';
const C_ACCENT_LIGHT = '#e0f2fe';
const C_TEXT_DARK = '#0f172a';     // Slate 900
const C_TEXT_MUTED = '#64748b';    // Slate 500
const GLASS_BORDER = 'rgba(255, 255, 255, 0.4)';
const GLASS_SHADOW = '0 8px 32px 0 rgba(31, 38, 135, 0.05)';
const CARD_BORDER = '1px solid rgba(255, 255, 255, 0.7)';

/* ===========================
   ANIMACIONES
   =========================== */
export const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const SpinningSpinner = styled(FaSpinner)`
  animation: ${spin} 1s linear infinite;
`;

/* ===========================
   LAYOUT PRINCIPAL
   =========================== */
export const PageWrapper = styled.div`
  display: flex; flex-direction: column; height: 100vh;
  height: 100dvh;
  background: radial-gradient(circle at 15% 50%, rgba(224, 242, 254, 0.8), transparent 25%),
              radial-gradient(circle at 85% 30%, rgba(186, 230, 253, 0.6), transparent 25%),
              ${C_BG_APP};
  font-family: 'Inter', system-ui, sans-serif;
  color: ${C_TEXT_DARK};
  overflow: hidden;
`;

export const HeaderActions = styled.header`
  position: sticky; top: 0; z-index: 50;
  width: 100%; height: 64px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 1.5rem;
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: ${CARD_BORDER};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);

  .right-actions {
    display: flex; gap: 8px; align-items: center;
  }
`;

export const PageContentWrapper = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  height: calc(100vh - 64px);

  @media (max-width: 960px) {
    flex-direction: column;
    overflow-y: auto;
    height: auto;
    min-height: calc(100dvh - 64px);
  }
`;

/* Panel Izquierdo (Productos) */
export const MainPanel = styled.div`
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 960px) {
    width: 100%;
    padding: 12px;
    overflow: visible;
    padding-bottom: 80px; /* Space for mobile cart toggle */
  }
`;

/* Panel Derecho (Carrito) */
export const CartPanel = styled.div`
  width: 420px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-left: ${CARD_BORDER};
  display: flex;
  flex-direction: column;
  box-shadow: -8px 0 20px rgba(0,0,0,0.03);
  z-index: 40;
  
  @media (max-width: 960px) {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100dvh;
    border-left: none;
    border-top: ${CARD_BORDER};
    flex: none;
    transform: translateY(${props => props.isOpen ? '0' : '100%'});
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 2000;
  }
`;

export const MobileCartToggle = styled.button`
  display: none;
  @media (max-width: 960px) {
    display: flex; align-items: center; justify-content: space-between;
    position: fixed; bottom: 20px; left: 20px; right: 20px;
    background: linear-gradient(135deg, ${C_ACCENT} 0%, ${C_ACCENT_HOVER} 100%);
    color: white;
    padding: 16px 24px; border-radius: 16px; border: none;
    box-shadow: 0 10px 25px rgba(14, 165, 233, 0.4);
    z-index: 1000; font-weight: 700; font-size: 1.1rem; cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    &:active { transform: scale(0.96); }
  }
`;

/* ===========================
   PRODUCTOS
   =========================== */
export const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.25rem;
  overflow-y: auto;
  padding: 4px;
  padding-bottom: 2rem;
  flex: 1;
  align-content: start;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
  &::-webkit-scrollbar-track { background: transparent; }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
`;

export const ProductCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  border: 1px solid #e2e8f0;
  display: flex; flex-direction: column;
  height: 280px;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-color: #38bdf8;
    box-shadow: 0 12px 20px -5px rgba(14, 165, 233, 0.15), 0 8px 10px -6px rgba(14, 165, 233, 0.1);
    transform: translateY(-2px);
    .eye-icon { opacity: 1; transform: scale(1); }
  }

  ${p => p.outOfStock && css`
    opacity: 0.6; filter: grayscale(0.8);
    background: #f8fafc;
    pointer-events: none;
  `}

  .image-placeholder {
    width: 100%; height: 150px;
    background: #f1f5f9; /* Un tono gris/celeste muy claro para separar la imagen del texto blanco */
    display: flex; align-items: center; justify-content: center;
    position: relative;
    border-bottom: 1px solid #e2e8f0;
    
    img { width: 100%; height: 100%; object-fit: contain; padding: 12px; mix-blend-mode: darken; }
    .no-image-icon { font-size: 2.5rem; color: #cbd5e1; }
  }

  .eye-icon {
    position: absolute; top: 10px; left: 10px; z-index: 20;
    background: white; border-radius: 50%;
    width: 32px; height: 32px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    color: #475569;
    opacity: 0; transform: scale(0.8);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    
    &:hover { color: ${C_ACCENT}; transform: scale(1.15); }
  }

  .info {
    padding: 14px;
    flex-grow: 1;
    display: flex; flex-direction: column; gap: 4px;
    justify-content: space-between;
  }

  .product-name {
    font-weight: 600; font-size: 0.88rem; color: ${C_TEXT_DARK}; line-height: 1.3;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    height: 2.6em;
  }

  .price {
    font-weight: 800; color: ${C_ACCENT};
    font-size: 1.2rem;
  }

  @media (max-width: 768px) {
    height: 250px;
    border-radius: 14px;
    .image-placeholder { height: 120px; }
    .eye-icon { opacity: 1; transform: scale(1); background: rgba(255,255,255,0.9); }
  }
`;

export const StockBadge = styled.div`
  position: absolute; top: 10px; right: 10px;
  background: ${p => p.outOfStock ? 'rgba(239, 68, 68, 0.9)' : p.lowstock ? 'rgba(245, 158, 11, 0.9)' : 'rgba(16, 185, 129, 0.9)'};
  backdrop-filter: blur(4px);
  color: white; font-size: 0.7rem; font-weight: 700;
  padding: 4px 10px; border-radius: 12px; z-index: 10;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
`;

/* ===========================
   UI BÁSICA
   =========================== */
export const SearchInput = styled.input`
  width: 100%;
  padding: 14px 18px;
  border-radius: 14px;
  border: ${CARD_BORDER};
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  color: ${C_TEXT_DARK};
  font-size: 1rem;
  outline: none;
  box-shadow: 0 2px 10px rgba(0,0,0,0.02) inset;
  transition: all 0.3s ease;
  
  &::placeholder { color: #94a3b8; }
  &:focus { 
    border-color: ${C_ACCENT}; 
    background: white;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15); 
  }
`;

export const Button = styled.button`
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 12px 20px; border-radius: 12px;
  font-weight: 600; font-size: 0.95rem;
  border: 1px solid transparent; cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  ${p => p.primary && css`
    background: linear-gradient(135deg, ${C_ACCENT} 0%, ${C_ACCENT_HOVER} 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.25);
    &:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(14, 165, 233, 0.35); filter: brightness(1.05); }
    &:active:not(:disabled) { transform: translateY(0); }
  `}

  ${p => p.secondary && css`
    background: rgba(255, 255, 255, 0.8); color: ${C_TEXT_DARK}; border: ${CARD_BORDER};
    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    &:hover:not(:disabled) { background: white; transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0,0,0,0.05); }
  `}

  ${p => p.danger && css`
    background: #fef2f2; color: #ef4444; border: 1px solid #fecaca;
    &:hover:not(:disabled) { background: #fee2e2; transform: translateY(-1px); }
  `}

  &:disabled { opacity: 0.5; cursor: not-allowed; filter: grayscale(0.5); }
`;

export const BackButton = styled(Link)`
  display: flex; align-items: center; gap: 8px;
  color: ${C_TEXT_MUTED}; text-decoration: none; font-weight: 600; font-size: 0.95rem;
  padding: 8px 16px; border-radius: 10px;
  transition: all 0.2s;
  &:hover { color: ${C_TEXT_DARK}; background: rgba(0,0,0,0.04); }
`;

/* ===========================
   CARRITO / TICKETS
   =========================== */
export const CartItemWrapper = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  padding: 14px; margin: 0 12px 8px 12px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  border-radius: 14px;
  border: ${CARD_BORDER};
  box-shadow: 0 2px 6px rgba(0,0,0,0.02);
  transition: all 0.25s ease;
  &:hover { background: rgba(255, 255, 255, 0.9); transform: translateX(2px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
`;

export const QtyControl = styled.div`
  display: flex; align-items: center; gap: 8px;
  background: rgba(241, 245, 249, 0.8); padding: 4px; border-radius: 10px;
`;

export const RoundBtn = styled.button`
  width: 28px; height: 28px; border-radius: 8px;
  border: none; background: white;
  color: #64748b;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  cursor: pointer; transition: all 0.2s;
  &:hover { color: ${C_ACCENT}; transform: scale(1.1); box-shadow: 0 2px 6px rgba(0,0,0,0.12); }
  &:active { transform: scale(0.9); }
`;

export const TotalsRow = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 12px;
  font-size: 0.95rem; color: ${C_TEXT_MUTED}; font-weight: 500;

  &.grand-total {
    font-size: 1.5rem; color: #0f172a; font-weight: 900;
    border-top: 1px dashed #cbd5e1; margin-top: 8px; padding-top: 16px;
  }
`;

export const InfoBox = styled.div`
  background: rgba(254, 242, 242, 0.8); color: #991b1b; 
  padding: 12px 16px; border-radius: 12px;
  font-size: 0.85rem; display: flex; align-items: center; gap: 10px;
  margin: 0 12px 1rem 12px; border: 1px solid rgba(254, 202, 202, 0.5);
  backdrop-filter: blur(4px);
`;

export const TicketContainer = styled.div`
  display: flex; gap: 8px; overflow-x: auto; padding: 4px 12px 12px;
  margin-bottom: 8px;
  &::-webkit-scrollbar { height: 4px; }
  &::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 4px; }
`;

export const OrderTab = styled.div`
  padding: 8px 16px;
  border-radius: 12px;
  background: ${props => props.active ? C_ACCENT_LIGHT : 'rgba(241, 245, 249, 0.6)'};
  color: ${props => props.active ? C_ACCENT_HOVER : '#64748b'};
  font-weight: ${props => props.active ? '700' : '600'};
  font-size: 0.85rem;
  cursor: pointer;
  display: flex; align-items: center; gap: 8px;
  border: 1px solid ${props => props.active ? 'rgba(186, 230, 253, 0.8)' : 'transparent'};
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  min-width: 90px; justify-content: center;
  
  &:hover {
    background: ${props => props.active ? '#dbeafe' : 'rgba(226, 232, 240, 0.8)'};
    color: ${props => props.active ? '#0369a1' : '#334155'};
    transform: translateY(-2px);
  }

  ${props => props.active && css`
    box-shadow: 0 4px 10px rgba(14, 165, 233, 0.15);
  `}
`;

export const NewOrderBtn = styled.button`
  width: 36px; height: 36px; flex-shrink: 0;
  border-radius: 10px;
  border: 1px dashed #94a3b8;
  background: rgba(255,255,255,0.4);
  color: #64748b;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  margin-left: 2px;
  font-size: 0.9rem;

  &:hover {
    border-color: ${C_ACCENT};
    border-style: solid;
    color: ${C_ACCENT};
    background: ${C_ACCENT_LIGHT};
    transform: scale(1.05) rotate(90deg);
  }
`;

/* ===========================
   MODALES
   =========================== */
export const ModalOverlay = styled.div`
  position: fixed; inset: 0; z-index: 5000;
  background: rgba(15, 23, 42, 0.3);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  padding: 16px;
`;

export const ModalContent = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: ${CARD_BORDER};
  padding: 2.2rem;
  border-radius: 20px;
  width: 100%; max-width: 650px;
  max-height: 90vh; overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15);
  color: ${C_TEXT_DARK};

  h2 { margin-top: 0; color: #0f172a; display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 1.5rem; margin-bottom: 1.5rem; }
  h3 { color: #334155; }
  
  /* Scrollbar personalizado para modales */
  &::-webkit-scrollbar { width: 8px; }
  &::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
  &::-webkit-scrollbar-track { background: transparent; }

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 16px;
    h2 { font-size: 1.25rem; }
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 1.25rem;
  display: flex; flex-direction: column; gap: 8px;
  label { font-weight: 600; color: #475569; font-size: 0.9rem; }
  input, select, textarea {
    padding: 12px 16px; border-radius: 12px;
    border: 1px solid #cbd5e1; background: rgba(255,255,255,0.6);
    color: #1e293b; outline: none; transition: all 0.2s; font-size: 1rem;
    &:focus { border-color: ${C_ACCENT}; background: white; box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15); }
    &::placeholder { color: #94a3b8; }
    &:disabled { opacity: 0.5; background: #f1f5f9; }
  }
  select {
     appearance: none;
     background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
     background-repeat: no-repeat; background-position: right 1rem center; background-size: 1em;
  }
  select option { background: #0f172a; color: white; }
`;

// client/src/pages/pos/POS.styles.jsx
import styled, { keyframes, css } from 'styled-components';
import { FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

/* ===========================
   VARIABLES & THEME
   =========================== */
const C_BG_1 = '#dbeafe'; // Celeste cielo claro
const C_BG_2 = '#bfdbfe'; // Celeste cielo medio
const C_ACCENT = '#4A90E2';
const C_ACCENT_HOVER = '#3B7ADF';
const C_TEXT_LIGHT = '#e6ecff';
const C_TEXT_MUTED = '#99a3c4';
const GLASS_BG = 'rgba(255, 255, 255, 0.05)';
const GLASS_BG_HOVER = 'rgba(255, 255, 255, 0.08)';
const GLASS_BORDER = 'rgba(255, 255, 255, 0.12)';
const GLASS_SHADOW = '0 8px 32px 0 rgba(0, 0, 0, 0.3)';

/* ===========================
   ANIMACIONES
   =========================== */
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

/* ===========================
   LAYOUT PRINCIPAL
   =========================== */
export const PageWrapper = styled.div`
  display: flex; flex-direction: column; height: 100vh;
  height: 100dvh;
  background: linear-gradient(135deg, ${C_BG_1} 0%, ${C_BG_2} 100%);
  font-family: 'Inter', system-ui, sans-serif;
  color: ${C_TEXT_LIGHT};
  overflow: hidden;
`;

export const HeaderActions = styled.header`
  position: sticky; top: 0; z-index: 50;
  width: 100%; height: 64px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 1.5rem;
  background: rgba(11, 18, 32, 0.6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid ${GLASS_BORDER};
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);

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
  background: rgba(11, 18, 32, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-left: 1px solid ${GLASS_BORDER};
  display: flex;
  flex-direction: column;
  box-shadow: -8px 0 32px rgba(0,0,0,0.5);
  z-index: 40;
  
  @media (max-width: 960px) {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100dvh;
    border-left: none;
    border-top: 1px solid ${GLASS_BORDER};
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
    padding: 16px 24px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.2);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.1);
    z-index: 1000; font-weight: 700; font-size: 1.1rem; cursor: pointer;
    backdrop-filter: blur(10px);
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
  &::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.2); border-radius: 10px; }
  &::-webkit-scrollbar-track { background: transparent; }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
`;

export const ProductCard = styled.div`
  background: ${GLASS_BG};
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  border: 1px solid ${GLASS_BORDER};
  display: flex; flex-direction: column;
  height: 280px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  transition: all 0.2s ease;

  /* No hover transform here, Framer Motion will handle it for smoothness */
  &:hover {
    background: ${GLASS_BG_HOVER};
    border-color: rgba(255,255,255,0.25);
    box-shadow: 0 12px 24px rgba(0,0,0,0.3);
    .eye-icon { opacity: 1; transform: scale(1); }
  }

  ${p => p.outOfStock && css`
    opacity: 0.5; filter: grayscale(1);
    background: rgba(0,0,0,0.2);
    pointer-events: none;
  `}

  .image-placeholder {
    width: 100%; height: 150px;
    background: rgba(0,0,0,0.2);
    display: flex; align-items: center; justify-content: center;
    position: relative;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    
    img { width: 100%; height: 100%; object-fit: contain; padding: 12px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.4)); }
    .no-image-icon { font-size: 2.5rem; color: rgba(255,255,255,0.1); }
  }

  .eye-icon {
    position: absolute; top: 12px; left: 12px; z-index: 20;
    background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
    border-radius: 50%;
    width: 34px; height: 34px;
    display: flex; align-items: center; justify-content: center;
    border: 1px solid rgba(255,255,255,0.1);
    color: ${C_TEXT_LIGHT};
    opacity: 0; transform: scale(0.8);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    
    &:hover { background: ${C_ACCENT}; color: white; transform: scale(1.15); }
  }

  .info {
    padding: 14px;
    flex-grow: 1;
    display: flex; flex-direction: column; gap: 4px;
    justify-content: space-between;
  }

  .product-name {
    font-weight: 600; font-size: 0.88rem; color: ${C_TEXT_LIGHT}; line-height: 1.3;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    height: 2.6em; text-shadow: 0 1px 2px rgba(0,0,0,0.5);
  }

  .price {
    font-weight: 800; color: #4ade80; /* Emerald bright green for contrast */
    font-size: 1.15rem; text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  }

  @media (max-width: 768px) {
    height: 250px;
    border-radius: 16px;
    .image-placeholder { height: 120px; }
    .eye-icon { opacity: 1; transform: scale(1); background: rgba(0,0,0,0.4); }
  }
`;

export const StockBadge = styled.div`
  position: absolute; top: 10px; right: 10px;
  background: ${p => p.outOfStock ? 'rgba(239, 68, 68, 0.9)' : p.lowstock ? 'rgba(245, 158, 11, 0.9)' : 'rgba(16, 185, 129, 0.8)'};
  backdrop-filter: blur(4px);
  color: white; font-size: 0.7rem; font-weight: 800;
  padding: 4px 10px; border-radius: 12px; z-index: 10;
  box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2);
`;

/* ===========================
   UI BÁSICA
   =========================== */
export const SearchInput = styled.input`
  width: 100%;
  padding: 14px 18px;
  border-radius: 14px;
  border: 1px solid ${GLASS_BORDER};
  background: rgba(0, 0, 0, 0.2);
  color: white;
  font-size: 1rem;
  outline: none;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
  
  &::placeholder { color: ${C_TEXT_MUTED}; }
  &:focus { 
    border-color: ${C_ACCENT}; 
    background: rgba(0,0,0,0.4);
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.25), inset 0 2px 4px rgba(0,0,0,0.3); 
  }
`;

export const Button = styled.button`
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 12px 20px; border-radius: 14px;
  font-weight: 700; font-size: 0.95rem;
  border: 1px solid transparent; cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);

  ${p => p.primary && css`
    background: linear-gradient(135deg, ${C_ACCENT} 0%, ${C_ACCENT_HOVER} 100%); 
    color: white;
    box-shadow: 0 8px 16px rgba(74,144,226,0.3), inset 0 1px 0 rgba(255,255,255,0.2);
    border-color: rgba(255,255,255,0.1);
    &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 20px rgba(74,144,226,0.4); filter: brightness(1.1); }
    &:active:not(:disabled) { transform: translateY(0); }
  `}

  ${p => p.secondary && css`
    background: ${GLASS_BG}; color: ${C_TEXT_LIGHT}; border: 1px solid ${GLASS_BORDER};
    backdrop-filter: blur(8px);
    &:hover:not(:disabled) { background: ${GLASS_BG_HOVER}; border-color: rgba(255,255,255,0.25); transform: translateY(-1px); }
  `}

  ${p => p.danger && css`
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white;
    box-shadow: 0 8px 16px rgba(239,68,68,0.3);
    &:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-2px); }
  `}

  &:disabled { opacity: 0.5; cursor: not-allowed; filter: grayscale(0.5); }
`;

export const BackButton = styled(Link)`
  display: flex; align-items: center; gap: 8px;
  color: ${C_TEXT_MUTED}; text-decoration: none; font-weight: 600; font-size: 0.95rem;
  padding: 8px 16px; border-radius: 12px; background: rgba(0,0,0,0.2);
  border: 1px solid rgba(255,255,255,0.05);
  transition: all 0.2s;
  &:hover { color: white; background: rgba(0,0,0,0.4); border-color: rgba(255,255,255,0.15); }
`;

/* ===========================
   CARRITO / TICKETS
   =========================== */
export const CartItemWrapper = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  padding: 14px; margin: 0 12px 8px 12px;
  background: rgba(0,0,0,0.25);
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.05);
  transition: all 0.25s ease;
  &:hover { background: rgba(0,0,0,0.4); border-color: rgba(255,255,255,0.1); transform: translateX(4px); }
`;

export const QtyControl = styled.div`
  display: flex; align-items: center; gap: 10px;
  background: rgba(255,255,255,0.05); padding: 6px; border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.1);
`;

export const RoundBtn = styled.button`
  width: 30px; height: 30px; border-radius: 8px;
  border: none; background: rgba(255,255,255,0.1);
  color: white;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  cursor: pointer; transition: all 0.2s;
  &:hover { background: ${C_ACCENT}; transform: scale(1.1); }
  &:active { transform: scale(0.9); }
`;

export const TotalsRow = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 12px;
  font-size: 0.95rem; color: ${C_TEXT_MUTED}; font-weight: 500;

  &.grand-total {
    font-size: 1.6rem; color: #4ade80; font-weight: 900;
    border-top: 1px solid rgba(255,255,255,0.1); margin-top: 8px; padding-top: 16px;
    text-shadow: 0 2px 10px rgba(74, 222, 128, 0.2);
  }
`;

export const InfoBox = styled.div`
  background: rgba(239, 68, 68, 0.15); color: #fca5a5; 
  padding: 12px 16px; border-radius: 14px;
  font-size: 0.85rem; display: flex; align-items: center; gap: 10px;
  margin: 0 12px 1rem 12px; border: 1px solid rgba(239, 68, 68, 0.3);
  backdrop-filter: blur(4px);
`;

export const TicketContainer = styled.div`
  display: flex; gap: 10px; overflow-x: auto; padding: 4px 12px 12px;
  margin-bottom: 8px;
  &::-webkit-scrollbar { height: 4px; }
  &::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.2); border-radius: 4px; }
`;

export const OrderTab = styled.div`
  padding: 8px 16px;
  border-radius: 12px;
  background: ${props => props.active ? 'linear-gradient(135deg, rgba(74,144,226,0.2), rgba(59,122,223,0.1))' : 'rgba(0,0,0,0.2)'};
  color: ${props => props.active ? '#60a5fa' : C_TEXT_MUTED};
  font-weight: ${props => props.active ? '700' : '600'};
  font-size: 0.85rem;
  cursor: pointer;
  display: flex; align-items: center; gap: 8px;
  border: 1px solid ${props => props.active ? 'rgba(96,165,250,0.5)' : 'rgba(255,255,255,0.05)'};
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  min-width: 90px; justify-content: center;
  
  &:hover {
    background: ${props => props.active ? 'rgba(74,144,226,0.25)' : 'rgba(255,255,255,0.08)'};
    color: ${props => props.active ? '#93c5fd' : 'white'};
    transform: translateY(-2px);
  }

  ${props => props.active && css`
    box-shadow: 0 4px 12px rgba(96,165,250,0.15);
  `}
`;

export const NewOrderBtn = styled.button`
  width: 36px; height: 36px; flex-shrink: 0;
  border-radius: 12px;
  border: 1px dashed rgba(255,255,255,0.2);
  background: rgba(0,0,0,0.2);
  color: ${C_TEXT_MUTED};
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  margin-left: 2px;
  font-size: 0.9rem;

  &:hover {
    border-color: ${C_ACCENT};
    border-style: solid;
    color: white;
    background: ${C_ACCENT};
    transform: scale(1.05) rotate(90deg);
  }
`;

/* ===========================
   MODALES
   =========================== */
export const ModalOverlay = styled.div`
  position: fixed; inset: 0; z-index: 5000;
  background: rgba(5, 8, 15, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  padding: 16px;
`;

export const ModalContent = styled.div`
  background: linear-gradient(145deg, rgba(26, 35, 61, 0.95), rgba(15, 23, 42, 0.95));
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2.2rem;
  border-radius: 24px;
  width: 100%; max-width: 650px;
  max-height: 90vh; overflow-y: auto;
  box-shadow: 0 32px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05);
  color: ${C_TEXT_LIGHT};

  h2 { margin-top: 0; color: white; display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 1rem; margin-bottom: 1.5rem; }
  h3 { color: #cbd5e1; }
  
  /* Scrollbar personalizado para modales */
  &::-webkit-scrollbar { width: 8px; }
  &::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.2); border-radius: 10px; }
  &::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 10px;}

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 20px;
    h2 { font-size: 1.25rem; }
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 1.25rem;
  display: flex; flex-direction: column; gap: 8px;
  label { font-weight: 600; color: #cbd5e1; font-size: 0.9rem; }
  input, select, textarea {
    padding: 12px 16px; border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.3);
    color: white; outline: none; transition: all 0.2s; font-size: 1rem;
    &:focus { border-color: ${C_ACCENT}; background: rgba(0,0,0,0.5); box-shadow: 0 0 0 3px rgba(74,144,226,0.15); }
    &::placeholder { color: #64748b; }
    &:disabled { opacity: 0.5; }
  }
  select {
     appearance: none;
     background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
     background-repeat: no-repeat; background-position: right 1rem center; background-size: 1em;
  }
  select option { background: #0f172a; color: white; }
`;


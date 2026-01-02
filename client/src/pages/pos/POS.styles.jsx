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
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  font-family: 'Inter', sans-serif;
  color: #1e293b;
  overflow: hidden;
`;

export const HeaderActions = styled.header`
  position: sticky; top: 0; z-index: 50;
  width: 100%; height: 70px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 1.5rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(16px) saturate(180%);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);

  .right-actions {
    display: flex; gap: 12px; align-items: center;
  }

  @media (max-width: 768px) {
    padding: 0 1rem;
    height: 60px;
  }
`;

export const PageContentWrapper = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  gap: 1.5rem;
  padding: 1.5rem;
  position: relative;

  @media (max-width: 1024px) {
    padding: 12px;
    gap: 12px;
  }
`;

/* Panel Base Glassmorphism */
export const Panel = styled.div`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.6);
  display: flex; flex-direction: column;
  overflow: hidden;
`;

export const MainPanel = styled(Panel)`
  flex: 1;
  padding: 1.5rem;
  animation: ${fadeIn} 0.5s ease-out;

  @media (max-width: 960px) {
    width: 100%;
    padding: 0;
    background: transparent;
    box-shadow: none; border: none; backdrop-filter: none;
    border-radius: 0;
  }
`;

export const CartPanel = styled(Panel)`
  width: 420px;
  padding: 1.5rem;
  animation: ${fadeIn} 0.5s ease-out;
  display: flex; flex-direction: column;
  
  @media (max-width: 960px) {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    top: 0;
    width: 100%; height: 100%;
    z-index: 2000;
    border-radius: 0;
    transform: translateY(${p => (p.isOpen ? '0' : '100%')});
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 -20px 40px rgba(0,0,0,0.15);
    background: white; /* Más sólido en móvil para legibilidad */
  }
`;

export const MobileCartToggle = styled.button`
  display: none;
  @media (max-width: 960px) {
    display: flex; align-items: center; justify-content: space-between;
    position: fixed; bottom: 20px; left: 20px; right: 20px;
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
    padding: 16px 24px;
    border-radius: 16px;
    border: none;
    box-shadow: 0 12px 24px rgba(37, 99, 235, 0.4);
    z-index: 1000;
    font-weight: 700; font-size: 1rem;
    animation: ${slideUp} 0.4s ease-out;
    cursor: pointer;
    
    &:active { transform: scale(0.98); }
  }
`;

/* ───────────────────────── PRODUCTOS ───────────────────────── */

export const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 1.25rem;
  overflow-y: auto;
  padding: 5px;
  padding-bottom: 100px;
  
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background-color: #e2e8f0; border-radius: 10px; }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
`;

export const ProductCard = styled.div`
  background: white;
  border-radius: 18px;
  overflow: hidden;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #f1f5f9;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  display: flex; flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.02);
    border-color: #3b82f680;

    .eye-icon { opacity: 1; transform: scale(1); }
  }

  ${p => p.outOfStock && css`
    opacity: 0.6; filter: grayscale(0.5);
    background: #f8fafc;
    .price { color: #94a3b8 !important; }
  `}

  .image-placeholder {
    width: 100%; height: 160px;
    background: #f8fafc;
    display: flex; align-items: center; justify-content: center;
    position: relative;
    border-bottom: 1px solid #f1f5f9;
    
    img { width: 100%; height: 100%; object-fit: contain; background: white; transition: transform 0.5s; }
    &:hover img { transform: scale(1.05); }
    
    .no-image-icon { font-size: 2.5rem; color: #e2e8f0; }
  }

  /* El botón de zoom (ojito) */
  .eye-icon {
    position: absolute; bottom: 8px; left: 8px; z-index: 10;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(4px);
    border-radius: 50%;
    width: 32px; height: 32px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    color: #475569;
    opacity: 0; transform: scale(0.8);
    transition: all 0.2s ease;
    
    &:hover { color: #2563eb; background: white; transform: scale(1.1) !important; }
  }

  .info {
    padding: 1rem;
    flex-grow: 1;
    display: flex; flex-direction: column; gap: 8px;
  }

  .product-name {
    font-weight: 600; font-size: 0.9rem; color: #0f172a; line-height: 1.4;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    height: 2.8em;
  }

  .price {
    font-weight: 800; color: #2563eb; font-size: 1.15rem; margin-top: auto;
  }

  @media (max-width: 768px) {
    .image-placeholder { height: 130px; }
    .eye-icon { opacity: 1; transform: scale(1); background: rgba(255,255,255,0.7); }
    .info { padding: 0.75rem; }
  }
`;

export const StockBadge = styled.div`
  position: absolute; top: 10px; right: 10px;
  background: ${p => p.outOfStock ? '#ef4444' : p.lowstock ? '#f59e0b' : '#10b981'};
  color: white;
  font-size: 0.75rem; font-weight: 700;
  padding: 4px 10px;
  border-radius: 30px;
  z-index: 10;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

/* ───────────────────────── UI BASICA ───────────────────────── */

export const SearchInput = styled.input`
  width: 100%;
  padding: 14px 18px;
  border-radius: 16px;
  border: 2px solid #e2e8f0;
  background: white;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  
  &:focus { border-color: #3b82f6; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
`;

export const Button = styled.button`
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 12px 24px;
  border-radius: 14px;
  font-weight: 600; font-size: 0.95rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

  ${p => p.primary && css`
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white;
    &:hover { box-shadow: 0 10px 20px -5px rgba(37, 99, 235, 0.4); transform: translateY(-1px); }
  `}

  ${p => p.secondary && css`
    background: white; color: #475569; border: 1px solid #e2e8f0;
    &:hover { background: #f8fafc; border-color: #cbd5e1; color: #1e293b; }
  `}

  ${p => p.danger && css`
    background: #fef2f2; color: #ef4444; border: 1px solid #fecaca;
    &:hover { background: #fee2e2; }
  `}

  &:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; box-shadow: none !important; }
  &:active { transform: translateY(0); }
`;

export const BackButton = styled(Link)`
  display: flex; align-items: center; gap: 8px;
  color: #64748b; text-decoration: none; font-weight: 600; font-size: 0.9rem;
  padding: 8px 16px; border-radius: 12px;
  transition: all 0.2s;
  &:hover { background: #f1f5f9; color: #334155; }
`;

/* ───────────────────────── CARRITO ───────────────────────── */

export const CartItemWrapper = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  padding: 1rem;
  background: white; margin-bottom: 10px; border-radius: 16px;
  border: 1px solid #f1f5f9;
  transition: all 0.2s;
  &:hover { border-color: #e2e8f0; transform: scale(1.01); }
`;

export const QtyControl = styled.div`
  display: flex; align-items: center; gap: 10px;
  background: #f8fafc; padding: 6px; border-radius: 12px;
  border: 1px solid #f1f5f9;
`;

export const RoundBtn = styled.button`
  width: 32px; height: 32px; border-radius: 10px;
  border: none; background: white;
  color: #64748b;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  cursor: pointer;
  transition: all 0.2s;
  &:hover { color: #3b82f6; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
`;

export const TotalsRow = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 0;
  font-size: 0.95rem; color: #64748b; font-weight: 500;

  &.grand-total {
    font-size: 1.6rem; color: #0f172a; font-weight: 900;
    border-top: 2px dashed #e2e8f0; margin-top: 12px; padding-top: 18px;
  }
`;

export const InfoBox = styled.div`
  background: #fdf2f2; border: 1px solid #fecaca;
  color: #991b1b; padding: 12px 16px; border-radius: 14px;
  font-size: 0.85rem; display: flex; align-items: center; gap: 8px;
  margin-bottom: 1rem;
`;

export const TicketContainer = styled.div`
  display: flex; gap: 10px; overflow-x: auto; padding: 8px 0;
  margin-bottom: 12px;
  &::-webkit-scrollbar { height: 4px; }
`;

/* Modales */
export const ModalOverlay = styled.div`
  position: fixed; inset: 0; z-index: 5000;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  padding: 1rem;
`;

export const ModalContent = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 28px;
  width: 100%; max-width: 650px;
  max-height: 90vh; overflow-y: auto;
  box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.2);
  animation: ${fadeIn} 0.4s ease-out;

  h2 { margin-top: 0; color: #0f172a; font-size: 1.75rem; font-weight: 800; margin-bottom: 1.5rem; }
`;

// client/src/pages/POS/POS.styles.jsx
import styled, { keyframes, css } from 'styled-components';
import { FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

/* ───────────────────────── ANIMACIONES ───────────────────────── */
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

export const SpinningSpinner = styled(FaSpinner)`
  animation: ${spin} 1s linear infinite;
`;

/* ─────────────────────── CONTENEDORES BASE ───────────────────── */
export const PageWrapper = styled.div`
  display: flex; flex-direction: column; min-height: 100vh;
  background-color: #f5f7fa;
  font-family: 'Inter','Poppins',sans-serif; color: #333;
`;

export const HeaderActions = styled.header`
  position: sticky; top: 0; z-index: 1000;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 1rem 1.25rem;
  background-color: #fff;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  box-sizing: border-box;

  .right-actions {
    justify-self: end;
    display: inline-flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr auto;
    grid-template-rows: auto auto;
    row-gap: .5rem;
    .right-actions { grid-column: 1 / -1; justify-self: end; }
  }
`;

/* 65% productos / 35% carrito en desktop */
export const PageContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 65% 35%;
  gap: 1.25rem;
  padding: 1.25rem;
  flex: 1;
  box-sizing: border-box;

  @media (max-width: 1200px) {
    grid-template-columns: 60% 40%;
  }
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1rem;
    min-height: 1px;
  }
`;

export const Panel = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(0, 30, 80, 0.08);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  min-height: 0; /* permite scroll interno */
`;

export const MainPanel = styled(Panel)`
  animation: ${slideInFromLeft} 0.6s ease-out forwards;
  min-width: 0;
`;

export const CartPanel = styled(Panel)`
  animation: ${slideInFromRight} 0.6s ease-out forwards;
  min-width: 340px;
  max-width: 560px;

  /* Sticky dentro del viewport mientras se scrollean productos */
  position: sticky;
  top: 88px;

  /* Layout: top / lista / bottom */
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: .65rem;

  /* Alto para que siempre se vea la lista */
  min-height: calc(100vh - 120px);

  .cart-fixed-top {
    display: flex; flex-direction: column; gap: .5rem;
  }

  .cart-title {
    display: flex;
    align-items: center;
    gap: .5rem;
    margin: 0;
  }
  .cart-title-name {
    font-weight: 800;
    font-size: 1.25rem;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 75%;
  }
  .cart-title-count {
    font-weight: 600;
    color: #6c757d;
    font-size: .95rem;
  }

  .tickets-header { display: flex; align-items: center; justify-content: space-between; gap: .5rem; }
  .caja-pill { margin-bottom: .25rem; }

  /* Lista con scroll real y espacio propio */
  .cart-scroll {
    overflow: auto;
    padding-right: 4px;
    border: 1px solid #eef1f5;
    border-radius: 12px;
    background: #fafbfd;
    min-height: 260px;
  }

  .cart-fixed-bottom {
    display: flex; flex-direction: column; gap: .5rem;
    background: #fff;
    position: sticky; bottom: 0;
  }

  .cart-actions {
    display: grid; grid-template-columns: 1fr 1fr; gap: .5rem;
  }

  @media (max-width: 900px) {
    position: static;
    min-height: 65vh;
    grid-template-rows: auto 1fr auto;
  }

  @media (min-height: 900px) {
    min-height: calc(100vh - 120px);
  }
`;

/* ───────────────────────── COMPONENTES DE UI ───────────────────────── */
const blocked = [
  'pay','primary','info','cancel','$cancel','dark','mt',
  'outOfStock','outofstock','lowStock','lowstock',
  '$pulsate', '$bordered', '$bold', 'ref'
];
const shouldForwardProp = (prop) => !blocked.includes(prop);

export const Button = styled.button.withConfig({ shouldForwardProp })`
  min-height: 42px;
  padding: 0.75rem 1rem;
  border: none; border-radius: 12px;
  cursor: pointer;
  font-weight: 600; font-size: 0.95rem;
  transition: all 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
  display: inline-flex; align-items: center; justify-content: center;
  gap: 0.6rem;
  margin-top: ${p => p.mt ? '0.75rem' : '0'};
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
  flex-shrink: 0;

  background-color: ${p => {
    if (p.primary) return '#28a745';
    if (p.$cancel || p.cancel) return '#dc3545';
    if (p.pay) return '#007bff';
    if (p.info) return '#17a2b8';
    if (p.dark) return '#343a40';
    return '#6c757d';
  }};
  color: white;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
    opacity: 0.95;
  }
  &:disabled {
    opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none;
  }

  ${p => (p.outOfStock || p.outofstock) && 'opacity: 0.6; pointer-events: none;'}

  @media (max-width: 768px) {
    padding: 0.6rem 0.9rem; font-size: 0.88rem; gap: 0.5rem;
  }
`;

export const SearchInput = styled.input`
  width: 100%; min-height: 48px; padding: 0.9rem 1.2rem;
  border-radius: 12px; border: 1px solid #c7d2e0; background-color: #fff;
  font-size: 1.05rem; transition: all 0.2s ease;
  box-shadow: inset 0 2px 5px rgba(0,0,0,0.05);

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 4px rgba(0,123,255,0.15), inset 0 2px 5px rgba(0,0,0,0.05);
    outline: none;
  }

  @media (max-width: 768px) {
    min-height: 44px; font-size: 1rem;
  }
`;

export const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.25rem;
  overflow-y: auto;
  flex-grow: 1;
  padding: 0.5rem 0.25rem;
  align-content: start;

  @media (min-width: 1400px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1rem;
  }
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
  transition: all 0.25s cubic-bezier(0.165, 0.84, 0.44, 1);
  text-align: center;
  position: relative; overflow: hidden;
  display: flex; flex-direction: column;

  ${p => (p.outOfStock || p.outofstock) ? css`
      background-color: #fef0f0 !important;
      border: 2px solid #dc3545 !important;
      opacity: 0.9;
      cursor: not-allowed;
      box-shadow: 0 4px 15px rgba(220,53,69,.3);
    ` : css`
      background-color: white;
      box-shadow: 0 4px 15px rgba(0,0,0,0.08);
      &:active { transform: scale(0.98); box-shadow: 0 2px 8px rgba(0,30,80,0.15); }
      &:hover { transform: translateY(-4px) scale(1.01); box-shadow: 0 15px 40px rgba(0,30,80,0.15); border-color: #007bff; }
    `}

  .image-placeholder {
    height: 100px; background: #f4f7fa;
    display: flex; align-items: center; justify-content: center;
    font-size: 3rem; font-weight: bold; color: #ced4da;
    border-bottom: 1px solid #e9ecef;

    @media (max-width: 768px) { height: 70px; font-size: 2rem; }
  }
  .info { padding: .75rem; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; }
  p { margin: 0; font-size: .95em; color: #495057; font-weight: 600; line-height: 1.35; }
  .price { font-weight: 700; color: #007bff; font-size: 1.15em; margin-top: .5rem; }
`;

export const StockBadge = styled.div`
  position: absolute; top: 8px; right: 8px;
  padding: 3px 8px; border-radius: 16px;
  font-size: 0.75em; font-weight: 700; color: white;
  background-color: ${p => {
    const out = p.outOfStock || p.outofstock;
    const low = p.lowStock || p.lowstock;
    if (out) return '#dc3545';
    if (low) return '#ffc107';
    return '#28a745';
  }}; 
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
`;

export const InfoBox = styled.div`
  background-color: #e6f7ff;
  color: #0056b3;
  padding: 0.8rem 1rem;
  border-radius: 12px;
  margin-bottom: 0.25rem;
  font-weight: 500;
  display: flex; justify-content: space-between; align-items: center;
  border: 1px solid #bde0ff;
  ${p => p.$pulsate && css`animation: ${pulseGreen} 2s infinite;`}
  box-shadow: 0 2px 10px rgba(0, 123, 255, 0.08);

  strong { font-weight: 700; color: #007bff; }
`;

export const TotalsRow = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  font-size: 1.05rem;
  font-weight: ${p => p.$bold ? '700' : '500'};
  padding: 0.5rem 0;
  border-top: ${p => p.$bordered ? '1px solid #e0e6ed' : 'none'};

  &.grand-total {
    font-size: 1.75rem; font-weight: 800; color: #28a745;
    padding: .6rem 0;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    &.grand-total { font-size: 1.5rem; }
  }
`;

/* Ítem de carrito COMPACTO en desktop */
export const CartItemWrapper = styled.div`
  display: grid;
  grid-template-columns: 72px 1fr 120px 110px auto;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-bottom: 1px solid #eef1f5;
  background: #fff;

  &:last-child { border-bottom: none; }

  .item-qty { display:flex; align-items:center; gap:6px; }

  /* 🔸 El bloque de información (nombre + meta) usa 3 columnas para tener más ancho */
  .item-info { min-width: 0; grid-column: 2 / 5; }

  .item-name {
    font-weight: 600; color: #343a40; margin: 0; font-size: 1rem;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }

  .item-meta { margin-top: 2px; font-size: 0.85rem; color: #6c757d; }

  /* 🔸 Reubico unit y total en sus columnas para mantener orden */
  .item-unit { grid-column: 3; text-align: right; font-size: 0.95rem; color: #495057; }
  .item-total { grid-column: 4; font-weight: 700; color: #007bff; text-align: right; font-size: 1.05rem; }

  input[type="number"] {
    width: 64px; padding: 6px; border-radius: 8px; border: 1px solid #c7d2e0;
    text-align: center; background-color: #fcfcfc; min-height: 36px;
    &:focus { border-color: #007bff; box-shadow: 0 0 0 2px rgba(0,123,255,0.1); outline: none; }
  }

  @media (max-width: 1100px) {
    grid-template-columns: 60px 1fr 100px 90px auto;
  }
  @media (max-width: 768px) {
    grid-template-columns: 56px 1fr 90px;
    grid-template-areas:
      "qty name actions"
      "qty meta total";
    .item-qty { grid-area: qty; }
    .item-info { grid-area: name; grid-column: auto; }
    .item-meta { grid-area: meta; }
    .item-total { grid-area: total; }
  }
`;

export const BackButton = styled(Link)`
  display: inline-flex; align-items: center; gap: 0.5rem;
  text-decoration: none; color: #495057; font-weight: 600; font-size: 1.05rem;
  transition: color 0.2s, transform 0.2s;
  padding: 8px; margin: -8px;

  &:hover { color: #007bff; transform: translateX(-3px); }
`;

export const ActionButton = styled.button`
  background: #fff; border: 1px solid #e0e6ed; color: #6c757d;
  padding: 6px; margin: 0; display: flex; align-items: center; justify-content: center;
  border-radius: 8px; cursor: pointer; line-height: 1; transition: all 0.2s ease;
  min-width: 36px; min-height: 36px;

  &:hover { background-color: #e9f5ff; color: #007bff; border-color: #bde0ff; }
`;

export const TicketContainer = styled.div`
  display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px;

  & > ${Button} { flex-shrink: 0; padding: 0.5rem 0.75rem; font-size: 0.85rem; }

  scrollbar-width: thin; scrollbar-color: #007bff #f0f2f5;
  &::-webkit-scrollbar { height: 6px; }
  &::-webkit-scrollbar-thumb { background-color: #007bff; border-radius: 3px; }
  &::-webkit-scrollbar-track { background: #f0f2f5; }
`;

/* ────────────────────────── MODALES ────────────────────────── */
export const ModalOverlay = styled.div`
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex; justify-content: center; align-items: center;
  z-index: 2000; backdrop-filter: blur(5px);
`;

export const ModalContent = styled.div`
  background: white;
  padding: 2.0rem;
  border-radius: 16px;
  width: 92%;
  max-width: ${p => p.$large ? '900px' : '760px'};
  box-shadow: 0 15px 40px rgba(0,0,0,0.2);
  max-height: 92vh;
  overflow-y: auto;
  animation: ${fadeIn} 0.4s ease-out;

  @media (max-width: 768px) {
    padding: 1.2rem;
    max-height: 95vh;
  }
`;

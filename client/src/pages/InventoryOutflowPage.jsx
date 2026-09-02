// client/src/pages/InventoryOutflowPage.jsx
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FaArrowLeft, FaTruck, FaHistory, FaSearch, FaBarcode,
  FaTrash, FaSave, FaTimes, FaPrint, FaFileInvoice, FaUser,
  FaFont, FaImage, FaEye, FaBoxOpen, FaSync, FaExclamationTriangle,
  FaCheckCircle, FaMinus, FaPlus, FaShoppingCart
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import * as api from '../service/api';
import { useAuth } from '../context/AuthContext';
import { rankItems } from '../utils/searchEngine';
import OutflowTicketModal from './pos/components/OutflowTicketModal';

/* =========================================================
   DESIGN SYSTEM & GLASSMORPHISM STYLES (MATCHING POS)
========================================================= */

const fmt = (n) =>
  Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: radial-gradient(circle at 10% 10%, #eef6fc 0%, #f3f8fb 50%, #e9f2f8 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow: hidden;
  color: #1e293b;
`;

const TopNav = styled.header`
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(14px);
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  z-index: 20;
`;

const NavLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BackBtn = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: #f1f5f9;
  color: #475569;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.88rem;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: #e2e8f0;
    color: #0f172a;
    transform: translateX(-2px);
  }
`;

const PageTitle = styled.h1`
  font-size: 1.3rem;
  font-weight: 800;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;

  span.badge {
    font-size: 0.72rem;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 6px;
    background: #fee2e2;
    color: #ef4444;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const HeaderBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid ${props => props.$primary ? '#3b82f6' : '#cbd5e1'};
  background: ${props => props.$primary ? '#3b82f6' : '#ffffff'};
  color: ${props => props.$primary ? '#ffffff' : '#334155'};
  box-shadow: ${props => props.$primary ? '0 4px 10px rgba(59, 130, 246, 0.25)' : '0 2px 4px rgba(0,0,0,0.02)'};

  &:hover {
    background: ${props => props.$primary ? '#2563eb' : '#f8fafc'};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 1.25rem;
  padding: 1.25rem;
  flex: 1;
  overflow: hidden;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    overflow-y: auto;
  }
`;

/* =========================================================
   CATALOG PANEL (LEFT)
========================================================= */

const CatalogCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 1.25rem;
`;

const SearchRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 1rem;
  align-items: center;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  flex: 1;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 14px 12px 42px;
  background: #ffffff;
  border: 1.5px solid #cbd5e1;
  border-radius: 10px;
  font-size: 0.95rem;
  color: #1e293b;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const ClearSearchBtn = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: #e2e8f0;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #cbd5e1;
    color: #0f172a;
  }
`;

const FilterBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 1.5px solid ${props => props.$active ? '#3b82f6' : '#cbd5e1'};
  background-color: ${props => props.$active ? '#eff6ff' : '#ffffff'};
  color: ${props => props.$active ? '#3b82f6' : '#64748b'};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
  }
`;

const StatsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding: 0 4px;
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
`;

const ProductGrid = styled.div`
  flex: 1;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
  padding-right: 4px;
  padding-bottom: 10px;

  /* Custom Scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
`;

const ProductCard = styled.div`
  background: #ffffff;
  border: 1px solid ${props => props.$outOfStock ? '#fecaca' : '#e2e8f0'};
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  cursor: ${props => props.$outOfStock ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$outOfStock ? 0.6 : 1};
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.02);

  &:hover {
    ${props => !props.$outOfStock && `
      transform: translateY(-3px);
      box-shadow: 0 8px 18px -4px rgba(0, 0, 0, 0.08);
      border-color: #3b82f6;
    `}
  }

  &:active {
    ${props => !props.$outOfStock && `
      transform: translateY(-1px);
    `}
  }
`;

const StockBadge = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 3px 8px;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 700;
  color: white;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0,0,0,0.12);
  background: ${props => props.$out ? '#ef4444' : props.$low ? '#f59e0b' : '#10b981'};
`;

const ImageArea = styled.div`
  height: 120px;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #f1f5f9;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 6px;
  }
`;

const EyeBtn = styled.div`
  position: absolute;
  top: 6px;
  left: 6px;
  z-index: 12;
  background: white;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const CardInfo = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 4px;
`;

const ProductName = styled.div`
  font-weight: 600;
  font-size: 0.85rem;
  color: #1e293b;
  line-height: 1.25;
  height: 2.5rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const ProductCode = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
`;

const ProductPrice = styled.div`
  margin-top: auto;
  font-weight: 800;
  font-size: 0.95rem;
  color: #2563eb;
`;

/* =========================================================
   CART PANEL (RIGHT)
========================================================= */

const CartCard = styled.div`
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(14px);
  border-radius: 16px;
  border: 1px solid rgba(226, 232, 240, 0.85);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const CartHeader = styled.div`
  padding: 1.25rem;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
`;

const ToggleContainer = styled.div`
  display: flex;
  background: #f1f5f9;
  border-radius: 10px;
  padding: 4px;
  margin-bottom: 1rem;
  border: 1px solid #e2e8f0;
`;

const ToggleButton = styled.button`
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s ease;

  ${props => props.$active ? `
    background: #ffffff;
    color: ${props.$color || '#ef4444'};
    box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  ` : `
    background: transparent;
    color: #64748b;
  `}

  &:hover {
    ${props => !props.$active && `color: #0f172a;`}
  }
`;

const ClientSelector = styled.div`
  background: #f8fafc;
  border: 1.5px solid #cbd5e1;
  border-radius: 10px;
  padding: 8px 12px;
  margin-bottom: 0.75rem;
  position: relative;
`;

const ClientSearchInput = styled.input`
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.88rem;
  font-weight: 500;
  color: #1e293b;

  &::placeholder {
    color: #94a3b8;
  }
`;

const ClientDropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.12);
  z-index: 30;
  max-height: 200px;
  overflow-y: auto;
`;

const ClientOption = styled.div`
  padding: 10px 14px;
  font-size: 0.88rem;
  cursor: pointer;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background: #eff6ff;
    color: #2563eb;
  }
`;

const CartItemsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 8px;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
`;

const EmptyCartNotice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #94a3b8;
  text-align: center;
  padding: 2rem;
  gap: 12px;

  p {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 500;
  }
`;

const CartItemRow = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: border-color 0.2s;

  &:hover {
    border-color: #cbd5e1;
  }
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
`;

const ItemName = styled.div`
  font-weight: 600;
  font-size: 0.88rem;
  color: #0f172a;
  line-height: 1.3;
`;

const ItemCode = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 600;
`;

const ItemControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
`;

const QtyControls = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const QtyBtn = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  color: #334155;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.15s ease;

  &:hover {
    background: #e2e8f0;
    color: #0f172a;
    border-color: #94a3b8;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const QtyBadge = styled.div`
  min-width: 28px;
  text-align: center;
  font-weight: 700;
  font-size: 0.9rem;
  color: #0f172a;
`;

const PriceInput = styled.input`
  width: 90px;
  padding: 4px 8px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1.5px solid #cbd5e1;
  border-radius: 6px;
  color: #0f172a;
  outline: none;

  &:focus {
    border-color: #3b82f6;
  }
`;

const DeleteBtn = styled.button`
  background: transparent;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background 0.15s;

  &:hover {
    background: #fee2e2;
  }
`;

const CartFooter = styled.div`
  padding: 1.25rem;
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ReasonTextarea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid #cbd5e1;
  border-radius: 10px;
  font-family: inherit;
  font-size: 0.88rem;
  color: #1e293b;
  resize: none;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const TotalsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #64748b;

  strong {
    color: #0f172a;
    font-size: 1.15rem;
    font-weight: 800;
  }
`;

const SubmitActionBtn = styled.button`
  width: 100%;
  padding: 14px;
  background: ${props => props.$isSalida ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'};
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 6px 15px ${props => props.$isSalida ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)'};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px ${props => props.$isSalida ? 'rgba(239, 68, 68, 0.4)' : 'rgba(59, 130, 246, 0.4)'};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

/* =========================================================
   MODALS (MATCHING POS LOOK & FEEL)
========================================================= */

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(6px);
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: #ffffff;
  width: 100%;
  max-width: ${props => props.$width || '460px'};
  max-height: 85vh;
  border-radius: 20px;
  padding: 1.75rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;

  h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 800;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

const HistoryList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-right: 4px;
`;

const HistoryItemCard = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: #ffffff;
    border-color: #cbd5e1;
    box-shadow: 0 4px 10px rgba(0,0,0,0.03);
  }
`;

const ImageViewModal = ({ isOpen, imageSrc, onClose }) => {
  if (!isOpen || !imageSrc) return null;
  return (
    <ModalOverlay onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'relative', maxWidth: '90%', maxHeight: '90vh' }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: -12, right: -12,
            background: 'white', width: 32, height: 32, borderRadius: '50%',
            border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10, color: '#ef4444'
          }}
        >
          <FaTimes />
        </button>
        <img
          src={imageSrc}
          alt="Vista ampliada"
          style={{ maxWidth: '100%', maxHeight: '85vh', borderRadius: '16px', background: 'white', objectFit: 'contain', boxShadow: '0 20px 25px rgba(0,0,0,0.25)' }}
        />
      </motion.div>
    </ModalOverlay>
  );
};

/* =========================================================
   MAIN COMPONENT: InventoryOutflowPage
========================================================= */

const InventoryOutflowPage = () => {
  const { user, products: globalProducts, refreshProducts, clients = [], globalReservations, getAvailableStock } = useAuth();
  const navigate = useNavigate();

  // Estados Locales
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('description'); // 'description' or 'code'
  const [cart, setCart] = useState([]);
  const [reason, setReason] = useState('');
  const [outflowType, setOutflowType] = useState('SALIDA'); // 'SALIDA' or 'COTIZACION'
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientSearch, setClientSearch] = useState('');
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [ticketData, setTicketData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [viewImage, setViewImage] = useState({ isOpen: false, imageUrl: null });

  const searchInputRef = useRef(null);

  // Filtrado de clientes para cotización
  const filteredClients = useMemo(() => {
    return rankItems(clients, clientSearch, ['nombre']).slice(0, 10);
  }, [clientSearch, clients]);

  // Filtrado y rankeo de productos
  const filteredProducts = useMemo(() => {
    const isCodeSearch = searchType === 'code';
    const ranked = rankItems(globalProducts || [], searchTerm, isCodeSearch ? ['codigo', 'codigo_barras'] : ['nombre', 'codigo', 'descripcion'], {
      strict: isCodeSearch
    });
    return ranked.slice(0, 80);
  }, [globalProducts, searchTerm, searchType]);

  // Mapa de cantidades en carrito
  const cartQtyMap = useMemo(() => {
    const map = new Map();
    cart.forEach(item => {
      const pid = item.id_producto || item.id;
      map.set(pid, (map.get(pid) || 0) + Number(item.cantidad || 0));
    });
    return map;
  }, [cart]);

  // Totales
  const totals = useMemo(() => {
    let totalItems = 0;
    let totalMonto = 0;
    cart.forEach(item => {
      const qty = Number(item.cantidad || 0);
      const price = Number(item.precio_modificado !== undefined ? item.precio_modificado : (item.precio || item.venta || 0));
      totalItems += qty;
      totalMonto += qty * price;
    });
    return { totalItems, totalMonto };
  }, [cart]);

  // Agregar al Carrito
  const addToCart = (product) => {
    const pid = product.id_producto || product.id;
    const currentInCart = cartQtyMap.get(pid) || 0;
    const maxAvailable = getAvailableStock ? getAvailableStock(product, user?.id_usuario || user?.id) : Number(product.existencia || 0);

    if (outflowType === 'SALIDA') {
      if (currentInCart + 1 > maxAvailable) {
        toast.error(`Stock insuficiente. Solo hay ${maxAvailable} unidades disponibles considerando reservas.`);
        return;
      }
    }

    setCart(prev => {
      const existing = prev.find(item => (item.id_producto || item.id) === pid);
      if (existing) {
        return prev.map(item =>
          (item.id_producto || item.id) === pid
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        const unitPrice = parseFloat(product.precio_venta || product.precio || product.venta || 0);
        return [...prev, {
          ...product,
          id_producto: pid,
          id: pid,
          cantidad: 1,
          unit: unitPrice,
          precio_modificado: unitPrice
        }];
      }
    });

    toast.success(`${product.nombre} agregado`, { duration: 1200 });
  };

  // Modificar Cantidad en Carrito
  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      const pid = item.id_producto || item.id;
      if (pid === id) {
        const newQty = item.cantidad + delta;
        if (newQty <= 0) return null;

        if (outflowType === 'SALIDA') {
          const maxAvailable = getAvailableStock ? getAvailableStock(item, user?.id_usuario || user?.id) : Number(item.existencia || 0);
          if (newQty > maxAvailable) {
            toast.error(`Máximo alcanzado (${maxAvailable} unidades disponibles).`);
            return item;
          }
        }
        return { ...item, cantidad: newQty };
      }
      return item;
    }).filter(Boolean));
  };

  // Modificar Precio Unitario (Cotización)
  const updatePrice = (id, newPrice) => {
    setCart(prev => prev.map(item => {
      const pid = item.id_producto || item.id;
      if (pid === id) {
        return { ...item, precio_modificado: Number(newPrice) || 0 };
      }
      return item;
    }));
  };

  // Enviar / Confirmar
  const handleSubmit = () => {
    if (outflowType === 'SALIDA' && !reason.trim()) {
      return toast.error('Debe ingresar un motivo o justificación para la salida.');
    }
    if (outflowType === 'COTIZACION' && !selectedClient) {
      return toast.error('Seleccione un cliente para la cotización.');
    }
    if (cart.length === 0) {
      return toast.error('El carrito está vacío.');
    }
    setShowConfirm(true);
  };

  const confirmSubmit = async () => {
    setShowConfirm(false);
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const operatorName = user?.nombre || user?.nombre_usuario || user?.nombre_completo || 'Usuario';
      const res = await api.createOutflow({
        motivo: reason,
        items: cart,
        tipo: outflowType,
        id_cliente: selectedClient?.id_cliente,
        cliente_nombre: selectedClient?.nombre,
        usuario_nombre: operatorName
      }, token);

      setCart([]);
      setReason('');
      setSelectedClient(null);
      setClientSearch('');
      setTicketData(res.ticket);
      toast.success(outflowType === 'SALIDA' ? 'Salida procesada con éxito' : 'Cotización generada con éxito');

      refreshProducts();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || err.message || 'Error al procesar la operación.');
    } finally {
      setIsLoading(false);
    }
  };

  // Historial
  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = await api.fetchOutflowHistory(token);
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenHistory = () => {
    setShowHistory(true);
    fetchHistory();
  };

  const handleReprint = (tx) => {
    const ticket = {
      id: tx.tipo === 'COTIZACION' ? `COT-${tx.id}` : `TR-${tx.id}`,
      outflowId: tx.id,
      type: tx.tipo === 'COTIZACION' ? 'quote' : 'outflow',
      tipo: tx.tipo,
      fecha: tx.fecha,
      usuarioNombre: tx.usuario_nombre,
      clienteNombre: tx.tipo === 'COTIZACION' ? (tx.cliente_nombre || 'Cliente General') : `MOTIVO: ${tx.motivo}`,
      items: (tx.items || []).map(i => ({ ...i, total: (i.quantity || i.cantidad || 0) * (i.unit || i.precio || 0) })),
      totalVenta: tx.total_venta,
      totalCosto: tx.total_costo,
      isOutflow: true,
      isQuote: tx.tipo === 'COTIZACION'
    };
    setTicketData(ticket);
  };

  return (
    <PageWrapper>
      {/* HEADER TOP BAR */}
      <TopNav>
        <NavLeft>
          <BackBtn to="/dashboard">
            <FaArrowLeft /> Volver al Dashboard
          </BackBtn>
          <PageTitle>
            <FaTruck style={{ color: '#ef4444' }} /> Traslados y Salidas
            <span className="badge">Inventario</span>
          </PageTitle>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: '#ffffff', padding: '6px 14px', borderRadius: '20px',
            border: '1px solid #e2e8f0', fontSize: '0.84rem', color: '#475569',
            boxShadow: '0 2px 5px rgba(0,0,0,0.03)'
          }}>
            <FaUser size={12} color="#3b82f6" />
            <span>Operador: <strong style={{ color: '#0f172a' }}>{user?.nombre || user?.nombre_usuario || 'Usuario'}</strong></span>
          </div>
        </NavLeft>
        <NavRight>
          <HeaderBtn onClick={() => refreshProducts()} title="Sincronizar Catálogo">
            <FaSync /> Actualizar
          </HeaderBtn>
          <HeaderBtn $primary onClick={handleOpenHistory}>
            <FaHistory /> Historial de Salidas
          </HeaderBtn>
        </NavRight>
      </TopNav>

      {/* MAIN CONTENT 2-COL GRID */}
      <MainGrid>
        {/* LEFT: PRODUCTS CATALOG */}
        <CatalogCard>
          {/* SEARCH ROW */}
          <SearchRow>
            <SearchInputWrapper>
              <SearchIcon><FaSearch /></SearchIcon>
              <SearchInput
                ref={searchInputRef}
                placeholder={searchType === 'code' ? "Escribe código de producto..." : "Buscar por nombre o descripción..."}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && filteredProducts.length === 1) {
                    addToCart(filteredProducts[0]);
                    setSearchTerm('');
                  }
                }}
              />
              {searchTerm && (
                <ClearSearchBtn onClick={() => { setSearchTerm(''); searchInputRef.current?.focus(); }}>
                  <FaTimes size={11} />
                </ClearSearchBtn>
              )}
            </SearchInputWrapper>

            <FilterBtn
              $active={searchType === 'description'}
              onClick={() => { setSearchType('description'); searchInputRef.current?.focus(); }}
              title="Buscar por Nombre"
            >
              <FaFont size={16} />
            </FilterBtn>

            <FilterBtn
              $active={searchType === 'code'}
              onClick={() => { setSearchType('code'); searchInputRef.current?.focus(); }}
              title="Buscar por Código"
            >
              <FaBarcode size={18} />
            </FilterBtn>
          </SearchRow>

          {/* STATS BAR */}
          <StatsBar>
            <span><FaBoxOpen color="#3b82f6" /> {filteredProducts.length} productos mostrados</span>
            <span>Total Catálogo: {(globalProducts || []).length}</span>
          </StatsBar>

          {/* PRODUCT GRID */}
          <ProductGrid>
            {filteredProducts.map(p => {
              const pid = p.id_producto || p.id;
              const inCart = cartQtyMap.get(pid) || 0;
              const reservadoEnCajas = Number(globalReservations?.totalByProduct?.[pid] || 0);
              const maxAvailable = getAvailableStock ? getAvailableStock(p, user?.id_usuario || user?.id) : Number(p.existencia || 0);
              const restante = Math.max(0, maxAvailable - inCart);
              const outOfStock = outflowType === 'SALIDA' && restante <= 0;

              return (
                <ProductCard
                  key={pid}
                  $outOfStock={outOfStock}
                  onClick={() => !outOfStock && addToCart(p)}
                  title={p.nombre}
                >
                  <StockBadge
                    $out={outOfStock}
                    $low={restante < 5 && !outOfStock}
                  >
                    {outOfStock ? (reservadoEnCajas > 0 ? 'En Caja' : 'Agotado') : `Stock: ${restante}`}
                  </StockBadge>

                  <ImageArea>
                    {p.imagen && (
                      <EyeBtn onClick={(e) => { e.stopPropagation(); setViewImage({ isOpen: true, imageUrl: p.imagen }); }}>
                        <FaEye size={12} color="#475569" />
                      </EyeBtn>
                    )}
                    {p.imagen ? (
                      <img src={p.imagen} alt={p.nombre} loading="lazy" />
                    ) : (
                      <FaImage size={34} color="#cbd5e1" />
                    )}
                  </ImageArea>

                  <CardInfo>
                    <ProductName>{p.nombre}</ProductName>
                    <ProductCode>{p.codigo || 'S/C'}</ProductCode>
                    <ProductPrice>C$ {fmt(p.precio_venta || p.precio || p.venta)}</ProductPrice>
                  </CardInfo>
                </ProductCard>
              );
            })}
          </ProductGrid>
        </CatalogCard>

        {/* RIGHT: CART PANEL */}
        <CartCard>
          <CartHeader>
            {/* TYPE TOGGLE */}
            <ToggleContainer>
              <ToggleButton
                $active={outflowType === 'SALIDA'}
                $color="#ef4444"
                onClick={() => setOutflowType('SALIDA')}
              >
                <FaTruck size={14} /> Salida de Inventario
              </ToggleButton>
              <ToggleButton
                $active={outflowType === 'COTIZACION'}
                $color="#3b82f6"
                onClick={() => setOutflowType('COTIZACION')}
              >
                <FaFileInvoice size={14} /> Cotización
              </ToggleButton>
            </ToggleContainer>

            {/* CLIENT SELECTOR FOR QUOTES */}
            {outflowType === 'COTIZACION' && (
              <ClientSelector>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <FaUser size={12} color="#64748b" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Cliente Asignado:</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                  <ClientSearchInput
                    placeholder="Buscar o seleccionar cliente..."
                    value={selectedClient ? selectedClient.nombre : clientSearch}
                    onChange={e => {
                      setClientSearch(e.target.value);
                      setSelectedClient(null);
                      setShowClientDropdown(true);
                    }}
                    onFocus={() => setShowClientDropdown(true)}
                  />
                  {selectedClient && (
                    <button
                      onClick={() => { setSelectedClient(null); setClientSearch(''); }}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 2 }}
                    >
                      <FaTimes size={12} />
                    </button>
                  )}
                </div>
                {showClientDropdown && (
                  <ClientDropdown>
                    {filteredClients.map(c => (
                      <ClientOption
                        key={c.id_cliente}
                        onClick={() => {
                          setSelectedClient(c);
                          setClientSearch(c.nombre);
                          setShowClientDropdown(false);
                        }}
                      >
                        <strong>{c.nombre}</strong>
                        {c.telefono && <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{c.telefono}</span>}
                      </ClientOption>
                    ))}
                  </ClientDropdown>
                )}
              </ClientSelector>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
                <FaShoppingCart color={outflowType === 'SALIDA' ? '#ef4444' : '#3b82f6'} />
                Items en Carrito
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>
                {cart.length} productos
              </span>
            </div>
          </CartHeader>

          {/* CART ITEMS LIST */}
          <CartItemsList>
            {cart.length === 0 ? (
              <EmptyCartNotice>
                <FaBarcode size={44} />
                <p>Haz clic en los productos para agregarlos a la salida o cotización.</p>
              </EmptyCartNotice>
            ) : (
              cart.map(item => {
                const pid = item.id_producto || item.id;
                const unitPrice = item.precio_modificado !== undefined ? item.precio_modificado : (item.precio || item.venta || 0);

                return (
                  <CartItemRow key={pid}>
                    <ItemHeader>
                      <div style={{ flex: 1 }}>
                        <ItemName>{item.nombre}</ItemName>
                        <ItemCode>Código: {item.codigo || 'S/C'}</ItemCode>
                      </div>
                      <DeleteBtn onClick={() => updateQty(pid, -9999)} title="Eliminar del carrito">
                        <FaTrash size={13} />
                      </DeleteBtn>
                    </ItemHeader>

                    <ItemControls>
                      <QtyControls>
                        <QtyBtn onClick={() => updateQty(pid, -1)}><FaMinus /></QtyBtn>
                        <QtyBadge>{item.cantidad}</QtyBadge>
                        <QtyBtn onClick={() => updateQty(pid, 1)}><FaPlus /></QtyBtn>
                      </QtyControls>

                      {outflowType === 'COTIZACION' ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>C$</span>
                          <PriceInput
                            type="number"
                            step="0.01"
                            value={item.precio_modificado}
                            onChange={e => updatePrice(pid, e.target.value)}
                            title="Modificar precio unitario para cotización"
                          />
                        </div>
                      ) : (
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#2563eb' }}>
                          C$ {fmt(unitPrice * item.cantidad)}
                        </div>
                      )}
                    </ItemControls>
                  </CartItemRow>
                );
              })
            )}
          </CartItemsList>

          {/* CART FOOTER */}
          <CartFooter>
            {outflowType === 'SALIDA' && (
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', color: '#475569', marginBottom: 4 }}>
                  Motivo / Justificación de la Salida:
                </label>
                <ReasonTextarea
                  rows="2"
                  placeholder="Ej: Traslado a Sucursal 2, Merma por daño, Uso interno de taller..."
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                />
              </div>
            )}

            <TotalsRow>
              <span>Total Unidades:</span>
              <span>{totals.totalItems} un.</span>
            </TotalsRow>

            <TotalsRow>
              <span>Total Estimado:</span>
              <strong>C$ {fmt(totals.totalMonto)}</strong>
            </TotalsRow>

            <SubmitActionBtn
              $isSalida={outflowType === 'SALIDA'}
              disabled={cart.length === 0 || isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? (
                <>Procesando...</>
              ) : (
                <>
                  <FaSave />
                  {outflowType === 'SALIDA' ? 'Procesar Salida (Descontar Stock)' : 'Generar Comprobante Cotización'}
                </>
              )}
            </SubmitActionBtn>
          </CartFooter>
        </CartCard>
      </MainGrid>

      {/* CONFIRMATION DIALOG */}
      <AnimatePresence>
        {showConfirm && (
          <ModalOverlay
            onClick={() => setShowConfirm(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalContent onClick={e => e.stopPropagation()} $width="440px">
              <ModalHeader>
                <h2>
                  <FaExclamationTriangle color={outflowType === 'SALIDA' ? '#ef4444' : '#3b82f6'} />
                  {outflowType === 'SALIDA' ? 'Confirmar Salida' : 'Confirmar Cotización'}
                </h2>
                <button
                  onClick={() => setShowConfirm(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                >
                  <FaTimes size={16} />
                </button>
              </ModalHeader>
              <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.5, margin: '0 0 1.5rem 0' }}>
                {outflowType === 'SALIDA'
                  ? `¿Estás seguro de que deseas descontar ${totals.totalItems} unidades del inventario con el motivo "${reason}"?`
                  : `¿Deseas generar la cotización para el cliente "${selectedClient?.nombre || 'General'}" con un total de C$ ${fmt(totals.totalMonto)}?`}
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <HeaderBtn onClick={() => setShowConfirm(false)}>Cancelar</HeaderBtn>
                <HeaderBtn
                  $primary={outflowType !== 'SALIDA'}
                  style={outflowType === 'SALIDA' ? { background: '#ef4444', color: 'white', borderColor: '#ef4444' } : {}}
                  onClick={confirmSubmit}
                >
                  {outflowType === 'SALIDA' ? 'Sí, Descontar Stock' : 'Sí, Generar Cotización'}
                </HeaderBtn>
              </div>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* HISTORY MODAL */}
      <AnimatePresence>
        {showHistory && (
          <ModalOverlay
            onClick={() => setShowHistory(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalContent onClick={e => e.stopPropagation()} $width="680px">
              <ModalHeader>
                <h2><FaHistory color="#3b82f6" /> Historial de Salidas y Cotizaciones</h2>
                <button
                  onClick={() => setShowHistory(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                >
                  <FaTimes size={18} />
                </button>
              </ModalHeader>

              <HistoryList>
                {history.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
                    <FaBoxOpen size={40} style={{ marginBottom: 8 }} />
                    <p style={{ margin: 0 }}>No hay movimientos registrados.</p>
                  </div>
                ) : (
                  history.map(tx => (
                    <HistoryItemCard key={tx.id}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{
                            padding: '2px 8px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700,
                            background: tx.tipo === 'COTIZACION' ? '#eff6ff' : '#fee2e2',
                            color: tx.tipo === 'COTIZACION' ? '#2563eb' : '#ef4444'
                          }}>
                            {tx.tipo === 'COTIZACION' ? 'COTIZACIÓN' : 'SALIDA'} #{tx.id}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                            {new Date(tx.fecha).toLocaleString()}
                          </span>
                        </div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>
                          {tx.tipo === 'COTIZACION' ? `Cliente: ${tx.cliente_nombre || 'General'}` : `Motivo: ${tx.motivo}`}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 2 }}>
                          Por: <strong>{tx.usuario_nombre}</strong> | {tx.total_items} productos | Total: <strong>C$ {fmt(tx.total_venta)}</strong>
                        </div>
                      </div>
                      <HeaderBtn onClick={() => handleReprint(tx)} style={{ padding: '6px 12px', fontSize: '0.82rem' }}>
                        <FaPrint /> Imprimir
                      </HeaderBtn>
                    </HistoryItemCard>
                  ))
                )}
              </HistoryList>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* PRINT TICKET MODAL */}
      {ticketData && (
        <OutflowTicketModal
          isOpen={!!ticketData}
          transaction={ticketData}
          onClose={() => setTicketData(null)}
        />
      )}

      {/* IMAGE VIEW MODAL */}
      <AnimatePresence>
        {viewImage.isOpen && (
          <ImageViewModal
            isOpen={true}
            imageSrc={viewImage.imageUrl}
            onClose={() => setViewImage({ isOpen: false, imageUrl: null })}
          />
        )}
      </AnimatePresence>
    </PageWrapper>
  );
};

export default InventoryOutflowPage;

import React, { useState, useEffect, useRef, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import JsBarcode from 'jsbarcode';
import { QRCodeSVG } from 'qrcode.react';
import {
  FaBarcode, FaQrcode, FaPrint, FaTrash, FaTimes, FaPlus, FaMinus,
  FaSearch, FaLayerGroup, FaCheck, FaInfoCircle, FaFileAlt, FaTags,
  FaArrowLeft, FaArrowRight, FaCompressAlt, FaExpandAlt, FaBolt
} from 'react-icons/fa';

/* ==========================================
   SUBCOMPONENTE: GENERADOR DE CÓDIGO DE BARRAS SVG
========================================== */
const BarcodeSvg = ({
  value,
  width = 1.3,
  height = 32,
  displayValue = true,
  fontSize = 10
}) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (svgRef.current && value) {
      try {
        JsBarcode(svgRef.current, String(value), {
          format: 'CODE128',
          width,
          height,
          displayValue,
          fontSize,
          margin: 0,
          background: 'transparent',
          lineColor: '#000000',
          fontOptions: 'bold',
          textMargin: 1
        });
      } catch (err) {
        try {
          // Si tiene caracteres especiales no estándar, limpiar a alfanumérico
          const sanitized = String(value).replace(/[^a-zA-Z0-9_-]/g, '') || '000000';
          JsBarcode(svgRef.current, sanitized, {
            format: 'CODE128',
            width,
            height,
            displayValue,
            fontSize,
            margin: 0
          });
        } catch (e) {
          console.warn('No se pudo renderizar código de barras:', value);
        }
      }
    }
  }, [value, width, height, displayValue, fontSize]);

  return <svg ref={svgRef} style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto' }} />;
};

/* ==========================================
   STYLED COMPONENTS: MODAL & INTERFAZ
========================================== */
const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
`;

const ModalContainer = styled(motion.div)`
  background: #ffffff;
  width: 98vw;
  max-width: 1440px;
  height: 94vh;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  border: 1px solid #e2e8f0;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  color: #ffffff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  .title-group {
    display: flex;
    align-items: center;
    gap: 12px;

    .icon-badge {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      color: #ffffff;
      box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
    }

    h2 {
      font-size: 1.2rem;
      font-weight: 700;
      margin: 0;
      letter-spacing: -0.01em;
    }

    p {
      margin: 0;
      font-size: 0.8rem;
      color: #94a3b8;
    }
  }

  .actions-group {
    display: flex;
    align-items: center;
    gap: 12px;
  }
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #cbd5e1;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1.1rem;

  &:hover {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
    transform: rotate(90deg);
  }
`;

const ContentLayout = styled.div`
  display: grid;
  grid-template-columns: 460px 1fr;
  flex: 1;
  overflow: hidden;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
`;

/* ==========================================
   PANEL IZQUIERDO: CARRITO / BANDEJA DE ETIQUETAS
========================================== */
const LeftPanel = styled.div`
  background: #f8fafc;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const SearchBox = styled.div`
  padding: 1rem;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;

    svg {
      position: absolute;
      left: 12px;
      color: #94a3b8;
      font-size: 0.95rem;
    }

    input {
      width: 100%;
      padding: 9px 12px 9px 36px;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      font-size: 0.88rem;
      outline: none;
      transition: all 0.2s;
      background: #f8fafc;

      &:focus {
        border-color: #3b82f6;
        background: #ffffff;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
      }
    }
  }

  .autocomplete-results {
    margin-top: 8px;
    max-height: 180px;
    overflow-y: auto;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);

    .result-item {
      padding: 8px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #f1f5f9;
      cursor: pointer;
      transition: background 0.15s;

      &:hover {
        background: #eff6ff;
      }

      &:last-child {
        border-bottom: none;
      }

      .info {
        display: flex;
        flex-direction: column;
        gap: 2px;
        max-width: 320px;

        .name {
          font-size: 0.82rem;
          font-weight: 600;
          color: #1e293b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .meta {
          font-size: 0.74rem;
          color: #64748b;
          display: flex;
          gap: 8px;
        }
      }

      .add-btn {
        background: #dbeafe;
        color: #1d4ed8;
        border: none;
        border-radius: 6px;
        padding: 4px 8px;
        font-size: 0.75rem;
        font-weight: 600;
      }
    }
  }
`;

const QueueHeader = styled.div`
  padding: 0.75rem 1rem;
  background: #f1f5f9;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .stats {
    font-size: 0.82rem;
    font-weight: 700;
    color: #334155;
    display: flex;
    align-items: center;
    gap: 6px;

    .badge {
      background: #3b82f6;
      color: #ffffff;
      padding: 2px 7px;
      border-radius: 12px;
      font-size: 0.75rem;
    }
  }

  .quick-actions {
    display: flex;
    gap: 6px;

    button {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 0.74rem;
      font-weight: 600;
      color: #475569;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      transition: all 0.15s;

      &:hover {
        background: #e2e8f0;
        color: #1e293b;
      }

      &.danger:hover {
        background: #fee2e2;
        color: #b91c1c;
        border-color: #fca5a5;
      }
    }
  }
`;

const QueueList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const QueueItem = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  transition: all 0.2s;

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 2px 5px rgba(0,0,0,0.04);
  }

  .item-details {
    flex: 1;
    min-width: 0;

    .item-name {
      font-size: 0.83rem;
      font-weight: 600;
      color: #1e293b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .item-sub {
      font-size: 0.74rem;
      color: #64748b;
      display: flex;
      gap: 8px;
      margin-top: 2px;

      .code {
        font-family: monospace;
        background: #f1f5f9;
        padding: 1px 5px;
        border-radius: 4px;
        color: #334155;
      }

      .price {
        font-weight: 600;
        color: #059669;
      }
    }
  }

  .stepper {
    display: flex;
    align-items: center;
    gap: 4px;
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 2px 4px;

    button {
      width: 24px;
      height: 24px;
      border: none;
      background: #ffffff;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #475569;
      font-size: 0.75rem;
      transition: background 0.15s;

      &:hover {
        background: #e2e8f0;
        color: #0f172a;
      }
    }

    input {
      width: 36px;
      text-align: center;
      border: none;
      background: transparent;
      font-weight: 700;
      font-size: 0.85rem;
      color: #1e293b;
      outline: none;
    }
  }

  .stock-sync {
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    color: #1d4ed8;
    padding: 4px 6px;
    border-radius: 6px;
    font-size: 0.72rem;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 3px;

    &:hover {
      background: #dbeafe;
    }
  }

  .remove-btn {
    background: transparent;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    padding: 6px;
    border-radius: 6px;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      color: #ef4444;
      background: #fee2e2;
    }
  }
`;

const EmptyQueueMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #94a3b8;
  padding: 2rem;
  text-align: center;
  gap: 12px;

  svg {
    font-size: 3rem;
    color: #cbd5e1;
  }

  p {
    font-size: 0.9rem;
    margin: 0;
  }
`;

/* ==========================================
   PANEL DERECHO: VISTA PREVIA Y CONTROLES
========================================== */
const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  background: #f1f5f9;
  overflow: hidden;
`;

const ControlBar = styled.div`
  padding: 0.85rem 1.25rem;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;

  .config-section {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
  }

  .control-group {
    display: flex;
    flex-direction: column;
    gap: 4px;

    label {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #64748b;
    }

    select {
      padding: 6px 10px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 0.82rem;
      font-weight: 600;
      color: #1e293b;
      background: #f8fafc;
      outline: none;

      &:focus {
        border-color: #3b82f6;
      }
    }
  }

  .toggles {
    display: flex;
    gap: 10px;
    align-items: center;

    .toggle-chip {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 5px 10px;
      font-size: 0.78rem;
      font-weight: 600;
      color: #475569;
      cursor: pointer;
      user-select: none;
      transition: all 0.15s;

      &.active {
        background: #eff6ff;
        border-color: #3b82f6;
        color: #1d4ed8;
      }
    }
  }

  .print-action-btn {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: #ffffff;
    border: none;
    border-radius: 10px;
    padding: 9px 18px;
    font-size: 0.88rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
    transition: all 0.2s;

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(16, 185, 129, 0.35);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

const PaginationBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 1.25rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.8rem;
  color: #475569;

  .page-nav {
    display: flex;
    align-items: center;
    gap: 8px;

    button {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 4px 10px;
      font-size: 0.76rem;
      font-weight: 600;
      color: #334155;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;

      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
    }
  }

  .paper-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
    color: #0284c7;
    background: #e0f2fe;
    padding: 3px 10px;
    border-radius: 12px;
  }
`;

const PreviewArea = styled.div`
  flex: 1;
  overflow: auto;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: #64748b;
`;

/* ==========================================
   ESTILOS DE HOJA A4 (210mm x 297mm)
========================================== */
const A4Sheet = styled.div`
  width: 210mm;
  min-height: 297mm;
  height: 297mm;
  padding: 8mm;
  background: #ffffff;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
  box-sizing: border-box;
  display: grid;
  gap: 2mm;
  align-content: start;
  transform-origin: top center;

  /* Modos de cuadrícula según plantilla */
  &.layout-24 {
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: calc((281mm - (7 * 2mm)) / 8); /* 8 filas exactas */
  }

  &.layout-40 {
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: calc((281mm - (9 * 2mm)) / 10); /* 10 filas exactas */
  }

  &.layout-12 {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: calc((281mm - (5 * 2mm)) / 6); /* 6 filas exactas */
  }
`;

/* ETIQUETA INDIVIDUAL */
const LabelCard = styled.div`
  box-sizing: border-box;
  padding: 3mm;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  overflow: hidden;
  position: relative;
  background: #ffffff;

  /* Estilos para Papel Bond con Guías de Corte */
  &.paper-bond {
    border: 1px dashed #94a3b8;
    border-radius: 0;
  }

  /* Estilos para Papel Adhesivo / Stickers */
  &.paper-adhesive {
    border: 1px solid transparent;
    border-radius: 4px;
  }

  .company-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-bottom: 1.5mm;
    width: 100%;

    .company-logo {
      height: 18px;
      max-height: 18px;
      width: auto;
      object-fit: contain;
    }

    .company-title {
      font-size: 8pt;
      font-weight: 800;
      text-transform: uppercase;
      color: #1e293b;
      letter-spacing: 0.04em;
      line-height: 1;
      margin: 0;
    }
  }

  .product-name {
    font-size: 8pt;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.15;
    max-height: 2.3em;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    margin-bottom: 1.5mm;
  }

  .code-area {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1mm 0;

    &.hybrid {
      display: flex;
      align-items: center;
      justify-content: space-around;
      gap: 4px;
    }
  }

  .bottom-info {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1.5mm;
    padding-top: 1mm;
    border-top: 0.5px solid #e2e8f0;

    .code-text {
      font-size: 7.5pt;
      font-family: monospace;
      font-weight: 700;
      color: #334155;
    }

    .price-tag {
      font-size: 9.5pt;
      font-weight: 800;
      color: #059669;
      letter-spacing: -0.01em;
    }

    .category-text {
      font-size: 6.5pt;
      color: #64748b;
      text-transform: uppercase;
    }
  }
`;

/* ==========================================
   COMPONENTE PRINCIPAL
========================================== */
export default function BarcodeTicketGeneratorModal({
  isOpen,
  onClose,
  products = [],
  categories = [],
  initialProduct = null
}) {
  // Estado de la cola de impresión: [{ product, quantity }]
  const [queue, setQueue] = useState([]);

  // Búsqueda para agregar productos
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Opciones de configuración
  const [paperType, setPaperType] = useState('bond'); // 'bond' | 'adhesive'
  const [codeType, setCodeType] = useState('barcode'); // 'barcode' | 'qr' | 'hybrid'
  const [layoutType, setLayoutType] = useState('24'); // '24' (3x8) | '40' (4x10) | '12' (2x6)

  // Interruptores de visualización
  const [showLogo, setShowLogo] = useState(true);
  const [showCompany, setShowCompany] = useState(true);
  const [showPrice, setShowPrice] = useState(true);
  const [showCategory, setShowCategory] = useState(false);

  // Navegación de páginas A4 en el preview
  const [currentPage, setCurrentPage] = useState(0);

  // Cargar producto inicial si fue invocado con uno
  useEffect(() => {
    if (initialProduct && isOpen) {
      setQueue([{
        product: initialProduct,
        quantity: Math.max(1, Number(initialProduct.existencia) || 1)
      }]);
    }
  }, [initialProduct, isOpen]);

  // Filtrado de búsqueda predictiva
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    const term = searchTerm.toLowerCase();
    const matches = products.filter(p =>
      (p.nombre && p.nombre.toLowerCase().includes(term)) ||
      (p.codigo && p.codigo.toLowerCase().includes(term)) ||
      (p.codigo_barras && p.codigo_barras.toLowerCase().includes(term))
    ).slice(0, 10);
    setSearchResults(matches);
  }, [searchTerm, products]);

  // Capacidad de etiquetas por hoja según plantilla
  const labelsPerPage = useMemo(() => {
    if (layoutType === '40') return 40;
    if (layoutType === '12') return 12;
    return 24; // Por defecto 24
  }, [layoutType]);

  // Lista aplanada de todas las etiquetas a imprimir (repetidas según su quantity)
  const flattenedLabels = useMemo(() => {
    const list = [];
    queue.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        list.push(item.product);
      }
    });
    return list;
  }, [queue]);

  // Total de hojas A4 requeridas
  const totalPages = Math.max(1, Math.ceil(flattenedLabels.length / labelsPerPage));

  // Ajustar página actual si excede el nuevo total
  useEffect(() => {
    if (currentPage >= totalPages) {
      setCurrentPage(Math.max(0, totalPages - 1));
    }
  }, [totalPages, currentPage]);

  // Etiquetas para la página A4 actualmente visible en pantalla
  const currentLabelsForPage = useMemo(() => {
    const start = currentPage * labelsPerPage;
    return flattenedLabels.slice(start, start + labelsPerPage);
  }, [flattenedLabels, currentPage, labelsPerPage]);

  // Acciones en la cola
  const handleAddProduct = (prod) => {
    setQueue(prev => {
      const idx = prev.findIndex(item => item.product.id_producto === prod.id_producto);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx].quantity += 1;
        return copy;
      }
      return [...prev, { product: prod, quantity: 1 }];
    });
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleUpdateQuantity = (id_producto, delta) => {
    setQueue(prev => prev.map(item => {
      if (item.product.id_producto === id_producto) {
        const nextQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: nextQty };
      }
      return item;
    }));
  };

  const handleSetQuantity = (id_producto, value) => {
    const qty = Math.max(1, parseInt(value) || 1);
    setQueue(prev => prev.map(item => {
      if (item.product.id_producto === id_producto) {
        return { ...item, quantity: qty };
      }
      return item;
    }));
  };

  const handleSyncStock = (id_producto) => {
    setQueue(prev => prev.map(item => {
      if (item.product.id_producto === id_producto) {
        const stockQty = Math.max(1, Number(item.product.existencia) || 1);
        return { ...item, quantity: stockQty };
      }
      return item;
    }));
  };

  const handleRemove = (id_producto) => {
    setQueue(prev => prev.filter(item => item.product.id_producto !== id_producto));
  };

  const handleSetAllToOne = () => {
    setQueue(prev => prev.map(item => ({ ...item, quantity: 1 })));
  };

  const handleSyncAllStock = () => {
    setQueue(prev => prev.map(item => ({
      ...item,
      quantity: Math.max(1, Number(item.product.existencia) || 1)
    })));
  };

  const handleClearQueue = () => {
    setQueue([]);
    setCurrentPage(0);
  };

  /* ==========================================
     MOTOR DE IMPRESIÓN A4 LIMPIO
  ========================================== */
  const handlePrint = () => {
    if (flattenedLabels.length === 0) return;

    // Crear un iframe temporal invisible para imprimir sin alterar el DOM de la aplicación
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;

    // Agrupar etiquetas por páginas A4
    const pagesArray = [];
    for (let i = 0; i < flattenedLabels.length; i += labelsPerPage) {
      pagesArray.push(flattenedLabels.slice(i, i + labelsPerPage));
    }

    let pagesHtml = '';

    pagesArray.forEach((pageItems, pageIdx) => {
      let labelsHtml = '';

      pageItems.forEach((product) => {
        const barcodeCode = product.codigo_barras || product.codigo || '000000';
        const rawVal = product.precio_venta ?? product.venta ?? product.precio ?? product.__fmt?.venta ?? 0;
        const numVal = typeof rawVal === 'string' && rawVal.includes('C$')
          ? parseFloat(rawVal.replace(/[^0-9.]/g, ''))
          : parseFloat(rawVal);
        const formattedPrice = (!isNaN(numVal) && numVal > 0) ? `C$ ${numVal.toFixed(2)}` : '';
        const catName = product.categoria_nombre || '';

        // Generador de SVG Barcode para el print
        let codeHtml = '';
        if (codeType === 'barcode') {
          codeHtml = `<svg class="barcode-item" data-code="${barcodeCode}"></svg>`;
        } else if (codeType === 'qr') {
          codeHtml = `<div class="qr-item" data-code="${barcodeCode}"></div>`;
        } else {
          // Híbrido
          codeHtml = `
            <div style="display:flex;align-items:center;justify-content:space-around;width:100%;">
              <svg class="barcode-item" data-code="${barcodeCode}" style="max-width:70%;"></svg>
              <div class="qr-item" data-code="${barcodeCode}" style="width:24mm;height:24mm;"></div>
            </div>
          `;
        }

        const borderClass = paperType === 'bond' ? 'paper-bond' : 'paper-adhesive';

        labelsHtml += `
          <div class="label-card ${borderClass}">
            ${(showCompany || showLogo) ? `
              <div class="company-header">
                ${showLogo ? '<img src="/icons/logo.png" class="company-logo" alt="Logo" onerror="this.style.display=\'none\'" />' : ''}
                ${showCompany ? '<span class="company-title">Multirepuestos RG</span>' : ''}
              </div>
            ` : ''}
            <div class="product-name">${product.nombre || 'Repuesto'}</div>
            <div class="code-area">${codeHtml}</div>
            <div class="bottom-info">
              <span class="code-text">${barcodeCode}</span>
              ${showPrice && formattedPrice ? `<span class="price-tag">${formattedPrice}</span>` : ''}
              ${showCategory && catName ? `<span class="category-text">${catName}</span>` : ''}
            </div>
          </div>
        `;
      });

      pagesHtml += `
        <div class="a4-sheet layout-${layoutType}">
          ${labelsHtml}
        </div>
      `;
    });

    const printCss = `
      @page {
        size: A4 portrait;
        margin: 8mm;
      }
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      body {
        font-family: system-ui, -apple-system, sans-serif;
        background: #ffffff;
      }
      .a4-sheet {
        width: 194mm;
        height: 281mm;
        box-sizing: border-box;
        display: grid;
        gap: 2mm;
        page-break-after: always;
        break-after: page;
        align-content: start;
      }
      .a4-sheet.layout-24 {
        grid-template-columns: repeat(3, 1fr);
        grid-auto-rows: calc((281mm - (7 * 2mm)) / 8);
      }
      .a4-sheet.layout-40 {
        grid-template-columns: repeat(4, 1fr);
        grid-auto-rows: calc((281mm - (9 * 2mm)) / 10);
      }
      .a4-sheet.layout-12 {
        grid-template-columns: repeat(2, 1fr);
        grid-auto-rows: calc((281mm - (5 * 2mm)) / 6);
      }
      .label-card {
        padding: 2.5mm;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        text-align: center;
        overflow: hidden;
        position: relative;
        background: #ffffff;
      }
      .label-card.paper-bond {
        border: 1px dashed #94a3b8;
      }
      .label-card.paper-adhesive {
        border: 1px solid transparent;
      }
      .company-header {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        margin-bottom: 1mm;
        width: 100%;
      }
      .company-logo {
        height: 18px;
        max-height: 18px;
        width: auto;
        object-fit: contain;
      }
      .company-title {
        font-size: 8pt;
        font-weight: 800;
        text-transform: uppercase;
        color: #000;
        letter-spacing: 0.04em;
        line-height: 1;
        margin: 0;
      }
      .product-name {
        font-size: 8pt;
        font-weight: 700;
        color: #000;
        line-height: 1.15;
        max-height: 2.3em;
        overflow: hidden;
      }
      .code-area {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 1mm 0;
      }
      .bottom-info {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 1mm;
        border-top: 0.5px solid #ccc;
      }
      .code-text {
        font-size: 7pt;
        font-family: monospace;
        font-weight: 700;
        color: #000;
      }
      .price-tag {
        font-size: 8.5pt;
        font-weight: 800;
        color: #000;
      }
      .category-text {
        font-size: 6.5pt;
        color: #333;
        text-transform: uppercase;
      }
    `;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Etiquetas_A4_Multirepuestos_RG</title>
          <style>${printCss}</style>
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"></script>
        </head>
        <body>
          ${pagesHtml}
          <script>
            window.onload = function() {
              // Renderizar todos los códigos de barras en el iframe
              document.querySelectorAll('.barcode-item').forEach(function(el) {
                var code = el.getAttribute('data-code');
                try {
                  JsBarcode(el, code, {
                    format: 'CODE128',
                    width: 1.4,
                    height: 30,
                    displayValue: false,
                    margin: 0
                  });
                } catch(e) {}
              });

              // Renderizar QRs si aplica
              document.querySelectorAll('.qr-item').forEach(function(el) {
                var code = el.getAttribute('data-code');
                try {
                  new QRCode(el, {
                    text: code,
                    width: 48,
                    height: 48,
                    correctLevel: QRCode.CorrectLevel.M
                  });
                } catch(e) {}
              });

              setTimeout(function() {
                window.focus();
                window.print();
                setTimeout(function() {
                  window.frameElement.parentNode.removeChild(window.frameElement);
                }, 1000);
              }, 400);
            };
          </script>
        </body>
      </html>
    `);
    doc.close();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <ModalOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <ModalContainer
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          {/* HEADER */}
          <Header>
            <div className="title-group">
              <div className="icon-badge">
                <FaBarcode />
              </div>
              <div>
                <h2>Generador de Etiquetas y Tickets A4</h2>
                <p>Imprime códigos de barra y QR para góndolas, repuestos y cajas</p>
              </div>
            </div>
            <div className="actions-group">
              <CloseButton onClick={onClose} title="Cerrar">
                <FaTimes />
              </CloseButton>
            </div>
          </Header>

          {/* CONTENIDO PRINCIPAL EN 2 PANELES */}
          <ContentLayout>
            {/* PANEL IZQUIERDO: SELECCIÓN Y CARRITO */}
            <LeftPanel>
              {/* Buscador de repuestos */}
              <SearchBox>
                <div className="input-wrapper">
                  <FaSearch />
                  <input
                    type="text"
                    placeholder="Buscar repuesto por nombre o código para añadir..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {searchResults.length > 0 && (
                  <div className="autocomplete-results">
                    {searchResults.map(p => (
                      <div
                        key={p.id_producto}
                        className="result-item"
                        onClick={() => handleAddProduct(p)}
                      >
                        <div className="info">
                          <span className="name">{p.nombre}</span>
                          <span className="meta">
                            <span>Código: {p.codigo || p.codigo_barras || 'N/A'}</span>
                            <span>Stock: {p.existencia}</span>
                            <span>C$ {p.precio_venta}</span>
                          </span>
                        </div>
                        <button className="add-btn">
                          <FaPlus /> Añadir
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </SearchBox>

              {/* Encabezado del carrito de etiquetas */}
              <QueueHeader>
                <div className="stats">
                  <span>Bandeja de Impresión:</span>
                  <span className="badge">{queue.length} productos</span>
                  <span style={{ color: '#0284c7' }}>({flattenedLabels.length} etiquetas)</span>
                </div>
                <div className="quick-actions">
                  <button onClick={handleSetAllToOne} title="Poner 1 etiqueta a cada producto">
                    1 a todos
                  </button>
                  <button onClick={handleSyncAllStock} title="Poner cantidad igual al stock de bodega">
                    <FaBolt /> = Stock
                  </button>
                  <button className="danger" onClick={handleClearQueue} title="Vaciar la lista">
                    <FaTrash />
                  </button>
                </div>
              </QueueHeader>

              {/* Lista de productos en cola */}
              <QueueList>
                {queue.length === 0 ? (
                  <EmptyQueueMessage>
                    <FaBarcode />
                    <p>No has añadido repuestos a la bandeja.</p>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                      Usa el buscador arriba para agregar productos a imprimir.
                    </span>
                  </EmptyQueueMessage>
                ) : (
                  queue.map(item => (
                    <QueueItem key={item.product.id_producto}>
                      <div className="item-details">
                        <div className="item-name" title={item.product.nombre}>
                          {item.product.nombre}
                        </div>
                        <div className="item-sub">
                          <span className="code">{item.product.codigo_barras || item.product.codigo || 'S/C'}</span>
                          <span className="price">C$ {Number(item.product.precio_venta || 0).toFixed(2)}</span>
                          <span style={{ color: '#64748b' }}>Bodega: {item.product.existencia}</span>
                        </div>
                      </div>

                      {/* Contador de etiquetas para este producto */}
                      <div className="stepper">
                        <button onClick={() => handleUpdateQuantity(item.product.id_producto, -1)}>
                          <FaMinus />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleSetQuantity(item.product.id_producto, e.target.value)}
                        />
                        <button onClick={() => handleUpdateQuantity(item.product.id_producto, 1)}>
                          <FaPlus />
                        </button>
                      </div>

                      <button
                        className="stock-sync"
                        onClick={() => handleSyncStock(item.product.id_producto)}
                        title="Igualar cantidad al stock físico"
                      >
                        <FaBolt /> Stock
                      </button>

                      <button
                        className="remove-btn"
                        onClick={() => handleRemove(item.product.id_producto)}
                        title="Quitar"
                      >
                        <FaTimes />
                      </button>
                    </QueueItem>
                  ))
                )}
              </QueueList>
            </LeftPanel>

            {/* PANEL DERECHO: VISTA PREVIA Y CONTROLES */}
            <RightPanel>
              {/* Barra de opciones de papel y etiquetas */}
              <ControlBar>
                <div className="config-section">
                  {/* Tipo de Papel */}
                  <div className="control-group">
                    <label>Tipo de Papel</label>
                    <select value={paperType} onChange={(e) => setPaperType(e.target.value)}>
                      <option value="bond">📄 Papel Bond A4 (Líneas de Corte)</option>
                      <option value="adhesive">🏷️ Papel Adhesivo (Stickers A4)</option>
                    </select>
                  </div>

                  {/* Formato de Código */}
                  <div className="control-group">
                    <label>Tipo de Código</label>
                    <select value={codeType} onChange={(e) => setCodeType(e.target.value)}>
                      <option value="barcode">📊 Código de Barras (1D)</option>
                      <option value="qr">📱 Código QR (2D)</option>
                      <option value="hybrid">🔄 Híbrido (Barras + QR)</option>
                    </select>
                  </div>

                  {/* Plantilla de Cuadrícula */}
                  <div className="control-group">
                    <label>Distribución Hoja A4</label>
                    <select value={layoutType} onChange={(e) => setLayoutType(e.target.value)}>
                      <option value="24">24 por Hoja (3x8 - Estándar Góndola)</option>
                      <option value="40">40 por Hoja (4x10 - Repuesto Pequeño)</option>
                      <option value="12">12 por Hoja (2x6 - Grande / Baterías)</option>
                    </select>
                  </div>

                  {/* Toggles de contenido */}
                  <div className="toggles">
                    <div
                      className={`toggle-chip ${showLogo ? 'active' : ''}`}
                      onClick={() => setShowLogo(!showLogo)}
                      title="Mostrar logo pequeño"
                    >
                      {showLogo && <FaCheck size={10} />} Logo
                    </div>
                    <div
                      className={`toggle-chip ${showPrice ? 'active' : ''}`}
                      onClick={() => setShowPrice(!showPrice)}
                      title="Mostrar precio de venta"
                    >
                      {showPrice && <FaCheck size={10} />} Precio C$
                    </div>
                    <div
                      className={`toggle-chip ${showCompany ? 'active' : ''}`}
                      onClick={() => setShowCompany(!showCompany)}
                      title="Mostrar Multirepuestos RG"
                    >
                      {showCompany && <FaCheck size={10} />} Empresa
                    </div>
                    <div
                      className={`toggle-chip ${showCategory ? 'active' : ''}`}
                      onClick={() => setShowCategory(!showCategory)}
                      title="Mostrar Categoría"
                    >
                      {showCategory && <FaCheck size={10} />} Categoría
                    </div>
                  </div>
                </div>

                {/* Botón de Impresión */}
                <button
                  className="print-action-btn"
                  disabled={flattenedLabels.length === 0}
                  onClick={handlePrint}
                >
                  <FaPrint /> Imprimir {flattenedLabels.length} Etiquetas
                </button>
              </ControlBar>

              {/* Barra de paginación A4 */}
              <PaginationBar>
                <div className="page-nav">
                  <button
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                  >
                    <FaArrowLeft /> Anterior
                  </button>
                  <span>
                    Hoja A4 <strong>{currentPage + 1}</strong> de <strong>{totalPages}</strong>
                  </span>
                  <button
                    disabled={currentPage >= totalPages - 1}
                    onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                  >
                    Siguiente <FaArrowRight />
                  </button>
                </div>

                <div className="paper-indicator">
                  <FaFileAlt />
                  {paperType === 'bond' ? 'Papel Bond con Guías de Corte Punteadas' : 'Papel de Etiquetas Autoadhesivas (Sin bordes)'}
                </div>
              </PaginationBar>

              {/* Vista previa en escala real de la Hoja A4 */}
              <PreviewArea>
                <A4Sheet className={`layout-${layoutType}`}>
                  {currentLabelsForPage.map((prod, index) => {
                    const code = prod.codigo_barras || prod.codigo || '000000';
                    const rawVal = prod.precio_venta ?? prod.venta ?? prod.precio ?? prod.__fmt?.venta ?? 0;
                    const numVal = typeof rawVal === 'string' && rawVal.includes('C$')
                      ? parseFloat(rawVal.replace(/[^0-9.]/g, ''))
                      : parseFloat(rawVal);
                    const formattedPrice = (!isNaN(numVal) && numVal > 0) ? `C$ ${numVal.toFixed(2)}` : '';
                    const cat = prod.categoria_nombre || '';

                    return (
                      <LabelCard
                        key={`${prod.id_producto}-${index}`}
                        className={`paper-${paperType}`}
                      >
                        {(showCompany || showLogo) && (
                          <div className="company-header">
                            {showLogo && (
                              <img
                                src="/icons/logo.png"
                                alt="Logo"
                                className="company-logo"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            )}
                            {showCompany && <span className="company-title">Multirepuestos RG</span>}
                          </div>
                        )}

                        <div className="product-name" title={prod.nombre}>
                          {prod.nombre}
                        </div>

                        <div className={`code-area ${codeType === 'hybrid' ? 'hybrid' : ''}`}>
                          {codeType === 'barcode' && (
                            <BarcodeSvg
                              value={code}
                              width={layoutType === '40' ? 1.0 : 1.3}
                              height={layoutType === '40' ? 22 : 28}
                              displayValue={false}
                            />
                          )}

                          {codeType === 'qr' && (
                            <QRCodeSVG
                              value={code}
                              size={layoutType === '40' ? 38 : 46}
                              level="M"
                            />
                          )}

                          {codeType === 'hybrid' && (
                            <>
                              <div style={{ flex: 1, maxWidth: '72%' }}>
                                <BarcodeSvg
                                  value={code}
                                  width={1.0}
                                  height={22}
                                  displayValue={false}
                                />
                              </div>
                              <QRCodeSVG
                                value={code}
                                size={32}
                                level="M"
                              />
                            </>
                          )}
                        </div>

                        <div className="bottom-info">
                          <span className="code-text">{code}</span>
                          {showPrice && formattedPrice && (
                            <span className="price-tag">{formattedPrice}</span>
                          )}
                          {showCategory && cat && (
                            <span className="category-text">{cat}</span>
                          )}
                        </div>
                      </LabelCard>
                    );
                  })}
                </A4Sheet>
              </PreviewArea>
            </RightPanel>
          </ContentLayout>
        </ModalContainer>
      </ModalOverlay>
    </AnimatePresence>
  );
}

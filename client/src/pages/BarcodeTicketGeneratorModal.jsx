import React, { useState, useEffect, useRef, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import JsBarcode from 'jsbarcode';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';
import {
  FaBarcode, FaQrcode, FaPrint, FaTrash, FaTimes, FaPlus, FaMinus,
  FaSearch, FaCheck, FaFileAlt, FaTags,
  FaArrowLeft, FaArrowRight, FaBolt,
  FaSlidersH, FaUndo, FaUpload, FaCog,
  FaRulerCombined, FaFont, FaImage, FaEye
} from 'react-icons/fa';
import { useSettings } from '../context/SettingsContext';

/* ==========================================================================
   INSIGNIA VECTORIAL DE ALTA DEFINICIÓN (MULTIREPUESTOS RG)
   Diseñada en vectores 100% nítidos para impresión térmica ultra-definida (203/300 DPI)
   sin difuminado, compresión ni pérdida de contraste.
========================================================================== */
export const RgVectorEmblem = ({ height = 18, color = '#000000', className = '' }) => (
  <svg
    height={height}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', height: `${height}px`, width: 'auto' }}
  >
    {/* Engranaje y escudo automotriz estilizado */}
    <path
      d="M50 4 L57 12 L68 10 L72 20 L83 23 L83 34 L92 41 L88 51 L93 61 L85 68 L85 79 L74 82 L70 92 L59 90 L51 98 L49 98 L41 90 L30 92 L26 82 L15 79 L15 68 L7 61 L12 51 L8 41 L17 34 L17 23 L28 20 L32 10 L43 12 Z"
      fill={color}
    />
    <circle cx="50" cy="51" r="33" fill="#ffffff" />
    <circle cx="50" cy="51" r="28" fill={color} />
    <circle cx="50" cy="51" r="23" fill="#ffffff" />
    {/* Pistones / llaves mecánicas cruzadas */}
    <path
      d="M34 37 L42 45 L38 49 L30 41 Z M66 37 L70 41 L62 49 L58 45 Z M30 61 L38 53 L42 57 L34 65 Z M70 61 L66 65 L58 57 L62 53 Z"
      fill={color}
    />
    {/* Monograma RG en alto contraste */}
    <text
      x="50"
      y="58"
      textAnchor="middle"
      fontSize="22"
      fontFamily="Impact, Arial Black, sans-serif"
      fontWeight="900"
      fill={color}
      letterSpacing="-0.5"
    >
      RG
    </text>
  </svg>
);

const getRgVectorEmblemSvgMarkup = (height = 18, color = '#000000') => `
<svg height="${height}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;height:${height}px;width:auto;">
  <path d="M50 4 L57 12 L68 10 L72 20 L83 23 L83 34 L92 41 L88 51 L93 61 L85 68 L85 79 L74 82 L70 92 L59 90 L51 98 L49 98 L41 90 L30 92 L26 82 L15 79 L15 68 L7 61 L12 51 L8 41 L17 34 L17 23 L28 20 L32 10 L43 12 Z" fill="${color}" />
  <circle cx="50" cy="51" r="33" fill="#ffffff" />
  <circle cx="50" cy="51" r="28" fill="${color}" />
  <circle cx="50" cy="51" r="23" fill="#ffffff" />
  <path d="M34 37 L42 45 L38 49 L30 41 Z M66 37 L70 41 L62 49 L58 45 Z M30 61 L38 53 L42 57 L34 65 Z M70 61 L66 65 L58 57 L62 53 Z" fill="${color}" />
  <text x="50" y="58" text-anchor="middle" font-size="22" font-family="Impact, Arial Black, sans-serif" font-weight="900" fill="${color}" letter-spacing="-0.5">RG</text>
</svg>
`;

/* ==========================================================================
   SUBCOMPONENTE: GENERADOR DE CÓDIGO DE BARRAS SVG (PANTALLA)
========================================================================== */
const BarcodeSvg = ({
  value,
  width = 1.4,
  height = 34,
  displayValue = false,
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
          textMargin: 0
        });
      } catch (err) {
        try {
          const sanitized = String(value).replace(/[^a-zA-Z0-9_-]/g, '') || '000000';
          JsBarcode(svgRef.current, sanitized, {
            format: 'CODE128',
            width,
            height,
            displayValue: false,
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

/* Generador síncrono offline de SVG para la impresión (0 dependencias externas) */
const generateBarcodeSvgMarkup = (code, width = 1.4, height = 32) => {
  try {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    JsBarcode(svg, String(code || '000000'), {
      format: 'CODE128',
      width: width || 1.4,
      height: height || 32,
      displayValue: false,
      margin: 0,
      background: 'transparent',
      lineColor: '#000000'
    });
    svg.removeAttribute('width');
    svg.removeAttribute('height');
    svg.setAttribute('style', 'max-width: 96%; height: 100%; display: block; margin: 0 auto;');
    return svg.outerHTML;
  } catch (e) {
    return `<div style="font-family:monospace;font-size:8.5pt;font-weight:bold;letter-spacing:1px;">${code}</div>`;
  }
};

/* ==========================================================================
   CONFIGURACIONES PREESTABLECIDAS (PRESETS) Y VALORES POR DEFECTO
========================================================================== */
const STORAGE_KEY = 'rg_thermal_label_config_v4';

const PRESET_CONFIGS = {
  '2x1': {
    name: '2" x 1" (50.8 × 25.4 mm) - Estándar 3nStar / Universal',
    widthMm: 50.8,
    heightMm: 25.4,
    paddingMm: 1.0,
    barcodeHeightMm: 8.5,
    productNameFontSizePt: 7.2,
    productNameMaxLines: 2,
    priceFontSizePt: 9.0,
    codeFontSizePt: 6.5,
    storeNameFontSizePt: 6.5,
    logoHeightPx: 14
  },
  '50x30': {
    name: '50 × 30 mm (2" x 1.2")',
    widthMm: 50.0,
    heightMm: 30.0,
    paddingMm: 1.5,
    barcodeHeightMm: 11.0,
    productNameFontSizePt: 8.0,
    productNameMaxLines: 2,
    priceFontSizePt: 10.0,
    codeFontSizePt: 7.0,
    storeNameFontSizePt: 7.2,
    logoHeightPx: 18
  },
  '40x30': {
    name: '40 × 30 mm',
    widthMm: 40.0,
    heightMm: 30.0,
    paddingMm: 1.2,
    barcodeHeightMm: 10.0,
    productNameFontSizePt: 7.2,
    productNameMaxLines: 2,
    priceFontSizePt: 8.5,
    codeFontSizePt: 6.5,
    storeNameFontSizePt: 6.5,
    logoHeightPx: 16
  },
  '40x25': {
    name: '40 × 25 mm',
    widthMm: 40.0,
    heightMm: 25.0,
    paddingMm: 1.0,
    barcodeHeightMm: 8.5,
    productNameFontSizePt: 6.8,
    productNameMaxLines: 2,
    priceFontSizePt: 8.0,
    codeFontSizePt: 6.2,
    storeNameFontSizePt: 6.2,
    logoHeightPx: 14
  },
  '30x20': {
    name: '30 × 20 mm (Mini / Tornillería)',
    widthMm: 30.0,
    heightMm: 20.0,
    paddingMm: 0.8,
    barcodeHeightMm: 6.5,
    productNameFontSizePt: 6.0,
    productNameMaxLines: 1,
    priceFontSizePt: 7.2,
    codeFontSizePt: 5.5,
    storeNameFontSizePt: 5.5,
    logoHeightPx: 12
  },
  '60x40': {
    name: '60 × 40 mm (Grande / Embalaje)',
    widthMm: 60.0,
    heightMm: 40.0,
    paddingMm: 2.0,
    barcodeHeightMm: 14.0,
    productNameFontSizePt: 9.5,
    productNameMaxLines: 2,
    priceFontSizePt: 12.0,
    codeFontSizePt: 8.0,
    storeNameFontSizePt: 8.5,
    logoHeightPx: 22
  },
  'custom': {
    name: '🛠️ Medida Personalizada (mm)'
  }
};

const DEFAULT_LABEL_CONFIG = {
  preset: '2x1',
  widthMm: 50.8,
  heightMm: 25.4,
  paddingMm: 1.0,
  showLogo: true,
  showStoreName: true,
  showProductName: true,
  showBarcode: true,
  showCodeText: true,
  showPrice: true,
  showCategory: false,
  showDivider: true,
  logoSource: 'store', // 'store' por defecto con el logo oficial del negocio
  customLogoData: '',
  logoHeightPx: 14,
  storeName: 'MULTIREPUESTOS RG',
  storeNameFontSizePt: 6.5,
  productNameFontSizePt: 7.2,
  productNameMaxLines: 2,
  codeFontSizePt: 6.5,
  priceFontSizePt: 9.0,
  categoryFontSizePt: 5.5,
  codeType: 'barcode', // 'barcode' | 'qr'
  barcodeHeightMm: 8.5,
  barcodeLineWidth: 1.4
};

/* ==========================================================================
   STYLED COMPONENTS: MODAL & LAYOUT
========================================================================== */
const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.8);
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
  max-width: 1480px;
  height: 95vh;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
  overflow: hidden;
  border: 1px solid #cbd5e1;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1.5rem;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #ffffff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  .title-group {
    display: flex;
    align-items: center;
    gap: 12px;

    .icon-badge {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.35rem;
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(2, 132, 199, 0.35);
    }

    h2 {
      font-size: 1.15rem;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.01em;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    p {
      margin: 2px 0 0 0;
      font-size: 0.78rem;
      color: #94a3b8;
    }
  }

  .actions-group {
    display: flex;
    align-items: center;
    gap: 10px;
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
  grid-template-columns: 430px 1fr;
  flex: 1;
  overflow: hidden;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
`;

/* ==========================================================================
   PANEL IZQUIERDO: SELECCIÓN Y CARRITO
========================================================================== */
const LeftPanel = styled.div`
  background: #f8fafc;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const SearchBox = styled.div`
  padding: 0.85rem 1rem;
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
      font-size: 0.86rem;
      outline: none;
      transition: all 0.2s;
      background: #f8fafc;

      &:focus {
        border-color: #0284c7;
        background: #ffffff;
        box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
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
        background: #f0f9ff;
      }

      &:last-child {
        border-bottom: none;
      }

      .info {
        display: flex;
        flex-direction: column;
        gap: 2px;
        max-width: 290px;

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
        background: #e0f2fe;
        color: #0369a1;
        border: none;
        border-radius: 6px;
        padding: 4px 8px;
        font-size: 0.75rem;
        font-weight: 700;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 4px;
        transition: all 0.15s;

        &:hover {
          background: #0284c7;
          color: #ffffff;
        }
      }
    }
  }
`;

const QueueHeader = styled.div`
  padding: 0.65rem 1rem;
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
      background: #0284c7;
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
        font-weight: 700;
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

/* ==========================================================================
   PANEL DERECHO: VISTA PREVIA Y CONTROLES
========================================================================== */
const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  background: #f1f5f9;
  overflow: hidden;
`;

const ControlBar = styled.div`
  padding: 0.75rem 1.25rem;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  .top-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .format-selector {
    display: flex;
    background: #f1f5f9;
    padding: 3px;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    gap: 4px;

    button {
      border: none;
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 0.82rem;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;

      &.active {
        background: #ffffff;
        color: #0284c7;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
      }

      &:not(.active) {
        background: transparent;
        color: #64748b;

        &:hover {
          color: #1e293b;
        }
      }
    }
  }

  .action-buttons {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .btn-print-primary {
    background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
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
    box-shadow: 0 4px 12px rgba(2, 132, 199, 0.35);
    transition: all 0.2s;

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(2, 132, 199, 0.45);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .btn-test-print {
    background: #ffffff;
    color: #334155;
    border: 1px solid #cbd5e1;
    border-radius: 10px;
    padding: 9px 14px;
    font-size: 0.82rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover:not(:disabled) {
      background: #f8fafc;
      border-color: #94a3b8;
      color: #0f172a;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .btn-toggle-settings {
    background: #f8fafc;
    color: #0369a1;
    border: 1px solid #bae6fd;
    border-radius: 10px;
    padding: 9px 14px;
    font-size: 0.82rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    transition: all 0.2s;

    &.active {
      background: #0284c7;
      color: #ffffff;
      border-color: #0284c7;
    }

    &:hover:not(.active) {
      background: #e0f2fe;
    }
  }

  .btn-a4-print {
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

/* ==========================================================================
   PANEL EXPANDIBLE DE AJUSTES Y MEDIDAS PERSONALIZADAS
========================================================================== */
const CustomizationPanel = styled(motion.div)`
  background: #ffffff;
  border-bottom: 2px solid #e2e8f0;
  padding: 1rem 1.25rem;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.03);

  .settings-tabs {
    display: flex;
    gap: 6px;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 8px;
    margin-bottom: 12px;
    overflow-x: auto;

    button {
      background: transparent;
      border: none;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 0.78rem;
      font-weight: 700;
      color: #64748b;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
      transition: all 0.15s;

      &.active {
        background: #e0f2fe;
        color: #0369a1;
      }

      &:hover:not(.active) {
        background: #f1f5f9;
        color: #1e293b;
      }
    }
  }

  .tab-content {
    display: flex;
    flex-wrap: wrap;
    gap: 1.25rem;
    align-items: flex-start;
  }

  .setting-block {
    display: flex;
    flex-direction: column;
    gap: 5px;
    min-width: 140px;

    label {
      font-size: 0.72rem;
      font-weight: 700;
      color: #475569;
      display: flex;
      justify-content: space-between;
      align-items: center;

      span.val {
        color: #0284c7;
        font-weight: 800;
      }
    }

    select, input[type="text"], input[type="number"] {
      padding: 6px 10px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: 600;
      color: #1e293b;
      background: #f8fafc;
      outline: none;

      &:focus {
        border-color: #0284c7;
        background: #ffffff;
      }
    }

    input[type="range"] {
      accent-color: #0284c7;
      cursor: pointer;
    }
  }

  .toggles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(135px, 1fr));
    gap: 8px;
    width: 100%;

    .toggle-card {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 7px 10px;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.78rem;
      font-weight: 600;
      color: #334155;
      user-select: none;
      transition: all 0.15s;

      &.active {
        background: #eff6ff;
        border-color: #0284c7;
        color: #0369a1;
      }
    }
  }

  .panel-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;
    padding-top: 8px;
    border-top: 1px dashed #e2e8f0;

    .reset-btn {
      background: transparent;
      border: 1px solid #cbd5e1;
      color: #64748b;
      border-radius: 6px;
      padding: 4px 10px;
      font-size: 0.74rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
      transition: all 0.15s;

      &:hover {
        background: #f1f5f9;
        color: #0f172a;
      }
    }

    .notice {
      font-size: 0.72rem;
      color: #64748b;
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

  .nav-group {
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

      &:hover:not(:disabled) {
        background: #f1f5f9;
      }
    }
  }

  .view-toggles {
    display: flex;
    gap: 6px;

    button {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 3px 8px;
      font-size: 0.74rem;
      font-weight: 600;
      color: #475569;
      cursor: pointer;

      &.active {
        background: #e0f2fe;
        color: #0284c7;
        border-color: #38bdf8;
      }
    }
  }

  .paper-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 700;
    color: #0369a1;
    background: #e0f2fe;
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 0.75rem;
  }
`;

const PreviewArea = styled.div`
  flex: 1;
  overflow: auto;
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #475569;
  position: relative;
`;

/* ==========================================================================
   VISTA PREVIA INTERACTIVA DE ETIQUETA TÉRMICA (ESCALADA PROPORCIONALMENTE)
========================================================================== */
const ThermalCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
`;

const ThermalSticker = styled.div`
  background: #ffffff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.45);
  border: 1px solid #cbd5e1;
  position: relative;
  box-sizing: border-box;
  user-select: none;
  transition: width 0.2s, height 0.2s, padding 0.2s;

  .dim-pill {
    position: absolute;
    top: -12px;
    left: 12px;
    background: #0f172a;
    color: #38bdf8;
    font-size: 0.65rem;
    font-weight: 800;
    padding: 2px 8px;
    border-radius: 10px;
    letter-spacing: 0.04em;
    display: flex;
    align-items: center;
    gap: 4px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.25);
  }

  .company-header-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 100%;

    .company-logo {
      object-fit: contain;
      filter: contrast(160%) grayscale(100%);
    }

    .company-title {
      font-weight: 800;
      text-transform: uppercase;
      color: #000000;
      letter-spacing: 0.04em;
      line-height: 1;
      margin: 0;
    }
  }

  .product-name {
    font-weight: 800;
    color: #000000;
    line-height: 1.15;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    width: 100%;
    margin-top: 1px;
    word-break: break-word;
  }

  .code-area {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1px 0;
  }

  .bottom-info {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 1;

    .code-text {
      font-family: monospace;
      font-weight: 800;
      color: #000000;
    }

    .price-tag {
      font-weight: 900;
      color: #000000;
      letter-spacing: -0.01em;
    }

    .category-text {
      color: #334155;
      text-transform: uppercase;
      font-weight: 700;
    }
  }
`;

const ReelRollStrip = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #334155;
  padding: 18px 24px;
  border-radius: 16px;
  gap: 14px;
  max-height: 68vh;
  overflow-y: auto;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);

  .reel-sticker-wrap {
    position: relative;

    &::after {
      content: "- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -";
      position: absolute;
      bottom: -10px;
      left: 0;
      right: 0;
      text-align: center;
      color: #94a3b8;
      font-size: 0.65rem;
      letter-spacing: 2px;
      overflow: hidden;
    }

    &:last-child::after {
      display: none;
    }
  }
`;

/* ==========================================================================
   ESTILOS DE HOJA A4 (210mm x 297mm)
========================================================================== */
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

  &.layout-24 {
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: calc((281mm - (7 * 2mm)) / 8);
  }

  &.layout-40 {
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: calc((281mm - (9 * 2mm)) / 10);
  }

  &.layout-12 {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: calc((281mm - (5 * 2mm)) / 6);
  }
`;

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

  &.paper-bond {
    border: 1px dashed #94a3b8;
    border-radius: 0;
  }

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

/* ==========================================================================
   COMPONENTE PRINCIPAL
========================================================================== */
export default function BarcodeTicketGeneratorModal({
  isOpen,
  onClose,
  products = [],
  categories = [],
  initialProduct = null
}) {
  const { settings } = useSettings();

  // Estado de la cola de impresión: [{ product, quantity }]
  const [queue, setQueue] = useState([]);

  // Búsqueda para agregar productos
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Formato principal: 'thermal_roll' (3nStar / Térmica USB) o 'a4_sheet' (hojas A4)
  const [paperFormat, setPaperFormat] = useState('thermal_roll');

  // Modo de visualización en rollo: 'single' (individual) o 'reel' (tira continua)
  const [labelViewMode, setLabelViewMode] = useState('single');
  const [previewIndex, setPreviewIndex] = useState(0);

  // Opciones de configuración A4
  const [paperType, setPaperType] = useState('bond'); // 'bond' | 'adhesive'
  const [layoutType, setLayoutType] = useState('24'); // '24' (3x8) | '40' (4x10) | '12' (2x6)
  const [currentPage, setCurrentPage] = useState(0);

  // Panel de personalización
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [settingsActiveTab, setSettingsActiveTab] = useState('measures'); // 'measures' | 'brand' | 'fonts' | 'barcode' | 'visibility'

  // Configuración completa de la etiqueta
  const [labelConfig, setLabelConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_LABEL_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Error leyendo configuración guardada de etiquetas:', e);
    }
    return {
      ...DEFAULT_LABEL_CONFIG,
      storeName: settings?.empresa_nombre || 'MULTIREPUESTOS RG'
    };
  });

  // Guardar configuración en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(labelConfig));
    } catch (e) {
      console.warn('Error guardando configuración de etiquetas:', e);
    }
  }, [labelConfig]);

  // Actualizar storeName si no está personalizado
  useEffect(() => {
    if (settings?.empresa_nombre && labelConfig.storeName === 'MULTIREPUESTOS RG') {
      setLabelConfig(prev => ({ ...prev, storeName: settings.empresa_nombre }));
    }
  }, [settings?.empresa_nombre]);

  // Modificar campo de configuración
  const updateConfig = (patch) => {
    setLabelConfig(prev => ({ ...prev, ...patch }));
  };

  // Cambiar preset de tamaño
  const handlePresetChange = (presetKey) => {
    if (presetKey === 'custom') {
      updateConfig({ preset: 'custom' });
      return;
    }
    const presetData = PRESET_CONFIGS[presetKey];
    if (!presetData) return;
    updateConfig({
      preset: presetKey,
      widthMm: presetData.widthMm,
      heightMm: presetData.heightMm,
      paddingMm: presetData.paddingMm,
      barcodeHeightMm: presetData.barcodeHeightMm,
      productNameFontSizePt: presetData.productNameFontSizePt,
      productNameMaxLines: presetData.productNameMaxLines,
      priceFontSizePt: presetData.priceFontSizePt,
      codeFontSizePt: presetData.codeFontSizePt,
      storeNameFontSizePt: presetData.storeNameFontSizePt,
      logoHeightPx: presetData.logoHeightPx
    });
    toast.success(`Plantilla cambiada a ${presetData.name}`, { duration: 2500 });
  };

  // Restablecer valores a 2x1 original
  const handleResetDefaults = () => {
    const base = {
      ...DEFAULT_LABEL_CONFIG,
      storeName: settings?.empresa_nombre || 'MULTIREPUESTOS RG'
    };
    setLabelConfig(base);
    localStorage.removeItem(STORAGE_KEY);
    toast.success('Configuración restablecida a 2x1" estándar.');
  };

  // Cargar imagen personalizada para el logo
  const handleCustomLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('La imagen no debe superar los 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      updateConfig({
        logoSource: 'custom',
        customLogoData: event.target.result
      });
      toast.success('Logo personalizado cargado para las etiquetas.');
    };
    reader.readAsDataURL(file);
  };

  // Resolver URL del logo oficial del sistema
  const officialLogoUrl = useMemo(() => {
    if (!settings?.empresa_logo_url) return '/icons/logo.png';
    if (settings.empresa_logo_url.startsWith('http') || settings.empresa_logo_url.startsWith('data:')) {
      return settings.empresa_logo_url;
    }
    const apiEndpoint = import.meta.env.VITE_API_URL || 'https://sistema.multirepuestosrg.com';
    const base = apiEndpoint.replace(/\/api\/?$/, '');
    return `${base}${settings.empresa_logo_url.startsWith('/') ? '' : '/'}${settings.empresa_logo_url}`;
  }, [settings?.empresa_logo_url]);

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

  // Capacidad de etiquetas por hoja según plantilla A4
  const labelsPerPage = useMemo(() => {
    if (layoutType === '40') return 40;
    if (layoutType === '12') return 12;
    return 24;
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

  // Ajustar página actual A4 si excede el nuevo total
  useEffect(() => {
    if (currentPage >= totalPages) {
      setCurrentPage(Math.max(0, totalPages - 1));
    }
  }, [totalPages, currentPage]);

  // Ajustar índice de etiqueta térmica si excede el nuevo total
  useEffect(() => {
    if (previewIndex >= flattenedLabels.length) {
      setPreviewIndex(Math.max(0, flattenedLabels.length - 1));
    }
  }, [flattenedLabels.length, previewIndex]);

  // Etiquetas para la página A4 actualmente visible en pantalla
  const currentLabelsForPage = useMemo(() => {
    const start = currentPage * labelsPerPage;
    return flattenedLabels.slice(start, start + labelsPerPage);
  }, [flattenedLabels, currentPage, labelsPerPage]);

  // Producto actual para la vista individual
  const currentStickerProduct = flattenedLabels[previewIndex] || null;

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
    setPreviewIndex(0);
  };

  /* ==========================================================================
     MOTOR UNIVERSAL DE IMPRESIÓN TÉRMICA USB (3nStar / Zebra / Xprinter)
  ========================================================================== */
  const handlePrintThermal = (testOnly = false) => {
    const itemsToPrint = testOnly ? (flattenedLabels.slice(0, 1)) : flattenedLabels;
    if (itemsToPrint.length === 0) {
      toast.error('No hay etiquetas en la bandeja para imprimir.');
      return;
    }

    const {
      widthMm,
      heightMm,
      paddingMm,
      showLogo,
      showStoreName,
      showProductName,
      showBarcode,
      showCodeText,
      showPrice,
      showCategory,
      showDivider,
      logoSource,
      customLogoData,
      logoHeightPx,
      storeName,
      storeNameFontSizePt,
      productNameFontSizePt,
      productNameMaxLines,
      codeFontSizePt,
      priceFontSizePt,
      categoryFontSizePt,
      codeType,
      barcodeHeightMm,
      barcodeLineWidth
    } = labelConfig;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;

    // Generar bloque de logo para inyectar en HTML
    let logoMarkup = '';
    if (showLogo) {
      if (logoSource === 'vector') {
        logoMarkup = getRgVectorEmblemSvgMarkup(logoHeightPx, '#000000');
      } else if (logoSource === 'custom' && customLogoData) {
        logoMarkup = `<img src="${customLogoData}" class="company-logo" style="height:${logoHeightPx}px;max-height:${logoHeightPx}px;" alt="Logo" />`;
      } else {
        logoMarkup = `<img src="${officialLogoUrl}" class="company-logo" style="height:${logoHeightPx}px;max-height:${logoHeightPx}px;" alt="Logo" onerror="this.style.display='none'" />`;
      }
    }

    let labelsHtml = '';

    itemsToPrint.forEach((product) => {
      const barcodeCode = product.codigo_barras || product.codigo || '000000';
      const rawVal = product.precio_venta ?? product.venta ?? product.precio ?? product.__fmt?.venta ?? 0;
      const numVal = typeof rawVal === 'string' && rawVal.includes('C$')
        ? parseFloat(rawVal.replace(/[^0-9.]/g, ''))
        : parseFloat(rawVal);
      const formattedPrice = (!isNaN(numVal) && numVal >= 0) ? `C$ ${numVal.toFixed(2)}` : '';
      const catName = product.categoria_nombre || '';

      // Generar código de barras o QR
      let codeMarkup = '';
      if (showBarcode) {
        if (codeType === 'barcode') {
          codeMarkup = generateBarcodeSvgMarkup(barcodeCode, barcodeLineWidth, Math.round(barcodeHeightMm * 3.5));
        } else {
          codeMarkup = `<div class="qr-item" data-code="${barcodeCode}"></div>`;
        }
      }

      labelsHtml += `
        <div class="label-page">
          ${(showLogo || showStoreName) ? `
            <div class="company-header">
              ${showLogo ? logoMarkup : ''}
              ${showStoreName ? `<span class="company-title">${storeName}</span>` : ''}
            </div>
          ` : ''}
          ${showProductName ? `<div class="product-name">${product.nombre || 'Repuesto'}</div>` : ''}
          ${showBarcode ? `<div class="code-area">${codeMarkup}</div>` : ''}
          ${(showCodeText || showPrice || showCategory) ? `
            <div class="bottom-info">
              ${showCodeText ? `<span class="code-text">${barcodeCode}</span>` : '<span></span>'}
              ${showPrice && formattedPrice ? `<span class="price-tag">${formattedPrice}</span>` : ''}
              ${showCategory && catName ? `<span class="category-text">${catName}</span>` : ''}
            </div>
          ` : ''}
        </div>
      `;
    });

    const printCss = `
      @page {
        size: ${widthMm}mm ${heightMm}mm;
        margin: 0;
      }
      @media print {
        @page {
          size: ${widthMm}mm ${heightMm}mm;
          margin: 0;
        }
        html, body {
          width: ${widthMm}mm !important;
          margin: 0 !important;
          padding: 0 !important;
          background: #ffffff !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .label-page {
          width: ${widthMm}mm !important;
          height: ${heightMm}mm !important;
          max-width: ${widthMm}mm !important;
          max-height: ${heightMm}mm !important;
          page-break-after: always !important;
          break-after: page !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        .label-page:last-child {
          page-break-after: auto !important;
          break-after: auto !important;
        }
      }
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        background: #ffffff;
        color: #000000;
        width: ${widthMm}mm;
        margin: 0;
        padding: 0;
        -webkit-font-smoothing: antialiased;
      }
      .label-page {
        width: ${widthMm}mm;
        height: ${heightMm}mm;
        max-width: ${widthMm}mm;
        max-height: ${heightMm}mm;
        padding: ${paddingMm}mm 1.5mm;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        text-align: center;
        overflow: hidden;
        page-break-after: always;
        break-after: page;
        margin: 0 auto;
        background: #ffffff;
      }
      .label-page:last-child {
        page-break-after: auto;
        break-after: auto;
      }
      .company-header {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        line-height: 1;
        white-space: nowrap !important;
        overflow: hidden;
        flex-shrink: 0 !important;
        margin: 0 0 0.2mm 0;
      }
      .company-logo {
        height: ${logoHeightPx}px;
        max-height: ${logoHeightPx}px;
        width: auto;
        max-width: 28px;
        object-fit: contain;
        flex-shrink: 0 !important;
        filter: contrast(160%) grayscale(100%);
      }
      .company-title {
        font-size: ${storeNameFontSizePt}pt;
        font-weight: 800;
        text-transform: uppercase;
        color: #000000;
        letter-spacing: 0.03em;
        white-space: nowrap !important;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1;
      }
      .product-name {
        width: 100%;
        font-size: ${productNameFontSizePt}pt;
        font-weight: 800;
        color: #000000;
        line-height: 1.15;
        text-align: center;
        word-break: break-word;
        overflow: hidden;
        flex-shrink: 0 !important;
        margin: 0.2mm 0;
        max-height: ${productNameMaxLines === 1 ? '1.3em' : '2.4em'};
        ${productNameMaxLines === 1
          ? 'white-space: nowrap; text-overflow: ellipsis;'
          : 'display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;'}
      }
      .code-area {
        width: 100%;
        height: ${barcodeHeightMm}mm;
        max-height: ${barcodeHeightMm}mm;
        flex: 1 1 auto;
        min-height: 5mm;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0.1mm 0;
        overflow: hidden;
      }
      .code-area svg {
        max-width: 96%;
        max-height: 100% !important;
        height: 100% !important;
        width: auto !important;
        display: block;
        margin: 0 auto;
      }
      .bottom-info {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        line-height: 1;
        flex-shrink: 0 !important;
        ${showDivider ? 'border-top: 0.8px solid #000000; padding-top: 0.4mm;' : ''}
      }
      .code-text {
        font-size: ${codeFontSizePt}pt;
        font-family: monospace;
        font-weight: 800;
        color: #000000;
      }
      .price-tag {
        font-size: ${priceFontSizePt}pt;
        font-weight: 900;
        color: #000000;
        letter-spacing: -0.01em;
      }
      .category-text {
        font-size: ${categoryFontSizePt}pt;
        color: #334155;
        text-transform: uppercase;
        font-weight: 700;
      }
    `;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Etiquetas_Termicas_3nStar_${storeName.replace(/\s+/g, '_')}</title>
          <style>${printCss}</style>
        </head>
        <body>
          ${labelsHtml}
        </body>
      </html>
    `);
    doc.close();

    // Si es código QR, cargar qrcodejs y renderizarlo
    if (codeType === 'qr') {
      const qrScript = doc.createElement('script');
      qrScript.src = 'https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js';
      qrScript.onload = () => {
        doc.querySelectorAll('.qr-item').forEach((el) => {
          const code = el.getAttribute('data-code');
          try {
            new iframe.contentWindow.QRCode(el, {
              text: code,
              width: Math.round(Number(barcodeHeightMm) * 3.78) || 40,
              height: Math.round(Number(barcodeHeightMm) * 3.78) || 40,
              correctLevel: 1
            });
          } catch (e) {}
        });
      };
      doc.head.appendChild(qrScript);
    }

    // Esperar que las imágenes carguen antes de lanzar el diálogo de impresión
    const images = doc.querySelectorAll('img');
    let loadedCount = 0;
    const totalImages = images.length;

    const triggerPrint = () => {
      setTimeout(() => {
        try {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        } catch (e) {
          console.error('Error al invocar impresión:', e);
        }
        setTimeout(() => {
          if (iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
          }
        }, 3000);
      }, 150);
    };

    if (totalImages === 0) {
      triggerPrint();
    } else {
      let fired = false;
      const onImgDone = () => {
        loadedCount++;
        if (loadedCount >= totalImages && !fired) {
          fired = true;
          triggerPrint();
        }
      };
      images.forEach(img => {
        if (img.complete) {
          onImgDone();
        } else {
          img.onload = onImgDone;
          img.onerror = onImgDone;
        }
      });
      setTimeout(() => {
        if (!fired) {
          fired = true;
          triggerPrint();
        }
      }, 500);
    }

    toast.success(
      testOnly
        ? 'Imprimiendo 1 etiqueta de prueba en tu 3nStar / USB...'
        : `Enviando ${itemsToPrint.length} etiquetas a la impresora 3nStar / USB`,
      { duration: 4000, icon: '🖨️' }
    );
  };

  /* ==========================================================================
     MOTOR DE IMPRESIÓN A4
  ========================================================================== */
  const handlePrintA4 = () => {
    if (flattenedLabels.length === 0) return;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;

    const pagesArray = [];
    for (let i = 0; i < flattenedLabels.length; i += labelsPerPage) {
      pagesArray.push(flattenedLabels.slice(i, i + labelsPerPage));
    }

    let pagesHtml = '';

    pagesArray.forEach((pageItems) => {
      let labelsHtml = '';

      pageItems.forEach((product) => {
        const barcodeCode = product.codigo_barras || product.codigo || '000000';
        const rawVal = product.precio_venta ?? product.venta ?? product.precio ?? product.__fmt?.venta ?? 0;
        const numVal = typeof rawVal === 'string' && rawVal.includes('C$')
          ? parseFloat(rawVal.replace(/[^0-9.]/g, ''))
          : parseFloat(rawVal);
        const formattedPrice = (!isNaN(numVal) && numVal > 0) ? `C$ ${numVal.toFixed(2)}` : '';
        const catName = product.categoria_nombre || '';

        const codeSvg = generateBarcodeSvgMarkup(barcodeCode, 1.4, 28);
        const borderClass = paperType === 'bond' ? 'paper-bond' : 'paper-adhesive';

        labelsHtml += `
          <div class="label-card ${borderClass}">
            ${labelConfig.showLogo || labelConfig.showStoreName ? `
              <div class="company-header">
                ${labelConfig.showLogo ? getRgVectorEmblemSvgMarkup(18, '#000000') : ''}
                ${labelConfig.showStoreName ? `<span class="company-title">${labelConfig.storeName}</span>` : ''}
              </div>
            ` : ''}
            <div class="product-name">${product.nombre || 'Repuesto'}</div>
            <div class="code-area">${codeSvg}</div>
            <div class="bottom-info">
              <span class="code-text">${barcodeCode}</span>
              ${labelConfig.showPrice && formattedPrice ? `<span class="price-tag">${formattedPrice}</span>` : ''}
              ${labelConfig.showCategory && catName ? `<span class="category-text">${catName}</span>` : ''}
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
          <title>Etiquetas_A4_${labelConfig.storeName.replace(/\s+/g, '_')}</title>
          <style>${printCss}</style>
        </head>
        <body>
          ${pagesHtml}
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.focus();
                window.print();
                setTimeout(function() {
                  if (window.frameElement && window.frameElement.parentNode) {
                    window.frameElement.parentNode.removeChild(window.frameElement);
                  }
                }, 1000);
              }, 250);
            };
          </script>
        </body>
      </html>
    `);
    doc.close();
  };

  if (!isOpen) return null;

  // Cálculo de dimensiones en píxeles para la vista previa proporcional
  const previewStickerWidthPx = Math.min(430, Math.max(270, labelConfig.widthMm * 7.2));
  const previewStickerHeightPx = Math.round((previewStickerWidthPx / labelConfig.widthMm) * labelConfig.heightMm);

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
                <h2>
                  Generador de Etiquetas Térmicas (3nStar / USB Universal)
                </h2>
                <p>Impresión de alta resolución en Rollo Térmico 2x1'' (50×25mm) y Hojas A4</p>
              </div>
            </div>

            <div className="actions-group">
              <CloseButton onClick={onClose} title="Cerrar ventana">
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

              {/* Encabezado del carrito */}
              <QueueHeader>
                <div className="stats">
                  <span>Bandeja:</span>
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

                      {/* Contador de etiquetas */}
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
                        title="Quitar de la bandeja"
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
              {/* Barra de opciones y selector de formato */}
              <ControlBar>
                <div className="top-row">
                  {/* Selector de Modo: Rollo Térmico vs A4 */}
                  <div className="format-selector">
                    <button
                      className={paperFormat === 'thermal_roll' ? 'active' : ''}
                      onClick={() => setPaperFormat('thermal_roll')}
                    >
                      <FaTags /> 🏷️ Rollo Térmico (3nStar / USB)
                    </button>
                    <button
                      className={paperFormat === 'a4_sheet' ? 'active' : ''}
                      onClick={() => setPaperFormat('a4_sheet')}
                    >
                      <FaFileAlt /> 📄 Hoja Completa A4
                    </button>
                  </div>

                  {/* Botones de acción */}
                  <div className="action-buttons">
                    {paperFormat === 'thermal_roll' ? (
                      <>
                        <button
                          className={`btn-toggle-settings ${showSettingsDrawer ? 'active' : ''}`}
                          onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
                          title="Personalizar medidas, tamaños, logo y diseño"
                        >
                          <FaSlidersH /> {showSettingsDrawer ? 'Ocultar Ajustes' : '⚙️ Personalizar Diseño & Medidas'}
                        </button>

                        <button
                          className="btn-test-print"
                          disabled={flattenedLabels.length === 0}
                          onClick={() => handlePrintThermal(true)}
                          title="Imprime solo 1 etiqueta para calibrar alineación en la 3nStar"
                        >
                          📄 Probar 1 Etiqueta
                        </button>

                        <button
                          className="btn-print-primary"
                          disabled={flattenedLabels.length === 0}
                          onClick={() => handlePrintThermal(false)}
                          title="Imprime todas las etiquetas en la impresora 3nStar o térmica USB de Windows"
                        >
                          <FaPrint /> Imprimir {flattenedLabels.length} Etiquetas
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="setting-block" style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <label style={{ margin: 0 }}>Distribución:</label>
                          <select value={layoutType} onChange={(e) => setLayoutType(e.target.value)}>
                            <option value="24">24 por Hoja (3x8)</option>
                            <option value="40">40 por Hoja (4x10)</option>
                            <option value="12">12 por Hoja (2x6)</option>
                          </select>
                        </div>
                        <button
                          className="btn-a4-print"
                          disabled={flattenedLabels.length === 0}
                          onClick={handlePrintA4}
                        >
                          <FaPrint /> Imprimir {flattenedLabels.length} Etiquetas A4
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </ControlBar>

              {/* PANEL DESPLEGABLE DE PERSONALIZACIÓN Y MEDIDAS */}
              <AnimatePresence>
                {showSettingsDrawer && paperFormat === 'thermal_roll' && (
                  <CustomizationPanel
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Pestañas de Ajustes */}
                    <div className="settings-tabs">
                      <button
                        className={settingsActiveTab === 'measures' ? 'active' : ''}
                        onClick={() => setSettingsActiveTab('measures')}
                      >
                        <FaRulerCombined /> 1. Medidas & Rollo
                      </button>
                      <button
                        className={settingsActiveTab === 'brand' ? 'active' : ''}
                        onClick={() => setSettingsActiveTab('brand')}
                      >
                        <FaImage /> 2. Logo & Tienda
                      </button>
                      <button
                        className={settingsActiveTab === 'fonts' ? 'active' : ''}
                        onClick={() => setSettingsActiveTab('fonts')}
                      >
                        <FaFont /> 3. Textos & Tamaños
                      </button>
                      <button
                        className={settingsActiveTab === 'barcode' ? 'active' : ''}
                        onClick={() => setSettingsActiveTab('barcode')}
                      >
                        <FaBarcode /> 4. Código de Barras
                      </button>
                      <button
                        className={settingsActiveTab === 'visibility' ? 'active' : ''}
                        onClick={() => setSettingsActiveTab('visibility')}
                      >
                        <FaEye /> 5. Elementos Visibles
                      </button>
                    </div>

                    {/* Contenido según pestaña */}
                    <div className="tab-content">
                      {/* PESTAÑA 1: MEDIDAS Y ROLLO */}
                      {settingsActiveTab === 'measures' && (
                        <>
                          <div className="setting-block">
                            <label>Plantilla de Tamaño</label>
                            <select
                              value={labelConfig.preset}
                              onChange={(e) => handlePresetChange(e.target.value)}
                            >
                              <option value="2x1">🏷️ 2x1 Pulgadas (50.8 × 25.4 mm) - Estándar 3nStar</option>
                              <option value="50x30">🏷️ 50 × 30 mm</option>
                              <option value="40x30">🏷️ 40 × 30 mm</option>
                              <option value="40x25">🏷️ 40 × 25 mm</option>
                              <option value="30x20">🏷️ 30 × 20 mm (Mini / Tornillos)</option>
                              <option value="60x40">🏷️ 60 × 40 mm (Grande)</option>
                              <option value="custom">🛠️ Medida Personalizada (mm)</option>
                            </select>
                          </div>

                          <div className="setting-block">
                            <label>Ancho (mm): <span className="val">{labelConfig.widthMm} mm</span></label>
                            <input
                              type="number"
                              min="20"
                              max="120"
                              step="0.1"
                              value={labelConfig.widthMm}
                              onChange={(e) => updateConfig({ widthMm: parseFloat(e.target.value) || 50, preset: 'custom' })}
                            />
                          </div>

                          <div className="setting-block">
                            <label>Alto (mm): <span className="val">{labelConfig.heightMm} mm</span></label>
                            <input
                              type="number"
                              min="15"
                              max="120"
                              step="0.1"
                              value={labelConfig.heightMm}
                              onChange={(e) => updateConfig({ heightMm: parseFloat(e.target.value) || 25, preset: 'custom' })}
                            />
                          </div>

                          <div className="setting-block">
                            <label>Margen Interior: <span className="val">{labelConfig.paddingMm} mm</span></label>
                            <input
                              type="range"
                              min="0.5"
                              max="3.5"
                              step="0.1"
                              value={labelConfig.paddingMm}
                              onChange={(e) => updateConfig({ paddingMm: parseFloat(e.target.value) })}
                            />
                          </div>
                        </>
                      )}

                      {/* PESTAÑA 2: LOGO Y TIENDA */}
                      {settingsActiveTab === 'brand' && (
                        <>
                          <div className="setting-block" style={{ minWidth: 220 }}>
                            <label>Origen del Logo</label>
                            <select
                              value={labelConfig.logoSource}
                              onChange={(e) => updateConfig({ logoSource: e.target.value })}
                            >
                              <option value="vector">⚡ Insignia Vectorial RG (Ultra-Nítida para Térmica)</option>
                              <option value="store">🏢 Logo Oficial del Negocio</option>
                              <option value="custom">🖼️ Subir Imagen Personalizada</option>
                            </select>
                          </div>

                          {labelConfig.logoSource === 'custom' && (
                            <div className="setting-block">
                              <label>Cargar Archivo</label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleCustomLogoUpload}
                                style={{ fontSize: '0.75rem' }}
                              />
                            </div>
                          )}

                          <div className="setting-block">
                            <label>Altura del Logo: <span className="val">{labelConfig.logoHeightPx} px</span></label>
                            <input
                              type="range"
                              min="10"
                              max="34"
                              step="1"
                              value={labelConfig.logoHeightPx}
                              onChange={(e) => updateConfig({ logoHeightPx: parseInt(e.target.value) })}
                            />
                          </div>

                          <div className="setting-block" style={{ minWidth: 200 }}>
                            <label>Nombre del Negocio en Etiqueta</label>
                            <input
                              type="text"
                              value={labelConfig.storeName}
                              onChange={(e) => updateConfig({ storeName: e.target.value })}
                              placeholder="MULTIREPUESTOS RG"
                            />
                          </div>

                          <div className="setting-block">
                            <label>Tamaño Texto Negocio: <span className="val">{labelConfig.storeNameFontSizePt} pt</span></label>
                            <input
                              type="range"
                              min="5"
                              max="10"
                              step="0.2"
                              value={labelConfig.storeNameFontSizePt}
                              onChange={(e) => updateConfig({ storeNameFontSizePt: parseFloat(e.target.value) })}
                            />
                          </div>
                        </>
                      )}

                      {/* PESTAÑA 3: TIPOGRAFÍAS Y TAMAÑOS */}
                      {settingsActiveTab === 'fonts' && (
                        <>
                          <div className="setting-block">
                            <label>Nombre Repuesto: <span className="val">{labelConfig.productNameFontSizePt} pt</span></label>
                            <input
                              type="range"
                              min="6.0"
                              max="12.0"
                              step="0.2"
                              value={labelConfig.productNameFontSizePt}
                              onChange={(e) => updateConfig({ productNameFontSizePt: parseFloat(e.target.value) })}
                            />
                          </div>

                          <div className="setting-block">
                            <label>Líneas de Nombre</label>
                            <select
                              value={labelConfig.productNameMaxLines}
                              onChange={(e) => updateConfig({ productNameMaxLines: parseInt(e.target.value) })}
                            >
                              <option value="1">1 sola línea</option>
                              <option value="2">2 líneas (Recomendado)</option>
                            </select>
                          </div>

                          <div className="setting-block">
                            <label>Precio C$: <span className="val">{labelConfig.priceFontSizePt} pt</span></label>
                            <input
                              type="range"
                              min="7.0"
                              max="15.0"
                              step="0.5"
                              value={labelConfig.priceFontSizePt}
                              onChange={(e) => updateConfig({ priceFontSizePt: parseFloat(e.target.value) })}
                            />
                          </div>

                          <div className="setting-block">
                            <label>Código Repuesto: <span className="val">{labelConfig.codeFontSizePt} pt</span></label>
                            <input
                              type="range"
                              min="5.0"
                              max="9.5"
                              step="0.2"
                              value={labelConfig.codeFontSizePt}
                              onChange={(e) => updateConfig({ codeFontSizePt: parseFloat(e.target.value) })}
                            />
                          </div>
                        </>
                      )}

                      {/* PESTAÑA 4: CÓDIGO DE BARRAS */}
                      {settingsActiveTab === 'barcode' && (
                        <>
                          <div className="setting-block">
                            <label>Tipo de Código</label>
                            <select
                              value={labelConfig.codeType}
                              onChange={(e) => updateConfig({ codeType: e.target.value })}
                            >
                              <option value="barcode">📊 Código de Barras 1D (Estándar)</option>
                              <option value="qr">📱 Código QR 2D</option>
                            </select>
                          </div>

                          <div className="setting-block">
                            <label>Altura del Código: <span className="val">{labelConfig.barcodeHeightMm} mm</span></label>
                            <input
                              type="range"
                              min="6.0"
                              max="16.0"
                              step="0.5"
                              value={labelConfig.barcodeHeightMm}
                              onChange={(e) => updateConfig({ barcodeHeightMm: parseFloat(e.target.value) })}
                            />
                          </div>

                          {labelConfig.codeType === 'barcode' && (
                            <div className="setting-block">
                              <label>Grosor de Barras: <span className="val">{labelConfig.barcodeLineWidth}</span></label>
                              <select
                                value={labelConfig.barcodeLineWidth}
                                onChange={(e) => updateConfig({ barcodeLineWidth: parseFloat(e.target.value) })}
                              >
                                <option value="1.2">Fino (1.2) - Para códigos muy largos</option>
                                <option value="1.4">Estándar (1.4) - Óptimo para 3nStar</option>
                                <option value="1.6">Grueso (1.6) - Máxima legibilidad</option>
                              </select>
                            </div>
                          )}
                        </>
                      )}

                      {/* PESTAÑA 5: ELEMENTOS VISIBLES */}
                      {settingsActiveTab === 'visibility' && (
                        <div className="toggles-grid">
                          <div
                            className={`toggle-card ${labelConfig.showLogo ? 'active' : ''}`}
                            onClick={() => updateConfig({ showLogo: !labelConfig.showLogo })}
                          >
                            <FaCheck size={11} style={{ opacity: labelConfig.showLogo ? 1 : 0.2 }} /> Logo del Negocio
                          </div>

                          <div
                            className={`toggle-card ${labelConfig.showStoreName ? 'active' : ''}`}
                            onClick={() => updateConfig({ showStoreName: !labelConfig.showStoreName })}
                          >
                            <FaCheck size={11} style={{ opacity: labelConfig.showStoreName ? 1 : 0.2 }} /> Nombre Empresa
                          </div>

                          <div
                            className={`toggle-card ${labelConfig.showProductName ? 'active' : ''}`}
                            onClick={() => updateConfig({ showProductName: !labelConfig.showProductName })}
                          >
                            <FaCheck size={11} style={{ opacity: labelConfig.showProductName ? 1 : 0.2 }} /> Nombre Repuesto
                          </div>

                          <div
                            className={`toggle-card ${labelConfig.showBarcode ? 'active' : ''}`}
                            onClick={() => updateConfig({ showBarcode: !labelConfig.showBarcode })}
                          >
                            <FaCheck size={11} style={{ opacity: labelConfig.showBarcode ? 1 : 0.2 }} /> Código Barras / QR
                          </div>

                          <div
                            className={`toggle-card ${labelConfig.showCodeText ? 'active' : ''}`}
                            onClick={() => updateConfig({ showCodeText: !labelConfig.showCodeText })}
                          >
                            <FaCheck size={11} style={{ opacity: labelConfig.showCodeText ? 1 : 0.2 }} /> Código Alfanumérico
                          </div>

                          <div
                            className={`toggle-card ${labelConfig.showPrice ? 'active' : ''}`}
                            onClick={() => updateConfig({ showPrice: !labelConfig.showPrice })}
                          >
                            <FaCheck size={11} style={{ opacity: labelConfig.showPrice ? 1 : 0.2 }} /> Precio de Venta C$
                          </div>

                          <div
                            className={`toggle-card ${labelConfig.showCategory ? 'active' : ''}`}
                            onClick={() => updateConfig({ showCategory: !labelConfig.showCategory })}
                          >
                            <FaCheck size={11} style={{ opacity: labelConfig.showCategory ? 1 : 0.2 }} /> Categoría
                          </div>

                          <div
                            className={`toggle-card ${labelConfig.showDivider ? 'active' : ''}`}
                            onClick={() => updateConfig({ showDivider: !labelConfig.showDivider })}
                          >
                            <FaCheck size={11} style={{ opacity: labelConfig.showDivider ? 1 : 0.2 }} /> Línea Divisoria
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Pie del panel de ajustes */}
                    <div className="panel-footer">
                      <button className="reset-btn" onClick={handleResetDefaults}>
                        <FaUndo /> Restablecer a 2x1" Predeterminado
                      </button>
                      <div className="notice">
                        💾 Tus ajustes se guardan automáticamente en este equipo.
                      </div>
                    </div>
                  </CustomizationPanel>
                )}
              </AnimatePresence>

              {/* Barra de paginación / navegación */}
              <PaginationBar>
                {paperFormat === 'thermal_roll' ? (
                  <>
                    <div className="nav-group">
                      <button
                        disabled={previewIndex === 0}
                        onClick={() => setPreviewIndex(p => Math.max(0, p - 1))}
                      >
                        <FaArrowLeft /> Anterior
                      </button>
                      <span>
                        Etiqueta <strong>{flattenedLabels.length > 0 ? previewIndex + 1 : 0}</strong> de <strong>{flattenedLabels.length}</strong>
                      </span>
                      <button
                        disabled={previewIndex >= flattenedLabels.length - 1}
                        onClick={() => setPreviewIndex(p => Math.min(flattenedLabels.length - 1, p + 1))}
                      >
                        Siguiente <FaArrowRight />
                      </button>
                    </div>

                    <div className="view-toggles">
                      <button
                        className={labelViewMode === 'single' ? 'active' : ''}
                        onClick={() => setLabelViewMode('single')}
                        title="Ver etiqueta individual ampliada"
                      >
                        🏷️ Vista Individual
                      </button>
                      <button
                        className={labelViewMode === 'reel' ? 'active' : ''}
                        onClick={() => setLabelViewMode('reel')}
                        title="Ver tira continua del rollo"
                      >
                        🎞️ Tira de Rollo
                      </button>
                    </div>

                    <div className="paper-indicator">
                      <FaTags /> {labelConfig.widthMm} × {labelConfig.heightMm} mm ({labelConfig.preset === '2x1' ? '2×1 pulg' : 'Personalizada'}) • 3nStar / USB
                    </div>
                  </>
                ) : (
                  <>
                    <div className="nav-group">
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
                      {paperType === 'bond' ? 'Papel Bond con Guías de Corte Punteadas' : 'Papel de Etiquetas Autoadhesivas'}
                    </div>
                  </>
                )}
              </PaginationBar>

              {/* VISTA PREVIA EN PANTALLA */}
              <PreviewArea>
                {/* 1. MODO ROLLO TÉRMICO */}
                {paperFormat === 'thermal_roll' ? (
                  flattenedLabels.length === 0 ? (
                    <div style={{ color: '#e2e8f0', textAlign: 'center' }}>
                      <FaBarcode size={48} style={{ opacity: 0.5, marginBottom: 12 }} />
                      <p>Agrega repuestos a la bandeja para previsualizar tu etiqueta térmica.</p>
                    </div>
                  ) : labelViewMode === 'single' && currentStickerProduct ? (
                    <ThermalCardWrapper>
                      {(() => {
                        const prod = currentStickerProduct;
                        const code = prod.codigo_barras || prod.codigo || '000000';
                        const rawVal = prod.precio_venta ?? prod.venta ?? prod.precio ?? prod.__fmt?.venta ?? 0;
                        const numVal = typeof rawVal === 'string' && rawVal.includes('C$')
                          ? parseFloat(rawVal.replace(/[^0-9.]/g, ''))
                          : parseFloat(rawVal);
                        const formattedPrice = (!isNaN(numVal) && numVal > 0) ? `C$ ${numVal.toFixed(2)}` : '';
                        const cat = prod.categoria_nombre || '';

                        return (
                          <ThermalSticker
                            style={{
                              width: `${previewStickerWidthPx}px`,
                              height: `${previewStickerHeightPx}px`,
                              padding: `${labelConfig.paddingMm * 8}px`
                            }}
                          >
                            <div className="dim-pill">
                              <FaTags size={9} /> {labelConfig.widthMm} × {labelConfig.heightMm} mm (3nStar)
                            </div>

                            {(labelConfig.showLogo || labelConfig.showStoreName) && (
                              <div className="company-header-row">
                                {labelConfig.showLogo && (
                                  labelConfig.logoSource === 'vector' ? (
                                    <RgVectorEmblem height={labelConfig.logoHeightPx} />
                                  ) : labelConfig.logoSource === 'custom' && labelConfig.customLogoData ? (
                                    <img
                                      src={labelConfig.customLogoData}
                                      className="company-logo"
                                      style={{ height: `${labelConfig.logoHeightPx}px` }}
                                      alt="Logo"
                                    />
                                  ) : (
                                    <img
                                      src={officialLogoUrl}
                                      className="company-logo"
                                      style={{ height: `${labelConfig.logoHeightPx}px` }}
                                      alt="Logo"
                                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                    />
                                  )
                                )}
                                {labelConfig.showStoreName && (
                                  <span
                                    className="company-title"
                                    style={{ fontSize: `${labelConfig.storeNameFontSizePt * 1.3}px` }}
                                  >
                                    {labelConfig.storeName}
                                  </span>
                                )}
                              </div>
                            )}

                            {labelConfig.showProductName && (
                              <div
                                className="product-name"
                                style={{
                                  fontSize: `${labelConfig.productNameFontSizePt * 1.3}px`,
                                  WebkitLineClamp: labelConfig.productNameMaxLines,
                                  maxHeight: `${labelConfig.productNameMaxLines * 1.3 * labelConfig.productNameFontSizePt * 1.3}px`
                                }}
                                title={prod.nombre}
                              >
                                {prod.nombre}
                              </div>
                            )}

                            {labelConfig.showBarcode && (
                              <div className="code-area">
                                {labelConfig.codeType === 'barcode' ? (
                                  <BarcodeSvg
                                    value={code}
                                    width={labelConfig.barcodeLineWidth}
                                    height={labelConfig.barcodeHeightMm * 3.4}
                                    displayValue={false}
                                  />
                                ) : (
                                  <QRCodeSVG
                                    value={code}
                                    size={labelConfig.barcodeHeightMm * 4}
                                    level="M"
                                  />
                                )}
                              </div>
                            )}

                            {(labelConfig.showCodeText || labelConfig.showPrice || labelConfig.showCategory) && (
                              <div
                                className="bottom-info"
                                style={{
                                  borderTop: labelConfig.showDivider ? '1px solid #000000' : 'none',
                                  paddingTop: labelConfig.showDivider ? '3px' : '0'
                                }}
                              >
                                {labelConfig.showCodeText ? (
                                  <span
                                    className="code-text"
                                    style={{ fontSize: `${labelConfig.codeFontSizePt * 1.3}px` }}
                                  >
                                    {code}
                                  </span>
                                ) : <span />}

                                {labelConfig.showPrice && formattedPrice && (
                                  <span
                                    className="price-tag"
                                    style={{ fontSize: `${labelConfig.priceFontSizePt * 1.3}px` }}
                                  >
                                    {formattedPrice}
                                  </span>
                                )}

                                {labelConfig.showCategory && cat && (
                                  <span
                                    className="category-text"
                                    style={{ fontSize: `${labelConfig.categoryFontSizePt * 1.3}px` }}
                                  >
                                    {cat}
                                  </span>
                                )}
                              </div>
                            )}
                          </ThermalSticker>
                        );
                      })()}
                    </ThermalCardWrapper>
                  ) : (
                    /* Vista de Rollo / Tira Continua */
                    <ReelRollStrip>
                      {flattenedLabels.map((prod, index) => {
                        const code = prod.codigo_barras || prod.codigo || '000000';
                        const rawVal = prod.precio_venta ?? prod.venta ?? prod.precio ?? prod.__fmt?.venta ?? 0;
                        const numVal = typeof rawVal === 'string' && rawVal.includes('C$')
                          ? parseFloat(rawVal.replace(/[^0-9.]/g, ''))
                          : parseFloat(rawVal);
                        const formattedPrice = (!isNaN(numVal) && numVal > 0) ? `C$ ${numVal.toFixed(2)}` : '';
                        const cat = prod.categoria_nombre || '';

                        return (
                          <div key={`${prod.id_producto}-${index}`} className="reel-sticker-wrap">
                            <ThermalSticker
                              style={{
                                width: `${previewStickerWidthPx}px`,
                                height: `${previewStickerHeightPx}px`,
                                padding: `${labelConfig.paddingMm * 8}px`
                              }}
                            >
                              <div className="dim-pill">
                                #{index + 1} • {labelConfig.widthMm}×{labelConfig.heightMm}mm
                              </div>

                              {(labelConfig.showLogo || labelConfig.showStoreName) && (
                                <div className="company-header-row">
                                  {labelConfig.showLogo && (
                                    labelConfig.logoSource === 'vector' ? (
                                      <RgVectorEmblem height={labelConfig.logoHeightPx} />
                                    ) : labelConfig.logoSource === 'custom' && labelConfig.customLogoData ? (
                                      <img
                                        src={labelConfig.customLogoData}
                                        className="company-logo"
                                        style={{ height: `${labelConfig.logoHeightPx}px` }}
                                        alt="Logo"
                                      />
                                    ) : (
                                      <img
                                        src={officialLogoUrl}
                                        className="company-logo"
                                        style={{ height: `${labelConfig.logoHeightPx}px` }}
                                        alt="Logo"
                                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                      />
                                    )
                                  )}
                                  {labelConfig.showStoreName && (
                                    <span
                                      className="company-title"
                                      style={{ fontSize: `${labelConfig.storeNameFontSizePt * 1.3}px` }}
                                    >
                                      {labelConfig.storeName}
                                    </span>
                                  )}
                                </div>
                              )}

                              {labelConfig.showProductName && (
                                <div
                                  className="product-name"
                                  style={{
                                    fontSize: `${labelConfig.productNameFontSizePt * 1.3}px`,
                                    WebkitLineClamp: labelConfig.productNameMaxLines,
                                    maxHeight: `${labelConfig.productNameMaxLines * 1.3 * labelConfig.productNameFontSizePt * 1.3}px`
                                  }}
                                  title={prod.nombre}
                                >
                                  {prod.nombre}
                                </div>
                              )}

                              {labelConfig.showBarcode && (
                                <div className="code-area">
                                  {labelConfig.codeType === 'barcode' ? (
                                    <BarcodeSvg
                                      value={code}
                                      width={labelConfig.barcodeLineWidth}
                                      height={labelConfig.barcodeHeightMm * 3.4}
                                      displayValue={false}
                                    />
                                  ) : (
                                    <QRCodeSVG
                                      value={code}
                                      size={labelConfig.barcodeHeightMm * 4}
                                      level="M"
                                    />
                                  )}
                                </div>
                              )}

                              {(labelConfig.showCodeText || labelConfig.showPrice || labelConfig.showCategory) && (
                                <div
                                  className="bottom-info"
                                  style={{
                                    borderTop: labelConfig.showDivider ? '1px solid #000000' : 'none',
                                    paddingTop: labelConfig.showDivider ? '3px' : '0'
                                  }}
                                >
                                  {labelConfig.showCodeText ? (
                                    <span
                                      className="code-text"
                                      style={{ fontSize: `${labelConfig.codeFontSizePt * 1.3}px` }}
                                    >
                                      {code}
                                    </span>
                                  ) : <span />}

                                  {labelConfig.showPrice && formattedPrice && (
                                    <span
                                      className="price-tag"
                                      style={{ fontSize: `${labelConfig.priceFontSizePt * 1.3}px` }}
                                    >
                                      {formattedPrice}
                                    </span>
                                  )}

                                  {labelConfig.showCategory && cat && (
                                    <span
                                      className="category-text"
                                      style={{ fontSize: `${labelConfig.categoryFontSizePt * 1.3}px` }}
                                    >
                                      {cat}
                                    </span>
                                  )}
                                </div>
                              )}
                            </ThermalSticker>
                          </div>
                        );
                      })}
                    </ReelRollStrip>
                  )
                ) : (
                  /* 2. MODO HOJA A4 */
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
                          {(labelConfig.showStoreName || labelConfig.showLogo) && (
                            <div className="company-header">
                              {labelConfig.showLogo && (
                                <RgVectorEmblem height={18} />
                              )}
                              {labelConfig.showStoreName && (
                                <span className="company-title">{labelConfig.storeName}</span>
                              )}
                            </div>
                          )}

                          <div className="product-name" title={prod.nombre}>
                            {prod.nombre}
                          </div>

                          <div className="code-area">
                            <BarcodeSvg
                              value={code}
                              width={layoutType === '40' ? 1.0 : 1.3}
                              height={layoutType === '40' ? 22 : 28}
                              displayValue={false}
                            />
                          </div>

                          <div className="bottom-info">
                            <span className="code-text">{code}</span>
                            {labelConfig.showPrice && formattedPrice && (
                              <span className="price-tag">{formattedPrice}</span>
                            )}
                            {labelConfig.showCategory && cat && (
                              <span className="category-text">{cat}</span>
                            )}
                          </div>
                        </LabelCard>
                      );
                    })}
                  </A4Sheet>
                )}
              </PreviewArea>
            </RightPanel>
          </ContentLayout>
        </ModalContainer>
      </ModalOverlay>
    </AnimatePresence>
  );
}

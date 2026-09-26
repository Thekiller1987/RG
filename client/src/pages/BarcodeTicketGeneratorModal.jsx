import React, { useState, useEffect, useRef, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import JsBarcode from 'jsbarcode';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';
import {
  FaBarcode, FaQrcode, FaPrint, FaTrash, FaTimes, FaPlus, FaMinus,
  FaSearch, FaLayerGroup, FaCheck, FaInfoCircle, FaFileAlt, FaTags,
  FaArrowLeft, FaArrowRight, FaCompressAlt, FaExpandAlt, FaBolt,
  FaBluetooth, FaBluetoothB, FaCheckCircle, FaExclamationCircle,
  FaQuestionCircle, FaDesktop, FaSyncAlt, FaSlidersH
} from 'react-icons/fa';
import {
  isBluetoothSupported,
  connectBluetoothPrinter,
  disconnectBluetoothPrinter,
  printBatchViaBluetooth,
  detectProtocolFromName
} from '../utils/bluetoothPrinter';

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
  max-width: 1460px;
  height: 95vh;
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
  padding: 0.9rem 1.5rem;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
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
      font-size: 1.15rem;
      font-weight: 700;
      margin: 0;
      letter-spacing: -0.01em;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    p {
      margin: 0;
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

const BluetoothBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 0.78rem;
  font-weight: 700;
  transition: all 0.2s;
  user-select: none;

  &.disconnected {
    background: rgba(59, 130, 246, 0.15);
    color: #93c5fd;
    border: 1px solid rgba(59, 130, 246, 0.3);
    cursor: pointer;

    &:hover {
      background: rgba(59, 130, 246, 0.25);
      color: #ffffff;
    }
  }

  &.connecting {
    background: rgba(234, 179, 8, 0.15);
    color: #fde047;
    border: 1px solid rgba(234, 179, 8, 0.3);
  }

  &.connected {
    background: rgba(34, 197, 94, 0.15);
    color: #86efac;
    border: 1px solid rgba(34, 197, 94, 0.3);
  }

  .disconnect-x {
    background: rgba(239, 68, 68, 0.25);
    border: none;
    color: #fca5a5;
    border-radius: 4px;
    padding: 2px 5px;
    font-size: 0.7rem;
    cursor: pointer;
    margin-left: 4px;
    transition: all 0.15s;

    &:hover {
      background: #ef4444;
      color: #ffffff;
    }
  }
`;

const HelpBtn = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #cbd5e1;
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 0.78rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: #ffffff;
  }
`;

const ContentLayout = styled.div`
  display: grid;
  grid-template-columns: 440px 1fr;
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
        max-width: 300px;

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
        color: #2563eb;
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

  .options-row {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
    justify-content: space-between;
  }

  .config-section {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: center;
  }

  .control-group {
    display: flex;
    flex-direction: column;
    gap: 3px;

    label {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #64748b;
    }

    select {
      padding: 5px 8px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 0.8rem;
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
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;

    .toggle-chip {
      display: flex;
      align-items: center;
      gap: 5px;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 4px 9px;
      font-size: 0.76rem;
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

  .action-buttons {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .btn-bluetooth-print {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    color: #ffffff;
    border: none;
    border-radius: 10px;
    padding: 8px 16px;
    font-size: 0.86rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    transition: all 0.2s;

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .btn-pc-print {
    background: #ffffff;
    color: #334155;
    border: 1px solid #cbd5e1;
    border-radius: 10px;
    padding: 8px 14px;
    font-size: 0.84rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 7px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover:not(:disabled) {
      background: #f1f5f9;
      color: #0f172a;
      border-color: #94a3b8;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .btn-a4-print {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: #ffffff;
    border: none;
    border-radius: 10px;
    padding: 8px 16px;
    font-size: 0.86rem;
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
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #64748b;
  position: relative;
`;

/* ==========================================
   VISTA PREVIA DE ETIQUETA TÉRMICA 2x1 (50x25mm)
========================================== */
const ThermalCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
`;

const ThermalSticker = styled.div`
  width: 384px;
  height: 196px;
  background: #ffffff;
  border-radius: 8px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.4);
  border: 1px solid #e2e8f0;
  position: relative;
  box-sizing: border-box;
  user-select: none;

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
  }

  .company-title {
    font-size: 8pt;
    font-weight: 800;
    text-transform: uppercase;
    color: #000000;
    letter-spacing: 0.05em;
    line-height: 1;
    margin: 0;
  }

  .product-name {
    font-size: 9.5pt;
    font-weight: 800;
    color: #000000;
    line-height: 1.15;
    max-height: 2.3em;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    width: 100%;
    margin-top: 2px;
  }

  .code-area {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 2px 0;
  }

  .bottom-info {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #000000;
    padding-top: 3px;

    .code-text {
      font-size: 7.5pt;
      font-family: monospace;
      font-weight: 800;
      color: #000000;
    }

    .price-tag {
      font-size: 11pt;
      font-weight: 900;
      color: #000000;
    }

    .category-text {
      font-size: 6.5pt;
      color: #334155;
      text-transform: uppercase;
    }
  }
`;

const ReelRollStrip = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #cbd5e1;
  padding: 16px 20px;
  border-radius: 16px;
  gap: 14px;
  max-height: 68vh;
  overflow-y: auto;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.15);

  .reel-sticker-wrap {
    position: relative;

    &::after {
      content: "- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -";
      position: absolute;
      bottom: -10px;
      left: 0;
      right: 0;
      text-align: center;
      color: #64748b;
      font-size: 0.65rem;
      letter-spacing: 2px;
      overflow: hidden;
    }

    &:last-child::after {
      display: none;
    }
  }
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
   MODAL DE AYUDA Y OVERLAY DE PROGRESO BLE
========================================== */
const PrintingOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(4px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;

  .progress-card {
    background: #ffffff;
    border-radius: 16px;
    padding: 24px 30px;
    width: 360px;
    text-align: center;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);

    .icon-anim {
      font-size: 2.4rem;
      color: #2563eb;
      margin-bottom: 12px;
      animation: pulse 1.5s infinite;
    }

    h3 {
      font-size: 1.1rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 8px 0;
    }

    .label-desc {
      font-size: 0.82rem;
      color: #64748b;
      margin-bottom: 16px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .progress-bar-bg {
      width: 100%;
      height: 10px;
      background: #e2e8f0;
      border-radius: 5px;
      overflow: hidden;
      margin-bottom: 8px;

      .progress-bar-fill {
        height: 100%;
        background: linear-gradient(90deg, #3b82f6, #10b981);
        transition: width 0.3s ease;
      }
    }

    .percentage-text {
      font-size: 0.82rem;
      font-weight: 700;
      color: #1e293b;
    }

    .footer-note {
      font-size: 0.72rem;
      color: #94a3b8;
      margin-top: 10px;
    }
  }

  @keyframes pulse {
    0% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.15); opacity: 1; }
    100% { transform: scale(1); opacity: 0.8; }
  }
`;

const HelpModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.7);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const HelpModalContainer = styled.div`
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);

  .header {
    background: #0f172a;
    color: #ffffff;
    padding: 14px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    h3 {
      font-size: 1.05rem;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    button {
      background: transparent;
      border: none;
      color: #94a3b8;
      font-size: 1.1rem;
      cursor: pointer;
      &:hover { color: #ffffff; }
    }
  }

  .body {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-height: 75vh;
    overflow-y: auto;

    .step-box {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 14px;
      background: #f8fafc;

      .step-title {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 700;
        font-size: 0.92rem;
        color: #1e293b;
        margin-bottom: 6px;

        .badge-number {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #2563eb;
          color: #ffffff;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      p {
        font-size: 0.82rem;
        color: #475569;
        line-height: 1.5;
        margin: 0 0 6px 0;
      }
    }
  }

  .footer {
    padding: 12px 20px;
    background: #f1f5f9;
    border-top: 1px solid #e2e8f0;
    text-align: right;

    button {
      background: #2563eb;
      color: #ffffff;
      border: none;
      padding: 8px 18px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 0.84rem;
      cursor: pointer;
      &:hover { background: #1d4ed8; }
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

  // Formato principal: 'thermal_2x1' (Phomemo 50x25mm) o 'a4_sheet' (hojas A4)
  const [paperFormat, setPaperFormat] = useState('thermal_2x1');

  // Modo de visualización en 2x1: 'single' (una sola) o 'reel' (tira continua)
  const [labelViewMode, setLabelViewMode] = useState('single');
  const [preview2x1Index, setPreview2x1Index] = useState(0);

  // Opciones de configuración A4
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

  // Estado de conexión Bluetooth
  const [bluetoothDevice, setBluetoothDevice] = useState(null);
  const [bluetoothCharacteristic, setBluetoothCharacteristic] = useState(null);
  const [bluetoothStatus, setBluetoothStatus] = useState('disconnected'); // 'disconnected' | 'connecting' | 'connected' | 'printing'
  const [bluetoothDeviceName, setBluetoothDeviceName] = useState('');
  const [isPrintingBatch, setIsPrintingBatch] = useState(false);
  const [printProgress, setPrintProgress] = useState({ current: 0, total: 0, percentage: 0, labelName: '' });
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [labelMedia, setLabelMedia] = useState(0x0A); // 0x0A = Troquelada con separación (Gap 2x1), 0x0B = Continuo
  const [labelDensity, setLabelDensity] = useState(0x0F); // 0x0F = Máxima nitidez térmica (darkest)
  const [printerProtocol, setPrinterProtocol] = useState('m_series'); // 'm_series' | 'm_series_esc' | 'd_series' | 'm02_series' | 'esc_pos_std'

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

  // Ajustar índice de etiqueta 2x1 si excede el nuevo total
  useEffect(() => {
    if (preview2x1Index >= flattenedLabels.length) {
      setPreview2x1Index(Math.max(0, flattenedLabels.length - 1));
    }
  }, [flattenedLabels.length, preview2x1Index]);

  // Etiquetas para la página A4 actualmente visible en pantalla
  const currentLabelsForPage = useMemo(() => {
    const start = currentPage * labelsPerPage;
    return flattenedLabels.slice(start, start + labelsPerPage);
  }, [flattenedLabels, currentPage, labelsPerPage]);

  // Producto actual para la vista individual 2x1
  const current2x1Product = flattenedLabels[preview2x1Index] || null;

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
    setPreview2x1Index(0);
  };

  /* ==========================================
     CONEXIÓN BLUETOOTH CON PHOMEMO DESDE LA PC
  ========================================== */
  const handleConnectBluetooth = async () => {
    if (!isBluetoothSupported()) {
      toast.error('Tu navegador no soporta Bluetooth Web. Usa Google Chrome o Microsoft Edge en tu PC.');
      return;
    }

    try {
      setBluetoothStatus('connecting');
      const conn = await connectBluetoothPrinter(() => {
        setBluetoothDevice(null);
        setBluetoothCharacteristic(null);
        setBluetoothStatus('disconnected');
        setBluetoothDeviceName('');
        toast('Impresora Bluetooth desconectada.');
      });

      setBluetoothDevice(conn.device);
      setBluetoothCharacteristic(conn.characteristic);
      setBluetoothDeviceName(conn.name);
      setBluetoothStatus('connected');
      toast.success(`Conectado a ${conn.name}`);
    } catch (err) {
      setBluetoothStatus('disconnected');
      if (err.message && !err.message.includes('cancelada')) {
        toast.error(err.message || 'No se pudo conectar a la impresora Bluetooth.');
      }
    }
  };

  const handleDisconnectBluetooth = () => {
    if (bluetoothDevice) {
      disconnectBluetoothPrinter(bluetoothDevice);
    }
    setBluetoothDevice(null);
    setBluetoothCharacteristic(null);
    setBluetoothStatus('disconnected');
    setBluetoothDeviceName('');
    toast('Impresora desconectada');
  };

  /* ==========================================
     IMPRESIÓN POR BLUETOOTH ("DE UN SOLO")
  ========================================== */
  const handlePrintBluetoothBatch = async () => {
    if (flattenedLabels.length === 0) {
      toast.error('No hay etiquetas en la bandeja.');
      return;
    }

    let char = bluetoothCharacteristic;

    // Si aún no está conectado, solicitar conexión primero
    if (!char || bluetoothStatus !== 'connected') {
      try {
        setBluetoothStatus('connecting');
        const conn = await connectBluetoothPrinter(() => {
          setBluetoothDevice(null);
          setBluetoothCharacteristic(null);
          setBluetoothStatus('disconnected');
          setBluetoothDeviceName('');
          toast('Impresora Bluetooth desconectada.');
        });

        char = conn.characteristic;
        setBluetoothDevice(conn.device);
        setBluetoothCharacteristic(conn.characteristic);
        setBluetoothDeviceName(conn.name);
        const autoProto = detectProtocolFromName(conn.name);
        setPrinterProtocol(autoProto);
        setBluetoothStatus('connected');
        toast.success(`Conectado a ${conn.name}`);
      } catch (err) {
        setBluetoothStatus('disconnected');
        if (err.message && !err.message.includes('cancelada')) {
          toast.error(err.message || 'Error al conectar por Bluetooth');
        }
        return;
      }
    }

    // Iniciar impresión continua
    try {
      setIsPrintingBatch(true);
      setPrintProgress({
        current: 1,
        total: flattenedLabels.length,
        percentage: 0,
        labelName: flattenedLabels[0]?.nombre || 'Repuesto'
      });

      await printBatchViaBluetooth(
        char,
        flattenedLabels,
        {
          showCompany,
          showPrice,
          showCategory,
          codeType,
          storeName: 'MULTIREPUESTOS RG',
          density: labelDensity,
          media: labelMedia,
          speed: 0x05,
          protocol: printerProtocol
        },
        (progress) => {
          setPrintProgress(progress);
        }
      );

      toast.success(`¡${flattenedLabels.length} etiquetas impresas en Phomemo con éxito!`);
    } catch (err) {
      console.error('Error al imprimir por Bluetooth:', err);
      toast.error(`Error en la impresión: ${err.message}`);
    } finally {
      setIsPrintingBatch(false);
    }
  };

  /* ==========================================
     IMPRESIÓN 2x1 CON DIÁLOGO DE WINDOWS / PC
  ========================================== */
  const handlePrint2x1Window = () => {
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

    let labelsHtml = '';

    flattenedLabels.forEach((product) => {
      const barcodeCode = product.codigo_barras || product.codigo || '000000';
      const rawVal = product.precio_venta ?? product.venta ?? product.precio ?? product.__fmt?.venta ?? 0;
      const numVal = typeof rawVal === 'string' && rawVal.includes('C$')
        ? parseFloat(rawVal.replace(/[^0-9.]/g, ''))
        : parseFloat(rawVal);
      const formattedPrice = (!isNaN(numVal) && numVal > 0) ? `C$ ${numVal.toFixed(2)}` : '';
      const catName = product.categoria_nombre || '';

      let codeHtml = '';
      if (codeType === 'barcode') {
        codeHtml = `<svg class="barcode-item" data-code="${barcodeCode}"></svg>`;
      } else if (codeType === 'qr') {
        codeHtml = `<div class="qr-item" data-code="${barcodeCode}"></div>`;
      } else {
        codeHtml = `
          <div style="display:flex;align-items:center;justify-content:space-around;width:100%;">
            <svg class="barcode-item" data-code="${barcodeCode}" style="max-width:70%;height:10mm;"></svg>
            <div class="qr-item" data-code="${barcodeCode}" style="width:11mm;height:11mm;"></div>
          </div>
        `;
      }

      labelsHtml += `
        <div class="label-page-2x1">
          ${showCompany ? `
            <div class="company-header">
              <span class="company-title">Multirepuestos RG</span>
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

    const printCss = `
      @page {
        size: 50.8mm 25.4mm; /* Exactamente 2x1 pulgadas */
        margin: 0;
      }
      @media print {
        html, body {
          width: 50.8mm;
          margin: 0;
          padding: 0;
          background: #ffffff;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .label-page-2x1 {
          page-break-after: always;
          break-after: page;
        }
      }
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      body {
        font-family: system-ui, -apple-system, sans-serif;
        background: #ffffff;
        color: #000000;
      }
      .label-page-2x1 {
        width: 50.8mm;
        height: 25.4mm;
        max-width: 50.8mm;
        max-height: 25.4mm;
        padding: 1.2mm 2.2mm;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        text-align: center;
        overflow: hidden;
        page-break-after: always;
        break-after: page;
      }
      .company-header {
        width: 100%;
        line-height: 1;
        margin-bottom: 0.3mm;
      }
      .company-title {
        font-size: 6.5pt;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .product-name {
        font-size: 7.2pt;
        font-weight: 700;
        line-height: 1.1;
        max-height: 2.2em;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break: break-word;
        width: 100%;
      }
      .code-area {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0.4mm 0;
      }
      .code-area svg {
        max-width: 95%;
        height: 10mm;
      }
      .bottom-info {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-top: 0.5px solid #000;
        padding-top: 0.5mm;
        line-height: 1;
      }
      .code-text {
        font-size: 6.5pt;
        font-family: monospace;
        font-weight: 700;
      }
      .price-tag {
        font-size: 8pt;
        font-weight: 800;
      }
      .category-text {
        font-size: 5.5pt;
        text-transform: uppercase;
      }
    `;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Etiquetas_2x1_Phomemo_Multirepuestos_RG</title>
          <style>${printCss}</style>
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"></script>
        </head>
        <body>
          ${labelsHtml}
          <script>
            window.onload = function() {
              document.querySelectorAll('.barcode-item').forEach(function(el) {
                var code = el.getAttribute('data-code');
                try {
                  JsBarcode(el, code, {
                    format: 'CODE128',
                    width: 1.5,
                    height: 38,
                    displayValue: false,
                    margin: 0
                  });
                } catch(e) {}
              });

              document.querySelectorAll('.qr-item').forEach(function(el) {
                var code = el.getAttribute('data-code');
                try {
                  new QRCode(el, {
                    text: code,
                    width: 40,
                    height: 40,
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
              }, 350);
            };
          </script>
        </body>
      </html>
    `);
    doc.close();
  };

  /* ==========================================
     MOTOR DE IMPRESIÓN A4
  ========================================== */
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

        let codeHtml = '';
        if (codeType === 'barcode') {
          codeHtml = `<svg class="barcode-item" data-code="${barcodeCode}"></svg>`;
        } else if (codeType === 'qr') {
          codeHtml = `<div class="qr-item" data-code="${barcodeCode}"></div>`;
        } else {
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
                <h2>
                  Generador de Etiquetas y Códigos de Barra
                </h2>
                <p>Imprime en Rollo Térmico 2x1'' (Phomemo Bluetooth) o en Hojas A4</p>
              </div>
            </div>

            <div className="actions-group">
              {/* Badge indicador de Bluetooth */}
              {bluetoothStatus === 'connected' ? (
                <BluetoothBadge className="connected" title="Conectado vía Bluetooth a la impresora">
                  <FaCheckCircle /> {bluetoothDeviceName || 'Phomemo Conectada'}
                  <button
                    className="disconnect-x"
                    onClick={handleDisconnectBluetooth}
                    title="Desconectar"
                  >
                    Desconectar
                  </button>
                </BluetoothBadge>
              ) : bluetoothStatus === 'connecting' ? (
                <BluetoothBadge className="connecting">
                  <FaSyncAlt className="animate-spin" /> Conectando Bluetooth...
                </BluetoothBadge>
              ) : (
                <BluetoothBadge
                  className="disconnected"
                  onClick={handleConnectBluetooth}
                  title="Haz clic para conectar tu Phomemo por Bluetooth desde la PC"
                >
                  <FaBluetooth /> Conectar Phomemo
                </BluetoothBadge>
              )}

              <HelpBtn onClick={() => setShowHelpModal(true)} title="Instrucciones para Phomemo en PC">
                <FaQuestionCircle /> ¿Cómo usar Phomemo?
              </HelpBtn>

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
              {/* Barra de opciones y selector de formato */}
              <ControlBar>
                <div className="top-row">
                  {/* Selector de Modo: Rollo 2x1 vs A4 */}
                  <div className="format-selector">
                    <button
                      className={paperFormat === 'thermal_2x1' ? 'active' : ''}
                      onClick={() => setPaperFormat('thermal_2x1')}
                    >
                      <FaTags /> 🏷️ Rollo Térmico 2x1'' (Phomemo)
                    </button>
                    <button
                      className={paperFormat === 'a4_sheet' ? 'active' : ''}
                      onClick={() => setPaperFormat('a4_sheet')}
                    >
                      <FaFileAlt /> 📄 Hoja Completa A4
                    </button>
                  </div>

                  {/* Botones de acción según el formato */}
                  <div className="action-buttons">
                    {paperFormat === 'thermal_2x1' ? (
                      <>
                        <button
                          className="btn-bluetooth-print"
                          disabled={flattenedLabels.length === 0 || isPrintingBatch}
                          onClick={handlePrintBluetoothBatch}
                          title="Imprime de un solo tirón por Bluetooth directamente desde la PC"
                        >
                          <FaBluetooth />
                          {bluetoothStatus === 'connected'
                            ? `Imprimir ${flattenedLabels.length} por Bluetooth`
                            : `Conectar e Imprimir ${flattenedLabels.length} (Bluetooth)`}
                        </button>

                        <button
                          className="btn-pc-print"
                          disabled={flattenedLabels.length === 0 || isPrintingBatch}
                          onClick={handlePrint2x1Window}
                          title="Imprime usando la impresora de Windows o cable USB configurada en 2x1''"
                        >
                          <FaDesktop /> Diálogo PC (2x1'')
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn-a4-print"
                        disabled={flattenedLabels.length === 0}
                        onClick={handlePrintA4}
                      >
                        <FaPrint /> Imprimir {flattenedLabels.length} Etiquetas A4
                      </button>
                    )}
                  </div>
                </div>

                <div className="options-row">
                  <div className="config-section">
                    {/* Tipo de Código */}
                    <div className="control-group">
                      <label>Tipo de Código</label>
                      <select value={codeType} onChange={(e) => setCodeType(e.target.value)}>
                        <option value="barcode">📊 Código de Barras (1D)</option>
                        <option value="qr">📱 Código QR (2D)</option>
                        {paperFormat === 'a4_sheet' && (
                          <option value="hybrid">🔄 Híbrido (Barras + QR)</option>
                        )}
                      </select>
                    </div>

                    {/* Selector de Protocolo y Papel para Phomemo 2x1 */}
                    {paperFormat === 'thermal_2x1' && (
                      <>
                        <div className="control-group">
                          <label>Protocolo de Impresora</label>
                          <select
                            value={printerProtocol}
                            onChange={(e) => setPrinterProtocol(e.target.value)}
                          >
                            <option value="m_series">🏷️ Phomemo Serie M (M110 / M120 / M220)</option>
                            <option value="m_series_esc">🏷️ Phomemo M110 (con Reset ESC @)</option>
                            <option value="d_series">🏷️ Phomemo Serie Q / D (Q199 / Q30 / D30)</option>
                            <option value="m02_series">🏷️ Phomemo Serie M02 / T02</option>
                            <option value="esc_pos_std">🏷️ ESC/POS Genérico</option>
                          </select>
                        </div>

                        <div className="control-group">
                          <label>Tipo de Rollo</label>
                          <select
                            value={labelMedia}
                            onChange={(e) => setLabelMedia(Number(e.target.value))}
                          >
                            <option value={0x0A}>🏷️ Con Separación (Gap 2x1)</option>
                            <option value={0x0B}>📄 Rollo Continuo</option>
                          </select>
                        </div>
                      </>
                    )}

                    {/* Controles específicos para A4 */}
                    {paperFormat === 'a4_sheet' && (
                      <>
                        <div className="control-group">
                          <label>Tipo de Papel</label>
                          <select value={paperType} onChange={(e) => setPaperType(e.target.value)}>
                            <option value="bond">📄 Papel Bond A4 (Líneas de Corte)</option>
                            <option value="adhesive">🏷️ Papel Adhesivo (Stickers A4)</option>
                          </select>
                        </div>

                        <div className="control-group">
                          <label>Distribución A4</label>
                          <select value={layoutType} onChange={(e) => setLayoutType(e.target.value)}>
                            <option value="24">24 por Hoja (3x8 - Estándar Góndola)</option>
                            <option value="40">40 por Hoja (4x10 - Repuesto Pequeño)</option>
                            <option value="12">12 por Hoja (2x6 - Grande / Baterías)</option>
                          </select>
                        </div>
                      </>
                    )}

                    {/* Toggles de contenido */}
                    <div className="toggles">
                      <div
                        className={`toggle-chip ${showPrice ? 'active' : ''}`}
                        onClick={() => setShowPrice(!showPrice)}
                        title="Mostrar precio de venta C$"
                      >
                        {showPrice && <FaCheck size={9} />} Precio C$
                      </div>
                      <div
                        className={`toggle-chip ${showCompany ? 'active' : ''}`}
                        onClick={() => setShowCompany(!showCompany)}
                        title="Mostrar Multirepuestos RG"
                      >
                        {showCompany && <FaCheck size={9} />} Empresa
                      </div>
                      <div
                        className={`toggle-chip ${showCategory ? 'active' : ''}`}
                        onClick={() => setShowCategory(!showCategory)}
                        title="Mostrar Categoría"
                      >
                        {showCategory && <FaCheck size={9} />} Categoría
                      </div>
                    </div>
                  </div>
                </div>
              </ControlBar>

              {/* Barra de paginación / navegación */}
              <PaginationBar>
                {paperFormat === 'thermal_2x1' ? (
                  <>
                    <div className="nav-group">
                      <button
                        disabled={preview2x1Index === 0}
                        onClick={() => setPreview2x1Index(p => Math.max(0, p - 1))}
                      >
                        <FaArrowLeft /> Anterior
                      </button>
                      <span>
                        Etiqueta <strong>{flattenedLabels.length > 0 ? preview2x1Index + 1 : 0}</strong> de <strong>{flattenedLabels.length}</strong>
                      </span>
                      <button
                        disabled={preview2x1Index >= flattenedLabels.length - 1}
                        onClick={() => setPreview2x1Index(p => Math.min(flattenedLabels.length - 1, p + 1))}
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
                      <FaTags /> Rollo Térmico 2x1'' (50mm x 25mm) - Phomemo / Térmica
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
                {/* 1. MODO ROLLO TÉRMICO 2x1 */}
                {paperFormat === 'thermal_2x1' ? (
                  flattenedLabels.length === 0 ? (
                    <div style={{ color: '#e2e8f0', textAlign: 'center' }}>
                      <FaBarcode size={48} style={{ opacity: 0.5, marginBottom: 12 }} />
                      <p>Agrega repuestos a la bandeja para previsualizar tu etiqueta 2x1''.</p>
                    </div>
                  ) : labelViewMode === 'single' && current2x1Product ? (
                    <ThermalCardWrapper>
                      {(() => {
                        const prod = current2x1Product;
                        const code = prod.codigo_barras || prod.codigo || '000000';
                        const rawVal = prod.precio_venta ?? prod.venta ?? prod.precio ?? prod.__fmt?.venta ?? 0;
                        const numVal = typeof rawVal === 'string' && rawVal.includes('C$')
                          ? parseFloat(rawVal.replace(/[^0-9.]/g, ''))
                          : parseFloat(rawVal);
                        const formattedPrice = (!isNaN(numVal) && numVal > 0) ? `C$ ${numVal.toFixed(2)}` : '';
                        const cat = prod.categoria_nombre || '';

                        return (
                          <ThermalSticker>
                            <div className="dim-pill">
                              <FaTags size={10} /> 2x1 PULGADAS (50x25mm)
                            </div>

                            {showCompany && (
                              <div className="company-title">Multirepuestos RG</div>
                            )}

                            <div className="product-name" title={prod.nombre}>
                              {prod.nombre}
                            </div>

                            <div className="code-area">
                              {codeType === 'barcode' ? (
                                <BarcodeSvg
                                  value={code}
                                  width={1.6}
                                  height={36}
                                  displayValue={false}
                                />
                              ) : (
                                <QRCodeSVG
                                  value={code}
                                  size={44}
                                  level="M"
                                />
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
                            <ThermalSticker>
                              <div className="dim-pill">
                                #{index + 1} • 2x1''
                              </div>

                              {showCompany && (
                                <div className="company-title">Multirepuestos RG</div>
                              )}

                              <div className="product-name" title={prod.nombre}>
                                {prod.nombre}
                              </div>

                              <div className="code-area">
                                {codeType === 'barcode' ? (
                                  <BarcodeSvg
                                    value={code}
                                    width={1.6}
                                    height={36}
                                    displayValue={false}
                                  />
                                ) : (
                                  <QRCodeSVG
                                    value={code}
                                    size={44}
                                    level="M"
                                  />
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
                )}
              </PreviewArea>
            </RightPanel>
          </ContentLayout>

          {/* OVERLAY DE PROGRESO DE IMPRESIÓN POR BLUETOOTH */}
          {isPrintingBatch && (
            <PrintingOverlay>
              <div className="progress-card">
                <div className="icon-anim">
                  <FaBluetooth />
                </div>
                <h3>Imprimiendo en Phomemo...</h3>
                <div className="label-desc">
                  Etiqueta {printProgress.current} de {printProgress.total}:
                  <strong> {printProgress.labelName}</strong>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${Math.max(5, printProgress.percentage)}%` }}
                  />
                </div>
                <div className="percentage-text">{printProgress.percentage}% completado</div>
                <div className="footer-note">No apagues la etiquetadora durante la impresión.</div>
              </div>
            </PrintingOverlay>
          )}

          {/* MODAL DE AYUDA Y GUÍA DE CONEXIÓN PHOMEMO EN PC */}
          {showHelpModal && (
            <HelpModalOverlay onClick={() => setShowHelpModal(false)}>
              <HelpModalContainer onClick={(e) => e.stopPropagation()}>
                <div className="header">
                  <h3>
                    <FaBluetooth /> Guía: ¿Cómo imprimir en Phomemo desde la PC?
                  </h3>
                  <button onClick={() => setShowHelpModal(false)}>
                    <FaTimes />
                  </button>
                </div>
                <div className="body">
                  <div className="step-box">
                    <div className="step-title">
                      <div className="badge-number">1</div>
                      <span>Opción A: Bluetooth Web Directo (¡Recomendado!)</span>
                    </div>
                    <p>
                      <strong>1.</strong> Enciende tu etiquetadora Phomemo (M110, M120, M220, D30, etc.) y colócale el rollo de etiquetas 2x1 pulgadas (50x25mm).
                    </p>
                    <p>
                      <strong>2.</strong> En tu computadora con Google Chrome o Microsoft Edge, haz clic en el botón azul <strong>"Conectar e Imprimir (Bluetooth)"</strong>.
                    </p>
                    <p>
                      <strong>3.</strong> El navegador mostrará una ventana con los dispositivos Bluetooth. Elige tu Phomemo y haz clic en <strong>"Vincular"</strong>.
                    </p>
                    <p>
                      <strong>4.</strong> ¡Listo! Se imprimirán todas las etiquetas de tu lista <strong>de un solo tirón</strong> sin necesidad de tocar el celular ni de conectar la impresora a cada rato.
                    </p>
                  </div>

                  <div className="step-box">
                    <div className="step-title">
                      <div className="badge-number">2</div>
                      <span>Opción B: Usar como Impresora de Windows o Cable USB</span>
                    </div>
                    <p>
                      <strong>1.</strong> Si tienes instalados los drivers de Phomemo o el software <em>Labelife</em> en tu computadora con Windows:
                    </p>
                    <p>
                      <strong>2.</strong> Haz clic en el botón <strong>"Diálogo PC (2x1'')"</strong>.
                    </p>
                    <p>
                      <strong>3.</strong> En la ventana de impresión de Windows, selecciona tu impresora Phomemo y asegúrate de elegir el tamaño de papel <strong>2x1 pulgadas o 50x25mm</strong> con márgenes en 0.
                    </p>
                    <p>
                      <strong>4.</strong> Presiona Imprimir y el rollo saldrá continuo de un solo tiro.
                    </p>
                  </div>
                </div>
                <div className="footer">
                  <button onClick={() => setShowHelpModal(false)}>
                    ¡Entendido, volver al generador!
                  </button>
                </div>
              </HelpModalContainer>
            </HelpModalOverlay>
          )}
        </ModalContainer>
      </ModalOverlay>
    </AnimatePresence>
  );
}

import React, { useEffect, useState, useCallback, useMemo } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaTimes, FaMoneyBillWave, FaCreditCard, FaSpinner, FaFileInvoiceDollar,
    FaPrint, FaCheckCircle, FaClock, FaBan, FaUniversity, FaLandmark,
    FaCalendarAlt, FaSearch, FaBoxOpen, FaShoppingBag, FaChartLine,
    FaReceipt, FaTrophy, FaFilter, FaLayerGroup, FaExchangeAlt, FaUser, FaFilePdf
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import * as api from "../../../service/api";
import TicketModal from "./TicketModal";
import StatementModal from "./StatementModal";
import { useAuth } from "../../../context/AuthContext";
import { useSettings } from "../../../context/SettingsContext";
import { generatePurchasesReportPDF } from "../../../utils/clientPdfGenerator";

const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1080;
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  background: #f8fafc;
  color: #0f172a;
  border-radius: 22px;
  width: 1120px;
  max-width: 100%;
  max-height: 92vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 60px -15px rgba(15, 23, 42, 0.35);
  border: 1px solid #e2e8f0;
  overflow: hidden;
`;

const Header = styled.div`
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const HeaderTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
`;

const ClientIdentity = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 14px;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    font-weight: 800;
    box-shadow: 0 6px 14px rgba(37, 99, 235, 0.25);
    flex-shrink: 0;
  }
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.35rem;
  font-weight: 800;
  color: #0f172a;
`;

const ClientMetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-top: 0.35rem;
  span {
    font-size: 0.78rem;
    font-weight: 600;
    color: #475569;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    padding: 3px 10px;
    border-radius: 99px;
  }
`;

const CloseButton = styled.button`
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  width: 38px;
  height: 38px;
  border-radius: 11px;
  font-size: 1rem;
  cursor: pointer;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
  outline: none;
  &:hover {
    background: #fee2e2;
    color: #dc2626;
    border-color: #fecaca;
  }
`;

const HeaderToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding-top: 0.85rem;
  border-top: 1px solid #f1f5f9;
`;

const ActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.52rem 0.95rem;
  font-size: 0.82rem;
  font-weight: 700;
  border-radius: 10px;
  cursor: pointer;
  outline: none;
  transition: all 0.2s;
  border: 1px solid ${p => p.$border || 'transparent'};
  background: ${p => p.$bg || '#f1f5f9'};
  color: ${p => p.$color || '#334155'};
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    filter: brightness(0.97);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/* Segmented Tabs Bar — Sin cortes ni bordes negros */
const SegmentedTabsWrapper = styled.div`
  background: #ffffff;
  padding: 0.65rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
`;

const SegmentedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  background: #f1f5f9;
  padding: 0.35rem;
  border-radius: 14px;
  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const SegmentedTab = styled.button`
  border: none !important;
  outline: none !important;
  padding: 0.68rem 1rem;
  border-radius: 10px;
  font-size: 0.86rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${p => p.$active ? '#ffffff' : 'transparent'};
  color: ${p => p.$active ? '#2563eb' : '#64748b'};
  box-shadow: ${p => p.$active ? '0 2px 8px rgba(15, 23, 42, 0.08)' : 'none'};
  &:hover {
    color: ${p => p.$active ? '#1d4ed8' : '#0f172a'};
  }
`;

const Body = styled.div`
  padding: 1.35rem 1.5rem;
  overflow-y: auto;
  flex: 1;
`;

const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 1.25rem;
`;

const KpiCard = styled(motion.div)`
  background: #ffffff;
  padding: 1.15rem 1.25rem;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  border-left: 4px solid ${p => p.$color || '#2563eb'};
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.03);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;

  .kpi-info {
    display: flex;
    flex-direction: column;
    gap: 3px;
    .kpi-label {
      font-size: 0.74rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: #64748b;
    }
    .kpi-val {
      font-size: 1.45rem;
      font-weight: 800;
      color: #0f172a;
    }
    .kpi-sub {
      font-size: 0.76rem;
      font-weight: 600;
      color: ${p => p.$color || '#2563eb'};
    }
  }
  .kpi-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: ${p => p.$bg || '#eff6ff'};
    color: ${p => p.$color || '#2563eb'};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    flex-shrink: 0;
  }
`;

const FilterPanel = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1rem 1.25rem;
  margin-bottom: 1.15rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

const QuickPeriodGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const PillBtn = styled.button`
  outline: none !important;
  padding: 0.45rem 0.9rem;
  border-radius: 99px;
  border: 1px solid ${p => p.$active ? (p.$color || '#2563eb') : '#cbd5e1'};
  background: ${p => p.$active ? (p.$bg || '#eff6ff') : '#ffffff'};
  color: ${p => p.$active ? (p.$color || '#1d4ed8') : '#475569'};
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.38rem;
  transition: all 0.18s;
  &:hover {
    border-color: ${p => p.$color || '#2563eb'};
  }
`;

const DateInput = styled.input`
  padding: 0.48rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #0f172a;
  background: #f8fafc;
  outline: none;
  &:focus {
    border-color: #3b82f6;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 11px;
  padding: 0.5rem 0.9rem;
  flex: 1;
  min-width: 240px;
  &:focus-within {
    border-color: #3b82f6;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  input {
    border: none;
    background: transparent;
    outline: none;
    width: 100%;
    font-size: 0.88rem;
    color: #0f172a;
  }
`;

const RangeSummaryStrip = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 0.85rem 1.25rem;
  margin-bottom: 1.15rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(135px, 1fr));
  gap: 0.75rem;
  .metric {
    display: flex;
    flex-direction: column;
    span.lbl { font-size: 0.7rem; font-weight: 700; color: #64748b; text-transform: uppercase; }
    span.val { font-size: 1.05rem; font-weight: 800; color: #0f172a; margin-top: 2px; }
  }
`;

const PurchaseCard = styled(motion.div)`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-left: 4px solid ${p => p.$tipo === 'CREDITO' ? '#f59e0b' : p.$tipo === 'DEVOLUCION' ? '#ef4444' : '#10b981'};
  border-radius: 16px;
  padding: 1.15rem 1.3rem;
  margin-bottom: 0.9rem;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.03);
`;

const PurchaseHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 1rem;
  flex-wrap: wrap;
`;

const MethodBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.38rem;
  padding: 0.26rem 0.7rem;
  border-radius: 99px;
  font-size: 0.76rem;
  font-weight: 700;
  background: ${p => p.$bg || '#f1f5f9'};
  color: ${p => p.$color || '#334155'};
  border: 1px solid ${p => p.$border || 'transparent'};
`;

const ProductsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.85rem;
  font-size: 0.84rem;
  background: #f8fafc;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  th, td {
    padding: 0.55rem 0.85rem;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }
  th {
    background: #f1f5f9;
    color: #475569;
    font-size: 0.73rem;
    font-weight: 700;
    text-transform: uppercase;
  }
  tr:last-child td {
    border-bottom: none;
  }
`;

const TicketCardStyled = styled(motion.div)`
  background: white;
  border-radius: 14px;
  padding: 1.1rem 1.25rem;
  margin-bottom: 0.8rem;
  border: 1px solid #e2e8f0;
  border-left: 4px solid ${p => p.$estado === 'PAGADO' ? '#10b981' : p.$estado === 'DEVUELTO' ? '#f59e0b' : '#ef4444'};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 99px;
  overflow: hidden;
  margin: 0.55rem 0;
  .fill {
    height: 100%;
    background: ${p => p.$pct >= 100 ? '#10b981' : '#3b82f6'};
    border-radius: 99px;
    transition: width 0.35s ease;
  }
`;

const AbonoRowCard = styled(motion.div)`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-left: 4px solid ${p => p.$accent || '#10b981'};
  border-radius: 14px;
  padding: 1rem 1.2rem;
  margin-bottom: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  .left-part {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    flex: 1;
    min-width: 240px;
  }
  .method-icon-box {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: ${p => p.$iconBg || '#ecfdf5'};
    color: ${p => p.$accent || '#059669'};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    flex-shrink: 0;
  }
`;

const SpinAnimation = styled(FaSpinner)`
  animation: spin 1s linear infinite;
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;

const CenteredMessage = styled.div`
  text-align: center;
  padding: 2.5rem;
  color: #64748b;
`;

const formatCurrency = (amount) => `C$${Number(amount || 0).toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('es-NI', {
        timeZone: 'America/Managua', day: '2-digit', month: '2-digit', year: 'numeric'
    });
};
const fmtDateTime = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('es-NI', {
        timeZone: 'America/Managua', day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
    });
};

export const getPaymentMethodVisual = (metodoRaw = 'Efectivo') => {
    const m = String(metodoRaw || 'Efectivo').toLowerCase();
    if (m.includes('transfer')) {
        return {
            label: 'Transferencia Bancaria',
            shortLabel: 'Transferencia',
            icon: FaUniversity,
            color: '#2563eb',
            bg: '#eff6ff',
            border: '#bfdbfe'
        };
    }
    if (m.includes('tarjeta') || m.includes('pos')) {
        return {
            label: 'Tarjeta / POS',
            shortLabel: 'Tarjeta',
            icon: FaCreditCard,
            color: '#7c3aed',
            bg: '#f5f3ff',
            border: '#ddd6fe'
        };
    }
    if (m.includes('cred') || m.includes('créd')) {
        return {
            label: 'Crédito',
            shortLabel: 'Crédito',
            icon: FaFileInvoiceDollar,
            color: '#d97706',
            bg: '#fffbeb',
            border: '#fde68a'
        };
    }
    if (m.includes('mixto')) {
        return {
            label: metodoRaw,
            shortLabel: 'Pago Mixto',
            icon: FaExchangeAlt,
            color: '#0284c7',
            bg: '#f0f9ff',
            border: '#bae6fd'
        };
    }
    return {
        label: 'Normal / Contado (Efectivo)',
        shortLabel: 'Contado / Efectivo',
        icon: FaMoneyBillWave,
        color: '#059669',
        bg: '#ecfdf5',
        border: '#a7f3d0'
    };
};

export default function HistorialCreditoModal({ client, onClose, token, initialTab = 'creditos' }) {
    const { allUsers, clients, hasPermission, requireActionPermission } = useAuth();
    const { settings } = useSettings();
    const canViewPurchases = hasPermission('clientes.ver_compras');

    const [activeTab, setActiveTab] = useState(
        initialTab === 'compras' && canViewPurchases ? 'compras' : 'creditos'
    );
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState(null);
    const [creditTickets, setCreditTickets] = useState([]);
    const [error, setError] = useState(null);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [activePeriodPreset, setActivePeriodPreset] = useState('ALL');
    const [purchaseTypeFilter, setPurchaseTypeFilter] = useState('ALL');
    const [productSearch, setProductSearch] = useState('');

    const [ledgerFilter, setLedgerFilter] = useState('ALL');
    const [abonoMethodFilter, setAbonoMethodFilter] = useState('ALL');

    const [ticketToPrint, setTicketToPrint] = useState(null);
    const [cancellingId, setCancellingId] = useState(null);
    const [visiblePurchasesCount, setVisiblePurchasesCount] = useState(40);

    const [isFetchingStatement, setIsFetchingStatement] = useState(false);
    const [statementData, setStatementData] = useState(null);
    const [statementFilter, setStatementFilter] = useState('ALL');

    const applyPeriodPreset = (preset) => {
        setActivePeriodPreset(preset);
        const now = new Date();
        const toYMD = (d) => {
            const yr = d.getFullYear();
            const mo = String(d.getMonth() + 1).padStart(2, '0');
            const da = String(d.getDate()).padStart(2, '0');
            return `${yr}-${mo}-${da}`;
        };

        if (preset === 'ALL') {
            setStartDate('');
            setEndDate('');
        } else if (preset === 'TODAY') {
            const today = toYMD(now);
            setStartDate(today);
            setEndDate(today);
        } else if (preset === 'WEEK') {
            const day = now.getDay();
            const diffToMonday = day === 0 ? -6 : 1 - day;
            const monday = new Date(now);
            monday.setDate(now.getDate() + diffToMonday);
            setStartDate(toYMD(monday));
            setEndDate(toYMD(now));
        } else if (preset === 'MONTH') {
            const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            setStartDate(toYMD(firstOfMonth));
            setEndDate(toYMD(now));
        } else if (preset === 'YEAR') {
            const firstOfYear = new Date(now.getFullYear(), 0, 1);
            setStartDate(toYMD(firstOfYear));
            setEndDate(toYMD(now));
        }
    };

    const fetchData = useCallback(async () => {
        if (!client?.id_cliente) return;
        setLoading(true);
        setError(null);
        try {
            const params = {};
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const [analyticsData, ticketsData] = await Promise.all([
                api.fetchClientPurchaseAnalytics(client.id_cliente, token, params),
                api.getCreditosPendientes(client.id_cliente, token)
            ]);

            setAnalytics(analyticsData);
            setCreditTickets(Array.isArray(ticketsData) ? ticketsData : []);
        } catch (err) {
            console.error("Error cargando expediente del cliente:", err);
            setError("No se pudo cargar el expediente completo del cliente.");
        } finally {
            setLoading(false);
        }
    }, [client, token, startDate, endDate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handlePrint = async (filter = 'ALL') => {
        setIsFetchingStatement(true);
        const loadingToast = toast.loading('Abriendo estado de cuenta...');
        try {
            const data = await api.fetchClientStatement(client.id_cliente, token);
            setStatementData(data);
            setStatementFilter(filter);
            toast.dismiss(loadingToast);
        } catch (err) {
            toast.dismiss(loadingToast);
            toast.error('Error al generar el estado de cuenta.');
            console.error(err);
        } finally {
            setIsFetchingStatement(false);
        }
    };

    const handlePrintPurchasesReport = async () => {
        if (!analytics) return;
        const tId = toast.loading('Generando Reporte de Compras PDF...');
        try {
            const rangeLabel = (startDate || endDate)
                ? `Período: ${startDate || 'Inicio'} al ${endDate || 'Hoy'}`
                : 'Historial Completo';

            let logoUrl = new URL('/icons/logo.png', window.location.origin).toString();
            if (settings?.empresa_logo_url) {
                if (settings.empresa_logo_url.startsWith('http')) {
                    logoUrl = settings.empresa_logo_url;
                } else {
                    let cleanUrl = settings.empresa_logo_url;
                    if (cleanUrl.startsWith('/uploads')) cleanUrl = '/api' + cleanUrl;
                    else if (cleanUrl.startsWith('uploads')) cleanUrl = '/api/' + cleanUrl;
                    const base = (import.meta.env.VITE_API_URL || 'https://sistema.multirepuestosrg.com/api').replace(/\/api$/, '');
                    logoUrl = `${base}${cleanUrl.startsWith('/') ? '' : '/'}${cleanUrl}`;
                }
            }

            const companyInfo = {
                name: settings?.empresa_nombre || 'Multirepuestos RG',
                ruc: settings?.empresa_ruc || '1211812770001E',
                phone: settings?.empresa_telefono || '84031936 / 84058142',
                address: settings?.empresa_direccion || 'Del portón de la normal 75 varas al este. Juigalpa, Chontales.',
                logo: logoUrl
            };

            const fileName = await generatePurchasesReportPDF({
                companyInfo,
                cliente: analytics.cliente || client,
                kpis,
                compras: filteredCompras,
                periodLabel: rangeLabel
            });
            toast.dismiss(tId);
            toast.success(`PDF generado: ${fileName}`);
        } catch (err) {
            toast.dismiss(tId);
            console.error('Error generando PDF de compras:', err);
            toast.error('No se pudo generar el PDF de compras.');
        }
    };

    const reprintAbonoReceipt = (abono) => {
        const w = window.open('', '_blank', 'width=400,height=600');
        if (!w) return;
        const html = `
          <div style="font-family:'League Spartan','Inter',sans-serif;width:80mm;padding:6px 4px;font-size:9pt;color:#000;">
            <div style="text-align:center;border-bottom:2px solid #000;padding-bottom:6px;margin-bottom:6px;">
              <h1 style="margin:4px 0;font-size:14pt;font-weight:900;">COMPROBANTE DE ABONO #${abono.id_abono}</h1>
            </div>
            <p style="margin:2px 0;display:flex;justify-content:space-between;"><strong>Cliente:</strong><span>${client?.nombre || 'N/A'}</span></p>
            <p style="margin:2px 0;display:flex;justify-content:space-between;"><strong>Fecha:</strong><span>${fmtDateTime(abono.fecha)}</span></p>
            <p style="margin:2px 0;display:flex;justify-content:space-between;"><strong>Destino:</strong><span>${abono.cuenta_destino || 'Cuenta General'}</span></p>
            <p style="margin:2px 0;display:flex;justify-content:space-between;"><strong>Método:</strong><span>${abono.metodo === 'Efectivo' ? 'Normal / Contado' : abono.metodo}</span></p>
            ${abono.referencia ? `<p style="margin:2px 0;display:flex;justify-content:space-between;"><strong>Ref:</strong><span>${abono.referencia}</span></p>` : ''}
            <div style="border-top:2px solid #000;padding-top:8px;margin-top:8px;">
              <p style="display:flex;justify-content:space-between;margin:4px 0;font-size:14pt;font-weight:900;"><strong>MONTO ABONADO:</strong><span>${formatCurrency(abono.monto)}</span></p>
            </div>
          </div>
        `;
        w.document.write(`<!DOCTYPE html><html><head><title>Abono #${abono.id_abono}</title><style>@page{size:80mm auto;margin:0;}body{margin:0;padding:0;}</style></head><body>${html}</body></html>`);
        w.document.close();
        w.focus();
        setTimeout(() => { w.print(); setTimeout(() => w.close(), 400); }, 350);
    };

    const handleCancelAbono = useCallback(async (abonoIdVenta) => {
        if (requireActionPermission && !requireActionPermission('clientes.anular_abono', 'Anular o Cancelar Abono Registrado')) return;
        if (!window.confirm('¿Estás seguro de cancelar este abono? Se restaurará el saldo del cliente y se ajustará la caja.')) return;
        setCancellingId(abonoIdVenta);
        try {
            await api.cancelCreditPayment(client.id_cliente, abonoIdVenta, token);
            toast.success('Abono cancelado exitosamente.');
            await fetchData();
        } catch (err) {
            console.error('Error cancelando abono:', err);
            toast.error(err.message || 'Error al cancelar el abono.');
        } finally {
            setCancellingId(null);
        }
    }, [client, token, fetchData, requireActionPermission]);

    const kpis = analytics?.kpis || {
        total_historico: 0, tickets_historico: 0,
        total_anio: 0, tickets_anio: 0,
        total_mes: 0, tickets_mes: 0,
        total_semana: 0, tickets_semana: 0,
        total_hoy: 0, tickets_hoy: 0,
        total_contado_historico: 0, total_credito_historico: 0, total_abonado_historico: 0,
        rango: { total_comprado: 0, total_contado: 0, total_credito: 0, total_abonado: 0, cantidad_facturas: 0, unidades_compradas: 0, ticket_promedio: 0 }
    };

    const filteredCompras = useMemo(() => {
        const list = analytics?.compras || [];
        return list.filter(c => {
            if (purchaseTypeFilter !== 'ALL' && c.tipo_venta !== purchaseTypeFilter) return false;
            if (productSearch.trim()) {
                const q = productSearch.toLowerCase();
                const matchId = String(c.id_venta).includes(q);
                const matchMethod = (c.metodo_pago || '').toLowerCase().includes(q) || (c.referencia || '').toLowerCase().includes(q);
                const matchProd = (c.productos || []).some(p =>
                    (p.nombre || '').toLowerCase().includes(q) ||
                    (p.codigo || '').toLowerCase().includes(q)
                );
                return matchId || matchMethod || matchProd;
            }
            return true;
        });
    }, [analytics, purchaseTypeFilter, productSearch]);

    const unifiedCuentaGeneral = useMemo(() => {
        const abonosList = (analytics?.abonos || []).map(a => ({
            uid: `abono-${a.id_abono}`,
            kind: 'ABONO',
            id_registro: a.id_abono,
            fecha: new Date(a.fecha),
            monto: Number(a.monto || 0),
            usuario: a.usuario || 'Sistema',
            metodo: a.metodo || 'Efectivo',
            referencia: a.referencia || '',
            esCuentaGeneral: a.esCuentaGeneral,
            cuenta_destino: a.cuenta_destino || 'Cuenta General',
            raw: a
        }));

        const creditosList = (analytics?.compras || [])
            .filter(c => c.tipo_venta === 'CREDITO' && c.estado === 'COMPLETADA')
            .map(c => ({
                uid: `credito-${c.id_venta}`,
                kind: 'CREDITO',
                id_registro: c.id_venta,
                fecha: new Date(c.fecha),
                monto: Number(c.pagoDetalles?.credito || c.total_venta || 0),
                usuario: c.vendedor || 'Sistema',
                metodo: 'Crédito',
                referencia: `Venta #${c.id_venta}`,
                esCuentaGeneral: false,
                cuenta_destino: `Cargo Factura #${c.id_venta}`,
                productos: c.productos || [],
                raw: c
            }));

        return [...abonosList, ...creditosList]
            .filter(item => {
                if (ledgerFilter === 'ABONOS' && item.kind !== 'ABONO') return false;
                if (ledgerFilter === 'CREDITOS' && item.kind !== 'CREDITO') return false;
                if (abonoMethodFilter !== 'ALL') {
                    if (item.kind !== 'ABONO') return false;
                    const m = (item.metodo || '').toLowerCase();
                    if (abonoMethodFilter === 'Efectivo' && (m.includes('transfer') || m.includes('tarjeta'))) return false;
                    if (abonoMethodFilter === 'Transferencia' && !m.includes('transfer')) return false;
                    if (abonoMethodFilter === 'Tarjeta' && !m.includes('tarjeta')) return false;
                }
                return true;
            })
            .sort((a, b) => b.fecha - a.fecha);
    }, [analytics, ledgerFilter, abonoMethodFilter]);

    const creditSummary = useMemo(() => {
        const ticketsPendientes = creditTickets.filter(t => t.saldoRestante > 0).length;
        const ticketsPagados = creditTickets.filter(t => t.saldoRestante <= 0).length;
        return {
            totalCredito: kpis.total_credito_historico,
            totalAbono: kpis.total_abonado_historico,
            ticketsPendientes,
            ticketsPagados
        };
    }, [kpis, creditTickets]);

    const getInitials = (name = '') => {
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
        return (name.slice(0, 2) || 'CL').toUpperCase();
    };

    if (!client) return null;

    return (
        <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <ModalContent
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.97 }}
                transition={{ duration: 0.22 }}
                onClick={e => e.stopPropagation()}
            >
                <Header>
                    <HeaderTopRow>
                        <ClientIdentity>
                            <div className="avatar">{getInitials(client.nombre)}</div>
                            <div>
                                <Title>{client.nombre}</Title>
                                <ClientMetaRow>
                                    <span>ID #{client.id_cliente}</span>
                                    {client.cedula && <span>Cédula/RUC: {client.cedula}</span>}
                                    <span>Tel: {client.telefono || 'Sin registrar'}</span>
                                    <span>Categoría: {client.tipo_cliente || 'General'}</span>
                                    <span>Límite: {client.limite_credito === null ? '∞ Sin Límite' : formatCurrency(client.limite_credito)}</span>
                                </ClientMetaRow>
                            </div>
                        </ClientIdentity>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                            <div style={{ textAlign: 'right', background: Number(client.saldo_pendiente) > 0 ? '#fef2f2' : '#f0fdf4', border: `1px solid ${Number(client.saldo_pendiente) > 0 ? '#fecaca' : '#bbf7d0'}`, padding: '0.45rem 0.95rem', borderRadius: 12 }}>
                                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Saldo Pendiente</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: Number(client.saldo_pendiente) > 0 ? '#dc2626' : '#15803d' }}>
                                    {formatCurrency(client.saldo_pendiente)}
                                </div>
                            </div>
                            <CloseButton onClick={onClose} title="Cerrar ventana">
                                <FaTimes />
                            </CloseButton>
                        </div>
                    </HeaderTopRow>

                    <HeaderToolbar>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginRight: '0.25rem' }}>
                                Estado de Cuenta:
                            </span>
                            <ActionBtn
                                $bg="#1e293b"
                                $color="#ffffff"
                                onClick={() => handlePrint('ALL')}
                                disabled={isFetchingStatement}
                            >
                                <FaFileInvoiceDollar /> Estado Completo
                            </ActionBtn>
                            <ActionBtn
                                $bg="#fef2f2"
                                $color="#dc2626"
                                $border="#fecaca"
                                onClick={() => handlePrint('DEBT')}
                                disabled={isFetchingStatement}
                            >
                                <FaCreditCard /> Facturas Pendientes
                            </ActionBtn>
                            <ActionBtn
                                $bg="#ecfdf5"
                                $color="#059669"
                                $border="#a7f3d0"
                                onClick={() => handlePrint('PAID')}
                                disabled={isFetchingStatement}
                            >
                                <FaMoneyBillWave /> Solo Abonos
                            </ActionBtn>
                        </div>

                        {canViewPurchases && (
                            <ActionBtn
                                $bg="#eff6ff"
                                $color="#2563eb"
                                $border="#bfdbfe"
                                onClick={handlePrintPurchasesReport}
                                disabled={loading}
                            >
                                <FaFilePdf /> Reporte Compras PDF
                            </ActionBtn>
                        )}
                    </HeaderToolbar>
                </Header>

                {/* ─── PESTAÑAS SEGMENTADAS (3 COLUMNAS LIMPIAS SIN SCROLL) ─── */}
                <SegmentedTabsWrapper>
                    <SegmentedGrid>
                        <SegmentedTab
                            type="button"
                            $active={activeTab === 'creditos'}
                            onClick={() => setActiveTab('creditos')}
                        >
                            <FaLandmark /> Cuenta General y Abonos ({(analytics?.abonos || []).length})
                        </SegmentedTab>

                        <SegmentedTab
                            type="button"
                            $active={activeTab === 'compras'}
                            onClick={() => {
                                if (requireActionPermission && !requireActionPermission('clientes.ver_compras', 'Ver Cuánto Nos Ha Comprado el Cliente (Total, Año, Semanal y por Fechas)')) return;
                                setActiveTab('compras');
                            }}
                        >
                            <FaShoppingBag /> Compras (Total / Año / Semanal / Fechas) {!canViewPurchases && '🔒'}
                        </SegmentedTab>

                        <SegmentedTab
                            type="button"
                            $active={activeTab === 'productos'}
                            onClick={() => {
                                if (requireActionPermission && !requireActionPermission('clientes.ver_compras', 'Ver Ranking de Productos Comprados por el Cliente')) return;
                                setActiveTab('productos');
                            }}
                        >
                            <FaTrophy /> Productos Preferidos ({(analytics?.top_productos || []).length}) {!canViewPurchases && '🔒'}
                        </SegmentedTab>
                    </SegmentedGrid>
                </SegmentedTabsWrapper>

                <Body>
                    {loading && (
                        <CenteredMessage>
                            <SpinAnimation size={32} />
                            <p style={{ fontWeight: 700, marginTop: '0.75rem' }}>Cargando información del cliente...</p>
                        </CenteredMessage>
                    )}

                    {error && <CenteredMessage style={{ color: '#dc2626', fontWeight: 700 }}>{error}</CenteredMessage>}

                    {!loading && !error && (
                        <AnimatePresence mode="wait">
                            {/* ════════════════════════════════════════════════════════════════
                               PESTAÑA 1: CUENTA GENERAL, CRÉDITOS Y REGISTRO DE ABONOS
                               ════════════════════════════════════════════════════════════════ */}
                            {activeTab === 'creditos' && (
                                <motion.div
                                    key="tab-creditos"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.18 }}
                                >
                                    <KpiGrid>
                                        <KpiCard $color="#dc2626" $bg="#fef2f2">
                                            <div className="kpi-info">
                                                <span className="kpi-label">Total Crédito Otorgado</span>
                                                <span className="kpi-val">{formatCurrency(creditSummary.totalCredito)}</span>
                                                <span className="kpi-sub">Acumulado histórico</span>
                                            </div>
                                            <div className="kpi-icon"><FaFileInvoiceDollar /></div>
                                        </KpiCard>

                                        <KpiCard $color="#059669" $bg="#ecfdf5">
                                            <div className="kpi-info">
                                                <span className="kpi-label">Total Abonado</span>
                                                <span className="kpi-val">{formatCurrency(creditSummary.totalAbono)}</span>
                                                <span className="kpi-sub">Pagos recibidos</span>
                                            </div>
                                            <div className="kpi-icon"><FaMoneyBillWave /></div>
                                        </KpiCard>

                                        <KpiCard $color="#2563eb" $bg="#eff6ff">
                                            <div className="kpi-info">
                                                <span className="kpi-label">Saldo en Cuenta General</span>
                                                <span className="kpi-val">{formatCurrency(client.saldo_pendiente)}</span>
                                                <span className="kpi-sub">Deuda actual</span>
                                            </div>
                                            <div className="kpi-icon"><FaLandmark /></div>
                                        </KpiCard>

                                        <KpiCard $color={creditSummary.ticketsPendientes > 0 ? '#d97706' : '#059669'} $bg={creditSummary.ticketsPendientes > 0 ? '#fffbeb' : '#ecfdf5'}>
                                            <div className="kpi-info">
                                                <span className="kpi-label">Facturas al Crédito</span>
                                                <span className="kpi-val" style={{ fontSize: '1.15rem' }}>
                                                    {creditSummary.ticketsPendientes > 0
                                                        ? `${creditSummary.ticketsPendientes} Pendiente(s)`
                                                        : 'Todo al Día ✔'}
                                                </span>
                                                <span className="kpi-sub">{creditSummary.ticketsPagados} factura(s) pagada(s)</span>
                                            </div>
                                            <div className="kpi-icon">
                                                {creditSummary.ticketsPendientes > 0 ? <FaClock /> : <FaCheckCircle />}
                                            </div>
                                        </KpiCard>
                                    </KpiGrid>

                                    {/* ─── REGISTRO DE ABONOS Y MOVIMIENTOS DE CUENTA GENERAL (CON ICONOS PROPIOS) ─── */}
                                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.35rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.9rem' }}>
                                            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <FaLandmark style={{ color: '#2563eb' }} /> Registro de Cuenta General y Abonos
                                            </h3>

                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                                <PillBtn $active={ledgerFilter === 'ALL'} onClick={() => setLedgerFilter('ALL')}>
                                                    Todos
                                                </PillBtn>
                                                <PillBtn $active={ledgerFilter === 'ABONOS'} $color="#059669" $bg="#ecfdf5" onClick={() => setLedgerFilter('ABONOS')}>
                                                    Solo Abonos
                                                </PillBtn>
                                                <PillBtn $active={ledgerFilter === 'CREDITOS'} $color="#dc2626" $bg="#fef2f2" onClick={() => setLedgerFilter('CREDITOS')}>
                                                    Solo Créditos
                                                </PillBtn>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '1rem', paddingBottom: '0.85rem', borderBottom: '1px solid #f1f5f9' }}>
                                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                <FaFilter /> Método de abono:
                                            </span>
                                            <PillBtn $active={abonoMethodFilter === 'ALL'} onClick={() => setAbonoMethodFilter('ALL')}>
                                                Todos
                                            </PillBtn>
                                            <PillBtn $active={abonoMethodFilter === 'Efectivo'} $color="#059669" $bg="#ecfdf5" onClick={() => { setLedgerFilter('ABONOS'); setAbonoMethodFilter('Efectivo'); }}>
                                                <FaMoneyBillWave /> Normal / Contado
                                            </PillBtn>
                                            <PillBtn $active={abonoMethodFilter === 'Transferencia'} $color="#2563eb" $bg="#eff6ff" onClick={() => { setLedgerFilter('ABONOS'); setAbonoMethodFilter('Transferencia'); }}>
                                                <FaUniversity /> Transferencia
                                            </PillBtn>
                                            <PillBtn $active={abonoMethodFilter === 'Tarjeta'} $color="#7c3aed" $bg="#f5f3ff" onClick={() => { setLedgerFilter('ABONOS'); setAbonoMethodFilter('Tarjeta'); }}>
                                                <FaCreditCard /> Tarjeta
                                            </PillBtn>
                                        </div>

                                        {unifiedCuentaGeneral.length === 0 ? (
                                            <CenteredMessage>
                                                <FaFileInvoiceDollar size={36} style={{ opacity: 0.35, marginBottom: '0.5rem' }} />
                                                <p style={{ margin: 0 }}>No hay movimientos registrados con estos filtros.</p>
                                            </CenteredMessage>
                                        ) : (
                                            unifiedCuentaGeneral.map(item => {
                                                if (item.kind === 'ABONO') {
                                                    const visual = getPaymentMethodVisual(item.metodo);
                                                    const MethodIcon = visual.icon;
                                                    return (
                                                        <AbonoRowCard
                                                            key={item.uid}
                                                            $accent={visual.color}
                                                            $iconBg={visual.bg}
                                                        >
                                                            <div className="left-part">
                                                                <div className="method-icon-box" title={visual.label}>
                                                                    <MethodIcon />
                                                                </div>
                                                                <div>
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                                        <span style={{ fontWeight: 900, fontSize: '1.1rem', color: '#059669' }}>
                                                                            + {formatCurrency(item.monto)}
                                                                        </span>
                                                                        <MethodBadge $bg={visual.bg} $color={visual.color} $border={visual.border}>
                                                                            <MethodIcon /> {visual.label}
                                                                        </MethodBadge>
                                                                        <MethodBadge
                                                                            $bg={item.esCuentaGeneral ? '#eff6ff' : '#f1f5f9'}
                                                                            $color={item.esCuentaGeneral ? '#1d4ed8' : '#334155'}
                                                                            $border={item.esCuentaGeneral ? '#bfdbfe' : '#cbd5e1'}
                                                                        >
                                                                            {item.esCuentaGeneral ? <><FaLandmark /> Cuenta General</> : <><FaReceipt /> {item.cuenta_destino}</>}
                                                                        </MethodBadge>
                                                                    </div>

                                                                    <div style={{ fontSize: '0.82rem', color: '#334155', marginTop: '4px', fontWeight: 600 }}>
                                                                        Abono #{item.id_registro}
                                                                        {item.referencia ? ` • Ref / Voucher: ${item.referencia}` : ''}
                                                                    </div>
                                                                    <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>
                                                                        {fmtDateTime(item.fecha)} • Registrado por <strong>{item.usuario}</strong>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                                <ActionBtn
                                                                    $bg="#f1f5f9"
                                                                    $color="#0f172a"
                                                                    $border="#cbd5e1"
                                                                    onClick={() => reprintAbonoReceipt(item.raw)}
                                                                >
                                                                    <FaPrint /> Recibo
                                                                </ActionBtn>
                                                                <ActionBtn
                                                                    $bg="#fef2f2"
                                                                    $color="#dc2626"
                                                                    $border="#fecaca"
                                                                    onClick={() => handleCancelAbono(item.id_registro)}
                                                                    disabled={cancellingId === item.id_registro}
                                                                >
                                                                    <FaBan /> {cancellingId === item.id_registro ? '...' : 'Anular'}
                                                                </ActionBtn>
                                                            </div>
                                                        </AbonoRowCard>
                                                    );
                                                }

                                                return (
                                                    <AbonoRowCard
                                                        key={item.uid}
                                                        $accent="#dc2626"
                                                        $iconBg="#fef2f2"
                                                    >
                                                        <div className="left-part">
                                                            <div className="method-icon-box">
                                                                <FaFileInvoiceDollar />
                                                            </div>
                                                            <div>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                                    <span style={{ fontWeight: 900, fontSize: '1.1rem', color: '#dc2626' }}>
                                                                        {formatCurrency(item.monto)}
                                                                    </span>
                                                                    <MethodBadge $bg="#fef2f2" $color="#dc2626" $border="#fecaca">
                                                                        <FaFileInvoiceDollar /> Compra al Crédito (Venta #{item.id_registro})
                                                                    </MethodBadge>
                                                                </div>
                                                                {item.productos && item.productos.length > 0 && (
                                                                    <div style={{ fontSize: '0.8rem', color: '#334155', marginTop: '4px' }}>
                                                                        <strong>Productos:</strong> {item.productos.map(p => `${p.cantidad}x ${p.nombre}`).join(', ')}
                                                                    </div>
                                                                )}
                                                                <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>
                                                                    {fmtDateTime(item.fecha)} • Atendido por <strong>{item.usuario}</strong>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </AbonoRowCard>
                                                );
                                            })
                                        )}
                                    </div>

                                    {/* ─── DESGLOSE POR FACTURA AL CRÉDITO ─── */}
                                    {creditTickets.length > 0 && (
                                        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem' }}>
                                            <h3 style={{ margin: '0 0 0.9rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.05rem', fontWeight: 800 }}>
                                                <FaReceipt style={{ color: '#2563eb' }} /> Estado Individual por Factura al Crédito
                                            </h3>
                                            {creditTickets.map(ticket => {
                                                const pagado = ticket.montoOriginal - ticket.saldoRestante;
                                                const pct = ticket.montoOriginal > 0 ? (pagado / ticket.montoOriginal) * 100 : 0;
                                                return (
                                                    <TicketCardStyled key={ticket.idVenta} $estado={ticket.estado}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                                                <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>
                                                                    Factura / Venta #{ticket.idVenta}
                                                                </span>
                                                                <MethodBadge
                                                                    $bg={ticket.estado === 'PAGADO' ? '#dcfce7' : '#fee2e2'}
                                                                    $color={ticket.estado === 'PAGADO' ? '#15803d' : '#b91c1c'}
                                                                >
                                                                    {ticket.estado}
                                                                </MethodBadge>
                                                            </div>
                                                            <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
                                                                {fmtDate(ticket.fecha)}
                                                            </span>
                                                        </div>

                                                        <ProgressBar $pct={pct}>
                                                            <div className="fill" style={{ width: `${Math.min(100, pct)}%` }} />
                                                        </ProgressBar>

                                                        <div style={{ display: 'flex', gap: '1.75rem', flexWrap: 'wrap', fontSize: '0.85rem', marginTop: '0.45rem' }}>
                                                            <div>
                                                                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Monto Original</div>
                                                                <div style={{ fontWeight: 800 }}>{formatCurrency(ticket.montoOriginal)}</div>
                                                            </div>
                                                            <div>
                                                                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Abonado</div>
                                                                <div style={{ fontWeight: 800, color: '#059669' }}>{formatCurrency(pagado)}</div>
                                                            </div>
                                                            <div>
                                                                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Saldo Pendiente</div>
                                                                <div style={{ fontWeight: 800, color: ticket.saldoRestante > 0 ? '#dc2626' : '#059669' }}>
                                                                    {formatCurrency(ticket.saldoRestante)}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Progreso</div>
                                                                <div style={{ fontWeight: 800 }}>{Math.round(pct)}%</div>
                                                            </div>
                                                        </div>
                                                    </TicketCardStyled>
                                                );
                                            })}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* ════════════════════════════════════════════════════════════════
                               PESTAÑA 2: COMPRAS (TOTAL / AÑO / SEMANAL / DE FECHA A FECHA)
                               ════════════════════════════════════════════════════════════════ */}
                            {activeTab === 'compras' && canViewPurchases && (
                                <motion.div
                                    key="tab-compras"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.18 }}
                                >
                                    <KpiGrid>
                                        <KpiCard $color="#2563eb" $bg="#eff6ff">
                                            <div className="kpi-info">
                                                <span className="kpi-label">Total Histórico Comprado</span>
                                                <span className="kpi-val">{formatCurrency(kpis.total_historico)}</span>
                                                <span className="kpi-sub">{kpis.tickets_historico} facturas en total</span>
                                            </div>
                                            <div className="kpi-icon"><FaTrophy /></div>
                                        </KpiCard>

                                        <KpiCard $color="#7c3aed" $bg="#f5f3ff">
                                            <div className="kpi-info">
                                                <span className="kpi-label">Comprado Este Año ({new Date().getFullYear()})</span>
                                                <span className="kpi-val">{formatCurrency(kpis.total_anio)}</span>
                                                <span className="kpi-sub">{kpis.tickets_anio} compras este año</span>
                                            </div>
                                            <div className="kpi-icon"><FaCalendarAlt /></div>
                                        </KpiCard>

                                        <KpiCard $color="#0891b2" $bg="#ecfeff">
                                            <div className="kpi-info">
                                                <span className="kpi-label">Comprado Este Mes</span>
                                                <span className="kpi-val">{formatCurrency(kpis.total_mes)}</span>
                                                <span className="kpi-sub">{kpis.tickets_mes} compras este mes</span>
                                            </div>
                                            <div className="kpi-icon"><FaChartLine /></div>
                                        </KpiCard>

                                        <KpiCard $color="#059669" $bg="#ecfdf5">
                                            <div className="kpi-info">
                                                <span className="kpi-label">Comprado Esta Semana</span>
                                                <span className="kpi-val">{formatCurrency(kpis.total_semana)}</span>
                                                <span className="kpi-sub">{kpis.tickets_semana} compras esta semana</span>
                                            </div>
                                            <div className="kpi-icon"><FaShoppingBag /></div>
                                        </KpiCard>
                                    </KpiGrid>

                                    <FilterPanel>
                                        <FilterRow>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
                                                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                    <FaCalendarAlt style={{ color: '#2563eb' }} /> De fecha a fecha:
                                                </span>
                                                <DateInput
                                                    type="date"
                                                    value={startDate}
                                                    onChange={e => { setStartDate(e.target.value); setActivePeriodPreset('CUSTOM'); }}
                                                />
                                                <span style={{ fontWeight: 700, color: '#64748b' }}>a</span>
                                                <DateInput
                                                    type="date"
                                                    value={endDate}
                                                    onChange={e => { setEndDate(e.target.value); setActivePeriodPreset('CUSTOM'); }}
                                                />
                                            </div>

                                            <QuickPeriodGroup>
                                                <PillBtn $active={activePeriodPreset === 'ALL'} onClick={() => applyPeriodPreset('ALL')}>Todo</PillBtn>
                                                <PillBtn $active={activePeriodPreset === 'TODAY'} onClick={() => applyPeriodPreset('TODAY')}>Hoy</PillBtn>
                                                <PillBtn $active={activePeriodPreset === 'WEEK'} onClick={() => applyPeriodPreset('WEEK')}>Esta Semana</PillBtn>
                                                <PillBtn $active={activePeriodPreset === 'MONTH'} onClick={() => applyPeriodPreset('MONTH')}>Este Mes</PillBtn>
                                                <PillBtn $active={activePeriodPreset === 'YEAR'} onClick={() => applyPeriodPreset('YEAR')}>Este Año</PillBtn>
                                            </QuickPeriodGroup>
                                        </FilterRow>

                                        <FilterRow>
                                            <SearchBox>
                                                <FaSearch style={{ color: '#64748b' }} />
                                                <input
                                                    type="text"
                                                    placeholder="Buscar producto comprado (nombre o código), # de factura o referencia..."
                                                    value={productSearch}
                                                    onChange={e => setProductSearch(e.target.value)}
                                                />
                                            </SearchBox>

                                            <QuickPeriodGroup>
                                                <PillBtn $active={purchaseTypeFilter === 'ALL'} onClick={() => setPurchaseTypeFilter('ALL')}>
                                                    Todas ({(analytics?.compras || []).length})
                                                </PillBtn>
                                                <PillBtn $active={purchaseTypeFilter === 'CONTADO'} $color="#059669" $bg="#ecfdf5" onClick={() => setPurchaseTypeFilter('CONTADO')}>
                                                    <FaMoneyBillWave /> Contado
                                                </PillBtn>
                                                <PillBtn $active={purchaseTypeFilter === 'CREDITO'} $color="#d97706" $bg="#fffbeb" onClick={() => setPurchaseTypeFilter('CREDITO')}>
                                                    <FaFileInvoiceDollar /> Crédito
                                                </PillBtn>
                                            </QuickPeriodGroup>
                                        </FilterRow>
                                    </FilterPanel>

                                    <RangeSummaryStrip>
                                        <div className="metric">
                                            <span className="lbl">Comprado en Rango</span>
                                            <span className="val" style={{ color: '#2563eb' }}>{formatCurrency(kpis.rango?.total_comprado)}</span>
                                        </div>
                                        <div className="metric">
                                            <span className="lbl">Compras Contado</span>
                                            <span className="val" style={{ color: '#059669' }}>{formatCurrency(kpis.rango?.total_contado)}</span>
                                        </div>
                                        <div className="metric">
                                            <span className="lbl">Compras Crédito</span>
                                            <span className="val" style={{ color: '#d97706' }}>{formatCurrency(kpis.rango?.total_credito)}</span>
                                        </div>
                                        <div className="metric">
                                            <span className="lbl">Abonos en Rango</span>
                                            <span className="val" style={{ color: '#0d9488' }}>{formatCurrency(kpis.rango?.total_abonado)}</span>
                                        </div>
                                        <div className="metric">
                                            <span className="lbl">Facturas / Unidades</span>
                                            <span className="val">{kpis.rango?.cantidad_facturas || 0} fact. ({kpis.rango?.unidades_compradas || 0} uds)</span>
                                        </div>
                                        <div className="metric">
                                            <span className="lbl">Ticket Promedio</span>
                                            <span className="val">{formatCurrency(kpis.rango?.ticket_promedio)}</span>
                                        </div>
                                    </RangeSummaryStrip>

                                    {filteredCompras.length === 0 ? (
                                        <CenteredMessage>
                                            <FaBoxOpen size={42} style={{ opacity: 0.4, marginBottom: '0.5rem' }} />
                                            <h3 style={{ margin: '0 0 0.25rem', color: '#334155' }}>No hay compras en este rango</h3>
                                            <p style={{ margin: 0 }}>Prueba cambiando las fechas o pulsando "Todo".</p>
                                        </CenteredMessage>
                                    ) : (
                                        <>
                                            {filteredCompras.slice(0, visiblePurchasesCount).map(compra => {
                                                const visual = getPaymentMethodVisual(compra.metodo_pago);
                                                const MethodIcon = visual.icon;
                                                return (
                                                    <PurchaseCard key={compra.id_venta} $tipo={compra.tipo_venta}>
                                                        <PurchaseHeaderRow>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                                                                <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>
                                                                    Factura #{compra.id_venta}
                                                                </span>
                                                                <MethodBadge
                                                                    $bg={compra.tipo_venta === 'CREDITO' ? '#fef3c7' : compra.tipo_venta === 'DEVOLUCION' ? '#fee2e2' : '#dcfce7'}
                                                                    $color={compra.tipo_venta === 'CREDITO' ? '#b45309' : compra.tipo_venta === 'DEVOLUCION' ? '#b91c1c' : '#15803d'}
                                                                >
                                                                    {compra.tipo_venta}
                                                                </MethodBadge>
                                                                <MethodBadge $bg={visual.bg} $color={visual.color} $border={visual.border}>
                                                                    <MethodIcon /> {visual.label}
                                                                    {compra.referencia ? ` • Ref: ${compra.referencia}` : ''}
                                                                </MethodBadge>
                                                                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                                                    {fmtDateTime(compra.fecha)} • <FaUser size={11} /> <strong>{compra.vendedor}</strong>
                                                                </span>
                                                            </div>

                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto' }}>
                                                                <div style={{ textAlign: 'right' }}>
                                                                    {compra.descuento > 0 && (
                                                                        <div style={{ fontSize: '0.74rem', color: '#dc2626', fontWeight: 700 }}>
                                                                            Desc: -{formatCurrency(compra.descuento)}
                                                                        </div>
                                                                    )}
                                                                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>
                                                                        {formatCurrency(compra.total_venta)}
                                                                    </div>
                                                                </div>
                                                                <ActionBtn
                                                                    $bg="#eff6ff"
                                                                    $color="#2563eb"
                                                                    $border="#bfdbfe"
                                                                    onClick={() => setTicketToPrint({
                                                                        id: compra.id_venta,
                                                                        id_venta: compra.id_venta,
                                                                        fecha: compra.fecha,
                                                                        totalVenta: compra.total_venta,
                                                                        total_venta: compra.total_venta,
                                                                        subtotal: compra.subtotal,
                                                                        descuento: compra.descuento,
                                                                        clientId: client.id_cliente,
                                                                        id_cliente: client.id_cliente,
                                                                        userId: compra.id_usuario,
                                                                        id_usuario: compra.id_usuario,
                                                                        pagoDetalles: compra.pagoDetalles,
                                                                        items: (compra.productos || []).map(p => ({
                                                                            id_producto: p.id_producto,
                                                                            codigo: p.codigo,
                                                                            nombre: p.nombre,
                                                                            quantity: p.cantidad,
                                                                            cantidad: p.cantidad,
                                                                            precio_venta: p.precio_unitario,
                                                                            precio_unitario: p.precio_unitario
                                                                        }))
                                                                    })}
                                                                >
                                                                    <FaPrint /> Ticket
                                                                </ActionBtn>
                                                            </div>
                                                        </PurchaseHeaderRow>

                                                        {compra.productos && compra.productos.length > 0 && (
                                                            <ProductsTable>
                                                                <thead>
                                                                    <tr>
                                                                        <th>Código</th>
                                                                        <th>Producto Comprado</th>
                                                                        <th style={{ textAlign: 'center' }}>Cant.</th>
                                                                        <th style={{ textAlign: 'right' }}>P. Unitario</th>
                                                                        <th style={{ textAlign: 'right' }}>Subtotal</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {compra.productos.map((prod, idx) => (
                                                                        <tr key={`${compra.id_venta}-p-${idx}`}>
                                                                            <td style={{ fontWeight: 600, color: '#64748b' }}>{prod.codigo || '—'}</td>
                                                                            <td style={{ fontWeight: 700, color: '#0f172a' }}>{prod.nombre}</td>
                                                                            <td style={{ textAlign: 'center', fontWeight: 800 }}>{prod.cantidad}</td>
                                                                            <td style={{ textAlign: 'right' }}>{formatCurrency(prod.precio_unitario)}</td>
                                                                            <td style={{ textAlign: 'right', fontWeight: 800 }}>{formatCurrency(prod.subtotal)}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </ProductsTable>
                                                        )}
                                                    </PurchaseCard>
                                                );
                                            })}

                                            {filteredCompras.length > visiblePurchasesCount && (
                                                <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                                                    <PillBtn
                                                        $active
                                                        onClick={() => setVisiblePurchasesCount(prev => prev + 50)}
                                                        style={{ padding: '0.65rem 1.4rem', fontSize: '0.88rem' }}
                                                    >
                                                        Mostrar más compras ({filteredCompras.length - visiblePurchasesCount} restantes)
                                                    </PillBtn>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </motion.div>
                            )}

                            {/* ════════════════════════════════════════════════════════════════
                               PESTAÑA 3: PRODUCTOS QUE MÁS COMPRA ESTE CLIENTE
                               ════════════════════════════════════════════════════════════════ */}
                            {activeTab === 'productos' && canViewPurchases && (
                                <motion.div
                                    key="tab-productos"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.18 }}
                                    style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem' }}
                                >
                                    <h3 style={{ margin: '0 0 1rem', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <FaTrophy style={{ color: '#f59e0b' }} /> Productos Preferidos por {client.nombre}
                                    </h3>

                                    {(!analytics?.top_productos || analytics.top_productos.length === 0) ? (
                                        <CenteredMessage>
                                            <FaLayerGroup size={38} style={{ opacity: 0.4 }} />
                                            <p>No hay productos registrados para este cliente en el período seleccionado.</p>
                                        </CenteredMessage>
                                    ) : (
                                        <ProductsTable style={{ marginTop: 0 }}>
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Código</th>
                                                    <th>Producto</th>
                                                    <th style={{ textAlign: 'center' }}>Facturas</th>
                                                    <th style={{ textAlign: 'center' }}>Unidades Totales</th>
                                                    <th style={{ textAlign: 'right' }}>Total Comprado</th>
                                                    <th>Última Compra</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {analytics.top_productos.map((p, i) => (
                                                    <tr key={`${p.id_producto || p.nombre}-${i}`}>
                                                        <td style={{ fontWeight: 900, color: i < 3 ? '#d97706' : '#64748b' }}>#{i + 1}</td>
                                                        <td style={{ fontWeight: 600, color: '#64748b' }}>{p.codigo || '—'}</td>
                                                        <td style={{ fontWeight: 700, color: '#0f172a' }}>{p.nombre}</td>
                                                        <td style={{ textAlign: 'center', fontWeight: 700 }}>{p.veces_comprado}</td>
                                                        <td style={{ textAlign: 'center', fontWeight: 800, color: '#2563eb' }}>{p.unidades_totales} uds</td>
                                                        <td style={{ textAlign: 'right', fontWeight: 800, color: '#059669' }}>{formatCurrency(p.monto_total)}</td>
                                                        <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{fmtDate(p.ultima_vez)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </ProductsTable>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </Body>
            </ModalContent>

            {ticketToPrint && (
                <TicketModal
                    isOpen={true}
                    transaction={ticketToPrint}
                    onClose={() => setTicketToPrint(null)}
                    clients={clients || [client]}
                    users={allUsers}
                />
            )}

            {statementData && (
                <StatementModal
                    statementData={statementData}
                    filterType={statementFilter}
                    onClose={() => setStatementData(null)}
                />
            )}
        </ModalOverlay>
    );
}

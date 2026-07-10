import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Link } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import {
    FaArrowLeft, FaPlus, FaSearch, FaFileInvoiceDollar,
    FaCalendarAlt, FaCheckCircle, FaExclamationCircle, FaClock,
    FaMoneyBillWave, FaBuilding, FaList, FaTrashAlt, FaTimes, FaStore,
    FaFilter, FaReceipt, FaEdit, FaEye, FaFilePdf, FaUpload
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { rankItems } from '../utils/searchEngine';
import * as api from '../service/api';
import { API_URL } from '../service/api';

// --- HELPERS DE FECHA (ZONA MANAGUA) ---
const getTodayManaguaISO = () => {
    return new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Managua' });
};

const formatDateManagua = (isoString) => {
    if (!isoString) return '—';
    const date = new Date(isoString.includes('T') ? isoString : `${isoString}T12:00:00`);
    return new Intl.DateTimeFormat('es-NI', {
        timeZone: 'America/Managua',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
};

// --- ANIMACIONES ---
const fadeIn = keyframes`from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); }`;
const scaleIn = keyframes`from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; }`;

// --- ESTILOS RESPONSIVOS Y MODERNOS ---
const PageWrapper = styled.div`
    padding: clamp(1rem, 3vw, 2.5rem); 
    background: #f8fafc;
    min-height: 100vh; 
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    animation: ${fadeIn} 0.5s ease-out;
`;

const HeaderContainer = styled.div`
    display: flex; 
    justify-content: space-between; 
    align-items: flex-start; 
    margin-bottom: 2rem; 
    flex-wrap: wrap; 
    gap: 1.5rem;
`;

const TitleSection = styled.div`
    display: flex;
    flex-direction: column;
`;

const Title = styled.h1`
    font-size: clamp(1.8rem, 2.5vw, 2.2rem); 
    color: #0f172a; 
    display: flex; 
    align-items: center; 
    gap: 0.75rem; 
    margin: 0; 
    font-weight: 900;
    letter-spacing: -0.03em;
    
    svg { color: #0f172a; }
`;

const Subtitle = styled.p`
    color: #64748b;
    margin: 0.5rem 0 0 0;
    font-size: 1rem;
    font-weight: 500;
`;

const ActionButtons = styled.div`
    display: flex; 
    gap: 0.75rem;
    flex-wrap: wrap;
    
    @media (max-width: 600px) {
        width: 100%;
        button, a { flex: 1; justify-content: center; }
    }
`;

const Button = styled.button`
    padding: 0.75rem 1.25rem; 
    border: none; 
    border-radius: 12px; 
    font-weight: 600; 
    font-size: 0.95rem;
    cursor: pointer; 
    display: flex; 
    align-items: center; 
    justify-content: center;
    gap: 0.5rem; 
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    
    ${props => props.$primary && css`
        background: #0f172a;
        color: white;
        box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.3);
        &:hover { background: #1e293b; transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.4); }
    `}

    ${props => props.$secondary && css`
        background: white;
        color: #334155;
        border: 1px solid #e2e8f0;
        &:hover { background: #f1f5f9; border-color: #cbd5e1; transform: translateY(-1px); }
    `}

    ${props => props.$danger && css`
        background: #fee2e2;
        color: #ef4444;
        &:hover { background: #fecaca; transform: scale(1.05); }
    `}

    ${props => props.$success && css`
        background: #dcfce7;
        color: #15803d;
        &:hover { background: #bbf7d0; transform: translateY(-1px); }
    `}

    &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
`;

const BackButton = styled(Link)`
    padding: 0.75rem 1.25rem; 
    background: white; 
    color: #475569; 
    border: 1px solid #e2e8f0;
    border-radius: 12px; 
    font-weight: 600; 
    text-decoration: none; 
    display: flex; 
    align-items: center; 
    gap: 0.5rem; 
    transition: all 0.2s;
    font-size: 0.95rem;
    &:hover { background: #f8fafc; color: #0f172a; transform: translateY(-1px); }
`;

// --- STATS CARDS (KPIs) ---
const StatsGrid = styled.div`
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); 
    gap: 1.5rem; 
    margin-bottom: 2.5rem;
`;

const StatCard = styled.div`
    background: white; 
    padding: 1.5rem; 
    border-radius: 20px; 
    border: 1px solid rgba(226, 232, 240, 0.8);
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); 
    position: relative; 
    overflow: hidden;
    transition: transform 0.2s;
    
    &:hover { transform: translateY(-4px); box-shadow: 0 15px 25px -5px rgba(0,0,0,0.05); }
    
    &::before { 
        content: ''; position: absolute; top: 0; left: 0; width: 6px; height: 100%; 
        background: ${props => props.color}; 
    }

    .icon-wrapper {
        width: 44px; height: 44px; border-radius: 12px; background: ${props => props.bg}; 
        display: flex; align-items: center; justify-content: center; 
        color: ${props => props.color}; font-size: 1.25rem; margin-bottom: 0.75rem;
    }

    .label { font-size: 0.8rem; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    .value { font-size: 1.8rem; font-weight: 800; color: #0f172a; margin: 0.25rem 0; letter-spacing: -0.03em; }
    .sub { font-size: 0.85rem; color: #64748b; font-weight: 500; }
`;

// --- TOTALS BAR ---
const TotalsSummaryBar = styled.div`
    background: #0f172a;
    color: white;
    padding: 1.25rem 2rem;
    border-radius: 20px;
    margin-bottom: 2rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    gap: 1.5rem;
    box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.15);
    animation: ${fadeIn} 0.4s ease-out;

    .summary-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;

        .summary-label {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #94a3b8;
            font-weight: 600;
            margin-bottom: 0.25rem;
        }

        .summary-value {
            font-size: 1.4rem;
            font-weight: 800;
            letter-spacing: -0.02em;
        }

        &.highlight .summary-value {
            color: #38bdf8;
        }
        &.danger .summary-value {
            color: #f87171;
        }
        &.success .summary-value {
            color: #4ade80;
        }
    }

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;
        .summary-item {
            flex-direction: row;
            justify-content: space-between;
            border-bottom: 1px solid #1e293b;
            padding-bottom: 0.75rem;
            width: 100%;
            &:last-child { border-bottom: none; padding-bottom: 0; }
        }
    }
`;

// --- MODAL BASE ---
const ModalOverlay = styled.div`
    position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
    background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(4px); 
    display: flex; justify-content: center; align-items: center; z-index: 1200; 
    animation: ${fadeIn} 0.2s;
`;

const ModalContent = styled.div`
    background: white; padding: 2.5rem; border-radius: 24px; 
    width: 95%; max-width: ${props => props.$large ? '700px' : '550px'}; 
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); 
    animation: ${scaleIn} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    max-height: 90vh; overflow-y: auto;
    position: relative;
    
    h2 { margin: 0 0 1.5rem 0; color: #0f172a; font-size: 1.6rem; font-weight: 800; letter-spacing: -0.025em; }
`;

const FormGroup = styled.div`
    margin-bottom: 1.25rem;
    label { display: block; font-size: 0.92rem; color: #475569; margin-bottom: 0.5rem; font-weight: 600; }
    input, select, textarea { 
        width: 100%; padding: 0.9rem 1rem; border: 1px solid #cbd5e1; border-radius: 12px; 
        font-size: 1rem; color: #0f172a; background: #fff; transition: all 0.2s; 
        &:focus { outline: none; border-color: #0f172a; box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.08); }
        &::placeholder { color: #94a3b8; }
    }
`;

const CloseButton = styled.button`
    position: absolute; top: 1.5rem; right: 1.5rem; 
    background: #f1f5f9; border-radius:50%; width:32px; height:32px; 
    border: none; color: #64748b; font-size: 1rem; cursor: pointer; display:grid; place-items:center;
    transition: all 0.2s;
    &:hover { color: #ef4444; background: #fee2e2; }
`;

// --- TOOLBAR ---
const Toolbar = styled.div`
    background: white; padding: 1.25rem; border-radius: 20px;
    border: 1px solid #e2e8f0; display: flex; flex-direction: column; 
    gap: 1.25rem; margin-bottom: 2rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.01);
`;

const FilterTabs = styled.div`
    display: flex; gap: 0.75rem; overflow-x: auto; padding-bottom: 0.5rem;
    border-bottom: 1px solid #f1f5f9;
    &::-webkit-scrollbar { height: 4px; }
    &::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
`;

const TabButton = styled.button`
    padding: 0.65rem 1.25rem; border-radius: 12px; border: none; 
    font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.6rem; 
    transition: all 0.2s; font-size: 0.92rem; white-space: nowrap;

    background: ${props => props.active ? props.activeBg : 'transparent'};
    color: ${props => props.active ? props.activeColor : '#64748b'};
    
    &:hover { background: ${props => props.active ? props.activeBg : '#f8fafc'}; color: ${props => props.active ? props.activeColor : '#334155'}; }

    .badge {
        background: ${props => props.active ? props.activeColor : '#e2e8f0'};
        color: ${props => props.active ? 'white' : '#64748b'};
        padding: 0.15rem 0.6rem; border-radius: 99px; font-size: 0.75rem; 
        font-weight: 800; min-width: 24px; text-align: center;
    }
`;

// --- TABLES & CONTAINERS ---
const BISummaryContainer = styled.div`
    background: white; border-radius: 24px; border: 1px solid #e2e8f0; overflow: hidden;
    animation: ${fadeIn} 0.4s ease-out; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
`;

const BITable = styled.table`
    width: 100%; border-collapse: collapse; text-align: left;
    th { background: #f8fafc; padding: 1rem 1.5rem; font-size: 0.85rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #f1f5f9; }
    td { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; color: #334155; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #fbfcfd; }
    .provider-name { font-weight: 800; color: #0f172a; }
    .amount { font-family: 'Inter', sans-serif; font-weight: 700; text-align: right; }
    .count-badge { background: #e2e8f0; color: #475569; padding: 2px 8px; border-radius: 6px; font-weight: 800; font-size: 0.8rem; }
`;

const BISummaryHeader = styled.div`
    padding: 1.5rem 2rem; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;
    h3 { margin: 0; font-size: 1.25rem; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 0.75rem; }
    .date-range { font-size: 0.9rem; color: #64748b; font-weight: 600; background: #f1f5f9; padding: 0.4rem 1rem; border-radius: 99px; }
`;

const SearchAndFilters = styled.div`
    display: flex; flex-wrap: wrap; gap: 1rem; justify-content: space-between;
`;

const SearchContainer = styled.div`
    position: relative; min-width: 250px; flex: 2;
    svg { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #94a3b8; }
    input {
        width: 100%; padding: 0.75rem 1rem 0.75rem 2.8rem;
        border: 1px solid #e2e8f0; border-radius: 12px; font-size: 0.95rem;
        &:focus { outline: none; border-color: #0f172a; box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.05); }
    }
`;

const FilterGroup = styled.div`
    min-width: 130px; flex: 1;
    display: flex; flex-direction: column; gap: 0.4rem;
    label { font-size: 0.8rem; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    select, input {
        width: 100%; padding: 0.7rem 1rem; border: 1px solid #e2e8f0; border-radius: 12px; 
        font-size: 0.92rem; background: #fff; color: #334155;
        &:focus { border-color: #0f172a; outline: none; }
    }
`;

// --- INVOICE CARD ---
const InvoicesGrid = styled.div`
    display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1.5rem;
`;

const InvoiceCard = styled.div`
    background: white; border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); display: flex; flex-direction: column;
    
    &:hover { 
        transform: translateY(-5px); 
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05); 
        border-color: #cbd5e1;
    }

    .card-header {
        padding: 1.5rem; background: linear-gradient(to bottom, #ffffff, #f8fafc);
        border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: flex-start;
    }
    .provider-info h3 { margin: 0; font-size: 1.1rem; color: #0f172a; font-weight: 800; line-height: 1.3; }
    .invoice-number { font-size: 0.85rem; color: #475569; font-family: 'Monaco', monospace; background: #e2e8f0; padding: 4px 8px; border-radius: 6px; margin-top: 0.5rem; display: inline-block; }

    .card-body { padding: 1.5rem; flex: 1; }
    
    .meta-row {
        display: flex; justify-content: space-between; margin-bottom: 0.8rem; font-size: 0.92rem;
        .label { color: #64748b; display: flex; align-items: center; gap: 0.5rem; font-weight: 500; }
        .value { font-weight: 700; color: #334155; }
    }

    .financial-block { margin-top: 1.5rem; padding-top: 1rem; border-top: 2px dashed #f1f5f9; }
    .total-row {
        display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.75rem;
        .label { font-size: 0.85rem; font-weight: 700; color: #64748b; text-transform: uppercase; }
        .amount { font-size: 1.75rem; font-weight: 900; color: #0f172a; }
    }

    .progress-bar {
        height: 8px; background: #f1f5f9; border-radius: 99px; overflow: hidden; margin-bottom: 0.75rem;
        div { height: 100%; border-radius: 99px; transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
    }

    .balance-text { font-size: 0.9rem; text-align: right; color: #64748b; font-weight: 500; }
    .balance-text strong { color: ${props => props.balanceColor}; font-weight: 800; }

    .card-footer {
        padding: 1rem 1.5rem; background: #f8fafc; border-top: 1px solid #f1f5f9;
        display: flex; gap: 0.75rem;
    }
`;

const StatusBadge = styled.span`
    padding: 0.4rem 1rem; border-radius: 99px; font-size: 0.75rem; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase;
    background: ${props => props.bg}; color: ${props => props.text}; box-shadow: 0 1px 2px rgba(0,0,0,0.05);
`;

const Alert = ({ info, onClose }) => {
    if (!info.show) return null;
    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent style={{ maxWidth: '400px', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', color: info.type === 'error' ? '#ef4444' : (info.type === 'success' ? '#16a34a' : '#0f172a') }}>
                    {info.type === 'error' ? <FaTimes style={{ border: '3px solid', borderRadius: '50%', padding: 5 }} /> :
                        info.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
                </div>
                <h2>{info.title}</h2>
                <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '2rem' }}>{info.message}</p>
                <Button $primary onClick={onClose} style={{ margin: '0 auto', width: '100%' }}>Entendido</Button>
            </ModalContent>
        </ModalOverlay>
    );
};

// --- FILE INPUT STYLE ---
const FileUploadContainer = styled.div`
    border: 2px dashed #cbd5e1;
    border-radius: 12px;
    padding: 1.5rem;
    text-align: center;
    background: #f8fafc;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;

    &:hover {
        border-color: #0f172a;
        background: #f1f5f9;
    }

    input {
        position: absolute;
        top: 0; left: 0; width: 100%; height: 100%;
        opacity: 0;
        cursor: pointer;
    }

    .upload-icon {
        font-size: 2rem;
        color: #64748b;
        margin-bottom: 0.5rem;
    }

    .file-details {
        font-size: 0.9rem;
        color: #475569;
        font-weight: 600;
    }
`;

// =================================================================
// COMPONENTE PRINCIPAL: FacturasProveedores
// =================================================================
const FacturasProveedores = () => {
    const { token } = useAuth();

    // --- ESTADOS ---
    const [invoices, setInvoices] = useState([]);
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    
    // Filtros principales
    const [filter, setFilter] = useState('PENDIENTE');
    const [sortBy, setSortBy] = useState('vencimiento_asc');
    const [searchTerm, setSearchTerm] = useState('');

    // Filtros avanzados
    const [filterProvider, setFilterProvider] = useState('');
    const [filterDateFrom, setFilterDateFrom] = useState('');
    const [filterDateTo, setFilterDateTo] = useState('');
    const [filterTipoCompra, setFilterTipoCompra] = useState(''); // CREDITO, CONTADO, ""
    const [filterMetodoPago, setFilterMetodoPago] = useState(''); // EFECTIVO, TARJETA, TRANSFERENCIA, CHEQUE, ""

    // Modales
    const [alertInfo, setAlertInfo] = useState({ show: false, title: '', message: '', type: 'info' });
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showPayModal, setShowPayModal] = useState(false);
    const [showEditPayModal, setShowEditPayModal] = useState(false); // NUEVO
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [showGlobalHistory, setShowGlobalHistory] = useState(false);
    
    // Historial
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [historyData, setHistoryData] = useState([]);
    const [globalHistoryData, setGlobalHistoryData] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [selectedAbono, setSelectedAbono] = useState(null); // NUEVO

    // Adjuntos
    const [attachmentFile, setAttachmentFile] = useState(null);
    const [attachmentProcessing, setAttachmentProcessing] = useState(false);
    const [attachmentData, setAttachmentData] = useState({ base64: null, name: null });

    // Formularios
    const [formData, setFormData] = useState({
        proveedor: '',
        numero_factura: '',
        fecha_emision: getTodayManaguaISO(),
        fecha_vencimiento: '',
        monto_total: '',
        notas: '',
        tipo_compra: 'CREDITO',
        metodo_pago: 'EFECTIVO',
        referencia: ''
    });

    const [payData, setPayData] = useState({ amount: '', reference: '', method: 'EFECTIVO' });
    const [editPayData, setEditPayData] = useState({ amount: '', reference: '', method: 'EFECTIVO' }); // NUEVO

    // --- HELPER ALERTAS ---
    const showAlert = (title, message, type = 'info') => {
        setAlertInfo({ show: true, title, message, type });
    };

    // --- HELPER IMAGEN A PDF EN EL CLIENTE ---
    const processFileAsPdf = (file) => {
        return new Promise((resolve, reject) => {
            if (file.type === 'application/pdf') {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve({ base64: reader.result, name: file.name });
                reader.onerror = (err) => reject(err);
            } else if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = (e) => {
                    const img = new Image();
                    img.src = e.target.result;
                    img.onload = () => {
                        // Comprimir y redimensionar la imagen si es muy grande
                        const maxDim = 1200;
                        let width = img.width;
                        let height = img.height;
                        if (width > maxDim || height > maxDim) {
                            if (width > height) {
                                height = Math.round((height * maxDim) / width);
                                width = maxDim;
                            } else {
                                width = Math.round((width * maxDim) / height);
                                height = maxDim;
                            }
                        }

                        const canvas = document.createElement('canvas');
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);

                        // Exportar a JPEG con 70% de calidad para ahorrar espacio
                        const compressedImgUrl = canvas.toDataURL('image/jpeg', 0.7);

                        const orientation = width > height ? 'l' : 'p';
                        const pdf = new jsPDF({
                            orientation: orientation,
                            unit: 'px',
                            format: [width, height]
                        });
                        pdf.addImage(compressedImgUrl, 'JPEG', 0, 0, width, height);
                        const pdfBase64 = pdf.output('datauristring');
                        const newFilename = file.name.substring(0, file.name.lastIndexOf('.')) + '.pdf';
                        resolve({ base64: pdfBase64, name: newFilename });
                    };
                    img.onerror = (err) => reject(err);
                };
                reader.onerror = (err) => reject(err);
            } else {
                reject(new Error('Formato de archivo no soportado. Sube una Imagen o un PDF.'));
            }
        });
    };

    const handleFileSelection = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setAttachmentProcessing(true);
        setAttachmentFile(file);
        try {
            const processed = await processFileAsPdf(file);
            setAttachmentData(processed);
        } catch (err) {
            console.error(err);
            showAlert("Archivo inválido", err.message || "No se pudo procesar el archivo.", "error");
            setAttachmentFile(null);
            setAttachmentData({ base64: null, name: null });
        } finally {
            setAttachmentProcessing(false);
        }
    };

    // --- RESOLVER URL ABSOLUTA DE COMPROBANTES ---
    const resolveFileUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http') || url.startsWith('data:')) return url;
        let cleanUrl = url;
        if (url.startsWith('/uploads')) {
            cleanUrl = '/api' + url;
        } else if (url.startsWith('uploads')) {
            cleanUrl = '/api/' + url;
        }
        const base = (import.meta.env.VITE_API_URL || 'https://sistema.multirepuestosrg.com/api').replace(/\/api$/, '');
        return `${base}${cleanUrl.startsWith('/') ? '' : '/'}${cleanUrl}`;
    };

    // --- CARGAR DATOS ---
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const params = {};
                if (filterDateFrom) params.startDate = filterDateFrom;
                if (filterDateTo) params.endDate = filterDateTo;
                if (filterProvider) params.proveedor = filterProvider;

                const invResponse = await api.fetchProviderInvoices(token, Object.keys(params).length ? params : undefined);
                const invData = Array.isArray(invResponse) ? invResponse : (invResponse?.data || []);
                setInvoices(invData);

                const provResponse = await axios.get(`${API_URL}/providers`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const provList = Array.isArray(provResponse.data) ? provResponse.data : (provResponse.data.data || []);
                setProviders(provList);

                // Cargar Historial Global
                if (showGlobalHistory) {
                    const hpData = await api.fetchProviderPaymentsReport(token, Object.keys(params).length ? params : undefined);
                    setGlobalHistoryData(Array.isArray(hpData) ? hpData : (hpData?.data || []));
                }
            } catch (err) {
                console.error("Error cargando datos:", err);
            } finally {
                setLoading(false);
            }
        };
        if (token) loadData();
    }, [token, refreshTrigger, filterDateFrom, filterDateTo, filterProvider, showGlobalHistory]);

    // --- REGISTRAR ABONO ---
    const openPayModal = (invoice) => {
        setSelectedInvoice(invoice);
        setPayData({ amount: '', reference: '', method: 'EFECTIVO' });
        setAttachmentFile(null);
        setAttachmentData({ base64: null, name: null });
        setShowPayModal(true);
    };

    const handlePay = async (e) => {
        e.preventDefault();
        if (!selectedInvoice || !payData.amount) return;

        const payAmount = parseFloat(payData.amount);
        const maxPay = (parseFloat(selectedInvoice.monto_total) || 0) - (parseFloat(selectedInvoice.monto_abonado) || 0);

        if (payAmount <= 0) return showAlert("Error", "El monto debe ser mayor a cero.", "error");
        if (payAmount > maxPay + 0.01) return showAlert("Error", "El monto excede la deuda pendiente.", "error");

        const isFullPayment = payAmount >= maxPay - 0.1;
        const newStatus = isFullPayment ? 'PAGADA' : selectedInvoice.estado;

        try {
            await api.payProviderInvoice(selectedInvoice.id, {
                amount: payAmount,
                reference: payData.reference,
                method: payData.method,
                status: newStatus,
                comprobante_base64: attachmentData.base64,
                comprobante_name: attachmentData.name
            }, token);
            setRefreshTrigger(prev => prev + 1);
            setShowPayModal(false);
            showAlert("Pago Registrado", `Se registró el abono correctamente. Estado: ${newStatus}`, "success");
        } catch (error) {
            console.error(error);
            showAlert("Error", "No se pudo registrar el pago. Intente nuevamente.", "error");
        }
    };

    // --- EDITAR ABONO INDIVIDUAL ---
    const openEditPayModal = (abono) => {
        setSelectedAbono(abono);
        setEditPayData({
            amount: abono.monto,
            reference: abono.referencia || '',
            method: abono.metodo_pago
        });
        setAttachmentFile(null);
        setAttachmentData({ base64: null, name: null });
        setShowEditPayModal(true);
    };

    const handleEditPay = async (e) => {
        e.preventDefault();
        if (!selectedAbono || !editPayData.amount) return;

        const payAmount = parseFloat(editPayData.amount);
        if (payAmount <= 0) return showAlert("Error", "El monto debe ser mayor a cero.", "error");

        try {
            await api.updateProviderPayment(selectedAbono.id, {
                amount: payAmount,
                method: editPayData.method,
                reference: editPayData.reference,
                comprobante_base64: attachmentData.base64,
                comprobante_name: attachmentData.name
            }, token);
            
            setRefreshTrigger(prev => prev + 1);
            setShowEditPayModal(false);
            
            // Actualizar el historial local del modal de la factura actual
            if (selectedInvoice) {
                const refreshedAbonos = await api.fetchProviderInvoicePayments(selectedInvoice.id, token);
                setHistoryData(Array.isArray(refreshedAbonos) ? refreshedAbonos : (refreshedAbonos?.data || []));
                
                // Actualizar localmente el acumulado de la factura seleccionada
                const diff = payAmount - parseFloat(selectedAbono.monto);
                setSelectedInvoice(prev => ({
                    ...prev,
                    monto_abonado: parseFloat(prev.monto_abonado) + diff
                }));
            }
            
            showAlert("Abono Modificado", "El abono se editó y recalculó de forma exitosa.", "success");
        } catch (error) {
            console.error(error);
            showAlert("Error", "No se pudo actualizar el abono.", "error");
        }
    };

    // --- CREAR FACTURA ---
    const handleCreate = async (e) => {
        e.preventDefault();
        if (!formData.proveedor) return showAlert("Falta Proveedor", "Seleccione un proveedor.", "warning");

        try {
            await api.createProviderInvoice({
                ...formData,
                comprobante_base64: attachmentData.base64,
                comprobante_name: attachmentData.name
            }, token);
            
            setRefreshTrigger(prev => prev + 1);
            setShowCreateModal(false);
            
            setFormData({
                proveedor: '', numero_factura: '',
                fecha_emision: getTodayManaguaISO(),
                fecha_vencimiento: '', monto_total: '', notas: '',
                tipo_compra: 'CREDITO', metodo_pago: 'EFECTIVO', referencia: ''
            });
            setAttachmentFile(null);
            setAttachmentData({ base64: null, name: null });
            showAlert("Guardado", "La factura ha sido registrada exitosamente.", "success");
        } catch (error) {
            showAlert("Error", "Error al guardar factura.", "error");
        }
    };

    // --- ELIMINAR FACTURA ---
    const handleDelete = async () => {
        if (!selectedInvoice) return;
        try {
            await api.deleteProviderInvoice(selectedInvoice.id, token);
            setRefreshTrigger(prev => prev + 1);
            setShowConfirmDelete(false);
            showAlert("Eliminada", "La factura fue eliminada del sistema.", "success");
        } catch (error) {
            showAlert("Error", "No se pudo eliminar la factura.", "error");
        }
    };

    // --- VER HISTORIAL DE ABONOS ---
    const openHistoryModal = async (invoice) => {
        setSelectedInvoice(invoice);
        setShowHistoryModal(true);
        setLoadingHistory(true);
        setHistoryData([]);
        try {
            const data = await api.fetchProviderInvoicePayments(invoice.id, token);
            setHistoryData(Array.isArray(data) ? data : (data?.data || []));
        } catch (error) {
            showAlert("Error", "No se pudo cargar el historial de abonos.", "error");
        } finally {
            setLoadingHistory(false);
        }
    };

    // --- ELIMINAR ABONO INDIVIDUAL ---
    const handleDeletePayment = async (abonoId, invoiceId = null) => {
        if (!window.confirm('¿Eliminar este abono? El monto se descontará del total abonado en la factura.')) return;
        try {
            await api.deleteProviderPayment(abonoId, token);
            setHistoryData(prev => prev.filter(a => a.id !== abonoId));
            setGlobalHistoryData(prev => prev.filter(a => a.abono_id !== abonoId));
            
            // Si la factura seleccionada está en pantalla, actualizar su monto_abonado local
            if (selectedInvoice) {
                const deletedAbono = historyData.find(a => a.id === abonoId);
                if (deletedAbono) {
                    setSelectedInvoice(prev => ({
                        ...prev,
                        monto_abonado: Math.max(0, parseFloat(prev.monto_abonado) - parseFloat(deletedAbono.monto))
                    }));
                }
            }
            
            setRefreshTrigger(prev => prev + 1);
            showAlert('Abono Eliminado', 'El abono fue eliminado y la factura fue actualizada.', 'success');
        } catch (err) {
            showAlert('Error', 'No se pudo eliminar el abono. Intenta nuevamente.', 'error');
        }
    };

    // --- CÁLCULO DE ESTADO DINÁMICO ---
    const getEffectiveStatus = useCallback((invoice) => {
        const total = parseFloat(invoice.monto_total) || 0;
        const abonado = parseFloat(invoice.monto_abonado) || 0;

        if (total > 0 && abonado >= (total - 0.1)) return 'PAGADA';
        if (!invoice.fecha_vencimiento) return 'PENDIENTE';

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let fVenc = invoice.fecha_vencimiento;
        if (fVenc && fVenc.includes('T')) fVenc = fVenc.split('T')[0];

        const parts = fVenc.split(/[-/]/);
        let yyyy, mm, dd;

        if (parts[0].length === 4) {
            yyyy = parseInt(parts[0], 10);
            mm = parseInt(parts[1], 10) - 1;
            dd = parseInt(parts[2], 10);
        } else {
            dd = parseInt(parts[0], 10);
            mm = parseInt(parts[1], 10) - 1;
            yyyy = parseInt(parts[2], 10);
        }

        const vencDate = new Date(yyyy, mm, dd);
        vencDate.setHours(0, 0, 0, 0);

        const diffTime = vencDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'VENCIDA';
        if (diffDays <= 5) return 'PROXIMA';

        return 'PENDIENTE';
    }, []);

    const getStatusStyles = useCallback((status) => {
        switch (status) {
            case 'VENCIDA': return { color: '#ef4444', bg: '#fee2e2', activeColor: '#ef4444', activeBg: '#fee2e2', label: 'Vencida' };
            case 'PROXIMA': return { color: '#f97316', bg: '#ffedd5', activeColor: '#ea580c', activeBg: '#ffedd5', label: 'Próxima a Vencer' };
            case 'PAGADA': return { color: '#10b981', bg: '#dcfce7', activeColor: '#10b981', activeBg: '#dcfce7', label: 'Pagada' };
            default: return { color: '#3b82f6', bg: '#dbeafe', activeColor: '#2563eb', activeBg: '#dbeafe', label: 'Pendiente' };
        }
    }, []);

    // --- ESTADÍSTICAS GLOBALES ---
    const stats = useMemo(() => {
        let pend = 0, venc = 0, pag = 0, prox = 0, totalDebt = 0;

        invoices.forEach(inv => {
            const status = getEffectiveStatus(inv);
            if (status === 'PENDIENTE') pend++;
            if (status === 'VENCIDA') venc++;
            if (status === 'PAGADA') pag++;
            if (status === 'PROXIMA') prox++;

            const deud = (parseFloat(inv.monto_total) || 0) - (parseFloat(inv.monto_abonado) || 0);
            if (status !== 'PAGADA') totalDebt += deud;
        });

        return { pend, venc, pag, prox, totalDebt, totalCount: invoices.length };
    }, [invoices, getEffectiveStatus]);

    // --- BI SUMMARY ---
    const biSummary = useMemo(() => {
        let data = invoices;
        const summaryMap = {};
        data.forEach(inv => {
            const name = inv.proveedor || 'Sin Proveedor';
            if (!summaryMap[name]) {
                summaryMap[name] = { provider: name, count: 0, totalAmount: 0, totalPaid: 0 };
            }
            summaryMap[name].count += 1;
            summaryMap[name].totalAmount += (parseFloat(inv.monto_total) || 0);
            summaryMap[name].totalPaid += (parseFloat(inv.monto_abonado) || 0);
        });

        return Object.values(summaryMap).sort((a, b) => b.totalAmount - a.totalAmount);
    }, [invoices]);

    // --- LISTADO FACTURAS FILTRADO Y SUS TOTALES ---
    const filteredInvoices = useMemo(() => {
        let data = invoices.map(inv => ({ ...inv, effectiveStatus: getEffectiveStatus(inv) }));

        // 1. Filtro por Tabs (Estado)
        if (filter !== 'TODAS' && filter !== 'BI') {
            if (filter === 'PENDIENTE') {
                data = data.filter(i => i.effectiveStatus === 'PENDIENTE' || i.effectiveStatus === 'PROXIMA');
            } else {
                data = data.filter(i => i.effectiveStatus === filter);
            }
        }

        // 2. Filtro por Proveedor
        if (filterProvider) {
            data = data.filter(i => i.proveedor === filterProvider);
        }

        // 3. Filtro por Tipo de Compra (CONTADO / CREDITO)
        if (filterTipoCompra) {
            data = data.filter(i => i.tipo_compra === filterTipoCompra);
        }

        // 4. Búsqueda de Texto
        data = rankItems(data, searchTerm, ['proveedor', 'numero_factura']);

        // 5. Ordenamiento
        data.sort((a, b) => {
            if (sortBy === 'vencimiento_asc') {
                return new Date(a.fecha_vencimiento) - new Date(b.fecha_vencimiento);
            } else if (sortBy === 'emision_desc') {
                return new Date(b.fecha_emision) - new Date(a.fecha_emision);
            } else if (sortBy === 'emision_asc') {
                return new Date(a.fecha_emision) - new Date(b.fecha_emision);
            }
            return 0;
        });

        return data;
    }, [invoices, filter, searchTerm, filterProvider, filterTipoCompra, sortBy, getEffectiveStatus]);

    const filteredInvoiceSums = useMemo(() => {
        let facturado = 0;
        let abonado = 0;
        filteredInvoices.forEach(i => {
            facturado += parseFloat(i.monto_total) || 0;
            abonado += parseFloat(i.monto_abonado) || 0;
        });
        return { facturado, abonado, restante: facturado - abonado };
    }, [filteredInvoices]);

    // --- LISTADO GLOBAL DE EGRESOS FILTRADO Y SUS TOTALES ---
    const filteredGlobalHistory = useMemo(() => {
        let data = globalHistoryData;

        // Filtro por proveedor
        if (filterProvider) {
            data = data.filter(a => a.proveedor === filterProvider);
        }

        // Filtro por método de pago
        if (filterMetodoPago) {
            data = data.filter(a => a.metodo_pago === filterMetodoPago);
        }

        // Filtro por tipo de compra (Factura origen)
        if (filterTipoCompra) {
            data = data.filter(a => a.tipo_compra === filterTipoCompra);
        }

        // Búsqueda
        data = rankItems(data, searchTerm, ['proveedor', 'numero_factura', 'referencia']);

        return data;
    }, [globalHistoryData, filterProvider, filterMetodoPago, filterTipoCompra, searchTerm]);

    const filteredGlobalHistorySum = useMemo(() => {
        return filteredGlobalHistory.reduce((acc, curr) => acc + parseFloat(curr.monto || 0), 0);
    }, [filteredGlobalHistory]);

    return (
        <PageWrapper>
            <Alert info={alertInfo} onClose={() => setAlertInfo({ ...alertInfo, show: false })} />

            <HeaderContainer>
                <TitleSection>
                    <Title><FaFileInvoiceDollar /> Facturas de Proveedores</Title>
                    <Subtitle>Gestión y control de cuentas por pagar</Subtitle>
                </TitleSection>
                <ActionButtons>
                    <Button $secondary onClick={() => setRefreshTrigger(prev => prev + 1)}>Actualizar</Button>
                    <BackButton to="/dashboard"><FaArrowLeft /> Volver</BackButton>
                    <Button $primary onClick={() => {
                        setFormData({
                            proveedor: '', numero_factura: '',
                            fecha_emision: getTodayManaguaISO(),
                            fecha_vencimiento: '', monto_total: '', notas: '',
                            tipo_compra: 'CREDITO', metodo_pago: 'EFECTIVO', referencia: ''
                        });
                        setAttachmentFile(null);
                        setAttachmentData({ base64: null, name: null });
                        setShowCreateModal(true);
                    }}>
                        <FaPlus /> Registrar Factura
                    </Button>
                </ActionButtons>
            </HeaderContainer>

            {/* VISTAS PRINCIPALES TABS */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem' }}>
                <button
                    onClick={() => setShowGlobalHistory(false)}
                    style={{
                        padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', border: 'none',
                        background: !showGlobalHistory ? '#0f172a' : 'transparent',
                        color: !showGlobalHistory ? 'white' : '#64748b',
                        transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px'
                    }}
                >
                    <FaFileInvoiceDollar /> Control de Facturas (Deudas)
                </button>
                <button
                    onClick={() => setShowGlobalHistory(true)}
                    style={{
                        padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', border: 'none',
                        background: showGlobalHistory ? '#0f172a' : 'transparent',
                        color: showGlobalHistory ? 'white' : '#64748b',
                        transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px'
                    }}
                >
                    <FaList /> Reporte de Egresos (Abonos & Pagos)
                </button>
            </div>

            {/* TOTALS SUMMARY BAR - DINÁMICO */}
            {!showGlobalHistory && filter !== 'BI' && (
                <TotalsSummaryBar>
                    <div className="summary-item">
                        <span className="summary-label">Suma de Facturas Filtradas</span>
                        <span className="summary-value">C${filteredInvoiceSums.facturado.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="summary-item success">
                        <span className="summary-label">Total Abonado</span>
                        <span className="summary-value">C${filteredInvoiceSums.abonado.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="summary-item danger">
                        <span className="summary-label">Deuda Restante</span>
                        <span className="summary-value">C${filteredInvoiceSums.restante.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                </TotalsSummaryBar>
            )}

            {showGlobalHistory && (
                <TotalsSummaryBar>
                    <div className="summary-item success">
                        <span className="summary-label">Total Egresado Bajo Filtros</span>
                        <span className="summary-value">C${filteredGlobalHistorySum.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                </TotalsSummaryBar>
            )}

            {/* VISTA 1: CONTROL DE FACTURAS */}
            {!showGlobalHistory && (
                <>
                    {/* KPI CARDS */}
                    <StatsGrid>
                        <StatCard color="#ef4444" bg="#fef2f2">
                            <div className="icon-wrapper"><FaExclamationCircle /></div>
                            <div className="label">Vencidas</div>
                            <div className="value">{stats.venc}</div>
                            <div className="sub">Requieren atención urgente</div>
                        </StatCard>
                        <StatCard color="#ea580c" bg="#fff7ed">
                            <div className="icon-wrapper"><FaClock /></div>
                            <div className="label">Próximas a Vencer</div>
                            <div className="value">{stats.prox}</div>
                            <div className="sub">En los próx. 5 días</div>
                        </StatCard>
                        <StatCard color="#3b82f6" bg="#eff6ff">
                            <div className="icon-wrapper"><FaClock /></div>
                            <div className="label">Pendientes</div>
                            <div className="value">{stats.pend}</div>
                            <div className="sub">Sin riesgo inmediato</div>
                        </StatCard>
                        <StatCard color="#10b981" bg="#dcfce7">
                            <div className="icon-wrapper"><FaCheckCircle /></div>
                            <div className="label">Pagadas</div>
                            <div className="value">{stats.pag}</div>
                            <div className="sub">Completadas con éxito</div>
                        </StatCard>
                        <StatCard color="#b45309" bg="#fffbeb">
                            <div className="icon-wrapper"><FaMoneyBillWave /></div>
                            <div className="label">Deuda Total</div>
                            <div className="value" style={{ color: '#b45309', fontSize: '1.5rem' }}>
                                C${stats.totalDebt.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </div>
                            <div className="sub">Saldo Pendiente Global</div>
                        </StatCard>
                    </StatsGrid>

                    {/* TOOLBAR */}
                    <Toolbar>
                        <FilterTabs>
                            {[
                                { id: 'PENDIENTE', label: 'Por Pagar (Prox)', icon: FaClock, color: '#3b82f6', bg: '#eff6ff', count: stats.pend + stats.prox },
                                { id: 'VENCIDA', label: 'Vencidas', icon: FaExclamationCircle, color: '#ef4444', bg: '#fef2f2', count: stats.venc },
                                { id: 'PAGADA', label: 'Pagadas', icon: FaCheckCircle, color: '#10b981', bg: '#dcfce7', count: stats.pag },
                                { id: 'BI', label: 'Resumen BI', icon: FaFilter, color: '#6366f1', bg: '#eef2ff', count: null },
                                { id: 'TODAS', label: 'Todas', icon: FaList, color: '#64748b', bg: '#f1f5f9', count: null },
                            ].map(tab => (
                                <TabButton
                                    key={tab.id}
                                    active={filter === tab.id}
                                    activeColor={tab.color}
                                    activeBg={tab.bg}
                                    onClick={() => setFilter(tab.id)}
                                >
                                    <tab.icon /> {tab.label}
                                    {tab.count !== null && <span className="badge">{tab.count}</span>}
                                </TabButton>
                            ))}
                        </FilterTabs>

                        <SearchAndFilters>
                            <SearchContainer>
                                <FaSearch />
                                <input
                                    type="text"
                                    placeholder="Buscar proveedor o No. factura..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </SearchContainer>

                            <FilterGroup style={{ minWidth: '180px' }}>
                                <label>Ordenar Por</label>
                                <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                                    <option value="vencimiento_asc">Vencen Primero (Próximas)</option>
                                    <option value="emision_desc">Emitidas Reciente (Nuevas)</option>
                                    <option value="emision_asc">Emitidas Antiguas (Viejas)</option>
                                </select>
                            </FilterGroup>

                            <FilterGroup>
                                <label>Tipo de Compra</label>
                                <select value={filterTipoCompra} onChange={e => setFilterTipoCompra(e.target.value)}>
                                    <option value="">TODAS</option>
                                    <option value="CREDITO">Crédito</option>
                                    <option value="CONTADO">Contado</option>
                                </select>
                            </FilterGroup>

                            <FilterGroup>
                                <label>Proveedor</label>
                                <select value={filterProvider} onChange={e => setFilterProvider(e.target.value)}>
                                    <option value="">Todos</option>
                                    {providers.map(p => (
                                        <option key={p.id_proveedor || p.id} value={p.nombre}>
                                            {p.nombre}
                                        </option>
                                    ))}
                                </select>
                            </FilterGroup>

                            <FilterGroup style={{ minWidth: '140px' }}>
                                <label>Desde</label>
                                <input type="date" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)} />
                            </FilterGroup>

                            <FilterGroup style={{ minWidth: '140px' }}>
                                <label>Hasta</label>
                                <input type="date" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)} />
                            </FilterGroup>
                        </SearchAndFilters>
                    </Toolbar>

                    {/* GRID FACTURAS */}
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                            <FaClock className="spin" style={{ fontSize: '2rem', marginBottom: '1rem' }} />
                            <p>Cargando información...</p>
                        </div>
                    ) : filteredInvoices.length > 0 ? (
                        <InvoicesGrid>
                            {filteredInvoices.map(inv => {
                                const status = inv.effectiveStatus;
                                const styles = getStatusStyles(status);
                                const total = parseFloat(inv.monto_total) || 0;
                                const abonado = parseFloat(inv.monto_abonado) || 0;
                                const saldo = total - abonado;
                                const progress = total > 0 ? (abonado / total) * 100 : 0;

                                return (
                                    <InvoiceCard key={inv.id} color={styles.color} balanceColor={saldo > 0 ? '#ef4444' : '#10b981'}>
                                        <div className="card-header">
                                            <div className="provider-info">
                                                <h3 title={inv.proveedor}>
                                                    <FaStore style={{ marginRight: 6, color: '#94a3b8' }} /> {inv.proveedor}
                                                </h3>
                                                <span className="invoice-number">#{inv.numero_factura}</span>
                                            </div>
                                            <StatusBadge bg={styles.bg} text={styles.color}>{styles.label}</StatusBadge>
                                        </div>

                                        <div className="card-body">
                                            <div className="meta-row">
                                                <span className="label"><FaCalendarAlt /> Emisión</span>
                                                <span className="value">{formatDateManagua(inv.fecha_emision)}</span>
                                            </div>
                                            <div className="meta-row">
                                                <span className="label"><FaExclamationCircle /> Vence</span>
                                                <span className="value" style={{ color: status === 'VENCIDA' ? '#ef4444' : 'inherit' }}>
                                                    {formatDateManagua(inv.fecha_vencimiento)}
                                                </span>
                                            </div>
                                            <div className="meta-row">
                                                <span className="label"><FaFilter /> Tipo de Compra</span>
                                                <span className="value">
                                                    <StatusBadge 
                                                        bg={inv.tipo_compra === 'CONTADO' ? '#dcfce7' : '#eef2ff'} 
                                                        text={inv.tipo_compra === 'CONTADO' ? '#16a34a' : '#4f46e5'}
                                                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}
                                                    >
                                                        {inv.tipo_compra}
                                                    </StatusBadge>
                                                </span>
                                            </div>

                                            <div className="financial-block">
                                                <div className="total-row">
                                                    <span className="label">Total a Pagar</span>
                                                    <span className="amount">C${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                                </div>
                                                <div className="progress-bar">
                                                    <div style={{ width: `${progress}%`, background: styles.color }}></div>
                                                </div>
                                                <div className="balance-text">
                                                    Abonado: C${abonado.toLocaleString(undefined, { minimumFractionDigits: 2 })} &bull; <strong>Resta: C${saldo.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card-footer" style={{ flexWrap: 'wrap' }}>
                                            {saldo > 0 && (
                                                <Button $primary style={{ flex: 1, justifyContent: 'center' }} onClick={() => openPayModal(inv)}>
                                                    <FaMoneyBillWave /> Abonar
                                                </Button>
                                            )}
                                            <Button $secondary style={{ flex: 1, justifyContent: 'center' }} onClick={() => openHistoryModal(inv)}>
                                                <FaList /> Historial
                                            </Button>
                                            <Button $danger style={{ padding: '0.75rem' }} onClick={() => { setSelectedInvoice(inv); setShowConfirmDelete(true); }}>
                                                <FaTrashAlt />
                                            </Button>
                                        </div>
                                    </InvoiceCard>
                                );
                            })}
                        </InvoicesGrid>
                    ) : filter === 'BI' ? (
                        <BISummaryContainer>
                            <BISummaryHeader>
                                <h3><FaFilter /> Resumen de Razonamiento de Negocio</h3>
                                {filterDateFrom && filterDateTo && (
                                    <span className="date-range">
                                        {formatDateManagua(filterDateFrom)} - {formatDateManagua(filterDateTo)}
                                    </span>
                                )}
                            </BISummaryHeader>
                            <BITable>
                                <thead>
                                    <tr>
                                        <th>Proveedor</th>
                                        <th style={{ textAlign: 'center' }}>Facturas</th>
                                        <th style={{ textAlign: 'right' }}>Total Comprado</th>
                                        <th style={{ textAlign: 'right' }}>Pagado</th>
                                        <th style={{ textAlign: 'right' }}>Saldo Pendiente</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {biSummary.map(item => (
                                        <tr key={item.provider}>
                                            <td className="provider-name">{item.provider}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <span className="count-badge">{item.count}</span>
                                            </td>
                                            <td className="amount">C${item.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                            <td className="amount" style={{ color: '#10b981' }}>C${item.totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                            <td className="amount" style={{ color: (item.totalAmount - item.totalPaid) > 0.1 ? '#ef4444' : '#10b981' }}>
                                                C${(item.totalAmount - item.totalPaid).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    ))}
                                    {biSummary.length === 0 && (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                                                No hay datos para el período seleccionado.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                                {biSummary.length > 0 && (
                                    <tfoot>
                                        <tr style={{ background: '#f8fafc', fontWeight: '900' }}>
                                            <td colSpan="2" style={{ textAlign: 'right', textTransform: 'uppercase', fontSize: '0.8rem', color: '#64748b' }}>Totales Globales:</td>
                                            <td className="amount">C${biSummary.reduce((acc, curr) => acc + curr.totalAmount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                            <td className="amount">C${biSummary.reduce((acc, curr) => acc + curr.totalPaid, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                            <td className="amount" style={{ color: '#ef4444' }}>C${(biSummary.reduce((acc, curr) => acc + curr.totalAmount, 0) - biSummary.reduce((acc, curr) => acc + curr.totalPaid, 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                        </tr>
                                    </tfoot>
                                )}
                            </BITable>
                        </BISummaryContainer>
                    ) : (
                        <div style={{
                            textAlign: 'center', padding: '4rem', color: '#94a3b8',
                            border: '2px dashed #e2e8f0', borderRadius: '24px', background: 'white'
                        }}>
                            <FaFileInvoiceDollar style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }} />
                            <h3 style={{ color: '#475569' }}>No se encontraron facturas</h3>
                            <p>Intenta ajustar los filtros o registra una nueva.</p>
                        </div>
                    )}
                </>
            )}

            {/* VISTA 2: REPORTE GLOBAL DE ABONOS */}
            {showGlobalHistory && (
                <>
                    <Toolbar>
                        <SearchAndFilters style={{ width: '100%' }}>
                            <SearchContainer>
                                <FaSearch />
                                <input
                                    type="text"
                                    placeholder="Buscar por proveedor, factura o referencia..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </SearchContainer>

                            <FilterGroup>
                                <label>Método de Pago</label>
                                <select value={filterMetodoPago} onChange={e => setFilterMetodoPago(e.target.value)}>
                                    <option value="">TODOS</option>
                                    <option value="EFECTIVO">Efectivo</option>
                                    <option value="TARJETA">Tarjeta</option>
                                    <option value="TRANSFERENCIA">Transferencia</option>
                                    <option value="CHEQUE">Cheque</option>
                                </select>
                            </FilterGroup>

                            <FilterGroup>
                                <label>Tipo Factura</label>
                                <select value={filterTipoCompra} onChange={e => setFilterTipoCompra(e.target.value)}>
                                    <option value="">TODOS</option>
                                    <option value="CONTADO">Contado</option>
                                    <option value="CREDITO">Crédito</option>
                                </select>
                            </FilterGroup>

                            <FilterGroup>
                                <label>Proveedor</label>
                                <select value={filterProvider} onChange={e => setFilterProvider(e.target.value)}>
                                    <option value="">TODOS</option>
                                    {providers.map(p => (
                                        <option key={p.id_proveedor || p.id} value={p.nombre}>{p.nombre}</option>
                                    ))}
                                </select>
                            </FilterGroup>
                            <FilterGroup style={{ minWidth: '140px' }}>
                                <label>Desde</label>
                                <input type="date" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)} />
                            </FilterGroup>
                            <FilterGroup style={{ minWidth: '140px' }}>
                                <label>Hasta</label>
                                <input type="date" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)} />
                            </FilterGroup>
                        </SearchAndFilters>
                    </Toolbar>

                    <BISummaryContainer>
                        <BISummaryHeader>
                            <h3><FaMoneyBillWave /> Listado de Pagos y Abonos Efectuados</h3>
                            {(filterDateFrom || filterDateTo) && (
                                <span className="date-range">
                                    {filterDateFrom ? formatDateManagua(filterDateFrom) : 'Inicio'} - {filterDateTo ? formatDateManagua(filterDateTo) : 'Hoy'}
                                </span>
                            )}
                        </BISummaryHeader>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                                <FaClock className="spin" style={{ fontSize: '2rem', marginBottom: '1rem' }} />
                                <p>Cargando información...</p>
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <BITable>
                                    <thead>
                                        <tr>
                                            <th>Fecha Abono</th>
                                            <th>Factura</th>
                                            <th>Proveedor</th>
                                            <th>Método</th>
                                            <th>Referencia / Detalle</th>
                                            <th style={{ textAlign: 'center' }}>Modo de Compra</th>
                                            <th style={{ textAlign: 'center' }}>Comprobante</th>
                                            <th style={{ textAlign: 'right' }}>Monto Pagado (C$)</th>
                                            <th style={{ textAlign: 'center' }}>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredGlobalHistory.map((abono) => (
                                            <tr key={abono.abono_id}>
                                                <td>{formatDateManagua(abono.fecha_abono)}</td>
                                                <td><b>#{abono.numero_factura}</b></td>
                                                <td>{abono.proveedor}</td>
                                                <td><StatusBadge bg="#f1f5f9" text="#475569">{abono.metodo_pago}</StatusBadge></td>
                                                <td>{abono.referencia || '-'}</td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <StatusBadge
                                                        bg={abono.tipo_compra === 'CONTADO' ? '#dcfce7' : '#eef2ff'}
                                                        text={abono.tipo_compra === 'CONTADO' ? '#16a34a' : '#4f46e5'}>
                                                        {abono.tipo_compra}
                                                    </StatusBadge>
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    {abono.comprobante_url ? (
                                                        <a 
                                                            href={resolveFileUrl(abono.comprobante_url)} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            style={{ color: '#ef4444', fontSize: '1.2rem', display: 'inline-flex', alignItems: 'center' }}
                                                            title="Ver Comprobante PDF"
                                                        >
                                                            <FaFilePdf />
                                                        </a>
                                                    ) : (
                                                        <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>—</span>
                                                    )}
                                                </td>
                                                <td className="amount" style={{ color: '#10b981' }}>
                                                    C${parseFloat(abono.monto).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                        <Button
                                                            $secondary
                                                            title="Editar abono"
                                                            style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', borderRadius: '8px' }}
                                                            onClick={() => {
                                                                // Simulamos carga de factura para refrescar
                                                                const mockInvoice = invoices.find(i => i.id === abono.id_factura);
                                                                if (mockInvoice) setSelectedInvoice(mockInvoice);
                                                                openEditPayModal({
                                                                    id: abono.abono_id,
                                                                    monto: abono.monto,
                                                                    metodo_pago: abono.metodo_pago,
                                                                    referencia: abono.referencia,
                                                                    comprobante_url: abono.comprobante_url
                                                                });
                                                            }}
                                                        >
                                                            <FaEdit />
                                                        </Button>
                                                        <Button
                                                            $danger
                                                            title="Eliminar abono"
                                                            style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', borderRadius: '8px' }}
                                                            onClick={() => handleDeletePayment(abono.abono_id)}
                                                        >
                                                            <FaTrashAlt />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredGlobalHistory.length === 0 && (
                                            <tr>
                                                <td colSpan="9" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                                                    No hay registro de abonos o pagos en este período.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </BITable>
                            </div>
                        )}
                    </BISummaryContainer>
                </>
            )}

            {/* --- MODAL CREAR FACTURA --- */}
            {showCreateModal && (
                <ModalOverlay onClick={() => setShowCreateModal(false)}>
                    <ModalContent onClick={e => e.stopPropagation()}>
                        <CloseButton onClick={() => setShowCreateModal(false)}><FaTimes /></CloseButton>
                        <h2>Registrar Factura</h2>
                        <form onSubmit={handleCreate}>
                            <FormGroup>
                                <label>Proveedor</label>
                                <select
                                    required
                                    value={formData.proveedor}
                                    onChange={e => setFormData({ ...formData, proveedor: e.target.value })}
                                >
                                    <option value="">Seleccione un proveedor...</option>
                                    {providers.map(p => (
                                        <option key={p.id_proveedor || p.id} value={p.nombre}>
                                            {p.nombre}
                                        </option>
                                    ))}
                                </select>
                            </FormGroup>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <FormGroup>
                                    <label>No. Factura</label>
                                    <input required type="text" value={formData.numero_factura} onChange={e => setFormData({ ...formData, numero_factura: e.target.value })} placeholder="Ej: F-001" />
                                </FormGroup>
                                <FormGroup>
                                    <label>Monto Total (C$)</label>
                                    <input required type="number" step="0.01" value={formData.monto_total} onChange={e => setFormData({ ...formData, monto_total: e.target.value })} placeholder="0.00" />
                                </FormGroup>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <FormGroup>
                                    <label>Fecha Emisión</label>
                                    <input required type="date" value={formData.fecha_emision} onChange={e => setFormData({ ...formData, fecha_emision: e.target.value })} />
                                </FormGroup>
                                <FormGroup>
                                    <label>Fecha Vencimiento</label>
                                    <input required type="date" value={formData.fecha_vencimiento} onChange={e => setFormData({ ...formData, fecha_vencimiento: e.target.value })} />
                                </FormGroup>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '12px', marginBottom: '1.25rem', border: '1px solid #e2e8f0' }}>
                                <FormGroup style={{ marginBottom: 0 }}>
                                    <label>Tipo de Compra</label>
                                    <select required value={formData.tipo_compra} onChange={e => setFormData({ ...formData, tipo_compra: e.target.value })}>
                                        <option value="CREDITO">A Crédito</option>
                                        <option value="CONTADO">De Contado</option>
                                    </select>
                                </FormGroup>
                                {formData.tipo_compra === 'CONTADO' && (
                                    <FormGroup style={{ marginBottom: 0 }}>
                                        <label>Método de Pago</label>
                                        <select required value={formData.metodo_pago} onChange={e => setFormData({ ...formData, metodo_pago: e.target.value })}>
                                            <option value="EFECTIVO">Efectivo</option>
                                            <option value="TARJETA">Tarjeta</option>
                                            <option value="TRANSFERENCIA">Transferencia</option>
                                            <option value="CHEQUE">Cheque</option>
                                        </select>
                                    </FormGroup>
                                )}
                            </div>

                            {formData.tipo_compra === 'CONTADO' && (
                                <>
                                    <FormGroup>
                                        <label>Referencia de Pago (Transferencia, Cheque, etc.)</label>
                                        <input type="text" value={formData.referencia} onChange={e => setFormData({ ...formData, referencia: e.target.value })} placeholder="Opcional..." />
                                    </FormGroup>

                                    <FormGroup>
                                        <label>Comprobante de Pago (Imagen o PDF)</label>
                                        <FileUploadContainer>
                                            <FaUpload className="upload-icon" />
                                            {attachmentFile ? (
                                                <div className="file-details">
                                                    {attachmentProcessing ? "Procesando archivo..." : `✓ PDF Generado: ${attachmentData.name}`}
                                                </div>
                                            ) : (
                                                <div className="file-details">Haz clic o arrastra una imagen o PDF</div>
                                            )}
                                            <input type="file" accept="image/*,application/pdf" onChange={handleFileSelection} disabled={attachmentProcessing} />
                                        </FileUploadContainer>
                                    </FormGroup>
                                </>
                            )}

                            <FormGroup>
                                <label>Notas (Opcional)</label>
                                <textarea rows="3" value={formData.notes} onChange={e => setFormData({ ...formData, notas: e.target.value })} placeholder="Detalles extra..."></textarea>
                            </FormGroup>

                            <Button $primary type="submit" disabled={attachmentProcessing} style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}>
                                <FaCheckCircle /> Guardar Factura
                            </Button>
                        </form>
                    </ModalContent>
                </ModalOverlay>
            )}

            {/* --- MODAL PAGO (REGISTRAR ABONO) --- */}
            {showPayModal && (
                <ModalOverlay onClick={() => setShowPayModal(false)}>
                    <ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: '450px' }}>
                        <CloseButton onClick={() => setShowPayModal(false)}><FaTimes /></CloseButton>
                        <h2>Registrar Abono</h2>
                        <div style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                            <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.25rem' }}>Factura #{selectedInvoice?.numero_factura}</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>
                                Deuda: C${((parseFloat(selectedInvoice?.monto_total) || 0) - (parseFloat(selectedInvoice?.monto_abonado) || 0)).toFixed(2)}
                            </div>
                        </div>
                        <form onSubmit={handlePay}>
                            <FormGroup>
                                <label>Monto a Abonar (C$)</label>
                                <input
                                    required
                                    type="number"
                                    step="0.01"
                                    autoFocus
                                    placeholder="0.00"
                                    value={payData.amount}
                                    onChange={e => setPayData({ ...payData, amount: e.target.value })}
                                />
                            </FormGroup>
                            <FormGroup>
                                <label>Método de Pago</label>
                                <select required value={payData.method} onChange={e => setPayData({ ...payData, method: e.target.value })}>
                                    <option value="EFECTIVO">Efectivo</option>
                                    <option value="TARJETA">Tarjeta</option>
                                    <option value="TRANSFERENCIA">Transferencia</option>
                                    <option value="CHEQUE">Cheque</option>
                                </select>
                            </FormGroup>
                            <FormGroup>
                                <label>Referencia / Detalle (Opcional)</label>
                                <input
                                    type="text"
                                    placeholder="Ej: Transferencia #1234, Pago en efectivo..."
                                    value={payData.reference}
                                    onChange={e => setPayData({ ...payData, reference: e.target.value })}
                                />
                            </FormGroup>
                            <FormGroup>
                                <label>Adjuntar Comprobante (Imagen o PDF)</label>
                                <FileUploadContainer>
                                    <FaUpload className="upload-icon" />
                                    {attachmentFile ? (
                                        <div className="file-details">
                                            {attachmentProcessing ? "Procesando archivo..." : `✓ PDF Generado: ${attachmentData.name}`}
                                        </div>
                                    ) : (
                                        <div className="file-details">Sube el comprobante de pago</div>
                                    )}
                                    <input type="file" accept="image/*,application/pdf" onChange={handleFileSelection} disabled={attachmentProcessing} />
                                </FileUploadContainer>
                            </FormGroup>
                            <Button $primary type="submit" disabled={attachmentProcessing} style={{ width: '100%', padding: '1rem' }}>
                                <FaMoneyBillWave /> Confirmar Pago
                            </Button>
                        </form>
                    </ModalContent>
                </ModalOverlay>
            )}

            {/* --- MODAL EDITAR ABONO (NUEVO) --- */}
            {showEditPayModal && (
                <ModalOverlay onClick={() => setShowEditPayModal(false)}>
                    <ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: '450px' }}>
                        <CloseButton onClick={() => setShowEditPayModal(false)}><FaTimes /></CloseButton>
                        <h2>Editar Abono</h2>
                        <div style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                            <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.25rem' }}>
                                Editando abono en Factura #{selectedInvoice?.numero_factura}
                            </div>
                            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>
                                Proveedor: {selectedInvoice?.proveedor}
                            </div>
                        </div>
                        <form onSubmit={handleEditPay}>
                            <FormGroup>
                                <label>Monto del Abono (C$)</label>
                                <input
                                    required
                                    type="number"
                                    step="0.01"
                                    value={editPayData.amount}
                                    onChange={e => setEditPayData({ ...editPayData, amount: e.target.value })}
                                />
                            </FormGroup>
                            <FormGroup>
                                <label>Método de Pago</label>
                                <select required value={editPayData.method} onChange={e => setEditPayData({ ...editPayData, method: e.target.value })}>
                                    <option value="EFECTIVO">Efectivo</option>
                                    <option value="TARJETA">Tarjeta</option>
                                    <option value="TRANSFERENCIA">Transferencia</option>
                                    <option value="CHEQUE">Cheque</option>
                                </select>
                            </FormGroup>
                            <FormGroup>
                                <label>Referencia / Detalle (Opcional)</label>
                                <input
                                    type="text"
                                    value={editPayData.reference}
                                    onChange={e => setEditPayData({ ...editPayData, reference: e.target.value })}
                                />
                            </FormGroup>
                            <FormGroup>
                                <label>Cambiar/Reemplazar Comprobante (Imagen o PDF)</label>
                                <FileUploadContainer>
                                    <FaUpload className="upload-icon" />
                                    {attachmentFile ? (
                                        <div className="file-details">
                                            {attachmentProcessing ? "Procesando archivo..." : `✓ PDF Generado: ${attachmentData.name}`}
                                        </div>
                                    ) : (
                                        <div className="file-details">Selecciona un archivo si deseas reemplazarlo</div>
                                    )}
                                    <input type="file" accept="image/*,application/pdf" onChange={handleFileSelection} disabled={attachmentProcessing} />
                                </FileUploadContainer>
                                {selectedAbono?.comprobante_url && !attachmentFile && (
                                    <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                                        Tiene comprobante: <a href={resolveFileUrl(selectedAbono.comprobante_url)} target="_blank" rel="noopener noreferrer" style={{ color: '#ef4444', fontWeight: 'bold' }}>Ver actual</a>
                                    </div>
                                )}
                            </FormGroup>
                            <Button $primary type="submit" disabled={attachmentProcessing} style={{ width: '100%', padding: '1rem' }}>
                                <FaCheckCircle /> Guardar Cambios
                            </Button>
                        </form>
                    </ModalContent>
                </ModalOverlay>
            )}

            {/* --- CONFIRMACION ELIMINAR FACTURA --- */}
            {showConfirmDelete && (
                <ModalOverlay onClick={() => setShowConfirmDelete(false)}>
                    <ModalContent style={{ maxWidth: '400px', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', color: '#ef4444', marginBottom: '1rem' }}>
                            <FaExclamationCircle />
                        </div>
                        <h2>¿Eliminar Factura?</h2>
                        <p style={{ color: '#64748b', marginBottom: '2rem' }}>
                            Estás a punto de eliminar la factura <b>#{selectedInvoice?.numero_factura}</b>. Se borrarán también todos sus comprobantes y abonos. Esta acción no se puede deshacer.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Button $secondary onClick={() => setShowConfirmDelete(false)} style={{ flex: 1 }}>Cancelar</Button>
                            <Button $danger onClick={handleDelete} style={{ flex: 1 }}>Sí, Eliminar</Button>
                        </div>
                    </ModalContent>
                </ModalOverlay>
            )}

            {/* --- MODAL HISTORIAL DE ABONOS --- */}
            {showHistoryModal && (
                <ModalOverlay onClick={() => setShowHistoryModal(false)}>
                    <ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: '650px' }}>
                        <CloseButton onClick={() => setShowHistoryModal(false)}><FaTimes /></CloseButton>
                        <h2>Historial de Abonos</h2>
                        <div style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Factura #{selectedInvoice?.numero_factura}</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>{selectedInvoice?.proveedor}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Abonado Total</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#10b981' }}>C${(parseFloat(selectedInvoice?.monto_abonado) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                            </div>
                        </div>

                        {loadingHistory ? (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                                <FaClock className="spin" style={{ fontSize: '1.5rem', marginBottom: '1rem' }} />
                                <p>Cargando historial...</p>
                            </div>
                        ) : historyData.length > 0 ? (
                            <div style={{ overflowX: 'auto' }}>
                                <BITable>
                                    <thead>
                                        <tr>
                                            <th>Fecha</th>
                                            <th>Método</th>
                                            <th>Referencia</th>
                                            <th style={{ textAlign: 'center' }}>Comprobante</th>
                                            <th style={{ textAlign: 'right' }}>Monto</th>
                                            <th style={{ textAlign: 'center' }}>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {historyData.map((abono, idx) => (
                                            <tr key={abono.id || idx}>
                                                <td>{formatDateManagua(abono.fecha)}</td>
                                                <td>
                                                    <StatusBadge bg="#f1f5f9" text="#475569">{abono.metodo_pago}</StatusBadge>
                                                </td>
                                                <td>{abono.referencia || '-'}</td>
                                                <td style={{ textAlign: 'center' }}>
                                                    {abono.comprobante_url ? (
                                                        <a 
                                                            href={resolveFileUrl(abono.comprobante_url)} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            style={{ color: '#ef4444', fontSize: '1.2rem', display: 'inline-flex', alignItems: 'center' }}
                                                            title="Ver Comprobante PDF"
                                                        >
                                                            <FaFilePdf />
                                                        </a>
                                                    ) : (
                                                        <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>—</span>
                                                    )}
                                                </td>
                                                <td className="amount" style={{ color: '#10b981' }}>
                                                    C${parseFloat(abono.monto).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                                                        <Button
                                                            $secondary
                                                            title="Editar abono"
                                                            style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', borderRadius: '8px' }}
                                                            onClick={() => openEditPayModal(abono)}
                                                        >
                                                            <FaEdit />
                                                        </Button>
                                                        <Button
                                                            $danger
                                                            title="Eliminar abono"
                                                            style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', borderRadius: '8px' }}
                                                            onClick={() => handleDeletePayment(abono.id, selectedInvoice?.id)}
                                                        >
                                                            <FaTrashAlt />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </BITable>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', border: '1px dashed #cbd5e1', borderRadius: '16px' }}>
                                <FaMoneyBillWave style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.5 }} />
                                <p>No existen abonos registrados para esta factura.</p>
                            </div>
                        )}
                    </ModalContent>
                </ModalOverlay>
            )}
        </PageWrapper>
    );
};

export default FacturasProveedores;
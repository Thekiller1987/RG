import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { API_URL } from '../service/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  FaArrowLeft,
  FaUserShield,
  FaUserPlus,
  FaUserCheck,
  FaUserLock,
  FaLock,
  FaCheckSquare,
  FaRegSquare,
  FaHistory,
  FaSearch,
  FaSyncAlt,
  FaEdit,
  FaTrashAlt,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaCashRegister,
  FaBoxes,
  FaChartLine,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaFilter
} from 'react-icons/fa';
import {
  PERMISSIONS_CATALOG,
  PERMISSION_CATEGORIES,
  ALL_PERMISSION_KEYS,
  getDefaultPermissionsForRole,
  getAllPermissionsEnabled
} from '../utils/permissions';

const PageWrapper = styled.div`
  padding: clamp(1rem, 3vw, 2.2rem);
  background: #f1f5f9;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const Container = styled.div`
  max-width: 1380px;
  margin: 0 auto;
`;

const TopNav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.4rem;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  text-decoration: none;
  color: #334155;
  font-weight: 700;
  font-size: 0.92rem;
  background: #ffffff;
  padding: 0.6rem 1.1rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);
  transition: all 0.18s;

  &:hover {
    color: #1d4ed8;
    border-color: #93c5fd;
    transform: translateY(-1px);
  }
`;

const HeaderBanner = styled.div`
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 58%, #312e81 100%);
  color: #ffffff;
  border-radius: 20px;
  padding: 1.6rem 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.18);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.2rem;

  .title-block {
    h1 {
      margin: 0;
      font-size: clamp(1.35rem, 2.6vw, 1.95rem);
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 0.7rem;
      letter-spacing: -0.02em;
    }
    p {
      margin: 0.4rem 0 0;
      color: #cbd5e1;
      font-size: 0.9rem;
      max-width: 720px;
      line-height: 1.45;
    }
  }
`;

const PrimaryButton = styled.button`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  border: none;
  padding: 0.8rem 1.35rem;
  border-radius: 12px;
  font-weight: 800;
  font-size: 0.9rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.32);
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(16, 185, 129, 0.45);
  }
`;

const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const KpiCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 1.15rem 1.35rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.04);
  display: flex;
  align-items: center;
  gap: 1rem;

  .icon-box {
    width: 48px;
    height: 48px;
    border-radius: 13px;
    background: ${props => props.$bg || '#eff6ff'};
    color: ${props => props.$color || '#2563eb'};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.35rem;
    flex-shrink: 0;
  }

  .meta {
    span {
      display: block;
      font-size: 0.76rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      color: #64748b;
    }
    strong {
      display: block;
      font-size: 1.35rem;
      font-weight: 800;
      color: #0f172a;
      margin-top: 2px;
    }
    small {
      display: block;
      font-size: 0.74rem;
      color: #64748b;
      margin-top: 2px;
    }
  }
`;

const TabsBar = styled.div`
  display: flex;
  gap: 0.65rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
`;

const TabButton = styled.button`
  padding: 0.75rem 1.35rem;
  border-radius: 12px;
  border: 1px solid ${props => (props.$active ? '#2563eb' : '#cbd5e1')};
  background: ${props => (props.$active ? '#1d4ed8' : '#ffffff')};
  color: ${props => (props.$active ? '#ffffff' : '#334155')};
  font-weight: 800;
  font-size: 0.9rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  transition: all 0.18s;
  box-shadow: ${props => (props.$active ? '0 8px 20px rgba(29, 78, 216, 0.25)' : 'none')};

  &:hover {
    border-color: #2563eb;
  }
`;

const UserGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(390px, 1fr));
  gap: 1.15rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const UserCard = styled.div`
  background: #ffffff;
  border-radius: 18px;
  border: 1px solid ${props => (props.$isMaster ? '#10b981' : props.$inactive ? '#fca5a5' : '#e2e8f0')};
  box-shadow: ${props =>
    props.$isMaster
      ? '0 10px 28px rgba(16, 185, 129, 0.12)'
      : '0 6px 20px rgba(15, 23, 42, 0.05)'};
  padding: 1.3rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: ${props =>
      props.$isMaster
        ? 'linear-gradient(90deg, #059669, #10b981)'
        : props.$inactive
        ? '#ef4444'
        : props.$roleColor || '#2563eb'};
  }
`;

const UserCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;

  .user-identity {
    display: flex;
    align-items: center;
    gap: 0.85rem;

    .avatar {
      width: 46px;
      height: 46px;
      border-radius: 14px;
      background: ${props => (props.$isMaster ? '#ecfdf5' : '#eff6ff')};
      color: ${props => (props.$isMaster ? '#059669' : '#1d4ed8')};
      font-weight: 800;
      font-size: 1.15rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid ${props => (props.$isMaster ? '#a7f3d0' : '#bfdbfe')};
    }

    h3 {
      margin: 0;
      font-size: 1.08rem;
      font-weight: 800;
      color: #0f172a;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    p {
      margin: 2px 0 0;
      font-size: 0.78rem;
      color: #64748b;
    }
  }
`;

const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
`;

const Badge = styled.span`
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 0.71rem;
  font-weight: 800;
  background: ${props => props.$bg || '#eff6ff'};
  color: ${props => props.$color || '#1d4ed8'};
  border: 1px solid ${props => props.$border || 'transparent'};
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const PermProgressBox = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.75rem 0.9rem;

  .top-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.78rem;
    font-weight: 700;
    color: #334155;
    margin-bottom: 6px;
  }

  .bar-bg {
    width: 100%;
    height: 8px;
    background: #e2e8f0;
    border-radius: 999px;
    overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    border-radius: 999px;
    background: ${props =>
      props.$pct === 100
        ? 'linear-gradient(90deg, #059669, #10b981)'
        : 'linear-gradient(90deg, #2563eb, #6366f1)'};
    width: ${props => props.$pct || 0}%;
    transition: width 0.25s ease;
  }
`;

const TraceMiniGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.55rem;

  .metric {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 0.55rem 0.65rem;

    span {
      display: block;
      font-size: 0.67rem;
      color: #64748b;
      font-weight: 700;
      text-transform: uppercase;
    }
    strong {
      display: block;
      font-size: 0.86rem;
      color: #0f172a;
      font-weight: 800;
      margin-top: 2px;
    }
  }
`;

const CardActionsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: auto;
  padding-top: 0.4rem;
  border-top: 1px solid #f1f5f9;

  button {
    flex: 1;
    min-width: 105px;
    padding: 0.58rem 0.75rem;
    border-radius: 10px;
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    transition: all 0.16s;
  }

  .btn-perms {
    background: #eff6ff;
    color: #1d4ed8;
    border: 1px solid #bfdbfe;
    &:hover {
      background: #1d4ed8;
      color: #ffffff;
    }
  }

  .btn-trace {
    background: #f5f3ff;
    color: #6d28d9;
    border: 1px solid #ddd6fe;
    &:hover {
      background: #6d28d9;
      color: #ffffff;
    }
  }

  .btn-edit {
    background: #fefce8;
    color: #a16207;
    border: 1px solid #fde047;
    &:hover {
      background: #eab308;
      color: #ffffff;
    }
  }

  .btn-delete {
    flex: 0 0 auto;
    min-width: 40px;
    background: #fef2f2;
    color: #dc2626;
    border: 1px solid #fecaca;
    &:hover:not(:disabled) {
      background: #dc2626;
      color: #ffffff;
    }
    &:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
  }
`;

// --- MODAL DE USUARIO Y MATRIZ DE PERMISOS ---
const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.72);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 1rem;
`;

const ModalBox = styled(motion.div)`
  background: #ffffff;
  border-radius: 20px;
  width: 100%;
  max-width: ${props => props.$maxWidth || '960px'};
  max-height: 92vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(15, 23, 42, 0.35);
`;

const ModalHeader = styled.div`
  padding: 1.25rem 1.6rem;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
  color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  button.close-x {
    background: rgba(255, 255, 255, 0.14);
    border: none;
    color: #ffffff;
    width: 34px;
    height: 34px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 1rem;
  }
`;

const ModalBody = styled.div`
  padding: 1.4rem 1.6rem;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const ModalFooter = styled.div`
  padding: 1rem 1.6rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 0.9rem;
  background: #f8fafc;
  padding: 1.1rem;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  label {
    font-size: 0.76rem;
    font-weight: 800;
    color: #334155;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }

  input,
  select {
    padding: 0.65rem 0.85rem;
    border-radius: 10px;
    border: 1px solid #cbd5e1;
    font-size: 0.88rem;
    background: #ffffff;
    color: #0f172a;
    outline: none;

    &:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
    }

    &:disabled {
      background: #e2e8f0;
      color: #475569;
      cursor: not-allowed;
    }
  }
`;

const TemplateChipsBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  padding: 0.75rem 1rem;
  border-radius: 12px;

  span.label {
    font-size: 0.78rem;
    font-weight: 800;
    color: #1e3a8a;
    margin-right: 4px;
  }

  button {
    padding: 5px 11px;
    border-radius: 999px;
    border: 1px solid #93c5fd;
    background: #ffffff;
    color: #1d4ed8;
    font-size: 0.74rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s;

    &:hover:not(:disabled) {
      background: #1d4ed8;
      color: #ffffff;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

const CategoryBlock = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
  background: #ffffff;

  .cat-header {
    background: #f8fafc;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;

    h4 {
      margin: 0;
      font-size: 0.9rem;
      font-weight: 800;
      color: #0f172a;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    button {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      color: #334155;
      border-radius: 8px;
      padding: 4px 10px;
      font-size: 0.73rem;
      font-weight: 700;
      cursor: pointer;

      &:hover:not(:disabled) {
        background: #eff6ff;
        border-color: #3b82f6;
        color: #1d4ed8;
      }
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }

  .perm-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(265px, 1fr));
    gap: 0.65rem;
    padding: 0.9rem;
  }
`;

const PermCheckboxCard = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  padding: 0.7rem 0.85rem;
  border-radius: 11px;
  border: 1px solid ${props => (props.$checked ? '#93c5fd' : '#e2e8f0')};
  background: ${props => (props.$checked ? '#eff6ff' : '#ffffff')};
  cursor: ${props => (props.$disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.15s;
  user-select: none;

  &:hover {
    border-color: ${props => (props.$disabled ? '#93c5fd' : '#3b82f6')};
  }

  input {
    margin-top: 3px;
    width: 17px;
    height: 17px;
    accent-color: #2563eb;
    cursor: ${props => (props.$disabled ? 'not-allowed' : 'pointer')};
  }

  .perm-info {
    display: flex;
    flex-direction: column;
    gap: 2px;

    strong {
      font-size: 0.82rem;
      font-weight: 700;
      color: ${props => (props.$checked ? '#1e3a8a' : '#1e293b')};
    }

    span {
      font-size: 0.72rem;
      color: #64748b;
      line-height: 1.35;
    }
  }
`;

// --- SECCIÓN DE TRAZABILIDAD Y BITÁCORA ---
const TraceFilterBar = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1rem 1.2rem;
  margin-bottom: 1.2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  align-items: center;

  select,
  input {
    padding: 0.65rem 0.9rem;
    border-radius: 10px;
    border: 1px solid #cbd5e1;
    font-size: 0.86rem;
    background: #f8fafc;
    color: #0f172a;
    outline: none;

    &:focus {
      border-color: #2563eb;
      background: #ffffff;
    }
  }
`;

const TraceTableWrapper = styled.div`
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  overflow-x: auto;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);

  table {
    width: 100%;
    border-collapse: collapse;
    min-width: 780px;
  }

  th {
    background: #0f172a;
    color: #f8fafc;
    text-align: left;
    padding: 0.9rem 1rem;
    font-size: 0.76rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-weight: 800;
  }

  td {
    padding: 0.85rem 1rem;
    border-bottom: 1px solid #f1f5f9;
    font-size: 0.84rem;
    color: #334155;
    vertical-align: middle;
  }

  tr:hover td {
    background: #f8fafc;
  }
`;

const fmtMoney = n =>
  Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtDateTime = d => {
  if (!d) return 'Sin registro';
  try {
    return new Date(d).toLocaleString('es-NI', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return String(d);
  }
};

const getRoleColor = rol => {
  const r = String(rol || '').toLowerCase();
  if (r.includes('admin')) return '#dc2626';
  if (r.includes('gerente')) return '#7c3aed';
  if (r.includes('contador') || r.includes('finanzas')) return '#059669';
  if (r.includes('inventario') || r.includes('bodeg')) return '#d97706';
  if (r.includes('cajero')) return '#0284c7';
  return '#2563eb';
};

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'traceability'
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal de Crear / Editar Usuario + Matriz de Permisos
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    nombre_completo: '',
    password: '',
    confirmPassword: '',
    rol: 'Vendedor',
    activo: true,
    permisos: getDefaultPermissionsForRole('Vendedor')
  });
  const [showPassword, setShowPassword] = useState(false);
  const [permSearch, setPermSearch] = useState('');
  const [modalError, setModalError] = useState('');
  const [saving, setSaving] = useState(false);

  // Modal de Eliminación
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Estado de Trazabilidad y Bitácora
  const [traceEvents, setTraceEvents] = useState([]);
  const [traceLoading, setTraceLoading] = useState(false);
  const [traceUserFilter, setTraceUserFilter] = useState('todos');
  const [traceModuleFilter, setTraceModuleFilter] = useState('todos');
  const [traceSearch, setTraceSearch] = useState('');

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get(`${API_URL}/users`, getAuthConfig());
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error al cargar los usuarios y permisos.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTraceability = async (customUserId = traceUserFilter, customModulo = traceModuleFilter, customSearch = traceSearch) => {
    try {
      setTraceLoading(true);
      const params = new URLSearchParams();
      if (customUserId && customUserId !== 'todos') params.set('userId', customUserId);
      if (customModulo && customModulo !== 'todos') params.set('modulo', customModulo);
      if (customSearch && customSearch.trim()) params.set('search', customSearch.trim());
      params.set('limit', '250');

      const { data } = await axios.get(`${API_URL}/users/traceability?${params.toString()}`, getAuthConfig());
      setTraceEvents(Array.isArray(data?.events) ? data.events : []);
    } catch (err) {
      toast.error('Error cargando bitácora de trazabilidad');
    } finally {
      setTraceLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTraceability('todos', 'todos', '');
  }, []);

  // Resumen global de KPIs
  const globalStats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.activo !== false).length;
    const totalSalesCount = users.reduce((acc, u) => acc + Number(u.trazabilidad?.total_ventas || 0), 0);
    const totalSalesAmount = users.reduce((acc, u) => acc + Number(u.trazabilidad?.monto_total_vendido || 0), 0);
    const salesTodayAmount = users.reduce((acc, u) => acc + Number(u.trazabilidad?.monto_vendido_hoy || 0), 0);
    return { totalUsers, activeUsers, totalSalesCount, totalSalesAmount, salesTodayAmount };
  }, [users]);

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      nombre_usuario: '',
      nombre_completo: '',
      password: '',
      confirmPassword: '',
      rol: 'Vendedor',
      activo: true,
      permisos: getDefaultPermissionsForRole('Vendedor')
    });
    setPermSearch('');
    setModalError('');
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const openEditModal = user => {
    const isMaster = Boolean(user.es_principal || String(user.nombre_usuario).toLowerCase() === 'admin');
    setEditingUser(user);
    setFormData({
      nombre_usuario: user.nombre_usuario,
      nombre_completo: user.nombre_completo || user.nombre_usuario,
      password: '',
      confirmPassword: '',
      rol: isMaster ? 'Administrador' : user.rol,
      activo: isMaster ? true : user.activo !== false,
      permisos: isMaster
        ? getAllPermissionsEnabled()
        : { ...getDefaultPermissionsForRole(user.rol), ...(user.permisos || {}) }
    });
    setPermSearch('');
    setModalError('');
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleRoleChange = newRole => {
    setFormData(prev => ({
      ...prev,
      rol: newRole,
      permisos: getDefaultPermissionsForRole(newRole)
    }));
  };

  const applyPermissionTemplate = templateName => {
    if (templateName === 'ALL') {
      setFormData(prev => ({ ...prev, permisos: getAllPermissionsEnabled() }));
    } else if (templateName === 'NONE') {
      const empty = {};
      ALL_PERMISSION_KEYS.forEach(k => { empty[k] = false; });
      setFormData(prev => ({ ...prev, permisos: empty }));
    } else {
      setFormData(prev => ({
        ...prev,
        rol: templateName,
        permisos: getDefaultPermissionsForRole(templateName)
      }));
    }
  };

  const toggleSinglePermission = key => {
    if (editingUser && (editingUser.es_principal || String(editingUser.nombre_usuario).toLowerCase() === 'admin')) {
      return;
    }
    setFormData(prev => ({
      ...prev,
      permisos: {
        ...prev.permisos,
        [key]: !prev.permisos[key]
      }
    }));
  };

  const toggleCategoryPermissions = categoryName => {
    if (editingUser && (editingUser.es_principal || String(editingUser.nombre_usuario).toLowerCase() === 'admin')) {
      return;
    }
    const catKeys = PERMISSIONS_CATALOG.filter(p => p.category === categoryName).map(p => p.key);
    const allChecked = catKeys.every(k => Boolean(formData.permisos[k]));
    const nextPerms = { ...formData.permisos };
    catKeys.forEach(k => {
      nextPerms[k] = !allChecked;
    });
    setFormData(prev => ({ ...prev, permisos: nextPerms }));
  };

  const handleSaveUser = async e => {
    e.preventDefault();
    setModalError('');

    if (!editingUser || formData.password) {
      if (formData.password !== formData.confirmPassword) {
        setModalError('Las contraseñas no coinciden.');
        return;
      }
    }

    try {
      setSaving(true);
      if (editingUser) {
        const payload = {
          nombre_usuario: formData.nombre_usuario,
          nombre_completo: formData.nombre_completo,
          rol: formData.rol,
          activo: formData.activo,
          permisos: formData.permisos
        };
        if (formData.password) {
          payload.password = formData.password;
        }
        await axios.put(`${API_URL}/users/${editingUser.id_usuario}`, payload, getAuthConfig());
        toast.success(`Permisos y datos de "${formData.nombre_usuario}" actualizados.`);
      } else {
        await axios.post(
          `${API_URL}/auth/register`,
          {
            nombre_usuario: formData.nombre_usuario,
            nombre_completo: formData.nombre_completo,
            password: formData.password,
            rol: formData.rol,
            permisos: formData.permisos
          },
          getAuthConfig()
        );
        toast.success(`Usuario "${formData.nombre_usuario}" creado con sus permisos.`);
      }
      setIsModalOpen(false);
      await fetchUsers();
      await fetchTraceability();
    } catch (err) {
      setModalError(err.response?.data?.msg || 'Error al guardar el usuario.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await axios.delete(`${API_URL}/users/${userToDelete.id_usuario}`, getAuthConfig());
      toast.success(`Usuario "${userToDelete.nombre_usuario}" eliminado.`);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      await fetchUsers();
      await fetchTraceability();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'No se pudo eliminar el usuario.');
      setIsDeleteModalOpen(false);
    }
  };

  const handleViewUserTrace = user => {
    const uid = String(user.id_usuario);
    setTraceUserFilter(uid);
    setActiveTab('traceability');
    fetchTraceability(uid, traceModuleFilter, traceSearch);
  };

  const selectedTraceUser = useMemo(() => {
    if (!traceUserFilter || traceUserFilter === 'todos') return null;
    return users.find(u => String(u.id_usuario) === String(traceUserFilter)) || null;
  }, [users, traceUserFilter]);

  const activeModalPermissionsCount = useMemo(() => {
    return ALL_PERMISSION_KEYS.filter(k => Boolean(formData.permisos?.[k])).length;
  }, [formData.permisos]);

  const isEditingMasterAdmin = Boolean(
    editingUser && (editingUser.es_principal || String(editingUser.nombre_usuario).toLowerCase() === 'admin')
  );

  return (
    <PageWrapper>
      <Container>
        <TopNav>
          <BackButton to="/dashboard">
            <FaArrowLeft /> Volver al Dashboard
          </BackButton>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <TabButton
              type="button"
              $active={activeTab === 'users'}
              onClick={() => setActiveTab('users')}
            >
              <FaUserShield /> Usuarios y Casillas de Permisos ({users.length})
            </TabButton>
            <TabButton
              type="button"
              $active={activeTab === 'traceability'}
              onClick={() => {
                setActiveTab('traceability');
                fetchTraceability(traceUserFilter, traceModuleFilter, traceSearch);
              }}
            >
              <FaHistory /> Trazabilidad y Bitácora por Usuario
            </TabButton>
          </div>
        </TopNav>

        <HeaderBanner>
          <div className="title-block">
            <h1>
              <FaShieldAlt color="#34d399" />
              Control Maestro de Usuarios, Permisos y Trazabilidad
            </h1>
            <p>
              Configura con casillas marcables qué módulos puede ver y qué acciones puede realizar cada usuario.
              El usuario principal <strong>admin</strong> (clave <strong>1987</strong>) está blindado y conserva control total permanente.
            </p>
          </div>
          <PrimaryButton type="button" onClick={openCreateModal}>
            <FaUserPlus /> Crear Nuevo Usuario
          </PrimaryButton>
        </HeaderBanner>

        <KpiGrid>
          <KpiCard $bg="#eff6ff" $color="#1d4ed8">
            <div className="icon-box">
              <FaUsers />
            </div>
            <div className="meta">
              <span>Usuarios Registrados</span>
              <strong>{globalStats.totalUsers} cuentas</strong>
              <small>{globalStats.activeUsers} activos en el sistema</small>
            </div>
          </KpiCard>

          <KpiCard $bg="#ecfdf5" $color="#059669">
            <div className="icon-box">
              <FaLock />
            </div>
            <div className="meta">
              <span>Admin Principal Blindado</span>
              <strong>admin (Clave: 1987)</strong>
              <small>Inmutable · No puede borrarse ni restringirse</small>
            </div>
          </KpiCard>

          <KpiCard $bg="#f5f3ff" $color="#6d28d9">
            <div className="icon-box">
              <FaCashRegister />
            </div>
            <div className="meta">
              <span>Ventas de Hoy Trazadas</span>
              <strong>C$ {fmtMoney(globalStats.salesTodayAmount)}</strong>
              <small>Facturación del día por usuario</small>
            </div>
          </KpiCard>

          <KpiCard $bg="#fff7ed" $color="#ea580c">
            <div className="icon-box">
              <FaChartLine />
            </div>
            <div className="meta">
              <span>Trazabilidad Histórica</span>
              <strong>{globalStats.totalSalesCount.toLocaleString()} facturas</strong>
              <small>C$ {fmtMoney(globalStats.totalSalesAmount)} acumulados</small>
            </div>
          </KpiCard>
        </KpiGrid>

        {loading ? (
          <div style={{ background: '#fff', padding: '2.5rem', borderRadius: 16, textAlign: 'center', fontWeight: 700, color: '#475569' }}>
            Cargando usuarios, permisos y métricas de trazabilidad...
          </div>
        ) : error ? (
          <div style={{ background: '#fef2f2', padding: '1.5rem', borderRadius: 16, color: '#dc2626', fontWeight: 700 }}>
            {error}
          </div>
        ) : activeTab === 'users' ? (
          <UserGrid>
            {users.map(u => {
              const isMaster = Boolean(u.es_principal || String(u.nombre_usuario).toLowerCase() === 'admin');
              const activeCount = Number(u.permisos_activos_count ?? ALL_PERMISSION_KEYS.length);
              const totalCount = Number(u.permisos_totales_count || ALL_PERMISSION_KEYS.length);
              const pct = Math.round((activeCount / totalCount) * 100);
              const tr = u.trazabilidad || {};

              return (
                <UserCard
                  key={u.id_usuario}
                  $isMaster={isMaster}
                  $inactive={!u.activo}
                  $roleColor={getRoleColor(u.rol)}
                >
                  <UserCardHeader $isMaster={isMaster}>
                    <div className="user-identity">
                      <div className="avatar">
                        {isMaster ? <FaLock /> : String(u.nombre_usuario || 'U').substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3>
                          {u.nombre_usuario}
                          {isMaster && (
                            <Badge $bg="#dcfce7" $color="#166534" $border="#86efac">
                              🔒 Principal (1987)
                            </Badge>
                          )}
                        </h3>
                        <p>
                          ID #{u.id_usuario} · {u.nombre_completo || u.nombre_usuario}
                        </p>
                      </div>
                    </div>

                    <BadgeRow>
                      <Badge $bg={`${getRoleColor(u.rol)}15`} $color={getRoleColor(u.rol)}>
                        {u.rol}
                      </Badge>
                      {u.activo ? (
                        <Badge $bg="#ecfdf5" $color="#059669">
                          <FaCheckCircle size={10} /> Activo
                        </Badge>
                      ) : (
                        <Badge $bg="#fef2f2" $color="#dc2626">
                          <FaTimesCircle size={10} /> Suspendido
                        </Badge>
                      )}
                    </BadgeRow>
                  </UserCardHeader>

                  <PermProgressBox $pct={pct}>
                    <div className="top-row">
                      <span>Permisos y Acciones Habilitadas</span>
                      <strong>
                        {activeCount} / {totalCount} casillas ({pct}%)
                      </strong>
                    </div>
                    <div className="bar-bg">
                      <div className="bar-fill" />
                    </div>
                  </PermProgressBox>

                  <TraceMiniGrid>
                    <div className="metric">
                      <span>Ventas Hoy</span>
                      <strong>C$ {fmtMoney(tr.monto_vendido_hoy)}</strong>
                      <span>{tr.ventas_hoy || 0} tickets</span>
                    </div>
                    <div className="metric">
                      <span>Facturado Total</span>
                      <strong>C$ {fmtMoney(tr.monto_total_vendido)}</strong>
                      <span>{tr.total_ventas || 0} facturas</span>
                    </div>
                    <div className="metric">
                      <span>Cajas / Devol.</span>
                      <strong>{tr.cajas_operadas || 0} cajas</strong>
                      <span>{tr.devoluciones_count || 0} devol./anul.</span>
                    </div>
                  </TraceMiniGrid>

                  <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Última actividad registrada:</span>
                    <strong style={{ color: '#334155' }}>{fmtDateTime(tr.ultima_actividad)}</strong>
                  </div>

                  <CardActionsRow>
                    <button type="button" className="btn-perms" onClick={() => openEditModal(u)}>
                      <FaCheckSquare /> Permisos ({activeCount}/{totalCount})
                    </button>
                    <button type="button" className="btn-trace" onClick={() => handleViewUserTrace(u)}>
                      <FaHistory /> Trazabilidad
                    </button>
                    <button type="button" className="btn-edit" onClick={() => openEditModal(u)}>
                      <FaEdit /> Editar
                    </button>
                    <button
                      type="button"
                      className="btn-delete"
                      disabled={isMaster}
                      title={
                        isMaster
                          ? 'El usuario admin principal (1987) está protegido y no puede ser eliminado'
                          : 'Eliminar usuario'
                      }
                      onClick={() => {
                        setUserToDelete(u);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      {isMaster ? <FaLock /> : <FaTrashAlt />}
                    </button>
                  </CardActionsRow>
                </UserCard>
              );
            })}
          </UserGrid>
        ) : (
          /* TAB 2: TRAZABILIDAD Y BITÁCORA POR USUARIO */
          <div>
            <TraceFilterBar>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, color: '#0f172a', fontSize: '0.86rem' }}>
                <FaFilter color="#2563eb" /> Filtros de Trazabilidad:
              </div>

              <select
                value={traceUserFilter}
                onChange={e => {
                  const val = e.target.value;
                  setTraceUserFilter(val);
                  fetchTraceability(val, traceModuleFilter, traceSearch);
                }}
              >
                <option value="todos">👥 Todos los Usuarios ({users.length})</option>
                {users.map(u => (
                  <option key={u.id_usuario} value={String(u.id_usuario)}>
                    {u.nombre_usuario} ({u.rol}) — {u.trazabilidad?.total_ventas || 0} ventas
                  </option>
                ))}
              </select>

              <select
                value={traceModuleFilter}
                onChange={e => {
                  const val = e.target.value;
                  setTraceModuleFilter(val);
                  fetchTraceability(traceUserFilter, val, traceSearch);
                }}
              >
                <option value="todos">📦 Todos los Módulos</option>
                <option value="POS">🛒 POS / Ventas</option>
                <option value="Caja">💵 Caja y Arqueos</option>
                <option value="Inventario">📦 Inventario</option>
                <option value="Clientes">💳 Clientes y Créditos</option>
                <option value="Finanzas">📊 Finanzas</option>
                <option value="Traslados">🚚 Traslados / Salidas</option>
                <option value="Usuarios">🛡️ Usuarios y Permisos</option>
                <option value="Autenticación">🔑 Inicios de Sesión</option>
              </select>

              <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
                <input
                  type="text"
                  placeholder="Buscar por factura, monto, repuesto, usuario o acción..."
                  value={traceSearch}
                  onChange={e => setTraceSearch(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') fetchTraceability(traceUserFilter, traceModuleFilter, traceSearch);
                  }}
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              <PrimaryButton
                type="button"
                onClick={() => fetchTraceability(traceUserFilter, traceModuleFilter, traceSearch)}
                style={{ padding: '0.65rem 1.1rem', fontSize: '0.84rem' }}
              >
                <FaSyncAlt /> Actualizar Bitácora
              </PrimaryButton>
            </TraceFilterBar>

            {selectedTraceUser && (
              <div
                style={{
                  background: '#ffffff',
                  border: '2px solid #3b82f6',
                  borderRadius: 16,
                  padding: '1.1rem 1.4rem',
                  marginBottom: '1.2rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase' }}>
                    Expediente de Trazabilidad del Usuario
                  </div>
                  <h3 style={{ margin: '4px 0', fontSize: '1.2rem', color: '#0f172a' }}>
                    {selectedTraceUser.nombre_usuario} ({selectedTraceUser.rol})
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    Permisos habilitados: <strong>{selectedTraceUser.permisos_activos_count}/{selectedTraceUser.permisos_totales_count}</strong> ·
                    Última actividad: <strong>{fmtDateTime(selectedTraceUser.trazabilidad?.ultima_actividad)}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>VENTAS HOY</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#059669' }}>
                      C$ {fmtMoney(selectedTraceUser.trazabilidad?.monto_vendido_hoy)} ({selectedTraceUser.trazabilidad?.ventas_hoy || 0})
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>FACTURADO HISTÓRICO</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                      C$ {fmtMoney(selectedTraceUser.trazabilidad?.monto_total_vendido)} ({selectedTraceUser.trazabilidad?.total_ventas || 0} tks)
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>CAJAS / DEVOLUCIONES</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#7c3aed' }}>
                      {selectedTraceUser.trazabilidad?.cajas_operadas || 0} cajas · {selectedTraceUser.trazabilidad?.devoluciones_count || 0} devol.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openEditModal(selectedTraceUser)}
                    style={{
                      padding: '0.55rem 1rem',
                      borderRadius: 10,
                      border: '1px solid #2563eb',
                      background: '#eff6ff',
                      color: '#1d4ed8',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    🛡️ Configurar Permisos
                  </button>
                </div>
              </div>
            )}

            <TraceTableWrapper>
              <table>
                <thead>
                  <tr>
                    <th>Fecha y Hora</th>
                    <th>Usuario</th>
                    <th>Rol</th>
                    <th>Módulo</th>
                    <th>Acción Realizada</th>
                    <th>Detalle / Trazabilidad</th>
                  </tr>
                </thead>
                <tbody>
                  {traceLoading ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', fontWeight: 700, color: '#64748b' }}>
                        Consultando bitácora de trazabilidad en tiempo real...
                      </td>
                    </tr>
                  ) : traceEvents.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                        No se encontraron registros para los filtros seleccionados.
                      </td>
                    </tr>
                  ) : (
                    traceEvents.map(ev => {
                      const isAlert =
                        String(ev.accion).includes('DEVOL') ||
                        String(ev.accion).includes('ELIMIN') ||
                        String(ev.accion).includes('ANUL') ||
                        String(ev.accion).includes('FALLIDO');
                      const isSale = String(ev.accion).includes('VENTA');
                      return (
                        <tr key={ev.uid}>
                          <td style={{ whiteSpace: 'nowrap', fontWeight: 600 }}>{fmtDateTime(ev.fecha)}</td>
                          <td>
                            <strong style={{ color: '#0f172a' }}>{ev.nombre_usuario}</strong>
                          </td>
                          <td>
                            <Badge $bg="#f1f5f9" $color="#334155">
                              {ev.rol || 'Usuario'}
                            </Badge>
                          </td>
                          <td>
                            <Badge $bg="#eff6ff" $color="#1d4ed8">
                              {ev.modulo}
                            </Badge>
                          </td>
                          <td>
                            <Badge
                              $bg={isAlert ? '#fef2f2' : isSale ? '#ecfdf5' : '#f5f3ff'}
                              $color={isAlert ? '#dc2626' : isSale ? '#059669' : '#6d28d9'}
                            >
                              {ev.accion}
                            </Badge>
                          </td>
                          <td style={{ lineHeight: 1.45 }}>
                            {ev.descripcion}
                            {ev.ip && (
                              <span style={{ marginLeft: 8, fontSize: '0.72rem', color: '#94a3b8' }}>
                                (IP: {ev.ip})
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </TraceTableWrapper>
          </div>
        )}

        {/* MODAL DE CREACIÓN / EDICIÓN DE USUARIO Y CASILLAS DE PERMISOS */}
        <AnimatePresence>
          {isModalOpen && (
            <ModalOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
            >
              <ModalBox
                as="form"
                onSubmit={handleSaveUser}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.97 }}
                onClick={e => e.stopPropagation()}
              >
                <ModalHeader>
                  <h2>
                    <FaUserShield />
                    {editingUser
                      ? `Configurar Usuario y Permisos: ${editingUser.nombre_usuario}`
                      : 'Crear Nuevo Usuario con Control de Permisos'}
                  </h2>
                  <button type="button" className="close-x" onClick={() => setIsModalOpen(false)}>
                    ✕
                  </button>
                </ModalHeader>

                <ModalBody>
                  {isEditingMasterAdmin && (
                    <div
                      style={{
                        background: '#ecfdf5',
                        border: '1px solid #6ee7b7',
                        color: '#065f46',
                        padding: '0.85rem 1.1rem',
                        borderRadius: 12,
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem'
                      }}
                    >
                      <FaLock size={16} />
                      El usuario principal &quot;admin&quot; (contraseña fija 1987) está protegido por el sistema: tiene todas las casillas habilitadas permanentemente y no puede ser eliminado ni restringido.
                    </div>
                  )}

                  {modalError && (
                    <div
                      style={{
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        color: '#dc2626',
                        padding: '0.75rem 1rem',
                        borderRadius: 10,
                        fontSize: '0.85rem',
                        fontWeight: 700
                      }}
                    >
                      ⚠️ {modalError}
                    </div>
                  )}

                  <FormGrid>
                    <FieldGroup>
                      <label>Usuario de Acceso *</label>
                      <input
                        type="text"
                        placeholder="Ej: cajero1, bodega_rg"
                        value={formData.nombre_usuario}
                        disabled={isEditingMasterAdmin}
                        onChange={e => setFormData(p => ({ ...p, nombre_usuario: e.target.value }))}
                        required
                      />
                    </FieldGroup>

                    <FieldGroup>
                      <label>Nombre Completo / Etiqueta</label>
                      <input
                        type="text"
                        placeholder="Ej: Juan Pérez (Cajero Turno A)"
                        value={formData.nombre_completo}
                        onChange={e => setFormData(p => ({ ...p, nombre_completo: e.target.value }))}
                      />
                    </FieldGroup>

                    <FieldGroup>
                      <label>Rol Base / Perfil</label>
                      <select
                        value={formData.rol}
                        disabled={isEditingMasterAdmin}
                        onChange={e => handleRoleChange(e.target.value)}
                      >
                        <option value="Vendedor">Vendedor</option>
                        <option value="Cajero">Cajero</option>
                        <option value="Encargado de Inventario">Encargado de Inventario / Bodega</option>
                        <option value="Contador">Contador / Finanzas</option>
                        <option value="Gerente">Gerente / Supervisor</option>
                        <option value="Administrador">Administrador</option>
                      </select>
                    </FieldGroup>

                    <FieldGroup>
                      <label>Estado de la Cuenta</label>
                      <select
                        value={formData.activo ? '1' : '0'}
                        disabled={isEditingMasterAdmin}
                        onChange={e => setFormData(p => ({ ...p, activo: e.target.value === '1' }))}
                      >
                        <option value="1">✅ Activo (Puede iniciar sesión)</option>
                        <option value="0">🚫 Suspendido (Acceso bloqueado)</option>
                      </select>
                    </FieldGroup>

                    <FieldGroup>
                      <label>
                        {isEditingMasterAdmin
                          ? 'Contraseña Fija (Blindada)'
                          : editingUser
                          ? 'Nueva Contraseña (Opcional)'
                          : 'Contraseña *'}
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder={
                            isEditingMasterAdmin
                              ? '1987 (Protegida)'
                              : editingUser
                              ? 'Dejar vacío para no cambiar'
                              : 'Ingresa contraseña'
                          }
                          value={isEditingMasterAdmin ? '1987' : formData.password}
                          disabled={isEditingMasterAdmin}
                          onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
                          required={!editingUser}
                          style={{ width: '100%', boxSizing: 'border-box', paddingRight: 36 }}
                        />
                        {!isEditingMasterAdmin && (
                          <span
                            onClick={() => setShowPassword(s => !s)}
                            style={{
                              position: 'absolute',
                              right: 10,
                              top: 10,
                              cursor: 'pointer',
                              color: '#64748b'
                            }}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </span>
                        )}
                      </div>
                    </FieldGroup>

                    {(!editingUser || formData.password) && !isEditingMasterAdmin && (
                      <FieldGroup>
                        <label>Confirmar Contraseña *</label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Repite la contraseña"
                          value={formData.confirmPassword}
                          onChange={e => setFormData(p => ({ ...p, confirmPassword: e.target.value }))}
                          required
                        />
                      </FieldGroup>
                    )}
                  </FormGrid>

                  {/* BARRA DE PLANTILLAS RÁPIDAS Y BUSCADOR DE CASILLAS */}
                  <TemplateChipsBar>
                    <span className="label">⚡ Plantillas Rápidas de Casillas:</span>
                    <button
                      type="button"
                      disabled={isEditingMasterAdmin}
                      onClick={() => applyPermissionTemplate('ALL')}
                    >
                      ✅ Marcar Todo ({ALL_PERMISSION_KEYS.length})
                    </button>
                    <button
                      type="button"
                      disabled={isEditingMasterAdmin}
                      onClick={() => applyPermissionTemplate('Gerente')}
                    >
                      👔 Perfil Gerente
                    </button>
                    <button
                      type="button"
                      disabled={isEditingMasterAdmin}
                      onClick={() => applyPermissionTemplate('Cajero')}
                    >
                      💵 Perfil Cajero
                    </button>
                    <button
                      type="button"
                      disabled={isEditingMasterAdmin}
                      onClick={() => applyPermissionTemplate('Vendedor')}
                    >
                      🛒 Perfil Vendedor
                    </button>
                    <button
                      type="button"
                      disabled={isEditingMasterAdmin}
                      onClick={() => applyPermissionTemplate('Encargado de Inventario')}
                    >
                      📦 Perfil Bodega / Inventario
                    </button>
                    <button
                      type="button"
                      disabled={isEditingMasterAdmin}
                      onClick={() => applyPermissionTemplate('Contador')}
                    >
                      📊 Perfil Contador
                    </button>
                    <button
                      type="button"
                      disabled={isEditingMasterAdmin}
                      onClick={() => applyPermissionTemplate('NONE')}
                    >
                      ☐ Desmarcar Todo
                    </button>

                    <input
                      type="text"
                      placeholder="🔍 Filtrar casilla o permiso..."
                      value={permSearch}
                      onChange={e => setPermSearch(e.target.value)}
                      style={{
                        marginLeft: 'auto',
                        padding: '5px 11px',
                        borderRadius: 8,
                        border: '1px solid #93c5fd',
                        fontSize: '0.78rem',
                        outline: 'none'
                      }}
                    />
                  </TemplateChipsBar>

                  {/* MATRIZ DE CASILLAS MARCABLES POR CATEGORÍA */}
                  {PERMISSION_CATEGORIES.map(category => {
                    const items = PERMISSIONS_CATALOG.filter(p => {
                      if (p.category !== category) return false;
                      if (!permSearch.trim()) return true;
                      const q = permSearch.trim().toLowerCase();
                      return (
                        p.label.toLowerCase().includes(q) ||
                        p.description.toLowerCase().includes(q) ||
                        p.key.toLowerCase().includes(q)
                      );
                    });

                    if (items.length === 0) return null;

                    const catCheckedCount = items.filter(i => Boolean(formData.permisos?.[i.key])).length;
                    const allCatChecked = catCheckedCount === items.length;

                    return (
                      <CategoryBlock key={category}>
                        <div className="cat-header">
                          <h4>
                            {category}
                            <Badge $bg="#eff6ff" $color="#1d4ed8">
                              {catCheckedCount} / {items.length} marcados
                            </Badge>
                          </h4>
                          <button
                            type="button"
                            disabled={isEditingMasterAdmin}
                            onClick={() => toggleCategoryPermissions(category)}
                          >
                            {allCatChecked ? 'Desmarcar sección' : 'Marcar toda la sección'}
                          </button>
                        </div>

                        <div className="perm-grid">
                          {items.map(perm => {
                            const checked = Boolean(formData.permisos?.[perm.key]);
                            return (
                              <PermCheckboxCard
                                key={perm.key}
                                $checked={checked}
                                $disabled={isEditingMasterAdmin}
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  disabled={isEditingMasterAdmin}
                                  onChange={() => toggleSinglePermission(perm.key)}
                                />
                                <div className="perm-info">
                                  <strong>{perm.label}</strong>
                                  <span>{perm.description}</span>
                                </div>
                              </PermCheckboxCard>
                            );
                          })}
                        </div>
                      </CategoryBlock>
                    );
                  })}
                </ModalBody>

                <ModalFooter>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#334155' }}>
                    Casillas marcadas para este usuario:{' '}
                    <strong style={{ color: '#1d4ed8' }}>
                      {activeModalPermissionsCount} de {ALL_PERMISSION_KEYS.length} permisos
                    </strong>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      style={{
                        padding: '0.7rem 1.2rem',
                        borderRadius: 10,
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        color: '#475569',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Cancelar
                    </button>
                    <PrimaryButton type="submit" disabled={saving}>
                      <FaUserCheck />
                      {saving
                        ? 'Guardando...'
                        : editingUser
                        ? 'Guardar Usuario y Permisos'
                        : 'Crear Usuario con estos Permisos'}
                    </PrimaryButton>
                  </div>
                </ModalFooter>
              </ModalBox>
            </ModalOverlay>
          )}
        </AnimatePresence>

        {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
        <AnimatePresence>
          {isDeleteModalOpen && userToDelete && (
            <ModalOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
            >
              <ModalBox
                $maxWidth="460px"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={e => e.stopPropagation()}
              >
                <ModalHeader>
                  <h2>Confirmar Eliminación de Usuario</h2>
                  <button type="button" className="close-x" onClick={() => setIsDeleteModalOpen(false)}>
                    ✕
                  </button>
                </ModalHeader>
                <ModalBody>
                  <p style={{ margin: 0, color: '#334155', lineHeight: 1.5 }}>
                    ¿Estás seguro de que deseas eliminar al usuario{' '}
                    <strong>{userToDelete.nombre_usuario}</strong>?
                  </p>
                  <p style={{ margin: 0, fontSize: '0.83rem', color: '#64748b' }}>
                    💡 <em>Nota:</em> Si el usuario tiene ventas o cajas históricas, puedes mejor{' '}
                    <strong>suspender su cuenta</strong> o desmarcar sus permisos para conservar intacta su trazabilidad.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(false)}
                    style={{
                      padding: '0.65rem 1.1rem',
                      borderRadius: 10,
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={confirmDelete}
                    style={{
                      padding: '0.65rem 1.2rem',
                      borderRadius: 10,
                      border: 'none',
                      background: '#dc2626',
                      color: '#ffffff',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    Sí, Eliminar Usuario
                  </button>
                </ModalFooter>
              </ModalBox>
            </ModalOverlay>
          )}
        </AnimatePresence>
      </Container>
    </PageWrapper>
  );
};

export default UserManagement;

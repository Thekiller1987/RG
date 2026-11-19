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
  FaLock,
  FaCheckSquare,
  FaHistory,
  FaSearch,
  FaSyncAlt,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaFilter,
  FaTimes,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import {
  PERMISSIONS_CATALOG,
  PERMISSION_CATEGORIES,
  ALL_PERMISSION_KEYS,
  SYSTEM_MODULES_MAP,
  getDefaultPermissionsForRole,
  getAllPermissionsEnabled
} from '../utils/permissions';

/* ================================
   ESTÉTICA LIMPIA TIPO INVENTARIO
================================ */
const PageWrapper = styled.div`
  padding: 20px;
  background-color: #f8fafc;
  min-height: 100vh;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  @media (max-width: 640px) {
    padding: 10px;
  }
`;

const Container = styled.div`
  max-width: 1380px;
  margin: 0 auto;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 8px 12px;
  margin-bottom: 1rem;
  border-radius: 8px;
  transition: all 0.2s;
  &:hover {
    color: #3b82f6;
    background: #eff6ff;
    transform: translateX(-4px);
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(12px);
  padding: 1rem 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  position: sticky;
  top: 10px;
  z-index: 40;
  border: 1px solid rgba(255, 255, 255, 0.6);
  @media (min-width: 1024px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
  font-weight: 800;
  svg {
    color: #3b82f6;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const Button = styled.button`
  border: none;
  padding: 0.65rem 1.2rem;
  border-radius: 99px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  ${p => p.primary && `
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    &:hover:not(:disabled) { box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); transform: translateY(-1px); }
  `}
  ${p => p.secondary && `
    background: white;
    color: #475569;
    border: 1px solid #cbd5e1;
    &:hover:not(:disabled) { border-color: #94a3b8; background: #f8fafc; color: #1e293b; }
  `}
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: white;
  padding: 1.15rem 1.25rem;
  border-radius: 16px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.08);
  margin-bottom: 1.5rem;
  border: 1px solid #e2e8f0;
  @media (min-width: 1024px) {
    flex-direction: row;
    align-items: center;
  }
`;

const SearchInputWrapper = styled.div`
  position: relative;
  flex: 2;
  min-width: 240px;
`;

const SearchInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 0.72rem 1rem 0.72rem 2.6rem;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  font-size: 0.94rem;
  background-color: #f8fafc;
  transition: all 0.2s;
  outline: none;
  &:focus {
    border-color: #3b82f6;
    background: white;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Select = styled.select`
  padding: 0.72rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  background-color: #f8fafc;
  color: #334155;
  outline: none;
  flex: 1;
  font-size: 0.9rem;
  cursor: pointer;
  &:focus {
    border-color: #3b82f6;
    background: white;
  }
`;

/* Tarjetas de Usuario Limpias y Compactas */
const UserGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  gap: 1.25rem;
`;

const UserCard = styled(motion.div)`
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: all 0.2s;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 20px -5px rgba(0, 0, 0, 0.08);
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
      border-radius: 12px;
      background: ${props => (props.$isMaster ? '#ecfdf5' : '#eff6ff')};
      color: ${props => (props.$isMaster ? '#059669' : '#2563eb')};
      font-weight: 800;
      font-size: 1.05rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid ${props => (props.$isMaster ? '#a7f3d0' : '#bfdbfe')};
      flex-shrink: 0;
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
      font-size: 0.8rem;
      color: #64748b;
    }
  }
`;

const Badge = styled.span`
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  background: ${props => props.$bg || '#eff6ff'};
  color: ${props => props.$color || '#1d4ed8'};
  border: 1px solid ${props => props.$border || 'transparent'};
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const AccessSummaryBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.65rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.75rem;

  .stat-item {
    display: flex;
    flex-direction: column;
    span.lbl {
      font-size: 0.68rem;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
    }
    strong.val {
      font-size: 0.95rem;
      font-weight: 800;
      color: #0f172a;
      margin-top: 2px;
    }
  }
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.58rem 0.75rem;
  border-radius: 10px;
  border: 1px solid;
  cursor: pointer;
  font-size: 0.82rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s;
  &.perms {
    background: #eff6ff;
    border-color: #bfdbfe;
    color: #1d4ed8;
    &:hover:not(:disabled) { background: #dbeafe; }
  }
  &.edit {
    background: #f0f9ff;
    border-color: #bae6fd;
    color: #0284c7;
    &:hover:not(:disabled) { background: #e0f2fe; }
  }
  &.trace {
    background: #f8fafc;
    border-color: #cbd5e1;
    color: #475569;
    &:hover:not(:disabled) { background: #f1f5f9; color: #0f172a; }
  }
  &.delete {
    flex: 0 0 auto;
    padding: 0.58rem 0.75rem;
    background: #fef2f2;
    border-color: #fecaca;
    color: #ef4444;
    &:hover:not(:disabled) { background: #fee2e2; color: #dc2626; }
  }
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

/* ================================
   MODAL DE USUARIO Y PERMISOS (SIN FLEX-COLLAPSE)
================================ */
const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(5px);
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
  box-shadow: 0 25px 60px -12px rgba(15, 23, 42, 0.35);
  border: 1px solid #e2e8f0;
`;

const ModalHeader = styled.div`
  padding: 1.15rem 1.5rem;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;

  h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 800;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    svg { color: #3b82f6; }
  }

  button.close-x {
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    color: #475569;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    transition: all 0.2s;
    &:hover {
      background: #fee2e2;
      color: #dc2626;
      border-color: #fecaca;
    }
  }
`;

/* IMPORTANTE: display: block en ModalBody evita que los bloques hijos colapsen con flex-shrink */
const ModalBody = styled.div`
  padding: 1.35rem 1.5rem;
  overflow-y: auto;
  flex: 1;
  display: block;
  background: #f8fafc;
  & > * + * {
    margin-top: 1.15rem;
  }
`;

const ModalFooter = styled.div`
  padding: 1rem 1.5rem;
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  flex-shrink: 0;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 0.9rem;
  background: #ffffff;
  padding: 1.15rem;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  label {
    font-size: 0.78rem;
    font-weight: 700;
    color: #475569;
  }

  input,
  select {
    padding: 0.65rem 0.85rem;
    border-radius: 10px;
    border: 1px solid #cbd5e1;
    font-size: 0.9rem;
    background: #f8fafc;
    color: #0f172a;
    outline: none;

    &:focus {
      border-color: #3b82f6;
      background: #ffffff;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    &:disabled {
      background: #f1f5f9;
      color: #64748b;
      cursor: not-allowed;
    }
  }
`;

const TemplateChipsBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 0.85rem 1rem;
  border-radius: 14px;

  span.label {
    font-size: 0.8rem;
    font-weight: 700;
    color: #334155;
    margin-right: 4px;
  }

  button {
    padding: 6px 12px;
    border-radius: 99px;
    border: 1px solid #cbd5e1;
    background: #f8fafc;
    color: #334155;
    font-size: 0.76rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;

    &:hover:not(:disabled) {
      background: #eff6ff;
      border-color: #93c5fd;
      color: #1d4ed8;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

const ModulesQuickGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.6rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 1rem;
`;

const ModuleQuickSwitch = styled.button`
  type: button;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 0.8rem;
  border-radius: 10px;
  border: 1px solid ${p => p.$active ? '#86efac' : '#e2e8f0'};
  background: ${p => p.$active ? '#f0fdf4' : '#f8fafc'};
  color: ${p => p.$active ? '#166534' : '#64748b'};
  font-size: 0.8rem;
  font-weight: 700;
  cursor: ${p => p.disabled ? 'not-allowed' : 'pointer'};
  text-align: left;
  transition: all 0.15s;
  &:hover:not(:disabled) {
    border-color: ${p => p.$active ? '#4ade80' : '#94a3b8'};
  }
`;

const CategoryBlock = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: #ffffff;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);

  .cat-header {
    background: #f8fafc;
    padding: 0.85rem 1.1rem;
    border-bottom: 1px solid #e2e8f0;
    border-radius: 14px 14px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    cursor: pointer;

    h4 {
      margin: 0;
      font-size: 0.92rem;
      font-weight: 800;
      color: #0f172a;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .cat-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    button.toggle-all {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      color: #334155;
      border-radius: 8px;
      padding: 5px 11px;
      font-size: 0.75rem;
      font-weight: 600;
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
    grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
    gap: 0.65rem;
    padding: 1rem;
  }
`;

const PermCheckboxCard = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  padding: 0.7rem 0.85rem;
  border-radius: 10px;
  border: 1px solid ${props => (props.$checked ? '#93c5fd' : '#e2e8f0')};
  background: ${props => (props.$checked ? '#eff6ff' : '#ffffff')};
  cursor: ${props => (props.$disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.15s;
  user-select: none;

  &:hover {
    border-color: ${props => (props.$disabled ? '#93c5fd' : '#3b82f6')};
  }

  input {
    margin-top: 2px;
    width: 17px;
    height: 17px;
    accent-color: #2563eb;
    flex-shrink: 0;
    cursor: ${props => (props.$disabled ? 'not-allowed' : 'pointer')};
  }

  .perm-info {
    display: flex;
    flex-direction: column;
    gap: 2px;

    strong {
      font-size: 0.83rem;
      font-weight: 700;
      color: ${props => (props.$checked ? '#1e3a8a' : '#1e293b')};
    }

    span {
      font-size: 0.73rem;
      color: #64748b;
      line-height: 1.35;
    }
  }
`;

const TraceTableWrapper = styled.div`
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  overflow-x: auto;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04);

  table {
    width: 100%;
    border-collapse: collapse;
    min-width: 760px;
  }

  th {
    background: #f8fafc;
    color: #475569;
    text-align: left;
    padding: 0.95rem 1.15rem;
    font-size: 0.76rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-weight: 700;
    border-bottom: 1px solid #e2e8f0;
  }

  td {
    padding: 0.9rem 1.15rem;
    border-bottom: 1px solid #f1f5f9;
    font-size: 0.85rem;
    color: #334155;
    vertical-align: middle;
  }

  tr:hover td {
    background: #f8fafc;
  }
`;

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
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros de la vista principal de usuarios
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Modal de Crear / Editar Usuario + Permisos
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
  const [collapsedCategories, setCollapsedCategories] = useState({});
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
      setError(err.response?.data?.msg || 'Error al cargar los usuarios.');
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
      toast.error('Error cargando historial de actividad');
    } finally {
      setTraceLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTraceability('todos', 'todos', '');
  }, []);

  const filteredUsers = useMemo(() => {
    const q = userSearch.trim().toLowerCase();
    return users.filter(u => {
      if (roleFilter !== 'ALL' && u.rol !== roleFilter) return false;
      if (!q) return true;
      return (
        (u.nombre_usuario || '').toLowerCase().includes(q) ||
        (u.nombre_completo || '').toLowerCase().includes(q) ||
        (u.rol || '').toLowerCase().includes(q)
      );
    });
  }, [users, userSearch, roleFilter]);

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
    setCollapsedCategories({});
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
    setCollapsedCategories({});
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

  const toggleModuleInModal = (mod) => {
    if (editingUser && (editingUser.es_principal || String(editingUser.nombre_usuario).toLowerCase() === 'admin')) {
      return;
    }
    const currentlyActive = Boolean(formData.permisos?.[mod.accessKey]);
    const nextState = !currentlyActive;
    const nextPerms = { ...formData.permisos };
    mod.functions.forEach(fk => {
      nextPerms[fk] = nextState;
    });
    setFormData(prev => ({ ...prev, permisos: nextPerms }));
  };

  const toggleCategoryPermissions = (categoryName, e) => {
    if (e) e.stopPropagation();
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

  const toggleCollapseCategory = (categoryName) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
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
        toast.success(`Usuario "${formData.nombre_usuario}" actualizado correctamente.`);
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
        toast.success(`Usuario "${formData.nombre_usuario}" creado exitosamente.`);
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

  const activeModalPermissionsCount = useMemo(() => {
    return ALL_PERMISSION_KEYS.filter(k => Boolean(formData.permisos?.[k])).length;
  }, [formData.permisos]);

  const isEditingMasterAdmin = Boolean(
    editingUser && (editingUser.es_principal || String(editingUser.nombre_usuario).toLowerCase() === 'admin')
  );

  return (
    <PageWrapper>
      <Container>
        <BackButton to="/dashboard">
          <FaArrowLeft /> Volver al Dashboard
        </BackButton>

        <HeaderContainer>
          <Title>
            <FaUsers /> Gestión de Usuarios
          </Title>
          <ButtonGroup>
            <Button primary type="button" onClick={openCreateModal}>
              <FaUserPlus /> Crear Usuario
            </Button>
            <Button
              type="button"
              primary={activeTab === 'users'}
              secondary={activeTab !== 'users'}
              onClick={() => setActiveTab('users')}
            >
              <FaUserShield /> Usuarios ({users.length})
            </Button>
            <Button
              type="button"
              primary={activeTab === 'traceability'}
              secondary={activeTab !== 'traceability'}
              onClick={() => {
                setActiveTab('traceability');
                fetchTraceability(traceUserFilter, traceModuleFilter, traceSearch);
              }}
            >
              <FaHistory /> Historial de Actividad
            </Button>
          </ButtonGroup>
        </HeaderContainer>

        {loading ? (
          <div style={{ background: '#fff', padding: '2.5rem', borderRadius: 16, textAlign: 'center', fontWeight: 600, color: '#64748b' }}>
            Cargando usuarios...
          </div>
        ) : error ? (
          <div style={{ background: '#fef2f2', padding: '1.5rem', borderRadius: 16, color: '#dc2626', fontWeight: 700 }}>
            {error}
          </div>
        ) : activeTab === 'users' ? (
          <>
            <FilterContainer>
              <SearchInputWrapper>
                <FaSearch style={{ position: 'absolute', left: 14, top: 13, color: '#94a3b8' }} />
                <SearchInput
                  type="text"
                  placeholder="Buscar usuario por nombre o rol..."
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                />
              </SearchInputWrapper>

              <Select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                <option value="ALL">Todos los roles ({users.length})</option>
                <option value="Administrador">Administrador</option>
                <option value="Gerente">Gerente</option>
                <option value="Contador">Contador</option>
                <option value="Cajero">Cajero</option>
                <option value="Vendedor">Vendedor</option>
                <option value="Encargado de Inventario">Encargado de Inventario</option>
              </Select>
            </FilterContainer>

            <UserGrid>
              {filteredUsers.map(u => {
                const isMaster = Boolean(u.es_principal || String(u.nombre_usuario).toLowerCase() === 'admin');
                const activeCount = Number(u.permisos_activos_count ?? ALL_PERMISSION_KEYS.length);
                const totalCount = Number(u.permisos_totales_count || ALL_PERMISSION_KEYS.length);
                const activeModulesCount = SYSTEM_MODULES_MAP.filter(m =>
                  isMaster ? true : Boolean(u.permisos?.[m.accessKey])
                ).length;
                const tr = u.trazabilidad || {};

                return (
                  <UserCard
                    key={u.id_usuario}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
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
                                Principal
                              </Badge>
                            )}
                          </h3>
                          <p>
                            {u.nombre_completo || u.nombre_usuario}
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                        <Badge $bg={`${getRoleColor(u.rol)}15`} $color={getRoleColor(u.rol)}>
                          {u.rol}
                        </Badge>
                        {u.activo ? (
                          <Badge $bg="#ecfdf5" $color="#059669">
                            <FaCheckCircle size={10} /> Activo
                          </Badge>
                        ) : (
                          <Badge $bg="#fef2f2" $color="#dc2626">
                            <FaTimesCircle size={10} /> Inactivo
                          </Badge>
                        )}
                      </div>
                    </UserCardHeader>

                    <AccessSummaryBox>
                      <div className="stat-item">
                        <span className="lbl">Módulos con Acceso</span>
                        <strong className="val" style={{ color: '#2563eb' }}>
                          {activeModulesCount} de {SYSTEM_MODULES_MAP.length} módulos
                        </strong>
                      </div>
                      <div className="stat-item">
                        <span className="lbl">Funciones Habilitadas</span>
                        <strong className="val" style={{ color: '#059669' }}>
                          {activeCount} de {totalCount} permisos
                        </strong>
                      </div>
                    </AccessSummaryBox>

                    <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Última actividad:</span>
                      <strong style={{ color: '#334155' }}>{fmtDateTime(tr.ultima_actividad)}</strong>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                      <ActionButton type="button" className="perms" onClick={() => openEditModal(u)}>
                        <FaCheckSquare /> Permisos y Accesos
                      </ActionButton>
                      <ActionButton type="button" className="trace" onClick={() => handleViewUserTrace(u)}>
                        <FaHistory /> Actividad
                      </ActionButton>
                      <ActionButton
                        type="button"
                        className="delete"
                        disabled={isMaster}
                        title={isMaster ? 'El administrador principal está protegido' : 'Eliminar usuario'}
                        onClick={() => {
                          setUserToDelete(u);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        {isMaster ? <FaLock /> : <FaTrash />}
                      </ActionButton>
                    </div>
                  </UserCard>
                );
              })}
            </UserGrid>
          </>
        ) : (
          /* TAB 2: HISTORIAL DE ACTIVIDAD POR USUARIO */
          <div>
            <FilterContainer>
              <Select
                value={traceUserFilter}
                onChange={e => {
                  const val = e.target.value;
                  setTraceUserFilter(val);
                  fetchTraceability(val, traceModuleFilter, traceSearch);
                }}
              >
                <option value="todos">Todos los Usuarios ({users.length})</option>
                {users.map(u => (
                  <option key={u.id_usuario} value={String(u.id_usuario)}>
                    {u.nombre_usuario} ({u.rol})
                  </option>
                ))}
              </Select>

              <Select
                value={traceModuleFilter}
                onChange={e => {
                  const val = e.target.value;
                  setTraceModuleFilter(val);
                  fetchTraceability(traceUserFilter, val, traceSearch);
                }}
              >
                <option value="todos">Todos los Módulos</option>
                <option value="POS">POS / Ventas</option>
                <option value="Caja">Caja y Arqueos</option>
                <option value="Inventario">Inventario</option>
                <option value="Clientes">Clientes y Créditos</option>
                <option value="Finanzas">Finanzas</option>
                <option value="Traslados">Traslados / Salidas</option>
                <option value="Usuarios">Usuarios y Permisos</option>
                <option value="Autenticación">Inicios de Sesión</option>
              </Select>

              <SearchInputWrapper>
                <FaSearch style={{ position: 'absolute', left: 14, top: 13, color: '#94a3b8' }} />
                <SearchInput
                  type="text"
                  placeholder="Buscar por factura, monto, producto o acción..."
                  value={traceSearch}
                  onChange={e => setTraceSearch(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') fetchTraceability(traceUserFilter, traceModuleFilter, traceSearch);
                  }}
                />
              </SearchInputWrapper>

              <Button
                primary
                type="button"
                onClick={() => fetchTraceability(traceUserFilter, traceModuleFilter, traceSearch)}
              >
                <FaSyncAlt /> Filtrar
              </Button>
            </FilterContainer>

            <TraceTableWrapper>
              <table>
                <thead>
                  <tr>
                    <th>Fecha y Hora</th>
                    <th>Usuario</th>
                    <th>Rol</th>
                    <th>Módulo</th>
                    <th>Acción</th>
                    <th>Detalle</th>
                  </tr>
                </thead>
                <tbody>
                  {traceLoading ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', fontWeight: 600, color: '#64748b' }}>
                        Cargando historial de actividad...
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
                          <td style={{ lineHeight: 1.45 }}>{ev.descripcion}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </TraceTableWrapper>
          </div>
        )}

        {/* MODAL DE CREACIÓN / EDICIÓN DE USUARIO Y PERMISOS */}
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
                      : 'Crear Nuevo Usuario'}
                  </h2>
                  <button type="button" className="close-x" onClick={() => setIsModalOpen(false)}>
                    <FaTimes />
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
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem'
                      }}
                    >
                      <FaLock size={15} />
                      El usuario administrador principal está protegido por el sistema y conserva todos los permisos habilitados.
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

                  {/* 1. DATOS DE LA CUENTA */}
                  <FormGrid>
                    <FieldGroup>
                      <label>Usuario de Acceso *</label>
                      <input
                        type="text"
                        placeholder="Ej: cajero1, vendedor2"
                        value={formData.nombre_usuario}
                        disabled={isEditingMasterAdmin}
                        onChange={e => setFormData(p => ({ ...p, nombre_usuario: e.target.value }))}
                        required
                      />
                    </FieldGroup>

                    <FieldGroup>
                      <label>Nombre Completo</label>
                      <input
                        type="text"
                        placeholder="Ej: Juan Pérez"
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
                        <option value="Encargado de Inventario">Encargado de Inventario</option>
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
                        <option value="1">Activo (Puede iniciar sesión)</option>
                        <option value="0">Inactivo (Acceso bloqueado)</option>
                      </select>
                    </FieldGroup>

                    <FieldGroup>
                      <label>
                        {editingUser ? 'Nueva Contraseña (Opcional)' : 'Contraseña *'}
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder={editingUser ? 'Dejar vacío para no cambiar' : 'Ingresa contraseña'}
                          value={isEditingMasterAdmin ? '••••' : formData.password}
                          disabled={isEditingMasterAdmin}
                          onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
                          required={!editingUser}
                          style={{ width: '100%', boxSizing: 'border-box', paddingRight: 36 }}
                        />
                        {!isEditingMasterAdmin && (
                          <span
                            onClick={() => setShowPassword(s => !s)}
                            style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer', color: '#64748b' }}
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

                  {/* 2. ACCESO RÁPIDO A MÓDULOS EN 1 CLIC */}
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                      1. Activar o Bloquear Módulos Completos (Clic para cambiar):
                    </div>
                    <ModulesQuickGrid>
                      {SYSTEM_MODULES_MAP.map(mod => {
                        const isActive = Boolean(formData.permisos?.[mod.accessKey]);
                        return (
                          <ModuleQuickSwitch
                            key={mod.id}
                            type="button"
                            $active={isActive}
                            disabled={isEditingMasterAdmin}
                            onClick={() => toggleModuleInModal(mod)}
                          >
                            <span>{mod.name}</span>
                            <span>{isActive ? '✅ Activo' : '🔒 Bloqueado'}</span>
                          </ModuleQuickSwitch>
                        );
                      })}
                    </ModulesQuickGrid>
                  </div>

                  {/* 3. PLANTILLAS RÁPIDAS Y BUSCADOR DE PERMISOS */}
                  <TemplateChipsBar>
                    <span className="label">Plantillas Rápidas:</span>
                    <button type="button" disabled={isEditingMasterAdmin} onClick={() => applyPermissionTemplate('ALL')}>
                      Marcar Todo ({ALL_PERMISSION_KEYS.length})
                    </button>
                    <button type="button" disabled={isEditingMasterAdmin} onClick={() => applyPermissionTemplate('Gerente')}>
                      Perfil Gerente
                    </button>
                    <button type="button" disabled={isEditingMasterAdmin} onClick={() => applyPermissionTemplate('Cajero')}>
                      Perfil Cajero
                    </button>
                    <button type="button" disabled={isEditingMasterAdmin} onClick={() => applyPermissionTemplate('Vendedor')}>
                      Perfil Vendedor
                    </button>
                    <button type="button" disabled={isEditingMasterAdmin} onClick={() => applyPermissionTemplate('Encargado de Inventario')}>
                      Perfil Inventario
                    </button>
                    <button type="button" disabled={isEditingMasterAdmin} onClick={() => applyPermissionTemplate('Contador')}>
                      Perfil Contador
                    </button>
                    <button type="button" disabled={isEditingMasterAdmin} onClick={() => applyPermissionTemplate('NONE')}>
                      Desmarcar Todo
                    </button>

                    <input
                      type="text"
                      placeholder="Buscar permiso específico..."
                      value={permSearch}
                      onChange={e => setPermSearch(e.target.value)}
                      style={{
                        marginLeft: 'auto',
                        padding: '6px 12px',
                        borderRadius: 8,
                        border: '1px solid #cbd5e1',
                        fontSize: '0.82rem',
                        outline: 'none',
                        minWidth: '210px'
                      }}
                    />
                  </TemplateChipsBar>

                  {/* 4. CASILLAS DETALLADAS POR CATEGORÍA (VISIBLES Y EXPANDIDAS) */}
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '0.6rem', textTransform: 'uppercase' }}>
                      2. Permisos Detallados por Función:
                    </div>
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
                      const isCollapsed = Boolean(collapsedCategories[category]);

                      return (
                        <CategoryBlock key={category}>
                          <div className="cat-header" onClick={() => toggleCollapseCategory(category)}>
                            <h4>
                              {category}
                              <Badge $bg="#eff6ff" $color="#1d4ed8">
                                {catCheckedCount} / {items.length} activos
                              </Badge>
                            </h4>
                            <div className="cat-actions">
                              <button
                                type="button"
                                className="toggle-all"
                                disabled={isEditingMasterAdmin}
                                onClick={(e) => toggleCategoryPermissions(category, e)}
                              >
                                {allCatChecked ? 'Desmarcar sección' : 'Marcar sección'}
                              </button>
                              <span style={{ color: '#64748b', display: 'flex', alignItems: 'center' }}>
                                {isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                              </span>
                            </div>
                          </div>

                          {!isCollapsed && (
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
                          )}
                        </CategoryBlock>
                      );
                    })}
                  </div>
                </ModalBody>

                <ModalFooter>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#334155' }}>
                    Permisos habilitados:{' '}
                    <strong style={{ color: '#2563eb' }}>
                      {activeModalPermissionsCount} de {ALL_PERMISSION_KEYS.length}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <Button secondary type="button" onClick={() => setIsModalOpen(false)}>
                      Cancelar
                    </Button>
                    <Button primary type="submit" disabled={saving}>
                      <FaUserCheck />
                      {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
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
                $maxWidth="440px"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={e => e.stopPropagation()}
              >
                <ModalHeader>
                  <h2>Confirmar Eliminación</h2>
                  <button type="button" className="close-x" onClick={() => setIsDeleteModalOpen(false)}>
                    <FaTimes />
                  </button>
                </ModalHeader>
                <ModalBody>
                  <p style={{ margin: 0, color: '#334155', lineHeight: 1.5 }}>
                    ¿Estás seguro de que deseas eliminar al usuario{' '}
                    <strong>{userToDelete.nombre_usuario}</strong>?
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button secondary type="button" onClick={() => setIsDeleteModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button
                    primary
                    type="button"
                    onClick={confirmDelete}
                    style={{ background: '#dc2626' }}
                  >
                    Sí, Eliminar
                  </Button>
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

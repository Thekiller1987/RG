import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FaArrowLeft,
  FaUserTie,
  FaUserPlus,
  FaMoneyCheckAlt,
  FaPercentage,
  FaChartLine,
  FaCog,
  FaPlusCircle,
  FaMinusCircle,
  FaReceipt,
  FaPrint,
  FaSearch,
  FaSyncAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaLock,
  FaEdit,
  FaTrashAlt,
  FaListUl,
  FaHistory
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.jsx';
import { API_URL } from '../service/api';

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
  margin-bottom: 1.3rem;
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
    color: #0f766e;
    border-color: #5eead4;
  }
`;

const HeaderBanner = styled.div`
  background: linear-gradient(135deg, #0f172a 0%, #115e59 55%, #0f766e 100%);
  color: #ffffff;
  border-radius: 20px;
  padding: 1.6rem 2rem;
  margin-bottom: 1.4rem;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.18);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.2rem;

  .title-block {
    h1 {
      margin: 0;
      font-size: clamp(1.35rem, 2.5vw, 1.9rem);
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 0.7rem;
    }
    p {
      margin: 0.4rem 0 0;
      color: #ccfbf1;
      font-size: 0.88rem;
      max-width: 760px;
      line-height: 1.45;
    }
  }
`;

const TabButton = styled.button`
  padding: 0.72rem 1.25rem;
  border-radius: 12px;
  border: 1px solid ${props => (props.$active ? '#0f766e' : '#cbd5e1')};
  background: ${props => (props.$active ? '#0f766e' : '#ffffff')};
  color: ${props => (props.$active ? '#ffffff' : '#334155')};
  font-weight: 800;
  font-size: 0.88rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.18s;
  box-shadow: ${props => (props.$active ? '0 8px 20px rgba(15, 118, 110, 0.25)' : 'none')};
`;

const PrimaryButton = styled.button`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  font-weight: 800;
  font-size: 0.88rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const FilterBar = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1rem 1.25rem;
  margin-bottom: 1.3rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  align-items: center;
  justify-content: space-between;

  .date-inputs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    align-items: center;

    input[type='date'] {
      padding: 0.55rem 0.8rem;
      border-radius: 10px;
      border: 1px solid #cbd5e1;
      font-size: 0.85rem;
      font-weight: 600;
      color: #0f172a;
    }
  }

  .quick-ranges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;

    button {
      padding: 0.48rem 0.85rem;
      border-radius: 999px;
      border: 1px solid #cbd5e1;
      background: #f8fafc;
      color: #334155;
      font-size: 0.76rem;
      font-weight: 700;
      cursor: pointer;

      &:hover {
        background: #f0fdfa;
        border-color: #0d9488;
        color: #0f766e;
      }
    }
  }
`;

const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 1.4rem;
`;

const KpiCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 1.1rem 1.3rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.04);

  span {
    display: block;
    font-size: 0.74rem;
    font-weight: 800;
    text-transform: uppercase;
    color: #64748b;
  }

  strong {
    display: block;
    font-size: 1.38rem;
    font-weight: 800;
    color: ${props => props.$color || '#0f172a'};
    margin-top: 4px;
  }

  small {
    display: block;
    font-size: 0.74rem;
    color: #64748b;
    margin-top: 3px;
  }
`;

const PayrollGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
  gap: 1.2rem;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const EmployeePayrollCard = styled.div`
  background: #ffffff;
  border-radius: 18px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.05);
  padding: 1.35rem;
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
    background: linear-gradient(90deg, #0f766e, #10b981);
  }
`;

const BreakdownBox = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 13px;
  padding: 0.85rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 6px;

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.82rem;
    color: #334155;
  }

  .row.total {
    margin-top: 4px;
    padding-top: 8px;
    border-top: 2px dashed #cbd5e1;
    font-size: 1rem;
    font-weight: 800;
    color: #0f172a;
  }
`;

const CardActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: auto;

  button {
    flex: 1;
    min-width: 115px;
    padding: 0.58rem 0.75rem;
    border-radius: 10px;
    font-size: 0.77rem;
    font-weight: 700;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    transition: all 0.15s;
  }
`;

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
  max-width: ${props => props.$maxWidth || '760px'};
  max-height: 92vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(15, 23, 42, 0.35);
`;

const ModalHeader = styled.div`
  padding: 1.2rem 1.5rem;
  background: linear-gradient(135deg, #0f172a 0%, #0f766e 100%);
  color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
    font-size: 1.15rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  button {
    background: rgba(255, 255, 255, 0.16);
    border: none;
    color: #ffffff;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    cursor: pointer;
  }
`;

const ModalBody = styled.div`
  padding: 1.4rem 1.5rem;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
`;

const ModalFooter = styled.div`
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 0.9rem;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  label {
    font-size: 0.75rem;
    font-weight: 800;
    color: #334155;
    text-transform: uppercase;
  }

  input,
  select,
  textarea {
    padding: 0.62rem 0.85rem;
    border-radius: 10px;
    border: 1px solid #cbd5e1;
    font-size: 0.88rem;
    color: #0f172a;
    background: #ffffff;
    outline: none;

    &:focus {
      border-color: #0f766e;
    }
  }

  small {
    font-size: 0.71rem;
    color: #64748b;
    line-height: 1.3;
  }
`;

const fmt = n =>
  Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const Empleados = () => {
  const { allUsers, hasPermission, requireActionPermission } = useAuth();
  const canViewPayroll = hasPermission('planilla.acceso');
  const canViewProfits = hasPermission('planilla.ver_ganancias');
  const canEditRules = hasPermission('planilla.reglas_comision');
  const canLiquidate = hasPermission('planilla.liquidar_pagos');

  const [activeTab, setActiveTab] = useState(canViewPayroll ? 'payroll' : 'employees');

  // Rango de fechas para el cálculo de planilla y comisiones
  const todayStr = useMemo(() => {
    const d = new Date(Date.now() - 6 * 3600 * 1000);
    return d.toISOString().substring(0, 10);
  }, []);
  const monthStartStr = useMemo(() => `${todayStr.substring(0, 7)}-01`, [todayStr]);

  const [startDate, setStartDate] = useState(monthStartStr);
  const [endDate, setEndDate] = useState(todayStr);

  const [payrollData, setPayrollData] = useState({
    summary: {},
    employees: [],
    history: []
  });
  const [empleadosList, setEmpleadosList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal de Crear / Editar Empleado y Reglas de Comisión sobre Ganancia
  const [isEmpModalOpen, setIsEmpModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState(null);
  const [empForm, setEmpForm] = useState({
    nombre: '',
    telefono: '',
    cargo: 'Vendedor',
    id_usuario_vinculado: '',
    salario_base: 0,
    frecuencia_pago: 'Quincenal',
    tipo_comision: 'PORCENTAJE_GANANCIA',
    porcentaje_comision_ganancia: 5,
    porcentaje_comision_venta: 0,
    meta_ganancia_minima: 0,
    margen_minimo_producto: 0,
    meta_ganancia_objetivo: 0,
    porcentaje_nivel2_ganancia: 0,
    bono_meta_ganancia: 0,
    incluir_ventas_usuario: true,
    notas_contrato: ''
  });

  // Modal de Vale / Adelanto / Deducción / Bono Extra
  const [movModal, setMovModal] = useState({ open: false, employee: null });
  const [movForm, setMovForm] = useState({ tipo: 'ADELANTO', monto: '', concepto: '' });

  // Modal de Detalle de Productos Vendidos y Ganancia por Factura
  const [detailModal, setDetailModal] = useState({ open: false, employee: null });

  // Modal de Liquidación y Colilla Imprimible
  const [liquidateModal, setLiquidateModal] = useState({ open: false, employee: null, metodo_pago: 'Efectivo', notas: '' });
  const [voucherModal, setVoucherModal] = useState({ open: false, pago: null });

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchAllData = async (sDate = startDate, eDate = endDate) => {
    try {
      setLoading(true);
      const [empRes, payRes] = await Promise.all([
        axios.get(`${API_URL}/employees`, getAuthConfig()),
        canViewPayroll
          ? axios.get(`${API_URL}/employees/payroll-report?startDate=${sDate}&endDate=${eDate}`, getAuthConfig())
          : Promise.resolve({ data: null })
      ]);

      setEmpleadosList(Array.isArray(empRes.data) ? empRes.data : []);
      if (payRes.data) {
        setPayrollData({
          summary: payRes.data.summary || {},
          employees: Array.isArray(payRes.data.employees) ? payRes.data.employees : [],
          history: Array.isArray(payRes.data.history) ? payRes.data.history : []
        });
      }
    } catch (err) {
      toast.error('Error cargando datos de empleados y planilla');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData(startDate, endDate);
  }, []);

  const setQuickRange = type => {
    const now = new Date(Date.now() - 6 * 3600 * 1000);
    const yyyy = now.getUTCFullYear();
    const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(now.getUTCDate()).padStart(2, '0');
    let s = `${yyyy}-${mm}-01`;
    let e = `${yyyy}-${mm}-${dd}`;

    if (type === 'HOY') {
      s = e;
    } else if (type === 'SEMANA') {
      const weekAgo = new Date(now.getTime() - 6 * 86400 * 1000);
      s = weekAgo.toISOString().substring(0, 10);
    } else if (type === 'Q1') {
      s = `${yyyy}-${mm}-01`;
      e = `${yyyy}-${mm}-15`;
    } else if (type === 'Q2') {
      s = `${yyyy}-${mm}-16`;
      e = `${yyyy}-${mm}-${dd}`;
    } else if (type === 'MES') {
      s = `${yyyy}-${mm}-01`;
      e = `${yyyy}-${mm}-${dd}`;
    }
    setStartDate(s);
    setEndDate(e);
    fetchAllData(s, e);
  };

  const openCreateEmpModal = () => {
    if (!requireActionPermission('planilla.reglas_comision', 'Crear Empleado y Configurar Reglas de Comisión')) return;
    setEditingEmp(null);
    setEmpForm({
      nombre: '',
      telefono: '',
      cargo: 'Vendedor',
      id_usuario_vinculado: '',
      salario_base: 0,
      frecuencia_pago: 'Quincenal',
      tipo_comision: 'PORCENTAJE_GANANCIA',
      porcentaje_comision_ganancia: 5,
      porcentaje_comision_venta: 0,
      meta_ganancia_minima: 0,
      margen_minimo_producto: 0,
      meta_ganancia_objetivo: 0,
      porcentaje_nivel2_ganancia: 0,
      bono_meta_ganancia: 0,
      incluir_ventas_usuario: true,
      notas_contrato: ''
    });
    setIsEmpModalOpen(true);
  };

  const openEditEmpModal = emp => {
    if (!requireActionPermission('planilla.reglas_comision', 'Configurar Salario y Reglas de Comisión sobre Ganancia')) return;
    setEditingEmp(emp);
    setEmpForm({
      nombre: emp.nombre || '',
      telefono: emp.telefono || '',
      cargo: emp.cargo || 'Vendedor',
      id_usuario_vinculado: emp.id_usuario_vinculado || '',
      salario_base: emp.salario_base ?? 0,
      frecuencia_pago: emp.frecuencia_pago || 'Quincenal',
      tipo_comision: emp.tipo_comision || 'PORCENTAJE_GANANCIA',
      porcentaje_comision_ganancia: emp.porcentaje_comision_ganancia ?? 5,
      porcentaje_comision_venta: emp.porcentaje_comision_venta ?? 0,
      meta_ganancia_minima: emp.meta_ganancia_minima ?? 0,
      margen_minimo_producto: emp.margen_minimo_producto ?? 0,
      meta_ganancia_objetivo: emp.meta_ganancia_objetivo ?? 0,
      porcentaje_nivel2_ganancia: emp.porcentaje_nivel2_ganancia ?? 0,
      bono_meta_ganancia: emp.bono_meta_ganancia ?? 0,
      incluir_ventas_usuario: Number(emp.incluir_ventas_usuario ?? 1) === 1,
      notas_contrato: emp.notas_contrato || ''
    });
    setIsEmpModalOpen(true);
  };

  const handleSaveEmployee = async e => {
    e.preventDefault();
    try {
      if (editingEmp) {
        await axios.put(`${API_URL}/employees/${editingEmp.id_empleado}`, empForm, getAuthConfig());
        toast.success(`Reglas de comisión y planilla de "${empForm.nombre}" actualizadas.`);
      } else {
        await axios.post(`${API_URL}/employees`, empForm, getAuthConfig());
        toast.success(`Empleado "${empForm.nombre}" registrado en planilla.`);
      }
      setIsEmpModalOpen(false);
      fetchAllData(startDate, endDate);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error guardando empleado');
    }
  };

  const handleDeleteEmployee = async emp => {
    if (!requireActionPermission('planilla.reglas_comision', 'Desactivar Empleado de Planilla')) return;
    if (!window.confirm(`¿Desactivar a ${emp.nombre} de la planilla activa?`)) return;
    try {
      await axios.delete(`${API_URL}/employees/${emp.id_empleado}`, getAuthConfig());
      toast.success('Empleado desactivado');
      fetchAllData(startDate, endDate);
    } catch (err) {
      toast.error('Error al desactivar empleado');
    }
  };

  const handleAddMovement = async e => {
    e.preventDefault();
    if (!movModal.employee) return;
    try {
      await axios.post(
        `${API_URL}/employees/payroll-movement`,
        {
          id_empleado: movModal.employee.id_empleado,
          tipo: movForm.tipo,
          monto: Number(movForm.monto),
          concepto: movForm.concepto
        },
        getAuthConfig()
      );
      toast.success(`${movForm.tipo} registrado para ${movModal.employee.nombre}`);
      setMovModal({ open: false, employee: null });
      setMovForm({ tipo: 'ADELANTO', monto: '', concepto: '' });
      fetchAllData(startDate, endDate);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error registrando movimiento');
    }
  };

  const handleDeleteMovement = async id_movimiento => {
    try {
      await axios.delete(`${API_URL}/employees/payroll-movement/${id_movimiento}`, getAuthConfig());
      toast.success('Movimiento eliminado');
      fetchAllData(startDate, endDate);
    } catch (err) {
      toast.error('No se pudo eliminar el movimiento');
    }
  };

  const handleConfirmLiquidate = async e => {
    e.preventDefault();
    const emp = liquidateModal.employee;
    if (!emp) return;
    try {
      const { data } = await axios.post(
        `${API_URL}/employees/liquidate`,
        {
          id_empleado: emp.id_empleado,
          empleado_nombre: emp.nombre,
          fecha_inicio: startDate,
          fecha_fin: endDate,
          frecuencia_pago: emp.frecuencia_pago,
          metricas: emp.metricas,
          metodo_pago: liquidateModal.metodo_pago,
          notas: liquidateModal.notas
        },
        getAuthConfig()
      );
      toast.success(`Planilla liquidada para ${emp.nombre}`);
      setLiquidateModal({ open: false, employee: null, metodo_pago: 'Efectivo', notas: '' });
      setVoucherModal({ open: true, pago: data.pago });
      fetchAllData(startDate, endDate);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al liquidar planilla');
    }
  };

  const printVoucher = pago => {
    const win = window.open('', '_blank', 'width=720,height=800');
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Colilla de Pago #${pago.id_pago} - ${pago.empleado_nombre}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; }
            .box { border: 2px solid #0f172a; border-radius: 12px; padding: 20px; max-width: 640px; margin: 0 auto; }
            h2 { margin: 0 0 4px; text-align: center; }
            .sub { text-align: center; font-size: 13px; color: #475569; margin-bottom: 16px; }
            .grid { display: flex; justify-content: space-between; border-bottom: 1px solid #cbd5e1; padding-bottom: 10px; margin-bottom: 12px; font-size: 13px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
            th, td { padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: left; }
            .right { text-align: right; }
            .total-row td { font-size: 16px; font-weight: bold; border-top: 2px solid #0f172a; }
            .sigs { display: flex; justify-content: space-between; margin-top: 48px; font-size: 13px; }
            .sig-line { width: 42%; border-top: 1px solid #0f172a; text-align: center; padding-top: 6px; }
          </style>
        </head>
        <body>
          <div class="box">
            <h2>MULTIREPUESTOS RG</h2>
            <div class="sub">COMPROBANTE DE PAGO DE PLANILLA Y COMISIONES SOBRE GANANCIA · FOLIO #${pago.id_pago}</div>
            <div class="grid">
              <div>
                <strong>Empleado:</strong> ${pago.empleado_nombre}<br/>
                <strong>Período Liquidado:</strong> ${String(pago.fecha_inicio).substring(0, 10)} al ${String(pago.fecha_fin).substring(0, 10)}<br/>
                <strong>Regla Aplicada:</strong> ${pago.regla_aplicada || 'Comisión por Ganancia'}
              </div>
              <div class="right">
                <strong>Fecha de Pago:</strong> ${new Date(pago.fecha_pago || Date.now()).toLocaleString('es-NI')}<br/>
                <strong>Frecuencia:</strong> ${pago.frecuencia_pago || 'Quincenal'}<br/>
                <strong>Método:</strong> ${pago.metodo_pago || 'Efectivo'}
              </div>
            </div>
            <table>
              <thead>
                <tr><th>Concepto</th><th class="right">Monto (C$)</th></tr>
              </thead>
              <tbody>
                <tr><td>Facturas Emitidas en el Período (${pago.total_facturas} facturas) — Total Vendido</td><td class="right">C$ ${fmt(pago.total_vendido)}</td></tr>
                <tr><td>Ganancia Real Generada / Comisionable</td><td class="right">C$ ${fmt(pago.ganancia_comisionable || pago.ganancia_generada)}</td></tr>
                <tr><td><strong>(+) Salario Base del Período</strong></td><td class="right">C$ ${fmt(pago.salario_base)}</td></tr>
                <tr><td><strong>(+) Comisión Ganada sobre Ganancia</strong></td><td class="right">C$ ${fmt(pago.comision_ganancia)}</td></tr>
                ${Number(pago.comision_venta) > 0 ? `<tr><td><strong>(+) Comisión sobre Venta</strong></td><td class="right">C$ ${fmt(pago.comision_venta)}</td></tr>` : ''}
                ${Number(pago.bono_meta) > 0 ? `<tr><td><strong>(+) Bono por Meta de Ganancia Alcanzada</strong></td><td class="right">C$ ${fmt(pago.bono_meta)}</td></tr>` : ''}
                ${Number(pago.bonos_extra) > 0 ? `<tr><td><strong>(+) Bonos Extra</strong></td><td class="right">C$ ${fmt(pago.bonos_extra)}</td></tr>` : ''}
                ${Number(pago.deducciones_adelantos) > 0 ? `<tr><td><strong>(-) Vales / Adelantos / Deducciones</strong></td><td class="right">- C$ ${fmt(pago.deducciones_adelantos)}</td></tr>` : ''}
                <tr class="total-row"><td>TOTAL NETO RECIBIDO</td><td class="right">C$ ${fmt(pago.total_neto_pagado)}</td></tr>
              </tbody>
            </table>
            ${pago.notas ? `<p style="font-size:12px;margin-top:12px;"><strong>Observaciones:</strong> ${pago.notas}</p>` : ''}
            <div class="sigs">
              <div class="sig-line">Entregado por (${pago.pagado_por || 'Administración'})</div>
              <div class="sig-line">Recibí Conforme (${pago.empleado_nombre})</div>
            </div>
          </div>
          <script>window.onload = () => { window.print(); }</script>
        </body>
      </html>
    `);
    win.document.close();
  };

  const sum = payrollData.summary || {};

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
              $active={activeTab === 'payroll'}
              onClick={() => {
                if (!requireActionPermission('planilla.acceso', 'Acceder a Planilla y Cálculo de Comisiones (Solo Dueño / Usuarios Especiales)')) return;
                setActiveTab('payroll');
              }}
            >
              <FaMoneyCheckAlt /> Planilla y Comisiones por Ganancia {!canViewPayroll && '🔒'}
            </TabButton>
            <TabButton
              type="button"
              $active={activeTab === 'employees'}
              onClick={() => setActiveTab('employees')}
            >
              <FaUserTie /> Plantilla y Reglas de Comisión ({empleadosList.length})
            </TabButton>
            <TabButton
              type="button"
              $active={activeTab === 'history'}
              onClick={() => {
                if (!requireActionPermission('planilla.acceso', 'Ver Historial de Pagos de Planilla y Colillas')) return;
                setActiveTab('history');
              }}
            >
              <FaHistory /> Historial de Pagos y Colillas ({payrollData.history?.length || 0}) {!canViewPayroll && '🔒'}
            </TabButton>
          </div>
        </TopNav>

        <HeaderBanner>
          <div className="title-block">
            <h1>
              <FaMoneyCheckAlt color="#5eead4" />
              Planilla, Nómina y Pago por Comisión sobre Ganancia
            </h1>
            <p>
              Módulo confidencial para el Dueño y Usuarios Especiales. Calcula automáticamente la ganancia real
              generada por cada vendedor (Precio de Venta menos Costo) y aplica reglas de comisión por margen mínimo,
              metas de ganancia, escalas y bonos.
            </p>
          </div>
          <PrimaryButton type="button" onClick={openCreateEmpModal}>
            <FaUserPlus /> + Nuevo Empleado / Regla {!canEditRules && '🔒'}
          </PrimaryButton>
        </HeaderBanner>

        {activeTab === 'payroll' && canViewPayroll && (
          <>
            <FilterBar>
              <div className="date-inputs">
                <strong style={{ fontSize: '0.85rem', color: '#0f172a' }}>📅 Período de Planilla:</strong>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                />
                <span>al</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                />
                <PrimaryButton
                  type="button"
                  onClick={() => fetchAllData(startDate, endDate)}
                  style={{ padding: '0.55rem 1rem', fontSize: '0.82rem' }}
                >
                  <FaSyncAlt /> Calcular Planilla
                </PrimaryButton>
              </div>

              <div className="quick-ranges">
                <button type="button" onClick={() => setQuickRange('HOY')}>Hoy</button>
                <button type="button" onClick={() => setQuickRange('SEMANA')}>Últimos 7 Días</button>
                <button type="button" onClick={() => setQuickRange('Q1')}>1ra Quincena</button>
                <button type="button" onClick={() => setQuickRange('Q2')}>2da Quincena</button>
                <button type="button" onClick={() => setQuickRange('MES')}>Mes Completo</button>
              </div>
            </FilterBar>

            <KpiGrid>
              <KpiCard $color="#1d4ed8">
                <span>Ventas Facturadas (Período)</span>
                <strong>C$ {fmt(sum.totalVendidoGlobal)}</strong>
                <small>Total facturado por vendedores activos</small>
              </KpiCard>

              <KpiCard $color="#059669">
                <span>Ganancia Neta Generada</span>
                <strong>
                  {canViewProfits ? `C$ ${fmt(sum.gananciaTotalGlobal)}` : '🔒 Reservado Dueño'}
                </strong>
                <small>Utilidad real (Venta - Costo de repuestos)</small>
              </KpiCard>

              <KpiCard $color="#7c3aed">
                <span>Total Comisiones Ganadas</span>
                <strong>C$ {fmt(sum.totalComisiones)}</strong>
                <small>Segun reglas de ganancia y metas</small>
              </KpiCard>

              <KpiCard $color="#0f766e">
                <span>Salarios Base + Bonos</span>
                <strong>C$ {fmt(Number(sum.totalSalariosBase || 0) + Number(sum.totalBonos || 0))}</strong>
                <small>Deducciones/Vales: -C$ {fmt(sum.totalDeducciones)}</small>
              </KpiCard>

              <KpiCard $color="#dc2626">
                <span>Total Planilla Neta a Pagar</span>
                <strong>C$ {fmt(sum.totalPlanillaNeta)}</strong>
                <small>{sum.totalEmpleados || 0} empleados activos en corte</small>
              </KpiCard>
            </KpiGrid>

            {loading ? (
              <div style={{ background: '#fff', padding: '2.5rem', borderRadius: 16, textAlign: 'center', fontWeight: 700, color: '#475569' }}>
                Calculando ventas, costos, márgenes y comisiones por empleado...
              </div>
            ) : (
              <PayrollGrid>
                {payrollData.employees.map(emp => {
                  const m = emp.metricas || {};
                  return (
                    <EmployeePayrollCard key={emp.id_empleado}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                        <div>
                          <h3 style={{ margin: 0, fontSize: '1.12rem', fontWeight: 800, color: '#0f172a' }}>
                            {emp.nombre}
                          </h3>
                          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>
                            {emp.cargo || 'Vendedor'} · Pago <strong>{emp.frecuencia_pago || 'Quincenal'}</strong>
                            {emp.usuario_vinculado_nombre && (
                              <span style={{ marginLeft: 6, color: '#0f766e', fontWeight: 700 }}>
                                (@{emp.usuario_vinculado_nombre})
                              </span>
                            )}
                          </div>
                        </div>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: 999,
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            background: '#f0fdfa',
                            color: '#0f766e',
                            border: '1px solid #99f6e4'
                          }}
                        >
                          {m.explicacion_regla || '5% s/ Ganancia'}
                        </span>
                      </div>

                      {/* Resumen de Ventas y Ganancia Generada por el Vendedor */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(3, 1fr)',
                          gap: 8,
                          background: '#f8fafc',
                          padding: '0.7rem',
                          borderRadius: 12,
                          border: '1px solid #e2e8f0'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.67rem', fontWeight: 700, color: '#64748b' }}>VENTA BRUTA</div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>
                            C$ {fmt(m.total_vendido)}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                            {m.total_facturas || 0} tks ({m.total_unidades || 0} uds)
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: '0.67rem', fontWeight: 700, color: '#64748b' }}>GANANCIA REAL</div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#059669' }}>
                            {canViewProfits ? `C$ ${fmt(m.ganancia_total)}` : '🔒 Oculto'}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 700 }}>
                            Margen: {m.margen_promedio_pct || 0}%
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: '0.67rem', fontWeight: 700, color: '#64748b' }}>COMISIONABLE</div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1d4ed8' }}>
                            {canViewProfits ? `C$ ${fmt(m.ganancia_comisionable)}` : '🔒 Oculto'}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                            {m.lineas_excluidas_margen > 0
                              ? `${m.lineas_excluidas_margen} excl. por margen`
                              : '100% califica'}
                          </div>
                        </div>
                      </div>

                      {/* Desglose Matemático de Planilla */}
                      <BreakdownBox>
                        <div className="row">
                          <span>(+) Salario Base ({emp.frecuencia_pago || 'Quincenal'}):</span>
                          <strong>C$ {fmt(m.salario_base)}</strong>
                        </div>
                        <div className="row">
                          <span>
                            (+) Comisión sobre Ganancia ({m.pct_ganancia_aplicado || 0}%):
                          </span>
                          <strong style={{ color: '#059669' }}>+ C$ {fmt(m.comision_ganancia)}</strong>
                        </div>
                        {Number(m.comision_venta) > 0 && (
                          <div className="row">
                            <span>(+) Comisión sobre Venta ({emp.porcentaje_comision_venta}%):</span>
                            <strong style={{ color: '#059669' }}>+ C$ {fmt(m.comision_venta)}</strong>
                          </div>
                        )}
                        {Number(m.bono_meta) > 0 && (
                          <div className="row">
                            <span>🌟 (+) Bono por Superar Meta de Ganancia:</span>
                            <strong style={{ color: '#059669' }}>+ C$ {fmt(m.bono_meta)}</strong>
                          </div>
                        )}
                        {Number(m.bonos_extra) > 0 && (
                          <div className="row">
                            <span>(+) Bonos Extra Registrados:</span>
                            <strong style={{ color: '#059669' }}>+ C$ {fmt(m.bonos_extra)}</strong>
                          </div>
                        )}
                        {Number(m.deducciones_adelantos) > 0 && (
                          <div className="row">
                            <span>(-) Vales / Adelantos / Deducciones:</span>
                            <strong style={{ color: '#dc2626' }}>- C$ {fmt(m.deducciones_adelantos)}</strong>
                          </div>
                        )}
                        <div className="row total">
                          <span>TOTAL NETO A PAGAR:</span>
                          <span style={{ color: '#0f766e', fontSize: '1.15rem' }}>
                            C$ {fmt(m.total_neto_pagar)}
                          </span>
                        </div>
                      </BreakdownBox>

                      {/* Lista de vales/bonos pendientes si existen */}
                      {Array.isArray(emp.movimientos_pendientes) && emp.movimientos_pendientes.length > 0 && (
                        <div style={{ fontSize: '0.75rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '8px 10px' }}>
                          <strong style={{ color: '#92400e', display: 'block', marginBottom: 4 }}>
                            📌 Vales / Bonos pendientes de liquidar:
                          </strong>
                          {emp.movimientos_pendientes.map(mv => (
                            <div key={mv.id_movimiento} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2px 0' }}>
                              <span>
                                • <strong>{mv.tipo}</strong>: {mv.concepto} (C$ {fmt(mv.monto)})
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDeleteMovement(mv.id_movimiento)}
                                style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 800 }}
                                title="Eliminar movimiento"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <CardActions>
                        <button
                          type="button"
                          onClick={() => openEditEmpModal(emp)}
                          style={{ background: '#f0fdfa', color: '#0f766e', border: '1px solid #99f6e4' }}
                        >
                          <FaCog /> Reglas {!canEditRules && '🔒'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!requireActionPermission('planilla.liquidar_pagos', 'Registrar Vale, Adelanto o Bono en Planilla')) return;
                            setMovModal({ open: true, employee: emp });
                          }}
                          style={{ background: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa' }}
                        >
                          <FaPlusCircle /> Vale / Bono {!canLiquidate && '🔒'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!requireActionPermission('planilla.ver_ganancias', 'Ver Detalle de Ganancia por Producto y Factura')) return;
                            setDetailModal({ open: true, employee: emp });
                          }}
                          style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}
                        >
                          <FaListUl /> Detalle ({emp.detalle_productos?.length || 0})
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!requireActionPermission('planilla.liquidar_pagos', 'Liquidar y Registrar Pago de Planilla / Comisión')) return;
                            setLiquidateModal({ open: true, employee: emp, metodo_pago: 'Efectivo', notas: '' });
                          }}
                          style={{
                            flex: '1 1 100%',
                            background: 'linear-gradient(135deg, #0f766e, #059669)',
                            color: '#ffffff',
                            border: 'none',
                            padding: '0.7rem'
                          }}
                        >
                          <FaReceipt /> Liquidar Pago y Emitir Colilla (C$ {fmt(m.total_neto_pagar)}) {!canLiquidate && '🔒'}
                        </button>
                      </CardActions>
                    </EmployeePayrollCard>
                  );
                })}
              </PayrollGrid>
            )}
          </>
        )}

        {/* TAB 2: PLANTILLA DE EMPLEADOS Y REGLAS DE COMISIÓN */}
        {activeTab === 'employees' && (
          <div style={{ background: '#ffffff', borderRadius: 18, border: '1px solid #e2e8f0', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 820 }}>
              <thead>
                <tr style={{ background: '#0f172a', color: '#ffffff', textAlign: 'left', fontSize: '0.76rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.95rem 1rem' }}>Empleado</th>
                  <th style={{ padding: '0.95rem 1rem' }}>Usuario Vinculado</th>
                  <th style={{ padding: '0.95rem 1rem' }}>Salario Base</th>
                  <th style={{ padding: '0.95rem 1rem' }}>Tipo de Regla</th>
                  <th style={{ padding: '0.95rem 1rem' }}>% Sobre Ganancia</th>
                  <th style={{ padding: '0.95rem 1rem' }}>Reglas de Protección</th>
                  <th style={{ padding: '0.95rem 1rem' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {empleadosList.map(emp => (
                  <tr key={emp.id_empleado} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.85rem' }}>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <strong>{emp.nombre}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {emp.cargo} {emp.telefono ? `· 📞 ${emp.telefono}` : ''}
                      </div>
                    </td>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      {emp.usuario_vinculado_nombre ? (
                        <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '3px 9px', borderRadius: 999, fontWeight: 700, fontSize: '0.76rem' }}>
                          @{emp.usuario_vinculado_nombre}
                        </span>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>Sin vincular</span>
                      )}
                    </td>
                    <td style={{ padding: '0.9rem 1rem', fontWeight: 800 }}>
                      C$ {fmt(emp.salario_base)}
                      <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                        {emp.frecuencia_pago || 'Quincenal'}
                      </div>
                    </td>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <span style={{ background: '#f0fdfa', color: '#0f766e', padding: '3px 9px', borderRadius: 999, fontWeight: 800, fontSize: '0.74rem' }}>
                        {emp.tipo_comision || 'PORCENTAJE_GANANCIA'}
                      </span>
                    </td>
                    <td style={{ padding: '0.9rem 1rem', fontWeight: 800, color: '#059669' }}>
                      {Number(emp.porcentaje_comision_ganancia || 0)}% s/ Ganancia
                      {Number(emp.porcentaje_nivel2_ganancia) > 0 && (
                        <div style={{ fontSize: '0.72rem', color: '#7c3aed' }}>
                          Nivel 2: {emp.porcentaje_nivel2_ganancia}%
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '0.9rem 1rem', fontSize: '0.76rem', color: '#475569' }}>
                      • Margen mín. producto: <strong>{Number(emp.margen_minimo_producto || 0)}%</strong><br />
                      • Ganancia mín. período: <strong>C$ {fmt(emp.meta_ganancia_minima)}</strong><br />
                      {Number(emp.meta_ganancia_objetivo) > 0 && (
                        <span>• Meta Bono (C$ {fmt(emp.meta_ganancia_objetivo)}): <strong>+C$ {fmt(emp.bono_meta_ganancia)}</strong></span>
                      )}
                    </td>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          type="button"
                          onClick={() => openEditEmpModal(emp)}
                          style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #0f766e', background: '#f0fdfa', color: '#0f766e', fontWeight: 700, cursor: 'pointer', fontSize: '0.76rem' }}
                        >
                          <FaEdit /> Configurar Reglas
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteEmployee(emp)}
                          style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626', fontWeight: 700, cursor: 'pointer', fontSize: '0.76rem' }}
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: HISTORIAL DE PAGOS Y COLILLAS */}
        {activeTab === 'history' && canViewPayroll && (
          <div style={{ background: '#ffffff', borderRadius: 18, border: '1px solid #e2e8f0', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 820 }}>
              <thead>
                <tr style={{ background: '#0f172a', color: '#ffffff', textAlign: 'left', fontSize: '0.76rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.9rem 1rem' }}>Folio / Fecha Pago</th>
                  <th style={{ padding: '0.9rem 1rem' }}>Empleado</th>
                  <th style={{ padding: '0.9rem 1rem' }}>Período</th>
                  <th style={{ padding: '0.9rem 1rem' }}>Venta / Ganancia</th>
                  <th style={{ padding: '0.9rem 1rem' }}>Salario + Comisión</th>
                  <th style={{ padding: '0.9rem 1rem' }}>Neto Pagado</th>
                  <th style={{ padding: '0.9rem 1rem' }}>Colilla</th>
                </tr>
              </thead>
              <tbody>
                {(!payrollData.history || payrollData.history.length === 0) ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                      Aún no hay liquidaciones de planilla cerradas en el historial.
                    </td>
                  </tr>
                ) : (
                  payrollData.history.map(p => (
                    <tr key={p.id_pago} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.84rem' }}>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <strong>#{p.id_pago}</strong>
                        <div style={{ fontSize: '0.73rem', color: '#64748b' }}>
                          {new Date(p.fecha_pago).toLocaleString('es-NI')}
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>{p.empleado_nombre}</td>
                      <td style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>
                        {String(p.fecha_inicio).substring(0, 10)} al {String(p.fecha_fin).substring(0, 10)}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        Venta: C$ {fmt(p.total_vendido)}<br />
                        <span style={{ color: '#059669', fontWeight: 700, fontSize: '0.76rem' }}>
                          Ganancia: C$ {fmt(p.ganancia_generada)}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>
                        Base: C$ {fmt(p.salario_base)}<br />
                        Comisión: +C$ {fmt(Number(p.comision_ganancia || 0) + Number(p.comision_venta || 0) + Number(p.bono_meta || 0))}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#0f766e', fontSize: '0.96rem' }}>
                        C$ {fmt(p.total_neto_pagado)}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <button
                          type="button"
                          onClick={() => printVoucher(p)}
                          style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #0f766e', background: '#f0fdfa', color: '#0f766e', fontWeight: 800, cursor: 'pointer', fontSize: '0.76rem', display: 'inline-flex', alignItems: 'center', gap: 5 }}
                        >
                          <FaPrint /> Imprimir Colilla
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* MODAL: CREAR / EDITAR EMPLEADO Y REGLAS ESPECÍFICAS DE COMISIÓN SOBRE GANANCIA */}
        <AnimatePresence>
          {isEmpModalOpen && (
            <ModalOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEmpModalOpen(false)}>
              <ModalBox as="form" onSubmit={handleSaveEmployee} onClick={e => e.stopPropagation()}>
                <ModalHeader>
                  <h2>
                    <FaCog />
                    {editingEmp ? `Configurar Planilla y Reglas: ${editingEmp.nombre}` : 'Nuevo Empleado y Reglas de Comisión'}
                  </h2>
                  <button type="button" onClick={() => setIsEmpModalOpen(false)}>✕</button>
                </ModalHeader>

                <ModalBody>
                  <FormGrid>
                    <Field>
                      <label>Nombre del Empleado *</label>
                      <input
                        type="text"
                        value={empForm.nombre}
                        onChange={e => setEmpForm(p => ({ ...p, nombre: e.target.value }))}
                        required
                      />
                    </Field>

                    <Field>
                      <label>Teléfono</label>
                      <input
                        type="text"
                        value={empForm.telefono}
                        onChange={e => setEmpForm(p => ({ ...p, telefono: e.target.value }))}
                      />
                    </Field>

                    <Field>
                      <label>Cargo / Puesto</label>
                      <input
                        type="text"
                        value={empForm.cargo}
                        onChange={e => setEmpForm(p => ({ ...p, cargo: e.target.value }))}
                      />
                    </Field>

                    <Field>
                      <label>Usuario del Sistema Vinculado</label>
                      <select
                        value={empForm.id_usuario_vinculado || ''}
                        onChange={e => setEmpForm(p => ({ ...p, id_usuario_vinculado: e.target.value }))}
                      >
                        <option value="">-- Sin usuario vinculado --</option>
                        {(allUsers || []).map(u => (
                          <option key={u.id_usuario} value={u.id_usuario}>
                            {u.nombre_usuario} ({u.rol})
                          </option>
                        ))}
                      </select>
                      <small>Permite sumar automáticamente las ventas facturadas con su usuario.</small>
                    </Field>

                    <Field>
                      <label>Salario Base Fijo (C$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={empForm.salario_base}
                        onChange={e => setEmpForm(p => ({ ...p, salario_base: e.target.value }))}
                      />
                    </Field>

                    <Field>
                      <label>Frecuencia de Pago</label>
                      <select
                        value={empForm.frecuencia_pago}
                        onChange={e => setEmpForm(p => ({ ...p, frecuencia_pago: e.target.value }))}
                      >
                        <option value="Semanal">Semanal</option>
                        <option value="Quincenal">Quincenal</option>
                        <option value="Mensual">Mensual</option>
                      </select>
                    </Field>
                  </FormGrid>

                  <div style={{ background: '#f0fdfa', border: '1px solid #99f6e4', borderRadius: 14, padding: '1.1rem' }}>
                    <h4 style={{ margin: '0 0 10px', color: '#0f766e', fontSize: '0.92rem' }}>
                      📈 Reglas Específicas de Comisión basadas en la Ganancia Real
                    </h4>
                    <FormGrid>
                      <Field>
                        <label>Esquema / Regla de Comisión</label>
                        <select
                          value={empForm.tipo_comision}
                          onChange={e => setEmpForm(p => ({ ...p, tipo_comision: e.target.value }))}
                        >
                          <option value="PORCENTAJE_GANANCIA">% Sobre Ganancia Neta (Venta - Costo)</option>
                          <option value="ESCALONADA_GANANCIA">Escalonada por Meta de Ganancia (Nivel 1 / Nivel 2)</option>
                          <option value="MIXTA_GANANCIA_VENTA">Mixta (% sobre Ganancia + % sobre Venta)</option>
                          <option value="PORCENTAJE_VENTA">% Sobre Total Facturado (Venta Bruta)</option>
                          <option value="SIN_COMISION">Solo Salario Fijo (Sin Comisión)</option>
                        </select>
                      </Field>

                      <Field>
                        <label>% Comisión sobre Ganancia Neta</label>
                        <input
                          type="number"
                          step="0.1"
                          value={empForm.porcentaje_comision_ganancia}
                          onChange={e => setEmpForm(p => ({ ...p, porcentaje_comision_ganancia: e.target.value }))}
                        />
                        <small>Ej: 5% significa que por cada C$ 1,000 de utilidad neta gana C$ 50.</small>
                      </Field>

                      <Field>
                        <label>Margen Mínimo del Producto (%)</label>
                        <input
                          type="number"
                          step="0.5"
                          value={empForm.margen_minimo_producto}
                          onChange={e => setEmpForm(p => ({ ...p, margen_minimo_producto: e.target.value }))}
                        />
                        <small>Protección: Si un ítem se vende con un margen menor a este %, no paga comisión.</small>
                      </Field>

                      <Field>
                        <label>Ganancia Mínima Requerida (C$)</label>
                        <input
                          type="number"
                          step="10"
                          value={empForm.meta_ganancia_minima}
                          onChange={e => setEmpForm(p => ({ ...p, meta_ganancia_minima: e.target.value }))}
                        />
                        <small>Piso mínimo de ganancia que debe generar en el período para activar comisión.</small>
                      </Field>

                      <Field>
                        <label>Meta de Ganancia Objetivo (C$)</label>
                        <input
                          type="number"
                          step="10"
                          value={empForm.meta_ganancia_objetivo}
                          onChange={e => setEmpForm(p => ({ ...p, meta_ganancia_objetivo: e.target.value }))}
                        />
                        <small>Si la ganancia supera esta meta, gana el Bono y/o sube al % Nivel 2.</small>
                      </Field>

                      <Field>
                        <label>% Comisión Nivel 2 (Al superar meta)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={empForm.porcentaje_nivel2_ganancia}
                          onChange={e => setEmpForm(p => ({ ...p, porcentaje_nivel2_ganancia: e.target.value }))}
                        />
                        <small>Ej: Sube de 5% a 8% sobre la ganancia si supera la meta objetivo.</small>
                      </Field>

                      <Field>
                        <label>Bono Fijo por Superar Meta (C$)</label>
                        <input
                          type="number"
                          step="10"
                          value={empForm.bono_meta_ganancia}
                          onChange={e => setEmpForm(p => ({ ...p, bono_meta_ganancia: e.target.value }))}
                        />
                        <small>Premio adicional automático en C$ cuando supera la meta de ganancia.</small>
                      </Field>

                      <Field>
                        <label>% Comisión sobre Venta Bruta (Opcional)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={empForm.porcentaje_comision_venta}
                          onChange={e => setEmpForm(p => ({ ...p, porcentaje_comision_venta: e.target.value }))}
                        />
                        <small>Usado en regla Mixta o Porcentaje sobre Venta.</small>
                      </Field>
                    </FormGrid>
                  </div>
                </ModalBody>

                <ModalFooter>
                  <button
                    type="button"
                    onClick={() => setIsEmpModalOpen(false)}
                    style={{ padding: '0.68rem 1.2rem', borderRadius: 10, border: '1px solid #cbd5e1', background: '#fff', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Cancelar
                  </button>
                  <PrimaryButton type="submit">
                    Guardar Reglas y Empleado
                  </PrimaryButton>
                </ModalFooter>
              </ModalBox>
            </ModalOverlay>
          )}
        </AnimatePresence>

        {/* MODAL: REGISTRAR VALE / ADELANTO / DEDUCCIÓN / BONO EXTRA */}
        <AnimatePresence>
          {movModal.open && movModal.employee && (
            <ModalOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMovModal({ open: false, employee: null })}>
              <ModalBox $maxWidth="460px" as="form" onSubmit={handleAddMovement} onClick={e => e.stopPropagation()}>
                <ModalHeader>
                  <h2>Registrar Movimiento: {movModal.employee.nombre}</h2>
                  <button type="button" onClick={() => setMovModal({ open: false, employee: null })}>✕</button>
                </ModalHeader>
                <ModalBody>
                  <Field>
                    <label>Tipo de Movimiento</label>
                    <select value={movForm.tipo} onChange={e => setMovForm(p => ({ ...p, tipo: e.target.value }))}>
                      <option value="ADELANTO">➖ Vale / Adelanto de Sueldo o Comisión</option>
                      <option value="DEDUCCION">➖ Deducción / Faltante de Caja</option>
                      <option value="BONO">➕ Bono Extra / Incentivo Especial</option>
                    </select>
                  </Field>
                  <Field>
                    <label>Monto en Córdobas (C$) *</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Ej: 500"
                      value={movForm.monto}
                      onChange={e => setMovForm(p => ({ ...p, monto: e.target.value }))}
                      required
                    />
                  </Field>
                  <Field>
                    <label>Concepto / Motivo *</label>
                    <input
                      type="text"
                      placeholder="Ej: Adelanto de quincena autorizado"
                      value={movForm.concepto}
                      onChange={e => setMovForm(p => ({ ...p, concepto: e.target.value }))}
                      required
                    />
                  </Field>
                </ModalBody>
                <ModalFooter>
                  <button type="button" onClick={() => setMovModal({ open: false, employee: null })} style={{ padding: '0.65rem 1.1rem', borderRadius: 10, border: '1px solid #cbd5e1', background: '#fff', fontWeight: 700, cursor: 'pointer' }}>
                    Cancelar
                  </button>
                  <PrimaryButton type="submit">Guardar en Planilla</PrimaryButton>
                </ModalFooter>
              </ModalBox>
            </ModalOverlay>
          )}
        </AnimatePresence>

        {/* MODAL: DETALLE DE PRODUCTOS VENDIDOS Y GANANCIA POR LÍNEA */}
        <AnimatePresence>
          {detailModal.open && detailModal.employee && (
            <ModalOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDetailModal({ open: false, employee: null })}>
              <ModalBox $maxWidth="920px" onClick={e => e.stopPropagation()}>
                <ModalHeader>
                  <h2>
                    <FaListUl /> Auditoría de Ganancia por Producto Vendido: {detailModal.employee.nombre}
                  </h2>
                  <button type="button" onClick={() => setDetailModal({ open: false, employee: null })}>✕</button>
                </ModalHeader>
                <ModalBody>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                      <thead>
                        <tr style={{ background: '#0f172a', color: '#fff', textAlign: 'left' }}>
                          <th style={{ padding: '8px 10px' }}>Factura</th>
                          <th style={{ padding: '8px 10px' }}>Producto</th>
                          <th style={{ padding: '8px 10px' }}>Cant.</th>
                          <th style={{ padding: '8px 10px' }}>Costo U.</th>
                          <th style={{ padding: '8px 10px' }}>Precio U.</th>
                          <th style={{ padding: '8px 10px' }}>Ganancia Real</th>
                          <th style={{ padding: '8px 10px' }}>Margen %</th>
                          <th style={{ padding: '8px 10px' }}>Estado Regla</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(detailModal.employee.detalle_productos || []).map((item, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '8px 10px', fontWeight: 700 }}>#{item.id_venta}</td>
                            <td style={{ padding: '8px 10px' }}>
                              <strong>{item.nombre}</strong> ({item.codigo})
                            </td>
                            <td style={{ padding: '8px 10px' }}>{item.cantidad}</td>
                            <td style={{ padding: '8px 10px' }}>C$ {fmt(item.costo_unitario)}</td>
                            <td style={{ padding: '8px 10px' }}>C$ {fmt(item.precio_unitario)}</td>
                            <td style={{ padding: '8px 10px', fontWeight: 800, color: item.ganancia_linea >= 0 ? '#059669' : '#dc2626' }}>
                              C$ {fmt(item.ganancia_linea)}
                            </td>
                            <td style={{ padding: '8px 10px', fontWeight: 700 }}>{item.margen_pct}%</td>
                            <td style={{ padding: '8px 10px' }}>
                              {item.comisiona ? (
                                <span style={{ color: '#059669', fontWeight: 800 }}>✅ Comisiona</span>
                              ) : (
                                <span style={{ color: '#dc2626', fontWeight: 700 }}>⚠️ Bajo margen mín.</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <PrimaryButton type="button" onClick={() => setDetailModal({ open: false, employee: null })}>
                    Cerrar Detalle
                  </PrimaryButton>
                </ModalFooter>
              </ModalBox>
            </ModalOverlay>
          )}
        </AnimatePresence>

        {/* MODAL: LIQUIDAR Y CERRAR PAGO DE PLANILLA */}
        <AnimatePresence>
          {liquidateModal.open && liquidateModal.employee && (
            <ModalOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLiquidateModal({ open: false, employee: null, metodo_pago: 'Efectivo', notas: '' })}>
              <ModalBox $maxWidth="520px" as="form" onSubmit={handleConfirmLiquidate} onClick={e => e.stopPropagation()}>
                <ModalHeader>
                  <h2>
                    <FaReceipt /> Liquidar Planilla: {liquidateModal.employee.nombre}
                  </h2>
                  <button type="button" onClick={() => setLiquidateModal({ open: false, employee: null, metodo_pago: 'Efectivo', notas: '' })}>✕</button>
                </ModalHeader>
                <ModalBody>
                  <BreakdownBox>
                    <div className="row">
                      <span>Período a Liquidar:</span>
                      <strong>{startDate} al {endDate}</strong>
                    </div>
                    <div className="row">
                      <span>Ganancia Comisionable Generada:</span>
                      <strong>C$ {fmt(liquidateModal.employee.metricas?.ganancia_comisionable)}</strong>
                    </div>
                    <div className="row">
                      <span>(+) Salario Base:</span>
                      <strong>C$ {fmt(liquidateModal.employee.metricas?.salario_base)}</strong>
                    </div>
                    <div className="row">
                      <span>(+) Total Comisiones y Bono de Meta:</span>
                      <strong style={{ color: '#059669' }}>+ C$ {fmt(liquidateModal.employee.metricas?.total_comisiones)}</strong>
                    </div>
                    <div className="row">
                      <span>(+) Bonos Extra:</span>
                      <strong>+ C$ {fmt(liquidateModal.employee.metricas?.bonos_extra)}</strong>
                    </div>
                    <div className="row">
                      <span>(-) Vales / Adelantos / Deducciones:</span>
                      <strong style={{ color: '#dc2626' }}>- C$ {fmt(liquidateModal.employee.metricas?.deducciones_adelantos)}</strong>
                    </div>
                    <div className="row total">
                      <span>TOTAL NETO A PAGAR:</span>
                      <span style={{ color: '#0f766e' }}>C$ {fmt(liquidateModal.employee.metricas?.total_neto_pagar)}</span>
                    </div>
                  </BreakdownBox>

                  <Field>
                    <label>Método de Pago</label>
                    <select
                      value={liquidateModal.metodo_pago}
                      onChange={e => setLiquidateModal(p => ({ ...p, metodo_pago: e.target.value }))}
                    >
                      <option value="Efectivo">💵 Efectivo</option>
                      <option value="Transferencia Bancaria">🏦 Transferencia Bancaria</option>
                      <option value="Cheque">🧾 Cheque</option>
                    </select>
                  </Field>

                  <Field>
                    <label>Observaciones en Colilla (Opcional)</label>
                    <input
                      type="text"
                      placeholder="Ej: Pago de quincena y comisiones al día"
                      value={liquidateModal.notas}
                      onChange={e => setLiquidateModal(p => ({ ...p, notas: e.target.value }))}
                    />
                  </Field>
                </ModalBody>
                <ModalFooter>
                  <button type="button" onClick={() => setLiquidateModal({ open: false, employee: null, metodo_pago: 'Efectivo', notas: '' })} style={{ padding: '0.65rem 1.1rem', borderRadius: 10, border: '1px solid #cbd5e1', background: '#fff', fontWeight: 700, cursor: 'pointer' }}>
                    Cancelar
                  </button>
                  <PrimaryButton type="submit">
                    <FaCheckCircle /> Confirmar Pago y Generar Colilla
                  </PrimaryButton>
                </ModalFooter>
              </ModalBox>
            </ModalOverlay>
          )}
        </AnimatePresence>

        {/* MODAL: COLILLA RECIÉN GENERADA */}
        <AnimatePresence>
          {voucherModal.open && voucherModal.pago && (
            <ModalOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setVoucherModal({ open: false, pago: null })}>
              <ModalBox $maxWidth="480px" onClick={e => e.stopPropagation()}>
                <ModalHeader>
                  <h2>✅ Planilla Liquidada — Folio #{voucherModal.pago.id_pago}</h2>
                  <button type="button" onClick={() => setVoucherModal({ open: false, pago: null })}>✕</button>
                </ModalHeader>
                <ModalBody style={{ textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: '#334155' }}>
                    Se registró exitosamente el pago de planilla y comisión para{' '}
                    <strong>{voucherModal.pago.empleado_nombre}</strong> por un total neto de:
                  </p>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f766e' }}>
                    C$ {fmt(voucherModal.pago.total_neto_pagado)}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <button type="button" onClick={() => setVoucherModal({ open: false, pago: null })} style={{ padding: '0.65rem 1.1rem', borderRadius: 10, border: '1px solid #cbd5e1', background: '#fff', fontWeight: 700, cursor: 'pointer' }}>
                    Cerrar
                  </button>
                  <PrimaryButton type="button" onClick={() => printVoucher(voucherModal.pago)}>
                    <FaPrint /> Imprimir Colilla de Pago
                  </PrimaryButton>
                </ModalFooter>
              </ModalBox>
            </ModalOverlay>
          )}
        </AnimatePresence>
      </Container>
    </PageWrapper>
  );
};

export default Empleados;

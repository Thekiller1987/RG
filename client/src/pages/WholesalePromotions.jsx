
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaArrowLeft, FaPlus, FaTrash, FaEdit, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getPromotions, createPromotion, updatePromotion, deletePromotion, togglePromotionStatus } from '../service/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast'; // Assuming toast is available or use alert
import PromptModal from './pos/components/PromptModal.jsx'; // Reuse prompt modal for simple inputs if possible, or create custom form

const PageWrapper = styled.div`
  padding: 2rem;
  background-color: #f0f2f5;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #1e293b; margin: 0; display: flex; align-items: center; gap: 10px;
`;

const Table = styled.table`
  width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);
`;

const Th = styled.th`background: #f8fafc; padding: 12px; text-align: left; color: #64748b; font-weight: 600;`;
const Td = styled.td`padding: 12px; border-bottom: 1px solid #e2e8f0; color: #334155;`;

const Button = styled.button`
  background: ${props => props.danger ? '#ef4444' : props.secondary ? '#64748b' : '#3b82f6'};
  color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 500; display: flex; align-items: center; gap: 6px;
  &:hover { opacity: 0.9; }
`;

export default function WholesalePromotions() {
    const { token } = useAuth();
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPromo, setEditingPromo] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        nombre: '', tipo: 'porcentaje', valor: '', cantidad_minima: 1, id_producto: '', tipo_cliente: '', fecha_inicio: '', fecha_fin: ''
    });

    // ...

    const handleEdit = (promo) => {
        setEditingPromo(promo);
        setFormData({
            nombre: promo.nombre,
            tipo: promo.tipo,
            valor: promo.valor,
            cantidad_minima: promo.cantidad_minima,
            id_producto: promo.id_producto || '',
            tipo_cliente: promo.tipo_cliente || '',
            fecha_inicio: promo.fecha_inicio ? promo.fecha_inicio.split('T')[0] : '',
            fecha_fin: promo.fecha_fin ? promo.fecha_fin.split('T')[0] : ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Seguro de eliminar esta promoción?')) return;
        try {
            await deletePromotion(id, token);
            toast.success('Eliminada');
            fetchPromos();
        } catch (e) {
            toast.error('Error al eliminar');
        }
    };

    const handleToggle = async (id) => {
        try {
            await togglePromotionStatus(id, token);
            fetchPromos();
        } catch (e) {
            toast.error('Error al cambiar estado');
        }
    };

    return (
        <PageWrapper>
            <Header>
                <Title>
                    <Link to="/dashboard" style={{ color: '#64748b', textDecoration: 'none', marginRight: '10px' }}><FaArrowLeft /></Link>
                    Promociones Mayorista
                </Title>
                <Button onClick={() => { setEditingPromo(null); setFormData({ nombre: '', tipo: 'porcentaje', valor: '', cantidad_minima: 1, id_producto: '', tipo_cliente: '', fecha_inicio: '', fecha_fin: '' }); setIsModalOpen(true); }}>
                    <FaPlus /> Nueva Promoción
                </Button>
            </Header>

            <Table>
                <thead>
                    <tr>
                        <Th>Nombre</Th>
                        <Th>Tipo</Th>
                        <Th>Valor</Th>
                        <Th>Min. Cantidad</Th>
                        <Th>Producto ID</Th>
                        <Th>Tipo Cliente</Th>
                        <Th>Estado</Th>
                        <Th>Acciones</Th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? <tr><Td colSpan="7">Cargando...</Td></tr> : promotions.map(p => (
                        <tr key={p.id}>
                            <Td>{p.nombre}</Td>
                            <Td>{p.tipo}</Td>
                            <Td>{p.valor}</Td>
                            <Td>{p.cantidad_minima}</Td>
                            <Td>{p.id_producto || 'Todos'}</Td>
                            <Td>{p.tipo_cliente || 'Todos'}</Td>
                            <Td>
                                <span style={{ cursor: 'pointer', color: p.activa ? '#10b981' : '#cbd5e1' }} onClick={() => handleToggle(p.id)}>
                                    {p.activa ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
                                </span>
                            </Td>
                            <Td>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <Button secondary onClick={() => handleEdit(p)}><FaEdit /></Button>
                                    <Button danger onClick={() => handleDelete(p.id)}><FaTrash /></Button>
                                </div>
                            </Td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '10px', width: '500px', maxWidth: '90%' }}>
                        <h2>{editingPromo ? 'Editar' : 'Nueva'} Promoción</h2>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input placeholder="Nombre Promoción" value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} required style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <select value={formData.tipo} onChange={e => setFormData({ ...formData, tipo: e.target.value })} style={{ padding: '8px', flex: 1 }}>
                                    <option value="porcentaje">Porcentaje (%)</option>
                                    <option value="monto_fijo">Monto Fijo (C$)</option>
                                </select>
                                <input type="number" placeholder="Valor" value={formData.valor} onChange={e => setFormData({ ...formData, valor: e.target.value })} required style={{ padding: '8px', flex: 1 }} />
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <label style={{ flex: 1 }}>Min. Cantidad: <input type="number" value={formData.cantidad_minima} onChange={e => setFormData({ ...formData, cantidad_minima: e.target.value })} style={{ padding: '8px', width: '100%' }} /></label>
                                <label style={{ flex: 1 }}>ID Producto (Opcional): <input type="text" value={formData.id_producto} onChange={e => setFormData({ ...formData, id_producto: e.target.value })} style={{ padding: '8px', width: '100%' }} /></label>
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <label style={{ flex: 1 }}>Tipo Cliente:
                                    <select value={formData.tipo_cliente} onChange={e => setFormData({ ...formData, tipo_cliente: e.target.value })} style={{ padding: '8px', width: '100%' }}>
                                        <option value="">-- Todos --</option>
                                        <option value="General">General</option>
                                        <option value="Taller">Taller</option>
                                        <option value="Distribuidor">Distribuidor</option>
                                        <option value="Corporativo">Corporativo</option>
                                    </select>
                                </label>
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <label style={{ flex: 1 }}>Inicio: <input type="date" value={formData.fecha_inicio} onChange={e => setFormData({ ...formData, fecha_inicio: e.target.value })} style={{ padding: '8px', width: '100%' }} /></label>
                                <label style={{ flex: 1 }}>Fin: <input type="date" value={formData.fecha_fin} onChange={e => setFormData({ ...formData, fecha_fin: e.target.value })} style={{ padding: '8px', width: '100%' }} /></label>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1rem' }}>
                                <Button type="button" secondary onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                                <Button type="submit">Guardar</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </PageWrapper>
    );
}

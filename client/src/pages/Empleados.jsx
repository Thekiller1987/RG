import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { getEmpleados, createEmpleado, updateEmpleado, deleteEmpleado } from '../service/api';

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
);

const PageWrapper = styled.div`
  padding: 2rem 4rem;
  background-color: #f8f9fa;
  min-height: 100vh;
  @media (max-width: 768px) {
    padding: 1rem;
    min-height: 100dvh;
  }
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  @media (max-width: 500px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
`;

const Header = styled.h1`
  font-size: 2.5rem;
  color: #343a40;
  @media (max-width: 768px) { font-size: 1.8rem; text-align: center; }
`;

const Button = styled.button`
  padding: 0.7rem 1.3rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9rem;
  transition: all 0.2s ease-in-out;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);

  &:active {
    transform: scale(0.98);
    box-shadow: none;
  }
`;

const BackButton = styled(Link)`
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: #495057;
    font-weight: 600;
    margin-bottom: 2rem;
    &:hover { color: #007bff; }
    @media (max-width: 768px) {
      margin-bottom: 1.5rem; font-size: 1rem; align-self: flex-start;
    }
`;

const CreateButton = styled(Button)`
  background-color: #28a745;
  color: white;
  &:hover { background-color: #218838; }
  @media (max-width: 500px) { width: 100%; justify-content: center; }
`;

const EditButton = styled(Button)`
  background: none; border: 1px solid #ffc107; color: #ffc107; padding: 0.5rem 1rem; margin-right: 0.5rem;
  &:hover { background-color: #ffc107; color: #212529; }
`;

const DeleteButton = styled(Button)`
  background: none; border: 1px solid #dc3545; color: #dc3545; padding: 0.5rem 1rem;
  &:hover { background-color: #dc3545; color: white; }
`;

// -- Cards (Mobile) --
const MobileCardContainer = styled.div`
  display: none;
  @media (max-width: 768px) { display: flex; flex-direction: column; gap: 1rem; }
`;

const Card = styled.div`
  background-color: white;
  padding: 1rem 1.2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border-left: 5px solid #007bff;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.5rem;
`;

// -- Table (Desktop) --
const Table = styled.table`
  width: 100%; border-collapse: collapse; background-color: white;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.07); border-radius: 12px; overflow: hidden;
  @media (max-width: 768px) { display: none; }
`;
const Th = styled.th` background-color: #343a40; color: white; padding: 1.2rem 1rem; text-align: left; font-weight: 600; `;
const Td = styled.td` padding: 1.2rem 1rem; border-bottom: 1px solid #dee2e6; color: #495057; `;
const Tr = styled.tr` &:last-child ${Td} { border-bottom: none; } &:hover { background-color: #f8f9fa; } `;

// -- Modals --
const ModalOverlay = styled(motion.div)`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.6); display: flex; justify-content: center; align-items: center; z-index: 1000;
`;
const ModalContent = styled(motion.form)`
  background: white; padding: 2.5rem; border-radius: 16px; width: 90%; max-width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  @media (max-width: 500px) { width: 95%; padding: 1.5rem; margin: 1rem; }
`;
const Input = styled.input`
  width: 100%; padding: 0.8rem 1rem; margin-bottom: 1.2rem; border-radius: 8px; border: 1px solid #ced4da; font-size: 1rem;
`;

const Empleados = () => {
    const { token } = useAuth();
    const [empleados, setEmpleados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmp, setEditingEmp] = useState(null);
    const [formData, setFormData] = useState({ nombre: '', telefono: '', cargo: 'Vendedor' });

    const fetchEmpleados = async () => {
        try {
            setLoading(true);
            const data = await getEmpleados(token);
            setEmpleados(Array.isArray(data) ? data : []);
        } catch (err) {
            toast.error('Error al cargar empleados');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchEmpleados(); }, []);

    const openCreateModal = () => {
        setEditingEmp(null);
        setFormData({ nombre: '', telefono: '', cargo: 'Vendedor' });
        setIsModalOpen(true);
    };

    const openEditModal = (emp) => {
        setEditingEmp(emp);
        setFormData({ nombre: emp.nombre, telefono: emp.telefono || '', cargo: emp.cargo });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Seguro que deseas eliminar este empleado?')) return;
        try {
            await deleteEmpleado(id, token);
            toast.success('Empleado eliminado');
            fetchEmpleados();
        } catch (err) {
            toast.error('Error al eliminar empleado');
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingEmp) await updateEmpleado(editingEmp.id_empleado, formData, token);
            else await createEmpleado(formData, token);
            toast.success('Guardado correctamente');
            setIsModalOpen(false);
            fetchEmpleados();
        } catch (err) {
            toast.error(err.message || 'Error al guardar');
        }
    };

    if (loading) return <PageWrapper><p>Cargando...</p></PageWrapper>;

    return (
        <PageWrapper>
            <BackButton to="/dashboard"><BackIcon /> Volver al Dashboard</BackButton>
            <TopBar>
                <Header>Gestión de Empleados</Header>
                <CreateButton onClick={openCreateModal}>+ Nuevo Empleado</CreateButton>
            </TopBar>

            {/* Desktop */}
            <Table>
                <thead>
                    <Tr>
                        <Th>ID</Th><Th>Nombre</Th><Th>Teléfono</Th><Th>Cargo</Th><Th>Acciones</Th>
                    </Tr>
                </thead>
                <tbody>
                    {empleados.map(emp => (
                        <Tr key={emp.id_empleado}>
                            <Td>{emp.id_empleado}</Td>
                            <Td><strong>{emp.nombre}</strong></Td>
                            <Td>{emp.telefono || '-'}</Td>
                            <Td>{emp.cargo}</Td>
                            <Td>
                                <EditButton onClick={() => openEditModal(emp)}>✏️ Editar</EditButton>
                                <DeleteButton onClick={() => handleDelete(emp.id_empleado)}>🗑️</DeleteButton>
                            </Td>
                        </Tr>
                    ))}
                </tbody>
            </Table>

            {/* Mobile */}
            <MobileCardContainer>
                {empleados.map(emp => (
                    <Card key={emp.id_empleado}>
                        <div>
                            <strong>{emp.nombre}</strong>
                            <div style={{ fontSize: '0.85rem', color: '#666' }}>{emp.cargo} - {emp.telefono}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <EditButton onClick={() => openEditModal(emp)} style={{ marginRight: 0 }}>✏️</EditButton>
                            <DeleteButton onClick={() => handleDelete(emp.id_empleado)}>🗑️</DeleteButton>
                        </div>
                    </Card>
                ))}
            </MobileCardContainer>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <ModalOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)}>
                        <ModalContent initial={{ y: -50 }} animate={{ y: 0 }} exit={{ y: 50 }} onClick={e => e.stopPropagation()} onSubmit={handleSave}>
                            <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>{editingEmp ? 'Editar Empleado' : 'Nuevo Empleado'}</h2>
                            <Input placeholder="Nombre del empleado" value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} required />
                            <Input placeholder="Teléfono (Opcional)" value={formData.telefono} onChange={e => setFormData({ ...formData, telefono: e.target.value })} />
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <Button type="button" onClick={() => setIsModalOpen(false)} style={{ background: '#eee', color: '#333', flex: 1, justifyContent: 'center' }}>Cancelar</Button>
                                <Button type="submit" style={{ background: '#007bff', color: 'white', flex: 1, justifyContent: 'center' }}>Guardar</Button>
                            </div>
                        </ModalContent>
                    </ModalOverlay>
                )}
            </AnimatePresence>
        </PageWrapper>
    );
};

export default Empleados;

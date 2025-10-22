// client/src/pages/PedidosYApartados.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import * as api from '../service/api';
import { FaClipboardList, FaFilter, FaPlus, FaSearch, FaArrowLeft, FaBoxOpen, FaSpinner, FaTimes, FaDollarSign, FaCheckCircle, FaBan } from 'react-icons/fa';

import CreateOrderModal from './pos/components/CreateOrderModal';
import OrderDetailModal from './pos/components/OrderDetailModal';
import ConfirmationModal from './pos/components/ConfirmationModal';
import AlertModal from './pos/components/AlertModal';
import AbonoModal from './pos/components/AbonoModal';
import { loadCajaSession } from '../utils/caja';

// --- ESTILOS ---
const spin = keyframes`from { transform: rotate(0deg); } to { transform: rotate(360deg); }`;

const PageWrapper = styled(motion.div)`
    padding: 2rem 4rem;
    background-color: #f0f2f5;
    min-height: 100vh;
    @media (max-width: 768px) { padding: 1.5rem; }
`;

const HeaderContainer = styled.div`
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;
`;

const Title = styled.h1`
    font-size: 2.5rem; color: #212529; display: flex;
    align-items: center; gap: 1rem; margin: 0;
    @media (max-width: 768px) { font-size: 1.8rem; }
`;

const Button = styled.button`
    padding: 0.7rem 1.3rem; border: none; font-size: 0.9rem;
    background-color: ${props => props.$primary ? '#28a745' : '#007bff'};
    color: white; border-radius: 8px; cursor: pointer; font-weight: bold;
    display: inline-flex; align-items: center; gap: 0.5rem;
    transition: all 0.2s ease;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,0.15); }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const BackButton = styled(Link)`
    padding: 0.7rem 1.3rem; background-color: #6c757d;
    color: white; border-radius: 8px; font-weight: bold;
    display: inline-flex; align-items: center; gap: 0.5rem;
    text-decoration: none; transition: background-color 0.2s ease;
    &:hover { background-color: #5a6268; }
`;

const ContentGrid = styled.div`
    display: grid; grid-template-columns: 300px 1fr; 
    gap: 2rem;
    @media (max-width: 1024px) { grid-template-columns: 1fr; }
`;

const FilterPanel = styled(motion.aside)`
    background-color: white; padding: 1.5rem; border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05); align-self: flex-start;
    display: flex; flex-direction: column; gap: 1.5rem;
`;

const Input = styled.input`
    width: 100%; padding: 0.8rem; font-size: 1rem; border-radius: 8px; 
    border: 1px solid #ced4da;
    &:focus { border-color: #80bdff; outline: 0; box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25); }
`;

const Select = styled.select`
    width: 100%; padding: 0.8rem; font-size: 1rem; border-radius: 8px; 
    border: 1px solid #ced4da; background-color: #fff;
`;

const PedidosGrid = styled(motion.div)`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
`;

const PedidoCard = styled(motion.div)`
    background-color: white; border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    border-left: 6px solid ${props => {
        switch (props.estado) {
            case 'Apartado': return '#ffc107'; 
            case 'COMPLETADO': return '#28a745';
            case 'Cancelado': return '#dc3545';
            default: return '#6c757d'; // Pendiente
        }
    }};
    display: flex; flex-direction: column;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    &:hover { transform: translateY(-5px); box-shadow: 0 6px 20px rgba(0,0,0,0.1); }
`;

const CardBody = styled.div`
    padding: 1.5rem;
`;

const CardFooter = styled.div`
    padding: 1rem 1.5rem; background-color: #f8f9fa;
    border-top: 1px solid #e9ecef; margin-top: auto;
`;

const ProgressBar = styled.div`
    background-color: #e9ecef; border-radius: 99px; height: 10px; overflow: hidden;
    div {
        width: ${props => props.percent}%;
        background-color: #28a745; height: 100%;
        transition: width 0.5s ease;
    }
`;

const CenteredMessage = styled(motion.div)`
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 4rem; text-align: center; color: #6c757d;
    height: 100%;
    svg { font-size: 3rem; margin-bottom: 1rem; opacity: 0.5; }
    p { font-size: 1.2rem; }
`;

// --- COMPONENTE PRINCIPAL ---
const PedidosYApartados = () => {
    const { user } = useAuth();
    const token = localStorage.getItem('token');

    const [pedidos, setPedidos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filtroEstado, setFiltroEstado] = useState('Activos');
    const [searchTerm, setSearchTerm] = useState('');
    const [modal, setModal] = useState({ name: null, props: {} });

    const openModal = useCallback((name, props = {}) => setModal({ name, props }), []);
    const closeModal = useCallback(() => setModal({ name: null, props: {} }), []);
    const showAlert = useCallback((props) => openModal('alert', props), [openModal]);
    const showConfirmation = useCallback((props) => openModal('confirmation', props), [openModal]);

    const isCajaOpen = useMemo(() => {
        if (!user) return false;
        const session = loadCajaSession(user.id_usuario || user.id);
        return session && !session.closedAt;
    }, [user]);

    const fetchPedidos = useCallback(async () => {
        if (!token) { setIsLoading(false); return; }
        setIsLoading(true);
        try {
            const data = await api.fetchOrders(token);
            setPedidos(data);
        } catch (error) {
            showAlert({ title: "Error de Red", message: `No se pudieron cargar los pedidos. ${error.message}` });
        } finally {
            setIsLoading(false);
        }
    }, [token, showAlert]);

    useEffect(() => {
        fetchPedidos();
    }, [fetchPedidos]);
    
    const pedidosFiltrados = useMemo(() => {
        let filtered = Array.isArray(pedidos) ? pedidos : [];
        const activeStates = ['Apartado', 'Pendiente'];
        
        if (filtroEstado === 'Activos') {
            filtered = filtered.filter(p => activeStates.includes(p.estado));
        } else if (filtroEstado !== 'Todos') {
            filtered = filtered.filter(p => p.estado === filtroEstado);
        }

        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(p => 
                (p.clienteNombre && p.clienteNombre.toLowerCase().includes(lowerSearch)) || 
                String(p.id).includes(lowerSearch)
            );
        }
        return filtered;
    }, [pedidos, filtroEstado, searchTerm]);

    const handleCreateOrder = async (orderData) => {
        try {
            await api.createOrder(orderData, token);
            showAlert({ title: "Éxito", message: "Pedido creado correctamente."});
            await fetchPedidos();
            closeModal();
        } catch (error) {
            showAlert({ title: "Error al Crear", message: `No se pudo crear el pedido. ${error.message}` });
        }
    };

    if (!user) return <PageWrapper><CenteredMessage><p>No estás autenticado. Por favor, inicia sesión.</p></CenteredMessage></PageWrapper>;

    return (
        <PageWrapper initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <HeaderContainer>
                <Title><FaClipboardList /> Pedidos y Apartados</Title>
                <div>
                    <Button $primary onClick={() => openModal('createOrder')} disabled={!isCajaOpen} style={{marginRight: '1rem'}}>
                        <FaPlus /> Crear Pedido
                    </Button>
                    <BackButton to="/dashboard"><FaArrowLeft/> Volver</BackButton>
                </div>
            </HeaderContainer>

            {!isCajaOpen && 
                <motion.p initial={{y: -20, opacity:0}} animate={{y: 0, opacity:1}} style={{color: '#856404', background: '#fff3cd', padding: '1rem', borderRadius: '8px', textAlign: 'center', marginBottom: '1rem', border: '1px solid #ffeeba'}}>
                    La caja está cerrada. No se pueden crear nuevos pedidos ni registrar pagos.
                </motion.p>
            }
            
            <ContentGrid>
                <FilterPanel initial={{x: -50, opacity: 0}} animate={{x: 0, opacity: 1}} transition={{delay: 0.2}}>
                    <div>
                        <h3 style={{marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem'}}><FaSearch /> Buscar</h3>
                        <Input type="text" placeholder="ID o nombre de cliente..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                    <div>
                        <h3 style={{marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem'}}><FaFilter /> Filtrar por Estado</h3>
                        <Select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                            <option value="Activos">Activos (Apartados/Pendientes)</option>
                            <option value="Todos">Todos</option>
                            <option value="Apartado">Apartados</option>
                            <option value="Pendiente">Pendientes</option>
                            <option value="COMPLETADO">Completados</option>
                            <option value="Cancelado">Cancelados</option>
                        </Select>
                    </div>
                </FilterPanel>

                <main>
                    {isLoading ? (
                        <CenteredMessage><FaSpinner style={{animation: `${spin} 1s linear infinite`}} /><p>Cargando...</p></CenteredMessage>
                    ) : pedidosFiltrados.length > 0 ? (
                        <PedidosGrid layout>
                            {pedidosFiltrados.map(pedido => {
                                const saldoPendiente = pedido.total - pedido.abonado;
                                const percentPaid = pedido.total > 0 ? (pedido.abonado / pedido.total) * 100 : 0;
                                return (
                                    <PedidoCard 
                                        key={pedido.id} 
                                        estado={pedido.estado}
                                        onClick={() => openModal('orderDetail', { pedidoId: pedido.id })}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <CardBody>
                                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                                                <div>
                                                    <h3 style={{margin: 0, color: '#343a40'}}>Pedido #{pedido.id}</h3>
                                                    <p style={{margin: '0.2rem 0', color: '#6c757d'}}>{pedido.clienteNombre || 'Cliente Genérico'}</p>
                                                </div>
                                                <span style={{backgroundColor: '#e9ecef', padding: '0.25rem 0.5rem', borderRadius: '5px', fontSize: '0.8rem', fontWeight: 'bold'}}>{pedido.estado}</span>
                                            </div>
                                            <div style={{margin: '1rem 0'}}>
                                                <p style={{margin: 0}}><strong>Total: C${Number(pedido.total).toFixed(2)}</strong></p>
                                                <p style={{margin: '0.2rem 0', color: '#28a745'}}>Abonado: C${Number(pedido.abonado).toFixed(2)}</p>
                                                {saldoPendiente > 0.009 &&
                                                    <p style={{fontWeight: 'bold', color: '#dc3545', margin: '0.2rem 0'}}>
                                                        Saldo: C${saldoPendiente.toFixed(2)}
                                                    </p>
                                                }
                                            </div>
                                            <p style={{fontSize: '0.8em', color: '#6c757d', margin: '0.5rem 0 0'}}>
                                                Creado: {new Date(pedido.fecha).toLocaleDateString('es-NI')}
                                            </p>
                                        </CardBody>
                                        <CardFooter>
                                            <ProgressBar percent={percentPaid}><div></div></ProgressBar>
                                        </CardFooter>
                                    </PedidoCard>
                                );
                            })}
                        </PedidosGrid>
                    ) : (
                        <CenteredMessage initial={{opacity:0}} animate={{opacity:1}}>
                            <FaBoxOpen />
                            <p>No se han encontrado pedidos que coincidan con los filtros.</p>
                        </CenteredMessage>
                    )}
                </main>
            </ContentGrid>
            
            {/* --- MODALES --- */}
            <AnimatePresence>
                {modal.name === 'createOrder' && <CreateOrderModal onClose={closeModal} onSubmit={handleCreateOrder} showAlert={showAlert} />}
                {modal.name === 'orderDetail' && <OrderDetailModal pedidoId={modal.props.pedidoId} onClose={closeModal} onUpdate={fetchPedidos} showAlert={showAlert} showConfirmation={showConfirmation} isCajaOpen={isCajaOpen} openModal={openModal}/>}
                {modal.name === 'abono' && <AbonoModal order={modal.props.order} onClose={closeModal} onUpdate={fetchPedidos} showAlert={showAlert} />}
            </AnimatePresence>
            
            <AlertModal isOpen={modal.name === 'alert'} onClose={closeModal} {...modal.props} />
            <ConfirmationModal isOpen={modal.name === 'confirmation'} onClose={closeModal} onConfirm={() => { if(modal.props.onConfirm) modal.props.onConfirm(); closeModal(); }} {...modal.props} />
        </PageWrapper>
    );
};

export default PedidosYApartados;

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../service/api';
import { 
    FaClipboardList, FaFilter, FaPlus, FaSearch, FaArrowLeft, FaBoxOpen,
    FaDollarSign, FaCalendar, FaUser, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaList, FaExchangeAlt 
} from 'react-icons/fa';

import CreateOrderModal from './pos/components/CreateOrderModal';
import OrderDetailModal from './pos/components/OrderDetailModal'; 
import ConfirmationModal from './pos/components/ConfirmationModal';
import AlertModal from './pos/components/AlertModal';

// --- ANIMACIONES Y ESTILOS ---
const fadeIn = keyframes`from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`;

const PageWrapper = styled.div`padding: 2rem; background: #f8fafc; min-height: 100vh; font-family: 'Inter', sans-serif; animation: ${fadeIn} 0.6s ease-out;`;
const HeaderContainer = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1.5rem;`;
const Title = styled.h1`font-size: 2.2rem; color: #1e293b; display: flex; align-items: center; gap: 1rem; margin: 0; font-weight: 800;`;
const Button = styled.button`padding: 0.9rem 1.8rem; border: none; background: ${props => props.$primary ? '#2563eb' : props.$secondary ? '#4f46e5' : '#64748b'}; color: white; border-radius: 10px; cursor: pointer; font-weight: 600; display: inline-flex; align-items: center; gap: 0.75rem; transition: all 0.2s; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); &:hover { transform: translateY(-2px); opacity: 0.9; }`;
const BackButton = styled(Link)`padding: 0.9rem 1.8rem; background: #94a3b8; color: white; border-radius: 10px; font-weight: 600; display: inline-flex; align-items: center; gap: 0.75rem; text-decoration: none; &:hover { background: #64748b; }`;
const ContentGrid = styled.div`display: grid; grid-template-columns: 300px 1fr; gap: 2rem; @media (max-width: 992px) { grid-template-columns: 1fr; }`;
const FilterPanel = styled.aside`background: #ffffff; padding: 1.5rem; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); align-self: flex-start; display: flex; flex-direction: column; gap: 1.5rem;`;
const Input = styled.input`width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid #cbd5e1; outline: none; &:focus { border-color: #2563eb; ring: 2px solid #2563eb; }`;
const Select = styled.select`width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid #cbd5e1;`;
const PedidoCard = styled.div`background: white; border-radius: 12px; padding: 1.5rem; margin-bottom: 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-left: 5px solid ${props => props.estado === 'COMPLETADO' ? '#10b981' : props.estado === 'CANCELADO' ? '#ef4444' : '#f59e0b'}; cursor: pointer; transition: transform 0.2s; &:hover { transform: translateY(-3px); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }`;
const ModalOverlay = styled.div`position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 2000; backdrop-filter: blur(2px);`;
const ModalContent = styled.div`background: white; width: 90%; max-width: 900px; height: 80vh; border-radius: 12px; padding: 25px; display: flex; flex-direction: column;`;
const ProductTable = styled.div`flex: 1; overflow-y: auto; margin-top: 15px; table { width: 100%; border-collapse: collapse; } th { background: #f1f5f9; padding: 12px; text-align: left; position: sticky; top: 0; } td { padding: 12px; border-bottom: 1px solid #e2e8f0; }`;

const PedidosYApartados = () => {
    const { user } = useAuth();
    const token = localStorage.getItem('token');

    const [pedidos, setPedidos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filtroEstado, setFiltroEstado] = useState('Activos');
    const [searchTerm, setSearchTerm] = useState('');
    const [modal, setModal] = useState({ name: null, props: {} });
    
    // Catalogo Productos
    const [products, setProducts] = useState([]);
    const [productSearch, setProductSearch] = useState('');
    const [searchType, setSearchType] = useState('descripcion');
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);

    const openModal = useCallback((name, props = {}) => setModal({ name, props }), []);
    const closeModal = useCallback(() => setModal({ name: null, props: {} }), []);
    const showAlert = useCallback((props) => openModal('alert', props), [openModal]);

    // Permisos: Solo admin puede editar, pero NADIE puede pagar aquí
    const canManageTickets = useMemo(() => user?.rol?.toLowerCase().includes('admin'), [user]);

    // --- CARGAR DATOS ---
    const fetchPedidos = useCallback(async () => {
        if (!token) return;
        setIsLoading(true);
        try {
            const data = await api.fetchOrders(token);
            setPedidos(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error pedidos:", error);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    const loadProductsData = useCallback(async () => {
        if (!token || products.length > 0) return; // Cache simple
        setIsLoadingProducts(true);
        try {
            const data = await api.fetchProducts(token);
            setProducts(Array.isArray(data) ? data : (data.data || []));
        } catch (error) {
            console.error("Error productos:", error);
        } finally {
            setIsLoadingProducts(false);
        }
    }, [token, products]);

    const handleOpenCreateOrder = async () => {
        await loadProductsData();
        openModal('createOrder');
    };

    // --- CREAR PEDIDO (Lógica Estricta: ABONO = 0) ---
    const handleCreateOrder = async (orderData) => {
        try {
            // FORZAMOS DATOS PARA EVITAR PAGOS EN ESTA PANTALLA
            const forcedOrder = { 
                ...orderData,
                abonado: 0, // <--- NADIE paga aquí
                estado: 'PENDIENTE', // <--- Siempre nace pendiente
                metodo_pago: 'Pendiente'
            };

            await api.createOrder(forcedOrder, token);
            // NO llamamos a addCajaTx porque el dinero es 0

            showAlert({ 
                title: "Ticket Creado Exitosamente", 
                message: "El ticket se ha guardado como PENDIENTE. El cliente debe pasar a CAJA para realizar el pago." 
            });
            
            await fetchPedidos();
            closeModal();
        } catch (error) {
            showAlert({ title: "Error", message: `No se pudo crear: ${error.message}` });
        }
    };

    // --- FILTROS ---
    const filteredProducts = useMemo(() => {
        if (!productSearch) return products;
        const term = productSearch.toLowerCase();
        return products.filter(p => searchType === 'codigo' ? String(p.codigo).includes(term) : p.descripcion.toLowerCase().includes(term));
    }, [products, productSearch, searchType]);

    const pedidosFiltrados = useMemo(() => {
        let filtered = [...pedidos];
        if (filtroEstado === 'Activos') filtered = filtered.filter(p => ['PENDIENTE', 'APARTADO'].includes(p.estado));
        else if (filtroEstado !== 'Todos') filtered = filtered.filter(p => p.estado === filtroEstado);
        
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            filtered = filtered.filter(p => (p.clienteNombre || '').toLowerCase().includes(lower) || String(p.id).includes(lower));
        }
        return filtered.sort((a,b) => new Date(b.fecha) - new Date(a.fecha));
    }, [pedidos, filtroEstado, searchTerm]);

    useEffect(() => { fetchPedidos(); }, [fetchPedidos]);

    return (
        <PageWrapper>
            <HeaderContainer>
                <Title><FaClipboardList /> Pedidos y Consultas</Title>
                <div style={{display:'flex', gap: '10px'}}>
                    <Button $secondary onClick={() => { loadProductsData(); openModal('productSearch'); }} disabled={isLoadingProducts}>
                        <FaList /> Ver Precios
                    </Button>
                    <Button $primary onClick={handleOpenCreateOrder}>
                        <FaPlus /> Nuevo Pedido (Sin Cobro)
                    </Button>
                    <BackButton to="/dashboard"><FaArrowLeft/> Salir</BackButton>
                </div>
            </HeaderContainer>

            <ContentGrid>
                <FilterPanel>
                    <div>
                        <h3><FaSearch /> Buscar</h3>
                        <Input placeholder="Cliente o Ticket ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                    <div>
                        <h3><FaFilter /> Estado</h3>
                        <Select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                            <option value="Activos">Pendientes de Pago</option>
                            <option value="Todos">Historial Completo</option>
                            <option value="COMPLETADO">Pagados</option>
                        </Select>
                    </div>
                </FilterPanel>

                <main>
                    {pedidosFiltrados.length === 0 ? (
                        <div style={{textAlign:'center', padding: 50, color: '#94a3b8'}}>
                            <FaBoxOpen size={50}/> <p>No hay tickets encontrados.</p>
                        </div>
                    ) : pedidosFiltrados.map(p => (
                        <PedidoCard key={p.id} estado={p.estado} onClick={() => openModal('orderDetail', { pedidoId: p.id })}>
                            <div style={{display:'flex', justifyContent:'space-between', marginBottom: 10}}>
                                <h3 style={{margin:0}}>Ticket #{p.id}</h3>
                                <span style={{fontWeight:'bold', color: p.estado === 'PENDIENTE' ? '#f59e0b' : '#10b981'}}>{p.estado}</span>
                            </div>
                            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, color:'#64748b'}}>
                                <span><FaUser/> {p.clienteNombre}</span>
                                <span><FaCalendar/> {new Date(p.fecha).toLocaleDateString()}</span>
                                <span>Total: <strong>C$ {Number(p.total).toFixed(2)}</strong></span>
                                <span style={{color: '#ef4444'}}>Deuda: <strong>C$ {(Number(p.total) - Number(p.abonado)).toFixed(2)}</strong></span>
                            </div>
                        </PedidoCard>
                    ))}
                </main>
            </ContentGrid>
            
            {/* MODALES */}
            {modal.name === 'createOrder' && (
                <CreateOrderModal 
                    onClose={closeModal} 
                    onSubmit={handleCreateOrder} 
                    showAlert={showAlert} 
                    products={products}
                    allowMoneyInput={false} // BLOQUEO VISUAL DE DINERO
                />
            )}
            
            {modal.name === 'orderDetail' && (
                <OrderDetailModal 
                    pedidoId={modal.props.pedidoId} 
                    onClose={closeModal} 
                    onUpdate={fetchPedidos} 
                    showAlert={showAlert} 
                    isCajaOpen={false} // Forzamos false para bloquear pagos
                    canManage={canManageTickets} 
                    canCharge={false} // BLOQUEO LÓGICO DE COBRO
                    readOnly={true} 
                />
            )}
            
            {modal.name === 'productSearch' && (
                <ModalOverlay onClick={closeModal}>
                    <ModalContent onClick={e => e.stopPropagation()}>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                            <h2><FaList/> Catálogo de Precios</h2>
                            <button onClick={closeModal} style={{background:'none', border:'none', fontSize:24, cursor:'pointer'}}><FaTimesCircle/></button>
                        </div>
                        <div style={{display:'flex', gap:10, margin:'15px 0'}}>
                            <Input autoFocus placeholder={`Buscar por ${searchType}...`} value={productSearch} onChange={e => setProductSearch(e.target.value)} style={{flex:1}}/>
                            <Button onClick={() => setSearchType(p => p === 'codigo' ? 'descripcion' : 'codigo')} style={{background:'#475569'}}>
                                <FaExchangeAlt /> {searchType === 'codigo' ? 'Código' : 'Nombre'}
                            </Button>
                        </div>
                        <ProductTable>
                            <table>
                                <thead><tr><th>Código</th><th>Producto</th><th>Precio</th><th>Existencia</th></tr></thead>
                                <tbody>
                                    {filteredProducts.slice(0, 100).map(p => (
                                        <tr key={p.id}>
                                            <td style={{fontWeight:'bold', color:'#2563eb'}}>{p.codigo}</td>
                                            <td>{p.descripcion || p.nombre}</td>
                                            <td>C$ {Number(p.precio_venta || p.precio).toFixed(2)}</td>
                                            <td style={{color: (p.existencia) > 0 ? '#10b981' : '#ef4444', fontWeight:'bold'}}>{p.existencia || 0}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </ProductTable>
                    </ModalContent>
                </ModalOverlay>
            )}

            <AlertModal isOpen={modal.name === 'alert'} onClose={closeModal} {...modal.props} />
        </PageWrapper>
    );
};

export default PedidosYApartados;
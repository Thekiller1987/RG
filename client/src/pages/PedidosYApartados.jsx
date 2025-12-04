import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../service/api';
import { 
    FaClipboardList, FaFilter, FaPlus, FaSearch, FaArrowLeft, FaBoxOpen,
    FaDollarSign, FaCalendar, FaUser, FaReceipt, FaCheckCircle, FaClock,
    FaTimesCircle, FaExclamationTriangle, FaList, FaExchangeAlt 
} from 'react-icons/fa';

import CreateOrderModal from './pos/components/CreateOrderModal';
import OrderDetailModal from './pos/components/OrderDetailModal'; 
import ConfirmationModal from './pos/components/ConfirmationModal';
import AlertModal from './pos/components/AlertModal';

// --- ANIMACIONES Y ESTILOS ---
const fadeIn = keyframes`from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`;
const slideIn = keyframes`from { transform: translateX(-20px); opacity: 0; } to { transform: translateX(0); opacity: 1; }`;

const PageWrapper = styled.div`padding: 2rem; background: #ffffff; min-height: 100vh; font-family: 'Inter', sans-serif; animation: ${fadeIn} 0.6s ease-out; @media (max-width: 768px) { padding: 1rem; }`;
const HeaderContainer = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1.5rem; animation: ${slideIn} 0.5s ease-out;`;
const Title = styled.h1`font-size: 2.5rem; color: #2d3748; display: flex; align-items: center; gap: 1rem; margin: 0; font-weight: 700;`;
const Button = styled.button`padding: 0.9rem 1.8rem; border: none; background: ${props => props.$primary ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : props.$secondary ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : '#3b82f6'}; color: white; border-radius: 12px; cursor: pointer; font-weight: 600; display: inline-flex; align-items: center; gap: 0.75rem; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0,0,0,0.1); &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.15); } &:disabled { opacity: 0.6; cursor: not-allowed; }`;
const BackButton = styled(Link)`padding: 0.9rem 1.8rem; background: #6b7280; color: white; border-radius: 12px; font-weight: 600; display: inline-flex; align-items: center; gap: 0.75rem; text-decoration: none; transition: all 0.3s ease; &:hover { background: #4b5563; transform: translateY(-2px); }`;
const ContentGrid = styled.div`display: grid; grid-template-columns: 320px 1fr; gap: 2rem; animation: ${fadeIn} 0.7s ease-out 0.1s both; @media (max-width: 992px) { grid-template-columns: 1fr; }`;
const FilterPanel = styled.aside`background: #ffffff; padding: 1.8rem; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); align-self: flex-start; display: flex; flex-direction: column; gap: 1.8rem; border: 1px solid #e5e7eb;`;
const Input = styled.input`width: 100%; padding: 1rem; font-size: 1rem; border-radius: 10px; border: 2px solid #e5e7eb; &:focus { border-color: #3b82f6; outline: none; }`;
const Select = styled.select`width: 100%; padding: 1rem; font-size: 1rem; border-radius: 10px; border: 2px solid #e5e7eb; cursor: pointer; &:focus { border-color: #3b82f6; outline: none; }`;
const PedidoCard = styled.div`background: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border-left: 6px solid ${props => props.estado === 'COMPLETADO' ? '#10b981' : props.estado === 'CANCELADO' ? '#ef4444' : '#3b82f6'}; display: flex; flex-direction: column; transition: all 0.3s ease; border: 1px solid #f1f5f9; &:hover { transform: translateY(-5px); }`;
const CardBody = styled.div`padding: 1.8rem; cursor: pointer; flex: 1;`;
const StatusBadge = styled.span`background: #e5e7eb; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; display: inline-flex; align-items: center; gap: 0.4rem;`;
const CardHeader = styled.div`display: flex; justify-content: space-between; margin-bottom: 1.2rem;`;
const CardContent = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; margin-bottom: 1.2rem;`;
const InfoItem = styled.div`display: flex; align-items: center; gap: 0.75rem; color: #6b7280; strong { color: #374151; }`;
const EmptyState = styled.div`text-align: center; padding: 4rem; color: #6b7280; svg { font-size: 4rem; margin-bottom: 1.5rem; opacity: 0.5; }`;
const ModalOverlay = styled.div`position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;`;
const ModalContent = styled.div`background: white; padding: 2rem; border-radius: 16px; width: 90%; max-width: 800px; max-height: 85vh; display: flex; flex-direction: column;`;
const ProductTable = styled.div`flex: 1; overflow-y: auto; margin-top: 1rem; table { width: 100%; border-collapse: collapse; th { background: #f8fafc; padding: 1rem; position: sticky; top: 0; } td { padding: 1rem; border-bottom: 1px solid #f1f5f9; } }`;

const PedidosYApartados = () => {
    const { user } = useAuth();
    const token = localStorage.getItem('token');

    const [pedidos, setPedidos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filtroEstado, setFiltroEstado] = useState('Activos');
    const [searchTerm, setSearchTerm] = useState('');
    const [modal, setModal] = useState({ name: null, props: {} });
    
    // --- ESTADO PRODUCTOS ---
    const [products, setProducts] = useState([]);
    const [productSearch, setProductSearch] = useState('');
    const [searchType, setSearchType] = useState('descripcion');
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);

    const openModal = useCallback((name, props = {}) => setModal({ name, props }), []);
    const closeModal = useCallback(() => setModal({ name: null, props: {} }), []);
    const showAlert = useCallback((props) => openModal('alert', props), [openModal]);
    const showConfirmation = useCallback((props) => openModal('confirmation', props), [openModal]);

    // Permisos simples: Solo admin borra/edita, pero NADIE paga aquí.
    const canManageTickets = useMemo(() => {
        if (!user || !user.rol) return false;
        const rol = user.rol.toLowerCase();
        return rol === 'administrador' || rol === 'admin';
    }, [user]);

    // ==========================================
    // CARGA DE DATOS
    // ==========================================
    const fetchPedidos = useCallback(async () => {
        if (!token) { setIsLoading(false); return; }
        setIsLoading(true);
        try {
            const data = await api.fetchOrders(token);
            setPedidos(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error al cargar pedidos:", error);
            setPedidos([]);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    const loadProductsData = useCallback(async () => {
        if (!token) return;
        setIsLoadingProducts(true);
        try {
            const data = await api.fetchProducts(token);
            const list = Array.isArray(data) ? data : (data.data || []);
            setProducts(list);
        } catch (error) {
            console.error("Error cargando productos:", error);
            setProducts([]);
        } finally {
            setIsLoadingProducts(false);
        }
    }, [token]);

    const handleOpenProductSearch = async () => {
        await loadProductsData();
        openModal('productSearch');
    };

    const handleOpenCreateOrder = async () => {
        if (products.length === 0) await loadProductsData();
        openModal('createOrder');
    };

    // ==========================================
    // CREACIÓN DE PEDIDO (SIN PAGOS)
    // ==========================================
    const handleCreateOrder = async (orderData) => {
        try {
            // FORZAMOS LOS DATOS PARA EVITAR PAGOS EN ESTA PANTALLA
            let finalOrderData = { 
                ...orderData,
                abonado: 0, // <--- OBLIGATORIO: Nadie paga aquí
                estado: 'PENDIENTE' // <--- OBLIGATORIO: Siempre nace pendiente
            };

            // Creamos el pedido
            await api.createOrder(finalOrderData, token);
            
            // NO LLAMAMOS A api.addCajaTx PORQUE EL ABONO ES 0

            showAlert({ 
                title: "Ticket Creado", 
                message: "El ticket se generó correctamente. El cliente debe pasar a CAJA para realizar el pago." 
            });
            
            await fetchPedidos();
            closeModal();

        } catch (error) {
            console.error(error);
            showAlert({ title: "Error", message: `No se pudo crear el ticket. ${error.message}` });
        }
    };

    // Filtros de Productos
    const filteredProducts = useMemo(() => {
        if (!productSearch) return products;
        const lowerTerm = productSearch.toLowerCase();
        return products.filter(p => {
            if (searchType === 'codigo') return String(p.codigo).toLowerCase().includes(lowerTerm);
            return String(p.descripcion || p.nombre).toLowerCase().includes(lowerTerm);
        });
    }, [products, productSearch, searchType]);

    // Filtros de Pedidos
    const pedidosFiltrados = useMemo(() => {
        let filtered = [...pedidos];
        if (filtroEstado === 'Activos') filtered = filtered.filter(p => p.estado === 'APARTADO' || p.estado === 'PENDIENTE');
        else if (filtroEstado !== 'Todos') filtered = filtered.filter(p => p.estado === filtroEstado.toUpperCase());
        
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            filtered = filtered.filter(p => 
                (p.clienteNombre || '').toLowerCase().includes(lower) || 
                String(p.id).includes(lower)
            );
        }
        return filtered;
    }, [pedidos, filtroEstado, searchTerm]);

    // Renderizado simple
    useEffect(() => { fetchPedidos(); loadProductsData(); }, [fetchPedidos, loadProductsData]);

    return (
        <PageWrapper>
            <HeaderContainer>
                <Title><FaClipboardList /> Consulta y Tickets</Title>
                <div style={{display:'flex', gap: '10px', flexWrap:'wrap'}}>
                    <Button $secondary onClick={handleOpenProductSearch} disabled={isLoadingProducts}>
                        {isLoadingProducts ? 'Cargando...' : <><FaList /> Ver Precios/Productos</>}
                    </Button>
                    <Button $primary onClick={handleOpenCreateOrder}>
                        <FaPlus /> Crear Ticket (Sin Cobro)
                    </Button>
                    <BackButton to="/dashboard"><FaArrowLeft/> Volver</BackButton>
                </div>
            </HeaderContainer>

            <ContentGrid>
                {/* FILTROS */}
                <FilterPanel>
                    <div>
                        <h3><FaSearch /> Buscar Ticket</h3>
                        <Input placeholder="ID o nombre del cliente..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
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

                {/* LISTA PEDIDOS */}
                <main>
                    {pedidosFiltrados.length > 0 ? pedidosFiltrados.map(pedido => (
                        <PedidoCard key={pedido.id} estado={pedido.estado} onClick={() => openModal('orderDetail', { pedidoId: pedido.id })}>
                            <CardBody>
                                <CardHeader>
                                    <h3 style={{margin:0}}>Ticket #{pedido.id}</h3>
                                    <StatusBadge>{pedido.estado}</StatusBadge>
                                </CardHeader>
                                <CardContent>
                                    <InfoItem><FaUser /> <strong>{pedido.clienteNombre}</strong></InfoItem>
                                    <InfoItem><FaCalendar /> {new Date(pedido.fecha).toLocaleDateString()}</InfoItem>
                                    <InfoItem><FaDollarSign /> Total: C${Number(pedido.total).toFixed(2)}</InfoItem>
                                    <InfoItem>
                                        <FaExclamationTriangle style={{color: '#ef4444'}}/> 
                                        Pendiente: <span style={{color: '#ef4444', fontWeight:'bold', marginLeft:5}}>C${(Number(pedido.total) - Number(pedido.abonado)).toFixed(2)}</span>
                                    </InfoItem>
                                </CardContent>
                            </CardBody>
                        </PedidoCard>
                    )) : <EmptyState><FaBoxOpen /><p>No hay tickets encontrados.</p></EmptyState>}
                </main>
            </ContentGrid>
            
            {/* --- MODALES --- */}
            
            {modal.name === 'createOrder' && (
                <CreateOrderModal 
                    onClose={closeModal} 
                    onSubmit={handleCreateOrder} 
                    showAlert={showAlert} 
                    products={products}
                    allowMoneyInput={false} // <--- ESTO DESHABILITA EL CAMPO DE DINERO VISUALMENTE
                />
            )}
            
            {modal.name === 'orderDetail' && (
                <OrderDetailModal 
                    pedidoId={modal.props.pedidoId} 
                    onClose={closeModal} 
                    onUpdate={fetchPedidos} 
                    showAlert={showAlert} 
                    showConfirmation={showConfirmation} 
                    isCajaOpen={false} // Forzamos false para que no deje pagar aquí
                    canManage={canManageTickets} // Solo puede editar/borrar items si es admin
                    canCharge={false} // <--- NADIE PUEDE COBRAR DESDE AQUÍ
                    readOnly={true} 
                />
            )}
            
            {modal.name === 'productSearch' && (
                <ModalOverlay onClick={closeModal}>
                    <ModalContent onClick={e => e.stopPropagation()}>
                        <div style={{display:'flex', justifyContent:'space-between', marginBottom: 20}}>
                            <h2>Catalogo de Productos</h2>
                            <button onClick={closeModal} style={{background:'none', border:'none', fontSize:24, cursor:'pointer'}}><FaTimesCircle/></button>
                        </div>
                        <div style={{display:'flex', gap:10, marginBottom:10}}>
                            <Input autoFocus placeholder={`Buscar por ${searchType}...`} value={productSearch} onChange={e => setProductSearch(e.target.value)} style={{flex:1}}/>
                            <Button onClick={() => setSearchType(prev => prev === 'codigo' ? 'descripcion' : 'codigo')} style={{background:'#4b5563'}}>
                                <FaExchangeAlt /> {searchType === 'codigo' ? 'Por Descripción' : 'Por Código'}
                            </Button>
                        </div>
                        <ProductTable>
                            <table>
                                <thead><tr><th>Código</th><th>Descripción</th><th>Precio</th><th>Stock</th></tr></thead>
                                <tbody>
                                    {filteredProducts.slice(0, 50).map(p => (
                                        <tr key={p.id}>
                                            <td style={{fontWeight:'bold', color:'#3b82f6'}}>{p.codigo}</td>
                                            <td>{p.descripcion || p.nombre}</td>
                                            <td>C${Number(p.precio_venta || p.precio).toFixed(2)}</td>
                                            <td style={{color: (p.stock || p.existencia) > 0 ? '#10b981' : '#ef4444', fontWeight:'bold'}}>{p.stock || p.existencia || 0}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </ProductTable>
                    </ModalContent>
                </ModalOverlay>
            )}

            <AlertModal isOpen={modal.name === 'alert'} onClose={closeModal} {...modal.props} />
            <ConfirmationModal isOpen={modal.name === 'confirmation'} onClose={closeModal} onConfirm={() => { if(modal.props.onConfirm) modal.props.onConfirm(); closeModal(); }} {...modal.props} />
        </PageWrapper>
    );
};

export default PedidosYApartados;
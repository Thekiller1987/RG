import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../service/api';
import { 
    FaClipboardList, FaFilter, FaPlus, FaArrowLeft, FaBoxOpen,
    FaCalendar, FaUser, FaCheckCircle, FaTimesCircle, FaExchangeAlt,
    FaTrash, FaEdit, FaEye, FaMoneyBillWave, FaCreditCard, FaUniversity
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
const Button = styled.button`
  padding: 0.7rem 1.4rem; border: none; background: ${props => props.$primary ? '#2563eb' : props.$secondary ? '#4f46e5' : props.$danger ? '#ef4444' : props.$success ? '#10b981' : '#64748b'}; 
  color: white; border-radius: 8px; cursor: pointer; font-weight: 600; display: inline-flex; align-items: center; gap: 0.5rem; 
  transition: all 0.2s; font-size: 0.9rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
  &:hover { transform: translateY(-2px); opacity: 0.9; }
  &:disabled { background: #94a3b8; cursor: not-allowed; }
`;
const SmallButton = styled(Button)`padding: 0.4rem 0.8rem; font-size: 0.8rem;`;
const BackButton = styled(Link)`padding: 0.9rem 1.8rem; background: #94a3b8; color: white; border-radius: 10px; font-weight: 600; display: inline-flex; align-items: center; gap: 0.75rem; text-decoration: none; &:hover { background: #64748b; }`;
const ContentGrid = styled.div`display: grid; grid-template-columns: 300px 1fr; gap: 2rem; @media (max-width: 992px) { grid-template-columns: 1fr; }`;
const FilterPanel = styled.aside`background: #ffffff; padding: 1.5rem; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); align-self: flex-start; display: flex; flex-direction: column; gap: 1.5rem;`;
const Input = styled.input`width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid #cbd5e1; outline: none; &:focus { border-color: #2563eb; ring: 2px solid #2563eb; }`;
const Select = styled.select`width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid #cbd5e1;`;
const PedidoCard = styled.div`
  background: white; border-radius: 12px; padding: 1.5rem; margin-bottom: 1rem; 
  box-shadow: 0 1px 3px rgba(0,0,0,0.1); 
  border-left: 5px solid ${props => props.estado === 'COMPLETADO' ? '#10b981' : props.estado === 'CANCELADO' ? '#ef4444' : '#f59e0b'}; 
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover { transform: translateY(-3px); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
`;
const ActionButtons = styled.div`display: flex; gap: 0.5rem; margin-top: 10px; justify-content: flex-end;`;
const ModalOverlay = styled.div`position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 2000; backdrop-filter: blur(2px);`;
const ModalContent = styled.div`background: white; width: 90%; max-width: ${props => props.$width || '900px'}; height: ${props => props.$height || '80vh'}; border-radius: 12px; padding: 25px; display: flex; flex-direction: column;`;
const ProductTable = styled.div`flex: 1; overflow-y: auto; margin-top: 15px; table { width: 100%; border-collapse: collapse; } th { background: #f1f5f9; padding: 12px; text-align: left; position: sticky; top: 0; } td { padding: 12px; border-bottom: 1px solid #e2e8f0; }`;

// Estilos específicos para el Modal de Pago
const PaymentOption = styled.div`
  border: 2px solid ${props => props.$selected ? '#2563eb' : '#e2e8f0'};
  background: ${props => props.$selected ? '#eff6ff' : 'white'};
  padding: 15px; border-radius: 8px; cursor: pointer; text-align: center;
  transition: all 0.2s; font-weight: bold; color: ${props => props.$selected ? '#2563eb' : '#64748b'};
  &:hover { border-color: #2563eb; }
  display: flex; flex-direction: column; align-items: center; gap: 5px;
`;

const PedidosYApartados = () => {
    const { user } = useAuth();
    const token = localStorage.getItem('token');

    const [pedidos, setPedidos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filtroEstado, setFiltroEstado] = useState('Activos');
    const [searchTerm, setSearchTerm] = useState('');
    const [modal, setModal] = useState({ name: null, props: {} });
    const [deletingId, setDeletingId] = useState(null);
    
    // Catalogo Productos
    const [products, setProducts] = useState([]);
    const [productSearch, setProductSearch] = useState('');
    const [searchType, setSearchType] = useState('descripcion');
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);

    // Estado para el modal de cobro
    const [cobroData, setCobroData] = useState({ pedido: null, metodo: 'Efectivo', monto: 0 });

    const openModal = useCallback((name, props = {}) => setModal({ name, props }), []);
    const closeModal = useCallback(() => setModal({ name: null, props: {} }), []);
    const showAlert = useCallback((props) => openModal('alert', props), [openModal]);
    const showConfirmation = useCallback((props) => openModal('confirmation', props), [openModal]);

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
        if (!token || products.length > 0) return; 
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

    // --- CREAR PEDIDO ---
    const handleCreateOrder = async (orderData) => {
        try {
            const itemsWithStructure = orderData.items?.map(item => ({
                id_producto: item.id,
                producto: item.nombre,
                descripcion: item.descripcion || item.nombre,
                cantidad: Number(item.quantity) || 1,
                precio: Number(item.precio_venta || item.precio || 0),
                precio_unitario: Number(item.precio_venta || item.precio || 0),
                total_linea: (Number(item.quantity) || 1) * (Number(item.precio_venta || item.precio || 0))
            })) || [];

            const totalPedido = itemsWithStructure.reduce((sum, item) => sum + item.total_linea, 0);

            const pedidoData = { 
                ...orderData,
                items: itemsWithStructure,
                total: totalPedido,
                abonado: 0,
                estado: 'PENDIENTE',
                metodo_pago: 'Pendiente',
                fecha: new Date().toISOString(),
                usuario_id: user?.id || 1
            };
            
            const response = await api.createOrder(pedidoData, token);
            
            showAlert({ 
                title: "✅ Pedido Creado Exitosamente", 
                message: `Ticket #${response?.id || 'Nuevo'} guardado como PENDIENTE.\n\nTotal: C$${totalPedido.toFixed(2)}\n\nEl cliente debe pasar a CAJA para realizar el pago.` 
            });
            
            await fetchPedidos();
            closeModal();
        } catch (error) {
            console.error("❌ Error creando pedido:", error);
            showAlert({ title: "❌ Error", message: `No se pudo crear el pedido: ${error.message}` });
        }
    };

    // --- ELIMINAR PEDIDO ---
    const handleDeleteOrder = async (pedidoId) => {
        if (!pedidoId) return;
        showConfirmation({
            title: "¿Eliminar Pedido?",
            message: `¿Estás seguro de eliminar el pedido #${pedidoId}?\n\nEsta acción no se puede deshacer.`,
            confirmText: "Sí, eliminar",
            cancelText: "Cancelar",
            onConfirm: async () => {
                setDeletingId(pedidoId);
                try {
                    const response = await api.deleteOrder(pedidoId, token);
                    if (response.success) {
                        setPedidos(prev => prev.filter(p => p.id !== pedidoId));
                        showAlert({ title: "✅ Pedido Eliminado", message: `El pedido #${pedidoId} ha sido eliminado.` });
                    } else {
                        throw new Error(response.message || "Error al eliminar");
                    }
                } catch (error) {
                    showAlert({ title: "❌ Error", message: error.message });
                } finally {
                    setDeletingId(null);
                }
            }
        });
    };

    // --- NUEVA LÓGICA DE COBRO (ABRI MODAL) ---
    const handleOpenPaymentModal = (pedido) => {
        const deuda = Number(pedido.total) - Number(pedido.abonado || 0);
        setCobroData({
            pedido: pedido,
            metodo: 'Efectivo',
            monto: deuda // Por defecto sugiere pagar todo
        });
        openModal('payOrder');
    };

    // --- PROCESAR EL PAGO FINAL ---
    const handleProcessPayment = async () => {
        const { pedido, metodo, monto } = cobroData;
        if (!pedido) return;

        // Validaciones básicas
        if (monto <= 0) {
            alert("El monto debe ser mayor a 0");
            return;
        }

        try {
            // Calculamos nuevos valores
            const nuevoAbonado = Number(pedido.abonado || 0) + Number(monto);
            const esPagoCompleto = nuevoAbonado >= Number(pedido.total) - 0.5; // Margen de error pequeño por decimales

            // Preparamos datos para la API
            const updateData = {
                // Si paga todo, pasa a COMPLETADO, si no, se queda como APARTADO (o lo que tu lógica de negocio dicte)
                estado: esPagoCompleto ? 'COMPLETADO' : 'APARTADO',
                abonado: nuevoAbonado,
                metodo_pago: metodo, // Enviamos Efectivo, Tarjeta o Transferencia
                // BANDERAS IMPORTANTES PARA EL BACKEND (Corte de Caja)
                registrar_movimiento_caja: true, 
                tipo_movimiento: 'INGRESO',
                monto_ingreso: Number(monto),
                es_efectivo: metodo === 'Efectivo' // Solo suma a la caja física si es efectivo
            };
            
            console.log("📤 Procesando pago:", updateData);

            await api.updateOrder(pedido.id, updateData, token);
            
            setPedidos(prev => prev.map(p => 
                p.id === pedido.id ? { ...p, ...updateData } : p
            ));
            
            closeModal();
            showAlert({ 
                title: "✅ Pago Registrado", 
                message: `Se registró un pago de C$${Number(monto).toFixed(2)} en ${metodo}.\nEstado del pedido: ${updateData.estado}` 
            });
            
            await fetchPedidos();
        } catch (error) {
            console.error("❌ Error completando pago:", error);
            showAlert({ title: "❌ Error", message: `No se pudo registrar el pago: ${error.message}` });
        }
    };

    const handleViewDetails = (pedidoId) => {
        openModal('orderDetail', { pedidoId });
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
            filtered = filtered.filter(p => 
                (p.clienteNombre || '').toLowerCase().includes(lower) || 
                String(p.id).includes(lower) ||
                (p.cliente?.nombre || '').toLowerCase().includes(lower)
            );
        }
        return filtered.sort((a,b) => new Date(b.fecha) - new Date(a.fecha));
    }, [pedidos, filtroEstado, searchTerm]);

    useEffect(() => { 
        fetchPedidos(); 
        const interval = setInterval(() => {
            if (filtroEstado === 'Activos') fetchPedidos();
        }, 30000);
        return () => clearInterval(interval);
    }, [fetchPedidos]);

    const estadisticas = useMemo(() => {
        const activos = pedidos.filter(p => ['PENDIENTE', 'APARTADO'].includes(p.estado));
        const totalDeuda = activos.reduce((sum, p) => sum + (Number(p.total) - Number(p.abonado || 0)), 0);
        return {
            total: pedidos.length,
            activos: activos.length,
            completados: pedidos.filter(p => p.estado === 'COMPLETADO').length,
            totalDeuda: totalDeuda
        };
    }, [pedidos]);

    return (
        <PageWrapper>
            <HeaderContainer>
                <Title><FaClipboardList /> Pedidos y Consultas</Title>
                <div style={{display:'flex', gap: '10px'}}>
                    <Button $secondary onClick={() => { loadProductsData(); openModal('productSearch'); }} disabled={isLoadingProducts}>
                        <FaList /> Ver Precios
                    </Button>
                    <Button $primary onClick={handleOpenCreateOrder}>
                        <FaPlus /> Nuevo Pedido
                    </Button>
                    <BackButton to="/dashboard"><FaArrowLeft/> Salir</BackButton>
                </div>
            </HeaderContainer>

            {/* ESTADISTICAS */}
            <div style={{display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap'}}>
                {/* ... (Tus tarjetas de estadísticas se mantienen igual) ... */}
                 <div style={{background: '#e0f2fe', padding: '1rem', borderRadius: '8px', flex: 1, minWidth: '200px', borderLeft: '4px solid #0ea5e9'}}>
                    <div style={{fontSize: '0.9rem', color: '#0369a1'}}>Total Pedidos</div>
                    <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#0c4a6e'}}>{estadisticas.total}</div>
                </div>
                <div style={{background: '#fef3c7', padding: '1rem', borderRadius: '8px', flex: 1, minWidth: '200px', borderLeft: '4px solid #f59e0b'}}>
                    <div style={{fontSize: '0.9rem', color: '#92400e'}}>Pendientes</div>
                    <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#78350f'}}>{estadisticas.activos}</div>
                </div>
                <div style={{background: '#dcfce7', padding: '1rem', borderRadius: '8px', flex: 1, minWidth: '200px', borderLeft: '4px solid #10b981'}}>
                    <div style={{fontSize: '0.9rem', color: '#065f46'}}>Completados</div>
                    <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#064e3b'}}>{estadisticas.completados}</div>
                </div>
                <div style={{background: '#fee2e2', padding: '1rem', borderRadius: '8px', flex: 1, minWidth: '200px', borderLeft: '4px solid #ef4444'}}>
                    <div style={{fontSize: '0.9rem', color: '#991b1b'}}>Deuda Total</div>
                    <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#7f1d1d'}}>C$ {estadisticas.totalDeuda.toFixed(2)}</div>
                </div>
            </div>

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
                            <option value="PENDIENTE">Solo Pendientes</option>
                            <option value="APARTADO">Solo Apartados</option>
                            <option value="COMPLETADO">Pagados/Completados</option>
                            <option value="CANCELADO">Cancelados</option>
                        </Select>
                    </div>
                    <div>
                        <Button onClick={fetchPedidos} style={{width: '100%'}} disabled={isLoading}>
                            {isLoading ? 'Cargando...' : 'Actualizar Lista'}
                        </Button>
                    </div>
                </FilterPanel>

                <main>
                    {isLoading ? (
                        <div style={{textAlign:'center', padding: 50, color: '#94a3b8'}}><FaBoxOpen size={50}/> <p>Cargando pedidos...</p></div>
                    ) : pedidosFiltrados.length === 0 ? (
                        <div style={{textAlign:'center', padding: 50, color: '#94a3b8'}}><FaBoxOpen size={50}/> <p>No hay tickets encontrados.</p></div>
                    ) : pedidosFiltrados.map(p => {
                        const deuda = Number(p.total) - Number(p.abonado || 0);
                        return (
                            <PedidoCard key={p.id} estado={p.estado}>
                                <div style={{display:'flex', justifyContent:'space-between', marginBottom: 10}}>
                                    <h3 style={{margin:0}}>Ticket #{p.id}</h3>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                        <span style={{fontWeight:'bold', color: p.estado === 'PENDIENTE' ? '#f59e0b' : p.estado === 'COMPLETADO' ? '#10b981' : p.estado === 'CANCELADO' ? '#ef4444' : '#7c3aed'}}>
                                            {p.estado}
                                        </span>
                                        {deuda > 0 && p.estado !== 'COMPLETADO' && (
                                            <span style={{background: '#fee2e2', color: '#dc2626', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold'}}>
                                                Debe: C$ {deuda.toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, color:'#64748b'}}>
                                    <span><FaUser/> {p.clienteNombre || p.cliente?.nombre || 'Consumidor Final'}</span>
                                    <span><FaCalendar/> {new Date(p.fecha || p.created_at).toLocaleDateString()}</span>
                                    <span>Total: <strong>C$ {Number(p.total || 0).toFixed(2)}</strong></span>
                                    <span style={{color: '#059669'}}>Pagado: <strong>C$ {Number(p.abonado || 0).toFixed(2)}</strong></span>
                                </div>
                                
                                <ActionButtons>
                                    <SmallButton onClick={() => handleViewDetails(p.id)} title="Ver detalles"><FaEye /> Ver</SmallButton>
                                    
                                    {p.estado !== 'COMPLETADO' && p.estado !== 'CANCELADO' && canManageTickets && (
                                        <>
                                            <SmallButton 
                                                $success 
                                                onClick={() => handleOpenPaymentModal(p)} 
                                                title="Realizar Cobro"
                                            >
                                                <FaMoneyBillWave /> Cobrar / Completar
                                            </SmallButton>
                                            
                                            <SmallButton 
                                                $danger 
                                                onClick={() => handleDeleteOrder(p.id)} 
                                                disabled={deletingId === p.id} 
                                                title="Eliminar pedido"
                                            >
                                                {deletingId === p.id ? '...' : <><FaTrash /> Eliminar</>}
                                            </SmallButton>
                                        </>
                                    )}
                                </ActionButtons>
                            </PedidoCard>
                        );
                    })}
                </main>
            </ContentGrid>
            
            {/* MODALES */}
            {modal.name === 'createOrder' && (
                <CreateOrderModal onClose={closeModal} onSubmit={handleCreateOrder} showAlert={showAlert} products={products} allowMoneyInput={false} />
            )}
            
            {modal.name === 'orderDetail' && (
                <OrderDetailModal pedidoId={modal.props.pedidoId} onClose={closeModal} onUpdate={fetchPedidos} showAlert={showAlert} isCajaOpen={false} canManage={canManageTickets} canCharge={false} readOnly={true} />
            )}

            {/* --- NUEVO MODAL DE COBRO --- */}
            {modal.name === 'payOrder' && cobroData.pedido && (
                <ModalOverlay onClick={closeModal}>
                    <ModalContent $height="auto" $width="500px" onClick={e => e.stopPropagation()}>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '20px'}}>
                            <h2 style={{margin:0, color:'#1e293b'}}><FaMoneyBillWave/> Registrar Pago</h2>
                            <button onClick={closeModal} style={{background:'none', border:'none', fontSize:24, cursor:'pointer'}}><FaTimesCircle/></button>
                        </div>

                        <div style={{background: '#f1f5f9', padding: '15px', borderRadius: '8px', marginBottom: '20px'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                                <span>Total Ticket:</span>
                                <strong>C$ {Number(cobroData.pedido.total).toFixed(2)}</strong>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-between', color: '#dc2626'}}>
                                <span>Saldo Pendiente:</span>
                                <strong>C$ {(Number(cobroData.pedido.total) - Number(cobroData.pedido.abonado || 0)).toFixed(2)}</strong>
                            </div>
                        </div>

                        <div style={{marginBottom: '20px'}}>
                            <label style={{fontWeight:'bold', display:'block', marginBottom:'8px'}}>Método de Pago:</label>
                            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px'}}>
                                <PaymentOption 
                                    $selected={cobroData.metodo === 'Efectivo'} 
                                    onClick={() => setCobroData({...cobroData, metodo: 'Efectivo'})}
                                >
                                    <FaMoneyBillWave size={20}/> Efectivo
                                </PaymentOption>
                                <PaymentOption 
                                    $selected={cobroData.metodo === 'Tarjeta'} 
                                    onClick={() => setCobroData({...cobroData, metodo: 'Tarjeta'})}
                                >
                                    <FaCreditCard size={20}/> Tarjeta
                                </PaymentOption>
                                <PaymentOption 
                                    $selected={cobroData.metodo === 'Transferencia'} 
                                    onClick={() => setCobroData({...cobroData, metodo: 'Transferencia'})}
                                >
                                    <FaUniversity size={20}/> Transf.
                                </PaymentOption>
                            </div>
                            {cobroData.metodo === 'Efectivo' && (
                                <p style={{fontSize: '0.8rem', color: '#059669', marginTop: '5px'}}>
                                    * Este monto se sumará al efectivo en caja del turno actual.
                                </p>
                            )}
                        </div>

                        <div style={{marginBottom: '25px'}}>
                            <label style={{fontWeight:'bold', display:'block', marginBottom:'8px'}}>Monto a Cobrar (C$):</label>
                            <Input 
                                type="number" 
                                value={cobroData.monto} 
                                onChange={e => setCobroData({...cobroData, monto: e.target.value})}
                                style={{fontSize: '1.2rem', fontWeight: 'bold'}}
                                min="0"
                            />
                        </div>

                        <Button $primary style={{width: '100%', justifyContent: 'center', padding: '15px'}} onClick={handleProcessPayment}>
                            <FaCheckCircle /> Confirmar Cobro
                        </Button>
                    </ModalContent>
                </ModalOverlay>
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

            {modal.name === 'alert' && <AlertModal isOpen={true} onClose={closeModal} {...modal.props} />}
            {modal.name === 'confirmation' && (
                <ConfirmationModal
                    isOpen={true}
                    onClose={closeModal}
                    onConfirm={() => { if (modal.props.onConfirm) modal.props.onConfirm(); closeModal(); }}
                    {...modal.props}
                />
            )}
        </PageWrapper>
    );
};

export default PedidosYApartados;
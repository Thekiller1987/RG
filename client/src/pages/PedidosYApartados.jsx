import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../service/api';
import { 
    FaClipboardList, FaFilter, FaPlus, FaSearch, FaArrowLeft, FaBoxOpen,
    FaDollarSign, FaCalendar, FaUser, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaList, FaExchangeAlt,
    FaTrash, FaEdit, FaEye, FaFileInvoiceDollar
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
  padding: 0.7rem 1.4rem; border: none; background: ${props => props.$primary ? '#2563eb' : props.$secondary ? '#4f46e5' : props.$danger ? '#ef4444' : '#64748b'}; 
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
    const [deletingId, setDeletingId] = useState(null);
    
    // Catalogo Productos
    const [products, setProducts] = useState([]);
    const [productSearch, setProductSearch] = useState('');
    const [searchType, setSearchType] = useState('descripcion');
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);

    const openModal = useCallback((name, props = {}) => setModal({ name, props }), []);
    const closeModal = useCallback(() => setModal({ name: null, props: {} }), []);
    const showAlert = useCallback((props) => openModal('alert', props), [openModal]);
    const showConfirmation = useCallback((props) => openModal('confirmation', props), [openModal]);

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

    // --- CREAR PEDIDO ---
    const handleCreateOrder = async (orderData) => {
        try {
            // Preparar los items con la estructura correcta
            const itemsWithStructure = orderData.items?.map(item => ({
                id_producto: item.id,
                producto: item.nombre,
                descripcion: item.descripcion || item.nombre,
                cantidad: Number(item.quantity) || 1,
                precio: Number(item.precio_venta || item.precio || 0),
                precio_unitario: Number(item.precio_venta || item.precio || 0),
                total_linea: (Number(item.quantity) || 1) * (Number(item.precio_venta || item.precio || 0))
            })) || [];

            // Calcular total del pedido
            const totalPedido = itemsWithStructure.reduce((sum, item) => sum + item.total_linea, 0);

            const pedidoData = { 
                ...orderData,
                items: itemsWithStructure,
                total: totalPedido,
                abonado: 0, // Siempre 0 al crear
                estado: 'PENDIENTE',
                metodo_pago: 'Pendiente',
                fecha: new Date().toISOString(),
                usuario_id: user?.id || 1
            };

            console.log("📤 Enviando pedido al backend:", pedidoData);
            
            const response = await api.createOrder(pedidoData, token);
            
            showAlert({ 
                title: "✅ Pedido Creado Exitosamente", 
                message: `Ticket #${response?.id || 'Nuevo'} guardado como PENDIENTE.\n\nTotal: C$${totalPedido.toFixed(2)}\n\nEl cliente debe pasar a CAJA para realizar el pago.` 
            });
            
            await fetchPedidos();
            closeModal();
        } catch (error) {
            console.error("❌ Error creando pedido:", error);
            showAlert({ 
                title: "❌ Error", 
                message: `No se pudo crear el pedido: ${error.message || 'Error desconocido'}` 
            });
        }
    };

    // --- ELIMINAR PEDIDO MANUALMENTE ---
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
                        // Eliminar del estado local
                        setPedidos(prev => prev.filter(p => p.id !== pedidoId));
                        showAlert({ 
                            title: "✅ Pedido Eliminado", 
                            message: `El pedido #${pedidoId} ha sido eliminado correctamente.` 
                        });
                    } else {
                        throw new Error(response.message || "Error al eliminar");
                    }
                } catch (error) {
                    console.error("❌ Error eliminando pedido:", error);
                    showAlert({ 
                        title: "❌ Error", 
                        message: `No se pudo eliminar el pedido: ${error.message || 'Error desconocido'}` 
                    });
                } finally {
                    setDeletingId(null);
                }
            }
        });
    };

    // --- MARCAR COMO COMPLETADO ---
    const handleMarkAsCompleted = async (pedidoId) => {
        showConfirmation({
            title: "¿Marcar como Completado?",
            message: `¿Marcar el pedido #${pedidoId} como COMPLETADO?\n\nEsto significa que ya fue pagado en caja.`,
            confirmText: "Sí, completar",
            cancelText: "Cancelar",
            onConfirm: async () => {
                try {
                    const updateData = {
                        estado: 'COMPLETADO',
                        abonado: pedidos.find(p => p.id === pedidoId)?.total || 0,
                        metodo_pago: 'Completado en POS'
                    };
                    
                    await api.updateOrder(pedidoId, updateData, token);
                    
                    // Actualizar estado local
                    setPedidos(prev => prev.map(p => 
                        p.id === pedidoId ? { ...p, ...updateData } : p
                    ));
                    
                    showAlert({ 
                        title: "✅ Pedido Completado", 
                        message: `El pedido #${pedidoId} ha sido marcado como COMPLETADO.` 
                    });
                    
                    await fetchPedidos();
                } catch (error) {
                    console.error("❌ Error completando pedido:", error);
                    showAlert({ 
                        title: "❌ Error", 
                        message: `No se pudo completar el pedido: ${error.message}` 
                    });
                }
            }
        });
    };

    // --- VER DETALLES ---
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

    // --- EFECTO PARA REFRESCAR DATOS PERIÓDICAMENTE ---
    useEffect(() => { 
        fetchPedidos(); 
        
        // Refrescar cada 30 segundos para ver cambios desde el POS
        const interval = setInterval(() => {
            if (filtroEstado === 'Activos') {
                fetchPedidos();
            }
        }, 30000);
        
        return () => clearInterval(interval);
    }, [fetchPedidos]);

    // --- ESTADÍSTICAS ---
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
                        <FaPlus /> Nuevo Pedido (Sin Cobro)
                    </Button>
                    <BackButton to="/dashboard"><FaArrowLeft/> Salir</BackButton>
                </div>
            </HeaderContainer>

            {/* ESTADÍSTICAS */}
            <div style={{display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap'}}>
                <div style={{
                    background: '#e0f2fe', 
                    padding: '1rem', 
                    borderRadius: '8px', 
                    flex: 1, 
                    minWidth: '200px',
                    borderLeft: '4px solid #0ea5e9'
                }}>
                    <div style={{fontSize: '0.9rem', color: '#0369a1'}}>Total Pedidos</div>
                    <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#0c4a6e'}}>{estadisticas.total}</div>
                </div>
                <div style={{
                    background: '#fef3c7', 
                    padding: '1rem', 
                    borderRadius: '8px', 
                    flex: 1, 
                    minWidth: '200px',
                    borderLeft: '4px solid #f59e0b'
                }}>
                    <div style={{fontSize: '0.9rem', color: '#92400e'}}>Pendientes</div>
                    <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#78350f'}}>{estadisticas.activos}</div>
                </div>
                <div style={{
                    background: '#dcfce7', 
                    padding: '1rem', 
                    borderRadius: '8px', 
                    flex: 1, 
                    minWidth: '200px',
                    borderLeft: '4px solid #10b981'
                }}>
                    <div style={{fontSize: '0.9rem', color: '#065f46'}}>Completados</div>
                    <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#064e3b'}}>{estadisticas.completados}</div>
                </div>
                <div style={{
                    background: '#fee2e2', 
                    padding: '1rem', 
                    borderRadius: '8px', 
                    flex: 1, 
                    minWidth: '200px',
                    borderLeft: '4px solid #ef4444'
                }}>
                    <div style={{fontSize: '0.9rem', color: '#991b1b'}}>Deuda Total</div>
                    <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#7f1d1d'}}>C$ {estadisticas.totalDeuda.toFixed(2)}</div>
                </div>
            </div>

            <ContentGrid>
                <FilterPanel>
                    <div>
                        <h3><FaSearch /> Buscar</h3>
                        <Input 
                            placeholder="Cliente o Ticket ID..." 
                            value={searchTerm} 
                            onChange={e => setSearchTerm(e.target.value)} 
                        />
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
                        <h3><FaSync /> Acciones</h3>
                        <Button onClick={fetchPedidos} style={{width: '100%'}} disabled={isLoading}>
                            {isLoading ? 'Cargando...' : 'Actualizar Lista'}
                        </Button>
                    </div>
                </FilterPanel>

                <main>
                    {isLoading ? (
                        <div style={{textAlign:'center', padding: 50, color: '#94a3b8'}}>
                            <FaBoxOpen size={50}/> <p>Cargando pedidos...</p>
                        </div>
                    ) : pedidosFiltrados.length === 0 ? (
                        <div style={{textAlign:'center', padding: 50, color: '#94a3b8'}}>
                            <FaBoxOpen size={50}/> <p>No hay tickets encontrados.</p>
                        </div>
                    ) : pedidosFiltrados.map(p => {
                        const deuda = Number(p.total) - Number(p.abonado || 0);
                        const tieneItems = p.items && Array.isArray(p.items) && p.items.length > 0;
                        
                        return (
                            <PedidoCard key={p.id} estado={p.estado}>
                                <div style={{display:'flex', justifyContent:'space-between', marginBottom: 10}}>
                                    <h3 style={{margin:0}}>
                                        Ticket #{p.id} 
                                        {tieneItems && (
                                            <span style={{fontSize: '0.8rem', marginLeft: '10px', color: '#64748b'}}>
                                                ({p.items.length} productos)
                                            </span>
                                        )}
                                    </h3>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                        <span style={{
                                            fontWeight:'bold', 
                                            color: p.estado === 'PENDIENTE' ? '#f59e0b' : 
                                                   p.estado === 'COMPLETADO' ? '#10b981' : 
                                                   p.estado === 'CANCELADO' ? '#ef4444' : '#7c3aed'
                                        }}>
                                            {p.estado}
                                        </span>
                                        {deuda > 0 && p.estado !== 'COMPLETADO' && (
                                            <span style={{
                                                background: '#fee2e2',
                                                color: '#dc2626',
                                                padding: '2px 8px',
                                                borderRadius: '12px',
                                                fontSize: '0.8rem',
                                                fontWeight: 'bold'
                                            }}>
                                                C$ {deuda.toFixed(2)}
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
                                    <SmallButton 
                                        onClick={() => handleViewDetails(p.id)}
                                        title="Ver detalles"
                                    >
                                        <FaEye /> Ver
                                    </SmallButton>
                                    
                                    {p.estado !== 'COMPLETADO' && p.estado !== 'CANCELADO' && canManageTickets && (
                                        <>
                                            <SmallButton 
                                                $primary
                                                onClick={() => handleMarkAsCompleted(p.id)}
                                                title="Marcar como completado"
                                            >
                                                <FaCheckCircle /> Completar
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
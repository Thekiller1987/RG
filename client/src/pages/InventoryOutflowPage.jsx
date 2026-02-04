import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaTruck, FaSearch, FaBarcode, FaTimes, FaSave, FaHistory, FaArrowLeft, FaPrint, FaTrash } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import * as api from '../service/api';
import { useAuth } from '../context/AuthContext';
import TicketModal from './pos/components/TicketModal';

/* ================== STYLES COPIED/ADAPTED FROM POS/INVENTORY ================== */
const PageContainer = styled.div`
  display: flex; flex-direction: column; height: 100vh; background-color: #f3f4f6;
  font-family: 'Inter', sans-serif;
`;

const Header = styled.header`
  background: white; padding: 1rem 1.5rem; display: flex; align-items: center; justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05); z-index: 10;
`;

const Title = styled.h1`
  font-size: 1.5rem; font-weight: 800; color: #111827; display: flex; align-items: center; gap: 10px; margin: 0;
`;

const MainContent = styled.div`
  display: flex; flex: 1; overflow: hidden; padding: 1rem; gap: 1rem;
  @media(max-width: 768px) { flex-direction: column; }
`;

const Panel = styled.div`
  background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  display: flex; flex-direction: column; overflow: hidden;
`;

const SearchPanel = styled(Panel)`
  flex: 1.5; padding: 1rem;
`;

const CartPanel = styled(Panel)`
  flex: 1; min-width: 350px; background: #fff; border-left: 1px solid #e5e7eb;
`;

const SearchInputContainer = styled.div`
  position: relative; margin-bottom: 1rem;
`;

const SearchInput = styled.input`
  width: 100%; padding: 12px 14px 12px 45px; border: 2px solid #e5e7eb; border-radius: 8px;
  font-size: 1rem; outline: none; transition: all 0.2s;
  &:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
`;

const ProductList = styled.div`
  flex: 1; overflow-y: auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; padding-bottom: 10px;
`;

const ProductCard = styled.div`
  border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px; cursor: pointer; transition: all 0.2s;
  background: white; display: flex; flex-direction: column; justify-content: space-between; height: 120px;
  &:hover { border-color: #3b82f6; transform: translateY(-2px); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
`;

const CartList = styled.div`
  flex: 1; overflow-y: auto; padding: 10px;
`;

const CartItem = styled.div`
  display: flex; justify-content: space-between; align-items: center; padding: 10px;
  background: #f9fafb; border-bottom: 1px solid #e5e7eb; margin-bottom: 5px; border-radius: 6px;
`;

const ReasonInput = styled.textarea`
  width: 100%; padding: 10px; border: 2px solid #e5e7eb; border-radius: 8px; margin: 10px 0;
  resize: none; font-family: inherit;
  &:focus { border-color: #3b82f6; outline: none; }
`;

const ActionButton = styled.button`
  width: 100%; padding: 12px; background: #ef4444; color: white; font-weight: bold; border: none; border-radius: 8px;
  cursor: pointer; font-size: 1rem; transition: background 0.2s;
  &:hover { background: #dc2626; }
  &:disabled { background: #fee2e2; cursor: not-allowed; }
`;

const HistoryItem = styled.div`
  padding: 12px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;
  &:hover { background: #f8fafc; }
`;

/* ================== COMPONENTS ================== */

const InventoryOutflowPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // States
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [results, setResults] = useState([]);
    const [cart, setCart] = useState([]);
    const [reason, setReason] = useState('');
    const [showHistory, setShowHistory] = useState(false);
    const [history, setHistory] = useState([]);
    const [ticketData, setTicketData] = useState(null); // For printing
    const [isLoading, setIsLoading] = useState(false);

    // Refs
    const searchInputRef = useRef(null);

    // 1. Fetch Products on Mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const data = await api.fetchProducts(token);
                setProducts(data);
                setResults(data.slice(0, 20));
            } catch (err) {
                console.error("Error loading products", err);
            }
        };
        fetchProducts();
    }, []);

    // 2. Search Logic
    useEffect(() => {
        if (!searchTerm.trim()) {
            setResults(products.slice(0, 20)); // Show default items
            return;
        }
        const term = searchTerm.toLowerCase();
        const filtered = products.filter(p =>
            (p.nombre?.toLowerCase().includes(term)) ||
            (p.codigo?.toLowerCase().includes(term))
        );
        setResults(filtered.slice(0, 50));
    }, [searchTerm, products]);

    // 3. Add to Cart
    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id_producto === product.id_producto);
            if (existing) {
                // Check stock
                if (existing.cantidad >= product.existencia) {
                    alert('No hay suficiente stock.');
                    return prev;
                }
                return prev.map(item =>
                    item.id_producto === product.id_producto
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            } else {
                if (product.existencia <= 0) {
                    alert('Producto sin existencia.');
                    return prev;
                }
                return [...prev, { ...product, cantidad: 1 }];
            }
        });
        setSearchTerm('');
        searchInputRef.current?.focus();
    };

    // 4. Remove/Update Cart
    const updateQty = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id_producto === id) {
                const newQty = item.cantidad + delta;
                if (newQty <= 0) return null; // Remove
                if (newQty > item.existencia) return item; // Limit
                return { ...item, cantidad: newQty };
            }
            return item;
        }).filter(Boolean));
    };

    // 5. Submit Outflow
    const handleSubmit = async () => {
        if (!reason.trim()) return alert('Debe ingresar un motivo para la salida.');
        if (cart.length === 0) return alert('El carrito está vacío.');

        if (!window.confirm('¿Confirmar salida de inventario? Esta acción descontará el stock.')) return;

        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await api.createOutflow({
                motivo: reason,
                items: cart
            }, token);

            // Success
            setCart([]);
            setReason('');
            setTicketData(res.ticket); // Trigger print modal

            // Refresh products (simple way: fetch again or decrement local)
            // Let's reload page data or just decrement locally for speed
            const updatedProducts = products.map(p => {
                const inCart = cart.find(c => c.id_producto === p.id_producto);
                if (inCart) return { ...p, existencia: p.existencia - inCart.cantidad };
                return p;
            });
            setProducts(updatedProducts);

        } catch (err) {
            console.error(err);
            alert(err.response?.data?.msg || 'Error al procesar salida.');
        } finally {
            setIsLoading(false);
        }
    };

    // 6. Fetch History
    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const data = await api.fetchOutflowHistory(token);
            setHistory(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleOpenHistory = () => {
        setShowHistory(true);
        fetchHistory();
    };

    const handleReprint = (tx) => {
        // Construct ticket data from historical record
        const ticket = {
            id: `TR-${tx.id}`,
            outflowId: tx.id,
            type: 'outflow',
            fecha: tx.fecha,
            usuarioNombre: tx.usuario_nombre,
            clienteNombre: `MOTIVO: ${tx.motivo}`,
            items: tx.items.map(i => ({ ...i, total: i.quantity * i.unit })), // Ensure structure matches TicketModal
            totalVenta: tx.total_venta,
            totalCosto: tx.total_costo,
            isOutflow: true
        };
        setTicketData(ticket);
    };

    return (
        <PageContainer>
            <Header>
                <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                    <Link to="/dashboard" style={{ color: '#6b7280', fontSize: '1.2rem' }}><FaArrowLeft /></Link>
                    <Title><FaTruck style={{ color: '#ef4444' }} /> Traslados / Salidas</Title>
                </div>
                <button
                    onClick={handleOpenHistory}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 8, border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer' }}
                >
                    <FaHistory /> Historial
                </button>
            </Header>

            <MainContent>
                {/* LEFT: SEARCH & PRODUCTS */}
                <SearchPanel>
                    <SearchInputContainer>
                        <FaSearch style={{ position: 'absolute', left: 15, top: 15, color: '#9ca3af' }} />
                        <SearchInput
                            ref={searchInputRef}
                            placeholder="Buscar producto por nombre o código..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </SearchInputContainer>

                    <ProductList>
                        {results.map(p => (
                            <ProductCard key={p.id_producto} onClick={() => addToCart(p)}>
                                <div style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: 5 }}>{p.nombre}</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#6b7280' }}>
                                    <span>{p.codigo}</span>
                                    <span style={{ color: p.existencia > 0 ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>Stock: {p.existencia}</span>
                                </div>
                                <div style={{ marginTop: 'auto', textAlign: 'right', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                    C$ {Number(p.precio).toFixed(2)}
                                </div>
                            </ProductCard>
                        ))}
                    </ProductList>
                </SearchPanel>

                {/* RIGHT: CART */}
                <CartPanel>
                    <div style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
                        <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Carrito de Salida</h2>
                        <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>{cart.length} items</div>
                    </div>

                    <CartList>
                        {cart.length === 0 ? (
                            <div style={{ textAlign: 'center', color: '#9ca3af', marginTop: 50 }}>
                                <FaBarcode size={40} style={{ marginBottom: 10 }} />
                                <p>Escanea o selecciona productos</p>
                            </div>
                        ) : cart.map(item => (
                            <CartItem key={item.id_producto}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 'bold' }}>{item.nombre}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{item.codigo}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <button
                                        onClick={() => updateQty(item.id_producto, -1)}
                                        style={{ width: 25, height: 25, borderRadius: '50%', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}
                                    >-</button>
                                    <span style={{ fontWeight: 'bold', minWidth: 20, textAlign: 'center' }}>{item.cantidad}</span>
                                    <button
                                        onClick={() => updateQty(item.id_producto, 1)}
                                        style={{ width: 25, height: 25, borderRadius: '50%', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}
                                    >+</button>
                                    <button
                                        onClick={() => updateQty(item.id_producto, -9999)}
                                        style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', marginLeft: 5 }}
                                    ><FaTrash /></button>
                                </div>
                            </CartItem>
                        ))}
                    </CartList>

                    <div style={{ padding: '1rem', background: '#f8fafc', borderTop: '1px solid #e5e7eb' }}>
                        <label style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#374151' }}>Motivo / Razón:</label>
                        <ReasonInput
                            rows="2"
                            placeholder="Ej: Merma, Uso Interno, Traslado a Bodega B..."
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                        />
                        <ActionButton disabled={cart.length === 0 || isLoading} onClick={handleSubmit}>
                            {isLoading ? 'Procesando...' : <><FaSave /> Procesar Salida</>}
                        </ActionButton>
                    </div>
                </CartPanel>
            </MainContent>

            {/* HISTORY MODAL (SIMPLIFIED OVERLAY) */}
            {showHistory && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
                }} onClick={() => setShowHistory(false)}>
                    <div style={{ background: 'white', width: '90%', maxWidth: 600, maxHeight: '80vh', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
                            <h2 style={{ margin: 0 }}>Historial de Salidas</h2>
                            <button onClick={() => setShowHistory(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}><FaTimes /></button>
                        </div>
                        <div style={{ overflowY: 'auto', flex: 1 }}>
                            {history.length === 0 && <p style={{ textAlign: 'center', padding: 20 }}>No hay registros.</p>}
                            {history.map(tx => (
                                <HistoryItem key={tx.id}>
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>#{tx.id} - {new Date(tx.fecha).toLocaleString()}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Motivo: {tx.motivo}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Por: {tx.usuario_nombre} | {tx.total_items} items</div>
                                    </div>
                                    <button
                                        onClick={() => handleReprint(tx)}
                                        style={{ padding: '6px 12px', background: '#e0f2fe', color: '#0284c7', border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
                                    >
                                        <FaPrint /> Imprimir
                                    </button>
                                </HistoryItem>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* TICKET MODAL */}
            {ticketData && (
                <TicketModal
                    isOpen={!!ticketData}
                    transaction={ticketData}
                    onClose={() => setTicketData(null)}
                    printMode="80"
                />
            )}
        </PageContainer>
    );
};

export default InventoryOutflowPage;

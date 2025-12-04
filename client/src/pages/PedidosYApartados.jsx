import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { FaSearch, FaShoppingCart, FaPlus, FaTrash, FaPaperPlane, FaSync, FaTags } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext'; // Ajusta la ruta si es necesaria
import * as api from '../service/api'; // Ajusta la ruta

// --- ESTILOS ---
const Container = styled.div`
  display: flex; height: 100vh; background: #f1f5f9; font-family: 'Segoe UI', sans-serif;
`;
const LeftPanel = styled.div`
  flex: 2; padding: 20px; display: flex; flex-direction: column; gap: 20px; overflow-y: hidden;
`;
const RightPanel = styled.div`
  flex: 1; background: white; padding: 20px; display: flex; flex-direction: column; 
  box-shadow: -4px 0 15px rgba(0,0,0,0.05); border-left: 1px solid #e2e8f0;
`;
const SearchBar = styled.div`
  display: flex; gap: 10px; background: white; padding: 15px; border-radius: 12px; 
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
`;
const Input = styled.input`
  flex: 1; padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px; outline: none; font-size: 1rem;
  &:focus { border-color: #3b82f6; }
`;
const ProductGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; 
  overflow-y: auto; padding-bottom: 20px;
`;
const ProductCard = styled.div`
  background: white; padding: 15px; border-radius: 10px; border: 1px solid #e2e8f0; 
  display: flex; flex-direction: column; justify-content: space-between; gap: 10px;
  transition: transform 0.2s; cursor: pointer;
  &:hover { transform: translateY(-3px); border-color: #3b82f6; box-shadow: 0 5px 15px rgba(59,130,246,0.1); }
`;
const PriceTag = styled.div`
  font-size: 1.2rem; font-weight: bold; color: #2563eb;
`;
const CartItem = styled.div`
  display: flex; justify-content: space-between; align-items: center; padding: 10px 0; 
  border-bottom: 1px solid #f1f5f9;
`;
const Button = styled.button`
  background: ${props => props.bg || '#3b82f6'}; color: white; border: none; padding: 15px; 
  border-radius: 8px; font-weight: bold; cursor: pointer; display: flex; align-items: center; 
  justify-content: center; gap: 10px; font-size: 1rem; width: 100%; margin-top: 10px;
  &:hover { opacity: 0.9; }
  &:disabled { background: #cbd5e1; cursor: not-allowed; }
`;

const SellerDashboard = () => {
    const { user } = useAuth(); // Obtenemos el usuario vendedor
    const token = localStorage.getItem('token');
    
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [clientName, setClientName] = useState('');

    // --- 1. CARGAR PRODUCTOS ---
    const fetchProducts = async () => {
        setLoading(true);
        try {
            // Asegúrate que esta función exista en tu api.js y traiga inventario y precios
            const data = await api.fetchProducts(token); 
            setProducts(data || []);
        } catch (error) {
            console.error("Error cargando productos", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    // --- 2. LÓGICA DEL CARRITO ---
    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(p => p.id === product.id);
            if (existing) {
                return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(p => p.id !== id));
    };

    const updateQuantity = (id, delta) => {
        setCart(prev => prev.map(p => {
            if (p.id === id) {
                const newQty = Math.max(1, p.quantity + delta);
                // Validación básica de stock visual
                if (newQty > p.existencia) return p; 
                return { ...p, quantity: newQty };
            }
            return p;
        }));
    };

    const total = useMemo(() => {
        return cart.reduce((acc, item) => acc + (item.precio * item.quantity), 0);
    }, [cart]);

    // --- 3. CREAR EL TICKET PENDIENTE (ENVIAR A CAJA) ---
    const handleSendToCaja = async () => {
        if (cart.length === 0) return alert("El carrito está vacío");

        const orderData = {
            userId: user?.id || user?.id_usuario, // ID del Vendedor
            clienteNombre: clientName || "Consumidor Final",
            items: cart.map(i => ({
                id_producto: i.id,
                cantidad: i.quantity,
                precio: i.precio,
                nombre: i.nombre // Guardamos nombre por si acaso
            })),
            total: total,
            estado: 'PENDIENTE', // <--- CLAVE: Se guarda como pendiente para el POS
            tipo: 'PRE-VENTA'
        };

        try {
            // Llamada a tu API para crear pedido. 
            // Si usas la misma que ventas, asegúrate que acepte estado 'PENDIENTE'
            await api.createOrder(orderData, token); 
            
            alert("✅ Ticket enviado a caja correctamente.");
            setCart([]);
            setClientName('');
        } catch (error) {
            console.error(error);
            alert("Error al enviar el pedido: " + error.message);
        }
    };

    // Filtro de búsqueda
    const filteredProducts = products.filter(p => 
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (p.codigo && p.codigo.includes(searchTerm))
    );

    return (
        <Container>
            {/* --- PANEL IZQUIERDO: PRODUCTOS Y PRECIOS --- */}
            <LeftPanel>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <h2 style={{margin:0, color:'#1e293b'}}>Panel de Ventas</h2>
                    <button onClick={fetchProducts} style={{background:'none', border:'none', cursor:'pointer', color:'#64748b'}}>
                        <FaSync size={20} className={loading ? 'fa-spin' : ''}/>
                    </button>
                </div>

                <SearchBar>
                    <FaSearch color="#94a3b8" size={20} style={{marginTop: 10}}/>
                    <Input 
                        placeholder="Buscar producto por nombre o código..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                </SearchBar>

                <ProductGrid>
                    {filteredProducts.map(p => (
                        <ProductCard key={p.id} onClick={() => addToCart(p)}>
                            <div style={{fontWeight:'bold', color:'#334155'}}>{p.nombre}</div>
                            <div style={{fontSize:'0.85rem', color:'#64748b'}}>Cod: {p.codigo || 'S/C'}</div>
                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop: 'auto'}}>
                                <PriceTag>C$ {parseFloat(p.precio).toFixed(2)}</PriceTag>
                                <div style={{fontSize:'0.8rem', background: p.existencia > 0 ? '#dcfce7':'#fee2e2', color: p.existencia > 0 ? '#166534':'#991b1b', padding:'2px 8px', borderRadius:4}}>
                                    Stock: {p.existencia}
                                </div>
                            </div>
                        </ProductCard>
                    ))}
                </ProductGrid>
            </LeftPanel>

            {/* --- PANEL DERECHO: TICKET TEMPORAL --- */}
            <RightPanel>
                <h3 style={{display:'flex', alignItems:'center', gap:10, borderBottom:'1px solid #e2e8f0', paddingBottom:15}}>
                    <FaShoppingCart /> Ticket Actual
                </h3>

                <div style={{marginBottom: 15}}>
                    <label style={{fontSize:'0.9rem', color:'#64748b'}}>Cliente (Opcional):</label>
                    <Input 
                        style={{width:'90%', padding: 8, marginTop: 5}}
                        placeholder="Nombre del cliente..."
                        value={clientName}
                        onChange={e => setClientName(e.target.value)}
                    />
                </div>

                <div style={{flex: 1, overflowY: 'auto'}}>
                    {cart.length === 0 ? (
                        <div style={{textAlign:'center', color:'#94a3b8', marginTop: 50}}>
                            <FaShoppingCart size={40} style={{marginBottom:10}}/>
                            <p>Escanea o selecciona productos</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <CartItem key={item.id}>
                                <div style={{flex:1}}>
                                    <div style={{fontWeight:'bold', fontSize:'0.9rem'}}>{item.nombre}</div>
                                    <div style={{color:'#64748b', fontSize:'0.85rem'}}>C$ {item.precio} x {item.quantity}</div>
                                </div>
                                <div style={{display:'flex', alignItems:'center', gap:5}}>
                                    <button onClick={() => updateQuantity(item.id, -1)} style={{padding:'2px 8px', cursor:'pointer'}}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)} style={{padding:'2px 8px', cursor:'pointer'}}>+</button>
                                </div>
                                <div style={{fontWeight:'bold', marginLeft:10}}>
                                    C$ {(item.precio * item.quantity).toFixed(2)}
                                </div>
                                <button onClick={() => removeFromCart(item.id)} style={{marginLeft:10, background:'none', border:'none', color:'#ef4444', cursor:'pointer'}}>
                                    <FaTrash />
                                </button>
                            </CartItem>
                        ))
                    )}
                </div>

                <div style={{borderTop:'2px dashed #cbd5e1', paddingTop:20, marginTop:10}}>
                    <div style={{display:'flex', justifyContent:'space-between', fontSize:'1.2rem', fontWeight:'bold', marginBottom:15}}>
                        <span>Total:</span>
                        <span>C$ {total.toFixed(2)}</span>
                    </div>

                    <Button onClick={handleSendToCaja} disabled={cart.length === 0}>
                        <FaPaperPlane /> ENVIAR A CAJA
                    </Button>
                </div>
            </RightPanel>
        </Container>
    );
};

export default SellerDashboard;
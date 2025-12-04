import React, { useState, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { 
  FaSearch, FaShoppingCart, FaPlus, FaTrash, 
  FaPaperPlane, FaSync, FaBarcode, FaFont, FaMinus 
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext'; 
import * as api from '../service/api'; 

// =================================================================
// ESTILOS RESPONSIVE (STYLED COMPONENTS)
// =================================================================

const Container = styled.div`
  display: flex;
  height: 100vh;
  background: #f1f5f9;
  font-family: 'Segoe UI', sans-serif;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column; /* En celular se pone uno debajo de otro */
    height: auto;
    min-height: 100vh;
    overflow-y: auto;
  }
`;

const LeftPanel = styled.div`
  flex: 2;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: hidden; /* Scroll interno en escritorio */

  @media (max-width: 768px) {
    flex: none;
    height: auto;
    overflow-y: visible;
  }
`;

const RightPanel = styled.div`
  flex: 1;
  background: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 15px rgba(0,0,0,0.05);
  border-left: 1px solid #e2e8f0;
  min-width: 350px;

  @media (max-width: 768px) {
    flex: none;
    width: 100%;
    border-left: none;
    border-top: 1px solid #e2e8f0;
    min-width: 0;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

// --- BARRA DE BÚSQUEDA AVANZADA ---
const SearchContainer = styled.div`
  background: white;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SearchTypeToggle = styled.div`
  display: flex;
  gap: 10px;
`;

const ToggleButton = styled.button`
  flex: 1;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid ${props => props.active ? '#3b82f6' : '#cbd5e1'};
  background: ${props => props.active ? '#eff6ff' : 'white'};
  color: ${props => props.active ? '#1d4ed8' : '#64748b'};
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s;

  &:hover { background: #f1f5f9; }
`;

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 0 10px;
  &:focus-within { border-color: #3b82f6; background: white; }
`;

const Input = styled.input`
  flex: 1;
  padding: 12px;
  border: none;
  background: transparent;
  outline: none;
  font-size: 1rem;
`;

// --- GRILLA DE PRODUCTOS ---
const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 15px;
  overflow-y: auto;
  padding-bottom: 20px;
  flex: 1;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); /* Más pequeños en celular */
    max-height: 50vh; /* Limitar altura en móvil para que no ocupe todo */
  }
`;

const ProductCard = styled.div`
  background: white;
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
  transition: transform 0.2s;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-3px);
    border-color: #3b82f6;
    box-shadow: 0 5px 15px rgba(59,130,246,0.1);
  }
`;

const Badge = styled.span`
  background: ${props => props.bg};
  color: ${props => props.color};
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
`;

// --- CARRITO ---
const CartList = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-top: 15px;
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
`;

const QtyControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  padding: 4px;
  border-radius: 6px;
`;

const RoundBtn = styled.button`
  width: 24px; height: 24px;
  border-radius: 50%;
  border: none;
  background: white;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  &:hover { background: #e2e8f0; }
`;

const ActionButton = styled.button`
  background: ${props => props.bg || '#3b82f6'};
  color: white;
  border: none;
  padding: 15px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 1rem;
  width: 100%;
  margin-top: 10px;
  
  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

// =================================================================
// COMPONENTE PRINCIPAL
// =================================================================

const SellerDashboard = () => {
    const { user } = useAuth(); 
    const token = localStorage.getItem('token');
    
    // Estados
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('nombre'); // 'nombre' | 'codigo'
    const [loading, setLoading] = useState(false);
    const [clientName, setClientName] = useState('');
    
    const searchInputRef = useRef(null);

    // 1. Cargar Productos
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await api.fetchProducts(token); 
            // Aseguramos que data sea un array
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error cargando productos", error);
            alert("Error de conexión al cargar productos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    // 2. Lógica de Carrito
    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(p => p.id === product.id);
            if (existing) {
                // Si existe, sumamos 1, validando stock
                if (existing.quantity >= product.existencia) {
                    alert(`Stock máximo alcanzado para ${product.nombre}`);
                    return prev;
                }
                return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
            }
            // Si no existe, agregamos con cantidad 1
            if (product.existencia < 1) {
                alert("Producto sin stock");
                return prev;
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
                const newQty = p.quantity + delta;
                if (newQty < 1) return p; // Mínimo 1
                if (newQty > p.existencia) {
                    alert("No hay suficiente stock");
                    return p;
                }
                return { ...p, quantity: newQty };
            }
            return p;
        }));
    };

    // 3. Lógica de Búsqueda Avanzada
    const handleSearchSubmit = (e) => {
        // Si presiona ENTER
        if (e.key === 'Enter') {
            if (searchType === 'codigo') {
                // Búsqueda exacta por código
                const exactMatch = products.find(p => 
                    p.codigo && p.codigo.toLowerCase() === searchTerm.toLowerCase()
                );
                
                if (exactMatch) {
                    addToCart(exactMatch);
                    setSearchTerm(''); // Limpiar para el siguiente escaneo
                    // Reproducir sonidito opcional o feedback visual
                } else {
                    alert("Producto no encontrado por código");
                }
            }
        }
    };

    const filteredProducts = products.filter(p => {
        const term = searchTerm.toLowerCase();
        if (!term) return true;
        
        if (searchType === 'codigo') {
            return p.codigo && p.codigo.toLowerCase().includes(term);
        } else {
            return p.nombre.toLowerCase().includes(term);
        }
    });

    // Calcular Total
    const total = useMemo(() => {
        return cart.reduce((acc, item) => {
            const precio = parseFloat(item.precio || item.precio_venta || 0);
            return acc + (precio * item.quantity);
        }, 0);
    }, [cart]);

    // 4. Enviar a Caja (Crear Pedido Pendiente)
    const handleSendToCaja = async () => {
        if (cart.length === 0) return alert("El carrito está vacío");

        const orderData = {
            userId: user?.id || user?.id_usuario || 0,
            clienteNombre: clientName.trim() || "Consumidor Final",
            items: cart.map(i => ({
                id_producto: i.id,
                cantidad: i.quantity,
                precio: parseFloat(i.precio || i.precio_venta),
                nombre: i.nombre
            })),
            total: total,
            estado: 'PENDIENTE', // IMPORTANTE para que el cajero lo vea
            tipo: 'PEDIDO'
        };

        try {
            // Asegúrate de que api.createOrder envíe POST a /orders o /ventas
            await api.createOrder(orderData, token);
            
            alert("✅ Pedido enviado a caja. El cajero ya puede cobrarlo.");
            setCart([]);
            setClientName('');
            setSearchTerm('');
        } catch (error) {
            console.error(error);
            alert("Error al enviar: " + (error.message || "Error desconocido"));
        }
    };

    return (
        <Container>
            {/* ================= PANEL IZQUIERDO (PRODUCTOS) ================= */}
            <LeftPanel>
                <Header>
                    <h2 style={{margin:0, color:'#1e293b'}}>Pedidos</h2>
                    <button onClick={fetchProducts} style={{background:'white', border:'1px solid #cbd5e1', padding:8, borderRadius:6, cursor:'pointer'}}>
                        <FaSync className={loading ? 'fa-spin' : ''}/>
                    </button>
                </Header>

                <SearchContainer>
                    <SearchTypeToggle>
                        <ToggleButton 
                            active={searchType === 'nombre'} 
                            onClick={() => { setSearchType('nombre'); searchInputRef.current?.focus(); }}
                        >
                            <FaFont /> Nombre
                        </ToggleButton>
                        <ToggleButton 
                            active={searchType === 'codigo'} 
                            onClick={() => { setSearchType('codigo'); searchInputRef.current?.focus(); }}
                        >
                            <FaBarcode /> Código
                        </ToggleButton>
                    </SearchTypeToggle>

                    <SearchInputWrapper>
                        <FaSearch color="#94a3b8" />
                        <Input 
                            ref={searchInputRef}
                            placeholder={searchType === 'codigo' ? "Escanea o escribe código y pulsa Enter..." : "Busca por descripción..."}
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearchSubmit}
                            autoFocus
                        />
                    </SearchInputWrapper>
                </SearchContainer>

                <ProductGrid>
                    {filteredProducts.map(p => {
                        const precio = parseFloat(p.precio || p.precio_venta || 0);
                        const tieneStock = p.existencia > 0;
                        
                        return (
                            <ProductCard key={p.id} onClick={() => addToCart(p)}>
                                <div>
                                    <div style={{fontWeight:'600', color:'#334155', lineHeight:'1.2'}}>{p.nombre}</div>
                                    <div style={{fontSize:'0.8rem', color:'#64748b', marginTop:4}}>
                                        {p.codigo || 'Sin Código'}
                                    </div>
                                </div>
                                
                                <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginTop:'auto'}}>
                                    <div style={{fontSize:'1.1rem', fontWeight:'bold', color:'#2563eb'}}>
                                        C$ {precio.toFixed(2)}
                                    </div>
                                    <Badge 
                                        bg={tieneStock ? '#dcfce7' : '#fee2e2'} 
                                        color={tieneStock ? '#166534' : '#991b1b'}
                                    >
                                        Stock: {p.existencia}
                                    </Badge>
                                </div>
                            </ProductCard>
                        );
                    })}
                </ProductGrid>
            </LeftPanel>

            {/* ================= PANEL DERECHO (CARRITO) ================= */}
            <RightPanel>
                <div style={{borderBottom:'1px solid #e2e8f0', paddingBottom:15}}>
                    <h3 style={{margin:0, display:'flex', alignItems:'center', gap:10}}>
                        <FaShoppingCart color="#3b82f6"/> Ticket de Venta
                    </h3>
                    <input 
                        style={{
                            width:'100%', padding: '10px', marginTop: 15, 
                            border: '1px solid #cbd5e1', borderRadius: 6, outline:'none'
                        }}
                        placeholder="Nombre del Cliente (Opcional)"
                        value={clientName}
                        onChange={e => setClientName(e.target.value)}
                    />
                </div>

                <CartList>
                    {cart.length === 0 ? (
                        <div style={{textAlign:'center', color:'#94a3b8', marginTop: 40}}>
                            <FaShoppingCart size={40} style={{opacity:0.3}}/>
                            <p>El carrito está vacío</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <CartItem key={item.id}>
                                <div style={{flex:1, paddingRight:10}}>
                                    <div style={{fontWeight:'600', fontSize:'0.9rem'}}>{item.nombre}</div>
                                    <div style={{color:'#64748b', fontSize:'0.8rem'}}>
                                        C$ {parseFloat(item.precio).toFixed(2)} x {item.quantity}
                                    </div>
                                </div>
                                
                                <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end', gap:5}}>
                                    <div style={{fontWeight:'bold', color:'#334155'}}>
                                        C$ {(parseFloat(item.precio) * item.quantity).toFixed(2)}
                                    </div>
                                    
                                    <div style={{display:'flex', alignItems:'center', gap:5}}>
                                        <QtyControl>
                                            <RoundBtn onClick={() => updateQuantity(item.id, -1)}><FaMinus size={10}/></RoundBtn>
                                            <span style={{fontSize:'0.9rem', minWidth:15, textAlign:'center'}}>{item.quantity}</span>
                                            <RoundBtn onClick={() => updateQuantity(item.id, 1)}><FaPlus size={10}/></RoundBtn>
                                        </QtyControl>
                                        <button 
                                            onClick={() => removeFromCart(item.id)} 
                                            style={{border:'none', background:'none', color:'#ef4444', cursor:'pointer', padding:5}}
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            </CartItem>
                        ))
                    )}
                </CartList>

                <div style={{borderTop:'2px dashed #cbd5e1', paddingTop:20, marginTop:10}}>
                    <div style={{display:'flex', justifyContent:'space-between', fontSize:'1.3rem', fontWeight:'bold', marginBottom:15, color:'#1e293b'}}>
                        <span>Total:</span>
                        <span>C$ {total.toFixed(2)}</span>
                    </div>

                    <ActionButton onClick={handleSendToCaja} disabled={cart.length === 0}>
                        <FaPaperPlane /> ENVIAR A CAJA
                    </ActionButton>
                </div>
            </RightPanel>
        </Container>
    );
};

export default SellerDashboard;
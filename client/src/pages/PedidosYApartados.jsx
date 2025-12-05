// Archivo: src/pages/PedidosYApartados.jsx

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { 
    FaSearch, FaShoppingCart, FaPlus, FaTrash, 
    FaPaperPlane, FaSync, FaBarcode, FaFont, FaMinus 
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext'; 
import * as api from '../service/api'; 
// Asegúrate de que tu api.js exporte una función fetchActiveBoxes.
// Si no existe, deberás añadirla a tu api.js
// IMPORTANTE: Se asume que api.js tiene una función 'fetchActiveBoxes'.


// =================================================================
// ESTILOS RESPONSIVE (STYLED COMPONENTS)
// ... (Tus estilos se mantienen sin cambios)
// =================================================================
const Container = styled.div`
    display: flex; height: 100vh; background: #f1f5f9; font-family: 'Segoe UI', sans-serif; overflow: hidden;
    @media (max-width: 768px) { flex-direction: column; height: auto; min-height: 100vh; overflow-y: auto; }
`;
const LeftPanel = styled.div`
    flex: 2; padding: 20px; display: flex; flex-direction: column; gap: 15px; overflow-y: hidden;
    @media (max-width: 768px) { flex: none; height: auto; overflow-y: visible; }
`;
const RightPanel = styled.div`
    flex: 1; background: white; padding: 20px; display: flex; flex-direction: column; box-shadow: -4px 0 15px rgba(0,0,0,0.05); border-left: 1px solid #e2e8f0; min-width: 350px;
    @media (max-width: 768px) { flex: none; width: 100%; border-left: none; border-top: 1px solid #e2e8f0; min-width: 0; }
`;
const Header = styled.div` display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; `;
const SearchContainer = styled.div`
    background: white; padding: 15px; border-radius: 12px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); display: flex; flex-direction: column; gap: 10px;
`;
const SearchTypeToggle = styled.div` display: flex; gap: 10px; `;
const ToggleButton = styled.button`
    flex: 1; padding: 8px; border-radius: 6px; border: 1px solid ${props => props.active ? '#3b82f6' : '#cbd5e1'};
    background: ${props => props.active ? '#eff6ff' : 'white'}; color: ${props => props.active ? '#1d4ed8' : '#64748b'};
    font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s;
    &:hover { background: #f1f5f9; }
`;
const SearchInputWrapper = styled.div`
    display: flex; align-items: center; background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 8px; padding: 0 10px; &:focus-within { border-color: #3b82f6; background: white; }
`;
const Input = styled.input` flex: 1; padding: 12px; border: none; background: transparent; outline: none; font-size: 1rem; `;
const ProductGrid = styled.div`
    display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 15px; overflow-y: auto; padding-bottom: 20px; flex: 1;
    @media (max-width: 768px) { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); max-height: 50vh; }
`;
const ProductCard = styled.div`
    background: white; padding: 15px; border-radius: 10px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; justify-content: space-between; gap: 8px; transition: transform 0.2s; cursor: pointer; 
    &:hover { transform: translateY(-3px); border-color: #3b82f6; box-shadow: 0 5px 15px rgba(59,130,246,0.1); }
`;
const Badge = styled.span`
    background: ${props => props.bg}; color: ${props => props.color}; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem; font-weight: bold;
`;
const CartList = styled.div` flex: 1; overflow-y: auto; margin-top: 15px; `;
const CartItem = styled.div` display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f1f5f9; `;
const QtyControl = styled.div` display: flex; align-items: center; gap: 8px; background: #f8fafc; padding: 4px; border-radius: 6px; `;
const RoundBtn = styled.button`
    width: 24px; height: 24px; border-radius: 50%; border: none; background: white; box-shadow: 0 1px 2px rgba(0,0,0,0.1); cursor: pointer; display: flex; align-items: center; justify-content: center;
    &:hover { background: #e2e8f0; }
`;
const ActionButton = styled.button`
    background: ${props => props.bg || '#3b82f6'}; color: white; border: none; padding: 15px; border-radius: 8px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 1rem; width: 100%; margin-top: 10px; 
    &:disabled { background: #cbd5e1; cursor: not-allowed; } 
    &:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
`;

const sanitizeText = (text) => String(text || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// =================================================================
// COMPONENTE PRINCIPAL: SellerDashboard
// =================================================================

const SellerDashboard = () => {
    const { user, products: authProducts } = useAuth(); 
    const token = localStorage.getItem('token');
    
    const [products, setProducts] = useState(authProducts || []); 
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('nombre'); 
    const [loading, setLoading] = useState(false);
    const [clientName, setClientName] = useState('');
    
    const searchInputRef = useRef(null);
    const userId = user?.id_usuario || user?.id || 0;

    useEffect(() => {
        if (authProducts?.length) {
            setProducts(authProducts);
        }
    }, [authProducts]);

    // 1. Cargar Productos
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.fetchProducts(token); 
            const normalizedData = Array.isArray(data) ? data : (data?.data || []);
            setProducts(normalizedData);
            alert("Inventario actualizado.");
        } catch (error) {
            const msg = error.message || (error.response?.data?.message) || "Verifique su conexión de red o token.";
            alert(`Error de conexión al cargar productos: ${msg}`);
        } finally {
            setLoading(false);
        }
    }, [token]);

    // 2. Lógica de Carrito
    // ... (Lógica de Carrito se mantiene sin cambios)
    const addToCart = (product) => {
        setCart(prev => {
            const stockAvailable = product.existencia;
            const existing = prev.find(p => p.id === product.id);
            const finalPrice = parseFloat(product.precio_venta || product.precio || 0); 
            
            if (existing) {
                if (existing.quantity >= stockAvailable) {
                    alert(`Stock máximo (${stockAvailable}) alcanzado para ${product.nombre}`);
                    return prev;
                }
                return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
            }
            
            if (stockAvailable < 1) {
                alert("Producto sin stock");
                return prev;
            }

            return [...prev, { 
                ...product, 
                quantity: 1, 
                precio_venta: finalPrice 
            }]; 
        });
    };

    const updateQuantity = (id, delta) => {
        setCart(prev => {
            const newCart = prev.map(p => {
                if (p.id === id) {
                    const newQty = p.quantity + delta;
                    if (newQty < 1) {
                        return null; 
                    }
                    if (newQty > p.existencia) { 
                        alert("No hay suficiente stock");
                        return p;
                    }
                    return { ...p, quantity: newQty };
                }
                return p;
            }).filter(Boolean);
            return newCart;
        });
    };
    
    // 3. Lógica de Búsqueda y Filtrado
    // ... (Lógica de Búsqueda y Filtrado se mantiene sin cambios)
    const filteredProducts = useMemo(() => {
        const term = sanitizeText(searchTerm);
        if (term.length < 3 && searchType === 'nombre') {
            return products.slice(0, 100); 
        }

        const filtered = products.filter(p => {
            if (!term) return true; 
            
            if (searchType === 'codigo') {
                return sanitizeText(p.codigo).includes(term);
            } else {
                return sanitizeText(p.nombre).includes(term);
            }
        });

        return filtered.slice(0, 100); 
    }, [products, searchTerm, searchType]);


    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            if (searchType === 'codigo' && searchTerm) {
                const exactMatch = products.find(p => 
                    sanitizeText(p.codigo) === sanitizeText(searchTerm)
                );
                
                if (exactMatch) {
                    addToCart(exactMatch);
                    setSearchTerm(''); 
                    searchInputRef.current?.focus();
                } else {
                    alert(`Producto con código ${searchTerm} no encontrado.`);
                }
            } else {
                searchInputRef.current?.focus();
            }
        }
    };

    const total = useMemo(() => {
        return cart.reduce((acc, item) => {
            const precio = parseFloat(item.precio_venta || item.precio || 0); 
            return acc + (precio * item.quantity);
        }, 0);
    }, [cart]);

    // =================================================================
    // 4. FUNCIONALIDAD SOLICITADA: CREAR TICKET CON SELECCIÓN DE CAJA
    // =================================================================
    const handleCreateTicket = async () => {
        if (cart.length === 0) return alert("El carrito está vacío");
        if (userId === 0) return alert("Error: Usuario no identificado para crear el ticket.");
        
        setLoading(true);

        // --- INICIO DE LÓGICA DE SELECCIÓN DE CAJA ---
        let selectedBoxId = null;
        try {
            // Se asume que api.fetchActiveBoxes existe y devuelve [{ id: 1, name: 'Caja 1' }, ...]
            const activeBoxes = await api.fetchActiveBoxes(token); 

            if (!activeBoxes || activeBoxes.length === 0) {
                alert("🚨 No hay cajas activas. No se puede crear el ticket de venta.");
                setLoading(false);
                return;
            }

            const boxOptions = activeBoxes
                .map(box => `[${box.id}] - ${box.nombre || box.name}`) // Usar .name si es el campo
                .join('\n');
            
            // Usamos prompt para forzar la selección, como se solicitó para simplificar.
            const promptMessage = `Selecciona el ID de la Caja Activa para registrar el Ticket:\n\n${boxOptions}`;
            const input = prompt(promptMessage);

            if (input === null || input.trim() === '') {
                alert("Creación de ticket cancelada por el usuario.");
                setLoading(false);
                return;
            }

            const id = parseInt(input.trim());
            const boxExists = activeBoxes.some(box => box.id === id);

            if (isNaN(id) || !boxExists) {
                alert("🚫 ID de caja inválido. Intenta de nuevo.");
                setLoading(false);
                return;
            }

            selectedBoxId = id;

        } catch (error) {
            console.error("Error al obtener cajas activas:", error);
            alert("Error de conexión al obtener las cajas. No se puede crear el ticket.");
            setLoading(false);
            return;
        }
        // --- FIN DE LÓGICA DE SELECCIÓN DE CAJA ---

        // Preparación de los datos del pedido/ticket
        const orderData = {
            id_caja: selectedBoxId, // CAMPO CLAVE AGREGADO
            userId: userId, 
            clienteNombre: clientName.trim() || "Consumidor Final",
            items: cart.map(i => ({
                id_producto: i.id, 
                cantidad: i.quantity,
                precio: parseFloat(i.precio_venta), 
                nombre: i.nombre,
                codigo: i.codigo 
            })),
            total: total,
            estado: 'COMPLETADO', // Cambiado a COMPLETO para reflejar un Ticket de Venta
            tipo: 'TICKET' // Cambiado a TICKET
        };

        try {
            await api.createOrder(orderData, token); 
            
            alert(`✅ Ticket creado y asignado a la Caja ID: ${selectedBoxId}.`);
            setCart([]);
            setClientName('');
            setSearchTerm('');
            searchInputRef.current?.focus();
        } catch (error) {
            console.error("Error al crear el ticket:", error);
            const apiMessage = error.response?.data?.message || error.message;

            if (error.response?.status === 401) {
                 alert("Error de autenticación: Token expirado o inválido. Cierre sesión e inicie nuevamente.");
            } else {
                 alert("❌ Error al crear el ticket: " + (apiMessage || "Fallo desconocido en el servidor."));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            {/* ================= PANEL IZQUIERDO (PRODUCTOS) ================= */}
            <LeftPanel>
                <Header>
                    <h2 style={{margin:0, color:'#1e293b'}}>Punto de Venta</h2>
                    <button 
                        onClick={fetchProducts} 
                        disabled={loading}
                        style={{background:'white', border:'1px solid #cbd5e1', padding:'8px 12px', borderRadius:6, cursor:'pointer', display:'flex', alignItems:'center', gap:5}}
                    >
                        <FaSync className={loading ? 'fa-spin' : ''}/>
                        {loading ? 'Cargando...' : 'Recargar'}
                    </button>
                </Header>

                <SearchContainer>
                    <SearchTypeToggle>
                        <ToggleButton 
                            active={searchType === 'nombre'} 
                            onClick={() => { setSearchType('nombre'); setSearchTerm(''); searchInputRef.current?.focus(); }}
                        >
                            <FaFont /> Nombre
                        </ToggleButton>
                        <ToggleButton 
                            active={searchType === 'codigo'} 
                            onClick={() => { setSearchType('codigo'); setSearchTerm(''); searchInputRef.current?.focus(); }}
                        >
                            <FaBarcode /> Código
                        </ToggleButton>
                    </SearchTypeToggle>

                    <SearchInputWrapper>
                        <FaSearch color="#94a3b8" />
                        <Input 
                            ref={searchInputRef}
                            placeholder={searchType === 'codigo' ? "Escanea o escribe código y pulsa Enter..." : "Busca por descripción (mínimo 3 letras)..."}
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearchSubmit}
                            autoFocus
                        />
                    </SearchInputWrapper>
                    <p style={{margin:0, fontSize:'0.8rem', color:'#64748b'}}>
                        Mostrando **{filteredProducts.length}** productos filtrados.
                    </p>
                </SearchContainer>

                <ProductGrid>
                    {filteredProducts.map(p => {
                        const precio = parseFloat(p.precio_venta || p.precio || 0);
                        const tieneStock = p.existencia > 0;
                        
                        return (
                            <ProductCard key={p.id} onClick={() => addToCart(p)}>
                                <div>
                                    <div style={{fontWeight:'600', color:'#334155', lineHeight:'1.2', maxHeight: '2.4em', overflow: 'hidden'}} title={p.nombre}>{p.nombre}</div>
                                    <div style={{fontSize:'0.8rem', color:'#64748b', marginTop:4}}>
                                        {p.codigo || `ID: ${p.id}`}
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
                    <Input 
                        style={{
                            width:'100%', padding: '10px', marginTop: 15, 
                            border: '1px solid #cbd5e1', borderRadius: 6, outline:'none', background:'white'
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
                                        C$ {parseFloat(item.precio_venta).toFixed(2)} x {item.quantity}
                                    </div>
                                </div>
                                
                                <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end', gap:5}}>
                                    <div style={{fontWeight:'bold', color:'#334155'}}>
                                        C$ {(parseFloat(item.precio_venta) * item.quantity).toFixed(2)}
                                    </div>
                                    
                                    <div style={{display:'flex', alignItems:'center', gap:5}}>
                                        <QtyControl>
                                            <RoundBtn onClick={() => updateQuantity(item.id, -1)}><FaMinus size={10}/></RoundBtn>
                                            <span style={{fontSize:'0.9rem', minWidth:15, textAlign:'center'}}>{item.quantity}</span>
                                            <RoundBtn onClick={() => updateQuantity(item.id, 1)}><FaPlus size={10}/></RoundBtn>
                                        </QtyControl>
                                        <button 
                                            onClick={() => setCart(prev => prev.filter(p => p.id !== item.id))} 
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

                    <ActionButton 
                        onClick={handleCreateTicket} // Llama a la nueva función
                        disabled={cart.length === 0 || loading}
                    >
                        <FaPaperPlane /> REGISTRAR TICKET Y ASIGNAR CAJA
                    </ActionButton>
                </div>
            </RightPanel>
        </Container>
    );
};

export default SellerDashboard;
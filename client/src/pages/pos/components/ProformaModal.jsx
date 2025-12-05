// Archivo: src/pages/PedidosYApartados.jsx

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import styled, { keyframes } from 'styled-components'; 
import { 
    FaSearch, FaFilePdf, FaPlus, FaTrash, 
    FaSync, FaBarcode, FaFont, FaMinus, FaFileAlt 
} from 'react-icons/fa'; 

import { useAuth } from '../context/AuthContext'; 
import * as api from '../service/api'; 

// 1. IMPORTAMOS EL MODAL DE PROFORMA - RUTA CORREGIDA
// Desde: src/pages/     Necesita ir a: src/pages/POS/components/
// RUTA ANTERIOR: './POS/components/ProformaModal.jsx'; (Ruta relativa incorrecta desde 'pages')
// RUTA CORREGIDA: './pos/components/ProformaModal.jsx'; 
import ProformaModal from './pos/components/ProformaModal.jsx'; 


// =================================================================
// ESTILOS RESPONSIVE (STYLED COMPONENTS) - (Se mantiene igual)
// =================================================================
const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;
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
    background: ${props => props.bg || '#059669'}; 
    color: white; border: none; padding: 15px; border-radius: 8px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 1rem; width: 100%; margin-top: 10px; 
    &:disabled { background: #cbd5e1; cursor: not-allowed; } 
    &:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
`;
const LoadingIcon = styled(FaSync)`
    animation: ${spin} 1s linear infinite;
`;


const sanitizeText = (text) => String(text || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// =================================================================
// COMPONENTE PRINCIPAL: ProformaGenerator
// =================================================================

const ProformaGenerator = () => {
    const { user, products: authProducts } = useAuth(); 
    const token = localStorage.getItem('token');
    
    const [products, setProducts] = useState(authProducts || []); 
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('nombre'); 
    const [loading, setLoading] = useState(false);
    const [clientName, setClientName] = useState('');
    
    // 2. NUEVOS ESTADOS PARA MANEJAR EL MODAL
    const [isProformaModalOpen, setIsProformaModalOpen] = useState(false);
    const [proformaDetails, setProformaDetails] = useState(null);

    const searchInputRef = useRef(null);
    
    useEffect(() => {
        if (authProducts?.length) {
            setProducts(authProducts);
        }
    }, [authProducts]);

    const fetchProducts = useCallback(async () => {
        // ... (función fetchProducts se mantiene igual)
        setLoading(true);
        try {
            const data = await api.fetchProducts(token); 
            const normalizedData = Array.isArray(data) ? data : (data?.data || []);
            setProducts(normalizedData);
            alert("Inventario de productos actualizado.");
        } catch (error) {
            const msg = error.message || (error.response?.data?.message) || "Verifique su conexión de red o token.";
            alert(`Error de conexión al cargar productos: ${msg}`);
        } finally {
            setLoading(false);
        }
    }, [token]);

    const addToCart = (product) => {
        // ... (función addToCart se mantiene igual)
        setCart(prev => {
            const existing = prev.find(p => p.id === product.id);
            const finalPrice = parseFloat(product.precio_venta || product.precio || 0); 
            
            if (existing) {
                return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
            }

            return [...prev, { 
                ...product, 
                quantity: 1, 
                precio_venta: finalPrice 
            }]; 
        });
    };

    const updateQuantity = (id, delta) => {
        // ... (función updateQuantity se mantiene igual)
        setCart(prev => {
            const newCart = prev.map(p => {
                if (p.id === id) {
                    const newQty = p.quantity + delta;
                    if (newQty < 1) {
                        return null; 
                    }
                    return { ...p, quantity: newQty };
                }
                return p;
            }).filter(Boolean);
            return newCart;
        });
    };
    
    const filteredProducts = useMemo(() => {
        // ... (filteredProducts se mantiene igual)
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
        // ... (handleSearchSubmit se mantiene igual)
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

    // Calcular Subtotal y Descuento (Asumiendo que no hay impuestos ni descuentos fijos aquí)
    const subtotal = total;
    const discount = 0;

    const resetCart = useCallback(() => {
        setCart([]);
        setClientName('');
        setProformaDetails(null);
        setIsProformaModalOpen(false);
        searchInputRef.current?.focus();
    }, []);

    // 3. FUNCIÓN MEJORADA: PREPARA LOS DATOS Y ABRE EL MODAL
    const handleGenerateProforma = async () => {
        if (cart.length === 0) return alert("El carrito está vacío. Agrega productos para generar la proforma.");
        
        const clientTrimmed = clientName.trim();
        if (!clientTrimmed) {
            return alert("🚨 Por favor, introduce el Nombre del Cliente antes de generar la proforma.");
        }
        
        setLoading(true);

        // 1. Prepara el objeto de la Proforma con todos los datos necesarios
        const newProformaDetails = {
            cart: cart,
            total: total,
            subtotal: subtotal,
            discount: discount,
            proformaFor: clientTrimmed, // El nombre a quien se emitirá la proforma (el campo de texto)
            client: { nombre: clientTrimmed, telefono: 'N/D' }, // Datos simulados del cliente
            // currentUser: user, // Ya está disponible a través de useAuth en ProformaModal si es necesario
        };

        // Simula la espera de la API si fuera necesario (la quitamos ya que el modal es inmediato)
        // await new Promise(resolve => setTimeout(resolve, 500)); 

        // 2. Guarda los detalles y abre el modal
        setProformaDetails(newProformaDetails);
        setIsProformaModalOpen(true);
        setLoading(false);
    };

    // 4. FUNCIÓN DUMMY PARA setTicketData (necesaria para ProformaModal)
    // El ProformaModal usa setTicketData para pasar la transacción al componente de impresión.
    // Como estamos en un contexto de solo proforma, esta función solo limpia el carrito después de la impresión simulada.
    const handleSetTicketData = useCallback((data) => {
        console.log("Simulación de envío a impresión/PDF:", data.transaction);
        // Aquí podrías agregar la lógica real para llamar al servicio de impresión de PDF
        
        // Asumiendo que la impresión/generación es exitosa, limpiamos la pantalla.
        // En una aplicación real, esto se haría DENTRO de la función de impresión del TicketModal.
        alert(`🎉 Proforma lista para imprimir. Limpiando carro de cotización.`);
        resetCart();
    }, [resetCart]);


    return (
        <Container>
            {/* ================= PANEL IZQUIERDO (PRODUCTOS) ================= */}
            <LeftPanel>
                <Header>
                    <h2 style={{margin:0, color:'#1e293b'}}>Catálogo y Proformas</h2>
                    <button 
                        onClick={fetchProducts} 
                        disabled={loading}
                        style={{background:'white', border:'1px solid #cbd5e1', padding:'8px 12px', borderRadius:6, cursor:'pointer', display:'flex', alignItems:'center', gap:5}}
                    >
                        {loading ? <LoadingIcon size={14}/> : <FaSync size={14}/>}
                        {loading ? 'Cargando...' : 'Recargar Productos'}
                    </button>
                </Header>
                {/* ... (Contenedor de búsqueda y ProductGrid se mantienen iguales) ... */}
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

            {/* ================= PANEL DERECHO (DETALLE DE PROFORMA) ================= */}
            <RightPanel>
                <div style={{borderBottom:'1px solid #e2e8f0', paddingBottom:15}}>
                    <h3 style={{margin:0, display:'flex', alignItems:'center', gap:10}}>
                        <FaFileAlt color="#059669"/> Detalle de Proforma
                    </h3>
                    <Input 
                        style={{
                            width:'100%', padding: '10px', marginTop: 15, 
                            border: '1px solid #cbd5e1', borderRadius: 6, outline:'none', background:'white'
                        }}
                        placeholder="Nombre del Cliente (Obligatorio)"
                        value={clientName}
                        onChange={e => setClientName(e.target.value)}
                    />
                </div>

                <CartList>
                    {cart.length === 0 ? (
                        <div style={{textAlign:'center', color:'#94a3b8', marginTop: 40}}>
                            <FaFilePdf size={40} style={{opacity:0.3}}/>
                            <p>Agrega productos para cotizar</p>
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
                        bg="#059669" // Color verde
                        onClick={handleGenerateProforma}
                        disabled={cart.length === 0 || loading || !clientName.trim()}
                    >
                        {loading ? <LoadingIcon /> : <FaFilePdf />} GENERAR PROFORMA PDF
                    </ActionButton>
                </div>
            </RightPanel>

            {/* 5. RENDERING CONDICIONAL DEL MODAL DE PROFORMA */}
            {isProformaModalOpen && proformaDetails && (
                <ProformaModal 
                    {...proformaDetails} // Pasa cart, total, subtotal, discount, proformaFor, client
                    onClose={() => setIsProformaModalOpen(false)} // Cierra el modal
                    // Este prop es lo que el modal usará para "confirmar" la impresión y limpiar el carrito.
                    setTicketData={handleSetTicketData} 
                    currentUser={user} // Pasamos el usuario para que ProformaModal pueda obtener el nombre del vendedor.
                />
            )}
        </Container>
    );
};

export default ProformaGenerator;
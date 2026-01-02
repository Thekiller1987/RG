// Archivo: src/pages/PedidosYApartados.jsx

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import {
    FaSearch, FaFilePdf, FaPlus, FaTrash,
    FaSync, FaBarcode, FaFont, FaMinus, FaFileAlt,
    FaArrowLeft, FaPhone, FaImage, FaEye, FaTimes
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '../context/AuthContext';
import * as api from '../service/api';

import ProformaEmpleadoModal from './pos/components/ProformaEmpleadoModal.jsx';


// =================================================================
// ESTILOS RESPONSIVE
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
    @media (max-width: 768px) { flex: none; height: auto; overflow-y: visible; padding: 15px; } 
`;
const RightPanel = styled.div`
    flex: 1; background: white; padding: 20px; display: flex; flex-direction: column; box-shadow: -4px 0 15px rgba(0,0,0,0.05); border-left: 1px solid #e2e8f0; min-width: 350px;
    @media (max-width: 768px) { flex: none; width: 100%; border-left: none; border-top: 1px solid #e2e8f0; min-width: 0; padding: 15px; } 
`;
const Header = styled.div` 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    margin-bottom: 10px; 
    gap: 10px;
`;

const HeaderActions = styled.div`
    display: flex;
    gap: 10px;
    
    button {
        padding: 8px 12px;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 5px;
        transition: background 0.2s;
        white-space: nowrap; 
    }

    @media (max-width: 768px) {
        flex-direction: column;
        
        button {
            width: 100%;
            justify-content: center;
        }
    }
`;

const BackButton = styled.button`
    background: #3b82f6; 
    border: none;
    color: white;
    &:hover { background: #1d4ed8; }
`;

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
const InputGroup = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0;
    margin-top: 10px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    background: white;

    &:focus-within {
        border-color: #3b82f6;
    }

    input {
        flex: 1;
        padding: 10px;
        border: none;
        outline: none;
        background: transparent;
        font-size: 1rem;
    }

    svg {
        margin-left: 10px;
        color: #94a3b8;
    }
`;
const ProductGrid = styled.div`
    display: grid; 
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); 
    gap: 15px; 
    overflow-y: auto; 
    padding-bottom: 20px; 
    flex: 1;
    
    @media (max-width: 768px) { 
        grid-template-columns: repeat(2, 1fr); 
        max-height: 60vh; 
    }
`;
const ProductCard = styled.div`
    background: white; padding: 15px; border-radius: 10px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; justify-content: space-between; gap: 8px; transition: transform 0.2s; cursor: pointer; position: relative;
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

const ModalOverlay = styled.div`
  position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;
  backdrop-filter: blur(3px);
`;


const sanitizeText = (text) => String(text || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const ImageViewModal = ({ isOpen, imageSrc, onClose }) => {
    if (!isOpen || !imageSrc) return null;
    return (
        <ModalOverlay onClick={onClose}>
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{ position: 'relative', maxWidth: '90%', maxHeight: '90vh', background: 'transparent' }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: -15, right: -15,
                        background: 'white', width: 32, height: 32, borderRadius: '50%',
                        border: 'none', cursor: 'pointer', fontWeight: 'bold',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 10, color: '#ef4444'
                    }}
                >
                    <FaTimes />
                </button>
                <img
                    src={imageSrc}
                    alt="Vista Completa"
                    style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '8px', boxShadow: '0 5px 20px rgba(0,0,0,0.5)', display: 'block', background: 'white' }}
                />
            </motion.div>
        </ModalOverlay>
    );
};


// =================================================================
// COMPONENTE PRINCIPAL: ProformaGenerator
// =================================================================

const ProformaGenerator = () => {
    // const navigate = useNavigate(); // Descomenta si usas React Router

    const { user, products: authProducts } = useAuth();
    const token = localStorage.getItem('token');

    const [products, setProducts] = useState(authProducts || []);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('nombre');
    const [loading, setLoading] = useState(false);

    const [clientName, setClientName] = useState('');
    const [clientPhone, setClientPhone] = useState(''); // Estado para teléfono
    const [proformaNumber, setProformaNumber] = useState(''); // Estado para número opcional

    const [isProformaModalOpen, setIsProformaModalOpen] = useState(false);
    const [proformaDetails, setProformaDetails] = useState(null);

    // Estado para ver imagen
    const [viewImage, setViewImage] = useState({ isOpen: false, imageUrl: null });

    const searchInputRef = useRef(null);

    useEffect(() => {
        if (authProducts?.length) {
            setProducts(authProducts);
        }
    }, [authProducts]);

    const fetchProducts = useCallback(async () => {
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

    const goToDashboard = () => {
        // CORRECCIÓN: Usar navigate() si está disponible, sino, fallback
        // navigate('/dashboard'); 
        window.location.href = '/dashboard';
    };


    const addToCart = (product) => {
        if (!product.existencia || product.existencia <= 0) {
            return alert("Este producto está agotado.");
        }

        setCart(prev => {
            const existing = prev.find(p => p.id === product.id);
            const finalPrice = parseFloat(product.precio_venta || product.precio || 0);

            if (existing) {
                if (existing.quantity >= product.existencia) {
                    alert(`No puedes agregar más de ${product.existencia} unidades de este producto.`);
                    return prev;
                }
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
        setCart(prev => {
            const item = prev.find(p => p.id === id);
            if (!item) return prev;

            const productInfo = products.find(p => p.id === id) || item;
            const maxStock = productInfo.existencia || 9999;

            const newQty = item.quantity + delta;

            if (newQty > maxStock) {
                alert(`Stock máximo alcanzado (${maxStock}).`);
                return prev;
            }

            if (newQty < 1) {
                return prev.filter(p => p.id !== id);
            }

            return prev.map(p => p.id === id ? { ...p, quantity: newQty } : p);
        });
    };

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

    const subtotal = total;
    const discount = 0;

    const resetCart = useCallback(() => {
        setCart([]);
        setClientName('');
        setClientPhone(''); // Limpiar teléfono
        setProformaDetails(null);
        setIsProformaModalOpen(false);
        setProformaNumber('');
        searchInputRef.current?.focus();
    }, []);

    // FUNCIÓN: PREPARA LOS DATOS Y ABRE EL MODAL
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
            proformaNumber: proformaNumber.trim(),
            proformaFor: clientTrimmed,
            client: {
                nombre: clientTrimmed,
                telefono: clientPhone.trim() || 'N/D' // <- TELÉFONO INCLUIDO (o 'N/D')
            },
        };

        setProformaDetails(newProformaDetails);
        setIsProformaModalOpen(true);
        setLoading(false);
    };

    // FUNCIÓN MODIFICADA: solo limpia el carro (llamada desde ProformaEmpleadoModal)
    const handleSetTicketData = useCallback(() => {
        // Asumimos que la descarga fue iniciada y ahora limpiamos el estado.
        resetCart();
    }, [resetCart]);


    return (
        <Container>
            {/* ================= PANEL IZQUIERDO (PRODUCTOS) ================= */}
            <LeftPanel>
                <Header>
                    <h2 style={{ margin: 0, color: '#1e293b' }}>Catálogo y Proformas</h2>
                    <HeaderActions>
                        <BackButton
                            onClick={goToDashboard}
                        >
                            <FaArrowLeft size={14} /> Regresar
                        </BackButton>

                        <button
                            onClick={fetchProducts}
                            disabled={loading}
                            style={{ background: 'white', border: '1px solid #cbd5e1', color: '#475569' }}
                        >
                            {loading ? <LoadingIcon size={14} /> : <FaSync size={14} />}
                            {loading ? 'Cargando...' : 'Recargar'}
                        </button>
                    </HeaderActions>
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
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                        Mostrando **{filteredProducts.length}** productos filtrados.
                    </p>
                </SearchContainer>

                <ProductGrid>
                    {filteredProducts.map(p => {
                        const precio = parseFloat(p.precio_venta || p.precio || 0);
                        const tieneStock = p.existencia > 0;

                        return (
                            <ProductCard key={p.id} onClick={() => addToCart(p)}>
                                {/* Botón "Ojito" para ver imagen completa */}
                                {p.imagen && (
                                    <div
                                        onClick={(e) => { e.stopPropagation(); setViewImage({ isOpen: true, imageUrl: p.imagen }); }}
                                        style={{
                                            position: 'absolute', top: 10, left: 10, zIndex: 10,
                                            background: 'rgba(255,255,255,0.9)', borderRadius: '50%',
                                            width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                            color: '#334155'
                                        }}
                                        title="Ver imagen completa"
                                    >
                                        <FaEye size={14} />
                                    </div>
                                )}

                                <div style={{ height: '140px', background: '#f8fafc', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px', position: 'relative' }}>
                                    {p.imagen ? (
                                        <img src={p.imagen} alt={p.nombre} style={{ width: '100%', height: '100%', objectFit: 'contain', background: 'white' }} loading="lazy" />
                                    ) : (
                                        <FaImage size={40} color="#cbd5e1" />
                                    )}
                                </div>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ fontWeight: '600', color: '#334155', lineHeight: '1.2', maxHeight: '2.4em', overflow: 'hidden', marginBottom: '4px' }} title={p.nombre}>{p.nombre}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                        {p.codigo || `ID: ${p.id}`}
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto', paddingTop: '10px' }}>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#2563eb' }}>
                                            C$ {precio.toFixed(2)}
                                        </div>
                                        <Badge
                                            bg={tieneStock ? '#dcfce7' : '#fee2e2'}
                                            color={tieneStock ? '#166534' : '#991b1b'}
                                        >
                                            Stock: {p.existencia}
                                        </Badge>
                                    </div>
                                </div>
                            </ProductCard>
                        );
                    })}
                </ProductGrid>
            </LeftPanel>

            {/* ================= PANEL DERECHO (DETALLE DE PROFORMA) ================= */}
            <RightPanel>
                <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 15 }}>
                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <FaFileAlt color="#059669" /> Detalle de Proforma
                    </h3>

                    {/* CAMPO DE NOMBRE DEL CLIENTE (OBLIGATORIO) */}
                    <Input
                        style={{
                            width: '100%', padding: '10px', marginTop: 15,
                            border: '1px solid #cbd5e1', borderRadius: 6, outline: 'none', background: 'white'
                        }}
                        placeholder="Nombre del Cliente (Obligatorio)"
                        value={clientName}
                        onChange={e => setClientName(e.target.value)}
                    />

                    {/* CAMPO DE NÚMERO DE TELÉFONO (OPCIONAL) */}
                    <InputGroup>
                        <FaPhone size={14} />
                        <input
                            type="tel"
                            placeholder="Teléfono del Cliente (Opcional)"
                            value={clientPhone}
                            onChange={e => setClientPhone(e.target.value)}
                        />
                    </InputGroup>

                    {/* CAMPO DE NÚMERO DE PROFORMA (OPCIONAL) */}
                    <Input
                        style={{
                            width: '100%', padding: '10px', marginTop: 10,
                            border: '1px solid #cbd5e1', borderRadius: 6, outline: 'none', background: 'white'
                        }}
                        placeholder="Número de Proforma (Opcional)"
                        value={proformaNumber}
                        onChange={e => setProformaNumber(e.target.value)}
                    />
                </div>

                <CartList>
                    {cart.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: 40 }}>
                            <FaFilePdf size={40} style={{ opacity: 0.3 }} />
                            <p>Agrega productos para cotizar</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <CartItem key={item.id}>
                                <div style={{ flex: 1, paddingRight: 10 }}>
                                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{item.nombre}</div>
                                    <div style={{ color: '#64748b', fontSize: '0.8rem' }}>
                                        C$ {parseFloat(item.precio_venta).toFixed(2)} x {item.quantity}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
                                    <div style={{ fontWeight: 'bold', color: '#334155' }}>
                                        C$ {(parseFloat(item.precio_venta) * item.quantity).toFixed(2)}
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                        <QtyControl>
                                            <RoundBtn onClick={() => updateQuantity(item.id, -1)}><FaMinus size={10} /></RoundBtn>
                                            <span style={{ fontSize: '0.9rem', minWidth: 15, textAlign: 'center' }}>{item.quantity}</span>
                                            <RoundBtn onClick={() => updateQuantity(item.id, 1)}><FaPlus size={10} /></RoundBtn>
                                        </QtyControl>
                                        <button
                                            onClick={() => setCart(prev => prev.filter(p => p.id !== item.id))}
                                            style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', padding: 5 }}
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            </CartItem>
                        ))
                    )}
                </CartList>

                <div style={{ borderTop: '2px dashed #cbd5e1', paddingTop: 20, marginTop: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: 15, color: '#1e293b' }}>
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

                    {/* Botón para vaciar carrito */}
                    <ActionButton
                        bg="#dc2626"
                        onClick={() => resetCart()}
                        disabled={cart.length === 0 || loading}
                        style={{ marginTop: 5, padding: 10 }}
                    >
                        <FaTrash /> VACIAR CARRO
                    </ActionButton>
                </div>
            </RightPanel>

            {/* 5. RENDERING CONDICIONAL DEL MODAL DE PROFORMA - Usa el nuevo componente */}
            {isProformaModalOpen && proformaDetails && (
                <ProformaEmpleadoModal
                    {...proformaDetails}
                    onClose={() => setIsProformaModalOpen(false)}
                    setTicketData={handleSetTicketData}
                    currentUser={user}
                    client={proformaDetails.client}
                />
            )}

            {/* MODAL DE VISTA DE IMAGEN (NUEVO) */}
            <AnimatePresence>
                {viewImage.isOpen && (
                    <ImageViewModal
                        isOpen={viewImage.isOpen}
                        imageSrc={viewImage.imageUrl}
                        onClose={() => setViewImage({ isOpen: false, imageUrl: null })}
                    />
                )}
            </AnimatePresence>

        </Container>
    );
};

export default ProformaGenerator;
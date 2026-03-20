// client/src/pages/pos/components/ProductPanel.jsx
import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { FaStore, FaExclamationTriangle, FaTags, FaBarcode, FaFont, FaImage, FaEye, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_URL, fetchProductImage, getCachedImage, setCachedImage } from '../../../service/api';
import { rankItems } from '../../../utils/searchEngine';
import * as S from '../POS.styles.jsx';

const PRODUCTS_PER_PAGE = 100;

const fmt = (n) =>
  Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Pre-carga imágenes en paralelo con límite de concurrencia
async function preloadImages(productIds, concurrency = 4) {
  const token = localStorage.getItem('token');
  const queue = productIds.filter(id => {
    const c = getCachedImage(id);
    return !c || (c !== 'loading' && c !== 'none'); // Solo los que no estén cargados o en proceso
  });

  let i = 0;
  async function next() {
    if (i >= queue.length) return;
    const id = queue[i++];
    if (getCachedImage(id)) return next(); // Ya en caché, saltar
    setCachedImage(id, 'loading');
    try {
      const data = await fetchProductImage(id, token);
      const img = data?.imagen || null;
      setCachedImage(id, img || 'none');
    } catch {
      setCachedImage(id, 'none');
    }
    return next();
  }
  // Lanzar N workers concurrentes
  await Promise.all(Array.from({ length: concurrency }, next));
}

// Hook: carga la imagen cuando la tarjeta entra en el viewport
function useLazyPOSImage(productId) {
  const [imgSrc, setImgSrc] = useState(() => {
    const cached = getCachedImage(productId);
    return (cached && cached !== 'loading' && cached !== 'none') ? cached : null;
  });
  const cardRef = useRef(null);

  const fetchImage = useCallback(async () => {
    if (!productId) return;
    const cached = getCachedImage(productId);
    if (cached === 'loading' || cached === 'none') return;
    if (cached && cached !== 'loading') { setImgSrc(cached); return; }

    setCachedImage(productId, 'loading');
    try {
      const token = localStorage.getItem('token');
      const data = await fetchProductImage(productId, token);
      const img = data?.imagen || null;
      setCachedImage(productId, img || 'none');
      if (img) setImgSrc(img);
      else setImgSrc(null); // Asegurar que se limpie si ahora no tiene imagen
    } catch {
      setCachedImage(productId, 'none');
      setImgSrc(null);
    }
  }, [productId]);

  useEffect(() => {
    // Si ya está en caché, mostrar de inmediato
    const cached = getCachedImage(productId);
    if (cached && cached !== 'loading') {
        setImgSrc(cached !== 'none' ? cached : null);
        // Si ya está en caché, no necesitamos el observer ni el interval
        return;
    }

    // Escuchar cuando el caché se llena (para los pre-cargados)
    const checkInterval = setInterval(() => {
      const c = getCachedImage(productId);
      if (c && c !== 'loading') {
          setImgSrc(c !== 'none' ? c : null);
          clearInterval(checkInterval);
      }
    }, 200);

    // También usar IntersectionObserver como fallback
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) { fetchImage(); } },
      { rootMargin: '200px' } // Cargar 200px antes de entrar a pantalla
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => { observer.disconnect(); clearInterval(checkInterval); };
  }, [productId, fetchImage]);

  return { imgSrc, cardRef };
}

// Componente de imagen lazy para el POS
function LazyPOSImage({ productId, productName, onView }) {
  const { imgSrc, cardRef } = useLazyPOSImage(productId);
  return (
    <div
      ref={cardRef}
      className="image-placeholder"
      style={{ position: 'relative', height: 160, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #f1f5f9', overflow: 'hidden' }}
    >
      {imgSrc && (
        <div
          className="eye-icon"
          onClick={(e) => { e.stopPropagation(); onView(imgSrc); }}
          style={{
            position: 'absolute', top: 10, left: 10, zIndex: 20,
            background: 'white', borderRadius: '50%', width: 32, height: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)', cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
          title="Ver imagen"
        >
          <FaEye size={14} color="#64748b" />
        </div>
      )}
      {imgSrc ? (
        <img src={imgSrc} alt={productName} loading="lazy" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
      ) : (
        <FaImage className="no-image-icon" size={40} color="#e2e8f0" />
      )}
    </div>
  );
}

const FilterButton = styled.button`
  display: flex; align-items: center; justify-content: center;
  width: 42px; height: 42px;
  border: 1px solid ${props => props.$active ? '#3b82f6' : '#cbd5e1'};
  background-color: ${props => props.$active ? '#eff6ff' : '#fff'};
  color: ${props => props.$active ? '#3b82f6' : '#64748b'};
  border-radius: 8px; cursor: pointer; transition: all 0.2s;

  &:hover { border-color: #3b82f6; color: #3b82f6; }
`;

const ImageViewModal = ({ isOpen, imageSrc, onClose }) => {
  if (!isOpen || !imageSrc) return null;
  return (
    <S.ModalOverlay onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'relative', maxWidth: '95%', maxHeight: '90vh' }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: -15, right: -15,
            background: 'white', width: 32, height: 32, borderRadius: '50%',
            border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10, color: '#ef4444'
          }}
        >
          <FaTimes />
        </button>
        <img
          src={imageSrc}
          alt="Vista Ampliada"
          style={{ maxWidth: '100%', maxHeight: '85vh', borderRadius: '12px', boxShadow: '0 20px 25px rgba(0,0,0,0.2)', background: 'white', objectFit: 'contain' }}
        />
      </motion.div>
    </S.ModalOverlay >
  );
};

export default function ProductPanel({
  products = [],
  searchTerm,
  setSearchTerm,
  onProductClick,
  cartItems = [],
  reservedStock,
  inputRef,
  searchType = 'description',
  setSearchType = () => { },
  isWholesale = false // NEW PROP
}) {
  const [viewImage, setViewImage] = useState({ isOpen: false, imageUrl: null });

  // ... (keep existing logic unchanged until rendering) ...

  // To avoid rewriting the entire file for just the render map, I will target the map function specifically if possible, 
  // but since I'm in replace_file_content for a chunk, I have to be careful.
  // Actually, let's just make the prop available and I'll do a second replace for the render logic if it's too far down.
  // The user instruction says "Update ProductPanel to support isWholesale mode".
  // I will do it in two steps or find a way to do it in one if the block is small enough.
  // The map function is lines 154-218.
  // The props are lines 57-67.
  // They are far apart. I should use multi_replace.



  // Calcular stock disponible
  const qtyInCart = useMemo(() => {
    const map = new Map();
    for (const it of cartItems) {
      // Usar id_producto para normalización
      const id = it.id_producto || it.id;
      map.set(id, (map.get(id) || 0) + Number(it.quantity || 0));
    }
    return map;
  }, [cartItems]);

  const filteredProducts = useMemo(() => {
    const isCodeSearch = searchType === 'code';
    
    // Usamos el nuevo motor de búsqueda rankItems
    const ranked = rankItems(products, searchTerm, ['nombre', 'codigo', 'descripcion'], {
      strict: isCodeSearch // En modo código, usamos búsqueda estricta/exacta
    });

    return ranked.slice(0, 100); // Límite visual
  }, [products, searchTerm, searchType]);

  // ★ PRE-CARGA INMEDIATA: carga TODOS los productos visibles (hasta 100) en paralelo
  useEffect(() => {
    const ids = filteredProducts.map(p => p.id_producto || p.id);
    preloadImages(ids, 6); // 6 peticiones simultáneas para los visibles
  }, [filteredProducts]);

  // ★ PRECARGA GLOBAL EN SEGUNDO PLANO: carga TODO el catálogo silenciosamente
  // para que cuando el usuario busque, las imágenes ya estén en caché.
  useEffect(() => {
    if (!products.length) return;
    // Pequeño delay para no competir con los productos visibles
    const timer = setTimeout(() => {
      const allIds = products.map(p => p.id_producto || p.id);
      preloadImages(allIds, 2); // Solo 2 en paralelo para no saturar el servidor
    }, 1500); // Esperar 1.5s para que los visibles carguen primero
    return () => clearTimeout(timer);
  }, [products]); // Solo se dispara cuando cambia el catálogo


  const totalResults = useMemo(() => {
    const term = (searchTerm || '').toLowerCase().trim();
    if (!term) return products.length;
    return products.filter(p => {
      const nombre = (p.nombre || '').toLowerCase();
      const codigo = String(p.codigo || '').toLowerCase();
      return nombre.includes(term) || codigo.includes(term);
    }).length;
  }, [products, searchTerm]);

  return (
    <S.MainPanel>
      {/* Barra de Búsqueda */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', alignItems: 'center' }}>
        <S.SearchInput
          ref={inputRef}
          placeholder={searchType === 'code' ? "Escribe código..." : "Buscar producto..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const term = (searchTerm || '').trim().toLowerCase();
              if (!term) return;

              // 1. Exact Code Match (Highest Priority)
              const exactMatch = products.find(p =>
                String(p.codigo || '').toLowerCase() === term ||
                String(p.codigo_barras || '').toLowerCase() === term
              );

              if (exactMatch) {
                onProductClick(exactMatch);
                setSearchTerm('');
                return;
              }

              // 2. Single Filtered Result
              if (filteredProducts.length === 1) {
                onProductClick(filteredProducts[0]);
                setSearchTerm('');
              }
            }
          }}
        />

        <FilterButton
          $active={searchType === 'description'}
          onClick={() => { setSearchType('description'); inputRef.current?.focus(); }}
          title="Buscar por Nombre"
        >
          <FaFont size={16} />
        </FilterButton>

        <FilterButton
          $active={searchType === 'code'}
          onClick={() => { setSearchType('code'); inputRef.current?.focus(); }}
          title="Buscar por Código"
        >
          <FaBarcode size={18} />
        </FilterButton>
      </div>

      {/* Grid de Productos */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', padding: '0 4px', fontSize: '0.85rem', color: '#64748b' }}>
        <span><FaStore color="#3b82f6" /> {filteredProducts.length} mostrados</span>
        <span>Total: {totalResults}</span>
      </div>

      <S.ProductGrid>
        <AnimatePresence>
          {filteredProducts.map((p, index) => {
            const pid = p.id_producto || p.id;
            const enCarrito = qtyInCart.get(pid) || 0;
            const enOtrosTickets = reservedStock?.get(pid) || 0;
            const restante = Math.max(0, Number(p.existencia || 0) - enCarrito - enOtrosTickets);
            const agotado = restante <= 0;

            return (
              <S.ProductCard
                as={motion.div}
                key={pid}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }} // Una animación cortita y limpia
                whileHover={!agotado ? { scale: 1.02, y: -4 } : {}}
                whileTap={!agotado ? { scale: 0.96 } : {}}
                onClick={() => !agotado && onProductClick(p)}
                outOfStock={agotado}
                title={p.nombre}
              >
                <S.StockBadge lowstock={restante < 5 && !agotado} outOfStock={agotado}>
                  {agotado ? 'Agotado' : `Stock: ${restante}`}
                </S.StockBadge>

                <LazyPOSImage
                  productId={pid}
                  productName={p.nombre}
                  onView={(imgSrc) => setViewImage({ isOpen: true, imageUrl: imgSrc })}
                />

                <div className="info" style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div className="product-name" style={{
                    fontWeight: 600, fontSize: '0.88rem', color: '#1e293b',
                    lineHeight: '1.25', height: '3.8rem', overflow: 'hidden',
                    display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical'
                  }}>
                    {p.nombre}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}>
                    {p.codigo || 'S/C'}
                  </div>

                  {/* LOGICA DE PRECIOS ADAPTATIVA */}
                  {isWholesale ? (
                    // MODO MAYORISTA
                    <>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: 'auto', marginBottom: '1px', textDecoration: 'line-through' }}>
                        Tienda: C$ {fmt(p.precio_venta || p.precio)}
                      </div>
                      <div className="price" style={{ fontWeight: 800, color: '#8b5cf6', fontSize: '1.1rem' }}>
                        C$ {fmt(p.mayorista || p.mayoreo || p.distribuidor || p.taller || p.precio_venta)}
                      </div>
                    </>
                  ) : (
                    // MODO NORMAL (Minoreo)
                    <>
                      {(Number(p.mayorista) > 0 || Number(p.mayoreo) > 0 || Number(p.distribuidor) > 0 || Number(p.taller) > 0) && (
                        <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: 'auto', marginBottom: '1px' }}>
                          <FaTags size={10} /> May: C$ {fmt(p.mayorista || p.mayoreo || p.distribuidor || p.taller)}
                        </div>
                      )}
                      <div className="price" style={{ fontWeight: 800, color: '#2563eb', fontSize: '1.05rem', marginTop: !((Number(p.mayorista) > 0 || Number(p.mayoreo) > 0 || Number(p.distribuidor) > 0 || Number(p.taller) > 0)) ? 'auto' : 0 }}>
                        C$ {fmt(p.precio_venta || p.precio)}
                      </div>
                    </>
                  )}
                </div>
              </S.ProductCard>
            );
          })}
        </AnimatePresence>
      </S.ProductGrid>

      <AnimatePresence>
        {viewImage.isOpen && (
          <ImageViewModal
            isOpen={true}
            imageSrc={viewImage.imageUrl}
            onClose={() => setViewImage({ isOpen: false, imageUrl: null })}
          />
        )}
      </AnimatePresence>
    </S.MainPanel>
  );
}
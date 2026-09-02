// client/src/pages/pos/components/ProductPanel.jsx
import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { FaStore, FaTags, FaBarcode, FaFont, FaImage, FaEye, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchProductImage, getCachedImage, setCachedImage } from '../../../service/api';
import { rankItems } from '../../../utils/searchEngine';
import { useAuth } from '../../../context/AuthContext';
import * as S from '../POS.styles.jsx';

const fmt = (n) =>
  Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Pre-carga imágenes en paralelo con límite de concurrencia
async function preloadImages(productIds, concurrency = 4) {
  const token = localStorage.getItem('token');
  const queue = productIds.filter(id => {
    const c = getCachedImage(id);
    return !c || (c !== 'loading' && c !== 'none');
  });

  let i = 0;
  async function next() {
    if (i >= queue.length) return;
    const id = queue[i++];
    if (getCachedImage(id)) return next();
    setCachedImage(id, 'loading');
    try {
      const data = await fetchProductImage(id, token);
      const img = data?.imagen || null;
      setCachedImage(id, img || 'none');
      window.dispatchEvent(new CustomEvent(`pos_img_loaded_${id}`, { detail: img || 'none' }));
    } catch {
      setCachedImage(id, 'none');
      window.dispatchEvent(new CustomEvent(`pos_img_loaded_${id}`, { detail: 'none' }));
    }
    return next();
  }
  await Promise.all(Array.from({ length: concurrency }, next));
}

// Hook: carga la imagen cuando la tarjeta entra en el viewport de forma reactiva y sin bugs
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
    if (cached && cached !== 'loading') {
      setImgSrc(cached);
      return;
    }

    setCachedImage(productId, 'loading');
    try {
      const token = localStorage.getItem('token');
      const data = await fetchProductImage(productId, token);
      const img = data?.imagen || null;
      setCachedImage(productId, img || 'none');
      setImgSrc(img || null);
      window.dispatchEvent(new CustomEvent(`pos_img_loaded_${productId}`, { detail: img || 'none' }));
    } catch {
      setCachedImage(productId, 'none');
      setImgSrc(null);
      window.dispatchEvent(new CustomEvent(`pos_img_loaded_${productId}`, { detail: 'none' }));
    }
  }, [productId]);

  useEffect(() => {
    const cached = getCachedImage(productId);
    if (cached && cached !== 'loading') {
      setImgSrc(cached !== 'none' ? cached : null);
      return;
    }

    const handleLoaded = (e) => {
      const img = e.detail;
      setImgSrc(img && img !== 'none' ? img : null);
    };

    window.addEventListener(`pos_img_loaded_${productId}`, handleLoaded);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchImage();
        }
      },
      { rootMargin: '250px' }
    );

    if (cardRef.current) observer.observe(cardRef.current);

    return () => {
      observer.disconnect();
      window.removeEventListener(`pos_img_loaded_${productId}`, handleLoaded);
    };
  }, [productId, fetchImage]);

  return { imgSrc, cardRef };
}

// Componente de imagen lazy para el POS con transición suave
function LazyPOSImage({ productId, productName, onView }) {
  const { imgSrc, cardRef } = useLazyPOSImage(productId);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [imgSrc]);

  return (
    <div
      ref={cardRef}
      className="image-placeholder"
      style={{
        position: 'relative',
        height: 150,
        background: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid #f1f5f9',
        overflow: 'hidden'
      }}
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
          title="Ver imagen ampliada"
        >
          <FaEye size={14} color="#64748b" />
        </div>
      )}
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={productName}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            padding: '6px',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.2s ease-in-out'
          }}
        />
      ) : (
        <FaImage className="no-image-icon" size={38} color="#cbd5e1" style={{ opacity: 0.5 }} />
      )}
    </div>
  );
}

const ShimmerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 12px;
  width: 100%;
`;

const ShimmerItem = styled.div`
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  height: 240px;
  position: relative;
  overflow: hidden;

  &::after {
    position: absolute;
    top: 0; right: 0; bottom: 0; left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(
      90deg,
      rgba(241, 245, 249, 0) 0,
      rgba(241, 245, 249, 0.8) 50%,
      rgba(241, 245, 249, 0) 100%
    );
    animation: shimmerAnim 1.4s infinite;
    content: '';
  }

  @keyframes shimmerAnim {
    100% {
      transform: translateX(100%);
    }
  }
`;

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
    </S.ModalOverlay>
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
  isWholesale = false
}) {
  const { globalReservations, user } = useAuth();
  const currentUserId = user?.id_usuario || user?.id;
  const [viewImage, setViewImage] = useState({ isOpen: false, imageUrl: null });

  // Calcular items en el ticket actual
  const qtyInCart = useMemo(() => {
    const map = new Map();
    for (const it of cartItems) {
      const id = it.id_producto || it.id;
      map.set(id, (map.get(id) || 0) + Number(it.quantity || 0));
    }
    return map;
  }, [cartItems]);

  const filteredProducts = useMemo(() => {
    const isCodeSearch = searchType === 'code';
    const ranked = rankItems(products, searchTerm, ['nombre', 'codigo', 'descripcion'], {
      strict: isCodeSearch
    });
    return ranked.slice(0, 100);
  }, [products, searchTerm, searchType]);

  // Pre-carga inmediata de imágenes visibles
  useEffect(() => {
    const ids = filteredProducts.map(p => p.id_producto || p.id);
    preloadImages(ids, 6);
  }, [filteredProducts]);

  // Precarga silenciosa en segundo plano del catálogo completo
  useEffect(() => {
    if (!products.length) return;
    const timer = setTimeout(() => {
      const allIds = products.map(p => p.id_producto || p.id);
      preloadImages(allIds, 2);
    }, 1500);
    return () => clearTimeout(timer);
  }, [products]);

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
          placeholder={searchType === 'code' ? "Escribe código..." : "Buscar producto por nombre o código..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const term = (searchTerm || '').trim().toLowerCase();
              if (!term) return;

              const exactMatch = products.find(p =>
                String(p.codigo || '').toLowerCase() === term ||
                String(p.codigo_barras || '').toLowerCase() === term
              );

              if (exactMatch) {
                onProductClick(exactMatch);
                setSearchTerm('');
                return;
              }

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

      {/* Grid de Productos Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', padding: '0 4px', fontSize: '0.85rem', color: '#64748b' }}>
        <span><FaStore color="#3b82f6" /> {filteredProducts.length} mostrados</span>
        <span>Total: {totalResults} productos</span>
      </div>

      {products.length === 0 ? (
        <ShimmerGrid>
          {Array.from({ length: 12 }).map((_, idx) => (
            <ShimmerItem key={idx} />
          ))}
        </ShimmerGrid>
      ) : filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3.5rem', color: '#94a3b8', background: 'white', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
          <FaStore style={{ fontSize: '2.5rem', marginBottom: '0.75rem', opacity: 0.3 }} />
          <h4 style={{ color: '#64748b', margin: '0 0 0.25rem 0' }}>No se encontraron productos</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>Prueba con otro término de búsqueda o código.</p>
        </div>
      ) : (
        <S.ProductGrid>
          {filteredProducts.map((p) => {
            const pid = p.id_producto || p.id;
            const enCarrito = qtyInCart.get(pid) || 0;
            const enOtrosTicketsLocales = reservedStock?.get(pid) || 0;

            // Reservas de otros usuarios / terminales en tiempo real
            const totalGlobalReservado = Number(globalReservations?.totalByProduct?.[pid] || 0);
            const miGlobalReservado = Number(globalReservations?.userReservations?.[currentUserId]?.[pid] || 0);
            const enOtrasCajas = Math.max(0, totalGlobalReservado - miGlobalReservado);

            const totalComprometido = enCarrito + enOtrosTicketsLocales + enOtrasCajas;
            const restante = Math.max(0, Number(p.existencia || 0) - totalComprometido);
            const agotado = restante <= 0;

            return (
              <S.ProductCard
                key={pid}
                onClick={() => !agotado && onProductClick(p)}
                outOfStock={agotado}
                title={p.nombre}
                style={{
                  cursor: agotado ? 'not-allowed' : 'pointer',
                  opacity: agotado ? 0.6 : 1,
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease'
                }}
              >
                <S.StockBadge
                  lowstock={restante < 5 && !agotado}
                  outOfStock={agotado}
                  style={{
                    background: agotado
                      ? '#ef4444'
                      : restante < 5
                      ? '#f59e0b'
                      : '#10b981'
                  }}
                >
                  {agotado
                    ? (enCarrito > 0 ? 'En Carrito' : enOtrasCajas > 0 ? 'En Otra Caja' : 'Agotado')
                    : `Stock: ${restante}`}
                </S.StockBadge>

                <LazyPOSImage
                  productId={pid}
                  productName={p.nombre}
                  onView={(imgSrc) => setViewImage({ isOpen: true, imageUrl: imgSrc })}
                />

                <div className="info" style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div
                    className="product-name"
                    style={{
                      fontWeight: 600,
                      fontSize: '0.88rem',
                      color: '#1e293b',
                      lineHeight: '1.25',
                      height: '3.8rem',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {p.nombre}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}>
                    {p.codigo || 'S/C'}
                  </div>

                  {isWholesale ? (
                    <>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: 'auto', marginBottom: '1px', textDecoration: 'line-through' }}>
                        Tienda: C$ {fmt(p.precio_venta || p.precio)}
                      </div>
                      <div className="price" style={{ fontWeight: 800, color: '#8b5cf6', fontSize: '1.1rem' }}>
                        C$ {fmt(p.mayorista || p.mayoreo || p.distribuidor || p.taller || p.precio_venta)}
                      </div>
                    </>
                  ) : (
                    <>
                      {(Number(p.mayorista) > 0 || Number(p.mayoreo) > 0 || Number(p.distribuidor) > 0 || Number(p.taller) > 0) && (
                        <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: 'auto', marginBottom: '1px' }}>
                          <FaTags size={10} /> May: C$ {fmt(p.mayorista || p.mayoreo || p.distribuidor || p.taller)}
                        </div>
                      )}
                      <div
                        className="price"
                        style={{
                          fontWeight: 800,
                          color: '#2563eb',
                          fontSize: '1.05rem',
                          marginTop: !((Number(p.mayorista) > 0 || Number(p.mayoreo) > 0 || Number(p.distribuidor) > 0 || Number(p.taller) > 0)) ? 'auto' : 0
                        }}
                      >
                        C$ {fmt(p.precio_venta || p.precio)}
                      </div>
                    </>
                  )}
                </div>
            </S.ProductCard>
          );
        })}
      </S.ProductGrid>
      )}

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
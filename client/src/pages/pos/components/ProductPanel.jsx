import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { FaStore, FaExclamationTriangle, FaTags, FaBarcode, FaFont, FaImage, FaEye, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import * as S from '../POS.styles.jsx';

const PRODUCTS_PER_PAGE = 100;

const fmt = (n) =>
  Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Botón de filtro local refinado
const FilterButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  border: 1px solid ${props => props.$active ? '#3b82f6' : '#cbd5e1'};
  background-color: ${props => props.$active ? '#eff6ff' : '#fff'};
  color: ${props => props.$active ? '#3b82f6' : '#64748b'};
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.2s ease;
  box-shadow: ${props => props.$active ? '0 4px 6px -1px rgba(59,130,246,0.2)' : 'none'};

  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
    background-color: #f8fafc;
  }
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
        style={{ position: 'relative', maxWidth: '95%', maxHeight: '90vh', background: 'transparent' }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: -15, right: -15,
            background: 'white', width: 32, height: 32, borderRadius: '50%',
            border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10, color: '#ef4444', fontSize: '1.2rem'
          }}
        >
          <FaTimes />
        </button>
        <img
          src={imageSrc}
          alt="Vista Ampliada"
          style={{
            maxWidth: '100%',
            maxHeight: '85vh',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
            display: 'block',
            objectFit: 'contain',
            background: 'white'
          }}
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
  inputRef,
  searchType = 'description',
  setSearchType = () => { }
}) {
  const [viewImage, setViewImage] = useState({ isOpen: false, imageUrl: null });

  // Calcular stock en tiempo real restando lo que está en carrito
  const qtyInCart = useMemo(() => {
    const map = new Map();
    for (const it of cartItems) {
      map.set(it.id, (map.get(it.id) || 0) + Number(it.quantity || 0));
    }
    return map;
  }, [cartItems]);

  const filteredProducts = useMemo(() => {
    const term = (searchTerm || '').toLowerCase().trim();

    if (!term) return products.slice(0, PRODUCTS_PER_PAGE);
    if (searchType === 'description' && term.length < 3) return products.slice(0, PRODUCTS_PER_PAGE);

    const results = products.filter(p => {
      if (searchType === 'code') {
        const codigo = String(p.codigo || '').toLowerCase();
        const barras = String(p.codigo_barras || '').toLowerCase();
        return codigo.startsWith(term) || barras.startsWith(term);
      } else {
        const nombre = (p.nombre || '').toLowerCase();
        const desc = (p.descripcion || '').toLowerCase();
        return nombre.includes(term) || desc.includes(term);
      }
    });

    return results.slice(0, 500);
  }, [products, searchTerm, searchType]);

  const totalResults = useMemo(() => {
    const term = (searchTerm || '').toLowerCase().trim();
    if (!term) return products.length;
    if (products.length > 5000 && term.length < 3) return products.length;

    return products.filter(p => {
      if (searchType === 'code') {
        const c = String(p.codigo || '').toLowerCase();
        const b = String(p.codigo_barras || '').toLowerCase();
        return c.startsWith(term) || b.startsWith(term);
      }
      return (p.nombre || '').toLowerCase().includes(term);
    }).length;
  }, [products, searchTerm, searchType]);

  return (
    <S.MainPanel>
      {/* Barra de Búsqueda */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '1.25rem', alignItems: 'center' }}>
        <S.SearchInput
          ref={inputRef}
          style={{ flex: 1, padding: '12px 18px' }}
          placeholder={searchType === 'code' ? "Escanea o escribe código..." : "Buscar producto..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
      <div style={{ flex: 1, overflowY: 'hidden', display: 'flex', flexDirection: 'column' }}>

        {/* Header conteo */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', color: '#64748b', padding: '0 4px' }}>
          <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, color: '#334155' }}>
            <FaStore color="#3b82f6" /> {filteredProducts.length} productos mostrados
          </h4>
          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Total: {totalResults}</span>
        </div>

        {/* Alerta de búsqueda corta */}
        {(searchTerm.length < 3 && searchType === 'description' && totalResults > PRODUCTS_PER_PAGE) && (
          <S.InfoBox>
            <FaExclamationTriangle />
            Escribe 3+ letras para filtrar mejor.
          </S.InfoBox>
        )}

        <S.ProductGrid>
          {filteredProducts.map(p => {
            const enCarrito = qtyInCart.get(p.id) || 0;
            const restante = Math.max(0, Number(p.existencia || 0) - enCarrito);
            const agotado = restante <= 0;

            return (
              <S.ProductCard
                key={p.id}
                onClick={() => !agotado && onProductClick(p)}
                outOfStock={agotado}
                title={p.nombre}
              >
                {/* Badge de Stock */}
                <S.StockBadge lowstock={restante < 5 && !agotado} outOfStock={agotado}>
                  {agotado ? 'Agotado' : `Stock: ${restante}`}
                </S.StockBadge>

                {/* Botón Ver Imagen (Oculto si no hay imagen) */}
                {p.imagen && (
                  <div
                    className="eye-icon"
                    onClick={(e) => { e.stopPropagation(); setViewImage({ isOpen: true, imageUrl: p.imagen }); }}
                    title="Ver imagen grande"
                  >
                    <FaEye size={14} />
                  </div>
                )}

                <div className="image-placeholder">
                  {p.imagen ? (
                    <img src={p.imagen} alt={p.nombre} loading="lazy" />
                  ) : (
                    <FaImage className="no-image-icon" />
                  )}
                </div>

                <div className="info">
                  <div className="product-name">
                    {p.nombre}
                  </div>

                  <div className="price">C$ {fmt(p.precio_venta || p.precio)}</div>

                  {searchType === 'code' && (
                    <small style={{ display: 'block', color: '#64748b', fontSize: '0.75rem', marginTop: '2px', fontFamily: 'monospace' }}>
                      {p.codigo || p.codigo_barras || 'S/C'}
                    </small>
                  )}
                </div>
              </S.ProductCard>
            );
          })}

          {filteredProducts.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: '60px 20px', textAlign: 'center', color: '#94a3b8' }}>
              <FaStore size={48} style={{ opacity: 0.1, marginBottom: 15 }} />
              <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>No hay resultados para tu búsqueda.</p>
            </div>
          )}
        </S.ProductGrid>
      </div>

      <AnimatePresence>
        {viewImage.isOpen && (
          <ImageViewModal
            isOpen={viewImage.isOpen}
            imageSrc={viewImage.imageUrl}
            onClose={() => setViewImage({ isOpen: false, imageUrl: null })}
          />
        )}
      </AnimatePresence>
    </S.MainPanel>
  );
}
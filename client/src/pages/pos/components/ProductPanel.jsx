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
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.2s ease;
  box-shadow: ${props => props.$active ? '0 2px 4px rgba(59,130,246,0.2)' : 'none'};

  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
    background-color: #f8fafc;
  }
`;

const ImageViewModal = ({ isOpen, imageSrc, onClose }) => {
  if (!isOpen || !imageSrc) return null;
  return (
    <S.ModalOverlay onClick={onClose} style={{ zIndex: 11000, backdropFilter: 'blur(5px)' }}>
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
            borderRadius: '12px',
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

    // 1. Sin búsqueda: mostrar primeros N
    if (!term) return products.slice(0, PRODUCTS_PER_PAGE);

    // 2. Búsqueda por Nombre: requiere 3 caracteres
    if (searchType === 'description' && term.length < 3) return products.slice(0, PRODUCTS_PER_PAGE);

    // 3. Filtrado
    const results = products.filter(p => {
      if (searchType === 'code') {
        const codigo = String(p.codigo || '').toLowerCase();
        const barras = String(p.codigo_barras || '').toLowerCase();
        // Coincidencia exacta o inicio para rapidez
        return codigo.startsWith(term) || barras.startsWith(term);
      } else {
        const nombre = (p.nombre || '').toLowerCase();
        const desc = (p.descripcion || '').toLowerCase();
        return nombre.includes(term) || desc.includes(term);
      }
    });

    return results.slice(0, 500); // Límite de seguridad
  }, [products, searchTerm, searchType]);

  const totalResults = useMemo(() => {
    const term = (searchTerm || '').toLowerCase().trim();
    if (!term) return products.length;
    // Cálculo rápido aproximado si son muchos productos
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
      {/* Barra de Búsqueda y Filtros */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', alignItems: 'center' }}>
        <S.SearchInput
          ref={inputRef}
          style={{ marginBottom: 0, flex: 1, height: '45px' }}
          placeholder={searchType === 'code' ? "Escanea o escribe código..." : "Buscar producto..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <FilterButton
          $active={searchType === 'description'}
          onClick={() => { setSearchType('description'); inputRef.current?.focus(); }}
          title="Buscar por Nombre (ABC)"
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

      {/* Grid de Productos con Scroll */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '5px', display: 'flex', flexDirection: 'column' }}>

        {/* Header conteo */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', color: '#64748b' }}>
          <h4 style={{ margin: 0, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 6 }}>
            <FaStore /> Catálogo ({filteredProducts.length} vis.)
          </h4>
          <span style={{ fontSize: '0.8rem' }}>Total: {totalResults}</span>
        </div>

        {/* Alerta de búsqueda corta */}
        {(searchTerm.length < 3 && searchType === 'description' && totalResults > PRODUCTS_PER_PAGE) && (
          <S.InfoBox style={{ marginBottom: '1rem', padding: '8px 12px', fontSize: '0.85rem' }}>
            <FaExclamationTriangle style={{ marginRight: '6px' }} />
            Mostrando primeros {PRODUCTS_PER_PAGE}. Escribe más para filtrar.
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
                style={{ opacity: agotado ? 0.6 : 1 }}
              >
                {/* Badge de Stock */}
                <S.StockBadge lowstock={restante < 5 && !agotado} outOfStock={agotado}>
                  {agotado ? '0' : restante}
                </S.StockBadge>

                {/* Botón Ver Imagen (Oculto si no hay imagen) */}
                {p.imagen && (
                  <div
                    className="eye-icon"
                    onClick={(e) => { e.stopPropagation(); setViewImage({ isOpen: true, imageUrl: p.imagen }); }}
                    style={{
                      position: 'absolute', top: 5, left: 5, zIndex: 5,
                      background: 'rgba(255,255,255,0.85)', borderRadius: '50%',
                      width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      color: '#334155', transition: 'transform 0.2s'
                    }}
                    title="Ver imagen grande"
                  >
                    <FaEye size={12} />
                  </div>
                )}

                <div className="image-placeholder">
                  {p.imagen ? (
                    <img src={p.imagen} alt={p.nombre} loading="lazy" />
                  ) : (
                    <FaImage className="no-image-icon" size={24} style={{ opacity: 0.3 }} />
                  )}
                </div>

                <div className="info">
                  <div className="product-name" style={{ fontWeight: '500', lineHeight: '1.2', maxHeight: '40px', overflow: 'hidden', fontSize: '0.9rem', marginBottom: '4px' }}>
                    {p.nombre}
                  </div>

                  <div className="price">C$ {fmt(p.precio_venta || p.precio)}</div>

                  {searchType === 'code' && (
                    <small style={{ display: 'block', color: '#64748b', fontSize: '0.75rem', marginTop: '2px' }}>
                      <FaBarcode style={{ marginRight: 3, verticalAlign: 'text-bottom' }} />
                      {p.codigo || p.codigo_barras || 'S/Código'}
                    </small>
                  )}

                  {p.raw?.mayoreo > 0 && (
                    <div style={{ color: '#2563eb', fontSize: '0.75rem', marginTop: '2px', display: 'flex', alignItems: 'center', gap: 2 }}>
                      <FaTags size={10} /> May: C${fmt(p.raw.mayoreo)}
                    </div>
                  )}
                </div>
              </S.ProductCard>
            );
          })}

          {filteredProducts.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: '30px', textAlign: 'center', color: '#94a3b8' }}>
              <p>No se encontraron productos para "{searchTerm}"</p>
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
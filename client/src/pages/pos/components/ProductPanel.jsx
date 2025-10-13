// src/pages/pos/components/ProductPanel.jsx
import React, { useMemo } from 'react';
import { FaStore, FaExclamationTriangle, FaTags } from 'react-icons/fa';
import * as S from '../POS.styles.jsx';

const PRODUCTS_PER_PAGE = 100;

export default function ProductPanel({
  products = [],
  searchTerm,
  setSearchTerm,
  onProductClick,
  cartItems = [],
  inputRef, // para que F1 enfoque este input
}) {
  // id -> cantidad en el carrito
  const qtyInCart = useMemo(() => {
    const map = new Map();
    for (const it of cartItems) {
      map.set(it.id, (map.get(it.id) || 0) + Number(it.quantity || 0));
    }
    return map;
  }, [cartItems]);

  const filteredProducts = useMemo(() => {
    const term = (searchTerm || '').toLowerCase().trim();
    if (!term || term.length < 3) {
      return products.slice(0, PRODUCTS_PER_PAGE);
    }
    const results = products.filter(p =>
      (p.nombre || '').toLowerCase().includes(term) ||
      (p.codigo || '').toLowerCase().includes(term)
    );
    return results.slice(0, 500);
  }, [products, searchTerm]);

  const totalResults = useMemo(() => {
    const term = (searchTerm || '').toLowerCase().trim();
    if (!term) return products.length;
    return products.filter(p =>
      (p.nombre || '').toLowerCase().includes(term) ||
      (p.codigo || '').toLowerCase().includes(term)
    ).length;
  }, [products, searchTerm]);

  return (
    <S.MainPanel>
      <S.SearchInput
        ref={inputRef}
        placeholder="Buscar producto (mín. 3 letras/números, F1)"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ margin: '0 0 1rem 0' }}>
          <FaStore /> Productos ({filteredProducts.length} de {totalResults})
        </h3>

        {(searchTerm.length < 3 && totalResults > PRODUCTS_PER_PAGE) && (
          <S.InfoBox style={{ marginBottom: '1rem', backgroundColor: '#fff3cd', color: '#856404', borderColor: '#ffeeba' }}>
            <FaExclamationTriangle style={{ marginRight: '5px' }} />
            Escribe <strong>3 o más caracteres</strong> para buscar en los {totalResults} productos. Mostrando los primeros {PRODUCTS_PER_PAGE}.
          </S.InfoBox>
        )}

        <S.ProductGrid>
          {filteredProducts.map(p => {
            const enCarrito = qtyInCart.get(p.id) || 0;
            const restante = Math.max(0, Number(p.existencia || 0) - enCarrito);

            return (
              <S.ProductCard
                key={p.id}
                onClick={() => restante > 0 && onProductClick(p)}
                outOfStock={restante <= 0}
                title={restante <= 0 ? 'Sin stock disponible para agregar' : ''}
              >
                <S.StockBadge
                  lowstock={restante < 10 && restante > 0}
                  outOfStock={restante <= 0}
                >
                  {restante}
                </S.StockBadge>

                <div className="image-placeholder">{(p.nombre || '').charAt(0)}</div>

                <div className="info">
                  <p>{p.nombre}</p>
                  <div className="price">C${Number(p.precio || 0).toFixed(2)}</div>
                  {p.raw?.mayoreo > 0 && (
                    <small style={{ color: '#007bff' }}>
                      <FaTags /> Mayoreo: C${Number(p.raw.mayoreo).toFixed(2)}
                    </small>
                  )}
                </div>
              </S.ProductCard>
            );
          })}

          {filteredProducts.length === 0 && searchTerm.length >= 3 && (
            <p style={{ color: '#6c757d', textAlign: 'center', gridColumn: 'span 4' }}>
              No se encontraron productos con “{searchTerm}”.
            </p>
          )}
        </S.ProductGrid>
      </div>
    </S.MainPanel>
  );
}

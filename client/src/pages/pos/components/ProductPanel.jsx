import React, { useMemo } from 'react';
import styled from 'styled-components'; // Importamos styled para los botones locales
import { FaStore, FaExclamationTriangle, FaTags, FaBarcode, FaFont } from 'react-icons/fa';
import * as S from '../POS.styles.jsx';

const PRODUCTS_PER_PAGE = 100;
const fmt = (n) =>
  Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// --- Estilo local para los botones de filtro (para no tocar POS.styles.jsx) ---
const FilterButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  border: 2px solid ${props => props.$active ? '#3b82f6' : '#e2e8f0'};
  background-color: ${props => props.$active ? '#eff6ff' : '#fff'};
  color: ${props => props.$active ? '#3b82f6' : '#94a3b8'};
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
  }
`;

export default function ProductPanel({
  products = [],
  searchTerm,
  setSearchTerm,
  onProductClick,
  cartItems = [],
  inputRef,
  // Recibimos las nuevas propiedades
  searchType = 'description',
  setSearchType = () => {} 
}) {
  
  const qtyInCart = useMemo(() => {
    const map = new Map();
    for (const it of cartItems) {
      map.set(it.id, (map.get(it.id) || 0) + Number(it.quantity || 0));
    }
    return map;
  }, [cartItems]);

  const filteredProducts = useMemo(() => {
    const term = (searchTerm || '').toLowerCase().trim();
    
    // 1. Si no hay búsqueda, mostrar los primeros N productos
    if (!term) {
      return products.slice(0, PRODUCTS_PER_PAGE);
    }

    // 2. Si es búsqueda por NOMBRE, mantenemos la restricción de 3 letras para no saturar
    //    Pero si es CÓDIGO, permitimos buscar desde 1 caracter (ej: código "5")
    if (searchType === 'description' && term.length < 3) {
       return products.slice(0, PRODUCTS_PER_PAGE);
    }

    // 3. Filtramos los productos
    const results = products.filter(p => {
      if (searchType === 'code') {
        // --- CORRECCIÓN: USAR startsWith ---
        // Validamos contra 'codigo', 'codigo_barras' o 'id'
        const codigo = String(p.codigo || '').toLowerCase();
        const barras = String(p.codigo_barras || '').toLowerCase();
        const id = String(p.id || '').toLowerCase();

        // Devuelve true si ALGUNO de los campos EMPIEZA con el término
        return codigo.startsWith(term) || barras.startsWith(term) || id.startsWith(term);
      } else {
        // Búsqueda por NOMBRE (se mantiene igual, busca en cualquier parte)
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
    
    return products.filter(p => {
        if (searchType === 'code') {
            const codigo = String(p.codigo || '').toLowerCase();
            const barras = String(p.codigo_barras || '').toLowerCase();
            const id = String(p.id || '').toLowerCase();
            return codigo.startsWith(term) || barras.startsWith(term) || id.startsWith(term);
        }
        return (p.nombre || '').toLowerCase().includes(term);
    }).length;
  }, [products, searchTerm, searchType]);

  return (
    <S.MainPanel>
      
      {/* Contenedor Flex para la barra y los botones */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
        <S.SearchInput
          ref={inputRef}
          style={{ marginBottom: 0, flex: 1 }} // Quitamos el margen inferior original y hacemos que ocupe el espacio
          placeholder={searchType === 'code' ? "Escanear o escribir código..." : "Buscar por nombre..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          // Si es código, permitimos solo números si prefieres, o texto general
          type={searchType === 'code' ? "text" : "text"}
        />

        {/* Botón para buscar por NOMBRE */}
        <FilterButton 
            $active={searchType === 'description'} 
            onClick={() => { setSearchType('description'); inputRef.current?.focus(); }}
            title="Buscar por Nombre"
        >
            <FaFont />
        </FilterButton>

        {/* Botón para buscar por CÓDIGO */}
        <FilterButton 
            $active={searchType === 'code'} 
            onClick={() => { setSearchType('code'); inputRef.current?.focus(); }}
            title="Buscar por Código"
        >
            <FaBarcode />
        </FilterButton>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ margin: '0 0 1rem 0' }}>
          <FaStore /> Productos ({filteredProducts.length} de {totalResults})
          {/* Indicador visual de modo de búsqueda */}
          <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: '#666', marginLeft: '10px' }}>
            Filtro: {searchType === 'code' ? 'Por Código (inicia con)' : 'Por Nombre'}
          </span>
        </h3>

        {(searchTerm.length < 3 && searchType === 'description' && totalResults > PRODUCTS_PER_PAGE) && (
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
                title={p.nombre}
              >
                <S.StockBadge
                  lowstock={restante < 10 && restante > 0}
                  outOfStock={restante <= 0}
                >
                  {restante}
                </S.StockBadge>

                <div className="image-placeholder">{(p.nombre || '').charAt(0)}</div>

                <div className="info">
                  <p style={{
                    margin: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>{p.nombre}</p>

                  <div className="price">C${fmt(p.precio)}</div>
                  
                  {/* Mostrar código si se busca por código para confirmar visualmente */}
                  {searchType === 'code' && (
                      <small style={{ display:'block', color:'#666', marginTop:'4px' }}>
                          <FaBarcode style={{marginRight:4}}/> 
                          {p.codigo || p.codigo_barras || 'S/C'}
                      </small>
                  )}

                  {p.raw?.mayoreo > 0 && (
                    <small style={{ color: '#007bff', display: 'block', marginTop: '2px' }}>
                      <FaTags /> Mayoreo: C${fmt(p.raw.mayoreo)}
                    </small>
                  )}
                </div>
              </S.ProductCard>
            );
          })}

          {filteredProducts.length === 0 && (searchTerm.length >= 3 || (searchType === 'code' && searchTerm.length > 0)) && (
            <p style={{ color: '#6c757d', textAlign: 'center', gridColumn: 'span 4' }}>
              No se encontraron productos con “{searchTerm}” usando el filtro de {searchType === 'code' ? 'código' : 'nombre'}.
            </p>
          )}
        </S.ProductGrid>
      </div>
    </S.MainPanel>
  );
}
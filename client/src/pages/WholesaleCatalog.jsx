import React, { useState, useMemo, useDeferredValue } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { FaArrowLeft, FaSearch, FaBoxOpen, FaTags, FaInfoCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f8fafc;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const BackButton = styled.button`
  background: #f1f5f9;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: #e2e8f0; transform: translateX(-2px); }
`;

const SearchBar = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const InputGroup = styled.div`
  position: relative;
  flex: 1;
  min-width: 250px;
  
  svg {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
  }

  input {
    width: 100%;
    padding: 12px 12px 12px 45px;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.2s;
    &:focus { border-color: #8b5cf6; }
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
`;

const ProductCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  overflow: hidden;
`;

const ProductHeader = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
`;

const Info = styled.div`
  flex: 1;
  h3 { margin: 0 0 5px 0; font-size: 1.15rem; color: #1e293b; line-height: 1.3; }
  small { color: #64748b; font-family: 'Roboto Mono', monospace; font-weight: 600; }
`;

const PriceGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  background: #f8fafc;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
`;

const PriceItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  
  label { font-size: 0.75rem; color: #64748b; font-weight: 600; text-transform: uppercase; }
  span { font-size: 1rem; font-weight: 700; color: #1e293b; }
  
  &.featured {
    span { color: #8b5cf6; }
  }
`;

const StockBadge = styled.span`
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  background: ${props => props.qty > 10 ? '#dcfce7' : '#fee2e2'};
  color: ${props => props.qty > 10 ? '#166534' : '#991b1b'};
`;

const WholesaleCatalog = () => {
    const navigate = useNavigate();
    const { products } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const deferredSearch = useDeferredValue(searchTerm);

    const filteredProducts = useMemo(() => {
        if (!products) return [];

        // Strict Filtering: Only products with at least one wholesale price configured
        const wholesaleItems = products.filter(p =>
            Number(p.mayoreo || 0) > 0 ||
            Number(p.distribuidor || 0) > 0 ||
            Number(p.taller || 0) > 0 ||
            Number(p.mayorista || 0) > 0
        );

        const q = deferredSearch.toLowerCase().trim();
        if (!q) return wholesaleItems;

        return wholesaleItems.filter(p =>
            (p.nombre || '').toLowerCase().includes(q) ||
            (p.codigo || '').toLowerCase().includes(q) ||
            (p.descripcion || '').toLowerCase().includes(q)
        );
    }, [products, deferredSearch]);

    const fmt = (n) => new Intl.NumberFormat('es-NI', { style: 'currency', currency: 'NIO', currencyDisplay: 'code' }).format(Number(n || 0)).replace('NIO', 'C$');

    return (
        <Container>
            <Header>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <BackButton onClick={() => navigate('/wholesale-menu')}>
                        <FaArrowLeft /> Volver
                    </BackButton>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <FaTags size={28} color="#8b5cf6" />
                        <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#1e293b' }}>Catálogo Mayorista</h1>
                    </div>
                </div>
            </Header>

            <SearchBar>
                <InputGroup>
                    <FaSearch />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, código o descripción..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </InputGroup>
            </SearchBar>

            {filteredProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '5rem', background: 'white', borderRadius: '16px', color: '#64748b' }}>
                    <FaBoxOpen size={64} style={{ marginBottom: '1.5rem', opacity: 0.3 }} />
                    <h3>No se encontraron productos con precios mayoristas</h3>
                    <p>Configura los precios en el inventario general para que aparezcan aquí.</p>
                </div>
            ) : (
                <Grid>
                    <AnimatePresence>
                        {filteredProducts.map(p => (
                            <ProductCard
                                key={p.id_producto || p.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                <StockBadge qty={p.existencia}>
                                    Stock: {p.existencia}
                                </StockBadge>

                                <ProductHeader>
                                    <Info>
                                        <small>{p.codigo || 'S/C'}</small>
                                        <h3>{p.nombre}</h3>
                                        <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', color: '#64748b' }}>{p.descripcion}</p>
                                    </Info>
                                </ProductHeader>

                                <PriceGrid>
                                    <PriceItem>
                                        <label>Precio Tienda</label>
                                        <span>{fmt(p.venta || 0)}</span>
                                    </PriceItem>
                                    <PriceItem className="featured">
                                        <label>Nivel 2 (Mayoreo)</label>
                                        <span>{fmt(p.mayoreo || 0)}</span>
                                    </PriceItem>
                                    <PriceItem className="featured">
                                        <label>Nivel 3 (Dist.)</label>
                                        <span>{fmt(p.distribuidor || 0)}</span>
                                    </PriceItem>
                                    <PriceItem className="featured">
                                        <label>Especial</label>
                                        <span>{fmt(p.mayorista || 0)}</span>
                                    </PriceItem>
                                </PriceGrid>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#94a3b8', marginTop: 'auto' }}>
                                    <FaInfoCircle />
                                    <span>Precios sujetos a cambios según promociones activas.</span>
                                </div>
                            </ProductCard>
                        ))}
                    </AnimatePresence>
                </Grid>
            )}
        </Container>
    );
};

export default WholesaleCatalog;

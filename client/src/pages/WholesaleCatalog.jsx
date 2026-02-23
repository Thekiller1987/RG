import React, { useState, useMemo, useDeferredValue } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { FaArrowLeft, FaSearch, FaBoxOpen, FaTags, FaInfoCircle, FaEdit, FaCog, FaEye, FaEyeSlash, FaTimes, FaSave } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import * as api from '../service/api';
import toast from 'react-hot-toast';

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
  ${props => !props.$active && `
    filter: grayscale(0.8) opacity(0.7);
    border-style: dashed;
  `}
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
  background: ${props => props.qty > 10 ? '#dcfce7' : props.qty > 0 ? '#fff7ed' : '#fee2e2'};
  color: ${props => props.qty > 10 ? '#166534' : props.qty > 0 ? '#9a3412' : '#991b1b'};
`;

const EditButton = styled.button`
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  color: #0369a1;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: #e0f2fe; }
`;

const ManageToggle = styled.button`
  background: ${props => props.$active ? '#8b5cf6' : 'white'};
  color: ${props => props.$active ? 'white' : '#8b5cf6'};
  border: 1px solid #8b5cf6;
  padding: 10px 20px;
  border-radius: 99px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 6px rgba(139, 92, 246, 0.2);
  &:hover { transform: translateY(-1px); box-shadow: 0 6px 12px rgba(139, 92, 246, 0.3); }
`;

const VisibilityToggle = styled.button`
  position: absolute;
  top: 15px;
  left: 15px;
  background: ${props => props.$active ? '#dcfce7' : '#f1f5f9'};
  color: ${props => props.$active ? '#166534' : '#64748b'};
  border: 1px solid ${props => props.$active ? '#bbf7d0' : '#e2e8f0'};
  padding: 6px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.2s;
  &:hover { transform: scale(1.1); }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
  backdrop-filter: blur(4px); padding: 1rem;
`;

const ModalContent = styled.div`
  background: white; width: 100%; max-width: 600px;
  border-radius: 20px; padding: 2rem; position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`;

const FormGroup = styled.div`
  display: flex; flex-direction: column; gap: 8px; margin-bottom: 1.25rem;
`;

const Label = styled.label`
  font-size: 0.9rem; font-weight: 600; color: #475569;
`;

const Input = styled.input`
  padding: 12px 14px; border: 1px solid #e2e8f0; border-radius: 10px;
  font-size: 1rem; color: #1e293b; outline: none;
  &:focus { border-color: #8b5cf6; box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1); }
`;

const ModalActions = styled.div`
  display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem;
  padding-top: 1.5rem; border-top: 1px solid #f1f5f9;
`;

const EditModal = ({ product, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    nombre: product.nombre,
    descripcion: product.descripcion || '',
    venta: product.venta,
    mayoreo: product.mayoreo || '',
    distribuidor: product.distribuidor || '',
    mayorista: product.mayorista || '',
    taller: product.taller || ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <ModalOverlay initial={{ opacity: 0 }} border animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, color: '#1e293b' }}>Configurar Precios: {product.codigo}</h2>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}><FaTimes size={20} /></button>
        </div>

        <FormGroup>
          <Label>Nombre del Producto</Label>
          <Input name="nombre" value={formData.nombre} onChange={handleChange} />
        </FormGroup>

        <FormGroup>
          <Label>Descripción</Label>
          <Input name="descripcion" value={formData.descripcion} onChange={handleChange} />
        </FormGroup>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <FormGroup><Label>Precio Tienda (Público)</Label><Input type="number" name="venta" value={formData.venta} onChange={handleChange} /></FormGroup>
          <FormGroup><Label>Mayoreo</Label><Input type="number" name="mayoreo" value={formData.mayoreo} onChange={handleChange} /></FormGroup>
          <FormGroup><Label>Distribuidor</Label><Input type="number" name="distribuidor" value={formData.distribuidor} onChange={handleChange} /></FormGroup>
          <FormGroup><Label>Mayorista</Label><Input type="number" name="mayorista" value={formData.mayorista} onChange={handleChange} /></FormGroup>
        </div>

        <ModalActions>
          <BackButton onClick={onClose}>Cancelar</BackButton>
          <ManageToggle $active onClick={() => onSave(formData)} style={{ borderRadius: '10px' }}>
            <FaSave /> Guardar Cambios
          </ManageToggle>
        </ModalActions>
      </ModalContent>
    </ModalOverlay>
  );
};

const WholesaleCatalog = () => {
  const navigate = useNavigate();
  const { products, token, refreshProducts } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isManageMode, setIsManageMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const deferredSearch = useDeferredValue(searchTerm);

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let items = isManageMode ? products : products.filter(p => !!p.catalogo_mayorista);

    const q = deferredSearch.toLowerCase().trim();
    if (!q) return items;

    return items.filter(p =>
      (p.nombre || '').toLowerCase().includes(q) ||
      (p.codigo || '').toLowerCase().includes(q) ||
      (p.descripcion || '').toLowerCase().includes(q)
    );
  }, [products, deferredSearch, isManageMode]);

  const handleToggleVisibility = async (p) => {
    try {
      const newStatus = p.catalogo_mayorista ? 0 : 1;
      await api.updateProduct(p.id_producto, { ...p, catalogo_mayorista: newStatus }, token);
      toast.success(newStatus ? 'Producto activado' : 'Producto ocultado');
      refreshProducts();
    } catch (err) {
      toast.error('Error al actualizar visibilidad');
    }
  };

  const handleUpdatePrices = async (formData) => {
    try {
      await api.updateProduct(selectedProduct.id_producto, {
        ...selectedProduct,
        ...formData,
        mayoreo: formData.mayoreo || null,
        distribuidor: formData.distribuidor || null,
        taller: formData.taller || null,
        mayorista: formData.mayorista || null
      }, token);
      toast.success('Producto actualizado');
      setSelectedProduct(null);
      refreshProducts();
    } catch (err) {
      toast.error('Error al guardar cambios');
    }
  };

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
        <ManageToggle $active={isManageMode} onClick={() => setIsManageMode(!isManageMode)}>
          <FaCog /> {isManageMode ? 'Finalizar Gestión' : 'Gestionar Catálogo'}
        </ManageToggle>
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
          <h3>No se encontraron productos</h3>
          <p>{isManageMode ? 'No hay productos en el inventario.' : 'Configura los productos para que aparezcan aquí.'}</p>
        </div>
      ) : (
        <Grid>
          <AnimatePresence>
            {filteredProducts.map(p => (
              <ProductCard
                key={p.id_producto || p.id}
                $active={!!p.catalogo_mayorista}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                {isManageMode && (
                  <VisibilityToggle
                    $active={!!p.catalogo_mayorista}
                    onClick={() => handleToggleVisibility(p)}
                    title={p.catalogo_mayorista ? 'Ocultar del catálogo' : 'Mostrar en catálogo'}
                  >
                    {p.catalogo_mayorista ? <FaEye /> : <FaEyeSlash />}
                  </VisibilityToggle>
                )}

                <StockBadge qty={p.existencia}>
                  Stock: {p.existencia}
                </StockBadge>

                <ProductHeader>
                  <Info>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <small>{p.codigo || 'S/C'}</small>
                      <EditButton onClick={() => setSelectedProduct(p)}>
                        <FaEdit /> Editar
                      </EditButton>
                    </div>
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
                    <label>Mayoreo</label>
                    <span>{fmt(p.mayoreo || 0)}</span>
                  </PriceItem>
                  <PriceItem className="featured">
                    <label>Distribuidor</label>
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

      <AnimatePresence>
        {selectedProduct && (
          <EditModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onSave={handleUpdatePrices}
          />
        )}
      </AnimatePresence>
    </Container>
  );
};

export default WholesaleCatalog;

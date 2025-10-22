// InventoryManagement.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef, useDeferredValue } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaPlus, FaBoxOpen, FaTags, FaTruck, FaTrash, FaEdit, FaArrowLeft, FaHistory, FaSpinner,
  FaSearch, FaTimes, FaPlusCircle, FaMinusCircle, FaExclamationTriangle
} from 'react-icons/fa';

import AlertModal from './pos/components/AlertModal.jsx';
import CreateProductModal from './CreateProductModal';
import EditProductModal from './EditProductModal';

/* ================================
  CONSTANTES DE RENDIMIENTO
================================ */
const PRODUCTS_INITIAL_LOAD = 100;
const MAX_RESULTS_SEARCH = 200;
const LARGE_LIST_CUTOFF = 120;
const SLICE_STEP = 200;

/* ================================
  ESTILOS
================================ */
const spin = keyframes`from{transform:rotate(0)}to{transform:rotate(360deg)}`;
const Spinner = styled(FaSpinner)`font-size:2rem;color:#2b6cb0;animation:${spin} 1s linear infinite;`;
const PageWrapper = styled.div`padding:2rem;background:#f0f2f5;min-height:100vh;@media(max-width:768px){padding:1rem}`;
const HeaderContainer = styled.header`display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem;flex-wrap:wrap;gap:1rem`;
const Title = styled.h1`font-size:2.25rem;color:#1a202c;display:flex;align-items:center;gap:.75rem;margin:0;@media(max-width:768px){font-size:1.5rem}`;
const ButtonGroup = styled.div`display:flex;gap:.75rem;flex-wrap:wrap;@media(max-width:500px){width:100%;justify-content:stretch;button{flex-grow:1}}`;
const Button = styled(motion.button)`
  padding:.6rem 1.2rem;border:none;border-radius:8px;font-weight:600;color:#fff;display:inline-flex;align-items:center;gap:.5rem;cursor:pointer;font-size:.9rem;
  transition:background-color .2s;box-shadow:0 4px 6px rgba(0,0,0,.1);
  background:${p=>p.primary?'#28a745':p.secondary?'#6c757d':p.tertiary?'#17a2b8':'#6c757d'};
  &:hover{background:${p=>p.primary?'#218838':p.secondary?'#5a6268':p.tertiary?'#138496':'#5a6268'};}
  &:disabled{opacity:.6;cursor:not-allowed;}
`;
const BackButton = styled(Link)`display:inline-flex;align-items:center;gap:.5rem;text-decoration:none;color:#4a5568;font-weight:600;margin-bottom:1.5rem;&:hover{color:#2b6cb0}`;
const FilterContainer = styled.div`
  display:grid;grid-template-columns:1fr;gap:1rem;padding:1.5rem;background:#fff;border-radius:12px;margin-bottom:2rem;box-shadow:0 4px 12px rgba(0,0,0,.05);
  @media(min-width:768px){grid-template-columns:2fr 1fr 1fr;}
`;
const SearchInputWrapper = styled.div`position:relative;`;
const SearchInput = styled.input`
  width:100%;padding:.75rem 1rem .75rem 2.5rem;border-radius:8px;border:1px solid #e2e8f0;font-size:1rem;
  &:focus{border-color:#2b6cb0;box-shadow:0 0 0 2px rgba(43,108,176,.2);outline:none;}
`;
const Select = styled.select`
  width:100%;padding:.75rem 1rem;border-radius:8px;border:1px solid #e2e8f0;font-size:1rem;background:#fff;cursor:pointer;
`;
const MobileCardGrid = styled.div`
  display:grid;grid-template-columns:1fr;gap:1rem;margin-bottom:1rem;
  @media(min-width:640px){grid-template-columns:1fr 1fr;}
  @media(min-width:992px){grid-template-columns:repeat(3,1fr);}
`;
const ProductCard = styled(motion.div)`background:#fff;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,.05);display:flex;flex-direction:column;overflow:hidden;`;
const CardHeader = styled.div`padding:1rem 1.5rem;border-bottom:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:flex-start;flex-direction:column;`;
const CardTitle = styled.h3`margin:0;font-size:1.1rem;font-weight:600;color:#2d3748;`;
const CardCode = styled.span`font-size:.8rem;color:#a0aec0;background:#f7fafc;padding:.2rem .5rem;border-radius:4px;margin-top:5px;`;
const CardBody = styled.div`padding:1.5rem;flex-grow:1;display:grid;grid-template-columns:1fr 1fr;gap:1rem;`;
const InfoTag = styled.div`display:flex;flex-direction:column;span{font-size:.8rem;color:#718096;margin-bottom:.25rem;}strong{font-size:1rem;color:#2d3748}`;
const StockTag = styled(InfoTag)`strong{color:${p=>p.$low?'#dd6b20':p.$out?'#e53e3e':'#38a169'}}`;
const CardFooter = styled.div`padding:1rem 1.5rem;background:#f7fafc;display:flex;justify-content:space-between;gap:.5rem;`;
const ActionButton = styled.button`
  background:none;border:none;font-size:.9rem;border-radius:6px;padding:.5rem;cursor:pointer;display:flex;align-items:center;gap:.5rem;transition:all .2s;
  &.edit{color:#dd6b20;&:hover{background:#dd6b201a}}
  &.delete{color:#c53030;&:hover{background:#c530301a}}
  &.adjust{color:#4a5568;&:hover{background:#e2e8f0}}
`;
const ModalOverlay = styled(motion.div)`position:fixed;inset:0;background:rgba(0,0,0,.7);display:flex;justify-content:center;align-items:center;z-index:1000;padding:1rem;`;
const ModalContent = styled.div`background:#fdfdff;padding:2.5rem;border-radius:16px;max-height:90vh;overflow-y:auto;box-shadow:0 10px 30px rgba(0,0,0,.2);width:90vw;max-width:450px;@media(min-width:768px){max-width:800px;}`;
const ModalTitle = styled.h2`margin:0 0 2rem;color:#1a202c;text-align:center;font-size:1.75rem;`;
const CenteredMessage = styled.div`text-align:center;padding:3rem;color:#718096;`;
const Input = styled.input`width:100%;padding:.8rem 1rem;border-radius:8px;border:1px solid #ced4da;font-size:1rem;`;
const FormGroup = styled.div`display:flex;flex-direction:column;`;
const Label = styled.label`margin-bottom:.5rem;color:#495057;font-weight:600;`;
const ModalActions = styled.div`display:flex;justify-content:flex-end;gap:1rem;margin-top:2rem;@media(max-width:500px){justify-content:space-between}`;
const CancelButton = styled(Button)`background:#f8f9fa;color:#6c757d;border:1px solid #ced4da;&:hover{background:#e2e6ea}`;
const DeleteButton = styled(Button)`background:#dc3545;color:#fff;&:hover{background:#c53030}`;
const SaveButton = styled(Button)`background:#007bff;color:#fff;&:hover{background:#0069d9}`;
const HistoryModalContent = styled.div`background:#fdfdff;padding:0;border-radius:16px;width:90%;max-width:1000px;height:80vh;display:flex;flex-direction:column;box-shadow:0 10px 30px rgba(0,0,0,.2);`;
const HistoryHeader = styled.div`padding:1rem 1.5rem;border-bottom:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;`;
const HistoryBody = styled.div`flex-grow:1;overflow-y:auto;padding:1.5rem;`;
const HistoryTable = styled.table`width:100%;border-collapse:collapse;`;
const HistoryTh = styled.th`padding:.75rem;text-align:left;border-bottom:2px solid #e2e8f0;color:#718096;font-size:.8rem;text-transform:uppercase;`;
const HistoryTd = styled.td`padding:1rem .75rem;border-bottom:1px solid #f7fafc;`;

/* ================================
  ESTADO/UTIL: INDEXADOR RÁPIDO
================================ */
const norm = (s = '') => s.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const matchRank = (q, item) => {
    if (!q) return 0;
    if (item.qStarts.some(v => v.startsWith(q))) return 1;
    if (item.q.includes(q)) return 2;
    return 9;
};

/* ================================
  MODALES AUXILIARES
================================ */
const ConfirmDialog = ({ open, title, message, onCancel, onConfirm, confirmLabel = 'Confirmar', danger }) => {
    if (!open) return null;
    return (
        <ModalOverlay onClick={onCancel} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ scale: .95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: .95, opacity: 0 }}>
                <ModalContent as="div" onClick={(e) => e.stopPropagation()}>
                    <ModalTitle>{title}</ModalTitle>
                    <div style={{ textAlign: 'center' }}>{typeof message === 'string' ? <p>{message}</p> : message}</div>
                    <ModalActions>
                        <CancelButton onClick={onCancel}>Cancelar</CancelButton>
                        <DeleteButton style={{ background: danger ? '#dc3545' : '#007bff' }} onClick={onConfirm}>
                            {confirmLabel}
                        </DeleteButton>
                    </ModalActions>
                </ModalContent>
            </motion.div>
        </ModalOverlay>
    );
};

const ManagementModal = ({ title, items, onAdd, onDelete, onClose }) => {
    const [newItemName, setNewItemName] = useState('');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [toDelete, setToDelete] = useState(null);

    const handleAdd = async () => {
        if (newItemName.trim()) {
            await onAdd(newItemName.trim());
            setNewItemName('');
        }
    };

    const askDelete = (id, nombre) => {
        setToDelete({ id, nombre });
        setConfirmOpen(true);
    };

    const doDelete = async () => {
        if (!toDelete) return;
        await onDelete(toDelete.id);
        setConfirmOpen(false);
        setToDelete(null);
    };

    return (
        <ModalOverlay onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}>
                <ModalContent as="div" onClick={(e) => e.stopPropagation()}>
                    <ModalTitle>{title}</ModalTitle>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                        <Input value={newItemName} onChange={(e) => setNewItemName(e.target.value)} placeholder={`Nuevo ${title.slice(10, -1)}`} />
                        <Button primary onClick={handleAdd}>Agregar</Button>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, maxHeight: '300px', overflowY: 'auto' }}>
                        {items.map(item => (
                            <li key={item.id_categoria || item.id_proveedor} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.75rem .5rem', borderBottom: '1px solid #eee' }}>
                                {item.nombre}
                                <Button as="a" onClick={() => askDelete(item.id_categoria || item.id_proveedor, item.nombre)} style={{ background: 'none', border: '1px solid #dc3545', color: '#dc3545', boxShadow: 'none', padding: '.4rem .8rem' }}>
                                    Eliminar
                                </Button>
                            </li>
                        ))}
                    </ul>
                    <ModalActions><CancelButton onClick={onClose}>Cerrar</CancelButton></ModalActions>
                    <AnimatePresence>
                        {confirmOpen && (
                            <ConfirmDialog
                                open={confirmOpen}
                                title="Confirmar eliminación"
                                message={`¿Deseas eliminar "${toDelete?.nombre}"? Si está en uso por productos, la operación fallará.`}
                                onCancel={() => { setConfirmOpen(false); setToDelete(null); }}
                                onConfirm={doDelete}
                                confirmLabel="Sí, eliminar"
                                danger
                            />
                        )}
                    </AnimatePresence>
                </ModalContent>
            </motion.div>
        </ModalOverlay>
    );
};

const StockAdjustmentModal = ({ isOpen, product, onClose, onConfirm }) => {
    const [cantidad, setCantidad] = useState('');
    const [razon, setRazon] = useState('');
    if (!isOpen || !product) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalCantidad = parseInt(cantidad, 10);
        if (isNaN(finalCantidad) || finalCantidad === 0) return;
        onConfirm(product, finalCantidad, razon);
    };

    return (
        <ModalOverlay onClick={onClose}>
            <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}>
                <ModalContent as="div" onClick={(e) => e.stopPropagation()}>
                    <ModalTitle>Ajustar Stock de "{product.nombre}"</ModalTitle>
                    <form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label>Cantidad a Ajustar</Label>
                            <Input type="number" placeholder="Usa negativos para restar (ej: -5)" value={cantidad} onChange={(e) => setCantidad(e.target.value)} autoFocus />
                            <small style={{ marginTop: '5px', color: '#6c757d' }}>Existencia actual: {product.existencia}</small>
                        </FormGroup>
                        <FormGroup style={{ marginTop: '1rem' }}>
                            <Label>Razón del Ajuste</Label>
                            <Input type="text" placeholder="Ej: Conteo físico, Devolución, Merma..." value={razon} onChange={(e) => setRazon(e.target.value)} required />
                        </FormGroup>
                        <ModalActions>
                            <CancelButton type="button" onClick={onClose}>Cancelar</CancelButton>
                            <SaveButton type="submit">Confirmar Ajuste</SaveButton>
                        </ModalActions>
                    </form>
                </ModalContent>
            </motion.div>
        </ModalOverlay>
    );
};

function InventoryHistoryModal({ onClose }) {
    // El código completo de InventoryHistoryModal va aquí...
    return <div>Historial Modal</div>;
}


/* ==================================
  COMPONENTE PRINCIPAL: InventoryManagement
===================================== */
const InventoryManagement = () => {
  const [allProductsRaw, setAllProductsRaw] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearch = useDeferredValue(searchTerm);
  const searchRef = useRef(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterProvider, setFilterProvider] = useState('');
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [adjustmentModal, setAdjustmentModal] = useState({ isOpen: false, product: null });
  const [alert, setAlert] = useState({ isOpen: false, title: '', message: '' });
  const [archivePrompt, setArchivePrompt] = useState({ open: false, product: null, detail: null });
  const [visibleCount, setVisibleCount] = useState(MAX_RESULTS_SEARCH);

  const showAlert = useCallback(({ title, message, type }) => setAlert({ isOpen: true, title, message, type }), []);
  const closeAlert = () => setAlert({ isOpen: false });

  const fetchProductList = useCallback(async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('/api/products', { headers: { Authorization: `Bearer ${token}` } });
    return res.data;
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const [full, cats, provs] = await Promise.all([
        fetchProductList(),
        axios.get('/api/categories', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/providers',  { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setAllProductsRaw(full);

      const indexed = full.map(p => {
        const nombre = p.nombre ?? '';
        const codigo = p.codigo ?? '';
        const descripcion = p.descripcion ?? '';
        const q = `${norm(nombre)}|${norm(codigo)}|${norm(descripcion)}`;
        const qStarts = [norm(nombre), norm(codigo)];
        const costoNum = Number(p.costo || 0);
        const ventaNum = Number(p.venta || 0);
        const existenciaNum = Number(p.existencia || 0);
        return {
          ...p,
          __fmt: {
            costo: `C$${costoNum.toFixed(2)}`,
            venta: `C$${ventaNum.toFixed(2)}`,
            costoTotal: `C$${(costoNum * existenciaNum).toFixed(2)}`
          },
          q,
          qStarts
        };
      });

      setAllProducts(indexed);
      setCategories(cats.data);
      setProviders(provs.data);
      setInitialLoadComplete(true);
    } catch (e) {
      setError('Error al cargar los datos.');
    }
  }, [fetchProductList]);

  useEffect(() => { fetchData(); }, [fetchData]);
  
  const { filtered, totalFilteredCount } = useMemo(() => {
    const q = norm(deferredSearch);
    const cat = String(filterCategory || '');
    const prov = String(filterProvider || '');

    let matched = allProducts;

    if (cat) matched = matched.filter(p => String(p.id_categoria) === cat);
    if (prov) matched = matched.filter(p => String(p.id_proveedor) === prov);

    if (!q) {
      return {
        filtered: matched.slice(0, PRODUCTS_INITIAL_LOAD),
        totalFilteredCount: matched.length
      };
    }

    const starts = [];
    const contains = [];
    for (let i = 0; i < matched.length; i++) {
      const it = matched[i];
      const rank = matchRank(q, it);
      if (rank === 1) starts.push(it);
      else if (rank === 2) contains.push(it);
    }

    const ranked = starts.concat(contains);
    return {
      filtered: ranked.slice(0, visibleCount),
      totalFilteredCount: ranked.length
    };
  }, [allProducts, deferredSearch, filterCategory, filterProvider, visibleCount]);

  const openCreateModal = () => setIsCreateModalOpen(true);
  const openEditModal = (product) => {
    setProductToEdit(product);
    setIsEditModalOpen(true);
  };
  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleCreateProduct = async (payload) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/products', payload, { headers: { Authorization: `Bearer ${token}` } });
      setIsCreateModalOpen(false);
      showAlert({ title: 'Éxito', message: 'Producto creado correctamente.' });
      await fetchData();
    } catch (err) {
      showAlert({ title: 'Error', message: err.response?.data?.msg || 'Error al crear el producto.', type: 'error' });
    }
  };

  const handleUpdateProduct = async (payload, productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/products/${productId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      setIsEditModalOpen(false);
      showAlert({ title: 'Éxito', message: 'Producto actualizado correctamente.' });
      await fetchData();
    } catch (err) {
      showAlert({ title: 'Error', message: err.response?.data?.msg || 'Error al actualizar el producto.', type: 'error' });
    }
  };

  const confirmDelete = async () => { /* ... */ };
  const archiveProduct = async (p) => { /* ... */ };
  const executeStockAdjustment = async (product, cantidad, razon) => { /* ... */ };
  const handleAddCategory = async (name) => { /* ... */ };
  const handleDeleteCategory = async (id) => { /* ... */ };
  const handleAddProvider = async (name) => { /* ... */ };
  const handleDeleteProvider = async (id) => { /* ... */ };

  if (!initialLoadComplete) return <PageWrapper><CenteredMessage><Spinner /><p>Cargando Inventario...</p></CenteredMessage></PageWrapper>;
  if (error) return <PageWrapper><CenteredMessage style={{ color: '#c53030' }}>{error}</CenteredMessage></PageWrapper>;
  
  const animationsEnabled = filtered.length <= LARGE_LIST_CUTOFF;
  const showLoadMore = filtered.length < totalFilteredCount;
  const isQuickLoad = !searchTerm && !filterCategory && !filterProvider && allProducts.length > PRODUCTS_INITIAL_LOAD;

  return (
    <PageWrapper>
        <BackButton to="/dashboard"><FaArrowLeft /> Volver al Dashboard</BackButton>
        <HeaderContainer>
            <Title><FaBoxOpen /> Gestión de Inventario</Title>
            <ButtonGroup>
                <Button primary onClick={openCreateModal}><FaPlus /> Crear Producto</Button>
                <Button secondary onClick={() => setIsCategoryModalOpen(true)}><FaTags /> Categorías</Button>
                <Button secondary onClick={() => setIsProviderModalOpen(true)}><FaTruck /> Proveedores</Button>
                <Button tertiary onClick={() => setIsHistoryModalOpen(true)}><FaHistory /> Historial</Button>
            </ButtonGroup>
        </HeaderContainer>

        <FilterContainer>
            <SearchInputWrapper>
                <FaSearch style={{ position: 'absolute', left: 12, top: 14, color: '#a0aec0' }} />
                <SearchInput
                    ref={searchRef}
                    placeholder={`Buscar producto (F1) — código, nombre o descripción`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                />
            </SearchInputWrapper>
            <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="">Todas las categorías</option>
                {categories.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
            </Select>
            <Select value={filterProvider} onChange={(e) => setFilterProvider(e.target.value)}>
                <option value="">Todos los proveedores</option>
                {providers.map(p => <option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre}</option>)}
            </Select>
        </FilterContainer>

        <div style={{ textAlign: 'right', marginBottom: '.5rem', color: '#4a5568', fontWeight: 'bold' }}>
            Mostrando {filtered.length} de {totalFilteredCount} productos filtrados (Total en BD: {allProducts.length})
        </div>

        {isQuickLoad && (
            <div style={{ padding: '.75rem', marginBottom: '1.5rem', background: '#fff3cd', color: '#856404', border: '1px solid #ffeeba', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                <FaExclamationTriangle style={{ minWidth: 20 }} />
                <small><strong>Carga Rápida:</strong> Se muestran los primeros {PRODUCTS_INITIAL_LOAD}. Escribe o filtra para ver más.</small>
            </div>
        )}

        <MobileCardGrid>
            {filtered.map((p) => {
                const cardProps = animationsEnabled ? { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: .12 } } : {};
                const low = p.existencia > 0 && p.existencia <= (p.minimo || 5);
                const out = p.existencia <= 0;
                return (
                    <ProductCard key={p.id_producto} {...cardProps}>
                        <CardHeader>
                            <CardTitle>{p.nombre}</CardTitle>
                            <CardCode>Código: {p.codigo}</CardCode>
                        </CardHeader>
                        <CardBody>
                            <InfoTag><span>Costo</span><strong>{p.__fmt.costo}</strong></InfoTag>
                            <InfoTag><span>Venta</span><strong>{p.__fmt.venta}</strong></InfoTag>
                            <StockTag $low={low} $out={out}><span>Existencia</span><strong>{p.existencia}</strong></StockTag>
                            <InfoTag><span>Costo Total</span><strong>{p.__fmt.costoTotal}</strong></InfoTag>
                        </CardBody>
                        <CardFooter>
                            <ActionButton className="adjust" title="Ajustar Stock" onClick={() => setAdjustmentModal({ isOpen: true, product: p })}><FaPlusCircle /><FaMinusCircle style={{ marginLeft: 4 }} /></ActionButton>
                            <ActionButton className="edit" onClick={() => openEditModal(p)}><FaEdit /> Editar</ActionButton>
                            <ActionButton className="delete" onClick={() => openDeleteModal(p)}><FaTrash /> Eliminar</ActionButton>
                        </CardFooter>
                    </ProductCard>
                );
            })}
        </MobileCardGrid>

        {showLoadMore && (
            <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0 2rem' }}>
                <Button onClick={() => setVisibleCount(v => v + SLICE_STEP)}><FaPlus /> Cargar más resultados</Button>
            </div>
        )}

        {filtered.length === 0 && initialLoadComplete && (
            <CenteredMessage><p>No se encontraron productos que coincidan con la búsqueda.</p></CenteredMessage>
        )}

        <AnimatePresence>
            {isCreateModalOpen && (
                <CreateProductModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSave={handleCreateProduct} categories={categories} providers={providers} allProductsRaw={allProductsRaw} />
            )}
        </AnimatePresence>
        <AnimatePresence>
            {isEditModalOpen && (
                <EditProductModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSave={handleUpdateProduct} productToEdit={productToEdit} categories={categories} providers={providers} allProductsRaw={allProductsRaw} />
            )}
        </AnimatePresence>
        <AnimatePresence>
            {isDeleteModalOpen && (
                <ConfirmDialog
                    open={isDeleteModalOpen}
                    title="Confirmar Eliminación"
                    message={`¿Estás seguro de que quieres eliminar el producto "${productToDelete?.nombre}"?`}
                    onCancel={() => setIsDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    confirmLabel="Sí, eliminar"
                    danger
                />
            )}
        </AnimatePresence>
        <AnimatePresence>
            {archivePrompt.open && (
                <ConfirmDialog
                    open={archivePrompt.open}
                    title="Eliminación bloqueada"
                    message={ <div style={{ textAlign: 'left', lineHeight: 1.6 }}> Este producto tiene referencias y no puede eliminarse.<br /> <strong>Referencias:</strong><br /> Ventas: {archivePrompt.detail?.ventas ?? 0}<br /> Compras: {archivePrompt.detail?.compras ?? 0}<br /> Movimientos (kardex): {archivePrompt.detail?.kardex ?? 0}<br /><br /> Puedes <strong>archivarlo</strong> para ocultarlo del sistema sin perder historial. </div> }
                    onCancel={() => setArchivePrompt({ open: false, product: null, detail: null })}
                    onConfirm={() => archiveProduct(archivePrompt.product)}
                    confirmLabel="Archivar producto"
                    danger={false}
                />
            )}
        </AnimatePresence>
        <AnimatePresence>
            {isCategoryModalOpen && (
                <ManagementModal title="Gestionar Categorías" items={categories} onAdd={handleAddCategory} onDelete={handleDeleteCategory} onClose={() => setIsCategoryModalOpen(false)} />
            )}
        </AnimatePresence>
        <AnimatePresence>
            {isProviderModalOpen && (
                <ManagementModal title="Gestionar Proveedores" items={providers} onAdd={handleAddProvider} onDelete={handleDeleteProvider} onClose={() => setIsProviderModalOpen(false)} />
            )}
        </AnimatePresence>
        <AnimatePresence>
            {isHistoryModalOpen && (<InventoryHistoryModal onClose={() => setIsHistoryModalOpen(false)} />)}
        </AnimatePresence>
        <AnimatePresence>
            {adjustmentModal.isOpen && (
                <StockAdjustmentModal isOpen={adjustmentModal.isOpen} product={adjustmentModal.product} onClose={() => setAdjustmentModal({ isOpen: false, product: null })} onConfirm={executeStockAdjustment} />
            )}
        </AnimatePresence>
        <AnimatePresence>
            {alert.isOpen && <AlertModal isOpen={alert.isOpen} onClose={closeAlert} title={alert.title} message={alert.message} />}
        </AnimatePresence>
    </PageWrapper>
  );
};

export default InventoryManagement;
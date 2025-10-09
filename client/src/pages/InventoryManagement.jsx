import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as api from '../service/api';
import { FaPlus, FaBoxOpen, FaTags, FaTruck, FaTrash, FaEdit, FaArrowLeft, FaHistory, FaSpinner, FaSearch, FaTimes, FaPlusCircle, FaMinusCircle } from 'react-icons/fa';
import AlertModal from './pos/components/AlertModal.jsx';
// IMPORTACIÓN CRÍTICA: Traemos la URL base configurada


// --- ESTILOS ---
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const spin = keyframes`from { transform: rotate(0deg); } to { transform: rotate(360deg); }`;

const PageWrapper = styled.div`
    padding: 2rem;
    background-color: #f0f2f5;
    min-height: 100vh;
    @media (max-width: 768px) { padding: 1rem; }
`;
const HeaderContainer = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
`;
const Title = styled.h1`
    font-size: 2.25rem;
    color: #1a202c;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0;
`;
const ButtonGroup = styled.div` display: flex; gap: 0.75rem; flex-wrap: wrap; `;
const Button = styled(motion.button)`
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    color: white;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background: ${props => props.primary ? '#28a745' : props.secondary ? '#6c757d' : props.tertiary ? '#17a2b8' : '#6c757d'};
    &:hover { background: ${props => props.primary ? '#218838' : props.secondary ? '#5a6268' : props.tertiary ? '#138496' : '#5a6268'}; }
    `;
const BackButton = styled(Link)`
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: #4a5568;
    font-weight: 600;
    margin-bottom: 1.5rem;
    &:hover { color: #2b6cb0; }
`;
const FilterContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1.5rem;
    background-color: white;
    border-radius: 12px;
    margin-bottom: 2rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    @media (min-width: 768px) { grid-template-columns: 2fr 1fr 1fr; }
`;
const SearchInputWrapper = styled.div` position: relative; `;
const SearchInput = styled.input`
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    font-size: 1rem;
    &:focus { border-color: #2b6cb0; box-shadow: 0 0 0 2px rgba(43, 108, 176, 0.2); outline: none; }
`;
const Select = styled.select`
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    font-size: 1rem;
    background-color: white;
    cursor: pointer;
`;
const DesktopTableWrapper = styled.div`
    display: none;
    @media (min-width: 992px) {
        display: block;
        overflow-x: auto;
        background-color: white;
        box-shadow: 0 4px 25px rgba(0, 0, 0, 0.07);
        border-radius: 12px;
    }
`;
const Table = styled.table` width: 100%; border-collapse: collapse; `;
const Th = styled.th` background-color: #f7fafc; color: #4a5568; padding: 1rem; text-align: left; font-weight: 600; font-size: 0.8rem; text-transform: uppercase; border-bottom: 2px solid #e2e8f0; `;
const Td = styled.td` padding: 1rem; border-bottom: 1px solid #e2e8f0; color: #2d3748; vertical-align: middle;`;
const Tr = styled(motion.tr)` &:last-child ${Td} { border-bottom: none; } &:hover { background-color: #f7fafc; } `;

const MobileCardGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    @media (min-width: 640px) { grid-template-columns: 1fr 1fr; }
    @media (min-width: 992px) { display: none; }
`;
const ProductCard = styled(motion.div)`
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;
const CardHeader = styled.div` padding: 1rem 1.5rem; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: flex-start;`;
const CardTitle = styled.h3` margin: 0; font-size: 1.1rem; font-weight: 600; color: #2d3748; `;
const CardCode = styled.span` font-size: 0.8rem; color: #a0aec0; background-color: #f7fafc; padding: 0.2rem 0.5rem; border-radius: 4px; `;
const CardBody = styled.div` padding: 1.5rem; flex-grow: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; `;
const InfoTag = styled.div` span { font-size: 0.8rem; color: #718096; margin-bottom: 0.25rem; } strong { font-size: 1rem; color: #2d3748; } `;
const StockTag = styled(InfoTag)` strong { color: ${props => props.$low ? '#dd6b20' : props.$out ? '#e53e3e' : '#38a169'}; } `;
const CardFooter = styled.div` padding: 1rem 1.5rem; background-color: #f7fafc; display: flex; justify-content: flex-end; gap: 0.5rem; `;
const ActionButton = styled.button` background: none; border: none; font-size: 1.1rem; border-radius: 6px; padding: 0.5rem; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: all 0.2s; &.edit { color: #dd6b20; &:hover { background-color: #dd6b201a; } } &.delete { color: #c53030; &:hover { background-color: #c530301a; } } &.adjust { color: #4a5568; &:hover { background-color: #e2e8f0; } }`;
const ModalOverlay = styled(motion.div)` position: fixed; inset: 0; background: rgba(0, 0, 0, 0.7); display: flex; justify-content: center; align-items: center; z-index: 1000; padding: 1rem;`;

const ModalContent = styled.div`
      background: #fdfdff;
      padding: 2.5rem;
      border-radius: 16px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      width: 90vw;
      max-width: 450px;
      @media (min-width: 768px) {
        max-width: 800px;
      }
`;

const ModalTitle = styled.h2` margin-top: 0; margin-bottom: 2rem; color: #1a202c; text-align: center; font-size: 1.75rem; `;
const CenteredMessage = styled.div` text-align: center; padding: 3rem; color: #718096; `;
const Spinner = styled(FaSpinner)` font-size: 2rem; color: #2b6cb0; animation: ${spin} 1s linear infinite; `;
const Input = styled.input` width: 100%; padding: 0.8rem 1rem; border-radius: 8px; border: 1px solid #ced4da; font-size: 1rem; `;
const ModalError = styled.p` color: #dc3545; font-size: 0.9rem; text-align: center; margin-bottom: 1rem; min-height: 1.2rem;`;
const InputGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; `;
const FormGroup = styled.div` display: flex; flex-direction: column; `;
const Label = styled.label` margin-bottom: 0.5rem; color: #495057; font-weight: 600; `;
const ModalActions = styled.div` display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; `;
const SaveButton = styled(Button)` background-color: #007bff; color: white; &:hover { background-color: #0069d9; } `;
const CancelButton = styled(Button)` background-color: #f8f9fa; color: #6c757d; border: 1px solid #ced4da; &:hover { background-color: #e2e6ea; } `;
const DeleteButton = styled(Button)` background-color: #dc3545; color: white; &:hover { background-color: #c53030; } `;

const ManagementModal = ({ title, items, onAdd, onDelete, onClose }) => {
    const [newItemName, setNewItemName] = useState('');
    const handleAdd = () => { if (newItemName.trim()) { onAdd(newItemName.trim()); setNewItemName(''); } };
    return (
        <ModalOverlay onClick={onClose} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <motion.div initial={{y: -50, opacity: 0}} animate={{y: 0, opacity: 1}} exit={{y: 50, opacity: 0}}>
                <ModalContent as="div" onClick={(e) => e.stopPropagation()}>
                    <ModalTitle>{title}</ModalTitle>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                        <Input value={newItemName} onChange={(e) => setNewItemName(e.target.value)} placeholder={`Nuevo ${title.slice(9, -1)}`} />
                        <Button primary onClick={handleAdd}>Agregar</Button>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, maxHeight: '300px', overflowY: 'auto' }}>
                        {items.map(item => (
                            <li key={item.id_categoria || item.id_proveedor} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0.5rem', borderBottom: '1px solid #eee' }}>
                                {item.nombre}
                                <Button as="a" onClick={() => onDelete(item.id_categoria || item.id_proveedor)} style={{background: 'none', border:'1px solid #dc3545', color: '#dc3545', boxShadow:'none', padding: '0.4rem 0.8rem'}}>Eliminar</Button>
                            </li>
                        ))}
                    </ul>
                    <ModalActions><CancelButton onClick={onClose}>Cerrar</CancelButton></ModalActions>
                </ModalContent>
            </motion.div>
        </ModalOverlay>
    );
};

const initialFormState = {
    codigo: '', nombre: '', costo: '', venta: '', mayoreo: '', id_categoria: '',
    existencia: '', minimo: '', maximo: '', tipo_venta: 'Unidad', id_proveedor: ''
};

const StockAdjustmentModal = ({ isOpen, product, onClose, onConfirm }) => {
    const [cantidad, setCantidad] = useState('');
    const [razon, setRazon] = useState('');
    if (!isOpen) return null;

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

    const InventoryManagement = () => {
        const [products, setProducts] = useState([]);
        const [categories, setCategories] = useState([]);
        const [providers, setProviders] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [editingProduct, setEditingProduct] = useState(null);
        const [formData, setFormData] = useState(initialFormState);
        const [profitPercentage, setProfitPercentage] = useState('');
        const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
        const [productToDelete, setProductToDelete] = useState(null);
        const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
        const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
        const [modalError, setModalError] = useState('');
        const [searchTerm, setSearchTerm] = useState('');
        const [filterCategory, setFilterCategory] = useState('');
        const [filterProvider, setFilterProvider] = useState('');
        const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
        const [alert, setAlert] = useState({ isOpen: false, title: '', message: '' });
        const [adjustmentModal, setAdjustmentModal] = useState({ isOpen: false, product: null });
        
        const showAlert = useCallback(({ title, message }) => setAlert({ isOpen: true, title, message }), []);
        const closeAlert = () => setAlert({ isOpen: false });

        const fetchData = useCallback(async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const [productsRes, categoriesRes, providersRes] = await Promise.all([
                    axios.get('http://localhost:3001/api/products', config),
                    axios.get('http://localhost:3001/api/categories', config),
                    axios.get('http://localhost:3001/api/providers', config)
                ]);
                setProducts(productsRes.data);
                setCategories(categoriesRes.data);
                setProviders(providersRes.data);
            } catch (err) { setError('Error al cargar los datos.'); } 
            finally { setLoading(false); }
        }, []);

        useEffect(() => { fetchData(); }, [fetchData]);

        const handleInputChange = (e) => {
            const { name, value } = e.target;
            const newFormData = { ...formData, [name]: value };
            if (name === 'costo' || name === 'venta') {
                const cost = parseFloat(newFormData.costo);
                const price = parseFloat(newFormData.venta);
                if (cost > 0 && price > 0) { setProfitPercentage(((price - cost) / cost * 100).toFixed(2)); } 
                else { setProfitPercentage(''); }
            }
            setFormData(newFormData);
        };

        const handlePercentageChange = (e) => {
            const percentage = e.target.value;
            setProfitPercentage(percentage);
            const cost = parseFloat(formData.costo);
            if (cost > 0 && percentage) { setFormData({...formData, venta: (cost * (1 + parseFloat(percentage) / 100)).toFixed(2)}); }
        };

        const openCreateModal = () => { setEditingProduct(null); setFormData(initialFormState); setProfitPercentage(''); setModalError(''); setIsModalOpen(true); };
        
        const openEditModal = (product) => {
            setEditingProduct(product);
            const cost = parseFloat(product.costo);
            const price = parseFloat(product.venta);
            if(cost > 0 && price > 0){ setProfitPercentage(((price - cost) / cost * 100).toFixed(2)); } 
            else { setProfitPercentage(''); }
            setFormData({ ...initialFormState, ...product, mayoreo: product.mayoreo || '', minimo: product.minimo || '', maximo: product.maximo || '' });
            setModalError('');
            setIsModalOpen(true);
        };

        const openDeleteModal = (product) => { setProductToDelete(product); setIsDeleteModalOpen(true); };
        
        const confirmDelete = async () => { 
            if (!productToDelete) return; 
            try { 
                const token = localStorage.getItem('token'); 
                const config = { headers: { Authorization: `Bearer ${token}` } }; 
                await axios.delete(`http://localhost:3001/api/products/${productToDelete.id_producto}`, config); 
                fetchData(); 
                setIsDeleteModalOpen(false); 
                setProductToDelete(null); 
            } catch (err) { 
                showAlert({title: 'Error', message: 'No se pudo eliminar el producto.'}); 
            } 
        };
        
        const handleSaveProduct = async (e) => {
            e.preventDefault();
            setModalError('');

            // --- INICIO DE VALIDACIONES ---

            if (!formData.codigo.trim() || !formData.nombre.trim() || !formData.costo.trim() || !formData.venta.trim() || !formData.existencia.trim()) {
                setModalError('Los campos Código, Nombre, Costo, Venta y Existencia son obligatorios.');
                return;
            }

            const cost = parseFloat(formData.costo);
            const price = parseFloat(formData.venta);
            const wholesale = formData.mayoreo ? parseFloat(formData.mayoreo) : null;
            const stock = parseInt(formData.existencia, 10);
            const minStock = formData.minimo ? parseInt(formData.minimo, 10) : null;
            const maxStock = formData.maximo ? parseInt(formData.maximo, 10) : null;

            if (isNaN(cost) || isNaN(price) || isNaN(stock)) {
                setModalError('Costo, Venta y Existencia deben ser números válidos.');
                return;
            }
            if (formData.mayoreo && isNaN(wholesale)) {
                setModalError('Precio Mayoreo debe ser un número válido o estar vacío.');
                return;
            }
            if (formData.minimo && isNaN(minStock)) {
                setModalError('Stock Mínimo debe ser un número válido o estar vacío.');
                return;
            }
            if (formData.maximo && isNaN(maxStock)) {
                setModalError('Stock Máximo debe ser un número válido o estar vacío.');
                return;
            }
            
            // 4. Validación de negativos (CORREGIDA PARA INCLUIR PRECIO MAYOREO)
            if (cost < 0 || price < 0 || stock < 0 || (minStock !== null && minStock < 0) || (maxStock !== null && maxStock < 0) || (wholesale !== null && wholesale < 0)) {
                setModalError('Los precios y las cantidades de stock no pueden ser negativos.');
                return;
            }
        
            if (price < cost) {
                setModalError('El precio de venta no puede ser menor que el costo.');
                return;
            }
            if (wholesale !== null && wholesale > price) {
                setModalError('El precio de mayoreo no puede ser mayor que el de venta.');
                return;
            }
            if (minStock !== null && maxStock !== null && minStock > maxStock) {
                setModalError('El stock mínimo no puede ser mayor que el máximo.');
                return;
            }

            const isDuplicate = products.some(p => (editingProduct ? p.id_producto !== editingProduct.id_producto : true) && (p.codigo.toLowerCase() === formData.codigo.trim().toLowerCase() || p.nombre.toLowerCase() === formData.nombre.trim().toLowerCase()));
            if (isDuplicate) {
                const duplicateProduct = products.find(p => (editingProduct ? p.id_producto !== editingProduct.id_producto : true) && ( p.codigo.toLowerCase() === formData.codigo.trim().toLowerCase() || p.nombre.toLowerCase() === formData.nombre.trim().toLowerCase()));
                if (duplicateProduct.codigo.toLowerCase() === formData.codigo.trim().toLowerCase()) { setModalError(`Ya existe un producto con el código "${formData.codigo}".`); } 
                else if (duplicateProduct.nombre.toLowerCase() === formData.nombre.trim().toLowerCase()) { setModalError(`Ya existe un producto con el nombre "${formData.nombre}".`); }
                return;
            }
            
            // --- FIN DE VALIDACIONES ---

            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const dataToSave = { ...formData, mayoreo: formData.mayoreo || null, minimo: formData.minimo || null, maximo: formData.maximo || null, id_categoria: formData.id_categoria || null, id_proveedor: formData.id_proveedor || null };
            try {
                if (editingProduct) {
                    await axios.put(`http://localhost:3001/api/products/${editingProduct.id_producto}`, dataToSave, config);
                } else {
                    await axios.post('http://localhost:3001/api/products', dataToSave, config);
                }
                setIsModalOpen(false);
                fetchData();
            } catch (err) { setModalError(err.response?.data?.msg || 'Error al guardar el producto.'); }
        };
        
        const executeStockAdjustment = async (product, cantidad, razon) => {
            try {
                const token = localStorage.getItem('token');
                await axios.patch(`http://localhost:3001/api/products/${product.id_producto}/stock`, 
                    { cantidad, razon },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setAdjustmentModal({ isOpen: false, product: null });
                showAlert({ title: "Éxito", message: "Stock actualizado correctamente." });
                fetchData();
            } catch (error) {
                console.error("Error al ajustar stock:", error);
                showAlert({ title: "Error", message: error.response?.data?.msg || "No se pudo ajustar el stock." });
            }
        };
        
        const handleAddCategory = async (name) => { const token = localStorage.getItem('token'); await axios.post('http://localhost:3001/api/categories', { nombre: name }, { headers: { Authorization: `Bearer ${token}` } }); fetchData(); };
        const handleDeleteCategory = async (id) => { const token = localStorage.getItem('token'); try { await axios.delete(`http://localhost:3001/api/categories/${id}`, { headers: { Authorization: `Bearer ${token}` } }); fetchData(); } catch (error) { showAlert({ title: 'Error', message: error.response.data.msg }); } };
        const handleAddProvider = async (name) => { const token = localStorage.getItem('token'); await axios.post('http://localhost:3001/api/providers', { nombre: name }, { headers: { Authorization: `Bearer ${token}` } }); fetchData(); };
        const handleDeleteProvider = async (id) => { const token = localStorage.getItem('token'); try { await axios.delete(`http://localhost:3001/api/providers/${id}`, { headers: { Authorization: `Bearer ${token}` } }); fetchData(); } catch (error) { showAlert({ title: 'Error', message: error.response.data.msg }); } };

        const filteredProducts = useMemo(() => {
            return products.filter(p => {
                const searchTermLower = searchTerm.toLowerCase();
                const matchesSearch = p.nombre.toLowerCase().includes(searchTermLower) || (p.codigo && p.codigo.toLowerCase().includes(searchTermLower));
                const matchesCategory = filterCategory ? p.id_categoria == filterCategory : true;
                const matchesProvider = filterProvider ? p.id_proveedor == filterProvider : true;
                return matchesSearch && matchesCategory && matchesProvider;
            });
        }, [products, searchTerm, filterCategory, filterProvider]);

        if (loading) return <PageWrapper><CenteredMessage><Spinner /><p>Cargando Inventario...</p></CenteredMessage></PageWrapper>;
        if (error) return <PageWrapper><CenteredMessage style={{ color: '#c53030' }}>{error}</CenteredMessage></PageWrapper>;

        return (
            <PageWrapper>
                <BackButton to="/dashboard"><FaArrowLeft /> Volver al Dashboard</BackButton>
                <HeaderContainer>
                    <Title><FaBoxOpen /> Gestión de Inventario</Title>
                    <ButtonGroup>
                        <Button primary onClick={openCreateModal} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><FaPlus /> Crear Producto</Button>
                        <Button secondary onClick={() => setIsCategoryModalOpen(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><FaTags /> Categorías</Button>
                        <Button secondary onClick={() => setIsProviderModalOpen(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><FaTruck /> Proveedores</Button>
                        <Button tertiary onClick={() => setIsHistoryModalOpen(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><FaHistory /> Historial</Button>
                    </ButtonGroup>
                </HeaderContainer>

                <FilterContainer>
                    <SearchInputWrapper>
                        <FaSearch style={{position: 'absolute', left: '12px', top: '14px', color: '#a0aec0'}}/>
                        <SearchInput placeholder="Buscar por código o nombre..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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

                <DesktopTableWrapper>
                    <Table>
                        <thead><Tr><Th>ID</Th><Th>Código</Th><Th>Nombre</Th><Th>Costo</Th><Th>Venta</Th><Th>Existencia</Th><Th>Acciones</Th></Tr></thead>
                        <tbody>
                            {filteredProducts.map((p, index) => (
                                <Tr key={p.id_producto} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.02 }}>
                                    <Td>{p.id_producto}</Td>
                                    <Td>{p.codigo}</Td>
                                    <Td>{p.nombre}</Td>
                                    <Td>C${Number(p.costo).toFixed(2)}</Td>
                                    <Td>C${Number(p.venta).toFixed(2)}</Td>
                                    <Td style={{fontWeight: 'bold', color: p.existencia <= (p.minimo || 5) ? '#dd6b20' : '#2d3748' }}>{p.existencia}</Td>
                                    <Td>
                                        <div style={{display: 'flex', gap: '0.25rem', alignItems: 'center'}}>
                                            <ActionButton className="add" title="Ajustar Stock" onClick={() => setAdjustmentModal({isOpen: true, product: p})}><FaPlusCircle /></ActionButton>
                                            <ActionButton className="subtract" title="Ajustar Stock" onClick={() => setAdjustmentModal({isOpen: true, product: p})}><FaMinusCircle /></ActionButton>
                                            <ActionButton className="edit" title="Editar Producto" onClick={() => openEditModal(p)}><FaEdit /></ActionButton>
                                            <ActionButton className="delete" title="Eliminar Producto" onClick={() => openDeleteModal(p)}><FaTrash /></ActionButton>
                                        </div>
                                    </Td>
                                </Tr>
                            ))}
                        </tbody>
                    </Table>
                </DesktopTableWrapper>
                
                <MobileCardGrid>
                    {filteredProducts.map((p, index) => (
                        <ProductCard key={p.id_producto} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                            <CardHeader><CardTitle>{p.nombre}</CardTitle><CardCode>{p.codigo}</CardCode></CardHeader>
                            <CardBody>
                                <InfoTag><span>Costo</span><strong>C${Number(p.costo).toFixed(2)}</strong></InfoTag>
                                <InfoTag><span>Venta</span><strong>C${Number(p.venta).toFixed(2)}</strong></InfoTag>
                                <StockTag $low={p.existencia > 0 && p.existencia <= (p.minimo || 5)} $out={p.existencia <= 0}>
                                    <span>Existencia</span><strong>{p.existencia}</strong>
                                </StockTag>
                                <InfoTag><span>Categoría</span><strong>{p.nombre_categoria || 'N/A'}</strong></InfoTag>
                            </CardBody>
                            <CardFooter>
                            <ActionButton className="adjust" title="Ajustar Stock" onClick={() => setAdjustmentModal({isOpen: true, product: p})}><FaPlusCircle /><FaMinusCircle style={{marginLeft:'4px'}}/></ActionButton>
                            <ActionButton className="edit" onClick={() => openEditModal(p)}><FaEdit /> Editar</ActionButton>
                            <ActionButton className="delete" onClick={() => openDeleteModal(p)}><FaTrash /> Eliminar</ActionButton>
                            </CardFooter>
                        </ProductCard>
                    ))}
                </MobileCardGrid>

                {filteredProducts.length === 0 && <CenteredMessage><p>No se encontraron productos que coincidan con la búsqueda.</p></CenteredMessage>}
                
                <AnimatePresence>
                    {isModalOpen && ( <ModalOverlay onClick={() => setIsModalOpen(false)}><motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}><ModalContent as="div" onClick={(e) => e.stopPropagation()}><form onSubmit={handleSaveProduct}><ModalTitle>{editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}</ModalTitle>{modalError && <ModalError>{modalError}</ModalError>}<InputGrid><FormGroup><Label>Código</Label><Input name="codigo" value={formData.codigo} onChange={handleInputChange} required /></FormGroup><FormGroup><Label>Nombre</Label><Input name="nombre" value={formData.nombre} onChange={handleInputChange} required /></FormGroup><FormGroup><Label>Costo (C$)</Label><Input type="number" step="0.01" name="costo" value={formData.costo} onChange={handleInputChange} required /></FormGroup><FormGroup><Label>% Ganancia</Label><Input type="number" step="0.01" value={profitPercentage} onChange={handlePercentageChange} placeholder="ej: 50" /></FormGroup><FormGroup><Label>Precio Venta (C$)</Label><Input type="number" step="0.01" name="venta" value={formData.venta} onChange={handleInputChange} required /></FormGroup><FormGroup><Label>Precio Mayoreo (C$)</Label><Input type="number" step="0.01" name="mayoreo" value={formData.mayoreo} onChange={handleInputChange} /></FormGroup><FormGroup><Label>Existencia</Label><Input type="number" inputMode="numeric" pattern="[0-9]*" name="existencia" value={formData.existencia} onChange={handleInputChange} required /></FormGroup><FormGroup><Label>Stock Mínimo</Label><Input type="number" inputMode="numeric" pattern="[0-9]*" name="minimo" value={formData.minimo} onChange={handleInputChange} /></FormGroup><FormGroup><Label>Stock Máximo</Label><Input type="number" inputMode="numeric" pattern="[0-9]*" name="maximo" value={formData.maximo} onChange={handleInputChange} /></FormGroup><FormGroup><Label>Categoría</Label><Select name="id_categoria" value={formData.id_categoria} onChange={handleInputChange}><option value="">-- Sin Categoría --</option>{categories.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}</Select></FormGroup><FormGroup><Label>Proveedor</Label><Select name="id_proveedor" value={formData.id_proveedor} onChange={handleInputChange}><option value="">-- Sin Proveedor --</option>{providers.map(p => <option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre}</option>)}</Select></FormGroup><FormGroup><Label>Tipo de Venta</Label><Select name="tipo_venta" value={formData.tipo_venta} onChange={handleInputChange}><option value="Unidad">Unidad</option><option value="Juego">Juego</option><option value="Kit">Kit</option></Select></FormGroup></InputGrid><ModalActions><CancelButton type="button" onClick={() => setIsModalOpen(false)}>Cancelar</CancelButton><SaveButton type="submit">Guardar Cambios</SaveButton></ModalActions></form></ModalContent></motion.div></ModalOverlay>)}
                </AnimatePresence>
                <AnimatePresence>
                    {isDeleteModalOpen && ( <ModalOverlay onClick={() => setIsDeleteModalOpen(false)}><motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}><ModalContent as="div" onClick={(e) => e.stopPropagation()}><ModalTitle>Confirmar Eliminación</ModalTitle><p>¿Estás seguro de que quieres eliminar el producto <strong>{productToDelete?.nombre}</strong>?</p><ModalActions><CancelButton onClick={() => setIsDeleteModalOpen(false)}>Cancelar</CancelButton><DeleteButton onClick={confirmDelete}>Sí, Eliminar</DeleteButton></ModalActions></ModalContent></motion.div></ModalOverlay>)}
                </AnimatePresence>
                <AnimatePresence>
                    {isCategoryModalOpen && ( <ManagementModal title="Gestionar Categorías" items={categories} onAdd={handleAddCategory} onDelete={handleDeleteCategory} onClose={() => setIsCategoryModalOpen(false)} /> )}
                </AnimatePresence>
                <AnimatePresence>
                    {isProviderModalOpen && ( <ManagementModal title="Gestionar Proveedores" items={providers} onAdd={handleAddProvider} onDelete={handleDeleteProvider} onClose={() => setIsProviderModalOpen(false)} /> )}
                </AnimatePresence>
                <AnimatePresence>
                    {isHistoryModalOpen && <InventoryHistoryModal onClose={() => setIsHistoryModalOpen(false)} />}
                </AnimatePresence>
                <AnimatePresence>
                    {adjustmentModal.isOpen && <StockAdjustmentModal isOpen={adjustmentModal.isOpen} product={adjustmentModal.product} onClose={() => setAdjustmentModal({isOpen: false, product: null})} onConfirm={executeStockAdjustment} />}
                </AnimatePresence>
                <AnimatePresence>
                    {alert.isOpen && <AlertModal isOpen={alert.isOpen} onClose={closeAlert} title={alert.title} message={alert.message} />}
                </AnimatePresence>
            </PageWrapper>
        );
    };

    const HistoryModalContent = styled.div` background: #fdfdff; padding: 0; border-radius: 16px; width: 90%; max-width: 1000px; height: 80vh; display: flex; flex-direction: column; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); `;
    const HistoryHeader = styled.div` padding: 1rem 1.5rem; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; `;
    const HistoryBody = styled.div` flex-grow: 1; overflow-y: auto; padding: 1.5rem; `;
    const HistoryTable = styled.table` width: 100%; border-collapse: collapse; `;
    const HistoryTh = styled.th` padding: 0.75rem; text-align: left; border-bottom: 2px solid #e2e8f0; color: #718096; font-size: 0.8rem; text-transform: uppercase; `;
    const HistoryTd = styled.td` padding: 1rem 0.75rem; border-bottom: 1px solid #f7fafc; `;
    const TypeBadge = styled.span` display: inline-block; padding: 0.25em 0.6em; font-size: 0.75rem; font-weight: 700; line-height: 1; text-align: center; border-radius: 0.375rem; color: ${props => props.color || '#fff'}; background-color: ${props => props.bg || '#6c757d'}; `;

    function InventoryHistoryModal({ onClose }) {
        const [history, setHistory] = useState([]);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const fetchHistory = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const res = await axios.get('http://localhost:3001/api/products/inventory/history', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setHistory(res.data);
                } catch (error) { console.error("Error fetching inventory history:", error); } 
                finally { setLoading(false); }
            };
            fetchHistory();
        }, []);

        const getTypeBadge = (type) => {
            const upperType = String(type).toUpperCase();
            if (upperType.includes('ENTRADA') || upperType.includes('CREACION')) { return <TypeBadge bg="#e6fffa" color="#2c7a7b">ENTRADA</TypeBadge>; }
            if (upperType.includes('SALIDA') || upperType.includes('VENTA') || upperType.includes('ELIMINACION')) { return <TypeBadge bg="#fed7d7" color="#9b2c2c">SALIDA</TypeBadge>; }
            if (upperType.includes('AJUSTE') || upperType.includes('EDICION')) { return <TypeBadge bg="#feebc8" color="#9c4221">AJUSTE</TypeBadge>; }
            return <TypeBadge>{type}</TypeBadge>;
        }

        return (
            <ModalOverlay onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}>
                    <HistoryModalContent onClick={e => e.stopPropagation()}>
                        <HistoryHeader>
                            <Title style={{fontSize: '1.5rem'}}><FaHistory/> Historial de Movimientos</Title>
                            <Button as="a" onClick={onClose} style={{background: 'none', color: '#a0aec0', boxShadow: 'none'}}><FaTimes size={24}/></Button>
                        </HistoryHeader>
                        <HistoryBody>
                            {loading ? ( <CenteredMessage><Spinner/></CenteredMessage> ) 
                            : history.length === 0 ? ( <CenteredMessage>No hay movimientos registrados.</CenteredMessage> ) 
                            : (
                                <HistoryTable>
                                    <thead>
                                        <tr>
                                            <HistoryTh>Fecha</HistoryTh><HistoryTh>Producto</HistoryTh><HistoryTh>Tipo</HistoryTh>
                                            <HistoryTh>Detalles</HistoryTh><HistoryTh>Usuario</HistoryTh>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map(item => (
                                            <motion.tr key={item.id_movimiento} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                                <HistoryTd>{new Date(item.fecha).toLocaleString('es-NI')}</HistoryTd>
                                                <HistoryTd>{item.nombre_producto} <span style={{color: '#a0aec0'}}>({item.codigo_producto})</span></HistoryTd>
                                                <HistoryTd>{getTypeBadge(item.tipo_movimiento)}</HistoryTd>
                                                <HistoryTd>{item.detalles}</HistoryTd>
                                                <HistoryTd>{item.nombre_usuario || 'Sistema'}</HistoryTd>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                            </HistoryTable>
                            )}
                        </HistoryBody>
                    </HistoryModalContent>
                </motion.div>
            </ModalOverlay>
        );
    }

    export default InventoryManagement;
// useProductManagement.js

import { useCallback } from 'react';
import axios from 'axios';

// Función utilitaria para asegurar que el valor es un String
const safeString = (value) => String(value ?? '');


const useProductManagement = ({ 
    fetchData, 
    allProductsRaw, 
    editingProduct, 
    setEditingProduct, 
    formData, 
    setFormData, 
    setProfitPercentage, 
    setIsModalOpen, 
    setIsDeleteModalOpen, 
    setProductToDelete, 
    showAlert,
    setModalError,
    setArchivePrompt 
}) => {

    /* ==============================
     * HANDLERS DE MODALES y FORMULARIO
     * ============================== */

    const openCreateModal = useCallback(() => {
        setEditingProduct(null);
        setFormData({
            codigo:'', nombre:'', costo:'', venta:'', mayoreo:'', id_categoria:'',
            existencia:'', minimo:'', maximo:'', tipo_venta:'Unidad', id_proveedor:'', descripcion:''
        });
        setProfitPercentage('');
        setModalError('');
        setIsModalOpen(true);
    }, [setEditingProduct, setFormData, setProfitPercentage, setModalError, setIsModalOpen]);

    const openEditModal = useCallback((product) => {
        setEditingProduct(product);
        const cost = parseFloat(product.costo);
        const price = parseFloat(product.venta);
        setProfitPercentage(cost > 0 && price > 0 ? (((price - cost) / cost * 100).toFixed(2)) : '');

        // FIX CLAVE: Inicializar el formData EXPLICITAMENTE CONVIRTIENDO TODO A STRING
        // Esto resuelve el error '.trim is not a function' y asegura que los campos se muestren.
        setFormData({
            codigo: safeString(product.codigo),
            nombre: safeString(product.nombre),
            costo: safeString(product.costo),
            venta: safeString(product.venta),
            mayoreo: safeString(product.mayoreo),
            id_categoria: safeString(product.id_categoria),
            existencia: safeString(product.existencia),
            minimo: safeString(product.minimo),
            maximo: safeString(product.maximo),
            tipo_venta: safeString(product.tipo_venta),
            id_proveedor: safeString(product.id_proveedor),
            descripcion: safeString(product.descripcion)
        });

        setModalError('');
        setIsModalOpen(true);
    }, [setEditingProduct, setFormData, setProfitPercentage, setModalError, setIsModalOpen]);
    

    const openDeleteModal = useCallback((product) => { 
        setProductToDelete(product); 
        setIsDeleteModalOpen(true); 
    }, [setProductToDelete, setIsDeleteModalOpen]);

    const confirmDelete = useCallback(async () => {
        if (!setProductToDelete) return;
        try {
            const token = localStorage.getItem('token');
            // Usamos productToDelete para obtener el ID, ya que es el estado que se cargó con openDeleteModal
            await axios.delete(`/api/products/${setProductToDelete.id_producto}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchData();
            setIsDeleteModalOpen(false);
            setProductToDelete(null);
            showAlert({ title: 'Éxito', message: `El producto ${setProductToDelete.nombre} fue eliminado.` });
        } catch (err) {
            const data = err?.response?.data;
            const msg = data?.msg || 'No se pudo eliminar el producto.';
            showAlert({ title: 'Error', message: msg, type: 'error' });
            if (data?.reasons) {
                setArchivePrompt({ open: true, product: setProductToDelete, detail: data.reasons });
            }
        }
    }, [fetchData, setProductToDelete, setIsDeleteModalOpen, showAlert, setArchivePrompt]);

    const archiveProduct = useCallback(async (p) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`/api/products/${p.id_producto}/archive`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setArchivePrompt({ open: false, product: null, detail: null });
            setIsDeleteModalOpen(false);
            setProductToDelete(null);
            await fetchData();
            showAlert({ title: 'Archivado', message: `"${p.nombre}" fue archivado (inactivo).` });
        } catch (e) {
            showAlert({ title: 'Error', message: e?.response?.data?.msg || 'No se pudo archivar el producto.', type: 'error' });
        }
    }, [fetchData, showAlert, setIsDeleteModalOpen, setArchivePrompt, setProductToDelete]);
    

    const handleSaveProduct = useCallback(async (e) => {
        e.preventDefault();
        setModalError('');
        const f = formData;

        // 1. VALIDACIÓN DE CAMPOS OBLIGATORIOS
        const codigoOk = safeString(f.codigo).trim();
        const nombreOk = safeString(f.nombre).trim();
        const costoOk = safeString(f.costo).trim();
        const ventaOk = safeString(f.venta).trim();
        const existenciaOk = safeString(f.existencia).trim();

        if (!codigoOk || !nombreOk || !costoOk || !ventaOk || 
            // Existencia es obligatoria solo si estamos creando
            (!editingProduct && !existenciaOk)) 
        {
            setModalError('Los campos Código, Nombre, Costo, Venta son obligatorios. Existencia es obligatoria al crear.');
            return;
        }
        
        // 2. VALIDACIÓN DE TIPOS Y LÍMITES
        const cost = parseFloat(costoOk), 
              price = parseFloat(ventaOk), 
              wholesale = f.mayoreo ? parseFloat(safeString(f.mayoreo)) : null;

        const stock = parseInt(existenciaOk, 10); 
        const minStock = f.minimo ? parseInt(safeString(f.minimo), 10) : null;
        const maxStock = f.maximo ? parseInt(safeString(f.maximo), 10) : null;
        
        // La validación NaN para stock solo es necesaria si estamos creando
        if ([cost, price].some(isNaN) || (!editingProduct && isNaN(stock))) { 
            setModalError('Costo, Venta y Existencia (al crear) deben ser números válidos.'); 
            return; 
        }

        if (f.mayoreo && isNaN(wholesale)) { setModalError('Precio Mayoreo debe ser un número válido o estar vacío.'); return; }
        if (f.minimo && isNaN(minStock)) { setModalError('Stock Mínimo debe ser un número válido o estar vacío.'); return; }
        if (f.maximo && isNaN(maxStock)) { setModalError('Stock Máximo debe ser un número válido o estar vacío.'); return; }
        if (cost<0 || price<0 || (!editingProduct && stock<0) || (minStock??0)<0 || (maxStock??0)<0 || (wholesale??0)<0) { setModalError('Los precios y las cantidades de stock no pueden ser negativos.'); return; }
        if (price < cost) { setModalError('El precio de venta no puede ser menor que el costo.'); return; }
        if (wholesale !== null && wholesale > price) { setModalError('El precio de mayoreo no puede ser mayor que el de venta.'); return; }
        if (minStock !== null && maxStock !== null && minStock > maxStock) { setModalError('El stock mínimo no puede ser mayor que el máximo.'); return; }

        // 3. VALIDACIÓN DE DUPLICADOS
        const duplicate = allProductsRaw.find(p =>
            (editingProduct ? p.id_producto !== editingProduct.id_producto : true) &&
            (safeString(p.codigo).toLowerCase() === codigoOk.toLowerCase() || safeString(p.nombre).toLowerCase() === nombreOk.toLowerCase())
        );
        if (duplicate) {
            if (safeString(duplicate.codigo).toLowerCase() === codigoOk.toLowerCase()) setModalError(`Ya existe un producto con el código "${f.codigo}".`);
            else setModalError(`Ya existe un producto con el nombre "${f.nombre}".`);
            return;
        }

        // 4. ENVÍO DE DATOS
        const token = localStorage.getItem('token');
        const payload = {
            ...f,
            // Al editar, usamos la existencia original (Number) para que no se pierda al enviar, 
            // pero el backend la ignora (gracias a la corrección en productController.js)
            existencia: editingProduct ? editingProduct.existencia : stock, 
            mayoreo: f.mayoreo || null, minimo: f.minimo || null, maximo: f.maximo || null,
            id_categoria: f.id_categoria || null, id_proveedor: f.id_proveedor || null
        };
        try {
            if (editingProduct) {
                // Excluimos 'existencia' del payload de actualización (PUT)
                const { existencia, ...updatePayload } = payload; 
                await axios.put(`/api/products/${editingProduct.id_producto}`, updatePayload, { headers:{ Authorization:`Bearer ${token}` } });
            } else {
                await axios.post('/api/products', payload, { headers:{ Authorization:`Bearer ${token}` } });
            }
            setIsModalOpen(false);
            await fetchData();
        } catch (err) {
            setModalError(err.response?.data?.msg || 'Error al guardar el producto.');
        }
    }, [fetchData, setModalError, formData, editingProduct, allProductsRaw, setIsModalOpen]);
    

    return {
        openCreateModal,
        openEditModal,
        openDeleteModal,
        confirmDelete,
        archiveProduct,
        handleSaveProduct
    };
};

export default useProductManagement;
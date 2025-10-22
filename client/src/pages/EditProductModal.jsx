// EditProductModal.jsx
import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

/* ================================
    ESTILOS (Copias de InventoryManagement.jsx)
================================ */
const ModalOverlay = styled(motion.div)`position:fixed;inset:0;background:rgba(0,0,0,.7);display:flex;justify-content:center;align-items:center;z-index:1000;padding:1rem;`;
const ModalContent = styled.div`
    background:#fdfdff;padding:2.5rem;border-radius:16px;max-height:90vh;overflow-y:auto;box-shadow:0 10px 30px rgba(0,0,0,.2);
    width:90vw;max-width:450px;@media(min-width:768px){max-width:800px;}
`;
const ModalTitle = styled.h2`margin:0 0 2rem;color:#1a202c;text-align:center;font-size:1.75rem;`;
const ModalError = styled.p`color:#dc3545;font-size:.9rem;text-align:center;margin-bottom:1rem;min-height:1.2rem;`;
const InputGrid = styled.div`display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1.5rem;`;
const FormGroup = styled.div`display:flex;flex-direction:column;`;
const Label = styled.label`margin-bottom:.5rem;color:#495057;font-weight:600;`;
const Input = styled.input`width:100%;padding:.8rem 1rem;border-radius:8px;border:1px solid #ced4da;font-size:1rem;`;
const Select = styled.select`
    width:100%;padding:.75rem 1rem;border-radius:8px;border:1px solid #e2e8f0;font-size:1rem;background:#fff;cursor:pointer;
`;
const ModalActions = styled.div`
    display:flex;justify-content:flex-end;gap:1rem;margin-top:2rem;@media(max-width:500px){justify-content:space-between}
`;
const Button = styled(motion.button)`
    padding:.6rem 1.2rem;border:none;border-radius:8px;font-weight:600;color:#fff;display:inline-flex;align-items:center;gap:.5rem;cursor:pointer;font-size:.9rem;
    transition:background-color .2s;box-shadow:0 4px 6px rgba(0,0,0,.1);
    background:${p=>p.primary?'#28a745':p.secondary?'#6c757d':p.tertiary?'#17a2b8':'#6c757d'};
    &:hover{background:${p=>p.primary?'#218838':p.secondary?'#5a6268':p.tertiary?'#138496':'#5a6268'};}
    &:disabled{opacity:.6;cursor:not-allowed;}
`;
const SaveButton = styled(Button)`background:#007bff;color:#fff;&:hover{background:#0069d9}`;
const CancelButton = styled(Button)`background:#f8f9fa;color:#6c757d;border:1px solid #ced4da;&:hover{background:#e2e6ea}`;


/* ================================
    COMPONENTE DE EDICIÓN
================================ */
const EditProductModal = ({ 
    isOpen, 
    onClose, 
    product, 
    categories, 
    providers, 
    showAlert, 
    onProductUpdated,
    allProductsRaw
}) => {
    // Si no está abierto o no hay producto, no renderiza.
    if (!isOpen || !product) return null; 

    // Estado local para el formulario de edición
    const [formData, setFormData] = useState({
        codigo: '', nombre: '', costo: '', venta: '', mayoreo: '', id_categoria: '',
        existencia: '', minimo: '', maximo: '', tipo_venta: 'Unidad', id_proveedor: '', descripcion: ''
    });
    const [profitPercentage, setProfitPercentage] = useState('');
    const [modalError, setModalError] = useState('');

    // Cargar datos del producto al abrir el modal
    useEffect(() => {
        if (product) {
            const cost = parseFloat(product.costo);
            const price = parseFloat(product.venta);
            setProfitPercentage(cost > 0 && price > 0 ? (((price - cost) / cost * 100).toFixed(2)) : '');
            setFormData({
                ...product,
                // Convertir la existencia a STRING si es número (para el input controlado)
                existencia: product.existencia !== undefined && product.existencia !== null 
                    ? String(product.existencia) 
                    : '',
                // Asegurar valores válidos para selects si son nulos
                id_categoria: product.id_categoria || '',
                id_proveedor: product.id_proveedor || '',
                mayoreo: product.mayoreo || '',
                minimo: product.minimo || '',
                maximo: product.maximo || '',
            });
            setModalError('');
        }
    }, [product]);

    // Manejo de cambios en el formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Bloquear la edición manual del campo 'existencia'
        if (name === 'existencia') {
            setModalError('La existencia solo se puede ajustar con el botón de "Ajustar Stock" en la tarjeta del producto.');
            return;
        }

        const next = { ...formData, [name]: value };
        
        // Recalcular porcentaje de ganancia
        if (name === 'costo' || name === 'venta') {
            const cost = parseFloat(next.costo); 
            const price = parseFloat(next.venta);
            setProfitPercentage(cost > 0 && price > 0 ? (((price - cost) / cost * 100).toFixed(2)) : '');
        }

        setFormData(next);
        setModalError('');
    };

    // Manejo de cambios en el porcentaje de ganancia
    const handlePercentageChange = (e) => {
        const percentage = e.target.value;
        setProfitPercentage(percentage);
        const cost = parseFloat(formData.costo);
        if (cost > 0 && percentage) {
            setFormData(prev => ({ 
                ...prev, 
                venta: (cost * (1 + parseFloat(percentage) / 100)).toFixed(2) 
            }));
        }
    };

    // Lógica para guardar la edición
    const handleSaveProduct = async (e) => {
        e.preventDefault();
        setModalError('');
        const f = formData;

        // Validaciones de campos obligatorios
        const requiredFields = ['codigo', 'nombre', 'costo', 'venta'];
        if (requiredFields.some(field => !f[field] || !String(f[field]).trim())) { 
            setModalError('Los campos Código, Nombre, Costo y Venta son obligatorios.');
            return;
        }

        // Validaciones numéricas y lógicas
        const cost = parseFloat(f.costo), 
              price = parseFloat(f.venta), 
              wholesale = f.mayoreo ? parseFloat(f.mayoreo) : null;
        
        // Notar que existencia no se valida aquí porque está deshabilitado
        const minStock = f.minimo ? parseInt(f.minimo, 10) : null;
        const maxStock = f.maximo ? parseInt(f.maximo, 10) : null;

        if (isNaN(cost) || isNaN(price)) { setModalError('Costo y Venta deben ser números válidos.'); return; }
        if (f.mayoreo && isNaN(wholesale)) { setModalError('Precio Mayoreo debe ser un número válido o estar vacío.'); return; }
        if (f.minimo && isNaN(minStock)) { setModalError('Stock Mínimo debe ser un número válido o estar vacío.'); return; }
        if (f.maximo && isNaN(maxStock)) { setModalError('Stock Máximo debe ser un número válido o estar vacío.'); return; }
        if (cost < 0 || price < 0 || (minStock ?? 0) < 0 || (maxStock ?? 0) < 0 || (wholesale ?? 0) < 0) { setModalError('Los precios y las cantidades de stock no pueden ser negativos.'); return; }
        if (price < cost) { setModalError('El precio de venta no puede ser menor que el costo.'); return; }
        if (wholesale !== null && wholesale > price) { setModalError('El precio de mayoreo no puede ser mayor que el de venta.'); return; }
        if (minStock !== null && maxStock !== null && minStock > maxStock) { setModalError('El stock mínimo no puede ser mayor que el máximo.'); return; }

        // Validar duplicados (excluyendo el producto actual)
        const duplicate = allProductsRaw.find(p =>
            p.id_producto !== product.id_producto &&
            (p.codigo?.toLowerCase() === f.codigo.trim().toLowerCase() || p.nombre?.toLowerCase() === f.nombre.trim().toLowerCase())
        );
        if (duplicate) {
            if ((duplicate.codigo || '').toLowerCase() === f.codigo.trim().toLowerCase()) setModalError(`Ya existe otro producto con el código "${f.codigo}".`);
            else setModalError(`Ya existe otro producto con el nombre "${f.nombre}".`);
            return;
        }

        const token = localStorage.getItem('token');
        
        // PAYLOAD DE EDICIÓN
        const payload = {
            ...f,
            // Enviamos el valor de existencia viejo o el del formulario (que está deshabilitado)
            existencia: product.existencia, 
            mayoreo: f.mayoreo || null, 
            minimo: f.minimo || null, 
            maximo: f.maximo || null,
            id_categoria: f.id_categoria || null, 
            id_proveedor: f.id_proveedor || null
        };
        
        // Desestructurar para el PUT (excluyendo la existencia del formulario que está deshabilitada)
        const { existencia: formExistencia, ...updatePayload } = payload; 
        
        try {
            await axios.put(`/api/products/${product.id_producto}`, updatePayload, { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            
            onClose();
            showAlert({ title: 'Éxito', message: 'Producto actualizado correctamente.' });
            onProductUpdated(); // Llama a fetchData
        } catch (err) {
            setModalError(err.response?.data?.msg || 'Error al actualizar el producto.');
        }
    };

    return (
        <ModalOverlay onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}>
                <ModalContent as="div" onClick={(e) => e.stopPropagation()}>
                    <form onSubmit={handleSaveProduct}>
                        <ModalTitle>Editar Producto</ModalTitle>
                        {modalError && <ModalError>{modalError}</ModalError>}
                        
                        <InputGrid>
                            <FormGroup><Label>Código</Label><Input name="codigo" value={formData.codigo} onChange={handleInputChange} required /></FormGroup>
                            <FormGroup><Label>Nombre</Label><Input name="nombre" value={formData.nombre} onChange={handleInputChange} required /></FormGroup>
                            <FormGroup><Label>Costo (C$)</Label><Input type="number" step="0.01" name="costo" value={formData.costo} onChange={handleInputChange} required /></FormGroup>
                            <FormGroup><Label>% Ganancia</Label><Input type="number" step="0.01" value={profitPercentage} onChange={handlePercentageChange} placeholder="ej: 50" /></FormGroup>
                            <FormGroup><Label>Precio Venta (C$)</Label><Input type="number" step="0.01" name="venta" value={formData.venta} onChange={handleInputChange} required /></FormGroup>
                            <FormGroup><Label>Precio Mayoreo (C$)</Label><Input type="number" step="0.01" name="mayoreo" value={formData.mayoreo} onChange={handleInputChange} /></FormGroup>
                            
                            <FormGroup>
                                <Label>Existencia</Label>
                                <Input
                                    type="number"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    name="existencia"
                                    value={formData.existencia}
                                    onChange={handleInputChange}
                                    required
                                    disabled={true} // Deshabilita el input
                                    style={{backgroundColor: '#f0f0f0'}} // Color para indicar que está deshabilitado
                                />
                                <small style={{marginTop: '5px', color: '#dc3545', fontWeight: 'bold'}}>¡Ajustar solo con el botón de stock!</small>
                            </FormGroup>

                            <FormGroup><Label>Stock Mínimo</Label><Input type="number" inputMode="numeric" pattern="[0-9]*" name="minimo" value={formData.minimo} onChange={handleInputChange} /></FormGroup>
                            <FormGroup><Label>Stock Máximo</Label><Input type="number" inputMode="numeric" pattern="[0-9]*" name="maximo" value={formData.maximo} onChange={handleInputChange} /></FormGroup>
                            <FormGroup><Label>Descripción</Label><Input name="descripcion" value={formData.descripcion} onChange={handleInputChange} placeholder="Detalles del producto" /></FormGroup>
                            
                            <FormGroup><Label>Categoría</Label>
                                <Select name="id_categoria" value={formData.id_categoria} onChange={handleInputChange}>
                                    <option value="">-- Sin Categoría --</option>
                                    {categories.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
                                </Select>
                            </FormGroup>
                            <FormGroup><Label>Proveedor</Label>
                                <Select name="id_proveedor" value={formData.id_proveedor} onChange={handleInputChange}>
                                    <option value="">-- Sin Proveedor --</option>
                                    {providers.map(p => <option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre}</option>)}
                                </Select>
                            </FormGroup>
                            <FormGroup><Label>Tipo de Venta</Label>
                                <Select name="tipo_venta" value={formData.tipo_venta} onChange={handleInputChange}>
                                    <option value="Unidad">Unidad</option>
                                    <option value="Juego">Juego</option>
                                    <option value="Kit">Kit</option>
                                </Select>
                            </FormGroup>
                        </InputGrid>

                        <ModalActions>
                            <CancelButton type="button" onClick={onClose}>Cancelar</CancelButton>
                            <SaveButton type="submit">Guardar Cambios</SaveButton>
                        </ModalActions>
                    </form>
                </ModalContent>
            </motion.div>
        </ModalOverlay>
    );
};

export default EditProductModal;
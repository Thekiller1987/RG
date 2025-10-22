// EditProductModal.jsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

// --- Estilos ---
const ModalOverlay = styled(motion.div)`position:fixed;inset:0;background:rgba(0,0,0,.7);display:flex;justify-content:center;align-items:center;z-index:1000;padding:1rem;`;
const ModalContent = styled.div`background:#fdfdff;padding:2.5rem;border-radius:16px;max-height:90vh;overflow-y:auto;box-shadow:0 10px 30px rgba(0,0,0,.2);width:90vw;max-width:450px;@media(min-width:768px){max-width:800px;}`;
const ModalTitle = styled.h2`margin:0 0 2rem;color:#1a202c;text-align:center;font-size:1.75rem;`;
const ModalError = styled.p`color:#dc3545;font-size:.9rem;text-align:center;margin-bottom:1rem;min-height:1.2rem;`;
const InputGrid = styled.div`display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1.5rem;`;
const FormGroup = styled.div`display:flex;flex-direction:column;`;
const Label = styled.label`margin-bottom:.5rem;color:#495057;font-weight:600;`;
const Input = styled.input`width:100%;padding:.8rem 1rem;border-radius:8px;border:1px solid #ced4da;font-size:1rem;`;
const Select = styled.select`width:100%;padding:.75rem 1rem;border-radius:8px;border:1px solid #e2e8f0;font-size:1rem;background:#fff;cursor:pointer;`;
const ModalActions = styled.div`display:flex;justify-content:flex-end;gap:1rem;margin-top:2rem;@media(max-width:500px){justify-content:space-between}`;
const Button = styled(motion.button)`padding:.6rem 1.2rem;border:none;border-radius:8px;font-weight:600;color:#fff;display:inline-flex;align-items:center;gap:.5rem;cursor:pointer;font-size:.9rem;transition:background-color .2s;box-shadow:0 4px 6px rgba(0,0,0,.1);`;
const SaveButton = styled(Button)`background:#007bff;color:#fff;&:hover{background:#0069d9}`;
const CancelButton = styled(Button)`background:#f8f9fa;color:#6c757d;border:1px solid #ced4da;&:hover{background:#e2e6ea}`;

const EditProductModal = ({ isOpen, onClose, onSave, productToEdit, categories, providers, allProductsRaw }) => {
  const [formData, setFormData] = useState({});
  const [profitPercentage, setProfitPercentage] = useState('');
  const [modalError, setModalError] = useState('');

  useEffect(() => {
    if (productToEdit) {
        setFormData({ ...productToEdit, mayoreo: productToEdit.mayoreo ?? '', minimo: productToEdit.minimo ?? '', maximo: productToEdit.maximo ?? '', id_categoria: productToEdit.id_categoria ?? '', id_proveedor: productToEdit.id_proveedor ?? '', descripcion: productToEdit.descripcion ?? '' });
        const cost = parseFloat(productToEdit.costo);
        const price = parseFloat(productToEdit.venta);
        setProfitPercentage(cost > 0 && price > 0 ? (((price - cost) / cost * 100).toFixed(2)) : '');
        setModalError('');
    }
  }, [productToEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'existencia') return;
    const next = { ...formData, [name]: value };
    if (name === 'costo' || name === 'venta') {
      const cost = parseFloat(next.costo);
      const price = parseFloat(next.venta);
      setProfitPercentage(cost > 0 && price > 0 ? (((price - cost) / cost * 100).toFixed(2)) : '');
    }
    setFormData(next);
    setModalError('');
  };

  const handlePercentageChange = (e) => {
    const percentage = e.target.value;
    setProfitPercentage(percentage);
    const cost = parseFloat(formData.costo);
    if (cost > 0 && percentage) {
      setFormData(prev => ({ ...prev, venta: (cost * (1 + parseFloat(percentage) / 100)).toFixed(2) }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setModalError('');
    const f = formData;

    if (!f.codigo || !f.nombre || !f.costo || !f.venta) {
      setModalError('Los campos Código, Nombre, Costo y Venta son obligatorios.');
      return;
    }
    
    // ✅ **LA SOLUCIÓN**: Añadimos la existencia original para satisfacer cualquier caché.
    const payload = {
        codigo: String(f.codigo).trim(),
        nombre: String(f.nombre).trim(),
        descripcion: String(f.descripcion).trim(),
        tipo_venta: f.tipo_venta,
        costo: parseFloat(f.costo),
        venta: parseFloat(f.venta),
        existencia: productToEdit.existencia, // <-- ESTA LÍNEA ES LA CLAVE
        mayoreo: f.mayoreo ? parseFloat(f.mayoreo) : null,
        minimo: f.minimo ? parseInt(f.minimo, 10) : null,
        maximo: f.maximo ? parseInt(f.maximo, 10) : null,
        id_categoria: f.id_categoria ? parseInt(f.id_categoria, 10) : null,
        id_proveedor: f.id_proveedor ? parseInt(f.id_proveedor, 10) : null,
    };

    if (isNaN(payload.costo) || isNaN(payload.venta) || (payload.mayoreo !== null && isNaN(payload.mayoreo)) || (payload.minimo !== null && isNaN(payload.minimo)) || (payload.maximo !== null && isNaN(payload.maximo))) {
        setModalError('Por favor, introduce números válidos para los precios y stocks.');
        return;
    }
    if (payload.venta < payload.costo) { 
        setModalError('El precio de venta no puede ser menor que el costo.'); 
        return; 
    }
    
    const duplicate = allProductsRaw.find(p => p.id_producto !== productToEdit.id_producto && (p.codigo?.toLowerCase() === payload.codigo.toLowerCase() || p.nombre?.toLowerCase() === payload.nombre.toLowerCase()));
    if (duplicate) { 
        setModalError(`Ya existe otro producto con ese código o nombre.`); 
        return; 
    }

    onSave(payload, productToEdit.id_producto);
  };

  if (!isOpen || !productToEdit) return null;

  return (
    <ModalOverlay onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}>
        <ModalContent as="div" onClick={(e) => e.stopPropagation()}>
          <form onSubmit={handleSubmit}>
            <ModalTitle>Editar Producto</ModalTitle>
            {modalError && <ModalError>{modalError}</ModalError>}
            <InputGrid>
                <FormGroup><Label>Código</Label><Input name="codigo" value={formData.codigo || ''} onChange={handleInputChange} required /></FormGroup>
                <FormGroup><Label>Nombre</Label><Input name="nombre" value={formData.nombre || ''} onChange={handleInputChange} required /></FormGroup>
                <FormGroup><Label>Costo (C$)</Label><Input type="number" step="0.01" name="costo" value={formData.costo || ''} onChange={handleInputChange} required /></FormGroup>
                <FormGroup><Label>% Ganancia</Label><Input type="number" step="0.01" value={profitPercentage || ''} onChange={handlePercentageChange} placeholder="ej: 50" /></FormGroup>
                <FormGroup><Label>Precio Venta (C$)</Label><Input type="number" step="0.01" name="venta" value={formData.venta || ''} onChange={handleInputChange} required /></FormGroup>
                <FormGroup><Label>Precio Mayoreo (C$)</Label><Input type="number" step="0.01" name="mayoreo" value={formData.mayoreo || ''} onChange={handleInputChange} /></FormGroup>
                <FormGroup><Label>Existencia</Label><Input name="existencia" value={formData.existencia || ''} disabled style={{backgroundColor: '#f0f0f0'}} /><small style={{marginTop: '5px', color: '#dc3545', fontWeight: 'bold'}}>¡Ajustar solo con el botón de stock!</small></FormGroup>
                <FormGroup><Label>Stock Mínimo</Label><Input type="number" inputMode="numeric" pattern="[0-9]*" name="minimo" value={formData.minimo || ''} onChange={handleInputChange} /></FormGroup>
                <FormGroup><Label>Stock Máximo</Label><Input type="number" inputMode="numeric" pattern="[0-9]*" name="maximo" value={formData.maximo || ''} onChange={handleInputChange} /></FormGroup>
                <FormGroup><Label>Descripción</Label><Input name="descripcion" value={formData.descripcion || ''} onChange={handleInputChange} placeholder="Detalles del producto" /></FormGroup>
                <FormGroup><Label>Categoría</Label><Select name="id_categoria" value={formData.id_categoria || ''} onChange={handleInputChange}><option value="">-- Sin Categoría --</option>{categories.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}</Select></FormGroup>
                <FormGroup><Label>Proveedor</Label><Select name="id_proveedor" value={formData.id_proveedor || ''} onChange={handleInputChange}><option value="">-- Sin Proveedor --</option>{providers.map(p => <option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre}</option>)}</Select></FormGroup>
                <FormGroup><Label>Tipo de Venta</Label><Select name="tipo_venta" value={formData.tipo_venta || 'Unidad'} onChange={handleInputChange}><option value="Unidad">Unidad</option><option value="Juego">Juego</option><option value="Kit">Kit</option></Select></FormGroup>
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
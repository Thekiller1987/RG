import React, { useState, useEffect, useCallback, useMemo, useRef, useDeferredValue } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaPlus, FaBoxOpen, FaTags, FaTruck, FaTrash, FaEdit, FaArrowLeft, FaHistory, FaSpinner,
  FaSearch, FaTimes, FaPlusCircle, FaMinusCircle, FaExclamationTriangle,
  FaBarcode, FaFont, FaImage, FaEye
} from 'react-icons/fa';

/* ================================
   STYLED COMPONENTS LOCALES
================================ */
const PageWrapper = styled.div`
  padding: 20px;
  background-color: #f0f2f5;
  min-height: 100vh;
`;

const CenteredMessage = styled.div`
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  height: 50vh; opacity: 0.7; font-size: 1.2rem;
`;

const Spinner = styled(FaSpinner)`
  animation: ${keyframes`from {transform:rotate(0deg);} to {transform:rotate(360deg);}`} 1s linear infinite;
  font-size: 2rem; margin-bottom: 1rem;
`;

const BackButton = styled(Link)`
  display: inline-flex; align-items: center; gap: 8px;
  background: white; padding: 8px 16px; border-radius: 8px;
  color: #4a5568; text-decoration: none; font-weight: 500;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1); transition: all 0.2s;
  margin-bottom: 1rem;
  &:hover { transform: translateY(-1px); box-shadow: 0 4px 6px rgba(0,0,0,0.1); color: #2d3748; }
`;

const HeaderContainer = styled.div`
  display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;
  @media(min-width: 768px) { flex-direction: row; justify-content: space-between; align-items: center; }
`;

const Title = styled.h1`
  font-size: 1.8rem; color: #2d3748; display: flex; align-items: center; gap: 0.5rem; margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex; gap: 0.5rem; flex-wrap: wrap;
`;

const Button = styled.button`
  background-color: ${p => p.primary ? '#3b82f6' : p.secondary ? '#a0aec0' : p.tertiary ? '#fff' : '#e2e8f0'};
  color: ${p => p.tertiary ? '#4a5568' : '#fff'};
  border: ${p => p.tertiary ? '1px solid #cbd5e1' : 'none'};
  padding: 0.6rem 1rem; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: background 0.2s;
  &:hover { opacity: 0.9; transform: translateY(-1px); }
`;

const FilterContainer = styled.div`
  display: flex; flex-direction: column; gap: 1rem; background: white; padding: 1rem; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 1.5rem;
  @media(min-width: 768px) { flex-direction: row; align-items: center; }
`;

const SearchInputWrapper = styled.div`
  position: relative; flex: 1;
`;

const SearchInput = styled.input`
  width: 100%; padding: 0.75rem 1rem 0.75rem 2.5rem; border: 2px solid #e2e8f0; border-radius: 8px; outline: none; transition: border-color 0.2s;
  &:focus { border-color: #3b82f6; }
`;

const FilterToggleButton = styled.button`
  background: ${p => p.$active ? '#ebf8ff' : '#fff'}; border: 1px solid ${p => p.$active ? '#3b82f6' : '#e2e8f0'};
  color: ${p => p.$active ? '#3b82f6' : '#718096'}; padding: 0.7rem; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center;
`;

const Select = styled.select`
  padding: 0.7rem; border: 2px solid #e2e8f0; border-radius: 8px; background: white; color: #4a5568; outline: none;
  &:focus { border-color: #3b82f6; }
`;

const MobileCardGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;
`;

const ProductCard = styled(motion.div)`
  background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; display: flex; flex-direction: column; transition: transform 0.2s;
  
  .image-placeholder {
    height: 160px; background: #f7fafc; display: flex; align-items: center; justify-content: center; position: relative; cursor: pointer; border-bottom: 1px solid #edf2f7;
    img { width: 100%; height: 100%; object-fit: cover; }
    .no-image-text { color: #cbd5e1; font-size: 3rem; }
    .overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.3); color: white; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; font-size: 2rem; }
    &:hover .overlay { opacity: 1; }
  }
`;

const CardHeader = styled.div` padding: 1rem; `;
const CardTitle = styled.h3` font-size: 1.1rem; margin: 0; color: #2d3748; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; `;
const CardCode = styled.div` font-size: 0.85rem; color: #718096; margin-top: 2px; `;

const CardBody = styled.div` padding: 0 1rem 1rem; display: flex; flex-wrap: wrap; gap: 0.5rem; `;
const InfoTag = styled.div`
  background: #f7fafc; padding: 4px 8px; border-radius: 4px; border: 1px solid #edf2f7; display: flex; flex-direction: column; align-items: flex-start; min-width: 80px; flex: 1;
  span { font-size: 0.7rem; color: #718096; text-transform: uppercase; }
  strong { color: #2d3748; font-size: 0.95rem; }
`;
const StockTag = styled(InfoTag)`
  background: ${p => p.$out ? '#fff5f5' : p.$low ? '#fffaf0' : '#f0fff4'};
  border-color: ${p => p.$out ? '#feb2b2' : p.$low ? '#fbd38d' : '#9ae6b4'};
  strong { color: ${p => p.$out ? '#c53030' : p.$low ? '#c05621' : '#2f855a'}; }
`;

const CardFooter = styled.div`
  margin-top: auto; padding: 1rem; background: #f8fafc; border-top: 1px solid #e2e8f0; display: flex; gap: 0.5rem;
`;
const ActionButton = styled.button`
  flex: 1; padding: 0.5rem; border-radius: 6px; border: 1px solid; cursor: pointer; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 4px;
  &.adjust { background: white; border-color: #cbd5e1; color: #4a5568; &:hover { background: #f1f5f9; } }
  &.edit { background: #ebf8ff; border-color: #bee3f8; color: #3182ce; &:hover { background: #bee3f8; } }
  &.delete { background: #fff5f5; border-color: #fed7d7; color: #e53e3e; &:hover { background: #fed7d7; } }
`;

/* ESTILOS MODAL (Simples para que funcione rápido) */
const ModalOverlay = styled(motion.div)`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 50; display: flex; align-items: center; justify-content: center; padding: 20px;
`;
const ModalContent = styled.div`
  background: white; width: 100%; max-width: 600px; border-radius: 12px; padding: 2rem; max-height: 90vh; overflow-y: auto; position: relative; box-shadow: 0 10px 25px rgba(0,0,0,0.1);
`;
const ModalTitle = styled.h2` margin-top: 0; color: #2d3748; margin-bottom: 1.5rem; `;
const ModalError = styled.div`
  background: #fff5f5; color: #c53030; padding: 10px; border-radius: 6px; margin-bottom: 1rem; border: 1px solid #fed7d7; font-size: 0.9rem;
`;
const InputGrid = styled.div` display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem; @media(max-width: 500px){ grid-template-columns: 1fr; } `;
const FormGroup = styled.div` display: flex; flex-direction: column; gap: 5px; `;
const Label = styled.label` font-size: 0.85rem; font-weight: 600; color: #4a5568; `;
const Input = styled.input`
  padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px;
  &:focus { outline: none; border-color: #3b82f6; ring: 2px solid rgba(59,130,246,0.2); }
`;
const ModalActions = styled.div` display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; `;
const CancelButton = styled.button` background: transparent; color: #718096; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 6px; cursor: pointer; &:hover { background: #f7fafc; } `;
const SaveButton = styled.button` background: #3b82f6; color: white; border: none; padding: 8px 20px; border-radius: 6px; cursor: pointer; font-weight: 600; &:hover { background: #2563eb; } `;

/* ================================
   HELPER: IMAGE UPLOAD & COMPRESS
================================ */
const ImageUpload = ({ currentImage, onImageChange }) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(currentImage || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { setPreview(currentImage); }, [currentImage]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      alert('Solo se permiten imágenes.');
      return;
    }

    setLoading(true);
    try {
      const compressed = await compressImage(file);
      setPreview(compressed);
      onImageChange(compressed);
    } catch (err) {
      console.error(err);
      alert('Error al procesar la imagen.');
    } finally {
      setLoading(false);
    }
  };

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 500; // Tamaño suficiente para thumbnail/preview
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Compresión JPEG calidad 0.7
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(dataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginBottom: '1rem', border: '1px dashed #ccc', padding: '1rem', borderRadius: '8px' }}>
      {loading ? <Spinner /> : (
        preview ? (
          <div style={{ position: 'relative', width: '120px', height: '120px' }}>
            <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }} />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setPreview(null); onImageChange(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
              style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <FaTimes size={12} />
            </button>
          </div>
        ) : (
          <div onClick={() => fileInputRef.current.click()} style={{ cursor: 'pointer', color: '#6c757d', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <FaImage size={32} />
            <span style={{ fontSize: '0.9rem', marginTop: '5px' }}>Subir Foto</span>
          </div>
        )
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
    </div>
  );
};

const ImageViewModal = ({ isOpen, imageSrc, onClose }) => {
  if (!isOpen || !imageSrc) return null;
  return (
    <ModalOverlay onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ position: 'relative', maxWidth: '90%', maxHeight: '90vh' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: -15, right: -15, background: 'white', width: 30, height: 30, borderRadius: '50%', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
        <img src={imageSrc} alt="Full view" style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '8px', boxShadow: '0 5px 20px rgba(0,0,0,0.5)' }} />
      </motion.div>
    </ModalOverlay>
  );
};

const norm = (str) => String(str || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const MAX_RESULTS_SEARCH = 100;
const PRODUCTS_INITIAL_LOAD = 20;
const SLICE_STEP = 20;
const LARGE_LIST_CUTOFF = 500;

// ... (Rest of existing imports and constants)

/* ==================================
   COMPONENTES DE MODAL FALTANTES
================================== */

const AlertModal = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;
  return (
    <ModalOverlay onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <ModalContent as="div" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', textAlign: 'center' }}>
        <ModalTitle>{title}</ModalTitle>
        <p style={{ color: '#4a5568', marginBottom: '20px' }}>{message}</p>
        <SaveButton onClick={onClose} style={{ width: '100%' }}>Aceptar</SaveButton>
      </ModalContent>
    </ModalOverlay>
  );
};

const ConfirmDialog = ({ open, onCancel, onConfirm, title, message, confirmLabel, danger }) => {
  if (!open) return null;
  return (
    <ModalOverlay onClick={onCancel} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <ModalContent as="div" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px' }}>
        <ModalTitle style={{ color: danger ? '#e53e3e' : '#2d3748' }}>{title}</ModalTitle>
        <div style={{ marginBottom: '25px', color: '#4a5568' }}>{message}</div>
        <ModalActions>
          <CancelButton onClick={onCancel}>Cancelar</CancelButton>
          <SaveButton onClick={onConfirm} style={{ background: danger ? '#e53e3e' : '#3b82f6' }}>{confirmLabel || 'Confirmar'}</SaveButton>
        </ModalActions>
      </ModalContent>
    </ModalOverlay>
  );
};

const ManagementModal = ({ title, items, onAdd, onDelete, onClose }) => {
  const [newItem, setNewItem] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newItem.trim()) {
      onAdd(newItem);
      setNewItem('');
    }
  };
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalTitle>{title}</ModalTitle>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <Input value={newItem} onChange={e => setNewItem(e.target.value)} placeholder="Nuevo nombre..." style={{ flex: 1 }} />
          <SaveButton type="submit"><FaPlus /> Agregar</SaveButton>
        </form>
        <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {items.map((item, idx) => {
            // Detectar si es categoría o proveedor
            const id = item.id_categoria || item.id_proveedor || idx;
            const nombre = item.nombre;
            return (
              <div key={id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f7fafc', borderRadius: '8px', alignItems: 'center' }}>
                <span>{nombre}</span>
                <button onClick={() => onDelete(id)} style={{ color: '#e53e3e', background: 'none', border: 'none', cursor: 'pointer' }}><FaTrash /></button>
              </div>
            );
          })}
          {items.length === 0 && <p style={{ textAlign: 'center', color: '#a0aec0' }}>No hay elementos registrados.</p>}
        </div>
        <ModalActions>
          <CancelButton onClick={onClose}>Cerrar</CancelButton>
        </ModalActions>
      </ModalContent>
    </ModalOverlay>
  );
};

const StockAdjustmentModal = ({ isOpen, product, onClose, onConfirm }) => {
  const [cantidad, setCantidad] = useState('');
  const [razon, setRazon] = useState('');
  const [predefinedReason, setPredefinedReason] = useState('');

  if (!isOpen || !product) return null;

  const handlePredefinedChange = (e) => {
    const val = e.target.value;
    setPredefinedReason(val);
    if (val) setRazon(val);
    else setRazon('');
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <ModalTitle>Ajustar Stock: {product.nombre}</ModalTitle>
        <div style={{ marginBottom: '15px' }}>
          <p><strong>Stock Actual:</strong> {product.existencia}</p>
        </div>
        <FormGroup style={{ marginBottom: '15px' }}>
          <Label>Cantidad (Positivo para agregar, Negativo para restar)</Label>
          <Input
            type="number"
            value={cantidad}
            onChange={e => setCantidad(e.target.value)}
            placeholder="Ej: 10 o -5"
            autoFocus
          />
        </FormGroup>
        <FormGroup style={{ marginBottom: '10px' }}>
          <Label>Razón (Seleccionar)</Label>
          <Select value={predefinedReason} onChange={handlePredefinedChange}>
            <option value="">-- Escribir manualmente --</option>
            <option value="Compra">Compra / Resurtido</option>
            <option value="Ajuste Inventario">Ajuste de Inventario</option>
            <option value="Devolución">Devolución Cliente</option>
            <option value="Dañado">Producto Dañado/Merma</option>
            <option value="Uso Interno">Uso Interno</option>
          </Select>
        </FormGroup>
        <FormGroup style={{ marginBottom: '20px' }}>
          <Label>Razón (Manual)</Label>
          <Input
            type="text"
            value={razon}
            onChange={e => { setRazon(e.target.value); setPredefinedReason(''); }}
            placeholder="Especifique el motivo..."
          />
        </FormGroup>
        <ModalActions>
          <CancelButton onClick={onClose}>Cancelar</CancelButton>
          <SaveButton onClick={() => {
            const val = parseInt(cantidad, 10);
            if (!isNaN(val) && val !== 0 && razon.trim()) {
              onConfirm(product, val, razon);
            } else {
              alert('Debe ingresar una cantidad válida y una razón.');
            }
          }}>Aplicar Ajuste</SaveButton>
        </ModalActions>
      </ModalContent>
    </ModalOverlay>
  );
};

const InventoryHistoryModal = ({ onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/products/inventory/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistory(res.data);
      } catch (err) {
        console.error(err);
        setError('No se pudo cargar el historial.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <ModalOverlay onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <ModalContent onClick={e => e.stopPropagation()} $large>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <ModalTitle style={{ margin: 0 }}><FaHistory /> Historial de Movimientos</ModalTitle>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', fontSize: '1.2rem', cursor: 'pointer' }}><FaTimes /></button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}><Spinner /></div>
        ) : error ? (
          <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#f7fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '10px' }}>Fecha</th>
                  <th style={{ padding: '10px' }}>Producto</th>
                  <th style={{ padding: '10px' }}>Movimiento</th>
                  <th style={{ padding: '10px' }}>Detalles</th>
                  <th style={{ padding: '10px' }}>Usuario</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={h.id_movimiento} style={{ borderBottom: '1px solid #edf2f7' }}>
                    <td style={{ padding: '10px' }}>{new Date(h.fecha).toLocaleString()}</td>
                    <td style={{ padding: '10px', fontWeight: '600' }}>{h.nombre_producto || h.codigo_producto || 'N/A'}</td>
                    <td style={{ padding: '10px' }}>
                      <span style={{
                        padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold',
                        background: h.tipo_movimiento === 'VENTA' ? '#c6f6d5' : h.tipo_movimiento === 'CREACION' ? '#bee3f8' : '#fed7d7',
                        color: h.tipo_movimiento === 'VENTA' ? '#22543d' : h.tipo_movimiento === 'CREACION' ? '#2b6cb0' : '#822727'
                      }}>
                        {h.tipo_movimiento}
                      </span>
                    </td>
                    <td style={{ padding: '10px', color: '#4a5568' }}>{h.detalles}</td>
                    <td style={{ padding: '10px', color: '#718096' }}>{h.nombre_usuario || 'Sistema'}</td>
                  </tr>
                ))}
                {history.length === 0 && (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No hay movimientos registrados.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <ModalActions>
          <CancelButton onClick={onClose}>Cerrar</CancelButton>
        </ModalActions>
      </ModalContent>
    </ModalOverlay>
  );
};

/* ==================================
  MODAL DE CREACIÓN ACTUALIZADO
================================== */
const CreateProductModal = ({ isOpen, onClose, onSave, categories, providers, allProductsRaw }) => {
  const [formData, setFormData] = useState({
    codigo: '', nombre: '', costo: '', venta: '', mayoreo: '', id_categoria: '',
    existencia: '', minimo: '', maximo: '', tipo_venta: 'Unidad', id_proveedor: '', descripcion: '', imagen: null
  });
  const [profitPercentage, setProfitPercentage] = useState('');
  const [modalError, setModalError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const next = { ...formData, [name]: value };
    if (name === 'costo' || name === 'venta') {
      const cost = parseFloat(next.costo);
      const price = parseFloat(next.venta);
      setProfitPercentage(cost > 0 && price > 0 ? (((price - cost) / cost * 100).toFixed(2)) : '');
    }
    setFormData(next);
    setModalError('');
  };

  const handleImageChange = (base64) => setFormData(prev => ({ ...prev, imagen: base64 }));

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

    const requiredFields = ['codigo', 'nombre', 'costo', 'venta', 'existencia'];
    if (requiredFields.some(field => !f[field] || !String(f[field]).trim())) {
      setModalError('Código, Nombre, Costo, Venta y Existencia son obligatorios.');
      return;
    }

    const cost = parseFloat(f.costo), price = parseFloat(f.venta), wholesale = f.mayoreo ? parseFloat(f.mayoreo) : null;
    const stock = parseInt(f.existencia, 10);
    const minStock = f.minimo ? parseInt(f.minimo, 10) : null;
    const maxStock = f.maximo ? parseInt(f.maximo, 10) : null;
    if ([cost, price, stock].some(isNaN)) { setModalError('Costo, Venta y Existencia deben ser números válidos.'); return; }
    if (f.mayoreo && isNaN(wholesale)) { setModalError('Precio Mayoreo debe ser un número válido o estar vacío.'); return; }
    if (cost < 0 || price < 0 || stock < 0) { setModalError('Precios y cantidades no pueden ser negativos.'); return; }
    if (price < cost) { setModalError('El precio de venta no puede ser menor que el costo.'); return; }

    const duplicate = allProductsRaw.find(p =>
      (p.codigo?.toLowerCase() === f.codigo.trim().toLowerCase() || p.nombre?.toLowerCase() === f.nombre.trim().toLowerCase())
    );
    if (duplicate) {
      if ((duplicate.codigo || '').toLowerCase() === f.codigo.trim().toLowerCase()) setModalError(`Ya existe un producto con el código "${f.codigo}".`);
      else setModalError(`Ya existe un producto con el nombre "${f.nombre}".`);
      return;
    }

    onSave({
      ...f,
      mayoreo: f.mayoreo || null, minimo: f.minimo || null, maximo: f.maximo || null,
      id_categoria: f.id_categoria || null, id_proveedor: f.id_proveedor || null
    });
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}>
        <ModalContent as="div" onClick={(e) => e.stopPropagation()}>
          <form onSubmit={handleSubmit}>
            <ModalTitle>Crear Nuevo Producto</ModalTitle>
            {modalError && <ModalError>{modalError}</ModalError>}

            {/* Image Upload Section */}
            <ImageUpload currentImage={formData.imagen} onImageChange={handleImageChange} />

            <InputGrid>
              <FormGroup><Label>Código</Label><Input name="codigo" value={formData.codigo} onChange={handleInputChange} required /></FormGroup>
              <FormGroup><Label>Nombre</Label><Input name="nombre" value={formData.nombre} onChange={handleInputChange} required /></FormGroup>
              <FormGroup><Label>Costo (C$)</Label><Input type="number" step="0.01" name="costo" value={formData.costo} onChange={handleInputChange} required /></FormGroup>
              <FormGroup><Label>% Ganancia</Label><Input type="number" step="0.01" value={profitPercentage} onChange={handlePercentageChange} placeholder="ej: 50" /></FormGroup>
              <FormGroup><Label>Precio Venta (C$)</Label><Input type="number" step="0.01" name="venta" value={formData.venta} onChange={handleInputChange} required /></FormGroup>
              <FormGroup><Label>Precio Mayoreo (C$)</Label><Input type="number" step="0.01" name="mayoreo" value={formData.mayoreo} onChange={handleInputChange} /></FormGroup>
              <FormGroup><Label>Existencia Inicial</Label><Input type="number" inputMode="numeric" pattern="[0-9]*" name="existencia" value={formData.existencia} onChange={handleInputChange} required /></FormGroup>
              <FormGroup><Label>Stock Mínimo</Label><Input type="number" inputMode="numeric" pattern="[0-9]*" name="minimo" value={formData.minimo} onChange={handleInputChange} /></FormGroup>
              <FormGroup><Label>Stock Máximo</Label><Input type="number" inputMode="numeric" pattern="[0-9]*" name="maximo" value={formData.maximo} onChange={handleInputChange} /></FormGroup>
              <FormGroup><Label>Descripción</Label><Input name="descripcion" value={formData.descripcion} onChange={handleInputChange} placeholder="Detalles del producto" /></FormGroup>
              <FormGroup><Label>Categoría</Label><Select name="id_categoria" value={formData.id_categoria} onChange={handleInputChange}><option value="">-- Sin Categoría --</option>{categories.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}</Select></FormGroup>
              <FormGroup><Label>Proveedor</Label><Select name="id_proveedor" value={formData.id_proveedor} onChange={handleInputChange}><option value="">-- Sin Proveedor --</option>{providers.map(p => <option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre}</option>)}</Select></FormGroup>
              <FormGroup><Label>Tipo de Venta</Label><Select name="tipo_venta" value={formData.tipo_venta} onChange={handleInputChange}><option value="Unidad">Unidad</option><option value="Juego">Juego</option><option value="Kit">Kit</option></Select></FormGroup>
            </InputGrid>
            <ModalActions>
              <CancelButton type="button" onClick={onClose}>Cancelar</CancelButton>
              <SaveButton type="submit">Crear Producto</SaveButton>
            </ModalActions>
          </form >
        </ModalContent >
      </motion.div >
    </ModalOverlay >
  );
};

/* ================================
  MODAL DE EDICIÓN ACTUALIZADO
================================ */
const EditProductModal = ({ isOpen, onClose, onSave, productToEdit, categories, providers, allProductsRaw }) => {
  const [formData, setFormData] = useState({});
  const [profitPercentage, setProfitPercentage] = useState('');
  const [modalError, setModalError] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        ...productToEdit,
        mayoreo: productToEdit.mayoreo ?? '',
        minimo: productToEdit.minimo ?? '',
        maximo: productToEdit.maximo ?? '',
        id_categoria: productToEdit.id_categoria ?? '',
        id_proveedor: productToEdit.id_proveedor ?? '',
        descripcion: productToEdit.descripcion ?? '',
        imagen: productToEdit.imagen ?? null
      });
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

  const handleImageChange = (base64) => setFormData(prev => ({ ...prev, imagen: base64 }));

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

    if (!f.codigo || !f.nombre || !f.costo || !f.venta) { setModalError('Código, Nombre, Costo y Venta son obligatorios.'); return; }
    if (parseFloat(f.venta) < parseFloat(f.costo)) { setModalError('El precio de venta no puede ser menor que el costo.'); return; }

    const duplicate = allProductsRaw.find(p =>
      (p.id_producto !== productToEdit.id_producto) &&
      (p.codigo?.toLowerCase() === f.codigo.trim().toLowerCase() || p.nombre?.toLowerCase() === f.nombre.trim().toLowerCase())
    );
    if (duplicate) { setModalError(`Ya existe otro producto con ese código o nombre.`); return; }

    const { existencia, ...payload } = { ...f, mayoreo: f.mayoreo || null, minimo: f.minimo || null, maximo: f.maximo || null, id_categoria: f.id_categoria || null, id_proveedor: f.id_proveedor || null };
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

            {/* Image Upload Section */}
            <ImageUpload currentImage={formData.imagen} onImageChange={handleImageChange} />

            <InputGrid>
              <FormGroup><Label>Código</Label><Input name="codigo" value={formData.codigo || ''} onChange={handleInputChange} required /></FormGroup>
              <FormGroup><Label>Nombre</Label><Input name="nombre" value={formData.nombre || ''} onChange={handleInputChange} required /></FormGroup>
              <FormGroup><Label>Costo (C$)</Label><Input type="number" step="0.01" name="costo" value={formData.costo || ''} onChange={handleInputChange} required /></FormGroup>
              <FormGroup><Label>% Ganancia</Label><Input type="number" step="0.01" value={profitPercentage || ''} onChange={handlePercentageChange} placeholder="ej: 50" /></FormGroup>
              <FormGroup><Label>Precio Venta (C$)</Label><Input type="number" step="0.01" name="venta" value={formData.venta || ''} onChange={handleInputChange} required /></FormGroup>
              <FormGroup><Label>Precio Mayoreo (C$)</Label><Input type="number" step="0.01" name="mayoreo" value={formData.mayoreo || ''} onChange={handleInputChange} /></FormGroup>
              <FormGroup><Label>Existencia</Label><Input name="existencia" value={formData.existencia || ''} disabled style={{ backgroundColor: '#f0f0f0' }} /><small style={{ marginTop: '5px', color: '#dc3545', fontWeight: 'bold' }}>¡Ajustar solo con el botón de stock!</small></FormGroup>
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
  const [searchType, setSearchType] = useState('description'); // <--- AGREGADO: ESTADO PARA TIPO BÚSQUEDA
  const deferredSearch = useDeferredValue(searchTerm);
  const searchRef = useRef(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterProvider, setFilterProvider] = useState('');
  const [error, setError] = useState(null);

  // Estados para los modales
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
  const [viewImage, setViewImage] = useState({ isOpen: false, imageUrl: null });
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
        axios.get('/api/providers', { headers: { Authorization: `Bearer ${token}` } })
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
    const q = (deferredSearch || '').toLowerCase().trim(); // raw deferred query
    const cat = String(filterCategory || '');
    const prov = String(filterProvider || '');

    let matched = allProducts;

    if (cat) matched = matched.filter(p => String(p.id_categoria) === cat);
    if (prov) matched = matched.filter(p => String(p.id_proveedor) === prov);

    // --- NUEVA LÓGICA DE BÚSQUEDA ---
    if (!q) {
      return {
        filtered: matched.slice(0, PRODUCTS_INITIAL_LOAD),
        totalFilteredCount: matched.length
      };
    }

    if (searchType === 'description' && q.length < 3) {
      return {
        filtered: matched.slice(0, PRODUCTS_INITIAL_LOAD),
        totalFilteredCount: matched.length
      };
    }

    const results = matched.filter(p => {
      if (searchType === 'code') {
        const codigo = String(p.codigo || '').toLowerCase();
        // --- CORRECCIÓN: ELIMINADO ID DE LA BÚSQUEDA ---
        // const id = String(p.id_producto || '').toLowerCase(); 
        const barras = String(p.codigo_barras || '').toLowerCase();

        // Ahora solo buscamos en código y código de barras
        return codigo.startsWith(q) || barras.startsWith(q);
      } else {
        const nombre = (p.nombre || '').toLowerCase();
        const desc = (p.descripcion || '').toLowerCase();
        return nombre.includes(q) || desc.includes(q);
      }
    });
    // ---------------------------------

    return {
      filtered: results.slice(0, visibleCount),
      totalFilteredCount: results.length
    };
  }, [allProducts, deferredSearch, filterCategory, filterProvider, visibleCount, searchType]);

  // Handlers para abrir modales
  const openCreateModal = () => setIsCreateModalOpen(true);
  const openEditModal = (product) => {
    setProductToEdit(product);
    setIsEditModalOpen(true);
  };
  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  // Handlers de Lógica (API calls)
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

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/products/${productToDelete.id_producto}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchData();
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      showAlert({ title: 'Éxito', message: `El producto ${productToDelete.nombre} fue eliminado.` });
    } catch (err) {
      const data = err?.response?.data;
      const msg = data?.msg || 'No se pudo eliminar el producto.';
      showAlert({ title: 'Error', message: msg, type: 'error' });
      if (data?.reasons) {
        setArchivePrompt({ open: true, product: productToDelete, detail: data.reasons });
      }
    }
  };

  const archiveProduct = async (p) => {
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
  };

  const executeStockAdjustment = async (product, cantidad, razon) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/products/${product.id_producto}/stock`,
        { cantidad, razon }, { headers: { Authorization: `Bearer ${token}` } }
      );
      setAdjustmentModal({ isOpen: false, product: null });
      showAlert({ title: 'Éxito', message: 'Stock actualizado correctamente.' });
      await fetchData();
    } catch (error) {
      showAlert({ title: 'Error', message: error.response?.data?.msg || 'No se pudo ajustar el stock.' });
    }
  };

  const handleAddCategory = async (name) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/categories', { nombre: name }, { headers: { Authorization: `Bearer ${token}` } });
      await fetchData();
    } catch (error) {
      showAlert({ title: 'Error', message: error.response?.data?.msg || 'No se pudo agregar la categoría.' });
    }
  };
  const handleDeleteCategory = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/categories/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      await fetchData();
    } catch (error) {
      showAlert({ title: 'Error', message: error.response?.data?.msg || 'No se pudo eliminar la categoría. (Verifique que no esté en uso)' });
    }
  };
  const handleAddProvider = async (name) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/providers', { nombre: name }, { headers: { Authorization: `Bearer ${token}` } });
      await fetchData();
    } catch (error) {
      showAlert({ title: 'Error', message: error.response?.data?.msg || 'No se pudo agregar el proveedor.' });
    }
  };
  const handleDeleteProvider = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/providers/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      await fetchData();
    } catch (error) {
      showAlert({ title: 'Error', message: error.response?.data?.msg || 'No se pudo eliminar el proveedor. (Verifique que no esté en uso)' });
    }
  };

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
        {/* --- BLOQUE DE BÚSQUEDA MODIFICADO --- */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <SearchInputWrapper style={{ flex: 1 }}>
            <FaSearch style={{ position: 'absolute', left: 12, top: 14, color: '#a0aec0' }} />
            <SearchInput
              ref={searchRef}
              placeholder={searchType === 'code' ? "Buscar código..." : "Buscar nombre..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
          </SearchInputWrapper>
          <FilterToggleButton $active={searchType === 'description'} onClick={() => setSearchType('description')} title="Por Nombre"><FaFont /></FilterToggleButton>
          <FilterToggleButton $active={searchType === 'code'} onClick={() => setSearchType('code')} title="Por Código"><FaBarcode /></FilterToggleButton>
        </div>
        {/* -------------------------------------- */}

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
              <div className="image-placeholder" onClick={() => p.imagen && setViewImage({ isOpen: true, imageUrl: p.imagen })}>
                {p.imagen ? (
                  <>
                    <img src={p.imagen} alt={p.nombre} />
                    <div className="overlay"><FaEye /></div>
                  </>
                ) : (
                  <div className="no-image-text"><FaImage /></div>
                )}
              </div>
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

      {/* --- Renderizado de Modales --- */}
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
            message={
              <div style={{ textAlign: 'left', lineHeight: 1.6 }}>
                Este producto tiene referencias y no puede eliminarse.<br />
                <strong>Referencias:</strong><br />
                Ventas: {archivePrompt.detail?.ventas ?? 0}<br />
                Compras: {archivePrompt.detail?.compras ?? 0}<br />
                Movimientos (kardex): {archivePrompt.detail?.kardex ?? 0}<br /><br />
                Puedes <strong>archivarlo</strong> para ocultarlo del sistema sin perder historial.
              </div>
            }
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
      <AnimatePresence>
        {viewImage.isOpen && <ImageViewModal isOpen={viewImage.isOpen} imageSrc={viewImage.imageUrl} onClose={() => setViewImage({ isOpen: false, imageUrl: null })} />}
      </AnimatePresence>
    </PageWrapper>
  );
};

export default InventoryManagement;
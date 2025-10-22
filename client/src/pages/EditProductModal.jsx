// EditProductModal.jsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import styled from 'styled-components';

// === Estilos ===
const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: #fdfdff;
  padding: 2.5rem;
  border-radius: 16px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0,0,0,.2);
  width: 90vw;
  max-width: 450px;

  @media (min-width: 768px) {
    max-width: 800px;
  }
`;

const ModalTitle = styled.h2`
  margin: 0 0 2rem;
  color: #1a202c;
  text-align: center;
  font-size: 1.75rem;
`;

const ModalError = styled.p`
  color: #dc3545;
  font-size: .9rem;
  text-align: center;
  margin-bottom: 1rem;
  min-height: 1.2rem;
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: .5rem;
  color: #495057;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: .8rem 1rem;
  border-radius: 8px;
  border: 1px solid #ced4da;
  font-size: 1rem;
`;

const Select = styled.select`
  width: 100%;
  padding: .75rem 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  font-size: 1rem;
  background: #fff;
  cursor: pointer;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;

  @media (max-width: 500px) {
    justify-content: space-between;
  }
`;

const Button = styled(motion.button)`
  padding: .6rem 1.2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  color: #fff;
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  cursor: pointer;
  font-size: .9rem;
  transition: background-color .2s;
  box-shadow: 0 4px 6px rgba(0,0,0,.1);
`;

const SaveButton = styled(Button)`
  background: #007bff;
  &:hover { background: #0069d9; }
`;

const CancelButton = styled(Button)`
  background: #f8f9fa;
  color: #6c757d;
  border: 1px solid #ced4da;
  &:hover { background: #e2e6ea; }
`;

// === Componente ===
const EditProductModal = ({ isOpen, onClose, onSave, productToEdit, categories = [], providers = [], allProductsRaw = [] }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
    setError,
    clearErrors
  } = useForm({ mode: 'onChange' });

  const costo = watch('costo');
  const venta = watch('venta');
  const profitPercentage = costo && venta && costo > 0
    ? (((parseFloat(venta) - parseFloat(costo)) / parseFloat(costo)) * 100).toFixed(2)
    : '';

  // Cargar datos al abrir
  useEffect(() => {
    if (productToEdit) {
      reset({
        codigo: productToEdit.codigo || '',
        nombre: productToEdit.nombre || '',
        descripcion: productToEdit.descripcion || '',
        tipo_venta: productToEdit.tipo_venta || 'Unidad',
        costo: productToEdit.costo || '',
        venta: productToEdit.venta || '',
        mayoreo: productToEdit.mayoreo || '',
        minimo: productToEdit.minimo || '',
        maximo: productToEdit.maximo || '',
        id_categoria: productToEdit.id_categoria || '',
        id_proveedor: productToEdit.id_proveedor || '',
        existencia: productToEdit.existencia || ''
      });
      clearErrors();
    }
  }, [productToEdit, reset, clearErrors]);

  const handlePercentageChange = (e) => {
    const percentage = parseFloat(e.target.value);
    if (costo && percentage) {
      const nuevaVenta = (parseFloat(costo) * (1 + percentage / 100)).toFixed(2);
      setValue('venta', nuevaVenta);
    }
  };

  const onSubmit = (data) => {
    // Validar duplicados
    const duplicate = allProductsRaw.find(
      (p) =>
        p.id_producto !== productToEdit.id_producto &&
        (p.codigo?.toLowerCase() === data.codigo.toLowerCase() ||
         p.nombre?.toLowerCase() === data.nombre.toLowerCase())
    );
    if (duplicate) {
      setError('codigo', { type: 'manual', message: 'Ya existe otro producto con este código o nombre.' });
      return;
    }

    // Venta no menor que costo
    if (parseFloat(data.venta) < parseFloat(data.costo)) {
      setError('venta', { type: 'manual', message: 'La venta no puede ser menor que el costo.' });
      return;
    }

    const payload = {
      codigo: data.codigo.trim(),
      nombre: data.nombre.trim(),
      descripcion: data.descripcion?.trim() || '',
      tipo_venta: data.tipo_venta,
      costo: parseFloat(data.costo),
      venta: parseFloat(data.venta),
      mayoreo: data.mayoreo ? parseFloat(data.mayoreo) : null,
      minimo: data.minimo ? parseInt(data.minimo, 10) : null,
      maximo: data.maximo ? parseInt(data.maximo, 10) : null,
      id_categoria: data.id_categoria ? parseInt(data.id_categoria, 10) : null,
      id_proveedor: data.id_proveedor ? parseInt(data.id_proveedor, 10) : null
    };
console.log('🟡 Payload que envío al backend:', payload);

    onSave(payload, productToEdit.id_producto);
  };

  if (!isOpen || !productToEdit) return null;

  return (
    <ModalOverlay
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
      >
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalTitle>Editar Producto</ModalTitle>
            {errors.codigo && <ModalError>{errors.codigo.message}</ModalError>}
            {errors.venta && <ModalError>{errors.venta.message}</ModalError>}

            <InputGrid>
              <FormGroup>
                <Label>Código *</Label>
                <Input {...register('codigo', { required: 'Código es obligatorio' })} />
              </FormGroup>

              <FormGroup>
                <Label>Nombre *</Label>
                <Input {...register('nombre', { required: 'Nombre es obligatorio' })} />
              </FormGroup>

              <FormGroup>
                <Label>Costo (C$) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register('costo', { required: 'Costo es obligatorio', min: 0 })}
                />
              </FormGroup>

              <FormGroup>
                <Label>% Ganancia</Label>
                <Input
                  type="number"
                  step="0.01"
                  onChange={handlePercentageChange}
                  placeholder="ej: 50"
                />
              </FormGroup>

              <FormGroup>
                <Label>Precio Venta (C$) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register('venta', { required: 'Venta es obligatoria', min: 0 })}
                />
              </FormGroup>

              <FormGroup>
                <Label>Precio Mayoreo (C$)</Label>
                <Input type="number" step="0.01" {...register('mayoreo')} />
              </FormGroup>

              <FormGroup>
                <Label>Existencia</Label>
                <Input disabled {...register('existencia')} style={{ backgroundColor: '#f0f0f0' }} />
                <small style={{ marginTop: '5px', color: '#dc3545', fontWeight: 'bold' }}>
                  ¡Ajustar solo con el botón de stock!
                </small>
              </FormGroup>

              <FormGroup>
                <Label>Stock Mínimo</Label>
                <Input type="number" inputMode="numeric" {...register('minimo')} />
              </FormGroup>

              <FormGroup>
                <Label>Stock Máximo</Label>
                <Input type="number" inputMode="numeric" {...register('maximo')} />
              </FormGroup>

              <FormGroup>
                <Label>Descripción</Label>
                <Input {...register('descripcion')} placeholder="Detalles del producto" />
              </FormGroup>

              <FormGroup>
                <Label>Categoría</Label>
                <Select {...register('id_categoria')}>
                  <option value="">-- Sin Categoría --</option>
                  {categories.map((c) => (
                    <option key={c.id_categoria} value={c.id_categoria}>
                      {c.nombre}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Proveedor</Label>
                <Select {...register('id_proveedor')}>
                  <option value="">-- Sin Proveedor --</option>
                  {providers.map((p) => (
                    <option key={p.id_proveedor} value={p.id_proveedor}>
                      {p.nombre}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Tipo de Venta</Label>
                <Select {...register('tipo_venta')}>
                  <option value="Unidad">Unidad</option>
                  <option value="Juego">Juego</option>
                  <option value="Kit">Kit</option>
                </Select>
              </FormGroup>
            </InputGrid>

            <ModalActions>
              <CancelButton type="button" onClick={onClose}>
                Cancelar
              </CancelButton>
              <SaveButton type="submit">
                Guardar Cambios
              </SaveButton>
            </ModalActions>
          </form>
        </ModalContent>
      </motion.div>
    </ModalOverlay>
  );
};

export default EditProductModal;

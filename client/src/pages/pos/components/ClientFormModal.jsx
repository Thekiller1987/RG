import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  FaTimes, FaSave, FaUserPlus, FaUserEdit, FaIdCard,
  FaPhoneAlt, FaMapMarkerAlt, FaCreditCard, FaTags, FaInfinity
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import * as api from '../../../service/api';

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  padding: 1rem;
`;

const ModalContainer = styled.div`
  background: #ffffff;
  border-radius: 20px;
  width: 520px;
  max-width: 100%;
  box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25);
  overflow: hidden;
  border: 1px solid #e2e8f0;
  animation: modalAppear 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  @keyframes modalAppear {
    from { opacity: 0; transform: translateY(12px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
`;

const Header = styled.div`
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
  color: white;
  padding: 1.35rem 1.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 0.65rem;
`;

const CloseButton = styled.button`
  border: none;
  background: rgba(255, 255, 255, 0.12);
  color: white;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: rgba(239, 68, 68, 0.85);
    transform: rotate(90deg);
  }
`;

const Form = styled.form`
  padding: 1.5rem 1.75rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
`;

const GridRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.9rem;
  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.38rem;
`;

const Label = styled.label`
  font-size: 0.8rem;
  font-weight: 700;
  color: #334155;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  svg {
    color: #2563eb;
  }
`;

const Input = styled.input`
  padding: 0.72rem 0.95rem;
  border: 1.5px solid #cbd5e1;
  border-radius: 10px;
  font-size: 0.95rem;
  color: #0f172a;
  background: #f8fafc;
  transition: all 0.2s;
  &:focus {
    outline: none;
    border-color: #2563eb;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
  }
`;

const Select = styled.select`
  padding: 0.72rem 0.95rem;
  border: 1.5px solid #cbd5e1;
  border-radius: 10px;
  font-size: 0.95rem;
  color: #0f172a;
  background: #f8fafc;
  transition: all 0.2s;
  &:focus {
    outline: none;
    border-color: #2563eb;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
  }
`;

const FooterActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
`;

const Button = styled.button`
  padding: 0.75rem 1.35rem;
  background: ${p => p.$secondary ? '#f1f5f9' : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'};
  color: ${p => p.$secondary ? '#475569' : '#ffffff'};
  border: none;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.92rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: ${p => p.$secondary ? 'none' : '0 8px 16px -4px rgba(37, 99, 235, 0.35)'};
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    filter: brightness(1.04);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default function ClientFormModal({ client, onClose, onSave }) {
  const [nombre, setNombre] = useState('');
  const [cedula, setCedula] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [tipoCliente, setTipoCliente] = useState('General');
  const [limite, setLimite] = useState('');
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (client) {
      setNombre(client.nombre || '');
      setCedula(client.cedula || '');
      setTelefono(client.telefono || '');
      setDireccion(client.direccion || '');
      setTipoCliente(client.tipo_cliente || 'General');
      setLimite(client.limite_credito !== null && client.limite_credito !== undefined ? String(client.limite_credito) : '');
    } else {
      setNombre('');
      setCedula('');
      setTelefono('');
      setDireccion('');
      setTipoCliente('General');
      setLimite('');
    }
  }, [client]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      toast.error('El nombre del cliente es obligatorio.');
      return;
    }

    const clientData = {
      nombre: nombre.trim(),
      cedula: cedula.trim() || null,
      telefono: telefono.trim() || null,
      direccion: direccion.trim() || null,
      tipo_cliente: tipoCliente || 'General',
      limite_credito: limite === '' ? null : Number(limite)
    };

    setSaving(true);
    try {
      if (client) {
        await api.updateClient(client.id_cliente, clientData, token);
        toast.success('Cliente actualizado correctamente.');
      } else {
        await api.createClient(clientData, token);
        toast.success('Cliente creado exitosamente.');
      }
      if (onSave) onSave();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(`Error al guardar cliente: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <Header>
          <Title>
            {client ? <><FaUserEdit /> Editar Expediente de Cliente</> : <><FaUserPlus /> Registrar Nuevo Cliente</>}
          </Title>
          <CloseButton onClick={onClose} type="button"><FaTimes /></CloseButton>
        </Header>

        <Form onSubmit={handleSubmit}>
          <FieldGroup>
            <Label><FaUserPlus /> Nombre Completo o Empresa *</Label>
            <Input
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Ej: Taller Automotriz El Éxito / Juan Pérez"
              required
              autoFocus
            />
          </FieldGroup>

          <GridRow>
            <FieldGroup>
              <Label><FaIdCard /> Cédula / RUC</Label>
              <Input
                value={cedula}
                onChange={e => setCedula(e.target.value)}
                placeholder="Ej: 121-000000-0000A"
              />
            </FieldGroup>

            <FieldGroup>
              <Label><FaPhoneAlt /> Teléfono / WhatsApp</Label>
              <Input
                value={telefono}
                onChange={e => setTelefono(e.target.value)}
                placeholder="Ej: 8888-8888"
              />
            </FieldGroup>
          </GridRow>

          <FieldGroup>
            <Label><FaMapMarkerAlt /> Dirección / Referencia</Label>
            <Input
              value={direccion}
              onChange={e => setDireccion(e.target.value)}
              placeholder="Dirección del cliente o taller..."
            />
          </FieldGroup>

          <GridRow>
            <FieldGroup>
              <Label><FaTags /> Categoría de Cliente</Label>
              <Select value={tipoCliente} onChange={e => setTipoCliente(e.target.value)}>
                <option value="General">General</option>
                <option value="Mayorista">Mayorista</option>
                <option value="Taller / Mecánico">Taller / Mecánico</option>
                <option value="VIP / Frecuente">VIP / Frecuente</option>
              </Select>
            </FieldGroup>

            <FieldGroup>
              <Label><FaCreditCard /> Límite de Crédito (C$)</Label>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={limite}
                  onChange={e => setLimite(e.target.value)}
                  placeholder="Vacío = Sin límite (∞)"
                  style={{ flex: 1 }}
                />
                <Button
                  type="button"
                  $secondary
                  onClick={() => setLimite('')}
                  title="Dejar sin límite de crédito (∞)"
                  style={{ padding: '0 0.75rem' }}
                >
                  <FaInfinity />
                </Button>
              </div>
            </FieldGroup>
          </GridRow>

          <FooterActions>
            <Button type="button" $secondary onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              <FaSave /> {saving ? 'Guardando...' : (client ? 'Guardar Cambios' : 'Crear Cliente')}
            </Button>
          </FooterActions>
        </Form>
      </ModalContainer>
    </ModalOverlay>
  );
}

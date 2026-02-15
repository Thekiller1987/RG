import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSettings } from '../context/SettingsContext';
import { updateSettings as apiUpdateSettings } from '../service/settingsApi';
import { useAuth } from '../context/AuthContext';
import { FaSave, FaBuilding, FaPhone, FaMapMarkerAlt, FaIdCard, FaImage } from 'react-icons/fa';

const Container = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h2`
  color: #1e293b;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Form = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Button = styled.button`
  background: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
  &:hover { background: #2563eb; }
  &:disabled { background: #94a3b8; cursor: not-allowed; }
`;

const Message = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 6px;
  background: ${props => props.error ? '#fee2e2' : '#dcfce7'};
  color: ${props => props.error ? '#991b1b' : '#166534'};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SettingsPage = () => {
    const { settings, refreshSettings } = useSettings();
    const { token } = useAuth();
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (settings) {
            setFormData(settings);
        }
    }, [settings]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            await apiUpdateSettings(token, formData);
            await refreshSettings();
            setMessage({ type: 'success', text: 'Configuración actualizada correctamente' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Error al actualizar configuración' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Title><FaBuilding /> Configuración de Empresa</Title>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label><FaBuilding /> Nombre de la Empresa</Label>
                    <Input
                        name="empresa_nombre"
                        value={formData.empresa_nombre || ''}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>

                <FormGroup>
                    <Label><FaIdCard /> RUC</Label>
                    <Input
                        name="empresa_ruc"
                        value={formData.empresa_ruc || ''}
                        onChange={handleChange}
                    />
                </FormGroup>

                <FormGroup>
                    <Label><FaPhone /> Teléfono(s)</Label>
                    <Input
                        name="empresa_telefono"
                        value={formData.empresa_telefono || ''}
                        onChange={handleChange}
                    />
                </FormGroup>

                <FormGroup>
                    <Label><FaMapMarkerAlt /> Dirección</Label>
                    <TextArea
                        name="empresa_direccion"
                        value={formData.empresa_direccion || ''}
                        onChange={handleChange}
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Eslogan</Label>
                    <Input
                        name="empresa_eslogan"
                        value={formData.empresa_eslogan || ''}
                        onChange={handleChange}
                    />
                </FormGroup>

                <FormGroup>
                    <Label><FaImage /> URL del Logo (Opcional)</Label>
                    <Input
                        name="empresa_logo_url"
                        value={formData.empresa_logo_url || ''}
                        onChange={handleChange}
                        placeholder="https://ejemplo.com/logo.png"
                    />
                    <small style={{ display: 'block', marginTop: 5, color: '#666' }}>
                        Si se deja vacío, se usará el logo predeterminado (/icons/logo.png).
                    </small>
                </FormGroup>

                <Button type="submit" disabled={loading}>
                    <FaSave /> {loading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>

                {message && (
                    <Message error={message.type === 'error'}>
                        {message.text}
                    </Message>
                )}
            </Form>
        </Container>
    );
};

export default SettingsPage;

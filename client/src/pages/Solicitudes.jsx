import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { FaCheck, FaPlus, FaTrash, FaUser, FaClock, FaCheckCircle, FaRegCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import * as api from '../service/api';

/* ─────────────────────────────────────────────────────────────────
   STYLES
   ───────────────────────────────────────────────────────────────── */
const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Inter', system-ui, sans-serif;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  color: #1e293b;
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 1rem;
`;

const InputSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 0.8rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #3b82f6;
  }
`;

const AddBtn = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;

  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px -1px rgb(0 0 0 / 0.06);
  border: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
  opacity: ${props => props.completed ? 0.7 : 1};
  background: ${props => props.completed ? '#f8fafc' : 'white'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: ${props => props.completed ? '#10b981' : '#f59e0b'};
  }
`;

const CardContent = styled.div`
  flex: 1;
  margin-bottom: 1rem;
`;

const CardText = styled.p`
  font-size: 1.1rem;
  color: ${props => props.completed ? '#94a3b8' : '#334155'};
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  margin: 0;
  line-height: 1.5;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
  font-size: 0.85rem;
  color: #64748b;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const TimeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const CheckBtn = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: ${props => props.completed ? '#10b981' : '#cbd5e1'};
  cursor: pointer;
  font-size: 1.5rem;
  transition: color 0.2s;

  &:hover {
    color: ${props => props.completed ? '#059669' : '#94a3b8'};
  }
`;

const Solicitudes = () => {
  const { user, token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [newDesc, setNewDesc] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchRequestsData = useCallback(async () => {
    try {
      const res = await api.fetchRequests(token);
      if (res) setRequests(res);
    } catch (e) {
      console.error("Error loading requests", e);
    }
  }, [token]);

  useEffect(() => {
    fetchRequestsData();
    const interval = setInterval(() => {
      if (!document.hidden) fetchRequestsData();
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchRequestsData]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newDesc.trim()) return;

    setLoading(true);
    try {
      await api.createRequest({
        descripcion: newDesc,
        usuario_id: user?.id || user?.id_usuario,
        usuario_nombre: user?.nombre || user?.nombre_usuario || 'Usuario'
      }, token);
      setNewDesc('');
      fetchRequestsData();
    } catch (error) {
      console.error("Error adding request", error);
      alert("Error al crear solicitud");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (reqItem) => {
    const newStatus = !reqItem.check_mark;
    // Optimistic update
    setRequests(prev => prev.map(r => r.id === reqItem.id ? { ...r, check_mark: newStatus, estado: newStatus ? 'completado' : 'pendiente' } : r));

    try {
      await api.toggleRequestStatus(reqItem.id, newStatus, token);
    } catch (error) {
      console.error("Error toggling", error);
      fetchRequestsData(); // Revert on error
    }
  };

  const fmtDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Container>
      <Header>
        <Title>Solicitudes de Productos</Title>
        <Subtitle>Gestiona los pedidos y requerimientos del equipo</Subtitle>
      </Header>

      <form onSubmit={handleAdd}>
        <InputSection>
          <Input
            placeholder="Escribe qué producto necesitas pedir..."
            value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
            disabled={loading}
          />
          <AddBtn type="submit" disabled={loading}>
            <FaPlus /> {loading ? 'Agregando...' : 'Agregar Solicitud'}
          </AddBtn>
        </InputSection>
      </form>

      <Grid>
        {requests.map(req => (
          <Card key={req.id} completed={Boolean(req.check_mark)}>
            <CheckBtn
              completed={Boolean(req.check_mark)}
              onClick={() => toggleStatus(req)}
              title={req.check_mark ? "Marcar como pendiente" : "Marcar como completado"}
            >
              {req.check_mark ? <FaCheckCircle /> : <FaRegCircle />}
            </CheckBtn>

            <CardContent>
              <CardText completed={Boolean(req.check_mark)}>
                {req.descripcion}
              </CardText>
            </CardContent>

            <CardFooter>
              <UserInfo title={`ID: ${req.usuario_id}`}>
                <FaUser size={12} /> {req.usuario_nombre || 'Desconocido'}
              </UserInfo>
              <TimeInfo>
                <FaClock size={12} /> {fmtDate(req.fecha_creacion)}
              </TimeInfo>
            </CardFooter>
          </Card>
        ))}

        {requests.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
            No hay solicitudes pendientes.
          </div>
        )}
      </Grid>
    </Container>
  );
};

export default Solicitudes;

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// --- Iconos SVG ---
const EyeIcon = ({ closed }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {closed ? (
      <><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" y1="2" x2="22" y2="22"></line></>
    ) : (
      <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></>
    )}
  </svg>
);

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
);

// --- Estilos Mejorados ---
const PageWrapper = styled.div`
  padding: 2rem 4rem;
  background-color: #f8f9fa;
  min-height: 100vh;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Header = styled.h1`
  font-size: 2.5rem;
  color: #343a40;
`;

const Button = styled.button`
  padding: 0.7rem 1.3rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9rem;
  transition: all 0.2s ease-in-out;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);

  &:active {
    transform: scale(0.98);
    box-shadow: none;
  }
`;

const BackButton = styled(Link)`
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: #495057;
    font-weight: 600;
    margin-bottom: 2rem;
    &:hover {
        color: #007bff;
    }
`;

const CreateButton = styled(Button)`
  background-color: #28a745;
  color: white;
  &:hover { background-color: #218838; }
`;

const EditButton = styled(Button)`
  background: none;
  border: 1px solid #ffc107;
  color: #ffc107;
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  &:hover { 
    background-color: #ffc107;
    color: #212529;
  }
`;

const DeleteButton = styled(Button)`
  background: none;
  border: 1px solid #dc3545;
  color: #dc3545;
  padding: 0.5rem 1rem;
  &:hover { 
    background-color: #dc3545;
    color: white;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.07);
  border-radius: 12px;
  overflow: hidden;
`;

const Th = styled.th`
  background-color: #343a40;
  color: white;
  padding: 1.2rem 1rem;
  text-align: left;
  font-weight: 600;
`;

const Td = styled.td`
  padding: 1.2rem 1rem;
  border-bottom: 1px solid #dee2e6;
  color: #495057;
`;

const Tr = styled.tr`
    &:last-child ${Td} {
        border-bottom: none;
    }
    &:hover {
        background-color: #f8f9fa;
    }
`;

const Message = styled.p`
  font-size: 1.2rem;
  color: #6c757d;
`;

// --- Estilos para el Modal Animado ---
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.form)`
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

const ModalTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 2rem;
  color: #343a40;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  margin-bottom: 1.2rem;
  border-radius: 8px;
  border: 1px solid #ced4da;
  font-size: 1rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem 1rem;
  margin-bottom: 1.2rem;
  border-radius: 8px;
  border: 1px solid #ced4da;
  font-size: 1rem;
`;

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const TogglePasswordButton = styled.span`
  position: absolute;
  right: 15px;
  top: 15px;
  cursor: pointer;
  user-select: none;
  color: #adb5bd;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const SaveButton = styled(Button)`
  background-color: #007bff;
  color: white;
  &:hover { background-color: #0069d9; }
`;

const CancelButton = styled(Button)`
  background-color: #f8f9fa;
  color: #6c757d;
  border: 1px solid #ced4da;
  &:hover { background-color: #e2e6ea; }
`;

const ModalError = styled.p`
  color: #dc3545;
  font-size: 0.9rem;
  text-align: center;
  margin-top: -0.5rem;
  margin-bottom: 1rem;
  min-height: 1.2rem;
`;

// --- Componente ---
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ nombre_usuario: '', password: '', confirmPassword: '', rol: 'Vendedor' });
  const [showPassword, setShowPassword] = useState(false);
  const [modalError, setModalError] = useState('');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get('http://localhost:3001/api/users', config);
      setUsers(data);
    } catch (err) {
      setError('Error al cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({ nombre_usuario: '', password: '', confirmPassword: '', rol: 'Vendedor' }); // Resetear formulario
    setModalError('');
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({ nombre_usuario: user.nombre_usuario, password: '', confirmPassword: '', rol: user.rol });
    setModalError('');
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`http://localhost:3001/api/users/${userToDelete.id_usuario}`, config);
      setUsers(users.filter(u => u.id_usuario !== userToDelete.id_usuario));
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (err) {
      setError('Error al eliminar el usuario.');
    }
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setModalError('');
    
    // Lógica de validación mejorada
    if (!editingUser || formData.password) {
      if (formData.password !== formData.confirmPassword) {
        setModalError('Las contraseñas no coinciden.');
        return;
      }
    }

    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    try {
      if (editingUser) {
        const updateData = { rol: formData.rol };
        if (formData.password) {
          updateData.password = formData.password;
        }
        await axios.put(`http://localhost:3001/api/users/${editingUser.id_usuario}`, updateData, config);
      } else {
        await axios.post('http://localhost:3001/api/auth/register', {
          nombre_usuario: formData.nombre_usuario,
          password: formData.password,
          rol: formData.rol
        }, config);
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      setModalError(err.response?.data?.msg || 'Error al guardar. Verifique los datos.');
    }
  };
  
  const modalVariants = {
    hidden: { opacity: 0, y: -50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 50, scale: 0.95 }
  };

  if (loading) return <PageWrapper><Message>Cargando usuarios...</Message></PageWrapper>;
  if (error) return <PageWrapper><Message style={{ color: 'red' }}>{error}</Message></PageWrapper>;

  return (
    <PageWrapper>
      <BackButton to="/dashboard"><BackIcon /> Volver al Dashboard</BackButton>
      <TopBar>
        <Header>Gestión de Usuarios</Header>
        <CreateButton onClick={openCreateModal}>
          <span style={{ fontSize: '1.2rem' }}>+</span> Crear Nuevo Usuario
        </CreateButton>
      </TopBar>
      <Table>
        <thead>
          <Tr>
            <Th>ID</Th><Th>Nombre de Usuario</Th><Th>Rol</Th><Th>Acciones</Th>
          </Tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <Tr key={user.id_usuario}>
              <Td>{user.id_usuario}</Td>
              <Td>{user.nombre_usuario}</Td>
              <Td>{user.rol}</Td>
              <Td>
                <EditButton onClick={() => openEditModal(user)}>✏️ Editar</EditButton>
                <DeleteButton onClick={() => openDeleteModal(user)}>🗑️ Eliminar</DeleteButton>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>

      <AnimatePresence>
        {isModalOpen && (
          <ModalOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)}>
            <ModalContent variants={modalVariants} initial="hidden" animate="visible" exit="exit" onSubmit={handleSaveUser} onClick={(e) => e.stopPropagation()}>
              <ModalTitle>{editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</ModalTitle>
              {modalError && <ModalError>{modalError}</ModalError>}
              <Input 
                type="text" name="nombre_usuario" placeholder="Nombre de usuario" 
                value={formData.nombre_usuario} onChange={handleInputChange}
                disabled={!!editingUser} required 
              />
              <PasswordWrapper>
                <Input 
                  type={showPassword ? 'text' : 'password'} name="password"
                  placeholder={editingUser ? 'Nueva contraseña (opcional)' : 'Contraseña'} 
                  value={formData.password} onChange={handleInputChange}
                  required={!editingUser} 
                />
                <TogglePasswordButton onClick={() => setShowPassword(!showPassword)}>
                  <EyeIcon closed={!showPassword} />
                </TogglePasswordButton>
              </PasswordWrapper>
              
              {( !editingUser || (editingUser && formData.password) ) && (
                <PasswordWrapper>
                    <Input 
                        type={showPassword ? 'text' : 'password'} name="confirmPassword"
                        placeholder="Confirmar contraseña" 
                        value={formData.confirmPassword} onChange={handleInputChange}
                        required
                    />
                </PasswordWrapper>
              )}

              <Select name="rol" value={formData.rol} onChange={handleInputChange}>
                <option value="Vendedor">Vendedor</option>
                <option value="Contador">Contador</option>
                <option value="Administrador">Administrador</option>
              </Select>
              <ModalActions>
                <CancelButton type="button" onClick={() => setIsModalOpen(false)}>Cancelar</CancelButton>
                <SaveButton type="submit">Guardar Cambios</SaveButton>
              </ModalActions>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <ModalOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteModalOpen(false)}>
              <ModalContent as="div" variants={modalVariants} initial="hidden" animate="visible" exit="exit" onClick={(e) => e.stopPropagation()}>
                  <ModalTitle>Confirmar Eliminación</ModalTitle>
                  <p>¿Estás seguro de que quieres eliminar al usuario <strong>{userToDelete?.nombre_usuario}</strong>? Esta acción no se puede deshacer.</p>
                  <ModalActions>
                      <CancelButton onClick={() => setIsDeleteModalOpen(false)}>Cancelar</CancelButton>
                      <DeleteButton style={{backgroundColor: '#dc3545', color: 'white'}} onClick={confirmDelete}>Sí, Eliminar</DeleteButton>
                  </ModalActions>
              </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
};

export default UserManagement;


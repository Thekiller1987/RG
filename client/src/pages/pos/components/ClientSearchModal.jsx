import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { FaSearch, FaTimes, FaUser } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ModalOverlay = styled(motion.div)`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 2000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled(motion.div)`
  background: white; width: 500px; max-width: 95%; 
  border-radius: 12px; overflow: hidden; display: flex; flexDirection: column;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  height: 600px;
`;

const Header = styled.div`
  padding: 1.5rem; border-bottom: 1px solid #f1f5f9;
  display: flex; justify-content: space-between; align-items: center;
  background: #f8fafc;
`;

const Title = styled.h2`margin: 0; font-size: 1.25rem; color: #1e293b; display: flex; align-items: center; gap: 10px;`;
const CloseBtn = styled.button`border: none; background: transparent; cursor: pointer; color: #64748b; font-size: 1.2rem; &:hover { color: #ef4444; }`;

const SearchContainer = styled.div`
  padding: 1rem 1.5rem; border-bottom: 1px solid #f1f5f9;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%; padding: 12px 16px 12px 40px;
  border: 2px solid #e2e8f0; border-radius: 10px;
  font-size: 1rem; outline: none; transition: all 0.2s;
  &:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
`;

const ClientList = styled.div`
  flex: 1; overflow-y: auto; padding: 0.5rem;
`;

const ClientItem = styled.div`
  padding: 12px 16px; margin-bottom: 4px; border-radius: 8px;
  cursor: pointer; transition: all 0.2s;
  display: flex; justify-content: space-between; align-items: center;
  &:hover { background: #f1f5f9; transform: translateX(4px); }
  
  .info {
    display: flex; flex-direction: column;
    .name { font-weight: 600; color: #1e293b; }
    .meta { font-size: 0.85rem; color: #64748b; display: flex; gap: 10px; }
  }

  .badge {
    background: #e0f2fe; color: #0284c7; padding: 4px 8px; border-radius: 12px;
    font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
  }
`;

const ClientSearchModal = ({ isOpen, onClose, onSelect, clients = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredClients = useMemo(() => {
        if (!searchTerm) return clients;
        const lower = searchTerm.toLowerCase();
        return clients.filter(c =>
            c.nombre.toLowerCase().includes(lower) ||
            (c.telefono && c.telefono.includes(lower))
        );
    }, [clients, searchTerm]);

    if (!isOpen) return null;

    return (
        <ModalOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ModalContent initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <Header>
                    <Title><FaSearch /> Buscar Cliente</Title>
                    <CloseBtn onClick={onClose}><FaTimes /></CloseBtn>
                </Header>
                <SearchContainer>
                    <FaSearch style={{ position: 'absolute', left: 40, top: 28, color: '#94a3b8' }} />
                    <SearchInput
                        placeholder="Buscar por nombre o teléfono..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                </SearchContainer>
                <ClientList>
                    {filteredClients.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                            No se encontraron clientes.
                        </div>
                    ) : (
                        filteredClients.map(client => (
                            <ClientItem key={client.id_cliente} onClick={() => onSelect(client)}>
                                <div className="info">
                                    <span className="name">{client.nombre}</span>
                                    <div className="meta">
                                        <span>📞 {client.telefono || 'Sin teléfono'}</span>
                                        <span>💰 Crédito: C${Number(client.limite_credito || 0).toLocaleString()}</span>
                                    </div>
                                </div>
                                {client.tipo_cliente && <span className="badge">{client.tipo_cliente}</span>}
                            </ClientItem>
                        ))
                    )}
                </ClientList>
            </ModalContent>
        </ModalOverlay>
    );
};

export default ClientSearchModal;

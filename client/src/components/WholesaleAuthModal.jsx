
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaLock, FaTimes } from 'react-icons/fa';
import { validateWholesalePin } from '../service/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  position: relative;
  text-align: center;
`;

const Title = styled.h2`
  margin-top: 0;
  color: #1e293b;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1.5rem;
  text-align: center;
  letter-spacing: 5px;
  margin: 1.5rem 0;
  outline: none;
  font-family: monospace;
  
  &:focus {
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
  }
`;

const Button = styled.button`
  background: #8b5cf6;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  transition: background 0.2s;

  &:hover { background: #7c3aed; }
  &:disabled { background: #cbd5e1; cursor: not-allowed; }
`;

const ErrorMsg = styled.p`
  color: #ef4444;
  font-size: 0.9rem;
  margin-top: 5px;
  min-height: 1.5em;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  font-size: 1.2rem;
  &:hover { color: #64748b; }
`;

export default function WholesaleAuthModal({ isOpen, onClose }) {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            setPin('');
            setError('');
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!pin) return;

        setLoading(true);
        setError('');

        try {
            const res = await validateWholesalePin(pin, token);
            if (res && (res.success || res.message === 'Acceso concedido.')) {
                onClose();
                navigate('/wholesale-menu'); // Navigate to the dedicated menu
            } else {
                setError('PIN incorrecto');
                setPin('');
            }
        } catch (err) {
            console.error(err);
            setError('PIN incorrecto o error de servidor');
            setPin('');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <Overlay
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <ModalContainer
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                >
                    <CloseButton onClick={onClose}><FaTimes /></CloseButton>
                    <Title><FaLock color="#8b5cf6" /> Acesso Mayorista</Title>
                    <p style={{ color: '#64748b' }}>Ingrese el PIN de seguridad</p>

                    <form onSubmit={handleSubmit}>
                        <Input
                            ref={inputRef}
                            type="password"
                            maxLength={4}
                            value={pin}
                            onChange={e => {
                                const val = e.target.value.replace(/\D/g, '');
                                setPin(val);
                                setError('');
                            }}
                            placeholder="0000"
                            disabled={loading}
                        />
                        <ErrorMsg>{error}</ErrorMsg>
                        <Button type="submit" disabled={loading || pin.length < 4}>
                            {loading ? 'Verificando...' : 'Ingresar'}
                        </Button>
                    </form>
                </ModalContainer>
            </Overlay>
        </AnimatePresence>
    );
}

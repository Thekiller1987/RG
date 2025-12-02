import React, { useState } from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import { ModalOverlay, ModalContent, Button, SearchInput } from '../POS.styles.jsx';

const PromptModal = ({ isOpen, onClose, onConfirm, title, message, inputType = 'number' }) => {
    const [inputValue, setInputValue] = useState('1');

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm(inputValue);
    };

    return (
        <ModalOverlay>
            <ModalContent style={{ maxWidth: '450px' }}>
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <FaQuestionCircle size="2.5em" color="#007bff" />
                    <h2 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>{title}</h2>
                    <p style={{ color: '#6c757d' }}>{message}</p>
                </div>
                <SearchInput
                    type={inputType}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    autoFocus
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                    <Button onClick={onClose} style={{ backgroundColor: '#6c757d' }}>Cancelar</Button>
                    <Button onClick={handleConfirm} primary>Aceptar</Button>
                </div>
            </ModalContent>
        </ModalOverlay>
    );
};

export default PromptModal;
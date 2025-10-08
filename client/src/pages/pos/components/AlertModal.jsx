import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { ModalOverlay, ModalContent, Button } from '../POS.styles.jsx';

const AlertModal = ({ isOpen, onClose, title, message }) => {
    if (!isOpen) return null;

    return (
        <ModalOverlay>
            <ModalContent style={{ maxWidth: '450px', textAlign: 'center' }}>
                <FaInfoCircle size="2.5em" color="#007bff" />
                <h2 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>{title}</h2>
                <p style={{ color: '#6c757d', marginBottom: '2rem', lineHeight: '1.6' }}>{message}</p>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button onClick={onClose} primary>Entendido</Button>
                </div>
            </ModalContent>
        </ModalOverlay>
    );
};

export default AlertModal;
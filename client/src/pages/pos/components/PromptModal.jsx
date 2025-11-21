import React, { useState, useEffect, useRef } from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import { ModalOverlay, ModalContent, Button, SearchInput } from '../POS.styles.jsx'; 

const PromptModal = ({ isOpen, onClose, onConfirm, title, message, inputType = 'text', initialValue = '', options = [] }) => {
    // 1. Inicialización de estado y referencia
    const [inputValue, setInputValue] = useState(initialValue);
    const inputRef = useRef(null);

    // 2. Sincronización y Enfoque (para asegurar edición)
    useEffect(() => {
        if (isOpen) {
            let initial = initialValue;
            
            // Lógica para inicializar el select con un valor válido
            if (inputType === 'select' && options.length > 0) {
                const isValid = options.some(opt => String(opt.value) === String(initialValue));
                if (!isValid) {
                    initial = options[0].value;
                }
            }
            
            setInputValue(initial);

            // Forzar enfoque del input/select después de un pequeño retraso
            const timeoutId = setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                    // Seleccionar todo el texto si es para renombrar (facilita la edición)
                    if (inputType === 'text' && inputRef.current.select) {
                        inputRef.current.select();
                    }
                }
            }, 50); 
            
            return () => clearTimeout(timeoutId);

        }
    }, [isOpen, initialValue, inputType, options]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        let finalValue = inputValue;
        
        if (inputType === 'number') {
            finalValue = parseFloat(inputValue);
            if (isNaN(finalValue)) finalValue = 0;
        }

        if (inputType === 'text' && !String(finalValue).trim()) {
            alert("El nombre no puede estar vacío.");
            return;
        }

        onConfirm(finalValue);
    };

    const renderInput = () => {
        if (inputType === 'select') {
            return (
                <SearchInput
                    as="select" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    ref={inputRef}
                    style={{ height: '40px', fontSize: '1rem', padding: '0 8px' }} 
                >
                    {options.map((opt, index) => (
                        <option key={index} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </SearchInput>
            );
        }
        
        return (
            <SearchInput
                type={inputType}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                ref={inputRef}
                style={{ height: '40px', fontSize: '1rem' }}
            />
        );
    };

    return (
        <ModalOverlay>
            <ModalContent style={{ maxWidth: '450px' }}>
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <FaQuestionCircle size="2.5em" color="#007bff" />
                    <h2 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>{title}</h2>
                    <p style={{ color: '#6c757d' }}>{message}</p>
                </div>
                
                {renderInput()}
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                    <Button onClick={onClose} style={{ backgroundColor: '#6c757d' }}>Cancelar</Button>
                    <Button onClick={handleConfirm} primary>Aceptar</Button>
                </div>
            </ModalContent>
        </ModalOverlay>
    );
};

export default PromptModal;
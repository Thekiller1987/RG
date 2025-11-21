import React, { useState, useEffect } from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
// Asumo que ModalOverlay, ModalContent, Button, SearchInput vienen de aquí o están definidas globalmente
// Si no, debes asegurar que estas importaciones son correctas para tu proyecto
import { ModalOverlay, ModalContent, Button, SearchInput } from '../POS.styles.jsx'; 

const PromptModal = ({ isOpen, onClose, onConfirm, title, message, inputType = 'text', initialValue = '', options = [] }) => {
    // Estado interno para el valor del input/select
    const [inputValue, setInputValue] = useState(initialValue);

    // Inicializa el valor al abrir el modal
    useEffect(() => {
        if (isOpen) {
            // Si es un selector y tiene opciones, usa el initialValue o el primer valor
            if (inputType === 'select' && options.length > 0) {
                setInputValue(initialValue || options[0].value);
            } else {
                setInputValue(initialValue);
            }
        }
    }, [isOpen, initialValue, inputType, options]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        let finalValue = inputValue;
        
        // Si es un número, intentamos parsear para enviar un número limpio
        if (inputType === 'number') {
            finalValue = parseFloat(inputValue) || 0;
        }

        // Llamamos a la función de confirmación y cerramos
        onConfirm(finalValue);
    };

    // Renderizado del campo de entrada o selector
    const renderInput = () => {
        if (inputType === 'select') {
            return (
                <SearchInput
                    as="select" // Renderiza un elemento <select>
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    autoFocus
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
        
        // Renderizado normal (text o number)
        return (
            <SearchInput
                type={inputType}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                autoFocus
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
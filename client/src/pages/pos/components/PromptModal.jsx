import React, { useState, useEffect } from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import { ModalOverlay, ModalContent, Button, SearchInput } from '../POS.styles.jsx'; 

const PromptModal = ({ isOpen, onClose, onConfirm, title, message, inputType = 'text', initialValue = '', options = [] }) => {
    // Usamos el estado interno para el valor del input/select
    const [inputValue, setInputValue] = useState(initialValue);

    // ************ CORRECCIÓN CLAVE ************
    // Actualiza el estado interno cada vez que la prop initialValue cambia y el modal está abierto
    useEffect(() => {
        if (isOpen) {
            let initial = initialValue;
            
            // Si es un selector y tiene opciones, asegúrate de que el valor inicial es válido.
            if (inputType === 'select' && options.length > 0) {
                const isValid = options.some(opt => String(opt.value) === String(initialValue));
                if (!isValid) {
                    initial = options[0].value;
                }
            }
            
            setInputValue(initial);
        }
    }, [isOpen, initialValue, inputType, options]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        let finalValue = inputValue;
        
        if (inputType === 'number') {
            finalValue = parseFloat(inputValue);
            if (isNaN(finalValue)) finalValue = 0;
        }

        // Si es texto, asegúrate de que no esté vacío.
        if (inputType === 'text' && !finalValue.trim()) {
            alert("El nombre no puede estar vacío.");
            return;
        }

        onConfirm(finalValue);
    };

    // Renderizado del campo de entrada o selector
    const renderInput = () => {
        if (inputType === 'select') {
            return (
                <SearchInput
                    as="select" 
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
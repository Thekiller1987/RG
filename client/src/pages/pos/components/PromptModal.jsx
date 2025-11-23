import React, { useState, useEffect, useRef } from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import { ModalOverlay, ModalContent, Button, SearchInput } from '../POS.styles.jsx'; 

const PromptModal = ({ isOpen, onClose, onConfirm, title, message, inputType = 'text', initialValue = '', options = [], closeLabel = 'Cancelar', confirmLabel = 'Aceptar' }) => {
    const [inputValue, setInputValue] = useState(initialValue);
    const inputRef = useRef(null);

    // Sincronización y Enfoque (Restablecer estado y enfocar input)
    useEffect(() => {
        if (isOpen) {
            let initial = initialValue;
            
            if (inputType === 'select' && options.length > 0) {
                const isValid = options.some(opt => String(opt.value) === String(initialValue));
                if (!isValid) initial = options[0].value;
            }
            
            setInputValue(initial);

            const timeoutId = setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                    if (inputType === 'text' && inputRef.current.select) {
                        inputRef.current.select();
                    }
                } else if (inputType === 'custom') {
                    // Si es custom, intentamos enfocar el campo 'ticketName' que se inyecta
                    const customInput = document.getElementById('ticketName');
                    if (customInput) customInput.focus();
                }
            }, 50); 
            
            return () => clearTimeout(timeoutId);
        }
    }, [isOpen, initialValue, inputType, options]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (inputType === 'custom') {
            // Cuando es custom, la lógica de validación y extracción está en el componente padre.
            onConfirm(); // Llamamos al padre
            return;
        }

        // Lógica para inputs simples (Resuelve el error de renombrar ticket)
        let finalValue = inputValue;
        
        if (inputType === 'number') {
            finalValue = parseFloat(inputValue);
            if (isNaN(finalValue)) finalValue = 0;
        }

        if (inputType === 'text' && !String(finalValue).trim()) {
            console.error("Error de validación: El campo de texto no puede estar vacío."); 
            return;
        }

        // Renombrar ticket o confirmar valor simple
        onConfirm(finalValue);
        onClose(); 
    };

    const renderContent = () => {
        if (inputType === 'custom') {
            // Si es custom, renderizamos el JSX que viene en el message
            return message;
        }
        
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
        
        // Default: text o number
        return (
            <SearchInput
                type={inputType}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                ref={inputRef}
                style={{ height: '40px', fontSize: '1rem' }}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleConfirm(); } }}
            />
        );
    };

    return (
        <ModalOverlay>
            <ModalContent style={{ maxWidth: '450px' }}>
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <FaQuestionCircle size="2.5em" color="#007bff" />
                    <h2 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>{title}</h2>
                    {inputType !== 'custom' && <p style={{ color: '#6c757d' }}>{message}</p>}
                </div>
                
                <div style={{ marginBottom: inputType !== 'custom' ? '1rem' : '0' }}>
                    {renderContent()}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                    <Button onClick={onClose} $cancel>{closeLabel}</Button>
                    <Button onClick={handleConfirm} primary>{confirmLabel}</Button>
                </div>
            </ModalContent>
        </ModalOverlay>
    );
};

export default PromptModal;
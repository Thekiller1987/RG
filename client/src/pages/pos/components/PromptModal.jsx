import React, { useState, useEffect, useRef } from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import { ModalOverlay, ModalContent, Button, SearchInput } from '../POS.styles.jsx'; 

const PromptModal = ({ isOpen, onClose, onConfirm, title, message, inputType = 'text', initialValue = '', options = [], closeLabel = 'Cancelar', confirmLabel = 'Aceptar' }) => {
    // 1. Inicialización de estado y referencia
    const [inputValue, setInputValue] = useState(initialValue);
    const inputRef = useRef(null);

    // 2. Sincronización y Enfoque
    useEffect(() => {
        if (isOpen) {
            let initial = initialValue;
            
            if (inputType !== 'custom') {
                 // Si no es custom, gestionamos el valor del campo
                if (inputType === 'select' && options.length > 0) {
                    const isValid = options.some(opt => String(opt.value) === String(initialValue));
                    if (!isValid) initial = options[0].value;
                }
                setInputValue(initial);

                // Enfoque solo si no es 'custom' (donde el input real está en el message)
                const timeoutId = setTimeout(() => {
                    if (inputRef.current) {
                        inputRef.current.focus();
                        if (inputType === 'text' && inputRef.current.select) {
                            inputRef.current.select();
                        }
                    }
                }, 50); 
                return () => clearTimeout(timeoutId);
            } else {
                // Si es custom, intentamos enfocar el campo 'ticketName' si existe
                const customInput = document.getElementById('ticketName');
                 if (customInput) customInput.focus();
            }

        }
    }, [isOpen, initialValue, inputType, options]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (inputType === 'custom') {
            // Cuando es custom, la lógica de validación y extracción está en el componente padre.
            onConfirm(); // Llamamos al padre sin pasar valor, el padre lee el DOM.
            return;
        }

        // Lógica para inputs simples (text, number, select)
        let finalValue = inputValue;
        
        if (inputType === 'number') {
            finalValue = parseFloat(inputValue);
            if (isNaN(finalValue)) finalValue = 0;
        }

        if (inputType === 'text' && !String(finalValue).trim()) {
            // Usamos el mecanismo de alerta interna para evitar la función nativa alert()
            // Suponiendo que el ConfirmationModal tiene un mecanismo para mostrar alertas simples
            console.error("Error: El campo de texto no puede estar vacío."); 
            // Podrías necesitar un componente AlertModal dedicado aquí, pero por ahora usamos consola
            return;
        }

        onConfirm(finalValue);
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
            />
        );
    };

    return (
        <ModalOverlay>
            <ModalContent style={{ maxWidth: '450px' }}>
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <FaQuestionCircle size="2.5em" color="#007bff" />
                    <h2 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>{title}</h2>
                    {/* Si no es custom, mostramos el mensaje tradicional */}
                    {inputType !== 'custom' && <p style={{ color: '#6c757d' }}>{message}</p>}
                </div>
                
                {/* Renderizamos el contenido, sea input simple o el JSX custom */}
                <div style={{ marginBottom: inputType !== 'custom' ? '1rem' : '0' }}>
                    {renderContent()}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                    <Button onClick={onClose} style={{ backgroundColor: '#6c757d' }}>{closeLabel}</Button>
                    <Button onClick={handleConfirm} primary>{confirmLabel}</Button>
                </div>
            </ModalContent>
        </ModalOverlay>
    );
};

export default PromptModal;
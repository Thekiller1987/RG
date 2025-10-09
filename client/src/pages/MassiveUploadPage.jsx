import React, { useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { FaFileUpload, FaSpinner, FaFileCsv, FaArrowLeft } from 'react-icons/fa';
import AlertModal from './pos/components/AlertModal.jsx';
import * as api from '../service/api';

// --- ESTILOS ---
const fadeIn = keyframes`from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); }`;
const spin = keyframes`from { transform: rotate(0deg); } to { transform: rotate(360deg); }`;

const PageWrapper = styled.div`
    padding: 1.5rem;
    background-color: #f0f2f5;
    min-height: 100vh;
    font-family: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
    animation: ${fadeIn} 0.5s ease-out;
    @media (min-width: 768px) { padding: 2rem; }
`;

const BackButton = styled(Link)`
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: #4a5568;
    font-weight: 600;
    margin-bottom: 1.5rem;
    &:hover { color: #2b6cb0; }
`;

const TitleHeader = styled.h1`
    font-size: 1.8rem;
    color: #1a202c;
    margin: 0 0 2rem 0;
    text-align: center;
    font-weight: 700;
`;

const UploadContainer = styled.div`
    background-color: #fff;
    border-radius: 12px;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    max-width: 650px;
    margin: 0 auto;
    box-shadow: 0 10px 25px rgba(0,0,0,0.08);
    @media (min-width: 768px) { padding: 3rem; }
`;

const UploadLabel = styled.label`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 200px;
    border: 3px dashed #e53e3e;
    background-color: #fff5f5;
    border-radius: 10px;
    color: #c53030;
    cursor: pointer;
    transition: background-color 0.2s, border-color 0.2s;
    font-size: 1.1rem;
    padding: 1rem;
    text-align: center;
    
    &:hover {
        background-color: #fcebeb;
        border-color: #c53030;
    }
`;

const UploadIcon = styled(FaFileUpload)`
    font-size: 3rem;
    margin-bottom: 1rem;
`;

const FileInput = styled.input`
    display: none;
`;

const UploadButton = styled.button`
    padding: 0.9rem 1.8rem;
    border: none;
    border-radius: 8px;
    background: ${props => props.disabled ? '#a0aec0' : 'linear-gradient(90deg, #e53e3e, #c53030)'};
    color: white;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    font-weight: bold;
    font-size: 1.05rem;
    transition: all 0.2s ease-in-out;
    display: inline-flex;
    align-items: center;
    gap: 0.7rem;
    
    &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 15px rgba(220, 53, 69, 0.4);
    }
`;

const LoadingSpinner = styled(FaSpinner)`
    animation: ${spin} 1s linear infinite;
`;

const MassiveUploadPage = () => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [alertInfo, setAlertInfo] = useState({ isOpen: false, title: '', message: '' });

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && (selectedFile.type === 'text/csv' || selectedFile.name.match(/\.(csv|xlsx|xls)$/i))) {
            setFile(selectedFile);
        } else {
            setAlertInfo({ isOpen: true, title: 'Error de Archivo', message: 'Por favor, selecciona un archivo CSV o Excel válido (.csv, .xlsx, .xls).' });
            setFile(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        setAlertInfo({ isOpen: false, title: '', message: '' });
        
        const formData = new FormData();
        formData.append('file', file);
        
        const token = localStorage.getItem('token'); 

        try {
            const result = await api.uploadFile('/inventory/upload', formData, token);

            setAlertInfo({ 
                isOpen: true, 
                title: 'Carga Exitosa', 
                message: `Se procesaron ${result.total_records} productos. Se insertaron ${result.inserted} nuevos y se actualizaron ${result.updated}.` 
            });
            setFile(null); 

        } catch (error) {
            console.error("Error al subir el archivo:", error);
            setAlertInfo({ 
                isOpen: true, 
                title: 'Error de Carga', 
                message: error.message || 'Hubo un error al intentar subir y procesar el archivo. Revisa el formato del archivo y los logs del servidor.' 
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <PageWrapper>
            <AlertModal
                isOpen={alertInfo.isOpen}
                onClose={() => setAlertInfo({ isOpen: false, title: '', message: '' })}
                title={alertInfo.title}
                message={alertInfo.message}
            />
            
            <BackButton to="/dashboard"><FaArrowLeft /> Volver al Dashboard</BackButton>
            <TitleHeader>Módulo de Importación Masiva</TitleHeader>

            <UploadContainer>
                <UploadLabel htmlFor="file-upload">
                    <UploadIcon />
                    {file ? 
                        <>
                            <p>Archivo seleccionado: <strong>{file.name}</strong></p>
                            <p style={{fontSize: '0.9rem', color: '#6b7280'}}>Haga clic para cambiar o presione el botón Cargar.</p>
                        </> 
                        :
                        <p>Arrastra tu archivo **CSV/Excel** aquí o haz clic para seleccionarlo.</p>
                    }
                    <FileInput 
                        id="file-upload" 
                        type="file" 
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
                        onChange={handleFileChange} 
                    />
                </UploadLabel>

                <UploadButton 
                    onClick={handleUpload} 
                    disabled={!file || isUploading}
                >
                    {isUploading ? <><LoadingSpinner /> Procesando...</> : <><FaFileCsv /> Iniciar Carga de Productos</>}
                </UploadButton>
                
                <p style={{fontSize: '0.85rem', color: '#6b7280', margin: 0, textAlign: 'center'}}>
                    <strong>Formato Requerido:</strong> Su archivo debe contener al menos las columnas: <strong>codigo, nombre, costo, venta, existencia, nombre_categoria, nombre_proveedor</strong>.
                </p>
                <p style={{fontSize: '0.8rem', color: '#90a4ae', margin: 0, textAlign: 'center'}}>
                    *Nota: Las categorías y proveedores se intentarán vincular por su nombre. Si no existen, se crearán nuevos.*
                </p>
            </UploadContainer>
        </PageWrapper>
    );
};

export default MassiveUploadPage;


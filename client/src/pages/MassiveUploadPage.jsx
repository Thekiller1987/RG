import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaFileUpload, FaSpinner, FaFileCsv } from 'react-icons/fa';
// Asumo que tienes este componente:
import AlertModal from './pos/components/AlertModal.jsx'; 

// --- ESTILOS REUTILIZADOS O ADAPTADOS ---

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageWrapper = styled.div`
  padding: 1.5rem;
  background-color: #f0f2f5;
  min-height: 100vh;
  font-family: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  @media (min-width: 768px) { padding: 2rem; }
`;

const TitleHeader = styled.h1`
  font-size: 1.8rem;
  color: #1a202c;
  margin: 0 0 2rem 0;
  text-align: center;
`;

const UploadContainer = styled.div`
    background-color: #fff;
    border: 2px solid #f9fafb;
    border-radius: 12px;
    padding: 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    max-width: 600px;
    margin: 2rem auto;
    box-shadow: 0 10px 25px rgba(0,0,0,0.08);
`;

const UploadLabel = styled.label`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 180px;
    border: 3px dashed #dc3545;
    background-color: #fff5f5;
    border-radius: 10px;
    color: #dc3545;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 1.1rem;
    padding: 1rem;
    text-align: center;
    
    &:hover {
        background-color: #fcebeb;
    }
`;

const UploadIcon = styled(FaFileUpload)`
    font-size: 3rem;
    margin-bottom: 0.5rem;
`;

const FileInput = styled.input`
    display: none;
`;

const UploadButton = styled.button`
    padding: 0.9rem 1.8rem;
    border: none;
    border-radius: 8px;
    background: ${props => props.disabled ? '#a0aec0' : 'linear-gradient(90deg, #dc3545, #c82333)'};
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
    animation: spin 1s linear infinite;
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;


// --- COMPONENTE PRINCIPAL ---

const MassiveUploadPage = () => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [alertInfo, setAlertInfo] = useState({ isOpen: false, title: '', message: '' });

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        // Permite CSV, XLSX y XLS
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
            // RUTA RELATIVA: Esto funciona correctamente con la redirección en netlify.toml
            const response = await fetch('/api/inventory/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                },
                body: formData,
            });

            // Si la respuesta es JSON, intenta parsearla
            const result = await response.json(); 

            if (response.ok) {
                setAlertInfo({ 
                    isOpen: true, 
                    title: 'Carga Exitosa', 
                    message: `Se procesaron ${result.total_records} productos. Se insertaron ${result.inserted} nuevos y se actualizaron ${result.updated}.` 
                });
                setFile(null); 
            } else {
                // Si el servidor envía un error con detalles
                throw new Error(result.error || result.message || 'Error desconocido al procesar el archivo.');
            }

        } catch (error) {
            console.error("Error al subir el archivo:", error); // Mantenemos el log para errores de archivo
            setAlertInfo({ 
                isOpen: true, 
                title: 'Error de Carga', 
                message: error.message || 'Hubo un error al intentar subir y procesar el archivo. Revisa el formato del archivo.' 
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
                    **Formato Requerido:** Su archivo debe contener al menos las columnas: **codigo, nombre, costo, venta, existencia, nombre_categoria, nombre_proveedor**.
                </p>
                <p style={{fontSize: '0.8rem', color: '#90a4ae', margin: 0, textAlign: 'center'}}>
                    *Nota: Las categorías y proveedores se intentarán vincular por su nombre. Si no existen, se crearán nuevos.*
                </p>
            </UploadContainer>
        </PageWrapper>
    );
};

export default MassiveUploadPage;
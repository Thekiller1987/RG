import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaFileUpload, FaCheckCircle, FaTimesCircle, FaSpinner, FaFileCsv, FaArrowLeft, FaTable, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse'; 
// RUTA DE LA API CORREGIDA: Apunta a tu carpeta 'service'
import { bulkUploadInventory } from '../service/api.js'; 

// --- ANIMACIONES Y ESTILOS ---
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const spin = keyframes`from { transform: rotate(0deg); } to { transform: rotate(360deg); }`;

const PageWrapper = styled.div`
    padding: 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    box-sizing: border-box;

    @media (max-width: 768px) {
        padding: 1rem;
    }
`;

const HeaderContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
    gap: 1rem;
    width: 100%;
    max-width: 800px;
`;

const BackButton = styled.button`
    padding: 0.75rem 1.5rem;
    border: none;
    background: rgba(255, 255, 255, 0.9);
    color: #667eea;
    border-radius: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;

    &:hover {
        background: white;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }
`;

const UploadContainer = styled.div`
    background: rgba(255, 255, 255, 0.95);
    padding: 2.5rem;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: ${fadeIn} 0.5s ease-out forwards;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    position: relative;
    box-sizing: border-box;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
`;

const DropZone = styled.label`
    border: 3px dashed ${props => {
        if (props.hasFile) return '#10b981';
        if (props.isDragOver) return '#667eea';
        return '#d1d5db';
    }};
    border-radius: 16px;
    padding: 3rem 2rem;
    width: 100%;
    cursor: pointer;
    transition: all 0.3s ease;
    background: ${props => props.hasFile ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.8)'};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    text-align: center;
    min-height: 200px;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        transition: left 0.5s;
    }

    &:hover::before {
        left: 100%;
    }

    &:hover {
        border-color: #667eea;
        transform: translateY(-2px);
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
`;

const FileInput = styled.input` 
    display: none; 
`;

const CodeBlock = styled.code` 
    display: block; 
    padding: 1rem; 
    background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
    color: #e2e8f0;
    border-radius: 12px; 
    font-size: 0.9em; 
    margin-top: 1rem; 
    font-family: 'Fira Code', 'Consolas', monospace;
    width: 100%;
    overflow-x: auto;
    border: 1px solid #4a5568;
    line-height: 1.4;
`;

const SpinningIcon = styled(FaSpinner)` 
    animation: ${spin} 1s linear infinite; 
`;

// --- Estilos para la Tabla de Previsualización ---
const PreviewTableContainer = styled.div`
    width: 100%;
    max-height: 400px;
    overflow: auto;
    margin-top: 2rem;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    background: white;
`;

const PreviewTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
    background: white;

    th, td {
        padding: 12px 15px;
        text-align: left;
        border-bottom: 1px solid #f1f5f9;
        white-space: nowrap;
    }

    th {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        position: sticky;
        top: 0;
        z-index: 10;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-size: 0.75rem;
    }

    tr:hover {
        background-color: #f8fafc;
    }

    td {
        color: #475569;
    }
`;

const UploadButton = styled.button`
    padding: 1.25rem 3rem;
    border: none;
    border-radius: 12px;
    background: ${props => {
        if (props.success) return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        if (props.error) return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
        if (props.disabled) return 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)';
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }};
    color: white;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    font-weight: 600;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    margin-top: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.5s;
    }

    &:hover:not(:disabled)::before {
        left: 100%;
    }

    &:hover:not(:disabled) {
        transform: translateY(-3px);
        box-shadow: 0 12px 35px rgba(0,0,0,0.2);
    }

    &:active:not(:disabled) {
        transform: translateY(-1px);
    }
`;

const StatusMessage = styled.p`
    font-size: 1.1rem;
    font-weight: 500;
    color: ${props => {
        switch (props.status) {
            case 'success': return '#10b981';
            case 'error': return '#ef4444';
            case 'uploading': return '#667eea';
            case 'parsing': return '#f59e0b';
            default: return '#6b7280';
        }
    }};
    text-align: center;
    margin: 1rem 0;
    padding: 1rem;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.3);
`;

const CloseButton = styled(FaTimes)`
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;
    color: #ef4444;
    z-index: 100;
    background: rgba(239, 68, 68, 0.1);
    border-radius: 50%;
    padding: 5px;
    transition: all 0.3s ease;

    &:hover {
        background: rgba(239, 68, 68, 0.2);
        transform: scale(1.1);
    }
`;

// --- FUNCIÓN LIMPIADORA ---
const cleanPrice = (priceString) => {
    if (typeof priceString !== 'string' || !priceString) return 0.00; 
    let cleaned = priceString.replace(/[$,]/g, '').trim(); 
    cleaned = cleaned.replace(',', '.'); 
    const result = parseFloat(cleaned);
    return isNaN(result) ? 0.00 : parseFloat(result.toFixed(2)); 
};

// --- FUNCIÓN AUXILIAR PARA DIVIDIR ARRAYS EN LOTES (Chunks) ---
const chunkArray = (array, size) => {
    const chunked = [];
    for (let i = 0; i < array.length; i += size) {
        chunked.push(array.slice(i, i + size));
    }
    return chunked;
};

// --- COMPONENTE PRINCIPAL ---
const InventoryUpload = () => {
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [dataToUpload, setDataToUpload] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null); 
    const [message, setMessage] = useState('Sube un archivo CSV con tus productos.');
    const token = localStorage.getItem('token');
    const [isDragOver, setIsDragOver] = useState(false);

    const handleGoBack = () => {
        navigate(-1);
    };
    
    const resetFile = () => {
        setSelectedFile(null);
        setDataToUpload([]);
        setUploadStatus(null);
        setMessage('Sube un archivo CSV con tus productos.');
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelection(files[0]);
        }
    };

    const handleFileSelection = (file) => {
        if (!file || !file.name.endsWith('.csv')) {
            setMessage('Error: Por favor, selecciona un archivo CSV.');
            setUploadStatus('error');
            setSelectedFile(null);
            setDataToUpload([]);
            return;
        }
        
        setSelectedFile(file);
        setUploadStatus('parsing');
        setMessage(`Leyendo archivo: ${file.name}...`);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: false,
            complete: function (results) {
                if (results.errors.length) {
                    setMessage(`Error de lectura en línea ${results.errors[0].row}. Verifica el formato.`);
                    setUploadStatus('error');
                    return;
                }
                
                const cleanedData = results.data.map(row => ({
                    codigo: String(row['Código'] || '').trim(),
                    nombre: String(row['Producto'] || '').trim(),
                    costo: cleanPrice(row['P. Costo']),
                    precio: cleanPrice(row['P. Venta']), 
                    mayoreo: cleanPrice(row['P. Mayoreo']),
                    existencia: parseInt(row['Existencia'] || 0, 10),
                    departamento: String(row['Departamento'] || 'N/A'), 
                    proveedor: String(row['Proveedor'] || 'N/A'),
                    minimo: parseInt(row['Inv. Mínimo'] || 0, 10),
                    maximo: parseInt(row['Inv. Máximo'] || 0, 10),
                    tipo_venta: String(row['Tipo de Venta'] || 'UNIDAD'),
                })).filter(item => item.codigo && item.nombre); 

                if (cleanedData.length === 0) {
                    setMessage('Error: No se encontraron productos válidos en el archivo.');
                    setUploadStatus('error');
                } else {
                    setDataToUpload(cleanedData);
                    setUploadStatus('ready');
                    setMessage(`✅ Archivo listo: ${cleanedData.length} productos listos para subir.`);
                }
            }
        });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        event.target.value = null; 
        handleFileSelection(file);
    };

    const handleUpload = async () => {
        // --- Validación Inicial ---
        if (dataToUpload.length === 0 || isUploading || !token) {
            setMessage('Error: No estás autenticado o no hay datos para subir.');
            setUploadStatus('error');
            return;
        }

        setIsUploading(true);
        setUploadStatus('uploading');
            
        // 1. Dividir los datos en lotes de 500
        const BATCH_SIZE = 500; 
        const batches = chunkArray(dataToUpload, BATCH_SIZE);
        
        let totalProcessed = 0;
        let successfulBatches = 0;

        try {
            // 2. Iterar y enviar cada lote individualmente
            for (let i = 0; i < batches.length; i++) {
                const batch = batches[i];
                
                // Informar el progreso al usuario
                setMessage(`🚚 Procesando lote ${i + 1} de ${batches.length} (${totalProcessed} / ${dataToUpload.length} productos)...`);

                // Enviar el lote a la API
                const result = await bulkUploadInventory(batch, token);
                
                // Actualizar contadores
                totalProcessed += batch.length;
                successfulBatches++;
            }

            // 3. Finalización exitosa
            setUploadStatus('success');
            setMessage(`🎉 ¡Carga Exitosa! Se procesaron ${totalProcessed} productos en ${batches.length} lotes.`);

        } catch (error) {
            console.error("Error en la carga masiva (API):", error);
            setUploadStatus('error');

            // Determinar un mensaje de error más útil
            const apiErrorMsg = error.message.includes('HTTP') 
                ? `Error de conexión en el Lote ${successfulBatches + 1}. Posible Timeout. Verifique el backend.` 
                : error.message;
                
            // Informar cuántos lotes se guardaron antes del fallo
            setMessage(`❌ Error de Carga. ${successfulBatches > 0 ? `Se guardaron ${successfulBatches} lotes (${totalProcessed} productos). ` : ''}Error: ${apiErrorMsg}`); 
            
        } finally {
            setIsUploading(false);
            setSelectedFile(null);
            setDataToUpload([]);
        }
    };
    
    // --- Renderizado de estado ---
    const renderStatusIcon = () => {
        switch (uploadStatus) {
            case 'parsing':
            case 'uploading':
                return <SpinningIcon size="2em" color="#3b82f6" />;
            case 'ready':
            case 'success':
                return <FaCheckCircle size="2em" color="#28a745" />;
            case 'error':
                return <FaTimesCircle size="2em" color="#dc3545" />;
            default:
                return <FaFileCsv size="3em" color="#6c757d" />;
        }
    };

    // --- Renderizado de Previsualización ---
    const renderPreviewTable = () => {
        if (dataToUpload.length === 0) return null;

        const data = dataToUpload.slice(0, 5); 

        return (
            <PreviewTableContainer>
                <h4 style={{padding: '1rem', margin: 0, background: '#f8fafc', borderBottom: '1px solid #e5e7eb'}}>
                    <FaTable style={{marginRight: '0.5rem'}} /> 
                    Previsualización ({dataToUpload.length} filas totales)
                </h4>
                <PreviewTable>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Producto</th>
                            <th>P. Costo</th>
                            <th>P. Venta</th>
                            <th>Exist.</th>
                            <th>Depto.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.codigo}</td>
                                <td>{item.nombre}</td>
                                <td>{item.costo.toFixed(2)}</td>
                                <td>{item.precio.toFixed(2)}</td>
                                <td>{item.existencia}</td>
                                <td>{item.departamento}</td>
                            </tr>
                        ))}
                    </tbody>
                </PreviewTable>
                {dataToUpload.length > 5 && (
                    <p style={{
                        textAlign: 'center', 
                        margin: '1rem 0', 
                        color: '#6b7280', 
                        fontSize: '0.8em',
                        padding: '0.5rem',
                        background: '#f8fafc'
                    }}>
                        ... y {dataToUpload.length - 5} filas más.
                    </p>
                )}
            </PreviewTableContainer>
        );
    };

    return (
        <PageWrapper>
            <HeaderContainer>
                <BackButton onClick={handleGoBack}>
                    <FaArrowLeft /> Regresar
                </BackButton>
                <h1 style={{
                    fontSize: '1.8rem', 
                    color: 'white', 
                    margin: 0,
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    Carga Masiva de Inventario
                </h1>
            </HeaderContainer>

            <UploadContainer>
                {selectedFile && (
                    <CloseButton 
                        size={20}
                        onClick={resetFile} 
                        aria-label="Limpiar archivo"
                    />
                )}

                <DropZone 
                    htmlFor="file-upload" 
                    hasFile={!!selectedFile}
                    isDragOver={isDragOver}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {renderStatusIcon()}
                    <h3 style={{
                        margin: 0, 
                        fontWeight: 600,
                        color: isDragOver ? '#667eea' : '#374151'
                    }}>
                        {selectedFile ? selectedFile.name : 'Arrastra o haz clic para subir el archivo CSV'}
                    </h3>
                    <p style={{
                        margin: 0, 
                        fontSize: '0.9em', 
                        color: '#6b7280'
                    }}>
                        Máximo 10,000 filas por carga.
                    </p>
                    <FileInput 
                        id="file-upload" 
                        type="file" 
                        accept=".csv" 
                        onChange={handleFileChange} 
                        disabled={isUploading} 
                    />
                </DropZone>
                
                <StatusMessage status={uploadStatus}>
                    {message}
                </StatusMessage>
                
                {renderPreviewTable()}

                <UploadButton 
                    onClick={handleUpload} 
                    disabled={dataToUpload.length === 0 || isUploading}
                    success={uploadStatus === 'success'}
                    error={uploadStatus === 'error'}
                >
                    {isUploading ? (
                        <>
                            <SpinningIcon /> 
                            Procesando...
                        </>
                    ) : (
                        `Subir ${dataToUpload.length} Productos`
                    )}
                </UploadButton>
                
                <h4 style={{
                    marginTop: '2rem', 
                    marginBottom: '0.5rem', 
                    color: '#374151',
                    textAlign: 'center'
                }}>
                    Formato Requerido del CSV
                </h4>
                <CodeBlock>
                    Código, Producto, P. Costo, P. Venta, P. Mayoreo, Existencia, Departamento, Proveedor, Inv. Mínimo, Inv. Máximo, Tipo de Venta
                </CodeBlock>
            </UploadContainer>
        </PageWrapper>
    );
};

export default InventoryUpload;
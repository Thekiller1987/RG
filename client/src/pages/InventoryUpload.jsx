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
    background-color: #f0f2f5; /* Fondo gris claro */
    min-height: 100vh; 
    font-family: 'Inter', sans-serif;
    /* Aseguramos que ocupe todo el espacio y esté centrado */
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
    max-width: 800px; /* Alinea el encabezado con el contenedor */
`;

const BackButton = styled.button`
    padding: 0.5rem 1rem;
    border: 1px solid #dee2e6; /* Borde más visible */
    background-color: #fff;
    color: #3b82f6;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    box-shadow: 0 2px 4px rgba(0,0,0,0.08);

    &:hover {
        background-color: #eef2ff;
    }
`;

const UploadContainer = styled.div`
    background-color: white; /* Contenedor principal blanco */
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: ${fadeIn} 0.5s ease-out forwards;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    position: relative;
    box-sizing: border-box;
`;

const DropZone = styled.label`
    border: 3px dashed ${props => (props.hasFile ? '#3b82f6' : '#9ca3af')};
    border-radius: 10px;
    padding: 3rem 2rem;
    width: 100%;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: ${props => (props.hasFile ? '#eef2ff' : '#fcfcfc')};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    text-align: center;
    min-height: 150px; /* Altura mínima para asegurar visibilidad */

    &:hover {
        border-color: #3b82f6;
    }
`;

const FileInput = styled.input` display: none; `;
const CodeBlock = styled.code` 
    display: block; 
    padding: 0.75rem; 
    background-color: #212529; 
    color: #fff;
    border-radius: 8px; 
    font-size: 0.85em; 
    margin-top: 1rem; 
    font-family: 'Consolas', 'Courier New', monospace;
    width: 100%;
    overflow-x: auto;
`;
const SpinningIcon = styled(FaSpinner)` animation: ${spin} 1s linear infinite; `;

// --- Estilos para la Tabla de Previsualización ---
const PreviewTableContainer = styled.div`
    width: 100%;
    max-height: 300px; 
    overflow: auto;
    margin-top: 1.5rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 0 5px rgba(0,0,0,0.05); /* Sombra para resaltar */
`;

const PreviewTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    font-size: 0.8rem;
    background-color: white;

    th, td {
        padding: 10px;
        text-align: left;
        border-bottom: 1px solid #f1f1f1;
        white-space: nowrap; 
    }

    th {
        background-color: #e9ecef;
        color: #495057;
        position: sticky; 
        top: 0;
        z-index: 10;
        font-weight: 700;
    }
`;

const UploadButton = styled.button`
    padding: 1rem 2.5rem;
    border: none;
    border-radius: 8px;
    background: ${props => (props.success ? '#28a745' : props.error ? '#dc3545' : '#3b82f6')};
    color: white;
    cursor: pointer;
    font-weight: bold;
    font-size: 1.1rem;
    transition: background-color 0.2s;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    margin-top: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;

    &:disabled {
        background: #94b5e2;
        cursor: not-allowed;
        box-shadow: none;
    }
`;

const StatusMessage = styled.p`
    font-size: 1.1rem;
    font-weight: 500;
    color: ${props => props.color || '#343a40'};
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

    const handleGoBack = () => {
        navigate(-1);
    };
    
    const resetFile = () => {
        setSelectedFile(null);
        setDataToUpload([]);
        setUploadStatus(null);
        setMessage('Sube un archivo CSV con tus productos.');
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        event.target.value = null; 
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
                // NO es necesario await new Promise(resolve => setTimeout(resolve, 500)); porque el servidor ya actúa como "tiempo de espera"
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
    // NOTA: Esta función se revisó para que funcione correctamente con tu lógica de renderizado.
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
                return <FaFileCsv size="3em" color="#6c757d" />; /* Icono más grande por defecto */
        }
    };

    // --- Renderizado de Previsualización ---
    const renderPreviewTable = () => {
        if (dataToUpload.length === 0) return null;

        const data = dataToUpload.slice(0, 5); 

        return (
            <PreviewTableContainer>
                <h4><FaTable /> Previsualización ({dataToUpload.length} filas totales)</h4>
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
                {dataToUpload.length > 5 && <p style={{textAlign: 'center', margin: '0.5rem 0', color: '#6c757d', fontSize: '0.8em'}}>... y {dataToUpload.length - 5} filas más.</p>}
            </PreviewTableContainer>
        );
    };

    return (
        <PageWrapper>
            <HeaderContainer>
                <BackButton onClick={handleGoBack}>
                    <FaArrowLeft /> Regresar
                </BackButton>
                <h1 style={{fontSize: '1.8rem', color: '#343a40', margin: 0}}>Carga Masiva de Inventario</h1>
            </HeaderContainer>

            <UploadContainer>
                {selectedFile && (
                    <FaTimes 
                        onClick={resetFile} 
                        style={{position: 'absolute', top: 15, right: 15, cursor: 'pointer', color: '#dc3545', zIndex: 100}}
                        aria-label="Limpiar archivo"
                    />
                )}

                <DropZone htmlFor="file-upload" hasFile={!!selectedFile}>
                    {/* Renderizamos el ícono de estado si no hay archivo, sino el ícono de archivo */}
                    {selectedFile ? renderStatusIcon() : <FaFileUpload size="3em" style={{ color: '#3b82f6' }} />}
                    <h3 style={{margin: 0, fontWeight: 600}}>
                        {selectedFile ? selectedFile.name : 'Arrastra o haz clic para subir el archivo CSV'}
                    </h3>
                    <p style={{margin: 0, fontSize: '0.9em', color: '#6c757d'}}>Máximo 10,000 filas por carga.</p>
                    <FileInput id="file-upload" type="file" accept=".csv" onChange={handleFileChange} disabled={isUploading} />
                </DropZone>
                
                <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        {/* Se elimina la línea que renderizaba el ícono solo aquí, volviendo a tu lógica original. */}
                        <StatusMessage color={uploadStatus === 'error' ? '#dc3545' : '#343a40'}>{message}</StatusMessage>
                    </div>
                </div>
                
                {renderPreviewTable()} 

                <UploadButton 
                    onClick={handleUpload} 
                    disabled={dataToUpload.length === 0 || isUploading}
                    success={uploadStatus === 'success'}
                    error={uploadStatus === 'error'}
                >
                    {isUploading ? (<><SpinningIcon /> Procesando...</>) : `Subir ${dataToUpload.length} Productos`}
                </UploadButton>
                
                <h4 style={{marginTop: '2rem', marginBottom: '0.5rem', color: '#495057'}}>Formato Requerido</h4>
                <CodeBlock>
                    Código, Producto, P. Costo, P. Venta, P. Mayoreo, Existencia, Departamento, Proveedor, Inv. Mínimo, Inv. Máximo, Tipo de Venta
                </CodeBlock>
            </UploadContainer>
        </PageWrapper>
    );
};

export default InventoryUpload;
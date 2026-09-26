// client/src/utils/bluetoothPrinter.js
import JsBarcode from 'jsbarcode';

/**
 * UUIDs conocidos para impresoras Phomemo (Zhuhai Quin) y térmicas BLE comunes
 */
export const PHOMEMO_BLE_SERVICES = [
  '0000ff00-0000-1000-8000-00805f9b34fb', // Servicio nativo Phomemo M110, M120, M220, D30, T02
  '0000ffe0-0000-1000-8000-00805f9b34fb', // Servicio UART BLE estándar (POS-58, HM-10)
  '49535343-fe7d-4ae5-8fa9-9fafd205e455', // ISSC BLE Serial
  'e7810a71-73ae-499d-8c15-faa9aef0c3f2', // Phomemo variante macOS / iOS
  '000018f0-0000-1000-8000-00805f9b34fb', // Impresoras térmicas BLE genéricas
  '0000fee7-0000-1000-8000-00805f9b34fb', // WeChat / Mini impresoras chinas
  '0000ae30-0000-1000-8000-00805f9b34fb'  // Mini POS térmica
];

/**
 * Verifica si el navegador web soporta la API Web Bluetooth
 */
export function isBluetoothSupported() {
  return typeof navigator !== 'undefined' && Boolean(navigator.bluetooth);
}

/**
 * Solicita emparejar una impresora Bluetooth desde la PC y devuelve la característica de escritura
 */
export async function connectBluetoothPrinter(onDisconnected = null) {
  if (!isBluetoothSupported()) {
    throw new Error('Tu navegador no soporta Bluetooth Web. Usa Google Chrome o Microsoft Edge en tu PC.');
  }

  try {
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: PHOMEMO_BLE_SERVICES
    });

    if (onDisconnected) {
      device.addEventListener('gattserverdisconnected', onDisconnected);
    }

    const server = await device.gatt.connect();

    let writeCharacteristic = null;

    // 1. Probar primero los servicios conocidos
    for (const serviceUuid of PHOMEMO_BLE_SERVICES) {
      try {
        const service = await server.getPrimaryService(serviceUuid);
        const chars = await service.getCharacteristics();
        for (const char of chars) {
          if (char.properties.write || char.properties.writeWithoutResponse) {
            writeCharacteristic = char;
            break;
          }
        }
        if (writeCharacteristic) break;
      } catch (err) {
        // Continuar buscando
      }
    }

    // 2. Si no se encontró en la lista fija, consultar todos los servicios expuestos
    if (!writeCharacteristic) {
      try {
        const services = await server.getPrimaryServices();
        for (const service of services) {
          const chars = await service.getCharacteristics();
          for (const char of chars) {
            if (char.properties.write || char.properties.writeWithoutResponse) {
              writeCharacteristic = char;
              break;
            }
          }
          if (writeCharacteristic) break;
        }
      } catch (e) {
        console.warn('Error al explorar servicios adicionales:', e);
      }
    }

    if (!writeCharacteristic) {
      throw new Error(
        `Se conectó a "${device.name || 'Dispositivo'}", pero no se encontró un canal de escritura de impresión compatible.`
      );
    }

    return {
      device,
      server,
      characteristic: writeCharacteristic,
      name: device.name || 'Impresora Phomemo'
    };
  } catch (error) {
    if (error.name === 'NotFoundError') {
      throw new Error('Búsqueda cancelada: no se seleccionó ninguna impresora.');
    }
    throw error;
  }
}

/**
 * Desconecta el dispositivo Bluetooth
 */
export function disconnectBluetoothPrinter(device) {
  if (device && device.gatt && device.gatt.connected) {
    device.gatt.disconnect();
  }
}

/**
 * Envío seguro de un comando discreto a la característica GATT
 */
async function writeCommand(characteristic, data) {
  try {
    if (characteristic.properties.writeWithoutResponse && typeof characteristic.writeValueWithoutResponse === 'function') {
      await characteristic.writeValueWithoutResponse(data);
    } else {
      await characteristic.writeValue(data);
    }
  } catch (err) {
    // Si falla writeWithoutResponse, intentar fallback a writeValue
    try {
      await characteristic.writeValue(data);
    } catch (err2) {
      console.error('Error escribiendo en característica GATT:', err2);
      throw err2;
    }
  }
}

/**
 * Dibuja un texto ajustado en múltiples líneas en un canvas 2D
 */
function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 2) {
  const words = (text || '').split(' ');
  let line = '';
  const lines = [];

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      lines.push(line.trim());
      line = words[n] + ' ';
      if (lines.length >= maxLines) break;
    } else {
      line = testLine;
    }
  }
  if (line.trim() && lines.length < maxLines) {
    lines.push(line.trim());
  }

  if (lines.length === maxLines) {
    let last = lines[maxLines - 1];
    while (ctx.measureText(last + '...').width > maxWidth && last.length > 0) {
      last = last.slice(0, -1);
    }
    lines[maxLines - 1] = last.trim() + '...';
  }

  lines.forEach((l, i) => {
    ctx.fillText(l, x, y + i * lineHeight);
  });

  return lines.length * lineHeight;
}

/**
 * Renderiza una etiqueta 2x1 pulgadas (384 x 200 px a 203 DPI) en un Canvas HTML5
 * con estética limpia, contraste térmico perfecto y disposición nítida.
 */
export function render2x1LabelCanvas(product, options = {}) {
  const {
    showCompany = true,
    showPrice = true,
    showCategory = false,
    codeType = 'barcode',
    storeName = 'MULTIREPUESTOS RG'
  } = options;

  const width = 384; // 48 mm * 8 puntos/mm = 384 puntos exactos (ancho cabezal M110)
  const height = 200; // 25 mm * 8 puntos/mm = 200 puntos exactos (2x1 pulgada)

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  // Fondo blanco puro
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  let currentY = 6;

  // 1. Encabezado de la Empresa
  if (showCompany) {
    ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText(storeName, width / 2, currentY);
    currentY += 16;
  } else {
    currentY += 4;
  }

  // 2. Nombre del Producto (1 o 2 líneas, negrita de alta visibilidad)
  ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
  const prodName = product.nombre || 'Repuesto';
  const textHeight = drawWrappedText(ctx, prodName, width / 2, currentY, width - 20, 17, 2);
  currentY += textHeight + 4;

  const rawCode = String(product.codigo_barras || product.codigo || '000000');

  // 3. Renderizado de Código de Barras / QR
  if (codeType === 'barcode' || codeType === 'hybrid') {
    try {
      const barcodeCanvas = document.createElement('canvas');
      JsBarcode(barcodeCanvas, rawCode, {
        format: 'CODE128',
        width: 1.6,
        height: 44,
        displayValue: false,
        margin: 0,
        background: '#ffffff',
        lineColor: '#000000'
      });

      const bcWidth = barcodeCanvas.width;
      const drawWidth = Math.min(bcWidth, width - 24);
      const drawX = (width - drawWidth) / 2;

      ctx.drawImage(barcodeCanvas, drawX, currentY, drawWidth, 44);
      currentY += 47;
    } catch (err) {
      console.warn('Error dibujando código de barras en canvas:', err);
      currentY += 44;
    }
  } else {
    currentY += 40;
  }

  // 4. Línea separadora inferior
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(8, currentY);
  ctx.lineTo(width - 8, currentY);
  ctx.stroke();
  currentY += 4;

  // 5. Pie de etiqueta: Código alfanumérico a la izquierda y Precio a la derecha
  ctx.textBaseline = 'middle';

  // Código a la izquierda
  ctx.textAlign = 'left';
  ctx.font = 'bold 13px monospace, Courier';
  ctx.fillText(rawCode, 10, currentY + 10);

  // Categoría pequeña si está habilitada
  if (showCategory && product.categoria_nombre) {
    ctx.font = 'normal 10px system-ui, sans-serif';
    ctx.fillText(String(product.categoria_nombre).slice(0, 16), 10, currentY + 22);
  }

  // Precio a la derecha en negrita prominente
  if (showPrice) {
    const rawVal = product.precio_venta ?? product.venta ?? product.precio ?? product.__fmt?.venta ?? 0;
    const numVal = typeof rawVal === 'string' && rawVal.includes('C$')
      ? parseFloat(rawVal.replace(/[^0-9.]/g, ''))
      : parseFloat(rawVal);
    const formattedPrice = (!isNaN(numVal) && numVal > 0) ? `C$ ${numVal.toFixed(2)}` : '';

    if (formattedPrice) {
      ctx.textAlign = 'right';
      ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
      ctx.fillText(formattedPrice, width - 10, currentY + 10);
    }
  }

  return canvas;
}

/**
 * Convierte un Canvas 2D en datos bitmap puros de 1-bit empaquetados
 * Cada byte = 8 píxeles horizontales, MSB = pixel izquierdo, bit 1 = negro.
 */
export function canvasTo1BitBitmap(canvas) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width; // 384 puntos
  const height = canvas.height; // 200 puntos

  const imgData = ctx.getImageData(0, 0, width, height);
  const pixels = imgData.data;

  const widthBytes = Math.ceil(width / 8); // 48 bytes por línea
  const bitmap = new Uint8Array(widthBytes * height);
  let byteIndex = 0;

  for (let y = 0; y < height; y++) {
    for (let xByte = 0; xByte < widthBytes; xByte++) {
      let byteVal = 0;
      for (let bit = 0; bit < 8; bit++) {
        const x = xByte * 8 + bit;
        if (x < width) {
          const idx = (y * width + x) * 4;
          const r = pixels[idx];
          const g = pixels[idx + 1];
          const b = pixels[idx + 2];
          const a = pixels[idx + 3];

          const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
          if (a > 128 && luminance < 165) {
            byteVal |= (1 << (7 - bit));
          }
        }
      }
      bitmap[byteIndex++] = byteVal;
    }
  }

  return bitmap;
}

/**
 * Imprime una sola etiqueta en la Phomemo M110 usando la secuencia exacta
 * y validada del protocolo oficial (pyphomemo / phomymo):
 * 1. Speed (1b 4e 0d 05) -> delay 30ms
 * 2. Density (1b 4e 04 0f) -> delay 30ms
 * 3. Media con gaps (1f 11 0a) -> delay 30ms
 * 4. Raster Header GS v 0 (1d 76 30 00 30 00 c8 00) -> delay 20ms
 * 5. Bitmap en chunks de 128 bytes con 20ms de delay
 * 6. Pausa de 300ms antes del footer
 * 7. Footer de finalización (1f f0 05 00 1f f0 03 00)
 * 8. Pausa de 500ms después del footer para completar el avance
 */
export async function printSingleLabelM110(characteristic, canvas, options = {}, onChunkProgress = null) {
  const width = canvas.width; // 384
  const height = canvas.height; // 200
  const widthBytes = Math.ceil(width / 8); // 48 bytes

  const bitmapBytes = canvasTo1BitBitmap(canvas);

  const speed = options.speed ?? 0x05; // 0x01 a 0x05
  const density = options.density ?? 0x0F; // 0x01 a 0x0F (0x0F = máxima nitidez térmica)
  const media = options.media ?? 0x0A; // 0x0A = etiqueta troquelada con sensor de gap (2x1)

  // 1. Configurar velocidad
  await writeCommand(characteristic, new Uint8Array([0x1B, 0x4E, 0x0D, speed]));
  await new Promise(r => setTimeout(r, 30));

  // 2. Configurar densidad / contraste
  await writeCommand(characteristic, new Uint8Array([0x1B, 0x4E, 0x04, density]));
  await new Promise(r => setTimeout(r, 30));

  // 3. Configurar tipo de papel (Etiquetas troqueladas con separación)
  await writeCommand(characteristic, new Uint8Array([0x1F, 0x11, media]));
  await new Promise(r => setTimeout(r, 30));

  // 4. Encabezado de imagen raster GS v 0
  const header = new Uint8Array([
    0x1D, 0x76, 0x30, 0x00,
    widthBytes & 0xFF, (widthBytes >> 8) & 0xFF,
    height & 0xFF, (height >> 8) & 0xFF
  ]);
  await writeCommand(characteristic, header);
  await new Promise(r => setTimeout(r, 20));

  // 5. Enviar el mapa de bits en paquetes de 128 bytes
  const CHUNK_SIZE = 128;
  const total = bitmapBytes.length;
  let offset = 0;

  while (offset < total) {
    const chunk = bitmapBytes.slice(offset, offset + CHUNK_SIZE);
    await writeCommand(characteristic, chunk);
    offset += CHUNK_SIZE;

    if (onChunkProgress) {
      onChunkProgress(Math.min(100, Math.round((offset / total) * 100)));
    }
    await new Promise(r => setTimeout(r, 20));
  }

  // 6. Pausa crítica antes del footer (300ms)
  await new Promise(r => setTimeout(r, 300));

  // 7. Footer oficial Phomemo de fin de impresión y alineación
  const footer = new Uint8Array([0x1F, 0xF0, 0x05, 0x00, 0x1F, 0xF0, 0x03, 0x00]);
  await writeCommand(characteristic, footer);

  // 8. Pausa para permitir que el motor mecánico termine de imprimir y avanzar
  await new Promise(r => setTimeout(r, 500));
}

/**
 * Imprime un lote continuo de etiquetas a la impresora Bluetooth Phomemo ("De un solo")
 * @param {BluetoothRemoteGATTCharacteristic} characteristic - Característica BLE conectada
 * @param {Array} labelsList - Lista de productos (repetidos según la cantidad solicitada)
 * @param {Object} options - Configuración visual y parámetros de impresión
 * @param {Function} onProgress - Callback ({ current, total, percentage, labelName })
 */
export async function printBatchViaBluetooth(characteristic, labelsList, options = {}, onProgress = null) {
  if (!characteristic) {
    throw new Error('No hay ninguna impresora Bluetooth conectada.');
  }

  if (!labelsList || labelsList.length === 0) {
    throw new Error('No hay etiquetas en la cola para imprimir.');
  }

  const total = labelsList.length;

  for (let i = 0; i < total; i++) {
    const item = labelsList[i];

    if (onProgress) {
      onProgress({
        current: i + 1,
        total,
        percentage: Math.round((i / total) * 100),
        labelName: item.nombre || 'Repuesto'
      });
    }

    // 1. Renderizar etiqueta en Canvas 2D
    const canvas = render2x1LabelCanvas(item, options);

    // 2. Ejecutar la secuencia M110 real
    await printSingleLabelM110(
      characteristic,
      canvas,
      options,
      (chunkPercent) => {
        if (onProgress) {
          const overall = Math.round(((i + (chunkPercent / 100)) / total) * 100);
          onProgress({
            current: i + 1,
            total,
            percentage: overall,
            labelName: item.nombre || 'Repuesto'
          });
        }
      }
    );

    // Pausa entre etiquetas consecutivas
    if (i < total - 1) {
      await new Promise(r => setTimeout(r, 600));
    }
  }

  if (onProgress) {
    onProgress({
      current: total,
      total,
      percentage: 100,
      labelName: '¡Completado con éxito!'
    });
  }

  return { success: true, count: total };
}

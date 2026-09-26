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
    // Buscar cualquier dispositivo Bluetooth cercano con los servicios térmicos permitidos
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: PHOMEMO_BLE_SERVICES
    });

    if (onDisconnected) {
      device.addEventListener('gattserverdisconnected', onDisconnected);
    }

    const server = await device.gatt.connect();

    // Buscar una característica con permisos de escritura
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
        // Continuar intentando con el siguiente servicio
      }
    }

    // 2. Si no se encontró en la lista fija, consultar todos los servicios primarios expuestos
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

  // Si hay más texto que no cupo en maxLines, colocar ellipsis al final
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
    codeType = 'barcode', // 'barcode' | 'qr' | 'hybrid'
    storeName = 'MULTIREPUESTOS RG'
  } = options;

  const width = 384; // 48 mm * 8 puntos/mm = 384 puntos exactos
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

  // 1. Encabezado de la Empresa (si está activo)
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
    // Barcode usando JsBarcode sobre un canvas temporal
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
      const bcHeight = barcodeCanvas.height;
      const drawWidth = Math.min(bcWidth, width - 24);
      const drawX = (width - drawWidth) / 2;

      ctx.drawImage(barcodeCanvas, drawX, currentY, drawWidth, 44);
      currentY += 47;
    } catch (err) {
      console.warn('Error dibujando código de barras en canvas:', err);
      currentY += 44;
    }
  } else {
    // Si sólo es texto o espacio reservado
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
 * Convierte un Canvas 2D en comandos ESC/POS Raster (GS v 0) compatibles con Phomemo
 * Genera un buffer de 1-bit empaquetado para el cabezal térmico.
 */
export function canvasToPhomemoRaster(canvas) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width; // 384 puntos
  const height = canvas.height; // 200 puntos

  const imgData = ctx.getImageData(0, 0, width, height);
  const pixels = imgData.data;

  const widthBytes = Math.ceil(width / 8); // 48 bytes
  const totalRasterBytes = widthBytes * height;

  const command = [];

  // 1. Inicialización ESC/POS y encabezado propietario Phomemo (M110 / M120 / M220 / D30)
  // ESC @ (1b 40) + ESC a 1 (centrado 1b 61 01) + Phomemo label setup (1f 11 02 04)
  command.push(0x1B, 0x40);
  command.push(0x1B, 0x61, 0x01);
  command.push(0x1F, 0x11, 0x02, 0x04);

  // 2. Comando GS v 0 (Raster bit image)
  // 1D 76 30 00 xL xH yL yH
  const xL = widthBytes & 0xFF;
  const xH = (widthBytes >> 8) & 0xFF;
  const yL = height & 0xFF;
  const yH = (height >> 8) & 0xFF;

  command.push(0x1D, 0x76, 0x30, 0x00, xL, xH, yL, yH);

  // 3. Matriz de píxeles: Umbralización monocromática de 1 bit por punto (1 = punto negro, 0 = blanco)
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

          // Fórmula de luminosidad ITU-R BT.601
          const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
          // Si el píxel es oscuro y no transparente -> punto térmico negro
          if (a > 128 && luminance < 165) {
            byteVal |= (1 << (7 - bit));
          }
        }
      }
      command.push(byteVal);
    }
  }

  // 4. Pie de impresión y avance de etiqueta
  // ESC d 2 (alimentación 2 líneas) + comandos Phomemo de fin de impresión y avance a hendidura/sensor
  command.push(0x1B, 0x64, 0x02);
  command.push(0x1B, 0x64, 0x02);
  command.push(0x1F, 0x11, 0x08);
  command.push(0x1F, 0x11, 0x0E);
  command.push(0x0C); // Form Feed estándar para impresoras con sensor de etiqueta gap

  return new Uint8Array(command);
}

/**
 * Envía datos binarios a la característica BLE en fragmentos (chunks) seguros de 120 bytes
 * evitando desbordamientos de búfer en el chip Bluetooth de la impresora.
 */
export async function sendBluetoothData(characteristic, uint8Data, onProgress = null) {
  const CHUNK_SIZE = 120; // 120 bytes es compatible con el MTU de cualquier dispositivo BLE
  const total = uint8Data.length;
  let offset = 0;

  while (offset < total) {
    const chunk = uint8Data.slice(offset, offset + CHUNK_SIZE);

    if (characteristic.properties.writeWithoutResponse) {
      await characteristic.writeValueWithoutResponse(chunk);
    } else {
      await characteristic.writeValue(chunk);
    }

    offset += CHUNK_SIZE;

    if (onProgress) {
      onProgress(Math.min(100, Math.round((offset / total) * 100)));
    }

    // Pequeño descanso de 15ms para drenar el buffer Bluetooth
    await new Promise((resolve) => setTimeout(resolve, 15));
  }
}

/**
 * Imprime un lote continuo de etiquetas a la impresora Bluetooth Phomemo ("De un solo")
 * @param {BluetoothRemoteGATTCharacteristic} characteristic - Característica BLE conectada
 * @param {Array} labelsList - Lista de productos (repetidos según la cantidad solicitada)
 * @param {Object} options - Configuración visual de la etiqueta (showPrice, showCompany, etc.)
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
        percentage: Math.round(((i) / total) * 100),
        labelName: item.nombre || 'Repuesto'
      });
    }

    // 1. Renderizar etiqueta en canvas de alta resolución térmica
    const canvas = render2x1LabelCanvas(item, options);

    // 2. Empaquetar a comandos de imagen Phomemo ESC/POS
    const rasterData = canvasToPhomemoRaster(canvas);

    // 3. Transmitir por Bluetooth
    await sendBluetoothData(characteristic, rasterData);

    // Pausa de 350ms entre etiquetas para que el motor mecánico avance y corte/alinee la etiqueta
    if (i < total - 1) {
      await new Promise((resolve) => setTimeout(resolve, 350));
    }
  }

  if (onProgress) {
    onProgress({
      current: total,
      total,
      percentage: 100,
      labelName: 'Completado'
    });
  }

  return { success: true, count: total };
}

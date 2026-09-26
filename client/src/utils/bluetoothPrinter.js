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

    // Helper para seleccionar la mejor característica de escritura
    const pickBestChar = (chars) => {
      // 1. Buscar prioritariamente la característica 'ff02' o 'ffe1'
      let found = chars.find(c =>
        (c.uuid.includes('ff02') || c.uuid.includes('ffe1')) &&
        (c.properties.write || c.properties.writeWithoutResponse)
      );
      // 2. Si no, cualquiera que soporte write con respuesta
      if (!found) {
        found = chars.find(c => c.properties.write);
      }
      // 3. Si no, cualquiera con writeWithoutResponse
      if (!found) {
        found = chars.find(c => c.properties.writeWithoutResponse);
      }
      return found;
    };

    // 1. Probar primero los servicios conocidos
    for (const serviceUuid of PHOMEMO_BLE_SERVICES) {
      try {
        const service = await server.getPrimaryService(serviceUuid);
        const chars = await service.getCharacteristics();
        const target = pickBestChar(chars);
        if (target) {
          writeCharacteristic = target;
          break;
        }
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
          const target = pickBestChar(chars);
          if (target) {
            writeCharacteristic = target;
            break;
          }
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
 * Envío seguro de un chunk a la característica GATT
 * Prioriza writeValueWithResponse / writeValue para esperar la confirmación de hardware
 */
async function writeGattChunk(characteristic, data) {
  // 1. Intentar primero con confirmación (espera ACK del microcontrolador)
  if (characteristic.properties.write) {
    if (typeof characteristic.writeValueWithResponse === 'function') {
      try {
        await characteristic.writeValueWithResponse(data);
        return;
      } catch (e1) {
        // Fallback al siguiente método
      }
    }
    if (typeof characteristic.writeValue === 'function') {
      try {
        await characteristic.writeValue(data);
        return;
      } catch (e2) {
        // Fallback
      }
    }
  }

  // 2. Modo sin respuesta si no hay soporte con confirmación
  if (characteristic.properties.writeWithoutResponse) {
    if (typeof characteristic.writeValueWithoutResponse === 'function') {
      await characteristic.writeValueWithoutResponse(data);
      return;
    }
  }

  // 3. Fallback genérico
  if (typeof characteristic.writeValue === 'function') {
    await characteristic.writeValue(data);
  } else if (typeof characteristic.writeValueWithoutResponse === 'function') {
    await characteristic.writeValueWithoutResponse(data);
  } else {
    throw new Error('La característica Bluetooth no tiene permisos de escritura.');
  }
}

/**
 * Envía un payload binario completo a la impresora en chunks seguros de 128 bytes
 * controlando la cadencia para no desbordar el búfer de recepción
 */
export async function sendBluetoothPayload(characteristic, uint8Data, onProgress = null) {
  const CHUNK_SIZE = 128; // Paquetes de 128 bytes óptimos para BLE
  const total = uint8Data.length;
  let offset = 0;

  // Si la característica no usa confirmación GATT, damos más tiempo entre paquetes (30ms vs 18ms)
  const isReliable = characteristic.properties.write;
  const chunkDelay = isReliable ? 18 : 32;

  while (offset < total) {
    const chunk = uint8Data.slice(offset, offset + CHUNK_SIZE);
    await writeGattChunk(characteristic, chunk);
    offset += CHUNK_SIZE;

    if (onProgress) {
      onProgress(Math.min(100, Math.round((offset / total) * 100)));
    }

    await new Promise((resolve) => setTimeout(resolve, chunkDelay));
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
 * Carga la imagen del logo de la empresa para ser incrustada en el Canvas
 */
export function loadLogoImage(url = '/icons/logo.png') {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || typeof Image === 'undefined') {
      return resolve(null);
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      console.warn('No se pudo cargar el logo desde:', url);
      resolve(null);
    };
    img.src = url;
  });
}

/**
 * Calcula el checksum Adler-32 para el bloque ZLIB (RFC 1950)
 */
function adler32(data) {
  let a = 1;
  let b = 0;
  const MOD_ADLER = 65521;
  for (let i = 0; i < data.length; i++) {
    a = (a + data[i]) % MOD_ADLER;
    b = (b + a) % MOD_ADLER;
  }
  return ((b << 16) | a) >>> 0;
}

/**
 * Empaqueta un buffer de bytes crudos en un stream ZLIB RFC 1950 válido (window_bits=10, Deflate stored block)
 * Compatible directamente con los microcontroladores de la serie Quin / PrintMaster (Q199, M110, Q30)
 */
function buildZlibStoredStream(rawBytes) {
  const len = rawBytes.length;
  const nlen = (~len) & 0xFFFF;
  const adler = adler32(rawBytes);

  // 2 bytes ZLIB header (CMF=0x28 wbits=10, FLG=0x15)
  // + 5 bytes Deflate block header (BFINAL=1, BTYPE=00, LEN 16-bit LE, NLEN 16-bit LE)
  // + len bytes de datos
  // + 4 bytes Adler-32 checksum (Big Endian)
  const stream = new Uint8Array(2 + 5 + len + 4);
  stream[0] = 0x28; // CMF (Deflate, 1KB window)
  stream[1] = 0x15; // FLG ((0x28 * 256 + 0x15) % 31 === 0)
  stream[2] = 0x01; // BFINAL=1, BTYPE=00 (stored/uncompressed)
  stream[3] = len & 0xFF;
  stream[4] = (len >> 8) & 0xFF;
  stream[5] = nlen & 0xFF;
  stream[6] = (nlen >> 8) & 0xFF;
  stream.set(rawBytes, 7);

  const adlerPos = 7 + len;
  stream[adlerPos] = (adler >> 24) & 0xFF;
  stream[adlerPos + 1] = (adler >> 16) & 0xFF;
  stream[adlerPos + 2] = (adler >> 8) & 0xFF;
  stream[adlerPos + 3] = adler & 0xFF;

  return stream;
}

/**
 * Renderiza una etiqueta 2x1 pulgadas (384 x 200 px a 203 DPI) en un Canvas HTML5
 * con estética limpia, contraste térmico perfecto, logo del negocio y disposición nítida.
 */
export function render2x1LabelCanvas(product, options = {}) {
  const {
    showCompany = true,
    showLogo = true,
    logoImage = null,
    showPrice = true,
    showCategory = false,
    codeType = 'barcode',
    storeName = 'MULTIREPUESTOS RG'
  } = options;

  const width = 384; // 48 mm * 8 puntos/mm = 384 puntos exactos (ancho cabezal térmico M110/Q199)
  const height = 200; // 25 mm * 8 puntos/mm = 200 puntos exactos (2x1 pulgada)

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  // Fondo blanco puro
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#000000';

  let currentY = 5;

  // 1. Encabezado con Logo del Negocio y Nombre de la Empresa
  const hasLogo = Boolean(showLogo && logoImage);
  if (showCompany || hasLogo) {
    const logoSize = 22; // 22x22 px cabe perfecto sin desplazar la información crítica
    ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';

    if (hasLogo && showCompany) {
      const textMetrics = ctx.measureText(storeName);
      const gap = 6;
      const totalHeaderWidth = logoSize + gap + textMetrics.width;
      const startX = Math.max(8, (width - totalHeaderWidth) / 2);

      // Dibujar logo del negocio
      ctx.drawImage(logoImage, startX, currentY, logoSize, logoSize);

      // Dibujar nombre de empresa centrado verticalmente respecto al logo
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(storeName, startX + logoSize + gap, currentY + (logoSize / 2));
      currentY += logoSize + 4;
    } else if (hasLogo) {
      ctx.drawImage(logoImage, (width - logoSize) / 2, currentY, logoSize, logoSize);
      currentY += logoSize + 4;
    } else if (showCompany) {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(storeName, width / 2, currentY);
      currentY += 16;
    }
  } else {
    currentY += 4;
  }

  // 2. Nombre del Producto (1 o 2 líneas, negrita de alta visibilidad)
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
  const prodName = product.nombre || 'Repuesto';
  const textHeight = drawWrappedText(ctx, prodName, width / 2, currentY, width - 20, 16, 2);
  currentY += textHeight + 4;

  const rawCode = String(product.codigo_barras || product.codigo || '000000');

  // 3. Renderizado de Código de Barras / QR
  if (codeType === 'barcode' || codeType === 'hybrid') {
    try {
      const barcodeCanvas = document.createElement('canvas');
      JsBarcode(barcodeCanvas, rawCode, {
        format: 'CODE128',
        width: 1.5,
        height: 40,
        displayValue: false,
        margin: 0,
        background: '#ffffff',
        lineColor: '#000000'
      });

      const bcWidth = barcodeCanvas.width;
      const drawWidth = Math.min(bcWidth, width - 24);
      const drawX = (width - drawWidth) / 2;

      ctx.drawImage(barcodeCanvas, drawX, currentY, drawWidth, 40);
      currentY += 43;
    } catch (err) {
      console.warn('Error dibujando código de barras en canvas:', err);
      currentY += 40;
    }
  } else {
    currentY += 38;
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
 * Cada byte = 8 píxeles horizontales, MSB = pixel izquierdo, bit 1 = negro (calor térmico).
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

          // Manejo de transparencia y contraste térmico
          if (a > 64) {
            const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
            if (luminance < 175) {
              byteVal |= (1 << (7 - bit));
            }
          }
        }
      }
      bitmap[byteIndex++] = byteVal;
    }
  }

  return bitmap;
}

/**
 * Detecta el protocolo predeterminado según el nombre del dispositivo Bluetooth reportado
 */
export function detectProtocolFromName(name) {
  if (!name) return 'printmaster_0x1f';
  const n = String(name).toUpperCase();
  // Familias Quin / PrintMaster (Q199, Q042, Q061, Q119, Q192, Q194, M110, M120, M220, PrintMaster)
  if (
    n.startsWith('Q') ||
    n.includes('Q199') ||
    n.includes('M110') ||
    n.includes('PRINTMASTER') ||
    n.includes('M108') ||
    n.includes('M120') ||
    n.includes('M220') ||
    n.includes('M200')
  ) {
    return 'printmaster_0x1f';
  }
  if (n.includes('D30') || n.includes('D35') || n.includes('D110')) {
    return 'd_series';
  }
  if (n.includes('M02') || n.includes('T02')) {
    return 'm02_series';
  }
  return 'printmaster_0x1f';
}

/**
 * Construye el payload nativo 0x1F para impresoras Quin / PrintMaster (Q199, M110, Q30)
 * Usa compresión Deflate encapsulada en ZLIB (RFC 1950) y delimitadores 0x1F C0
 */
export function buildPrintMaster0x1FPayload(canvas, options = {}) {
  const {
    density = 0x03, // Densidad PrintMaster 1-5 (3 = medio, 5 = oscuro)
    media = 0x20     // 0x20 = Papel con separación (Gap 2x1), 0x10 = Continuo
  } = options;

  const width = canvas.width; // 384
  const height = canvas.height; // 200
  const widthBytes = Math.ceil(width / 8); // 48
  const rawBitmap = canvasTo1BitBitmap(canvas); // 9600 bytes
  const zlibStream = buildZlibStoredStream(rawBitmap); // 9611 bytes
  const zlibLen = zlibStream.length;

  const parts = [];

  // 1. Configurar tipo de papel (0x20 = Gap troquelado 2x1, 0x10 = Continuo)
  const paperMode = (media === 0x0B || media === 0x10) ? 0x10 : 0x20;
  parts.push(new Uint8Array([0x1F, 0x80, 0x01, paperMode]));

  // 2. Configurar densidad / energía de impresión (1-5)
  const densByte = Math.min(5, Math.max(1, Number(density) || 3));
  parts.push(new Uint8Array([0x1F, 0x20, 0x01, densByte]));

  // 3. Iniciar trabajo de impresión (Start Print Job)
  parts.push(new Uint8Array([0x1F, 0xC0, 0x01, 0x00]));

  // 4. Alinear posición de inicio (Align start)
  parts.push(new Uint8Array([0x1F, 0x11, 0x51]));

  // 5. Comando de Imagen 0x1F 0x10:
  // Encabezado de 10 bytes: 0x1F, 0x10, widthBytes(2B BE), height(2B BE), zlibLen(4B BE)
  const imgHeader = new Uint8Array([
    0x1F, 0x10,
    (widthBytes >> 8) & 0xFF, widthBytes & 0xFF,
    (height >> 8) & 0xFF, height & 0xFF,
    (zlibLen >> 24) & 0xFF, (zlibLen >> 16) & 0xFF, (zlibLen >> 8) & 0xFF, zlibLen & 0xFF
  ]);
  parts.push(imgHeader);
  parts.push(zlibStream);

  // 6. Finalizar trabajo de impresión (End Print Job)
  parts.push(new Uint8Array([0x1F, 0xC0, 0x01, 0x01]));

  // 7. Avanzar papel a la línea de corte / separación óptica (Feed paper)
  parts.push(new Uint8Array([0x1F, 0x11, 0x50]));

  // Concatenar todos los bloques
  const totalLength = parts.reduce((acc, p) => acc + p.length, 0);
  const payload = new Uint8Array(totalLength);
  let pos = 0;
  for (const p of parts) {
    payload.set(p, pos);
    pos += p.length;
  }
  return payload;
}

/**
 * Construye el payload ESC/POS para PrintMaster / Phomemo M110 con avance seguro de 80 puntos
 */
export function buildPrintMasterEscPayload(canvas, options = {}) {
  const {
    density = 0x0F,
    speed = 0x03
  } = options;

  const width = canvas.width; // 384
  const height = canvas.height; // 200
  const widthBytes = Math.ceil(width / 8); // 48 bytes
  const bitmap = canvasTo1BitBitmap(canvas); // 9600 bytes

  const parts = [];

  // Comandos de control PrintMaster
  parts.push(new Uint8Array([0x1F, 0x11, 0x02, density & 0xFF])); // Densidad
  parts.push(new Uint8Array([0x1F, 0x11, 0x23, speed & 0xFF]));   // Velocidad
  parts.push(new Uint8Array([0x1B, 0x40]));                       // Reset ESC @
  parts.push(new Uint8Array([0x1F, 0x11, 0x21, 0x01]));           // Cantidad copias = 1

  // Bloque raster estándar GS v 0
  parts.push(new Uint8Array([
    0x1D, 0x76, 0x30, 0x00,
    widthBytes & 0xFF, (widthBytes >> 8) & 0xFF,
    height & 0xFF, (height >> 8) & 0xFF
  ]));
  parts.push(bitmap);

  // Avance mecánico calibrado (ESC J 80 puntos = 10mm) hacia la línea de corte
  parts.push(new Uint8Array([0x1B, 0x4A, 0x50]));

  const totalLength = parts.reduce((acc, p) => acc + p.length, 0);
  const payload = new Uint8Array(totalLength);
  let pos = 0;
  for (const p of parts) {
    payload.set(p, pos);
    pos += p.length;
  }
  return payload;
}

/**
 * Construye el payload binario completo y contiguo para una etiqueta
 * en un solo flujo continuo según el modelo/protocolo seleccionado
 */
export function buildLabelPayload(canvas, options = {}) {
  const {
    protocol = 'printmaster_0x1f',
    speed = 0x05,
    density = 0x0F,
    media = 0x0A
  } = options;

  // Protocolo Nativo Quin / PrintMaster 0x1F (Q199, Q30, M110)
  if (protocol === 'printmaster_0x1f') {
    return buildPrintMaster0x1FPayload(canvas, options);
  }

  // Protocolo PrintMaster ESC/POS con feed calibrado
  if (protocol === 'printmaster_esc') {
    return buildPrintMasterEscPayload(canvas, options);
  }

  const width = canvas.width; // 384
  const height = canvas.height; // 200
  const widthBytes = Math.ceil(width / 8); // 48 bytes
  const bitmap = canvasTo1BitBitmap(canvas); // 9600 bytes

  const parts = [];

  if (protocol === 'd_series') {
    // Protocolo Phomemo Serie D (D30, Q30, etc.)
    parts.push(new Uint8Array([0x1F, 0x11, 0x24, 0x00, 0x1B, 0x40]));
    parts.push(new Uint8Array([
      0x1D, 0x76, 0x30, 0x00,
      widthBytes & 0xFF, (widthBytes >> 8) & 0xFF,
      height & 0xFF, (height >> 8) & 0xFF
    ]));
    parts.push(bitmap);
    parts.push(new Uint8Array([0x1B, 0x64, 0x02]));
  } else if (protocol === 'm02_series') {
    // Protocolo Phomemo Serie M02 / T02
    parts.push(new Uint8Array([
      0x1B, 0x40,
      0x1B, 0x61, 0x01,
      0x1F, 0x11, 0x02, 0x04
    ]));
    parts.push(new Uint8Array([
      0x1D, 0x76, 0x30, 0x00,
      widthBytes & 0xFF, (widthBytes >> 8) & 0xFF,
      height & 0xFF, (height >> 8) & 0xFF
    ]));
    parts.push(bitmap);
    parts.push(new Uint8Array([
      0x1B, 0x64, 0x02,
      0x1F, 0x11, 0x08,
      0x1F, 0x11, 0x0E,
      0x1F, 0x11, 0x07,
      0x1F, 0x11, 0x09
    ]));
  } else if (protocol === 'm_series_esc') {
    // Phomemo Serie M con Reset ESC @ inicial y avance seguro
    parts.push(new Uint8Array([
      0x1B, 0x40,
      0x1B, 0x4E, 0x0D, speed,
      0x1B, 0x4E, 0x04, density,
      0x1F, 0x11, media
    ]));
    parts.push(new Uint8Array([
      0x1D, 0x76, 0x30, 0x00,
      widthBytes & 0xFF, (widthBytes >> 8) & 0xFF,
      height & 0xFF, (height >> 8) & 0xFF
    ]));
    parts.push(bitmap);
    parts.push(new Uint8Array([0x1B, 0x4A, 0x40]));
  } else if (protocol === 'esc_pos_std') {
    // Protocolo ESC/POS estándar
    parts.push(new Uint8Array([0x1B, 0x40]));
    parts.push(new Uint8Array([
      0x1D, 0x76, 0x30, 0x00,
      widthBytes & 0xFF, (widthBytes >> 8) & 0xFF,
      height & 0xFF, (height >> 8) & 0xFF
    ]));
    parts.push(bitmap);
    parts.push(new Uint8Array([0x1B, 0x64, 0x03]));
  } else {
    // Protocolo Canónico Serie M (M110, M120, M200, M220) con avance de corte
    parts.push(new Uint8Array([
      0x1B, 0x4E, 0x0D, speed,
      0x1B, 0x4E, 0x04, density,
      0x1F, 0x11, media
    ]));
    parts.push(new Uint8Array([
      0x1D, 0x76, 0x30, 0x00,
      widthBytes & 0xFF, (widthBytes >> 8) & 0xFF,
      height & 0xFF, (height >> 8) & 0xFF
    ]));
    parts.push(bitmap);
    parts.push(new Uint8Array([0x1B, 0x4A, 0x40]));
  }

  // Concatenar todos los bloques en un solo buffer binario contiguo
  const totalLength = parts.reduce((acc, p) => acc + p.length, 0);
  const payload = new Uint8Array(totalLength);
  let pos = 0;
  for (const p of parts) {
    payload.set(p, pos);
    pos += p.length;
  }

  return payload;
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

  // Cargar imagen del logo de forma asíncrona una sola vez para todo el lote
  let logoImage = options.logoImage || null;
  if (!logoImage && options.showLogo !== false) {
    try {
      logoImage = await loadLogoImage('/icons/logo.png');
    } catch (e) {
      console.warn('Error cargando logo para impresión:', e);
    }
  }

  const batchOptions = { ...options, logoImage };

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

    // 1. Renderizar etiqueta en Canvas 2D con el logo del negocio
    const canvas = render2x1LabelCanvas(item, batchOptions);

    // 2. Construir payload binario completo según el protocolo seleccionado
    const payload = buildLabelPayload(canvas, batchOptions);

    // 3. Enviar todo el payload continuo en paquetes seguros esperando respuesta GATT
    await sendBluetoothPayload(characteristic, payload, (chunkPercent) => {
      if (onProgress) {
        const overall = Math.round(((i + (chunkPercent / 100)) / total) * 100);
        onProgress({
          current: i + 1,
          total,
          percentage: overall,
          labelName: item.nombre || 'Repuesto'
        });
      }
    });

    // 4. Pausa mecánica entre etiquetas consecutivas (800ms) para que el motor
    // avance la etiqueta y el sensor óptico gap se estabilice
    if (i < total - 1) {
      await new Promise(r => setTimeout(r, 800));
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


import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const fmt = (n) =>
  new Intl.NumberFormat('es-NI', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(n || 0));

const fmtC = (n) => `C$ ${fmt(n)}`;

const fmtDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-NI', {
    timeZone: 'America/Managua',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const fmtDateTime = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('es-NI', {
    timeZone: 'America/Managua',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const safeFileName = (str = '') =>
  String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 40) || 'Cliente';

const loadImageAsDataUrl = (url) =>
  new Promise((resolve) => {
    if (!url) return resolve(null);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const maxSide = 220;
        const scale = Math.min(1, maxSide / Math.max(img.width || 1, img.height || 1));
        canvas.width = Math.max(1, Math.round((img.width || 100) * scale));
        canvas.height = Math.max(1, Math.round((img.height || 100) * scale));
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve({
          dataUrl: canvas.toDataURL('image/png'),
          ratio: canvas.width / canvas.height,
        });
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });

const drawHeaderAndClientBox = async (doc, { companyInfo, docTitle, docBadgeColor, folio, periodLabel, cliente, summaryItems, highlightLabel, highlightValue, highlightIsDebt }) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;

  // Top dark-navy accent strip
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 4.5, 'F');
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 4.5, pageWidth, 1.5, 'F');

  // Logo + Company Info (Left)
  let textStartX = margin;
  const logoObj = await loadImageAsDataUrl(companyInfo.logo);
  if (logoObj?.dataUrl) {
    const logoH = 16;
    const logoW = Math.min(26, logoH * (logoObj.ratio || 1));
    doc.addImage(logoObj.dataUrl, 'PNG', margin, 11, logoW, logoH);
    textStartX = margin + logoW + 4;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text(String(companyInfo.name || 'Multirepuestos RG'), textStartX, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`RUC: ${companyInfo.ruc || 'N/A'}   |   Tel: ${companyInfo.phone || 'N/A'}`, textStartX, 20.5);
  const addrLines = doc.splitTextToSize(String(companyInfo.address || ''), 92);
  doc.text(addrLines, textStartX, 24.5);

  // Document Title Badge (Right)
  const rightBoxW = 74;
  const rightBoxX = pageWidth - margin - rightBoxW;
  const badgeRGB = docBadgeColor || [30, 58, 138];
  doc.setFillColor(badgeRGB[0], badgeRGB[1], badgeRGB[2]);
  doc.roundedRect(rightBoxX, 10.5, rightBoxW, 8.5, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(255, 255, 255);
  doc.text(docTitle, rightBoxX + rightBoxW / 2, 16, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Folio: ${folio}`, pageWidth - margin, 22.8, { align: 'right' });
  doc.text(`Emitido: ${fmtDateTime(new Date().toISOString())}`, pageWidth - margin, 26.5, { align: 'right' });
  if (periodLabel) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(37, 99, 235);
    doc.text(periodLabel, pageWidth - margin, 30.2, { align: 'right' });
  }

  // Divider line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(margin, 33, pageWidth - margin, 33);

  // Client Info Card (Left) & Financial Summary Card (Right)
  const cardTop = 36.5;
  const cardH = 29;
  const leftCardW = (pageWidth - margin * 2) * 0.52;
  const rightCardW = (pageWidth - margin * 2) - leftCardW - 4;
  const rightCardX = margin + leftCardW + 4;

  // Left card background
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, cardTop, leftCardW, cardH, 2.5, 2.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(100, 116, 139);
  doc.text('DATOS DEL CLIENTE', margin + 4, cardTop + 5.2);

  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(String(cliente.nombre || 'Cliente'), margin + 4, cardTop + 10.8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  const idStr = `ID #${cliente.id || cliente.id_cliente || '—'}`;
  const telStr = `Tel: ${cliente.telefono || 'N/A'}`;
  const cedStr = cliente.cedula ? `  |  Cédula/RUC: ${cliente.cedula}` : '';
  doc.text(`${idStr}  |  ${telStr}${cedStr}`, margin + 4, cardTop + 16);

  const limStr = cliente.limite_credito === null || cliente.limite_credito === undefined
    ? 'Sin límite autorizado'
    : fmtC(cliente.limite_credito);
  doc.text(`Límite de Crédito: ${limStr}`, margin + 4, cardTop + 20.6);

  if (cliente.direccion) {
    const dirLine = doc.splitTextToSize(`Dirección: ${cliente.direccion}`, leftCardW - 8)[0];
    doc.text(dirLine, margin + 4, cardTop + 25.2);
  }

  // Right card background (Financial Summary)
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(rightCardX, cardTop, rightCardW, cardH, 2.5, 2.5, 'FD');

  let sy = cardTop + 5.5;
  summaryItems.forEach((item) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.8);
    doc.setTextColor(71, 85, 105);
    doc.text(item.label, rightCardX + 4, sy);

    doc.setFont('helvetica', 'bold');
    const c = item.color || [15, 23, 42];
    doc.setTextColor(c[0], c[1], c[2]);
    doc.text(item.value, rightCardX + rightCardW - 4, sy, { align: 'right' });
    sy += 4.8;
  });

  // Highlight bar inside Right Card
  const hlY = cardTop + cardH - 9.2;
  if (highlightIsDebt) {
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(252, 165, 165);
  } else {
    doc.setFillColor(236, 253, 245);
    doc.setDrawColor(134, 239, 172);
  }
  doc.roundedRect(rightCardX + 2.5, hlY, rightCardW - 5, 7.2, 1.8, 1.8, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(highlightIsDebt ? 185 : 21, highlightIsDebt ? 28 : 128, highlightIsDebt ? 28 : 61);
  doc.text(highlightLabel, rightCardX + 5, hlY + 4.8);
  doc.setFontSize(9.8);
  doc.text(highlightValue, rightCardX + rightCardW - 5, hlY + 4.8, { align: 'right' });

  return cardTop + cardH + 5;
};

const addPageFooters = (doc, companyInfo) => {
  const totalPages = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `Documento informativo · ${companyInfo.name || 'Multirepuestos RG'} · Tel: ${companyInfo.phone || ''}`,
      margin,
      pageHeight - 7.5
    );
    doc.text(`Página ${i} de ${totalPages}`, pageWidth - margin, pageHeight - 7.5, { align: 'right' });
  }
};

/**
 * Genera y descarga un PDF ejecutivo del Estado de Cuenta del Cliente (Cuadrado al centavo)
 */
export async function generateAccountStatementPDF({
  companyInfo,
  cliente,
  mode, // 'PENDING' | 'CYCLE' | 'HISTORY' | 'PAID'
  rows,
  summary,
  showProducts = true,
  periodLabel = '',
}) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const margin = 14;
  const pageWidth = doc.internal.pageSize.getWidth();
  const todayTag = new Date().toISOString().slice(0, 10);
  const folio = `EC-${cliente.id || '0'}-${todayTag.replace(/-/g, '')}`;

  const titleMap = {
    PENDING: 'FACTURAS PENDIENTES DE PAGO',
    CYCLE: 'ESTADO DE CUENTA ACTUAL',
    HISTORY: 'ESTADO DE CUENTA HISTÓRICO',
    PAID: 'HISTORIAL DE PAGOS Y ABONOS',
  };

  const badgeColorMap = {
    PENDING: [185, 28, 28],
    CYCLE: [30, 58, 138],
    HISTORY: [15, 23, 42],
    PAID: [5, 150, 105],
  };

  const saldoFinal = Number(summary.saldoFinal || 0);

  let summaryItems = [];
  if (mode === 'PENDING') {
    summaryItems = [
      { label: 'Facturas Pendientes:', value: `${summary.pendingCount} factura(s)` },
      { label: 'Monto Original:', value: fmtC(summary.pendingOriginal) },
      { label: 'Abonado a estas Fact.:', value: `- ${fmtC(summary.pendingAbonado)}`, color: [5, 150, 105] },
    ];
  } else if (mode === 'PAID') {
    summaryItems = [
      { label: 'Total Abonado:', value: fmtC(summary.totalAbonos), color: [5, 150, 105] },
      { label: 'Contado / Efectivo:', value: fmtC(summary.abonosEfectivo) },
      { label: 'Transferencia / Tarjeta:', value: fmtC(summary.abonosTransf + summary.abonosTarjeta) },
    ];
  } else {
    summaryItems = [
      { label: 'Saldo Anterior:', value: fmtC(summary.openingBalance) },
      { label: '(+) Cargos / Créditos:', value: `+ ${fmtC(summary.periodCargos)}`, color: [220, 38, 38] },
      { label: '(-) Abonos / Devoluciones:', value: `- ${fmtC(summary.periodAbonos)}`, color: [5, 150, 105] },
    ];
  }

  const startY = await drawHeaderAndClientBox(doc, {
    companyInfo,
    docTitle: titleMap[mode] || 'ESTADO DE CUENTA',
    docBadgeColor: badgeColorMap[mode] || [30, 58, 138],
    folio,
    periodLabel,
    cliente,
    summaryItems,
    highlightLabel: saldoFinal > 0 ? 'SALDO PENDIENTE:' : 'ESTADO DE CUENTA:',
    highlightValue: saldoFinal > 0 ? fmtC(saldoFinal) : 'AL DÍA (C$ 0.00)',
    highlightIsDebt: saldoFinal > 0,
  });

  // Construir filas de la tabla según el modo
  let head = [];
  let body = [];
  let columnStyles = {};

  if (mode === 'PENDING') {
    head = [['Fecha', 'Factura', 'Detalle / Estado', 'Total Fact.', 'Abonado', 'Pendiente']];
    columnStyles = {
      0: { cellWidth: 22 },
      1: { cellWidth: 22, fontStyle: 'bold' },
      2: { cellWidth: 'auto' },
      3: { cellWidth: 25, halign: 'right' },
      4: { cellWidth: 25, halign: 'right', textColor: [5, 150, 105] },
      5: { cellWidth: 27, halign: 'right', fontStyle: 'bold', textColor: [185, 28, 28] },
    };

    if (rows.length === 0) {
      body.push([
        {
          content: 'Cuenta al día — No existen facturas pendientes de pago.',
          colSpan: 6,
          styles: { halign: 'center', fontStyle: 'bold', textColor: [5, 150, 105], fillColor: [236, 253, 245], cellPadding: 6 },
        },
      ]);
    } else {
      rows.forEach((f) => {
        body.push([
          fmtDate(f.fecha),
          `#${f.id_venta}`,
          `${f.estado}${f.usuario ? ` · Atendió: ${f.usuario}` : ''}`,
          fmtC(f.monto_original),
          f.abonado > 0 ? fmtC(f.abonado) : 'C$ 0.00',
          fmtC(f.saldo_pendiente),
        ]);
        if (showProducts && Array.isArray(f.productos) && f.productos.length > 0) {
          f.productos.forEach((p) => {
            body.push([
              { content: '', styles: { fillColor: [248, 250, 252] } },
              {
                content: `• ${p.cantidad} x ${p.nombre}${p.codigo ? ` (${p.codigo})` : ''}`,
                colSpan: 3,
                styles: { fontSize: 7.4, textColor: [71, 85, 105], fillColor: [248, 250, 252], cellPadding: { top: 1.5, bottom: 1.5, left: 4, right: 2 } },
              },
              {
                content: `@ ${fmtC(p.precioUnitario)}`,
                styles: { fontSize: 7.4, halign: 'right', textColor: [100, 116, 139], fillColor: [248, 250, 252], cellPadding: { top: 1.5, bottom: 1.5, left: 2, right: 2 } },
              },
              {
                content: fmtC(p.subtotal),
                styles: { fontSize: 7.4, halign: 'right', fontStyle: 'bold', textColor: [51, 65, 85], fillColor: [248, 250, 252], cellPadding: { top: 1.5, bottom: 1.5, left: 2, right: 2 } },
              },
            ]);
          });
        }
      });

      // Fila total de cuadre
      body.push([
        { content: 'TOTAL PENDIENTE DE PAGO', colSpan: 3, styles: { fontStyle: 'bold', fillColor: [241, 245, 249], textColor: [15, 23, 42] } },
        { content: fmtC(summary.pendingOriginal), styles: { halign: 'right', fontStyle: 'bold', fillColor: [241, 245, 249] } },
        { content: fmtC(summary.pendingAbonado), styles: { halign: 'right', fontStyle: 'bold', textColor: [5, 150, 105], fillColor: [241, 245, 249] } },
        { content: fmtC(summary.saldoFinal), styles: { halign: 'right', fontStyle: 'bold', textColor: [185, 28, 28], fillColor: [254, 242, 242], fontSize: 9.5 } },
      ]);
    }
  } else if (mode === 'PAID') {
    head = [['Fecha', 'Recibo', 'Método de Pago', 'Destino / Referencia', 'Usuario', 'Abonado']];
    columnStyles = {
      0: { cellWidth: 23 },
      1: { cellWidth: 19, fontStyle: 'bold' },
      2: { cellWidth: 34 },
      3: { cellWidth: 'auto' },
      4: { cellWidth: 24 },
      5: { cellWidth: 27, halign: 'right', fontStyle: 'bold', textColor: [5, 150, 105] },
    };

    if (rows.length === 0) {
      body.push([
        { content: 'No hay abonos registrados en este período.', colSpan: 6, styles: { halign: 'center', textColor: [100, 116, 139], cellPadding: 6 } },
      ]);
    } else {
      rows.forEach((tx) => {
        const metodoLabel = tx.metodo === 'Efectivo' ? 'Contado / Efectivo' : (tx.metodo || 'Contado / Efectivo');
        const destRef = `${tx.destino || 'Cuenta General'}${tx.referencia ? ` · Ref: ${tx.referencia}` : ''}`;
        body.push([
          fmtDate(tx.fecha),
          `#${tx.id_venta}`,
          metodoLabel,
          destRef,
          tx.usuario || 'Sistema',
          fmtC(tx.monto),
        ]);
      });

      body.push([
        { content: `TOTAL ABONADO (${rows.length} pagos)`, colSpan: 5, styles: { fontStyle: 'bold', fillColor: [236, 253, 245], textColor: [6, 95, 70] } },
        { content: fmtC(summary.totalAbonos), styles: { halign: 'right', fontStyle: 'bold', fillColor: [236, 253, 245], textColor: [5, 150, 105], fontSize: 9.5 } },
      ]);
    }
  } else {
    // CYCLE or HISTORY
    head = [['Fecha', 'Concepto / Documento', 'Cargo (+)', 'Abono (-)', 'Saldo']];
    columnStyles = {
      0: { cellWidth: 22 },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 26, halign: 'right', textColor: [185, 28, 28] },
      3: { cellWidth: 26, halign: 'right', textColor: [5, 150, 105] },
      4: { cellWidth: 28, halign: 'right', fontStyle: 'bold', textColor: [15, 23, 42] },
    };

    if (summary.showOpeningRow) {
      body.push([
        { content: '—', styles: { fillColor: [241, 245, 249], textColor: [71, 85, 105] } },
        { content: summary.openingLabel || 'Saldo Anterior al Período', styles: { fontStyle: 'bold', fillColor: [241, 245, 249], textColor: [15, 23, 42] } },
        { content: '—', styles: { halign: 'right', fillColor: [241, 245, 249] } },
        { content: '—', styles: { halign: 'right', fillColor: [241, 245, 249] } },
        { content: fmtC(summary.openingBalance), styles: { halign: 'right', fontStyle: 'bold', fillColor: [241, 245, 249] } },
      ]);
    }

    if (rows.length === 0) {
      body.push([
        { content: 'Sin movimientos registrados en el período seleccionado.', colSpan: 5, styles: { halign: 'center', textColor: [100, 116, 139], cellPadding: 6 } },
      ]);
    } else {
      rows.forEach((tx) => {
        body.push([
          fmtDate(tx.fecha),
          tx.descripcion,
          tx.impacto > 0 ? fmtC(tx.monto) : '—',
          tx.impacto < 0 ? fmtC(tx.monto) : '—',
          fmtC(tx.saldo),
        ]);

        if (showProducts && Array.isArray(tx.productos) && tx.productos.length > 0) {
          tx.productos.forEach((p) => {
            body.push([
              { content: '', styles: { fillColor: [248, 250, 252] } },
              {
                content: `• ${p.cantidad} x ${p.nombre}${p.codigo ? ` (${p.codigo})` : ''}`,
                colSpan: 2,
                styles: { fontSize: 7.3, textColor: [71, 85, 105], fillColor: [248, 250, 252], cellPadding: { top: 1.4, bottom: 1.4, left: 4, right: 2 } },
              },
              {
                content: `@ ${fmtC(p.precioUnitario)}`,
                styles: { fontSize: 7.3, halign: 'right', textColor: [100, 116, 139], fillColor: [248, 250, 252], cellPadding: { top: 1.4, bottom: 1.4, left: 2, right: 2 } },
              },
              {
                content: fmtC(p.subtotal),
                styles: { fontSize: 7.3, halign: 'right', fontStyle: 'bold', textColor: [51, 65, 85], fillColor: [248, 250, 252], cellPadding: { top: 1.4, bottom: 1.4, left: 2, right: 2 } },
              },
            ]);
          });
        }
      });

      if (summary.ajusteConciliacion && Math.abs(summary.ajusteConciliacion) >= 0.01) {
        const aj = summary.ajusteConciliacion;
        body.push([
          '—',
          'Ajuste / Conciliación Histórica de Cuenta',
          aj > 0 ? fmtC(aj) : '—',
          aj < 0 ? fmtC(Math.abs(aj)) : '—',
          fmtC(summary.saldoFinal),
        ]);
      }

      body.push([
        { content: 'TOTALES DEL PERÍODO / SALDO FINAL', colSpan: 2, styles: { fontStyle: 'bold', fillColor: [241, 245, 249], textColor: [15, 23, 42] } },
        { content: fmtC(summary.periodCargos), styles: { halign: 'right', fontStyle: 'bold', textColor: [185, 28, 28], fillColor: [241, 245, 249] } },
        { content: fmtC(summary.periodAbonos), styles: { halign: 'right', fontStyle: 'bold', textColor: [5, 150, 105], fillColor: [241, 245, 249] } },
        {
          content: fmtC(summary.saldoFinal),
          styles: {
            halign: 'right',
            fontStyle: 'bold',
            fontSize: 9.5,
            fillColor: summary.saldoFinal > 0 ? [254, 242, 242] : [236, 253, 245],
            textColor: summary.saldoFinal > 0 ? [185, 28, 28] : [5, 150, 105],
          },
        },
      ]);
    }
  }

  autoTable(doc, {
    startY,
    head,
    body,
    theme: 'grid',
    margin: { left: margin, right: margin, bottom: 18 },
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.2,
      cellPadding: 3,
    },
    styles: {
      font: 'helvetica',
      fontSize: 8.2,
      cellPadding: 2.6,
      lineColor: [226, 232, 240],
      lineWidth: 0.25,
      textColor: [15, 23, 42],
    },
    columnStyles,
  });

  // Cuadro final de cuadre matemático si hay espacio (o nueva página si falta)
  let finalY = (doc.lastAutoTable?.finalY || startY) + 7;
  if (finalY > doc.internal.pageSize.getHeight() - 32) {
    doc.addPage();
    finalY = 18;
  }

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, finalY, pageWidth - margin * 2, 14, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 58, 138);
  doc.text('RESUMEN DE CUADRE:', margin + 4, finalY + 5.2);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(51, 65, 85);
  const equationText =
    mode === 'PENDING'
      ? `Facturas Pendientes (${fmtC(summary.pendingOriginal)})  -  Abonos Aplicados (${fmtC(summary.pendingAbonado)})  =  SALDO A PAGAR: ${fmtC(summary.saldoFinal)}`
      : mode === 'PAID'
      ? `Total Recibido (${rows.length} abonos): ${fmtC(summary.totalAbonos)}   |   Saldo Pendiente Actual del Cliente: ${fmtC(summary.saldoFinal)}`
      : `Saldo Anterior (${fmtC(summary.openingBalance)})  +  Cargos (${fmtC(summary.periodCargos)})  -  Abonos (${fmtC(summary.periodAbonos)})  =  SALDO FINAL: ${fmtC(summary.saldoFinal)}`;
  doc.text(equationText, margin + 4, finalY + 10.6);

  addPageFooters(doc, companyInfo);

  const fileName = `Estado_Cuenta_${safeFileName(cliente.nombre)}_${todayTag}.pdf`;
  doc.save(fileName);
  return fileName;
}

/**
 * Genera y descarga un PDF ejecutivo del Reporte de Compras del Cliente (De fecha a fecha)
 */
export async function generatePurchasesReportPDF({
  companyInfo,
  cliente,
  kpis,
  compras,
  periodLabel = 'Historial Completo',
}) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const margin = 14;
  const todayTag = new Date().toISOString().slice(0, 10);
  const folio = `RC-${cliente.id_cliente || cliente.id || '0'}-${todayTag.replace(/-/g, '')}`;

  const range = kpis?.rango || {};
  const startY = await drawHeaderAndClientBox(doc, {
    companyInfo,
    docTitle: 'REPORTE DE COMPRAS',
    docBadgeColor: [2, 132, 199],
    folio,
    periodLabel,
    cliente,
    summaryItems: [
      { label: 'Total Histórico:', value: fmtC(kpis?.total_historico) },
      { label: `Comprado Año ${new Date().getFullYear()}:`, value: fmtC(kpis?.total_anio) },
      { label: 'Contado / Crédito (Rango):', value: `${fmtC(range.total_contado)} / ${fmtC(range.total_credito)}` },
    ],
    highlightLabel: 'TOTAL EN PERÍODO:',
    highlightValue: fmtC(range.total_comprado),
    highlightIsDebt: false,
  });

  const head = [['Fecha', 'Factura', 'Tipo / Método', 'Productos Comprados', 'Total']];
  const body = [];

  if (!compras || compras.length === 0) {
    body.push([{ content: 'No se registraron compras en el período seleccionado.', colSpan: 5, styles: { halign: 'center', cellPadding: 6 } }]);
  } else {
    compras.forEach((c) => {
      const prodText = (c.productos || []).length > 0
        ? c.productos.map((p) => `• ${p.cantidad}x ${p.nombre} (${fmtC(p.subtotal)})`).join('\n')
        : 'Sin detalle de ítems';
      body.push([
        fmtDate(c.fecha),
        `#${c.id_venta}`,
        `${c.tipo_venta}\n${c.metodo_pago || 'Efectivo'}${c.referencia ? `\nRef: ${c.referencia}` : ''}`,
        prodText,
        fmtC(c.total_venta),
      ]);
    });

    body.push([
      { content: `TOTAL GENERAL (${range.cantidad_facturas || compras.length} facturas · ${range.unidades_compradas || 0} uds)`, colSpan: 4, styles: { fontStyle: 'bold', fillColor: [239, 246, 255], textColor: [30, 58, 138] } },
      { content: fmtC(range.total_comprado), styles: { halign: 'right', fontStyle: 'bold', fillColor: [239, 246, 255], textColor: [30, 58, 138], fontSize: 9.5 } },
    ]);
  }

  autoTable(doc, {
    startY,
    head,
    body,
    theme: 'grid',
    margin: { left: margin, right: margin, bottom: 18 },
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8.2 },
    styles: { font: 'helvetica', fontSize: 8, cellPadding: 2.5, lineColor: [226, 232, 240], lineWidth: 0.25 },
    columnStyles: {
      0: { cellWidth: 21 },
      1: { cellWidth: 18, fontStyle: 'bold' },
      2: { cellWidth: 32 },
      3: { cellWidth: 'auto', fontSize: 7.5 },
      4: { cellWidth: 26, halign: 'right', fontStyle: 'bold' },
    },
  });

  addPageFooters(doc, companyInfo);

  const fileName = `Reporte_Compras_${safeFileName(cliente.nombre)}_${todayTag}.pdf`;
  doc.save(fileName);
  return fileName;
}

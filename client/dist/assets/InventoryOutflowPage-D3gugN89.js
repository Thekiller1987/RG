import{r as m,j as e,A as H,C as J,P as K,a8 as Z,x as ze,s as i,m as q,aq as le,b as Oe,aa as De,g as de,ao as Ne,af as ce,a1 as Re,k as W,ag as Le,X as pe,M as xe,ak as Ee,al as Pe,G as Fe,a4 as Me,a5 as We,a2 as _e,D as Be,ae as Ue,ad as N,V as He}from"./vendor-C6IkOdzt.js";import{a as Ze,u as qe,_ as Ve,$ as Ge}from"./index-Bh0OH_w0.js";import{r as fe}from"./searchEngine-BMYcElFi.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-CINaEeII.js";const Ye=i(q.div)`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(15, 23, 42, 0.7);
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
  padding: 1rem;
`,Qe=i(q.div)`
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-width: ${o=>o.$mode==="A4"?"880px":"460px"};
  width: 98%;
  max-height: 92vh;
  transition: max-width 0.25s ease;
`,Je=i.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background: #0f172a;
  color: #ffffff;
  border-bottom: 1px solid #1e293b;

  h3 {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`,Ke=i.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`,ge=i.button`
  padding: 0.45rem 0.85rem;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${o=>o.$active?"#38bdf8":"#334155"};
  background: ${o=>o.$active?"#0369a1":"transparent"};
  color: ${o=>o.$active?"#ffffff":"#cbd5e1"};
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: ${o=>o.$active?"#0284c7":"#1e293b"};
    color: #ffffff;
  }
`,Q=i.button`
  padding: 0.5rem 0.9rem;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.84rem;
  transition: all 0.15s ease;

  ${o=>o.$variant==="80"&&`
    background: #2563eb;
    color: #ffffff;
    box-shadow: 0 2px 6px rgba(37, 99, 235, 0.35);
    &:hover { background: #1d4ed8; transform: translateY(-1px); }
  `}

  ${o=>o.$variant==="a4"&&`
    background: #0f766e;
    color: #ffffff;
    box-shadow: 0 2px 6px rgba(15, 118, 110, 0.35);
    &:hover { background: #115e59; transform: translateY(-1px); }
  `}

  ${o=>o.$close&&`
    background: #334155;
    color: #cbd5e1;
    &:hover { background: #ef4444; color: #ffffff; }
  `}
`,Xe=i.div`
  padding: 1.25rem;
  background: #e2e8f0;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  flex: 1;
`,et=i.div`
  background: #ffffff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  color: #000;
  margin: 0 auto;

  ${o=>o.$mode==="80"?le`
    width: 310px;
    padding: 12px 10px;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 8pt;
  `:le`
    width: 100%;
    max-width: 800px;
    padding: 24px 30px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 9.5pt;
  `}
`,b=o=>new Intl.NumberFormat("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(o||0)),tt=o=>{if(!o)return"N/A";try{const j=new Date(o);if(isNaN(j.getTime()))return String(o);const p=j.toLocaleDateString("es-NI",{year:"numeric",month:"2-digit",day:"2-digit"}),n=j.toLocaleTimeString("es-NI",{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!0});return`${p} ${n}`}catch{return String(o)}},ot=({isOpen:o,onClose:j,transaction:p})=>{var L;const{settings:n}=Ze(),[$,k]=m.useState("A4"),R=m.useMemo(()=>{if(!(n!=null&&n.empresa_logo_url))return null;let a=n.empresa_logo_url;a.startsWith("/uploads")?a="/api"+a:a.startsWith("uploads")&&(a="/api/"+a);const d="https://sistema.multirepuestosrg.com/api".replace(/\/api$/,"");let O=a.startsWith("http")?a:`${d}${a.startsWith("/")?"":"/"}${a}`;return O.includes("?t=")||(O+=(O.includes("?")?"&":"?")+`t=${Date.now()}`),O},[n==null?void 0:n.empresa_logo_url]),x=m.useMemo(()=>({name:(n==null?void 0:n.empresa_nombre)||"Multirepuestos RG",ruc:(n==null?void 0:n.empresa_ruc)||"1211812770001E",phone:(n==null?void 0:n.empresa_telefono)||"84031936 / 84058142",address:(n==null?void 0:n.empresa_direccion)||"Del portón de la normal 75 varas al este. Juigalpa, Chontales.",slogan:(n==null?void 0:n.empresa_eslogan)||"Repuestos de confianza al mejor precio — calidad que mantiene tu motor en marcha.",logo:R||new URL("/icons/logo.png",window.location.origin).toString()}),[n,R]);if(!o||!p)return null;const s=!!(p.isQuote||p.tipo==="COTIZACION"),S=Array.isArray(p.items)?p.items:[],y=p.totalItems??p.total_items??S.reduce((a,d)=>a+Number(d.quantity||d.cantidad||0),0),T=Number(p.totalCosto??p.total_costo??S.reduce((a,d)=>a+Number(d.cost||d.costo||0)*Number(d.quantity||d.cantidad||0),0)),I=Number(p.totalVenta??p.total_venta??S.reduce((a,d)=>a+Number(d.unit||d.precio||0)*Number(d.quantity||d.cantidad||0),0)),v=p.usuarioNombre||p.usuario_nombre||"Personal",f=((L=p.clienteNombre)==null?void 0:L.replace("MOTIVO: ",""))||p.motivo||"Traslado de Inventario",A=p.id||(p.outflowId?`TR-${p.outflowId}`:"TR-00"),u=tt(p.fecha||p.created_at||new Date),z=(n==null?void 0:n.ticket_transfer_footer)||"Salida de Inventario autorizada debidamente en sistema.",E=(a="A4")=>{const d=a==="A4",O=`
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${s?"Cotización":"Comprobante de Traslado"} - ${A}</title>
  <style>
    @charset "UTF-8";
    @page {
      size: ${d?"letter portrait":"80mm auto"};
      margin: ${d?"12mm 14mm":"3mm 2mm"};
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    html, body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      color: #000000;
      font-family: ${d?"'Segoe UI', Roboto, Helvetica, Arial, sans-serif":"'Consolas', 'Courier New', monospace"};
    }

    /* ===================================================
       ESTILOS PARA FORMATO A4 / CARTA (DOCUMENTO OFICIAL)
       =================================================== */
    ${d?`
      .doc-container {
        width: 100%;
        max-width: 100%;
        margin: 0 auto;
        padding: 0;
        font-size: 9pt;
        color: #1e293b;
      }
      
      /* Header Oficial */
      .header-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 16px;
        border-bottom: 2.5px solid #0f172a;
        padding-bottom: 12px;
      }
      .header-table td {
        vertical-align: middle;
      }
      .logo-cell {
        width: 150px;
      }
      .logo-img {
        max-width: 140px;
        max-height: 80px;
        object-fit: contain;
        display: block;
      }
      .company-cell {
        text-align: right;
      }
      .company-title {
        font-size: 19pt;
        font-weight: 800;
        color: #0f172a;
        margin: 0 0 3px 0;
        letter-spacing: -0.5px;
      }
      .company-slogan {
        font-size: 8.5pt;
        color: #475569;
        font-style: italic;
        margin: 0 0 4px 0;
      }
      .company-meta {
        font-size: 8.5pt;
        color: #334155;
        line-height: 1.35;
      }
      .company-meta strong {
        color: #0f172a;
      }

      /* Barra de Título del Documento */
      .doc-title-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #f1f5f9;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        padding: 8px 14px;
        margin-bottom: 16px;
      }
      .doc-title-badge {
        font-size: 11pt;
        font-weight: 800;
        color: #0f172a;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .doc-folio {
        font-size: 12pt;
        font-weight: 900;
        color: #0369a1;
        font-family: 'Consolas', monospace;
      }

      /* Datos Generales (Card 2 columnas) */
      .meta-grid {
        display: table;
        width: 100%;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        margin-bottom: 18px;
        border-collapse: separate;
        border-spacing: 0;
      }
      .meta-row {
        display: table-row;
      }
      .meta-col {
        display: table-cell;
        width: 50%;
        padding: 10px 14px;
        vertical-align: top;
      }
      .meta-col:first-child {
        border-right: 1px solid #e2e8f0;
      }
      .meta-item {
        margin: 4px 0;
        font-size: 9pt;
        display: flex;
        align-items: baseline;
      }
      .meta-label {
        font-weight: 700;
        color: #475569;
        width: 125px;
        flex-shrink: 0;
      }
      .meta-value {
        color: #0f172a;
        font-weight: 600;
        flex: 1;
      }

      /* Tabla de Productos */
      .items-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
        page-break-inside: auto;
      }
      .items-table th {
        background: #0f172a;
        color: #ffffff;
        padding: 8px 10px;
        font-size: 8pt;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border: 1px solid #0f172a;
      }
      .items-table td {
        padding: 7px 10px;
        font-size: 9pt;
        border-bottom: 1px solid #e2e8f0;
        border-left: 1px solid #e2e8f0;
        border-right: 1px solid #e2e8f0;
        color: #1e293b;
      }
      .items-table tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }
      .items-table tbody tr:nth-child(even) {
        background-color: #f8fafc;
      }
      .col-qty { width: 8%; text-align: center; font-weight: 800; color: #0f172a; }
      .col-code { width: 14%; font-family: 'Consolas', monospace; font-size: 8.5pt; color: #475569; }
      .col-desc { width: ${s?"50%":"38%"}; font-weight: 600; color: #0f172a; }
      .col-cost { width: 13%; text-align: right; font-variant-numeric: tabular-nums; }
      .col-price { width: 13%; text-align: right; font-variant-numeric: tabular-nums; }
      .col-subtotal { width: 14%; text-align: right; font-weight: 700; font-variant-numeric: tabular-nums; color: #0f172a; }

      /* Resumen y Totales */
      .summary-section {
        display: table;
        width: 100%;
        margin-bottom: 25px;
        page-break-inside: avoid;
      }
      .summary-left {
        display: table-cell;
        vertical-align: top;
        width: 55%;
        padding-right: 20px;
      }
      .items-count-box {
        background: #f1f5f9;
        border-left: 4px solid #0284c7;
        padding: 10px 14px;
        border-radius: 0 6px 6px 0;
        font-size: 9pt;
        color: #334155;
      }
      .items-count-box strong {
        color: #0f172a;
        font-size: 10pt;
      }
      .summary-right {
        display: table-cell;
        vertical-align: top;
        width: 45%;
      }
      .totals-box {
        background: #f8fafc;
        border: 1.5px solid #cbd5e1;
        border-radius: 8px;
        padding: 12px 16px;
      }
      .totals-line {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 4px 0;
        font-size: 9pt;
        color: #475569;
      }
      .totals-line.highlight {
        border-top: 1.5px solid #0f172a;
        margin-top: 8px;
        padding-top: 8px;
        font-size: 12pt;
        font-weight: 900;
        color: #0f172a;
      }
      .totals-line.highlight .val {
        color: #0284c7;
      }

      /* Firmas de Autorización */
      .signatures-container {
        width: 100%;
        margin-top: 50px;
        margin-bottom: 20px;
        page-break-inside: avoid;
      }
      .signatures-table {
        width: 100%;
        border-collapse: collapse;
      }
      .signatures-table td {
        width: 50%;
        text-align: center;
        vertical-align: top;
        padding: 0 35px;
      }
      .sig-line {
        border-top: 1.5px solid #475569;
        padding-top: 6px;
      }
      .sig-name {
        font-size: 9.5pt;
        font-weight: 800;
        color: #0f172a;
        margin: 0;
      }
      .sig-title {
        font-size: 8pt;
        font-weight: 600;
        color: #64748b;
        text-transform: uppercase;
        margin-top: 2px;
      }
      .sig-sub {
        font-size: 7.5pt;
        color: #94a3b8;
      }

      /* Footer */
      .doc-footer {
        border-top: 1px dashed #cbd5e1;
        margin-top: 20px;
        padding-top: 10px;
        text-align: center;
        font-size: 8pt;
        color: #64748b;
        page-break-inside: avoid;
      }
    `:`
      /* ===================================================
         ESTILOS PARA TICKET TÉRMICO 80MM (PUNTO DE VENTA)
         =================================================== */
      .doc-container {
        width: 74mm;
        margin: 0 auto;
        padding: 2mm 0;
        font-size: 8pt;
        line-height: 1.25;
      }
      .center { text-align: center; }
      .bold { font-weight: bold; }
      .dashed-sep {
        border-top: 1px dashed #000;
        margin: 6px 0;
      }
      .double-sep {
        border-top: 2px solid #000;
        margin: 6px 0;
      }

      .ticket-logo {
        max-width: 48mm;
        max-height: 25mm;
        margin: 0 auto 4px;
        display: block;
        object-fit: contain;
      }
      .ticket-header h1 {
        font-size: 11pt;
        margin: 2px 0;
        font-weight: 900;
      }
      .ticket-header p {
        margin: 1px 0;
        font-size: 7pt;
      }
      .ticket-badge {
        display: inline-block;
        border: 1.5px solid #000;
        padding: 3px 6px;
        font-weight: 900;
        font-size: 8pt;
        margin: 4px 0;
      }

      /* Meta Info 80mm */
      .t-meta-row {
        display: flex;
        justify-content: space-between;
        margin: 2px 0;
        font-size: 7.5pt;
      }
      .t-meta-label { font-weight: bold; }
      .t-meta-val { text-align: right; max-width: 62%; word-break: break-word; }

      /* Tabla Items 80mm */
      .t-items-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 7.5pt;
        margin: 4px 0;
      }
      .t-items-table th {
        border-bottom: 1.5px solid #000;
        padding: 3px 1px;
        text-align: left;
        font-weight: 900;
        font-size: 7pt;
      }
      .t-items-table td {
        padding: 3px 1px;
        vertical-align: top;
      }
      .t-col-qty { width: 12%; text-align: center; font-weight: bold; }
      .t-col-desc { width: 50%; }
      .t-col-price { width: 18%; text-align: right; }
      .t-col-total { width: 20%; text-align: right; font-weight: bold; }
      .t-subcode { font-size: 6.5pt; color: #222; display: block; }

      /* Totales 80mm */
      .t-totals-row {
        display: flex;
        justify-content: space-between;
        margin: 3px 0;
        font-size: 8pt;
      }
      .t-totals-grand {
        display: flex;
        justify-content: space-between;
        font-size: 10pt;
        font-weight: 900;
        border-top: 1.5px solid #000;
        border-bottom: 1.5px solid #000;
        padding: 4px 0;
        margin: 4px 0;
      }

      /* Firmas 80mm */
      .t-sign-area {
        margin-top: 16px;
        text-align: center;
        font-size: 7pt;
      }
      .t-sign-line {
        border-top: 1px solid #000;
        width: 80%;
        margin: 18px auto 2px;
      }
      .t-footer {
        text-align: center;
        font-size: 6.8pt;
        margin-top: 10px;
        color: #333;
      }
    `}
  </style>
</head>
<body>
  <div class="doc-container">
    ${d?`
      <!-- ENCABEZADO A4 -->
      <table class="header-table">
        <tr>
          <td class="logo-cell">
            <img src="${x.logo}" alt="Logo" class="logo-img" onerror="this.src='/icons/logo.png';" />
          </td>
          <td class="company-cell">
            <h1 class="company-title">${x.name}</h1>
            <p class="company-slogan">${x.slogan}</p>
            <div class="company-meta">
              <strong>RUC:</strong> ${x.ruc} &nbsp;|&nbsp; <strong>Tel:</strong> ${x.phone}<br/>
              ${x.address}
            </div>
          </td>
        </tr>
      </table>

      <!-- BARRA TÍTULO -->
      <div class="doc-title-bar">
        <span class="doc-title-badge">
          ${s?"COTIZACIÓN DE PRODUCTOS":"COMPROBANTE DE TRASLADO / SALIDA DE INVENTARIO"}
        </span>
        <span class="doc-folio">N° ${A}</span>
      </div>

      <!-- METADATOS -->
      <div class="meta-grid">
        <div class="meta-row">
          <div class="meta-col">
            <div class="meta-item">
              <span class="meta-label">Fecha y Hora:</span>
              <span class="meta-value">${u}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">N° Documento:</span>
              <span class="meta-value" style="font-family: monospace; font-weight: 800;">${A}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Tipo Operación:</span>
              <span class="meta-value">${s?"Cotización Formal":"Salida de Bodega / Traslado"}</span>
            </div>
          </div>
          <div class="meta-col">
            <div class="meta-item">
              <span class="meta-label">${s?"Cliente Solicitante:":"Motivo / Destino:"}</span>
              <span class="meta-value" style="color: #0369a1;">${f}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">${s?"Cotizado por:":"Responsable / Emisor:"}</span>
              <span class="meta-value">${v}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Estado:</span>
              <span class="meta-value" style="color: #16a34a;">Registrado</span>
            </div>
          </div>
        </div>
      </div>

      <!-- TABLA DE PRODUCTOS A4 -->
      <table class="items-table">
        <thead>
          <tr>
            <th class="col-qty">CANT</th>
            <th class="col-code">CÓDIGO</th>
            <th class="col-desc">DESCRIPCIÓN DEL ARTÍCULO</th>
            ${s?"":'<th class="col-cost">COSTO U.</th>'}
            <th class="col-price">P. VENTA</th>
            <th class="col-subtotal">SUBTOTAL</th>
          </tr>
        </thead>
        <tbody>
          ${S.map((l,ee)=>`
            <tr>
              <td class="col-qty">${l.quantity||l.cantidad||1}</td>
              <td class="col-code">${l.codigo||l.code||"-"}</td>
              <td class="col-desc">${l.nombre||l.descripcion||"Producto"}</td>
              ${s?"":`<td class="col-cost">C$ ${b(l.cost||l.costo||0)}</td>`}
              <td class="col-price">C$ ${b(l.unit||l.precio||0)}</td>
              <td class="col-subtotal">C$ ${b((l.quantity||l.cantidad||1)*(l.unit||l.precio||0))}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <!-- TOTALES A4 -->
      <div class="summary-section">
        <div class="summary-left">
          <div class="items-count-box">
            <strong>Artículos en Documento:</strong> ${y} ${y===1?"unidad":"unidades"}<br/>
            <span style="font-size: 8pt; color: #64748b;">Verifique el detalle físico con las cantidades plasmadas.</span>
          </div>
        </div>
        <div class="summary-right">
          <div class="totals-box">
            ${s?"":`
              <div class="totals-line">
                <span>COSTO TOTAL (INTERNO):</span>
                <span style="font-weight: 700; font-family: monospace;">C$ ${b(T)}</span>
              </div>
            `}
            <div class="totals-line highlight">
              <span>${s?"TOTAL COTIZADO:":"TOTAL VALORIZADO:"}</span>
              <span class="val">C$ ${b(I)}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- FIRMAS A4 -->
      <div class="signatures-container">
        <table class="signatures-table">
          <tr>
            <td>
              <div class="sig-line">
                <p class="sig-name">${v}</p>
                <div class="sig-title">Entregado Por (Emisor)</div>
                <div class="sig-sub">Firma y Sello Autorizado</div>
              </div>
            </td>
            <td>
              <div class="sig-line">
                <p class="sig-name">Firma / Sello Recipiente</p>
                <div class="sig-title">Recibido Por (Destino)</div>
                <div class="sig-sub">Nombre, Cédula y Conformidad</div>
              </div>
            </td>
          </tr>
        </table>
      </div>

      <!-- FOOTER A4 -->
      <div class="doc-footer">
        <p style="margin: 2px 0; font-weight: 600;">${z}</p>
        <p style="margin: 2px 0; font-size: 7.5pt; color: #94a3b8;">
          Documento administrativo generado por Multirepuestos RG POS &bull; Fecha de impresión: ${new Date().toLocaleString("es-NI")}
        </p>
      </div>
    `:`
      <!-- ENCABEZADO 80MM -->
      <div class="ticket-header center">
        <img src="${x.logo}" alt="Logo" class="ticket-logo" onerror="this.src='/icons/logo.png';" />
        <h1>${x.name}</h1>
        <p class="bold">${x.slogan}</p>
        <p>RUC: ${x.ruc}</p>
        <p>Tel: ${x.phone}</p>
        <p>${x.address}</p>
        <div>
          <span class="ticket-badge">${s?"COTIZACIÓN":"TRASLADO / SALIDA"}</span>
        </div>
      </div>

      <div class="dashed-sep"></div>

      <!-- METADATOS 80MM -->
      <div class="t-meta-row">
        <span class="t-meta-label">No. Doc:</span>
        <span class="t-meta-val bold">${A}</span>
      </div>
      <div class="t-meta-row">
        <span class="t-meta-label">Fecha:</span>
        <span class="t-meta-val">${u}</span>
      </div>
      <div class="t-meta-row">
        <span class="t-meta-label">${s?"Cliente:":"Motivo:"}</span>
        <span class="t-meta-val">${f}</span>
      </div>
      <div class="t-meta-row">
        <span class="t-meta-label">Por:</span>
        <span class="t-meta-val">${v}</span>
      </div>

      <div class="dashed-sep"></div>

      <!-- TABLA ITEMS 80MM -->
      <table class="t-items-table">
        <thead>
          <tr>
            <th class="t-col-qty">CANT</th>
            <th class="t-col-desc">DESCRIPCIÓN</th>
            <th class="t-col-price">P.UNIT</th>
            <th class="t-col-total">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          ${S.map(l=>`
            <tr>
              <td class="t-col-qty">${l.quantity||l.cantidad||1}</td>
              <td class="t-col-desc">
                ${l.nombre||l.descripcion||"Producto"}
                <span class="t-subcode">Cód: ${l.codigo||"-"} ${s?"":`| Costo: C$${b(l.cost||l.costo||0)}`}</span>
              </td>
              <td class="t-col-price">${b(l.unit||l.precio||0)}</td>
              <td class="t-col-total">${b((l.quantity||l.cantidad||1)*(l.unit||l.precio||0))}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <div class="dashed-sep"></div>

      <!-- TOTALES 80MM -->
      <div class="t-totals-row">
        <span>Items Totales:</span>
        <span class="bold">${y}</span>
      </div>
      ${s?"":`
        <div class="t-totals-row">
          <span>COSTO TOTAL:</span>
          <span class="bold">C$ ${b(T)}</span>
        </div>
      `}
      <div class="t-totals-grand">
        <span>${s?"TOTAL COTIZADO:":"TOTAL VALORIZADO:"}</span>
        <span>C$ ${b(I)}</span>
      </div>

      <!-- FIRMAS 80MM -->
      <div class="t-sign-area">
        <div class="t-sign-line"></div>
        <p style="margin: 0; font-weight: bold;">${v}</p>
        <p style="margin: 0; color: #555;">Entregado Por (Emisor)</p>

        <div class="t-sign-line" style="margin-top: 22px;"></div>
        <p style="margin: 0; font-weight: bold;">Firma / Sello</p>
        <p style="margin: 0; color: #555;">Recibido Por (Destino)</p>
      </div>

      <div class="t-footer">
        <p style="margin: 2px 0;">${z}</p>
        <p style="margin: 2px 0;">Multirepuestos RG POS</p>
      </div>
    `}
  </div>
</body>
</html>
    `,w=window.open("","_blank",`width=${d?960:440},height=750`);if(!w){alert("Por favor habilite las ventanas emergentes (pop-ups) en su navegador para poder imprimir.");return}w.document.open(),w.document.write(O),w.document.close(),w.focus(),setTimeout(()=>{try{w.print()}catch(l){console.error("Error al imprimir comprobante:",l)}setTimeout(()=>{try{w.close()}catch{}},1200)},450)};return e.jsx(H,{children:o&&e.jsx(Ye,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(Qe,{$mode:$,initial:{y:30,opacity:0,scale:.96},animate:{y:0,opacity:1,scale:1},exit:{y:30,opacity:0,scale:.96},transition:{type:"spring",stiffness:350,damping:30},children:[e.jsxs(Je,{children:[e.jsxs("h3",{children:[s?e.jsx(J,{}):e.jsx(K,{}),e.jsx("span",{children:s?"Cotización Formal":"Comprobante de Traslado"})]}),e.jsxs(Ke,{children:[e.jsxs("div",{style:{display:"flex",gap:"4px",background:"#1e293b",padding:"3px",borderRadius:"8px"},children:[e.jsxs(ge,{type:"button",$active:$==="A4",onClick:()=>k("A4"),title:"Vista formato Carta / A4",children:[e.jsx(J,{size:12})," Carta A4"]}),e.jsxs(ge,{type:"button",$active:$==="80",onClick:()=>k("80"),title:"Vista ticket térmico 80mm",children:[e.jsx(Z,{size:12})," Ticket 80mm"]})]}),e.jsxs(Q,{type:"button",$variant:"a4",onClick:()=>E("A4"),title:"Imprimir en hoja A4 / Carta",children:[e.jsx(Z,{})," Imprimir A4"]}),e.jsxs(Q,{type:"button",$variant:"80",onClick:()=>E("80"),title:"Imprimir en impresora térmica 80mm",children:[e.jsx(Z,{})," Imprimir 80mm"]}),e.jsx(Q,{type:"button",$close:!0,onClick:j,title:"Cerrar ventana",children:e.jsx(ze,{size:14})})]})]}),e.jsx(Xe,{children:e.jsx(et,{$mode:$,children:$==="A4"?e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"2.5px solid #0f172a",paddingBottom:"12px",marginBottom:"14px"},children:[e.jsx("div",{style:{width:"140px"},children:e.jsx("img",{src:x.logo,alt:"Logo",style:{maxWidth:"135px",maxHeight:"75px",objectFit:"contain",display:"block"},onError:a=>{a.currentTarget.src="/icons/logo.png"}})}),e.jsxs("div",{style:{textAlign:"right",flex:1,paddingLeft:"20px"},children:[e.jsx("h2",{style:{fontSize:"1.4rem",fontWeight:800,color:"#0f172a",margin:"0 0 2px 0"},children:x.name}),e.jsx("p",{style:{fontSize:"0.8rem",color:"#475569",fontStyle:"italic",margin:"0 0 3px 0"},children:x.slogan}),e.jsxs("div",{style:{fontSize:"0.8rem",color:"#334155"},children:[e.jsx("strong",{children:"RUC:"})," ",x.ruc,"  |  ",e.jsx("strong",{children:"Tel:"})," ",x.phone,e.jsx("br",{}),x.address]})]})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#f1f5f9",border:"1px solid #cbd5e1",borderRadius:"6px",padding:"8px 14px",marginBottom:"14px"},children:[e.jsx("span",{style:{fontSize:"0.88rem",fontWeight:800,color:"#0f172a",textTransform:"uppercase"},children:s?"COTIZACIÓN DE PRODUCTOS":"COMPROBANTE DE TRASLADO / SALIDA DE INVENTARIO"}),e.jsxs("span",{style:{fontSize:"1rem",fontWeight:900,color:"#0369a1",fontFamily:"monospace"},children:["N° ",A]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:"6px",padding:"12px 16px",marginBottom:"16px",fontSize:"0.86rem"},children:[e.jsxs("div",{children:[e.jsxs("div",{style:{margin:"3px 0"},children:[e.jsx("span",{style:{fontWeight:700,color:"#475569",width:"115px",display:"inline-block"},children:"Fecha y Hora:"})," ",e.jsx("span",{style:{fontWeight:600,color:"#0f172a"},children:u})]}),e.jsxs("div",{style:{margin:"3px 0"},children:[e.jsx("span",{style:{fontWeight:700,color:"#475569",width:"115px",display:"inline-block"},children:"N° Documento:"})," ",e.jsx("span",{style:{fontWeight:800,color:"#0369a1",fontFamily:"monospace"},children:A})]}),e.jsxs("div",{style:{margin:"3px 0"},children:[e.jsx("span",{style:{fontWeight:700,color:"#475569",width:"115px",display:"inline-block"},children:"Operación:"})," ",e.jsx("span",{style:{fontWeight:600,color:"#0f172a"},children:s?"Cotización":"Traslado / Salida"})]})]}),e.jsxs("div",{children:[e.jsxs("div",{style:{margin:"3px 0"},children:[e.jsx("span",{style:{fontWeight:700,color:"#475569",width:"115px",display:"inline-block"},children:s?"Cliente:":"Motivo/Destino:"})," ",e.jsx("span",{style:{fontWeight:700,color:"#0284c7"},children:f})]}),e.jsxs("div",{style:{margin:"3px 0"},children:[e.jsx("span",{style:{fontWeight:700,color:"#475569",width:"115px",display:"inline-block"},children:"Responsable:"})," ",e.jsx("span",{style:{fontWeight:700,color:"#0f172a"},children:v})]}),e.jsxs("div",{style:{margin:"3px 0"},children:[e.jsx("span",{style:{fontWeight:700,color:"#475569",width:"115px",display:"inline-block"},children:"Estado:"})," ",e.jsx("span",{style:{fontWeight:700,color:"#16a34a"},children:"Registrado"})]})]})]}),e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",marginBottom:"16px",fontSize:"0.85rem"},children:[e.jsx("thead",{children:e.jsxs("tr",{style:{background:"#0f172a",color:"#ffffff"},children:[e.jsx("th",{style:{padding:"8px",textAlign:"center",width:"8%",fontSize:"0.78rem"},children:"CANT"}),e.jsx("th",{style:{padding:"8px",textAlign:"left",width:"14%",fontSize:"0.78rem"},children:"CÓDIGO"}),e.jsx("th",{style:{padding:"8px",textAlign:"left",width:s?"50%":"38%",fontSize:"0.78rem"},children:"DESCRIPCIÓN"}),!s&&e.jsx("th",{style:{padding:"8px",textAlign:"right",width:"13%",fontSize:"0.78rem"},children:"COSTO U."}),e.jsx("th",{style:{padding:"8px",textAlign:"right",width:"13%",fontSize:"0.78rem"},children:"P. VENTA"}),e.jsx("th",{style:{padding:"8px",textAlign:"right",width:"14%",fontSize:"0.78rem"},children:"SUBTOTAL"})]})}),e.jsx("tbody",{children:S.map((a,d)=>e.jsxs("tr",{style:{borderBottom:"1px solid #e2e8f0",background:d%2===0?"#ffffff":"#f8fafc"},children:[e.jsx("td",{style:{padding:"7px 8px",textAlign:"center",fontWeight:700},children:a.quantity||a.cantidad||1}),e.jsx("td",{style:{padding:"7px 8px",fontFamily:"monospace",color:"#475569"},children:a.codigo||a.code||"-"}),e.jsx("td",{style:{padding:"7px 8px",fontWeight:600,color:"#0f172a"},children:a.nombre||a.descripcion}),!s&&e.jsxs("td",{style:{padding:"7px 8px",textAlign:"right"},children:["C$ ",b(a.cost||a.costo||0)]}),e.jsxs("td",{style:{padding:"7px 8px",textAlign:"right"},children:["C$ ",b(a.unit||a.precio||0)]}),e.jsxs("td",{style:{padding:"7px 8px",textAlign:"right",fontWeight:700,color:"#0f172a"},children:["C$ ",b((a.quantity||a.cantidad||1)*(a.unit||a.precio||0))]})]},d))})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"35px",gap:"20px"},children:[e.jsxs("div",{style:{background:"#f1f5f9",borderLeft:"4px solid #0284c7",padding:"10px 14px",borderRadius:"0 6px 6px 0",fontSize:"0.85rem",color:"#334155"},children:[e.jsx("strong",{children:"Artículos en Documento:"})," ",y," ",y===1?"unidad":"unidades",e.jsx("br",{}),e.jsx("span",{style:{fontSize:"0.78rem",color:"#64748b"},children:"Verifique el detalle físico con las cantidades plasmadas."})]}),e.jsxs("div",{style:{background:"#f8fafc",border:"1.5px solid #cbd5e1",borderRadius:"8px",padding:"12px 18px",minWidth:"280px"},children:[!s&&e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.86rem",color:"#475569",marginBottom:"6px"},children:[e.jsx("span",{children:"COSTO TOTAL (INTERNO):"}),e.jsxs("span",{style:{fontWeight:700,fontFamily:"monospace"},children:["C$ ",b(T)]})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"1.1rem",fontWeight:900,color:"#0f172a",borderTop:s?"none":"1.5px solid #0f172a",paddingTop:s?0:"6px"},children:[e.jsx("span",{children:s?"TOTAL COTIZADO:":"TOTAL VALORIZADO:"}),e.jsxs("span",{style:{color:"#0284c7"},children:["C$ ",b(I)]})]})]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"60px",marginTop:"45px",marginBottom:"20px",textAlign:"center"},children:[e.jsx("div",{children:e.jsxs("div",{style:{borderTop:"1.5px solid #475569",paddingTop:"6px"},children:[e.jsx("p",{style:{margin:0,fontWeight:800,color:"#0f172a"},children:v}),e.jsx("small",{style:{color:"#64748b",fontWeight:600,textTransform:"uppercase",fontSize:"0.75rem"},children:"Entregado Por (Emisor)"}),e.jsx("br",{}),e.jsx("small",{style:{color:"#94a3b8",fontSize:"0.7rem"},children:"Firma y Sello Autorizado"})]})}),e.jsx("div",{children:e.jsxs("div",{style:{borderTop:"1.5px solid #475569",paddingTop:"6px"},children:[e.jsx("p",{style:{margin:0,fontWeight:800,color:"#0f172a"},children:"Firma / Sello Recipiente"}),e.jsx("small",{style:{color:"#64748b",fontWeight:600,textTransform:"uppercase",fontSize:"0.75rem"},children:"Recibido Por (Destino)"}),e.jsx("br",{}),e.jsx("small",{style:{color:"#94a3b8",fontSize:"0.7rem"},children:"Nombre, Cédula y Conformidad"})]})})]}),e.jsxs("div",{style:{borderTop:"1px dashed #cbd5e1",paddingTop:"10px",textAlign:"center",fontSize:"0.76rem",color:"#64748b"},children:[e.jsx("p",{style:{margin:"2px 0",fontWeight:600},children:z}),e.jsx("p",{style:{margin:"2px 0",color:"#94a3b8"},children:"Documento administrativo generado por Multirepuestos RG POS"})]})]}):e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx("img",{src:x.logo,alt:"Logo",style:{maxWidth:"140px",maxHeight:"65px",margin:"0 auto 4px",display:"block",objectFit:"contain"},onError:a=>{a.currentTarget.src="/icons/logo.png"}}),e.jsx("h2",{style:{fontSize:"1rem",fontWeight:900,margin:"2px 0"},children:x.name}),e.jsx("p",{style:{fontSize:"0.7rem",margin:"2px 0",fontWeight:600},children:x.slogan}),e.jsxs("p",{style:{fontSize:"0.7rem",margin:"1px 0"},children:["RUC: ",x.ruc]}),e.jsxs("p",{style:{fontSize:"0.7rem",margin:"1px 0"},children:["Tel: ",x.phone]}),e.jsx("p",{style:{fontSize:"0.7rem",margin:"1px 0"},children:x.address}),e.jsx("div",{style:{margin:"6px 0"},children:e.jsx("span",{style:{border:"1.5px solid #000",padding:"2px 8px",fontWeight:900,fontSize:"0.78rem"},children:s?"COTIZACIÓN":"TRASLADO / SALIDA"})}),e.jsx("div",{style:{borderTop:"1px dashed #000",margin:"6px 0"}}),e.jsxs("div",{style:{textAlign:"left",fontSize:"0.75rem",lineHeight:"1.3"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between"},children:[e.jsx("span",{style:{fontWeight:700},children:"No. Doc:"}),e.jsx("span",{style:{fontWeight:800},children:A})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between"},children:[e.jsx("span",{style:{fontWeight:700},children:"Fecha:"}),e.jsx("span",{children:u})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between"},children:[e.jsx("span",{style:{fontWeight:700},children:s?"Cliente:":"Motivo:"}),e.jsx("span",{style:{maxWidth:"65%",textAlign:"right"},children:f})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between"},children:[e.jsx("span",{style:{fontWeight:700},children:"Por:"}),e.jsx("span",{children:v})]})]}),e.jsx("div",{style:{borderTop:"1px dashed #000",margin:"6px 0"}}),e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",fontSize:"0.75rem",textAlign:"left"},children:[e.jsx("thead",{children:e.jsxs("tr",{style:{borderBottom:"1.5px solid #000"},children:[e.jsx("th",{style:{width:"12%",textAlign:"center",padding:"2px 0"},children:"CANT"}),e.jsx("th",{style:{width:"50%",padding:"2px 0"},children:"DESCRIPCIÓN"}),e.jsx("th",{style:{width:"18%",textAlign:"right",padding:"2px 0"},children:"P.U."}),e.jsx("th",{style:{width:"20%",textAlign:"right",padding:"2px 0"},children:"TOTAL"})]})}),e.jsx("tbody",{children:S.map((a,d)=>e.jsxs("tr",{style:{verticalAlign:"top"},children:[e.jsx("td",{style:{textAlign:"center",fontWeight:700,padding:"3px 0"},children:a.quantity||a.cantidad||1}),e.jsxs("td",{style:{padding:"3px 0"},children:[a.nombre||a.descripcion,e.jsxs("div",{style:{fontSize:"0.65rem",color:"#444"},children:["Cód: ",a.codigo||"-"," ",!s&&`| C: C$${b(a.cost||a.costo||0)}`]})]}),e.jsx("td",{style:{textAlign:"right",padding:"3px 0"},children:b(a.unit||a.precio||0)}),e.jsx("td",{style:{textAlign:"right",fontWeight:700,padding:"3px 0"},children:b((a.quantity||a.cantidad||1)*(a.unit||a.precio||0))})]},d))})]}),e.jsx("div",{style:{borderTop:"1px dashed #000",margin:"6px 0"}}),e.jsxs("div",{style:{fontSize:"0.8rem"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",margin:"2px 0"},children:[e.jsx("span",{children:"Items Totales:"}),e.jsx("span",{style:{fontWeight:800},children:y})]}),!s&&e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",margin:"2px 0"},children:[e.jsx("span",{children:"COSTO TOTAL:"}),e.jsxs("span",{style:{fontWeight:800},children:["C$ ",b(T)]})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",margin:"4px 0",borderTop:"1.5px solid #000",borderBottom:"1.5px solid #000",padding:"4px 0",fontSize:"0.95rem",fontWeight:900},children:[e.jsx("span",{children:s?"TOTAL COTIZADO:":"TOTAL VALORIZADO:"}),e.jsxs("span",{children:["C$ ",b(I)]})]})]}),e.jsxs("div",{style:{marginTop:"16px",fontSize:"0.72rem"},children:[e.jsx("div",{style:{borderTop:"1px solid #000",width:"80%",margin:"16px auto 2px"}}),e.jsx("p",{style:{margin:0,fontWeight:700},children:v}),e.jsx("small",{style:{color:"#555"},children:"Entregado Por (Emisor)"}),e.jsx("div",{style:{borderTop:"1px solid #000",width:"80%",margin:"20px auto 2px"}}),e.jsx("p",{style:{margin:0,fontWeight:700},children:"Firma / Sello"}),e.jsx("small",{style:{color:"#555"},children:"Recibido Por (Destino)"})]}),e.jsxs("div",{style:{marginTop:"12px",fontSize:"0.68rem",color:"#555"},children:[e.jsx("p",{style:{margin:"2px 0"},children:z}),e.jsx("p",{style:{margin:"2px 0"},children:"Multirepuestos RG POS"})]})]})})})]})})})},F=o=>Number(o||0).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}),it=i.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: radial-gradient(circle at 10% 10%, #eef6fc 0%, #f3f8fb 50%, #e9f2f8 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow: hidden;
  color: #1e293b;
`,at=i.header`
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(14px);
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  z-index: 20;
`,st=i.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`,rt=i(He)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: #f1f5f9;
  color: #475569;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.88rem;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: #e2e8f0;
    color: #0f172a;
    transform: translateX(-2px);
  }
`,nt=i.h1`
  font-size: 1.3rem;
  font-weight: 800;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;

  span.badge {
    font-size: 0.72rem;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 6px;
    background: #fee2e2;
    color: #ef4444;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`,lt=i.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`,M=i.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid ${o=>o.$primary?"#3b82f6":"#cbd5e1"};
  background: ${o=>o.$primary?"#3b82f6":"#ffffff"};
  color: ${o=>o.$primary?"#ffffff":"#334155"};
  box-shadow: ${o=>o.$primary?"0 4px 10px rgba(59, 130, 246, 0.25)":"0 2px 4px rgba(0,0,0,0.02)"};

  &:hover {
    background: ${o=>o.$primary?"#2563eb":"#f8fafc"};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`,dt=i.div`
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 1.25rem;
  padding: 1.25rem;
  flex: 1;
  overflow: hidden;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    overflow-y: auto;
  }
`,ct=i.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 1.25rem;
`,pt=i.div`
  display: flex;
  gap: 8px;
  margin-bottom: 1rem;
  align-items: center;
`,xt=i.div`
  position: relative;
  flex: 1;
`,ft=i.input`
  width: 100%;
  padding: 12px 14px 12px 42px;
  background: #ffffff;
  border: 1.5px solid #cbd5e1;
  border-radius: 10px;
  font-size: 0.95rem;
  color: #1e293b;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }

  &::placeholder {
    color: #94a3b8;
  }
`,gt=i.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  display: flex;
  align-items: center;
  pointer-events: none;
`,mt=i.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: #e2e8f0;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #cbd5e1;
    color: #0f172a;
  }
`,me=i.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 1.5px solid ${o=>o.$active?"#3b82f6":"#cbd5e1"};
  background-color: ${o=>o.$active?"#eff6ff":"#ffffff"};
  color: ${o=>o.$active?"#3b82f6":"#64748b"};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
  }
`,ht=i.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding: 0 4px;
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
`,bt=i.div`
  flex: 1;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
  padding-right: 4px;
  padding-bottom: 10px;

  /* Custom Scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
`,ut=i.div`
  background: #ffffff;
  border: 1px solid ${o=>o.$outOfStock?"#fecaca":"#e2e8f0"};
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 225px;
  min-height: 225px;
  position: relative;
  cursor: ${o=>o.$outOfStock?"not-allowed":"pointer"};
  opacity: ${o=>o.$outOfStock?.6:1};
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.02);

  &:hover {
    ${o=>!o.$outOfStock&&`
      transform: translateY(-3px);
      box-shadow: 0 8px 18px -4px rgba(0, 0, 0, 0.08);
      border-color: #3b82f6;
    `}
  }

  &:active {
    ${o=>!o.$outOfStock&&`
      transform: translateY(-1px);
    `}
  }
`,yt=i.div`
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 3px 8px;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 700;
  color: white;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0,0,0,0.12);
  background: ${o=>o.$out?"#ef4444":o.$low?"#f59e0b":"#10b981"};
`,jt=i.div`
  height: 125px;
  min-height: 125px;
  max-height: 125px;
  flex-shrink: 0;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #f1f5f9;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 6px;
  }
`,vt=i.div`
  position: absolute;
  top: 6px;
  left: 6px;
  z-index: 12;
  background: white;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`,wt=i.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 4px;
`,Ct=i.div`
  font-weight: 600;
  font-size: 0.85rem;
  color: #1e293b;
  line-height: 1.25;
  height: 2.5rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`,St=i.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
`,At=i.div`
  margin-top: auto;
  font-weight: 800;
  font-size: 0.95rem;
  color: #2563eb;
`,$t=i.div`
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(14px);
  border-radius: 16px;
  border: 1px solid rgba(226, 232, 240, 0.85);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`,kt=i.div`
  padding: 1.25rem;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
`,Tt=i.div`
  display: flex;
  background: #f1f5f9;
  border-radius: 10px;
  padding: 4px;
  margin-bottom: 1rem;
  border: 1px solid #e2e8f0;
`,he=i.button`
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s ease;

  ${o=>o.$active?`
    background: #ffffff;
    color: ${o.$color||"#ef4444"};
    box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  `:`
    background: transparent;
    color: #64748b;
  `}

  &:hover {
    ${o=>!o.$active&&"color: #0f172a;"}
  }
`,It=i.div`
  background: #f8fafc;
  border: 1.5px solid #cbd5e1;
  border-radius: 10px;
  padding: 8px 12px;
  margin-bottom: 0.75rem;
  position: relative;
`,zt=i.input`
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.88rem;
  font-weight: 500;
  color: #1e293b;

  &::placeholder {
    color: #94a3b8;
  }
`,Ot=i.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.12);
  z-index: 30;
  max-height: 200px;
  overflow-y: auto;
`,Dt=i.div`
  padding: 10px 14px;
  font-size: 0.88rem;
  cursor: pointer;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background: #eff6ff;
    color: #2563eb;
  }
`,Nt=i.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 8px;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
`,Rt=i.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #94a3b8;
  text-align: center;
  padding: 2rem;
  gap: 12px;

  p {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 500;
  }
`,Lt=i.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: border-color 0.2s;

  &:hover {
    border-color: #cbd5e1;
  }
`,Et=i.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
`,Pt=i.div`
  font-weight: 600;
  font-size: 0.88rem;
  color: #0f172a;
  line-height: 1.3;
`,Ft=i.div`
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 600;
`,Mt=i.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
`,Wt=i.div`
  display: flex;
  align-items: center;
  gap: 6px;
`,be=i.button`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  color: #334155;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.15s ease;

  &:hover {
    background: #e2e8f0;
    color: #0f172a;
    border-color: #94a3b8;
  }

  &:active {
    transform: scale(0.95);
  }
`,_t=i.div`
  min-width: 28px;
  text-align: center;
  font-weight: 700;
  font-size: 0.9rem;
  color: #0f172a;
`,Bt=i.input`
  width: 90px;
  padding: 4px 8px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1.5px solid #cbd5e1;
  border-radius: 6px;
  color: #0f172a;
  outline: none;

  &:focus {
    border-color: #3b82f6;
  }
`,Ut=i.button`
  background: transparent;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background 0.15s;

  &:hover {
    background: #fee2e2;
  }
`,Ht=i.div`
  padding: 1.25rem;
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`,Zt=i.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid #cbd5e1;
  border-radius: 10px;
  font-family: inherit;
  font-size: 0.88rem;
  color: #1e293b;
  resize: none;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`,ue=i.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #64748b;

  strong {
    color: #0f172a;
    font-size: 1.15rem;
    font-weight: 800;
  }
`,qt=i.button`
  width: 100%;
  padding: 14px;
  background: ${o=>o.$isSalida?"linear-gradient(135deg, #ef4444 0%, #dc2626 100%)":"linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"};
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 6px 15px ${o=>o.$isSalida?"rgba(239, 68, 68, 0.3)":"rgba(59, 130, 246, 0.3)"};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px ${o=>o.$isSalida?"rgba(239, 68, 68, 0.4)":"rgba(59, 130, 246, 0.4)"};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }
`,X=i(q.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(6px);
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`,ye=i.div`
  background: #ffffff;
  width: 100%;
  max-width: ${o=>o.$width||"460px"};
  max-height: 85vh;
  border-radius: 20px;
  padding: 1.75rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`,je=i.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;

  h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 800;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 10px;
  }
`,Vt=i.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-right: 4px;
`,Gt=i.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: #ffffff;
    border-color: #cbd5e1;
    box-shadow: 0 4px 10px rgba(0,0,0,0.03);
  }
`,Yt=({isOpen:o,imageSrc:j,onClose:p})=>!o||!j?null:e.jsx(X,{onClick:p,initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(q.div,{initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},onClick:n=>n.stopPropagation(),style:{position:"relative",maxWidth:"90%",maxHeight:"90vh"},children:[e.jsx("button",{onClick:p,style:{position:"absolute",top:-12,right:-12,background:"white",width:32,height:32,borderRadius:"50%",border:"none",cursor:"pointer",boxShadow:"0 4px 6px rgba(0,0,0,0.15)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10,color:"#ef4444"},children:e.jsx(W,{})}),e.jsx("img",{src:j,alt:"Vista ampliada",style:{maxWidth:"100%",maxHeight:"85vh",borderRadius:"16px",background:"white",objectFit:"contain",boxShadow:"0 20px 25px rgba(0,0,0,0.25)"}})]})}),to=()=>{const{user:o,products:j,refreshProducts:p,clients:n=[],globalReservations:$,getAvailableStock:k}=qe();Oe();const[R,x]=m.useState(""),[s,S]=m.useState("description"),[y,T]=m.useState([]),[I,v]=m.useState(""),[f,A]=m.useState("SALIDA"),[u,z]=m.useState(null),[E,L]=m.useState(""),[a,d]=m.useState(!1),[O,w]=m.useState(!1),[l,ee]=m.useState([]),[V,G]=m.useState(null),[te,oe]=m.useState(!1),[ve,P]=m.useState(!1),[ie,ae]=m.useState({isOpen:!1,imageUrl:null}),_=m.useRef(null),we=m.useMemo(()=>fe(n,E,["nombre"]).slice(0,10),[E,n]),B=m.useMemo(()=>{const t=s==="code";return fe(j||[],R,t?["codigo","codigo_barras"]:["nombre","codigo","descripcion"],{strict:t}).slice(0,80)},[j,R,s]),se=m.useMemo(()=>{const t=new Map;return y.forEach(r=>{const c=r.id_producto||r.id;t.set(c,(t.get(c)||0)+Number(r.cantidad||0))}),t},[y]),U=m.useMemo(()=>{let t=0,r=0;return y.forEach(c=>{const g=Number(c.cantidad||0),C=Number(c.precio_modificado!==void 0?c.precio_modificado:c.precio||c.venta||0);t+=g,r+=g*C}),{totalItems:t,totalMonto:r}},[y]),re=t=>{const r=t.id_producto||t.id,c=se.get(r)||0,g=k?k(t,(o==null?void 0:o.id_usuario)||(o==null?void 0:o.id)):Number(t.existencia||0);if(f==="SALIDA"&&c+1>g){N.error(`Stock insuficiente. Solo hay ${g} unidades disponibles considerando reservas.`);return}T(C=>{if(C.find(h=>(h.id_producto||h.id)===r))return C.map(h=>(h.id_producto||h.id)===r?{...h,cantidad:h.cantidad+1}:h);{const h=parseFloat(t.precio_venta||t.precio||t.venta||0);return[...C,{...t,id_producto:r,id:r,cantidad:1,unit:h,precio_modificado:h}]}}),N.success(`${t.nombre} agregado`,{duration:1200})},Y=(t,r)=>{T(c=>c.map(g=>{if((g.id_producto||g.id)===t){const D=g.cantidad+r;if(D<=0)return null;if(f==="SALIDA"){const h=k?k(g,(o==null?void 0:o.id_usuario)||(o==null?void 0:o.id)):Number(g.existencia||0);if(D>h)return N.error(`Máximo alcanzado (${h} unidades disponibles).`),g}return{...g,cantidad:D}}return g}).filter(Boolean))},Ce=(t,r)=>{T(c=>c.map(g=>(g.id_producto||g.id)===t?{...g,precio_modificado:Number(r)||0}:g))},Se=()=>{if(f==="SALIDA"&&!I.trim())return N.error("Debe ingresar un motivo o justificación para la salida.");if(f==="COTIZACION"&&!u)return N.error("Seleccione un cliente para la cotización.");if(y.length===0)return N.error("El carrito está vacío.");P(!0)},Ae=async()=>{var t,r;P(!1),oe(!0);try{const c=localStorage.getItem("token"),g=(o==null?void 0:o.nombre)||(o==null?void 0:o.nombre_usuario)||(o==null?void 0:o.nombre_completo)||"Usuario",C=await Ve({motivo:I,items:y,tipo:f,id_cliente:u==null?void 0:u.id_cliente,cliente_nombre:u==null?void 0:u.nombre,usuario_nombre:g},c);T([]),v(""),z(null),L(""),G(C.ticket),N.success(f==="SALIDA"?"Salida procesada con éxito":"Cotización generada con éxito"),p()}catch(c){console.error(c),N.error(((r=(t=c.response)==null?void 0:t.data)==null?void 0:r.msg)||c.message||"Error al procesar la operación.")}finally{oe(!1)}},$e=async()=>{try{const t=localStorage.getItem("token"),r=await Ge(t);ee(Array.isArray(r)?r:[])}catch(t){console.error(t)}},ke=()=>{w(!0),$e()},Te=t=>{const r={id:t.tipo==="COTIZACION"?`COT-${t.id}`:`TR-${t.id}`,outflowId:t.id,type:t.tipo==="COTIZACION"?"quote":"outflow",tipo:t.tipo,fecha:t.fecha,usuarioNombre:t.usuario_nombre,clienteNombre:t.tipo==="COTIZACION"?t.cliente_nombre||"Cliente General":`MOTIVO: ${t.motivo}`,items:(t.items||[]).map(c=>({...c,total:(c.quantity||c.cantidad||0)*(c.unit||c.precio||0)})),totalVenta:t.total_venta,totalCosto:t.total_costo,isOutflow:!0,isQuote:t.tipo==="COTIZACION"};G(r)};return e.jsxs(it,{children:[e.jsxs(at,{children:[e.jsxs(st,{children:[e.jsxs(rt,{to:"/dashboard",children:[e.jsx(De,{})," Volver al Dashboard"]}),e.jsxs(nt,{children:[e.jsx(K,{style:{color:"#ef4444"}})," Traslados y Salidas",e.jsx("span",{className:"badge",children:"Inventario"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6,background:"#ffffff",padding:"6px 14px",borderRadius:"20px",border:"1px solid #e2e8f0",fontSize:"0.84rem",color:"#475569",boxShadow:"0 2px 5px rgba(0,0,0,0.03)"},children:[e.jsx(de,{size:12,color:"#3b82f6"}),e.jsxs("span",{children:["Operador: ",e.jsx("strong",{style:{color:"#0f172a"},children:(o==null?void 0:o.nombre)||(o==null?void 0:o.nombre_usuario)||"Usuario"})]})]})]}),e.jsxs(lt,{children:[e.jsxs(M,{onClick:()=>p(),title:"Sincronizar Catálogo",children:[e.jsx(Ne,{})," Actualizar"]}),e.jsxs(M,{$primary:!0,onClick:ke,children:[e.jsx(ce,{})," Historial de Salidas"]})]})]}),e.jsxs(dt,{children:[e.jsxs(ct,{children:[e.jsxs(pt,{children:[e.jsxs(xt,{children:[e.jsx(gt,{children:e.jsx(Re,{})}),e.jsx(ft,{ref:_,placeholder:s==="code"?"Escribe código de producto...":"Buscar por nombre o descripción...",value:R,onChange:t=>x(t.target.value),onKeyDown:t=>{t.key==="Enter"&&B.length===1&&(re(B[0]),x(""))}}),R&&e.jsx(mt,{onClick:()=>{var t;x(""),(t=_.current)==null||t.focus()},children:e.jsx(W,{size:11})})]}),e.jsx(me,{$active:s==="description",onClick:()=>{var t;S("description"),(t=_.current)==null||t.focus()},title:"Buscar por Nombre",children:e.jsx(Le,{size:16})}),e.jsx(me,{$active:s==="code",onClick:()=>{var t;S("code"),(t=_.current)==null||t.focus()},title:"Buscar por Código",children:e.jsx(pe,{size:18})})]}),e.jsxs(ht,{children:[e.jsxs("span",{children:[e.jsx(xe,{color:"#3b82f6"})," ",B.length," productos mostrados"]}),e.jsxs("span",{children:["Total Catálogo: ",(j||[]).length]})]}),e.jsx(bt,{children:B.map(t=>{var ne;const r=t.id_producto||t.id,c=se.get(r)||0,g=Number(((ne=$==null?void 0:$.totalByProduct)==null?void 0:ne[r])||0),C=k?k(t,(o==null?void 0:o.id_usuario)||(o==null?void 0:o.id)):Number(t.existencia||0),D=Math.max(0,C-c),h=f==="SALIDA"&&D<=0;return e.jsxs(ut,{$outOfStock:h,onClick:()=>!h&&re(t),title:t.nombre,children:[e.jsx(yt,{$out:h,$low:D<5&&!h,children:h?g>0?"En Caja":"Agotado":`Stock: ${D}`}),e.jsxs(jt,{children:[t.imagen&&e.jsx(vt,{onClick:Ie=>{Ie.stopPropagation(),ae({isOpen:!0,imageUrl:t.imagen})},children:e.jsx(Ee,{size:12,color:"#475569"})}),t.imagen?e.jsx("img",{src:t.imagen,alt:t.nombre,loading:"lazy"}):e.jsx(Pe,{size:34,color:"#cbd5e1"})]}),e.jsxs(wt,{children:[e.jsx(Ct,{children:t.nombre}),e.jsx(St,{children:t.codigo||"S/C"}),e.jsxs(At,{children:["C$ ",F(t.precio_venta||t.precio||t.venta)]})]})]},r)})})]}),e.jsxs($t,{children:[e.jsxs(kt,{children:[e.jsxs(Tt,{children:[e.jsxs(he,{$active:f==="SALIDA",$color:"#ef4444",onClick:()=>A("SALIDA"),children:[e.jsx(K,{size:14})," Salida de Inventario"]}),e.jsxs(he,{$active:f==="COTIZACION",$color:"#3b82f6",onClick:()=>A("COTIZACION"),children:[e.jsx(J,{size:14})," Cotización"]})]}),f==="COTIZACION"&&e.jsxs(It,{children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6,marginBottom:4},children:[e.jsx(de,{size:12,color:"#64748b"}),e.jsx("span",{style:{fontSize:"0.8rem",fontWeight:700,color:"#475569"},children:"Cliente Asignado:"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",position:"relative"},children:[e.jsx(zt,{placeholder:"Buscar o seleccionar cliente...",value:u?u.nombre:E,onChange:t=>{L(t.target.value),z(null),d(!0)},onFocus:()=>d(!0)}),u&&e.jsx("button",{onClick:()=>{z(null),L("")},style:{background:"none",border:"none",color:"#94a3b8",cursor:"pointer",padding:2},children:e.jsx(W,{size:12})})]}),a&&e.jsx(Ot,{children:we.map(t=>e.jsxs(Dt,{onClick:()=>{z(t),L(t.nombre),d(!1)},children:[e.jsx("strong",{children:t.nombre}),t.telefono&&e.jsx("span",{style:{fontSize:"0.75rem",color:"#64748b"},children:t.telefono})]},t.id_cliente))})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("div",{style:{fontWeight:800,fontSize:"1.1rem",color:"#0f172a",display:"flex",alignItems:"center",gap:8},children:[e.jsx(Fe,{color:f==="SALIDA"?"#ef4444":"#3b82f6"}),"Items en Carrito"]}),e.jsxs("span",{style:{fontSize:"0.85rem",fontWeight:600,color:"#64748b"},children:[y.length," productos"]})]})]}),e.jsx(Nt,{children:y.length===0?e.jsxs(Rt,{children:[e.jsx(pe,{size:44}),e.jsx("p",{children:"Haz clic en los productos para agregarlos a la salida o cotización."})]}):y.map(t=>{const r=t.id_producto||t.id,c=t.precio_modificado!==void 0?t.precio_modificado:t.precio||t.venta||0;return e.jsxs(Lt,{children:[e.jsxs(Et,{children:[e.jsxs("div",{style:{flex:1},children:[e.jsx(Pt,{children:t.nombre}),e.jsxs(Ft,{children:["Código: ",t.codigo||"S/C"]})]}),e.jsx(Ut,{onClick:()=>Y(r,-9999),title:"Eliminar del carrito",children:e.jsx(Me,{size:13})})]}),e.jsxs(Mt,{children:[e.jsxs(Wt,{children:[e.jsx(be,{onClick:()=>Y(r,-1),children:e.jsx(We,{})}),e.jsx(_t,{children:t.cantidad}),e.jsx(be,{onClick:()=>Y(r,1),children:e.jsx(_e,{})})]}),f==="COTIZACION"?e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:4},children:[e.jsx("span",{style:{fontSize:"0.78rem",color:"#64748b",fontWeight:600},children:"C$"}),e.jsx(Bt,{type:"number",step:"0.01",value:t.precio_modificado,onChange:g=>Ce(r,g.target.value),title:"Modificar precio unitario para cotización"})]}):e.jsxs("div",{style:{fontWeight:700,fontSize:"0.9rem",color:"#2563eb"},children:["C$ ",F(c*t.cantidad)]})]})]},r)})}),e.jsxs(Ht,{children:[f==="SALIDA"&&e.jsxs("div",{children:[e.jsx("label",{style:{display:"block",fontWeight:700,fontSize:"0.82rem",color:"#475569",marginBottom:4},children:"Motivo / Justificación de la Salida:"}),e.jsx(Zt,{rows:"2",placeholder:"Ej: Traslado a Sucursal 2, Merma por daño, Uso interno de taller...",value:I,onChange:t=>v(t.target.value)})]}),e.jsxs(ue,{children:[e.jsx("span",{children:"Total Unidades:"}),e.jsxs("span",{children:[U.totalItems," un."]})]}),e.jsxs(ue,{children:[e.jsx("span",{children:"Total Estimado:"}),e.jsxs("strong",{children:["C$ ",F(U.totalMonto)]})]}),e.jsx(qt,{$isSalida:f==="SALIDA",disabled:y.length===0||te,onClick:Se,children:te?e.jsx(e.Fragment,{children:"Procesando..."}):e.jsxs(e.Fragment,{children:[e.jsx(Be,{}),f==="SALIDA"?"Procesar Salida (Descontar Stock)":"Generar Comprobante Cotización"]})})]})]})]}),e.jsx(H,{children:ve&&e.jsx(X,{onClick:()=>P(!1),initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(ye,{onClick:t=>t.stopPropagation(),$width:"440px",children:[e.jsxs(je,{children:[e.jsxs("h2",{children:[e.jsx(Ue,{color:f==="SALIDA"?"#ef4444":"#3b82f6"}),f==="SALIDA"?"Confirmar Salida":"Confirmar Cotización"]}),e.jsx("button",{onClick:()=>P(!1),style:{background:"none",border:"none",cursor:"pointer",color:"#64748b"},children:e.jsx(W,{size:16})})]}),e.jsx("p",{style:{color:"#475569",fontSize:"0.92rem",lineHeight:1.5,margin:"0 0 1.5rem 0"},children:f==="SALIDA"?`¿Estás seguro de que deseas descontar ${U.totalItems} unidades del inventario con el motivo "${I}"?`:`¿Deseas generar la cotización para el cliente "${(u==null?void 0:u.nombre)||"General"}" con un total de C$ ${F(U.totalMonto)}?`}),e.jsxs("div",{style:{display:"flex",justifyContent:"flex-end",gap:10},children:[e.jsx(M,{onClick:()=>P(!1),children:"Cancelar"}),e.jsx(M,{$primary:f!=="SALIDA",style:f==="SALIDA"?{background:"#ef4444",color:"white",borderColor:"#ef4444"}:{},onClick:Ae,children:f==="SALIDA"?"Sí, Descontar Stock":"Sí, Generar Cotización"})]})]})})}),e.jsx(H,{children:O&&e.jsx(X,{onClick:()=>w(!1),initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(ye,{onClick:t=>t.stopPropagation(),$width:"680px",children:[e.jsxs(je,{children:[e.jsxs("h2",{children:[e.jsx(ce,{color:"#3b82f6"})," Historial de Salidas y Cotizaciones"]}),e.jsx("button",{onClick:()=>w(!1),style:{background:"none",border:"none",cursor:"pointer",color:"#64748b"},children:e.jsx(W,{size:18})})]}),e.jsx(Vt,{children:l.length===0?e.jsxs("div",{style:{textAlign:"center",padding:"3rem 1rem",color:"#94a3b8"},children:[e.jsx(xe,{size:40,style:{marginBottom:8}}),e.jsx("p",{style:{margin:0},children:"No hay movimientos registrados."})]}):l.map(t=>e.jsxs(Gt,{children:[e.jsxs("div",{style:{flex:1},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:4},children:[e.jsxs("span",{style:{padding:"2px 8px",borderRadius:6,fontSize:"0.75rem",fontWeight:700,background:t.tipo==="COTIZACION"?"#eff6ff":"#fee2e2",color:t.tipo==="COTIZACION"?"#2563eb":"#ef4444"},children:[t.tipo==="COTIZACION"?"COTIZACIÓN":"SALIDA"," #",t.id]}),e.jsx("span",{style:{fontSize:"0.8rem",color:"#94a3b8"},children:new Date(t.fecha).toLocaleString()})]}),e.jsx("div",{style:{fontWeight:600,fontSize:"0.9rem",color:"#1e293b"},children:t.tipo==="COTIZACION"?`Cliente: ${t.cliente_nombre||"General"}`:`Motivo: ${t.motivo}`}),e.jsxs("div",{style:{fontSize:"0.8rem",color:"#64748b",marginTop:2},children:["Por: ",e.jsx("strong",{children:t.usuario_nombre})," | ",t.total_items," productos | Total: ",e.jsxs("strong",{children:["C$ ",F(t.total_venta)]})]})]}),e.jsxs(M,{onClick:()=>Te(t),style:{padding:"6px 12px",fontSize:"0.82rem"},children:[e.jsx(Z,{})," Imprimir"]})]},t.id))})]})})}),V&&e.jsx(ot,{isOpen:!!V,transaction:V,onClose:()=>G(null)}),e.jsx(H,{children:ie.isOpen&&e.jsx(Yt,{isOpen:!0,imageSrc:ie.imageUrl,onClose:()=>ae({isOpen:!1,imageUrl:null})})})]})};export{to as default};

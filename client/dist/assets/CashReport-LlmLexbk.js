import{u as oe,r as $,b as V,j as e,W as re,aJ as H,aE as ne,V as ie,aK as W,a9 as J,ae as se,s as h,q as de}from"./vendor-B-pOHZxB.js";import{a as le}from"./index-C9q57MBf.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-DGlygaeZ.js";const P="/api",ce=`${P}/caja/reporte`,pe=`${P}/caja/abiertas/activas`;function fe(){const a=new Date,x=a.getTimezoneOffset()*6e4;new Date(a.getTime()-x);const c=a.getFullYear(),S=String(a.getMonth()+1).padStart(2,"0"),u=String(a.getDate()).padStart(2,"0");return`${c}-${S}-${u}`}const s=a=>`C$${Number(a||0).toFixed(2)}`,M=a=>{if(!a)return"—";try{const x=new Date(a);return isNaN(x.getTime())?"—":x.toLocaleString("es-NI",{timeZone:"America/Managua",day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:!0})}catch{return"—"}};function I(a){return a?typeof a=="string"?a:a.name??a.nombre??a.fullName??a.displayName??a.nombre_usuario??a.username??(a.user&&(a.user.name||a.user.username||a.user.displayName))??(a.id?`Usuario ${a.id}`:"—"):"—"}function me(){const[a,x]=$.useState(()=>localStorage.getItem("token")||null);return $.useEffect(()=>{const c=localStorage.getItem("token");c&&c!==a&&x(c)},[a]),a}const ue=de`
  @page { size: A4; margin: 12mm; }
  @media print {
    /* Ocultar controles / botones */
    .no-print { display: none !important; }
    /* Fondo blanco y tipografía legible */
    body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    /* Quitar sombras y elevaciones a tarjetas */
    article, section, header, div, .card, .CardsGrid, .Card {
      box-shadow: none !important;
      filter: none !important;
    }
    /* Ajustar grid para ocupar el ancho de página */
    .cards-grid-print { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
    @media (max-width: 99999px) {
      /* Forzamos siempre 2 columnas al imprimir (si caben) */
      .cards-grid-print { grid-template-columns: 1fr 1fr !important; }
    }
  }
`;function G(a){let x=[];if(Array.isArray(a==null?void 0:a.transactions))x=a.transactions;else if(a!=null&&a.detalles_json)try{x=(typeof a.detalles_json=="string"?JSON.parse(a.detalles_json):a.detalles_json).transactions||[]}catch(d){console.error("Error parseando snapshot en calculateReportStats",d)}const c=Number((a==null?void 0:a.initialAmount)||(a==null?void 0:a.monto_inicial)||0);x=(d=>{const n=new Set,i=new Set,g=[];for(const m of d){if(m.id&&n.has(m.id))continue;m.id&&n.add(m.id);const y=m.pagoDetalles||{},t=`${(m.type||"").toLowerCase()}|${Number(m.amount||0).toFixed(2)}|${Number(y.totalVenta||0).toFixed(2)}|${Number(y.efectivo||0).toFixed(2)}|${Number(y.tarjeta||0).toFixed(2)}|${Number(y.credito||0).toFixed(2)}|${Number(y.transferencia||0).toFixed(2)}`;i.has(t)||(i.add(t),g.push(m))}return g})(x);const u={ventasContado:[],devoluciones:[],cancelaciones:[],entradas:[],salidas:[],abonos:[]};let f=0,N=0,z=0,E=0,A=0,_=0,T=0,O=0;for(const d of x){const n=((d==null?void 0:d.type)||"").toLowerCase();let i=(d==null?void 0:d.pagoDetalles)||{};if(typeof i=="string")try{i=JSON.parse(i)}catch(w){console.error("Error parseando pagoDetalles en reporte:",d,w),i={}}(!i||typeof i!="object")&&(i={});let g=Number(i.ingresoCaja!==void 0?i.ingresoCaja:d.amount||0),m=Number(i.totalVenta!==void 0?i.totalVenta:d.amount||0);(n==="salida"||n.includes("devolucion")||n.includes("cancelacion")||n.includes("anulacion"))&&(g=-Math.abs(g),m=-Math.abs(m));const y={...d,pagoDetalles:i,displayAmount:m},t=Number(i.tarjeta||0),o=Number(i.transferencia||0),l=Number(i.credito||0);if(n.startsWith("venta")||n.includes("abono")||n.includes("pedido")||n.includes("apartado")?(z+=t,E+=o,A+=l):n==="ajuste"&&(i.target==="tarjeta"&&(z+=Number(d.amount||0)),i.target==="credito"&&(A+=Number(d.amount||0)),i.target==="transferencia"&&(E+=Number(d.amount||0))),n==="venta_contado"||n==="venta_mixta"||n==="venta_credito"||n.startsWith("venta"))if(i.efectivo!==void 0||i.dolares!==void 0){const w=Number(i.efectivo||0),R=Number(i.dolares||0),j=Number(i.cambio||0);f+=w-j,N+=R}else{const w=g-t-o-l;f+=w}else n.includes("abono")?i.dolares!==void 0?(N+=Number(i.dolares||0),f+=Number(i.efectivo||0)):f+=g:n==="entrada"?f+=Math.abs(g):n==="salida"?f-=Math.abs(g):n.includes("devolucion")||n.includes("cancelacion")||n.includes("anulacion")?f+=g:n==="ajuste"?(i.target==="efectivo"&&(f+=g,i.hidden&&(O+=g)),i.target==="dolares"&&(N+=g)):f+=g;(n.startsWith("venta")||n.includes("abono")||n==="entrada")&&(T+=Math.abs(m));const p=n==="devolucion"||n.includes("devolucion"),b=n==="cancelacion"||n==="anulacion";n.startsWith("venta")?u.ventasContado.push(y):p?(u.devoluciones.push(y),_+=Math.abs(m)):b?(u.cancelaciones.push(y),_+=Math.abs(m)):n==="entrada"?u.entradas.push(y):n==="salida"?u.salidas.push(y):(n.includes("abono")||n.includes("pedido")||n.includes("apartado"))&&u.abonos.push(y)}const D=Number((a==null?void 0:a.tasaDolar)||36.6);return{cajaInicial:c,netCordobas:f,netDolares:N,movimientoNetoEfectivo:f+N*D,efectivoEsperado:c+f+N*D,efectivoEsperadoCordobas:c+f,efectivoEsperadoDolares:N,ventasContado:u.ventasContado,devoluciones:u.devoluciones,cancelaciones:u.cancelaciones,entradas:u.entradas,salidas:u.salidas,abonos:u.abonos,totalTarjeta:z,totalTransferencia:E,totalCredito:A,totalNoEfectivo:z+E+A,sumDevolucionesCancelaciones:_,totalVentasDia:T,tasaRef:D,totalHidden:O}}const r={primary:"#0f172a",secondary:"#475569",danger:"#dc2626",bg:"#f8fafc",border:"#e2e8f0",text:"#1e293b",textLight:"#64748b"},ge=h.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: ${r.bg};
  min-height: 100vh;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: ${r.text};
`,be=h.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 12px;
  border: 1px solid ${r.border};
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06);
`,xe=h.div`
  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
    color: ${r.primary};
    display: flex;
    align-items: center;
    gap: 12px;
  }
  p {
    margin: 4px 0 0 0;
    color: ${r.textLight};
    font-size: 0.9rem;
  }
`,he=h.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid ${r.border};
  box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  input[type="date"] {
    border: none;
    background: transparent;
    padding: 8px 12px 8px 36px;
    font-weight: 500;
    color: ${r.text};
    font-family: inherit;
    outline: none;
    font-size: 0.9rem;
    cursor: pointer;
  }

  button {
    background: ${r.bg};
    border: 1px solid ${r.border};
    color: ${r.secondary};
    width: 36px; height: 36px;
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: ${r.primary};
      color: white;
      border-color: ${r.primary};
    }
  }
`,U=h.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`,q=h.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${r.border};
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex; flex-direction: column;

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transform: translateY(-2px);
  }
`,Y=h.div`
  padding: 1.25rem;
  border-bottom: 1px solid ${r.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${a=>a.isOpen?"#f0fdf4":"#f8fafc"};
`,Z=h.span`
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  ${a=>a.isOpen?`
    color: #166534; background: #dcfce7; border: 1px solid #bbf7d0;
  `:`
    color: #1e293b; background: #f1f5f9; border: 1px solid #e2e8f0;
  `}
`,K=h.div`
  padding: 1.5rem;
  flex: 1;
  display: flex; flex-direction: column; gap: 1rem;
`,ye=h.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: ${r.textLight};
  padding: 4px 0;
  align-items: center;

  strong {
    color: ${r.text};
    font-weight: 600;
    font-family: 'Roboto Mono', monospace; // Banking feel for numbers
    font-size: 1rem;
  }

  &.highlight {
    background: #f8fafc;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid ${r.border};
    margin: 0.5rem 0;
    
    strong { color: ${r.primary}; font-weight: 700; font-size: 1.1rem; }
  }
`,ve=h.div`
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex; justify-content: space-between; align-items: center;
  margin-top: auto;
  
  ${a=>a.diff===0?`
    background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0;
  `:`
    background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca;
  `}
`,Q=h.div`
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-top: 1px solid ${r.border};
`,X=h.button`
  width: 100%;
  background: white;
  border: 1px solid ${r.border};
  padding: 0.6rem;
  border-radius: 6px;
  font-weight: 600;
  color: ${r.secondary};
  cursor: pointer;
  display: flex;
  align-items: center; justify-content: center; gap: 8px;
  font-size: 0.9rem;
  transition: all 0.2s;

  &:hover {
    background: ${r.primary};
    color: white;
    border-color: ${r.primary};
  }
`,je=h.button`
  background: white;
  border: 1px solid ${r.border};
  width: 40px; height: 40px;
  border-radius: 8px;
  display: grid; place-items: center;
  cursor: pointer;
  color: ${r.text};
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  transition: all 0.2s;

  &:hover {
    background: ${r.bg};
    border-color: ${r.secondary};
    color: ${r.primary};
  }
`,we=h.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
  margin-top: 1rem;
  
  th {
    text-align: left;
    padding: 8px;
    background: #f1f5f9;
    color: #475569;
    font-weight: 600;
    border-bottom: 1px solid #e2e8f0;
  }
  td {
    padding: 8px;
    border-bottom: 1px solid #f1f5f9;
    color: #1e293b;
  }
  tr:last-child td { border-bottom: none; }
  .num { text-align: right; font-family: 'Roboto Mono', monospace; }
  .center { text-align: center; }
`,Se=()=>{const a=me(),x=oe(),{settings:c}=le(),[S,u]=$.useState(()=>fe()),[f,N]=$.useState(!1),[z,E]=$.useState([]),[A,_]=$.useState([]),[T,O]=$.useState([]),[D,d]=$.useState(null),n=$.useMemo(()=>{const t={"Content-Type":"application/json"};return a&&(t.Authorization=`Bearer ${a}`),t},[a]),i=$.useCallback(async()=>{var t,o,l;N(!0),d(null);try{const[p,b]=await Promise.all([V.get(ce,{headers:n,params:{date:S}}),V.get(pe,{headers:n})]);E(Array.isArray((t=p.data)==null?void 0:t.abiertas)?p.data.abiertas:[]),_(Array.isArray((o=p.data)==null?void 0:o.cerradas)?p.data.cerradas:[]),O(Array.isArray((l=b.data)==null?void 0:l.abiertas)?b.data.abiertas:[])}catch{d("Error al cargar datos.")}finally{N(!1)}},[n,S]);$.useEffect(()=>{i()},[i]);const g=async t=>{var o,l,p;if(window.confirm(`¿Seguro que deseas FORZAR el cierre de la caja de ${I(t.openedBy)}? 

Esto asumirá que el dinero contado es igual al calculado (Cuadre Perfecto).`))try{const b=new Date().toISOString(),w={userId:((o=t.openedBy)==null?void 0:o.id)||t.usuario_id,closedAt:b,closedBy:{id:999,name:"Admin (Forzado)"},countedAmount:0,notes:"Cierre Forzado por Administrador desde Reportes"};await V.post(`${P}/caja/session/close`,w,{headers:n}),alert("Caja cerrada exitosamente."),i()}catch(b){console.error(b),b.response&&b.response.status===404?(alert("Esta caja ya no existe o ya estaba cerrada. Se actualizará la lista."),i()):alert("Error cerrando caja: "+(((p=(l=b.response)==null?void 0:l.data)==null?void 0:p.message)||b.message))}},m=t=>{var k,L;const o=G(t),l=window.open("","_blank");if(!l)return;const p=(c==null?void 0:c.empresa_nombre)||"Multirepuestos RG",b=(c==null?void 0:c.empresa_eslogan)||"Repuestos de confianza al mejor precio",w=(c==null?void 0:c.empresa_logo_url)||window.location.origin+"/icons/logo.png",R=`
      @page { size: A4; margin: 15mm; }
      body { font-family: 'Inter', Helvetica, Arial, sans-serif; padding: 0; margin: 0; color: #1e293b; max-width: none; background: #fff; }
      
      .brand { 
        display: flex; justify-content: space-between; align-items: flex-start;
        border-bottom: 3px solid #1e293b; padding-bottom: 20px; margin-bottom: 30px;
      }
      .brand img { width: 140px; height: auto; }
      .brand-info { text-align: right; }
      .brand h1 { margin: 0 0 5px 0; color: #1e293b; font-size: 24pt; letter-spacing: -0.5px; font-weight: 800; }
      .brand p { margin: 2px 0; color: #64748b; font-size: 10pt; }

      .box { 
        background: #fff; 
        border: 1px solid #cbd5e1; 
        border-radius: 8px; 
        margin-bottom: 20px; 
        padding: 0;
        overflow: hidden;
      }
      .box-header {
        background: #f1f5f9;
        padding: 10px 15px;
        border-bottom: 1px solid #cbd5e1;
        font-weight: 700;
        color: #334155;
        font-size: 10pt;
        text-transform: uppercase;
      }
      .box-content { padding: 15px; }

      .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed #e2e8f0; font-size: 10pt; }
      .row:last-child { border-bottom: none; }
      .row.bold { font-weight: 700; color: #0f172a; font-size: 11pt; border-bottom: 1px solid #cbd5e1; margin-top: 5px; padding-top: 8px; }
      .row.sub-row { color: #64748b; font-size: 9pt; padding-left: 10px; font-style: italic; border: none; }

      .text-right { text-align: right; }
      .text-success { color: #15803d; }
      .text-danger { color: #dc2626; }

      .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
      
      /* Tables */
      table { width: 100%; border-collapse: collapse; }
      th { background: #f8fafc; text-align: left; padding: 8px; font-size: 9pt; color: #475569; border-bottom: 2px solid #e2e8f0; }
      td { padding: 8px; font-size: 10pt; border-bottom: 1px solid #f1f5f9; color: #334155; }
      tr:last-child td { border: none; }
      .num { font-family: 'Roboto Mono', monospace; text-align: right; }

      .footer { margin-top: 50px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; color: #94a3b8; font-size: 9pt; }
      .signatures { display: flex; justify-content: space-between; margin-top: 40px; padding: 0 40px; }
      .sign-box { border-top: 1px solid #94a3b8; width: 40%; text-align: center; padding-top: 5px; font-size: 10pt; color: #64748b; }
    `,j=Number(t.contado||t.countedAmount||0)-o.efectivoEsperado,v=`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Reporte de Caja - ${M(t.closedAt||t.hora_cierre)}</title>
        <style>${R}</style>
      </head>
      <body>
        
        <div class="brand">
           <img src="${w}" alt="Logo" onerror="this.style.display='none'" />
           <div class="brand-info">
             <h1>REPORTE DE CAJA</h1>
             <p>${new Date().toLocaleDateString("es-NI",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
             <p>"${b}"</p>
             <p>${p}</p>
           </div>
        </div>

        <div class="info-grid">
           <div class="box">
             <div class="box-header">Detalles de Sesión</div>
             <div class="box-content">
               <div class="row"><span>Cajero Apertura:</span> <strong>${I(t.openedBy||t.abierta_por)}</strong></div>
               <div class="row"><span>Fecha Apertura:</span> <span>${M(t.openedAt||t.hora_apertura)}</span></div>
               <div class="row"><span>Cajero Cierre:</span> <strong>${I(t.closedBy||t.cerrada_por)}</strong></div>
               <div class="row"><span>Fecha Cierre:</span> <span>${M(t.closedAt||t.hora_cierre)}</span></div>
             </div>
           </div>

           <div class="box">
             <div class="box-header">Resumen General</div>
             <div class="box-content">
                <div class="row bold"><span>Efectivo Esperado:</span> <span>${s(o.efectivoEsperado)}</span></div>
                <div class="row sub-row">(${s(o.efectivoEsperadoCordobas)} C$ + $${Number(o.efectivoEsperadoDolares).toFixed(2)})</div>
                
                <div class="row bold" style="margin-top: 10px;"><span>Contado Real:</span> <span>${s(t.contado||t.countedAmount)}</span></div>
                
                <div class="row bold ${j<-.5?"text-danger":j>.5?"text-success":""}" style="justify-content: flex-end; font-size: 14pt; margin-top: 15px;">
                  <span>Diferencia: ${j>0?"+":""}${s(j)}</span>
                </div>
             </div>
           </div>
        </div>

        <div class="box">
          <div class="box-header">Conciliación de Efectivo</div>
          <div class="box-content">
                <div class="section">
                  <div class="row bold" style="background:#f8fafc; padding:8px;"><span>1. TOTAL INGRESOS BRUTOS:</span><span>${s(o.totalVentasDia)}</span></div>
                  <div class="row sub-row" style="margin-bottom:10px;">(Incluye Ventas Contado, Crédito, Abonos, Entradas y Ajustes)</div>
                </div>

                <div class="section">
                  <div class="row bold" style="border:none;"><span>2. MENOS NO EFECTIVO:</span></div>
                  ${o.totalTarjeta>0?`<div class="row"><span>(-) Tarjetas:</span><span>${s(o.totalTarjeta)}</span></div>`:""}
                  ${o.totalTransferencia>0?`<div class="row"><span>(-) Transferencias:</span><span>${s(o.totalTransferencia)}</span></div>`:""}
                  ${o.totalCredito>0?`<div class="row"><span>(-) Créditos Otorgados:</span><span>${s(o.totalCredito)}</span></div>`:""}
                  <div class="row bold" style="border-top: 1px dashed #000; margin-top:5px;"><span>TOTAL DEDUCIBLE:</span><span>${s(o.totalNoEfectivo)}</span></div>
                </div>

                <div class="section" style="margin-top:15px;">
                  <div class="row bold" style="border:none;"><span>3. FLUJO DE CAJA NETO:</span></div>
                  <div class="row"><span>(+) Fondo Inicial:</span><span>${s(t.monto_inicial||t.initialAmount)}</span></div>
                  <div class="row"><span>(+) Ingresos Totales:</span><span>${s(o.totalVentasDia)}</span></div>
                  <div class="row"><span>(-) Total No Efectivo:</span><span>-${s(o.totalNoEfectivo)}</span></div>
                  ${Math.abs((k=o.salidas)==null?void 0:k.reduce((C,F)=>C+Math.abs(F.amount||0),0))>0?`
                      <div class="row"><span>(-) Salidas de Caja:</span><span>-${s(Math.abs((L=o.salidas)==null?void 0:L.reduce((C,F)=>C+Math.abs(F.amount||0),0)))}</span></div>
                  `:""}
                  <div class="row bold" style="background:#f0fdf4; padding:8px; border:1px solid #bbf7d0; margin-top:10px;">
                    <span>= EFECTIVO ESPERADO EN CAJA:</span><span>${s(o.efectivoEsperado)}</span>
                  </div>
                </div>
            </div>
          </div>
        </div>

        <div class="footer">
           <div class="signatures">
              <div class="sign-box">Firma Cajero</div>
              <div class="sign-box">Firma Supervisor</div>
           </div>
           <p style="margin-top:30px;">Reporte generado automáticamente por Sistema RG</p>
        </div>

      </body>
      </html>
    `;l.document.write(v),l.document.close(),l.focus()},y=({session:t})=>{let o=[];if(t!=null&&t.detalles_json)try{o=(typeof t.detalles_json=="string"?JSON.parse(t.detalles_json):t.detalles_json).transactions||[]}catch{o=[]}else Array.isArray(t==null?void 0:t.transactions)&&(o=t.transactions);if(!o.length)return null;const l=o.filter(v=>(v.type||"").startsWith("venta")),p=o.filter(v=>(v.type||"").includes("abono")),b=o.filter(v=>(v.type||"").includes("devolucion")),w=o.filter(v=>v.type==="entrada"),R=o.filter(v=>v.type==="salida"),j=(v,k,L)=>k.length?e.jsxs("div",{style:{marginTop:"0.75rem"},children:[e.jsxs("h5",{style:{margin:"0 0 0.4rem 0",color:L||r.secondary,fontSize:"0.85rem",borderBottom:`1px solid ${r.border}`,paddingBottom:4},children:[v," (",k.length,")"]}),e.jsxs(we,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Hora"}),e.jsx("th",{children:"Detalle"}),e.jsx("th",{className:"num",children:"Monto"})]})}),e.jsx("tbody",{children:k.map((C,F)=>{const B=C.pagoDetalles||{},ee=C.at?new Date(C.at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"—",te=Number(B.totalVenta||B.ingresoCaja||C.amount||0),ae=C.note||B.nota||B.clienteNombre||"";return e.jsxs("tr",{children:[e.jsx("td",{children:ee}),e.jsx("td",{children:ae||C.type}),e.jsx("td",{className:"num",children:s(te)})]},C.id||F)})})]})]}):null;return e.jsxs("div",{style:{marginTop:"1rem"},children:[j("💰 Ventas",l,"#16a34a"),j("💳 Abonos",p,"#0284c7"),j("🔄 Devoluciones",b,"#dc2626"),j("📥 Entradas",w,"#d97706"),j("📤 Salidas",R,"#7c3aed")]})};return e.jsxs(ge,{children:[e.jsx(ue,{}),e.jsxs(be,{className:"no-print",children:[e.jsxs("div",{style:{display:"flex",gap:"1rem",alignItems:"center"},children:[e.jsx(je,{title:"Volver al Dashboard",onClick:()=>x("/dashboard"),children:e.jsx(re,{})}),e.jsxs(xe,{children:[e.jsx("h1",{children:"Reportes de Caja"}),e.jsx("p",{children:"Historial de aperturas, cierres y auditoría"})]})]}),e.jsxs("div",{style:{display:"flex",gap:"1rem",alignItems:"center"},children:[f&&e.jsxs("span",{style:{color:r.textLight},children:[e.jsx(H,{className:"icon-spin"})," Cargando..."]}),e.jsxs(he,{children:[e.jsxs("div",{className:"input-wrapper",children:[e.jsx(ne,{style:{position:"absolute",left:12,color:r.primary,pointerEvents:"none"}}),e.jsx("input",{type:"date",value:S,onChange:t=>u(t.target.value)})]}),e.jsx("button",{onClick:i,title:"Refrescar",children:e.jsx(H,{})})]})]})]}),D&&e.jsxs("div",{style:{textAlign:"center",margin:"2rem",color:r.danger},children:[e.jsx(ie,{})," ",D]}),e.jsxs("h3",{style:{marginLeft:"0.5rem",marginBottom:"1rem",color:r.text},children:[e.jsx(W,{})," Cajas Activas en el Sistema (",T.length,")"]}),!f&&!T.length&&e.jsx("p",{style:{marginLeft:"1rem",color:r.textLight,fontStyle:"italic"},children:"No hay cajas abiertas actualmente."}),e.jsx(U,{className:"cards-grid-print",style:{marginBottom:"3rem"},children:T.map(t=>e.jsxs(q,{className:"Card",children:[e.jsxs(Y,{isOpen:!0,children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column"},children:[e.jsx("strong",{style:{fontSize:"1.1rem"},children:I(t.abierta_por)}),e.jsxs("span",{style:{fontSize:"0.85rem",color:"#15803d"},children:["Abierta: ",M(t.hora_apertura||t.openedAt)]})]}),e.jsx(Z,{isOpen:!0,children:"Abierta"})]}),e.jsxs(K,{children:[e.jsxs(ye,{children:[e.jsx("span",{children:"Monto Inicial:"}),e.jsx("strong",{children:s(t.monto_inicial)})]}),e.jsxs("div",{style:{padding:"1rem",background:"#f0fdf4",borderRadius:"12px",color:"#166534",marginTop:"auto"},children:[e.jsx(J,{})," Caja activa actualmente"]})]}),e.jsx(Q,{className:"no-print",style:{display:"flex",gap:"10px"},children:e.jsxs(X,{style:{background:"#fee2e2",color:"#b91c1c",borderColor:"#fecaca"},onClick:()=>g(t),children:[e.jsx(W,{})," Forzar Cierre"]})})]},t.id))}),e.jsxs("h3",{style:{marginLeft:"0.5rem",marginBottom:"1rem",color:r.text},children:[e.jsx(J,{})," Cierres Completados (",A.length,")"]}),!f&&!A.length&&e.jsx("p",{style:{marginLeft:"1rem",color:r.textLight,fontStyle:"italic"},children:"No hay cierres registrados en esta fecha."}),e.jsx(U,{className:"cards-grid-print",children:A.map(t=>{const o=G(t),l=Number(t.diferencia),p=o.totalVentasDia||(o.totalVentaContado||o.total_efectivo||0)+(o.totalTarjeta||0)+(o.totalTransferencia||0)+(o.totalCredito||0);return e.jsxs(q,{className:"Card",children:[e.jsxs(Y,{children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column"},children:[e.jsx("strong",{style:{fontSize:"1.1rem"},children:I(t.abierta_por)}),e.jsxs("span",{style:{fontSize:"0.85rem",color:r.textLight},children:["📅 ",new Date(t.hora_apertura).toLocaleDateString("es-NI")," | 🕒 ",new Date(t.hora_apertura).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})," ➜ ",new Date(t.hora_cierre).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})]})]}),e.jsx(Z,{children:"Cerrada"})]}),e.jsxs(K,{children:[e.jsxs("div",{style:{background:"#f1f5f9",padding:"1rem",borderRadius:"8px",border:`1px solid ${r.border}`,marginBottom:"1rem",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx("span",{style:{fontWeight:"600",color:r.secondary,textTransform:"uppercase",fontSize:"0.85rem"},children:"💰 Ventas Totales"}),e.jsx("span",{style:{fontSize:"1.2rem",fontWeight:"bold",color:r.primary,fontFamily:"Roboto Mono"},children:s(p)})]}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"1fr",gap:"1rem",marginBottom:"1rem"},children:e.jsxs("div",{style:{background:"#fff",padding:"10px",borderRadius:8,border:"1px solid #eee"},children:[e.jsx("h5",{style:{margin:"0 0 0.5rem 0",color:r.secondary,fontSize:"0.85rem",borderBottom:"1px solid #eee",paddingBottom:5},children:"📊 Desglose de Efectivo"}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.9rem"},children:[e.jsx("span",{children:"(+) Ventas Totales:"}),e.jsx("strong",{children:s(p)})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.9rem",color:"#dc3545"},children:[e.jsx("span",{children:"(-) Tarjetas/Transf:"}),e.jsxs("strong",{children:["- ",s(o.totalNoEfectivo)]})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.9rem",fontWeight:"bold",borderTop:"1px dashed #ccc",marginTop:4,paddingTop:4},children:[e.jsx("span",{children:"(=) Efectivo de Ventas:"}),e.jsx("span",{children:s(p-o.totalNoEfectivo)})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.9rem",marginTop:8},children:[e.jsx("span",{children:"(+) Fondo Inicial:"}),e.jsx("strong",{children:s(t.monto_inicial||t.initialAmount)})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.9rem",marginTop:4,background:"#f8fafc",padding:4,borderRadius:4},children:[e.jsx("span",{style:{fontWeight:"bold",color:r.primary},children:"Total Esperado:"}),e.jsx("strong",{style:{color:r.primary},children:s(o.efectivoEsperado)})]}),e.jsxs("div",{style:{fontSize:"0.75rem",color:"#64748b",textAlign:"right"},children:["(C$",o.efectivoEsperadoCordobas.toFixed(2)," + $",o.efectivoEsperadoDolares.toFixed(2),")"]})]})}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#f8fafc",padding:"10px",borderRadius:"8px",border:"1px solid #e2e8f0"},children:[e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:"0.8rem",color:r.textLight},children:"Contado Real"}),e.jsx("div",{style:{fontWeight:"bold",fontSize:"1.1rem"},children:s(t.contado||t.countedAmount)})]}),e.jsx(ve,{diff:l,children:Math.abs(l)<.5?"Cuadre Perfecto":`${l>0?"+":""}${s(l)}`})]}),e.jsx(y,{session:t})]}),e.jsx(Q,{className:"no-print",children:e.jsxs(X,{onClick:()=>m(t),children:[e.jsx(se,{})," Imprimir Reporte"]})})]},t.id)})})]})};export{Se as default};

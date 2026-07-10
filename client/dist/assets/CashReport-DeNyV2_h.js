import{b as oe,r as E,a as P,j as a,X as re,aM as H,aN as ne,W as ie,aO as G,aa as J,af as se,s as x,q as de}from"./vendor-C4uQ3a2a.js";import{a as le}from"./index-Dpudypxm.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-BMvqz6Um.js";const W="/api",ce=`${W}/caja/reporte`,pe=`${W}/caja/abiertas/activas`;function fe(){const o=new Date,h=o.getTimezoneOffset()*6e4;new Date(o.getTime()-h);const d=o.getFullYear(),f=String(o.getMonth()+1).padStart(2,"0"),u=String(o.getDate()).padStart(2,"0");return`${d}-${f}-${u}`}const n=o=>`C$${Number(o||0).toFixed(2)}`,O=o=>{if(!o)return"—";try{const h=new Date(o);return isNaN(h.getTime())?"—":h.toLocaleString("es-NI",{timeZone:"America/Managua",day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:!0})}catch{return"—"}};function I(o){return o?typeof o=="string"?o:o.name??o.nombre??o.fullName??o.displayName??o.nombre_usuario??o.username??(o.user&&(o.user.name||o.user.username||o.user.displayName))??(o.id?`Usuario ${o.id}`:"—"):"—"}function me(){const[o,h]=E.useState(()=>localStorage.getItem("token")||null);return E.useEffect(()=>{const d=localStorage.getItem("token");d&&d!==o&&h(d)},[o]),o}const ue=de`
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
`;function U(o){let h=[];if(Array.isArray(o==null?void 0:o.transactions))h=o.transactions;else if(o!=null&&o.detalles_json)try{h=(typeof o.detalles_json=="string"?JSON.parse(o.detalles_json):o.detalles_json).transactions||[]}catch(g){console.error("Error parseando snapshot en calculateReportStats",g)}const d=Number((o==null?void 0:o.initialAmount)||(o==null?void 0:o.monto_inicial)||0),f={ventasContado:[],devoluciones:[],cancelaciones:[],entradas:[],salidas:[],abonos:[]};let u=0,C=0,_=0,V=0,A=0,D=0,N=0,R=0,B=0,z=0,k=0,T=0,S=0,L=0;for(const g of h){const t=((g==null?void 0:g.type)||"").toLowerCase();let e=(g==null?void 0:g.pagoDetalles)||{};if(typeof e=="string")try{e=JSON.parse(e)}catch($){console.error("Error parseando pagoDetalles en reporte:",g,$),e={}}(!e||typeof e!="object")&&(e={});let i=Number(e.ingresoCaja!==void 0?e.ingresoCaja:g.amount||0),l=Number(e.totalVenta!==void 0?e.totalVenta:g.amount||0);(t==="salida"||t.includes("devolucion")||t.includes("cancelacion")||t.includes("anulacion"))&&(i=-Math.abs(i),l=-Math.abs(l));const s={...g,pagoDetalles:e,displayAmount:l},v=Number(e.tarjeta||0),b=Number(e.transferencia||0),c=Number(e.credito||0),p=Number(e.efectivo||0)-Number(e.cambio||0),w=Number(e.dolares||0),F=t.startsWith("venta"),j=t.includes("abono")||t.includes("pedido")||t.includes("apartado");if(F){if(e.efectivo!==void 0||e.dolares!==void 0)u+=p,C+=w,_+=p,V+=w;else{const $=i-v-b-c;u+=$,_+=$}A+=v,D+=b,N+=c}else if(j){if(e.efectivo!==void 0||e.dolares!==void 0)u+=p,C+=w,R+=p,B+=w;else{const $=i-v-b-c;u+=$,R+=$}z+=v,k+=b}else t==="entrada"?u+=Math.abs(i):t==="salida"?u-=Math.abs(i):t.includes("devolucion")||t.includes("cancelacion")||t.includes("anulacion")?u+=i:t==="ajuste"?(e.target==="efectivo"&&(u+=i,e.hidden&&(L+=i)),e.target==="dolares"&&(C+=i),e.target==="tarjeta"&&(A+=i),e.target==="credito"&&(N+=i),e.target==="transferencia"&&(D+=i)):u+=i;(t.startsWith("venta")||t.includes("abono")||t==="entrada")&&(S+=Math.abs(l));const m=t==="devolucion"||t.includes("devolucion"),y=t==="cancelacion"||t==="anulacion";t.startsWith("venta")?f.ventasContado.push(s):m?(f.devoluciones.push(s),T+=Math.abs(l)):y?(f.cancelaciones.push(s),T+=Math.abs(l)):t==="entrada"?f.entradas.push(s):t==="salida"?f.salidas.push(s):(t.includes("abono")||t.includes("pedido")||t.includes("apartado"))&&f.abonos.push(s)}const M=Number((o==null?void 0:o.tasaDolar)||36.6);return{cajaInicial:d,netCordobas:u,netDolares:C,movimientoNetoEfectivo:u+C*M,efectivoEsperado:d+u+C*M,efectivoEsperadoCordobas:d+u,efectivoEsperadoDolares:C,ventasContado:f.ventasContado,devoluciones:f.devoluciones,cancelaciones:f.cancelaciones,entradas:f.entradas,salidas:f.salidas,abonos:f.abonos,totalTarjeta:A+z,totalTransferencia:D+k,totalCredito:N,totalNoEfectivo:A+z+D+k+N,vEfectivoC:_,vEfectivoD:V,vTarjeta:A,vTransf:D,vCredito:N,aEfectivoC:R,aEfectivoD:B,aTarjeta:z,aTransf:k,sumDevolucionesCancelaciones:T,totalVentasDia:S,tasaRef:M,totalHidden:L}}const r={primary:"#0f172a",secondary:"#475569",danger:"#dc2626",bg:"#f8fafc",border:"#e2e8f0",text:"#1e293b",textLight:"#64748b"},ge=x.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: ${r.bg};
  min-height: 100vh;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: ${r.text};
`,xe=x.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 12px;
  border: 1px solid ${r.border};
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06);
`,be=x.div`
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
`,he=x.div`
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
`,q=x.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`,Y=x.div`
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
`,Z=x.div`
  padding: 1.25rem;
  border-bottom: 1px solid ${r.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${o=>o.isOpen?"#f0fdf4":"#f8fafc"};
`,Q=x.span`
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  ${o=>o.isOpen?`
    color: #166534; background: #dcfce7; border: 1px solid #bbf7d0;
  `:`
    color: #1e293b; background: #f1f5f9; border: 1px solid #e2e8f0;
  `}
`,X=x.div`
  padding: 1.5rem;
  flex: 1;
  display: flex; flex-direction: column; gap: 1rem;
`,ve=x.div`
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
`,ye=x.div`
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex; justify-content: space-between; align-items: center;
  margin-top: auto;
  
  ${o=>o.diff===0?`
    background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0;
  `:`
    background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca;
  `}
`,K=x.div`
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-top: 1px solid ${r.border};
`,ee=x.button`
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
`,je=x.button`
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
`,Ce=x.table`
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
`,Te=()=>{const o=me(),h=oe(),{settings:d}=le(),[f,u]=E.useState(()=>fe()),[C,_]=E.useState(!1),[V,A]=E.useState([]),[D,N]=E.useState([]),[R,B]=E.useState([]),[z,k]=E.useState(null),T=E.useMemo(()=>{const t={"Content-Type":"application/json"};return o&&(t.Authorization=`Bearer ${o}`),t},[o]),S=E.useCallback(async()=>{var t,e,i;_(!0),k(null);try{const[l,s]=await Promise.all([P.get(ce,{headers:T,params:{date:f}}),P.get(pe,{headers:T})]);A(Array.isArray((t=l.data)==null?void 0:t.abiertas)?l.data.abiertas:[]),N(Array.isArray((e=l.data)==null?void 0:e.cerradas)?l.data.cerradas:[]),B(Array.isArray((i=s.data)==null?void 0:i.abiertas)?s.data.abiertas:[])}catch{k("Error al cargar datos.")}finally{_(!1)}},[T,f]);E.useEffect(()=>{S()},[S]);const L=async t=>{var e,i,l;if(window.confirm(`¿Seguro que deseas FORZAR el cierre de la caja de ${I(t.openedBy)}? 

Esto asumirá que el dinero contado es igual al calculado (Cuadre Perfecto).`))try{const s=new Date().toISOString(),v={userId:((e=t.openedBy)==null?void 0:e.id)||t.usuario_id,closedAt:s,closedBy:{id:999,name:"Admin (Forzado)"},countedAmount:0,notes:"Cierre Forzado por Administrador desde Reportes"};await P.post(`${W}/caja/session/close`,v,{headers:T}),alert("Caja cerrada exitosamente."),S()}catch(s){console.error(s),s.response&&s.response.status===404?(alert("Esta caja ya no existe o ya estaba cerrada. Se actualizará la lista."),S()):alert("Error cerrando caja: "+(((l=(i=s.response)==null?void 0:i.data)==null?void 0:l.message)||s.message))}},M=t=>{var w,F,j;const e=t.stats||U(t),i=window.open("","_blank");if(!i)return;const l=(d==null?void 0:d.empresa_nombre)||"Multirepuestos RG",s=(d==null?void 0:d.empresa_eslogan)||"Repuestos de confianza al mejor precio",v=(()=>{if(!(d!=null&&d.empresa_logo_url))return window.location.origin+"/icons/logo.png";if(d.empresa_logo_url.startsWith("http"))return d.empresa_logo_url;let m=d.empresa_logo_url;return m.startsWith("/uploads")?m="/api"+m:m.startsWith("uploads")&&(m="/api/"+m),`${"https://sistema.multirepuestosrg.com/api".replace(/\/api$/,"")}${m.startsWith("/")?"":"/"}${m}`})(),b=`
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
    `,c=Number(t.contado||t.countedAmount||0)-e.efectivoEsperado,p=`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Reporte de Caja - ${O(t.closedAt||t.hora_cierre)}</title>
        <style>${b}</style>
      </head>
      <body>
        
        <div class="brand">
           <img src="${v}" alt="Logo" onerror="this.style.display='none'" />
           <div class="brand-info">
             <h1>REPORTE DE CAJA</h1>
             <p>${new Date().toLocaleDateString("es-NI",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
             <p>"${s}"</p>
             <p>${l}</p>
           </div>
        </div>

        <div class="info-grid">
           <div class="box">
             <div class="box-header">Detalles de Sesión</div>
             <div class="box-content">
               <div class="row"><span>Cajero Apertura:</span> <strong>${I(t.openedBy||t.abierta_por)}</strong></div>
               <div class="row"><span>Fecha Apertura:</span> <span>${O(t.openedAt||t.hora_apertura)}</span></div>
               <div class="row"><span>Cajero Cierre:</span> <strong>${I(t.closedBy||t.cerrada_por)}</strong></div>
               <div class="row"><span>Fecha Cierre:</span> <span>${O(t.closedAt||t.hora_cierre)}</span></div>
             </div>
           </div>

           <div class="box">
             <div class="box-header">Resumen General</div>
             <div class="box-content">
                <div class="row bold"><span>Efectivo Esperado:</span> <span>${n(e.efectivoEsperado)}</span></div>
                <div class="row sub-row">(${n(e.efectivoEsperadoCordobas)} C$ + $${Number(e.efectivoEsperadoDolares).toFixed(2)})</div>
                
                <div class="row bold" style="margin-top: 10px;"><span>Contado Real:</span> <span>${n(t.contado||t.countedAmount)}</span></div>
                
                <div class="row bold ${c<-.5?"text-danger":c>.5?"text-success":""}" style="justify-content: flex-end; font-size: 14pt; margin-top: 15px;">
                  <span>Diferencia: ${c>0?"+":""}${n(c)}</span>
                </div>
             </div>
           </div>
        </div>

        <div class="box">
          <div class="box-header">Resumen de Ingresos Totales</div>
          <div class="box-content">
            <div class="row"><span>(+) Efectivo Físico (Ventas y Abonos):</span><span>${n(e.vEfectivoC+e.vEfectivoD*e.tasaRef+e.aEfectivoC+e.aEfectivoD*e.tasaRef)}</span></div>
            <div class="row"><span>(+) Pagos Electrónicos (Tarjetas/Transf):</span><span>${n(e.totalTarjeta+e.totalTransferencia)}</span></div>
            <div class="row"><span>(+) Ventas al Crédito (Por Cobrar):</span><span>${n(e.totalCredito)}</span></div>
            ${e.sumDevolucionesCancelaciones>0?`<div class="row" style="color: #dc2626; font-weight: bold;"><span>(-) Devoluciones / Cancelaciones:</span><span>-${n(e.sumDevolucionesCancelaciones)}</span></div>`:""}
            <div class="row bold" style="border-top: 1px dashed #cbd5e1; margin-top: 5px; padding-top: 8px;">
              <span>(=) INGRESOS TOTALES NETOS GENERADOS:</span>
              <span>${n(e.vEfectivoC+e.vEfectivoD*e.tasaRef+e.vTarjeta+e.vTransf+e.vCredito+(e.aEfectivoC+e.aEfectivoD*e.tasaRef+e.aTarjeta+e.aTransf)-e.sumDevolucionesCancelaciones)}</span>
            </div>
          </div>
        </div>

        <div class="box">
          <div class="box-header">Conciliación de Efectivo Físico (Dinero en Mano)</div>
          <div class="box-content">
                  <div class="row"><span>(+) Ventas y Abonos Efectivo:</span><span>${n(e.vEfectivoC+e.vEfectivoD*e.tasaRef+e.aEfectivoC+e.aEfectivoD*e.tasaRef)}</span></div>
                  ${e.sumDevolucionesCancelaciones>0?`<div class="row"><span>(-) Efectivo Devuelto (Cancel/Devoluciones):</span><span>-${n(e.sumDevolucionesCancelaciones)}</span></div>`:""}
                  ${Math.abs((w=e.salidas)==null?void 0:w.reduce((m,y)=>m+Math.abs(y.amount||0),0))>0?`
                      <div class="row"><span>(-) Gastos de Caja (Salidas):</span><span>-${n(Math.abs((F=e.salidas)==null?void 0:F.reduce((m,y)=>m+Math.abs(y.amount||0),0)))}</span></div>
                  `:""}
                  <div class="row bold" style="margin-top: 5px;">
                    <span>(=) Flujo Efectivo Neto Hoy:</span>
                    <span>${n(e.vEfectivoC+e.vEfectivoD*e.tasaRef+e.aEfectivoC+e.aEfectivoD*e.tasaRef-e.sumDevolucionesCancelaciones-Math.abs((j=e.salidas)==null?void 0:j.reduce((m,y)=>m+Math.abs(y.amount||0),0)))}</span>
                  </div>
                  
                  <div class="row" style="margin-top: 15px; border-top: 1px solid #e2e8f0; padding-top: 10px;">
                    <span>(+) Fondo Inicial C$:</span>
                    <strong>${n(t.monto_inicial||t.initialAmount)}</strong>
                  </div>

                  <div class="row bold" style="background:#f0fdf4; padding:8px; border:1px solid #bbf7d0; margin-top:10px;">
                    <span>= EFECTIVO ESPERADO EN CAJA (Combinado en C$):</span><span>${n(e.efectivoEsperado)}</span>
                  </div>
                  <div class="row sub-row" style="text-align:right;">
                    (Físico Esperado: C$ ${n(e.efectivoEsperadoCordobas).replace("C$","")} y $ ${Number(e.efectivoEsperadoDolares).toFixed(2)})
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
    `;i.document.write(p),i.document.close(),i.focus()},g=({session:t})=>{let e=[];if(t!=null&&t.detalles_json)try{e=(typeof t.detalles_json=="string"?JSON.parse(t.detalles_json):t.detalles_json).transactions||[]}catch{e=[]}else Array.isArray(t==null?void 0:t.transactions)&&(e=t.transactions);if(!e.length)return null;const i=e.filter(p=>(p.type||"").startsWith("venta")),l=e.filter(p=>(p.type||"").includes("abono")),s=e.filter(p=>(p.type||"").includes("devolucion")),v=e.filter(p=>p.type==="entrada"),b=e.filter(p=>p.type==="salida"),c=(p,w,F)=>w.length?a.jsxs("div",{style:{marginTop:"0.75rem"},children:[a.jsxs("h5",{style:{margin:"0 0 0.4rem 0",color:F||r.secondary,fontSize:"0.85rem",borderBottom:`1px solid ${r.border}`,paddingBottom:4},children:[p," (",w.length,")"]}),a.jsxs(Ce,{children:[a.jsx("thead",{children:a.jsxs("tr",{children:[a.jsx("th",{children:"Hora"}),a.jsx("th",{children:"Detalle"}),a.jsx("th",{className:"num",children:"Monto"})]})}),a.jsx("tbody",{children:w.map((j,m)=>{const y=j.pagoDetalles||{},$=j.at?new Date(j.at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"—",ae=Number(y.totalVenta||y.ingresoCaja||j.amount||0),te=j.note||y.nota||y.clienteNombre||"";return a.jsxs("tr",{children:[a.jsx("td",{children:$}),a.jsx("td",{children:te||j.type}),a.jsx("td",{className:"num",children:n(ae)})]},j.id||m)})})]})]}):null;return a.jsxs("div",{style:{marginTop:"1rem"},children:[c("💰 Ventas",i,"#16a34a"),c("💳 Abonos",l,"#0284c7"),c("🔄 Devoluciones",s,"#dc2626"),c("📥 Entradas",v,"#d97706"),c("📤 Salidas",b,"#7c3aed")]})};return a.jsxs(ge,{children:[a.jsx(ue,{}),a.jsxs(xe,{className:"no-print",children:[a.jsxs("div",{style:{display:"flex",gap:"1rem",alignItems:"center"},children:[a.jsx(je,{title:"Volver al Dashboard",onClick:()=>h("/dashboard"),children:a.jsx(re,{})}),a.jsxs(be,{children:[a.jsx("h1",{children:"Reportes de Caja"}),a.jsx("p",{children:"Historial de aperturas, cierres y auditoría"})]})]}),a.jsxs("div",{style:{display:"flex",gap:"1rem",alignItems:"center"},children:[C&&a.jsxs("span",{style:{color:r.textLight},children:[a.jsx(H,{className:"icon-spin"})," Cargando..."]}),a.jsxs(he,{children:[a.jsxs("div",{className:"input-wrapper",children:[a.jsx(ne,{style:{position:"absolute",left:12,color:r.primary,pointerEvents:"none"}}),a.jsx("input",{type:"date",value:f,onChange:t=>u(t.target.value)})]}),a.jsx("button",{onClick:S,title:"Refrescar",children:a.jsx(H,{})})]})]})]}),z&&a.jsxs("div",{style:{textAlign:"center",margin:"2rem",color:r.danger},children:[a.jsx(ie,{})," ",z]}),a.jsxs("h3",{style:{marginLeft:"0.5rem",marginBottom:"1rem",color:r.text},children:[a.jsx(G,{})," Cajas Activas en el Sistema (",R.length,")"]}),!C&&!R.length&&a.jsx("p",{style:{marginLeft:"1rem",color:r.textLight,fontStyle:"italic"},children:"No hay cajas abiertas actualmente."}),a.jsx(q,{className:"cards-grid-print",style:{marginBottom:"3rem"},children:R.map(t=>a.jsxs(Y,{className:"Card",children:[a.jsxs(Z,{isOpen:!0,children:[a.jsxs("div",{style:{display:"flex",flexDirection:"column"},children:[a.jsx("strong",{style:{fontSize:"1.1rem"},children:I(t.abierta_por)}),a.jsxs("span",{style:{fontSize:"0.85rem",color:"#15803d"},children:["Abierta: ",O(t.hora_apertura||t.openedAt)]})]}),a.jsx(Q,{isOpen:!0,children:"Abierta"})]}),a.jsxs(X,{children:[a.jsxs(ve,{children:[a.jsx("span",{children:"Monto Inicial:"}),a.jsx("strong",{children:n(t.monto_inicial)})]}),a.jsxs("div",{style:{padding:"1rem",background:"#f0fdf4",borderRadius:"12px",color:"#166534",marginTop:"auto"},children:[a.jsx(J,{})," Caja activa actualmente"]})]}),a.jsx(K,{className:"no-print",style:{display:"flex",gap:"10px"},children:a.jsxs(ee,{style:{background:"#fee2e2",color:"#b91c1c",borderColor:"#fecaca"},onClick:()=>L(t),children:[a.jsx(G,{})," Forzar Cierre"]})})]},t.id))}),a.jsxs("h3",{style:{marginLeft:"0.5rem",marginBottom:"1rem",color:r.text},children:[a.jsx(J,{})," Cierres Completados (",D.length,")"]}),!C&&!D.length&&a.jsx("p",{style:{marginLeft:"1rem",color:r.textLight,fontStyle:"italic"},children:"No hay cierres registrados en esta fecha."}),a.jsx(q,{className:"cards-grid-print",children:D.map(t=>{var l,s,v;const e=U(t),i=Number(t.diferencia);return e.totalVentasDia||(e.totalVentaContado||e.total_efectivo||0)+(e.totalTarjeta||0)+(e.totalTransferencia||0)+(e.totalCredito||0),a.jsxs(Y,{className:"Card",children:[a.jsxs(Z,{children:[a.jsxs("div",{style:{display:"flex",flexDirection:"column"},children:[a.jsx("strong",{style:{fontSize:"1.1rem"},children:I(t.abierta_por)}),a.jsxs("span",{style:{fontSize:"0.85rem",color:r.textLight},children:["📅 ",new Date(t.hora_apertura).toLocaleDateString("es-NI")," | 🕒 ",new Date(t.hora_apertura).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})," ➜ ",new Date(t.hora_cierre).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})]})]}),a.jsx(Q,{children:"Cerrada"})]}),a.jsxs(X,{children:[a.jsxs("div",{style:{background:"#f1f5f9",padding:"1rem",borderRadius:"8px",border:`1px solid ${r.border}`,marginBottom:"1rem",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[a.jsxs("div",{style:{display:"flex",flexDirection:"column"},children:[a.jsx("span",{style:{fontWeight:"600",color:r.secondary,textTransform:"uppercase",fontSize:"0.85rem"},children:"💰 Ingresos Totales Netos Generados"}),a.jsx("span",{style:{fontSize:"0.7rem",color:r.textLight},children:"(Ventas + Abonos - Devoluciones/Cancelaciones)"})]}),a.jsx("span",{style:{fontSize:"1.2rem",fontWeight:"bold",color:r.primary,fontFamily:"Roboto Mono"},children:n(e.vEfectivoC+e.vEfectivoD*e.tasaRef+e.vTarjeta+e.vTransf+e.vCredito+(e.aEfectivoC+e.aEfectivoD*e.tasaRef+e.aTarjeta+e.aTransf)-e.sumDevolucionesCancelaciones)})]}),a.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr",gap:"1rem",marginBottom:"1rem"},children:[a.jsxs("div",{style:{background:"#fff",padding:"10px",borderRadius:8,border:"1px solid #eee"},children:[a.jsx("h5",{style:{margin:"0 0 0.5rem 0",color:r.secondary,fontSize:"0.85rem",borderBottom:"1px solid #eee",paddingBottom:5},children:"📊 Desglose de Ingresos"}),a.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.9rem",color:r.secondary,marginTop:4},children:[a.jsx("span",{children:"Efectivo Físico (Ventas y Abonos):"}),a.jsx("span",{children:n(e.vEfectivoC+e.vEfectivoD*e.tasaRef+e.aEfectivoC+e.aEfectivoD*e.tasaRef)})]}),a.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.9rem",color:r.secondary,marginTop:4},children:[a.jsx("span",{children:"Pagos Electrónicos (Tarjetas/Transf):"}),a.jsx("span",{children:n(e.totalTarjeta+e.totalTransferencia)})]}),a.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.9rem",color:r.secondary,marginTop:4},children:[a.jsx("span",{children:"Ventas al Crédito (Por Cobrar):"}),a.jsx("span",{children:n(e.totalCredito)})]}),e.sumDevolucionesCancelaciones>0&&a.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.9rem",color:"#dc3545",marginTop:4},children:[a.jsx("span",{children:"(-) Devoluciones / Cancelaciones:"}),a.jsxs("span",{children:["-",n(e.sumDevolucionesCancelaciones)]})]}),a.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.9rem",fontWeight:"bold",borderTop:"1px dashed #ccc",marginTop:4,paddingTop:4},children:[a.jsx("span",{children:"(=) Ingresos Totales Netos:"}),a.jsx("span",{children:n(e.vEfectivoC+e.vEfectivoD*e.tasaRef+e.vTarjeta+e.vTransf+e.vCredito+(e.aEfectivoC+e.aEfectivoD*e.tasaRef+e.aTarjeta+e.aTransf)-e.sumDevolucionesCancelaciones)})]})]}),a.jsxs("div",{style:{background:"#fff",padding:"10px",borderRadius:8,border:"1px solid #eee"},children:[a.jsx("h5",{style:{margin:"0 0 0.5rem 0",color:r.secondary,fontSize:"0.85rem",borderBottom:"1px solid #eee",paddingBottom:5},children:"💵 Conciliación de Efectivo (Dinero en Mano)"}),a.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.9rem",color:r.secondary,marginTop:4},children:[a.jsx("span",{children:"Ventas y Abonos Efectivo:"}),a.jsx("span",{children:n(e.vEfectivoC+e.vEfectivoD*e.tasaRef+e.aEfectivoC+e.aEfectivoD*e.tasaRef)})]}),e.sumDevolucionesCancelaciones>0&&a.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.9rem",color:"#dc3545",marginTop:4},children:[a.jsx("span",{children:"(-) Efectivo Devuelto (Devol./Cancel.):"}),a.jsxs("span",{children:["-",n(e.sumDevolucionesCancelaciones)]})]}),Math.abs((l=e.salidas)==null?void 0:l.reduce((b,c)=>b+Math.abs(c.amount||0),0))>0&&a.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.9rem",color:"#dc3545",marginTop:4},children:[a.jsx("span",{children:"(-) Gastos de Caja (Salidas):"}),a.jsxs("span",{children:["-",n(Math.abs((s=e.salidas)==null?void 0:s.reduce((b,c)=>b+Math.abs(c.amount||0),0)))]})]}),a.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.9rem",fontWeight:"bold",borderTop:"1px dashed #ccc",marginTop:4,paddingTop:4},children:[a.jsx("span",{children:"(=) Flujo Efectivo Neto Hoy:"}),a.jsx("span",{children:n(e.vEfectivoC+e.vEfectivoD*e.tasaRef+e.aEfectivoC+e.aEfectivoD*e.tasaRef-e.sumDevolucionesCancelaciones-Math.abs((v=e.salidas)==null?void 0:v.reduce((b,c)=>b+Math.abs(c.amount||0),0)))})]}),a.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.9rem",marginTop:8},children:[a.jsx("span",{children:"(+) Fondo Inicial C$:"}),a.jsx("strong",{children:n(t.monto_inicial||t.initialAmount)})]}),a.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.9rem",marginTop:4,background:"#f8fafc",padding:6,borderRadius:4,border:"1px solid #e2e8f0"},children:[a.jsx("span",{style:{fontWeight:"bold",color:r.primary},children:"EFECTIVO ESPERADO:"}),a.jsx("strong",{style:{color:r.primary},children:n(e.efectivoEsperado)})]}),a.jsxs("div",{style:{fontSize:"0.75rem",color:"#64748b",textAlign:"right",marginTop:2},children:["(Físico esperado: ",n(e.efectivoEsperadoCordobas)," y $ ",Number(e.efectivoEsperadoDolares).toFixed(2),")"]})]})]}),a.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#f8fafc",padding:"10px",borderRadius:"8px",border:"1px solid #e2e8f0"},children:[a.jsxs("div",{children:[a.jsx("div",{style:{fontSize:"0.8rem",color:r.textLight},children:"Contado Real"}),a.jsx("div",{style:{fontWeight:"bold",fontSize:"1.1rem"},children:n(t.contado||t.countedAmount)})]}),a.jsx(ye,{diff:i,children:Math.abs(i)<.5?"Cuadre Perfecto":`${i>0?"+":""}${n(i)}`})]}),a.jsx(g,{session:t})]}),a.jsx(K,{className:"no-print",children:a.jsxs(ee,{onClick:()=>M(t),children:[a.jsx(se,{})," Imprimir Reporte"]})})]},t.id)})})]})};export{Te as default};

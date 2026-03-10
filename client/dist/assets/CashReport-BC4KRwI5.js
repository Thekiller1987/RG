import{u as oe,r as $,b as V,j as a,Y as re,aM as H,aH as ne,X as ie,aN as W,ab as J,ag as se,s as b,q as de}from"./vendor-Bl8eSE-Q.js";import{a as le}from"./index-C2KciQq_.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-DV8V3V31.js";const G="/api",ce=`${G}/caja/reporte`,pe=`${G}/caja/abiertas/activas`;function fe(){const o=new Date,h=o.getTimezoneOffset()*6e4;new Date(o.getTime()-h);const c=o.getFullYear(),f=String(o.getMonth()+1).padStart(2,"0"),m=String(o.getDate()).padStart(2,"0");return`${c}-${f}-${m}`}const n=o=>`C$${Number(o||0).toFixed(2)}`,B=o=>{if(!o)return"—";try{const h=new Date(o);return isNaN(h.getTime())?"—":h.toLocaleString("es-NI",{timeZone:"America/Managua",day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:!0})}catch{return"—"}};function _(o){return o?typeof o=="string"?o:o.name??o.nombre??o.fullName??o.displayName??o.nombre_usuario??o.username??(o.user&&(o.user.name||o.user.username||o.user.displayName))??(o.id?`Usuario ${o.id}`:"—"):"—"}function me(){const[o,h]=$.useState(()=>localStorage.getItem("token")||null);return $.useEffect(()=>{const c=localStorage.getItem("token");c&&c!==o&&h(c)},[o]),o}const ue=de`
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
`;function U(o){let h=[];if(Array.isArray(o==null?void 0:o.transactions))h=o.transactions;else if(o!=null&&o.detalles_json)try{h=(typeof o.detalles_json=="string"?JSON.parse(o.detalles_json):o.detalles_json).transactions||[]}catch(g){console.error("Error parseando snapshot en calculateReportStats",g)}const c=Number((o==null?void 0:o.initialAmount)||(o==null?void 0:o.monto_inicial)||0),f={ventasContado:[],devoluciones:[],cancelaciones:[],entradas:[],salidas:[],abonos:[]};let m=0,C=0,z=0,P=0,D=0,E=0,S=0,N=0,I=0,R=0,k=0,T=0,A=0,L=0;for(const g of h){const t=((g==null?void 0:g.type)||"").toLowerCase();let e=(g==null?void 0:g.pagoDetalles)||{};if(typeof e=="string")try{e=JSON.parse(e)}catch(u){console.error("Error parseando pagoDetalles en reporte:",g,u),e={}}(!e||typeof e!="object")&&(e={});let i=Number(e.ingresoCaja!==void 0?e.ingresoCaja:g.amount||0),d=Number(e.totalVenta!==void 0?e.totalVenta:g.amount||0);(t==="salida"||t.includes("devolucion")||t.includes("cancelacion")||t.includes("anulacion"))&&(i=-Math.abs(i),d=-Math.abs(d));const s={...g,pagoDetalles:e,displayAmount:d},y=Number(e.tarjeta||0),x=Number(e.transferencia||0),l=Number(e.credito||0),p=Number(e.efectivo||0)-Number(e.cambio||0),w=Number(e.dolares||0),M=t.startsWith("venta"),j=t.includes("abono")||t.includes("pedido")||t.includes("apartado");if(M){if(e.efectivo!==void 0||e.dolares!==void 0)m+=p,C+=w,z+=p,P+=w;else{const u=i-y-x-l;m+=u,z+=u}D+=y,E+=x,S+=l}else if(j){if(e.efectivo!==void 0||e.dolares!==void 0)m+=p,C+=w,N+=p,I+=w;else{const u=i-y-x-l;m+=u,N+=u}R+=y,k+=x}else t==="entrada"?m+=Math.abs(i):t==="salida"?m-=Math.abs(i):t.includes("devolucion")||t.includes("cancelacion")||t.includes("anulacion")?m+=i:t==="ajuste"?(e.target==="efectivo"&&(m+=i,e.hidden&&(L+=i)),e.target==="dolares"&&(C+=i),e.target==="tarjeta"&&(D+=i),e.target==="credito"&&(S+=i),e.target==="transferencia"&&(E+=i)):m+=i;(t.startsWith("venta")||t.includes("abono")||t==="entrada")&&(A+=Math.abs(d));const F=t==="devolucion"||t.includes("devolucion"),v=t==="cancelacion"||t==="anulacion";t.startsWith("venta")?f.ventasContado.push(s):F?(f.devoluciones.push(s),T+=Math.abs(d)):v?(f.cancelaciones.push(s),T+=Math.abs(d)):t==="entrada"?f.entradas.push(s):t==="salida"?f.salidas.push(s):(t.includes("abono")||t.includes("pedido")||t.includes("apartado"))&&f.abonos.push(s)}const O=Number((o==null?void 0:o.tasaDolar)||36.6);return{cajaInicial:c,netCordobas:m,netDolares:C,movimientoNetoEfectivo:m+C*O,efectivoEsperado:c+m+C*O,efectivoEsperadoCordobas:c+m,efectivoEsperadoDolares:C,ventasContado:f.ventasContado,devoluciones:f.devoluciones,cancelaciones:f.cancelaciones,entradas:f.entradas,salidas:f.salidas,abonos:f.abonos,totalTarjeta:D+R,totalTransferencia:E+k,totalCredito:S,totalNoEfectivo:D+R+E+k+S,vEfectivoC:z,vEfectivoD:P,vTarjeta:D,vTransf:E,vCredito:S,aEfectivoC:N,aEfectivoD:I,aTarjeta:R,aTransf:k,sumDevolucionesCancelaciones:T,totalVentasDia:A,tasaRef:O,totalHidden:L}}const r={primary:"#0f172a",secondary:"#475569",danger:"#dc2626",bg:"#f8fafc",border:"#e2e8f0",text:"#1e293b",textLight:"#64748b"},ge=b.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: ${r.bg};
  min-height: 100vh;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: ${r.text};
`,be=b.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 12px;
  border: 1px solid ${r.border};
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06);
`,xe=b.div`
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
`,ve=b.div`
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
`,Y=b.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`,q=b.div`
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
`,Z=b.div`
  padding: 1.25rem;
  border-bottom: 1px solid ${r.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${o=>o.isOpen?"#f0fdf4":"#f8fafc"};
`,Q=b.span`
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
`,X=b.div`
  padding: 1.5rem;
  flex: 1;
  display: flex; flex-direction: column; gap: 1rem;
`,he=b.div`
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
`,ye=b.div`
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
`,K=b.div`
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-top: 1px solid ${r.border};
`,ee=b.button`
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
`,je=b.button`
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
`,Ce=b.table`
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
`,Ae=()=>{const o=me(),h=oe(),{settings:c}=le(),[f,m]=$.useState(()=>fe()),[C,z]=$.useState(!1),[P,D]=$.useState([]),[E,S]=$.useState([]),[N,I]=$.useState([]),[R,k]=$.useState(null),T=$.useMemo(()=>{const t={"Content-Type":"application/json"};return o&&(t.Authorization=`Bearer ${o}`),t},[o]),A=$.useCallback(async()=>{var t,e,i;z(!0),k(null);try{const[d,s]=await Promise.all([V.get(ce,{headers:T,params:{date:f}}),V.get(pe,{headers:T})]);D(Array.isArray((t=d.data)==null?void 0:t.abiertas)?d.data.abiertas:[]),S(Array.isArray((e=d.data)==null?void 0:e.cerradas)?d.data.cerradas:[]),I(Array.isArray((i=s.data)==null?void 0:i.abiertas)?s.data.abiertas:[])}catch{k("Error al cargar datos.")}finally{z(!1)}},[T,f]);$.useEffect(()=>{A()},[A]);const L=async t=>{var e,i,d;if(window.confirm(`¿Seguro que deseas FORZAR el cierre de la caja de ${_(t.openedBy)}? 

Esto asumirá que el dinero contado es igual al calculado (Cuadre Perfecto).`))try{const s=new Date().toISOString(),y={userId:((e=t.openedBy)==null?void 0:e.id)||t.usuario_id,closedAt:s,closedBy:{id:999,name:"Admin (Forzado)"},countedAmount:0,notes:"Cierre Forzado por Administrador desde Reportes"};await V.post(`${G}/caja/session/close`,y,{headers:T}),alert("Caja cerrada exitosamente."),A()}catch(s){console.error(s),s.response&&s.response.status===404?(alert("Esta caja ya no existe o ya estaba cerrada. Se actualizará la lista."),A()):alert("Error cerrando caja: "+(((d=(i=s.response)==null?void 0:i.data)==null?void 0:d.message)||s.message))}},O=t=>{var w,M,j,F;const e=t.stats||U(t),i=window.open("","_blank");if(!i)return;const d=(c==null?void 0:c.empresa_nombre)||"Multirepuestos RG",s=(c==null?void 0:c.empresa_eslogan)||"Repuestos de confianza al mejor precio",y=(c==null?void 0:c.empresa_logo_url)||window.location.origin+"/icons/logo.png",x=`
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
    `,l=Number(t.contado||t.countedAmount||0)-e.efectivoEsperado,p=`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Reporte de Caja - ${B(t.closedAt||t.hora_cierre)}</title>
        <style>${x}</style>
      </head>
      <body>
        
        <div class="brand">
           <img src="${y}" alt="Logo" onerror="this.style.display='none'" />
           <div class="brand-info">
             <h1>REPORTE DE CAJA</h1>
             <p>${new Date().toLocaleDateString("es-NI",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
             <p>"${s}"</p>
             <p>${d}</p>
           </div>
        </div>

        <div class="info-grid">
           <div class="box">
             <div class="box-header">Detalles de Sesión</div>
             <div class="box-content">
               <div class="row"><span>Cajero Apertura:</span> <strong>${_(t.openedBy||t.abierta_por)}</strong></div>
               <div class="row"><span>Fecha Apertura:</span> <span>${B(t.openedAt||t.hora_apertura)}</span></div>
               <div class="row"><span>Cajero Cierre:</span> <strong>${_(t.closedBy||t.cerrada_por)}</strong></div>
               <div class="row"><span>Fecha Cierre:</span> <span>${B(t.closedAt||t.hora_cierre)}</span></div>
             </div>
           </div>

           <div class="box">
             <div class="box-header">Resumen General</div>
             <div class="box-content">
                <div class="row bold"><span>Efectivo Esperado:</span> <span>${n(e.efectivoEsperado)}</span></div>
                <div class="row sub-row">(${n(e.efectivoEsperadoCordobas)} C$ + $${Number(e.efectivoEsperadoDolares).toFixed(2)})</div>
                
                <div class="row bold" style="margin-top: 10px;"><span>Contado Real:</span> <span>${n(t.contado||t.countedAmount)}</span></div>
                
                <div class="row bold ${l<-.5?"text-danger":l>.5?"text-success":""}" style="justify-content: flex-end; font-size: 14pt; margin-top: 15px;">
                  <span>Diferencia: ${l>0?"+":""}${n(l)}</span>
                </div>
             </div>
           </div>
        </div>

        <div class="box">
          <div class="box-header">Conciliación de Efectivo y Flujos</div>
          <div class="box-content">
                <div class="section">
                  <div class="row bold" style="background:#f8fafc; padding:8px;"><span>1. INGRESOS POR VENTAS:</span></div>
                  ${e.vEfectivoC>0?`<div class="row"><span>(+) Efectivo (C$):</span><span>${n(e.vEfectivoC)}</span></div>`:""}
                  ${e.vEfectivoD>0?`<div class="row"><span>(+) Dólares ($):</span><span>$${Number(e.vEfectivoD).toFixed(2)}</span></div>`:""}
                  ${e.vTarjeta>0?`<div class="row"><span>(+) Tarjetas:</span><span>${n(e.vTarjeta)}</span></div>`:""}
                  ${e.vTransf>0?`<div class="row"><span>(+) Transferencias:</span><span>${n(e.vTransf)}</span></div>`:""}
                  ${e.vCredito>0?`<div class="row"><span>(+) Créditos Otorgados:</span><span>${n(e.vCredito)}</span></div>`:""}
                  <div class="row bold sub-row" style="border-top: 1px dashed #000; margin-top:5px; padding-top:5px;">
                    <span>Total Ventas Brutas:</span><span>${n(e.vEfectivoC+e.vEfectivoD*e.tasaRef+e.vTarjeta+e.vTransf+e.vCredito)}</span>
                  </div>
                </div>

                <div class="section" style="margin-top:15px;">
                  <div class="row bold" style="background:#f8fafc; padding:8px;"><span>2. INGRESOS POR ABONOS:</span></div>
                  ${e.aEfectivoC>0?`<div class="row"><span>(+) Efectivo (C$):</span><span>${n(e.aEfectivoC)}</span></div>`:""}
                  ${e.aEfectivoD>0?`<div class="row"><span>(+) Dólares ($):</span><span>$${Number(e.aEfectivoD).toFixed(2)}</span></div>`:""}
                  ${e.aTarjeta>0?`<div class="row"><span>(+) Tarjetas:</span><span>${n(e.aTarjeta)}</span></div>`:""}
                  ${e.aTransf>0?`<div class="row"><span>(+) Transferencias:</span><span>${n(e.aTransf)}</span></div>`:""}
                  <div class="row bold sub-row" style="border-top: 1px dashed #000; margin-top:5px; padding-top:5px;">
                    <span>Total Abonos Netos:</span><span>${n(e.aEfectivoC+e.aEfectivoD*e.tasaRef+e.aTarjeta+e.aTransf)}</span>
                  </div>
                </div>

                <div class="section" style="margin-top:15px;">
                  <div class="row bold" style="border:none;"><span>3. EGRESOS DE CAJA Y CANCELACIONES:</span></div>
                  ${e.sumDevolucionesCancelaciones>0?`<div class="row"><span>(-) Devoluciones/Cancelaciones:</span><span>-${n(e.sumDevolucionesCancelaciones)}</span></div>`:""}
                  ${Math.abs((w=e.salidas)==null?void 0:w.reduce((v,u)=>v+Math.abs(u.amount||0),0))>0?`
                      <div class="row"><span>(-) Gastos/Salidas de Caja:</span><span>-${n(Math.abs((M=e.salidas)==null?void 0:M.reduce((v,u)=>v+Math.abs(u.amount||0),0)))}</span></div>
                  `:""}
                </div>

                <div class="section" style="margin-top:15px;">
                  <div class="row bold" style="border:none;"><span>4. RESUMEN PARA ENTREGA DE CAJA (SOLO EFECTIVO):</span></div>
                  <div class="row"><span>(+) Fondo Inicial C$:</span><span>${n(t.monto_inicial||t.initialAmount)}</span></div>
                  <div class="row"><span>(+) Efectivo Total Ventas C$:</span><span>${n(e.vEfectivoC)}</span></div>
                  <div class="row"><span>(+) Efectivo Total Abonos C$:</span><span>${n(e.aEfectivoC)}</span></div>
                  ${e.sumDevolucionesCancelaciones>0?`<div class="row"><span>(-) Efectivo Devuelto C$:</span><span>-${n(e.sumDevolucionesCancelaciones)}</span></div>`:""}
                  ${Math.abs((j=e.salidas)==null?void 0:j.reduce((v,u)=>v+Math.abs(u.amount||0),0))>0?`
                      <div class="row"><span>(-) Gastos en Efectivo C$:</span><span>-${n(Math.abs((F=e.salidas)==null?void 0:F.reduce((v,u)=>v+Math.abs(u.amount||0),0)))}</span></div>
                  `:""}
                  <div class="row bold" style="background:#f0fdf4; padding:8px; border:1px solid #bbf7d0; margin-top:10px;">
                    <span>= EFECTIVO ESPERADO EN CAJA (Combinado en C$):</span><span>${n(e.efectivoEsperado)}</span>
                  </div>
                  <div class="row sub-row" style="text-align:right;">
                    (Físico Esperado: C$ ${n(e.efectivoEsperadoCordobas).replace("C$","")} y $ ${Number(e.efectivoEsperadoDolares).toFixed(2)})
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
    `;i.document.write(p),i.document.close(),i.focus()},g=({session:t})=>{let e=[];if(t!=null&&t.detalles_json)try{e=(typeof t.detalles_json=="string"?JSON.parse(t.detalles_json):t.detalles_json).transactions||[]}catch{e=[]}else Array.isArray(t==null?void 0:t.transactions)&&(e=t.transactions);if(!e.length)return null;const i=e.filter(p=>(p.type||"").startsWith("venta")),d=e.filter(p=>(p.type||"").includes("abono")),s=e.filter(p=>(p.type||"").includes("devolucion")),y=e.filter(p=>p.type==="entrada"),x=e.filter(p=>p.type==="salida"),l=(p,w,M)=>w.length?a.jsxs("div",{style:{marginTop:"0.75rem"},children:[a.jsxs("h5",{style:{margin:"0 0 0.4rem 0",color:M||r.secondary,fontSize:"0.85rem",borderBottom:`1px solid ${r.border}`,paddingBottom:4},children:[p," (",w.length,")"]}),a.jsxs(Ce,{children:[a.jsx("thead",{children:a.jsxs("tr",{children:[a.jsx("th",{children:"Hora"}),a.jsx("th",{children:"Detalle"}),a.jsx("th",{className:"num",children:"Monto"})]})}),a.jsx("tbody",{children:w.map((j,F)=>{const v=j.pagoDetalles||{},u=j.at?new Date(j.at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"—",ae=Number(v.totalVenta||v.ingresoCaja||j.amount||0),te=j.note||v.nota||v.clienteNombre||"";return a.jsxs("tr",{children:[a.jsx("td",{children:u}),a.jsx("td",{children:te||j.type}),a.jsx("td",{className:"num",children:n(ae)})]},j.id||F)})})]})]}):null;return a.jsxs("div",{style:{marginTop:"1rem"},children:[l("💰 Ventas",i,"#16a34a"),l("💳 Abonos",d,"#0284c7"),l("🔄 Devoluciones",s,"#dc2626"),l("📥 Entradas",y,"#d97706"),l("📤 Salidas",x,"#7c3aed")]})};return a.jsxs(ge,{children:[a.jsx(ue,{}),a.jsxs(be,{className:"no-print",children:[a.jsxs("div",{style:{display:"flex",gap:"1rem",alignItems:"center"},children:[a.jsx(je,{title:"Volver al Dashboard",onClick:()=>h("/dashboard"),children:a.jsx(re,{})}),a.jsxs(xe,{children:[a.jsx("h1",{children:"Reportes de Caja"}),a.jsx("p",{children:"Historial de aperturas, cierres y auditoría"})]})]}),a.jsxs("div",{style:{display:"flex",gap:"1rem",alignItems:"center"},children:[C&&a.jsxs("span",{style:{color:r.textLight},children:[a.jsx(H,{className:"icon-spin"})," Cargando..."]}),a.jsxs(ve,{children:[a.jsxs("div",{className:"input-wrapper",children:[a.jsx(ne,{style:{position:"absolute",left:12,color:r.primary,pointerEvents:"none"}}),a.jsx("input",{type:"date",value:f,onChange:t=>m(t.target.value)})]}),a.jsx("button",{onClick:A,title:"Refrescar",children:a.jsx(H,{})})]})]})]}),R&&a.jsxs("div",{style:{textAlign:"center",margin:"2rem",color:r.danger},children:[a.jsx(ie,{})," ",R]}),a.jsxs("h3",{style:{marginLeft:"0.5rem",marginBottom:"1rem",color:r.text},children:[a.jsx(W,{})," Cajas Activas en el Sistema (",N.length,")"]}),!C&&!N.length&&a.jsx("p",{style:{marginLeft:"1rem",color:r.textLight,fontStyle:"italic"},children:"No hay cajas abiertas actualmente."}),a.jsx(Y,{className:"cards-grid-print",style:{marginBottom:"3rem"},children:N.map(t=>a.jsxs(q,{className:"Card",children:[a.jsxs(Z,{isOpen:!0,children:[a.jsxs("div",{style:{display:"flex",flexDirection:"column"},children:[a.jsx("strong",{style:{fontSize:"1.1rem"},children:_(t.abierta_por)}),a.jsxs("span",{style:{fontSize:"0.85rem",color:"#15803d"},children:["Abierta: ",B(t.hora_apertura||t.openedAt)]})]}),a.jsx(Q,{isOpen:!0,children:"Abierta"})]}),a.jsxs(X,{children:[a.jsxs(he,{children:[a.jsx("span",{children:"Monto Inicial:"}),a.jsx("strong",{children:n(t.monto_inicial)})]}),a.jsxs("div",{style:{padding:"1rem",background:"#f0fdf4",borderRadius:"12px",color:"#166534",marginTop:"auto"},children:[a.jsx(J,{})," Caja activa actualmente"]})]}),a.jsx(K,{className:"no-print",style:{display:"flex",gap:"10px"},children:a.jsxs(ee,{style:{background:"#fee2e2",color:"#b91c1c",borderColor:"#fecaca"},onClick:()=>L(t),children:[a.jsx(W,{})," Forzar Cierre"]})})]},t.id))}),a.jsxs("h3",{style:{marginLeft:"0.5rem",marginBottom:"1rem",color:r.text},children:[a.jsx(J,{})," Cierres Completados (",E.length,")"]}),!C&&!E.length&&a.jsx("p",{style:{marginLeft:"1rem",color:r.textLight,fontStyle:"italic"},children:"No hay cierres registrados en esta fecha."}),a.jsx(Y,{className:"cards-grid-print",children:E.map(t=>{var d,s,y;const e=U(t),i=Number(t.diferencia);return e.totalVentasDia||(e.totalVentaContado||e.total_efectivo||0)+(e.totalTarjeta||0)+(e.totalTransferencia||0)+(e.totalCredito||0),a.jsxs(q,{className:"Card",children:[a.jsxs(Z,{children:[a.jsxs("div",{style:{display:"flex",flexDirection:"column"},children:[a.jsx("strong",{style:{fontSize:"1.1rem"},children:_(t.abierta_por)}),a.jsxs("span",{style:{fontSize:"0.85rem",color:r.textLight},children:["📅 ",new Date(t.hora_apertura).toLocaleDateString("es-NI")," | 🕒 ",new Date(t.hora_apertura).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})," ➜ ",new Date(t.hora_cierre).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})]})]}),a.jsx(Q,{children:"Cerrada"})]}),a.jsxs(X,{children:[a.jsxs("div",{style:{background:"#f1f5f9",padding:"1rem",borderRadius:"8px",border:`1px solid ${r.border}`,marginBottom:"1rem",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[a.jsxs("div",{style:{display:"flex",flexDirection:"column"},children:[a.jsx("span",{style:{fontWeight:"600",color:r.secondary,textTransform:"uppercase",fontSize:"0.85rem"},children:"💰 Ingresos Totales Generados"}),a.jsx("span",{style:{fontSize:"0.7rem",color:r.textLight},children:"(Efectivo + Electrónico)"})]}),a.jsx("span",{style:{fontSize:"1.2rem",fontWeight:"bold",color:r.primary,fontFamily:"Roboto Mono"},children:n(e.vEfectivoC+e.vEfectivoD*e.tasaRef+e.vTarjeta+e.vTransf+e.vCredito+(e.aEfectivoC+e.aEfectivoD*e.tasaRef+e.aTarjeta+e.aTransf))})]}),a.jsx("div",{style:{display:"grid",gridTemplateColumns:"1fr",gap:"1rem",marginBottom:"1rem"},children:a.jsxs("div",{style:{background:"#fff",padding:"10px",borderRadius:8,border:"1px solid #eee"},children:[a.jsx("h5",{style:{margin:"0 0 0.5rem 0",color:r.secondary,fontSize:"0.85rem",borderBottom:"1px solid #eee",paddingBottom:5},children:"📊 Desglose Dinero en Caja"}),a.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.9rem",color:r.secondary,marginTop:4},children:[a.jsx("span",{children:"Ventas Efectivo (C$ y $):"}),a.jsx("span",{children:n(e.vEfectivoC+e.vEfectivoD*e.tasaRef)})]}),a.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.9rem",color:r.secondary,marginTop:4},children:[a.jsx("span",{children:"Abonos Efectivo (C$ y $):"}),a.jsx("span",{children:n(e.aEfectivoC+e.aEfectivoD*e.tasaRef)})]}),(e.sumDevolucionesCancelaciones>0||Math.abs((d=e.salidas)==null?void 0:d.reduce((x,l)=>x+Math.abs(l.amount||0),0))>0)&&a.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.9rem",color:"#dc3545",marginTop:4},children:[a.jsx("span",{children:"(-) Devoluciones / Salidas:"}),a.jsxs("span",{children:["-",n(e.sumDevolucionesCancelaciones+Math.abs((s=e.salidas)==null?void 0:s.reduce((x,l)=>x+Math.abs(l.amount||0),0)))]})]}),a.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.9rem",fontWeight:"bold",borderTop:"1px dashed #ccc",marginTop:4,paddingTop:4},children:[a.jsx("span",{children:"(=) Flujo Efectivo Neto Hoy:"}),a.jsx("span",{children:n(e.vEfectivoC+e.vEfectivoD*e.tasaRef+(e.aEfectivoC+e.aEfectivoD*e.tasaRef)-e.sumDevolucionesCancelaciones-Math.abs((y=e.salidas)==null?void 0:y.reduce((x,l)=>x+Math.abs(l.amount||0),0)))})]}),a.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.9rem",marginTop:8},children:[a.jsx("span",{children:"(+) Fondo Inicial C$:"}),a.jsx("strong",{children:n(t.monto_inicial||t.initialAmount)})]}),a.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.9rem",marginTop:4,background:"#f8fafc",padding:6,borderRadius:4,border:"1px solid #e2e8f0"},children:[a.jsx("span",{style:{fontWeight:"bold",color:r.primary},children:"EFECTIVO ESPERADO:"}),a.jsx("strong",{style:{color:r.primary},children:n(e.efectivoEsperado)})]}),a.jsxs("div",{style:{fontSize:"0.75rem",color:"#64748b",textAlign:"right",marginTop:2},children:["(Físico esperado: ",n(e.efectivoEsperadoCordobas)," y $ ",Number(e.efectivoEsperadoDolares).toFixed(2),")"]}),a.jsxs("div",{style:{marginTop:15,paddingTop:8,borderTop:"1px solid #eee"},children:[a.jsx("div",{style:{fontSize:"0.75rem",color:r.textLight,fontWeight:"bold",marginBottom:4},children:"PAGOS ELECTRÓNICOS (NO SUMAN A CAJA):"}),a.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.8rem",color:r.secondary},children:[a.jsxs("span",{children:["Tarjetas: ",n(e.totalTarjeta)]}),a.jsxs("span",{children:["Transferencias: ",n(e.totalTransferencia)]})]})]})]})}),a.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#f8fafc",padding:"10px",borderRadius:"8px",border:"1px solid #e2e8f0"},children:[a.jsxs("div",{children:[a.jsx("div",{style:{fontSize:"0.8rem",color:r.textLight},children:"Contado Real"}),a.jsx("div",{style:{fontWeight:"bold",fontSize:"1.1rem"},children:n(t.contado||t.countedAmount)})]}),a.jsx(ye,{diff:i,children:Math.abs(i)<.5?"Cuadre Perfecto":`${i>0?"+":""}${n(i)}`})]}),a.jsx(g,{session:t})]}),a.jsx(K,{className:"no-print",children:a.jsxs(ee,{onClick:()=>O(t),children:[a.jsx(se,{})," Imprimir Reporte"]})})]},t.id)})})]})};export{Ae as default};

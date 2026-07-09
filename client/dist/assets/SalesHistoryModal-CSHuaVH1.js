import{R as Q,r as s,j as e,k as ut,I as bt,aa as jt,D as yt,s as p,v as Ct,x as $e,aT as wt,af as _e,C as vt,q as Nt,ae as xe,be as kt,b7 as Ye,g as Qe,bf as lt,bg as St,J as $t,b2 as dt,am as At,Z as Ke,$ as Tt,T as It,aR as Dt,bh as Et,bi as Ft,b3 as ct,ai as zt,an as Rt,bj as Xe,ag as De}from"./vendor-C4uQ3a2a.js";import{M as Ae,B as $,f as q,a as Pe,I as Te,S as we}from"./POS.styles-yJMpH_iU.js";import{u as Re,_ as Lt,o as Mt,a as _t,r as Pt}from"./index-BmgTIz9w.js";import{A as Ot}from"./AlertModal-Chz8o6FH.js";import{r as Vt}from"./searchEngine-BMYcElFi.js";const Bt=p.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1050;
  backdrop-filter: blur(5px);
`,Wt=p.div`
  background: white; padding: 2rem; border-radius: 12px; width: 560px; max-width: 95%; max-height: 90vh; overflow-y: auto;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  animation: fadeIn 0.3s ease-out;
  @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
`,qt=p.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;
  border-bottom: 1px solid #e9ecef; padding-bottom: 1rem;
`,Ht=p.h2`margin: 0; font-size: 1.5rem; color: #333;`,Ut=p.button`
  border: none; background: none; font-size: 1.5rem; cursor: pointer; color: #888;
  &:hover { color: #333; }
`,Gt=p.form`display: flex; flex-direction: column; gap: 1.25rem;`,Ee=p.div`display: flex; flex-direction: column; gap: 0.5rem;`,Fe=p.label`font-weight: 600; color: #495057; font-size: 0.9rem;`,Le=p.input`
  padding: 0.75rem; border: 1px solid #ccc; border-radius: 6px; font-size: 1rem;
  &:focus { border-color: #007bff; outline: none; box-shadow: 0 0 0 2px rgba(0,123,255,0.25); }
`,Zt=p(Le).attrs({as:"select"})``,et=p.button`
  padding: 0.85rem 1.5rem; background: #28a745; color: white; border: none;
  border-radius: 6px; font-weight: bold; display: flex; align-items: center; gap: 0.5rem;
  justify-content: center; cursor: pointer; transition: background-color 0.2s; font-size: 1rem;
  &:hover:not(:disabled) { background: #218838; }
  &:disabled { background: #6c757d; cursor: not-allowed; }
`,Jt=p.p`
  margin: 0 0 0.5rem 0; padding: 0.75rem; background-color: #e9ecef; border-radius: 6px;
  color: #495057; text-align: center; font-size: 1rem;
  strong { color: #dc3545; }
`,Yt=p.p`
  margin-top: -1rem; margin-bottom: 0.5rem; padding: 0.5rem; color: #dc3545; font-size: 0.9rem; text-align: center;
`,tt=p(Ct)`
  animation: spin 1s linear infinite;
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`,nt=p.div`
  display: flex; flex-direction: column; gap: 0.5rem;
  max-height: 220px; overflow-y: auto; padding: 0.25rem;
`,ot=p.div`
  padding: 0.75rem 1rem; border: 2px solid ${t=>t.$selected?"#007bff":"#e9ecef"};
  border-radius: 8px; cursor: pointer; transition: all 0.2s;
  background: ${t=>t.$selected?"#e8f0fe":t.$paid?"#f0f9f0":"white"};
  opacity: ${t=>t.$paid?.6:1};
  display: flex; justify-content: space-between; align-items: center;
  &:hover { border-color: ${t=>t.$paid?"#e9ecef":"#007bff"}; }

  .ticket-info {
    display: flex; flex-direction: column; gap: 2px;
    .ticket-id { font-weight: 700; color: #0056b3; font-size: 0.9rem; }
    .ticket-date { font-size: 0.8rem; color: #6c757d; }
  }
  .ticket-amounts {
    text-align: right;
    .original { font-size: 0.8rem; color: #6c757d; text-decoration: line-through; }
    .remaining { font-weight: 700; color: ${t=>t.$paid?"#28a745":"#dc3545"}; font-size: 1rem; }
  }
`,Qt=p.div`
  font-size: 0.85rem; font-weight: 600; color: #495057;
  margin-bottom: 0.25rem; display: flex; align-items: center; gap: 0.5rem;
`,ue=t=>`C$${Number(t||0).toFixed(2)}`,rt=t=>t?new Date(t).toLocaleDateString("es-NI",{timeZone:"America/Managua",day:"2-digit",month:"2-digit",year:"numeric"}):"—",Kt=({client:t,onClose:r,onAbonoSuccess:m,showAlert:x})=>{const{addCajaTransaction:w,user:h}=Re(),[d,N]=s.useState(""),[b,L]=s.useState("Efectivo"),[j,l]=s.useState(""),[A,z]=s.useState(!1),[I,i]=s.useState(""),[S,u]=s.useState([]),[M,c]=s.useState(!0),[f,K]=s.useState(null),O=s.useMemo(()=>Number(t==null?void 0:t.saldo_pendiente)||0,[t]);s.useEffect(()=>{const o=async()=>{c(!0);try{const y=localStorage.getItem("token"),V=await Mt(t.id_cliente,y);u(Array.isArray(V)?V:[])}catch(y){console.error("Error cargando tickets:",y),u([])}finally{c(!1)}};t!=null&&t.id_cliente&&o()},[t]);const D=s.useMemo(()=>S.filter(o=>o.saldoRestante>0),[S]),oe=s.useMemo(()=>S.filter(o=>o.saldoRestante<=0),[S]),_=f?Math.min(O,f.saldoRestante):O;s.useEffect(()=>{if(!d){i("");return}const o=parseFloat(d);isNaN(o)||o<=0?i("Ingrese un monto válido mayor a cero."):o>_?i(`El máximo es ${ue(_)}.`):i("")},[d,_]);const re=o=>{o.saldoRestante<=0||(K(y=>(y==null?void 0:y.idVenta)===o.idVenta?null:o),N(""))},v=()=>{N(f?f.saldoRestante.toFixed(2):O.toFixed(2))},ae=s.useCallback((o,y,V,F)=>{const B=Math.max(0,F-o),ie=new Date().toLocaleString("es-NI",{timeZone:"America/Managua"}),T=f?`Venta #${f.idVenta}`:"Cuenta General",fe=`
      <div style="font-family:'League Spartan','Inter',system-ui,sans-serif;width:80mm;padding:6px 4px;font-size:9pt;color:#000;">
        <div style="text-align:center;border-bottom:2px solid #000;padding-bottom:6px;margin-bottom:6px;">
          <h1 style="margin:4px 0;font-size:14pt;font-weight:900;">COMPROBANTE DE ABONO</h1>
        </div>
        <div style="margin-bottom:8px;border-bottom:1px dashed #000;padding-bottom:6px;">
          <p style="margin:2px 0;display:flex;justify-content:space-between;"><strong>Cliente:</strong><span>${(t==null?void 0:t.nombre)||"N/A"}</span></p>
          <p style="margin:2px 0;display:flex;justify-content:space-between;"><strong>Fecha:</strong><span>${ie}</span></p>
          <p style="margin:2px 0;display:flex;justify-content:space-between;"><strong>Aplicado a:</strong><span>${T}</span></p>
          <p style="margin:2px 0;display:flex;justify-content:space-between;"><strong>Método:</strong><span>${y}</span></p>
          ${V?`<p style="margin:2px 0;display:flex;justify-content:space-between;"><strong>Ref:</strong><span>${V}</span></p>`:""}
        </div>
        <div style="border-top:2px solid #000;padding-top:8px;margin-top:8px;">
          <p style="display:flex;justify-content:space-between;margin:4px 0;font-size:11pt;"><strong>Saldo Anterior:</strong><span>C$${F.toFixed(2)}</span></p>
          <p style="display:flex;justify-content:space-between;margin:4px 0;font-size:14pt;font-weight:900;color:#28a745;"><strong>ABONO:</strong><span>C$${o.toFixed(2)}</span></p>
          <p style="display:flex;justify-content:space-between;margin:4px 0;font-size:14pt;font-weight:900;color:#dc3545;border-top:2px solid #000;padding-top:6px;"><strong>SALDO RESTANTE:</strong><span>C$${B.toFixed(2)}</span></p>
        </div>
        <div style="text-align:center;margin-top:12px;font-size:8pt;font-style:italic;color:#555;border-top:1px dashed #000;padding-top:8px;">
          Documento no válido como factura.<br/>Gracias por su pago.
        </div>
      </div>
    `,R=window.open("","_blank","width=400,height=600");R&&(R.document.write(`<!DOCTYPE html><html><head><title>Comprobante Abono</title><link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;700;900&display=swap" rel="stylesheet"><style>@page{size:80mm auto;margin:0;}body{margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;}*{font-weight:800!important;color:#000!important;}</style></head><body>${fe}</body></html>`),R.document.close(),R.focus(),R.onload=function(){setTimeout(()=>{R.print(),setTimeout(()=>R.close(),500)},400)})},[t,f]),X=s.useCallback(async o=>{o.preventDefault();const y=parseFloat(d),V=localStorage.getItem("token");if(I||!y||y<=0){x==null||x({title:"Monto Inválido",message:I||"Revise el monto ingresado."});return}if(b!=="Efectivo"&&!j.trim()){x==null||x({title:"Referencia Requerida",message:"Ingrese el número de referencia, transferencia o voucher."});return}z(!0);try{await Lt(t.id_cliente,{monto:y,id_venta:(f==null?void 0:f.idVenta)||null,pagoDetalles:{metodo:b,usuario:(h==null?void 0:h.nombre_usuario)||"Desconocido",referencia:j||"",ticketRef:f?`Venta #${f.idVenta}`:"FIFO"}},V);const F=b==="Efectivo",B={id:`abono-${Date.now()}`,type:"abono",amount:y,note:`Abono Cliente: ${t.nombre} (${b})${f?` - Venta #${f.idVenta}`:""} ${j?"- Ref: "+j:""}`,at:new Date().toISOString(),pagoDetalles:{clienteId:t.id_cliente,clienteNombre:t.nombre,metodo:b,referencia:j,ingresoCaja:F?y:0,efectivo:F?y:0,tarjeta:b==="Tarjeta"?y:0,transferencia:b==="Transferencia"?y:0,credito:0}};await w(B),ae(y,b,j,O),m==null||m(B),r==null||r()}catch(F){console.error("Error al registrar abono:",F),x==null||x({title:"Error",message:`No se pudo registrar el abono. ${F.message}`})}finally{z(!1)}},[d,b,j,I,t,h,f,w,m,r,x,ae,O]),E=A||O<=0||!!I||!d;return e.jsx(Bt,{children:e.jsxs(Wt,{children:[e.jsxs(qt,{children:[e.jsx(Ht,{children:"Registrar Abono"}),e.jsx(Ut,{onClick:r,disabled:A,children:e.jsx(ut,{})})]}),e.jsxs("p",{children:["Cliente: ",e.jsx("strong",{children:(t==null?void 0:t.nombre)||"Desconocido"})]}),e.jsxs(Jt,{children:["Saldo Pendiente Total: ",e.jsx("strong",{children:ue(O)})]}),M?e.jsxs("div",{style:{textAlign:"center",padding:"1rem",color:"#6c757d"},children:[e.jsx(tt,{})," Cargando facturas..."]}):D.length>0?e.jsxs(e.Fragment,{children:[e.jsxs(Qt,{children:[e.jsx(bt,{})," Selecciona una factura (opcional — si no, paga la más antigua):"]}),e.jsx(nt,{children:D.map(o=>e.jsxs(ot,{$selected:(f==null?void 0:f.idVenta)===o.idVenta,onClick:()=>re(o),children:[e.jsxs("div",{className:"ticket-info",children:[e.jsxs("span",{className:"ticket-id",children:["Venta #",o.idVenta]}),e.jsx("span",{className:"ticket-date",children:rt(o.fecha)})]}),e.jsxs("div",{className:"ticket-amounts",children:[o.montoOriginal!==o.saldoRestante&&e.jsx("div",{className:"original",children:ue(o.montoOriginal)}),e.jsx("div",{className:"remaining",children:ue(o.saldoRestante)})]})]},o.idVenta))}),oe.length>0&&e.jsxs("details",{style:{marginTop:"0.5rem"},children:[e.jsxs("summary",{style:{cursor:"pointer",fontSize:"0.85rem",color:"#6c757d"},children:[e.jsx(jt,{style:{color:"#28a745"}})," ",oe.length," factura(s) pagada(s)"]}),e.jsx(nt,{style:{marginTop:"0.5rem"},children:oe.map(o=>e.jsxs(ot,{$paid:!0,children:[e.jsxs("div",{className:"ticket-info",children:[e.jsxs("span",{className:"ticket-id",children:["Venta #",o.idVenta]}),e.jsx("span",{className:"ticket-date",children:rt(o.fecha)})]}),e.jsx("div",{className:"ticket-amounts",children:e.jsx("div",{className:"remaining",style:{color:"#28a745"},children:"Pagada ✔"})})]},o.idVenta))})]})]}):null,e.jsxs(Gt,{onSubmit:X,children:[e.jsxs(Ee,{children:[e.jsxs(Fe,{htmlFor:"montoAbono",children:["Monto a Abonar (C$)",f&&e.jsxs("span",{style:{fontWeight:"normal",color:"#007bff",marginLeft:"0.5rem"},children:["— Venta #",f.idVenta," (máx: ",ue(_),")"]})]}),e.jsxs("div",{style:{display:"flex",gap:"0.5rem"},children:[e.jsx(Le,{id:"montoAbono",type:"number",value:d,onChange:o=>N(o.target.value),placeholder:"0.00",required:!0,autoFocus:!0,step:"0.01",min:"0.01",max:_?_.toFixed(2):void 0,disabled:A||O<=0,style:{flex:1}}),e.jsx(et,{type:"button",onClick:v,style:{background:"#007bff",padding:"0.5rem 0.75rem",fontSize:"0.85rem"},disabled:A||O<=0,children:"Total"})]})]}),e.jsxs(Ee,{children:[e.jsx(Fe,{htmlFor:"metodoPago",children:"Método de Pago"}),e.jsxs(Zt,{id:"metodoPago",value:b,onChange:o=>L(o.target.value),disabled:A,children:[e.jsx("option",{value:"Efectivo",children:"Efectivo"}),e.jsx("option",{value:"Tarjeta",children:"Tarjeta"}),e.jsx("option",{value:"Transferencia",children:"Transferencia"})]})]}),b!=="Efectivo"&&e.jsxs(Ee,{children:[e.jsx(Fe,{htmlFor:"referencia",children:"Referencia / Voucher / N° Transferencia"}),e.jsx(Le,{id:"referencia",type:"text",value:j,onChange:o=>l(o.target.value),placeholder:"Ej: BAC-123456",required:!0})]}),I&&e.jsx(Yt,{children:I}),e.jsx(et,{type:"submit",disabled:E,children:A?e.jsxs(e.Fragment,{children:[e.jsx(tt,{})," Procesando..."]}):e.jsxs(e.Fragment,{children:[e.jsx(yt,{})," Registrar Abono"]})})]})]})})},Xt=Q.memo(Kt),en=Nt`
  @media print {
    body { visibility: hidden; margin: 0; padding: 0; }
    .print-area, .print-area * { visibility: visible !important; }
    .print-area {
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;
      z-index: 999999 !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    .no-print { display: none !important; }
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }
  }
`,tn=p.div`
  font-family: 'Consolas','Courier New',monospace;
  color: #000;
  background: #fff;
  width: 310px;
  margin: 0 auto;
  padding: 12px 10px;
  box-shadow: 0 0 10px rgba(0,0,0,.08);
  border: 1px solid #eee;
  border-radius: 8px;

  &.compact { padding: 8px 6px; }

  /* --- BRAND --- */
  .brand {
    text-align: center;
    border-bottom: 2px dashed #333;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }
  .brand-logo-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 6px;
  }
  .brand h1 { margin: 6px 0 2px; font-size: 1.4rem; font-weight: 900; color: #000; line-height: 1.25; letter-spacing: 0.5px; }
  .brand small { color: #333; display: block; margin: 2px 0; line-height: 1.35; white-space: normal; word-break: break-word; font-weight: 500; }

  /* --- META --- */
  .meta { font-size: .85rem; margin-bottom: 12px; border-bottom: 1px dashed #ccc; padding-bottom: 8px; }
  .meta p { margin: 3px 0; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 2px 8px; font-weight: 400; }
  .meta-label { font-weight: 800; color: #000; }
  .meta-value { font-weight: 500; text-align: right; }

  /* --- ITEMS --- */
  table.items { width: 100%; border-collapse: collapse; font-size: .85rem; table-layout: fixed; }
  table.items th, table.items td { padding: 5px 3px; vertical-align: top; word-wrap: break-word; }
  table.items th { border-bottom: 2px solid #000; font-weight: 900; text-transform: uppercase; font-size: 0.7rem; color: #000; }
  table.items td { font-weight: 500; border-bottom: 1px dotted #ccc; }
  &.compact table.items th, &.compact table.items td { padding: 3px 2px; }
  .text-right { text-align: right; }
  .col-qty { width: 12%; text-align: center; }
  .col-unit { width: 25%; text-align: right; }
  .col-total { width: 25%; text-align: right; }
  table.items td:nth-child(2) { white-space: normal; text-align: left; }

  /* --- TOTALS --- */
  .totals { border-top: 2px solid #000; padding-top: 8px; margin-top: 12px; }
  .badge { display: inline-block; font-weight: 900; letter-spacing: .5px; padding: 6px 10px; border: 2px solid #000; border-radius: 4px; margin: 10px auto; text-align: center; color: #000; }
  .thanks { text-align: center; font-size: .8rem; border-top: 1px dashed #333; padding-top: 8px; margin-top: 10px; color: #333; line-height: 1.4; font-weight: 600; }

  /* ====== A4 SPECIFIC LAYOUT ====== */
  &.print-a4 {
    width: 100%;
    max-width: 700px;
    font-family: 'Inter', Helvetica, Arial, sans-serif;
    padding: 30px;
    border-radius: 0;

    .brand {
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-align: left;
        border-bottom: 3px solid #1e3a8a;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
    }
    .brand-logo-container { width: 150px; justify-content: flex-start; }
    .brand-info { text-align: right; max-width: 60%; }
    .brand h1 { font-size: 20pt; color: #1e3a8a; margin-bottom: 5px; font-weight: 900; }
    .brand small { font-size: 9pt; color: #444; margin: 1px 0; font-weight: 500; }
    
    .meta { 
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        border: 1px solid #ddd;
        padding: 15px;
        background: #f8fafc;
        border-radius: 6px;
        margin-bottom: 25px;
    }
    .meta-col { display: flex; flex-direction: column; gap: 5px; }
    .meta-title { font-weight: 900; text-transform: uppercase; color: #1e3a8a; border-bottom: 2px solid #1e3a8a; padding-bottom: 4px; margin-bottom: 6px; font-size: 9pt; }
    .meta p { justify-content: flex-start; gap: 8px; border-bottom: none; width: 100%; display: grid; grid-template-columns: 120px 1fr; }
    .meta-label { text-align: left; color: #64748b; font-weight: 600; }
    .meta-value { text-align: left; color: #0f172a; font-weight: 700; }

    table.items th { background: #f1f5f9; color: #334155; padding: 10px; border-bottom: 2px solid #cbd5e1; font-size: 9pt; font-weight: 800; }
    table.items td { padding: 10px; border-bottom: 1px solid #f1f5f9; font-size: 10pt; color: #334155; font-weight: 500; }
    .col-qty { width: 10%; }
    .col-unit { width: 15%; }
    .col-total { width: 15%; }
    
    .totals { border-top: none; margin-top: 0; display: flex; justify-content: flex-end; padding-top: 20px; }
    .totals-box { width: 250px; }
    
    .thanks { border-top: none; margin-top: 50px; font-style: italic; color: #94a3b8; }
    
    .footer-sign {
        margin-top: 60px;
        display: flex;
        justify-content: space-between;
        padding: 0 40px;
    }
    .sign-box {
        border-top: 1px solid #94a3b8;
        width: 40%;
        text-align: center;
        padding-top: 10px;
        color: #64748b;
        font-size: 9pt;
    }
  }

  @media print {
    &.print-80 {
      width: 80mm !important;
      font-family: 'Consolas', monospace !important;
      padding: 6px 4px !important;
      border: none !important;
      box-shadow: none !important;
      font-size: 8pt;
    }
    &.print-a4 {
      width: 190mm !important;
      font-size: 10pt !important;
      padding: 10mm !important;
      margin: 0 !important;
      border: none !important;
      box-shadow: none !important;
      max-height: 277mm !important;
      overflow: hidden !important;
      font-family: 'Inter', Helvetica, Arial, sans-serif !important;
    }
    &.compact { font-size: 7.5pt; }
  }
`,nn=p.div`
  display: flex; flex-direction: column; gap: 12px;
  max-height: 60vh;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    max-height: 65vh;
  }
`,on=p.img`
  max-width: 140px;
  width: 100%;
  height: auto;
  display: block;
  border-radius: 4px;
  object-fit: contain;

  &.logo-80mm {
    max-width: 120px;
    margin: 0 auto;
  }
  &.logo-a4 {
    max-width: 130px;
    margin: 0;
  }
`,be=p.span`
  display: inline-flex; align-items: center; gap: 6px;
  font-weight: 900; letter-spacing: .5px; padding: 5px 10px; border-radius: 4px;
  font-size: 0.85rem;
  ${({$type:t})=>t==="proforma"&&xe`background: #e8f4ff; color: #0b72b9; border: 2px solid #0b72b9;`}
  ${({$type:t})=>t==="abono"&&xe`background: #fff3cd; color: #856404; border: 2px solid #856404;`}
  ${({$type:t})=>t==="venta"&&xe`background: #e8f7ee; color: #1c7d3a; border: 2px solid #1c7d3a;`}
  ${({$type:t})=>t==="outflow"&&xe`background: #fee2e2; color: #991b1b; border: 2px solid #991b1b;`}
  ${({$type:t})=>t==="pro"&&xe`background: #f3e8ff; color: #8b5cf6; border: 2px solid #8b5cf6;`}
`,rn=p.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 1rem; border-bottom: 2px solid #e2e8f0; padding-bottom: .75rem;
  flex-wrap: wrap; gap: 8px;

  h2 { font-size: 1.1rem; }

  @media (max-width: 600px) {
    flex-direction: column; align-items: stretch;
    h2 { font-size: 1rem; }
  }
`,an=p.div`
  display: flex; gap: 8px; flex-wrap: wrap;
  
  @media (max-width: 600px) {
    justify-content: stretch;
    button { flex: 1; font-size: 0.85rem; padding: 10px 8px; }
  }
`,at=p(Pe)`
  max-width: 540px;
  width: 96%;
  padding: 1.2rem;
  background: #fff;
  max-height: 95vh;
  overflow-y: auto;

  @media (max-width: 600px) {
    width: 100%;
    max-width: 100%;
    border-radius: 12px 12px 0 0;
    padding: 1rem;
    max-height: 92vh;
  }
`,U=t=>new Intl.NumberFormat("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(t||0)),k=(...t)=>t.find(r=>r!=null),me=t=>k(t==null?void 0:t.usuarioNombre,t==null?void 0:t.nombre_usuario,t==null?void 0:t.nombre,t==null?void 0:t.name,t==null?void 0:t.displayName,t==null?void 0:t.fullName,t==null?void 0:t.username,null);function sn(t=[]){return t.map((r,m)=>{const x=Number(k(r.quantity,r.cantidad,r.qty,0)),w=k(r.nombre,r.descripcion,r.description,r.producto,`Item ${m+1}`),h=Number(k(r.precio_unitario,r.precio_venta,r.precio,r.unitPrice,0));return{id:k(r.id_producto,r.id,`it-${m}`),nombre:w,quantity:x,unit:h,total:x*h}})}function ln(t={}){const r=Number(t.efectivo||0),m=Number(t.tarjeta||0),x=Number(t.transferencia||0),w=Number(t.dolares||0);if(Number(t.credito||0)>0)return"Crédito";const d=[];return r>0&&d.push("Efectivo"),m>0&&d.push("Tarjeta"),x>0&&d.push("Transferencia"),w>0&&d.push("Dólares"),d.length===0?"Contado":d.length===1?d[0]:"Mixto"}function dn(t={},r=0){const m=Number(t.efectivo||0),x=Number(t.tarjeta||0),w=Number(t.transferencia||0),h=Number(t.otro||0),d=Number(t.dolares||0),N=Number(t.tasaDolarAlMomento||t.tasaObtenida||1),b=d*(N>1?N:1),L=m+x+w+h+b;return L>0?L:Number(t.montoRecibido||r||0)}function cn(t){const r=k(t==null?void 0:t.fecha,t==null?void 0:t.createdAt,t==null?void 0:t.created_at,t==null?void 0:t.date,t);try{const m=new Date(r);return isNaN(m)?"Fecha inválida":m.toLocaleString("es-NI",{hour12:!0})}catch{return"Fecha inválida"}}function pn(t){const r=k(t.proformaId,t.proformaNumero,t.numeroProforma,t.id);if(r)return r;const m=new Date,x=m.toISOString().slice(2,10).replace(/-/g,""),w=m.toTimeString().slice(0,8).replace(/:/g,"");return`PF-${x}-${w}`}const Ln=({transaction:t,onClose:r,clients:m=[],users:x=[],isOpen:w=!0,printMode:h="80",currentUser:d=null,onPersistPrint:N=null,autoTriggerPrint:b=!1,showAlert:L=null})=>{var he;const{user:j}=typeof Re=="function"?Re():{user:null},{settings:l}=_t();if(!w||t==null)return null;const[A]=Q.useState(typeof t=="object"?t:null),[z]=Q.useState(!1),[I]=Q.useState(null);if(z||I||!A)return e.jsx(Ae,{className:"no-print",children:e.jsxs(at,{className:"no-print",style:{maxWidth:420,padding:"1rem"},children:[e.jsx("h3",{style:{color:"#dc3545"},children:"No se pudo imprimir"}),e.jsx("div",{style:{display:"flex",justifyContent:"center",marginTop:12},children:e.jsxs($,{onClick:r,$cancel:!0,children:[e.jsx($e,{})," Cerrar"]})})]})});const i=A,S=i.estado==="ABONO_CREDITO",u=!!(i.isProforma||i.proformaFor||i.proformaNombre),M=!!i.isOutflow,c=i.estado==="DEVOLUCION",f=u?pn(i):k(i.id,i.saleId,i.numero,"-"),K=cn(k(i.fecha,i.createdAt,i.date)),O=k(i.clientId,i.idCliente,i.clienteId),D=m.find(g=>String(g.id_cliente??g.id)===String(O)),oe=u&&i.proformaNombre?i.proformaNombre:k(D==null?void 0:D.nombre,i.clienteNombre,"Consumidor Final"),_=(D==null?void 0:D.cedula)||i.clienteCedula,re=k(i.userId,i.idUsuario,(he=i.openedBy)==null?void 0:he.id)??(d==null?void 0:d.id_usuario)??(d==null?void 0:d.id)??(d==null?void 0:d.uid)??(j==null?void 0:j.id_usuario)??(j==null?void 0:j.id)??(j==null?void 0:j.uid),v=(()=>{try{return JSON.parse(localStorage.getItem("authUser")||"null")}catch{return null}})(),ae=x.find(g=>String(g.id_usuario||g.id||g.uid)===String(re)),X=k(i.usuarioNombre,me(ae),me(d),me(j),me(v),"Cajero POS"),E=u?k(i.usuarioNombre,me(d),me(j),me(v),X):X,o=sn(k(i.items,i.detalle,[])),y=o.reduce((g,ce)=>g+Number(ce.unit)*Number(ce.quantity),0),V=Number(k(i.subtotal,y)),F=Number(k(i.descuento,0)),B=Number(k(i.totalVenta,i.total_venta,V-F,0)),ie=i.pagoDetalles||{},T=u||M?"N/A":k(i.metodoPago,ln(ie)),fe=u||M?0:dn(ie,B),R=u||M?0:Math.max(0,fe-B),ee=Math.abs(Number(k(i.totalVenta,i.montoAbono,0))),se=Number((D==null?void 0:D.saldo_pendiente)||0),ge=se+ee,le=o.length<=2,je=s.useMemo(()=>l!=null&&l.empresa_logo_url?l.empresa_logo_url.startsWith("http")?l.empresa_logo_url:`${"https://sistema.multirepuestosrg.com/api".replace(/\/api$/,"")}${l.empresa_logo_url.startsWith("/")?"":"/"}${l.empresa_logo_url}`:null,[l==null?void 0:l.empresa_logo_url]),W={name:(l==null?void 0:l.empresa_nombre)||"Multirepuestos RG",ruc:(l==null?void 0:l.empresa_ruc)||"1211812770001E",phone:(l==null?void 0:l.empresa_telefono)||"84031936 / 84058142",address:(l==null?void 0:l.empresa_direccion)||"Del portón de la normal 75 varas al este. Juigalpa, Chontales.",slogan:(l==null?void 0:l.empresa_eslogan)||"Repuestos de confianza al mejor precio",logo:je||new URL("/icons/logo.png",window.location.origin).toString()};Q.useCallback(async g=>{},[]);const te=Q.useCallback((g="80",ce=!1)=>{const Z=document.getElementById("print-wrapper-ticket");if(!Z)return;const J=Z.outerHTML,ye=`
      @charset "UTF-8";
      @page { size: ${g==="A4"?"A4 portrait":"80mm auto"}; margin: ${g==="A4"?"12mm":"0"}; }
      html, body { background: #fff; margin: 0 !important; padding: 0 !important; font-family: ${g==="A4"?"'Inter', Helvetica, Arial, sans-serif":"'Consolas', monospace"}; color: #000 !important; }
      
      #print-wrapper-ticket {
        box-shadow: none !important; border: none !important; margin: 0 !important;
        ${g==="A4"?"width: 100% !important; padding: 0 !important; font-size: 10pt !important;":"width: 80mm !important; padding: 6px 4px !important; font-size: 8pt !important;"}
      }

      /* === ESTILOS 80mm MEJORADOS === */
      ${g!=="A4"?`
        #print-wrapper-ticket { font-family: 'Consolas', monospace !important; }
        #print-wrapper-ticket .brand { text-align: center !important; border-bottom: 2px dashed #000 !important; padding-bottom: 8px !important; margin-bottom: 8px !important; }
        #print-wrapper-ticket .brand-logo-container { display: flex !important; justify-content: center !important; margin-bottom: 6px !important; }
        #print-wrapper-ticket .brand-logo-container img { max-width: 50mm !important; height: auto !important; display: block !important; margin: 0 auto !important; }
        #print-wrapper-ticket .brand h1 { font-size: 14pt !important; font-weight: 900 !important; color: #000 !important; margin: 4px 0 2px !important; letter-spacing: 0.5px !important; }
        #print-wrapper-ticket .brand small { font-size: 7pt !important; color: #000 !important; font-weight: 600 !important; margin: 1px 0 !important; }
        #print-wrapper-ticket .brand-info { text-align: center !important; }
        
        #print-wrapper-ticket .meta { font-size: 8pt !important; border-bottom: 1px dashed #000 !important; }
        #print-wrapper-ticket .meta-label { font-weight: 900 !important; }
        #print-wrapper-ticket .meta-value { font-weight: 600 !important; }
        #print-wrapper-ticket .meta-title { font-weight: 900 !important; font-size: 8pt !important; border-bottom: 1px solid #000 !important; color: #000 !important; }
        
        #print-wrapper-ticket table.items th { border-bottom: 2px solid #000 !important; font-weight: 900 !important; font-size: 7pt !important; color: #000 !important; }
        #print-wrapper-ticket table.items td { font-weight: 600 !important; font-size: 7.5pt !important; border-bottom: 1px dotted #999 !important; }
        
        #print-wrapper-ticket .totals { border-top: 2px solid #000 !important; }
        #print-wrapper-ticket .grand-total { font-size: 13pt !important; font-weight: 900 !important; }
        #print-wrapper-ticket .thanks { font-size: 7pt !important; font-weight: 700 !important; border-top: 1px dashed #000 !important; }
        
        #print-wrapper-ticket .ticket-tag { font-weight: 900 !important; font-size: 9pt !important; border: 2px solid #000 !important; padding: 3px 8px !important; }
        #print-wrapper-ticket .footer-sign { display: none !important; }
      `:`
        /* === ESTILOS A4 MEJORADOS === */
        #print-wrapper-ticket .brand { display: flex !important; justify-content: space-between !important; align-items: center !important; border-bottom: 3px solid #1e3a8a !important; margin-bottom: 25px !important; padding-bottom: 15px !important; text-align: left !important; }
        #print-wrapper-ticket .brand-logo-container { order: 1 !important; width: 140px !important; justify-content: flex-start !important; }
        #print-wrapper-ticket .brand-logo-container img { max-width: 130px !important; height: auto !important; }
        #print-wrapper-ticket .brand-info { order: 2 !important; text-align: right !important; flex: 1 !important; }
        #print-wrapper-ticket .brand h1 { font-size: 22pt !important; color: #1e3a8a !important; margin: 0 0 5px 0 !important; font-weight: 900 !important; }
        #print-wrapper-ticket .brand small { display: block !important; font-size: 9pt !important; margin: 2px 0 !important; color: #334155 !important; font-weight: 500 !important; }
        
        #print-wrapper-ticket .meta { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 30px !important; background: #f8fafc !important; border: 1px solid #e2e8f0 !important; padding: 15px !important; border-radius: 8px !important; margin-bottom: 30px !important; }
        #print-wrapper-ticket .meta p { display: grid !important; grid-template-columns: 140px 1fr !important; width: 100% !important; border-bottom: 1px dashed #e2e8f0 !important; padding-bottom: 4px !important; margin-bottom: 4px !important; }
        #print-wrapper-ticket .meta-title { font-weight: 900 !important; text-transform: uppercase !important; color: #1e3a8a !important; border-bottom: 2px solid #cbd5e1 !important; margin-bottom: 10px !important; padding-bottom: 5px !important; display: block !important; width: 100% !important; }
        
        #print-wrapper-ticket table.items { width: 100% !important; border-collapse: collapse !important; border: 1px solid #e2e8f0 !important; }
        #print-wrapper-ticket table.items th { background: #f1f5f9 !important; color: #334155 !important; padding: 12px 8px !important; font-weight: 800 !important; text-transform: uppercase !important; font-size: 8pt !important; border-bottom: 2px solid #cbd5e1 !important; text-align: left !important; }
        #print-wrapper-ticket table.items td { padding: 10px 8px !important; border-bottom: 1px solid #f1f5f9 !important; font-size: 9.5pt !important; color: #334155 !important; vertical-align: top !important; font-weight: 500 !important; }
        #print-wrapper-ticket .col-qty { text-align: center !important; }
        #print-wrapper-ticket .col-unit, #print-wrapper-ticket .col-total { text-align: right !important; }
        
        #print-wrapper-ticket .totals { display: flex !important; justify-content: flex-end !important; margin-top: 20px !important; border-top: none !important; }
        #print-wrapper-ticket .totals-box { width: 300px !important; background: #f8fafc !important; padding: 15px !important; border-radius: 8px !important; border: 1px solid #e2e8f0 !important; }
        #print-wrapper-ticket .footer-sign { display: flex !important; justify-content: space-between !important; margin-top: 80px !important; padding: 0 50px !important; }
        #print-wrapper-ticket .sign-box { border-top: 1px solid #94a3b8 !important; width: 40% !important; text-align: center !important; padding-top: 5px !important; font-size: 9pt !important; color: #64748b !important; }
      `}
    `,ne=window.open("","_blank","width=900,height=700");ne&&(ne.document.write(`<html><head><title>Impresión ${g.toUpperCase()} - ${W.name}</title><style>${ye}</style></head><body>${J}</body></html>`),ne.document.close(),ne.focus(),setTimeout(()=>{try{ne.print()}catch(pe){console.error("Print error:",pe)}setTimeout(()=>{try{ne.close()}catch{}},1e3)},400),ce&&setTimeout(()=>{r&&r()},800))},[W,r]),de=s.useRef(!1);return s.useEffect(()=>{if(b&&!de.current){de.current=!0;const g=setTimeout(()=>te("80",!0),500);return()=>clearTimeout(g)}},[b,te]),e.jsxs(Ae,{className:"no-print",children:[e.jsx(en,{}),e.jsxs(at,{className:"no-print",children:[e.jsxs(rn,{children:[e.jsxs("h2",{style:{display:"flex",alignItems:"center",gap:8,margin:0},children:[e.jsx(wt,{color:"#2563eb"})," Vista de Impresión"]}),e.jsxs(an,{children:[e.jsxs($,{onClick:()=>te("80"),style:{background:"#2563eb",color:"#fff",fontWeight:700},children:[e.jsx(_e,{})," 80mm"]}),e.jsxs($,{onClick:()=>te("A4"),style:{background:"#0f766e",color:"#fff",fontWeight:700},children:[e.jsx(vt,{})," A4"]}),e.jsx($,{$cancel:!0,onClick:r,style:{background:"#fee2e2",color:"#ef4444"},children:e.jsx($e,{})})]})]}),e.jsx(nn,{children:e.jsxs(tn,{id:"print-wrapper-ticket",className:`print-area ${h==="A4"?"print-a4":"print-80"} ${le?"compact":""}`,children:[e.jsxs("div",{className:"brand",children:[e.jsx("div",{className:"brand-logo-container",children:e.jsx(on,{className:h==="A4"?"logo-a4":"logo-80mm",src:W.logo,alt:"Logo",onError:g=>{g.currentTarget.style.display="none"}})}),e.jsxs("div",{className:"brand-info",children:[e.jsx("h1",{children:W.name}),e.jsx("small",{children:e.jsx("strong",{children:W.slogan})}),e.jsxs("small",{children:[e.jsx("strong",{children:"RUC:"})," ",W.ruc]}),e.jsxs("small",{children:[e.jsx("strong",{children:"Tel:"})," ",W.phone]}),e.jsx("small",{children:W.address}),e.jsx("div",{style:{marginTop:8},children:u?e.jsx(be,{$type:"proforma",className:"ticket-tag",children:"PROFORMA"}):S?e.jsx(be,{$type:"abono",className:"ticket-tag",children:"RECIBO"}):M?e.jsx(be,{$type:"outflow",className:"ticket-tag",children:"SALIDA"}):i.isProReceipt||i.isWholesale?e.jsx(be,{$type:"pro",className:"ticket-tag",children:"RECIBO PRO"}):e.jsx(be,{$type:"venta",className:"ticket-tag",children:c?"DEVOLUCIÓN":"FACTURA"})})]})]}),e.jsxs("div",{className:"meta",children:[e.jsxs("div",{className:"meta-col",children:[e.jsx("span",{className:"meta-title",children:"Detalles del Documento"}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Fecha:"}),e.jsx("span",{className:"meta-value",children:K})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"No. Documento:"}),e.jsx("span",{className:"meta-value",children:f})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Atendido por:"}),e.jsx("span",{className:"meta-value",children:E})]})]}),e.jsxs("div",{className:"meta-col",children:[e.jsx("span",{className:"meta-title",children:"Datos del Cliente"}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Cliente:"}),e.jsx("span",{className:"meta-value",children:oe})]}),_&&e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Cédula/RUC:"}),e.jsx("span",{className:"meta-value",children:_})]}),!u&&!M&&e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Pago:"}),e.jsx("span",{className:"meta-value",children:T})]})]})]}),e.jsxs("table",{className:"items",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{className:"col-qty",children:"Cant."}),e.jsx("th",{children:"Descripción"}),e.jsx("th",{className:"text-right col-unit",children:"P. Unit"}),e.jsx("th",{className:"text-right col-total",children:"Total"})]})}),e.jsx("tbody",{children:o.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:"4",style:{textAlign:"center"},children:"Sin ítems"})}):o.map(g=>e.jsxs("tr",{children:[e.jsx("td",{className:"col-qty",style:{fontWeight:800},children:g.quantity}),e.jsx("td",{style:{fontWeight:600},children:g.nombre}),e.jsxs("td",{className:"text-right col-unit",children:["C$",U(g.unit)]}),e.jsxs("td",{className:"text-right col-total",style:{fontWeight:700},children:["C$",U(g.total)]})]},g.id))})]}),e.jsx("div",{className:"totals",children:e.jsx("div",{className:"totals-box",children:S?e.jsxs(e.Fragment,{children:[e.jsxs(q,{style:{marginTop:5,fontSize:"0.95em"},children:[e.jsx("span",{style:{fontWeight:700},children:"Saldo Anterior:"}),e.jsxs("span",{style:{fontWeight:700},children:["C$",U(ge)]})]}),e.jsxs(q,{className:"grand-total",$bold:!0,style:{fontSize:"1.3em",borderTop:"2px solid #000",marginTop:5,paddingTop:5,color:"#28a745"},children:[e.jsx("span",{style:{fontWeight:900},children:"ABONÓ:"}),e.jsxs("span",{style:{fontWeight:900},children:["C$",U(ee)]})]}),e.jsxs(q,{$bold:!0,style:{fontSize:"1.1em",borderTop:"2px dashed #000",marginTop:5,paddingTop:5,color:se>0?"#dc3545":"#28a745"},children:[e.jsx("span",{style:{fontWeight:900},children:"Saldo Pendiente:"}),e.jsxs("span",{style:{fontWeight:900},children:["C$",U(se)]})]})]}):e.jsxs(e.Fragment,{children:[e.jsxs(q,{children:[e.jsx("span",{style:{fontWeight:700},children:"Subtotal:"}),e.jsxs("span",{style:{fontWeight:700},children:["C$",U(V)]})]}),F>0&&e.jsxs(q,{style:{color:"#dc3545"},children:[e.jsx("span",{style:{fontWeight:700},children:"Descuento:"}),e.jsxs("span",{style:{fontWeight:700},children:["- C$",U(F)]})]}),e.jsxs(q,{className:"grand-total",$bold:!0,style:{fontSize:"1.3em",borderTop:"2px solid #000",marginTop:5,paddingTop:5},children:[e.jsx("span",{style:{fontWeight:900},children:"TOTAL:"}),e.jsxs("span",{style:{fontWeight:900},children:["C$",U(B)]})]}),!u&&e.jsxs(e.Fragment,{children:[e.jsxs(q,{style:{marginTop:10,fontSize:"0.9em"},children:[e.jsx("span",{style:{fontWeight:700},children:"Pagado:"}),e.jsxs("span",{style:{fontWeight:700},children:["C$",U(fe)]})]}),R>0&&e.jsxs(q,{$bold:!0,style:{color:"#dc3545",fontWeight:900},children:[e.jsx("span",{children:"Cambio:"}),e.jsxs("span",{children:["C$",U(R)]})]})]})]})})}),e.jsxs("div",{className:"footer-sign no-show-80",children:[e.jsx("div",{className:"sign-box",children:"Entregado por"}),e.jsx("div",{className:"sign-box",children:"Recibido por"})]}),e.jsxs("div",{className:"thanks",children:[e.jsx("p",{children:e.jsxs("strong",{children:['"',W.slogan,'"']})}),e.jsx("p",{style:{whiteSpace:"pre-line",marginTop:"5px"},children:u?(l==null?void 0:l.ticket_proforma_footer)||"Cotización válida por 15 días.":M?(l==null?void 0:l.ticket_transfer_footer)||"Salida de Inventario.":(l==null?void 0:l.ticket_sales_footer)||"¡Gracias por su compra!"})]})]})})]})]})},G=t=>Number(t||0).toFixed(2),mn=(t,r=0)=>(t==null?void 0:t.nombre)??(t==null?void 0:t.name)??(t==null?void 0:t.producto)??(t==null?void 0:t.descripcion)??`Item ${r+1}`,it=p.div`
  border-left: 1px solid #e9ecef; padding-left: 1.5rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1.2rem;
`,ve=p.div`
  background-color: #fff; border: 1px solid #e9ecef; border-radius: 8px; padding: 1.2rem;
  h4 { margin-top: 0; margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem; color: #495057; }
`,xn=p.table`
  width: 100%; border-collapse: collapse; font-size: 0.9rem;
  th, td { padding: 0.6rem; text-align: left; border-bottom: 1px solid #f1f1f1; }
  th { font-weight: 600; color: #6c757d; }
  td:nth-child(3), td:nth-child(4) { text-align: right; }
`,H=p.div`
  display: flex; justify-content: space-between; padding: 0.4rem 0; font-size: 0.95rem; font-weight: ${t=>t.$bold?"600":"normal"};
  border-top: ${t=>t.$bordered?"1px dashed #ccc":"none"}; color: ${t=>t.color||"inherit"};
  span:first-child { color: #6c757d; }
`,fn=p.div`
  display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1rem;
`,st=p.span`
  font-weight: bold; padding: 0.25rem 0.5rem; border-radius: 4px; color: white; background-color: ${t=>t.color};
`,gn=({sale:t,client:r,creditStatus:m,dailySales:x,isAdmin:w,onOpenAbonoModal:h,onCancelSale:d,onReturnItem:N,onReprintTicket:b,showConfirmation:L,showPrompt:j,showAlert:l})=>{var M;const A=s.useMemo(()=>!(!t||t.estado!=="COMPLETADA"),[t]);if(!t)return e.jsx(it,{style:{justifyContent:"center",alignItems:"center"},children:e.jsxs(Te,{children:[e.jsx(kt,{})," Seleccione una transacción de la lista para ver sus detalles."]})});const I={COMPLETADA:{text:"COMPLETADA",color:"#28a745"},CANCELADA:{text:"CANCELADA",color:"#dc3545"},DEVOLUCION:{text:"DEVOLUCIÓN",color:"#ffc107"},ABONO_CREDITO:{text:"ABONO A CRÉDITO",color:"#17a2b8"}}[t.estado]||{text:t.estado,color:"#6c757d"},i=t.estado==="COMPLETADA",S=(c,f)=>{if(A){if(!N){l==null||l({title:"Config",message:"Falta onReturnItem en props.",type:"error"});return}N(c,f)}},u=()=>{if(A){if(!d){l==null||l({title:"Config",message:"Falta onCancelSale en props.",type:"error"});return}d(t)}};return e.jsxs(it,{children:[e.jsxs("h3",{children:["Detalle de Transacción #",t.id]}),r&&m&&e.jsxs(Te,{$type:"info",style:{flexDirection:"column",alignItems:"stretch",gap:"1rem"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("span",{style:{fontWeight:"bold"},children:["Estado de Cuenta: ",r.nombre]}),e.jsxs($,{$primary:!0,onClick:h,disabled:m.currentBalance<=0,children:[e.jsx(Ye,{})," Registrar Abono"]})]}),e.jsxs(H,{$bold:!0,color:m.currentBalance>0?"#dc3545":"#28a745",children:[e.jsx("span",{children:"SALDO PENDIENTE TOTAL:"}),e.jsxs("span",{children:["C$",m.currentBalance.toFixed(2)]})]})]}),e.jsxs(ve,{children:[e.jsxs("p",{children:[e.jsxs("strong",{children:[e.jsx(Qe,{})," Cliente:"]})," ",(r==null?void 0:r.nombre)||"Cliente Genérico"]}),e.jsxs("p",{children:[e.jsxs("strong",{children:[e.jsx(lt,{})," Fecha:"]})," ",new Date(t.fecha).toLocaleString("es-NI")]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("p",{style:{margin:0},children:[e.jsx("strong",{children:"Estado:"})," ",e.jsx(st,{color:I.color,children:I.text})]}),(((M=t.pagoDetalles)==null?void 0:M.isWholesale)||t.isWholesale)&&e.jsx(st,{color:"#8b5cf6",children:"VENTA MAYORISTA"})]})]}),i&&e.jsxs(e.Fragment,{children:[Array.isArray(t.items)&&t.items.length>0&&e.jsxs(ve,{children:[e.jsx("h4",{children:"Productos"}),e.jsxs(xn,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Producto"}),e.jsx("th",{children:"Cant."}),e.jsx("th",{children:"P. Unit."}),e.jsx("th",{children:"Subtotal"}),e.jsx("th",{})]})}),e.jsx("tbody",{children:t.items.map((c,f)=>e.jsxs("tr",{children:[e.jsx("td",{children:mn(c,f)}),e.jsx("td",{children:(c==null?void 0:c.quantity)??(c==null?void 0:c.cantidad)??0}),e.jsxs("td",{children:["C$",G(c==null?void 0:c.precio)]}),e.jsxs("td",{children:["C$",G(((c==null?void 0:c.quantity)??(c==null?void 0:c.cantidad)??0)*((c==null?void 0:c.precio)??0))]}),e.jsx("td",{children:A&&e.jsx($,{$warning:!0,$small:!0,onClick:()=>S(c,f),title:"Devolver",children:e.jsx(St,{})})})]},(c&&(c.id_producto||c.id))??f))})]})]}),e.jsxs(ve,{children:[e.jsx("h4",{children:"Resumen Financiero de esta Venta"}),t.subtotal!==void 0&&e.jsxs(H,{children:[e.jsx("span",{children:"Subtotal:"}),e.jsxs("span",{children:["C$",G(t.subtotal)]})]}),t.descuento>0&&e.jsxs(H,{children:[e.jsx("span",{children:"Descuento:"}),e.jsxs("span",{style:{color:"#dc3545"},children:["- C$",G(t.descuento)]})]}),e.jsxs(H,{$bold:!0,$bordered:!0,children:[e.jsx("span",{children:"Total Transacción:"}),e.jsxs("span",{children:["C$",G(Math.abs(t.totalVenta))]})]}),t.pagoDetalles&&e.jsxs("div",{style:{marginTop:"1rem"},children:[e.jsx("h5",{style:{marginBottom:"0.5rem",fontSize:"1rem"},children:"Detalle del Pago:"}),t.pagoDetalles.efectivo>0&&e.jsxs(H,{children:[e.jsxs("span",{children:[e.jsx(Ye,{})," Efectivo Recibido:"]}),e.jsxs("span",{children:["C$",G(t.pagoDetalles.efectivo)]})]}),t.pagoDetalles.tarjeta>0&&e.jsxs(e.Fragment,{children:[e.jsxs(H,{children:[e.jsxs("span",{children:[e.jsx($t,{})," Tarjeta:"]}),e.jsxs("span",{children:["C$",G(t.pagoDetalles.tarjeta)]})]}),t.pagoDetalles.referenciaTarjeta&&e.jsxs(H,{style:{fontSize:"0.85rem",color:"#666",paddingLeft:"1.5rem"},children:[e.jsx("span",{children:"↳ Ref:"}),e.jsx("span",{children:t.pagoDetalles.referenciaTarjeta})]})]}),t.pagoDetalles.transferencia>0&&e.jsxs(e.Fragment,{children:[e.jsxs(H,{children:[e.jsxs("span",{children:[e.jsx(dt,{})," Transferencia:"]}),e.jsxs("span",{children:["C$",G(t.pagoDetalles.transferencia)]})]}),t.pagoDetalles.referenciaTransferencia&&e.jsxs(H,{style:{fontSize:"0.85rem",color:"#666",paddingLeft:"1.5rem"},children:[e.jsx("span",{children:"↳ Ref:"}),e.jsx("span",{children:t.pagoDetalles.referenciaTransferencia})]})]}),t.pagoDetalles.credito>0&&e.jsxs(H,{children:[e.jsxs("span",{children:[e.jsx(Qe,{})," Crédito Otorgado:"]}),e.jsxs("span",{style:{color:"#dc3545"},children:["C$",G(t.pagoDetalles.credito)]})]}),t.pagoDetalles.vuelto>0&&e.jsxs(H,{children:[e.jsx("span",{children:"Vuelto Entregado:"}),e.jsxs("span",{children:["- C$",G(t.pagoDetalles.vuelto)]})]})]})]})]}),t.estado!=="CANCELADA"&&e.jsxs(ve,{children:[e.jsx("h4",{children:"Acciones"}),e.jsxs(fn,{children:[e.jsxs($,{onClick:b,children:[e.jsx(_e,{})," Reimprimir Ticket"]}),A&&e.jsxs($,{$cancel:!0,onClick:u,children:[e.jsx(At,{})," Cancelar Venta"]})]})]})]})},hn=Q.memo(gn),Ne=()=>{const t=new Date,r=t.toLocaleString("en-US",{year:"numeric",timeZone:"America/Managua"}),m=t.toLocaleString("en-US",{month:"2-digit",timeZone:"America/Managua"}),x=t.toLocaleString("en-US",{day:"2-digit",timeZone:"America/Managua"});return`${r}-${m}-${x}`},Me=t=>new Intl.NumberFormat("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(t||0)),un=t=>{if(!t)return{label:"N/A",icon:null};const{efectivo:r,tarjeta:m,transferencia:x,credito:w}=t;if(Number(w)>0)return{label:"Crédito",icon:e.jsx(Xe,{style:{color:"#dc3545"}})};const h=[];if(Number(r)>0&&h.push("Efectivo"),Number(m)>0&&h.push("Tarjeta"),Number(x)>0&&h.push("Transferencia"),h.length===1){const d=h[0];return d==="Efectivo"?{label:"Efectivo",icon:e.jsx(De,{style:{color:"#28a745"}})}:d==="Tarjeta"?{label:"Tarjeta",icon:e.jsx(Xe,{style:{color:"#007bff"}})}:{label:"Transferencia",icon:e.jsx(dt,{style:{color:"#007bff"}})}}return h.length>1?{label:"Mixto",icon:e.jsx(De,{style:{color:"#ffc107"}})}:{label:"Contado",icon:e.jsx(De,{style:{color:"#28a745"}})}},ke=(t,r=0)=>(t==null?void 0:t.nombre)??(t==null?void 0:t.name)??(t==null?void 0:t.producto)??(t==null?void 0:t.descripcion)??`Item ${r+1}`,bn=p(Pe)`
  width: 95%;
  max-width: 1400px;
  height: 90vh;
  display: flex;
  flex-direction: column;
  padding: 1.25rem;

  @media (max-width: 768px) {
    height: 95vh;
    padding: 1rem;
  }
`,jn=p.div`
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid #dee2e6;
  h2 { display: flex; align-items: center; gap: .5rem; margin: 0; }
`,yn=p.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(180px, 1fr));
  gap: .75rem 1rem; margin-bottom: 1rem;

  @media (max-width: 1100px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 520px) { grid-template-columns: 1fr; }

  label { display: block; font-size: .9rem; color: #6c757d; margin-bottom: .25rem; }
`,Cn=p.div`
  display: grid; grid-template-columns: 380px 1fr; gap: 1rem; flex: 1; min-height: 0;
  @media (max-width: 1024px) { grid-template-columns: 1fr; }
`,wn=p.div`
  background: #f8f9fa; border-radius: 12px; padding: .75rem; display: flex;
  flex-direction: column; min-height: 0;
`,Se=p.div`
  background: #fff; border-radius: 12px; padding: 1rem; min-height: 0;
  box-shadow: 0 2px 10px rgba(0,0,0,.06);
`,vn=p.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: .5rem;
  small { color: #6c757d; }
`,Nn=p.div`
  flex: 1; overflow: auto; padding-right: 4px; min-height: 200px;
`,kn=p.div`
  display: flex; justify-content: center; align-items: center; gap: .75rem;
  padding-top: .5rem; border-top: 1px solid #e9ecef;
`,Sn=p.div`
  padding: .7rem .8rem; border-left: 5px solid ${t=>t.$borderColor||"#6c757d"};
  border-radius: 8px; background: ${t=>t.selected?"#e9f2ff":"#fff"};
  box-shadow: 0 1px 3px rgba(0,0,0,.05);
  margin-bottom: .6rem; cursor: pointer; transition: box-shadow .15s, background .15s;

  &:hover { box-shadow: 0 2px 6px rgba(0,0,0,.1); }

  .top {
    display: flex; justify-content: space-between; gap: .75rem; font-weight: 700; font-size: .95rem;
    word-break: break-word;
  }
  .sub { color: #6c757d; font-size: .82rem; margin-top: 2px; }
`,pt=p.span`
  display: inline-flex; align-items: center; justify-content: center;
  border-radius: 9999px; padding: .25rem .6rem; font-weight: 700; font-size: .8rem;
  ${t=>t.$green&&xe`background:#e8f7ee; color:#198754;`}
  ${t=>t.$red&&xe`background:#fdecec; color:#dc3545;`}
`,$n=Q.memo(function({sale:r,isSelected:m,onSelect:x,safeUsers:w,safeClients:h}){var z;const d={COMPLETADA:"#28a745",CANCELADA:"#dc3545",DEVOLUCION:"#ffc107",ABONO_CREDITO:"#17a2b8"},N=s.useMemo(()=>{var i,S;return((i=(w||[]).find(u=>((u==null?void 0:u.id_usuario)??(u==null?void 0:u.id))==(r==null?void 0:r.userId)))==null?void 0:i.nombre_usuario)||((S=r==null?void 0:r.usuario)==null?void 0:S.nombre_usuario)||(r==null?void 0:r.userName)||(r==null?void 0:r.vendedor)||"N/A"},[w,r]),b=s.useMemo(()=>{var i,S;return((i=(h||[]).find(u=>(u==null?void 0:u.id_cliente)===((r==null?void 0:r.clientId)||(r==null?void 0:r.idCliente))))==null?void 0:i.nombre)||((S=r==null?void 0:r.cliente)==null?void 0:S.nombre)||(r==null?void 0:r.clientName)||"Consumidor Final"},[h,r]),L=Number(r.totalVenta??r.total_venta??r.total??0),j=un(r.pagoDetalles),l=r.estado==="ABONO_CREDITO"?e.jsxs(e.Fragment,{children:[e.jsx(ct,{style:{marginRight:6}})," ABONO"]}):e.jsxs(e.Fragment,{children:["#",r.id," - ",r.estado.replace("_"," ")]}),A=((z=r.pagoDetalles)==null?void 0:z.isWholesale)||r.isWholesale;return e.jsxs(Sn,{onClick:()=>x(r),selected:m,$borderColor:d[r.estado]||"#6c757d",title:`Venta #${r.id}`,children:[e.jsxs("div",{className:"top",children:[e.jsx("span",{children:l}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[A&&e.jsx(pt,{style:{background:"#8b5cf6",color:"white",fontSize:"0.7rem"},children:"MAYORISTA"}),e.jsxs("span",{children:[j.icon," C$",Me(Math.abs(L))]})]})]}),e.jsxs("div",{className:"sub",children:[new Date(r.fecha).toLocaleString("es-NI")," · Cliente: ",e.jsx("strong",{children:b})," · Vendedor: ",N]})]})}),ze=10;function An({dailySales:t=[],loadSales:r,onClose:m,isAdmin:x,users:w=[],clients:h=[],onReprintTicket:d,onCancelSale:N,onReturnItem:b,onAbonoSuccess:L,initialClientId:j=null}){var Be,We,qe,He,Ue,Ge;const[l,A]=s.useState(Ne()),[z,I]=s.useState(Ne()),[i,S]=s.useState(Array.isArray(t)?t:[]),[u,M]=s.useState(!1),[c,f]=s.useState(""),[K,O]=s.useState(""),[D,oe]=s.useState(""),[_,re]=s.useState(1),[v,ae]=s.useState(j),X=s.useMemo(()=>Array.isArray(w)?w:[],[w]),E=s.useMemo(()=>Array.isArray(h)?h:[],[h]);s.useEffect(()=>{ae(j)},[j]),s.useEffect(()=>{if(v){const n=E.find(a=>a.id_cliente===v);n?(f(n.nombre),I("")):f(String(v))}},[v,E]);const[o,y]=s.useState(null),[V,F]=s.useState(!1),[B,ie]=s.useState({open:!1,title:"",message:""}),T=(n,a)=>ie({open:!0,title:n,message:a}),fe=()=>ie({open:!1,title:"",message:""}),[R,ee]=s.useState({open:!1,title:"",message:"",onConfirm:null}),se=(n,a,C)=>ee({open:!0,title:n,message:a,onConfirm:C}),ge=()=>ee({open:!1,title:"",message:"",onConfirm:null}),[le,je]=s.useState({open:!1,title:"",message:"",initialValue:"1",onConfirm:null}),W=(n,a,C,P)=>je({open:!0,title:n,message:a,initialValue:String(C??"1"),onConfirm:P}),te=()=>je({open:!1,title:"",message:"",initialValue:"1",onConfirm:null}),de=s.useCallback(async(n=null,a=null)=>{if(!r)return[];M(!0),A(n);try{const C=await r(n,a),P=Array.isArray(C)?C:[];return S(P),P}catch(C){return S([]),T("Error","No se pudieron cargar las transacciones: "+(C.message||"Error de conexión.")),[]}finally{M(!1)}},[r]);s.useEffect(()=>{const a=c&&c.length>=2||v&&!z?null:z;de(a,v),re(1),y(null)},[z,de,c,v]),s.useEffect(()=>{z===Ne()&&Array.isArray(t)&&!c&&!v&&S(t)},[t,z,c,v]);const he=s.useMemo(()=>{let n=(i||[]).map(a=>{var Y;const C=a.clientId||a.idCliente,P=((Y=E.find(Ie=>Ie.id_cliente===C))==null?void 0:Y.nombre)||"Consumidor Final";return{...a,_clientName:P,_idStr:String(a.id)}});return v&&(n=n.filter(a=>(a.clientId||a.idCliente)===v)),K&&(n=n.filter(a=>String(a.userId)===String(K))),D&&(n=n.filter(a=>a.estado===D)),c&&!v&&(n=Vt(n,c,["_idStr","_clientName"])),n.sort((a,C)=>new Date(C.fecha)-new Date(a.fecha))},[i,K,D,c,E,v]),g=Math.max(1,Math.ceil(he.length/ze)),ce=(_-1)*ze,Z=he.slice(ce,ce+ze);s.useEffect(()=>{(!o||!Z.some(n=>n.id===o.id))&&y(Z[0]||null)},[Z,o]);const J=s.useCallback(async(n=null)=>{const a=await de(l,v);if(n){const C=(a||[]).find(P=>String(P.id)===String(n));y(C||null)}else y(null)},[de,l,v]),ye=s.useCallback(n=>{const a=typeof n=="object"&&(n!=null&&n.id)?n.id:n||(o==null?void 0:o.id),C=typeof n=="object"&&n?n:o;if(!(!a||!C)){if(C.estado==="CANCELADA"){T("Venta ya cancelada",`La venta #${a} ya fue cancelada.`);return}if(!N){T("Error de Configuración","onCancelSale no fue proporcionada.");return}se("Cancelar Venta",`¿Seguro que deseas cancelar la venta #${a}? Esta acción revierte inventario y no se puede deshacer.`,async()=>{ge();try{await N(C),T("Éxito",`Venta #${a} cancelada.`),await J(null)}catch(P){T("Error al Cancelar",P.message||"No se pudo cancelar la venta.")}})}},[o,N,J]),ne=s.useCallback((n,a=0)=>{if(!o)return;if(!b){T("Error de Configuración","onReturnItem no fue proporcionada.");return}const C=Number((n==null?void 0:n.quantity)||(n==null?void 0:n.cantidad)||0);if(!Number.isFinite(C)||C<=0){T("No se puede devolver","Este artículo no tiene cantidad disponible para devolver.");return}W("Devolver producto",`Cantidad a devolver para "${ke(n,a)}" (máx. ${C})`,"1",async P=>{const Y=Number(P);if(!Number.isFinite(Y)||Y<=0||Y>C){T("Cantidad inválida",`Ingresa un número entre 1 y ${C}.`);return}const Ie=o.items.length===1&&Y===C,Ze=async()=>{try{await b(o,n,Y),T("Éxito",`Se devolvieron ${Y} unidad(es) de ${ke(n,a)}.`),await J(null)}catch(Ce){const Je=((Ce==null?void 0:Ce.message)||"").toLowerCase(),ht=Je.includes("not found")||Je.includes("404")?"Ruta de API no encontrada.":Ce.message||"No se pudo devolver el producto.";T("Error al Devolver",ht)}};if(Ie){te(),setTimeout(()=>{ee({open:!0,title:"¿Cancelar Venta Completa?",message:`Este es el ÚLTIMO artículo de la venta. 

¿Prefieres CANCELAR toda la venta en lugar de hacer una devolución individual?
(Esto revertirá todo el ticket).`,onConfirm:async()=>{ee({open:!1,title:"",message:"",onConfirm:null}),N&&ye(o.id)},onClose:()=>{ee({open:!1,title:"",message:"",onConfirm:null}),Ze()}})},100);return}await Ze()})},[o,b,J]),pe=s.useCallback(()=>{o&&(d==null||d(o))},[o,d]),[Oe,Ve]=s.useState(!1),xt=s.useCallback(async()=>{if(!o||o.estado!=="ABONO_CREDITO")return;const n=o.clientId||o.idCliente;if(!n){T("Error","No se pudo identificar el cliente.");return}se("Cancelar Abono",`¿Estás seguro de cancelar este abono #${o.id}? Se restaurará el saldo del cliente.`,async()=>{ge(),Ve(!0);try{const a=localStorage.getItem("token");await Pt(n,o.id,a),Rt.success("Abono cancelado exitosamente."),await J(null)}catch(a){T("Error",a.message||"No se pudo cancelar el abono.")}finally{Ve(!1)}})},[o,J]),ft=he.length,gt=Z.length;return e.jsxs(Ae,{"data-history-modal":!0,children:[e.jsxs(bn,{children:[e.jsxs(jn,{children:[e.jsxs("h2",{children:[e.jsx(Ke,{})," ",v?`Historial de ${((Be=E.find(n=>n.id_cliente===v))==null?void 0:Be.nombre)||"Cliente"}`:"Historial de Transacciones"]}),e.jsx($,{$cancel:!0,onClick:m,children:e.jsx($e,{})})]}),e.jsxs(yn,{children:[e.jsxs("div",{children:[e.jsxs("label",{children:[e.jsx(Tt,{})," Buscar ID/Cliente:"]}),v?e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",background:"#e9f2ff",border:"1px solid #b3d7ff",borderRadius:"8px",padding:"0.4rem 0.75rem",height:"38px",boxSizing:"border-box"},children:[e.jsx("span",{style:{fontSize:"0.9rem",color:"#0056b3",fontWeight:"bold",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1},children:((We=E.find(n=>n.id_cliente===v))==null?void 0:We.nombre)||"Cliente seleccionado"}),e.jsx("button",{onClick:()=>{ae(null),f(""),I(Ne())},style:{background:"none",border:"none",color:"#dc3545",cursor:"pointer",display:"flex",alignItems:"center",padding:"2px"},title:"Quitar filtro de cliente",children:e.jsx($e,{size:16})})]}):e.jsx(we,{type:"text",placeholder:"ID o nombre",value:c,onChange:n=>f(n.target.value)})]}),e.jsxs("div",{children:[e.jsxs("label",{children:[e.jsx(lt,{})," Fecha:"]}),e.jsx(we,{type:"date",value:z,onChange:n=>I(n.target.value)})]}),x&&e.jsxs("div",{children:[e.jsxs("label",{children:[e.jsx(It,{})," Usuario:"]}),e.jsxs(we,{as:"select",value:K,onChange:n=>O(n.target.value),children:[e.jsx("option",{value:"",children:"Todos"}),X.map(n=>e.jsx("option",{value:n.id_usuario??n.id,children:n.nombre_usuario??n.nombre},n.id_usuario??n.id))]})]}),e.jsxs("div",{children:[e.jsxs("label",{children:[e.jsx(Dt,{})," Estado:"]}),e.jsxs(we,{as:"select",value:D,onChange:n=>oe(n.target.value),children:[e.jsx("option",{value:"",children:"Todos"}),e.jsx("option",{value:"COMPLETADA",children:"Completadas"}),e.jsx("option",{value:"CANCELADA",children:"Canceladas"}),e.jsx("option",{value:"DEVOLUCION",children:"Devoluciones"}),e.jsx("option",{value:"ABONO_CREDITO",children:"Abonos"})]})]})]}),e.jsxs(Cn,{children:[e.jsxs(wn,{children:[e.jsxs(vn,{children:[e.jsx("small",{children:c?e.jsx("strong",{children:"Mostrando historial de búsqueda"}):`Resultados: ${ft}`}),e.jsxs(pt,{$green:!0,children:["Mostrando ",gt]})]}),u&&e.jsx(Te,{style:{textAlign:"center",margin:".5rem 0"},children:"Cargando transacciones…"}),!u&&e.jsx(Nn,{children:Z.length?Z.map(n=>e.jsx($n,{sale:n,isSelected:(o==null?void 0:o.id)===n.id,onSelect:y,safeUsers:X,safeClients:E},n.id)):e.jsx("p",{style:{textAlign:"center",color:"#6c757d",marginTop:"1rem"},children:"No se encontraron transacciones para la fecha y filtros seleccionados."})}),g>1&&e.jsxs(kn,{children:[e.jsx($,{onClick:()=>re(n=>Math.max(1,n-1)),disabled:_===1,title:"Anterior",children:e.jsx(Et,{})}),e.jsxs("span",{children:["Página ",_," de ",g]}),e.jsx($,{onClick:()=>re(n=>Math.min(g,n+1)),disabled:_===g,title:"Siguiente",children:e.jsx(Ft,{})})]})]}),o?o.estado==="ABONO_CREDITO"?e.jsxs(Se,{children:[e.jsxs("div",{style:{borderBottom:"2px dashed #ccc",paddingBottom:15,marginBottom:15},children:[e.jsxs("h3",{style:{margin:0,fontSize:"1.4rem",color:"#17a2b8",textAlign:"center"},children:[e.jsx(ct,{})," Recibo de Abono"]}),e.jsxs("p",{style:{textAlign:"center",color:"#555",margin:"5px 0"},children:["#",o.id]})]}),e.jsx(Te,{children:e.jsxs("div",{style:{display:"grid",gap:10},children:[e.jsxs(q,{children:[e.jsx("span",{children:"Fecha:"}),e.jsx("strong",{children:new Date(o.fecha).toLocaleString("es-NI")})]}),e.jsxs(q,{children:[e.jsx("span",{children:"Cliente:"}),e.jsx("strong",{style:{fontSize:"1.1rem"},children:((qe=E.find(n=>n.id_cliente===(o.clientId||o.idCliente)))==null?void 0:qe.nombre)||"Desconocido"})]}),e.jsxs(q,{children:[e.jsx("span",{children:"Cajero:"}),e.jsx("strong",{children:((He=X.find(n=>(n.id_usuario??n.id)==o.userId))==null?void 0:He.nombre_usuario)||o.usuarioNombre||"Sistema"})]})]})}),e.jsx("div",{style:{margin:"20px 0",border:"1px solid #ddd",padding:15,borderRadius:8,background:"#f8f9fa"},children:e.jsxs(q,{style:{fontSize:"1.2rem",color:"#28a745"},children:[e.jsx("span",{children:"Monto Abonado:"}),e.jsxs("strong",{children:["C$ ",Me(o.totalVenta)]})]})}),e.jsxs("div",{style:{display:"flex",justifyContent:"center",gap:"12px",marginTop:20},children:[e.jsxs($,{onClick:pe,style:{fontSize:"1.1rem",padding:"10px 20px"},children:[e.jsx(_e,{})," Imprimir Comprobante"]}),e.jsxs($,{onClick:xt,disabled:Oe,style:{fontSize:"1rem",padding:"10px 20px",background:"#dc3545",color:"white",border:"none",fontWeight:700},children:[e.jsx(zt,{})," ",Oe?"Cancelando...":"Cancelar Abono"]})]})]}):o.estado==="DEVOLUCION"?e.jsxs(Se,{children:[e.jsxs("h3",{style:{marginTop:0},children:["Detalle de Transacción #",o.id]}),e.jsxs("div",{className:"box",style:{marginTop:10},children:[e.jsxs("p",{children:[e.jsx("strong",{children:"Cliente:"})," ",((Ue=E.find(n=>n.id_cliente===(o.clientId||o.idCliente)))==null?void 0:Ue.nombre)||"Consumidor Final"]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Fecha:"})," ",new Date(o.fecha).toLocaleString("es-NI")]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Estado:"})," ",e.jsx("span",{style:{background:"#fff3cd",color:"#856404",padding:"2px 8px",borderRadius:8,fontWeight:700},children:"DEVOLUCIÓN"})]})]}),e.jsxs("div",{className:"box",style:{marginTop:10},children:[e.jsx("h4",{style:{marginTop:0},children:"Detalle de Devolución"}),e.jsx("ul",{style:{margin:0,paddingLeft:18},children:(o.items||[]).map((n,a)=>e.jsxs("li",{children:[e.jsx("strong",{children:ke(n,a)})," ","— ",Number(n.quantity||n.cantidad||0)," u. @ C$",Number(n.precio||n.precio_unitario||0).toFixed(2)]},`${n.id||n.id_producto}-${a}`))}),e.jsxs("p",{style:{marginTop:8},children:["Importe devuelto:"," ",e.jsxs("strong",{children:["C$",(()=>{const n=Number(o.totalVenta??o.total_venta??o.total??0);return Math.abs(n).toFixed(2)})()]})]})]}),e.jsx("div",{style:{display:"flex",justifyContent:"flex-start",gap:10,marginTop:12},children:e.jsx($,{onClick:pe,children:"Reimprimir Ticket"})})]}):o.estado==="CANCELADA"?e.jsxs(Se,{children:[e.jsxs("h3",{style:{marginTop:0,color:"#dc3545"},children:["Detalle de Venta Cancelada #",o.id]}),e.jsxs("div",{className:"box",style:{marginTop:10},children:[e.jsxs("p",{children:[e.jsx("strong",{children:"Cliente:"})," ",((Ge=E.find(n=>n.id_cliente===(o.clientId||o.idCliente)))==null?void 0:Ge.nombre)||"Consumidor Final"]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Fecha:"})," ",new Date(o.fecha).toLocaleString("es-NI")]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Estado:"})," ",e.jsx("span",{style:{background:"#f8d7da",color:"#721c24",padding:"2px 8px",borderRadius:8,fontWeight:700},children:"CANCELADA"})]})]}),e.jsxs("div",{className:"box",style:{marginTop:10},children:[e.jsx("h4",{style:{marginTop:0},children:"Productos Cancelados"}),!o.items||o.items.length===0?e.jsx("p",{style:{color:"#6c757d",fontStyle:"italic"},children:"No hay detalles de productos disponibles."}):e.jsx("ul",{style:{margin:0,paddingLeft:18,color:"#6c757d"},children:o.items.map((n,a)=>e.jsxs("li",{children:[e.jsx("strong",{children:ke(n,a)})," ","— ",Number(n.quantity||n.cantidad||0)," u."]},`${n.id||n.id_producto}-${a}`))}),e.jsxs("p",{style:{marginTop:8,color:"#dc3545",textDecoration:"line-through"},children:["Total Anulado: ",e.jsxs("strong",{children:["C$ ",Me(o.totalVenta)]})]})]}),e.jsx("div",{style:{display:"flex",justifyContent:"flex-start",gap:10,marginTop:12},children:e.jsx($,{onClick:pe,children:"Reimprimir Comprobante"})})]}):e.jsx(hn,{sale:o,client:E.find(n=>n.id_cliente===(o.clientId||o.idCliente)),creditStatus:null,dailySales:i,isAdmin:x,onOpenAbonoModal:()=>F(!0),onCancelSale:n=>ye(n),onReturnItem:(n,a)=>ne(n,a),onReprintTicket:pe,showConfirmation:({onConfirm:n})=>se("Confirmación","¿Confirmar acción?",n),showPrompt:({title:n,message:a,defaultValue:C,onConfirm:P})=>W(n,a,C,P),showAlert:({title:n,message:a})=>T(n,a)}):e.jsx(Se,{children:e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",color:"#aaa",fontStyle:"italic",flexDirection:"column"},children:[e.jsx(Ke,{size:40,style:{marginBottom:10,opacity:.5}}),e.jsx("p",{children:"Seleccione una transacción para ver detalles"})]})})]}),V&&o&&e.jsx(Xt,{client:E.find(n=>n.id_cliente===(o.clientId||o.idCliente)),onClose:()=>F(!1),onAbonoSuccess:async()=>{F(!1),await J(o.id),L==null||L()},showAlert:({title:n,message:a})=>T(n,a)})]}),e.jsx(Ot,{isOpen:B.open,onClose:fe,title:B.title,message:B.message}),e.jsx(Tn,{isOpen:!!R.open,title:R.title,message:R.message,onCancel:ge,onConfirm:R.onConfirm||ge}),e.jsx(In,{isOpen:!!le.open,title:le.title,message:le.message,initialValue:le.initialValue,onCancel:te,onConfirm:n=>{const a=le.onConfirm;te(),a&&a(n)}})]})}const mt=({isOpen:t,children:r,maxWidth:m=450})=>t?e.jsx(Ae,{style:{zIndex:99999,backgroundColor:"rgba(0,0,0,0.6)"},children:e.jsx(Pe,{style:{maxWidth:`${m}px`,textAlign:"center"},children:r})}):null,Tn=({isOpen:t,title:r,message:m,onCancel:x,onConfirm:w})=>e.jsxs(mt,{isOpen:t,children:[e.jsx("h2",{style:{marginTop:0},children:r}),e.jsx("p",{style:{color:"#6c757d",lineHeight:1.5},children:m}),e.jsxs("div",{style:{display:"flex",justifyContent:"center",gap:10,marginTop:10},children:[e.jsx($,{onClick:x,$cancel:!0,children:"Cancelar"}),e.jsx($,{onClick:w,primary:!0,children:"Aceptar"})]})]}),In=({isOpen:t,title:r,message:m,initialValue:x="1",inputType:w="number",onCancel:h,onConfirm:d})=>{const[N,b]=s.useState(x);return s.useEffect(()=>{b(x)},[x,t]),e.jsxs(mt,{isOpen:t,children:[e.jsx("h2",{style:{marginTop:0},children:r}),m&&e.jsx("p",{style:{color:"#6c757d"},children:m}),e.jsx("input",{style:{width:"100%",padding:".6rem",borderRadius:8,border:"1px solid #dee2e6",margin:"8px 0 14px"},type:w,value:N,onChange:L=>b(L.target.value)}),e.jsxs("div",{style:{display:"flex",justifyContent:"center",gap:10},children:[e.jsx($,{onClick:h,$cancel:!0,children:"Cancelar"}),e.jsx($,{onClick:()=>d(N),primary:!0,children:"Aceptar"})]})]})},Mn=Q.memo(An);export{Xt as A,Mn as S,Ln as T};

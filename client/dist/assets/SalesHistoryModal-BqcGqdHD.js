import{R as Z,r as s,j as e,n as ct,J as pt,a9 as mt,D as xt,s as p,v as ht,x as Me,aO as ft,ae as Pe,C as gt,q as ut,ad as ie,b5 as bt,a_ as Ue,h as Ge,b6 as rt,b7 as jt,K as yt,aV as at,ai as Ct,Y as Je,Z as wt,S as vt,b8 as Nt,b9 as kt,ba as St,aW as it,bb as Ze,af as De}from"./vendor-B-pOHZxB.js";import{M as $e,B as A,f as O,a as Oe,I as Ae,S as ve}from"./POS.styles-Bz1HfwTU.js";import{u as Re,T as $t,i as At,a as Tt}from"./index-C9q57MBf.js";import{A as Dt}from"./AlertModal-DN-lJRTs.js";const It=p.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1050;
  backdrop-filter: blur(5px);
`,Et=p.div`
  background: white; padding: 2rem; border-radius: 12px; width: 560px; max-width: 95%; max-height: 90vh; overflow-y: auto;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  animation: fadeIn 0.3s ease-out;
  @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
`,Ft=p.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;
  border-bottom: 1px solid #e9ecef; padding-bottom: 1rem;
`,Lt=p.h2`margin: 0; font-size: 1.5rem; color: #333;`,Mt=p.button`
  border: none; background: none; font-size: 1.5rem; cursor: pointer; color: #888;
  &:hover { color: #333; }
`,Rt=p.form`display: flex; flex-direction: column; gap: 1.25rem;`,Ie=p.div`display: flex; flex-direction: column; gap: 0.5rem;`,Ee=p.label`font-weight: 600; color: #495057; font-size: 0.9rem;`,ze=p.input`
  padding: 0.75rem; border: 1px solid #ccc; border-radius: 6px; font-size: 1rem;
  &:focus { border-color: #007bff; outline: none; box-shadow: 0 0 0 2px rgba(0,123,255,0.25); }
`,zt=p(ze).attrs({as:"select"})``,Ye=p.button`
  padding: 0.85rem 1.5rem; background: #28a745; color: white; border: none;
  border-radius: 6px; font-weight: bold; display: flex; align-items: center; gap: 0.5rem;
  justify-content: center; cursor: pointer; transition: background-color 0.2s; font-size: 1rem;
  &:hover:not(:disabled) { background: #218838; }
  &:disabled { background: #6c757d; cursor: not-allowed; }
`,_t=p.p`
  margin: 0 0 0.5rem 0; padding: 0.75rem; background-color: #e9ecef; border-radius: 6px;
  color: #495057; text-align: center; font-size: 1rem;
  strong { color: #dc3545; }
`,Pt=p.p`
  margin-top: -1rem; margin-bottom: 0.5rem; padding: 0.5rem; color: #dc3545; font-size: 0.9rem; text-align: center;
`,Qe=p(ht)`
  animation: spin 1s linear infinite;
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`,Ke=p.div`
  display: flex; flex-direction: column; gap: 0.5rem;
  max-height: 220px; overflow-y: auto; padding: 0.25rem;
`,Xe=p.div`
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
`,Ot=p.div`
  font-size: 0.85rem; font-weight: 600; color: #495057;
  margin-bottom: 0.25rem; display: flex; align-items: center; gap: 0.5rem;
`,he=t=>`C$${Number(t||0).toFixed(2)}`,et=t=>t?new Date(t).toLocaleDateString("es-NI",{timeZone:"America/Managua",day:"2-digit",month:"2-digit",year:"numeric"}):"—",Vt=({client:t,onClose:o,onAbonoSuccess:x,showAlert:h})=>{const{addCajaTransaction:C,user:g}=Re(),[l,N]=s.useState(""),[w,F]=s.useState("Efectivo"),[u,i]=s.useState(""),[$,E]=s.useState(!1),[D,a]=s.useState(""),[S,b]=s.useState([]),[L,m]=s.useState(!0),[j,Y]=s.useState(null),V=s.useMemo(()=>Number(t==null?void 0:t.saldo_pendiente)||0,[t]);s.useEffect(()=>{const d=async()=>{m(!0);try{const v=localStorage.getItem("token"),B=await At(t.id_cliente,v);b(Array.isArray(B)?B:[])}catch(v){console.error("Error cargando tickets:",v),b([])}finally{m(!1)}};t!=null&&t.id_cliente&&d()},[t]);const T=s.useMemo(()=>S.filter(d=>d.saldoRestante>0),[S]),ne=s.useMemo(()=>S.filter(d=>d.saldoRestante<=0),[S]),M=j?Math.min(V,j.saldoRestante):V;s.useEffect(()=>{if(!l){a("");return}const d=parseFloat(l);isNaN(d)||d<=0?a("Ingrese un monto válido mayor a cero."):d>M?a(`El máximo es ${he(M)}.`):a("")},[l,M]);const oe=d=>{d.saldoRestante<=0||(Y(v=>(v==null?void 0:v.idVenta)===d.idVenta?null:d),N(""))},Q=()=>{N(j?j.saldoRestante.toFixed(2):V.toFixed(2))},R=s.useCallback(async d=>{d.preventDefault();const v=parseFloat(l),B=localStorage.getItem("token");if(D||!v||v<=0){h==null||h({title:"Monto Inválido",message:D||"Revise el monto ingresado."});return}if(w!=="Efectivo"&&!u.trim()){h==null||h({title:"Referencia Requerida",message:"Ingrese el número de referencia, transferencia o voucher."});return}E(!0);try{await $t(t.id_cliente,{monto:v,id_venta:(j==null?void 0:j.idVenta)||null,pagoDetalles:{metodo:w,usuario:(g==null?void 0:g.nombre_usuario)||"Desconocido",referencia:u||"",ticketRef:j?`Venta #${j.idVenta}`:"FIFO"}},B);const P=w==="Efectivo",G={id:`abono-${Date.now()}`,type:"abono",amount:v,note:`Abono Cliente: ${t.nombre} (${w})${j?` - Venta #${j.idVenta}`:""} ${u?"- Ref: "+u:""}`,at:new Date().toISOString(),pagoDetalles:{clienteId:t.id_cliente,clienteNombre:t.nombre,metodo:w,referencia:u,ingresoCaja:P?v:0,efectivo:P?v:0,tarjeta:w==="Tarjeta"?v:0,transferencia:w==="Transferencia"?v:0,credito:0}};await C(G),x==null||x(G),o==null||o()}catch(P){console.error("Error al registrar abono:",P),h==null||h({title:"Error",message:`No se pudo registrar el abono. ${P.message}`})}finally{E(!1)}},[l,w,u,D,t,g,j,C,x,o,h]),r=$||V<=0||!!D||!l;return e.jsx(It,{children:e.jsxs(Et,{children:[e.jsxs(Ft,{children:[e.jsx(Lt,{children:"Registrar Abono"}),e.jsx(Mt,{onClick:o,disabled:$,children:e.jsx(ct,{})})]}),e.jsxs("p",{children:["Cliente: ",e.jsx("strong",{children:(t==null?void 0:t.nombre)||"Desconocido"})]}),e.jsxs(_t,{children:["Saldo Pendiente Total: ",e.jsx("strong",{children:he(V)})]}),L?e.jsxs("div",{style:{textAlign:"center",padding:"1rem",color:"#6c757d"},children:[e.jsx(Qe,{})," Cargando facturas..."]}):T.length>0?e.jsxs(e.Fragment,{children:[e.jsxs(Ot,{children:[e.jsx(pt,{})," Selecciona una factura (opcional — si no, paga la más antigua):"]}),e.jsx(Ke,{children:T.map(d=>e.jsxs(Xe,{$selected:(j==null?void 0:j.idVenta)===d.idVenta,onClick:()=>oe(d),children:[e.jsxs("div",{className:"ticket-info",children:[e.jsxs("span",{className:"ticket-id",children:["Venta #",d.idVenta]}),e.jsx("span",{className:"ticket-date",children:et(d.fecha)})]}),e.jsxs("div",{className:"ticket-amounts",children:[d.montoOriginal!==d.saldoRestante&&e.jsx("div",{className:"original",children:he(d.montoOriginal)}),e.jsx("div",{className:"remaining",children:he(d.saldoRestante)})]})]},d.idVenta))}),ne.length>0&&e.jsxs("details",{style:{marginTop:"0.5rem"},children:[e.jsxs("summary",{style:{cursor:"pointer",fontSize:"0.85rem",color:"#6c757d"},children:[e.jsx(mt,{style:{color:"#28a745"}})," ",ne.length," factura(s) pagada(s)"]}),e.jsx(Ke,{style:{marginTop:"0.5rem"},children:ne.map(d=>e.jsxs(Xe,{$paid:!0,children:[e.jsxs("div",{className:"ticket-info",children:[e.jsxs("span",{className:"ticket-id",children:["Venta #",d.idVenta]}),e.jsx("span",{className:"ticket-date",children:et(d.fecha)})]}),e.jsx("div",{className:"ticket-amounts",children:e.jsx("div",{className:"remaining",style:{color:"#28a745"},children:"Pagada ✔"})})]},d.idVenta))})]})]}):null,e.jsxs(Rt,{onSubmit:R,children:[e.jsxs(Ie,{children:[e.jsxs(Ee,{htmlFor:"montoAbono",children:["Monto a Abonar (C$)",j&&e.jsxs("span",{style:{fontWeight:"normal",color:"#007bff",marginLeft:"0.5rem"},children:["— Venta #",j.idVenta," (máx: ",he(M),")"]})]}),e.jsxs("div",{style:{display:"flex",gap:"0.5rem"},children:[e.jsx(ze,{id:"montoAbono",type:"number",value:l,onChange:d=>N(d.target.value),placeholder:"0.00",required:!0,autoFocus:!0,step:"0.01",min:"0.01",max:M?M.toFixed(2):void 0,disabled:$||V<=0,style:{flex:1}}),e.jsx(Ye,{type:"button",onClick:Q,style:{background:"#007bff",padding:"0.5rem 0.75rem",fontSize:"0.85rem"},disabled:$||V<=0,children:"Total"})]})]}),e.jsxs(Ie,{children:[e.jsx(Ee,{htmlFor:"metodoPago",children:"Método de Pago"}),e.jsxs(zt,{id:"metodoPago",value:w,onChange:d=>F(d.target.value),disabled:$,children:[e.jsx("option",{value:"Efectivo",children:"Efectivo"}),e.jsx("option",{value:"Tarjeta",children:"Tarjeta"}),e.jsx("option",{value:"Transferencia",children:"Transferencia"})]})]}),w!=="Efectivo"&&e.jsxs(Ie,{children:[e.jsx(Ee,{htmlFor:"referencia",children:"Referencia / Voucher / N° Transferencia"}),e.jsx(ze,{id:"referencia",type:"text",value:u,onChange:d=>i(d.target.value),placeholder:"Ej: BAC-123456",required:!0})]}),D&&e.jsx(Pt,{children:D}),e.jsx(Ye,{type:"submit",disabled:r,children:$?e.jsxs(e.Fragment,{children:[e.jsx(Qe,{})," Procesando..."]}):e.jsxs(e.Fragment,{children:[e.jsx(xt,{})," Registrar Abono"]})})]})]})})},Wt=Z.memo(Vt),Bt=ut`
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
`,qt=p.div`
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
`,Ht=p.div`
  display: flex; flex-direction: column; gap: 12px;
  max-height: 60vh;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    max-height: 65vh;
  }
`,Ut=p.img`
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
`,fe=p.span`
  display: inline-flex; align-items: center; gap: 6px;
  font-weight: 900; letter-spacing: .5px; padding: 5px 10px; border-radius: 4px;
  font-size: 0.85rem;
  ${({$type:t})=>t==="proforma"&&ie`background: #e8f4ff; color: #0b72b9; border: 2px solid #0b72b9;`}
  ${({$type:t})=>t==="abono"&&ie`background: #fff3cd; color: #856404; border: 2px solid #856404;`}
  ${({$type:t})=>t==="venta"&&ie`background: #e8f7ee; color: #1c7d3a; border: 2px solid #1c7d3a;`}
  ${({$type:t})=>t==="outflow"&&ie`background: #fee2e2; color: #991b1b; border: 2px solid #991b1b;`}
  ${({$type:t})=>t==="pro"&&ie`background: #f3e8ff; color: #8b5cf6; border: 2px solid #8b5cf6;`}
`,Gt=p.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 1rem; border-bottom: 2px solid #e2e8f0; padding-bottom: .75rem;
  flex-wrap: wrap; gap: 8px;

  h2 { font-size: 1.1rem; }

  @media (max-width: 600px) {
    flex-direction: column; align-items: stretch;
    h2 { font-size: 1rem; }
  }
`,Jt=p.div`
  display: flex; gap: 8px; flex-wrap: wrap;
  
  @media (max-width: 600px) {
    justify-content: stretch;
    button { flex: 1; font-size: 0.85rem; padding: 10px 8px; }
  }
`,tt=p(Oe)`
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
`,H=t=>new Intl.NumberFormat("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(t||0)),k=(...t)=>t.find(o=>o!=null),ae=t=>k(t==null?void 0:t.usuarioNombre,t==null?void 0:t.nombre_usuario,t==null?void 0:t.nombre,t==null?void 0:t.name,t==null?void 0:t.displayName,t==null?void 0:t.fullName,t==null?void 0:t.username,null);function Zt(t=[]){return t.map((o,x)=>{const h=Number(k(o.quantity,o.cantidad,o.qty,0)),C=k(o.nombre,o.descripcion,o.description,o.producto,`Item ${x+1}`),g=Number(k(o.precio_unitario,o.precio_venta,o.precio,o.unitPrice,0));return{id:k(o.id_producto,o.id,`it-${x}`),nombre:C,quantity:h,unit:g,total:h*g}})}function Yt(t={}){const o=Number(t.efectivo||0),x=Number(t.tarjeta||0),h=Number(t.transferencia||0),C=Number(t.dolares||0);if(Number(t.credito||0)>0)return"Crédito";const l=[];return o>0&&l.push("Efectivo"),x>0&&l.push("Tarjeta"),h>0&&l.push("Transferencia"),C>0&&l.push("Dólares"),l.length===0?"Contado":l.length===1?l[0]:"Mixto"}function Qt(t={},o=0){const x=Number(t.efectivo||0),h=Number(t.tarjeta||0),C=Number(t.transferencia||0),g=Number(t.otro||0),l=Number(t.dolares||0),N=Number(t.tasaDolarAlMomento||t.tasaObtenida||1),w=l*(N>1?N:1),F=x+h+C+g+w;return F>0?F:Number(t.montoRecibido||o||0)}function Kt(t){const o=k(t==null?void 0:t.fecha,t==null?void 0:t.createdAt,t==null?void 0:t.created_at,t==null?void 0:t.date,t);try{const x=new Date(o);return isNaN(x)?"Fecha inválida":x.toLocaleString("es-NI",{hour12:!0})}catch{return"Fecha inválida"}}function Xt(t){const o=k(t.proformaId,t.proformaNumero,t.numeroProforma,t.id);if(o)return o;const x=new Date,h=x.toISOString().slice(2,10).replace(/-/g,""),C=x.toTimeString().slice(0,8).replace(/:/g,"");return`PF-${h}-${C}`}const Nn=({transaction:t,onClose:o,clients:x=[],users:h=[],isOpen:C=!0,printMode:g="80",currentUser:l=null,onPersistPrint:N=null,autoTriggerPrint:w=!1,showAlert:F=null})=>{var me;const{user:u}=typeof Re=="function"?Re():{user:null},{settings:i}=Tt();if(!C||t==null)return null;const[$]=Z.useState(typeof t=="object"?t:null),[E]=Z.useState(!1),[D]=Z.useState(null);if(E||D||!$)return e.jsx($e,{className:"no-print",children:e.jsxs(tt,{className:"no-print",style:{maxWidth:420,padding:"1rem"},children:[e.jsx("h3",{style:{color:"#dc3545"},children:"No se pudo imprimir"}),e.jsx("div",{style:{display:"flex",justifyContent:"center",marginTop:12},children:e.jsxs(A,{onClick:o,$cancel:!0,children:[e.jsx(Me,{})," Cerrar"]})})]})});const a=$,S=a.estado==="ABONO_CREDITO",b=!!(a.isProforma||a.proformaFor||a.proformaNombre),L=!!a.isOutflow,m=a.estado==="DEVOLUCION",j=b?Xt(a):k(a.id,a.saleId,a.numero,"-"),Y=Kt(k(a.fecha,a.createdAt,a.date)),V=k(a.clientId,a.idCliente,a.clienteId),T=x.find(f=>String(f.id_cliente??f.id)===String(V)),ne=b&&a.proformaNombre?a.proformaNombre:k(T==null?void 0:T.nombre,a.clienteNombre,"Consumidor Final"),M=(T==null?void 0:T.cedula)||a.clienteCedula,oe=k(a.userId,a.idUsuario,(me=a.openedBy)==null?void 0:me.id)??(l==null?void 0:l.id_usuario)??(l==null?void 0:l.id)??(l==null?void 0:l.uid)??(u==null?void 0:u.id_usuario)??(u==null?void 0:u.id)??(u==null?void 0:u.uid),Q=(()=>{try{return JSON.parse(localStorage.getItem("authUser")||"null")}catch{return null}})(),R=h.find(f=>String(f.id_usuario||f.id||f.uid)===String(oe)),r=k(a.usuarioNombre,ae(R),ae(l),ae(u),ae(Q),"Cajero POS"),d=b?k(a.usuarioNombre,ae(l),ae(u),ae(Q),r):r,v=Zt(k(a.items,a.detalle,[])),B=v.reduce((f,q)=>f+Number(q.unit)*Number(q.quantity),0),P=Number(k(a.subtotal,B)),G=Number(k(a.descuento,0)),I=Number(k(a.totalVenta,a.total_venta,P-G,0)),ge=a.pagoDetalles||{},se=b||L?"N/A":k(a.metodoPago,Yt(ge)),K=b||L?0:Qt(ge,I),ce=b||L?0:Math.max(0,K-I),le=Math.abs(Number(k(a.totalVenta,a.montoAbono,0))),J=Number((T==null?void 0:T.saldo_pendiente)||0),ue=J+le,be=v.length<=2,pe=s.useMemo(()=>i!=null&&i.empresa_logo_url?i.empresa_logo_url.startsWith("http")?i.empresa_logo_url:`${"https://multirepuestosrg.com/api".replace(/\/api$/,"")}${i.empresa_logo_url.startsWith("/")?"":"/"}${i.empresa_logo_url}`:null,[i==null?void 0:i.empresa_logo_url]),z={name:(i==null?void 0:i.empresa_nombre)||"Multirepuestos RG",ruc:(i==null?void 0:i.empresa_ruc)||"1211812770001E",phone:(i==null?void 0:i.empresa_telefono)||"84031936 / 84058142",address:(i==null?void 0:i.empresa_direccion)||"Del portón de la normal 75 varas al este. Juigalpa, Chontales.",slogan:(i==null?void 0:i.empresa_eslogan)||"Repuestos de confianza al mejor precio",logo:pe||new URL("/icons/logo.png",window.location.origin).toString()};Z.useCallback(async f=>{},[]);const X=Z.useCallback((f="80",q=!1)=>{const xe=document.getElementById("print-wrapper-ticket");if(!xe)return;const Te=xe.outerHTML,de=`
      @charset "UTF-8";
      @page { size: ${f==="A4"?"A4 portrait":"80mm auto"}; margin: ${f==="A4"?"12mm":"0"}; }
      html, body { background: #fff; margin: 0 !important; padding: 0 !important; font-family: ${f==="A4"?"'Inter', Helvetica, Arial, sans-serif":"'Consolas', monospace"}; color: #000 !important; }
      
      #print-wrapper-ticket {
        box-shadow: none !important; border: none !important; margin: 0 !important;
        ${f==="A4"?"width: 100% !important; padding: 0 !important; font-size: 10pt !important;":"width: 80mm !important; padding: 6px 4px !important; font-size: 8pt !important;"}
      }

      /* === ESTILOS 80mm MEJORADOS === */
      ${f!=="A4"?`
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
    `,ee=window.open("","_blank","width=900,height=700");ee&&(ee.document.write(`<html><head><title>Impresión ${f.toUpperCase()} - ${z.name}</title><style>${de}</style></head><body>${Te}</body></html>`),ee.document.close(),ee.focus(),setTimeout(()=>{try{ee.print()}catch(je){console.error("Print error:",je)}setTimeout(()=>{try{ee.close()}catch{}},1e3)},400),q&&setTimeout(()=>{o&&o()},800))},[z,o]),re=s.useRef(!1);return s.useEffect(()=>{if(w&&!re.current){re.current=!0;const f=setTimeout(()=>X("80",!0),500);return()=>clearTimeout(f)}},[w,X]),e.jsxs($e,{className:"no-print",children:[e.jsx(Bt,{}),e.jsxs(tt,{className:"no-print",children:[e.jsxs(Gt,{children:[e.jsxs("h2",{style:{display:"flex",alignItems:"center",gap:8,margin:0},children:[e.jsx(ft,{color:"#2563eb"})," Vista de Impresión"]}),e.jsxs(Jt,{children:[e.jsxs(A,{onClick:()=>X("80"),style:{background:"#2563eb",color:"#fff",fontWeight:700},children:[e.jsx(Pe,{})," 80mm"]}),e.jsxs(A,{onClick:()=>X("A4"),style:{background:"#0f766e",color:"#fff",fontWeight:700},children:[e.jsx(gt,{})," A4"]}),e.jsx(A,{$cancel:!0,onClick:o,style:{background:"#fee2e2",color:"#ef4444"},children:e.jsx(Me,{})})]})]}),e.jsx(Ht,{children:e.jsxs(qt,{id:"print-wrapper-ticket",className:`print-area ${g==="A4"?"print-a4":"print-80"} ${be?"compact":""}`,children:[e.jsxs("div",{className:"brand",children:[e.jsx("div",{className:"brand-logo-container",children:e.jsx(Ut,{className:g==="A4"?"logo-a4":"logo-80mm",src:z.logo,alt:"Logo",onError:f=>{f.currentTarget.style.display="none"}})}),e.jsxs("div",{className:"brand-info",children:[e.jsx("h1",{children:z.name}),e.jsx("small",{children:e.jsx("strong",{children:z.slogan})}),e.jsxs("small",{children:[e.jsx("strong",{children:"RUC:"})," ",z.ruc]}),e.jsxs("small",{children:[e.jsx("strong",{children:"Tel:"})," ",z.phone]}),e.jsx("small",{children:z.address}),e.jsx("div",{style:{marginTop:8},children:b?e.jsx(fe,{$type:"proforma",className:"ticket-tag",children:"PROFORMA"}):S?e.jsx(fe,{$type:"abono",className:"ticket-tag",children:"RECIBO"}):L?e.jsx(fe,{$type:"outflow",className:"ticket-tag",children:"SALIDA"}):a.isProReceipt||a.isWholesale?e.jsx(fe,{$type:"pro",className:"ticket-tag",children:"RECIBO PRO"}):e.jsx(fe,{$type:"venta",className:"ticket-tag",children:m?"DEVOLUCIÓN":"FACTURA"})})]})]}),e.jsxs("div",{className:"meta",children:[e.jsxs("div",{className:"meta-col",children:[e.jsx("span",{className:"meta-title",children:"Detalles del Documento"}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Fecha:"}),e.jsx("span",{className:"meta-value",children:Y})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"No. Documento:"}),e.jsx("span",{className:"meta-value",children:j})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Atendido por:"}),e.jsx("span",{className:"meta-value",children:d})]})]}),e.jsxs("div",{className:"meta-col",children:[e.jsx("span",{className:"meta-title",children:"Datos del Cliente"}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Cliente:"}),e.jsx("span",{className:"meta-value",children:ne})]}),M&&e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Cédula/RUC:"}),e.jsx("span",{className:"meta-value",children:M})]}),!b&&!L&&e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Pago:"}),e.jsx("span",{className:"meta-value",children:se})]})]})]}),e.jsxs("table",{className:"items",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{className:"col-qty",children:"Cant."}),e.jsx("th",{children:"Descripción"}),e.jsx("th",{className:"text-right col-unit",children:"P. Unit"}),e.jsx("th",{className:"text-right col-total",children:"Total"})]})}),e.jsx("tbody",{children:v.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:"4",style:{textAlign:"center"},children:"Sin ítems"})}):v.map(f=>e.jsxs("tr",{children:[e.jsx("td",{className:"col-qty",style:{fontWeight:800},children:f.quantity}),e.jsx("td",{style:{fontWeight:600},children:f.nombre}),e.jsxs("td",{className:"text-right col-unit",children:["C$",H(f.unit)]}),e.jsxs("td",{className:"text-right col-total",style:{fontWeight:700},children:["C$",H(f.total)]})]},f.id))})]}),e.jsx("div",{className:"totals",children:e.jsx("div",{className:"totals-box",children:S?e.jsxs(e.Fragment,{children:[e.jsxs(O,{style:{marginTop:5,fontSize:"0.95em"},children:[e.jsx("span",{style:{fontWeight:700},children:"Saldo Anterior:"}),e.jsxs("span",{style:{fontWeight:700},children:["C$",H(ue)]})]}),e.jsxs(O,{className:"grand-total",$bold:!0,style:{fontSize:"1.3em",borderTop:"2px solid #000",marginTop:5,paddingTop:5,color:"#28a745"},children:[e.jsx("span",{style:{fontWeight:900},children:"ABONÓ:"}),e.jsxs("span",{style:{fontWeight:900},children:["C$",H(le)]})]}),e.jsxs(O,{$bold:!0,style:{fontSize:"1.1em",borderTop:"2px dashed #000",marginTop:5,paddingTop:5,color:J>0?"#dc3545":"#28a745"},children:[e.jsx("span",{style:{fontWeight:900},children:"Saldo Pendiente:"}),e.jsxs("span",{style:{fontWeight:900},children:["C$",H(J)]})]})]}):e.jsxs(e.Fragment,{children:[e.jsxs(O,{children:[e.jsx("span",{style:{fontWeight:700},children:"Subtotal:"}),e.jsxs("span",{style:{fontWeight:700},children:["C$",H(P)]})]}),G>0&&e.jsxs(O,{style:{color:"#dc3545"},children:[e.jsx("span",{style:{fontWeight:700},children:"Descuento:"}),e.jsxs("span",{style:{fontWeight:700},children:["- C$",H(G)]})]}),e.jsxs(O,{className:"grand-total",$bold:!0,style:{fontSize:"1.3em",borderTop:"2px solid #000",marginTop:5,paddingTop:5},children:[e.jsx("span",{style:{fontWeight:900},children:"TOTAL:"}),e.jsxs("span",{style:{fontWeight:900},children:["C$",H(I)]})]}),!b&&e.jsxs(e.Fragment,{children:[e.jsxs(O,{style:{marginTop:10,fontSize:"0.9em"},children:[e.jsx("span",{style:{fontWeight:700},children:"Pagado:"}),e.jsxs("span",{style:{fontWeight:700},children:["C$",H(K)]})]}),ce>0&&e.jsxs(O,{$bold:!0,style:{color:"#dc3545",fontWeight:900},children:[e.jsx("span",{children:"Cambio:"}),e.jsxs("span",{children:["C$",H(ce)]})]})]})]})})}),e.jsxs("div",{className:"footer-sign no-show-80",children:[e.jsx("div",{className:"sign-box",children:"Entregado por"}),e.jsx("div",{className:"sign-box",children:"Recibido por"})]}),e.jsxs("div",{className:"thanks",children:[e.jsx("p",{children:e.jsxs("strong",{children:['"',z.slogan,'"']})}),e.jsx("p",{style:{whiteSpace:"pre-line",marginTop:"5px"},children:b?(i==null?void 0:i.ticket_proforma_footer)||"Cotización válida por 15 días.":L?(i==null?void 0:i.ticket_transfer_footer)||"Salida de Inventario.":(i==null?void 0:i.ticket_sales_footer)||"¡Gracias por su compra!"})]})]})})]})]})},U=t=>Number(t||0).toFixed(2),en=(t,o=0)=>(t==null?void 0:t.nombre)??(t==null?void 0:t.name)??(t==null?void 0:t.producto)??(t==null?void 0:t.descripcion)??`Item ${o+1}`,nt=p.div`
  border-left: 1px solid #e9ecef; padding-left: 1.5rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1.2rem;
`,Ne=p.div`
  background-color: #fff; border: 1px solid #e9ecef; border-radius: 8px; padding: 1.2rem;
  h4 { margin-top: 0; margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem; color: #495057; }
`,tn=p.table`
  width: 100%; border-collapse: collapse; font-size: 0.9rem;
  th, td { padding: 0.6rem; text-align: left; border-bottom: 1px solid #f1f1f1; }
  th { font-weight: 600; color: #6c757d; }
  td:nth-child(3), td:nth-child(4) { text-align: right; }
`,W=p.div`
  display: flex; justify-content: space-between; padding: 0.4rem 0; font-size: 0.95rem; font-weight: ${t=>t.$bold?"600":"normal"};
  border-top: ${t=>t.$bordered?"1px dashed #ccc":"none"}; color: ${t=>t.color||"inherit"};
  span:first-child { color: #6c757d; }
`,nn=p.div`
  display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1rem;
`,ot=p.span`
  font-weight: bold; padding: 0.25rem 0.5rem; border-radius: 4px; color: white; background-color: ${t=>t.color};
`,on=({sale:t,client:o,creditStatus:x,dailySales:h,isAdmin:C,onOpenAbonoModal:g,onCancelSale:l,onReturnItem:N,onReprintTicket:w,showConfirmation:F,showPrompt:u,showAlert:i})=>{var L;const $=s.useMemo(()=>!(!t||t.estado!=="COMPLETADA"),[t]);if(!t)return e.jsx(nt,{style:{justifyContent:"center",alignItems:"center"},children:e.jsxs(Ae,{children:[e.jsx(bt,{})," Seleccione una transacción de la lista para ver sus detalles."]})});const D={COMPLETADA:{text:"COMPLETADA",color:"#28a745"},CANCELADA:{text:"CANCELADA",color:"#dc3545"},DEVOLUCION:{text:"DEVOLUCIÓN",color:"#ffc107"},ABONO_CREDITO:{text:"ABONO A CRÉDITO",color:"#17a2b8"}}[t.estado]||{text:t.estado,color:"#6c757d"},a=t.estado==="COMPLETADA",S=(m,j)=>{if($){if(!N){i==null||i({title:"Config",message:"Falta onReturnItem en props.",type:"error"});return}N(m,j)}},b=()=>{if($){if(!l){i==null||i({title:"Config",message:"Falta onCancelSale en props.",type:"error"});return}l(t)}};return e.jsxs(nt,{children:[e.jsxs("h3",{children:["Detalle de Transacción #",t.id]}),o&&x&&e.jsxs(Ae,{$type:"info",style:{flexDirection:"column",alignItems:"stretch",gap:"1rem"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("span",{style:{fontWeight:"bold"},children:["Estado de Cuenta: ",o.nombre]}),e.jsxs(A,{$primary:!0,onClick:g,disabled:x.currentBalance<=0,children:[e.jsx(Ue,{})," Registrar Abono"]})]}),e.jsxs(W,{$bold:!0,color:x.currentBalance>0?"#dc3545":"#28a745",children:[e.jsx("span",{children:"SALDO PENDIENTE TOTAL:"}),e.jsxs("span",{children:["C$",x.currentBalance.toFixed(2)]})]})]}),e.jsxs(Ne,{children:[e.jsxs("p",{children:[e.jsxs("strong",{children:[e.jsx(Ge,{})," Cliente:"]})," ",(o==null?void 0:o.nombre)||"Cliente Genérico"]}),e.jsxs("p",{children:[e.jsxs("strong",{children:[e.jsx(rt,{})," Fecha:"]})," ",new Date(t.fecha).toLocaleString("es-NI")]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("p",{style:{margin:0},children:[e.jsx("strong",{children:"Estado:"})," ",e.jsx(ot,{color:D.color,children:D.text})]}),(((L=t.pagoDetalles)==null?void 0:L.isWholesale)||t.isWholesale)&&e.jsx(ot,{color:"#8b5cf6",children:"VENTA MAYORISTA"})]})]}),a&&e.jsxs(e.Fragment,{children:[Array.isArray(t.items)&&t.items.length>0&&e.jsxs(Ne,{children:[e.jsx("h4",{children:"Productos"}),e.jsxs(tn,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Producto"}),e.jsx("th",{children:"Cant."}),e.jsx("th",{children:"P. Unit."}),e.jsx("th",{children:"Subtotal"}),e.jsx("th",{})]})}),e.jsx("tbody",{children:t.items.map((m,j)=>e.jsxs("tr",{children:[e.jsx("td",{children:en(m,j)}),e.jsx("td",{children:(m==null?void 0:m.quantity)??(m==null?void 0:m.cantidad)??0}),e.jsxs("td",{children:["C$",U(m==null?void 0:m.precio)]}),e.jsxs("td",{children:["C$",U(((m==null?void 0:m.quantity)??(m==null?void 0:m.cantidad)??0)*((m==null?void 0:m.precio)??0))]}),e.jsx("td",{children:$&&e.jsx(A,{$warning:!0,$small:!0,onClick:()=>S(m,j),title:"Devolver",children:e.jsx(jt,{})})})]},(m&&(m.id_producto||m.id))??j))})]})]}),e.jsxs(Ne,{children:[e.jsx("h4",{children:"Resumen Financiero de esta Venta"}),t.subtotal!==void 0&&e.jsxs(W,{children:[e.jsx("span",{children:"Subtotal:"}),e.jsxs("span",{children:["C$",U(t.subtotal)]})]}),t.descuento>0&&e.jsxs(W,{children:[e.jsx("span",{children:"Descuento:"}),e.jsxs("span",{style:{color:"#dc3545"},children:["- C$",U(t.descuento)]})]}),e.jsxs(W,{$bold:!0,$bordered:!0,children:[e.jsx("span",{children:"Total Transacción:"}),e.jsxs("span",{children:["C$",U(Math.abs(t.totalVenta))]})]}),t.pagoDetalles&&e.jsxs("div",{style:{marginTop:"1rem"},children:[e.jsx("h5",{style:{marginBottom:"0.5rem",fontSize:"1rem"},children:"Detalle del Pago:"}),t.pagoDetalles.efectivo>0&&e.jsxs(W,{children:[e.jsxs("span",{children:[e.jsx(Ue,{})," Efectivo Recibido:"]}),e.jsxs("span",{children:["C$",U(t.pagoDetalles.efectivo)]})]}),t.pagoDetalles.tarjeta>0&&e.jsxs(e.Fragment,{children:[e.jsxs(W,{children:[e.jsxs("span",{children:[e.jsx(yt,{})," Tarjeta:"]}),e.jsxs("span",{children:["C$",U(t.pagoDetalles.tarjeta)]})]}),t.pagoDetalles.referenciaTarjeta&&e.jsxs(W,{style:{fontSize:"0.85rem",color:"#666",paddingLeft:"1.5rem"},children:[e.jsx("span",{children:"↳ Ref:"}),e.jsx("span",{children:t.pagoDetalles.referenciaTarjeta})]})]}),t.pagoDetalles.transferencia>0&&e.jsxs(e.Fragment,{children:[e.jsxs(W,{children:[e.jsxs("span",{children:[e.jsx(at,{})," Transferencia:"]}),e.jsxs("span",{children:["C$",U(t.pagoDetalles.transferencia)]})]}),t.pagoDetalles.referenciaTransferencia&&e.jsxs(W,{style:{fontSize:"0.85rem",color:"#666",paddingLeft:"1.5rem"},children:[e.jsx("span",{children:"↳ Ref:"}),e.jsx("span",{children:t.pagoDetalles.referenciaTransferencia})]})]}),t.pagoDetalles.credito>0&&e.jsxs(W,{children:[e.jsxs("span",{children:[e.jsx(Ge,{})," Crédito Otorgado:"]}),e.jsxs("span",{style:{color:"#dc3545"},children:["C$",U(t.pagoDetalles.credito)]})]}),t.pagoDetalles.vuelto>0&&e.jsxs(W,{children:[e.jsx("span",{children:"Vuelto Entregado:"}),e.jsxs("span",{children:["- C$",U(t.pagoDetalles.vuelto)]})]})]})]})]}),t.estado!=="CANCELADA"&&e.jsxs(Ne,{children:[e.jsx("h4",{children:"Acciones"}),e.jsxs(nn,{children:[e.jsxs(A,{onClick:w,children:[e.jsx(Pe,{})," Reimprimir Ticket"]}),$&&e.jsxs(A,{$cancel:!0,onClick:b,children:[e.jsx(Ct,{})," Cancelar Venta"]})]})]})]})},rn=Z.memo(on),Fe=()=>{const t=new Date,o=t.toLocaleString("en-US",{year:"numeric",timeZone:"America/Managua"}),x=t.toLocaleString("en-US",{month:"2-digit",timeZone:"America/Managua"}),h=t.toLocaleString("en-US",{day:"2-digit",timeZone:"America/Managua"});return`${o}-${x}-${h}`},_e=t=>new Intl.NumberFormat("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(t||0)),an=t=>{if(!t)return{label:"N/A",icon:null};const{efectivo:o,tarjeta:x,transferencia:h,credito:C}=t;if(Number(C)>0)return{label:"Crédito",icon:e.jsx(Ze,{style:{color:"#dc3545"}})};const g=[];if(Number(o)>0&&g.push("Efectivo"),Number(x)>0&&g.push("Tarjeta"),Number(h)>0&&g.push("Transferencia"),g.length===1){const l=g[0];return l==="Efectivo"?{label:"Efectivo",icon:e.jsx(De,{style:{color:"#28a745"}})}:l==="Tarjeta"?{label:"Tarjeta",icon:e.jsx(Ze,{style:{color:"#007bff"}})}:{label:"Transferencia",icon:e.jsx(at,{style:{color:"#007bff"}})}}return g.length>1?{label:"Mixto",icon:e.jsx(De,{style:{color:"#ffc107"}})}:{label:"Contado",icon:e.jsx(De,{style:{color:"#28a745"}})}},ke=(t,o=0)=>(t==null?void 0:t.nombre)??(t==null?void 0:t.name)??(t==null?void 0:t.producto)??(t==null?void 0:t.descripcion)??`Item ${o+1}`,sn=p(Oe)`
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
`,ln=p.div`
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid #dee2e6;
  h2 { display: flex; align-items: center; gap: .5rem; margin: 0; }
`,dn=p.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(180px, 1fr));
  gap: .75rem 1rem; margin-bottom: 1rem;

  @media (max-width: 1100px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 520px) { grid-template-columns: 1fr; }

  label { display: block; font-size: .9rem; color: #6c757d; margin-bottom: .25rem; }
`,cn=p.div`
  display: grid; grid-template-columns: 380px 1fr; gap: 1rem; flex: 1; min-height: 0;
  @media (max-width: 1024px) { grid-template-columns: 1fr; }
`,pn=p.div`
  background: #f8f9fa; border-radius: 12px; padding: .75rem; display: flex;
  flex-direction: column; min-height: 0;
`,Se=p.div`
  background: #fff; border-radius: 12px; padding: 1rem; min-height: 0;
  box-shadow: 0 2px 10px rgba(0,0,0,.06);
`,mn=p.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: .5rem;
  small { color: #6c757d; }
`,xn=p.div`
  flex: 1; overflow: auto; padding-right: 4px; min-height: 200px;
`,hn=p.div`
  display: flex; justify-content: center; align-items: center; gap: .75rem;
  padding-top: .5rem; border-top: 1px solid #e9ecef;
`,fn=p.div`
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
`,st=p.span`
  display: inline-flex; align-items: center; justify-content: center;
  border-radius: 9999px; padding: .25rem .6rem; font-weight: 700; font-size: .8rem;
  ${t=>t.$green&&ie`background:#e8f7ee; color:#198754;`}
  ${t=>t.$red&&ie`background:#fdecec; color:#dc3545;`}
`,gn=Z.memo(function({sale:o,isSelected:x,onSelect:h,safeUsers:C,safeClients:g}){var E;const l={COMPLETADA:"#28a745",CANCELADA:"#dc3545",DEVOLUCION:"#ffc107",ABONO_CREDITO:"#17a2b8"},N=s.useMemo(()=>{var a,S;return((a=(C||[]).find(b=>((b==null?void 0:b.id_usuario)??(b==null?void 0:b.id))==(o==null?void 0:o.userId)))==null?void 0:a.nombre_usuario)||((S=o==null?void 0:o.usuario)==null?void 0:S.nombre_usuario)||(o==null?void 0:o.userName)||(o==null?void 0:o.vendedor)||"N/A"},[C,o]),w=s.useMemo(()=>{var a,S;return((a=(g||[]).find(b=>(b==null?void 0:b.id_cliente)===((o==null?void 0:o.clientId)||(o==null?void 0:o.idCliente))))==null?void 0:a.nombre)||((S=o==null?void 0:o.cliente)==null?void 0:S.nombre)||(o==null?void 0:o.clientName)||"Consumidor Final"},[g,o]),F=Number(o.totalVenta??o.total_venta??o.total??0),u=an(o.pagoDetalles),i=o.estado==="ABONO_CREDITO"?e.jsxs(e.Fragment,{children:[e.jsx(it,{style:{marginRight:6}})," ABONO"]}):e.jsxs(e.Fragment,{children:["#",o.id," - ",o.estado.replace("_"," ")]}),$=((E=o.pagoDetalles)==null?void 0:E.isWholesale)||o.isWholesale;return e.jsxs(fn,{onClick:()=>h(o),selected:x,$borderColor:l[o.estado]||"#6c757d",title:`Venta #${o.id}`,children:[e.jsxs("div",{className:"top",children:[e.jsx("span",{children:i}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[$&&e.jsx(st,{style:{background:"#8b5cf6",color:"white",fontSize:"0.7rem"},children:"MAYORISTA"}),e.jsxs("span",{children:[u.icon," C$",_e(Math.abs(F))]})]})]}),e.jsxs("div",{className:"sub",children:[new Date(o.fecha).toLocaleString("es-NI")," · Cliente: ",e.jsx("strong",{children:w})," · Vendedor: ",N]})]})}),Le=10;function un({dailySales:t=[],loadSales:o,onClose:x,isAdmin:h,users:C=[],clients:g=[],onReprintTicket:l,onCancelSale:N,onReturnItem:w,onAbonoSuccess:F,initialClientId:u=null}){var Ve,We,Be,qe;const[i,$]=s.useState(Fe()),[E,D]=s.useState(Fe()),[a,S]=s.useState(Array.isArray(t)?t:[]),[b,L]=s.useState(!1),[m,j]=s.useState(""),[Y,V]=s.useState(""),[T,ne]=s.useState(""),[M,oe]=s.useState(1),Q=s.useMemo(()=>Array.isArray(C)?C:[],[C]),R=s.useMemo(()=>Array.isArray(g)?g:[],[g]);s.useEffect(()=>{if(u){const n=R.find(c=>c.id_cliente===u);n?(j(n.nombre),D("")):j(String(u))}},[u,R]);const[r,d]=s.useState(null),[v,B]=s.useState(!1),[P,G]=s.useState({open:!1,title:"",message:""}),I=(n,c)=>G({open:!0,title:n,message:c}),ge=()=>G({open:!1,title:"",message:""}),[se,K]=s.useState({open:!1,title:"",message:"",onConfirm:null}),ce=(n,c,y)=>K({open:!0,title:n,message:c,onConfirm:y}),le=()=>K({open:!1,title:"",message:"",onConfirm:null}),[J,ue]=s.useState({open:!1,title:"",message:"",initialValue:"1",onConfirm:null}),be=(n,c,y,_)=>ue({open:!0,title:n,message:c,initialValue:String(y??"1"),onConfirm:_}),pe=()=>ue({open:!1,title:"",message:"",initialValue:"1",onConfirm:null}),z=s.useCallback(async(n=null)=>{if(!o)return[];L(!0),$(n);try{const c=await o(n),y=Array.isArray(c)?c:[];return S(y),y}catch(c){return S([]),I("Error","No se pudieron cargar las transacciones: "+(c.message||"Error de conexión.")),[]}finally{L(!1)}},[o]);s.useEffect(()=>{const c=m&&m.length>=2||u&&!E?null:E;z(c),oe(1),d(null)},[E,z,m,u]),s.useEffect(()=>{E===Fe()&&Array.isArray(t)&&!m&&S(t)},[t,E,m]);const X=s.useMemo(()=>{const n=(m||"").toLowerCase();return(a||[]).filter(y=>{var ye;const _=y.clientId||y.idCliente,te=((ye=R.find(Ce=>Ce.id_cliente===_))==null?void 0:ye.nombre)||"";return(!Y||String(y.userId)===String(Y))&&(!T||y.estado===T)&&(!n||String(y.id).includes(n)||te.toLowerCase().includes(n))}).sort((y,_)=>new Date(_.fecha)-new Date(y.fecha))},[a,Y,T,m,R]),re=Math.max(1,Math.ceil(X.length/Le)),me=(M-1)*Le,f=X.slice(me,me+Le);s.useEffect(()=>{(!r||!f.some(n=>n.id===r.id))&&d(f[0]||null)},[f,r]);const q=s.useCallback(async(n=null)=>{const c=await z(i);if(n){const y=(c||[]).find(_=>String(_.id)===String(n));d(y||null)}else d(null)},[z,i]),xe=s.useCallback(n=>{const c=typeof n=="object"&&(n!=null&&n.id)?n.id:n||(r==null?void 0:r.id),y=typeof n=="object"&&n?n:r;if(!(!c||!y)){if(y.estado==="CANCELADA"){I("Venta ya cancelada",`La venta #${c} ya fue cancelada.`);return}if(!N){I("Error de Configuración","onCancelSale no fue proporcionada.");return}ce("Cancelar Venta",`¿Seguro que deseas cancelar la venta #${c}? Esta acción revierte inventario y no se puede deshacer.`,async()=>{le();try{await N(y),I("Éxito",`Venta #${c} cancelada.`),await q(null)}catch(_){I("Error al Cancelar",_.message||"No se pudo cancelar la venta.")}})}},[r,N,q]),Te=s.useCallback((n,c=0)=>{if(!r)return;if(!w){I("Error de Configuración","onReturnItem no fue proporcionada.");return}const y=Number((n==null?void 0:n.quantity)||(n==null?void 0:n.cantidad)||0);if(!Number.isFinite(y)||y<=0){I("No se puede devolver","Este artículo no tiene cantidad disponible para devolver.");return}be("Devolver producto",`Cantidad a devolver para "${ke(n,c)}" (máx. ${y})`,"1",async _=>{const te=Number(_);if(!Number.isFinite(te)||te<=0||te>y){I("Cantidad inválida",`Ingresa un número entre 1 y ${y}.`);return}const ye=r.items.length===1&&te===y,Ce=async()=>{try{await w(r,n,te),I("Éxito",`Se devolvieron ${te} unidad(es) de ${ke(n,c)}.`),await q(null)}catch(we){const He=((we==null?void 0:we.message)||"").toLowerCase(),dt=He.includes("not found")||He.includes("404")?"Ruta de API no encontrada.":we.message||"No se pudo devolver el producto.";I("Error al Devolver",dt)}};if(ye){pe(),setTimeout(()=>{K({open:!0,title:"¿Cancelar Venta Completa?",message:`Este es el ÚLTIMO artículo de la venta. 

¿Prefieres CANCELAR toda la venta en lugar de hacer una devolución individual?
(Esto revertirá todo el ticket).`,onConfirm:async()=>{K({open:!1,title:"",message:"",onConfirm:null}),N&&xe(r.id)},onClose:()=>{K({open:!1,title:"",message:"",onConfirm:null}),Ce()}})},100);return}await Ce()})},[r,w,q]),de=s.useCallback(()=>{r&&(l==null||l(r))},[r,l]),ee=X.length,je=f.length;return e.jsxs($e,{"data-history-modal":!0,children:[e.jsxs(sn,{children:[e.jsxs(ln,{children:[e.jsxs("h2",{children:[e.jsx(Je,{})," Historial de Transacciones"]}),e.jsx(A,{$cancel:!0,onClick:x,children:e.jsx(Me,{})})]}),e.jsxs(dn,{children:[e.jsxs("div",{children:[e.jsxs("label",{children:[e.jsx(wt,{})," Buscar ID/Cliente:"]}),e.jsx(ve,{type:"text",placeholder:"ID o nombre",value:m,onChange:n=>j(n.target.value)})]}),e.jsxs("div",{children:[e.jsxs("label",{children:[e.jsx(rt,{})," Fecha:"]}),e.jsx(ve,{type:"date",value:E,onChange:n=>D(n.target.value)})]}),h&&e.jsxs("div",{children:[e.jsxs("label",{children:[e.jsx(vt,{})," Usuario:"]}),e.jsxs(ve,{as:"select",value:Y,onChange:n=>V(n.target.value),children:[e.jsx("option",{value:"",children:"Todos"}),Q.map(n=>e.jsx("option",{value:n.id_usuario??n.id,children:n.nombre_usuario??n.nombre},n.id_usuario??n.id))]})]}),e.jsxs("div",{children:[e.jsxs("label",{children:[e.jsx(Nt,{})," Estado:"]}),e.jsxs(ve,{as:"select",value:T,onChange:n=>ne(n.target.value),children:[e.jsx("option",{value:"",children:"Todos"}),e.jsx("option",{value:"COMPLETADA",children:"Completadas"}),e.jsx("option",{value:"CANCELADA",children:"Canceladas"}),e.jsx("option",{value:"DEVOLUCION",children:"Devoluciones"}),e.jsx("option",{value:"ABONO_CREDITO",children:"Abonos"})]})]})]}),e.jsxs(cn,{children:[e.jsxs(pn,{children:[e.jsxs(mn,{children:[e.jsx("small",{children:m?e.jsx("strong",{children:"Mostrando historial de búsqueda"}):`Resultados: ${ee}`}),e.jsxs(st,{$green:!0,children:["Mostrando ",je]})]}),b&&e.jsx(Ae,{style:{textAlign:"center",margin:".5rem 0"},children:"Cargando transacciones…"}),!b&&e.jsx(xn,{children:f.length?f.map(n=>e.jsx(gn,{sale:n,isSelected:(r==null?void 0:r.id)===n.id,onSelect:d,safeUsers:Q,safeClients:R},n.id)):e.jsx("p",{style:{textAlign:"center",color:"#6c757d",marginTop:"1rem"},children:"No se encontraron transacciones para la fecha y filtros seleccionados."})}),re>1&&e.jsxs(hn,{children:[e.jsx(A,{onClick:()=>oe(n=>Math.max(1,n-1)),disabled:M===1,title:"Anterior",children:e.jsx(kt,{})}),e.jsxs("span",{children:["Página ",M," de ",re]}),e.jsx(A,{onClick:()=>oe(n=>Math.min(re,n+1)),disabled:M===re,title:"Siguiente",children:e.jsx(St,{})})]})]}),r?r.estado==="ABONO_CREDITO"?e.jsxs(Se,{children:[e.jsxs("div",{style:{borderBottom:"2px dashed #ccc",paddingBottom:15,marginBottom:15},children:[e.jsxs("h3",{style:{margin:0,fontSize:"1.4rem",color:"#17a2b8",textAlign:"center"},children:[e.jsx(it,{})," Recibo de Abono"]}),e.jsxs("p",{style:{textAlign:"center",color:"#555",margin:"5px 0"},children:["#",r.id]})]}),e.jsx(Ae,{children:e.jsxs("div",{style:{display:"grid",gap:10},children:[e.jsxs(O,{children:[e.jsx("span",{children:"Fecha:"}),e.jsx("strong",{children:new Date(r.fecha).toLocaleString("es-NI")})]}),e.jsxs(O,{children:[e.jsx("span",{children:"Cliente:"}),e.jsx("strong",{style:{fontSize:"1.1rem"},children:((Ve=R.find(n=>n.id_cliente===(r.clientId||r.idCliente)))==null?void 0:Ve.nombre)||"Desconocido"})]}),e.jsxs(O,{children:[e.jsx("span",{children:"Cajero:"}),e.jsx("strong",{children:((We=Q.find(n=>(n.id_usuario??n.id)==r.userId))==null?void 0:We.nombre_usuario)||r.usuarioNombre||"Sistema"})]})]})}),e.jsx("div",{style:{margin:"20px 0",border:"1px solid #ddd",padding:15,borderRadius:8,background:"#f8f9fa"},children:e.jsxs(O,{style:{fontSize:"1.2rem",color:"#28a745"},children:[e.jsx("span",{children:"Monto Abonado:"}),e.jsxs("strong",{children:["C$ ",_e(r.totalVenta)]})]})}),e.jsx("div",{style:{display:"flex",justifyContent:"center",marginTop:20},children:e.jsxs(A,{onClick:de,style:{fontSize:"1.1rem",padding:"10px 20px"},children:[e.jsx(Pe,{})," Imprimir Comprobante"]})})]}):r.estado==="DEVOLUCION"?e.jsxs(Se,{children:[e.jsxs("h3",{style:{marginTop:0},children:["Detalle de Transacción #",r.id]}),e.jsxs("div",{className:"box",style:{marginTop:10},children:[e.jsxs("p",{children:[e.jsx("strong",{children:"Cliente:"})," ",((Be=R.find(n=>n.id_cliente===(r.clientId||r.idCliente)))==null?void 0:Be.nombre)||"Consumidor Final"]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Fecha:"})," ",new Date(r.fecha).toLocaleString("es-NI")]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Estado:"})," ",e.jsx("span",{style:{background:"#fff3cd",color:"#856404",padding:"2px 8px",borderRadius:8,fontWeight:700},children:"DEVOLUCIÓN"})]})]}),e.jsxs("div",{className:"box",style:{marginTop:10},children:[e.jsx("h4",{style:{marginTop:0},children:"Detalle de Devolución"}),e.jsx("ul",{style:{margin:0,paddingLeft:18},children:(r.items||[]).map((n,c)=>e.jsxs("li",{children:[e.jsx("strong",{children:ke(n,c)})," ","— ",Number(n.quantity||n.cantidad||0)," u. @ C$",Number(n.precio||n.precio_unitario||0).toFixed(2)]},`${n.id||n.id_producto}-${c}`))}),e.jsxs("p",{style:{marginTop:8},children:["Importe devuelto:"," ",e.jsxs("strong",{children:["C$",(()=>{const n=Number(r.totalVenta??r.total_venta??r.total??0);return Math.abs(n).toFixed(2)})()]})]})]}),e.jsx("div",{style:{display:"flex",justifyContent:"flex-start",gap:10,marginTop:12},children:e.jsx(A,{onClick:de,children:"Reimprimir Ticket"})})]}):r.estado==="CANCELADA"?e.jsxs(Se,{children:[e.jsxs("h3",{style:{marginTop:0,color:"#dc3545"},children:["Detalle de Venta Cancelada #",r.id]}),e.jsxs("div",{className:"box",style:{marginTop:10},children:[e.jsxs("p",{children:[e.jsx("strong",{children:"Cliente:"})," ",((qe=R.find(n=>n.id_cliente===(r.clientId||r.idCliente)))==null?void 0:qe.nombre)||"Consumidor Final"]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Fecha:"})," ",new Date(r.fecha).toLocaleString("es-NI")]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Estado:"})," ",e.jsx("span",{style:{background:"#f8d7da",color:"#721c24",padding:"2px 8px",borderRadius:8,fontWeight:700},children:"CANCELADA"})]})]}),e.jsxs("div",{className:"box",style:{marginTop:10},children:[e.jsx("h4",{style:{marginTop:0},children:"Productos Cancelados"}),!r.items||r.items.length===0?e.jsx("p",{style:{color:"#6c757d",fontStyle:"italic"},children:"No hay detalles de productos disponibles."}):e.jsx("ul",{style:{margin:0,paddingLeft:18,color:"#6c757d"},children:r.items.map((n,c)=>e.jsxs("li",{children:[e.jsx("strong",{children:ke(n,c)})," ","— ",Number(n.quantity||n.cantidad||0)," u."]},`${n.id||n.id_producto}-${c}`))}),e.jsxs("p",{style:{marginTop:8,color:"#dc3545",textDecoration:"line-through"},children:["Total Anulado: ",e.jsxs("strong",{children:["C$ ",_e(r.totalVenta)]})]})]}),e.jsx("div",{style:{display:"flex",justifyContent:"flex-start",gap:10,marginTop:12},children:e.jsx(A,{onClick:de,children:"Reimprimir Comprobante"})})]}):e.jsx(rn,{sale:r,client:R.find(n=>n.id_cliente===(r.clientId||r.idCliente)),creditStatus:null,dailySales:a,isAdmin:h,onOpenAbonoModal:()=>B(!0),onCancelSale:n=>xe(n),onReturnItem:(n,c)=>Te(n,c),onReprintTicket:de,showConfirmation:({onConfirm:n})=>ce("Confirmación","¿Confirmar acción?",n),showPrompt:({title:n,message:c,defaultValue:y,onConfirm:_})=>be(n,c,y,_),showAlert:({title:n,message:c})=>I(n,c)}):e.jsx(Se,{children:e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",color:"#aaa",fontStyle:"italic",flexDirection:"column"},children:[e.jsx(Je,{size:40,style:{marginBottom:10,opacity:.5}}),e.jsx("p",{children:"Seleccione una transacción para ver detalles"})]})})]}),v&&r&&e.jsx(Wt,{client:R.find(n=>n.id_cliente===(r.clientId||r.idCliente)),onClose:()=>B(!1),onAbonoSuccess:async()=>{B(!1),await q(r.id),F==null||F()},showAlert:({title:n,message:c})=>I(n,c)})]}),e.jsx(Dt,{isOpen:P.open,onClose:ge,title:P.title,message:P.message}),e.jsx(bn,{isOpen:!!se.open,title:se.title,message:se.message,onCancel:le,onConfirm:se.onConfirm||le}),e.jsx(jn,{isOpen:!!J.open,title:J.title,message:J.message,initialValue:J.initialValue,onCancel:pe,onConfirm:n=>{const c=J.onConfirm;pe(),c&&c(n)}})]})}const lt=({isOpen:t,children:o,maxWidth:x=450})=>t?e.jsx($e,{style:{zIndex:99999,backgroundColor:"rgba(0,0,0,0.6)"},children:e.jsx(Oe,{style:{maxWidth:`${x}px`,textAlign:"center"},children:o})}):null,bn=({isOpen:t,title:o,message:x,onCancel:h,onConfirm:C})=>e.jsxs(lt,{isOpen:t,children:[e.jsx("h2",{style:{marginTop:0},children:o}),e.jsx("p",{style:{color:"#6c757d",lineHeight:1.5},children:x}),e.jsxs("div",{style:{display:"flex",justifyContent:"center",gap:10,marginTop:10},children:[e.jsx(A,{onClick:h,$cancel:!0,children:"Cancelar"}),e.jsx(A,{onClick:C,primary:!0,children:"Aceptar"})]})]}),jn=({isOpen:t,title:o,message:x,initialValue:h="1",inputType:C="number",onCancel:g,onConfirm:l})=>{const[N,w]=s.useState(h);return s.useEffect(()=>{w(h)},[h,t]),e.jsxs(lt,{isOpen:t,children:[e.jsx("h2",{style:{marginTop:0},children:o}),x&&e.jsx("p",{style:{color:"#6c757d"},children:x}),e.jsx("input",{style:{width:"100%",padding:".6rem",borderRadius:8,border:"1px solid #dee2e6",margin:"8px 0 14px"},type:C,value:N,onChange:F=>w(F.target.value)}),e.jsxs("div",{style:{display:"flex",justifyContent:"center",gap:10},children:[e.jsx(A,{onClick:g,$cancel:!0,children:"Cancelar"}),e.jsx(A,{onClick:()=>l(N),primary:!0,children:"Aceptar"})]})]})},kn=Z.memo(un);export{Wt as A,kn as S,Nn as T};

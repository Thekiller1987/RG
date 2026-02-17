import{R as U,r as i,j as e,n as lt,J as dt,a8 as ct,D as pt,s as p,v as mt,x as Ee,aI as xt,aA as ze,C as ht,q as ft,ad as le,aS as gt,aE as We,h as qe,aT as et,aU as ut,K as bt,az as tt,ah as jt,X as He,Y as yt,S as Ct,aV as wt,aW as vt,aX as Nt,aY as nt,aZ as Ue,af as $e}from"./vendor-DfgwALhZ.js";import{c as ke,B as I,T as G,d as Re,I as Se,S as ye}from"./POS.styles-mxseP0n6.js";import{u as Fe,y as kt,i as St,a as $t}from"./index-vx8gNX1l.js";import{A as At}from"./AlertModal-DnqPm_iy.js";const Tt=p.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1050;
  backdrop-filter: blur(5px);
`,It=p.div`
  background: white; padding: 2rem; border-radius: 12px; width: 560px; max-width: 95%; max-height: 90vh; overflow-y: auto;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  animation: fadeIn 0.3s ease-out;
  @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
`,Dt=p.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;
  border-bottom: 1px solid #e9ecef; padding-bottom: 1rem;
`,Et=p.h2`margin: 0; font-size: 1.5rem; color: #333;`,Ft=p.button`
  border: none; background: none; font-size: 1.5rem; cursor: pointer; color: #888;
  &:hover { color: #333; }
`,Lt=p.form`display: flex; flex-direction: column; gap: 1.25rem;`,Ae=p.div`display: flex; flex-direction: column; gap: 0.5rem;`,Te=p.label`font-weight: 600; color: #495057; font-size: 0.9rem;`,Le=p.input`
  padding: 0.75rem; border: 1px solid #ccc; border-radius: 6px; font-size: 1rem;
  &:focus { border-color: #007bff; outline: none; box-shadow: 0 0 0 2px rgba(0,123,255,0.25); }
`,Mt=p(Le).attrs({as:"select"})``,Ge=p.button`
  padding: 0.85rem 1.5rem; background: #28a745; color: white; border: none;
  border-radius: 6px; font-weight: bold; display: flex; align-items: center; gap: 0.5rem;
  justify-content: center; cursor: pointer; transition: background-color 0.2s; font-size: 1rem;
  &:hover:not(:disabled) { background: #218838; }
  &:disabled { background: #6c757d; cursor: not-allowed; }
`,zt=p.p`
  margin: 0 0 0.5rem 0; padding: 0.75rem; background-color: #e9ecef; border-radius: 6px;
  color: #495057; text-align: center; font-size: 1rem;
  strong { color: #dc3545; }
`,Rt=p.p`
  margin-top: -1rem; margin-bottom: 0.5rem; padding: 0.5rem; color: #dc3545; font-size: 0.9rem; text-align: center;
`,Je=p(mt)`
  animation: spin 1s linear infinite;
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`,Ze=p.div`
  display: flex; flex-direction: column; gap: 0.5rem;
  max-height: 220px; overflow-y: auto; padding: 0.25rem;
`,Ye=p.div`
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
`,xe=t=>`C$${Number(t||0).toFixed(2)}`,Qe=t=>t?new Date(t).toLocaleDateString("es-NI",{timeZone:"America/Managua",day:"2-digit",month:"2-digit",year:"numeric"}):"—",_t=({client:t,onClose:n,onAbonoSuccess:m,showAlert:x})=>{const{addCajaTransaction:j,user:f}=Fe(),[s,v]=i.useState(""),[y,D]=i.useState("Efectivo"),[u,l]=i.useState(""),[$,A]=i.useState(!1),[N,a]=i.useState(""),[R,T]=i.useState([]),[h,k]=i.useState(!0),[C,J]=i.useState(null),P=i.useMemo(()=>Number(t==null?void 0:t.saldo_pendiente)||0,[t]);i.useEffect(()=>{const d=async()=>{k(!0);try{const w=localStorage.getItem("token"),W=await St(t.id_cliente,w);T(Array.isArray(W)?W:[])}catch(w){console.error("Error cargando tickets:",w),T([])}finally{k(!1)}};t!=null&&t.id_cliente&&d()},[t]);const E=i.useMemo(()=>R.filter(d=>d.saldoRestante>0),[R]),ee=i.useMemo(()=>R.filter(d=>d.saldoRestante<=0),[R]),M=C?Math.min(P,C.saldoRestante):P;i.useEffect(()=>{if(!s){a("");return}const d=parseFloat(s);isNaN(d)||d<=0?a("Ingrese un monto válido mayor a cero."):d>M?a(`El máximo es ${xe(M)}.`):a("")},[s,M]);const te=d=>{d.saldoRestante<=0||(J(w=>(w==null?void 0:w.idVenta)===d.idVenta?null:d),v(""))},Z=()=>{v(C?C.saldoRestante.toFixed(2):P.toFixed(2))},z=i.useCallback(async d=>{d.preventDefault();const w=parseFloat(s),W=localStorage.getItem("token");if(N||!w||w<=0){x==null||x({title:"Monto Inválido",message:N||"Revise el monto ingresado."});return}if(y!=="Efectivo"&&!u.trim()){x==null||x({title:"Referencia Requerida",message:"Ingrese el número de referencia, transferencia o voucher."});return}A(!0);try{await kt(t.id_cliente,{monto:w,id_venta:(C==null?void 0:C.idVenta)||null,pagoDetalles:{metodo:y,usuario:(f==null?void 0:f.nombre_usuario)||"Desconocido",referencia:u||"",ticketRef:C?`Venta #${C.idVenta}`:"FIFO"}},W);const O=y==="Efectivo",H={id:`abono-${Date.now()}`,type:"abono",amount:w,note:`Abono Cliente: ${t.nombre} (${y})${C?` - Venta #${C.idVenta}`:""} ${u?"- Ref: "+u:""}`,at:new Date().toISOString(),pagoDetalles:{clienteId:t.id_cliente,clienteNombre:t.nombre,metodo:y,referencia:u,ingresoCaja:O?w:0,efectivo:O?w:0,tarjeta:y==="Tarjeta"?w:0,transferencia:y==="Transferencia"?w:0,credito:0}};await j(H),m==null||m(H),n==null||n()}catch(O){console.error("Error al registrar abono:",O),x==null||x({title:"Error",message:`No se pudo registrar el abono. ${O.message}`})}finally{A(!1)}},[s,y,u,N,t,f,C,j,m,n,x]),r=$||P<=0||!!N||!s;return e.jsx(Tt,{children:e.jsxs(It,{children:[e.jsxs(Dt,{children:[e.jsx(Et,{children:"Registrar Abono"}),e.jsx(Ft,{onClick:n,disabled:$,children:e.jsx(lt,{})})]}),e.jsxs("p",{children:["Cliente: ",e.jsx("strong",{children:(t==null?void 0:t.nombre)||"Desconocido"})]}),e.jsxs(zt,{children:["Saldo Pendiente Total: ",e.jsx("strong",{children:xe(P)})]}),h?e.jsxs("div",{style:{textAlign:"center",padding:"1rem",color:"#6c757d"},children:[e.jsx(Je,{})," Cargando facturas..."]}):E.length>0?e.jsxs(e.Fragment,{children:[e.jsxs(Ot,{children:[e.jsx(dt,{})," Selecciona una factura (opcional — si no, paga la más antigua):"]}),e.jsx(Ze,{children:E.map(d=>e.jsxs(Ye,{$selected:(C==null?void 0:C.idVenta)===d.idVenta,onClick:()=>te(d),children:[e.jsxs("div",{className:"ticket-info",children:[e.jsxs("span",{className:"ticket-id",children:["Venta #",d.idVenta]}),e.jsx("span",{className:"ticket-date",children:Qe(d.fecha)})]}),e.jsxs("div",{className:"ticket-amounts",children:[d.montoOriginal!==d.saldoRestante&&e.jsx("div",{className:"original",children:xe(d.montoOriginal)}),e.jsx("div",{className:"remaining",children:xe(d.saldoRestante)})]})]},d.idVenta))}),ee.length>0&&e.jsxs("details",{style:{marginTop:"0.5rem"},children:[e.jsxs("summary",{style:{cursor:"pointer",fontSize:"0.85rem",color:"#6c757d"},children:[e.jsx(ct,{style:{color:"#28a745"}})," ",ee.length," factura(s) pagada(s)"]}),e.jsx(Ze,{style:{marginTop:"0.5rem"},children:ee.map(d=>e.jsxs(Ye,{$paid:!0,children:[e.jsxs("div",{className:"ticket-info",children:[e.jsxs("span",{className:"ticket-id",children:["Venta #",d.idVenta]}),e.jsx("span",{className:"ticket-date",children:Qe(d.fecha)})]}),e.jsx("div",{className:"ticket-amounts",children:e.jsx("div",{className:"remaining",style:{color:"#28a745"},children:"Pagada ✔"})})]},d.idVenta))})]})]}):null,e.jsxs(Lt,{onSubmit:z,children:[e.jsxs(Ae,{children:[e.jsxs(Te,{htmlFor:"montoAbono",children:["Monto a Abonar (C$)",C&&e.jsxs("span",{style:{fontWeight:"normal",color:"#007bff",marginLeft:"0.5rem"},children:["— Venta #",C.idVenta," (máx: ",xe(M),")"]})]}),e.jsxs("div",{style:{display:"flex",gap:"0.5rem"},children:[e.jsx(Le,{id:"montoAbono",type:"number",value:s,onChange:d=>v(d.target.value),placeholder:"0.00",required:!0,autoFocus:!0,step:"0.01",min:"0.01",max:M?M.toFixed(2):void 0,disabled:$||P<=0,style:{flex:1}}),e.jsx(Ge,{type:"button",onClick:Z,style:{background:"#007bff",padding:"0.5rem 0.75rem",fontSize:"0.85rem"},disabled:$||P<=0,children:"Total"})]})]}),e.jsxs(Ae,{children:[e.jsx(Te,{htmlFor:"metodoPago",children:"Método de Pago"}),e.jsxs(Mt,{id:"metodoPago",value:y,onChange:d=>D(d.target.value),disabled:$,children:[e.jsx("option",{value:"Efectivo",children:"Efectivo"}),e.jsx("option",{value:"Tarjeta",children:"Tarjeta"}),e.jsx("option",{value:"Transferencia",children:"Transferencia"})]})]}),y!=="Efectivo"&&e.jsxs(Ae,{children:[e.jsx(Te,{htmlFor:"referencia",children:"Referencia / Voucher / N° Transferencia"}),e.jsx(Le,{id:"referencia",type:"text",value:u,onChange:d=>l(d.target.value),placeholder:"Ej: BAC-123456",required:!0})]}),N&&e.jsx(Rt,{children:N}),e.jsx(Ge,{type:"submit",disabled:r,children:$?e.jsxs(e.Fragment,{children:[e.jsx(Je,{})," Procesando..."]}):e.jsxs(e.Fragment,{children:[e.jsx(pt,{})," Registrar Abono"]})})]})]})})},Pt=U.memo(_t),Vt=ft`
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
`,Bt=p.div`
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
`,Wt=p.div`
  display: flex; flex-direction: column; gap: 12px;
  max-height: 60vh;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    max-height: 65vh;
  }
`,qt=p.img`
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
`,Ce=p.span`
  display: inline-flex; align-items: center; gap: 6px;
  font-weight: 900; letter-spacing: .5px; padding: 5px 10px; border-radius: 4px;
  font-size: 0.85rem;
  ${({$type:t})=>t==="proforma"&&le`background: #e8f4ff; color: #0b72b9; border: 2px solid #0b72b9;`}
  ${({$type:t})=>t==="abono"&&le`background: #fff3cd; color: #856404; border: 2px solid #856404;`}
  ${({$type:t})=>t==="venta"&&le`background: #e8f7ee; color: #1c7d3a; border: 2px solid #1c7d3a;`}
  ${({$type:t})=>t==="outflow"&&le`background: #fee2e2; color: #991b1b; border: 2px solid #991b1b;`}
`,Ht=p.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 1rem; border-bottom: 2px solid #e2e8f0; padding-bottom: .75rem;
  flex-wrap: wrap; gap: 8px;

  h2 { font-size: 1.1rem; }

  @media (max-width: 600px) {
    flex-direction: column; align-items: stretch;
    h2 { font-size: 1rem; }
  }
`,Ut=p.div`
  display: flex; gap: 8px; flex-wrap: wrap;
  
  @media (max-width: 600px) {
    justify-content: stretch;
    button { flex: 1; font-size: 0.85rem; padding: 10px 8px; }
  }
`,Xe=p(Re)`
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
`,re=t=>new Intl.NumberFormat("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(t||0)),S=(...t)=>t.find(n=>n!=null),ae=t=>S(t==null?void 0:t.usuarioNombre,t==null?void 0:t.nombre_usuario,t==null?void 0:t.nombre,t==null?void 0:t.name,t==null?void 0:t.displayName,t==null?void 0:t.fullName,t==null?void 0:t.username,null);function Gt(t=[]){return t.map((n,m)=>{const x=Number(S(n.quantity,n.cantidad,n.qty,0)),j=S(n.nombre,n.descripcion,n.description,n.producto,`Item ${m+1}`),f=Number(S(n.precio_unitario,n.precio_venta,n.precio,n.unitPrice,0));return{id:S(n.id_producto,n.id,`it-${m}`),nombre:j,quantity:x,unit:f,total:x*f}})}function Jt(t={}){const n=Number(t.efectivo||0),m=Number(t.tarjeta||0),x=Number(t.transferencia||0),j=Number(t.dolares||0);if(Number(t.credito||0)>0)return"Crédito";const s=[];return n>0&&s.push("Efectivo"),m>0&&s.push("Tarjeta"),x>0&&s.push("Transferencia"),j>0&&s.push("Dólares"),s.length===0?"Contado":s.length===1?s[0]:"Mixto"}function Zt(t={},n=0){const m=Number(t.efectivo||0),x=Number(t.tarjeta||0),j=Number(t.transferencia||0),f=Number(t.otro||0),s=Number(t.dolares||0),v=Number(t.tasaDolarAlMomento||t.tasaObtenida||1),y=s*(v>1?v:1),D=m+x+j+f+y;return D>0?D:Number(t.montoRecibido||n||0)}function Yt(t){const n=S(t==null?void 0:t.fecha,t==null?void 0:t.createdAt,t==null?void 0:t.created_at,t==null?void 0:t.date,t);try{const m=new Date(n);return isNaN(m)?"Fecha inválida":m.toLocaleString("es-NI",{hour12:!0})}catch{return"Fecha inválida"}}function Qt(t){const n=S(t.proformaId,t.proformaNumero,t.numeroProforma,t.id);if(n)return n;const m=new Date,x=m.toISOString().slice(2,10).replace(/-/g,""),j=m.toTimeString().slice(0,8).replace(/:/g,"");return`PF-${x}-${j}`}const Nn=({transaction:t,onClose:n,clients:m=[],users:x=[],isOpen:j=!0,printMode:f="80",currentUser:s=null,onPersistPrint:v=null,autoTriggerPrint:y=!1,showAlert:D=null})=>{var se;const{user:u}=typeof Fe=="function"?Fe():{user:null},{settings:l}=$t();if(!j||t==null)return null;const[$]=U.useState(typeof t=="object"?t:null),[A]=U.useState(!1),[N]=U.useState(null);if(A||N||!$)return e.jsx(ke,{className:"no-print",children:e.jsxs(Xe,{className:"no-print",style:{maxWidth:420,padding:"1rem"},children:[e.jsx("h3",{style:{color:"#dc3545"},children:"No se pudo imprimir"}),e.jsx("div",{style:{display:"flex",justifyContent:"center",marginTop:12},children:e.jsxs(I,{onClick:n,$cancel:!0,children:[e.jsx(Ee,{})," Cerrar"]})})]})});const a=$,R=a.estado==="ABONO_CREDITO",T=!!(a.isProforma||a.proformaFor||a.proformaNombre),h=!!a.isOutflow,k=a.estado==="DEVOLUCION",C=T?Qt(a):S(a.id,a.saleId,a.numero,"-"),J=Yt(S(a.fecha,a.createdAt,a.date)),P=S(a.clientId,a.idCliente,a.clienteId),E=m.find(g=>String(g.id_cliente??g.id)===String(P)),ee=T&&a.proformaNombre?a.proformaNombre:S(E==null?void 0:E.nombre,a.clienteNombre,"Consumidor Final"),M=(E==null?void 0:E.cedula)||a.clienteCedula,te=S(a.userId,a.idUsuario,(se=a.openedBy)==null?void 0:se.id)??(s==null?void 0:s.id_usuario)??(s==null?void 0:s.id)??(s==null?void 0:s.uid)??(u==null?void 0:u.id_usuario)??(u==null?void 0:u.id)??(u==null?void 0:u.uid),Z=(()=>{try{return JSON.parse(localStorage.getItem("authUser")||"null")}catch{return null}})(),z=x.find(g=>String(g.id_usuario||g.id||g.uid)===String(te)),r=S(a.usuarioNombre,ae(z),ae(s),ae(u),ae(Z),"Cajero POS"),d=T?S(a.usuarioNombre,ae(s),ae(u),ae(Z),r):r,w=Gt(S(a.items,a.detalle,[])),W=w.reduce((g,Q)=>g+Number(Q.unit)*Number(Q.quantity),0),O=Number(S(a.subtotal,W)),H=Number(S(a.descuento,0)),F=Number(S(a.totalVenta,a.total_venta,O-H,0)),he=a.pagoDetalles||{},ie=T||h?"N/A":S(a.metodoPago,Jt(he)),Y=T||h?0:Zt(he,F),de=T||h?0:Math.max(0,Y-F);Math.abs(Number(S(a.totalVenta,a.montoAbono,0))),Number((E==null?void 0:E.saldo_pendiente)||0);const ce=w.length<=2,L={name:(l==null?void 0:l.empresa_nombre)||"Multirepuestos RG",ruc:(l==null?void 0:l.empresa_ruc)||"1211812770001E",phone:(l==null?void 0:l.empresa_telefono)||"84031936 / 84058142",address:(l==null?void 0:l.empresa_direccion)||"Del portón de la normal 75 varas al este. Juigalpa, Chontales.",slogan:(l==null?void 0:l.empresa_eslogan)||"Repuestos de confianza al mejor precio",logo:l!=null&&l.empresa_logo_url?l.empresa_logo_url.startsWith("http")?l.empresa_logo_url:`undefined${l.empresa_logo_url}`:new URL("/icons/logo.png",window.location.origin).toString()};U.useCallback(async g=>{},[]);const ne=U.useCallback((g="80",Q=!1)=>{const oe=document.getElementById("print-wrapper-ticket");if(!oe)return;const fe=oe.outerHTML,X=`
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
    `,_=window.open("","_blank","width=900,height=700");_&&(_.document.write(`<html><head><title>Impresión ${g.toUpperCase()} - ${L.name}</title><style>${X}</style></head><body>${fe}</body></html>`),_.document.close(),_.focus(),setTimeout(()=>{try{_.print()}catch(me){console.error("Print error:",me)}setTimeout(()=>{try{_.close()}catch{}},1e3)},400),Q&&setTimeout(()=>{n&&n()},800))},[L,n]),pe=i.useRef(!1);return i.useEffect(()=>{if(y&&!pe.current){pe.current=!0;const g=setTimeout(()=>ne("80",!0),500);return()=>clearTimeout(g)}},[y,ne]),e.jsxs(ke,{className:"no-print",children:[e.jsx(Vt,{}),e.jsxs(Xe,{className:"no-print",children:[e.jsxs(Ht,{children:[e.jsxs("h2",{style:{display:"flex",alignItems:"center",gap:8,margin:0},children:[e.jsx(xt,{color:"#2563eb"})," Vista de Impresión"]}),e.jsxs(Ut,{children:[e.jsxs(I,{onClick:()=>ne("80"),style:{background:"#2563eb",color:"#fff",fontWeight:700},children:[e.jsx(ze,{})," 80mm"]}),e.jsxs(I,{onClick:()=>ne("A4"),style:{background:"#0f766e",color:"#fff",fontWeight:700},children:[e.jsx(ht,{})," A4"]}),e.jsx(I,{$cancel:!0,onClick:n,style:{background:"#fee2e2",color:"#ef4444"},children:e.jsx(Ee,{})})]})]}),e.jsx(Wt,{children:e.jsxs(Bt,{id:"print-wrapper-ticket",className:`print-area ${f==="A4"?"print-a4":"print-80"} ${ce?"compact":""}`,children:[e.jsxs("div",{className:"brand",children:[e.jsx("div",{className:"brand-logo-container",children:e.jsx(qt,{className:f==="A4"?"logo-a4":"logo-80mm",src:L.logo,alt:"Logo",onError:g=>{g.currentTarget.style.display="none"}})}),e.jsxs("div",{className:"brand-info",children:[e.jsx("h1",{children:L.name}),e.jsx("small",{children:e.jsx("strong",{children:L.slogan})}),e.jsxs("small",{children:[e.jsx("strong",{children:"RUC:"})," ",L.ruc]}),e.jsxs("small",{children:[e.jsx("strong",{children:"Tel:"})," ",L.phone]}),e.jsx("small",{children:L.address}),e.jsx("div",{style:{marginTop:8},children:T?e.jsx(Ce,{$type:"proforma",className:"ticket-tag",children:"PROFORMA"}):R?e.jsx(Ce,{$type:"abono",className:"ticket-tag",children:"RECIBO"}):h?e.jsx(Ce,{$type:"outflow",className:"ticket-tag",children:"SALIDA"}):e.jsx(Ce,{$type:"venta",className:"ticket-tag",children:k?"DEVOLUCIÓN":"FACTURA"})})]})]}),e.jsxs("div",{className:"meta",children:[e.jsxs("div",{className:"meta-col",children:[e.jsx("span",{className:"meta-title",children:"Detalles del Documento"}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Fecha:"}),e.jsx("span",{className:"meta-value",children:J})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"No. Documento:"}),e.jsx("span",{className:"meta-value",children:C})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Atendido por:"}),e.jsx("span",{className:"meta-value",children:d})]})]}),e.jsxs("div",{className:"meta-col",children:[e.jsx("span",{className:"meta-title",children:"Datos del Cliente"}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Cliente:"}),e.jsx("span",{className:"meta-value",children:ee})]}),M&&e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Cédula/RUC:"}),e.jsx("span",{className:"meta-value",children:M})]}),!T&&!h&&e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Pago:"}),e.jsx("span",{className:"meta-value",children:ie})]})]})]}),e.jsxs("table",{className:"items",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{className:"col-qty",children:"Cant."}),e.jsx("th",{children:"Descripción"}),e.jsx("th",{className:"text-right col-unit",children:"P. Unit"}),e.jsx("th",{className:"text-right col-total",children:"Total"})]})}),e.jsx("tbody",{children:w.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:"4",style:{textAlign:"center"},children:"Sin ítems"})}):w.map(g=>e.jsxs("tr",{children:[e.jsx("td",{className:"col-qty",style:{fontWeight:800},children:g.quantity}),e.jsx("td",{style:{fontWeight:600},children:g.nombre}),e.jsxs("td",{className:"text-right col-unit",children:["C$",re(g.unit)]}),e.jsxs("td",{className:"text-right col-total",style:{fontWeight:700},children:["C$",re(g.total)]})]},g.id))})]}),e.jsx("div",{className:"totals",children:e.jsxs("div",{className:"totals-box",children:[e.jsxs(G,{children:[e.jsx("span",{style:{fontWeight:700},children:"Subtotal:"}),e.jsxs("span",{style:{fontWeight:700},children:["C$",re(O)]})]}),H>0&&e.jsxs(G,{style:{color:"#dc3545"},children:[e.jsx("span",{style:{fontWeight:700},children:"Descuento:"}),e.jsxs("span",{style:{fontWeight:700},children:["- C$",re(H)]})]}),e.jsxs(G,{className:"grand-total",$bold:!0,style:{fontSize:"1.3em",borderTop:"2px solid #000",marginTop:5,paddingTop:5},children:[e.jsx("span",{style:{fontWeight:900},children:"TOTAL:"}),e.jsxs("span",{style:{fontWeight:900},children:["C$",re(F)]})]}),!T&&e.jsxs(e.Fragment,{children:[e.jsxs(G,{style:{marginTop:10,fontSize:"0.9em"},children:[e.jsx("span",{style:{fontWeight:700},children:"Pagado:"}),e.jsxs("span",{style:{fontWeight:700},children:["C$",re(Y)]})]}),de>0&&e.jsxs(G,{$bold:!0,style:{color:"#dc3545",fontWeight:900},children:[e.jsx("span",{children:"Cambio:"}),e.jsxs("span",{children:["C$",re(de)]})]})]})]})}),e.jsxs("div",{className:"footer-sign no-show-80",children:[e.jsx("div",{className:"sign-box",children:"Entregado por"}),e.jsx("div",{className:"sign-box",children:"Recibido por"})]}),e.jsxs("div",{className:"thanks",children:[e.jsx("p",{children:e.jsxs("strong",{children:['"',L.slogan,'"']})}),e.jsx("p",{style:{whiteSpace:"pre-line",marginTop:"5px"},children:T?(l==null?void 0:l.ticket_proforma_footer)||"Cotización válida por 15 días.":h?(l==null?void 0:l.ticket_transfer_footer)||"Salida de Inventario.":(l==null?void 0:l.ticket_sales_footer)||"¡Gracias por su compra!"})]})]})})]})]})},q=t=>Number(t||0).toFixed(2),Xt=(t,n=0)=>(t==null?void 0:t.nombre)??(t==null?void 0:t.name)??(t==null?void 0:t.producto)??(t==null?void 0:t.descripcion)??`Item ${n+1}`,Ke=p.div`
  border-left: 1px solid #e9ecef; padding-left: 1.5rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1.2rem;
`,we=p.div`
  background-color: #fff; border: 1px solid #e9ecef; border-radius: 8px; padding: 1.2rem;
  h4 { margin-top: 0; margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem; color: #495057; }
`,Kt=p.table`
  width: 100%; border-collapse: collapse; font-size: 0.9rem;
  th, td { padding: 0.6rem; text-align: left; border-bottom: 1px solid #f1f1f1; }
  th { font-weight: 600; color: #6c757d; }
  td:nth-child(3), td:nth-child(4) { text-align: right; }
`,B=p.div`
  display: flex; justify-content: space-between; padding: 0.4rem 0; font-size: 0.95rem; font-weight: ${t=>t.$bold?"600":"normal"};
  border-top: ${t=>t.$bordered?"1px dashed #ccc":"none"}; color: ${t=>t.color||"inherit"};
  span:first-child { color: #6c757d; }
`,en=p.div`
  display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1rem;
`,tn=p.span`
  font-weight: bold; padding: 0.25rem 0.5rem; border-radius: 4px; color: white; background-color: ${t=>t.color};
`,nn=({sale:t,client:n,creditStatus:m,dailySales:x,isAdmin:j,onOpenAbonoModal:f,onCancelSale:s,onReturnItem:v,onReprintTicket:y,showConfirmation:D,showPrompt:u,showAlert:l})=>{const $=i.useMemo(()=>!(!t||t.estado!=="COMPLETADA"),[t]);if(!t)return e.jsx(Ke,{style:{justifyContent:"center",alignItems:"center"},children:e.jsxs(Se,{children:[e.jsx(gt,{})," Seleccione una transacción de la lista para ver sus detalles."]})});const N={COMPLETADA:{text:"COMPLETADA",color:"#28a745"},CANCELADA:{text:"CANCELADA",color:"#dc3545"},DEVOLUCION:{text:"DEVOLUCIÓN",color:"#ffc107"},ABONO_CREDITO:{text:"ABONO A CRÉDITO",color:"#17a2b8"}}[t.estado]||{text:t.estado,color:"#6c757d"},a=t.estado==="COMPLETADA",R=(h,k)=>{if($){if(!v){l==null||l({title:"Config",message:"Falta onReturnItem en props.",type:"error"});return}v(h,k)}},T=()=>{if($){if(!s){l==null||l({title:"Config",message:"Falta onCancelSale en props.",type:"error"});return}D==null||D({title:"Cancelar Venta",message:`Esta acción revertirá stock y (si aplica) crédito del cliente.

¿Cancelar la venta #${t.id}?`,onConfirm:()=>s(t.id)})}};return e.jsxs(Ke,{children:[e.jsxs("h3",{children:["Detalle de Transacción #",t.id]}),n&&m&&e.jsxs(Se,{$type:"info",style:{flexDirection:"column",alignItems:"stretch",gap:"1rem"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("span",{style:{fontWeight:"bold"},children:["Estado de Cuenta: ",n.nombre]}),e.jsxs(I,{$primary:!0,onClick:f,disabled:m.currentBalance<=0,children:[e.jsx(We,{})," Registrar Abono"]})]}),e.jsxs(B,{$bold:!0,color:m.currentBalance>0?"#dc3545":"#28a745",children:[e.jsx("span",{children:"SALDO PENDIENTE TOTAL:"}),e.jsxs("span",{children:["C$",m.currentBalance.toFixed(2)]})]})]}),e.jsxs(we,{children:[e.jsxs("p",{children:[e.jsxs("strong",{children:[e.jsx(qe,{})," Cliente:"]})," ",(n==null?void 0:n.nombre)||"Cliente Genérico"]}),e.jsxs("p",{children:[e.jsxs("strong",{children:[e.jsx(et,{})," Fecha:"]})," ",new Date(t.fecha).toLocaleString("es-NI")]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Estado:"})," ",e.jsx(tn,{color:N.color,children:N.text})]})]}),a&&e.jsxs(e.Fragment,{children:[Array.isArray(t.items)&&t.items.length>0&&e.jsxs(we,{children:[e.jsx("h4",{children:"Productos"}),e.jsxs(Kt,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Producto"}),e.jsx("th",{children:"Cant."}),e.jsx("th",{children:"P. Unit."}),e.jsx("th",{children:"Subtotal"}),e.jsx("th",{})]})}),e.jsx("tbody",{children:t.items.map((h,k)=>e.jsxs("tr",{children:[e.jsx("td",{children:Xt(h,k)}),e.jsx("td",{children:(h==null?void 0:h.quantity)??(h==null?void 0:h.cantidad)??0}),e.jsxs("td",{children:["C$",q(h==null?void 0:h.precio)]}),e.jsxs("td",{children:["C$",q(((h==null?void 0:h.quantity)??(h==null?void 0:h.cantidad)??0)*((h==null?void 0:h.precio)??0))]}),e.jsx("td",{children:$&&e.jsx(I,{$warning:!0,$small:!0,onClick:()=>R(h,k),title:"Devolver",children:e.jsx(ut,{})})})]},(h&&(h.id_producto||h.id))??k))})]})]}),e.jsxs(we,{children:[e.jsx("h4",{children:"Resumen Financiero de esta Venta"}),t.subtotal!==void 0&&e.jsxs(B,{children:[e.jsx("span",{children:"Subtotal:"}),e.jsxs("span",{children:["C$",q(t.subtotal)]})]}),t.descuento>0&&e.jsxs(B,{children:[e.jsx("span",{children:"Descuento:"}),e.jsxs("span",{style:{color:"#dc3545"},children:["- C$",q(t.descuento)]})]}),e.jsxs(B,{$bold:!0,$bordered:!0,children:[e.jsx("span",{children:"Total Transacción:"}),e.jsxs("span",{children:["C$",q(Math.abs(t.totalVenta))]})]}),t.pagoDetalles&&e.jsxs("div",{style:{marginTop:"1rem"},children:[e.jsx("h5",{style:{marginBottom:"0.5rem",fontSize:"1rem"},children:"Detalle del Pago:"}),t.pagoDetalles.efectivo>0&&e.jsxs(B,{children:[e.jsxs("span",{children:[e.jsx(We,{})," Efectivo Recibido:"]}),e.jsxs("span",{children:["C$",q(t.pagoDetalles.efectivo)]})]}),t.pagoDetalles.tarjeta>0&&e.jsxs(e.Fragment,{children:[e.jsxs(B,{children:[e.jsxs("span",{children:[e.jsx(bt,{})," Tarjeta:"]}),e.jsxs("span",{children:["C$",q(t.pagoDetalles.tarjeta)]})]}),t.pagoDetalles.referenciaTarjeta&&e.jsxs(B,{style:{fontSize:"0.85rem",color:"#666",paddingLeft:"1.5rem"},children:[e.jsx("span",{children:"↳ Ref:"}),e.jsx("span",{children:t.pagoDetalles.referenciaTarjeta})]})]}),t.pagoDetalles.transferencia>0&&e.jsxs(e.Fragment,{children:[e.jsxs(B,{children:[e.jsxs("span",{children:[e.jsx(tt,{})," Transferencia:"]}),e.jsxs("span",{children:["C$",q(t.pagoDetalles.transferencia)]})]}),t.pagoDetalles.referenciaTransferencia&&e.jsxs(B,{style:{fontSize:"0.85rem",color:"#666",paddingLeft:"1.5rem"},children:[e.jsx("span",{children:"↳ Ref:"}),e.jsx("span",{children:t.pagoDetalles.referenciaTransferencia})]})]}),t.pagoDetalles.credito>0&&e.jsxs(B,{children:[e.jsxs("span",{children:[e.jsx(qe,{})," Crédito Otorgado:"]}),e.jsxs("span",{style:{color:"#dc3545"},children:["C$",q(t.pagoDetalles.credito)]})]}),t.pagoDetalles.vuelto>0&&e.jsxs(B,{children:[e.jsx("span",{children:"Vuelto Entregado:"}),e.jsxs("span",{children:["- C$",q(t.pagoDetalles.vuelto)]})]})]})]})]}),t.estado!=="CANCELADA"&&e.jsxs(we,{children:[e.jsx("h4",{children:"Acciones"}),e.jsxs(en,{children:[e.jsxs(I,{onClick:y,children:[e.jsx(ze,{})," Reimprimir Ticket"]}),$&&e.jsxs(I,{$cancel:!0,onClick:T,children:[e.jsx(jt,{})," Cancelar Venta"]})]})]})]})},on=U.memo(nn),Ie=()=>{const t=new Date,n=t.toLocaleString("en-US",{year:"numeric",timeZone:"America/Managua"}),m=t.toLocaleString("en-US",{month:"2-digit",timeZone:"America/Managua"}),x=t.toLocaleString("en-US",{day:"2-digit",timeZone:"America/Managua"});return`${n}-${m}-${x}`},Me=t=>new Intl.NumberFormat("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(t||0)),rn=t=>{if(!t)return{label:"N/A",icon:null};const{efectivo:n,tarjeta:m,transferencia:x,credito:j}=t;if(Number(j)>0)return{label:"Crédito",icon:e.jsx(Ue,{style:{color:"#dc3545"}})};const f=[];if(Number(n)>0&&f.push("Efectivo"),Number(m)>0&&f.push("Tarjeta"),Number(x)>0&&f.push("Transferencia"),f.length===1){const s=f[0];return s==="Efectivo"?{label:"Efectivo",icon:e.jsx($e,{style:{color:"#28a745"}})}:s==="Tarjeta"?{label:"Tarjeta",icon:e.jsx(Ue,{style:{color:"#007bff"}})}:{label:"Transferencia",icon:e.jsx(tt,{style:{color:"#007bff"}})}}return f.length>1?{label:"Mixto",icon:e.jsx($e,{style:{color:"#ffc107"}})}:{label:"Contado",icon:e.jsx($e,{style:{color:"#28a745"}})}},ve=(t,n=0)=>(t==null?void 0:t.nombre)??(t==null?void 0:t.name)??(t==null?void 0:t.producto)??(t==null?void 0:t.descripcion)??`Item ${n+1}`,an=p(Re)`
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
`,sn=p.div`
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid #dee2e6;
  h2 { display: flex; align-items: center; gap: .5rem; margin: 0; }
`,ln=p.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(180px, 1fr));
  gap: .75rem 1rem; margin-bottom: 1rem;

  @media (max-width: 1100px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 520px) { grid-template-columns: 1fr; }

  label { display: block; font-size: .9rem; color: #6c757d; margin-bottom: .25rem; }
`,dn=p.div`
  display: grid; grid-template-columns: 380px 1fr; gap: 1rem; flex: 1; min-height: 0;
  @media (max-width: 1024px) { grid-template-columns: 1fr; }
`,cn=p.div`
  background: #f8f9fa; border-radius: 12px; padding: .75rem; display: flex;
  flex-direction: column; min-height: 0;
`,Ne=p.div`
  background: #fff; border-radius: 12px; padding: 1rem; min-height: 0;
  box-shadow: 0 2px 10px rgba(0,0,0,.06);
`,pn=p.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: .5rem;
  small { color: #6c757d; }
`,mn=p.div`
  flex: 1; overflow: auto; padding-right: 4px; min-height: 200px;
`,xn=p.div`
  display: flex; justify-content: center; align-items: center; gap: .75rem;
  padding-top: .5rem; border-top: 1px solid #e9ecef;
`,hn=p.div`
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
`,fn=p.span`
  display: inline-flex; align-items: center; justify-content: center;
  border-radius: 9999px; padding: .25rem .6rem; font-weight: 700; font-size: .8rem;
  ${t=>t.$green&&le`background:#e8f7ee; color:#198754;`}
  ${t=>t.$red&&le`background:#fdecec; color:#dc3545;`}
`,gn=U.memo(function({sale:n,isSelected:m,onSelect:x,safeUsers:j,safeClients:f}){const s={COMPLETADA:"#28a745",CANCELADA:"#dc3545",DEVOLUCION:"#ffc107",ABONO_CREDITO:"#17a2b8"},v=i.useMemo(()=>{var A,N;return((A=(j||[]).find(a=>((a==null?void 0:a.id_usuario)??(a==null?void 0:a.id))==(n==null?void 0:n.userId)))==null?void 0:A.nombre_usuario)||((N=n==null?void 0:n.usuario)==null?void 0:N.nombre_usuario)||(n==null?void 0:n.userName)||(n==null?void 0:n.vendedor)||"N/A"},[j,n]),y=i.useMemo(()=>{var A,N;return((A=(f||[]).find(a=>(a==null?void 0:a.id_cliente)===((n==null?void 0:n.clientId)||(n==null?void 0:n.idCliente))))==null?void 0:A.nombre)||((N=n==null?void 0:n.cliente)==null?void 0:N.nombre)||(n==null?void 0:n.clientName)||"Consumidor Final"},[f,n]),D=Number(n.totalVenta??n.total_venta??n.total??0),u=rn(n.pagoDetalles),l=n.estado==="ABONO_CREDITO"?e.jsxs(e.Fragment,{children:[e.jsx(nt,{style:{marginRight:6}})," ABONO"]}):e.jsxs(e.Fragment,{children:["#",n.id," - ",n.estado.replace("_"," ")]});return e.jsxs(hn,{onClick:()=>x(n),selected:m,$borderColor:s[n.estado]||"#6c757d",title:`Venta #${n.id}`,children:[e.jsxs("div",{className:"top",children:[e.jsx("span",{children:l}),e.jsxs("span",{children:[u.icon," C$",Me(Math.abs(D))]})]}),e.jsxs("div",{className:"sub",children:[new Date(n.fecha).toLocaleString("es-NI")," · Cliente: ",e.jsx("strong",{children:y})," · Vendedor: ",v]})]})}),De=10;function un({dailySales:t=[],loadSales:n,onClose:m,isAdmin:x,users:j=[],clients:f=[],onReprintTicket:s,onCancelSale:v,onReturnItem:y,onAbonoSuccess:D,initialClientId:u=null}){var Oe,_e,Pe,Ve;const[l,$]=i.useState(Ie()),[A,N]=i.useState(Ie()),[a,R]=i.useState(Array.isArray(t)?t:[]),[T,h]=i.useState(!1),[k,C]=i.useState(""),[J,P]=i.useState(""),[E,ee]=i.useState(""),[M,te]=i.useState(1),Z=i.useMemo(()=>Array.isArray(j)?j:[],[j]),z=i.useMemo(()=>Array.isArray(f)?f:[],[f]);i.useEffect(()=>{if(u){const o=z.find(c=>c.id_cliente===u);o?(C(o.nombre),N("")):C(String(u))}},[u,z]);const[r,d]=i.useState(null),[w,W]=i.useState(!1),[O,H]=i.useState({open:!1,title:"",message:""}),F=(o,c)=>H({open:!0,title:o,message:c}),he=()=>H({open:!1,title:"",message:""}),[ie,Y]=i.useState({open:!1,title:"",message:"",onConfirm:null}),de=(o,c,b)=>Y({open:!0,title:o,message:c,onConfirm:b}),ce=()=>Y({open:!1,title:"",message:"",onConfirm:null}),[L,ne]=i.useState({open:!1,title:"",message:"",initialValue:"1",onConfirm:null}),pe=(o,c,b,V)=>ne({open:!0,title:o,message:c,initialValue:String(b??"1"),onConfirm:V}),se=()=>ne({open:!1,title:"",message:"",initialValue:"1",onConfirm:null}),g=i.useCallback(async(o=null)=>{if(!n)return[];h(!0),$(o);try{const c=await n(o),b=Array.isArray(c)?c:[];return R(b),b}catch(c){return R([]),F("Error","No se pudieron cargar las transacciones: "+(c.message||"Error de conexión.")),[]}finally{h(!1)}},[n]);i.useEffect(()=>{const c=k&&k.length>=2||u&&!A?null:A;g(c),te(1),d(null)},[A,g,k,u]),i.useEffect(()=>{A===Ie()&&Array.isArray(t)&&!k&&R(t)},[t,A,k]);const Q=i.useMemo(()=>{const o=(k||"").toLowerCase();return(a||[]).filter(b=>{var ue;const V=b.clientId||b.idCliente,K=((ue=z.find(be=>be.id_cliente===V))==null?void 0:ue.nombre)||"";return(!J||String(b.userId)===String(J))&&(!E||b.estado===E)&&(!o||String(b.id).includes(o)||K.toLowerCase().includes(o))}).sort((b,V)=>new Date(V.fecha)-new Date(b.fecha))},[a,J,E,k,z]),oe=Math.max(1,Math.ceil(Q.length/De)),fe=(M-1)*De,X=Q.slice(fe,fe+De);i.useEffect(()=>{(!r||!X.some(o=>o.id===r.id))&&d(X[0]||null)},[X,r]);const _=i.useCallback(async(o=null)=>{const c=await g(l);if(o){const b=(c||[]).find(V=>String(V.id)===String(o));d(b||null)}else d(null)},[g,l]),me=i.useCallback(o=>{const c=o||(r==null?void 0:r.id);if(!(!c||!r)){if(r.estado==="CANCELADA"){F("Venta ya cancelada",`La venta #${c} ya fue cancelada.`);return}if(!v){F("Error de Configuración","onCancelSale no fue proporcionada.");return}de("Cancelar Venta",`¿Seguro que deseas cancelar la venta #${c}? Esta acción revierte inventario y no se puede deshacer.`,async()=>{ce();try{await v(r),F("Éxito",`Venta #${c} cancelada.`),await _(null)}catch(b){F("Error al Cancelar",b.message||"No se pudo cancelar la venta.")}})}},[r,v,_]),rt=i.useCallback((o,c=0)=>{if(!r)return;if(!y){F("Error de Configuración","onReturnItem no fue proporcionada.");return}const b=Number((o==null?void 0:o.quantity)||(o==null?void 0:o.cantidad)||0);if(!Number.isFinite(b)||b<=0){F("No se puede devolver","Este artículo no tiene cantidad disponible para devolver.");return}pe("Devolver producto",`Cantidad a devolver para "${ve(o,c)}" (máx. ${b})`,"1",async V=>{const K=Number(V);if(!Number.isFinite(K)||K<=0||K>b){F("Cantidad inválida",`Ingresa un número entre 1 y ${b}.`);return}const ue=r.items.length===1&&K===b,be=async()=>{try{await y(r,o,K),F("Éxito",`Se devolvieron ${K} unidad(es) de ${ve(o,c)}.`),await _(null)}catch(je){const Be=((je==null?void 0:je.message)||"").toLowerCase(),st=Be.includes("not found")||Be.includes("404")?"Ruta de API no encontrada.":je.message||"No se pudo devolver el producto.";F("Error al Devolver",st)}};if(ue){se(),setTimeout(()=>{Y({open:!0,title:"¿Cancelar Venta Completa?",message:`Este es el ÚLTIMO artículo de la venta. 

¿Prefieres CANCELAR toda la venta en lugar de hacer una devolución individual?
(Esto revertirá todo el ticket).`,onConfirm:async()=>{Y({open:!1,title:"",message:"",onConfirm:null}),v&&me(r.id)},onClose:()=>{Y({open:!1,title:"",message:"",onConfirm:null}),be()}})},100);return}await be()})},[r,y,_]),ge=i.useCallback(()=>{r&&(s==null||s(r))},[r,s]),at=Q.length,it=X.length;return e.jsxs(ke,{"data-history-modal":!0,children:[e.jsxs(an,{children:[e.jsxs(sn,{children:[e.jsxs("h2",{children:[e.jsx(He,{})," Historial de Transacciones"]}),e.jsx(I,{$cancel:!0,onClick:m,children:e.jsx(Ee,{})})]}),e.jsxs(ln,{children:[e.jsxs("div",{children:[e.jsxs("label",{children:[e.jsx(yt,{})," Buscar ID/Cliente:"]}),e.jsx(ye,{type:"text",placeholder:"ID o nombre",value:k,onChange:o=>C(o.target.value)})]}),e.jsxs("div",{children:[e.jsxs("label",{children:[e.jsx(et,{})," Fecha:"]}),e.jsx(ye,{type:"date",value:A,onChange:o=>N(o.target.value)})]}),x&&e.jsxs("div",{children:[e.jsxs("label",{children:[e.jsx(Ct,{})," Usuario:"]}),e.jsxs(ye,{as:"select",value:J,onChange:o=>P(o.target.value),children:[e.jsx("option",{value:"",children:"Todos"}),Z.map(o=>e.jsx("option",{value:o.id_usuario??o.id,children:o.nombre_usuario??o.nombre},o.id_usuario??o.id))]})]}),e.jsxs("div",{children:[e.jsxs("label",{children:[e.jsx(wt,{})," Estado:"]}),e.jsxs(ye,{as:"select",value:E,onChange:o=>ee(o.target.value),children:[e.jsx("option",{value:"",children:"Todos"}),e.jsx("option",{value:"COMPLETADA",children:"Completadas"}),e.jsx("option",{value:"CANCELADA",children:"Canceladas"}),e.jsx("option",{value:"DEVOLUCION",children:"Devoluciones"}),e.jsx("option",{value:"ABONO_CREDITO",children:"Abonos"})]})]})]}),e.jsxs(dn,{children:[e.jsxs(cn,{children:[e.jsxs(pn,{children:[e.jsx("small",{children:k?e.jsx("strong",{children:"Mostrando historial de búsqueda"}):`Resultados: ${at}`}),e.jsxs(fn,{$green:!0,children:["Mostrando ",it]})]}),T&&e.jsx(Se,{style:{textAlign:"center",margin:".5rem 0"},children:"Cargando transacciones…"}),!T&&e.jsx(mn,{children:X.length?X.map(o=>e.jsx(gn,{sale:o,isSelected:(r==null?void 0:r.id)===o.id,onSelect:d,safeUsers:Z,safeClients:z},o.id)):e.jsx("p",{style:{textAlign:"center",color:"#6c757d",marginTop:"1rem"},children:"No se encontraron transacciones para la fecha y filtros seleccionados."})}),oe>1&&e.jsxs(xn,{children:[e.jsx(I,{onClick:()=>te(o=>Math.max(1,o-1)),disabled:M===1,title:"Anterior",children:e.jsx(vt,{})}),e.jsxs("span",{children:["Página ",M," de ",oe]}),e.jsx(I,{onClick:()=>te(o=>Math.min(oe,o+1)),disabled:M===oe,title:"Siguiente",children:e.jsx(Nt,{})})]})]}),r?r.estado==="ABONO_CREDITO"?e.jsxs(Ne,{children:[e.jsxs("div",{style:{borderBottom:"2px dashed #ccc",paddingBottom:15,marginBottom:15},children:[e.jsxs("h3",{style:{margin:0,fontSize:"1.4rem",color:"#17a2b8",textAlign:"center"},children:[e.jsx(nt,{})," Recibo de Abono"]}),e.jsxs("p",{style:{textAlign:"center",color:"#555",margin:"5px 0"},children:["#",r.id]})]}),e.jsx(Se,{children:e.jsxs("div",{style:{display:"grid",gap:10},children:[e.jsxs(G,{children:[e.jsx("span",{children:"Fecha:"}),e.jsx("strong",{children:new Date(r.fecha).toLocaleString("es-NI")})]}),e.jsxs(G,{children:[e.jsx("span",{children:"Cliente:"}),e.jsx("strong",{style:{fontSize:"1.1rem"},children:((Oe=z.find(o=>o.id_cliente===(r.clientId||r.idCliente)))==null?void 0:Oe.nombre)||"Desconocido"})]}),e.jsxs(G,{children:[e.jsx("span",{children:"Cajero:"}),e.jsx("strong",{children:((_e=Z.find(o=>(o.id_usuario??o.id)==r.userId))==null?void 0:_e.nombre_usuario)||r.usuarioNombre||"Sistema"})]})]})}),e.jsx("div",{style:{margin:"20px 0",border:"1px solid #ddd",padding:15,borderRadius:8,background:"#f8f9fa"},children:e.jsxs(G,{style:{fontSize:"1.2rem",color:"#28a745"},children:[e.jsx("span",{children:"Monto Abonado:"}),e.jsxs("strong",{children:["C$ ",Me(r.totalVenta)]})]})}),e.jsx("div",{style:{display:"flex",justifyContent:"center",marginTop:20},children:e.jsxs(I,{onClick:ge,style:{fontSize:"1.1rem",padding:"10px 20px"},children:[e.jsx(ze,{})," Imprimir Comprobante"]})})]}):r.estado==="DEVOLUCION"?e.jsxs(Ne,{children:[e.jsxs("h3",{style:{marginTop:0},children:["Detalle de Transacción #",r.id]}),e.jsxs("div",{className:"box",style:{marginTop:10},children:[e.jsxs("p",{children:[e.jsx("strong",{children:"Cliente:"})," ",((Pe=z.find(o=>o.id_cliente===(r.clientId||r.idCliente)))==null?void 0:Pe.nombre)||"Consumidor Final"]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Fecha:"})," ",new Date(r.fecha).toLocaleString("es-NI")]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Estado:"})," ",e.jsx("span",{style:{background:"#fff3cd",color:"#856404",padding:"2px 8px",borderRadius:8,fontWeight:700},children:"DEVOLUCIÓN"})]})]}),e.jsxs("div",{className:"box",style:{marginTop:10},children:[e.jsx("h4",{style:{marginTop:0},children:"Detalle de Devolución"}),e.jsx("ul",{style:{margin:0,paddingLeft:18},children:(r.items||[]).map((o,c)=>e.jsxs("li",{children:[e.jsx("strong",{children:ve(o,c)})," ","— ",Number(o.quantity||o.cantidad||0)," u. @ C$",Number(o.precio||o.precio_unitario||0).toFixed(2)]},`${o.id||o.id_producto}-${c}`))}),e.jsxs("p",{style:{marginTop:8},children:["Importe devuelto:"," ",e.jsxs("strong",{children:["C$",(()=>{const o=Number(r.totalVenta??r.total_venta??r.total??0);return Math.abs(o).toFixed(2)})()]})]})]}),e.jsx("div",{style:{display:"flex",justifyContent:"flex-start",gap:10,marginTop:12},children:e.jsx(I,{onClick:ge,children:"Reimprimir Ticket"})})]}):r.estado==="CANCELADA"?e.jsxs(Ne,{children:[e.jsxs("h3",{style:{marginTop:0,color:"#dc3545"},children:["Detalle de Venta Cancelada #",r.id]}),e.jsxs("div",{className:"box",style:{marginTop:10},children:[e.jsxs("p",{children:[e.jsx("strong",{children:"Cliente:"})," ",((Ve=z.find(o=>o.id_cliente===(r.clientId||r.idCliente)))==null?void 0:Ve.nombre)||"Consumidor Final"]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Fecha:"})," ",new Date(r.fecha).toLocaleString("es-NI")]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Estado:"})," ",e.jsx("span",{style:{background:"#f8d7da",color:"#721c24",padding:"2px 8px",borderRadius:8,fontWeight:700},children:"CANCELADA"})]})]}),e.jsxs("div",{className:"box",style:{marginTop:10},children:[e.jsx("h4",{style:{marginTop:0},children:"Productos Cancelados"}),!r.items||r.items.length===0?e.jsx("p",{style:{color:"#6c757d",fontStyle:"italic"},children:"No hay detalles de productos disponibles."}):e.jsx("ul",{style:{margin:0,paddingLeft:18,color:"#6c757d"},children:r.items.map((o,c)=>e.jsxs("li",{children:[e.jsx("strong",{children:ve(o,c)})," ","— ",Number(o.quantity||o.cantidad||0)," u."]},`${o.id||o.id_producto}-${c}`))}),e.jsxs("p",{style:{marginTop:8,color:"#dc3545",textDecoration:"line-through"},children:["Total Anulado: ",e.jsxs("strong",{children:["C$ ",Me(r.totalVenta)]})]})]}),e.jsx("div",{style:{display:"flex",justifyContent:"flex-start",gap:10,marginTop:12},children:e.jsx(I,{onClick:ge,children:"Reimprimir Comprobante"})})]}):e.jsx(on,{sale:r,client:z.find(o=>o.id_cliente===(r.clientId||r.idCliente)),creditStatus:null,dailySales:a,isAdmin:x,onOpenAbonoModal:()=>W(!0),onCancelSale:o=>me(o),onReturnItem:(o,c)=>rt(o,c),onReprintTicket:ge,showConfirmation:({onConfirm:o})=>de("Confirmación","¿Confirmar acción?",o),showPrompt:({title:o,message:c,defaultValue:b,onConfirm:V})=>pe(o,c,b,V),showAlert:({title:o,message:c})=>F(o,c)}):e.jsx(Ne,{children:e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",color:"#aaa",fontStyle:"italic",flexDirection:"column"},children:[e.jsx(He,{size:40,style:{marginBottom:10,opacity:.5}}),e.jsx("p",{children:"Seleccione una transacción para ver detalles"})]})})]}),w&&r&&e.jsx(Pt,{client:z.find(o=>o.id_cliente===(r.clientId||r.idCliente)),onClose:()=>W(!1),onAbonoSuccess:async()=>{W(!1),await _(r.id),D==null||D()},showAlert:({title:o,message:c})=>F(o,c)})]}),e.jsx(At,{isOpen:O.open,onClose:he,title:O.title,message:O.message}),e.jsx(bn,{isOpen:!!ie.open,title:ie.title,message:ie.message,onCancel:ce,onConfirm:ie.onConfirm||ce}),e.jsx(jn,{isOpen:!!L.open,title:L.title,message:L.message,initialValue:L.initialValue,onCancel:se,onConfirm:o=>{const c=L.onConfirm;se(),c&&c(o)}})]})}const ot=({isOpen:t,children:n,maxWidth:m=450})=>t?e.jsx(ke,{style:{zIndex:99999,backgroundColor:"rgba(0,0,0,0.6)"},children:e.jsx(Re,{style:{maxWidth:`${m}px`,textAlign:"center"},children:n})}):null,bn=({isOpen:t,title:n,message:m,onCancel:x,onConfirm:j})=>e.jsxs(ot,{isOpen:t,children:[e.jsx("h2",{style:{marginTop:0},children:n}),e.jsx("p",{style:{color:"#6c757d",lineHeight:1.5},children:m}),e.jsxs("div",{style:{display:"flex",justifyContent:"center",gap:10,marginTop:10},children:[e.jsx(I,{onClick:x,$cancel:!0,children:"Cancelar"}),e.jsx(I,{onClick:j,primary:!0,children:"Aceptar"})]})]}),jn=({isOpen:t,title:n,message:m,initialValue:x="1",inputType:j="number",onCancel:f,onConfirm:s})=>{const[v,y]=i.useState(x);return i.useEffect(()=>{y(x)},[x,t]),e.jsxs(ot,{isOpen:t,children:[e.jsx("h2",{style:{marginTop:0},children:n}),m&&e.jsx("p",{style:{color:"#6c757d"},children:m}),e.jsx("input",{style:{width:"100%",padding:".6rem",borderRadius:8,border:"1px solid #dee2e6",margin:"8px 0 14px"},type:j,value:v,onChange:D=>y(D.target.value)}),e.jsxs("div",{style:{display:"flex",justifyContent:"center",gap:10},children:[e.jsx(I,{onClick:f,$cancel:!0,children:"Cancelar"}),e.jsx(I,{onClick:()=>s(v),primary:!0,children:"Aceptar"})]})]})},kn=U.memo(un);export{Pt as A,kn as S,Nn as T};

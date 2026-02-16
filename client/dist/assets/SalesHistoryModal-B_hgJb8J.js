import{R as G,r as l,j as e,n as st,J as lt,a8 as dt,D as ct,s as m,v as pt,x as Ee,aI as mt,C as xt,q as ht,ad as se,aS as ft,aE as Be,h as qe,aT as Xe,aU as gt,K as ut,az as Ke,aA as et,ah as bt,X as He,Y as jt,S as yt,aV as Ct,aW as vt,aX as Nt,aY as tt,aZ as We,af as Se}from"./vendor-DfgwALhZ.js";import{c as Ne,d as we,B as I,T as Z,I as ke,S as be}from"./POS.styles-mxseP0n6.js";import{u as Fe,y as wt,i as kt,a as $t}from"./index-HeWOI7J3.js";import{A as St}from"./AlertModal-DnqPm_iy.js";const At=m.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1050;
  backdrop-filter: blur(5px);
`,Tt=m.div`
  background: white; padding: 2rem; border-radius: 12px; width: 560px; max-width: 95%; max-height: 90vh; overflow-y: auto;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  animation: fadeIn 0.3s ease-out;
  @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
`,It=m.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;
  border-bottom: 1px solid #e9ecef; padding-bottom: 1rem;
`,Dt=m.h2`margin: 0; font-size: 1.5rem; color: #333;`,Et=m.button`
  border: none; background: none; font-size: 1.5rem; cursor: pointer; color: #888;
  &:hover { color: #333; }
`,Ft=m.form`display: flex; flex-direction: column; gap: 1.25rem;`,Ae=m.div`display: flex; flex-direction: column; gap: 0.5rem;`,Te=m.label`font-weight: 600; color: #495057; font-size: 0.9rem;`,Le=m.input`
  padding: 0.75rem; border: 1px solid #ccc; border-radius: 6px; font-size: 1rem;
  &:focus { border-color: #007bff; outline: none; box-shadow: 0 0 0 2px rgba(0,123,255,0.25); }
`,Lt=m(Le).attrs({as:"select"})``,Ue=m.button`
  padding: 0.85rem 1.5rem; background: #28a745; color: white; border: none;
  border-radius: 6px; font-weight: bold; display: flex; align-items: center; gap: 0.5rem;
  justify-content: center; cursor: pointer; transition: background-color 0.2s; font-size: 1rem;
  &:hover:not(:disabled) { background: #218838; }
  &:disabled { background: #6c757d; cursor: not-allowed; }
`,Mt=m.p`
  margin: 0 0 0.5rem 0; padding: 0.75rem; background-color: #e9ecef; border-radius: 6px;
  color: #495057; text-align: center; font-size: 1rem;
  strong { color: #dc3545; }
`,Rt=m.p`
  margin-top: -1rem; margin-bottom: 0.5rem; padding: 0.5rem; color: #dc3545; font-size: 0.9rem; text-align: center;
`,Ge=m(pt)`
  animation: spin 1s linear infinite;
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`,Ze=m.div`
  display: flex; flex-direction: column; gap: 0.5rem;
  max-height: 220px; overflow-y: auto; padding: 0.25rem;
`,Je=m.div`
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
`,_t=m.div`
  font-size: 0.85rem; font-weight: 600; color: #495057;
  margin-bottom: 0.25rem; display: flex; align-items: center; gap: 0.5rem;
`,me=t=>`C$${Number(t||0).toFixed(2)}`,Ye=t=>t?new Date(t).toLocaleDateString("es-NI",{timeZone:"America/Managua",day:"2-digit",month:"2-digit",year:"numeric"}):"—",Pt=({client:t,onClose:r,onAbonoSuccess:p,showAlert:x})=>{const{addCajaTransaction:j,user:f}=Fe(),[d,N]=l.useState(""),[y,u]=l.useState("Efectivo"),[i,E]=l.useState(""),[D,T]=l.useState(!1),[a,C]=l.useState(""),[w,M]=l.useState([]),[h,k]=l.useState(!0),[v,J]=l.useState(null),A=l.useMemo(()=>Number(t==null?void 0:t.saldo_pendiente)||0,[t]);l.useEffect(()=>{const s=async()=>{k(!0);try{const $=localStorage.getItem("token"),O=await kt(t.id_cliente,$);M(Array.isArray(O)?O:[])}catch($){console.error("Error cargando tickets:",$),M([])}finally{k(!1)}};t!=null&&t.id_cliente&&s()},[t]);const W=l.useMemo(()=>w.filter(s=>s.saldoRestante>0),[w]),Y=l.useMemo(()=>w.filter(s=>s.saldoRestante<=0),[w]),R=v?Math.min(A,v.saldoRestante):A;l.useEffect(()=>{if(!d){C("");return}const s=parseFloat(d);isNaN(s)||s<=0?C("Ingrese un monto válido mayor a cero."):s>R?C(`El máximo es ${me(R)}.`):C("")},[d,R]);const Q=s=>{s.saldoRestante<=0||(J($=>($==null?void 0:$.idVenta)===s.idVenta?null:s),N(""))},ne=()=>{N(v?v.saldoRestante.toFixed(2):A.toFixed(2))},F=l.useCallback(async s=>{s.preventDefault();const $=parseFloat(d),O=localStorage.getItem("token");if(a||!$||$<=0){x==null||x({title:"Monto Inválido",message:a||"Revise el monto ingresado."});return}if(y!=="Efectivo"&&!i.trim()){x==null||x({title:"Referencia Requerida",message:"Ingrese el número de referencia, transferencia o voucher."});return}T(!0);try{await wt(t.id_cliente,{monto:$,id_venta:(v==null?void 0:v.idVenta)||null,pagoDetalles:{metodo:y,usuario:(f==null?void 0:f.nombre_usuario)||"Desconocido",referencia:i||"",ticketRef:v?`Venta #${v.idVenta}`:"FIFO"}},O);const _=y==="Efectivo",U={id:`abono-${Date.now()}`,type:"abono",amount:$,note:`Abono Cliente: ${t.nombre} (${y})${v?` - Venta #${v.idVenta}`:""} ${i?"- Ref: "+i:""}`,at:new Date().toISOString(),pagoDetalles:{clienteId:t.id_cliente,clienteNombre:t.nombre,metodo:y,referencia:i,ingresoCaja:_?$:0,efectivo:_?$:0,tarjeta:y==="Tarjeta"?$:0,transferencia:y==="Transferencia"?$:0,credito:0}};await j(U),p==null||p(U),r==null||r()}catch(_){console.error("Error al registrar abono:",_),x==null||x({title:"Error",message:`No se pudo registrar el abono. ${_.message}`})}finally{T(!1)}},[d,y,i,a,t,f,v,j,p,r,x]),o=D||A<=0||!!a||!d;return e.jsx(At,{children:e.jsxs(Tt,{children:[e.jsxs(It,{children:[e.jsx(Dt,{children:"Registrar Abono"}),e.jsx(Et,{onClick:r,disabled:D,children:e.jsx(st,{})})]}),e.jsxs("p",{children:["Cliente: ",e.jsx("strong",{children:(t==null?void 0:t.nombre)||"Desconocido"})]}),e.jsxs(Mt,{children:["Saldo Pendiente Total: ",e.jsx("strong",{children:me(A)})]}),h?e.jsxs("div",{style:{textAlign:"center",padding:"1rem",color:"#6c757d"},children:[e.jsx(Ge,{})," Cargando facturas..."]}):W.length>0?e.jsxs(e.Fragment,{children:[e.jsxs(_t,{children:[e.jsx(lt,{})," Selecciona una factura (opcional — si no, paga la más antigua):"]}),e.jsx(Ze,{children:W.map(s=>e.jsxs(Je,{$selected:(v==null?void 0:v.idVenta)===s.idVenta,onClick:()=>Q(s),children:[e.jsxs("div",{className:"ticket-info",children:[e.jsxs("span",{className:"ticket-id",children:["Venta #",s.idVenta]}),e.jsx("span",{className:"ticket-date",children:Ye(s.fecha)})]}),e.jsxs("div",{className:"ticket-amounts",children:[s.montoOriginal!==s.saldoRestante&&e.jsx("div",{className:"original",children:me(s.montoOriginal)}),e.jsx("div",{className:"remaining",children:me(s.saldoRestante)})]})]},s.idVenta))}),Y.length>0&&e.jsxs("details",{style:{marginTop:"0.5rem"},children:[e.jsxs("summary",{style:{cursor:"pointer",fontSize:"0.85rem",color:"#6c757d"},children:[e.jsx(dt,{style:{color:"#28a745"}})," ",Y.length," factura(s) pagada(s)"]}),e.jsx(Ze,{style:{marginTop:"0.5rem"},children:Y.map(s=>e.jsxs(Je,{$paid:!0,children:[e.jsxs("div",{className:"ticket-info",children:[e.jsxs("span",{className:"ticket-id",children:["Venta #",s.idVenta]}),e.jsx("span",{className:"ticket-date",children:Ye(s.fecha)})]}),e.jsx("div",{className:"ticket-amounts",children:e.jsx("div",{className:"remaining",style:{color:"#28a745"},children:"Pagada ✔"})})]},s.idVenta))})]})]}):null,e.jsxs(Ft,{onSubmit:F,children:[e.jsxs(Ae,{children:[e.jsxs(Te,{htmlFor:"montoAbono",children:["Monto a Abonar (C$)",v&&e.jsxs("span",{style:{fontWeight:"normal",color:"#007bff",marginLeft:"0.5rem"},children:["— Venta #",v.idVenta," (máx: ",me(R),")"]})]}),e.jsxs("div",{style:{display:"flex",gap:"0.5rem"},children:[e.jsx(Le,{id:"montoAbono",type:"number",value:d,onChange:s=>N(s.target.value),placeholder:"0.00",required:!0,autoFocus:!0,step:"0.01",min:"0.01",max:R?R.toFixed(2):void 0,disabled:D||A<=0,style:{flex:1}}),e.jsx(Ue,{type:"button",onClick:ne,style:{background:"#007bff",padding:"0.5rem 0.75rem",fontSize:"0.85rem"},disabled:D||A<=0,children:"Total"})]})]}),e.jsxs(Ae,{children:[e.jsx(Te,{htmlFor:"metodoPago",children:"Método de Pago"}),e.jsxs(Lt,{id:"metodoPago",value:y,onChange:s=>u(s.target.value),disabled:D,children:[e.jsx("option",{value:"Efectivo",children:"Efectivo"}),e.jsx("option",{value:"Tarjeta",children:"Tarjeta"}),e.jsx("option",{value:"Transferencia",children:"Transferencia"})]})]}),y!=="Efectivo"&&e.jsxs(Ae,{children:[e.jsx(Te,{htmlFor:"referencia",children:"Referencia / Voucher / N° Transferencia"}),e.jsx(Le,{id:"referencia",type:"text",value:i,onChange:s=>E(s.target.value),placeholder:"Ej: BAC-123456",required:!0})]}),a&&e.jsx(Rt,{children:a}),e.jsx(Ue,{type:"submit",disabled:o,children:D?e.jsxs(e.Fragment,{children:[e.jsx(Ge,{})," Procesando..."]}):e.jsxs(e.Fragment,{children:[e.jsx(ct,{})," Registrar Abono"]})})]})]})})},Ot=G.memo(Pt),zt=ht`
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
`,Vt=m.div`
  font-family: 'Consolas','Courier New',monospace;
  color: #000;
  background: #fff;
  width: 310px; /* Default for preview */
  margin: 0 auto;
  padding: 12px 10px;
  box-shadow: 0 0 10px rgba(0,0,0,.08);
  border: 1px solid #eee;
  border-radius: 8px;

  &.compact { padding: 8px 6px; }

  /* --- BRAND --- */
  .brand {
    text-align: center;
    border-bottom: 1px dashed #333;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }
  .brand h1 { margin: 6px 0 2px; font-size: 1.35rem; font-weight: 700; color: #1e3a8a; line-height: 1.25; }
  .brand small { color: #555; display: block; margin: 3px 0; line-height: 1.35; white-space: normal; word-break: break-word; }

  /* --- META --- */
  .meta { font-size: .9rem; margin-bottom: 12px; border-bottom: 1px dashed #ccc; padding-bottom: 8px; }
  .meta p { margin: 2px 0; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 4px 8px; font-weight: 400; }
  .meta-label { font-weight: 700; }
  .meta-value { font-weight: 400; text-align: right; }

  /* --- ITEMS --- */
  table.items { width: 100%; border-collapse: collapse; font-size: .9rem; table-layout: fixed; }
  table.items th, table.items td { padding: 6px 4px; vertical-align: top; word-wrap: break-word; }
  table.items th { border-bottom: 2px solid #333; font-weight: 700; text-transform: uppercase; font-size: 0.75rem; color: #1e3a8a; }
  &.compact table.items th, &.compact table.items td { padding: 4px 2px; }
  .text-right { text-align: right; }
  .col-qty { width: 15%; text-align: center; }
  .col-unit { width: 25%; text-align: right; }
  .col-total { width: 25%; text-align: right; }
  table.items td:nth-child(2) { white-space: normal; text-align: left; }

  /* --- TOTALS --- */
  .totals { border-top: 2px solid #333; padding-top: 6px; margin-top: 12px; }
  .badge { display: inline-block; font-weight: 700; letter-spacing: .5px; padding: 6px 10px; border: 2px solid #0b72b9; border-radius: 4px; margin: 10px auto; text-align: center; color: #0b72b9; }
  .thanks { text-align: center; font-size: .85rem; border-top: 1px dashed #333; padding-top: 10px; margin-top: 12px; color: #444; line-height: 1.4; }

  /* ====== A4 SPECIFIC LAYOUT ====== */
  &.print-a4 {
    /* Layout A4 Professional */
    .brand {
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-align: left;
        border-bottom: 3px solid #1e3a8a;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
    }
    .brand-logo-container { width: 150px; }
    .brand-info { text-align: right; max-width: 60%; }
    .brand h1 { font-size: 20pt; color: #1e3a8a; margin-bottom: 5px; }
    .brand small { font-size: 9pt; color: #444; margin: 1px 0; }
    
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
    .meta-title { font-weight: bold; text-transform: uppercase; color: #1e3a8a; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-bottom: 6px; font-size: 9pt; }
    .meta p { justify-content: flex-start; gap: 8px; border-bottom: none; width: 100%; display: grid; grid-template-columns: 120px 1fr; }
    .meta-label { text-align: left; color: #64748b; font-weight: 500; }
    .meta-value { text-align: left; color: #0f172a; font-weight: 600; }

    table.items th { background: #f1f5f9; color: #334155; padding: 10px; border-bottom: 2px solid #cbd5e1; font-size: 9pt; }
    table.items td { padding: 10px; border-bottom: 1px solid #f1f5f9; font-size: 10pt; color: #334155; }
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
`,Bt=m.div`
  display: flex; flex-direction: column; gap: 12px;
`,qt=m.img`
  width: 100%;
  max-width: 160px;
  height: auto;
  display: block;
  margin: 0 auto; 
  border-radius: 6px;
  &.a4-logo { margin: 0; max-width: 140px; }
`,je=m.span`
  display: inline-flex; align-items: center; gap: 6px;
  font-weight: 700; letter-spacing: .4px; padding: 4px 8px; border-radius: 4px;
  font-size: 0.85rem;
  ${({$type:t})=>t==="proforma"&&se`background: #e8f4ff; color: #0b72b9; border: 1px solid #b9defc;`}
  ${({$type:t})=>t==="abono"&&se`background: #fff3cd; color: #856404; border: 1px solid #ffeeba;`}
  ${({$type:t})=>t==="venta"&&se`background: #e8f7ee; color: #1c7d3a; border: 1px solid #bfe8cf;`}
  ${({$type:t})=>t==="outflow"&&se`background: #fee2e2; color: #991b1b; border: 1px solid #fecaca;`}
`,Ht=m.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: .75rem;
`,oe=t=>new Intl.NumberFormat("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(t||0)),S=(...t)=>t.find(r=>r!=null),ae=t=>S(t==null?void 0:t.usuarioNombre,t==null?void 0:t.nombre_usuario,t==null?void 0:t.nombre,t==null?void 0:t.name,t==null?void 0:t.displayName,t==null?void 0:t.fullName,t==null?void 0:t.username,null);function Wt(t=[]){return t.map((r,p)=>{const x=Number(S(r.quantity,r.cantidad,r.qty,0)),j=S(r.nombre,r.descripcion,r.description,r.producto,`Item ${p+1}`),f=Number(S(r.precio_unitario,r.precio_venta,r.precio,r.unitPrice,0));return{id:S(r.id_producto,r.id,`it-${p}`),nombre:j,quantity:x,unit:f,total:x*f}})}function Ut(t={}){const r=Number(t.efectivo||0),p=Number(t.tarjeta||0),x=Number(t.transferencia||0),j=Number(t.dolares||0);if(Number(t.credito||0)>0)return"Crédito";const d=[];return r>0&&d.push("Efectivo"),p>0&&d.push("Tarjeta"),x>0&&d.push("Transferencia"),j>0&&d.push("Dólares"),d.length===0?"Contado":d.length===1?d[0]:"Mixto"}function Gt(t={},r=0){const p=Number(t.efectivo||0),x=Number(t.tarjeta||0),j=Number(t.transferencia||0),f=Number(t.otro||0),d=Number(t.dolares||0),N=Number(t.tasaDolarAlMomento||t.tasaObtenida||1),y=d*(N>1?N:1),u=p+x+j+f+y;return u>0?u:Number(t.montoRecibido||r||0)}function Zt(t){const r=S(t==null?void 0:t.fecha,t==null?void 0:t.createdAt,t==null?void 0:t.created_at,t==null?void 0:t.date,t);try{const p=new Date(r);return isNaN(p)?"Fecha inválida":p.toLocaleString("es-NI",{hour12:!0})}catch{return"Fecha inválida"}}function Jt(t){const r=S(t.proformaId,t.proformaNumero,t.numeroProforma,t.id);if(r)return r;const p=new Date,x=p.toISOString().slice(2,10).replace(/-/g,""),j=p.toTimeString().slice(0,8).replace(/:/g,"");return`PF-${x}-${j}`}const vn=({transaction:t,onClose:r,clients:p=[],users:x=[],isOpen:j=!0,printMode:f="80",currentUser:d=null,onPersistPrint:N=null,autoTriggerPrint:y=!1})=>{var de;const{user:u}=typeof Fe=="function"?Fe():{user:null},{settings:i}=$t();if(!j||t==null)return null;const[E]=G.useState(typeof t=="object"?t:null),[D]=G.useState(!1),[T]=G.useState(null);if(D||T||!E)return e.jsx(Ne,{className:"no-print",children:e.jsxs(we,{className:"no-print",style:{maxWidth:420,padding:"1rem"},children:[e.jsx("h3",{style:{color:"#dc3545"},children:"No se pudo imprimir"}),e.jsx("div",{style:{display:"flex",justifyContent:"center",marginTop:12},children:e.jsxs(I,{onClick:r,$cancel:!0,children:[e.jsx(Ee,{})," Cerrar"]})})]})});const a=E,C=a.estado==="ABONO_CREDITO",w=!!(a.isProforma||a.proformaFor||a.proformaNombre),M=!!a.isOutflow,h=a.estado==="DEVOLUCION",k=w?Jt(a):S(a.id,a.saleId,a.numero,"-"),v=Zt(S(a.fecha,a.createdAt,a.date)),J=S(a.clientId,a.idCliente,a.clienteId),A=p.find(g=>String(g.id_cliente??g.id)===String(J)),W=w&&a.proformaNombre?a.proformaNombre:S(A==null?void 0:A.nombre,a.clienteNombre,"Consumidor Final"),Y=(A==null?void 0:A.cedula)||a.clienteCedula,R=S(a.userId,a.idUsuario,(de=a.openedBy)==null?void 0:de.id)??(d==null?void 0:d.id_usuario)??(d==null?void 0:d.id)??(d==null?void 0:d.uid)??(u==null?void 0:u.id_usuario)??(u==null?void 0:u.id)??(u==null?void 0:u.uid),Q=(()=>{try{return JSON.parse(localStorage.getItem("authUser")||"null")}catch{return null}})(),ne=x.find(g=>String(g.id_usuario||g.id||g.uid)===String(R)),F=S(a.usuarioNombre,ae(ne),ae(d),ae(u),ae(Q),"Cajero POS"),o=w?S(a.usuarioNombre,ae(d),ae(u),ae(Q),F):F,s=Wt(S(a.items,a.detalle,[])),$=s.reduce((g,q)=>g+Number(q.unit)*Number(q.quantity),0),O=Number(S(a.subtotal,$)),_=Number(S(a.descuento,0)),U=Number(S(a.totalVenta,a.total_venta,O-_,0)),L=a.pagoDetalles||{},$e=w||M?"N/A":S(a.metodoPago,Ut(L)),re=w||M?0:Gt(L,U),X=w||M?0:Math.max(0,re-U);Math.abs(Number(S(a.totalVenta,a.montoAbono,0))),Number((A==null?void 0:A.saldo_pendiente)||0);const xe=s.length<=2,P={name:(i==null?void 0:i.empresa_nombre)||"Multirepuestos RG",ruc:(i==null?void 0:i.empresa_ruc)||"1211812770001E",phone:(i==null?void 0:i.empresa_telefono)||"84031936 / 84058142",address:(i==null?void 0:i.empresa_direccion)||"Del portón de la normal 75 varas al este. Juigalpa, Chontales.",slogan:(i==null?void 0:i.empresa_eslogan)||"Repuestos de confianza al mejor precio",logo:i!=null&&i.empresa_logo_url?i.empresa_logo_url.startsWith("http")?i.empresa_logo_url:`undefined${i.empresa_logo_url}`:new URL("/icons/logo.png",window.location.origin).toString()};G.useCallback(async g=>{},[]);const B=G.useCallback((g="80")=>{const q=document.getElementById("print-wrapper-ticket");if(!q)return;const ce=q.outerHTML,ie=`
      @charset "UTF-8";
      @page { size: ${g==="A4"?"A4 portrait":"80mm auto"}; margin: ${g==="A4"?"12mm":"0"}; }
      html, body { background: #fff; margin: 0 !important; padding: 0 !important; font-family: ${g==="A4"?"'Inter', Helvetica, Arial, sans-serif":"'Consolas', monospace"}; color: #000 !important; }
      
      /* Reset para impresión */
      #print-wrapper-ticket {
        box-shadow: none !important; border: none !important; margin: 0 !important;
        ${g==="A4"?"width: 100% !important; padding: 0 !important; font-size: 10pt !important;":"width: 80mm !important; padding: 6px 4px !important; font-size: 8pt !important;"}
      }

      /* Estilos específicos A4 en impresión */
      ${g==="A4"?`
        #print-wrapper-ticket .brand { display: flex !important; justify-content: space-between !important; align-items: flex-start !important; border-bottom: 3px solid #1e3a8a !important; margin-bottom: 25px !important; padding-bottom: 15px !important; text-align: left !important; }
        #print-wrapper-ticket .brand-logo-container { order: 1 !important; width: 140px !important; }
        #print-wrapper-ticket .brand-info { order: 2 !important; text-align: right !important; flex: 1 !important; }
        #print-wrapper-ticket .brand h1 { font-size: 22pt !important; color: #1e3a8a !important; margin: 0 0 5px 0 !important; }
        #print-wrapper-ticket .brand small { display: block !important; font-size: 9pt !important; margin: 2px 0 !important; color: #334155 !important; }
        
        #print-wrapper-ticket .meta { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 30px !important; background: #f8fafc !important; border: 1px solid #e2e8f0 !important; padding: 15px !important; border-radius: 8px !important; margin-bottom: 30px !important; }
        #print-wrapper-ticket .meta p { display: grid !important; grid-template-columns: 140px 1fr !important; width: 100% !important; border-bottom: 1px dashed #e2e8f0 !important; padding-bottom: 4px !important; margin-bottom: 4px !important; }
        #print-wrapper-ticket .meta-title { font-weight: 800 !important; text-transform: uppercase !important; color: #1e3a8a !important; border-bottom: 2px solid #cbd5e1 !important; margin-bottom: 10px !important; padding-bottom: 5px !important; display: block !important; width: 100% !important; }
        
        #print-wrapper-ticket table.items { width: 100% !important; border-collapse: collapse !important; border: 1px solid #e2e8f0 !important; }
        #print-wrapper-ticket table.items th { background: #f1f5f9 !important; color: #334155 !important; padding: 12px 8px !important; font-weight: 700 !important; text-transform: uppercase !important; font-size: 8pt !important; border-bottom: 2px solid #cbd5e1 !important; text-align: left !important; }
        #print-wrapper-ticket table.items td { padding: 10px 8px !important; border-bottom: 1px solid #f1f5f9 !important; font-size: 9.5pt !important; color: #334155 !important; vertical-align: top !important; }
        #print-wrapper-ticket .col-qty { text-align: center !important; }
        #print-wrapper-ticket .col-unit, #print-wrapper-ticket .col-total { text-align: right !important; }
        
        #print-wrapper-ticket .totals { display: flex !important; justify-content: flex-end !important; margin-top: 20px !important; border-top: none !important; }
        #print-wrapper-ticket .totals-box { width: 300px !important; background: #f8fafc !important; padding: 15px !important; border-radius: 8px !important; border: 1px solid #e2e8f0 !important; }
        #print-wrapper-ticket .footer-sign { display: flex !important; justify-content: space-between !important; margin-top: 80px !important; padding: 0 50px !important; }
        #print-wrapper-ticket .sign-box { border-top: 1px solid #94a3b8 !important; width: 40% !important; text-align: center !important; padding-top: 5px !important; font-size: 9pt !important; color: #64748b !important; }
      `:`
        /* Estilos 80mm */
        #print-wrapper-ticket { font-family: 'Consolas', monospace !important; }
        #print-wrapper-ticket .brand { text-align: center !important; border-bottom: 1px dashed #000 !important; }
        #print-wrapper-ticket table.items th { border-bottom: 1px dashed #000 !important; }
        #print-wrapper-ticket .grand-total { font-size: 12pt !important; font-weight: 900 !important; }
      `}
    `,K=window.open("","_blank","width=900,height=700");K&&(K.document.write(`<html><head><title>Impresión ${g.toUpperCase()} - ${P.name}</title><style>${ie}</style></head><body>${ce}</body></html>`),K.document.close(),K.focus(),setTimeout(()=>{try{K.print()}catch(ee){console.error("Print error:",ee)}},350))},[P]),le=l.useRef(!1);return l.useEffect(()=>{if(y&&!le.current){le.current=!0;const g=setTimeout(()=>B("80"),400);return()=>clearTimeout(g)}},[y,B]),e.jsxs(Ne,{className:"no-print",children:[e.jsx(zt,{}),e.jsxs(we,{className:"no-print",style:{maxWidth:520,width:"96%",padding:"1.2rem",background:"#fff"},children:[e.jsxs(Ht,{children:[e.jsxs("h2",{style:{display:"flex",alignItems:"center",gap:8,margin:0},children:[e.jsx(mt,{})," Vista de Impresión (",f.toUpperCase(),")"]}),e.jsxs("div",{style:{display:"flex",gap:8},children:[e.jsx(I,{onClick:()=>B("80"),children:"Ticket 80mm"}),e.jsxs(I,{onClick:()=>B("A4"),children:[e.jsx(xt,{})," A4 (1 pág.)"]}),e.jsx(I,{$cancel:!0,onClick:r,children:e.jsx(Ee,{})})]})]}),e.jsx(Bt,{children:e.jsxs(Vt,{id:"print-wrapper-ticket",className:`print-area ${f==="A4"?"print-a4":"print-80"} ${xe?"compact":""}`,children:[e.jsxs("div",{className:"brand",children:[e.jsx("div",{className:"brand-logo-container",children:e.jsx(qt,{className:"a4-logo",src:P.logo,alt:"Logo",onError:g=>{g.currentTarget.style.display="none"}})}),e.jsxs("div",{className:"brand-info",children:[e.jsx("h1",{children:P.name}),e.jsx("small",{children:P.slogan}),e.jsxs("small",{children:["RUC: ",P.ruc]}),e.jsxs("small",{children:["Tel: ",P.phone]}),e.jsx("small",{children:P.address}),e.jsx("div",{style:{marginTop:8},children:w?e.jsx(je,{$type:"proforma",children:"PROFORMA"}):C?e.jsx(je,{$type:"abono",children:"RECIBO"}):M?e.jsx(je,{$type:"outflow",children:"SALIDA"}):e.jsx(je,{$type:"venta",children:h?"DEVOLUCIÓN":"FACTURA"})})]})]}),e.jsxs("div",{className:"meta",children:[e.jsxs("div",{className:"meta-col",children:[e.jsx("span",{className:"meta-title",children:"Detalles del Documento"}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Fecha:"}),e.jsx("span",{className:"meta-value",children:v})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"No. Documento:"}),e.jsx("span",{className:"meta-value",children:k})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Atendido por:"}),e.jsx("span",{className:"meta-value",children:o})]})]}),e.jsxs("div",{className:"meta-col",children:[e.jsx("span",{className:"meta-title",children:"Datos del Cliente"}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Cliente:"}),e.jsx("span",{className:"meta-value",children:W})]}),Y&&e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Cédula/RUC:"}),e.jsx("span",{className:"meta-value",children:Y})]}),!w&&!M&&e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Pago:"}),e.jsx("span",{className:"meta-value",children:$e})]})]})]}),e.jsxs("table",{className:"items",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{className:"col-qty",children:"Cant."}),e.jsx("th",{children:"Descripción"}),e.jsx("th",{className:"text-right col-unit",children:"P. Unit"}),e.jsx("th",{className:"text-right col-total",children:"Total"})]})}),e.jsx("tbody",{children:s.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:"4",style:{textAlign:"center"},children:"Sin ítems"})}):s.map(g=>e.jsxs("tr",{children:[e.jsx("td",{className:"col-qty",children:g.quantity}),e.jsx("td",{children:g.nombre}),e.jsxs("td",{className:"text-right col-unit",children:["C$",oe(g.unit)]}),e.jsxs("td",{className:"text-right col-total",children:["C$",oe(g.total)]})]},g.id))})]}),e.jsx("div",{className:"totals",children:e.jsxs("div",{className:"totals-box",children:[e.jsxs(Z,{children:[e.jsx("span",{children:"Subtotal:"}),e.jsxs("span",{children:["C$",oe(O)]})]}),_>0&&e.jsxs(Z,{style:{color:"#dc3545"},children:[e.jsx("span",{children:"Descuento:"}),e.jsxs("span",{children:["- C$",oe(_)]})]}),e.jsxs(Z,{className:"grand-total",$bold:!0,style:{fontSize:"1.2em",borderTop:"1px solid #ccc",marginTop:5,paddingTop:5},children:[e.jsx("span",{children:"TOTAL:"}),e.jsxs("span",{children:["C$",oe(U)]})]}),!w&&e.jsxs(e.Fragment,{children:[e.jsxs(Z,{style:{marginTop:10,fontSize:"0.9em",color:"#666"},children:[e.jsx("span",{children:"Pagado:"}),e.jsxs("span",{children:["C$",oe(re)]})]}),X>0&&e.jsxs(Z,{$bold:!0,style:{color:"#dc3545"},children:[e.jsx("span",{children:"Cambio:"}),e.jsxs("span",{children:["C$",oe(X)]})]})]})]})}),e.jsxs("div",{className:"footer-sign no-show-80",children:[e.jsx("div",{className:"sign-box",children:"Entregado por"}),e.jsx("div",{className:"sign-box",children:"Recibido por"})]}),e.jsxs("div",{className:"thanks",children:[e.jsxs("p",{children:['"',P.slogan,'"']}),e.jsx("p",{style:{whiteSpace:"pre-line",marginTop:"5px"},children:w?(i==null?void 0:i.ticket_proforma_footer)||"Cotización válida por 15 días.":M?(i==null?void 0:i.ticket_transfer_footer)||"Salida de Inventario.":(i==null?void 0:i.ticket_sales_footer)||"¡Gracias por su compra!"})]})]})})]})]})},H=t=>Number(t||0).toFixed(2),Yt=(t,r=0)=>(t==null?void 0:t.nombre)??(t==null?void 0:t.name)??(t==null?void 0:t.producto)??(t==null?void 0:t.descripcion)??`Item ${r+1}`,Qe=m.div`
  border-left: 1px solid #e9ecef; padding-left: 1.5rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1.2rem;
`,ye=m.div`
  background-color: #fff; border: 1px solid #e9ecef; border-radius: 8px; padding: 1.2rem;
  h4 { margin-top: 0; margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem; color: #495057; }
`,Qt=m.table`
  width: 100%; border-collapse: collapse; font-size: 0.9rem;
  th, td { padding: 0.6rem; text-align: left; border-bottom: 1px solid #f1f1f1; }
  th { font-weight: 600; color: #6c757d; }
  td:nth-child(3), td:nth-child(4) { text-align: right; }
`,V=m.div`
  display: flex; justify-content: space-between; padding: 0.4rem 0; font-size: 0.95rem; font-weight: ${t=>t.$bold?"600":"normal"};
  border-top: ${t=>t.$bordered?"1px dashed #ccc":"none"}; color: ${t=>t.color||"inherit"};
  span:first-child { color: #6c757d; }
`,Xt=m.div`
  display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1rem;
`,Kt=m.span`
  font-weight: bold; padding: 0.25rem 0.5rem; border-radius: 4px; color: white; background-color: ${t=>t.color};
`,en=({sale:t,client:r,creditStatus:p,dailySales:x,isAdmin:j,onOpenAbonoModal:f,onCancelSale:d,onReturnItem:N,onReprintTicket:y,showConfirmation:u,showPrompt:i,showAlert:E})=>{const D=l.useMemo(()=>!(!t||t.estado!=="COMPLETADA"),[t]);if(!t)return e.jsx(Qe,{style:{justifyContent:"center",alignItems:"center"},children:e.jsxs(ke,{children:[e.jsx(ft,{})," Seleccione una transacción de la lista para ver sus detalles."]})});const a={COMPLETADA:{text:"COMPLETADA",color:"#28a745"},CANCELADA:{text:"CANCELADA",color:"#dc3545"},DEVOLUCION:{text:"DEVOLUCIÓN",color:"#ffc107"},ABONO_CREDITO:{text:"ABONO A CRÉDITO",color:"#17a2b8"}}[t.estado]||{text:t.estado,color:"#6c757d"},C=t.estado==="COMPLETADA",w=(h,k)=>{if(D){if(!N){E==null||E({title:"Config",message:"Falta onReturnItem en props.",type:"error"});return}N(h,k)}},M=()=>{if(D){if(!d){E==null||E({title:"Config",message:"Falta onCancelSale en props.",type:"error"});return}u==null||u({title:"Cancelar Venta",message:`Esta acción revertirá stock y (si aplica) crédito del cliente.

¿Cancelar la venta #${t.id}?`,onConfirm:()=>d(t.id)})}};return e.jsxs(Qe,{children:[e.jsxs("h3",{children:["Detalle de Transacción #",t.id]}),r&&p&&e.jsxs(ke,{$type:"info",style:{flexDirection:"column",alignItems:"stretch",gap:"1rem"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("span",{style:{fontWeight:"bold"},children:["Estado de Cuenta: ",r.nombre]}),e.jsxs(I,{$primary:!0,onClick:f,disabled:p.currentBalance<=0,children:[e.jsx(Be,{})," Registrar Abono"]})]}),e.jsxs(V,{$bold:!0,color:p.currentBalance>0?"#dc3545":"#28a745",children:[e.jsx("span",{children:"SALDO PENDIENTE TOTAL:"}),e.jsxs("span",{children:["C$",p.currentBalance.toFixed(2)]})]})]}),e.jsxs(ye,{children:[e.jsxs("p",{children:[e.jsxs("strong",{children:[e.jsx(qe,{})," Cliente:"]})," ",(r==null?void 0:r.nombre)||"Cliente Genérico"]}),e.jsxs("p",{children:[e.jsxs("strong",{children:[e.jsx(Xe,{})," Fecha:"]})," ",new Date(t.fecha).toLocaleString("es-NI")]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Estado:"})," ",e.jsx(Kt,{color:a.color,children:a.text})]})]}),C&&e.jsxs(e.Fragment,{children:[Array.isArray(t.items)&&t.items.length>0&&e.jsxs(ye,{children:[e.jsx("h4",{children:"Productos"}),e.jsxs(Qt,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Producto"}),e.jsx("th",{children:"Cant."}),e.jsx("th",{children:"P. Unit."}),e.jsx("th",{children:"Subtotal"}),e.jsx("th",{})]})}),e.jsx("tbody",{children:t.items.map((h,k)=>e.jsxs("tr",{children:[e.jsx("td",{children:Yt(h,k)}),e.jsx("td",{children:(h==null?void 0:h.quantity)??(h==null?void 0:h.cantidad)??0}),e.jsxs("td",{children:["C$",H(h==null?void 0:h.precio)]}),e.jsxs("td",{children:["C$",H(((h==null?void 0:h.quantity)??(h==null?void 0:h.cantidad)??0)*((h==null?void 0:h.precio)??0))]}),e.jsx("td",{children:D&&e.jsx(I,{$warning:!0,$small:!0,onClick:()=>w(h,k),title:"Devolver",children:e.jsx(gt,{})})})]},(h&&(h.id_producto||h.id))??k))})]})]}),e.jsxs(ye,{children:[e.jsx("h4",{children:"Resumen Financiero de esta Venta"}),t.subtotal!==void 0&&e.jsxs(V,{children:[e.jsx("span",{children:"Subtotal:"}),e.jsxs("span",{children:["C$",H(t.subtotal)]})]}),t.descuento>0&&e.jsxs(V,{children:[e.jsx("span",{children:"Descuento:"}),e.jsxs("span",{style:{color:"#dc3545"},children:["- C$",H(t.descuento)]})]}),e.jsxs(V,{$bold:!0,$bordered:!0,children:[e.jsx("span",{children:"Total Transacción:"}),e.jsxs("span",{children:["C$",H(Math.abs(t.totalVenta))]})]}),t.pagoDetalles&&e.jsxs("div",{style:{marginTop:"1rem"},children:[e.jsx("h5",{style:{marginBottom:"0.5rem",fontSize:"1rem"},children:"Detalle del Pago:"}),t.pagoDetalles.efectivo>0&&e.jsxs(V,{children:[e.jsxs("span",{children:[e.jsx(Be,{})," Efectivo Recibido:"]}),e.jsxs("span",{children:["C$",H(t.pagoDetalles.efectivo)]})]}),t.pagoDetalles.tarjeta>0&&e.jsxs(e.Fragment,{children:[e.jsxs(V,{children:[e.jsxs("span",{children:[e.jsx(ut,{})," Tarjeta:"]}),e.jsxs("span",{children:["C$",H(t.pagoDetalles.tarjeta)]})]}),t.pagoDetalles.referenciaTarjeta&&e.jsxs(V,{style:{fontSize:"0.85rem",color:"#666",paddingLeft:"1.5rem"},children:[e.jsx("span",{children:"↳ Ref:"}),e.jsx("span",{children:t.pagoDetalles.referenciaTarjeta})]})]}),t.pagoDetalles.transferencia>0&&e.jsxs(e.Fragment,{children:[e.jsxs(V,{children:[e.jsxs("span",{children:[e.jsx(Ke,{})," Transferencia:"]}),e.jsxs("span",{children:["C$",H(t.pagoDetalles.transferencia)]})]}),t.pagoDetalles.referenciaTransferencia&&e.jsxs(V,{style:{fontSize:"0.85rem",color:"#666",paddingLeft:"1.5rem"},children:[e.jsx("span",{children:"↳ Ref:"}),e.jsx("span",{children:t.pagoDetalles.referenciaTransferencia})]})]}),t.pagoDetalles.credito>0&&e.jsxs(V,{children:[e.jsxs("span",{children:[e.jsx(qe,{})," Crédito Otorgado:"]}),e.jsxs("span",{style:{color:"#dc3545"},children:["C$",H(t.pagoDetalles.credito)]})]}),t.pagoDetalles.vuelto>0&&e.jsxs(V,{children:[e.jsx("span",{children:"Vuelto Entregado:"}),e.jsxs("span",{children:["- C$",H(t.pagoDetalles.vuelto)]})]})]})]})]}),t.estado!=="CANCELADA"&&e.jsxs(ye,{children:[e.jsx("h4",{children:"Acciones"}),e.jsxs(Xt,{children:[e.jsxs(I,{onClick:y,children:[e.jsx(et,{})," Reimprimir Ticket"]}),D&&e.jsxs(I,{$cancel:!0,onClick:M,children:[e.jsx(bt,{})," Cancelar Venta"]})]})]})]})},tn=G.memo(en),Ie=()=>{const t=new Date,r=t.toLocaleString("en-US",{year:"numeric",timeZone:"America/Managua"}),p=t.toLocaleString("en-US",{month:"2-digit",timeZone:"America/Managua"}),x=t.toLocaleString("en-US",{day:"2-digit",timeZone:"America/Managua"});return`${r}-${p}-${x}`},Me=t=>new Intl.NumberFormat("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(t||0)),nn=t=>{if(!t)return{label:"N/A",icon:null};const{efectivo:r,tarjeta:p,transferencia:x,credito:j}=t;if(Number(j)>0)return{label:"Crédito",icon:e.jsx(We,{style:{color:"#dc3545"}})};const f=[];if(Number(r)>0&&f.push("Efectivo"),Number(p)>0&&f.push("Tarjeta"),Number(x)>0&&f.push("Transferencia"),f.length===1){const d=f[0];return d==="Efectivo"?{label:"Efectivo",icon:e.jsx(Se,{style:{color:"#28a745"}})}:d==="Tarjeta"?{label:"Tarjeta",icon:e.jsx(We,{style:{color:"#007bff"}})}:{label:"Transferencia",icon:e.jsx(Ke,{style:{color:"#007bff"}})}}return f.length>1?{label:"Mixto",icon:e.jsx(Se,{style:{color:"#ffc107"}})}:{label:"Contado",icon:e.jsx(Se,{style:{color:"#28a745"}})}},Ce=(t,r=0)=>(t==null?void 0:t.nombre)??(t==null?void 0:t.name)??(t==null?void 0:t.producto)??(t==null?void 0:t.descripcion)??`Item ${r+1}`,rn=m(we)`
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
`,on=m.div`
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid #dee2e6;
  h2 { display: flex; align-items: center; gap: .5rem; margin: 0; }
`,an=m.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(180px, 1fr));
  gap: .75rem 1rem; margin-bottom: 1rem;

  @media (max-width: 1100px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 520px) { grid-template-columns: 1fr; }

  label { display: block; font-size: .9rem; color: #6c757d; margin-bottom: .25rem; }
`,sn=m.div`
  display: grid; grid-template-columns: 380px 1fr; gap: 1rem; flex: 1; min-height: 0;
  @media (max-width: 1024px) { grid-template-columns: 1fr; }
`,ln=m.div`
  background: #f8f9fa; border-radius: 12px; padding: .75rem; display: flex;
  flex-direction: column; min-height: 0;
`,ve=m.div`
  background: #fff; border-radius: 12px; padding: 1rem; min-height: 0;
  box-shadow: 0 2px 10px rgba(0,0,0,.06);
`,dn=m.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: .5rem;
  small { color: #6c757d; }
`,cn=m.div`
  flex: 1; overflow: auto; padding-right: 4px; min-height: 200px;
`,pn=m.div`
  display: flex; justify-content: center; align-items: center; gap: .75rem;
  padding-top: .5rem; border-top: 1px solid #e9ecef;
`,mn=m.div`
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
`,xn=m.span`
  display: inline-flex; align-items: center; justify-content: center;
  border-radius: 9999px; padding: .25rem .6rem; font-weight: 700; font-size: .8rem;
  ${t=>t.$green&&se`background:#e8f7ee; color:#198754;`}
  ${t=>t.$red&&se`background:#fdecec; color:#dc3545;`}
`,hn=G.memo(function({sale:r,isSelected:p,onSelect:x,safeUsers:j,safeClients:f}){const d={COMPLETADA:"#28a745",CANCELADA:"#dc3545",DEVOLUCION:"#ffc107",ABONO_CREDITO:"#17a2b8"},N=l.useMemo(()=>{var T,a;return((T=(j||[]).find(C=>((C==null?void 0:C.id_usuario)??(C==null?void 0:C.id))==(r==null?void 0:r.userId)))==null?void 0:T.nombre_usuario)||((a=r==null?void 0:r.usuario)==null?void 0:a.nombre_usuario)||(r==null?void 0:r.userName)||(r==null?void 0:r.vendedor)||"N/A"},[j,r]),y=l.useMemo(()=>{var T,a;return((T=(f||[]).find(C=>(C==null?void 0:C.id_cliente)===((r==null?void 0:r.clientId)||(r==null?void 0:r.idCliente))))==null?void 0:T.nombre)||((a=r==null?void 0:r.cliente)==null?void 0:a.nombre)||(r==null?void 0:r.clientName)||"Consumidor Final"},[f,r]),u=Number(r.totalVenta??r.total_venta??r.total??0),i=nn(r.pagoDetalles),E=r.estado==="ABONO_CREDITO"?e.jsxs(e.Fragment,{children:[e.jsx(tt,{style:{marginRight:6}})," ABONO"]}):e.jsxs(e.Fragment,{children:["#",r.id," - ",r.estado.replace("_"," ")]});return e.jsxs(mn,{onClick:()=>x(r),selected:p,$borderColor:d[r.estado]||"#6c757d",title:`Venta #${r.id}`,children:[e.jsxs("div",{className:"top",children:[e.jsx("span",{children:E}),e.jsxs("span",{children:[i.icon," C$",Me(Math.abs(u))]})]}),e.jsxs("div",{className:"sub",children:[new Date(r.fecha).toLocaleString("es-NI")," · Cliente: ",e.jsx("strong",{children:y})," · Vendedor: ",N]})]})}),De=10;function fn({dailySales:t=[],loadSales:r,onClose:p,isAdmin:x,users:j=[],clients:f=[],onReprintTicket:d,onCancelSale:N,onReturnItem:y,onAbonoSuccess:u,initialClientId:i=null}){var _e,Pe,Oe,ze;const[E,D]=l.useState(Ie()),[T,a]=l.useState(Ie()),[C,w]=l.useState(Array.isArray(t)?t:[]),[M,h]=l.useState(!1),[k,v]=l.useState(""),[J,A]=l.useState(""),[W,Y]=l.useState(""),[R,Q]=l.useState(1),ne=l.useMemo(()=>Array.isArray(j)?j:[],[j]),F=l.useMemo(()=>Array.isArray(f)?f:[],[f]);l.useEffect(()=>{if(i){const n=F.find(c=>c.id_cliente===i);n?(v(n.nombre),a("")):v(String(i))}},[i,F]);const[o,s]=l.useState(null),[$,O]=l.useState(!1),[_,U]=l.useState({open:!1,title:"",message:""}),L=(n,c)=>U({open:!0,title:n,message:c}),$e=()=>U({open:!1,title:"",message:""}),[re,X]=l.useState({open:!1,title:"",message:"",onConfirm:null}),xe=(n,c,b)=>X({open:!0,title:n,message:c,onConfirm:b}),P=()=>X({open:!1,title:"",message:"",onConfirm:null}),[B,le]=l.useState({open:!1,title:"",message:"",initialValue:"1",onConfirm:null}),de=(n,c,b,z)=>le({open:!0,title:n,message:c,initialValue:String(b??"1"),onConfirm:z}),g=()=>le({open:!1,title:"",message:"",initialValue:"1",onConfirm:null}),q=l.useCallback(async(n=null)=>{if(!r)return[];h(!0),D(n);try{const c=await r(n),b=Array.isArray(c)?c:[];return w(b),b}catch(c){return w([]),L("Error","No se pudieron cargar las transacciones: "+(c.message||"Error de conexión.")),[]}finally{h(!1)}},[r]);l.useEffect(()=>{const c=k&&k.length>=2||i&&!T?null:T;q(c),Q(1),s(null)},[T,q,k,i]),l.useEffect(()=>{T===Ie()&&Array.isArray(t)&&!k&&w(t)},[t,T,k]);const ce=l.useMemo(()=>{const n=(k||"").toLowerCase();return(C||[]).filter(b=>{var fe;const z=b.clientId||b.idCliente,te=((fe=F.find(ge=>ge.id_cliente===z))==null?void 0:fe.nombre)||"";return(!J||String(b.userId)===String(J))&&(!W||b.estado===W)&&(!n||String(b.id).includes(n)||te.toLowerCase().includes(n))}).sort((b,z)=>new Date(z.fecha)-new Date(b.fecha))},[C,J,W,k,F]),ie=Math.max(1,Math.ceil(ce.length/De)),K=(R-1)*De,ee=ce.slice(K,K+De);l.useEffect(()=>{(!o||!ee.some(n=>n.id===o.id))&&s(ee[0]||null)},[ee,o]);const pe=l.useCallback(async(n=null)=>{const c=await q(E);if(n){const b=(c||[]).find(z=>String(z.id)===String(n));s(b||null)}else s(null)},[q,E]),Re=l.useCallback(n=>{const c=n||(o==null?void 0:o.id);if(!(!c||!o)){if(o.estado==="CANCELADA"){L("Venta ya cancelada",`La venta #${c} ya fue cancelada.`);return}if(!N){L("Error de Configuración","onCancelSale no fue proporcionada.");return}xe("Cancelar Venta",`¿Seguro que deseas cancelar la venta #${c}? Esta acción revierte inventario y no se puede deshacer.`,async()=>{P();try{await N(o),L("Éxito",`Venta #${c} cancelada.`),await pe(null)}catch(b){L("Error al Cancelar",b.message||"No se pudo cancelar la venta.")}})}},[o,N,pe]),rt=l.useCallback((n,c=0)=>{if(!o)return;if(!y){L("Error de Configuración","onReturnItem no fue proporcionada.");return}const b=Number((n==null?void 0:n.quantity)||(n==null?void 0:n.cantidad)||0);if(!Number.isFinite(b)||b<=0){L("No se puede devolver","Este artículo no tiene cantidad disponible para devolver.");return}de("Devolver producto",`Cantidad a devolver para "${Ce(n,c)}" (máx. ${b})`,"1",async z=>{const te=Number(z);if(!Number.isFinite(te)||te<=0||te>b){L("Cantidad inválida",`Ingresa un número entre 1 y ${b}.`);return}const fe=o.items.length===1&&te===b,ge=async()=>{try{await y(o,n,te),L("Éxito",`Se devolvieron ${te} unidad(es) de ${Ce(n,c)}.`),await pe(null)}catch(ue){const Ve=((ue==null?void 0:ue.message)||"").toLowerCase(),it=Ve.includes("not found")||Ve.includes("404")?"Ruta de API no encontrada.":ue.message||"No se pudo devolver el producto.";L("Error al Devolver",it)}};if(fe){g(),setTimeout(()=>{X({open:!0,title:"¿Cancelar Venta Completa?",message:`Este es el ÚLTIMO artículo de la venta. 

¿Prefieres CANCELAR toda la venta en lugar de hacer una devolución individual?
(Esto revertirá todo el ticket).`,onConfirm:async()=>{X({open:!1,title:"",message:"",onConfirm:null}),N&&Re(o.id)},onClose:()=>{X({open:!1,title:"",message:"",onConfirm:null}),ge()}})},100);return}await ge()})},[o,y,pe]),he=l.useCallback(()=>{o&&(d==null||d(o))},[o,d]),ot=ce.length,at=ee.length;return e.jsxs(Ne,{"data-history-modal":!0,children:[e.jsxs(rn,{children:[e.jsxs(on,{children:[e.jsxs("h2",{children:[e.jsx(He,{})," Historial de Transacciones"]}),e.jsx(I,{$cancel:!0,onClick:p,children:e.jsx(Ee,{})})]}),e.jsxs(an,{children:[e.jsxs("div",{children:[e.jsxs("label",{children:[e.jsx(jt,{})," Buscar ID/Cliente:"]}),e.jsx(be,{type:"text",placeholder:"ID o nombre",value:k,onChange:n=>v(n.target.value)})]}),e.jsxs("div",{children:[e.jsxs("label",{children:[e.jsx(Xe,{})," Fecha:"]}),e.jsx(be,{type:"date",value:T,onChange:n=>a(n.target.value)})]}),x&&e.jsxs("div",{children:[e.jsxs("label",{children:[e.jsx(yt,{})," Usuario:"]}),e.jsxs(be,{as:"select",value:J,onChange:n=>A(n.target.value),children:[e.jsx("option",{value:"",children:"Todos"}),ne.map(n=>e.jsx("option",{value:n.id_usuario??n.id,children:n.nombre_usuario??n.nombre},n.id_usuario??n.id))]})]}),e.jsxs("div",{children:[e.jsxs("label",{children:[e.jsx(Ct,{})," Estado:"]}),e.jsxs(be,{as:"select",value:W,onChange:n=>Y(n.target.value),children:[e.jsx("option",{value:"",children:"Todos"}),e.jsx("option",{value:"COMPLETADA",children:"Completadas"}),e.jsx("option",{value:"CANCELADA",children:"Canceladas"}),e.jsx("option",{value:"DEVOLUCION",children:"Devoluciones"}),e.jsx("option",{value:"ABONO_CREDITO",children:"Abonos"})]})]})]}),e.jsxs(sn,{children:[e.jsxs(ln,{children:[e.jsxs(dn,{children:[e.jsx("small",{children:k?e.jsx("strong",{children:"Mostrando historial de búsqueda"}):`Resultados: ${ot}`}),e.jsxs(xn,{$green:!0,children:["Mostrando ",at]})]}),M&&e.jsx(ke,{style:{textAlign:"center",margin:".5rem 0"},children:"Cargando transacciones…"}),!M&&e.jsx(cn,{children:ee.length?ee.map(n=>e.jsx(hn,{sale:n,isSelected:(o==null?void 0:o.id)===n.id,onSelect:s,safeUsers:ne,safeClients:F},n.id)):e.jsx("p",{style:{textAlign:"center",color:"#6c757d",marginTop:"1rem"},children:"No se encontraron transacciones para la fecha y filtros seleccionados."})}),ie>1&&e.jsxs(pn,{children:[e.jsx(I,{onClick:()=>Q(n=>Math.max(1,n-1)),disabled:R===1,title:"Anterior",children:e.jsx(vt,{})}),e.jsxs("span",{children:["Página ",R," de ",ie]}),e.jsx(I,{onClick:()=>Q(n=>Math.min(ie,n+1)),disabled:R===ie,title:"Siguiente",children:e.jsx(Nt,{})})]})]}),o?o.estado==="ABONO_CREDITO"?e.jsxs(ve,{children:[e.jsxs("div",{style:{borderBottom:"2px dashed #ccc",paddingBottom:15,marginBottom:15},children:[e.jsxs("h3",{style:{margin:0,fontSize:"1.4rem",color:"#17a2b8",textAlign:"center"},children:[e.jsx(tt,{})," Recibo de Abono"]}),e.jsxs("p",{style:{textAlign:"center",color:"#555",margin:"5px 0"},children:["#",o.id]})]}),e.jsx(ke,{children:e.jsxs("div",{style:{display:"grid",gap:10},children:[e.jsxs(Z,{children:[e.jsx("span",{children:"Fecha:"}),e.jsx("strong",{children:new Date(o.fecha).toLocaleString("es-NI")})]}),e.jsxs(Z,{children:[e.jsx("span",{children:"Cliente:"}),e.jsx("strong",{style:{fontSize:"1.1rem"},children:((_e=F.find(n=>n.id_cliente===(o.clientId||o.idCliente)))==null?void 0:_e.nombre)||"Desconocido"})]}),e.jsxs(Z,{children:[e.jsx("span",{children:"Cajero:"}),e.jsx("strong",{children:((Pe=ne.find(n=>(n.id_usuario??n.id)==o.userId))==null?void 0:Pe.nombre_usuario)||o.usuarioNombre||"Sistema"})]})]})}),e.jsx("div",{style:{margin:"20px 0",border:"1px solid #ddd",padding:15,borderRadius:8,background:"#f8f9fa"},children:e.jsxs(Z,{style:{fontSize:"1.2rem",color:"#28a745"},children:[e.jsx("span",{children:"Monto Abonado:"}),e.jsxs("strong",{children:["C$ ",Me(o.totalVenta)]})]})}),e.jsx("div",{style:{display:"flex",justifyContent:"center",marginTop:20},children:e.jsxs(I,{onClick:he,style:{fontSize:"1.1rem",padding:"10px 20px"},children:[e.jsx(et,{})," Imprimir Comprobante"]})})]}):o.estado==="DEVOLUCION"?e.jsxs(ve,{children:[e.jsxs("h3",{style:{marginTop:0},children:["Detalle de Transacción #",o.id]}),e.jsxs("div",{className:"box",style:{marginTop:10},children:[e.jsxs("p",{children:[e.jsx("strong",{children:"Cliente:"})," ",((Oe=F.find(n=>n.id_cliente===(o.clientId||o.idCliente)))==null?void 0:Oe.nombre)||"Consumidor Final"]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Fecha:"})," ",new Date(o.fecha).toLocaleString("es-NI")]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Estado:"})," ",e.jsx("span",{style:{background:"#fff3cd",color:"#856404",padding:"2px 8px",borderRadius:8,fontWeight:700},children:"DEVOLUCIÓN"})]})]}),e.jsxs("div",{className:"box",style:{marginTop:10},children:[e.jsx("h4",{style:{marginTop:0},children:"Detalle de Devolución"}),e.jsx("ul",{style:{margin:0,paddingLeft:18},children:(o.items||[]).map((n,c)=>e.jsxs("li",{children:[e.jsx("strong",{children:Ce(n,c)})," ","— ",Number(n.quantity||n.cantidad||0)," u. @ C$",Number(n.precio||n.precio_unitario||0).toFixed(2)]},`${n.id||n.id_producto}-${c}`))}),e.jsxs("p",{style:{marginTop:8},children:["Importe devuelto:"," ",e.jsxs("strong",{children:["C$",(()=>{const n=Number(o.totalVenta??o.total_venta??o.total??0);return Math.abs(n).toFixed(2)})()]})]})]}),e.jsx("div",{style:{display:"flex",justifyContent:"flex-start",gap:10,marginTop:12},children:e.jsx(I,{onClick:he,children:"Reimprimir Ticket"})})]}):o.estado==="CANCELADA"?e.jsxs(ve,{children:[e.jsxs("h3",{style:{marginTop:0,color:"#dc3545"},children:["Detalle de Venta Cancelada #",o.id]}),e.jsxs("div",{className:"box",style:{marginTop:10},children:[e.jsxs("p",{children:[e.jsx("strong",{children:"Cliente:"})," ",((ze=F.find(n=>n.id_cliente===(o.clientId||o.idCliente)))==null?void 0:ze.nombre)||"Consumidor Final"]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Fecha:"})," ",new Date(o.fecha).toLocaleString("es-NI")]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Estado:"})," ",e.jsx("span",{style:{background:"#f8d7da",color:"#721c24",padding:"2px 8px",borderRadius:8,fontWeight:700},children:"CANCELADA"})]})]}),e.jsxs("div",{className:"box",style:{marginTop:10},children:[e.jsx("h4",{style:{marginTop:0},children:"Productos Cancelados"}),!o.items||o.items.length===0?e.jsx("p",{style:{color:"#6c757d",fontStyle:"italic"},children:"No hay detalles de productos disponibles."}):e.jsx("ul",{style:{margin:0,paddingLeft:18,color:"#6c757d"},children:o.items.map((n,c)=>e.jsxs("li",{children:[e.jsx("strong",{children:Ce(n,c)})," ","— ",Number(n.quantity||n.cantidad||0)," u."]},`${n.id||n.id_producto}-${c}`))}),e.jsxs("p",{style:{marginTop:8,color:"#dc3545",textDecoration:"line-through"},children:["Total Anulado: ",e.jsxs("strong",{children:["C$ ",Me(o.totalVenta)]})]})]}),e.jsx("div",{style:{display:"flex",justifyContent:"flex-start",gap:10,marginTop:12},children:e.jsx(I,{onClick:he,children:"Reimprimir Comprobante"})})]}):e.jsx(tn,{sale:o,client:F.find(n=>n.id_cliente===(o.clientId||o.idCliente)),creditStatus:null,dailySales:C,isAdmin:x,onOpenAbonoModal:()=>O(!0),onCancelSale:n=>Re(n),onReturnItem:(n,c)=>rt(n,c),onReprintTicket:he,showConfirmation:({onConfirm:n})=>xe("Confirmación","¿Confirmar acción?",n),showPrompt:({title:n,message:c,defaultValue:b,onConfirm:z})=>de(n,c,b,z),showAlert:({title:n,message:c})=>L(n,c)}):e.jsx(ve,{children:e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",color:"#aaa",fontStyle:"italic",flexDirection:"column"},children:[e.jsx(He,{size:40,style:{marginBottom:10,opacity:.5}}),e.jsx("p",{children:"Seleccione una transacción para ver detalles"})]})})]}),$&&o&&e.jsx(Ot,{client:F.find(n=>n.id_cliente===(o.clientId||o.idCliente)),onClose:()=>O(!1),onAbonoSuccess:async()=>{O(!1),await pe(o.id),u==null||u()},showAlert:({title:n,message:c})=>L(n,c)})]}),e.jsx(St,{isOpen:_.open,onClose:$e,title:_.title,message:_.message}),e.jsx(gn,{isOpen:!!re.open,title:re.title,message:re.message,onCancel:P,onConfirm:re.onConfirm||P}),e.jsx(un,{isOpen:!!B.open,title:B.title,message:B.message,initialValue:B.initialValue,onCancel:g,onConfirm:n=>{const c=B.onConfirm;g(),c&&c(n)}})]})}const nt=({isOpen:t,children:r,maxWidth:p=450})=>t?e.jsx(Ne,{style:{zIndex:99999,backgroundColor:"rgba(0,0,0,0.6)"},children:e.jsx(we,{style:{maxWidth:`${p}px`,textAlign:"center"},children:r})}):null,gn=({isOpen:t,title:r,message:p,onCancel:x,onConfirm:j})=>e.jsxs(nt,{isOpen:t,children:[e.jsx("h2",{style:{marginTop:0},children:r}),e.jsx("p",{style:{color:"#6c757d",lineHeight:1.5},children:p}),e.jsxs("div",{style:{display:"flex",justifyContent:"center",gap:10,marginTop:10},children:[e.jsx(I,{onClick:x,$cancel:!0,children:"Cancelar"}),e.jsx(I,{onClick:j,primary:!0,children:"Aceptar"})]})]}),un=({isOpen:t,title:r,message:p,initialValue:x="1",inputType:j="number",onCancel:f,onConfirm:d})=>{const[N,y]=l.useState(x);return l.useEffect(()=>{y(x)},[x,t]),e.jsxs(nt,{isOpen:t,children:[e.jsx("h2",{style:{marginTop:0},children:r}),p&&e.jsx("p",{style:{color:"#6c757d"},children:p}),e.jsx("input",{style:{width:"100%",padding:".6rem",borderRadius:8,border:"1px solid #dee2e6",margin:"8px 0 14px"},type:j,value:N,onChange:u=>y(u.target.value)}),e.jsxs("div",{style:{display:"flex",justifyContent:"center",gap:10},children:[e.jsx(I,{onClick:f,$cancel:!0,children:"Cancelar"}),e.jsx(I,{onClick:()=>d(N),primary:!0,children:"Aceptar"})]})]})},Nn=G.memo(fn);export{Ot as A,Nn as S,vn as T};

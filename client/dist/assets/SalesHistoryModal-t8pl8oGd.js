import{R as X,r as i,j as e,n as xt,ad as ht,a8 as ft,D as gt,s as p,v as ut,x as Le,aR as bt,ae as Pe,C as jt,q as yt,ac as de,b9 as Ct,b2 as Ue,h as Ge,ba as rt,bb as wt,I as vt,aZ as at,ak as Nt,X as Ze,Y as kt,ai as $t,aO as St,bc as At,bd as Tt,a_ as it,ah as Dt,al as It,be as Ye,af as De}from"./vendor-j_myMsPa.js";import{M as Se,B as A,f as q,a as Oe,I as Ae,S as ve}from"./POS.styles-edu8PlKE.js";import{u as Re,Z as Et,i as Ft,a as zt,m as Lt}from"./index-8T-9wPBW.js";import{A as Rt}from"./AlertModal-D8LdRFUA.js";const Mt=p.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1050;
  backdrop-filter: blur(5px);
`,_t=p.div`
  background: white; padding: 2rem; border-radius: 12px; width: 560px; max-width: 95%; max-height: 90vh; overflow-y: auto;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  animation: fadeIn 0.3s ease-out;
  @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
`,Pt=p.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;
  border-bottom: 1px solid #e9ecef; padding-bottom: 1rem;
`,Ot=p.h2`margin: 0; font-size: 1.5rem; color: #333;`,Vt=p.button`
  border: none; background: none; font-size: 1.5rem; cursor: pointer; color: #888;
  &:hover { color: #333; }
`,Bt=p.form`display: flex; flex-direction: column; gap: 1.25rem;`,Ie=p.div`display: flex; flex-direction: column; gap: 0.5rem;`,Ee=p.label`font-weight: 600; color: #495057; font-size: 0.9rem;`,Me=p.input`
  padding: 0.75rem; border: 1px solid #ccc; border-radius: 6px; font-size: 1rem;
  &:focus { border-color: #007bff; outline: none; box-shadow: 0 0 0 2px rgba(0,123,255,0.25); }
`,Wt=p(Me).attrs({as:"select"})``,Je=p.button`
  padding: 0.85rem 1.5rem; background: #28a745; color: white; border: none;
  border-radius: 6px; font-weight: bold; display: flex; align-items: center; gap: 0.5rem;
  justify-content: center; cursor: pointer; transition: background-color 0.2s; font-size: 1rem;
  &:hover:not(:disabled) { background: #218838; }
  &:disabled { background: #6c757d; cursor: not-allowed; }
`,qt=p.p`
  margin: 0 0 0.5rem 0; padding: 0.75rem; background-color: #e9ecef; border-radius: 6px;
  color: #495057; text-align: center; font-size: 1rem;
  strong { color: #dc3545; }
`,Ht=p.p`
  margin-top: -1rem; margin-bottom: 0.5rem; padding: 0.5rem; color: #dc3545; font-size: 0.9rem; text-align: center;
`,Qe=p(ut)`
  animation: spin 1s linear infinite;
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`,Xe=p.div`
  display: flex; flex-direction: column; gap: 0.5rem;
  max-height: 220px; overflow-y: auto; padding: 0.25rem;
`,Ke=p.div`
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
`,Ut=p.div`
  font-size: 0.85rem; font-weight: 600; color: #495057;
  margin-bottom: 0.25rem; display: flex; align-items: center; gap: 0.5rem;
`,ge=t=>`C$${Number(t||0).toFixed(2)}`,et=t=>t?new Date(t).toLocaleDateString("es-NI",{timeZone:"America/Managua",day:"2-digit",month:"2-digit",year:"numeric"}):"—",Gt=({client:t,onClose:o,onAbonoSuccess:x,showAlert:h})=>{const{addCajaTransaction:w,user:u}=Re(),[d,k]=i.useState(""),[C,L]=i.useState("Efectivo"),[b,s]=i.useState(""),[T,E]=i.useState(!1),[I,a]=i.useState(""),[S,j]=i.useState([]),[R,m]=i.useState(!0),[g,K]=i.useState(null),V=i.useMemo(()=>Number(t==null?void 0:t.saldo_pendiente)||0,[t]);i.useEffect(()=>{const c=async()=>{m(!0);try{const v=localStorage.getItem("token"),_=await Ft(t.id_cliente,v);j(Array.isArray(_)?_:[])}catch(v){console.error("Error cargando tickets:",v),j([])}finally{m(!1)}};t!=null&&t.id_cliente&&c()},[t]);const D=i.useMemo(()=>S.filter(c=>c.saldoRestante>0),[S]),re=i.useMemo(()=>S.filter(c=>c.saldoRestante<=0),[S]),M=g?Math.min(V,g.saldoRestante):V;i.useEffect(()=>{if(!d){a("");return}const c=parseFloat(d);isNaN(c)||c<=0?a("Ingrese un monto válido mayor a cero."):c>M?a(`El máximo es ${ge(M)}.`):a("")},[d,M]);const ae=c=>{c.saldoRestante<=0||(K(v=>(v==null?void 0:v.idVenta)===c.idVenta?null:c),k(""))},ee=()=>{k(g?g.saldoRestante.toFixed(2):V.toFixed(2))},F=i.useCallback((c,v,_,z)=>{const N=Math.max(0,z-c),ce=new Date().toLocaleString("es-NI",{timeZone:"America/Managua"}),te=g?`Venta #${g.idVenta}`:"Cuenta General",U=`
      <div style="font-family:'League Spartan','Inter',system-ui,sans-serif;width:80mm;padding:6px 4px;font-size:9pt;color:#000;">
        <div style="text-align:center;border-bottom:2px solid #000;padding-bottom:6px;margin-bottom:6px;">
          <h1 style="margin:4px 0;font-size:14pt;font-weight:900;">COMPROBANTE DE ABONO</h1>
        </div>
        <div style="margin-bottom:8px;border-bottom:1px dashed #000;padding-bottom:6px;">
          <p style="margin:2px 0;display:flex;justify-content:space-between;"><strong>Cliente:</strong><span>${(t==null?void 0:t.nombre)||"N/A"}</span></p>
          <p style="margin:2px 0;display:flex;justify-content:space-between;"><strong>Fecha:</strong><span>${ce}</span></p>
          <p style="margin:2px 0;display:flex;justify-content:space-between;"><strong>Aplicado a:</strong><span>${te}</span></p>
          <p style="margin:2px 0;display:flex;justify-content:space-between;"><strong>Método:</strong><span>${v}</span></p>
          ${_?`<p style="margin:2px 0;display:flex;justify-content:space-between;"><strong>Ref:</strong><span>${_}</span></p>`:""}
        </div>
        <div style="border-top:2px solid #000;padding-top:8px;margin-top:8px;">
          <p style="display:flex;justify-content:space-between;margin:4px 0;font-size:11pt;"><strong>Saldo Anterior:</strong><span>C$${z.toFixed(2)}</span></p>
          <p style="display:flex;justify-content:space-between;margin:4px 0;font-size:14pt;font-weight:900;color:#28a745;"><strong>ABONO:</strong><span>C$${c.toFixed(2)}</span></p>
          <p style="display:flex;justify-content:space-between;margin:4px 0;font-size:14pt;font-weight:900;color:#dc3545;border-top:2px solid #000;padding-top:6px;"><strong>SALDO RESTANTE:</strong><span>C$${N.toFixed(2)}</span></p>
        </div>
        <div style="text-align:center;margin-top:12px;font-size:8pt;font-style:italic;color:#555;border-top:1px dashed #000;padding-top:8px;">
          Documento no válido como factura.<br/>Gracias por su pago.
        </div>
      </div>
    `,P=window.open("","_blank","width=400,height=600");P&&(P.document.write(`<!DOCTYPE html><html><head><title>Comprobante Abono</title><link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;700;900&display=swap" rel="stylesheet"><style>@page{size:80mm auto;margin:0;}body{margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;}*{font-weight:800!important;color:#000!important;}</style></head><body>${U}</body></html>`),P.document.close(),P.focus(),P.onload=function(){setTimeout(()=>{P.print(),setTimeout(()=>P.close(),500)},400)})},[t,g]),r=i.useCallback(async c=>{c.preventDefault();const v=parseFloat(d),_=localStorage.getItem("token");if(I||!v||v<=0){h==null||h({title:"Monto Inválido",message:I||"Revise el monto ingresado."});return}if(C!=="Efectivo"&&!b.trim()){h==null||h({title:"Referencia Requerida",message:"Ingrese el número de referencia, transferencia o voucher."});return}E(!0);try{await Et(t.id_cliente,{monto:v,id_venta:(g==null?void 0:g.idVenta)||null,pagoDetalles:{metodo:C,usuario:(u==null?void 0:u.nombre_usuario)||"Desconocido",referencia:b||"",ticketRef:g?`Venta #${g.idVenta}`:"FIFO"}},_);const z=C==="Efectivo",N={id:`abono-${Date.now()}`,type:"abono",amount:v,note:`Abono Cliente: ${t.nombre} (${C})${g?` - Venta #${g.idVenta}`:""} ${b?"- Ref: "+b:""}`,at:new Date().toISOString(),pagoDetalles:{clienteId:t.id_cliente,clienteNombre:t.nombre,metodo:C,referencia:b,ingresoCaja:z?v:0,efectivo:z?v:0,tarjeta:C==="Tarjeta"?v:0,transferencia:C==="Transferencia"?v:0,credito:0}};await w(N),F(v,C,b,V),x==null||x(N),o==null||o()}catch(z){console.error("Error al registrar abono:",z),h==null||h({title:"Error",message:`No se pudo registrar el abono. ${z.message}`})}finally{E(!1)}},[d,C,b,I,t,u,g,w,x,o,h,F,V]),Y=T||V<=0||!!I||!d;return e.jsx(Mt,{children:e.jsxs(_t,{children:[e.jsxs(Pt,{children:[e.jsx(Ot,{children:"Registrar Abono"}),e.jsx(Vt,{onClick:o,disabled:T,children:e.jsx(xt,{})})]}),e.jsxs("p",{children:["Cliente: ",e.jsx("strong",{children:(t==null?void 0:t.nombre)||"Desconocido"})]}),e.jsxs(qt,{children:["Saldo Pendiente Total: ",e.jsx("strong",{children:ge(V)})]}),R?e.jsxs("div",{style:{textAlign:"center",padding:"1rem",color:"#6c757d"},children:[e.jsx(Qe,{})," Cargando facturas..."]}):D.length>0?e.jsxs(e.Fragment,{children:[e.jsxs(Ut,{children:[e.jsx(ht,{})," Selecciona una factura (opcional — si no, paga la más antigua):"]}),e.jsx(Xe,{children:D.map(c=>e.jsxs(Ke,{$selected:(g==null?void 0:g.idVenta)===c.idVenta,onClick:()=>ae(c),children:[e.jsxs("div",{className:"ticket-info",children:[e.jsxs("span",{className:"ticket-id",children:["Venta #",c.idVenta]}),e.jsx("span",{className:"ticket-date",children:et(c.fecha)})]}),e.jsxs("div",{className:"ticket-amounts",children:[c.montoOriginal!==c.saldoRestante&&e.jsx("div",{className:"original",children:ge(c.montoOriginal)}),e.jsx("div",{className:"remaining",children:ge(c.saldoRestante)})]})]},c.idVenta))}),re.length>0&&e.jsxs("details",{style:{marginTop:"0.5rem"},children:[e.jsxs("summary",{style:{cursor:"pointer",fontSize:"0.85rem",color:"#6c757d"},children:[e.jsx(ft,{style:{color:"#28a745"}})," ",re.length," factura(s) pagada(s)"]}),e.jsx(Xe,{style:{marginTop:"0.5rem"},children:re.map(c=>e.jsxs(Ke,{$paid:!0,children:[e.jsxs("div",{className:"ticket-info",children:[e.jsxs("span",{className:"ticket-id",children:["Venta #",c.idVenta]}),e.jsx("span",{className:"ticket-date",children:et(c.fecha)})]}),e.jsx("div",{className:"ticket-amounts",children:e.jsx("div",{className:"remaining",style:{color:"#28a745"},children:"Pagada ✔"})})]},c.idVenta))})]})]}):null,e.jsxs(Bt,{onSubmit:r,children:[e.jsxs(Ie,{children:[e.jsxs(Ee,{htmlFor:"montoAbono",children:["Monto a Abonar (C$)",g&&e.jsxs("span",{style:{fontWeight:"normal",color:"#007bff",marginLeft:"0.5rem"},children:["— Venta #",g.idVenta," (máx: ",ge(M),")"]})]}),e.jsxs("div",{style:{display:"flex",gap:"0.5rem"},children:[e.jsx(Me,{id:"montoAbono",type:"number",value:d,onChange:c=>k(c.target.value),placeholder:"0.00",required:!0,autoFocus:!0,step:"0.01",min:"0.01",max:M?M.toFixed(2):void 0,disabled:T||V<=0,style:{flex:1}}),e.jsx(Je,{type:"button",onClick:ee,style:{background:"#007bff",padding:"0.5rem 0.75rem",fontSize:"0.85rem"},disabled:T||V<=0,children:"Total"})]})]}),e.jsxs(Ie,{children:[e.jsx(Ee,{htmlFor:"metodoPago",children:"Método de Pago"}),e.jsxs(Wt,{id:"metodoPago",value:C,onChange:c=>L(c.target.value),disabled:T,children:[e.jsx("option",{value:"Efectivo",children:"Efectivo"}),e.jsx("option",{value:"Tarjeta",children:"Tarjeta"}),e.jsx("option",{value:"Transferencia",children:"Transferencia"})]})]}),C!=="Efectivo"&&e.jsxs(Ie,{children:[e.jsx(Ee,{htmlFor:"referencia",children:"Referencia / Voucher / N° Transferencia"}),e.jsx(Me,{id:"referencia",type:"text",value:b,onChange:c=>s(c.target.value),placeholder:"Ej: BAC-123456",required:!0})]}),I&&e.jsx(Ht,{children:I}),e.jsx(Je,{type:"submit",disabled:Y,children:T?e.jsxs(e.Fragment,{children:[e.jsx(Qe,{})," Procesando..."]}):e.jsxs(e.Fragment,{children:[e.jsx(gt,{})," Registrar Abono"]})})]})]})})},Zt=X.memo(Gt),Yt=yt`
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
`,Jt=p.div`
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
`,Qt=p.div`
  display: flex; flex-direction: column; gap: 12px;
  max-height: 60vh;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    max-height: 65vh;
  }
`,Xt=p.img`
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
`,ue=p.span`
  display: inline-flex; align-items: center; gap: 6px;
  font-weight: 900; letter-spacing: .5px; padding: 5px 10px; border-radius: 4px;
  font-size: 0.85rem;
  ${({$type:t})=>t==="proforma"&&de`background: #e8f4ff; color: #0b72b9; border: 2px solid #0b72b9;`}
  ${({$type:t})=>t==="abono"&&de`background: #fff3cd; color: #856404; border: 2px solid #856404;`}
  ${({$type:t})=>t==="venta"&&de`background: #e8f7ee; color: #1c7d3a; border: 2px solid #1c7d3a;`}
  ${({$type:t})=>t==="outflow"&&de`background: #fee2e2; color: #991b1b; border: 2px solid #991b1b;`}
  ${({$type:t})=>t==="pro"&&de`background: #f3e8ff; color: #8b5cf6; border: 2px solid #8b5cf6;`}
`,Kt=p.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 1rem; border-bottom: 2px solid #e2e8f0; padding-bottom: .75rem;
  flex-wrap: wrap; gap: 8px;

  h2 { font-size: 1.1rem; }

  @media (max-width: 600px) {
    flex-direction: column; align-items: stretch;
    h2 { font-size: 1rem; }
  }
`,en=p.div`
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
`,G=t=>new Intl.NumberFormat("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(t||0)),$=(...t)=>t.find(o=>o!=null),le=t=>$(t==null?void 0:t.usuarioNombre,t==null?void 0:t.nombre_usuario,t==null?void 0:t.nombre,t==null?void 0:t.name,t==null?void 0:t.displayName,t==null?void 0:t.fullName,t==null?void 0:t.username,null);function tn(t=[]){return t.map((o,x)=>{const h=Number($(o.quantity,o.cantidad,o.qty,0)),w=$(o.nombre,o.descripcion,o.description,o.producto,`Item ${x+1}`),u=Number($(o.precio_unitario,o.precio_venta,o.precio,o.unitPrice,0));return{id:$(o.id_producto,o.id,`it-${x}`),nombre:w,quantity:h,unit:u,total:h*u}})}function nn(t={}){const o=Number(t.efectivo||0),x=Number(t.tarjeta||0),h=Number(t.transferencia||0),w=Number(t.dolares||0);if(Number(t.credito||0)>0)return"Crédito";const d=[];return o>0&&d.push("Efectivo"),x>0&&d.push("Tarjeta"),h>0&&d.push("Transferencia"),w>0&&d.push("Dólares"),d.length===0?"Contado":d.length===1?d[0]:"Mixto"}function on(t={},o=0){const x=Number(t.efectivo||0),h=Number(t.tarjeta||0),w=Number(t.transferencia||0),u=Number(t.otro||0),d=Number(t.dolares||0),k=Number(t.tasaDolarAlMomento||t.tasaObtenida||1),C=d*(k>1?k:1),L=x+h+w+u+C;return L>0?L:Number(t.montoRecibido||o||0)}function rn(t){const o=$(t==null?void 0:t.fecha,t==null?void 0:t.createdAt,t==null?void 0:t.created_at,t==null?void 0:t.date,t);try{const x=new Date(o);return isNaN(x)?"Fecha inválida":x.toLocaleString("es-NI",{hour12:!0})}catch{return"Fecha inválida"}}function an(t){const o=$(t.proformaId,t.proformaNumero,t.numeroProforma,t.id);if(o)return o;const x=new Date,h=x.toISOString().slice(2,10).replace(/-/g,""),w=x.toTimeString().slice(0,8).replace(/:/g,"");return`PF-${h}-${w}`}const Dn=({transaction:t,onClose:o,clients:x=[],users:h=[],isOpen:w=!0,printMode:u="80",currentUser:d=null,onPersistPrint:k=null,autoTriggerPrint:C=!1,showAlert:L=null})=>{var xe;const{user:b}=typeof Re=="function"?Re():{user:null},{settings:s}=zt();if(!w||t==null)return null;const[T]=X.useState(typeof t=="object"?t:null),[E]=X.useState(!1),[I]=X.useState(null);if(E||I||!T)return e.jsx(Se,{className:"no-print",children:e.jsxs(tt,{className:"no-print",style:{maxWidth:420,padding:"1rem"},children:[e.jsx("h3",{style:{color:"#dc3545"},children:"No se pudo imprimir"}),e.jsx("div",{style:{display:"flex",justifyContent:"center",marginTop:12},children:e.jsxs(A,{onClick:o,$cancel:!0,children:[e.jsx(Le,{})," Cerrar"]})})]})});const a=T,S=a.estado==="ABONO_CREDITO",j=!!(a.isProforma||a.proformaFor||a.proformaNombre),R=!!a.isOutflow,m=a.estado==="DEVOLUCION",g=j?an(a):$(a.id,a.saleId,a.numero,"-"),K=rn($(a.fecha,a.createdAt,a.date)),V=$(a.clientId,a.idCliente,a.clienteId),D=x.find(f=>String(f.id_cliente??f.id)===String(V)),re=j&&a.proformaNombre?a.proformaNombre:$(D==null?void 0:D.nombre,a.clienteNombre,"Consumidor Final"),M=(D==null?void 0:D.cedula)||a.clienteCedula,ae=$(a.userId,a.idUsuario,(xe=a.openedBy)==null?void 0:xe.id)??(d==null?void 0:d.id_usuario)??(d==null?void 0:d.id)??(d==null?void 0:d.uid)??(b==null?void 0:b.id_usuario)??(b==null?void 0:b.id)??(b==null?void 0:b.uid),ee=(()=>{try{return JSON.parse(localStorage.getItem("authUser")||"null")}catch{return null}})(),F=h.find(f=>String(f.id_usuario||f.id||f.uid)===String(ae)),r=$(a.usuarioNombre,le(F),le(d),le(b),le(ee),"Cajero POS"),Y=j?$(a.usuarioNombre,le(d),le(b),le(ee),r):r,c=tn($(a.items,a.detalle,[])),v=c.reduce((f,W)=>f+Number(W.unit)*Number(W.quantity),0),_=Number($(a.subtotal,v)),z=Number($(a.descuento,0)),N=Number($(a.totalVenta,a.total_venta,_-z,0)),ce=a.pagoDetalles||{},te=j||R?"N/A":$(a.metodoPago,nn(ce)),U=j||R?0:on(ce,N),P=j||R?0:Math.max(0,U-N),ie=Math.abs(Number($(a.totalVenta,a.montoAbono,0))),J=Number((D==null?void 0:D.saldo_pendiente)||0),be=J+ie,je=c.length<=2,me=i.useMemo(()=>s!=null&&s.empresa_logo_url?s.empresa_logo_url.startsWith("http")?s.empresa_logo_url:`${"https://multirepuestosrg.com/api".replace(/\/api$/,"")}${s.empresa_logo_url.startsWith("/")?"":"/"}${s.empresa_logo_url}`:null,[s==null?void 0:s.empresa_logo_url]),O={name:(s==null?void 0:s.empresa_nombre)||"Multirepuestos RG",ruc:(s==null?void 0:s.empresa_ruc)||"1211812770001E",phone:(s==null?void 0:s.empresa_telefono)||"84031936 / 84058142",address:(s==null?void 0:s.empresa_direccion)||"Del portón de la normal 75 varas al este. Juigalpa, Chontales.",slogan:(s==null?void 0:s.empresa_eslogan)||"Repuestos de confianza al mejor precio",logo:me||new URL("/icons/logo.png",window.location.origin).toString()};X.useCallback(async f=>{},[]);const ne=X.useCallback((f="80",W=!1)=>{const he=document.getElementById("print-wrapper-ticket");if(!he)return;const Te=he.outerHTML,pe=`
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
    `,Q=window.open("","_blank","width=900,height=700");Q&&(Q.document.write(`<html><head><title>Impresión ${f.toUpperCase()} - ${O.name}</title><style>${pe}</style></head><body>${Te}</body></html>`),Q.document.close(),Q.focus(),setTimeout(()=>{try{Q.print()}catch(fe){console.error("Print error:",fe)}setTimeout(()=>{try{Q.close()}catch{}},1e3)},400),W&&setTimeout(()=>{o&&o()},800))},[O,o]),se=i.useRef(!1);return i.useEffect(()=>{if(C&&!se.current){se.current=!0;const f=setTimeout(()=>ne("80",!0),500);return()=>clearTimeout(f)}},[C,ne]),e.jsxs(Se,{className:"no-print",children:[e.jsx(Yt,{}),e.jsxs(tt,{className:"no-print",children:[e.jsxs(Kt,{children:[e.jsxs("h2",{style:{display:"flex",alignItems:"center",gap:8,margin:0},children:[e.jsx(bt,{color:"#2563eb"})," Vista de Impresión"]}),e.jsxs(en,{children:[e.jsxs(A,{onClick:()=>ne("80"),style:{background:"#2563eb",color:"#fff",fontWeight:700},children:[e.jsx(Pe,{})," 80mm"]}),e.jsxs(A,{onClick:()=>ne("A4"),style:{background:"#0f766e",color:"#fff",fontWeight:700},children:[e.jsx(jt,{})," A4"]}),e.jsx(A,{$cancel:!0,onClick:o,style:{background:"#fee2e2",color:"#ef4444"},children:e.jsx(Le,{})})]})]}),e.jsx(Qt,{children:e.jsxs(Jt,{id:"print-wrapper-ticket",className:`print-area ${u==="A4"?"print-a4":"print-80"} ${je?"compact":""}`,children:[e.jsxs("div",{className:"brand",children:[e.jsx("div",{className:"brand-logo-container",children:e.jsx(Xt,{className:u==="A4"?"logo-a4":"logo-80mm",src:O.logo,alt:"Logo",onError:f=>{f.currentTarget.style.display="none"}})}),e.jsxs("div",{className:"brand-info",children:[e.jsx("h1",{children:O.name}),e.jsx("small",{children:e.jsx("strong",{children:O.slogan})}),e.jsxs("small",{children:[e.jsx("strong",{children:"RUC:"})," ",O.ruc]}),e.jsxs("small",{children:[e.jsx("strong",{children:"Tel:"})," ",O.phone]}),e.jsx("small",{children:O.address}),e.jsx("div",{style:{marginTop:8},children:j?e.jsx(ue,{$type:"proforma",className:"ticket-tag",children:"PROFORMA"}):S?e.jsx(ue,{$type:"abono",className:"ticket-tag",children:"RECIBO"}):R?e.jsx(ue,{$type:"outflow",className:"ticket-tag",children:"SALIDA"}):a.isProReceipt||a.isWholesale?e.jsx(ue,{$type:"pro",className:"ticket-tag",children:"RECIBO PRO"}):e.jsx(ue,{$type:"venta",className:"ticket-tag",children:m?"DEVOLUCIÓN":"FACTURA"})})]})]}),e.jsxs("div",{className:"meta",children:[e.jsxs("div",{className:"meta-col",children:[e.jsx("span",{className:"meta-title",children:"Detalles del Documento"}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Fecha:"}),e.jsx("span",{className:"meta-value",children:K})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"No. Documento:"}),e.jsx("span",{className:"meta-value",children:g})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Atendido por:"}),e.jsx("span",{className:"meta-value",children:Y})]})]}),e.jsxs("div",{className:"meta-col",children:[e.jsx("span",{className:"meta-title",children:"Datos del Cliente"}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Cliente:"}),e.jsx("span",{className:"meta-value",children:re})]}),M&&e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Cédula/RUC:"}),e.jsx("span",{className:"meta-value",children:M})]}),!j&&!R&&e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Pago:"}),e.jsx("span",{className:"meta-value",children:te})]})]})]}),e.jsxs("table",{className:"items",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{className:"col-qty",children:"Cant."}),e.jsx("th",{children:"Descripción"}),e.jsx("th",{className:"text-right col-unit",children:"P. Unit"}),e.jsx("th",{className:"text-right col-total",children:"Total"})]})}),e.jsx("tbody",{children:c.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:"4",style:{textAlign:"center"},children:"Sin ítems"})}):c.map(f=>e.jsxs("tr",{children:[e.jsx("td",{className:"col-qty",style:{fontWeight:800},children:f.quantity}),e.jsx("td",{style:{fontWeight:600},children:f.nombre}),e.jsxs("td",{className:"text-right col-unit",children:["C$",G(f.unit)]}),e.jsxs("td",{className:"text-right col-total",style:{fontWeight:700},children:["C$",G(f.total)]})]},f.id))})]}),e.jsx("div",{className:"totals",children:e.jsx("div",{className:"totals-box",children:S?e.jsxs(e.Fragment,{children:[e.jsxs(q,{style:{marginTop:5,fontSize:"0.95em"},children:[e.jsx("span",{style:{fontWeight:700},children:"Saldo Anterior:"}),e.jsxs("span",{style:{fontWeight:700},children:["C$",G(be)]})]}),e.jsxs(q,{className:"grand-total",$bold:!0,style:{fontSize:"1.3em",borderTop:"2px solid #000",marginTop:5,paddingTop:5,color:"#28a745"},children:[e.jsx("span",{style:{fontWeight:900},children:"ABONÓ:"}),e.jsxs("span",{style:{fontWeight:900},children:["C$",G(ie)]})]}),e.jsxs(q,{$bold:!0,style:{fontSize:"1.1em",borderTop:"2px dashed #000",marginTop:5,paddingTop:5,color:J>0?"#dc3545":"#28a745"},children:[e.jsx("span",{style:{fontWeight:900},children:"Saldo Pendiente:"}),e.jsxs("span",{style:{fontWeight:900},children:["C$",G(J)]})]})]}):e.jsxs(e.Fragment,{children:[e.jsxs(q,{children:[e.jsx("span",{style:{fontWeight:700},children:"Subtotal:"}),e.jsxs("span",{style:{fontWeight:700},children:["C$",G(_)]})]}),z>0&&e.jsxs(q,{style:{color:"#dc3545"},children:[e.jsx("span",{style:{fontWeight:700},children:"Descuento:"}),e.jsxs("span",{style:{fontWeight:700},children:["- C$",G(z)]})]}),e.jsxs(q,{className:"grand-total",$bold:!0,style:{fontSize:"1.3em",borderTop:"2px solid #000",marginTop:5,paddingTop:5},children:[e.jsx("span",{style:{fontWeight:900},children:"TOTAL:"}),e.jsxs("span",{style:{fontWeight:900},children:["C$",G(N)]})]}),!j&&e.jsxs(e.Fragment,{children:[e.jsxs(q,{style:{marginTop:10,fontSize:"0.9em"},children:[e.jsx("span",{style:{fontWeight:700},children:"Pagado:"}),e.jsxs("span",{style:{fontWeight:700},children:["C$",G(U)]})]}),P>0&&e.jsxs(q,{$bold:!0,style:{color:"#dc3545",fontWeight:900},children:[e.jsx("span",{children:"Cambio:"}),e.jsxs("span",{children:["C$",G(P)]})]})]})]})})}),e.jsxs("div",{className:"footer-sign no-show-80",children:[e.jsx("div",{className:"sign-box",children:"Entregado por"}),e.jsx("div",{className:"sign-box",children:"Recibido por"})]}),e.jsxs("div",{className:"thanks",children:[e.jsx("p",{children:e.jsxs("strong",{children:['"',O.slogan,'"']})}),e.jsx("p",{style:{whiteSpace:"pre-line",marginTop:"5px"},children:j?(s==null?void 0:s.ticket_proforma_footer)||"Cotización válida por 15 días.":R?(s==null?void 0:s.ticket_transfer_footer)||"Salida de Inventario.":(s==null?void 0:s.ticket_sales_footer)||"¡Gracias por su compra!"})]})]})})]})]})},Z=t=>Number(t||0).toFixed(2),sn=(t,o=0)=>(t==null?void 0:t.nombre)??(t==null?void 0:t.name)??(t==null?void 0:t.producto)??(t==null?void 0:t.descripcion)??`Item ${o+1}`,nt=p.div`
  border-left: 1px solid #e9ecef; padding-left: 1.5rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1.2rem;
`,Ne=p.div`
  background-color: #fff; border: 1px solid #e9ecef; border-radius: 8px; padding: 1.2rem;
  h4 { margin-top: 0; margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem; color: #495057; }
`,ln=p.table`
  width: 100%; border-collapse: collapse; font-size: 0.9rem;
  th, td { padding: 0.6rem; text-align: left; border-bottom: 1px solid #f1f1f1; }
  th { font-weight: 600; color: #6c757d; }
  td:nth-child(3), td:nth-child(4) { text-align: right; }
`,H=p.div`
  display: flex; justify-content: space-between; padding: 0.4rem 0; font-size: 0.95rem; font-weight: ${t=>t.$bold?"600":"normal"};
  border-top: ${t=>t.$bordered?"1px dashed #ccc":"none"}; color: ${t=>t.color||"inherit"};
  span:first-child { color: #6c757d; }
`,dn=p.div`
  display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1rem;
`,ot=p.span`
  font-weight: bold; padding: 0.25rem 0.5rem; border-radius: 4px; color: white; background-color: ${t=>t.color};
`,cn=({sale:t,client:o,creditStatus:x,dailySales:h,isAdmin:w,onOpenAbonoModal:u,onCancelSale:d,onReturnItem:k,onReprintTicket:C,showConfirmation:L,showPrompt:b,showAlert:s})=>{var R;const T=i.useMemo(()=>!(!t||t.estado!=="COMPLETADA"),[t]);if(!t)return e.jsx(nt,{style:{justifyContent:"center",alignItems:"center"},children:e.jsxs(Ae,{children:[e.jsx(Ct,{})," Seleccione una transacción de la lista para ver sus detalles."]})});const I={COMPLETADA:{text:"COMPLETADA",color:"#28a745"},CANCELADA:{text:"CANCELADA",color:"#dc3545"},DEVOLUCION:{text:"DEVOLUCIÓN",color:"#ffc107"},ABONO_CREDITO:{text:"ABONO A CRÉDITO",color:"#17a2b8"}}[t.estado]||{text:t.estado,color:"#6c757d"},a=t.estado==="COMPLETADA",S=(m,g)=>{if(T){if(!k){s==null||s({title:"Config",message:"Falta onReturnItem en props.",type:"error"});return}k(m,g)}},j=()=>{if(T){if(!d){s==null||s({title:"Config",message:"Falta onCancelSale en props.",type:"error"});return}d(t)}};return e.jsxs(nt,{children:[e.jsxs("h3",{children:["Detalle de Transacción #",t.id]}),o&&x&&e.jsxs(Ae,{$type:"info",style:{flexDirection:"column",alignItems:"stretch",gap:"1rem"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("span",{style:{fontWeight:"bold"},children:["Estado de Cuenta: ",o.nombre]}),e.jsxs(A,{$primary:!0,onClick:u,disabled:x.currentBalance<=0,children:[e.jsx(Ue,{})," Registrar Abono"]})]}),e.jsxs(H,{$bold:!0,color:x.currentBalance>0?"#dc3545":"#28a745",children:[e.jsx("span",{children:"SALDO PENDIENTE TOTAL:"}),e.jsxs("span",{children:["C$",x.currentBalance.toFixed(2)]})]})]}),e.jsxs(Ne,{children:[e.jsxs("p",{children:[e.jsxs("strong",{children:[e.jsx(Ge,{})," Cliente:"]})," ",(o==null?void 0:o.nombre)||"Cliente Genérico"]}),e.jsxs("p",{children:[e.jsxs("strong",{children:[e.jsx(rt,{})," Fecha:"]})," ",new Date(t.fecha).toLocaleString("es-NI")]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("p",{style:{margin:0},children:[e.jsx("strong",{children:"Estado:"})," ",e.jsx(ot,{color:I.color,children:I.text})]}),(((R=t.pagoDetalles)==null?void 0:R.isWholesale)||t.isWholesale)&&e.jsx(ot,{color:"#8b5cf6",children:"VENTA MAYORISTA"})]})]}),a&&e.jsxs(e.Fragment,{children:[Array.isArray(t.items)&&t.items.length>0&&e.jsxs(Ne,{children:[e.jsx("h4",{children:"Productos"}),e.jsxs(ln,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Producto"}),e.jsx("th",{children:"Cant."}),e.jsx("th",{children:"P. Unit."}),e.jsx("th",{children:"Subtotal"}),e.jsx("th",{})]})}),e.jsx("tbody",{children:t.items.map((m,g)=>e.jsxs("tr",{children:[e.jsx("td",{children:sn(m,g)}),e.jsx("td",{children:(m==null?void 0:m.quantity)??(m==null?void 0:m.cantidad)??0}),e.jsxs("td",{children:["C$",Z(m==null?void 0:m.precio)]}),e.jsxs("td",{children:["C$",Z(((m==null?void 0:m.quantity)??(m==null?void 0:m.cantidad)??0)*((m==null?void 0:m.precio)??0))]}),e.jsx("td",{children:T&&e.jsx(A,{$warning:!0,$small:!0,onClick:()=>S(m,g),title:"Devolver",children:e.jsx(wt,{})})})]},(m&&(m.id_producto||m.id))??g))})]})]}),e.jsxs(Ne,{children:[e.jsx("h4",{children:"Resumen Financiero de esta Venta"}),t.subtotal!==void 0&&e.jsxs(H,{children:[e.jsx("span",{children:"Subtotal:"}),e.jsxs("span",{children:["C$",Z(t.subtotal)]})]}),t.descuento>0&&e.jsxs(H,{children:[e.jsx("span",{children:"Descuento:"}),e.jsxs("span",{style:{color:"#dc3545"},children:["- C$",Z(t.descuento)]})]}),e.jsxs(H,{$bold:!0,$bordered:!0,children:[e.jsx("span",{children:"Total Transacción:"}),e.jsxs("span",{children:["C$",Z(Math.abs(t.totalVenta))]})]}),t.pagoDetalles&&e.jsxs("div",{style:{marginTop:"1rem"},children:[e.jsx("h5",{style:{marginBottom:"0.5rem",fontSize:"1rem"},children:"Detalle del Pago:"}),t.pagoDetalles.efectivo>0&&e.jsxs(H,{children:[e.jsxs("span",{children:[e.jsx(Ue,{})," Efectivo Recibido:"]}),e.jsxs("span",{children:["C$",Z(t.pagoDetalles.efectivo)]})]}),t.pagoDetalles.tarjeta>0&&e.jsxs(e.Fragment,{children:[e.jsxs(H,{children:[e.jsxs("span",{children:[e.jsx(vt,{})," Tarjeta:"]}),e.jsxs("span",{children:["C$",Z(t.pagoDetalles.tarjeta)]})]}),t.pagoDetalles.referenciaTarjeta&&e.jsxs(H,{style:{fontSize:"0.85rem",color:"#666",paddingLeft:"1.5rem"},children:[e.jsx("span",{children:"↳ Ref:"}),e.jsx("span",{children:t.pagoDetalles.referenciaTarjeta})]})]}),t.pagoDetalles.transferencia>0&&e.jsxs(e.Fragment,{children:[e.jsxs(H,{children:[e.jsxs("span",{children:[e.jsx(at,{})," Transferencia:"]}),e.jsxs("span",{children:["C$",Z(t.pagoDetalles.transferencia)]})]}),t.pagoDetalles.referenciaTransferencia&&e.jsxs(H,{style:{fontSize:"0.85rem",color:"#666",paddingLeft:"1.5rem"},children:[e.jsx("span",{children:"↳ Ref:"}),e.jsx("span",{children:t.pagoDetalles.referenciaTransferencia})]})]}),t.pagoDetalles.credito>0&&e.jsxs(H,{children:[e.jsxs("span",{children:[e.jsx(Ge,{})," Crédito Otorgado:"]}),e.jsxs("span",{style:{color:"#dc3545"},children:["C$",Z(t.pagoDetalles.credito)]})]}),t.pagoDetalles.vuelto>0&&e.jsxs(H,{children:[e.jsx("span",{children:"Vuelto Entregado:"}),e.jsxs("span",{children:["- C$",Z(t.pagoDetalles.vuelto)]})]})]})]})]}),t.estado!=="CANCELADA"&&e.jsxs(Ne,{children:[e.jsx("h4",{children:"Acciones"}),e.jsxs(dn,{children:[e.jsxs(A,{onClick:C,children:[e.jsx(Pe,{})," Reimprimir Ticket"]}),T&&e.jsxs(A,{$cancel:!0,onClick:j,children:[e.jsx(Nt,{})," Cancelar Venta"]})]})]})]})},pn=X.memo(cn),Fe=()=>{const t=new Date,o=t.toLocaleString("en-US",{year:"numeric",timeZone:"America/Managua"}),x=t.toLocaleString("en-US",{month:"2-digit",timeZone:"America/Managua"}),h=t.toLocaleString("en-US",{day:"2-digit",timeZone:"America/Managua"});return`${o}-${x}-${h}`},_e=t=>new Intl.NumberFormat("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(t||0)),mn=t=>{if(!t)return{label:"N/A",icon:null};const{efectivo:o,tarjeta:x,transferencia:h,credito:w}=t;if(Number(w)>0)return{label:"Crédito",icon:e.jsx(Ye,{style:{color:"#dc3545"}})};const u=[];if(Number(o)>0&&u.push("Efectivo"),Number(x)>0&&u.push("Tarjeta"),Number(h)>0&&u.push("Transferencia"),u.length===1){const d=u[0];return d==="Efectivo"?{label:"Efectivo",icon:e.jsx(De,{style:{color:"#28a745"}})}:d==="Tarjeta"?{label:"Tarjeta",icon:e.jsx(Ye,{style:{color:"#007bff"}})}:{label:"Transferencia",icon:e.jsx(at,{style:{color:"#007bff"}})}}return u.length>1?{label:"Mixto",icon:e.jsx(De,{style:{color:"#ffc107"}})}:{label:"Contado",icon:e.jsx(De,{style:{color:"#28a745"}})}},ke=(t,o=0)=>(t==null?void 0:t.nombre)??(t==null?void 0:t.name)??(t==null?void 0:t.producto)??(t==null?void 0:t.descripcion)??`Item ${o+1}`,xn=p(Oe)`
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
`,hn=p.div`
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid #dee2e6;
  h2 { display: flex; align-items: center; gap: .5rem; margin: 0; }
`,fn=p.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(180px, 1fr));
  gap: .75rem 1rem; margin-bottom: 1rem;

  @media (max-width: 1100px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 520px) { grid-template-columns: 1fr; }

  label { display: block; font-size: .9rem; color: #6c757d; margin-bottom: .25rem; }
`,gn=p.div`
  display: grid; grid-template-columns: 380px 1fr; gap: 1rem; flex: 1; min-height: 0;
  @media (max-width: 1024px) { grid-template-columns: 1fr; }
`,un=p.div`
  background: #f8f9fa; border-radius: 12px; padding: .75rem; display: flex;
  flex-direction: column; min-height: 0;
`,$e=p.div`
  background: #fff; border-radius: 12px; padding: 1rem; min-height: 0;
  box-shadow: 0 2px 10px rgba(0,0,0,.06);
`,bn=p.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: .5rem;
  small { color: #6c757d; }
`,jn=p.div`
  flex: 1; overflow: auto; padding-right: 4px; min-height: 200px;
`,yn=p.div`
  display: flex; justify-content: center; align-items: center; gap: .75rem;
  padding-top: .5rem; border-top: 1px solid #e9ecef;
`,Cn=p.div`
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
  ${t=>t.$green&&de`background:#e8f7ee; color:#198754;`}
  ${t=>t.$red&&de`background:#fdecec; color:#dc3545;`}
`,wn=X.memo(function({sale:o,isSelected:x,onSelect:h,safeUsers:w,safeClients:u}){var E;const d={COMPLETADA:"#28a745",CANCELADA:"#dc3545",DEVOLUCION:"#ffc107",ABONO_CREDITO:"#17a2b8"},k=i.useMemo(()=>{var a,S;return((a=(w||[]).find(j=>((j==null?void 0:j.id_usuario)??(j==null?void 0:j.id))==(o==null?void 0:o.userId)))==null?void 0:a.nombre_usuario)||((S=o==null?void 0:o.usuario)==null?void 0:S.nombre_usuario)||(o==null?void 0:o.userName)||(o==null?void 0:o.vendedor)||"N/A"},[w,o]),C=i.useMemo(()=>{var a,S;return((a=(u||[]).find(j=>(j==null?void 0:j.id_cliente)===((o==null?void 0:o.clientId)||(o==null?void 0:o.idCliente))))==null?void 0:a.nombre)||((S=o==null?void 0:o.cliente)==null?void 0:S.nombre)||(o==null?void 0:o.clientName)||"Consumidor Final"},[u,o]),L=Number(o.totalVenta??o.total_venta??o.total??0),b=mn(o.pagoDetalles),s=o.estado==="ABONO_CREDITO"?e.jsxs(e.Fragment,{children:[e.jsx(it,{style:{marginRight:6}})," ABONO"]}):e.jsxs(e.Fragment,{children:["#",o.id," - ",o.estado.replace("_"," ")]}),T=((E=o.pagoDetalles)==null?void 0:E.isWholesale)||o.isWholesale;return e.jsxs(Cn,{onClick:()=>h(o),selected:x,$borderColor:d[o.estado]||"#6c757d",title:`Venta #${o.id}`,children:[e.jsxs("div",{className:"top",children:[e.jsx("span",{children:s}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[T&&e.jsx(st,{style:{background:"#8b5cf6",color:"white",fontSize:"0.7rem"},children:"MAYORISTA"}),e.jsxs("span",{children:[b.icon," C$",_e(Math.abs(L))]})]})]}),e.jsxs("div",{className:"sub",children:[new Date(o.fecha).toLocaleString("es-NI")," · Cliente: ",e.jsx("strong",{children:C})," · Vendedor: ",k]})]})}),ze=10;function vn({dailySales:t=[],loadSales:o,onClose:x,isAdmin:h,users:w=[],clients:u=[],onReprintTicket:d,onCancelSale:k,onReturnItem:C,onAbonoSuccess:L,initialClientId:b=null}){var Ve,Be,We,qe;const[s,T]=i.useState(Fe()),[E,I]=i.useState(Fe()),[a,S]=i.useState(Array.isArray(t)?t:[]),[j,R]=i.useState(!1),[m,g]=i.useState(""),[K,V]=i.useState(""),[D,re]=i.useState(""),[M,ae]=i.useState(1),ee=i.useMemo(()=>Array.isArray(w)?w:[],[w]),F=i.useMemo(()=>Array.isArray(u)?u:[],[u]);i.useEffect(()=>{if(b){const n=F.find(l=>l.id_cliente===b);n?(g(n.nombre),I("")):g(String(b))}},[b,F]);const[r,Y]=i.useState(null),[c,v]=i.useState(!1),[_,z]=i.useState({open:!1,title:"",message:""}),N=(n,l)=>z({open:!0,title:n,message:l}),ce=()=>z({open:!1,title:"",message:""}),[te,U]=i.useState({open:!1,title:"",message:"",onConfirm:null}),P=(n,l,y)=>U({open:!0,title:n,message:l,onConfirm:y}),ie=()=>U({open:!1,title:"",message:"",onConfirm:null}),[J,be]=i.useState({open:!1,title:"",message:"",initialValue:"1",onConfirm:null}),je=(n,l,y,B)=>be({open:!0,title:n,message:l,initialValue:String(y??"1"),onConfirm:B}),me=()=>be({open:!1,title:"",message:"",initialValue:"1",onConfirm:null}),O=i.useCallback(async(n=null)=>{if(!o)return[];R(!0),T(n);try{const l=await o(n),y=Array.isArray(l)?l:[];return S(y),y}catch(l){return S([]),N("Error","No se pudieron cargar las transacciones: "+(l.message||"Error de conexión.")),[]}finally{R(!1)}},[o]);i.useEffect(()=>{const l=m&&m.length>=2||b&&!E?null:E;O(l),ae(1),Y(null)},[E,O,m,b]),i.useEffect(()=>{E===Fe()&&Array.isArray(t)&&!m&&S(t)},[t,E,m]);const ne=i.useMemo(()=>{const n=(m||"").toLowerCase();return(a||[]).filter(y=>{var ye;const B=y.clientId||y.idCliente,oe=((ye=F.find(Ce=>Ce.id_cliente===B))==null?void 0:ye.nombre)||"";return(!K||String(y.userId)===String(K))&&(!D||y.estado===D)&&(!n||String(y.id).includes(n)||oe.toLowerCase().includes(n))}).sort((y,B)=>new Date(B.fecha)-new Date(y.fecha))},[a,K,D,m,F]),se=Math.max(1,Math.ceil(ne.length/ze)),xe=(M-1)*ze,f=ne.slice(xe,xe+ze);i.useEffect(()=>{(!r||!f.some(n=>n.id===r.id))&&Y(f[0]||null)},[f,r]);const W=i.useCallback(async(n=null)=>{const l=await O(s);if(n){const y=(l||[]).find(B=>String(B.id)===String(n));Y(y||null)}else Y(null)},[O,s]),he=i.useCallback(n=>{const l=typeof n=="object"&&(n!=null&&n.id)?n.id:n||(r==null?void 0:r.id),y=typeof n=="object"&&n?n:r;if(!(!l||!y)){if(y.estado==="CANCELADA"){N("Venta ya cancelada",`La venta #${l} ya fue cancelada.`);return}if(!k){N("Error de Configuración","onCancelSale no fue proporcionada.");return}P("Cancelar Venta",`¿Seguro que deseas cancelar la venta #${l}? Esta acción revierte inventario y no se puede deshacer.`,async()=>{ie();try{await k(y),N("Éxito",`Venta #${l} cancelada.`),await W(null)}catch(B){N("Error al Cancelar",B.message||"No se pudo cancelar la venta.")}})}},[r,k,W]),Te=i.useCallback((n,l=0)=>{if(!r)return;if(!C){N("Error de Configuración","onReturnItem no fue proporcionada.");return}const y=Number((n==null?void 0:n.quantity)||(n==null?void 0:n.cantidad)||0);if(!Number.isFinite(y)||y<=0){N("No se puede devolver","Este artículo no tiene cantidad disponible para devolver.");return}je("Devolver producto",`Cantidad a devolver para "${ke(n,l)}" (máx. ${y})`,"1",async B=>{const oe=Number(B);if(!Number.isFinite(oe)||oe<=0||oe>y){N("Cantidad inválida",`Ingresa un número entre 1 y ${y}.`);return}const ye=r.items.length===1&&oe===y,Ce=async()=>{try{await C(r,n,oe),N("Éxito",`Se devolvieron ${oe} unidad(es) de ${ke(n,l)}.`),await W(null)}catch(we){const He=((we==null?void 0:we.message)||"").toLowerCase(),mt=He.includes("not found")||He.includes("404")?"Ruta de API no encontrada.":we.message||"No se pudo devolver el producto.";N("Error al Devolver",mt)}};if(ye){me(),setTimeout(()=>{U({open:!0,title:"¿Cancelar Venta Completa?",message:`Este es el ÚLTIMO artículo de la venta. 

¿Prefieres CANCELAR toda la venta en lugar de hacer una devolución individual?
(Esto revertirá todo el ticket).`,onConfirm:async()=>{U({open:!1,title:"",message:"",onConfirm:null}),k&&he(r.id)},onClose:()=>{U({open:!1,title:"",message:"",onConfirm:null}),Ce()}})},100);return}await Ce()})},[r,C,W]),pe=i.useCallback(()=>{r&&(d==null||d(r))},[r,d]),[Q,fe]=i.useState(!1),dt=i.useCallback(async()=>{if(!r||r.estado!=="ABONO_CREDITO")return;const n=r.clientId||r.idCliente;if(!n){N("Error","No se pudo identificar el cliente.");return}P("Cancelar Abono",`¿Estás seguro de cancelar este abono #${r.id}? Se restaurará el saldo del cliente.`,async()=>{ie(),fe(!0);try{const l=localStorage.getItem("token");await Lt(n,r.id,l),It.success("Abono cancelado exitosamente."),await W(null)}catch(l){N("Error",l.message||"No se pudo cancelar el abono.")}finally{fe(!1)}})},[r,W]),ct=ne.length,pt=f.length;return e.jsxs(Se,{"data-history-modal":!0,children:[e.jsxs(xn,{children:[e.jsxs(hn,{children:[e.jsxs("h2",{children:[e.jsx(Ze,{})," Historial de Transacciones"]}),e.jsx(A,{$cancel:!0,onClick:x,children:e.jsx(Le,{})})]}),e.jsxs(fn,{children:[e.jsxs("div",{children:[e.jsxs("label",{children:[e.jsx(kt,{})," Buscar ID/Cliente:"]}),e.jsx(ve,{type:"text",placeholder:"ID o nombre",value:m,onChange:n=>g(n.target.value)})]}),e.jsxs("div",{children:[e.jsxs("label",{children:[e.jsx(rt,{})," Fecha:"]}),e.jsx(ve,{type:"date",value:E,onChange:n=>I(n.target.value)})]}),h&&e.jsxs("div",{children:[e.jsxs("label",{children:[e.jsx($t,{})," Usuario:"]}),e.jsxs(ve,{as:"select",value:K,onChange:n=>V(n.target.value),children:[e.jsx("option",{value:"",children:"Todos"}),ee.map(n=>e.jsx("option",{value:n.id_usuario??n.id,children:n.nombre_usuario??n.nombre},n.id_usuario??n.id))]})]}),e.jsxs("div",{children:[e.jsxs("label",{children:[e.jsx(St,{})," Estado:"]}),e.jsxs(ve,{as:"select",value:D,onChange:n=>re(n.target.value),children:[e.jsx("option",{value:"",children:"Todos"}),e.jsx("option",{value:"COMPLETADA",children:"Completadas"}),e.jsx("option",{value:"CANCELADA",children:"Canceladas"}),e.jsx("option",{value:"DEVOLUCION",children:"Devoluciones"}),e.jsx("option",{value:"ABONO_CREDITO",children:"Abonos"})]})]})]}),e.jsxs(gn,{children:[e.jsxs(un,{children:[e.jsxs(bn,{children:[e.jsx("small",{children:m?e.jsx("strong",{children:"Mostrando historial de búsqueda"}):`Resultados: ${ct}`}),e.jsxs(st,{$green:!0,children:["Mostrando ",pt]})]}),j&&e.jsx(Ae,{style:{textAlign:"center",margin:".5rem 0"},children:"Cargando transacciones…"}),!j&&e.jsx(jn,{children:f.length?f.map(n=>e.jsx(wn,{sale:n,isSelected:(r==null?void 0:r.id)===n.id,onSelect:Y,safeUsers:ee,safeClients:F},n.id)):e.jsx("p",{style:{textAlign:"center",color:"#6c757d",marginTop:"1rem"},children:"No se encontraron transacciones para la fecha y filtros seleccionados."})}),se>1&&e.jsxs(yn,{children:[e.jsx(A,{onClick:()=>ae(n=>Math.max(1,n-1)),disabled:M===1,title:"Anterior",children:e.jsx(At,{})}),e.jsxs("span",{children:["Página ",M," de ",se]}),e.jsx(A,{onClick:()=>ae(n=>Math.min(se,n+1)),disabled:M===se,title:"Siguiente",children:e.jsx(Tt,{})})]})]}),r?r.estado==="ABONO_CREDITO"?e.jsxs($e,{children:[e.jsxs("div",{style:{borderBottom:"2px dashed #ccc",paddingBottom:15,marginBottom:15},children:[e.jsxs("h3",{style:{margin:0,fontSize:"1.4rem",color:"#17a2b8",textAlign:"center"},children:[e.jsx(it,{})," Recibo de Abono"]}),e.jsxs("p",{style:{textAlign:"center",color:"#555",margin:"5px 0"},children:["#",r.id]})]}),e.jsx(Ae,{children:e.jsxs("div",{style:{display:"grid",gap:10},children:[e.jsxs(q,{children:[e.jsx("span",{children:"Fecha:"}),e.jsx("strong",{children:new Date(r.fecha).toLocaleString("es-NI")})]}),e.jsxs(q,{children:[e.jsx("span",{children:"Cliente:"}),e.jsx("strong",{style:{fontSize:"1.1rem"},children:((Ve=F.find(n=>n.id_cliente===(r.clientId||r.idCliente)))==null?void 0:Ve.nombre)||"Desconocido"})]}),e.jsxs(q,{children:[e.jsx("span",{children:"Cajero:"}),e.jsx("strong",{children:((Be=ee.find(n=>(n.id_usuario??n.id)==r.userId))==null?void 0:Be.nombre_usuario)||r.usuarioNombre||"Sistema"})]})]})}),e.jsx("div",{style:{margin:"20px 0",border:"1px solid #ddd",padding:15,borderRadius:8,background:"#f8f9fa"},children:e.jsxs(q,{style:{fontSize:"1.2rem",color:"#28a745"},children:[e.jsx("span",{children:"Monto Abonado:"}),e.jsxs("strong",{children:["C$ ",_e(r.totalVenta)]})]})}),e.jsxs("div",{style:{display:"flex",justifyContent:"center",gap:"12px",marginTop:20},children:[e.jsxs(A,{onClick:pe,style:{fontSize:"1.1rem",padding:"10px 20px"},children:[e.jsx(Pe,{})," Imprimir Comprobante"]}),e.jsxs(A,{onClick:dt,disabled:Q,style:{fontSize:"1rem",padding:"10px 20px",background:"#dc3545",color:"white",border:"none",fontWeight:700},children:[e.jsx(Dt,{})," ",Q?"Cancelando...":"Cancelar Abono"]})]})]}):r.estado==="DEVOLUCION"?e.jsxs($e,{children:[e.jsxs("h3",{style:{marginTop:0},children:["Detalle de Transacción #",r.id]}),e.jsxs("div",{className:"box",style:{marginTop:10},children:[e.jsxs("p",{children:[e.jsx("strong",{children:"Cliente:"})," ",((We=F.find(n=>n.id_cliente===(r.clientId||r.idCliente)))==null?void 0:We.nombre)||"Consumidor Final"]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Fecha:"})," ",new Date(r.fecha).toLocaleString("es-NI")]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Estado:"})," ",e.jsx("span",{style:{background:"#fff3cd",color:"#856404",padding:"2px 8px",borderRadius:8,fontWeight:700},children:"DEVOLUCIÓN"})]})]}),e.jsxs("div",{className:"box",style:{marginTop:10},children:[e.jsx("h4",{style:{marginTop:0},children:"Detalle de Devolución"}),e.jsx("ul",{style:{margin:0,paddingLeft:18},children:(r.items||[]).map((n,l)=>e.jsxs("li",{children:[e.jsx("strong",{children:ke(n,l)})," ","— ",Number(n.quantity||n.cantidad||0)," u. @ C$",Number(n.precio||n.precio_unitario||0).toFixed(2)]},`${n.id||n.id_producto}-${l}`))}),e.jsxs("p",{style:{marginTop:8},children:["Importe devuelto:"," ",e.jsxs("strong",{children:["C$",(()=>{const n=Number(r.totalVenta??r.total_venta??r.total??0);return Math.abs(n).toFixed(2)})()]})]})]}),e.jsx("div",{style:{display:"flex",justifyContent:"flex-start",gap:10,marginTop:12},children:e.jsx(A,{onClick:pe,children:"Reimprimir Ticket"})})]}):r.estado==="CANCELADA"?e.jsxs($e,{children:[e.jsxs("h3",{style:{marginTop:0,color:"#dc3545"},children:["Detalle de Venta Cancelada #",r.id]}),e.jsxs("div",{className:"box",style:{marginTop:10},children:[e.jsxs("p",{children:[e.jsx("strong",{children:"Cliente:"})," ",((qe=F.find(n=>n.id_cliente===(r.clientId||r.idCliente)))==null?void 0:qe.nombre)||"Consumidor Final"]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Fecha:"})," ",new Date(r.fecha).toLocaleString("es-NI")]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Estado:"})," ",e.jsx("span",{style:{background:"#f8d7da",color:"#721c24",padding:"2px 8px",borderRadius:8,fontWeight:700},children:"CANCELADA"})]})]}),e.jsxs("div",{className:"box",style:{marginTop:10},children:[e.jsx("h4",{style:{marginTop:0},children:"Productos Cancelados"}),!r.items||r.items.length===0?e.jsx("p",{style:{color:"#6c757d",fontStyle:"italic"},children:"No hay detalles de productos disponibles."}):e.jsx("ul",{style:{margin:0,paddingLeft:18,color:"#6c757d"},children:r.items.map((n,l)=>e.jsxs("li",{children:[e.jsx("strong",{children:ke(n,l)})," ","— ",Number(n.quantity||n.cantidad||0)," u."]},`${n.id||n.id_producto}-${l}`))}),e.jsxs("p",{style:{marginTop:8,color:"#dc3545",textDecoration:"line-through"},children:["Total Anulado: ",e.jsxs("strong",{children:["C$ ",_e(r.totalVenta)]})]})]}),e.jsx("div",{style:{display:"flex",justifyContent:"flex-start",gap:10,marginTop:12},children:e.jsx(A,{onClick:pe,children:"Reimprimir Comprobante"})})]}):e.jsx(pn,{sale:r,client:F.find(n=>n.id_cliente===(r.clientId||r.idCliente)),creditStatus:null,dailySales:a,isAdmin:h,onOpenAbonoModal:()=>v(!0),onCancelSale:n=>he(n),onReturnItem:(n,l)=>Te(n,l),onReprintTicket:pe,showConfirmation:({onConfirm:n})=>P("Confirmación","¿Confirmar acción?",n),showPrompt:({title:n,message:l,defaultValue:y,onConfirm:B})=>je(n,l,y,B),showAlert:({title:n,message:l})=>N(n,l)}):e.jsx($e,{children:e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",color:"#aaa",fontStyle:"italic",flexDirection:"column"},children:[e.jsx(Ze,{size:40,style:{marginBottom:10,opacity:.5}}),e.jsx("p",{children:"Seleccione una transacción para ver detalles"})]})})]}),c&&r&&e.jsx(Zt,{client:F.find(n=>n.id_cliente===(r.clientId||r.idCliente)),onClose:()=>v(!1),onAbonoSuccess:async()=>{v(!1),await W(r.id),L==null||L()},showAlert:({title:n,message:l})=>N(n,l)})]}),e.jsx(Rt,{isOpen:_.open,onClose:ce,title:_.title,message:_.message}),e.jsx(Nn,{isOpen:!!te.open,title:te.title,message:te.message,onCancel:ie,onConfirm:te.onConfirm||ie}),e.jsx(kn,{isOpen:!!J.open,title:J.title,message:J.message,initialValue:J.initialValue,onCancel:me,onConfirm:n=>{const l=J.onConfirm;me(),l&&l(n)}})]})}const lt=({isOpen:t,children:o,maxWidth:x=450})=>t?e.jsx(Se,{style:{zIndex:99999,backgroundColor:"rgba(0,0,0,0.6)"},children:e.jsx(Oe,{style:{maxWidth:`${x}px`,textAlign:"center"},children:o})}):null,Nn=({isOpen:t,title:o,message:x,onCancel:h,onConfirm:w})=>e.jsxs(lt,{isOpen:t,children:[e.jsx("h2",{style:{marginTop:0},children:o}),e.jsx("p",{style:{color:"#6c757d",lineHeight:1.5},children:x}),e.jsxs("div",{style:{display:"flex",justifyContent:"center",gap:10,marginTop:10},children:[e.jsx(A,{onClick:h,$cancel:!0,children:"Cancelar"}),e.jsx(A,{onClick:w,primary:!0,children:"Aceptar"})]})]}),kn=({isOpen:t,title:o,message:x,initialValue:h="1",inputType:w="number",onCancel:u,onConfirm:d})=>{const[k,C]=i.useState(h);return i.useEffect(()=>{C(h)},[h,t]),e.jsxs(lt,{isOpen:t,children:[e.jsx("h2",{style:{marginTop:0},children:o}),x&&e.jsx("p",{style:{color:"#6c757d"},children:x}),e.jsx("input",{style:{width:"100%",padding:".6rem",borderRadius:8,border:"1px solid #dee2e6",margin:"8px 0 14px"},type:w,value:k,onChange:L=>C(L.target.value)}),e.jsxs("div",{style:{display:"flex",justifyContent:"center",gap:10},children:[e.jsx(A,{onClick:u,$cancel:!0,children:"Cancelar"}),e.jsx(A,{onClick:()=>d(k),primary:!0,children:"Aceptar"})]})]})},In=X.memo(vn);export{Zt as A,In as S,Dn as T};

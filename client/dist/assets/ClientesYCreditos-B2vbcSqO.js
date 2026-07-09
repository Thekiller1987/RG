import{r as i,j as e,k as se,D as ce,s as a,I as G,x as pe,R as me,af as ee,q as xe,n as E,J as K,ag as L,ah as he,aa as ge,ai as fe,v as ue,T as Y,Y as be,aj as je,X as ye,ak as we,al as Ce,$ as ve,a4 as te,Z as ne,am as ae,an as H,V as ke}from"./vendor-C4uQ3a2a.js";import{m as Se,n as $e,a as Ne,u as le,o as Ae,p as ze,q as De,r as Te,t as Ie,j as _e,v as Fe,w as Ee}from"./index-_bKFznHk.js";import{T as de,A as Le,S as Pe}from"./SalesHistoryModal-BvUgisAZ.js";import{M as Oe,a as Me,B as U}from"./POS.styles-yJMpH_iU.js";import{A as Be}from"./AlertModal-Chz8o6FH.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-BMvqz6Um.js";import"./searchEngine-BMYcElFi.js";const Re=a.div`
  position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;z-index:50;
`,He=a.div`
  background:white;padding:2rem;border-radius:8px;width:400px;max-width:90%;
`,Ue=a.div`display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;`,We=a.h2`margin:0;font-size:1.5rem;`,Ve=a.button`border:none;background:none;color:#dc3545;font-size:1.2rem;cursor:pointer;`,Ge=a.form`display:flex;flex-direction:column;gap:0.8rem;`,W=a.input`padding:0.6rem;border:1px solid #ccc;border-radius:6px;font-size:0.95rem;`,Ye=a.button`
  padding:0.6rem 1rem;background:#007bff;color:white;border:none;border-radius:6px;font-weight:bold;display:flex;align-items:center;gap:0.5rem;justify-content:center;
  &:hover{opacity:0.85;}
`;function qe({client:n,onClose:y,onSave:c}){const[s,p]=i.useState(""),[j,g]=i.useState(""),[w,S]=i.useState(""),[m,x]=i.useState(""),r=localStorage.getItem("token");i.useEffect(()=>{n?(p(n.nombre||""),g(n.cedula||""),S(n.telefono||""),x(n.limite_credito||"")):(p(""),g(""),S(""),x(""))},[n]);const C=async l=>{l.preventDefault();const f={nombre:s,cedula:j,telefono:w,limite_credito:m===""?null:Number(m)};try{n?await Se(n.id_cliente,f,r):await $e(f,r),c&&c(),y()}catch(N){console.error(N),alert(`Error al guardar cliente: ${N.message}`)}};return e.jsx(Re,{children:e.jsxs(He,{children:[e.jsxs(Ue,{children:[e.jsx(We,{children:n?"Editar Cliente":"Nuevo Cliente"}),e.jsx(Ve,{onClick:y,children:e.jsx(se,{})})]}),e.jsxs(Ge,{onSubmit:C,children:[e.jsx(W,{value:s,onChange:l=>p(l.target.value),placeholder:"Nombre",required:!0}),e.jsx(W,{value:j,onChange:l=>g(l.target.value),placeholder:"Cédula / RUC"}),e.jsx(W,{value:w,onChange:l=>S(l.target.value),placeholder:"Teléfono"}),e.jsx(W,{type:"number",step:"0.01",value:m,onChange:l=>x(l.target.value),placeholder:"Límite de crédito"}),e.jsxs(Ye,{type:"submit",children:[e.jsx(ce,{})," Guardar"]})]})]})})}const Je=xe`
  @media print {
    body { visibility: hidden; margin: 0; padding: 0; }
    .print-area, .print-area * { visibility: visible !important; }
    .print-area { position: absolute !important; left: 0 !important; top: 0 !important; z-index: 999999 !important; margin: 0 !important; padding: 0 !important; }
    .no-print { display: none !important; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-shadow: none !important; text-shadow: none !important; }
  }
`,Ze=a.div`
  font-family: 'League Spartan', 'Inter', system-ui, -apple-system, sans-serif;
  color: #000;
  background: #fff;
  width: 100%;
  margin: 0 auto;
  padding: 14px 12px;
  box-shadow: 0 0 10px rgba(0,0,0,.08);
  border: 1px solid #eee;
  border-radius: 8px;

  &.print-80 {
    width: 80mm !important;
    padding: 6px 4px !important;
    border: none !important;
    box-shadow: none !important;
    font-size: 8pt;
  }
  &.print-a4 {
    width: 190mm !important;
    font-size: 10pt !important;
    padding: 0 !important;
    border: none !important;
    box-shadow: none !important;
  }

  .brand { text-align: center; border-bottom: 2px solid #1a1a1a; padding-bottom: 12px; margin-bottom: 12px; }
  .brand-logo-container { display: flex; justify-content: center; margin-bottom: 8px; }
  .brand h1 { margin: 4px 0 3px; font-size: 1.3rem; font-weight: 800; color: #0b0b0b; line-height: 1.2; font-family: 'League Spartan', 'Inter', sans-serif; }
  .brand small { color: #444; display: block; margin: 2px 0; font-size: 0.78rem; border-bottom: none; }

  .meta { font-size: .88rem; margin-bottom: 12px; border-bottom: 1px dashed #aaa; padding-bottom: 8px; }
  .meta p { margin: 3px 0; display: flex; justify-content: space-between; gap: 4px 8px; font-weight: 400; }
  .meta-label { font-weight: 700; color: #111; }
  .meta-value { font-weight: 800; color: #333; }
  .meta-value.red { color: #d32f2f; }
  .meta-value.green { color: #388e3c; }

  table { width: 100%; border-collapse: collapse; font-size: .85rem; margin-bottom: 15px; }
  th, td { padding: 6px 4px; vertical-align: middle; border-bottom: 1px dashed #ccc; }
  th { border-bottom: 2px solid #222; font-weight: 800; text-align: left; }
  td.right, th.right { text-align: right; }
  td.center, th.center { text-align: center; }

  .summary { border-top: 2px solid #111; padding-top: 10px; margin-top: 10px; font-size: 1rem; }
  .summary p { display: flex; justify-content: space-between; margin: 4px 0; font-weight: 600; }
  .summary p.total { font-size: 1.2rem; font-weight: 800; color: #d32f2f; border-top: 1px dashed #111; padding-top: 6px; }

  .footer { text-align: center; margin-top: 20px; font-size: 0.8rem; font-style: italic; color: #555; border-top: 1px dashed #ccc; padding-top: 10px; }
`,Qe=a.img`
  width: 100px;
  height: 100px;
  object-fit: contain;
  display: block;
  border-radius: 6px;
  .print-a4 & { width: 130px; height: auto; }
`,Xe=({statementData:n,filterType:y="ALL",onClose:c})=>{const{settings:s}=Ne(),{cliente:p,historial:j}=n,g=r=>new Intl.NumberFormat("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(r||0)),w=j.filter(r=>y==="DEBT"?r.impacto>0:y==="PAID"?r.impacto<0:!0),S=y==="DEBT"?"HISTORIAL DE DEUDAS (CRÉDITOS)":y==="PAID"?"HISTORIAL DE PAGOS (ABONOS)":"ESTADO DE CUENTA COMPLETO",m={name:(s==null?void 0:s.empresa_nombre)||"Multirepuestos RG",ruc:(s==null?void 0:s.empresa_ruc)||"1211812770001E",phone:(s==null?void 0:s.empresa_telefono)||"84031936 / 84058142",address:(s==null?void 0:s.empresa_direccion)||"Del portón de la normal 75 varas al este. Juigalpa, Chontales.",slogan:(s==null?void 0:s.empresa_eslogan)||"Tu mejor opción en repuestos",logo:(s==null?void 0:s.empresa_logo_url)||new URL("/icons/logo.png",window.location.origin).toString()},x=i.useCallback((r="80")=>{const C=document.getElementById("print-wrapper-statement");if(!C)return;const l=C.outerHTML,N=`
      @charset "UTF-8";
      @import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;500;600;700;800;900&display=swap');
      @page { size: ${r==="A4"?"A4 portrait":"80mm auto"}; margin: ${r==="A4"?"12mm":"0"}; }
      html, body {
        background: #fff; margin: 0 !important; padding: 0 !important;
        -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;
        color: #000 !important; font-weight: 800 !important;
        font-family: 'League Spartan', 'Inter', system-ui, -apple-system, sans-serif;
      }
      #print-wrapper-statement {
        box-shadow: none !important; border: none !important; margin: 0 !important;
        font-family: 'League Spartan', 'Inter', system-ui, sans-serif !important;
        color: #000 !important; font-weight: 800 !important; font-size: 10pt !important;
        ${r==="A4"?"width: 100% !important; padding: 0 !important; font-size: 10pt !important;":"width: 80mm !important; padding: 6px 4px !important; font-size: 9pt !important;"}
      }
      #print-wrapper-statement * { color: #000 !important; font-weight: 800 !important; }
      .brand { text-align: center !important; border-bottom: 2px solid #000 !important; padding-bottom: 6px !important; margin-bottom: 6px !important; }
      .brand h1 { font-size: 18pt !important; letter-spacing: 0.5px !important; margin: 0 0 4px !important; }
      .brand-logo-container { display: flex !important; justify-content: center !important; margin-bottom: 4px !important; }
      .brand-logo-container img { width: ${r==="A4"?"130px":"80px"} !important; height: ${r==="A4"?"auto":"80px"} !important; object-fit: contain !important; }
      .meta p { display: flex !important; justify-content: space-between !important; margin: 2px 0 !important; }
      table { width: 100% !important; border-collapse: collapse !important; margin-bottom: 10px !important; }
      th { border-bottom: 2px solid #000 !important; font-size: 9pt !important; text-align: left !important; }
      td { border-bottom: 1px dashed #000 !important; font-size: 9pt !important; }
      .right { text-align: right !important; }
      .summary .total { font-size: 14pt !important; border-top: 2px solid #000 !important; margin-top: 6px !important; padding-top: 4px !important; }
      .footer { text-align: center !important; margin-top: 15px !important; font-size: 8pt !important; border-top: 1px dashed #000 !important; padding-top: 8px !important; }
      
      ${r==="A4"?`
        .brand { display: flex !important; justify-content: space-between !important; align-items: flex-start !important; text-align: left !important; border-bottom: 3px solid #1e3a8a !important; margin-bottom: 25px !important; padding-bottom: 15px !important; }
        .brand-logo-container { width: 140px !important; justify-content: flex-start !important; order: 1 !important; }
        .brand-info { flex: 1 !important; text-align: right !important; order: 2 !important; }
        .brand h1 { font-size: 22pt !important; color: #1e3a8a !important; margin: 0 0 5px 0 !important; }
        .brand small { display: block !important; font-size: 9pt !important; margin: 2px 0 !important; color: #000 !important; }
        .meta { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 30px !important; border: 1px solid #000 !important; padding: 15px !important; margin-bottom: 20px !important; border-radius: 8px !important; }
        table { border: 1px solid #000 !important; }
        th, td { padding: 8px !important; }
      `:""}
    `,u=window.open("","_blank","width=900,height=700");u&&(u.document.write(`<!DOCTYPE html><html><head><title>${S} - ${m.name}</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"><style>${N}</style></head><body>${l}</body></html>`),u.document.close(),u.focus(),u.onload=function(){setTimeout(()=>{u.print(),setTimeout(()=>{u.close()},500)},400)})},[m]);return e.jsxs(Oe,{onClick:c,children:[e.jsx(Je,{}),e.jsxs(Me,{onClick:r=>r.stopPropagation(),style:{maxWidth:"650px",width:"100%",padding:"0",overflow:"hidden"},children:[e.jsxs("div",{style:{padding:"20px 24px",background:"#1e3a8a",color:"white",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("h2",{style:{margin:0,fontSize:"1.4rem",display:"flex",alignItems:"center",gap:10},children:[e.jsx(G,{})," ",S]}),e.jsx(U,{$cancel:!0,onClick:c,style:{padding:"6px 12px",minWidth:"auto"},children:e.jsx(pe,{size:18})})]}),e.jsx("div",{style:{padding:"24px",maxHeight:"70vh",overflowY:"auto",background:"#f8fafc"},children:e.jsx("div",{style:{display:"flex",justifyContent:"center"},children:e.jsxs(Ze,{id:"print-wrapper-statement",children:[e.jsxs("div",{className:"brand",children:[e.jsx("div",{className:"brand-logo-container",children:e.jsx(Qe,{src:m.logo,alt:"Logo",style:{filter:"grayscale(100%) contrast(150%)"}})}),e.jsxs("div",{className:"brand-info",children:[e.jsx("h1",{children:m.name}),e.jsxs("small",{children:["RUC: ",m.ruc]}),e.jsxs("small",{children:["Tel: ",m.phone]}),e.jsx("small",{children:m.address}),e.jsx("small",{style:{fontWeight:"bold",marginTop:"6px",fontSize:"1rem",textTransform:"uppercase"},children:S})]})]}),e.jsxs("div",{className:"meta",children:[e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Cliente:"})," ",e.jsx("span",{className:"meta-value",children:p.nombre})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"ID:"})," ",e.jsx("span",{className:"meta-value",children:p.id})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Teléfono:"})," ",e.jsx("span",{className:"meta-value",children:p.telefono||"N/A"})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Fecha Emisión:"})," ",e.jsx("span",{className:"meta-value",children:new Date().toLocaleString("es-NI")})]})]}),e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Fecha"}),e.jsx("th",{children:"Ref / Descripción"}),e.jsx("th",{className:"right",children:"Crédito"}),e.jsx("th",{className:"right",children:"Abono"}),e.jsx("th",{className:"right",children:"Saldo"})]})}),e.jsxs("tbody",{children:[w.map((r,C)=>e.jsxs(me.Fragment,{children:[e.jsxs("tr",{children:[e.jsx("td",{children:new Date(r.fecha).toLocaleDateString("es-NI")}),e.jsx("td",{style:{fontSize:"0.8rem"},children:r.descripcion}),e.jsx("td",{className:"right",style:{color:"#d32f2f"},children:r.impacto>0?g(r.monto):""}),e.jsx("td",{className:"right",style:{color:"#388e3c"},children:r.impacto<0?g(r.monto):""}),e.jsx("td",{className:"right",style:{fontWeight:"bold"},children:g(r.saldo)})]}),r.productos&&r.productos.length>0&&r.productos.map((l,f)=>e.jsxs("tr",{style:{background:"#f8f9fa",fontSize:"0.75rem"},children:[e.jsx("td",{}),e.jsxs("td",{colSpan:"2",style:{paddingLeft:"1.5rem",color:"#495057"},children:["↳ ",l.nombre," ",l.codigo?`(${l.codigo})`:""," × ",l.cantidad]}),e.jsxs("td",{className:"right",style:{color:"#495057",fontSize:"0.75rem"},children:["@ C$",g(l.precioUnitario)]}),e.jsxs("td",{className:"right",style:{color:"#495057",fontWeight:"600",fontSize:"0.75rem"},children:["C$",g(l.subtotal)]})]},`${C}-p-${f}`))]},C)),w.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:"5",className:"center",style:{padding:"15px"},children:"Sin movimientos registrados en esta categoría"})})]})]}),e.jsxs("div",{className:"summary",children:[e.jsxs("p",{children:[e.jsx("span",{children:"Límite de Crédito:"})," ",e.jsx("span",{children:p.limite_credito===null?"Ilimitado":"C$"+g(p.limite_credito)})]}),e.jsxs("p",{className:"total",children:[e.jsx("span",{children:"SALDO PENDIENTE:"})," ",e.jsxs("span",{children:["C$ ",g(p.saldo_calculado)]})]})]}),e.jsxs("div",{className:"footer",children:["Documento no válido como factura. ",e.jsx("br",{}),"Gracias por preferir a ",m.name]})]})})}),e.jsxs("div",{style:{padding:"16px 24px",background:"#fff",borderTop:"1px solid #e2e8f0",display:"flex",justifyContent:"flex-end",gap:12},children:[e.jsx(U,{$cancel:!0,onClick:c,children:"Cerrar"}),e.jsxs(U,{style:{background:"#212529",color:"white"},onClick:()=>x("80"),children:[e.jsx(ee,{})," Imprimir Ticket (80mm)"]}),e.jsxs(U,{primary:!0,onClick:()=>x("A4"),children:[e.jsx(ee,{})," Imprimir Carta (A4)"]})]})]})]})},Ke=a.div`position: fixed; inset: 0; background-color: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 1000; padding: 1rem;`,et=a.div`background: #f4f7f6; color: #333; border-radius: 10px; width: 900px; max-width: 100%; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 10px 25px rgba(0,0,0,0.1);`,tt=a.div`padding: 1rem 1.5rem; border-bottom: 1px solid #dee2e6; display: flex; justify-content: space-between; align-items: center;`,nt=a.h2`margin: 0; font-size: 1.5rem;`,at=a.div`display: flex; gap: 0.5rem; flex-wrap: wrap;`,q=a.button`
  display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; 
  font-size: 0.85rem; font-weight: 600; border: none; border-radius: 6px; cursor: pointer; color: white;
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`,rt=a.button`background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #888; margin-left: auto; &:hover{color:#333;}`,ot=a.div`padding: 1.5rem; overflow-y: auto;`,it=a.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;`,V=a.div`
  background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  border-left: 5px solid ${n=>n.color||"#ccc"};
  h3 { margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666; text-transform: uppercase; }
  p { margin: 0; font-size: 1.75rem; font-weight: bold; color: ${n=>n.color||"#333"}; }
`,st=a(ue)`animation: spin 1s linear infinite; @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`,J=a.div`text-align: center; padding: 2rem; color: #6c757d;`,lt=a.div`
  background: white; border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem;
  border: 1px solid #e9ecef; box-shadow: 0 2px 4px rgba(0,0,0,0.04);
  border-left: 5px solid ${n=>n.$estado==="PAGADO"?"#28a745":n.$estado==="DEVUELTO"?"#ffc107":"#dc3545"};
`,dt=a.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;
  .ticket-title { font-weight: 700; font-size: 1.1rem; color: #0056b3; }
  .ticket-date { font-size: 0.85rem; color: #6c757d; }
`,ct=a.div`
  width: 100%; height: 8px; background: #e9ecef; border-radius: 4px; overflow: hidden; margin: 0.5rem 0;
  .fill { height: 100%; background: ${n=>n.$pct>=100?"#28a745":"#007bff"}; border-radius: 4px; transition: width 0.3s; }
`,pt=a.div`
  display: flex; gap: 1.5rem; flex-wrap: wrap; font-size: 0.9rem; color: #495057;
  .stat { display: flex; flex-direction: column; }
  .stat-label { font-size: 0.75rem; color: #6c757d; text-transform: uppercase; font-weight: 600; }
  .stat-value { font-weight: 700; font-size: 1.1rem; }
`,mt=a.span`
  font-size: 0.75rem; font-weight: 700; padding: 3px 10px; border-radius: 12px;
  background: ${n=>n.$type==="PAGADO"?"#d4edda":n.$type==="DEVUELTO"?"#fff3cd":"#f8d7da"};
  color: ${n=>n.$type==="PAGADO"?"#155724":n.$type==="DEVUELTO"?"#856404":"#721c24"};
`,xt=a.div`padding: 0; margin: 0.75rem 0 0;`,ht=a.div`
  display: flex; gap: 0.75rem; padding: 0.5rem 0; border-bottom: 1px solid #f1f5f9;
  align-items: center;
  &:last-child { border-bottom: none; }
  .icon { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0;
    background: ${n=>n.$type==="credito"?"#dc3545":"#28a745"}; font-size: 0.8rem; }
  .content { flex: 1; min-width: 0; }
  .amount { font-weight: 700; color: ${n=>n.$type==="credito"?"#dc3545":"#28a745"}; }
  .meta { font-size: 0.8rem; color: #6c757d; }
  .cancel-btn {
    flex-shrink: 0; align-self: center; margin-left: 8px;
    padding: 6px 12px; background: #dc3545; color: white !important; border: none;
    border-radius: 6px; font-size: 0.78rem; font-weight: 700; cursor: pointer;
    display: inline-flex; align-items: center; gap: 5px; white-space: nowrap;
    &:hover { background: #c82333; }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
  }
`,T=n=>`C$${Number(n||0).toFixed(2)}`,gt=n=>n?new Date(n).toLocaleDateString("es-NI",{timeZone:"America/Managua",day:"2-digit",month:"2-digit",year:"numeric"}):"—",ft=n=>n?new Date(n).toLocaleString("es-NI",{timeZone:"America/Managua",day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:!0}):"—";function ut({client:n,onClose:y,token:c}){const[s,p]=i.useState(!0),[j,g]=i.useState([]),[w,S]=i.useState([]),[m,x]=i.useState(null),{allUsers:r}=le(),[C,l]=i.useState(!1),[f,N]=i.useState(null),[u,B]=i.useState(null),[P,R]=i.useState(!1),[O,v]=i.useState(null),[I,_]=i.useState("ALL"),F=async(t="ALL")=>{R(!0);const o=E.loading("Calculando balance histórico...");try{const h=await Ie(n.id_cliente,c);v(h),_(t),E.dismiss(o)}catch(h){E.dismiss(o),E.error("Error al generar el estado de cuenta."),console.error(h)}finally{R(!1)}},A=i.useCallback(async()=>{if(n){p(!0),x(null);try{const[t,o,h]=await Promise.all([Ae(n.id_cliente,c),ze(n.id_cliente,c),De(n.id_cliente,c)]);g(Array.isArray(t)?t:[]);const z=(o||[]).map(d=>{let D=d.pagoDetalles||{};if(typeof D=="string")try{D=JSON.parse(D)}catch{D={}}return{id:`c-${d.id_venta}`,fecha:new Date(d.fecha),tipo:"credito",descripcion:`Compra a crédito (Venta #${d.id_venta})`,monto:Number(D.credito||d.total||0),userId:d.id_usuario,idVenta:d.id_venta}}),b=(h||[]).map(d=>({id:`a-${d.id_abono}`,fecha:new Date(d.fecha),tipo:"abono",descripcion:"Abono registrado",monto:Number(d.monto),userId:d.id_usuario||d.usuario}));S([...z,...b].sort((d,D)=>D.fecha-d.fecha))}catch(t){console.error("Error cargando historial:",t),x("No se pudo cargar el historial del cliente.")}finally{p(!1)}}},[n,c]);i.useEffect(()=>{A()},[A]);const M=i.useCallback(async t=>{if(window.confirm("¿Estás seguro de cancelar este abono? Se restaurará el saldo del cliente.")){B(t);try{await Te(n.id_cliente,t,c),E.success("Abono cancelado exitosamente."),await A()}catch(o){console.error("Error cancelando abono:",o),E.error(o.message||"Error al cancelar el abono.")}finally{B(null)}}},[n,c,A]),$=i.useMemo(()=>{const t=w.filter(b=>b.tipo==="credito").reduce((b,d)=>b+d.monto,0),o=w.filter(b=>b.tipo==="abono").reduce((b,d)=>b+d.monto,0),h=j.filter(b=>b.saldoRestante>0).length,z=j.filter(b=>b.saldoRestante<=0).length;return{totalCredito:t,totalAbono:o,ticketsPendientes:h,ticketsPagados:z}},[w,j]);return n?e.jsxs(Ke,{onClick:y,children:[e.jsxs(et,{onClick:t=>t.stopPropagation(),children:[e.jsxs(tt,{children:[e.jsxs("div",{children:[e.jsxs(nt,{style:{marginBottom:"8px"},children:["Historial de ",n.nombre]}),e.jsxs(at,{children:[e.jsxs(q,{style:{background:"#212529"},onClick:()=>F("ALL"),disabled:P,children:[e.jsx(G,{})," Estado Completo"]}),e.jsxs(q,{style:{background:"#dc3545"},onClick:()=>F("DEBT"),disabled:P,children:[e.jsx(K,{})," Solo Deuda"]}),e.jsxs(q,{style:{background:"#28a745"},onClick:()=>F("PAID"),disabled:P,children:[e.jsx(L,{})," Solo Pagos"]})]})]}),e.jsx(rt,{onClick:y,children:e.jsx(se,{})})]}),e.jsxs(ot,{children:[s&&e.jsxs(J,{children:[e.jsx(st,{size:30})," ",e.jsx("p",{children:"Cargando..."})]}),m&&e.jsx(J,{style:{color:"red"},children:m}),!s&&!m&&e.jsxs(e.Fragment,{children:[e.jsxs(it,{children:[e.jsxs(V,{color:"#dc3545",children:[e.jsx("h3",{children:"Total Crédito"}),e.jsx("p",{children:T($.totalCredito)})]}),e.jsxs(V,{color:"#28a745",children:[e.jsx("h3",{children:"Total Abonado"}),e.jsx("p",{children:T($.totalAbono)})]}),e.jsxs(V,{color:"#007bff",children:[e.jsx("h3",{children:"Saldo Actual"}),e.jsx("p",{children:T(n.saldo_pendiente)})]}),e.jsxs(V,{color:$.ticketsPendientes>0?"#ffc107":"#28a745",children:[e.jsx("h3",{children:"Facturas"}),e.jsx("p",{style:{fontSize:"1.2rem"},children:$.ticketsPendientes>0?e.jsxs(e.Fragment,{children:[e.jsx(he,{style:{color:"#ffc107"}})," ",$.ticketsPendientes," pendiente",$.ticketsPendientes>1?"s":""]}):e.jsxs(e.Fragment,{children:[e.jsx(ge,{style:{color:"#28a745"}})," Todo pagado"]})})]})]}),j.length>0&&e.jsxs(e.Fragment,{children:[e.jsxs("h3",{style:{margin:"0 0 1rem",color:"#333",display:"flex",alignItems:"center",gap:"0.5rem"},children:[e.jsx(G,{})," Desglose por Factura"]}),j.map(t=>{const o=t.montoOriginal-t.saldoRestante,h=t.montoOriginal>0?o/t.montoOriginal*100:0;return e.jsxs(lt,{$estado:t.estado,children:[e.jsxs(dt,{children:[e.jsxs("div",{children:[e.jsxs("span",{className:"ticket-title",children:["Venta #",t.idVenta]}),e.jsx(mt,{$type:t.estado,style:{marginLeft:"0.75rem"},children:t.estado})]}),e.jsx("span",{className:"ticket-date",children:gt(t.fecha)})]}),e.jsx(ct,{$pct:h,children:e.jsx("div",{className:"fill",style:{width:`${Math.min(100,h)}%`}})}),e.jsxs(pt,{children:[e.jsxs("div",{className:"stat",children:[e.jsx("span",{className:"stat-label",children:"Monto Original"}),e.jsx("span",{className:"stat-value",children:T(t.montoOriginal)})]}),e.jsxs("div",{className:"stat",children:[e.jsx("span",{className:"stat-label",children:"Pagado"}),e.jsx("span",{className:"stat-value",style:{color:"#28a745"},children:T(o)})]}),e.jsxs("div",{className:"stat",children:[e.jsx("span",{className:"stat-label",children:"Pendiente"}),e.jsx("span",{className:"stat-value",style:{color:t.saldoRestante>0?"#dc3545":"#28a745"},children:T(t.saldoRestante)})]}),e.jsxs("div",{className:"stat",children:[e.jsx("span",{className:"stat-label",children:"Progreso"}),e.jsxs("span",{className:"stat-value",children:[Math.round(h),"%"]})]})]})]},t.idVenta)})]}),e.jsx("h3",{style:{margin:"1.5rem 0 0.75rem",color:"#333"},children:"Historial Completo"}),e.jsx(xt,{children:w.length>0?w.map(t=>{const o=r.find(h=>(h.id_usuario??h.id)===t.userId);return e.jsxs(ht,{$type:t.tipo,children:[e.jsx("div",{className:"icon",children:t.tipo==="credito"?e.jsx(K,{}):e.jsx(L,{})}),e.jsxs("div",{className:"content",children:[e.jsx("span",{className:"amount",children:T(t.monto)}),e.jsx("p",{style:{margin:"2px 0"},children:t.descripcion}),e.jsxs("span",{className:"meta",children:[ft(t.fecha)," por ",e.jsx("strong",{children:(o==null?void 0:o.nombre_usuario)||"Sistema"})]})]}),t.tipo==="abono"&&e.jsxs("button",{className:"cancel-btn",onClick:()=>M(t.id.split("-")[1]),disabled:u===t.id.split("-")[1],title:"Cancelar este abono",children:[e.jsx(fe,{})," ",u===t.id.split("-")[1]?"...":"Cancelar"]})]},t.id)}):e.jsxs(J,{children:[e.jsx(G,{size:40}),e.jsx("p",{children:"No hay movimientos para mostrar."})]})})]})]})]}),C&&f&&e.jsx(de,{transaction:{estado:"ABONO_CREDITO",totalVenta:f.monto,fecha:f.fecha,id:f.id.split("-")[1],clientId:n.id_cliente,userId:f.userId},creditStatus:{remainingBalance:Number(n.saldo_pendiente||0)},clients:[n],users:r,onClose:()=>l(!1)}),O&&e.jsx(Xe,{statementData:O,filterType:I,onClose:()=>v(null)})]}):null}const re=a.div`
    padding: 2.5rem 4rem;
    background: #f8f9fa;
    min-height: 100vh;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    @media(max-width: 992px) {
        padding: 1.5rem 1rem;
    }
`,bt=a.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    border-bottom: 2px solid #e9ecef;
    padding-bottom: 1.25rem;
    flex-wrap: wrap;
    gap: 1.25rem;
`,jt=a.h1`
    font-size: 2.2rem;
    color: #212529;
    font-weight: 800;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    @media(max-width: 992px) {
        font-size: 1.8rem;
    }
`,oe=a.div`
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
`,k=a.button`
    padding: 0.65rem 1.3rem;
    border: none;
    border-radius: 8px;
    font-weight: 700;
    color: white;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s ease-in-out;
    background: ${n=>n.primary?"linear-gradient(135deg, #007bff, #0056b3)":n.$delete?"linear-gradient(135deg, #dc3545, #b21f2d)":n.$abono?"linear-gradient(135deg, #17a2b8, #117a8b)":(n.$refresh,"linear-gradient(135deg, #6c757d, #495057)")};
    box-shadow: 0 4px 6px rgba(0,0,0,0.06);
    
    &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0,0,0,0.1);
        filter: brightness(1.05);
    }
    &:active:not(:disabled) {
        transform: translateY(0);
    }
    &:disabled {
        background: #adb5bd;
        box-shadow: none;
        cursor: not-allowed;
    }
`,yt=a(ke)`
    padding: 0.65rem 1.3rem;
    background: linear-gradient(135deg, #6c757d, #495057);
    color: white;
    border-radius: 8px;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    transition: all 0.2s ease-in-out;
    box-shadow: 0 4px 6px rgba(0,0,0,0.06);
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0,0,0,0.1);
        filter: brightness(1.05);
    }
`,wt=a.table`
    width: 100%;
    border-collapse: collapse;
    background: white;
    box-shadow: 0 6px 20px rgba(0,0,0,0.05);
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 2rem;
    @media(max-width: 992px) {
        display: none;
    }
    th, td {
        padding: 1.1rem 1.5rem;
        text-align: left;
        border-bottom: 1px solid #e9ecef;
        vertical-align: middle;
    }
    th {
        background: #f8f9fa;
        color: #495057;
        font-weight: 700;
        text-transform: uppercase;
        font-size: 0.8rem;
        letter-spacing: 0.5px;
    }
    tr:last-child td {
        border-bottom: none;
    }
    tbody tr {
        transition: background 0.15s ease;
    }
    tbody tr:hover {
        background-color: #f8f9fa;
    }
`,Ct=a.div`
    display: none;
    flex-direction: column;
    gap: 1.25rem;
    @media(max-width: 992px) {
        display: flex;
    }
`,vt=a.div`
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 15px rgba(0,0,0,0.04);
    border: 1px solid #e9ecef;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    transition: transform 0.2s;
    
    &:hover {
        transform: translateY(-2px);
    }
`,kt=a.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 1px solid #f1f3f5;
    padding-bottom: 0.75rem;
`,St=a.h3`
    font-size: 1.2rem;
    margin: 0;
    color: #212529;
    font-weight: 700;
`,$t=a.span`
    font-size: 0.85rem;
    color: #6c757d;
    display: block;
    margin-top: 4px;
`,Nt=a.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
`,ie=a.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    span.label { font-size: 0.75rem; color: #adb5bd; text-transform: uppercase; font-weight: 700; }
    span.value { font-size: 1rem; font-weight: 600; color: #495057; }
    span.balance { font-size: 1.15rem; font-weight: 800; color: ${n=>n.isDebt?"#dc3545":"#28a745"}; }
`,At=a.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    margin-top: 0.5rem;
    padding-top: 1.25rem;
    border-top: 1px dashed #e9ecef;

    button {
        justify-content: center;
        width: 100%;
        font-size: 0.85rem;
    }
`,zt=a.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
`,Z=a.div`
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
    border-left: 5px solid ${n=>n.$color||"#007bff"};
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: transform 0.2s, box-shadow 0.2s;
    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
    }
`,Q=a.div`
    display: flex;
    flex-direction: column;
    span.label {
        font-size: 0.8rem;
        color: #868e96;
        text-transform: uppercase;
        font-weight: 700;
        margin-bottom: 0.25rem;
    }
    span.value {
        font-size: 1.8rem;
        font-weight: 800;
        color: #212529;
    }
`,X=a.div`
    background: ${n=>n.$bg||"#e9f2ff"};
    color: ${n=>n.$color||"#007bff"};
    width: 48px;
    height: 48px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
`,Dt=a.div`
    display: flex;
    align-items: center;
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 10px;
    padding: 0.6rem 1.1rem;
    margin-bottom: 2rem;
    max-width: 480px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.02);
    transition: all 0.2s ease-in-out;
    input {
        border: none;
        outline: none;
        margin-left: 0.75rem;
        width: 100%;
        font-size: 1rem;
        color: #495057;
        background: transparent;
        &::placeholder {
            color: #adb5bd;
        }
    }
    svg {
        color: #adb5bd;
        transition: color 0.2s;
    }
    &:focus-within {
        border-color: #007bff;
        box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
        svg {
            color: #007bff;
        }
    }
`;function Mt(){var $;const{clients:n,user:y,token:c,isLoading:s,refreshClients:p,allUsers:j}=le(),{isCajaOpen:g,cajaSession:w,setCajaSession:S,refreshSession:m}=_e(),[x,r]=i.useState({name:null,data:null}),[C,l]=i.useState(null),[f,N]=i.useState({open:!1,title:"",message:""}),[u,B]=i.useState(""),P=i.useCallback(({title:t,message:o})=>{N({open:!0,title:t||"Aviso",message:o||""})},[]),R=i.useCallback(()=>{N({open:!1,title:"",message:""})},[]),O=async t=>{if(t.saldo_pendiente>0){H.error("El cliente tiene saldo pendiente.");return}if(window.confirm("¿Seguro de eliminar este cliente?"))try{await Ee(t.id_cliente,c),H.success("Cliente eliminado correctamente."),p()}catch(o){H.error(o.message||"Error al eliminar cliente.")}},v=(t,o=null)=>r({name:t,data:o}),I=()=>r({name:null,data:null}),_=t=>`C$${Number(t||0).toFixed(2)}`,F=t=>t===null?"∞":_(t),A=i.useMemo(()=>{if(!u.trim())return n;const t=u.toLowerCase();return n.filter(o=>o.nombre.toLowerCase().includes(t)||String(o.id_cliente).includes(t)||o.telefono&&o.telefono.includes(t))},[n,u]),M=i.useMemo(()=>{const t=n.length,o=n.filter(z=>z.saldo_pendiente>0).length,h=n.reduce((z,b)=>z+(b.saldo_pendiente||0),0);return{total:t,withDebt:o,totalDebt:h}},[n]);return s?e.jsx(re,{children:e.jsx("h1",{children:"Cargando..."})}):e.jsxs(re,{children:[e.jsxs(bt,{children:[e.jsxs(jt,{children:[e.jsx(Y,{})," Clientes y Créditos"]}),e.jsxs(oe,{children:[e.jsxs(k,{primary:!0,onClick:()=>v("client"),children:[e.jsx(be,{})," Crear Cliente"]}),e.jsxs(k,{$refresh:!0,onClick:p,children:[e.jsx(je,{})," Recargar"]}),e.jsxs(yt,{to:"/dashboard",children:[e.jsx(ye,{})," Volver"]})]})]}),e.jsxs(zt,{children:[e.jsxs(Z,{$color:"#007bff",children:[e.jsxs(Q,{children:[e.jsx("span",{className:"label",children:"Total Clientes"}),e.jsx("span",{className:"value",children:M.total})]}),e.jsx(X,{$bg:"#e9f2ff",$color:"#007bff",children:e.jsx(Y,{})})]}),e.jsxs(Z,{$color:"#dc3545",children:[e.jsxs(Q,{children:[e.jsx("span",{className:"label",children:"Clientes con Deuda"}),e.jsx("span",{className:"value",children:M.withDebt})]}),e.jsx(X,{$bg:"#fdecec",$color:"#dc3545",children:e.jsx(we,{})})]}),e.jsxs(Z,{$color:"#28a745",children:[e.jsxs(Q,{children:[e.jsx("span",{className:"label",children:"Deuda Total Acumulada"}),e.jsx("span",{className:"value",children:_(M.totalDebt)})]}),e.jsx(X,{$bg:"#e8f7ee",$color:"#28a745",children:e.jsx(Ce,{})})]})]}),e.jsxs(Dt,{children:[e.jsx(ve,{}),e.jsx("input",{type:"text",placeholder:"Buscar por nombre, ID o teléfono...",value:u,onChange:t=>B(t.target.value)})]}),A.length===0?e.jsxs("div",{style:{textAlign:"center",padding:"3rem",background:"white",borderRadius:"12px",boxShadow:"0 4px 15px rgba(0,0,0,0.03)",color:"#868e96"},children:[e.jsx(Y,{size:48,style:{marginBottom:"1rem",opacity:.5}}),e.jsx("h3",{children:"No se encontraron clientes"}),e.jsx("p",{children:"Intenta buscar con otros términos."})]}):e.jsxs(e.Fragment,{children:[e.jsxs(wt,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"ID"}),e.jsx("th",{children:"Nombre"}),e.jsx("th",{children:"Teléfono"}),e.jsx("th",{children:"Límite"}),e.jsxs("th",{children:[e.jsx(K,{})," Saldo"]}),e.jsx("th",{children:"Acciones"})]})}),e.jsx("tbody",{children:A.map(t=>e.jsxs("tr",{children:[e.jsx("td",{children:t.id_cliente}),e.jsx("td",{children:e.jsx("strong",{children:t.nombre})}),e.jsx("td",{children:t.telefono||"N/A"}),e.jsx("td",{children:F(t.limite_credito)}),e.jsx("td",{style:{fontWeight:"800",color:t.saldo_pendiente>0?"#dc3545":"#28a745"},children:_(t.saldo_pendiente)}),e.jsx("td",{children:e.jsxs(oe,{children:[e.jsx(k,{$abono:!0,disabled:!g||t.saldo_pendiente<=0,onClick:()=>v("abono",t),title:"Realizar Abono",children:e.jsx(L,{})}),e.jsx(k,{onClick:()=>v("client",t),title:"Editar Cliente",children:e.jsx(te,{})}),e.jsx(k,{primary:!0,onClick:()=>v("historial",t),title:"Ver Historial de Créditos",children:e.jsx(ne,{})}),e.jsx(k,{$refresh:!0,style:{background:"#6f42c1"},onClick:()=>v("tickets",t),title:"Ver Historial de Tickets",children:e.jsx(L,{})}),e.jsx(k,{$delete:!0,onClick:()=>O(t),title:"Eliminar Cliente",children:e.jsx(ae,{})})]})})]},t.id_cliente))})]}),e.jsx(Ct,{children:A.map(t=>e.jsxs(vt,{children:[e.jsxs(kt,{children:[e.jsxs("div",{children:[e.jsx(St,{children:t.nombre}),e.jsxs($t,{children:["ID: ",t.id_cliente," • ",t.telefono||"Sin Teléfono"]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"flex-end"},children:[e.jsx("span",{style:{fontSize:"0.75rem",color:"#adb5bd",fontWeight:"700"},children:"SALDO"}),e.jsx("span",{style:{fontSize:"1.25rem",fontWeight:"800",color:t.saldo_pendiente>0?"#dc3545":"#28a745"},children:_(t.saldo_pendiente)})]})]}),e.jsxs(Nt,{children:[e.jsxs(ie,{children:[e.jsx("span",{className:"label",children:"Límite Crédito"}),e.jsx("span",{className:"value",children:F(t.limite_credito)})]}),e.jsxs(ie,{children:[e.jsx("span",{className:"label",children:"Estado"}),e.jsx("span",{className:"value",style:{color:t.saldo_pendiente>0?"#e03131":"#2f9e44",fontWeight:"bold"},children:t.saldo_pendiente>0?"Con Deuda":"Al Día"})]})]}),e.jsxs(At,{children:[e.jsxs(k,{$abono:!0,disabled:!g||t.saldo_pendiente<=0,onClick:()=>v("abono",t),children:[e.jsx(L,{})," Abonar"]}),e.jsxs(k,{onClick:()=>v("client",t),children:[e.jsx(te,{})," Editar"]}),e.jsxs(k,{primary:!0,onClick:()=>v("historial",t),children:[e.jsx(ne,{})," Historial"]}),e.jsxs(k,{$refresh:!0,style:{background:"#6f42c1"},onClick:()=>v("tickets",t),children:[e.jsx(L,{})," Tickets"]}),e.jsxs(k,{$delete:!0,style:{gridColumn:"span 2"},onClick:()=>O(t),children:[e.jsx(ae,{})," Eliminar Cliente"]})]})]},t.id_cliente))})]}),x.name==="client"&&e.jsx(qe,{client:x.data,onClose:I,onSave:p}),x.name==="abono"&&e.jsx(Le,{client:x.data,onClose:I,onAbonoSuccess:()=>{p(),m(),H.success("Abono registrado correctamente.")},showAlert:P}),x.name==="historial"&&e.jsx(ut,{client:x.data,onClose:I,token:c}),x.name==="tickets"&&e.jsx(Pe,{onClose:I,initialClientId:($=x.data)==null?void 0:$.id_cliente,clients:n,users:j,loadSales:async(t,o)=>{try{return await Fe(c,{date:t,clientId:o})}catch(h){return console.error(h),[]}},onReprintTicket:t=>{l(t)}}),C&&e.jsx(de,{isOpen:!0,transaction:C,onClose:()=>l(null),clients:n,users:j,currentUser:y}),f.open&&e.jsx(Be,{title:f.title,message:f.message,onClose:R})]})}export{Mt as default};

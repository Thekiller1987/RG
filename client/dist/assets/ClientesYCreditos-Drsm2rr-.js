import{r as s,j as e,n as ne,D as ie,s as a,J as W,x as se,R as le,ag as J,q as de,E as F,K as q,ah as L,ai as ce,ab as pe,aj as me,v as xe,U as he,Z as ge,ak as fe,Y as ue,a7 as Z,$ as K,al as Q,am as B,W as be}from"./vendor-CmfT02pU.js";import{e as je,h as ye,a as we,u as ae,i as Ce,j as ve,k as ke,m as Se,n as Ne,o as $e,p as Ae,q as ze}from"./index-DnX-2Exk.js";import{T as oe,A as Te,S as De}from"./SalesHistoryModal-Jj-KqqEh.js";import{M as Ie,a as _e,B as R}from"./POS.styles-DQ9pTtF7.js";import{A as Ee}from"./AlertModal-eg7K_wmT.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-ClxtRhIU.js";const Fe=a.div`
  position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;z-index:50;
`,Le=a.div`
  background:white;padding:2rem;border-radius:8px;width:400px;max-width:90%;
`,Pe=a.div`display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;`,Oe=a.h2`margin:0;font-size:1.5rem;`,Me=a.button`border:none;background:none;color:#dc3545;font-size:1.2rem;cursor:pointer;`,Be=a.form`display:flex;flex-direction:column;gap:0.8rem;`,H=a.input`padding:0.6rem;border:1px solid #ccc;border-radius:6px;font-size:0.95rem;`,Re=a.button`
  padding:0.6rem 1rem;background:#007bff;color:white;border:none;border-radius:6px;font-weight:bold;display:flex;align-items:center;gap:0.5rem;justify-content:center;
  &:hover{opacity:0.85;}
`;function He({client:t,onClose:y,onSave:c}){const[i,p]=s.useState(""),[b,h]=s.useState(""),[w,$]=s.useState(""),[m,x]=s.useState(""),r=localStorage.getItem("token");s.useEffect(()=>{t?(p(t.nombre||""),h(t.cedula||""),$(t.telefono||""),x(t.limite_credito||"")):(p(""),h(""),$(""),x(""))},[t]);const C=async l=>{l.preventDefault();const f={nombre:i,cedula:b,telefono:w,limite_credito:m===""?null:Number(m)};try{t?await je(t.id_cliente,f,r):await ye(f,r),c&&c(),y()}catch(A){console.error(A),alert(`Error al guardar cliente: ${A.message}`)}};return e.jsx(Fe,{children:e.jsxs(Le,{children:[e.jsxs(Pe,{children:[e.jsx(Oe,{children:t?"Editar Cliente":"Nuevo Cliente"}),e.jsx(Me,{onClick:y,children:e.jsx(ne,{})})]}),e.jsxs(Be,{onSubmit:C,children:[e.jsx(H,{value:i,onChange:l=>p(l.target.value),placeholder:"Nombre",required:!0}),e.jsx(H,{value:b,onChange:l=>h(l.target.value),placeholder:"Cédula / RUC"}),e.jsx(H,{value:w,onChange:l=>$(l.target.value),placeholder:"Teléfono"}),e.jsx(H,{type:"number",step:"0.01",value:m,onChange:l=>x(l.target.value),placeholder:"Límite de crédito"}),e.jsxs(Re,{type:"submit",children:[e.jsx(ie,{})," Guardar"]})]})]})})}const Ue=de`
  @media print {
    body { visibility: hidden; margin: 0; padding: 0; }
    .print-area, .print-area * { visibility: visible !important; }
    .print-area { position: absolute !important; left: 0 !important; top: 0 !important; z-index: 999999 !important; margin: 0 !important; padding: 0 !important; }
    .no-print { display: none !important; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-shadow: none !important; text-shadow: none !important; }
  }
`,We=a.div`
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
`,Ve=a.img`
  width: 100px;
  height: 100px;
  object-fit: contain;
  display: block;
  border-radius: 6px;
  .print-a4 & { width: 130px; height: auto; }
`,Ge=({statementData:t,filterType:y="ALL",onClose:c})=>{const{settings:i}=we(),{cliente:p,historial:b}=t,h=r=>new Intl.NumberFormat("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(r||0)),w=b.filter(r=>y==="DEBT"?r.impacto>0:y==="PAID"?r.impacto<0:!0),$=y==="DEBT"?"HISTORIAL DE DEUDAS (CRÉDITOS)":y==="PAID"?"HISTORIAL DE PAGOS (ABONOS)":"ESTADO DE CUENTA COMPLETO",m={name:(i==null?void 0:i.empresa_nombre)||"Multirepuestos RG",ruc:(i==null?void 0:i.empresa_ruc)||"1211812770001E",phone:(i==null?void 0:i.empresa_telefono)||"84031936 / 84058142",address:(i==null?void 0:i.empresa_direccion)||"Del portón de la normal 75 varas al este. Juigalpa, Chontales.",slogan:(i==null?void 0:i.empresa_eslogan)||"Tu mejor opción en repuestos",logo:(i==null?void 0:i.empresa_logo_url)||new URL("/icons/logo.png",window.location.origin).toString()},x=s.useCallback((r="80")=>{const C=document.getElementById("print-wrapper-statement");if(!C)return;const l=C.outerHTML,A=`
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
    `,v=window.open("","_blank","width=900,height=700");v&&(v.document.write(`<!DOCTYPE html><html><head><title>${$} - ${m.name}</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"><style>${A}</style></head><body>${l}</body></html>`),v.document.close(),v.focus(),v.onload=function(){setTimeout(()=>{v.print(),setTimeout(()=>{v.close()},500)},400)})},[m]);return e.jsxs(Ie,{onClick:c,children:[e.jsx(Ue,{}),e.jsxs(_e,{onClick:r=>r.stopPropagation(),style:{maxWidth:"650px",width:"100%",padding:"0",overflow:"hidden"},children:[e.jsxs("div",{style:{padding:"20px 24px",background:"#1e3a8a",color:"white",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("h2",{style:{margin:0,fontSize:"1.4rem",display:"flex",alignItems:"center",gap:10},children:[e.jsx(W,{})," ",$]}),e.jsx(R,{$cancel:!0,onClick:c,style:{padding:"6px 12px",minWidth:"auto"},children:e.jsx(se,{size:18})})]}),e.jsx("div",{style:{padding:"24px",maxHeight:"70vh",overflowY:"auto",background:"#f8fafc"},children:e.jsx("div",{style:{display:"flex",justifyContent:"center"},children:e.jsxs(We,{id:"print-wrapper-statement",children:[e.jsxs("div",{className:"brand",children:[e.jsx("div",{className:"brand-logo-container",children:e.jsx(Ve,{src:m.logo,alt:"Logo",style:{filter:"grayscale(100%) contrast(150%)"}})}),e.jsxs("div",{className:"brand-info",children:[e.jsx("h1",{children:m.name}),e.jsxs("small",{children:["RUC: ",m.ruc]}),e.jsxs("small",{children:["Tel: ",m.phone]}),e.jsx("small",{children:m.address}),e.jsx("small",{style:{fontWeight:"bold",marginTop:"6px",fontSize:"1rem",textTransform:"uppercase"},children:$})]})]}),e.jsxs("div",{className:"meta",children:[e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Cliente:"})," ",e.jsx("span",{className:"meta-value",children:p.nombre})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"ID:"})," ",e.jsx("span",{className:"meta-value",children:p.id})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Teléfono:"})," ",e.jsx("span",{className:"meta-value",children:p.telefono||"N/A"})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Fecha Emisión:"})," ",e.jsx("span",{className:"meta-value",children:new Date().toLocaleString("es-NI")})]})]}),e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Fecha"}),e.jsx("th",{children:"Ref / Descripción"}),e.jsx("th",{className:"right",children:"Crédito"}),e.jsx("th",{className:"right",children:"Abono"}),e.jsx("th",{className:"right",children:"Saldo"})]})}),e.jsxs("tbody",{children:[w.map((r,C)=>e.jsxs(le.Fragment,{children:[e.jsxs("tr",{children:[e.jsx("td",{children:new Date(r.fecha).toLocaleDateString("es-NI")}),e.jsx("td",{style:{fontSize:"0.8rem"},children:r.descripcion}),e.jsx("td",{className:"right",style:{color:"#d32f2f"},children:r.impacto>0?h(r.monto):""}),e.jsx("td",{className:"right",style:{color:"#388e3c"},children:r.impacto<0?h(r.monto):""}),e.jsx("td",{className:"right",style:{fontWeight:"bold"},children:h(r.saldo)})]}),r.productos&&r.productos.length>0&&r.productos.map((l,f)=>e.jsxs("tr",{style:{background:"#f8f9fa",fontSize:"0.75rem"},children:[e.jsx("td",{}),e.jsxs("td",{colSpan:"2",style:{paddingLeft:"1.5rem",color:"#495057"},children:["↳ ",l.nombre," ",l.codigo?`(${l.codigo})`:""," × ",l.cantidad]}),e.jsxs("td",{className:"right",style:{color:"#495057",fontSize:"0.75rem"},children:["@ C$",h(l.precioUnitario)]}),e.jsxs("td",{className:"right",style:{color:"#495057",fontWeight:"600",fontSize:"0.75rem"},children:["C$",h(l.subtotal)]})]},`${C}-p-${f}`))]},C)),w.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:"5",className:"center",style:{padding:"15px"},children:"Sin movimientos registrados en esta categoría"})})]})]}),e.jsxs("div",{className:"summary",children:[e.jsxs("p",{children:[e.jsx("span",{children:"Límite de Crédito:"})," ",e.jsx("span",{children:p.limite_credito===null?"Ilimitado":"C$"+h(p.limite_credito)})]}),e.jsxs("p",{className:"total",children:[e.jsx("span",{children:"SALDO PENDIENTE:"})," ",e.jsxs("span",{children:["C$ ",h(p.saldo_calculado)]})]})]}),e.jsxs("div",{className:"footer",children:["Documento no válido como factura. ",e.jsx("br",{}),"Gracias por preferir a ",m.name]})]})})}),e.jsxs("div",{style:{padding:"16px 24px",background:"#fff",borderTop:"1px solid #e2e8f0",display:"flex",justifyContent:"flex-end",gap:12},children:[e.jsx(R,{$cancel:!0,onClick:c,children:"Cerrar"}),e.jsxs(R,{style:{background:"#212529",color:"white"},onClick:()=>x("80"),children:[e.jsx(J,{})," Imprimir Ticket (80mm)"]}),e.jsxs(R,{primary:!0,onClick:()=>x("A4"),children:[e.jsx(J,{})," Imprimir Carta (A4)"]})]})]})]})},Ye=a.div`position: fixed; inset: 0; background-color: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 1000; padding: 1rem;`,qe=a.div`background: #f4f7f6; color: #333; border-radius: 10px; width: 900px; max-width: 100%; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 10px 25px rgba(0,0,0,0.1);`,Je=a.div`padding: 1rem 1.5rem; border-bottom: 1px solid #dee2e6; display: flex; justify-content: space-between; align-items: center;`,Ze=a.h2`margin: 0; font-size: 1.5rem;`,Ke=a.div`display: flex; gap: 0.5rem; flex-wrap: wrap;`,G=a.button`
  display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; 
  font-size: 0.85rem; font-weight: 600; border: none; border-radius: 6px; cursor: pointer; color: white;
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`,Qe=a.button`background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #888; margin-left: auto; &:hover{color:#333;}`,Xe=a.div`padding: 1.5rem; overflow-y: auto;`,et=a.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;`,U=a.div`
  background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  border-left: 5px solid ${t=>t.color||"#ccc"};
  h3 { margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666; text-transform: uppercase; }
  p { margin: 0; font-size: 1.75rem; font-weight: bold; color: ${t=>t.color||"#333"}; }
`,tt=a(xe)`animation: spin 1s linear infinite; @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`,Y=a.div`text-align: center; padding: 2rem; color: #6c757d;`,nt=a.div`
  background: white; border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem;
  border: 1px solid #e9ecef; box-shadow: 0 2px 4px rgba(0,0,0,0.04);
  border-left: 5px solid ${t=>t.$estado==="PAGADO"?"#28a745":t.$estado==="DEVUELTO"?"#ffc107":"#dc3545"};
`,at=a.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;
  .ticket-title { font-weight: 700; font-size: 1.1rem; color: #0056b3; }
  .ticket-date { font-size: 0.85rem; color: #6c757d; }
`,ot=a.div`
  width: 100%; height: 8px; background: #e9ecef; border-radius: 4px; overflow: hidden; margin: 0.5rem 0;
  .fill { height: 100%; background: ${t=>t.$pct>=100?"#28a745":"#007bff"}; border-radius: 4px; transition: width 0.3s; }
`,rt=a.div`
  display: flex; gap: 1.5rem; flex-wrap: wrap; font-size: 0.9rem; color: #495057;
  .stat { display: flex; flex-direction: column; }
  .stat-label { font-size: 0.75rem; color: #6c757d; text-transform: uppercase; font-weight: 600; }
  .stat-value { font-weight: 700; font-size: 1.1rem; }
`,it=a.span`
  font-size: 0.75rem; font-weight: 700; padding: 3px 10px; border-radius: 12px;
  background: ${t=>t.$type==="PAGADO"?"#d4edda":t.$type==="DEVUELTO"?"#fff3cd":"#f8d7da"};
  color: ${t=>t.$type==="PAGADO"?"#155724":t.$type==="DEVUELTO"?"#856404":"#721c24"};
`,st=a.div`padding: 0; margin: 0.75rem 0 0;`,lt=a.div`
  display: flex; gap: 0.75rem; padding: 0.5rem 0; border-bottom: 1px solid #f1f5f9;
  align-items: center;
  &:last-child { border-bottom: none; }
  .icon { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0;
    background: ${t=>t.$type==="credito"?"#dc3545":"#28a745"}; font-size: 0.8rem; }
  .content { flex: 1; min-width: 0; }
  .amount { font-weight: 700; color: ${t=>t.$type==="credito"?"#dc3545":"#28a745"}; }
  .meta { font-size: 0.8rem; color: #6c757d; }
  .cancel-btn {
    flex-shrink: 0; align-self: center; margin-left: 8px;
    padding: 6px 12px; background: #dc3545; color: white !important; border: none;
    border-radius: 6px; font-size: 0.78rem; font-weight: 700; cursor: pointer;
    display: inline-flex; align-items: center; gap: 5px; white-space: nowrap;
    &:hover { background: #c82333; }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
  }
`,D=t=>`C$${Number(t||0).toFixed(2)}`,dt=t=>t?new Date(t).toLocaleDateString("es-NI",{timeZone:"America/Managua",day:"2-digit",month:"2-digit",year:"numeric"}):"—",ct=t=>t?new Date(t).toLocaleString("es-NI",{timeZone:"America/Managua",day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:!0}):"—";function pt({client:t,onClose:y,token:c}){const[i,p]=s.useState(!0),[b,h]=s.useState([]),[w,$]=s.useState([]),[m,x]=s.useState(null),{allUsers:r}=ae(),[C,l]=s.useState(!1),[f,A]=s.useState(null),[v,P]=s.useState(null),[I,k]=s.useState(!1),[z,_]=s.useState(null),[O,M]=s.useState("ALL"),n=async(o="ALL")=>{k(!0);const g=F.loading("Calculando balance histórico...");try{const u=await Ne(t.id_cliente,c);_(u),M(o),F.dismiss(g)}catch(u){F.dismiss(g),F.error("Error al generar el estado de cuenta."),console.error(u)}finally{k(!1)}},S=s.useCallback(async()=>{if(t){p(!0),x(null);try{const[o,g,u]=await Promise.all([Ce(t.id_cliente,c),ve(t.id_cliente,c),ke(t.id_cliente,c)]);h(Array.isArray(o)?o:[]);const V=(g||[]).map(d=>{let T=d.pagoDetalles||{};if(typeof T=="string")try{T=JSON.parse(T)}catch{T={}}return{id:`c-${d.id_venta}`,fecha:new Date(d.fecha),tipo:"credito",descripcion:`Compra a crédito (Venta #${d.id_venta})`,monto:Number(T.credito||d.total||0),userId:d.id_usuario,idVenta:d.id_venta}}),j=(u||[]).map(d=>({id:`a-${d.id_abono}`,fecha:new Date(d.fecha),tipo:"abono",descripcion:"Abono registrado",monto:Number(d.monto),userId:d.id_usuario||d.usuario}));$([...V,...j].sort((d,T)=>T.fecha-d.fecha))}catch(o){console.error("Error cargando historial:",o),x("No se pudo cargar el historial del cliente.")}finally{p(!1)}}},[t,c]);s.useEffect(()=>{S()},[S]);const re=s.useCallback(async o=>{if(window.confirm("¿Estás seguro de cancelar este abono? Se restaurará el saldo del cliente.")){P(o);try{await Se(t.id_cliente,o,c),F.success("Abono cancelado exitosamente."),await S()}catch(g){console.error("Error cancelando abono:",g),F.error(g.message||"Error al cancelar el abono.")}finally{P(null)}}},[t,c,S]),E=s.useMemo(()=>{const o=w.filter(j=>j.tipo==="credito").reduce((j,d)=>j+d.monto,0),g=w.filter(j=>j.tipo==="abono").reduce((j,d)=>j+d.monto,0),u=b.filter(j=>j.saldoRestante>0).length,V=b.filter(j=>j.saldoRestante<=0).length;return{totalCredito:o,totalAbono:g,ticketsPendientes:u,ticketsPagados:V}},[w,b]);return t?e.jsxs(Ye,{onClick:y,children:[e.jsxs(qe,{onClick:o=>o.stopPropagation(),children:[e.jsxs(Je,{children:[e.jsxs("div",{children:[e.jsxs(Ze,{style:{marginBottom:"8px"},children:["Historial de ",t.nombre]}),e.jsxs(Ke,{children:[e.jsxs(G,{style:{background:"#212529"},onClick:()=>n("ALL"),disabled:I,children:[e.jsx(W,{})," Estado Completo"]}),e.jsxs(G,{style:{background:"#dc3545"},onClick:()=>n("DEBT"),disabled:I,children:[e.jsx(q,{})," Solo Deuda"]}),e.jsxs(G,{style:{background:"#28a745"},onClick:()=>n("PAID"),disabled:I,children:[e.jsx(L,{})," Solo Pagos"]})]})]}),e.jsx(Qe,{onClick:y,children:e.jsx(ne,{})})]}),e.jsxs(Xe,{children:[i&&e.jsxs(Y,{children:[e.jsx(tt,{size:30})," ",e.jsx("p",{children:"Cargando..."})]}),m&&e.jsx(Y,{style:{color:"red"},children:m}),!i&&!m&&e.jsxs(e.Fragment,{children:[e.jsxs(et,{children:[e.jsxs(U,{color:"#dc3545",children:[e.jsx("h3",{children:"Total Crédito"}),e.jsx("p",{children:D(E.totalCredito)})]}),e.jsxs(U,{color:"#28a745",children:[e.jsx("h3",{children:"Total Abonado"}),e.jsx("p",{children:D(E.totalAbono)})]}),e.jsxs(U,{color:"#007bff",children:[e.jsx("h3",{children:"Saldo Actual"}),e.jsx("p",{children:D(t.saldo_pendiente)})]}),e.jsxs(U,{color:E.ticketsPendientes>0?"#ffc107":"#28a745",children:[e.jsx("h3",{children:"Facturas"}),e.jsx("p",{style:{fontSize:"1.2rem"},children:E.ticketsPendientes>0?e.jsxs(e.Fragment,{children:[e.jsx(ce,{style:{color:"#ffc107"}})," ",E.ticketsPendientes," pendiente",E.ticketsPendientes>1?"s":""]}):e.jsxs(e.Fragment,{children:[e.jsx(pe,{style:{color:"#28a745"}})," Todo pagado"]})})]})]}),b.length>0&&e.jsxs(e.Fragment,{children:[e.jsxs("h3",{style:{margin:"0 0 1rem",color:"#333",display:"flex",alignItems:"center",gap:"0.5rem"},children:[e.jsx(W,{})," Desglose por Factura"]}),b.map(o=>{const g=o.montoOriginal-o.saldoRestante,u=o.montoOriginal>0?g/o.montoOriginal*100:0;return e.jsxs(nt,{$estado:o.estado,children:[e.jsxs(at,{children:[e.jsxs("div",{children:[e.jsxs("span",{className:"ticket-title",children:["Venta #",o.idVenta]}),e.jsx(it,{$type:o.estado,style:{marginLeft:"0.75rem"},children:o.estado})]}),e.jsx("span",{className:"ticket-date",children:dt(o.fecha)})]}),e.jsx(ot,{$pct:u,children:e.jsx("div",{className:"fill",style:{width:`${Math.min(100,u)}%`}})}),e.jsxs(rt,{children:[e.jsxs("div",{className:"stat",children:[e.jsx("span",{className:"stat-label",children:"Monto Original"}),e.jsx("span",{className:"stat-value",children:D(o.montoOriginal)})]}),e.jsxs("div",{className:"stat",children:[e.jsx("span",{className:"stat-label",children:"Pagado"}),e.jsx("span",{className:"stat-value",style:{color:"#28a745"},children:D(g)})]}),e.jsxs("div",{className:"stat",children:[e.jsx("span",{className:"stat-label",children:"Pendiente"}),e.jsx("span",{className:"stat-value",style:{color:o.saldoRestante>0?"#dc3545":"#28a745"},children:D(o.saldoRestante)})]}),e.jsxs("div",{className:"stat",children:[e.jsx("span",{className:"stat-label",children:"Progreso"}),e.jsxs("span",{className:"stat-value",children:[Math.round(u),"%"]})]})]})]},o.idVenta)})]}),e.jsx("h3",{style:{margin:"1.5rem 0 0.75rem",color:"#333"},children:"Historial Completo"}),e.jsx(st,{children:w.length>0?w.map(o=>{const g=r.find(u=>(u.id_usuario??u.id)===o.userId);return e.jsxs(lt,{$type:o.tipo,children:[e.jsx("div",{className:"icon",children:o.tipo==="credito"?e.jsx(q,{}):e.jsx(L,{})}),e.jsxs("div",{className:"content",children:[e.jsx("span",{className:"amount",children:D(o.monto)}),e.jsx("p",{style:{margin:"2px 0"},children:o.descripcion}),e.jsxs("span",{className:"meta",children:[ct(o.fecha)," por ",e.jsx("strong",{children:(g==null?void 0:g.nombre_usuario)||"Sistema"})]})]}),o.tipo==="abono"&&e.jsxs("button",{className:"cancel-btn",onClick:()=>re(o.id.split("-")[1]),disabled:v===o.id.split("-")[1],title:"Cancelar este abono",children:[e.jsx(me,{})," ",v===o.id.split("-")[1]?"...":"Cancelar"]})]},o.id)}):e.jsxs(Y,{children:[e.jsx(W,{size:40}),e.jsx("p",{children:"No hay movimientos para mostrar."})]})})]})]})]}),C&&f&&e.jsx(oe,{transaction:{estado:"ABONO_CREDITO",totalVenta:f.monto,fecha:f.fecha,id:f.id.split("-")[1],clientId:t.id_cliente,userId:f.userId},creditStatus:{remainingBalance:Number(t.saldo_pendiente||0)},clients:[t],users:r,onClose:()=>l(!1)}),z&&e.jsx(Ge,{statementData:z,filterType:O,onClose:()=>_(null)})]}):null}const X=a.div`
    padding: 2rem 4rem;
    background: #f8f9fa;
    min-height: 100vh;
    @media(max-width: 992px) {
        padding: 1rem;
    }
`,mt=a.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    border-bottom: 2px solid #e9ecef;
    padding-bottom: 1rem;
    flex-wrap: wrap;
    gap: 1rem;
`,xt=a.h1`
    font-size: 2.5rem;
    color: #343a40;
    display: flex;
    align-items: center;
    gap: 1rem;
    @media(max-width: 992px) {
        font-size: 1.8rem;
    }
`,ee=a.div`
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
`,N=a.button`
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    color: white;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.9rem;
    background: ${t=>t.primary?"#007bff":t.$delete?"#dc3545":t.$abono?"#17a2b8":(t.$refresh,"#6c757d")};
    &:hover:not(:disabled) {
        opacity: 0.85;
    }
    &:disabled {
        background: #adb5bd;
        cursor: not-allowed;
    }
`,ht=a(be)`
    padding: 0.7rem 1.3rem;
    background-color: #6c757d;
    color: white;
    border-radius: 8px;
    font-weight: bold;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    &:hover {
        background-color: #5a6268;
    }
`,gt=a.table`
    width: 100%;
    border-collapse: collapse;
    background: white;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    border-radius: 8px;
    overflow: hidden;
    @media(max-width: 992px) {
        display: none;
    }
    th, td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid #dee2e6;
        vertical-align: middle;
    }
    th {
        background: #f8f9fa;
        color: #495057;
        font-weight: 600;
        text-transform: uppercase;
        font-size: 0.8rem;
    }
`,ft=a.div`
    display: none;
    flex-direction: column;
    gap: 1rem;
    @media(max-width: 992px) {
        display: flex;
    }
`,ut=a.div`
    background: white;
    border-radius: 12px;
    padding: 1.25rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    border: 1px solid #e9ecef;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
`,bt=a.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 1px solid #f1f3f5;
    padding-bottom: 0.75rem;
    margin-bottom: 0.25rem;
`,jt=a.h3`
    font-size: 1.1rem;
    margin: 0;
    color: #343a40;
    font-weight: 700;
`,yt=a.span`
    font-size: 0.85rem;
    color: #868e96;
    display: block;
    margin-top: 4px;
`,wt=a.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
`,te=a.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
    span.label { font-size: 0.75rem; color: #adb5bd; text-transform: uppercase; font-weight: 600; }
    span.value { font-size: 1rem; font-weight: 600; color: #495057; }
    span.balance { font-size: 1.1rem; font-weight: 700; color: ${t=>t.isDebt?"#dc3545":"#28a745"}; }
`,Ct=a.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    margin-top: 0.5rem;
    padding-top: 1rem;
    border-top: 1px dashed #e9ecef;

    button {
        justify-content: center;
        width: 100%;
        font-size: 0.85rem;
    }
`;function Tt(){var M;const{clients:t,user:y,token:c,isLoading:i,refreshClients:p,allUsers:b}=ae(),{isCajaOpen:h,cajaSession:w,setCajaSession:$,refreshSession:m}=$e(),[x,r]=s.useState({name:null,data:null}),[C,l]=s.useState(null),[f,A]=s.useState({open:!1,title:"",message:""}),v=s.useCallback(({title:n,message:S})=>{A({open:!0,title:n||"Aviso",message:S||""})},[]),P=s.useCallback(()=>{A({open:!1,title:"",message:""})},[]),I=async n=>{if(n.saldo_pendiente>0){B.error("El cliente tiene saldo pendiente.");return}if(window.confirm("¿Seguro de eliminar este cliente?"))try{await ze(n.id_cliente,c),B.success("Cliente eliminado correctamente."),p()}catch(S){B.error(S.message||"Error al eliminar cliente.")}},k=(n,S=null)=>r({name:n,data:S}),z=()=>r({name:null,data:null}),_=n=>`C$${Number(n||0).toFixed(2)}`,O=n=>n===null?"∞":_(n);return i?e.jsx(X,{children:e.jsx("h1",{children:"Cargando..."})}):e.jsxs(X,{children:[e.jsxs(mt,{children:[e.jsxs(xt,{children:[e.jsx(he,{})," Clientes y Créditos"]}),e.jsxs(ee,{children:[e.jsxs(N,{primary:!0,onClick:()=>k("client"),children:[e.jsx(ge,{})," Crear Cliente"]}),e.jsxs(N,{$refresh:!0,onClick:p,children:[e.jsx(fe,{})," Recargar"]}),e.jsxs(ht,{to:"/dashboard",children:[e.jsx(ue,{})," Volver"]})]})]}),e.jsxs(gt,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"ID"}),e.jsx("th",{children:"Nombre"}),e.jsx("th",{children:"Teléfono"}),e.jsx("th",{children:"Límite"}),e.jsxs("th",{children:[e.jsx(q,{})," Saldo"]}),e.jsx("th",{children:"Acciones"})]})}),e.jsx("tbody",{children:t.map(n=>e.jsxs("tr",{children:[e.jsx("td",{children:n.id_cliente}),e.jsx("td",{children:n.nombre}),e.jsx("td",{children:n.telefono||"N/A"}),e.jsx("td",{children:O(n.limite_credito)}),e.jsx("td",{style:{fontWeight:"bold",color:n.saldo_pendiente>0?"#dc3545":"#28a745"},children:_(n.saldo_pendiente)}),e.jsx("td",{children:e.jsxs(ee,{children:[e.jsx(N,{$abono:!0,disabled:!h||n.saldo_pendiente<=0,onClick:()=>k("abono",n),title:"Realizar Abono",children:e.jsx(L,{})}),e.jsx(N,{onClick:()=>k("client",n),title:"Editar Cliente",children:e.jsx(Z,{})}),e.jsx(N,{primary:!0,onClick:()=>k("historial",n),title:"Ver Historial",children:e.jsx(K,{})}),e.jsx(N,{$refresh:!0,style:{background:"#6f42c1"},onClick:()=>k("tickets",n),title:"Ver Tickets",children:e.jsx(L,{})}),e.jsx(N,{$delete:!0,onClick:()=>I(n),title:"Eliminar Cliente",children:e.jsx(Q,{})})]})})]},n.id_cliente))})]}),e.jsx(ft,{children:t.map(n=>e.jsxs(ut,{children:[e.jsxs(bt,{children:[e.jsxs("div",{children:[e.jsx(jt,{children:n.nombre}),e.jsxs(yt,{children:["ID: ",n.id_cliente," • ",n.telefono||"Sin Teléfono"]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"flex-end"},children:[e.jsx("span",{style:{fontSize:"0.75rem",color:"#adb5bd",fontWeight:"600"},children:"SALDO"}),e.jsx("span",{style:{fontSize:"1.2rem",fontWeight:"bold",color:n.saldo_pendiente>0?"#dc3545":"#28a745"},children:_(n.saldo_pendiente)})]})]}),e.jsxs(wt,{children:[e.jsxs(te,{children:[e.jsx("span",{className:"label",children:"Límite Crédito"}),e.jsx("span",{className:"value",children:O(n.limite_credito)})]}),e.jsxs(te,{children:[e.jsx("span",{className:"label",children:"Estado"}),e.jsx("span",{className:"value",style:{color:n.saldo_pendiente>0?"#e03131":"#2f9e44"},children:n.saldo_pendiente>0?"Con Deuda":"Al Día"})]})]}),e.jsxs(Ct,{children:[e.jsxs(N,{$abono:!0,disabled:!h||n.saldo_pendiente<=0,onClick:()=>k("abono",n),children:[e.jsx(L,{})," Abonar"]}),e.jsxs(N,{onClick:()=>k("client",n),children:[e.jsx(Z,{})," Editar"]}),e.jsxs(N,{primary:!0,onClick:()=>k("historial",n),children:[e.jsx(K,{})," Historial"]}),e.jsxs(N,{$refresh:!0,style:{background:"#6f42c1"},onClick:()=>k("tickets",n),children:[e.jsx(L,{})," Tickets"]}),e.jsxs(N,{$delete:!0,style:{gridColumn:"span 2"},onClick:()=>I(n),children:[e.jsx(Q,{})," Eliminar Cliente"]})]})]},n.id_cliente))}),x.name==="client"&&e.jsx(He,{client:x.data,onClose:z,onSave:p}),x.name==="abono"&&e.jsx(Te,{client:x.data,onClose:z,onAbonoSuccess:()=>{p(),m(),B.success("Abono registrado correctamente.")},showAlert:v}),x.name==="historial"&&e.jsx(pt,{client:x.data,onClose:z,token:c}),x.name==="tickets"&&e.jsx(De,{onClose:z,initialClientId:(M=x.data)==null?void 0:M.id_cliente,clients:t,users:b,loadSales:async n=>{try{return await Ae(c,n)}catch(S){return console.error(S),[]}},onReprintTicket:n=>{l(n)}}),C&&e.jsx(oe,{isOpen:!0,transaction:C,onClose:()=>l(null),clients:t,users:b,currentUser:y}),f.open&&e.jsx(Ee,{title:f.title,message:f.message,onClose:P})]})}export{Tt as default};

import{r as l,j as e,n as ee,D as ae,s as a,J as R,x as oe,ae as Y,q as re,K as G,af as _,ag as ie,a9 as se,E as P,v as le,S as de,X as ce,ah as pe,W as me,a5 as J,Y as q,ai as Z,aj as O,U as xe}from"./vendor-B-pOHZxB.js";import{e as he,h as fe,a as ge,u as te,i as ue,j as be,k as je,m as ye,n as we,o as Ce,p as ve}from"./index-C9q57MBf.js";import{T as ne,A as ke,S as Se}from"./SalesHistoryModal-BqcGqdHD.js";import{M as Ne,a as Ae,B as M}from"./POS.styles-Bz1HfwTU.js";import{A as $e}from"./AlertModal-DN-lJRTs.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-DGlygaeZ.js";const ze=a.div`
  position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;z-index:50;
`,Te=a.div`
  background:white;padding:2rem;border-radius:8px;width:400px;max-width:90%;
`,De=a.div`display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;`,Ie=a.h2`margin:0;font-size:1.5rem;`,_e=a.button`border:none;background:none;color:#dc3545;font-size:1.2rem;cursor:pointer;`,Ee=a.form`display:flex;flex-direction:column;gap:0.8rem;`,B=a.input`padding:0.6rem;border:1px solid #ccc;border-radius:6px;font-size:0.95rem;`,Le=a.button`
  padding:0.6rem 1rem;background:#007bff;color:white;border:none;border-radius:6px;font-weight:bold;display:flex;align-items:center;gap:0.5rem;justify-content:center;
  &:hover{opacity:0.85;}
`;function Fe({client:t,onClose:y,onSave:m}){const[i,c]=l.useState(""),[g,x]=l.useState(""),[w,A]=l.useState(""),[s,C]=l.useState(""),r=localStorage.getItem("token");l.useEffect(()=>{t?(c(t.nombre||""),x(t.cedula||""),A(t.telefono||""),C(t.limite_credito||"")):(c(""),x(""),A(""),C(""))},[t]);const N=async p=>{p.preventDefault();const v={nombre:i,cedula:g,telefono:w,limite_credito:s===""?null:Number(s)};try{t?await he(t.id_cliente,v,r):await fe(v,r),m&&m(),y()}catch($){console.error($),alert(`Error al guardar cliente: ${$.message}`)}};return e.jsx(ze,{children:e.jsxs(Te,{children:[e.jsxs(De,{children:[e.jsx(Ie,{children:t?"Editar Cliente":"Nuevo Cliente"}),e.jsx(_e,{onClick:y,children:e.jsx(ee,{})})]}),e.jsxs(Ee,{onSubmit:N,children:[e.jsx(B,{value:i,onChange:p=>c(p.target.value),placeholder:"Nombre",required:!0}),e.jsx(B,{value:g,onChange:p=>x(p.target.value),placeholder:"Cédula / RUC"}),e.jsx(B,{value:w,onChange:p=>A(p.target.value),placeholder:"Teléfono"}),e.jsx(B,{type:"number",step:"0.01",value:s,onChange:p=>C(p.target.value),placeholder:"Límite de crédito"}),e.jsxs(Le,{type:"submit",children:[e.jsx(ae,{})," Guardar"]})]})]})})}const Pe=re`
  @media print {
    body { visibility: hidden; margin: 0; padding: 0; }
    .print-area, .print-area * { visibility: visible !important; }
    .print-area { position: absolute !important; left: 0 !important; top: 0 !important; z-index: 999999 !important; margin: 0 !important; padding: 0 !important; }
    .no-print { display: none !important; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-shadow: none !important; text-shadow: none !important; }
  }
`,Oe=a.div`
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
`,Me=a.img`
  width: 100px;
  height: 100px;
  object-fit: contain;
  display: block;
  border-radius: 6px;
  .print-a4 & { width: 130px; height: auto; }
`,Be=({statementData:t,filterType:y="ALL",onClose:m})=>{const{settings:i}=ge(),{cliente:c,historial:g}=t,x=r=>new Intl.NumberFormat("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(r||0)),w=g.filter(r=>y==="DEBT"?r.impacto>0:y==="PAID"?r.impacto<0:!0),A=y==="DEBT"?"HISTORIAL DE DEUDAS (CRÉDITOS)":y==="PAID"?"HISTORIAL DE PAGOS (ABONOS)":"ESTADO DE CUENTA COMPLETO",s={name:(i==null?void 0:i.empresa_nombre)||"Multirepuestos RG",ruc:(i==null?void 0:i.empresa_ruc)||"1211812770001E",phone:(i==null?void 0:i.empresa_telefono)||"84031936 / 84058142",address:(i==null?void 0:i.empresa_direccion)||"Del portón de la normal 75 varas al este. Juigalpa, Chontales.",slogan:(i==null?void 0:i.empresa_eslogan)||"Tu mejor opción en repuestos",logo:(i==null?void 0:i.empresa_logo_url)||new URL("/icons/logo.png",window.location.origin).toString()},C=l.useCallback((r="80")=>{const N=document.getElementById("print-wrapper-statement");if(!N)return;const p=N.outerHTML,$=`
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
    `,u=window.open("","_blank","width=900,height=700");u&&(u.document.write(`<!DOCTYPE html><html><head><title>${A} - ${s.name}</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"><style>${$}</style></head><body>${p}</body></html>`),u.document.close(),u.focus(),u.onload=function(){setTimeout(()=>{u.print(),setTimeout(()=>{u.close()},500)},400)})},[s]);return e.jsxs(Ne,{onClick:m,children:[e.jsx(Pe,{}),e.jsxs(Ae,{onClick:r=>r.stopPropagation(),style:{maxWidth:"650px",width:"100%",padding:"0",overflow:"hidden"},children:[e.jsxs("div",{style:{padding:"20px 24px",background:"#1e3a8a",color:"white",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("h2",{style:{margin:0,fontSize:"1.4rem",display:"flex",alignItems:"center",gap:10},children:[e.jsx(R,{})," ",A]}),e.jsx(M,{$cancel:!0,onClick:m,style:{padding:"6px 12px",minWidth:"auto"},children:e.jsx(oe,{size:18})})]}),e.jsx("div",{style:{padding:"24px",maxHeight:"70vh",overflowY:"auto",background:"#f8fafc"},children:e.jsx("div",{style:{display:"flex",justifyContent:"center"},children:e.jsxs(Oe,{id:"print-wrapper-statement",children:[e.jsxs("div",{className:"brand",children:[e.jsx("div",{className:"brand-logo-container",children:e.jsx(Me,{src:s.logo,alt:"Logo",style:{filter:"grayscale(100%) contrast(150%)"}})}),e.jsxs("div",{className:"brand-info",children:[e.jsx("h1",{children:s.name}),e.jsxs("small",{children:["RUC: ",s.ruc]}),e.jsxs("small",{children:["Tel: ",s.phone]}),e.jsx("small",{children:s.address}),e.jsx("small",{style:{fontWeight:"bold",marginTop:"6px",fontSize:"1rem",textTransform:"uppercase"},children:A})]})]}),e.jsxs("div",{className:"meta",children:[e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Cliente:"})," ",e.jsx("span",{className:"meta-value",children:c.nombre})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"ID:"})," ",e.jsx("span",{className:"meta-value",children:c.id})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Teléfono:"})," ",e.jsx("span",{className:"meta-value",children:c.telefono||"N/A"})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Fecha Emisión:"})," ",e.jsx("span",{className:"meta-value",children:new Date().toLocaleString("es-NI")})]})]}),e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Fecha"}),e.jsx("th",{children:"Ref / Descripción"}),e.jsx("th",{className:"right",children:"Crédito"}),e.jsx("th",{className:"right",children:"Abono"}),e.jsx("th",{className:"right",children:"Saldo"})]})}),e.jsxs("tbody",{children:[w.map((r,N)=>e.jsxs("tr",{children:[e.jsx("td",{children:new Date(r.fecha).toLocaleDateString("es-NI")}),e.jsx("td",{style:{fontSize:"0.8rem"},children:r.descripcion}),e.jsx("td",{className:"right",style:{color:"#d32f2f"},children:r.impacto>0?x(r.monto):""}),e.jsx("td",{className:"right",style:{color:"#388e3c"},children:r.impacto<0?x(r.monto):""}),e.jsx("td",{className:"right",style:{fontWeight:"bold"},children:x(r.saldo)})]},N)),w.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:"5",className:"center",style:{padding:"15px"},children:"Sin movimientos registrados en esta categoría"})})]})]}),e.jsxs("div",{className:"summary",children:[e.jsxs("p",{children:[e.jsx("span",{children:"Límite de Crédito:"})," ",e.jsx("span",{children:c.limite_credito===null?"Ilimitado":"C$"+x(c.limite_credito)})]}),e.jsxs("p",{className:"total",children:[e.jsx("span",{children:"SALDO PENDIENTE:"})," ",e.jsxs("span",{children:["C$ ",x(c.saldo_calculado)]})]})]}),e.jsxs("div",{className:"footer",children:["Documento no válido como factura. ",e.jsx("br",{}),"Gracias por preferir a ",s.name]})]})})}),e.jsxs("div",{style:{padding:"16px 24px",background:"#fff",borderTop:"1px solid #e2e8f0",display:"flex",justifyContent:"flex-end",gap:12},children:[e.jsx(M,{$cancel:!0,onClick:m,children:"Cerrar"}),e.jsxs(M,{style:{background:"#212529",color:"white"},onClick:()=>C("80"),children:[e.jsx(Y,{})," Imprimir Ticket (80mm)"]}),e.jsxs(M,{primary:!0,onClick:()=>C("A4"),children:[e.jsx(Y,{})," Imprimir Carta (A4)"]})]})]})]})},He=a.div`position: fixed; inset: 0; background-color: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 1000; padding: 1rem;`,Re=a.div`background: #f4f7f6; color: #333; border-radius: 10px; width: 900px; max-width: 100%; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 10px 25px rgba(0,0,0,0.1);`,Ue=a.div`padding: 1rem 1.5rem; border-bottom: 1px solid #dee2e6; display: flex; justify-content: space-between; align-items: center;`,Ve=a.h2`margin: 0; font-size: 1.5rem;`,We=a.div`display: flex; gap: 0.5rem; flex-wrap: wrap;`,V=a.button`
  display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; 
  font-size: 0.85rem; font-weight: 600; border: none; border-radius: 6px; cursor: pointer; color: white;
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`,Ge=a.button`background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #888; margin-left: auto; &:hover{color:#333;}`,Ye=a.div`padding: 1.5rem; overflow-y: auto;`,Je=a.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;`,H=a.div`
  background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  border-left: 5px solid ${t=>t.color||"#ccc"};
  h3 { margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666; text-transform: uppercase; }
  p { margin: 0; font-size: 1.75rem; font-weight: bold; color: ${t=>t.color||"#333"}; }
`,qe=a(le)`animation: spin 1s linear infinite; @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`,W=a.div`text-align: center; padding: 2rem; color: #6c757d;`,Ze=a.div`
  background: white; border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem;
  border: 1px solid #e9ecef; box-shadow: 0 2px 4px rgba(0,0,0,0.04);
  border-left: 5px solid ${t=>t.$estado==="PAGADO"?"#28a745":t.$estado==="DEVUELTO"?"#ffc107":"#dc3545"};
`,Ke=a.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;
  .ticket-title { font-weight: 700; font-size: 1.1rem; color: #0056b3; }
  .ticket-date { font-size: 0.85rem; color: #6c757d; }
`,Xe=a.div`
  width: 100%; height: 8px; background: #e9ecef; border-radius: 4px; overflow: hidden; margin: 0.5rem 0;
  .fill { height: 100%; background: ${t=>t.$pct>=100?"#28a745":"#007bff"}; border-radius: 4px; transition: width 0.3s; }
`,Qe=a.div`
  display: flex; gap: 1.5rem; flex-wrap: wrap; font-size: 0.9rem; color: #495057;
  .stat { display: flex; flex-direction: column; }
  .stat-label { font-size: 0.75rem; color: #6c757d; text-transform: uppercase; font-weight: 600; }
  .stat-value { font-weight: 700; font-size: 1.1rem; }
`,et=a.span`
  font-size: 0.75rem; font-weight: 700; padding: 3px 10px; border-radius: 12px;
  background: ${t=>t.$type==="PAGADO"?"#d4edda":t.$type==="DEVUELTO"?"#fff3cd":"#f8d7da"};
  color: ${t=>t.$type==="PAGADO"?"#155724":t.$type==="DEVUELTO"?"#856404":"#721c24"};
`,tt=a.div`padding: 0; margin: 0.75rem 0 0;`,nt=a.div`
  display: flex; gap: 0.75rem; padding: 0.5rem 0; border-bottom: 1px solid #f1f5f9;
  &:last-child { border-bottom: none; }
  .icon { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0;
    background: ${t=>t.$type==="credito"?"#dc3545":"#28a745"}; font-size: 0.8rem; }
  .content { flex: 1; }
  .amount { font-weight: 700; color: ${t=>t.$type==="credito"?"#dc3545":"#28a745"}; }
  .meta { font-size: 0.8rem; color: #6c757d; }
`,D=t=>`C$${Number(t||0).toFixed(2)}`,at=t=>t?new Date(t).toLocaleDateString("es-NI",{timeZone:"America/Managua",day:"2-digit",month:"2-digit",year:"numeric"}):"—",ot=t=>t?new Date(t).toLocaleString("es-NI",{timeZone:"America/Managua",day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:!0}):"—";function rt({client:t,onClose:y,token:m}){const[i,c]=l.useState(!0),[g,x]=l.useState([]),[w,A]=l.useState([]),[s,C]=l.useState(null),{allUsers:r}=te(),[N,p]=l.useState(!1),[v,$]=l.useState(null),[u,E]=l.useState(!1),[k,z]=l.useState(null),[L,F]=l.useState("ALL"),I=async(o="ALL")=>{E(!0);const b=P.loading("Calculando balance histórico...");try{const f=await ye(t.id_cliente,m);z(f),F(o),P.dismiss(b)}catch(f){P.dismiss(b),P.error("Error al generar el estado de cuenta."),console.error(f)}finally{E(!1)}},n=l.useCallback(async()=>{if(t){c(!0),C(null);try{const[o,b,f]=await Promise.all([ue(t.id_cliente,m),be(t.id_cliente,m),je(t.id_cliente,m)]);x(Array.isArray(o)?o:[]);const U=(b||[]).map(d=>{let T=d.pagoDetalles||{};if(typeof T=="string")try{T=JSON.parse(T)}catch{T={}}return{id:`c-${d.id_venta}`,fecha:new Date(d.fecha),tipo:"credito",descripcion:`Compra a crédito (Venta #${d.id_venta})`,monto:Number(T.credito||d.total||0),userId:d.id_usuario,idVenta:d.id_venta}}),j=(f||[]).map(d=>({id:`a-${d.id_abono}`,fecha:new Date(d.fecha),tipo:"abono",descripcion:"Abono registrado",monto:Number(d.monto),userId:d.id_usuario||d.usuario}));A([...U,...j].sort((d,T)=>T.fecha-d.fecha))}catch(o){console.error("Error cargando historial:",o),C("No se pudo cargar el historial del cliente.")}finally{c(!1)}}},[t,m]);l.useEffect(()=>{n()},[n]);const h=l.useMemo(()=>{const o=w.filter(j=>j.tipo==="credito").reduce((j,d)=>j+d.monto,0),b=w.filter(j=>j.tipo==="abono").reduce((j,d)=>j+d.monto,0),f=g.filter(j=>j.saldoRestante>0).length,U=g.filter(j=>j.saldoRestante<=0).length;return{totalCredito:o,totalAbono:b,ticketsPendientes:f,ticketsPagados:U}},[w,g]);return t?e.jsxs(He,{onClick:y,children:[e.jsxs(Re,{onClick:o=>o.stopPropagation(),children:[e.jsxs(Ue,{children:[e.jsxs("div",{children:[e.jsxs(Ve,{style:{marginBottom:"8px"},children:["Historial de ",t.nombre]}),e.jsxs(We,{children:[e.jsxs(V,{style:{background:"#212529"},onClick:()=>I("ALL"),disabled:u,children:[e.jsx(R,{})," Estado Completo"]}),e.jsxs(V,{style:{background:"#dc3545"},onClick:()=>I("DEBT"),disabled:u,children:[e.jsx(G,{})," Solo Deuda"]}),e.jsxs(V,{style:{background:"#28a745"},onClick:()=>I("PAID"),disabled:u,children:[e.jsx(_,{})," Solo Pagos"]})]})]}),e.jsx(Ge,{onClick:y,children:e.jsx(ee,{})})]}),e.jsxs(Ye,{children:[i&&e.jsxs(W,{children:[e.jsx(qe,{size:30})," ",e.jsx("p",{children:"Cargando..."})]}),s&&e.jsx(W,{style:{color:"red"},children:s}),!i&&!s&&e.jsxs(e.Fragment,{children:[e.jsxs(Je,{children:[e.jsxs(H,{color:"#dc3545",children:[e.jsx("h3",{children:"Total Crédito"}),e.jsx("p",{children:D(h.totalCredito)})]}),e.jsxs(H,{color:"#28a745",children:[e.jsx("h3",{children:"Total Abonado"}),e.jsx("p",{children:D(h.totalAbono)})]}),e.jsxs(H,{color:"#007bff",children:[e.jsx("h3",{children:"Saldo Actual"}),e.jsx("p",{children:D(t.saldo_pendiente)})]}),e.jsxs(H,{color:h.ticketsPendientes>0?"#ffc107":"#28a745",children:[e.jsx("h3",{children:"Facturas"}),e.jsx("p",{style:{fontSize:"1.2rem"},children:h.ticketsPendientes>0?e.jsxs(e.Fragment,{children:[e.jsx(ie,{style:{color:"#ffc107"}})," ",h.ticketsPendientes," pendiente",h.ticketsPendientes>1?"s":""]}):e.jsxs(e.Fragment,{children:[e.jsx(se,{style:{color:"#28a745"}})," Todo pagado"]})})]})]}),g.length>0&&e.jsxs(e.Fragment,{children:[e.jsxs("h3",{style:{margin:"0 0 1rem",color:"#333",display:"flex",alignItems:"center",gap:"0.5rem"},children:[e.jsx(R,{})," Desglose por Factura"]}),g.map(o=>{const b=o.montoOriginal-o.saldoRestante,f=o.montoOriginal>0?b/o.montoOriginal*100:0;return e.jsxs(Ze,{$estado:o.estado,children:[e.jsxs(Ke,{children:[e.jsxs("div",{children:[e.jsxs("span",{className:"ticket-title",children:["Venta #",o.idVenta]}),e.jsx(et,{$type:o.estado,style:{marginLeft:"0.75rem"},children:o.estado})]}),e.jsx("span",{className:"ticket-date",children:at(o.fecha)})]}),e.jsx(Xe,{$pct:f,children:e.jsx("div",{className:"fill",style:{width:`${Math.min(100,f)}%`}})}),e.jsxs(Qe,{children:[e.jsxs("div",{className:"stat",children:[e.jsx("span",{className:"stat-label",children:"Monto Original"}),e.jsx("span",{className:"stat-value",children:D(o.montoOriginal)})]}),e.jsxs("div",{className:"stat",children:[e.jsx("span",{className:"stat-label",children:"Pagado"}),e.jsx("span",{className:"stat-value",style:{color:"#28a745"},children:D(b)})]}),e.jsxs("div",{className:"stat",children:[e.jsx("span",{className:"stat-label",children:"Pendiente"}),e.jsx("span",{className:"stat-value",style:{color:o.saldoRestante>0?"#dc3545":"#28a745"},children:D(o.saldoRestante)})]}),e.jsxs("div",{className:"stat",children:[e.jsx("span",{className:"stat-label",children:"Progreso"}),e.jsxs("span",{className:"stat-value",children:[Math.round(f),"%"]})]})]})]},o.idVenta)})]}),e.jsx("h3",{style:{margin:"1.5rem 0 0.75rem",color:"#333"},children:"Historial Completo"}),e.jsx(tt,{children:w.length>0?w.map(o=>{const b=r.find(f=>(f.id_usuario??f.id)===o.userId);return e.jsxs(nt,{$type:o.tipo,children:[e.jsx("div",{className:"icon",children:o.tipo==="credito"?e.jsx(G,{}):e.jsx(_,{})}),e.jsxs("div",{className:"content",children:[e.jsx("span",{className:"amount",children:D(o.monto)}),e.jsx("p",{style:{margin:"2px 0"},children:o.descripcion}),e.jsxs("span",{className:"meta",children:[ot(o.fecha)," por ",e.jsx("strong",{children:(b==null?void 0:b.nombre_usuario)||"Sistema"})]})]})]},o.id)}):e.jsxs(W,{children:[e.jsx(R,{size:40}),e.jsx("p",{children:"No hay movimientos para mostrar."})]})})]})]})]}),N&&v&&e.jsx(ne,{transaction:{estado:"ABONO_CREDITO",totalVenta:v.monto,fecha:v.fecha,id:v.id.split("-")[1],clientId:t.id_cliente,userId:v.userId},creditStatus:{remainingBalance:Number(t.saldo_pendiente||0)},clients:[t],users:r,onClose:()=>p(!1)}),k&&e.jsx(Be,{statementData:k,filterType:L,onClose:()=>z(null)})]}):null}const K=a.div`
    padding: 2rem 4rem;
    background: #f8f9fa;
    min-height: 100vh;
    @media(max-width: 992px) {
        padding: 1rem;
    }
`,it=a.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    border-bottom: 2px solid #e9ecef;
    padding-bottom: 1rem;
    flex-wrap: wrap;
    gap: 1rem;
`,st=a.h1`
    font-size: 2.5rem;
    color: #343a40;
    display: flex;
    align-items: center;
    gap: 1rem;
    @media(max-width: 992px) {
        font-size: 1.8rem;
    }
`,X=a.div`
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
`,S=a.button`
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
`,lt=a(xe)`
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
`,dt=a.table`
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
`,ct=a.div`
    display: none;
    flex-direction: column;
    gap: 1rem;
    @media(max-width: 992px) {
        display: flex;
    }
`,pt=a.div`
    background: white;
    border-radius: 12px;
    padding: 1.25rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    border: 1px solid #e9ecef;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
`,mt=a.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 1px solid #f1f3f5;
    padding-bottom: 0.75rem;
    margin-bottom: 0.25rem;
`,xt=a.h3`
    font-size: 1.1rem;
    margin: 0;
    color: #343a40;
    font-weight: 700;
`,ht=a.span`
    font-size: 0.85rem;
    color: #868e96;
    display: block;
    margin-top: 4px;
`,ft=a.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
`,Q=a.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
    span.label { font-size: 0.75rem; color: #adb5bd; text-transform: uppercase; font-weight: 600; }
    span.value { font-size: 1rem; font-weight: 600; color: #495057; }
    span.balance { font-size: 1.1rem; font-weight: 700; color: ${t=>t.isDebt?"#dc3545":"#28a745"}; }
`,gt=a.div`
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
`;function kt(){var I;const{clients:t,user:y,token:m,isLoading:i,refreshClients:c,allUsers:g}=te(),{isCajaOpen:x,cajaSession:w,setCajaSession:A}=we(),[s,C]=l.useState({name:null,data:null}),[r,N]=l.useState(null),[p,v]=l.useState({open:!1,title:"",message:""}),$=l.useCallback(({title:n,message:h})=>{v({open:!0,title:n||"Aviso",message:h||""})},[]),u=l.useCallback(()=>{v({open:!1,title:"",message:""})},[]),E=async n=>{if(n.saldo_pendiente>0){O.error("El cliente tiene saldo pendiente.");return}if(window.confirm("¿Seguro de eliminar este cliente?"))try{await ve(n.id_cliente,m),O.success("Cliente eliminado correctamente."),c()}catch(h){O.error(h.message||"Error al eliminar cliente.")}},k=(n,h=null)=>C({name:n,data:h}),z=()=>C({name:null,data:null}),L=n=>`C$${Number(n||0).toFixed(2)}`,F=n=>n===null?"∞":L(n);return i?e.jsx(K,{children:e.jsx("h1",{children:"Cargando..."})}):e.jsxs(K,{children:[e.jsxs(it,{children:[e.jsxs(st,{children:[e.jsx(de,{})," Clientes y Créditos"]}),e.jsxs(X,{children:[e.jsxs(S,{primary:!0,onClick:()=>k("client"),children:[e.jsx(ce,{})," Crear Cliente"]}),e.jsxs(S,{$refresh:!0,onClick:c,children:[e.jsx(pe,{})," Recargar"]}),e.jsxs(lt,{to:"/dashboard",children:[e.jsx(me,{})," Volver"]})]})]}),e.jsxs(dt,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"ID"}),e.jsx("th",{children:"Nombre"}),e.jsx("th",{children:"Teléfono"}),e.jsx("th",{children:"Límite"}),e.jsxs("th",{children:[e.jsx(G,{})," Saldo"]}),e.jsx("th",{children:"Acciones"})]})}),e.jsx("tbody",{children:t.map(n=>e.jsxs("tr",{children:[e.jsx("td",{children:n.id_cliente}),e.jsx("td",{children:n.nombre}),e.jsx("td",{children:n.telefono||"N/A"}),e.jsx("td",{children:F(n.limite_credito)}),e.jsx("td",{style:{fontWeight:"bold",color:n.saldo_pendiente>0?"#dc3545":"#28a745"},children:L(n.saldo_pendiente)}),e.jsx("td",{children:e.jsxs(X,{children:[e.jsx(S,{$abono:!0,disabled:!x||n.saldo_pendiente<=0,onClick:()=>k("abono",n),title:"Realizar Abono",children:e.jsx(_,{})}),e.jsx(S,{onClick:()=>k("client",n),title:"Editar Cliente",children:e.jsx(J,{})}),e.jsx(S,{primary:!0,onClick:()=>k("historial",n),title:"Ver Historial",children:e.jsx(q,{})}),e.jsx(S,{$refresh:!0,style:{background:"#6f42c1"},onClick:()=>k("tickets",n),title:"Ver Tickets",children:e.jsx(_,{})}),e.jsx(S,{$delete:!0,onClick:()=>E(n),title:"Eliminar Cliente",children:e.jsx(Z,{})})]})})]},n.id_cliente))})]}),e.jsx(ct,{children:t.map(n=>e.jsxs(pt,{children:[e.jsxs(mt,{children:[e.jsxs("div",{children:[e.jsx(xt,{children:n.nombre}),e.jsxs(ht,{children:["ID: ",n.id_cliente," • ",n.telefono||"Sin Teléfono"]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"flex-end"},children:[e.jsx("span",{style:{fontSize:"0.75rem",color:"#adb5bd",fontWeight:"600"},children:"SALDO"}),e.jsx("span",{style:{fontSize:"1.2rem",fontWeight:"bold",color:n.saldo_pendiente>0?"#dc3545":"#28a745"},children:L(n.saldo_pendiente)})]})]}),e.jsxs(ft,{children:[e.jsxs(Q,{children:[e.jsx("span",{className:"label",children:"Límite Crédito"}),e.jsx("span",{className:"value",children:F(n.limite_credito)})]}),e.jsxs(Q,{children:[e.jsx("span",{className:"label",children:"Estado"}),e.jsx("span",{className:"value",style:{color:n.saldo_pendiente>0?"#e03131":"#2f9e44"},children:n.saldo_pendiente>0?"Con Deuda":"Al Día"})]})]}),e.jsxs(gt,{children:[e.jsxs(S,{$abono:!0,disabled:!x||n.saldo_pendiente<=0,onClick:()=>k("abono",n),children:[e.jsx(_,{})," Abonar"]}),e.jsxs(S,{onClick:()=>k("client",n),children:[e.jsx(J,{})," Editar"]}),e.jsxs(S,{primary:!0,onClick:()=>k("historial",n),children:[e.jsx(q,{})," Historial"]}),e.jsxs(S,{$refresh:!0,style:{background:"#6f42c1"},onClick:()=>k("tickets",n),children:[e.jsx(_,{})," Tickets"]}),e.jsxs(S,{$delete:!0,style:{gridColumn:"span 2"},onClick:()=>E(n),children:[e.jsx(Z,{})," Eliminar Cliente"]})]})]},n.id_cliente))}),s.name==="client"&&e.jsx(Fe,{client:s.data,onClose:z,onSave:c}),s.name==="abono"&&e.jsx(ke,{client:s.data,onClose:z,onAbonoSuccess:()=>{c(),O.success("Abono registrado correctamente.")},showAlert:$}),s.name==="historial"&&e.jsx(rt,{client:s.data,onClose:z,token:m}),s.name==="tickets"&&e.jsx(Se,{onClose:z,initialClientId:(I=s.data)==null?void 0:I.id_cliente,clients:t,users:g,loadSales:async n=>{try{return await Ce(m,n)}catch(h){return console.error(h),[]}},onReprintTicket:n=>{N(n)}}),r&&e.jsx(ne,{isOpen:!0,transaction:r,onClose:()=>N(null),clients:t,users:g,currentUser:y}),p.open&&e.jsx($e,{title:p.title,message:p.message,onClose:u})]})}export{kt as default};

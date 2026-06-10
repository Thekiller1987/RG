import{R as k,r as x,j as e,C as ae,x as we,a8 as ve,s as r,t as _,a9 as ke,aa as Se,W as Ce,v as Ae,X as ze,ab as me,a0 as Ie,a1 as se,$ as le,G as Fe,k as ge,ac as de,ad as Ee,Y as Pe,a5 as Ne,A as Te,m as re,ae as Oe,a6 as Re,a7 as $e}from"./vendor-Bq1Leo8N.js";import{r as De}from"./searchEngine-BMYcElFi.js";import{u as he,e as Le,h as Be,i as Me,j as We,k as _e,f as ue}from"./index-CMg5ja4A.js";import{h as qe,E as He}from"./pdf-vendor-D5JPV6N2.js";import{H as Ge}from"./scanner-vendor-DfxRpMWJ.js";const Ve=_`from { opacity: 0; } to { opacity: 1; }`,Ue=_`from { transform: scale(0.95); } to { transform: scale(1); }`,Ye=_`0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }`,ne=r.div`
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px);
    display: flex; justify-content: center; align-items: center; z-index: 1100;
    animation: ${Ve} 0.2s;
`,oe=r.div`
    background: white; padding: 2.5rem; border-radius: 24px;
    width: 95%; max-width: 680px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    animation: ${Ue} 0.3s;
    max-height: 90vh; overflow-y: auto;

    @media (max-width: 768px) {
        padding: 1rem;
        border-radius: 12px;
    }
`,W=r.button`
    padding: 1rem 1.5rem; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.2s;
    background: ${n=>n.$cancel?"#e2e8f0":"#2563eb"};
    color: ${n=>n.$cancel?"#475569":"white"};
    &:hover { background: ${n=>n.$cancel?"#cbd5e1":"#1d4ed8"}; }
    &:disabled { opacity: 0.6; cursor: not-allowed; }
`,Q=r.div`
    display: flex; justify-content: space-between; padding: 8px 0; font-size: 0.95rem;
    font-weight: ${n=>n.$bold?"bold":"normal"};
    &.grand-total { border-top: 2px solid #333; font-size: 1.1rem; margin-top: 8px; padding-top: 10px; }
    .text-right { text-align: right; }
`,ee=r(Ae)`animation: ${Ye} 1s linear infinite;`,R={NAME:"Multirepuestos RG",RUC:"1211812770001E",PHONE:"84031936 / 84058142",ADDRESS:"Del portón de la normal 75 varas al este. Juigalpa, Chontales.",SLOGAN:"Tu mejor opción en repuestos de moto y carro",LOGO_URL:"/icons/logo.png"},Qe=r.div`
    width: 100%; max-width: 650px; padding: 1.5rem; background: #fff; border-radius: 8px; display: flex; flex-direction: column; gap: 1.5rem;

    /* Estilo CLAVE para ocultar los botones al generar el PDF */
    &.proforma-to-print .footer-actions {
        display: none;
    }
    @media (max-width: 768px) { padding: 1rem; gap: 1rem; }
`,Ke=r.div`
    text-align: center; border-bottom: 2px solid #ccc; padding-bottom: 1rem;
    display: flex; flex-direction: column; align-items: center;

    .logo {
        max-width: 120px; max-height: 80px; object-fit: contain; margin-bottom: 8px;
    }
    h2 { margin: 0; font-size: 1.5rem; color: #0b72b9; }
    p { margin: 0.25rem 0; font-size: 0.9rem; }
`,Je=r.div`
    font-size: 0.9rem; color: #555; border-bottom: 1px solid #eee; padding-bottom: 1rem;
    strong { color: #333; }
    @media (max-width: 768px) { font-size: 0.8rem; }
`,Xe=r.div`
    display: flex; justify-content: space-between; padding: 0.5rem 1rem; border: 1px solid #ddd; border-radius: 4px; background-color: #f9f9f9; gap: 0.5rem; flex-wrap: wrap;
    @media (max-width: 768px) { flex-direction: column; padding: 0.5rem; gap: 0.25rem; }
`,ce=r.div`
    flex: 1 1 45%; 
    p { margin: 3px 0; font-size: 0.9rem; } 
    span { font-weight: bold; color: #000; }
    @media (max-width: 768px) { flex-basis: 100%; p { font-size: 0.85rem; } }
`,Ze=r.table`
    width: 100%; border-collapse: collapse;
    th, td { padding: 8px 12px; text-align: left; font-size: 0.95rem; border-bottom: 1px dashed #eee; }
    th { background-color: #f7f7f7; font-weight: bold; color: #333; }
    .text-right { text-align: right; }
    @media (max-width: 768px) {
        th, td { padding: 6px 8px; font-size: 0.8rem; }
        th:nth-child(2), td:nth-child(2) { max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    }
`,et=r.div`
    display: flex; justify-content: space-between; align-items: flex-start; padding-top: 1rem; gap: 1rem; flex-wrap: wrap;
    @media (max-width: 768px) { flex-direction: column; }
`,tt=r.div`
    width: 260px; max-width: 100%;
    ${Q} { padding: 4px 0; }
    ${Q}.grand-total { border-top: 2px solid #333; font-size: 1.1rem; }
`,nt=({title:n,message:f,type:g="info",onClose:d})=>{const o=()=>g==="error"?"#ef4444":g==="success"?"#10b981":"#3b82f6",m=()=>g==="error"?e.jsx(ke,{size:40,color:o()}):g==="success"?e.jsx(Se,{size:40,color:o()}):e.jsx(Ce,{size:40,color:o()});return e.jsx(ne,{style:{zIndex:2e3},children:e.jsxs(oe,{style:{maxWidth:"350px",textAlign:"center",padding:"2rem"},children:[e.jsx("div",{style:{marginBottom:"1rem"},children:m()}),e.jsx("h3",{style:{color:"#1e293b",margin:"0 0 10px 0"},children:n}),e.jsx("p",{style:{color:"#64748b",fontSize:"0.95rem",margin:"0 0 20px 0"},children:f}),e.jsx(W,{onClick:d,style:{width:"100%",padding:"12px"},children:"Entendido"})]})})},ot=({cart:n=[],total:f=0,subtotal:g=0,discount:d=0,proformaFor:o="",proformaNumber:m="",onClose:s,setTicketData:c,currentUser:z,client:y})=>{const[u,C]=k.useState(!1),q=x.useRef(null),{cajaSession:I,user:w}=he()||{},[N,F]=k.useState(!1),[K,H]=k.useState(!1),[ie,G]=k.useState([]),[T,V]=k.useState(""),[$,O]=k.useState(null),[E,D]=k.useState({isOpen:!1,title:"",message:"",type:"info"}),A=(a,j,t="info")=>{D({isOpen:!0,title:a,message:j,type:t})},U=()=>{D(a=>({...a,isOpen:!1})),E.type==="success"&&(c(),s&&s())},P=a=>new Intl.NumberFormat("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(a||0)),B=(a=>(a==null?void 0:a.usuarioNombre)||(a==null?void 0:a.nombre)||"Empleado")(z),J=(y==null?void 0:y.nombre)||o||"Consumidor Final",Z=(y==null?void 0:y.telefono)||"N/D";k.useEffect(()=>{V(`Pedido - ${J}`)},[J]);const X=async()=>{if(n.length===0)return;C(!0);const a=q.current,j=o.replace(/\s/g,"_").replace(/[^a-zA-Z0-9_]/g,""),t=m.trim()?`N${m.trim()}`:"TEMP",i=`PROFORMA_${j}_${t}.pdf`,l=a.cloneNode(!0);l.classList.add("proforma-to-print"),document.body.appendChild(l);try{const p=await qe(l,{scale:2,useCORS:!0,windowWidth:l.offsetWidth,windowHeight:l.offsetHeight}),v=p.toDataURL("image/jpeg",1),b=new He("p","mm","a4"),h=210,je=p.height*h/p.width;b.addImage(v,"JPEG",0,0,h,je),b.save(i),c()}catch(p){console.error("Error al generar PDF:",p),A("Error","❌ Error al generar y descargar el PDF.","error")}finally{document.body.contains(l)&&document.body.removeChild(l),C(!1),s&&s()}},Y=async()=>{var j,t;if(n.length===0)return;F(!0);const a=localStorage.getItem("token");try{const i=await Le(a);let l=(i==null?void 0:i.abiertas)||[];if(l.length===0&&I&&!I.closedAt){const p=((j=I.openedBy)==null?void 0:j.id)||((w==null?void 0:w.id_usuario)??(w==null?void 0:w.id)),v=((t=I.openedBy)==null?void 0:t.name)||(w==null?void 0:w.nombre_usuario)||"Cajero";l=[{id:I.id,openedAt:I.openedAt,openedBy:{id:p,name:v}}]}if(l.length===0){A("Atención","⚠️ No hay cajas abiertas en este momento. Abre una caja primero desde el POS antes de enviar el pedido.","warning"),F(!1);return}G(l),l.length>0&&O(l[0].openedBy.id),H(!0),F(!1)}catch(i){console.error("Error fetching sessions:",i),A("Error","❌ Error al buscar cajas activas.","error"),F(!1)}},M=async()=>{if(!$)return A("Atención","Seleccione una caja.","warning");if(!T.trim())return A("Atención","Ingrese un nombre para el ticket.","warning");F(!0);const a=localStorage.getItem("token");try{const j=await Be($,a)||[],t={id:Date.now(),name:T,items:n,createdAt:new Date().toISOString(),createdBy:B},l=[...Array.isArray(j)?j:[],t];await Me($,l,a),H(!1),A("Éxito",`✅ Ticket "${T}" enviado exitosamente a la caja.`,"success")}catch(j){console.error("Error sending ticket:",j),A("Error","❌ Error al enviar el ticket a la caja. Intente de nuevo.","error")}finally{F(!1)}};return e.jsxs(k.Fragment,{children:[e.jsx(ne,{style:{zIndex:K||E.isOpen?1099:1100},children:e.jsx(oe,{children:e.jsxs(Qe,{ref:q,children:[e.jsxs(Ke,{children:[e.jsx("img",{src:R.LOGO_URL,alt:"Logo del Negocio",className:"logo"}),e.jsx(ae,{size:32,style:{color:"#0b72b9",marginBottom:8}}),e.jsxs("h2",{children:["PROFORMA ",m&&`N° ${m}`]}),e.jsx("p",{children:"Documento No Válido como Factura Fiscal"})]}),e.jsxs(Je,{children:[e.jsxs("p",{style:{margin:0,fontWeight:"bold"},children:[R.NAME," - ",R.SLOGAN]}),e.jsx("p",{style:{margin:"3px 0"},children:R.ADDRESS}),e.jsxs("p",{style:{margin:0},children:["Teléfonos: ",R.PHONE,"  |  RUC: ",R.RUC]})]}),e.jsxs(Xe,{children:[e.jsxs(ce,{children:[e.jsxs("p",{children:["Emitida a: ",e.jsx("span",{children:o||"Consumidor Final"})]}),e.jsxs("p",{children:["Por: ",e.jsx("span",{children:B})]})]}),e.jsxs(ce,{children:[e.jsxs("p",{children:["Teléfono: ",e.jsx("span",{children:Z})]}),e.jsxs("p",{children:["Fecha: ",e.jsx("span",{children:new Date().toLocaleDateString("es-NI")})]})]})]}),e.jsxs(Ze,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{style:{width:"10%"},children:"CANT."}),e.jsx("th",{style:{width:"45%"},children:"DESCRIPCIÓN"}),e.jsx("th",{className:"text-right",style:{width:"25%"},children:"PRECIO UNIT."}),e.jsx("th",{className:"text-right",style:{width:"20%"},children:"TOTAL"})]})}),e.jsx("tbody",{children:n.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:"4",style:{textAlign:"center",color:"#777"},children:"No hay artículos."})}):n.map((a,j)=>{const t=parseFloat(a.precio_venta??a.precio??0),i=parseFloat(a.quantity??0);return e.jsxs("tr",{children:[e.jsx("td",{children:i}),e.jsx("td",{children:a.nombre||"Artículo sin nombre"}),e.jsxs("td",{className:"text-right",children:["C$",P(t)]}),e.jsxs("td",{className:"text-right",children:["C$",P(i*t)]})]},j)})})]}),e.jsxs(et,{children:[e.jsxs("div",{children:[e.jsx("p",{style:{fontWeight:"bold"},children:"Nota:"}),e.jsx("p",{style:{fontSize:"0.85rem"},children:R.SLOGAN}),e.jsx("p",{style:{fontSize:"0.85rem"},children:"Precios sujetos a cambios y stock."})]}),e.jsxs(tt,{children:[e.jsxs(Q,{children:[e.jsx("span",{children:"Subtotal:"}),e.jsxs("span",{className:"text-right",children:["C$",P(g)]})]}),d>0&&e.jsxs(Q,{children:[e.jsx("span",{children:"Descuento:"}),e.jsxs("span",{className:"text-right",children:["- C$",P(d)]})]}),e.jsxs(Q,{$bold:!0,className:"grand-total",children:[e.jsx("span",{children:"TOTAL:"}),e.jsxs("span",{className:"text-right",children:["C$",P(f)]})]})]})]}),e.jsxs("div",{className:"footer-actions",style:{display:"flex",gap:"1rem",marginTop:"1rem",flexWrap:"wrap"},children:[e.jsxs(W,{$cancel:!0,onClick:s,style:{flex:1},disabled:u||N,children:[e.jsx(we,{})," Cerrar"]}),e.jsxs(W,{onClick:Y,disabled:n.length===0||u||N,style:{flex:1,background:"#f59e0b"},children:[N?e.jsx(ee,{}):e.jsx(ae,{}),"ENVIAR A CAJA"]}),e.jsxs(W,{onClick:X,disabled:n.length===0||u||N,style:{flex:1,background:"#059669"},children:[u?e.jsx(ee,{}):e.jsx(ve,{}),"PDF"]})]})]})})}),K&&e.jsx(ne,{style:{zIndex:1200},children:e.jsxs(oe,{style:{maxWidth:"400px",textAlign:"center"},children:[e.jsx("h3",{style:{color:"#0f172a",marginBottom:"1rem"},children:"Enviar Pedido a Caja"}),e.jsxs("div",{style:{textAlign:"left",marginBottom:"1rem"},children:[e.jsx("label",{style:{display:"block",marginBottom:"5px",fontWeight:"bold",fontSize:"0.9rem"},children:"Nombre del Ticket:"}),e.jsx("input",{type:"text",value:T,onChange:a=>V(a.target.value),style:{width:"100%",padding:"10px",borderRadius:"8px",border:"1px solid #ccc"}})]}),e.jsxs("div",{style:{textAlign:"left",marginBottom:"1.5rem"},children:[e.jsx("label",{style:{display:"block",marginBottom:"5px",fontWeight:"bold",fontSize:"0.9rem"},children:"Seleccionar Caja:"}),e.jsx("select",{value:$||"",onChange:a=>O(a.target.value),style:{width:"100%",padding:"10px",borderRadius:"8px",border:"1px solid #ccc"},children:ie.map(a=>e.jsxs("option",{value:a.openedBy.id,children:[a.openedBy.name," - (Abierta: ",new Date(a.openedAt).toLocaleTimeString(),")"]},a.openedBy.id))})]}),e.jsxs("div",{style:{display:"flex",gap:"10px"},children:[e.jsx(W,{$cancel:!0,onClick:()=>H(!1),style:{flex:1},children:"Cancelar"}),e.jsx(W,{onClick:M,disabled:N,style:{flex:1},children:N?e.jsx(ee,{}):"Enviar Ticket"})]})]})}),E.isOpen&&e.jsx(nt,{title:E.title,message:E.message,type:E.type,onClose:U})]})},S=new Map;async function xe(n,f=4){const g=localStorage.getItem("token"),d=n.filter(s=>{const c=S.get(s);return!c||c!=="loading"&&c!=="none"});let o=0;async function m(){if(o>=d.length)return;const s=d[o++];if(S.has(s))return m();S.set(s,"loading");try{const c=await ue(s,g);S.set(s,(c==null?void 0:c.imagen)||"none")}catch{S.set(s,"none")}return m()}await Promise.all(Array.from({length:f},m))}function rt(n){const[f,g]=k.useState(()=>{const o=S.get(n);return o&&o!=="loading"&&o!=="none"?o:null}),d=k.useRef(null);return k.useEffect(()=>{const o=S.get(n);if(o&&o!=="loading"&&o!=="none"){g(o);return}if(o==="none")return;const m=setInterval(()=>{const c=S.get(n);c&&c!=="loading"&&c!=="none"?(g(c),clearInterval(m)):c==="none"&&clearInterval(m)},100),s=new IntersectionObserver(c=>{if(c[0].isIntersecting){const z=S.get(n);if(!z||z!=="loading"&&z!=="none"){const y=localStorage.getItem("token");S.set(n,"loading"),ue(n,y).then(u=>{const C=(u==null?void 0:u.imagen)||null;S.set(n,C||"none"),C&&g(C)}).catch(()=>S.set(n,"none"))}}},{rootMargin:"200px"});return d.current&&s.observe(d.current),()=>{s.disconnect(),clearInterval(m)}},[n]),{imgSrc:f,ref:d}}function it({productId:n,productName:f,onView:g}){const{imgSrc:d,ref:o}=rt(n);return e.jsxs("div",{ref:o,style:{height:160,background:"#f8fafc",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"},children:[d&&e.jsx("div",{className:"eye-icon",onClick:m=>{m.stopPropagation(),g(d)},style:{position:"absolute",top:10,left:10,zIndex:20,background:"white",borderRadius:"50%",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 6px rgba(0,0,0,0.1)",cursor:"pointer"},title:"Ver imagen",children:e.jsx(Re,{size:14,color:"#64748b"})}),d?e.jsx("img",{src:d,alt:f,style:{width:"100%",height:"100%",objectFit:"contain"}}):e.jsx($e,{size:40,color:"#e2e8f0"})]})}const at=_`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;_`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;_`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;const st=r.div`
    display: flex; height: 100vh; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); font-family: 'Inter', sans-serif; overflow: hidden;
    @media (max-width: 960px) { flex-direction: column; overflow-y: auto; height: 100vh; } 
    /* Force height 100vh on mobile to avoid double scrollbars with drawer */
`,lt=r.div`
    flex: 1; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; overflow-y: hidden;
    @media (max-width: 960px) { padding: 12px; height: 100%; overflow-y: auto; padding-bottom: 80px; /* Space for FAB */ }
`,dt=r.div`
    width: 420px; background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(16px); padding: 1.5rem; display: flex; flex-direction: column; box-shadow: -10px 0 30px rgba(0,0,0,0.03); border-left: 1px solid rgba(255,255,255,0.5); z-index: 100;
    
    @media (max-width: 960px) { 
        position: fixed; inset: 0; width: 100%; height: 100%;
        background: white; border-left: none; padding: 15px;
        transform: translateY(${n=>n.isOpen?"0":"100%"});
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        display: flex; /* Always display but hide via transform */
    }
`,ct=r.div` 
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;
`,xt=r.div`
    display: flex; gap: 10px;
`,pe=r(re.button)`
    background: white; border: 1px solid #e2e8f0; color: #64748b; padding: 8px 16px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 0.9rem;
    &:hover { background: #f8fafc; color: #334155; border-color: #cbd5e1; }
`,pt=r.div`
    background: white; padding: 1.5rem; border-radius: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); display: flex; flex-direction: column; gap: 12px; border: 1px solid #f1f5f9;
    @media (max-width: 960px) { padding: 1rem; border-radius: 16px; position: sticky; top: 0; z-index: 50; }
`,ft=r.div` display: flex; gap: 10px; `,fe=r.button`
    flex: 1; padding: 10px; border-radius: 12px; border: 1px solid ${n=>n.active?"#3b82f6":"#e2e8f0"};
    background: ${n=>n.active?"#eff6ff":"white"}; color: ${n=>n.active?"#2563eb":"#64748b"};
    font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s;
    &:hover { border-color: #3b82f6; }
`,mt=r.div`
    display: flex; align-items: center; background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 14px; padding: 0 15px; transition: all 0.2s;
    &:focus-within { border-color: #3b82f6; background: white; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
`,gt=r.input` flex: 1; padding: 12px 0; border: none; background: transparent; outline: none; font-size: 1rem; color: #1e293b; `,ht=r.div`
    display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); 
    grid-auto-rows: min-content; align-content: start;
    gap: 1.25rem; overflow-y: auto; padding-bottom: 30px; flex: 1;
    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
    @media (max-width: 768px) { grid-template-columns: repeat(2, 1fr); gap: 10px; padding-bottom: 80px; }
`,ut=r.div`
    background: white; border-radius: 18px; border: 1px solid #f1f5f9; display: flex; flex-direction: column; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; position: relative; overflow: hidden;
    &:hover { transform: translateY(-4px); border-color: #3b82f680; box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.08); .eye-icon { opacity: 1; transform: scale(1); } }
    ${n=>n.outOfStock&&Oe` opacity: 0.6; filter: grayscale(0.5); background: #f8fafc; `}
    
    @media (max-width: 768px) { border-radius: 14px; } 
    /* Mobile optimization */
`,bt=r.div`
  position: absolute; top: 10px; right: 10px; background: ${n=>n.outOfStock?"#ef4444":n.lowstock?"#f59e0b":"#10b981"};
  color: white; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 30px; z-index: 10; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  @media (max-width: 768px) { font-size: 0.65rem; padding: 3px 8px; }
`,yt=r.div` flex: 1; overflow-y: auto; margin-top: 15px; padding-right: 5px; &::-webkit-scrollbar { width: 4px; } `,jt=r.div`
    display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: white; margin-bottom: 10px; border-radius: 16px; border: 1px solid #f1f5f9;
`,wt=r.div`
    display: flex; align-items: center; gap: 10px; background: #f8fafc; padding: 6px; border-radius: 12px; border: 1px solid #f1f5f9;
`,te=r.button`
    width: 32px; height: 32px; border-radius: 10px; border: none; background: white; color: #64748b; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05); cursor: pointer; transition: all 0.2s;
    &:hover { color: #3b82f6; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
`,be=r.button`
    background: ${n=>n.bg||"#3b82f6"}; color: white; border: none; padding: 16px; border-radius: 16px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 1rem; width: 100%; transition: all 0.2s;
    &:disabled { opacity: 0.5; cursor: not-allowed; } 
    &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
`,vt=r(me)` animation: ${at} 1s linear infinite; `,ye=r.div`
  position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 5000;
`,kt=r.div`
  background: white; padding: 20px; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 90%; max-width: 500px; max-height: 90vh; overflow-y: auto; position: relative;
`,St=r(re.button)`
    display: none;
    @media (max-width: 960px) {
        display: flex; align-items: center; justify-content: space-between;
        position: fixed; bottom: 20px; left: 20px; right: 20px;
        background: #0f172a; color: white;
        padding: 16px 24px; border-radius: 16px; border: none;
        box-shadow: 0 10px 25px rgba(15, 23, 42, 0.4);
        z-index: 90; font-weight: 700; font-size: 1rem; cursor: pointer;
    }
`,Ct=({isOpen:n,imageSrc:f,onClose:g})=>!n||!f?null:e.jsx(ye,{onClick:g,children:e.jsxs(re.div,{initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},onClick:d=>d.stopPropagation(),style:{position:"relative",maxWidth:"95%",maxHeight:"90vh"},children:[e.jsx("button",{onClick:g,style:{position:"absolute",top:-15,right:-15,background:"white",width:32,height:32,borderRadius:"50%",border:"none",cursor:"pointer",boxShadow:"0 4px 10px rgba(0,0,0,0.2)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10,color:"#ef4444"},children:e.jsx(ge,{})}),e.jsx("img",{src:f,alt:"Vista Completa",style:{maxWidth:"100%",maxHeight:"85vh",borderRadius:"16px",boxShadow:"0 20px 40px rgba(0,0,0,0.3)",display:"block",background:"white",objectFit:"contain"}})]})}),At=r.div`
  width: 100%;
  height: 350px;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`,zt=r.div`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border: 40px solid rgba(0, 0, 0, 0.5); /* Semi-transparent border simulates viewport */
  border-radius: 12px;
  z-index: 10;
  pointer-events: none; /* Let clicks pass through if needed */
  &::before {
    content: '';
    position: absolute;
    top: 50%; left: 0; right: 0;
    height: 2px;
    background: #ef4444;
    box-shadow: 0 0 4px #ef4444;
    animation: scanAnimation 2s infinite ease-in-out;
  }
  @keyframes scanAnimation {
    0% { top: 10%; opacity: 0; }
    50% { opacity: 1; }
    100% { top: 90%; opacity: 0; }
  }
`,It=({onClose:n,onScan:f})=>{const g=x.useRef(null);return k.useEffect(()=>{const d="reader-custom",o=new Ge(d);g.current=o;const m=async()=>{try{await o.start({facingMode:"environment"},{fps:10,qrbox:{width:250,height:250},aspectRatio:1},s=>{o.stop().then(()=>{o.clear(),f(s)}).catch(c=>{console.error("Failed to stop scanner",c),f(s)})},s=>{})}catch(s){console.error("Error starting camera",s),alert("No se pudo iniciar la cámara. Verifique permisos."),n()}};return setTimeout(()=>m(),100),()=>{o.isScanning?o.stop().then(()=>o.clear()).catch(console.error):o.clear()}},[f,n]),e.jsx(ye,{style:{zIndex:6e3},onClick:n,children:e.jsx(kt,{onClick:d=>d.stopPropagation(),style:{padding:"0",width:"90%",maxWidth:"380px",background:"transparent",boxShadow:"none",border:"none"},children:e.jsxs("div",{style:{background:"white",borderRadius:"16px",padding:"16px",boxShadow:"0 20px 25px -5px rgba(0, 0, 0, 0.1)"},children:[e.jsx("h3",{style:{margin:"0 0 12px",textAlign:"center",fontSize:"1.2rem"},children:"Escanear Producto"}),e.jsxs(At,{children:[e.jsx("div",{id:"reader-custom",style:{width:"100%",height:"100%"}}),e.jsx(zt,{})]}),e.jsx("p",{style:{textAlign:"center",fontSize:"0.85rem",color:"#64748b",marginTop:"12px"},children:"Apunta la cámara al código de barras"}),e.jsx(be,{bg:"#ef4444",onClick:n,style:{marginTop:"15px"},children:"Cancelar"})]})})})},Ot=()=>{const{user:n,products:f}=he(),{cajaSession:g}=We(),d=localStorage.getItem("token"),[o,m]=x.useState(f||[]),[s,c]=x.useState([]),[z,y]=x.useState(""),[u,C]=x.useState("nombre"),[q,I]=x.useState(!1),[w,N]=x.useState(""),[F,K]=x.useState(""),[H,ie]=x.useState(""),[G,T]=x.useState(!1),[V,$]=x.useState(null),[O,E]=x.useState({isOpen:!1,imageUrl:null}),[D,A]=x.useState(!1),[U,P]=x.useState(!1),L=x.useRef(null);x.useEffect(()=>{f&&m(f)},[f]);const B=x.useCallback(async()=>{I(!0);try{const t=await _e(d);m(Array.isArray(t)?t:(t==null?void 0:t.data)||[])}catch(t){console.error(t)}finally{I(!1)}},[d]);x.useEffect(()=>{B()},[B]);const J=()=>{window.location.href="/dashboard"},Z=t=>{var l;if((((l=s.find(p=>p.id===t.id))==null?void 0:l.quantity)||0)>=t.existencia)return alert(`Stock máximo alcanzado (${t.existencia}).`);c(p=>p.find(b=>b.id===t.id)?p.map(b=>b.id===t.id?{...b,quantity:b.quantity+1}:b):[...p,{...t,quantity:1,precio_venta:parseFloat(t.precio_venta||t.precio||0)}])},X=(t,i)=>{c(l=>{const p=l.find(h=>h.id===t);if(!p)return l;const v=o.find(h=>h.id===t)||p,b=p.quantity+i;return b>v.existencia?(alert(`Stock máximo alcanzado (${v.existencia}).`),l):b<1?l.filter(h=>h.id!==t):l.map(h=>h.id===t?{...h,quantity:b}:h)})},Y=x.useMemo(()=>{const t=u==="codigo";return De(o,z,t?["codigo"]:["nombre","codigo"],{strict:t}).slice(0,100)},[o,z,u]);x.useEffect(()=>{xe(Y.map(t=>t.id_producto||t.id),6)},[Y]),x.useEffect(()=>{if(!o.length)return;const t=setTimeout(()=>xe(o.map(i=>i.id_producto||i.id),2),1500);return()=>clearTimeout(t)},[o]);const M=x.useMemo(()=>s.reduce((t,i)=>t+parseFloat(i.precio_venta)*i.quantity,0),[s]);x.useEffect(()=>{const t=i=>{var l;G||O.isOpen||D||U||["INPUT","TEXTAREA","SELECT"].includes((l=document.activeElement)==null?void 0:l.tagName)||i.key.length>1||i.ctrlKey||i.altKey||i.metaKey||(i.preventDefault(),u!=="codigo"?(C("codigo"),y(i.key)):y(p=>p+i.key),L.current&&L.current.focus())};return window.addEventListener("keydown",t),()=>window.removeEventListener("keydown",t)},[G,O,D,u,U]);const a=()=>{if(!w.trim())return alert("El nombre del cliente es obligatorio.");$({cart:s,total:M,subtotal:M,discount:0,proformaNumber:H,client:{nombre:w,telefono:F||"N/D"}}),T(!0)},j=t=>{t&&(C("codigo"),y(t),P(!1))};return e.jsxs(st,{children:[e.jsxs(lt,{children:[e.jsxs(ct,{children:[e.jsx("h2",{style:{margin:0,fontWeight:800,color:"#0f172a"},children:"Catálogo y Proformas"}),e.jsxs(xt,{children:[e.jsxs(pe,{onClick:J,whileHover:{x:-4},children:[e.jsx(ze,{size:14})," Regresar"]}),e.jsxs(pe,{onClick:B,disabled:q,children:[q?e.jsx(vt,{size:14}):e.jsx(me,{size:14})," Actualizar"]})]})]}),e.jsxs(pt,{children:[e.jsxs(ft,{children:[e.jsxs(fe,{active:u==="nombre",onClick:()=>{var t;C("nombre"),y(""),(t=L.current)==null||t.focus()},children:[e.jsx(Ie,{})," Nombre"]}),e.jsxs(fe,{active:u==="codigo",onClick:()=>{var t;C("codigo"),y(""),(t=L.current)==null||t.focus()},children:[e.jsx(se,{})," Código"]})]}),e.jsxs(mt,{children:[e.jsx(le,{color:"#94a3b8"}),e.jsx(gt,{ref:L,placeholder:u==="codigo"?"Escanea o escribe código...":"Escribe para buscar...",value:z,onChange:t=>y(t.target.value),autoFocus:!0}),e.jsxs("div",{onClick:()=>P(!0),style:{padding:"8px",cursor:"pointer",color:"#64748b",display:"flex",alignItems:"center",justifyContent:"center",borderLeft:"1px solid #e2e8f0",marginLeft:"5px"},title:"Usar Cámara",children:[e.jsx(se,{size:18}),e.jsx(le,{size:10,style:{marginLeft:-6,marginTop:-8}})," "]})]})]}),e.jsx(ht,{children:Y.map(t=>{var b;const i=t.id_producto||t.id,l=((b=s.find(h=>(h.id_producto||h.id)===i))==null?void 0:b.quantity)||0,p=Math.max(0,Number(t.existencia||0)-l),v=p<=0;return e.jsxs(ut,{onClick:()=>!v&&Z(t),outOfStock:v,title:t.nombre,children:[e.jsx(bt,{outOfStock:v,lowstock:p<5&&!v,children:v?"Agotado":`Stock: ${p}`}),e.jsx(it,{productId:i,productName:t.nombre,onView:h=>E({isOpen:!0,imageUrl:h})}),e.jsxs("div",{style:{padding:"12px",flex:1,display:"flex",flexDirection:"column",gap:"4px"},children:[e.jsx("div",{style:{fontWeight:600,fontSize:"0.88rem",color:"#1e293b",lineHeight:"1.25",height:"2.5rem",overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"},children:t.nombre}),e.jsx("div",{style:{fontSize:"0.78rem",color:"#94a3b8",fontWeight:600},children:t.codigo||"S/C"}),e.jsxs("div",{style:{fontWeight:800,color:"#2563eb",fontSize:"1.05rem",marginTop:"auto"},children:["C$ ",parseFloat(t.precio_venta||t.precio||0).toFixed(2)]})]})]},i)})})]}),e.jsxs(dt,{isOpen:D,children:[e.jsxs("div",{style:{marginBottom:"20px"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("h3",{style:{margin:0,fontWeight:800,display:"flex",alignItems:"center",gap:10},children:[e.jsx(Fe,{color:"#3b82f6"})," Tu Proforma"]}),e.jsx("button",{onClick:()=>A(!1),style:{display:"none",background:"#f1f5f9",border:"none",padding:"8px",borderRadius:"8px",cursor:"pointer"},className:"mobile-close-btn",children:e.jsx(ge,{})}),e.jsx("style",{children:"@media(max-width: 960px) { .mobile-close-btn { display: block !important; } }"})]}),e.jsx("input",{style:{width:"100%",padding:"12px",marginTop:15,border:"2px solid #e2e8f0",borderRadius:12,outline:"none"},placeholder:"Nombre del Cliente",value:w,onChange:t=>N(t.target.value)}),e.jsx("input",{style:{width:"100%",padding:"12px",marginTop:10,border:"2px solid #e2e8f0",borderRadius:12,outline:"none"},placeholder:"Teléfono",value:F,onChange:t=>K(t.target.value)})]}),e.jsx(yt,{children:s.length===0?e.jsxs("div",{style:{textAlign:"center",color:"#94a3b8",marginTop:40},children:[e.jsx(de,{size:48,style:{opacity:.1,marginBottom:15}}),e.jsx("p",{children:"Agrega productos"})]}):s.map(t=>e.jsxs(jt,{children:[e.jsxs("div",{style:{flex:1},children:[e.jsx("div",{style:{fontWeight:600,fontSize:"0.9rem"},children:t.nombre}),e.jsxs("div",{style:{color:"#64748b",fontSize:"0.85rem"},children:["C$ ",parseFloat(t.precio_venta).toFixed(2)]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10},children:[e.jsxs(wt,{children:[e.jsx(te,{onClick:()=>X(t.id,-1),children:e.jsx(Ee,{size:10})}),e.jsx("span",{style:{fontWeight:700},children:t.quantity}),e.jsx(te,{onClick:()=>X(t.id,1),children:e.jsx(Pe,{size:10})})]}),e.jsx(te,{onClick:()=>c(i=>i.filter(l=>l.id!==t.id)),style:{color:"#ef4444"},children:e.jsx(Ne,{})})]})]},t.id))}),e.jsxs("div",{style:{borderTop:"2px dashed #e2e8f0",paddingTop:"20px",marginTop:"auto"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"1.5rem",fontWeight:900,marginBottom:20},children:[e.jsx("span",{children:"TOTAL"}),e.jsxs("span",{children:["C$ ",M.toFixed(2)]})]}),e.jsxs(be,{onClick:a,disabled:s.length===0||!w.trim(),children:[e.jsx(de,{})," GENERAR PROFORMA PDF"]})]})]}),e.jsxs(St,{initial:{y:200},animate:{y:s.length>0?0:200},onClick:()=>A(!0),children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsx("div",{style:{background:"#3b82f6",borderRadius:"50%",width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.8rem"},children:s.reduce((t,i)=>t+i.quantity,0)}),e.jsx("span",{children:"Ver Pedido"})]}),e.jsxs("span",{children:["C$ ",M.toFixed(2)]})]}),e.jsx(Te,{children:O.isOpen&&e.jsx(Ct,{isOpen:!0,imageSrc:O.imageUrl,onClose:()=>E({isOpen:!1,imageUrl:null})})}),G&&e.jsx(ot,{...V,onClose:()=>T(!1),setTicketData:()=>c([]),currentUser:n,client:V.client}),U&&e.jsx(It,{onClose:()=>P(!1),onScan:j})]})};export{Ot as default};

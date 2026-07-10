import{R as v,r as x,j as e,C as le,x as ke,a8 as Ce,s as i,t as D,a9 as Se,aa as Ne,W as ze,v as Ae,X as Ee,ab as ge,a0 as Te,a1 as de,$ as ce,G as Ie,k as he,ac as pe,ad as Fe,Y as Pe,a5 as $e,A as Oe,m as ae,ae as _e,a6 as Re,a7 as De}from"./vendor-C4uQ3a2a.js";import{r as Le}from"./searchEngine-BMYcElFi.js";import{a as Me,u as ue,e as Be,h as We,i as qe,j as Ve,k as He,f as be}from"./index-Dpudypxm.js";import{h as Ue,E as Ge}from"./pdf-vendor-BMvqz6Um.js";import{H as Ye}from"./scanner-vendor-DfxRpMWJ.js";const Qe=D`from { opacity: 0; } to { opacity: 1; }`,Ke=D`from { transform: scale(0.95); } to { transform: scale(1); }`,Je=D`0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }`,ne=i.div`
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px);
    display: flex; justify-content: center; align-items: center; z-index: 1100;
    animation: ${Qe} 0.2s;
`,re=i.div`
    background: white; padding: 2.5rem; border-radius: 24px;
    width: 95%; max-width: 680px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    animation: ${Ke} 0.3s;
    max-height: 90vh; overflow-y: auto;

    @media (max-width: 768px) {
        padding: 1rem;
        border-radius: 12px;
    }
`,R=i.button`
    padding: 1rem 1.5rem; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.2s;
    background: ${n=>n.$cancel?"#e2e8f0":"#2563eb"};
    color: ${n=>n.$cancel?"#475569":"white"};
    &:hover { background: ${n=>n.$cancel?"#cbd5e1":"#1d4ed8"}; }
    &:disabled { opacity: 0.6; cursor: not-allowed; }
`,ee=i.div`
    display: flex; justify-content: space-between; padding: 8px 0; font-size: 0.95rem;
    font-weight: ${n=>n.$bold?"bold":"normal"};
    &.grand-total { border-top: 2px solid #333; font-size: 1.1rem; margin-top: 8px; padding-top: 10px; }
    .text-right { text-align: right; }
`,te=i(Ae)`animation: ${Je} 1s linear infinite;`,Xe=i.div`
    width: 100%;
    max-width: 650px;
    padding: 2rem;
    background: #fff;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    font-family: 'League Spartan', 'Inter', system-ui, -apple-system, sans-serif;
    color: #334155;
    box-shadow: 0 4px 20px rgba(0,0,0,.08);
    border: 1px solid #e2e8f0;

    /* Estilo CLAVE para ocultar los botones al generar el PDF */
    &.proforma-to-print .footer-actions {
        display: none;
    }
    
    @media (max-width: 768px) {
        padding: 1rem;
        gap: 1rem;
        border-radius: 8px;
    }
`,Ze=i.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 3px solid #1e3a8a;
    padding-bottom: 1.2rem;
    margin-bottom: 1rem;

    .brand-logo-container {
        width: 140px;
        display: flex;
        justify-content: flex-start;
    }
    .logo {
        max-width: 140px;
        max-height: 90px;
        width: auto;
        height: auto;
        object-fit: contain;
    }
    .brand-info {
        text-align: right;
        flex: 1;
        max-width: 65%;
    }
    .brand-info h1 {
        font-size: 20pt;
        color: #000000;
        margin: 0 0 5px 0;
        font-weight: 800;
        line-height: 1.1;
    }
    .brand-info small {
        display: block;
        font-size: 9pt;
        color: #475569;
        margin: 2px 0;
        line-height: 1.3;
    }
    .proforma-tag {
        display: inline-block;
        font-weight: 800;
        letter-spacing: 0.5px;
        padding: 4px 10px;
        border: 2px solid #0b72b9;
        border-radius: 4px;
        color: #0b72b9;
        font-size: 0.75rem;
        text-transform: uppercase;
        margin-top: 6px;
    }

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 10px;
        
        .brand-logo-container {
            justify-content: center;
        }
        .brand-info {
            text-align: center;
            max-width: 100%;
        }
        .brand-info h1 {
            font-size: 16pt;
        }
    }
`,et=i.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 0.5rem;

    .meta-col {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    .meta-title {
        font-weight: 800;
        text-transform: uppercase;
        color: #1e3a8a;
        border-bottom: 2px solid #cbd5e1;
        margin-bottom: 8px;
        padding-bottom: 4px;
        font-size: 9pt;
        display: block;
    }
    .meta-col p {
        margin: 2px 0;
        font-size: 9pt;
        display: grid;
        grid-template-columns: 100px 1fr;
        border-bottom: 1px dashed #f1f5f9;
        padding-bottom: 2px;
    }
    .meta-label {
        font-weight: 700;
        color: #475569;
    }
    .meta-value {
        color: #0f172a;
    }

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 15px;
    }
`,tt=i.table`
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #e2e8f0;
    margin-bottom: 0.5rem;

    th, td {
        padding: 10px 8px;
        text-align: left;
        font-size: 9.5pt;
    }
    th {
        background-color: #f1f5f9;
        color: #334155;
        font-weight: bold;
        border-bottom: 2px solid #cbd5e1;
        text-transform: uppercase;
        font-size: 8.5pt;
    }
    td {
        border-bottom: 1px solid #f1f5f9;
        color: #334155;
    }
    .text-right {
        text-align: right;
    }
    .col-qty {
        width: 12%;
    }
    .col-unit {
        width: 20%;
        text-align: right;
    }
    .col-total {
        width: 20%;
        text-align: right;
    }

    @media (max-width: 768px) {
        th, td {
            padding: 6px;
            font-size: 8pt;
        }
        th:nth-child(2), td:nth-child(2) {
            max-width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
`,ot=i.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1.5rem;
    
    .note-section {
        flex: 1;
        font-size: 8.5pt;
        color: #64748b;
        p {
            margin: 3px 0;
        }
        strong {
            color: #475569;
        }
    }

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 1rem;
    }
`,nt=i.div`
    width: 250px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;

    .grand-total {
        border-top: 2px solid #0f172a;
        margin-top: 4px;
        padding-top: 8px;
        font-weight: 800;
        font-size: 1.15rem;
        color: #0f172a;
    }
    .badge-container {
        text-align: center;
        margin-top: 8px;
    }
    .badge {
        display: inline-block;
        font-weight: 800;
        letter-spacing: 0.5px;
        padding: 4px 8px;
        border: 2px solid #0f172a;
        border-radius: 4px;
        color: #0f172a;
        font-size: 0.65rem;
        text-transform: uppercase;
    }

    @media (max-width: 768px) {
        width: 100%;
    }
`,rt=({title:n,message:m,type:h="info",onClose:p})=>{const a=()=>h==="error"?"#ef4444":h==="success"?"#10b981":"#3b82f6",b=()=>h==="error"?e.jsx(Se,{size:40,color:a()}):h==="success"?e.jsx(Ne,{size:40,color:a()}):e.jsx(ze,{size:40,color:a()});return e.jsx(ne,{style:{zIndex:2e3},children:e.jsxs(re,{style:{maxWidth:"350px",textAlign:"center",padding:"2rem"},children:[e.jsx("div",{style:{marginBottom:"1rem"},children:b()}),e.jsx("h3",{style:{color:"#1e293b",margin:"0 0 10px 0"},children:n}),e.jsx("p",{style:{color:"#64748b",fontSize:"0.95rem",margin:"0 0 20px 0"},children:m}),e.jsx(R,{onClick:p,style:{width:"100%",padding:"12px"},children:"Entendido"})]})})},at=({cart:n=[],total:m=0,subtotal:h=0,discount:p=0,proformaFor:a="",proformaNumber:b="",onClose:s,setTicketData:f,currentUser:y,client:w})=>{const[j,k]=v.useState(!1),L=x.useRef(null),{settings:l}=Me(),{cajaSession:S,user:N}=ue()||{},[I,P]=v.useState(!1),[H,U]=v.useState(!1),[M,G]=v.useState([]),[$,Y]=v.useState(""),[F,B]=v.useState(null),[T,W]=v.useState({isOpen:!1,title:"",message:"",type:"info"}),z=(o,d,c="info")=>{W({isOpen:!0,title:o,message:d,type:c})},q=()=>{W(o=>({...o,isOpen:!1})),T.type==="success"&&(f(),s&&s())},A=o=>new Intl.NumberFormat("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(o||0)),K=(o=>(o==null?void 0:o.usuarioNombre)||(o==null?void 0:o.nombre)||"Empleado")(y),_=(w==null?void 0:w.nombre)||a||"Consumidor Final",J=(w==null?void 0:w.telefono)||"N/D",V=v.useMemo(()=>{if(!(l!=null&&l.empresa_logo_url))return null;if(l.empresa_logo_url.startsWith("http"))return l.empresa_logo_url;let o=l.empresa_logo_url;return o.startsWith("/uploads")?o="/api"+o:o.startsWith("uploads")&&(o="/api/"+o),`${"https://sistema.multirepuestosrg.com/api".replace(/\/api$/,"")}${o.startsWith("/")?"":"/"}${o}`},[l==null?void 0:l.empresa_logo_url]),C={name:(l==null?void 0:l.empresa_nombre)||"Multirepuestos RG",ruc:(l==null?void 0:l.empresa_ruc)||"1211812770001E",phone:(l==null?void 0:l.empresa_telefono)||"84031936 / 84058142",address:(l==null?void 0:l.empresa_direccion)||"Del portón de la normal 75 varas al este. Juigalpa, Chontales.",slogan:(l==null?void 0:l.empresa_eslogan)||"Tu mejor opción en repuestos de moto y carro",logo:V||new URL("/icons/logo.png",window.location.origin).toString()};v.useEffect(()=>{Y(`Pedido - ${_}`)},[_]);const X=async()=>{if(n.length===0)return;k(!0);const o=L.current,d=_.replace(/\s/g,"_").replace(/[^a-zA-Z0-9_]/g,""),c=b.trim()?`N${b.trim()}`:"TEMP",g=`PROFORMA_${d}_${c}.pdf`,r=o.cloneNode(!0);r.classList.add("proforma-to-print");const u=r.querySelector(".footer-actions");u&&u.remove(),r.style.position="absolute",r.style.left="-9999px",r.style.top="0",r.style.width="794px",r.style.padding="40px",r.style.boxSizing="border-box",r.style.background="#ffffff",r.style.boxShadow="none",r.style.border="none",document.body.appendChild(r);try{const O=await Ue(r,{scale:2,useCORS:!0,windowWidth:794}),we=O.toDataURL("image/jpeg",1),ie=new Ge("p","mm","a4"),se=210,ve=O.height*se/O.width;ie.addImage(we,"JPEG",0,0,se,ve),ie.save(g),f()}catch(O){console.error("Error al generar PDF:",O),z("Error","❌ Error al generar y descargar el PDF.","error")}finally{document.body.contains(r)&&document.body.removeChild(r),k(!1),s&&s()}},Z=async()=>{var d,c;if(n.length===0)return;P(!0);const o=localStorage.getItem("token");try{const g=await Be(o);let r=(g==null?void 0:g.abiertas)||[];if(r.length===0&&S&&!S.closedAt){const u=((d=S.openedBy)==null?void 0:d.id)||((N==null?void 0:N.id_usuario)??(N==null?void 0:N.id)),O=((c=S.openedBy)==null?void 0:c.name)||(N==null?void 0:N.nombre_usuario)||"Cajero";r=[{id:S.id,openedAt:S.openedAt,openedBy:{id:u,name:O}}]}if(r.length===0){z("Atención","⚠️ No hay cajas abiertas en este momento. Abre una caja primero desde el POS antes de enviar el pedido.","warning"),P(!1);return}G(r),r.length>0&&B(r[0].openedBy.id),U(!0),P(!1)}catch(g){console.error("Error fetching sessions:",g),z("Error","❌ Error al buscar cajas activas.","error"),P(!1)}},t=async()=>{if(!F)return z("Atención","Seleccione una caja.","warning");if(!$.trim())return z("Atención","Ingrese un nombre para el ticket.","warning");P(!0);const o=localStorage.getItem("token");try{const d=await We(F,o)||[],c={id:Date.now(),name:$,items:n,createdAt:new Date().toISOString(),createdBy:K},r=[...Array.isArray(d)?d:[],c];await qe(F,r,o),U(!1),z("Éxito",`✅ Ticket "${$}" enviado exitosamente a la caja.`,"success")}catch(d){console.error("Error sending ticket:",d),z("Error","❌ Error al enviar el ticket a la caja. Intente de nuevo.","error")}finally{P(!1)}};return e.jsxs(v.Fragment,{children:[e.jsx(ne,{style:{zIndex:H||T.isOpen?1099:1100},children:e.jsx(re,{children:e.jsxs(Xe,{ref:L,children:[e.jsxs(Ze,{children:[e.jsx("div",{className:"brand-logo-container",children:e.jsx("img",{src:C.logo,alt:"Logo",className:"logo",onError:o=>{o.currentTarget.style.display="none"}})}),e.jsxs("div",{className:"brand-info",children:[e.jsx("h1",{children:C.name}),e.jsx("small",{children:C.slogan}),e.jsxs("small",{children:["RUC: ",C.ruc]}),e.jsxs("small",{children:["Tel: ",C.phone]}),e.jsx("small",{children:C.address}),e.jsx("div",{children:e.jsxs("span",{className:"proforma-tag",children:[e.jsx(le,{style:{marginRight:4,verticalAlign:"middle"}})," COTIZACIÓN / PROFORMA"]})})]})]}),e.jsxs(et,{children:[e.jsxs("div",{className:"meta-col",children:[e.jsx("span",{className:"meta-title",children:"Detalles"}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Fecha:"}),e.jsxs("span",{className:"meta-value",children:[new Date().toLocaleDateString("es-NI")," ",new Date().toLocaleTimeString("es-NI",{hour:"2-digit",minute:"2-digit"})]})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"ID Temp:"}),e.jsx("span",{className:"meta-value",children:Date.now().toString().slice(-6)})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Atendido por:"}),e.jsx("span",{className:"meta-value",children:K})]})]}),e.jsxs("div",{className:"meta-col",children:[e.jsx("span",{className:"meta-title",children:"Cliente"}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Nombre:"}),e.jsx("span",{className:"meta-value",children:_})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Teléfono:"}),e.jsx("span",{className:"meta-value",children:J})]})]})]}),e.jsxs(tt,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{className:"col-qty",children:"CANT."}),e.jsx("th",{children:"DESCRIPCIÓN"}),e.jsx("th",{className:"col-unit",children:"PRECIO UNIT."}),e.jsx("th",{className:"col-total",children:"TOTAL"})]})}),e.jsx("tbody",{children:n.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:"4",style:{textAlign:"center",color:"#777"},children:"No hay artículos."})}):n.map((o,d)=>{const c=parseFloat(o.precio_venta??o.precio??0),g=parseFloat(o.quantity??0);return e.jsxs("tr",{children:[e.jsx("td",{className:"col-qty",children:g}),e.jsx("td",{children:o.nombre||"Artículo sin nombre"}),e.jsxs("td",{className:"col-unit",children:["C$ ",A(c)]}),e.jsxs("td",{className:"col-total",children:["C$ ",A(g*c)]})]},d)})})]}),e.jsxs(ot,{children:[e.jsxs("div",{className:"note-section",children:[e.jsx("p",{children:e.jsx("strong",{children:"Nota:"})}),e.jsxs("p",{children:['"',C.slogan,'"']}),e.jsx("p",{children:"Precios sujetos a cambios y stock. Válido por 3 días."}),e.jsx("p",{style:{whiteSpace:"pre-line",marginTop:"5px",fontWeight:"bold"},children:(l==null?void 0:l.ticket_proforma_footer)||"¡Gracias por cotizar con nosotros!"})]}),e.jsxs(nt,{children:[e.jsxs(ee,{children:[e.jsx("span",{children:"Subtotal:"}),e.jsxs("span",{className:"text-right",children:["C$ ",A(h)]})]}),p>0&&e.jsxs(ee,{style:{color:"#dc3545"},children:[e.jsx("span",{children:"Descuento:"}),e.jsxs("span",{className:"text-right",children:["- C$ ",A(p)]})]}),e.jsxs(ee,{className:"grand-total",children:[e.jsx("span",{children:"TOTAL:"}),e.jsxs("span",{className:"text-right",children:["C$ ",A(m)]})]}),e.jsx("div",{className:"badge-container",children:e.jsx("span",{className:"badge",children:"DOCUMENTO NO VÁLIDO COMO FACTURA"})})]})]}),e.jsxs("div",{className:"footer-actions",style:{display:"flex",gap:"1rem",marginTop:"1rem",flexWrap:"wrap"},children:[e.jsxs(R,{$cancel:!0,onClick:s,style:{flex:1},disabled:j||I,children:[e.jsx(ke,{})," Cerrar"]}),e.jsxs(R,{onClick:Z,disabled:n.length===0||j||I,style:{flex:1,background:"#f59e0b"},children:[I?e.jsx(te,{}):e.jsx(le,{}),"ENVIAR A CAJA"]}),e.jsxs(R,{onClick:X,disabled:n.length===0||j||I,style:{flex:1,background:"#059669"},children:[j?e.jsx(te,{}):e.jsx(Ce,{}),"PDF"]})]})]})})}),H&&e.jsx(ne,{style:{zIndex:1200},children:e.jsxs(re,{style:{maxWidth:"400px",textAlign:"center"},children:[e.jsx("h3",{style:{color:"#0f172a",marginBottom:"1rem"},children:"Enviar Pedido a Caja"}),e.jsxs("div",{style:{textAlign:"left",marginBottom:"1rem"},children:[e.jsx("label",{style:{display:"block",marginBottom:"5px",fontWeight:"bold",fontSize:"0.9rem"},children:"Nombre del Ticket:"}),e.jsx("input",{type:"text",value:$,onChange:o=>Y(o.target.value),style:{width:"100%",padding:"10px",borderRadius:"8px",border:"1px solid #ccc"}})]}),e.jsxs("div",{style:{textAlign:"left",marginBottom:"1.5rem"},children:[e.jsx("label",{style:{display:"block",marginBottom:"5px",fontWeight:"bold",fontSize:"0.9rem"},children:"Seleccionar Caja:"}),e.jsx("select",{value:F||"",onChange:o=>B(o.target.value),style:{width:"100%",padding:"10px",borderRadius:"8px",border:"1px solid #ccc"},children:M.map(o=>e.jsxs("option",{value:o.openedBy.id,children:[o.openedBy.name," - (Abierta: ",new Date(o.openedAt).toLocaleTimeString(),")"]},o.openedBy.id))})]}),e.jsxs("div",{style:{display:"flex",gap:"10px"},children:[e.jsx(R,{$cancel:!0,onClick:()=>U(!1),style:{flex:1},children:"Cancelar"}),e.jsx(R,{onClick:t,disabled:I,style:{flex:1},children:I?e.jsx(te,{}):"Enviar Ticket"})]})]})}),T.isOpen&&e.jsx(rt,{title:T.title,message:T.message,type:T.type,onClose:q})]})},E=new Map;async function xe(n,m=4){const h=localStorage.getItem("token"),p=n.filter(s=>{const f=E.get(s);return!f||f!=="loading"&&f!=="none"});let a=0;async function b(){if(a>=p.length)return;const s=p[a++];if(E.has(s))return b();E.set(s,"loading");try{const f=await be(s,h),y=(f==null?void 0:f.imagen)||"none";E.set(s,y),window.dispatchEvent(new CustomEvent(`image_loaded_${s}`,{detail:y}))}catch{E.set(s,"none"),window.dispatchEvent(new CustomEvent(`image_loaded_${s}`,{detail:"none"}))}return b()}await Promise.all(Array.from({length:m},b))}function it(n){const[m,h]=v.useState(()=>{const a=E.get(n);return a&&a!=="loading"&&a!=="none"?a:null}),p=v.useRef(null);return v.useEffect(()=>{const a=E.get(n);if(a&&a!=="loading"&&a!=="none"){h(a);return}if(a==="none")return;const b=f=>{const y=f.detail;y&&y!=="none"&&h(y)};window.addEventListener(`image_loaded_${n}`,b);const s=new IntersectionObserver(f=>{if(f[0].isIntersecting){const y=E.get(n);if(!y||y!=="loading"&&y!=="none"){const w=localStorage.getItem("token");E.set(n,"loading"),be(n,w).then(j=>{const k=(j==null?void 0:j.imagen)||"none";E.set(n,k),k!=="none"&&h(k),window.dispatchEvent(new CustomEvent(`image_loaded_${n}`,{detail:k}))}).catch(()=>{E.set(n,"none"),window.dispatchEvent(new CustomEvent(`image_loaded_${n}`,{detail:"none"}))})}}},{rootMargin:"200px"});return p.current&&s.observe(p.current),()=>{s.disconnect(),window.removeEventListener(`image_loaded_${n}`,b)}},[n]),{imgSrc:m,ref:p}}function st({productId:n,productName:m,onView:h}){const{imgSrc:p,ref:a}=it(n);return e.jsxs("div",{ref:a,style:{height:160,background:"#f8fafc",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"},children:[p&&e.jsx("div",{className:"eye-icon",onClick:b=>{b.stopPropagation(),h(p)},style:{position:"absolute",top:10,left:10,zIndex:20,background:"white",borderRadius:"50%",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 6px rgba(0,0,0,0.1)",cursor:"pointer"},title:"Ver imagen",children:e.jsx(Re,{size:14,color:"#64748b"})}),p?e.jsx("img",{src:p,alt:m,style:{width:"100%",height:"100%",objectFit:"contain"}}):e.jsx(De,{size:40,color:"#e2e8f0"})]})}const lt=D`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;D`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;D`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;const dt=i.div`
    display: flex; height: 100vh; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); font-family: 'Inter', sans-serif; overflow: hidden;
    @media (max-width: 960px) { flex-direction: column; overflow-y: auto; height: 100vh; } 
    /* Force height 100vh on mobile to avoid double scrollbars with drawer */
`,ct=i.div`
    flex: 1; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; overflow-y: hidden;
    @media (max-width: 960px) { padding: 12px; height: 100%; overflow-y: auto; padding-bottom: 80px; /* Space for FAB */ }
`,pt=i.div`
    width: 420px; background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(16px); padding: 1.5rem; display: flex; flex-direction: column; box-shadow: -10px 0 30px rgba(0,0,0,0.03); border-left: 1px solid rgba(255,255,255,0.5); z-index: 100;
    
    @media (max-width: 960px) { 
        position: fixed; inset: 0; width: 100%; height: 100%;
        background: white; border-left: none; padding: 15px;
        transform: translateY(${n=>n.isOpen?"0":"100%"});
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        display: flex; /* Always display but hide via transform */
    }
`,xt=i.div` 
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;
`,mt=i.div`
    display: flex; gap: 10px;
`,me=i(ae.button)`
    background: white; border: 1px solid #e2e8f0; color: #64748b; padding: 8px 16px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 0.9rem;
    &:hover { background: #f8fafc; color: #334155; border-color: #cbd5e1; }
`,ft=i.div`
    background: white; padding: 1.5rem; border-radius: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); display: flex; flex-direction: column; gap: 12px; border: 1px solid #f1f5f9;
    @media (max-width: 960px) { padding: 1rem; border-radius: 16px; position: sticky; top: 0; z-index: 50; }
`,gt=i.div` display: flex; gap: 10px; `,fe=i.button`
    flex: 1; padding: 10px; border-radius: 12px; border: 1px solid ${n=>n.active?"#3b82f6":"#e2e8f0"};
    background: ${n=>n.active?"#eff6ff":"white"}; color: ${n=>n.active?"#2563eb":"#64748b"};
    font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s;
    &:hover { border-color: #3b82f6; }
`,ht=i.div`
    display: flex; align-items: center; background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 14px; padding: 0 15px; transition: all 0.2s;
    &:focus-within { border-color: #3b82f6; background: white; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
`,ut=i.input` flex: 1; padding: 12px 0; border: none; background: transparent; outline: none; font-size: 1rem; color: #1e293b; `,bt=i.div`
    display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); 
    grid-auto-rows: min-content; align-content: start;
    gap: 1.25rem; overflow-y: auto; padding-bottom: 30px; flex: 1;
    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
    @media (max-width: 768px) { grid-template-columns: repeat(2, 1fr); gap: 10px; padding-bottom: 80px; }
`,yt=i.div`
    background: white; border-radius: 18px; border: 1px solid #f1f5f9; display: flex; flex-direction: column; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; position: relative; overflow: hidden;
    &:hover { transform: translateY(-4px); border-color: #3b82f680; box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.08); .eye-icon { opacity: 1; transform: scale(1); } }
    ${n=>n.outOfStock&&_e` opacity: 0.6; filter: grayscale(0.5); background: #f8fafc; `}
    
    @media (max-width: 768px) { border-radius: 14px; } 
    /* Mobile optimization */
`,jt=i.div`
  position: absolute; top: 10px; right: 10px; background: ${n=>n.outOfStock?"#ef4444":n.lowstock?"#f59e0b":"#10b981"};
  color: white; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 30px; z-index: 10; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  @media (max-width: 768px) { font-size: 0.65rem; padding: 3px 8px; }
`,wt=i.div` flex: 1; overflow-y: auto; margin-top: 15px; padding-right: 5px; &::-webkit-scrollbar { width: 4px; } `,vt=i.div`
    display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: white; margin-bottom: 10px; border-radius: 16px; border: 1px solid #f1f5f9;
`,kt=i.div`
    display: flex; align-items: center; gap: 10px; background: #f8fafc; padding: 6px; border-radius: 12px; border: 1px solid #f1f5f9;
`,oe=i.button`
    width: 32px; height: 32px; border-radius: 10px; border: none; background: white; color: #64748b; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05); cursor: pointer; transition: all 0.2s;
    &:hover { color: #3b82f6; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
`,ye=i.button`
    background: ${n=>n.bg||"#3b82f6"}; color: white; border: none; padding: 16px; border-radius: 16px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 1rem; width: 100%; transition: all 0.2s;
    &:disabled { opacity: 0.5; cursor: not-allowed; } 
    &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
`,Ct=i(ge)` animation: ${lt} 1s linear infinite; `,je=i.div`
  position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 5000;
`,St=i.div`
  background: white; padding: 20px; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 90%; max-width: 500px; max-height: 90vh; overflow-y: auto; position: relative;
`,Nt=i(ae.button)`
    display: none;
    @media (max-width: 960px) {
        display: flex; align-items: center; justify-content: space-between;
        position: fixed; bottom: 20px; left: 20px; right: 20px;
        background: #0f172a; color: white;
        padding: 16px 24px; border-radius: 16px; border: none;
        box-shadow: 0 10px 25px rgba(15, 23, 42, 0.4);
        z-index: 90; font-weight: 700; font-size: 1rem; cursor: pointer;
    }
`,zt=({isOpen:n,imageSrc:m,onClose:h})=>!n||!m?null:e.jsx(je,{onClick:h,children:e.jsxs(ae.div,{initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},onClick:p=>p.stopPropagation(),style:{position:"relative",maxWidth:"95%",maxHeight:"90vh"},children:[e.jsx("button",{onClick:h,style:{position:"absolute",top:-15,right:-15,background:"white",width:32,height:32,borderRadius:"50%",border:"none",cursor:"pointer",boxShadow:"0 4px 10px rgba(0,0,0,0.2)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10,color:"#ef4444"},children:e.jsx(he,{})}),e.jsx("img",{src:m,alt:"Vista Completa",style:{maxWidth:"100%",maxHeight:"85vh",borderRadius:"16px",boxShadow:"0 20px 40px rgba(0,0,0,0.3)",display:"block",background:"white",objectFit:"contain"}})]})}),At=i.div`
  width: 100%;
  height: 350px;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`,Et=i.div`
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
`,Tt=({onClose:n,onScan:m})=>{const h=x.useRef(null);return v.useEffect(()=>{const p="reader-custom",a=new Ye(p);h.current=a;const b=async()=>{try{await a.start({facingMode:"environment"},{fps:10,qrbox:{width:250,height:250},aspectRatio:1},s=>{a.stop().then(()=>{a.clear(),m(s)}).catch(f=>{console.error("Failed to stop scanner",f),m(s)})},s=>{})}catch(s){console.error("Error starting camera",s),alert("No se pudo iniciar la cámara. Verifique permisos."),n()}};return setTimeout(()=>b(),100),()=>{a.isScanning?a.stop().then(()=>a.clear()).catch(console.error):a.clear()}},[m,n]),e.jsx(je,{style:{zIndex:6e3},onClick:n,children:e.jsx(St,{onClick:p=>p.stopPropagation(),style:{padding:"0",width:"90%",maxWidth:"380px",background:"transparent",boxShadow:"none",border:"none"},children:e.jsxs("div",{style:{background:"white",borderRadius:"16px",padding:"16px",boxShadow:"0 20px 25px -5px rgba(0, 0, 0, 0.1)"},children:[e.jsx("h3",{style:{margin:"0 0 12px",textAlign:"center",fontSize:"1.2rem"},children:"Escanear Producto"}),e.jsxs(At,{children:[e.jsx("div",{id:"reader-custom",style:{width:"100%",height:"100%"}}),e.jsx(Et,{})]}),e.jsx("p",{style:{textAlign:"center",fontSize:"0.85rem",color:"#64748b",marginTop:"12px"},children:"Apunta la cámara al código de barras"}),e.jsx(ye,{bg:"#ef4444",onClick:n,style:{marginTop:"15px"},children:"Cancelar"})]})})})},_t=()=>{const{user:n,products:m}=ue(),{cajaSession:h}=Ve(),p=localStorage.getItem("token"),[a,b]=x.useState(m||[]),[s,f]=x.useState([]),[y,w]=x.useState(""),[j,k]=x.useState("nombre"),[L,l]=x.useState(!1),[S,N]=x.useState(""),[I,P]=x.useState(""),[H,U]=x.useState(""),[M,G]=x.useState(!1),[$,Y]=x.useState(null),[F,B]=x.useState({isOpen:!1,imageUrl:null}),[T,W]=x.useState(!1),[z,q]=x.useState(!1),A=x.useRef(null);x.useEffect(()=>{m&&b(m)},[m]);const Q=x.useCallback(async()=>{l(!0);try{const t=await He(p);b(Array.isArray(t)?t:(t==null?void 0:t.data)||[])}catch(t){console.error(t)}finally{l(!1)}},[p]);x.useEffect(()=>{Q()},[Q]);const K=()=>{window.location.href="/dashboard"},_=t=>{var d;if((((d=s.find(c=>c.id===t.id))==null?void 0:d.quantity)||0)>=t.existencia)return alert(`Stock máximo alcanzado (${t.existencia}).`);f(c=>c.find(r=>r.id===t.id)?c.map(r=>r.id===t.id?{...r,quantity:r.quantity+1}:r):[...c,{...t,quantity:1,precio_venta:parseFloat(t.precio_venta||t.precio||0)}])},J=(t,o)=>{f(d=>{const c=d.find(u=>u.id===t);if(!c)return d;const g=a.find(u=>u.id===t)||c,r=c.quantity+o;return r>g.existencia?(alert(`Stock máximo alcanzado (${g.existencia}).`),d):r<1?d.filter(u=>u.id!==t):d.map(u=>u.id===t?{...u,quantity:r}:u)})},V=x.useMemo(()=>{const t=j==="codigo";return Le(a,y,t?["codigo"]:["nombre","codigo"],{strict:t}).slice(0,100)},[a,y,j]);x.useEffect(()=>{xe(V.map(t=>t.id_producto||t.id),6)},[V]),x.useEffect(()=>{if(!a.length)return;const t=setTimeout(()=>xe(a.map(o=>o.id_producto||o.id),2),1500);return()=>clearTimeout(t)},[a]);const C=x.useMemo(()=>s.reduce((t,o)=>t+parseFloat(o.precio_venta)*o.quantity,0),[s]);x.useEffect(()=>{const t=o=>{var d;M||F.isOpen||T||z||["INPUT","TEXTAREA","SELECT"].includes((d=document.activeElement)==null?void 0:d.tagName)||o.key.length>1||o.ctrlKey||o.altKey||o.metaKey||(o.preventDefault(),j!=="codigo"?(k("codigo"),w(o.key)):w(c=>c+o.key),A.current&&A.current.focus())};return window.addEventListener("keydown",t),()=>window.removeEventListener("keydown",t)},[M,F,T,j,z]);const X=()=>{if(!S.trim())return alert("El nombre del cliente es obligatorio.");Y({cart:s,total:C,subtotal:C,discount:0,proformaNumber:H,client:{nombre:S,telefono:I||"N/D"}}),G(!0)},Z=t=>{t&&(k("codigo"),w(t),q(!1))};return e.jsxs(dt,{children:[e.jsxs(ct,{children:[e.jsxs(xt,{children:[e.jsx("h2",{style:{margin:0,fontWeight:800,color:"#0f172a"},children:"Catálogo y Proformas"}),e.jsxs(mt,{children:[e.jsxs(me,{onClick:K,whileHover:{x:-4},children:[e.jsx(Ee,{size:14})," Regresar"]}),e.jsxs(me,{onClick:Q,disabled:L,children:[L?e.jsx(Ct,{size:14}):e.jsx(ge,{size:14})," Actualizar"]})]})]}),e.jsxs(ft,{children:[e.jsxs(gt,{children:[e.jsxs(fe,{active:j==="nombre",onClick:()=>{var t;k("nombre"),w(""),(t=A.current)==null||t.focus()},children:[e.jsx(Te,{})," Nombre"]}),e.jsxs(fe,{active:j==="codigo",onClick:()=>{var t;k("codigo"),w(""),(t=A.current)==null||t.focus()},children:[e.jsx(de,{})," Código"]})]}),e.jsxs(ht,{children:[e.jsx(ce,{color:"#94a3b8"}),e.jsx(ut,{ref:A,placeholder:j==="codigo"?"Escanea o escribe código...":"Escribe para buscar...",value:y,onChange:t=>w(t.target.value),autoFocus:!0}),e.jsxs("div",{onClick:()=>q(!0),style:{padding:"8px",cursor:"pointer",color:"#64748b",display:"flex",alignItems:"center",justifyContent:"center",borderLeft:"1px solid #e2e8f0",marginLeft:"5px"},title:"Usar Cámara",children:[e.jsx(de,{size:18}),e.jsx(ce,{size:10,style:{marginLeft:-6,marginTop:-8}})," "]})]})]}),e.jsx(bt,{children:V.map(t=>{var r;const o=t.id_producto||t.id,d=((r=s.find(u=>(u.id_producto||u.id)===o))==null?void 0:r.quantity)||0,c=Math.max(0,Number(t.existencia||0)-d),g=c<=0;return e.jsxs(yt,{onClick:()=>!g&&_(t),outOfStock:g,title:t.nombre,children:[e.jsx(jt,{outOfStock:g,lowstock:c<5&&!g,children:g?"Agotado":`Stock: ${c}`}),e.jsx(st,{productId:o,productName:t.nombre,onView:u=>B({isOpen:!0,imageUrl:u})}),e.jsxs("div",{style:{padding:"12px",flex:1,display:"flex",flexDirection:"column",gap:"4px"},children:[e.jsx("div",{style:{fontWeight:600,fontSize:"0.88rem",color:"#1e293b",lineHeight:"1.25",height:"2.5rem",overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"},children:t.nombre}),e.jsx("div",{style:{fontSize:"0.78rem",color:"#94a3b8",fontWeight:600},children:t.codigo||"S/C"}),e.jsxs("div",{style:{fontWeight:800,color:"#2563eb",fontSize:"1.05rem",marginTop:"auto"},children:["C$ ",parseFloat(t.precio_venta||t.precio||0).toFixed(2)]})]})]},o)})})]}),e.jsxs(pt,{isOpen:T,children:[e.jsxs("div",{style:{marginBottom:"20px"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("h3",{style:{margin:0,fontWeight:800,display:"flex",alignItems:"center",gap:10},children:[e.jsx(Ie,{color:"#3b82f6"})," Tu Proforma"]}),e.jsx("button",{onClick:()=>W(!1),style:{display:"none",background:"#f1f5f9",border:"none",padding:"8px",borderRadius:"8px",cursor:"pointer"},className:"mobile-close-btn",children:e.jsx(he,{})}),e.jsx("style",{children:"@media(max-width: 960px) { .mobile-close-btn { display: block !important; } }"})]}),e.jsx("input",{style:{width:"100%",padding:"12px",marginTop:15,border:"2px solid #e2e8f0",borderRadius:12,outline:"none"},placeholder:"Nombre del Cliente",value:S,onChange:t=>N(t.target.value)}),e.jsx("input",{style:{width:"100%",padding:"12px",marginTop:10,border:"2px solid #e2e8f0",borderRadius:12,outline:"none"},placeholder:"Teléfono",value:I,onChange:t=>P(t.target.value.replace(/\D/g,""))})]}),e.jsx(wt,{children:s.length===0?e.jsxs("div",{style:{textAlign:"center",color:"#94a3b8",marginTop:40},children:[e.jsx(pe,{size:48,style:{opacity:.1,marginBottom:15}}),e.jsx("p",{children:"Agrega productos"})]}):s.map(t=>e.jsxs(vt,{children:[e.jsxs("div",{style:{flex:1},children:[e.jsx("div",{style:{fontWeight:600,fontSize:"0.9rem"},children:t.nombre}),e.jsxs("div",{style:{color:"#64748b",fontSize:"0.85rem"},children:["C$ ",parseFloat(t.precio_venta).toFixed(2)]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10},children:[e.jsxs(kt,{children:[e.jsx(oe,{onClick:()=>J(t.id,-1),children:e.jsx(Fe,{size:10})}),e.jsx("span",{style:{fontWeight:700},children:t.quantity}),e.jsx(oe,{onClick:()=>J(t.id,1),children:e.jsx(Pe,{size:10})})]}),e.jsx(oe,{onClick:()=>f(o=>o.filter(d=>d.id!==t.id)),style:{color:"#ef4444"},children:e.jsx($e,{})})]})]},t.id))}),e.jsxs("div",{style:{borderTop:"2px dashed #e2e8f0",paddingTop:"20px",marginTop:"auto"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"1.5rem",fontWeight:900,marginBottom:20},children:[e.jsx("span",{children:"TOTAL"}),e.jsxs("span",{children:["C$ ",C.toFixed(2)]})]}),e.jsxs(ye,{onClick:X,disabled:s.length===0||!S.trim(),children:[e.jsx(pe,{})," GENERAR PROFORMA PDF"]})]})]}),e.jsxs(Nt,{initial:{y:200},animate:{y:s.length>0?0:200},onClick:()=>W(!0),children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsx("div",{style:{background:"#3b82f6",borderRadius:"50%",width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.8rem"},children:s.reduce((t,o)=>t+o.quantity,0)}),e.jsx("span",{children:"Ver Pedido"})]}),e.jsxs("span",{children:["C$ ",C.toFixed(2)]})]}),e.jsx(Oe,{children:F.isOpen&&e.jsx(zt,{isOpen:!0,imageSrc:F.imageUrl,onClose:()=>B({isOpen:!1,imageUrl:null})})}),M&&e.jsx(at,{...$,onClose:()=>G(!1),setTicketData:()=>f([]),currentUser:n,client:$.client}),z&&e.jsx(Tt,{onClose:()=>q(!1),onScan:Z})]})};export{_t as default};

import{R as v,r as x,j as e,C as se,x as we,a8 as ve,s as r,t as _,a9 as ke,aa as Ce,W as Se,v as Ne,X as ze,ab as fe,a0 as Ae,a1 as le,$ as de,G as Ee,k as ge,ac as ce,ad as Te,Y as Ie,a5 as Fe,A as Pe,m as ae,ae as Oe,a6 as $e,a7 as Re}from"./vendor-C4uQ3a2a.js";import{r as De}from"./searchEngine-BMYcElFi.js";import{a as _e,u as he,e as Le,h as Me,i as Be,j as We,k as qe,f as ue}from"./index-_bKFznHk.js";import{h as Ve,E as He}from"./pdf-vendor-BMvqz6Um.js";import{H as Ge}from"./scanner-vendor-DfxRpMWJ.js";const Ue=_`from { opacity: 0; } to { opacity: 1; }`,Ye=_`from { transform: scale(0.95); } to { transform: scale(1); }`,Qe=_`0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }`,oe=r.div`
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px);
    display: flex; justify-content: center; align-items: center; z-index: 1100;
    animation: ${Ue} 0.2s;
`,ne=r.div`
    background: white; padding: 2.5rem; border-radius: 24px;
    width: 95%; max-width: 680px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    animation: ${Ye} 0.3s;
    max-height: 90vh; overflow-y: auto;

    @media (max-width: 768px) {
        padding: 1rem;
        border-radius: 12px;
    }
`,D=r.button`
    padding: 1rem 1.5rem; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.2s;
    background: ${o=>o.$cancel?"#e2e8f0":"#2563eb"};
    color: ${o=>o.$cancel?"#475569":"white"};
    &:hover { background: ${o=>o.$cancel?"#cbd5e1":"#1d4ed8"}; }
    &:disabled { opacity: 0.6; cursor: not-allowed; }
`,Z=r.div`
    display: flex; justify-content: space-between; padding: 8px 0; font-size: 0.95rem;
    font-weight: ${o=>o.$bold?"bold":"normal"};
    &.grand-total { border-top: 2px solid #333; font-size: 1.1rem; margin-top: 8px; padding-top: 10px; }
    .text-right { text-align: right; }
`,ee=r(Ne)`animation: ${Qe} 1s linear infinite;`,Ke=r.div`
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
`,Je=r.div`
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
        width: 130px;
        height: auto;
        max-height: 90px;
        object-fit: contain;
    }
    .brand-info {
        text-align: right;
        flex: 1;
        max-width: 65%;
    }
    .brand-info h1 {
        font-size: 20pt;
        color: #1e3a8a;
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
`,Xe=r.div`
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
`,Ze=r.table`
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
`,et=r.div`
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
`,tt=r.div`
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
`,ot=({title:o,message:m,type:h="info",onClose:c})=>{const a=()=>h==="error"?"#ef4444":h==="success"?"#10b981":"#3b82f6",u=()=>h==="error"?e.jsx(ke,{size:40,color:a()}):h==="success"?e.jsx(Ce,{size:40,color:a()}):e.jsx(Se,{size:40,color:a()});return e.jsx(oe,{style:{zIndex:2e3},children:e.jsxs(ne,{style:{maxWidth:"350px",textAlign:"center",padding:"2rem"},children:[e.jsx("div",{style:{marginBottom:"1rem"},children:u()}),e.jsx("h3",{style:{color:"#1e293b",margin:"0 0 10px 0"},children:o}),e.jsx("p",{style:{color:"#64748b",fontSize:"0.95rem",margin:"0 0 20px 0"},children:m}),e.jsx(D,{onClick:c,style:{width:"100%",padding:"12px"},children:"Entendido"})]})})},nt=({cart:o=[],total:m=0,subtotal:h=0,discount:c=0,proformaFor:a="",proformaNumber:u="",onClose:i,setTicketData:f,currentUser:y,client:w})=>{const[j,k]=v.useState(!1),L=x.useRef(null),{settings:p}=_e(),{cajaSession:C,user:S}=he()||{},[I,P]=v.useState(!1),[V,H]=v.useState(!1),[M,G]=v.useState([]),[O,U]=v.useState(""),[F,B]=v.useState(null),[T,W]=v.useState({isOpen:!1,title:"",message:"",type:"info"}),N=(t,n,l="info")=>{W({isOpen:!0,title:t,message:n,type:l})},q=()=>{W(t=>({...t,isOpen:!1})),T.type==="success"&&(f(),i&&i())},z=t=>new Intl.NumberFormat("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(t||0)),Q=(t=>(t==null?void 0:t.usuarioNombre)||(t==null?void 0:t.nombre)||"Empleado")(y),$=(w==null?void 0:w.nombre)||a||"Consumidor Final",K=(w==null?void 0:w.telefono)||"N/D",A={name:(p==null?void 0:p.empresa_nombre)||"Multirepuestos RG",ruc:(p==null?void 0:p.empresa_ruc)||"1211812770001E",phone:(p==null?void 0:p.empresa_telefono)||"84031936 / 84058142",address:(p==null?void 0:p.empresa_direccion)||"Del portón de la normal 75 varas al este. Juigalpa, Chontales.",slogan:(p==null?void 0:p.empresa_eslogan)||"Tu mejor opción en repuestos de moto y carro",logo:(p==null?void 0:p.empresa_logo_url)||new URL("/icons/logo.png",window.location.origin).toString()};v.useEffect(()=>{U(`Pedido - ${$}`)},[$]);const R=async()=>{if(o.length===0)return;k(!0);const t=L.current,n=$.replace(/\s/g,"_").replace(/[^a-zA-Z0-9_]/g,""),l=u.trim()?`N${u.trim()}`:"TEMP",d=`PROFORMA_${n}_${l}.pdf`,s=t.cloneNode(!0);s.classList.add("proforma-to-print"),s.style.position="absolute",s.style.left="-9999px",s.style.top="0",s.style.width="794px",s.style.padding="40px",s.style.boxSizing="border-box",s.style.background="#ffffff",s.style.boxShadow="none",s.style.border="none",document.body.appendChild(s);try{const g=await Ve(s,{scale:2,useCORS:!0,windowWidth:794}),b=g.toDataURL("image/jpeg",1),re=new He("p","mm","a4"),ie=210,je=g.height*ie/g.width;re.addImage(b,"JPEG",0,0,ie,je),re.save(d),f()}catch(g){console.error("Error al generar PDF:",g),N("Error","❌ Error al generar y descargar el PDF.","error")}finally{document.body.contains(s)&&document.body.removeChild(s),k(!1),i&&i()}},J=async()=>{var n,l;if(o.length===0)return;P(!0);const t=localStorage.getItem("token");try{const d=await Le(t);let s=(d==null?void 0:d.abiertas)||[];if(s.length===0&&C&&!C.closedAt){const g=((n=C.openedBy)==null?void 0:n.id)||((S==null?void 0:S.id_usuario)??(S==null?void 0:S.id)),b=((l=C.openedBy)==null?void 0:l.name)||(S==null?void 0:S.nombre_usuario)||"Cajero";s=[{id:C.id,openedAt:C.openedAt,openedBy:{id:g,name:b}}]}if(s.length===0){N("Atención","⚠️ No hay cajas abiertas en este momento. Abre una caja primero desde el POS antes de enviar el pedido.","warning"),P(!1);return}G(s),s.length>0&&B(s[0].openedBy.id),H(!0),P(!1)}catch(d){console.error("Error fetching sessions:",d),N("Error","❌ Error al buscar cajas activas.","error"),P(!1)}},X=async()=>{if(!F)return N("Atención","Seleccione una caja.","warning");if(!O.trim())return N("Atención","Ingrese un nombre para el ticket.","warning");P(!0);const t=localStorage.getItem("token");try{const n=await Me(F,t)||[],l={id:Date.now(),name:O,items:o,createdAt:new Date().toISOString(),createdBy:Q},s=[...Array.isArray(n)?n:[],l];await Be(F,s,t),H(!1),N("Éxito",`✅ Ticket "${O}" enviado exitosamente a la caja.`,"success")}catch(n){console.error("Error sending ticket:",n),N("Error","❌ Error al enviar el ticket a la caja. Intente de nuevo.","error")}finally{P(!1)}};return e.jsxs(v.Fragment,{children:[e.jsx(oe,{style:{zIndex:V||T.isOpen?1099:1100},children:e.jsx(ne,{children:e.jsxs(Ke,{ref:L,children:[e.jsxs(Je,{children:[e.jsx("div",{className:"brand-logo-container",children:e.jsx("img",{src:A.logo,alt:"Logo",className:"logo",onError:t=>{t.currentTarget.style.display="none"}})}),e.jsxs("div",{className:"brand-info",children:[e.jsx("h1",{children:A.name}),e.jsx("small",{children:A.slogan}),e.jsxs("small",{children:["RUC: ",A.ruc]}),e.jsxs("small",{children:["Tel: ",A.phone]}),e.jsx("small",{children:A.address}),e.jsx("div",{children:e.jsxs("span",{className:"proforma-tag",children:[e.jsx(se,{style:{marginRight:4,verticalAlign:"middle"}})," COTIZACIÓN / PROFORMA"]})})]})]}),e.jsxs(Xe,{children:[e.jsxs("div",{className:"meta-col",children:[e.jsx("span",{className:"meta-title",children:"Detalles"}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Fecha:"}),e.jsxs("span",{className:"meta-value",children:[new Date().toLocaleDateString("es-NI")," ",new Date().toLocaleTimeString("es-NI",{hour:"2-digit",minute:"2-digit"})]})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"ID Temp:"}),e.jsx("span",{className:"meta-value",children:Date.now().toString().slice(-6)})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Atendido por:"}),e.jsx("span",{className:"meta-value",children:Q})]})]}),e.jsxs("div",{className:"meta-col",children:[e.jsx("span",{className:"meta-title",children:"Cliente"}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Nombre:"}),e.jsx("span",{className:"meta-value",children:$})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Teléfono:"}),e.jsx("span",{className:"meta-value",children:K})]})]})]}),e.jsxs(Ze,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{className:"col-qty",children:"CANT."}),e.jsx("th",{children:"DESCRIPCIÓN"}),e.jsx("th",{className:"col-unit",children:"PRECIO UNIT."}),e.jsx("th",{className:"col-total",children:"TOTAL"})]})}),e.jsx("tbody",{children:o.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:"4",style:{textAlign:"center",color:"#777"},children:"No hay artículos."})}):o.map((t,n)=>{const l=parseFloat(t.precio_venta??t.precio??0),d=parseFloat(t.quantity??0);return e.jsxs("tr",{children:[e.jsx("td",{className:"col-qty",children:d}),e.jsx("td",{children:t.nombre||"Artículo sin nombre"}),e.jsxs("td",{className:"col-unit",children:["C$ ",z(l)]}),e.jsxs("td",{className:"col-total",children:["C$ ",z(d*l)]})]},n)})})]}),e.jsxs(et,{children:[e.jsxs("div",{className:"note-section",children:[e.jsx("p",{children:e.jsx("strong",{children:"Nota:"})}),e.jsxs("p",{children:['"',A.slogan,'"']}),e.jsx("p",{children:"Precios sujetos a cambios y stock. Válido por 3 días."}),e.jsx("p",{style:{whiteSpace:"pre-line",marginTop:"5px",fontWeight:"bold"},children:(p==null?void 0:p.ticket_proforma_footer)||"¡Gracias por cotizar con nosotros!"})]}),e.jsxs(tt,{children:[e.jsxs(Z,{children:[e.jsx("span",{children:"Subtotal:"}),e.jsxs("span",{className:"text-right",children:["C$ ",z(h)]})]}),c>0&&e.jsxs(Z,{style:{color:"#dc3545"},children:[e.jsx("span",{children:"Descuento:"}),e.jsxs("span",{className:"text-right",children:["- C$ ",z(c)]})]}),e.jsxs(Z,{className:"grand-total",children:[e.jsx("span",{children:"TOTAL:"}),e.jsxs("span",{className:"text-right",children:["C$ ",z(m)]})]}),e.jsx("div",{className:"badge-container",children:e.jsx("span",{className:"badge",children:"DOCUMENTO NO VÁLIDO COMO FACTURA"})})]})]}),e.jsxs("div",{className:"footer-actions",style:{display:"flex",gap:"1rem",marginTop:"1rem",flexWrap:"wrap"},children:[e.jsxs(D,{$cancel:!0,onClick:i,style:{flex:1},disabled:j||I,children:[e.jsx(we,{})," Cerrar"]}),e.jsxs(D,{onClick:J,disabled:o.length===0||j||I,style:{flex:1,background:"#f59e0b"},children:[I?e.jsx(ee,{}):e.jsx(se,{}),"ENVIAR A CAJA"]}),e.jsxs(D,{onClick:R,disabled:o.length===0||j||I,style:{flex:1,background:"#059669"},children:[j?e.jsx(ee,{}):e.jsx(ve,{}),"PDF"]})]})]})})}),V&&e.jsx(oe,{style:{zIndex:1200},children:e.jsxs(ne,{style:{maxWidth:"400px",textAlign:"center"},children:[e.jsx("h3",{style:{color:"#0f172a",marginBottom:"1rem"},children:"Enviar Pedido a Caja"}),e.jsxs("div",{style:{textAlign:"left",marginBottom:"1rem"},children:[e.jsx("label",{style:{display:"block",marginBottom:"5px",fontWeight:"bold",fontSize:"0.9rem"},children:"Nombre del Ticket:"}),e.jsx("input",{type:"text",value:O,onChange:t=>U(t.target.value),style:{width:"100%",padding:"10px",borderRadius:"8px",border:"1px solid #ccc"}})]}),e.jsxs("div",{style:{textAlign:"left",marginBottom:"1.5rem"},children:[e.jsx("label",{style:{display:"block",marginBottom:"5px",fontWeight:"bold",fontSize:"0.9rem"},children:"Seleccionar Caja:"}),e.jsx("select",{value:F||"",onChange:t=>B(t.target.value),style:{width:"100%",padding:"10px",borderRadius:"8px",border:"1px solid #ccc"},children:M.map(t=>e.jsxs("option",{value:t.openedBy.id,children:[t.openedBy.name," - (Abierta: ",new Date(t.openedAt).toLocaleTimeString(),")"]},t.openedBy.id))})]}),e.jsxs("div",{style:{display:"flex",gap:"10px"},children:[e.jsx(D,{$cancel:!0,onClick:()=>H(!1),style:{flex:1},children:"Cancelar"}),e.jsx(D,{onClick:X,disabled:I,style:{flex:1},children:I?e.jsx(ee,{}):"Enviar Ticket"})]})]})}),T.isOpen&&e.jsx(ot,{title:T.title,message:T.message,type:T.type,onClose:q})]})},E=new Map;async function pe(o,m=4){const h=localStorage.getItem("token"),c=o.filter(i=>{const f=E.get(i);return!f||f!=="loading"&&f!=="none"});let a=0;async function u(){if(a>=c.length)return;const i=c[a++];if(E.has(i))return u();E.set(i,"loading");try{const f=await ue(i,h),y=(f==null?void 0:f.imagen)||"none";E.set(i,y),window.dispatchEvent(new CustomEvent(`image_loaded_${i}`,{detail:y}))}catch{E.set(i,"none"),window.dispatchEvent(new CustomEvent(`image_loaded_${i}`,{detail:"none"}))}return u()}await Promise.all(Array.from({length:m},u))}function at(o){const[m,h]=v.useState(()=>{const a=E.get(o);return a&&a!=="loading"&&a!=="none"?a:null}),c=v.useRef(null);return v.useEffect(()=>{const a=E.get(o);if(a&&a!=="loading"&&a!=="none"){h(a);return}if(a==="none")return;const u=f=>{const y=f.detail;y&&y!=="none"&&h(y)};window.addEventListener(`image_loaded_${o}`,u);const i=new IntersectionObserver(f=>{if(f[0].isIntersecting){const y=E.get(o);if(!y||y!=="loading"&&y!=="none"){const w=localStorage.getItem("token");E.set(o,"loading"),ue(o,w).then(j=>{const k=(j==null?void 0:j.imagen)||"none";E.set(o,k),k!=="none"&&h(k),window.dispatchEvent(new CustomEvent(`image_loaded_${o}`,{detail:k}))}).catch(()=>{E.set(o,"none"),window.dispatchEvent(new CustomEvent(`image_loaded_${o}`,{detail:"none"}))})}}},{rootMargin:"200px"});return c.current&&i.observe(c.current),()=>{i.disconnect(),window.removeEventListener(`image_loaded_${o}`,u)}},[o]),{imgSrc:m,ref:c}}function rt({productId:o,productName:m,onView:h}){const{imgSrc:c,ref:a}=at(o);return e.jsxs("div",{ref:a,style:{height:160,background:"#f8fafc",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"},children:[c&&e.jsx("div",{className:"eye-icon",onClick:u=>{u.stopPropagation(),h(c)},style:{position:"absolute",top:10,left:10,zIndex:20,background:"white",borderRadius:"50%",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 6px rgba(0,0,0,0.1)",cursor:"pointer"},title:"Ver imagen",children:e.jsx($e,{size:14,color:"#64748b"})}),c?e.jsx("img",{src:c,alt:m,style:{width:"100%",height:"100%",objectFit:"contain"}}):e.jsx(Re,{size:40,color:"#e2e8f0"})]})}const it=_`
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
        transform: translateY(${o=>o.isOpen?"0":"100%"});
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        display: flex; /* Always display but hide via transform */
    }
`,ct=r.div` 
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;
`,pt=r.div`
    display: flex; gap: 10px;
`,xe=r(ae.button)`
    background: white; border: 1px solid #e2e8f0; color: #64748b; padding: 8px 16px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 0.9rem;
    &:hover { background: #f8fafc; color: #334155; border-color: #cbd5e1; }
`,xt=r.div`
    background: white; padding: 1.5rem; border-radius: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); display: flex; flex-direction: column; gap: 12px; border: 1px solid #f1f5f9;
    @media (max-width: 960px) { padding: 1rem; border-radius: 16px; position: sticky; top: 0; z-index: 50; }
`,mt=r.div` display: flex; gap: 10px; `,me=r.button`
    flex: 1; padding: 10px; border-radius: 12px; border: 1px solid ${o=>o.active?"#3b82f6":"#e2e8f0"};
    background: ${o=>o.active?"#eff6ff":"white"}; color: ${o=>o.active?"#2563eb":"#64748b"};
    font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s;
    &:hover { border-color: #3b82f6; }
`,ft=r.div`
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
    ${o=>o.outOfStock&&Oe` opacity: 0.6; filter: grayscale(0.5); background: #f8fafc; `}
    
    @media (max-width: 768px) { border-radius: 14px; } 
    /* Mobile optimization */
`,bt=r.div`
  position: absolute; top: 10px; right: 10px; background: ${o=>o.outOfStock?"#ef4444":o.lowstock?"#f59e0b":"#10b981"};
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
    background: ${o=>o.bg||"#3b82f6"}; color: white; border: none; padding: 16px; border-radius: 16px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 1rem; width: 100%; transition: all 0.2s;
    &:disabled { opacity: 0.5; cursor: not-allowed; } 
    &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
`,vt=r(fe)` animation: ${it} 1s linear infinite; `,ye=r.div`
  position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 5000;
`,kt=r.div`
  background: white; padding: 20px; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 90%; max-width: 500px; max-height: 90vh; overflow-y: auto; position: relative;
`,Ct=r(ae.button)`
    display: none;
    @media (max-width: 960px) {
        display: flex; align-items: center; justify-content: space-between;
        position: fixed; bottom: 20px; left: 20px; right: 20px;
        background: #0f172a; color: white;
        padding: 16px 24px; border-radius: 16px; border: none;
        box-shadow: 0 10px 25px rgba(15, 23, 42, 0.4);
        z-index: 90; font-weight: 700; font-size: 1rem; cursor: pointer;
    }
`,St=({isOpen:o,imageSrc:m,onClose:h})=>!o||!m?null:e.jsx(ye,{onClick:h,children:e.jsxs(ae.div,{initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},onClick:c=>c.stopPropagation(),style:{position:"relative",maxWidth:"95%",maxHeight:"90vh"},children:[e.jsx("button",{onClick:h,style:{position:"absolute",top:-15,right:-15,background:"white",width:32,height:32,borderRadius:"50%",border:"none",cursor:"pointer",boxShadow:"0 4px 10px rgba(0,0,0,0.2)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10,color:"#ef4444"},children:e.jsx(ge,{})}),e.jsx("img",{src:m,alt:"Vista Completa",style:{maxWidth:"100%",maxHeight:"85vh",borderRadius:"16px",boxShadow:"0 20px 40px rgba(0,0,0,0.3)",display:"block",background:"white",objectFit:"contain"}})]})}),Nt=r.div`
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
`,At=({onClose:o,onScan:m})=>{const h=x.useRef(null);return v.useEffect(()=>{const c="reader-custom",a=new Ge(c);h.current=a;const u=async()=>{try{await a.start({facingMode:"environment"},{fps:10,qrbox:{width:250,height:250},aspectRatio:1},i=>{a.stop().then(()=>{a.clear(),m(i)}).catch(f=>{console.error("Failed to stop scanner",f),m(i)})},i=>{})}catch(i){console.error("Error starting camera",i),alert("No se pudo iniciar la cámara. Verifique permisos."),o()}};return setTimeout(()=>u(),100),()=>{a.isScanning?a.stop().then(()=>a.clear()).catch(console.error):a.clear()}},[m,o]),e.jsx(ye,{style:{zIndex:6e3},onClick:o,children:e.jsx(kt,{onClick:c=>c.stopPropagation(),style:{padding:"0",width:"90%",maxWidth:"380px",background:"transparent",boxShadow:"none",border:"none"},children:e.jsxs("div",{style:{background:"white",borderRadius:"16px",padding:"16px",boxShadow:"0 20px 25px -5px rgba(0, 0, 0, 0.1)"},children:[e.jsx("h3",{style:{margin:"0 0 12px",textAlign:"center",fontSize:"1.2rem"},children:"Escanear Producto"}),e.jsxs(Nt,{children:[e.jsx("div",{id:"reader-custom",style:{width:"100%",height:"100%"}}),e.jsx(zt,{})]}),e.jsx("p",{style:{textAlign:"center",fontSize:"0.85rem",color:"#64748b",marginTop:"12px"},children:"Apunta la cámara al código de barras"}),e.jsx(be,{bg:"#ef4444",onClick:o,style:{marginTop:"15px"},children:"Cancelar"})]})})})},Ot=()=>{const{user:o,products:m}=he(),{cajaSession:h}=We(),c=localStorage.getItem("token"),[a,u]=x.useState(m||[]),[i,f]=x.useState([]),[y,w]=x.useState(""),[j,k]=x.useState("nombre"),[L,p]=x.useState(!1),[C,S]=x.useState(""),[I,P]=x.useState(""),[V,H]=x.useState(""),[M,G]=x.useState(!1),[O,U]=x.useState(null),[F,B]=x.useState({isOpen:!1,imageUrl:null}),[T,W]=x.useState(!1),[N,q]=x.useState(!1),z=x.useRef(null);x.useEffect(()=>{m&&u(m)},[m]);const Y=x.useCallback(async()=>{p(!0);try{const t=await qe(c);u(Array.isArray(t)?t:(t==null?void 0:t.data)||[])}catch(t){console.error(t)}finally{p(!1)}},[c]);x.useEffect(()=>{Y()},[Y]);const Q=()=>{window.location.href="/dashboard"},$=t=>{var l;if((((l=i.find(d=>d.id===t.id))==null?void 0:l.quantity)||0)>=t.existencia)return alert(`Stock máximo alcanzado (${t.existencia}).`);f(d=>d.find(g=>g.id===t.id)?d.map(g=>g.id===t.id?{...g,quantity:g.quantity+1}:g):[...d,{...t,quantity:1,precio_venta:parseFloat(t.precio_venta||t.precio||0)}])},K=(t,n)=>{f(l=>{const d=l.find(b=>b.id===t);if(!d)return l;const s=a.find(b=>b.id===t)||d,g=d.quantity+n;return g>s.existencia?(alert(`Stock máximo alcanzado (${s.existencia}).`),l):g<1?l.filter(b=>b.id!==t):l.map(b=>b.id===t?{...b,quantity:g}:b)})},A=x.useMemo(()=>{const t=j==="codigo";return De(a,y,t?["codigo"]:["nombre","codigo"],{strict:t}).slice(0,100)},[a,y,j]);x.useEffect(()=>{pe(A.map(t=>t.id_producto||t.id),6)},[A]),x.useEffect(()=>{if(!a.length)return;const t=setTimeout(()=>pe(a.map(n=>n.id_producto||n.id),2),1500);return()=>clearTimeout(t)},[a]);const R=x.useMemo(()=>i.reduce((t,n)=>t+parseFloat(n.precio_venta)*n.quantity,0),[i]);x.useEffect(()=>{const t=n=>{var l;M||F.isOpen||T||N||["INPUT","TEXTAREA","SELECT"].includes((l=document.activeElement)==null?void 0:l.tagName)||n.key.length>1||n.ctrlKey||n.altKey||n.metaKey||(n.preventDefault(),j!=="codigo"?(k("codigo"),w(n.key)):w(d=>d+n.key),z.current&&z.current.focus())};return window.addEventListener("keydown",t),()=>window.removeEventListener("keydown",t)},[M,F,T,j,N]);const J=()=>{if(!C.trim())return alert("El nombre del cliente es obligatorio.");U({cart:i,total:R,subtotal:R,discount:0,proformaNumber:V,client:{nombre:C,telefono:I||"N/D"}}),G(!0)},X=t=>{t&&(k("codigo"),w(t),q(!1))};return e.jsxs(st,{children:[e.jsxs(lt,{children:[e.jsxs(ct,{children:[e.jsx("h2",{style:{margin:0,fontWeight:800,color:"#0f172a"},children:"Catálogo y Proformas"}),e.jsxs(pt,{children:[e.jsxs(xe,{onClick:Q,whileHover:{x:-4},children:[e.jsx(ze,{size:14})," Regresar"]}),e.jsxs(xe,{onClick:Y,disabled:L,children:[L?e.jsx(vt,{size:14}):e.jsx(fe,{size:14})," Actualizar"]})]})]}),e.jsxs(xt,{children:[e.jsxs(mt,{children:[e.jsxs(me,{active:j==="nombre",onClick:()=>{var t;k("nombre"),w(""),(t=z.current)==null||t.focus()},children:[e.jsx(Ae,{})," Nombre"]}),e.jsxs(me,{active:j==="codigo",onClick:()=>{var t;k("codigo"),w(""),(t=z.current)==null||t.focus()},children:[e.jsx(le,{})," Código"]})]}),e.jsxs(ft,{children:[e.jsx(de,{color:"#94a3b8"}),e.jsx(gt,{ref:z,placeholder:j==="codigo"?"Escanea o escribe código...":"Escribe para buscar...",value:y,onChange:t=>w(t.target.value),autoFocus:!0}),e.jsxs("div",{onClick:()=>q(!0),style:{padding:"8px",cursor:"pointer",color:"#64748b",display:"flex",alignItems:"center",justifyContent:"center",borderLeft:"1px solid #e2e8f0",marginLeft:"5px"},title:"Usar Cámara",children:[e.jsx(le,{size:18}),e.jsx(de,{size:10,style:{marginLeft:-6,marginTop:-8}})," "]})]})]}),e.jsx(ht,{children:A.map(t=>{var g;const n=t.id_producto||t.id,l=((g=i.find(b=>(b.id_producto||b.id)===n))==null?void 0:g.quantity)||0,d=Math.max(0,Number(t.existencia||0)-l),s=d<=0;return e.jsxs(ut,{onClick:()=>!s&&$(t),outOfStock:s,title:t.nombre,children:[e.jsx(bt,{outOfStock:s,lowstock:d<5&&!s,children:s?"Agotado":`Stock: ${d}`}),e.jsx(rt,{productId:n,productName:t.nombre,onView:b=>B({isOpen:!0,imageUrl:b})}),e.jsxs("div",{style:{padding:"12px",flex:1,display:"flex",flexDirection:"column",gap:"4px"},children:[e.jsx("div",{style:{fontWeight:600,fontSize:"0.88rem",color:"#1e293b",lineHeight:"1.25",height:"2.5rem",overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"},children:t.nombre}),e.jsx("div",{style:{fontSize:"0.78rem",color:"#94a3b8",fontWeight:600},children:t.codigo||"S/C"}),e.jsxs("div",{style:{fontWeight:800,color:"#2563eb",fontSize:"1.05rem",marginTop:"auto"},children:["C$ ",parseFloat(t.precio_venta||t.precio||0).toFixed(2)]})]})]},n)})})]}),e.jsxs(dt,{isOpen:T,children:[e.jsxs("div",{style:{marginBottom:"20px"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("h3",{style:{margin:0,fontWeight:800,display:"flex",alignItems:"center",gap:10},children:[e.jsx(Ee,{color:"#3b82f6"})," Tu Proforma"]}),e.jsx("button",{onClick:()=>W(!1),style:{display:"none",background:"#f1f5f9",border:"none",padding:"8px",borderRadius:"8px",cursor:"pointer"},className:"mobile-close-btn",children:e.jsx(ge,{})}),e.jsx("style",{children:"@media(max-width: 960px) { .mobile-close-btn { display: block !important; } }"})]}),e.jsx("input",{style:{width:"100%",padding:"12px",marginTop:15,border:"2px solid #e2e8f0",borderRadius:12,outline:"none"},placeholder:"Nombre del Cliente",value:C,onChange:t=>S(t.target.value)}),e.jsx("input",{style:{width:"100%",padding:"12px",marginTop:10,border:"2px solid #e2e8f0",borderRadius:12,outline:"none"},placeholder:"Teléfono",value:I,onChange:t=>P(t.target.value)})]}),e.jsx(yt,{children:i.length===0?e.jsxs("div",{style:{textAlign:"center",color:"#94a3b8",marginTop:40},children:[e.jsx(ce,{size:48,style:{opacity:.1,marginBottom:15}}),e.jsx("p",{children:"Agrega productos"})]}):i.map(t=>e.jsxs(jt,{children:[e.jsxs("div",{style:{flex:1},children:[e.jsx("div",{style:{fontWeight:600,fontSize:"0.9rem"},children:t.nombre}),e.jsxs("div",{style:{color:"#64748b",fontSize:"0.85rem"},children:["C$ ",parseFloat(t.precio_venta).toFixed(2)]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10},children:[e.jsxs(wt,{children:[e.jsx(te,{onClick:()=>K(t.id,-1),children:e.jsx(Te,{size:10})}),e.jsx("span",{style:{fontWeight:700},children:t.quantity}),e.jsx(te,{onClick:()=>K(t.id,1),children:e.jsx(Ie,{size:10})})]}),e.jsx(te,{onClick:()=>f(n=>n.filter(l=>l.id!==t.id)),style:{color:"#ef4444"},children:e.jsx(Fe,{})})]})]},t.id))}),e.jsxs("div",{style:{borderTop:"2px dashed #e2e8f0",paddingTop:"20px",marginTop:"auto"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"1.5rem",fontWeight:900,marginBottom:20},children:[e.jsx("span",{children:"TOTAL"}),e.jsxs("span",{children:["C$ ",R.toFixed(2)]})]}),e.jsxs(be,{onClick:J,disabled:i.length===0||!C.trim(),children:[e.jsx(ce,{})," GENERAR PROFORMA PDF"]})]})]}),e.jsxs(Ct,{initial:{y:200},animate:{y:i.length>0?0:200},onClick:()=>W(!0),children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsx("div",{style:{background:"#3b82f6",borderRadius:"50%",width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.8rem"},children:i.reduce((t,n)=>t+n.quantity,0)}),e.jsx("span",{children:"Ver Pedido"})]}),e.jsxs("span",{children:["C$ ",R.toFixed(2)]})]}),e.jsx(Pe,{children:F.isOpen&&e.jsx(St,{isOpen:!0,imageSrc:F.imageUrl,onClose:()=>B({isOpen:!1,imageUrl:null})})}),M&&e.jsx(nt,{...O,onClose:()=>G(!1),setTicketData:()=>f([]),currentUser:o,client:O.client}),N&&e.jsx(At,{onClose:()=>q(!1),onScan:X})]})};export{Ot as default};

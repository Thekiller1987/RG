import{R as v,r as m,j as e,C as de,x as ke,a8 as Ce,s as i,t as q,a9 as Se,aa as Ne,W as Ae,v as ze,X as Ee,ab as he,a0 as Te,a1 as ce,$ as pe,G as Ie,k as ue,ac as xe,ad as Fe,Y as _e,a5 as Pe,A as $e,m as se,ae as Oe,a6 as Re,a7 as De}from"./vendor-Cig3sC1l.js";import{r as Le}from"./searchEngine-BMYcElFi.js";import{a as Me,u as be,e as Be,h as We,i as qe,j as Ve,k as He,f as ye}from"./index-DGmyou13.js";import{h as Ue,E as Ge}from"./pdf-vendor-Dyhe4TSt.js";import{H as Ye}from"./scanner-vendor-DfxRpMWJ.js";const Qe=q`from { opacity: 0; } to { opacity: 1; }`,Ke=q`from { transform: scale(0.95); } to { transform: scale(1); }`,Je=q`0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }`,re=i.div`
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px);
    display: flex; justify-content: center; align-items: center; z-index: 1100;
    animation: ${Qe} 0.2s;
`,ie=i.div`
    background: white; padding: 2.5rem; border-radius: 24px;
    width: 95%; max-width: 680px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    animation: ${Ke} 0.3s;
    max-height: 90vh; overflow-y: auto;

    @media (max-width: 768px) {
        padding: 1rem;
        border-radius: 12px;
    }
`,W=i.button`
    padding: 1rem 1.5rem; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.2s;
    background: ${o=>o.$cancel?"#e2e8f0":"#2563eb"};
    color: ${o=>o.$cancel?"#475569":"white"};
    &:hover { background: ${o=>o.$cancel?"#cbd5e1":"#1d4ed8"}; }
    &:disabled { opacity: 0.6; cursor: not-allowed; }
`,oe=i.div`
    display: flex; justify-content: space-between; padding: 8px 0; font-size: 0.95rem;
    font-weight: ${o=>o.$bold?"bold":"normal"};
    &.grand-total { border-top: 2px solid #333; font-size: 1.1rem; margin-top: 8px; padding-top: 10px; }
    .text-right { text-align: right; }
`,ne=i(ze)`animation: ${Je} 1s linear infinite;`,Xe=i.div`
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
`,at=({title:o,message:u,type:f="info",onClose:p})=>{const l=()=>f==="error"?"#ef4444":f==="success"?"#10b981":"#3b82f6",y=()=>f==="error"?e.jsx(Se,{size:40,color:l()}):f==="success"?e.jsx(Ne,{size:40,color:l()}):e.jsx(Ae,{size:40,color:l()});return e.jsx(re,{style:{zIndex:2e3},children:e.jsxs(ie,{style:{maxWidth:"350px",textAlign:"center",padding:"2rem"},children:[e.jsx("div",{style:{marginBottom:"1rem"},children:y()}),e.jsx("h3",{style:{color:"#1e293b",margin:"0 0 10px 0"},children:o}),e.jsx("p",{style:{color:"#64748b",fontSize:"0.95rem",margin:"0 0 20px 0"},children:u}),e.jsx(W,{onClick:p,style:{width:"100%",padding:"12px"},children:"Entendido"})]})})},rt=({cart:o=[],total:u=0,subtotal:f=0,discount:p=0,proformaFor:l="",proformaNumber:y="",onClose:d,setTicketData:b,currentUser:g,client:k})=>{const[C,j]=v.useState(!1),T=m.useRef(null),{settings:s}=Me(),{cajaSession:F,user:S}=be()||{},[N,$]=v.useState(!1),[V,H]=v.useState(!1),[X,le]=v.useState([]),[O,U]=v.useState(""),[L,Q]=v.useState(null),[A,G]=v.useState({isOpen:!1,title:"",message:"",type:"info"}),z=(n,t,a="info")=>{G({isOpen:!0,title:n,message:t,type:a})},K=()=>{G(n=>({...n,isOpen:!1})),A.type==="success"&&(b(),d&&d())},_=n=>new Intl.NumberFormat("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(n||0)),R=(n=>(n==null?void 0:n.usuarioNombre)||(n==null?void 0:n.nombre)||"Empleado")(g),D=(k==null?void 0:k.nombre)||l||"Consumidor Final",Z=(k==null?void 0:k.telefono)||"N/D",ee=v.useMemo(()=>{if(!(s!=null&&s.empresa_logo_url))return null;if(s.empresa_logo_url.startsWith("http"))return s.empresa_logo_url;let n=s.empresa_logo_url;return n.startsWith("/uploads")?n="/api"+n:n.startsWith("uploads")&&(n="/api/"+n),`${"https://sistema.multirepuestosrg.com/api".replace(/\/api$/,"")}${n.startsWith("/")?"":"/"}${n}`},[s==null?void 0:s.empresa_logo_url]),I={name:(s==null?void 0:s.empresa_nombre)||"Multirepuestos RG",ruc:(s==null?void 0:s.empresa_ruc)||"1211812770001E",phone:(s==null?void 0:s.empresa_telefono)||"84031936 / 84058142",address:(s==null?void 0:s.empresa_direccion)||"Del portón de la normal 75 varas al este. Juigalpa, Chontales.",slogan:(s==null?void 0:s.empresa_eslogan)||"Tu mejor opción en repuestos de moto y carro",logo:ee||new URL("/icons/logo.png",window.location.origin).toString()};v.useEffect(()=>{U(`Pedido - ${D}`)},[D]);const Y=async()=>{if(o.length===0)return;j(!0);const n=T.current,t=D.replace(/\s/g,"_").replace(/[^a-zA-Z0-9_]/g,""),a=y.trim()?`N${y.trim()}`:"TEMP",x=`PROFORMA_${t}_${a}.pdf`,r=n.cloneNode(!0);r.classList.add("proforma-to-print");const w=r.querySelector(".footer-actions");w&&w.remove(),r.style.position="absolute",r.style.left="-9999px",r.style.top="0",r.style.width="794px",r.style.padding="40px",r.style.boxSizing="border-box",r.style.background="#ffffff",r.style.boxShadow="none",r.style.border="none",document.body.appendChild(r);try{const h=await Ue(r,{scale:2,useCORS:!0,windowWidth:794}),P=h.toDataURL("image/jpeg",1),c=new Ge("p","mm","a4"),M=210,ve=h.height*M/h.width;c.addImage(P,"JPEG",0,0,M,ve),c.save(x),b()}catch(h){console.error("Error al generar PDF:",h),z("Error","❌ Error al generar y descargar el PDF.","error")}finally{document.body.contains(r)&&document.body.removeChild(r),j(!1),d&&d()}},B=async()=>{var t,a;if(o.length===0)return;$(!0);const n=localStorage.getItem("token");try{const x=await Be(n);let r=(x==null?void 0:x.abiertas)||[];if(r.length===0&&F&&!F.closedAt){const w=((t=F.openedBy)==null?void 0:t.id)||((S==null?void 0:S.id_usuario)??(S==null?void 0:S.id)),h=((a=F.openedBy)==null?void 0:a.name)||(S==null?void 0:S.nombre_usuario)||"Cajero";r=[{id:F.id,openedAt:F.openedAt,openedBy:{id:w,name:h}}]}if(r.length===0){z("Atención","⚠️ No hay cajas abiertas en este momento. Abre una caja primero desde el POS antes de enviar el pedido.","warning"),$(!1);return}le(r),r.length>0&&Q(r[0].openedBy.id),H(!0),$(!1)}catch(x){console.error("Error fetching sessions:",x),z("Error","❌ Error al buscar cajas activas.","error"),$(!1)}},te=async()=>{if(!L)return z("Atención","Seleccione una caja.","warning");if(!O.trim())return z("Atención","Ingrese un nombre para el ticket.","warning");$(!0);const n=localStorage.getItem("token");try{const t=await We(L,n)||[],a={id:Date.now(),name:O,items:o,createdAt:new Date().toISOString(),createdBy:R},r=[...Array.isArray(t)?t:[],a];await qe(L,r,n),H(!1),z("Éxito",`✅ Ticket "${O}" enviado exitosamente a la caja.`,"success")}catch(t){console.error("Error sending ticket:",t),z("Error","❌ Error al enviar el ticket a la caja. Intente de nuevo.","error")}finally{$(!1)}};return e.jsxs(v.Fragment,{children:[e.jsx(re,{style:{zIndex:V||A.isOpen?1099:1100},children:e.jsx(ie,{children:e.jsxs(Xe,{ref:T,children:[e.jsxs(Ze,{children:[e.jsx("div",{className:"brand-logo-container",children:e.jsx("img",{src:I.logo,alt:"Logo",className:"logo",onError:n=>{n.currentTarget.style.display="none"}})}),e.jsxs("div",{className:"brand-info",children:[e.jsx("h1",{children:I.name}),e.jsx("small",{children:I.slogan}),e.jsxs("small",{children:["RUC: ",I.ruc]}),e.jsxs("small",{children:["Tel: ",I.phone]}),e.jsx("small",{children:I.address}),e.jsx("div",{children:e.jsxs("span",{className:"proforma-tag",children:[e.jsx(de,{style:{marginRight:4,verticalAlign:"middle"}})," COTIZACIÓN / PROFORMA"]})})]})]}),e.jsxs(et,{children:[e.jsxs("div",{className:"meta-col",children:[e.jsx("span",{className:"meta-title",children:"Detalles"}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Fecha:"}),e.jsxs("span",{className:"meta-value",children:[new Date().toLocaleDateString("es-NI")," ",new Date().toLocaleTimeString("es-NI",{hour:"2-digit",minute:"2-digit"})]})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"ID Temp:"}),e.jsx("span",{className:"meta-value",children:Date.now().toString().slice(-6)})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Atendido por:"}),e.jsx("span",{className:"meta-value",children:R})]})]}),e.jsxs("div",{className:"meta-col",children:[e.jsx("span",{className:"meta-title",children:"Cliente"}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Nombre:"}),e.jsx("span",{className:"meta-value",children:D})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Teléfono:"}),e.jsx("span",{className:"meta-value",children:Z})]})]})]}),e.jsxs(tt,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{className:"col-qty",children:"CANT."}),e.jsx("th",{children:"DESCRIPCIÓN"}),e.jsx("th",{className:"col-unit",children:"PRECIO UNIT."}),e.jsx("th",{className:"col-total",children:"TOTAL"})]})}),e.jsx("tbody",{children:o.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:"4",style:{textAlign:"center",color:"#777"},children:"No hay artículos."})}):o.map((n,t)=>{const a=parseFloat(n.precio_venta??n.precio??0),x=parseFloat(n.quantity??0);return e.jsxs("tr",{children:[e.jsx("td",{className:"col-qty",children:x}),e.jsx("td",{children:n.nombre||"Artículo sin nombre"}),e.jsxs("td",{className:"col-unit",children:["C$ ",_(a)]}),e.jsxs("td",{className:"col-total",children:["C$ ",_(x*a)]})]},t)})})]}),e.jsxs(ot,{children:[e.jsxs("div",{className:"note-section",children:[e.jsx("p",{children:e.jsx("strong",{children:"Nota:"})}),e.jsxs("p",{children:['"',I.slogan,'"']}),e.jsx("p",{children:"Precios sujetos a cambios y stock. Válido por 3 días."}),e.jsx("p",{style:{whiteSpace:"pre-line",marginTop:"5px",fontWeight:"bold"},children:(s==null?void 0:s.ticket_proforma_footer)||"¡Gracias por cotizar con nosotros!"})]}),e.jsxs(nt,{children:[e.jsxs(oe,{children:[e.jsx("span",{children:"Subtotal:"}),e.jsxs("span",{className:"text-right",children:["C$ ",_(f)]})]}),p>0&&e.jsxs(oe,{style:{color:"#dc3545"},children:[e.jsx("span",{children:"Descuento:"}),e.jsxs("span",{className:"text-right",children:["- C$ ",_(p)]})]}),e.jsxs(oe,{className:"grand-total",children:[e.jsx("span",{children:"TOTAL:"}),e.jsxs("span",{className:"text-right",children:["C$ ",_(u)]})]}),e.jsx("div",{className:"badge-container",children:e.jsx("span",{className:"badge",children:"DOCUMENTO NO VÁLIDO COMO FACTURA"})})]})]}),e.jsxs("div",{className:"footer-actions",style:{display:"flex",gap:"1rem",marginTop:"1rem",flexWrap:"wrap"},children:[e.jsxs(W,{$cancel:!0,onClick:d,style:{flex:1},disabled:C||N,children:[e.jsx(ke,{})," Cerrar"]}),e.jsxs(W,{onClick:B,disabled:o.length===0||C||N,style:{flex:1,background:"#f59e0b"},children:[N?e.jsx(ne,{}):e.jsx(de,{}),"ENVIAR A CAJA"]}),e.jsxs(W,{onClick:Y,disabled:o.length===0||C||N,style:{flex:1,background:"#059669"},children:[C?e.jsx(ne,{}):e.jsx(Ce,{}),"PDF"]})]})]})})}),V&&e.jsx(re,{style:{zIndex:1200},children:e.jsxs(ie,{style:{maxWidth:"400px",textAlign:"center"},children:[e.jsx("h3",{style:{color:"#0f172a",marginBottom:"1rem"},children:"Enviar Pedido a Caja"}),e.jsxs("div",{style:{textAlign:"left",marginBottom:"1rem"},children:[e.jsx("label",{style:{display:"block",marginBottom:"5px",fontWeight:"bold",fontSize:"0.9rem"},children:"Nombre del Ticket:"}),e.jsx("input",{type:"text",value:O,onChange:n=>U(n.target.value),style:{width:"100%",padding:"10px",borderRadius:"8px",border:"1px solid #ccc"}})]}),e.jsxs("div",{style:{textAlign:"left",marginBottom:"1.5rem"},children:[e.jsx("label",{style:{display:"block",marginBottom:"5px",fontWeight:"bold",fontSize:"0.9rem"},children:"Seleccionar Caja:"}),e.jsx("select",{value:L||"",onChange:n=>Q(n.target.value),style:{width:"100%",padding:"10px",borderRadius:"8px",border:"1px solid #ccc"},children:X.map(n=>e.jsxs("option",{value:n.openedBy.id,children:[n.openedBy.name," - (Abierta: ",new Date(n.openedAt).toLocaleTimeString(),")"]},n.openedBy.id))})]}),e.jsxs("div",{style:{display:"flex",gap:"10px"},children:[e.jsx(W,{$cancel:!0,onClick:()=>H(!1),style:{flex:1},children:"Cancelar"}),e.jsx(W,{onClick:te,disabled:N,style:{flex:1},children:N?e.jsx(ne,{}):"Enviar Ticket"})]})]})}),A.isOpen&&e.jsx(at,{title:A.title,message:A.message,type:A.type,onClose:K})]})},E=new Map;async function me(o,u=4){const f=localStorage.getItem("token"),p=o.filter(d=>{const b=E.get(d);return!b||b!=="loading"&&b!=="none"});let l=0;async function y(){if(l>=p.length)return;const d=p[l++];if(E.has(d))return y();E.set(d,"loading");try{const b=await ye(d,f),g=(b==null?void 0:b.imagen)||"none";E.set(d,g),window.dispatchEvent(new CustomEvent(`image_loaded_${d}`,{detail:g}))}catch{E.set(d,"none"),window.dispatchEvent(new CustomEvent(`image_loaded_${d}`,{detail:"none"}))}return y()}await Promise.all(Array.from({length:u},y))}function it(o){const[u,f]=v.useState(()=>{const l=E.get(o);return l&&l!=="loading"&&l!=="none"?l:null}),p=v.useRef(null);return v.useEffect(()=>{const l=E.get(o);if(l&&l!=="loading"&&l!=="none"){f(l);return}if(l==="none")return;const y=b=>{const g=b.detail;g&&g!=="none"&&f(g)};window.addEventListener(`image_loaded_${o}`,y);const d=new IntersectionObserver(b=>{if(b[0].isIntersecting){const g=E.get(o);if(!g||g!=="loading"&&g!=="none"){const k=localStorage.getItem("token");E.set(o,"loading"),ye(o,k).then(C=>{const j=(C==null?void 0:C.imagen)||"none";E.set(o,j),j!=="none"&&f(j),window.dispatchEvent(new CustomEvent(`image_loaded_${o}`,{detail:j}))}).catch(()=>{E.set(o,"none"),window.dispatchEvent(new CustomEvent(`image_loaded_${o}`,{detail:"none"}))})}}},{rootMargin:"200px"});return p.current&&d.observe(p.current),()=>{d.disconnect(),window.removeEventListener(`image_loaded_${o}`,y)}},[o]),{imgSrc:u,ref:p}}function st({productId:o,productName:u,onView:f}){const{imgSrc:p,ref:l}=it(o);return e.jsxs("div",{ref:l,style:{height:160,background:"#f8fafc",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"},children:[p&&e.jsx("div",{className:"eye-icon",onClick:y=>{y.stopPropagation(),f(p)},style:{position:"absolute",top:10,left:10,zIndex:20,background:"white",borderRadius:"50%",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 6px rgba(0,0,0,0.1)",cursor:"pointer"},title:"Ver imagen",children:e.jsx(Re,{size:14,color:"#64748b"})}),p?e.jsx("img",{src:p,alt:u,style:{width:"100%",height:"100%",objectFit:"contain"}}):e.jsx(De,{size:40,color:"#e2e8f0"})]})}const lt=q`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;q`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;q`
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
        transform: translateY(${o=>o.isOpen?"0":"100%"});
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        display: flex; /* Always display but hide via transform */
    }
`,xt=i.div` 
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;
`,mt=i.div`
    display: flex; gap: 10px;
`,fe=i(se.button)`
    background: white; border: 1px solid #e2e8f0; color: #64748b; padding: 8px 16px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 0.9rem;
    &:hover { background: #f8fafc; color: #334155; border-color: #cbd5e1; }
`,ft=i.div`
    background: white; padding: 1.5rem; border-radius: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); display: flex; flex-direction: column; gap: 12px; border: 1px solid #f1f5f9;
    @media (max-width: 960px) { padding: 1rem; border-radius: 16px; position: sticky; top: 0; z-index: 50; }
`,gt=i.div` display: flex; gap: 10px; `,ge=i.button`
    flex: 1; padding: 10px; border-radius: 12px; border: 1px solid ${o=>o.active?"#3b82f6":"#e2e8f0"};
    background: ${o=>o.active?"#eff6ff":"white"}; color: ${o=>o.active?"#2563eb":"#64748b"};
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
    ${o=>o.outOfStock&&Oe` opacity: 0.6; filter: grayscale(0.5); background: #f8fafc; `}
    
    @media (max-width: 768px) { border-radius: 14px; } 
    /* Mobile optimization */
`,jt=i.div`
  position: absolute; top: 10px; right: 10px; background: ${o=>o.outOfStock?"#ef4444":o.lowstock?"#f59e0b":"#10b981"};
  color: white; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 30px; z-index: 10; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  @media (max-width: 768px) { font-size: 0.65rem; padding: 3px 8px; }
`,wt=i.div` flex: 1; overflow-y: auto; margin-top: 15px; padding-right: 5px; &::-webkit-scrollbar { width: 4px; } `,vt=i.div`
    display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: white; margin-bottom: 10px; border-radius: 16px; border: 1px solid #f1f5f9;
`,kt=i.div`
    display: flex; align-items: center; gap: 10px; background: #f8fafc; padding: 6px; border-radius: 12px; border: 1px solid #f1f5f9;
`,ae=i.button`
    width: 32px; height: 32px; border-radius: 10px; border: none; background: white; color: #64748b; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05); cursor: pointer; transition: all 0.2s;
    &:hover { color: #3b82f6; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
`,je=i.button`
    background: ${o=>o.bg||"#3b82f6"}; color: white; border: none; padding: 16px; border-radius: 16px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 1rem; width: 100%; transition: all 0.2s;
    &:disabled { opacity: 0.5; cursor: not-allowed; } 
    &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
`,Ct=i(he)` animation: ${lt} 1s linear infinite; `,we=i.div`
  position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 5000;
`,St=i.div`
  background: white; padding: 20px; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 90%; max-width: 500px; max-height: 90vh; overflow-y: auto; position: relative;
`,Nt=i(se.button)`
    display: none;
    @media (max-width: 960px) {
        display: flex; align-items: center; justify-content: space-between;
        position: fixed; bottom: 20px; left: 20px; right: 20px;
        background: #0f172a; color: white;
        padding: 16px 24px; border-radius: 16px; border: none;
        box-shadow: 0 10px 25px rgba(15, 23, 42, 0.4);
        z-index: 90; font-weight: 700; font-size: 1rem; cursor: pointer;
    }
`,At=({isOpen:o,imageSrc:u,onClose:f})=>!o||!u?null:e.jsx(we,{onClick:f,children:e.jsxs(se.div,{initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},onClick:p=>p.stopPropagation(),style:{position:"relative",maxWidth:"95%",maxHeight:"90vh"},children:[e.jsx("button",{onClick:f,style:{position:"absolute",top:-15,right:-15,background:"white",width:32,height:32,borderRadius:"50%",border:"none",cursor:"pointer",boxShadow:"0 4px 10px rgba(0,0,0,0.2)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10,color:"#ef4444"},children:e.jsx(ue,{})}),e.jsx("img",{src:u,alt:"Vista Completa",style:{maxWidth:"100%",maxHeight:"85vh",borderRadius:"16px",boxShadow:"0 20px 40px rgba(0,0,0,0.3)",display:"block",background:"white",objectFit:"contain"}})]})}),zt=i.div`
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
`,Tt=({onClose:o,onScan:u})=>{const f=m.useRef(null);return v.useEffect(()=>{const p="reader-custom",l=new Ye(p);f.current=l;const y=async()=>{try{await l.start({facingMode:"environment"},{fps:10,qrbox:{width:250,height:250},aspectRatio:1},d=>{l.stop().then(()=>{l.clear(),u(d)}).catch(b=>{console.error("Failed to stop scanner",b),u(d)})},d=>{})}catch(d){console.error("Error starting camera",d),alert("No se pudo iniciar la cámara. Verifique permisos."),o()}};return setTimeout(()=>y(),100),()=>{l.isScanning?l.stop().then(()=>l.clear()).catch(console.error):l.clear()}},[u,o]),e.jsx(we,{style:{zIndex:6e3},onClick:o,children:e.jsx(St,{onClick:p=>p.stopPropagation(),style:{padding:"0",width:"90%",maxWidth:"380px",background:"transparent",boxShadow:"none",border:"none"},children:e.jsxs("div",{style:{background:"white",borderRadius:"16px",padding:"16px",boxShadow:"0 20px 25px -5px rgba(0, 0, 0, 0.1)"},children:[e.jsx("h3",{style:{margin:"0 0 12px",textAlign:"center",fontSize:"1.2rem"},children:"Escanear Producto"}),e.jsxs(zt,{children:[e.jsx("div",{id:"reader-custom",style:{width:"100%",height:"100%"}}),e.jsx(Et,{})]}),e.jsx("p",{style:{textAlign:"center",fontSize:"0.85rem",color:"#64748b",marginTop:"12px"},children:"Apunta la cámara al código de barras"}),e.jsx(je,{bg:"#ef4444",onClick:o,style:{marginTop:"15px"},children:"Cancelar"})]})})})},Ot=()=>{const{user:o,products:u,globalReservations:f,getAvailableStock:p}=be(),{cajaSession:l}=Ve(),y=localStorage.getItem("token"),[d,b]=m.useState(u||[]),[g,k]=m.useState([]),[C,j]=m.useState(""),[T,s]=m.useState("nombre"),[F,S]=m.useState(!1),[N,$]=m.useState(""),[V,H]=m.useState(""),[X,le]=m.useState(""),[O,U]=m.useState(!1),[L,Q]=m.useState(null),[A,G]=m.useState({isOpen:!1,imageUrl:null}),[z,K]=m.useState(!1),[_,J]=m.useState(!1),R=m.useRef(null);m.useEffect(()=>{u&&b(u)},[u]);const D=m.useCallback(async()=>{S(!0);try{const t=await He(y);b(Array.isArray(t)?t:(t==null?void 0:t.data)||[])}catch(t){console.error(t)}finally{S(!1)}},[y]);m.useEffect(()=>{D()},[D]);const Z=()=>{window.location.href="/dashboard"},ee=t=>{var w;const a=t.id_producto||t.id,x=((w=g.find(h=>(h.id_producto||h.id)===a))==null?void 0:w.quantity)||0,r=p?p(t,(o==null?void 0:o.id_usuario)||(o==null?void 0:o.id)):Number(t.existencia||0);if(x+1>r)return alert(`Stock disponible insuficiente (${r} unidades disponibles tras considerar cajas y tickets activos).`);k(h=>h.find(c=>(c.id_producto||c.id)===a)?h.map(c=>(c.id_producto||c.id)===a?{...c,quantity:c.quantity+1}:c):[...h,{...t,id:a,id_producto:a,quantity:1,precio_venta:parseFloat(t.precio_venta||t.precio||0)}])},I=(t,a)=>{k(x=>{const r=x.find(c=>(c.id_producto||c.id)===t);if(!r)return x;const w=d.find(c=>(c.id_producto||c.id)===t)||r,h=p?p(w,(o==null?void 0:o.id_usuario)||(o==null?void 0:o.id)):Number(w.existencia||0),P=r.quantity+a;return P>h?(alert(`Stock máximo disponible alcanzado (${h} unidades).`),x):P<1?x.filter(c=>(c.id_producto||c.id)!==t):x.map(c=>(c.id_producto||c.id)===t?{...c,quantity:P}:c)})},Y=m.useMemo(()=>{const t=T==="codigo";return Le(d,C,t?["codigo"]:["nombre","codigo"],{strict:t}).slice(0,100)},[d,C,T]);m.useEffect(()=>{me(Y.map(t=>t.id_producto||t.id),6)},[Y]),m.useEffect(()=>{if(!d.length)return;const t=setTimeout(()=>me(d.map(a=>a.id_producto||a.id),2),1500);return()=>clearTimeout(t)},[d]);const B=m.useMemo(()=>g.reduce((t,a)=>t+parseFloat(a.precio_venta)*a.quantity,0),[g]);m.useEffect(()=>{const t=a=>{var x;O||A.isOpen||z||_||["INPUT","TEXTAREA","SELECT"].includes((x=document.activeElement)==null?void 0:x.tagName)||a.key.length>1||a.ctrlKey||a.altKey||a.metaKey||(a.preventDefault(),T!=="codigo"?(s("codigo"),j(a.key)):j(r=>r+a.key),R.current&&R.current.focus())};return window.addEventListener("keydown",t),()=>window.removeEventListener("keydown",t)},[O,A,z,T,_]);const te=()=>{if(!N.trim())return alert("El nombre del cliente es obligatorio.");Q({cart:g,total:B,subtotal:B,discount:0,proformaNumber:X,client:{nombre:N,telefono:V||"N/D"}}),U(!0)},n=t=>{t&&(s("codigo"),j(t),J(!1))};return e.jsxs(dt,{children:[e.jsxs(ct,{children:[e.jsxs(xt,{children:[e.jsx("h2",{style:{margin:0,fontWeight:800,color:"#0f172a"},children:"Catálogo y Proformas"}),e.jsxs(mt,{children:[e.jsxs(fe,{onClick:Z,whileHover:{x:-4},children:[e.jsx(Ee,{size:14})," Regresar"]}),e.jsxs(fe,{onClick:D,disabled:F,children:[F?e.jsx(Ct,{size:14}):e.jsx(he,{size:14})," Actualizar"]})]})]}),e.jsxs(ft,{children:[e.jsxs(gt,{children:[e.jsxs(ge,{active:T==="nombre",onClick:()=>{var t;s("nombre"),j(""),(t=R.current)==null||t.focus()},children:[e.jsx(Te,{})," Nombre"]}),e.jsxs(ge,{active:T==="codigo",onClick:()=>{var t;s("codigo"),j(""),(t=R.current)==null||t.focus()},children:[e.jsx(ce,{})," Código"]})]}),e.jsxs(ht,{children:[e.jsx(pe,{color:"#94a3b8"}),e.jsx(ut,{ref:R,placeholder:T==="codigo"?"Escanea o escribe código...":"Escribe para buscar...",value:C,onChange:t=>j(t.target.value),autoFocus:!0}),e.jsxs("div",{onClick:()=>J(!0),style:{padding:"8px",cursor:"pointer",color:"#64748b",display:"flex",alignItems:"center",justifyContent:"center",borderLeft:"1px solid #e2e8f0",marginLeft:"5px"},title:"Usar Cámara",children:[e.jsx(ce,{size:18}),e.jsx(pe,{size:10,style:{marginLeft:-6,marginTop:-8}})," "]})]})]}),e.jsx(bt,{children:Y.map(t=>{var P,c;const a=t.id_producto||t.id,x=((P=g.find(M=>(M.id_producto||M.id)===a))==null?void 0:P.quantity)||0,r=Number(((c=f==null?void 0:f.totalByProduct)==null?void 0:c[a])||0),w=Math.max(0,Number(t.existencia||0)-x-r),h=w<=0;return e.jsxs(yt,{onClick:()=>!h&&ee(t),outOfStock:h,title:t.nombre,children:[e.jsx(jt,{outOfStock:h,lowstock:w<5&&!h,children:h?r>0?"En Caja":"Agotado":`Stock: ${w}`}),e.jsx(st,{productId:a,productName:t.nombre,onView:M=>G({isOpen:!0,imageUrl:M})}),e.jsxs("div",{style:{padding:"12px",flex:1,display:"flex",flexDirection:"column",gap:"4px"},children:[e.jsx("div",{style:{fontWeight:600,fontSize:"0.88rem",color:"#1e293b",lineHeight:"1.25",height:"2.5rem",overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"},children:t.nombre}),e.jsx("div",{style:{fontSize:"0.78rem",color:"#94a3b8",fontWeight:600},children:t.codigo||"S/C"}),e.jsxs("div",{style:{fontWeight:800,color:"#2563eb",fontSize:"1.05rem",marginTop:"auto"},children:["C$ ",parseFloat(t.precio_venta||t.precio||0).toFixed(2)]})]})]},a)})})]}),e.jsxs(pt,{isOpen:z,children:[e.jsxs("div",{style:{marginBottom:"20px"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("h3",{style:{margin:0,fontWeight:800,display:"flex",alignItems:"center",gap:10},children:[e.jsx(Ie,{color:"#3b82f6"})," Tu Proforma"]}),e.jsx("button",{onClick:()=>K(!1),style:{display:"none",background:"#f1f5f9",border:"none",padding:"8px",borderRadius:"8px",cursor:"pointer"},className:"mobile-close-btn",children:e.jsx(ue,{})}),e.jsx("style",{children:"@media(max-width: 960px) { .mobile-close-btn { display: block !important; } }"})]}),e.jsx("input",{style:{width:"100%",padding:"12px",marginTop:15,border:"2px solid #e2e8f0",borderRadius:12,outline:"none"},placeholder:"Nombre del Cliente",value:N,onChange:t=>$(t.target.value)}),e.jsx("input",{style:{width:"100%",padding:"12px",marginTop:10,border:"2px solid #e2e8f0",borderRadius:12,outline:"none"},placeholder:"Teléfono",value:V,onChange:t=>H(t.target.value.replace(/\D/g,""))})]}),e.jsx(wt,{children:g.length===0?e.jsxs("div",{style:{textAlign:"center",color:"#94a3b8",marginTop:40},children:[e.jsx(xe,{size:48,style:{opacity:.1,marginBottom:15}}),e.jsx("p",{children:"Agrega productos"})]}):g.map(t=>e.jsxs(vt,{children:[e.jsxs("div",{style:{flex:1},children:[e.jsx("div",{style:{fontWeight:600,fontSize:"0.9rem"},children:t.nombre}),e.jsxs("div",{style:{color:"#64748b",fontSize:"0.85rem"},children:["C$ ",parseFloat(t.precio_venta).toFixed(2)]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10},children:[e.jsxs(kt,{children:[e.jsx(ae,{onClick:()=>I(t.id,-1),children:e.jsx(Fe,{size:10})}),e.jsx("span",{style:{fontWeight:700},children:t.quantity}),e.jsx(ae,{onClick:()=>I(t.id,1),children:e.jsx(_e,{size:10})})]}),e.jsx(ae,{onClick:()=>k(a=>a.filter(x=>x.id!==t.id)),style:{color:"#ef4444"},children:e.jsx(Pe,{})})]})]},t.id))}),e.jsxs("div",{style:{borderTop:"2px dashed #e2e8f0",paddingTop:"20px",marginTop:"auto"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"1.5rem",fontWeight:900,marginBottom:20},children:[e.jsx("span",{children:"TOTAL"}),e.jsxs("span",{children:["C$ ",B.toFixed(2)]})]}),e.jsxs(je,{onClick:te,disabled:g.length===0||!N.trim(),children:[e.jsx(xe,{})," GENERAR PROFORMA PDF"]})]})]}),e.jsxs(Nt,{initial:{y:200},animate:{y:g.length>0?0:200},onClick:()=>K(!0),children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsx("div",{style:{background:"#3b82f6",borderRadius:"50%",width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.8rem"},children:g.reduce((t,a)=>t+a.quantity,0)}),e.jsx("span",{children:"Ver Pedido"})]}),e.jsxs("span",{children:["C$ ",B.toFixed(2)]})]}),e.jsx($e,{children:A.isOpen&&e.jsx(At,{isOpen:!0,imageSrc:A.imageUrl,onClose:()=>G({isOpen:!1,imageUrl:null})})}),O&&e.jsx(rt,{...L,onClose:()=>U(!1),setTicketData:()=>k([]),currentUser:o,client:L.client}),_&&e.jsx(Tt,{onClose:()=>J(!1),onScan:n})]})};export{Ot as default};

import{R as v,r as x,j as e,C as le,x as ve,a8 as ke,s as i,t as R,a9 as Ce,aa as Se,W as Ne,v as ze,X as Ae,ab as ge,a0 as Ee,a1 as de,$ as ce,G as Te,k as he,ac as pe,ad as Ie,Y as Fe,a5 as Pe,A as $e,m as ae,ae as Oe,a6 as _e,a7 as Re}from"./vendor-C4uQ3a2a.js";import{r as De}from"./searchEngine-BMYcElFi.js";import{a as Le,u as ue,e as Me,h as Be,i as We,j as qe,k as Ve,f as be}from"./index-DrTQe3aZ.js";import{h as He,E as Ge}from"./pdf-vendor-BMvqz6Um.js";import{H as Ue}from"./scanner-vendor-DfxRpMWJ.js";const Ye=R`from { opacity: 0; } to { opacity: 1; }`,Qe=R`from { transform: scale(0.95); } to { transform: scale(1); }`,Ke=R`0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }`,ne=i.div`
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px);
    display: flex; justify-content: center; align-items: center; z-index: 1100;
    animation: ${Ye} 0.2s;
`,re=i.div`
    background: white; padding: 2.5rem; border-radius: 24px;
    width: 95%; max-width: 680px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    animation: ${Qe} 0.3s;
    max-height: 90vh; overflow-y: auto;

    @media (max-width: 768px) {
        padding: 1rem;
        border-radius: 12px;
    }
`,_=i.button`
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
`,te=i(ze)`animation: ${Ke} 1s linear infinite;`,Je=i.div`
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
`,Xe=i.div`
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
`,Ze=i.div`
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
`,et=i.table`
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
`,tt=i.div`
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
`,ot=i.div`
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
`,nt=({title:n,message:f,type:u="info",onClose:p})=>{const r=()=>u==="error"?"#ef4444":u==="success"?"#10b981":"#3b82f6",b=()=>u==="error"?e.jsx(Ce,{size:40,color:r()}):u==="success"?e.jsx(Se,{size:40,color:r()}):e.jsx(Ne,{size:40,color:r()});return e.jsx(ne,{style:{zIndex:2e3},children:e.jsxs(re,{style:{maxWidth:"350px",textAlign:"center",padding:"2rem"},children:[e.jsx("div",{style:{marginBottom:"1rem"},children:b()}),e.jsx("h3",{style:{color:"#1e293b",margin:"0 0 10px 0"},children:n}),e.jsx("p",{style:{color:"#64748b",fontSize:"0.95rem",margin:"0 0 20px 0"},children:f}),e.jsx(_,{onClick:p,style:{width:"100%",padding:"12px"},children:"Entendido"})]})})},rt=({cart:n=[],total:f=0,subtotal:u=0,discount:p=0,proformaFor:r="",proformaNumber:b="",onClose:s,setTicketData:g,currentUser:y,client:w})=>{const[j,k]=v.useState(!1),D=x.useRef(null),{settings:l}=Le(),{cajaSession:S,user:N}=ue()||{},[I,P]=v.useState(!1),[V,H]=v.useState(!1),[L,G]=v.useState([]),[$,U]=v.useState(""),[F,M]=v.useState(null),[T,B]=v.useState({isOpen:!1,title:"",message:"",type:"info"}),z=(o,d,c="info")=>{B({isOpen:!0,title:o,message:d,type:c})},W=()=>{B(o=>({...o,isOpen:!1})),T.type==="success"&&(g(),s&&s())},A=o=>new Intl.NumberFormat("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(o||0)),Q=(o=>(o==null?void 0:o.usuarioNombre)||(o==null?void 0:o.nombre)||"Empleado")(y),O=(w==null?void 0:w.nombre)||r||"Consumidor Final",K=(w==null?void 0:w.telefono)||"N/D",q=v.useMemo(()=>l!=null&&l.empresa_logo_url?l.empresa_logo_url.startsWith("http")?l.empresa_logo_url:`${"https://sistema.multirepuestosrg.com/api".replace(/\/api$/,"")}${l.empresa_logo_url.startsWith("/")?"":"/"}${l.empresa_logo_url}`:null,[l==null?void 0:l.empresa_logo_url]),C={name:(l==null?void 0:l.empresa_nombre)||"Multirepuestos RG",ruc:(l==null?void 0:l.empresa_ruc)||"1211812770001E",phone:(l==null?void 0:l.empresa_telefono)||"84031936 / 84058142",address:(l==null?void 0:l.empresa_direccion)||"Del portón de la normal 75 varas al este. Juigalpa, Chontales.",slogan:(l==null?void 0:l.empresa_eslogan)||"Tu mejor opción en repuestos de moto y carro",logo:q||new URL("/icons/logo.png",window.location.origin).toString()};v.useEffect(()=>{U(`Pedido - ${O}`)},[O]);const J=async()=>{if(n.length===0)return;k(!0);const o=D.current,d=O.replace(/\s/g,"_").replace(/[^a-zA-Z0-9_]/g,""),c=b.trim()?`N${b.trim()}`:"TEMP",h=`PROFORMA_${d}_${c}.pdf`,a=o.cloneNode(!0);a.classList.add("proforma-to-print"),a.style.position="absolute",a.style.left="-9999px",a.style.top="0",a.style.width="794px",a.style.padding="40px",a.style.boxSizing="border-box",a.style.background="#ffffff",a.style.boxShadow="none",a.style.border="none",document.body.appendChild(a);try{const m=await He(a,{scale:2,useCORS:!0,windowWidth:794}),Z=m.toDataURL("image/jpeg",1),ie=new Ge("p","mm","a4"),se=210,we=m.height*se/m.width;ie.addImage(Z,"JPEG",0,0,se,we),ie.save(h),g()}catch(m){console.error("Error al generar PDF:",m),z("Error","❌ Error al generar y descargar el PDF.","error")}finally{document.body.contains(a)&&document.body.removeChild(a),k(!1),s&&s()}},X=async()=>{var d,c;if(n.length===0)return;P(!0);const o=localStorage.getItem("token");try{const h=await Me(o);let a=(h==null?void 0:h.abiertas)||[];if(a.length===0&&S&&!S.closedAt){const m=((d=S.openedBy)==null?void 0:d.id)||((N==null?void 0:N.id_usuario)??(N==null?void 0:N.id)),Z=((c=S.openedBy)==null?void 0:c.name)||(N==null?void 0:N.nombre_usuario)||"Cajero";a=[{id:S.id,openedAt:S.openedAt,openedBy:{id:m,name:Z}}]}if(a.length===0){z("Atención","⚠️ No hay cajas abiertas en este momento. Abre una caja primero desde el POS antes de enviar el pedido.","warning"),P(!1);return}G(a),a.length>0&&M(a[0].openedBy.id),H(!0),P(!1)}catch(h){console.error("Error fetching sessions:",h),z("Error","❌ Error al buscar cajas activas.","error"),P(!1)}},t=async()=>{if(!F)return z("Atención","Seleccione una caja.","warning");if(!$.trim())return z("Atención","Ingrese un nombre para el ticket.","warning");P(!0);const o=localStorage.getItem("token");try{const d=await Be(F,o)||[],c={id:Date.now(),name:$,items:n,createdAt:new Date().toISOString(),createdBy:Q},a=[...Array.isArray(d)?d:[],c];await We(F,a,o),H(!1),z("Éxito",`✅ Ticket "${$}" enviado exitosamente a la caja.`,"success")}catch(d){console.error("Error sending ticket:",d),z("Error","❌ Error al enviar el ticket a la caja. Intente de nuevo.","error")}finally{P(!1)}};return e.jsxs(v.Fragment,{children:[e.jsx(ne,{style:{zIndex:V||T.isOpen?1099:1100},children:e.jsx(re,{children:e.jsxs(Je,{ref:D,children:[e.jsxs(Xe,{children:[e.jsx("div",{className:"brand-logo-container",children:e.jsx("img",{src:C.logo,alt:"Logo",className:"logo",onError:o=>{o.currentTarget.style.display="none"}})}),e.jsxs("div",{className:"brand-info",children:[e.jsx("h1",{children:C.name}),e.jsx("small",{children:C.slogan}),e.jsxs("small",{children:["RUC: ",C.ruc]}),e.jsxs("small",{children:["Tel: ",C.phone]}),e.jsx("small",{children:C.address}),e.jsx("div",{children:e.jsxs("span",{className:"proforma-tag",children:[e.jsx(le,{style:{marginRight:4,verticalAlign:"middle"}})," COTIZACIÓN / PROFORMA"]})})]})]}),e.jsxs(Ze,{children:[e.jsxs("div",{className:"meta-col",children:[e.jsx("span",{className:"meta-title",children:"Detalles"}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Fecha:"}),e.jsxs("span",{className:"meta-value",children:[new Date().toLocaleDateString("es-NI")," ",new Date().toLocaleTimeString("es-NI",{hour:"2-digit",minute:"2-digit"})]})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"ID Temp:"}),e.jsx("span",{className:"meta-value",children:Date.now().toString().slice(-6)})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Atendido por:"}),e.jsx("span",{className:"meta-value",children:Q})]})]}),e.jsxs("div",{className:"meta-col",children:[e.jsx("span",{className:"meta-title",children:"Cliente"}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Nombre:"}),e.jsx("span",{className:"meta-value",children:O})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Teléfono:"}),e.jsx("span",{className:"meta-value",children:K})]})]})]}),e.jsxs(et,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{className:"col-qty",children:"CANT."}),e.jsx("th",{children:"DESCRIPCIÓN"}),e.jsx("th",{className:"col-unit",children:"PRECIO UNIT."}),e.jsx("th",{className:"col-total",children:"TOTAL"})]})}),e.jsx("tbody",{children:n.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:"4",style:{textAlign:"center",color:"#777"},children:"No hay artículos."})}):n.map((o,d)=>{const c=parseFloat(o.precio_venta??o.precio??0),h=parseFloat(o.quantity??0);return e.jsxs("tr",{children:[e.jsx("td",{className:"col-qty",children:h}),e.jsx("td",{children:o.nombre||"Artículo sin nombre"}),e.jsxs("td",{className:"col-unit",children:["C$ ",A(c)]}),e.jsxs("td",{className:"col-total",children:["C$ ",A(h*c)]})]},d)})})]}),e.jsxs(tt,{children:[e.jsxs("div",{className:"note-section",children:[e.jsx("p",{children:e.jsx("strong",{children:"Nota:"})}),e.jsxs("p",{children:['"',C.slogan,'"']}),e.jsx("p",{children:"Precios sujetos a cambios y stock. Válido por 3 días."}),e.jsx("p",{style:{whiteSpace:"pre-line",marginTop:"5px",fontWeight:"bold"},children:(l==null?void 0:l.ticket_proforma_footer)||"¡Gracias por cotizar con nosotros!"})]}),e.jsxs(ot,{children:[e.jsxs(ee,{children:[e.jsx("span",{children:"Subtotal:"}),e.jsxs("span",{className:"text-right",children:["C$ ",A(u)]})]}),p>0&&e.jsxs(ee,{style:{color:"#dc3545"},children:[e.jsx("span",{children:"Descuento:"}),e.jsxs("span",{className:"text-right",children:["- C$ ",A(p)]})]}),e.jsxs(ee,{className:"grand-total",children:[e.jsx("span",{children:"TOTAL:"}),e.jsxs("span",{className:"text-right",children:["C$ ",A(f)]})]}),e.jsx("div",{className:"badge-container",children:e.jsx("span",{className:"badge",children:"DOCUMENTO NO VÁLIDO COMO FACTURA"})})]})]}),e.jsxs("div",{className:"footer-actions",style:{display:"flex",gap:"1rem",marginTop:"1rem",flexWrap:"wrap"},children:[e.jsxs(_,{$cancel:!0,onClick:s,style:{flex:1},disabled:j||I,children:[e.jsx(ve,{})," Cerrar"]}),e.jsxs(_,{onClick:X,disabled:n.length===0||j||I,style:{flex:1,background:"#f59e0b"},children:[I?e.jsx(te,{}):e.jsx(le,{}),"ENVIAR A CAJA"]}),e.jsxs(_,{onClick:J,disabled:n.length===0||j||I,style:{flex:1,background:"#059669"},children:[j?e.jsx(te,{}):e.jsx(ke,{}),"PDF"]})]})]})})}),V&&e.jsx(ne,{style:{zIndex:1200},children:e.jsxs(re,{style:{maxWidth:"400px",textAlign:"center"},children:[e.jsx("h3",{style:{color:"#0f172a",marginBottom:"1rem"},children:"Enviar Pedido a Caja"}),e.jsxs("div",{style:{textAlign:"left",marginBottom:"1rem"},children:[e.jsx("label",{style:{display:"block",marginBottom:"5px",fontWeight:"bold",fontSize:"0.9rem"},children:"Nombre del Ticket:"}),e.jsx("input",{type:"text",value:$,onChange:o=>U(o.target.value),style:{width:"100%",padding:"10px",borderRadius:"8px",border:"1px solid #ccc"}})]}),e.jsxs("div",{style:{textAlign:"left",marginBottom:"1.5rem"},children:[e.jsx("label",{style:{display:"block",marginBottom:"5px",fontWeight:"bold",fontSize:"0.9rem"},children:"Seleccionar Caja:"}),e.jsx("select",{value:F||"",onChange:o=>M(o.target.value),style:{width:"100%",padding:"10px",borderRadius:"8px",border:"1px solid #ccc"},children:L.map(o=>e.jsxs("option",{value:o.openedBy.id,children:[o.openedBy.name," - (Abierta: ",new Date(o.openedAt).toLocaleTimeString(),")"]},o.openedBy.id))})]}),e.jsxs("div",{style:{display:"flex",gap:"10px"},children:[e.jsx(_,{$cancel:!0,onClick:()=>H(!1),style:{flex:1},children:"Cancelar"}),e.jsx(_,{onClick:t,disabled:I,style:{flex:1},children:I?e.jsx(te,{}):"Enviar Ticket"})]})]})}),T.isOpen&&e.jsx(nt,{title:T.title,message:T.message,type:T.type,onClose:W})]})},E=new Map;async function xe(n,f=4){const u=localStorage.getItem("token"),p=n.filter(s=>{const g=E.get(s);return!g||g!=="loading"&&g!=="none"});let r=0;async function b(){if(r>=p.length)return;const s=p[r++];if(E.has(s))return b();E.set(s,"loading");try{const g=await be(s,u),y=(g==null?void 0:g.imagen)||"none";E.set(s,y),window.dispatchEvent(new CustomEvent(`image_loaded_${s}`,{detail:y}))}catch{E.set(s,"none"),window.dispatchEvent(new CustomEvent(`image_loaded_${s}`,{detail:"none"}))}return b()}await Promise.all(Array.from({length:f},b))}function at(n){const[f,u]=v.useState(()=>{const r=E.get(n);return r&&r!=="loading"&&r!=="none"?r:null}),p=v.useRef(null);return v.useEffect(()=>{const r=E.get(n);if(r&&r!=="loading"&&r!=="none"){u(r);return}if(r==="none")return;const b=g=>{const y=g.detail;y&&y!=="none"&&u(y)};window.addEventListener(`image_loaded_${n}`,b);const s=new IntersectionObserver(g=>{if(g[0].isIntersecting){const y=E.get(n);if(!y||y!=="loading"&&y!=="none"){const w=localStorage.getItem("token");E.set(n,"loading"),be(n,w).then(j=>{const k=(j==null?void 0:j.imagen)||"none";E.set(n,k),k!=="none"&&u(k),window.dispatchEvent(new CustomEvent(`image_loaded_${n}`,{detail:k}))}).catch(()=>{E.set(n,"none"),window.dispatchEvent(new CustomEvent(`image_loaded_${n}`,{detail:"none"}))})}}},{rootMargin:"200px"});return p.current&&s.observe(p.current),()=>{s.disconnect(),window.removeEventListener(`image_loaded_${n}`,b)}},[n]),{imgSrc:f,ref:p}}function it({productId:n,productName:f,onView:u}){const{imgSrc:p,ref:r}=at(n);return e.jsxs("div",{ref:r,style:{height:160,background:"#f8fafc",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"},children:[p&&e.jsx("div",{className:"eye-icon",onClick:b=>{b.stopPropagation(),u(p)},style:{position:"absolute",top:10,left:10,zIndex:20,background:"white",borderRadius:"50%",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 6px rgba(0,0,0,0.1)",cursor:"pointer"},title:"Ver imagen",children:e.jsx(_e,{size:14,color:"#64748b"})}),p?e.jsx("img",{src:p,alt:f,style:{width:"100%",height:"100%",objectFit:"contain"}}):e.jsx(Re,{size:40,color:"#e2e8f0"})]})}const st=R`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;R`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;R`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;const lt=i.div`
    display: flex; height: 100vh; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); font-family: 'Inter', sans-serif; overflow: hidden;
    @media (max-width: 960px) { flex-direction: column; overflow-y: auto; height: 100vh; } 
    /* Force height 100vh on mobile to avoid double scrollbars with drawer */
`,dt=i.div`
    flex: 1; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; overflow-y: hidden;
    @media (max-width: 960px) { padding: 12px; height: 100%; overflow-y: auto; padding-bottom: 80px; /* Space for FAB */ }
`,ct=i.div`
    width: 420px; background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(16px); padding: 1.5rem; display: flex; flex-direction: column; box-shadow: -10px 0 30px rgba(0,0,0,0.03); border-left: 1px solid rgba(255,255,255,0.5); z-index: 100;
    
    @media (max-width: 960px) { 
        position: fixed; inset: 0; width: 100%; height: 100%;
        background: white; border-left: none; padding: 15px;
        transform: translateY(${n=>n.isOpen?"0":"100%"});
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        display: flex; /* Always display but hide via transform */
    }
`,pt=i.div` 
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;
`,xt=i.div`
    display: flex; gap: 10px;
`,me=i(ae.button)`
    background: white; border: 1px solid #e2e8f0; color: #64748b; padding: 8px 16px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 0.9rem;
    &:hover { background: #f8fafc; color: #334155; border-color: #cbd5e1; }
`,mt=i.div`
    background: white; padding: 1.5rem; border-radius: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); display: flex; flex-direction: column; gap: 12px; border: 1px solid #f1f5f9;
    @media (max-width: 960px) { padding: 1rem; border-radius: 16px; position: sticky; top: 0; z-index: 50; }
`,ft=i.div` display: flex; gap: 10px; `,fe=i.button`
    flex: 1; padding: 10px; border-radius: 12px; border: 1px solid ${n=>n.active?"#3b82f6":"#e2e8f0"};
    background: ${n=>n.active?"#eff6ff":"white"}; color: ${n=>n.active?"#2563eb":"#64748b"};
    font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s;
    &:hover { border-color: #3b82f6; }
`,gt=i.div`
    display: flex; align-items: center; background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 14px; padding: 0 15px; transition: all 0.2s;
    &:focus-within { border-color: #3b82f6; background: white; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
`,ht=i.input` flex: 1; padding: 12px 0; border: none; background: transparent; outline: none; font-size: 1rem; color: #1e293b; `,ut=i.div`
    display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); 
    grid-auto-rows: min-content; align-content: start;
    gap: 1.25rem; overflow-y: auto; padding-bottom: 30px; flex: 1;
    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
    @media (max-width: 768px) { grid-template-columns: repeat(2, 1fr); gap: 10px; padding-bottom: 80px; }
`,bt=i.div`
    background: white; border-radius: 18px; border: 1px solid #f1f5f9; display: flex; flex-direction: column; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; position: relative; overflow: hidden;
    &:hover { transform: translateY(-4px); border-color: #3b82f680; box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.08); .eye-icon { opacity: 1; transform: scale(1); } }
    ${n=>n.outOfStock&&Oe` opacity: 0.6; filter: grayscale(0.5); background: #f8fafc; `}
    
    @media (max-width: 768px) { border-radius: 14px; } 
    /* Mobile optimization */
`,yt=i.div`
  position: absolute; top: 10px; right: 10px; background: ${n=>n.outOfStock?"#ef4444":n.lowstock?"#f59e0b":"#10b981"};
  color: white; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 30px; z-index: 10; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  @media (max-width: 768px) { font-size: 0.65rem; padding: 3px 8px; }
`,jt=i.div` flex: 1; overflow-y: auto; margin-top: 15px; padding-right: 5px; &::-webkit-scrollbar { width: 4px; } `,wt=i.div`
    display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: white; margin-bottom: 10px; border-radius: 16px; border: 1px solid #f1f5f9;
`,vt=i.div`
    display: flex; align-items: center; gap: 10px; background: #f8fafc; padding: 6px; border-radius: 12px; border: 1px solid #f1f5f9;
`,oe=i.button`
    width: 32px; height: 32px; border-radius: 10px; border: none; background: white; color: #64748b; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05); cursor: pointer; transition: all 0.2s;
    &:hover { color: #3b82f6; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
`,ye=i.button`
    background: ${n=>n.bg||"#3b82f6"}; color: white; border: none; padding: 16px; border-radius: 16px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 1rem; width: 100%; transition: all 0.2s;
    &:disabled { opacity: 0.5; cursor: not-allowed; } 
    &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
`,kt=i(ge)` animation: ${st} 1s linear infinite; `,je=i.div`
  position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 5000;
`,Ct=i.div`
  background: white; padding: 20px; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 90%; max-width: 500px; max-height: 90vh; overflow-y: auto; position: relative;
`,St=i(ae.button)`
    display: none;
    @media (max-width: 960px) {
        display: flex; align-items: center; justify-content: space-between;
        position: fixed; bottom: 20px; left: 20px; right: 20px;
        background: #0f172a; color: white;
        padding: 16px 24px; border-radius: 16px; border: none;
        box-shadow: 0 10px 25px rgba(15, 23, 42, 0.4);
        z-index: 90; font-weight: 700; font-size: 1rem; cursor: pointer;
    }
`,Nt=({isOpen:n,imageSrc:f,onClose:u})=>!n||!f?null:e.jsx(je,{onClick:u,children:e.jsxs(ae.div,{initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},onClick:p=>p.stopPropagation(),style:{position:"relative",maxWidth:"95%",maxHeight:"90vh"},children:[e.jsx("button",{onClick:u,style:{position:"absolute",top:-15,right:-15,background:"white",width:32,height:32,borderRadius:"50%",border:"none",cursor:"pointer",boxShadow:"0 4px 10px rgba(0,0,0,0.2)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10,color:"#ef4444"},children:e.jsx(he,{})}),e.jsx("img",{src:f,alt:"Vista Completa",style:{maxWidth:"100%",maxHeight:"85vh",borderRadius:"16px",boxShadow:"0 20px 40px rgba(0,0,0,0.3)",display:"block",background:"white",objectFit:"contain"}})]})}),zt=i.div`
  width: 100%;
  height: 350px;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`,At=i.div`
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
`,Et=({onClose:n,onScan:f})=>{const u=x.useRef(null);return v.useEffect(()=>{const p="reader-custom",r=new Ue(p);u.current=r;const b=async()=>{try{await r.start({facingMode:"environment"},{fps:10,qrbox:{width:250,height:250},aspectRatio:1},s=>{r.stop().then(()=>{r.clear(),f(s)}).catch(g=>{console.error("Failed to stop scanner",g),f(s)})},s=>{})}catch(s){console.error("Error starting camera",s),alert("No se pudo iniciar la cámara. Verifique permisos."),n()}};return setTimeout(()=>b(),100),()=>{r.isScanning?r.stop().then(()=>r.clear()).catch(console.error):r.clear()}},[f,n]),e.jsx(je,{style:{zIndex:6e3},onClick:n,children:e.jsx(Ct,{onClick:p=>p.stopPropagation(),style:{padding:"0",width:"90%",maxWidth:"380px",background:"transparent",boxShadow:"none",border:"none"},children:e.jsxs("div",{style:{background:"white",borderRadius:"16px",padding:"16px",boxShadow:"0 20px 25px -5px rgba(0, 0, 0, 0.1)"},children:[e.jsx("h3",{style:{margin:"0 0 12px",textAlign:"center",fontSize:"1.2rem"},children:"Escanear Producto"}),e.jsxs(zt,{children:[e.jsx("div",{id:"reader-custom",style:{width:"100%",height:"100%"}}),e.jsx(At,{})]}),e.jsx("p",{style:{textAlign:"center",fontSize:"0.85rem",color:"#64748b",marginTop:"12px"},children:"Apunta la cámara al código de barras"}),e.jsx(ye,{bg:"#ef4444",onClick:n,style:{marginTop:"15px"},children:"Cancelar"})]})})})},Ot=()=>{const{user:n,products:f}=ue(),{cajaSession:u}=qe(),p=localStorage.getItem("token"),[r,b]=x.useState(f||[]),[s,g]=x.useState([]),[y,w]=x.useState(""),[j,k]=x.useState("nombre"),[D,l]=x.useState(!1),[S,N]=x.useState(""),[I,P]=x.useState(""),[V,H]=x.useState(""),[L,G]=x.useState(!1),[$,U]=x.useState(null),[F,M]=x.useState({isOpen:!1,imageUrl:null}),[T,B]=x.useState(!1),[z,W]=x.useState(!1),A=x.useRef(null);x.useEffect(()=>{f&&b(f)},[f]);const Y=x.useCallback(async()=>{l(!0);try{const t=await Ve(p);b(Array.isArray(t)?t:(t==null?void 0:t.data)||[])}catch(t){console.error(t)}finally{l(!1)}},[p]);x.useEffect(()=>{Y()},[Y]);const Q=()=>{window.location.href="/dashboard"},O=t=>{var d;if((((d=s.find(c=>c.id===t.id))==null?void 0:d.quantity)||0)>=t.existencia)return alert(`Stock máximo alcanzado (${t.existencia}).`);g(c=>c.find(a=>a.id===t.id)?c.map(a=>a.id===t.id?{...a,quantity:a.quantity+1}:a):[...c,{...t,quantity:1,precio_venta:parseFloat(t.precio_venta||t.precio||0)}])},K=(t,o)=>{g(d=>{const c=d.find(m=>m.id===t);if(!c)return d;const h=r.find(m=>m.id===t)||c,a=c.quantity+o;return a>h.existencia?(alert(`Stock máximo alcanzado (${h.existencia}).`),d):a<1?d.filter(m=>m.id!==t):d.map(m=>m.id===t?{...m,quantity:a}:m)})},q=x.useMemo(()=>{const t=j==="codigo";return De(r,y,t?["codigo"]:["nombre","codigo"],{strict:t}).slice(0,100)},[r,y,j]);x.useEffect(()=>{xe(q.map(t=>t.id_producto||t.id),6)},[q]),x.useEffect(()=>{if(!r.length)return;const t=setTimeout(()=>xe(r.map(o=>o.id_producto||o.id),2),1500);return()=>clearTimeout(t)},[r]);const C=x.useMemo(()=>s.reduce((t,o)=>t+parseFloat(o.precio_venta)*o.quantity,0),[s]);x.useEffect(()=>{const t=o=>{var d;L||F.isOpen||T||z||["INPUT","TEXTAREA","SELECT"].includes((d=document.activeElement)==null?void 0:d.tagName)||o.key.length>1||o.ctrlKey||o.altKey||o.metaKey||(o.preventDefault(),j!=="codigo"?(k("codigo"),w(o.key)):w(c=>c+o.key),A.current&&A.current.focus())};return window.addEventListener("keydown",t),()=>window.removeEventListener("keydown",t)},[L,F,T,j,z]);const J=()=>{if(!S.trim())return alert("El nombre del cliente es obligatorio.");U({cart:s,total:C,subtotal:C,discount:0,proformaNumber:V,client:{nombre:S,telefono:I||"N/D"}}),G(!0)},X=t=>{t&&(k("codigo"),w(t),W(!1))};return e.jsxs(lt,{children:[e.jsxs(dt,{children:[e.jsxs(pt,{children:[e.jsx("h2",{style:{margin:0,fontWeight:800,color:"#0f172a"},children:"Catálogo y Proformas"}),e.jsxs(xt,{children:[e.jsxs(me,{onClick:Q,whileHover:{x:-4},children:[e.jsx(Ae,{size:14})," Regresar"]}),e.jsxs(me,{onClick:Y,disabled:D,children:[D?e.jsx(kt,{size:14}):e.jsx(ge,{size:14})," Actualizar"]})]})]}),e.jsxs(mt,{children:[e.jsxs(ft,{children:[e.jsxs(fe,{active:j==="nombre",onClick:()=>{var t;k("nombre"),w(""),(t=A.current)==null||t.focus()},children:[e.jsx(Ee,{})," Nombre"]}),e.jsxs(fe,{active:j==="codigo",onClick:()=>{var t;k("codigo"),w(""),(t=A.current)==null||t.focus()},children:[e.jsx(de,{})," Código"]})]}),e.jsxs(gt,{children:[e.jsx(ce,{color:"#94a3b8"}),e.jsx(ht,{ref:A,placeholder:j==="codigo"?"Escanea o escribe código...":"Escribe para buscar...",value:y,onChange:t=>w(t.target.value),autoFocus:!0}),e.jsxs("div",{onClick:()=>W(!0),style:{padding:"8px",cursor:"pointer",color:"#64748b",display:"flex",alignItems:"center",justifyContent:"center",borderLeft:"1px solid #e2e8f0",marginLeft:"5px"},title:"Usar Cámara",children:[e.jsx(de,{size:18}),e.jsx(ce,{size:10,style:{marginLeft:-6,marginTop:-8}})," "]})]})]}),e.jsx(ut,{children:q.map(t=>{var a;const o=t.id_producto||t.id,d=((a=s.find(m=>(m.id_producto||m.id)===o))==null?void 0:a.quantity)||0,c=Math.max(0,Number(t.existencia||0)-d),h=c<=0;return e.jsxs(bt,{onClick:()=>!h&&O(t),outOfStock:h,title:t.nombre,children:[e.jsx(yt,{outOfStock:h,lowstock:c<5&&!h,children:h?"Agotado":`Stock: ${c}`}),e.jsx(it,{productId:o,productName:t.nombre,onView:m=>M({isOpen:!0,imageUrl:m})}),e.jsxs("div",{style:{padding:"12px",flex:1,display:"flex",flexDirection:"column",gap:"4px"},children:[e.jsx("div",{style:{fontWeight:600,fontSize:"0.88rem",color:"#1e293b",lineHeight:"1.25",height:"2.5rem",overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"},children:t.nombre}),e.jsx("div",{style:{fontSize:"0.78rem",color:"#94a3b8",fontWeight:600},children:t.codigo||"S/C"}),e.jsxs("div",{style:{fontWeight:800,color:"#2563eb",fontSize:"1.05rem",marginTop:"auto"},children:["C$ ",parseFloat(t.precio_venta||t.precio||0).toFixed(2)]})]})]},o)})})]}),e.jsxs(ct,{isOpen:T,children:[e.jsxs("div",{style:{marginBottom:"20px"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("h3",{style:{margin:0,fontWeight:800,display:"flex",alignItems:"center",gap:10},children:[e.jsx(Te,{color:"#3b82f6"})," Tu Proforma"]}),e.jsx("button",{onClick:()=>B(!1),style:{display:"none",background:"#f1f5f9",border:"none",padding:"8px",borderRadius:"8px",cursor:"pointer"},className:"mobile-close-btn",children:e.jsx(he,{})}),e.jsx("style",{children:"@media(max-width: 960px) { .mobile-close-btn { display: block !important; } }"})]}),e.jsx("input",{style:{width:"100%",padding:"12px",marginTop:15,border:"2px solid #e2e8f0",borderRadius:12,outline:"none"},placeholder:"Nombre del Cliente",value:S,onChange:t=>N(t.target.value)}),e.jsx("input",{style:{width:"100%",padding:"12px",marginTop:10,border:"2px solid #e2e8f0",borderRadius:12,outline:"none"},placeholder:"Teléfono",value:I,onChange:t=>P(t.target.value)})]}),e.jsx(jt,{children:s.length===0?e.jsxs("div",{style:{textAlign:"center",color:"#94a3b8",marginTop:40},children:[e.jsx(pe,{size:48,style:{opacity:.1,marginBottom:15}}),e.jsx("p",{children:"Agrega productos"})]}):s.map(t=>e.jsxs(wt,{children:[e.jsxs("div",{style:{flex:1},children:[e.jsx("div",{style:{fontWeight:600,fontSize:"0.9rem"},children:t.nombre}),e.jsxs("div",{style:{color:"#64748b",fontSize:"0.85rem"},children:["C$ ",parseFloat(t.precio_venta).toFixed(2)]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10},children:[e.jsxs(vt,{children:[e.jsx(oe,{onClick:()=>K(t.id,-1),children:e.jsx(Ie,{size:10})}),e.jsx("span",{style:{fontWeight:700},children:t.quantity}),e.jsx(oe,{onClick:()=>K(t.id,1),children:e.jsx(Fe,{size:10})})]}),e.jsx(oe,{onClick:()=>g(o=>o.filter(d=>d.id!==t.id)),style:{color:"#ef4444"},children:e.jsx(Pe,{})})]})]},t.id))}),e.jsxs("div",{style:{borderTop:"2px dashed #e2e8f0",paddingTop:"20px",marginTop:"auto"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"1.5rem",fontWeight:900,marginBottom:20},children:[e.jsx("span",{children:"TOTAL"}),e.jsxs("span",{children:["C$ ",C.toFixed(2)]})]}),e.jsxs(ye,{onClick:J,disabled:s.length===0||!S.trim(),children:[e.jsx(pe,{})," GENERAR PROFORMA PDF"]})]})]}),e.jsxs(St,{initial:{y:200},animate:{y:s.length>0?0:200},onClick:()=>B(!0),children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsx("div",{style:{background:"#3b82f6",borderRadius:"50%",width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.8rem"},children:s.reduce((t,o)=>t+o.quantity,0)}),e.jsx("span",{children:"Ver Pedido"})]}),e.jsxs("span",{children:["C$ ",C.toFixed(2)]})]}),e.jsx($e,{children:F.isOpen&&e.jsx(Nt,{isOpen:!0,imageSrc:F.imageUrl,onClose:()=>M({isOpen:!1,imageUrl:null})})}),L&&e.jsx(rt,{...$,onClose:()=>G(!1),setTicketData:()=>g([]),currentUser:n,client:$.client}),z&&e.jsx(Et,{onClose:()=>W(!1),onScan:X})]})};export{Ot as default};

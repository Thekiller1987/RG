const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/POS-D72COMfA.js","assets/vendor-B-pOHZxB.js","assets/scanner-vendor-DfxRpMWJ.js","assets/SecretAdjustModal-BP9ADvV1.js","assets/POS.styles-Bz1HfwTU.js","assets/AlertModal-DN-lJRTs.js","assets/index-C9q57MBf.js","assets/pdf-vendor-DGlygaeZ.js","assets/index-CJIrVlr0.css","assets/SalesHistoryModal-BqcGqdHD.js","assets/ConfirmationModal-Bd2BPeD6.js","assets/InventoryManagement-CEQqQPp4.js","assets/InventoryOutflowPage-DV8WS8Yc.js","assets/ClientesYCreditos-v9s4Ior6.js","assets/FacturasProveedores-BfPieOXR.js","assets/PedidosYApartados-CGacck8R.js"])))=>i.map(i=>d[i]);
import{_ as w}from"./pdf-vendor-DGlygaeZ.js";import{r as l,j as e,w as D,x as W,y as q,C as V,D as H,s as o,E as A,u as Y,A as J,n as K,i as Q,m as G,G as X,H as Z,I as ee,J as I,K as oe,L as re,M as se,O as ne,P as ae,Q as te,S as ie,T as le,U as ce}from"./vendor-B-pOHZxB.js";import{a as de,b as pe,c as xe,u as B}from"./index-C9q57MBf.js";import{C as he}from"./ConfirmationModal-Bd2BPeD6.js";import"./scanner-vendor-DfxRpMWJ.js";import"./POS.styles-Bz1HfwTU.js";const me=o.div`
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(2px);
    animation: fadeIn 0.2s ease-out;
`,ue=o.div`
    background: white;
    width: 90%; max-width: 800px;
    max-height: 90vh; overflow-y: auto;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    display: flex; flex-direction: column;
`,fe=o.div`
    padding: 1.25rem;
    border-bottom: 1px solid #e2e8f0;
    display: flex; justify-content: space-between; align-items: center;
    h2 { margin: 0; font-size: 1.25rem; color: #1e293b; display: flex; align-items: center; gap: 10px; }
`,ge=o.div`padding: 1.5rem;`,be=o.div`
    display: flex; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 1px solid #e2e8f0;
`,L=o.button`
    padding: 0.75rem 1rem;
    background: none; border: none;
    border-bottom: 3px solid ${r=>r.active?"#007bff":"transparent"};
    color: ${r=>r.active?"#007bff":"#64748b"};
    font-weight: 600; cursor: pointer;
    display: flex; align-items: center; gap: 8px;
    &:hover { color: #007bff; }
`,g=o.div`
    margin-bottom: 1.2rem;
    label { display: block; margin-bottom: 0.4rem; font-weight: 500; color: #334155; }
    input, textarea {
        width: 100%; padding: 0.75rem;
        border: 1px solid #cbd5e1; border-radius: 6px;
        font-family: inherit; font-size: 0.95rem;
        transition: border-color 0.2s;
        &:focus { outline: none; border-color: #007bff; box-shadow: 0 0 0 3px rgba(0,123,255,0.1); }
    }
    textarea { min-height: 80px; resize: vertical; }
    small { display: block; margin-top: 0.25rem; color: #64748b; font-size: 0.85rem; }
`,je=o.div`
    padding: 1.25rem; border-top: 1px solid #e2e8f0;
    display: flex; justify-content: flex-end; gap: 1rem;
    background: #f8fafc; border-radius: 0 0 12px 12px;
`,F=o.button`
    padding: 0.75rem 1.5rem;
    border-radius: 8px; border: none; font-weight: 600; cursor: pointer;
    display: flex; align-items: center; gap: 0.5rem;
    background: ${r=>r.primary?"#007bff":"#e2e8f0"};
    color: ${r=>r.primary?"white":"#475569"};
    &:hover { filter: brightness(0.95); }
    &:disabled { opacity: 0.7; cursor: not-allowed; }
`,ve=({isOpen:r,onClose:m})=>{const{settings:c,refreshSettings:u}=de(),y=localStorage.getItem("token"),[s,f]=l.useState({empresa_nombre:"",empresa_ruc:"",empresa_telefono:"",empresa_direccion:"",empresa_eslogan:"",empresa_logo_url:"",ticket_sales_footer:"",ticket_proforma_footer:"",ticket_transfer_footer:"",mayorista_pin:""}),[x,n]=l.useState("general"),[a,_]=l.useState(!1),[b,d]=l.useState(!1),[v,E]=l.useState(null);l.useEffect(()=>{r&&c&&(f(p=>({...p,...c})),c.empresa_logo_url&&E(c.empresa_logo_url))},[r,c]);const h=p=>{const{name:C,value:j}=p.target;f(S=>({...S,[C]:j}))},P=async()=>{_(!0);try{await xe(y,s),await u(),A.success("Configuración actualizada correctamente"),m()}catch(p){console.error(p),A.error("Error al guardar configuración")}finally{_(!1)}},z=async p=>{const C=p.target.files[0];if(C){d(!0);try{const j=await pe(y,C);E(j),f(S=>({...S,empresa_logo_url:j})),A.success("Logo subido correctamente")}catch(j){console.error(j),A.error("Error al subir el logo")}finally{d(!1)}}};return r?e.jsx(me,{onClick:m,children:e.jsxs(ue,{onClick:p=>p.stopPropagation(),children:[e.jsxs(fe,{children:[e.jsxs("h2",{children:[e.jsx(D,{})," Configuración del Sistema"]}),e.jsx(F,{onClick:m,style:{padding:"0.4rem"},children:e.jsx(W,{size:20})})]}),e.jsxs(ge,{children:[e.jsxs(be,{children:[e.jsxs(L,{active:x==="general",onClick:()=>n("general"),children:[e.jsx(q,{})," Datos Empresa"]}),e.jsxs(L,{active:x==="tickets",onClick:()=>n("tickets"),children:[e.jsx(V,{})," Personalización Tickets"]})]}),x==="general"&&e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"},children:[e.jsxs(g,{style:{gridColumn:"span 2"},children:[e.jsx("label",{children:"Nombre de la Empresa"}),e.jsx("input",{name:"empresa_nombre",value:s.empresa_nombre||"",onChange:h})]}),e.jsxs(g,{children:[e.jsx("label",{children:"RUC/Identificación"}),e.jsx("input",{name:"empresa_ruc",value:s.empresa_ruc||"",onChange:h})]}),e.jsxs(g,{children:[e.jsx("label",{children:"Teléfono(s)"}),e.jsx("input",{name:"empresa_telefono",value:s.empresa_telefono||"",onChange:h})]}),e.jsxs(g,{style:{gridColumn:"span 2"},children:[e.jsx("label",{children:"Dirección"}),e.jsx("textarea",{name:"empresa_direccion",value:s.empresa_direccion||"",onChange:h})]}),e.jsxs(g,{style:{gridColumn:"span 2"},children:[e.jsx("label",{children:"Eslogan / Frase"}),e.jsx("input",{name:"empresa_eslogan",value:s.empresa_eslogan||"",onChange:h})]}),e.jsxs(g,{style:{gridColumn:"span 2"},children:[e.jsx("label",{children:"Logo del Negocio (Aparecerá en Tickets)"}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"20px"},children:[e.jsx("div",{style:{width:"100px",height:"100px",border:"1px dashed #cbd5e1",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center",background:"#f8fafc",overflow:"hidden"},children:v?e.jsx("img",{src:v,alt:"Logo",style:{width:"100%",height:"100%",objectFit:"contain"}}):e.jsx("small",{style:{color:"#94a3b8"},children:"Sin Logo"})}),e.jsxs("div",{style:{flex:1},children:[e.jsx("input",{type:"file",accept:"image/*",onChange:z,id:"logo-upload",style:{display:"none"}}),e.jsx("label",{htmlFor:"logo-upload",style:{display:"inline-block",padding:"8px 16px",background:"#f1f5f9",border:"1px solid #cbd5e1",borderRadius:"8px",cursor:"pointer",fontWeight:"600",fontSize:"0.9rem"},children:b?"Subiendo...":"Seleccionar Imagen"}),e.jsx("p",{style:{margin:"5px 0 0 0",fontSize:"0.8rem",color:"#64748b"},children:"Recomendado: PNG fondo transparente (aprox 200x200px)"})]})]})]})]}),x==="tickets"&&e.jsxs("div",{children:[e.jsx("p",{style:{marginBottom:"1rem",color:"#64748b"},children:"Personaliza los mensajes que aparecen al final de tus documentos impresos."}),e.jsxs(g,{children:[e.jsx("label",{children:"Pie de Página: Factura de Venta"}),e.jsx("textarea",{name:"ticket_sales_footer",value:s.ticket_sales_footer||"",onChange:h,placeholder:"Ej: Gracias por su compra. No se aceptan devoluciones después de 30 días."}),e.jsx("small",{children:"Avisos legales, agradecimientos o políticas de devolución."})]}),e.jsxs(g,{children:[e.jsx("label",{children:"Pie de Página: Proforma"}),e.jsx("textarea",{name:"ticket_proforma_footer",value:s.ticket_proforma_footer||"",onChange:h,placeholder:"Ej: Cotización válida por 15 días. Sujeta a disponibilidad."}),e.jsx("small",{children:"Condiciones de validez de la oferta."})]}),e.jsxs(g,{children:[e.jsx("label",{children:"Pie de Página: Traslado / Salida"}),e.jsx("textarea",{name:"ticket_transfer_footer",value:s.ticket_transfer_footer||"",onChange:h,placeholder:"Ej: Salida autorizada por Gerencia."}),e.jsx("small",{children:"Notas internas o firmas requeridas."})]})]})]}),e.jsxs(je,{children:[e.jsx(F,{onClick:m,children:"Cancelar"}),e.jsxs(F,{primary:!0,onClick:P,disabled:a,children:[e.jsx(H,{})," ",a?"Guardando...":"Guardar Cambios"]})]})]})}):null},ye=o(G.div)`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`,_e=o(G.div)`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  position: relative;
  text-align: center;
`,Ce=o.h2`
  margin-top: 0;
  color: #1e293b;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`,ke=o.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1.5rem;
  text-align: center;
  letter-spacing: 5px;
  margin: 1.5rem 0;
  outline: none;
  font-family: monospace;
  
  &:focus {
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
  }
`,we=o.button`
  background: #8b5cf6;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  transition: background 0.2s;

  &:hover { background: #7c3aed; }
  &:disabled { background: #cbd5e1; cursor: not-allowed; }
`,Se=o.p`
  color: #ef4444;
  font-size: 0.9rem;
  margin-top: 5px;
  min-height: 1.5em;
`,Ee=o.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  font-size: 1.2rem;
  &:hover { color: #64748b; }
`;function Pe({isOpen:r,onClose:m}){const[c,u]=l.useState(""),[y,s]=l.useState(""),[f,x]=l.useState(!1),n=l.useRef(null),{token:a}=B(),_=Y();l.useEffect(()=>{r&&(u(""),s(""),setTimeout(()=>{var d;return(d=n.current)==null?void 0:d.focus()},100))},[r]);const b=d=>{d.preventDefault(),c&&(x(!0),s(""),c==="2004"?(m(),_("/wholesale-menu")):(s("PIN incorrecto"),u(""),x(!1)))};return r?e.jsx(J,{children:e.jsx(ye,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(_e,{initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},children:[e.jsx(Ee,{onClick:m,children:e.jsx(K,{})}),e.jsxs(Ce,{children:[e.jsx(Q,{color:"#8b5cf6"})," Acesso Mayorista"]}),e.jsx("p",{style:{color:"#64748b"},children:"Ingrese el PIN de seguridad"}),e.jsxs("form",{onSubmit:b,children:[e.jsx(ke,{ref:n,type:"password",maxLength:4,value:c,onChange:d=>{const v=d.target.value.replace(/\D/g,"");u(v),s("")},placeholder:"0000",disabled:f}),e.jsx(Se,{children:y}),e.jsx(we,{type:"submit",disabled:f||c.length<4,children:f?"Verificando...":"Ingresar"})]})]})})}):null}const T=o.div`
    padding: clamp(1rem, 5vw, 2.5rem); 
    background-color: #f0f2f5; 
    min-height: 100vh;
    box-sizing: border-box;
`,M=o.div`
    width: 100%;
    max-width: 1300px;
    margin: 0 auto;
`,Ae=o.div`
    display: flex;
    justify-content: space-between;
    align-items: center; 
    margin-bottom: 3rem; 
    gap: 1.5rem;
    flex-wrap: wrap;
`,ze=o.div`min-width: 0;`,R=o.h1`
    font-size: clamp(1.8rem, 4vw, 2.4rem); 
    color: #1e293b; 
    font-weight: 800;
    margin: 0;
    line-height: 1.2;
`,Fe=o.p`
    font-size: clamp(0.9rem, 2vw, 1.1rem);
    color: #64748b;
    margin: 0.4rem 0 0;
`,Ie=o.button`
    padding: 0.7rem 1.4rem;
    border: none; 
    background: #fecaca; 
    color: #dc2626; 
    border-radius: 12px;
    cursor: pointer;
    font-weight: 700;
    font-size: 1rem;
    transition: all 0.2s ease;
    display: inline-flex;
    gap: 0.6rem;
    align-items: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); 
    
    &:hover, &:focus { 
        background: #dc2626; 
        color: #fff; 
        box-shadow: 0 6px 10px rgba(220, 38, 38, 0.3); 
        transform: translateY(-2px);
        outline: none; 
    }
`,Le=o.main`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
    gap: clamp(1rem, 2vw, 1.5rem);
`,t=o(ce)`
    background-color: #ffffff;
    border-radius: 16px; 
    padding: 1.5rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08); 
    transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.25s ease; 
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
    min-height: 130px;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 6px;
        height: 100%;
        background-color: ${r=>r.color||"#007bff"};
    }

    &:hover, &:focus { 
        transform: translateY(-4px); 
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15); 
        outline: none; 
    }
    
    h2 { 
        margin: 0 0 .35rem 0; 
        font-size: 1.15rem; 
        color: #233547; 
        font-weight: 700; 
        letter-spacing: -0.5px;
    }
    p { 
        margin:0; 
        color:#6b7a86; 
        font-size: 1rem; 
    }
`,i=o.div` 
    font-size: 2.2rem; 
    margin-bottom: 0.75rem; 
    line-height:1; 
    color: ${r=>r.color||"#007bff"}; 
`,Be=()=>{const{user:r,logout:m}=B(),[c,u]=l.useState(!1),[y,s]=l.useState(!1),[f,x]=l.useState(!1);if(!r)return e.jsx(T,{children:e.jsx(M,{children:e.jsx(R,{children:"Cargando..."})})});const n=r.rol||"N/A",a=n==="Administrador"||n==="Admin",_=n==="Vendedor",b=n==="Encargado de Finanzas"||n==="Contador",d=n==="Encargado de Inventario",v=a,E=a||_,h=a||b,P=a||d,z=a||d,p=a||n==="Gerente"||b,C=a||n==="Gerente"||b,j=a,S=a||b,O=r.nombre_usuario||r.nombre||r.name||"Usuario",U=()=>{u(!0)},N=()=>{u(!1),m()},k=$=>{switch($){case"/pos":w(()=>import("./POS-D72COMfA.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10]));break;case"/inventory":w(()=>import("./InventoryManagement-CEQqQPp4.js"),__vite__mapDeps([11,1,2]));break;case"/traslados":w(()=>import("./InventoryOutflowPage-DV8WS8Yc.js"),__vite__mapDeps([12,1,2,6,7,8]));break;case"/credits":w(()=>import("./ClientesYCreditos-v9s4Ior6.js"),__vite__mapDeps([13,1,2,6,7,8,9,4,5]));break;case"/invoices":w(()=>import("./FacturasProveedores-BfPieOXR.js"),__vite__mapDeps([14,1,2,6,7,8]));break;case"/orders":w(()=>import("./PedidosYApartados-CGacck8R.js"),__vite__mapDeps([15,1,2,6,7,8]));break}};return e.jsxs(T,{children:[e.jsxs(M,{children:[e.jsxs(Ae,{children:[e.jsxs(ze,{children:[e.jsxs(R,{children:["Bienvenido, ",O," 👋"]}),e.jsxs(Fe,{children:["Rol: ",n,". Selecciona un módulo para empezar."]})]}),e.jsxs(Ie,{"aria-label":"Cerrar sesión",onClick:U,children:[e.jsx(X,{})," Cerrar sesión"]})]}),e.jsxs(Le,{children:[v&&e.jsxs(t,{to:"/pos",color:"#007bff",onMouseEnter:()=>k("/pos"),children:[e.jsx(i,{color:"#007bff",children:e.jsx(Z,{})}),e.jsx("h2",{children:"Punto de Venta"}),e.jsx("p",{children:"Registra ventas y gestiona transacciones diarias."})]}),v&&e.jsxs(t,{as:"div",onClick:()=>x(!0),color:"#8b5cf6",style:{cursor:"pointer"},children:[e.jsx(i,{color:"#8b5cf6",children:e.jsx(ee,{})}),e.jsx("h2",{children:"Venta Mayorista"}),e.jsx("p",{children:"Portal exclusivo para ventas al por mayor."})]}),E&&e.jsxs(t,{to:"/orders",color:"#ffc107",onMouseEnter:()=>k("/orders"),children:[e.jsx(i,{color:"#ffc107",children:e.jsx(V,{})}),e.jsx("h2",{children:"Proformas y precios"}),e.jsx("p",{children:"Crear Proformas y ver Productos"})]}),S&&e.jsxs(t,{to:"/invoices",color:"#e83e8c",onMouseEnter:()=>k("/invoices"),children:[e.jsx(i,{color:"#e83e8c",children:e.jsx(I,{})}),e.jsx("h2",{children:"Facturas Proveedores"}),e.jsx("p",{children:"Gestionar pagos, vencimientos y proveedores."})]}),h&&e.jsxs(t,{to:"/credits",color:"#17a2b8",onMouseEnter:()=>k("/credits"),children:[e.jsx(i,{color:"#17a2b8",children:e.jsx(oe,{})}),e.jsx("h2",{children:"Clientes y Créditos"}),e.jsx("p",{children:"Gestiona clientes, saldos pendientes y abonos."})]}),P&&e.jsxs(t,{to:"/inventory",color:"#28a745",onMouseEnter:()=>k("/inventory"),children:[e.jsx(i,{color:"#28a745",children:e.jsx(re,{})}),e.jsx("h2",{children:"Inventario"}),e.jsx("p",{children:"Controla el stock de tus productos y mercancía."})]}),z&&e.jsxs(t,{to:"/upload/inventory",color:"#6f42c1",children:[e.jsx(i,{color:"#6f42c1",children:e.jsx(se,{})}),e.jsx("h2",{children:"Carga Masiva"}),e.jsx("p",{children:"Actualiza inventario desde archivos CSV."})]}),P&&e.jsxs(t,{to:"/traslados",color:"#ef4444",onMouseEnter:()=>k("/traslados"),children:[e.jsx(i,{color:"#ef4444",children:e.jsx(ne,{})}),e.jsx("h2",{children:"Traslados / Salidas"}),e.jsx("p",{children:"Descontar mercancía por traslados o merma."})]}),p&&e.jsxs(t,{to:"/reports",color:"#6c757d",children:[e.jsx(i,{color:"#6c757d",children:e.jsx(ae,{})}),e.jsx("h2",{children:"Reportes"}),e.jsx("p",{children:"Visualiza el rendimiento general."})]}),C&&e.jsxs(t,{to:"/cash-report",color:"#dc3545",children:[e.jsx(i,{color:"#dc3545",children:e.jsx(te,{})}),e.jsx("h2",{children:"Gestión de Cajas"}),e.jsx("p",{children:"Cierres y arqueos de caja."})]}),p&&e.jsxs(t,{to:"/detailed-sales-report",color:"#6366f1",children:[e.jsx(i,{color:"#6366f1",children:e.jsx(I,{})}),e.jsx("h2",{children:"Reportes de Ventas Detallado"}),e.jsx("p",{children:"Ventas, devoluciones y rastreo por producto."})]}),j&&e.jsxs(t,{to:"/admin/users",color:"#ff6b6b",children:[e.jsx(i,{color:"#ff6b6b",children:e.jsx(ie,{})}),e.jsx("h2",{children:"Usuarios"}),e.jsx("p",{children:"Administra roles y accesos."})]}),e.jsxs(t,{to:"/solicitudes",color:"#fd7e14",children:[e.jsx(i,{color:"#fd7e14",children:e.jsx(le,{})}),e.jsx("h2",{children:"Solicitudes"}),e.jsx("p",{children:"Realizar pedidos y requerimientos."})]}),a&&e.jsxs(t,{as:"button",onClick:()=>s(!0),color:"#343a40",style:{textAlign:"left",border:"none",cursor:"pointer"},children:[e.jsx(i,{color:"#343a40",children:e.jsx(D,{})}),e.jsx("h2",{children:"Configuración"}),e.jsx("p",{children:"Datos de empresa y tickets."})]})]})]}),e.jsx(he,{isOpen:c,title:"Confirmar Cierre de Sesión",message:"¿Estás seguro de que quieres cerrar tu sesión actual?",onClose:()=>u(!1),onConfirm:N}),e.jsx(ve,{isOpen:y,onClose:()=>s(!1)}),e.jsx(Pe,{isOpen:f,onClose:()=>x(!1)})]})};export{Be as default};

const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/POS-CvAbhWwU.js","assets/vendor-Bl8eSE-Q.js","assets/scanner-vendor-DfxRpMWJ.js","assets/SecretAdjustModal-BCyVGBdL.js","assets/POS.styles-C4qzct5K.js","assets/AlertModal-C1eU8apX.js","assets/index-D4EmPGrI.js","assets/pdf-vendor-DV8V3V31.js","assets/index-CJIrVlr0.css","assets/SalesHistoryModal-ebIb_MX8.js","assets/ConfirmationModal-CKIKEjV-.js","assets/InventoryManagement-CQa3CLd3.js","assets/InventoryOutflowPage-BvbmCNzU.js","assets/ClientesYCreditos-CavmBiKf.js","assets/FacturasProveedores-DMyHzcoo.js","assets/PedidosYApartados-DCYOJcGB.js","assets/Finances-P2wkOVsR.js","assets/Empleados-DuSTOHvh.js"])))=>i.map(i=>d[i]);
import{_ as y}from"./pdf-vendor-DV8V3V31.js";import{r as l,j as e,w as D,x as Y,y as J,C as V,D as K,s as o,E as A,u as Q,A as X,n as Z,i as ee,m as G,G as oe,H as re,I as se,J as L,K as ne,L as ae,M as te,O as ie,P as le,Q as ce,S as de,T as pe,U as xe,V as he,W as me}from"./vendor-Bl8eSE-Q.js";import{a as ue,b as fe,c as ge,u as O}from"./index-D4EmPGrI.js";import{C as be}from"./ConfirmationModal-CKIKEjV-.js";import"./scanner-vendor-DfxRpMWJ.js";import"./POS.styles-C4qzct5K.js";const je=o.div`
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(2px);
    animation: fadeIn 0.2s ease-out;
`,ve=o.div`
    background: white;
    width: 90%; max-width: 800px;
    max-height: 90vh; overflow-y: auto;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    display: flex; flex-direction: column;
`,ye=o.div`
    padding: 1.25rem;
    border-bottom: 1px solid #e2e8f0;
    display: flex; justify-content: space-between; align-items: center;
    h2 { margin: 0; font-size: 1.25rem; color: #1e293b; display: flex; align-items: center; gap: 10px; }
`,_e=o.div`padding: 1.5rem;`,Ce=o.div`
    display: flex; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 1px solid #e2e8f0;
`,I=o.button`
    padding: 0.75rem 1rem;
    background: none; border: none;
    border-bottom: 3px solid ${r=>r.active?"#007bff":"transparent"};
    color: ${r=>r.active?"#007bff":"#64748b"};
    font-weight: 600; cursor: pointer;
    display: flex; align-items: center; gap: 8px;
    &:hover { color: #007bff; }
`,b=o.div`
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
`,ke=o.div`
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
`,we=({isOpen:r,onClose:u})=>{const{settings:c,refreshSettings:f}=ue(),k=localStorage.getItem("token"),[s,g]=l.useState({empresa_nombre:"",empresa_ruc:"",empresa_telefono:"",empresa_direccion:"",empresa_eslogan:"",empresa_logo_url:"",ticket_sales_footer:"",ticket_proforma_footer:"",ticket_transfer_footer:"",mayorista_pin:""}),[x,d]=l.useState("general"),[h,n]=l.useState(!1),[w,i]=l.useState(!1),[_,S]=l.useState(null);l.useEffect(()=>{r&&c&&(g(p=>({...p,...c})),c.empresa_logo_url&&S(c.empresa_logo_url))},[r,c]);const m=p=>{const{name:C,value:j}=p.target;g(E=>({...E,[C]:j}))},z=async()=>{n(!0);try{await ge(k,s),await f(),A.success("Configuración actualizada correctamente"),u()}catch(p){console.error(p),A.error("Error al guardar configuración")}finally{n(!1)}},P=async p=>{const C=p.target.files[0];if(C){i(!0);try{const j=await fe(k,C);S(j),g(E=>({...E,empresa_logo_url:j})),A.success("Logo subido correctamente")}catch(j){console.error(j),A.error("Error al subir el logo")}finally{i(!1)}}};return r?e.jsx(je,{onClick:u,children:e.jsxs(ve,{onClick:p=>p.stopPropagation(),children:[e.jsxs(ye,{children:[e.jsxs("h2",{children:[e.jsx(D,{})," Configuración del Sistema"]}),e.jsx(F,{onClick:u,style:{padding:"0.4rem"},children:e.jsx(Y,{size:20})})]}),e.jsxs(_e,{children:[e.jsxs(Ce,{children:[e.jsxs(I,{active:x==="general",onClick:()=>d("general"),children:[e.jsx(J,{})," Datos Empresa"]}),e.jsxs(I,{active:x==="tickets",onClick:()=>d("tickets"),children:[e.jsx(V,{})," Personalización Tickets"]})]}),x==="general"&&e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"},children:[e.jsxs(b,{style:{gridColumn:"span 2"},children:[e.jsx("label",{children:"Nombre de la Empresa"}),e.jsx("input",{name:"empresa_nombre",value:s.empresa_nombre||"",onChange:m})]}),e.jsxs(b,{children:[e.jsx("label",{children:"RUC/Identificación"}),e.jsx("input",{name:"empresa_ruc",value:s.empresa_ruc||"",onChange:m})]}),e.jsxs(b,{children:[e.jsx("label",{children:"Teléfono(s)"}),e.jsx("input",{name:"empresa_telefono",value:s.empresa_telefono||"",onChange:m})]}),e.jsxs(b,{style:{gridColumn:"span 2"},children:[e.jsx("label",{children:"Dirección"}),e.jsx("textarea",{name:"empresa_direccion",value:s.empresa_direccion||"",onChange:m})]}),e.jsxs(b,{style:{gridColumn:"span 2"},children:[e.jsx("label",{children:"Eslogan / Frase"}),e.jsx("input",{name:"empresa_eslogan",value:s.empresa_eslogan||"",onChange:m})]}),e.jsxs(b,{style:{gridColumn:"span 2"},children:[e.jsx("label",{children:"Logo del Negocio (Aparecerá en Tickets)"}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"20px"},children:[e.jsx("div",{style:{width:"100px",height:"100px",border:"1px dashed #cbd5e1",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center",background:"#f8fafc",overflow:"hidden"},children:_?e.jsx("img",{src:_,alt:"Logo",style:{width:"100%",height:"100%",objectFit:"contain"}}):e.jsx("small",{style:{color:"#94a3b8"},children:"Sin Logo"})}),e.jsxs("div",{style:{flex:1},children:[e.jsx("input",{type:"file",accept:"image/*",onChange:P,id:"logo-upload",style:{display:"none"}}),e.jsx("label",{htmlFor:"logo-upload",style:{display:"inline-block",padding:"8px 16px",background:"#f1f5f9",border:"1px solid #cbd5e1",borderRadius:"8px",cursor:"pointer",fontWeight:"600",fontSize:"0.9rem"},children:w?"Subiendo...":"Seleccionar Imagen"}),e.jsx("p",{style:{margin:"5px 0 0 0",fontSize:"0.8rem",color:"#64748b"},children:"Recomendado: PNG fondo transparente (aprox 200x200px)"})]})]})]})]}),x==="tickets"&&e.jsxs("div",{children:[e.jsx("p",{style:{marginBottom:"1rem",color:"#64748b"},children:"Personaliza los mensajes que aparecen al final de tus documentos impresos."}),e.jsxs(b,{children:[e.jsx("label",{children:"Pie de Página: Factura de Venta"}),e.jsx("textarea",{name:"ticket_sales_footer",value:s.ticket_sales_footer||"",onChange:m,placeholder:"Ej: Gracias por su compra. No se aceptan devoluciones después de 30 días."}),e.jsx("small",{children:"Avisos legales, agradecimientos o políticas de devolución."})]}),e.jsxs(b,{children:[e.jsx("label",{children:"Pie de Página: Proforma"}),e.jsx("textarea",{name:"ticket_proforma_footer",value:s.ticket_proforma_footer||"",onChange:m,placeholder:"Ej: Cotización válida por 15 días. Sujeta a disponibilidad."}),e.jsx("small",{children:"Condiciones de validez de la oferta."})]}),e.jsxs(b,{children:[e.jsx("label",{children:"Pie de Página: Traslado / Salida"}),e.jsx("textarea",{name:"ticket_transfer_footer",value:s.ticket_transfer_footer||"",onChange:m,placeholder:"Ej: Salida autorizada por Gerencia."}),e.jsx("small",{children:"Notas internas o firmas requeridas."})]})]})]}),e.jsxs(ke,{children:[e.jsx(F,{onClick:u,children:"Cancelar"}),e.jsxs(F,{primary:!0,onClick:z,disabled:h,children:[e.jsx(K,{})," ",h?"Guardando...":"Guardar Cambios"]})]})]})}):null},Se=o(G.div)`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`,Ee=o(G.div)`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  position: relative;
  text-align: center;
`,Pe=o.h2`
  margin-top: 0;
  color: #1e293b;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`,Ae=o.input`
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
`,ze=o.button`
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
`,Fe=o.p`
  color: #ef4444;
  font-size: 0.9rem;
  margin-top: 5px;
  min-height: 1.5em;
`,Le=o.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  font-size: 1.2rem;
  &:hover { color: #64748b; }
`;function Ie({isOpen:r,onClose:u}){const[c,f]=l.useState(""),[k,s]=l.useState(""),[g,x]=l.useState(!1),d=l.useRef(null),{token:h}=O(),n=Q();l.useEffect(()=>{r&&(f(""),s(""),setTimeout(()=>{var i;return(i=d.current)==null?void 0:i.focus()},100))},[r]);const w=i=>{i.preventDefault(),c&&(x(!0),s(""),c==="2004"?(u(),n("/wholesale-menu")):(s("PIN incorrecto"),f(""),x(!1)))};return r?e.jsx(X,{children:e.jsx(Se,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(Ee,{initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},children:[e.jsx(Le,{onClick:u,children:e.jsx(Z,{})}),e.jsxs(Pe,{children:[e.jsx(ee,{color:"#8b5cf6"})," Acesso Mayorista"]}),e.jsx("p",{style:{color:"#64748b"},children:"Ingrese el PIN de seguridad"}),e.jsxs("form",{onSubmit:w,children:[e.jsx(Ae,{ref:d,type:"password",maxLength:4,value:c,onChange:i=>{const _=i.target.value.replace(/\D/g,"");f(_),s("")},placeholder:"0000",disabled:g}),e.jsx(Fe,{children:k}),e.jsx(ze,{type:"submit",disabled:g||c.length<4,children:g?"Verificando...":"Ingresar"})]})]})})}):null}const T=o.div`
    padding: clamp(1rem, 5vw, 2.5rem); 
    background-color: #f0f2f5; 
    min-height: 100vh;
    box-sizing: border-box;
`,M=o.div`
    width: 100%;
    max-width: 1300px;
    margin: 0 auto;
`,Te=o.div`
    display: flex;
    justify-content: space-between;
    align-items: center; 
    margin-bottom: 3rem; 
    gap: 1.5rem;
    flex-wrap: wrap;
`,Me=o.div`min-width: 0;`,R=o.h1`
    font-size: clamp(1.8rem, 4vw, 2.4rem); 
    color: #1e293b; 
    font-weight: 800;
    margin: 0;
    line-height: 1.2;
`,Re=o.p`
    font-size: clamp(0.9rem, 2vw, 1.1rem);
    color: #64748b;
    margin: 0.4rem 0 0;
`,De=o.button`
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
`,Ve=o.main`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
    gap: clamp(1rem, 2vw, 1.5rem);
`,a=o(me)`
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
`,t=o.div` 
    font-size: 2.2rem; 
    margin-bottom: 0.75rem; 
    line-height:1; 
    color: ${r=>r.color||"#007bff"}; 
`,$e=()=>{const{user:r,logout:u}=O(),[c,f]=l.useState(!1),[k,s]=l.useState(!1),[g,x]=l.useState(!1);if(!r)return e.jsx(T,{children:e.jsx(M,{children:e.jsx(R,{children:"Cargando..."})})});const d=r.rol||"N/A",h=d.trim().toLowerCase(),n=h==="administrador"||h==="admin",w=h==="vendedor",i=h==="encargado de finanzas"||h==="contador",_=h==="encargado de inventario",S=n,m=n||w,z=n||i,P=n||_,p=n||_,C=n||d==="Gerente"||i,j=n||d==="Gerente"||i,E=n,B=n||d==="Gerente",U=n||d==="Gerente",N=n||i,W=r.nombre_usuario||r.nombre||r.name||"Usuario",$=()=>{f(!0)},q=()=>{f(!1),u()},v=H=>{switch(H){case"/pos":y(()=>import("./POS-CvAbhWwU.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10]));break;case"/inventory":y(()=>import("./InventoryManagement-CQa3CLd3.js"),__vite__mapDeps([11,1,2]));break;case"/traslados":y(()=>import("./InventoryOutflowPage-BvbmCNzU.js"),__vite__mapDeps([12,1,2,6,7,8]));break;case"/credits":y(()=>import("./ClientesYCreditos-CavmBiKf.js"),__vite__mapDeps([13,1,2,6,7,8,9,4,5]));break;case"/invoices":y(()=>import("./FacturasProveedores-DMyHzcoo.js"),__vite__mapDeps([14,1,2,6,7,8]));break;case"/orders":y(()=>import("./PedidosYApartados-DCYOJcGB.js"),__vite__mapDeps([15,1,2,6,7,8]));break;case"/finances":y(()=>import("./Finances-P2wkOVsR.js"),__vite__mapDeps([16,1,2,5,4,6,7,8]));break;case"/empleados":y(()=>import("./Empleados-DuSTOHvh.js"),__vite__mapDeps([17,1,2,6,7,8]));break}};return e.jsxs(T,{children:[e.jsxs(M,{children:[e.jsxs(Te,{children:[e.jsxs(Me,{children:[e.jsxs(R,{children:["Bienvenido, ",W," 👋"]}),e.jsxs(Re,{children:["Rol: ",d,". Selecciona un módulo para empezar."]})]}),e.jsxs(De,{"aria-label":"Cerrar sesión",onClick:$,children:[e.jsx(oe,{})," Cerrar sesión"]})]}),e.jsxs(Ve,{children:[S&&e.jsxs(a,{to:"/pos",color:"#007bff",onMouseEnter:()=>v("/pos"),children:[e.jsx(t,{color:"#007bff",children:e.jsx(re,{})}),e.jsx("h2",{children:"Punto de Venta"}),e.jsx("p",{children:"Registra ventas y gestiona transacciones diarias."})]}),S&&e.jsxs(a,{as:"div",onClick:()=>x(!0),color:"#8b5cf6",style:{cursor:"pointer"},children:[e.jsx(t,{color:"#8b5cf6",children:e.jsx(se,{})}),e.jsx("h2",{children:"Venta Mayorista"}),e.jsx("p",{children:"Portal exclusivo para ventas al por mayor."})]}),m&&e.jsxs(a,{to:"/orders",color:"#ffc107",onMouseEnter:()=>v("/orders"),children:[e.jsx(t,{color:"#ffc107",children:e.jsx(V,{})}),e.jsx("h2",{children:"Proformas y precios"}),e.jsx("p",{children:"Crear Proformas y ver Productos"})]}),N&&e.jsxs(a,{to:"/invoices",color:"#e83e8c",onMouseEnter:()=>v("/invoices"),children:[e.jsx(t,{color:"#e83e8c",children:e.jsx(L,{})}),e.jsx("h2",{children:"Facturas Proveedores"}),e.jsx("p",{children:"Gestionar pagos, vencimientos y proveedores."})]}),z&&e.jsxs(a,{to:"/credits",color:"#17a2b8",onMouseEnter:()=>v("/credits"),children:[e.jsx(t,{color:"#17a2b8",children:e.jsx(ne,{})}),e.jsx("h2",{children:"Clientes y Créditos"}),e.jsx("p",{children:"Gestiona clientes, saldos pendientes y abonos."})]}),U&&e.jsxs(a,{to:"/finances",color:"#10b981",onMouseEnter:()=>v("/finances"),children:[e.jsx(t,{color:"#10b981",children:e.jsx(ae,{})}),e.jsx("h2",{children:"Finanzas"}),e.jsx("p",{children:"Control de ingresos, gastos y reportes financieros."})]}),B&&e.jsxs(a,{to:"/empleados",color:"#6366f1",onMouseEnter:()=>v("/empleados"),children:[e.jsx(t,{color:"#6366f1",children:e.jsx(te,{})}),e.jsx("h2",{children:"Empleados"}),e.jsx("p",{children:"Gestión de vendedores y comisiones."})]}),P&&e.jsxs(a,{to:"/inventory",color:"#28a745",onMouseEnter:()=>v("/inventory"),children:[e.jsx(t,{color:"#28a745",children:e.jsx(ie,{})}),e.jsx("h2",{children:"Inventario"}),e.jsx("p",{children:"Controla el stock de tus productos y mercancía."})]}),p&&e.jsxs(a,{to:"/upload/inventory",color:"#6f42c1",children:[e.jsx(t,{color:"#6f42c1",children:e.jsx(le,{})}),e.jsx("h2",{children:"Carga Masiva"}),e.jsx("p",{children:"Actualiza inventario desde archivos CSV."})]}),P&&e.jsxs(a,{to:"/traslados",color:"#ef4444",onMouseEnter:()=>v("/traslados"),children:[e.jsx(t,{color:"#ef4444",children:e.jsx(ce,{})}),e.jsx("h2",{children:"Traslados / Salidas"}),e.jsx("p",{children:"Descontar mercancía por traslados o merma."})]}),C&&e.jsxs(a,{to:"/reports",color:"#6c757d",children:[e.jsx(t,{color:"#6c757d",children:e.jsx(de,{})}),e.jsx("h2",{children:"Reportes"}),e.jsx("p",{children:"Visualiza el rendimiento general."})]}),j&&e.jsxs(a,{to:"/cash-report",color:"#dc3545",children:[e.jsx(t,{color:"#dc3545",children:e.jsx(pe,{})}),e.jsx("h2",{children:"Gestión de Cajas"}),e.jsx("p",{children:"Cierres y arqueos de caja."})]}),C&&e.jsxs(a,{to:"/detailed-sales-report",color:"#6366f1",children:[e.jsx(t,{color:"#6366f1",children:e.jsx(L,{})}),e.jsx("h2",{children:"Reportes de Ventas Detallado"}),e.jsx("p",{children:"Ventas, devoluciones y rastreo por producto."})]}),E&&e.jsxs(a,{to:"/admin/users",color:"#ff6b6b",children:[e.jsx(t,{color:"#ff6b6b",children:e.jsx(xe,{})}),e.jsx("h2",{children:"Usuarios"}),e.jsx("p",{children:"Administra roles y accesos."})]}),e.jsxs(a,{to:"/solicitudes",color:"#fd7e14",children:[e.jsx(t,{color:"#fd7e14",children:e.jsx(he,{})}),e.jsx("h2",{children:"Solicitudes"}),e.jsx("p",{children:"Realizar pedidos y requerimientos."})]}),n&&e.jsxs(a,{as:"button",onClick:()=>s(!0),color:"#343a40",style:{textAlign:"left",border:"none",cursor:"pointer"},children:[e.jsx(t,{color:"#343a40",children:e.jsx(D,{})}),e.jsx("h2",{children:"Configuración"}),e.jsx("p",{children:"Datos de empresa y tickets."})]})]})]}),e.jsx(be,{isOpen:c,title:"Confirmar Cierre de Sesión",message:"¿Estás seguro de que quieres cerrar tu sesión actual?",onClose:()=>f(!1),onConfirm:q}),e.jsx(we,{isOpen:k,onClose:()=>s(!1)}),e.jsx(Ie,{isOpen:g,onClose:()=>x(!1)})]})};export{$e as default};

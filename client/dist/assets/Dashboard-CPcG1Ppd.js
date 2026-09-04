const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/POS-BrswrSyq.js","assets/vendor-Cig3sC1l.js","assets/scanner-vendor-DfxRpMWJ.js","assets/SecretAdjustModal-DEsJ2aKG.js","assets/index-DGmyou13.js","assets/pdf-vendor-Dyhe4TSt.js","assets/index-CJIrVlr0.css","assets/searchEngine-BMYcElFi.js","assets/POS.styles-aMw4GNpO.js","assets/AlertModal-D7T3J0b6.js","assets/SalesHistoryModal-CAvgWj-X.js","assets/ConfirmationModal-D7qrvBg0.js","assets/InventoryManagement-aUV5G_uw.js","assets/InventoryOutflowPage-BBpClHB3.js","assets/ClientesYCreditos-KleT-WNx.js","assets/FacturasProveedores-BXpbdq2K.js","assets/PedidosYApartados-XeDXK7Zw.js","assets/Finances-CkdUMUIi.js","assets/DetailedSalesReport-DqpScj-l.js","assets/Empleados-CtgcfYcM.js","assets/BiConsole-vzzIFgph.js"])))=>i.map(i=>d[i]);
import{_ as b}from"./pdf-vendor-Dyhe4TSt.js";import{r as d,j as e,w as O,x as J,y as K,C as $,D as Q,s as o,n as L,b as X,A as Z,k as ee,h as oe,m as U,E as re,G as se,H as ae,I as T,J as ne,K as te,L as ie,M as le,O as ce,P as de,Q as pe,S as xe,T as he,U as ue,V as me}from"./vendor-Cig3sC1l.js";import{a as fe,b as ge,c as D,u as B}from"./index-DGmyou13.js";import{C as be}from"./ConfirmationModal-D7qrvBg0.js";import"./scanner-vendor-DfxRpMWJ.js";import"./POS.styles-aMw4GNpO.js";const je=o.div`
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
`,M=o.button`
    padding: 0.75rem 1rem;
    background: none; border: none;
    border-bottom: 3px solid ${r=>r.active?"#007bff":"transparent"};
    color: ${r=>r.active?"#007bff":"#64748b"};
    font-weight: 600; cursor: pointer;
    display: flex; align-items: center; gap: 8px;
    &:hover { color: #007bff; }
`,C=o.div`
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
`,I=o.button`
    padding: 0.75rem 1.5rem;
    border-radius: 8px; border: none; font-weight: 600; cursor: pointer;
    display: flex; align-items: center; gap: 0.5rem;
    background: ${r=>r.primary?"#007bff":"#e2e8f0"};
    color: ${r=>r.primary?"white":"#475569"};
    &:hover { filter: brightness(0.95); }
    &:disabled { opacity: 0.7; cursor: not-allowed; }
`,we=({isOpen:r,onClose:j})=>{const{settings:p,refreshSettings:h}=fe(),k=localStorage.getItem("token"),[a,v]=d.useState({empresa_nombre:"",empresa_ruc:"",empresa_telefono:"",empresa_direccion:"",empresa_eslogan:"",empresa_logo_url:"",ticket_sales_footer:"",ticket_proforma_footer:"",ticket_transfer_footer:"",mayorista_pin:""}),[u,x]=d.useState("general"),[m,n]=d.useState(!1),[w,c]=d.useState(!1),[y,E]=d.useState(null),P=s=>{if(!s)return null;if(s.startsWith("data:"))return s;let t=s;return t.startsWith("http")||(t=`${"https://sistema.multirepuestosrg.com/api".replace(/\/api$/,"")}${t.startsWith("/")?"":"/"}${t}`),t.includes("?t=")||(t+=(t.includes("?")?"&":"?")+`t=${Date.now()}`),t};d.useEffect(()=>{r&&p&&(v(s=>({...s,...p})),p.empresa_logo_url&&E(P(p.empresa_logo_url)))},[r,p]);const f=s=>{const{name:t,value:_}=s.target;v(S=>({...S,[t]:_}))},A=async()=>{n(!0);try{await D(k,a),await h(),L.success("Configuración actualizada correctamente"),j()}catch(s){console.error(s),L.error("Error al guardar configuración")}finally{n(!1)}},F=async s=>{const t=s.target.files[0];if(t){c(!0);try{const _=await ge(k,t),S=P(_);E(S);const z={...a,empresa_logo_url:_};v(z),await D(k,z),await h(),L.success("Logo subido y guardado correctamente")}catch(_){console.error("Error al subir el logo:",_),L.error("Error al subir el logo")}finally{c(!1),s.target&&(s.target.value=null)}}};return r?e.jsx(je,{onClick:j,children:e.jsxs(ve,{onClick:s=>s.stopPropagation(),children:[e.jsxs(ye,{children:[e.jsxs("h2",{children:[e.jsx(O,{})," Configuración del Sistema"]}),e.jsx(I,{onClick:j,style:{padding:"0.4rem"},children:e.jsx(J,{size:20})})]}),e.jsxs(_e,{children:[e.jsxs(Ce,{children:[e.jsxs(M,{active:u==="general",onClick:()=>x("general"),children:[e.jsx(K,{})," Datos Empresa"]}),e.jsxs(M,{active:u==="tickets",onClick:()=>x("tickets"),children:[e.jsx($,{})," Personalización Tickets"]})]}),u==="general"&&e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"},children:[e.jsxs(C,{style:{gridColumn:"span 2"},children:[e.jsx("label",{children:"Nombre de la Empresa"}),e.jsx("input",{name:"empresa_nombre",value:a.empresa_nombre||"",onChange:f})]}),e.jsxs(C,{children:[e.jsx("label",{children:"RUC/Identificación"}),e.jsx("input",{name:"empresa_ruc",value:a.empresa_ruc||"",onChange:f})]}),e.jsxs(C,{children:[e.jsx("label",{children:"Teléfono(s)"}),e.jsx("input",{name:"empresa_telefono",value:a.empresa_telefono||"",onChange:f})]}),e.jsxs(C,{style:{gridColumn:"span 2"},children:[e.jsx("label",{children:"Dirección"}),e.jsx("textarea",{name:"empresa_direccion",value:a.empresa_direccion||"",onChange:f})]}),e.jsxs(C,{style:{gridColumn:"span 2"},children:[e.jsx("label",{children:"Eslogan / Frase"}),e.jsx("input",{name:"empresa_eslogan",value:a.empresa_eslogan||"",onChange:f})]}),e.jsxs(C,{style:{gridColumn:"span 2"},children:[e.jsx("label",{children:"Logo del Negocio (Aparecerá en Tickets)"}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"20px"},children:[e.jsx("div",{style:{width:"100px",height:"100px",border:"1px dashed #cbd5e1",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center",background:"#f8fafc",overflow:"hidden"},children:y?e.jsx("img",{src:y,alt:"Logo",onError:s=>{console.warn("No se pudo cargar la vista previa del logo:",y)},style:{width:"100%",height:"100%",objectFit:"contain"}},y):e.jsx("small",{style:{color:"#94a3b8"},children:"Sin Logo"})}),e.jsxs("div",{style:{flex:1},children:[e.jsx("input",{type:"file",accept:"image/*",onClick:s=>{s.target.value=null},onChange:F,id:"logo-upload",style:{display:"none"}}),e.jsx("label",{htmlFor:"logo-upload",style:{display:"inline-block",padding:"8px 16px",background:"#f1f5f9",border:"1px solid #cbd5e1",borderRadius:"8px",cursor:"pointer",fontWeight:"600",fontSize:"0.9rem"},children:w?"Subiendo...":"Seleccionar Imagen"}),e.jsx("p",{style:{margin:"5px 0 0 0",fontSize:"0.8rem",color:"#64748b"},children:"Recomendado: PNG fondo transparente (aprox 200x200px)"})]})]})]})]}),u==="tickets"&&e.jsxs("div",{children:[e.jsx("p",{style:{marginBottom:"1rem",color:"#64748b"},children:"Personaliza los mensajes que aparecen al final de tus documentos impresos."}),e.jsxs(C,{children:[e.jsx("label",{children:"Pie de Página: Factura de Venta"}),e.jsx("textarea",{name:"ticket_sales_footer",value:a.ticket_sales_footer||"",onChange:f,placeholder:"Ej: Gracias por su compra. No se aceptan devoluciones después de 30 días."}),e.jsx("small",{children:"Avisos legales, agradecimientos o políticas de devolución."})]}),e.jsxs(C,{children:[e.jsx("label",{children:"Pie de Página: Proforma"}),e.jsx("textarea",{name:"ticket_proforma_footer",value:a.ticket_proforma_footer||"",onChange:f,placeholder:"Ej: Cotización válida por 15 días. Sujeta a disponibilidad."}),e.jsx("small",{children:"Condiciones de validez de la oferta."})]}),e.jsxs(C,{children:[e.jsx("label",{children:"Pie de Página: Traslado / Salida"}),e.jsx("textarea",{name:"ticket_transfer_footer",value:a.ticket_transfer_footer||"",onChange:f,placeholder:"Ej: Salida autorizada por Gerencia."}),e.jsx("small",{children:"Notas internas o firmas requeridas."})]})]})]}),e.jsxs(ke,{children:[e.jsx(I,{onClick:j,children:"Cancelar"}),e.jsxs(I,{primary:!0,onClick:A,disabled:m,children:[e.jsx(Q,{})," ",m?"Guardando...":"Guardar Cambios"]})]})]})}):null},Ee=o(U.div)`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`,Se=o(U.div)`
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
`,Le=o.p`
  color: #ef4444;
  font-size: 0.9rem;
  margin-top: 5px;
  min-height: 1.5em;
`,Fe=o.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  font-size: 1.2rem;
  &:hover { color: #64748b; }
`;function Ie({isOpen:r,onClose:j}){const[p,h]=d.useState(""),[k,a]=d.useState(""),[v,u]=d.useState(!1),x=d.useRef(null),{token:m}=B(),n=X();d.useEffect(()=>{r&&(h(""),a(""),setTimeout(()=>{var c;return(c=x.current)==null?void 0:c.focus()},100))},[r]);const w=c=>{c.preventDefault(),p&&(u(!0),a(""),p==="2004"?(j(),n("/wholesale-menu")):(a("PIN incorrecto"),h(""),u(!1)))};return r?e.jsx(Z,{children:e.jsx(Ee,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(Se,{initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},children:[e.jsx(Fe,{onClick:j,children:e.jsx(ee,{})}),e.jsxs(Pe,{children:[e.jsx(oe,{color:"#8b5cf6"})," Acesso Mayorista"]}),e.jsx("p",{style:{color:"#64748b"},children:"Ingrese el PIN de seguridad"}),e.jsxs("form",{onSubmit:w,children:[e.jsx(Ae,{ref:x,type:"password",maxLength:4,value:p,onChange:c=>{const y=c.target.value.replace(/\D/g,"");h(y),a("")},placeholder:"0000",disabled:v}),e.jsx(Le,{children:k}),e.jsx(ze,{type:"submit",disabled:v||p.length<4,children:v?"Verificando...":"Ingresar"})]})]})})}):null}const R=o.div`
    padding: clamp(1rem, 5vw, 2.5rem); 
    background-color: #f0f2f5; 
    min-height: 100vh;
    box-sizing: border-box;
`,V=o.div`
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
`,De=o.div`min-width: 0;`,G=o.h1`
    font-size: clamp(1.8rem, 4vw, 2.4rem); 
    color: #1e293b; 
    font-weight: 800;
    margin: 0;
    line-height: 1.2;
`,Me=o.p`
    font-size: clamp(0.9rem, 2vw, 1.1rem);
    color: #64748b;
    margin: 0.4rem 0 0;
`,Re=o.button`
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
`,i=o(me)`
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
`,l=o.div` 
    font-size: 2.2rem; 
    margin-bottom: 0.75rem; 
    line-height:1; 
    color: ${r=>r.color||"#007bff"}; 
`,We=()=>{const{user:r,logout:j}=B(),[p,h]=d.useState(!1),[k,a]=d.useState(!1),[v,u]=d.useState(!1);if(!r)return e.jsx(R,{children:e.jsx(V,{children:e.jsx(G,{children:"Cargando..."})})});const x=r.rol||"N/A",m=x.trim().toLowerCase(),n=m==="administrador"||m==="admin",w=m==="vendedor",c=m==="encargado de finanzas"||m==="contador",y=m==="encargado de inventario",E=n,P=n||w,f=n||c,A=n||y,F=n||y,s=n||x==="Gerente"||c,t=n||x==="Gerente"||c,_=n||x==="Gerente"||c,S=n,z=n||x==="Gerente",N=n||c,W=r.nombre_usuario||r.nombre||r.name||"Usuario",q=()=>{h(!0)},H=()=>{h(!1),j()},g=Y=>{switch(Y){case"/pos":b(()=>import("./POS-BrswrSyq.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11]));break;case"/inventory":b(()=>import("./InventoryManagement-aUV5G_uw.js"),__vite__mapDeps([12,1,2,4,5,6,7]));break;case"/traslados":b(()=>import("./InventoryOutflowPage-BBpClHB3.js"),__vite__mapDeps([13,1,2,4,5,6,7]));break;case"/credits":b(()=>import("./ClientesYCreditos-KleT-WNx.js"),__vite__mapDeps([14,1,2,4,5,6,10,8,9,7]));break;case"/invoices":b(()=>import("./FacturasProveedores-BXpbdq2K.js"),__vite__mapDeps([15,1,2,4,5,6,7]));break;case"/orders":b(()=>import("./PedidosYApartados-XeDXK7Zw.js"),__vite__mapDeps([16,1,2,7,4,5,6]));break;case"/finances":b(()=>import("./Finances-CkdUMUIi.js"),__vite__mapDeps([17,1,2,9,8,4,5,6]));break;case"/detailed-sales-report":b(()=>import("./DetailedSalesReport-DqpScj-l.js"),__vite__mapDeps([18,1,2,4,5,6,7]));break;case"/empleados":b(()=>import("./Empleados-CtgcfYcM.js"),__vite__mapDeps([19,1,2,4,5,6]));break;case"/bi-console":b(()=>import("./BiConsole-vzzIFgph.js"),__vite__mapDeps([20,1,2,4,5,6]));break}};return e.jsxs(R,{children:[e.jsxs(V,{children:[e.jsxs(Te,{children:[e.jsxs(De,{children:[e.jsxs(G,{children:["Bienvenido, ",W," 👋"]}),e.jsxs(Me,{children:["Rol: ",x,". Selecciona un módulo para empezar."]})]}),e.jsxs(Re,{"aria-label":"Cerrar sesión",onClick:q,children:[e.jsx(re,{})," Cerrar sesión"]})]}),e.jsxs(Ve,{children:[E&&e.jsxs(i,{to:"/pos",color:"#007bff",onMouseEnter:()=>g("/pos"),children:[e.jsx(l,{color:"#007bff",children:e.jsx(se,{})}),e.jsx("h2",{children:"Punto de Venta"}),e.jsx("p",{children:"Registra ventas y gestiona transacciones diarias."})]}),E&&e.jsxs(i,{as:"div",onClick:()=>u(!0),color:"#8b5cf6",style:{cursor:"pointer"},children:[e.jsx(l,{color:"#8b5cf6",children:e.jsx(ae,{})}),e.jsx("h2",{children:"Venta Mayorista"}),e.jsx("p",{children:"Portal exclusivo para ventas al por mayor."})]}),P&&e.jsxs(i,{to:"/orders",color:"#ffc107",onMouseEnter:()=>g("/orders"),children:[e.jsx(l,{color:"#ffc107",children:e.jsx($,{})}),e.jsx("h2",{children:"Proformas y precios"}),e.jsx("p",{children:"Crear Proformas y ver Productos"})]}),N&&e.jsxs(i,{to:"/invoices",color:"#e83e8c",onMouseEnter:()=>g("/invoices"),children:[e.jsx(l,{color:"#e83e8c",children:e.jsx(T,{})}),e.jsx("h2",{children:"Facturas Proveedores"}),e.jsx("p",{children:"Gestionar pagos, vencimientos y proveedores."})]}),f&&e.jsxs(i,{to:"/credits",color:"#17a2b8",onMouseEnter:()=>g("/credits"),children:[e.jsx(l,{color:"#17a2b8",children:e.jsx(ne,{})}),e.jsx("h2",{children:"Clientes y Créditos"}),e.jsx("p",{children:"Gestiona clientes, saldos pendientes y abonos."})]}),s&&e.jsxs(i,{to:"/finances",color:"#10b981",onMouseEnter:()=>g("/finances"),children:[e.jsx(l,{color:"#10b981",children:e.jsx(te,{})}),e.jsx("h2",{children:"Finanzas y Estadísticas"}),e.jsx("p",{children:"Gestión de ingresos, gastos y analítica general."})]}),z&&e.jsxs(i,{to:"/empleados",color:"#6366f1",onMouseEnter:()=>g("/empleados"),children:[e.jsx(l,{color:"#6366f1",children:e.jsx(ie,{})}),e.jsx("h2",{children:"Empleados"}),e.jsx("p",{children:"Gestión de vendedores y comisiones."})]}),A&&e.jsxs(i,{to:"/inventory",color:"#28a745",onMouseEnter:()=>g("/inventory"),children:[e.jsx(l,{color:"#28a745",children:e.jsx(le,{})}),e.jsx("h2",{children:"Inventario"}),e.jsx("p",{children:"Controla el stock de tus productos y mercancía."})]}),F&&e.jsxs(i,{to:"/upload/inventory",color:"#6f42c1",children:[e.jsx(l,{color:"#6f42c1",children:e.jsx(ce,{})}),e.jsx("h2",{children:"Carga Masiva"}),e.jsx("p",{children:"Actualiza inventario desde archivos CSV."})]}),A&&e.jsxs(i,{to:"/traslados",color:"#ef4444",onMouseEnter:()=>g("/traslados"),children:[e.jsx(l,{color:"#ef4444",children:e.jsx(de,{})}),e.jsx("h2",{children:"Traslados / Salidas"}),e.jsx("p",{children:"Descontar mercancía por traslados o merma."})]}),_&&e.jsxs(i,{to:"/cash-report",color:"#dc3545",children:[e.jsx(l,{color:"#dc3545",children:e.jsx(pe,{})}),e.jsx("h2",{children:"Gestión de Cajas"}),e.jsx("p",{children:"Cierres y arqueos de caja."})]}),t&&e.jsxs(i,{to:"/detailed-sales-report",color:"#6366f1",onMouseEnter:()=>g("/detailed-sales-report"),children:[e.jsx(l,{color:"#6366f1",children:e.jsx(T,{})}),e.jsx("h2",{children:"Reporte de Ventas Detallado"}),e.jsx("p",{children:"Ventas, devoluciones y rastreo por producto."})]}),t&&e.jsxs(i,{to:"/bi-console",color:"#ED7D31",onMouseEnter:()=>g("/bi-console"),children:[e.jsx(l,{color:"#ED7D31",children:e.jsx(xe,{})}),e.jsx("h2",{children:"Consola BI & Analítica"}),e.jsx("p",{children:"Panel de Inteligencia de Negocios y Proyección."})]}),S&&e.jsxs(i,{to:"/admin/users",color:"#ff6b6b",children:[e.jsx(l,{color:"#ff6b6b",children:e.jsx(he,{})}),e.jsx("h2",{children:"Usuarios"}),e.jsx("p",{children:"Administra roles y accesos."})]}),e.jsxs(i,{to:"/solicitudes",color:"#fd7e14",children:[e.jsx(l,{color:"#fd7e14",children:e.jsx(ue,{})}),e.jsx("h2",{children:"Solicitudes"}),e.jsx("p",{children:"Realizar pedidos y requerimientos."})]}),n&&e.jsxs(i,{as:"button",onClick:()=>a(!0),color:"#343a40",style:{textAlign:"left",border:"none",cursor:"pointer"},children:[e.jsx(l,{color:"#343a40",children:e.jsx(O,{})}),e.jsx("h2",{children:"Configuración"}),e.jsx("p",{children:"Datos de empresa y tickets."})]})]})]}),e.jsx(be,{isOpen:p,title:"Confirmar Cierre de Sesión",message:"¿Estás seguro de que quieres cerrar tu sesión actual?",onClose:()=>h(!1),onConfirm:H}),e.jsx(we,{isOpen:k,onClose:()=>a(!1)}),e.jsx(Ie,{isOpen:v,onClose:()=>u(!1)})]})};export{We as default};

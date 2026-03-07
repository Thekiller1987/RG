import{u as H,r as s,j as e,Y as U,ag as G,aH as M,S as W,ap as q,J,aI as K,an as Q,aq as X,ao as Z,q as ee,s as a,t as k,ar as te,as as ae,at as re,au as se,ax as ne,ay as oe,az as ie}from"./vendor-Bl8eSE-Q.js";import{D as le,E as de,F as ce,G as pe,H as me}from"./index-B613Eyqa.js";import{A as ue}from"./AlertModal-C1eU8apX.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-DV8V3V31.js";import"./POS.styles-C4qzct5K.js";te.register(ae,re,se,ne,oe,ie);const xe=ee`
  @media print {
    body * {
      visibility: hidden;
    }
    #printableArea, #printableArea * {
      visibility: visible;
    }
    #printableArea {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
    }
  }
`,d=k`from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`,ge=a.div`
  padding: 1.5rem;
  background-color: #f0f2f5;
  min-height: 100vh;
  font-family: 'Segoe UI', 'Roboto', sans-serif;
  --primary-color: #3b82f6;
  --secondary-color: #10b981;
`,he=a.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  animation: ${d} 0.4s ease-out;

  /* Ocultar en impresión */
  @media print {
    display: none;
  }
`,f=a.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 7px 10px rgba(0, 0, 0, 0.1);
  }
`,be=a(f)`
  background: #6b7280;
  &:hover { background: #4b5563; }
`,fe=a(f)`
  background: var(--secondary-color);
  &:hover { background: #059669; }
`,ye=a.header`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
  animation: ${d} 0.5s ease-out;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  /* Ocultar en impresión */
  @media print {
    display: none;
  }
`,je=a.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
`,ve=a.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background-color: white;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`,w=a.input`
  padding: 0.6rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;
  background-color: #f9fafb;
`,Se=a(f)`
  background: var(--primary-color);
  &:hover { background: #2563eb; }
`,we=a.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
`,n=a.div`
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.07);
  display: flex;
  flex-direction: column;
  animation: ${d} 0.6s ease-out forwards;
  border-top: 4px solid ${i=>i.accentColor||"var(--primary-color)"};
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  }
`,o=a.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: #4b5563;
  font-weight: 600;
`,b=a.p`
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
  margin: auto 0 0 0;
`,C=a.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 0.2rem;
  border-bottom: 1px solid #f3f4f6;
  opacity: 0;
  animation: ${d} 0.5s ease-out forwards;
  animation-delay: ${i=>i.delay*100}ms; // Animación escalonada
  &:last-child { border-bottom: none; }
`,I=a.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
`,Ce=k`to { transform: rotate(360deg); }`,Ie=a.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  &::after {
    content: '';
    width: 50px;
    height: 50px;
    border: 5px solid #d1d5db;
    border-top-color: var(--primary-color);
    border-radius: 50%;
    animation: ${Ce} 0.8s linear infinite;
  }
`,Be=()=>{const i=H(),D=()=>new Date(new Date().getFullYear(),new Date().getMonth(),1).toISOString().split("T")[0],[c,R]=s.useState(D),[p,F]=s.useState(new Date().toISOString().split("T")[0]),[y,A]=s.useState({ventas_brutas:0,ganancia_total:0}),[_,B]=s.useState(0),[j,P]=s.useState([]),[v,O]=s.useState([]),[E,T]=s.useState({labels:[],datasets:[]}),[V,m]=s.useState(!0),[u,x]=s.useState({isOpen:!1,title:"",message:""}),l=t=>new Intl.NumberFormat("es-NI",{style:"currency",currency:"NIO"}).format(t||0),g=s.useCallback(async()=>{m(!0);const t=localStorage.getItem("token");if(!t){x({isOpen:!0,title:"Error de Autenticación",message:"No se encontró tu sesión."}),m(!1);return}try{const r={startDate:c,endDate:p},[N,$,Y,z,S]=await Promise.all([le(t,r),de(t),ce(t,r),pe(t,r),me(t,r)]);A(N),B($.valor_total_inventario),P(Y),O(z),T({labels:S.map(h=>new Date(h.dia).toLocaleDateString("es-NI",{day:"numeric",month:"short"})),datasets:[{label:"Ventas por Día",data:S.map(h=>h.total_diario),backgroundColor:"rgba(59, 130, 246, 0.7)",borderColor:"rgba(59, 130, 246, 1)",borderWidth:1,borderRadius:4,hoverBackgroundColor:"rgba(59, 130, 246, 1)"}]})}catch(r){x({isOpen:!0,title:"Error de Conexión",message:r.message})}finally{m(!1)}},[c,p]);s.useEffect(()=>{g()},[g]);const L=()=>{window.print()};return e.jsxs(e.Fragment,{children:[e.jsx(xe,{}),e.jsxs(ge,{children:[V&&e.jsx(Ie,{}),e.jsx(ue,{isOpen:u.isOpen,onClose:()=>x({isOpen:!1,title:"",message:""}),title:u.title,message:u.message}),e.jsxs(he,{children:[e.jsxs(be,{onClick:()=>i(-1),children:[e.jsx(U,{})," Regresar"]}),e.jsxs(fe,{onClick:L,children:[e.jsx(G,{})," Imprimir Reporte"]})]}),e.jsxs(ye,{children:[e.jsx(je,{children:"Dashboard de Reportes"}),e.jsxs(ve,{children:[e.jsx("label",{children:e.jsx(M,{})}),e.jsx(w,{type:"date",value:c,onChange:t=>R(t.target.value)}),e.jsx(w,{type:"date",value:p,onChange:t=>F(t.target.value)}),e.jsx(Se,{onClick:g,children:"Generar"})]})]}),e.jsx("div",{id:"printableArea",children:e.jsxs(we,{children:[e.jsxs(n,{style:{gridColumn:"1 / -1"},accentColor:"var(--primary-color)",children:[e.jsxs(o,{children:[e.jsx(W,{})," Rendimiento de Ventas en el Período"]}),e.jsx("div",{style:{position:"relative",height:"350px"},children:e.jsx(q,{data:E,options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}}}})})]}),e.jsxs(n,{accentColor:"#10b981",children:[e.jsxs(o,{children:[e.jsx(J,{})," Ventas Totales"]}),e.jsx(b,{children:l(y.ventas_brutas)})]}),e.jsxs(n,{accentColor:"#f59e0b",children:[e.jsxs(o,{children:[e.jsx(K,{})," Ganancias Totales"]}),e.jsx(b,{children:l(y.ganancia_total)})]}),e.jsxs(n,{accentColor:"#6366f1",children:[e.jsxs(o,{children:[e.jsx(Q,{})," Capital en Inventario"]}),e.jsx(b,{children:l(_)})]}),e.jsxs(n,{style:{gridColumn:"span 1 / auto"},children:[e.jsxs(o,{children:[e.jsx(X,{})," 🏆 Top Vendedores"]}),e.jsx("ul",{children:j.length>0?j.map((t,r)=>e.jsxs(C,{delay:r+1,children:[e.jsxs("span",{children:[r+1,". ",t.nombre_usuario]}),e.jsx("strong",{children:l(t.total_vendido)})]},r)):e.jsx(I,{children:"No hay datos de vendedores."})})]}),e.jsxs(n,{style:{gridColumn:"span 1 / auto"},children:[e.jsxs(o,{children:[e.jsx(Z,{})," ⭐ Productos Más Vendidos"]}),e.jsx("ul",{children:v.length>0?v.map((t,r)=>e.jsxs(C,{delay:r+1,children:[e.jsxs("span",{children:[r+1,". ",t.nombre]}),e.jsxs("strong",{children:[t.total_unidades_vendidas," und."]})]},r)):e.jsx(I,{children:"No hay datos de productos."})})]})]})})]})]})};export{Be as default};

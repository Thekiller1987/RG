import{u as ne,r as n,j as e,ac as L,Y as oe,S as ie,ah as le,an as O,ao as de,ap as ce,aq as pe,s as t,af as me,t as W,ar as xe,as as ge,at as fe,au as he,av as ue,aw as be,ax as ye,ay as ve,az as we,aA as je}from"./vendor-Bl8eSE-Q.js";import{A as ke}from"./AlertModal-C1eU8apX.js";import{A as Se}from"./index-CjMKJdYy.js";import"./scanner-vendor-DfxRpMWJ.js";import"./POS.styles-C4qzct5K.js";import"./pdf-vendor-DV8V3V31.js";xe.register(ge,fe,he,ue,be,ye,ve,we,je);const T=()=>new Date().toLocaleDateString("sv-SE",{timeZone:"America/Managua"}),U=W`from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`;W`0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); } 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }`;const Ce=t.div`
  padding: clamp(1rem, 3vw, 2.5rem);
  background-color: #f1f5f9; /* Slate-100 */
  min-height: 100vh;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: #1e293b;
  animation: ${U} 0.6s cubic-bezier(0.16, 1, 0.3, 1);
`,De=t.header`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  background: white;
  padding: 1.5rem;
  border-radius: 24px;
  box-shadow: 0 4px 20px -5px rgba(0,0,0,0.05);
  border: 1px solid white;
  
  @media (min-width: 1024px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2.5rem;
  }
`,ze=t.div`
  display: flex; align-items: center; gap: 1rem;
`,Ie=t.button`
  background: white;
  border: 1px solid #e2e8f0;
  width: 45px; height: 45px;
  border-radius: 14px;
  display: grid; place-items: center;
  cursor: pointer;
  color: #334155;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 12px -3px rgba(0,0,0,0.08);
    background: #f8fafc;
    color: #0f172a;
  }
`,Fe=t.h1`
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  color: #0f172a;
  margin: 0;
  font-weight: 800;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`,_e=t.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #f8fafc;
  padding: 0.75rem;
  border-radius: 18px;
  border: 1px solid #e2e8f0;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`,Ae=t.div`
    display: flex; gap: 0.5rem; background: #e2e8f0; padding: 4px; border-radius: 14px;
`,z=t.button`
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 10px;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    background: ${s=>s.active?"white":"transparent"};
    color: ${s=>s.active?"#2563eb":"#64748b"};
    box-shadow: ${s=>s.active?"0 2px 5px rgba(0,0,0,0.06)":"none"};
    
    &:hover { color: ${s=>s.active?"#2563eb":"#334155"}; }
`,$e=t.div`
    display: flex; align-items: center; gap: 0.75rem;
    padding-left: 1rem;
    border-left: 1px solid #cbd5e1;
    
    @media (max-width: 768px) { border-left: none; padding-left: 0; flex-wrap: wrap; }
`,R=t.input`
  padding: 0.5rem 0.8rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 10px;
  font-size: 0.9rem;
  color: #334155;
  background: white;
  font-family: inherit; font-weight: 500;
  &:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
`,Pe=t.button`
  width: 36px; height: 36px;
  border: none;
  border-radius: 10px;
  background: #3b82f6;
  color: white;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);

  &:hover { background: #2563eb; transform: translateY(-1px); box-shadow: 0 6px 15px rgba(59, 130, 246, 0.4); }
  &:active { transform: translateY(0); }
`,Ne=t.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 640px) { grid-template-columns: repeat(2, 1fr); }
  @media (min-width: 1200px) { grid-template-columns: repeat(4, 1fr); }
`,b=t.div`
  background: white;
  padding: 1.5rem;
  border-radius: 24px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.6);
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02), 0 10px 15px -3px rgba(0,0,0,0.03);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s;
  animation: ${U} 0.5s ease-out forwards;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
  }

  /* Gradiente opcional */
  ${s=>s.gradient&&me`
      background: ${s.gradient};
      color: white;
      border: none;
      box-shadow: 0 10px 20px -5px rgba(37, 99, 235, 0.3);
      
      ${p}, ${x} { opacity: 0.9; color: white !important; }
      ${m} { color: white !important; }
  `}
`,p=t.div`
    display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;
    font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;
    color: #64748b;
`,m=t.div`
    font-size: 2.2rem; font-weight: 800; letter-spacing: -0.03em;
    margin-bottom: 0.25rem; color: #0f172a;
`,x=t.div`
    font-size: 0.85rem; color: #94a3b8; font-weight: 500;
`,Be=t.div`
    display: grid; 
    grid-template-columns: 1fr; 
    gap: 1.5rem;
    margin-top: 1.5rem;
    
    @media (min-width: 1024px) { grid-template-columns: 2.2fr 1fr; } 
`,Ee=t.div`
    background: white; padding: 1.5rem; border-radius: 24px;
    border: 1px solid #f1f5f9; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
    min-height: 420px;
    display: flex; flex-direction: column;
`,Le=t.div`
    display: flex; flex-direction: column; gap: 1.5rem;
`,V=t.div`
    background: white; padding: 1.5rem; border-radius: 24px;
    border: 1px solid #f1f5f9; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
    flex: 1;
`,M=t.h3`
    margin: 0 0 1.25rem 0; font-size: 1rem; color: #0f172a; display: flex; align-items: center; gap: 0.5rem; font-weight: 700;
`,Y=t.div`
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.85rem 0; border-bottom: 1px dashed #e2e8f0;
    &:last-child { border-bottom: none; }
    
    .name { font-weight: 600; color: #334155; font-size: 0.9rem; }
    .value { font-weight: 700; color: #0f172a; font-family: 'Inter', sans-serif; }
    .rank { 
        background: #f1f5f9; color: #64748b; width: 24px; height: 24px; 
        border-radius: 8px; display: flex; align-items: center; justify-content: center; 
        font-size: 0.75rem; font-weight: bold; margin-right: 0.75rem; 
    }
    .left { display: flex; align-items: center; }
`,Oe=t.div`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(4px);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000;
  flex-direction: column; gap: 1rem;
  font-weight: 700; color: #3b82f6;
  font-size: 1.2rem;
`,Ue=()=>{const s=ne(),[y,I]=n.useState(T),[v,F]=n.useState(T),[w,_]=n.useState("today"),[A,H]=n.useState({ventas_brutas:0,ganancia_total:0}),[G,K]=n.useState(0),[$,q]=n.useState([]),[g,Z]=n.useState([]),[Q,J]=n.useState({labels:[],datasets:[]}),[X,j]=n.useState(!0),[k,S]=n.useState({isOpen:!1,title:"",message:""}),f=a=>new Intl.NumberFormat("es-NI",{style:"currency",currency:"NIO",minimumFractionDigits:2}).format(a||0),C=a=>{_(a);const r=new Date;let o=new Date,i=new Date;if(a!=="today")if(a==="week"){const d=r.getDay(),u=r.getDate()-d+(d===0?-6:1);o.setDate(u)}else a==="month"&&(o=new Date(r.getFullYear(),r.getMonth(),1));const h=d=>d.toLocaleDateString("sv-SE",{timeZone:"America/Managua"});I(h(o)),F(h(i))},D=n.useCallback(async()=>{j(!0);const a=localStorage.getItem("token");if(!a){S({isOpen:!0,title:"Sesión Expirada",message:"Por favor inicia sesión nuevamente."}),j(!1);return}try{const r={Authorization:`Bearer ${a}`},o=`?startDate=${y}&endDate=${v}`,i=async c=>{try{const l=await fetch(`${Se}${c}`,{headers:r});return l.ok?await l.json():null}catch{return null}},[h,d,u,N,B]=await Promise.all([i(`/reports/sales-summary${o}`),i("/reports/inventory-value"),i(`/reports/sales-by-user${o}`),i(`/reports/top-products${o}`),i(`/reports/sales-chart${o}`)]),ee=h||{ventas_brutas:0,ganancia_total:0},te=d||{valor_total_inventario:0},ae=Array.isArray(u)?u:[],re=Array.isArray(N)?N:[],E=Array.isArray(B)?B:[];H(ee),K(te.valor_total_inventario||0),q(ae),Z(re),J({labels:E.map(c=>{let l=c.dia;typeof l=="string"&&l.length===10&&(l+="T12:00:00");const se=new Date(l);return new Intl.DateTimeFormat("es-NI",{day:"2-digit",month:"short"}).format(se)}),datasets:[{label:"Ventas Totales",data:E.map(c=>c.total_diario),backgroundColor:"rgba(59, 130, 246, 0.6)",borderColor:"#2563eb",borderWidth:2,borderRadius:8,hoverBackgroundColor:"#2563eb"}]})}catch(r){console.error("Error fetching reports:",r),S({isOpen:!0,title:"Error de Conexión",message:"No se pudieron cargar los datos del servidor."})}finally{j(!1)}},[y,v]);n.useEffect(()=>{D()},[D]);const P=(a,r)=>{_("custom"),a==="start"?I(r):F(r)};return e.jsxs(Ce,{children:[X&&e.jsxs(Oe,{children:[e.jsx(L,{className:"spin",size:40}),"Cargando Datos..."]}),e.jsx(ke,{isOpen:k.isOpen,onClose:()=>S({isOpen:!1,title:"",message:""}),title:k.title,message:k.message}),e.jsxs(De,{children:[e.jsxs(ze,{children:[e.jsx(Ie,{onClick:()=>s("/dashboard"),title:"Volver al Dashboard",children:e.jsx(oe,{size:18})}),e.jsxs("div",{children:[e.jsx(Fe,{children:"Dashboard Financiero"}),e.jsx("p",{style:{margin:"4px 0 0 0",color:"#64748b",fontSize:"0.95rem"},children:"Resumen de operaciones y auditoría"})]})]}),e.jsxs(_e,{children:[e.jsxs(Ae,{children:[e.jsx(z,{active:w==="today",onClick:()=>C("today"),children:"Hoy"}),e.jsx(z,{active:w==="week",onClick:()=>C("week"),children:"Semana"}),e.jsx(z,{active:w==="month",onClick:()=>C("month"),children:"Mes"})]}),e.jsxs($e,{children:[e.jsx("span",{style:{fontSize:"0.85rem",color:"#64748b",fontWeight:600},children:"Rango:"}),e.jsx(R,{type:"date",value:y,onChange:a=>P("start",a.target.value)}),e.jsx("span",{style:{color:"#cbd5e0"},children:"—"}),e.jsx(R,{type:"date",value:v,onChange:a=>P("end",a.target.value)}),e.jsx(Pe,{onClick:D,title:"Recargar",children:e.jsx(L,{})})]})]})]}),e.jsxs(Ne,{children:[e.jsxs(b,{gradient:"linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",dark:!0,children:[e.jsxs(p,{children:[e.jsx(ie,{})," Ventas Totales"]}),e.jsx(m,{children:f(A.ventas_brutas)}),e.jsx(x,{children:"En el periodo seleccionado"})]}),e.jsxs(b,{children:[e.jsxs(p,{style:{color:"#16a34a"},children:[e.jsx(le,{})," Ganancia Estimada"]}),e.jsx(m,{style:{color:"#16a34a"},children:f(A.ganancia_total)}),e.jsx(x,{children:"Margen bruto calculado"})]}),e.jsxs(b,{children:[e.jsxs(p,{style:{color:"#0f172a"},children:[e.jsx(O,{})," Valor Inventario"]}),e.jsx(m,{children:f(G)}),e.jsx(x,{children:"Capital en mercadería (Actual)"})]}),e.jsxs(b,{gradient:"linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",dark:!0,children:[e.jsxs(p,{children:[e.jsx(de,{})," Producto Top"]}),g[0]?e.jsxs(e.Fragment,{children:[e.jsx("div",{style:{fontSize:"1.3rem",fontWeight:800,marginBottom:"0.5rem",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:g[0].nombre}),e.jsxs(x,{children:[g[0].total_unidades_vendidas," unidades vendidas"]})]}):e.jsx(m,{style:{fontSize:"1.5rem"},children:"—"})]})]}),e.jsxs(Be,{children:[e.jsxs(Ee,{children:[e.jsx("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"1.5rem"},children:e.jsx("h3",{style:{margin:0,color:"#0f172a"},children:"Tendencia de Ventas"})}),e.jsx("div",{style:{flex:1,position:"relative"},children:e.jsx(ce,{data:Q,options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1},tooltip:{backgroundColor:"rgba(15, 23, 42, 0.9)",padding:12,cornerRadius:8,titleFont:{size:14},bodyFont:{size:14,weight:"bold"}}},scales:{y:{grid:{color:"#f1f5f9"},border:{display:!1}},x:{grid:{display:!1},border:{display:!1}}},animation:{duration:1e3}}})})]}),e.jsxs(Le,{children:[e.jsxs(V,{children:[e.jsxs(M,{children:[e.jsx(pe,{style:{color:"#3b82f6"}})," Top Vendedores"]}),e.jsx("div",{style:{display:"flex",flexDirection:"column"},children:$.length>0?$.map((a,r)=>e.jsxs(Y,{children:[e.jsxs("div",{className:"left",children:[e.jsx("span",{className:"rank",children:r+1}),e.jsx("span",{className:"name",children:a.nombre_usuario})]}),e.jsx("span",{className:"value",children:f(a.total_vendido)})]},r)):e.jsx("p",{style:{color:"#94a3b8",textAlign:"center"},children:"Sin datos de ventas"})})]}),e.jsxs(V,{children:[e.jsxs(M,{children:[e.jsx(O,{style:{color:"#f59e0b"}})," Más Vendidos"]}),e.jsx("div",{style:{display:"flex",flexDirection:"column"},children:g.slice(0,5).map((a,r)=>e.jsxs(Y,{children:[e.jsxs("div",{className:"left",children:[e.jsx("span",{className:"rank",children:r+1}),e.jsx("span",{className:"name",style:{maxWidth:"140px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},title:a.nombre,children:a.nombre})]}),e.jsxs("span",{className:"value",children:[a.total_unidades_vendidas," und."]})]},r))})]})]})]})]})};export{Ue as default};

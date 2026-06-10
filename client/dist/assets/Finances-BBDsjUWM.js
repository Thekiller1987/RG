import{b as le,r as s,j as e,ab as L,X as de,af as ce,am as pe,ag as me,an as R,ao as xe,ap as ge,aq as he,s as t,q as fe,ae as be,t as Y,ar as ue,as as ye,at as we,au as ve,av as je,aw as ke,ax as Se,ay as Ce,az as De,aA as Ie}from"./vendor-Bq1Leo8N.js";import{A as ze}from"./AlertModal-DDfPP18V.js";import{A as Fe}from"./index-TWobjvLy.js";import"./scanner-vendor-DfxRpMWJ.js";import"./POS.styles-C1-0jN3D.js";import"./pdf-vendor-D5JPV6N2.js";ue.register(ye,we,ve,je,ke,Se,Ce,De,Ie);const O=()=>new Date().toLocaleDateString("sv-SE",{timeZone:"America/Managua"}),H=Y`from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`;Y`0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); } 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }`;const U=t.div`
  padding: clamp(1rem, 3vw, 2.5rem);
  background-color: #f1f5f9; /* Slate-100 */
  min-height: 100vh;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: #1e293b;
  animation: ${H} 0.6s cubic-bezier(0.16, 1, 0.3, 1);

  @media print {
    padding: 0;
    background-color: white;
  }
`,Ae=fe`
  @media print {
    body { background: white !important; }
    .no-print { display: none !important; }
    .print-only { display: block !important; }
    ${U} { padding: 0 !important; }
    button { display: none !important; }
    header, .controls { display: none !important; }
    .chart-container { page-break-inside: avoid; margin-bottom: 2rem; }
    .grid-container { display: block !important; }
    .card { break-inside: avoid; border: 1px solid #eee !important; margin-bottom: 15px !important; box-shadow: none !important; }
  }
  .print-only { display: none; }
`,Pe=t.header`
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
`,_e=t.div`
  display: flex; align-items: center; gap: 1rem;
`,$e=t.button`
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
`,Ne=t.h1`
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  color: #0f172a;
  margin: 0;
  font-weight: 800;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`,Be=t.div`
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
`,Ee=t.div`
    display: flex; gap: 0.5rem; background: #e2e8f0; padding: 4px; border-radius: 14px;
`,I=t.button`
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 10px;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    background: ${n=>n.active?"white":"transparent"};
    color: ${n=>n.active?"#2563eb":"#64748b"};
    box-shadow: ${n=>n.active?"0 2px 5px rgba(0,0,0,0.06)":"none"};
    
    &:hover { color: ${n=>n.active?"#2563eb":"#334155"}; }
`,Le=t.div`
    display: flex; align-items: center; gap: 0.75rem;
    padding-left: 1rem;
    border-left: 1px solid #cbd5e1;
    
    @media (max-width: 768px) { border-left: none; padding-left: 0; flex-wrap: wrap; }
`,T=t.input`
  padding: 0.5rem 0.8rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 10px;
  font-size: 0.9rem;
  color: #334155;
  background: white;
  font-family: inherit; font-weight: 500;
  &:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
`,G=t.button`
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
`,Re=t(G)`
  background: #10b981;
  box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);
  &:hover { background: #059669; box-shadow: 0 6px 15px rgba(16, 185, 129, 0.4); }
`,Oe=t.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 640px) { grid-template-columns: repeat(2, 1fr); }
  @media (min-width: 1200px) { grid-template-columns: repeat(4, 1fr); }
`,w=t.div`
  background: white;
  padding: 1.5rem;
  border-radius: 24px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.6);
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02), 0 10px 15px -3px rgba(0,0,0,0.03);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s;
  animation: ${H} 0.5s ease-out forwards;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
  }

  /* Gradiente opcional */
  ${n=>n.gradient&&be`
      background: ${n.gradient};
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
`,Te=t.div`
    display: grid; 
    grid-template-columns: 1fr; 
    gap: 1.5rem;
    margin-top: 1.5rem;
    
    @media (min-width: 1024px) { grid-template-columns: 2.2fr 1fr; } 
`,Ve=t.div`
    background: white; padding: 1.5rem; border-radius: 24px;
    border: 1px solid #f1f5f9; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
    min-height: 420px;
    display: flex; flex-direction: column;
`,Me=t.div`
    display: flex; flex-direction: column; gap: 1.5rem;
`,V=t.div`
    background: white; padding: 1.5rem; border-radius: 24px;
    border: 1px solid #f1f5f9; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
    flex: 1;
`,M=t.h3`
    margin: 0 0 1.25rem 0; font-size: 1rem; color: #0f172a; display: flex; align-items: center; gap: 0.5rem; font-weight: 700;
`,W=t.div`
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
`,We=t.div`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(4px);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000;
  flex-direction: column; gap: 1rem;
  font-weight: 700; color: #3b82f6;
  font-size: 1.2rem;
`,Ze=()=>{const n=le(),[g,z]=s.useState(O),[h,F]=s.useState(O),[v,A]=s.useState("today"),[P,K]=s.useState({ventas_brutas:0,ganancia_total:0}),[q,Z]=s.useState(0),[_,Q]=s.useState([]),[f,X]=s.useState([]),[J,ee]=s.useState({labels:[],datasets:[]}),[te,j]=s.useState(!0),[k,S]=s.useState({isOpen:!1,title:"",message:""}),b=a=>new Intl.NumberFormat("es-NI",{style:"currency",currency:"NIO",minimumFractionDigits:2}).format(a||0),C=a=>{A(a);const r=new Date;let o=new Date,i=new Date;if(a!=="today")if(a==="week"){const d=r.getDay(),y=r.getDate()-d+(d===0?-6:1);o.setDate(y)}else a==="month"&&(o=new Date(r.getFullYear(),r.getMonth(),1));const u=d=>d.toLocaleDateString("sv-SE",{timeZone:"America/Managua"});z(u(o)),F(u(i))},D=s.useCallback(async()=>{j(!0);const a=localStorage.getItem("token");if(!a){S({isOpen:!0,title:"Sesión Expirada",message:"Por favor inicia sesión nuevamente."}),j(!1);return}try{const r={Authorization:`Bearer ${a}`},o=`?startDate=${g}&endDate=${h}`,i=async c=>{try{const l=await fetch(`${Fe}${c}`,{headers:r});return l.ok?await l.json():null}catch{return null}},[u,d,y,N,B]=await Promise.all([i(`/reports/sales-summary${o}`),i("/reports/inventory-value"),i(`/reports/sales-by-user${o}`),i(`/reports/top-products${o}`),i(`/reports/sales-chart${o}`)]),re=u||{ventas_brutas:0,ganancia_total:0},ne=d||{valor_total_inventario:0},se=Array.isArray(y)?y:[],oe=Array.isArray(N)?N:[],E=Array.isArray(B)?B:[];K(re),Z(ne.valor_total_inventario||0),Q(se),X(oe),ee({labels:E.map(c=>{let l=c.dia;typeof l=="string"&&l.length===10&&(l+="T12:00:00");const ie=new Date(l);return new Intl.DateTimeFormat("es-NI",{day:"2-digit",month:"short"}).format(ie)}),datasets:[{label:"Ventas Totales",data:E.map(c=>c.total_diario),backgroundColor:"rgba(59, 130, 246, 0.6)",borderColor:"#2563eb",borderWidth:2,borderRadius:8,hoverBackgroundColor:"#2563eb"}]})}catch(r){console.error("Error fetching reports:",r),S({isOpen:!0,title:"Error de Conexión",message:"No se pudieron cargar los datos del servidor."})}finally{j(!1)}},[g,h]);s.useEffect(()=>{D()},[D]);const $=(a,r)=>{A("custom"),a==="start"?z(r):F(r)},ae=()=>{window.print()};return e.jsxs(U,{children:[e.jsx(Ae,{}),e.jsxs("div",{className:"print-only",style:{textAlign:"center",marginBottom:"20px"},children:[e.jsx("h1",{style:{margin:0},children:"Reporte Financiero - Multirepuestos RG"}),e.jsxs("p",{children:["Periodo: ",g," al ",h]})]}),te&&e.jsxs(We,{children:[e.jsx(L,{className:"spin",size:40}),"Cargando Datos..."]}),e.jsx(ze,{isOpen:k.isOpen,onClose:()=>S({isOpen:!1,title:"",message:""}),title:k.title,message:k.message}),e.jsxs(Pe,{children:[e.jsxs(_e,{children:[e.jsx($e,{onClick:()=>n("/dashboard"),title:"Volver al Dashboard",children:e.jsx(de,{size:18})}),e.jsxs("div",{children:[e.jsx(Ne,{children:"Dashboard Financiero"}),e.jsx("p",{style:{margin:"4px 0 0 0",color:"#64748b",fontSize:"0.95rem"},children:"Resumen de operaciones y auditoría"})]})]}),e.jsxs(Be,{children:[e.jsxs(Ee,{children:[e.jsx(I,{active:v==="today",onClick:()=>C("today"),children:"Hoy"}),e.jsx(I,{active:v==="week",onClick:()=>C("week"),children:"Semana"}),e.jsx(I,{active:v==="month",onClick:()=>C("month"),children:"Mes"})]}),e.jsxs(Le,{className:"controls",children:[e.jsx("span",{style:{fontSize:"0.85rem",color:"#64748b",fontWeight:600},children:"Rango:"}),e.jsx(T,{type:"date",value:g,onChange:a=>$("start",a.target.value)}),e.jsx("span",{style:{color:"#cbd5e0"},children:"—"}),e.jsx(T,{type:"date",value:h,onChange:a=>$("end",a.target.value)}),e.jsx(G,{onClick:D,title:"Recargar",children:e.jsx(L,{})}),e.jsx(Re,{onClick:ae,title:"Imprimir Reporte",children:e.jsx(ce,{})})]})]})]}),e.jsxs(Oe,{children:[e.jsxs(w,{gradient:"linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",dark:!0,children:[e.jsxs(p,{children:[e.jsx(pe,{})," Ventas Totales"]}),e.jsx(m,{children:b(P.ventas_brutas)}),e.jsx(x,{children:"En el periodo seleccionado"})]}),e.jsxs(w,{children:[e.jsxs(p,{style:{color:"#16a34a"},children:[e.jsx(me,{})," Ganancia Estimada"]}),e.jsx(m,{style:{color:"#16a34a"},children:b(P.ganancia_total)}),e.jsx(x,{children:"Margen bruto calculado"})]}),e.jsxs(w,{children:[e.jsxs(p,{style:{color:"#0f172a"},children:[e.jsx(R,{})," Valor Inventario"]}),e.jsx(m,{children:b(q)}),e.jsx(x,{children:"Capital en mercadería (Actual)"})]}),e.jsxs(w,{gradient:"linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",dark:!0,children:[e.jsxs(p,{children:[e.jsx(xe,{})," Producto Top"]}),f[0]?e.jsxs(e.Fragment,{children:[e.jsx("div",{style:{fontSize:"1.3rem",fontWeight:800,marginBottom:"0.5rem",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:f[0].nombre}),e.jsxs(x,{children:[f[0].total_unidades_vendidas," unidades vendidas"]})]}):e.jsx(m,{style:{fontSize:"1.5rem"},children:"—"})]})]}),e.jsxs(Te,{children:[e.jsxs(Ve,{children:[e.jsx("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"1.5rem"},children:e.jsx("h3",{style:{margin:0,color:"#0f172a"},children:"Tendencia de Ventas"})}),e.jsx("div",{style:{flex:1,position:"relative"},children:e.jsx(ge,{data:J,options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1},tooltip:{backgroundColor:"rgba(15, 23, 42, 0.9)",padding:12,cornerRadius:8,titleFont:{size:14},bodyFont:{size:14,weight:"bold"}}},scales:{y:{grid:{color:"#f1f5f9"},border:{display:!1}},x:{grid:{display:!1},border:{display:!1}}},animation:{duration:1e3}}})})]}),e.jsxs(Me,{children:[e.jsxs(V,{children:[e.jsxs(M,{children:[e.jsx(he,{style:{color:"#3b82f6"}})," Top Vendedores"]}),e.jsx("div",{style:{display:"flex",flexDirection:"column"},children:_.length>0?_.map((a,r)=>e.jsxs(W,{children:[e.jsxs("div",{className:"left",children:[e.jsx("span",{className:"rank",children:r+1}),e.jsx("span",{className:"name",children:a.nombre_usuario})]}),e.jsx("span",{className:"value",children:b(a.total_vendido)})]},r)):e.jsx("p",{style:{color:"#94a3b8",textAlign:"center"},children:"Sin datos de ventas"})})]}),e.jsxs(V,{children:[e.jsxs(M,{children:[e.jsx(R,{style:{color:"#f59e0b"}})," Más Vendidos"]}),e.jsx("div",{style:{display:"flex",flexDirection:"column"},children:f.slice(0,5).map((a,r)=>e.jsxs(W,{children:[e.jsxs("div",{className:"left",children:[e.jsx("span",{className:"rank",children:r+1}),e.jsx("span",{className:"name",style:{maxWidth:"140px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},title:a.nombre,children:a.nombre})]}),e.jsxs("span",{className:"value",children:[a.total_unidades_vendidas," und."]})]},r))})]})]})]})]})};export{Ze as default};

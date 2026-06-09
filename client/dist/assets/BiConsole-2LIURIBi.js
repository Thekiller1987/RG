import{b as se,r as n,j as e,X as te,ab as ne,S as F,b0 as W,aW as U,aY as K,bl as le,am as de,ap as ce,aa as q,W as ge,bm as be,h as xe,s as a,q as pe,t as Q,ar as me,as as fe,at as he,av as ue,aw as je,au as ye,ax as ve,ay as Ce,az as De,aA as Se}from"./vendor-CQVyq-4b.js";import{a2 as we}from"./index-CS4NeRCd.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-jkx3_W9D.js";me.register(fe,he,ue,je,ye,ve,Ce,De,Se);const Ee=Q`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`,ke=Q`
  0% { opacity: 0.3; transform: scale(0.95); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0.3; transform: scale(0.95); }
`,Ae=pe`
  body.bi-theme {
    background-color: #07070e !important;
    background-image: 
      radial-gradient(circle at 5% 15%, rgba(237, 125, 49, 0.08) 0%, transparent 40%),
      radial-gradient(circle at 95% 85%, rgba(56, 189, 248, 0.08) 0%, transparent 40%) !important;
    background-attachment: fixed !important;
    color: #f3f4f6 !important;
    font-family: 'Outfit', sans-serif !important;
    transition: background-color 0.3s ease;
  }
`,ze=a.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 2rem 3rem 2rem;
  box-sizing: border-box;
  animation: ${Ee} 0.5s ease-out;
`,Re=a.header`
  padding: 1rem 0 2rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 2rem;
`,_e=a.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
`,Ie=a.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`,Be=a.button`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  cursor: pointer;
  color: #9ca3af;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.15);
    color: #fff;
  }
`,Pe=a.div`
  h1 {
    font-size: 1.6rem;
    font-weight: 800;
    margin: 0;
    background: linear-gradient(135deg, #fff 40%, #ED7D31 80%, #38bdf8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  p {
    font-size: 0.85rem;
    color: #9ca3af;
    margin: 0.2rem 0 0 0;
  }
`,P=a.span`
  background: ${r=>r.bg||"rgba(237, 125, 49, 0.15)"};
  color: ${r=>r.color||"#ED7D31"};
  border: 1px solid ${r=>r.border||"rgba(237, 125, 49, 0.3)"};
  padding: 0.25rem 0.65rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
`,Ne=a.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: ${ke} 1.5s infinite;
`,Le=a.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
`,Me=a.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
`,j=a.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${r=>r.accent||"#ED7D31"};
  }

  &:hover {
    transform: translateY(-3px);
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: ${r=>r.glow||"0 0 15px rgba(237, 125, 49, 0.15)"};
  }
`,y=a.div`
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #9ca3af;
  font-weight: 600;
`,v=a.div`
  font-size: 2.2rem;
  font-weight: 800;
  color: #fff;
  margin-top: 0.25rem;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
`,C=a.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: #9ca3af;
`,D=a.p`
  font-size: 0.8rem;
  color: #9ca3af;
  margin-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  padding-top: 0.5rem;
`,Te=a.div`
  display: flex;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 0.35rem;
  border-radius: 12px;
  gap: 0.5rem;
  align-self: flex-start;
  flex-wrap: wrap;
`,S=a.button`
  background: none;
  border: none;
  color: ${r=>r.active?"#fff":"#9ca3af"};
  background: ${r=>r.active?"rgba(255, 255, 255, 0.08)":"none"};
  border: ${r=>r.active?"1px solid rgba(255, 255, 255, 0.06)":"1px solid transparent"};
  box-shadow: ${r=>r.active?"0 4px 12px rgba(0, 0, 0, 0.2)":"none"};
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  font-family: inherit;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.04);
  }

  svg {
    color: ${r=>r.active?"#ED7D31":"inherit"};
  }
`,w=a.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(48%, 1fr));
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`,l=a.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 1.8rem;
  backdrop-filter: blur(15px);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`,d=a.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 0.75rem;

  svg {
    width: 20px;
    height: 20px;
    color: #38bdf8;
  }
`,c=a.p`
  font-size: 0.9rem;
  color: #9ca3af;
  margin: 0;
`,V=a.div`
  width: 100%;
  height: 280px;
  position: relative;
`,E=a.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`,k=a.input`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  padding: 0.7rem 1rem;
  color: #fff;
  font-family: inherit;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:focus {
    border-color: #ED7D31;
    outline: none;
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 0 0 10px rgba(237, 125, 49, 0.15);
  }
`,$e=a.div`
  text-align: center;
  padding: 0.75rem;
  border-radius: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: bold;
  font-size: 0.85rem;
  background: ${r=>r.bg||"rgba(16, 185, 129, 0.15)"};
  color: ${r=>r.color||"#10b981"};
  border: 1px solid ${r=>r.border||"rgba(16, 185, 129, 0.3)"};
  margin-top: 0.5rem;
`,Oe=a.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`,Fe=a.div`
  background: rgba(244, 63, 94, 0.04);
  border: 1px solid rgba(244, 63, 94, 0.15);
  border-left: 4px solid ${r=>r.accent||"#f43f5e"};
  border-radius: 8px;
  padding: 0.9rem 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`,We=a.div`
  h4 {
    font-size: 0.95rem;
    color: #fff;
    font-weight: 600;
    margin: 0 0 0.2rem 0;
  }
  p {
    font-size: 0.8rem;
    color: #9ca3af;
    margin: 0;
  }
`,Ue=a.span`
  background: ${r=>r.bg||"rgba(244, 63, 94, 0.15)"};
  color: ${r=>r.color||"#f43f5e"};
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: bold;
  white-space: nowrap;
`,Ke=a.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
`,qe=a.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9rem;

  th {
    background: rgba(255, 255, 255, 0.03);
    color: #fff;
    font-weight: 600;
    padding: 0.9rem 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  td {
    padding: 0.9rem 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    color: #9ca3af;
  }

  tr:hover td {
    background: rgba(255, 255, 255, 0.01);
    color: #fff;
  }
`,H=a.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 4px;
  background: rgba(255,255,255,0.02);
  padding: 10px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.06);
`,o=a.div`
  height: 24px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: bold;
  background: ${r=>r.isNull?"rgba(244, 63, 94, 0.15)":"rgba(16, 185, 129, 0.15)"};
  border: 1px solid ${r=>r.isNull?"rgba(244, 63, 94, 0.4)":"rgba(16, 185, 129, 0.4)"};
  color: ${r=>r.isNull?"#f43f5e":"#10b981"};
`,Ve=a.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  min-height: 300px;
`,He=a.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  gap: 1.2rem;
  align-items: center;
  justify-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`,A=a.div`
  background: ${r=>r.bg||"rgba(56, 189, 248, 0.04)"};
  border: 1px solid ${r=>r.border||"rgba(56, 189, 248, 0.3)"};
  border-radius: 8px;
  padding: 0.75rem 1rem;
  width: 100%;
  max-width: 200px;
  text-align: center;
`,z=a.div`
  font-weight: bold;
  color: ${r=>r.color||"#38bdf8"};
  font-size: 0.85rem;
  border-bottom: 1px solid ${r=>r.border||"rgba(56, 189, 248, 0.2)"};
  margin-bottom: 0.4rem;
  padding-bottom: 0.2rem;
`,x=a.div`
  font-size: 0.75rem;
  text-align: left;
  color: #9ca3af;
  line-height: 1.4;
`,Je=a.div`
  background: rgba(237, 125, 49, 0.08);
  border: 2px solid #ED7D31;
  border-radius: 12px;
  padding: 1rem;
  width: 100%;
  max-width: 220px;
  text-align: center;
  box-shadow: 0 0 15px rgba(237, 125, 49, 0.25);
`,Qe=a.pre`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  padding: 1.2rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: #38bdf8;
  overflow-x: auto;
  white-space: pre-wrap;
  margin: 0;
`,Ge=a.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.06);
`,Ye=a.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;

  @media (max-width: 1024px) {
    flex-direction: column;
    text-align: center;
  }
`,N=a.div`
  flex: 1;
  min-width: 220px;
  background: ${r=>r.bg||"rgba(56, 189, 248, 0.05)"};
  border: 1px solid ${r=>r.border||"rgba(56, 189, 248, 0.2)"};
  padding: 1.2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: ${r=>r.glow||"0 0 15px rgba(56, 189, 248, 0.25)"};

  h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
    color: ${r=>r.color||"#38bdf8"};
    font-weight: 700;
  }

  p {
    font-size: 0.8rem;
    color: #9ca3af;
    margin: 0;
  }
`,J=a.div`
  color: ${r=>r.color||"#38bdf8"};
  font-weight: bold;
  font-size: 1.5rem;

  @media (max-width: 1024px) {
    transform: rotate(90deg);
  }
`,Xe=a.ul`
  padding-left: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  color: #9ca3af;
  font-size: 0.9rem;
  margin: 0;

  strong {
    color: #fff;
  }
`,Ze=a.footer`
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding: 2rem 0 1rem 0;
  text-align: center;
  font-size: 0.85rem;
  color: #9ca3af;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`,er=a.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  flex-direction: column;
  gap: 1.5rem;
  color: #38bdf8;
  font-weight: 700;
  font-size: 1.2rem;

  .spinner {
    animation: spin 1.5s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`,sr=()=>{var M,T,$,O;const r=se(),[g,p]=n.useState("tab-dashboard"),[R,G]=n.useState(100),[_,Y]=n.useState(1250),[I,X]=n.useState(1350),[b,Z]=n.useState({diferencia:0,mensaje:"Conciliación Exitosa: El efectivo físico cuadra al 100% con caja.",color:"#10b981",bg:"rgba(16, 185, 129, 0.15)",border:"rgba(16, 185, 129, 0.4)"}),[i,ee]=n.useState(null),[re,ae]=n.useState(!0),L=n.useCallback(()=>{const s=Number(R)+Number(_),t=Number(I)-s;let m="",f="",h="",u="";t===0?(f="#10b981",h="rgba(16, 185, 129, 0.15)",u="rgba(16, 185, 129, 0.4)",m="Conciliación Exitosa: El efectivo físico cuadra al 100% con caja."):t<0?(f="#f43f5e",h="rgba(244, 63, 94, 0.15)",u="rgba(244, 63, 94, 0.4)",m=`Alerta de Auditoría: Pérdida o desvío no facturado de C$ ${Math.abs(t).toFixed(2)}`):(f="#ED7D31",h="rgba(237, 125, 49, 0.15)",u="rgba(237, 125, 49, 0.4)",m=`Ingreso de Efectivo Excedente: Dinero físico no registrado de C$ ${t.toFixed(2)}`),Z({diferencia:t,mensaje:m,color:f,bg:h,border:u})},[R,_,I]);n.useEffect(()=>{L()},[L]);const B=n.useCallback(async()=>{const s=localStorage.getItem("token");if(!s){r("/login");return}try{const t=await we(s);ee(t)}catch(t){console.error("Error al cargar métricas BI:",t)}finally{ae(!1)}},[r]);n.useEffect(()=>{document.body.classList.add("bi-theme"),B();const s=setInterval(B,5e3);return()=>{document.body.classList.remove("bi-theme"),clearInterval(s)}},[B]);const oe=()=>!i||!i.sales_history?{labels:[],datasets:[]}:{labels:i.sales_history.labels,datasets:[{label:"Ventas Reales (C$)",data:i.sales_history.reales,borderColor:"#38bdf8",backgroundColor:"rgba(56, 189, 248, 0.08)",fill:!0,tension:.35,borderWidth:3,pointRadius:4,pointBackgroundColor:"#38bdf8"},{label:"Proyección Analítica (C$)",data:i.sales_history.proyeccion,borderColor:"#ED7D31",borderDash:[5,5],backgroundColor:"transparent",fill:!1,tension:.35,borderWidth:3,pointRadius:4,pointBackgroundColor:"#ED7D31"}]},ie=()=>!i||!i.category_margins?{labels:[],datasets:[]}:{labels:i.category_margins.labels,datasets:[{label:"Margen de Retorno (%)",data:i.category_margins.values,backgroundColor:["rgba(237, 125, 49, 0.75)","rgba(56, 189, 248, 0.75)","rgba(16, 185, 129, 0.75)","rgba(168, 85, 247, 0.75)","rgba(244, 63, 94, 0.75)"],borderColor:"rgba(255, 255, 255, 0.1)",borderWidth:1,borderRadius:6}]};return e.jsxs(ze,{children:[e.jsx(Ae,{}),e.jsx(Re,{children:e.jsxs(_e,{children:[e.jsxs(Ie,{children:[e.jsx(Be,{onClick:()=>r("/dashboard"),title:"Volver al Panel",children:e.jsx(te,{size:16})}),e.jsxs(Pe,{children:[e.jsxs("h1",{children:["Multirepuestos RG ",e.jsx(P,{children:"Consola BI"})]}),e.jsx("p",{children:"Consola Analítica y Panel de Inteligencia de Negocios (BI) | UNAN-Managua CUR Chontales"})]})]}),e.jsxs("div",{style:{display:"flex",gap:"1rem",alignItems:"center"},children:[e.jsxs(P,{bg:"rgba(16, 185, 129, 0.12)",color:"#10b981",border:"rgba(16, 185, 129, 0.3)",children:[e.jsx(Ne,{}),"Conexión en línea (BD)"]}),e.jsx(P,{bg:"rgba(56, 189, 248, 0.1)",color:"#38bdf8",border:"rgba(56, 189, 248, 0.2)",children:"Listo para Defensa"})]})]})}),re?e.jsxs(er,{children:[e.jsx(ne,{size:40,className:"spinner"}),e.jsx("span",{children:"Calculando variables OLAP en base de datos..."})]}):e.jsxs(Le,{children:[e.jsxs(Me,{children:[e.jsxs(j,{accent:"#ED7D31",glow:"0 0 15px rgba(237, 125, 49, 0.2)",children:[e.jsx(y,{children:"Artículos en Catálogo"}),e.jsxs(v,{children:[(M=i==null?void 0:i.total_productos)==null?void 0:M.toLocaleString()," ",e.jsx(C,{children:"Items Activos"})]}),e.jsx(D,{children:"Consolidado completo y disponible para venta en tiempo real."})]}),e.jsxs(j,{accent:"#38bdf8",glow:"0 0 15px rgba(56, 189, 248, 0.2)",children:[e.jsx(y,{children:"Pureza de Datos (ETL)"}),e.jsxs(v,{children:["100.0 ",e.jsx(C,{children:"%"})]}),e.jsx(D,{children:"0% Valores nulos, SKU inconsistentes o fechas corruptas tras limpieza en R."})]}),e.jsxs(j,{accent:"#10b981",glow:"0 0 15px rgba(16, 185, 129, 0.2)",children:[e.jsx(y,{children:"Margen Promedio Comercial"}),e.jsxs(v,{children:[(T=i==null?void 0:i.promedio_margen)==null?void 0:T.toFixed(1)," ",e.jsx(C,{children:"% Retorno"})]}),e.jsx(D,{children:"Rentabilidad acumulada ponderada sobre costo de adquisición."})]}),e.jsxs(j,{accent:"#f43f5e",glow:"0 0 15px rgba(244, 63, 94, 0.2)",children:[e.jsx(y,{children:"Riesgo de Estancamiento"}),e.jsxs(v,{children:[($=i==null?void 0:i.riesgo_estancamiento)==null?void 0:$.toLocaleString()," ",e.jsx(C,{children:"Repuestos"})]}),e.jsx(D,{children:"Artículos con existencia física sin ventas registradas en los últimos 180 días."})]})]}),e.jsxs(Te,{children:[e.jsxs(S,{active:g==="tab-dashboard",onClick:()=>p("tab-dashboard"),children:[e.jsx(F,{size:14}),"Dashboard Analítico"]}),e.jsxs(S,{active:g==="tab-etl",onClick:()=>p("tab-etl"),children:[e.jsx(W,{size:14}),"Proceso de Limpieza ETL (RStudio)"]}),e.jsxs(S,{active:g==="tab-bi",onClick:()=>p("tab-bi"),children:[e.jsx(U,{size:14}),"Modelo de Inteligencia de Negocio (BI)"]}),e.jsxs(S,{active:g==="tab-architecture",onClick:()=>p("tab-architecture"),children:[e.jsx(K,{size:14}),"Arquitectura del Sistema"]})]}),g==="tab-dashboard"&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs(w,{children:[e.jsxs(l,{children:[e.jsxs(d,{children:[e.jsx(F,{}),"Historial de Ventas Semanales e Inyección Analítica"]}),e.jsx(c,{children:"Registros transaccionales reales comparados con la proyección analítica calculada mediante regresión lineal basada en el histórico de ventas."}),e.jsx(V,{children:e.jsx(le,{data:oe(),options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{labels:{color:"#9ca3af",font:{family:"Outfit"}}}},scales:{y:{grid:{color:"rgba(255,255,255,0.05)"},ticks:{color:"#9ca3af",font:{family:"Outfit"}}},x:{grid:{display:!1},ticks:{color:"#9ca3af",font:{family:"Outfit"}}}}}})})]}),e.jsxs(l,{children:[e.jsxs(d,{children:[e.jsx(de,{}),"Márgenes de Rentabilidad por Categoría"]}),e.jsx(c,{children:"Porcentaje de retorno de inversión real, segmentado por las 5 categorías de repuestos con mayor facturación acumulada."}),e.jsx(V,{children:e.jsx(ce,{data:ie(),options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{y:{grid:{color:"rgba(255,255,255,0.05)"},ticks:{color:"#9ca3af",font:{family:"Outfit"}}},x:{grid:{display:!1},ticks:{color:"#9ca3af",font:{family:"Outfit"}}}}}})})]})]}),e.jsxs(w,{children:[e.jsxs(l,{children:[e.jsxs(d,{children:[e.jsx(q,{color:"#ED7D31"}),"Módulo de Arqueo Seguro y Veracidad Analítica"]}),e.jsx(c,{children:"Herramienta de conciliación aritmética instantánea entre la caja real versus las ventas facturadas electrónicamente."}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"},children:[e.jsxs(E,{children:[e.jsx("label",{style:{fontSize:"0.85rem",color:"#9ca3af",fontWeight:600},children:"Monto Inicial de Caja (C$)"}),e.jsx(k,{type:"number",value:R,onChange:s=>G(s.target.value)})]}),e.jsxs(E,{children:[e.jsx("label",{style:{fontSize:"0.85rem",color:"#9ca3af",fontWeight:600},children:"Ventas en Efectivo (C$)"}),e.jsx(k,{type:"number",value:_,onChange:s=>Y(s.target.value)})]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"},children:[e.jsxs(E,{children:[e.jsx("label",{style:{fontSize:"0.85rem",color:"#9ca3af",fontWeight:600},children:"Efectivo Físico Contado (C$)"}),e.jsx(k,{type:"number",value:I,onChange:s=>X(s.target.value)})]}),e.jsxs(E,{children:[e.jsx("label",{style:{fontSize:"0.85rem",color:"#9ca3af",fontWeight:600},children:"Diferencia de Conciliación"}),e.jsx(k,{type:"text",value:(b.diferencia>=0?"+":"")+"C$ "+b.diferencia.toFixed(2),readOnly:!0,style:{fontWeight:"bold",background:"rgba(0,0,0,0.25)",color:b.color}})]})]}),e.jsx($e,{bg:b.bg,color:b.color,border:b.border,children:b.mensaje})]}),e.jsxs(l,{children:[e.jsxs(d,{children:[e.jsx(ge,{color:"#f43f5e"}),"Detección de Anomalías Transaccionales en Tiempo Real"]}),e.jsx(c,{children:"Alertas dinámicas disparadas por el motor analítico tras auditar la base de datos de manera automatizada."}),e.jsx(Oe,{children:(O=i==null?void 0:i.anomalies)==null?void 0:O.map((s,t)=>e.jsxs(Fe,{accent:s.risk==="Riesgo Alto"?"#f43f5e":"#ED7D31",children:[e.jsxs(We,{children:[e.jsx("h4",{children:s.title}),e.jsx("p",{children:s.desc})]}),e.jsx(Ue,{bg:s.risk==="Riesgo Alto"?"rgba(244, 63, 94, 0.15)":"rgba(237, 125, 49, 0.15)",color:s.risk==="Riesgo Alto"?"#f43f5e":"#ED7D31",children:s.badge})]},t))})]})]})]}),g==="tab-etl"&&e.jsxs(w,{children:[e.jsxs(l,{style:{gridColumn:"span 2"},children:[e.jsxs(d,{children:[e.jsx(W,{}),"El Pipeline de Datos: Estandarización y Depuración (RStudio)"]}),e.jsx(c,{children:"Antes de migrar la base de datos al nuevo motor relacional **MySQL 8** con motor de almacenamiento **InnoDB**, el conjunto legacy presentaba severas inconsistencias. El script desarrollado en **RStudio** procesó las 3,336 filas logrando una pureza absoluta."}),e.jsx(Ke,{children:e.jsxs(qe,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Caso de Inconsistencia (Legacy)"}),e.jsx("th",{children:"Transformación con dplyr y stringr (R)"}),e.jsx("th",{children:"Resultado Limpio E Insertable"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{style:{color:"#f43f5e",fontWeight:600},children:"12n5-3b, Bateria moto, -2.00"}),e.jsxs("td",{children:["Aplica ",e.jsx("code",{children:"abs()"})," en la cantidad e imputa formato SKU a mayúsculas."]}),e.jsx("td",{style:{color:"#10b981",fontWeight:600},children:"12N5-3B, BATERIA MOTO, 2.00"})]}),e.jsxs("tr",{children:[e.jsx("td",{style:{color:"#f43f5e",fontWeight:600},children:"bp014, Bridas, 2025/08/01"}),e.jsxs("td",{children:["Parsea fechas inconsistentes al formato ISO 8601 con ",e.jsx("code",{children:"lubridate"}),"."]}),e.jsx("td",{style:{color:"#10b981",fontWeight:600},children:"BP014, BRIDAS, 2025-08-01"})]}),e.jsxs("tr",{children:[e.jsx("td",{style:{color:"#f43f5e",fontWeight:600},children:"REP-003, Bujias x4, ERR"}),e.jsx("td",{children:"Imputación de precios nulos usando la media ponderada del catálogo en R."}),e.jsx("td",{style:{color:"#10b981",fontWeight:600},children:"REP-003, BUJIAS X4, 61.44"})]}),e.jsxs("tr",{children:[e.jsx("td",{style:{color:"#f43f5e",fontWeight:600},children:", Llanta aro 15, 10.00"}),e.jsx("td",{children:"Detecta llave primaria (PK) nula e imputa 'DESCONOCIDO' para no violar restricciones."}),e.jsx("td",{style:{color:"#10b981",fontWeight:600},children:"DESCONOCIDO, LLANTA ARO 15, 10.00"})]})]})]})})]}),e.jsxs(l,{style:{gridColumn:"span 2"},children:[e.jsxs(d,{children:[e.jsx(q,{color:"#10b981"}),"Evidencia del Corpus de Calidad de Datos (Mapa visdat)"]}),e.jsx(c,{children:"Representación diagnóstica simplificada del estado del dataset antes y después de aplicar el Pipeline en RStudio, identificando celdas con nulos (Missing Data):"}),e.jsx("h5",{style:{fontSize:"0.85rem",fontWeight:"bold",color:"#f43f5e",margin:"0.5rem 0 0.2rem 0"},children:"1. Dataset Legacy Original (Presencia de Nulos en Variables Críticas):"}),e.jsxs(H,{children:[e.jsx(o,{children:"ID"}),e.jsx(o,{children:"DESC"}),e.jsx(o,{isNull:!0,children:"CANT"}),e.jsx(o,{children:"PRC"}),e.jsx(o,{isNull:!0,children:"FCH"}),e.jsx(o,{children:"ID"}),e.jsx(o,{isNull:!0,children:"DESC"}),e.jsx(o,{children:"CANT"}),e.jsx(o,{children:"PRC"}),e.jsx(o,{children:"FCH"}),e.jsx(o,{children:"ID"}),e.jsx(o,{isNull:!0,children:"PRC"})]}),e.jsx("h5",{style:{fontSize:"0.85rem",fontWeight:"bold",color:"#10b981",margin:"1rem 0 0.2rem 0"},children:"2. Dataset Depurado Final (100% Completo y Auditado):"}),e.jsxs(H,{children:[e.jsx(o,{children:"ID"}),e.jsx(o,{children:"DESC"}),e.jsx(o,{children:"CANT"}),e.jsx(o,{children:"PRC"}),e.jsx(o,{children:"FCH"}),e.jsx(o,{children:"ID"}),e.jsx(o,{children:"DESC"}),e.jsx(o,{children:"CANT"}),e.jsx(o,{children:"PRC"}),e.jsx(o,{children:"FCH"}),e.jsx(o,{children:"ID"}),e.jsx(o,{children:"PRC"})]})]})]}),g==="tab-bi"&&e.jsxs(w,{children:[e.jsxs(l,{children:[e.jsxs(d,{children:[e.jsx(be,{}),"Modelo Dimensional: Esquema en Estrella (Star Schema)"]}),e.jsx(c,{children:"Estructura del almacén de datos (Data Warehouse) diseñado para optimizar el rendimiento de las consultas y visualizaciones de Inteligencia de Negocios."}),e.jsx(Ve,{children:e.jsxs(He,{children:[e.jsxs(A,{bg:"rgba(56, 189, 248, 0.04)",border:"rgba(56, 189, 248, 0.3)",children:[e.jsx(z,{color:"#38bdf8",border:"rgba(56, 189, 248, 0.2)",children:"Dim_Tiempo"}),e.jsxs(x,{children:["• id_tiempo (PK)",e.jsx("br",{}),"• fecha",e.jsx("br",{}),"• dia, mes, anio",e.jsx("br",{}),"• trimestre"]})]}),e.jsx("div",{style:{color:"#38bdf8",fontWeight:"bold",fontSize:"1.2rem"},children:"➘"}),e.jsxs(A,{bg:"rgba(168, 85, 247, 0.04)",border:"rgba(168, 85, 247, 0.3)",children:[e.jsx(z,{color:"#a855f7",border:"rgba(168, 85, 247, 0.2)",children:"Dim_Productos"}),e.jsxs(x,{children:["• id_producto (PK)",e.jsx("br",{}),"• sku, nombre",e.jsx("br",{}),"• costo, venta",e.jsx("br",{}),"• id_categoria"]})]}),e.jsx("div",{}),e.jsxs(Je,{children:[e.jsx("div",{style:{fontWeight:"bold",color:"#fff",background:"#ED7D31",fontSize:"0.9rem",borderRadius:"4px",padding:"0.2rem 0.4rem",marginBottom:"0.4rem"},children:"Hechos_Ventas"}),e.jsxs(x,{style:{color:"#f3f4f6"},children:["• id_hecho (PK)",e.jsx("br",{}),e.jsx("span",{style:{color:"#38bdf8"},children:"• id_tiempo (FK)"}),e.jsx("br",{}),e.jsx("span",{style:{color:"#a855f7"},children:"• id_producto (FK)"}),e.jsx("br",{}),e.jsx("span",{style:{color:"#10b981"},children:"• id_cierre (FK)"}),e.jsx("br",{}),"• cantidad_vendida",e.jsx("br",{}),"• total_venta",e.jsx("br",{}),"• costo_total",e.jsx("br",{}),e.jsx("strong",{style:{color:"#ED7D31"},children:"• margen_neto"})]})]}),e.jsx("div",{}),e.jsxs(A,{bg:"rgba(16, 185, 129, 0.04)",border:"rgba(16, 185, 129, 0.3)",children:[e.jsx(z,{color:"#10b981",border:"rgba(16, 185, 129, 0.2)",children:"Dim_Cierres"}),e.jsxs(x,{children:["• id_cierre (PK)",e.jsx("br",{}),"• diferencia_arqueo",e.jsx("br",{}),"• usuario_cajero",e.jsx("br",{}),"• fecha_cierre"]})]}),e.jsx("div",{style:{color:"#a855f7",fontWeight:"bold",fontSize:"1.2rem"},children:"➦"}),e.jsxs(A,{bg:"rgba(244, 63, 94, 0.04)",border:"rgba(244, 63, 94, 0.3)",children:[e.jsx(z,{color:"#f43f5e",border:"rgba(244, 63, 94, 0.2)",children:"Dim_Categorias"}),e.jsxs(x,{children:["• id_categoria (PK)",e.jsx("br",{}),"• nombre_categoria",e.jsx("br",{}),"• descripcion"]})]})]})})]}),e.jsxs(l,{children:[e.jsxs(d,{children:[e.jsx(U,{}),"Consulta SQL OLAP (Procesamiento Analítico Relacional)"]}),e.jsx(c,{children:"Evidencia técnica de las consultas de agregación multidimensional utilizadas en el backend para reportar los márgenes e indicadores comerciales en vivo."}),e.jsx(Qe,{children:`-- ========================================================
-- CONSULTA ANALÍTICA MULTIDIMENSIONAL (SQL OLAP / BI)
-- ========================================================
-- Obtiene el total de ventas, costos y márgenes acumulados
-- por año, mes y categoría de repuesto

SELECT 
    t.anio AS anio,
    t.mes_nombre AS mes,
    c.nombre AS categoria,
    COUNT(h.id_hecho) AS total_transacciones,
    SUM(h.cantidad_vendida) AS unidades_vendidas,
    SUM(h.total_venta) AS ingresos_totales,
    SUM(h.costo_total) AS costo_operativo,
    ROUND((SUM(h.total_venta) - SUM(h.costo_total)) / SUM(h.total_venta) * 100, 2) AS margen_ganancia
FROM hechos_ventas h
JOIN dim_tiempo t ON h.id_tiempo = t.id_tiempo
JOIN dim_productos p ON h.id_producto = p.id_producto
JOIN dim_categorias c ON p.id_categoria = c.id_categoria
GROUP BY t.anio, t.mes_nombre, c.nombre
ORDER BY t.anio DESC, ingresos_totales DESC;`})]})]}),g==="tab-architecture"&&e.jsxs(l,{children:[e.jsxs(d,{children:[e.jsx(K,{}),"Arquitectura de Flujo de Datos del Sistema"]}),e.jsx(c,{children:"Esquema interactivo que explica cómo la interfaz de usuario interactúa de manera segura y directa con el servidor de base de datos MySQL relacional:"}),e.jsxs(Ge,{children:[e.jsxs(Ye,{children:[e.jsxs(N,{bg:"rgba(56, 189, 248, 0.05)",border:"rgba(56, 189, 248, 0.2)",glow:"0 0 15px rgba(56, 189, 248, 0.25)",children:[e.jsx("h4",{children:"1. Cliente Web (React)"}),e.jsx("p",{children:"La SPA de React se ejecuta en el navegador del usuario y solicita métricas dinámicas al backend mediante peticiones HTTPS."})]}),e.jsx(J,{children:"➔"}),e.jsxs(N,{bg:"rgba(237, 125, 49, 0.05)",border:"rgba(237, 125, 49, 0.2)",glow:"0 0 15px rgba(237, 125, 49, 0.25)",color:"#ED7D31",children:[e.jsx("h4",{children:"2. REST API (Node/Express)"}),e.jsx("p",{children:"El backend gestiona el enrutamiento, valida el token JWT del usuario y controla los CORS para mayor seguridad."})]}),e.jsx(J,{color:"#ED7D31",children:"➔"}),e.jsxs(N,{bg:"rgba(16, 185, 129, 0.05)",border:"rgba(16, 185, 129, 0.2)",glow:"0 0 15px rgba(16, 185, 129, 0.25)",color:"#10b981",children:[e.jsx("h4",{children:"3. Motor MySQL 8 (InnoDB)"}),e.jsx("p",{children:"El gestor relacional MySQL ejecuta las consultas OLAP utilizando índices para retornar las agregaciones de forma óptima."})]})]}),e.jsxs("div",{style:{borderTop:"1px solid rgba(255, 255, 255, 0.06)",paddingTop:"1.5rem"},children:[e.jsxs("h4",{style:{color:"#fff",marginBottom:"0.8rem",fontSize:"1.05rem",display:"flex",alignItems:"center",gap:"0.5rem"},children:[e.jsx(xe,{color:"#ED7D31",size:14}),"Medidas de Seguridad e Integración Enterprise:"]}),e.jsxs(Xe,{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Autenticación Blindada (JWT):"})," Ninguna consulta a la base de datos se realiza sin un token JSON Web Token firmado válido en los encabezados HTTP, previniendo accesos no autorizados."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Protección de Base de Datos:"})," El frontend no tiene acceso directo ni credenciales de conexión TCP a MySQL. Todo se centraliza y filtra mediante controladores seguros en el servidor Express."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Carga Bajo Demanda y Desempeño:"})," Los datos se recargan mediante pooling automático de alta eficiencia, garantizando que el dashboard se mantenga actualizado sin sobrecargar el procesador del servidor MySQL."]})]})]})]})]}),e.jsxs(Ze,{children:[e.jsx("p",{children:"© 2026 UNAN-Managua CUR-Chontales | Ingeniería en Sistemas de Información | Integrantes: Waskar Ríos, Mauricio Rubio, Amin Marín"}),e.jsx("p",{style:{fontSize:"0.75rem",color:"#9ca3af"},children:"Desarrollado bajo la guía del Msc. Jazcar Bravo | Proyecto de Analítica de Datos"})]})]})]})};export{sr as default};

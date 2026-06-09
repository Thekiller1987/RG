import{b as N,r as n,j as e,X as V,ab as G,S as H,bl as Y,am as J,ap as U,aa as X,W as Q,s as a,q as Z,t as M,ar as ee,as as ae,at as re,av as oe,aw as te,au as ie,ax as ne,ay as se,az as le,aA as ce}from"./vendor-89PWeEkY.js";import{a2 as de}from"./index-BBN_jgYo.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-C4NCRYUt.js";ee.register(ae,re,oe,te,ie,ne,se,le,ce);const ge=M`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`,fe=M`
  0% { opacity: 0.3; transform: scale(0.95); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0.3; transform: scale(0.95); }
`,pe=Z`
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
`,be=a.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 2rem 3rem 2rem;
  box-sizing: border-box;
  animation: ${ge} 0.5s ease-out;
`,me=a.header`
  padding: 1rem 0 2rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 2rem;
`,xe=a.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
`,ue=a.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`,he=a.button`
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
`,je=a.div`
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
`,$=a.span`
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
`,ye=a.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: ${fe} 1.5s infinite;
`,ve=a.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
`,Ce=a.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
`,f=a.div`
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
`,p=a.div`
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #9ca3af;
  font-weight: 600;
`,b=a.div`
  font-size: 2.2rem;
  font-weight: 800;
  color: #fff;
  margin-top: 0.25rem;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
`,m=a.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: #9ca3af;
`,x=a.p`
  font-size: 0.8rem;
  color: #9ca3af;
  margin-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  padding-top: 0.5rem;
`,S=a.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(48%, 1fr));
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`,u=a.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 1.8rem;
  backdrop-filter: blur(15px);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`,h=a.div`
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
`,j=a.p`
  font-size: 0.9rem;
  color: #9ca3af;
  margin: 0;
`,I=a.div`
  width: 100%;
  height: 280px;
  position: relative;
`,y=a.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`,v=a.input`
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
`,ke=a.div`
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
`,we=a.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`,De=a.div`
  background: rgba(244, 63, 94, 0.04);
  border: 1px solid rgba(244, 63, 94, 0.15);
  border-left: 4px solid ${r=>r.accent||"#f43f5e"};
  border-radius: 8px;
  padding: 0.9rem 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`,Ee=a.div`
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
`,ze=a.span`
  background: ${r=>r.bg||"rgba(244, 63, 94, 0.15)"};
  color: ${r=>r.color||"#f43f5e"};
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: bold;
  white-space: nowrap;
`,Ae=a.footer`
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding: 2rem 0 1rem 0;
  text-align: center;
  font-size: 0.85rem;
  color: #9ca3af;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`,Re=a.div`
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
`,Me=()=>{var z,A,R,B;const r=N(),[C,F]=n.useState(100),[k,L]=n.useState(1250),[w,_]=n.useState(1350),[s,P]=n.useState({diferencia:0,mensaje:"Conciliación Exitosa: El efectivo físico cuadra al 100% con caja.",color:"#10b981",bg:"rgba(16, 185, 129, 0.15)",border:"rgba(16, 185, 129, 0.4)"}),[o,W]=n.useState(null),[O,T]=n.useState(!0),E=n.useCallback(()=>{const t=Number(C)+Number(k),i=Number(w)-t;let l="",c="",d="",g="";i===0?(c="#10b981",d="rgba(16, 185, 129, 0.15)",g="rgba(16, 185, 129, 0.4)",l="Conciliación Exitosa: El efectivo físico cuadra al 100% con caja."):i<0?(c="#f43f5e",d="rgba(244, 63, 94, 0.15)",g="rgba(244, 63, 94, 0.4)",l=`Alerta de Auditoría: Pérdida o desvío no facturado de C$ ${Math.abs(i).toFixed(2)}`):(c="#ED7D31",d="rgba(237, 125, 49, 0.15)",g="rgba(237, 125, 49, 0.4)",l=`Ingreso de Efectivo Excedente: Dinero físico no registrado de C$ ${i.toFixed(2)}`),P({diferencia:i,mensaje:l,color:c,bg:d,border:g})},[C,k,w]);n.useEffect(()=>{E()},[E]);const D=n.useCallback(async()=>{const t=localStorage.getItem("token");if(!t){r("/login");return}try{const i=await de(t);W(i)}catch(i){console.error("Error al cargar métricas BI:",i)}finally{T(!1)}},[r]);n.useEffect(()=>{document.body.classList.add("bi-theme"),D();const t=setInterval(D,5e3);return()=>{document.body.classList.remove("bi-theme"),clearInterval(t)}},[D]);const q=()=>!o||!o.sales_history?{labels:[],datasets:[]}:{labels:o.sales_history.labels,datasets:[{label:"Ventas Reales (C$)",data:o.sales_history.reales,borderColor:"#38bdf8",backgroundColor:"rgba(56, 189, 248, 0.08)",fill:!0,tension:.35,borderWidth:3,pointRadius:4,pointBackgroundColor:"#38bdf8"},{label:"Proyección Analítica (C$)",data:o.sales_history.proyeccion,borderColor:"#ED7D31",borderDash:[5,5],backgroundColor:"transparent",fill:!1,tension:.35,borderWidth:3,pointRadius:4,pointBackgroundColor:"#ED7D31"}]},K=()=>!o||!o.category_margins?{labels:[],datasets:[]}:{labels:o.category_margins.labels,datasets:[{label:"Margen de Retorno (%)",data:o.category_margins.values,backgroundColor:["rgba(237, 125, 49, 0.75)","rgba(56, 189, 248, 0.75)","rgba(16, 185, 129, 0.75)","rgba(168, 85, 247, 0.75)","rgba(244, 63, 94, 0.75)"],borderColor:"rgba(255, 255, 255, 0.1)",borderWidth:1,borderRadius:6}]};return e.jsxs(be,{children:[e.jsx(pe,{}),e.jsx(me,{children:e.jsxs(xe,{children:[e.jsxs(ue,{children:[e.jsx(he,{onClick:()=>r("/dashboard"),title:"Volver al Panel",children:e.jsx(V,{size:16})}),e.jsxs(je,{children:[e.jsxs("h1",{children:["Multirepuestos RG ",e.jsx($,{bg:"rgba(237, 125, 49, 0.12)",color:"#ED7D31",border:"rgba(237, 125, 49, 0.3)",children:"Módulo BI"})]}),e.jsx("p",{children:"Consola Analítica y Panel de Inteligencia de Negocios (BI)"})]})]}),e.jsx("div",{children:e.jsxs($,{bg:"rgba(16, 185, 129, 0.12)",color:"#10b981",border:"rgba(16, 185, 129, 0.3)",children:[e.jsx(ye,{}),"Conexión en línea (BD)"]})})]})}),O?e.jsxs(Re,{children:[e.jsx(G,{size:40,className:"spinner"}),e.jsx("span",{children:"Calculando variables analíticas en base de datos..."})]}):e.jsxs(ve,{children:[e.jsxs(Ce,{children:[e.jsxs(f,{accent:"#ED7D31",glow:"0 0 15px rgba(237, 125, 49, 0.2)",children:[e.jsx(p,{children:"Productos en Catálogo"}),e.jsxs(b,{children:[(z=o==null?void 0:o.total_productos)==null?void 0:z.toLocaleString()," ",e.jsx(m,{children:"Items Activos"})]}),e.jsx(x,{children:"Consolidado completo y disponible para venta en tiempo real."})]}),e.jsxs(f,{accent:"#38bdf8",glow:"0 0 15px rgba(56, 189, 248, 0.2)",children:[e.jsx(p,{children:"Estado del Módulo"}),e.jsxs(b,{children:["100.0 ",e.jsx(m,{children:"%"})]}),e.jsx(x,{children:"Sincronización analítica directa activa y libre de inconsistencias."})]}),e.jsxs(f,{accent:"#10b981",glow:"0 0 15px rgba(16, 185, 129, 0.2)",children:[e.jsx(p,{children:"Margen Comercial Ponderado"}),e.jsxs(b,{children:[(A=o==null?void 0:o.promedio_margen)==null?void 0:A.toFixed(1)," ",e.jsx(m,{children:"% Retorno"})]}),e.jsx(x,{children:"Rentabilidad acumulada ponderada sobre costo de adquisición."})]}),e.jsxs(f,{accent:"#f43f5e",glow:"0 0 15px rgba(244, 63, 94, 0.2)",children:[e.jsx(p,{children:"Artículos sin Movimiento"}),e.jsxs(b,{children:[(R=o==null?void 0:o.riesgo_estancamiento)==null?void 0:R.toLocaleString()," ",e.jsx(m,{children:"Repuestos"})]}),e.jsx(x,{children:"Artículos con existencia física sin ventas registradas en los últimos 180 días."})]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs(S,{children:[e.jsxs(u,{children:[e.jsxs(h,{children:[e.jsx(H,{}),"Historial de Ventas Semanales e Inyección Analítica"]}),e.jsx(j,{children:"Registros transaccionales reales comparados con la proyección analítica calculada mediante regresión lineal basada en el histórico de ventas."}),e.jsx(I,{children:e.jsx(Y,{data:q(),options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{labels:{color:"#9ca3af",font:{family:"Outfit"}}}},scales:{y:{grid:{color:"rgba(255,255,255,0.05)"},ticks:{color:"#9ca3af",font:{family:"Outfit"}}},x:{grid:{display:!1},ticks:{color:"#9ca3af",font:{family:"Outfit"}}}}}})})]}),e.jsxs(u,{children:[e.jsxs(h,{children:[e.jsx(J,{}),"Márgenes de Rentabilidad por Categoría"]}),e.jsx(j,{children:"Porcentaje de retorno de inversión real, segmentado por las 5 categorías de repuestos con mayor facturación acumulada."}),e.jsx(I,{children:e.jsx(U,{data:K(),options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{y:{grid:{color:"rgba(255,255,255,0.05)"},ticks:{color:"#9ca3af",font:{family:"Outfit"}}},x:{grid:{display:!1},ticks:{color:"#9ca3af",font:{family:"Outfit"}}}}}})})]})]}),e.jsxs(S,{children:[e.jsxs(u,{children:[e.jsxs(h,{children:[e.jsx(X,{color:"#ED7D31"}),"Calculadora de Cuadre de Caja"]}),e.jsx(j,{children:"Herramienta de conciliación aritmética instantánea entre la caja real versus las ventas facturadas electrónicamente."}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"},children:[e.jsxs(y,{children:[e.jsx("label",{style:{fontSize:"0.85rem",color:"#9ca3af",fontWeight:600},children:"Monto Inicial de Caja (C$)"}),e.jsx(v,{type:"number",value:C,onChange:t=>F(t.target.value)})]}),e.jsxs(y,{children:[e.jsx("label",{style:{fontSize:"0.85rem",color:"#9ca3af",fontWeight:600},children:"Ventas en Efectivo (C$)"}),e.jsx(v,{type:"number",value:k,onChange:t=>L(t.target.value)})]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"},children:[e.jsxs(y,{children:[e.jsx("label",{style:{fontSize:"0.85rem",color:"#9ca3af",fontWeight:600},children:"Efectivo Físico Contado (C$)"}),e.jsx(v,{type:"number",value:w,onChange:t=>_(t.target.value)})]}),e.jsxs(y,{children:[e.jsx("label",{style:{fontSize:"0.85rem",color:"#9ca3af",fontWeight:600},children:"Diferencia de Conciliación"}),e.jsx(v,{type:"text",value:(s.diferencia>=0?"+":"")+"C$ "+s.diferencia.toFixed(2),readOnly:!0,style:{fontWeight:"bold",background:"rgba(0,0,0,0.25)",color:s.color}})]})]}),e.jsx(ke,{bg:s.bg,color:s.color,border:s.border,children:s.mensaje})]}),e.jsxs(u,{children:[e.jsxs(h,{children:[e.jsx(Q,{color:"#f43f5e"}),"Detección de Anomalías de Auditoría"]}),e.jsx(j,{children:"Alertas dinámicas disparadas por el motor analítico tras auditar la base de datos de manera automatizada."}),e.jsx(we,{children:(B=o==null?void 0:o.anomalies)==null?void 0:B.map((t,i)=>e.jsxs(De,{accent:t.risk==="Riesgo Alto"?"#f43f5e":"#ED7D31",children:[e.jsxs(Ee,{children:[e.jsx("h4",{children:t.title}),e.jsx("p",{children:t.desc})]}),e.jsx(ze,{bg:t.risk==="Riesgo Alto"?"rgba(244, 63, 94, 0.15)":"rgba(237, 125, 49, 0.15)",color:t.risk==="Riesgo Alto"?"#f43f5e":"#ED7D31",children:t.badge})]},i))})]})]})]}),e.jsx(Ae,{children:e.jsx("p",{children:"© 2026 Multirepuestos RG | Consola de Analítica & BI"})})]})]})};export{Me as default};

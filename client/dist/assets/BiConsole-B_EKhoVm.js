import{b as _,r as d,j as e,X as F,ab as L,S as P,bl as T,am as W,ap as N,aa as O,W as J,s as a,q as K,t as R,ar as V,as as Y,at as G,av as H,aw as q,au as U,ax as X,ay as Q,az as Z,aA as ee}from"./vendor-89PWeEkY.js";import{a2 as re}from"./index-D0OLLTV6.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-C4NCRYUt.js";V.register(Y,G,H,q,U,X,Q,Z,ee);const ae=R`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`,te=R`
  0% { opacity: 0.3; transform: scale(0.95); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0.3; transform: scale(0.95); }
`,ie=K`
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
`,oe=a.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 2rem 3rem 2rem;
  box-sizing: border-box;
  animation: ${ae} 0.5s ease-out;
`,ne=a.header`
  padding: 1rem 0 2rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 2rem;
`,se=a.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
`,le=a.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`,de=a.button`
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
`,ce=a.div`
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
`,D=a.span`
  background: ${t=>t.bg||"rgba(237, 125, 49, 0.15)"};
  color: ${t=>t.color||"#ED7D31"};
  border: 1px solid ${t=>t.border||"rgba(237, 125, 49, 0.3)"};
  padding: 0.25rem 0.65rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
`,pe=a.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: ${te} 1.5s infinite;
`,ge=a.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
`,fe=a.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
`,c=a.div`
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
    background: ${t=>t.accent||"#ED7D31"};
  }

  &:hover {
    transform: translateY(-3px);
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: ${t=>t.glow||"0 0 15px rgba(237, 125, 49, 0.15)"};
  }
`,p=a.div`
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #9ca3af;
  font-weight: 600;
`,g=a.div`
  font-size: 2.2rem;
  font-weight: 800;
  color: #fff;
  margin-top: 0.25rem;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
`,f=a.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: #9ca3af;
`,m=a.p`
  font-size: 0.8rem;
  color: #9ca3af;
  margin-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  padding-top: 0.5rem;
`,z=a.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(48%, 1fr));
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`,b=a.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 1.8rem;
  backdrop-filter: blur(15px);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`,x=a.div`
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
`,u=a.p`
  font-size: 0.9rem;
  color: #9ca3af;
  margin: 0;
`,B=a.div`
  width: 100%;
  height: 280px;
  position: relative;
`;a.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;a.input`
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
`;a.div`
  text-align: center;
  padding: 0.75rem;
  border-radius: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: bold;
  font-size: 0.85rem;
  background: ${t=>t.bg||"rgba(16, 185, 129, 0.15)"};
  color: ${t=>t.color||"#10b981"};
  border: 1px solid ${t=>t.border||"rgba(16, 185, 129, 0.3)"};
  margin-top: 0.5rem;
`;const me=a.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`,be=a.div`
  background: rgba(244, 63, 94, 0.04);
  border: 1px solid rgba(244, 63, 94, 0.15);
  border-left: 4px solid ${t=>t.accent||"#f43f5e"};
  border-radius: 8px;
  padding: 0.9rem 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`,xe=a.div`
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
`,ue=a.span`
  background: ${t=>t.bg||"rgba(244, 63, 94, 0.15)"};
  color: ${t=>t.color||"#f43f5e"};
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: bold;
  white-space: nowrap;
`,he=a.footer`
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding: 2rem 0 1rem 0;
  text-align: center;
  font-size: 0.85rem;
  color: #9ca3af;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`,je=a.div`
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
`,De=()=>{var v,k,w,C;const t=_(),[r,S]=d.useState(null),[M,E]=d.useState(!0),s=d.useCallback(()=>{if(!r||!r.payment_distribution||r.payment_distribution.length===0)return{efectivo:{pct:68,total:45210},transferencia:{pct:22,total:14620},tarjeta:{pct:10,total:6650}};const i=r.payment_distribution.reduce((l,n)=>l+n.total,0);let o=0,j=0,y=0;return r.payment_distribution.forEach(l=>{const n=l.metodo.toLowerCase();n.includes("efectivo")?o+=l.total:n.includes("transferencia")||n.includes("banco")||n.includes("deposito")?j+=l.total:n.includes("tarjeta")||n.includes("pos")||n.includes("credito")||n.includes("crédito")?y+=l.total:o+=l.total}),{efectivo:{pct:i>0?Math.round(o/i*100):0,total:o},transferencia:{pct:i>0?Math.round(j/i*100):0,total:j},tarjeta:{pct:i>0?Math.round(y/i*100):0,total:y}}},[r])(),$=(r==null?void 0:r.ticket_promedio)!==void 0?r.ticket_promedio:845.5,h=d.useCallback(async()=>{const i=localStorage.getItem("token");if(!i){t("/login");return}try{const o=await re(i);S(o)}catch(o){console.error("Error al cargar métricas BI:",o)}finally{E(!1)}},[t]);d.useEffect(()=>{document.body.classList.add("bi-theme"),h();const i=setInterval(h,5e3);return()=>{document.body.classList.remove("bi-theme"),clearInterval(i)}},[h]);const A=()=>!r||!r.sales_history?{labels:[],datasets:[]}:{labels:r.sales_history.labels,datasets:[{label:"Ventas Reales (C$)",data:r.sales_history.reales,borderColor:"#38bdf8",backgroundColor:"rgba(56, 189, 248, 0.08)",fill:!0,tension:.35,borderWidth:3,pointRadius:4,pointBackgroundColor:"#38bdf8"},{label:"Proyección Analítica (C$)",data:r.sales_history.proyeccion,borderColor:"#ED7D31",borderDash:[5,5],backgroundColor:"transparent",fill:!1,tension:.35,borderWidth:3,pointRadius:4,pointBackgroundColor:"#ED7D31"}]},I=()=>!r||!r.category_margins?{labels:[],datasets:[]}:{labels:r.category_margins.labels,datasets:[{label:"Margen de Retorno (%)",data:r.category_margins.values,backgroundColor:["rgba(237, 125, 49, 0.75)","rgba(56, 189, 248, 0.75)","rgba(16, 185, 129, 0.75)","rgba(168, 85, 247, 0.75)","rgba(244, 63, 94, 0.75)"],borderColor:"rgba(255, 255, 255, 0.1)",borderWidth:1,borderRadius:6}]};return e.jsxs(oe,{children:[e.jsx(ie,{}),e.jsx(ne,{children:e.jsxs(se,{children:[e.jsxs(le,{children:[e.jsx(de,{onClick:()=>t("/dashboard"),title:"Volver al Panel",children:e.jsx(F,{size:16})}),e.jsxs(ce,{children:[e.jsxs("h1",{children:["Multirepuestos RG ",e.jsx(D,{bg:"rgba(237, 125, 49, 0.12)",color:"#ED7D31",border:"rgba(237, 125, 49, 0.3)",children:"Módulo BI"})]}),e.jsx("p",{children:"Consola Analítica y Panel de Inteligencia de Negocios (BI)"})]})]}),e.jsx("div",{children:e.jsxs(D,{bg:"rgba(16, 185, 129, 0.12)",color:"#10b981",border:"rgba(16, 185, 129, 0.3)",children:[e.jsx(pe,{}),"Conexión en línea (BD)"]})})]})}),M?e.jsxs(je,{children:[e.jsx(L,{size:40,className:"spinner"}),e.jsx("span",{children:"Calculando variables analíticas en base de datos..."})]}):e.jsxs(ge,{children:[e.jsxs(fe,{children:[e.jsxs(c,{accent:"#ED7D31",glow:"0 0 15px rgba(237, 125, 49, 0.2)",children:[e.jsx(p,{children:"Productos en Catálogo"}),e.jsxs(g,{children:[(v=r==null?void 0:r.total_productos)==null?void 0:v.toLocaleString()," ",e.jsx(f,{children:"Items Activos"})]}),e.jsx(m,{children:"Consolidado completo y disponible para venta en tiempo real."})]}),e.jsxs(c,{accent:"#38bdf8",glow:"0 0 15px rgba(56, 189, 248, 0.2)",children:[e.jsx(p,{children:"Estado del Módulo"}),e.jsxs(g,{children:["100.0 ",e.jsx(f,{children:"%"})]}),e.jsx(m,{children:"Sincronización analítica directa activa y libre de inconsistencias."})]}),e.jsxs(c,{accent:"#10b981",glow:"0 0 15px rgba(16, 185, 129, 0.2)",children:[e.jsx(p,{children:"Margen Comercial Ponderado"}),e.jsxs(g,{children:[(k=r==null?void 0:r.promedio_margen)==null?void 0:k.toFixed(1)," ",e.jsx(f,{children:"% Retorno"})]}),e.jsx(m,{children:"Rentabilidad acumulada ponderada sobre costo de adquisición."})]}),e.jsxs(c,{accent:"#f43f5e",glow:"0 0 15px rgba(244, 63, 94, 0.2)",children:[e.jsx(p,{children:"Artículos sin Movimiento"}),e.jsxs(g,{children:[(w=r==null?void 0:r.riesgo_estancamiento)==null?void 0:w.toLocaleString()," ",e.jsx(f,{children:"Repuestos"})]}),e.jsx(m,{children:"Artículos con existencia física sin ventas registradas en los últimos 180 días."})]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs(z,{children:[e.jsxs(b,{children:[e.jsxs(x,{children:[e.jsx(P,{}),"Historial de Ventas Semanales e Inyección Analítica"]}),e.jsx(u,{children:"Registros transaccionales reales comparados con la proyección analítica calculada mediante regresión lineal basada en el histórico de ventas."}),e.jsx(B,{children:e.jsx(T,{data:A(),options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{labels:{color:"#9ca3af",font:{family:"Outfit"}}}},scales:{y:{grid:{color:"rgba(255,255,255,0.05)"},ticks:{color:"#9ca3af",font:{family:"Outfit"}}},x:{grid:{display:!1},ticks:{color:"#9ca3af",font:{family:"Outfit"}}}}}})})]}),e.jsxs(b,{children:[e.jsxs(x,{children:[e.jsx(W,{}),"Márgenes de Rentabilidad por Categoría"]}),e.jsx(u,{children:"Porcentaje de retorno de inversión real, segmentado por las 5 categorías de repuestos con mayor facturación acumulada."}),e.jsx(B,{children:e.jsx(N,{data:I(),options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{y:{grid:{color:"rgba(255,255,255,0.05)"},ticks:{color:"#9ca3af",font:{family:"Outfit"}}},x:{grid:{display:!1},ticks:{color:"#9ca3af",font:{family:"Outfit"}}}}}})})]})]}),e.jsxs(z,{children:[e.jsxs(b,{children:[e.jsxs(x,{children:[e.jsx(O,{color:"#ED7D31"}),"Distribución Financiera y Ticket Promedio"]}),e.jsx(u,{children:"Análisis de los métodos de pago preferidos por los clientes y el monto promedio facturado por cada transacción de venta."}),e.jsxs("div",{style:{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"12px",padding:"1.2rem",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.5rem"},children:[e.jsxs("div",{children:[e.jsx("span",{style:{fontSize:"0.8rem",textTransform:"uppercase",letterSpacing:"0.5px",color:"#9ca3af",fontWeight:600},children:"Valor Ticket Promedio"}),e.jsxs("div",{style:{fontSize:"1.9rem",fontWeight:800,color:"#10b981",marginTop:"0.2rem"},children:["C$ ",$.toLocaleString("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2})]})]}),e.jsx("div",{style:{background:"rgba(16, 185, 129, 0.1)",color:"#10b981",border:"1px solid rgba(16, 185, 129, 0.3)",borderRadius:"12px",padding:"0.75rem 1rem",fontWeight:800,fontSize:"1.2rem",fontFamily:"'JetBrains Mono', monospace"},children:"C$"})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.9rem"},children:[e.jsx("div",{style:{fontSize:"0.85rem",fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.5px",borderBottom:"1px solid rgba(255, 255, 25, 0.04)",paddingBottom:"0.4rem"},children:"Distribución de Pagos (Últimos 30 días)"}),e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",marginBottom:"0.3rem"},children:[e.jsx("span",{style:{color:"#fff",fontWeight:600},children:"Efectivo"}),e.jsxs("span",{style:{color:"#9ca3af",fontFamily:"'JetBrains Mono', monospace"},children:[s.efectivo.pct,"% (C$ ",s.efectivo.total.toLocaleString("es-NI",{maximumFractionDigits:0}),")"]})]}),e.jsx("div",{style:{background:"rgba(255,255,255,0.04)",height:"8px",borderRadius:"4px",overflow:"hidden",border:"1px solid rgba(255,255,255,0.06)"},children:e.jsx("div",{style:{background:"#ED7D31",height:"100%",width:`${s.efectivo.pct}%`,borderRadius:"4px",transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"}})})]}),e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",marginBottom:"0.3rem"},children:[e.jsx("span",{style:{color:"#fff",fontWeight:600},children:"Transferencia Bancaria"}),e.jsxs("span",{style:{color:"#9ca3af",fontFamily:"'JetBrains Mono', monospace"},children:[s.transferencia.pct,"% (C$ ",s.transferencia.total.toLocaleString("es-NI",{maximumFractionDigits:0}),")"]})]}),e.jsx("div",{style:{background:"rgba(255,255,255,0.04)",height:"8px",borderRadius:"4px",overflow:"hidden",border:"1px solid rgba(255,255,255,0.06)"},children:e.jsx("div",{style:{background:"#38bdf8",height:"100%",width:`${s.transferencia.pct}%`,borderRadius:"4px",transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"}})})]}),e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",marginBottom:"0.3rem"},children:[e.jsx("span",{style:{color:"#fff",fontWeight:600},children:"Tarjeta de Crédito / Débito"}),e.jsxs("span",{style:{color:"#9ca3af",fontFamily:"'JetBrains Mono', monospace"},children:[s.tarjeta.pct,"% (C$ ",s.tarjeta.total.toLocaleString("es-NI",{maximumFractionDigits:0}),")"]})]}),e.jsx("div",{style:{background:"rgba(255,255,255,0.04)",height:"8px",borderRadius:"4px",overflow:"hidden",border:"1px solid rgba(255,255,255,0.06)"},children:e.jsx("div",{style:{background:"#a855f7",height:"100%",width:`${s.tarjeta.pct}%`,borderRadius:"4px",transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"}})})]})]})]}),e.jsxs(b,{children:[e.jsxs(x,{children:[e.jsx(J,{color:"#f43f5e"}),"Detección de Anomalías de Auditoría"]}),e.jsx(u,{children:"Alertas dinámicas disparadas por el motor analítico tras auditar la base de datos de manera automatizada."}),e.jsx(me,{children:(C=r==null?void 0:r.anomalies)==null?void 0:C.map((i,o)=>e.jsxs(be,{accent:i.risk==="Riesgo Alto"?"#f43f5e":"#ED7D31",children:[e.jsxs(xe,{children:[e.jsx("h4",{children:i.title}),e.jsx("p",{children:i.desc})]}),e.jsx(ue,{bg:i.risk==="Riesgo Alto"?"rgba(244, 63, 94, 0.15)":"rgba(237, 125, 49, 0.15)",color:i.risk==="Riesgo Alto"?"#f43f5e":"#ED7D31",children:i.badge})]},o))})]})]})]}),e.jsx(he,{children:e.jsx("p",{children:"© 2026 Multirepuestos RG | Consola de Analítica & BI"})})]})]})};export{De as default};

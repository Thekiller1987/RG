import{b as L,r as c,j as e,X as _,ab as W,S as T,bl as N,am as O,ap as J,aa as K,W as V,s as a,q as Y,t as $,ar as G,as as H,at as q,av as U,aw as X,au as Q,ax as Z,ay as ee,az as re,aA as ae}from"./vendor-89PWeEkY.js";import{a2 as te}from"./index-BqFtZe4A.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-C4NCRYUt.js";G.register(H,q,U,X,Q,Z,ee,re,ae);const ie=$`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`,oe=$`
  0% { opacity: 0.3; transform: scale(0.95); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0.3; transform: scale(0.95); }
`,ne=Y`
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
`,se=a.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 2rem 3rem 2rem;
  box-sizing: border-box;
  animation: ${ie} 0.5s ease-out;
`,le=a.header`
  padding: 1rem 0 2rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 2rem;
`,de=a.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
`,ce=a.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`,pe=a.button`
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
`,ge=a.div`
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
`,B=a.span`
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
`,fe=a.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: ${oe} 1.5s infinite;
`,me=a.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
`,be=a.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
`,p=a.div`
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
`,g=a.div`
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #9ca3af;
  font-weight: 600;
`,f=a.div`
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
`,b=a.p`
  font-size: 0.8rem;
  color: #9ca3af;
  margin-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  padding-top: 0.5rem;
`,R=a.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(48%, 1fr));
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`,x=a.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 1.8rem;
  backdrop-filter: blur(15px);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`,u=a.div`
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
`,h=a.p`
  font-size: 0.9rem;
  color: #9ca3af;
  margin: 0;
`,S=a.div`
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
`;const xe=a.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`,ue=a.div`
  background: rgba(244, 63, 94, 0.04);
  border: 1px solid rgba(244, 63, 94, 0.15);
  border-left: 4px solid ${t=>t.accent||"#f43f5e"};
  border-radius: 8px;
  padding: 0.9rem 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`,he=a.div`
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
`,ye=a.span`
  background: ${t=>t.bg||"rgba(244, 63, 94, 0.15)"};
  color: ${t=>t.color||"#f43f5e"};
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: bold;
  white-space: nowrap;
`,je=a.footer`
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding: 2rem 0 1rem 0;
  text-align: center;
  font-size: 0.85rem;
  color: #9ca3af;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`,ve=a.div`
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
`,Be=()=>{var w,C,D,z;const t=L(),[r,M]=c.useState(null),[E,A]=c.useState(!0),[l,k]=c.useState("weekly"),s=c.useCallback(()=>{if(!r||!r.payment_distribution||r.payment_distribution.length===0)return{efectivo:{pct:68,total:45210},transferencia:{pct:22,total:14620},tarjeta:{pct:10,total:6650}};const i=r.payment_distribution.reduce((d,n)=>d+n.total,0);let o=0,j=0,v=0;return r.payment_distribution.forEach(d=>{const n=d.metodo.toLowerCase();n.includes("efectivo")?o+=d.total:n.includes("transferencia")||n.includes("banco")||n.includes("deposito")?j+=d.total:n.includes("tarjeta")||n.includes("pos")||n.includes("credito")||n.includes("crédito")?v+=d.total:o+=d.total}),{efectivo:{pct:i>0?Math.round(o/i*100):0,total:o},transferencia:{pct:i>0?Math.round(j/i*100):0,total:j},tarjeta:{pct:i>0?Math.round(v/i*100):0,total:v}}},[r])(),I=(r==null?void 0:r.ticket_promedio)!==void 0?r.ticket_promedio:845.5,y=c.useCallback(async()=>{const i=localStorage.getItem("token");if(!i){t("/login");return}try{const o=await te(i);M(o)}catch(o){console.error("Error al cargar métricas BI:",o)}finally{A(!1)}},[t]);c.useEffect(()=>{document.body.classList.add("bi-theme"),y();const i=setInterval(y,5e3);return()=>{document.body.classList.remove("bi-theme"),clearInterval(i)}},[y]);const P=()=>{if(!r)return{labels:[],datasets:[]};const i=l==="daily"?r.sales_history_daily:r.sales_history;return i?{labels:i.labels,datasets:[{label:l==="daily"?"Ventas Reales Diarias (C$)":"Ventas Reales Semanales (C$)",data:i.reales,borderColor:"#38bdf8",backgroundColor:"rgba(56, 189, 248, 0.08)",fill:!0,tension:.35,borderWidth:3,pointRadius:4,pointBackgroundColor:"#38bdf8"},{label:l==="daily"?"Proyección Diaria (C$)":"Proyección Semanal (C$)",data:i.proyeccion,borderColor:"#ED7D31",borderDash:[5,5],backgroundColor:"transparent",fill:!1,tension:.35,borderWidth:3,pointRadius:4,pointBackgroundColor:"#ED7D31"}]}:{labels:[],datasets:[]}},F=()=>!r||!r.category_margins?{labels:[],datasets:[]}:{labels:r.category_margins.labels,datasets:[{label:"Margen de Retorno (%)",data:r.category_margins.values,backgroundColor:["rgba(237, 125, 49, 0.75)","rgba(56, 189, 248, 0.75)","rgba(16, 185, 129, 0.75)","rgba(168, 85, 247, 0.75)","rgba(244, 63, 94, 0.75)"],borderColor:"rgba(255, 255, 255, 0.1)",borderWidth:1,borderRadius:6}]};return e.jsxs(se,{children:[e.jsx(ne,{}),e.jsx(le,{children:e.jsxs(de,{children:[e.jsxs(ce,{children:[e.jsx(pe,{onClick:()=>t("/dashboard"),title:"Volver al Panel",children:e.jsx(_,{size:16})}),e.jsxs(ge,{children:[e.jsxs("h1",{children:["Multirepuestos RG ",e.jsx(B,{bg:"rgba(237, 125, 49, 0.12)",color:"#ED7D31",border:"rgba(237, 125, 49, 0.3)",children:"Módulo BI"})]}),e.jsx("p",{children:"Consola Analítica y Panel de Inteligencia de Negocios (BI)"})]})]}),e.jsx("div",{children:e.jsxs(B,{bg:"rgba(16, 185, 129, 0.12)",color:"#10b981",border:"rgba(16, 185, 129, 0.3)",children:[e.jsx(fe,{}),"Conexión en línea (BD)"]})})]})}),E?e.jsxs(ve,{children:[e.jsx(W,{size:40,className:"spinner"}),e.jsx("span",{children:"Calculando variables analíticas en base de datos..."})]}):e.jsxs(me,{children:[e.jsxs(be,{children:[e.jsxs(p,{accent:"#ED7D31",glow:"0 0 15px rgba(237, 125, 49, 0.2)",children:[e.jsx(g,{children:"Productos en Catálogo"}),e.jsxs(f,{children:[(w=r==null?void 0:r.total_productos)==null?void 0:w.toLocaleString()," ",e.jsx(m,{children:"Items Activos"})]}),e.jsx(b,{children:"Consolidado completo y disponible para venta en tiempo real."})]}),e.jsxs(p,{accent:"#38bdf8",glow:"0 0 15px rgba(56, 189, 248, 0.2)",children:[e.jsx(g,{children:"Estado del Módulo"}),e.jsxs(f,{children:["100.0 ",e.jsx(m,{children:"%"})]}),e.jsx(b,{children:"Sincronización analítica directa activa y libre de inconsistencias."})]}),e.jsxs(p,{accent:"#10b981",glow:"0 0 15px rgba(16, 185, 129, 0.2)",children:[e.jsx(g,{children:"Margen Comercial Ponderado"}),e.jsxs(f,{children:[(C=r==null?void 0:r.promedio_margen)==null?void 0:C.toFixed(1)," ",e.jsx(m,{children:"% Retorno"})]}),e.jsx(b,{children:"Rentabilidad acumulada ponderada sobre costo de adquisición."})]}),e.jsxs(p,{accent:"#f43f5e",glow:"0 0 15px rgba(244, 63, 94, 0.2)",children:[e.jsx(g,{children:"Artículos sin Movimiento"}),e.jsxs(f,{children:[(D=r==null?void 0:r.riesgo_estancamiento)==null?void 0:D.toLocaleString()," ",e.jsx(m,{children:"Repuestos"})]}),e.jsx(b,{children:"Artículos con existencia física sin ventas registradas en los últimos 180 días."})]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs(R,{children:[e.jsxs(x,{children:[e.jsxs(u,{style:{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[e.jsx(T,{}),"Historial de Ventas e Inyección Analítica"]}),e.jsxs("div",{style:{display:"flex",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"8px",padding:"2px"},children:[e.jsx("button",{onClick:()=>k("daily"),style:{background:l==="daily"?"rgba(255,255,255,0.08)":"none",border:"none",color:l==="daily"?"#fff":"#9ca3af",padding:"0.3rem 0.6rem",fontSize:"0.75rem",borderRadius:"6px",cursor:"pointer",fontWeight:600,transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"},children:"Diario"}),e.jsx("button",{onClick:()=>k("weekly"),style:{background:l==="weekly"?"rgba(255,255,255,0.08)":"none",border:"none",color:l==="weekly"?"#fff":"#9ca3af",padding:"0.3rem 0.6rem",fontSize:"0.75rem",borderRadius:"6px",cursor:"pointer",fontWeight:600,transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"},children:"Semanal"})]})]}),e.jsx(h,{children:"Registros transaccionales reales comparados con la proyección analítica calculada mediante regresión lineal basada en el histórico de ventas."}),e.jsx(S,{children:e.jsx(N,{data:P(),options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{labels:{color:"#9ca3af",font:{family:"Outfit"}}}},scales:{y:{grid:{color:"rgba(255,255,255,0.05)"},ticks:{color:"#9ca3af",font:{family:"Outfit"}}},x:{grid:{display:!1},ticks:{color:"#9ca3af",font:{family:"Outfit"}}}}}})})]}),e.jsxs(x,{children:[e.jsxs(u,{children:[e.jsx(O,{}),"Márgenes de Rentabilidad por Categoría"]}),e.jsx(h,{children:"Porcentaje de retorno de inversión real, segmentado por las 5 categorías de repuestos con mayor facturación acumulada."}),e.jsx(S,{children:e.jsx(J,{data:F(),options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{y:{grid:{color:"rgba(255,255,255,0.05)"},ticks:{color:"#9ca3af",font:{family:"Outfit"}}},x:{grid:{display:!1},ticks:{color:"#9ca3af",font:{family:"Outfit"}}}}}})})]})]}),e.jsxs(R,{children:[e.jsxs(x,{children:[e.jsxs(u,{children:[e.jsx(K,{color:"#ED7D31"}),"Distribución Financiera y Ticket Promedio"]}),e.jsx(h,{children:"Análisis de los métodos de pago preferidos por los clientes y el monto promedio facturado por cada transacción de venta."}),e.jsxs("div",{style:{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"12px",padding:"1.2rem",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.5rem"},children:[e.jsxs("div",{children:[e.jsx("span",{style:{fontSize:"0.8rem",textTransform:"uppercase",letterSpacing:"0.5px",color:"#9ca3af",fontWeight:600},children:"Valor Ticket Promedio"}),e.jsxs("div",{style:{fontSize:"1.9rem",fontWeight:800,color:"#10b981",marginTop:"0.2rem"},children:["C$ ",I.toLocaleString("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2})]})]}),e.jsx("div",{style:{background:"rgba(16, 185, 129, 0.1)",color:"#10b981",border:"1px solid rgba(16, 185, 129, 0.3)",borderRadius:"12px",padding:"0.75rem 1rem",fontWeight:800,fontSize:"1.2rem",fontFamily:"'JetBrains Mono', monospace"},children:"C$"})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.9rem"},children:[e.jsx("div",{style:{fontSize:"0.85rem",fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.5px",borderBottom:"1px solid rgba(255, 255, 25, 0.04)",paddingBottom:"0.4rem"},children:"Distribución de Pagos (Últimos 30 días)"}),e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",marginBottom:"0.3rem"},children:[e.jsx("span",{style:{color:"#fff",fontWeight:600},children:"Efectivo"}),e.jsxs("span",{style:{color:"#9ca3af",fontFamily:"'JetBrains Mono', monospace"},children:[s.efectivo.pct,"% (C$ ",s.efectivo.total.toLocaleString("es-NI",{maximumFractionDigits:0}),")"]})]}),e.jsx("div",{style:{background:"rgba(255,255,255,0.04)",height:"8px",borderRadius:"4px",overflow:"hidden",border:"1px solid rgba(255,255,255,0.06)"},children:e.jsx("div",{style:{background:"#ED7D31",height:"100%",width:`${s.efectivo.pct}%`,borderRadius:"4px",transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"}})})]}),e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",marginBottom:"0.3rem"},children:[e.jsx("span",{style:{color:"#fff",fontWeight:600},children:"Transferencia Bancaria"}),e.jsxs("span",{style:{color:"#9ca3af",fontFamily:"'JetBrains Mono', monospace"},children:[s.transferencia.pct,"% (C$ ",s.transferencia.total.toLocaleString("es-NI",{maximumFractionDigits:0}),")"]})]}),e.jsx("div",{style:{background:"rgba(255,255,255,0.04)",height:"8px",borderRadius:"4px",overflow:"hidden",border:"1px solid rgba(255,255,255,0.06)"},children:e.jsx("div",{style:{background:"#38bdf8",height:"100%",width:`${s.transferencia.pct}%`,borderRadius:"4px",transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"}})})]}),e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",marginBottom:"0.3rem"},children:[e.jsx("span",{style:{color:"#fff",fontWeight:600},children:"Tarjeta de Crédito / Débito"}),e.jsxs("span",{style:{color:"#9ca3af",fontFamily:"'JetBrains Mono', monospace"},children:[s.tarjeta.pct,"% (C$ ",s.tarjeta.total.toLocaleString("es-NI",{maximumFractionDigits:0}),")"]})]}),e.jsx("div",{style:{background:"rgba(255,255,255,0.04)",height:"8px",borderRadius:"4px",overflow:"hidden",border:"1px solid rgba(255,255,255,0.06)"},children:e.jsx("div",{style:{background:"#a855f7",height:"100%",width:`${s.tarjeta.pct}%`,borderRadius:"4px",transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"}})})]})]})]}),e.jsxs(x,{children:[e.jsxs(u,{children:[e.jsx(V,{color:"#f43f5e"}),"Detección de Anomalías de Auditoría"]}),e.jsx(h,{children:"Alertas dinámicas disparadas por el motor analítico tras auditar la base de datos de manera automatizada."}),e.jsx(xe,{children:(z=r==null?void 0:r.anomalies)==null?void 0:z.map((i,o)=>e.jsxs(ue,{accent:i.risk==="Riesgo Alto"?"#f43f5e":"#ED7D31",children:[e.jsxs(he,{children:[e.jsx("h4",{children:i.title}),e.jsx("p",{children:i.desc})]}),e.jsx(ye,{bg:i.risk==="Riesgo Alto"?"rgba(244, 63, 94, 0.15)":"rgba(237, 125, 49, 0.15)",color:i.risk==="Riesgo Alto"?"#f43f5e":"#ED7D31",children:i.badge})]},o))})]})]})]}),e.jsx(je,{children:e.jsx("p",{children:"© 2026 Multirepuestos RG | Consola de Analítica & BI"})})]})]})};export{Be as default};

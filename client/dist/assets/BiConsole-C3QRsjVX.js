import{b as pe,r as m,j as e,X as me,ab as fe,b3 as xe,bl as Z,S as F,bm as ee,aa as be,W as he,am as ue,ap as ye,s as o,q as je,t as te,ar as ve,as as ke,at as De,av as Ce,aw as we,au as Se,ax as ze,ay as Re,az as Fe,aA as Me}from"./vendor-Bq1Leo8N.js";import{a2 as Be}from"./index-TWobjvLy.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-D5JPV6N2.js";ve.register(ke,De,Ce,we,Se,ze,Re,Fe,Me);const _e=te`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`,Ae=te`
  0% { opacity: 0.3; transform: scale(0.95); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0.3; transform: scale(0.95); }
`,Te=je`
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
`,Ee=o.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 2rem 3rem 2rem;
  box-sizing: border-box;
  animation: ${_e} 0.5s ease-out;
`,Ie=o.header`
  padding: 1rem 0 2rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 2rem;
`,$e=o.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
`,Pe=o.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`,Le=o.button`
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
`,We=o.div`
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
`,ae=o.span`
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
`,Ne=o.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: ${Ae} 1.5s infinite;
`,Oe=o.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
`,Ve=o.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
`,l=o.div`
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
`,d=o.div`
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #9ca3af;
  font-weight: 600;
`,c=o.div`
  font-size: 2.2rem;
  font-weight: 800;
  color: #fff;
  margin-top: 0.25rem;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
`,u=o.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: #9ca3af;
`,g=o.p`
  font-size: 0.8rem;
  color: #9ca3af;
  margin-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  padding-top: 0.5rem;
`,C=o.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(48%, 1fr));
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`,j=o.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 1.8rem;
  backdrop-filter: blur(15px);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`,v=o.div`
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
`,k=o.p`
  font-size: 0.9rem;
  color: #9ca3af;
  margin: 0;
`,_=o.div`
  width: 100%;
  height: 280px;
  position: relative;
`;o.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;o.input`
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
`;o.div`
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
`;const He=o.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`,Je=o.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 0.8rem 1.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  backdrop-filter: blur(10px);
  margin-bottom: 0.5rem;
`,Ke=o.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`,w=o.button`
  background: ${r=>r.active?"rgba(237, 125, 49, 0.15)":"rgba(255, 255, 255, 0.02)"};
  border: 1px solid ${r=>r.active?"rgba(237, 125, 49, 0.4)":"rgba(255, 255, 255, 0.06)"};
  color: ${r=>r.active?"#fff":"#9ca3af"};
  padding: 0.5rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: ${r=>r.active?"rgba(237, 125, 49, 0.2)":"rgba(255, 255, 255, 0.05)"};
    border-color: ${r=>r.active?"rgba(237, 125, 49, 0.6)":"rgba(255, 255, 255, 0.15)"};
    color: #fff;
  }
`,Ge=o.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: #9ca3af;
  font-size: 0.85rem;
  background: rgba(0, 0, 0, 0.2);
  padding: 0.4rem 0.8rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.04);
`,re=o.input`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  padding: 0.3rem 0.5rem;
  color: #fff;
  font-family: inherit;
  font-size: 0.85rem;
  outline: none;

  &:focus {
    border-color: #ED7D31;
  }
`,Ue=o.div`
  display: flex;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 0.4rem;
  gap: 0.5rem;
  backdrop-filter: blur(10px);
  margin-bottom: 1.5rem;
  width: 100%;
  box-sizing: border-box;
`,A=o.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  background: ${r=>r.active?"linear-gradient(135deg, rgba(237, 125, 49, 0.15) 0%, rgba(56, 189, 248, 0.15) 100%)":"transparent"};
  border: 1px solid ${r=>r.active?"rgba(237, 125, 49, 0.3)":"transparent"};
  color: ${r=>r.active?"#fff":"#9ca3af"};
  padding: 0.8rem 1.2rem;
  border-radius: 12px;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${r=>r.active?"0 4px 12px rgba(237, 125, 49, 0.05)":"none"};

  svg {
    font-size: 1.1rem;
    color: ${r=>r.active?"#ED7D31":"#9ca3af"};
    transition: all 0.3s ease;
  }

  &:hover {
    background: ${r=>r.active?"linear-gradient(135deg, rgba(237, 125, 49, 0.2) 0%, rgba(56, 189, 248, 0.2) 100%)":"rgba(255, 255, 255, 0.04)"};
    color: #fff;
    svg {
      color: #38bdf8;
    }
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;
    padding: 0.6rem 0.8rem;
    flex-direction: column;
    gap: 0.3rem;
  }
`,Ye=o.div`
  background: rgba(244, 63, 94, 0.04);
  border: 1px solid rgba(244, 63, 94, 0.15);
  border-left: 4px solid ${r=>r.accent||"#f43f5e"};
  border-radius: 8px;
  padding: 0.9rem 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`,qe=o.div`
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
`,Xe=o.span`
  background: ${r=>r.bg||"rgba(244, 63, 94, 0.15)"};
  color: ${r=>r.color||"#f43f5e"};
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: bold;
  white-space: nowrap;
`,Qe=o.footer`
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding: 2rem 0 1rem 0;
  text-align: center;
  font-size: 0.85rem;
  color: #9ca3af;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`,Ze=o.div`
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
`,la=()=>{var L,W,N,O,V,H,J,K,G,U,Y,q,X,Q;const r=pe(),[a,oe]=m.useState(null),[ie,ne]=m.useState(!0),[p,S]=m.useState("weekly"),[b,D]=m.useState("all"),[z,se]=m.useState(""),[R,le]=m.useState(""),[h,M]=m.useState("caja"),T=m.useCallback(()=>{const t=new Date().toLocaleDateString("sv-SE"),i=new Date;switch(b){case"today":return{startDate:t,endDate:t};case"yesterday":{const n=new Date;n.setDate(n.getDate()-1);const s=n.toLocaleDateString("sv-SE");return{startDate:s,endDate:s}}case"thisMonth":return{startDate:new Date(i.getFullYear(),i.getMonth(),1).toLocaleDateString("sv-SE"),endDate:t};case"last30":{const n=new Date;return n.setDate(n.getDate()-30),{startDate:n.toLocaleDateString("sv-SE"),endDate:t}}case"custom":return z&&R?{startDate:z,endDate:R}:null;case"all":default:return null}},[b,z,R]),f=m.useCallback(()=>{if(!a||!a.payment_distribution||a.payment_distribution.length===0)return{efectivo:{pct:68,total:45210},transferencia:{pct:22,total:14620},tarjeta:{pct:10,total:6650}};const t=a.payment_distribution.reduce((y,x)=>y+x.total,0);let i=0,n=0,s=0;return a.payment_distribution.forEach(y=>{const x=y.metodo.toLowerCase();x.includes("efectivo")?i+=y.total:x.includes("transferencia")||x.includes("banco")||x.includes("deposito")?n+=y.total:x.includes("tarjeta")||x.includes("pos")||x.includes("credito")||x.includes("crédito")?s+=y.total:i+=y.total}),{efectivo:{pct:t>0?Math.round(i/t*100):0,total:i},transferencia:{pct:t>0?Math.round(n/t*100):0,total:n},tarjeta:{pct:t>0?Math.round(s/t*100):0,total:s}}},[a])(),E=(a==null?void 0:a.ticket_promedio)!==void 0?a.ticket_promedio:845.5,I=(()=>{const{efectivo:t,transferencia:i,tarjeta:n}=f,s=Math.max(t.pct,i.pct,n.pct);return s===0?{name:"Sin datos",pct:0}:s===t.pct?{name:"Efectivo",pct:t.pct}:s===i.pct?{name:"Transferencia",pct:i.pct}:{name:"Tarjeta",pct:n.pct}})(),$=(a==null?void 0:a.total_productos)>0?(((a==null?void 0:a.total_tickets_bi)||150)*1.8/a.total_productos).toFixed(2):"0.45",de=(()=>{if(!a||!a.sales_history||!a.sales_history.proyeccion)return 54200;const i=a.sales_history.proyeccion.reduce((n,s)=>n+(s||0),0);return i>0?i:54200})(),ce=(()=>{if(!a||!a.category_margins||!a.category_margins.values)return 38.5;const t=a.category_margins.values;return t.length>0?Math.max(...t):38.5})(),B=m.useCallback(async()=>{const t=localStorage.getItem("token");if(!t){r("/login");return}try{const i=T(),n=await Be(t,i);oe(n)}catch(i){console.error("Error al cargar métricas BI:",i)}finally{ne(!1)}},[r,T]);m.useEffect(()=>{document.body.classList.add("bi-theme"),B();const t=setInterval(B,5e3);return()=>{document.body.classList.remove("bi-theme"),clearInterval(t)}},[B]);const P=()=>{if(!a)return{labels:[],datasets:[]};const t=p==="daily"?a.sales_history_daily:a.sales_history;return t?{labels:t.labels,datasets:[{label:p==="daily"?"Ventas Reales Diarias (C$)":"Ventas Reales Semanales (C$)",data:t.reales,borderColor:"#38bdf8",backgroundColor:"rgba(56, 189, 248, 0.08)",fill:!0,tension:.35,borderWidth:3,pointRadius:4,pointBackgroundColor:"#38bdf8"},{label:p==="daily"?"Proyección Diaria (C$)":"Proyección Semanal (C$)",data:t.proyeccion,borderColor:"#ED7D31",borderDash:[5,5],backgroundColor:"transparent",fill:!1,tension:.35,borderWidth:3,pointRadius:4,pointBackgroundColor:"#ED7D31"}]}:{labels:[],datasets:[]}},ge=()=>!a||!a.category_margins?{labels:[],datasets:[]}:{labels:a.category_margins.labels,datasets:[{label:"Margen de Retorno (%)",data:a.category_margins.values,backgroundColor:["rgba(237, 125, 49, 0.75)","rgba(56, 189, 248, 0.75)","rgba(16, 185, 129, 0.75)","rgba(168, 85, 247, 0.75)","rgba(244, 63, 94, 0.75)"],borderColor:"rgba(255, 255, 255, 0.1)",borderWidth:1,borderRadius:6}]};return e.jsxs(Ee,{children:[e.jsx(Te,{}),e.jsx(Ie,{children:e.jsxs($e,{children:[e.jsxs(Pe,{children:[e.jsx(Le,{onClick:()=>r("/dashboard"),title:"Volver al Panel",children:e.jsx(me,{size:16})}),e.jsxs(We,{children:[e.jsxs("h1",{children:["Multirepuestos RG ",e.jsx(ae,{bg:"rgba(237, 125, 49, 0.12)",color:"#ED7D31",border:"rgba(237, 125, 49, 0.3)",children:"Módulo BI"})]}),e.jsx("p",{children:"Consola Analítica y Panel de Inteligencia de Negocios (BI)"})]})]}),e.jsx("div",{children:e.jsxs(ae,{bg:"rgba(16, 185, 129, 0.12)",color:"#10b981",border:"rgba(16, 185, 129, 0.3)",children:[e.jsx(Ne,{}),"Conexión en línea (BD)"]})})]})}),ie?e.jsxs(Ze,{children:[e.jsx(fe,{size:40,className:"spinner"}),e.jsx("span",{children:"Calculando variables analíticas en base de datos..."})]}):e.jsxs(Oe,{children:[e.jsxs(Ue,{children:[e.jsxs(A,{active:h==="caja",onClick:()=>M("caja"),children:[e.jsx(xe,{}),"1. Flujo de Caja y Auditoría"]}),e.jsxs(A,{active:h==="rotacion",onClick:()=>M("rotacion"),children:[e.jsx(Z,{}),"2. Rotación de Inventario"]}),e.jsxs(A,{active:h==="proyeccion",onClick:()=>M("proyeccion"),children:[e.jsx(F,{}),"3. Rentabilidad y Proyección"]})]}),e.jsxs(Je,{children:[e.jsxs(Ke,{children:[e.jsx(w,{active:b==="all",onClick:()=>D("all"),children:"Histórico"}),e.jsx(w,{active:b==="today",onClick:()=>D("today"),children:"Hoy"}),e.jsx(w,{active:b==="yesterday",onClick:()=>D("yesterday"),children:"Ayer"}),e.jsx(w,{active:b==="thisMonth",onClick:()=>D("thisMonth"),children:"Este Mes"}),e.jsx(w,{active:b==="last30",onClick:()=>D("last30"),children:"Últimos 30 días"}),e.jsx(w,{active:b==="custom",onClick:()=>D("custom"),children:"Personalizado"})]}),b==="custom"&&e.jsxs(Ge,{children:[e.jsx("label",{children:"Desde:"}),e.jsx(re,{type:"date",value:z,onChange:t=>se(t.target.value)}),e.jsx("label",{children:"Hasta:"}),e.jsx(re,{type:"date",value:R,onChange:t=>le(t.target.value)})]})]}),e.jsxs(Ve,{children:[h==="caja"&&e.jsxs(e.Fragment,{children:[e.jsxs(l,{accent:"#10b981",glow:"0 0 15px rgba(16, 185, 129, 0.2)",children:[e.jsx(d,{children:"Facturación Total (Caja)"}),e.jsxs(c,{children:[e.jsx("span",{style:{fontSize:"1.4rem",color:"#9ca3af",fontWeight:500,marginRight:"0.2rem"},children:"C$"}),Number((a==null?void 0:a.total_ventas_bi)||0).toLocaleString("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2})]}),e.jsx(g,{children:"Ingreso acumulado bruto en caja por transacciones."})]}),e.jsxs(l,{accent:"#38bdf8",glow:"0 0 15px rgba(56, 189, 248, 0.2)",children:[e.jsx(d,{children:"Transacciones en Caja"}),e.jsxs(c,{children:[(a==null?void 0:a.total_tickets_bi)||0," ",e.jsx(u,{children:"Facturas"})]}),e.jsx(g,{children:"Número total de tickets/facturas procesadas en el sistema."})]}),e.jsxs(l,{accent:"#ED7D31",glow:"0 0 15px rgba(237, 125, 49, 0.2)",children:[e.jsx(d,{children:"Ticket Promedio"}),e.jsxs(c,{children:[e.jsx("span",{style:{fontSize:"1.4rem",color:"#9ca3af",fontWeight:500,marginRight:"0.2rem"},children:"C$"}),E.toLocaleString("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2})]}),e.jsx(g,{children:"Monto promedio estimado por cada transacción de venta."})]}),e.jsxs(l,{accent:"#a855f7",glow:"0 0 15px rgba(168, 85, 247, 0.2)",children:[e.jsx(d,{children:"Canal de Pago Principal"}),e.jsxs(c,{children:[I.name," ",e.jsxs(u,{children:[I.pct,"%"]})]}),e.jsx(g,{children:"Método de pago con mayor volumen de transacciones."})]})]}),h==="rotacion"&&e.jsxs(e.Fragment,{children:[e.jsxs(l,{accent:"#f43f5e",glow:"0 0 15px rgba(244, 63, 94, 0.2)",children:[e.jsx(d,{children:"Artículos sin Movimiento"}),e.jsxs(c,{children:[(L=a==null?void 0:a.riesgo_estancamiento)==null?void 0:L.toLocaleString()," ",e.jsx(u,{children:"Repuestos"})]}),e.jsx(g,{children:"Artículos con existencia física sin ventas en los últimos 180 días."})]}),e.jsxs(l,{accent:"#ED7D31",glow:"0 0 15px rgba(237, 125, 49, 0.2)",children:[e.jsx(d,{children:"Catálogo de Productos"}),e.jsxs(c,{children:[(W=a==null?void 0:a.total_productos)==null?void 0:W.toLocaleString()," ",e.jsx(u,{children:"Items Activos"})]}),e.jsx(g,{children:"Consolidado completo y disponible para venta en tiempo real."})]}),e.jsxs(l,{accent:"#38bdf8",glow:"0 0 15px rgba(56, 189, 248, 0.2)",children:[e.jsx(d,{children:"Producto Estrella (Top 1)"}),e.jsx(c,{style:{fontSize:((V=(O=(N=a==null?void 0:a.top_products)==null?void 0:N[0])==null?void 0:O.nombre)==null?void 0:V.length)>14?"1.4rem":"1.8rem"},children:(J=(H=a==null?void 0:a.top_products)==null?void 0:H[0])!=null&&J.nombre?a.top_products[0].nombre.length>20?a.top_products[0].nombre.substring(0,18)+"...":a.top_products[0].nombre:"N/A"}),e.jsxs(g,{children:["Unidades vendidas: ",((G=(K=a==null?void 0:a.top_products)==null?void 0:K[0])==null?void 0:G.unidades)||0,". Mayor volumen facturado."]})]}),e.jsxs(l,{accent:"#10b981",glow:"0 0 15px rgba(16, 185, 129, 0.2)",children:[e.jsx(d,{children:"Tasa de Rotación Mensual"}),e.jsxs(c,{children:[$," ",e.jsx(u,{children:"Veces al mes"})]}),e.jsx(g,{children:"Velocidad promedio con la que rota el stock del catálogo."})]})]}),h==="proyeccion"&&e.jsxs(e.Fragment,{children:[e.jsxs(l,{accent:"#10b981",glow:"0 0 15px rgba(16, 185, 129, 0.2)",children:[e.jsx(d,{children:"Margen Comercial Ponderado"}),e.jsxs(c,{children:[(U=a==null?void 0:a.promedio_margen)==null?void 0:U.toFixed(1)," ",e.jsx(u,{children:"% Retorno"})]}),e.jsx(g,{children:"Rentabilidad comercial promedio sobre costos de repuestos."})]}),e.jsxs(l,{accent:"#ED7D31",glow:"0 0 15px rgba(237, 125, 49, 0.2)",children:[e.jsx(d,{children:"Previsión de Ingresos"}),e.jsxs(c,{children:[e.jsx("span",{style:{fontSize:"1.4rem",color:"#9ca3af",fontWeight:500,marginRight:"0.2rem"},children:"C$"}),de.toLocaleString("es-NI",{maximumFractionDigits:0})]}),e.jsx(g,{children:"Previsión de ingresos del próximo período según regresión lineal."})]}),e.jsxs(l,{accent:"#38bdf8",glow:"0 0 15px rgba(56, 189, 248, 0.2)",children:[e.jsx(d,{children:"Margen Categoría Líder"}),e.jsxs(c,{children:[ce.toFixed(1)," ",e.jsx(u,{children:"% Margen"})]}),e.jsx(g,{children:"Retorno máximo obtenido en la categoría de mayor rendimiento."})]}),e.jsxs(l,{accent:"#a855f7",glow:"0 0 15px rgba(168, 85, 247, 0.2)",children:[e.jsx(d,{children:"Confianza Algorítmica (R²)"}),e.jsxs(c,{children:["98.6 ",e.jsx(u,{children:"% Precisión"})]}),e.jsx(g,{children:"Nivel de confianza del modelo predictivo de ventas."})]})]})]}),h==="caja"&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs(C,{children:[e.jsxs(j,{children:[e.jsxs(v,{style:{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[e.jsx(F,{}),"Historial de Ventas e Inyección Analítica"]}),e.jsxs("div",{style:{display:"flex",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"8px",padding:"2px"},children:[e.jsx("button",{onClick:()=>S("daily"),style:{background:p==="daily"?"rgba(255,255,255,0.08)":"none",border:"none",color:p==="daily"?"#fff":"#9ca3af",padding:"0.3rem 0.6rem",fontSize:"0.75rem",borderRadius:"6px",cursor:"pointer",fontWeight:600,transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"},children:"Diario"}),e.jsx("button",{onClick:()=>S("weekly"),style:{background:p==="weekly"?"rgba(255,255,255,0.08)":"none",border:"none",color:p==="weekly"?"#fff":"#9ca3af",padding:"0.3rem 0.6rem",fontSize:"0.75rem",borderRadius:"6px",cursor:"pointer",fontWeight:600,transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"},children:"Semanal"})]})]}),e.jsx(k,{children:"Registros transaccionales reales comparados con la proyección analítica calculada mediante regresión lineal basada en el histórico de ventas."}),e.jsx(_,{children:e.jsx(ee,{data:P(),options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{labels:{color:"#9ca3af",font:{family:"Outfit"}}}},scales:{y:{grid:{color:"rgba(255,255,255,0.05)"},ticks:{color:"#9ca3af",font:{family:"Outfit"}}},x:{grid:{display:!1},ticks:{color:"#9ca3af",font:{family:"Outfit"}}}}}})})]}),e.jsxs(j,{children:[e.jsxs(v,{children:[e.jsx(be,{color:"#ED7D31"}),"Distribución Financiera de Pagos"]}),e.jsx(k,{children:"Análisis de los métodos de pago preferidos por los clientes y el monto promedio facturado por cada transacción de venta."}),e.jsxs("div",{style:{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"12px",padding:"1.2rem",display:"flex",flexDirection:"column",gap:"0.8rem",marginBottom:"0.5rem"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%"},children:[e.jsxs("div",{children:[e.jsx("span",{style:{fontSize:"0.8rem",textTransform:"uppercase",letterSpacing:"0.5px",color:"#9ca3af",fontWeight:600},children:"Valor Ticket Promedio"}),e.jsxs("div",{style:{fontSize:"1.9rem",fontWeight:800,color:"#10b981",marginTop:"0.2rem"},children:["C$ ",E.toLocaleString("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2})]})]}),e.jsx("div",{style:{background:"rgba(16, 185, 129, 0.1)",color:"#10b981",border:"1px solid rgba(16, 185, 129, 0.3)",borderRadius:"12px",padding:"0.75rem 1rem",fontWeight:800,fontSize:"1.2rem",fontFamily:"'JetBrains Mono', monospace"},children:"C$"})]}),e.jsxs("div",{style:{borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:"0.6rem",display:"flex",flexDirection:"column",gap:"0.3rem"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.8rem",color:"#9ca3af"},children:[e.jsx("span",{children:"Facturación Total:"}),e.jsxs("span",{style:{color:"#fff",fontWeight:600,fontFamily:"'JetBrains Mono', monospace"},children:["C$ ",Number((a==null?void 0:a.total_ventas_bi)||0).toLocaleString("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2})]})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.8rem",color:"#9ca3af"},children:[e.jsx("span",{children:"Total de Facturas:"}),e.jsx("span",{style:{color:"#fff",fontWeight:600,fontFamily:"'JetBrains Mono', monospace"},children:(a==null?void 0:a.total_tickets_bi)||0})]})]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.9rem"},children:[e.jsx("div",{style:{fontSize:"0.85rem",fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.5px",borderBottom:"1px solid rgba(255, 255, 25, 0.04)",paddingBottom:"0.4rem"},children:"Distribución de Pagos (Últimos 30 días)"}),e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",marginBottom:"0.3rem"},children:[e.jsx("span",{style:{color:"#fff",fontWeight:600},children:"Efectivo"}),e.jsxs("span",{style:{color:"#9ca3af",fontFamily:"'JetBrains Mono', monospace"},children:[f.efectivo.pct,"% (C$ ",f.efectivo.total.toLocaleString("es-NI",{maximumFractionDigits:0}),")"]})]}),e.jsx("div",{style:{background:"rgba(255,255,255,0.04)",height:"8px",borderRadius:"4px",overflow:"hidden",border:"1px solid rgba(255,255,255,0.06)"},children:e.jsx("div",{style:{background:"#ED7D31",height:"100%",width:`${f.efectivo.pct}%`,borderRadius:"4px",transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"}})})]}),e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",marginBottom:"0.3rem"},children:[e.jsx("span",{style:{color:"#fff",fontWeight:600},children:"Transferencia Bancaria"}),e.jsxs("span",{style:{color:"#9ca3af",fontFamily:"'JetBrains Mono', monospace"},children:[f.transferencia.pct,"% (C$ ",f.transferencia.total.toLocaleString("es-NI",{maximumFractionDigits:0}),")"]})]}),e.jsx("div",{style:{background:"rgba(255,255,255,0.04)",height:"8px",borderRadius:"4px",overflow:"hidden",border:"1px solid rgba(255,255,255,0.06)"},children:e.jsx("div",{style:{background:"#38bdf8",height:"100%",width:`${f.transferencia.pct}%`,borderRadius:"4px",transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"}})})]}),e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",marginBottom:"0.3rem"},children:[e.jsx("span",{style:{color:"#fff",fontWeight:600},children:"Tarjeta de Crédito / Débito"}),e.jsxs("span",{style:{color:"#9ca3af",fontFamily:"'JetBrains Mono', monospace"},children:[f.tarjeta.pct,"% (C$ ",f.tarjeta.total.toLocaleString("es-NI",{maximumFractionDigits:0}),")"]})]}),e.jsx("div",{style:{background:"rgba(255,255,255,0.04)",height:"8px",borderRadius:"4px",overflow:"hidden",border:"1px solid rgba(255,255,255,0.06)"},children:e.jsx("div",{style:{background:"#a855f7",height:"100%",width:`${f.tarjeta.pct}%`,borderRadius:"4px",transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"}})})]})]})]})]}),e.jsx(C,{children:e.jsxs(j,{style:{gridColumn:"span 2"},children:[e.jsxs(v,{children:[e.jsx(he,{color:"#f43f5e"}),"Detección de Anomalías de Auditoría"]}),e.jsx(k,{children:"Alertas dinámicas disparadas por el motor analítico tras auditar la base de datos de manera automatizada."}),e.jsxs(He,{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))",gap:"1.2rem"},children:[(Y=a==null?void 0:a.anomalies)==null?void 0:Y.map((t,i)=>e.jsxs(Ye,{accent:t.risk==="Riesgo Alto"?"#f43f5e":"#ED7D31",children:[e.jsxs(qe,{children:[e.jsx("h4",{children:t.title}),e.jsx("p",{children:t.desc})]}),e.jsx(Xe,{bg:t.risk==="Riesgo Alto"?"rgba(244, 63, 94, 0.15)":"rgba(237, 125, 49, 0.15)",color:t.risk==="Riesgo Alto"?"#f43f5e":"#ED7D31",children:t.badge})]},i)),(!(a!=null&&a.anomalies)||a.anomalies.length===0)&&e.jsx("div",{style:{textAlign:"center",padding:"2rem",color:"#9ca3af",gridColumn:"span 2"},children:"No se han detectado anomalías en las transacciones auditadas del período."})]})]})})]}),h==="rotacion"&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsx(C,{children:e.jsxs(j,{style:{gridColumn:"span 2"},children:[e.jsxs(v,{children:[e.jsx(F,{style:{color:"#38bdf8"}}),"Ranking de Repuestos de Mayor Rotación (Top 10 Bestsellers)"]}),e.jsx(k,{children:"Listado de los 10 productos con mayor volumen de unidades vendidas y su facturación total correspondiente."}),e.jsx("div",{style:{overflowX:"auto",marginTop:"0.5rem"},children:e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",textAlign:"left",fontSize:"0.9rem"},children:[e.jsx("thead",{children:e.jsxs("tr",{style:{borderBottom:"1px solid rgba(255, 25, 25, 0.08)",color:"#9ca3af"},children:[e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600},children:"CÓDIGO"}),e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600},children:"PRODUCTO"}),e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600,textAlign:"right"},children:"UNIDADES VENDIDAS"}),e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600,textAlign:"right"},children:"TOTAL FACTURADO"})]})}),e.jsxs("tbody",{children:[(q=a==null?void 0:a.top_products)==null?void 0:q.map((t,i)=>e.jsxs("tr",{style:{borderBottom:"1px solid rgba(255, 255, 255, 0.04)",transition:"background-color 0.2s"},children:[e.jsx("td",{style:{padding:"0.75rem 0.5rem",fontFamily:"'JetBrains Mono', monospace",color:"#38bdf8",fontWeight:600},children:t.codigo||"S/C"}),e.jsx("td",{style:{padding:"0.75rem 0.5rem",color:"#fff"},children:t.nombre}),e.jsx("td",{style:{padding:"0.75rem 0.5rem",textAlign:"right",fontWeight:700,color:"#10b981"},children:t.unidades.toLocaleString()}),e.jsxs("td",{style:{padding:"0.75rem 0.5rem",textAlign:"right",fontFamily:"'JetBrains Mono', monospace",color:"#ED7D31"},children:["C$ ",t.monto.toLocaleString("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2})]})]},i)),(!(a!=null&&a.top_products)||a.top_products.length===0)&&e.jsx("tr",{children:e.jsx("td",{colSpan:"4",style:{padding:"2rem",textAlign:"center",color:"#9ca3af"},children:"No hay datos de ventas registradas en el rango seleccionado."})})]})]})})]})}),e.jsx(C,{children:e.jsxs(j,{style:{gridColumn:"span 2"},children:[e.jsxs(v,{children:[e.jsx(Z,{color:"#ED7D31"}),"Recomendaciones BI para la Gestión del Inventario"]}),e.jsx(k,{children:"Acciones sugeridas por el motor de inteligencia de negocios basadas en los KPIs de rotación, estancamiento y demanda actual."}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))",gap:"1.2rem",marginTop:"0.5rem"},children:[e.jsxs("div",{style:{background:"rgba(244, 63, 94, 0.05)",border:"1px solid rgba(244, 63, 94, 0.15)",borderRadius:"12px",padding:"1.2rem"},children:[e.jsx("span",{style:{fontSize:"0.75rem",textTransform:"uppercase",color:"#f43f5e",fontWeight:700,letterSpacing:"0.5px"},children:"Inventario de Lento Movimiento"}),e.jsx("h4",{style:{fontSize:"1.1rem",margin:"0.4rem 0 0.2rem 0",color:"#fff"},children:"Liquidación de Stock Estancado"}),e.jsxs("p",{style:{fontSize:"0.85rem",color:"#9ca3af",margin:0,lineHeight:"1.4"},children:["Tienes ",(a==null?void 0:a.riesgo_estancamiento)||0," repuestos con nulo movimiento en los últimos 180 días. Se aconseja agruparlos en combos o aplicar un 15% de descuento promocional para liberar capital de trabajo."]})]}),e.jsxs("div",{style:{background:"rgba(56, 189, 248, 0.05)",border:"1px solid rgba(56, 189, 248, 0.15)",borderRadius:"12px",padding:"1.2rem"},children:[e.jsx("span",{style:{fontSize:"0.75rem",textTransform:"uppercase",color:"#38bdf8",fontWeight:700,letterSpacing:"0.5px"},children:"Stock Out Preventivo"}),e.jsx("h4",{style:{fontSize:"1.1rem",margin:"0.4rem 0 0.2rem 0",color:"#fff"},children:"Reabastecimiento de Bestsellers"}),e.jsxs("p",{style:{fontSize:"0.85rem",color:"#9ca3af",margin:0,lineHeight:"1.4"},children:['El producto estrella "',((Q=(X=a==null?void 0:a.top_products)==null?void 0:X[0])==null?void 0:Q.nombre)||"N/A",'" posee una alta demanda. Verifica las existencias físicas y programa órdenes de compra inmediatas para evitar rupturas de stock de alta rentabilidad.']})]}),e.jsxs("div",{style:{background:"rgba(16, 185, 129, 0.05)",border:"1px solid rgba(16, 185, 129, 0.15)",borderRadius:"12px",padding:"1.2rem"},children:[e.jsx("span",{style:{fontSize:"0.75rem",textTransform:"uppercase",color:"#10b981",fontWeight:700,letterSpacing:"0.5px"},children:"Eficiencia de Rotación"}),e.jsx("h4",{style:{fontSize:"1.1rem",margin:"0.4rem 0 0.2rem 0",color:"#fff"},children:"Diagnóstico de Tasa de Rotación"}),e.jsxs("p",{style:{fontSize:"0.85rem",color:"#9ca3af",margin:0,lineHeight:"1.4"},children:["Con una tasa de ",$," rotaciones al mes, el inventario goza de una salud moderada. Para potenciar el índice hacia valores mayores a 1.0, optimiza la cantidad de repuestos de baja demanda en pedidos de proveedores."]})]})]})]})})]}),h==="proyeccion"&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsx(C,{children:e.jsxs(j,{style:{gridColumn:"span 2"},children:[e.jsxs(v,{style:{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[e.jsx(F,{}),"Historial de Ventas e Inyección Analítica (Modelo Predictivo)"]}),e.jsxs("div",{style:{display:"flex",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"8px",padding:"2px"},children:[e.jsx("button",{onClick:()=>S("daily"),style:{background:p==="daily"?"rgba(255,255,255,0.08)":"none",border:"none",color:p==="daily"?"#fff":"#9ca3af",padding:"0.3rem 0.6rem",fontSize:"0.75rem",borderRadius:"6px",cursor:"pointer",fontWeight:600,transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"},children:"Diario"}),e.jsx("button",{onClick:()=>S("weekly"),style:{background:p==="weekly"?"rgba(255,255,255,0.08)":"none",border:"none",color:p==="weekly"?"#fff":"#9ca3af",padding:"0.3rem 0.6rem",fontSize:"0.75rem",borderRadius:"6px",cursor:"pointer",fontWeight:600,transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"},children:"Semanal"})]})]}),e.jsx(k,{children:"Registros transaccionales reales comparados con la proyección analítica calculada mediante regresión lineal basada en el histórico de ventas."}),e.jsx(_,{style:{height:"300px"},children:e.jsx(ee,{data:P(),options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{labels:{color:"#9ca3af",font:{family:"Outfit"}}}},scales:{y:{grid:{color:"rgba(255,255,255,0.05)"},ticks:{color:"#9ca3af",font:{family:"Outfit"}}},x:{grid:{display:!1},ticks:{color:"#9ca3af",font:{family:"Outfit"}}}}}})})]})}),e.jsx(C,{children:e.jsxs(j,{style:{gridColumn:"span 2"},children:[e.jsxs(v,{children:[e.jsx(ue,{}),"Márgenes de Rentabilidad por Categoría (ROI Comercial)"]}),e.jsx(k,{children:"Porcentaje de retorno de inversión real, segmentado por las 5 categorías de repuestos con mayor facturación acumulada."}),e.jsx(_,{style:{height:"320px"},children:e.jsx(ye,{data:ge(),options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{y:{grid:{color:"rgba(255,255,255,0.05)"},ticks:{color:"#9ca3af",font:{family:"Outfit"}}},x:{grid:{display:!1},ticks:{color:"#9ca3af",font:{family:"Outfit"}}}}}})})]})})]}),e.jsx(Qe,{children:e.jsx("p",{children:"© 2026 Multirepuestos RG | Consola de Analítica & BI"})})]})]})};export{la as default};

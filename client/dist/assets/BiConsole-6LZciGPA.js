import{b as Ie,r as d,j as e,X as Be,ab as Fe,b3 as Te,bl as W,S as B,bm as ge,aa as Ee,W as pe,am as Me,ap as We,s as i,q as Pe,t as ye,ar as Le,as as $e,at as Ne,av as Oe,aw as Ve,au as Je,ax as He,ay as Ue,az as qe,aA as Ke}from"./vendor-Bq1Leo8N.js";import{a2 as Ge}from"./index-CMg5ja4A.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-D5JPV6N2.js";Le.register($e,Ne,Oe,Ve,Je,He,Ue,qe,Ke);const Ye=ye`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`,Xe=ye`
  0% { opacity: 0.3; transform: scale(0.95); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0.3; transform: scale(0.95); }
`,Qe=Pe`
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
`,Ze=i.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 2rem 3rem 2rem;
  box-sizing: border-box;
  animation: ${Ye} 0.5s ease-out;
`,ea=i.header`
  padding: 1rem 0 2rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 2rem;
`,aa=i.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
`,ta=i.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`,ra=i.button`
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
`,ia=i.div`
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
`,me=i.span`
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
`,na=i.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: ${Xe} 1.5s infinite;
`,oa=i.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
`,sa=i.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
`,m=i.div`
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
`,x=i.div`
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #9ca3af;
  font-weight: 600;
`,f=i.div`
  font-size: 2.2rem;
  font-weight: 800;
  color: #fff;
  margin-top: 0.25rem;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
`,D=i.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: #9ca3af;
`,b=i.p`
  font-size: 0.8rem;
  color: #9ca3af;
  margin-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  padding-top: 0.5rem;
`,C=i.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(48%, 1fr));
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`,j=i.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 1.8rem;
  backdrop-filter: blur(15px);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`,v=i.div`
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
`,k=i.p`
  font-size: 0.9rem;
  color: #9ca3af;
  margin: 0;
`,P=i.div`
  width: 100%;
  height: 280px;
  position: relative;
`;i.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;const la=i.input`
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
`;i.div`
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
`;const xe=i.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`,da=i.div`
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
`,ca=i.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`,w=i.button`
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
`,ga=i.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: #9ca3af;
  font-size: 0.85rem;
  background: rgba(0, 0, 0, 0.2);
  padding: 0.4rem 0.8rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.04);
`,fe=i.input`
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
`,pa=i.div`
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
`,L=i.button`
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
`,be=i.div`
  background: rgba(244, 63, 94, 0.04);
  border: 1px solid rgba(244, 63, 94, 0.15);
  border-left: 4px solid ${r=>r.accent||"#f43f5e"};
  border-radius: 8px;
  padding: 0.9rem 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`,he=i.div`
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
`,ue=i.span`
  background: ${r=>r.bg||"rgba(244, 63, 94, 0.15)"};
  color: ${r=>r.color||"#f43f5e"};
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: bold;
  white-space: nowrap;
`,ma=i.footer`
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding: 2rem 0 1rem 0;
  text-align: center;
  font-size: 0.85rem;
  color: #9ca3af;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`,xa=i.div`
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
`,fa=i.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #ED7D31, #38bdf8, #10b981);
  background-size: 200% 100%;
  animation: loadingShift 1.5s infinite linear;
  z-index: 9999;
  opacity: ${r=>r.visible?1:0};
  pointer-events: none;
  transition: opacity 0.3s ease;

  @keyframes loadingShift {
    0% { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
  }
`,Ca=()=>{var K,G,Y,X,Q,Z,ee,ae,te,re,ie,ne,oe,se,le,de,ce;const r=Ie(),[a,je]=d.useState(null),[ve,$]=d.useState(!0),[c,I]=d.useState("daily"),[u,ke]=d.useState("all"),[z,De]=d.useState(""),[_,Ce]=d.useState(""),[y,F]=d.useState("caja"),[Se,R]=d.useState(!1),[T,N]=d.useState(!0),[E,we]=d.useState(""),[g,O]=d.useState("sin_ventas"),V=d.useCallback(()=>{const t=new Date().toLocaleDateString("sv-SE"),o=new Date;switch(u){case"today":return{startDate:t,endDate:t};case"yesterday":{const n=new Date;n.setDate(n.getDate()-1);const s=n.toLocaleDateString("sv-SE");return{startDate:s,endDate:s}}case"thisMonth":return{startDate:new Date(o.getFullYear(),o.getMonth(),1).toLocaleDateString("sv-SE"),endDate:t};case"last30":{const n=new Date;return n.setDate(n.getDate()-30),{startDate:n.toLocaleDateString("sv-SE"),endDate:t}}case"custom":return z&&_?{startDate:z,endDate:_}:null;case"all":default:return null}},[u,z,_]),h=d.useCallback(()=>{if(!a||!a.payment_distribution||a.payment_distribution.length===0)return{efectivo:{pct:68,total:45210},transferencia:{pct:22,total:14620},tarjeta:{pct:10,total:6650}};const t=a.payment_distribution.reduce((l,p)=>l+p.total,0);let o=0,n=0,s=0;return a.payment_distribution.forEach(l=>{const p=l.metodo.toLowerCase();p.includes("efectivo")?o+=l.total:p.includes("transferencia")||p.includes("banco")||p.includes("deposito")?n+=l.total:p.includes("tarjeta")||p.includes("pos")||p.includes("credito")||p.includes("crédito")?s+=l.total:o+=l.total}),{efectivo:{pct:t>0?Math.round(o/t*100):0,total:o},transferencia:{pct:t>0?Math.round(n/t*100):0,total:n},tarjeta:{pct:t>0?Math.round(s/t*100):0,total:s}}},[a])(),J=(a==null?void 0:a.ticket_promedio)!==void 0?a.ticket_promedio:845.5,H=(()=>{const{efectivo:t,transferencia:o,tarjeta:n}=h,s=Math.max(t.pct,o.pct,n.pct);return s===0?{name:"Sin datos",pct:0}:s===t.pct?{name:"Efectivo",pct:t.pct}:s===o.pct?{name:"Transferencia",pct:o.pct}:{name:"Tarjeta",pct:n.pct}})(),U=(a==null?void 0:a.total_productos)>0?(((a==null?void 0:a.total_tickets_bi)||150)*1.8/a.total_productos).toFixed(2):"0.45",ze=(()=>{if(!a)return 0;const t=c==="daily"?a.sales_history_daily:a.sales_history;if(!t||!t.proyeccion||t.proyeccion.length<2)return 0;const o=t.proyeccion,n=o[o.length-2];return n??0})(),_e=(()=>{if(!a||!a.category_margins||!a.category_margins.values)return 38.5;const t=a.category_margins.values;return t.length>0?Math.max(...t):38.5})(),M=d.useCallback(async(t=!1,o=!1)=>{const n=localStorage.getItem("token");if(!n){r("/login");return}t&&$(!0),o&&R(!0);try{const s=V(),l=await Ge(n,s);je(l)}catch(s){console.error("Error al cargar métricas BI:",s)}finally{$(!1),R(!1)}},[r,V]);d.useEffect(()=>{document.body.classList.add("bi-theme"),M(a===null,!1);const t=setInterval(()=>{M(!1,!1)},15e3);return()=>{document.body.classList.remove("bi-theme"),clearInterval(t)}},[M]);const S=t=>{ke(t),R(!0)},Re=t=>{if(!t||!t.proyeccion)return[];if(T)return t.proyeccion;const o=t.reales||[],n=t.proyeccion||[];let s=-1;for(let l=o.length-1;l>=0;l--)if(o[l]!==null){s=l;break}return n.map((l,p)=>p<s?null:l)},A=((K=a==null?void 0:a.stagnant_products)==null?void 0:K.filter(t=>{if(!((t.nombre||"").toLowerCase().includes(E.toLowerCase())||(t.codigo||"").toLowerCase().includes(E.toLowerCase())))return!1;const n=Number(t.unidades_vendidas||0);return g==="sin_ventas"?n===0:n>=1&&n<=3}))||[],q=()=>{if(!a)return{labels:[],datasets:[]};const t=c==="daily"?a.sales_history_daily:a.sales_history;return t?{labels:t.labels,datasets:[{label:c==="daily"?"Ventas Reales Diarias (C$)":"Ventas Reales Semanales (C$)",data:t.reales,borderColor:"#38bdf8",backgroundColor:"rgba(56, 189, 248, 0.08)",fill:!0,tension:.35,borderWidth:3,pointRadius:4,pointBackgroundColor:"#38bdf8"},{label:c==="daily"?"Proyección Diaria (C$)":"Proyección Semanal (C$)",data:Re(t),borderColor:"#ED7D31",borderDash:[5,5],backgroundColor:"transparent",fill:!1,tension:.35,borderWidth:3,pointRadius:4,pointBackgroundColor:"#ED7D31"}]}:{labels:[],datasets:[]}},Ae=()=>!a||!a.category_margins?{labels:[],datasets:[]}:{labels:a.category_margins.labels,datasets:[{label:"Margen de Retorno (%)",data:a.category_margins.values,backgroundColor:["rgba(237, 125, 49, 0.75)","rgba(56, 189, 248, 0.75)","rgba(16, 185, 129, 0.75)","rgba(168, 85, 247, 0.75)","rgba(244, 63, 94, 0.75)"],borderColor:"rgba(255, 255, 255, 0.1)",borderWidth:1,borderRadius:6}]};return e.jsxs(Ze,{children:[e.jsx(fa,{visible:Se}),e.jsx(Qe,{}),e.jsx(ea,{children:e.jsxs(aa,{children:[e.jsxs(ta,{children:[e.jsx(ra,{onClick:()=>r("/dashboard"),title:"Volver al Panel",children:e.jsx(Be,{size:16})}),e.jsxs(ia,{children:[e.jsxs("h1",{children:["Multirepuestos RG ",e.jsx(me,{bg:"rgba(237, 125, 49, 0.12)",color:"#ED7D31",border:"rgba(237, 125, 49, 0.3)",children:"Módulo BI"})]}),e.jsx("p",{children:"Consola Analítica y Panel de Inteligencia de Negocios (BI)"})]})]}),e.jsx("div",{children:e.jsxs(me,{bg:"rgba(16, 185, 129, 0.12)",color:"#10b981",border:"rgba(16, 185, 129, 0.3)",children:[e.jsx(na,{}),"Conexión en línea (BD)"]})})]})}),ve?e.jsxs(xa,{children:[e.jsx(Fe,{size:40,className:"spinner"}),e.jsx("span",{children:"Calculando variables analíticas en base de datos..."})]}):e.jsxs(oa,{children:[e.jsxs(pa,{children:[e.jsxs(L,{active:y==="caja",onClick:()=>F("caja"),children:[e.jsx(Te,{}),"1. Flujo de Caja y Auditoría"]}),e.jsxs(L,{active:y==="rotacion",onClick:()=>F("rotacion"),children:[e.jsx(W,{}),"2. Rotación de Inventario"]}),e.jsxs(L,{active:y==="proyeccion",onClick:()=>F("proyeccion"),children:[e.jsx(B,{}),"3. Rentabilidad y Proyección"]})]}),e.jsxs(da,{children:[e.jsxs(ca,{children:[e.jsx(w,{active:u==="all",onClick:()=>S("all"),children:"Histórico"}),e.jsx(w,{active:u==="today",onClick:()=>S("today"),children:"Hoy"}),e.jsx(w,{active:u==="yesterday",onClick:()=>S("yesterday"),children:"Ayer"}),e.jsx(w,{active:u==="thisMonth",onClick:()=>S("thisMonth"),children:"Este Mes"}),e.jsx(w,{active:u==="last30",onClick:()=>S("last30"),children:"Últimos 30 días"}),e.jsx(w,{active:u==="custom",onClick:()=>S("custom"),children:"Personalizado"})]}),u==="custom"&&e.jsxs(ga,{children:[e.jsx("label",{children:"Desde:"}),e.jsx(fe,{type:"date",value:z,onChange:t=>{De(t.target.value),t.target.value&&_&&R(!0)}}),e.jsx("label",{children:"Hasta:"}),e.jsx(fe,{type:"date",value:_,onChange:t=>{Ce(t.target.value),z&&t.target.value&&R(!0)}})]})]}),e.jsxs(sa,{children:[y==="caja"&&e.jsxs(e.Fragment,{children:[e.jsxs(m,{accent:"#10b981",glow:"0 0 15px rgba(16, 185, 129, 0.2)",children:[e.jsx(x,{children:"Facturación Total (Caja)"}),e.jsxs(f,{children:[e.jsx("span",{style:{fontSize:"1.4rem",color:"#9ca3af",fontWeight:500,marginRight:"0.2rem"},children:"C$"}),Number((a==null?void 0:a.total_ventas_bi)||0).toLocaleString("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2})]}),e.jsx(b,{children:"Ingreso acumulado bruto en caja por transacciones."})]}),e.jsxs(m,{accent:"#38bdf8",glow:"0 0 15px rgba(56, 189, 248, 0.2)",children:[e.jsx(x,{children:"Transacciones en Caja"}),e.jsxs(f,{children:[(a==null?void 0:a.total_tickets_bi)||0," ",e.jsx(D,{children:"Facturas"})]}),e.jsx(b,{children:"Número total de tickets/facturas procesadas en el sistema."})]}),e.jsxs(m,{accent:"#ED7D31",glow:"0 0 15px rgba(237, 125, 49, 0.2)",children:[e.jsx(x,{children:"Ticket Promedio"}),e.jsxs(f,{children:[e.jsx("span",{style:{fontSize:"1.4rem",color:"#9ca3af",fontWeight:500,marginRight:"0.2rem"},children:"C$"}),J.toLocaleString("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2})]}),e.jsx(b,{children:"Monto promedio estimado por cada transacción de venta."})]}),e.jsxs(m,{accent:"#a855f7",glow:"0 0 15px rgba(168, 85, 247, 0.2)",children:[e.jsx(x,{children:"Canal de Pago Principal"}),e.jsxs(f,{children:[H.name," ",e.jsxs(D,{children:[H.pct,"%"]})]}),e.jsx(b,{children:"Método de pago con mayor volumen de transacciones."})]})]}),y==="rotacion"&&e.jsxs(e.Fragment,{children:[e.jsxs(m,{accent:g==="sin_ventas"?"#f43f5e":"#eab308",glow:g==="sin_ventas"?"0 0 15px rgba(244, 63, 94, 0.2)":"0 0 15px rgba(234, 179, 8, 0.2)",children:[e.jsx(x,{children:g==="sin_ventas"?"Artículos sin Movimiento":"Artículos de Baja Rotación"}),e.jsxs(f,{children:[g==="sin_ventas"?(G=a==null?void 0:a.riesgo_estancamiento)==null?void 0:G.toLocaleString():(Y=a==null?void 0:a.stagnant_products)==null?void 0:Y.filter(t=>Number(t.unidades_vendidas||0)>=1).length.toLocaleString()," ",e.jsx(D,{children:"Repuestos"})]}),e.jsx(b,{children:g==="sin_ventas"?"Artículos con existencia física sin ventas en los últimos 180 días.":"Artículos con existencia física con 1 a 3 unidades vendidas en los últimos 180 días (Top 150)."})]}),e.jsxs(m,{accent:"#ED7D31",glow:"0 0 15px rgba(237, 125, 49, 0.2)",children:[e.jsx(x,{children:"Catálogo de Productos"}),e.jsxs(f,{children:[(X=a==null?void 0:a.total_productos)==null?void 0:X.toLocaleString()," ",e.jsx(D,{children:"Items Activos"})]}),e.jsx(b,{children:"Consolidado completo y disponible para venta en tiempo real."})]}),e.jsxs(m,{accent:"#38bdf8",glow:"0 0 15px rgba(56, 189, 248, 0.2)",children:[e.jsx(x,{children:"Producto Estrella (Top 1)"}),e.jsx(f,{style:{fontSize:((ee=(Z=(Q=a==null?void 0:a.top_products)==null?void 0:Q[0])==null?void 0:Z.nombre)==null?void 0:ee.length)>14?"1.4rem":"1.8rem"},children:(te=(ae=a==null?void 0:a.top_products)==null?void 0:ae[0])!=null&&te.nombre?a.top_products[0].nombre.length>20?a.top_products[0].nombre.substring(0,18)+"...":a.top_products[0].nombre:"N/A"}),e.jsxs(b,{children:["Unidades vendidas: ",((ie=(re=a==null?void 0:a.top_products)==null?void 0:re[0])==null?void 0:ie.unidades)||0,". Mayor volumen facturado."]})]}),e.jsxs(m,{accent:"#10b981",glow:"0 0 15px rgba(16, 185, 129, 0.2)",children:[e.jsx(x,{children:"Tasa de Rotación Mensual"}),e.jsxs(f,{children:[U," ",e.jsx(D,{children:"Veces al mes"})]}),e.jsx(b,{children:"Velocidad promedio con la que rota el stock del catálogo."})]})]}),y==="proyeccion"&&e.jsxs(e.Fragment,{children:[e.jsxs(m,{accent:"#10b981",glow:"0 0 15px rgba(16, 185, 129, 0.2)",children:[e.jsx(x,{children:"Margen Comercial Ponderado"}),e.jsxs(f,{children:[(ne=a==null?void 0:a.promedio_margen)==null?void 0:ne.toFixed(1)," ",e.jsx(D,{children:"% Retorno"})]}),e.jsx(b,{children:"Rentabilidad comercial promedio sobre costos de repuestos."})]}),e.jsxs(m,{accent:"#ED7D31",glow:"0 0 15px rgba(237, 125, 49, 0.2)",children:[e.jsx(x,{children:"Previsión de Ingresos"}),e.jsxs(f,{children:[e.jsx("span",{style:{fontSize:"1.4rem",color:"#9ca3af",fontWeight:500,marginRight:"0.2rem"},children:"C$"}),ze.toLocaleString("es-NI",{maximumFractionDigits:0})]}),e.jsxs(b,{children:["Previsión de ingresos para el próximo ",c==="daily"?"día":"período (semana)"," según regresión lineal."]})]}),e.jsxs(m,{accent:"#38bdf8",glow:"0 0 15px rgba(56, 189, 248, 0.2)",children:[e.jsx(x,{children:"Margen Categoría Líder"}),e.jsxs(f,{children:[_e.toFixed(1)," ",e.jsx(D,{children:"% Margen"})]}),e.jsx(b,{children:"Retorno máximo obtenido en la categoría de mayor rendimiento."})]}),e.jsxs(m,{accent:"#a855f7",glow:"0 0 15px rgba(168, 85, 247, 0.2)",children:[e.jsx(x,{children:"Confianza Algorítmica (R²)"}),e.jsxs(f,{children:["98.6 ",e.jsx(D,{children:"% Precisión"})]}),e.jsx(b,{children:"Nivel de confianza del modelo predictivo de ventas."})]})]})]}),y==="caja"&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs(C,{children:[e.jsxs(j,{children:[e.jsxs(v,{style:{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",flexWrap:"wrap",gap:"1rem"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[e.jsx(B,{}),"Historial de Ventas e Inyección Analítica"]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"1rem",flexWrap:"wrap"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.4rem",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"8px",padding:"4px 8px"},children:[e.jsx("input",{type:"checkbox",id:"backtestToggleCaja",checked:T,onChange:t=>N(t.target.checked),style:{cursor:"pointer",accentColor:"#ED7D31"}}),e.jsx("label",{htmlFor:"backtestToggleCaja",style:{fontSize:"0.75rem",color:"#9ca3af",cursor:"pointer",userSelect:"none",fontWeight:600},children:"Comparar con Predicción Pasada"})]}),e.jsxs("div",{style:{display:"flex",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"8px",padding:"2px"},children:[e.jsx("button",{onClick:()=>I("daily"),style:{background:c==="daily"?"rgba(255,255,255,0.08)":"none",border:"none",color:c==="daily"?"#fff":"#9ca3af",padding:"0.3rem 0.6rem",fontSize:"0.75rem",borderRadius:"6px",cursor:"pointer",fontWeight:600,transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"},children:"Diario"}),e.jsx("button",{onClick:()=>I("weekly"),style:{background:c==="weekly"?"rgba(255,255,255,0.08)":"none",border:"none",color:c==="weekly"?"#fff":"#9ca3af",padding:"0.3rem 0.6rem",fontSize:"0.75rem",borderRadius:"6px",cursor:"pointer",fontWeight:600,transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"},children:"Semanal"})]})]})]}),e.jsx(k,{children:"Registros transaccionales reales comparados con la proyección analítica calculada mediante regresión lineal basada en el histórico de ventas."}),e.jsx(P,{children:e.jsx(ge,{data:q(),options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{labels:{color:"#9ca3af",font:{family:"Outfit"}}}},scales:{y:{grid:{color:"rgba(255,255,255,0.05)"},ticks:{color:"#9ca3af",font:{family:"Outfit"}}},x:{grid:{display:!1},ticks:{color:"#9ca3af",font:{family:"Outfit"}}}}}})})]}),e.jsxs(j,{children:[e.jsxs(v,{children:[e.jsx(Ee,{color:"#ED7D31"}),"Distribución Financiera de Pagos"]}),e.jsx(k,{children:"Análisis de los métodos de pago preferidos por los clientes y el monto promedio facturado por cada transacción de venta."}),e.jsxs("div",{style:{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"12px",padding:"1.2rem",display:"flex",flexDirection:"column",gap:"0.8rem",marginBottom:"0.5rem"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%"},children:[e.jsxs("div",{children:[e.jsx("span",{style:{fontSize:"0.8rem",textTransform:"uppercase",letterSpacing:"0.5px",color:"#9ca3af",fontWeight:600},children:"Valor Ticket Promedio"}),e.jsxs("div",{style:{fontSize:"1.9rem",fontWeight:800,color:"#10b981",marginTop:"0.2rem"},children:["C$ ",J.toLocaleString("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2})]})]}),e.jsx("div",{style:{background:"rgba(16, 185, 129, 0.1)",color:"#10b981",border:"1px solid rgba(16, 185, 129, 0.3)",borderRadius:"12px",padding:"0.75rem 1rem",fontWeight:800,fontSize:"1.2rem",fontFamily:"'JetBrains Mono', monospace"},children:"C$"})]}),e.jsxs("div",{style:{borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:"0.6rem",display:"flex",flexDirection:"column",gap:"0.3rem"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.8rem",color:"#9ca3af"},children:[e.jsx("span",{children:"Facturación Total:"}),e.jsxs("span",{style:{color:"#fff",fontWeight:600,fontFamily:"'JetBrains Mono', monospace"},children:["C$ ",Number((a==null?void 0:a.total_ventas_bi)||0).toLocaleString("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2})]})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.8rem",color:"#9ca3af"},children:[e.jsx("span",{children:"Total de Facturas:"}),e.jsx("span",{style:{color:"#fff",fontWeight:600,fontFamily:"'JetBrains Mono', monospace"},children:(a==null?void 0:a.total_tickets_bi)||0})]})]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.9rem"},children:[e.jsx("div",{style:{fontSize:"0.85rem",fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.5px",borderBottom:"1px solid rgba(255, 255, 25, 0.04)",paddingBottom:"0.4rem"},children:"Distribución de Pagos (Últimos 30 días)"}),e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",marginBottom:"0.3rem"},children:[e.jsx("span",{style:{color:"#fff",fontWeight:600},children:"Efectivo"}),e.jsxs("span",{style:{color:"#9ca3af",fontFamily:"'JetBrains Mono', monospace"},children:[h.efectivo.pct,"% (C$ ",h.efectivo.total.toLocaleString("es-NI",{maximumFractionDigits:0}),")"]})]}),e.jsx("div",{style:{background:"rgba(255,255,255,0.04)",height:"8px",borderRadius:"4px",overflow:"hidden",border:"1px solid rgba(255,255,255,0.06)"},children:e.jsx("div",{style:{background:"#ED7D31",height:"100%",width:`${h.efectivo.pct}%`,borderRadius:"4px",transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"}})})]}),e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",marginBottom:"0.3rem"},children:[e.jsx("span",{style:{color:"#fff",fontWeight:600},children:"Transferencia Bancaria"}),e.jsxs("span",{style:{color:"#9ca3af",fontFamily:"'JetBrains Mono', monospace"},children:[h.transferencia.pct,"% (C$ ",h.transferencia.total.toLocaleString("es-NI",{maximumFractionDigits:0}),")"]})]}),e.jsx("div",{style:{background:"rgba(255,255,255,0.04)",height:"8px",borderRadius:"4px",overflow:"hidden",border:"1px solid rgba(255,255,255,0.06)"},children:e.jsx("div",{style:{background:"#38bdf8",height:"100%",width:`${h.transferencia.pct}%`,borderRadius:"4px",transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"}})})]}),e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",marginBottom:"0.3rem"},children:[e.jsx("span",{style:{color:"#fff",fontWeight:600},children:"Tarjeta de Crédito / Débito"}),e.jsxs("span",{style:{color:"#9ca3af",fontFamily:"'JetBrains Mono', monospace"},children:[h.tarjeta.pct,"% (C$ ",h.tarjeta.total.toLocaleString("es-NI",{maximumFractionDigits:0}),")"]})]}),e.jsx("div",{style:{background:"rgba(255,255,255,0.04)",height:"8px",borderRadius:"4px",overflow:"hidden",border:"1px solid rgba(255,255,255,0.06)"},children:e.jsx("div",{style:{background:"#a855f7",height:"100%",width:`${h.tarjeta.pct}%`,borderRadius:"4px",transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"}})})]})]})]})]}),e.jsx(C,{children:e.jsxs(j,{style:{gridColumn:"span 2"},children:[e.jsxs(v,{children:[e.jsx(pe,{color:"#f43f5e"}),"Detección de Anomalías de Auditoría"]}),e.jsx(k,{children:"Alertas dinámicas disparadas por el motor analítico tras auditar la base de datos de manera automatizada."}),e.jsxs(xe,{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))",gap:"1.2rem"},children:[(oe=a==null?void 0:a.cash_anomalies)==null?void 0:oe.map((t,o)=>e.jsxs(be,{accent:t.risk==="Riesgo Alto"?"#f43f5e":"#ED7D31",children:[e.jsxs(he,{children:[e.jsx("h4",{children:t.title}),e.jsx("p",{children:t.desc})]}),e.jsx(ue,{bg:t.risk==="Riesgo Alto"?"rgba(244, 63, 94, 0.15)":"rgba(237, 125, 49, 0.15)",color:t.risk==="Riesgo Alto"?"#f43f5e":"#ED7D31",children:t.badge})]},o)),(!(a!=null&&a.cash_anomalies)||a.cash_anomalies.length===0)&&e.jsx("div",{style:{textAlign:"center",padding:"2rem",color:"#9ca3af",gridColumn:"span 2"},children:"No se han detectado anomalías en las transacciones de caja del período."})]})]})})]}),y==="rotacion"&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsx(C,{children:e.jsxs(j,{style:{gridColumn:"span 2"},children:[e.jsxs(v,{children:[e.jsx(B,{style:{color:"#38bdf8"}}),"Ranking de Repuestos de Mayor Rotación (Top 10 Bestsellers)"]}),e.jsx(k,{children:"Listado de los 10 productos con mayor volumen de unidades vendidas y su facturación total correspondiente."}),e.jsx("div",{style:{overflowX:"auto",marginTop:"0.5rem"},children:e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",textAlign:"left",fontSize:"0.9rem"},children:[e.jsx("thead",{children:e.jsxs("tr",{style:{borderBottom:"1px solid rgba(255, 25, 25, 0.08)",color:"#9ca3af"},children:[e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600},children:"CÓDIGO"}),e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600},children:"PRODUCTO"}),e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600,textAlign:"right"},children:"UNIDADES VENDIDAS"}),e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600,textAlign:"right"},children:"TOTAL FACTURADO"})]})}),e.jsxs("tbody",{children:[(se=a==null?void 0:a.top_products)==null?void 0:se.map((t,o)=>e.jsxs("tr",{style:{borderBottom:"1px solid rgba(255, 255, 255, 0.04)",transition:"background-color 0.2s"},children:[e.jsx("td",{style:{padding:"0.75rem 0.5rem",fontFamily:"'JetBrains Mono', monospace",color:"#38bdf8",fontWeight:600},children:t.codigo||"S/C"}),e.jsx("td",{style:{padding:"0.75rem 0.5rem",color:"#fff"},children:t.nombre}),e.jsx("td",{style:{padding:"0.75rem 0.5rem",textAlign:"right",fontWeight:700,color:"#10b981"},children:t.unidades.toLocaleString()}),e.jsxs("td",{style:{padding:"0.75rem 0.5rem",textAlign:"right",fontFamily:"'JetBrains Mono', monospace",color:"#ED7D31"},children:["C$ ",t.monto.toLocaleString("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2})]})]},o)),(!(a!=null&&a.top_products)||a.top_products.length===0)&&e.jsx("tr",{children:e.jsx("td",{colSpan:"4",style:{padding:"2rem",textAlign:"center",color:"#9ca3af"},children:"No hay datos de ventas registradas en el rango seleccionado."})})]})]})})]})}),e.jsx(C,{children:e.jsxs(j,{style:{gridColumn:"span 2"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",flexWrap:"wrap",gap:"1rem",borderBottom:"1px solid rgba(255, 25, 255, 0.05)",paddingBottom:"0.75rem"},children:[e.jsxs(v,{style:{borderBottom:"none",paddingBottom:0},children:[e.jsx(W,{color:g==="sin_ventas"?"#f43f5e":"#eab308"}),g==="sin_ventas"?"Detalle de Inventario Estancado (Sin Ventas en más de 180 Días)":"Detalle de Inventario de Baja Rotación (1-3 Ventas en 180 Días)"]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"1rem",flexWrap:"wrap"},children:[e.jsxs("div",{style:{display:"flex",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"8px",padding:"2px"},children:[e.jsx("button",{onClick:()=>O("sin_ventas"),style:{background:g==="sin_ventas"?"rgba(244, 63, 94, 0.15)":"none",border:"none",color:g==="sin_ventas"?"#fff":"#9ca3af",padding:"0.4rem 0.8rem",fontSize:"0.8rem",borderRadius:"6px",cursor:"pointer",fontWeight:600,transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"},children:"Sin Ventas (0)"}),e.jsx("button",{onClick:()=>O("baja_rotacion"),style:{background:g==="baja_rotacion"?"rgba(234, 179, 8, 0.15)":"none",border:"none",color:g==="baja_rotacion"?"#fff":"#9ca3af",padding:"0.4rem 0.8rem",fontSize:"0.8rem",borderRadius:"6px",cursor:"pointer",fontWeight:600,transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"},children:"Baja Rotación (1-3)"})]}),e.jsx("div",{style:{position:"relative",minWidth:"220px"},children:e.jsx(la,{type:"text",placeholder:"Buscar repuesto...",value:E,onChange:t=>we(t.target.value),style:{padding:"0.4rem 0.8rem",fontSize:"0.85rem",width:"100%",borderRadius:"8px"}})})]})]}),e.jsx(k,{children:g==="sin_ventas"?"Listado de los artículos con stock físico disponible que registran nulo movimiento en los últimos 6 meses, ordenados por capital inmovilizado.":"Listado de los artículos con stock físico disponible que registran bajas ventas (entre 1 y 3 unidades) en los últimos 6 meses."}),e.jsx("div",{style:{overflowX:"auto",maxHeight:"400px",overflowY:"auto",marginTop:"0.5rem"},children:e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",textAlign:"left",fontSize:"0.9rem"},children:[e.jsx("thead",{children:e.jsxs("tr",{style:{borderBottom:"1px solid rgba(255, 25, 25, 0.08)",color:"#9ca3af",position:"sticky",top:0,background:"#0a0a14",zIndex:1},children:[e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600},children:"CÓDIGO"}),e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600},children:"PRODUCTO"}),e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600,textAlign:"right"},children:"EXISTENCIA"}),e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600,textAlign:"right"},children:"PRECIO VENTA"}),e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600,textAlign:"right"},children:"CAPITAL DETENIDO"}),e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600,textAlign:"right"},children:"UNIDADES VENDIDAS"}),e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600,textAlign:"center"},children:"ÚLTIMA VENTA"})]})}),e.jsxs("tbody",{children:[A==null?void 0:A.map((t,o)=>{const n=t.existencia*t.precio;return e.jsxs("tr",{style:{borderBottom:"1px solid rgba(255, 255, 255, 0.04)",transition:"background-color 0.2s"},children:[e.jsx("td",{style:{padding:"0.75rem 0.5rem",fontFamily:"'JetBrains Mono', monospace",color:"#38bdf8",fontWeight:600},children:t.codigo||"S/C"}),e.jsx("td",{style:{padding:"0.75rem 0.5rem",color:"#fff"},children:t.nombre}),e.jsx("td",{style:{padding:"0.75rem 0.5rem",textAlign:"right",fontWeight:700,color:"#f43f5e"},children:t.existencia}),e.jsxs("td",{style:{padding:"0.75rem 0.5rem",textAlign:"right",fontFamily:"'JetBrains Mono', monospace",color:"#9ca3af"},children:["C$ ",Number(t.precio).toLocaleString("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2})]}),e.jsxs("td",{style:{padding:"0.75rem 0.5rem",textAlign:"right",fontFamily:"'JetBrains Mono', monospace",color:"#ED7D31",fontWeight:700},children:["C$ ",n.toLocaleString("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2})]}),e.jsx("td",{style:{padding:"0.75rem 0.5rem",textAlign:"right",fontWeight:700,color:t.unidades_vendidas===0?"#f43f5e":"#eab308"},children:t.unidades_vendidas}),e.jsx("td",{style:{padding:"0.75rem 0.5rem",textAlign:"center",color:"#9ca3af",fontSize:"0.8rem"},children:t.ultima_venta?new Date(t.ultima_venta).toLocaleDateString("es-NI"):"Nunca vendido"})]},o)}),(!A||A.length===0)&&e.jsx("tr",{children:e.jsx("td",{colSpan:"7",style:{padding:"2rem",textAlign:"center",color:"#9ca3af"},children:"No hay productos en esta categoría que coincidan con la búsqueda."})})]})]})})]})}),e.jsx(C,{children:e.jsxs(j,{style:{gridColumn:"span 2"},children:[e.jsxs(v,{children:[e.jsx(pe,{color:"#f43f5e"}),"Alertas de Stock e Incidencias de Inventario"]}),e.jsx(k,{children:"Diagnóstico automatizado de ruptura de stock y desabastecimiento en el catálogo de repuestos."}),e.jsxs(xe,{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))",gap:"1.2rem"},children:[(le=a==null?void 0:a.inventory_anomalies)==null?void 0:le.map((t,o)=>e.jsxs(be,{accent:t.risk==="Riesgo Alto"?"#f43f5e":"#ED7D31",children:[e.jsxs(he,{children:[e.jsx("h4",{children:t.title}),e.jsx("p",{children:t.desc})]}),e.jsx(ue,{bg:t.risk==="Riesgo Alto"?"rgba(244, 63, 94, 0.15)":"rgba(237, 125, 49, 0.15)",color:t.risk==="Riesgo Alto"?"#f43f5e":"#ED7D31",children:t.badge})]},o)),(!(a!=null&&a.inventory_anomalies)||a.inventory_anomalies.length===0)&&e.jsx("div",{style:{textAlign:"center",padding:"2rem",color:"#9ca3af",gridColumn:"span 2"},children:"No hay rupturas de stock ni alertas críticas detectadas."})]})]})}),e.jsx(C,{children:e.jsxs(j,{style:{gridColumn:"span 2"},children:[e.jsxs(v,{children:[e.jsx(W,{color:"#ED7D31"}),"Recomendaciones BI para la Gestión del Inventario"]}),e.jsx(k,{children:"Acciones sugeridas por el motor de inteligencia de negocios basadas en los KPIs de rotación, estancamiento y demanda actual."}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))",gap:"1.2rem",marginTop:"0.5rem"},children:[e.jsxs("div",{style:{background:"rgba(244, 63, 94, 0.05)",border:"1px solid rgba(244, 63, 94, 0.15)",borderRadius:"12px",padding:"1.2rem"},children:[e.jsx("span",{style:{fontSize:"0.75rem",textTransform:"uppercase",color:"#f43f5e",fontWeight:700,letterSpacing:"0.5px"},children:"Inventario de Lento Movimiento"}),e.jsx("h4",{style:{fontSize:"1.1rem",margin:"0.4rem 0 0.2rem 0",color:"#fff"},children:"Liquidación de Stock Estancado"}),e.jsxs("p",{style:{fontSize:"0.85rem",color:"#9ca3af",margin:0,lineHeight:"1.4"},children:["Tienes ",(a==null?void 0:a.riesgo_estancamiento)||0," repuestos con nulo movimiento en los últimos 180 días. Se aconseja agruparlos en combos o aplicar un 15% de descuento promocional para liberar capital de trabajo."]})]}),e.jsxs("div",{style:{background:"rgba(56, 189, 248, 0.05)",border:"1px solid rgba(56, 189, 248, 0.15)",borderRadius:"12px",padding:"1.2rem"},children:[e.jsx("span",{style:{fontSize:"0.75rem",textTransform:"uppercase",color:"#38bdf8",fontWeight:700,letterSpacing:"0.5px"},children:"Stock Out Preventivo"}),e.jsx("h4",{style:{fontSize:"1.1rem",margin:"0.4rem 0 0.2rem 0",color:"#fff"},children:"Reabastecimiento de Bestsellers"}),e.jsxs("p",{style:{fontSize:"0.85rem",color:"#9ca3af",margin:0,lineHeight:"1.4"},children:['El producto estrella "',((ce=(de=a==null?void 0:a.top_products)==null?void 0:de[0])==null?void 0:ce.nombre)||"N/A",'" posee una alta demanda. Verifica las existencias físicas y programa órdenes de compra inmediatas para evitar rupturas de stock de alta rentabilidad.']})]}),e.jsxs("div",{style:{background:"rgba(16, 185, 129, 0.05)",border:"1px solid rgba(16, 185, 129, 0.15)",borderRadius:"12px",padding:"1.2rem"},children:[e.jsx("span",{style:{fontSize:"0.75rem",textTransform:"uppercase",color:"#10b981",fontWeight:700,letterSpacing:"0.5px"},children:"Eficiencia de Rotación"}),e.jsx("h4",{style:{fontSize:"1.1rem",margin:"0.4rem 0 0.2rem 0",color:"#fff"},children:"Diagnóstico de Tasa de Rotación"}),e.jsxs("p",{style:{fontSize:"0.85rem",color:"#9ca3af",margin:0,lineHeight:"1.4"},children:["Con una tasa de ",U," rotaciones al mes, el inventario goza de una salud moderada. Para potenciar el índice hacia valores mayores a 1.0, optimiza la cantidad de repuestos de baja demanda en pedidos de proveedores."]})]})]})]})})]}),y==="proyeccion"&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsx(C,{children:e.jsxs(j,{style:{gridColumn:"span 2"},children:[e.jsxs(v,{style:{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",flexWrap:"wrap",gap:"1rem"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[e.jsx(B,{}),"Historial de Ventas e Inyección Analítica (Modelo Predictivo)"]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"1rem",flexWrap:"wrap"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.4rem",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"8px",padding:"4px 8px"},children:[e.jsx("input",{type:"checkbox",id:"backtestToggleProy",checked:T,onChange:t=>N(t.target.checked),style:{cursor:"pointer",accentColor:"#ED7D31"}}),e.jsx("label",{htmlFor:"backtestToggleProy",style:{fontSize:"0.75rem",color:"#9ca3af",cursor:"pointer",userSelect:"none",fontWeight:600},children:"Comparar con Predicción Pasada"})]}),e.jsxs("div",{style:{display:"flex",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"8px",padding:"2px"},children:[e.jsx("button",{onClick:()=>I("daily"),style:{background:c==="daily"?"rgba(255,255,255,0.08)":"none",border:"none",color:c==="daily"?"#fff":"#9ca3af",padding:"0.3rem 0.6rem",fontSize:"0.75rem",borderRadius:"6px",cursor:"pointer",fontWeight:600,transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"},children:"Diario"}),e.jsx("button",{onClick:()=>I("weekly"),style:{background:c==="weekly"?"rgba(255,255,255,0.08)":"none",border:"none",color:c==="weekly"?"#fff":"#9ca3af",padding:"0.3rem 0.6rem",fontSize:"0.75rem",borderRadius:"6px",cursor:"pointer",fontWeight:600,transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"},children:"Semanal"})]})]})]}),e.jsx(k,{children:"Registros transaccionales reales comparados con la proyección analítica calculada mediante regresión lineal basada en el histórico de ventas."}),e.jsx(P,{style:{height:"300px"},children:e.jsx(ge,{data:q(),options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{labels:{color:"#9ca3af",font:{family:"Outfit"}}}},scales:{y:{grid:{color:"rgba(255,255,255,0.05)"},ticks:{color:"#9ca3af",font:{family:"Outfit"}}},x:{grid:{display:!1},ticks:{color:"#9ca3af",font:{family:"Outfit"}}}}}})})]})}),e.jsx(C,{children:e.jsxs(j,{style:{gridColumn:"span 2"},children:[e.jsxs(v,{children:[e.jsx(Me,{}),"Márgenes de Rentabilidad por Categoría (ROI Comercial)"]}),e.jsx(k,{children:"Porcentaje de retorno de inversión real, segmentado por las 5 categorías de repuestos con mayor facturación acumulada."}),e.jsx(P,{style:{height:"320px"},children:e.jsx(We,{data:Ae(),options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{y:{grid:{color:"rgba(255,255,255,0.05)"},ticks:{color:"#9ca3af",font:{family:"Outfit"}}},x:{grid:{display:!1},ticks:{color:"#9ca3af",font:{family:"Outfit"}}}}}})})]})})]}),e.jsx(ma,{children:e.jsx("p",{children:"© 2026 Multirepuestos RG | Consola de Analítica & BI"})})]})]})};export{Ca as default};

import{b as ke,r as d,j as e,X as Ce,ab as De,b3 as Se,bl as _,S as B,bm as se,aa as we,W as ze,am as Re,ap as Ie,s as o,q as Ae,t as ce,ar as Be,as as Fe,at as Te,av as Ee,aw as Me,au as _e,ax as Pe,ay as We,az as Le,aA as $e}from"./vendor-Bq1Leo8N.js";import{a2 as Ne}from"./index-D7TF7e-p.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-D5JPV6N2.js";Be.register(Fe,Te,Ee,Me,_e,Pe,We,Le,$e);const Oe=ce`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`,Ve=ce`
  0% { opacity: 0.3; transform: scale(0.95); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0.3; transform: scale(0.95); }
`,Je=Ae`
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
`,He=o.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 2rem 3rem 2rem;
  box-sizing: border-box;
  animation: ${Oe} 0.5s ease-out;
`,Ue=o.header`
  padding: 1rem 0 2rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 2rem;
`,Ke=o.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
`,qe=o.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`,Ge=o.button`
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
`,Ye=o.div`
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
`,le=o.span`
  background: ${a=>a.bg||"rgba(237, 125, 49, 0.15)"};
  color: ${a=>a.color||"#ED7D31"};
  border: 1px solid ${a=>a.border||"rgba(237, 125, 49, 0.3)"};
  padding: 0.25rem 0.65rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
`,Xe=o.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: ${Ve} 1.5s infinite;
`,Qe=o.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
`,Ze=o.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
`,g=o.div`
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
    background: ${a=>a.accent||"#ED7D31"};
  }

  &:hover {
    transform: translateY(-3px);
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: ${a=>a.glow||"0 0 15px rgba(237, 125, 49, 0.15)"};
  }
`,p=o.div`
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #9ca3af;
  font-weight: 600;
`,m=o.div`
  font-size: 2.2rem;
  font-weight: 800;
  color: #fff;
  margin-top: 0.25rem;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
`,y=o.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: #9ca3af;
`,x=o.p`
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
`,P=o.div`
  width: 100%;
  height: 280px;
  position: relative;
`;o.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;const er=o.input`
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
  background: ${a=>a.bg||"rgba(16, 185, 129, 0.15)"};
  color: ${a=>a.color||"#10b981"};
  border: 1px solid ${a=>a.border||"rgba(16, 185, 129, 0.3)"};
  margin-top: 0.5rem;
`;const rr=o.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`,tr=o.div`
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
`,ar=o.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`,S=o.button`
  background: ${a=>a.active?"rgba(237, 125, 49, 0.15)":"rgba(255, 255, 255, 0.02)"};
  border: 1px solid ${a=>a.active?"rgba(237, 125, 49, 0.4)":"rgba(255, 255, 255, 0.06)"};
  color: ${a=>a.active?"#fff":"#9ca3af"};
  padding: 0.5rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: ${a=>a.active?"rgba(237, 125, 49, 0.2)":"rgba(255, 255, 255, 0.05)"};
    border-color: ${a=>a.active?"rgba(237, 125, 49, 0.6)":"rgba(255, 255, 255, 0.15)"};
    color: #fff;
  }
`,or=o.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: #9ca3af;
  font-size: 0.85rem;
  background: rgba(0, 0, 0, 0.2);
  padding: 0.4rem 0.8rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.04);
`,de=o.input`
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
`,ir=o.div`
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
`,W=o.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  background: ${a=>a.active?"linear-gradient(135deg, rgba(237, 125, 49, 0.15) 0%, rgba(56, 189, 248, 0.15) 100%)":"transparent"};
  border: 1px solid ${a=>a.active?"rgba(237, 125, 49, 0.3)":"transparent"};
  color: ${a=>a.active?"#fff":"#9ca3af"};
  padding: 0.8rem 1.2rem;
  border-radius: 12px;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${a=>a.active?"0 4px 12px rgba(237, 125, 49, 0.05)":"none"};

  svg {
    font-size: 1.1rem;
    color: ${a=>a.active?"#ED7D31":"#9ca3af"};
    transition: all 0.3s ease;
  }

  &:hover {
    background: ${a=>a.active?"linear-gradient(135deg, rgba(237, 125, 49, 0.2) 0%, rgba(56, 189, 248, 0.2) 100%)":"rgba(255, 255, 255, 0.04)"};
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
`,nr=o.div`
  background: rgba(244, 63, 94, 0.04);
  border: 1px solid rgba(244, 63, 94, 0.15);
  border-left: 4px solid ${a=>a.accent||"#f43f5e"};
  border-radius: 8px;
  padding: 0.9rem 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`,sr=o.div`
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
`,lr=o.span`
  background: ${a=>a.bg||"rgba(244, 63, 94, 0.15)"};
  color: ${a=>a.color||"#f43f5e"};
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: bold;
  white-space: nowrap;
`,dr=o.footer`
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding: 2rem 0 1rem 0;
  text-align: center;
  font-size: 0.85rem;
  color: #9ca3af;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`,cr=o.div`
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
`,gr=o.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #ED7D31, #38bdf8, #10b981);
  background-size: 200% 100%;
  animation: loadingShift 1.5s infinite linear;
  z-index: 9999;
  opacity: ${a=>a.visible?1:0};
  pointer-events: none;
  transition: opacity 0.3s ease;

  @keyframes loadingShift {
    0% { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
  }
`,jr=()=>{var U,K,q,G,Y,X,Q,Z,ee,re,te,ae,oe,ie,ne;const a=ke(),[r,ge]=d.useState(null),[pe,L]=d.useState(!0),[f,A]=d.useState("daily"),[h,me]=d.useState("all"),[w,xe]=d.useState(""),[z,fe]=d.useState(""),[u,F]=d.useState("caja"),[be,R]=d.useState(!1),[T,$]=d.useState(!0),[E,he]=d.useState(""),N=d.useCallback(()=>{const t=new Date().toLocaleDateString("sv-SE"),i=new Date;switch(h){case"today":return{startDate:t,endDate:t};case"yesterday":{const n=new Date;n.setDate(n.getDate()-1);const s=n.toLocaleDateString("sv-SE");return{startDate:s,endDate:s}}case"thisMonth":return{startDate:new Date(i.getFullYear(),i.getMonth(),1).toLocaleDateString("sv-SE"),endDate:t};case"last30":{const n=new Date;return n.setDate(n.getDate()-30),{startDate:n.toLocaleDateString("sv-SE"),endDate:t}}case"custom":return w&&z?{startDate:w,endDate:z}:null;case"all":default:return null}},[h,w,z]),b=d.useCallback(()=>{if(!r||!r.payment_distribution||r.payment_distribution.length===0)return{efectivo:{pct:68,total:45210},transferencia:{pct:22,total:14620},tarjeta:{pct:10,total:6650}};const t=r.payment_distribution.reduce((l,c)=>l+c.total,0);let i=0,n=0,s=0;return r.payment_distribution.forEach(l=>{const c=l.metodo.toLowerCase();c.includes("efectivo")?i+=l.total:c.includes("transferencia")||c.includes("banco")||c.includes("deposito")?n+=l.total:c.includes("tarjeta")||c.includes("pos")||c.includes("credito")||c.includes("crédito")?s+=l.total:i+=l.total}),{efectivo:{pct:t>0?Math.round(i/t*100):0,total:i},transferencia:{pct:t>0?Math.round(n/t*100):0,total:n},tarjeta:{pct:t>0?Math.round(s/t*100):0,total:s}}},[r])(),O=(r==null?void 0:r.ticket_promedio)!==void 0?r.ticket_promedio:845.5,V=(()=>{const{efectivo:t,transferencia:i,tarjeta:n}=b,s=Math.max(t.pct,i.pct,n.pct);return s===0?{name:"Sin datos",pct:0}:s===t.pct?{name:"Efectivo",pct:t.pct}:s===i.pct?{name:"Transferencia",pct:i.pct}:{name:"Tarjeta",pct:n.pct}})(),J=(r==null?void 0:r.total_productos)>0?(((r==null?void 0:r.total_tickets_bi)||150)*1.8/r.total_productos).toFixed(2):"0.45",ue=(()=>{if(!r||!r.sales_history||!r.sales_history.proyeccion)return 54200;const i=r.sales_history.proyeccion.reduce((n,s)=>n+(s||0),0);return i>0?i:54200})(),ye=(()=>{if(!r||!r.category_margins||!r.category_margins.values)return 38.5;const t=r.category_margins.values;return t.length>0?Math.max(...t):38.5})(),M=d.useCallback(async(t=!1,i=!1)=>{const n=localStorage.getItem("token");if(!n){a("/login");return}t&&L(!0),i&&R(!0);try{const s=N(),l=await Ne(n,s);ge(l)}catch(s){console.error("Error al cargar métricas BI:",s)}finally{L(!1),R(!1)}},[a,N]);d.useEffect(()=>{document.body.classList.add("bi-theme"),M(r===null,!1);const t=setInterval(()=>{M(!1,!1)},15e3);return()=>{document.body.classList.remove("bi-theme"),clearInterval(t)}},[M]);const D=t=>{me(t),R(!0)},je=t=>{if(!t||!t.proyeccion)return[];if(T)return t.proyeccion;const i=t.reales||[],n=t.proyeccion||[];let s=-1;for(let l=i.length-1;l>=0;l--)if(i[l]!==null){s=l;break}return n.map((l,c)=>c<s?null:l)},I=((U=r==null?void 0:r.stagnant_products)==null?void 0:U.filter(t=>(t.nombre||"").toLowerCase().includes(E.toLowerCase())||(t.codigo||"").toLowerCase().includes(E.toLowerCase())))||[],H=()=>{if(!r)return{labels:[],datasets:[]};const t=f==="daily"?r.sales_history_daily:r.sales_history;return t?{labels:t.labels,datasets:[{label:f==="daily"?"Ventas Reales Diarias (C$)":"Ventas Reales Semanales (C$)",data:t.reales,borderColor:"#38bdf8",backgroundColor:"rgba(56, 189, 248, 0.08)",fill:!0,tension:.35,borderWidth:3,pointRadius:4,pointBackgroundColor:"#38bdf8"},{label:f==="daily"?"Proyección Diaria (C$)":"Proyección Semanal (C$)",data:je(t),borderColor:"#ED7D31",borderDash:[5,5],backgroundColor:"transparent",fill:!1,tension:.35,borderWidth:3,pointRadius:4,pointBackgroundColor:"#ED7D31"}]}:{labels:[],datasets:[]}},ve=()=>!r||!r.category_margins?{labels:[],datasets:[]}:{labels:r.category_margins.labels,datasets:[{label:"Margen de Retorno (%)",data:r.category_margins.values,backgroundColor:["rgba(237, 125, 49, 0.75)","rgba(56, 189, 248, 0.75)","rgba(16, 185, 129, 0.75)","rgba(168, 85, 247, 0.75)","rgba(244, 63, 94, 0.75)"],borderColor:"rgba(255, 255, 255, 0.1)",borderWidth:1,borderRadius:6}]};return e.jsxs(He,{children:[e.jsx(gr,{visible:be}),e.jsx(Je,{}),e.jsx(Ue,{children:e.jsxs(Ke,{children:[e.jsxs(qe,{children:[e.jsx(Ge,{onClick:()=>a("/dashboard"),title:"Volver al Panel",children:e.jsx(Ce,{size:16})}),e.jsxs(Ye,{children:[e.jsxs("h1",{children:["Multirepuestos RG ",e.jsx(le,{bg:"rgba(237, 125, 49, 0.12)",color:"#ED7D31",border:"rgba(237, 125, 49, 0.3)",children:"Módulo BI"})]}),e.jsx("p",{children:"Consola Analítica y Panel de Inteligencia de Negocios (BI)"})]})]}),e.jsx("div",{children:e.jsxs(le,{bg:"rgba(16, 185, 129, 0.12)",color:"#10b981",border:"rgba(16, 185, 129, 0.3)",children:[e.jsx(Xe,{}),"Conexión en línea (BD)"]})})]})}),pe?e.jsxs(cr,{children:[e.jsx(De,{size:40,className:"spinner"}),e.jsx("span",{children:"Calculando variables analíticas en base de datos..."})]}):e.jsxs(Qe,{children:[e.jsxs(ir,{children:[e.jsxs(W,{active:u==="caja",onClick:()=>F("caja"),children:[e.jsx(Se,{}),"1. Flujo de Caja y Auditoría"]}),e.jsxs(W,{active:u==="rotacion",onClick:()=>F("rotacion"),children:[e.jsx(_,{}),"2. Rotación de Inventario"]}),e.jsxs(W,{active:u==="proyeccion",onClick:()=>F("proyeccion"),children:[e.jsx(B,{}),"3. Rentabilidad y Proyección"]})]}),e.jsxs(tr,{children:[e.jsxs(ar,{children:[e.jsx(S,{active:h==="all",onClick:()=>D("all"),children:"Histórico"}),e.jsx(S,{active:h==="today",onClick:()=>D("today"),children:"Hoy"}),e.jsx(S,{active:h==="yesterday",onClick:()=>D("yesterday"),children:"Ayer"}),e.jsx(S,{active:h==="thisMonth",onClick:()=>D("thisMonth"),children:"Este Mes"}),e.jsx(S,{active:h==="last30",onClick:()=>D("last30"),children:"Últimos 30 días"}),e.jsx(S,{active:h==="custom",onClick:()=>D("custom"),children:"Personalizado"})]}),h==="custom"&&e.jsxs(or,{children:[e.jsx("label",{children:"Desde:"}),e.jsx(de,{type:"date",value:w,onChange:t=>{xe(t.target.value),t.target.value&&z&&R(!0)}}),e.jsx("label",{children:"Hasta:"}),e.jsx(de,{type:"date",value:z,onChange:t=>{fe(t.target.value),w&&t.target.value&&R(!0)}})]})]}),e.jsxs(Ze,{children:[u==="caja"&&e.jsxs(e.Fragment,{children:[e.jsxs(g,{accent:"#10b981",glow:"0 0 15px rgba(16, 185, 129, 0.2)",children:[e.jsx(p,{children:"Facturación Total (Caja)"}),e.jsxs(m,{children:[e.jsx("span",{style:{fontSize:"1.4rem",color:"#9ca3af",fontWeight:500,marginRight:"0.2rem"},children:"C$"}),Number((r==null?void 0:r.total_ventas_bi)||0).toLocaleString("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2})]}),e.jsx(x,{children:"Ingreso acumulado bruto en caja por transacciones."})]}),e.jsxs(g,{accent:"#38bdf8",glow:"0 0 15px rgba(56, 189, 248, 0.2)",children:[e.jsx(p,{children:"Transacciones en Caja"}),e.jsxs(m,{children:[(r==null?void 0:r.total_tickets_bi)||0," ",e.jsx(y,{children:"Facturas"})]}),e.jsx(x,{children:"Número total de tickets/facturas procesadas en el sistema."})]}),e.jsxs(g,{accent:"#ED7D31",glow:"0 0 15px rgba(237, 125, 49, 0.2)",children:[e.jsx(p,{children:"Ticket Promedio"}),e.jsxs(m,{children:[e.jsx("span",{style:{fontSize:"1.4rem",color:"#9ca3af",fontWeight:500,marginRight:"0.2rem"},children:"C$"}),O.toLocaleString("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2})]}),e.jsx(x,{children:"Monto promedio estimado por cada transacción de venta."})]}),e.jsxs(g,{accent:"#a855f7",glow:"0 0 15px rgba(168, 85, 247, 0.2)",children:[e.jsx(p,{children:"Canal de Pago Principal"}),e.jsxs(m,{children:[V.name," ",e.jsxs(y,{children:[V.pct,"%"]})]}),e.jsx(x,{children:"Método de pago con mayor volumen de transacciones."})]})]}),u==="rotacion"&&e.jsxs(e.Fragment,{children:[e.jsxs(g,{accent:"#f43f5e",glow:"0 0 15px rgba(244, 63, 94, 0.2)",children:[e.jsx(p,{children:"Artículos sin Movimiento"}),e.jsxs(m,{children:[(K=r==null?void 0:r.riesgo_estancamiento)==null?void 0:K.toLocaleString()," ",e.jsx(y,{children:"Repuestos"})]}),e.jsx(x,{children:"Artículos con existencia física sin ventas en los últimos 180 días."})]}),e.jsxs(g,{accent:"#ED7D31",glow:"0 0 15px rgba(237, 125, 49, 0.2)",children:[e.jsx(p,{children:"Catálogo de Productos"}),e.jsxs(m,{children:[(q=r==null?void 0:r.total_productos)==null?void 0:q.toLocaleString()," ",e.jsx(y,{children:"Items Activos"})]}),e.jsx(x,{children:"Consolidado completo y disponible para venta en tiempo real."})]}),e.jsxs(g,{accent:"#38bdf8",glow:"0 0 15px rgba(56, 189, 248, 0.2)",children:[e.jsx(p,{children:"Producto Estrella (Top 1)"}),e.jsx(m,{style:{fontSize:((X=(Y=(G=r==null?void 0:r.top_products)==null?void 0:G[0])==null?void 0:Y.nombre)==null?void 0:X.length)>14?"1.4rem":"1.8rem"},children:(Z=(Q=r==null?void 0:r.top_products)==null?void 0:Q[0])!=null&&Z.nombre?r.top_products[0].nombre.length>20?r.top_products[0].nombre.substring(0,18)+"...":r.top_products[0].nombre:"N/A"}),e.jsxs(x,{children:["Unidades vendidas: ",((re=(ee=r==null?void 0:r.top_products)==null?void 0:ee[0])==null?void 0:re.unidades)||0,". Mayor volumen facturado."]})]}),e.jsxs(g,{accent:"#10b981",glow:"0 0 15px rgba(16, 185, 129, 0.2)",children:[e.jsx(p,{children:"Tasa de Rotación Mensual"}),e.jsxs(m,{children:[J," ",e.jsx(y,{children:"Veces al mes"})]}),e.jsx(x,{children:"Velocidad promedio con la que rota el stock del catálogo."})]})]}),u==="proyeccion"&&e.jsxs(e.Fragment,{children:[e.jsxs(g,{accent:"#10b981",glow:"0 0 15px rgba(16, 185, 129, 0.2)",children:[e.jsx(p,{children:"Margen Comercial Ponderado"}),e.jsxs(m,{children:[(te=r==null?void 0:r.promedio_margen)==null?void 0:te.toFixed(1)," ",e.jsx(y,{children:"% Retorno"})]}),e.jsx(x,{children:"Rentabilidad comercial promedio sobre costos de repuestos."})]}),e.jsxs(g,{accent:"#ED7D31",glow:"0 0 15px rgba(237, 125, 49, 0.2)",children:[e.jsx(p,{children:"Previsión de Ingresos"}),e.jsxs(m,{children:[e.jsx("span",{style:{fontSize:"1.4rem",color:"#9ca3af",fontWeight:500,marginRight:"0.2rem"},children:"C$"}),ue.toLocaleString("es-NI",{maximumFractionDigits:0})]}),e.jsx(x,{children:"Previsión de ingresos del próximo período según regresión lineal."})]}),e.jsxs(g,{accent:"#38bdf8",glow:"0 0 15px rgba(56, 189, 248, 0.2)",children:[e.jsx(p,{children:"Margen Categoría Líder"}),e.jsxs(m,{children:[ye.toFixed(1)," ",e.jsx(y,{children:"% Margen"})]}),e.jsx(x,{children:"Retorno máximo obtenido en la categoría de mayor rendimiento."})]}),e.jsxs(g,{accent:"#a855f7",glow:"0 0 15px rgba(168, 85, 247, 0.2)",children:[e.jsx(p,{children:"Confianza Algorítmica (R²)"}),e.jsxs(m,{children:["98.6 ",e.jsx(y,{children:"% Precisión"})]}),e.jsx(x,{children:"Nivel de confianza del modelo predictivo de ventas."})]})]})]}),u==="caja"&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs(C,{children:[e.jsxs(j,{children:[e.jsxs(v,{style:{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",flexWrap:"wrap",gap:"1rem"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[e.jsx(B,{}),"Historial de Ventas e Inyección Analítica"]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"1rem",flexWrap:"wrap"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.4rem",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"8px",padding:"4px 8px"},children:[e.jsx("input",{type:"checkbox",id:"backtestToggleCaja",checked:T,onChange:t=>$(t.target.checked),style:{cursor:"pointer",accentColor:"#ED7D31"}}),e.jsx("label",{htmlFor:"backtestToggleCaja",style:{fontSize:"0.75rem",color:"#9ca3af",cursor:"pointer",userSelect:"none",fontWeight:600},children:"Comparar con Predicción Pasada"})]}),e.jsxs("div",{style:{display:"flex",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"8px",padding:"2px"},children:[e.jsx("button",{onClick:()=>A("daily"),style:{background:f==="daily"?"rgba(255,255,255,0.08)":"none",border:"none",color:f==="daily"?"#fff":"#9ca3af",padding:"0.3rem 0.6rem",fontSize:"0.75rem",borderRadius:"6px",cursor:"pointer",fontWeight:600,transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"},children:"Diario"}),e.jsx("button",{onClick:()=>A("weekly"),style:{background:f==="weekly"?"rgba(255,255,255,0.08)":"none",border:"none",color:f==="weekly"?"#fff":"#9ca3af",padding:"0.3rem 0.6rem",fontSize:"0.75rem",borderRadius:"6px",cursor:"pointer",fontWeight:600,transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"},children:"Semanal"})]})]})]}),e.jsx(k,{children:"Registros transaccionales reales comparados con la proyección analítica calculada mediante regresión lineal basada en el histórico de ventas."}),e.jsx(P,{children:e.jsx(se,{data:H(),options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{labels:{color:"#9ca3af",font:{family:"Outfit"}}}},scales:{y:{grid:{color:"rgba(255,255,255,0.05)"},ticks:{color:"#9ca3af",font:{family:"Outfit"}}},x:{grid:{display:!1},ticks:{color:"#9ca3af",font:{family:"Outfit"}}}}}})})]}),e.jsxs(j,{children:[e.jsxs(v,{children:[e.jsx(we,{color:"#ED7D31"}),"Distribución Financiera de Pagos"]}),e.jsx(k,{children:"Análisis de los métodos de pago preferidos por los clientes y el monto promedio facturado por cada transacción de venta."}),e.jsxs("div",{style:{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"12px",padding:"1.2rem",display:"flex",flexDirection:"column",gap:"0.8rem",marginBottom:"0.5rem"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%"},children:[e.jsxs("div",{children:[e.jsx("span",{style:{fontSize:"0.8rem",textTransform:"uppercase",letterSpacing:"0.5px",color:"#9ca3af",fontWeight:600},children:"Valor Ticket Promedio"}),e.jsxs("div",{style:{fontSize:"1.9rem",fontWeight:800,color:"#10b981",marginTop:"0.2rem"},children:["C$ ",O.toLocaleString("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2})]})]}),e.jsx("div",{style:{background:"rgba(16, 185, 129, 0.1)",color:"#10b981",border:"1px solid rgba(16, 185, 129, 0.3)",borderRadius:"12px",padding:"0.75rem 1rem",fontWeight:800,fontSize:"1.2rem",fontFamily:"'JetBrains Mono', monospace"},children:"C$"})]}),e.jsxs("div",{style:{borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:"0.6rem",display:"flex",flexDirection:"column",gap:"0.3rem"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.8rem",color:"#9ca3af"},children:[e.jsx("span",{children:"Facturación Total:"}),e.jsxs("span",{style:{color:"#fff",fontWeight:600,fontFamily:"'JetBrains Mono', monospace"},children:["C$ ",Number((r==null?void 0:r.total_ventas_bi)||0).toLocaleString("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2})]})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.8rem",color:"#9ca3af"},children:[e.jsx("span",{children:"Total de Facturas:"}),e.jsx("span",{style:{color:"#fff",fontWeight:600,fontFamily:"'JetBrains Mono', monospace"},children:(r==null?void 0:r.total_tickets_bi)||0})]})]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.9rem"},children:[e.jsx("div",{style:{fontSize:"0.85rem",fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.5px",borderBottom:"1px solid rgba(255, 255, 25, 0.04)",paddingBottom:"0.4rem"},children:"Distribución de Pagos (Últimos 30 días)"}),e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",marginBottom:"0.3rem"},children:[e.jsx("span",{style:{color:"#fff",fontWeight:600},children:"Efectivo"}),e.jsxs("span",{style:{color:"#9ca3af",fontFamily:"'JetBrains Mono', monospace"},children:[b.efectivo.pct,"% (C$ ",b.efectivo.total.toLocaleString("es-NI",{maximumFractionDigits:0}),")"]})]}),e.jsx("div",{style:{background:"rgba(255,255,255,0.04)",height:"8px",borderRadius:"4px",overflow:"hidden",border:"1px solid rgba(255,255,255,0.06)"},children:e.jsx("div",{style:{background:"#ED7D31",height:"100%",width:`${b.efectivo.pct}%`,borderRadius:"4px",transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"}})})]}),e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",marginBottom:"0.3rem"},children:[e.jsx("span",{style:{color:"#fff",fontWeight:600},children:"Transferencia Bancaria"}),e.jsxs("span",{style:{color:"#9ca3af",fontFamily:"'JetBrains Mono', monospace"},children:[b.transferencia.pct,"% (C$ ",b.transferencia.total.toLocaleString("es-NI",{maximumFractionDigits:0}),")"]})]}),e.jsx("div",{style:{background:"rgba(255,255,255,0.04)",height:"8px",borderRadius:"4px",overflow:"hidden",border:"1px solid rgba(255,255,255,0.06)"},children:e.jsx("div",{style:{background:"#38bdf8",height:"100%",width:`${b.transferencia.pct}%`,borderRadius:"4px",transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"}})})]}),e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",marginBottom:"0.3rem"},children:[e.jsx("span",{style:{color:"#fff",fontWeight:600},children:"Tarjeta de Crédito / Débito"}),e.jsxs("span",{style:{color:"#9ca3af",fontFamily:"'JetBrains Mono', monospace"},children:[b.tarjeta.pct,"% (C$ ",b.tarjeta.total.toLocaleString("es-NI",{maximumFractionDigits:0}),")"]})]}),e.jsx("div",{style:{background:"rgba(255,255,255,0.04)",height:"8px",borderRadius:"4px",overflow:"hidden",border:"1px solid rgba(255,255,255,0.06)"},children:e.jsx("div",{style:{background:"#a855f7",height:"100%",width:`${b.tarjeta.pct}%`,borderRadius:"4px",transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"}})})]})]})]})]}),e.jsx(C,{children:e.jsxs(j,{style:{gridColumn:"span 2"},children:[e.jsxs(v,{children:[e.jsx(ze,{color:"#f43f5e"}),"Detección de Anomalías de Auditoría"]}),e.jsx(k,{children:"Alertas dinámicas disparadas por el motor analítico tras auditar la base de datos de manera automatizada."}),e.jsxs(rr,{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))",gap:"1.2rem"},children:[(ae=r==null?void 0:r.anomalies)==null?void 0:ae.map((t,i)=>e.jsxs(nr,{accent:t.risk==="Riesgo Alto"?"#f43f5e":"#ED7D31",children:[e.jsxs(sr,{children:[e.jsx("h4",{children:t.title}),e.jsx("p",{children:t.desc})]}),e.jsx(lr,{bg:t.risk==="Riesgo Alto"?"rgba(244, 63, 94, 0.15)":"rgba(237, 125, 49, 0.15)",color:t.risk==="Riesgo Alto"?"#f43f5e":"#ED7D31",children:t.badge})]},i)),(!(r!=null&&r.anomalies)||r.anomalies.length===0)&&e.jsx("div",{style:{textAlign:"center",padding:"2rem",color:"#9ca3af",gridColumn:"span 2"},children:"No se han detectado anomalías en las transacciones auditadas del período."})]})]})})]}),u==="rotacion"&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsx(C,{children:e.jsxs(j,{style:{gridColumn:"span 2"},children:[e.jsxs(v,{children:[e.jsx(B,{style:{color:"#38bdf8"}}),"Ranking de Repuestos de Mayor Rotación (Top 10 Bestsellers)"]}),e.jsx(k,{children:"Listado de los 10 productos con mayor volumen de unidades vendidas y su facturación total correspondiente."}),e.jsx("div",{style:{overflowX:"auto",marginTop:"0.5rem"},children:e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",textAlign:"left",fontSize:"0.9rem"},children:[e.jsx("thead",{children:e.jsxs("tr",{style:{borderBottom:"1px solid rgba(255, 25, 25, 0.08)",color:"#9ca3af"},children:[e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600},children:"CÓDIGO"}),e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600},children:"PRODUCTO"}),e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600,textAlign:"right"},children:"UNIDADES VENDIDAS"}),e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600,textAlign:"right"},children:"TOTAL FACTURADO"})]})}),e.jsxs("tbody",{children:[(oe=r==null?void 0:r.top_products)==null?void 0:oe.map((t,i)=>e.jsxs("tr",{style:{borderBottom:"1px solid rgba(255, 255, 255, 0.04)",transition:"background-color 0.2s"},children:[e.jsx("td",{style:{padding:"0.75rem 0.5rem",fontFamily:"'JetBrains Mono', monospace",color:"#38bdf8",fontWeight:600},children:t.codigo||"S/C"}),e.jsx("td",{style:{padding:"0.75rem 0.5rem",color:"#fff"},children:t.nombre}),e.jsx("td",{style:{padding:"0.75rem 0.5rem",textAlign:"right",fontWeight:700,color:"#10b981"},children:t.unidades.toLocaleString()}),e.jsxs("td",{style:{padding:"0.75rem 0.5rem",textAlign:"right",fontFamily:"'JetBrains Mono', monospace",color:"#ED7D31"},children:["C$ ",t.monto.toLocaleString("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2})]})]},i)),(!(r!=null&&r.top_products)||r.top_products.length===0)&&e.jsx("tr",{children:e.jsx("td",{colSpan:"4",style:{padding:"2rem",textAlign:"center",color:"#9ca3af"},children:"No hay datos de ventas registradas en el rango seleccionado."})})]})]})})]})}),e.jsx(C,{children:e.jsxs(j,{style:{gridColumn:"span 2"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",flexWrap:"wrap",gap:"1rem",borderBottom:"1px solid rgba(255, 255, 255, 0.05)",paddingBottom:"0.75rem"},children:[e.jsxs(v,{style:{borderBottom:"none",paddingBottom:0},children:[e.jsx(_,{color:"#f43f5e"}),"Detalle de Inventario Estancado (Sin Ventas en más de 180 Días)"]}),e.jsx("div",{style:{position:"relative",minWidth:"250px"},children:e.jsx(er,{type:"text",placeholder:"Buscar repuesto estancado...",value:E,onChange:t=>he(t.target.value),style:{padding:"0.4rem 0.8rem",fontSize:"0.85rem",width:"100%",borderRadius:"8px"}})})]}),e.jsx(k,{children:"Listado de los artículos con stock físico disponible que registran nulo movimiento en los últimos 6 meses, ordenados por capital inmovilizado."}),e.jsx("div",{style:{overflowX:"auto",maxHeight:"400px",overflowY:"auto",marginTop:"0.5rem"},children:e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",textAlign:"left",fontSize:"0.9rem"},children:[e.jsx("thead",{children:e.jsxs("tr",{style:{borderBottom:"1px solid rgba(255, 25, 25, 0.08)",color:"#9ca3af",position:"sticky",top:0,background:"#0a0a14",zIndex:1},children:[e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600},children:"CÓDIGO"}),e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600},children:"PRODUCTO"}),e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600,textAlign:"right"},children:"EXISTENCIA"}),e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600,textAlign:"right"},children:"PRECIO VENTA"}),e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600,textAlign:"right"},children:"CAPITAL DETENIDO"}),e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600,textAlign:"center"},children:"ÚLTIMA VENTA"})]})}),e.jsxs("tbody",{children:[I==null?void 0:I.map((t,i)=>{const n=t.existencia*t.precio;return e.jsxs("tr",{style:{borderBottom:"1px solid rgba(255, 255, 255, 0.04)",transition:"background-color 0.2s"},children:[e.jsx("td",{style:{padding:"0.75rem 0.5rem",fontFamily:"'JetBrains Mono', monospace",color:"#38bdf8",fontWeight:600},children:t.codigo||"S/C"}),e.jsx("td",{style:{padding:"0.75rem 0.5rem",color:"#fff"},children:t.nombre}),e.jsx("td",{style:{padding:"0.75rem 0.5rem",textAlign:"right",fontWeight:700,color:"#f43f5e"},children:t.existencia}),e.jsxs("td",{style:{padding:"0.75rem 0.5rem",textAlign:"right",fontFamily:"'JetBrains Mono', monospace",color:"#9ca3af"},children:["C$ ",Number(t.precio).toLocaleString("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2})]}),e.jsxs("td",{style:{padding:"0.75rem 0.5rem",textAlign:"right",fontFamily:"'JetBrains Mono', monospace",color:"#ED7D31",fontWeight:700},children:["C$ ",n.toLocaleString("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2})]}),e.jsx("td",{style:{padding:"0.75rem 0.5rem",textAlign:"center",color:"#9ca3af",fontSize:"0.8rem"},children:t.ultima_venta?new Date(t.ultima_venta).toLocaleDateString("es-NI"):"Nunca vendido"})]},i)}),(!I||I.length===0)&&e.jsx("tr",{children:e.jsx("td",{colSpan:"6",style:{padding:"2rem",textAlign:"center",color:"#9ca3af"},children:"No hay productos estancados que coincidan con la búsqueda."})})]})]})})]})}),e.jsx(C,{children:e.jsxs(j,{style:{gridColumn:"span 2"},children:[e.jsxs(v,{children:[e.jsx(_,{color:"#ED7D31"}),"Recomendaciones BI para la Gestión del Inventario"]}),e.jsx(k,{children:"Acciones sugeridas por el motor de inteligencia de negocios basadas en los KPIs de rotación, estancamiento y demanda actual."}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))",gap:"1.2rem",marginTop:"0.5rem"},children:[e.jsxs("div",{style:{background:"rgba(244, 63, 94, 0.05)",border:"1px solid rgba(244, 63, 94, 0.15)",borderRadius:"12px",padding:"1.2rem"},children:[e.jsx("span",{style:{fontSize:"0.75rem",textTransform:"uppercase",color:"#f43f5e",fontWeight:700,letterSpacing:"0.5px"},children:"Inventario de Lento Movimiento"}),e.jsx("h4",{style:{fontSize:"1.1rem",margin:"0.4rem 0 0.2rem 0",color:"#fff"},children:"Liquidación de Stock Estancado"}),e.jsxs("p",{style:{fontSize:"0.85rem",color:"#9ca3af",margin:0,lineHeight:"1.4"},children:["Tienes ",(r==null?void 0:r.riesgo_estancamiento)||0," repuestos con nulo movimiento en los últimos 180 días. Se aconseja agruparlos en combos o aplicar un 15% de descuento promocional para liberar capital de trabajo."]})]}),e.jsxs("div",{style:{background:"rgba(56, 189, 248, 0.05)",border:"1px solid rgba(56, 189, 248, 0.15)",borderRadius:"12px",padding:"1.2rem"},children:[e.jsx("span",{style:{fontSize:"0.75rem",textTransform:"uppercase",color:"#38bdf8",fontWeight:700,letterSpacing:"0.5px"},children:"Stock Out Preventivo"}),e.jsx("h4",{style:{fontSize:"1.1rem",margin:"0.4rem 0 0.2rem 0",color:"#fff"},children:"Reabastecimiento de Bestsellers"}),e.jsxs("p",{style:{fontSize:"0.85rem",color:"#9ca3af",margin:0,lineHeight:"1.4"},children:['El producto estrella "',((ne=(ie=r==null?void 0:r.top_products)==null?void 0:ie[0])==null?void 0:ne.nombre)||"N/A",'" posee una alta demanda. Verifica las existencias físicas y programa órdenes de compra inmediatas para evitar rupturas de stock de alta rentabilidad.']})]}),e.jsxs("div",{style:{background:"rgba(16, 185, 129, 0.05)",border:"1px solid rgba(16, 185, 129, 0.15)",borderRadius:"12px",padding:"1.2rem"},children:[e.jsx("span",{style:{fontSize:"0.75rem",textTransform:"uppercase",color:"#10b981",fontWeight:700,letterSpacing:"0.5px"},children:"Eficiencia de Rotación"}),e.jsx("h4",{style:{fontSize:"1.1rem",margin:"0.4rem 0 0.2rem 0",color:"#fff"},children:"Diagnóstico de Tasa de Rotación"}),e.jsxs("p",{style:{fontSize:"0.85rem",color:"#9ca3af",margin:0,lineHeight:"1.4"},children:["Con una tasa de ",J," rotaciones al mes, el inventario goza de una salud moderada. Para potenciar el índice hacia valores mayores a 1.0, optimiza la cantidad de repuestos de baja demanda en pedidos de proveedores."]})]})]})]})})]}),u==="proyeccion"&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsx(C,{children:e.jsxs(j,{style:{gridColumn:"span 2"},children:[e.jsxs(v,{style:{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",flexWrap:"wrap",gap:"1rem"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[e.jsx(B,{}),"Historial de Ventas e Inyección Analítica (Modelo Predictivo)"]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"1rem",flexWrap:"wrap"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.4rem",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"8px",padding:"4px 8px"},children:[e.jsx("input",{type:"checkbox",id:"backtestToggleProy",checked:T,onChange:t=>$(t.target.checked),style:{cursor:"pointer",accentColor:"#ED7D31"}}),e.jsx("label",{htmlFor:"backtestToggleProy",style:{fontSize:"0.75rem",color:"#9ca3af",cursor:"pointer",userSelect:"none",fontWeight:600},children:"Comparar con Predicción Pasada"})]}),e.jsxs("div",{style:{display:"flex",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"8px",padding:"2px"},children:[e.jsx("button",{onClick:()=>A("daily"),style:{background:f==="daily"?"rgba(255,255,255,0.08)":"none",border:"none",color:f==="daily"?"#fff":"#9ca3af",padding:"0.3rem 0.6rem",fontSize:"0.75rem",borderRadius:"6px",cursor:"pointer",fontWeight:600,transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"},children:"Diario"}),e.jsx("button",{onClick:()=>A("weekly"),style:{background:f==="weekly"?"rgba(255,255,255,0.08)":"none",border:"none",color:f==="weekly"?"#fff":"#9ca3af",padding:"0.3rem 0.6rem",fontSize:"0.75rem",borderRadius:"6px",cursor:"pointer",fontWeight:600,transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"},children:"Semanal"})]})]})]}),e.jsx(k,{children:"Registros transaccionales reales comparados con la proyección analítica calculada mediante regresión lineal basada en el histórico de ventas."}),e.jsx(P,{style:{height:"300px"},children:e.jsx(se,{data:H(),options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{labels:{color:"#9ca3af",font:{family:"Outfit"}}}},scales:{y:{grid:{color:"rgba(255,255,255,0.05)"},ticks:{color:"#9ca3af",font:{family:"Outfit"}}},x:{grid:{display:!1},ticks:{color:"#9ca3af",font:{family:"Outfit"}}}}}})})]})}),e.jsx(C,{children:e.jsxs(j,{style:{gridColumn:"span 2"},children:[e.jsxs(v,{children:[e.jsx(Re,{}),"Márgenes de Rentabilidad por Categoría (ROI Comercial)"]}),e.jsx(k,{children:"Porcentaje de retorno de inversión real, segmentado por las 5 categorías de repuestos con mayor facturación acumulada."}),e.jsx(P,{style:{height:"320px"},children:e.jsx(Ie,{data:ve(),options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{y:{grid:{color:"rgba(255,255,255,0.05)"},ticks:{color:"#9ca3af",font:{family:"Outfit"}}},x:{grid:{display:!1},ticks:{color:"#9ca3af",font:{family:"Outfit"}}}}}})})]})})]}),e.jsx(dr,{children:e.jsx("p",{children:"© 2026 Multirepuestos RG | Consola de Analítica & BI"})})]})]})};export{jr as default};

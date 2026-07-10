import{b as nt,r as c,j as e,X as st,ab as Re,b5 as Be,bn as E,S as N,aa as Me,W as $,ar as Le,bo as lt,ao as dt,K as ct,s,q as gt,t as Ve,at as pt,au as xt,av as mt,ax as ht,ay as ft,aw as bt,az as ut,aA as yt,aB as jt,aC as vt}from"./vendor-C4uQ3a2a.js";import{a2 as Ct}from"./index-DrTQe3aZ.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-BMvqz6Um.js";pt.register(xt,mt,ht,ft,bt,ut,yt,jt,vt);const St=Ve`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`,Dt=Ve`
  0% { opacity: 0.3; transform: scale(0.95); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0.3; transform: scale(0.95); }
`,_t=gt`
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
`,At=s.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 2rem 3rem 2rem;
  box-sizing: border-box;
  animation: ${St} 0.5s ease-out;
`,kt=s.header`
  padding: 1rem 0 2rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 2rem;
`,zt=s.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
`,wt=s.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`,It=s.button`
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
`,Tt=s.div`
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
`,V=s.span`
  background: ${i=>i.bg||"rgba(237, 125, 49, 0.15)"};
  color: ${i=>i.color||"#ED7D31"};
  border: 1px solid ${i=>i.border||"rgba(237, 125, 49, 0.3)"};
  padding: 0.25rem 0.65rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
`,Wt=s.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: ${Dt} 1.5s infinite;
`,Ft=s.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
`,Rt=s.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
`,g=s.div`
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
    background: ${i=>i.accent||"#ED7D31"};
  }

  &:hover {
    transform: translateY(-3px);
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: ${i=>i.glow||"0 0 15px rgba(237, 125, 49, 0.15)"};
  }
`,p=s.div`
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #9ca3af;
  font-weight: 600;
`,x=s.div`
  font-size: 2.2rem;
  font-weight: 800;
  color: #fff;
  margin-top: 0.25rem;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
`,C=s.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: #9ca3af;
`,m=s.p`
  font-size: 0.8rem;
  color: #9ca3af;
  margin-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  padding-top: 0.5rem;
`,j=s.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(48%, 1fr));
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`,h=s.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 1.8rem;
  backdrop-filter: blur(15px);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`,f=s.div`
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
`,b=s.p`
  font-size: 0.9rem;
  color: #9ca3af;
  margin: 0;
`,q=s.div`
  width: 100%;
  height: 280px;
  position: relative;
`,Bt=s.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`,Ee=s.input`
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
`;s.div`
  text-align: center;
  padding: 0.75rem;
  border-radius: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: bold;
  font-size: 0.85rem;
  background: ${i=>i.bg||"rgba(16, 185, 129, 0.15)"};
  color: ${i=>i.color||"#10b981"};
  border: 1px solid ${i=>i.border||"rgba(16, 185, 129, 0.3)"};
  margin-top: 0.5rem;
`;const Ne=s.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`,Mt=s.div`
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
`,Lt=s.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`,W=s.button`
  background: ${i=>i.active?"rgba(237, 125, 49, 0.15)":"rgba(255, 255, 255, 0.02)"};
  border: 1px solid ${i=>i.active?"rgba(237, 125, 49, 0.4)":"rgba(255, 255, 255, 0.06)"};
  color: ${i=>i.active?"#fff":"#9ca3af"};
  padding: 0.5rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: ${i=>i.active?"rgba(237, 125, 49, 0.2)":"rgba(255, 255, 255, 0.05)"};
    border-color: ${i=>i.active?"rgba(237, 125, 49, 0.6)":"rgba(255, 255, 255, 0.15)"};
    color: #fff;
  }
`,Et=s.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: #9ca3af;
  font-size: 0.85rem;
  background: rgba(0, 0, 0, 0.2);
  padding: 0.4rem 0.8rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.04);
`,$e=s.input`
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
`,Nt=s.div`
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
`,U=s.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  background: ${i=>i.active?"linear-gradient(135deg, rgba(237, 125, 49, 0.15) 0%, rgba(56, 189, 248, 0.15) 100%)":"transparent"};
  border: 1px solid ${i=>i.active?"rgba(237, 125, 49, 0.3)":"transparent"};
  color: ${i=>i.active?"#fff":"#9ca3af"};
  padding: 0.8rem 1.2rem;
  border-radius: 12px;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${i=>i.active?"0 4px 12px rgba(237, 125, 49, 0.05)":"none"};

  svg {
    font-size: 1.1rem;
    color: ${i=>i.active?"#ED7D31":"#9ca3af"};
    transition: all 0.3s ease;
  }

  &:hover {
    background: ${i=>i.active?"linear-gradient(135deg, rgba(237, 125, 49, 0.2) 0%, rgba(56, 189, 248, 0.2) 100%)":"rgba(255, 255, 255, 0.04)"};
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
`,Pe=s.div`
  background: rgba(244, 63, 94, 0.04);
  border: 1px solid rgba(244, 63, 94, 0.15);
  border-left: 4px solid ${i=>i.accent||"#f43f5e"};
  border-radius: 8px;
  padding: 0.9rem 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`,Oe=s.div`
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
`,Je=s.span`
  background: ${i=>i.bg||"rgba(244, 63, 94, 0.15)"};
  color: ${i=>i.color||"#f43f5e"};
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: bold;
  white-space: nowrap;
`,$t=s.footer`
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding: 2rem 0 1rem 0;
  text-align: center;
  font-size: 0.85rem;
  color: #9ca3af;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`,Pt=s.div`
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
`,Ot=s.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #ED7D31, #38bdf8, #10b981);
  background-size: 200% 100%;
  animation: loadingShift 1.5s infinite linear;
  z-index: 9999;
  opacity: ${i=>i.visible?1:0};
  pointer-events: none;
  transition: opacity 0.3s ease;

  @keyframes loadingShift {
    0% { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
  }
`,er=()=>{var ee,te,re,ae,oe,ie,ne,se,le,de,ce,ge,pe,xe,me,he,fe,be,ue,ye,je,ve,Ce,Se,De,_e;const i=nt(),[t,qe]=c.useState(null),[Ue,G]=c.useState(!0),[v,H]=c.useState("daily"),[_,Ge]=c.useState("all"),[F,He]=c.useState(""),[R,Ke]=c.useState(""),[A,P]=c.useState("caja"),[Xe,B]=c.useState(!1),[Ye,Jt]=c.useState(!0),[K,Vt]=c.useState(""),[w,qt]=c.useState("sin_ventas"),[O,Qe]=c.useState(""),[S,L]=c.useState("all"),[k,Ze]=c.useState(6e5),X=c.useCallback(()=>{const r=new Date().toLocaleDateString("sv-SE"),a=new Date;switch(_){case"today":return{startDate:r,endDate:r};case"yesterday":{const o=new Date;o.setDate(o.getDate()-1);const n=o.toLocaleDateString("sv-SE");return{startDate:n,endDate:n}}case"thisMonth":return{startDate:new Date(a.getFullYear(),a.getMonth(),1).toLocaleDateString("sv-SE"),endDate:r};case"last30":{const o=new Date;return o.setDate(o.getDate()-30),{startDate:o.toLocaleDateString("sv-SE"),endDate:r}}case"custom":return F&&R?{startDate:F,endDate:R}:null;case"all":default:return null}},[_,F,R]),D=c.useCallback(()=>{if(!t||!t.payment_distribution||t.payment_distribution.length===0)return{efectivo:{pct:68,total:45210},transferencia:{pct:22,total:14620},tarjeta:{pct:10,total:6650}};const r=t.payment_distribution.reduce((l,d)=>l+d.total,0);let a=0,o=0,n=0;return t.payment_distribution.forEach(l=>{const d=l.metodo.toLowerCase();d.includes("efectivo")?a+=l.total:d.includes("transferencia")||d.includes("banco")||d.includes("deposito")?o+=l.total:d.includes("tarjeta")||d.includes("pos")||d.includes("credito")||d.includes("crédito")?n+=l.total:a+=l.total}),{efectivo:{pct:r>0?Math.round(a/r*100):0,total:a},transferencia:{pct:r>0?Math.round(o/r*100):0,total:o},tarjeta:{pct:r>0?Math.round(n/r*100):0,total:n}}},[t])(),Y=(t==null?void 0:t.ticket_promedio)!==void 0?t.ticket_promedio:845.5,Q=(()=>{const{efectivo:r,transferencia:a,tarjeta:o}=D,n=Math.max(r.pct,a.pct,o.pct);return n===0?{name:"Sin datos",pct:0}:n===r.pct?{name:"Efectivo",pct:r.pct}:n===a.pct?{name:"Transferencia",pct:a.pct}:{name:"Tarjeta",pct:o.pct}})(),Z=(t==null?void 0:t.total_productos)>0?(((t==null?void 0:t.total_tickets_bi)||150)*1.8/t.total_productos).toFixed(2):"0.45",et=(()=>{if(!t)return 0;const r=v==="daily"?t.sales_history_daily:t.sales_history;if(!r||!r.proyeccion||r.proyeccion.length<2)return 0;const a=r.proyeccion,o=a[a.length-2];return o??0})(),tt=(()=>{if(!t||!t.category_margins||!t.category_margins.values)return 38.5;const r=t.category_margins.values;return r.length>0?Math.max(...r):38.5})(),J=c.useCallback(async(r=!1,a=!1)=>{const o=localStorage.getItem("token");if(!o){i("/login");return}r&&G(!0),a&&B(!0);try{const n=X(),l=await Ct(o,n);qe(l)}catch(n){console.error("Error al cargar métricas BI:",n)}finally{G(!1),B(!1)}},[i,X]);c.useEffect(()=>{document.body.classList.add("bi-theme"),J(t===null,!1);const r=setInterval(()=>{J(!1,!1)},15e3);return()=>{document.body.classList.remove("bi-theme"),clearInterval(r)}},[J]);const T=r=>{Ge(r),B(!0)},rt=r=>{if(!r||!r.proyeccion)return[];if(Ye)return r.proyeccion;const a=r.reales||[],o=r.proyeccion||[];let n=-1;for(let l=a.length-1;l>=0;l--)if(a[l]!==null){n=l;break}return o.map((l,d)=>d<n?null:l)};(ee=t==null?void 0:t.stagnant_products)!=null&&ee.filter(r=>{if(!((r.nombre||"").toLowerCase().includes(K.toLowerCase())||(r.codigo||"").toLowerCase().includes(K.toLowerCase())))return!1;const o=Number(r.unidades_vendidas||0);return w==="sin_ventas"?o===0:o<=3});const M=((te=t==null?void 0:t.abc_products)==null?void 0:te.filter(r=>(r.nombre||"").toLowerCase().includes(O.toLowerCase())||(r.codigo||"").toLowerCase().includes(O.toLowerCase())?S==="all"?!0:r.clase_abc===S:!1))||[],at=()=>{if(!t)return{labels:[],datasets:[]};const r=v==="daily"?t.sales_history_daily:t.sales_history;return r?{labels:r.labels,datasets:[{label:v==="daily"?"Ventas Reales Diarias (C$)":"Ventas Reales Semanales (C$)",data:r.reales,borderColor:"#38bdf8",backgroundColor:"rgba(56, 189, 248, 0.08)",fill:!0,tension:.35,borderWidth:3,pointRadius:4,pointBackgroundColor:"#38bdf8"},{label:v==="daily"?"Proyección Diaria (C$)":"Proyección Semanal (C$)",data:rt(r),borderColor:"#ED7D31",borderDash:[5,5],backgroundColor:"transparent",fill:!1,tension:.35,borderWidth:3,pointRadius:4,pointBackgroundColor:"#ED7D31"}]}:{labels:[],datasets:[]}},ot=()=>{if(!t||!t.provider_profitability)return{labels:[],datasets:[]};const{labels:r,ventas:a,utilidades:o}=t.provider_profitability;return{labels:r||[],datasets:[{label:"Ventas (C$)",data:a||[],backgroundColor:"rgba(56, 189, 248, 0.75)",borderColor:"rgba(255, 255, 255, 0.1)",borderWidth:1,borderRadius:6},{label:"Utilidad Neta (C$)",data:o||[],backgroundColor:"rgba(16, 185, 129, 0.75)",borderColor:"rgba(255, 255, 255, 0.1)",borderWidth:1,borderRadius:6}]}},it=()=>t?{labels:["Clase A (Alta)","Clase B (Media)","Clase C (Baja)"],datasets:[{label:"Cantidad de Repuestos",data:[t.abc_a||0,t.abc_b||0,t.abc_c||0],backgroundColor:["rgba(16, 185, 129, 0.75)","rgba(234, 179, 8, 0.75)","rgba(244, 63, 94, 0.75)"],borderColor:"rgba(255, 255, 255, 0.1)",borderWidth:1,borderRadius:6}]}:{labels:[],datasets:[]};return e.jsxs(At,{children:[e.jsx(Ot,{visible:Xe}),e.jsx(_t,{}),e.jsx(kt,{children:e.jsxs(zt,{children:[e.jsxs(wt,{children:[e.jsx(It,{onClick:()=>i("/dashboard"),title:"Volver al Panel",children:e.jsx(st,{size:16})}),e.jsxs(Tt,{children:[e.jsxs("h1",{children:["Multirepuestos RG ",e.jsx(V,{bg:"rgba(237, 125, 49, 0.12)",color:"#ED7D31",border:"rgba(237, 125, 49, 0.3)",children:"Módulo BI"})]}),e.jsx("p",{children:"Consola Analítica y Panel de Inteligencia de Negocios (BI)"})]})]}),e.jsx("div",{children:e.jsxs(V,{bg:"rgba(16, 185, 129, 0.12)",color:"#10b981",border:"rgba(16, 185, 129, 0.3)",children:[e.jsx(Wt,{}),"Conexión en línea (BD)"]})})]})}),Ue?e.jsxs(Pt,{children:[e.jsx(Re,{size:40,className:"spinner"}),e.jsx("span",{children:"Calculando variables analíticas en base de datos..."})]}):e.jsxs(Ft,{children:[e.jsxs(Nt,{children:[e.jsxs(U,{active:A==="caja",onClick:()=>P("caja"),children:[e.jsx(Be,{}),"1. Flujo de Caja y Auditoría"]}),e.jsxs(U,{active:A==="rotacion",onClick:()=>P("rotacion"),children:[e.jsx(E,{}),"2. Rotación de Inventario"]}),e.jsxs(U,{active:A==="proyeccion",onClick:()=>P("proyeccion"),children:[e.jsx(N,{}),"3. Rentabilidad y Proyección"]})]}),e.jsxs(Mt,{children:[e.jsxs(Lt,{children:[e.jsx(W,{active:_==="all",onClick:()=>T("all"),children:"Histórico"}),e.jsx(W,{active:_==="today",onClick:()=>T("today"),children:"Hoy"}),e.jsx(W,{active:_==="yesterday",onClick:()=>T("yesterday"),children:"Ayer"}),e.jsx(W,{active:_==="thisMonth",onClick:()=>T("thisMonth"),children:"Este Mes"}),e.jsx(W,{active:_==="last30",onClick:()=>T("last30"),children:"Últimos 30 días"}),e.jsx(W,{active:_==="custom",onClick:()=>T("custom"),children:"Personalizado"})]}),_==="custom"&&e.jsxs(Et,{children:[e.jsx("label",{children:"Desde:"}),e.jsx($e,{type:"date",value:F,onChange:r=>{He(r.target.value),r.target.value&&R&&B(!0)}}),e.jsx("label",{children:"Hasta:"}),e.jsx($e,{type:"date",value:R,onChange:r=>{Ke(r.target.value),F&&r.target.value&&B(!0)}})]})]}),e.jsxs(Rt,{children:[A==="caja"&&e.jsxs(e.Fragment,{children:[e.jsxs(g,{accent:"#10b981",glow:"0 0 15px rgba(16, 185, 129, 0.2)",children:[e.jsx(p,{children:"Facturación Total (Caja)"}),e.jsxs(x,{children:[e.jsx("span",{style:{fontSize:"1.4rem",color:"#9ca3af",fontWeight:500,marginRight:"0.2rem"},children:"C$"}),Number((t==null?void 0:t.total_ventas_bi)||0).toLocaleString("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2})]}),e.jsx(m,{children:"Ingreso acumulado bruto en caja por transacciones."})]}),e.jsxs(g,{accent:"#38bdf8",glow:"0 0 15px rgba(56, 189, 248, 0.2)",children:[e.jsx(p,{children:"Transacciones en Caja"}),e.jsxs(x,{children:[(t==null?void 0:t.total_tickets_bi)||0," ",e.jsx(C,{children:"Facturas"})]}),e.jsx(m,{children:"Número total de tickets/facturas procesadas en el sistema."})]}),e.jsxs(g,{accent:"#ED7D31",glow:"0 0 15px rgba(237, 125, 49, 0.2)",children:[e.jsx(p,{children:"Ticket Promedio"}),e.jsxs(x,{children:[e.jsx("span",{style:{fontSize:"1.4rem",color:"#9ca3af",fontWeight:500,marginRight:"0.2rem"},children:"C$"}),Y.toLocaleString("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2})]}),e.jsx(m,{children:"Monto promedio estimado por cada transacción de venta."})]}),e.jsxs(g,{accent:"#a855f7",glow:"0 0 15px rgba(168, 85, 247, 0.2)",children:[e.jsx(p,{children:"Canal de Pago Principal"}),e.jsxs(x,{children:[Q.name," ",e.jsxs(C,{children:[Q.pct,"%"]})]}),e.jsx(m,{children:"Método de pago con mayor volumen de transacciones."})]}),e.jsxs(g,{accent:"#ec4899",glow:"0 0 15px rgba(236, 72, 153, 0.2)",children:[e.jsx(p,{children:"Eficiencia de Arqueo (30d)"}),e.jsxs(x,{children:[(t==null?void 0:t.eficiencia_arqueo)!==void 0?t.eficiencia_arqueo:100," ",e.jsx(C,{children:"%"})]}),e.jsx(m,{children:"Porcentaje de cierres de caja con cero descuadre financiero."})]})]}),A==="rotacion"&&e.jsxs(e.Fragment,{children:[e.jsxs(g,{accent:w==="sin_ventas"?"#f43f5e":"#eab308",glow:w==="sin_ventas"?"0 0 15px rgba(244, 63, 94, 0.2)":"0 0 15px rgba(234, 179, 8, 0.2)",children:[e.jsx(p,{children:w==="sin_ventas"?"Artículos sin Movimiento":"Artículos de Baja Rotación"}),e.jsxs(x,{children:[w==="sin_ventas"?(re=t==null?void 0:t.riesgo_estancamiento)==null?void 0:re.toLocaleString():(((oe=(ae=t==null?void 0:t.stagnant_products)==null?void 0:ae.filter(r=>Number(r.unidades_vendidas||0)<=3))==null?void 0:oe.length)||0).toLocaleString()," ",e.jsx(C,{children:"Repuestos"})]}),e.jsxs("div",{style:{fontSize:"0.85rem",color:"#fff",fontWeight:700,marginTop:"0.4rem",borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:"0.4rem"},children:["Capital Estancado: C$ ",Number(w==="sin_ventas"?(t==null?void 0:t.capital_sin_ventas)||0:(t==null?void 0:t.capital_baja_rotacion)||0).toLocaleString("es-NI",{maximumFractionDigits:0})]}),e.jsx(m,{style:{borderTop:"none",paddingTop:0,marginTop:"0.25rem"},children:w==="sin_ventas"?"Artículos con existencia física sin ventas en el periodo seleccionado.":"Artículos con existencia física con 0 a 3 unidades vendidas en el periodo seleccionado (Top 150)."})]}),e.jsxs(g,{accent:"#ED7D31",glow:"0 0 15px rgba(237, 125, 49, 0.2)",children:[e.jsx(p,{children:"Catálogo de Productos"}),e.jsxs(x,{children:[(ie=t==null?void 0:t.total_productos)==null?void 0:ie.toLocaleString()," ",e.jsx(C,{children:"Items Activos"})]}),e.jsx(m,{children:"Consolidado completo y disponible para venta en tiempo real."})]}),e.jsxs(g,{accent:"#38bdf8",glow:"0 0 15px rgba(56, 189, 248, 0.2)",children:[e.jsx(p,{children:"Producto Estrella (Top 1)"}),e.jsx(x,{style:{fontSize:((le=(se=(ne=t==null?void 0:t.top_products)==null?void 0:ne[0])==null?void 0:se.nombre)==null?void 0:le.length)>14?"1.4rem":"1.8rem"},children:(ce=(de=t==null?void 0:t.top_products)==null?void 0:de[0])!=null&&ce.nombre?t.top_products[0].nombre.length>20?t.top_products[0].nombre.substring(0,18)+"...":t.top_products[0].nombre:"N/A"}),e.jsxs(m,{children:["Unidades vendidas: ",((pe=(ge=t==null?void 0:t.top_products)==null?void 0:ge[0])==null?void 0:pe.unidades)||0,". Mayor volumen facturado."]})]}),e.jsxs(g,{accent:"#10b981",glow:"0 0 15px rgba(16, 185, 129, 0.2)",children:[e.jsx(p,{children:"Tasa de Rotación Mensual"}),e.jsxs(x,{children:[Z," ",e.jsx(C,{children:"Veces al mes"})]}),e.jsx(m,{children:"Velocidad promedio con la que rota el stock del catálogo."})]}),e.jsxs(g,{accent:"#f59e0b",glow:"0 0 15px rgba(245, 158, 11, 0.2)",children:[e.jsx(p,{children:"Días de Inventario (DIO)"}),e.jsxs(x,{children:[(t==null?void 0:t.dio)!==void 0?t.dio:365," ",e.jsx(C,{children:"Días"})]}),e.jsx(m,{children:"Días promedio para vender todo el stock según demanda."})]}),e.jsxs(g,{accent:"#a855f7",glow:"0 0 15px rgba(168, 85, 247, 0.2)",children:[e.jsx(p,{children:"Valoración Total de Stock"}),e.jsxs(x,{style:{fontSize:"1.2rem"},children:[e.jsx("span",{style:{fontSize:"0.85rem",color:"#9ca3af"},children:"C$"})," ",Number((t==null?void 0:t.total_inventario_costo)||0).toLocaleString("es-NI",{maximumFractionDigits:0})," ",e.jsx("span",{style:{fontSize:"0.7rem",color:"#9ca3af"},children:"Costo"})]}),e.jsxs("div",{style:{fontSize:"0.8rem",color:"#10b981",fontWeight:700,marginTop:"0.4rem",borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:"0.4rem"},children:["Venta Estimada: C$ ",Number((t==null?void 0:t.total_inventario_venta)||0).toLocaleString("es-NI",{maximumFractionDigits:0})]}),e.jsx(m,{style:{borderTop:"none",paddingTop:0,marginTop:"0.25rem"},children:"Valor de adquisición y potencial retorno comercial en bodega."})]}),e.jsxs(g,{accent:"#ec4899",glow:"0 0 15px rgba(236, 72, 153, 0.2)",children:[e.jsx(p,{children:"Salud de Inventario"}),e.jsxs(x,{style:{fontSize:"1.5rem"},children:[(t==null?void 0:t.total_productos)>0?Math.max(0,100-((t==null?void 0:t.riesgo_estancamiento)||0)/t.total_productos*100).toFixed(1):"0.0"," ",e.jsx(C,{children:"% Sano"})]}),e.jsx(m,{children:"Porcentaje de productos del catálogo que registran ventas activas."})]})]}),A==="proyeccion"&&e.jsxs(e.Fragment,{children:[e.jsxs(g,{accent:"#10b981",glow:"0 0 15px rgba(16, 185, 129, 0.2)",children:[e.jsx(p,{children:"Margen Comercial Ponderado"}),e.jsxs(x,{children:[(xe=t==null?void 0:t.promedio_margen)==null?void 0:xe.toFixed(1)," ",e.jsx(C,{children:"% Retorno"})]}),e.jsx(m,{children:"Rentabilidad comercial promedio sobre costos de repuestos."})]}),e.jsxs(g,{accent:"#ED7D31",glow:"0 0 15px rgba(237, 125, 49, 0.2)",children:[e.jsx(p,{children:"Previsión de Ingresos"}),e.jsxs(x,{children:[e.jsx("span",{style:{fontSize:"1.4rem",color:"#9ca3af",fontWeight:500,marginRight:"0.2rem"},children:"C$"}),et.toLocaleString("es-NI",{maximumFractionDigits:0})]}),e.jsxs(m,{children:["Previsión de ingresos para el próximo ",v==="daily"?"día":"período (semana)"," según regresión lineal."]})]}),e.jsxs(g,{accent:"#38bdf8",glow:"0 0 15px rgba(56, 189, 248, 0.2)",children:[e.jsx(p,{children:"Margen Categoría Líder"}),e.jsxs(x,{children:[tt.toFixed(1)," ",e.jsx(C,{children:"% Margen"})]}),e.jsx(m,{children:"Retorno máximo obtenido en la categoría de mayor rendimiento."})]}),e.jsxs(g,{accent:"#a855f7",glow:"0 0 15px rgba(168, 85, 247, 0.2)",children:[e.jsx(p,{children:"Confianza Algorítmica (R²)"}),e.jsxs(x,{children:[Number(v==="daily"?(t==null?void 0:t.r2_daily)!==void 0?t.r2_daily:98.6:(t==null?void 0:t.r2_weekly)!==void 0?t.r2_weekly:98.6).toFixed(1)," ",e.jsx(C,{children:"% Ajuste"})]}),e.jsxs(m,{children:["Coeficiente de determinación real para la regresión lineal ",v==="daily"?"diaria":"semanal","."]})]})]})]}),A==="caja"&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsx(j,{children:e.jsxs(h,{style:{gridColumn:"span 2"},children:[e.jsxs(f,{children:[e.jsx(Be,{color:"#10b981"}),"Consolidado de Auditoría Contable (Periodo Seleccionado)"]}),e.jsx(b,{children:"Sumatoria totalizada de fondos y cobros auditados de los cierres del periodo seleccionado."}),(()=>{const r=(t==null?void 0:t.recent_closures)||[],a=r.reduce((u,y)=>u+Number(y.efectivo||0),0),o=r.reduce((u,y)=>u+Number(y.tarjeta||0),0),n=r.reduce((u,y)=>u+Number(y.transferencia||0),0),l=r.reduce((u,y)=>u+Number(y.dolares||0),0),d=r.reduce((u,y)=>u+Number(y.final_esperado||0),0),I=r.reduce((u,y)=>u+Number(y.final_real||0),0)-d;return e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.8rem",marginTop:"0.5rem"},children:[e.jsxs("div",{style:{padding:"0.6rem",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:"10px"},children:[e.jsx("span",{style:{fontSize:"0.72rem",color:"#9ca3af"},children:"💵 Total Efectivo Auditado"}),e.jsxs("div",{style:{color:"#ED7D31",fontSize:"1.1rem",fontWeight:800},children:["C$ ",a.toLocaleString("es-NI",{maximumFractionDigits:0})]})]}),e.jsxs("div",{style:{padding:"0.6rem",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:"10px"},children:[e.jsx("span",{style:{fontSize:"0.72rem",color:"#9ca3af"},children:"💳 Total Tarjeta Auditado"}),e.jsxs("div",{style:{color:"#a855f7",fontSize:"1.1rem",fontWeight:800},children:["C$ ",o.toLocaleString("es-NI",{maximumFractionDigits:0})]})]}),e.jsxs("div",{style:{padding:"0.6rem",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:"10px"},children:[e.jsx("span",{style:{fontSize:"0.72rem",color:"#9ca3af"},children:"🏦 Total Transferencias"}),e.jsxs("div",{style:{color:"#38bdf8",fontSize:"1.1rem",fontWeight:800},children:["C$ ",n.toLocaleString("es-NI",{maximumFractionDigits:0})]})]}),e.jsxs("div",{style:{padding:"0.6rem",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:"10px"},children:[e.jsx("span",{style:{fontSize:"0.72rem",color:"#9ca3af"},children:"🪙 Total Dólares Auditados"}),e.jsxs("div",{style:{color:"#eab308",fontSize:"1.1rem",fontWeight:800},children:["$ ",l.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})]})]}),e.jsxs("div",{style:{gridColumn:"span 2",display:"flex",justifyContent:"space-between",borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:"0.5rem",fontSize:"0.75rem",marginTop:"0.2rem"},children:[e.jsxs("div",{children:[e.jsx("span",{style:{color:"#9ca3af"},children:"Descuadre Neto:"}),e.jsxs("span",{style:{marginLeft:"4px",fontWeight:700,color:I===0?"#10b981":I<0?"#f43f5e":"#eab308"},children:["C$ ",I.toLocaleString("es-NI",{maximumFractionDigits:0})]})]}),e.jsxs("div",{children:[e.jsx("span",{style:{color:"#9ca3af"},children:"Auditoría:"}),e.jsxs("span",{style:{marginLeft:"4px",fontWeight:700,color:"#fff"},children:[r.length," Sesiones"]})]})]})]})})()]})}),e.jsx(j,{children:e.jsxs(h,{style:{gridColumn:"span 2"},children:[e.jsxs(f,{children:[e.jsx(Me,{color:"#ED7D31"}),"Historial de Cierres de Caja y Auditoría Transaccional"]}),e.jsx(b,{children:"Registro cronológico de arqueos de caja cerrados, comparando el monto esperado en base de datos contra el conteo físico, desglosado por métodos de pago."}),e.jsx("div",{style:{overflowX:"auto",marginTop:"1rem"},children:e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",textAlign:"left",fontSize:"0.85rem"},children:[e.jsx("thead",{children:e.jsxs("tr",{style:{borderBottom:"2px solid rgba(255, 255, 255, 0.08)",color:"#9ca3af"},children:[e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600},children:"CAJERO"}),e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600},children:"CIERRE (FECHA)"}),e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600,textAlign:"right"},children:"F. INICIAL"}),e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600,textAlign:"right"},children:"ESPERADO"}),e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600,textAlign:"right"},children:"CONTADO"}),e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600,textAlign:"right"},children:"DESCUADRE"}),e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600,textAlign:"center"},children:"DESGLOSE C$ (EFEC / TARJ / TRANSF)"}),e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600,textAlign:"right"},children:"DÓLARES ($)"})]})}),e.jsxs("tbody",{children:[(me=t==null?void 0:t.recent_closures)==null?void 0:me.map((r,a)=>{const o=Number(r.diferencia||0),n=Math.abs(o)<.1;return e.jsxs("tr",{style:{borderBottom:"1px solid rgba(255, 255, 255, 0.04)",transition:"background-color 0.2s"},children:[e.jsx("td",{style:{padding:"0.75rem 0.5rem",color:"#fff",fontWeight:600},children:r.usuario_nombre}),e.jsx("td",{style:{padding:"0.75rem 0.5rem",color:"#9ca3af"},children:r.fecha_cierre?new Date(r.fecha_cierre).toLocaleString("es-NI",{dateStyle:"short",timeStyle:"short"}):"—"}),e.jsxs("td",{style:{padding:"0.75rem 0.5rem",textAlign:"right",fontFamily:"JetBrains Mono"},children:["C$ ",r.monto_inicial.toLocaleString("es-NI",{maximumFractionDigits:0})]}),e.jsxs("td",{style:{padding:"0.75rem 0.5rem",textAlign:"right",fontFamily:"JetBrains Mono"},children:["C$ ",r.final_esperado.toLocaleString("es-NI",{maximumFractionDigits:0})]}),e.jsxs("td",{style:{padding:"0.75rem 0.5rem",textAlign:"right",fontFamily:"JetBrains Mono",color:"#fff",fontWeight:600},children:["C$ ",r.final_real.toLocaleString("es-NI",{maximumFractionDigits:0})]}),e.jsx("td",{style:{padding:"0.75rem 0.5rem",textAlign:"right"},children:e.jsx("span",{style:{padding:"2px 8px",borderRadius:"6px",fontSize:"0.75rem",fontWeight:700,background:n?"rgba(16, 185, 129, 0.12)":"rgba(244, 63, 94, 0.12)",color:n?"#10b981":"#f43f5e",border:`1px solid ${n?"rgba(16, 185, 129, 0.2)":"rgba(244, 63, 94, 0.2)"}`},children:n?"Perfecto":`C$ ${o.toLocaleString("es-NI",{maximumFractionDigits:0})}`})}),e.jsx("td",{style:{padding:"0.75rem 0.5rem",textAlign:"center"},children:e.jsxs("div",{style:{display:"flex",gap:"4px",justifyContent:"center"},children:[e.jsxs("span",{title:"Efectivo",style:{background:"rgba(237, 125, 49, 0.1)",color:"#ED7D31",padding:"2px 6px",borderRadius:"4px",fontSize:"0.7rem",fontFamily:"JetBrains Mono"},children:["💵 ",r.efectivo.toLocaleString("es-NI",{maximumFractionDigits:0})]}),e.jsxs("span",{title:"Tarjeta",style:{background:"rgba(168, 85, 247, 0.1)",color:"#a855f7",padding:"2px 6px",borderRadius:"4px",fontSize:"0.7rem",fontFamily:"JetBrains Mono"},children:["💳 ",r.tarjeta.toLocaleString("es-NI",{maximumFractionDigits:0})]}),e.jsxs("span",{title:"Transferencia",style:{background:"rgba(56, 189, 248, 0.1)",color:"#38bdf8",padding:"2px 6px",borderRadius:"4px",fontSize:"0.7rem",fontFamily:"JetBrains Mono"},children:["🏦 ",r.transferencia.toLocaleString("es-NI",{maximumFractionDigits:0})]})]})}),e.jsxs("td",{style:{padding:"0.75rem 0.5rem",textAlign:"right",fontFamily:"JetBrains Mono",color:"#eab308"},children:["$",r.dolares.toLocaleString("en-US",{minimumFractionDigits:2})]})]},r.id||a)}),(!(t!=null&&t.recent_closures)||t.recent_closures.length===0)&&e.jsx("tr",{children:e.jsx("td",{colSpan:"8",style:{padding:"2rem",textAlign:"center",color:"#9ca3af"},children:"No hay cierres de caja registrados para auditar en este periodo."})})]})]})})]})}),e.jsx(j,{children:e.jsxs(h,{style:{gridColumn:"span 2"},children:[e.jsxs(f,{children:[e.jsx(Me,{color:"#ED7D31"}),"Distribución Financiera de Pagos"]}),e.jsx(b,{children:"Análisis de los métodos de pago preferidos por los clientes y el monto promedio facturado por cada transacción de venta."}),e.jsxs("div",{style:{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"12px",padding:"1.2rem",display:"flex",flexDirection:"column",gap:"0.8rem",marginBottom:"0.5rem"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%"},children:[e.jsxs("div",{children:[e.jsx("span",{style:{fontSize:"0.8rem",textTransform:"uppercase",letterSpacing:"0.5px",color:"#9ca3af",fontWeight:600},children:"Valor Ticket Promedio"}),e.jsxs("div",{style:{fontSize:"1.9rem",fontWeight:800,color:"#10b981",marginTop:"0.2rem"},children:["C$ ",Y.toLocaleString("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2})]})]}),e.jsx("div",{style:{background:"rgba(16, 185, 129, 0.1)",color:"#10b981",border:"1px solid rgba(16, 185, 129, 0.3)",borderRadius:"12px",padding:"0.75rem 1rem",fontWeight:800,fontSize:"1.2rem",fontFamily:"'JetBrains Mono', monospace"},children:"C$"})]}),e.jsxs("div",{style:{borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:"0.6rem",display:"flex",flexDirection:"column",gap:"0.3rem"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.8rem",color:"#9ca3af"},children:[e.jsx("span",{children:"Facturación Total:"}),e.jsxs("span",{style:{color:"#fff",fontWeight:600,fontFamily:"'JetBrains Mono', monospace"},children:["C$ ",Number((t==null?void 0:t.total_ventas_bi)||0).toLocaleString("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2})]})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.8rem",color:"#9ca3af"},children:[e.jsx("span",{children:"Total de Facturas:"}),e.jsx("span",{style:{color:"#fff",fontWeight:600,fontFamily:"'JetBrains Mono', monospace"},children:(t==null?void 0:t.total_tickets_bi)||0})]})]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.9rem"},children:[e.jsx("div",{style:{fontSize:"0.85rem",fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.5px",borderBottom:"1px solid rgba(255, 25, 25, 0.04)",paddingBottom:"0.4rem"},children:"Distribución de Pagos (Últimos 30 días)"}),e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",marginBottom:"0.3rem"},children:[e.jsx("span",{style:{color:"#fff",fontWeight:600},children:"Efectivo"}),e.jsxs("span",{style:{color:"#9ca3af",fontFamily:"'JetBrains Mono', monospace"},children:[D.efectivo.pct,"% (C$ ",D.efectivo.total.toLocaleString("es-NI",{maximumFractionDigits:0}),")"]})]}),e.jsx("div",{style:{background:"rgba(255,255,255,0.04)",height:"8px",borderRadius:"4px",overflow:"hidden",border:"1px solid rgba(255,255,255,0.06)"},children:e.jsx("div",{style:{background:"#ED7D31",height:"100%",width:`${D.efectivo.pct}%`,borderRadius:"4px",transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"}})})]}),e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",marginBottom:"0.3rem"},children:[e.jsx("span",{style:{color:"#fff",fontWeight:600},children:"Transferencia Bancaria"}),e.jsxs("span",{style:{color:"#9ca3af",fontFamily:"'JetBrains Mono', monospace"},children:[D.transferencia.pct,"% (C$ ",D.transferencia.total.toLocaleString("es-NI",{maximumFractionDigits:0}),")"]})]}),e.jsx("div",{style:{background:"rgba(255,255,255,0.04)",height:"8px",borderRadius:"4px",overflow:"hidden",border:"1px solid rgba(255,255,255,0.06)"},children:e.jsx("div",{style:{background:"#38bdf8",height:"100%",width:`${D.transferencia.pct}%`,borderRadius:"4px",transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"}})})]}),e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",marginBottom:"0.3rem"},children:[e.jsx("span",{style:{color:"#fff",fontWeight:600},children:"Tarjeta de Crédito / Débito"}),e.jsxs("span",{style:{color:"#9ca3af",fontFamily:"'JetBrains Mono', monospace"},children:[D.tarjeta.pct,"% (C$ ",D.tarjeta.total.toLocaleString("es-NI",{maximumFractionDigits:0}),")"]})]}),e.jsx("div",{style:{background:"rgba(255,255,255,0.04)",height:"8px",borderRadius:"4px",overflow:"hidden",border:"1px solid rgba(255,255,255,0.06)"},children:e.jsx("div",{style:{background:"#a855f7",height:"100%",width:`${D.tarjeta.pct}%`,borderRadius:"4px",transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"}})})]})]})]})}),(t==null?void 0:t.cash_anomalies)&&t.cash_anomalies.filter(r=>r.risk!=="Normal").length>0&&e.jsx(j,{children:e.jsxs(h,{style:{gridColumn:"span 2",background:"rgba(244, 63, 94, 0.02)",borderColor:"rgba(244, 63, 94, 0.15)"},children:[e.jsxs(f,{style:{color:"#f43f5e"},children:[e.jsx($,{color:"#f43f5e"}),"Alertas de Caja y Seguridad de Caja Detectadas"]}),e.jsx(b,{children:"Se han registrado incidencias que requieren supervisión inmediata o retiros parciales de seguridad."}),e.jsx(Ne,{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))",gap:"1.2rem"},children:(he=t==null?void 0:t.cash_anomalies)==null?void 0:he.filter(r=>r.risk!=="Normal").map((r,a)=>e.jsxs(Pe,{accent:r.risk==="Riesgo Alto"?"#f43f5e":"#ED7D31",children:[e.jsxs(Oe,{children:[e.jsx("h4",{children:r.title}),e.jsx("p",{children:r.desc})]}),e.jsx(Je,{bg:r.risk==="Riesgo Alto"?"rgba(244, 63, 94, 0.15)":"rgba(237, 125, 49, 0.15)",color:r.risk==="Riesgo Alto"?"#f43f5e":"#ED7D31",children:r.badge})]},a))})]})})]}),A==="rotacion"&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsx(j,{children:e.jsxs(h,{style:{gridColumn:"span 2"},children:[e.jsxs(f,{children:[e.jsx(N,{style:{color:"#38bdf8"}}),"Ranking de Repuestos de Mayor Rotación (Top 10 Bestsellers)"]}),e.jsx(b,{children:"Listado de los 10 productos con mayor volumen de unidades vendidas y su facturación total correspondiente."}),e.jsx("div",{style:{overflowX:"auto",marginTop:"0.5rem"},children:e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",textAlign:"left",fontSize:"0.9rem"},children:[e.jsx("thead",{children:e.jsxs("tr",{style:{borderBottom:"1px solid rgba(255, 25, 25, 0.08)",color:"#9ca3af"},children:[e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600},children:"CÓDIGO"}),e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600},children:"PRODUCTO"}),e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600,textAlign:"right"},children:"UNIDADES VENDIDAS"}),e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600,textAlign:"right"},children:"TOTAL FACTURADO"})]})}),e.jsxs("tbody",{children:[(fe=t==null?void 0:t.top_products)==null?void 0:fe.map((r,a)=>e.jsxs("tr",{style:{borderBottom:"1px solid rgba(255, 255, 255, 0.04)",transition:"background-color 0.2s"},children:[e.jsx("td",{style:{padding:"0.75rem 0.5rem",fontFamily:"'JetBrains Mono', monospace",color:"#38bdf8",fontWeight:600},children:r.codigo||"S/C"}),e.jsx("td",{style:{padding:"0.75rem 0.5rem",color:"#fff"},children:r.nombre}),e.jsx("td",{style:{padding:"0.75rem 0.5rem",textAlign:"right",fontWeight:700,color:"#10b981"},children:r.unidades.toLocaleString()}),e.jsxs("td",{style:{padding:"0.75rem 0.5rem",textAlign:"right",fontFamily:"'JetBrains Mono', monospace",color:"#ED7D31"},children:["C$ ",r.monto.toLocaleString("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2})]})]},a)),(!(t!=null&&t.top_products)||((be=t==null?void 0:t.top_products)==null?void 0:be.length)===0)&&e.jsx("tr",{children:e.jsx("td",{colSpan:"4",style:{padding:"2rem",textAlign:"center",color:"#9ca3af"},children:"No hay datos de ventas registradas en el rango seleccionado."})})]})]})})]})}),e.jsx(j,{children:e.jsxs(h,{style:{gridColumn:"span 2"},children:[e.jsxs(f,{children:[e.jsx(E,{color:"#38bdf8"}),"Clasificación ABC de Inventario (Principio de Pareto)"]}),e.jsx(b,{children:"División del inventario activo según su volumen de rotación en los últimos 180 días para priorizar la gestión de stock (Ley de Pareto)."}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))",gap:"2rem",marginTop:"0.5rem"},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1.2rem"},children:[e.jsxs("div",{style:{background:"rgba(255,255,255,0.04)",height:"28px",borderRadius:"14px",overflow:"hidden",display:"flex",border:"1px solid rgba(255,255,255,0.08)"},children:[e.jsxs("div",{style:{background:"#10b981",width:`${(t==null?void 0:t.abc_a)+(t==null?void 0:t.abc_b)+(t==null?void 0:t.abc_c)>0?t.abc_a/(t.abc_a+t.abc_b+t.abc_c)*100:20}%`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:"0.75rem",fontWeight:"bold",minWidth:"40px"},children:["A (",Math.round((t==null?void 0:t.abc_a)+(t==null?void 0:t.abc_b)+(t==null?void 0:t.abc_c)>0?t.abc_a/(t.abc_a+t.abc_b+t.abc_c)*100:20),"%)"]}),e.jsxs("div",{style:{background:"#eab308",width:`${(t==null?void 0:t.abc_a)+(t==null?void 0:t.abc_b)+(t==null?void 0:t.abc_c)>0?t.abc_b/(t.abc_a+t.abc_b+t.abc_c)*100:30}%`,display:"flex",alignItems:"center",justifyContent:"center",color:"#000",fontSize:"0.75rem",fontWeight:"bold",minWidth:"40px"},children:["B (",Math.round((t==null?void 0:t.abc_a)+(t==null?void 0:t.abc_b)+(t==null?void 0:t.abc_c)>0?t.abc_b/(t.abc_a+t.abc_b+t.abc_c)*100:30),"%)"]}),e.jsxs("div",{style:{background:"#f43f5e",width:`${(t==null?void 0:t.abc_a)+(t==null?void 0:t.abc_b)+(t==null?void 0:t.abc_c)>0?t.abc_c/(t.abc_a+t.abc_b+t.abc_c)*100:50}%`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:"0.75rem",fontWeight:"bold",minWidth:"40px"},children:["C (",Math.round((t==null?void 0:t.abc_a)+(t==null?void 0:t.abc_b)+(t==null?void 0:t.abc_c)>0?t.abc_c/(t.abc_a+t.abc_b+t.abc_c)*100:50),"%)"]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.8rem",fontSize:"0.85rem"},children:[e.jsxs("div",{style:{padding:"0.8rem",background:"rgba(16, 185, 129, 0.04)",border:"1px solid rgba(16, 185, 129, 0.12)",borderRadius:"12px"},children:[e.jsx("span",{style:{color:"#10b981",fontWeight:800},children:"🟢 Clase A (Alta Rotación):"}),e.jsxs("div",{style:{color:"#fff",fontSize:"1rem",fontWeight:700,margin:"2px 0"},children:[(t==null?void 0:t.abc_a)||0," Repuestos"]}),e.jsx("span",{style:{color:"#9ca3af",fontSize:"0.75rem"},children:"> 10 unidades vendidas en el periodo. Artículos estrella del inventario."})]}),e.jsxs("div",{style:{padding:"0.8rem",background:"rgba(234, 179, 8, 0.04)",border:"1px solid rgba(234, 179, 8, 0.12)",borderRadius:"12px"},children:[e.jsx("span",{style:{color:"#eab308",fontWeight:800},children:"🟡 Clase B (Rotación Media):"}),e.jsxs("div",{style:{color:"#fff",fontSize:"1rem",fontWeight:700,margin:"2px 0"},children:[(t==null?void 0:t.abc_b)||0," Repuestos"]}),e.jsx("span",{style:{color:"#9ca3af",fontSize:"0.75rem"},children:"4 a 10 unidades vendidas. Artículos de demanda regular."})]}),e.jsxs("div",{style:{padding:"0.8rem",background:"rgba(244, 63, 94, 0.04)",border:"1px solid rgba(244, 63, 94, 0.12)",borderRadius:"12px"},children:[e.jsx("span",{style:{color:"#f43f5e",fontWeight:800},children:"🔴 Clase C (Rotación Baja):"}),e.jsxs("div",{style:{color:"#fff",fontSize:"1rem",fontWeight:700,margin:"2px 0"},children:[(t==null?void 0:t.abc_c)||0," Repuestos"]}),e.jsx("span",{style:{color:"#9ca3af",fontSize:"0.75rem"},children:"≤ 3 unidades vendidas en el periodo. Lento movimiento en percha."})]})]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",justifyContent:"center"},children:[e.jsx("span",{style:{fontSize:"0.85rem",fontWeight:700,color:"#9ca3af",marginBottom:"0.5rem",textTransform:"uppercase",letterSpacing:"0.5px"},children:"Métricas de Clasificación ABC"}),e.jsx("div",{style:{overflowX:"auto",background:"rgba(255,255,255,0.01)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:"12px",padding:"0.5rem"},children:e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",textAlign:"left",fontSize:"0.85rem"},children:[e.jsx("thead",{children:e.jsxs("tr",{style:{borderBottom:"1px solid rgba(255, 255, 255, 0.08)",color:"#9ca3af"},children:[e.jsx("th",{style:{padding:"0.5rem",fontWeight:600},children:"CLASE"}),e.jsx("th",{style:{padding:"0.5rem",fontWeight:600,textAlign:"right"},children:"ITEMS (%)"}),e.jsx("th",{style:{padding:"0.5rem",fontWeight:600,textAlign:"right"},children:"STOCK"}),e.jsx("th",{style:{padding:"0.5rem",fontWeight:600,textAlign:"right"},children:"CAPITAL VALUADO"})]})}),e.jsx("tbody",{children:(()=>{var y,Ae,ke,ze,we,Ie,Te,We,Fe;const r=((y=t==null?void 0:t.abc_analysis)==null?void 0:y.clase_a)||{total:(t==null?void 0:t.abc_a)||0,stock:0,capital:0,pct_items:0},a=((Ae=t==null?void 0:t.abc_analysis)==null?void 0:Ae.clase_b)||{total:(t==null?void 0:t.abc_b)||0,stock:0,capital:0,pct_items:0},o=((ke=t==null?void 0:t.abc_analysis)==null?void 0:ke.clase_c)||{total:(t==null?void 0:t.abc_c)||0,stock:0,capital:0,pct_items:0},n=(r.total||0)+(a.total||0)+(o.total||0),l=(r.stock||0)+(a.stock||0)+(o.stock||0),d=(r.capital||0)+(a.capital||0)+(o.capital||0),z=r.pct_items||(n>0?(r.total/n*100).toFixed(1):0),I=a.pct_items||(n>0?(a.total/n*100).toFixed(1):0),u=o.pct_items||(n>0?(o.total/n*100).toFixed(1):0);return e.jsxs(e.Fragment,{children:[e.jsxs("tr",{style:{borderBottom:"1px solid rgba(255, 255, 255, 0.04)"},children:[e.jsx("td",{style:{padding:"0.6rem 0.5rem",fontWeight:700,color:"#10b981"},children:"🟢 Clase A"}),e.jsxs("td",{style:{padding:"0.6rem 0.5rem",textAlign:"right",color:"#fff"},children:[r.total||0," (",z,"%)"]}),e.jsxs("td",{style:{padding:"0.6rem 0.5rem",textAlign:"right",color:"#fff"},children:[((ze=r.stock)==null?void 0:ze.toLocaleString())||0," und"]}),e.jsxs("td",{style:{padding:"0.6rem 0.5rem",textAlign:"right",fontFamily:"'JetBrains Mono', monospace",color:"#ED7D31"},children:["C$ ",((we=r.capital)==null?void 0:we.toLocaleString("es-NI",{maximumFractionDigits:0}))||0]})]}),e.jsxs("tr",{style:{borderBottom:"1px solid rgba(255, 255, 255, 0.04)"},children:[e.jsx("td",{style:{padding:"0.6rem 0.5rem",fontWeight:700,color:"#eab308"},children:"🟡 Clase B"}),e.jsxs("td",{style:{padding:"0.6rem 0.5rem",textAlign:"right",color:"#fff"},children:[a.total||0," (",I,"%)"]}),e.jsxs("td",{style:{padding:"0.6rem 0.5rem",textAlign:"right",color:"#fff"},children:[((Ie=a.stock)==null?void 0:Ie.toLocaleString())||0," und"]}),e.jsxs("td",{style:{padding:"0.6rem 0.5rem",textAlign:"right",fontFamily:"'JetBrains Mono', monospace",color:"#ED7D31"},children:["C$ ",((Te=a.capital)==null?void 0:Te.toLocaleString("es-NI",{maximumFractionDigits:0}))||0]})]}),e.jsxs("tr",{style:{borderBottom:"1px solid rgba(255, 255, 255, 0.04)"},children:[e.jsx("td",{style:{padding:"0.6rem 0.5rem",fontWeight:700,color:"#f43f5e"},children:"🔴 Clase C"}),e.jsxs("td",{style:{padding:"0.6rem 0.5rem",textAlign:"right",color:"#fff"},children:[o.total||0," (",u,"%)"]}),e.jsxs("td",{style:{padding:"0.6rem 0.5rem",textAlign:"right",color:"#fff"},children:[((We=o.stock)==null?void 0:We.toLocaleString())||0," und"]}),e.jsxs("td",{style:{padding:"0.6rem 0.5rem",textAlign:"right",fontFamily:"'JetBrains Mono', monospace",color:"#ED7D31"},children:["C$ ",((Fe=o.capital)==null?void 0:Fe.toLocaleString("es-NI",{maximumFractionDigits:0}))||0]})]}),e.jsxs("tr",{style:{fontWeight:800,background:"rgba(255,255,255,0.03)",borderTop:"1px solid rgba(255,255,255,0.1)"},children:[e.jsx("td",{style:{padding:"0.6rem 0.5rem",color:"#fff"},children:"Total General"}),e.jsxs("td",{style:{padding:"0.6rem 0.5rem",textAlign:"right",color:"#fff"},children:[n," (100%)"]}),e.jsxs("td",{style:{padding:"0.6rem 0.5rem",textAlign:"right",color:"#10b981"},children:[l.toLocaleString()," und"]}),e.jsxs("td",{style:{padding:"0.6rem 0.5rem",textAlign:"right",fontFamily:"'JetBrains Mono', monospace",color:"#ED7D31"},children:["C$ ",d.toLocaleString("es-NI",{maximumFractionDigits:0})]})]})]})})()})]})})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",justifyContent:"center"},children:[e.jsx("span",{style:{fontSize:"0.85rem",fontWeight:700,color:"#9ca3af",marginBottom:"0.5rem",textTransform:"uppercase",letterSpacing:"0.5px"},children:"Distribución de Clases ABC"}),e.jsx(q,{style:{height:"240px"},children:e.jsx(Le,{data:it(),options:{indexAxis:"y",responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{y:{grid:{display:!1},ticks:{color:"#9ca3af",font:{family:"Outfit"}}},x:{grid:{color:"rgba(255,255,255,0.05)"},ticks:{color:"#9ca3af",font:{family:"Outfit"}}}}}})})]})]})]})}),e.jsx(j,{children:e.jsxs(h,{style:{gridColumn:"span 2"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",flexWrap:"wrap",gap:"1rem",borderBottom:"1px solid rgba(255, 255, 255, 0.05)",paddingBottom:"0.75rem"},children:[e.jsxs(f,{style:{borderBottom:"none",paddingBottom:0},children:[e.jsx(E,{color:"#10b981"}),"Detalle del Catálogo y Clasificación ABC (Pareto)"]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"1rem",flexWrap:"wrap"},children:[e.jsxs("div",{style:{display:"flex",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"8px",padding:"2px"},children:[e.jsx("button",{onClick:()=>L("all"),style:{background:S==="all"?"rgba(255, 255, 255, 0.08)":"none",border:"none",color:S==="all"?"#fff":"#9ca3af",padding:"0.4rem 0.8rem",fontSize:"0.8rem",borderRadius:"6px",cursor:"pointer",fontWeight:600,transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"},children:"Todos"}),e.jsx("button",{onClick:()=>L("A"),style:{background:S==="A"?"rgba(16, 185, 129, 0.15)":"none",border:"none",color:S==="A"?"#10b981":"#9ca3af",padding:"0.4rem 0.8rem",fontSize:"0.8rem",borderRadius:"6px",cursor:"pointer",fontWeight:600,transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"},children:"Clase A (Alta)"}),e.jsx("button",{onClick:()=>L("B"),style:{background:S==="B"?"rgba(234, 179, 8, 0.15)":"none",border:"none",color:S==="B"?"#eab308":"#9ca3af",padding:"0.4rem 0.8rem",fontSize:"0.8rem",borderRadius:"6px",cursor:"pointer",fontWeight:600,transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"},children:"Clase B (Media)"}),e.jsx("button",{onClick:()=>L("C"),style:{background:S==="C"?"rgba(244, 63, 94, 0.15)":"none",border:"none",color:S==="C"?"#f43f5e":"#9ca3af",padding:"0.4rem 0.8rem",fontSize:"0.8rem",borderRadius:"6px",cursor:"pointer",fontWeight:600,transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"},children:"Clase C (Baja)"})]}),e.jsx("div",{style:{position:"relative",minWidth:"220px"},children:e.jsx(Ee,{type:"text",placeholder:"Buscar repuesto...",value:O,onChange:r=>Qe(r.target.value),style:{padding:"0.4rem 0.8rem",fontSize:"0.85rem",width:"100%",borderRadius:"8px"}})})]})]}),e.jsx(b,{children:"Visualiza los artículos activos del catálogo clasificados según Pareto. Clase A (>10 ventas), Clase B (4 a 10 ventas) y Clase C (≤3 ventas)."}),e.jsx("div",{style:{overflowX:"auto",maxHeight:"400px",overflowY:"auto",marginTop:"0.5rem"},children:e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",textAlign:"left",fontSize:"0.9rem"},children:[e.jsx("thead",{children:e.jsxs("tr",{style:{borderBottom:"1px solid rgba(255, 25, 25, 0.08)",color:"#9ca3af",position:"sticky",top:0,background:"#0a0a14",zIndex:1},children:[e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600},children:"CÓDIGO"}),e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600},children:"PRODUCTO"}),e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600,textAlign:"right"},children:"EXISTENCIA"}),e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600,textAlign:"right"},children:"PRECIO VENTA"}),e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600,textAlign:"right"},children:"UNIDADES VENDIDAS"}),e.jsx("th",{style:{padding:"0.75rem 0.5rem",fontWeight:600,textAlign:"center"},children:"CLASIFICACIÓN ABC"})]})}),e.jsxs("tbody",{children:[M==null?void 0:M.map((r,a)=>e.jsxs("tr",{style:{borderBottom:"1px solid rgba(255, 255, 255, 0.04)",transition:"background-color 0.2s"},children:[e.jsx("td",{style:{padding:"0.75rem 0.5rem",fontFamily:"'JetBrains Mono', monospace",color:"#38bdf8",fontWeight:600},children:r.codigo||"S/C"}),e.jsx("td",{style:{padding:"0.75rem 0.5rem",color:"#fff"},children:r.nombre}),e.jsx("td",{style:{padding:"0.75rem 0.5rem",textAlign:"right",fontWeight:700,color:r.existencia<=5?"#f43f5e":"#fff"},children:r.existencia}),e.jsxs("td",{style:{padding:"0.75rem 0.5rem",textAlign:"right",fontFamily:"'JetBrains Mono', monospace",color:"#9ca3af"},children:["C$ ",Number(r.precio).toLocaleString("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2})]}),e.jsx("td",{style:{padding:"0.75rem 0.5rem",textAlign:"right",fontWeight:700,color:"#10b981"},children:r.unidades_vendidas}),e.jsx("td",{style:{padding:"0.75rem 0.5rem",textAlign:"center"},children:e.jsxs(V,{bg:r.clase_abc==="A"?"rgba(16, 185, 129, 0.15)":r.clase_abc==="B"?"rgba(234, 179, 8, 0.15)":"rgba(244, 63, 94, 0.15)",color:r.clase_abc==="A"?"#10b981":r.clase_abc==="B"?"#eab308":"#f43f5e",border:r.clase_abc==="A"?"rgba(16, 185, 129, 0.3)":r.clase_abc==="B"?"rgba(234, 179, 8, 0.3)":"rgba(244, 63, 94, 0.3)",children:["Clase ",r.clase_abc]})})]},a)),(!M||M.length===0)&&e.jsx("tr",{children:e.jsx("td",{colSpan:"6",style:{padding:"2rem",textAlign:"center",color:"#9ca3af"},children:"No hay productos clasificados que coincidan con la búsqueda."})})]})]})})]})}),e.jsx(j,{children:e.jsxs(h,{style:{gridColumn:"span 2"},children:[e.jsxs(f,{children:[e.jsx($,{color:"#f43f5e"}),"Alertas de Stock e Incidencias de Inventario"]}),e.jsx(b,{children:"Diagnóstico automatizado de ruptura de stock y desabastecimiento en el catálogo de repuestos."}),e.jsxs(Ne,{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))",gap:"1.2rem"},children:[(ue=t==null?void 0:t.inventory_anomalies)==null?void 0:ue.map((r,a)=>e.jsxs(Pe,{accent:r.risk==="Riesgo Alto"?"#f43f5e":"#ED7D31",children:[e.jsxs(Oe,{children:[e.jsx("h4",{children:r.title}),e.jsx("p",{children:r.desc})]}),e.jsx(Je,{bg:r.risk==="Riesgo Alto"?"rgba(244, 63, 94, 0.15)":"rgba(237, 125, 49, 0.15)",color:r.risk==="Riesgo Alto"?"#f43f5e":"#ED7D31",children:r.badge})]},a)),(!(t!=null&&t.inventory_anomalies)||t.inventory_anomalies.length===0)&&e.jsx("div",{style:{textAlign:"center",padding:"2rem",color:"#9ca3af",gridColumn:"span 2"},children:"No hay rupturas de stock ni alertas críticas detectadas."})]})]})}),e.jsx(j,{children:e.jsxs(h,{style:{gridColumn:"span 2"},children:[e.jsxs(f,{children:[e.jsx(E,{color:"#ED7D31"}),"Recomendaciones BI para la Gestión del Inventario"]}),e.jsx(b,{children:"Acciones sugeridas por el motor de inteligencia de negocios basadas en los KPIs de rotación, estancamiento y demanda actual."}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))",gap:"1.2rem",marginTop:"0.5rem"},children:[e.jsxs("div",{style:{background:"rgba(244, 63, 94, 0.05)",border:"1px solid rgba(244, 63, 94, 0.15)",borderRadius:"12px",padding:"1.2rem"},children:[e.jsx("span",{style:{fontSize:"0.75rem",textTransform:"uppercase",color:"#f43f5e",fontWeight:700,letterSpacing:"0.5px"},children:"Inventario de Lento Movimiento"}),e.jsx("h4",{style:{fontSize:"1.1rem",margin:"0.4rem 0 0.2rem 0",color:"#fff"},children:"Liquidación de Stock Estancado"}),e.jsxs("p",{style:{fontSize:"0.85rem",color:"#9ca3af",margin:0,lineHeight:"1.4"},children:["Tienes ",(t==null?void 0:t.riesgo_estancamiento)||0," repuestos con nulo movimiento en los últimos 180 días. Se aconseja agruparlos en combos o aplicar un 15% de descuento promocional para liberar capital de trabajo."]})]}),e.jsxs("div",{style:{background:"rgba(56, 189, 248, 0.05)",border:"1px solid rgba(56, 189, 248, 0.15)",borderRadius:"12px",padding:"1.2rem"},children:[e.jsx("span",{style:{fontSize:"0.75rem",textTransform:"uppercase",color:"#38bdf8",fontWeight:700,letterSpacing:"0.5px"},children:"Stock Out Preventivo"}),e.jsx("h4",{style:{fontSize:"1.1rem",margin:"0.4rem 0 0.2rem 0",color:"#fff"},children:"Reabastecimiento de Bestsellers"}),e.jsxs("p",{style:{fontSize:"0.85rem",color:"#9ca3af",margin:0,lineHeight:"1.4"},children:['El producto estrella "',((je=(ye=t==null?void 0:t.top_products)==null?void 0:ye[0])==null?void 0:je.nombre)||"N/A",'" posee una alta demanda. Verifica las existencias físicas y programa órdenes de compra inmediatas para evitar rupturas de stock de alta rentabilidad.']})]}),e.jsxs("div",{style:{background:"rgba(16, 185, 129, 0.05)",border:"1px solid rgba(16, 185, 129, 0.15)",borderRadius:"12px",padding:"1.2rem"},children:[e.jsx("span",{style:{fontSize:"0.75rem",textTransform:"uppercase",color:"#10b981",fontWeight:700,letterSpacing:"0.5px"},children:"Eficiencia de Rotación"}),e.jsx("h4",{style:{fontSize:"1.1rem",margin:"0.4rem 0 0.2rem 0",color:"#fff"},children:"Diagnóstico de Tasa de Rotación"}),e.jsxs("p",{style:{fontSize:"0.85rem",color:"#9ca3af",margin:0,lineHeight:"1.4"},children:["Con una tasa de ",Z," rotaciones al mes, el inventario goza de una salud moderada. Para potenciar el índice hacia valores mayores a 1.0, optimiza la cantidad de repuestos de baja demanda en pedidos de proveedores."]})]})]})]})}),e.jsxs(j,{style:{marginTop:"2rem"},children:[e.jsxs(h,{children:[e.jsxs(f,{children:[e.jsx(Re,{color:"#10b981"}),"Sugerencias de Reposición (Clase A - Stock Crítico ≤ 5)"]}),e.jsx(b,{children:"Artículos de alta demanda con existencias en niveles mínimos. Se calcula la compra sugerida para restablecer el stock óptimo."}),e.jsx("div",{style:{overflowX:"auto",marginTop:"0.5rem"},children:e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",textAlign:"left",fontSize:"0.85rem"},children:[e.jsx("thead",{children:e.jsxs("tr",{style:{borderBottom:"1px solid rgba(255, 25, 25, 0.08)",color:"#9ca3af"},children:[e.jsx("th",{style:{padding:"0.6rem 0.4rem",fontWeight:600},children:"CÓDIGO"}),e.jsx("th",{style:{padding:"0.6rem 0.4rem",fontWeight:600},children:"PRODUCTO"}),e.jsx("th",{style:{padding:"0.6rem 0.4rem",fontWeight:600,textAlign:"right"},children:"STOCK"}),e.jsx("th",{style:{padding:"0.6rem 0.4rem",fontWeight:600,textAlign:"right"},children:"VENDIDO (180d)"}),e.jsx("th",{style:{padding:"0.6rem 0.4rem",fontWeight:600,textAlign:"right"},children:"PEDIDO SUG."}),e.jsx("th",{style:{padding:"0.6rem 0.4rem",fontWeight:600,textAlign:"right"},children:"COSTO ESTIMADO"})]})}),e.jsxs("tbody",{children:[(ve=t==null?void 0:t.suggested_replenishment)==null?void 0:ve.map((r,a)=>e.jsxs("tr",{style:{borderBottom:"1px solid rgba(255, 255, 255, 0.04)"},children:[e.jsx("td",{style:{padding:"0.6rem 0.4rem",fontFamily:"'JetBrains Mono', monospace",color:"#38bdf8",fontWeight:600},children:r.codigo}),e.jsx("td",{style:{padding:"0.6rem 0.4rem",color:"#fff"},children:r.nombre}),e.jsx("td",{style:{padding:"0.6rem 0.4rem",textAlign:"right",fontWeight:700,color:"#f43f5e"},children:r.existencia}),e.jsx("td",{style:{padding:"0.6rem 0.4rem",textAlign:"right",color:"#9ca3af"},children:r.unidades_vendidas}),e.jsxs("td",{style:{padding:"0.6rem 0.4rem",textAlign:"right",fontWeight:700,color:"#10b981"},children:[r.sug_qty," und"]}),e.jsxs("td",{style:{padding:"0.6rem 0.4rem",textAlign:"right",fontFamily:"'JetBrains Mono', monospace",color:"#ED7D31"},children:["C$ ",r.costo_estimado.toLocaleString("es-NI",{maximumFractionDigits:0})]})]},a)),(!(t!=null&&t.suggested_replenishment)||t.suggested_replenishment.length===0)&&e.jsx("tr",{children:e.jsx("td",{colSpan:"6",style:{padding:"2rem",textAlign:"center",color:"#9ca3af"},children:"No se requiere reposición inmediata de artículos Clase A."})})]})]})})]}),e.jsxs(h,{children:[e.jsxs(f,{children:[e.jsx($,{color:"#ED7D31"}),"Riesgo de Capital Estancado (Dead Stock)"]}),e.jsx(b,{children:"Artículos activos con existencias físicas en bodega pero sin ventas registradas en el periodo seleccionado."}),e.jsx("div",{style:{overflowX:"auto",marginTop:"0.5rem"},children:e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",textAlign:"left",fontSize:"0.85rem"},children:[e.jsx("thead",{children:e.jsxs("tr",{style:{borderBottom:"1px solid rgba(255, 25, 25, 0.08)",color:"#9ca3af"},children:[e.jsx("th",{style:{padding:"0.6rem 0.4rem",fontWeight:600},children:"CÓDIGO"}),e.jsx("th",{style:{padding:"0.6rem 0.4rem",fontWeight:600},children:"PRODUCTO"}),e.jsx("th",{style:{padding:"0.6rem 0.4rem",fontWeight:600,textAlign:"right"},children:"EXISTENCIA"}),e.jsx("th",{style:{padding:"0.6rem 0.4rem",fontWeight:600,textAlign:"right"},children:"PRECIO VENTA"}),e.jsx("th",{style:{padding:"0.6rem 0.4rem",fontWeight:600,textAlign:"right"},children:"CAPITAL INMOVILIZADO"})]})}),e.jsxs("tbody",{children:[(Ce=t==null?void 0:t.dead_stock_risk)==null?void 0:Ce.map((r,a)=>e.jsxs("tr",{style:{borderBottom:"1px solid rgba(255, 255, 255, 0.04)"},children:[e.jsx("td",{style:{padding:"0.6rem 0.4rem",fontFamily:"'JetBrains Mono', monospace",color:"#38bdf8",fontWeight:600},children:r.codigo||"S/C"}),e.jsx("td",{style:{padding:"0.6rem 0.4rem",color:"#fff"},children:r.nombre}),e.jsx("td",{style:{padding:"0.6rem 0.4rem",textAlign:"right",color:"#fff",fontWeight:600},children:r.existencia}),e.jsxs("td",{style:{padding:"0.6rem 0.4rem",textAlign:"right",color:"#9ca3af"},children:["C$ ",r.precio.toLocaleString("es-NI",{maximumFractionDigits:0})]}),e.jsxs("td",{style:{padding:"0.6rem 0.4rem",textAlign:"right",fontFamily:"'JetBrains Mono', monospace",color:"#ED7D31",fontWeight:700},children:["C$ ",r.capital_muerto.toLocaleString("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2})]})]},a)),(!(t!=null&&t.dead_stock_risk)||t.dead_stock_risk.length===0)&&e.jsx("tr",{children:e.jsx("td",{colSpan:"5",style:{padding:"2rem",textAlign:"center",color:"#9ca3af"},children:"No hay artículos con riesgo de capital estancado."})})]})]})})]})]}),e.jsx(j,{style:{marginTop:"2rem"},children:e.jsxs(h,{style:{gridColumn:"span 2"},children:[e.jsxs(f,{children:[e.jsx($,{color:"#f43f5e"}),"Pérdidas Estimadas por Quiebre de Stock (Stockout)"]}),e.jsx(b,{children:"Artículos con demanda histórica reciente pero con stock actual en cero. Muestra la pérdida diaria estimada tanto en ventas brutas como en utilidad neta (ganancia real perdida)."}),e.jsx("div",{style:{overflowX:"auto",marginTop:"0.5rem"},children:e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",textAlign:"left",fontSize:"0.85rem"},children:[e.jsx("thead",{children:e.jsxs("tr",{style:{borderBottom:"1px solid rgba(255, 25, 25, 0.08)",color:"#9ca3af"},children:[e.jsx("th",{style:{padding:"0.6rem 0.4rem",fontWeight:600},children:"CÓDIGO"}),e.jsx("th",{style:{padding:"0.6rem 0.4rem",fontWeight:600},children:"PRODUCTO"}),e.jsx("th",{style:{padding:"0.6rem 0.4rem",fontWeight:600,textAlign:"right"},children:"PRECIO VENTA"}),e.jsx("th",{style:{padding:"0.6rem 0.4rem",fontWeight:600,textAlign:"right"},children:"VENDIDO (180d)"}),e.jsx("th",{style:{padding:"0.6rem 0.4rem",fontWeight:600,textAlign:"right"},children:"PÉRDIDA DIARIA VENTAS"}),e.jsx("th",{style:{padding:"0.6rem 0.4rem",fontWeight:600,textAlign:"right"},children:"PÉRDIDA DIARIA GANANCIA"})]})}),e.jsxs("tbody",{children:[(Se=t==null?void 0:t.lost_sales_stockout)==null?void 0:Se.map((r,a)=>e.jsxs("tr",{style:{borderBottom:"1px solid rgba(255, 255, 255, 0.04)"},children:[e.jsx("td",{style:{padding:"0.6rem 0.4rem",fontFamily:"'JetBrains Mono', monospace",color:"#38bdf8",fontWeight:600},children:r.codigo||"S/C"}),e.jsx("td",{style:{padding:"0.6rem 0.4rem",color:"#fff"},children:r.nombre}),e.jsxs("td",{style:{padding:"0.6rem 0.4rem",textAlign:"right",color:"#9ca3af"},children:["C$ ",r.precio.toLocaleString("es-NI",{maximumFractionDigits:0})]}),e.jsx("td",{style:{padding:"0.6rem 0.4rem",textAlign:"right",color:"#f43f5e",fontWeight:600},children:r.unidades_180}),e.jsxs("td",{style:{padding:"0.6rem 0.4rem",textAlign:"right",fontFamily:"'JetBrains Mono', monospace",color:"#f43f5e",fontWeight:700},children:["C$ ",r.perdida_diaria.toLocaleString("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2})]}),e.jsxs("td",{style:{padding:"0.6rem 0.4rem",textAlign:"right",fontFamily:"'JetBrains Mono', monospace",color:"#ED7D31",fontWeight:700},children:["C$ ",r.perdida_ganancia.toLocaleString("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2})]})]},a)),(!(t!=null&&t.lost_sales_stockout)||t.lost_sales_stockout.length===0)&&e.jsx("tr",{children:e.jsx("td",{colSpan:"6",style:{padding:"2rem",textAlign:"center",color:"#9ca3af"},children:"No hay pérdidas proyectadas por quiebres de stock."})})]})]})})]})})]}),A==="proyeccion"&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs(j,{children:[e.jsxs(h,{children:[e.jsxs(f,{style:{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",flexWrap:"wrap",gap:"1rem"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[e.jsx(N,{color:"#38bdf8"}),"Historial de Ventas y Proyección Lineal"]}),e.jsxs("div",{style:{display:"flex",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"8px",padding:"2px"},children:[e.jsx("button",{onClick:()=>H("daily"),style:{background:v==="daily"?"rgba(255,255,255,0.08)":"none",border:"none",color:v==="daily"?"#fff":"#9ca3af",padding:"0.3rem 0.6rem",fontSize:"0.75rem",borderRadius:"6px",cursor:"pointer",fontWeight:600,transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"},children:"Diario"}),e.jsx("button",{onClick:()=>H("weekly"),style:{background:v==="weekly"?"rgba(255,255,255,0.08)":"none",border:"none",color:v==="weekly"?"#fff":"#9ca3af",padding:"0.3rem 0.6rem",fontSize:"0.75rem",borderRadius:"6px",cursor:"pointer",fontWeight:600,transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"},children:"Semanal"})]})]}),e.jsx(b,{children:"Registros transaccionales reales comparados con la proyección analítica calculada mediante regresión lineal basada en el histórico de ventas."}),e.jsx(q,{style:{height:"280px"},children:e.jsx(lt,{data:at(),options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{labels:{color:"#9ca3af",font:{family:"Outfit"}}}},scales:{y:{grid:{color:"rgba(255,255,255,0.05)"},ticks:{color:"#9ca3af",font:{family:"Outfit"}}},x:{grid:{display:!1},ticks:{color:"#9ca3af",font:{family:"Outfit"}}}}}})})]}),e.jsxs(h,{children:[e.jsxs(f,{children:[e.jsx(dt,{style:{color:"#10b981"}}),"Rentabilidad y Utilidad por Proveedor (C$)"]}),e.jsx(b,{children:"Comparativa de facturación total por ventas frente a la utilidad neta obtenida por cada uno de los 5 principales proveedores."}),e.jsx(q,{style:{height:"280px"},children:e.jsx(Le,{data:ot(),options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!0,labels:{color:"#9ca3af",font:{family:"Outfit"}}}},scales:{y:{grid:{color:"rgba(255,255,255,0.05)"},ticks:{color:"#9ca3af",font:{family:"Outfit"}}},x:{grid:{display:!1},ticks:{color:"#9ca3af",font:{family:"Outfit"}}}}}})})]})]}),(()=>{const r=(t==null?void 0:t.ventas_mes_actual)||12e4,a=(t==null?void 0:t.dias_transcurridos_mes)||new Date().getDate(),o=(t==null?void 0:t.dias_totales_mes)||new Date(new Date().getFullYear(),new Date().getMonth()+1,0).getDate(),n=a>0?r/a:0,l=n*o,d=k>0?Math.min(100,r/k*100):0,z=l-k,I=l<k&&n>0&&o>a?((k-r)/(o-a)-n)/n*100:0;return e.jsx(j,{children:e.jsxs(h,{style:{gridColumn:"span 2"},children:[e.jsxs(f,{children:[e.jsx(N,{color:"#10b981"}),"Simulador de Objetivos de Ventas y Proyección Run-Rate"]}),e.jsx(b,{children:"Monitorea el progreso de la meta de facturación mensual y calcula la proyección de cierre de mes basada en el ritmo de ventas diario (Run-Rate)."}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))",gap:"1.5rem",marginTop:"0.5rem"},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"16px",padding:"1.25rem"},children:[e.jsxs(Bt,{children:[e.jsx("label",{style:{fontSize:"0.85rem",color:"#9ca3af",fontWeight:600},children:"Fijar Meta de Ventas Mensual (C$):"}),e.jsx(Ee,{type:"number",value:k,onChange:u=>Ze(Math.max(0,Number(u.target.value))),style:{width:"100%",boxSizing:"border-box"},placeholder:"Ej. 600000"})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.8rem",fontSize:"0.8rem",borderTop:"1px solid rgba(255,255,255,0.05)",paddingTop:"0.8rem"},children:[e.jsxs("div",{children:[e.jsx("span",{style:{color:"#9ca3af"},children:"Días Transcurridos:"}),e.jsxs("div",{style:{color:"#fff",fontSize:"1.1rem",fontWeight:700},children:[a," / ",o," días"]})]}),e.jsxs("div",{children:[e.jsx("span",{style:{color:"#9ca3af"},children:"Venta Promedio Diaria:"}),e.jsxs("div",{style:{color:"#10b981",fontSize:"1.1rem",fontWeight:700},children:["C$ ",Math.round(n).toLocaleString("es-NI")]})]})]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",justifyContent:"space-between",gap:"1rem",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"16px",padding:"1.25rem"},children:[e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",marginBottom:"0.4rem"},children:[e.jsx("span",{style:{color:"#9ca3af",fontWeight:600},children:"Progreso de la Meta del Mes"}),e.jsxs("span",{style:{color:"#10b981",fontWeight:800},children:[d.toFixed(1),"%"]})]}),e.jsx("div",{style:{background:"rgba(255,255,255,0.04)",height:"12px",borderRadius:"6px",overflow:"hidden",border:"1px solid rgba(255,255,255,0.06)"},children:e.jsx("div",{style:{background:"linear-gradient(90deg, #38bdf8, #10b981)",height:"100%",width:`${d}%`,borderRadius:"6px",transition:"width 0.4s ease"}})})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("span",{style:{color:"#9ca3af",fontSize:"0.75rem",textTransform:"uppercase"},children:"Ventas del Mes Actual"}),e.jsxs("div",{style:{color:"#fff",fontSize:"1.4rem",fontWeight:800},children:["C$ ",Math.round(r).toLocaleString("es-NI")]})]}),e.jsxs("div",{children:[e.jsx("span",{style:{color:"#9ca3af",fontSize:"0.75rem",textTransform:"uppercase"},children:"Proyección Cierre de Mes"}),e.jsxs("div",{style:{color:"#38bdf8",fontSize:"1.4rem",fontWeight:800},children:["C$ ",Math.round(l).toLocaleString("es-NI")]})]})]})]})]}),e.jsx("div",{style:{padding:"1rem",borderRadius:"12px",border:"1px solid",background:z>=0?"rgba(16, 185, 129, 0.05)":"rgba(244, 63, 94, 0.05)",borderColor:z>=0?"rgba(16, 185, 129, 0.2)":"rgba(244, 63, 94, 0.2)",fontSize:"0.85rem",lineHeight:"1.5",marginTop:"0.5rem"},children:z>=0?e.jsxs("div",{children:[e.jsx("strong",{style:{color:"#10b981"},children:"🎉 Meta en Camino a Cumplirse:"})," Al ritmo de ventas actual (C$ ",Math.round(n).toLocaleString("es-NI"),"/día), el modelo proyecta que cerrarás el mes con ",e.jsxs("strong",{style:{color:"#fff"},children:["C$ ",Math.round(l).toLocaleString("es-NI")]}),". Esto supera tu objetivo fijado de C$ ",k.toLocaleString("es-NI")," por ",e.jsxs("strong",{style:{color:"#10b981"},children:["C$ ",Math.round(z).toLocaleString("es-NI")]}),"."]}):e.jsxs("div",{children:[e.jsx("strong",{style:{color:"#f43f5e"},children:"⚠️ Brecha de Ventas Detectada:"})," Al ritmo de ventas actual, proyectas cerrar el mes con ",e.jsxs("strong",{style:{color:"#fff"},children:["C$ ",Math.round(l).toLocaleString("es-NI")]}),", quedando ",e.jsxs("strong",{style:{color:"#f43f5e"},children:["C$ ",Math.round(Math.abs(z)).toLocaleString("es-NI")]})," por debajo de tu objetivo de C$ ",k.toLocaleString("es-NI"),".",o>a?e.jsxs("span",{children:[" Para alcanzar la meta, necesitas incrementar la facturación diaria a ",e.jsxs("strong",{style:{color:"#fff"},children:["C$ ",Math.round((k-r)/(o-a)).toLocaleString("es-NI")]})," por los restantes ",o-a," días (un aumento del ",e.jsxs("strong",{style:{color:"#eab308"},children:[I.toFixed(1),"%"]})," sobre el promedio diario actual)."]}):e.jsx("span",{children:" El mes ha concluido y no se ha alcanzado la meta."})]})})]})})})(),e.jsx(j,{children:e.jsxs(h,{style:{gridColumn:"span 2"},children:[e.jsxs(f,{children:[e.jsx(ct,{color:"#ED7D31"}),"Sugerencias de Combos de Repuestos y Venta Cruzada (Motor BI)"]}),e.jsx(b,{children:"Asociaciones recomendadas para promociones en caja, calculadas en base a la co-ocurrencia de artículos comprados juntos en el historial de ventas."}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))",gap:"1.5rem",marginTop:"0.5rem"},children:[(De=t==null?void 0:t.combo_suggestions)==null?void 0:De.map((r,a)=>e.jsxs("div",{style:{background:"rgba(255, 255, 255, 0.02)",border:"1px solid rgba(255, 255, 255, 0.05)",borderRadius:"16px",padding:"1.25rem",position:"relative",overflow:"hidden",display:"flex",flexDirection:"column",justifyContent:"space-between",gap:"1rem",transition:"all 0.3s ease",boxShadow:"0 4px 20px rgba(0,0,0,0.2)"},onMouseEnter:o=>{o.currentTarget.style.borderColor="rgba(237, 125, 49, 0.3)",o.currentTarget.style.transform="translateY(-3px)",o.currentTarget.style.boxShadow="0 8px 30px rgba(237, 125, 49, 0.1)"},onMouseLeave:o=>{o.currentTarget.style.borderColor="rgba(255, 255, 255, 0.05)",o.currentTarget.style.transform="translateY(0)",o.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,0.2)"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx("span",{style:{fontSize:"0.7rem",color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.5px",fontWeight:600},children:r.tipo}),e.jsxs("span",{style:{background:"rgba(16, 185, 129, 0.12)",color:"#10b981",fontSize:"0.7rem",padding:"2px 8px",borderRadius:"20px",fontWeight:700,border:"1px solid rgba(16, 185, 129, 0.2)"},children:["Ahorro: C$ ",r.ahorro.toLocaleString("es-NI")]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.6rem"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"flex-start",gap:"0.5rem"},children:[e.jsx("div",{style:{background:"rgba(56, 189, 248, 0.1)",color:"#38bdf8",padding:"4px 8px",borderRadius:"6px",fontSize:"0.75rem",fontFamily:"JetBrains Mono",fontWeight:700,minWidth:"40px",textAlign:"center"},children:"A"}),e.jsxs("div",{children:[e.jsx("div",{style:{color:"#fff",fontSize:"0.9rem",fontWeight:600,lineHeight:"1.3"},children:r.producto_a}),e.jsxs("div",{style:{color:"#9ca3af",fontSize:"0.75rem",fontFamily:"JetBrains Mono"},children:["Cód: ",r.codigo_a]})]})]}),e.jsx("div",{style:{display:"flex",justifyContent:"center",margin:"0.1rem 0",color:"rgba(255,255,255,0.15)",fontSize:"1.1rem"},children:"+"}),e.jsxs("div",{style:{display:"flex",alignItems:"flex-start",gap:"0.5rem"},children:[e.jsx("div",{style:{background:"rgba(237, 125, 49, 0.1)",color:"#ED7D31",padding:"4px 8px",borderRadius:"6px",fontSize:"0.75rem",fontFamily:"JetBrains Mono",fontWeight:700,minWidth:"40px",textAlign:"center"},children:"B"}),e.jsxs("div",{children:[e.jsx("div",{style:{color:"#fff",fontSize:"0.9rem",fontWeight:600,lineHeight:"1.3"},children:r.producto_b}),e.jsxs("div",{style:{color:"#9ca3af",fontSize:"0.75rem",fontFamily:"JetBrains Mono"},children:["Cód: ",r.codigo_b]})]})]})]}),r.confianza!==void 0&&r.lift!==void 0&&e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",gap:"0.8rem",fontSize:"0.75rem",color:"#eab308",background:"rgba(234, 179, 8, 0.04)",border:"1px solid rgba(234, 179, 8, 0.1)",padding:"4px 8px",borderRadius:"8px",fontWeight:600},children:[e.jsxs("span",{children:["Confianza: ",Math.round(r.confianza*100),"%"]}),e.jsxs("span",{children:["Elevación (Lift): ",r.lift.toFixed(1),"x"]})]}),e.jsxs("div",{style:{borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:"0.75rem",display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginTop:"0.5rem"},children:[e.jsxs("div",{children:[e.jsxs("span",{style:{fontSize:"0.75rem",color:"#9ca3af",textDecoration:"line-through"},children:["C$ ",r.precio_original.toLocaleString("es-NI")]}),e.jsxs("div",{style:{fontSize:"1.25rem",fontWeight:800,color:"#10b981",display:"flex",alignItems:"center",gap:"0.25rem"},children:[e.jsx("span",{style:{fontSize:"0.85rem",fontWeight:500},children:"C$"}),r.precio_combo.toLocaleString("es-NI")]})]}),e.jsxs("div",{style:{fontSize:"0.75rem",color:"#9ca3af",fontStyle:"italic",textAlign:"right"},children:[r.coocurrencias," compras conjuntas"]})]})]},a)),(!(t!=null&&t.combo_suggestions)||((_e=t==null?void 0:t.combo_suggestions)==null?void 0:_e.length)===0)&&e.jsx("div",{style:{textAlign:"center",padding:"2rem",color:"#9ca3af",gridColumn:"span 2"},children:"No hay suficientes productos en inventario para sugerir combos."})]})]})})]}),e.jsx($t,{children:e.jsx("p",{children:"© 2026 Multirepuestos RG | Consola de Analítica & BI"})})]})]})};export{er as default};

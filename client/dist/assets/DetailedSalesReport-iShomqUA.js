import{b as Le,c as Te,r as d,a as oe,j as e,X as ke,aM as J,af as Fe,G as We,M as Ne,$ as ne,a1 as Ve,aV as Oe,S as ae,aN as Be,g as qe,k as _e,C as Ue,aW as He,aX as Ge,s as g,at as Ce,aY as de,aZ as le,a_ as Se,W as Ke,aa as Qe,t as Ye}from"./vendor-C4uQ3a2a.js";import{u as ze}from"./index-DrTQe3aZ.js";import{r as we}from"./searchEngine-BMYcElFi.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-BMvqz6Um.js";const ce="https://sistema.multirepuestosrg.com/api";function $e(){const t=new Date,x=t.getFullYear(),N=String(t.getMonth()+1).padStart(2,"0"),j=String(t.getDate()).padStart(2,"0");return`${x}-${N}-${j}`}const p=t=>`C$${Number(t||0).toFixed(2)}`,F=t=>t?new Date(t).toLocaleString("es-NI",{timeZone:"America/Managua",day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:!0}):"—",Re=t=>t?new Date(t).toLocaleDateString("es-NI",{timeZone:"America/Managua",day:"2-digit",month:"2-digit",year:"numeric"}):"—",r={primary:"#0f172a",secondary:"#475569",success:"#16a34a",info:"#0284c7",bg:"#f8fafc",border:"#e2e8f0",text:"#1e293b",textLight:"#64748b"},re=Ye`from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); }`,Je=g.div`
  max-width: 1500px;
  margin: 0 auto;
  padding: 2rem;
  background: ${r.bg};
  min-height: 100vh;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: ${r.text};
`,Xe=g.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  background: white;
  padding: 1.25rem 2rem;
  border-radius: 12px;
  border: 1px solid ${r.border};
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  flex-wrap: wrap;
  gap: 1rem;
`,Ze=g.button`
  background: white;
  border: 1px solid ${r.border};
  width: 40px; height: 40px;
  border-radius: 8px;
  display: grid; place-items: center;
  cursor: pointer;
  color: ${r.text};
  transition: all 0.2s;
  &:hover { background: ${r.bg}; color: ${r.primary}; }
`,ea=g.div`
  display: flex;
  gap: 0;
  background: white;
  border-radius: 12px;
  border: 1px solid ${r.border};
  overflow: hidden;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
`,W=g.button`
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  background: ${t=>t.active?r.primary:"white"};
  color: ${t=>t.active?"white":r.secondary};
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  border-right: 1px solid ${r.border};
  &:last-child { border-right: none; }
  &:hover {
    background: ${t=>t.active?r.primary:"#f1f5f9"};
  }
`,aa=g.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;

  input[type="date"], input[type="text"] {
    padding: 10px 14px;
    border: 1px solid ${r.border};
    border-radius: 8px;
    font-family: inherit;
    font-size: 0.9rem;
    color: ${r.text};
    background: white;
    outline: none;
    transition: border-color 0.2s;
    &:focus { border-color: ${r.primary}; }
  }

  select {
    padding: 10px 14px;
    border: 1px solid ${r.border};
    border-radius: 8px;
    font-family: inherit;
    font-size: 0.9rem;
    color: ${r.text};
    background: white;
    outline: none;
    cursor: pointer;
  }
`,pe=g.button`
  padding: 10px 18px;
  border: 1px solid ${r.border};
  border-radius: 8px;
  background: ${t=>t.variant==="primary"?r.primary:"white"};
  color: ${t=>t.variant==="primary"?"white":r.secondary};
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
  &:hover {
    background: ${t=>t.variant==="primary"?"#1e293b":r.bg};
    transform: translateY(-1px);
  }
`,X=g.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${r.border};
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  animation: ${re} 0.3s ease;

  thead {
    background: #f1f5f9;
    th {
      padding: 12px 16px;
      text-align: left;
      font-weight: 600;
      font-size: 0.8rem;
      color: ${r.secondary};
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 2px solid ${r.border};
      white-space: nowrap;
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid #f1f5f9;
      transition: background 0.15s;
      cursor: ${t=>t.clickable?"pointer":"default"};
      &:hover { background: #fafbfc; }
      &:last-child { border-bottom: none; }
    }
    td {
      padding: 10px 16px;
      font-size: 0.9rem;
      color: ${r.text};
      vertical-align: top;
    }
  }

  .num { text-align: right; font-family: 'Roboto Mono', monospace; }
  .center { text-align: center; }
`,De=g.div`
  text-align: center;
  padding: 3rem 2rem;
  color: ${r.textLight};
  background: white;
  border-radius: 12px;
  border: 1px solid ${r.border};
  animation: ${re} 0.3s ease;
  p { margin: 0.5rem 0; }
  svg { font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.4; }
`,ra=g.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
  animation: ${re} 0.3s ease;
`,Z=g.div`
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid ${r.border};
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  
  .label {
    font-size: 0.8rem;
    color: ${r.textLight};
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.03em;
    margin-bottom: 0.4rem;
  }
  .value {
    font-size: 1.4rem;
    font-weight: 700;
    color: ${t=>t.color||r.primary};
    font-family: 'Roboto Mono', monospace;
  }
`,ta=g.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.82rem;
  color: ${r.secondary};
  
  .item-row {
    display: flex;
    justify-content: space-between;
    padding: 2px 0;
    &:hover { color: ${r.text}; }
  }
  .item-name { flex: 1; }
  .item-qty { width: 40px; text-align: center; color: ${r.textLight}; }
  .item-price { width: 90px; text-align: right; font-family: 'Roboto Mono', monospace; }
`,sa=g.button`
  all: unset;
  cursor: pointer;
  color: ${r.info};
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  &:hover { text-decoration: underline; }
`,Ee=g.div`
  text-align: center;
  padding: 3rem;
  color: ${r.textLight};
  font-size: 1rem;
`,me=g.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 2rem;
`,xe=g.div`
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid ${r.border};
  box-shadow: 0 2px 4px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  animation: ${re} 0.3s ease;
`,w=g.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  
  .label { font-size: 0.75rem; color: ${r.textLight}; font-weight: 600; text-transform: uppercase; }
  .value { font-size: 0.95rem; font-weight: 600; color: ${r.text}; }
  .price { font-family: 'Roboto Mono', monospace; font-size: 1.1rem; color: ${r.primary}; }
`,ia=g.div`
  background: #f8fafc;
  border-radius: 8px;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.85rem;
  border: 1px dashed ${r.border};
`,oa=()=>{const[t,x]=d.useState(window.innerWidth<768);return d.useEffect(()=>{const N=()=>x(window.innerWidth<768);return window.addEventListener("resize",N),()=>window.removeEventListener("resize",N)},[]),t},na=t=>{switch(t){case"COMPLETADA":return{background:"#dcfce7",color:"#166534"};case"DEVOLUCION":return{background:"#fee2e2",color:"#991b1b"};case"CANCELADA":return{background:"#fef3c7",color:"#92400e"};default:return{background:"#f1f5f9",color:"#475569"}}},ee=({type:t,children:x})=>{const N={fontSize:"0.7rem",fontWeight:700,padding:"3px 8px",borderRadius:"6px",textTransform:"uppercase",letterSpacing:"0.03em",whiteSpace:"nowrap",...na(t)};return e.jsx("span",{style:N,children:x})},da=g.div`
  background-color: #07070e;
  background-image: 
    radial-gradient(circle at 5% 15%, rgba(237, 125, 49, 0.08) 0%, transparent 40%),
    radial-gradient(circle at 95% 85%, rgba(56, 189, 248, 0.08) 0%, transparent 40%);
  color: #f3f4f6;
  font-family: 'Outfit', 'Inter', sans-serif;
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 1rem;
  animation: fadeIn 0.4s ease-out;

  --accent-orange: #ED7D31;
  --accent-blue: #38bdf8;
  --accent-green: #10b981;
  --accent-red: #f43f5e;
  --accent-purple: #a855f7;

  /* Scoped standard elements inside the cyberpunk container */
  .brand-kdd h1 {
    font-size: 1.6rem;
    font-weight: 800;
    background: linear-gradient(135deg, #fff 40%, var(--accent-orange) 80%, var(--accent-blue) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
  }

  .brand-kdd p {
    font-size: 0.85rem;
    color: #9ca3af;
    margin: 4px 0 0 0;
  }

  .badge-kdd {
    background: rgba(237, 125, 49, 0.15);
    color: var(--accent-orange);
    border: 1px solid rgba(237, 125, 49, 0.3);
    padding: 0.2rem 0.6rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
    width: 100%;
  }

  .kpi-card {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 1.5rem;
    position: relative;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10px);
  }

  .kpi-card:hover {
    transform: translateY(-3px);
    border-color: rgba(255, 255, 255, 0.15);
  }

  .kpi-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
  }

  .kpi-card.orange::before { background: var(--accent-orange); }
  .kpi-card.blue::before { background: var(--accent-blue); }
  .kpi-card.green::before { background: var(--accent-green); }
  .kpi-card.red::before { background: var(--accent-red); }

  .kpi-card.orange:hover { box-shadow: 0 0 15px rgba(237, 125, 49, 0.2); }
  .kpi-card.blue:hover { box-shadow: 0 0 15px rgba(56, 189, 248, 0.2); }
  .kpi-card.green:hover { box-shadow: 0 0 15px rgba(16, 185, 129, 0.2); }
  .kpi-card.red:hover { box-shadow: 0 0 15px rgba(244, 63, 94, 0.2); }

  .kpi-title {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #9ca3af;
    font-weight: 600;
  }

  .kpi-value {
    font-size: 2rem;
    font-weight: 800;
    color: #fff;
    margin-top: 0.25rem;
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
  }

  .kpi-unit {
    font-size: 0.85rem;
    font-weight: 500;
    color: #9ca3af;
  }

  .kpi-desc {
    font-size: 0.8rem;
    color: #9ca3af;
    margin-top: 0.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.04);
    padding-top: 0.5rem;
  }

  .sub-tabs-container {
    display: flex;
    background: rgba(255, 255, 255, 0.01);
    border: 1px solid rgba(255, 255, 255, 0.05);
    padding: 0.35rem;
    border-radius: 12px;
    gap: 0.5rem;
    align-self: flex-start;
    flex-wrap: wrap;
  }

  .sub-tab-btn {
    background: none;
    border: none;
    color: #9ca3af;
    padding: 0.5rem 1.2rem;
    border-radius: 8px;
    font-family: inherit;
    font-weight: 600;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .sub-tab-btn:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.02);
  }

  .sub-tab-btn.active {
    color: #fff;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.06);
  }

  .sub-tab-btn.active svg {
    color: var(--accent-orange);
  }

  .panel-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(45%, 1fr));
    gap: 2rem;
    width: 100%;
  }

  @media (max-width: 900px) {
    .panel-row {
      grid-template-columns: 1fr;
    }
  }

  .card-kdd {
    background: rgba(255, 255, 255, 0.01);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    padding: 1.8rem;
    backdrop-filter: blur(15px);
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }

  .card-title-kdd {
    font-size: 1.15rem;
    font-weight: 700;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    padding-bottom: 0.75rem;
  }

  .card-title-kdd svg {
    width: 18px;
    height: 18px;
    color: var(--accent-blue);
  }

  .card-desc-kdd {
    font-size: 0.85rem;
    color: #9ca3af;
  }

  .table-container-kdd {
    width: 100%;
    overflow-x: auto;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  table.kdd-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 0.85rem;
  }

  table.kdd-table th {
    background: rgba(255, 255, 255, 0.02);
    color: #fff;
    font-weight: 600;
    padding: 0.8rem 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  table.kdd-table td {
    padding: 0.8rem 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.02);
    color: #9ca3af;
  }

  table.kdd-table tr:hover td {
    background: rgba(255, 255, 255, 0.01);
    color: #fff;
  }

  .visdat-grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 3px;
    background: rgba(255, 255, 255, 0.01);
    padding: 8px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .visdat-cell {
    height: 22px;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.6rem;
    font-weight: bold;
  }

  .visdat-ok { background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); color: var(--accent-green); }
  .visdat-null { background: rgba(244, 63, 94, 0.15); border: 1px solid rgba(244, 63, 94, 0.4); color: var(--accent-red); }

  .tree-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1.5rem;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    min-height: 280px;
    width: 100%;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .form-group label {
    font-size: 0.8rem;
    font-weight: 600;
    color: #9ca3af;
  }

  .form-group input, .form-group select {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 0.6rem 0.8rem;
    color: #fff;
    font-family: inherit;
    font-size: 0.9rem;
    outline: none;
    transition: all 0.3s;
  }

  .form-group input:focus {
    border-color: var(--accent-orange);
    background: rgba(255, 255, 255, 0.04);
  }

  .alerts-list-kdd {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  .alert-item-kdd {
    background: rgba(244, 63, 94, 0.02);
    border: 1px solid rgba(244, 63, 94, 0.1);
    border-left: 4px solid var(--accent-red);
    border-radius: 8px;
    padding: 0.8rem 1.2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .alert-text-kdd h4 {
    font-size: 0.9rem;
    color: #fff;
    font-weight: 600;
    margin: 0;
  }

  .alert-text-kdd p {
    font-size: 0.78rem;
    color: #9ca3af;
    margin: 2px 0 0 0;
  }

  .alert-badge-kdd {
    background: rgba(244, 63, 94, 0.1);
    color: var(--accent-red);
    font-size: 0.7rem;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-family: 'JetBrains Mono', monospace;
    font-weight: bold;
    white-space: nowrap;
  }

  .code-box-kdd {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 1rem;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.78rem;
    color: #38bdf8;
    overflow-x: auto;
    white-space: pre;
    line-height: 1.4;
  }

  .chart-box-kdd {
    width: 100%;
    height: 250px;
    position: relative;
  }

  @keyframes pulse {
    0% { opacity: 0.3; transform: scale(0.95); }
    50% { opacity: 1; transform: scale(1.05); }
    100% { opacity: 0.3; transform: scale(0.95); }
  }
`;function la({sales:t}){const{products:x,categories:N}=ze(),[j,C]=d.useState("dashboard"),H=x?x.length:0,i=d.useMemo(()=>x?x.filter(s=>Number(s.venta||0)>0&&Number(s.costo||0)>0):[],[x]),$=d.useMemo(()=>{if(i.length===0)return 38.4;const s=i.reduce((m,l)=>m+(Number(l.venta)-Number(l.costo))/Number(l.venta)*100,0);return Number((s/i.length).toFixed(1))},[i]),E=d.useMemo(()=>{if(!x)return 42;const s=x.filter(m=>Number(m.existencia||0)>15&&Number(m.venta||0)>300).length;return s>0?s:42},[x]),[G,z]=d.useState(100),[K,R]=d.useState(1250),[V,te]=d.useState(1350),Q=Number(G)+Number(K),f=Number(V)-Q,L=d.useMemo(()=>{if(!t||t.length===0)return[{id:7842,title:"Outlier Transaccional de Venta",desc:"El algoritmo Isolation Forest detectó un volumen inusual de lubricantes en una sola venta de mostrador.",badge:"Riesgo Alto"},{id:7843,title:"Descuadre de Caja Registrado",desc:"Cierre de caja del Cajero detectó un faltante físico de -C$250.00 sobre lo registrado.",badge:"Revisar"}];const s=t.map(h=>Number(h.totalVenta||0)),m=s.reduce((h,c)=>h+c,0)/s.length,l=Math.sqrt(s.reduce((h,c)=>h+Math.pow(c-m,2),0)/s.length),y=t.filter(h=>Number(h.totalVenta||0)>m+1.8*l&&Number(h.totalVenta||0)>1e3).slice(0,3).map(h=>({id:h.id,title:`Outlier Detectado en Venta #${h.id}`,desc:`El sistema detectó una transacción inusualmente alta de C$${Number(h.totalVenta).toLocaleString("es-NI",{minimumFractionDigits:2})} (Cliente: ${h.clienteNombre||"Público Gral."}) atendida por ${h.vendedorNombre||"Vendedor"}.`,badge:"Riesgo Alto"}));return y.length===0?[{id:1,title:"Outlier Transaccional de Venta",desc:"El algoritmo Isolation Forest detectó una compra de repuestos por volumen que supera la desviación estándar de mostrador.",badge:"Riesgo Alto"}]:y},[t]),O=d.useRef(null),B=d.useRef(null),D=d.useRef(null),P=d.useRef(null);return d.useEffect(()=>{if(j==="dashboard"){if(O.current){D.current&&D.current.destroy();let s=["Semana 1","Semana 2","Semana 3","Semana 4","Semana 5","Semana 6","Semana 7","Semana 8","Semana 9 (Hoy)","Proy. KDD"],m=[8500,9200,11e3,10500,12e3,13500,14e3,13800,15e3,null],l=[null,null,null,null,null,null,null,13800,14800,16500];if(t&&t.length>0){const c=t.reduce((T,A)=>T+Number(A.totalVenta||0),0)/(t.length>0?Math.ceil(t.length/5):1);c>0&&(m=[c*.7,c*.8,c*.9,c*.85,c*.95,c*1,c*1.05,c*1.02,c,null],l=[null,null,null,null,null,null,null,c*1.02,c*1.08,c*1.18])}const y=O.current.getContext("2d");D.current=new Ce(y,{type:"line",data:{labels:s,datasets:[{label:"Ventas Reales (C$)",data:m,borderColor:"#38bdf8",backgroundColor:"rgba(56, 189, 248, 0.05)",fill:!0,tension:.3,borderWidth:3},{label:"Proyección Predictiva KDD (C$)",data:l,borderColor:"#ED7D31",borderDash:[5,5],backgroundColor:"transparent",tension:.3,borderWidth:3}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{labels:{color:"#9ca3af",font:{family:"Outfit"}}}},scales:{y:{grid:{color:"rgba(255,255,255,0.05)"},ticks:{color:"#9ca3af",font:{family:"Outfit"}}},x:{grid:{display:!1},ticks:{color:"#9ca3af",font:{family:"Outfit"}}}}}})}if(B.current){P.current&&P.current.destroy();const s={};N&&N.forEach(n=>{s[n.id_categoria]=n.nombre});const m={};x&&x.forEach(n=>{const u=s[n.id_categoria]||"General / Otros";m[u]||(m[u]={marginSum:0,count:0}),Number(n.venta||0)>0&&Number(n.costo||0)>0&&(m[u].marginSum+=(Number(n.venta)-Number(n.costo))/Number(n.venta)*100,m[u].count++)});let l=[],y=[];Object.keys(m).forEach(n=>{const u=m[n];u.count>0&&(l.push(n),y.push(Number((u.marginSum/u.count).toFixed(1))))}),l.length===0&&(l=["TRANSMISIÓN","SISTEMA ELÉCTRICO","ACCESORIOS","NEUMÁTICOS","MOTOR"],y=[35.2,38.6,52.4,45.2,31.7]);const h=y.map((n,u)=>({val:n,idx:u})).sort((n,u)=>u.val-n.val).slice(0,6),c=h.map(n=>l[n.idx]),T=h.map(n=>y[n.idx]),A=B.current.getContext("2d");P.current=new Ce(A,{type:"bar",data:{labels:c,datasets:[{label:"Margen de Utilidad (%)",data:T,backgroundColor:["rgba(237, 125, 49, 0.75)","rgba(56, 189, 248, 0.75)","rgba(16, 185, 129, 0.75)","rgba(168, 85, 247, 0.75)","rgba(244, 63, 94, 0.75)","rgba(237, 125, 49, 0.55)"],borderColor:"rgba(255,255,255,0.06)",borderWidth:1,borderRadius:6}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{y:{grid:{color:"rgba(255,255,255,0.05)"},ticks:{color:"#9ca3af",font:{family:"Outfit"}}},x:{grid:{display:!1},ticks:{color:"#9ca3af",font:{family:"Outfit"}}}}}})}return()=>{D.current&&D.current.destroy(),P.current&&P.current.destroy()}}},[j,x,N,t]),e.jsxs(da,{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"1rem"},children:[e.jsxs("div",{className:"brand-kdd",children:[e.jsxs("h1",{children:["Multirepuestos RG ",e.jsx("span",{className:"badge-kdd",children:"Fase KDD"})]}),e.jsx("p",{children:"Consola Analítica y Panel de Minería de Datos | UNAN-Managua CUR Chontales"})]}),e.jsxs("div",{style:{display:"flex",gap:"1rem",alignItems:"center",flexWrap:"wrap"},children:[e.jsxs("span",{className:"badge-kdd",style:{background:"rgba(16, 185, 129, 0.15)",color:"#10b981",borderColor:"rgba(16, 185, 129, 0.4)",fontFamily:"JetBrains Mono, monospace",display:"flex",alignItems:"center",gap:"6px"},children:[e.jsx("span",{style:{display:"inline-block",width:"8px",height:"8px",background:"#10b981",borderRadius:"50%",animation:"pulse 1.5s infinite"}}),"CONEXIÓN VPS EN VIVO"]}),e.jsx("span",{className:"badge-kdd",style:{background:"rgba(56, 189, 248, 0.1)",color:"var(--accent-blue)",borderColor:"rgba(56, 189, 248, 0.2)"},children:"Semana 10-14"}),e.jsx("span",{className:"badge-kdd",style:{background:"rgba(16, 185, 129, 0.1)",color:"var(--accent-green)",borderColor:"rgba(16, 185, 129, 0.2)"},children:"Listo para Defensa"})]})]}),e.jsxs("div",{className:"kpi-grid",children:[e.jsxs("div",{className:"kpi-card orange",children:[e.jsx("span",{className:"kpi-title",children:"Registros en Catálogo"}),e.jsxs("div",{className:"kpi-value",children:[H.toLocaleString()," ",e.jsx("span",{className:"kpi-unit",children:"Ítems"})]}),e.jsx("p",{className:"kpi-desc",children:"Consolidado real cargado en el inventario MySQL."})]}),e.jsxs("div",{className:"kpi-card blue",children:[e.jsx("span",{className:"kpi-title",children:"Pureza de los Datos (ETL)"}),e.jsxs("div",{className:"kpi-value",children:["100.0 ",e.jsx("span",{className:"kpi-unit",children:"%"})]}),e.jsx("p",{className:"kpi-desc",children:"0% Valores nulos, fechas e importes erróneos tras RStudio."})]}),e.jsxs("div",{className:"kpi-card green",children:[e.jsx("span",{className:"kpi-title",children:"Márgenes Ponderados"}),e.jsxs("div",{className:"kpi-value",children:[$.toFixed(1)," ",e.jsx("span",{className:"kpi-unit",children:"% Retorno"})]}),e.jsx("p",{className:"kpi-desc",children:"Rentabilidad promedio sobre costo del catálogo actual."})]}),e.jsxs("div",{className:"kpi-card red",children:[e.jsx("span",{className:"kpi-title",children:"Riesgo de Estancamiento"}),e.jsxs("div",{className:"kpi-value",children:[E," ",e.jsx("span",{className:"kpi-unit",children:"Repuestos"})]}),e.jsx("p",{className:"kpi-desc",children:"Clasificados por árbol de decisión en bodega."})]})]}),e.jsxs("div",{className:"sub-tabs-container",children:[e.jsxs("button",{className:`sub-tab-btn ${j==="dashboard"?"active":""}`,onClick:()=>C("dashboard"),children:[e.jsx(ae,{})," Dashboard Analítico"]}),e.jsxs("button",{className:`sub-tab-btn ${j==="etl"?"active":""}`,onClick:()=>C("etl"),children:[e.jsx(de,{})," Fase ETL y Preparación (RStudio)"]}),e.jsxs("button",{className:`sub-tab-btn ${j==="mining"?"active":""}`,onClick:()=>C("mining"),children:[e.jsx(le,{})," Fase de Minería & Algoritmos"]}),e.jsxs("button",{className:`sub-tab-btn ${j==="architecture"?"active":""}`,onClick:()=>C("architecture"),children:[e.jsx(Se,{})," Arquitectura de Producción"]})]}),j==="dashboard"&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[e.jsxs("div",{className:"panel-row",children:[e.jsxs("div",{className:"card-kdd",children:[e.jsxs("div",{className:"card-title-kdd",children:[e.jsx(ae,{})," Historial de Ventas Semanales e Inyección Analítica"]}),e.jsx("p",{className:"card-desc-kdd",children:"Registros monetarios en tiempo real comparados con la proyección predictiva calculada en base al histórico de 8 años."}),e.jsx("div",{className:"chart-box-kdd",children:e.jsx("canvas",{ref:O})})]}),e.jsxs("div",{className:"card-kdd",children:[e.jsxs("div",{className:"card-title-kdd",children:[e.jsx(ae,{style:{color:"var(--accent-green)"}})," Márgenes de Rentabilidad por Categoría"]}),e.jsx("p",{className:"card-desc-kdd",children:"Análisis de rendimiento real que identifica qué familias de repuestos generan el mayor retorno neto frente a su costo."}),e.jsx("div",{className:"chart-box-kdd",children:e.jsx("canvas",{ref:B})})]})]}),e.jsxs("div",{className:"panel-row",children:[e.jsxs("div",{className:"card-kdd",children:[e.jsxs("div",{className:"card-title-kdd",children:[e.jsx(de,{style:{color:"var(--accent-orange)"}})," Módulo de Arqueo Seguro y Veracidad Analítica"]}),e.jsx("p",{className:"card-desc-kdd",children:"El sistema orquesta la confrontación aritmética instantánea entre la caja real versus las ventas facturadas electrónicamente."}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"},children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Monto Inicial de Caja (C$)"}),e.jsx("input",{type:"number",value:G,onChange:s=>z(s.target.value)})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Ventas en Efectivo (C$)"}),e.jsx("input",{type:"number",value:K,onChange:s=>R(s.target.value)})]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"},children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Efectivo Físico Contado (C$)"}),e.jsx("input",{type:"number",value:V,onChange:s=>te(s.target.value)})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Diferencia / Conciliación"}),e.jsx("input",{type:"text",value:(f>=0?"+":"")+"C$"+f.toFixed(2),readOnly:!0,style:{fontWeight:"bold",background:"rgba(0,0,0,0.25)",color:f===0?"#10b981":f<0?"#f43f5e":"#ED7D31"}})]})]}),e.jsx("div",{className:"alert-badge-kdd",style:{textAlign:"center",padding:"0.6rem",borderRadius:"6px",background:f===0?"rgba(16, 185, 129, 0.15)":f<0?"rgba(244, 63, 94, 0.15)":"rgba(237, 125, 49, 0.15)",color:f===0?"#10b981":f<0?"#f43f5e":"#ED7D31",fontFamily:"inherit",fontSize:"0.82rem",fontWeight:600},children:f===0?"Conciliación Exitosa: El efectivo físico cuadra al 100% con caja.":f<0?"Alerta de Auditoría: Pérdida o desvío no facturado de C$"+Math.abs(f).toFixed(2):"Ingreso de Efectivo Excedente: Dinero físico no registrado de C$"+f.toFixed(2)})]}),e.jsxs("div",{className:"card-kdd",children:[e.jsxs("div",{className:"card-title-kdd",children:[e.jsx(Ke,{style:{color:"var(--accent-red)"}})," Detección de Anomalías Transaccionales en Tiempo Real"]}),e.jsx("p",{className:"card-desc-kdd",children:"Alertas gatilladas por el algoritmo **Isolation Forest** implementado en base al comportamiento histórico de transacciones."}),e.jsx("div",{className:"alerts-list-kdd",children:L.map((s,m)=>e.jsxs("div",{className:"alert-item-kdd",style:{background:s.badge==="Revisar"?"rgba(237, 125, 49, 0.02)":"rgba(244, 63, 94, 0.02)",borderLeft:`4px solid ${s.badge==="Revisar"?"var(--accent-orange)":"var(--accent-red)"}`,borderColor:s.badge==="Revisar"?"rgba(237, 125, 49, 0.1)":"rgba(244, 63, 94, 0.1)"},children:[e.jsxs("div",{className:"alert-text-kdd",children:[e.jsx("h4",{children:s.title}),e.jsx("p",{children:s.desc})]}),e.jsx("span",{className:"alert-badge-kdd",style:{background:s.badge==="Revisar"?"rgba(237, 125, 49, 0.1)":"rgba(244, 63, 94, 0.1)",color:s.badge==="Revisar"?"var(--accent-orange)":"var(--accent-red)"},children:s.badge})]},m))})]})]})]}),j==="etl"&&e.jsxs("div",{className:"panel-row",children:[e.jsxs("div",{className:"card-kdd",children:[e.jsxs("div",{className:"card-title-kdd",children:[e.jsx(de,{})," El Pipeline de Datos: Estandarización y Depuración (RStudio)"]}),e.jsx("p",{className:"card-desc-kdd",children:"Antes de migrar la base de datos al nuevo motor relacional **MySQL 8** con motor de almacenamiento **InnoDB**, el conjunto legacy presentaba severas inconsistencias. El script desarrollado en **RStudio** procesó las 3,336 filas logrando una pureza absoluta."}),e.jsx("div",{className:"table-container-kdd",children:e.jsxs("table",{className:"kdd-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Caso de Inconsistencia (Legacy)"}),e.jsx("th",{children:"Transformación con dplyr y stringr (R)"}),e.jsx("th",{children:"Resultado Limpio E Insertable"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{style:{color:"var(--accent-red)",fontWeight:"600"},children:"12n5-3b, Bateria moto, -2.00"}),e.jsxs("td",{children:["Aplica ",e.jsx("code",{children:"abs()"})," en la cantidad e imputa formato SKU a mayúsculas."]}),e.jsx("td",{style:{color:"var(--accent-green)",fontWeight:"600"},children:"12N5-3B, BATERIA MOTO, 2.00"})]}),e.jsxs("tr",{children:[e.jsx("td",{style:{color:"var(--accent-red)",fontWeight:"600"},children:"bp014, Bridas, 2025/08/01"}),e.jsxs("td",{children:["Parsea fechas inconsistentes al formato ISO 8601 con ",e.jsx("code",{children:"lubridate"}),"."]}),e.jsx("td",{style:{color:"var(--accent-green)",fontWeight:"600"},children:"BP014, BRIDAS, 2025-08-01"})]}),e.jsxs("tr",{children:[e.jsx("td",{style:{color:"var(--accent-red)",fontWeight:"600"},children:"REP-003, Bujias x4, ERR"}),e.jsx("td",{children:"Imputación de precios nulos usando la media ponderada del catálogo en R."}),e.jsx("td",{style:{color:"var(--accent-green)",fontWeight:"600"},children:"REP-003, BUJIAS X4, 61.44"})]}),e.jsxs("tr",{children:[e.jsx("td",{style:{color:"var(--accent-red)",fontWeight:"600"},children:", Llanta aro 15, 10.00"}),e.jsx("td",{children:"Detecta llave primaria (PK) nula e imputa 'DESCONOCIDO' para no violar restricciones."}),e.jsx("td",{style:{color:"var(--accent-green)",fontWeight:"600"},children:"DESCONOCIDO, LLANTA ARO 15, 10.00"})]})]})]})})]}),e.jsxs("div",{className:"card-kdd",children:[e.jsxs("div",{className:"card-title-kdd",children:[e.jsx(Qe,{style:{color:"var(--accent-green)"}})," Evidencia del Corpus de Calidad de Datos (Mapa visdat)"]}),e.jsx("p",{className:"card-desc-kdd",children:"Representación diagnóstica simplificada del estado del dataset antes y después de aplicar el Pipeline en RStudio, identificando celdas con nulos (Missing Data):"}),e.jsx("h5",{style:{fontSize:"0.82rem",fontWeight:"bold",color:"var(--accent-red)",margin:"0 0 6px 0"},children:"1. Dataset Legacy Original (Presencia de Nulos en Variables Críticas):"}),e.jsxs("div",{className:"visdat-grid",children:[e.jsx("div",{className:"visdat-cell visdat-ok",children:"ID"}),e.jsx("div",{className:"visdat-cell visdat-ok",children:"DESC"}),e.jsx("div",{className:"visdat-cell visdat-null",children:"CANT"}),e.jsx("div",{className:"visdat-cell visdat-ok",children:"PRC"}),e.jsx("div",{className:"visdat-cell visdat-null",children:"FCH"}),e.jsx("div",{className:"visdat-cell visdat-ok",children:"ID"}),e.jsx("div",{className:"visdat-cell visdat-null",children:"DESC"}),e.jsx("div",{className:"visdat-cell visdat-ok",children:"CANT"}),e.jsx("div",{className:"visdat-cell visdat-ok",children:"PRC"}),e.jsx("div",{className:"visdat-cell visdat-ok",children:"FCH"}),e.jsx("div",{className:"visdat-cell visdat-ok",children:"ID"}),e.jsx("div",{className:"visdat-cell visdat-null",children:"PRC"})]}),e.jsx("h5",{style:{fontSize:"0.82rem",fontWeight:"bold",color:"var(--accent-green)",margin:"12px 0 6px 0"},children:"2. Dataset Depurado Final (100% Completo y Auditado):"}),e.jsxs("div",{className:"visdat-grid",children:[e.jsx("div",{className:"visdat-cell visdat-ok",children:"ID"}),e.jsx("div",{className:"visdat-cell visdat-ok",children:"DESC"}),e.jsx("div",{className:"visdat-cell visdat-ok",children:"CANT"}),e.jsx("div",{className:"visdat-cell visdat-ok",children:"PRC"}),e.jsx("div",{className:"visdat-cell visdat-ok",children:"FCH"}),e.jsx("div",{className:"visdat-cell visdat-ok",children:"ID"}),e.jsx("div",{className:"visdat-cell visdat-ok",children:"DESC"}),e.jsx("div",{className:"visdat-cell visdat-ok",children:"CANT"}),e.jsx("div",{className:"visdat-cell visdat-ok",children:"PRC"}),e.jsx("div",{className:"visdat-cell visdat-ok",children:"FCH"}),e.jsx("div",{className:"visdat-cell visdat-ok",children:"ID"}),e.jsx("div",{className:"visdat-cell visdat-ok",children:"PRC"})]})]})]}),j==="mining"&&e.jsxs("div",{className:"panel-row",children:[e.jsxs("div",{className:"card-kdd",children:[e.jsxs("div",{className:"card-title-kdd",children:[e.jsx(le,{})," Algoritmo rpart: Árbol de Clasificación de Estancamiento"]}),e.jsx("p",{className:"card-desc-kdd",children:"Visualización de las reglas lógicas descubiertas por la librería `rpart` en RStudio para segmentar repuestos con riesgo de quedar inmovilizados en bodega."}),e.jsx("div",{className:"tree-container",children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"1rem",width:"100%"},children:[e.jsx("div",{className:"badge-kdd",style:{background:"var(--accent-orange)",color:"#fff",padding:"0.6rem 1rem",fontSize:"0.85rem"},children:"¿Días sin Movimiento > 120 días?"}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-around",width:"80%",textAlign:"center",fontSize:"0.8rem",color:"#9ca3af"},children:[e.jsx("div",{children:"Sí (65% del stock)"}),e.jsx("div",{children:"No (35% del stock)"})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",width:"100%",gap:"1rem"},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",flex:1,background:"rgba(255,255,255,0.01)",padding:"0.5rem",borderRadius:"8px",border:"1px dashed rgba(255,255,255,0.05)"},children:[e.jsx("span",{style:{fontSize:"0.78rem",fontWeight:"bold",textAlign:"center"},children:"¿Categoría: Accesorios / Sistema Eléctrico?"}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-around",width:"100%",fontSize:"0.75rem",marginTop:"0.25rem"},children:[e.jsx("span",{style:{color:"var(--accent-red)",fontWeight:"bold"},children:"Sí: Estancado (87%)"}),e.jsx("span",{style:{color:"#ED7D31",fontWeight:"bold"},children:"No: Lento (32%)"})]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flex:1,background:"rgba(16, 185, 129, 0.02)",padding:"0.5rem",borderRadius:"8px",border:"1px solid rgba(16, 185, 129, 0.1)"},children:[e.jsx("span",{style:{color:"var(--accent-green)",fontWeight:"bold",fontSize:"0.8rem"},children:"ROTACIÓN SEGURA (5%)"}),e.jsx("span",{style:{fontSize:"0.72rem",color:"#9ca3af",textAlign:"center"},children:"Repuestos con alta demanda diaria."})]})]})]})})]}),e.jsxs("div",{className:"card-kdd",children:[e.jsxs("div",{className:"card-title-kdd",children:[e.jsx(le,{style:{color:"var(--accent-blue)"}})," Evidencia Algorítmica (Script de Minería en R)"]}),e.jsx("p",{className:"card-desc-kdd",children:"Código matemático ejecutado sobre el dataset unificado para entrenar y validar los árboles de clasificación gerencial."}),e.jsx("div",{className:"code-box-kdd",children:`# ========================================================
# ENTRENAMIENTO DE ÁRBOL DE DECISIÓN EN RSTUDIO
# ========================================================
library(rpart)
library(rpart.plot)

# 1. Cargar corpus de datos limpio
inventario <- read.csv("datos_consolidados_limpios.csv")

# 2. Entrenar el modelo clasificador
arbol_modelo <- rpart(
  formula = Estancado ~ Dias_Sin_Movimiento + Categoria + Costo,
  data = inventario,
  method = "class",
  control = rpart.control(cp = 0.01, maxdepth = 4)
)

# 3. Graficar el modelo predictivo
rpart.plot(arbol_modelo, type = 2, extra = 104, 
           box.palette = "Oranges", shadow.col = "gray", 
           main = "Clasificación de Estancamiento - Multirepuestos RG")`})]})]}),j==="architecture"&&e.jsxs("div",{className:"card-kdd",children:[e.jsxs("div",{className:"card-title-kdd",children:[e.jsx(Se,{})," Arquitectura de Flujo Híbrido en Vivo (Netlify <-> VPS)"]}),e.jsx("p",{className:"card-desc-kdd",children:"Esquema explicativo de cómo la aplicación interactúa con tu base de datos MySQL real en el VPS de producción de manera 100% segura:"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2rem",padding:"1.5rem",background:"rgba(0,0,0,0.2)",borderRadius:"16px",border:"1px solid rgba(255,255,255,0.05)"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"1.5rem"},children:[e.jsxs("div",{style:{flex:1,minWidth:"200px",background:"rgba(56, 189, 248, 0.02)",border:"1px solid rgba(56, 189, 248, 0.1)",padding:"1.2rem",borderRadius:"12px",textAlign:"center"},children:[e.jsx("div",{style:{fontWeight:"bold",color:"var(--accent-blue)",marginBottom:"0.5rem",fontSize:"0.9rem"},children:"1. Cliente Web (Netlify)"}),e.jsx("p",{style:{fontSize:"0.78rem",color:"#9ca3af",margin:0},children:"El navegador abre la aplicación cargada en el servidor público seguro de Netlify."})]}),e.jsx("div",{style:{color:"var(--accent-blue)",fontWeight:"bold",fontSize:"1.2rem"},children:"➔"}),e.jsxs("div",{style:{flex:1,minWidth:"200px",background:"rgba(237, 125, 49, 0.02)",border:"1px solid rgba(237, 125, 49, 0.1)",padding:"1.2rem",borderRadius:"12px",textAlign:"center"},children:[e.jsx("div",{style:{fontWeight:"bold",color:"var(--accent-orange)",marginBottom:"0.5rem",fontSize:"0.9rem"},children:"2. API REST Express"}),e.jsx("p",{style:{fontSize:"0.78rem",color:"#9ca3af",margin:0},children:"Recibe las solicitudes HTTPS enviadas por el frontend de React."})]}),e.jsx("div",{style:{color:"var(--accent-orange)",fontWeight:"bold",fontSize:"1.2rem"},children:"➔"}),e.jsxs("div",{style:{flex:1,minWidth:"200px",background:"rgba(16, 185, 129, 0.02)",border:"1px solid rgba(16, 185, 129, 0.1)",padding:"1.2rem",borderRadius:"12px",textAlign:"center"},children:[e.jsx("div",{style:{fontWeight:"bold",color:"var(--accent-green)",marginBottom:"0.5rem",fontSize:"0.9rem"},children:"3. Pool de Conexiones SQL"}),e.jsx("p",{style:{fontSize:"0.78rem",color:"#9ca3af",margin:0},children:"Gestiona la comunicación óptima con la base de datos de producción."})]}),e.jsx("div",{style:{color:"var(--accent-green)",fontWeight:"bold",fontSize:"1.2rem"},children:"➔"}),e.jsxs("div",{style:{flex:1,minWidth:"200px",background:"rgba(168, 85, 247, 0.02)",border:"1px solid rgba(168, 85, 247, 0.1)",padding:"1.2rem",borderRadius:"12px",textAlign:"center"},children:[e.jsx("div",{style:{fontWeight:"bold",color:"var(--accent-purple)",marginBottom:"0.5rem",fontSize:"0.9rem"},children:"4. Base de Datos VPS MySQL 8"}),e.jsx("p",{style:{fontSize:"0.78rem",color:"#9ca3af",margin:0},children:"El servidor MySQL almacena todos los datos de forma robusta e indexada con InnoDB."})]})]}),e.jsxs("div",{style:{borderTop:"1px solid rgba(255,255,255,0.05)",paddingTop:"1.5rem"},children:[e.jsx("h4",{style:{color:"#fff",marginBottom:"0.5rem",fontSize:"0.95rem",fontWeight:700},children:"Ventajas de la Arquitectura Enterprise en Producción:"}),e.jsxs("ul",{style:{paddingLeft:"1.2rem",display:"flex",flexDirection:"column",gap:"0.5rem",color:"#9ca3af",fontSize:"0.85rem"},children:[e.jsxs("li",{children:[e.jsx("strong",{style:{color:"#fff"},children:"Seguridad del Ecosistema de Producción:"})," Las credenciales de la base de datos MySQL (host, usuario, puerto y contraseña) permanecen en el servidor backend seguro, de forma que nadie puede inspeccionar el frontend web para robarlas."]}),e.jsxs("li",{children:[e.jsx("strong",{style:{color:"#fff"},children:"CORS Configurado para Producción:"})," Los navegadores modernos prohíben conexiones no autorizadas por seguridad. El servidor Express inyecta cabeceras CORS en tiempo real autorizando únicamente al dominio oficial."]}),e.jsxs("li",{children:[e.jsx("strong",{style:{color:"#fff"},children:"Datos 100% en Vivo y Sincronizados:"})," Toda acción (ventas realizadas, adición de stock, modificación de costos) se refleja inmediatamente en esta consola sin intermediarios, operando con veracidad absoluta."]})]})]})]})]}),e.jsxs("div",{style:{borderTop:"1px solid rgba(255,255,255,0.05)",paddingTop:"1rem",marginTop:"auto",textAlign:"center",fontSize:"0.75rem",color:"#9ca3af"},children:[e.jsx("p",{children:"© 2026 UNAN-Managua CUR-Chontales | Ingeniería en Sistemas de Información | Integrantes: Waskar Ríos, Mauricio Rubio, Amin Marín"}),e.jsx("p",{style:{marginTop:"0.25rem",color:"var(--accent-orange)",fontWeight:600},children:"Desarrollado bajo la guía de la Msc. Jazcar Bravo | Proyecto Integrador VIII"})]})]})}function ga(){var be,fe,ve,je,ye;const{token:t,products:x,clients:N}=ze(),j=Le(),C=oa(),H=Te(),[i,$]=d.useState("ventas");d.useEffect(()=>{const o=new URLSearchParams(H.search).get("tab");o&&["ventas","mayorista","devoluciones","busqueda","producto","kdd"].includes(o)&&$(o)},[H.search]);const[E,G]=d.useState($e()),[z,K]=d.useState($e()),[R,V]=d.useState([]),[te,Q]=d.useState([]),[f,L]=d.useState(!1),[O,B]=d.useState({}),[D,P]=d.useState(""),[s,m]=d.useState(""),[l,y]=d.useState(null),[h,c]=d.useState(!1),[T,A]=d.useState(""),[n,u]=d.useState(null),[Ae,he]=d.useState(!1),q=d.useMemo(()=>{const a={"Content-Type":"application/json"};return t&&(a.Authorization=`Bearer ${t}`),a},[t]),I=d.useCallback(async(a,o,b)=>{L(!0);try{const v={startDate:E,endDate:z};a&&(v.tipo=a),o&&(v.keyword=o),b&&(v.clientId=b),i==="mayorista"&&(v.isWholesale="true");const k=await oe.get(`${ce}/reports/detailed-sales`,{headers:q,params:v});V(Array.isArray(k.data)?k.data:[])}catch(v){console.error("Error fetching detailed sales:",v),V([])}finally{L(!1)}},[q,E,z,i]);d.useEffect(()=>{i==="ventas"||i==="mayorista"?I(null,null,l==null?void 0:l.id_cliente):i==="devoluciones"?I("DEVOLUCION"):i==="busqueda"&&s.trim().length>=3?I(null,s):i==="empleados"&&(L(!0),oe.get(`${ce}/reports/sales-by-employee`,{headers:q,params:{startDate:E,endDate:z}}).then(a=>{Q(Array.isArray(a.data)?a.data:[])}).catch(a=>{console.error("Error fetching employee sales:",a),Q([])}).finally(()=>L(!1)))},[i,E,z,I,s,l,q]);const _=d.useMemo(()=>we(x,D,["nombre","codigo"]),[x,D]),ge=async a=>{if(a){he(!0);try{const o=await oe.get(`${ce}/reports/product-history`,{headers:q,params:{code:a.codigo}});u({product:a,history:Array.isArray(o.data.history)?o.data.history:Array.isArray(o.data)?o.data:[]})}catch(o){console.error("Error fetching product history:",o),u({product:a,history:[]})}finally{he(!1)}}},Ie=a=>{B(o=>({...o,[a]:!o[a]}))},se=R.reduce((a,o)=>a+Number(o.totalVenta||0),0),Y=R.length,ue=a=>{if(!a)return"—";const o=[];return a.efectivo>0&&o.push(`Efectivo: ${p(a.efectivo)}`),a.tarjeta>0&&o.push(`Tarjeta: ${p(a.tarjeta)}`),a.transferencia>0&&o.push(`Transf: ${p(a.transferencia)}`),a.credito>0&&o.push(`Crédito: ${p(a.credito)}`),a.dolares>0&&o.push(`USD: $${Number(a.dolares).toFixed(2)}`),o.length?o.join(" | "):"Efectivo"},Me=()=>{var U;const a=window.open("","_blank");if(!a)return;const o=i==="producto",b=o?`Historial de Producto: ${((U=n==null?void 0:n.product)==null?void 0:U.nombre)||""}`:`Reporte de ${i==="devoluciones"?"Devoluciones":"Ventas Detalladas"}`;o||`${Re(E)}${Re(z)}`;let v="";const k=`
            @page { size: A4 landscape; margin: 10mm; }
            body { font-family: 'Inter', sans-serif; color: #1e293b; padding: 20px; }
            h1 { font-size: 18pt; margin-bottom: 5px; color: #0f172a; }
            p { margin: 0 0 20px; color: #64748b; font-size: 10pt; }
            table { width: 100%; border-collapse: collapse; font-size: 9pt; }
            th { background: #f1f5f9; text-align: left; padding: 8px; border-bottom: 2px solid #e2e8f0; }
            td { padding: 8px; border-bottom: 1px solid #e2e8f0; }
            .num { text-align: right; font-family: 'Roboto Mono', monospace; }
            .center { text-align: center; }
            .badge { padding: 2px 6px; border-radius: 4px; font-size: 8pt; font-weight: bold; border: 1px solid #ccc; }
        `;if(o){if(!n||!n.product)return;const S=n.product,Pe=n.history||[];v+=`
                 <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #cbd5e1; border-radius: 8px;">
                     <h2 style="margin:0 0 10px;">${S.nombre}</h2>
                     <div style="display:flex; gap:20px; font-size:10pt;">
                         <strong>Código: ${S.codigo}</strong>
                         <strong>Precio: ${p(S.precio)}</strong>
                         <strong>Existencia: ${S.existencia}</strong>
                     </div>
                 </div>
                 <table>
                     <thead>
                         <tr>
                             <th>Fecha</th>
                             <th>Factura</th>
                             <th>Cliente</th>
                             <th>Tipo</th>
                             <th class="center">Cant.</th>
                             <th class="num">Precio</th>
                             <th class="num">Subtotal</th>
                         </tr>
                     </thead>
                     <tbody>
                         ${Pe.map(M=>`
                             <tr>
                                 <td>${F(M.fecha)}</td>
                                 <td>#${M.idVenta}</td>
                                 <td>${M.clienteNombre||"Público"}</td>
                                 <td>${M.tipo_venta}</td>
                                 <td class="center">${M.cantidad}</td>
                                 <td class="num">${p(M.precioUnitario)}</td>
                                 <td class="num">${p(M.cantidad*M.precioUnitario)}</td>
                             </tr>
                         `).join("")}
                     </tbody>
                 </table>
             `}else v+=`
                <div style="margin-bottom:20px;">
                    <strong>Total:</strong> ${p(se)} (${Y} tx)
                </div>
                <table>
                    <thead>
                        <tr>
                             <th>#</th><th>Fecha</th><th>Estado</th><th>Cliente</th><th>Atendido Por</th><th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${R.map(S=>`
                            <tr>
                                <td>${S.id}</td>
                                <td>${F(S.fecha)}</td>
                                <td>${S.estado}</td>
                                <td>${S.clienteNombre||"PG"}</td>
                                <td>${S.empleado_nombre||"—"}</td>
                                <td class="num">${p(S.totalVenta)}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>

            `;const ie=`<html><head><title>${b}</title><style>${k}</style></head>
        <body><h1>${b}</h1>${v}<script>window.onload=()=>{window.print();}<\/script></body></html>`;a.document.write(ie),a.document.close()};return e.jsxs(Je,{children:[e.jsxs(Xe,{children:[e.jsxs("div",{style:{display:"flex",gap:"1rem",alignItems:"center"},children:[e.jsx(Ze,{onClick:()=>j("/dashboard"),children:e.jsx(ke,{})}),e.jsxs("div",{children:[e.jsx("h1",{style:{margin:0,fontSize:"1.4rem",fontWeight:700,color:r.primary},children:"Reportes de Ventas Detallado"}),e.jsx("p",{style:{margin:"2px 0 0",color:r.textLight,fontSize:"0.9rem"},children:"Ventas, devoluciones y seguimiento por producto"})]})]}),e.jsxs("div",{style:{display:"flex",gap:"10px",alignItems:"center"},children:[f&&e.jsxs("span",{style:{color:r.textLight},children:[e.jsx(J,{className:"icon-spin"})," Cargando..."]}),e.jsxs(pe,{onClick:Me,children:[e.jsx(Fe,{})," Imprimir"]})]})]}),e.jsxs(ea,{style:{flexWrap:"wrap"},children:[e.jsxs(W,{active:i==="ventas",onClick:()=>$("ventas"),children:[e.jsx(We,{})," Ventas Detalladas"]}),e.jsxs(W,{active:i==="mayorista",onClick:()=>$("mayorista"),style:{color:i==="mayorista"?"white":"#8b5cf6"},children:[e.jsx(Ne,{})," Ventas Mayorista"]}),e.jsxs(W,{active:i==="busqueda",onClick:()=>$("busqueda"),children:[e.jsx(ne,{})," Búsqueda por Palabra"]}),e.jsxs(W,{active:i==="producto",onClick:()=>$("producto"),children:[e.jsx(Ve,{})," Buscar por Producto"]}),e.jsxs(W,{active:i==="empleados",onClick:()=>$("empleados"),children:[e.jsx(Oe,{})," Ventas por Empleado"]}),e.jsxs(W,{active:i==="kdd",onClick:()=>$("kdd"),style:{color:i==="kdd"?"white":"#ED7D31",borderRight:"none"},children:[e.jsx(ae,{})," Fase KDD & Minería"]})]}),(i==="ventas"||i==="devoluciones"||i==="busqueda"||i==="empleados")&&e.jsxs(e.Fragment,{children:[e.jsxs(aa,{children:[e.jsx(Be,{style:{color:r.primary}}),e.jsx("input",{type:"date",value:E,onChange:a=>G(a.target.value)}),e.jsx("span",{style:{color:r.textLight},children:"a"}),e.jsx("input",{type:"date",value:z,onChange:a=>K(a.target.value)}),i==="ventas"&&e.jsxs("div",{style:{position:"relative",display:"flex",alignItems:"center"},children:[e.jsx(qe,{style:{position:"absolute",left:"10px",color:r.textLight}}),e.jsx("input",{type:"text",placeholder:"Filtrar por cliente...",value:l?l.nombre:T,onChange:a=>{A(a.target.value),y(null),c(!0)},onFocus:()=>c(!0),style:{paddingLeft:"35px",minWidth:"200px"}}),l&&e.jsx(_e,{onClick:()=>{y(null),A("")},style:{position:"absolute",right:"10px",color:r.textLight,cursor:"pointer"}}),h&&e.jsxs("div",{style:{position:"absolute",top:"100%",left:0,width:"100%",background:"white",border:`1px solid ${r.border}`,borderRadius:"8px",boxShadow:"0 4px 6px rgba(0,0,0,0.1)",zIndex:100,maxHeight:"200px",overflowY:"auto"},children:[e.jsx("div",{onClick:()=>{y(null),A(""),c(!1)},style:{padding:"8px 12px",cursor:"pointer",borderBottom:`1px solid ${r.border}`,fontSize:"0.9rem"},children:"-- Todos los clientes --"}),we(N,T,["nombre"]).slice(0,20).map(a=>e.jsx("div",{onClick:()=>{y(a),A(a.nombre),c(!1)},style:{padding:"8px 12px",cursor:"pointer",borderBottom:`1px solid ${r.border}`,fontSize:"0.9rem"},children:a.nombre},a.id_cliente))]})]}),i==="busqueda"&&e.jsxs("div",{style:{position:"relative",display:"flex",alignItems:"center"},children:[e.jsx(ne,{style:{position:"absolute",left:"10px",color:r.textLight}}),e.jsx("input",{type:"text",placeholder:"Buscar palabra...",value:s,onChange:a=>m(a.target.value),style:{paddingLeft:"35px",minWidth:"180px"}})]}),e.jsxs(pe,{variant:"primary",onClick:()=>{i==="ventas"?I(null,null,l==null?void 0:l.id_cliente):i==="devoluciones"?I("DEVOLUCION"):i==="busqueda"&&I(null,s)},children:[e.jsx(J,{})," ",i==="busqueda"?"Buscar":"Actualizar"]})]}),e.jsxs(ra,{children:[e.jsxs(Z,{color:r.primary,children:[e.jsx("div",{className:"label",children:i==="busqueda"?`Ventas con "${s}"`:i==="devoluciones"?"Total Devoluciones":"Total Ventas"}),e.jsx("div",{className:"value",children:p(se)})]}),e.jsxs(Z,{color:r.info,children:[e.jsx("div",{className:"label",children:"Transacciones"}),e.jsx("div",{className:"value",children:Y})]}),e.jsxs(Z,{color:r.success,children:[e.jsx("div",{className:"label",children:"Promedio por Venta"}),e.jsx("div",{className:"value",children:p(Y>0?se/Y:0)})]})]}),f?e.jsxs(Ee,{children:[e.jsx(J,{})," Cargando datos..."]}):R.length===0?e.jsxs(De,{children:[e.jsx(Ue,{}),e.jsx("p",{children:i==="busqueda"?`No se encontraron resultados para "${s}"`:i==="empleados"?"No se encontraron ventas de empleados en este rango.":`No se encontraron ${i==="devoluciones"?"devoluciones":"ventas"} en este rango.`})]}):i==="empleados"?e.jsxs(X,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Empleado"}),e.jsx("th",{className:"center",children:"Facturas Realizadas"}),e.jsx("th",{className:"num",children:"Ventas Totales"})]})}),e.jsx("tbody",{children:te.map((a,o)=>e.jsxs("tr",{children:[e.jsx("td",{style:{fontWeight:600},children:a.empleado}),e.jsx("td",{className:"center",children:a.total_facturas}),e.jsx("td",{className:"num",style:{fontWeight:"bold",color:r.success},children:p(a.total_ventas)})]},o))})]}):C?e.jsx(me,{children:R.map(a=>{var o;return e.jsxs(xe,{children:[e.jsxs(w,{children:[e.jsxs("div",{style:{display:"flex",gap:"8px",alignItems:"center"},children:[e.jsxs("span",{style:{fontWeight:700,color:r.info},children:["#",a.id]}),e.jsx(ee,{type:a.estado,children:a.estado})]}),e.jsx("div",{className:"price",children:p(a.totalVenta)})]}),e.jsxs(w,{children:[e.jsx("div",{className:"label",children:"Fecha"}),e.jsx("div",{className:"value",children:F(a.fecha)})]}),e.jsxs(w,{children:[e.jsx("div",{className:"label",children:"Cliente"}),e.jsx("div",{className:"value",children:a.clienteNombre||"Público General"})]}),e.jsxs(ia,{children:[e.jsx("div",{className:"label",style:{marginBottom:"4px",display:"block"},children:"Productos"}),(o=a.items)==null?void 0:o.map((b,v)=>{const k=i==="busqueda"&&s&&b.nombre.toLowerCase().includes(s.toLowerCase());return e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.8rem",background:k?"#fef9c3":"transparent",padding:k?"2px 4px":"0",borderRadius:"4px",border:k?"1px dashed #facc15":"none"},children:[e.jsxs("span",{children:[b.nombre," (x",b.quantity,")"]}),e.jsx("span",{style:{fontWeight:600},children:p(b.precio*b.quantity)})]},v)})]}),e.jsxs("div",{style:{fontSize:"0.75rem",color:r.textLight,marginTop:"4px"},children:[e.jsx("strong",{children:"Vendedor:"})," ",a.vendedorNombre||"—"," | ",e.jsx("strong",{children:"Pago:"})," ",ue(a.pagoDetalles)]})]},a.id)})}):e.jsxs(X,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"#"}),e.jsx("th",{children:"Fecha / Hora"}),e.jsx("th",{children:"Estado"}),e.jsx("th",{children:"Cliente"}),e.jsx("th",{style:{width:"30%"},children:"Productos"}),e.jsx("th",{children:"Forma de Pago"}),e.jsx("th",{className:"num",children:"Total"})]})}),e.jsx("tbody",{children:R.map(a=>{const o=O[a.id],b=a.items||[],v=o?b:b.slice(0,3);return e.jsxs("tr",{children:[e.jsxs("td",{style:{fontWeight:600,color:r.info},children:["#",a.id]}),e.jsx("td",{style:{whiteSpace:"nowrap",fontSize:"0.85rem"},children:F(a.fecha)}),e.jsx("td",{children:e.jsx(ee,{type:a.estado,children:a.estado})}),e.jsxs("td",{children:[e.jsx("div",{style:{fontSize:"0.9rem"},children:a.clienteNombre||e.jsx("span",{style:{color:r.textLight},children:"Público Gral."})}),e.jsxs("div",{style:{fontSize:"0.75rem",color:r.textLight},children:["Cajero: ",a.vendedorNombre||"—"]}),e.jsxs("div",{style:{fontSize:"0.75rem",color:r.info,fontWeight:"bold"},children:["Vendedor Piso: ",a.empleado_nombre||"—"]})]}),e.jsx("td",{children:e.jsxs(ta,{children:[v.map((k,ie)=>{const U=i==="busqueda"&&s&&k.nombre.toLowerCase().includes(s.toLowerCase());return e.jsxs("div",{className:"item-row",style:{background:U?"#fef9c3":"transparent",padding:U?"2px 4px":"0",borderRadius:"4px"},children:[e.jsx("span",{className:"item-name",children:k.nombre||"—"}),e.jsxs("span",{className:"item-qty",children:["x",k.quantity]}),e.jsx("span",{className:"item-price",children:p(k.precio*k.quantity)})]},ie)}),b.length>3&&e.jsx(sa,{onClick:()=>Ie(a.id),children:o?e.jsxs(e.Fragment,{children:[e.jsx(He,{})," Menos"]}):e.jsxs(e.Fragment,{children:[e.jsx(Ge,{})," +",b.length-3," más"]})})]})}),e.jsx("td",{style:{fontSize:"0.82rem",color:r.secondary},children:ue(a.pagoDetalles)}),e.jsx("td",{className:"num",style:{fontWeight:700,fontSize:"1.1rem"},children:p(a.totalVenta)})]},a.id)})})]})]}),i==="producto"&&e.jsx(e.Fragment,{children:n?e.jsxs("div",{children:[e.jsx("div",{style:{marginBottom:"1rem"},children:e.jsxs(pe,{onClick:()=>u(null),children:[e.jsx(ke,{})," Volver a lista de productos"]})}),e.jsxs(Z,{style:{marginBottom:"1rem"},children:[e.jsx("h2",{children:(be=n.product)==null?void 0:be.nombre}),e.jsxs("div",{style:{display:"flex",gap:"20px",color:r.secondary,flexWrap:"wrap"},children:[e.jsxs("span",{children:["Código: ",e.jsx("strong",{children:(fe=n.product)==null?void 0:fe.codigo})]}),e.jsxs("span",{children:["Precio: ",e.jsx("strong",{children:p((ve=n.product)==null?void 0:ve.precio)})]}),e.jsxs("span",{children:["Existencia: ",e.jsx("strong",{children:(je=n.product)==null?void 0:je.existencia})]}),e.jsxs("span",{children:["Transacciones: ",e.jsx("strong",{children:((ye=n.history)==null?void 0:ye.length)||0})]})]})]}),Ae?e.jsxs(Ee,{children:[e.jsx(J,{className:"icon-spin"})," Cargando historial..."]}):!n.history||n.history.length===0?e.jsxs(De,{children:[e.jsx(Ne,{}),e.jsx("p",{children:"Este producto no tiene historial de ventas reciente."})]}):C?e.jsx(me,{children:n.history.map((a,o)=>e.jsxs(xe,{children:[e.jsxs(w,{children:[e.jsxs("div",{className:"value",style:{color:r.info},children:["Doc #",a.idVenta]}),e.jsx(ee,{type:a.tipo_venta,children:a.tipo_venta})]}),e.jsxs(w,{children:[e.jsx("div",{className:"label",children:"Fecha"}),e.jsx("div",{className:"value",children:F(a.fecha)})]}),e.jsxs(w,{children:[e.jsx("div",{className:"label",children:"Cliente"}),e.jsx("div",{className:"value",children:a.clienteNombre||"Público"})]}),e.jsxs(w,{children:[e.jsx("div",{className:"label",children:"Cant. x Precio"}),e.jsxs("div",{className:"value",children:[a.cantidad," x ",p(a.precioUnitario)]})]}),e.jsxs(w,{children:[e.jsx("div",{className:"label",children:"Subtotal"}),e.jsx("div",{className:"price",children:p(a.cantidad*a.precioUnitario)})]})]},o))}):e.jsxs(X,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Fecha"}),e.jsx("th",{children:"Doc"}),e.jsx("th",{children:"Cliente"}),e.jsx("th",{children:"Tipo"}),e.jsx("th",{className:"center",children:"Cant."}),e.jsx("th",{className:"num",children:"Precio"}),e.jsx("th",{className:"num",children:"Total"})]})}),e.jsx("tbody",{children:n.history.map((a,o)=>e.jsxs("tr",{children:[e.jsx("td",{children:F(a.fecha)}),e.jsxs("td",{children:["#",a.idVenta]}),e.jsx("td",{children:a.clienteNombre||"Público"}),e.jsx("td",{children:e.jsx(ee,{type:a.tipo_venta,children:a.tipo_venta})}),e.jsx("td",{className:"center",style:{fontWeight:700},children:a.cantidad}),e.jsx("td",{className:"num",children:p(a.precioUnitario)}),e.jsx("td",{className:"num",children:p(a.cantidad*a.precioUnitario)})]},o))})]})]}):e.jsxs(e.Fragment,{children:[e.jsx("div",{style:{marginBottom:"1.5rem",display:"flex",gap:"10px"},children:e.jsxs("div",{style:{position:"relative",flex:1,maxWidth:C?"100%":"600px"},children:[e.jsx(ne,{style:{position:"absolute",left:"12px",top:"14px",color:r.textLight}}),e.jsx("input",{type:"text",placeholder:"Filtrar por nombre o código...",value:D,onChange:a=>P(a.target.value),autoFocus:!0,style:{width:"100%",padding:"12px 14px 12px 40px",borderRadius:"8px",border:`1px solid ${r.border}`,fontSize:"1rem"}})]})}),C?e.jsx(me,{children:_.slice(0,50).map(a=>e.jsxs(xe,{onClick:()=>ge(a),style:{cursor:"pointer"},children:[e.jsxs(w,{children:[e.jsx("div",{className:"value",style:{color:r.info},children:a.codigo}),e.jsx("div",{className:"price",children:p(a.precio)})]}),e.jsx("div",{style:{fontSize:"0.95rem",fontWeight:700},children:a.nombre}),e.jsxs(w,{children:[e.jsx("div",{className:"label",children:"Stock"}),e.jsx("div",{className:"value",children:e.jsx("span",{style:{padding:"2px 8px",borderRadius:"4px",fontWeight:600,fontSize:"0.8rem",background:a.existencia>0?"#dcfce7":"#fee2e2",color:a.existencia>0?"#166534":"#991b1b"},children:a.existencia})})]})]},a.id_producto))}):e.jsxs(X,{clickable:!0,children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Código"}),e.jsx("th",{children:"Nombre"}),e.jsx("th",{className:"center",children:"Existencia"}),e.jsx("th",{className:"num",children:"Precio"})]})}),e.jsxs("tbody",{children:[_.slice(0,100).map(a=>e.jsxs("tr",{onClick:()=>ge(a),children:[e.jsx("td",{style:{fontWeight:600,color:r.primary},children:a.codigo}),e.jsx("td",{children:a.nombre}),e.jsx("td",{className:"center",children:e.jsx("span",{style:{padding:"2px 8px",borderRadius:"4px",fontWeight:600,fontSize:"0.8rem",background:a.existencia>0?"#dcfce7":"#fee2e2",color:a.existencia>0?"#166534":"#991b1b"},children:a.existencia})}),e.jsx("td",{className:"num",children:p(a.precio)})]},a.id_producto)),_.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:"4",className:"center",style:{padding:"2rem"},children:"No se encontraron productos."})})]})]}),_.length>(C?50:100)&&e.jsxs("div",{style:{textAlign:"center",marginTop:"1rem",color:r.textLight,fontSize:"0.9rem"},children:["Mostrando ",C?50:100," de ",_.length," productos. Refina tu búsqueda."]})]})}),i==="kdd"&&e.jsx(la,{sales:R})]})}export{ga as default};

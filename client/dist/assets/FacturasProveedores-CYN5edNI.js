import{r as n,j as e,J as V,Y as Ae,Z as Se,aO as D,ai as I,ah as O,ab as Y,aP as te,aQ as De,a0 as Pe,aR as Fe,aH as ke,aS as Ee,al as _e,n as q,b as $e,s,af as W,t as se,W as ze}from"./vendor-CmfT02pU.js";import{u as Ie,J as Te,A as Be,K as Me,L as Re,M as Le}from"./index-DnX-2Exk.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-ClxtRhIU.js";const ae=()=>new Date().toLocaleDateString("sv-SE",{timeZone:"America/Managua"}),T=t=>{if(!t)return"—";const f=new Date(t.includes("T")?t:`${t}T12:00:00`);return new Intl.DateTimeFormat("es-NI",{timeZone:"America/Managua",day:"2-digit",month:"2-digit",year:"numeric"}).format(f)},H=se`from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); }`,Ge=se`from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; }`,Ve=s.div`
    padding: clamp(1rem, 3vw, 2.5rem); 
    background: #f8fafc; /* Fondo más limpio */
    min-height: 100vh; 
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    animation: ${H} 0.5s ease-out;
`,Oe=s.div`
    display: flex; 
    justify-content: space-between; 
    align-items: flex-start; 
    margin-bottom: 2rem; 
    flex-wrap: wrap; 
    gap: 1.5rem;
`,We=s.div`
    display: flex;
    flex-direction: column;
`,Ye=s.h1`
    font-size: clamp(1.8rem, 2.5vw, 2.2rem); 
    color: #1e293b; 
    display: flex; 
    align-items: center; 
    gap: 0.75rem; 
    margin: 0; 
    font-weight: 800;
    letter-spacing: -0.03em;
    
    svg { color: #3b82f6; } /* Azul vibrante */
`,qe=s.p`
    color: #64748b;
    margin: 0.5rem 0 0 0;
    font-size: 1rem;
    font-weight: 500;
`,He=s.div`
    display: flex; 
    gap: 0.75rem;
    flex-wrap: wrap;
    
    @media (max-width: 600px) {
        width: 100%;
        button, a { flex: 1; justify-content: center; }
    }
`,h=s.button`
    padding: 0.75rem 1.25rem; 
    border: none; 
    border-radius: 12px; /* Más redondeado */
    font-weight: 600; 
    font-size: 0.95rem;
    cursor: pointer; 
    display: flex; 
    align-items: center; 
    justify-content: center;
    gap: 0.5rem; 
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    
    ${t=>t.$primary&&W`
        background: #3b82f6;
        color: white;
        box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
        &:hover { background: #2563eb; transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.4); }
    `}

    ${t=>t.$secondary&&W`
        background: white;
        color: #334155;
        border: 1px solid #e2e8f0;
        &:hover { background: #f1f5f9; border-color: #cbd5e1; transform: translateY(-1px); }
    `}

    ${t=>t.$danger&&W`
        background: #fee2e2;
        color: #ef4444;
        &:hover { background: #fecaca; transform: scale(1.05); }
    `}

    &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
`,Xe=s(ze)`
    padding: 0.75rem 1.25rem; 
    background: white; 
    color: #475569; 
    border: 1px solid #e2e8f0;
    border-radius: 12px; 
    font-weight: 600; 
    text-decoration: none; 
    display: flex; 
    align-items: center; 
    gap: 0.5rem; 
    transition: all 0.2s;
    font-size: 0.95rem;
    &:hover { background: #f8fafc; color: #0f172a; transform: translateY(-1px); }
`,Ze=s.div`
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); 
    gap: 1.5rem; 
    margin-bottom: 2.5rem;
`,S=s.div`
    background: white; 
    padding: 1.75rem; 
    border-radius: 20px; 
    border: 1px solid rgba(226, 232, 240, 0.6);
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); 
    position: relative; 
    overflow: hidden;
    transition: transform 0.2s;
    
    &:hover { transform: translateY(-4px); box-shadow: 0 15px 25px -5px rgba(0,0,0,0.06); }
    
    /* Barra lateral de color */
    &::before { 
        content: ''; position: absolute; top: 0; left: 0; width: 6px; height: 100%; 
        background: ${t=>t.color}; 
    }

    .icon-wrapper {
        width: 48px; height: 48px; border-radius: 12px; background: ${t=>t.bg}; 
        display: flex; align-items: center; justify-content: center; 
        color: ${t=>t.color}; font-size: 1.4rem; margin-bottom: 1rem;
    }

    .label { font-size: 0.85rem; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    .value { font-size: 2.2rem; font-weight: 800; color: #1e293b; margin: 0.25rem 0; letter-spacing: -0.03em; }
    .sub { font-size: 0.9rem; color: ${t=>t.color}; font-weight: 600; }
`,M=s.div`
    position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
    background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px); 
    display: flex; justify-content: center; align-items: center; z-index: 1200; 
    animation: ${H} 0.2s;
`,R=s.div`
    background: white; padding: 2.5rem; border-radius: 24px; 
    width: 95%; max-width: 550px; 
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); 
    animation: ${Ge} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    max-height: 90vh; overflow-y: auto;
    
    h2 { margin: 0 0 1.5rem 0; color: #1e293b; font-size: 1.6rem; font-weight: 800; letter-spacing: -0.025em; }
`,v=s.div`
    margin-bottom: 1.25rem;
    label { display: block; font-size: 0.92rem; color: #475569; margin-bottom: 0.5rem; font-weight: 600; }
    input, select, textarea { 
        width: 100%; padding: 0.9rem 1rem; border: 1px solid #cbd5e1; border-radius: 12px; 
        font-size: 1rem; color: #1e293b; background: #fff; transition: all 0.2s; 
        &:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
        &::placeholder { color: #94a3b8; }
    }
`,oe=s.button`
    position: absolute; top: 1.5rem; right: 1.5rem; 
    background: #f1f5f9; border-radius:50%; width:32px; height:32px; 
    border: none; color: #64748b; font-size: 1rem; cursor: pointer; display:grid; place-items:center;
    transition: all 0.2s;
    &:hover { color: #ef4444; background: #fee2e2; }
`,Je=s.div`
    background: white; padding: 0.75rem; border-radius: 20px;
    border: 1px solid #e2e8f0; display: flex; flex-direction: column; 
    gap: 1.5rem; margin-bottom: 2rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.01);
`,Ke=s.div`
    display: flex; gap: 0.75rem; overflow-x: auto; padding-bottom: 0.75rem;
    border-bottom: 1px solid #f1f5f9;
    &::-webkit-scrollbar { height: 4px; }
    &::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
`,Qe=s.button`
    padding: 0.65rem 1.25rem; border-radius: 12px; border: none; 
    font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.6rem; 
    transition: all 0.2s; font-size: 0.92rem; white-space: nowrap;

    background: ${t=>t.active?t.activeBg:"transparent"};
    color: ${t=>t.active?t.activeColor:"#64748b"};
    
    &:hover { background: ${t=>t.active?t.activeBg:"#f8fafc"}; color: ${t=>t.active?t.activeColor:"#334155"}; }

    .badge {
        background: ${t=>t.active?t.activeColor:"#e2e8f0"};
        color: ${t=>t.active?"white":"#64748b"};
        padding: 0.15rem 0.6rem; border-radius: 99px; font-size: 0.75rem; 
        font-weight: 800; min-width: 24px; text-align: center;
    }
`,Ue=s.div`
    background: white; border-radius: 24px; border: 1px solid #e2e8f0; overflow: hidden;
    animation: ${H} 0.4s ease-out; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
`,er=s.table`
    width: 100%; border-collapse: collapse; text-align: left;
    th { background: #f8fafc; padding: 1rem 1.5rem; font-size: 0.85rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #f1f5f9; }
    td { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; color: #334155; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #fbfcfd; }
    .provider-name { font-weight: 800; color: #1e293b; }
    .amount { font-family: 'Inter', sans-serif; font-weight: 700; text-align: right; }
    .count-badge { background: #e2e8f0; color: #475569; padding: 2px 8px; border-radius: 6px; font-weight: 800; font-size: 0.8rem; }
`,rr=s.div`
    padding: 1.5rem 2rem; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;
    h3 { margin: 0; font-size: 1.25rem; font-weight: 800; color: #1e293b; display: flex; align-items: center; gap: 0.75rem; }
    .date-range { font-size: 0.9rem; color: #64748b; font-weight: 600; background: #f1f5f9; padding: 0.4rem 1rem; border-radius: 99px; }
`,tr=s.div`
    display: flex; flex-wrap: wrap; gap: 1rem; justify-content: space-between;
`,ar=s.div`
    position: relative; min-width: 280px; flex: 2;
    svg { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #94a3b8; }
    input {
        width: 100%; padding: 0.75rem 1rem 0.75rem 2.8rem;
        border: 1px solid #e2e8f0; border-radius: 12px; font-size: 0.95rem;
        &:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
    }
`,B=s.div`
    min-width: 160px; flex: 1;
    display: flex; flex-direction: column; gap: 0.4rem;
    label { font-size: 0.8rem; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    select, input {
        width: 100%; padding: 0.7rem 1rem; border: 1px solid #e2e8f0; border-radius: 12px; 
        font-size: 0.92rem; background: #fff;
        &:focus { border-color: #3b82f6; outline: none; }
    }
`,or=s.div`
    display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1.5rem;
`,sr=s.div`
    background: white; border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); display: flex; flex-direction: column;
    
    &:hover { 
        transform: translateY(-5px); 
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); 
        border-color: #cbd5e1;
    }

    .card-header {
        padding: 1.5rem; background: linear-gradient(to bottom, #ffffff, #f8fafc);
        border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: flex-start;
    }
    .provider-info h3 { margin: 0; font-size: 1.1rem; color: #1e293b; font-weight: 800; line-height: 1.3; }
    .invoice-number { font-size: 0.85rem; color: #64748b; font-family: 'Monaco', monospace; background: #e2e8f0; padding: 4px 8px; border-radius: 6px; margin-top: 0.5rem; display: inline-block; }

    .card-body { padding: 1.5rem; flex: 1; }
    
    .meta-row {
        display: flex; justify-content: space-between; margin-bottom: 0.8rem; font-size: 0.92rem;
        .label { color: #64748b; display: flex; align-items: center; gap: 0.5rem; font-weight: 500; }
        .value { font-weight: 700; color: #334155; }
    }

    .financial-block { margin-top: 1.5rem; padding-top: 1rem; border-top: 2px dashed #f1f5f9; }
    .total-row {
        display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.75rem;
        .label { font-size: 0.85rem; font-weight: 700; color: #64748b; text-transform: uppercase; }
        .amount { font-size: 1.75rem; font-weight: 900; color: #0f172a; ; }
    }

    .progress-bar {
        height: 8px; background: #f1f5f9; border-radius: 99px; overflow: hidden; margin-bottom: 0.75rem;
        div { height: 100%; border-radius: 99px; transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
    }

    .balance-text { font-size: 0.9rem; text-align: right; color: #64748b; font-weight: 500; }
    .balance-text strong { color: ${t=>t.balanceColor}; font-weight: 800; }

    .card-footer {
        padding: 1rem 1.5rem; background: #f8fafc; border-top: 1px solid #f1f5f9;
        display: flex; gap: 1rem;
    }
`,nr=s.span`
    padding: 0.4rem 1rem; border-radius: 99px; font-size: 0.75rem; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase;
    background: ${t=>t.bg}; color: ${t=>t.text}; box-shadow: 0 1px 2px rgba(0,0,0,0.05);
`,ir=({info:t,onClose:f})=>t.show?e.jsx(M,{onClick:f,children:e.jsxs(R,{style:{maxWidth:"400px",textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"3rem",marginBottom:"1rem",color:t.type==="error"?"#ef4444":t.type==="success"?"#22c55e":"#3b82f6"},children:t.type==="error"?e.jsx(q,{style:{border:"3px solid",borderRadius:"50%",padding:5}}):t.type==="success"?e.jsx(Y,{}):e.jsx(D,{})}),e.jsx("h2",{children:t.title}),e.jsx("p",{style:{color:"#64748b",lineHeight:1.6,marginBottom:"2rem"},children:t.message}),e.jsx(h,{$primary:!0,onClick:f,style:{margin:"0 auto",width:"100%"},children:"Entendido"})]})}):null,fr=()=>{const{token:t}=Ie(),[f,ne]=n.useState([]),[X,ie]=n.useState([]),[le,Z]=n.useState(!1),[ce,P]=n.useState(0),[N,de]=n.useState("PENDIENTE"),[A,me]=n.useState("vencimiento_asc"),[F,fe]=n.useState(""),[k,ue]=n.useState(""),[g,pe]=n.useState(""),[b,xe]=n.useState(""),[J,K]=n.useState({show:!1,title:"",message:"",type:"info"}),[he,E]=n.useState(!1),[ge,_]=n.useState(!1),[be,$]=n.useState(!1),[c,Q]=n.useState(null),[m,y]=n.useState({proveedor:"",numero_factura:"",fecha_emision:ae(),fecha_vencimiento:"",monto_total:"",notas:""}),[w,L]=n.useState({amount:"",reference:""}),p=(r,a,o="info")=>{K({show:!0,title:r,message:a,type:o})};n.useEffect(()=>{t&&(async()=>{Z(!0);try{const a={};g&&(a.startDate=g),b&&(a.endDate=b);const o=await Te(t,Object.keys(a).length?a:void 0),i=Array.isArray(o)?o:(o==null?void 0:o.data)||[];ne(i);const d=await $e.get(`${Be}/providers`,{headers:{Authorization:`Bearer ${t}`}}),l=Array.isArray(d.data)?d.data:d.data.data||[];ie(l)}catch(a){console.error("Error cargando datos:",a)}finally{Z(!1)}})()},[t,ce,g,b]);const je=r=>{Q(r),L({amount:"",reference:""}),_(!0)},ve=async r=>{if(r.preventDefault(),!c||!w.amount)return;const a=parseFloat(w.amount),o=(parseFloat(c.monto_total)||0)-(parseFloat(c.monto_abonado)||0);if(a<=0)return p("Error","El monto debe ser mayor a cero.","error");if(a>o+.01)return p("Error","El monto excede la deuda pendiente.","error");const d=a>=o-.1?"PAGADA":c.estado;try{await Re(c.id,a,w.reference,d,t),P(l=>l+1),_(!1),p("Pago Registrado",`Se registró el abono correctamente. Estado: ${d}`,"success")}catch(l){console.error(l),p("Error","No se pudo registrar el pago. Intente nuevamente.","error")}},ye=async r=>{if(r.preventDefault(),!m.proveedor)return p("Falta Proveedor","Seleccione un proveedor.","warning");try{await Me(m,t),P(a=>a+1),E(!1),y({proveedor:"",numero_factura:"",fecha_emision:ae(),fecha_vencimiento:"",monto_total:"",notas:""}),p("Guardado","La factura ha sido registrada exitosamente.","success")}catch{p("Error","Error al guardar factura.","error")}},we=async()=>{if(c)try{await Le(c.id,t),P(r=>r+1),$(!1),p("Eliminada","La factura fue eliminada del sistema.","success")}catch{p("Error","No se pudo eliminar la factura.","error")}},z=n.useCallback(r=>{const a=parseFloat(r.monto_total)||0,o=parseFloat(r.monto_abonado)||0;if(a>0&&o>=a-.1)return"PAGADA";if(!r.fecha_vencimiento)return"PENDIENTE";const i=new Date;i.setHours(0,0,0,0);let d=r.fecha_vencimiento;d&&d.includes("T")&&(d=d.split("T")[0]);const l=d.split(/[-/]/);let u,j,G;l[0].length===4?(u=parseInt(l[0],10),j=parseInt(l[1],10)-1,G=parseInt(l[2],10)):(G=parseInt(l[0],10),j=parseInt(l[1],10)-1,u=parseInt(l[2],10));const ee=new Date(u,j,G);ee.setHours(0,0,0,0);const Ne=ee-i,re=Math.ceil(Ne/(1e3*60*60*24));return re<0?"VENCIDA":re<=5?"PROXIMA":"PENDIENTE"},[]),Ce=n.useCallback(r=>{switch(r){case"VENCIDA":return{color:"#dc2626",bg:"#fee2e2",activeColor:"#dc2626",activeBg:"#fef2f2",label:"Vencida"};case"PROXIMA":return{color:"#ea580c",bg:"#ffedd5",activeColor:"#c2410c",activeBg:"#fff7ed",label:"Próxima a Vencer"};case"PAGADA":return{color:"#16a34a",bg:"#dcfce7",activeColor:"#16a34a",activeBg:"#f0fdf4",label:"Pagada"};default:return{color:"#3b82f6",bg:"#dbeafe",activeColor:"#2563eb",activeBg:"#eff6ff",label:"Pendiente"}}},[]),x=n.useMemo(()=>{let r=0,a=0,o=0,i=0,d=0;return f.forEach(l=>{const u=z(l);u==="PENDIENTE"&&r++,u==="VENCIDA"&&a++,u==="PAGADA"&&o++,u==="PROXIMA"&&i++;const j=(parseFloat(l.monto_total)||0)-(parseFloat(l.monto_abonado)||0);u!=="PAGADA"&&(d+=j)}),{pend:r,venc:a,pag:o,prox:i,totalDebt:d,totalCount:f.length}},[f,z]),C=n.useMemo(()=>{let r=f;const a={};return r.forEach(o=>{const i=o.proveedor||"Sin Proveedor";a[i]||(a[i]={provider:i,count:0,totalAmount:0,totalPaid:0}),a[i].count+=1,a[i].totalAmount+=parseFloat(o.monto_total)||0,a[i].totalPaid+=parseFloat(o.monto_abonado)||0}),Object.values(a).sort((o,i)=>i.totalAmount-o.totalAmount)},[f,g,b]),U=n.useMemo(()=>{let r=f.map(a=>({...a,effectiveStatus:z(a)}));if(N!=="TODAS"&&(N==="PENDIENTE"?r=r.filter(a=>a.effectiveStatus==="PENDIENTE"||a.effectiveStatus==="PROXIMA"):r=r.filter(a=>a.effectiveStatus===N)),k&&(r=r.filter(a=>a.proveedor===k)),F){const a=F.toLowerCase();r=r.filter(o=>o.proveedor&&o.proveedor.toLowerCase().includes(a)||o.numero_factura&&o.numero_factura.toLowerCase().includes(a))}return r.sort((a,o)=>A==="vencimiento_asc"?new Date(a.fecha_vencimiento)-new Date(o.fecha_vencimiento):A==="emision_desc"?new Date(o.fecha_emision)-new Date(a.fecha_emision):A==="emision_asc"?new Date(a.fecha_emision)-new Date(o.fecha_emision):0),r},[f,N,F,k,g,b,A,z]);return e.jsxs(Ve,{children:[e.jsx(ir,{info:J,onClose:()=>K({...J,show:!1})}),e.jsxs(Oe,{children:[e.jsxs(We,{children:[e.jsxs(Ye,{children:[e.jsx(V,{})," Facturas de Proveedores"]}),e.jsx(qe,{children:"Gestión y control de cuentas por pagar"})]}),e.jsxs(He,{children:[e.jsx(h,{$secondary:!0,onClick:()=>P(r=>r+1),children:"Actualizar"}),e.jsxs(Xe,{to:"/dashboard",children:[e.jsx(Ae,{})," Volver"]}),e.jsxs(h,{$primary:!0,onClick:()=>E(!0),children:[e.jsx(Se,{})," Registrar Factura"]})]})]}),e.jsxs(Ze,{children:[e.jsxs(S,{color:"#ef4444",bg:"#fef2f2",children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(D,{})}),e.jsx("div",{className:"label",children:"Vencidas"}),e.jsx("div",{className:"value",children:x.venc}),e.jsx("div",{className:"sub",children:"Requieren atención urgente"})]}),e.jsxs(S,{color:"#ea580c",bg:"#fff7ed",children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(I,{})}),e.jsx("div",{className:"label",children:"Próximas a Vencer"}),e.jsx("div",{className:"value",children:x.prox}),e.jsx("div",{className:"sub",children:"En los próx. 5 días"})]}),e.jsxs(S,{color:"#6366f1",bg:"#eef2ff",children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(V,{})}),e.jsx("div",{className:"label",children:"Total Facturas"}),e.jsx("div",{className:"value",children:x.totalCount}),e.jsx("div",{className:"sub",children:"Registradas en sistema"})]}),e.jsxs(S,{color:"#3b82f6",bg:"#eff6ff",children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(I,{})}),e.jsx("div",{className:"label",children:"Pendientes"}),e.jsx("div",{className:"value",children:x.pend}),e.jsx("div",{className:"sub",children:"Sin riesgo inmediato"})]}),e.jsxs(S,{color:"#f59e0b",bg:"#fffbeb",children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(O,{})}),e.jsx("div",{className:"label",children:"Deuda Total"}),e.jsxs("div",{className:"value",style:{color:"#b45309"},children:["C$",x.totalDebt.toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsx("div",{className:"sub",style:{color:"#b45309"},children:"Saldo Pendiente Global"})]})]}),e.jsxs(Je,{children:[e.jsx(Ke,{children:[{id:"PENDIENTE",label:"Por Pagar (Prox)",icon:I,color:"#3b82f6",bg:"#eff6ff",count:x.pend+x.prox},{id:"VENCIDA",label:"Vencidas",icon:D,color:"#dc2626",bg:"#fef2f2",count:x.venc},{id:"PAGADA",label:"Pagadas",icon:Y,color:"#16a34a",bg:"#f0fdf4",count:x.pag},{id:"BI",label:"Resumen BI",icon:te,color:"#6366f1",bg:"#eef2ff",count:null},{id:"TODAS",label:"Todas",icon:De,color:"#64748b",bg:"#f1f5f9",count:null}].map(r=>e.jsxs(Qe,{active:N===r.id,activeColor:r.color,activeBg:r.bg,onClick:()=>de(r.id),children:[e.jsx(r.icon,{})," ",r.label,r.count!==null&&e.jsx("span",{className:"badge",children:r.count})]},r.id))}),e.jsxs(tr,{children:[e.jsxs(ar,{children:[e.jsx(Pe,{}),e.jsx("input",{type:"text",placeholder:"Buscar proveedor o No. factura...",value:F,onChange:r=>fe(r.target.value)})]}),e.jsxs(B,{style:{minWidth:"180px"},children:[e.jsx("label",{children:"Ordenar Por"}),e.jsxs("select",{value:A,onChange:r=>me(r.target.value),children:[e.jsx("option",{value:"vencimiento_asc",children:"Vencen Primero (Próximas)"}),e.jsx("option",{value:"emision_desc",children:"Emitidas Reciente (Nuevas)"}),e.jsx("option",{value:"emision_asc",children:"Emitidas Antiguas (Viejas)"})]})]}),e.jsxs(B,{children:[e.jsx("label",{children:"Proveedor"}),e.jsxs("select",{value:k,onChange:r=>ue(r.target.value),children:[e.jsx("option",{value:"",children:"Todos"}),X.map(r=>e.jsx("option",{value:r.nombre,children:r.nombre},r.id_proveedor||r.id))]})]}),e.jsxs(B,{style:{minWidth:"140px"},children:[e.jsx("label",{children:"Desde"}),e.jsx("input",{type:"date",value:g,onChange:r=>pe(r.target.value)})]}),e.jsxs(B,{style:{minWidth:"140px"},children:[e.jsx("label",{children:"Hasta"}),e.jsx("input",{type:"date",value:b,onChange:r=>xe(r.target.value)})]})]})]}),le?e.jsxs("div",{style:{textAlign:"center",padding:"4rem",color:"#94a3b8"},children:[e.jsx(I,{className:"spin",style:{fontSize:"2rem",marginBottom:"1rem"}}),e.jsx("p",{children:"Cargando información..."})]}):U.length>0?e.jsx(or,{children:U.map(r=>{const a=r.effectiveStatus,o=Ce(a),i=parseFloat(r.monto_total)||0,d=parseFloat(r.monto_abonado)||0,l=i-d,u=i>0?d/i*100:0,j=a==="PAGADA"?r.referencia_pago:null;return e.jsxs(sr,{color:o.color,balanceColor:l>0?"#ef4444":"#16a34a",children:[e.jsxs("div",{className:"card-header",children:[e.jsxs("div",{className:"provider-info",children:[e.jsxs("h3",{title:r.proveedor,children:[e.jsx(Fe,{style:{marginRight:6,color:"#94a3b8"}})," ",r.proveedor]}),e.jsxs("span",{className:"invoice-number",children:["#",r.numero_factura]})]}),e.jsx(nr,{bg:o.bg,text:o.color,children:o.label})]}),e.jsxs("div",{className:"card-body",children:[e.jsxs("div",{className:"meta-row",children:[e.jsxs("span",{className:"label",children:[e.jsx(ke,{})," Emisión"]}),e.jsx("span",{className:"value",children:T(r.fecha_emision)})]}),e.jsxs("div",{className:"meta-row",children:[e.jsxs("span",{className:"label",children:[e.jsx(D,{})," Vence"]}),e.jsx("span",{className:"value",style:{color:r.estado==="VENCIDA"?"#ef4444":"inherit"},children:T(r.fecha_vencimiento)})]}),j&&e.jsxs("div",{className:"meta-row",children:[e.jsxs("span",{className:"label",children:[e.jsx(Ee,{})," Referencia"]}),e.jsx("span",{className:"value",children:j})]}),e.jsxs("div",{className:"financial-block",children:[e.jsxs("div",{className:"total-row",children:[e.jsx("span",{className:"label",children:"Total a Pagar"}),e.jsxs("span",{className:"amount",children:["C$",i.toLocaleString(void 0,{minimumFractionDigits:2})]})]}),e.jsx("div",{className:"progress-bar",children:e.jsx("div",{style:{width:`${u}%`,background:o.color}})}),e.jsxs("div",{className:"balance-text",children:["Abonado: C$",d.toLocaleString(void 0,{minimumFractionDigits:2})," • ",e.jsxs("strong",{children:["Resta: C$",l.toLocaleString(void 0,{minimumFractionDigits:2})]})]})]})]}),e.jsxs("div",{className:"card-footer",children:[l>0&&e.jsxs(h,{$primary:!0,style:{flex:1,justifyContent:"center"},onClick:()=>je(r),children:[e.jsx(O,{})," Abonar"]}),e.jsx(h,{$danger:!0,style:{padding:"0.75rem"},onClick:()=>{Q(r),$(!0)},children:e.jsx(_e,{})})]})]},r.id)})}):N==="BI"?e.jsxs(Ue,{children:[e.jsxs(rr,{children:[e.jsxs("h3",{children:[e.jsx(te,{})," Resumen de Razonamiento de Negocio"]}),g&&b&&e.jsxs("span",{className:"date-range",children:[T(g)," - ",T(b)]})]}),e.jsxs(er,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Proveedor"}),e.jsx("th",{style:{textAlign:"center"},children:"Facturas"}),e.jsx("th",{style:{textAlign:"right"},children:"Total Comprado"}),e.jsx("th",{style:{textAlign:"right"},children:"Pagado"}),e.jsx("th",{style:{textAlign:"right"},children:"Saldo Pendiente"})]})}),e.jsxs("tbody",{children:[C.map(r=>e.jsxs("tr",{children:[e.jsx("td",{className:"provider-name",children:r.provider}),e.jsx("td",{style:{textAlign:"center"},children:e.jsx("span",{className:"count-badge",children:r.count})}),e.jsxs("td",{className:"amount",children:["C$",r.totalAmount.toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsxs("td",{className:"amount",style:{color:"#16a34a"},children:["C$",r.totalPaid.toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsxs("td",{className:"amount",style:{color:r.totalAmount-r.totalPaid>.1?"#ef4444":"#16a34a"},children:["C$",(r.totalAmount-r.totalPaid).toLocaleString(void 0,{minimumFractionDigits:2})]})]},r.provider)),C.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:"5",style:{textAlign:"center",padding:"3rem",color:"#94a3b8"},children:"No hay datos para el período seleccionado."})})]}),C.length>0&&e.jsx("tfoot",{children:e.jsxs("tr",{style:{background:"#f8fafc",fontWeight:"900"},children:[e.jsx("td",{colSpan:"2",style:{textAlign:"right",textTransform:"uppercase",fontSize:"0.8rem",color:"#64748b"},children:"Totales Globales:"}),e.jsxs("td",{className:"amount",children:["C$",C.reduce((r,a)=>r+a.totalAmount,0).toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsxs("td",{className:"amount",children:["C$",C.reduce((r,a)=>r+a.totalPaid,0).toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsxs("td",{className:"amount",style:{color:"#ef4444"},children:["C$",(C.reduce((r,a)=>r+a.totalAmount,0)-C.reduce((r,a)=>r+a.totalPaid,0)).toLocaleString(void 0,{minimumFractionDigits:2})]})]})})]})]}):e.jsxs("div",{style:{textAlign:"center",padding:"4rem",color:"#94a3b8",border:"2px dashed #e2e8f0",borderRadius:"24px",background:"white"},children:[e.jsx(V,{style:{fontSize:"3rem",marginBottom:"1rem",opacity:.3}}),e.jsx("h3",{style:{color:"#475569"},children:"No se encontraron facturas"}),e.jsx("p",{children:"Intenta ajustar los filtros o registra una nueva."})]}),he&&e.jsx(M,{onClick:()=>E(!1),children:e.jsxs(R,{onClick:r=>r.stopPropagation(),children:[e.jsx(oe,{onClick:()=>E(!1),children:e.jsx(q,{})}),e.jsx("h2",{children:"Registrar Factura"}),e.jsxs("form",{onSubmit:ye,children:[e.jsxs(v,{children:[e.jsx("label",{children:"Proveedor"}),e.jsxs("select",{required:!0,value:m.proveedor,onChange:r=>y({...m,proveedor:r.target.value}),children:[e.jsx("option",{value:"",children:"Seleccione un proveedor..."}),X.map(r=>e.jsx("option",{value:r.nombre,children:r.nombre},r.id_proveedor||r.id))]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"},children:[e.jsxs(v,{children:[e.jsx("label",{children:"No. Factura"}),e.jsx("input",{required:!0,type:"text",value:m.numero_factura,onChange:r=>y({...m,numero_factura:r.target.value}),placeholder:"Ej: F-001"})]}),e.jsxs(v,{children:[e.jsx("label",{children:"Monto Total (C$)"}),e.jsx("input",{required:!0,type:"number",step:"0.01",value:m.monto_total,onChange:r=>y({...m,monto_total:r.target.value}),placeholder:"0.00"})]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"},children:[e.jsxs(v,{children:[e.jsx("label",{children:"Fecha Emisión"}),e.jsx("input",{required:!0,type:"date",value:m.fecha_emision,onChange:r=>y({...m,fecha_emision:r.target.value})})]}),e.jsxs(v,{children:[e.jsx("label",{children:"Fecha Vencimiento"}),e.jsx("input",{required:!0,type:"date",value:m.fecha_vencimiento,onChange:r=>y({...m,fecha_vencimiento:r.target.value})})]})]}),e.jsxs(v,{children:[e.jsx("label",{children:"Notas (Opcional)"}),e.jsx("textarea",{rows:"3",value:m.notas,onChange:r=>y({...m,notas:r.target.value}),placeholder:"Detalles extra..."})]}),e.jsxs(h,{$primary:!0,type:"submit",style:{width:"100%",padding:"1rem",fontSize:"1rem"},children:[e.jsx(Y,{})," Guardar Factura"]})]})]})}),ge&&e.jsx(M,{onClick:()=>_(!1),children:e.jsxs(R,{onClick:r=>r.stopPropagation(),style:{maxWidth:"450px"},children:[e.jsx(oe,{onClick:()=>_(!1),children:e.jsx(q,{})}),e.jsx("h2",{children:"Registrar Abono"}),e.jsxs("div",{style:{background:"#f1f5f9",padding:"1rem",borderRadius:"12px",marginBottom:"1.5rem"},children:[e.jsxs("div",{style:{fontSize:"0.9rem",color:"#64748b",marginBottom:"0.25rem"},children:["Factura #",c==null?void 0:c.numero_factura]}),e.jsxs("div",{style:{fontSize:"1.5rem",fontWeight:"800",color:"#1e293b"},children:["Deuda: C$",((parseFloat(c==null?void 0:c.monto_total)||0)-(parseFloat(c==null?void 0:c.monto_abonado)||0)).toFixed(2)]})]}),e.jsxs("form",{onSubmit:ve,children:[e.jsxs(v,{children:[e.jsx("label",{children:"Monto a Abonar (C$)"}),e.jsx("input",{required:!0,type:"number",step:"0.01",autoFocus:!0,placeholder:"0.00",value:w.amount,onChange:r=>L({...w,amount:r.target.value})})]}),e.jsxs(v,{children:[e.jsx("label",{children:"Referencia / Detalle (Opcional)"}),e.jsx("input",{type:"text",placeholder:"Ej: Transferencia #1234, Pago en efectivo...",value:w.reference,onChange:r=>L({...w,reference:r.target.value})})]}),e.jsxs(h,{$primary:!0,type:"submit",style:{width:"100%",padding:"1rem"},children:[e.jsx(O,{})," Confirmar Pago"]})]})]})}),be&&e.jsx(M,{onClick:()=>$(!1),children:e.jsxs(R,{style:{maxWidth:"400px",textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"3rem",color:"#ef4444",marginBottom:"1rem"},children:e.jsx(D,{})}),e.jsx("h2",{children:"¿Eliminar Factura?"}),e.jsxs("p",{style:{color:"#64748b",marginBottom:"2rem"},children:["Estás a punto de eliminar la factura ",e.jsxs("b",{children:["#",c==null?void 0:c.numero_factura]}),". Esta acción no se puede deshacer."]}),e.jsxs("div",{style:{display:"flex",gap:"1rem"},children:[e.jsx(h,{$secondary:!0,onClick:()=>$(!1),style:{flex:1},children:"Cancelar"}),e.jsx(h,{$danger:!0,onClick:we,style:{flex:1},children:"Sí, Eliminar"})]})]})})]})};export{fr as default};

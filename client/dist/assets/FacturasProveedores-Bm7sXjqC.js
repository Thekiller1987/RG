import{r as n,j as e,J as q,Y as ze,Z as Ie,aO as P,ai as E,ah as O,ab as J,aP as ie,aQ as le,a0 as Be,aR as Re,aH as Me,aS as Oe,al as Le,n as V,b as Ve,s as i,af as Y,t as fe,W as He}from"./vendor-CmfT02pU.js";import{u as Ge,J as We,A as qe,K as Ye,L as Xe,M as Je,N as Qe}from"./index-BSfZwKsy.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-ClxtRhIU.js";const ce=()=>new Date().toLocaleDateString("sv-SE",{timeZone:"America/Managua"}),F=a=>{if(!a)return"—";const f=new Date(a.includes("T")?a:`${a}T12:00:00`);return new Intl.DateTimeFormat("es-NI",{timeZone:"America/Managua",day:"2-digit",month:"2-digit",year:"numeric"}).format(f)},Q=fe`from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); }`,Ue=fe`from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; }`,Ze=i.div`
    padding: clamp(1rem, 3vw, 2.5rem); 
    background: #f8fafc; /* Fondo más limpio */
    min-height: 100vh; 
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    animation: ${Q} 0.5s ease-out;
`,Ke=i.div`
    display: flex; 
    justify-content: space-between; 
    align-items: flex-start; 
    margin-bottom: 2rem; 
    flex-wrap: wrap; 
    gap: 1.5rem;
`,er=i.div`
    display: flex;
    flex-direction: column;
`,rr=i.h1`
    font-size: clamp(1.8rem, 2.5vw, 2.2rem); 
    color: #1e293b; 
    display: flex; 
    align-items: center; 
    gap: 0.75rem; 
    margin: 0; 
    font-weight: 800;
    letter-spacing: -0.03em;
    
    svg { color: #3b82f6; } /* Azul vibrante */
`,tr=i.p`
    color: #64748b;
    margin: 0.5rem 0 0 0;
    font-size: 1rem;
    font-weight: 500;
`,ar=i.div`
    display: flex; 
    gap: 0.75rem;
    flex-wrap: wrap;
    
    @media (max-width: 600px) {
        width: 100%;
        button, a { flex: 1; justify-content: center; }
    }
`,b=i.button`
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
    
    ${a=>a.$primary&&Y`
        background: #3b82f6;
        color: white;
        box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
        &:hover { background: #2563eb; transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.4); }
    `}

    ${a=>a.$secondary&&Y`
        background: white;
        color: #334155;
        border: 1px solid #e2e8f0;
        &:hover { background: #f1f5f9; border-color: #cbd5e1; transform: translateY(-1px); }
    `}

    ${a=>a.$danger&&Y`
        background: #fee2e2;
        color: #ef4444;
        &:hover { background: #fecaca; transform: scale(1.05); }
    `}

    &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
`,or=i(He)`
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
`,sr=i.div`
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); 
    gap: 1.5rem; 
    margin-bottom: 2.5rem;
`,D=i.div`
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
        background: ${a=>a.color}; 
    }

    .icon-wrapper {
        width: 48px; height: 48px; border-radius: 12px; background: ${a=>a.bg}; 
        display: flex; align-items: center; justify-content: center; 
        color: ${a=>a.color}; font-size: 1.4rem; margin-bottom: 1rem;
    }

    .label { font-size: 0.85rem; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    .value { font-size: 2.2rem; font-weight: 800; color: #1e293b; margin: 0.25rem 0; letter-spacing: -0.03em; }
    .sub { font-size: 0.9rem; color: ${a=>a.color}; font-weight: 600; }
`,k=i.div`
    position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
    background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px); 
    display: flex; justify-content: center; align-items: center; z-index: 1200; 
    animation: ${Q} 0.2s;
`,T=i.div`
    background: white; padding: 2.5rem; border-radius: 24px; 
    width: 95%; max-width: 550px; 
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); 
    animation: ${Ue} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    max-height: 90vh; overflow-y: auto;
    
    h2 { margin: 0 0 1.5rem 0; color: #1e293b; font-size: 1.6rem; font-weight: 800; letter-spacing: -0.025em; }
`,u=i.div`
    margin-bottom: 1.25rem;
    label { display: block; font-size: 0.92rem; color: #475569; margin-bottom: 0.5rem; font-weight: 600; }
    input, select, textarea { 
        width: 100%; padding: 0.9rem 1rem; border: 1px solid #cbd5e1; border-radius: 12px; 
        font-size: 1rem; color: #1e293b; background: #fff; transition: all 0.2s; 
        &:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
        &::placeholder { color: #94a3b8; }
    }
`,X=i.button`
    position: absolute; top: 1.5rem; right: 1.5rem; 
    background: #f1f5f9; border-radius:50%; width:32px; height:32px; 
    border: none; color: #64748b; font-size: 1rem; cursor: pointer; display:grid; place-items:center;
    transition: all 0.2s;
    &:hover { color: #ef4444; background: #fee2e2; }
`,nr=i.div`
    background: white; padding: 0.75rem; border-radius: 20px;
    border: 1px solid #e2e8f0; display: flex; flex-direction: column; 
    gap: 1.5rem; margin-bottom: 2rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.01);
`,ir=i.div`
    display: flex; gap: 0.75rem; overflow-x: auto; padding-bottom: 0.75rem;
    border-bottom: 1px solid #f1f5f9;
    &::-webkit-scrollbar { height: 4px; }
    &::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
`,lr=i.button`
    padding: 0.65rem 1.25rem; border-radius: 12px; border: none; 
    font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.6rem; 
    transition: all 0.2s; font-size: 0.92rem; white-space: nowrap;

    background: ${a=>a.active?a.activeBg:"transparent"};
    color: ${a=>a.active?a.activeColor:"#64748b"};
    
    &:hover { background: ${a=>a.active?a.activeBg:"#f8fafc"}; color: ${a=>a.active?a.activeColor:"#334155"}; }

    .badge {
        background: ${a=>a.active?a.activeColor:"#e2e8f0"};
        color: ${a=>a.active?"white":"#64748b"};
        padding: 0.15rem 0.6rem; border-radius: 99px; font-size: 0.75rem; 
        font-weight: 800; min-width: 24px; text-align: center;
    }
`,cr=i.div`
    background: white; border-radius: 24px; border: 1px solid #e2e8f0; overflow: hidden;
    animation: ${Q} 0.4s ease-out; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
`,de=i.table`
    width: 100%; border-collapse: collapse; text-align: left;
    th { background: #f8fafc; padding: 1rem 1.5rem; font-size: 0.85rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #f1f5f9; }
    td { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; color: #334155; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #fbfcfd; }
    .provider-name { font-weight: 800; color: #1e293b; }
    .amount { font-family: 'Inter', sans-serif; font-weight: 700; text-align: right; }
    .count-badge { background: #e2e8f0; color: #475569; padding: 2px 8px; border-radius: 6px; font-weight: 800; font-size: 0.8rem; }
`,dr=i.div`
    padding: 1.5rem 2rem; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;
    h3 { margin: 0; font-size: 1.25rem; font-weight: 800; color: #1e293b; display: flex; align-items: center; gap: 0.75rem; }
    .date-range { font-size: 0.9rem; color: #64748b; font-weight: 600; background: #f1f5f9; padding: 0.4rem 1rem; border-radius: 99px; }
`,mr=i.div`
    display: flex; flex-wrap: wrap; gap: 1rem; justify-content: space-between;
`,fr=i.div`
    position: relative; min-width: 280px; flex: 2;
    svg { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #94a3b8; }
    input {
        width: 100%; padding: 0.75rem 1rem 0.75rem 2.8rem;
        border: 1px solid #e2e8f0; border-radius: 12px; font-size: 0.95rem;
        &:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
    }
`,L=i.div`
    min-width: 160px; flex: 1;
    display: flex; flex-direction: column; gap: 0.4rem;
    label { font-size: 0.8rem; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    select, input {
        width: 100%; padding: 0.7rem 1rem; border: 1px solid #e2e8f0; border-radius: 12px; 
        font-size: 0.92rem; background: #fff;
        &:focus { border-color: #3b82f6; outline: none; }
    }
`,ur=i.div`
    display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1.5rem;
`,xr=i.div`
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
    .balance-text strong { color: ${a=>a.balanceColor}; font-weight: 800; }

    .card-footer {
        padding: 1rem 1.5rem; background: #f8fafc; border-top: 1px solid #f1f5f9;
        display: flex; gap: 1rem;
    }
`,me=i.span`
    padding: 0.4rem 1rem; border-radius: 99px; font-size: 0.75rem; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase;
    background: ${a=>a.bg}; color: ${a=>a.text}; box-shadow: 0 1px 2px rgba(0,0,0,0.05);
`,pr=({info:a,onClose:f})=>a.show?e.jsx(k,{onClick:f,children:e.jsxs(T,{style:{maxWidth:"400px",textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"3rem",marginBottom:"1rem",color:a.type==="error"?"#ef4444":a.type==="success"?"#22c55e":"#3b82f6"},children:a.type==="error"?e.jsx(V,{style:{border:"3px solid",borderRadius:"50%",padding:5}}):a.type==="success"?e.jsx(J,{}):e.jsx(P,{})}),e.jsx("h2",{children:a.title}),e.jsx("p",{style:{color:"#64748b",lineHeight:1.6,marginBottom:"2rem"},children:a.message}),e.jsx(b,{$primary:!0,onClick:f,style:{margin:"0 auto",width:"100%"},children:"Entendido"})]})}):null,vr=()=>{const{token:a}=Ge(),[f,ue]=n.useState([]),[U,xe]=n.useState([]),[pe,Z]=n.useState(!1),[he,_]=n.useState(0),[N,ge]=n.useState("PENDIENTE"),[S,be]=n.useState("vencimiento_asc"),[$,je]=n.useState(""),[C,ve]=n.useState(""),[v,ye]=n.useState(""),[y,we]=n.useState(""),[K,ee]=n.useState({show:!1,title:"",message:"",type:"info"}),[Ce,z]=n.useState(!1),[Ae,I]=n.useState(!1),[Ne,B]=n.useState(!1),[Se,H]=n.useState(!1),[Ee,re]=n.useState(!1),[te,ae]=n.useState([]),[s,G]=n.useState(null),[l,p]=n.useState({proveedor:"",numero_factura:"",fecha_emision:ce(),fecha_vencimiento:"",monto_total:"",notas:"",tipo_compra:"CREDITO",metodo_pago:"EFECTIVO",referencia:""}),[h,R]=n.useState({amount:"",reference:"",method:"EFECTIVO"}),g=(r,t,o="info")=>{ee({show:!0,title:r,message:t,type:o})};n.useEffect(()=>{a&&(async()=>{Z(!0);try{const t={};v&&(t.startDate=v),y&&(t.endDate=y),C&&C!==""&&(t.proveedor=C);const o=await We(a,Object.keys(t).length?t:void 0),c=Array.isArray(o)?o:(o==null?void 0:o.data)||[];ue(c);const m=await Ve.get(`${qe}/providers`,{headers:{Authorization:`Bearer ${a}`}}),d=Array.isArray(m.data)?m.data:m.data.data||[];xe(d)}catch(t){console.error("Error cargando datos:",t)}finally{Z(!1)}})()},[a,he,v,y]);const Fe=r=>{G(r),R({amount:"",reference:"",method:"EFECTIVO"}),I(!0)},De=async r=>{if(r.preventDefault(),!s||!h.amount)return;const t=parseFloat(h.amount),o=(parseFloat(s.monto_total)||0)-(parseFloat(s.monto_abonado)||0);if(t<=0)return g("Error","El monto debe ser mayor a cero.","error");if(t>o+.01)return g("Error","El monto excede la deuda pendiente.","error");const m=t>=o-.1?"PAGADA":s.estado;try{await Je(s.id,{amount:t,reference:h.reference,method:h.method,status:m},a),_(d=>d+1),I(!1),g("Pago Registrado",`Se registró el abono correctamente. Estado: ${m}`,"success")}catch(d){console.error(d),g("Error","No se pudo registrar el pago. Intente nuevamente.","error")}},Pe=async r=>{if(r.preventDefault(),!l.proveedor)return g("Falta Proveedor","Seleccione un proveedor.","warning");try{await Xe(l,a),_(t=>t+1),z(!1),p({proveedor:"",numero_factura:"",fecha_emision:ce(),fecha_vencimiento:"",monto_total:"",notas:"",tipo_compra:"CREDITO",metodo_pago:"EFECTIVO",referencia:""}),g("Guardado","La factura ha sido registrada exitosamente.","success")}catch{g("Error","Error al guardar factura.","error")}},ke=async()=>{if(s)try{await Qe(s.id,a),_(r=>r+1),B(!1),g("Eliminada","La factura fue eliminada del sistema.","success")}catch{g("Error","No se pudo eliminar la factura.","error")}},Te=async r=>{G(r),H(!0),re(!0),ae([]);try{const t=await Ye(r.id,a);ae(Array.isArray(t)?t:(t==null?void 0:t.data)||[])}catch{g("Error","No se pudo cargar el historial de abonos.","error")}finally{re(!1)}},M=n.useCallback(r=>{const t=parseFloat(r.monto_total)||0,o=parseFloat(r.monto_abonado)||0;if(t>0&&o>=t-.1)return"PAGADA";if(!r.fecha_vencimiento)return"PENDIENTE";const c=new Date;c.setHours(0,0,0,0);let m=r.fecha_vencimiento;m&&m.includes("T")&&(m=m.split("T")[0]);const d=m.split(/[-/]/);let x,w,W;d[0].length===4?(x=parseInt(d[0],10),w=parseInt(d[1],10)-1,W=parseInt(d[2],10)):(W=parseInt(d[0],10),w=parseInt(d[1],10)-1,x=parseInt(d[2],10));const se=new Date(x,w,W);se.setHours(0,0,0,0);const $e=se-c,ne=Math.ceil($e/(1e3*60*60*24));return ne<0?"VENCIDA":ne<=5?"PROXIMA":"PENDIENTE"},[]),_e=n.useCallback(r=>{switch(r){case"VENCIDA":return{color:"#dc2626",bg:"#fee2e2",activeColor:"#dc2626",activeBg:"#fef2f2",label:"Vencida"};case"PROXIMA":return{color:"#ea580c",bg:"#ffedd5",activeColor:"#c2410c",activeBg:"#fff7ed",label:"Próxima a Vencer"};case"PAGADA":return{color:"#16a34a",bg:"#dcfce7",activeColor:"#16a34a",activeBg:"#f0fdf4",label:"Pagada"};default:return{color:"#3b82f6",bg:"#dbeafe",activeColor:"#2563eb",activeBg:"#eff6ff",label:"Pendiente"}}},[]),j=n.useMemo(()=>{let r=0,t=0,o=0,c=0,m=0;return f.forEach(d=>{const x=M(d);x==="PENDIENTE"&&r++,x==="VENCIDA"&&t++,x==="PAGADA"&&o++,x==="PROXIMA"&&c++;const w=(parseFloat(d.monto_total)||0)-(parseFloat(d.monto_abonado)||0);x!=="PAGADA"&&(m+=w)}),{pend:r,venc:t,pag:o,prox:c,totalDebt:m,totalCount:f.length}},[f,M]),A=n.useMemo(()=>{let r=f;const t={};return r.forEach(o=>{const c=o.proveedor||"Sin Proveedor";t[c]||(t[c]={provider:c,count:0,totalAmount:0,totalPaid:0}),t[c].count+=1,t[c].totalAmount+=parseFloat(o.monto_total)||0,t[c].totalPaid+=parseFloat(o.monto_abonado)||0}),Object.values(t).sort((o,c)=>c.totalAmount-o.totalAmount)},[f,v,y]),oe=n.useMemo(()=>{let r=f.map(t=>({...t,effectiveStatus:M(t)}));if(N!=="TODAS"&&(N==="PENDIENTE"?r=r.filter(t=>t.effectiveStatus==="PENDIENTE"||t.effectiveStatus==="PROXIMA"):r=r.filter(t=>t.effectiveStatus===N)),C&&(r=r.filter(t=>t.proveedor===C)),$){const t=$.toLowerCase();r=r.filter(o=>o.proveedor&&o.proveedor.toLowerCase().includes(t)||o.numero_factura&&o.numero_factura.toLowerCase().includes(t))}return r.sort((t,o)=>S==="vencimiento_asc"?new Date(t.fecha_vencimiento)-new Date(o.fecha_vencimiento):S==="emision_desc"?new Date(o.fecha_emision)-new Date(t.fecha_emision):S==="emision_asc"?new Date(t.fecha_emision)-new Date(o.fecha_emision):0),r},[f,N,$,C,v,y,S,M]);return e.jsxs(Ze,{children:[e.jsx(pr,{info:K,onClose:()=>ee({...K,show:!1})}),e.jsxs(Ke,{children:[e.jsxs(er,{children:[e.jsxs(rr,{children:[e.jsx(q,{})," Facturas de Proveedores"]}),e.jsx(tr,{children:"Gestión y control de cuentas por pagar"})]}),e.jsxs(ar,{children:[e.jsx(b,{$secondary:!0,onClick:()=>_(r=>r+1),children:"Actualizar"}),e.jsxs(or,{to:"/dashboard",children:[e.jsx(ze,{})," Volver"]}),e.jsxs(b,{$primary:!0,onClick:()=>z(!0),children:[e.jsx(Ie,{})," Registrar Factura"]})]})]}),e.jsxs(sr,{children:[e.jsxs(D,{color:"#ef4444",bg:"#fef2f2",children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(P,{})}),e.jsx("div",{className:"label",children:"Vencidas"}),e.jsx("div",{className:"value",children:j.venc}),e.jsx("div",{className:"sub",children:"Requieren atención urgente"})]}),e.jsxs(D,{color:"#ea580c",bg:"#fff7ed",children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(E,{})}),e.jsx("div",{className:"label",children:"Próximas a Vencer"}),e.jsx("div",{className:"value",children:j.prox}),e.jsx("div",{className:"sub",children:"En los próx. 5 días"})]}),e.jsxs(D,{color:"#6366f1",bg:"#eef2ff",children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(q,{})}),e.jsx("div",{className:"label",children:"Total Facturas"}),e.jsx("div",{className:"value",children:j.totalCount}),e.jsx("div",{className:"sub",children:"Registradas en sistema"})]}),e.jsxs(D,{color:"#3b82f6",bg:"#eff6ff",children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(E,{})}),e.jsx("div",{className:"label",children:"Pendientes"}),e.jsx("div",{className:"value",children:j.pend}),e.jsx("div",{className:"sub",children:"Sin riesgo inmediato"})]}),e.jsxs(D,{color:"#f59e0b",bg:"#fffbeb",children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(O,{})}),e.jsx("div",{className:"label",children:"Deuda Total"}),e.jsxs("div",{className:"value",style:{color:"#b45309"},children:["C$",j.totalDebt.toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsx("div",{className:"sub",style:{color:"#b45309"},children:"Saldo Pendiente Global"})]})]}),e.jsxs(nr,{children:[e.jsx(ir,{children:[{id:"PENDIENTE",label:"Por Pagar (Prox)",icon:E,color:"#3b82f6",bg:"#eff6ff",count:j.pend+j.prox},{id:"VENCIDA",label:"Vencidas",icon:P,color:"#dc2626",bg:"#fef2f2",count:j.venc},{id:"PAGADA",label:"Pagadas",icon:J,color:"#16a34a",bg:"#f0fdf4",count:j.pag},{id:"BI",label:"Resumen BI",icon:ie,color:"#6366f1",bg:"#eef2ff",count:null},{id:"TODAS",label:"Todas",icon:le,color:"#64748b",bg:"#f1f5f9",count:null}].map(r=>e.jsxs(lr,{active:N===r.id,activeColor:r.color,activeBg:r.bg,onClick:()=>ge(r.id),children:[e.jsx(r.icon,{})," ",r.label,r.count!==null&&e.jsx("span",{className:"badge",children:r.count})]},r.id))}),e.jsxs(mr,{children:[e.jsxs(fr,{children:[e.jsx(Be,{}),e.jsx("input",{type:"text",placeholder:"Buscar proveedor o No. factura...",value:$,onChange:r=>je(r.target.value)})]}),e.jsxs(L,{style:{minWidth:"180px"},children:[e.jsx("label",{children:"Ordenar Por"}),e.jsxs("select",{value:S,onChange:r=>be(r.target.value),children:[e.jsx("option",{value:"vencimiento_asc",children:"Vencen Primero (Próximas)"}),e.jsx("option",{value:"emision_desc",children:"Emitidas Reciente (Nuevas)"}),e.jsx("option",{value:"emision_asc",children:"Emitidas Antiguas (Viejas)"})]})]}),e.jsxs(L,{children:[e.jsx("label",{children:"Proveedor"}),e.jsxs("select",{value:C,onChange:r=>ve(r.target.value),children:[e.jsx("option",{value:"",children:"Todos"}),U.map(r=>e.jsx("option",{value:r.nombre,children:r.nombre},r.id_proveedor||r.id))]})]}),e.jsxs(L,{style:{minWidth:"140px"},children:[e.jsx("label",{children:"Desde"}),e.jsx("input",{type:"date",value:v,onChange:r=>ye(r.target.value)})]}),e.jsxs(L,{style:{minWidth:"140px"},children:[e.jsx("label",{children:"Hasta"}),e.jsx("input",{type:"date",value:y,onChange:r=>we(r.target.value)})]})]})]}),pe?e.jsxs("div",{style:{textAlign:"center",padding:"4rem",color:"#94a3b8"},children:[e.jsx(E,{className:"spin",style:{fontSize:"2rem",marginBottom:"1rem"}}),e.jsx("p",{children:"Cargando información..."})]}):oe.length>0?e.jsx(ur,{children:oe.map(r=>{const t=r.effectiveStatus,o=_e(t),c=parseFloat(r.monto_total)||0,m=parseFloat(r.monto_abonado)||0,d=c-m,x=c>0?m/c*100:0,w=t==="PAGADA"?r.referencia_pago:null;return e.jsxs(xr,{color:o.color,balanceColor:d>0?"#ef4444":"#16a34a",children:[e.jsxs("div",{className:"card-header",children:[e.jsxs("div",{className:"provider-info",children:[e.jsxs("h3",{title:r.proveedor,children:[e.jsx(Re,{style:{marginRight:6,color:"#94a3b8"}})," ",r.proveedor]}),e.jsxs("span",{className:"invoice-number",children:["#",r.numero_factura]})]}),e.jsx(me,{bg:o.bg,text:o.color,children:o.label})]}),e.jsxs("div",{className:"card-body",children:[e.jsxs("div",{className:"meta-row",children:[e.jsxs("span",{className:"label",children:[e.jsx(Me,{})," Emisión"]}),e.jsx("span",{className:"value",children:F(r.fecha_emision)})]}),e.jsxs("div",{className:"meta-row",children:[e.jsxs("span",{className:"label",children:[e.jsx(P,{})," Vence"]}),e.jsx("span",{className:"value",style:{color:r.estado==="VENCIDA"?"#ef4444":"inherit"},children:F(r.fecha_vencimiento)})]}),w&&e.jsxs("div",{className:"meta-row",children:[e.jsxs("span",{className:"label",children:[e.jsx(Oe,{})," Referencia"]}),e.jsx("span",{className:"value",children:w})]}),e.jsxs("div",{className:"financial-block",children:[e.jsxs("div",{className:"total-row",children:[e.jsx("span",{className:"label",children:"Total a Pagar"}),e.jsxs("span",{className:"amount",children:["C$",c.toLocaleString(void 0,{minimumFractionDigits:2})]})]}),e.jsx("div",{className:"progress-bar",children:e.jsx("div",{style:{width:`${x}%`,background:o.color}})}),e.jsxs("div",{className:"balance-text",children:["Abonado: C$",m.toLocaleString(void 0,{minimumFractionDigits:2})," • ",e.jsxs("strong",{children:["Resta: C$",d.toLocaleString(void 0,{minimumFractionDigits:2})]})]})]})]}),e.jsxs("div",{className:"card-footer",style:{flexWrap:"wrap"},children:[d>0&&e.jsxs(b,{$primary:!0,style:{flex:1,justifyContent:"center"},onClick:()=>Fe(r),children:[e.jsx(O,{})," Abonar"]}),e.jsxs(b,{$secondary:!0,style:{flex:1,justifyContent:"center"},onClick:()=>Te(r),children:[e.jsx(le,{})," Historial"]}),e.jsx(b,{$danger:!0,style:{padding:"0.75rem"},onClick:()=>{G(r),B(!0)},children:e.jsx(Le,{})})]})]},r.id)})}):N==="BI"?e.jsxs(cr,{children:[e.jsxs(dr,{children:[e.jsxs("h3",{children:[e.jsx(ie,{})," Resumen de Razonamiento de Negocio"]}),v&&y&&e.jsxs("span",{className:"date-range",children:[F(v)," - ",F(y)]})]}),e.jsxs(de,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Proveedor"}),e.jsx("th",{style:{textAlign:"center"},children:"Facturas"}),e.jsx("th",{style:{textAlign:"right"},children:"Total Comprado"}),e.jsx("th",{style:{textAlign:"right"},children:"Pagado"}),e.jsx("th",{style:{textAlign:"right"},children:"Saldo Pendiente"})]})}),e.jsxs("tbody",{children:[A.map(r=>e.jsxs("tr",{children:[e.jsx("td",{className:"provider-name",children:r.provider}),e.jsx("td",{style:{textAlign:"center"},children:e.jsx("span",{className:"count-badge",children:r.count})}),e.jsxs("td",{className:"amount",children:["C$",r.totalAmount.toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsxs("td",{className:"amount",style:{color:"#16a34a"},children:["C$",r.totalPaid.toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsxs("td",{className:"amount",style:{color:r.totalAmount-r.totalPaid>.1?"#ef4444":"#16a34a"},children:["C$",(r.totalAmount-r.totalPaid).toLocaleString(void 0,{minimumFractionDigits:2})]})]},r.provider)),A.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:"5",style:{textAlign:"center",padding:"3rem",color:"#94a3b8"},children:"No hay datos para el período seleccionado."})})]}),A.length>0&&e.jsx("tfoot",{children:e.jsxs("tr",{style:{background:"#f8fafc",fontWeight:"900"},children:[e.jsx("td",{colSpan:"2",style:{textAlign:"right",textTransform:"uppercase",fontSize:"0.8rem",color:"#64748b"},children:"Totales Globales:"}),e.jsxs("td",{className:"amount",children:["C$",A.reduce((r,t)=>r+t.totalAmount,0).toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsxs("td",{className:"amount",children:["C$",A.reduce((r,t)=>r+t.totalPaid,0).toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsxs("td",{className:"amount",style:{color:"#ef4444"},children:["C$",(A.reduce((r,t)=>r+t.totalAmount,0)-A.reduce((r,t)=>r+t.totalPaid,0)).toLocaleString(void 0,{minimumFractionDigits:2})]})]})})]})]}):e.jsxs("div",{style:{textAlign:"center",padding:"4rem",color:"#94a3b8",border:"2px dashed #e2e8f0",borderRadius:"24px",background:"white"},children:[e.jsx(q,{style:{fontSize:"3rem",marginBottom:"1rem",opacity:.3}}),e.jsx("h3",{style:{color:"#475569"},children:"No se encontraron facturas"}),e.jsx("p",{children:"Intenta ajustar los filtros o registra una nueva."})]}),Ce&&e.jsx(k,{onClick:()=>z(!1),children:e.jsxs(T,{onClick:r=>r.stopPropagation(),children:[e.jsx(X,{onClick:()=>z(!1),children:e.jsx(V,{})}),e.jsx("h2",{children:"Registrar Factura"}),e.jsxs("form",{onSubmit:Pe,children:[e.jsxs(u,{children:[e.jsx("label",{children:"Proveedor"}),e.jsxs("select",{required:!0,value:l.proveedor,onChange:r=>p({...l,proveedor:r.target.value}),children:[e.jsx("option",{value:"",children:"Seleccione un proveedor..."}),U.map(r=>e.jsx("option",{value:r.nombre,children:r.nombre},r.id_proveedor||r.id))]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"},children:[e.jsxs(u,{children:[e.jsx("label",{children:"No. Factura"}),e.jsx("input",{required:!0,type:"text",value:l.numero_factura,onChange:r=>p({...l,numero_factura:r.target.value}),placeholder:"Ej: F-001"})]}),e.jsxs(u,{children:[e.jsx("label",{children:"Monto Total (C$)"}),e.jsx("input",{required:!0,type:"number",step:"0.01",value:l.monto_total,onChange:r=>p({...l,monto_total:r.target.value}),placeholder:"0.00"})]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"},children:[e.jsxs(u,{children:[e.jsx("label",{children:"Fecha Emisión"}),e.jsx("input",{required:!0,type:"date",value:l.fecha_emision,onChange:r=>p({...l,fecha_emision:r.target.value})})]}),e.jsxs(u,{children:[e.jsx("label",{children:"Fecha Vencimiento"}),e.jsx("input",{required:!0,type:"date",value:l.fecha_vencimiento,onChange:r=>p({...l,fecha_vencimiento:r.target.value})})]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",background:"#f8fafc",padding:"1rem",borderRadius:"12px",marginBottom:"1.25rem",border:"1px solid #e2e8f0"},children:[e.jsxs(u,{style:{marginBottom:0},children:[e.jsx("label",{children:"Tipo de Compra"}),e.jsxs("select",{required:!0,value:l.tipo_compra,onChange:r=>p({...l,tipo_compra:r.target.value}),children:[e.jsx("option",{value:"CREDITO",children:"A Crédito"}),e.jsx("option",{value:"CONTADO",children:"De Contado"})]})]}),l.tipo_compra==="CONTADO"&&e.jsxs(u,{style:{marginBottom:0},children:[e.jsx("label",{children:"Método de Pago"}),e.jsxs("select",{required:!0,value:l.metodo_pago,onChange:r=>p({...l,metodo_pago:r.target.value}),children:[e.jsx("option",{value:"EFECTIVO",children:"Efectivo"}),e.jsx("option",{value:"TARJETA",children:"Tarjeta"}),e.jsx("option",{value:"TRANSFERENCIA",children:"Transferencia"}),e.jsx("option",{value:"CHEQUE",children:"Cheque"})]})]})]}),l.tipo_compra==="CONTADO"&&e.jsxs(u,{children:[e.jsx("label",{children:"Referencia de Pago (Transferencia, Cheque, etc.)"}),e.jsx("input",{type:"text",value:l.referencia,onChange:r=>p({...l,referencia:r.target.value}),placeholder:"Opcional..."})]}),e.jsxs(u,{children:[e.jsx("label",{children:"Notas (Opcional)"}),e.jsx("textarea",{rows:"3",value:l.notas,onChange:r=>p({...l,notas:r.target.value}),placeholder:"Detalles extra..."})]}),e.jsxs(b,{$primary:!0,type:"submit",style:{width:"100%",padding:"1rem",fontSize:"1rem"},children:[e.jsx(J,{})," Guardar Factura"]})]})]})}),Ae&&e.jsx(k,{onClick:()=>I(!1),children:e.jsxs(T,{onClick:r=>r.stopPropagation(),style:{maxWidth:"450px"},children:[e.jsx(X,{onClick:()=>I(!1),children:e.jsx(V,{})}),e.jsx("h2",{children:"Registrar Abono"}),e.jsxs("div",{style:{background:"#f1f5f9",padding:"1rem",borderRadius:"12px",marginBottom:"1.5rem"},children:[e.jsxs("div",{style:{fontSize:"0.9rem",color:"#64748b",marginBottom:"0.25rem"},children:["Factura #",s==null?void 0:s.numero_factura]}),e.jsxs("div",{style:{fontSize:"1.5rem",fontWeight:"800",color:"#1e293b"},children:["Deuda: C$",((parseFloat(s==null?void 0:s.monto_total)||0)-(parseFloat(s==null?void 0:s.monto_abonado)||0)).toFixed(2)]})]}),e.jsxs("form",{onSubmit:De,children:[e.jsxs(u,{children:[e.jsx("label",{children:"Monto a Abonar (C$)"}),e.jsx("input",{required:!0,type:"number",step:"0.01",autoFocus:!0,placeholder:"0.00",value:h.amount,onChange:r=>R({...h,amount:r.target.value})})]}),e.jsxs(u,{children:[e.jsx("label",{children:"Método de Pago"}),e.jsxs("select",{required:!0,value:h.method,onChange:r=>R({...h,method:r.target.value}),children:[e.jsx("option",{value:"EFECTIVO",children:"Efectivo"}),e.jsx("option",{value:"TARJETA",children:"Tarjeta"}),e.jsx("option",{value:"TRANSFERENCIA",children:"Transferencia"}),e.jsx("option",{value:"CHEQUE",children:"Cheque"})]})]}),e.jsxs(u,{children:[e.jsx("label",{children:"Referencia / Detalle (Opcional)"}),e.jsx("input",{type:"text",placeholder:"Ej: Transferencia #1234, Pago en efectivo...",value:h.reference,onChange:r=>R({...h,reference:r.target.value})})]}),e.jsxs(b,{$primary:!0,type:"submit",style:{width:"100%",padding:"1rem"},children:[e.jsx(O,{})," Confirmar Pago"]})]})]})}),Ne&&e.jsx(k,{onClick:()=>B(!1),children:e.jsxs(T,{style:{maxWidth:"400px",textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"3rem",color:"#ef4444",marginBottom:"1rem"},children:e.jsx(P,{})}),e.jsx("h2",{children:"¿Eliminar Factura?"}),e.jsxs("p",{style:{color:"#64748b",marginBottom:"2rem"},children:["Estás a punto de eliminar la factura ",e.jsxs("b",{children:["#",s==null?void 0:s.numero_factura]}),". Esta acción no se puede deshacer."]}),e.jsxs("div",{style:{display:"flex",gap:"1rem"},children:[e.jsx(b,{$secondary:!0,onClick:()=>B(!1),style:{flex:1},children:"Cancelar"}),e.jsx(b,{$danger:!0,onClick:ke,style:{flex:1},children:"Sí, Eliminar"})]})]})}),Se&&e.jsx(k,{onClick:()=>H(!1),children:e.jsxs(T,{onClick:r=>r.stopPropagation(),style:{maxWidth:"600px"},children:[e.jsx(X,{onClick:()=>H(!1),children:e.jsx(V,{})}),e.jsx("h2",{children:"Historial de Abonos"}),e.jsxs("div",{style:{background:"#f1f5f9",padding:"1rem",borderRadius:"12px",marginBottom:"1.5rem",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("div",{children:[e.jsxs("div",{style:{fontSize:"0.9rem",color:"#64748b"},children:["Factura #",s==null?void 0:s.numero_factura]}),e.jsx("div",{style:{fontSize:"1.1rem",fontWeight:"800",color:"#1e293b"},children:s==null?void 0:s.proveedor})]}),e.jsxs("div",{style:{textAlign:"right"},children:[e.jsx("div",{style:{fontSize:"0.9rem",color:"#64748b"},children:"Abonado Total"}),e.jsxs("div",{style:{fontSize:"1.2rem",fontWeight:"800",color:"#16a34a"},children:["C$",(parseFloat(s==null?void 0:s.monto_abonado)||0).toLocaleString(void 0,{minimumFractionDigits:2})]})]})]}),Ee?e.jsxs("div",{style:{textAlign:"center",padding:"2rem",color:"#94a3b8"},children:[e.jsx(E,{className:"spin",style:{fontSize:"1.5rem",marginBottom:"1rem"}}),e.jsx("p",{children:"Cargando historial..."})]}):te.length>0?e.jsx("div",{style:{overflowX:"auto"},children:e.jsxs(de,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Fecha"}),e.jsx("th",{children:"Método"}),e.jsx("th",{children:"Referencia"}),e.jsx("th",{style:{textAlign:"right"},children:"Monto"})]})}),e.jsx("tbody",{children:te.map((r,t)=>e.jsxs("tr",{children:[e.jsx("td",{children:F(r.fecha)}),e.jsx("td",{children:e.jsx(me,{bg:"#f1f5f9",text:"#475569",children:r.metodo_pago})}),e.jsx("td",{children:r.referencia||"-"}),e.jsxs("td",{className:"amount",style:{color:"#16a34a"},children:["C$",parseFloat(r.monto).toLocaleString(void 0,{minimumFractionDigits:2})]})]},t))})]})}):e.jsxs("div",{style:{textAlign:"center",padding:"3rem",color:"#94a3b8",border:"1px dashed #cbd5e1",borderRadius:"16px"},children:[e.jsx(O,{style:{fontSize:"2rem",marginBottom:"1rem",opacity:.5}}),e.jsx("p",{children:"No existen abonos registrados para esta factura."})]})]})})]})};export{vr as default};

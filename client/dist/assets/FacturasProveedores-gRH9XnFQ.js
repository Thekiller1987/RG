import{r as n,j as e,I as V,X as Ge,Y as qe,aP as Z,aQ as $,ah as P,ag as _,aa as oe,aR as K,$ as Ye,aS as Xe,aN as Je,aT as Qe,am as ee,k as G,a as Ue,s as l,ae as re,t as Ne,V as Ze}from"./vendor-C4uQ3a2a.js";import{u as Ke,I as er,A as rr,J as tr,K as ar,L as or,M as sr,N as nr,O as ir}from"./index-Dpudypxm.js";import{r as lr}from"./searchEngine-BMYcElFi.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-BMvqz6Um.js";const ye=()=>new Date().toLocaleDateString("sv-SE",{timeZone:"America/Managua"}),S=a=>{if(!a)return"—";const f=new Date(a.includes("T")?a:`${a}T12:00:00`);return new Intl.DateTimeFormat("es-NI",{timeZone:"America/Managua",day:"2-digit",month:"2-digit",year:"numeric"}).format(f)},se=Ne`from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); }`,dr=Ne`from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; }`,cr=l.div`
    padding: clamp(1rem, 3vw, 2.5rem); 
    background: #f8fafc; /* Fondo más limpio */
    min-height: 100vh; 
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    animation: ${se} 0.5s ease-out;
`,mr=l.div`
    display: flex; 
    justify-content: space-between; 
    align-items: flex-start; 
    margin-bottom: 2rem; 
    flex-wrap: wrap; 
    gap: 1.5rem;
`,xr=l.div`
    display: flex;
    flex-direction: column;
`,hr=l.h1`
    font-size: clamp(1.8rem, 2.5vw, 2.2rem); 
    color: #1e293b; 
    display: flex; 
    align-items: center; 
    gap: 0.75rem; 
    margin: 0; 
    font-weight: 800;
    letter-spacing: -0.03em;
    
    svg { color: #3b82f6; } /* Azul vibrante */
`,fr=l.p`
    color: #64748b;
    margin: 0.5rem 0 0 0;
    font-size: 1rem;
    font-weight: 500;
`,pr=l.div`
    display: flex; 
    gap: 0.75rem;
    flex-wrap: wrap;
    
    @media (max-width: 600px) {
        width: 100%;
        button, a { flex: 1; justify-content: center; }
    }
`,h=l.button`
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
    
    ${a=>a.$primary&&re`
        background: #3b82f6;
        color: white;
        box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
        &:hover { background: #2563eb; transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.4); }
    `}

    ${a=>a.$secondary&&re`
        background: white;
        color: #334155;
        border: 1px solid #e2e8f0;
        &:hover { background: #f1f5f9; border-color: #cbd5e1; transform: translateY(-1px); }
    `}

    ${a=>a.$danger&&re`
        background: #fee2e2;
        color: #ef4444;
        &:hover { background: #fecaca; transform: scale(1.05); }
    `}

    &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
`,ur=l(Ze)`
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
`,gr=l.div`
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); 
    gap: 1.5rem; 
    margin-bottom: 2.5rem;
`,T=l.div`
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
`,z=l.div`
    position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
    background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px); 
    display: flex; justify-content: center; align-items: center; z-index: 1200; 
    animation: ${se} 0.2s;
`,I=l.div`
    background: white; padding: 2.5rem; border-radius: 24px; 
    width: 95%; max-width: 550px; 
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); 
    animation: ${dr} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    max-height: 90vh; overflow-y: auto;
    
    h2 { margin: 0 0 1.5rem 0; color: #1e293b; font-size: 1.6rem; font-weight: 800; letter-spacing: -0.025em; }
`,b=l.div`
    margin-bottom: 1.25rem;
    label { display: block; font-size: 0.92rem; color: #475569; margin-bottom: 0.5rem; font-weight: 600; }
    input, select, textarea { 
        width: 100%; padding: 0.9rem 1rem; border: 1px solid #cbd5e1; border-radius: 12px; 
        font-size: 1rem; color: #1e293b; background: #fff; transition: all 0.2s; 
        &:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
        &::placeholder { color: #94a3b8; }
    }
`,te=l.button`
    position: absolute; top: 1.5rem; right: 1.5rem; 
    background: #f1f5f9; border-radius:50%; width:32px; height:32px; 
    border: none; color: #64748b; font-size: 1rem; cursor: pointer; display:grid; place-items:center;
    transition: all 0.2s;
    &:hover { color: #ef4444; background: #fee2e2; }
`,we=l.div`
    background: white; padding: 0.75rem; border-radius: 20px;
    border: 1px solid #e2e8f0; display: flex; flex-direction: column; 
    gap: 1.5rem; margin-bottom: 2rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.01);
`,br=l.div`
    display: flex; gap: 0.75rem; overflow-x: auto; padding-bottom: 0.75rem;
    border-bottom: 1px solid #f1f5f9;
    &::-webkit-scrollbar { height: 4px; }
    &::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
`,jr=l.button`
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
`,Ce=l.div`
    background: white; border-radius: 24px; border: 1px solid #e2e8f0; overflow: hidden;
    animation: ${se} 0.4s ease-out; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
`,ae=l.table`
    width: 100%; border-collapse: collapse; text-align: left;
    th { background: #f8fafc; padding: 1rem 1.5rem; font-size: 0.85rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #f1f5f9; }
    td { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; color: #334155; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #fbfcfd; }
    .provider-name { font-weight: 800; color: #1e293b; }
    .amount { font-family: 'Inter', sans-serif; font-weight: 700; text-align: right; }
    .count-badge { background: #e2e8f0; color: #475569; padding: 2px 8px; border-radius: 6px; font-weight: 800; font-size: 0.8rem; }
`,Ae=l.div`
    padding: 1.5rem 2rem; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;
    h3 { margin: 0; font-size: 1.25rem; font-weight: 800; color: #1e293b; display: flex; align-items: center; gap: 0.75rem; }
    .date-range { font-size: 0.9rem; color: #64748b; font-weight: 600; background: #f1f5f9; padding: 0.4rem 1rem; border-radius: 99px; }
`,Se=l.div`
    display: flex; flex-wrap: wrap; gap: 1rem; justify-content: space-between;
`,vr=l.div`
    position: relative; min-width: 280px; flex: 2;
    svg { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #94a3b8; }
    input {
        width: 100%; padding: 0.75rem 1rem 0.75rem 2.8rem;
        border: 1px solid #e2e8f0; border-radius: 12px; font-size: 0.95rem;
        &:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
    }
`,E=l.div`
    min-width: 160px; flex: 1;
    display: flex; flex-direction: column; gap: 0.4rem;
    label { font-size: 0.8rem; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    select, input {
        width: 100%; padding: 0.7rem 1rem; border: 1px solid #e2e8f0; border-radius: 12px; 
        font-size: 0.92rem; background: #fff;
        &:focus { border-color: #3b82f6; outline: none; }
    }
`,yr=l.div`
    display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1.5rem;
`,wr=l.div`
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
`,W=l.span`
    padding: 0.4rem 1rem; border-radius: 99px; font-size: 0.75rem; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase;
    background: ${a=>a.bg}; color: ${a=>a.text}; box-shadow: 0 1px 2px rgba(0,0,0,0.05);
`,Cr=({info:a,onClose:f})=>a.show?e.jsx(z,{onClick:f,children:e.jsxs(I,{style:{maxWidth:"400px",textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"3rem",marginBottom:"1rem",color:a.type==="error"?"#ef4444":a.type==="success"?"#22c55e":"#3b82f6"},children:a.type==="error"?e.jsx(G,{style:{border:"3px solid",borderRadius:"50%",padding:5}}):a.type==="success"?e.jsx(oe,{}):e.jsx($,{})}),e.jsx("h2",{children:a.title}),e.jsx("p",{style:{color:"#64748b",lineHeight:1.6,marginBottom:"2rem"},children:a.message}),e.jsx(h,{$primary:!0,onClick:f,style:{margin:"0 auto",width:"100%"},children:"Entendido"})]})}):null,Dr=()=>{const{token:a}=Ke(),[f,Ee]=n.useState([]),[q,Fe]=n.useState([]),[ne,ie]=n.useState(!1),[De,F]=n.useState(0),[D,Pe]=n.useState("PENDIENTE"),[k,ke]=n.useState("vencimiento_asc"),[Y,_e]=n.useState(""),[y,le]=n.useState(""),[p,de]=n.useState(""),[u,ce]=n.useState(""),[me,xe]=n.useState({show:!1,title:"",message:"",type:"info"}),[Te,R]=n.useState(!1),[$e,B]=n.useState(!1),[ze,O]=n.useState(!1),[Ie,X]=n.useState(!1),[C,he]=n.useState(!1),[Re,fe]=n.useState(!1),[pe,J]=n.useState([]),[M,ue]=n.useState([]),[s,Q]=n.useState(null),[d,j]=n.useState({proveedor:"",numero_factura:"",fecha_emision:ye(),fecha_vencimiento:"",monto_total:"",notas:"",tipo_compra:"CREDITO",metodo_pago:"EFECTIVO",referencia:""}),[v,L]=n.useState({amount:"",reference:"",method:"EFECTIVO"}),g=(r,t,o="info")=>{xe({show:!0,title:r,message:t,type:o})};n.useEffect(()=>{a&&(async()=>{ie(!0);try{const t={};p&&(t.startDate=p),u&&(t.endDate=u),y&&y!==""&&(t.proveedor=y);const o=await er(a,Object.keys(t).length?t:void 0),i=Array.isArray(o)?o:(o==null?void 0:o.data)||[];Ee(i);const m=await Ue.get(`${rr}/providers`,{headers:{Authorization:`Bearer ${a}`}}),c=Array.isArray(m.data)?m.data:m.data.data||[];if(Fe(c),C){const x=await tr(a,Object.keys(t).length?t:void 0);ue(Array.isArray(x)?x:(x==null?void 0:x.data)||[])}}catch(t){console.error("Error cargando datos:",t)}finally{ie(!1)}})()},[a,De,p,u,y,C]);const Be=r=>{Q(r),L({amount:"",reference:"",method:"EFECTIVO"}),B(!0)},Oe=async r=>{if(r.preventDefault(),!s||!v.amount)return;const t=parseFloat(v.amount),o=(parseFloat(s.monto_total)||0)-(parseFloat(s.monto_abonado)||0);if(t<=0)return g("Error","El monto debe ser mayor a cero.","error");if(t>o+.01)return g("Error","El monto excede la deuda pendiente.","error");const m=t>=o-.1?"PAGADA":s.estado;try{await nr(s.id,{amount:t,reference:v.reference,method:v.method,status:m},a),F(c=>c+1),B(!1),g("Pago Registrado",`Se registró el abono correctamente. Estado: ${m}`,"success")}catch(c){console.error(c),g("Error","No se pudo registrar el pago. Intente nuevamente.","error")}},Me=async r=>{if(r.preventDefault(),!d.proveedor)return g("Falta Proveedor","Seleccione un proveedor.","warning");try{await sr(d,a),F(t=>t+1),R(!1),j({proveedor:"",numero_factura:"",fecha_emision:ye(),fecha_vencimiento:"",monto_total:"",notas:"",tipo_compra:"CREDITO",metodo_pago:"EFECTIVO",referencia:""}),g("Guardado","La factura ha sido registrada exitosamente.","success")}catch{g("Error","Error al guardar factura.","error")}},Le=async()=>{if(s)try{await ir(s.id,a),F(r=>r+1),O(!1),g("Eliminada","La factura fue eliminada del sistema.","success")}catch{g("Error","No se pudo eliminar la factura.","error")}},He=async r=>{Q(r),X(!0),fe(!0),J([]);try{const t=await ar(r.id,a);J(Array.isArray(t)?t:(t==null?void 0:t.data)||[])}catch{g("Error","No se pudo cargar el historial de abonos.","error")}finally{fe(!1)}},ge=async(r,t=null)=>{if(window.confirm("¿Eliminar este abono? El monto se descontará del total abonado en la factura."))try{await or(r,a),J(o=>o.filter(i=>i.id!==r)),ue(o=>o.filter(i=>i.abono_id!==r)),F(o=>o+1),g("Abono Eliminado","El abono fue eliminado y la factura fue actualizada.","success")}catch{g("Error","No se pudo eliminar el abono. Intenta nuevamente.","error")}},H=n.useCallback(r=>{const t=parseFloat(r.monto_total)||0,o=parseFloat(r.monto_abonado)||0;if(t>0&&o>=t-.1)return"PAGADA";if(!r.fecha_vencimiento)return"PENDIENTE";const i=new Date;i.setHours(0,0,0,0);let m=r.fecha_vencimiento;m&&m.includes("T")&&(m=m.split("T")[0]);const c=m.split(/[-/]/);let x,A,U;c[0].length===4?(x=parseInt(c[0],10),A=parseInt(c[1],10)-1,U=parseInt(c[2],10)):(U=parseInt(c[0],10),A=parseInt(c[1],10)-1,x=parseInt(c[2],10));const je=new Date(x,A,U);je.setHours(0,0,0,0);const We=je-i,ve=Math.ceil(We/(1e3*60*60*24));return ve<0?"VENCIDA":ve<=5?"PROXIMA":"PENDIENTE"},[]),Ve=n.useCallback(r=>{switch(r){case"VENCIDA":return{color:"#dc2626",bg:"#fee2e2",activeColor:"#dc2626",activeBg:"#fef2f2",label:"Vencida"};case"PROXIMA":return{color:"#ea580c",bg:"#ffedd5",activeColor:"#c2410c",activeBg:"#fff7ed",label:"Próxima a Vencer"};case"PAGADA":return{color:"#16a34a",bg:"#dcfce7",activeColor:"#16a34a",activeBg:"#f0fdf4",label:"Pagada"};default:return{color:"#3b82f6",bg:"#dbeafe",activeColor:"#2563eb",activeBg:"#eff6ff",label:"Pendiente"}}},[]),w=n.useMemo(()=>{let r=0,t=0,o=0,i=0,m=0;return f.forEach(c=>{const x=H(c);x==="PENDIENTE"&&r++,x==="VENCIDA"&&t++,x==="PAGADA"&&o++,x==="PROXIMA"&&i++;const A=(parseFloat(c.monto_total)||0)-(parseFloat(c.monto_abonado)||0);x!=="PAGADA"&&(m+=A)}),{pend:r,venc:t,pag:o,prox:i,totalDebt:m,totalCount:f.length}},[f,H]),N=n.useMemo(()=>{let r=f;const t={};return r.forEach(o=>{const i=o.proveedor||"Sin Proveedor";t[i]||(t[i]={provider:i,count:0,totalAmount:0,totalPaid:0}),t[i].count+=1,t[i].totalAmount+=parseFloat(o.monto_total)||0,t[i].totalPaid+=parseFloat(o.monto_abonado)||0}),Object.values(t).sort((o,i)=>i.totalAmount-o.totalAmount)},[f,p,u]),be=n.useMemo(()=>{let r=f.map(t=>({...t,effectiveStatus:H(t)}));return D!=="TODAS"&&(D==="PENDIENTE"?r=r.filter(t=>t.effectiveStatus==="PENDIENTE"||t.effectiveStatus==="PROXIMA"):r=r.filter(t=>t.effectiveStatus===D)),y&&(r=r.filter(t=>t.proveedor===y)),r=lr(r,Y,["proveedor","numero_factura"]),r.sort((t,o)=>k==="vencimiento_asc"?new Date(t.fecha_vencimiento)-new Date(o.fecha_vencimiento):k==="emision_desc"?new Date(o.fecha_emision)-new Date(t.fecha_emision):k==="emision_asc"?new Date(t.fecha_emision)-new Date(o.fecha_emision):0),r},[f,D,Y,y,p,u,k,H]);return e.jsxs(cr,{children:[e.jsx(Cr,{info:me,onClose:()=>xe({...me,show:!1})}),e.jsxs(mr,{children:[e.jsxs(xr,{children:[e.jsxs(hr,{children:[e.jsx(V,{})," Facturas de Proveedores"]}),e.jsx(fr,{children:"Gestión y control de cuentas por pagar"})]}),e.jsxs(pr,{children:[e.jsx(h,{$secondary:!0,onClick:()=>F(r=>r+1),children:"Actualizar"}),e.jsxs(ur,{to:"/dashboard",children:[e.jsx(Ge,{})," Volver"]}),e.jsxs(h,{$primary:!0,onClick:()=>R(!0),children:[e.jsx(qe,{})," Registrar Factura"]})]})]}),e.jsxs("div",{style:{display:"flex",gap:"1rem",marginBottom:"2rem",borderBottom:"2px solid #e2e8f0",paddingBottom:"1rem"},children:[e.jsxs("button",{onClick:()=>he(!1),style:{padding:"0.75rem 1.5rem",borderRadius:"8px",fontWeight:"bold",cursor:"pointer",border:"none",background:C?"transparent":"#3b82f6",color:C?"#64748b":"white",transition:"all 0.2s"},children:[e.jsx(V,{style:{marginRight:"8px"}})," Control de Facturas (Deudas)"]}),e.jsxs("button",{onClick:()=>he(!0),style:{padding:"0.75rem 1.5rem",borderRadius:"8px",fontWeight:"bold",cursor:"pointer",border:"none",background:C?"#3b82f6":"transparent",color:C?"white":"#64748b",transition:"all 0.2s"},children:[e.jsx(Z,{style:{marginRight:"8px"}})," Reporte de Egresos (Abonos & Pagos Históricos)"]})]}),!C&&e.jsxs(e.Fragment,{children:[e.jsxs(gr,{children:[e.jsxs(T,{color:"#ef4444",bg:"#fef2f2",children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx($,{})}),e.jsx("div",{className:"label",children:"Vencidas"}),e.jsx("div",{className:"value",children:w.venc}),e.jsx("div",{className:"sub",children:"Requieren atención urgente"})]}),e.jsxs(T,{color:"#ea580c",bg:"#fff7ed",children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(P,{})}),e.jsx("div",{className:"label",children:"Próximas a Vencer"}),e.jsx("div",{className:"value",children:w.prox}),e.jsx("div",{className:"sub",children:"En los próx. 5 días"})]}),e.jsxs(T,{color:"#6366f1",bg:"#eef2ff",children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(V,{})}),e.jsx("div",{className:"label",children:"Total Facturas"}),e.jsx("div",{className:"value",children:w.totalCount}),e.jsx("div",{className:"sub",children:"Registradas en sistema"})]}),e.jsxs(T,{color:"#3b82f6",bg:"#eff6ff",children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(P,{})}),e.jsx("div",{className:"label",children:"Pendientes"}),e.jsx("div",{className:"value",children:w.pend}),e.jsx("div",{className:"sub",children:"Sin riesgo inmediato"})]}),e.jsxs(T,{color:"#f59e0b",bg:"#fffbeb",children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(_,{})}),e.jsx("div",{className:"label",children:"Deuda Total"}),e.jsxs("div",{className:"value",style:{color:"#b45309"},children:["C$",w.totalDebt.toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsx("div",{className:"sub",style:{color:"#b45309"},children:"Saldo Pendiente Global"})]})]}),e.jsxs(we,{children:[e.jsx(br,{children:[{id:"PENDIENTE",label:"Por Pagar (Prox)",icon:P,color:"#3b82f6",bg:"#eff6ff",count:w.pend+w.prox},{id:"VENCIDA",label:"Vencidas",icon:$,color:"#dc2626",bg:"#fef2f2",count:w.venc},{id:"PAGADA",label:"Pagadas",icon:oe,color:"#16a34a",bg:"#f0fdf4",count:w.pag},{id:"BI",label:"Resumen BI",icon:K,color:"#6366f1",bg:"#eef2ff",count:null},{id:"TODAS",label:"Todas",icon:Z,color:"#64748b",bg:"#f1f5f9",count:null}].map(r=>e.jsxs(jr,{active:D===r.id,activeColor:r.color,activeBg:r.bg,onClick:()=>Pe(r.id),children:[e.jsx(r.icon,{})," ",r.label,r.count!==null&&e.jsx("span",{className:"badge",children:r.count})]},r.id))}),e.jsxs(Se,{children:[e.jsxs(vr,{children:[e.jsx(Ye,{}),e.jsx("input",{type:"text",placeholder:"Buscar proveedor o No. factura...",value:Y,onChange:r=>_e(r.target.value)})]}),e.jsxs(E,{style:{minWidth:"180px"},children:[e.jsx("label",{children:"Ordenar Por"}),e.jsxs("select",{value:k,onChange:r=>ke(r.target.value),children:[e.jsx("option",{value:"vencimiento_asc",children:"Vencen Primero (Próximas)"}),e.jsx("option",{value:"emision_desc",children:"Emitidas Reciente (Nuevas)"}),e.jsx("option",{value:"emision_asc",children:"Emitidas Antiguas (Viejas)"})]})]}),e.jsxs(E,{children:[e.jsx("label",{children:"Proveedor"}),e.jsxs("select",{value:y,onChange:r=>le(r.target.value),children:[e.jsx("option",{value:"",children:"Todos"}),q.map(r=>e.jsx("option",{value:r.nombre,children:r.nombre},r.id_proveedor||r.id))]})]}),e.jsxs(E,{style:{minWidth:"140px"},children:[e.jsx("label",{children:"Desde"}),e.jsx("input",{type:"date",value:p,onChange:r=>de(r.target.value)})]}),e.jsxs(E,{style:{minWidth:"140px"},children:[e.jsx("label",{children:"Hasta"}),e.jsx("input",{type:"date",value:u,onChange:r=>ce(r.target.value)})]})]})]}),ne?e.jsxs("div",{style:{textAlign:"center",padding:"4rem",color:"#94a3b8"},children:[e.jsx(P,{className:"spin",style:{fontSize:"2rem",marginBottom:"1rem"}}),e.jsx("p",{children:"Cargando información..."})]}):be.length>0?e.jsx(yr,{children:be.map(r=>{const t=r.effectiveStatus,o=Ve(t),i=parseFloat(r.monto_total)||0,m=parseFloat(r.monto_abonado)||0,c=i-m,x=i>0?m/i*100:0,A=t==="PAGADA"?r.referencia_pago:null;return e.jsxs(wr,{color:o.color,balanceColor:c>0?"#ef4444":"#16a34a",children:[e.jsxs("div",{className:"card-header",children:[e.jsxs("div",{className:"provider-info",children:[e.jsxs("h3",{title:r.proveedor,children:[e.jsx(Xe,{style:{marginRight:6,color:"#94a3b8"}})," ",r.proveedor]}),e.jsxs("span",{className:"invoice-number",children:["#",r.numero_factura]})]}),e.jsx(W,{bg:o.bg,text:o.color,children:o.label})]}),e.jsxs("div",{className:"card-body",children:[e.jsxs("div",{className:"meta-row",children:[e.jsxs("span",{className:"label",children:[e.jsx(Je,{})," Emisión"]}),e.jsx("span",{className:"value",children:S(r.fecha_emision)})]}),e.jsxs("div",{className:"meta-row",children:[e.jsxs("span",{className:"label",children:[e.jsx($,{})," Vence"]}),e.jsx("span",{className:"value",style:{color:r.estado==="VENCIDA"?"#ef4444":"inherit"},children:S(r.fecha_vencimiento)})]}),A&&e.jsxs("div",{className:"meta-row",children:[e.jsxs("span",{className:"label",children:[e.jsx(Qe,{})," Referencia"]}),e.jsx("span",{className:"value",children:A})]}),e.jsxs("div",{className:"financial-block",children:[e.jsxs("div",{className:"total-row",children:[e.jsx("span",{className:"label",children:"Total a Pagar"}),e.jsxs("span",{className:"amount",children:["C$",i.toLocaleString(void 0,{minimumFractionDigits:2})]})]}),e.jsx("div",{className:"progress-bar",children:e.jsx("div",{style:{width:`${x}%`,background:o.color}})}),e.jsxs("div",{className:"balance-text",children:["Abonado: C$",m.toLocaleString(void 0,{minimumFractionDigits:2})," • ",e.jsxs("strong",{children:["Resta: C$",c.toLocaleString(void 0,{minimumFractionDigits:2})]})]})]})]}),e.jsxs("div",{className:"card-footer",style:{flexWrap:"wrap"},children:[c>0&&e.jsxs(h,{$primary:!0,style:{flex:1,justifyContent:"center"},onClick:()=>Be(r),children:[e.jsx(_,{})," Abonar"]}),e.jsxs(h,{$secondary:!0,style:{flex:1,justifyContent:"center"},onClick:()=>He(r),children:[e.jsx(Z,{})," Historial"]}),e.jsx(h,{$danger:!0,style:{padding:"0.75rem"},onClick:()=>{Q(r),O(!0)},children:e.jsx(ee,{})})]})]},r.id)})}):D==="BI"?e.jsxs(Ce,{children:[e.jsxs(Ae,{children:[e.jsxs("h3",{children:[e.jsx(K,{})," Resumen de Razonamiento de Negocio"]}),p&&u&&e.jsxs("span",{className:"date-range",children:[S(p)," - ",S(u)]})]}),e.jsxs(ae,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Proveedor"}),e.jsx("th",{style:{textAlign:"center"},children:"Facturas"}),e.jsx("th",{style:{textAlign:"right"},children:"Total Comprado"}),e.jsx("th",{style:{textAlign:"right"},children:"Pagado"}),e.jsx("th",{style:{textAlign:"right"},children:"Saldo Pendiente"})]})}),e.jsxs("tbody",{children:[N.map(r=>e.jsxs("tr",{children:[e.jsx("td",{className:"provider-name",children:r.provider}),e.jsx("td",{style:{textAlign:"center"},children:e.jsx("span",{className:"count-badge",children:r.count})}),e.jsxs("td",{className:"amount",children:["C$",r.totalAmount.toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsxs("td",{className:"amount",style:{color:"#16a34a"},children:["C$",r.totalPaid.toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsxs("td",{className:"amount",style:{color:r.totalAmount-r.totalPaid>.1?"#ef4444":"#16a34a"},children:["C$",(r.totalAmount-r.totalPaid).toLocaleString(void 0,{minimumFractionDigits:2})]})]},r.provider)),N.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:"5",style:{textAlign:"center",padding:"3rem",color:"#94a3b8"},children:"No hay datos para el período seleccionado."})})]}),N.length>0&&e.jsx("tfoot",{children:e.jsxs("tr",{style:{background:"#f8fafc",fontWeight:"900"},children:[e.jsx("td",{colSpan:"2",style:{textAlign:"right",textTransform:"uppercase",fontSize:"0.8rem",color:"#64748b"},children:"Totales Globales:"}),e.jsxs("td",{className:"amount",children:["C$",N.reduce((r,t)=>r+t.totalAmount,0).toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsxs("td",{className:"amount",children:["C$",N.reduce((r,t)=>r+t.totalPaid,0).toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsxs("td",{className:"amount",style:{color:"#ef4444"},children:["C$",(N.reduce((r,t)=>r+t.totalAmount,0)-N.reduce((r,t)=>r+t.totalPaid,0)).toLocaleString(void 0,{minimumFractionDigits:2})]})]})})]})]}):e.jsxs("div",{style:{textAlign:"center",padding:"4rem",color:"#94a3b8",border:"2px dashed #e2e8f0",borderRadius:"24px",background:"white"},children:[e.jsx(V,{style:{fontSize:"3rem",marginBottom:"1rem",opacity:.3}}),e.jsx("h3",{style:{color:"#475569"},children:"No se encontraron facturas"}),e.jsx("p",{children:"Intenta ajustar los filtros o registra una nueva."})]})]}),C&&e.jsxs(e.Fragment,{children:[e.jsx(we,{children:e.jsxs(Se,{style:{width:"100%"},children:[e.jsxs("div",{style:{flex:1,display:"flex",alignItems:"center",gap:"0.5rem",color:"#3b82f6",fontWeight:"800"},children:[e.jsx(K,{})," Filtros del Reporte:"]}),e.jsxs(E,{children:[e.jsx("label",{children:"Proveedor"}),e.jsxs("select",{value:y,onChange:r=>le(r.target.value),children:[e.jsx("option",{value:"",children:"TODOS"}),q.map(r=>e.jsx("option",{value:r.nombre,children:r.nombre},r.id_proveedor||r.id))]})]}),e.jsxs(E,{style:{minWidth:"140px"},children:[e.jsx("label",{children:"Desde"}),e.jsx("input",{type:"date",value:p,onChange:r=>de(r.target.value)})]}),e.jsxs(E,{style:{minWidth:"140px"},children:[e.jsx("label",{children:"Hasta"}),e.jsx("input",{type:"date",value:u,onChange:r=>ce(r.target.value)})]}),e.jsx(h,{$secondary:!0,onClick:()=>F(r=>r+1),style:{alignSelf:"flex-end",height:"42px"},children:"Aplicar Filtros"})]})}),e.jsxs(Ce,{children:[e.jsxs(Ae,{children:[e.jsxs("h3",{children:[e.jsx(_,{})," Listado de Pagos y Abonos Efectuados"]}),(p||u)&&e.jsxs("span",{className:"date-range",children:[p?S(p):"Inicio"," - ",u?S(u):"Hoy"]})]}),ne?e.jsxs("div",{style:{textAlign:"center",padding:"3rem",color:"#94a3b8"},children:[e.jsx(P,{className:"spin",style:{fontSize:"2rem",marginBottom:"1rem"}}),e.jsx("p",{children:"Cargando información..."})]}):e.jsx("div",{style:{overflowX:"auto"},children:e.jsxs(ae,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Fecha Abono"}),e.jsx("th",{children:"Factura"}),e.jsx("th",{children:"Proveedor"}),e.jsx("th",{children:"Método"}),e.jsx("th",{children:"Referencia / Detalle"}),e.jsx("th",{style:{textAlign:"center"},children:"Modo de Compra"}),e.jsx("th",{style:{textAlign:"right"},children:"Monto Pagado (C$)"}),e.jsx("th",{style:{textAlign:"center"},children:"Acción"})]})}),e.jsxs("tbody",{children:[M.map(r=>e.jsxs("tr",{children:[e.jsx("td",{children:S(r.fecha_abono)}),e.jsx("td",{children:e.jsxs("b",{children:["#",r.numero_factura]})}),e.jsx("td",{children:r.proveedor}),e.jsx("td",{children:e.jsx(W,{bg:"#f1f5f9",text:"#475569",children:r.metodo_pago})}),e.jsx("td",{children:r.referencia||"-"}),e.jsx("td",{style:{textAlign:"center"},children:e.jsx(W,{bg:r.tipo_compra==="CONTADO"?"#dcfce7":"#eef2ff",text:r.tipo_compra==="CONTADO"?"#16a34a":"#4f46e5",children:r.tipo_compra})}),e.jsxs("td",{className:"amount",style:{color:"#16a34a"},children:["C$",parseFloat(r.monto).toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsx("td",{style:{textAlign:"center"},children:e.jsx(h,{$danger:!0,title:"Eliminar este abono",style:{padding:"0.4rem 0.7rem",fontSize:"0.8rem",borderRadius:"8px",margin:"0 auto"},onClick:()=>ge(r.abono_id),children:e.jsx(ee,{})})})]},r.abono_id)),M.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:"7",style:{textAlign:"center",padding:"3rem",color:"#94a3b8"},children:"No hay registro de abonos o pagos en este período."})})]}),M.length>0&&e.jsx("tfoot",{children:e.jsxs("tr",{style:{background:"#f8fafc",fontWeight:"900"},children:[e.jsx("td",{colSpan:"7",style:{textAlign:"right",textTransform:"uppercase",fontSize:"0.8rem",color:"#64748b"},children:"Total Egresos (Abonos + Pagos de Contado):"}),e.jsxs("td",{className:"amount",style:{color:"#16a34a",fontSize:"1.2rem"},children:["C$",M.reduce((r,t)=>r+parseFloat(t.monto),0).toLocaleString(void 0,{minimumFractionDigits:2})]})]})})]})})]})]}),Te&&e.jsx(z,{onClick:()=>R(!1),children:e.jsxs(I,{onClick:r=>r.stopPropagation(),children:[e.jsx(te,{onClick:()=>R(!1),children:e.jsx(G,{})}),e.jsx("h2",{children:"Registrar Factura"}),e.jsxs("form",{onSubmit:Me,children:[e.jsxs(b,{children:[e.jsx("label",{children:"Proveedor"}),e.jsxs("select",{required:!0,value:d.proveedor,onChange:r=>j({...d,proveedor:r.target.value}),children:[e.jsx("option",{value:"",children:"Seleccione un proveedor..."}),q.map(r=>e.jsx("option",{value:r.nombre,children:r.nombre},r.id_proveedor||r.id))]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"},children:[e.jsxs(b,{children:[e.jsx("label",{children:"No. Factura"}),e.jsx("input",{required:!0,type:"text",value:d.numero_factura,onChange:r=>j({...d,numero_factura:r.target.value}),placeholder:"Ej: F-001"})]}),e.jsxs(b,{children:[e.jsx("label",{children:"Monto Total (C$)"}),e.jsx("input",{required:!0,type:"number",step:"0.01",value:d.monto_total,onChange:r=>j({...d,monto_total:r.target.value}),placeholder:"0.00"})]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"},children:[e.jsxs(b,{children:[e.jsx("label",{children:"Fecha Emisión"}),e.jsx("input",{required:!0,type:"date",value:d.fecha_emision,onChange:r=>j({...d,fecha_emision:r.target.value})})]}),e.jsxs(b,{children:[e.jsx("label",{children:"Fecha Vencimiento"}),e.jsx("input",{required:!0,type:"date",value:d.fecha_vencimiento,onChange:r=>j({...d,fecha_vencimiento:r.target.value})})]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",background:"#f8fafc",padding:"1rem",borderRadius:"12px",marginBottom:"1.25rem",border:"1px solid #e2e8f0"},children:[e.jsxs(b,{style:{marginBottom:0},children:[e.jsx("label",{children:"Tipo de Compra"}),e.jsxs("select",{required:!0,value:d.tipo_compra,onChange:r=>j({...d,tipo_compra:r.target.value}),children:[e.jsx("option",{value:"CREDITO",children:"A Crédito"}),e.jsx("option",{value:"CONTADO",children:"De Contado"})]})]}),d.tipo_compra==="CONTADO"&&e.jsxs(b,{style:{marginBottom:0},children:[e.jsx("label",{children:"Método de Pago"}),e.jsxs("select",{required:!0,value:d.metodo_pago,onChange:r=>j({...d,metodo_pago:r.target.value}),children:[e.jsx("option",{value:"EFECTIVO",children:"Efectivo"}),e.jsx("option",{value:"TARJETA",children:"Tarjeta"}),e.jsx("option",{value:"TRANSFERENCIA",children:"Transferencia"}),e.jsx("option",{value:"CHEQUE",children:"Cheque"})]})]})]}),d.tipo_compra==="CONTADO"&&e.jsxs(b,{children:[e.jsx("label",{children:"Referencia de Pago (Transferencia, Cheque, etc.)"}),e.jsx("input",{type:"text",value:d.referencia,onChange:r=>j({...d,referencia:r.target.value}),placeholder:"Opcional..."})]}),e.jsxs(b,{children:[e.jsx("label",{children:"Notas (Opcional)"}),e.jsx("textarea",{rows:"3",value:d.notas,onChange:r=>j({...d,notas:r.target.value}),placeholder:"Detalles extra..."})]}),e.jsxs(h,{$primary:!0,type:"submit",style:{width:"100%",padding:"1rem",fontSize:"1rem"},children:[e.jsx(oe,{})," Guardar Factura"]})]})]})}),$e&&e.jsx(z,{onClick:()=>B(!1),children:e.jsxs(I,{onClick:r=>r.stopPropagation(),style:{maxWidth:"450px"},children:[e.jsx(te,{onClick:()=>B(!1),children:e.jsx(G,{})}),e.jsx("h2",{children:"Registrar Abono"}),e.jsxs("div",{style:{background:"#f1f5f9",padding:"1rem",borderRadius:"12px",marginBottom:"1.5rem"},children:[e.jsxs("div",{style:{fontSize:"0.9rem",color:"#64748b",marginBottom:"0.25rem"},children:["Factura #",s==null?void 0:s.numero_factura]}),e.jsxs("div",{style:{fontSize:"1.5rem",fontWeight:"800",color:"#1e293b"},children:["Deuda: C$",((parseFloat(s==null?void 0:s.monto_total)||0)-(parseFloat(s==null?void 0:s.monto_abonado)||0)).toFixed(2)]})]}),e.jsxs("form",{onSubmit:Oe,children:[e.jsxs(b,{children:[e.jsx("label",{children:"Monto a Abonar (C$)"}),e.jsx("input",{required:!0,type:"number",step:"0.01",autoFocus:!0,placeholder:"0.00",value:v.amount,onChange:r=>L({...v,amount:r.target.value})})]}),e.jsxs(b,{children:[e.jsx("label",{children:"Método de Pago"}),e.jsxs("select",{required:!0,value:v.method,onChange:r=>L({...v,method:r.target.value}),children:[e.jsx("option",{value:"EFECTIVO",children:"Efectivo"}),e.jsx("option",{value:"TARJETA",children:"Tarjeta"}),e.jsx("option",{value:"TRANSFERENCIA",children:"Transferencia"}),e.jsx("option",{value:"CHEQUE",children:"Cheque"})]})]}),e.jsxs(b,{children:[e.jsx("label",{children:"Referencia / Detalle (Opcional)"}),e.jsx("input",{type:"text",placeholder:"Ej: Transferencia #1234, Pago en efectivo...",value:v.reference,onChange:r=>L({...v,reference:r.target.value})})]}),e.jsxs(h,{$primary:!0,type:"submit",style:{width:"100%",padding:"1rem"},children:[e.jsx(_,{})," Confirmar Pago"]})]})]})}),ze&&e.jsx(z,{onClick:()=>O(!1),children:e.jsxs(I,{style:{maxWidth:"400px",textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"3rem",color:"#ef4444",marginBottom:"1rem"},children:e.jsx($,{})}),e.jsx("h2",{children:"¿Eliminar Factura?"}),e.jsxs("p",{style:{color:"#64748b",marginBottom:"2rem"},children:["Estás a punto de eliminar la factura ",e.jsxs("b",{children:["#",s==null?void 0:s.numero_factura]}),". Esta acción no se puede deshacer."]}),e.jsxs("div",{style:{display:"flex",gap:"1rem"},children:[e.jsx(h,{$secondary:!0,onClick:()=>O(!1),style:{flex:1},children:"Cancelar"}),e.jsx(h,{$danger:!0,onClick:Le,style:{flex:1},children:"Sí, Eliminar"})]})]})}),Ie&&e.jsx(z,{onClick:()=>X(!1),children:e.jsxs(I,{onClick:r=>r.stopPropagation(),style:{maxWidth:"600px"},children:[e.jsx(te,{onClick:()=>X(!1),children:e.jsx(G,{})}),e.jsx("h2",{children:"Historial de Abonos"}),e.jsxs("div",{style:{background:"#f1f5f9",padding:"1rem",borderRadius:"12px",marginBottom:"1.5rem",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("div",{children:[e.jsxs("div",{style:{fontSize:"0.9rem",color:"#64748b"},children:["Factura #",s==null?void 0:s.numero_factura]}),e.jsx("div",{style:{fontSize:"1.1rem",fontWeight:"800",color:"#1e293b"},children:s==null?void 0:s.proveedor})]}),e.jsxs("div",{style:{textAlign:"right"},children:[e.jsx("div",{style:{fontSize:"0.9rem",color:"#64748b"},children:"Abonado Total"}),e.jsxs("div",{style:{fontSize:"1.2rem",fontWeight:"800",color:"#16a34a"},children:["C$",(parseFloat(s==null?void 0:s.monto_abonado)||0).toLocaleString(void 0,{minimumFractionDigits:2})]})]})]}),Re?e.jsxs("div",{style:{textAlign:"center",padding:"2rem",color:"#94a3b8"},children:[e.jsx(P,{className:"spin",style:{fontSize:"1.5rem",marginBottom:"1rem"}}),e.jsx("p",{children:"Cargando historial..."})]}):pe.length>0?e.jsx("div",{style:{overflowX:"auto"},children:e.jsxs(ae,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Fecha"}),e.jsx("th",{children:"Método"}),e.jsx("th",{children:"Referencia"}),e.jsx("th",{style:{textAlign:"right"},children:"Monto"}),e.jsx("th",{style:{textAlign:"center"},children:"Eliminar"})]})}),e.jsx("tbody",{children:pe.map((r,t)=>e.jsxs("tr",{children:[e.jsx("td",{children:S(r.fecha)}),e.jsx("td",{children:e.jsx(W,{bg:"#f1f5f9",text:"#475569",children:r.metodo_pago})}),e.jsx("td",{children:r.referencia||"-"}),e.jsxs("td",{className:"amount",style:{color:"#16a34a"},children:["C$",parseFloat(r.monto).toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsx("td",{style:{textAlign:"center"},children:e.jsx(h,{$danger:!0,title:"Eliminar este abono duplicado",style:{padding:"0.4rem 0.7rem",fontSize:"0.8rem",borderRadius:"8px"},onClick:()=>ge(r.id,s==null?void 0:s.id),children:e.jsx(ee,{})})})]},r.id||t))})]})}):e.jsxs("div",{style:{textAlign:"center",padding:"3rem",color:"#94a3b8",border:"1px dashed #cbd5e1",borderRadius:"16px"},children:[e.jsx(_,{style:{fontSize:"2rem",marginBottom:"1rem",opacity:.5}}),e.jsx("p",{children:"No existen abonos registrados para esta factura."})]})]})})]})};export{Dr as default};

import{r as n,j as e,J as W,Y as Ve,Z as We,aO as U,aP as $,ai as E,ah as _,ab as te,aQ as Z,a0 as Ge,aR as qe,aH as Ye,aS as Xe,al as Je,n as q,b as Qe,s as i,af as K,t as Ce,W as Ue}from"./vendor-Bl8eSE-Q.js";import{u as Ze,J as Ke,A as er,K as rr,L as tr,M as ar,N as or,O as sr}from"./index-B613Eyqa.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-DV8V3V31.js";const be=()=>new Date().toLocaleDateString("sv-SE",{timeZone:"America/Managua"}),S=a=>{if(!a)return"—";const h=new Date(a.includes("T")?a:`${a}T12:00:00`);return new Intl.DateTimeFormat("es-NI",{timeZone:"America/Managua",day:"2-digit",month:"2-digit",year:"numeric"}).format(h)},ae=Ce`from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); }`,nr=Ce`from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; }`,ir=i.div`
    padding: clamp(1rem, 3vw, 2.5rem); 
    background: #f8fafc; /* Fondo más limpio */
    min-height: 100vh; 
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    animation: ${ae} 0.5s ease-out;
`,lr=i.div`
    display: flex; 
    justify-content: space-between; 
    align-items: flex-start; 
    margin-bottom: 2rem; 
    flex-wrap: wrap; 
    gap: 1.5rem;
`,cr=i.div`
    display: flex;
    flex-direction: column;
`,dr=i.h1`
    font-size: clamp(1.8rem, 2.5vw, 2.2rem); 
    color: #1e293b; 
    display: flex; 
    align-items: center; 
    gap: 0.75rem; 
    margin: 0; 
    font-weight: 800;
    letter-spacing: -0.03em;
    
    svg { color: #3b82f6; } /* Azul vibrante */
`,mr=i.p`
    color: #64748b;
    margin: 0.5rem 0 0 0;
    font-size: 1rem;
    font-weight: 500;
`,xr=i.div`
    display: flex; 
    gap: 0.75rem;
    flex-wrap: wrap;
    
    @media (max-width: 600px) {
        width: 100%;
        button, a { flex: 1; justify-content: center; }
    }
`,g=i.button`
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
    
    ${a=>a.$primary&&K`
        background: #3b82f6;
        color: white;
        box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
        &:hover { background: #2563eb; transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.4); }
    `}

    ${a=>a.$secondary&&K`
        background: white;
        color: #334155;
        border: 1px solid #e2e8f0;
        &:hover { background: #f1f5f9; border-color: #cbd5e1; transform: translateY(-1px); }
    `}

    ${a=>a.$danger&&K`
        background: #fee2e2;
        color: #ef4444;
        &:hover { background: #fecaca; transform: scale(1.05); }
    `}

    &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
`,hr=i(Ue)`
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
`,fr=i.div`
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); 
    gap: 1.5rem; 
    margin-bottom: 2.5rem;
`,T=i.div`
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
`,z=i.div`
    position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
    background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px); 
    display: flex; justify-content: center; align-items: center; z-index: 1200; 
    animation: ${ae} 0.2s;
`,I=i.div`
    background: white; padding: 2.5rem; border-radius: 24px; 
    width: 95%; max-width: 550px; 
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); 
    animation: ${nr} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
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
`,ee=i.button`
    position: absolute; top: 1.5rem; right: 1.5rem; 
    background: #f1f5f9; border-radius:50%; width:32px; height:32px; 
    border: none; color: #64748b; font-size: 1rem; cursor: pointer; display:grid; place-items:center;
    transition: all 0.2s;
    &:hover { color: #ef4444; background: #fee2e2; }
`,je=i.div`
    background: white; padding: 0.75rem; border-radius: 20px;
    border: 1px solid #e2e8f0; display: flex; flex-direction: column; 
    gap: 1.5rem; margin-bottom: 2rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.01);
`,pr=i.div`
    display: flex; gap: 0.75rem; overflow-x: auto; padding-bottom: 0.75rem;
    border-bottom: 1px solid #f1f5f9;
    &::-webkit-scrollbar { height: 4px; }
    &::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
`,ur=i.button`
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
`,ve=i.div`
    background: white; border-radius: 24px; border: 1px solid #e2e8f0; overflow: hidden;
    animation: ${ae} 0.4s ease-out; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
`,re=i.table`
    width: 100%; border-collapse: collapse; text-align: left;
    th { background: #f8fafc; padding: 1rem 1.5rem; font-size: 0.85rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #f1f5f9; }
    td { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; color: #334155; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #fbfcfd; }
    .provider-name { font-weight: 800; color: #1e293b; }
    .amount { font-family: 'Inter', sans-serif; font-weight: 700; text-align: right; }
    .count-badge { background: #e2e8f0; color: #475569; padding: 2px 8px; border-radius: 6px; font-weight: 800; font-size: 0.8rem; }
`,ye=i.div`
    padding: 1.5rem 2rem; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;
    h3 { margin: 0; font-size: 1.25rem; font-weight: 800; color: #1e293b; display: flex; align-items: center; gap: 0.75rem; }
    .date-range { font-size: 0.9rem; color: #64748b; font-weight: 600; background: #f1f5f9; padding: 0.4rem 1rem; border-radius: 99px; }
`,we=i.div`
    display: flex; flex-wrap: wrap; gap: 1rem; justify-content: space-between;
`,gr=i.div`
    position: relative; min-width: 280px; flex: 2;
    svg { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #94a3b8; }
    input {
        width: 100%; padding: 0.75rem 1rem 0.75rem 2.8rem;
        border: 1px solid #e2e8f0; border-radius: 12px; font-size: 0.95rem;
        &:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
    }
`,F=i.div`
    min-width: 160px; flex: 1;
    display: flex; flex-direction: column; gap: 0.4rem;
    label { font-size: 0.8rem; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    select, input {
        width: 100%; padding: 0.7rem 1rem; border: 1px solid #e2e8f0; border-radius: 12px; 
        font-size: 0.92rem; background: #fff;
        &:focus { border-color: #3b82f6; outline: none; }
    }
`,br=i.div`
    display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1.5rem;
`,jr=i.div`
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
`,G=i.span`
    padding: 0.4rem 1rem; border-radius: 99px; font-size: 0.75rem; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase;
    background: ${a=>a.bg}; color: ${a=>a.text}; box-shadow: 0 1px 2px rgba(0,0,0,0.05);
`,vr=({info:a,onClose:h})=>a.show?e.jsx(z,{onClick:h,children:e.jsxs(I,{style:{maxWidth:"400px",textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"3rem",marginBottom:"1rem",color:a.type==="error"?"#ef4444":a.type==="success"?"#22c55e":"#3b82f6"},children:a.type==="error"?e.jsx(q,{style:{border:"3px solid",borderRadius:"50%",padding:5}}):a.type==="success"?e.jsx(te,{}):e.jsx($,{})}),e.jsx("h2",{children:a.title}),e.jsx("p",{style:{color:"#64748b",lineHeight:1.6,marginBottom:"2rem"},children:a.message}),e.jsx(g,{$primary:!0,onClick:h,style:{margin:"0 auto",width:"100%"},children:"Entendido"})]})}):null,Sr=()=>{const{token:a}=Ze(),[h,Ae]=n.useState([]),[Y,Se]=n.useState([]),[oe,se]=n.useState(!1),[Ne,P]=n.useState(0),[D,Fe]=n.useState("PENDIENTE"),[k,De]=n.useState("vencimiento_asc"),[R,Ee]=n.useState(""),[y,ne]=n.useState(""),[f,ie]=n.useState(""),[p,le]=n.useState(""),[ce,de]=n.useState({show:!1,title:"",message:"",type:"info"}),[Pe,B]=n.useState(!1),[ke,O]=n.useState(!1),[_e,M]=n.useState(!1),[Te,X]=n.useState(!1),[C,me]=n.useState(!1),[$e,xe]=n.useState(!1),[he,fe]=n.useState([]),[L,ze]=n.useState([]),[s,J]=n.useState(null),[l,b]=n.useState({proveedor:"",numero_factura:"",fecha_emision:be(),fecha_vencimiento:"",monto_total:"",notas:"",tipo_compra:"CREDITO",metodo_pago:"EFECTIVO",referencia:""}),[j,H]=n.useState({amount:"",reference:"",method:"EFECTIVO"}),v=(r,t,o="info")=>{de({show:!0,title:r,message:t,type:o})};n.useEffect(()=>{a&&(async()=>{se(!0);try{const t={};f&&(t.startDate=f),p&&(t.endDate=p),y&&y!==""&&(t.proveedor=y);const o=await Ke(a,Object.keys(t).length?t:void 0),c=Array.isArray(o)?o:(o==null?void 0:o.data)||[];Ae(c);const m=await Qe.get(`${er}/providers`,{headers:{Authorization:`Bearer ${a}`}}),d=Array.isArray(m.data)?m.data:m.data.data||[];if(Se(d),C){const x=await rr(a,t);ze(Array.isArray(x)?x:(x==null?void 0:x.data)||[])}}catch(t){console.error("Error cargando datos:",t)}finally{se(!1)}})()},[a,Ne,f,p,y,C]);const Ie=r=>{J(r),H({amount:"",reference:"",method:"EFECTIVO"}),O(!0)},Re=async r=>{if(r.preventDefault(),!s||!j.amount)return;const t=parseFloat(j.amount),o=(parseFloat(s.monto_total)||0)-(parseFloat(s.monto_abonado)||0);if(t<=0)return v("Error","El monto debe ser mayor a cero.","error");if(t>o+.01)return v("Error","El monto excede la deuda pendiente.","error");const m=t>=o-.1?"PAGADA":s.estado;try{await or(s.id,{amount:t,reference:j.reference,method:j.method,status:m},a),P(d=>d+1),O(!1),v("Pago Registrado",`Se registró el abono correctamente. Estado: ${m}`,"success")}catch(d){console.error(d),v("Error","No se pudo registrar el pago. Intente nuevamente.","error")}},Be=async r=>{if(r.preventDefault(),!l.proveedor)return v("Falta Proveedor","Seleccione un proveedor.","warning");try{await ar(l,a),P(t=>t+1),B(!1),b({proveedor:"",numero_factura:"",fecha_emision:be(),fecha_vencimiento:"",monto_total:"",notas:"",tipo_compra:"CREDITO",metodo_pago:"EFECTIVO",referencia:""}),v("Guardado","La factura ha sido registrada exitosamente.","success")}catch{v("Error","Error al guardar factura.","error")}},Oe=async()=>{if(s)try{await sr(s.id,a),P(r=>r+1),M(!1),v("Eliminada","La factura fue eliminada del sistema.","success")}catch{v("Error","No se pudo eliminar la factura.","error")}},Me=async r=>{J(r),X(!0),xe(!0),fe([]);try{const t=await tr(r.id,a);fe(Array.isArray(t)?t:(t==null?void 0:t.data)||[])}catch{v("Error","No se pudo cargar el historial de abonos.","error")}finally{xe(!1)}},V=n.useCallback(r=>{const t=parseFloat(r.monto_total)||0,o=parseFloat(r.monto_abonado)||0;if(t>0&&o>=t-.1)return"PAGADA";if(!r.fecha_vencimiento)return"PENDIENTE";const c=new Date;c.setHours(0,0,0,0);let m=r.fecha_vencimiento;m&&m.includes("T")&&(m=m.split("T")[0]);const d=m.split(/[-/]/);let x,A,Q;d[0].length===4?(x=parseInt(d[0],10),A=parseInt(d[1],10)-1,Q=parseInt(d[2],10)):(Q=parseInt(d[0],10),A=parseInt(d[1],10)-1,x=parseInt(d[2],10));const ue=new Date(x,A,Q);ue.setHours(0,0,0,0);const He=ue-c,ge=Math.ceil(He/(1e3*60*60*24));return ge<0?"VENCIDA":ge<=5?"PROXIMA":"PENDIENTE"},[]),Le=n.useCallback(r=>{switch(r){case"VENCIDA":return{color:"#dc2626",bg:"#fee2e2",activeColor:"#dc2626",activeBg:"#fef2f2",label:"Vencida"};case"PROXIMA":return{color:"#ea580c",bg:"#ffedd5",activeColor:"#c2410c",activeBg:"#fff7ed",label:"Próxima a Vencer"};case"PAGADA":return{color:"#16a34a",bg:"#dcfce7",activeColor:"#16a34a",activeBg:"#f0fdf4",label:"Pagada"};default:return{color:"#3b82f6",bg:"#dbeafe",activeColor:"#2563eb",activeBg:"#eff6ff",label:"Pendiente"}}},[]),w=n.useMemo(()=>{let r=0,t=0,o=0,c=0,m=0;return h.forEach(d=>{const x=V(d);x==="PENDIENTE"&&r++,x==="VENCIDA"&&t++,x==="PAGADA"&&o++,x==="PROXIMA"&&c++;const A=(parseFloat(d.monto_total)||0)-(parseFloat(d.monto_abonado)||0);x!=="PAGADA"&&(m+=A)}),{pend:r,venc:t,pag:o,prox:c,totalDebt:m,totalCount:h.length}},[h,V]),N=n.useMemo(()=>{let r=h;const t={};return r.forEach(o=>{const c=o.proveedor||"Sin Proveedor";t[c]||(t[c]={provider:c,count:0,totalAmount:0,totalPaid:0}),t[c].count+=1,t[c].totalAmount+=parseFloat(o.monto_total)||0,t[c].totalPaid+=parseFloat(o.monto_abonado)||0}),Object.values(t).sort((o,c)=>c.totalAmount-o.totalAmount)},[h,f,p]),pe=n.useMemo(()=>{let r=h.map(t=>({...t,effectiveStatus:V(t)}));if(D!=="TODAS"&&(D==="PENDIENTE"?r=r.filter(t=>t.effectiveStatus==="PENDIENTE"||t.effectiveStatus==="PROXIMA"):r=r.filter(t=>t.effectiveStatus===D)),y&&(r=r.filter(t=>t.proveedor===y)),R){const t=R.toLowerCase();r=r.filter(o=>o.proveedor&&o.proveedor.toLowerCase().includes(t)||o.numero_factura&&o.numero_factura.toLowerCase().includes(t))}return r.sort((t,o)=>k==="vencimiento_asc"?new Date(t.fecha_vencimiento)-new Date(o.fecha_vencimiento):k==="emision_desc"?new Date(o.fecha_emision)-new Date(t.fecha_emision):k==="emision_asc"?new Date(t.fecha_emision)-new Date(o.fecha_emision):0),r},[h,D,R,y,f,p,k,V]);return e.jsxs(ir,{children:[e.jsx(vr,{info:ce,onClose:()=>de({...ce,show:!1})}),e.jsxs(lr,{children:[e.jsxs(cr,{children:[e.jsxs(dr,{children:[e.jsx(W,{})," Facturas de Proveedores"]}),e.jsx(mr,{children:"Gestión y control de cuentas por pagar"})]}),e.jsxs(xr,{children:[e.jsx(g,{$secondary:!0,onClick:()=>P(r=>r+1),children:"Actualizar"}),e.jsxs(hr,{to:"/dashboard",children:[e.jsx(Ve,{})," Volver"]}),e.jsxs(g,{$primary:!0,onClick:()=>B(!0),children:[e.jsx(We,{})," Registrar Factura"]})]})]}),e.jsxs("div",{style:{display:"flex",gap:"1rem",marginBottom:"2rem",borderBottom:"2px solid #e2e8f0",paddingBottom:"1rem"},children:[e.jsxs("button",{onClick:()=>me(!1),style:{padding:"0.75rem 1.5rem",borderRadius:"8px",fontWeight:"bold",cursor:"pointer",border:"none",background:C?"transparent":"#3b82f6",color:C?"#64748b":"white",transition:"all 0.2s"},children:[e.jsx(W,{style:{marginRight:"8px"}})," Control de Facturas (Deudas)"]}),e.jsxs("button",{onClick:()=>me(!0),style:{padding:"0.75rem 1.5rem",borderRadius:"8px",fontWeight:"bold",cursor:"pointer",border:"none",background:C?"#3b82f6":"transparent",color:C?"white":"#64748b",transition:"all 0.2s"},children:[e.jsx(U,{style:{marginRight:"8px"}})," Reporte de Egresos (Abonos & Pagos Históricos)"]})]}),!C&&e.jsxs(e.Fragment,{children:[e.jsxs(fr,{children:[e.jsxs(T,{color:"#ef4444",bg:"#fef2f2",children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx($,{})}),e.jsx("div",{className:"label",children:"Vencidas"}),e.jsx("div",{className:"value",children:w.venc}),e.jsx("div",{className:"sub",children:"Requieren atención urgente"})]}),e.jsxs(T,{color:"#ea580c",bg:"#fff7ed",children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(E,{})}),e.jsx("div",{className:"label",children:"Próximas a Vencer"}),e.jsx("div",{className:"value",children:w.prox}),e.jsx("div",{className:"sub",children:"En los próx. 5 días"})]}),e.jsxs(T,{color:"#6366f1",bg:"#eef2ff",children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(W,{})}),e.jsx("div",{className:"label",children:"Total Facturas"}),e.jsx("div",{className:"value",children:w.totalCount}),e.jsx("div",{className:"sub",children:"Registradas en sistema"})]}),e.jsxs(T,{color:"#3b82f6",bg:"#eff6ff",children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(E,{})}),e.jsx("div",{className:"label",children:"Pendientes"}),e.jsx("div",{className:"value",children:w.pend}),e.jsx("div",{className:"sub",children:"Sin riesgo inmediato"})]}),e.jsxs(T,{color:"#f59e0b",bg:"#fffbeb",children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(_,{})}),e.jsx("div",{className:"label",children:"Deuda Total"}),e.jsxs("div",{className:"value",style:{color:"#b45309"},children:["C$",w.totalDebt.toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsx("div",{className:"sub",style:{color:"#b45309"},children:"Saldo Pendiente Global"})]})]}),e.jsxs(je,{children:[e.jsx(pr,{children:[{id:"PENDIENTE",label:"Por Pagar (Prox)",icon:E,color:"#3b82f6",bg:"#eff6ff",count:w.pend+w.prox},{id:"VENCIDA",label:"Vencidas",icon:$,color:"#dc2626",bg:"#fef2f2",count:w.venc},{id:"PAGADA",label:"Pagadas",icon:te,color:"#16a34a",bg:"#f0fdf4",count:w.pag},{id:"BI",label:"Resumen BI",icon:Z,color:"#6366f1",bg:"#eef2ff",count:null},{id:"TODAS",label:"Todas",icon:U,color:"#64748b",bg:"#f1f5f9",count:null}].map(r=>e.jsxs(ur,{active:D===r.id,activeColor:r.color,activeBg:r.bg,onClick:()=>Fe(r.id),children:[e.jsx(r.icon,{})," ",r.label,r.count!==null&&e.jsx("span",{className:"badge",children:r.count})]},r.id))}),e.jsxs(we,{children:[e.jsxs(gr,{children:[e.jsx(Ge,{}),e.jsx("input",{type:"text",placeholder:"Buscar proveedor o No. factura...",value:R,onChange:r=>Ee(r.target.value)})]}),e.jsxs(F,{style:{minWidth:"180px"},children:[e.jsx("label",{children:"Ordenar Por"}),e.jsxs("select",{value:k,onChange:r=>De(r.target.value),children:[e.jsx("option",{value:"vencimiento_asc",children:"Vencen Primero (Próximas)"}),e.jsx("option",{value:"emision_desc",children:"Emitidas Reciente (Nuevas)"}),e.jsx("option",{value:"emision_asc",children:"Emitidas Antiguas (Viejas)"})]})]}),e.jsxs(F,{children:[e.jsx("label",{children:"Proveedor"}),e.jsxs("select",{value:y,onChange:r=>ne(r.target.value),children:[e.jsx("option",{value:"",children:"Todos"}),Y.map(r=>e.jsx("option",{value:r.nombre,children:r.nombre},r.id_proveedor||r.id))]})]}),e.jsxs(F,{style:{minWidth:"140px"},children:[e.jsx("label",{children:"Desde"}),e.jsx("input",{type:"date",value:f,onChange:r=>ie(r.target.value)})]}),e.jsxs(F,{style:{minWidth:"140px"},children:[e.jsx("label",{children:"Hasta"}),e.jsx("input",{type:"date",value:p,onChange:r=>le(r.target.value)})]})]})]}),oe?e.jsxs("div",{style:{textAlign:"center",padding:"4rem",color:"#94a3b8"},children:[e.jsx(E,{className:"spin",style:{fontSize:"2rem",marginBottom:"1rem"}}),e.jsx("p",{children:"Cargando información..."})]}):pe.length>0?e.jsx(br,{children:pe.map(r=>{const t=r.effectiveStatus,o=Le(t),c=parseFloat(r.monto_total)||0,m=parseFloat(r.monto_abonado)||0,d=c-m,x=c>0?m/c*100:0,A=t==="PAGADA"?r.referencia_pago:null;return e.jsxs(jr,{color:o.color,balanceColor:d>0?"#ef4444":"#16a34a",children:[e.jsxs("div",{className:"card-header",children:[e.jsxs("div",{className:"provider-info",children:[e.jsxs("h3",{title:r.proveedor,children:[e.jsx(qe,{style:{marginRight:6,color:"#94a3b8"}})," ",r.proveedor]}),e.jsxs("span",{className:"invoice-number",children:["#",r.numero_factura]})]}),e.jsx(G,{bg:o.bg,text:o.color,children:o.label})]}),e.jsxs("div",{className:"card-body",children:[e.jsxs("div",{className:"meta-row",children:[e.jsxs("span",{className:"label",children:[e.jsx(Ye,{})," Emisión"]}),e.jsx("span",{className:"value",children:S(r.fecha_emision)})]}),e.jsxs("div",{className:"meta-row",children:[e.jsxs("span",{className:"label",children:[e.jsx($,{})," Vence"]}),e.jsx("span",{className:"value",style:{color:r.estado==="VENCIDA"?"#ef4444":"inherit"},children:S(r.fecha_vencimiento)})]}),A&&e.jsxs("div",{className:"meta-row",children:[e.jsxs("span",{className:"label",children:[e.jsx(Xe,{})," Referencia"]}),e.jsx("span",{className:"value",children:A})]}),e.jsxs("div",{className:"financial-block",children:[e.jsxs("div",{className:"total-row",children:[e.jsx("span",{className:"label",children:"Total a Pagar"}),e.jsxs("span",{className:"amount",children:["C$",c.toLocaleString(void 0,{minimumFractionDigits:2})]})]}),e.jsx("div",{className:"progress-bar",children:e.jsx("div",{style:{width:`${x}%`,background:o.color}})}),e.jsxs("div",{className:"balance-text",children:["Abonado: C$",m.toLocaleString(void 0,{minimumFractionDigits:2})," • ",e.jsxs("strong",{children:["Resta: C$",d.toLocaleString(void 0,{minimumFractionDigits:2})]})]})]})]}),e.jsxs("div",{className:"card-footer",style:{flexWrap:"wrap"},children:[d>0&&e.jsxs(g,{$primary:!0,style:{flex:1,justifyContent:"center"},onClick:()=>Ie(r),children:[e.jsx(_,{})," Abonar"]}),e.jsxs(g,{$secondary:!0,style:{flex:1,justifyContent:"center"},onClick:()=>Me(r),children:[e.jsx(U,{})," Historial"]}),e.jsx(g,{$danger:!0,style:{padding:"0.75rem"},onClick:()=>{J(r),M(!0)},children:e.jsx(Je,{})})]})]},r.id)})}):D==="BI"?e.jsxs(ve,{children:[e.jsxs(ye,{children:[e.jsxs("h3",{children:[e.jsx(Z,{})," Resumen de Razonamiento de Negocio"]}),f&&p&&e.jsxs("span",{className:"date-range",children:[S(f)," - ",S(p)]})]}),e.jsxs(re,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Proveedor"}),e.jsx("th",{style:{textAlign:"center"},children:"Facturas"}),e.jsx("th",{style:{textAlign:"right"},children:"Total Comprado"}),e.jsx("th",{style:{textAlign:"right"},children:"Pagado"}),e.jsx("th",{style:{textAlign:"right"},children:"Saldo Pendiente"})]})}),e.jsxs("tbody",{children:[N.map(r=>e.jsxs("tr",{children:[e.jsx("td",{className:"provider-name",children:r.provider}),e.jsx("td",{style:{textAlign:"center"},children:e.jsx("span",{className:"count-badge",children:r.count})}),e.jsxs("td",{className:"amount",children:["C$",r.totalAmount.toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsxs("td",{className:"amount",style:{color:"#16a34a"},children:["C$",r.totalPaid.toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsxs("td",{className:"amount",style:{color:r.totalAmount-r.totalPaid>.1?"#ef4444":"#16a34a"},children:["C$",(r.totalAmount-r.totalPaid).toLocaleString(void 0,{minimumFractionDigits:2})]})]},r.provider)),N.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:"5",style:{textAlign:"center",padding:"3rem",color:"#94a3b8"},children:"No hay datos para el período seleccionado."})})]}),N.length>0&&e.jsx("tfoot",{children:e.jsxs("tr",{style:{background:"#f8fafc",fontWeight:"900"},children:[e.jsx("td",{colSpan:"2",style:{textAlign:"right",textTransform:"uppercase",fontSize:"0.8rem",color:"#64748b"},children:"Totales Globales:"}),e.jsxs("td",{className:"amount",children:["C$",N.reduce((r,t)=>r+t.totalAmount,0).toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsxs("td",{className:"amount",children:["C$",N.reduce((r,t)=>r+t.totalPaid,0).toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsxs("td",{className:"amount",style:{color:"#ef4444"},children:["C$",(N.reduce((r,t)=>r+t.totalAmount,0)-N.reduce((r,t)=>r+t.totalPaid,0)).toLocaleString(void 0,{minimumFractionDigits:2})]})]})})]})]}):e.jsxs("div",{style:{textAlign:"center",padding:"4rem",color:"#94a3b8",border:"2px dashed #e2e8f0",borderRadius:"24px",background:"white"},children:[e.jsx(W,{style:{fontSize:"3rem",marginBottom:"1rem",opacity:.3}}),e.jsx("h3",{style:{color:"#475569"},children:"No se encontraron facturas"}),e.jsx("p",{children:"Intenta ajustar los filtros o registra una nueva."})]})]}),C&&e.jsxs(e.Fragment,{children:[e.jsx(je,{children:e.jsxs(we,{style:{width:"100%"},children:[e.jsxs("div",{style:{flex:1,display:"flex",alignItems:"center",gap:"0.5rem",color:"#3b82f6",fontWeight:"800"},children:[e.jsx(Z,{})," Filtros del Reporte:"]}),e.jsxs(F,{children:[e.jsx("label",{children:"Proveedor"}),e.jsxs("select",{value:y,onChange:r=>ne(r.target.value),children:[e.jsx("option",{value:"",children:"TODOS"}),Y.map(r=>e.jsx("option",{value:r.nombre,children:r.nombre},r.id_proveedor||r.id))]})]}),e.jsxs(F,{style:{minWidth:"140px"},children:[e.jsx("label",{children:"Desde"}),e.jsx("input",{type:"date",value:f,onChange:r=>ie(r.target.value)})]}),e.jsxs(F,{style:{minWidth:"140px"},children:[e.jsx("label",{children:"Hasta"}),e.jsx("input",{type:"date",value:p,onChange:r=>le(r.target.value)})]}),e.jsx(g,{$secondary:!0,onClick:()=>P(r=>r+1),style:{alignSelf:"flex-end",height:"42px"},children:"Aplicar Filtros"})]})}),e.jsxs(ve,{children:[e.jsxs(ye,{children:[e.jsxs("h3",{children:[e.jsx(_,{})," Listado de Pagos y Abonos Efectuados"]}),(f||p)&&e.jsxs("span",{className:"date-range",children:[f?S(f):"Inicio"," - ",p?S(p):"Hoy"]})]}),oe?e.jsxs("div",{style:{textAlign:"center",padding:"3rem",color:"#94a3b8"},children:[e.jsx(E,{className:"spin",style:{fontSize:"2rem",marginBottom:"1rem"}}),e.jsx("p",{children:"Cargando información..."})]}):e.jsx("div",{style:{overflowX:"auto"},children:e.jsxs(re,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Fecha Abono"}),e.jsx("th",{children:"Factura"}),e.jsx("th",{children:"Proveedor"}),e.jsx("th",{children:"Método"}),e.jsx("th",{children:"Referencia / Detalle"}),e.jsx("th",{style:{textAlign:"center"},children:"Modo de Compra"}),e.jsx("th",{style:{textAlign:"right"},children:"Monto Pagado (C$)"})]})}),e.jsxs("tbody",{children:[L.map(r=>e.jsxs("tr",{children:[e.jsx("td",{children:S(r.fecha_abono)}),e.jsx("td",{children:e.jsxs("b",{children:["#",r.numero_factura]})}),e.jsx("td",{children:r.proveedor}),e.jsx("td",{children:e.jsx(G,{bg:"#f1f5f9",text:"#475569",children:r.metodo_pago})}),e.jsx("td",{children:r.referencia||"-"}),e.jsx("td",{style:{textAlign:"center"},children:e.jsx(G,{bg:r.tipo_compra==="CONTADO"?"#dcfce7":"#eef2ff",text:r.tipo_compra==="CONTADO"?"#16a34a":"#4f46e5",children:r.tipo_compra})}),e.jsxs("td",{className:"amount",style:{color:"#16a34a"},children:["C$",parseFloat(r.monto).toLocaleString(void 0,{minimumFractionDigits:2})]})]},r.abono_id)),L.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:"7",style:{textAlign:"center",padding:"3rem",color:"#94a3b8"},children:"No hay registro de abonos o pagos en este período."})})]}),L.length>0&&e.jsx("tfoot",{children:e.jsxs("tr",{style:{background:"#f8fafc",fontWeight:"900"},children:[e.jsx("td",{colSpan:"6",style:{textAlign:"right",textTransform:"uppercase",fontSize:"0.8rem",color:"#64748b"},children:"Total Egresos (Abonos + Pagos de Contado):"}),e.jsxs("td",{className:"amount",style:{color:"#16a34a",fontSize:"1.2rem"},children:["C$",L.reduce((r,t)=>r+parseFloat(t.monto),0).toLocaleString(void 0,{minimumFractionDigits:2})]})]})})]})})]})]}),Pe&&e.jsx(z,{onClick:()=>B(!1),children:e.jsxs(I,{onClick:r=>r.stopPropagation(),children:[e.jsx(ee,{onClick:()=>B(!1),children:e.jsx(q,{})}),e.jsx("h2",{children:"Registrar Factura"}),e.jsxs("form",{onSubmit:Be,children:[e.jsxs(u,{children:[e.jsx("label",{children:"Proveedor"}),e.jsxs("select",{required:!0,value:l.proveedor,onChange:r=>b({...l,proveedor:r.target.value}),children:[e.jsx("option",{value:"",children:"Seleccione un proveedor..."}),Y.map(r=>e.jsx("option",{value:r.nombre,children:r.nombre},r.id_proveedor||r.id))]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"},children:[e.jsxs(u,{children:[e.jsx("label",{children:"No. Factura"}),e.jsx("input",{required:!0,type:"text",value:l.numero_factura,onChange:r=>b({...l,numero_factura:r.target.value}),placeholder:"Ej: F-001"})]}),e.jsxs(u,{children:[e.jsx("label",{children:"Monto Total (C$)"}),e.jsx("input",{required:!0,type:"number",step:"0.01",value:l.monto_total,onChange:r=>b({...l,monto_total:r.target.value}),placeholder:"0.00"})]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"},children:[e.jsxs(u,{children:[e.jsx("label",{children:"Fecha Emisión"}),e.jsx("input",{required:!0,type:"date",value:l.fecha_emision,onChange:r=>b({...l,fecha_emision:r.target.value})})]}),e.jsxs(u,{children:[e.jsx("label",{children:"Fecha Vencimiento"}),e.jsx("input",{required:!0,type:"date",value:l.fecha_vencimiento,onChange:r=>b({...l,fecha_vencimiento:r.target.value})})]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",background:"#f8fafc",padding:"1rem",borderRadius:"12px",marginBottom:"1.25rem",border:"1px solid #e2e8f0"},children:[e.jsxs(u,{style:{marginBottom:0},children:[e.jsx("label",{children:"Tipo de Compra"}),e.jsxs("select",{required:!0,value:l.tipo_compra,onChange:r=>b({...l,tipo_compra:r.target.value}),children:[e.jsx("option",{value:"CREDITO",children:"A Crédito"}),e.jsx("option",{value:"CONTADO",children:"De Contado"})]})]}),l.tipo_compra==="CONTADO"&&e.jsxs(u,{style:{marginBottom:0},children:[e.jsx("label",{children:"Método de Pago"}),e.jsxs("select",{required:!0,value:l.metodo_pago,onChange:r=>b({...l,metodo_pago:r.target.value}),children:[e.jsx("option",{value:"EFECTIVO",children:"Efectivo"}),e.jsx("option",{value:"TARJETA",children:"Tarjeta"}),e.jsx("option",{value:"TRANSFERENCIA",children:"Transferencia"}),e.jsx("option",{value:"CHEQUE",children:"Cheque"})]})]})]}),l.tipo_compra==="CONTADO"&&e.jsxs(u,{children:[e.jsx("label",{children:"Referencia de Pago (Transferencia, Cheque, etc.)"}),e.jsx("input",{type:"text",value:l.referencia,onChange:r=>b({...l,referencia:r.target.value}),placeholder:"Opcional..."})]}),e.jsxs(u,{children:[e.jsx("label",{children:"Notas (Opcional)"}),e.jsx("textarea",{rows:"3",value:l.notas,onChange:r=>b({...l,notas:r.target.value}),placeholder:"Detalles extra..."})]}),e.jsxs(g,{$primary:!0,type:"submit",style:{width:"100%",padding:"1rem",fontSize:"1rem"},children:[e.jsx(te,{})," Guardar Factura"]})]})]})}),ke&&e.jsx(z,{onClick:()=>O(!1),children:e.jsxs(I,{onClick:r=>r.stopPropagation(),style:{maxWidth:"450px"},children:[e.jsx(ee,{onClick:()=>O(!1),children:e.jsx(q,{})}),e.jsx("h2",{children:"Registrar Abono"}),e.jsxs("div",{style:{background:"#f1f5f9",padding:"1rem",borderRadius:"12px",marginBottom:"1.5rem"},children:[e.jsxs("div",{style:{fontSize:"0.9rem",color:"#64748b",marginBottom:"0.25rem"},children:["Factura #",s==null?void 0:s.numero_factura]}),e.jsxs("div",{style:{fontSize:"1.5rem",fontWeight:"800",color:"#1e293b"},children:["Deuda: C$",((parseFloat(s==null?void 0:s.monto_total)||0)-(parseFloat(s==null?void 0:s.monto_abonado)||0)).toFixed(2)]})]}),e.jsxs("form",{onSubmit:Re,children:[e.jsxs(u,{children:[e.jsx("label",{children:"Monto a Abonar (C$)"}),e.jsx("input",{required:!0,type:"number",step:"0.01",autoFocus:!0,placeholder:"0.00",value:j.amount,onChange:r=>H({...j,amount:r.target.value})})]}),e.jsxs(u,{children:[e.jsx("label",{children:"Método de Pago"}),e.jsxs("select",{required:!0,value:j.method,onChange:r=>H({...j,method:r.target.value}),children:[e.jsx("option",{value:"EFECTIVO",children:"Efectivo"}),e.jsx("option",{value:"TARJETA",children:"Tarjeta"}),e.jsx("option",{value:"TRANSFERENCIA",children:"Transferencia"}),e.jsx("option",{value:"CHEQUE",children:"Cheque"})]})]}),e.jsxs(u,{children:[e.jsx("label",{children:"Referencia / Detalle (Opcional)"}),e.jsx("input",{type:"text",placeholder:"Ej: Transferencia #1234, Pago en efectivo...",value:j.reference,onChange:r=>H({...j,reference:r.target.value})})]}),e.jsxs(g,{$primary:!0,type:"submit",style:{width:"100%",padding:"1rem"},children:[e.jsx(_,{})," Confirmar Pago"]})]})]})}),_e&&e.jsx(z,{onClick:()=>M(!1),children:e.jsxs(I,{style:{maxWidth:"400px",textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"3rem",color:"#ef4444",marginBottom:"1rem"},children:e.jsx($,{})}),e.jsx("h2",{children:"¿Eliminar Factura?"}),e.jsxs("p",{style:{color:"#64748b",marginBottom:"2rem"},children:["Estás a punto de eliminar la factura ",e.jsxs("b",{children:["#",s==null?void 0:s.numero_factura]}),". Esta acción no se puede deshacer."]}),e.jsxs("div",{style:{display:"flex",gap:"1rem"},children:[e.jsx(g,{$secondary:!0,onClick:()=>M(!1),style:{flex:1},children:"Cancelar"}),e.jsx(g,{$danger:!0,onClick:Oe,style:{flex:1},children:"Sí, Eliminar"})]})]})}),Te&&e.jsx(z,{onClick:()=>X(!1),children:e.jsxs(I,{onClick:r=>r.stopPropagation(),style:{maxWidth:"600px"},children:[e.jsx(ee,{onClick:()=>X(!1),children:e.jsx(q,{})}),e.jsx("h2",{children:"Historial de Abonos"}),e.jsxs("div",{style:{background:"#f1f5f9",padding:"1rem",borderRadius:"12px",marginBottom:"1.5rem",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("div",{children:[e.jsxs("div",{style:{fontSize:"0.9rem",color:"#64748b"},children:["Factura #",s==null?void 0:s.numero_factura]}),e.jsx("div",{style:{fontSize:"1.1rem",fontWeight:"800",color:"#1e293b"},children:s==null?void 0:s.proveedor})]}),e.jsxs("div",{style:{textAlign:"right"},children:[e.jsx("div",{style:{fontSize:"0.9rem",color:"#64748b"},children:"Abonado Total"}),e.jsxs("div",{style:{fontSize:"1.2rem",fontWeight:"800",color:"#16a34a"},children:["C$",(parseFloat(s==null?void 0:s.monto_abonado)||0).toLocaleString(void 0,{minimumFractionDigits:2})]})]})]}),$e?e.jsxs("div",{style:{textAlign:"center",padding:"2rem",color:"#94a3b8"},children:[e.jsx(E,{className:"spin",style:{fontSize:"1.5rem",marginBottom:"1rem"}}),e.jsx("p",{children:"Cargando historial..."})]}):he.length>0?e.jsx("div",{style:{overflowX:"auto"},children:e.jsxs(re,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Fecha"}),e.jsx("th",{children:"Método"}),e.jsx("th",{children:"Referencia"}),e.jsx("th",{style:{textAlign:"right"},children:"Monto"})]})}),e.jsx("tbody",{children:he.map((r,t)=>e.jsxs("tr",{children:[e.jsx("td",{children:S(r.fecha)}),e.jsx("td",{children:e.jsx(G,{bg:"#f1f5f9",text:"#475569",children:r.metodo_pago})}),e.jsx("td",{children:r.referencia||"-"}),e.jsxs("td",{className:"amount",style:{color:"#16a34a"},children:["C$",parseFloat(r.monto).toLocaleString(void 0,{minimumFractionDigits:2})]})]},t))})]})}):e.jsxs("div",{style:{textAlign:"center",padding:"3rem",color:"#94a3b8",border:"1px dashed #cbd5e1",borderRadius:"16px"},children:[e.jsx(_,{style:{fontSize:"2rem",marginBottom:"1rem",opacity:.5}}),e.jsx("p",{children:"No existen abonos registrados para esta factura."})]})]})})]})};export{Sr as default};

import{r as i,j as e,I as je,X as Dt,Y as Nt,aP as ve,aQ as Y,ah as L,aa as X,ag as G,aR as ye,$ as Ge,aS as Pt,aN as _t,am as Ce,ac as qe,a4 as Ue,k as J,aT as we,a as Tt,s as d,ae as de,t as rt,V as kt}from"./vendor-BVroOj2J.js";import{E as $t}from"./pdf-vendor-C0MaOehg.js";import{u as zt,I as It,A as Rt,J as Ot,K as Ye,L as Bt,M as Mt,N as Lt,O as Vt,P as Ht}from"./index-CbUf7eeN.js";import{r as Xe}from"./searchEngine-BMYcElFi.js";import"./scanner-vendor-DfxRpMWJ.js";const Ae=()=>new Date().toLocaleDateString("sv-SE",{timeZone:"America/Managua"}),T=o=>{if(!o)return"—";const b=new Date(o.includes("T")?o:`${o}T12:00:00`);return new Intl.DateTimeFormat("es-NI",{timeZone:"America/Managua",day:"2-digit",month:"2-digit",year:"numeric"}).format(b)},pe=rt`from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); }`,Wt=rt`from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; }`,Gt=d.div`
    padding: clamp(1rem, 3vw, 2.5rem); 
    background: #f8fafc;
    min-height: 100vh; 
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    animation: ${pe} 0.5s ease-out;
`,qt=d.div`
    display: flex; 
    justify-content: space-between; 
    align-items: flex-start; 
    margin-bottom: 2rem; 
    flex-wrap: wrap; 
    gap: 1.5rem;
`,Ut=d.div`
    display: flex;
    flex-direction: column;
`,Yt=d.h1`
    font-size: clamp(1.8rem, 2.5vw, 2.2rem); 
    color: #0f172a; 
    display: flex; 
    align-items: center; 
    gap: 0.75rem; 
    margin: 0; 
    font-weight: 900;
    letter-spacing: -0.03em;
    
    svg { color: #0f172a; }
`,Xt=d.p`
    color: #64748b;
    margin: 0.5rem 0 0 0;
    font-size: 1rem;
    font-weight: 500;
`,Jt=d.div`
    display: flex; 
    gap: 0.75rem;
    flex-wrap: wrap;
    
    @media (max-width: 600px) {
        width: 100%;
        button, a { flex: 1; justify-content: center; }
    }
`,g=d.button`
    padding: 0.75rem 1.25rem; 
    border: none; 
    border-radius: 12px; 
    font-weight: 600; 
    font-size: 0.95rem;
    cursor: pointer; 
    display: flex; 
    align-items: center; 
    justify-content: center;
    gap: 0.5rem; 
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    
    ${o=>o.$primary&&de`
        background: #0f172a;
        color: white;
        box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.3);
        &:hover { background: #1e293b; transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.4); }
    `}

    ${o=>o.$secondary&&de`
        background: white;
        color: #334155;
        border: 1px solid #e2e8f0;
        &:hover { background: #f1f5f9; border-color: #cbd5e1; transform: translateY(-1px); }
    `}

    ${o=>o.$danger&&de`
        background: #fee2e2;
        color: #ef4444;
        &:hover { background: #fecaca; transform: scale(1.05); }
    `}

    ${o=>o.$success&&de`
        background: #dcfce7;
        color: #15803d;
        &:hover { background: #bbf7d0; transform: translateY(-1px); }
    `}

    &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
`,Qt=d(kt)`
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
`,Zt=d.div`
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); 
    gap: 1.5rem; 
    margin-bottom: 2.5rem;
`,q=d.div`
    background: white; 
    padding: 1.5rem; 
    border-radius: 20px; 
    border: 1px solid rgba(226, 232, 240, 0.8);
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); 
    position: relative; 
    overflow: hidden;
    transition: transform 0.2s;
    
    &:hover { transform: translateY(-4px); box-shadow: 0 15px 25px -5px rgba(0,0,0,0.05); }
    
    &::before { 
        content: ''; position: absolute; top: 0; left: 0; width: 6px; height: 100%; 
        background: ${o=>o.color}; 
    }

    .icon-wrapper {
        width: 44px; height: 44px; border-radius: 12px; background: ${o=>o.bg}; 
        display: flex; align-items: center; justify-content: center; 
        color: ${o=>o.color}; font-size: 1.25rem; margin-bottom: 0.75rem;
    }

    .label { font-size: 0.8rem; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    .value { font-size: 1.8rem; font-weight: 800; color: #0f172a; margin: 0.25rem 0; letter-spacing: -0.03em; }
    .sub { font-size: 0.85rem; color: #64748b; font-weight: 500; }
`,Je=d.div`
    background: #0f172a;
    color: white;
    padding: 1.25rem 2rem;
    border-radius: 20px;
    margin-bottom: 2rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    gap: 1.5rem;
    box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.15);
    animation: ${pe} 0.4s ease-out;

    .summary-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;

        .summary-label {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #94a3b8;
            font-weight: 600;
            margin-bottom: 0.25rem;
        }

        .summary-value {
            font-size: 1.4rem;
            font-weight: 800;
            letter-spacing: -0.02em;
        }

        &.highlight .summary-value {
            color: #38bdf8;
        }
        &.danger .summary-value {
            color: #f87171;
        }
        &.success .summary-value {
            color: #4ade80;
        }
    }

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;
        .summary-item {
            flex-direction: row;
            justify-content: space-between;
            border-bottom: 1px solid #1e293b;
            padding-bottom: 0.75rem;
            width: 100%;
            &:last-child { border-bottom: none; padding-bottom: 0; }
        }
    }
`,V=d.div`
    position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
    background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(4px); 
    display: flex; justify-content: center; align-items: center; z-index: 1200; 
    animation: ${pe} 0.2s;
`,H=d.div`
    background: white; padding: 2.5rem; border-radius: 24px; 
    width: 95%; max-width: ${o=>o.$large?"700px":"550px"}; 
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); 
    animation: ${Wt} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    max-height: 90vh; overflow-y: auto;
    position: relative;
    
    h2 { margin: 0 0 1.5rem 0; color: #0f172a; font-size: 1.6rem; font-weight: 800; letter-spacing: -0.025em; }
`,h=d.div`
    margin-bottom: 1.25rem;
    label { display: block; font-size: 0.92rem; color: #475569; margin-bottom: 0.5rem; font-weight: 600; }
    input, select, textarea { 
        width: 100%; padding: 0.9rem 1rem; border: 1px solid #cbd5e1; border-radius: 12px; 
        font-size: 1rem; color: #0f172a; background: #fff; transition: all 0.2s; 
        &:focus { outline: none; border-color: #0f172a; box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.08); }
        &::placeholder { color: #94a3b8; }
    }
`,me=d.button`
    position: absolute; top: 1.5rem; right: 1.5rem; 
    background: #f1f5f9; border-radius:50%; width:32px; height:32px; 
    border: none; color: #64748b; font-size: 1rem; cursor: pointer; display:grid; place-items:center;
    transition: all 0.2s;
    &:hover { color: #ef4444; background: #fee2e2; }
`,Qe=d.div`
    background: white; padding: 1.25rem; border-radius: 20px;
    border: 1px solid #e2e8f0; display: flex; flex-direction: column; 
    gap: 1.25rem; margin-bottom: 2rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.01);
`,Kt=d.div`
    display: flex; gap: 0.75rem; overflow-x: auto; padding-bottom: 0.5rem;
    border-bottom: 1px solid #f1f5f9;
    &::-webkit-scrollbar { height: 4px; }
    &::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
`,er=d.button`
    padding: 0.65rem 1.25rem; border-radius: 12px; border: none; 
    font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.6rem; 
    transition: all 0.2s; font-size: 0.92rem; white-space: nowrap;

    background: ${o=>o.active?o.activeBg:"transparent"};
    color: ${o=>o.active?o.activeColor:"#64748b"};
    
    &:hover { background: ${o=>o.active?o.activeBg:"#f8fafc"}; color: ${o=>o.active?o.activeColor:"#334155"}; }

    .badge {
        background: ${o=>o.active?o.activeColor:"#e2e8f0"};
        color: ${o=>o.active?"white":"#64748b"};
        padding: 0.15rem 0.6rem; border-radius: 99px; font-size: 0.75rem; 
        font-weight: 800; min-width: 24px; text-align: center;
    }
`,Ze=d.div`
    background: white; border-radius: 24px; border: 1px solid #e2e8f0; overflow: hidden;
    animation: ${pe} 0.4s ease-out; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
`,Se=d.table`
    width: 100%; border-collapse: collapse; text-align: left;
    th { background: #f8fafc; padding: 1rem 1.5rem; font-size: 0.85rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #f1f5f9; }
    td { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; color: #334155; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #fbfcfd; }
    .provider-name { font-weight: 800; color: #0f172a; }
    .amount { font-family: 'Inter', sans-serif; font-weight: 700; text-align: right; }
    .count-badge { background: #e2e8f0; color: #475569; padding: 2px 8px; border-radius: 6px; font-weight: 800; font-size: 0.8rem; }
`,Ke=d.div`
    padding: 1.5rem 2rem; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;
    h3 { margin: 0; font-size: 1.25rem; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 0.75rem; }
    .date-range { font-size: 0.9rem; color: #64748b; font-weight: 600; background: #f1f5f9; padding: 0.4rem 1rem; border-radius: 99px; }
`,et=d.div`
    display: flex; flex-wrap: wrap; gap: 1rem; justify-content: space-between;
`,tt=d.div`
    position: relative; min-width: 250px; flex: 2;
    svg { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #94a3b8; }
    input {
        width: 100%; padding: 0.75rem 1rem 0.75rem 2.8rem;
        border: 1px solid #e2e8f0; border-radius: 12px; font-size: 0.95rem;
        &:focus { outline: none; border-color: #0f172a; box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.05); }
    }
`,F=d.div`
    min-width: 130px; flex: 1;
    display: flex; flex-direction: column; gap: 0.4rem;
    label { font-size: 0.8rem; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    select, input {
        width: 100%; padding: 0.7rem 1rem; border: 1px solid #e2e8f0; border-radius: 12px; 
        font-size: 0.92rem; background: #fff; color: #334155;
        &:focus { border-color: #0f172a; outline: none; }
    }
`,tr=d.div`
    display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1.5rem;
`,rr=d.div`
    background: white; border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); display: flex; flex-direction: column;
    
    &:hover { 
        transform: translateY(-5px); 
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05); 
        border-color: #cbd5e1;
    }

    .card-header {
        padding: 1.5rem; background: linear-gradient(to bottom, #ffffff, #f8fafc);
        border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: flex-start;
    }
    .provider-info h3 { margin: 0; font-size: 1.1rem; color: #0f172a; font-weight: 800; line-height: 1.3; }
    .invoice-number { font-size: 0.85rem; color: #475569; font-family: 'Monaco', monospace; background: #e2e8f0; padding: 4px 8px; border-radius: 6px; margin-top: 0.5rem; display: inline-block; }

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
        .amount { font-size: 1.75rem; font-weight: 900; color: #0f172a; }
    }

    .progress-bar {
        height: 8px; background: #f1f5f9; border-radius: 99px; overflow: hidden; margin-bottom: 0.75rem;
        div { height: 100%; border-radius: 99px; transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
    }

    .balance-text { font-size: 0.9rem; text-align: right; color: #64748b; font-weight: 500; }
    .balance-text strong { color: ${o=>o.balanceColor}; font-weight: 800; }

    .card-footer {
        padding: 1rem 1.5rem; background: #f8fafc; border-top: 1px solid #f1f5f9;
        display: flex; gap: 0.75rem;
    }
`,U=d.span`
    padding: 0.4rem 1rem; border-radius: 99px; font-size: 0.75rem; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase;
    background: ${o=>o.bg}; color: ${o=>o.text}; box-shadow: 0 1px 2px rgba(0,0,0,0.05);
`,ar=({info:o,onClose:b})=>o.show?e.jsx(V,{onClick:b,children:e.jsxs(H,{style:{maxWidth:"400px",textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"3rem",marginBottom:"1rem",color:o.type==="error"?"#ef4444":o.type==="success"?"#16a34a":"#0f172a"},children:o.type==="error"?e.jsx(J,{style:{border:"3px solid",borderRadius:"50%",padding:5}}):o.type==="success"?e.jsx(X,{}):e.jsx(Y,{})}),e.jsx("h2",{children:o.title}),e.jsx("p",{style:{color:"#64748b",lineHeight:1.6,marginBottom:"2rem"},children:o.message}),e.jsx(g,{$primary:!0,onClick:b,style:{margin:"0 auto",width:"100%"},children:"Entendido"})]})}):null,Fe=d.div`
    border: 2px dashed #cbd5e1;
    border-radius: 12px;
    padding: 1.5rem;
    text-align: center;
    background: #f8fafc;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;

    &:hover {
        border-color: #0f172a;
        background: #f1f5f9;
    }

    input {
        position: absolute;
        top: 0; left: 0; width: 100%; height: 100%;
        opacity: 0;
        cursor: pointer;
    }

    .upload-icon {
        font-size: 2rem;
        color: #64748b;
        margin-bottom: 0.5rem;
    }

    .file-details {
        font-size: 0.9rem;
        color: #475569;
        font-weight: 600;
    }
`,cr=()=>{const{token:o}=zt(),[b,at]=i.useState([]),[he,ot]=i.useState([]),[Ee,De]=i.useState(!1),[st,I]=i.useState(0),[P,nt]=i.useState("PENDIENTE"),[W,it]=i.useState("vencimiento_asc"),[R,Ne]=i.useState(""),[j,Pe]=i.useState(""),[y,_e]=i.useState(""),[C,Te]=i.useState(""),[_,ke]=i.useState(""),[Q,lt]=i.useState(""),[$e,ze]=i.useState({show:!1,title:"",message:"",type:"info"}),[ct,Z]=i.useState(!1),[dt,K]=i.useState(!1),[mt,ee]=i.useState(!1),[pt,te]=i.useState(!1),[ht,ue]=i.useState(!1),[w,Ie]=i.useState(!1),[ut,Re]=i.useState(!1),[xe,re]=i.useState([]),[Oe,Be]=i.useState([]),[n,O]=i.useState(null),[k,xt]=i.useState(null),[ae,B]=i.useState(null),[E,Me]=i.useState(!1),[D,M]=i.useState({base64:null,name:null}),[m,v]=i.useState({proveedor:"",numero_factura:"",fecha_emision:Ae(),fecha_vencimiento:"",monto_total:"",notas:"",tipo_compra:"CREDITO",metodo_pago:"EFECTIVO",referencia:""}),[A,oe]=i.useState({amount:"",reference:"",method:"EFECTIVO"}),[S,se]=i.useState({amount:"",reference:"",method:"EFECTIVO"}),x=(t,r,a="info")=>{ze({show:!0,title:t,message:r,type:a})},ft=t=>new Promise((r,a)=>{if(t.type==="application/pdf"){const s=new FileReader;s.readAsDataURL(t),s.onload=()=>r({base64:s.result,name:t.name}),s.onerror=l=>a(l)}else if(t.type.startsWith("image/")){const s=new FileReader;s.readAsDataURL(t),s.onload=l=>{const c=new Image;c.src=l.target.result,c.onload=()=>{let u=c.width,f=c.height;(u>1200||f>1200)&&(u>f?(f=Math.round(f*1200/u),u=1200):(u=Math.round(u*1200/f),f=1200));const z=document.createElement("canvas");z.width=u,z.height=f,z.getContext("2d").drawImage(c,0,0,u,f);const ce=z.toDataURL("image/jpeg",.7),St=u>f?"l":"p",We=new $t({orientation:St,unit:"px",format:[u,f]});We.addImage(ce,"JPEG",0,0,u,f);const Ft=We.output("datauristring"),Et=t.name.substring(0,t.name.lastIndexOf("."))+".pdf";r({base64:Ft,name:Et})},c.onerror=p=>a(p)},s.onerror=l=>a(l)}else a(new Error("Formato de archivo no soportado. Sube una Imagen o un PDF."))}),fe=async t=>{const r=t.target.files[0];if(r){Me(!0),B(r);try{const a=await ft(r);M(a)}catch(a){console.error(a),x("Archivo inválido",a.message||"No se pudo procesar el archivo.","error"),B(null),M({base64:null,name:null})}finally{Me(!1)}}},ge=t=>{if(!t)return null;if(t.startsWith("http")||t.startsWith("data:"))return t;let r=t;return t.startsWith("/uploads")?r="/api"+t:t.startsWith("uploads")&&(r="/api/"+t),`${"https://sistema.multirepuestosrg.com/api".replace(/\/api$/,"")}${r.startsWith("/")?"":"/"}${r}`};i.useEffect(()=>{o&&(async()=>{De(!0);try{const r={};y&&(r.startDate=y),C&&(r.endDate=C),j&&(r.proveedor=j);const a=await It(o,Object.keys(r).length?r:void 0),s=Array.isArray(a)?a:(a==null?void 0:a.data)||[];at(s);const l=await Tt.get(`${Rt}/providers`,{headers:{Authorization:`Bearer ${o}`}}),c=Array.isArray(l.data)?l.data:l.data.data||[];if(ot(c),w){const p=await Ot(o,Object.keys(r).length?r:void 0);Be(Array.isArray(p)?p:(p==null?void 0:p.data)||[])}}catch(r){console.error("Error cargando datos:",r)}finally{De(!1)}})()},[o,st,y,C,j,w]);const gt=t=>{O(t),oe({amount:"",reference:"",method:"EFECTIVO"}),B(null),M({base64:null,name:null}),K(!0)},bt=async t=>{if(t.preventDefault(),!n||!A.amount)return;const r=parseFloat(A.amount),a=(parseFloat(n.monto_total)||0)-(parseFloat(n.monto_abonado)||0);if(r<=0)return x("Error","El monto debe ser mayor a cero.","error");if(r>a+.01)return x("Error","El monto excede la deuda pendiente.","error");const l=r>=a-.1?"PAGADA":n.estado;try{await Lt(n.id,{amount:r,reference:A.reference,method:A.method,status:l,comprobante_base64:D.base64,comprobante_name:D.name},o),I(c=>c+1),K(!1),x("Pago Registrado",`Se registró el abono correctamente. Estado: ${l}`,"success")}catch(c){console.error(c),x("Error","No se pudo registrar el pago. Intente nuevamente.","error")}},Le=t=>{xt(t),se({amount:t.monto,reference:t.referencia||"",method:t.metodo_pago}),B(null),M({base64:null,name:null}),ee(!0)},jt=async t=>{if(t.preventDefault(),!k||!S.amount)return;const r=parseFloat(S.amount);if(r<=0)return x("Error","El monto debe ser mayor a cero.","error");try{if(await Vt(k.id,{amount:r,method:S.method,reference:S.reference,comprobante_base64:D.base64,comprobante_name:D.name},o),I(a=>a+1),ee(!1),n){const a=await Ye(n.id,o);re(Array.isArray(a)?a:(a==null?void 0:a.data)||[]);const s=r-parseFloat(k.monto);O(l=>({...l,monto_abonado:parseFloat(l.monto_abonado)+s}))}x("Abono Modificado","El abono se editó y recalculó de forma exitosa.","success")}catch(a){console.error(a),x("Error","No se pudo actualizar el abono.","error")}},vt=async t=>{if(t.preventDefault(),!m.proveedor)return x("Falta Proveedor","Seleccione un proveedor.","warning");try{await Mt({...m,comprobante_base64:D.base64,comprobante_name:D.name},o),I(r=>r+1),Z(!1),v({proveedor:"",numero_factura:"",fecha_emision:Ae(),fecha_vencimiento:"",monto_total:"",notas:"",tipo_compra:"CREDITO",metodo_pago:"EFECTIVO",referencia:""}),B(null),M({base64:null,name:null}),x("Guardado","La factura ha sido registrada exitosamente.","success")}catch{x("Error","Error al guardar factura.","error")}},yt=async()=>{if(n)try{await Ht(n.id,o),I(t=>t+1),te(!1),x("Eliminada","La factura fue eliminada del sistema.","success")}catch{x("Error","No se pudo eliminar la factura.","error")}},Ct=async t=>{O(t),ue(!0),Re(!0),re([]);try{const r=await Ye(t.id,o);re(Array.isArray(r)?r:(r==null?void 0:r.data)||[])}catch{x("Error","No se pudo cargar el historial de abonos.","error")}finally{Re(!1)}},Ve=async(t,r=null)=>{if(window.confirm("¿Eliminar este abono? El monto se descontará del total abonado en la factura."))try{if(await Bt(t,o),re(a=>a.filter(s=>s.id!==t)),Be(a=>a.filter(s=>s.abono_id!==t)),n){const a=xe.find(s=>s.id===t);a&&O(s=>({...s,monto_abonado:Math.max(0,parseFloat(s.monto_abonado)-parseFloat(a.monto))}))}I(a=>a+1),x("Abono Eliminado","El abono fue eliminado y la factura fue actualizada.","success")}catch{x("Error","No se pudo eliminar el abono. Intenta nuevamente.","error")}},ne=i.useCallback(t=>{const r=parseFloat(t.monto_total)||0,a=parseFloat(t.monto_abonado)||0;if(r>0&&a>=r-.1)return"PAGADA";if(!t.fecha_vencimiento)return"PENDIENTE";const s=new Date;s.setHours(0,0,0,0);let l=t.fecha_vencimiento;l&&l.includes("T")&&(l=l.split("T")[0]);const c=l.split(/[-/]/);let p,u,f;c[0].length===4?(p=parseInt(c[0],10),u=parseInt(c[1],10)-1,f=parseInt(c[2],10)):(f=parseInt(c[0],10),u=parseInt(c[1],10)-1,p=parseInt(c[2],10));const z=new Date(p,u,f);z.setHours(0,0,0,0);const He=z-s,ce=Math.ceil(He/(1e3*60*60*24));return ce<0?"VENCIDA":ce<=5?"PROXIMA":"PENDIENTE"},[]),wt=i.useCallback(t=>{switch(t){case"VENCIDA":return{color:"#ef4444",bg:"#fee2e2",activeColor:"#ef4444",activeBg:"#fee2e2",label:"Vencida"};case"PROXIMA":return{color:"#f97316",bg:"#ffedd5",activeColor:"#ea580c",activeBg:"#ffedd5",label:"Próxima a Vencer"};case"PAGADA":return{color:"#10b981",bg:"#dcfce7",activeColor:"#10b981",activeBg:"#dcfce7",label:"Pagada"};default:return{color:"#3b82f6",bg:"#dbeafe",activeColor:"#2563eb",activeBg:"#dbeafe",label:"Pendiente"}}},[]),N=i.useMemo(()=>{let t=0,r=0,a=0,s=0,l=0;return b.forEach(c=>{const p=ne(c);p==="PENDIENTE"&&t++,p==="VENCIDA"&&r++,p==="PAGADA"&&a++,p==="PROXIMA"&&s++;const u=(parseFloat(c.monto_total)||0)-(parseFloat(c.monto_abonado)||0);p!=="PAGADA"&&(l+=u)}),{pend:t,venc:r,pag:a,prox:s,totalDebt:l,totalCount:b.length}},[b,ne]),$=i.useMemo(()=>{let t=b;const r={};return t.forEach(a=>{const s=a.proveedor||"Sin Proveedor";r[s]||(r[s]={provider:s,count:0,totalAmount:0,totalPaid:0}),r[s].count+=1,r[s].totalAmount+=parseFloat(a.monto_total)||0,r[s].totalPaid+=parseFloat(a.monto_abonado)||0}),Object.values(r).sort((a,s)=>s.totalAmount-a.totalAmount)},[b]),ie=i.useMemo(()=>{let t=b.map(r=>({...r,effectiveStatus:ne(r)}));return P!=="TODAS"&&P!=="BI"&&(P==="PENDIENTE"?t=t.filter(r=>r.effectiveStatus==="PENDIENTE"||r.effectiveStatus==="PROXIMA"):t=t.filter(r=>r.effectiveStatus===P)),j&&(t=t.filter(r=>r.proveedor===j)),_&&(t=t.filter(r=>r.tipo_compra===_)),t=Xe(t,R,["proveedor","numero_factura"]),t.sort((r,a)=>W==="vencimiento_asc"?new Date(r.fecha_vencimiento)-new Date(a.fecha_vencimiento):W==="emision_desc"?new Date(a.fecha_emision)-new Date(r.fecha_emision):W==="emision_asc"?new Date(r.fecha_emision)-new Date(a.fecha_emision):0),t},[b,P,R,j,_,W,ne]),be=i.useMemo(()=>{let t=0,r=0;return ie.forEach(a=>{t+=parseFloat(a.monto_total)||0,r+=parseFloat(a.monto_abonado)||0}),{facturado:t,abonado:r,restante:t-r}},[ie]),le=i.useMemo(()=>{let t=Oe;return j&&(t=t.filter(r=>r.proveedor===j)),Q&&(t=t.filter(r=>r.metodo_pago===Q)),_&&(t=t.filter(r=>r.tipo_compra===_)),t=Xe(t,R,["proveedor","numero_factura","referencia"]),t},[Oe,j,Q,_,R]),At=i.useMemo(()=>le.reduce((t,r)=>t+parseFloat(r.monto||0),0),[le]);return e.jsxs(Gt,{children:[e.jsx(ar,{info:$e,onClose:()=>ze({...$e,show:!1})}),e.jsxs(qt,{children:[e.jsxs(Ut,{children:[e.jsxs(Yt,{children:[e.jsx(je,{})," Facturas de Proveedores"]}),e.jsx(Xt,{children:"Gestión y control de cuentas por pagar"})]}),e.jsxs(Jt,{children:[e.jsx(g,{$secondary:!0,onClick:()=>I(t=>t+1),children:"Actualizar"}),e.jsxs(Qt,{to:"/dashboard",children:[e.jsx(Dt,{})," Volver"]}),e.jsxs(g,{$primary:!0,onClick:()=>{v({proveedor:"",numero_factura:"",fecha_emision:Ae(),fecha_vencimiento:"",monto_total:"",notas:"",tipo_compra:"CREDITO",metodo_pago:"EFECTIVO",referencia:""}),B(null),M({base64:null,name:null}),Z(!0)},children:[e.jsx(Nt,{})," Registrar Factura"]})]})]}),e.jsxs("div",{style:{display:"flex",gap:"1rem",marginBottom:"2rem",borderBottom:"2px solid #e2e8f0",paddingBottom:"1rem"},children:[e.jsxs("button",{onClick:()=>Ie(!1),style:{padding:"0.75rem 1.5rem",borderRadius:"12px",fontWeight:"bold",cursor:"pointer",border:"none",background:w?"transparent":"#0f172a",color:w?"#64748b":"white",transition:"all 0.2s",display:"flex",alignItems:"center",gap:"8px"},children:[e.jsx(je,{})," Control de Facturas (Deudas)"]}),e.jsxs("button",{onClick:()=>Ie(!0),style:{padding:"0.75rem 1.5rem",borderRadius:"12px",fontWeight:"bold",cursor:"pointer",border:"none",background:w?"#0f172a":"transparent",color:w?"white":"#64748b",transition:"all 0.2s",display:"flex",alignItems:"center",gap:"8px"},children:[e.jsx(ve,{})," Reporte de Egresos (Abonos & Pagos)"]})]}),!w&&P!=="BI"&&e.jsxs(Je,{children:[e.jsxs("div",{className:"summary-item",children:[e.jsx("span",{className:"summary-label",children:"Suma de Facturas Filtradas"}),e.jsxs("span",{className:"summary-value",children:["C$",be.facturado.toLocaleString(void 0,{minimumFractionDigits:2})]})]}),e.jsxs("div",{className:"summary-item success",children:[e.jsx("span",{className:"summary-label",children:"Total Abonado"}),e.jsxs("span",{className:"summary-value",children:["C$",be.abonado.toLocaleString(void 0,{minimumFractionDigits:2})]})]}),e.jsxs("div",{className:"summary-item danger",children:[e.jsx("span",{className:"summary-label",children:"Deuda Restante"}),e.jsxs("span",{className:"summary-value",children:["C$",be.restante.toLocaleString(void 0,{minimumFractionDigits:2})]})]})]}),w&&e.jsx(Je,{children:e.jsxs("div",{className:"summary-item success",children:[e.jsx("span",{className:"summary-label",children:"Total Egresado Bajo Filtros"}),e.jsxs("span",{className:"summary-value",children:["C$",At.toLocaleString(void 0,{minimumFractionDigits:2})]})]})}),!w&&e.jsxs(e.Fragment,{children:[e.jsxs(Zt,{children:[e.jsxs(q,{color:"#ef4444",bg:"#fef2f2",children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(Y,{})}),e.jsx("div",{className:"label",children:"Vencidas"}),e.jsx("div",{className:"value",children:N.venc}),e.jsx("div",{className:"sub",children:"Requieren atención urgente"})]}),e.jsxs(q,{color:"#ea580c",bg:"#fff7ed",children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(L,{})}),e.jsx("div",{className:"label",children:"Próximas a Vencer"}),e.jsx("div",{className:"value",children:N.prox}),e.jsx("div",{className:"sub",children:"En los próx. 5 días"})]}),e.jsxs(q,{color:"#3b82f6",bg:"#eff6ff",children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(L,{})}),e.jsx("div",{className:"label",children:"Pendientes"}),e.jsx("div",{className:"value",children:N.pend}),e.jsx("div",{className:"sub",children:"Sin riesgo inmediato"})]}),e.jsxs(q,{color:"#10b981",bg:"#dcfce7",children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(X,{})}),e.jsx("div",{className:"label",children:"Pagadas"}),e.jsx("div",{className:"value",children:N.pag}),e.jsx("div",{className:"sub",children:"Completadas con éxito"})]}),e.jsxs(q,{color:"#b45309",bg:"#fffbeb",children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(G,{})}),e.jsx("div",{className:"label",children:"Deuda Total"}),e.jsxs("div",{className:"value",style:{color:"#b45309",fontSize:"1.5rem"},children:["C$",N.totalDebt.toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsx("div",{className:"sub",children:"Saldo Pendiente Global"})]})]}),e.jsxs(Qe,{children:[e.jsx(Kt,{children:[{id:"PENDIENTE",label:"Por Pagar (Prox)",icon:L,color:"#3b82f6",bg:"#eff6ff",count:N.pend+N.prox},{id:"VENCIDA",label:"Vencidas",icon:Y,color:"#ef4444",bg:"#fef2f2",count:N.venc},{id:"PAGADA",label:"Pagadas",icon:X,color:"#10b981",bg:"#dcfce7",count:N.pag},{id:"BI",label:"Resumen BI",icon:ye,color:"#6366f1",bg:"#eef2ff",count:null},{id:"TODAS",label:"Todas",icon:ve,color:"#64748b",bg:"#f1f5f9",count:null}].map(t=>e.jsxs(er,{active:P===t.id,activeColor:t.color,activeBg:t.bg,onClick:()=>nt(t.id),children:[e.jsx(t.icon,{})," ",t.label,t.count!==null&&e.jsx("span",{className:"badge",children:t.count})]},t.id))}),e.jsxs(et,{children:[e.jsxs(tt,{children:[e.jsx(Ge,{}),e.jsx("input",{type:"text",placeholder:"Buscar proveedor o No. factura...",value:R,onChange:t=>Ne(t.target.value)})]}),e.jsxs(F,{style:{minWidth:"180px"},children:[e.jsx("label",{children:"Ordenar Por"}),e.jsxs("select",{value:W,onChange:t=>it(t.target.value),children:[e.jsx("option",{value:"vencimiento_asc",children:"Vencen Primero (Próximas)"}),e.jsx("option",{value:"emision_desc",children:"Emitidas Reciente (Nuevas)"}),e.jsx("option",{value:"emision_asc",children:"Emitidas Antiguas (Viejas)"})]})]}),e.jsxs(F,{children:[e.jsx("label",{children:"Tipo de Compra"}),e.jsxs("select",{value:_,onChange:t=>ke(t.target.value),children:[e.jsx("option",{value:"",children:"TODAS"}),e.jsx("option",{value:"CREDITO",children:"Crédito"}),e.jsx("option",{value:"CONTADO",children:"Contado"})]})]}),e.jsxs(F,{children:[e.jsx("label",{children:"Proveedor"}),e.jsxs("select",{value:j,onChange:t=>Pe(t.target.value),children:[e.jsx("option",{value:"",children:"Todos"}),he.map(t=>e.jsx("option",{value:t.nombre,children:t.nombre},t.id_proveedor||t.id))]})]}),e.jsxs(F,{style:{minWidth:"140px"},children:[e.jsx("label",{children:"Desde"}),e.jsx("input",{type:"date",value:y,onChange:t=>_e(t.target.value)})]}),e.jsxs(F,{style:{minWidth:"140px"},children:[e.jsx("label",{children:"Hasta"}),e.jsx("input",{type:"date",value:C,onChange:t=>Te(t.target.value)})]})]})]}),Ee?e.jsxs("div",{style:{textAlign:"center",padding:"4rem",color:"#94a3b8"},children:[e.jsx(L,{className:"spin",style:{fontSize:"2rem",marginBottom:"1rem"}}),e.jsx("p",{children:"Cargando información..."})]}):ie.length>0?e.jsx(tr,{children:ie.map(t=>{const r=t.effectiveStatus,a=wt(r),s=parseFloat(t.monto_total)||0,l=parseFloat(t.monto_abonado)||0,c=s-l,p=s>0?l/s*100:0;return e.jsxs(rr,{color:a.color,balanceColor:c>0?"#ef4444":"#10b981",children:[e.jsxs("div",{className:"card-header",children:[e.jsxs("div",{className:"provider-info",children:[e.jsxs("h3",{title:t.proveedor,children:[e.jsx(Pt,{style:{marginRight:6,color:"#94a3b8"}})," ",t.proveedor]}),e.jsxs("span",{className:"invoice-number",children:["#",t.numero_factura]})]}),e.jsx(U,{bg:a.bg,text:a.color,children:a.label})]}),e.jsxs("div",{className:"card-body",children:[e.jsxs("div",{className:"meta-row",children:[e.jsxs("span",{className:"label",children:[e.jsx(_t,{})," Emisión"]}),e.jsx("span",{className:"value",children:T(t.fecha_emision)})]}),e.jsxs("div",{className:"meta-row",children:[e.jsxs("span",{className:"label",children:[e.jsx(Y,{})," Vence"]}),e.jsx("span",{className:"value",style:{color:r==="VENCIDA"?"#ef4444":"inherit"},children:T(t.fecha_vencimiento)})]}),e.jsxs("div",{className:"meta-row",children:[e.jsxs("span",{className:"label",children:[e.jsx(ye,{})," Tipo de Compra"]}),e.jsx("span",{className:"value",children:e.jsx(U,{bg:t.tipo_compra==="CONTADO"?"#dcfce7":"#eef2ff",text:t.tipo_compra==="CONTADO"?"#16a34a":"#4f46e5",style:{padding:"0.2rem 0.5rem",fontSize:"0.7rem"},children:t.tipo_compra})})]}),e.jsxs("div",{className:"financial-block",children:[e.jsxs("div",{className:"total-row",children:[e.jsx("span",{className:"label",children:"Total a Pagar"}),e.jsxs("span",{className:"amount",children:["C$",s.toLocaleString(void 0,{minimumFractionDigits:2})]})]}),e.jsx("div",{className:"progress-bar",children:e.jsx("div",{style:{width:`${p}%`,background:a.color}})}),e.jsxs("div",{className:"balance-text",children:["Abonado: C$",l.toLocaleString(void 0,{minimumFractionDigits:2})," • ",e.jsxs("strong",{children:["Resta: C$",c.toLocaleString(void 0,{minimumFractionDigits:2})]})]})]})]}),e.jsxs("div",{className:"card-footer",style:{flexWrap:"wrap"},children:[c>0&&e.jsxs(g,{$primary:!0,style:{flex:1,justifyContent:"center"},onClick:()=>gt(t),children:[e.jsx(G,{})," Abonar"]}),e.jsxs(g,{$secondary:!0,style:{flex:1,justifyContent:"center"},onClick:()=>Ct(t),children:[e.jsx(ve,{})," Historial"]}),e.jsx(g,{$danger:!0,style:{padding:"0.75rem"},onClick:()=>{O(t),te(!0)},children:e.jsx(Ce,{})})]})]},t.id)})}):P==="BI"?e.jsxs(Ze,{children:[e.jsxs(Ke,{children:[e.jsxs("h3",{children:[e.jsx(ye,{})," Resumen de Razonamiento de Negocio"]}),y&&C&&e.jsxs("span",{className:"date-range",children:[T(y)," - ",T(C)]})]}),e.jsxs(Se,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Proveedor"}),e.jsx("th",{style:{textAlign:"center"},children:"Facturas"}),e.jsx("th",{style:{textAlign:"right"},children:"Total Comprado"}),e.jsx("th",{style:{textAlign:"right"},children:"Pagado"}),e.jsx("th",{style:{textAlign:"right"},children:"Saldo Pendiente"})]})}),e.jsxs("tbody",{children:[$.map(t=>e.jsxs("tr",{children:[e.jsx("td",{className:"provider-name",children:t.provider}),e.jsx("td",{style:{textAlign:"center"},children:e.jsx("span",{className:"count-badge",children:t.count})}),e.jsxs("td",{className:"amount",children:["C$",t.totalAmount.toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsxs("td",{className:"amount",style:{color:"#10b981"},children:["C$",t.totalPaid.toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsxs("td",{className:"amount",style:{color:t.totalAmount-t.totalPaid>.1?"#ef4444":"#10b981"},children:["C$",(t.totalAmount-t.totalPaid).toLocaleString(void 0,{minimumFractionDigits:2})]})]},t.provider)),$.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:"5",style:{textAlign:"center",padding:"3rem",color:"#94a3b8"},children:"No hay datos para el período seleccionado."})})]}),$.length>0&&e.jsx("tfoot",{children:e.jsxs("tr",{style:{background:"#f8fafc",fontWeight:"900"},children:[e.jsx("td",{colSpan:"2",style:{textAlign:"right",textTransform:"uppercase",fontSize:"0.8rem",color:"#64748b"},children:"Totales Globales:"}),e.jsxs("td",{className:"amount",children:["C$",$.reduce((t,r)=>t+r.totalAmount,0).toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsxs("td",{className:"amount",children:["C$",$.reduce((t,r)=>t+r.totalPaid,0).toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsxs("td",{className:"amount",style:{color:"#ef4444"},children:["C$",($.reduce((t,r)=>t+r.totalAmount,0)-$.reduce((t,r)=>t+r.totalPaid,0)).toLocaleString(void 0,{minimumFractionDigits:2})]})]})})]})]}):e.jsxs("div",{style:{textAlign:"center",padding:"4rem",color:"#94a3b8",border:"2px dashed #e2e8f0",borderRadius:"24px",background:"white"},children:[e.jsx(je,{style:{fontSize:"3rem",marginBottom:"1rem",opacity:.3}}),e.jsx("h3",{style:{color:"#475569"},children:"No se encontraron facturas"}),e.jsx("p",{children:"Intenta ajustar los filtros o registra una nueva."})]})]}),w&&e.jsxs(e.Fragment,{children:[e.jsx(Qe,{children:e.jsxs(et,{style:{width:"100%"},children:[e.jsxs(tt,{children:[e.jsx(Ge,{}),e.jsx("input",{type:"text",placeholder:"Buscar por proveedor, factura o referencia...",value:R,onChange:t=>Ne(t.target.value)})]}),e.jsxs(F,{children:[e.jsx("label",{children:"Método de Pago"}),e.jsxs("select",{value:Q,onChange:t=>lt(t.target.value),children:[e.jsx("option",{value:"",children:"TODOS"}),e.jsx("option",{value:"EFECTIVO",children:"Efectivo"}),e.jsx("option",{value:"TARJETA",children:"Tarjeta"}),e.jsx("option",{value:"TRANSFERENCIA",children:"Transferencia"}),e.jsx("option",{value:"CHEQUE",children:"Cheque"})]})]}),e.jsxs(F,{children:[e.jsx("label",{children:"Tipo Factura"}),e.jsxs("select",{value:_,onChange:t=>ke(t.target.value),children:[e.jsx("option",{value:"",children:"TODOS"}),e.jsx("option",{value:"CONTADO",children:"Contado"}),e.jsx("option",{value:"CREDITO",children:"Crédito"})]})]}),e.jsxs(F,{children:[e.jsx("label",{children:"Proveedor"}),e.jsxs("select",{value:j,onChange:t=>Pe(t.target.value),children:[e.jsx("option",{value:"",children:"TODOS"}),he.map(t=>e.jsx("option",{value:t.nombre,children:t.nombre},t.id_proveedor||t.id))]})]}),e.jsxs(F,{style:{minWidth:"140px"},children:[e.jsx("label",{children:"Desde"}),e.jsx("input",{type:"date",value:y,onChange:t=>_e(t.target.value)})]}),e.jsxs(F,{style:{minWidth:"140px"},children:[e.jsx("label",{children:"Hasta"}),e.jsx("input",{type:"date",value:C,onChange:t=>Te(t.target.value)})]})]})}),e.jsxs(Ze,{children:[e.jsxs(Ke,{children:[e.jsxs("h3",{children:[e.jsx(G,{})," Listado de Pagos y Abonos Efectuados"]}),(y||C)&&e.jsxs("span",{className:"date-range",children:[y?T(y):"Inicio"," - ",C?T(C):"Hoy"]})]}),Ee?e.jsxs("div",{style:{textAlign:"center",padding:"3rem",color:"#94a3b8"},children:[e.jsx(L,{className:"spin",style:{fontSize:"2rem",marginBottom:"1rem"}}),e.jsx("p",{children:"Cargando información..."})]}):e.jsx("div",{style:{overflowX:"auto"},children:e.jsxs(Se,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Fecha Abono"}),e.jsx("th",{children:"Factura"}),e.jsx("th",{children:"Proveedor"}),e.jsx("th",{children:"Método"}),e.jsx("th",{children:"Referencia / Detalle"}),e.jsx("th",{style:{textAlign:"center"},children:"Modo de Compra"}),e.jsx("th",{style:{textAlign:"center"},children:"Comprobante"}),e.jsx("th",{style:{textAlign:"right"},children:"Monto Pagado (C$)"}),e.jsx("th",{style:{textAlign:"center"},children:"Acciones"})]})}),e.jsxs("tbody",{children:[le.map(t=>e.jsxs("tr",{children:[e.jsx("td",{children:T(t.fecha_abono)}),e.jsx("td",{children:e.jsxs("b",{children:["#",t.numero_factura]})}),e.jsx("td",{children:t.proveedor}),e.jsx("td",{children:e.jsx(U,{bg:"#f1f5f9",text:"#475569",children:t.metodo_pago})}),e.jsx("td",{children:t.referencia||"-"}),e.jsx("td",{style:{textAlign:"center"},children:e.jsx(U,{bg:t.tipo_compra==="CONTADO"?"#dcfce7":"#eef2ff",text:t.tipo_compra==="CONTADO"?"#16a34a":"#4f46e5",children:t.tipo_compra})}),e.jsx("td",{style:{textAlign:"center"},children:t.comprobante_url?e.jsx("a",{href:ge(t.comprobante_url),target:"_blank",rel:"noopener noreferrer",style:{color:"#ef4444",fontSize:"1.2rem",display:"inline-flex",alignItems:"center"},title:"Ver Comprobante PDF",children:e.jsx(qe,{})}):e.jsx("span",{style:{color:"#94a3b8",fontSize:"0.85rem"},children:"—"})}),e.jsxs("td",{className:"amount",style:{color:"#10b981"},children:["C$",parseFloat(t.monto).toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsx("td",{style:{textAlign:"center"},children:e.jsxs("div",{style:{display:"flex",gap:"0.5rem",justifyContent:"center"},children:[e.jsx(g,{$secondary:!0,title:"Editar abono",style:{padding:"0.4rem 0.6rem",fontSize:"0.8rem",borderRadius:"8px"},onClick:()=>{const r=b.find(a=>a.id===t.id_factura);r&&O(r),Le({id:t.abono_id,monto:t.monto,metodo_pago:t.metodo_pago,referencia:t.referencia,comprobante_url:t.comprobante_url})},children:e.jsx(Ue,{})}),e.jsx(g,{$danger:!0,title:"Eliminar abono",style:{padding:"0.4rem 0.6rem",fontSize:"0.8rem",borderRadius:"8px"},onClick:()=>Ve(t.abono_id),children:e.jsx(Ce,{})})]})})]},t.abono_id)),le.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:"9",style:{textAlign:"center",padding:"3rem",color:"#94a3b8"},children:"No hay registro de abonos o pagos en este período."})})]})]})})]})]}),ct&&e.jsx(V,{onClick:()=>Z(!1),children:e.jsxs(H,{onClick:t=>t.stopPropagation(),children:[e.jsx(me,{onClick:()=>Z(!1),children:e.jsx(J,{})}),e.jsx("h2",{children:"Registrar Factura"}),e.jsxs("form",{onSubmit:vt,children:[e.jsxs(h,{children:[e.jsx("label",{children:"Proveedor"}),e.jsxs("select",{required:!0,value:m.proveedor,onChange:t=>v({...m,proveedor:t.target.value}),children:[e.jsx("option",{value:"",children:"Seleccione un proveedor..."}),he.map(t=>e.jsx("option",{value:t.nombre,children:t.nombre},t.id_proveedor||t.id))]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"},children:[e.jsxs(h,{children:[e.jsx("label",{children:"No. Factura"}),e.jsx("input",{required:!0,type:"text",value:m.numero_factura,onChange:t=>v({...m,numero_factura:t.target.value}),placeholder:"Ej: F-001"})]}),e.jsxs(h,{children:[e.jsx("label",{children:"Monto Total (C$)"}),e.jsx("input",{required:!0,type:"number",step:"0.01",value:m.monto_total,onChange:t=>v({...m,monto_total:t.target.value}),placeholder:"0.00"})]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"},children:[e.jsxs(h,{children:[e.jsx("label",{children:"Fecha Emisión"}),e.jsx("input",{required:!0,type:"date",value:m.fecha_emision,onChange:t=>v({...m,fecha_emision:t.target.value})})]}),e.jsxs(h,{children:[e.jsx("label",{children:"Fecha Vencimiento"}),e.jsx("input",{required:!0,type:"date",value:m.fecha_vencimiento,onChange:t=>v({...m,fecha_vencimiento:t.target.value})})]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",background:"#f8fafc",padding:"1rem",borderRadius:"12px",marginBottom:"1.25rem",border:"1px solid #e2e8f0"},children:[e.jsxs(h,{style:{marginBottom:0},children:[e.jsx("label",{children:"Tipo de Compra"}),e.jsxs("select",{required:!0,value:m.tipo_compra,onChange:t=>v({...m,tipo_compra:t.target.value}),children:[e.jsx("option",{value:"CREDITO",children:"A Crédito"}),e.jsx("option",{value:"CONTADO",children:"De Contado"})]})]}),m.tipo_compra==="CONTADO"&&e.jsxs(h,{style:{marginBottom:0},children:[e.jsx("label",{children:"Método de Pago"}),e.jsxs("select",{required:!0,value:m.metodo_pago,onChange:t=>v({...m,metodo_pago:t.target.value}),children:[e.jsx("option",{value:"EFECTIVO",children:"Efectivo"}),e.jsx("option",{value:"TARJETA",children:"Tarjeta"}),e.jsx("option",{value:"TRANSFERENCIA",children:"Transferencia"}),e.jsx("option",{value:"CHEQUE",children:"Cheque"})]})]})]}),m.tipo_compra==="CONTADO"&&e.jsxs(e.Fragment,{children:[e.jsxs(h,{children:[e.jsx("label",{children:"Referencia de Pago (Transferencia, Cheque, etc.)"}),e.jsx("input",{type:"text",value:m.referencia,onChange:t=>v({...m,referencia:t.target.value}),placeholder:"Opcional..."})]}),e.jsxs(h,{children:[e.jsx("label",{children:"Comprobante de Pago (Imagen o PDF)"}),e.jsxs(Fe,{children:[e.jsx(we,{className:"upload-icon"}),ae?e.jsx("div",{className:"file-details",children:E?"Procesando archivo...":`✓ PDF Generado: ${D.name}`}):e.jsx("div",{className:"file-details",children:"Haz clic o arrastra una imagen o PDF"}),e.jsx("input",{type:"file",accept:"image/*,application/pdf",onChange:fe,disabled:E})]})]})]}),e.jsxs(h,{children:[e.jsx("label",{children:"Notas (Opcional)"}),e.jsx("textarea",{rows:"3",value:m.notes,onChange:t=>v({...m,notas:t.target.value}),placeholder:"Detalles extra..."})]}),e.jsxs(g,{$primary:!0,type:"submit",disabled:E,style:{width:"100%",padding:"1rem",fontSize:"1rem"},children:[e.jsx(X,{})," Guardar Factura"]})]})]})}),dt&&e.jsx(V,{onClick:()=>K(!1),children:e.jsxs(H,{onClick:t=>t.stopPropagation(),style:{maxWidth:"450px"},children:[e.jsx(me,{onClick:()=>K(!1),children:e.jsx(J,{})}),e.jsx("h2",{children:"Registrar Abono"}),e.jsxs("div",{style:{background:"#f1f5f9",padding:"1rem",borderRadius:"12px",marginBottom:"1.5rem"},children:[e.jsxs("div",{style:{fontSize:"0.9rem",color:"#64748b",marginBottom:"0.25rem"},children:["Factura #",n==null?void 0:n.numero_factura]}),e.jsxs("div",{style:{fontSize:"1.5rem",fontWeight:"800",color:"#0f172a"},children:["Deuda: C$",((parseFloat(n==null?void 0:n.monto_total)||0)-(parseFloat(n==null?void 0:n.monto_abonado)||0)).toFixed(2)]})]}),e.jsxs("form",{onSubmit:bt,children:[e.jsxs(h,{children:[e.jsx("label",{children:"Monto a Abonar (C$)"}),e.jsx("input",{required:!0,type:"number",step:"0.01",autoFocus:!0,placeholder:"0.00",value:A.amount,onChange:t=>oe({...A,amount:t.target.value})})]}),e.jsxs(h,{children:[e.jsx("label",{children:"Método de Pago"}),e.jsxs("select",{required:!0,value:A.method,onChange:t=>oe({...A,method:t.target.value}),children:[e.jsx("option",{value:"EFECTIVO",children:"Efectivo"}),e.jsx("option",{value:"TARJETA",children:"Tarjeta"}),e.jsx("option",{value:"TRANSFERENCIA",children:"Transferencia"}),e.jsx("option",{value:"CHEQUE",children:"Cheque"})]})]}),e.jsxs(h,{children:[e.jsx("label",{children:"Referencia / Detalle (Opcional)"}),e.jsx("input",{type:"text",placeholder:"Ej: Transferencia #1234, Pago en efectivo...",value:A.reference,onChange:t=>oe({...A,reference:t.target.value})})]}),e.jsxs(h,{children:[e.jsx("label",{children:"Adjuntar Comprobante (Imagen o PDF)"}),e.jsxs(Fe,{children:[e.jsx(we,{className:"upload-icon"}),ae?e.jsx("div",{className:"file-details",children:E?"Procesando archivo...":`✓ PDF Generado: ${D.name}`}):e.jsx("div",{className:"file-details",children:"Sube el comprobante de pago"}),e.jsx("input",{type:"file",accept:"image/*,application/pdf",onChange:fe,disabled:E})]})]}),e.jsxs(g,{$primary:!0,type:"submit",disabled:E,style:{width:"100%",padding:"1rem"},children:[e.jsx(G,{})," Confirmar Pago"]})]})]})}),mt&&e.jsx(V,{onClick:()=>ee(!1),children:e.jsxs(H,{onClick:t=>t.stopPropagation(),style:{maxWidth:"450px"},children:[e.jsx(me,{onClick:()=>ee(!1),children:e.jsx(J,{})}),e.jsx("h2",{children:"Editar Abono"}),e.jsxs("div",{style:{background:"#f1f5f9",padding:"1rem",borderRadius:"12px",marginBottom:"1.5rem"},children:[e.jsxs("div",{style:{fontSize:"0.9rem",color:"#64748b",marginBottom:"0.25rem"},children:["Editando abono en Factura #",n==null?void 0:n.numero_factura]}),e.jsxs("div",{style:{fontSize:"1.2rem",fontWeight:"800",color:"#0f172a"},children:["Proveedor: ",n==null?void 0:n.proveedor]})]}),e.jsxs("form",{onSubmit:jt,children:[e.jsxs(h,{children:[e.jsx("label",{children:"Monto del Abono (C$)"}),e.jsx("input",{required:!0,type:"number",step:"0.01",value:S.amount,onChange:t=>se({...S,amount:t.target.value})})]}),e.jsxs(h,{children:[e.jsx("label",{children:"Método de Pago"}),e.jsxs("select",{required:!0,value:S.method,onChange:t=>se({...S,method:t.target.value}),children:[e.jsx("option",{value:"EFECTIVO",children:"Efectivo"}),e.jsx("option",{value:"TARJETA",children:"Tarjeta"}),e.jsx("option",{value:"TRANSFERENCIA",children:"Transferencia"}),e.jsx("option",{value:"CHEQUE",children:"Cheque"})]})]}),e.jsxs(h,{children:[e.jsx("label",{children:"Referencia / Detalle (Opcional)"}),e.jsx("input",{type:"text",value:S.reference,onChange:t=>se({...S,reference:t.target.value})})]}),e.jsxs(h,{children:[e.jsx("label",{children:"Cambiar/Reemplazar Comprobante (Imagen o PDF)"}),e.jsxs(Fe,{children:[e.jsx(we,{className:"upload-icon"}),ae?e.jsx("div",{className:"file-details",children:E?"Procesando archivo...":`✓ PDF Generado: ${D.name}`}):e.jsx("div",{className:"file-details",children:"Selecciona un archivo si deseas reemplazarlo"}),e.jsx("input",{type:"file",accept:"image/*,application/pdf",onChange:fe,disabled:E})]}),(k==null?void 0:k.comprobante_url)&&!ae&&e.jsxs("div",{style:{marginTop:"0.5rem",fontSize:"0.85rem"},children:["Tiene comprobante: ",e.jsx("a",{href:ge(k.comprobante_url),target:"_blank",rel:"noopener noreferrer",style:{color:"#ef4444",fontWeight:"bold"},children:"Ver actual"})]})]}),e.jsxs(g,{$primary:!0,type:"submit",disabled:E,style:{width:"100%",padding:"1rem"},children:[e.jsx(X,{})," Guardar Cambios"]})]})]})}),pt&&e.jsx(V,{onClick:()=>te(!1),children:e.jsxs(H,{style:{maxWidth:"400px",textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"3rem",color:"#ef4444",marginBottom:"1rem"},children:e.jsx(Y,{})}),e.jsx("h2",{children:"¿Eliminar Factura?"}),e.jsxs("p",{style:{color:"#64748b",marginBottom:"2rem"},children:["Estás a punto de eliminar la factura ",e.jsxs("b",{children:["#",n==null?void 0:n.numero_factura]}),". Se borrarán también todos sus comprobantes y abonos. Esta acción no se puede deshacer."]}),e.jsxs("div",{style:{display:"flex",gap:"1rem"},children:[e.jsx(g,{$secondary:!0,onClick:()=>te(!1),style:{flex:1},children:"Cancelar"}),e.jsx(g,{$danger:!0,onClick:yt,style:{flex:1},children:"Sí, Eliminar"})]})]})}),ht&&e.jsx(V,{onClick:()=>ue(!1),children:e.jsxs(H,{onClick:t=>t.stopPropagation(),style:{maxWidth:"650px"},children:[e.jsx(me,{onClick:()=>ue(!1),children:e.jsx(J,{})}),e.jsx("h2",{children:"Historial de Abonos"}),e.jsxs("div",{style:{background:"#f1f5f9",padding:"1rem",borderRadius:"12px",marginBottom:"1.5rem",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("div",{children:[e.jsxs("div",{style:{fontSize:"0.9rem",color:"#64748b"},children:["Factura #",n==null?void 0:n.numero_factura]}),e.jsx("div",{style:{fontSize:"1.1rem",fontWeight:"800",color:"#0f172a"},children:n==null?void 0:n.proveedor})]}),e.jsxs("div",{style:{textAlign:"right"},children:[e.jsx("div",{style:{fontSize:"0.9rem",color:"#64748b"},children:"Abonado Total"}),e.jsxs("div",{style:{fontSize:"1.2rem",fontWeight:"800",color:"#10b981"},children:["C$",(parseFloat(n==null?void 0:n.monto_abonado)||0).toLocaleString(void 0,{minimumFractionDigits:2})]})]})]}),ut?e.jsxs("div",{style:{textAlign:"center",padding:"2rem",color:"#94a3b8"},children:[e.jsx(L,{className:"spin",style:{fontSize:"1.5rem",marginBottom:"1rem"}}),e.jsx("p",{children:"Cargando historial..."})]}):xe.length>0?e.jsx("div",{style:{overflowX:"auto"},children:e.jsxs(Se,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Fecha"}),e.jsx("th",{children:"Método"}),e.jsx("th",{children:"Referencia"}),e.jsx("th",{style:{textAlign:"center"},children:"Comprobante"}),e.jsx("th",{style:{textAlign:"right"},children:"Monto"}),e.jsx("th",{style:{textAlign:"center"},children:"Acciones"})]})}),e.jsx("tbody",{children:xe.map((t,r)=>e.jsxs("tr",{children:[e.jsx("td",{children:T(t.fecha)}),e.jsx("td",{children:e.jsx(U,{bg:"#f1f5f9",text:"#475569",children:t.metodo_pago})}),e.jsx("td",{children:t.referencia||"-"}),e.jsx("td",{style:{textAlign:"center"},children:t.comprobante_url?e.jsx("a",{href:ge(t.comprobante_url),target:"_blank",rel:"noopener noreferrer",style:{color:"#ef4444",fontSize:"1.2rem",display:"inline-flex",alignItems:"center"},title:"Ver Comprobante PDF",children:e.jsx(qe,{})}):e.jsx("span",{style:{color:"#94a3b8",fontSize:"0.85rem"},children:"—"})}),e.jsxs("td",{className:"amount",style:{color:"#10b981"},children:["C$",parseFloat(t.monto).toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsx("td",{style:{textAlign:"center"},children:e.jsxs("div",{style:{display:"flex",gap:"0.4rem",justifyContent:"center"},children:[e.jsx(g,{$secondary:!0,title:"Editar abono",style:{padding:"0.4rem 0.6rem",fontSize:"0.8rem",borderRadius:"8px"},onClick:()=>Le(t),children:e.jsx(Ue,{})}),e.jsx(g,{$danger:!0,title:"Eliminar abono",style:{padding:"0.4rem 0.6rem",fontSize:"0.8rem",borderRadius:"8px"},onClick:()=>Ve(t.id,n==null?void 0:n.id),children:e.jsx(Ce,{})})]})})]},t.id||r))})]})}):e.jsxs("div",{style:{textAlign:"center",padding:"3rem",color:"#94a3b8",border:"1px dashed #cbd5e1",borderRadius:"16px"},children:[e.jsx(G,{style:{fontSize:"2rem",marginBottom:"1rem",opacity:.5}}),e.jsx("p",{children:"No existen abonos registrados para esta factura."})]})]})})]})};export{cr as default};

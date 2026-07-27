import{r as i,j as e,I as je,X as Dr,Y as Nr,aP as ve,aQ as Y,ah as L,aa as X,ag as G,aR as ye,$ as Ge,aS as Pr,aN as _r,am as Ce,ac as qe,a4 as Ue,k as J,aT as we,s as d,ae as de,t as tr,V as Tr}from"./vendor-BVroOj2J.js";import{E as kr}from"./pdf-vendor-C0MaOehg.js";import{u as $r,I as Ir,J as zr,K as Rr,L as Ye,M as Or,N as Br,O as Mr,P as Lr,Q as Vr}from"./index-sEpZnVGC.js";import{r as Xe}from"./searchEngine-BMYcElFi.js";import"./scanner-vendor-DfxRpMWJ.js";const Ae=()=>new Date().toLocaleDateString("sv-SE",{timeZone:"America/Managua"}),T=o=>{if(!o)return"—";const j=new Date(o.includes("T")?o:`${o}T12:00:00`);return new Intl.DateTimeFormat("es-NI",{timeZone:"America/Managua",day:"2-digit",month:"2-digit",year:"numeric"}).format(j)},pe=tr`from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); }`,Hr=tr`from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; }`,Wr=d.div`
    padding: clamp(1rem, 3vw, 2.5rem); 
    background: #f8fafc;
    min-height: 100vh; 
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    animation: ${pe} 0.5s ease-out;
`,Gr=d.div`
    display: flex; 
    justify-content: space-between; 
    align-items: flex-start; 
    margin-bottom: 2rem; 
    flex-wrap: wrap; 
    gap: 1.5rem;
`,qr=d.div`
    display: flex;
    flex-direction: column;
`,Ur=d.h1`
    font-size: clamp(1.8rem, 2.5vw, 2.2rem); 
    color: #0f172a; 
    display: flex; 
    align-items: center; 
    gap: 0.75rem; 
    margin: 0; 
    font-weight: 900;
    letter-spacing: -0.03em;
    
    svg { color: #0f172a; }
`,Yr=d.p`
    color: #64748b;
    margin: 0.5rem 0 0 0;
    font-size: 1rem;
    font-weight: 500;
`,Xr=d.div`
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
`,Jr=d(Tr)`
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
`,Qr=d.div`
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
    animation: ${Hr} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
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
`,Zr=d.div`
    display: flex; gap: 0.75rem; overflow-x: auto; padding-bottom: 0.5rem;
    border-bottom: 1px solid #f1f5f9;
    &::-webkit-scrollbar { height: 4px; }
    &::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
`,Kr=d.button`
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
`,er=d.div`
    display: flex; flex-wrap: wrap; gap: 1rem; justify-content: space-between;
`,rr=d.div`
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
`,et=d.div`
    display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1.5rem;
`,rt=d.div`
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
`,tt=({info:o,onClose:j})=>o.show?e.jsx(V,{onClick:j,children:e.jsxs(H,{style:{maxWidth:"400px",textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"3rem",marginBottom:"1rem",color:o.type==="error"?"#ef4444":o.type==="success"?"#16a34a":"#0f172a"},children:o.type==="error"?e.jsx(J,{style:{border:"3px solid",borderRadius:"50%",padding:5}}):o.type==="success"?e.jsx(X,{}):e.jsx(Y,{})}),e.jsx("h2",{children:o.title}),e.jsx("p",{style:{color:"#64748b",lineHeight:1.6,marginBottom:"2rem"},children:o.message}),e.jsx(g,{$primary:!0,onClick:j,style:{margin:"0 auto",width:"100%"},children:"Entendido"})]})}):null,Fe=d.div`
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
`,lt=()=>{const{token:o}=$r(),[j,ar]=i.useState([]),[he,or]=i.useState([]),[Ee,De]=i.useState(!1),[nr,z]=i.useState(0),[P,sr]=i.useState("PENDIENTE"),[W,ir]=i.useState("vencimiento_asc"),[R,Ne]=i.useState(""),[b,Pe]=i.useState(""),[y,_e]=i.useState(""),[C,Te]=i.useState(""),[_,ke]=i.useState(""),[Q,lr]=i.useState(""),[$e,Ie]=i.useState({show:!1,title:"",message:"",type:"info"}),[cr,Z]=i.useState(!1),[dr,K]=i.useState(!1),[mr,ee]=i.useState(!1),[pr,re]=i.useState(!1),[hr,ue]=i.useState(!1),[w,ze]=i.useState(!1),[ur,Re]=i.useState(!1),[xe,te]=i.useState([]),[Oe,Be]=i.useState([]),[s,O]=i.useState(null),[k,xr]=i.useState(null),[ae,B]=i.useState(null),[E,Me]=i.useState(!1),[D,M]=i.useState({base64:null,name:null}),[m,v]=i.useState({proveedor:"",numero_factura:"",fecha_emision:Ae(),fecha_vencimiento:"",monto_total:"",notas:"",tipo_compra:"CREDITO",metodo_pago:"EFECTIVO",referencia:""}),[A,oe]=i.useState({amount:"",reference:"",method:"EFECTIVO"}),[S,ne]=i.useState({amount:"",reference:"",method:"EFECTIVO"}),x=(r,t,a="info")=>{Ie({show:!0,title:r,message:t,type:a})},fr=r=>new Promise((t,a)=>{if(r.type==="application/pdf"){const n=new FileReader;n.readAsDataURL(r),n.onload=()=>t({base64:n.result,name:r.name}),n.onerror=l=>a(l)}else if(r.type.startsWith("image/")){const n=new FileReader;n.readAsDataURL(r),n.onload=l=>{const c=new Image;c.src=l.target.result,c.onload=()=>{let u=c.width,f=c.height;(u>1200||f>1200)&&(u>f?(f=Math.round(f*1200/u),u=1200):(u=Math.round(u*1200/f),f=1200));const I=document.createElement("canvas");I.width=u,I.height=f,I.getContext("2d").drawImage(c,0,0,u,f);const ce=I.toDataURL("image/jpeg",.7),Sr=u>f?"l":"p",We=new kr({orientation:Sr,unit:"px",format:[u,f]});We.addImage(ce,"JPEG",0,0,u,f);const Fr=We.output("datauristring"),Er=r.name.substring(0,r.name.lastIndexOf("."))+".pdf";t({base64:Fr,name:Er})},c.onerror=p=>a(p)},n.onerror=l=>a(l)}else a(new Error("Formato de archivo no soportado. Sube una Imagen o un PDF."))}),fe=async r=>{const t=r.target.files[0];if(t){Me(!0),B(t);try{const a=await fr(t);M(a)}catch(a){console.error(a),x("Archivo inválido",a.message||"No se pudo procesar el archivo.","error"),B(null),M({base64:null,name:null})}finally{Me(!1)}}},ge=r=>{if(!r)return null;if(r.startsWith("http")||r.startsWith("data:"))return r;let t=r;return r.startsWith("/uploads")?t="/api"+r:r.startsWith("uploads")&&(t="/api/"+r),`${"https://sistema.multirepuestosrg.com/api".replace(/\/api$/,"")}${t.startsWith("/")?"":"/"}${t}`};i.useEffect(()=>{o&&(async()=>{De(!0);try{const t={};y&&(t.startDate=y),C&&(t.endDate=C),b&&(t.proveedor=b);const a=await Ir(o,Object.keys(t).length?t:void 0),n=Array.isArray(a)?a:(a==null?void 0:a.data)||[];ar(n);const l=await zr(o),c=Array.isArray(l)?l:(l==null?void 0:l.data)||[];if(or(c),w){const p=await Rr(o,Object.keys(t).length?t:void 0);Be(Array.isArray(p)?p:(p==null?void 0:p.data)||[])}}catch(t){console.error("Error cargando datos:",t)}finally{De(!1)}})()},[o,nr,y,C,b,w]);const gr=r=>{O(r),oe({amount:"",reference:"",method:"EFECTIVO"}),B(null),M({base64:null,name:null}),K(!0)},br=async r=>{if(r.preventDefault(),!s||!A.amount)return;const t=parseFloat(A.amount),a=(parseFloat(s.monto_total)||0)-(parseFloat(s.monto_abonado)||0);if(t<=0)return x("Error","El monto debe ser mayor a cero.","error");if(t>a+.01)return x("Error","El monto excede la deuda pendiente.","error");const l=t>=a-.1?"PAGADA":s.estado;try{await Mr(s.id,{amount:t,reference:A.reference,method:A.method,status:l,comprobante_base64:D.base64,comprobante_name:D.name},o),z(c=>c+1),K(!1),x("Pago Registrado",`Se registró el abono correctamente. Estado: ${l}`,"success")}catch(c){console.error(c),x("Error","No se pudo registrar el pago. Intente nuevamente.","error")}},Le=r=>{xr(r),ne({amount:r.monto,reference:r.referencia||"",method:r.metodo_pago}),B(null),M({base64:null,name:null}),ee(!0)},jr=async r=>{if(r.preventDefault(),!k||!S.amount)return;const t=parseFloat(S.amount);if(t<=0)return x("Error","El monto debe ser mayor a cero.","error");try{if(await Lr(k.id,{amount:t,method:S.method,reference:S.reference,comprobante_base64:D.base64,comprobante_name:D.name},o),z(a=>a+1),ee(!1),s){const a=await Ye(s.id,o);te(Array.isArray(a)?a:(a==null?void 0:a.data)||[]);const n=t-parseFloat(k.monto);O(l=>({...l,monto_abonado:parseFloat(l.monto_abonado)+n}))}x("Abono Modificado","El abono se editó y recalculó de forma exitosa.","success")}catch(a){console.error(a),x("Error","No se pudo actualizar el abono.","error")}},vr=async r=>{if(r.preventDefault(),!m.proveedor)return x("Falta Proveedor","Seleccione un proveedor.","warning");try{await Br({...m,comprobante_base64:D.base64,comprobante_name:D.name},o),z(t=>t+1),Z(!1),v({proveedor:"",numero_factura:"",fecha_emision:Ae(),fecha_vencimiento:"",monto_total:"",notas:"",tipo_compra:"CREDITO",metodo_pago:"EFECTIVO",referencia:""}),B(null),M({base64:null,name:null}),x("Guardado","La factura ha sido registrada exitosamente.","success")}catch{x("Error","Error al guardar factura.","error")}},yr=async()=>{if(s)try{await Vr(s.id,o),z(r=>r+1),re(!1),x("Eliminada","La factura fue eliminada del sistema.","success")}catch{x("Error","No se pudo eliminar la factura.","error")}},Cr=async r=>{O(r),ue(!0),Re(!0),te([]);try{const t=await Ye(r.id,o);te(Array.isArray(t)?t:(t==null?void 0:t.data)||[])}catch{x("Error","No se pudo cargar el historial de abonos.","error")}finally{Re(!1)}},Ve=async(r,t=null)=>{if(window.confirm("¿Eliminar este abono? El monto se descontará del total abonado en la factura."))try{if(await Or(r,o),te(a=>a.filter(n=>n.id!==r)),Be(a=>a.filter(n=>n.abono_id!==r)),s){const a=xe.find(n=>n.id===r);a&&O(n=>({...n,monto_abonado:Math.max(0,parseFloat(n.monto_abonado)-parseFloat(a.monto))}))}z(a=>a+1),x("Abono Eliminado","El abono fue eliminado y la factura fue actualizada.","success")}catch{x("Error","No se pudo eliminar el abono. Intenta nuevamente.","error")}},se=i.useCallback(r=>{const t=parseFloat(r.monto_total)||0,a=parseFloat(r.monto_abonado)||0;if(t>0&&a>=t-.1)return"PAGADA";if(!r.fecha_vencimiento)return"PENDIENTE";const n=new Date;n.setHours(0,0,0,0);let l=r.fecha_vencimiento;l&&l.includes("T")&&(l=l.split("T")[0]);const c=l.split(/[-/]/);let p,u,f;c[0].length===4?(p=parseInt(c[0],10),u=parseInt(c[1],10)-1,f=parseInt(c[2],10)):(f=parseInt(c[0],10),u=parseInt(c[1],10)-1,p=parseInt(c[2],10));const I=new Date(p,u,f);I.setHours(0,0,0,0);const He=I-n,ce=Math.ceil(He/(1e3*60*60*24));return ce<0?"VENCIDA":ce<=5?"PROXIMA":"PENDIENTE"},[]),wr=i.useCallback(r=>{switch(r){case"VENCIDA":return{color:"#ef4444",bg:"#fee2e2",activeColor:"#ef4444",activeBg:"#fee2e2",label:"Vencida"};case"PROXIMA":return{color:"#f97316",bg:"#ffedd5",activeColor:"#ea580c",activeBg:"#ffedd5",label:"Próxima a Vencer"};case"PAGADA":return{color:"#10b981",bg:"#dcfce7",activeColor:"#10b981",activeBg:"#dcfce7",label:"Pagada"};default:return{color:"#3b82f6",bg:"#dbeafe",activeColor:"#2563eb",activeBg:"#dbeafe",label:"Pendiente"}}},[]),N=i.useMemo(()=>{let r=0,t=0,a=0,n=0,l=0;return j.forEach(c=>{const p=se(c);p==="PENDIENTE"&&r++,p==="VENCIDA"&&t++,p==="PAGADA"&&a++,p==="PROXIMA"&&n++;const u=(parseFloat(c.monto_total)||0)-(parseFloat(c.monto_abonado)||0);p!=="PAGADA"&&(l+=u)}),{pend:r,venc:t,pag:a,prox:n,totalDebt:l,totalCount:j.length}},[j,se]),$=i.useMemo(()=>{let r=j;b&&(r=r.filter(a=>a.proveedor===b));const t={};return r.forEach(a=>{const n=a.proveedor||"Sin Proveedor";t[n]||(t[n]={provider:n,count:0,totalAmount:0,totalPaid:0}),t[n].count+=1,t[n].totalAmount+=parseFloat(a.monto_total)||0,t[n].totalPaid+=parseFloat(a.monto_abonado)||0}),Object.values(t).sort((a,n)=>n.totalAmount-a.totalAmount)},[j,b]),ie=i.useMemo(()=>{let r=j.map(t=>({...t,effectiveStatus:se(t)}));return P!=="TODAS"&&P!=="BI"&&(P==="PENDIENTE"?r=r.filter(t=>t.effectiveStatus==="PENDIENTE"||t.effectiveStatus==="PROXIMA"):r=r.filter(t=>t.effectiveStatus===P)),b&&(r=r.filter(t=>t.proveedor===b)),_&&(r=r.filter(t=>t.tipo_compra===_)),r=Xe(r,R,["proveedor","numero_factura"]),r.sort((t,a)=>W==="vencimiento_asc"?new Date(t.fecha_vencimiento)-new Date(a.fecha_vencimiento):W==="emision_desc"?new Date(a.fecha_emision)-new Date(t.fecha_emision):W==="emision_asc"?new Date(t.fecha_emision)-new Date(a.fecha_emision):0),r},[j,P,R,b,_,W,se]),be=i.useMemo(()=>{let r=0,t=0;return ie.forEach(a=>{r+=parseFloat(a.monto_total)||0,t+=parseFloat(a.monto_abonado)||0}),{facturado:r,abonado:t,restante:r-t}},[ie]),le=i.useMemo(()=>{let r=Oe;return b&&(r=r.filter(t=>t.proveedor===b)),Q&&(r=r.filter(t=>t.metodo_pago===Q)),_&&(r=r.filter(t=>t.tipo_compra===_)),r=Xe(r,R,["proveedor","numero_factura","referencia"]),r},[Oe,b,Q,_,R]),Ar=i.useMemo(()=>le.reduce((r,t)=>r+parseFloat(t.monto||0),0),[le]);return e.jsxs(Wr,{children:[e.jsx(tt,{info:$e,onClose:()=>Ie({...$e,show:!1})}),e.jsxs(Gr,{children:[e.jsxs(qr,{children:[e.jsxs(Ur,{children:[e.jsx(je,{})," Facturas de Proveedores"]}),e.jsx(Yr,{children:"Gestión y control de cuentas por pagar"})]}),e.jsxs(Xr,{children:[e.jsx(g,{$secondary:!0,onClick:()=>z(r=>r+1),children:"Actualizar"}),e.jsxs(Jr,{to:"/dashboard",children:[e.jsx(Dr,{})," Volver"]}),e.jsxs(g,{$primary:!0,onClick:()=>{v({proveedor:"",numero_factura:"",fecha_emision:Ae(),fecha_vencimiento:"",monto_total:"",notas:"",tipo_compra:"CREDITO",metodo_pago:"EFECTIVO",referencia:""}),B(null),M({base64:null,name:null}),Z(!0)},children:[e.jsx(Nr,{})," Registrar Factura"]})]})]}),e.jsxs("div",{style:{display:"flex",gap:"1rem",marginBottom:"2rem",borderBottom:"2px solid #e2e8f0",paddingBottom:"1rem"},children:[e.jsxs("button",{onClick:()=>ze(!1),style:{padding:"0.75rem 1.5rem",borderRadius:"12px",fontWeight:"bold",cursor:"pointer",border:"none",background:w?"transparent":"#0f172a",color:w?"#64748b":"white",transition:"all 0.2s",display:"flex",alignItems:"center",gap:"8px"},children:[e.jsx(je,{})," Control de Facturas (Deudas)"]}),e.jsxs("button",{onClick:()=>ze(!0),style:{padding:"0.75rem 1.5rem",borderRadius:"12px",fontWeight:"bold",cursor:"pointer",border:"none",background:w?"#0f172a":"transparent",color:w?"white":"#64748b",transition:"all 0.2s",display:"flex",alignItems:"center",gap:"8px"},children:[e.jsx(ve,{})," Reporte de Egresos (Abonos & Pagos)"]})]}),!w&&P!=="BI"&&e.jsxs(Je,{children:[e.jsxs("div",{className:"summary-item",children:[e.jsx("span",{className:"summary-label",children:"Suma de Facturas Filtradas"}),e.jsxs("span",{className:"summary-value",children:["C$",be.facturado.toLocaleString(void 0,{minimumFractionDigits:2})]})]}),e.jsxs("div",{className:"summary-item success",children:[e.jsx("span",{className:"summary-label",children:"Total Abonado"}),e.jsxs("span",{className:"summary-value",children:["C$",be.abonado.toLocaleString(void 0,{minimumFractionDigits:2})]})]}),e.jsxs("div",{className:"summary-item danger",children:[e.jsx("span",{className:"summary-label",children:"Deuda Restante"}),e.jsxs("span",{className:"summary-value",children:["C$",be.restante.toLocaleString(void 0,{minimumFractionDigits:2})]})]})]}),w&&e.jsx(Je,{children:e.jsxs("div",{className:"summary-item success",children:[e.jsx("span",{className:"summary-label",children:"Total Egresado Bajo Filtros"}),e.jsxs("span",{className:"summary-value",children:["C$",Ar.toLocaleString(void 0,{minimumFractionDigits:2})]})]})}),!w&&e.jsxs(e.Fragment,{children:[e.jsxs(Qr,{children:[e.jsxs(q,{color:"#ef4444",bg:"#fef2f2",children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(Y,{})}),e.jsx("div",{className:"label",children:"Vencidas"}),e.jsx("div",{className:"value",children:N.venc}),e.jsx("div",{className:"sub",children:"Requieren atención urgente"})]}),e.jsxs(q,{color:"#ea580c",bg:"#fff7ed",children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(L,{})}),e.jsx("div",{className:"label",children:"Próximas a Vencer"}),e.jsx("div",{className:"value",children:N.prox}),e.jsx("div",{className:"sub",children:"En los próx. 5 días"})]}),e.jsxs(q,{color:"#3b82f6",bg:"#eff6ff",children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(L,{})}),e.jsx("div",{className:"label",children:"Pendientes"}),e.jsx("div",{className:"value",children:N.pend}),e.jsx("div",{className:"sub",children:"Sin riesgo inmediato"})]}),e.jsxs(q,{color:"#10b981",bg:"#dcfce7",children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(X,{})}),e.jsx("div",{className:"label",children:"Pagadas"}),e.jsx("div",{className:"value",children:N.pag}),e.jsx("div",{className:"sub",children:"Completadas con éxito"})]}),e.jsxs(q,{color:"#b45309",bg:"#fffbeb",children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(G,{})}),e.jsx("div",{className:"label",children:"Deuda Total"}),e.jsxs("div",{className:"value",style:{color:"#b45309",fontSize:"1.5rem"},children:["C$",N.totalDebt.toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsx("div",{className:"sub",children:"Saldo Pendiente Global"})]})]}),e.jsxs(Qe,{children:[e.jsx(Zr,{children:[{id:"PENDIENTE",label:"Por Pagar (Prox)",icon:L,color:"#3b82f6",bg:"#eff6ff",count:N.pend+N.prox},{id:"VENCIDA",label:"Vencidas",icon:Y,color:"#ef4444",bg:"#fef2f2",count:N.venc},{id:"PAGADA",label:"Pagadas",icon:X,color:"#10b981",bg:"#dcfce7",count:N.pag},{id:"BI",label:"Resumen BI",icon:ye,color:"#6366f1",bg:"#eef2ff",count:null},{id:"TODAS",label:"Todas",icon:ve,color:"#64748b",bg:"#f1f5f9",count:null}].map(r=>e.jsxs(Kr,{active:P===r.id,activeColor:r.color,activeBg:r.bg,onClick:()=>sr(r.id),children:[e.jsx(r.icon,{})," ",r.label,r.count!==null&&e.jsx("span",{className:"badge",children:r.count})]},r.id))}),e.jsxs(er,{children:[e.jsxs(rr,{children:[e.jsx(Ge,{}),e.jsx("input",{type:"text",placeholder:"Buscar proveedor o No. factura...",value:R,onChange:r=>Ne(r.target.value)})]}),e.jsxs(F,{style:{minWidth:"180px"},children:[e.jsx("label",{children:"Ordenar Por"}),e.jsxs("select",{value:W,onChange:r=>ir(r.target.value),children:[e.jsx("option",{value:"vencimiento_asc",children:"Vencen Primero (Próximas)"}),e.jsx("option",{value:"emision_desc",children:"Emitidas Reciente (Nuevas)"}),e.jsx("option",{value:"emision_asc",children:"Emitidas Antiguas (Viejas)"})]})]}),e.jsxs(F,{children:[e.jsx("label",{children:"Tipo de Compra"}),e.jsxs("select",{value:_,onChange:r=>ke(r.target.value),children:[e.jsx("option",{value:"",children:"TODAS"}),e.jsx("option",{value:"CREDITO",children:"Crédito"}),e.jsx("option",{value:"CONTADO",children:"Contado"})]})]}),e.jsxs(F,{children:[e.jsx("label",{children:"Proveedor"}),e.jsxs("select",{value:b,onChange:r=>Pe(r.target.value),children:[e.jsx("option",{value:"",children:"Todos"}),he.map(r=>e.jsx("option",{value:r.nombre,children:r.nombre},r.id_proveedor||r.id))]})]}),e.jsxs(F,{style:{minWidth:"140px"},children:[e.jsx("label",{children:"Desde"}),e.jsx("input",{type:"date",value:y,onChange:r=>_e(r.target.value)})]}),e.jsxs(F,{style:{minWidth:"140px"},children:[e.jsx("label",{children:"Hasta"}),e.jsx("input",{type:"date",value:C,onChange:r=>Te(r.target.value)})]})]})]}),Ee?e.jsxs("div",{style:{textAlign:"center",padding:"4rem",color:"#94a3b8"},children:[e.jsx(L,{className:"spin",style:{fontSize:"2rem",marginBottom:"1rem"}}),e.jsx("p",{children:"Cargando información..."})]}):P==="BI"?e.jsxs(Ze,{children:[e.jsxs(Ke,{children:[e.jsxs("h3",{children:[e.jsx(ye,{})," Resumen por Proveedor (BI)"]}),y&&C&&e.jsxs("span",{className:"date-range",children:[T(y)," - ",T(C)]})]}),e.jsxs(Se,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Proveedor"}),e.jsx("th",{style:{textAlign:"center"},children:"Facturas"}),e.jsx("th",{style:{textAlign:"right"},children:"Total Comprado"}),e.jsx("th",{style:{textAlign:"right"},children:"Pagado"}),e.jsx("th",{style:{textAlign:"right"},children:"Saldo Pendiente"})]})}),e.jsxs("tbody",{children:[$.map(r=>e.jsxs("tr",{children:[e.jsx("td",{className:"provider-name",children:r.provider}),e.jsx("td",{style:{textAlign:"center"},children:e.jsx("span",{className:"count-badge",children:r.count})}),e.jsxs("td",{className:"amount",children:["C$",r.totalAmount.toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsxs("td",{className:"amount",style:{color:"#10b981"},children:["C$",r.totalPaid.toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsxs("td",{className:"amount",style:{color:r.totalAmount-r.totalPaid>.1?"#ef4444":"#10b981"},children:["C$",(r.totalAmount-r.totalPaid).toLocaleString(void 0,{minimumFractionDigits:2})]})]},r.provider)),$.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:"5",style:{textAlign:"center",padding:"3rem",color:"#94a3b8"},children:"No hay datos para el período seleccionado."})})]}),$.length>0&&e.jsx("tfoot",{children:e.jsxs("tr",{style:{background:"#f8fafc",fontWeight:"900"},children:[e.jsx("td",{colSpan:"2",style:{textAlign:"right",textTransform:"uppercase",fontSize:"0.8rem",color:"#64748b"},children:"Totales Globales:"}),e.jsxs("td",{className:"amount",children:["C$",$.reduce((r,t)=>r+t.totalAmount,0).toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsxs("td",{className:"amount",children:["C$",$.reduce((r,t)=>r+t.totalPaid,0).toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsxs("td",{className:"amount",style:{color:"#ef4444"},children:["C$",($.reduce((r,t)=>r+t.totalAmount,0)-$.reduce((r,t)=>r+t.totalPaid,0)).toLocaleString(void 0,{minimumFractionDigits:2})]})]})})]})]}):ie.length>0?e.jsx(et,{children:ie.map(r=>{const t=r.effectiveStatus,a=wr(t),n=parseFloat(r.monto_total)||0,l=parseFloat(r.monto_abonado)||0,c=n-l,p=n>0?l/n*100:0;return e.jsxs(rt,{color:a.color,balanceColor:c>0?"#ef4444":"#10b981",children:[e.jsxs("div",{className:"card-header",children:[e.jsxs("div",{className:"provider-info",children:[e.jsxs("h3",{title:r.proveedor,children:[e.jsx(Pr,{style:{marginRight:6,color:"#94a3b8"}})," ",r.proveedor]}),e.jsxs("span",{className:"invoice-number",children:["#",r.numero_factura]})]}),e.jsx(U,{bg:a.bg,text:a.color,children:a.label})]}),e.jsxs("div",{className:"card-body",children:[e.jsxs("div",{className:"meta-row",children:[e.jsxs("span",{className:"label",children:[e.jsx(_r,{})," Emisión"]}),e.jsx("span",{className:"value",children:T(r.fecha_emision)})]}),e.jsxs("div",{className:"meta-row",children:[e.jsxs("span",{className:"label",children:[e.jsx(Y,{})," Vence"]}),e.jsx("span",{className:"value",style:{color:t==="VENCIDA"?"#ef4444":"inherit"},children:T(r.fecha_vencimiento)})]}),e.jsxs("div",{className:"meta-row",children:[e.jsxs("span",{className:"label",children:[e.jsx(ye,{})," Tipo de Compra"]}),e.jsx("span",{className:"value",children:e.jsx(U,{bg:r.tipo_compra==="CONTADO"?"#dcfce7":"#eef2ff",text:r.tipo_compra==="CONTADO"?"#16a34a":"#4f46e5",style:{padding:"0.2rem 0.5rem",fontSize:"0.7rem"},children:r.tipo_compra})})]}),e.jsxs("div",{className:"financial-block",children:[e.jsxs("div",{className:"total-row",children:[e.jsx("span",{className:"label",children:"Total a Pagar"}),e.jsxs("span",{className:"amount",children:["C$",n.toLocaleString(void 0,{minimumFractionDigits:2})]})]}),e.jsx("div",{className:"progress-bar",children:e.jsx("div",{style:{width:`${p}%`,background:a.color}})}),e.jsxs("div",{className:"balance-text",children:["Abonado: C$",l.toLocaleString(void 0,{minimumFractionDigits:2})," • ",e.jsxs("strong",{children:["Resta: C$",c.toLocaleString(void 0,{minimumFractionDigits:2})]})]})]})]}),e.jsxs("div",{className:"card-footer",style:{flexWrap:"wrap"},children:[c>0&&e.jsxs(g,{$primary:!0,style:{flex:1,justifyContent:"center"},onClick:()=>gr(r),children:[e.jsx(G,{})," Abonar"]}),e.jsxs(g,{$secondary:!0,style:{flex:1,justifyContent:"center"},onClick:()=>Cr(r),children:[e.jsx(ve,{})," Historial"]}),e.jsx(g,{$danger:!0,style:{padding:"0.75rem"},onClick:()=>{O(r),re(!0)},children:e.jsx(Ce,{})})]})]},r.id)})}):e.jsxs("div",{style:{textAlign:"center",padding:"4rem",color:"#94a3b8",border:"2px dashed #e2e8f0",borderRadius:"24px",background:"white"},children:[e.jsx(je,{style:{fontSize:"3rem",marginBottom:"1rem",opacity:.3}}),e.jsx("h3",{style:{color:"#475569"},children:"No se encontraron facturas"}),e.jsx("p",{children:"Intenta ajustar los filtros o registra una nueva."})]})]}),w&&e.jsxs(e.Fragment,{children:[e.jsx(Qe,{children:e.jsxs(er,{style:{width:"100%"},children:[e.jsxs(rr,{children:[e.jsx(Ge,{}),e.jsx("input",{type:"text",placeholder:"Buscar por proveedor, factura o referencia...",value:R,onChange:r=>Ne(r.target.value)})]}),e.jsxs(F,{children:[e.jsx("label",{children:"Método de Pago"}),e.jsxs("select",{value:Q,onChange:r=>lr(r.target.value),children:[e.jsx("option",{value:"",children:"TODOS"}),e.jsx("option",{value:"EFECTIVO",children:"Efectivo"}),e.jsx("option",{value:"TARJETA",children:"Tarjeta"}),e.jsx("option",{value:"TRANSFERENCIA",children:"Transferencia"}),e.jsx("option",{value:"CHEQUE",children:"Cheque"})]})]}),e.jsxs(F,{children:[e.jsx("label",{children:"Tipo Factura"}),e.jsxs("select",{value:_,onChange:r=>ke(r.target.value),children:[e.jsx("option",{value:"",children:"TODOS"}),e.jsx("option",{value:"CONTADO",children:"Contado"}),e.jsx("option",{value:"CREDITO",children:"Crédito"})]})]}),e.jsxs(F,{children:[e.jsx("label",{children:"Proveedor"}),e.jsxs("select",{value:b,onChange:r=>Pe(r.target.value),children:[e.jsx("option",{value:"",children:"TODOS"}),he.map(r=>e.jsx("option",{value:r.nombre,children:r.nombre},r.id_proveedor||r.id))]})]}),e.jsxs(F,{style:{minWidth:"140px"},children:[e.jsx("label",{children:"Desde"}),e.jsx("input",{type:"date",value:y,onChange:r=>_e(r.target.value)})]}),e.jsxs(F,{style:{minWidth:"140px"},children:[e.jsx("label",{children:"Hasta"}),e.jsx("input",{type:"date",value:C,onChange:r=>Te(r.target.value)})]})]})}),e.jsxs(Ze,{children:[e.jsxs(Ke,{children:[e.jsxs("h3",{children:[e.jsx(G,{})," Listado de Pagos y Abonos Efectuados"]}),(y||C)&&e.jsxs("span",{className:"date-range",children:[y?T(y):"Inicio"," - ",C?T(C):"Hoy"]})]}),Ee?e.jsxs("div",{style:{textAlign:"center",padding:"3rem",color:"#94a3b8"},children:[e.jsx(L,{className:"spin",style:{fontSize:"2rem",marginBottom:"1rem"}}),e.jsx("p",{children:"Cargando información..."})]}):e.jsx("div",{style:{overflowX:"auto"},children:e.jsxs(Se,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Fecha Abono"}),e.jsx("th",{children:"Factura"}),e.jsx("th",{children:"Proveedor"}),e.jsx("th",{children:"Método"}),e.jsx("th",{children:"Referencia / Detalle"}),e.jsx("th",{style:{textAlign:"center"},children:"Modo de Compra"}),e.jsx("th",{style:{textAlign:"center"},children:"Comprobante"}),e.jsx("th",{style:{textAlign:"right"},children:"Monto Pagado (C$)"}),e.jsx("th",{style:{textAlign:"center"},children:"Acciones"})]})}),e.jsxs("tbody",{children:[le.map(r=>e.jsxs("tr",{children:[e.jsx("td",{children:T(r.fecha_abono)}),e.jsx("td",{children:e.jsxs("b",{children:["#",r.numero_factura]})}),e.jsx("td",{children:r.proveedor}),e.jsx("td",{children:e.jsx(U,{bg:"#f1f5f9",text:"#475569",children:r.metodo_pago})}),e.jsx("td",{children:r.referencia||"-"}),e.jsx("td",{style:{textAlign:"center"},children:e.jsx(U,{bg:r.tipo_compra==="CONTADO"?"#dcfce7":"#eef2ff",text:r.tipo_compra==="CONTADO"?"#16a34a":"#4f46e5",children:r.tipo_compra})}),e.jsx("td",{style:{textAlign:"center"},children:r.comprobante_url?e.jsx("a",{href:ge(r.comprobante_url),target:"_blank",rel:"noopener noreferrer",style:{color:"#ef4444",fontSize:"1.2rem",display:"inline-flex",alignItems:"center"},title:"Ver Comprobante PDF",children:e.jsx(qe,{})}):e.jsx("span",{style:{color:"#94a3b8",fontSize:"0.85rem"},children:"—"})}),e.jsxs("td",{className:"amount",style:{color:"#10b981"},children:["C$",parseFloat(r.monto).toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsx("td",{style:{textAlign:"center"},children:e.jsxs("div",{style:{display:"flex",gap:"0.5rem",justifyContent:"center"},children:[e.jsx(g,{$secondary:!0,title:"Editar abono",style:{padding:"0.4rem 0.6rem",fontSize:"0.8rem",borderRadius:"8px"},onClick:()=>{const t=j.find(a=>a.id===r.id_factura);t&&O(t),Le({id:r.abono_id,monto:r.monto,metodo_pago:r.metodo_pago,referencia:r.referencia,comprobante_url:r.comprobante_url})},children:e.jsx(Ue,{})}),e.jsx(g,{$danger:!0,title:"Eliminar abono",style:{padding:"0.4rem 0.6rem",fontSize:"0.8rem",borderRadius:"8px"},onClick:()=>Ve(r.abono_id),children:e.jsx(Ce,{})})]})})]},r.abono_id)),le.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:"9",style:{textAlign:"center",padding:"3rem",color:"#94a3b8"},children:"No hay registro de abonos o pagos en este período."})})]})]})})]})]}),cr&&e.jsx(V,{onClick:()=>Z(!1),children:e.jsxs(H,{onClick:r=>r.stopPropagation(),children:[e.jsx(me,{onClick:()=>Z(!1),children:e.jsx(J,{})}),e.jsx("h2",{children:"Registrar Factura"}),e.jsxs("form",{onSubmit:vr,children:[e.jsxs(h,{children:[e.jsx("label",{children:"Proveedor"}),e.jsxs("select",{required:!0,value:m.proveedor,onChange:r=>v({...m,proveedor:r.target.value}),children:[e.jsx("option",{value:"",children:"Seleccione un proveedor..."}),he.map(r=>e.jsx("option",{value:r.nombre,children:r.nombre},r.id_proveedor||r.id))]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"},children:[e.jsxs(h,{children:[e.jsx("label",{children:"No. Factura"}),e.jsx("input",{required:!0,type:"text",value:m.numero_factura,onChange:r=>v({...m,numero_factura:r.target.value}),placeholder:"Ej: F-001"})]}),e.jsxs(h,{children:[e.jsx("label",{children:"Monto Total (C$)"}),e.jsx("input",{required:!0,type:"number",step:"0.01",value:m.monto_total,onChange:r=>v({...m,monto_total:r.target.value}),placeholder:"0.00"})]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"},children:[e.jsxs(h,{children:[e.jsx("label",{children:"Fecha Emisión"}),e.jsx("input",{required:!0,type:"date",value:m.fecha_emision,onChange:r=>v({...m,fecha_emision:r.target.value})})]}),e.jsxs(h,{children:[e.jsx("label",{children:"Fecha Vencimiento"}),e.jsx("input",{required:!0,type:"date",value:m.fecha_vencimiento,onChange:r=>v({...m,fecha_vencimiento:r.target.value})})]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",background:"#f8fafc",padding:"1rem",borderRadius:"12px",marginBottom:"1.25rem",border:"1px solid #e2e8f0"},children:[e.jsxs(h,{style:{marginBottom:0},children:[e.jsx("label",{children:"Tipo de Compra"}),e.jsxs("select",{required:!0,value:m.tipo_compra,onChange:r=>v({...m,tipo_compra:r.target.value}),children:[e.jsx("option",{value:"CREDITO",children:"A Crédito"}),e.jsx("option",{value:"CONTADO",children:"De Contado"})]})]}),m.tipo_compra==="CONTADO"&&e.jsxs(h,{style:{marginBottom:0},children:[e.jsx("label",{children:"Método de Pago"}),e.jsxs("select",{required:!0,value:m.metodo_pago,onChange:r=>v({...m,metodo_pago:r.target.value}),children:[e.jsx("option",{value:"EFECTIVO",children:"Efectivo"}),e.jsx("option",{value:"TARJETA",children:"Tarjeta"}),e.jsx("option",{value:"TRANSFERENCIA",children:"Transferencia"}),e.jsx("option",{value:"CHEQUE",children:"Cheque"})]})]})]}),m.tipo_compra==="CONTADO"&&e.jsxs(e.Fragment,{children:[e.jsxs(h,{children:[e.jsx("label",{children:"Referencia de Pago (Transferencia, Cheque, etc.)"}),e.jsx("input",{type:"text",value:m.referencia,onChange:r=>v({...m,referencia:r.target.value}),placeholder:"Opcional..."})]}),e.jsxs(h,{children:[e.jsx("label",{children:"Comprobante de Pago (Imagen o PDF)"}),e.jsxs(Fe,{children:[e.jsx(we,{className:"upload-icon"}),ae?e.jsx("div",{className:"file-details",children:E?"Procesando archivo...":`✓ PDF Generado: ${D.name}`}):e.jsx("div",{className:"file-details",children:"Haz clic o arrastra una imagen o PDF"}),e.jsx("input",{type:"file",accept:"image/*,application/pdf",onChange:fe,disabled:E})]})]})]}),e.jsxs(h,{children:[e.jsx("label",{children:"Notas (Opcional)"}),e.jsx("textarea",{rows:"3",value:m.notes,onChange:r=>v({...m,notas:r.target.value}),placeholder:"Detalles extra..."})]}),e.jsxs(g,{$primary:!0,type:"submit",disabled:E,style:{width:"100%",padding:"1rem",fontSize:"1rem"},children:[e.jsx(X,{})," Guardar Factura"]})]})]})}),dr&&e.jsx(V,{onClick:()=>K(!1),children:e.jsxs(H,{onClick:r=>r.stopPropagation(),style:{maxWidth:"450px"},children:[e.jsx(me,{onClick:()=>K(!1),children:e.jsx(J,{})}),e.jsx("h2",{children:"Registrar Abono"}),e.jsxs("div",{style:{background:"#f1f5f9",padding:"1rem",borderRadius:"12px",marginBottom:"1.5rem"},children:[e.jsxs("div",{style:{fontSize:"0.9rem",color:"#64748b",marginBottom:"0.25rem"},children:["Factura #",s==null?void 0:s.numero_factura]}),e.jsxs("div",{style:{fontSize:"1.5rem",fontWeight:"800",color:"#0f172a"},children:["Deuda: C$",((parseFloat(s==null?void 0:s.monto_total)||0)-(parseFloat(s==null?void 0:s.monto_abonado)||0)).toFixed(2)]})]}),e.jsxs("form",{onSubmit:br,children:[e.jsxs(h,{children:[e.jsx("label",{children:"Monto a Abonar (C$)"}),e.jsx("input",{required:!0,type:"number",step:"0.01",autoFocus:!0,placeholder:"0.00",value:A.amount,onChange:r=>oe({...A,amount:r.target.value})})]}),e.jsxs(h,{children:[e.jsx("label",{children:"Método de Pago"}),e.jsxs("select",{required:!0,value:A.method,onChange:r=>oe({...A,method:r.target.value}),children:[e.jsx("option",{value:"EFECTIVO",children:"Efectivo"}),e.jsx("option",{value:"TARJETA",children:"Tarjeta"}),e.jsx("option",{value:"TRANSFERENCIA",children:"Transferencia"}),e.jsx("option",{value:"CHEQUE",children:"Cheque"})]})]}),e.jsxs(h,{children:[e.jsx("label",{children:"Referencia / Detalle (Opcional)"}),e.jsx("input",{type:"text",placeholder:"Ej: Transferencia #1234, Pago en efectivo...",value:A.reference,onChange:r=>oe({...A,reference:r.target.value})})]}),e.jsxs(h,{children:[e.jsx("label",{children:"Adjuntar Comprobante (Imagen o PDF)"}),e.jsxs(Fe,{children:[e.jsx(we,{className:"upload-icon"}),ae?e.jsx("div",{className:"file-details",children:E?"Procesando archivo...":`✓ PDF Generado: ${D.name}`}):e.jsx("div",{className:"file-details",children:"Sube el comprobante de pago"}),e.jsx("input",{type:"file",accept:"image/*,application/pdf",onChange:fe,disabled:E})]})]}),e.jsxs(g,{$primary:!0,type:"submit",disabled:E,style:{width:"100%",padding:"1rem"},children:[e.jsx(G,{})," Confirmar Pago"]})]})]})}),mr&&e.jsx(V,{onClick:()=>ee(!1),children:e.jsxs(H,{onClick:r=>r.stopPropagation(),style:{maxWidth:"450px"},children:[e.jsx(me,{onClick:()=>ee(!1),children:e.jsx(J,{})}),e.jsx("h2",{children:"Editar Abono"}),e.jsxs("div",{style:{background:"#f1f5f9",padding:"1rem",borderRadius:"12px",marginBottom:"1.5rem"},children:[e.jsxs("div",{style:{fontSize:"0.9rem",color:"#64748b",marginBottom:"0.25rem"},children:["Editando abono en Factura #",s==null?void 0:s.numero_factura]}),e.jsxs("div",{style:{fontSize:"1.2rem",fontWeight:"800",color:"#0f172a"},children:["Proveedor: ",s==null?void 0:s.proveedor]})]}),e.jsxs("form",{onSubmit:jr,children:[e.jsxs(h,{children:[e.jsx("label",{children:"Monto del Abono (C$)"}),e.jsx("input",{required:!0,type:"number",step:"0.01",value:S.amount,onChange:r=>ne({...S,amount:r.target.value})})]}),e.jsxs(h,{children:[e.jsx("label",{children:"Método de Pago"}),e.jsxs("select",{required:!0,value:S.method,onChange:r=>ne({...S,method:r.target.value}),children:[e.jsx("option",{value:"EFECTIVO",children:"Efectivo"}),e.jsx("option",{value:"TARJETA",children:"Tarjeta"}),e.jsx("option",{value:"TRANSFERENCIA",children:"Transferencia"}),e.jsx("option",{value:"CHEQUE",children:"Cheque"})]})]}),e.jsxs(h,{children:[e.jsx("label",{children:"Referencia / Detalle (Opcional)"}),e.jsx("input",{type:"text",value:S.reference,onChange:r=>ne({...S,reference:r.target.value})})]}),e.jsxs(h,{children:[e.jsx("label",{children:"Cambiar/Reemplazar Comprobante (Imagen o PDF)"}),e.jsxs(Fe,{children:[e.jsx(we,{className:"upload-icon"}),ae?e.jsx("div",{className:"file-details",children:E?"Procesando archivo...":`✓ PDF Generado: ${D.name}`}):e.jsx("div",{className:"file-details",children:"Selecciona un archivo si deseas reemplazarlo"}),e.jsx("input",{type:"file",accept:"image/*,application/pdf",onChange:fe,disabled:E})]}),(k==null?void 0:k.comprobante_url)&&!ae&&e.jsxs("div",{style:{marginTop:"0.5rem",fontSize:"0.85rem"},children:["Tiene comprobante: ",e.jsx("a",{href:ge(k.comprobante_url),target:"_blank",rel:"noopener noreferrer",style:{color:"#ef4444",fontWeight:"bold"},children:"Ver actual"})]})]}),e.jsxs(g,{$primary:!0,type:"submit",disabled:E,style:{width:"100%",padding:"1rem"},children:[e.jsx(X,{})," Guardar Cambios"]})]})]})}),pr&&e.jsx(V,{onClick:()=>re(!1),children:e.jsxs(H,{style:{maxWidth:"400px",textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"3rem",color:"#ef4444",marginBottom:"1rem"},children:e.jsx(Y,{})}),e.jsx("h2",{children:"¿Eliminar Factura?"}),e.jsxs("p",{style:{color:"#64748b",marginBottom:"2rem"},children:["Estás a punto de eliminar la factura ",e.jsxs("b",{children:["#",s==null?void 0:s.numero_factura]}),". Se borrarán también todos sus comprobantes y abonos. Esta acción no se puede deshacer."]}),e.jsxs("div",{style:{display:"flex",gap:"1rem"},children:[e.jsx(g,{$secondary:!0,onClick:()=>re(!1),style:{flex:1},children:"Cancelar"}),e.jsx(g,{$danger:!0,onClick:yr,style:{flex:1},children:"Sí, Eliminar"})]})]})}),hr&&e.jsx(V,{onClick:()=>ue(!1),children:e.jsxs(H,{onClick:r=>r.stopPropagation(),style:{maxWidth:"650px"},children:[e.jsx(me,{onClick:()=>ue(!1),children:e.jsx(J,{})}),e.jsx("h2",{children:"Historial de Abonos"}),e.jsxs("div",{style:{background:"#f1f5f9",padding:"1rem",borderRadius:"12px",marginBottom:"1.5rem",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("div",{children:[e.jsxs("div",{style:{fontSize:"0.9rem",color:"#64748b"},children:["Factura #",s==null?void 0:s.numero_factura]}),e.jsx("div",{style:{fontSize:"1.1rem",fontWeight:"800",color:"#0f172a"},children:s==null?void 0:s.proveedor})]}),e.jsxs("div",{style:{textAlign:"right"},children:[e.jsx("div",{style:{fontSize:"0.9rem",color:"#64748b"},children:"Abonado Total"}),e.jsxs("div",{style:{fontSize:"1.2rem",fontWeight:"800",color:"#10b981"},children:["C$",(parseFloat(s==null?void 0:s.monto_abonado)||0).toLocaleString(void 0,{minimumFractionDigits:2})]})]})]}),ur?e.jsxs("div",{style:{textAlign:"center",padding:"2rem",color:"#94a3b8"},children:[e.jsx(L,{className:"spin",style:{fontSize:"1.5rem",marginBottom:"1rem"}}),e.jsx("p",{children:"Cargando historial..."})]}):xe.length>0?e.jsx("div",{style:{overflowX:"auto"},children:e.jsxs(Se,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Fecha"}),e.jsx("th",{children:"Método"}),e.jsx("th",{children:"Referencia"}),e.jsx("th",{style:{textAlign:"center"},children:"Comprobante"}),e.jsx("th",{style:{textAlign:"right"},children:"Monto"}),e.jsx("th",{style:{textAlign:"center"},children:"Acciones"})]})}),e.jsx("tbody",{children:xe.map((r,t)=>e.jsxs("tr",{children:[e.jsx("td",{children:T(r.fecha)}),e.jsx("td",{children:e.jsx(U,{bg:"#f1f5f9",text:"#475569",children:r.metodo_pago})}),e.jsx("td",{children:r.referencia||"-"}),e.jsx("td",{style:{textAlign:"center"},children:r.comprobante_url?e.jsx("a",{href:ge(r.comprobante_url),target:"_blank",rel:"noopener noreferrer",style:{color:"#ef4444",fontSize:"1.2rem",display:"inline-flex",alignItems:"center"},title:"Ver Comprobante PDF",children:e.jsx(qe,{})}):e.jsx("span",{style:{color:"#94a3b8",fontSize:"0.85rem"},children:"—"})}),e.jsxs("td",{className:"amount",style:{color:"#10b981"},children:["C$",parseFloat(r.monto).toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsx("td",{style:{textAlign:"center"},children:e.jsxs("div",{style:{display:"flex",gap:"0.4rem",justifyContent:"center"},children:[e.jsx(g,{$secondary:!0,title:"Editar abono",style:{padding:"0.4rem 0.6rem",fontSize:"0.8rem",borderRadius:"8px"},onClick:()=>Le(r),children:e.jsx(Ue,{})}),e.jsx(g,{$danger:!0,title:"Eliminar abono",style:{padding:"0.4rem 0.6rem",fontSize:"0.8rem",borderRadius:"8px"},onClick:()=>Ve(r.id,s==null?void 0:s.id),children:e.jsx(Ce,{})})]})})]},r.id||t))})]})}):e.jsxs("div",{style:{textAlign:"center",padding:"3rem",color:"#94a3b8",border:"1px dashed #cbd5e1",borderRadius:"16px"},children:[e.jsx(G,{style:{fontSize:"2rem",marginBottom:"1rem",opacity:.5}}),e.jsx("p",{children:"No existen abonos registrados para esta factura."})]})]})})]})};export{lt as default};

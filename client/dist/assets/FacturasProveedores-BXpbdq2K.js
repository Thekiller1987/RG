import{r as n,j as e,I as Ge,X as Xr,Y as Kr,aP as qe,aQ as fe,ah as V,aa as H,ag as J,aR as Ue,$ as ur,aS as Zr,aN as et,a4 as ke,ac as oe,a7 as Te,am as Pe,k as Z,aT as fr,J as xr,aU as hr,aV as Qe,s as u,ae as $e,aW as rt,aX as tt,aj as at,a8 as ot,t as Fr,V as it}from"./vendor-Cig3sC1l.js";import{u as nt,I as st,J as lt,K as dt,L as gr,M as ct,N as mt,O as pt,P as ut,Q as ft,R as xt}from"./index-DGmyou13.js";import{r as br}from"./searchEngine-BMYcElFi.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-Dyhe4TSt.js";const X=()=>new Date().toLocaleDateString("sv-SE",{timeZone:"America/Managua"}),I=a=>{if(!a)return"—";const g=new Date(a.includes("T")?a:`${a}T12:00:00`);return new Intl.DateTimeFormat("es-NI",{timeZone:"America/Managua",day:"2-digit",month:"2-digit",year:"numeric"}).format(g)},ze=Fr`from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); }`,ht=Fr`from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; }`,gt=u.div`
    padding: clamp(1rem, 3vw, 2.5rem); 
    background: #f8fafc;
    min-height: 100vh; 
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    animation: ${ze} 0.5s ease-out;
`,bt=u.div`
    display: flex; 
    justify-content: space-between; 
    align-items: flex-start; 
    margin-bottom: 2rem; 
    flex-wrap: wrap; 
    gap: 1.5rem;
`,jt=u.div`
    display: flex;
    flex-direction: column;
`,yt=u.h1`
    font-size: clamp(1.8rem, 2.5vw, 2.2rem); 
    color: #0f172a; 
    display: flex; 
    align-items: center; 
    gap: 0.75rem; 
    margin: 0; 
    font-weight: 900;
    letter-spacing: -0.03em;
    
    svg { color: #0f172a; }
`,vt=u.p`
    color: #64748b;
    margin: 0.5rem 0 0 0;
    font-size: 1rem;
    font-weight: 500;
`,Ct=u.div`
    display: flex; 
    gap: 0.75rem;
    flex-wrap: wrap;
    
    @media (max-width: 600px) {
        width: 100%;
        button, a { flex: 1; justify-content: center; }
    }
`,x=u.button`
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
    
    ${a=>a.$primary&&$e`
        background: #0f172a;
        color: white;
        box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.3);
        &:hover { background: #1e293b; transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.4); }
    `}

    ${a=>a.$secondary&&$e`
        background: white;
        color: #334155;
        border: 1px solid #e2e8f0;
        &:hover { background: #f1f5f9; border-color: #cbd5e1; transform: translateY(-1px); }
    `}

    ${a=>a.$danger&&$e`
        background: #fee2e2;
        color: #ef4444;
        &:hover { background: #fecaca; transform: scale(1.05); }
    `}

    ${a=>a.$success&&$e`
        background: #dcfce7;
        color: #15803d;
        &:hover { background: #bbf7d0; transform: translateY(-1px); }
    `}

    &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
`,wt=u(it)`
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
`,_t=u.div`
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); 
    gap: 1.5rem; 
    margin-bottom: 2.5rem;
`,me=u.div`
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
        background: ${a=>a.color}; 
    }

    .icon-wrapper {
        width: 44px; height: 44px; border-radius: 12px; background: ${a=>a.bg}; 
        display: flex; align-items: center; justify-content: center; 
        color: ${a=>a.color}; font-size: 1.25rem; margin-bottom: 0.75rem;
    }

    .label { font-size: 0.8rem; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    .value { font-size: 1.8rem; font-weight: 800; color: #0f172a; margin: 0.25rem 0; letter-spacing: -0.03em; }
    .sub { font-size: 0.85rem; color: #64748b; font-weight: 500; }
`,jr=u.div`
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
    animation: ${ze} 0.4s ease-out;

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
`,G=u.div`
    position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
    background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(4px); 
    display: flex; justify-content: center; align-items: center; z-index: 1200; 
    animation: ${ze} 0.2s;
`,K=u.div`
    background: white; padding: 2.5rem; border-radius: 24px; 
    width: 95%; max-width: ${a=>a.$large?"700px":"550px"}; 
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); 
    animation: ${ht} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    max-height: 90vh; overflow-y: auto;
    position: relative;
    
    h2 { margin: 0 0 1.5rem 0; color: #0f172a; font-size: 1.6rem; font-weight: 800; letter-spacing: -0.025em; }

    .desktop-history { display: block; }
    .mobile-history { display: none; }

    @media (max-width: 640px) {
        padding: 1.25rem;
        border-radius: 18px;
        width: 100%;
        max-height: 94vh;
        h2 { font-size: 1.3rem; margin-bottom: 1rem; }
        .desktop-history { display: none; }
        .mobile-history { display: flex; }
    }
`,p=u.div`
    margin-bottom: 1.25rem;
    min-width: 0;
    label { display: block; font-size: 0.92rem; color: #475569; margin-bottom: 0.5rem; font-weight: 600; }
    input, select, textarea { 
        width: 100%; box-sizing: border-box; padding: 0.9rem 1rem; border: 1px solid #cbd5e1; border-radius: 12px; 
        font-size: 1rem; color: #0f172a; background: #fff; transition: all 0.2s; 
        &:focus { outline: none; border-color: #0f172a; box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.08); }
        &::placeholder { color: #94a3b8; }
    }
`,pe=u.button`
    position: absolute; top: 1.5rem; right: 1.5rem; 
    background: #f1f5f9; border-radius:50%; width:32px; height:32px; 
    border: none; color: #64748b; font-size: 1rem; cursor: pointer; display:grid; place-items:center;
    transition: all 0.2s;
    &:hover { color: #ef4444; background: #fee2e2; }
`,yr=u.div`
    background: white; padding: 1.25rem; border-radius: 20px;
    border: 1px solid #e2e8f0; display: flex; flex-direction: column; 
    gap: 1.25rem; margin-bottom: 2rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.01);
`,Ft=u.div`
    display: flex; gap: 0.75rem; overflow-x: auto; padding-bottom: 0.5rem;
    border-bottom: 1px solid #f1f5f9;
    &::-webkit-scrollbar { height: 4px; }
    &::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
`,St=u.button`
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
`,vr=u.div`
    background: white; border-radius: 24px; border: 1px solid #e2e8f0; overflow: hidden;
    animation: ${ze} 0.4s ease-out; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
`,Ye=u.table`
    width: 100%; border-collapse: collapse; text-align: left;
    th { background: #f8fafc; padding: 1rem 1.5rem; font-size: 0.85rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #f1f5f9; }
    td { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; color: #334155; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #fbfcfd; }
    .provider-name { font-weight: 800; color: #0f172a; }
    .amount { font-family: 'Inter', sans-serif; font-weight: 700; text-align: right; }
    .count-badge { background: #e2e8f0; color: #475569; padding: 2px 8px; border-radius: 6px; font-weight: 800; font-size: 0.8rem; }
`,Cr=u.div`
    padding: 1.5rem 2rem; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;
    h3 { margin: 0; font-size: 1.25rem; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 0.75rem; }
    .date-range { font-size: 0.9rem; color: #64748b; font-weight: 600; background: #f1f5f9; padding: 0.4rem 1rem; border-radius: 99px; }
`,wr=u.div`
    display: flex; flex-wrap: wrap; gap: 1rem; justify-content: space-between;
`,_r=u.div`
    position: relative; min-width: 250px; flex: 2;
    svg { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #94a3b8; }
    input {
        width: 100%; padding: 0.75rem 1rem 0.75rem 2.8rem;
        border: 1px solid #e2e8f0; border-radius: 12px; font-size: 0.95rem;
        &:focus { outline: none; border-color: #0f172a; box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.05); }
    }
`,T=u.div`
    min-width: 130px; flex: 1;
    display: flex; flex-direction: column; gap: 0.4rem;
    label { font-size: 0.8rem; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    select, input {
        width: 100%; padding: 0.7rem 1rem; border: 1px solid #e2e8f0; border-radius: 12px; 
        font-size: 0.92rem; background: #fff; color: #334155;
        &:focus { border-color: #0f172a; outline: none; }
    }
`,Dt=u.div`
    display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1.5rem;
`,Et=u.div`
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
    .balance-text strong { color: ${a=>a.balanceColor}; font-weight: 800; }

    .card-footer {
        padding: 1rem 1.5rem; background: #f8fafc; border-top: 1px solid #f1f5f9;
        display: flex; gap: 0.75rem;
    }
`,ie=u.span`
    padding: 0.4rem 1rem; border-radius: 99px; font-size: 0.75rem; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase;
    background: ${a=>a.bg}; color: ${a=>a.text}; box-shadow: 0 1px 2px rgba(0,0,0,0.05);
`,At=({info:a,onClose:g})=>a.show?e.jsx(G,{onClick:g,children:e.jsxs(K,{style:{maxWidth:"400px",textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"3rem",marginBottom:"1rem",color:a.type==="error"?"#ef4444":a.type==="success"?"#16a34a":"#0f172a"},children:a.type==="error"?e.jsx(Z,{style:{border:"3px solid",borderRadius:"50%",padding:5}}):a.type==="success"?e.jsx(H,{}):e.jsx(fe,{})}),e.jsx("h2",{children:a.title}),e.jsx("p",{style:{color:"#64748b",lineHeight:1.6,marginBottom:"2rem"},children:a.message}),e.jsx(x,{$primary:!0,onClick:g,style:{margin:"0 auto",width:"100%"},children:"Entendido"})]})}):null,ue=u.div`
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
`,It=()=>{const{token:a}=nt(),[g,Re]=n.useState([]),[P,Ie]=n.useState([]),[ee,xe]=n.useState(!1),[Oe,$]=n.useState(0),[_,O]=n.useState("PENDIENTE"),[j,Sr]=n.useState("vencimiento_asc"),[re,Je]=n.useState(""),[b,Xe]=n.useState(""),[F,Ke]=n.useState(""),[S,Ze]=n.useState(""),[M,er]=n.useState(""),[he,Dr]=n.useState(""),[rr,tr]=n.useState({show:!1,title:"",message:"",type:"info"}),[Er,ge]=n.useState(!1),[Ar,be]=n.useState(!1),[Nr,je]=n.useState(!1),[kr,ne]=n.useState(!1),[Tr,ye]=n.useState(!1),[Pr,Me]=n.useState(!1),[D,ar]=n.useState(!1),[$r,or]=n.useState(!1),[ve,Ce]=n.useState([]),[ir,nr]=n.useState([]),[i,q]=n.useState(null),[B,zr]=n.useState(null),[se,U]=n.useState(null),[z,sr]=n.useState(!1),[y,Q]=n.useState({base64:null,name:null}),[we,le]=n.useState(null),[te,lr]=n.useState(!1),[W,de]=n.useState({base64:null,name:null}),[l,v]=n.useState({proveedor:"",numero_factura:"",fecha_emision:X(),fecha_vencimiento:"",monto_total:"",notas:"",tipo_compra:"CREDITO",metodo_pago:"EFECTIVO",referencia:""}),[d,E]=n.useState({proveedor:"",numero_factura:"",fecha_emision:X(),fecha_vencimiento:"",monto_total:"",notas:"",tipo_compra:"CREDITO",metodo_pago:"EFECTIVO"}),[A,_e]=n.useState({amount:"",reference:"",method:"EFECTIVO"}),[N,Fe]=n.useState({amount:"",reference:"",method:"EFECTIVO"}),[Rr,dr]=n.useState({show:!1,url:null,title:"",subtitle:"",isPdf:!1}),ce=r=>{if(!r)return!1;const t=String(r).toLowerCase();return t.includes(".pdf")||t.startsWith("data:application/pdf")},ae=(r,t="Documento",o="")=>{if(!r)return;const s=Ir(r),m=ce(s);dr({show:!0,url:s,title:t,subtitle:o,isPdf:m})},h=(r,t,o="info")=>{tr({show:!0,title:r,message:t,type:o})},cr=r=>new Promise((t,o)=>{if(!r)return t({base64:null,name:null});if(r.size>15*1024*1024)return o(new Error("El archivo supera los 15MB. Por favor sube un archivo más liviano para almacenarlo en la base de datos."));const s=r.type==="application/pdf"||r.name.toLowerCase().endsWith(".pdf"),m=r.type.startsWith("image/")||/\.(jpg|jpeg|png|webp|bmp|gif|heic|heif)$/i.test(r.name);if(s){const c=new FileReader;c.readAsDataURL(r),c.onload=()=>{const f=(r.size/1024).toFixed(0);t({base64:c.result,name:r.name,type:"pdf",sizeInfo:`${f} KB (PDF)`})},c.onerror=f=>o(f);return}if(m){const c=new FileReader;c.readAsDataURL(r),c.onload=f=>{const C=new Image;C.src=f.target.result,C.onload=()=>{let w=C.width,k=C.height;(w>1280||k>1280)&&(w>k?(k=Math.round(k*1280/w),w=1280):(w=Math.round(w*1280/k),k=1280));const L=document.createElement("canvas");L.width=w,L.height=k;const He=L.getContext("2d");He.imageSmoothingEnabled=!0,He.imageSmoothingQuality="high",He.drawImage(C,0,0,w,k);let Ne=L.toDataURL("image/webp",.75),pr=".webp";Ne.startsWith("data:image/webp")||(Ne=L.toDataURL("image/jpeg",.75),pr=".jpg");const Qr=`${(r.name.substring(0,r.name.lastIndexOf("."))||"comprobante").replace(/[^a-z0-9]/gi,"_")}${pr}`,Yr=(r.size/1024).toFixed(0),Jr=Math.round(Ne.length*3/4/1024);t({base64:Ne,name:Qr,type:"image",sizeInfo:`${Yr} KB → ${Jr} KB`})},C.onerror=()=>o(new Error("No se pudo procesar la imagen cargada."))},c.onerror=f=>o(f);return}o(new Error("Formato no soportado. Sube una Imagen (JPG, PNG, WebP) o un archivo PDF."))}),Be=async r=>{const t=r.target.files[0];if(t){sr(!0),U(t);try{const o=await cr(t);Q(o)}catch(o){console.error(o),h("Archivo inválido",o.message||"No se pudo procesar el archivo.","error"),U(null),Q({base64:null,name:null})}finally{sr(!1)}}},mr=async r=>{const t=r.target.files[0];if(t){lr(!0),le(t);try{const o=await cr(t);de(o)}catch(o){console.error(o),h("Archivo inválido",o.message||"No se pudo procesar el archivo.","error"),le(null),de({base64:null,name:null})}finally{lr(!1)}}},Ir=r=>{if(!r)return null;if(r.startsWith("http")||r.startsWith("data:"))return r;let t=r;return r.startsWith("/uploads")?t="/api"+r:r.startsWith("uploads")&&(t="/api/"+r),`${"https://sistema.multirepuestosrg.com/api".replace(/\/api$/,"")}${t.startsWith("/")?"":"/"}${t}`};n.useEffect(()=>{a&&(async()=>{xe(!0);try{const t={};F&&(t.startDate=F),S&&(t.endDate=S),b&&(t.proveedor=b);const o=await st(a,Object.keys(t).length?t:void 0),s=Array.isArray(o)?o:(o==null?void 0:o.data)||[];Re(s);const m=await lt(a),c=Array.isArray(m)?m:(m==null?void 0:m.data)||[];if(Ie(c),D){const f=await dt(a,Object.keys(t).length?t:void 0);nr(Array.isArray(f)?f:(f==null?void 0:f.data)||[])}}catch(t){console.error("Error cargando datos:",t)}finally{xe(!1)}})()},[a,Oe,F,S,b,D]);const Or=r=>{q(r),_e({amount:"",reference:"",method:"EFECTIVO"}),U(null),Q({base64:null,name:null}),be(!0)},Mr=async r=>{if(r.preventDefault(),!i||!A.amount)return;const t=parseFloat(A.amount),o=(parseFloat(i.monto_total)||0)-(parseFloat(i.monto_abonado)||0);if(t<=0)return h("Error","El monto debe ser mayor a cero.","error");if(t>o+.01)return h("Error","El monto excede la deuda pendiente.","error");const m=t>=o-.1?"PAGADA":i.estado;try{await ut(i.id,{amount:t,reference:A.reference,method:A.method,status:m,comprobante_base64:y.base64,comprobante_name:y.name},a),$(c=>c+1),be(!1),h("Pago Registrado",`Se registró el abono correctamente. Estado: ${m}`,"success")}catch(c){console.error(c),h("Error","No se pudo registrar el pago. Intente nuevamente.","error")}},We=r=>{zr(r),Fe({amount:r.monto,reference:r.referencia||"",method:r.metodo_pago}),U(null),Q({base64:null,name:null}),je(!0)},Br=async r=>{if(r.preventDefault(),!B||!N.amount)return;const t=parseFloat(N.amount);if(t<=0)return h("Error","El monto debe ser mayor a cero.","error");try{if(await ft(B.id,{amount:t,method:N.method,reference:N.reference,comprobante_base64:y.base64,comprobante_name:y.name},a),$(o=>o+1),je(!1),i){const o=await gr(i.id,a);Ce(Array.isArray(o)?o:(o==null?void 0:o.data)||[]);const s=t-parseFloat(B.monto);q(m=>({...m,monto_abonado:parseFloat(m.monto_abonado)+s}))}h("Abono Modificado","El abono se editó y recalculó de forma exitosa.","success")}catch(o){console.error(o),h("Error","No se pudo actualizar el abono.","error")}},Wr=async r=>{if(r.preventDefault(),!l.proveedor)return h("Falta Proveedor","Seleccione un proveedor.","warning");try{await mt({...l,comprobante_base64:y.base64,comprobante_name:y.name,factura_base64:W.base64,factura_name:W.name},a),$(t=>t+1),ge(!1),v({proveedor:"",numero_factura:"",fecha_emision:X(),fecha_vencimiento:"",monto_total:"",notas:"",tipo_compra:"CREDITO",metodo_pago:"EFECTIVO",referencia:""}),U(null),Q({base64:null,name:null}),le(null),de({base64:null,name:null}),h("Guardado","La factura ha sido registrada exitosamente.","success")}catch{h("Error","Error al guardar factura.","error")}},Lr=r=>{q(r),E({proveedor:r.proveedor||"",numero_factura:r.numero_factura||"",fecha_emision:r.fecha_emision?r.fecha_emision.split("T")[0]:X(),fecha_vencimiento:r.fecha_vencimiento?r.fecha_vencimiento.split("T")[0]:"",monto_total:r.monto_total||"",notas:r.notas||"",tipo_compra:r.tipo_compra||"CREDITO",metodo_pago:r.metodo_pago||"EFECTIVO"}),le(null),de({base64:null,name:null}),ne(!0)},Vr=async r=>{if(r.preventDefault(),!!i){if(!d.proveedor)return h("Falta Proveedor","Seleccione un proveedor.","warning");try{await pt(i.id,{...d,factura_base64:W.base64,factura_name:W.name},a),$(t=>t+1),ne(!1),h("Factura Actualizada","Los datos de la factura se actualizaron correctamente.","success")}catch(t){console.error(t),h("Error","No se pudo actualizar la factura.","error")}}},Hr=async()=>{if(i)try{await xt(i.id,a),$(r=>r+1),ye(!1),h("Eliminada","La factura fue eliminada del sistema.","success")}catch{h("Error","No se pudo eliminar la factura.","error")}},Gr=async r=>{q(r),Me(!0),or(!0),Ce([]);try{const t=await gr(r.id,a);Ce(Array.isArray(t)?t:(t==null?void 0:t.data)||[])}catch{h("Error","No se pudo cargar el historial de abonos.","error")}finally{or(!1)}},Le=async(r,t=null)=>{if(window.confirm("¿Eliminar este abono? El monto se descontará del total abonado en la factura."))try{if(await ct(r,a),Ce(o=>o.filter(s=>s.id!==r)),nr(o=>o.filter(s=>s.abono_id!==r)),i){const o=ve.find(s=>s.id===r);o&&q(s=>({...s,monto_abonado:Math.max(0,parseFloat(s.monto_abonado)-parseFloat(o.monto))}))}$(o=>o+1),h("Abono Eliminado","El abono fue eliminado y la factura fue actualizada.","success")}catch{h("Error","No se pudo eliminar el abono. Intenta nuevamente.","error")}},Se=n.useCallback(r=>{const t=parseFloat(r.monto_total)||0,o=parseFloat(r.monto_abonado)||0;if(t>0&&o>=t-.1)return"PAGADA";if(!r.fecha_vencimiento)return"PENDIENTE";const s=new Date;s.setHours(0,0,0,0);let m=r.fecha_vencimiento;m&&m.includes("T")&&(m=m.split("T")[0]);const c=m.split(/[-/]/);let f,C,Ae;c[0].length===4?(f=parseInt(c[0],10),C=parseInt(c[1],10)-1,Ae=parseInt(c[2],10)):(Ae=parseInt(c[0],10),C=parseInt(c[1],10)-1,f=parseInt(c[2],10));const w=new Date(f,C,Ae);w.setHours(0,0,0,0);const k=w-s,L=Math.ceil(k/(1e3*60*60*24));return L<0?"VENCIDA":L<=5?"PROXIMA":"PENDIENTE"},[]),qr=n.useCallback(r=>{switch(r){case"VENCIDA":return{color:"#ef4444",bg:"#fee2e2",activeColor:"#ef4444",activeBg:"#fee2e2",label:"Vencida"};case"PROXIMA":return{color:"#f97316",bg:"#ffedd5",activeColor:"#ea580c",activeBg:"#ffedd5",label:"Próxima a Vencer"};case"PAGADA":return{color:"#10b981",bg:"#dcfce7",activeColor:"#10b981",activeBg:"#dcfce7",label:"Pagada"};default:return{color:"#3b82f6",bg:"#dbeafe",activeColor:"#2563eb",activeBg:"#dbeafe",label:"Pendiente"}}},[]),R=n.useMemo(()=>{let r=0,t=0,o=0,s=0,m=0;return g.forEach(c=>{const f=Se(c);f==="PENDIENTE"&&r++,f==="VENCIDA"&&t++,f==="PAGADA"&&o++,f==="PROXIMA"&&s++;const C=(parseFloat(c.monto_total)||0)-(parseFloat(c.monto_abonado)||0);f!=="PAGADA"&&(m+=C)}),{pend:r,venc:t,pag:o,prox:s,totalDebt:m,totalCount:g.length}},[g,Se]),Y=n.useMemo(()=>{let r=g;b&&(r=r.filter(o=>o.proveedor===b));const t={};return r.forEach(o=>{const s=o.proveedor||"Sin Proveedor";t[s]||(t[s]={provider:s,count:0,totalAmount:0,totalPaid:0}),t[s].count+=1,t[s].totalAmount+=parseFloat(o.monto_total)||0,t[s].totalPaid+=parseFloat(o.monto_abonado)||0}),Object.values(t).sort((o,s)=>s.totalAmount-o.totalAmount)},[g,b]),De=n.useMemo(()=>{let r=g.map(t=>({...t,effectiveStatus:Se(t)}));return _!=="TODAS"&&_!=="BI"&&(_==="PENDIENTE"?r=r.filter(t=>t.effectiveStatus==="PENDIENTE"||t.effectiveStatus==="PROXIMA"):r=r.filter(t=>t.effectiveStatus===_)),b&&(r=r.filter(t=>t.proveedor===b)),M&&(r=r.filter(t=>t.tipo_compra===M)),r=br(r,re,["proveedor","numero_factura"]),r.sort((t,o)=>j==="vencimiento_asc"?new Date(t.fecha_vencimiento)-new Date(o.fecha_vencimiento):j==="emision_desc"?new Date(o.fecha_emision)-new Date(t.fecha_emision):j==="emision_asc"?new Date(t.fecha_emision)-new Date(o.fecha_emision):0),r},[g,_,re,b,M,j,Se]),Ve=n.useMemo(()=>{let r=0,t=0;return De.forEach(o=>{r+=parseFloat(o.monto_total)||0,t+=parseFloat(o.monto_abonado)||0}),{facturado:r,abonado:t,restante:r-t}},[De]),Ee=n.useMemo(()=>{let r=ir;return b&&(r=r.filter(t=>t.proveedor===b)),he&&(r=r.filter(t=>t.metodo_pago===he)),M&&(r=r.filter(t=>t.tipo_compra===M)),r=br(r,re,["proveedor","numero_factura","referencia"]),r},[ir,b,he,M,re]),Ur=n.useMemo(()=>Ee.reduce((r,t)=>r+parseFloat(t.monto||0),0),[Ee]);return e.jsxs(gt,{children:[e.jsx(At,{info:rr,onClose:()=>tr({...rr,show:!1})}),e.jsxs(bt,{children:[e.jsxs(jt,{children:[e.jsxs(yt,{children:[e.jsx(Ge,{})," Facturas de Proveedores"]}),e.jsx(vt,{children:"Gestión y control de cuentas por pagar"})]}),e.jsxs(Ct,{children:[e.jsx(x,{$secondary:!0,onClick:()=>$(r=>r+1),children:"Actualizar"}),e.jsxs(wt,{to:"/dashboard",children:[e.jsx(Xr,{})," Volver"]}),e.jsxs(x,{$primary:!0,onClick:()=>{v({proveedor:"",numero_factura:"",fecha_emision:X(),fecha_vencimiento:"",monto_total:"",notas:"",tipo_compra:"CREDITO",metodo_pago:"EFECTIVO",referencia:""}),U(null),Q({base64:null,name:null}),ge(!0)},children:[e.jsx(Kr,{})," Registrar Factura"]})]})]}),e.jsxs("div",{style:{display:"flex",gap:"1rem",marginBottom:"2rem",borderBottom:"2px solid #e2e8f0",paddingBottom:"1rem"},children:[e.jsxs("button",{onClick:()=>ar(!1),style:{padding:"0.75rem 1.5rem",borderRadius:"12px",fontWeight:"bold",cursor:"pointer",border:"none",background:D?"transparent":"#0f172a",color:D?"#64748b":"white",transition:"all 0.2s",display:"flex",alignItems:"center",gap:"8px"},children:[e.jsx(Ge,{})," Control de Facturas (Deudas)"]}),e.jsxs("button",{onClick:()=>ar(!0),style:{padding:"0.75rem 1.5rem",borderRadius:"12px",fontWeight:"bold",cursor:"pointer",border:"none",background:D?"#0f172a":"transparent",color:D?"white":"#64748b",transition:"all 0.2s",display:"flex",alignItems:"center",gap:"8px"},children:[e.jsx(qe,{})," Reporte de Egresos (Abonos & Pagos)"]})]}),!D&&_!=="BI"&&e.jsxs(jr,{children:[e.jsxs("div",{className:"summary-item",children:[e.jsx("span",{className:"summary-label",children:"Suma de Facturas Filtradas"}),e.jsxs("span",{className:"summary-value",children:["C$",Ve.facturado.toLocaleString(void 0,{minimumFractionDigits:2})]})]}),e.jsxs("div",{className:"summary-item success",children:[e.jsx("span",{className:"summary-label",children:"Total Abonado"}),e.jsxs("span",{className:"summary-value",children:["C$",Ve.abonado.toLocaleString(void 0,{minimumFractionDigits:2})]})]}),e.jsxs("div",{className:"summary-item danger",children:[e.jsx("span",{className:"summary-label",children:"Deuda Restante"}),e.jsxs("span",{className:"summary-value",children:["C$",Ve.restante.toLocaleString(void 0,{minimumFractionDigits:2})]})]})]}),D&&e.jsx(jr,{children:e.jsxs("div",{className:"summary-item success",children:[e.jsx("span",{className:"summary-label",children:"Total Egresado Bajo Filtros"}),e.jsxs("span",{className:"summary-value",children:["C$",Ur.toLocaleString(void 0,{minimumFractionDigits:2})]})]})}),!D&&e.jsxs(e.Fragment,{children:[e.jsxs(_t,{children:[e.jsxs(me,{color:"#ef4444",bg:"#fef2f2",children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(fe,{})}),e.jsx("div",{className:"label",children:"Vencidas"}),e.jsx("div",{className:"value",children:R.venc}),e.jsx("div",{className:"sub",children:"Requieren atención urgente"})]}),e.jsxs(me,{color:"#ea580c",bg:"#fff7ed",children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(V,{})}),e.jsx("div",{className:"label",children:"Próximas a Vencer"}),e.jsx("div",{className:"value",children:R.prox}),e.jsx("div",{className:"sub",children:"En los próx. 5 días"})]}),e.jsxs(me,{color:"#3b82f6",bg:"#eff6ff",children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(V,{})}),e.jsx("div",{className:"label",children:"Pendientes"}),e.jsx("div",{className:"value",children:R.pend}),e.jsx("div",{className:"sub",children:"Sin riesgo inmediato"})]}),e.jsxs(me,{color:"#10b981",bg:"#dcfce7",children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(H,{})}),e.jsx("div",{className:"label",children:"Pagadas"}),e.jsx("div",{className:"value",children:R.pag}),e.jsx("div",{className:"sub",children:"Completadas con éxito"})]}),e.jsxs(me,{color:"#b45309",bg:"#fffbeb",children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(J,{})}),e.jsx("div",{className:"label",children:"Deuda Total"}),e.jsxs("div",{className:"value",style:{color:"#b45309",fontSize:"1.5rem"},children:["C$",R.totalDebt.toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsx("div",{className:"sub",children:"Saldo Pendiente Global"})]})]}),e.jsxs(yr,{children:[e.jsx(Ft,{children:[{id:"PENDIENTE",label:"Por Pagar (Prox)",icon:V,color:"#3b82f6",bg:"#eff6ff",count:R.pend+R.prox},{id:"VENCIDA",label:"Vencidas",icon:fe,color:"#ef4444",bg:"#fef2f2",count:R.venc},{id:"PAGADA",label:"Pagadas",icon:H,color:"#10b981",bg:"#dcfce7",count:R.pag},{id:"BI",label:"Resumen BI",icon:Ue,color:"#6366f1",bg:"#eef2ff",count:null},{id:"TODAS",label:"Todas",icon:qe,color:"#64748b",bg:"#f1f5f9",count:null}].map(r=>e.jsxs(St,{active:_===r.id,activeColor:r.color,activeBg:r.bg,onClick:()=>O(r.id),children:[e.jsx(r.icon,{})," ",r.label,r.count!==null&&e.jsx("span",{className:"badge",children:r.count})]},r.id))}),e.jsxs(wr,{children:[e.jsxs(_r,{children:[e.jsx(ur,{}),e.jsx("input",{type:"text",placeholder:"Buscar proveedor o No. factura...",value:re,onChange:r=>Je(r.target.value)})]}),e.jsxs(T,{style:{minWidth:"180px"},children:[e.jsx("label",{children:"Ordenar Por"}),e.jsxs("select",{value:j,onChange:r=>Sr(r.target.value),children:[e.jsx("option",{value:"vencimiento_asc",children:"Vencen Primero (Próximas)"}),e.jsx("option",{value:"emision_desc",children:"Emitidas Reciente (Nuevas)"}),e.jsx("option",{value:"emision_asc",children:"Emitidas Antiguas (Viejas)"})]})]}),e.jsxs(T,{children:[e.jsx("label",{children:"Tipo de Compra"}),e.jsxs("select",{value:M,onChange:r=>er(r.target.value),children:[e.jsx("option",{value:"",children:"TODAS"}),e.jsx("option",{value:"CREDITO",children:"Crédito"}),e.jsx("option",{value:"CONTADO",children:"Contado"})]})]}),e.jsxs(T,{children:[e.jsx("label",{children:"Proveedor"}),e.jsxs("select",{value:b,onChange:r=>Xe(r.target.value),children:[e.jsx("option",{value:"",children:"Todos"}),P.map(r=>e.jsx("option",{value:r.nombre,children:r.nombre},r.id_proveedor||r.id))]})]}),e.jsxs(T,{style:{minWidth:"140px"},children:[e.jsx("label",{children:"Desde"}),e.jsx("input",{type:"date",value:F,onChange:r=>Ke(r.target.value)})]}),e.jsxs(T,{style:{minWidth:"140px"},children:[e.jsx("label",{children:"Hasta"}),e.jsx("input",{type:"date",value:S,onChange:r=>Ze(r.target.value)})]})]})]}),ee?e.jsxs("div",{style:{textAlign:"center",padding:"4rem",color:"#94a3b8"},children:[e.jsx(V,{className:"spin",style:{fontSize:"2rem",marginBottom:"1rem"}}),e.jsx("p",{children:"Cargando información..."})]}):_==="BI"?e.jsxs(vr,{children:[e.jsxs(Cr,{children:[e.jsxs("h3",{children:[e.jsx(Ue,{})," Resumen por Proveedor (BI)"]}),F&&S&&e.jsxs("span",{className:"date-range",children:[I(F)," - ",I(S)]})]}),e.jsxs(Ye,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Proveedor"}),e.jsx("th",{style:{textAlign:"center"},children:"Facturas"}),e.jsx("th",{style:{textAlign:"right"},children:"Total Comprado"}),e.jsx("th",{style:{textAlign:"right"},children:"Pagado"}),e.jsx("th",{style:{textAlign:"right"},children:"Saldo Pendiente"})]})}),e.jsxs("tbody",{children:[Y.map(r=>e.jsxs("tr",{children:[e.jsx("td",{className:"provider-name",children:r.provider}),e.jsx("td",{style:{textAlign:"center"},children:e.jsx("span",{className:"count-badge",children:r.count})}),e.jsxs("td",{className:"amount",children:["C$",r.totalAmount.toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsxs("td",{className:"amount",style:{color:"#10b981"},children:["C$",r.totalPaid.toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsxs("td",{className:"amount",style:{color:r.totalAmount-r.totalPaid>.1?"#ef4444":"#10b981"},children:["C$",(r.totalAmount-r.totalPaid).toLocaleString(void 0,{minimumFractionDigits:2})]})]},r.provider)),Y.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:"5",style:{textAlign:"center",padding:"3rem",color:"#94a3b8"},children:"No hay datos para el período seleccionado."})})]}),Y.length>0&&e.jsx("tfoot",{children:e.jsxs("tr",{style:{background:"#f8fafc",fontWeight:"900"},children:[e.jsx("td",{colSpan:"2",style:{textAlign:"right",textTransform:"uppercase",fontSize:"0.8rem",color:"#64748b"},children:"Totales Globales:"}),e.jsxs("td",{className:"amount",children:["C$",Y.reduce((r,t)=>r+t.totalAmount,0).toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsxs("td",{className:"amount",children:["C$",Y.reduce((r,t)=>r+t.totalPaid,0).toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsxs("td",{className:"amount",style:{color:"#ef4444"},children:["C$",(Y.reduce((r,t)=>r+t.totalAmount,0)-Y.reduce((r,t)=>r+t.totalPaid,0)).toLocaleString(void 0,{minimumFractionDigits:2})]})]})})]})]}):De.length>0?e.jsx(Dt,{children:De.map(r=>{const t=r.effectiveStatus,o=qr(t),s=parseFloat(r.monto_total)||0,m=parseFloat(r.monto_abonado)||0,c=s-m,f=s>0?m/s*100:0;return e.jsxs(Et,{color:o.color,balanceColor:c>0?"#ef4444":"#10b981",children:[e.jsxs("div",{className:"card-header",children:[e.jsxs("div",{className:"provider-info",children:[e.jsxs("h3",{title:r.proveedor,children:[e.jsx(Zr,{style:{marginRight:6,color:"#94a3b8"}})," ",r.proveedor]}),e.jsxs("span",{className:"invoice-number",children:["#",r.numero_factura]})]}),e.jsx(ie,{bg:o.bg,text:o.color,children:o.label})]}),e.jsxs("div",{className:"card-body",children:[e.jsxs("div",{className:"meta-row",children:[e.jsxs("span",{className:"label",children:[e.jsx(et,{})," Emisión"]}),e.jsx("span",{className:"value",children:I(r.fecha_emision)})]}),e.jsxs("div",{className:"meta-row",children:[e.jsxs("span",{className:"label",children:[e.jsx(fe,{})," Vence"]}),e.jsx("span",{className:"value",style:{color:t==="VENCIDA"?"#ef4444":"inherit"},children:I(r.fecha_vencimiento)})]}),e.jsxs("div",{className:"meta-row",children:[e.jsxs("span",{className:"label",children:[e.jsx(Ue,{})," Tipo de Compra"]}),e.jsx("span",{className:"value",children:e.jsx(ie,{bg:r.tipo_compra==="CONTADO"?"#dcfce7":"#eef2ff",text:r.tipo_compra==="CONTADO"?"#16a34a":"#4f46e5",style:{padding:"0.2rem 0.5rem",fontSize:"0.7rem"},children:r.tipo_compra})})]}),e.jsxs("div",{className:"financial-block",children:[e.jsxs("div",{className:"total-row",children:[e.jsx("span",{className:"label",children:"Total a Pagar"}),e.jsxs("span",{className:"amount",children:["C$",s.toLocaleString(void 0,{minimumFractionDigits:2})]})]}),e.jsx("div",{className:"progress-bar",children:e.jsx("div",{style:{width:`${f}%`,background:o.color}})}),e.jsxs("div",{className:"balance-text",children:["Abonado: C$",m.toLocaleString(void 0,{minimumFractionDigits:2})," • ",e.jsxs("strong",{children:["Resta: C$",c.toLocaleString(void 0,{minimumFractionDigits:2})]})]})]})]}),e.jsxs("div",{className:"card-footer",style:{flexWrap:"wrap",gap:"0.5rem"},children:[c>0&&e.jsxs(x,{$primary:!0,style:{flex:1,minWidth:"100px",justifyContent:"center"},onClick:()=>Or(r),children:[e.jsx(J,{})," Abonar"]}),e.jsxs(x,{$secondary:!0,style:{flex:1,minWidth:"100px",justifyContent:"center"},onClick:()=>Gr(r),children:[e.jsx(qe,{})," Historial"]}),e.jsx(x,{$secondary:!0,title:"Editar datos de la factura",style:{padding:"0.75rem",background:"#eff6ff",color:"#2563eb",border:"1px solid #bfdbfe"},onClick:()=>Lr(r),children:e.jsx(ke,{})}),r.factura_url&&e.jsx(x,{$secondary:!0,title:"Ver Factura Escaneada / Archivo",style:{padding:"0.75rem",background:"#fef3c7",color:"#b45309",border:"1px solid #fde68a"},onClick:()=>ae(r.factura_url,`Factura #${r.numero_factura}`,`${r.proveedor} • C$${parseFloat(r.monto_total||0).toLocaleString(void 0,{minimumFractionDigits:2})}`),children:ce(r.factura_url)?e.jsx(oe,{}):e.jsx(Te,{})}),e.jsx(x,{$danger:!0,style:{padding:"0.75rem"},onClick:()=>{q(r),ye(!0)},title:"Eliminar factura",children:e.jsx(Pe,{})})]})]},r.id)})}):e.jsxs("div",{style:{textAlign:"center",padding:"4rem",color:"#94a3b8",border:"2px dashed #e2e8f0",borderRadius:"24px",background:"white"},children:[e.jsx(Ge,{style:{fontSize:"3rem",marginBottom:"1rem",opacity:.3}}),e.jsx("h3",{style:{color:"#475569"},children:"No se encontraron facturas"}),e.jsx("p",{children:"Intenta ajustar los filtros o registra una nueva."})]})]}),D&&e.jsxs(e.Fragment,{children:[e.jsx(yr,{children:e.jsxs(wr,{style:{width:"100%"},children:[e.jsxs(_r,{children:[e.jsx(ur,{}),e.jsx("input",{type:"text",placeholder:"Buscar por proveedor, factura o referencia...",value:re,onChange:r=>Je(r.target.value)})]}),e.jsxs(T,{children:[e.jsx("label",{children:"Método de Pago"}),e.jsxs("select",{value:he,onChange:r=>Dr(r.target.value),children:[e.jsx("option",{value:"",children:"TODOS"}),e.jsx("option",{value:"EFECTIVO",children:"Efectivo"}),e.jsx("option",{value:"TARJETA",children:"Tarjeta"}),e.jsx("option",{value:"TRANSFERENCIA",children:"Transferencia"}),e.jsx("option",{value:"CHEQUE",children:"Cheque"})]})]}),e.jsxs(T,{children:[e.jsx("label",{children:"Tipo Factura"}),e.jsxs("select",{value:M,onChange:r=>er(r.target.value),children:[e.jsx("option",{value:"",children:"TODOS"}),e.jsx("option",{value:"CONTADO",children:"Contado"}),e.jsx("option",{value:"CREDITO",children:"Crédito"})]})]}),e.jsxs(T,{children:[e.jsx("label",{children:"Proveedor"}),e.jsxs("select",{value:b,onChange:r=>Xe(r.target.value),children:[e.jsx("option",{value:"",children:"TODOS"}),P.map(r=>e.jsx("option",{value:r.nombre,children:r.nombre},r.id_proveedor||r.id))]})]}),e.jsxs(T,{style:{minWidth:"140px"},children:[e.jsx("label",{children:"Desde"}),e.jsx("input",{type:"date",value:F,onChange:r=>Ke(r.target.value)})]}),e.jsxs(T,{style:{minWidth:"140px"},children:[e.jsx("label",{children:"Hasta"}),e.jsx("input",{type:"date",value:S,onChange:r=>Ze(r.target.value)})]})]})}),e.jsxs(vr,{children:[e.jsxs(Cr,{children:[e.jsxs("h3",{children:[e.jsx(J,{})," Listado de Pagos y Abonos Efectuados"]}),(F||S)&&e.jsxs("span",{className:"date-range",children:[F?I(F):"Inicio"," - ",S?I(S):"Hoy"]})]}),ee?e.jsxs("div",{style:{textAlign:"center",padding:"3rem",color:"#94a3b8"},children:[e.jsx(V,{className:"spin",style:{fontSize:"2rem",marginBottom:"1rem"}}),e.jsx("p",{children:"Cargando información..."})]}):e.jsx("div",{style:{overflowX:"auto"},children:e.jsxs(Ye,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Fecha Abono"}),e.jsx("th",{children:"Factura"}),e.jsx("th",{children:"Proveedor"}),e.jsx("th",{children:"Método"}),e.jsx("th",{children:"Referencia / Detalle"}),e.jsx("th",{style:{textAlign:"center"},children:"Modo de Compra"}),e.jsx("th",{style:{textAlign:"center"},children:"Comprobante"}),e.jsx("th",{style:{textAlign:"right"},children:"Monto Pagado (C$)"}),e.jsx("th",{style:{textAlign:"center"},children:"Acciones"})]})}),e.jsxs("tbody",{children:[Ee.map(r=>e.jsxs("tr",{children:[e.jsx("td",{children:I(r.fecha_abono)}),e.jsx("td",{children:e.jsxs("b",{children:["#",r.numero_factura]})}),e.jsx("td",{children:r.proveedor}),e.jsx("td",{children:e.jsx(ie,{bg:"#f1f5f9",text:"#475569",children:r.metodo_pago})}),e.jsx("td",{children:r.referencia||"-"}),e.jsx("td",{style:{textAlign:"center"},children:e.jsx(ie,{bg:r.tipo_compra==="CONTADO"?"#dcfce7":"#eef2ff",text:r.tipo_compra==="CONTADO"?"#16a34a":"#4f46e5",children:r.tipo_compra})}),e.jsx("td",{style:{textAlign:"center"},children:r.comprobante_url?e.jsxs("button",{type:"button",onClick:()=>ae(r.comprobante_url,`Comprobante Factura #${r.numero_factura}`,`${r.proveedor} • C$${parseFloat(r.monto).toLocaleString(void 0,{minimumFractionDigits:2})} • ${r.metodo_pago}`),style:{background:"#eff6ff",color:"#2563eb",border:"1px solid #bfdbfe",padding:"0.35rem 0.6rem",borderRadius:"8px",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"0.35rem",fontSize:"0.85rem",fontWeight:600},title:"Ver Comprobante",children:[ce(r.comprobante_url)?e.jsx(oe,{style:{color:"#ef4444"}}):e.jsx(Te,{style:{color:"#3b82f6"}}),e.jsx("span",{children:"Ver"})]}):e.jsx("span",{style:{color:"#94a3b8",fontSize:"0.85rem"},children:"—"})}),e.jsxs("td",{className:"amount",style:{color:"#10b981"},children:["C$",parseFloat(r.monto).toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsx("td",{style:{textAlign:"center"},children:e.jsxs("div",{style:{display:"flex",gap:"0.5rem",justifyContent:"center"},children:[e.jsx(x,{$secondary:!0,title:"Editar abono",style:{padding:"0.4rem 0.6rem",fontSize:"0.8rem",borderRadius:"8px"},onClick:()=>{const t=g.find(o=>o.id===r.id_factura);t&&q(t),We({id:r.abono_id,monto:r.monto,metodo_pago:r.metodo_pago,referencia:r.referencia,comprobante_url:r.comprobante_url})},children:e.jsx(ke,{})}),e.jsx(x,{$danger:!0,title:"Eliminar abono",style:{padding:"0.4rem 0.6rem",fontSize:"0.8rem",borderRadius:"8px"},onClick:()=>Le(r.abono_id),children:e.jsx(Pe,{})})]})})]},r.abono_id)),Ee.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:"9",style:{textAlign:"center",padding:"3rem",color:"#94a3b8"},children:"No hay registro de abonos o pagos en este período."})})]})]})})]})]}),Er&&e.jsx(G,{onClick:()=>ge(!1),children:e.jsxs(K,{onClick:r=>r.stopPropagation(),children:[e.jsx(pe,{onClick:()=>ge(!1),children:e.jsx(Z,{})}),e.jsx("h2",{children:"Registrar Factura"}),e.jsxs("form",{onSubmit:Wr,children:[e.jsxs(p,{children:[e.jsx("label",{children:"Proveedor"}),e.jsxs("select",{required:!0,value:l.proveedor,onChange:r=>v({...l,proveedor:r.target.value}),children:[e.jsx("option",{value:"",children:"Seleccione un proveedor..."}),P.map(r=>e.jsx("option",{value:r.nombre,children:r.nombre},r.id_proveedor||r.id))]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))",gap:"1rem"},children:[e.jsxs(p,{children:[e.jsx("label",{children:"No. Factura"}),e.jsx("input",{required:!0,type:"text",value:l.numero_factura,onChange:r=>v({...l,numero_factura:r.target.value}),placeholder:"Ej: F-001"})]}),e.jsxs(p,{children:[e.jsx("label",{children:"Monto Total (C$)"}),e.jsx("input",{required:!0,type:"number",step:"0.01",value:l.monto_total,onChange:r=>v({...l,monto_total:r.target.value}),placeholder:"0.00"})]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))",gap:"1rem"},children:[e.jsxs(p,{children:[e.jsx("label",{children:"Fecha Emisión"}),e.jsx("input",{required:!0,type:"date",value:l.fecha_emision,onChange:r=>v({...l,fecha_emision:r.target.value})})]}),e.jsxs(p,{children:[e.jsx("label",{children:"Fecha Vencimiento"}),e.jsx("input",{required:l.tipo_compra!=="CONTADO",disabled:l.tipo_compra==="CONTADO",type:"date",value:l.tipo_compra==="CONTADO"?l.fecha_emision:l.fecha_vencimiento,onChange:r=>v({...l,fecha_vencimiento:r.target.value})}),l.tipo_compra==="CONTADO"&&e.jsx("small",{style:{color:"#10b981",fontWeight:600,marginTop:"4px",display:"block"},children:"✓ Pagada al contado (sin vencimiento pendiente)"})]})]}),e.jsxs(p,{children:[e.jsx("label",{children:"Condición de Pago"}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))",gap:"0.75rem"},children:[e.jsxs("button",{type:"button",onClick:()=>v({...l,tipo_compra:"CREDITO"}),style:{padding:"0.85rem 1rem",borderRadius:"12px",border:l.tipo_compra==="CREDITO"?"2px solid #0f172a":"1px solid #cbd5e1",background:l.tipo_compra==="CREDITO"?"#0f172a":"#fff",color:l.tipo_compra==="CREDITO"?"#fff":"#475569",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",transition:"all 0.15s"},children:[e.jsx(V,{})," A Crédito"]}),e.jsxs("button",{type:"button",onClick:()=>v({...l,tipo_compra:"CONTADO",fecha_vencimiento:l.fecha_emision||X()}),style:{padding:"0.85rem 1rem",borderRadius:"12px",border:l.tipo_compra==="CONTADO"?"2px solid #10b981":"1px solid #cbd5e1",background:l.tipo_compra==="CONTADO"?"#10b981":"#fff",color:l.tipo_compra==="CONTADO"?"#fff":"#475569",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",transition:"all 0.15s"},children:[e.jsx(H,{})," De Contado"]})]})]}),l.tipo_compra==="CONTADO"&&e.jsxs("div",{style:{background:"#f8fafc",padding:"1.25rem",borderRadius:"16px",border:"1px solid #e2e8f0",marginBottom:"1.25rem"},children:[e.jsxs(p,{style:{marginBottom:"1rem"},children:[e.jsx("label",{style:{color:"#0f172a",fontWeight:700},children:"Método de Pago de Contado"}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(105px, 1fr))",gap:"0.5rem"},children:[{id:"EFECTIVO",label:"Efectivo",icon:e.jsx(J,{})},{id:"TRANSFERENCIA",label:"Transferencia",icon:e.jsx(fr,{})},{id:"TARJETA",label:"Tarjeta",icon:e.jsx(xr,{})},{id:"CHEQUE",label:"Cheque",icon:e.jsx(hr,{})}].map(r=>e.jsxs("button",{type:"button",onClick:()=>v({...l,metodo_pago:r.id}),style:{padding:"0.75rem 0.5rem",borderRadius:"10px",border:l.metodo_pago===r.id?"2px solid #2563eb":"1px solid #cbd5e1",background:l.metodo_pago===r.id?"#eff6ff":"#fff",color:l.metodo_pago===r.id?"#1d4ed8":"#475569",fontWeight:700,fontSize:"0.85rem",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:"0.35rem",transition:"all 0.15s"},children:[e.jsx("span",{style:{fontSize:"1.15rem"},children:r.icon}),r.label]},r.id))})]}),e.jsxs(p,{style:{marginBottom:"1rem"},children:[e.jsx("label",{children:"Referencia de Pago"}),e.jsx("input",{type:"text",value:l.referencia,onChange:r=>v({...l,referencia:r.target.value}),placeholder:l.metodo_pago==="TRANSFERENCIA"?"Ej: Transferencia Lafise 14664661":"Ej: No. recibo, cheque o nota de pago..."})]}),e.jsxs(p,{style:{marginBottom:0},children:[e.jsx("label",{children:"Comprobante de Pago (Foto o PDF)"}),e.jsxs(ue,{children:[e.jsx(Qe,{className:"upload-icon"}),se?e.jsx("div",{className:"file-details",children:z?"Comprimiendo archivo...":`✓ Listo: ${y.name} (${y.sizeInfo||""})`}):e.jsx("div",{className:"file-details",children:"Haz clic o arrastra foto del voucher o PDF"}),e.jsx("input",{type:"file",accept:"image/*,application/pdf",onChange:Be,disabled:z})]}),se&&e.jsx("div",{style:{marginTop:"0.4rem",textAlign:"right"},children:e.jsx("button",{type:"button",onClick:()=>{U(null),Q({base64:null,name:null})},style:{background:"none",border:"none",color:"#ef4444",fontSize:"0.82rem",fontWeight:600,cursor:"pointer"},children:"✕ Quitar comprobante"})})]})]}),e.jsxs(p,{children:[e.jsx("label",{children:"Factura Escaneada (Foto o PDF de la Factura del Proveedor)"}),e.jsxs(ue,{children:[e.jsx(oe,{className:"upload-icon",style:{color:"#ef4444"}}),we?e.jsx("div",{className:"file-details",children:te?"Comprimiendo archivo...":`✓ Listo: ${W.name} (${W.sizeInfo||""})`}):e.jsx("div",{className:"file-details",children:"Haz clic para subir foto o PDF de la factura"}),e.jsx("input",{type:"file",accept:"image/*,application/pdf",onChange:mr,disabled:te})]}),we&&e.jsx("div",{style:{marginTop:"0.4rem",textAlign:"right"},children:e.jsx("button",{type:"button",onClick:()=>{le(null),de({base64:null,name:null})},style:{background:"none",border:"none",color:"#ef4444",fontSize:"0.82rem",fontWeight:600,cursor:"pointer"},children:"✕ Quitar factura"})})]}),e.jsxs(p,{children:[e.jsx("label",{children:"Notas (Opcional)"}),e.jsx("textarea",{rows:"3",value:l.notas,onChange:r=>v({...l,notas:r.target.value}),placeholder:"Detalles extra..."})]}),e.jsxs(x,{$primary:!0,type:"submit",disabled:z||te,style:{width:"100%",padding:"1rem",fontSize:"1rem"},children:[e.jsx(H,{})," Guardar Factura"]})]})]})}),kr&&e.jsx(G,{onClick:()=>ne(!1),children:e.jsxs(K,{onClick:r=>r.stopPropagation(),children:[e.jsx(pe,{onClick:()=>ne(!1),children:e.jsx(Z,{})}),e.jsx("h2",{children:"Editar Factura"}),e.jsxs("form",{onSubmit:Vr,children:[e.jsxs(p,{children:[e.jsx("label",{children:"Proveedor"}),e.jsxs("select",{required:!0,value:d.proveedor,onChange:r=>E({...d,proveedor:r.target.value}),children:[e.jsx("option",{value:"",children:"Seleccione un proveedor..."}),P.map(r=>e.jsx("option",{value:r.nombre,children:r.nombre},r.id_proveedor||r.id))]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))",gap:"1rem"},children:[e.jsxs(p,{children:[e.jsx("label",{children:"No. Factura"}),e.jsx("input",{required:!0,type:"text",value:d.numero_factura,onChange:r=>E({...d,numero_factura:r.target.value})})]}),e.jsxs(p,{children:[e.jsx("label",{children:"Monto Total (C$)"}),e.jsx("input",{required:!0,type:"number",step:"0.01",value:d.monto_total,onChange:r=>E({...d,monto_total:r.target.value})})]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))",gap:"1rem"},children:[e.jsxs(p,{children:[e.jsx("label",{children:"Fecha Emisión"}),e.jsx("input",{required:!0,type:"date",value:d.fecha_emision,onChange:r=>E({...d,fecha_emision:r.target.value})})]}),e.jsxs(p,{children:[e.jsx("label",{children:"Fecha Vencimiento"}),e.jsx("input",{required:d.tipo_compra!=="CONTADO",disabled:d.tipo_compra==="CONTADO",type:"date",value:d.tipo_compra==="CONTADO"?d.fecha_emision:d.fecha_vencimiento,onChange:r=>E({...d,fecha_vencimiento:r.target.value})})]})]}),e.jsxs(p,{children:[e.jsx("label",{children:"Condición de Pago"}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))",gap:"0.75rem"},children:[e.jsxs("button",{type:"button",onClick:()=>E({...d,tipo_compra:"CREDITO"}),style:{padding:"0.85rem 1rem",borderRadius:"12px",border:d.tipo_compra==="CREDITO"?"2px solid #0f172a":"1px solid #cbd5e1",background:d.tipo_compra==="CREDITO"?"#0f172a":"#fff",color:d.tipo_compra==="CREDITO"?"#fff":"#475569",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",transition:"all 0.15s"},children:[e.jsx(V,{})," A Crédito"]}),e.jsxs("button",{type:"button",onClick:()=>E({...d,tipo_compra:"CONTADO",fecha_vencimiento:d.fecha_emision||X()}),style:{padding:"0.85rem 1rem",borderRadius:"12px",border:d.tipo_compra==="CONTADO"?"2px solid #10b981":"1px solid #cbd5e1",background:d.tipo_compra==="CONTADO"?"#10b981":"#fff",color:d.tipo_compra==="CONTADO"?"#fff":"#475569",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",transition:"all 0.15s"},children:[e.jsx(H,{})," De Contado"]})]})]}),d.tipo_compra==="CONTADO"&&e.jsxs(p,{style:{background:"#f8fafc",padding:"1rem",borderRadius:"14px",border:"1px solid #e2e8f0"},children:[e.jsx("label",{style:{color:"#0f172a",fontWeight:700},children:"Método de Pago"}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(100px, 1fr))",gap:"0.5rem"},children:[{id:"EFECTIVO",label:"Efectivo",icon:e.jsx(J,{})},{id:"TRANSFERENCIA",label:"Transferencia",icon:e.jsx(fr,{})},{id:"TARJETA",label:"Tarjeta",icon:e.jsx(xr,{})},{id:"CHEQUE",label:"Cheque",icon:e.jsx(hr,{})}].map(r=>e.jsxs("button",{type:"button",onClick:()=>E({...d,metodo_pago:r.id}),style:{padding:"0.65rem 0.5rem",borderRadius:"10px",border:d.metodo_pago===r.id?"2px solid #2563eb":"1px solid #cbd5e1",background:d.metodo_pago===r.id?"#eff6ff":"#fff",color:d.metodo_pago===r.id?"#1d4ed8":"#475569",fontWeight:700,fontSize:"0.82rem",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:"0.3rem",transition:"all 0.15s"},children:[e.jsx("span",{style:{fontSize:"1.1rem"},children:r.icon}),r.label]},r.id))})]}),e.jsxs(p,{children:[e.jsx("label",{children:"Reemplazar Factura Escaneada (Foto o PDF)"}),e.jsxs(ue,{children:[e.jsx(oe,{className:"upload-icon",style:{color:"#ef4444"}}),we?e.jsx("div",{className:"file-details",children:te?"Comprimiendo archivo...":`✓ Nueva Factura: ${W.name} (${W.sizeInfo||""})`}):e.jsx("div",{className:"file-details",children:i!=null&&i.factura_url?"Factura actual guardada. Haz clic para reemplazarla.":"Haz clic para subir foto o PDF de la factura"}),e.jsx("input",{type:"file",accept:"image/*,application/pdf",onChange:mr,disabled:te})]}),(i==null?void 0:i.factura_url)&&!we&&e.jsx("div",{style:{marginTop:"0.5rem",textAlign:"right"},children:e.jsx("button",{type:"button",onClick:()=>ae(i.factura_url,`Factura #${i.numero_factura}`,i.proveedor),style:{background:"none",border:"none",fontSize:"0.85rem",color:"#2563eb",fontWeight:600,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"0.3rem"},children:"📄 Ver factura actual"})})]}),e.jsxs(p,{children:[e.jsx("label",{children:"Notas"}),e.jsx("textarea",{rows:"3",value:d.notas,onChange:r=>E({...d,notas:r.target.value}),placeholder:"Detalles extra..."})]}),e.jsxs("div",{style:{display:"flex",gap:"0.75rem"},children:[e.jsx(x,{$secondary:!0,type:"button",onClick:()=>ne(!1),style:{flex:1,padding:"0.85rem"},children:"Cancelar"}),e.jsxs(x,{$primary:!0,type:"submit",disabled:te,style:{flex:1,padding:"0.85rem"},children:[e.jsx(H,{})," Guardar Cambios"]})]})]})]})}),Ar&&e.jsx(G,{onClick:()=>be(!1),children:e.jsxs(K,{onClick:r=>r.stopPropagation(),style:{maxWidth:"450px"},children:[e.jsx(pe,{onClick:()=>be(!1),children:e.jsx(Z,{})}),e.jsx("h2",{children:"Registrar Abono"}),e.jsxs("div",{style:{background:"#f1f5f9",padding:"1rem",borderRadius:"12px",marginBottom:"1.5rem"},children:[e.jsxs("div",{style:{fontSize:"0.9rem",color:"#64748b",marginBottom:"0.25rem"},children:["Factura #",i==null?void 0:i.numero_factura]}),e.jsxs("div",{style:{fontSize:"1.5rem",fontWeight:"800",color:"#0f172a"},children:["Deuda: C$",((parseFloat(i==null?void 0:i.monto_total)||0)-(parseFloat(i==null?void 0:i.monto_abonado)||0)).toFixed(2)]})]}),e.jsxs("form",{onSubmit:Mr,children:[e.jsxs(p,{children:[e.jsx("label",{children:"Monto a Abonar (C$)"}),e.jsx("input",{required:!0,type:"number",step:"0.01",autoFocus:!0,placeholder:"0.00",value:A.amount,onChange:r=>_e({...A,amount:r.target.value})})]}),e.jsxs(p,{children:[e.jsx("label",{children:"Método de Pago"}),e.jsxs("select",{required:!0,value:A.method,onChange:r=>_e({...A,method:r.target.value}),children:[e.jsx("option",{value:"EFECTIVO",children:"Efectivo"}),e.jsx("option",{value:"TARJETA",children:"Tarjeta"}),e.jsx("option",{value:"TRANSFERENCIA",children:"Transferencia"}),e.jsx("option",{value:"CHEQUE",children:"Cheque"})]})]}),e.jsxs(p,{children:[e.jsx("label",{children:"Referencia / Detalle (Opcional)"}),e.jsx("input",{type:"text",placeholder:"Ej: Transferencia #1234, Pago en efectivo...",value:A.reference,onChange:r=>_e({...A,reference:r.target.value})})]}),e.jsxs(p,{children:[e.jsx("label",{children:"Adjuntar Comprobante (Imagen o PDF)"}),e.jsxs(ue,{children:[e.jsx(Qe,{className:"upload-icon"}),se?e.jsx("div",{className:"file-details",children:z?"Comprimiendo archivo...":`✓ Listo: ${y.name} (${y.sizeInfo||""})`}):e.jsx("div",{className:"file-details",children:"Sube el comprobante de pago (Foto o PDF)"}),e.jsx("input",{type:"file",accept:"image/*,application/pdf",onChange:Be,disabled:z})]})]}),e.jsxs(x,{$primary:!0,type:"submit",disabled:z,style:{width:"100%",padding:"1rem"},children:[e.jsx(J,{})," Confirmar Pago"]})]})]})}),Nr&&e.jsx(G,{onClick:()=>je(!1),children:e.jsxs(K,{onClick:r=>r.stopPropagation(),style:{maxWidth:"450px"},children:[e.jsx(pe,{onClick:()=>je(!1),children:e.jsx(Z,{})}),e.jsx("h2",{children:"Editar Abono"}),e.jsxs("div",{style:{background:"#f1f5f9",padding:"1rem",borderRadius:"12px",marginBottom:"1.5rem"},children:[e.jsxs("div",{style:{fontSize:"0.9rem",color:"#64748b",marginBottom:"0.25rem"},children:["Editando abono en Factura #",i==null?void 0:i.numero_factura]}),e.jsxs("div",{style:{fontSize:"1.2rem",fontWeight:"800",color:"#0f172a"},children:["Proveedor: ",i==null?void 0:i.proveedor]})]}),e.jsxs("form",{onSubmit:Br,children:[e.jsxs(p,{children:[e.jsx("label",{children:"Monto del Abono (C$)"}),e.jsx("input",{required:!0,type:"number",step:"0.01",value:N.amount,onChange:r=>Fe({...N,amount:r.target.value})})]}),e.jsxs(p,{children:[e.jsx("label",{children:"Método de Pago"}),e.jsxs("select",{required:!0,value:N.method,onChange:r=>Fe({...N,method:r.target.value}),children:[e.jsx("option",{value:"EFECTIVO",children:"Efectivo"}),e.jsx("option",{value:"TARJETA",children:"Tarjeta"}),e.jsx("option",{value:"TRANSFERENCIA",children:"Transferencia"}),e.jsx("option",{value:"CHEQUE",children:"Cheque"})]})]}),e.jsxs(p,{children:[e.jsx("label",{children:"Referencia / Detalle (Opcional)"}),e.jsx("input",{type:"text",value:N.reference,onChange:r=>Fe({...N,reference:r.target.value})})]}),e.jsxs(p,{children:[e.jsx("label",{children:"Cambiar/Reemplazar Comprobante (Imagen o PDF)"}),e.jsxs(ue,{children:[e.jsx(Qe,{className:"upload-icon"}),se?e.jsx("div",{className:"file-details",children:z?"Comprimiendo archivo...":`✓ Listo: ${y.name} (${y.sizeInfo||""})`}):e.jsx("div",{className:"file-details",children:"Selecciona una foto o PDF para reemplazarlo"}),e.jsx("input",{type:"file",accept:"image/*,application/pdf",onChange:Be,disabled:z})]}),(B==null?void 0:B.comprobante_url)&&!se&&e.jsxs("div",{style:{marginTop:"0.5rem",fontSize:"0.85rem"},children:["Tiene comprobante: ",e.jsx("button",{type:"button",onClick:()=>ae(B.comprobante_url,`Comprobante - Factura #${i==null?void 0:i.numero_factura}`,`${i==null?void 0:i.proveedor} • C$${parseFloat(B.monto||0).toLocaleString(void 0,{minimumFractionDigits:2})}`),style:{background:"none",border:"none",color:"#2563eb",fontWeight:"bold",cursor:"pointer"},children:"Ver actual"})]})]}),e.jsxs(x,{$primary:!0,type:"submit",disabled:z,style:{width:"100%",padding:"1rem"},children:[e.jsx(H,{})," Guardar Cambios"]})]})]})}),Tr&&e.jsx(G,{onClick:()=>ye(!1),children:e.jsxs(K,{style:{maxWidth:"400px",textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"3rem",color:"#ef4444",marginBottom:"1rem"},children:e.jsx(fe,{})}),e.jsx("h2",{children:"¿Eliminar Factura?"}),e.jsxs("p",{style:{color:"#64748b",marginBottom:"2rem"},children:["Estás a punto de eliminar la factura ",e.jsxs("b",{children:["#",i==null?void 0:i.numero_factura]}),". Se borrarán también todos sus comprobantes y abonos. Esta acción no se puede deshacer."]}),e.jsxs("div",{style:{display:"flex",gap:"1rem"},children:[e.jsx(x,{$secondary:!0,onClick:()=>ye(!1),style:{flex:1},children:"Cancelar"}),e.jsx(x,{$danger:!0,onClick:Hr,style:{flex:1},children:"Sí, Eliminar"})]})]})}),Pr&&e.jsx(G,{onClick:()=>Me(!1),children:e.jsxs(K,{onClick:r=>r.stopPropagation(),style:{maxWidth:"680px"},children:[e.jsx(pe,{onClick:()=>Me(!1),children:e.jsx(Z,{})}),e.jsx("h2",{children:"Historial de Abonos"}),e.jsxs("div",{style:{background:"#f1f5f9",padding:"1rem",borderRadius:"12px",marginBottom:"1.25rem",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"0.5rem"},children:[e.jsxs("div",{children:[e.jsxs("div",{style:{fontSize:"0.85rem",color:"#64748b"},children:["Factura #",i==null?void 0:i.numero_factura]}),e.jsx("div",{style:{fontSize:"1.1rem",fontWeight:"800",color:"#0f172a"},children:i==null?void 0:i.proveedor})]}),e.jsxs("div",{style:{textAlign:"right"},children:[e.jsx("div",{style:{fontSize:"0.85rem",color:"#64748b"},children:"Abonado Total"}),e.jsxs("div",{style:{fontSize:"1.25rem",fontWeight:"800",color:"#10b981"},children:["C$",(parseFloat(i==null?void 0:i.monto_abonado)||0).toLocaleString(void 0,{minimumFractionDigits:2})]})]})]}),$r?e.jsxs("div",{style:{textAlign:"center",padding:"2rem",color:"#94a3b8"},children:[e.jsx(V,{className:"spin",style:{fontSize:"1.5rem",marginBottom:"1rem"}}),e.jsx("p",{children:"Cargando historial..."})]}):ve.length>0?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"desktop-history",style:{overflowX:"auto"},children:e.jsxs(Ye,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{style:{padding:"0.75rem 0.6rem"},children:"Fecha"}),e.jsx("th",{style:{padding:"0.75rem 0.6rem"},children:"Método"}),e.jsx("th",{style:{padding:"0.75rem 0.6rem"},children:"Referencia"}),e.jsx("th",{style:{padding:"0.75rem 0.6rem",textAlign:"center"},children:"Comprobante"}),e.jsx("th",{style:{padding:"0.75rem 0.6rem",textAlign:"right"},children:"Monto"}),e.jsx("th",{style:{padding:"0.75rem 0.6rem",textAlign:"center"},children:"Acciones"})]})}),e.jsx("tbody",{children:ve.map((r,t)=>e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"0.75rem 0.6rem"},children:I(r.fecha)}),e.jsx("td",{style:{padding:"0.75rem 0.6rem"},children:e.jsx(ie,{bg:"#f1f5f9",text:"#475569",children:r.metodo_pago})}),e.jsx("td",{style:{padding:"0.75rem 0.6rem"},children:r.referencia||"-"}),e.jsx("td",{style:{padding:"0.75rem 0.6rem",textAlign:"center"},children:r.comprobante_url?e.jsxs("button",{type:"button",onClick:()=>ae(r.comprobante_url,`Comprobante Factura #${i==null?void 0:i.numero_factura}`,`${i==null?void 0:i.proveedor} • C$${parseFloat(r.monto).toLocaleString(void 0,{minimumFractionDigits:2})} • ${r.metodo_pago}`),style:{background:"#eff6ff",color:"#2563eb",border:"1px solid #bfdbfe",padding:"0.35rem 0.6rem",borderRadius:"8px",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"0.35rem",fontSize:"0.82rem",fontWeight:600},title:"Ver Comprobante",children:[ce(r.comprobante_url)?e.jsx(oe,{style:{color:"#ef4444"}}):e.jsx(Te,{style:{color:"#3b82f6"}}),e.jsx("span",{children:"Ver"})]}):e.jsx("span",{style:{color:"#94a3b8",fontSize:"0.85rem"},children:"—"})}),e.jsxs("td",{className:"amount",style:{padding:"0.75rem 0.6rem",color:"#10b981"},children:["C$",parseFloat(r.monto).toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsx("td",{style:{padding:"0.75rem 0.6rem",textAlign:"center"},children:e.jsxs("div",{style:{display:"flex",gap:"0.4rem",justifyContent:"center"},children:[e.jsx(x,{$secondary:!0,title:"Editar abono",style:{padding:"0.4rem 0.6rem",fontSize:"0.8rem",borderRadius:"8px"},onClick:()=>We(r),children:e.jsx(ke,{})}),e.jsx(x,{$danger:!0,title:"Eliminar abono",style:{padding:"0.4rem 0.6rem",fontSize:"0.8rem",borderRadius:"8px"},onClick:()=>Le(r.id,i==null?void 0:i.id),children:e.jsx(Pe,{})})]})})]},r.id||t))})]})}),e.jsx("div",{className:"mobile-history",style:{flexDirection:"column",gap:"0.75rem"},children:ve.map((r,t)=>e.jsxs("div",{style:{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:"14px",padding:"0.9rem",display:"flex",flexDirection:"column",gap:"0.6rem"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[e.jsx("span",{style:{fontSize:"0.85rem",color:"#64748b",fontWeight:600},children:I(r.fecha)}),e.jsx(ie,{bg:"#e2e8f0",text:"#334155",style:{fontSize:"0.75rem",padding:"2px 8px"},children:r.metodo_pago})]}),e.jsxs("div",{style:{fontSize:"1.15rem",fontWeight:800,color:"#10b981"},children:["C$",parseFloat(r.monto).toLocaleString(void 0,{minimumFractionDigits:2})]})]}),r.referencia&&e.jsxs("div",{style:{fontSize:"0.85rem",color:"#475569",background:"#fff",padding:"0.4rem 0.6rem",borderRadius:"8px",border:"1px solid #e2e8f0"},children:[e.jsx("span",{style:{color:"#94a3b8",fontSize:"0.72rem",textTransform:"uppercase",display:"block",fontWeight:700},children:"Referencia"}),r.referencia]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:"0.3rem",borderTop:"1px solid #f1f5f9"},children:[r.comprobante_url?e.jsxs("button",{type:"button",onClick:()=>ae(r.comprobante_url,`Comprobante Factura #${i==null?void 0:i.numero_factura}`,`${i==null?void 0:i.proveedor} • C$${parseFloat(r.monto).toLocaleString(void 0,{minimumFractionDigits:2})} • ${r.metodo_pago}`),style:{background:"#eff6ff",color:"#2563eb",border:"1px solid #bfdbfe",padding:"0.4rem 0.75rem",borderRadius:"8px",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"0.4rem",fontSize:"0.85rem",fontWeight:600},children:[ce(r.comprobante_url)?e.jsx(oe,{style:{color:"#ef4444"}}):e.jsx(Te,{style:{color:"#3b82f6"}}),e.jsx("span",{children:"Ver Comprobante"})]}):e.jsx("span",{style:{color:"#94a3b8",fontSize:"0.82rem"},children:"Sin comprobante"}),e.jsxs("div",{style:{display:"flex",gap:"0.4rem"},children:[e.jsx(x,{$secondary:!0,title:"Editar abono",style:{padding:"0.45rem 0.7rem",fontSize:"0.85rem",borderRadius:"8px"},onClick:()=>We(r),children:e.jsx(ke,{})}),e.jsx(x,{$danger:!0,title:"Eliminar abono",style:{padding:"0.45rem 0.7rem",fontSize:"0.85rem",borderRadius:"8px"},onClick:()=>Le(r.id,i==null?void 0:i.id),children:e.jsx(Pe,{})})]})]})]},r.id||t))})]}):e.jsxs("div",{style:{textAlign:"center",padding:"3rem",color:"#94a3b8",border:"1px dashed #cbd5e1",borderRadius:"16px"},children:[e.jsx(J,{style:{fontSize:"2rem",marginBottom:"1rem",opacity:.5}}),e.jsx("p",{children:"No existen abonos registrados para esta factura."})]})]})}),e.jsx(Nt,{doc:Rr,onClose:()=>dr(r=>({...r,show:!1}))})]})},Nt=({doc:a,onClose:g})=>{const[Re,P]=n.useState(1),[Ie,ee]=n.useState(0);if(n.useEffect(()=>{P(1),ee(0)},[a.url]),!a.show||!a.url)return null;const xe=()=>P(j=>Math.min(j+.25,3)),Oe=()=>P(j=>Math.max(j-.25,.5)),$=()=>{P(1),ee(0)},_=()=>ee(j=>(j+90)%360),O={background:"#334155",color:"#f8fafc",border:"none",borderRadius:"8px",padding:"0.5rem 0.75rem",fontSize:"0.9rem",cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"};return e.jsx(G,{onClick:g,style:{zIndex:1500},children:e.jsxs("div",{onClick:j=>j.stopPropagation(),style:{background:"#0f172a",color:"#fff",borderRadius:"20px",width:"95%",maxWidth:"850px",height:"88vh",display:"flex",flexDirection:"column",overflow:"hidden",boxShadow:"0 25px 50px -12px rgba(0,0,0,0.6)"},children:[e.jsxs("div",{style:{padding:"0.9rem 1.25rem",background:"#1e293b",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #334155",flexWrap:"wrap",gap:"0.5rem"},children:[e.jsxs("div",{style:{minWidth:"160px"},children:[e.jsx("div",{style:{fontWeight:800,fontSize:"1.05rem",color:"#f8fafc"},children:a.title}),a.subtitle&&e.jsx("div",{style:{fontSize:"0.82rem",color:"#94a3b8"},children:a.subtitle})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.4rem",flexWrap:"wrap"},children:[!a.isPdf&&e.jsxs(e.Fragment,{children:[e.jsx("button",{title:"Acercar (+)",onClick:xe,style:O,children:e.jsx(rt,{})}),e.jsx("button",{title:"Alejar (-)",onClick:Oe,style:O,children:e.jsx(tt,{})}),e.jsx("button",{title:"Restablecer",onClick:$,style:O,children:e.jsx(at,{})}),e.jsx("button",{title:"Rotar 90°",onClick:_,style:{...O,fontSize:"1.1rem",fontWeight:700},children:"↻"})]}),e.jsx("a",{href:a.url,download:!0,target:"_blank",rel:"noopener noreferrer",title:"Descargar / Abrir archivo",style:{...O,background:"#2563eb",color:"#fff",textDecoration:"none"},children:e.jsx(ot,{})}),e.jsx("button",{title:"Cerrar visor",onClick:g,style:{...O,background:"#ef4444",color:"#fff"},children:e.jsx(Z,{})})]})]}),e.jsx("div",{style:{flex:1,overflow:"auto",display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem",background:"#090d16",position:"relative"},children:a.isPdf?e.jsx("iframe",{src:a.url,title:a.title,style:{width:"100%",height:"100%",border:"none",borderRadius:"12px",background:"#fff"}}):e.jsx("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",width:"100%",height:"100%",overflow:"auto"},children:e.jsx("img",{src:a.url,alt:a.title,style:{maxWidth:"100%",maxHeight:"100%",objectFit:"contain",transform:`scale(${Re}) rotate(${Ie}deg)`,transition:"transform 0.2s ease",borderRadius:"8px",boxShadow:"0 10px 30px rgba(0,0,0,0.6)"}})})})]})})};export{It as default};

import{r as s,j as e,a0 as Ve,a1 as _e,aQ as qe,A as Ee,m as Oe,H as Ge,s as se,a6 as He,a7 as Ue,k as Je,b as Ye,R as $e,aM as Qe,b0 as Le,af as We,b2 as Ke,J as Re,x as Te,b3 as Xe,b4 as Ze,aT as et,ag as tt,b5 as at,a3 as ot,b6 as Ie,b7 as rt,b8 as nt,aa as it,aR as st,C as Fe,q as lt,b9 as dt,ba as ct,bb as pt}from"./vendor-89PWeEkY.js";import{g as ge,s as he,f as Pe,u as Me,a as mt}from"./index-D0OLLTV6.js";import{r as xt}from"./searchEngine-BMYcElFi.js";import{d as ft,S as O,h as gt,i as ht,j as bt,M as be,a as je,B as I,f as H,I as De}from"./POS.styles-9UD0bhEZ.js";import"./AlertModal-XBwzLuZq.js";const C=o=>{const g=Number(o);return isNaN(g)||!isFinite(g)?0:g};function ut(o){if(!Array.isArray(o)||o.length===0)return[];const g=new Set,a=[];for(const u of o)u.id&&g.has(u.id)||(u.id&&g.add(u.id),a.push(u));return a}const jt=(o,g=0,a=36.6)=>{const u=Math.max(0,C(g)),N=C(a)||36.6,d={ventasContado:[],devoluciones:[],cancelaciones:[],entradas:[],salidas:[],abonos:[],ajustes:[]};let n=0,r=0,j=0,f=0,F=0,z=0,M=0,c=0;const R=ut(Array.isArray(o)?o:[]);let t=0,m=0,x=0,T=0,X=0,p=0,w=0,W=0,U=0;for(const J of R){let h=((J==null?void 0:J.type)||"").toLowerCase().trim();h=h.normalize("NFD").replace(/[\u0300-\u036f]/g,"");let v=(J==null?void 0:J.pagoDetalles)||{};if(typeof v=="string")try{v=JSON.parse(v)}catch{v={}}(!v||typeof v!="object")&&(v={});const D=C(J.amount),le=C(v.totalVenta)||D,A=C(v.efectivo),V=C(v.dolares),ee=C(v.cambio),Q=C(v.ingresoCaja),$=C(v.tarjeta),y=C(v.transferencia),Y=C(v.credito);let L=le||D;(h==="salida"||h.includes("devolucion")||h.includes("cancelacion")||h.includes("anulacion"))&&(L=-Math.abs(L));const B={...J,pagoDetalles:v,displayAmount:L};if(h.startsWith("venta")||h.includes("abono")||h.includes("pedido")||h.includes("apartado")?(j+=$,f+=y,F+=Y):h==="ajuste"&&(v.target==="tarjeta"&&(j+=D),v.target==="credito"&&(F+=D),v.target==="transferencia"&&(f+=D)),h.startsWith("venta")){if(A>.001||V>.001||ee>.001)n+=A-ee,r+=V,t+=A-ee,m+=V;else if(Q>.001)n+=Q,t+=Q;else{const _=$+y+Y,E=le-_;E>.001&&(n+=E,t+=E)}x+=$,T+=y,X+=Y}else if(h.includes("abono")||h.includes("liquidación")||h.includes("liquidacion")||h.includes("pedido")){if(V>.001)r+=V,n+=A,w+=V,p+=A;else if(A>.001)n+=A,p+=A;else if(Q>.001)n+=Q,p+=Q;else{const _=$+y,E=Math.max(0,D-_);n+=E,p+=E}W+=$,U+=y}else if(h==="entrada")n+=Math.abs(D);else if(h==="salida")n-=Math.abs(D);else if(h.includes("devolucion")||h.includes("cancelacion")||h.includes("anulacion"))if(v.ingresoCaja!==void 0&&v.ingresoCaja!==null)n+=C(v.ingresoCaja);else if(A>.001)n-=A;else{const _=$+y+Y,E=Math.abs(D)-_;E>.001&&(n-=E)}else if(h==="ajuste")v.target==="efectivo"?(n+=D,v.hidden&&(c+=D)):v.target==="dolares"&&(r+=D);else{const _=$+y+Y,E=D-_;Math.abs(E)>.001&&(n+=E)}h.startsWith("venta")||h.includes("abono")||h.includes("liquid")||h.includes("pedido")?M+=Math.abs(L):h.includes("devolucion")||h.includes("cancelacion")||h.includes("anulacion")?M-=Math.abs(L):(h==="ajuste"&&v.target==="ventas_totales"||h==="ajuste"&&v.target==="efectivo"&&D<0)&&(M+=D),h.startsWith("venta")?d.ventasContado.push(B):h.includes("devolucion")?(d.devoluciones.push(B),z+=Math.abs(L)):h.includes("cancelacion")||h.includes("anulacion")?(d.cancelaciones.push(B),z+=Math.abs(L)):h==="entrada"?d.entradas.push(B):h==="salida"?d.salidas.push(B):h.includes("abono")?d.abonos.push(B):h==="ajuste"&&d.ajustes.push(B)}n=C(n),r=C(r),j=C(j),f=C(f),F=C(F),M=C(M),c=C(c),z=C(z);const Z=u+n,S=Z+r*N;return{cajaInicial:u,netCordobas:n,netDolares:r,efectivoEsperado:C(S),efectivoEsperadoCordobas:C(Z),efectivoEsperadoDolares:r,totalVentasDia:C(M),totalTarjeta:j,totalTransferencia:f,totalCredito:F,totalNoEfectivo:C(j+f+F),sumDevolucionesCancelaciones:z,totalHidden:c,tasaRef:N,lists:d,vEfectivoC:C(t),vEfectivoD:C(m),vTarjeta:C(x),vTransf:C(T),vCredito:C(X),aEfectivoC:C(p),aEfectivoD:C(w),aTarjeta:C(W),aTransf:C(U)}},ve=o=>Number(o||0).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});async function Ae(o,g=4){const a=localStorage.getItem("token"),u=o.filter(n=>{const r=ge(n);return!r||r!=="loading"&&r!=="none"});let N=0;async function d(){if(N>=u.length)return;const n=u[N++];if(ge(n))return d();he(n,"loading");try{const r=await Pe(n,a),j=(r==null?void 0:r.imagen)||null;he(n,j||"none")}catch{he(n,"none")}return d()}await Promise.all(Array.from({length:g},d))}function yt(o){const[g,a]=s.useState(()=>{const d=ge(o);return d&&d!=="loading"&&d!=="none"?d:null}),u=s.useRef(null),N=s.useCallback(async()=>{if(!o)return;const d=ge(o);if(!(d==="loading"||d==="none")){if(d&&d!=="loading"){a(d);return}he(o,"loading");try{const n=localStorage.getItem("token"),r=await Pe(o,n),j=(r==null?void 0:r.imagen)||null;he(o,j||"none"),a(j||null)}catch{he(o,"none"),a(null)}}},[o]);return s.useEffect(()=>{const d=ge(o);if(d&&d!=="loading"){a(d!=="none"?d:null);return}const n=setInterval(()=>{const j=ge(o);j&&j!=="loading"&&(a(j!=="none"?j:null),clearInterval(n))},200),r=new IntersectionObserver(j=>{j[0].isIntersecting&&N()},{rootMargin:"200px"});return u.current&&r.observe(u.current),()=>{r.disconnect(),clearInterval(n)}},[o,N]),{imgSrc:g,cardRef:u}}function vt({productId:o,productName:g,onView:a}){const{imgSrc:u,cardRef:N}=yt(o);return e.jsxs("div",{ref:N,className:"image-placeholder",style:{position:"relative",height:160,background:"#f8fafc",display:"flex",alignItems:"center",justifyContent:"center",borderBottom:"1px solid #f1f5f9",overflow:"hidden"},children:[u&&e.jsx("div",{className:"eye-icon",onClick:d=>{d.stopPropagation(),a(u)},style:{position:"absolute",top:10,left:10,zIndex:20,background:"white",borderRadius:"50%",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 6px rgba(0,0,0,0.1)",cursor:"pointer",transition:"transform 0.2s"},title:"Ver imagen",children:e.jsx(He,{size:14,color:"#64748b"})}),u?e.jsx("img",{src:u,alt:g,loading:"lazy",style:{maxWidth:"100%",maxHeight:"100%",objectFit:"contain"}}):e.jsx(Ue,{className:"no-image-icon",size:40,color:"#e2e8f0"})]})}const Be=se.button`
  display: flex; align-items: center; justify-content: center;
  width: 42px; height: 42px;
  border: 1px solid ${o=>o.$active?"#3b82f6":"#cbd5e1"};
  background-color: ${o=>o.$active?"#eff6ff":"#fff"};
  color: ${o=>o.$active?"#3b82f6":"#64748b"};
  border-radius: 8px; cursor: pointer; transition: all 0.2s;

  &:hover { border-color: #3b82f6; color: #3b82f6; }
`,Ct=({isOpen:o,imageSrc:g,onClose:a})=>!o||!g?null:e.jsx(be,{onClick:a,children:e.jsxs(Oe.div,{initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},onClick:u=>u.stopPropagation(),style:{position:"relative",maxWidth:"95%",maxHeight:"90vh"},children:[e.jsx("button",{onClick:a,style:{position:"absolute",top:-15,right:-15,background:"white",width:32,height:32,borderRadius:"50%",border:"none",cursor:"pointer",boxShadow:"0 4px 6px rgba(0,0,0,0.1)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10,color:"#ef4444"},children:e.jsx(Je,{})}),e.jsx("img",{src:g,alt:"Vista Ampliada",style:{maxWidth:"100%",maxHeight:"85vh",borderRadius:"12px",boxShadow:"0 20px 25px rgba(0,0,0,0.2)",background:"white",objectFit:"contain"}})]})});function At({products:o=[],searchTerm:g,setSearchTerm:a,onProductClick:u,cartItems:N=[],reservedStock:d,inputRef:n,searchType:r="description",setSearchType:j=()=>{},isWholesale:f=!1}){const[F,z]=s.useState({isOpen:!1,imageUrl:null}),M=s.useMemo(()=>{const t=new Map;for(const m of N){const x=m.id_producto||m.id;t.set(x,(t.get(x)||0)+Number(m.quantity||0))}return t},[N]),c=s.useMemo(()=>xt(o,g,["nombre","codigo","descripcion"],{strict:r==="code"}).slice(0,100),[o,g,r]);s.useEffect(()=>{const t=c.map(m=>m.id_producto||m.id);Ae(t,6)},[c]),s.useEffect(()=>{if(!o.length)return;const t=setTimeout(()=>{const m=o.map(x=>x.id_producto||x.id);Ae(m,2)},1500);return()=>clearTimeout(t)},[o]);const R=s.useMemo(()=>{const t=(g||"").toLowerCase().trim();return t?o.filter(m=>{const x=(m.nombre||"").toLowerCase(),T=String(m.codigo||"").toLowerCase();return x.includes(t)||T.includes(t)}).length:o.length},[o,g]);return e.jsxs(ft,{children:[e.jsxs("div",{style:{display:"flex",gap:"8px",marginBottom:"1rem",alignItems:"center"},children:[e.jsx(O,{ref:n,placeholder:r==="code"?"Escribe código...":"Buscar producto...",value:g,onChange:t=>a(t.target.value),onKeyDown:t=>{if(t.key==="Enter"){const m=(g||"").trim().toLowerCase();if(!m)return;const x=o.find(T=>String(T.codigo||"").toLowerCase()===m||String(T.codigo_barras||"").toLowerCase()===m);if(x){u(x),a("");return}c.length===1&&(u(c[0]),a(""))}}}),e.jsx(Be,{$active:r==="description",onClick:()=>{var t;j("description"),(t=n.current)==null||t.focus()},title:"Buscar por Nombre",children:e.jsx(Ve,{size:16})}),e.jsx(Be,{$active:r==="code",onClick:()=>{var t;j("code"),(t=n.current)==null||t.focus()},title:"Buscar por Código",children:e.jsx(_e,{size:18})})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"8px",padding:"0 4px",fontSize:"0.85rem",color:"#64748b"},children:[e.jsxs("span",{children:[e.jsx(qe,{color:"#3b82f6"})," ",c.length," mostrados"]}),e.jsxs("span",{children:["Total: ",R]})]}),e.jsx(gt,{children:e.jsx(Ee,{children:c.map((t,m)=>{const x=t.id_producto||t.id,T=M.get(x)||0,X=(d==null?void 0:d.get(x))||0,p=Math.max(0,Number(t.existencia||0)-T-X),w=p<=0;return e.jsxs(ht,{as:Oe.div,initial:{opacity:0,scale:.95},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.95},transition:{duration:.15},whileHover:w?{}:{scale:1.02,y:-4},whileTap:w?{}:{scale:.96},onClick:()=>!w&&u(t),outOfStock:w,title:t.nombre,children:[e.jsx(bt,{lowstock:p<5&&!w,outOfStock:w,children:w?"Agotado":`Stock: ${p}`}),e.jsx(vt,{productId:x,productName:t.nombre,onView:W=>z({isOpen:!0,imageUrl:W})}),e.jsxs("div",{className:"info",style:{padding:"12px",flex:1,display:"flex",flexDirection:"column",gap:"4px"},children:[e.jsx("div",{className:"product-name",style:{fontWeight:600,fontSize:"0.88rem",color:"#1e293b",lineHeight:"1.25",height:"3.8rem",overflow:"hidden",display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical"},children:t.nombre}),e.jsx("div",{style:{fontSize:"0.85rem",fontWeight:"bold",color:"#334155",marginBottom:"4px"},children:t.codigo||"S/C"}),f?e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:{fontSize:"0.75rem",color:"#64748b",display:"flex",alignItems:"center",gap:"4px",marginTop:"auto",marginBottom:"1px",textDecoration:"line-through"},children:["Tienda: C$ ",ve(t.precio_venta||t.precio)]}),e.jsxs("div",{className:"price",style:{fontWeight:800,color:"#8b5cf6",fontSize:"1.1rem"},children:["C$ ",ve(t.mayorista||t.mayoreo||t.distribuidor||t.taller||t.precio_venta)]})]}):e.jsxs(e.Fragment,{children:[(Number(t.mayorista)>0||Number(t.mayoreo)>0||Number(t.distribuidor)>0||Number(t.taller)>0)&&e.jsxs("div",{style:{fontSize:"0.75rem",color:"#10b981",display:"flex",alignItems:"center",gap:"4px",marginTop:"auto",marginBottom:"1px"},children:[e.jsx(Ge,{size:10})," May: C$ ",ve(t.mayorista||t.mayoreo||t.distribuidor||t.taller)]}),e.jsxs("div",{className:"price",style:{fontWeight:800,color:"#2563eb",fontSize:"1.05rem",marginTop:Number(t.mayorista)>0||Number(t.mayoreo)>0||Number(t.distribuidor)>0||Number(t.taller)>0?0:"auto"},children:["C$ ",ve(t.precio_venta||t.precio)]})]})]})]},x)})})}),e.jsx(Ee,{children:F.isOpen&&e.jsx(Ct,{isOpen:!0,imageSrc:F.imageUrl,onClose:()=>z({isOpen:!1,imageUrl:null})})})]})}const wt=$e.memo(()=>e.jsx("style",{children:`
  /* Importar League Spartan */
  @import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;600;800;900&display=swap');

  @media print {
    body { visibility: hidden; margin: 0; padding: 0; }
    .print-area, .print-area * { visibility: visible !important; }
    .print-area {
      position: absolute !important; left: 0 !important; top: 0 !important;
      z-index: 999999 !important; margin: 0 !important; padding: 0 !important;
    }
    .no-print { display: none !important; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-shadow: none !important; text-shadow: none !important; }
  }
  `})),St=se.div`
  font-family: 'League Spartan', 'Consolas', sans-serif; color: #000; background: #fff;
  width: 310px; margin: 0 auto; padding: 12px 6px;
  box-shadow: 0 0 10px rgba(0,0,0,.08); border: 1px solid #eee; border-radius: 8px;

  /* Encabezado */
  .brand { text-align: center; border-bottom: 3px solid #000; padding-bottom: 12px; margin-bottom: 15px; }
  .brand img { max-width: 120px; display: block; margin: 0 auto 10px; }
  .brand h2 { margin: 0 0 6px; font-size: 1.6rem; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; }
  .brand p { margin: 3px 0; font-size: 1rem; font-weight: 700; }

  /* Secciones y Filas */
  .section { margin-bottom: 18px; border-bottom: 1px dashed #000; padding-bottom: 12px; }
  .section:last-child { border-bottom: none; }
  .section-title { font-weight: 900; text-align: center; text-transform: uppercase; font-size: 1.2rem; margin-bottom: 10px; text-decoration: underline; letter-spacing: 0.5px; }
  
  .row { display: flex; justify-content: space-between; font-size: 1.1rem; margin-bottom: 6px; align-items: baseline; font-weight: 600; }
  .row.big { font-size: 1.5rem; font-weight: 900; margin-top: 12px; border-top: 3px solid #000; padding-top: 8px; }
  .row.sub { font-size: 0.9rem; color: #333; font-style: italic; padding-left: 10px; margin-bottom: 4px; font-weight: 400; }
  .row.alert { background: #eee; padding: 8px; font-weight: 900; text-align: center; justify-content: center; gap: 10px; border: 2px solid #000; margin-top: 12px; font-size: 1.4rem; }

  /* Tablas simples */
  table { width: 100%; border-collapse: collapse; font-size: 1rem; margin-top: 8px; }
  th { border-bottom: 2px solid #000; text-align: left; font-weight: 900; padding: 4px 2px; }
  td { border-bottom: 1px dashed #ccc; padding: 4px 2px; }
  .text-right { text-align: right; }

  /* Firma */
  .signature { margin-top: 60px; text-align: center; page-break-inside: avoid; }
  .signature-line { border-top: 2px solid #000; width: 80%; margin: 0 auto 8px; }
  .signature p { font-size: 1.1rem; font-weight: 700; }

  @media print {
    &.print-80 {
      width: 80mm !important; 
      font-family: 'League Spartan', sans-serif !important; 
      padding: 0px !important; border: none !important; box-shadow: none !important;
    }
  }
`,Bt=({currentUser:o,isCajaOpen:g,session:a,onOpenCaja:u,onCloseCaja:N,onClose:d,isAdmin:n,showConfirmation:r,showAlert:j,initialTasaDolar:f,clients:F=[]})=>{var ye,l;const[z,M]=s.useState(""),[c,R]=s.useState(f||36.6),[t,m]=s.useState(""),[x,T]=s.useState(!1),X=Ye(),p=(o==null?void 0:o.id_usuario)||(o==null?void 0:o.id);let w=(ye=a==null?void 0:a.openedBy)==null?void 0:ye.name;!w&&(a!=null&&a.openedBy)&&typeof a.openedBy=="string"&&(w=a.openedBy),w||(w=(a==null?void 0:a.userId)===p?(o==null?void 0:o.nombre_usuario)||(o==null?void 0:o.username):"Usuario"),w||(w="Caja General");const W=n||(a==null?void 0:a.userId)===p||((l=a==null?void 0:a.openedBy)==null?void 0:l.id)===p,U=s.useMemo(()=>Array.isArray(a==null?void 0:a.transactions)?a.transactions:[],[a]),Z=s.useMemo(()=>{const i=jt(U,(a==null?void 0:a.initialAmount)||0,(a==null?void 0:a.tasaDolar)||f);return a!=null&&a.stats&&a.stats.vEfectivoC!==void 0?{...a.stats,lists:a.stats.lists||i.lists}:i},[U,a,f]),{cajaInicial:S,netCordobas:J,netDolares:h,efectivoEsperado:v,efectivoEsperadoCordobas:D,efectivoEsperadoDolares:le,totalTarjeta:A,totalTransferencia:V,totalCredito:ee,totalNoEfectivo:Q,sumDevolucionesCancelaciones:$,totalHidden:y,tasaRef:Y,vEfectivoC:L,vEfectivoD:pe,vTarjeta:B,vTransf:_,vCredito:E,aEfectivoC:me,aEfectivoD:re,aTarjeta:ie,aTransf:te,lists:{ventasContado:xe,devoluciones:oe,cancelaciones:ke,entradas:K,salidas:q,abonos:ne}}=Z,de=(L||0)+(pe||0)*Y+(B||0)+(_||0)+(E||0)+(me||0)+(re||0)*Y+(ie||0)+(te||0)-($||0),P=Number(t||0)-v;a!=null&&a.openedAt&&new Date(a.openedAt);const Ce=()=>{const i=parseFloat(z||0);if(isNaN(i)||i<0)return j({title:"Inválido",message:"Monto inicial >= 0"});u(i,Number(c||36.6))},we=()=>{if(isNaN(parseFloat(t)))return j({title:"Requerido",message:"Ingrese el monto contado físico."});T(!0)},Se=$e.useCallback(()=>{const i=document.getElementById("print-wrapper-caja");if(!i)return;const k=i.outerHTML,G=`
        @charset "UTF-8";
        @import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;600;800;900&display=swap');
        @page { size: 80mm auto; margin: 0; }
        html, body {
          background: #fff; margin: 0 !important; padding: 0 !important;
          -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;
          color: #000 !important; font-family: 'League Spartan', sans-serif !important;
        }
        #print-wrapper-caja, #print-wrapper-caja * {
          color: #000 !important; font-weight: 700 !important;
          text-shadow: none !important; box-shadow: none !important;
          visibility: visible !important;
        }
        #print-wrapper-caja {
          width: 80mm !important; padding: 0 !important; border: none !important;
        }
        .brand h2 { font-size: 20pt !important; letter-spacing: 2px !important; margin-bottom: 5px !important; }
        .section-title { font-size: 14pt !important; margin-bottom: 12px !important; border-bottom: 2px solid #000 !important; }
        .row { font-size: 12pt !important; margin-bottom: 6px !important; font-weight: 900 !important; }
        .row.big { font-size: 16pt !important; margin-top: 15px !important; border-top: 4px solid #000 !important; }
        .row.alert { font-size: 18pt !important; padding: 10px !important; border: 4px solid #000 !important; }
        .text-right { text-align: right !important; }
        
        @media print {
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `,ae=window.open("","_blank","width=500,height=600");ae&&(ae.document.write(`<html><head><title>Cierre Caja</title><style>${G}</style></head><body>${k}</body></html>`),ae.document.close(),ae.focus(),ae.onload=function(){setTimeout(()=>{ae.print()},300)},ae.onafterprint=()=>{try{ae.close()}catch{}})},[]),Ne=()=>{Se(),setTimeout(()=>{N(Number(t))},800)},b=i=>`C$${Number(i||0).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`,fe=i=>`$${Number(i||0).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`;return e.jsxs(be,{className:"no-print",children:[e.jsx(wt,{}),e.jsxs(je,{style:{maxWidth:x?450:760,padding:x?0:"1.5rem",background:"#f8f9fa"},children:[!x&&e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12},children:[e.jsx("h2",{style:{margin:0},children:"Gestión de Caja"}),e.jsx(I,{$cancel:!0,onClick:d,style:{borderRadius:"50%",width:32,height:32,padding:0},children:"✕"})]}),g?x?e.jsxs("div",{style:{display:"flex",flexDirection:"column",height:"100%",maxHeight:"90vh"},children:[e.jsxs("div",{style:{padding:"15px 20px",background:"#343a40",color:"#fff",display:"flex",justifyContent:"space-between",alignItems:"center",borderRadius:"8px 8px 0 0"},children:[e.jsxs("div",{children:[e.jsx("h3",{style:{margin:0,fontSize:"1.2rem",fontWeight:"800",letterSpacing:"0.5px"},children:"REPORTAR CIERRE DE CAJA"}),e.jsx("p",{style:{margin:0,fontSize:"0.9rem",opacity:.8},children:new Date().toLocaleString("es-NI")})]}),e.jsxs(I,{$cancel:!0,onClick:()=>T(!1),style:{padding:"8px 15px",fontSize:"0.9rem",background:"rgba(255,255,255,0.2)",border:"none"},children:[e.jsx(Le,{})," Volver / Editar"]})]}),e.jsxs("div",{style:{flex:1,overflowY:"auto",background:"#f8f9fa",padding:"20px"},children:[e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:15,marginBottom:20},children:[e.jsxs("div",{style:{background:"#fff",padding:15,borderRadius:8,boxShadow:"0 2px 5px rgba(0,0,0,0.05)",borderLeft:"4px solid #007bff"},children:[e.jsx("div",{style:{fontSize:"0.8rem",color:"#666",textTransform:"uppercase"},children:"Ingresos Totales Netos"}),e.jsx("div",{style:{fontSize:"1.5rem",fontWeight:"800",color:"#333"},children:b(de)})]}),e.jsxs("div",{style:{background:"#fff",padding:15,borderRadius:8,boxShadow:"0 2px 5px rgba(0,0,0,0.05)",borderLeft:"4px solid #28a745"},children:[e.jsx("div",{style:{fontSize:"0.8rem",color:"#666",textTransform:"uppercase"},children:"Efectivo Real"}),e.jsx("div",{style:{fontSize:"1.5rem",fontWeight:"800",color:"#28a745"},children:b(t)})]}),e.jsxs("div",{style:{background:"#fff",padding:15,borderRadius:8,boxShadow:"0 2px 5px rgba(0,0,0,0.05)",borderLeft:`4px solid ${P<0?"#dc3545":"#ffc107"}`},children:[e.jsx("div",{style:{fontSize:"0.8rem",color:"#666",textTransform:"uppercase"},children:"Diferencia"}),e.jsxs("div",{style:{fontSize:"1.5rem",fontWeight:"800",color:P!==0?P<0?"#dc3545":"#e0a800":"#28a745"},children:[P>0?"+":"",b(P)]})]})]}),e.jsxs("div",{style:{background:"#fff",padding:20,borderRadius:8,boxShadow:"0 2px 10px rgba(0,0,0,0.05)",marginBottom:20},children:[e.jsx("h4",{style:{margin:"0 0 15px",borderBottom:"1px solid #eee",paddingBottom:10},children:"Arqueo Detallado"}),e.jsx("table",{style:{width:"100%",borderCollapse:"collapse"},children:e.jsxs("tbody",{children:[e.jsxs("tr",{style:{borderBottom:"1px solid #f1f1f1"},children:[e.jsx("td",{style:{padding:10},children:"Fondo Inicial"}),e.jsx("td",{className:"text-right",style:{padding:10,fontWeight:"bold"},children:b(S)})]}),e.jsx("tr",{style:{background:"#f8f9fa"},children:e.jsx("td",{colSpan:"2",style:{padding:"8px 10px",fontSize:"0.85rem",fontWeight:"bold",color:"#007bff"},children:"RESUMEN DE INGRESOS"})}),e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"4px 10px 4px 20px",fontSize:"0.9rem"},children:"(+) Ventas Netas (Ventas + Abonos - Devoluciones)"}),e.jsx("td",{className:"text-right",style:{padding:"4px 10px",fontSize:"0.9rem"},children:b(de)})]}),$>0&&e.jsxs("tr",{children:[e.jsxs("td",{style:{padding:"4px 10px 4px 20px",fontSize:"0.85rem",color:"#856404"},children:["    (Devoluciones/Cancel. ya descontadas: ",b($),")"]}),e.jsx("td",{})]}),e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"4px 10px 4px 20px",fontSize:"0.9rem",color:"#dc3545"},children:"(-) Tarjetas / Transf / Crédito"}),e.jsxs("td",{className:"text-right",style:{padding:"4px 10px",fontSize:"0.9rem",color:"#dc3545"},children:["- ",b(Q)]})]}),A>0&&e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"2px 10px 2px 35px",fontSize:"0.82rem",color:"#6c757d"},children:"💳 Tarjeta"}),e.jsx("td",{className:"text-right",style:{padding:"2px 10px",fontSize:"0.82rem",color:"#6c757d"},children:b(A)})]}),V>0&&e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"2px 10px 2px 35px",fontSize:"0.82rem",color:"#6c757d"},children:"🏦 Transferencia"}),e.jsx("td",{className:"text-right",style:{padding:"2px 10px",fontSize:"0.82rem",color:"#6c757d"},children:b(V)})]}),ee>0&&e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"2px 10px 2px 35px",fontSize:"0.82rem",color:"#6c757d"},children:"📋 Crédito"}),e.jsx("td",{className:"text-right",style:{padding:"2px 10px",fontSize:"0.82rem",color:"#6c757d"},children:b(ee)})]}),K.length>0&&e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"4px 10px 4px 20px",fontSize:"0.9rem",color:"#28a745"},children:"(+) Entradas de Efectivo"}),e.jsxs("td",{className:"text-right",style:{padding:"4px 10px",fontSize:"0.9rem",color:"#28a745"},children:["+ ",b(K.reduce((i,k)=>i+Math.abs(k.displayAmount||0),0))]})]}),e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"4px 10px 4px 20px",fontSize:"0.9rem",color:"#dc3545"},children:"(-) Salidas de Efectivo"}),e.jsxs("td",{className:"text-right",style:{padding:"4px 10px",fontSize:"0.9rem",color:"#dc3545"},children:["- ",b(q.reduce((i,k)=>i+Math.abs(k.displayAmount||0),0))]})]}),e.jsxs("tr",{style:{borderBottom:"1px solid #f1f1f1",background:"#e8f5e9"},children:[e.jsx("td",{style:{padding:10,fontWeight:"bold",fontSize:"1.1rem"},children:"Esperado en Caja"}),e.jsx("td",{className:"text-right",style:{padding:10,fontWeight:"bold",fontSize:"1.1rem",color:"#146c43"},children:b(v)})]})]})})]}),(ne.length>0||K.length>0||q.length>0)&&e.jsxs("div",{style:{background:"#fff",padding:20,borderRadius:8,boxShadow:"0 2px 10px rgba(0,0,0,0.05)"},children:[e.jsx("h4",{style:{margin:"0 0 15px",borderBottom:"1px solid #eee",paddingBottom:10},children:"Detalle de Movimientos"}),K.length>0&&e.jsxs("div",{style:{marginBottom:15},children:[e.jsx("h5",{style:{color:"#28a745",margin:"0 0 5px"},children:"Entradas de Caja"}),K.map((i,k)=>e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px dashed #eee"},children:[e.jsx("div",{children:i.note||"Entrada Varia"}),e.jsxs("div",{style:{fontWeight:"bold",color:"#28a745"},children:["+ ",b(Math.abs(i.amount))]})]},k))]}),ne.length>0&&e.jsxs("div",{style:{marginBottom:15},children:[e.jsx("h5",{style:{color:"#007bff",margin:"0 0 5px"},children:"Abonos Recibidos"}),ne.map((i,k)=>e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px dashed #eee"},children:[e.jsxs("div",{children:[e.jsx("strong",{children:i.resolvedClientName||"Cliente General"}),e.jsx("div",{style:{fontSize:"0.8rem",color:"#666"},children:i.note||"Abono de cuenta"})]}),e.jsxs("div",{style:{fontWeight:"bold",color:"#28a745"},children:["+ ",b(i.amount)]})]},k))]}),q.length>0&&e.jsxs("div",{children:[e.jsx("h5",{style:{color:"#dc3545",margin:"0 0 5px"},children:"Salidas de Caja"}),q.map((i,k)=>e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px dashed #eee"},children:[e.jsx("div",{children:i.note||"Salida Varia"}),e.jsx("div",{style:{fontWeight:"bold",color:"#dc3545"},children:b(Math.abs(i.amount))})]},k))]})]})]}),e.jsx("div",{style:{display:"none"},children:e.jsxs(St,{id:"print-wrapper-caja",className:"print-80",children:[e.jsxs("div",{className:"brand",children:[e.jsx("img",{src:"/icons/logo.png",alt:"Logo",style:{filter:"grayscale(100%) contrast(150%)"}}),e.jsx("h2",{children:"CIERRE DE CAJA"}),e.jsx("p",{children:"Multirepuestos RG"}),e.jsx("p",{children:new Date().toLocaleString("es-NI")}),e.jsxs("p",{children:["Cajero: ",w]})]}),e.jsxs("div",{className:"section",children:[e.jsx("div",{className:"section-title",children:"1. INGRESOS TOTALES NETOS"}),e.jsxs("div",{className:"row big",children:[e.jsx("span",{children:"TOTAL NETO:"}),e.jsx("span",{children:b(de)})]}),e.jsx("div",{className:"row sub",children:"(Ventas + Abonos - Devoluciones/Cancelaciones)"}),$>0&&e.jsxs("div",{className:"row sub",style:{color:"#856404"},children:["(Devol./Cancel.: -",b($),")"]})]}),e.jsxs("div",{className:"section",children:[e.jsx("div",{className:"section-title",children:"2. DESGLOSE NO EFECTIVO"}),A>0&&e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"(-) Tarjetas:"}),e.jsx("span",{children:b(A)})]}),V>0&&e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"(-) Transf.:"}),e.jsx("span",{children:b(V)})]}),ee>0&&e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"(-) Créditos:"}),e.jsx("span",{children:b(ee)})]}),e.jsxs("div",{className:"row",style:{borderTop:"1px dashed #000"},children:[e.jsx("span",{children:"TOTAL NO EFECTIVO:"}),e.jsx("span",{children:b(Q)})]})]}),e.jsxs("div",{className:"section",children:[e.jsx("div",{className:"section-title",children:"3. FLUJO EFECTIVO (RESUMEN)"}),e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"Fondo Inicial:"}),e.jsx("span",{children:b(S)})]}),e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"(+) Ingresos Netos:"}),e.jsx("span",{children:b(de)})]}),e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"(-) No Efectivo:"}),e.jsxs("span",{children:["-",b(Q)]})]}),Math.abs(q.reduce((i,k)=>i+Math.abs(k.displayAmount||0),0))>0&&e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"(-) Salidas:"}),e.jsxs("span",{children:["-",b(q.reduce((i,k)=>i+Math.abs(k.displayAmount||0),0))]})]})]}),e.jsxs("div",{className:"section",children:[e.jsx("div",{className:"section-title",children:"4. ARQUEO FINAL"}),e.jsxs("div",{className:"row big",children:[e.jsx("span",{children:"EFECTIVO ESPERADO:"}),e.jsx("span",{children:b(v)})]}),e.jsxs("div",{className:"row sub",children:["(",b(D)," + ",fe(le),")"]}),e.jsxs("div",{className:"row",style:{marginTop:8,paddingTop:4,borderTop:"1px dashed #ccc"},children:[e.jsx("span",{children:"EFECTIVO REAL:"}),e.jsx("span",{children:b(t)})]}),e.jsxs("div",{className:"row alert",style:{color:"#000",borderColor:"#000"},children:[e.jsx("span",{children:"DIFERENCIA:"}),e.jsxs("span",{children:[P>0?"+":"",b(P)]})]}),e.jsx("div",{style:{textAlign:"center",fontSize:"0.75rem",fontWeight:"bold",marginTop:2},children:Math.abs(P)<.5?"(CAJA CUADRADA)":P>0?"(SOBRANTE)":"(FALTANTE)"})]}),e.jsxs("div",{className:"section",children:[e.jsx("div",{className:"section-title",children:"5. DETALLE DE MOVIMIENTOS"}),e.jsx("table",{style:{marginTop:0},children:e.jsxs("tbody",{children:[ne.length>0&&e.jsxs(e.Fragment,{children:[e.jsx("tr",{children:e.jsx("td",{colSpan:"2",style:{fontWeight:"900",background:"#f8f9fa",fontSize:"0.9rem"},children:"--- ABONOS Y CREDITOS ---"})}),ne.map((i,k)=>e.jsxs("tr",{children:[e.jsxs("td",{style:{fontSize:"0.9rem"},children:[i.resolvedClientName||i.note||"Abono"," ",e.jsx("br",{}),e.jsxs("span",{style:{fontSize:"0.75rem",color:"#555"},children:["#",i.id]})]}),e.jsx("td",{className:"text-right",style:{fontSize:"0.9rem"},children:b(i.amount)})]},"a"+k))]}),q.length>0&&e.jsxs(e.Fragment,{children:[e.jsx("tr",{children:e.jsx("td",{colSpan:"2",style:{fontWeight:"900",background:"#f8f9fa",fontSize:"0.9rem",paddingTop:8},children:"--- SALIDAS DE EFECTIVO ---"})}),q.map((i,k)=>e.jsxs("tr",{children:[e.jsx("td",{style:{fontSize:"0.9rem"},children:i.note||"Salida Varia"}),e.jsx("td",{className:"text-right",style:{fontSize:"0.9rem"},children:b(Math.abs(i.amount))})]},"s"+k))]}),K.length>0&&e.jsxs(e.Fragment,{children:[e.jsx("tr",{children:e.jsx("td",{colSpan:"2",style:{fontWeight:"900",background:"#f8f9fa",fontSize:"0.9rem",paddingTop:8},children:"--- ENTRADAS DE EFECTIVO ---"})}),K.map((i,k)=>e.jsxs("tr",{children:[e.jsx("td",{style:{fontSize:"0.9rem"},children:i.note||"Entrada Varia"}),e.jsx("td",{className:"text-right",style:{fontSize:"0.9rem"},children:b(i.amount)})]},"e"+k))]})]})}),ne.length===0&&q.length===0&&K.length===0&&e.jsx("div",{style:{textAlign:"center",fontStyle:"italic",fontSize:"0.8rem",padding:5},children:"Sin movimientos extra"})]}),e.jsxs("div",{className:"signature",children:[e.jsx("div",{className:"signature-line"}),e.jsx("p",{children:"Firma Responsable"})]})]})}),e.jsxs("div",{style:{padding:"20px",background:"#fff",borderTop:"1px solid #ccc",display:"flex",gap:10,justifyContent:"flex-end"},children:[e.jsx(I,{$cancel:!0,onClick:()=>T(!1),children:"Seguir Editando"}),e.jsxs(I,{primary:!0,style:{padding:"12px 24px",fontSize:"1rem",display:"flex",alignItems:"center",gap:8},onClick:Ne,disabled:!W,children:[e.jsx(We,{})," IMPRIMIR Y CERRAR CAJA"]})]}),!W&&e.jsx("div",{style:{padding:5,textAlign:"center",color:"red",fontSize:"0.8rem"},children:"Solo el Admin o quien abrió puede cerrar."})]}):e.jsxs("div",{children:[e.jsx("h3",{style:{color:"#dc3545",borderBottom:"2px solid #dc3545",paddingBottom:10},children:"Arqueo y Cierre"}),e.jsx("div",{style:{background:"#e9ecef",padding:10,borderRadius:6,marginBottom:15},children:e.jsxs(H,{style:{fontSize:"1.1rem"},children:[e.jsxs("span",{children:[e.jsx(Ke,{})," Abrió:"]}),e.jsx("strong",{children:w})]})}),e.jsxs("div",{style:{marginTop:8,padding:"15px",backgroundColor:"#f8f9fa",borderRadius:6,border:"1px dashed #ced4da"},children:[e.jsx("div",{style:{fontWeight:"800",marginBottom:10,fontSize:"1.2rem",color:"#495057"},children:"Efectivo a Tener:"}),e.jsxs(H,{style:{fontSize:"1.3rem"},children:[e.jsx("span",{children:"Córdobas:"}),e.jsxs("strong",{style:{color:"#198754"},children:["C$ ",Number(D).toLocaleString()]})]}),e.jsxs(H,{style:{fontSize:"1.3rem"},children:[e.jsx("span",{children:"Dólares:"}),e.jsxs("strong",{style:{color:"#198754"},children:["$ ",Number(le).toLocaleString()]})]}),e.jsxs(H,{$bold:!0,style:{marginTop:10,borderTop:"2px solid #ccc",paddingTop:10,fontSize:"1.5rem"},children:[e.jsx("span",{children:"TOTAL (C$):"}),e.jsx("span",{children:b(v)})]})]}),Q>0&&e.jsxs("div",{style:{marginTop:12,padding:"12px 15px",backgroundColor:"#fff3cd",borderRadius:6,border:"1px solid #ffc107"},children:[e.jsx("div",{style:{fontWeight:"800",marginBottom:8,fontSize:"1rem",color:"#856404"},children:"Desglose No Efectivo:"}),A>0&&e.jsxs(H,{style:{fontSize:"1.1rem"},children:[e.jsx("span",{children:"💳 Tarjeta:"}),e.jsx("strong",{children:b(A)})]}),V>0&&e.jsxs(H,{style:{fontSize:"1.1rem"},children:[e.jsx("span",{children:"🏦 Transferencia:"}),e.jsx("strong",{children:b(V)})]}),ee>0&&e.jsxs(H,{style:{fontSize:"1.1rem"},children:[e.jsx("span",{children:"📋 Crédito:"}),e.jsx("strong",{children:b(ee)})]}),e.jsxs(H,{$bold:!0,style:{marginTop:6,borderTop:"1px dashed #856404",paddingTop:6,fontSize:"1.15rem",color:"#856404"},children:[e.jsx("span",{children:"Total No Efectivo:"}),e.jsx("span",{children:b(Q)})]})]}),e.jsx("label",{style:{display:"block",marginTop:20,fontWeight:800,fontSize:"1.3rem"},children:"Monto Contado Físico (C$)"}),e.jsx(O,{type:"number",step:"0.01",value:t,onChange:i=>m(i.target.value),autoFocus:!0,placeholder:"Total Billetes + Monedas",style:{fontSize:"1.5rem",padding:"12px",height:"auto"}}),t&&e.jsxs(H,{$bold:!0,style:{marginTop:15,color:P!==0?"#dc3545":"#28a745",fontSize:"1.8rem",padding:"10px",background:P!==0?"#fff5f5":"#f0fff4",borderRadius:8,border:`2px solid ${P!==0?"#dc3545":"#28a745"}`},children:[e.jsx("span",{children:"Diferencia:"}),e.jsx("span",{children:b(P)})]}),e.jsxs("div",{style:{display:"flex",gap:10,marginTop:20},children:[e.jsx(I,{primary:!0,style:{flex:1},onClick:we,disabled:!W||!t,children:"Ver Reporte"}),e.jsx(I,{$cancel:!0,onClick:d,children:"Cancelar"})]})]}):e.jsxs("div",{style:{padding:x?"1rem":0},children:[e.jsxs("h3",{style:{color:"#28a745",borderBottom:"2px solid #28a745",paddingBottom:10},children:[e.jsx(Qe,{})," Abrir Caja"]}),e.jsxs("div",{style:{display:"grid",gap:12},children:[e.jsx("label",{style:{fontWeight:600},children:"Monto Inicial (C$)"}),e.jsx(O,{type:"number",step:"0.01",value:z,onChange:i=>M(i.target.value),autoFocus:!0}),e.jsx("label",{style:{fontWeight:600},children:"Tasa del Dólar"}),e.jsx(O,{type:"number",step:"0.01",value:c,onChange:i=>R(i.target.value)})]}),e.jsxs("div",{style:{marginTop:20,display:"flex",gap:10},children:[e.jsx(I,{primary:!0,style:{flex:1},onClick:Ce,children:"Abrir Caja"}),e.jsx(I,{onClick:()=>X("/dashboard"),children:"Ir al Dashboard"})]})]})]})]})},ue=o=>{const g=parseFloat(o);return Number.isNaN(g)||Math.abs(g)<.001?0:g},Ot=({total:o=0,tasaDolar:g=1,onClose:a,onFinishSale:u,clientes:N=[],empleados:d=[],users:n=[],showAlert:r,initialClientId:j="0",cartSnapshot:f=[],currentUserId:F=void 0,orderSubtotal:z=void 0,orderDiscountAmount:M=void 0})=>{const[c,R]=s.useState("0.00"),[t,m]=s.useState("0.00"),[x,T]=s.useState("0.00"),[X,p]=s.useState("0.00"),[w,W]=s.useState(""),[U,Z]=s.useState(""),[S,J]=s.useState("contado"),[h,v]=s.useState(j??"0"),[D,le]=s.useState(""),[A,V]=s.useState(!1),[ee,Q]=s.useState(!1),$=s.useMemo(()=>{const l=parseInt(h,10);return Number.isNaN(l)?0:l},[h]),y=$!==0,Y=s.useMemo(()=>ue(c),[c]),L=s.useMemo(()=>ue(t),[t]),pe=s.useMemo(()=>ue(x),[x]),B=s.useMemo(()=>ue(X),[X]),_=s.useMemo(()=>pe*Number(g||1),[pe,g]),E=s.useMemo(()=>Y+L+B+_,[Y,L,B,_]),me=s.useMemo(()=>L>.01,[L]),re=s.useMemo(()=>Number(o)-E,[o,E]),ie=s.useMemo(()=>S==="credito"&&y&&re>.01?re:(E>=Number(o)-1e-4,0),[S,y,re,E,o]),te=s.useMemo(()=>{const l=ue(re);return l<=.01||S==="credito"&&y?0:l},[re,S,y]),xe=s.useMemo(()=>Math.max(0,-re),[re]),oe=s.useMemo(()=>ie>.01?E>.01?"mixto":"credito_total":"contado",[ie,E]),ke=s.useMemo(()=>{if(te>.01)return"PAGO INCOMPLETO";if((oe==="mixto"||oe==="credito_total")&&!y)return"CLIENTE NO SELECCIONADO";switch(oe){case"mixto":return"PAGO MIXTO (Contado + Crédito)";case"credito_total":return"CRÉDITO TOTAL";default:return"CONTADO"}},[oe,te,y]),K=s.useMemo(()=>S==="credito"&&!y,[S,y]),q=s.useMemo(()=>A||te>.01||(oe==="mixto"||oe==="credito_total")&&!y||me&&!w.trim()||B>.01&&!U.trim(),[A,te,oe,y,me,w,B,U]),ne=s.useMemo(()=>Array.isArray(f)?f.map(({raw:l,costo:i,existencia:k,...G})=>({id:G.id||G.id_producto,nombre:G.nombre??G.descripcion??G.producto??"",quantity:Number(G.quantity||0),precio:Number(G.precio_venta??G.precio??0)})).filter(l=>l.quantity>0):[],[f]),de=s.useMemo(()=>typeof z=="number"?Number(z):ne.reduce((l,i)=>l+Number(i.precio||0)*Number(i.quantity||0),0),[z,ne]);s.useMemo(()=>{if(typeof M=="number")return Number(M);const l=Number(de)-Number(o);return l>0?l:0},[M,de,o]),s.useEffect(()=>{S==="contado"&&E===0&&Number(o)>0&&R(Number(o).toFixed(2)),S==="credito"&&!y&&v("0")},[S,o]);const P=s.useCallback(l=>{const i=String(l.target.value);v(i),(parseInt(i,10)||0)!==0&&(J("contado"),E<Number(o)&&E===0&&R(Number(o).toFixed(2)))},[E,o]),Ce=s.useCallback(()=>{J("contado");const l=L+B+_,i=Math.max(0,Number(o)-l);R(Number(i).toFixed(2))},[L,B,_,o]),we=s.useCallback(()=>{if(!y){r==null||r({title:"Cliente Requerido",message:"Debe seleccionar un cliente para habilitar la opción de Crédito.",type:"error"});return}J("credito"),R("0.00"),m("0.00"),T("0.00"),p("0.00"),W(""),Z("")},[y,r]),Se=s.useCallback(()=>{R(Number(o).toFixed(2)),m("0.00"),T("0.00"),p("0.00"),W(""),Z(""),J("contado")},[o]),Ne=({efectivo:l,tarjeta:i,transferencia:k,dolaresLocal:G,credito:ae})=>{const ze=l+i+k+G>.01;return ae&&ze?"mixto":ae&&!ze?"credito_total":"contado"},b=async l=>{if(!y||$===0){r==null||r({title:"Cliente Requerido",message:"No puedes vender sin seleccionar un cliente. Por favor selecciona uno.",type:"error"});return}if((oe==="credito_total"||oe==="mixto")&&$===0){r==null||r({title:"Cliente Requerido",message:"Debe seleccionar un cliente para ventas a crédito o mixtas.",type:"error"});return}if(te>.01){r==null||r({title:"Pago Incompleto",message:`Faltan C$${te.toFixed(2)} para completar la venta.`,type:"warning"});return}if(me&&!w.trim()){r==null||r({title:"Dato Requerido",message:"Ingrese el número de referencia para el pago con tarjeta.",type:"warning"});return}if(B>.01&&!U.trim()){r==null||r({title:"Dato Requerido",message:"Ingrese el número de referencia para la transferencia.",type:"warning"});return}if(A)return;V(!0);const i=Math.max(0,Y+_-xe),k={totalVenta:Number(o),efectivo:Y,tarjeta:L,transferencia:B,dolares:pe,tasaDolarAlMomento:Number(g),referenciaTarjeta:w.trim(),referenciaTransferencia:U.trim(),credito:ie,clienteId:$,empleadoId:D||null,tipoVenta:Ne({efectivo:Y,tarjeta:L,transferencia:B,dolaresLocal:_,credito:ie}),cambio:Number(xe),ingresoCaja:Number(i),shouldPrintNow:l};try{typeof u=="function"&&await u(k),a==null||a()}catch(G){r==null||r({title:"Error",message:(G==null?void 0:G.message)||"No se pudo completar la venta.",type:"error"})}finally{V(!1)}},fe=y?te>.01?"#dc3545":xe>.01?"#28a745":"#17a2b8":"#dc3545",ye=y?te>.01?`¡FALTA CUBRIR! C$${te.toFixed(2)}`:xe>.01?`CAMBIO A ENTREGAR: C$${xe.toFixed(2)}`:"BALANCE PERFECTO":"¡SELECCIONA UN CLIENTE!";return e.jsx(be,{children:e.jsxs(je,{style:{maxWidth:"950px",width:"96%",maxHeight:"90vh",overflow:"hidden",borderRadius:16,backgroundColor:"#f8f9fa",boxShadow:"0 25px 50px -12px rgba(0, 0, 0, 0.25)"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"2px solid #e9ecef",paddingBottom:15,marginBottom:20},children:[e.jsxs("h2",{style:{margin:0,color:"#1e293b",fontSize:"1.5rem",fontWeight:800},children:[e.jsx(Re,{style:{marginRight:"0.5rem",color:"#007bff"}})," PROCESAR PAGO"]}),e.jsx(I,{$cancel:!0,onClick:a,style:{borderRadius:"50%",width:40,height:40,padding:0,fontSize:"1.2rem",backgroundColor:"#fee2e2",color:"#ef4444",borderColor:"transparent"},children:e.jsx(Te,{})})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"5fr 4fr",gap:"2rem",height:"calc(90vh - 140px)"},children:[e.jsxs("div",{style:{paddingRight:10,borderRight:"1px solid #e2e8f0",overflowY:"auto",paddingBottom:10},children:[e.jsxs("div",{style:{padding:20,border:"1px solid #e2e8f0",borderRadius:12,backgroundColor:"#fff",marginBottom:20,boxShadow:"0 1px 3px rgba(0,0,0,0.05)"},children:[e.jsxs("h4",{style:{marginTop:0,color:"#334155",fontSize:"1rem",fontWeight:700,textTransform:"uppercase",marginBottom:15},children:[e.jsx(Xe,{style:{marginRight:6}})," Tipo de Venta"]}),e.jsxs("div",{style:{display:"flex",gap:12,marginBottom:20},children:[e.jsx(I,{onClick:Ce,style:{flex:1,padding:"10px 0",backgroundColor:S==="contado"?"#0ea5e9":"#f1f5f9",color:S==="contado"?"#fff":"#475569",border:"none",borderRadius:8,fontWeight:"700",boxShadow:S==="contado"?"0 4px 6px -1px rgba(14, 165, 233, 0.4)":"none"},children:"CONTADO"}),e.jsx(I,{onClick:we,disabled:!y,style:{flex:1,padding:"10px 0",backgroundColor:S==="credito"?"#f59e0b":"#f1f5f9",color:S==="credito"?"#fff":"#475569",border:"none",borderRadius:8,fontWeight:"700",boxShadow:S==="credito"?"0 4px 6px -1px rgba(245, 158, 11, 0.4)":"none",opacity:y?1:.5},children:"CRÉDITO"})]}),e.jsxs("label",{style:{display:"block",fontWeight:"700",marginBottom:8,color:"#475569",fontSize:"0.9rem"},children:[e.jsx(Ze,{})," Seleccionar Cliente ",e.jsx("span",{style:{color:"#ef4444"},children:"* (Obligatorio)"})]}),e.jsxs(O,{as:"select",value:h,onChange:P,style:{height:42,padding:"0 12px",width:"100%",fontSize:"1rem",border:y?"2px solid #22c55e":"2px solid #ef4444",backgroundColor:y?"#f0fdf4":"#fef2f2",borderRadius:8},children:[e.jsx("option",{value:"0",children:"-- Seleccionar Cliente --"}),(N||[]).map(l=>e.jsxs("option",{value:l.id_cliente??l.id,children:[l.nombre,Number(l.saldo_pendiente||0)>0?` (Deuda: C$${Number(l.saldo_pendiente).toFixed(2)})`:""]},l.id_cliente??l.id))]}),!y&&e.jsxs("p",{style:{color:"#ef4444",margin:"8px 0 0",fontSize:"0.85rem",fontWeight:"600"},children:[e.jsx(Te,{style:{marginRight:4}})," No puedes vender sin seleccionar un cliente."]}),e.jsxs("div",{style:{marginTop:20},children:[e.jsxs("label",{style:{display:"block",fontWeight:"700",marginBottom:8,color:"#475569",fontSize:"0.9rem"},children:[e.jsx(et,{})," Atendido por (opcional):"]}),e.jsxs("select",{value:D,onChange:l=>le(l.target.value),style:{width:"100%",padding:"10px 12px",fontSize:"1rem",borderRadius:8,border:"1px solid #cbd5e1",background:"#f8fafc",height:42},children:[e.jsx("option",{value:"",children:"-- Sin Empleado --"}),(d||[]).map(l=>e.jsx("option",{value:l.id_empleado,children:l.nombre},l.id_empleado))]})]})]}),e.jsxs("div",{style:{padding:20,border:"1px solid #e2e8f0",borderRadius:12,backgroundColor:"#fff",boxShadow:"0 1px 3px rgba(0,0,0,0.05)"},children:[e.jsx("h4",{style:{marginTop:0,color:"#334155",fontSize:"1rem",fontWeight:700,textTransform:"uppercase",borderBottom:"1px solid #f1f5f9",paddingBottom:10,marginBottom:15},children:"Desglose de Pago (C$)"}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"15px"},children:[e.jsxs("div",{children:[e.jsxs("label",{style:{display:"block",fontWeight:"600",fontSize:"0.85rem",marginBottom:6,color:"#64748b"},children:[e.jsx(tt,{})," Efectivo"]}),e.jsx(O,{type:"number",step:"0.01",value:c,onChange:l=>R(l.target.value),style:{width:"100%",height:38,fontSize:"1rem",borderRadius:8,border:"1px solid #cbd5e1"},disabled:K})]}),e.jsxs("div",{children:[e.jsxs("label",{style:{display:"block",fontWeight:"600",fontSize:"0.85rem",marginBottom:6,color:"#64748b"},children:[e.jsx(at,{})," Dólares"]}),e.jsx(O,{type:"number",step:"0.01",value:x,onChange:l=>T(l.target.value),style:{width:"100%",height:38,fontSize:"1rem",borderRadius:8,border:"1px solid #cbd5e1"},disabled:K})]}),e.jsxs("div",{children:[e.jsxs("label",{style:{display:"block",fontWeight:"600",fontSize:"0.85rem",marginBottom:6,color:"#64748b"},children:[e.jsx(Re,{})," Tarjeta"]}),e.jsx(O,{type:"number",step:"0.01",value:t,onChange:l=>m(l.target.value),style:{width:"100%",height:38,fontSize:"1rem",borderRadius:8,border:"1px solid #cbd5e1"},disabled:K})]}),e.jsxs("div",{children:[e.jsxs("label",{style:{display:"block",fontWeight:"600",fontSize:"0.85rem",marginBottom:6,color:"#64748b"},children:[e.jsx(Le,{})," Transferencia"]}),e.jsx(O,{type:"number",step:"0.01",value:X,onChange:l=>p(l.target.value),style:{width:"100%",height:38,fontSize:"1rem",borderRadius:8,border:"1px solid #cbd5e1"},disabled:K})]})]}),S==="credito"&&e.jsxs("div",{style:{marginTop:15,padding:12,backgroundColor:"#fff7ed",borderRadius:8,border:"1px dashed #f97316"},children:[e.jsxs("label",{style:{display:"block",fontWeight:"700",fontSize:"0.85rem",marginBottom:4,color:"#c2410c"},children:[e.jsx(ot,{})," CRÉDITO GENERADO"]}),e.jsxs("div",{style:{fontSize:"1.2rem",color:"#ea580c",fontWeight:800},children:["C$ ",ie.toFixed(2)]})]}),me&&e.jsxs("div",{style:{marginTop:15,padding:12,border:"1px solid #fcd34d",borderRadius:8,backgroundColor:"#fffbeb"},children:[e.jsxs("label",{style:{display:"block",fontWeight:"700",fontSize:"0.85rem",color:"#b45309",marginBottom:6},children:[e.jsx(Ie,{})," Nº Referencia Tarjeta ",e.jsx("span",{style:{color:"#ef4444"},children:"*"})]}),e.jsx(O,{type:"text",placeholder:"Ej: 1234",value:w,onChange:l=>W(l.target.value),style:{width:"100%",height:36,fontSize:"0.95rem"}})]}),B>.01&&e.jsxs("div",{style:{marginTop:15,padding:12,border:"1px solid #bae6fd",borderRadius:8,backgroundColor:"#f0f9ff"},children:[e.jsxs("label",{style:{display:"block",fontWeight:"700",fontSize:"0.85rem",color:"#0369a1",marginBottom:6},children:[e.jsx(Ie,{})," Nº Referencia Transferencia ",e.jsx("span",{style:{color:"#ef4444"},children:"*"})]}),e.jsx(O,{type:"text",placeholder:"Ej: REF-5678",value:U,onChange:l=>Z(l.target.value),style:{width:"100%",height:36,fontSize:"0.95rem"}})]}),S==="contado"&&e.jsxs(I,{info:!0,onClick:Se,style:{width:"100%",padding:"12px 0",marginTop:20,backgroundColor:"#e0f2fe",color:"#0284c7",border:"1px dashed #0ea5e9",fontSize:"0.95rem",fontWeight:600},children:[e.jsx(rt,{})," Rellenar con Efectivo (Total: C$ ",Number(o).toFixed(2),")"]})]})]}),e.jsxs("div",{style:{paddingLeft:10,display:"flex",flexDirection:"column",justifyContent:"space-between",paddingBottom:10},children:[e.jsxs("div",{children:[e.jsxs(De,{style:{marginBottom:15,padding:20,backgroundColor:"#f0f9ff",border:"none",borderRadius:12,boxShadow:"inset 0 2px 4px rgba(0,0,0,0.05)"},children:[e.jsxs(H,{$bold:!0,style:{fontSize:"1.8rem",color:"#0f172a",marginBottom:5},children:[e.jsx("span",{style:{fontSize:"1rem",color:"#64748b",fontWeight:600},children:"TOTAL A PAGAR"}),e.jsxs("span",{children:["C$ ",Number(o).toFixed(2)]})]}),e.jsxs(H,{style:{borderTop:"1px solid #cbd5e0",paddingTop:10,fontSize:"0.9rem",color:"#64748b"},children:[e.jsxs("span",{children:["Tasa USD: C$ ",Number(g).toFixed(2)]}),e.jsxs("span",{style:{color:"#0f172a",fontWeight:700},children:["$",(Number(o)/Number(g||1)).toFixed(2)," USD"]})]})]}),e.jsxs("div",{style:{padding:15,border:"1px solid #e2e8f0",borderRadius:12,marginBottom:15,backgroundColor:"#fff"},children:[e.jsxs(H,{style:{color:"#64748b",fontSize:"0.95rem",marginBottom:8},children:[e.jsx("span",{children:"Pagado (Contado)"}),e.jsxs("span",{style:{fontWeight:"700",color:"#1e293b"},children:["C$ ",E.toFixed(2)]})]}),e.jsxs(H,{style:{fontSize:"0.95rem"},children:[e.jsx("span",{children:"Estado"}),e.jsx("span",{style:{fontWeight:"700",color:ie>.01?"#f59e0b":y?"#22c55e":"#ef4444"},children:ke})]})]}),e.jsxs(De,{style:{marginBottom:10,padding:15,backgroundColor:fe==="#dc3545"?"#fef2f2":fe==="#28a745"?"#ecfccb":"#e0f2fe",color:fe==="#dc3545"?"#ef4444":fe==="#28a745"?"#4d7c0f":"#0369a1",fontWeight:"800",fontSize:"1.1rem",textAlign:"center",borderRadius:12,border:"none",boxShadow:"0 2px 4px rgba(0,0,0,0.05)"},children:[e.jsx(nt,{style:{marginRight:8}})," ",ye]})]}),e.jsxs("div",{style:{marginTop:"auto",display:"flex",flexDirection:"column",gap:"12px"},children:[e.jsxs(I,{type:"button",onClick:l=>{l.preventDefault(),b(!0)},disabled:q||!y,style:{width:"100%",padding:"16px 0",fontSize:"1.2rem",fontWeight:800,backgroundColor:q||!y?"#cbd5e1":"#2563eb",color:"white",border:"none",borderRadius:10,boxShadow:q||!y?"none":"0 4px 6px -1px rgba(37, 99, 235, 0.4)",transition:"all 0.2s"},children:[e.jsx(We,{style:{marginRight:8}})," PAGAR E IMPRIMIR"]}),e.jsxs(I,{type:"button",onClick:l=>{l.preventDefault(),b(!1)},disabled:q||!y,style:{width:"100%",padding:"12px 0",fontSize:"1rem",fontWeight:700,backgroundColor:"white",color:q||!y?"#cbd5e1":"#475569",border:q||!y?"1px solid #e2e8f0":"2px solid #cbd5e1",borderRadius:10,transition:"all 0.2s"},children:[e.jsx(it,{style:{marginRight:8}})," Solo Guardar (Sin Ticket)"]})]})]})]})]})})},Nt=lt`
  @media print {
    body { visibility: hidden; margin: 0; padding: 0; }
    .print-area, .print-area * { visibility: visible !important; }
    .print-area {
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;
      z-index: 999999 !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    .no-print { display: none !important; }
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }
  }
`,Tt=se.div`
  font-family: 'League Spartan', 'Inter', system-ui, -apple-system, sans-serif;
  color: #000;
  background: #fff;
  width: 100%;
  max-width: 340px;
  margin: 0 auto;
  padding: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,.15);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;

  @media (max-width: 480px) {
    border-radius: 6px;
    padding: 12px 8px;
  }

  /* ===== 80mm TICKET STYLES ===== */
  .brand {
    text-align: center;
    border-bottom: 2px solid #1a1a1a;
    padding-bottom: 12px;
    margin-bottom: 12px;
  }
  .brand-logo-container {
    display: flex;
    justify-content: center;
    margin-bottom: 8px;
  }
  .brand-info { text-align: center; }
  .brand h1 {
    margin: 4px 0 3px;
    font-size: 1.3rem;
    font-weight: 800;
    color: #0b0b0b;
    line-height: 1.2;
    letter-spacing: -0.3px;
    font-family: 'League Spartan', 'Inter', sans-serif;
  }
  .brand small {
    color: #444;
    display: block;
    margin: 2px 0;
    line-height: 1.3;
    font-size: 0.78rem;
    white-space: normal;
    word-break: break-word;
  }

  /* Meta */
  .meta {
    font-size: .88rem;
    margin-bottom: 12px;
    border-bottom: 1px dashed #aaa;
    padding-bottom: 8px;
  }
  .meta p {
    margin: 3px 0;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 4px 8px;
    font-weight: 400;
  }
  .meta-label { font-weight: 700; color: #111; }
  .meta-value { font-weight: 400; color: #333; }

  /* Tabla */
  table.items { width: 100%; border-collapse: collapse; font-size: .88rem; table-layout: fixed; }
  table.items th, table.items td { padding: 6px 4px; vertical-align: top; word-wrap: break-word; }
  table.items th {
    border-bottom: 2px solid #222;
    font-weight: 800;
    text-transform: uppercase;
    font-size: 0.72rem;
    color: #111;
    letter-spacing: 0.3px;
  }
  .text-right { text-align: right; }
  .col-qty { width: 14%; text-align: center; }
  .col-unit { width: 24%; text-align: right; }
  .col-total { width: 24%; text-align: right; }
  table.items td:nth-child(2) { white-space: normal; text-align: left; }

  /* Totales */
  .totals { border-top: 2px solid #222; padding-top: 6px; margin-top: 12px; }
  .badge {
    display: inline-block;
    font-weight: 800;
    letter-spacing: .6px;
    padding: 6px 12px;
    border: 2px solid #111;
    border-radius: 4px;
    margin: 10px auto;
    text-align: center;
    color: #111;
    font-size: 0.72rem;
    text-transform: uppercase;
  }
  .thanks {
    text-align: center;
    font-size: .82rem;
    border-top: 1px dashed #888;
    padding-top: 10px;
    margin-top: 12px;
    color: #555;
    line-height: 1.4;
  }
  .proforma-tag {
    display: inline-block;
    font-weight: 800;
    letter-spacing: 1px;
    padding: 5px 14px;
    border: 2px solid #0b72b9;
    border-radius: 4px;
    color: #0b72b9;
    font-size: 0.75rem;
    text-transform: uppercase;
    margin-top: 6px;
  }

  /* ====== A4 LAYOUT ====== */
  &.print-a4 {
    .brand {
      display: flex; justify-content: space-between; align-items: flex-start;
      text-align: left; border-bottom: 3px solid #1e3a8a;
      margin-bottom: 2rem; padding-bottom: 1rem;
    }
    .brand-logo-container { width: 140px; justify-content: flex-start; }
    .brand-info { text-align: right; max-width: 60%; }
    .brand h1 { font-size: 20pt; color: #1e3a8a; margin-bottom: 5px; }
    .brand small { font-size: 9pt; color: #444; margin: 1px 0; }

    .meta {
      display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
      border: 1px solid #ddd; padding: 15px; background: #f8fafc;
      border-radius: 6px; margin-bottom: 25px;
    }
    .meta-col { display: flex; flex-direction: column; gap: 5px; }
    .meta-title {
      font-weight: bold; text-transform: uppercase; color: #1e3a8a;
      border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-bottom: 6px; font-size: 9pt;
    }
    .meta p {
      justify-content: flex-start; gap: 8px; border-bottom: none;
      width: 100%; display: grid; grid-template-columns: 100px 1fr;
    }

    table.items th {
      background: #f1f5f9; color: #334155; padding: 10px;
      border-bottom: 2px solid #cbd5e1; font-size: 9pt;
    }
    table.items td { padding: 10px; border-bottom: 1px solid #f1f5f9; font-size: 10pt; color: #334155; }
    .col-qty { width: 10%; }
    .col-unit { width: 15%; }
    .col-total { width: 15%; }

    .totals {
      border-top: none; margin-top: 0;
      display: flex; justify-content: flex-end; padding-top: 20px;
    }
    .totals-box { width: 250px; }

    .thanks { border-top: none; margin-top: 50px; font-style: italic; color: #94a3b8; }
  }

  @media print {
    &.print-80 {
      width: 80mm !important;
      font-family: 'League Spartan', 'Inter', sans-serif !important;
      padding: 6px 4px !important;
      border: none !important;
      box-shadow: none !important;
      font-size: 8pt;
    }
    &.print-a4 {
      width: 190mm !important;
      font-size: 10pt !important;
      padding: 0 !important;
      margin: 0 !important;
      border: none !important;
      box-shadow: none !important;
      max-height: 277mm !important;
      overflow: hidden !important;
      font-family: 'League Spartan', 'Inter', Helvetica, Arial, sans-serif !important;
    }
  }
`,kt=se.div`
  display: flex; flex-direction: column; gap: 12px;
  align-items: center; /* Center the ticket inside modal */
`,zt=se.img`
  width: 90px;
  height: 90px;
  object-fit: contain;
  display: block;
  border-radius: 8px;
  .print-a4 & { width: 130px; height: auto; }
`;se.span`
  display: inline-flex; align-items: center; gap: 6px;
  font-weight: 700; letter-spacing: .4px; padding: 6px 10px;
  border-radius: 8px; font-size: 0.85rem;
  background: #e0f2fe; color: #0284c7; border: 1px solid #bae6fd;
  text-transform: uppercase;
`;const Et=se.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: .75rem;
`,$t=({cart:o=[],total:g=0,subtotal:a=0,discount:u=0,proformaFor:N="",onClose:d,currentUser:n,client:r})=>{const{user:j}=typeof Me=="function"?Me():{user:null},{settings:f}=mt(),F=p=>(p==null?void 0:p.usuarioNombre)||(p==null?void 0:p.nombre_usuario)||(p==null?void 0:p.name)||(p==null?void 0:p.nombre)||(p==null?void 0:p.username)||null;let z=null;try{z=JSON.parse(localStorage.getItem("authUser")||"null")}catch{}const M=F(n)||F(j)||F(z)||"Cajero POS",c=(r==null?void 0:r.nombre)||"Consumidor Final",R=(r==null?void 0:r.cedula)||"",t=new Date().toLocaleString("es-NI"),m=p=>new Intl.NumberFormat("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(p||0)),x={name:(f==null?void 0:f.empresa_nombre)||"Multirepuestos RG",ruc:(f==null?void 0:f.empresa_ruc)||"1211812770001E",phone:(f==null?void 0:f.empresa_telefono)||"84031936 / 84058142",address:(f==null?void 0:f.empresa_direccion)||"Del portón de la normal 75 varas al este. Juigalpa, Chontales.",slogan:(f==null?void 0:f.empresa_eslogan)||"Tu mejor opción en repuestos",logo:(f==null?void 0:f.empresa_logo_url)||new URL("/icons/logo.png",window.location.origin).toString()},T=s.useCallback((p="80")=>{const w=document.getElementById("print-wrapper-proforma");if(!w)return;const W=w.outerHTML,Z=`
      @charset "UTF-8";
      @import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;500;600;700;800&display=swap');
      @page { size: ${p==="A4"?"A4 portrait":"80mm auto"}; margin: ${p==="A4"?"12mm":"0"}; }
      html, body {
        background: #fff; margin: 0 !important; padding: 0 !important;
        -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;
        color: #000 !important;
        font-family: 'League Spartan', 'Inter', system-ui, -apple-system, sans-serif;
      }
      
      #print-wrapper-proforma {
        box-shadow: none !important; border: none !important; margin: 0 !important;
        font-family: 'League Spartan', 'Inter', system-ui, sans-serif !important;
        ${p==="A4"?"width: 100% !important; padding: 0 !important; font-size: 10pt !important;":"width: 80mm !important; padding: 6px 4px !important; font-size: 9pt !important;"}
      }

      #print-wrapper-proforma .brand h1 {
        font-family: 'League Spartan', 'Inter', sans-serif !important;
        font-weight: 900 !important;
      }

      #print-wrapper-proforma .brand-logo-container img {
        width: ${p==="A4"?"130px":"110px"} !important;
        height: ${p==="A4"?"auto":"110px"} !important;
        object-fit: contain !important;
      }

      ${p==="A4"?`
        #print-wrapper-proforma .brand { display: flex !important; justify-content: space-between !important; align-items: flex-start !important; text-align: left !important; border-bottom: 3px solid #1e3a8a !important; margin-bottom: 25px !important; padding-bottom: 15px !important; }
        #print-wrapper-proforma .brand-logo-container { width: 140px !important; justify-content: flex-start !important; order: 1 !important; }
        #print-wrapper-proforma .brand-info { flex: 1 !important; text-align: right !important; order: 2 !important; }
        #print-wrapper-proforma .brand h1 { font-size: 22pt !important; color: #1e3a8a !important; margin: 0 0 5px 0 !important; }
        #print-wrapper-proforma .brand small { display: block !important; font-size: 9pt !important; margin: 2px 0 !important; color: #334155 !important; }
        
        #print-wrapper-proforma .meta { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 30px !important; background: #f8fafc !important; border: 1px solid #e2e8f0 !important; padding: 15px !important; margin-bottom: 30px !important; border-radius: 8px !important; }
        #print-wrapper-proforma .meta p { display: grid !important; grid-template-columns: 100px 1fr !important; width: 100% !important; border-bottom: 1px dashed #e2e8f0 !important; padding-bottom: 4px !important; margin-bottom: 4px !important; }
        #print-wrapper-proforma .meta-title { font-weight: 800 !important; text-transform: uppercase !important; color: #1e3a8a !important; border-bottom: 2px solid #cbd5e1 !important; margin-bottom: 10px !important; padding-bottom: 5px !important; display: block !important; width: 100% !important; }

        #print-wrapper-proforma table.items { width: 100% !important; border-collapse: collapse !important; border: 1px solid #e2e8f0 !important; }
        #print-wrapper-proforma table.items th { background: #f1f5f9 !important; color: #334155 !important; padding: 12px 8px !important; border-bottom: 2px solid #cbd5e1 !important; font-size: 9pt !important; text-align: left !important; }
        #print-wrapper-proforma table.items td { padding: 10px 8px !important; border-bottom: 1px solid #f1f5f9 !important; font-size: 9.5pt !important; vertical-align: top !important; }
        #print-wrapper-proforma .col-qty { text-align: center !important; }
        #print-wrapper-proforma .col-unit, #print-wrapper-proforma .col-total { text-align: right !important; }
        
        #print-wrapper-proforma .totals { display: flex !important; justify-content: flex-end !important; margin-top: 20px !important; border-top: none !important; }
        #print-wrapper-proforma .totals-box { width: 300px !important; background: #f8fafc !important; padding: 15px !important; border: 1px solid #e2e8f0 !important; border-radius: 8px !important; }
      `:`
        #print-wrapper-proforma, #print-wrapper-proforma * {
          color: #000 !important;
          font-weight: 900 !important;
          font-size: 10.5pt !important;
        }
        #print-wrapper-proforma .brand { text-align: center !important; border-bottom: 2px solid #000 !important; padding-bottom: 6px !important; margin-bottom: 6px !important; }
        #print-wrapper-proforma .brand h1 { font-size: 19pt !important; letter-spacing: 0.5px !important; margin: 0 0 4px !important; }
        #print-wrapper-proforma .brand-logo-container { display: flex !important; justify-content: center !important; margin-bottom: 4px !important; }
        #print-wrapper-proforma .meta p { display: flex !important; justify-content: space-between !important; margin: 2px 0 !important; }
        #print-wrapper-proforma .totals .grand-total { font-size: 15pt !important; border-top: 2px solid #000 !important; margin-top: 6px !important; padding-top: 4px !important; text-transform: uppercase !important; }
        #print-wrapper-proforma table.items th { border-bottom: 2px solid #000 !important; font-size: 9.5pt !important; }
        #print-wrapper-proforma table.items td { border-bottom: 1px dashed #000 !important; font-size: 9.5pt !important; }
        #print-wrapper-proforma .badge { border: 2px solid #000 !important; padding: 4px 8px !important; font-size: 9.5pt !important; }
      `}
    `,S=window.open("","_blank","width=900,height=700");S&&(S.document.write(`<!DOCTYPE html><html><head><title>PROFORMA - ${x.name}</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"><style>${Z}</style></head><body>${W}</body></html>`),S.document.close(),S.focus(),S.onload=function(){setTimeout(()=>{S.print(),setTimeout(()=>{S.close(),d&&d()},500)},400)})},[x,d]),X=o.length<=2;return e.jsxs(be,{className:"no-print",children:[e.jsx(Nt,{}),e.jsxs(je,{className:"no-print",style:{maxWidth:520,width:"96%",padding:"1.2rem",background:"#fff"},children:[e.jsxs(Et,{children:[e.jsxs("h2",{style:{display:"flex",alignItems:"center",gap:8,margin:0,fontSize:"1.25rem"},children:[e.jsx(st,{})," Proforma"]}),e.jsxs("div",{style:{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"flex-end"},children:[e.jsx(I,{onClick:()=>T("80"),style:{padding:"8px 12px",fontSize:"0.85rem"},children:"80mm"}),e.jsxs(I,{onClick:()=>T("A4"),style:{padding:"8px 12px",fontSize:"0.85rem"},children:[e.jsx(Fe,{})," A4"]}),e.jsx(I,{$cancel:!0,onClick:d,style:{padding:"8px 12px",background:"#e2e8f0",color:"#0f172a"},children:e.jsx(Te,{})})]})]}),e.jsx(kt,{children:e.jsxs(Tt,{id:"print-wrapper-proforma",className:`print-area print-80 ${X?"compact":""}`,children:[e.jsxs("div",{className:"brand",children:[e.jsx("div",{className:"brand-logo-container",children:e.jsx(zt,{src:x.logo,alt:"Logo",onError:p=>{p.currentTarget.style.display="none"}})}),e.jsxs("div",{className:"brand-info",children:[e.jsx("h1",{children:x.name}),e.jsx("small",{children:x.slogan}),e.jsxs("small",{children:["RUC: ",x.ruc]}),e.jsxs("small",{children:["Tel: ",x.phone]}),e.jsx("small",{children:x.address}),e.jsx("div",{style:{marginTop:6},children:e.jsxs("span",{className:"proforma-tag",children:[e.jsx(Fe,{style:{marginRight:4,verticalAlign:"middle"}})," COTIZACIÓN / PROFORMA"]})})]})]}),e.jsxs("div",{className:"meta",children:[e.jsxs("div",{className:"meta-col",children:[e.jsx("span",{className:"meta-title",children:"Detalles"}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Fecha:"}),e.jsx("span",{className:"meta-value",children:t})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"ID Temp:"}),e.jsx("span",{className:"meta-value",children:Date.now().toString().slice(-6)})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Atendido por:"}),e.jsx("span",{className:"meta-value",children:M})]})]}),e.jsxs("div",{className:"meta-col",children:[e.jsx("span",{className:"meta-title",children:"Cliente"}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Nombre:"}),e.jsx("span",{className:"meta-value",children:N||c})]}),R&&e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Cédula:"}),e.jsx("span",{className:"meta-value",children:R})]})]})]}),e.jsxs("table",{className:"items",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{className:"col-qty",children:"Cant."}),e.jsx("th",{children:"Descripción"}),e.jsx("th",{className:"text-right col-unit",children:"P. Unit."}),e.jsx("th",{className:"text-right col-total",children:"Total"})]})}),e.jsx("tbody",{children:o.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:"4",style:{textAlign:"center",color:"#777"},children:"Sin ítems"})}):o.map((p,w)=>{const W=Number(p.precio_venta??p.precio??0),U=Number(p.quantity??0),Z=W*U;return e.jsxs("tr",{children:[e.jsx("td",{className:"col-qty",children:U}),e.jsx("td",{children:p.nombre||p.descripcion||"Item"}),e.jsxs("td",{className:"text-right col-unit",children:["C$",m(W)]}),e.jsxs("td",{className:"text-right col-total",children:["C$",m(Z)]})]},w)})})]}),e.jsx("div",{className:"totals",children:e.jsxs("div",{className:"totals-box",children:[e.jsxs(H,{children:[e.jsx("span",{children:"Subtotal:"}),e.jsxs("span",{children:["C$",m(a)]})]}),u>0&&e.jsxs(H,{style:{color:"#dc3545"},children:[e.jsx("span",{children:"Descuento:"}),e.jsxs("span",{children:["- C$",m(u)]})]}),e.jsxs(H,{className:"grand-total",style:{fontWeight:"bold",fontSize:"1.2rem",marginTop:5,borderTop:"2px solid black"},children:[e.jsx("span",{children:"TOTAL:"}),e.jsxs("span",{children:["C$",m(g)]})]}),e.jsxs("div",{style:{marginTop:12,textAlign:"center"},children:[e.jsx("span",{className:"badge",children:"DOCUMENTO NO VÁLIDO COMO FACTURA"}),e.jsx("p",{style:{margin:"5px 0 0",fontSize:"0.72rem",color:"#666"},children:"Precios sujetos a cambio. Válido por 3 días."})]})]})}),e.jsxs("div",{className:"thanks",children:[e.jsxs("p",{children:['"',x.slogan,'"']}),e.jsx("p",{style:{whiteSpace:"pre-line",marginTop:"5px"},children:(f==null?void 0:f.ticket_proforma_footer)||"¡Gracias por cotizar con nosotros!"})]})]})})]})]})},Lt=({isOpen:o,onClose:g,onConfirm:a,onSubmit:u,title:N,message:d,fields:n=[],inputType:r="number",icon:j})=>{const[f,F]=s.useState({}),[z,M]=s.useState("");if(s.useEffect(()=>{if(o)if(n.length>0){const t={};n.forEach(m=>{t[m.name]=m.defaultValue!==void 0?m.defaultValue:""}),F(t)}else M("")},[o,n]),!o)return null;const c=()=>{n.length>0?u?u(f):a&&a(f):u?u(z):a&&a(z)},R=(t,m)=>{F(x=>({...x,[t]:m}))};return e.jsx(be,{children:e.jsxs(je,{style:{maxWidth:"450px"},children:[e.jsxs("div",{style:{textAlign:"center",marginBottom:"1.5rem"},children:[j?e.jsx("div",{style:{fontSize:"2.5rem",marginBottom:"1rem"},children:j}):e.jsx(dt,{size:"2.5em",color:"#007bff"}),e.jsx("h2",{style:{marginTop:"0.5rem",marginBottom:"0.5rem"},children:N}),d&&e.jsx("p",{style:{color:"#6c757d"},children:d})]}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:n.length>0?n.map(t=>e.jsxs("div",{children:[t.label&&e.jsx("label",{style:{display:"block",marginBottom:"5px",fontWeight:600,fontSize:"0.9rem"},children:t.label}),t.type==="select"?e.jsx("select",{value:f[t.name],onChange:m=>R(t.name,m.target.value),style:{width:"100%",padding:"10px",borderRadius:"8px",border:"1px solid #ccc",fontSize:"1rem"},children:t.options&&t.options.map(m=>e.jsx("option",{value:m.value,children:m.label},m.value))}):e.jsx(O,{type:t.type||"text",placeholder:t.placeholder||"",value:f[t.name],onChange:m=>R(t.name,m.target.value),autoFocus:t.name===n[0].name})]},t.name)):e.jsx(O,{type:r,value:z,onChange:t=>M(t.target.value),autoFocus:!0})}),e.jsxs("div",{style:{display:"flex",justifyContent:"flex-end",gap:"1rem",marginTop:"2rem"},children:[e.jsx(I,{onClick:g,style:{backgroundColor:"#6c757d"},children:"Cancelar"}),e.jsx(I,{onClick:c,primary:!0,children:"Aceptar"})]})]})})},ce=se.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 6px;
  
  label { font-weight: bold; color: #495057; }
  input { width: 120px; text-align: right; }
`,Wt=({isOpen:o,onClose:g,currentStats:a,onConfirm:u})=>{const[N,d]=s.useState("manual"),[n,r]=s.useState({efectivo:"",credito:"",tarjeta:"",dolares:"",ventas_totales:""}),[j,f]=s.useState({cordobas:"",dolares:"",ventas_totales:""}),F=(c,R)=>{r(t=>({...t,[c]:R}))},z=(c,R)=>{f(t=>({...t,[c]:R}))},M=()=>{const c=[];if(N==="manual")parseFloat(n.efectivo)&&c.push({target:"efectivo",amount:parseFloat(n.efectivo)}),parseFloat(n.credito)&&c.push({target:"credito",amount:parseFloat(n.credito)}),parseFloat(n.tarjeta)&&c.push({target:"tarjeta",amount:parseFloat(n.tarjeta)}),parseFloat(n.ventas_totales)&&c.push({target:"ventas_totales",amount:parseFloat(n.ventas_totales)});else{const R=parseFloat(j.cordobas),t=parseFloat(j.dolares),m=parseFloat(j.ventas_totales);if(!isNaN(R)){const x=Number((a==null?void 0:a.netCordobas)||0),T=R-x;Math.abs(T)>.01&&c.push({target:"efectivo",amount:T})}if(!isNaN(t)){const x=Number((a==null?void 0:a.netDolares)||0),T=t-x;Math.abs(T)>.01&&c.push({target:"dolares",amount:T})}if(!isNaN(m)){const x=Number((a==null?void 0:a.totalVentasDia)||0),T=m-x;Math.abs(T)>.01&&c.push({target:"ventas_totales",amount:T})}}c.length>0&&u(c),g()};return o?e.jsx(be,{style:{background:"rgba(0,0,0,0.95)",zIndex:9999},children:e.jsxs(je,{style:{maxWidth:"450px",background:"#212529",color:"#fff",border:"1px solid #495057",maxHeight:"90vh",overflowY:"auto"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20},children:[e.jsxs("h2",{style:{margin:0,color:"#ffc107",display:"flex",alignItems:"center",gap:10},children:[e.jsx(ct,{})," GOD MODE"]}),e.jsx(I,{$cancel:!0,onClick:g,style:{background:"transparent",color:"#6c757d",border:"none"},children:"✕"})]}),e.jsxs("div",{style:{display:"flex",gap:10,marginBottom:20},children:[e.jsx(I,{onClick:()=>d("manual"),style:{flex:1,background:N==="manual"?"#ffc107":"#343a40",color:N==="manual"?"#000":"#fff",border:"none"},children:"Ajuste Manual (+/-)"}),e.jsx(I,{onClick:()=>d("override"),style:{flex:1,background:N==="override"?"#ffc107":"#343a40",color:N==="override"?"#000":"#fff",border:"none"},children:"Fijar Monto (=)"})]}),N==="manual"?e.jsxs(e.Fragment,{children:[e.jsx("p",{style:{color:"#adb5bd",fontSize:"0.85rem",marginBottom:15},children:"Suma o resta cantidades a los contadores ocultamente."}),e.jsxs(ce,{style:{background:"#343a40"},children:[e.jsx("label",{style:{color:"#fff"},children:"Efectivo (C$)"}),e.jsx(O,{type:"number",step:"0.01",placeholder:"+/- 0.00",value:n.efectivo,onChange:c=>F("efectivo",c.target.value),style:{background:"#495057",color:"#fff"}})]}),e.jsxs(ce,{style:{background:"#343a40"},children:[e.jsx("label",{style:{color:"#fff"},children:"Crédito"}),e.jsx(O,{type:"number",step:"0.01",placeholder:"+/- 0.00",value:n.credito,onChange:c=>F("credito",c.target.value),style:{background:"#495057",color:"#fff"}})]}),e.jsxs(ce,{style:{background:"#343a40"},children:[e.jsx("label",{style:{color:"#fff"},children:"Tarjeta"}),e.jsx(O,{type:"number",step:"0.01",placeholder:"+/- 0.00",value:n.tarjeta,onChange:c=>F("tarjeta",c.target.value),style:{background:"#495057",color:"#fff"}})]}),e.jsxs(ce,{style:{background:"#2a1a00",border:"1px solid #ffc107"},children:[e.jsx("label",{style:{color:"#ffc107"},children:"Ventas Totales"}),e.jsx(O,{type:"number",step:"0.01",placeholder:"+/- 0.00",value:n.ventas_totales,onChange:c=>F("ventas_totales",c.target.value),style:{background:"#495057",color:"#ffc107",border:"1px solid #ffc107"}})]})]}):e.jsxs(e.Fragment,{children:[e.jsx("p",{style:{color:"#adb5bd",fontSize:"0.85rem",marginBottom:15},children:"Define EXACTAMENTE cuánto dinero físico hay. El sistema creará un ajuste mágico para cuadrar."}),e.jsxs("div",{style:{background:"#343a40",padding:10,borderRadius:6,marginBottom:10},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",color:"#aaa",marginBottom:5},children:[e.jsx("span",{children:"Sistema Actual:"}),e.jsxs("span",{children:["C$ ",Number((a==null?void 0:a.netCordobas)||0).toFixed(2)]})]}),e.jsxs(ce,{style:{background:"transparent",padding:0,marginBottom:0},children:[e.jsx("label",{style:{color:"#fff"},children:"Real en Caja (C$)"}),e.jsx(O,{type:"number",step:"0.01",placeholder:"0.00",value:j.cordobas,onChange:c=>z("cordobas",c.target.value),style:{background:"#495057",color:"#fff",border:"1px solid #ffc107"}})]})]}),e.jsxs("div",{style:{background:"#343a40",padding:10,borderRadius:6},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",color:"#aaa",marginBottom:5},children:[e.jsx("span",{children:"Sistema Actual:"}),e.jsxs("span",{children:["$ ",Number((a==null?void 0:a.netDolares)||0).toFixed(2)]})]}),e.jsxs(ce,{style:{background:"transparent",padding:0,marginBottom:0},children:[e.jsx("label",{style:{color:"#fff"},children:"Real en Caja ($)"}),e.jsx(O,{type:"number",step:"0.01",placeholder:"0.00",value:j.dolares,onChange:c=>z("dolares",c.target.value),style:{background:"#495057",color:"#fff",border:"1px solid #ffc107"}})]})]}),e.jsxs("div",{style:{background:"#2a1a00",padding:10,borderRadius:6,border:"1px solid #ffc107",marginTop:10},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",color:"#ffc107",marginBottom:5},children:[e.jsx("span",{children:"Sistema Actual:"}),e.jsxs("span",{children:["C$ ",Number((a==null?void 0:a.totalVentasDia)||0).toFixed(2)]})]}),e.jsxs(ce,{style:{background:"transparent",padding:0,marginBottom:0},children:[e.jsx("label",{style:{color:"#ffc107"},children:"Ventas Totales (C$)"}),e.jsx(O,{type:"number",step:"0.01",placeholder:"0.00",value:j.ventas_totales,onChange:c=>z("ventas_totales",c.target.value),style:{background:"#495057",color:"#ffc107",border:"1px solid #ffc107"}})]})]})]}),e.jsxs("div",{style:{marginTop:25,display:"flex",gap:10},children:[e.jsx(I,{onClick:g,style:{flex:1,background:"#495057",border:"none"},children:"Cancelar"}),e.jsxs(I,{onClick:M,style:{flex:1,background:"#ffc107",color:"#000",fontWeight:"bold",border:"none"},children:[e.jsx(pt,{style:{marginRight:6}})," ",N==="manual"?"APLICAR AJUSTE":"CUADRAR MÁGICAMENTE"]})]})]})}):null};export{Bt as C,At as P,Wt as S,Ot as a,Lt as b,jt as c,$t as d};

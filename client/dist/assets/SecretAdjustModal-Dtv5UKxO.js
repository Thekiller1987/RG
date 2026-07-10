import{r as l,j as e,a0 as _e,a1 as Ve,aS as qe,A as Re,m as $e,H as Ge,s as se,a6 as He,a7 as Ue,k as Je,b as Ye,R as ke,aO as Ke,b3 as We,af as Le,b5 as Qe,J as Ie,x as Te,b6 as Xe,b7 as Ze,aV as et,ag as tt,b8 as at,a3 as ot,b9 as Fe,ba as rt,bb as nt,aa as it,b2 as st,C as Me,q as lt,bc as dt,bd as ct,be as pt}from"./vendor-BVroOj2J.js";import{g as ge,s as he,f as Pe,u as De,a as mt}from"./index-CbUf7eeN.js";import{r as xt}from"./searchEngine-BMYcElFi.js";import{d as ft,S as O,h as gt,i as ht,j as bt,M as be,a as je,B as R,f as J,I as Ae}from"./POS.styles-SnKkPsfK.js";import"./AlertModal--TwzGPyw.js";const w=o=>{const f=Number(o);return isNaN(f)||!isFinite(f)?0:f};function ut(o){if(!Array.isArray(o)||o.length===0)return[];const f=new Set,a=[];for(const b of o)b.id&&f.has(b.id)||(b.id&&f.add(b.id),a.push(b));return a}const jt=(o,f=0,a=36.6)=>{const b=Math.max(0,w(f)),S=w(a)||36.6,p={ventasContado:[],devoluciones:[],cancelaciones:[],entradas:[],salidas:[],abonos:[],ajustes:[]};let i=0,n=0,u=0,c=0,I=0,T=0,F=0,m=0;const E=ut(Array.isArray(o)?o:[]);let t=0,x=0,j=0,v=0,K=0,$=0,r=0,W=0,V=0;for(const M of E){let g=((M==null?void 0:M.type)||"").toLowerCase().trim();g=g.normalize("NFD").replace(/[\u0300-\u036f]/g,"");let C=(M==null?void 0:M.pagoDetalles)||{};if(typeof C=="string")try{C=JSON.parse(C)}catch{C={}}(!C||typeof C!="object")&&(C={});const D=w(M.amount),le=w(C.totalVenta)||D,A=w(C.efectivo),q=w(C.dolares),ee=w(C.cambio),Q=w(C.ingresoCaja),L=w(C.tarjeta),y=w(C.transferencia),Y=w(C.credito);let P=le||D;(g==="salida"||g.includes("devolucion")||g.includes("cancelacion")||g.includes("anulacion"))&&(P=-Math.abs(P));const B={...M,pagoDetalles:C,displayAmount:P};if(g.startsWith("venta")||g.includes("abono")||g.includes("pedido")||g.includes("apartado")?(u+=L,c+=y,I+=Y):g==="ajuste"&&(C.target==="tarjeta"&&(u+=D),C.target==="credito"&&(I+=D),C.target==="transferencia"&&(c+=D)),g.startsWith("venta")){if(A>.001||q>.001||ee>.001)i+=A-ee,n+=q,t+=A-ee,x+=q;else if(Q>.001)i+=Q,t+=Q;else{const G=L+y+Y,z=le-G;z>.001&&(i+=z,t+=z)}j+=L,v+=y,K+=Y}else if(g.includes("abono")||g.includes("liquidación")||g.includes("liquidacion")||g.includes("pedido")){if(q>.001)n+=q,i+=A,r+=q,$+=A;else if(A>.001)i+=A,$+=A;else if(Q>.001)i+=Q,$+=Q;else{const G=L+y,z=Math.max(0,D-G);i+=z,$+=z}W+=L,V+=y}else if(g==="entrada")i+=Math.abs(D);else if(g==="salida")i-=Math.abs(D);else if(g.includes("devolucion")||g.includes("cancelacion")||g.includes("anulacion"))if(C.ingresoCaja!==void 0&&C.ingresoCaja!==null)i+=w(C.ingresoCaja);else if(A>.001)i-=A;else{const G=L+y+Y,z=Math.abs(D)-G;z>.001&&(i-=z)}else if(g==="ajuste")C.target==="efectivo"?(i+=D,C.hidden&&(m+=D)):C.target==="dolares"&&(n+=D);else{const G=L+y+Y,z=D-G;Math.abs(z)>.001&&(i+=z)}g.startsWith("venta")||g.includes("abono")||g.includes("liquid")||g.includes("pedido")?F+=Math.abs(P):g.includes("devolucion")||g.includes("cancelacion")||g.includes("anulacion")?F-=Math.abs(P):(g==="ajuste"&&C.target==="ventas_totales"||g==="ajuste"&&C.target==="efectivo"&&D<0)&&(F+=D),g.startsWith("venta")?p.ventasContado.push(B):g.includes("devolucion")?(p.devoluciones.push(B),T+=Math.abs(P)):g.includes("cancelacion")||g.includes("anulacion")?(p.cancelaciones.push(B),T+=Math.abs(P)):g==="entrada"?p.entradas.push(B):g==="salida"?p.salidas.push(B):g.includes("abono")?p.abonos.push(B):g==="ajuste"&&p.ajustes.push(B)}i=w(i),n=w(n),u=w(u),c=w(c),I=w(I),F=w(F),m=w(m),T=w(T);const Z=b+i,k=Z+n*S;return{cajaInicial:b,netCordobas:i,netDolares:n,efectivoEsperado:w(k),efectivoEsperadoCordobas:w(Z),efectivoEsperadoDolares:n,totalVentasDia:w(F),totalTarjeta:u,totalTransferencia:c,totalCredito:I,totalNoEfectivo:w(u+c+I),sumDevolucionesCancelaciones:T,totalHidden:m,tasaRef:S,lists:p,vEfectivoC:w(t),vEfectivoD:w(x),vTarjeta:w(j),vTransf:w(v),vCredito:w(K),aEfectivoC:w($),aEfectivoD:w(r),aTarjeta:w(W),aTransf:w(V)}},ve=o=>Number(o||0).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});async function Be(o,f=4){const a=localStorage.getItem("token"),b=o.filter(i=>{const n=ge(i);return!n||n!=="loading"&&n!=="none"});let S=0;async function p(){if(S>=b.length)return;const i=b[S++];if(ge(i))return p();he(i,"loading");try{const n=await Pe(i,a),u=(n==null?void 0:n.imagen)||null;he(i,u||"none")}catch{he(i,"none")}return p()}await Promise.all(Array.from({length:f},p))}function yt(o){const[f,a]=l.useState(()=>{const p=ge(o);return p&&p!=="loading"&&p!=="none"?p:null}),b=l.useRef(null),S=l.useCallback(async()=>{if(!o)return;const p=ge(o);if(!(p==="loading"||p==="none")){if(p&&p!=="loading"){a(p);return}he(o,"loading");try{const i=localStorage.getItem("token"),n=await Pe(o,i),u=(n==null?void 0:n.imagen)||null;he(o,u||"none"),a(u||null)}catch{he(o,"none"),a(null)}}},[o]);return l.useEffect(()=>{const p=ge(o);if(p&&p!=="loading"){a(p!=="none"?p:null);return}const i=setInterval(()=>{const u=ge(o);u&&u!=="loading"&&(a(u!=="none"?u:null),clearInterval(i))},200),n=new IntersectionObserver(u=>{u[0].isIntersecting&&S()},{rootMargin:"200px"});return b.current&&n.observe(b.current),()=>{n.disconnect(),clearInterval(i)}},[o,S]),{imgSrc:f,cardRef:b}}function vt({productId:o,productName:f,onView:a}){const{imgSrc:b,cardRef:S}=yt(o);return e.jsxs("div",{ref:S,className:"image-placeholder",style:{position:"relative",height:160,background:"#f8fafc",display:"flex",alignItems:"center",justifyContent:"center",borderBottom:"1px solid #f1f5f9",overflow:"hidden"},children:[b&&e.jsx("div",{className:"eye-icon",onClick:p=>{p.stopPropagation(),a(b)},style:{position:"absolute",top:10,left:10,zIndex:20,background:"white",borderRadius:"50%",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 6px rgba(0,0,0,0.1)",cursor:"pointer",transition:"transform 0.2s"},title:"Ver imagen",children:e.jsx(He,{size:14,color:"#64748b"})}),b?e.jsx("img",{src:b,alt:f,loading:"lazy",style:{maxWidth:"100%",maxHeight:"100%",objectFit:"contain"}}):e.jsx(Ue,{className:"no-image-icon",size:40,color:"#e2e8f0"})]})}const Oe=se.button`
  display: flex; align-items: center; justify-content: center;
  width: 42px; height: 42px;
  border: 1px solid ${o=>o.$active?"#3b82f6":"#cbd5e1"};
  background-color: ${o=>o.$active?"#eff6ff":"#fff"};
  color: ${o=>o.$active?"#3b82f6":"#64748b"};
  border-radius: 8px; cursor: pointer; transition: all 0.2s;

  &:hover { border-color: #3b82f6; color: #3b82f6; }
`,Ct=({isOpen:o,imageSrc:f,onClose:a})=>!o||!f?null:e.jsx(be,{onClick:a,children:e.jsxs($e.div,{initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},onClick:b=>b.stopPropagation(),style:{position:"relative",maxWidth:"95%",maxHeight:"90vh"},children:[e.jsx("button",{onClick:a,style:{position:"absolute",top:-15,right:-15,background:"white",width:32,height:32,borderRadius:"50%",border:"none",cursor:"pointer",boxShadow:"0 4px 6px rgba(0,0,0,0.1)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10,color:"#ef4444"},children:e.jsx(Je,{})}),e.jsx("img",{src:f,alt:"Vista Ampliada",style:{maxWidth:"100%",maxHeight:"85vh",borderRadius:"12px",boxShadow:"0 20px 25px rgba(0,0,0,0.2)",background:"white",objectFit:"contain"}})]})});function At({products:o=[],searchTerm:f,setSearchTerm:a,onProductClick:b,cartItems:S=[],reservedStock:p,inputRef:i,searchType:n="description",setSearchType:u=()=>{},isWholesale:c=!1}){const[I,T]=l.useState({isOpen:!1,imageUrl:null}),F=l.useMemo(()=>{const t=new Map;for(const x of S){const j=x.id_producto||x.id;t.set(j,(t.get(j)||0)+Number(x.quantity||0))}return t},[S]),m=l.useMemo(()=>xt(o,f,["nombre","codigo","descripcion"],{strict:n==="code"}).slice(0,100),[o,f,n]);l.useEffect(()=>{const t=m.map(x=>x.id_producto||x.id);Be(t,6)},[m]),l.useEffect(()=>{if(!o.length)return;const t=setTimeout(()=>{const x=o.map(j=>j.id_producto||j.id);Be(x,2)},1500);return()=>clearTimeout(t)},[o]);const E=l.useMemo(()=>{const t=(f||"").toLowerCase().trim();return t?o.filter(x=>{const j=(x.nombre||"").toLowerCase(),v=String(x.codigo||"").toLowerCase();return j.includes(t)||v.includes(t)}).length:o.length},[o,f]);return e.jsxs(ft,{children:[e.jsxs("div",{style:{display:"flex",gap:"8px",marginBottom:"1rem",alignItems:"center"},children:[e.jsx(O,{ref:i,placeholder:n==="code"?"Escribe código...":"Buscar producto...",value:f,onChange:t=>a(t.target.value),onKeyDown:t=>{if(t.key==="Enter"){const x=(f||"").trim().toLowerCase();if(!x)return;const j=o.find(v=>String(v.codigo||"").toLowerCase()===x||String(v.codigo_barras||"").toLowerCase()===x);if(j){b(j),a("");return}m.length===1&&(b(m[0]),a(""))}}}),e.jsx(Oe,{$active:n==="description",onClick:()=>{var t;u("description"),(t=i.current)==null||t.focus()},title:"Buscar por Nombre",children:e.jsx(_e,{size:16})}),e.jsx(Oe,{$active:n==="code",onClick:()=>{var t;u("code"),(t=i.current)==null||t.focus()},title:"Buscar por Código",children:e.jsx(Ve,{size:18})})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"8px",padding:"0 4px",fontSize:"0.85rem",color:"#64748b"},children:[e.jsxs("span",{children:[e.jsx(qe,{color:"#3b82f6"})," ",m.length," mostrados"]}),e.jsxs("span",{children:["Total: ",E]})]}),e.jsx(gt,{children:e.jsx(Re,{children:m.map((t,x)=>{const j=t.id_producto||t.id,v=F.get(j)||0,K=(p==null?void 0:p.get(j))||0,$=Math.max(0,Number(t.existencia||0)-v-K),r=$<=0;return e.jsxs(ht,{as:$e.div,initial:{opacity:0,scale:.95},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.95},transition:{duration:.15},whileHover:r?{}:{scale:1.02,y:-4},whileTap:r?{}:{scale:.96},onClick:()=>!r&&b(t),outOfStock:r,title:t.nombre,children:[e.jsx(bt,{lowstock:$<5&&!r,outOfStock:r,children:r?"Agotado":`Stock: ${$}`}),e.jsx(vt,{productId:j,productName:t.nombre,onView:W=>T({isOpen:!0,imageUrl:W})}),e.jsxs("div",{className:"info",style:{padding:"12px",flex:1,display:"flex",flexDirection:"column",gap:"4px"},children:[e.jsx("div",{className:"product-name",style:{fontWeight:600,fontSize:"0.88rem",color:"#1e293b",lineHeight:"1.25",height:"3.8rem",overflow:"hidden",display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical"},children:t.nombre}),e.jsx("div",{style:{fontSize:"0.85rem",fontWeight:"bold",color:"#334155",marginBottom:"4px"},children:t.codigo||"S/C"}),c?e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:{fontSize:"0.75rem",color:"#64748b",display:"flex",alignItems:"center",gap:"4px",marginTop:"auto",marginBottom:"1px",textDecoration:"line-through"},children:["Tienda: C$ ",ve(t.precio_venta||t.precio)]}),e.jsxs("div",{className:"price",style:{fontWeight:800,color:"#8b5cf6",fontSize:"1.1rem"},children:["C$ ",ve(t.mayorista||t.mayoreo||t.distribuidor||t.taller||t.precio_venta)]})]}):e.jsxs(e.Fragment,{children:[(Number(t.mayorista)>0||Number(t.mayoreo)>0||Number(t.distribuidor)>0||Number(t.taller)>0)&&e.jsxs("div",{style:{fontSize:"0.75rem",color:"#10b981",display:"flex",alignItems:"center",gap:"4px",marginTop:"auto",marginBottom:"1px"},children:[e.jsx(Ge,{size:10})," May: C$ ",ve(t.mayorista||t.mayoreo||t.distribuidor||t.taller)]}),e.jsxs("div",{className:"price",style:{fontWeight:800,color:"#2563eb",fontSize:"1.05rem",marginTop:Number(t.mayorista)>0||Number(t.mayoreo)>0||Number(t.distribuidor)>0||Number(t.taller)>0?0:"auto"},children:["C$ ",ve(t.precio_venta||t.precio)]})]})]})]},j)})})}),e.jsx(Re,{children:I.isOpen&&e.jsx(Ct,{isOpen:!0,imageSrc:I.imageUrl,onClose:()=>T({isOpen:!1,imageUrl:null})})})]})}const wt=ke.memo(()=>e.jsx("style",{children:`
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
`,Bt=({currentUser:o,isCajaOpen:f,session:a,onOpenCaja:b,onCloseCaja:S,onClose:p,isAdmin:i,showConfirmation:n,showAlert:u,initialTasaDolar:c,clients:I=[]})=>{var ye,d;const[T,F]=l.useState(""),[m,E]=l.useState(c||36.6),[t,x]=l.useState(""),[j,v]=l.useState(!1),K=Ye(),$=(o==null?void 0:o.id_usuario)||(o==null?void 0:o.id);let r=(ye=a==null?void 0:a.openedBy)==null?void 0:ye.name;!r&&(a!=null&&a.openedBy)&&typeof a.openedBy=="string"&&(r=a.openedBy),r||(r=(a==null?void 0:a.userId)===$?(o==null?void 0:o.nombre_usuario)||(o==null?void 0:o.username):"Usuario"),r||(r="Caja General");const W=i||(a==null?void 0:a.userId)===$||((d=a==null?void 0:a.openedBy)==null?void 0:d.id)===$,V=l.useMemo(()=>Array.isArray(a==null?void 0:a.transactions)?a.transactions:[],[a]),Z=l.useMemo(()=>{const s=jt(V,(a==null?void 0:a.initialAmount)||0,(a==null?void 0:a.tasaDolar)||c);return a!=null&&a.stats&&a.stats.vEfectivoC!==void 0?{...a.stats,lists:a.stats.lists||s.lists}:s},[V,a,c]),{cajaInicial:k,netCordobas:M,netDolares:g,efectivoEsperado:C,efectivoEsperadoCordobas:D,efectivoEsperadoDolares:le,totalTarjeta:A,totalTransferencia:q,totalCredito:ee,totalNoEfectivo:Q,sumDevolucionesCancelaciones:L,totalHidden:y,tasaRef:Y,vEfectivoC:P,vEfectivoD:pe,vTarjeta:B,vTransf:G,vCredito:z,aEfectivoC:me,aEfectivoD:re,aTarjeta:ie,aTransf:te,lists:{ventasContado:xe,devoluciones:oe,cancelaciones:ze,entradas:X,salidas:H,abonos:ne}}=Z,de=(P||0)+(pe||0)*Y+(B||0)+(G||0)+(z||0)+(me||0)+(re||0)*Y+(ie||0)+(te||0)-(L||0),_=Number(t||0)-C;a!=null&&a.openedAt&&new Date(a.openedAt);const Ce=()=>{const s=parseFloat(T||0);if(isNaN(s)||s<0)return u({title:"Inválido",message:"Monto inicial >= 0"});b(s,Number(m||36.6))},we=()=>{if(isNaN(parseFloat(t)))return u({title:"Requerido",message:"Ingrese el monto contado físico."});v(!0)},Se=ke.useCallback(()=>{const s=document.getElementById("print-wrapper-caja");if(!s)return;const N=s.outerHTML,U=`
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
      `,ae=window.open("","_blank","width=500,height=600");ae&&(ae.document.write(`<html><head><title>Cierre Caja</title><style>${U}</style></head><body>${N}</body></html>`),ae.document.close(),ae.focus(),ae.onload=function(){setTimeout(()=>{ae.print()},300)},ae.onafterprint=()=>{try{ae.close()}catch{}})},[]),Ne=()=>{Se(),setTimeout(()=>{S(Number(t))},800)},h=s=>`C$${Number(s||0).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`,fe=s=>`$${Number(s||0).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`;return e.jsxs(be,{className:"no-print",children:[e.jsx(wt,{}),e.jsxs(je,{style:{maxWidth:j?450:760,padding:j?0:"1.5rem",background:"#f8f9fa"},children:[!j&&e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12},children:[e.jsx("h2",{style:{margin:0},children:"Gestión de Caja"}),e.jsx(R,{$cancel:!0,onClick:p,style:{borderRadius:"50%",width:32,height:32,padding:0},children:"✕"})]}),f?j?e.jsxs("div",{style:{display:"flex",flexDirection:"column",height:"100%",maxHeight:"90vh"},children:[e.jsxs("div",{style:{padding:"15px 20px",background:"#343a40",color:"#fff",display:"flex",justifyContent:"space-between",alignItems:"center",borderRadius:"8px 8px 0 0"},children:[e.jsxs("div",{children:[e.jsx("h3",{style:{margin:0,fontSize:"1.2rem",fontWeight:"800",letterSpacing:"0.5px"},children:"REPORTAR CIERRE DE CAJA"}),e.jsx("p",{style:{margin:0,fontSize:"0.9rem",opacity:.8},children:new Date().toLocaleString("es-NI")})]}),e.jsxs(R,{$cancel:!0,onClick:()=>v(!1),style:{padding:"8px 15px",fontSize:"0.9rem",background:"rgba(255,255,255,0.2)",border:"none"},children:[e.jsx(We,{})," Volver / Editar"]})]}),e.jsxs("div",{style:{flex:1,overflowY:"auto",background:"#f8f9fa",padding:"20px"},children:[e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:15,marginBottom:20},children:[e.jsxs("div",{style:{background:"#fff",padding:15,borderRadius:8,boxShadow:"0 2px 5px rgba(0,0,0,0.05)",borderLeft:"4px solid #007bff"},children:[e.jsx("div",{style:{fontSize:"0.8rem",color:"#666",textTransform:"uppercase"},children:"Ingresos Totales Netos"}),e.jsx("div",{style:{fontSize:"1.5rem",fontWeight:"800",color:"#333"},children:h(de)})]}),e.jsxs("div",{style:{background:"#fff",padding:15,borderRadius:8,boxShadow:"0 2px 5px rgba(0,0,0,0.05)",borderLeft:"4px solid #28a745"},children:[e.jsx("div",{style:{fontSize:"0.8rem",color:"#666",textTransform:"uppercase"},children:"Efectivo Real"}),e.jsx("div",{style:{fontSize:"1.5rem",fontWeight:"800",color:"#28a745"},children:h(t)})]}),e.jsxs("div",{style:{background:"#fff",padding:15,borderRadius:8,boxShadow:"0 2px 5px rgba(0,0,0,0.05)",borderLeft:`4px solid ${_<0?"#dc3545":"#ffc107"}`},children:[e.jsx("div",{style:{fontSize:"0.8rem",color:"#666",textTransform:"uppercase"},children:"Diferencia"}),e.jsxs("div",{style:{fontSize:"1.5rem",fontWeight:"800",color:_!==0?_<0?"#dc3545":"#e0a800":"#28a745"},children:[_>0?"+":"",h(_)]})]})]}),e.jsxs("div",{style:{background:"#fff",padding:20,borderRadius:8,boxShadow:"0 2px 10px rgba(0,0,0,0.05)",marginBottom:20},children:[e.jsx("h4",{style:{margin:"0 0 15px",borderBottom:"1px solid #eee",paddingBottom:10},children:"Arqueo Detallado"}),e.jsx("table",{style:{width:"100%",borderCollapse:"collapse"},children:e.jsxs("tbody",{children:[e.jsxs("tr",{style:{borderBottom:"1px solid #f1f1f1"},children:[e.jsx("td",{style:{padding:10},children:"Fondo Inicial"}),e.jsx("td",{className:"text-right",style:{padding:10,fontWeight:"bold"},children:h(k)})]}),e.jsx("tr",{style:{background:"#f8f9fa"},children:e.jsx("td",{colSpan:"2",style:{padding:"8px 10px",fontSize:"0.85rem",fontWeight:"bold",color:"#007bff"},children:"RESUMEN DE INGRESOS"})}),e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"4px 10px 4px 20px",fontSize:"0.9rem"},children:"(+) Ventas Netas (Ventas + Abonos - Devoluciones)"}),e.jsx("td",{className:"text-right",style:{padding:"4px 10px",fontSize:"0.9rem"},children:h(de)})]}),L>0&&e.jsxs("tr",{children:[e.jsxs("td",{style:{padding:"4px 10px 4px 20px",fontSize:"0.85rem",color:"#856404"},children:["    (Devoluciones/Cancel. ya descontadas: ",h(L),")"]}),e.jsx("td",{})]}),e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"4px 10px 4px 20px",fontSize:"0.9rem",color:"#dc3545"},children:"(-) Tarjetas / Transf / Crédito"}),e.jsxs("td",{className:"text-right",style:{padding:"4px 10px",fontSize:"0.9rem",color:"#dc3545"},children:["- ",h(Q)]})]}),A>0&&e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"2px 10px 2px 35px",fontSize:"0.82rem",color:"#6c757d"},children:"💳 Tarjeta"}),e.jsx("td",{className:"text-right",style:{padding:"2px 10px",fontSize:"0.82rem",color:"#6c757d"},children:h(A)})]}),q>0&&e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"2px 10px 2px 35px",fontSize:"0.82rem",color:"#6c757d"},children:"🏦 Transferencia"}),e.jsx("td",{className:"text-right",style:{padding:"2px 10px",fontSize:"0.82rem",color:"#6c757d"},children:h(q)})]}),ee>0&&e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"2px 10px 2px 35px",fontSize:"0.82rem",color:"#6c757d"},children:"📋 Crédito"}),e.jsx("td",{className:"text-right",style:{padding:"2px 10px",fontSize:"0.82rem",color:"#6c757d"},children:h(ee)})]}),X.length>0&&e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"4px 10px 4px 20px",fontSize:"0.9rem",color:"#28a745"},children:"(+) Entradas de Efectivo"}),e.jsxs("td",{className:"text-right",style:{padding:"4px 10px",fontSize:"0.9rem",color:"#28a745"},children:["+ ",h(X.reduce((s,N)=>s+Math.abs(N.displayAmount||0),0))]})]}),e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"4px 10px 4px 20px",fontSize:"0.9rem",color:"#dc3545"},children:"(-) Salidas de Efectivo"}),e.jsxs("td",{className:"text-right",style:{padding:"4px 10px",fontSize:"0.9rem",color:"#dc3545"},children:["- ",h(H.reduce((s,N)=>s+Math.abs(N.displayAmount||0),0))]})]}),e.jsxs("tr",{style:{borderBottom:"1px solid #f1f1f1",background:"#e8f5e9"},children:[e.jsx("td",{style:{padding:10,fontWeight:"bold",fontSize:"1.1rem"},children:"Esperado en Caja"}),e.jsx("td",{className:"text-right",style:{padding:10,fontWeight:"bold",fontSize:"1.1rem",color:"#146c43"},children:h(C)})]})]})})]}),(ne.length>0||X.length>0||H.length>0)&&e.jsxs("div",{style:{background:"#fff",padding:20,borderRadius:8,boxShadow:"0 2px 10px rgba(0,0,0,0.05)"},children:[e.jsx("h4",{style:{margin:"0 0 15px",borderBottom:"1px solid #eee",paddingBottom:10},children:"Detalle de Movimientos"}),X.length>0&&e.jsxs("div",{style:{marginBottom:15},children:[e.jsx("h5",{style:{color:"#28a745",margin:"0 0 5px"},children:"Entradas de Caja"}),X.map((s,N)=>e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px dashed #eee"},children:[e.jsx("div",{children:s.note||"Entrada Varia"}),e.jsxs("div",{style:{fontWeight:"bold",color:"#28a745"},children:["+ ",h(Math.abs(s.amount))]})]},N))]}),ne.length>0&&e.jsxs("div",{style:{marginBottom:15},children:[e.jsx("h5",{style:{color:"#007bff",margin:"0 0 5px"},children:"Abonos Recibidos"}),ne.map((s,N)=>e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px dashed #eee"},children:[e.jsxs("div",{children:[e.jsx("strong",{children:s.resolvedClientName||"Cliente General"}),e.jsx("div",{style:{fontSize:"0.8rem",color:"#666"},children:s.note||"Abono de cuenta"})]}),e.jsxs("div",{style:{fontWeight:"bold",color:"#28a745"},children:["+ ",h(s.amount)]})]},N))]}),H.length>0&&e.jsxs("div",{children:[e.jsx("h5",{style:{color:"#dc3545",margin:"0 0 5px"},children:"Salidas de Caja"}),H.map((s,N)=>e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px dashed #eee"},children:[e.jsx("div",{children:s.note||"Salida Varia"}),e.jsx("div",{style:{fontWeight:"bold",color:"#dc3545"},children:h(Math.abs(s.amount))})]},N))]})]})]}),e.jsx("div",{style:{display:"none"},children:e.jsxs(St,{id:"print-wrapper-caja",className:"print-80",children:[e.jsxs("div",{className:"brand",children:[e.jsx("img",{src:"/icons/logo.png",alt:"Logo",style:{filter:"grayscale(100%) contrast(150%)"}}),e.jsx("h2",{children:"CIERRE DE CAJA"}),e.jsx("p",{children:"Multirepuestos RG"}),e.jsx("p",{children:new Date().toLocaleString("es-NI")}),e.jsxs("p",{children:["Cajero: ",r]})]}),e.jsxs("div",{className:"section",children:[e.jsx("div",{className:"section-title",children:"1. INGRESOS TOTALES NETOS"}),e.jsxs("div",{className:"row big",children:[e.jsx("span",{children:"TOTAL NETO:"}),e.jsx("span",{children:h(de)})]}),e.jsx("div",{className:"row sub",children:"(Ventas + Abonos - Devoluciones/Cancelaciones)"}),L>0&&e.jsxs("div",{className:"row sub",style:{color:"#856404"},children:["(Devol./Cancel.: -",h(L),")"]})]}),e.jsxs("div",{className:"section",children:[e.jsx("div",{className:"section-title",children:"2. DESGLOSE NO EFECTIVO"}),A>0&&e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"(-) Tarjetas:"}),e.jsx("span",{children:h(A)})]}),q>0&&e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"(-) Transf.:"}),e.jsx("span",{children:h(q)})]}),ee>0&&e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"(-) Créditos:"}),e.jsx("span",{children:h(ee)})]}),e.jsxs("div",{className:"row",style:{borderTop:"1px dashed #000"},children:[e.jsx("span",{children:"TOTAL NO EFECTIVO:"}),e.jsx("span",{children:h(Q)})]})]}),e.jsxs("div",{className:"section",children:[e.jsx("div",{className:"section-title",children:"3. FLUJO EFECTIVO (RESUMEN)"}),e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"Fondo Inicial:"}),e.jsx("span",{children:h(k)})]}),e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"(+) Ingresos Netos:"}),e.jsx("span",{children:h(de)})]}),e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"(-) No Efectivo:"}),e.jsxs("span",{children:["-",h(Q)]})]}),Math.abs(H.reduce((s,N)=>s+Math.abs(N.displayAmount||0),0))>0&&e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"(-) Salidas:"}),e.jsxs("span",{children:["-",h(H.reduce((s,N)=>s+Math.abs(N.displayAmount||0),0))]})]})]}),e.jsxs("div",{className:"section",children:[e.jsx("div",{className:"section-title",children:"4. ARQUEO FINAL"}),e.jsxs("div",{className:"row big",children:[e.jsx("span",{children:"EFECTIVO ESPERADO:"}),e.jsx("span",{children:h(C)})]}),e.jsxs("div",{className:"row sub",children:["(",h(D)," + ",fe(le),")"]}),e.jsxs("div",{className:"row",style:{marginTop:8,paddingTop:4,borderTop:"1px dashed #ccc"},children:[e.jsx("span",{children:"EFECTIVO REAL:"}),e.jsx("span",{children:h(t)})]}),e.jsxs("div",{className:"row alert",style:{color:"#000",borderColor:"#000"},children:[e.jsx("span",{children:"DIFERENCIA:"}),e.jsxs("span",{children:[_>0?"+":"",h(_)]})]}),e.jsx("div",{style:{textAlign:"center",fontSize:"0.75rem",fontWeight:"bold",marginTop:2},children:Math.abs(_)<.5?"(CAJA CUADRADA)":_>0?"(SOBRANTE)":"(FALTANTE)"})]}),e.jsxs("div",{className:"section",children:[e.jsx("div",{className:"section-title",children:"5. DETALLE DE MOVIMIENTOS"}),e.jsx("table",{style:{marginTop:0},children:e.jsxs("tbody",{children:[ne.length>0&&e.jsxs(e.Fragment,{children:[e.jsx("tr",{children:e.jsx("td",{colSpan:"2",style:{fontWeight:"900",background:"#f8f9fa",fontSize:"0.9rem"},children:"--- ABONOS Y CREDITOS ---"})}),ne.map((s,N)=>e.jsxs("tr",{children:[e.jsxs("td",{style:{fontSize:"0.9rem"},children:[s.resolvedClientName||s.note||"Abono"," ",e.jsx("br",{}),e.jsxs("span",{style:{fontSize:"0.75rem",color:"#555"},children:["#",s.id]})]}),e.jsx("td",{className:"text-right",style:{fontSize:"0.9rem"},children:h(s.amount)})]},"a"+N))]}),H.length>0&&e.jsxs(e.Fragment,{children:[e.jsx("tr",{children:e.jsx("td",{colSpan:"2",style:{fontWeight:"900",background:"#f8f9fa",fontSize:"0.9rem",paddingTop:8},children:"--- SALIDAS DE EFECTIVO ---"})}),H.map((s,N)=>e.jsxs("tr",{children:[e.jsx("td",{style:{fontSize:"0.9rem"},children:s.note||"Salida Varia"}),e.jsx("td",{className:"text-right",style:{fontSize:"0.9rem"},children:h(Math.abs(s.amount))})]},"s"+N))]}),X.length>0&&e.jsxs(e.Fragment,{children:[e.jsx("tr",{children:e.jsx("td",{colSpan:"2",style:{fontWeight:"900",background:"#f8f9fa",fontSize:"0.9rem",paddingTop:8},children:"--- ENTRADAS DE EFECTIVO ---"})}),X.map((s,N)=>e.jsxs("tr",{children:[e.jsx("td",{style:{fontSize:"0.9rem"},children:s.note||"Entrada Varia"}),e.jsx("td",{className:"text-right",style:{fontSize:"0.9rem"},children:h(s.amount)})]},"e"+N))]})]})}),ne.length===0&&H.length===0&&X.length===0&&e.jsx("div",{style:{textAlign:"center",fontStyle:"italic",fontSize:"0.8rem",padding:5},children:"Sin movimientos extra"})]}),e.jsxs("div",{className:"signature",children:[e.jsx("div",{className:"signature-line"}),e.jsx("p",{children:"Firma Responsable"})]})]})}),e.jsxs("div",{style:{padding:"20px",background:"#fff",borderTop:"1px solid #ccc",display:"flex",gap:10,justifyContent:"flex-end"},children:[e.jsx(R,{$cancel:!0,onClick:()=>v(!1),children:"Seguir Editando"}),e.jsxs(R,{primary:!0,style:{padding:"12px 24px",fontSize:"1rem",display:"flex",alignItems:"center",gap:8},onClick:Ne,disabled:!W,children:[e.jsx(Le,{})," IMPRIMIR Y CERRAR CAJA"]})]}),!W&&e.jsx("div",{style:{padding:5,textAlign:"center",color:"red",fontSize:"0.8rem"},children:"Solo el Admin o quien abrió puede cerrar."})]}):e.jsxs("div",{children:[e.jsx("h3",{style:{color:"#dc3545",borderBottom:"2px solid #dc3545",paddingBottom:10},children:"Arqueo y Cierre"}),e.jsx("div",{style:{background:"#e9ecef",padding:10,borderRadius:6,marginBottom:15},children:e.jsxs(J,{style:{fontSize:"1.1rem"},children:[e.jsxs("span",{children:[e.jsx(Qe,{})," Abrió:"]}),e.jsx("strong",{children:r})]})}),e.jsxs("div",{style:{marginTop:8,padding:"15px",backgroundColor:"#f8f9fa",borderRadius:6,border:"1px dashed #ced4da"},children:[e.jsx("div",{style:{fontWeight:"800",marginBottom:10,fontSize:"1.2rem",color:"#495057"},children:"Efectivo a Tener:"}),e.jsxs(J,{style:{fontSize:"1.3rem"},children:[e.jsx("span",{children:"Córdobas:"}),e.jsxs("strong",{style:{color:"#198754"},children:["C$ ",Number(D).toLocaleString()]})]}),e.jsxs(J,{style:{fontSize:"1.3rem"},children:[e.jsx("span",{children:"Dólares:"}),e.jsxs("strong",{style:{color:"#198754"},children:["$ ",Number(le).toLocaleString()]})]}),e.jsxs(J,{$bold:!0,style:{marginTop:10,borderTop:"2px solid #ccc",paddingTop:10,fontSize:"1.5rem"},children:[e.jsx("span",{children:"TOTAL (C$):"}),e.jsx("span",{children:h(C)})]})]}),Q>0&&e.jsxs("div",{style:{marginTop:12,padding:"12px 15px",backgroundColor:"#fff3cd",borderRadius:6,border:"1px solid #ffc107"},children:[e.jsx("div",{style:{fontWeight:"800",marginBottom:8,fontSize:"1rem",color:"#856404"},children:"Desglose No Efectivo:"}),A>0&&e.jsxs(J,{style:{fontSize:"1.1rem"},children:[e.jsx("span",{children:"💳 Tarjeta:"}),e.jsx("strong",{children:h(A)})]}),q>0&&e.jsxs(J,{style:{fontSize:"1.1rem"},children:[e.jsx("span",{children:"🏦 Transferencia:"}),e.jsx("strong",{children:h(q)})]}),ee>0&&e.jsxs(J,{style:{fontSize:"1.1rem"},children:[e.jsx("span",{children:"📋 Crédito:"}),e.jsx("strong",{children:h(ee)})]}),e.jsxs(J,{$bold:!0,style:{marginTop:6,borderTop:"1px dashed #856404",paddingTop:6,fontSize:"1.15rem",color:"#856404"},children:[e.jsx("span",{children:"Total No Efectivo:"}),e.jsx("span",{children:h(Q)})]})]}),e.jsx("label",{style:{display:"block",marginTop:20,fontWeight:800,fontSize:"1.3rem"},children:"Monto Contado Físico (C$)"}),e.jsx(O,{type:"number",step:"0.01",value:t,onChange:s=>x(s.target.value),autoFocus:!0,placeholder:"Total Billetes + Monedas",style:{fontSize:"1.5rem",padding:"12px",height:"auto"}}),t&&e.jsxs(J,{$bold:!0,style:{marginTop:15,color:_!==0?"#dc3545":"#28a745",fontSize:"1.8rem",padding:"10px",background:_!==0?"#fff5f5":"#f0fff4",borderRadius:8,border:`2px solid ${_!==0?"#dc3545":"#28a745"}`},children:[e.jsx("span",{children:"Diferencia:"}),e.jsx("span",{children:h(_)})]}),e.jsxs("div",{style:{display:"flex",gap:10,marginTop:20},children:[e.jsx(R,{primary:!0,style:{flex:1},onClick:we,disabled:!W||!t,children:"Ver Reporte"}),e.jsx(R,{$cancel:!0,onClick:p,children:"Cancelar"})]})]}):e.jsxs("div",{style:{padding:j?"1rem":0},children:[e.jsxs("h3",{style:{color:"#28a745",borderBottom:"2px solid #28a745",paddingBottom:10},children:[e.jsx(Ke,{})," Abrir Caja"]}),e.jsxs("div",{style:{display:"grid",gap:12},children:[e.jsx("label",{style:{fontWeight:600},children:"Monto Inicial (C$)"}),e.jsx(O,{type:"number",step:"0.01",value:T,onChange:s=>F(s.target.value),autoFocus:!0}),e.jsx("label",{style:{fontWeight:600},children:"Tasa del Dólar"}),e.jsx(O,{type:"number",step:"0.01",value:m,onChange:s=>E(s.target.value)})]}),e.jsxs("div",{style:{marginTop:20,display:"flex",gap:10},children:[e.jsx(R,{primary:!0,style:{flex:1},onClick:Ce,children:"Abrir Caja"}),e.jsx(R,{onClick:()=>K("/dashboard"),children:"Ir al Dashboard"})]})]})]})]})},ue=o=>{const f=parseFloat(o);return Number.isNaN(f)||Math.abs(f)<.001?0:f},Ot=({total:o=0,tasaDolar:f=1,onClose:a,onFinishSale:b,clientes:S=[],empleados:p=[],users:i=[],showAlert:n,initialClientId:u="0",cartSnapshot:c=[],currentUserId:I=void 0,orderSubtotal:T=void 0,orderDiscountAmount:F=void 0})=>{const[m,E]=l.useState("0.00"),[t,x]=l.useState("0.00"),[j,v]=l.useState("0.00"),[K,$]=l.useState("0.00"),[r,W]=l.useState(""),[V,Z]=l.useState(""),[k,M]=l.useState("contado"),[g,C]=l.useState(u??"0"),[D,le]=l.useState(""),[A,q]=l.useState(!1),[ee,Q]=l.useState(!1),L=l.useMemo(()=>{const d=parseInt(g,10);return Number.isNaN(d)?0:d},[g]),y=L!==0,Y=l.useMemo(()=>ue(m),[m]),P=l.useMemo(()=>ue(t),[t]),pe=l.useMemo(()=>ue(j),[j]),B=l.useMemo(()=>ue(K),[K]),G=l.useMemo(()=>pe*Number(f||1),[pe,f]),z=l.useMemo(()=>Y+P+B+G,[Y,P,B,G]),me=l.useMemo(()=>P>.01,[P]),re=l.useMemo(()=>Number(o)-z,[o,z]),ie=l.useMemo(()=>k==="credito"&&y&&re>.01?re:(z>=Number(o)-1e-4,0),[k,y,re,z,o]),te=l.useMemo(()=>{const d=ue(re);return d<=.01||k==="credito"&&y?0:d},[re,k,y]),xe=l.useMemo(()=>Math.max(0,-re),[re]),oe=l.useMemo(()=>ie>.01?z>.01?"mixto":"credito_total":"contado",[ie,z]),ze=l.useMemo(()=>{if(te>.01)return"PAGO INCOMPLETO";if((oe==="mixto"||oe==="credito_total")&&!y)return"CLIENTE NO SELECCIONADO";switch(oe){case"mixto":return"PAGO MIXTO (Contado + Crédito)";case"credito_total":return"CRÉDITO TOTAL";default:return"CONTADO"}},[oe,te,y]),X=l.useMemo(()=>k==="credito"&&!y,[k,y]),H=l.useMemo(()=>A||te>.01||(oe==="mixto"||oe==="credito_total")&&!y||me&&!r.trim()||B>.01&&!V.trim(),[A,te,oe,y,me,r,B,V]),ne=l.useMemo(()=>Array.isArray(c)?c.map(({raw:d,costo:s,existencia:N,...U})=>({id:U.id||U.id_producto,nombre:U.nombre??U.descripcion??U.producto??"",quantity:Number(U.quantity||0),precio:Number(U.precio_venta??U.precio??0)})).filter(d=>d.quantity>0):[],[c]),de=l.useMemo(()=>typeof T=="number"?Number(T):ne.reduce((d,s)=>d+Number(s.precio||0)*Number(s.quantity||0),0),[T,ne]);l.useMemo(()=>{if(typeof F=="number")return Number(F);const d=Number(de)-Number(o);return d>0?d:0},[F,de,o]),l.useEffect(()=>{k==="contado"&&z===0&&Number(o)>0&&E(Number(o).toFixed(2)),k==="credito"&&!y&&C("0")},[k,o]);const _=l.useCallback(d=>{const s=String(d.target.value);C(s),(parseInt(s,10)||0)!==0&&(M("contado"),z<Number(o)&&z===0&&E(Number(o).toFixed(2)))},[z,o]),Ce=l.useCallback(()=>{M("contado");const d=P+B+G,s=Math.max(0,Number(o)-d);E(Number(s).toFixed(2))},[P,B,G,o]),we=l.useCallback(()=>{if(!y){n==null||n({title:"Cliente Requerido",message:"Debe seleccionar un cliente para habilitar la opción de Crédito.",type:"error"});return}M("credito"),E("0.00"),x("0.00"),v("0.00"),$("0.00"),W(""),Z("")},[y,n]),Se=l.useCallback(()=>{E(Number(o).toFixed(2)),x("0.00"),v("0.00"),$("0.00"),W(""),Z(""),M("contado")},[o]),Ne=({efectivo:d,tarjeta:s,transferencia:N,dolaresLocal:U,credito:ae})=>{const Ee=d+s+N+U>.01;return ae&&Ee?"mixto":ae&&!Ee?"credito_total":"contado"},h=async d=>{if(!y||L===0){n==null||n({title:"Cliente Requerido",message:"No puedes vender sin seleccionar un cliente. Por favor selecciona uno.",type:"error"});return}if((oe==="credito_total"||oe==="mixto")&&L===0){n==null||n({title:"Cliente Requerido",message:"Debe seleccionar un cliente para ventas a crédito o mixtas.",type:"error"});return}if(te>.01){n==null||n({title:"Pago Incompleto",message:`Faltan C$${te.toFixed(2)} para completar la venta.`,type:"warning"});return}if(me&&!r.trim()){n==null||n({title:"Dato Requerido",message:"Ingrese el número de referencia para el pago con tarjeta.",type:"warning"});return}if(B>.01&&!V.trim()){n==null||n({title:"Dato Requerido",message:"Ingrese el número de referencia para la transferencia.",type:"warning"});return}if(A)return;q(!0);const s=Math.max(0,Y+G-xe),N={totalVenta:Number(o),efectivo:Y,tarjeta:P,transferencia:B,dolares:pe,tasaDolarAlMomento:Number(f),referenciaTarjeta:r.trim(),referenciaTransferencia:V.trim(),credito:ie,clienteId:L,empleadoId:D||null,tipoVenta:Ne({efectivo:Y,tarjeta:P,transferencia:B,dolaresLocal:G,credito:ie}),cambio:Number(xe),ingresoCaja:Number(s),shouldPrintNow:d};try{typeof b=="function"&&await b(N),a==null||a()}catch(U){n==null||n({title:"Error",message:(U==null?void 0:U.message)||"No se pudo completar la venta.",type:"error"})}finally{q(!1)}},fe=y?te>.01?"#dc3545":xe>.01?"#28a745":"#17a2b8":"#dc3545",ye=y?te>.01?`¡FALTA CUBRIR! C$${te.toFixed(2)}`:xe>.01?`CAMBIO A ENTREGAR: C$${xe.toFixed(2)}`:"BALANCE PERFECTO":"¡SELECCIONA UN CLIENTE!";return e.jsx(be,{children:e.jsxs(je,{style:{maxWidth:"950px",width:"96%",maxHeight:"90vh",overflow:"hidden",borderRadius:16,backgroundColor:"#f8f9fa",boxShadow:"0 25px 50px -12px rgba(0, 0, 0, 0.25)"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"2px solid #e9ecef",paddingBottom:15,marginBottom:20},children:[e.jsxs("h2",{style:{margin:0,color:"#1e293b",fontSize:"1.5rem",fontWeight:800},children:[e.jsx(Ie,{style:{marginRight:"0.5rem",color:"#007bff"}})," PROCESAR PAGO"]}),e.jsx(R,{$cancel:!0,onClick:a,style:{borderRadius:"50%",width:40,height:40,padding:0,fontSize:"1.2rem",backgroundColor:"#fee2e2",color:"#ef4444",borderColor:"transparent"},children:e.jsx(Te,{})})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"5fr 4fr",gap:"2rem",height:"calc(90vh - 140px)"},children:[e.jsxs("div",{style:{paddingRight:10,borderRight:"1px solid #e2e8f0",overflowY:"auto",paddingBottom:10},children:[e.jsxs("div",{style:{padding:20,border:"1px solid #e2e8f0",borderRadius:12,backgroundColor:"#fff",marginBottom:20,boxShadow:"0 1px 3px rgba(0,0,0,0.05)"},children:[e.jsxs("h4",{style:{marginTop:0,color:"#334155",fontSize:"1rem",fontWeight:700,textTransform:"uppercase",marginBottom:15},children:[e.jsx(Xe,{style:{marginRight:6}})," Tipo de Venta"]}),e.jsxs("div",{style:{display:"flex",gap:12,marginBottom:20},children:[e.jsx(R,{onClick:Ce,style:{flex:1,padding:"10px 0",backgroundColor:k==="contado"?"#0ea5e9":"#f1f5f9",color:k==="contado"?"#fff":"#475569",border:"none",borderRadius:8,fontWeight:"700",boxShadow:k==="contado"?"0 4px 6px -1px rgba(14, 165, 233, 0.4)":"none"},children:"CONTADO"}),e.jsx(R,{onClick:we,disabled:!y,style:{flex:1,padding:"10px 0",backgroundColor:k==="credito"?"#f59e0b":"#f1f5f9",color:k==="credito"?"#fff":"#475569",border:"none",borderRadius:8,fontWeight:"700",boxShadow:k==="credito"?"0 4px 6px -1px rgba(245, 158, 11, 0.4)":"none",opacity:y?1:.5},children:"CRÉDITO"})]}),e.jsxs("label",{style:{display:"block",fontWeight:"700",marginBottom:8,color:"#475569",fontSize:"0.9rem"},children:[e.jsx(Ze,{})," Seleccionar Cliente ",e.jsx("span",{style:{color:"#ef4444"},children:"* (Obligatorio)"})]}),e.jsxs(O,{as:"select",value:g,onChange:_,style:{height:42,padding:"0 12px",width:"100%",fontSize:"1rem",border:y?"2px solid #22c55e":"2px solid #ef4444",backgroundColor:y?"#f0fdf4":"#fef2f2",borderRadius:8},children:[e.jsx("option",{value:"0",children:"-- Seleccionar Cliente --"}),(S||[]).map(d=>e.jsxs("option",{value:d.id_cliente??d.id,children:[d.nombre,Number(d.saldo_pendiente||0)>0?` (Deuda: C$${Number(d.saldo_pendiente).toFixed(2)})`:""]},d.id_cliente??d.id))]}),!y&&e.jsxs("p",{style:{color:"#ef4444",margin:"8px 0 0",fontSize:"0.85rem",fontWeight:"600"},children:[e.jsx(Te,{style:{marginRight:4}})," No puedes vender sin seleccionar un cliente."]}),e.jsxs("div",{style:{marginTop:20},children:[e.jsxs("label",{style:{display:"block",fontWeight:"700",marginBottom:8,color:"#475569",fontSize:"0.9rem"},children:[e.jsx(et,{})," Atendido por (opcional):"]}),e.jsxs("select",{value:D,onChange:d=>le(d.target.value),style:{width:"100%",padding:"10px 12px",fontSize:"1rem",borderRadius:8,border:"1px solid #cbd5e1",background:"#f8fafc",height:42},children:[e.jsx("option",{value:"",children:"-- Sin Empleado --"}),(p||[]).map(d=>e.jsx("option",{value:d.id_empleado,children:d.nombre},d.id_empleado))]})]})]}),e.jsxs("div",{style:{padding:20,border:"1px solid #e2e8f0",borderRadius:12,backgroundColor:"#fff",boxShadow:"0 1px 3px rgba(0,0,0,0.05)"},children:[e.jsx("h4",{style:{marginTop:0,color:"#334155",fontSize:"1rem",fontWeight:700,textTransform:"uppercase",borderBottom:"1px solid #f1f5f9",paddingBottom:10,marginBottom:15},children:"Desglose de Pago (C$)"}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"15px"},children:[e.jsxs("div",{children:[e.jsxs("label",{style:{display:"block",fontWeight:"600",fontSize:"0.85rem",marginBottom:6,color:"#64748b"},children:[e.jsx(tt,{})," Efectivo"]}),e.jsx(O,{type:"number",step:"0.01",value:m,onChange:d=>E(d.target.value),style:{width:"100%",height:38,fontSize:"1rem",borderRadius:8,border:"1px solid #cbd5e1"},disabled:X})]}),e.jsxs("div",{children:[e.jsxs("label",{style:{display:"block",fontWeight:"600",fontSize:"0.85rem",marginBottom:6,color:"#64748b"},children:[e.jsx(at,{})," Dólares"]}),e.jsx(O,{type:"number",step:"0.01",value:j,onChange:d=>v(d.target.value),style:{width:"100%",height:38,fontSize:"1rem",borderRadius:8,border:"1px solid #cbd5e1"},disabled:X})]}),e.jsxs("div",{children:[e.jsxs("label",{style:{display:"block",fontWeight:"600",fontSize:"0.85rem",marginBottom:6,color:"#64748b"},children:[e.jsx(Ie,{})," Tarjeta"]}),e.jsx(O,{type:"number",step:"0.01",value:t,onChange:d=>x(d.target.value),style:{width:"100%",height:38,fontSize:"1rem",borderRadius:8,border:"1px solid #cbd5e1"},disabled:X})]}),e.jsxs("div",{children:[e.jsxs("label",{style:{display:"block",fontWeight:"600",fontSize:"0.85rem",marginBottom:6,color:"#64748b"},children:[e.jsx(We,{})," Transferencia"]}),e.jsx(O,{type:"number",step:"0.01",value:K,onChange:d=>$(d.target.value),style:{width:"100%",height:38,fontSize:"1rem",borderRadius:8,border:"1px solid #cbd5e1"},disabled:X})]})]}),k==="credito"&&e.jsxs("div",{style:{marginTop:15,padding:12,backgroundColor:"#fff7ed",borderRadius:8,border:"1px dashed #f97316"},children:[e.jsxs("label",{style:{display:"block",fontWeight:"700",fontSize:"0.85rem",marginBottom:4,color:"#c2410c"},children:[e.jsx(ot,{})," CRÉDITO GENERADO"]}),e.jsxs("div",{style:{fontSize:"1.2rem",color:"#ea580c",fontWeight:800},children:["C$ ",ie.toFixed(2)]})]}),me&&e.jsxs("div",{style:{marginTop:15,padding:12,border:"1px solid #fcd34d",borderRadius:8,backgroundColor:"#fffbeb"},children:[e.jsxs("label",{style:{display:"block",fontWeight:"700",fontSize:"0.85rem",color:"#b45309",marginBottom:6},children:[e.jsx(Fe,{})," Nº Referencia Tarjeta ",e.jsx("span",{style:{color:"#ef4444"},children:"*"})]}),e.jsx(O,{type:"text",placeholder:"Ej: 1234",value:r,onChange:d=>W(d.target.value),style:{width:"100%",height:36,fontSize:"0.95rem"}})]}),B>.01&&e.jsxs("div",{style:{marginTop:15,padding:12,border:"1px solid #bae6fd",borderRadius:8,backgroundColor:"#f0f9ff"},children:[e.jsxs("label",{style:{display:"block",fontWeight:"700",fontSize:"0.85rem",color:"#0369a1",marginBottom:6},children:[e.jsx(Fe,{})," Nº Referencia Transferencia ",e.jsx("span",{style:{color:"#ef4444"},children:"*"})]}),e.jsx(O,{type:"text",placeholder:"Ej: REF-5678",value:V,onChange:d=>Z(d.target.value),style:{width:"100%",height:36,fontSize:"0.95rem"}})]}),k==="contado"&&e.jsxs(R,{info:!0,onClick:Se,style:{width:"100%",padding:"12px 0",marginTop:20,backgroundColor:"#e0f2fe",color:"#0284c7",border:"1px dashed #0ea5e9",fontSize:"0.95rem",fontWeight:600},children:[e.jsx(rt,{})," Rellenar con Efectivo (Total: C$ ",Number(o).toFixed(2),")"]})]})]}),e.jsxs("div",{style:{paddingLeft:10,display:"flex",flexDirection:"column",justifyContent:"space-between",paddingBottom:10},children:[e.jsxs("div",{children:[e.jsxs(Ae,{style:{marginBottom:15,padding:20,backgroundColor:"#f0f9ff",border:"none",borderRadius:12,boxShadow:"inset 0 2px 4px rgba(0,0,0,0.05)"},children:[e.jsxs(J,{$bold:!0,style:{fontSize:"1.8rem",color:"#0f172a",marginBottom:5},children:[e.jsx("span",{style:{fontSize:"1rem",color:"#64748b",fontWeight:600},children:"TOTAL A PAGAR"}),e.jsxs("span",{children:["C$ ",Number(o).toFixed(2)]})]}),e.jsxs(J,{style:{borderTop:"1px solid #cbd5e0",paddingTop:10,fontSize:"0.9rem",color:"#64748b"},children:[e.jsxs("span",{children:["Tasa USD: C$ ",Number(f).toFixed(2)]}),e.jsxs("span",{style:{color:"#0f172a",fontWeight:700},children:["$",(Number(o)/Number(f||1)).toFixed(2)," USD"]})]})]}),e.jsxs("div",{style:{padding:15,border:"1px solid #e2e8f0",borderRadius:12,marginBottom:15,backgroundColor:"#fff"},children:[e.jsxs(J,{style:{color:"#64748b",fontSize:"0.95rem",marginBottom:8},children:[e.jsx("span",{children:"Pagado (Contado)"}),e.jsxs("span",{style:{fontWeight:"700",color:"#1e293b"},children:["C$ ",z.toFixed(2)]})]}),e.jsxs(J,{style:{fontSize:"0.95rem"},children:[e.jsx("span",{children:"Estado"}),e.jsx("span",{style:{fontWeight:"700",color:ie>.01?"#f59e0b":y?"#22c55e":"#ef4444"},children:ze})]})]}),e.jsxs(Ae,{style:{marginBottom:10,padding:15,backgroundColor:fe==="#dc3545"?"#fef2f2":fe==="#28a745"?"#ecfccb":"#e0f2fe",color:fe==="#dc3545"?"#ef4444":fe==="#28a745"?"#4d7c0f":"#0369a1",fontWeight:"800",fontSize:"1.1rem",textAlign:"center",borderRadius:12,border:"none",boxShadow:"0 2px 4px rgba(0,0,0,0.05)"},children:[e.jsx(nt,{style:{marginRight:8}})," ",ye]})]}),e.jsxs("div",{style:{marginTop:"auto",display:"flex",flexDirection:"column",gap:"12px"},children:[e.jsxs(R,{type:"button",onClick:d=>{d.preventDefault(),h(!0)},disabled:H||!y,style:{width:"100%",padding:"16px 0",fontSize:"1.2rem",fontWeight:800,backgroundColor:H||!y?"#cbd5e1":"#2563eb",color:"white",border:"none",borderRadius:10,boxShadow:H||!y?"none":"0 4px 6px -1px rgba(37, 99, 235, 0.4)",transition:"all 0.2s"},children:[e.jsx(Le,{style:{marginRight:8}})," PAGAR E IMPRIMIR"]}),e.jsxs(R,{type:"button",onClick:d=>{d.preventDefault(),h(!1)},disabled:H||!y,style:{width:"100%",padding:"12px 0",fontSize:"1rem",fontWeight:700,backgroundColor:"white",color:H||!y?"#cbd5e1":"#475569",border:H||!y?"1px solid #e2e8f0":"2px solid #cbd5e1",borderRadius:10,transition:"all 0.2s"},children:[e.jsx(it,{style:{marginRight:8}})," Solo Guardar (Sin Ticket)"]})]})]})]})]})})},Nt=lt`
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
    .brand h1 { font-size: 20pt; color: #000000; margin-bottom: 5px; }
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
  max-width: 90px;
  max-height: 90px;
  width: auto;
  height: auto;
  object-fit: contain;
  display: block;
  border-radius: 8px;
  .print-a4 & { 
    max-width: 130px; 
    max-height: 90px;
    width: auto; 
    height: auto; 
  }
`;se.span`
  display: inline-flex; align-items: center; gap: 6px;
  font-weight: 700; letter-spacing: .4px; padding: 6px 10px;
  border-radius: 8px; font-size: 0.85rem;
  background: #e0f2fe; color: #0284c7; border: 1px solid #bae6fd;
  text-transform: uppercase;
`;const Et=se.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: .75rem;
`,$t=({cart:o=[],total:f=0,subtotal:a=0,discount:b=0,proformaFor:S="",onClose:p,currentUser:i,client:n})=>{const{user:u}=typeof De=="function"?De():{user:null},{settings:c}=mt(),I=r=>(r==null?void 0:r.usuarioNombre)||(r==null?void 0:r.nombre_usuario)||(r==null?void 0:r.name)||(r==null?void 0:r.nombre)||(r==null?void 0:r.username)||null;let T=null;try{T=JSON.parse(localStorage.getItem("authUser")||"null")}catch{}const F=I(i)||I(u)||I(T)||"Cajero POS",m=(n==null?void 0:n.nombre)||"Consumidor Final",E=(n==null?void 0:n.cedula)||"",t=new Date().toLocaleString("es-NI"),x=r=>new Intl.NumberFormat("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(r||0)),j=ke.useMemo(()=>{if(!(c!=null&&c.empresa_logo_url))return null;if(c.empresa_logo_url.startsWith("http"))return c.empresa_logo_url;let r=c.empresa_logo_url;return r.startsWith("/uploads")?r="/api"+r:r.startsWith("uploads")&&(r="/api/"+r),`${"https://sistema.multirepuestosrg.com/api".replace(/\/api$/,"")}${r.startsWith("/")?"":"/"}${r}`},[c==null?void 0:c.empresa_logo_url]),v={name:(c==null?void 0:c.empresa_nombre)||"Multirepuestos RG",ruc:(c==null?void 0:c.empresa_ruc)||"1211812770001E",phone:(c==null?void 0:c.empresa_telefono)||"84031936 / 84058142",address:(c==null?void 0:c.empresa_direccion)||"Del portón de la normal 75 varas al este. Juigalpa, Chontales.",slogan:(c==null?void 0:c.empresa_eslogan)||"Tu mejor opción en repuestos",logo:j||new URL("/icons/logo.png",window.location.origin).toString()},K=l.useCallback((r="80")=>{const W=document.getElementById("print-wrapper-proforma");if(!W)return;const V=W.outerHTML,k=`
      @charset "UTF-8";
      @import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;500;600;700;800&display=swap');
      @page { size: ${r==="A4"?"A4 portrait":"80mm auto"}; margin: ${r==="A4"?"12mm":"0"}; }
      html, body {
        background: #fff; margin: 0 !important; padding: 0 !important;
        -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;
        color: #000 !important;
        font-family: 'League Spartan', 'Inter', system-ui, -apple-system, sans-serif;
      }
      
      #print-wrapper-proforma {
        box-shadow: none !important; border: none !important; margin: 0 !important;
        font-family: 'League Spartan', 'Inter', system-ui, sans-serif !important;
        ${r==="A4"?"width: 100% !important; padding: 0 !important; font-size: 10pt !important;":"width: 80mm !important; padding: 6px 4px !important; font-size: 9pt !important;"}
      }

      #print-wrapper-proforma .brand h1 {
        font-family: 'League Spartan', 'Inter', sans-serif !important;
        font-weight: 900 !important;
      }

      #print-wrapper-proforma .brand-logo-container img {
        max-width: ${r==="A4"?"130px":"110px"} !important;
        max-height: ${r==="A4"?"90px":"110px"} !important;
        width: auto !important;
        height: auto !important;
        object-fit: contain !important;
      }

      ${r==="A4"?`
        #print-wrapper-proforma .brand { display: flex !important; justify-content: space-between !important; align-items: flex-start !important; text-align: left !important; border-bottom: 3px solid #1e3a8a !important; margin-bottom: 25px !important; padding-bottom: 15px !important; }
        #print-wrapper-proforma .brand-logo-container { width: 140px !important; justify-content: flex-start !important; order: 1 !important; }
        #print-wrapper-proforma .brand-info { flex: 1 !important; text-align: right !important; order: 2 !important; }
        #print-wrapper-proforma .brand h1 { font-size: 22pt !important; color: #000000 !important; margin: 0 0 5px 0 !important; }
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
    `,M=window.open("","_blank","width=900,height=700");M&&(M.document.write(`<!DOCTYPE html><html><head><title>PROFORMA - ${v.name}</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"><style>${k}</style></head><body>${V}</body></html>`),M.document.close(),M.focus(),M.onload=function(){setTimeout(()=>{M.print(),setTimeout(()=>{M.close(),p&&p()},500)},400)})},[v,p]),$=o.length<=2;return e.jsxs(be,{className:"no-print",children:[e.jsx(Nt,{}),e.jsxs(je,{className:"no-print",style:{maxWidth:520,width:"96%",padding:"1.2rem",background:"#fff"},children:[e.jsxs(Et,{children:[e.jsxs("h2",{style:{display:"flex",alignItems:"center",gap:8,margin:0,fontSize:"1.25rem"},children:[e.jsx(st,{})," Proforma"]}),e.jsxs("div",{style:{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"flex-end"},children:[e.jsx(R,{onClick:()=>K("80"),style:{padding:"8px 12px",fontSize:"0.85rem"},children:"80mm"}),e.jsxs(R,{onClick:()=>K("A4"),style:{padding:"8px 12px",fontSize:"0.85rem"},children:[e.jsx(Me,{})," A4"]}),e.jsx(R,{$cancel:!0,onClick:p,style:{padding:"8px 12px",background:"#e2e8f0",color:"#0f172a"},children:e.jsx(Te,{})})]})]}),e.jsx(kt,{children:e.jsxs(Tt,{id:"print-wrapper-proforma",className:`print-area print-80 ${$?"compact":""}`,children:[e.jsxs("div",{className:"brand",children:[e.jsx("div",{className:"brand-logo-container",children:e.jsx(zt,{src:v.logo,alt:"Logo",onError:r=>{r.currentTarget.style.display="none"}})}),e.jsxs("div",{className:"brand-info",children:[e.jsx("h1",{children:v.name}),e.jsx("small",{children:v.slogan}),e.jsxs("small",{children:["RUC: ",v.ruc]}),e.jsxs("small",{children:["Tel: ",v.phone]}),e.jsx("small",{children:v.address}),e.jsx("div",{style:{marginTop:6},children:e.jsxs("span",{className:"proforma-tag",children:[e.jsx(Me,{style:{marginRight:4,verticalAlign:"middle"}})," COTIZACIÓN / PROFORMA"]})})]})]}),e.jsxs("div",{className:"meta",children:[e.jsxs("div",{className:"meta-col",children:[e.jsx("span",{className:"meta-title",children:"Detalles"}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Fecha:"}),e.jsx("span",{className:"meta-value",children:t})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"ID Temp:"}),e.jsx("span",{className:"meta-value",children:Date.now().toString().slice(-6)})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Atendido por:"}),e.jsx("span",{className:"meta-value",children:F})]})]}),e.jsxs("div",{className:"meta-col",children:[e.jsx("span",{className:"meta-title",children:"Cliente"}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Nombre:"}),e.jsx("span",{className:"meta-value",children:S||m})]}),E&&e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Cédula:"}),e.jsx("span",{className:"meta-value",children:E})]})]})]}),e.jsxs("table",{className:"items",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{className:"col-qty",children:"Cant."}),e.jsx("th",{children:"Descripción"}),e.jsx("th",{className:"text-right col-unit",children:"P. Unit."}),e.jsx("th",{className:"text-right col-total",children:"Total"})]})}),e.jsx("tbody",{children:o.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:"4",style:{textAlign:"center",color:"#777"},children:"Sin ítems"})}):o.map((r,W)=>{const V=Number(r.precio_venta??r.precio??0),Z=Number(r.quantity??0),k=V*Z;return e.jsxs("tr",{children:[e.jsx("td",{className:"col-qty",children:Z}),e.jsx("td",{children:r.nombre||r.descripcion||"Item"}),e.jsxs("td",{className:"text-right col-unit",children:["C$",x(V)]}),e.jsxs("td",{className:"text-right col-total",children:["C$",x(k)]})]},W)})})]}),e.jsx("div",{className:"totals",children:e.jsxs("div",{className:"totals-box",children:[e.jsxs(J,{children:[e.jsx("span",{children:"Subtotal:"}),e.jsxs("span",{children:["C$",x(a)]})]}),b>0&&e.jsxs(J,{style:{color:"#dc3545"},children:[e.jsx("span",{children:"Descuento:"}),e.jsxs("span",{children:["- C$",x(b)]})]}),e.jsxs(J,{className:"grand-total",style:{fontWeight:"bold",fontSize:"1.2rem",marginTop:5,borderTop:"2px solid black"},children:[e.jsx("span",{children:"TOTAL:"}),e.jsxs("span",{children:["C$",x(f)]})]}),e.jsxs("div",{style:{marginTop:12,textAlign:"center"},children:[e.jsx("span",{className:"badge",children:"DOCUMENTO NO VÁLIDO COMO FACTURA"}),e.jsx("p",{style:{margin:"5px 0 0",fontSize:"0.72rem",color:"#666"},children:"Precios sujetos a cambio. Válido por 3 días."})]})]})}),e.jsxs("div",{className:"thanks",children:[e.jsxs("p",{children:['"',v.slogan,'"']}),e.jsx("p",{style:{whiteSpace:"pre-line",marginTop:"5px"},children:(c==null?void 0:c.ticket_proforma_footer)||"¡Gracias por cotizar con nosotros!"})]})]})})]})]})},Wt=({isOpen:o,onClose:f,onConfirm:a,onSubmit:b,title:S,message:p,fields:i=[],inputType:n="number",icon:u})=>{const[c,I]=l.useState({}),[T,F]=l.useState("");if(l.useEffect(()=>{if(o)if(i.length>0){const t={};i.forEach(x=>{t[x.name]=x.defaultValue!==void 0?x.defaultValue:""}),I(t)}else F("")},[o,i]),!o)return null;const m=()=>{i.length>0?b?b(c):a&&a(c):b?b(T):a&&a(T)},E=(t,x)=>{I(j=>({...j,[t]:x}))};return e.jsx(be,{children:e.jsxs(je,{style:{maxWidth:"450px"},children:[e.jsxs("div",{style:{textAlign:"center",marginBottom:"1.5rem"},children:[u?e.jsx("div",{style:{fontSize:"2.5rem",marginBottom:"1rem"},children:u}):e.jsx(dt,{size:"2.5em",color:"#007bff"}),e.jsx("h2",{style:{marginTop:"0.5rem",marginBottom:"0.5rem"},children:S}),p&&e.jsx("p",{style:{color:"#6c757d"},children:p})]}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:i.length>0?i.map(t=>e.jsxs("div",{children:[t.label&&e.jsx("label",{style:{display:"block",marginBottom:"5px",fontWeight:600,fontSize:"0.9rem"},children:t.label}),t.type==="select"?e.jsx("select",{value:c[t.name],onChange:x=>E(t.name,x.target.value),style:{width:"100%",padding:"10px",borderRadius:"8px",border:"1px solid #ccc",fontSize:"1rem"},children:t.options&&t.options.map(x=>e.jsx("option",{value:x.value,children:x.label},x.value))}):e.jsx(O,{type:t.type||"text",placeholder:t.placeholder||"",value:c[t.name],onChange:x=>E(t.name,x.target.value),autoFocus:t.name===i[0].name})]},t.name)):e.jsx(O,{type:n,value:T,onChange:t=>F(t.target.value),autoFocus:!0})}),e.jsxs("div",{style:{display:"flex",justifyContent:"flex-end",gap:"1rem",marginTop:"2rem"},children:[e.jsx(R,{onClick:f,style:{backgroundColor:"#6c757d"},children:"Cancelar"}),e.jsx(R,{onClick:m,primary:!0,children:"Aceptar"})]})]})})},ce=se.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 6px;
  
  label { font-weight: bold; color: #495057; }
  input { width: 120px; text-align: right; }
`,Lt=({isOpen:o,onClose:f,currentStats:a,onConfirm:b})=>{const[S,p]=l.useState("manual"),[i,n]=l.useState({efectivo:"",credito:"",tarjeta:"",dolares:"",ventas_totales:""}),[u,c]=l.useState({cordobas:"",dolares:"",ventas_totales:""}),I=(m,E)=>{n(t=>({...t,[m]:E}))},T=(m,E)=>{c(t=>({...t,[m]:E}))},F=()=>{const m=[];if(S==="manual")parseFloat(i.efectivo)&&m.push({target:"efectivo",amount:parseFloat(i.efectivo)}),parseFloat(i.credito)&&m.push({target:"credito",amount:parseFloat(i.credito)}),parseFloat(i.tarjeta)&&m.push({target:"tarjeta",amount:parseFloat(i.tarjeta)}),parseFloat(i.ventas_totales)&&m.push({target:"ventas_totales",amount:parseFloat(i.ventas_totales)});else{const E=parseFloat(u.cordobas),t=parseFloat(u.dolares),x=parseFloat(u.ventas_totales);if(!isNaN(E)){const j=Number((a==null?void 0:a.netCordobas)||0),v=E-j;Math.abs(v)>.01&&m.push({target:"efectivo",amount:v})}if(!isNaN(t)){const j=Number((a==null?void 0:a.netDolares)||0),v=t-j;Math.abs(v)>.01&&m.push({target:"dolares",amount:v})}if(!isNaN(x)){const j=Number((a==null?void 0:a.totalVentasDia)||0),v=x-j;Math.abs(v)>.01&&m.push({target:"ventas_totales",amount:v})}}m.length>0&&b(m),f()};return o?e.jsx(be,{style:{background:"rgba(0,0,0,0.95)",zIndex:9999},children:e.jsxs(je,{style:{maxWidth:"450px",background:"#212529",color:"#fff",border:"1px solid #495057",maxHeight:"90vh",overflowY:"auto"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20},children:[e.jsxs("h2",{style:{margin:0,color:"#ffc107",display:"flex",alignItems:"center",gap:10},children:[e.jsx(ct,{})," GOD MODE"]}),e.jsx(R,{$cancel:!0,onClick:f,style:{background:"transparent",color:"#6c757d",border:"none"},children:"✕"})]}),e.jsxs("div",{style:{display:"flex",gap:10,marginBottom:20},children:[e.jsx(R,{onClick:()=>p("manual"),style:{flex:1,background:S==="manual"?"#ffc107":"#343a40",color:S==="manual"?"#000":"#fff",border:"none"},children:"Ajuste Manual (+/-)"}),e.jsx(R,{onClick:()=>p("override"),style:{flex:1,background:S==="override"?"#ffc107":"#343a40",color:S==="override"?"#000":"#fff",border:"none"},children:"Fijar Monto (=)"})]}),S==="manual"?e.jsxs(e.Fragment,{children:[e.jsx("p",{style:{color:"#adb5bd",fontSize:"0.85rem",marginBottom:15},children:"Suma o resta cantidades a los contadores ocultamente."}),e.jsxs(ce,{style:{background:"#343a40"},children:[e.jsx("label",{style:{color:"#fff"},children:"Efectivo (C$)"}),e.jsx(O,{type:"number",step:"0.01",placeholder:"+/- 0.00",value:i.efectivo,onChange:m=>I("efectivo",m.target.value),style:{background:"#495057",color:"#fff"}})]}),e.jsxs(ce,{style:{background:"#343a40"},children:[e.jsx("label",{style:{color:"#fff"},children:"Crédito"}),e.jsx(O,{type:"number",step:"0.01",placeholder:"+/- 0.00",value:i.credito,onChange:m=>I("credito",m.target.value),style:{background:"#495057",color:"#fff"}})]}),e.jsxs(ce,{style:{background:"#343a40"},children:[e.jsx("label",{style:{color:"#fff"},children:"Tarjeta"}),e.jsx(O,{type:"number",step:"0.01",placeholder:"+/- 0.00",value:i.tarjeta,onChange:m=>I("tarjeta",m.target.value),style:{background:"#495057",color:"#fff"}})]}),e.jsxs(ce,{style:{background:"#2a1a00",border:"1px solid #ffc107"},children:[e.jsx("label",{style:{color:"#ffc107"},children:"Ventas Totales"}),e.jsx(O,{type:"number",step:"0.01",placeholder:"+/- 0.00",value:i.ventas_totales,onChange:m=>I("ventas_totales",m.target.value),style:{background:"#495057",color:"#ffc107",border:"1px solid #ffc107"}})]})]}):e.jsxs(e.Fragment,{children:[e.jsx("p",{style:{color:"#adb5bd",fontSize:"0.85rem",marginBottom:15},children:"Define EXACTAMENTE cuánto dinero físico hay. El sistema creará un ajuste mágico para cuadrar."}),e.jsxs("div",{style:{background:"#343a40",padding:10,borderRadius:6,marginBottom:10},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",color:"#aaa",marginBottom:5},children:[e.jsx("span",{children:"Sistema Actual:"}),e.jsxs("span",{children:["C$ ",Number((a==null?void 0:a.netCordobas)||0).toFixed(2)]})]}),e.jsxs(ce,{style:{background:"transparent",padding:0,marginBottom:0},children:[e.jsx("label",{style:{color:"#fff"},children:"Real en Caja (C$)"}),e.jsx(O,{type:"number",step:"0.01",placeholder:"0.00",value:u.cordobas,onChange:m=>T("cordobas",m.target.value),style:{background:"#495057",color:"#fff",border:"1px solid #ffc107"}})]})]}),e.jsxs("div",{style:{background:"#343a40",padding:10,borderRadius:6},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",color:"#aaa",marginBottom:5},children:[e.jsx("span",{children:"Sistema Actual:"}),e.jsxs("span",{children:["$ ",Number((a==null?void 0:a.netDolares)||0).toFixed(2)]})]}),e.jsxs(ce,{style:{background:"transparent",padding:0,marginBottom:0},children:[e.jsx("label",{style:{color:"#fff"},children:"Real en Caja ($)"}),e.jsx(O,{type:"number",step:"0.01",placeholder:"0.00",value:u.dolares,onChange:m=>T("dolares",m.target.value),style:{background:"#495057",color:"#fff",border:"1px solid #ffc107"}})]})]}),e.jsxs("div",{style:{background:"#2a1a00",padding:10,borderRadius:6,border:"1px solid #ffc107",marginTop:10},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",color:"#ffc107",marginBottom:5},children:[e.jsx("span",{children:"Sistema Actual:"}),e.jsxs("span",{children:["C$ ",Number((a==null?void 0:a.totalVentasDia)||0).toFixed(2)]})]}),e.jsxs(ce,{style:{background:"transparent",padding:0,marginBottom:0},children:[e.jsx("label",{style:{color:"#ffc107"},children:"Ventas Totales (C$)"}),e.jsx(O,{type:"number",step:"0.01",placeholder:"0.00",value:u.ventas_totales,onChange:m=>T("ventas_totales",m.target.value),style:{background:"#495057",color:"#ffc107",border:"1px solid #ffc107"}})]})]})]}),e.jsxs("div",{style:{marginTop:25,display:"flex",gap:10},children:[e.jsx(R,{onClick:f,style:{flex:1,background:"#495057",border:"none"},children:"Cancelar"}),e.jsxs(R,{onClick:F,style:{flex:1,background:"#ffc107",color:"#000",fontWeight:"bold",border:"none"},children:[e.jsx(pt,{style:{marginRight:6}})," ",S==="manual"?"APLICAR AJUSTE":"CUADRAR MÁGICAMENTE"]})]})]})}):null};export{Bt as C,At as P,Lt as S,Ot as a,Wt as b,jt as c,$t as d};

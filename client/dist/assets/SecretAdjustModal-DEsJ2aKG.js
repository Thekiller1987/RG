import{r as l,j as e,a0 as We,a1 as Pe,aS as Fe,H as Ve,A as qe,s as ne,a6 as Ge,a7 as Ue,m as He,k as Je,b as Ye,R as ze,aO as Xe,b6 as $e,af as Le,b8 as Ke,J as Ie,x as Te,b9 as Qe,ba as Ze,aZ as et,ag as tt,bb as at,a3 as ot,bc as Me,bd as rt,be as nt,aa as it,aU as st,C as De,q as lt,bf as dt,bg as ct,bh as pt}from"./vendor-Cig3sC1l.js";import{u as ke,g as ue,s as ge,f as _e,a as mt}from"./index-DGmyou13.js";import{r as xt}from"./searchEngine-BMYcElFi.js";import{d as ft,S as L,j as gt,k as ht,l as bt,M as he,a as je,B as A,f as Y,I as Ae}from"./POS.styles-aMw4GNpO.js";import"./AlertModal-D7T3J0b6.js";const w=t=>{const g=Number(t);return isNaN(g)||!isFinite(g)?0:g};function ut(t){if(!Array.isArray(t)||t.length===0)return[];const g=new Set,a=[];for(const h of t)h.id&&g.has(h.id)||(h.id&&g.add(h.id),a.push(h));return a}const jt=(t,g=0,a=36.6)=>{const h=Math.max(0,w(g)),N=w(a)||36.6,m={ventasContado:[],devoluciones:[],cancelaciones:[],entradas:[],salidas:[],abonos:[],ajustes:[]};let r=0,n=0,y=0,d=0,z=0,S=0,O=0,f=0;const F=ut(Array.isArray(t)?t:[]);let x=0,u=0,D=0,o=0,v=0,T=0,i=0,_=0,W=0;for(const E of F){let p=((E==null?void 0:E.type)||"").toLowerCase().trim();p=p.normalize("NFD").replace(/[\u0300-\u036f]/g,"");let j=(E==null?void 0:E.pagoDetalles)||{};if(typeof j=="string")try{j=JSON.parse(j)}catch{j={}}(!j||typeof j!="object")&&(j={});const M=w(E.amount),oe=w(j.totalVenta)||M,B=w(j.efectivo),G=w(j.dolares),ee=w(j.cambio),Q=w(j.ingresoCaja),P=w(j.tarjeta),C=w(j.transferencia),K=w(j.credito);let V=oe||M;(p==="salida"||p.includes("devolucion")||p.includes("cancelacion")||p.includes("anulacion"))&&(V=-Math.abs(V));const $={...E,pagoDetalles:j,displayAmount:V};if(p.startsWith("venta")||p.includes("abono")||p.includes("pedido")||p.includes("apartado")?(y+=P,d+=C,z+=K):p==="ajuste"&&(j.target==="tarjeta"&&(y+=M),j.target==="credito"&&(z+=M),j.target==="transferencia"&&(d+=M)),p.startsWith("venta")){if(B>.001||G>.001||ee>.001)r+=B-ee,n+=G,x+=B-ee,u+=G;else if(Q>.001)r+=Q,x+=Q;else{const U=P+C+K,I=oe-U;I>.001&&(r+=I,x+=I)}D+=P,o+=C,v+=K}else if(p.includes("abono")||p.includes("liquidación")||p.includes("liquidacion")||p.includes("pedido")){if(G>.001)n+=G,r+=B,i+=G,T+=B;else if(B>.001)r+=B,T+=B;else if(Q>.001)r+=Q,T+=Q;else{const U=P+C,I=Math.max(0,M-U);r+=I,T+=I}_+=P,W+=C}else if(p==="entrada")r+=Math.abs(M);else if(p==="salida")r-=Math.abs(M);else if(p.includes("devolucion")||p.includes("cancelacion")||p.includes("anulacion"))if(j.ingresoCaja!==void 0&&j.ingresoCaja!==null)r+=w(j.ingresoCaja);else if(B>.001)r-=B;else{const U=P+C+K,I=Math.abs(M)-U;I>.001&&(r-=I)}else if(p==="ajuste")j.target==="efectivo"?(r+=M,j.hidden&&(f+=M)):j.target==="dolares"&&(n+=M);else{const U=P+C+K,I=M-U;Math.abs(I)>.001&&(r+=I)}p.startsWith("venta")||p.includes("abono")||p.includes("liquid")||p.includes("pedido")?O+=Math.abs(V):p.includes("devolucion")||p.includes("cancelacion")||p.includes("anulacion")?O-=Math.abs(V):(p==="ajuste"&&j.target==="ventas_totales"||p==="ajuste"&&j.target==="efectivo"&&M<0)&&(O+=M),p.startsWith("venta")?m.ventasContado.push($):p.includes("devolucion")?(m.devoluciones.push($),S+=Math.abs(V)):p.includes("cancelacion")||p.includes("anulacion")?(m.cancelaciones.push($),S+=Math.abs(V)):p==="entrada"?m.entradas.push($):p==="salida"?m.salidas.push($):p.includes("abono")?m.abonos.push($):p==="ajuste"&&m.ajustes.push($)}r=w(r),n=w(n),y=w(y),d=w(d),z=w(z),O=w(O),f=w(f),S=w(S);const X=h+r,k=X+n*N;return{cajaInicial:h,netCordobas:r,netDolares:n,efectivoEsperado:w(k),efectivoEsperadoCordobas:w(X),efectivoEsperadoDolares:n,totalVentasDia:w(O),totalTarjeta:y,totalTransferencia:d,totalCredito:z,totalNoEfectivo:w(y+d+z),sumDevolucionesCancelaciones:S,totalHidden:f,tasaRef:N,lists:m,vEfectivoC:w(x),vEfectivoD:w(u),vTarjeta:w(D),vTransf:w(o),vCredito:w(v),aEfectivoC:w(T),aEfectivoD:w(i),aTarjeta:w(_),aTransf:w(W)}},ve=t=>Number(t||0).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});async function Be(t,g=4){const a=localStorage.getItem("token"),h=t.filter(r=>{const n=ue(r);return!n||n!=="loading"&&n!=="none"});let N=0;async function m(){if(N>=h.length)return;const r=h[N++];if(ue(r))return m();ge(r,"loading");try{const n=await _e(r,a),y=(n==null?void 0:n.imagen)||null;ge(r,y||"none"),window.dispatchEvent(new CustomEvent(`pos_img_loaded_${r}`,{detail:y||"none"}))}catch{ge(r,"none"),window.dispatchEvent(new CustomEvent(`pos_img_loaded_${r}`,{detail:"none"}))}return m()}await Promise.all(Array.from({length:g},m))}function yt(t){const[g,a]=l.useState(()=>{const m=ue(t);return m&&m!=="loading"&&m!=="none"?m:null}),h=l.useRef(null),N=l.useCallback(async()=>{if(!t)return;const m=ue(t);if(!(m==="loading"||m==="none")){if(m&&m!=="loading"){a(m);return}ge(t,"loading");try{const r=localStorage.getItem("token"),n=await _e(t,r),y=(n==null?void 0:n.imagen)||null;ge(t,y||"none"),a(y||null),window.dispatchEvent(new CustomEvent(`pos_img_loaded_${t}`,{detail:y||"none"}))}catch{ge(t,"none"),a(null),window.dispatchEvent(new CustomEvent(`pos_img_loaded_${t}`,{detail:"none"}))}}},[t]);return l.useEffect(()=>{const m=ue(t);if(m&&m!=="loading"){a(m!=="none"?m:null);return}const r=y=>{const d=y.detail;a(d&&d!=="none"?d:null)};window.addEventListener(`pos_img_loaded_${t}`,r);const n=new IntersectionObserver(y=>{y[0].isIntersecting&&N()},{rootMargin:"250px"});return h.current&&n.observe(h.current),()=>{n.disconnect(),window.removeEventListener(`pos_img_loaded_${t}`,r)}},[t,N]),{imgSrc:g,cardRef:h}}function vt({productId:t,productName:g,onView:a}){const{imgSrc:h,cardRef:N}=yt(t),[m,r]=l.useState(!1);return l.useEffect(()=>{r(!1)},[h]),e.jsxs("div",{ref:N,className:"image-placeholder",style:{position:"relative",height:150,background:"#f8fafc",display:"flex",alignItems:"center",justifyContent:"center",borderBottom:"1px solid #f1f5f9",overflow:"hidden"},children:[h&&e.jsx("div",{className:"eye-icon",onClick:n=>{n.stopPropagation(),a(h)},style:{position:"absolute",top:10,left:10,zIndex:20,background:"white",borderRadius:"50%",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 6px rgba(0,0,0,0.1)",cursor:"pointer",transition:"transform 0.2s"},title:"Ver imagen ampliada",children:e.jsx(Ge,{size:14,color:"#64748b"})}),h?e.jsx("img",{src:h,alt:g,loading:"lazy",onLoad:()=>r(!0),style:{width:"100%",height:"100%",objectFit:"contain",padding:"6px",opacity:m?1:0,transition:"opacity 0.2s ease-in-out"}}):e.jsx(Ue,{className:"no-image-icon",size:38,color:"#cbd5e1",style:{opacity:.5}})]})}const Ct=ne.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 12px;
  width: 100%;
`,wt=ne.div`
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  height: 240px;
  position: relative;
  overflow: hidden;

  &::after {
    position: absolute;
    top: 0; right: 0; bottom: 0; left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(
      90deg,
      rgba(241, 245, 249, 0) 0,
      rgba(241, 245, 249, 0.8) 50%,
      rgba(241, 245, 249, 0) 100%
    );
    animation: shimmerAnim 1.4s infinite;
    content: '';
  }

  @keyframes shimmerAnim {
    100% {
      transform: translateX(100%);
    }
  }
`,Oe=ne.button`
  display: flex; align-items: center; justify-content: center;
  width: 42px; height: 42px;
  border: 1px solid ${t=>t.$active?"#3b82f6":"#cbd5e1"};
  background-color: ${t=>t.$active?"#eff6ff":"#fff"};
  color: ${t=>t.$active?"#3b82f6":"#64748b"};
  border-radius: 8px; cursor: pointer; transition: all 0.2s;

  &:hover { border-color: #3b82f6; color: #3b82f6; }
`,St=({isOpen:t,imageSrc:g,onClose:a})=>!t||!g?null:e.jsx(he,{onClick:a,children:e.jsxs(He.div,{initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},onClick:h=>h.stopPropagation(),style:{position:"relative",maxWidth:"95%",maxHeight:"90vh"},children:[e.jsx("button",{onClick:a,style:{position:"absolute",top:-15,right:-15,background:"white",width:32,height:32,borderRadius:"50%",border:"none",cursor:"pointer",boxShadow:"0 4px 6px rgba(0,0,0,0.1)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10,color:"#ef4444"},children:e.jsx(Je,{})}),e.jsx("img",{src:g,alt:"Vista Ampliada",style:{maxWidth:"100%",maxHeight:"85vh",borderRadius:"12px",boxShadow:"0 20px 25px rgba(0,0,0,0.2)",background:"white",objectFit:"contain"}})]})});function Ot({products:t=[],searchTerm:g,setSearchTerm:a,onProductClick:h,cartItems:N=[],reservedStock:m,inputRef:r,searchType:n="description",setSearchType:y=()=>{},isWholesale:d=!1}){const{globalReservations:z,user:S}=ke(),O=(S==null?void 0:S.id_usuario)||(S==null?void 0:S.id),[f,F]=l.useState({isOpen:!1,imageUrl:null}),x=l.useMemo(()=>{const o=new Map;for(const v of N){const T=v.id_producto||v.id;o.set(T,(o.get(T)||0)+Number(v.quantity||0))}return o},[N]),u=l.useMemo(()=>xt(t,g,["nombre","codigo","descripcion"],{strict:n==="code"}).slice(0,100),[t,g,n]);l.useEffect(()=>{const o=u.map(v=>v.id_producto||v.id);Be(o,6)},[u]),l.useEffect(()=>{if(!t.length)return;const o=setTimeout(()=>{const v=t.map(T=>T.id_producto||T.id);Be(v,2)},1500);return()=>clearTimeout(o)},[t]);const D=l.useMemo(()=>{const o=(g||"").toLowerCase().trim();return o?t.filter(v=>{const T=(v.nombre||"").toLowerCase(),i=String(v.codigo||"").toLowerCase();return T.includes(o)||i.includes(o)}).length:t.length},[t,g]);return e.jsxs(ft,{children:[e.jsxs("div",{style:{display:"flex",gap:"8px",marginBottom:"1rem",alignItems:"center"},children:[e.jsx(L,{ref:r,placeholder:n==="code"?"Escribe código...":"Buscar producto por nombre o código...",value:g,onChange:o=>a(o.target.value),onKeyDown:o=>{if(o.key==="Enter"){const v=(g||"").trim().toLowerCase();if(!v)return;const T=t.find(i=>String(i.codigo||"").toLowerCase()===v||String(i.codigo_barras||"").toLowerCase()===v);if(T){h(T),a("");return}u.length===1&&(h(u[0]),a(""))}}}),e.jsx(Oe,{$active:n==="description",onClick:()=>{var o;y("description"),(o=r.current)==null||o.focus()},title:"Buscar por Nombre",children:e.jsx(We,{size:16})}),e.jsx(Oe,{$active:n==="code",onClick:()=>{var o;y("code"),(o=r.current)==null||o.focus()},title:"Buscar por Código",children:e.jsx(Pe,{size:18})})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"8px",padding:"0 4px",fontSize:"0.85rem",color:"#64748b"},children:[e.jsxs("span",{children:[e.jsx(Fe,{color:"#3b82f6"})," ",u.length," mostrados"]}),e.jsxs("span",{children:["Total: ",D," productos"]})]}),t.length===0?e.jsx(Ct,{children:Array.from({length:12}).map((o,v)=>e.jsx(wt,{},v))}):u.length===0?e.jsxs("div",{style:{textAlign:"center",padding:"3.5rem",color:"#94a3b8",background:"white",borderRadius:"16px",border:"1px dashed #cbd5e1"},children:[e.jsx(Fe,{style:{fontSize:"2.5rem",marginBottom:"0.75rem",opacity:.3}}),e.jsx("h4",{style:{color:"#64748b",margin:"0 0 0.25rem 0"},children:"No se encontraron productos"}),e.jsx("p",{style:{margin:0,fontSize:"0.9rem"},children:"Prueba con otro término de búsqueda o código."})]}):e.jsx(gt,{children:u.map(o=>{var j,M,oe;const v=o.id_producto||o.id,T=x.get(v)||0,i=(m==null?void 0:m.get(v))||0,_=Number(((j=z==null?void 0:z.totalByProduct)==null?void 0:j[v])||0),W=Number(((oe=(M=z==null?void 0:z.userReservations)==null?void 0:M[O])==null?void 0:oe[v])||0),X=Math.max(0,_-W),k=T+i+X,E=Math.max(0,Number(o.existencia||0)-k),p=E<=0;return e.jsxs(ht,{onClick:()=>!p&&h(o),outOfStock:p,title:o.nombre,style:{cursor:p?"not-allowed":"pointer",opacity:p?.6:1,transition:"transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease"},children:[e.jsx(bt,{lowstock:E<5&&!p,outOfStock:p,style:{background:p?"#ef4444":E<5?"#f59e0b":"#10b981"},children:p?T>0?"En Carrito":X>0?"En Otra Caja":"Agotado":`Stock: ${E}`}),e.jsx(vt,{productId:v,productName:o.nombre,onView:B=>F({isOpen:!0,imageUrl:B})}),e.jsxs("div",{className:"info",style:{padding:"12px",flex:1,display:"flex",flexDirection:"column",gap:"4px"},children:[e.jsx("div",{className:"product-name",style:{fontWeight:600,fontSize:"0.88rem",color:"#1e293b",lineHeight:"1.25",height:"3.8rem",overflow:"hidden",display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical"},children:o.nombre}),e.jsx("div",{style:{fontSize:"0.85rem",fontWeight:"bold",color:"#334155",marginBottom:"4px"},children:o.codigo||"S/C"}),d?e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:{fontSize:"0.75rem",color:"#64748b",display:"flex",alignItems:"center",gap:"4px",marginTop:"auto",marginBottom:"1px",textDecoration:"line-through"},children:["Tienda: C$ ",ve(o.precio_venta||o.precio)]}),e.jsxs("div",{className:"price",style:{fontWeight:800,color:"#8b5cf6",fontSize:"1.1rem"},children:["C$ ",ve(o.mayorista||o.mayoreo||o.distribuidor||o.taller||o.precio_venta)]})]}):e.jsxs(e.Fragment,{children:[(Number(o.mayorista)>0||Number(o.mayoreo)>0||Number(o.distribuidor)>0||Number(o.taller)>0)&&e.jsxs("div",{style:{fontSize:"0.75rem",color:"#10b981",display:"flex",alignItems:"center",gap:"4px",marginTop:"auto",marginBottom:"1px"},children:[e.jsx(Ve,{size:10})," May: C$ ",ve(o.mayorista||o.mayoreo||o.distribuidor||o.taller)]}),e.jsxs("div",{className:"price",style:{fontWeight:800,color:"#2563eb",fontSize:"1.05rem",marginTop:Number(o.mayorista)>0||Number(o.mayoreo)>0||Number(o.distribuidor)>0||Number(o.taller)>0?0:"auto"},children:["C$ ",ve(o.precio_venta||o.precio)]})]})]})]},v)})}),e.jsx(qe,{children:f.isOpen&&e.jsx(St,{isOpen:!0,imageSrc:f.imageUrl,onClose:()=>F({isOpen:!1,imageUrl:null})})})]})}const Nt=ze.memo(()=>e.jsx("style",{children:`
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
  `})),Tt=ne.div`
  font-family: 'League Spartan', 'Consolas', sans-serif; color: #000; background: #fff;
  width: 310px; margin: 0 auto; padding: 12px 6px;
  box-shadow: 0 0 10px rgba(0,0,0,.08); border: 1px solid #eee; border-radius: 8px;

  /* Encabezado */
  .brand { text-align: center; border-bottom: 3px solid #000; padding-bottom: 12px; margin-bottom: 15px; }
  .brand img { max-width: 80px; height: auto; display: block; margin: 0 auto 8px; object-fit: contain; }
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
`,$t=({currentUser:t,isCajaOpen:g,session:a,onOpenCaja:h,onCloseCaja:N,onClose:m,isAdmin:r,showConfirmation:n,showAlert:y,initialTasaDolar:d,clients:z=[]})=>{var ye,c;const[S,O]=l.useState(""),[f,F]=l.useState(d||36.6),[x,u]=l.useState(""),[D,o]=l.useState(!1),v=Ye(),T=(t==null?void 0:t.id_usuario)||(t==null?void 0:t.id);let i=(ye=a==null?void 0:a.openedBy)==null?void 0:ye.name;!i&&(a!=null&&a.openedBy)&&typeof a.openedBy=="string"&&(i=a.openedBy),i||(i=(a==null?void 0:a.userId)===T?(t==null?void 0:t.nombre_usuario)||(t==null?void 0:t.username):"Usuario"),i||(i="Caja General");const _=r||(a==null?void 0:a.userId)===T||((c=a==null?void 0:a.openedBy)==null?void 0:c.id)===T,W=l.useMemo(()=>Array.isArray(a==null?void 0:a.transactions)?a.transactions:[],[a]),X=l.useMemo(()=>{const s=jt(W,(a==null?void 0:a.initialAmount)||0,(a==null?void 0:a.tasaDolar)||d);return a!=null&&a.stats&&a.stats.vEfectivoC!==void 0?{...a.stats,lists:a.stats.lists||s.lists}:s},[W,a,d]),{cajaInicial:k,netCordobas:E,netDolares:p,efectivoEsperado:j,efectivoEsperadoCordobas:M,efectivoEsperadoDolares:oe,totalTarjeta:B,totalTransferencia:G,totalCredito:ee,totalNoEfectivo:Q,sumDevolucionesCancelaciones:P,totalHidden:C,tasaRef:K,vEfectivoC:V,vEfectivoD:pe,vTarjeta:$,vTransf:U,vCredito:I,aEfectivoC:me,aEfectivoD:ie,aTarjeta:le,aTransf:te,lists:{ventasContado:xe,devoluciones:re,cancelaciones:Ee,entradas:Z,salidas:H,abonos:se}}=X,de=(V||0)+(pe||0)*K+($||0)+(U||0)+(I||0)+(me||0)+(ie||0)*K+(le||0)+(te||0)-(P||0),q=Number(x||0)-j;a!=null&&a.openedAt&&new Date(a.openedAt);const Ce=()=>{const s=parseFloat(S||0);if(isNaN(s)||s<0)return y({title:"Inválido",message:"Monto inicial >= 0"});h(s,Number(f||36.6))},we=()=>{if(isNaN(parseFloat(x)))return y({title:"Requerido",message:"Ingrese el monto contado físico."});o(!0)},Se=ze.useCallback(()=>{const s=document.getElementById("print-wrapper-caja");if(!s)return;const R=s.outerHTML,J=`
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
        
        .brand img {
          max-width: 60mm !important;
          max-height: 25mm !important;
          width: auto !important;
          height: auto !important;
          display: block !important;
          margin: 0 auto 6px auto !important;
          object-fit: contain !important;
          filter: grayscale(100%) contrast(150%) !important;
        }
        @media print {
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `,ae=window.open("","_blank","width=500,height=600");ae&&(ae.document.write(`<html><head><title>Cierre Caja</title><style>${J}</style></head><body>${R}</body></html>`),ae.document.close(),ae.focus(),ae.onload=function(){setTimeout(()=>{ae.print()},300)},ae.onafterprint=()=>{try{ae.close()}catch{}})},[]),Ne=()=>{Se(),setTimeout(()=>{N(Number(x))},800)},b=s=>`C$${Number(s||0).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`,fe=s=>`$${Number(s||0).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`;return e.jsxs(he,{className:"no-print",children:[e.jsx(Nt,{}),e.jsxs(je,{style:{maxWidth:D?450:760,padding:D?0:"1.5rem",background:"#f8f9fa"},children:[!D&&e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12},children:[e.jsx("h2",{style:{margin:0},children:"Gestión de Caja"}),e.jsx(A,{$cancel:!0,onClick:m,style:{borderRadius:"50%",width:32,height:32,padding:0},children:"✕"})]}),g?D?e.jsxs("div",{style:{display:"flex",flexDirection:"column",height:"100%",maxHeight:"90vh"},children:[e.jsxs("div",{style:{padding:"15px 20px",background:"#343a40",color:"#fff",display:"flex",justifyContent:"space-between",alignItems:"center",borderRadius:"8px 8px 0 0"},children:[e.jsxs("div",{children:[e.jsx("h3",{style:{margin:0,fontSize:"1.2rem",fontWeight:"800",letterSpacing:"0.5px"},children:"REPORTAR CIERRE DE CAJA"}),e.jsx("p",{style:{margin:0,fontSize:"0.9rem",opacity:.8},children:new Date().toLocaleString("es-NI")})]}),e.jsxs(A,{$cancel:!0,onClick:()=>o(!1),style:{padding:"8px 15px",fontSize:"0.9rem",background:"rgba(255,255,255,0.2)",border:"none"},children:[e.jsx($e,{})," Volver / Editar"]})]}),e.jsxs("div",{style:{flex:1,overflowY:"auto",background:"#f8f9fa",padding:"20px"},children:[e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:15,marginBottom:20},children:[e.jsxs("div",{style:{background:"#fff",padding:15,borderRadius:8,boxShadow:"0 2px 5px rgba(0,0,0,0.05)",borderLeft:"4px solid #007bff"},children:[e.jsx("div",{style:{fontSize:"0.8rem",color:"#666",textTransform:"uppercase"},children:"Ingresos Totales Netos"}),e.jsx("div",{style:{fontSize:"1.5rem",fontWeight:"800",color:"#333"},children:b(de)})]}),e.jsxs("div",{style:{background:"#fff",padding:15,borderRadius:8,boxShadow:"0 2px 5px rgba(0,0,0,0.05)",borderLeft:"4px solid #28a745"},children:[e.jsx("div",{style:{fontSize:"0.8rem",color:"#666",textTransform:"uppercase"},children:"Efectivo Real"}),e.jsx("div",{style:{fontSize:"1.5rem",fontWeight:"800",color:"#28a745"},children:b(x)})]}),e.jsxs("div",{style:{background:"#fff",padding:15,borderRadius:8,boxShadow:"0 2px 5px rgba(0,0,0,0.05)",borderLeft:`4px solid ${q<0?"#dc3545":"#ffc107"}`},children:[e.jsx("div",{style:{fontSize:"0.8rem",color:"#666",textTransform:"uppercase"},children:"Diferencia"}),e.jsxs("div",{style:{fontSize:"1.5rem",fontWeight:"800",color:q!==0?q<0?"#dc3545":"#e0a800":"#28a745"},children:[q>0?"+":"",b(q)]})]})]}),e.jsxs("div",{style:{background:"#fff",padding:20,borderRadius:8,boxShadow:"0 2px 10px rgba(0,0,0,0.05)",marginBottom:20},children:[e.jsx("h4",{style:{margin:"0 0 15px",borderBottom:"1px solid #eee",paddingBottom:10},children:"Arqueo Detallado"}),e.jsx("table",{style:{width:"100%",borderCollapse:"collapse"},children:e.jsxs("tbody",{children:[e.jsxs("tr",{style:{borderBottom:"1px solid #f1f1f1"},children:[e.jsx("td",{style:{padding:10},children:"Fondo Inicial"}),e.jsx("td",{className:"text-right",style:{padding:10,fontWeight:"bold"},children:b(k)})]}),e.jsx("tr",{style:{background:"#f8f9fa"},children:e.jsx("td",{colSpan:"2",style:{padding:"8px 10px",fontSize:"0.85rem",fontWeight:"bold",color:"#007bff"},children:"RESUMEN DE INGRESOS"})}),e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"4px 10px 4px 20px",fontSize:"0.9rem"},children:"(+) Ventas Netas (Ventas + Abonos - Devoluciones)"}),e.jsx("td",{className:"text-right",style:{padding:"4px 10px",fontSize:"0.9rem"},children:b(de)})]}),P>0&&e.jsxs("tr",{children:[e.jsxs("td",{style:{padding:"4px 10px 4px 20px",fontSize:"0.85rem",color:"#856404"},children:["    (Devoluciones/Cancel. ya descontadas: ",b(P),")"]}),e.jsx("td",{})]}),e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"4px 10px 4px 20px",fontSize:"0.9rem",color:"#dc3545"},children:"(-) Tarjetas / Transf / Crédito"}),e.jsxs("td",{className:"text-right",style:{padding:"4px 10px",fontSize:"0.9rem",color:"#dc3545"},children:["- ",b(Q)]})]}),B>0&&e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"2px 10px 2px 35px",fontSize:"0.82rem",color:"#6c757d"},children:"💳 Tarjeta"}),e.jsx("td",{className:"text-right",style:{padding:"2px 10px",fontSize:"0.82rem",color:"#6c757d"},children:b(B)})]}),G>0&&e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"2px 10px 2px 35px",fontSize:"0.82rem",color:"#6c757d"},children:"🏦 Transferencia"}),e.jsx("td",{className:"text-right",style:{padding:"2px 10px",fontSize:"0.82rem",color:"#6c757d"},children:b(G)})]}),ee>0&&e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"2px 10px 2px 35px",fontSize:"0.82rem",color:"#6c757d"},children:"📋 Crédito"}),e.jsx("td",{className:"text-right",style:{padding:"2px 10px",fontSize:"0.82rem",color:"#6c757d"},children:b(ee)})]}),Z.length>0&&e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"4px 10px 4px 20px",fontSize:"0.9rem",color:"#28a745"},children:"(+) Entradas de Efectivo"}),e.jsxs("td",{className:"text-right",style:{padding:"4px 10px",fontSize:"0.9rem",color:"#28a745"},children:["+ ",b(Z.reduce((s,R)=>s+Math.abs(R.displayAmount||0),0))]})]}),e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"4px 10px 4px 20px",fontSize:"0.9rem",color:"#dc3545"},children:"(-) Salidas de Efectivo"}),e.jsxs("td",{className:"text-right",style:{padding:"4px 10px",fontSize:"0.9rem",color:"#dc3545"},children:["- ",b(H.reduce((s,R)=>s+Math.abs(R.displayAmount||0),0))]})]}),e.jsxs("tr",{style:{borderBottom:"1px solid #f1f1f1",background:"#e8f5e9"},children:[e.jsx("td",{style:{padding:10,fontWeight:"bold",fontSize:"1.1rem"},children:"Esperado en Caja"}),e.jsx("td",{className:"text-right",style:{padding:10,fontWeight:"bold",fontSize:"1.1rem",color:"#146c43"},children:b(j)})]})]})})]}),(se.length>0||Z.length>0||H.length>0)&&e.jsxs("div",{style:{background:"#fff",padding:20,borderRadius:8,boxShadow:"0 2px 10px rgba(0,0,0,0.05)"},children:[e.jsx("h4",{style:{margin:"0 0 15px",borderBottom:"1px solid #eee",paddingBottom:10},children:"Detalle de Movimientos"}),Z.length>0&&e.jsxs("div",{style:{marginBottom:15},children:[e.jsx("h5",{style:{color:"#28a745",margin:"0 0 5px"},children:"Entradas de Caja"}),Z.map((s,R)=>e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px dashed #eee"},children:[e.jsx("div",{children:s.note||"Entrada Varia"}),e.jsxs("div",{style:{fontWeight:"bold",color:"#28a745"},children:["+ ",b(Math.abs(s.amount))]})]},R))]}),se.length>0&&e.jsxs("div",{style:{marginBottom:15},children:[e.jsx("h5",{style:{color:"#007bff",margin:"0 0 5px"},children:"Abonos Recibidos"}),se.map((s,R)=>e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px dashed #eee"},children:[e.jsxs("div",{children:[e.jsx("strong",{children:s.resolvedClientName||"Cliente General"}),e.jsx("div",{style:{fontSize:"0.8rem",color:"#666"},children:s.note||"Abono de cuenta"})]}),e.jsxs("div",{style:{fontWeight:"bold",color:"#28a745"},children:["+ ",b(s.amount)]})]},R))]}),H.length>0&&e.jsxs("div",{children:[e.jsx("h5",{style:{color:"#dc3545",margin:"0 0 5px"},children:"Salidas de Caja"}),H.map((s,R)=>e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px dashed #eee"},children:[e.jsx("div",{children:s.note||"Salida Varia"}),e.jsx("div",{style:{fontWeight:"bold",color:"#dc3545"},children:b(Math.abs(s.amount))})]},R))]})]})]}),e.jsx("div",{style:{display:"none"},children:e.jsxs(Tt,{id:"print-wrapper-caja",className:"print-80",children:[e.jsxs("div",{className:"brand",children:[e.jsx("img",{src:"/icons/logo.png",alt:"Logo",style:{filter:"grayscale(100%) contrast(150%)"}}),e.jsx("h2",{children:"CIERRE DE CAJA"}),e.jsx("p",{children:"Multirepuestos RG"}),e.jsx("p",{children:new Date().toLocaleString("es-NI")}),e.jsxs("p",{children:["Cajero: ",i]})]}),e.jsxs("div",{className:"section",children:[e.jsx("div",{className:"section-title",children:"1. INGRESOS TOTALES NETOS"}),e.jsxs("div",{className:"row big",children:[e.jsx("span",{children:"TOTAL NETO:"}),e.jsx("span",{children:b(de)})]}),e.jsx("div",{className:"row sub",children:"(Ventas + Abonos - Devoluciones/Cancelaciones)"}),P>0&&e.jsxs("div",{className:"row sub",style:{color:"#856404"},children:["(Devol./Cancel.: -",b(P),")"]})]}),e.jsxs("div",{className:"section",children:[e.jsx("div",{className:"section-title",children:"2. DESGLOSE NO EFECTIVO"}),B>0&&e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"(-) Tarjetas:"}),e.jsx("span",{children:b(B)})]}),G>0&&e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"(-) Transf.:"}),e.jsx("span",{children:b(G)})]}),ee>0&&e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"(-) Créditos:"}),e.jsx("span",{children:b(ee)})]}),e.jsxs("div",{className:"row",style:{borderTop:"1px dashed #000"},children:[e.jsx("span",{children:"TOTAL NO EFECTIVO:"}),e.jsx("span",{children:b(Q)})]})]}),e.jsxs("div",{className:"section",children:[e.jsx("div",{className:"section-title",children:"3. FLUJO EFECTIVO (RESUMEN)"}),e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"Fondo Inicial:"}),e.jsx("span",{children:b(k)})]}),e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"(+) Ingresos Netos:"}),e.jsx("span",{children:b(de)})]}),e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"(-) No Efectivo:"}),e.jsxs("span",{children:["-",b(Q)]})]}),Math.abs(H.reduce((s,R)=>s+Math.abs(R.displayAmount||0),0))>0&&e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"(-) Salidas:"}),e.jsxs("span",{children:["-",b(H.reduce((s,R)=>s+Math.abs(R.displayAmount||0),0))]})]})]}),e.jsxs("div",{className:"section",children:[e.jsx("div",{className:"section-title",children:"4. ARQUEO FINAL"}),e.jsxs("div",{className:"row big",children:[e.jsx("span",{children:"EFECTIVO ESPERADO:"}),e.jsx("span",{children:b(j)})]}),e.jsxs("div",{className:"row sub",children:["(",b(M)," + ",fe(oe),")"]}),e.jsxs("div",{className:"row",style:{marginTop:8,paddingTop:4,borderTop:"1px dashed #ccc"},children:[e.jsx("span",{children:"EFECTIVO REAL:"}),e.jsx("span",{children:b(x)})]}),e.jsxs("div",{className:"row alert",style:{color:"#000",borderColor:"#000"},children:[e.jsx("span",{children:"DIFERENCIA:"}),e.jsxs("span",{children:[q>0?"+":"",b(q)]})]}),e.jsx("div",{style:{textAlign:"center",fontSize:"0.75rem",fontWeight:"bold",marginTop:2},children:Math.abs(q)<.5?"(CAJA CUADRADA)":q>0?"(SOBRANTE)":"(FALTANTE)"})]}),e.jsxs("div",{className:"section",children:[e.jsx("div",{className:"section-title",children:"5. DETALLE DE MOVIMIENTOS"}),e.jsx("table",{style:{marginTop:0},children:e.jsxs("tbody",{children:[se.length>0&&e.jsxs(e.Fragment,{children:[e.jsx("tr",{children:e.jsx("td",{colSpan:"2",style:{fontWeight:"900",background:"#f8f9fa",fontSize:"0.9rem"},children:"--- ABONOS Y CREDITOS ---"})}),se.map((s,R)=>e.jsxs("tr",{children:[e.jsxs("td",{style:{fontSize:"0.9rem"},children:[s.resolvedClientName||s.note||"Abono"," ",e.jsx("br",{}),e.jsxs("span",{style:{fontSize:"0.75rem",color:"#555"},children:["#",s.id]})]}),e.jsx("td",{className:"text-right",style:{fontSize:"0.9rem"},children:b(s.amount)})]},"a"+R))]}),H.length>0&&e.jsxs(e.Fragment,{children:[e.jsx("tr",{children:e.jsx("td",{colSpan:"2",style:{fontWeight:"900",background:"#f8f9fa",fontSize:"0.9rem",paddingTop:8},children:"--- SALIDAS DE EFECTIVO ---"})}),H.map((s,R)=>e.jsxs("tr",{children:[e.jsx("td",{style:{fontSize:"0.9rem"},children:s.note||"Salida Varia"}),e.jsx("td",{className:"text-right",style:{fontSize:"0.9rem"},children:b(Math.abs(s.amount))})]},"s"+R))]}),Z.length>0&&e.jsxs(e.Fragment,{children:[e.jsx("tr",{children:e.jsx("td",{colSpan:"2",style:{fontWeight:"900",background:"#f8f9fa",fontSize:"0.9rem",paddingTop:8},children:"--- ENTRADAS DE EFECTIVO ---"})}),Z.map((s,R)=>e.jsxs("tr",{children:[e.jsx("td",{style:{fontSize:"0.9rem"},children:s.note||"Entrada Varia"}),e.jsx("td",{className:"text-right",style:{fontSize:"0.9rem"},children:b(s.amount)})]},"e"+R))]})]})}),se.length===0&&H.length===0&&Z.length===0&&e.jsx("div",{style:{textAlign:"center",fontStyle:"italic",fontSize:"0.8rem",padding:5},children:"Sin movimientos extra"})]}),e.jsxs("div",{className:"signature",children:[e.jsx("div",{className:"signature-line"}),e.jsx("p",{children:"Firma Responsable"})]})]})}),e.jsxs("div",{style:{padding:"20px",background:"#fff",borderTop:"1px solid #ccc",display:"flex",gap:10,justifyContent:"flex-end"},children:[e.jsx(A,{$cancel:!0,onClick:()=>o(!1),children:"Seguir Editando"}),e.jsxs(A,{primary:!0,style:{padding:"12px 24px",fontSize:"1rem",display:"flex",alignItems:"center",gap:8},onClick:Ne,disabled:!_,children:[e.jsx(Le,{})," IMPRIMIR Y CERRAR CAJA"]})]}),!_&&e.jsx("div",{style:{padding:5,textAlign:"center",color:"red",fontSize:"0.8rem"},children:"Solo el Admin o quien abrió puede cerrar."})]}):e.jsxs("div",{children:[e.jsx("h3",{style:{color:"#dc3545",borderBottom:"2px solid #dc3545",paddingBottom:10},children:"Arqueo y Cierre"}),e.jsx("div",{style:{background:"#e9ecef",padding:10,borderRadius:6,marginBottom:15},children:e.jsxs(Y,{style:{fontSize:"1.1rem"},children:[e.jsxs("span",{children:[e.jsx(Ke,{})," Abrió:"]}),e.jsx("strong",{children:i})]})}),e.jsxs("div",{style:{marginTop:8,padding:"15px",backgroundColor:"#f8f9fa",borderRadius:6,border:"1px dashed #ced4da"},children:[e.jsx("div",{style:{fontWeight:"800",marginBottom:10,fontSize:"1.2rem",color:"#495057"},children:"Efectivo a Tener:"}),e.jsxs(Y,{style:{fontSize:"1.3rem"},children:[e.jsx("span",{children:"Córdobas:"}),e.jsxs("strong",{style:{color:"#198754"},children:["C$ ",Number(M).toLocaleString()]})]}),e.jsxs(Y,{style:{fontSize:"1.3rem"},children:[e.jsx("span",{children:"Dólares:"}),e.jsxs("strong",{style:{color:"#198754"},children:["$ ",Number(oe).toLocaleString()]})]}),e.jsxs(Y,{$bold:!0,style:{marginTop:10,borderTop:"2px solid #ccc",paddingTop:10,fontSize:"1.5rem"},children:[e.jsx("span",{children:"TOTAL (C$):"}),e.jsx("span",{children:b(j)})]})]}),Q>0&&e.jsxs("div",{style:{marginTop:12,padding:"12px 15px",backgroundColor:"#fff3cd",borderRadius:6,border:"1px solid #ffc107"},children:[e.jsx("div",{style:{fontWeight:"800",marginBottom:8,fontSize:"1rem",color:"#856404"},children:"Desglose No Efectivo:"}),B>0&&e.jsxs(Y,{style:{fontSize:"1.1rem"},children:[e.jsx("span",{children:"💳 Tarjeta:"}),e.jsx("strong",{children:b(B)})]}),G>0&&e.jsxs(Y,{style:{fontSize:"1.1rem"},children:[e.jsx("span",{children:"🏦 Transferencia:"}),e.jsx("strong",{children:b(G)})]}),ee>0&&e.jsxs(Y,{style:{fontSize:"1.1rem"},children:[e.jsx("span",{children:"📋 Crédito:"}),e.jsx("strong",{children:b(ee)})]}),e.jsxs(Y,{$bold:!0,style:{marginTop:6,borderTop:"1px dashed #856404",paddingTop:6,fontSize:"1.15rem",color:"#856404"},children:[e.jsx("span",{children:"Total No Efectivo:"}),e.jsx("span",{children:b(Q)})]})]}),e.jsx("label",{style:{display:"block",marginTop:20,fontWeight:800,fontSize:"1.3rem"},children:"Monto Contado Físico (C$)"}),e.jsx(L,{type:"number",step:"0.01",value:x,onChange:s=>u(s.target.value),autoFocus:!0,placeholder:"Total Billetes + Monedas",style:{fontSize:"1.5rem",padding:"12px",height:"auto"}}),x&&e.jsxs(Y,{$bold:!0,style:{marginTop:15,color:q!==0?"#dc3545":"#28a745",fontSize:"1.8rem",padding:"10px",background:q!==0?"#fff5f5":"#f0fff4",borderRadius:8,border:`2px solid ${q!==0?"#dc3545":"#28a745"}`},children:[e.jsx("span",{children:"Diferencia:"}),e.jsx("span",{children:b(q)})]}),e.jsxs("div",{style:{display:"flex",gap:10,marginTop:20},children:[e.jsx(A,{primary:!0,style:{flex:1},onClick:we,disabled:!_||!x,children:"Ver Reporte"}),e.jsx(A,{$cancel:!0,onClick:m,children:"Cancelar"})]})]}):e.jsxs("div",{style:{padding:D?"1rem":0},children:[e.jsxs("h3",{style:{color:"#28a745",borderBottom:"2px solid #28a745",paddingBottom:10},children:[e.jsx(Xe,{})," Abrir Caja"]}),e.jsxs("div",{style:{display:"grid",gap:12},children:[e.jsx("label",{style:{fontWeight:600},children:"Monto Inicial (C$)"}),e.jsx(L,{type:"number",step:"0.01",value:S,onChange:s=>O(s.target.value),autoFocus:!0}),e.jsx("label",{style:{fontWeight:600},children:"Tasa del Dólar"}),e.jsx(L,{type:"number",step:"0.01",value:f,onChange:s=>F(s.target.value)})]}),e.jsxs("div",{style:{marginTop:20,display:"flex",gap:10},children:[e.jsx(A,{primary:!0,style:{flex:1},onClick:Ce,children:"Abrir Caja"}),e.jsx(A,{onClick:()=>v("/dashboard"),children:"Ir al Dashboard"})]})]})]})]})},be=t=>{const g=parseFloat(t);return Number.isNaN(g)||Math.abs(g)<.001?0:g},Lt=({total:t=0,tasaDolar:g=1,onClose:a,onFinishSale:h,clientes:N=[],empleados:m=[],users:r=[],showAlert:n,initialClientId:y="0",cartSnapshot:d=[],currentUserId:z=void 0,orderSubtotal:S=void 0,orderDiscountAmount:O=void 0})=>{const[f,F]=l.useState("0.00"),[x,u]=l.useState("0.00"),[D,o]=l.useState("0.00"),[v,T]=l.useState("0.00"),[i,_]=l.useState(""),[W,X]=l.useState(""),[k,E]=l.useState("contado"),[p,j]=l.useState(y??"0"),[M,oe]=l.useState(""),[B,G]=l.useState(!1),[ee,Q]=l.useState(!1),P=l.useMemo(()=>{const c=parseInt(p,10);return Number.isNaN(c)?0:c},[p]),C=P!==0,K=l.useMemo(()=>be(f),[f]),V=l.useMemo(()=>be(x),[x]),pe=l.useMemo(()=>be(D),[D]),$=l.useMemo(()=>be(v),[v]),U=l.useMemo(()=>pe*Number(g||1),[pe,g]),I=l.useMemo(()=>K+V+$+U,[K,V,$,U]),me=l.useMemo(()=>V>.01,[V]),ie=l.useMemo(()=>Number(t)-I,[t,I]),le=l.useMemo(()=>k==="credito"&&C&&ie>.01?ie:(I>=Number(t)-1e-4,0),[k,C,ie,I,t]),te=l.useMemo(()=>{const c=be(ie);return c<=.01||k==="credito"&&C?0:c},[ie,k,C]),xe=l.useMemo(()=>Math.max(0,-ie),[ie]),re=l.useMemo(()=>le>.01?I>.01?"mixto":"credito_total":"contado",[le,I]),Ee=l.useMemo(()=>{if(te>.01)return"PAGO INCOMPLETO";if((re==="mixto"||re==="credito_total")&&!C)return"CLIENTE NO SELECCIONADO";switch(re){case"mixto":return"PAGO MIXTO (Contado + Crédito)";case"credito_total":return"CRÉDITO TOTAL";default:return"CONTADO"}},[re,te,C]),Z=l.useMemo(()=>k==="credito"&&!C,[k,C]),H=l.useMemo(()=>B||te>.01||(re==="mixto"||re==="credito_total")&&!C||me&&!i.trim()||$>.01&&!W.trim(),[B,te,re,C,me,i,$,W]),se=l.useMemo(()=>Array.isArray(d)?d.map(({raw:c,costo:s,existencia:R,...J})=>({id:J.id||J.id_producto,nombre:J.nombre??J.descripcion??J.producto??"",quantity:Number(J.quantity||0),precio:Number(J.precio_venta??J.precio??0)})).filter(c=>c.quantity>0):[],[d]),de=l.useMemo(()=>typeof S=="number"?Number(S):se.reduce((c,s)=>c+Number(s.precio||0)*Number(s.quantity||0),0),[S,se]);l.useMemo(()=>{if(typeof O=="number")return Number(O);const c=Number(de)-Number(t);return c>0?c:0},[O,de,t]),l.useEffect(()=>{k==="contado"&&I===0&&Number(t)>0&&F(Number(t).toFixed(2)),k==="credito"&&!C&&j("0")},[k,t]);const q=l.useCallback(c=>{const s=String(c.target.value);j(s),(parseInt(s,10)||0)!==0&&(E("contado"),I<Number(t)&&I===0&&F(Number(t).toFixed(2)))},[I,t]),Ce=l.useCallback(()=>{E("contado");const c=V+$+U,s=Math.max(0,Number(t)-c);F(Number(s).toFixed(2))},[V,$,U,t]),we=l.useCallback(()=>{if(!C){n==null||n({title:"Cliente Requerido",message:"Debe seleccionar un cliente para habilitar la opción de Crédito.",type:"error"});return}E("credito"),F("0.00"),u("0.00"),o("0.00"),T("0.00"),_(""),X("")},[C,n]),Se=l.useCallback(()=>{F(Number(t).toFixed(2)),u("0.00"),o("0.00"),T("0.00"),_(""),X(""),E("contado")},[t]),Ne=({efectivo:c,tarjeta:s,transferencia:R,dolaresLocal:J,credito:ae})=>{const Re=c+s+R+J>.01;return ae&&Re?"mixto":ae&&!Re?"credito_total":"contado"},b=async c=>{if(!C||P===0){n==null||n({title:"Cliente Requerido",message:"No puedes vender sin seleccionar un cliente. Por favor selecciona uno.",type:"error"});return}if((re==="credito_total"||re==="mixto")&&P===0){n==null||n({title:"Cliente Requerido",message:"Debe seleccionar un cliente para ventas a crédito o mixtas.",type:"error"});return}if(te>.01){n==null||n({title:"Pago Incompleto",message:`Faltan C$${te.toFixed(2)} para completar la venta.`,type:"warning"});return}if(me&&!i.trim()){n==null||n({title:"Dato Requerido",message:"Ingrese el número de referencia para el pago con tarjeta.",type:"warning"});return}if($>.01&&!W.trim()){n==null||n({title:"Dato Requerido",message:"Ingrese el número de referencia para la transferencia.",type:"warning"});return}if(B)return;G(!0);const s=Math.max(0,K+U-xe),R={totalVenta:Number(t),efectivo:K,tarjeta:V,transferencia:$,dolares:pe,tasaDolarAlMomento:Number(g),referenciaTarjeta:i.trim(),referenciaTransferencia:W.trim(),credito:le,clienteId:P,empleadoId:M||null,tipoVenta:Ne({efectivo:K,tarjeta:V,transferencia:$,dolaresLocal:U,credito:le}),cambio:Number(xe),ingresoCaja:Number(s),shouldPrintNow:c};try{typeof h=="function"&&await h(R),a==null||a()}catch(J){n==null||n({title:"Error",message:(J==null?void 0:J.message)||"No se pudo completar la venta.",type:"error"})}finally{G(!1)}},fe=C?te>.01?"#dc3545":xe>.01?"#28a745":"#17a2b8":"#dc3545",ye=C?te>.01?`¡FALTA CUBRIR! C$${te.toFixed(2)}`:xe>.01?`CAMBIO A ENTREGAR: C$${xe.toFixed(2)}`:"BALANCE PERFECTO":"¡SELECCIONA UN CLIENTE!";return e.jsx(he,{children:e.jsxs(je,{style:{maxWidth:"950px",width:"96%",maxHeight:"90vh",overflow:"hidden",borderRadius:16,backgroundColor:"#f8f9fa",boxShadow:"0 25px 50px -12px rgba(0, 0, 0, 0.25)"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"2px solid #e9ecef",paddingBottom:15,marginBottom:20},children:[e.jsxs("h2",{style:{margin:0,color:"#1e293b",fontSize:"1.5rem",fontWeight:800},children:[e.jsx(Ie,{style:{marginRight:"0.5rem",color:"#007bff"}})," PROCESAR PAGO"]}),e.jsx(A,{$cancel:!0,onClick:a,style:{borderRadius:"50%",width:40,height:40,padding:0,fontSize:"1.2rem",backgroundColor:"#fee2e2",color:"#ef4444",borderColor:"transparent"},children:e.jsx(Te,{})})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"5fr 4fr",gap:"2rem",height:"calc(90vh - 140px)"},children:[e.jsxs("div",{style:{paddingRight:10,borderRight:"1px solid #e2e8f0",overflowY:"auto",paddingBottom:10},children:[e.jsxs("div",{style:{padding:20,border:"1px solid #e2e8f0",borderRadius:12,backgroundColor:"#fff",marginBottom:20,boxShadow:"0 1px 3px rgba(0,0,0,0.05)"},children:[e.jsxs("h4",{style:{marginTop:0,color:"#334155",fontSize:"1rem",fontWeight:700,textTransform:"uppercase",marginBottom:15},children:[e.jsx(Qe,{style:{marginRight:6}})," Tipo de Venta"]}),e.jsxs("div",{style:{display:"flex",gap:12,marginBottom:20},children:[e.jsx(A,{onClick:Ce,style:{flex:1,padding:"10px 0",backgroundColor:k==="contado"?"#0ea5e9":"#f1f5f9",color:k==="contado"?"#fff":"#475569",border:"none",borderRadius:8,fontWeight:"700",boxShadow:k==="contado"?"0 4px 6px -1px rgba(14, 165, 233, 0.4)":"none"},children:"CONTADO"}),e.jsx(A,{onClick:we,disabled:!C,style:{flex:1,padding:"10px 0",backgroundColor:k==="credito"?"#f59e0b":"#f1f5f9",color:k==="credito"?"#fff":"#475569",border:"none",borderRadius:8,fontWeight:"700",boxShadow:k==="credito"?"0 4px 6px -1px rgba(245, 158, 11, 0.4)":"none",opacity:C?1:.5},children:"CRÉDITO"})]}),e.jsxs("label",{style:{display:"block",fontWeight:"700",marginBottom:8,color:"#475569",fontSize:"0.9rem"},children:[e.jsx(Ze,{})," Seleccionar Cliente ",e.jsx("span",{style:{color:"#ef4444"},children:"* (Obligatorio)"})]}),e.jsxs(L,{as:"select",value:p,onChange:q,style:{height:42,padding:"0 12px",width:"100%",fontSize:"1rem",border:C?"2px solid #22c55e":"2px solid #ef4444",backgroundColor:C?"#f0fdf4":"#fef2f2",borderRadius:8},children:[e.jsx("option",{value:"0",children:"-- Seleccionar Cliente --"}),(N||[]).map(c=>e.jsxs("option",{value:c.id_cliente??c.id,children:[c.nombre,Number(c.saldo_pendiente||0)>0?` (Deuda: C$${Number(c.saldo_pendiente).toFixed(2)})`:""]},c.id_cliente??c.id))]}),!C&&e.jsxs("p",{style:{color:"#ef4444",margin:"8px 0 0",fontSize:"0.85rem",fontWeight:"600"},children:[e.jsx(Te,{style:{marginRight:4}})," No puedes vender sin seleccionar un cliente."]}),e.jsxs("div",{style:{marginTop:20},children:[e.jsxs("label",{style:{display:"block",fontWeight:"700",marginBottom:8,color:"#475569",fontSize:"0.9rem"},children:[e.jsx(et,{})," Atendido por (opcional):"]}),e.jsxs("select",{value:M,onChange:c=>oe(c.target.value),style:{width:"100%",padding:"10px 12px",fontSize:"1rem",borderRadius:8,border:"1px solid #cbd5e1",background:"#f8fafc",height:42},children:[e.jsx("option",{value:"",children:"-- Sin Empleado --"}),(m||[]).map(c=>e.jsx("option",{value:c.id_empleado,children:c.nombre},c.id_empleado))]})]})]}),e.jsxs("div",{style:{padding:20,border:"1px solid #e2e8f0",borderRadius:12,backgroundColor:"#fff",boxShadow:"0 1px 3px rgba(0,0,0,0.05)"},children:[e.jsx("h4",{style:{marginTop:0,color:"#334155",fontSize:"1rem",fontWeight:700,textTransform:"uppercase",borderBottom:"1px solid #f1f5f9",paddingBottom:10,marginBottom:15},children:"Desglose de Pago (C$)"}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"15px"},children:[e.jsxs("div",{children:[e.jsxs("label",{style:{display:"block",fontWeight:"600",fontSize:"0.85rem",marginBottom:6,color:"#64748b"},children:[e.jsx(tt,{})," Efectivo"]}),e.jsx(L,{type:"number",step:"0.01",value:f,onChange:c=>F(c.target.value),style:{width:"100%",height:38,fontSize:"1rem",borderRadius:8,border:"1px solid #cbd5e1"},disabled:Z})]}),e.jsxs("div",{children:[e.jsxs("label",{style:{display:"block",fontWeight:"600",fontSize:"0.85rem",marginBottom:6,color:"#64748b"},children:[e.jsx(at,{})," Dólares"]}),e.jsx(L,{type:"number",step:"0.01",value:D,onChange:c=>o(c.target.value),style:{width:"100%",height:38,fontSize:"1rem",borderRadius:8,border:"1px solid #cbd5e1"},disabled:Z})]}),e.jsxs("div",{children:[e.jsxs("label",{style:{display:"block",fontWeight:"600",fontSize:"0.85rem",marginBottom:6,color:"#64748b"},children:[e.jsx(Ie,{})," Tarjeta"]}),e.jsx(L,{type:"number",step:"0.01",value:x,onChange:c=>u(c.target.value),style:{width:"100%",height:38,fontSize:"1rem",borderRadius:8,border:"1px solid #cbd5e1"},disabled:Z})]}),e.jsxs("div",{children:[e.jsxs("label",{style:{display:"block",fontWeight:"600",fontSize:"0.85rem",marginBottom:6,color:"#64748b"},children:[e.jsx($e,{})," Transferencia"]}),e.jsx(L,{type:"number",step:"0.01",value:v,onChange:c=>T(c.target.value),style:{width:"100%",height:38,fontSize:"1rem",borderRadius:8,border:"1px solid #cbd5e1"},disabled:Z})]})]}),k==="credito"&&e.jsxs("div",{style:{marginTop:15,padding:12,backgroundColor:"#fff7ed",borderRadius:8,border:"1px dashed #f97316"},children:[e.jsxs("label",{style:{display:"block",fontWeight:"700",fontSize:"0.85rem",marginBottom:4,color:"#c2410c"},children:[e.jsx(ot,{})," CRÉDITO GENERADO"]}),e.jsxs("div",{style:{fontSize:"1.2rem",color:"#ea580c",fontWeight:800},children:["C$ ",le.toFixed(2)]})]}),me&&e.jsxs("div",{style:{marginTop:15,padding:12,border:"1px solid #fcd34d",borderRadius:8,backgroundColor:"#fffbeb"},children:[e.jsxs("label",{style:{display:"block",fontWeight:"700",fontSize:"0.85rem",color:"#b45309",marginBottom:6},children:[e.jsx(Me,{})," Nº Referencia Tarjeta ",e.jsx("span",{style:{color:"#ef4444"},children:"*"})]}),e.jsx(L,{type:"text",placeholder:"Ej: 1234",value:i,onChange:c=>_(c.target.value),style:{width:"100%",height:36,fontSize:"0.95rem"}})]}),$>.01&&e.jsxs("div",{style:{marginTop:15,padding:12,border:"1px solid #bae6fd",borderRadius:8,backgroundColor:"#f0f9ff"},children:[e.jsxs("label",{style:{display:"block",fontWeight:"700",fontSize:"0.85rem",color:"#0369a1",marginBottom:6},children:[e.jsx(Me,{})," Nº Referencia Transferencia ",e.jsx("span",{style:{color:"#ef4444"},children:"*"})]}),e.jsx(L,{type:"text",placeholder:"Ej: REF-5678",value:W,onChange:c=>X(c.target.value),style:{width:"100%",height:36,fontSize:"0.95rem"}})]}),k==="contado"&&e.jsxs(A,{info:!0,onClick:Se,style:{width:"100%",padding:"12px 0",marginTop:20,backgroundColor:"#e0f2fe",color:"#0284c7",border:"1px dashed #0ea5e9",fontSize:"0.95rem",fontWeight:600},children:[e.jsx(rt,{})," Rellenar con Efectivo (Total: C$ ",Number(t).toFixed(2),")"]})]})]}),e.jsxs("div",{style:{paddingLeft:10,display:"flex",flexDirection:"column",justifyContent:"space-between",paddingBottom:10},children:[e.jsxs("div",{children:[e.jsxs(Ae,{style:{marginBottom:15,padding:20,backgroundColor:"#f0f9ff",border:"none",borderRadius:12,boxShadow:"inset 0 2px 4px rgba(0,0,0,0.05)"},children:[e.jsxs(Y,{$bold:!0,style:{fontSize:"1.8rem",color:"#0f172a",marginBottom:5},children:[e.jsx("span",{style:{fontSize:"1rem",color:"#64748b",fontWeight:600},children:"TOTAL A PAGAR"}),e.jsxs("span",{children:["C$ ",Number(t).toFixed(2)]})]}),e.jsxs(Y,{style:{borderTop:"1px solid #cbd5e0",paddingTop:10,fontSize:"0.9rem",color:"#64748b"},children:[e.jsxs("span",{children:["Tasa USD: C$ ",Number(g).toFixed(2)]}),e.jsxs("span",{style:{color:"#0f172a",fontWeight:700},children:["$",(Number(t)/Number(g||1)).toFixed(2)," USD"]})]})]}),e.jsxs("div",{style:{padding:15,border:"1px solid #e2e8f0",borderRadius:12,marginBottom:15,backgroundColor:"#fff"},children:[e.jsxs(Y,{style:{color:"#64748b",fontSize:"0.95rem",marginBottom:8},children:[e.jsx("span",{children:"Pagado (Contado)"}),e.jsxs("span",{style:{fontWeight:"700",color:"#1e293b"},children:["C$ ",I.toFixed(2)]})]}),e.jsxs(Y,{style:{fontSize:"0.95rem"},children:[e.jsx("span",{children:"Estado"}),e.jsx("span",{style:{fontWeight:"700",color:le>.01?"#f59e0b":C?"#22c55e":"#ef4444"},children:Ee})]})]}),e.jsxs(Ae,{style:{marginBottom:10,padding:15,backgroundColor:fe==="#dc3545"?"#fef2f2":fe==="#28a745"?"#ecfccb":"#e0f2fe",color:fe==="#dc3545"?"#ef4444":fe==="#28a745"?"#4d7c0f":"#0369a1",fontWeight:"800",fontSize:"1.1rem",textAlign:"center",borderRadius:12,border:"none",boxShadow:"0 2px 4px rgba(0,0,0,0.05)"},children:[e.jsx(nt,{style:{marginRight:8}})," ",ye]})]}),e.jsxs("div",{style:{marginTop:"auto",display:"flex",flexDirection:"column",gap:"12px"},children:[e.jsxs(A,{type:"button",onClick:c=>{c.preventDefault(),b(!0)},disabled:H||!C,style:{width:"100%",padding:"16px 0",fontSize:"1.2rem",fontWeight:800,backgroundColor:H||!C?"#cbd5e1":"#2563eb",color:"white",border:"none",borderRadius:10,boxShadow:H||!C?"none":"0 4px 6px -1px rgba(37, 99, 235, 0.4)",transition:"all 0.2s"},children:[e.jsx(Le,{style:{marginRight:8}})," PAGAR E IMPRIMIR"]}),e.jsxs(A,{type:"button",onClick:c=>{c.preventDefault(),b(!1)},disabled:H||!C,style:{width:"100%",padding:"12px 0",fontSize:"1rem",fontWeight:700,backgroundColor:"white",color:H||!C?"#cbd5e1":"#475569",border:H||!C?"1px solid #e2e8f0":"2px solid #cbd5e1",borderRadius:10,transition:"all 0.2s"},children:[e.jsx(it,{style:{marginRight:8}})," Solo Guardar (Sin Ticket)"]})]})]})]})]})})},kt=lt`
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
`,zt=ne.div`
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
`,Et=ne.div`
  display: flex; flex-direction: column; gap: 12px;
  align-items: center; /* Center the ticket inside modal */
`,Rt=ne.img`
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
`;ne.span`
  display: inline-flex; align-items: center; gap: 6px;
  font-weight: 700; letter-spacing: .4px; padding: 6px 10px;
  border-radius: 8px; font-size: 0.85rem;
  background: #e0f2fe; color: #0284c7; border: 1px solid #bae6fd;
  text-transform: uppercase;
`;const Ft=ne.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: .75rem;
`,_t=({cart:t=[],total:g=0,subtotal:a=0,discount:h=0,proformaFor:N="",onClose:m,currentUser:r,client:n})=>{const{user:y}=typeof ke=="function"?ke():{user:null},{settings:d}=mt(),z=i=>(i==null?void 0:i.usuarioNombre)||(i==null?void 0:i.nombre_usuario)||(i==null?void 0:i.name)||(i==null?void 0:i.nombre)||(i==null?void 0:i.username)||null;let S=null;try{S=JSON.parse(localStorage.getItem("authUser")||"null")}catch{}const O=z(r)||z(y)||z(S)||"Cajero POS",f=(n==null?void 0:n.nombre)||"Consumidor Final",F=(n==null?void 0:n.cedula)||"",x=new Date().toLocaleString("es-NI"),u=i=>new Intl.NumberFormat("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(i||0)),D=ze.useMemo(()=>{if(!(d!=null&&d.empresa_logo_url))return null;if(d.empresa_logo_url.startsWith("http"))return d.empresa_logo_url;let i=d.empresa_logo_url;return i.startsWith("/uploads")?i="/api"+i:i.startsWith("uploads")&&(i="/api/"+i),`${"https://sistema.multirepuestosrg.com/api".replace(/\/api$/,"")}${i.startsWith("/")?"":"/"}${i}`},[d==null?void 0:d.empresa_logo_url]),o={name:(d==null?void 0:d.empresa_nombre)||"Multirepuestos RG",ruc:(d==null?void 0:d.empresa_ruc)||"1211812770001E",phone:(d==null?void 0:d.empresa_telefono)||"84031936 / 84058142",address:(d==null?void 0:d.empresa_direccion)||"Del portón de la normal 75 varas al este. Juigalpa, Chontales.",slogan:(d==null?void 0:d.empresa_eslogan)||"Tu mejor opción en repuestos",logo:D||new URL("/icons/logo.png",window.location.origin).toString()},v=l.useCallback((i="80")=>{const _=document.getElementById("print-wrapper-proforma");if(!_)return;const W=_.outerHTML,k=`
      @charset "UTF-8";
      @import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;500;600;700;800&display=swap');
      @page { size: ${i==="A4"?"A4 portrait":"80mm auto"}; margin: ${i==="A4"?"12mm":"0"}; }
      html, body {
        background: #fff; margin: 0 !important; padding: 0 !important;
        -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;
        color: #000 !important;
        font-family: 'League Spartan', 'Inter', system-ui, -apple-system, sans-serif;
      }
      
      #print-wrapper-proforma {
        box-shadow: none !important; border: none !important; margin: 0 !important;
        font-family: 'League Spartan', 'Inter', system-ui, sans-serif !important;
        ${i==="A4"?"width: 100% !important; padding: 0 !important; font-size: 10pt !important;":"width: 80mm !important; padding: 6px 4px !important; font-size: 9pt !important;"}
      }

      #print-wrapper-proforma .brand h1 {
        font-family: 'League Spartan', 'Inter', sans-serif !important;
        font-weight: 900 !important;
      }

      #print-wrapper-proforma .brand-logo-container img {
        max-width: ${i==="A4"?"130px":"110px"} !important;
        max-height: ${i==="A4"?"90px":"110px"} !important;
        width: auto !important;
        height: auto !important;
        object-fit: contain !important;
      }

      ${i==="A4"?`
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
    `,E=window.open("","_blank","width=900,height=700");E&&(E.document.write(`<!DOCTYPE html><html><head><title>PROFORMA - ${o.name}</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"><style>${k}</style></head><body>${W}</body></html>`),E.document.close(),E.focus(),E.onload=function(){setTimeout(()=>{E.print(),setTimeout(()=>{E.close(),m&&m()},500)},400)})},[o,m]),T=t.length<=2;return e.jsxs(he,{className:"no-print",children:[e.jsx(kt,{}),e.jsxs(je,{className:"no-print",style:{maxWidth:520,width:"96%",padding:"1.2rem",background:"#fff"},children:[e.jsxs(Ft,{children:[e.jsxs("h2",{style:{display:"flex",alignItems:"center",gap:8,margin:0,fontSize:"1.25rem"},children:[e.jsx(st,{})," Proforma"]}),e.jsxs("div",{style:{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"flex-end"},children:[e.jsx(A,{onClick:()=>v("80"),style:{padding:"8px 12px",fontSize:"0.85rem"},children:"80mm"}),e.jsxs(A,{onClick:()=>v("A4"),style:{padding:"8px 12px",fontSize:"0.85rem"},children:[e.jsx(De,{})," A4"]}),e.jsx(A,{$cancel:!0,onClick:m,style:{padding:"8px 12px",background:"#e2e8f0",color:"#0f172a"},children:e.jsx(Te,{})})]})]}),e.jsx(Et,{children:e.jsxs(zt,{id:"print-wrapper-proforma",className:`print-area print-80 ${T?"compact":""}`,children:[e.jsxs("div",{className:"brand",children:[e.jsx("div",{className:"brand-logo-container",children:e.jsx(Rt,{src:o.logo,alt:"Logo",onError:i=>{i.currentTarget.style.display="none"}})}),e.jsxs("div",{className:"brand-info",children:[e.jsx("h1",{children:o.name}),e.jsx("small",{children:o.slogan}),e.jsxs("small",{children:["RUC: ",o.ruc]}),e.jsxs("small",{children:["Tel: ",o.phone]}),e.jsx("small",{children:o.address}),e.jsx("div",{style:{marginTop:6},children:e.jsxs("span",{className:"proforma-tag",children:[e.jsx(De,{style:{marginRight:4,verticalAlign:"middle"}})," COTIZACIÓN / PROFORMA"]})})]})]}),e.jsxs("div",{className:"meta",children:[e.jsxs("div",{className:"meta-col",children:[e.jsx("span",{className:"meta-title",children:"Detalles"}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Fecha:"}),e.jsx("span",{className:"meta-value",children:x})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"ID Temp:"}),e.jsx("span",{className:"meta-value",children:Date.now().toString().slice(-6)})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Atendido por:"}),e.jsx("span",{className:"meta-value",children:O})]})]}),e.jsxs("div",{className:"meta-col",children:[e.jsx("span",{className:"meta-title",children:"Cliente"}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Nombre:"}),e.jsx("span",{className:"meta-value",children:N||f})]}),F&&e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Cédula:"}),e.jsx("span",{className:"meta-value",children:F})]})]})]}),e.jsxs("table",{className:"items",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{className:"col-qty",children:"Cant."}),e.jsx("th",{children:"Descripción"}),e.jsx("th",{className:"text-right col-unit",children:"P. Unit."}),e.jsx("th",{className:"text-right col-total",children:"Total"})]})}),e.jsx("tbody",{children:t.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:"4",style:{textAlign:"center",color:"#777"},children:"Sin ítems"})}):t.map((i,_)=>{const W=Number(i.precio_venta??i.precio??0),X=Number(i.quantity??0),k=W*X;return e.jsxs("tr",{children:[e.jsx("td",{className:"col-qty",children:X}),e.jsx("td",{children:i.nombre||i.descripcion||"Item"}),e.jsxs("td",{className:"text-right col-unit",children:["C$",u(W)]}),e.jsxs("td",{className:"text-right col-total",children:["C$",u(k)]})]},_)})})]}),e.jsx("div",{className:"totals",children:e.jsxs("div",{className:"totals-box",children:[e.jsxs(Y,{children:[e.jsx("span",{children:"Subtotal:"}),e.jsxs("span",{children:["C$",u(a)]})]}),h>0&&e.jsxs(Y,{style:{color:"#dc3545"},children:[e.jsx("span",{children:"Descuento:"}),e.jsxs("span",{children:["- C$",u(h)]})]}),e.jsxs(Y,{className:"grand-total",style:{fontWeight:"bold",fontSize:"1.2rem",marginTop:5,borderTop:"2px solid black"},children:[e.jsx("span",{children:"TOTAL:"}),e.jsxs("span",{children:["C$",u(g)]})]}),e.jsxs("div",{style:{marginTop:12,textAlign:"center"},children:[e.jsx("span",{className:"badge",children:"DOCUMENTO NO VÁLIDO COMO FACTURA"}),e.jsx("p",{style:{margin:"5px 0 0",fontSize:"0.72rem",color:"#666"},children:"Precios sujetos a cambio. Válido por 3 días."})]})]})}),e.jsxs("div",{className:"thanks",children:[e.jsxs("p",{children:['"',o.slogan,'"']}),e.jsx("p",{style:{whiteSpace:"pre-line",marginTop:"5px"},children:(d==null?void 0:d.ticket_proforma_footer)||"¡Gracias por cotizar con nosotros!"})]})]})})]})]})},Wt=({isOpen:t,onClose:g,onConfirm:a,onSubmit:h,title:N,message:m,fields:r=[],inputType:n="number",icon:y})=>{const[d,z]=l.useState({}),[S,O]=l.useState("");if(l.useEffect(()=>{if(t)if(r.length>0){const x={};r.forEach(u=>{x[u.name]=u.defaultValue!==void 0?u.defaultValue:""}),z(x)}else O("")},[t,r]),!t)return null;const f=()=>{r.length>0?h?h(d):a&&a(d):h?h(S):a&&a(S)},F=(x,u)=>{z(D=>({...D,[x]:u}))};return e.jsx(he,{children:e.jsxs(je,{style:{maxWidth:"450px"},children:[e.jsxs("div",{style:{textAlign:"center",marginBottom:"1.5rem"},children:[y?e.jsx("div",{style:{fontSize:"2.5rem",marginBottom:"1rem"},children:y}):e.jsx(dt,{size:"2.5em",color:"#007bff"}),e.jsx("h2",{style:{marginTop:"0.5rem",marginBottom:"0.5rem"},children:N}),m&&e.jsx("p",{style:{color:"#6c757d"},children:m})]}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:r.length>0?r.map(x=>e.jsxs("div",{children:[x.label&&e.jsx("label",{style:{display:"block",marginBottom:"5px",fontWeight:600,fontSize:"0.9rem"},children:x.label}),x.type==="select"?e.jsx("select",{value:d[x.name],onChange:u=>F(x.name,u.target.value),style:{width:"100%",padding:"10px",borderRadius:"8px",border:"1px solid #ccc",fontSize:"1rem"},children:x.options&&x.options.map(u=>e.jsx("option",{value:u.value,children:u.label},u.value))}):e.jsx(L,{type:x.type||"text",placeholder:x.placeholder||"",value:d[x.name],onChange:u=>F(x.name,u.target.value),autoFocus:x.name===r[0].name})]},x.name)):e.jsx(L,{type:n,value:S,onChange:x=>O(x.target.value),autoFocus:!0})}),e.jsxs("div",{style:{display:"flex",justifyContent:"flex-end",gap:"1rem",marginTop:"2rem"},children:[e.jsx(A,{onClick:g,style:{backgroundColor:"#6c757d"},children:"Cancelar"}),e.jsx(A,{onClick:f,primary:!0,children:"Aceptar"})]})]})})},ce=ne.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 6px;
  
  label { font-weight: bold; color: #495057; }
  input { width: 120px; text-align: right; }
`,Pt=({isOpen:t,onClose:g,currentStats:a,onConfirm:h})=>{const[N,m]=l.useState("manual"),[r,n]=l.useState({efectivo:"",credito:"",tarjeta:"",dolares:"",ventas_totales:""}),[y,d]=l.useState({cordobas:"",dolares:"",ventas_totales:""}),z=(f,F)=>{n(x=>({...x,[f]:F}))},S=(f,F)=>{d(x=>({...x,[f]:F}))},O=()=>{const f=[];if(N==="manual")parseFloat(r.efectivo)&&f.push({target:"efectivo",amount:parseFloat(r.efectivo)}),parseFloat(r.credito)&&f.push({target:"credito",amount:parseFloat(r.credito)}),parseFloat(r.tarjeta)&&f.push({target:"tarjeta",amount:parseFloat(r.tarjeta)}),parseFloat(r.ventas_totales)&&f.push({target:"ventas_totales",amount:parseFloat(r.ventas_totales)});else{const F=parseFloat(y.cordobas),x=parseFloat(y.dolares),u=parseFloat(y.ventas_totales);if(!isNaN(F)){const D=Number((a==null?void 0:a.netCordobas)||0),o=F-D;Math.abs(o)>.01&&f.push({target:"efectivo",amount:o})}if(!isNaN(x)){const D=Number((a==null?void 0:a.netDolares)||0),o=x-D;Math.abs(o)>.01&&f.push({target:"dolares",amount:o})}if(!isNaN(u)){const D=Number((a==null?void 0:a.totalVentasDia)||0),o=u-D;Math.abs(o)>.01&&f.push({target:"ventas_totales",amount:o})}}f.length>0&&h(f),g()};return t?e.jsx(he,{style:{background:"rgba(0,0,0,0.95)",zIndex:9999},children:e.jsxs(je,{style:{maxWidth:"450px",background:"#212529",color:"#fff",border:"1px solid #495057",maxHeight:"90vh",overflowY:"auto"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20},children:[e.jsxs("h2",{style:{margin:0,color:"#ffc107",display:"flex",alignItems:"center",gap:10},children:[e.jsx(ct,{})," GOD MODE"]}),e.jsx(A,{$cancel:!0,onClick:g,style:{background:"transparent",color:"#6c757d",border:"none"},children:"✕"})]}),e.jsxs("div",{style:{display:"flex",gap:10,marginBottom:20},children:[e.jsx(A,{onClick:()=>m("manual"),style:{flex:1,background:N==="manual"?"#ffc107":"#343a40",color:N==="manual"?"#000":"#fff",border:"none"},children:"Ajuste Manual (+/-)"}),e.jsx(A,{onClick:()=>m("override"),style:{flex:1,background:N==="override"?"#ffc107":"#343a40",color:N==="override"?"#000":"#fff",border:"none"},children:"Fijar Monto (=)"})]}),N==="manual"?e.jsxs(e.Fragment,{children:[e.jsx("p",{style:{color:"#adb5bd",fontSize:"0.85rem",marginBottom:15},children:"Suma o resta cantidades a los contadores ocultamente."}),e.jsxs(ce,{style:{background:"#343a40"},children:[e.jsx("label",{style:{color:"#fff"},children:"Efectivo (C$)"}),e.jsx(L,{type:"number",step:"0.01",placeholder:"+/- 0.00",value:r.efectivo,onChange:f=>z("efectivo",f.target.value),style:{background:"#495057",color:"#fff"}})]}),e.jsxs(ce,{style:{background:"#343a40"},children:[e.jsx("label",{style:{color:"#fff"},children:"Crédito"}),e.jsx(L,{type:"number",step:"0.01",placeholder:"+/- 0.00",value:r.credito,onChange:f=>z("credito",f.target.value),style:{background:"#495057",color:"#fff"}})]}),e.jsxs(ce,{style:{background:"#343a40"},children:[e.jsx("label",{style:{color:"#fff"},children:"Tarjeta"}),e.jsx(L,{type:"number",step:"0.01",placeholder:"+/- 0.00",value:r.tarjeta,onChange:f=>z("tarjeta",f.target.value),style:{background:"#495057",color:"#fff"}})]}),e.jsxs(ce,{style:{background:"#2a1a00",border:"1px solid #ffc107"},children:[e.jsx("label",{style:{color:"#ffc107"},children:"Ventas Totales"}),e.jsx(L,{type:"number",step:"0.01",placeholder:"+/- 0.00",value:r.ventas_totales,onChange:f=>z("ventas_totales",f.target.value),style:{background:"#495057",color:"#ffc107",border:"1px solid #ffc107"}})]})]}):e.jsxs(e.Fragment,{children:[e.jsx("p",{style:{color:"#adb5bd",fontSize:"0.85rem",marginBottom:15},children:"Define EXACTAMENTE cuánto dinero físico hay. El sistema creará un ajuste mágico para cuadrar."}),e.jsxs("div",{style:{background:"#343a40",padding:10,borderRadius:6,marginBottom:10},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",color:"#aaa",marginBottom:5},children:[e.jsx("span",{children:"Sistema Actual:"}),e.jsxs("span",{children:["C$ ",Number((a==null?void 0:a.netCordobas)||0).toFixed(2)]})]}),e.jsxs(ce,{style:{background:"transparent",padding:0,marginBottom:0},children:[e.jsx("label",{style:{color:"#fff"},children:"Real en Caja (C$)"}),e.jsx(L,{type:"number",step:"0.01",placeholder:"0.00",value:y.cordobas,onChange:f=>S("cordobas",f.target.value),style:{background:"#495057",color:"#fff",border:"1px solid #ffc107"}})]})]}),e.jsxs("div",{style:{background:"#343a40",padding:10,borderRadius:6},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",color:"#aaa",marginBottom:5},children:[e.jsx("span",{children:"Sistema Actual:"}),e.jsxs("span",{children:["$ ",Number((a==null?void 0:a.netDolares)||0).toFixed(2)]})]}),e.jsxs(ce,{style:{background:"transparent",padding:0,marginBottom:0},children:[e.jsx("label",{style:{color:"#fff"},children:"Real en Caja ($)"}),e.jsx(L,{type:"number",step:"0.01",placeholder:"0.00",value:y.dolares,onChange:f=>S("dolares",f.target.value),style:{background:"#495057",color:"#fff",border:"1px solid #ffc107"}})]})]}),e.jsxs("div",{style:{background:"#2a1a00",padding:10,borderRadius:6,border:"1px solid #ffc107",marginTop:10},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",color:"#ffc107",marginBottom:5},children:[e.jsx("span",{children:"Sistema Actual:"}),e.jsxs("span",{children:["C$ ",Number((a==null?void 0:a.totalVentasDia)||0).toFixed(2)]})]}),e.jsxs(ce,{style:{background:"transparent",padding:0,marginBottom:0},children:[e.jsx("label",{style:{color:"#ffc107"},children:"Ventas Totales (C$)"}),e.jsx(L,{type:"number",step:"0.01",placeholder:"0.00",value:y.ventas_totales,onChange:f=>S("ventas_totales",f.target.value),style:{background:"#495057",color:"#ffc107",border:"1px solid #ffc107"}})]})]})]}),e.jsxs("div",{style:{marginTop:25,display:"flex",gap:10},children:[e.jsx(A,{onClick:g,style:{flex:1,background:"#495057",border:"none"},children:"Cancelar"}),e.jsxs(A,{onClick:O,style:{flex:1,background:"#ffc107",color:"#000",fontWeight:"bold",border:"none"},children:[e.jsx(pt,{style:{marginRight:6}})," ",N==="manual"?"APLICAR AJUSTE":"CUADRAR MÁGICAMENTE"]})]})]})}):null};export{$t as C,Ot as P,Pt as S,Lt as a,Wt as b,jt as c,_t as d};

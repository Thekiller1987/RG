import{r as l,j as e,a1 as Be,a2 as Oe,aR as $e,a3 as We,a4 as Le,I as Pe,A as Ve,s as oe,m as _e,n as qe,u as Ge,R as Fe,aN as Ue,a_ as Ie,ag as Me,b0 as He,K as Se,x as ve,b1 as Je,b2 as Ye,aU as Ke,ah as Qe,b3 as Xe,a6 as Ze,b4 as Te,b5 as et,b6 as tt,ab as at,aS as ot,C as ze,q as rt,b7 as it,b8 as nt,b9 as st}from"./vendor-CmfT02pU.js";import{d as lt,S as A,h as dt,i as ct,j as pt,M as ce,a as he,B as k,f as L,I as ke}from"./POS.styles-DQ9pTtF7.js";import"./AlertModal-eg7K_wmT.js";import{u as Ee,a as mt}from"./index-DnX-2Exk.js";const z=r=>{const b=Number(r);return isNaN(b)||!isFinite(b)?0:b};function xt(r){if(!Array.isArray(r)||r.length===0)return[];const b=new Set,a=[];for(const v of r)v.id&&b.has(v.id)||(v.id&&b.add(v.id),a.push(v));return a}const ft=(r,b=0,a=36.6)=>{const v=Math.max(0,z(b)),I=z(a)||36.6,C={ventasContado:[],devoluciones:[],cancelaciones:[],entradas:[],salidas:[],abonos:[],ajustes:[]};let p=0,c=0,w=0,x=0,E=0,S=0,M=0,m=0;const T=xt(Array.isArray(r)?r:[]);for(const n of T){let o=((n==null?void 0:n.type)||"").toLowerCase().trim();o=o.normalize("NFD").replace(/[\u0300-\u036f]/g,"");let g=(n==null?void 0:n.pagoDetalles)||{};if(typeof g=="string")try{g=JSON.parse(g)}catch{g={}}(!g||typeof g!="object")&&(g={});const i=z(n.amount),N=z(g.totalVenta)||i,R=z(g.efectivo),B=z(g.dolares),G=z(g.cambio),j=z(g.ingresoCaja),J=z(g.tarjeta),X=z(g.transferencia),U=z(g.credito);let q=N||i;(o==="salida"||o.includes("devolucion")||o.includes("cancelacion")||o.includes("anulacion"))&&(q=-Math.abs(q));const $={...n,pagoDetalles:g,displayAmount:q};if(o.startsWith("venta")||o.includes("abono")||o.includes("pedido")||o.includes("apartado")?(w+=J,x+=X,E+=U):o==="ajuste"&&(g.target==="tarjeta"&&(w+=i),g.target==="credito"&&(E+=i),g.target==="transferencia"&&(x+=i)),o.startsWith("venta"))if(R>.001||B>.001||G>.001)p+=R-G,c+=B;else if(j>.001)p+=j;else{const O=J+X+U,W=N-O;W>.001&&(p+=W)}else if(o.includes("abono")||o.includes("liquidación")||o.includes("liquidacion")||o.includes("pedido"))if(B>.001)c+=B,p+=R;else if(R>.001)p+=R;else if(j>.001)p+=j;else{const O=J+X;p+=Math.max(0,i-O)}else if(o==="entrada")p+=Math.abs(i);else if(o==="salida")p-=Math.abs(i);else if(o.includes("devolucion")||o.includes("cancelacion")||o.includes("anulacion"))if(g.ingresoCaja!==void 0&&g.ingresoCaja!==null)p+=z(g.ingresoCaja);else if(R>.001)p-=R;else{const O=J+X+U,W=Math.abs(i)-O;W>.001&&(p-=W)}else if(o==="ajuste")g.target==="efectivo"?(p+=i,g.hidden&&(m+=i)):g.target==="dolares"&&(c+=i);else{const O=J+X+U,W=i-O;Math.abs(W)>.001&&(p+=W)}o.startsWith("venta")||o.includes("abono")||o.includes("liquid")||o.includes("pedido")||o==="entrada"?M+=Math.abs(q):o.includes("devolucion")||o.includes("cancelacion")||o.includes("anulacion")?M-=Math.abs(q):o==="ajuste"&&g.target==="ventas_totales"&&(M+=i),o.startsWith("venta")?C.ventasContado.push($):o.includes("devolucion")?(C.devoluciones.push($),S+=Math.abs(q)):o.includes("cancelacion")||o.includes("anulacion")?(C.cancelaciones.push($),S+=Math.abs(q)):o==="entrada"?C.entradas.push($):o==="salida"?C.salidas.push($):o.includes("abono")?C.abonos.push($):o==="ajuste"&&C.ajustes.push($)}p=z(p),c=z(c),w=z(w),x=z(x),E=z(E),M=z(M),m=z(m),S=z(S);const t=v+p,f=t+c*I;return{cajaInicial:v,netCordobas:p,netDolares:c,efectivoEsperado:z(f),efectivoEsperadoCordobas:z(t),efectivoEsperadoDolares:c,totalVentasDia:z(M),totalTarjeta:w,totalTransferencia:x,totalCredito:E,totalNoEfectivo:z(w+x+E),sumDevolucionesCancelaciones:S,totalHidden:m,tasaRef:I,lists:C}},je=r=>Number(r||0).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}),Re=oe.button`
  display: flex; align-items: center; justify-content: center;
  width: 42px; height: 42px;
  border: 1px solid ${r=>r.$active?"#3b82f6":"#cbd5e1"};
  background-color: ${r=>r.$active?"#eff6ff":"#fff"};
  color: ${r=>r.$active?"#3b82f6":"#64748b"};
  border-radius: 8px; cursor: pointer; transition: all 0.2s;

  &:hover { border-color: #3b82f6; color: #3b82f6; }
`,gt=({isOpen:r,imageSrc:b,onClose:a})=>!r||!b?null:e.jsx(ce,{onClick:a,children:e.jsxs(_e.div,{initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},onClick:v=>v.stopPropagation(),style:{position:"relative",maxWidth:"95%",maxHeight:"90vh"},children:[e.jsx("button",{onClick:a,style:{position:"absolute",top:-15,right:-15,background:"white",width:32,height:32,borderRadius:"50%",border:"none",cursor:"pointer",boxShadow:"0 4px 6px rgba(0,0,0,0.1)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10,color:"#ef4444"},children:e.jsx(qe,{})}),e.jsx("img",{src:b,alt:"Vista Ampliada",style:{maxWidth:"100%",maxHeight:"85vh",borderRadius:"12px",boxShadow:"0 20px 25px rgba(0,0,0,0.2)",background:"white",objectFit:"contain"}})]})});function zt({products:r=[],searchTerm:b,setSearchTerm:a,onProductClick:v,cartItems:I=[],reservedStock:C,inputRef:p,searchType:c="description",setSearchType:w=()=>{},isWholesale:x=!1}){const[E,S]=l.useState({isOpen:!1,imageUrl:null}),M=l.useMemo(()=>{const t=new Map;for(const f of I){const n=f.id_producto||f.id;t.set(n,(t.get(n)||0)+Number(f.quantity||0))}return t},[I]),m=l.useMemo(()=>{const t=(b||"").toLowerCase().trim();return r.filter(n=>{const o=i=>i?String(i).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase():"",g=o(t);if(!g)return!0;if(c==="code"){const i=o(n.codigo),N=o(n.codigo_barras);return i.startsWith(g)||N.startsWith(g)}else{const i=o(n.nombre),N=o(n.descripcion),R=o(n.codigo);return i.includes(g)||N.includes(g)||R.includes(g)}}).slice(0,100)},[r,b,c]),T=l.useMemo(()=>{const t=(b||"").toLowerCase().trim();return t?r.filter(f=>{const n=(f.nombre||"").toLowerCase(),o=String(f.codigo||"").toLowerCase();return n.includes(t)||o.includes(t)}).length:r.length},[r,b]);return e.jsxs(lt,{children:[e.jsxs("div",{style:{display:"flex",gap:"8px",marginBottom:"1rem",alignItems:"center"},children:[e.jsx(A,{ref:p,placeholder:c==="code"?"Escribe código...":"Buscar producto...",value:b,onChange:t=>a(t.target.value),onKeyDown:t=>{if(t.key==="Enter"){const f=(b||"").trim().toLowerCase();if(!f)return;const n=r.find(o=>String(o.codigo||"").toLowerCase()===f||String(o.codigo_barras||"").toLowerCase()===f);if(n){v(n),a("");return}m.length===1&&(v(m[0]),a(""))}}}),e.jsx(Re,{$active:c==="description",onClick:()=>{var t;w("description"),(t=p.current)==null||t.focus()},title:"Buscar por Nombre",children:e.jsx(Be,{size:16})}),e.jsx(Re,{$active:c==="code",onClick:()=>{var t;w("code"),(t=p.current)==null||t.focus()},title:"Buscar por Código",children:e.jsx(Oe,{size:18})})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"8px",padding:"0 4px",fontSize:"0.85rem",color:"#64748b"},children:[e.jsxs("span",{children:[e.jsx($e,{color:"#3b82f6"})," ",m.length," mostrados"]}),e.jsxs("span",{children:["Total: ",T]})]}),e.jsx(dt,{children:m.map(t=>{const f=t.id_producto||t.id,n=M.get(f)||0,o=(C==null?void 0:C.get(f))||0,g=Math.max(0,Number(t.existencia||0)-n-o),i=g<=0;return e.jsxs(ct,{onClick:()=>!i&&v(t),outOfStock:i,title:t.nombre,children:[e.jsx(pt,{lowstock:g<5&&!i,outOfStock:i,children:i?"Agotado":`Stock: ${g}`}),e.jsxs("div",{className:"image-placeholder",style:{position:"relative",height:160,background:"#f8fafc",display:"flex",alignItems:"center",justifyContent:"center",borderBottom:"1px solid #f1f5f9",overflow:"hidden"},children:[t.imagen&&e.jsx("div",{className:"eye-icon",onClick:N=>{N.stopPropagation(),S({isOpen:!0,imageUrl:t.imagen})},style:{position:"absolute",top:10,left:10,zIndex:20,background:"white",borderRadius:"50%",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 6px rgba(0,0,0,0.1)",cursor:"pointer",transition:"transform 0.2s"},title:"Ver imagen",children:e.jsx(We,{size:14,color:"#64748b"})}),t.imagen?e.jsx("img",{src:t.imagen,alt:t.nombre,loading:"lazy",style:{maxWidth:"100%",maxHeight:"100%",objectFit:"contain"}}):e.jsx(Le,{className:"no-image-icon",size:40,color:"#e2e8f0"})]}),e.jsxs("div",{className:"info",style:{padding:"12px",flex:1,display:"flex",flexDirection:"column",gap:"4px"},children:[e.jsx("div",{className:"product-name",style:{fontWeight:600,fontSize:"0.88rem",color:"#1e293b",lineHeight:"1.25",height:"3.8rem",overflow:"hidden",display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical"},children:t.nombre}),e.jsx("div",{style:{fontSize:"0.85rem",fontWeight:"bold",color:"#334155",marginBottom:"4px"},children:t.codigo||"S/C"}),x?e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:{fontSize:"0.75rem",color:"#64748b",display:"flex",alignItems:"center",gap:"4px",marginTop:"auto",marginBottom:"1px",textDecoration:"line-through"},children:["Tienda: C$ ",je(t.precio_venta||t.precio)]}),e.jsxs("div",{className:"price",style:{fontWeight:800,color:"#8b5cf6",fontSize:"1.1rem"},children:["C$ ",je(t.mayorista||t.mayoreo||t.distribuidor||t.taller||t.precio_venta)]})]}):e.jsxs(e.Fragment,{children:[(Number(t.mayorista)>0||Number(t.mayoreo)>0||Number(t.distribuidor)>0||Number(t.taller)>0)&&e.jsxs("div",{style:{fontSize:"0.75rem",color:"#10b981",display:"flex",alignItems:"center",gap:"4px",marginTop:"auto",marginBottom:"1px"},children:[e.jsx(Pe,{size:10})," May: C$ ",je(t.mayorista||t.mayoreo||t.distribuidor||t.taller)]}),e.jsxs("div",{className:"price",style:{fontWeight:800,color:"#2563eb",fontSize:"1.05rem",marginTop:Number(t.mayorista)>0||Number(t.mayoreo)>0||Number(t.distribuidor)>0||Number(t.taller)>0?0:"auto"},children:["C$ ",je(t.precio_venta||t.precio)]})]})]})]},f)})}),e.jsx(Ve,{children:E.isOpen&&e.jsx(gt,{isOpen:!0,imageSrc:E.imageUrl,onClose:()=>S({isOpen:!1,imageUrl:null})})})]})}const ht=Fe.memo(()=>e.jsx("style",{children:`
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
  `})),bt=oe.div`
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
`,kt=({currentUser:r,isCajaOpen:b,session:a,onOpenCaja:v,onCloseCaja:I,onClose:C,isAdmin:p,showConfirmation:c,showAlert:w,initialTasaDolar:x,clients:E=[]})=>{var me,xe;const[S,M]=l.useState(""),[m,T]=l.useState(x||36.6),[t,f]=l.useState(""),[n,o]=l.useState(!1),g=Ge(),i=(r==null?void 0:r.id_usuario)||(r==null?void 0:r.id);let N=(me=a==null?void 0:a.openedBy)==null?void 0:me.name;!N&&(a!=null&&a.openedBy)&&typeof a.openedBy=="string"&&(N=a.openedBy),N||(N=(a==null?void 0:a.userId)===i?(r==null?void 0:r.nombre_usuario)||(r==null?void 0:r.username):"Usuario"),N||(N="Caja General");const R=p||(a==null?void 0:a.userId)===i||((xe=a==null?void 0:a.openedBy)==null?void 0:xe.id)===i,B=l.useMemo(()=>Array.isArray(a==null?void 0:a.transactions)?a.transactions:[],[a]),G=l.useMemo(()=>{const d=ft(B,(a==null?void 0:a.initialAmount)||0,(a==null?void 0:a.tasaDolar)||x);if(a!=null&&a.stats&&typeof a.stats=="object")return{...a.stats,lists:a.stats.lists||d.lists};if(a!=null&&a.sqlTotals){const u=a.sqlTotals,se=(a==null?void 0:a.initialAmount)||0;return{cajaInicial:se,netCordobas:u.efectivo,netDolares:u.dolares,movimientoNetoEfectivo:u.esperado-se,efectivoEsperado:u.esperado,efectivoEsperadoCordobas:u.efectivo+se,efectivoEsperadoDolares:u.dolares,totalTarjeta:u.tarjeta,totalTransferencia:u.transferencia,totalCredito:u.credito,totalNoEfectivo:u.tarjeta+u.transferencia+u.credito,tasaRef:(a==null?void 0:a.tasaDolar)||x,lists:d.lists}}return d},[B,a,x]),{cajaInicial:j,netCordobas:J,netDolares:X,efectivoEsperado:U,efectivoEsperadoCordobas:q,efectivoEsperadoDolares:pe,totalVentasDia:$,totalTarjeta:O,totalTransferencia:W,totalCredito:re,totalNoEfectivo:Z,sumDevolucionesCancelaciones:y,totalHidden:de,tasaRef:te,lists:{ventasContado:be,devoluciones:Y,cancelaciones:ie,entradas:D,salidas:P,abonos:V}}=G,F=Number(t||0)-U;a!=null&&a.openedAt&&new Date(a.openedAt);const K=()=>{const d=parseFloat(S||0);if(isNaN(d)||d<0)return w({title:"Inválido",message:"Monto inicial >= 0"});v(d,Number(m||36.6))},ne=()=>{if(isNaN(parseFloat(t)))return w({title:"Requerido",message:"Ingrese el monto contado físico."});o(!0)},Q=Fe.useCallback(()=>{const d=document.getElementById("print-wrapper-caja");if(!d)return;const u=d.outerHTML,se=`
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
      `,ee=window.open("","_blank","width=500,height=600");ee&&(ee.document.write(`<html><head><title>Cierre Caja</title><style>${se}</style></head><body>${u}</body></html>`),ee.document.close(),ee.focus(),ee.onload=function(){setTimeout(()=>{ee.print()},300)},ee.onafterprint=()=>{try{ee.close()}catch{}})},[]),ye=()=>{Q(),setTimeout(()=>{I(Number(t))},800)},h=d=>`C$${Number(d||0).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`,ae=d=>`$${Number(d||0).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`;return e.jsxs(ce,{className:"no-print",children:[e.jsx(ht,{}),e.jsxs(he,{style:{maxWidth:n?450:760,padding:n?0:"1.5rem",background:"#f8f9fa"},children:[!n&&e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12},children:[e.jsx("h2",{style:{margin:0},children:"Gestión de Caja"}),e.jsx(k,{$cancel:!0,onClick:C,style:{borderRadius:"50%",width:32,height:32,padding:0},children:"✕"})]}),b?n?e.jsxs("div",{style:{display:"flex",flexDirection:"column",height:"100%",maxHeight:"90vh"},children:[e.jsxs("div",{style:{padding:"15px 20px",background:"#343a40",color:"#fff",display:"flex",justifyContent:"space-between",alignItems:"center",borderRadius:"8px 8px 0 0"},children:[e.jsxs("div",{children:[e.jsx("h3",{style:{margin:0,fontSize:"1.2rem",fontWeight:"800",letterSpacing:"0.5px"},children:"REPORTAR CIERRE DE CAJA"}),e.jsx("p",{style:{margin:0,fontSize:"0.9rem",opacity:.8},children:new Date().toLocaleString("es-NI")})]}),e.jsxs(k,{$cancel:!0,onClick:()=>o(!1),style:{padding:"8px 15px",fontSize:"0.9rem",background:"rgba(255,255,255,0.2)",border:"none"},children:[e.jsx(Ie,{})," Volver / Editar"]})]}),e.jsxs("div",{style:{flex:1,overflowY:"auto",background:"#f8f9fa",padding:"20px"},children:[e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:15,marginBottom:20},children:[e.jsxs("div",{style:{background:"#fff",padding:15,borderRadius:8,boxShadow:"0 2px 5px rgba(0,0,0,0.05)",borderLeft:"4px solid #007bff"},children:[e.jsx("div",{style:{fontSize:"0.8rem",color:"#666",textTransform:"uppercase"},children:"Ventas Totales"}),e.jsx("div",{style:{fontSize:"1.5rem",fontWeight:"800",color:"#333"},children:h($)})]}),e.jsxs("div",{style:{background:"#fff",padding:15,borderRadius:8,boxShadow:"0 2px 5px rgba(0,0,0,0.05)",borderLeft:"4px solid #28a745"},children:[e.jsx("div",{style:{fontSize:"0.8rem",color:"#666",textTransform:"uppercase"},children:"Efectivo Real"}),e.jsx("div",{style:{fontSize:"1.5rem",fontWeight:"800",color:"#28a745"},children:h(t)})]}),e.jsxs("div",{style:{background:"#fff",padding:15,borderRadius:8,boxShadow:"0 2px 5px rgba(0,0,0,0.05)",borderLeft:`4px solid ${F<0?"#dc3545":"#ffc107"}`},children:[e.jsx("div",{style:{fontSize:"0.8rem",color:"#666",textTransform:"uppercase"},children:"Diferencia"}),e.jsxs("div",{style:{fontSize:"1.5rem",fontWeight:"800",color:F!==0?F<0?"#dc3545":"#e0a800":"#28a745"},children:[F>0?"+":"",h(F)]})]})]}),e.jsxs("div",{style:{background:"#fff",padding:20,borderRadius:8,boxShadow:"0 2px 10px rgba(0,0,0,0.05)",marginBottom:20},children:[e.jsx("h4",{style:{margin:"0 0 15px",borderBottom:"1px solid #eee",paddingBottom:10},children:"Arqueo Detallado"}),e.jsx("table",{style:{width:"100%",borderCollapse:"collapse"},children:e.jsxs("tbody",{children:[e.jsxs("tr",{style:{borderBottom:"1px solid #f1f1f1"},children:[e.jsx("td",{style:{padding:10},children:"Fondo Inicial"}),e.jsx("td",{className:"text-right",style:{padding:10,fontWeight:"bold"},children:h(j)})]}),e.jsx("tr",{style:{background:"#f8f9fa"},children:e.jsx("td",{colSpan:"2",style:{padding:"8px 10px",fontSize:"0.85rem",fontWeight:"bold",color:"#007bff"},children:"RESUMEN DE INGRESOS"})}),e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"4px 10px 4px 20px",fontSize:"0.9rem"},children:"(+) Ventas Netas (Ventas + Abonos - Devoluciones)"}),e.jsx("td",{className:"text-right",style:{padding:"4px 10px",fontSize:"0.9rem"},children:h($)})]}),y>0&&e.jsxs("tr",{children:[e.jsxs("td",{style:{padding:"4px 10px 4px 20px",fontSize:"0.85rem",color:"#856404"},children:["    (Devoluciones/Cancel. ya descontadas: ",h(y),")"]}),e.jsx("td",{})]}),e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"4px 10px 4px 20px",fontSize:"0.9rem",color:"#dc3545"},children:"(-) Tarjetas / Transf / Crédito"}),e.jsxs("td",{className:"text-right",style:{padding:"4px 10px",fontSize:"0.9rem",color:"#dc3545"},children:["- ",h(Z)]})]}),O>0&&e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"2px 10px 2px 35px",fontSize:"0.82rem",color:"#6c757d"},children:"💳 Tarjeta"}),e.jsx("td",{className:"text-right",style:{padding:"2px 10px",fontSize:"0.82rem",color:"#6c757d"},children:h(O)})]}),W>0&&e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"2px 10px 2px 35px",fontSize:"0.82rem",color:"#6c757d"},children:"🏦 Transferencia"}),e.jsx("td",{className:"text-right",style:{padding:"2px 10px",fontSize:"0.82rem",color:"#6c757d"},children:h(W)})]}),re>0&&e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"2px 10px 2px 35px",fontSize:"0.82rem",color:"#6c757d"},children:"📋 Crédito"}),e.jsx("td",{className:"text-right",style:{padding:"2px 10px",fontSize:"0.82rem",color:"#6c757d"},children:h(re)})]}),D.length>0&&e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"4px 10px 4px 20px",fontSize:"0.9rem",color:"#28a745"},children:"(+) Entradas de Efectivo"}),e.jsxs("td",{className:"text-right",style:{padding:"4px 10px",fontSize:"0.9rem",color:"#28a745"},children:["+ ",h(D.reduce((d,u)=>d+Math.abs(u.displayAmount||0),0))]})]}),e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"4px 10px 4px 20px",fontSize:"0.9rem",color:"#dc3545"},children:"(-) Salidas de Efectivo"}),e.jsxs("td",{className:"text-right",style:{padding:"4px 10px",fontSize:"0.9rem",color:"#dc3545"},children:["- ",h(P.reduce((d,u)=>d+Math.abs(u.displayAmount||0),0))]})]}),e.jsxs("tr",{style:{borderBottom:"1px solid #f1f1f1",background:"#e8f5e9"},children:[e.jsx("td",{style:{padding:10,fontWeight:"bold",fontSize:"1.1rem"},children:"Esperado en Caja"}),e.jsx("td",{className:"text-right",style:{padding:10,fontWeight:"bold",fontSize:"1.1rem",color:"#146c43"},children:h(U)})]})]})})]}),(V.length>0||D.length>0||P.length>0)&&e.jsxs("div",{style:{background:"#fff",padding:20,borderRadius:8,boxShadow:"0 2px 10px rgba(0,0,0,0.05)"},children:[e.jsx("h4",{style:{margin:"0 0 15px",borderBottom:"1px solid #eee",paddingBottom:10},children:"Detalle de Movimientos"}),D.length>0&&e.jsxs("div",{style:{marginBottom:15},children:[e.jsx("h5",{style:{color:"#28a745",margin:"0 0 5px"},children:"Entradas de Caja"}),D.map((d,u)=>e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px dashed #eee"},children:[e.jsx("div",{children:d.note||"Entrada Varia"}),e.jsxs("div",{style:{fontWeight:"bold",color:"#28a745"},children:["+ ",h(Math.abs(d.amount))]})]},u))]}),V.length>0&&e.jsxs("div",{style:{marginBottom:15},children:[e.jsx("h5",{style:{color:"#007bff",margin:"0 0 5px"},children:"Abonos Recibidos"}),V.map((d,u)=>e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px dashed #eee"},children:[e.jsxs("div",{children:[e.jsx("strong",{children:d.resolvedClientName||"Cliente General"}),e.jsx("div",{style:{fontSize:"0.8rem",color:"#666"},children:d.note||"Abono de cuenta"})]}),e.jsxs("div",{style:{fontWeight:"bold",color:"#28a745"},children:["+ ",h(d.amount)]})]},u))]}),P.length>0&&e.jsxs("div",{children:[e.jsx("h5",{style:{color:"#dc3545",margin:"0 0 5px"},children:"Salidas de Caja"}),P.map((d,u)=>e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px dashed #eee"},children:[e.jsx("div",{children:d.note||"Salida Varia"}),e.jsx("div",{style:{fontWeight:"bold",color:"#dc3545"},children:h(Math.abs(d.amount))})]},u))]})]})]}),e.jsx("div",{style:{display:"none"},children:e.jsxs(bt,{id:"print-wrapper-caja",className:"print-80",children:[e.jsxs("div",{className:"brand",children:[e.jsx("img",{src:"/icons/logo.png",alt:"Logo",style:{filter:"grayscale(100%) contrast(150%)"}}),e.jsx("h2",{children:"CIERRE DE CAJA"}),e.jsx("p",{children:"Multirepuestos RG"}),e.jsx("p",{children:new Date().toLocaleString("es-NI")}),e.jsxs("p",{children:["Cajero: ",N]})]}),e.jsxs("div",{className:"section",children:[e.jsx("div",{className:"section-title",children:"1. VENTAS NETAS"}),e.jsxs("div",{className:"row big",children:[e.jsx("span",{children:"TOTAL NETO:"}),e.jsx("span",{children:h($)})]}),e.jsx("div",{className:"row sub",children:"(Ventas + Abonos - Devoluciones/Cancelaciones)"}),y>0&&e.jsxs("div",{className:"row sub",style:{color:"#856404"},children:["(Devol./Cancel.: -",h(y),")"]})]}),e.jsxs("div",{className:"section",children:[e.jsx("div",{className:"section-title",children:"2. DESGLOSE NO EFECTIVO"}),O>0&&e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"(-) Tarjetas:"}),e.jsx("span",{children:h(O)})]}),W>0&&e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"(-) Transf.:"}),e.jsx("span",{children:h(W)})]}),re>0&&e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"(-) Créditos:"}),e.jsx("span",{children:h(re)})]}),e.jsxs("div",{className:"row",style:{borderTop:"1px dashed #000"},children:[e.jsx("span",{children:"TOTAL NO EFECTIVO:"}),e.jsx("span",{children:h(Z)})]})]}),e.jsxs("div",{className:"section",children:[e.jsx("div",{className:"section-title",children:"3. FLUJO EFECTIVO (RESUMEN)"}),e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"Fondo Inicial:"}),e.jsx("span",{children:h(j)})]}),e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"(+) Ventas Netas:"}),e.jsx("span",{children:h($)})]}),e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"(-) No Efectivo:"}),e.jsxs("span",{children:["-",h(Z)]})]}),Math.abs(P.reduce((d,u)=>d+Math.abs(u.displayAmount||0),0))>0&&e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"(-) Salidas:"}),e.jsxs("span",{children:["-",h(P.reduce((d,u)=>d+Math.abs(u.displayAmount||0),0))]})]})]}),e.jsxs("div",{className:"section",children:[e.jsx("div",{className:"section-title",children:"4. ARQUEO FINAL"}),e.jsxs("div",{className:"row big",children:[e.jsx("span",{children:"EFECTIVO ESPERADO:"}),e.jsx("span",{children:h(U)})]}),e.jsxs("div",{className:"row sub",children:["(",h(q)," + ",ae(pe),")"]}),e.jsxs("div",{className:"row",style:{marginTop:8,paddingTop:4,borderTop:"1px dashed #ccc"},children:[e.jsx("span",{children:"EFECTIVO REAL:"}),e.jsx("span",{children:h(t)})]}),e.jsxs("div",{className:"row alert",style:{color:"#000",borderColor:"#000"},children:[e.jsx("span",{children:"DIFERENCIA:"}),e.jsxs("span",{children:[F>0?"+":"",h(F)]})]}),e.jsx("div",{style:{textAlign:"center",fontSize:"0.75rem",fontWeight:"bold",marginTop:2},children:Math.abs(F)<.5?"(CAJA CUADRADA)":F>0?"(SOBRANTE)":"(FALTANTE)"})]}),e.jsxs("div",{className:"section",children:[e.jsx("div",{className:"section-title",children:"5. DETALLE DE MOVIMIENTOS"}),e.jsx("table",{style:{marginTop:0},children:e.jsxs("tbody",{children:[V.length>0&&e.jsxs(e.Fragment,{children:[e.jsx("tr",{children:e.jsx("td",{colSpan:"2",style:{fontWeight:"900",background:"#f8f9fa",fontSize:"0.9rem"},children:"--- ABONOS Y CREDITOS ---"})}),V.map((d,u)=>e.jsxs("tr",{children:[e.jsxs("td",{style:{fontSize:"0.9rem"},children:[d.resolvedClientName||d.note||"Abono"," ",e.jsx("br",{}),e.jsxs("span",{style:{fontSize:"0.75rem",color:"#555"},children:["#",d.id]})]}),e.jsx("td",{className:"text-right",style:{fontSize:"0.9rem"},children:h(d.amount)})]},"a"+u))]}),P.length>0&&e.jsxs(e.Fragment,{children:[e.jsx("tr",{children:e.jsx("td",{colSpan:"2",style:{fontWeight:"900",background:"#f8f9fa",fontSize:"0.9rem",paddingTop:8},children:"--- SALIDAS DE EFECTIVO ---"})}),P.map((d,u)=>e.jsxs("tr",{children:[e.jsx("td",{style:{fontSize:"0.9rem"},children:d.note||"Salida Varia"}),e.jsx("td",{className:"text-right",style:{fontSize:"0.9rem"},children:h(Math.abs(d.amount))})]},"s"+u))]}),D.length>0&&e.jsxs(e.Fragment,{children:[e.jsx("tr",{children:e.jsx("td",{colSpan:"2",style:{fontWeight:"900",background:"#f8f9fa",fontSize:"0.9rem",paddingTop:8},children:"--- ENTRADAS DE EFECTIVO ---"})}),D.map((d,u)=>e.jsxs("tr",{children:[e.jsx("td",{style:{fontSize:"0.9rem"},children:d.note||"Entrada Varia"}),e.jsx("td",{className:"text-right",style:{fontSize:"0.9rem"},children:h(d.amount)})]},"e"+u))]})]})}),V.length===0&&P.length===0&&D.length===0&&e.jsx("div",{style:{textAlign:"center",fontStyle:"italic",fontSize:"0.8rem",padding:5},children:"Sin movimientos extra"})]}),e.jsxs("div",{className:"signature",children:[e.jsx("div",{className:"signature-line"}),e.jsx("p",{children:"Firma Responsable"})]})]})}),e.jsxs("div",{style:{padding:"20px",background:"#fff",borderTop:"1px solid #ccc",display:"flex",gap:10,justifyContent:"flex-end"},children:[e.jsx(k,{$cancel:!0,onClick:()=>o(!1),children:"Seguir Editando"}),e.jsxs(k,{primary:!0,style:{padding:"12px 24px",fontSize:"1rem",display:"flex",alignItems:"center",gap:8},onClick:ye,disabled:!R,children:[e.jsx(Me,{})," IMPRIMIR Y CERRAR CAJA"]})]}),!R&&e.jsx("div",{style:{padding:5,textAlign:"center",color:"red",fontSize:"0.8rem"},children:"Solo el Admin o quien abrió puede cerrar."})]}):e.jsxs("div",{children:[e.jsx("h3",{style:{color:"#dc3545",borderBottom:"2px solid #dc3545",paddingBottom:10},children:"Arqueo y Cierre"}),e.jsx("div",{style:{background:"#e9ecef",padding:10,borderRadius:6,marginBottom:15},children:e.jsxs(L,{style:{fontSize:"1.1rem"},children:[e.jsxs("span",{children:[e.jsx(He,{})," Abrió:"]}),e.jsx("strong",{children:N})]})}),e.jsxs("div",{style:{marginTop:8,padding:"15px",backgroundColor:"#f8f9fa",borderRadius:6,border:"1px dashed #ced4da"},children:[e.jsx("div",{style:{fontWeight:"800",marginBottom:10,fontSize:"1.2rem",color:"#495057"},children:"Efectivo a Tener:"}),e.jsxs(L,{style:{fontSize:"1.3rem"},children:[e.jsx("span",{children:"Córdobas:"}),e.jsxs("strong",{style:{color:"#198754"},children:["C$ ",Number(q).toLocaleString()]})]}),e.jsxs(L,{style:{fontSize:"1.3rem"},children:[e.jsx("span",{children:"Dólares:"}),e.jsxs("strong",{style:{color:"#198754"},children:["$ ",Number(pe).toLocaleString()]})]}),e.jsxs(L,{$bold:!0,style:{marginTop:10,borderTop:"2px solid #ccc",paddingTop:10,fontSize:"1.5rem"},children:[e.jsx("span",{children:"TOTAL (C$):"}),e.jsx("span",{children:h(U)})]})]}),Z>0&&e.jsxs("div",{style:{marginTop:12,padding:"12px 15px",backgroundColor:"#fff3cd",borderRadius:6,border:"1px solid #ffc107"},children:[e.jsx("div",{style:{fontWeight:"800",marginBottom:8,fontSize:"1rem",color:"#856404"},children:"Desglose No Efectivo:"}),O>0&&e.jsxs(L,{style:{fontSize:"1.1rem"},children:[e.jsx("span",{children:"💳 Tarjeta:"}),e.jsx("strong",{children:h(O)})]}),W>0&&e.jsxs(L,{style:{fontSize:"1.1rem"},children:[e.jsx("span",{children:"🏦 Transferencia:"}),e.jsx("strong",{children:h(W)})]}),re>0&&e.jsxs(L,{style:{fontSize:"1.1rem"},children:[e.jsx("span",{children:"📋 Crédito:"}),e.jsx("strong",{children:h(re)})]}),e.jsxs(L,{$bold:!0,style:{marginTop:6,borderTop:"1px dashed #856404",paddingTop:6,fontSize:"1.15rem",color:"#856404"},children:[e.jsx("span",{children:"Total No Efectivo:"}),e.jsx("span",{children:h(Z)})]})]}),e.jsx("label",{style:{display:"block",marginTop:20,fontWeight:800,fontSize:"1.3rem"},children:"Monto Contado Físico (C$)"}),e.jsx(A,{type:"number",step:"0.01",value:t,onChange:d=>f(d.target.value),autoFocus:!0,placeholder:"Total Billetes + Monedas",style:{fontSize:"1.5rem",padding:"12px",height:"auto"}}),t&&e.jsxs(L,{$bold:!0,style:{marginTop:15,color:F!==0?"#dc3545":"#28a745",fontSize:"1.8rem",padding:"10px",background:F!==0?"#fff5f5":"#f0fff4",borderRadius:8,border:`2px solid ${F!==0?"#dc3545":"#28a745"}`},children:[e.jsx("span",{children:"Diferencia:"}),e.jsx("span",{children:h(F)})]}),e.jsxs("div",{style:{display:"flex",gap:10,marginTop:20},children:[e.jsx(k,{primary:!0,style:{flex:1},onClick:ne,disabled:!R||!t,children:"Ver Reporte"}),e.jsx(k,{$cancel:!0,onClick:C,children:"Cancelar"})]})]}):e.jsxs("div",{style:{padding:n?"1rem":0},children:[e.jsxs("h3",{style:{color:"#28a745",borderBottom:"2px solid #28a745",paddingBottom:10},children:[e.jsx(Ue,{})," Abrir Caja"]}),e.jsxs("div",{style:{display:"grid",gap:12},children:[e.jsx("label",{style:{fontWeight:600},children:"Monto Inicial (C$)"}),e.jsx(A,{type:"number",step:"0.01",value:S,onChange:d=>M(d.target.value),autoFocus:!0}),e.jsx("label",{style:{fontWeight:600},children:"Tasa del Dólar"}),e.jsx(A,{type:"number",step:"0.01",value:m,onChange:d=>T(d.target.value)})]}),e.jsxs("div",{style:{marginTop:20,display:"flex",gap:10},children:[e.jsx(k,{primary:!0,style:{flex:1},onClick:K,children:"Abrir Caja"}),e.jsx(k,{onClick:()=>g("/dashboard"),children:"Ir al Dashboard"})]})]})]})]})},ge=r=>{const b=parseFloat(r);return Number.isNaN(b)||Math.abs(b)<.001?0:b},Et=({total:r=0,tasaDolar:b=1,onClose:a,onFinishSale:v,clientes:I=[],empleados:C=[],users:p=[],showAlert:c,initialClientId:w="0",cartSnapshot:x=[],currentUserId:E=void 0,orderSubtotal:S=void 0,orderDiscountAmount:M=void 0})=>{const[m,T]=l.useState("0.00"),[t,f]=l.useState("0.00"),[n,o]=l.useState("0.00"),[g,i]=l.useState("0.00"),[N,R]=l.useState(""),[B,G]=l.useState(""),[j,J]=l.useState("contado"),[X,U]=l.useState(w??"0"),[q,pe]=l.useState(""),[$,O]=l.useState(!1),[W,re]=l.useState(!1),Z=l.useMemo(()=>{const s=parseInt(X,10);return Number.isNaN(s)?0:s},[X]),y=Z!==0,de=l.useMemo(()=>ge(m),[m]),te=l.useMemo(()=>ge(t),[t]),be=l.useMemo(()=>ge(n),[n]),Y=l.useMemo(()=>ge(g),[g]),ie=l.useMemo(()=>be*Number(b||1),[be,b]),D=l.useMemo(()=>de+te+Y+ie,[de,te,Y,ie]),P=l.useMemo(()=>te>.01,[te]),V=l.useMemo(()=>Number(r)-D,[r,D]),F=l.useMemo(()=>j==="credito"&&y&&V>.01?V:(D>=Number(r)-1e-4,0),[j,y,V,D,r]),K=l.useMemo(()=>{const s=ge(V);return s<=.01||j==="credito"&&y?0:s},[V,j,y]),ne=l.useMemo(()=>Math.max(0,-V),[V]),Q=l.useMemo(()=>F>.01?D>.01?"mixto":"credito_total":"contado",[F,D]),ye=l.useMemo(()=>{if(K>.01)return"PAGO INCOMPLETO";if((Q==="mixto"||Q==="credito_total")&&!y)return"CLIENTE NO SELECCIONADO";switch(Q){case"mixto":return"PAGO MIXTO (Contado + Crédito)";case"credito_total":return"CRÉDITO TOTAL";default:return"CONTADO"}},[Q,K,y]),h=l.useMemo(()=>j==="credito"&&!y,[j,y]),ae=l.useMemo(()=>$||K>.01||(Q==="mixto"||Q==="credito_total")&&!y||P&&!N.trim()||Y>.01&&!B.trim(),[$,K,Q,y,P,N,Y,B]),me=l.useMemo(()=>Array.isArray(x)?x.map(({raw:s,costo:H,existencia:fe,..._})=>({id:_.id||_.id_producto,nombre:_.nombre??_.descripcion??_.producto??"",quantity:Number(_.quantity||0),precio:Number(_.precio_venta??_.precio??0)})).filter(s=>s.quantity>0):[],[x]),xe=l.useMemo(()=>typeof S=="number"?Number(S):me.reduce((s,H)=>s+Number(H.precio||0)*Number(H.quantity||0),0),[S,me]);l.useMemo(()=>{if(typeof M=="number")return Number(M);const s=Number(xe)-Number(r);return s>0?s:0},[M,xe,r]),l.useEffect(()=>{j==="contado"&&D===0&&Number(r)>0&&T(Number(r).toFixed(2)),j==="credito"&&!y&&U("0")},[j,r]);const d=l.useCallback(s=>{const H=String(s.target.value);U(H),(parseInt(H,10)||0)!==0&&(J("contado"),D<Number(r)&&D===0&&T(Number(r).toFixed(2)))},[D,r]),u=l.useCallback(()=>{J("contado");const s=te+Y+ie,H=Math.max(0,Number(r)-s);T(Number(H).toFixed(2))},[te,Y,ie,r]),se=l.useCallback(()=>{if(!y){c==null||c({title:"Cliente Requerido",message:"Debe seleccionar un cliente para habilitar la opción de Crédito.",type:"error"});return}J("credito"),T("0.00"),f("0.00"),o("0.00"),i("0.00"),R(""),G("")},[y,c]),ee=l.useCallback(()=>{T(Number(r).toFixed(2)),f("0.00"),o("0.00"),i("0.00"),R(""),G(""),J("contado")},[r]),De=({efectivo:s,tarjeta:H,transferencia:fe,dolaresLocal:_,credito:Ne})=>{const we=s+H+fe+_>.01;return Ne&&we?"mixto":Ne&&!we?"credito_total":"contado"},Ce=async s=>{if(!y||Z===0){c==null||c({title:"Cliente Requerido",message:"No puedes vender sin seleccionar un cliente. Por favor selecciona uno.",type:"error"});return}if((Q==="credito_total"||Q==="mixto")&&Z===0){c==null||c({title:"Cliente Requerido",message:"Debe seleccionar un cliente para ventas a crédito o mixtas.",type:"error"});return}if(K>.01){c==null||c({title:"Pago Incompleto",message:`Faltan C$${K.toFixed(2)} para completar la venta.`,type:"warning"});return}if(P&&!N.trim()){c==null||c({title:"Dato Requerido",message:"Ingrese el número de referencia para el pago con tarjeta.",type:"warning"});return}if(Y>.01&&!B.trim()){c==null||c({title:"Dato Requerido",message:"Ingrese el número de referencia para la transferencia.",type:"warning"});return}if($)return;O(!0);const H=Math.max(0,de+ie-ne),fe={totalVenta:Number(r),efectivo:de,tarjeta:te,transferencia:Y,dolares:be,tasaDolarAlMomento:Number(b),referenciaTarjeta:N.trim(),referenciaTransferencia:B.trim(),credito:F,clienteId:Z,empleadoId:q||null,tipoVenta:De({efectivo:de,tarjeta:te,transferencia:Y,dolaresLocal:ie,credito:F}),cambio:Number(ne),ingresoCaja:Number(H),shouldPrintNow:s};try{typeof v=="function"&&await v(fe),a==null||a()}catch(_){c==null||c({title:"Error",message:(_==null?void 0:_.message)||"No se pudo completar la venta.",type:"error"})}finally{O(!1)}},ue=y?K>.01?"#dc3545":ne>.01?"#28a745":"#17a2b8":"#dc3545",Ae=y?K>.01?`¡FALTA CUBRIR! C$${K.toFixed(2)}`:ne>.01?`CAMBIO A ENTREGAR: C$${ne.toFixed(2)}`:"BALANCE PERFECTO":"¡SELECCIONA UN CLIENTE!";return e.jsx(ce,{children:e.jsxs(he,{style:{maxWidth:"950px",width:"96%",maxHeight:"90vh",overflow:"hidden",borderRadius:16,backgroundColor:"#f8f9fa",boxShadow:"0 25px 50px -12px rgba(0, 0, 0, 0.25)"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"2px solid #e9ecef",paddingBottom:15,marginBottom:20},children:[e.jsxs("h2",{style:{margin:0,color:"#1e293b",fontSize:"1.5rem",fontWeight:800},children:[e.jsx(Se,{style:{marginRight:"0.5rem",color:"#007bff"}})," PROCESAR PAGO"]}),e.jsx(k,{$cancel:!0,onClick:a,style:{borderRadius:"50%",width:40,height:40,padding:0,fontSize:"1.2rem",backgroundColor:"#fee2e2",color:"#ef4444",borderColor:"transparent"},children:e.jsx(ve,{})})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"5fr 4fr",gap:"2rem",height:"calc(90vh - 140px)"},children:[e.jsxs("div",{style:{paddingRight:10,borderRight:"1px solid #e2e8f0",overflowY:"auto",paddingBottom:10},children:[e.jsxs("div",{style:{padding:20,border:"1px solid #e2e8f0",borderRadius:12,backgroundColor:"#fff",marginBottom:20,boxShadow:"0 1px 3px rgba(0,0,0,0.05)"},children:[e.jsxs("h4",{style:{marginTop:0,color:"#334155",fontSize:"1rem",fontWeight:700,textTransform:"uppercase",marginBottom:15},children:[e.jsx(Je,{style:{marginRight:6}})," Tipo de Venta"]}),e.jsxs("div",{style:{display:"flex",gap:12,marginBottom:20},children:[e.jsx(k,{onClick:u,style:{flex:1,padding:"10px 0",backgroundColor:j==="contado"?"#0ea5e9":"#f1f5f9",color:j==="contado"?"#fff":"#475569",border:"none",borderRadius:8,fontWeight:"700",boxShadow:j==="contado"?"0 4px 6px -1px rgba(14, 165, 233, 0.4)":"none"},children:"CONTADO"}),e.jsx(k,{onClick:se,disabled:!y,style:{flex:1,padding:"10px 0",backgroundColor:j==="credito"?"#f59e0b":"#f1f5f9",color:j==="credito"?"#fff":"#475569",border:"none",borderRadius:8,fontWeight:"700",boxShadow:j==="credito"?"0 4px 6px -1px rgba(245, 158, 11, 0.4)":"none",opacity:y?1:.5},children:"CRÉDITO"})]}),e.jsxs("label",{style:{display:"block",fontWeight:"700",marginBottom:8,color:"#475569",fontSize:"0.9rem"},children:[e.jsx(Ye,{})," Seleccionar Cliente ",e.jsx("span",{style:{color:"#ef4444"},children:"* (Obligatorio)"})]}),e.jsxs(A,{as:"select",value:X,onChange:d,style:{height:42,padding:"0 12px",width:"100%",fontSize:"1rem",border:y?"2px solid #22c55e":"2px solid #ef4444",backgroundColor:y?"#f0fdf4":"#fef2f2",borderRadius:8},children:[e.jsx("option",{value:"0",children:"-- Seleccionar Cliente --"}),(I||[]).map(s=>e.jsxs("option",{value:s.id_cliente??s.id,children:[s.nombre,Number(s.saldo_pendiente||0)>0?` (Deuda: C$${Number(s.saldo_pendiente).toFixed(2)})`:""]},s.id_cliente??s.id))]}),!y&&e.jsxs("p",{style:{color:"#ef4444",margin:"8px 0 0",fontSize:"0.85rem",fontWeight:"600"},children:[e.jsx(ve,{style:{marginRight:4}})," No puedes vender sin seleccionar un cliente."]}),e.jsxs("div",{style:{marginTop:20},children:[e.jsxs("label",{style:{display:"block",fontWeight:"700",marginBottom:8,color:"#475569",fontSize:"0.9rem"},children:[e.jsx(Ke,{})," Atendido por (opcional):"]}),e.jsxs("select",{value:q,onChange:s=>pe(s.target.value),style:{width:"100%",padding:"10px 12px",fontSize:"1rem",borderRadius:8,border:"1px solid #cbd5e1",background:"#f8fafc",height:42},children:[e.jsx("option",{value:"",children:"-- Sin Empleado --"}),(C||[]).map(s=>e.jsx("option",{value:s.id_empleado,children:s.nombre},s.id_empleado))]})]})]}),e.jsxs("div",{style:{padding:20,border:"1px solid #e2e8f0",borderRadius:12,backgroundColor:"#fff",boxShadow:"0 1px 3px rgba(0,0,0,0.05)"},children:[e.jsx("h4",{style:{marginTop:0,color:"#334155",fontSize:"1rem",fontWeight:700,textTransform:"uppercase",borderBottom:"1px solid #f1f5f9",paddingBottom:10,marginBottom:15},children:"Desglose de Pago (C$)"}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"15px"},children:[e.jsxs("div",{children:[e.jsxs("label",{style:{display:"block",fontWeight:"600",fontSize:"0.85rem",marginBottom:6,color:"#64748b"},children:[e.jsx(Qe,{})," Efectivo"]}),e.jsx(A,{type:"number",step:"0.01",value:m,onChange:s=>T(s.target.value),style:{width:"100%",height:38,fontSize:"1rem",borderRadius:8,border:"1px solid #cbd5e1"},disabled:h})]}),e.jsxs("div",{children:[e.jsxs("label",{style:{display:"block",fontWeight:"600",fontSize:"0.85rem",marginBottom:6,color:"#64748b"},children:[e.jsx(Xe,{})," Dólares"]}),e.jsx(A,{type:"number",step:"0.01",value:n,onChange:s=>o(s.target.value),style:{width:"100%",height:38,fontSize:"1rem",borderRadius:8,border:"1px solid #cbd5e1"},disabled:h})]}),e.jsxs("div",{children:[e.jsxs("label",{style:{display:"block",fontWeight:"600",fontSize:"0.85rem",marginBottom:6,color:"#64748b"},children:[e.jsx(Se,{})," Tarjeta"]}),e.jsx(A,{type:"number",step:"0.01",value:t,onChange:s=>f(s.target.value),style:{width:"100%",height:38,fontSize:"1rem",borderRadius:8,border:"1px solid #cbd5e1"},disabled:h})]}),e.jsxs("div",{children:[e.jsxs("label",{style:{display:"block",fontWeight:"600",fontSize:"0.85rem",marginBottom:6,color:"#64748b"},children:[e.jsx(Ie,{})," Transferencia"]}),e.jsx(A,{type:"number",step:"0.01",value:g,onChange:s=>i(s.target.value),style:{width:"100%",height:38,fontSize:"1rem",borderRadius:8,border:"1px solid #cbd5e1"},disabled:h})]})]}),j==="credito"&&e.jsxs("div",{style:{marginTop:15,padding:12,backgroundColor:"#fff7ed",borderRadius:8,border:"1px dashed #f97316"},children:[e.jsxs("label",{style:{display:"block",fontWeight:"700",fontSize:"0.85rem",marginBottom:4,color:"#c2410c"},children:[e.jsx(Ze,{})," CRÉDITO GENERADO"]}),e.jsxs("div",{style:{fontSize:"1.2rem",color:"#ea580c",fontWeight:800},children:["C$ ",F.toFixed(2)]})]}),P&&e.jsxs("div",{style:{marginTop:15,padding:12,border:"1px solid #fcd34d",borderRadius:8,backgroundColor:"#fffbeb"},children:[e.jsxs("label",{style:{display:"block",fontWeight:"700",fontSize:"0.85rem",color:"#b45309",marginBottom:6},children:[e.jsx(Te,{})," Nº Referencia Tarjeta ",e.jsx("span",{style:{color:"#ef4444"},children:"*"})]}),e.jsx(A,{type:"text",placeholder:"Ej: 1234",value:N,onChange:s=>R(s.target.value),style:{width:"100%",height:36,fontSize:"0.95rem"}})]}),Y>.01&&e.jsxs("div",{style:{marginTop:15,padding:12,border:"1px solid #bae6fd",borderRadius:8,backgroundColor:"#f0f9ff"},children:[e.jsxs("label",{style:{display:"block",fontWeight:"700",fontSize:"0.85rem",color:"#0369a1",marginBottom:6},children:[e.jsx(Te,{})," Nº Referencia Transferencia ",e.jsx("span",{style:{color:"#ef4444"},children:"*"})]}),e.jsx(A,{type:"text",placeholder:"Ej: REF-5678",value:B,onChange:s=>G(s.target.value),style:{width:"100%",height:36,fontSize:"0.95rem"}})]}),j==="contado"&&e.jsxs(k,{info:!0,onClick:ee,style:{width:"100%",padding:"12px 0",marginTop:20,backgroundColor:"#e0f2fe",color:"#0284c7",border:"1px dashed #0ea5e9",fontSize:"0.95rem",fontWeight:600},children:[e.jsx(et,{})," Rellenar con Efectivo (Total: C$ ",Number(r).toFixed(2),")"]})]})]}),e.jsxs("div",{style:{paddingLeft:10,display:"flex",flexDirection:"column",justifyContent:"space-between",paddingBottom:10},children:[e.jsxs("div",{children:[e.jsxs(ke,{style:{marginBottom:15,padding:20,backgroundColor:"#f0f9ff",border:"none",borderRadius:12,boxShadow:"inset 0 2px 4px rgba(0,0,0,0.05)"},children:[e.jsxs(L,{$bold:!0,style:{fontSize:"1.8rem",color:"#0f172a",marginBottom:5},children:[e.jsx("span",{style:{fontSize:"1rem",color:"#64748b",fontWeight:600},children:"TOTAL A PAGAR"}),e.jsxs("span",{children:["C$ ",Number(r).toFixed(2)]})]}),e.jsxs(L,{style:{borderTop:"1px solid #cbd5e0",paddingTop:10,fontSize:"0.9rem",color:"#64748b"},children:[e.jsxs("span",{children:["Tasa USD: C$ ",Number(b).toFixed(2)]}),e.jsxs("span",{style:{color:"#0f172a",fontWeight:700},children:["$",(Number(r)/Number(b||1)).toFixed(2)," USD"]})]})]}),e.jsxs("div",{style:{padding:15,border:"1px solid #e2e8f0",borderRadius:12,marginBottom:15,backgroundColor:"#fff"},children:[e.jsxs(L,{style:{color:"#64748b",fontSize:"0.95rem",marginBottom:8},children:[e.jsx("span",{children:"Pagado (Contado)"}),e.jsxs("span",{style:{fontWeight:"700",color:"#1e293b"},children:["C$ ",D.toFixed(2)]})]}),e.jsxs(L,{style:{fontSize:"0.95rem"},children:[e.jsx("span",{children:"Estado"}),e.jsx("span",{style:{fontWeight:"700",color:F>.01?"#f59e0b":y?"#22c55e":"#ef4444"},children:ye})]})]}),e.jsxs(ke,{style:{marginBottom:10,padding:15,backgroundColor:ue==="#dc3545"?"#fef2f2":ue==="#28a745"?"#ecfccb":"#e0f2fe",color:ue==="#dc3545"?"#ef4444":ue==="#28a745"?"#4d7c0f":"#0369a1",fontWeight:"800",fontSize:"1.1rem",textAlign:"center",borderRadius:12,border:"none",boxShadow:"0 2px 4px rgba(0,0,0,0.05)"},children:[e.jsx(tt,{style:{marginRight:8}})," ",Ae]})]}),e.jsxs("div",{style:{marginTop:"auto",display:"flex",flexDirection:"column",gap:"12px"},children:[e.jsxs(k,{type:"button",onClick:s=>{s.preventDefault(),Ce(!0)},disabled:ae||!y,style:{width:"100%",padding:"16px 0",fontSize:"1.2rem",fontWeight:800,backgroundColor:ae||!y?"#cbd5e1":"#2563eb",color:"white",border:"none",borderRadius:10,boxShadow:ae||!y?"none":"0 4px 6px -1px rgba(37, 99, 235, 0.4)",transition:"all 0.2s"},children:[e.jsx(Me,{style:{marginRight:8}})," PAGAR E IMPRIMIR"]}),e.jsxs(k,{type:"button",onClick:s=>{s.preventDefault(),Ce(!1)},disabled:ae||!y,style:{width:"100%",padding:"12px 0",fontSize:"1rem",fontWeight:700,backgroundColor:"white",color:ae||!y?"#cbd5e1":"#475569",border:ae||!y?"1px solid #e2e8f0":"2px solid #cbd5e1",borderRadius:10,transition:"all 0.2s"},children:[e.jsx(at,{style:{marginRight:8}})," Solo Guardar (Sin Ticket)"]})]})]})]})]})})},ut=rt`
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
`,jt=oe.div`
  font-family: 'League Spartan', 'Inter', system-ui, -apple-system, sans-serif;
  color: #000;
  background: #fff;
  width: 310px;
  margin: 0 auto;
  padding: 14px 12px;
  box-shadow: 0 0 10px rgba(0,0,0,.08);
  border: 1px solid #eee;
  border-radius: 8px;

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
`,yt=oe.div`
  display: flex; flex-direction: column; gap: 12px;
`,vt=oe.img`
  width: 100px;
  height: 100px;
  object-fit: contain;
  display: block;
  border-radius: 6px;
  .print-a4 & { width: 130px; height: auto; }
`;oe.span`
  display: inline-flex; align-items: center; gap: 6px;
  font-weight: 700; letter-spacing: .4px; padding: 4px 8px;
  border-radius: 4px; font-size: 0.85rem;
  background: #e8f4ff; color: #0b72b9; border: 1px solid #b9defc;
  text-transform: uppercase;
`;const Ct=oe.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: .75rem;
`,Rt=({cart:r=[],total:b=0,subtotal:a=0,discount:v=0,proformaFor:I="",onClose:C,currentUser:p,client:c})=>{const{user:w}=typeof Ee=="function"?Ee():{user:null},{settings:x}=mt(),E=i=>(i==null?void 0:i.usuarioNombre)||(i==null?void 0:i.nombre_usuario)||(i==null?void 0:i.name)||(i==null?void 0:i.nombre)||(i==null?void 0:i.username)||null;let S=null;try{S=JSON.parse(localStorage.getItem("authUser")||"null")}catch{}const M=E(p)||E(w)||E(S)||"Cajero POS",m=(c==null?void 0:c.nombre)||"Consumidor Final",T=(c==null?void 0:c.cedula)||"",t=new Date().toLocaleString("es-NI"),f=i=>new Intl.NumberFormat("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(i||0)),n={name:(x==null?void 0:x.empresa_nombre)||"Multirepuestos RG",ruc:(x==null?void 0:x.empresa_ruc)||"1211812770001E",phone:(x==null?void 0:x.empresa_telefono)||"84031936 / 84058142",address:(x==null?void 0:x.empresa_direccion)||"Del portón de la normal 75 varas al este. Juigalpa, Chontales.",slogan:(x==null?void 0:x.empresa_eslogan)||"Tu mejor opción en repuestos",logo:(x==null?void 0:x.empresa_logo_url)||new URL("/icons/logo.png",window.location.origin).toString()},o=l.useCallback((i="80")=>{const N=document.getElementById("print-wrapper-proforma");if(!N)return;const R=N.outerHTML,G=`
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
        width: ${i==="A4"?"130px":"110px"} !important;
        height: ${i==="A4"?"auto":"110px"} !important;
        object-fit: contain !important;
      }

      ${i==="A4"?`
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
    `,j=window.open("","_blank","width=900,height=700");j&&(j.document.write(`<!DOCTYPE html><html><head><title>PROFORMA - ${n.name}</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"><style>${G}</style></head><body>${R}</body></html>`),j.document.close(),j.focus(),j.onload=function(){setTimeout(()=>{j.print(),setTimeout(()=>{j.close(),C&&C()},500)},400)})},[n,C]),g=r.length<=2;return e.jsxs(ce,{className:"no-print",children:[e.jsx(ut,{}),e.jsxs(he,{className:"no-print",style:{maxWidth:520,width:"96%",padding:"1.2rem",background:"#fff"},children:[e.jsxs(Ct,{children:[e.jsxs("h2",{style:{display:"flex",alignItems:"center",gap:8,margin:0},children:[e.jsx(ot,{})," Vista Cotización / Proforma"]}),e.jsxs("div",{style:{display:"flex",gap:8},children:[e.jsx(k,{onClick:()=>o("80"),children:"Ticket 80mm"}),e.jsxs(k,{onClick:()=>o("A4"),children:[e.jsx(ze,{})," A4"]}),e.jsx(k,{$cancel:!0,onClick:C,children:e.jsx(ve,{})})]})]}),e.jsx(yt,{children:e.jsxs(jt,{id:"print-wrapper-proforma",className:`print-area print-80 ${g?"compact":""}`,children:[e.jsxs("div",{className:"brand",children:[e.jsx("div",{className:"brand-logo-container",children:e.jsx(vt,{src:n.logo,alt:"Logo",onError:i=>{i.currentTarget.style.display="none"}})}),e.jsxs("div",{className:"brand-info",children:[e.jsx("h1",{children:n.name}),e.jsx("small",{children:n.slogan}),e.jsxs("small",{children:["RUC: ",n.ruc]}),e.jsxs("small",{children:["Tel: ",n.phone]}),e.jsx("small",{children:n.address}),e.jsx("div",{style:{marginTop:6},children:e.jsxs("span",{className:"proforma-tag",children:[e.jsx(ze,{style:{marginRight:4,verticalAlign:"middle"}})," COTIZACIÓN / PROFORMA"]})})]})]}),e.jsxs("div",{className:"meta",children:[e.jsxs("div",{className:"meta-col",children:[e.jsx("span",{className:"meta-title",children:"Detalles"}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Fecha:"}),e.jsx("span",{className:"meta-value",children:t})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"ID Temp:"}),e.jsx("span",{className:"meta-value",children:Date.now().toString().slice(-6)})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Atendido por:"}),e.jsx("span",{className:"meta-value",children:M})]})]}),e.jsxs("div",{className:"meta-col",children:[e.jsx("span",{className:"meta-title",children:"Cliente"}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Nombre:"}),e.jsx("span",{className:"meta-value",children:I||m})]}),T&&e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Cédula:"}),e.jsx("span",{className:"meta-value",children:T})]})]})]}),e.jsxs("table",{className:"items",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{className:"col-qty",children:"Cant."}),e.jsx("th",{children:"Descripción"}),e.jsx("th",{className:"text-right col-unit",children:"P. Unit."}),e.jsx("th",{className:"text-right col-total",children:"Total"})]})}),e.jsx("tbody",{children:r.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:"4",style:{textAlign:"center",color:"#777"},children:"Sin ítems"})}):r.map((i,N)=>{const R=Number(i.precio_venta??i.precio??0),B=Number(i.quantity??0),G=R*B;return e.jsxs("tr",{children:[e.jsx("td",{className:"col-qty",children:B}),e.jsx("td",{children:i.nombre||i.descripcion||"Item"}),e.jsxs("td",{className:"text-right col-unit",children:["C$",f(R)]}),e.jsxs("td",{className:"text-right col-total",children:["C$",f(G)]})]},N)})})]}),e.jsx("div",{className:"totals",children:e.jsxs("div",{className:"totals-box",children:[e.jsxs(L,{children:[e.jsx("span",{children:"Subtotal:"}),e.jsxs("span",{children:["C$",f(a)]})]}),v>0&&e.jsxs(L,{style:{color:"#dc3545"},children:[e.jsx("span",{children:"Descuento:"}),e.jsxs("span",{children:["- C$",f(v)]})]}),e.jsxs(L,{className:"grand-total",style:{fontWeight:"bold",fontSize:"1.2rem",marginTop:5,borderTop:"2px solid black"},children:[e.jsx("span",{children:"TOTAL:"}),e.jsxs("span",{children:["C$",f(b)]})]}),e.jsxs("div",{style:{marginTop:12,textAlign:"center"},children:[e.jsx("span",{className:"badge",children:"DOCUMENTO NO VÁLIDO COMO FACTURA"}),e.jsx("p",{style:{margin:"5px 0 0",fontSize:"0.72rem",color:"#666"},children:"Precios sujetos a cambio. Válido por 3 días."})]})]})}),e.jsxs("div",{className:"thanks",children:[e.jsxs("p",{children:['"',n.slogan,'"']}),e.jsx("p",{style:{whiteSpace:"pre-line",marginTop:"5px"},children:(x==null?void 0:x.ticket_proforma_footer)||"¡Gracias por cotizar con nosotros!"})]})]})})]})]})},Ft=({isOpen:r,onClose:b,onConfirm:a,onSubmit:v,title:I,message:C,fields:p=[],inputType:c="number",icon:w})=>{const[x,E]=l.useState({}),[S,M]=l.useState("");if(l.useEffect(()=>{if(r)if(p.length>0){const t={};p.forEach(f=>{t[f.name]=f.defaultValue!==void 0?f.defaultValue:""}),E(t)}else M("")},[r,p]),!r)return null;const m=()=>{p.length>0?v?v(x):a&&a(x):v?v(S):a&&a(S)},T=(t,f)=>{E(n=>({...n,[t]:f}))};return e.jsx(ce,{children:e.jsxs(he,{style:{maxWidth:"450px"},children:[e.jsxs("div",{style:{textAlign:"center",marginBottom:"1.5rem"},children:[w?e.jsx("div",{style:{fontSize:"2.5rem",marginBottom:"1rem"},children:w}):e.jsx(it,{size:"2.5em",color:"#007bff"}),e.jsx("h2",{style:{marginTop:"0.5rem",marginBottom:"0.5rem"},children:I}),C&&e.jsx("p",{style:{color:"#6c757d"},children:C})]}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:p.length>0?p.map(t=>e.jsxs("div",{children:[t.label&&e.jsx("label",{style:{display:"block",marginBottom:"5px",fontWeight:600,fontSize:"0.9rem"},children:t.label}),t.type==="select"?e.jsx("select",{value:x[t.name],onChange:f=>T(t.name,f.target.value),style:{width:"100%",padding:"10px",borderRadius:"8px",border:"1px solid #ccc",fontSize:"1rem"},children:t.options&&t.options.map(f=>e.jsx("option",{value:f.value,children:f.label},f.value))}):e.jsx(A,{type:t.type||"text",placeholder:t.placeholder||"",value:x[t.name],onChange:f=>T(t.name,f.target.value),autoFocus:t.name===p[0].name})]},t.name)):e.jsx(A,{type:c,value:S,onChange:t=>M(t.target.value),autoFocus:!0})}),e.jsxs("div",{style:{display:"flex",justifyContent:"flex-end",gap:"1rem",marginTop:"2rem"},children:[e.jsx(k,{onClick:b,style:{backgroundColor:"#6c757d"},children:"Cancelar"}),e.jsx(k,{onClick:m,primary:!0,children:"Aceptar"})]})]})})},le=oe.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 6px;
  
  label { font-weight: bold; color: #495057; }
  input { width: 120px; text-align: right; }
`,It=({isOpen:r,onClose:b,currentStats:a,onConfirm:v})=>{const[I,C]=l.useState("manual"),[p,c]=l.useState({efectivo:"",credito:"",tarjeta:"",dolares:"",ventas_totales:""}),[w,x]=l.useState({cordobas:"",dolares:"",ventas_totales:""}),E=(m,T)=>{c(t=>({...t,[m]:T}))},S=(m,T)=>{x(t=>({...t,[m]:T}))},M=()=>{const m=[];if(I==="manual")parseFloat(p.efectivo)&&m.push({target:"efectivo",amount:parseFloat(p.efectivo)}),parseFloat(p.credito)&&m.push({target:"credito",amount:parseFloat(p.credito)}),parseFloat(p.tarjeta)&&m.push({target:"tarjeta",amount:parseFloat(p.tarjeta)}),parseFloat(p.ventas_totales)&&m.push({target:"ventas_totales",amount:parseFloat(p.ventas_totales)});else{const T=parseFloat(w.cordobas),t=parseFloat(w.dolares),f=parseFloat(w.ventas_totales);if(!isNaN(T)){const n=Number((a==null?void 0:a.netCordobas)||0),o=T-n;Math.abs(o)>.01&&m.push({target:"efectivo",amount:o})}if(!isNaN(t)){const n=Number((a==null?void 0:a.netDolares)||0),o=t-n;Math.abs(o)>.01&&m.push({target:"dolares",amount:o})}if(!isNaN(f)){const n=Number((a==null?void 0:a.totalVentasDia)||0),o=f-n;Math.abs(o)>.01&&m.push({target:"ventas_totales",amount:o})}}m.length>0&&v(m),b()};return r?e.jsx(ce,{style:{background:"rgba(0,0,0,0.95)",zIndex:9999},children:e.jsxs(he,{style:{maxWidth:"450px",background:"#212529",color:"#fff",border:"1px solid #495057",maxHeight:"90vh",overflowY:"auto"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20},children:[e.jsxs("h2",{style:{margin:0,color:"#ffc107",display:"flex",alignItems:"center",gap:10},children:[e.jsx(nt,{})," GOD MODE"]}),e.jsx(k,{$cancel:!0,onClick:b,style:{background:"transparent",color:"#6c757d",border:"none"},children:"✕"})]}),e.jsxs("div",{style:{display:"flex",gap:10,marginBottom:20},children:[e.jsx(k,{onClick:()=>C("manual"),style:{flex:1,background:I==="manual"?"#ffc107":"#343a40",color:I==="manual"?"#000":"#fff",border:"none"},children:"Ajuste Manual (+/-)"}),e.jsx(k,{onClick:()=>C("override"),style:{flex:1,background:I==="override"?"#ffc107":"#343a40",color:I==="override"?"#000":"#fff",border:"none"},children:"Fijar Monto (=)"})]}),I==="manual"?e.jsxs(e.Fragment,{children:[e.jsx("p",{style:{color:"#adb5bd",fontSize:"0.85rem",marginBottom:15},children:"Suma o resta cantidades a los contadores ocultamente."}),e.jsxs(le,{style:{background:"#343a40"},children:[e.jsx("label",{style:{color:"#fff"},children:"Efectivo (C$)"}),e.jsx(A,{type:"number",step:"0.01",placeholder:"+/- 0.00",value:p.efectivo,onChange:m=>E("efectivo",m.target.value),style:{background:"#495057",color:"#fff"}})]}),e.jsxs(le,{style:{background:"#343a40"},children:[e.jsx("label",{style:{color:"#fff"},children:"Crédito"}),e.jsx(A,{type:"number",step:"0.01",placeholder:"+/- 0.00",value:p.credito,onChange:m=>E("credito",m.target.value),style:{background:"#495057",color:"#fff"}})]}),e.jsxs(le,{style:{background:"#343a40"},children:[e.jsx("label",{style:{color:"#fff"},children:"Tarjeta"}),e.jsx(A,{type:"number",step:"0.01",placeholder:"+/- 0.00",value:p.tarjeta,onChange:m=>E("tarjeta",m.target.value),style:{background:"#495057",color:"#fff"}})]}),e.jsxs(le,{style:{background:"#2a1a00",border:"1px solid #ffc107"},children:[e.jsx("label",{style:{color:"#ffc107"},children:"Ventas Totales"}),e.jsx(A,{type:"number",step:"0.01",placeholder:"+/- 0.00",value:p.ventas_totales,onChange:m=>E("ventas_totales",m.target.value),style:{background:"#495057",color:"#ffc107",border:"1px solid #ffc107"}})]})]}):e.jsxs(e.Fragment,{children:[e.jsx("p",{style:{color:"#adb5bd",fontSize:"0.85rem",marginBottom:15},children:"Define EXACTAMENTE cuánto dinero físico hay. El sistema creará un ajuste mágico para cuadrar."}),e.jsxs("div",{style:{background:"#343a40",padding:10,borderRadius:6,marginBottom:10},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",color:"#aaa",marginBottom:5},children:[e.jsx("span",{children:"Sistema Actual:"}),e.jsxs("span",{children:["C$ ",Number((a==null?void 0:a.netCordobas)||0).toFixed(2)]})]}),e.jsxs(le,{style:{background:"transparent",padding:0,marginBottom:0},children:[e.jsx("label",{style:{color:"#fff"},children:"Real en Caja (C$)"}),e.jsx(A,{type:"number",step:"0.01",placeholder:"0.00",value:w.cordobas,onChange:m=>S("cordobas",m.target.value),style:{background:"#495057",color:"#fff",border:"1px solid #ffc107"}})]})]}),e.jsxs("div",{style:{background:"#343a40",padding:10,borderRadius:6},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",color:"#aaa",marginBottom:5},children:[e.jsx("span",{children:"Sistema Actual:"}),e.jsxs("span",{children:["$ ",Number((a==null?void 0:a.netDolares)||0).toFixed(2)]})]}),e.jsxs(le,{style:{background:"transparent",padding:0,marginBottom:0},children:[e.jsx("label",{style:{color:"#fff"},children:"Real en Caja ($)"}),e.jsx(A,{type:"number",step:"0.01",placeholder:"0.00",value:w.dolares,onChange:m=>S("dolares",m.target.value),style:{background:"#495057",color:"#fff",border:"1px solid #ffc107"}})]})]}),e.jsxs("div",{style:{background:"#2a1a00",padding:10,borderRadius:6,border:"1px solid #ffc107",marginTop:10},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",color:"#ffc107",marginBottom:5},children:[e.jsx("span",{children:"Sistema Actual:"}),e.jsxs("span",{children:["C$ ",Number((a==null?void 0:a.totalVentasDia)||0).toFixed(2)]})]}),e.jsxs(le,{style:{background:"transparent",padding:0,marginBottom:0},children:[e.jsx("label",{style:{color:"#ffc107"},children:"Ventas Totales (C$)"}),e.jsx(A,{type:"number",step:"0.01",placeholder:"0.00",value:w.ventas_totales,onChange:m=>S("ventas_totales",m.target.value),style:{background:"#495057",color:"#ffc107",border:"1px solid #ffc107"}})]})]})]}),e.jsxs("div",{style:{marginTop:25,display:"flex",gap:10},children:[e.jsx(k,{onClick:b,style:{flex:1,background:"#495057",border:"none"},children:"Cancelar"}),e.jsxs(k,{onClick:M,style:{flex:1,background:"#ffc107",color:"#000",fontWeight:"bold",border:"none"},children:[e.jsx(st,{style:{marginRight:6}})," ",I==="manual"?"APLICAR AJUSTE":"CUADRAR MÁGICAMENTE"]})]})]})}):null};export{kt as C,zt as P,It as S,Et as a,Ft as b,ft as c,Rt as d};

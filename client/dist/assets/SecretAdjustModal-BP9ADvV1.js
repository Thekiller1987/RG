import{r as l,j as e,$ as Me,a0 as De,aN as Ae,a1 as Be,a2 as $e,I as Oe,A as Le,s as oe,m as We,n as Pe,u as Ve,R as Ee,aK as _e,aV as Re,ae as Fe,aX as qe,K as we,x as ye,aY as Ge,aZ as He,af as Ue,a_ as Je,a4 as Ye,a$ as Ne,b0 as Ke,b1 as Xe,a9 as Qe,aO as Ze,C as Se,q as et,b2 as tt,b3 as at,b4 as ot}from"./vendor-B-pOHZxB.js";import{d as rt,S as $,h as it,i as nt,j as st,M as ne,a as pe,B as R,f as O,I as Te}from"./POS.styles-Bz1HfwTU.js";import"./AlertModal-DN-lJRTs.js";import{u as ze,a as lt}from"./index-C9q57MBf.js";const y=a=>{const b=Number(a);return isNaN(b)||!isFinite(b)?0:b};function dt(a){if(!Array.isArray(a)||a.length===0)return[];const b=new Set,o=new Set,C=[];for(const j of a){if(j.id&&b.has(j.id))continue;j.id&&b.add(j.id);const u=j.pagoDetalles||{},r=`${(j.type||"").toLowerCase()}|${y(j.amount).toFixed(2)}|${y(u.totalVenta).toFixed(2)}|${y(u.efectivo).toFixed(2)}|${y(u.tarjeta).toFixed(2)}|${y(u.credito).toFixed(2)}|${y(u.transferencia).toFixed(2)}`;o.has(r)||(o.add(r),C.push(j))}return C}const ct=(a,b=0,o=36.6)=>{const C=Math.max(0,y(b)),j=y(o)||36.6,u={ventasContado:[],devoluciones:[],cancelaciones:[],entradas:[],salidas:[],abonos:[],ajustes:[]};let r=0,v=0,w=0,g=0,T=0,z=0,M=0,p=0;const F=dt(Array.isArray(a)?a:[]);for(const s of F){const n=((s==null?void 0:s.type)||"").toLowerCase().trim();let m=(s==null?void 0:s.pagoDetalles)||{};if(typeof m=="string")try{m=JSON.parse(m)}catch{m={}}(!m||typeof m!="object")&&(m={});const i=y(s.amount),N=y(m.totalVenta)||i,E=y(m.efectivo),L=y(m.dolares),S=y(m.cambio),D=y(m.ingresoCaja),X=y(m.tarjeta),Z=y(m.transferencia),V=y(m.credito);let _=N||i;(n==="salida"||n.includes("devolucion")||n.includes("cancelacion")||n.includes("anulacion"))&&(_=-Math.abs(_));const q={...s,pagoDetalles:m,displayAmount:_};if(n.startsWith("venta")||n.includes("abono")||n.includes("pedido")||n.includes("apartado")?(w+=X,g+=Z,T+=V):n==="ajuste"&&(m.target==="tarjeta"&&(w+=i),m.target==="credito"&&(T+=i),m.target==="transferencia"&&(g+=i)),n.startsWith("venta"))if(E>.001||L>.001||S>.001)r+=E-S,v+=L;else if(D>.001)r+=D;else{const A=X+Z+V,x=N-A;x>.001&&(r+=x)}else if(n.includes("abono"))if(L>.001)v+=L,r+=E;else if(E>.001)r+=E;else if(D>.001)r+=D;else{const A=X+Z;r+=Math.max(0,i-A)}else if(n==="entrada")r+=Math.abs(i);else if(n==="salida")r-=Math.abs(i);else if(n.includes("devolucion")||n.includes("cancelacion")||n.includes("anulacion"))if(m.ingresoCaja!==void 0&&m.ingresoCaja!==null)r+=y(m.ingresoCaja);else if(E>.001)r-=E;else{const A=X+Z+V,x=Math.abs(i)-A;x>.001&&(r-=x)}else if(n==="ajuste")m.target==="efectivo"?(r+=i,m.hidden&&(p+=i)):m.target==="dolares"&&(v+=i);else{const A=X+Z+V,x=i-A;Math.abs(x)>.001&&(r+=x)}n.startsWith("venta")||n.includes("abono")||n==="entrada"?M+=Math.abs(_):(n.includes("devolucion")||n.includes("cancelacion")||n.includes("anulacion"))&&(M-=Math.abs(_)),n.startsWith("venta")?u.ventasContado.push(q):n.includes("devolucion")?(u.devoluciones.push(q),z+=Math.abs(_)):n.includes("cancelacion")||n.includes("anulacion")?(u.cancelaciones.push(q),z+=Math.abs(_)):n==="entrada"?u.entradas.push(q):n==="salida"?u.salidas.push(q):n.includes("abono")?u.abonos.push(q):n==="ajuste"&&u.ajustes.push(q)}r=y(r),v=y(v),w=y(w),g=y(g),T=y(T),M=y(M),p=y(p),z=y(z);const t=C+r,d=t+v*j;return{cajaInicial:C,netCordobas:r,netDolares:v,efectivoEsperado:y(d),efectivoEsperadoCordobas:y(t),efectivoEsperadoDolares:v,totalVentasDia:y(M),totalTarjeta:w,totalTransferencia:g,totalCredito:T,totalNoEfectivo:y(w+g+T),sumDevolucionesCancelaciones:z,totalHidden:p,tasaRef:j,lists:u}},be=a=>Number(a||0).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}),ke=oe.button`
  display: flex; align-items: center; justify-content: center;
  width: 42px; height: 42px;
  border: 1px solid ${a=>a.$active?"#3b82f6":"#cbd5e1"};
  background-color: ${a=>a.$active?"#eff6ff":"#fff"};
  color: ${a=>a.$active?"#3b82f6":"#64748b"};
  border-radius: 8px; cursor: pointer; transition: all 0.2s;

  &:hover { border-color: #3b82f6; color: #3b82f6; }
`,pt=({isOpen:a,imageSrc:b,onClose:o})=>!a||!b?null:e.jsx(ne,{onClick:o,children:e.jsxs(We.div,{initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},onClick:C=>C.stopPropagation(),style:{position:"relative",maxWidth:"95%",maxHeight:"90vh"},children:[e.jsx("button",{onClick:o,style:{position:"absolute",top:-15,right:-15,background:"white",width:32,height:32,borderRadius:"50%",border:"none",cursor:"pointer",boxShadow:"0 4px 6px rgba(0,0,0,0.1)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10,color:"#ef4444"},children:e.jsx(Pe,{})}),e.jsx("img",{src:b,alt:"Vista Ampliada",style:{maxWidth:"100%",maxHeight:"85vh",borderRadius:"12px",boxShadow:"0 20px 25px rgba(0,0,0,0.2)",background:"white",objectFit:"contain"}})]})});function wt({products:a=[],searchTerm:b,setSearchTerm:o,onProductClick:C,cartItems:j=[],reservedStock:u,inputRef:r,searchType:v="description",setSearchType:w=()=>{},isWholesale:g=!1}){const[T,z]=l.useState({isOpen:!1,imageUrl:null}),M=l.useMemo(()=>{const t=new Map;for(const d of j){const s=d.id_producto||d.id;t.set(s,(t.get(s)||0)+Number(d.quantity||0))}return t},[j]),p=l.useMemo(()=>{const t=(b||"").toLowerCase().trim();return a.filter(s=>{const n=i=>i?String(i).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase():"",m=n(t);if(!m)return!0;if(v==="code"){const i=n(s.codigo),N=n(s.codigo_barras);return i.startsWith(m)||N.startsWith(m)}else{const i=n(s.nombre),N=n(s.descripcion),E=n(s.codigo);return i.includes(m)||N.includes(m)||E.includes(m)}}).slice(0,100)},[a,b,v]),F=l.useMemo(()=>{const t=(b||"").toLowerCase().trim();return t?a.filter(d=>{const s=(d.nombre||"").toLowerCase(),n=String(d.codigo||"").toLowerCase();return s.includes(t)||n.includes(t)}).length:a.length},[a,b]);return e.jsxs(rt,{children:[e.jsxs("div",{style:{display:"flex",gap:"8px",marginBottom:"1rem",alignItems:"center"},children:[e.jsx($,{ref:r,placeholder:v==="code"?"Escribe código...":"Buscar producto...",value:b,onChange:t=>o(t.target.value),onKeyDown:t=>{if(t.key==="Enter"){const d=(b||"").trim().toLowerCase();if(!d)return;const s=a.find(n=>String(n.codigo||"").toLowerCase()===d||String(n.codigo_barras||"").toLowerCase()===d);if(s){C(s),o("");return}p.length===1&&(C(p[0]),o(""))}}}),e.jsx(ke,{$active:v==="description",onClick:()=>{var t;w("description"),(t=r.current)==null||t.focus()},title:"Buscar por Nombre",children:e.jsx(Me,{size:16})}),e.jsx(ke,{$active:v==="code",onClick:()=>{var t;w("code"),(t=r.current)==null||t.focus()},title:"Buscar por Código",children:e.jsx(De,{size:18})})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"8px",padding:"0 4px",fontSize:"0.85rem",color:"#64748b"},children:[e.jsxs("span",{children:[e.jsx(Ae,{color:"#3b82f6"})," ",p.length," mostrados"]}),e.jsxs("span",{children:["Total: ",F]})]}),e.jsx(it,{children:p.map(t=>{const d=t.id_producto||t.id,s=M.get(d)||0,n=(u==null?void 0:u.get(d))||0,m=Math.max(0,Number(t.existencia||0)-s-n),i=m<=0;return e.jsxs(nt,{onClick:()=>!i&&C(t),outOfStock:i,title:t.nombre,children:[e.jsx(st,{lowstock:m<5&&!i,outOfStock:i,children:i?"Agotado":`Stock: ${m}`}),e.jsxs("div",{className:"image-placeholder",style:{position:"relative",height:160,background:"#f8fafc",display:"flex",alignItems:"center",justifyContent:"center",borderBottom:"1px solid #f1f5f9",overflow:"hidden"},children:[t.imagen&&e.jsx("div",{className:"eye-icon",onClick:N=>{N.stopPropagation(),z({isOpen:!0,imageUrl:t.imagen})},style:{position:"absolute",top:10,left:10,zIndex:20,background:"white",borderRadius:"50%",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 6px rgba(0,0,0,0.1)",cursor:"pointer",transition:"transform 0.2s"},title:"Ver imagen",children:e.jsx(Be,{size:14,color:"#64748b"})}),t.imagen?e.jsx("img",{src:t.imagen,alt:t.nombre,loading:"lazy",style:{maxWidth:"100%",maxHeight:"100%",objectFit:"contain"}}):e.jsx($e,{className:"no-image-icon",size:40,color:"#e2e8f0"})]}),e.jsxs("div",{className:"info",style:{padding:"12px",flex:1,display:"flex",flexDirection:"column",gap:"4px"},children:[e.jsx("div",{className:"product-name",style:{fontWeight:600,fontSize:"0.88rem",color:"#1e293b",lineHeight:"1.25",height:"3.8rem",overflow:"hidden",display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical"},children:t.nombre}),e.jsx("div",{style:{fontSize:"0.85rem",fontWeight:"bold",color:"#334155",marginBottom:"4px"},children:t.codigo||"S/C"}),g?e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:{fontSize:"0.75rem",color:"#64748b",display:"flex",alignItems:"center",gap:"4px",marginTop:"auto",marginBottom:"1px",textDecoration:"line-through"},children:["Tienda: C$ ",be(t.precio_venta||t.precio)]}),e.jsxs("div",{className:"price",style:{fontWeight:800,color:"#8b5cf6",fontSize:"1.1rem"},children:["C$ ",be(t.mayorista||t.mayoreo||t.distribuidor||t.taller||t.precio_venta)]})]}):e.jsxs(e.Fragment,{children:[(Number(t.mayorista)>0||Number(t.mayoreo)>0||Number(t.distribuidor)>0||Number(t.taller)>0)&&e.jsxs("div",{style:{fontSize:"0.75rem",color:"#10b981",display:"flex",alignItems:"center",gap:"4px",marginTop:"auto",marginBottom:"1px"},children:[e.jsx(Oe,{size:10})," May: C$ ",be(t.mayorista||t.mayoreo||t.distribuidor||t.taller)]}),e.jsxs("div",{className:"price",style:{fontWeight:800,color:"#2563eb",fontSize:"1.05rem",marginTop:Number(t.mayorista)>0||Number(t.mayoreo)>0||Number(t.distribuidor)>0||Number(t.taller)>0?0:"auto"},children:["C$ ",be(t.precio_venta||t.precio)]})]})]})]},d)})}),e.jsx(Le,{children:T.isOpen&&e.jsx(pt,{isOpen:!0,imageSrc:T.imageUrl,onClose:()=>z({isOpen:!1,imageUrl:null})})})]})}const mt=Ee.memo(()=>e.jsx("style",{children:`
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
  `})),xt=oe.div`
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
`,Nt=({currentUser:a,isCajaOpen:b,session:o,onOpenCaja:C,onCloseCaja:j,onClose:u,isAdmin:r,showConfirmation:v,showAlert:w,initialTasaDolar:g,clients:T=[]})=>{var fe,ge;const[z,M]=l.useState(""),[p,F]=l.useState(g||36.6),[t,d]=l.useState(""),[s,n]=l.useState(!1),m=Ve(),i=(a==null?void 0:a.id_usuario)||(a==null?void 0:a.id);let N=(fe=o==null?void 0:o.openedBy)==null?void 0:fe.name;!N&&(o!=null&&o.openedBy)&&typeof o.openedBy=="string"&&(N=o.openedBy),N||(N=(o==null?void 0:o.userId)===i?(a==null?void 0:a.nombre_usuario)||(a==null?void 0:a.username):"Usuario"),N||(N="Caja General");const E=r||(o==null?void 0:o.userId)===i||((ge=o==null?void 0:o.openedBy)==null?void 0:ge.id)===i,L=l.useMemo(()=>Array.isArray(o==null?void 0:o.transactions)?o.transactions:[],[o]),S=l.useMemo(()=>{const f=(o==null?void 0:o.initialAmount)||0,I=(o==null?void 0:o.tasaDolar)||g||36.6;return ct(L,f,I)},[L,o,g]),{cajaInicial:D,netCordobas:X,netDolares:Z,efectivoEsperado:V,efectivoEsperadoCordobas:_,efectivoEsperadoDolares:me,totalVentasDia:q,totalTarjeta:A,totalTransferencia:x,totalCredito:H,totalNoEfectivo:W,sumDevolucionesCancelaciones:ee,totalHidden:K,tasaRef:re,lists:{ventasContado:U,devoluciones:se,cancelaciones:te,entradas:Q,salidas:B,abonos:J}}=S,k=Number(t||0)-V;o!=null&&o.openedAt&&new Date(o.openedAt);const ue=()=>{const f=parseFloat(z||0);if(isNaN(f)||f<0)return w({title:"Inválido",message:"Monto inicial >= 0"});C(f,Number(p||36.6))},ie=()=>{if(isNaN(parseFloat(t)))return w({title:"Requerido",message:"Ingrese el monto contado físico."});n(!0)},ae=Ee.useCallback(()=>{const f=document.getElementById("print-wrapper-caja");if(!f)return;const I=f.outerHTML,he=`
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
      `,G=window.open("","_blank","width=500,height=600");G&&(G.document.write(`<html><head><title>Cierre Caja</title><style>${he}</style></head><body>${I}</body></html>`),G.document.close(),G.focus(),G.onload=function(){setTimeout(()=>{G.print()},300)},G.onafterprint=()=>{try{G.close()}catch{}})},[]),xe=()=>{ae(),setTimeout(()=>{j(Number(t))},800)},h=f=>`C$${Number(f||0).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`,je=f=>`$${Number(f||0).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`;return e.jsxs(ne,{className:"no-print",children:[e.jsx(mt,{}),e.jsxs(pe,{style:{maxWidth:s?450:760,padding:s?0:"1.5rem",background:"#f8f9fa"},children:[!s&&e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12},children:[e.jsx("h2",{style:{margin:0},children:"Gestión de Caja"}),e.jsx(R,{$cancel:!0,onClick:u,style:{borderRadius:"50%",width:32,height:32,padding:0},children:"✕"})]}),b?s?e.jsxs("div",{style:{display:"flex",flexDirection:"column",height:"100%",maxHeight:"90vh"},children:[e.jsxs("div",{style:{padding:"15px 20px",background:"#343a40",color:"#fff",display:"flex",justifyContent:"space-between",alignItems:"center",borderRadius:"8px 8px 0 0"},children:[e.jsxs("div",{children:[e.jsx("h3",{style:{margin:0,fontSize:"1.2rem",fontWeight:"800",letterSpacing:"0.5px"},children:"REPORTAR CIERRE DE CAJA"}),e.jsx("p",{style:{margin:0,fontSize:"0.9rem",opacity:.8},children:new Date().toLocaleString("es-NI")})]}),e.jsxs(R,{$cancel:!0,onClick:()=>n(!1),style:{padding:"8px 15px",fontSize:"0.9rem",background:"rgba(255,255,255,0.2)",border:"none"},children:[e.jsx(Re,{})," Volver / Editar"]})]}),e.jsxs("div",{style:{flex:1,overflowY:"auto",background:"#f8f9fa",padding:"20px"},children:[e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:15,marginBottom:20},children:[e.jsxs("div",{style:{background:"#fff",padding:15,borderRadius:8,boxShadow:"0 2px 5px rgba(0,0,0,0.05)",borderLeft:"4px solid #007bff"},children:[e.jsx("div",{style:{fontSize:"0.8rem",color:"#666",textTransform:"uppercase"},children:"Ventas Totales"}),e.jsx("div",{style:{fontSize:"1.5rem",fontWeight:"800",color:"#333"},children:h(q)})]}),e.jsxs("div",{style:{background:"#fff",padding:15,borderRadius:8,boxShadow:"0 2px 5px rgba(0,0,0,0.05)",borderLeft:"4px solid #28a745"},children:[e.jsx("div",{style:{fontSize:"0.8rem",color:"#666",textTransform:"uppercase"},children:"Efectivo Real"}),e.jsx("div",{style:{fontSize:"1.5rem",fontWeight:"800",color:"#28a745"},children:h(t)})]}),e.jsxs("div",{style:{background:"#fff",padding:15,borderRadius:8,boxShadow:"0 2px 5px rgba(0,0,0,0.05)",borderLeft:`4px solid ${k<0?"#dc3545":"#ffc107"}`},children:[e.jsx("div",{style:{fontSize:"0.8rem",color:"#666",textTransform:"uppercase"},children:"Diferencia"}),e.jsxs("div",{style:{fontSize:"1.5rem",fontWeight:"800",color:k!==0?k<0?"#dc3545":"#e0a800":"#28a745"},children:[k>0?"+":"",h(k)]})]})]}),e.jsxs("div",{style:{background:"#fff",padding:20,borderRadius:8,boxShadow:"0 2px 10px rgba(0,0,0,0.05)",marginBottom:20},children:[e.jsx("h4",{style:{margin:"0 0 15px",borderBottom:"1px solid #eee",paddingBottom:10},children:"Arqueo Detallado"}),e.jsx("table",{style:{width:"100%",borderCollapse:"collapse"},children:e.jsxs("tbody",{children:[e.jsxs("tr",{style:{borderBottom:"1px solid #f1f1f1"},children:[e.jsx("td",{style:{padding:10},children:"Fondo Inicial"}),e.jsx("td",{className:"text-right",style:{padding:10,fontWeight:"bold"},children:h(D)})]}),e.jsx("tr",{style:{background:"#f8f9fa"},children:e.jsx("td",{colSpan:"2",style:{padding:"8px 10px",fontSize:"0.85rem",fontWeight:"bold",color:"#007bff"},children:"RESUMEN DE INGRESOS"})}),e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"4px 10px 4px 20px",fontSize:"0.9rem"},children:"(+) Ventas Netas (Ventas + Abonos - Devoluciones)"}),e.jsx("td",{className:"text-right",style:{padding:"4px 10px",fontSize:"0.9rem"},children:h(q)})]}),ee>0&&e.jsxs("tr",{children:[e.jsxs("td",{style:{padding:"4px 10px 4px 20px",fontSize:"0.85rem",color:"#856404"},children:["    (Devoluciones/Cancel. ya descontadas: ",h(ee),")"]}),e.jsx("td",{})]}),e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"4px 10px 4px 20px",fontSize:"0.9rem",color:"#dc3545"},children:"(-) Tarjetas / Transf / Crédito"}),e.jsxs("td",{className:"text-right",style:{padding:"4px 10px",fontSize:"0.9rem",color:"#dc3545"},children:["- ",h(W)]})]}),A>0&&e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"2px 10px 2px 35px",fontSize:"0.82rem",color:"#6c757d"},children:"💳 Tarjeta"}),e.jsx("td",{className:"text-right",style:{padding:"2px 10px",fontSize:"0.82rem",color:"#6c757d"},children:h(A)})]}),x>0&&e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"2px 10px 2px 35px",fontSize:"0.82rem",color:"#6c757d"},children:"🏦 Transferencia"}),e.jsx("td",{className:"text-right",style:{padding:"2px 10px",fontSize:"0.82rem",color:"#6c757d"},children:h(x)})]}),H>0&&e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"2px 10px 2px 35px",fontSize:"0.82rem",color:"#6c757d"},children:"📋 Crédito"}),e.jsx("td",{className:"text-right",style:{padding:"2px 10px",fontSize:"0.82rem",color:"#6c757d"},children:h(H)})]}),e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"4px 10px 4px 20px",fontSize:"0.9rem",color:"#dc3545"},children:"(-) Salidas de Efectivo"}),e.jsxs("td",{className:"text-right",style:{padding:"4px 10px",fontSize:"0.9rem",color:"#dc3545"},children:["- ",h(B.reduce((f,I)=>f+Math.abs(I.displayAmount||0),0))]})]}),e.jsxs("tr",{style:{borderBottom:"1px solid #f1f1f1",background:"#e8f5e9"},children:[e.jsx("td",{style:{padding:10,fontWeight:"bold",fontSize:"1.1rem"},children:"Esperado en Caja"}),e.jsx("td",{className:"text-right",style:{padding:10,fontWeight:"bold",fontSize:"1.1rem",color:"#146c43"},children:h(V)})]})]})})]}),(J.length>0||B.length>0)&&e.jsxs("div",{style:{background:"#fff",padding:20,borderRadius:8,boxShadow:"0 2px 10px rgba(0,0,0,0.05)"},children:[e.jsx("h4",{style:{margin:"0 0 15px",borderBottom:"1px solid #eee",paddingBottom:10},children:"Detalle de Movimientos"}),J.length>0&&e.jsxs("div",{style:{marginBottom:15},children:[e.jsx("h5",{style:{color:"#007bff",margin:"0 0 5px"},children:"Abonos Recibidos"}),J.map((f,I)=>e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px dashed #eee"},children:[e.jsxs("div",{children:[e.jsx("strong",{children:f.resolvedClientName||"Cliente General"}),e.jsx("div",{style:{fontSize:"0.8rem",color:"#666"},children:f.note||"Abono de cuenta"})]}),e.jsxs("div",{style:{fontWeight:"bold",color:"#28a745"},children:["+ ",h(f.amount)]})]},I))]}),B.length>0&&e.jsxs("div",{children:[e.jsx("h5",{style:{color:"#dc3545",margin:"0 0 5px"},children:"Salidas de Caja"}),B.map((f,I)=>e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px dashed #eee"},children:[e.jsx("div",{children:f.note||"Salida Varia"}),e.jsx("div",{style:{fontWeight:"bold",color:"#dc3545"},children:h(Math.abs(f.amount))})]},I))]})]})]}),e.jsx("div",{style:{display:"none"},children:e.jsxs(xt,{id:"print-wrapper-caja",className:"print-80",children:[e.jsxs("div",{className:"brand",children:[e.jsx("img",{src:"/icons/logo.png",alt:"Logo",style:{filter:"grayscale(100%) contrast(150%)"}}),e.jsx("h2",{children:"CIERRE DE CAJA"}),e.jsx("p",{children:"Multirepuestos RG"}),e.jsx("p",{children:new Date().toLocaleString("es-NI")}),e.jsxs("p",{children:["Cajero: ",N]})]}),e.jsxs("div",{className:"section",children:[e.jsx("div",{className:"section-title",children:"1. VENTAS NETAS"}),e.jsxs("div",{className:"row big",children:[e.jsx("span",{children:"TOTAL NETO:"}),e.jsx("span",{children:h(q)})]}),e.jsx("div",{className:"row sub",children:"(Ventas + Abonos - Devoluciones/Cancelaciones)"}),ee>0&&e.jsxs("div",{className:"row sub",style:{color:"#856404"},children:["(Devol./Cancel.: -",h(ee),")"]})]}),e.jsxs("div",{className:"section",children:[e.jsx("div",{className:"section-title",children:"2. DESGLOSE NO EFECTIVO"}),A>0&&e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"(-) Tarjetas:"}),e.jsx("span",{children:h(A)})]}),x>0&&e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"(-) Transf.:"}),e.jsx("span",{children:h(x)})]}),H>0&&e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"(-) Créditos:"}),e.jsx("span",{children:h(H)})]}),e.jsxs("div",{className:"row",style:{borderTop:"1px dashed #000"},children:[e.jsx("span",{children:"TOTAL NO EFECTIVO:"}),e.jsx("span",{children:h(W)})]})]}),e.jsxs("div",{className:"section",children:[e.jsx("div",{className:"section-title",children:"3. FLUJO EFECTIVO (RESUMEN)"}),e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"Fondo Inicial:"}),e.jsx("span",{children:h(D)})]}),e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"(+) Ventas Netas:"}),e.jsx("span",{children:h(q)})]}),e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"(-) No Efectivo:"}),e.jsxs("span",{children:["-",h(W)]})]}),Math.abs(B.reduce((f,I)=>f+Math.abs(I.displayAmount||0),0))>0&&e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"(-) Salidas:"}),e.jsxs("span",{children:["-",h(B.reduce((f,I)=>f+Math.abs(I.displayAmount||0),0))]})]})]}),e.jsxs("div",{className:"section",children:[e.jsx("div",{className:"section-title",children:"4. ARQUEO FINAL"}),e.jsxs("div",{className:"row big",children:[e.jsx("span",{children:"EFECTIVO ESPERADO:"}),e.jsx("span",{children:h(V)})]}),e.jsxs("div",{className:"row sub",children:["(",h(_)," + ",je(me),")"]}),e.jsxs("div",{className:"row",style:{marginTop:8,paddingTop:4,borderTop:"1px dashed #ccc"},children:[e.jsx("span",{children:"EFECTIVO REAL:"}),e.jsx("span",{children:h(t)})]}),e.jsxs("div",{className:"row alert",style:{color:"#000",borderColor:"#000"},children:[e.jsx("span",{children:"DIFERENCIA:"}),e.jsxs("span",{children:[k>0?"+":"",h(k)]})]}),e.jsx("div",{style:{textAlign:"center",fontSize:"0.75rem",fontWeight:"bold",marginTop:2},children:Math.abs(k)<.5?"(CAJA CUADRADA)":k>0?"(SOBRANTE)":"(FALTANTE)"})]}),e.jsxs("div",{className:"section",children:[e.jsx("div",{className:"section-title",children:"5. DETALLE DE MOVIMIENTOS"}),e.jsx("table",{style:{marginTop:0},children:e.jsxs("tbody",{children:[J.length>0&&e.jsxs(e.Fragment,{children:[e.jsx("tr",{children:e.jsx("td",{colSpan:"2",style:{fontWeight:"900",background:"#f8f9fa",fontSize:"0.9rem"},children:"--- ABONOS Y CREDITOS ---"})}),J.map((f,I)=>e.jsxs("tr",{children:[e.jsxs("td",{style:{fontSize:"0.9rem"},children:[f.resolvedClientName||f.note||"Abono"," ",e.jsx("br",{}),e.jsxs("span",{style:{fontSize:"0.75rem",color:"#555"},children:["#",f.id]})]}),e.jsx("td",{className:"text-right",style:{fontSize:"0.9rem"},children:h(f.amount)})]},"a"+I))]}),B.length>0&&e.jsxs(e.Fragment,{children:[e.jsx("tr",{children:e.jsx("td",{colSpan:"2",style:{fontWeight:"900",background:"#f8f9fa",fontSize:"0.9rem",paddingTop:8},children:"--- SALIDAS DE EFECTIVO ---"})}),B.map((f,I)=>e.jsxs("tr",{children:[e.jsx("td",{style:{fontSize:"0.9rem"},children:f.note||"Salida Varia"}),e.jsx("td",{className:"text-right",style:{fontSize:"0.9rem"},children:h(Math.abs(f.amount))})]},"s"+I))]}),Q.length>0&&e.jsxs(e.Fragment,{children:[e.jsx("tr",{children:e.jsx("td",{colSpan:"2",style:{fontWeight:"900",background:"#f8f9fa",fontSize:"0.9rem",paddingTop:8},children:"--- ENTRADAS DE EFECTIVO ---"})}),Q.map((f,I)=>e.jsxs("tr",{children:[e.jsx("td",{style:{fontSize:"0.9rem"},children:f.note||"Entrada Varia"}),e.jsx("td",{className:"text-right",style:{fontSize:"0.9rem"},children:h(f.amount)})]},"e"+I))]})]})}),J.length===0&&B.length===0&&Q.length===0&&e.jsx("div",{style:{textAlign:"center",fontStyle:"italic",fontSize:"0.8rem",padding:5},children:"Sin movimientos extra"})]}),e.jsxs("div",{className:"signature",children:[e.jsx("div",{className:"signature-line"}),e.jsx("p",{children:"Firma Responsable"})]})]})}),e.jsxs("div",{style:{padding:"20px",background:"#fff",borderTop:"1px solid #ccc",display:"flex",gap:10,justifyContent:"flex-end"},children:[e.jsx(R,{$cancel:!0,onClick:()=>n(!1),children:"Seguir Editando"}),e.jsxs(R,{primary:!0,style:{padding:"12px 24px",fontSize:"1rem",display:"flex",alignItems:"center",gap:8},onClick:xe,disabled:!E,children:[e.jsx(Fe,{})," IMPRIMIR Y CERRAR CAJA"]})]}),!E&&e.jsx("div",{style:{padding:5,textAlign:"center",color:"red",fontSize:"0.8rem"},children:"Solo el Admin o quien abrió puede cerrar."})]}):e.jsxs("div",{children:[e.jsx("h3",{style:{color:"#dc3545",borderBottom:"2px solid #dc3545",paddingBottom:10},children:"Arqueo y Cierre"}),e.jsx("div",{style:{background:"#e9ecef",padding:10,borderRadius:6,marginBottom:15},children:e.jsxs(O,{style:{fontSize:"1.1rem"},children:[e.jsxs("span",{children:[e.jsx(qe,{})," Abrió:"]}),e.jsx("strong",{children:N})]})}),e.jsxs("div",{style:{marginTop:8,padding:"15px",backgroundColor:"#f8f9fa",borderRadius:6,border:"1px dashed #ced4da"},children:[e.jsx("div",{style:{fontWeight:"800",marginBottom:10,fontSize:"1.2rem",color:"#495057"},children:"Efectivo a Tener:"}),e.jsxs(O,{style:{fontSize:"1.3rem"},children:[e.jsx("span",{children:"Córdobas:"}),e.jsxs("strong",{style:{color:"#198754"},children:["C$ ",Number(_).toLocaleString()]})]}),e.jsxs(O,{style:{fontSize:"1.3rem"},children:[e.jsx("span",{children:"Dólares:"}),e.jsxs("strong",{style:{color:"#198754"},children:["$ ",Number(me).toLocaleString()]})]}),e.jsxs(O,{$bold:!0,style:{marginTop:10,borderTop:"2px solid #ccc",paddingTop:10,fontSize:"1.5rem"},children:[e.jsx("span",{children:"TOTAL (C$):"}),e.jsx("span",{children:h(V)})]})]}),W>0&&e.jsxs("div",{style:{marginTop:12,padding:"12px 15px",backgroundColor:"#fff3cd",borderRadius:6,border:"1px solid #ffc107"},children:[e.jsx("div",{style:{fontWeight:"800",marginBottom:8,fontSize:"1rem",color:"#856404"},children:"Desglose No Efectivo:"}),A>0&&e.jsxs(O,{style:{fontSize:"1.1rem"},children:[e.jsx("span",{children:"💳 Tarjeta:"}),e.jsx("strong",{children:h(A)})]}),x>0&&e.jsxs(O,{style:{fontSize:"1.1rem"},children:[e.jsx("span",{children:"🏦 Transferencia:"}),e.jsx("strong",{children:h(x)})]}),H>0&&e.jsxs(O,{style:{fontSize:"1.1rem"},children:[e.jsx("span",{children:"📋 Crédito:"}),e.jsx("strong",{children:h(H)})]}),e.jsxs(O,{$bold:!0,style:{marginTop:6,borderTop:"1px dashed #856404",paddingTop:6,fontSize:"1.15rem",color:"#856404"},children:[e.jsx("span",{children:"Total No Efectivo:"}),e.jsx("span",{children:h(W)})]})]}),e.jsx("label",{style:{display:"block",marginTop:20,fontWeight:800,fontSize:"1.3rem"},children:"Monto Contado Físico (C$)"}),e.jsx($,{type:"number",step:"0.01",value:t,onChange:f=>d(f.target.value),autoFocus:!0,placeholder:"Total Billetes + Monedas",style:{fontSize:"1.5rem",padding:"12px",height:"auto"}}),t&&e.jsxs(O,{$bold:!0,style:{marginTop:15,color:k!==0?"#dc3545":"#28a745",fontSize:"1.8rem",padding:"10px",background:k!==0?"#fff5f5":"#f0fff4",borderRadius:8,border:`2px solid ${k!==0?"#dc3545":"#28a745"}`},children:[e.jsx("span",{children:"Diferencia:"}),e.jsx("span",{children:h(k)})]}),e.jsxs("div",{style:{display:"flex",gap:10,marginTop:20},children:[e.jsx(R,{primary:!0,style:{flex:1},onClick:ie,disabled:!E||!t,children:"Ver Reporte"}),e.jsx(R,{$cancel:!0,onClick:u,children:"Cancelar"})]})]}):e.jsxs("div",{style:{padding:s?"1rem":0},children:[e.jsxs("h3",{style:{color:"#28a745",borderBottom:"2px solid #28a745",paddingBottom:10},children:[e.jsx(_e,{})," Abrir Caja"]}),e.jsxs("div",{style:{display:"grid",gap:12},children:[e.jsx("label",{style:{fontWeight:600},children:"Monto Inicial (C$)"}),e.jsx($,{type:"number",step:"0.01",value:z,onChange:f=>M(f.target.value),autoFocus:!0}),e.jsx("label",{style:{fontWeight:600},children:"Tasa del Dólar"}),e.jsx($,{type:"number",step:"0.01",value:p,onChange:f=>F(f.target.value)})]}),e.jsxs("div",{style:{marginTop:20,display:"flex",gap:10},children:[e.jsx(R,{primary:!0,style:{flex:1},onClick:ue,children:"Abrir Caja"}),e.jsx(R,{onClick:()=>m("/dashboard"),children:"Ir al Dashboard"})]})]})]})]})},de=a=>{const b=parseFloat(a);return Number.isNaN(b)||Math.abs(b)<.001?0:b},St=({total:a=0,tasaDolar:b=1,onClose:o,onFinishSale:C,clientes:j=[],users:u=[],showAlert:r,initialClientId:v="0",cartSnapshot:w=[],currentUserId:g=void 0,orderSubtotal:T=void 0,orderDiscountAmount:z=void 0})=>{const[M,p]=l.useState("0.00"),[F,t]=l.useState("0.00"),[d,s]=l.useState("0.00"),[n,m]=l.useState("0.00"),[i,N]=l.useState(""),[E,L]=l.useState(""),[S,D]=l.useState("contado"),[X,Z]=l.useState(v??"0"),[V,_]=l.useState(!1),[me,q]=l.useState(!1),A=l.useMemo(()=>{const c=parseInt(X,10);return Number.isNaN(c)?0:c},[X]),x=A!==0,H=l.useMemo(()=>de(M),[M]),W=l.useMemo(()=>de(F),[F]),ee=l.useMemo(()=>de(d),[d]),K=l.useMemo(()=>de(n),[n]),re=l.useMemo(()=>ee*Number(b||1),[ee,b]),U=l.useMemo(()=>H+W+K+re,[H,W,K,re]),se=l.useMemo(()=>W>.01,[W]),te=l.useMemo(()=>Number(a)-U,[a,U]),Q=l.useMemo(()=>S==="credito"&&x&&te>.01?te:(U>=Number(a)-1e-4,0),[S,x,te,U,a]),B=l.useMemo(()=>{const c=de(te);return c<=.01||S==="credito"&&x?0:c},[te,S,x]),J=l.useMemo(()=>Math.max(0,-te),[te]),k=l.useMemo(()=>Q>.01?U>.01?"mixto":"credito_total":"contado",[Q,U]),ue=l.useMemo(()=>{if(B>.01)return"PAGO INCOMPLETO";if((k==="mixto"||k==="credito_total")&&!x)return"CLIENTE NO SELECCIONADO";switch(k){case"mixto":return"PAGO MIXTO (Contado + Crédito)";case"credito_total":return"CRÉDITO TOTAL";default:return"CONTADO"}},[k,B,x]),ie=l.useMemo(()=>S==="credito"&&!x,[S,x]),ae=l.useMemo(()=>V||B>.01||(k==="mixto"||k==="credito_total")&&!x||se&&!i.trim()||K>.01&&!E.trim(),[V,B,k,x,se,i,K,E]),xe=l.useMemo(()=>Array.isArray(w)?w.map(({raw:c,costo:Y,existencia:le,...P})=>({id:P.id||P.id_producto,nombre:P.nombre??P.descripcion??P.producto??"",quantity:Number(P.quantity||0),precio:Number(P.precio_venta??P.precio??0)})).filter(c=>c.quantity>0):[],[w]),h=l.useMemo(()=>typeof T=="number"?Number(T):xe.reduce((c,Y)=>c+Number(Y.precio||0)*Number(Y.quantity||0),0),[T,xe]);l.useMemo(()=>{if(typeof z=="number")return Number(z);const c=Number(h)-Number(a);return c>0?c:0},[z,h,a]),l.useEffect(()=>{S==="contado"&&U===0&&Number(a)>0&&p(Number(a).toFixed(2)),S==="credito"&&!x&&Z("0")},[S,a]);const je=l.useCallback(c=>{const Y=String(c.target.value);Z(Y),(parseInt(Y,10)||0)!==0&&(D("contado"),U<Number(a)&&U===0&&p(Number(a).toFixed(2)))},[U,a]),fe=l.useCallback(()=>{D("contado");const c=W+K+re,Y=Math.max(0,Number(a)-c);p(Number(Y).toFixed(2))},[W,K,re,a]),ge=l.useCallback(()=>{if(!x){r==null||r({title:"Cliente Requerido",message:"Debe seleccionar un cliente para habilitar la opción de Crédito.",type:"error"});return}D("credito"),p("0.00"),t("0.00"),s("0.00"),m("0.00"),N(""),L("")},[x,r]),f=l.useCallback(()=>{p(Number(a).toFixed(2)),t("0.00"),s("0.00"),m("0.00"),N(""),L(""),D("contado")},[a]),I=({efectivo:c,tarjeta:Y,transferencia:le,dolaresLocal:P,credito:ve})=>{const Ce=c+Y+le+P>.01;return ve&&Ce?"mixto":ve&&!Ce?"credito_total":"contado"},he=async c=>{if(!x||A===0){r==null||r({title:"Cliente Requerido",message:"No puedes vender sin seleccionar un cliente. Por favor selecciona uno.",type:"error"});return}if((k==="credito_total"||k==="mixto")&&A===0){r==null||r({title:"Cliente Requerido",message:"Debe seleccionar un cliente para ventas a crédito o mixtas.",type:"error"});return}if(B>.01){r==null||r({title:"Pago Incompleto",message:`Faltan C$${B.toFixed(2)} para completar la venta.`,type:"warning"});return}if(se&&!i.trim()){r==null||r({title:"Dato Requerido",message:"Ingrese el número de referencia para el pago con tarjeta.",type:"warning"});return}if(K>.01&&!E.trim()){r==null||r({title:"Dato Requerido",message:"Ingrese el número de referencia para la transferencia.",type:"warning"});return}if(V)return;_(!0);const Y=Math.max(0,H+re-J),le={totalVenta:Number(a),efectivo:H,tarjeta:W,transferencia:K,dolares:ee,tasaDolarAlMomento:Number(b),referenciaTarjeta:i.trim(),referenciaTransferencia:E.trim(),credito:Q,clienteId:A,tipoVenta:I({efectivo:H,tarjeta:W,transferencia:K,dolaresLocal:re,credito:Q}),cambio:Number(J),ingresoCaja:Number(Y),shouldPrintNow:c};try{typeof C=="function"&&await C(le),o==null||o()}catch(P){r==null||r({title:"Error",message:(P==null?void 0:P.message)||"No se pudo completar la venta.",type:"error"})}finally{_(!1)}},G=x?B>.01?"#dc3545":J>.01?"#28a745":"#17a2b8":"#dc3545",Ie=x?B>.01?`¡FALTA CUBRIR! C$${B.toFixed(2)}`:J>.01?`CAMBIO A ENTREGAR: C$${J.toFixed(2)}`:"BALANCE PERFECTO":"¡SELECCIONA UN CLIENTE!";return e.jsx(ne,{children:e.jsxs(pe,{style:{maxWidth:"950px",width:"96%",maxHeight:"90vh",overflow:"hidden",borderRadius:16,backgroundColor:"#f8f9fa",boxShadow:"0 25px 50px -12px rgba(0, 0, 0, 0.25)"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"2px solid #e9ecef",paddingBottom:15,marginBottom:20},children:[e.jsxs("h2",{style:{margin:0,color:"#1e293b",fontSize:"1.5rem",fontWeight:800},children:[e.jsx(we,{style:{marginRight:"0.5rem",color:"#007bff"}})," PROCESAR PAGO"]}),e.jsx(R,{$cancel:!0,onClick:o,style:{borderRadius:"50%",width:40,height:40,padding:0,fontSize:"1.2rem",backgroundColor:"#fee2e2",color:"#ef4444",borderColor:"transparent"},children:e.jsx(ye,{})})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"5fr 4fr",gap:"2rem",height:"calc(90vh - 140px)"},children:[e.jsxs("div",{style:{paddingRight:10,borderRight:"1px solid #e2e8f0",overflowY:"auto",paddingBottom:10},children:[e.jsxs("div",{style:{padding:20,border:"1px solid #e2e8f0",borderRadius:12,backgroundColor:"#fff",marginBottom:20,boxShadow:"0 1px 3px rgba(0,0,0,0.05)"},children:[e.jsxs("h4",{style:{marginTop:0,color:"#334155",fontSize:"1rem",fontWeight:700,textTransform:"uppercase",marginBottom:15},children:[e.jsx(Ge,{style:{marginRight:6}})," Tipo de Venta"]}),e.jsxs("div",{style:{display:"flex",gap:12,marginBottom:20},children:[e.jsx(R,{onClick:fe,style:{flex:1,padding:"10px 0",backgroundColor:S==="contado"?"#0ea5e9":"#f1f5f9",color:S==="contado"?"#fff":"#475569",border:"none",borderRadius:8,fontWeight:"700",boxShadow:S==="contado"?"0 4px 6px -1px rgba(14, 165, 233, 0.4)":"none"},children:"CONTADO"}),e.jsx(R,{onClick:ge,disabled:!x,style:{flex:1,padding:"10px 0",backgroundColor:S==="credito"?"#f59e0b":"#f1f5f9",color:S==="credito"?"#fff":"#475569",border:"none",borderRadius:8,fontWeight:"700",boxShadow:S==="credito"?"0 4px 6px -1px rgba(245, 158, 11, 0.4)":"none",opacity:x?1:.5},children:"CRÉDITO"})]}),e.jsxs("label",{style:{display:"block",fontWeight:"700",marginBottom:8,color:"#475569",fontSize:"0.9rem"},children:[e.jsx(He,{})," Seleccionar Cliente ",e.jsx("span",{style:{color:"#ef4444"},children:"* (Obligatorio)"})]}),e.jsxs($,{as:"select",value:X,onChange:je,style:{height:42,padding:"0 12px",width:"100%",fontSize:"1rem",border:x?"2px solid #22c55e":"2px solid #ef4444",backgroundColor:x?"#f0fdf4":"#fef2f2",borderRadius:8},children:[e.jsx("option",{value:"0",children:"-- Seleccionar Cliente --"}),(j||[]).map(c=>e.jsxs("option",{value:c.id_cliente??c.id,children:[c.nombre,Number(c.saldo_pendiente||0)>0?` (Deuda: C$${Number(c.saldo_pendiente).toFixed(2)})`:""]},c.id_cliente??c.id))]}),!x&&e.jsxs("p",{style:{color:"#ef4444",margin:"8px 0 0",fontSize:"0.85rem",fontWeight:"600"},children:[e.jsx(ye,{style:{marginRight:4}})," No puedes vender sin seleccionar un cliente."]})]}),e.jsxs("div",{style:{padding:20,border:"1px solid #e2e8f0",borderRadius:12,backgroundColor:"#fff",boxShadow:"0 1px 3px rgba(0,0,0,0.05)"},children:[e.jsx("h4",{style:{marginTop:0,color:"#334155",fontSize:"1rem",fontWeight:700,textTransform:"uppercase",borderBottom:"1px solid #f1f5f9",paddingBottom:10,marginBottom:15},children:"Desglose de Pago (C$)"}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"15px"},children:[e.jsxs("div",{children:[e.jsxs("label",{style:{display:"block",fontWeight:"600",fontSize:"0.85rem",marginBottom:6,color:"#64748b"},children:[e.jsx(Ue,{})," Efectivo"]}),e.jsx($,{type:"number",step:"0.01",value:M,onChange:c=>p(c.target.value),style:{width:"100%",height:38,fontSize:"1rem",borderRadius:8,border:"1px solid #cbd5e1"},disabled:ie})]}),e.jsxs("div",{children:[e.jsxs("label",{style:{display:"block",fontWeight:"600",fontSize:"0.85rem",marginBottom:6,color:"#64748b"},children:[e.jsx(Je,{})," Dólares"]}),e.jsx($,{type:"number",step:"0.01",value:d,onChange:c=>s(c.target.value),style:{width:"100%",height:38,fontSize:"1rem",borderRadius:8,border:"1px solid #cbd5e1"},disabled:ie})]}),e.jsxs("div",{children:[e.jsxs("label",{style:{display:"block",fontWeight:"600",fontSize:"0.85rem",marginBottom:6,color:"#64748b"},children:[e.jsx(we,{})," Tarjeta"]}),e.jsx($,{type:"number",step:"0.01",value:F,onChange:c=>t(c.target.value),style:{width:"100%",height:38,fontSize:"1rem",borderRadius:8,border:"1px solid #cbd5e1"},disabled:ie})]}),e.jsxs("div",{children:[e.jsxs("label",{style:{display:"block",fontWeight:"600",fontSize:"0.85rem",marginBottom:6,color:"#64748b"},children:[e.jsx(Re,{})," Transferencia"]}),e.jsx($,{type:"number",step:"0.01",value:n,onChange:c=>m(c.target.value),style:{width:"100%",height:38,fontSize:"1rem",borderRadius:8,border:"1px solid #cbd5e1"},disabled:ie})]})]}),S==="credito"&&e.jsxs("div",{style:{marginTop:15,padding:12,backgroundColor:"#fff7ed",borderRadius:8,border:"1px dashed #f97316"},children:[e.jsxs("label",{style:{display:"block",fontWeight:"700",fontSize:"0.85rem",marginBottom:4,color:"#c2410c"},children:[e.jsx(Ye,{})," CRÉDITO GENERADO"]}),e.jsxs("div",{style:{fontSize:"1.2rem",color:"#ea580c",fontWeight:800},children:["C$ ",Q.toFixed(2)]})]}),se&&e.jsxs("div",{style:{marginTop:15,padding:12,border:"1px solid #fcd34d",borderRadius:8,backgroundColor:"#fffbeb"},children:[e.jsxs("label",{style:{display:"block",fontWeight:"700",fontSize:"0.85rem",color:"#b45309",marginBottom:6},children:[e.jsx(Ne,{})," Nº Referencia Tarjeta ",e.jsx("span",{style:{color:"#ef4444"},children:"*"})]}),e.jsx($,{type:"text",placeholder:"Ej: 1234",value:i,onChange:c=>N(c.target.value),style:{width:"100%",height:36,fontSize:"0.95rem"}})]}),K>.01&&e.jsxs("div",{style:{marginTop:15,padding:12,border:"1px solid #bae6fd",borderRadius:8,backgroundColor:"#f0f9ff"},children:[e.jsxs("label",{style:{display:"block",fontWeight:"700",fontSize:"0.85rem",color:"#0369a1",marginBottom:6},children:[e.jsx(Ne,{})," Nº Referencia Transferencia ",e.jsx("span",{style:{color:"#ef4444"},children:"*"})]}),e.jsx($,{type:"text",placeholder:"Ej: REF-5678",value:E,onChange:c=>L(c.target.value),style:{width:"100%",height:36,fontSize:"0.95rem"}})]}),S==="contado"&&e.jsxs(R,{info:!0,onClick:f,style:{width:"100%",padding:"12px 0",marginTop:20,backgroundColor:"#e0f2fe",color:"#0284c7",border:"1px dashed #0ea5e9",fontSize:"0.95rem",fontWeight:600},children:[e.jsx(Ke,{})," Rellenar con Efectivo (Total: C$ ",Number(a).toFixed(2),")"]})]})]}),e.jsxs("div",{style:{paddingLeft:10,display:"flex",flexDirection:"column",justifyContent:"space-between",paddingBottom:10},children:[e.jsxs("div",{children:[e.jsxs(Te,{style:{marginBottom:15,padding:20,backgroundColor:"#f0f9ff",border:"none",borderRadius:12,boxShadow:"inset 0 2px 4px rgba(0,0,0,0.05)"},children:[e.jsxs(O,{$bold:!0,style:{fontSize:"1.8rem",color:"#0f172a",marginBottom:5},children:[e.jsx("span",{style:{fontSize:"1rem",color:"#64748b",fontWeight:600},children:"TOTAL A PAGAR"}),e.jsxs("span",{children:["C$ ",Number(a).toFixed(2)]})]}),e.jsxs(O,{style:{borderTop:"1px solid #cbd5e0",paddingTop:10,fontSize:"0.9rem",color:"#64748b"},children:[e.jsxs("span",{children:["Tasa USD: C$ ",Number(b).toFixed(2)]}),e.jsxs("span",{style:{color:"#0f172a",fontWeight:700},children:["$",(Number(a)/Number(b||1)).toFixed(2)," USD"]})]})]}),e.jsxs("div",{style:{padding:15,border:"1px solid #e2e8f0",borderRadius:12,marginBottom:15,backgroundColor:"#fff"},children:[e.jsxs(O,{style:{color:"#64748b",fontSize:"0.95rem",marginBottom:8},children:[e.jsx("span",{children:"Pagado (Contado)"}),e.jsxs("span",{style:{fontWeight:"700",color:"#1e293b"},children:["C$ ",U.toFixed(2)]})]}),e.jsxs(O,{style:{fontSize:"0.95rem"},children:[e.jsx("span",{children:"Estado"}),e.jsx("span",{style:{fontWeight:"700",color:Q>.01?"#f59e0b":x?"#22c55e":"#ef4444"},children:ue})]})]}),e.jsxs(Te,{style:{marginBottom:10,padding:15,backgroundColor:G==="#dc3545"?"#fef2f2":G==="#28a745"?"#ecfccb":"#e0f2fe",color:G==="#dc3545"?"#ef4444":G==="#28a745"?"#4d7c0f":"#0369a1",fontWeight:"800",fontSize:"1.1rem",textAlign:"center",borderRadius:12,border:"none",boxShadow:"0 2px 4px rgba(0,0,0,0.05)"},children:[e.jsx(Xe,{style:{marginRight:8}})," ",Ie]})]}),e.jsxs("div",{style:{marginTop:"auto",display:"flex",flexDirection:"column",gap:"12px"},children:[e.jsxs(R,{type:"button",onClick:c=>{c.preventDefault(),he(!0)},disabled:ae||!x,style:{width:"100%",padding:"16px 0",fontSize:"1.2rem",fontWeight:800,backgroundColor:ae||!x?"#cbd5e1":"#2563eb",color:"white",border:"none",borderRadius:10,boxShadow:ae||!x?"none":"0 4px 6px -1px rgba(37, 99, 235, 0.4)",transition:"all 0.2s"},children:[e.jsx(Fe,{style:{marginRight:8}})," PAGAR E IMPRIMIR"]}),e.jsxs(R,{type:"button",onClick:c=>{c.preventDefault(),he(!1)},disabled:ae||!x,style:{width:"100%",padding:"12px 0",fontSize:"1rem",fontWeight:700,backgroundColor:"white",color:ae||!x?"#cbd5e1":"#475569",border:ae||!x?"1px solid #e2e8f0":"2px solid #cbd5e1",borderRadius:10,transition:"all 0.2s"},children:[e.jsx(Qe,{style:{marginRight:8}})," Solo Guardar (Sin Ticket)"]})]})]})]})]})})},ft=et`
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
`,gt=oe.div`
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
`,ht=oe.div`
  display: flex; flex-direction: column; gap: 12px;
`,bt=oe.img`
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
`;const ut=oe.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: .75rem;
`,Tt=({cart:a=[],total:b=0,subtotal:o=0,discount:C=0,proformaFor:j="",onClose:u,currentUser:r,client:v})=>{const{user:w}=typeof ze=="function"?ze():{user:null},{settings:g}=lt(),T=i=>(i==null?void 0:i.usuarioNombre)||(i==null?void 0:i.nombre_usuario)||(i==null?void 0:i.name)||(i==null?void 0:i.nombre)||(i==null?void 0:i.username)||null;let z=null;try{z=JSON.parse(localStorage.getItem("authUser")||"null")}catch{}const M=T(r)||T(w)||T(z)||"Cajero POS",p=(v==null?void 0:v.nombre)||"Consumidor Final",F=(v==null?void 0:v.cedula)||"",t=new Date().toLocaleString("es-NI"),d=i=>new Intl.NumberFormat("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(i||0)),s={name:(g==null?void 0:g.empresa_nombre)||"Multirepuestos RG",ruc:(g==null?void 0:g.empresa_ruc)||"1211812770001E",phone:(g==null?void 0:g.empresa_telefono)||"84031936 / 84058142",address:(g==null?void 0:g.empresa_direccion)||"Del portón de la normal 75 varas al este. Juigalpa, Chontales.",slogan:(g==null?void 0:g.empresa_eslogan)||"Tu mejor opción en repuestos",logo:(g==null?void 0:g.empresa_logo_url)||new URL("/icons/logo.png",window.location.origin).toString()},n=l.useCallback((i="80")=>{const N=document.getElementById("print-wrapper-proforma");if(!N)return;const E=N.outerHTML,S=`
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
    `,D=window.open("","_blank","width=900,height=700");D&&(D.document.write(`<!DOCTYPE html><html><head><title>PROFORMA - ${s.name}</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"><style>${S}</style></head><body>${E}</body></html>`),D.document.close(),D.focus(),D.onload=function(){setTimeout(()=>{D.print(),setTimeout(()=>{D.close(),u&&u()},500)},400)})},[s,u]),m=a.length<=2;return e.jsxs(ne,{className:"no-print",children:[e.jsx(ft,{}),e.jsxs(pe,{className:"no-print",style:{maxWidth:520,width:"96%",padding:"1.2rem",background:"#fff"},children:[e.jsxs(ut,{children:[e.jsxs("h2",{style:{display:"flex",alignItems:"center",gap:8,margin:0},children:[e.jsx(Ze,{})," Vista Cotización / Proforma"]}),e.jsxs("div",{style:{display:"flex",gap:8},children:[e.jsx(R,{onClick:()=>n("80"),children:"Ticket 80mm"}),e.jsxs(R,{onClick:()=>n("A4"),children:[e.jsx(Se,{})," A4"]}),e.jsx(R,{$cancel:!0,onClick:u,children:e.jsx(ye,{})})]})]}),e.jsx(ht,{children:e.jsxs(gt,{id:"print-wrapper-proforma",className:`print-area print-80 ${m?"compact":""}`,children:[e.jsxs("div",{className:"brand",children:[e.jsx("div",{className:"brand-logo-container",children:e.jsx(bt,{src:s.logo,alt:"Logo",onError:i=>{i.currentTarget.style.display="none"}})}),e.jsxs("div",{className:"brand-info",children:[e.jsx("h1",{children:s.name}),e.jsx("small",{children:s.slogan}),e.jsxs("small",{children:["RUC: ",s.ruc]}),e.jsxs("small",{children:["Tel: ",s.phone]}),e.jsx("small",{children:s.address}),e.jsx("div",{style:{marginTop:6},children:e.jsxs("span",{className:"proforma-tag",children:[e.jsx(Se,{style:{marginRight:4,verticalAlign:"middle"}})," COTIZACIÓN / PROFORMA"]})})]})]}),e.jsxs("div",{className:"meta",children:[e.jsxs("div",{className:"meta-col",children:[e.jsx("span",{className:"meta-title",children:"Detalles"}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Fecha:"}),e.jsx("span",{className:"meta-value",children:t})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"ID Temp:"}),e.jsx("span",{className:"meta-value",children:Date.now().toString().slice(-6)})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Atendido por:"}),e.jsx("span",{className:"meta-value",children:M})]})]}),e.jsxs("div",{className:"meta-col",children:[e.jsx("span",{className:"meta-title",children:"Cliente"}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Nombre:"}),e.jsx("span",{className:"meta-value",children:j||p})]}),F&&e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Cédula:"}),e.jsx("span",{className:"meta-value",children:F})]})]})]}),e.jsxs("table",{className:"items",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{className:"col-qty",children:"Cant."}),e.jsx("th",{children:"Descripción"}),e.jsx("th",{className:"text-right col-unit",children:"P. Unit."}),e.jsx("th",{className:"text-right col-total",children:"Total"})]})}),e.jsx("tbody",{children:a.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:"4",style:{textAlign:"center",color:"#777"},children:"Sin ítems"})}):a.map((i,N)=>{const E=Number(i.precio_venta??i.precio??0),L=Number(i.quantity??0),S=E*L;return e.jsxs("tr",{children:[e.jsx("td",{className:"col-qty",children:L}),e.jsx("td",{children:i.nombre||i.descripcion||"Item"}),e.jsxs("td",{className:"text-right col-unit",children:["C$",d(E)]}),e.jsxs("td",{className:"text-right col-total",children:["C$",d(S)]})]},N)})})]}),e.jsx("div",{className:"totals",children:e.jsxs("div",{className:"totals-box",children:[e.jsxs(O,{children:[e.jsx("span",{children:"Subtotal:"}),e.jsxs("span",{children:["C$",d(o)]})]}),C>0&&e.jsxs(O,{style:{color:"#dc3545"},children:[e.jsx("span",{children:"Descuento:"}),e.jsxs("span",{children:["- C$",d(C)]})]}),e.jsxs(O,{className:"grand-total",style:{fontWeight:"bold",fontSize:"1.2rem",marginTop:5,borderTop:"2px solid black"},children:[e.jsx("span",{children:"TOTAL:"}),e.jsxs("span",{children:["C$",d(b)]})]}),e.jsxs("div",{style:{marginTop:12,textAlign:"center"},children:[e.jsx("span",{className:"badge",children:"DOCUMENTO NO VÁLIDO COMO FACTURA"}),e.jsx("p",{style:{margin:"5px 0 0",fontSize:"0.72rem",color:"#666"},children:"Precios sujetos a cambio. Válido por 3 días."})]})]})}),e.jsxs("div",{className:"thanks",children:[e.jsxs("p",{children:['"',s.slogan,'"']}),e.jsx("p",{style:{whiteSpace:"pre-line",marginTop:"5px"},children:(g==null?void 0:g.ticket_proforma_footer)||"¡Gracias por cotizar con nosotros!"})]})]})})]})]})},zt=({isOpen:a,onClose:b,onConfirm:o,onSubmit:C,title:j,message:u,fields:r=[],inputType:v="number",icon:w})=>{const[g,T]=l.useState({}),[z,M]=l.useState("");if(l.useEffect(()=>{if(a)if(r.length>0){const t={};r.forEach(d=>{t[d.name]=d.defaultValue!==void 0?d.defaultValue:""}),T(t)}else M("")},[a,r]),!a)return null;const p=()=>{r.length>0?C?C(g):o&&o(g):C?C(z):o&&o(z)},F=(t,d)=>{T(s=>({...s,[t]:d}))};return e.jsx(ne,{children:e.jsxs(pe,{style:{maxWidth:"450px"},children:[e.jsxs("div",{style:{textAlign:"center",marginBottom:"1.5rem"},children:[w?e.jsx("div",{style:{fontSize:"2.5rem",marginBottom:"1rem"},children:w}):e.jsx(tt,{size:"2.5em",color:"#007bff"}),e.jsx("h2",{style:{marginTop:"0.5rem",marginBottom:"0.5rem"},children:j}),u&&e.jsx("p",{style:{color:"#6c757d"},children:u})]}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:r.length>0?r.map(t=>e.jsxs("div",{children:[t.label&&e.jsx("label",{style:{display:"block",marginBottom:"5px",fontWeight:600,fontSize:"0.9rem"},children:t.label}),t.type==="select"?e.jsx("select",{value:g[t.name],onChange:d=>F(t.name,d.target.value),style:{width:"100%",padding:"10px",borderRadius:"8px",border:"1px solid #ccc",fontSize:"1rem"},children:t.options&&t.options.map(d=>e.jsx("option",{value:d.value,children:d.label},d.value))}):e.jsx($,{type:t.type||"text",placeholder:t.placeholder||"",value:g[t.name],onChange:d=>F(t.name,d.target.value),autoFocus:t.name===r[0].name})]},t.name)):e.jsx($,{type:v,value:z,onChange:t=>M(t.target.value),autoFocus:!0})}),e.jsxs("div",{style:{display:"flex",justifyContent:"flex-end",gap:"1rem",marginTop:"2rem"},children:[e.jsx(R,{onClick:b,style:{backgroundColor:"#6c757d"},children:"Cancelar"}),e.jsx(R,{onClick:p,primary:!0,children:"Aceptar"})]})]})})},ce=oe.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 6px;
  
  label { font-weight: bold; color: #495057; }
  input { width: 120px; text-align: right; }
`,kt=({isOpen:a,onClose:b,currentStats:o,onConfirm:C})=>{const[j,u]=l.useState("manual"),[r,v]=l.useState({efectivo:"",credito:"",tarjeta:"",dolares:""}),[w,g]=l.useState({cordobas:"",dolares:""}),T=(p,F)=>{v(t=>({...t,[p]:F}))},z=(p,F)=>{g(t=>({...t,[p]:F}))},M=()=>{const p=[];if(j==="manual")parseFloat(r.efectivo)&&p.push({target:"efectivo",amount:parseFloat(r.efectivo)}),parseFloat(r.credito)&&p.push({target:"credito",amount:parseFloat(r.credito)}),parseFloat(r.tarjeta)&&p.push({target:"tarjeta",amount:parseFloat(r.tarjeta)});else{const F=parseFloat(w.cordobas),t=parseFloat(w.dolares);if(!isNaN(F)){const d=Number((o==null?void 0:o.netCordobas)||0),s=F-d;Math.abs(s)>.01&&p.push({target:"efectivo",amount:s})}if(!isNaN(t)){const d=Number((o==null?void 0:o.netDolares)||0),s=t-d;Math.abs(s)>.01&&p.push({target:"dolares",amount:s})}}p.length>0&&C(p),b()};return a?e.jsx(ne,{style:{background:"rgba(0,0,0,0.95)",zIndex:9999},children:e.jsxs(pe,{style:{maxWidth:"450px",background:"#212529",color:"#fff",border:"1px solid #495057"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20},children:[e.jsxs("h2",{style:{margin:0,color:"#ffc107",display:"flex",alignItems:"center",gap:10},children:[e.jsx(at,{})," GOD MODE"]}),e.jsx(R,{$cancel:!0,onClick:b,style:{background:"transparent",color:"#6c757d",border:"none"},children:"✕"})]}),e.jsxs("div",{style:{display:"flex",gap:10,marginBottom:20},children:[e.jsx(R,{onClick:()=>u("manual"),style:{flex:1,background:j==="manual"?"#ffc107":"#343a40",color:j==="manual"?"#000":"#fff",border:"none"},children:"Ajuste Manual (+/-)"}),e.jsx(R,{onClick:()=>u("override"),style:{flex:1,background:j==="override"?"#ffc107":"#343a40",color:j==="override"?"#000":"#fff",border:"none"},children:"Fijar Monto (=)"})]}),j==="manual"?e.jsxs(e.Fragment,{children:[e.jsx("p",{style:{color:"#adb5bd",fontSize:"0.85rem",marginBottom:15},children:"Suma o resta cantidades a los contadores ocultamente."}),e.jsxs(ce,{style:{background:"#343a40"},children:[e.jsx("label",{style:{color:"#fff"},children:"Efectivo (C$)"}),e.jsx($,{type:"number",step:"0.01",placeholder:"+/- 0.00",value:r.efectivo,onChange:p=>T("efectivo",p.target.value),style:{background:"#495057",color:"#fff"}})]}),e.jsxs(ce,{style:{background:"#343a40"},children:[e.jsx("label",{style:{color:"#fff"},children:"Crédito"}),e.jsx($,{type:"number",step:"0.01",placeholder:"+/- 0.00",value:r.credito,onChange:p=>T("credito",p.target.value),style:{background:"#495057",color:"#fff"}})]}),e.jsxs(ce,{style:{background:"#343a40"},children:[e.jsx("label",{style:{color:"#fff"},children:"Tarjeta"}),e.jsx($,{type:"number",step:"0.01",placeholder:"+/- 0.00",value:r.tarjeta,onChange:p=>T("tarjeta",p.target.value),style:{background:"#495057",color:"#fff"}})]})]}):e.jsxs(e.Fragment,{children:[e.jsx("p",{style:{color:"#adb5bd",fontSize:"0.85rem",marginBottom:15},children:"Define EXACTAMENTE cuánto dinero físico hay. El sistema creará un ajuste mágico para cuadrar."}),e.jsxs("div",{style:{background:"#343a40",padding:10,borderRadius:6,marginBottom:10},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",color:"#aaa",marginBottom:5},children:[e.jsx("span",{children:"Sistema Actual:"}),e.jsxs("span",{children:["C$ ",Number((o==null?void 0:o.netCordobas)||0).toFixed(2)]})]}),e.jsxs(ce,{style:{background:"transparent",padding:0,marginBottom:0},children:[e.jsx("label",{style:{color:"#fff"},children:"Real en Caja (C$)"}),e.jsx($,{type:"number",step:"0.01",placeholder:"0.00",value:w.cordobas,onChange:p=>z("cordobas",p.target.value),style:{background:"#495057",color:"#fff",border:"1px solid #ffc107"}})]})]}),e.jsxs("div",{style:{background:"#343a40",padding:10,borderRadius:6},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",color:"#aaa",marginBottom:5},children:[e.jsx("span",{children:"Sistema Actual:"}),e.jsxs("span",{children:["$ ",Number((o==null?void 0:o.netDolares)||0).toFixed(2)]})]}),e.jsxs(ce,{style:{background:"transparent",padding:0,marginBottom:0},children:[e.jsx("label",{style:{color:"#fff"},children:"Real en Caja ($)"}),e.jsx($,{type:"number",step:"0.01",placeholder:"0.00",value:w.dolares,onChange:p=>z("dolares",p.target.value),style:{background:"#495057",color:"#fff",border:"1px solid #ffc107"}})]})]})]}),e.jsxs("div",{style:{marginTop:25,display:"flex",gap:10},children:[e.jsx(R,{onClick:b,style:{flex:1,background:"#495057",border:"none"},children:"Cancelar"}),e.jsxs(R,{onClick:M,style:{flex:1,background:"#ffc107",color:"#000",fontWeight:"bold",border:"none"},children:[e.jsx(ot,{style:{marginRight:6}})," ",j==="manual"?"APLICAR AJUSTE":"CUADRAR MÁGICAMENTE"]})]})]})}):null};export{Nt as C,wt as P,kt as S,St as a,zt as b,ct as c,Tt as d};

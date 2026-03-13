import{r as s,j as e,a1 as $e,a2 as We,aR as Le,A as ze,m as Me,a3 as Pe,a4 as _e,I as Ve,s as se,n as qe,u as Ge,R as Ae,aN as He,a_ as Be,ag as Oe,b0 as Ue,K as ke,x as Ne,b1 as Je,b2 as Ye,aU as Ke,ah as Qe,b3 as Xe,a6 as Ze,b4 as Ee,b5 as et,b6 as tt,ab as at,aS as ot,C as Re,q as rt,b7 as it,b8 as nt,b9 as st}from"./vendor-Bl8eSE-Q.js";import{d as lt,S as O,h as dt,i as ct,j as pt,M as ge,a as be,B as R,f as U,I as Fe}from"./POS.styles-D3cpvBqp.js";import"./AlertModal-D2382y5c.js";import{u as Ie,a as mt}from"./index-CWW3cZWH.js";const v=o=>{const h=Number(o);return isNaN(h)||!isFinite(h)?0:h};function xt(o){if(!Array.isArray(o)||o.length===0)return[];const h=new Set,a=[];for(const w of o)w.id&&h.has(w.id)||(w.id&&h.add(w.id),a.push(w));return a}const ft=(o,h=0,a=36.6)=>{const w=Math.max(0,v(h)),M=v(a)||36.6,N={ventasContado:[],devoluciones:[],cancelaciones:[],entradas:[],salidas:[],abonos:[],ajustes:[]};let d=0,l=0,T=0,m=0,F=0,z=0,I=0,c=0;const E=xt(Array.isArray(o)?o:[]);let t=0,x=0,p=0,u=0,$=0,i=0,y=0,W=0,J=0;for(const Y of E){let f=((Y==null?void 0:Y.type)||"").toLowerCase().trim();f=f.normalize("NFD").replace(/[\u0300-\u036f]/g,"");let j=(Y==null?void 0:Y.pagoDetalles)||{};if(typeof j=="string")try{j=JSON.parse(j)}catch{j={}}(!j||typeof j!="object")&&(j={});const D=v(Y.amount),le=v(j.totalVenta)||D,A=v(j.efectivo),V=v(j.dolares),ee=v(j.cambio),Q=v(j.ingresoCaja),L=v(j.tarjeta),b=v(j.transferencia),K=v(j.credito);let P=le||D;(f==="salida"||f.includes("devolucion")||f.includes("cancelacion")||f.includes("anulacion"))&&(P=-Math.abs(P));const B={...Y,pagoDetalles:j,displayAmount:P};if(f.startsWith("venta")||f.includes("abono")||f.includes("pedido")||f.includes("apartado")?(T+=L,m+=b,F+=K):f==="ajuste"&&(j.target==="tarjeta"&&(T+=D),j.target==="credito"&&(F+=D),j.target==="transferencia"&&(m+=D)),f.startsWith("venta")){if(A>.001||V>.001||ee>.001)d+=A-ee,l+=V,t+=A-ee,x+=V;else if(Q>.001)d+=Q,t+=Q;else{const q=L+b+K,k=le-q;k>.001&&(d+=k,t+=k)}p+=L,u+=b,$+=K}else if(f.includes("abono")||f.includes("liquidación")||f.includes("liquidacion")||f.includes("pedido")){if(V>.001)l+=V,d+=A,y+=V,i+=A;else if(A>.001)d+=A,i+=A;else if(Q>.001)d+=Q,i+=Q;else{const q=L+b,k=Math.max(0,D-q);d+=k,i+=k}W+=L,J+=b}else if(f==="entrada")d+=Math.abs(D);else if(f==="salida")d-=Math.abs(D);else if(f.includes("devolucion")||f.includes("cancelacion")||f.includes("anulacion"))if(j.ingresoCaja!==void 0&&j.ingresoCaja!==null)d+=v(j.ingresoCaja);else if(A>.001)d-=A;else{const q=L+b+K,k=Math.abs(D)-q;k>.001&&(d-=k)}else if(f==="ajuste")j.target==="efectivo"?(d+=D,j.hidden&&(c+=D)):j.target==="dolares"&&(l+=D);else{const q=L+b+K,k=D-q;Math.abs(k)>.001&&(d+=k)}f.startsWith("venta")||f.includes("abono")||f.includes("liquid")||f.includes("pedido")?I+=Math.abs(P):f.includes("devolucion")||f.includes("cancelacion")||f.includes("anulacion")?I-=Math.abs(P):(f==="ajuste"&&j.target==="ventas_totales"||f==="ajuste"&&j.target==="efectivo"&&D<0)&&(I+=D),f.startsWith("venta")?N.ventasContado.push(B):f.includes("devolucion")?(N.devoluciones.push(B),z+=Math.abs(P)):f.includes("cancelacion")||f.includes("anulacion")?(N.cancelaciones.push(B),z+=Math.abs(P)):f==="entrada"?N.entradas.push(B):f==="salida"?N.salidas.push(B):f.includes("abono")?N.abonos.push(B):f==="ajuste"&&N.ajustes.push(B)}d=v(d),l=v(l),T=v(T),m=v(m),F=v(F),I=v(I),c=v(c),z=v(z);const Z=w+d,C=Z+l*M;return{cajaInicial:w,netCordobas:d,netDolares:l,efectivoEsperado:v(C),efectivoEsperadoCordobas:v(Z),efectivoEsperadoDolares:l,totalVentasDia:v(I),totalTarjeta:T,totalTransferencia:m,totalCredito:F,totalNoEfectivo:v(T+m+F),sumDevolucionesCancelaciones:z,totalHidden:c,tasaRef:M,lists:N,vEfectivoC:v(t),vEfectivoD:v(x),vTarjeta:v(p),vTransf:v(u),vCredito:v($),aEfectivoC:v(i),aEfectivoD:v(y),aTarjeta:v(W),aTransf:v(J)}},je=o=>Number(o||0).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}),De=se.button`
  display: flex; align-items: center; justify-content: center;
  width: 42px; height: 42px;
  border: 1px solid ${o=>o.$active?"#3b82f6":"#cbd5e1"};
  background-color: ${o=>o.$active?"#eff6ff":"#fff"};
  color: ${o=>o.$active?"#3b82f6":"#64748b"};
  border-radius: 8px; cursor: pointer; transition: all 0.2s;

  &:hover { border-color: #3b82f6; color: #3b82f6; }
`,gt=({isOpen:o,imageSrc:h,onClose:a})=>!o||!h?null:e.jsx(ge,{onClick:a,children:e.jsxs(Me.div,{initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},onClick:w=>w.stopPropagation(),style:{position:"relative",maxWidth:"95%",maxHeight:"90vh"},children:[e.jsx("button",{onClick:a,style:{position:"absolute",top:-15,right:-15,background:"white",width:32,height:32,borderRadius:"50%",border:"none",cursor:"pointer",boxShadow:"0 4px 6px rgba(0,0,0,0.1)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10,color:"#ef4444"},children:e.jsx(qe,{})}),e.jsx("img",{src:h,alt:"Vista Ampliada",style:{maxWidth:"100%",maxHeight:"85vh",borderRadius:"12px",boxShadow:"0 20px 25px rgba(0,0,0,0.2)",background:"white",objectFit:"contain"}})]})});function zt({products:o=[],searchTerm:h,setSearchTerm:a,onProductClick:w,cartItems:M=[],reservedStock:N,inputRef:d,searchType:l="description",setSearchType:T=()=>{},isWholesale:m=!1}){const[F,z]=s.useState({isOpen:!1,imageUrl:null}),I=s.useMemo(()=>{const t=new Map;for(const x of M){const p=x.id_producto||x.id;t.set(p,(t.get(p)||0)+Number(x.quantity||0))}return t},[M]),c=s.useMemo(()=>{const t=(h||"").toLowerCase().trim();return o.filter(p=>{const u=i=>i?String(i).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase():"",$=u(t);if(!$)return!0;if(l==="code"){const i=u(p.codigo),y=u(p.codigo_barras);return i.startsWith($)||y.startsWith($)}else{const i=u(p.nombre),y=u(p.descripcion),W=u(p.codigo);return i.includes($)||y.includes($)||W.includes($)}}).slice(0,100)},[o,h,l]),E=s.useMemo(()=>{const t=(h||"").toLowerCase().trim();return t?o.filter(x=>{const p=(x.nombre||"").toLowerCase(),u=String(x.codigo||"").toLowerCase();return p.includes(t)||u.includes(t)}).length:o.length},[o,h]);return e.jsxs(lt,{children:[e.jsxs("div",{style:{display:"flex",gap:"8px",marginBottom:"1rem",alignItems:"center"},children:[e.jsx(O,{ref:d,placeholder:l==="code"?"Escribe código...":"Buscar producto...",value:h,onChange:t=>a(t.target.value),onKeyDown:t=>{if(t.key==="Enter"){const x=(h||"").trim().toLowerCase();if(!x)return;const p=o.find(u=>String(u.codigo||"").toLowerCase()===x||String(u.codigo_barras||"").toLowerCase()===x);if(p){w(p),a("");return}c.length===1&&(w(c[0]),a(""))}}}),e.jsx(De,{$active:l==="description",onClick:()=>{var t;T("description"),(t=d.current)==null||t.focus()},title:"Buscar por Nombre",children:e.jsx($e,{size:16})}),e.jsx(De,{$active:l==="code",onClick:()=>{var t;T("code"),(t=d.current)==null||t.focus()},title:"Buscar por Código",children:e.jsx(We,{size:18})})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"8px",padding:"0 4px",fontSize:"0.85rem",color:"#64748b"},children:[e.jsxs("span",{children:[e.jsx(Le,{color:"#3b82f6"})," ",c.length," mostrados"]}),e.jsxs("span",{children:["Total: ",E]})]}),e.jsx(dt,{children:e.jsx(ze,{children:c.map((t,x)=>{const p=t.id_producto||t.id,u=I.get(p)||0,$=(N==null?void 0:N.get(p))||0,i=Math.max(0,Number(t.existencia||0)-u-$),y=i<=0;return e.jsxs(ct,{as:Me.div,initial:{opacity:0,scale:.95},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.95},transition:{duration:.15},whileHover:y?{}:{scale:1.02,y:-4},whileTap:y?{}:{scale:.96},onClick:()=>!y&&w(t),outOfStock:y,title:t.nombre,children:[e.jsx(pt,{lowstock:i<5&&!y,outOfStock:y,children:y?"Agotado":`Stock: ${i}`}),e.jsxs("div",{className:"image-placeholder",style:{position:"relative",height:160,background:"#f8fafc",display:"flex",alignItems:"center",justifyContent:"center",borderBottom:"1px solid #f1f5f9",overflow:"hidden"},children:[t.imagen&&e.jsx("div",{className:"eye-icon",onClick:W=>{W.stopPropagation(),z({isOpen:!0,imageUrl:t.imagen})},style:{position:"absolute",top:10,left:10,zIndex:20,background:"white",borderRadius:"50%",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 6px rgba(0,0,0,0.1)",cursor:"pointer",transition:"transform 0.2s"},title:"Ver imagen",children:e.jsx(Pe,{size:14,color:"#64748b"})}),t.imagen?e.jsx("img",{src:t.imagen,alt:t.nombre,loading:"lazy",style:{maxWidth:"100%",maxHeight:"100%",objectFit:"contain"}}):e.jsx(_e,{className:"no-image-icon",size:40,color:"#e2e8f0"})]}),e.jsxs("div",{className:"info",style:{padding:"12px",flex:1,display:"flex",flexDirection:"column",gap:"4px"},children:[e.jsx("div",{className:"product-name",style:{fontWeight:600,fontSize:"0.88rem",color:"#1e293b",lineHeight:"1.25",height:"3.8rem",overflow:"hidden",display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical"},children:t.nombre}),e.jsx("div",{style:{fontSize:"0.85rem",fontWeight:"bold",color:"#334155",marginBottom:"4px"},children:t.codigo||"S/C"}),m?e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:{fontSize:"0.75rem",color:"#64748b",display:"flex",alignItems:"center",gap:"4px",marginTop:"auto",marginBottom:"1px",textDecoration:"line-through"},children:["Tienda: C$ ",je(t.precio_venta||t.precio)]}),e.jsxs("div",{className:"price",style:{fontWeight:800,color:"#8b5cf6",fontSize:"1.1rem"},children:["C$ ",je(t.mayorista||t.mayoreo||t.distribuidor||t.taller||t.precio_venta)]})]}):e.jsxs(e.Fragment,{children:[(Number(t.mayorista)>0||Number(t.mayoreo)>0||Number(t.distribuidor)>0||Number(t.taller)>0)&&e.jsxs("div",{style:{fontSize:"0.75rem",color:"#10b981",display:"flex",alignItems:"center",gap:"4px",marginTop:"auto",marginBottom:"1px"},children:[e.jsx(Ve,{size:10})," May: C$ ",je(t.mayorista||t.mayoreo||t.distribuidor||t.taller)]}),e.jsxs("div",{className:"price",style:{fontWeight:800,color:"#2563eb",fontSize:"1.05rem",marginTop:Number(t.mayorista)>0||Number(t.mayoreo)>0||Number(t.distribuidor)>0||Number(t.taller)>0?0:"auto"},children:["C$ ",je(t.precio_venta||t.precio)]})]})]})]},p)})})}),e.jsx(ze,{children:F.isOpen&&e.jsx(gt,{isOpen:!0,imageSrc:F.imageUrl,onClose:()=>z({isOpen:!1,imageUrl:null})})})]})}const ht=Ae.memo(()=>e.jsx("style",{children:`
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
  `})),bt=se.div`
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
`,kt=({currentUser:o,isCajaOpen:h,session:a,onOpenCaja:w,onCloseCaja:M,onClose:N,isAdmin:d,showConfirmation:l,showAlert:T,initialTasaDolar:m,clients:F=[]})=>{var ue,n;const[z,I]=s.useState(""),[c,E]=s.useState(m||36.6),[t,x]=s.useState(""),[p,u]=s.useState(!1),$=Ge(),i=(o==null?void 0:o.id_usuario)||(o==null?void 0:o.id);let y=(ue=a==null?void 0:a.openedBy)==null?void 0:ue.name;!y&&(a!=null&&a.openedBy)&&typeof a.openedBy=="string"&&(y=a.openedBy),y||(y=(a==null?void 0:a.userId)===i?(o==null?void 0:o.nombre_usuario)||(o==null?void 0:o.username):"Usuario"),y||(y="Caja General");const W=d||(a==null?void 0:a.userId)===i||((n=a==null?void 0:a.openedBy)==null?void 0:n.id)===i,J=s.useMemo(()=>Array.isArray(a==null?void 0:a.transactions)?a.transactions:[],[a]),Z=s.useMemo(()=>{const r=ft(J,(a==null?void 0:a.initialAmount)||0,(a==null?void 0:a.tasaDolar)||m);return a!=null&&a.stats&&a.stats.vEfectivoC!==void 0?{...a.stats,lists:a.stats.lists||r.lists}:r},[J,a,m]),{cajaInicial:C,netCordobas:Y,netDolares:f,efectivoEsperado:j,efectivoEsperadoCordobas:D,efectivoEsperadoDolares:le,totalTarjeta:A,totalTransferencia:V,totalCredito:ee,totalNoEfectivo:Q,sumDevolucionesCancelaciones:L,totalHidden:b,tasaRef:K,vEfectivoC:P,vEfectivoD:pe,vTarjeta:B,vTransf:q,vCredito:k,aEfectivoC:me,aEfectivoD:re,aTarjeta:ne,aTransf:te,lists:{ventasContado:xe,devoluciones:oe,cancelaciones:Se,entradas:X,salidas:G,abonos:ie}}=Z,de=(P||0)+(pe||0)*K+(B||0)+(q||0)+(k||0)+(me||0)+(re||0)*K+(ne||0)+(te||0)-(L||0),_=Number(t||0)-j;a!=null&&a.openedAt&&new Date(a.openedAt);const ye=()=>{const r=parseFloat(z||0);if(isNaN(r)||r<0)return T({title:"Inválido",message:"Monto inicial >= 0"});w(r,Number(c||36.6))},ve=()=>{if(isNaN(parseFloat(t)))return T({title:"Requerido",message:"Ingrese el monto contado físico."});u(!0)},Ce=Ae.useCallback(()=>{const r=document.getElementById("print-wrapper-caja");if(!r)return;const S=r.outerHTML,H=`
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
      `,ae=window.open("","_blank","width=500,height=600");ae&&(ae.document.write(`<html><head><title>Cierre Caja</title><style>${H}</style></head><body>${S}</body></html>`),ae.document.close(),ae.focus(),ae.onload=function(){setTimeout(()=>{ae.print()},300)},ae.onafterprint=()=>{try{ae.close()}catch{}})},[]),we=()=>{Ce(),setTimeout(()=>{M(Number(t))},800)},g=r=>`C$${Number(r||0).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`,fe=r=>`$${Number(r||0).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`;return e.jsxs(ge,{className:"no-print",children:[e.jsx(ht,{}),e.jsxs(be,{style:{maxWidth:p?450:760,padding:p?0:"1.5rem",background:"#f8f9fa"},children:[!p&&e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12},children:[e.jsx("h2",{style:{margin:0},children:"Gestión de Caja"}),e.jsx(R,{$cancel:!0,onClick:N,style:{borderRadius:"50%",width:32,height:32,padding:0},children:"✕"})]}),h?p?e.jsxs("div",{style:{display:"flex",flexDirection:"column",height:"100%",maxHeight:"90vh"},children:[e.jsxs("div",{style:{padding:"15px 20px",background:"#343a40",color:"#fff",display:"flex",justifyContent:"space-between",alignItems:"center",borderRadius:"8px 8px 0 0"},children:[e.jsxs("div",{children:[e.jsx("h3",{style:{margin:0,fontSize:"1.2rem",fontWeight:"800",letterSpacing:"0.5px"},children:"REPORTAR CIERRE DE CAJA"}),e.jsx("p",{style:{margin:0,fontSize:"0.9rem",opacity:.8},children:new Date().toLocaleString("es-NI")})]}),e.jsxs(R,{$cancel:!0,onClick:()=>u(!1),style:{padding:"8px 15px",fontSize:"0.9rem",background:"rgba(255,255,255,0.2)",border:"none"},children:[e.jsx(Be,{})," Volver / Editar"]})]}),e.jsxs("div",{style:{flex:1,overflowY:"auto",background:"#f8f9fa",padding:"20px"},children:[e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:15,marginBottom:20},children:[e.jsxs("div",{style:{background:"#fff",padding:15,borderRadius:8,boxShadow:"0 2px 5px rgba(0,0,0,0.05)",borderLeft:"4px solid #007bff"},children:[e.jsx("div",{style:{fontSize:"0.8rem",color:"#666",textTransform:"uppercase"},children:"Ingresos Totales Netos"}),e.jsx("div",{style:{fontSize:"1.5rem",fontWeight:"800",color:"#333"},children:g(de)})]}),e.jsxs("div",{style:{background:"#fff",padding:15,borderRadius:8,boxShadow:"0 2px 5px rgba(0,0,0,0.05)",borderLeft:"4px solid #28a745"},children:[e.jsx("div",{style:{fontSize:"0.8rem",color:"#666",textTransform:"uppercase"},children:"Efectivo Real"}),e.jsx("div",{style:{fontSize:"1.5rem",fontWeight:"800",color:"#28a745"},children:g(t)})]}),e.jsxs("div",{style:{background:"#fff",padding:15,borderRadius:8,boxShadow:"0 2px 5px rgba(0,0,0,0.05)",borderLeft:`4px solid ${_<0?"#dc3545":"#ffc107"}`},children:[e.jsx("div",{style:{fontSize:"0.8rem",color:"#666",textTransform:"uppercase"},children:"Diferencia"}),e.jsxs("div",{style:{fontSize:"1.5rem",fontWeight:"800",color:_!==0?_<0?"#dc3545":"#e0a800":"#28a745"},children:[_>0?"+":"",g(_)]})]})]}),e.jsxs("div",{style:{background:"#fff",padding:20,borderRadius:8,boxShadow:"0 2px 10px rgba(0,0,0,0.05)",marginBottom:20},children:[e.jsx("h4",{style:{margin:"0 0 15px",borderBottom:"1px solid #eee",paddingBottom:10},children:"Arqueo Detallado"}),e.jsx("table",{style:{width:"100%",borderCollapse:"collapse"},children:e.jsxs("tbody",{children:[e.jsxs("tr",{style:{borderBottom:"1px solid #f1f1f1"},children:[e.jsx("td",{style:{padding:10},children:"Fondo Inicial"}),e.jsx("td",{className:"text-right",style:{padding:10,fontWeight:"bold"},children:g(C)})]}),e.jsx("tr",{style:{background:"#f8f9fa"},children:e.jsx("td",{colSpan:"2",style:{padding:"8px 10px",fontSize:"0.85rem",fontWeight:"bold",color:"#007bff"},children:"RESUMEN DE INGRESOS"})}),e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"4px 10px 4px 20px",fontSize:"0.9rem"},children:"(+) Ventas Netas (Ventas + Abonos - Devoluciones)"}),e.jsx("td",{className:"text-right",style:{padding:"4px 10px",fontSize:"0.9rem"},children:g(de)})]}),L>0&&e.jsxs("tr",{children:[e.jsxs("td",{style:{padding:"4px 10px 4px 20px",fontSize:"0.85rem",color:"#856404"},children:["    (Devoluciones/Cancel. ya descontadas: ",g(L),")"]}),e.jsx("td",{})]}),e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"4px 10px 4px 20px",fontSize:"0.9rem",color:"#dc3545"},children:"(-) Tarjetas / Transf / Crédito"}),e.jsxs("td",{className:"text-right",style:{padding:"4px 10px",fontSize:"0.9rem",color:"#dc3545"},children:["- ",g(Q)]})]}),A>0&&e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"2px 10px 2px 35px",fontSize:"0.82rem",color:"#6c757d"},children:"💳 Tarjeta"}),e.jsx("td",{className:"text-right",style:{padding:"2px 10px",fontSize:"0.82rem",color:"#6c757d"},children:g(A)})]}),V>0&&e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"2px 10px 2px 35px",fontSize:"0.82rem",color:"#6c757d"},children:"🏦 Transferencia"}),e.jsx("td",{className:"text-right",style:{padding:"2px 10px",fontSize:"0.82rem",color:"#6c757d"},children:g(V)})]}),ee>0&&e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"2px 10px 2px 35px",fontSize:"0.82rem",color:"#6c757d"},children:"📋 Crédito"}),e.jsx("td",{className:"text-right",style:{padding:"2px 10px",fontSize:"0.82rem",color:"#6c757d"},children:g(ee)})]}),X.length>0&&e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"4px 10px 4px 20px",fontSize:"0.9rem",color:"#28a745"},children:"(+) Entradas de Efectivo"}),e.jsxs("td",{className:"text-right",style:{padding:"4px 10px",fontSize:"0.9rem",color:"#28a745"},children:["+ ",g(X.reduce((r,S)=>r+Math.abs(S.displayAmount||0),0))]})]}),e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"4px 10px 4px 20px",fontSize:"0.9rem",color:"#dc3545"},children:"(-) Salidas de Efectivo"}),e.jsxs("td",{className:"text-right",style:{padding:"4px 10px",fontSize:"0.9rem",color:"#dc3545"},children:["- ",g(G.reduce((r,S)=>r+Math.abs(S.displayAmount||0),0))]})]}),e.jsxs("tr",{style:{borderBottom:"1px solid #f1f1f1",background:"#e8f5e9"},children:[e.jsx("td",{style:{padding:10,fontWeight:"bold",fontSize:"1.1rem"},children:"Esperado en Caja"}),e.jsx("td",{className:"text-right",style:{padding:10,fontWeight:"bold",fontSize:"1.1rem",color:"#146c43"},children:g(j)})]})]})})]}),(ie.length>0||X.length>0||G.length>0)&&e.jsxs("div",{style:{background:"#fff",padding:20,borderRadius:8,boxShadow:"0 2px 10px rgba(0,0,0,0.05)"},children:[e.jsx("h4",{style:{margin:"0 0 15px",borderBottom:"1px solid #eee",paddingBottom:10},children:"Detalle de Movimientos"}),X.length>0&&e.jsxs("div",{style:{marginBottom:15},children:[e.jsx("h5",{style:{color:"#28a745",margin:"0 0 5px"},children:"Entradas de Caja"}),X.map((r,S)=>e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px dashed #eee"},children:[e.jsx("div",{children:r.note||"Entrada Varia"}),e.jsxs("div",{style:{fontWeight:"bold",color:"#28a745"},children:["+ ",g(Math.abs(r.amount))]})]},S))]}),ie.length>0&&e.jsxs("div",{style:{marginBottom:15},children:[e.jsx("h5",{style:{color:"#007bff",margin:"0 0 5px"},children:"Abonos Recibidos"}),ie.map((r,S)=>e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px dashed #eee"},children:[e.jsxs("div",{children:[e.jsx("strong",{children:r.resolvedClientName||"Cliente General"}),e.jsx("div",{style:{fontSize:"0.8rem",color:"#666"},children:r.note||"Abono de cuenta"})]}),e.jsxs("div",{style:{fontWeight:"bold",color:"#28a745"},children:["+ ",g(r.amount)]})]},S))]}),G.length>0&&e.jsxs("div",{children:[e.jsx("h5",{style:{color:"#dc3545",margin:"0 0 5px"},children:"Salidas de Caja"}),G.map((r,S)=>e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px dashed #eee"},children:[e.jsx("div",{children:r.note||"Salida Varia"}),e.jsx("div",{style:{fontWeight:"bold",color:"#dc3545"},children:g(Math.abs(r.amount))})]},S))]})]})]}),e.jsx("div",{style:{display:"none"},children:e.jsxs(bt,{id:"print-wrapper-caja",className:"print-80",children:[e.jsxs("div",{className:"brand",children:[e.jsx("img",{src:"/icons/logo.png",alt:"Logo",style:{filter:"grayscale(100%) contrast(150%)"}}),e.jsx("h2",{children:"CIERRE DE CAJA"}),e.jsx("p",{children:"Multirepuestos RG"}),e.jsx("p",{children:new Date().toLocaleString("es-NI")}),e.jsxs("p",{children:["Cajero: ",y]})]}),e.jsxs("div",{className:"section",children:[e.jsx("div",{className:"section-title",children:"1. INGRESOS TOTALES NETOS"}),e.jsxs("div",{className:"row big",children:[e.jsx("span",{children:"TOTAL NETO:"}),e.jsx("span",{children:g(de)})]}),e.jsx("div",{className:"row sub",children:"(Ventas + Abonos - Devoluciones/Cancelaciones)"}),L>0&&e.jsxs("div",{className:"row sub",style:{color:"#856404"},children:["(Devol./Cancel.: -",g(L),")"]})]}),e.jsxs("div",{className:"section",children:[e.jsx("div",{className:"section-title",children:"2. DESGLOSE NO EFECTIVO"}),A>0&&e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"(-) Tarjetas:"}),e.jsx("span",{children:g(A)})]}),V>0&&e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"(-) Transf.:"}),e.jsx("span",{children:g(V)})]}),ee>0&&e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"(-) Créditos:"}),e.jsx("span",{children:g(ee)})]}),e.jsxs("div",{className:"row",style:{borderTop:"1px dashed #000"},children:[e.jsx("span",{children:"TOTAL NO EFECTIVO:"}),e.jsx("span",{children:g(Q)})]})]}),e.jsxs("div",{className:"section",children:[e.jsx("div",{className:"section-title",children:"3. FLUJO EFECTIVO (RESUMEN)"}),e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"Fondo Inicial:"}),e.jsx("span",{children:g(C)})]}),e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"(+) Ingresos Netos:"}),e.jsx("span",{children:g(de)})]}),e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"(-) No Efectivo:"}),e.jsxs("span",{children:["-",g(Q)]})]}),Math.abs(G.reduce((r,S)=>r+Math.abs(S.displayAmount||0),0))>0&&e.jsxs("div",{className:"row",children:[e.jsx("span",{children:"(-) Salidas:"}),e.jsxs("span",{children:["-",g(G.reduce((r,S)=>r+Math.abs(S.displayAmount||0),0))]})]})]}),e.jsxs("div",{className:"section",children:[e.jsx("div",{className:"section-title",children:"4. ARQUEO FINAL"}),e.jsxs("div",{className:"row big",children:[e.jsx("span",{children:"EFECTIVO ESPERADO:"}),e.jsx("span",{children:g(j)})]}),e.jsxs("div",{className:"row sub",children:["(",g(D)," + ",fe(le),")"]}),e.jsxs("div",{className:"row",style:{marginTop:8,paddingTop:4,borderTop:"1px dashed #ccc"},children:[e.jsx("span",{children:"EFECTIVO REAL:"}),e.jsx("span",{children:g(t)})]}),e.jsxs("div",{className:"row alert",style:{color:"#000",borderColor:"#000"},children:[e.jsx("span",{children:"DIFERENCIA:"}),e.jsxs("span",{children:[_>0?"+":"",g(_)]})]}),e.jsx("div",{style:{textAlign:"center",fontSize:"0.75rem",fontWeight:"bold",marginTop:2},children:Math.abs(_)<.5?"(CAJA CUADRADA)":_>0?"(SOBRANTE)":"(FALTANTE)"})]}),e.jsxs("div",{className:"section",children:[e.jsx("div",{className:"section-title",children:"5. DETALLE DE MOVIMIENTOS"}),e.jsx("table",{style:{marginTop:0},children:e.jsxs("tbody",{children:[ie.length>0&&e.jsxs(e.Fragment,{children:[e.jsx("tr",{children:e.jsx("td",{colSpan:"2",style:{fontWeight:"900",background:"#f8f9fa",fontSize:"0.9rem"},children:"--- ABONOS Y CREDITOS ---"})}),ie.map((r,S)=>e.jsxs("tr",{children:[e.jsxs("td",{style:{fontSize:"0.9rem"},children:[r.resolvedClientName||r.note||"Abono"," ",e.jsx("br",{}),e.jsxs("span",{style:{fontSize:"0.75rem",color:"#555"},children:["#",r.id]})]}),e.jsx("td",{className:"text-right",style:{fontSize:"0.9rem"},children:g(r.amount)})]},"a"+S))]}),G.length>0&&e.jsxs(e.Fragment,{children:[e.jsx("tr",{children:e.jsx("td",{colSpan:"2",style:{fontWeight:"900",background:"#f8f9fa",fontSize:"0.9rem",paddingTop:8},children:"--- SALIDAS DE EFECTIVO ---"})}),G.map((r,S)=>e.jsxs("tr",{children:[e.jsx("td",{style:{fontSize:"0.9rem"},children:r.note||"Salida Varia"}),e.jsx("td",{className:"text-right",style:{fontSize:"0.9rem"},children:g(Math.abs(r.amount))})]},"s"+S))]}),X.length>0&&e.jsxs(e.Fragment,{children:[e.jsx("tr",{children:e.jsx("td",{colSpan:"2",style:{fontWeight:"900",background:"#f8f9fa",fontSize:"0.9rem",paddingTop:8},children:"--- ENTRADAS DE EFECTIVO ---"})}),X.map((r,S)=>e.jsxs("tr",{children:[e.jsx("td",{style:{fontSize:"0.9rem"},children:r.note||"Entrada Varia"}),e.jsx("td",{className:"text-right",style:{fontSize:"0.9rem"},children:g(r.amount)})]},"e"+S))]})]})}),ie.length===0&&G.length===0&&X.length===0&&e.jsx("div",{style:{textAlign:"center",fontStyle:"italic",fontSize:"0.8rem",padding:5},children:"Sin movimientos extra"})]}),e.jsxs("div",{className:"signature",children:[e.jsx("div",{className:"signature-line"}),e.jsx("p",{children:"Firma Responsable"})]})]})}),e.jsxs("div",{style:{padding:"20px",background:"#fff",borderTop:"1px solid #ccc",display:"flex",gap:10,justifyContent:"flex-end"},children:[e.jsx(R,{$cancel:!0,onClick:()=>u(!1),children:"Seguir Editando"}),e.jsxs(R,{primary:!0,style:{padding:"12px 24px",fontSize:"1rem",display:"flex",alignItems:"center",gap:8},onClick:we,disabled:!W,children:[e.jsx(Oe,{})," IMPRIMIR Y CERRAR CAJA"]})]}),!W&&e.jsx("div",{style:{padding:5,textAlign:"center",color:"red",fontSize:"0.8rem"},children:"Solo el Admin o quien abrió puede cerrar."})]}):e.jsxs("div",{children:[e.jsx("h3",{style:{color:"#dc3545",borderBottom:"2px solid #dc3545",paddingBottom:10},children:"Arqueo y Cierre"}),e.jsx("div",{style:{background:"#e9ecef",padding:10,borderRadius:6,marginBottom:15},children:e.jsxs(U,{style:{fontSize:"1.1rem"},children:[e.jsxs("span",{children:[e.jsx(Ue,{})," Abrió:"]}),e.jsx("strong",{children:y})]})}),e.jsxs("div",{style:{marginTop:8,padding:"15px",backgroundColor:"#f8f9fa",borderRadius:6,border:"1px dashed #ced4da"},children:[e.jsx("div",{style:{fontWeight:"800",marginBottom:10,fontSize:"1.2rem",color:"#495057"},children:"Efectivo a Tener:"}),e.jsxs(U,{style:{fontSize:"1.3rem"},children:[e.jsx("span",{children:"Córdobas:"}),e.jsxs("strong",{style:{color:"#198754"},children:["C$ ",Number(D).toLocaleString()]})]}),e.jsxs(U,{style:{fontSize:"1.3rem"},children:[e.jsx("span",{children:"Dólares:"}),e.jsxs("strong",{style:{color:"#198754"},children:["$ ",Number(le).toLocaleString()]})]}),e.jsxs(U,{$bold:!0,style:{marginTop:10,borderTop:"2px solid #ccc",paddingTop:10,fontSize:"1.5rem"},children:[e.jsx("span",{children:"TOTAL (C$):"}),e.jsx("span",{children:g(j)})]})]}),Q>0&&e.jsxs("div",{style:{marginTop:12,padding:"12px 15px",backgroundColor:"#fff3cd",borderRadius:6,border:"1px solid #ffc107"},children:[e.jsx("div",{style:{fontWeight:"800",marginBottom:8,fontSize:"1rem",color:"#856404"},children:"Desglose No Efectivo:"}),A>0&&e.jsxs(U,{style:{fontSize:"1.1rem"},children:[e.jsx("span",{children:"💳 Tarjeta:"}),e.jsx("strong",{children:g(A)})]}),V>0&&e.jsxs(U,{style:{fontSize:"1.1rem"},children:[e.jsx("span",{children:"🏦 Transferencia:"}),e.jsx("strong",{children:g(V)})]}),ee>0&&e.jsxs(U,{style:{fontSize:"1.1rem"},children:[e.jsx("span",{children:"📋 Crédito:"}),e.jsx("strong",{children:g(ee)})]}),e.jsxs(U,{$bold:!0,style:{marginTop:6,borderTop:"1px dashed #856404",paddingTop:6,fontSize:"1.15rem",color:"#856404"},children:[e.jsx("span",{children:"Total No Efectivo:"}),e.jsx("span",{children:g(Q)})]})]}),e.jsx("label",{style:{display:"block",marginTop:20,fontWeight:800,fontSize:"1.3rem"},children:"Monto Contado Físico (C$)"}),e.jsx(O,{type:"number",step:"0.01",value:t,onChange:r=>x(r.target.value),autoFocus:!0,placeholder:"Total Billetes + Monedas",style:{fontSize:"1.5rem",padding:"12px",height:"auto"}}),t&&e.jsxs(U,{$bold:!0,style:{marginTop:15,color:_!==0?"#dc3545":"#28a745",fontSize:"1.8rem",padding:"10px",background:_!==0?"#fff5f5":"#f0fff4",borderRadius:8,border:`2px solid ${_!==0?"#dc3545":"#28a745"}`},children:[e.jsx("span",{children:"Diferencia:"}),e.jsx("span",{children:g(_)})]}),e.jsxs("div",{style:{display:"flex",gap:10,marginTop:20},children:[e.jsx(R,{primary:!0,style:{flex:1},onClick:ve,disabled:!W||!t,children:"Ver Reporte"}),e.jsx(R,{$cancel:!0,onClick:N,children:"Cancelar"})]})]}):e.jsxs("div",{style:{padding:p?"1rem":0},children:[e.jsxs("h3",{style:{color:"#28a745",borderBottom:"2px solid #28a745",paddingBottom:10},children:[e.jsx(He,{})," Abrir Caja"]}),e.jsxs("div",{style:{display:"grid",gap:12},children:[e.jsx("label",{style:{fontWeight:600},children:"Monto Inicial (C$)"}),e.jsx(O,{type:"number",step:"0.01",value:z,onChange:r=>I(r.target.value),autoFocus:!0}),e.jsx("label",{style:{fontWeight:600},children:"Tasa del Dólar"}),e.jsx(O,{type:"number",step:"0.01",value:c,onChange:r=>E(r.target.value)})]}),e.jsxs("div",{style:{marginTop:20,display:"flex",gap:10},children:[e.jsx(R,{primary:!0,style:{flex:1},onClick:ye,children:"Abrir Caja"}),e.jsx(R,{onClick:()=>$("/dashboard"),children:"Ir al Dashboard"})]})]})]})]})},he=o=>{const h=parseFloat(o);return Number.isNaN(h)||Math.abs(h)<.001?0:h},Et=({total:o=0,tasaDolar:h=1,onClose:a,onFinishSale:w,clientes:M=[],empleados:N=[],users:d=[],showAlert:l,initialClientId:T="0",cartSnapshot:m=[],currentUserId:F=void 0,orderSubtotal:z=void 0,orderDiscountAmount:I=void 0})=>{const[c,E]=s.useState("0.00"),[t,x]=s.useState("0.00"),[p,u]=s.useState("0.00"),[$,i]=s.useState("0.00"),[y,W]=s.useState(""),[J,Z]=s.useState(""),[C,Y]=s.useState("contado"),[f,j]=s.useState(T??"0"),[D,le]=s.useState(""),[A,V]=s.useState(!1),[ee,Q]=s.useState(!1),L=s.useMemo(()=>{const n=parseInt(f,10);return Number.isNaN(n)?0:n},[f]),b=L!==0,K=s.useMemo(()=>he(c),[c]),P=s.useMemo(()=>he(t),[t]),pe=s.useMemo(()=>he(p),[p]),B=s.useMemo(()=>he($),[$]),q=s.useMemo(()=>pe*Number(h||1),[pe,h]),k=s.useMemo(()=>K+P+B+q,[K,P,B,q]),me=s.useMemo(()=>P>.01,[P]),re=s.useMemo(()=>Number(o)-k,[o,k]),ne=s.useMemo(()=>C==="credito"&&b&&re>.01?re:(k>=Number(o)-1e-4,0),[C,b,re,k,o]),te=s.useMemo(()=>{const n=he(re);return n<=.01||C==="credito"&&b?0:n},[re,C,b]),xe=s.useMemo(()=>Math.max(0,-re),[re]),oe=s.useMemo(()=>ne>.01?k>.01?"mixto":"credito_total":"contado",[ne,k]),Se=s.useMemo(()=>{if(te>.01)return"PAGO INCOMPLETO";if((oe==="mixto"||oe==="credito_total")&&!b)return"CLIENTE NO SELECCIONADO";switch(oe){case"mixto":return"PAGO MIXTO (Contado + Crédito)";case"credito_total":return"CRÉDITO TOTAL";default:return"CONTADO"}},[oe,te,b]),X=s.useMemo(()=>C==="credito"&&!b,[C,b]),G=s.useMemo(()=>A||te>.01||(oe==="mixto"||oe==="credito_total")&&!b||me&&!y.trim()||B>.01&&!J.trim(),[A,te,oe,b,me,y,B,J]),ie=s.useMemo(()=>Array.isArray(m)?m.map(({raw:n,costo:r,existencia:S,...H})=>({id:H.id||H.id_producto,nombre:H.nombre??H.descripcion??H.producto??"",quantity:Number(H.quantity||0),precio:Number(H.precio_venta??H.precio??0)})).filter(n=>n.quantity>0):[],[m]),de=s.useMemo(()=>typeof z=="number"?Number(z):ie.reduce((n,r)=>n+Number(r.precio||0)*Number(r.quantity||0),0),[z,ie]);s.useMemo(()=>{if(typeof I=="number")return Number(I);const n=Number(de)-Number(o);return n>0?n:0},[I,de,o]),s.useEffect(()=>{C==="contado"&&k===0&&Number(o)>0&&E(Number(o).toFixed(2)),C==="credito"&&!b&&j("0")},[C,o]);const _=s.useCallback(n=>{const r=String(n.target.value);j(r),(parseInt(r,10)||0)!==0&&(Y("contado"),k<Number(o)&&k===0&&E(Number(o).toFixed(2)))},[k,o]),ye=s.useCallback(()=>{Y("contado");const n=P+B+q,r=Math.max(0,Number(o)-n);E(Number(r).toFixed(2))},[P,B,q,o]),ve=s.useCallback(()=>{if(!b){l==null||l({title:"Cliente Requerido",message:"Debe seleccionar un cliente para habilitar la opción de Crédito.",type:"error"});return}Y("credito"),E("0.00"),x("0.00"),u("0.00"),i("0.00"),W(""),Z("")},[b,l]),Ce=s.useCallback(()=>{E(Number(o).toFixed(2)),x("0.00"),u("0.00"),i("0.00"),W(""),Z(""),Y("contado")},[o]),we=({efectivo:n,tarjeta:r,transferencia:S,dolaresLocal:H,credito:ae})=>{const Te=n+r+S+H>.01;return ae&&Te?"mixto":ae&&!Te?"credito_total":"contado"},g=async n=>{if(!b||L===0){l==null||l({title:"Cliente Requerido",message:"No puedes vender sin seleccionar un cliente. Por favor selecciona uno.",type:"error"});return}if((oe==="credito_total"||oe==="mixto")&&L===0){l==null||l({title:"Cliente Requerido",message:"Debe seleccionar un cliente para ventas a crédito o mixtas.",type:"error"});return}if(te>.01){l==null||l({title:"Pago Incompleto",message:`Faltan C$${te.toFixed(2)} para completar la venta.`,type:"warning"});return}if(me&&!y.trim()){l==null||l({title:"Dato Requerido",message:"Ingrese el número de referencia para el pago con tarjeta.",type:"warning"});return}if(B>.01&&!J.trim()){l==null||l({title:"Dato Requerido",message:"Ingrese el número de referencia para la transferencia.",type:"warning"});return}if(A)return;V(!0);const r=Math.max(0,K+q-xe),S={totalVenta:Number(o),efectivo:K,tarjeta:P,transferencia:B,dolares:pe,tasaDolarAlMomento:Number(h),referenciaTarjeta:y.trim(),referenciaTransferencia:J.trim(),credito:ne,clienteId:L,empleadoId:D||null,tipoVenta:we({efectivo:K,tarjeta:P,transferencia:B,dolaresLocal:q,credito:ne}),cambio:Number(xe),ingresoCaja:Number(r),shouldPrintNow:n};try{typeof w=="function"&&await w(S),a==null||a()}catch(H){l==null||l({title:"Error",message:(H==null?void 0:H.message)||"No se pudo completar la venta.",type:"error"})}finally{V(!1)}},fe=b?te>.01?"#dc3545":xe>.01?"#28a745":"#17a2b8":"#dc3545",ue=b?te>.01?`¡FALTA CUBRIR! C$${te.toFixed(2)}`:xe>.01?`CAMBIO A ENTREGAR: C$${xe.toFixed(2)}`:"BALANCE PERFECTO":"¡SELECCIONA UN CLIENTE!";return e.jsx(ge,{children:e.jsxs(be,{style:{maxWidth:"950px",width:"96%",maxHeight:"90vh",overflow:"hidden",borderRadius:16,backgroundColor:"#f8f9fa",boxShadow:"0 25px 50px -12px rgba(0, 0, 0, 0.25)"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"2px solid #e9ecef",paddingBottom:15,marginBottom:20},children:[e.jsxs("h2",{style:{margin:0,color:"#1e293b",fontSize:"1.5rem",fontWeight:800},children:[e.jsx(ke,{style:{marginRight:"0.5rem",color:"#007bff"}})," PROCESAR PAGO"]}),e.jsx(R,{$cancel:!0,onClick:a,style:{borderRadius:"50%",width:40,height:40,padding:0,fontSize:"1.2rem",backgroundColor:"#fee2e2",color:"#ef4444",borderColor:"transparent"},children:e.jsx(Ne,{})})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"5fr 4fr",gap:"2rem",height:"calc(90vh - 140px)"},children:[e.jsxs("div",{style:{paddingRight:10,borderRight:"1px solid #e2e8f0",overflowY:"auto",paddingBottom:10},children:[e.jsxs("div",{style:{padding:20,border:"1px solid #e2e8f0",borderRadius:12,backgroundColor:"#fff",marginBottom:20,boxShadow:"0 1px 3px rgba(0,0,0,0.05)"},children:[e.jsxs("h4",{style:{marginTop:0,color:"#334155",fontSize:"1rem",fontWeight:700,textTransform:"uppercase",marginBottom:15},children:[e.jsx(Je,{style:{marginRight:6}})," Tipo de Venta"]}),e.jsxs("div",{style:{display:"flex",gap:12,marginBottom:20},children:[e.jsx(R,{onClick:ye,style:{flex:1,padding:"10px 0",backgroundColor:C==="contado"?"#0ea5e9":"#f1f5f9",color:C==="contado"?"#fff":"#475569",border:"none",borderRadius:8,fontWeight:"700",boxShadow:C==="contado"?"0 4px 6px -1px rgba(14, 165, 233, 0.4)":"none"},children:"CONTADO"}),e.jsx(R,{onClick:ve,disabled:!b,style:{flex:1,padding:"10px 0",backgroundColor:C==="credito"?"#f59e0b":"#f1f5f9",color:C==="credito"?"#fff":"#475569",border:"none",borderRadius:8,fontWeight:"700",boxShadow:C==="credito"?"0 4px 6px -1px rgba(245, 158, 11, 0.4)":"none",opacity:b?1:.5},children:"CRÉDITO"})]}),e.jsxs("label",{style:{display:"block",fontWeight:"700",marginBottom:8,color:"#475569",fontSize:"0.9rem"},children:[e.jsx(Ye,{})," Seleccionar Cliente ",e.jsx("span",{style:{color:"#ef4444"},children:"* (Obligatorio)"})]}),e.jsxs(O,{as:"select",value:f,onChange:_,style:{height:42,padding:"0 12px",width:"100%",fontSize:"1rem",border:b?"2px solid #22c55e":"2px solid #ef4444",backgroundColor:b?"#f0fdf4":"#fef2f2",borderRadius:8},children:[e.jsx("option",{value:"0",children:"-- Seleccionar Cliente --"}),(M||[]).map(n=>e.jsxs("option",{value:n.id_cliente??n.id,children:[n.nombre,Number(n.saldo_pendiente||0)>0?` (Deuda: C$${Number(n.saldo_pendiente).toFixed(2)})`:""]},n.id_cliente??n.id))]}),!b&&e.jsxs("p",{style:{color:"#ef4444",margin:"8px 0 0",fontSize:"0.85rem",fontWeight:"600"},children:[e.jsx(Ne,{style:{marginRight:4}})," No puedes vender sin seleccionar un cliente."]}),e.jsxs("div",{style:{marginTop:20},children:[e.jsxs("label",{style:{display:"block",fontWeight:"700",marginBottom:8,color:"#475569",fontSize:"0.9rem"},children:[e.jsx(Ke,{})," Atendido por (opcional):"]}),e.jsxs("select",{value:D,onChange:n=>le(n.target.value),style:{width:"100%",padding:"10px 12px",fontSize:"1rem",borderRadius:8,border:"1px solid #cbd5e1",background:"#f8fafc",height:42},children:[e.jsx("option",{value:"",children:"-- Sin Empleado --"}),(N||[]).map(n=>e.jsx("option",{value:n.id_empleado,children:n.nombre},n.id_empleado))]})]})]}),e.jsxs("div",{style:{padding:20,border:"1px solid #e2e8f0",borderRadius:12,backgroundColor:"#fff",boxShadow:"0 1px 3px rgba(0,0,0,0.05)"},children:[e.jsx("h4",{style:{marginTop:0,color:"#334155",fontSize:"1rem",fontWeight:700,textTransform:"uppercase",borderBottom:"1px solid #f1f5f9",paddingBottom:10,marginBottom:15},children:"Desglose de Pago (C$)"}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"15px"},children:[e.jsxs("div",{children:[e.jsxs("label",{style:{display:"block",fontWeight:"600",fontSize:"0.85rem",marginBottom:6,color:"#64748b"},children:[e.jsx(Qe,{})," Efectivo"]}),e.jsx(O,{type:"number",step:"0.01",value:c,onChange:n=>E(n.target.value),style:{width:"100%",height:38,fontSize:"1rem",borderRadius:8,border:"1px solid #cbd5e1"},disabled:X})]}),e.jsxs("div",{children:[e.jsxs("label",{style:{display:"block",fontWeight:"600",fontSize:"0.85rem",marginBottom:6,color:"#64748b"},children:[e.jsx(Xe,{})," Dólares"]}),e.jsx(O,{type:"number",step:"0.01",value:p,onChange:n=>u(n.target.value),style:{width:"100%",height:38,fontSize:"1rem",borderRadius:8,border:"1px solid #cbd5e1"},disabled:X})]}),e.jsxs("div",{children:[e.jsxs("label",{style:{display:"block",fontWeight:"600",fontSize:"0.85rem",marginBottom:6,color:"#64748b"},children:[e.jsx(ke,{})," Tarjeta"]}),e.jsx(O,{type:"number",step:"0.01",value:t,onChange:n=>x(n.target.value),style:{width:"100%",height:38,fontSize:"1rem",borderRadius:8,border:"1px solid #cbd5e1"},disabled:X})]}),e.jsxs("div",{children:[e.jsxs("label",{style:{display:"block",fontWeight:"600",fontSize:"0.85rem",marginBottom:6,color:"#64748b"},children:[e.jsx(Be,{})," Transferencia"]}),e.jsx(O,{type:"number",step:"0.01",value:$,onChange:n=>i(n.target.value),style:{width:"100%",height:38,fontSize:"1rem",borderRadius:8,border:"1px solid #cbd5e1"},disabled:X})]})]}),C==="credito"&&e.jsxs("div",{style:{marginTop:15,padding:12,backgroundColor:"#fff7ed",borderRadius:8,border:"1px dashed #f97316"},children:[e.jsxs("label",{style:{display:"block",fontWeight:"700",fontSize:"0.85rem",marginBottom:4,color:"#c2410c"},children:[e.jsx(Ze,{})," CRÉDITO GENERADO"]}),e.jsxs("div",{style:{fontSize:"1.2rem",color:"#ea580c",fontWeight:800},children:["C$ ",ne.toFixed(2)]})]}),me&&e.jsxs("div",{style:{marginTop:15,padding:12,border:"1px solid #fcd34d",borderRadius:8,backgroundColor:"#fffbeb"},children:[e.jsxs("label",{style:{display:"block",fontWeight:"700",fontSize:"0.85rem",color:"#b45309",marginBottom:6},children:[e.jsx(Ee,{})," Nº Referencia Tarjeta ",e.jsx("span",{style:{color:"#ef4444"},children:"*"})]}),e.jsx(O,{type:"text",placeholder:"Ej: 1234",value:y,onChange:n=>W(n.target.value),style:{width:"100%",height:36,fontSize:"0.95rem"}})]}),B>.01&&e.jsxs("div",{style:{marginTop:15,padding:12,border:"1px solid #bae6fd",borderRadius:8,backgroundColor:"#f0f9ff"},children:[e.jsxs("label",{style:{display:"block",fontWeight:"700",fontSize:"0.85rem",color:"#0369a1",marginBottom:6},children:[e.jsx(Ee,{})," Nº Referencia Transferencia ",e.jsx("span",{style:{color:"#ef4444"},children:"*"})]}),e.jsx(O,{type:"text",placeholder:"Ej: REF-5678",value:J,onChange:n=>Z(n.target.value),style:{width:"100%",height:36,fontSize:"0.95rem"}})]}),C==="contado"&&e.jsxs(R,{info:!0,onClick:Ce,style:{width:"100%",padding:"12px 0",marginTop:20,backgroundColor:"#e0f2fe",color:"#0284c7",border:"1px dashed #0ea5e9",fontSize:"0.95rem",fontWeight:600},children:[e.jsx(et,{})," Rellenar con Efectivo (Total: C$ ",Number(o).toFixed(2),")"]})]})]}),e.jsxs("div",{style:{paddingLeft:10,display:"flex",flexDirection:"column",justifyContent:"space-between",paddingBottom:10},children:[e.jsxs("div",{children:[e.jsxs(Fe,{style:{marginBottom:15,padding:20,backgroundColor:"#f0f9ff",border:"none",borderRadius:12,boxShadow:"inset 0 2px 4px rgba(0,0,0,0.05)"},children:[e.jsxs(U,{$bold:!0,style:{fontSize:"1.8rem",color:"#0f172a",marginBottom:5},children:[e.jsx("span",{style:{fontSize:"1rem",color:"#64748b",fontWeight:600},children:"TOTAL A PAGAR"}),e.jsxs("span",{children:["C$ ",Number(o).toFixed(2)]})]}),e.jsxs(U,{style:{borderTop:"1px solid #cbd5e0",paddingTop:10,fontSize:"0.9rem",color:"#64748b"},children:[e.jsxs("span",{children:["Tasa USD: C$ ",Number(h).toFixed(2)]}),e.jsxs("span",{style:{color:"#0f172a",fontWeight:700},children:["$",(Number(o)/Number(h||1)).toFixed(2)," USD"]})]})]}),e.jsxs("div",{style:{padding:15,border:"1px solid #e2e8f0",borderRadius:12,marginBottom:15,backgroundColor:"#fff"},children:[e.jsxs(U,{style:{color:"#64748b",fontSize:"0.95rem",marginBottom:8},children:[e.jsx("span",{children:"Pagado (Contado)"}),e.jsxs("span",{style:{fontWeight:"700",color:"#1e293b"},children:["C$ ",k.toFixed(2)]})]}),e.jsxs(U,{style:{fontSize:"0.95rem"},children:[e.jsx("span",{children:"Estado"}),e.jsx("span",{style:{fontWeight:"700",color:ne>.01?"#f59e0b":b?"#22c55e":"#ef4444"},children:Se})]})]}),e.jsxs(Fe,{style:{marginBottom:10,padding:15,backgroundColor:fe==="#dc3545"?"#fef2f2":fe==="#28a745"?"#ecfccb":"#e0f2fe",color:fe==="#dc3545"?"#ef4444":fe==="#28a745"?"#4d7c0f":"#0369a1",fontWeight:"800",fontSize:"1.1rem",textAlign:"center",borderRadius:12,border:"none",boxShadow:"0 2px 4px rgba(0,0,0,0.05)"},children:[e.jsx(tt,{style:{marginRight:8}})," ",ue]})]}),e.jsxs("div",{style:{marginTop:"auto",display:"flex",flexDirection:"column",gap:"12px"},children:[e.jsxs(R,{type:"button",onClick:n=>{n.preventDefault(),g(!0)},disabled:G||!b,style:{width:"100%",padding:"16px 0",fontSize:"1.2rem",fontWeight:800,backgroundColor:G||!b?"#cbd5e1":"#2563eb",color:"white",border:"none",borderRadius:10,boxShadow:G||!b?"none":"0 4px 6px -1px rgba(37, 99, 235, 0.4)",transition:"all 0.2s"},children:[e.jsx(Oe,{style:{marginRight:8}})," PAGAR E IMPRIMIR"]}),e.jsxs(R,{type:"button",onClick:n=>{n.preventDefault(),g(!1)},disabled:G||!b,style:{width:"100%",padding:"12px 0",fontSize:"1rem",fontWeight:700,backgroundColor:"white",color:G||!b?"#cbd5e1":"#475569",border:G||!b?"1px solid #e2e8f0":"2px solid #cbd5e1",borderRadius:10,transition:"all 0.2s"},children:[e.jsx(at,{style:{marginRight:8}})," Solo Guardar (Sin Ticket)"]})]})]})]})]})})},ut=rt`
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
`,jt=se.div`
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
`,yt=se.div`
  display: flex; flex-direction: column; gap: 12px;
  align-items: center; /* Center the ticket inside modal */
`,vt=se.img`
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
`;const Ct=se.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: .75rem;
`,Rt=({cart:o=[],total:h=0,subtotal:a=0,discount:w=0,proformaFor:M="",onClose:N,currentUser:d,client:l})=>{const{user:T}=typeof Ie=="function"?Ie():{user:null},{settings:m}=mt(),F=i=>(i==null?void 0:i.usuarioNombre)||(i==null?void 0:i.nombre_usuario)||(i==null?void 0:i.name)||(i==null?void 0:i.nombre)||(i==null?void 0:i.username)||null;let z=null;try{z=JSON.parse(localStorage.getItem("authUser")||"null")}catch{}const I=F(d)||F(T)||F(z)||"Cajero POS",c=(l==null?void 0:l.nombre)||"Consumidor Final",E=(l==null?void 0:l.cedula)||"",t=new Date().toLocaleString("es-NI"),x=i=>new Intl.NumberFormat("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(i||0)),p={name:(m==null?void 0:m.empresa_nombre)||"Multirepuestos RG",ruc:(m==null?void 0:m.empresa_ruc)||"1211812770001E",phone:(m==null?void 0:m.empresa_telefono)||"84031936 / 84058142",address:(m==null?void 0:m.empresa_direccion)||"Del portón de la normal 75 varas al este. Juigalpa, Chontales.",slogan:(m==null?void 0:m.empresa_eslogan)||"Tu mejor opción en repuestos",logo:(m==null?void 0:m.empresa_logo_url)||new URL("/icons/logo.png",window.location.origin).toString()},u=s.useCallback((i="80")=>{const y=document.getElementById("print-wrapper-proforma");if(!y)return;const W=y.outerHTML,Z=`
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
    `,C=window.open("","_blank","width=900,height=700");C&&(C.document.write(`<!DOCTYPE html><html><head><title>PROFORMA - ${p.name}</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"><style>${Z}</style></head><body>${W}</body></html>`),C.document.close(),C.focus(),C.onload=function(){setTimeout(()=>{C.print(),setTimeout(()=>{C.close(),N&&N()},500)},400)})},[p,N]),$=o.length<=2;return e.jsxs(ge,{className:"no-print",children:[e.jsx(ut,{}),e.jsxs(be,{className:"no-print",style:{maxWidth:520,width:"96%",padding:"1.2rem",background:"#fff"},children:[e.jsxs(Ct,{children:[e.jsxs("h2",{style:{display:"flex",alignItems:"center",gap:8,margin:0,fontSize:"1.25rem"},children:[e.jsx(ot,{})," Proforma"]}),e.jsxs("div",{style:{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"flex-end"},children:[e.jsx(R,{onClick:()=>u("80"),style:{padding:"8px 12px",fontSize:"0.85rem"},children:"80mm"}),e.jsxs(R,{onClick:()=>u("A4"),style:{padding:"8px 12px",fontSize:"0.85rem"},children:[e.jsx(Re,{})," A4"]}),e.jsx(R,{$cancel:!0,onClick:N,style:{padding:"8px 12px",background:"#e2e8f0",color:"#0f172a"},children:e.jsx(Ne,{})})]})]}),e.jsx(yt,{children:e.jsxs(jt,{id:"print-wrapper-proforma",className:`print-area print-80 ${$?"compact":""}`,children:[e.jsxs("div",{className:"brand",children:[e.jsx("div",{className:"brand-logo-container",children:e.jsx(vt,{src:p.logo,alt:"Logo",onError:i=>{i.currentTarget.style.display="none"}})}),e.jsxs("div",{className:"brand-info",children:[e.jsx("h1",{children:p.name}),e.jsx("small",{children:p.slogan}),e.jsxs("small",{children:["RUC: ",p.ruc]}),e.jsxs("small",{children:["Tel: ",p.phone]}),e.jsx("small",{children:p.address}),e.jsx("div",{style:{marginTop:6},children:e.jsxs("span",{className:"proforma-tag",children:[e.jsx(Re,{style:{marginRight:4,verticalAlign:"middle"}})," COTIZACIÓN / PROFORMA"]})})]})]}),e.jsxs("div",{className:"meta",children:[e.jsxs("div",{className:"meta-col",children:[e.jsx("span",{className:"meta-title",children:"Detalles"}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Fecha:"}),e.jsx("span",{className:"meta-value",children:t})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"ID Temp:"}),e.jsx("span",{className:"meta-value",children:Date.now().toString().slice(-6)})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Atendido por:"}),e.jsx("span",{className:"meta-value",children:I})]})]}),e.jsxs("div",{className:"meta-col",children:[e.jsx("span",{className:"meta-title",children:"Cliente"}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Nombre:"}),e.jsx("span",{className:"meta-value",children:M||c})]}),E&&e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Cédula:"}),e.jsx("span",{className:"meta-value",children:E})]})]})]}),e.jsxs("table",{className:"items",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{className:"col-qty",children:"Cant."}),e.jsx("th",{children:"Descripción"}),e.jsx("th",{className:"text-right col-unit",children:"P. Unit."}),e.jsx("th",{className:"text-right col-total",children:"Total"})]})}),e.jsx("tbody",{children:o.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:"4",style:{textAlign:"center",color:"#777"},children:"Sin ítems"})}):o.map((i,y)=>{const W=Number(i.precio_venta??i.precio??0),J=Number(i.quantity??0),Z=W*J;return e.jsxs("tr",{children:[e.jsx("td",{className:"col-qty",children:J}),e.jsx("td",{children:i.nombre||i.descripcion||"Item"}),e.jsxs("td",{className:"text-right col-unit",children:["C$",x(W)]}),e.jsxs("td",{className:"text-right col-total",children:["C$",x(Z)]})]},y)})})]}),e.jsx("div",{className:"totals",children:e.jsxs("div",{className:"totals-box",children:[e.jsxs(U,{children:[e.jsx("span",{children:"Subtotal:"}),e.jsxs("span",{children:["C$",x(a)]})]}),w>0&&e.jsxs(U,{style:{color:"#dc3545"},children:[e.jsx("span",{children:"Descuento:"}),e.jsxs("span",{children:["- C$",x(w)]})]}),e.jsxs(U,{className:"grand-total",style:{fontWeight:"bold",fontSize:"1.2rem",marginTop:5,borderTop:"2px solid black"},children:[e.jsx("span",{children:"TOTAL:"}),e.jsxs("span",{children:["C$",x(h)]})]}),e.jsxs("div",{style:{marginTop:12,textAlign:"center"},children:[e.jsx("span",{className:"badge",children:"DOCUMENTO NO VÁLIDO COMO FACTURA"}),e.jsx("p",{style:{margin:"5px 0 0",fontSize:"0.72rem",color:"#666"},children:"Precios sujetos a cambio. Válido por 3 días."})]})]})}),e.jsxs("div",{className:"thanks",children:[e.jsxs("p",{children:['"',p.slogan,'"']}),e.jsx("p",{style:{whiteSpace:"pre-line",marginTop:"5px"},children:(m==null?void 0:m.ticket_proforma_footer)||"¡Gracias por cotizar con nosotros!"})]})]})})]})]})},Ft=({isOpen:o,onClose:h,onConfirm:a,onSubmit:w,title:M,message:N,fields:d=[],inputType:l="number",icon:T})=>{const[m,F]=s.useState({}),[z,I]=s.useState("");if(s.useEffect(()=>{if(o)if(d.length>0){const t={};d.forEach(x=>{t[x.name]=x.defaultValue!==void 0?x.defaultValue:""}),F(t)}else I("")},[o,d]),!o)return null;const c=()=>{d.length>0?w?w(m):a&&a(m):w?w(z):a&&a(z)},E=(t,x)=>{F(p=>({...p,[t]:x}))};return e.jsx(ge,{children:e.jsxs(be,{style:{maxWidth:"450px"},children:[e.jsxs("div",{style:{textAlign:"center",marginBottom:"1.5rem"},children:[T?e.jsx("div",{style:{fontSize:"2.5rem",marginBottom:"1rem"},children:T}):e.jsx(it,{size:"2.5em",color:"#007bff"}),e.jsx("h2",{style:{marginTop:"0.5rem",marginBottom:"0.5rem"},children:M}),N&&e.jsx("p",{style:{color:"#6c757d"},children:N})]}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:d.length>0?d.map(t=>e.jsxs("div",{children:[t.label&&e.jsx("label",{style:{display:"block",marginBottom:"5px",fontWeight:600,fontSize:"0.9rem"},children:t.label}),t.type==="select"?e.jsx("select",{value:m[t.name],onChange:x=>E(t.name,x.target.value),style:{width:"100%",padding:"10px",borderRadius:"8px",border:"1px solid #ccc",fontSize:"1rem"},children:t.options&&t.options.map(x=>e.jsx("option",{value:x.value,children:x.label},x.value))}):e.jsx(O,{type:t.type||"text",placeholder:t.placeholder||"",value:m[t.name],onChange:x=>E(t.name,x.target.value),autoFocus:t.name===d[0].name})]},t.name)):e.jsx(O,{type:l,value:z,onChange:t=>I(t.target.value),autoFocus:!0})}),e.jsxs("div",{style:{display:"flex",justifyContent:"flex-end",gap:"1rem",marginTop:"2rem"},children:[e.jsx(R,{onClick:h,style:{backgroundColor:"#6c757d"},children:"Cancelar"}),e.jsx(R,{onClick:c,primary:!0,children:"Aceptar"})]})]})})},ce=se.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 6px;
  
  label { font-weight: bold; color: #495057; }
  input { width: 120px; text-align: right; }
`,It=({isOpen:o,onClose:h,currentStats:a,onConfirm:w})=>{const[M,N]=s.useState("manual"),[d,l]=s.useState({efectivo:"",credito:"",tarjeta:"",dolares:"",ventas_totales:""}),[T,m]=s.useState({cordobas:"",dolares:"",ventas_totales:""}),F=(c,E)=>{l(t=>({...t,[c]:E}))},z=(c,E)=>{m(t=>({...t,[c]:E}))},I=()=>{const c=[];if(M==="manual")parseFloat(d.efectivo)&&c.push({target:"efectivo",amount:parseFloat(d.efectivo)}),parseFloat(d.credito)&&c.push({target:"credito",amount:parseFloat(d.credito)}),parseFloat(d.tarjeta)&&c.push({target:"tarjeta",amount:parseFloat(d.tarjeta)}),parseFloat(d.ventas_totales)&&c.push({target:"ventas_totales",amount:parseFloat(d.ventas_totales)});else{const E=parseFloat(T.cordobas),t=parseFloat(T.dolares),x=parseFloat(T.ventas_totales);if(!isNaN(E)){const p=Number((a==null?void 0:a.netCordobas)||0),u=E-p;Math.abs(u)>.01&&c.push({target:"efectivo",amount:u})}if(!isNaN(t)){const p=Number((a==null?void 0:a.netDolares)||0),u=t-p;Math.abs(u)>.01&&c.push({target:"dolares",amount:u})}if(!isNaN(x)){const p=Number((a==null?void 0:a.totalVentasDia)||0),u=x-p;Math.abs(u)>.01&&c.push({target:"ventas_totales",amount:u})}}c.length>0&&w(c),h()};return o?e.jsx(ge,{style:{background:"rgba(0,0,0,0.95)",zIndex:9999},children:e.jsxs(be,{style:{maxWidth:"450px",background:"#212529",color:"#fff",border:"1px solid #495057",maxHeight:"90vh",overflowY:"auto"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20},children:[e.jsxs("h2",{style:{margin:0,color:"#ffc107",display:"flex",alignItems:"center",gap:10},children:[e.jsx(nt,{})," GOD MODE"]}),e.jsx(R,{$cancel:!0,onClick:h,style:{background:"transparent",color:"#6c757d",border:"none"},children:"✕"})]}),e.jsxs("div",{style:{display:"flex",gap:10,marginBottom:20},children:[e.jsx(R,{onClick:()=>N("manual"),style:{flex:1,background:M==="manual"?"#ffc107":"#343a40",color:M==="manual"?"#000":"#fff",border:"none"},children:"Ajuste Manual (+/-)"}),e.jsx(R,{onClick:()=>N("override"),style:{flex:1,background:M==="override"?"#ffc107":"#343a40",color:M==="override"?"#000":"#fff",border:"none"},children:"Fijar Monto (=)"})]}),M==="manual"?e.jsxs(e.Fragment,{children:[e.jsx("p",{style:{color:"#adb5bd",fontSize:"0.85rem",marginBottom:15},children:"Suma o resta cantidades a los contadores ocultamente."}),e.jsxs(ce,{style:{background:"#343a40"},children:[e.jsx("label",{style:{color:"#fff"},children:"Efectivo (C$)"}),e.jsx(O,{type:"number",step:"0.01",placeholder:"+/- 0.00",value:d.efectivo,onChange:c=>F("efectivo",c.target.value),style:{background:"#495057",color:"#fff"}})]}),e.jsxs(ce,{style:{background:"#343a40"},children:[e.jsx("label",{style:{color:"#fff"},children:"Crédito"}),e.jsx(O,{type:"number",step:"0.01",placeholder:"+/- 0.00",value:d.credito,onChange:c=>F("credito",c.target.value),style:{background:"#495057",color:"#fff"}})]}),e.jsxs(ce,{style:{background:"#343a40"},children:[e.jsx("label",{style:{color:"#fff"},children:"Tarjeta"}),e.jsx(O,{type:"number",step:"0.01",placeholder:"+/- 0.00",value:d.tarjeta,onChange:c=>F("tarjeta",c.target.value),style:{background:"#495057",color:"#fff"}})]}),e.jsxs(ce,{style:{background:"#2a1a00",border:"1px solid #ffc107"},children:[e.jsx("label",{style:{color:"#ffc107"},children:"Ventas Totales"}),e.jsx(O,{type:"number",step:"0.01",placeholder:"+/- 0.00",value:d.ventas_totales,onChange:c=>F("ventas_totales",c.target.value),style:{background:"#495057",color:"#ffc107",border:"1px solid #ffc107"}})]})]}):e.jsxs(e.Fragment,{children:[e.jsx("p",{style:{color:"#adb5bd",fontSize:"0.85rem",marginBottom:15},children:"Define EXACTAMENTE cuánto dinero físico hay. El sistema creará un ajuste mágico para cuadrar."}),e.jsxs("div",{style:{background:"#343a40",padding:10,borderRadius:6,marginBottom:10},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",color:"#aaa",marginBottom:5},children:[e.jsx("span",{children:"Sistema Actual:"}),e.jsxs("span",{children:["C$ ",Number((a==null?void 0:a.netCordobas)||0).toFixed(2)]})]}),e.jsxs(ce,{style:{background:"transparent",padding:0,marginBottom:0},children:[e.jsx("label",{style:{color:"#fff"},children:"Real en Caja (C$)"}),e.jsx(O,{type:"number",step:"0.01",placeholder:"0.00",value:T.cordobas,onChange:c=>z("cordobas",c.target.value),style:{background:"#495057",color:"#fff",border:"1px solid #ffc107"}})]})]}),e.jsxs("div",{style:{background:"#343a40",padding:10,borderRadius:6},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",color:"#aaa",marginBottom:5},children:[e.jsx("span",{children:"Sistema Actual:"}),e.jsxs("span",{children:["$ ",Number((a==null?void 0:a.netDolares)||0).toFixed(2)]})]}),e.jsxs(ce,{style:{background:"transparent",padding:0,marginBottom:0},children:[e.jsx("label",{style:{color:"#fff"},children:"Real en Caja ($)"}),e.jsx(O,{type:"number",step:"0.01",placeholder:"0.00",value:T.dolares,onChange:c=>z("dolares",c.target.value),style:{background:"#495057",color:"#fff",border:"1px solid #ffc107"}})]})]}),e.jsxs("div",{style:{background:"#2a1a00",padding:10,borderRadius:6,border:"1px solid #ffc107",marginTop:10},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",color:"#ffc107",marginBottom:5},children:[e.jsx("span",{children:"Sistema Actual:"}),e.jsxs("span",{children:["C$ ",Number((a==null?void 0:a.totalVentasDia)||0).toFixed(2)]})]}),e.jsxs(ce,{style:{background:"transparent",padding:0,marginBottom:0},children:[e.jsx("label",{style:{color:"#ffc107"},children:"Ventas Totales (C$)"}),e.jsx(O,{type:"number",step:"0.01",placeholder:"0.00",value:T.ventas_totales,onChange:c=>z("ventas_totales",c.target.value),style:{background:"#495057",color:"#ffc107",border:"1px solid #ffc107"}})]})]})]}),e.jsxs("div",{style:{marginTop:25,display:"flex",gap:10},children:[e.jsx(R,{onClick:h,style:{flex:1,background:"#495057",border:"none"},children:"Cancelar"}),e.jsxs(R,{onClick:I,style:{flex:1,background:"#ffc107",color:"#000",fontWeight:"bold",border:"none"},children:[e.jsx(st,{style:{marginRight:6}})," ",M==="manual"?"APLICAR AJUSTE":"CUADRAR MÁGICAMENTE"]})]})]})}):null};export{kt as C,zt as P,It as S,Et as a,Ft as b,ft as c,Rt as d};

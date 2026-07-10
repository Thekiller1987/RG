import{R as Z,r as s,j as e,A as Q,C as N,P as O,af as q,x as ae,s as r,m as $,b as se,V as le,X as de,Z as ce,$ as pe,g as xe,k as B,a1 as me,a5 as ue,D as he,an as g,W as fe}from"./vendor-C4uQ3a2a.js";import{a as ge,u as E,X as be,Y as ye}from"./index-DKlUidKK.js";import{r as W}from"./searchEngine-BMYcElFi.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-BMvqz6Um.js";const je=r($.div)`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1100;
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(4px);
`,we=r($.div)`
  background: white;
  border-radius: 12px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex; flex-direction: column;
  overflow: hidden;
  max-width: 520px;
  width: 96%;
  padding: 1.2rem;
  max-height: 90vh;
  overflow-y: auto;
`,T=r.button`
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  display: flex; align-items: center; gap: 0.5rem;
  transition: all 0.2s;
  font-size: 0.9rem;
  
  ${x=>x.$cancel?`
    background: #fee2e2; color: #b91c1c;
    &:hover { background: #fecaca; }
  `:`
    background: #0f172a; color: white;
    &:hover { background: #334155; transform: translateY(-1px); }
  `}
`,Ce=r.div`
  font-family: 'Consolas','Courier New',monospace;
  color: #000;
  background: #fff;
  margin: 0 auto;
  padding: 12px 10px;
  box-shadow: 0 0 10px rgba(0,0,0,.08);
  border: 1px solid #eee;
  border-radius: 8px;
  width: 310px; /* Previsualización por defecto tipo 80mm */

  &.compact { padding: 8px 6px; }

  .brand {
    text-align: center;
    border-bottom: 1px dashed #333;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }
  .brand h1 {
    margin: 6px 0 2px;
    font-size: 1.35rem;
    font-weight: 700;
    color: #000000;
    line-height: 1.25;
  }
  .brand small {
    color: #555;
    display: block;
    margin: 3px 0;
    line-height: 1.35;
  }

  .meta {
    font-size: .9rem;
    margin-bottom: 12px;
    border-bottom: 1px dashed #ccc;
    padding-bottom: 8px;
  }
  .meta p {
    margin: 2px 0;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: flex-start;
  }
  .meta-label { font-weight: 700; }
  .meta-value { text-align: right; max-width: 65%; }

  table.items { width: 100%; border-collapse: collapse; font-size: .85rem; table-layout: fixed; }
  table.items th, table.items td { padding: 4px 2px; vertical-align: top; word-wrap: break-word; }
  table.items th {
    border-bottom: 2px solid #333;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 0.75rem;
    color: #1e3a8a;
    text-align: left;
  }
  .text-right { text-align: right; }
  .col-qty { width: 12%; text-align: center; }
  .col-code { width: 22%; } /* Columna extra para Código */
  .col-price { width: 25%; text-align: right; } /* Mostrar Precio unitario */

  .totals { border-top: 2px solid #333; padding-top: 6px; margin-top: 12px; }
  .grand-total { font-size: 1.1rem; font-weight: 900; border-top: 2px solid #333; padding-top: 5px; display: flex; justify-content: space-between; margin-top: 5px; }

  .thanks {
    text-align: center; font-size: .85rem; border-top: 1px dashed #333;
    padding-top: 10px; margin-top: 12px; color: #444; line-height: 1.4;
  }
  
  .tag {
    display: inline-block; padding: 4px 8px; border-radius: 4px; 
    background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd;
    font-weight: 700; font-size: 0.8rem; margin-top: 5px;
  }

  /* Clases para modo impresión dinámica (se inyectan en ventana nueva) */
  &.print-a4 { width: 190mm !important; font-size: 10pt !important; }
  &.print-80 { width: 80mm !important; font-size: 8pt !important; }
`,ve=r.img`
  max-width: 130px;
  max-height: 90px;
  width: auto;
  height: auto;
  display: block;
  margin: 0 auto 6px;
  object-fit: contain;
`,ke=r.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: .75rem;
`,_e=({isOpen:x,onClose:b,transaction:n})=>{var C;const{settings:i}=ge(),j=Z.useMemo(()=>{if(!(i!=null&&i.empresa_logo_url))return null;if(i.empresa_logo_url.startsWith("http"))return i.empresa_logo_url;let o=i.empresa_logo_url;return o.startsWith("/uploads")?o="/api"+o:o.startsWith("uploads")&&(o="/api/"+o),`${"https://sistema.multirepuestosrg.com/api".replace(/\/api$/,"")}${o.startsWith("/")?"":"/"}${o}`},[i==null?void 0:i.empresa_logo_url]),c={name:(i==null?void 0:i.empresa_nombre)||"Multirepuestos RG",ruc:(i==null?void 0:i.empresa_ruc)||"1211812770001E",phone:(i==null?void 0:i.empresa_telefono)||"84031936 / 84058142",address:(i==null?void 0:i.empresa_direccion)||"Del portón de la normal 75 varas al este. Juigalpa, Chontales.",slogan:(i==null?void 0:i.empresa_eslogan)||"Repuestos de confianza al mejor precio — calidad que mantiene tu motor en marcha.",logo:j||new URL("/icons/logo.png",window.location.origin).toString()};if(!x||!n)return null;const m=o=>new Intl.NumberFormat("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(o||0)),y=s.useCallback((o="80")=>{const f=document.getElementById("print-wrapper-outflow");if(!f)return;const p=f.outerHTML,w=`
      @page {
        size: ${o==="A4"?"A4 portrait":"80mm auto"};
        margin: ${o==="A4"?"15mm":"0"};
      }
      body { margin: 0; padding: 0; font-family: ${o==="A4"?"'Inter', Helvetica, Arial, sans-serif":"'Consolas', monospace"}; }
      
      #print-wrapper-outflow {
        width: ${o==="A4"?"100%":"80mm"} !important;
        max-width: ${o==="A4"?"none":"80mm"} !important;
        margin: 0 auto !important;
        border: none !important;
        box-shadow: none !important;
        font-size: ${o==="A4"?"10pt":"8pt"} !important;
        padding: ${o==="A4"?"0":"5px"} !important;
      }

      /* A4 Grid / Cuadrícula Styling */
      /* A4 Grid / Cuadrícula Styling */
      ${o==="A4"?`
        #print-wrapper-outflow .brand { 
          text-align: left !important; 
          border-bottom: 3px solid #1e293b !important; 
          padding-bottom: 20px !important; 
          margin-bottom: 30px !important; 
          display: flex; 
          align-items: center; 
          justify-content: space-between; 
        }
        #print-wrapper-outflow .brand img { width: 140px !important; margin: 0 !important; }
        #print-wrapper-outflow .brand-info { text-align: right; }
        #print-wrapper-outflow .brand h1 { color: #1e293b; font-size: 24pt !important; margin-bottom: 5px; letter-spacing: -0.5px; }
        #print-wrapper-outflow .brand small { color: #64748b; font-size: 10pt; display: block; margin-bottom: 2px; }

        #print-wrapper-outflow .meta { 
            display: flex; 
            justify-content: space-between;
            background: #f8fafc;
            border: 1px solid #e2e8f0; 
            padding: 15px 20px; 
            margin-bottom: 30px; 
            border-radius: 6px; 
        }
        #print-wrapper-outflow .meta p { margin: 5px 0; font-size: 10pt; color: #334155; }
        #print-wrapper-outflow .meta-label { font-weight: 600; color: #475569; width: 120px; display: inline-block; }
        #print-wrapper-outflow .meta-value { font-weight: 500; color: #0f172a; }

        #print-wrapper-outflow table.items { border-collapse: collapse; width: 100%; margin-bottom: 30px; }
        #print-wrapper-outflow table.items th { 
            background: #f1f5f9; 
            color: #334155;
            border-bottom: 2px solid #cbd5e1; 
            padding: 12px 8px; 
            text-align: left; 
            font-weight: 700; 
            font-size: 9pt;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        #print-wrapper-outflow table.items td { 
            border-bottom: 1px solid #e2e8f0; 
            padding: 10px 8px; 
            font-size: 10pt;
            color: #334155;
        }
        #print-wrapper-outflow table.items tr:nth-child(even) { background-color: #f8fafc; }
        #print-wrapper-outflow .col-qty { text-align: center; width: 80px; font-weight: 600; }
        #print-wrapper-outflow .col-code { width: 120px; font-family: 'Roboto Mono', monospace; font-size: 9pt; }
        #print-wrapper-outflow .text-right { text-align: right; }
        
        #print-wrapper-outflow .totals { border-top: 2px solid #e2e8f0; padding-top: 20px; }
        #print-wrapper-outflow .grand-total-box { 
            background: #f8fafc; 
            border: 1px solid #e2e8f0; 
            border-radius: 8px;
            padding: 15px 20px; 
            width: 40%; 
            margin-left: auto; 
        }
        #print-wrapper-outflow .grand-total { 
            border-top: 2px solid #cbd5e1; 
            margin-top: 10px; 
            padding-top: 10px; 
            font-size: 14pt;
            color: #0f172a;
        }

        #print-wrapper-outflow .thanks { 
            position: fixed; 
            bottom: 30px; 
            left: 0; 
            right: 0; 
            border: none;
        }
      `:""}

      .brand h1 { font-size: ${o==="A4"?"22pt":"12pt"} !important; margin: 0; }
      .brand img { width: ${o==="A4"?"180px":"150px"} !important; }
      
      /* Ocultar scrollbars */
      ::-webkit-scrollbar { display: none; }
    `,u=window.open("","_blank",`width=${o==="A4"?1e3:400},height=700`);u&&(u.document.write(`
      <html>
        <head>
          <title>Imprimir Comprobante - ${o}</title>
          <style>${w}</style>
        </head>
        <body>${p}</body>
      </html>
    `),u.document.close(),u.onload=()=>{setTimeout(()=>{u.focus(),u.print()},500)})},[]);return s.useEffect(()=>{},[x,y]),e.jsx(Q,{children:x&&e.jsx(je,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(we,{initial:{y:50,opacity:0,scale:.95},animate:{y:0,opacity:1,scale:1},exit:{y:50,opacity:0,scale:.95},transition:{type:"spring",stiffness:300,damping:30},children:[e.jsxs(ke,{className:"no-print",children:[e.jsxs("h3",{style:{margin:0,display:"flex",alignItems:"center",gap:"8px"},children:[n.isQuote?e.jsx(N,{}):e.jsx(O,{}),n.isQuote?"Cotización Generada":"Salida Exitosa"]}),e.jsxs("div",{style:{display:"flex",gap:"8px"},children:[e.jsxs(T,{onClick:()=>y("80"),title:"Imprimir Ticket 80mm",children:[e.jsx(q,{})," 80mm"]}),e.jsxs(T,{onClick:()=>y("A4"),title:"Imprimir Carta A4",children:[e.jsx(N,{})," A4"]}),e.jsx(T,{$cancel:!0,onClick:b,children:e.jsx(ae,{})})]})]}),e.jsx("div",{style:{display:"flex",justifyContent:"center",background:"#f8fafc",padding:"10px",borderRadius:"8px"},children:e.jsxs(Ce,{id:"print-wrapper-outflow",children:[e.jsxs("div",{className:"brand",children:[e.jsx(ve,{src:c.logo,alt:"Logo",onError:o=>o.currentTarget.style.display="none"}),e.jsxs("div",{className:"brand-info",children:[e.jsx("h1",{children:c.name}),e.jsx("small",{children:c.slogan}),e.jsxs("small",{children:["RUC: ",c.ruc]}),e.jsx("small",{children:c.address}),e.jsx("div",{className:"tag",children:n.isQuote?"COTIZACIÓN":"COMPROBANTE DE SALIDA"})]})]}),e.jsxs("div",{className:"meta",children:[e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr",gap:"4px"},children:[e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Fecha:"})," ",e.jsx("span",{className:"meta-value",children:new Date(n.fecha).toLocaleString()})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:n.isQuote?"N° Cotización:":"N° Comprobante:"})," ",e.jsx("span",{className:"meta-value",children:n.id})]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr",gap:"4px"},children:[e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:n.isQuote?"Cliente:":"Motivo/Ref:"})," ",e.jsx("span",{className:"meta-value",children:((C=n.clienteNombre)==null?void 0:C.replace("MOTIVO: ",""))||n.motivo})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:n.isQuote?"Cotizado por:":"Autorizado por:"})," ",e.jsx("span",{className:"meta-value",children:n.usuarioNombre})]})]})]}),e.jsxs("table",{className:"items",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{className:"col-qty",children:"Cant"}),e.jsx("th",{className:"col-code",children:"Cód."}),e.jsx("th",{children:"Desc."}),!n.isQuote&&e.jsx("th",{className:"text-right",children:"Costo U."}),e.jsx("th",{className:"text-right",children:"P. Venta"}),e.jsx("th",{className:"text-right",children:"Total"})]})}),e.jsx("tbody",{children:n.items.map((o,f)=>e.jsxs("tr",{children:[e.jsx("td",{className:"col-qty",children:o.quantity}),e.jsx("td",{className:"col-code",children:o.codigo||"-"}),e.jsx("td",{children:o.nombre}),!n.isQuote&&e.jsx("td",{className:"text-right",children:m(o.cost)}),e.jsx("td",{className:"text-right",children:m(o.unit)}),e.jsx("td",{className:"text-right",children:m(o.unit*o.quantity)})]},f))})]}),e.jsxs("div",{className:"totals",children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between"},children:[e.jsx("span",{children:"Items Totales:"}),e.jsx("span",{children:n.totalItems})]}),e.jsxs("div",{className:"grand-total-box",children:[!n.isQuote&&e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.9rem",marginBottom:"8px"},children:[e.jsx("span",{children:" COSTO TOTAL:"}),e.jsxs("span",{children:["C$ ",m(n.totalCosto)]})]}),e.jsxs("div",{className:"grand-total",style:{borderTop:n.isQuote?"none":"1px dashed #333"},children:[e.jsx("span",{children:n.isQuote?"TOTAL COTIZADO:":"TOTAL VALORIZADO:"}),e.jsxs("span",{children:["C$ ",m(n.totalVenta)]})]})]})]}),e.jsxs("div",{className:"thanks",children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-around",marginTop:"30px"},children:[e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx("p",{children:"__________________________"}),e.jsx("p",{children:"Entregado Por"})]}),e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx("p",{children:"__________________________"}),e.jsx("p",{children:"Recibido Por"})]})]}),e.jsx("p",{style:{marginTop:"20px",whiteSpace:"pre-line"},children:(i==null?void 0:i.ticket_transfer_footer)||"Salida de Inventario autorizada."})]})]})})]})})})},Se=r($.div)`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
  background: rgba(15, 23, 42, 0.6); z-index: 50; 
  display: flex; align-items: center; justify-content: center; padding: 1rem;
  backdrop-filter: blur(4px);
`,Ie=r.div`
  background: white; width: 100%; max-width: 450px; 
  border-radius: 20px; padding: 2rem; 
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`,Ae=r.h2` margin-top: 0; color: #1e293b; margin-bottom: 1rem; font-size: 1.4rem; display: flex; align-items: center; gap: 10px; `,ze=r.div` display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; `,Te=r.button` background: white; color: #64748b; border: 1px solid #cbd5e1; padding: 10px 20px; border-radius: 10px; font-weight: 600; cursor: pointer; `,Ne=r.button` background: #ef4444; color: white; border: none; padding: 10px 20px; border-radius: 10px; font-weight: 600; cursor: pointer; `,Oe=({open:x,onCancel:b,onConfirm:n,title:i,message:j})=>x?e.jsx(Se,{onClick:b,initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(Ie,{onClick:c=>c.stopPropagation(),children:[e.jsxs(Ae,{children:[e.jsx(fe,{color:"#ef4444"})," ",i]}),e.jsx("p",{style:{color:"#4b5563",lineHeight:1.5},children:j}),e.jsxs(ze,{children:[e.jsx(Te,{onClick:b,children:"Cancelar"}),e.jsx(Ne,{onClick:n,children:"Confirmar Salida"})]})]})}):null,$e=r.div`
  display: flex; flex-direction: column; height: 100vh; background-color: #f3f4f6;
  font-family: 'Inter', sans-serif;
`,De=r.header`
  background: white; padding: 1rem 1.5rem; display: flex; align-items: center; justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05); z-index: 10;
`,Le=r.h1`
  font-size: 1.5rem; font-weight: 800; color: #111827; display: flex; align-items: center; gap: 10px; margin: 0;
`,Re=r.div`
  display: flex; flex: 1; overflow: hidden; padding: 1rem; gap: 1rem;
  @media(max-width: 768px) { flex-direction: column; }
`,G=r.div`
  background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  display: flex; flex-direction: column; overflow: hidden;
`,Pe=r(G)`
  flex: 1.5; padding: 1rem;
`,Fe=r(G)`
  flex: 1; min-width: 350px; background: #fff; border-left: 1px solid #e5e7eb;
`,Me=r.div`
  position: relative; margin-bottom: 1rem;
`,Be=r.input`
  width: 100%; padding: 12px 14px 12px 45px; border: 2px solid #e5e7eb; border-radius: 8px;
  font-size: 1rem; outline: none; transition: all 0.2s;
  &:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
`,Ee=r.div`
  flex: 1; overflow-y: auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; padding-bottom: 10px;
`,We=r.div`
  border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px; cursor: pointer; transition: all 0.2s;
  background: white; display: flex; flex-direction: column; justify-content: space-between; height: 120px;
  &:hover { border-color: #3b82f6; transform: translateY(-2px); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
`,He=r.div`
  flex: 1; overflow-y: auto; padding: 10px;
`,Ze=r.div`
  display: flex; justify-content: space-between; align-items: center; padding: 10px;
  background: #f9fafb; border-bottom: 1px solid #e5e7eb; margin-bottom: 5px; border-radius: 6px;
`,Qe=r.textarea`
  width: 100%; padding: 10px; border: 2px solid #e5e7eb; border-radius: 8px; margin: 10px 0;
  resize: none; font-family: inherit;
  &:focus { border-color: #3b82f6; outline: none; }
`,qe=r.button`
  width: 100%; padding: 12px; background: #ef4444; color: white; font-weight: bold; border: none; border-radius: 8px;
  cursor: pointer; font-size: 1rem; transition: background 0.2s;
  &:hover { background: #dc2626; }
  &:disabled { background: #fee2e2; cursor: not-allowed; }
`,Ge=r.div`
  display: flex; background: #e2e8f0; border-radius: 10px; padding: 4px; margin-bottom: 1rem;
`,H=r.button`
  flex: 1; padding: 8px; border-radius: 7px; border: none; font-weight: 600; font-size: 0.85rem; cursor: pointer; transition: all 0.2s;
  ${x=>x.$active?"background: white; color: #1e293b; shadow: 0 2px 4px rgba(0,0,0,0.1);":"background: transparent; color: #64748b;"}
`,Ue=r.div`
  background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 8px; margin-bottom: 1rem; position: relative;
`,Ve=r.input`
  width: 100%; border: none; outline: none; font-size: 0.9rem; padding: 4px; border-bottom: 1px solid #f1f5f9;
`,Ye=r.div`
  position: absolute; top: 100%; left: 0; width: 100%; background: white; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); z-index: 20; max-height: 200px; overflow-y: auto;
`,Xe=r.div`
  padding: 8px 12px; cursor: pointer; &:hover { background: #f8fafc; } border-bottom: 1px solid #f1f5f9;
`,Je=r.div`
  padding: 12px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;
  &:hover { background: #f8fafc; }
`,it=()=>{const{user:x,products:b,refreshProducts:n}=E();se();const[i,j]=s.useState(""),[c,m]=s.useState([]),[y,C]=s.useState(""),[o,f]=s.useState("SALIDA"),[p,w]=s.useState(null),[u,v]=s.useState(""),[U,k]=s.useState(!1),[V,_]=s.useState(!1),[D,Y]=s.useState([]),[S,I]=s.useState(null),[L,R]=s.useState(!1),[P,A]=s.useState(!1),{clients:F=[]}=E(),X=s.useMemo(()=>W(F,u,["nombre"]).slice(0,10),[u,F]),M=s.useRef(null),J=Z.useMemo(()=>W(b,i,["nombre","codigo"]).slice(0,50),[i,b]),K=t=>{var l;m(a=>{const d=a.find(h=>h.id_producto===t.id_producto);return d?o==="SALIDA"&&d.cantidad>=t.existencia?(g.error("No hay suficiente stock."),a):a.map(h=>h.id_producto===t.id_producto?{...h,cantidad:h.cantidad+1}:h):o==="SALIDA"&&t.existencia<=0?(g.error("Producto sin existencia."),a):(g.success(`${t.nombre} añadido`),[...a,{...t,cantidad:1,unit:t.precio,precio_modificado:t.precio}])}),j(""),(l=M.current)==null||l.focus()},z=(t,l)=>{m(a=>a.map(d=>{if(d.id_producto===t){const h=d.cantidad+l;return h<=0?null:o==="SALIDA"&&h>d.existencia?d:{...d,cantidad:h}}return d}).filter(Boolean))},ee=(t,l)=>{m(a=>a.map(d=>d.id_producto===t?{...d,precio_modificado:l}:d))},te=async()=>{if(o==="SALIDA"&&!y.trim())return g.error("Debe ingresar un motivo para la salida.");if(o==="COTIZACION"&&!p)return g.error("Seleccione un cliente para la cotización.");if(c.length===0)return g.error("El carrito está vacío.");A(!0)},oe=async()=>{var t,l;A(!1),R(!0);try{const a=localStorage.getItem("token"),d=await be({motivo:y,items:c,tipo:o,id_cliente:p==null?void 0:p.id_cliente,cliente_nombre:p==null?void 0:p.nombre},a);m([]),C(""),w(null),v(""),I(d.ticket),g.success(o==="SALIDA"?"Salida procesada correctamente":"Cotización generada"),n()}catch(a){console.error(a),g.error(((l=(t=a.response)==null?void 0:t.data)==null?void 0:l.msg)||"Error al procesar salida.")}finally{R(!1)}},re=async()=>{try{const t=localStorage.getItem("token"),l=await ye(t);Y(l)}catch(t){console.error(t)}},ie=()=>{_(!0),re()},ne=t=>{const l={id:t.tipo==="COTIZACION"?`COT-${t.id}`:`TR-${t.id}`,outflowId:t.id,type:t.tipo==="COTIZACION"?"quote":"outflow",tipo:t.tipo,fecha:t.fecha,usuarioNombre:t.usuario_nombre,clienteNombre:t.tipo==="COTIZACION"?t.cliente_nombre||"Cliente General":`MOTIVO: ${t.motivo}`,items:t.items.map(a=>({...a,total:a.quantity*a.unit})),totalVenta:t.total_venta,totalCosto:t.total_costo,isOutflow:!0,isQuote:t.tipo==="COTIZACION"};I(l)};return e.jsxs($e,{children:[e.jsxs(De,{children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:15},children:[e.jsx(le,{to:"/dashboard",style:{color:"#6b7280",fontSize:"1.2rem"},children:e.jsx(de,{})}),e.jsxs(Le,{children:[e.jsx(O,{style:{color:"#ef4444"}})," Traslados / Salidas"]})]}),e.jsxs("button",{onClick:ie,style:{display:"flex",alignItems:"center",gap:8,padding:"8px 16px",borderRadius:8,border:"1px solid #e5e7eb",background:"white",cursor:"pointer"},children:[e.jsx(ce,{})," Historial"]})]}),e.jsxs(Re,{children:[e.jsxs(Pe,{children:[e.jsxs(Me,{children:[e.jsx(pe,{style:{position:"absolute",left:15,top:15,color:"#9ca3af"}}),e.jsx(Be,{ref:M,placeholder:"Buscar producto por nombre o código...",value:i,onChange:t=>j(t.target.value),autoFocus:!0})]}),e.jsx(Ee,{children:J.map(t=>e.jsxs(We,{onClick:()=>K(t),children:[e.jsx("div",{style:{fontWeight:"bold",fontSize:"0.9rem",marginBottom:5},children:t.nombre}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",color:"#6b7280"},children:[e.jsx("span",{children:t.codigo}),e.jsxs("span",{style:{color:t.existencia>0?"#10b981":"#ef4444",fontWeight:"bold"},children:["Stock: ",t.existencia]})]}),e.jsxs("div",{style:{marginTop:"auto",textAlign:"right",fontWeight:"bold",fontSize:"0.9rem"},children:["C$ ",Number(t.precio).toFixed(2)]})]},t.id_producto))})]}),e.jsxs(Fe,{children:[e.jsxs("div",{style:{padding:"1rem",borderBottom:"1px solid #eee"},children:[e.jsxs(Ge,{children:[e.jsxs(H,{$active:o==="SALIDA",onClick:()=>f("SALIDA"),children:[e.jsx(O,{size:12,style:{marginRight:5}})," Salida"]}),e.jsxs(H,{$active:o==="COTIZACION",onClick:()=>f("COTIZACION"),children:[e.jsx(N,{size:12,style:{marginRight:5}})," Cotización"]})]}),o==="COTIZACION"&&e.jsxs(Ue,{children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:5},children:[e.jsx(xe,{size:14,color:"#64748b"}),e.jsx("span",{style:{fontSize:"0.85rem",fontWeight:600},children:"Cliente:"})]}),e.jsx(Ve,{placeholder:"Buscar cliente...",value:p?p.nombre:u,onChange:t=>{v(t.target.value),w(null),k(!0)},onFocus:()=>k(!0)}),p&&e.jsx("button",{onClick:()=>{w(null),v("")},style:{position:"absolute",right:10,top:32,background:"none",border:"none",color:"#94a3b8",cursor:"pointer"},children:e.jsx(B,{size:12})}),U&&e.jsx(Ye,{children:X.map(t=>e.jsx(Xe,{onClick:()=>{w(t),v(t.nombre),k(!1)},children:t.nombre},t.id_cliente))})]}),e.jsxs("h2",{style:{margin:0,fontSize:"1.1rem"},children:["Carrito de ",o==="SALIDA"?"Salida":"Cotización"]}),e.jsxs("div",{style:{fontSize:"0.9rem",color:"#6b7280"},children:[c.length," items"]})]}),e.jsx(He,{children:c.length===0?e.jsxs("div",{style:{textAlign:"center",color:"#9ca3af",marginTop:50},children:[e.jsx(me,{size:40,style:{marginBottom:10}}),e.jsx("p",{children:"Escanea o selecciona productos"})]}):c.map(t=>e.jsxs(Ze,{children:[e.jsxs("div",{style:{flex:1},children:[e.jsx("div",{style:{fontWeight:"bold",fontSize:"0.9rem"},children:t.nombre}),e.jsx("div",{style:{fontSize:"0.75rem",color:"#6b7280"},children:t.codigo}),o==="COTIZACION"&&e.jsxs("div",{style:{marginTop:5,display:"flex",alignItems:"center",gap:5},children:[e.jsx("span",{style:{fontSize:"0.75rem",color:"#64748b"},children:"C$"}),e.jsx("input",{type:"number",value:t.precio_modificado,onChange:l=>ee(t.id_producto,l.target.value),style:{width:80,padding:"2px 5px",fontSize:"0.85rem",border:"1px solid #e2e8f0",borderRadius:4}})]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10},children:[e.jsx("button",{onClick:()=>z(t.id_producto,-1),style:{width:25,height:25,borderRadius:"50%",border:"1px solid #ddd",background:"white",cursor:"pointer"},children:"-"}),e.jsx("span",{style:{fontWeight:"bold",minWidth:20,textAlign:"center"},children:t.cantidad}),e.jsx("button",{onClick:()=>z(t.id_producto,1),style:{width:25,height:25,borderRadius:"50%",border:"1px solid #ddd",background:"white",cursor:"pointer"},children:"+"}),e.jsx("button",{onClick:()=>z(t.id_producto,-9999),style:{color:"#ef4444",background:"none",border:"none",cursor:"pointer",marginLeft:5},children:e.jsx(ue,{})})]})]},t.id_producto))}),e.jsxs("div",{style:{padding:"1rem",background:"#f8fafc",borderTop:"1px solid #e5e7eb"},children:[o==="SALIDA"&&e.jsxs(e.Fragment,{children:[e.jsx("label",{style:{fontWeight:"bold",fontSize:"0.9rem",color:"#374151"},children:"Motivo / Razón:"}),e.jsx(Qe,{rows:"2",placeholder:"Ej: Merma, Uso Interno, Traslado a Bodega B...",value:y,onChange:t=>C(t.target.value)})]}),e.jsx(qe,{disabled:c.length===0||L,onClick:te,children:L?"Procesando...":e.jsxs(e.Fragment,{children:[e.jsx(he,{})," ",o==="SALIDA"?"Procesar Salida":"Generar Cotización"]})})]})]})]}),V&&e.jsx("div",{style:{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50},onClick:()=>_(!1),children:e.jsxs("div",{style:{background:"white",width:"90%",maxWidth:600,maxHeight:"80vh",borderRadius:12,padding:20,display:"flex",flexDirection:"column"},onClick:t=>t.stopPropagation(),children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:15},children:[e.jsx("h2",{style:{margin:0},children:"Historial de Salidas"}),e.jsx("button",{onClick:()=>_(!1),style:{background:"none",border:"none",fontSize:"1.2rem",cursor:"pointer"},children:e.jsx(B,{})})]}),e.jsxs("div",{style:{overflowY:"auto",flex:1},children:[D.length===0&&e.jsx("p",{style:{textAlign:"center",padding:20},children:"No hay registros."}),D.map(t=>e.jsxs(Je,{children:[e.jsxs("div",{children:[e.jsxs("div",{style:{fontWeight:"bold"},children:[t.tipo==="COTIZACION"?"COT":"TR","-#",t.id," - ",new Date(t.fecha).toLocaleString()]}),e.jsx("div",{style:{fontSize:"0.85rem",color:"#6b7280"},children:t.tipo==="COTIZACION"?`Cliente: ${t.cliente_nombre||"General"}`:`Motivo: ${t.motivo}`}),e.jsxs("div",{style:{fontSize:"0.8rem",color:"#6b7280"},children:["Por: ",t.usuario_nombre," | ",t.total_items," items"]})]}),e.jsxs("button",{onClick:()=>ne(t),style:{padding:"6px 12px",background:"#e0f2fe",color:"#0284c7",border:"none",borderRadius:6,cursor:"pointer",display:"flex",alignItems:"center",gap:5},children:[e.jsx(q,{})," Imprimir"]})]},t.id))]})]})}),S&&e.jsx(_e,{isOpen:!!S,transaction:S,onClose:()=>I(null)}),e.jsx(Q,{children:P&&e.jsx(Oe,{open:P,onCancel:()=>A(!1),onConfirm:oe,title:o==="SALIDA"?"Confirmar Salida":"Confirmar Cotización",message:o==="SALIDA"?"¿Estás seguro de que deseas procesar esta salida? El inventario se descontará inmediatamente.":"¿Estás seguro de que deseas generar esta cotización? No afectará el inventario."})})]})};export{it as default};

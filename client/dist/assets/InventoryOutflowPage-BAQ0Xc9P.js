import{R as Ie,r as p,j as e,A as F,C as Q,P as U,af as fe,x as _e,s as r,m as P,b as ze,X as $e,ab as Ae,Z as re,$ as Ne,k as A,a0 as Oe,a1 as ie,M as ae,a6 as Te,a7 as De,g as Le,G as Fe,a5 as Pe,ad as Me,Y as Be,D as Ee,W as Re,an as v,V as He}from"./vendor-BVroOj2J.js";import{a as We,u as Ze,Z as Qe,_ as Ue}from"./index-fl4El2y-.js";import{r as ne}from"./searchEngine-BMYcElFi.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-C0MaOehg.js";const Ge=r(P.div)`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1100;
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(4px);
`,qe=r(P.div)`
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
`,Z=r.button`
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  display: flex; align-items: center; gap: 0.5rem;
  transition: all 0.2s;
  font-size: 0.9rem;
  
  ${t=>t.$cancel?`
    background: #fee2e2; color: #b91c1c;
    &:hover { background: #fecaca; }
  `:`
    background: #0f172a; color: white;
    &:hover { background: #334155; transform: translateY(-1px); }
  `}
`,Ve=r.div`
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
`,Ye=r.img`
  max-width: 130px;
  max-height: 90px;
  width: auto;
  height: auto;
  display: block;
  margin: 0 auto 6px;
  object-fit: contain;
`,Je=r.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: .75rem;
`,Xe=({isOpen:t,onClose:j,transaction:l})=>{var y;const{settings:n}=We(),I=Ie.useMemo(()=>{if(!(n!=null&&n.empresa_logo_url))return null;if(n.empresa_logo_url.startsWith("http"))return n.empresa_logo_url;let i=n.empresa_logo_url;return i.startsWith("/uploads")?i="/api"+i:i.startsWith("uploads")&&(i="/api/"+i),`${"https://sistema.multirepuestosrg.com/api".replace(/\/api$/,"")}${i.startsWith("/")?"":"/"}${i}`},[n==null?void 0:n.empresa_logo_url]),g={name:(n==null?void 0:n.empresa_nombre)||"Multirepuestos RG",ruc:(n==null?void 0:n.empresa_ruc)||"1211812770001E",phone:(n==null?void 0:n.empresa_telefono)||"84031936 / 84058142",address:(n==null?void 0:n.empresa_direccion)||"Del portón de la normal 75 varas al este. Juigalpa, Chontales.",slogan:(n==null?void 0:n.empresa_eslogan)||"Repuestos de confianza al mejor precio — calidad que mantiene tu motor en marcha.",logo:I||new URL("/icons/logo.png",window.location.origin).toString()};if(!t||!l)return null;const h=i=>new Intl.NumberFormat("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(i||0)),C=p.useCallback((i="80")=>{const f=document.getElementById("print-wrapper-outflow");if(!f)return;const k=f.outerHTML,S=`
      @page {
        size: ${i==="A4"?"A4 portrait":"80mm auto"};
        margin: ${i==="A4"?"15mm":"0"};
      }
      body { margin: 0; padding: 0; font-family: ${i==="A4"?"'Inter', Helvetica, Arial, sans-serif":"'Consolas', monospace"}; }
      
      #print-wrapper-outflow {
        width: ${i==="A4"?"100%":"80mm"} !important;
        max-width: ${i==="A4"?"none":"80mm"} !important;
        margin: 0 auto !important;
        border: none !important;
        box-shadow: none !important;
        font-size: ${i==="A4"?"10pt":"8pt"} !important;
        padding: ${i==="A4"?"0":"5px"} !important;
      }

      /* A4 Grid / Cuadrícula Styling */
      /* A4 Grid / Cuadrícula Styling */
      ${i==="A4"?`
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

      .brand h1 { font-size: ${i==="A4"?"22pt":"12pt"} !important; margin: 0; }
      .brand img { width: ${i==="A4"?"180px":"150px"} !important; }
      
      /* Ocultar scrollbars */
      ::-webkit-scrollbar { display: none; }
    `,b=window.open("","_blank",`width=${i==="A4"?1e3:400},height=700`);b&&(b.document.write(`
      <html>
        <head>
          <title>Imprimir Comprobante - ${i}</title>
          <style>${S}</style>
        </head>
        <body>${k}</body>
      </html>
    `),b.document.close(),b.onload=()=>{setTimeout(()=>{b.focus(),b.print()},500)})},[]);return p.useEffect(()=>{},[t,C]),e.jsx(F,{children:t&&e.jsx(Ge,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(qe,{initial:{y:50,opacity:0,scale:.95},animate:{y:0,opacity:1,scale:1},exit:{y:50,opacity:0,scale:.95},transition:{type:"spring",stiffness:300,damping:30},children:[e.jsxs(Je,{className:"no-print",children:[e.jsxs("h3",{style:{margin:0,display:"flex",alignItems:"center",gap:"8px"},children:[l.isQuote?e.jsx(Q,{}):e.jsx(U,{}),l.isQuote?"Cotización Generada":"Salida Exitosa"]}),e.jsxs("div",{style:{display:"flex",gap:"8px"},children:[e.jsxs(Z,{onClick:()=>C("80"),title:"Imprimir Ticket 80mm",children:[e.jsx(fe,{})," 80mm"]}),e.jsxs(Z,{onClick:()=>C("A4"),title:"Imprimir Carta A4",children:[e.jsx(Q,{})," A4"]}),e.jsx(Z,{$cancel:!0,onClick:j,children:e.jsx(_e,{})})]})]}),e.jsx("div",{style:{display:"flex",justifyContent:"center",background:"#f8fafc",padding:"10px",borderRadius:"8px"},children:e.jsxs(Ve,{id:"print-wrapper-outflow",children:[e.jsxs("div",{className:"brand",children:[e.jsx(Ye,{src:g.logo,alt:"Logo",onError:i=>i.currentTarget.style.display="none"}),e.jsxs("div",{className:"brand-info",children:[e.jsx("h1",{children:g.name}),e.jsx("small",{children:g.slogan}),e.jsxs("small",{children:["RUC: ",g.ruc]}),e.jsx("small",{children:g.address}),e.jsx("div",{className:"tag",children:l.isQuote?"COTIZACIÓN":"COMPROBANTE DE SALIDA"})]})]}),e.jsxs("div",{className:"meta",children:[e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr",gap:"4px"},children:[e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:"Fecha:"})," ",e.jsx("span",{className:"meta-value",children:new Date(l.fecha).toLocaleString()})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:l.isQuote?"N° Cotización:":"N° Comprobante:"})," ",e.jsx("span",{className:"meta-value",children:l.id})]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr",gap:"4px"},children:[e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:l.isQuote?"Cliente:":"Motivo/Ref:"})," ",e.jsx("span",{className:"meta-value",children:((y=l.clienteNombre)==null?void 0:y.replace("MOTIVO: ",""))||l.motivo})]}),e.jsxs("p",{children:[e.jsx("span",{className:"meta-label",children:l.isQuote?"Cotizado por:":"Autorizado por:"})," ",e.jsx("span",{className:"meta-value",children:l.usuarioNombre})]})]})]}),e.jsxs("table",{className:"items",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{className:"col-qty",children:"Cant"}),e.jsx("th",{className:"col-code",children:"Cód."}),e.jsx("th",{children:"Desc."}),!l.isQuote&&e.jsx("th",{className:"text-right",children:"Costo U."}),e.jsx("th",{className:"text-right",children:"P. Venta"}),e.jsx("th",{className:"text-right",children:"Total"})]})}),e.jsx("tbody",{children:l.items.map((i,f)=>e.jsxs("tr",{children:[e.jsx("td",{className:"col-qty",children:i.quantity}),e.jsx("td",{className:"col-code",children:i.codigo||"-"}),e.jsx("td",{children:i.nombre}),!l.isQuote&&e.jsx("td",{className:"text-right",children:h(i.cost)}),e.jsx("td",{className:"text-right",children:h(i.unit)}),e.jsx("td",{className:"text-right",children:h(i.unit*i.quantity)})]},f))})]}),e.jsxs("div",{className:"totals",children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between"},children:[e.jsx("span",{children:"Items Totales:"}),e.jsx("span",{children:l.totalItems})]}),e.jsxs("div",{className:"grand-total-box",children:[!l.isQuote&&e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.9rem",marginBottom:"8px"},children:[e.jsx("span",{children:" COSTO TOTAL:"}),e.jsxs("span",{children:["C$ ",h(l.totalCosto)]})]}),e.jsxs("div",{className:"grand-total",style:{borderTop:l.isQuote?"none":"1px dashed #333"},children:[e.jsx("span",{children:l.isQuote?"TOTAL COTIZADO:":"TOTAL VALORIZADO:"}),e.jsxs("span",{children:["C$ ",h(l.totalVenta)]})]})]})]}),e.jsxs("div",{className:"thanks",children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-around",marginTop:"30px"},children:[e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx("p",{children:"__________________________"}),e.jsx("p",{children:"Entregado Por"})]}),e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx("p",{children:"__________________________"}),e.jsx("p",{children:"Recibido Por"})]})]}),e.jsx("p",{style:{marginTop:"20px",whiteSpace:"pre-line"},children:(n==null?void 0:n.ticket_transfer_footer)||"Salida de Inventario autorizada."})]})]})})]})})})},z=t=>Number(t||0).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}),Ke=r.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: radial-gradient(circle at 10% 10%, #eef6fc 0%, #f3f8fb 50%, #e9f2f8 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow: hidden;
  color: #1e293b;
`,eo=r.header`
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(14px);
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  z-index: 20;
`,oo=r.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`,to=r(He)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: #f1f5f9;
  color: #475569;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.88rem;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: #e2e8f0;
    color: #0f172a;
    transform: translateX(-2px);
  }
`,ro=r.h1`
  font-size: 1.3rem;
  font-weight: 800;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;

  span.badge {
    font-size: 0.72rem;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 6px;
    background: #fee2e2;
    color: #ef4444;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`,io=r.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`,$=r.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid ${t=>t.$primary?"#3b82f6":"#cbd5e1"};
  background: ${t=>t.$primary?"#3b82f6":"#ffffff"};
  color: ${t=>t.$primary?"#ffffff":"#334155"};
  box-shadow: ${t=>t.$primary?"0 4px 10px rgba(59, 130, 246, 0.25)":"0 2px 4px rgba(0,0,0,0.02)"};

  &:hover {
    background: ${t=>t.$primary?"#2563eb":"#f8fafc"};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`,ao=r.div`
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 1.25rem;
  padding: 1.25rem;
  flex: 1;
  overflow: hidden;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    overflow-y: auto;
  }
`,no=r.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 1.25rem;
`,so=r.div`
  display: flex;
  gap: 8px;
  margin-bottom: 1rem;
  align-items: center;
`,lo=r.div`
  position: relative;
  flex: 1;
`,co=r.input`
  width: 100%;
  padding: 12px 14px 12px 42px;
  background: #ffffff;
  border: 1.5px solid #cbd5e1;
  border-radius: 10px;
  font-size: 0.95rem;
  color: #1e293b;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }

  &::placeholder {
    color: #94a3b8;
  }
`,po=r.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  display: flex;
  align-items: center;
  pointer-events: none;
`,xo=r.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: #e2e8f0;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #cbd5e1;
    color: #0f172a;
  }
`,se=r.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 1.5px solid ${t=>t.$active?"#3b82f6":"#cbd5e1"};
  background-color: ${t=>t.$active?"#eff6ff":"#ffffff"};
  color: ${t=>t.$active?"#3b82f6":"#64748b"};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
  }
`,fo=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding: 0 4px;
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
`,mo=r.div`
  flex: 1;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
  padding-right: 4px;
  padding-bottom: 10px;

  /* Custom Scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
`,go=r.div`
  background: #ffffff;
  border: 1px solid ${t=>t.$outOfStock?"#fecaca":"#e2e8f0"};
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  cursor: ${t=>t.$outOfStock?"not-allowed":"pointer"};
  opacity: ${t=>t.$outOfStock?.6:1};
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.02);

  &:hover {
    ${t=>!t.$outOfStock&&`
      transform: translateY(-3px);
      box-shadow: 0 8px 18px -4px rgba(0, 0, 0, 0.08);
      border-color: #3b82f6;
    `}
  }

  &:active {
    ${t=>!t.$outOfStock&&`
      transform: translateY(-1px);
    `}
  }
`,ho=r.div`
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 3px 8px;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 700;
  color: white;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0,0,0,0.12);
  background: ${t=>t.$out?"#ef4444":t.$low?"#f59e0b":"#10b981"};
`,bo=r.div`
  height: 120px;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #f1f5f9;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 6px;
  }
`,uo=r.div`
  position: absolute;
  top: 6px;
  left: 6px;
  z-index: 12;
  background: white;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`,jo=r.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 4px;
`,yo=r.div`
  font-weight: 600;
  font-size: 0.85rem;
  color: #1e293b;
  line-height: 1.25;
  height: 2.5rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`,wo=r.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
`,vo=r.div`
  margin-top: auto;
  font-weight: 800;
  font-size: 0.95rem;
  color: #2563eb;
`,Co=r.div`
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(14px);
  border-radius: 16px;
  border: 1px solid rgba(226, 232, 240, 0.85);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`,ko=r.div`
  padding: 1.25rem;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
`,So=r.div`
  display: flex;
  background: #f1f5f9;
  border-radius: 10px;
  padding: 4px;
  margin-bottom: 1rem;
  border: 1px solid #e2e8f0;
`,le=r.button`
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s ease;

  ${t=>t.$active?`
    background: #ffffff;
    color: ${t.$color||"#ef4444"};
    box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  `:`
    background: transparent;
    color: #64748b;
  `}

  &:hover {
    ${t=>!t.$active&&"color: #0f172a;"}
  }
`,Io=r.div`
  background: #f8fafc;
  border: 1.5px solid #cbd5e1;
  border-radius: 10px;
  padding: 8px 12px;
  margin-bottom: 0.75rem;
  position: relative;
`,_o=r.input`
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.88rem;
  font-weight: 500;
  color: #1e293b;

  &::placeholder {
    color: #94a3b8;
  }
`,zo=r.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.12);
  z-index: 30;
  max-height: 200px;
  overflow-y: auto;
`,$o=r.div`
  padding: 10px 14px;
  font-size: 0.88rem;
  cursor: pointer;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background: #eff6ff;
    color: #2563eb;
  }
`,Ao=r.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 8px;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
`,No=r.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #94a3b8;
  text-align: center;
  padding: 2rem;
  gap: 12px;

  p {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 500;
  }
`,Oo=r.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: border-color 0.2s;

  &:hover {
    border-color: #cbd5e1;
  }
`,To=r.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
`,Do=r.div`
  font-weight: 600;
  font-size: 0.88rem;
  color: #0f172a;
  line-height: 1.3;
`,Lo=r.div`
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 600;
`,Fo=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
`,Po=r.div`
  display: flex;
  align-items: center;
  gap: 6px;
`,de=r.button`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  color: #334155;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.15s ease;

  &:hover {
    background: #e2e8f0;
    color: #0f172a;
    border-color: #94a3b8;
  }

  &:active {
    transform: scale(0.95);
  }
`,Mo=r.div`
  min-width: 28px;
  text-align: center;
  font-weight: 700;
  font-size: 0.9rem;
  color: #0f172a;
`,Bo=r.input`
  width: 90px;
  padding: 4px 8px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1.5px solid #cbd5e1;
  border-radius: 6px;
  color: #0f172a;
  outline: none;

  &:focus {
    border-color: #3b82f6;
  }
`,Eo=r.button`
  background: transparent;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background 0.15s;

  &:hover {
    background: #fee2e2;
  }
`,Ro=r.div`
  padding: 1.25rem;
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`,Ho=r.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid #cbd5e1;
  border-radius: 10px;
  font-family: inherit;
  font-size: 0.88rem;
  color: #1e293b;
  resize: none;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`,ce=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #64748b;

  strong {
    color: #0f172a;
    font-size: 1.15rem;
    font-weight: 800;
  }
`,Wo=r.button`
  width: 100%;
  padding: 14px;
  background: ${t=>t.$isSalida?"linear-gradient(135deg, #ef4444 0%, #dc2626 100%)":"linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"};
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 6px 15px ${t=>t.$isSalida?"rgba(239, 68, 68, 0.3)":"rgba(59, 130, 246, 0.3)"};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px ${t=>t.$isSalida?"rgba(239, 68, 68, 0.4)":"rgba(59, 130, 246, 0.4)"};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }
`,G=r(P.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(6px);
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`,pe=r.div`
  background: #ffffff;
  width: 100%;
  max-width: ${t=>t.$width||"460px"};
  max-height: 85vh;
  border-radius: 20px;
  padding: 1.75rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`,xe=r.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;

  h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 800;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 10px;
  }
`,Zo=r.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-right: 4px;
`,Qo=r.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: #ffffff;
    border-color: #cbd5e1;
    box-shadow: 0 4px 10px rgba(0,0,0,0.03);
  }
`,Uo=({isOpen:t,imageSrc:j,onClose:l})=>!t||!j?null:e.jsx(G,{onClick:l,initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(P.div,{initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},onClick:n=>n.stopPropagation(),style:{position:"relative",maxWidth:"90%",maxHeight:"90vh"},children:[e.jsx("button",{onClick:l,style:{position:"absolute",top:-12,right:-12,background:"white",width:32,height:32,borderRadius:"50%",border:"none",cursor:"pointer",boxShadow:"0 4px 6px rgba(0,0,0,0.15)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10,color:"#ef4444"},children:e.jsx(A,{})}),e.jsx("img",{src:j,alt:"Vista ampliada",style:{maxWidth:"100%",maxHeight:"85vh",borderRadius:"16px",background:"white",objectFit:"contain",boxShadow:"0 20px 25px rgba(0,0,0,0.25)"}})]})}),Xo=()=>{const{user:t,products:j,refreshProducts:l,clients:n=[],globalReservations:I,getAvailableStock:g}=Ze();ze();const[h,C]=p.useState(""),[y,i]=p.useState("description"),[f,k]=p.useState([]),[S,b]=p.useState(""),[c,q]=p.useState("SALIDA"),[m,N]=p.useState(null),[M,O]=p.useState(""),[me,B]=p.useState(!1),[ge,E]=p.useState(!1),[V,he]=p.useState([]),[R,H]=p.useState(null),[Y,J]=p.useState(!1),[be,_]=p.useState(!1),[X,K]=p.useState({isOpen:!1,imageUrl:null}),T=p.useRef(null),ue=p.useMemo(()=>ne(n,M,["nombre"]).slice(0,10),[M,n]),D=p.useMemo(()=>{const o=y==="code";return ne(j||[],h,o?["codigo","codigo_barras"]:["nombre","codigo","descripcion"],{strict:o}).slice(0,80)},[j,h,y]),ee=p.useMemo(()=>{const o=new Map;return f.forEach(a=>{const s=a.id_producto||a.id;o.set(s,(o.get(s)||0)+Number(a.cantidad||0))}),o},[f]),L=p.useMemo(()=>{let o=0,a=0;return f.forEach(s=>{const d=Number(s.cantidad||0),u=Number(s.precio_modificado!==void 0?s.precio_modificado:s.precio||s.venta||0);o+=d,a+=d*u}),{totalItems:o,totalMonto:a}},[f]),oe=o=>{const a=o.id_producto||o.id,s=ee.get(a)||0,d=g?g(o,(t==null?void 0:t.id_usuario)||(t==null?void 0:t.id)):Number(o.existencia||0);if(c==="SALIDA"&&s+1>d){v.error(`Stock insuficiente. Solo hay ${d} unidades disponibles considerando reservas.`);return}k(u=>{if(u.find(x=>(x.id_producto||x.id)===a))return u.map(x=>(x.id_producto||x.id)===a?{...x,cantidad:x.cantidad+1}:x);{const x=parseFloat(o.precio_venta||o.precio||o.venta||0);return[...u,{...o,id_producto:a,id:a,cantidad:1,unit:x,precio_modificado:x}]}}),v.success(`${o.nombre} agregado`,{duration:1200})},W=(o,a)=>{k(s=>s.map(d=>{if((d.id_producto||d.id)===o){const w=d.cantidad+a;if(w<=0)return null;if(c==="SALIDA"){const x=g?g(d,(t==null?void 0:t.id_usuario)||(t==null?void 0:t.id)):Number(d.existencia||0);if(w>x)return v.error(`Máximo alcanzado (${x} unidades disponibles).`),d}return{...d,cantidad:w}}return d}).filter(Boolean))},je=(o,a)=>{k(s=>s.map(d=>(d.id_producto||d.id)===o?{...d,precio_modificado:Number(a)||0}:d))},ye=()=>{if(c==="SALIDA"&&!S.trim())return v.error("Debe ingresar un motivo o justificación para la salida.");if(c==="COTIZACION"&&!m)return v.error("Seleccione un cliente para la cotización.");if(f.length===0)return v.error("El carrito está vacío.");_(!0)},we=async()=>{var o,a;_(!1),J(!0);try{const s=localStorage.getItem("token"),d=await Qe({motivo:S,items:f,tipo:c,id_cliente:m==null?void 0:m.id_cliente,cliente_nombre:m==null?void 0:m.nombre},s);k([]),b(""),N(null),O(""),H(d.ticket),v.success(c==="SALIDA"?"Salida procesada con éxito":"Cotización generada con éxito"),l()}catch(s){console.error(s),v.error(((a=(o=s.response)==null?void 0:o.data)==null?void 0:a.msg)||s.message||"Error al procesar la operación.")}finally{J(!1)}},ve=async()=>{try{const o=localStorage.getItem("token"),a=await Ue(o);he(Array.isArray(a)?a:[])}catch(o){console.error(o)}},Ce=()=>{E(!0),ve()},ke=o=>{const a={id:o.tipo==="COTIZACION"?`COT-${o.id}`:`TR-${o.id}`,outflowId:o.id,type:o.tipo==="COTIZACION"?"quote":"outflow",tipo:o.tipo,fecha:o.fecha,usuarioNombre:o.usuario_nombre,clienteNombre:o.tipo==="COTIZACION"?o.cliente_nombre||"Cliente General":`MOTIVO: ${o.motivo}`,items:(o.items||[]).map(s=>({...s,total:(s.quantity||s.cantidad||0)*(s.unit||s.precio||0)})),totalVenta:o.total_venta,totalCosto:o.total_costo,isOutflow:!0,isQuote:o.tipo==="COTIZACION"};H(a)};return e.jsxs(Ke,{children:[e.jsxs(eo,{children:[e.jsxs(oo,{children:[e.jsxs(to,{to:"/dashboard",children:[e.jsx($e,{})," Volver al Dashboard"]}),e.jsxs(ro,{children:[e.jsx(U,{style:{color:"#ef4444"}})," Traslados y Salidas",e.jsx("span",{className:"badge",children:"Inventario"})]})]}),e.jsxs(io,{children:[e.jsxs($,{onClick:()=>l(),title:"Sincronizar Catálogo",children:[e.jsx(Ae,{})," Actualizar"]}),e.jsxs($,{$primary:!0,onClick:Ce,children:[e.jsx(re,{})," Historial de Salidas"]})]})]}),e.jsxs(ao,{children:[e.jsxs(no,{children:[e.jsxs(so,{children:[e.jsxs(lo,{children:[e.jsx(po,{children:e.jsx(Ne,{})}),e.jsx(co,{ref:T,placeholder:y==="code"?"Escribe código de producto...":"Buscar por nombre o descripción...",value:h,onChange:o=>C(o.target.value),onKeyDown:o=>{o.key==="Enter"&&D.length===1&&(oe(D[0]),C(""))}}),h&&e.jsx(xo,{onClick:()=>{var o;C(""),(o=T.current)==null||o.focus()},children:e.jsx(A,{size:11})})]}),e.jsx(se,{$active:y==="description",onClick:()=>{var o;i("description"),(o=T.current)==null||o.focus()},title:"Buscar por Nombre",children:e.jsx(Oe,{size:16})}),e.jsx(se,{$active:y==="code",onClick:()=>{var o;i("code"),(o=T.current)==null||o.focus()},title:"Buscar por Código",children:e.jsx(ie,{size:18})})]}),e.jsxs(fo,{children:[e.jsxs("span",{children:[e.jsx(ae,{color:"#3b82f6"})," ",D.length," productos mostrados"]}),e.jsxs("span",{children:["Total Catálogo: ",(j||[]).length]})]}),e.jsx(mo,{children:D.map(o=>{var te;const a=o.id_producto||o.id,s=ee.get(a)||0,d=Number(((te=I==null?void 0:I.totalByProduct)==null?void 0:te[a])||0),u=g?g(o,(t==null?void 0:t.id_usuario)||(t==null?void 0:t.id)):Number(o.existencia||0),w=Math.max(0,u-s),x=c==="SALIDA"&&w<=0;return e.jsxs(go,{$outOfStock:x,onClick:()=>!x&&oe(o),title:o.nombre,children:[e.jsx(ho,{$out:x,$low:w<5&&!x,children:x?d>0?"En Caja":"Agotado":`Stock: ${w}`}),e.jsxs(bo,{children:[o.imagen&&e.jsx(uo,{onClick:Se=>{Se.stopPropagation(),K({isOpen:!0,imageUrl:o.imagen})},children:e.jsx(Te,{size:12,color:"#475569"})}),o.imagen?e.jsx("img",{src:o.imagen,alt:o.nombre,loading:"lazy"}):e.jsx(De,{size:34,color:"#cbd5e1"})]}),e.jsxs(jo,{children:[e.jsx(yo,{children:o.nombre}),e.jsx(wo,{children:o.codigo||"S/C"}),e.jsxs(vo,{children:["C$ ",z(o.precio_venta||o.precio||o.venta)]})]})]},a)})})]}),e.jsxs(Co,{children:[e.jsxs(ko,{children:[e.jsxs(So,{children:[e.jsxs(le,{$active:c==="SALIDA",$color:"#ef4444",onClick:()=>q("SALIDA"),children:[e.jsx(U,{size:14})," Salida de Inventario"]}),e.jsxs(le,{$active:c==="COTIZACION",$color:"#3b82f6",onClick:()=>q("COTIZACION"),children:[e.jsx(Q,{size:14})," Cotización"]})]}),c==="COTIZACION"&&e.jsxs(Io,{children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6,marginBottom:4},children:[e.jsx(Le,{size:12,color:"#64748b"}),e.jsx("span",{style:{fontSize:"0.8rem",fontWeight:700,color:"#475569"},children:"Cliente Asignado:"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",position:"relative"},children:[e.jsx(_o,{placeholder:"Buscar o seleccionar cliente...",value:m?m.nombre:M,onChange:o=>{O(o.target.value),N(null),B(!0)},onFocus:()=>B(!0)}),m&&e.jsx("button",{onClick:()=>{N(null),O("")},style:{background:"none",border:"none",color:"#94a3b8",cursor:"pointer",padding:2},children:e.jsx(A,{size:12})})]}),me&&e.jsx(zo,{children:ue.map(o=>e.jsxs($o,{onClick:()=>{N(o),O(o.nombre),B(!1)},children:[e.jsx("strong",{children:o.nombre}),o.telefono&&e.jsx("span",{style:{fontSize:"0.75rem",color:"#64748b"},children:o.telefono})]},o.id_cliente))})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("div",{style:{fontWeight:800,fontSize:"1.1rem",color:"#0f172a",display:"flex",alignItems:"center",gap:8},children:[e.jsx(Fe,{color:c==="SALIDA"?"#ef4444":"#3b82f6"}),"Items en Carrito"]}),e.jsxs("span",{style:{fontSize:"0.85rem",fontWeight:600,color:"#64748b"},children:[f.length," productos"]})]})]}),e.jsx(Ao,{children:f.length===0?e.jsxs(No,{children:[e.jsx(ie,{size:44}),e.jsx("p",{children:"Haz clic en los productos para agregarlos a la salida o cotización."})]}):f.map(o=>{const a=o.id_producto||o.id,s=o.precio_modificado!==void 0?o.precio_modificado:o.precio||o.venta||0;return e.jsxs(Oo,{children:[e.jsxs(To,{children:[e.jsxs("div",{style:{flex:1},children:[e.jsx(Do,{children:o.nombre}),e.jsxs(Lo,{children:["Código: ",o.codigo||"S/C"]})]}),e.jsx(Eo,{onClick:()=>W(a,-9999),title:"Eliminar del carrito",children:e.jsx(Pe,{size:13})})]}),e.jsxs(Fo,{children:[e.jsxs(Po,{children:[e.jsx(de,{onClick:()=>W(a,-1),children:e.jsx(Me,{})}),e.jsx(Mo,{children:o.cantidad}),e.jsx(de,{onClick:()=>W(a,1),children:e.jsx(Be,{})})]}),c==="COTIZACION"?e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:4},children:[e.jsx("span",{style:{fontSize:"0.78rem",color:"#64748b",fontWeight:600},children:"C$"}),e.jsx(Bo,{type:"number",step:"0.01",value:o.precio_modificado,onChange:d=>je(a,d.target.value),title:"Modificar precio unitario para cotización"})]}):e.jsxs("div",{style:{fontWeight:700,fontSize:"0.9rem",color:"#2563eb"},children:["C$ ",z(s*o.cantidad)]})]})]},a)})}),e.jsxs(Ro,{children:[c==="SALIDA"&&e.jsxs("div",{children:[e.jsx("label",{style:{display:"block",fontWeight:700,fontSize:"0.82rem",color:"#475569",marginBottom:4},children:"Motivo / Justificación de la Salida:"}),e.jsx(Ho,{rows:"2",placeholder:"Ej: Traslado a Sucursal 2, Merma por daño, Uso interno de taller...",value:S,onChange:o=>b(o.target.value)})]}),e.jsxs(ce,{children:[e.jsx("span",{children:"Total Unidades:"}),e.jsxs("span",{children:[L.totalItems," un."]})]}),e.jsxs(ce,{children:[e.jsx("span",{children:"Total Estimado:"}),e.jsxs("strong",{children:["C$ ",z(L.totalMonto)]})]}),e.jsx(Wo,{$isSalida:c==="SALIDA",disabled:f.length===0||Y,onClick:ye,children:Y?e.jsx(e.Fragment,{children:"Procesando..."}):e.jsxs(e.Fragment,{children:[e.jsx(Ee,{}),c==="SALIDA"?"Procesar Salida (Descontar Stock)":"Generar Comprobante Cotización"]})})]})]})]}),e.jsx(F,{children:be&&e.jsx(G,{onClick:()=>_(!1),initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(pe,{onClick:o=>o.stopPropagation(),$width:"440px",children:[e.jsxs(xe,{children:[e.jsxs("h2",{children:[e.jsx(Re,{color:c==="SALIDA"?"#ef4444":"#3b82f6"}),c==="SALIDA"?"Confirmar Salida":"Confirmar Cotización"]}),e.jsx("button",{onClick:()=>_(!1),style:{background:"none",border:"none",cursor:"pointer",color:"#64748b"},children:e.jsx(A,{size:16})})]}),e.jsx("p",{style:{color:"#475569",fontSize:"0.92rem",lineHeight:1.5,margin:"0 0 1.5rem 0"},children:c==="SALIDA"?`¿Estás seguro de que deseas descontar ${L.totalItems} unidades del inventario con el motivo "${S}"?`:`¿Deseas generar la cotización para el cliente "${(m==null?void 0:m.nombre)||"General"}" con un total de C$ ${z(L.totalMonto)}?`}),e.jsxs("div",{style:{display:"flex",justifyContent:"flex-end",gap:10},children:[e.jsx($,{onClick:()=>_(!1),children:"Cancelar"}),e.jsx($,{$primary:c!=="SALIDA",style:c==="SALIDA"?{background:"#ef4444",color:"white",borderColor:"#ef4444"}:{},onClick:we,children:c==="SALIDA"?"Sí, Descontar Stock":"Sí, Generar Cotización"})]})]})})}),e.jsx(F,{children:ge&&e.jsx(G,{onClick:()=>E(!1),initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(pe,{onClick:o=>o.stopPropagation(),$width:"680px",children:[e.jsxs(xe,{children:[e.jsxs("h2",{children:[e.jsx(re,{color:"#3b82f6"})," Historial de Salidas y Cotizaciones"]}),e.jsx("button",{onClick:()=>E(!1),style:{background:"none",border:"none",cursor:"pointer",color:"#64748b"},children:e.jsx(A,{size:18})})]}),e.jsx(Zo,{children:V.length===0?e.jsxs("div",{style:{textAlign:"center",padding:"3rem 1rem",color:"#94a3b8"},children:[e.jsx(ae,{size:40,style:{marginBottom:8}}),e.jsx("p",{style:{margin:0},children:"No hay movimientos registrados."})]}):V.map(o=>e.jsxs(Qo,{children:[e.jsxs("div",{style:{flex:1},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:4},children:[e.jsxs("span",{style:{padding:"2px 8px",borderRadius:6,fontSize:"0.75rem",fontWeight:700,background:o.tipo==="COTIZACION"?"#eff6ff":"#fee2e2",color:o.tipo==="COTIZACION"?"#2563eb":"#ef4444"},children:[o.tipo==="COTIZACION"?"COTIZACIÓN":"SALIDA"," #",o.id]}),e.jsx("span",{style:{fontSize:"0.8rem",color:"#94a3b8"},children:new Date(o.fecha).toLocaleString()})]}),e.jsx("div",{style:{fontWeight:600,fontSize:"0.9rem",color:"#1e293b"},children:o.tipo==="COTIZACION"?`Cliente: ${o.cliente_nombre||"General"}`:`Motivo: ${o.motivo}`}),e.jsxs("div",{style:{fontSize:"0.8rem",color:"#64748b",marginTop:2},children:["Por: ",e.jsx("strong",{children:o.usuario_nombre})," | ",o.total_items," productos | Total: ",e.jsxs("strong",{children:["C$ ",z(o.total_venta)]})]})]}),e.jsxs($,{onClick:()=>ke(o),style:{padding:"6px 12px",fontSize:"0.82rem"},children:[e.jsx(fe,{})," Imprimir"]})]},o.id))})]})})}),R&&e.jsx(Xe,{isOpen:!!R,transaction:R,onClose:()=>H(null)}),e.jsx(F,{children:X.isOpen&&e.jsx(Uo,{isOpen:!0,imageSrc:X.imageUrl,onClose:()=>K({isOpen:!1,imageUrl:null})})})]})};export{Xo as default};

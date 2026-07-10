import{r as m,j as e,y as v,a$ as E,b0 as L,b1 as P,a7 as z,b2 as T,C as $,b3 as D,D as G,s}from"./vendor-BVroOj2J.js";import{a as I,u as R,c as A,b as H}from"./index-CbUf7eeN.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-C0MaOehg.js";const M=s.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`,U=s.h2`
  color: #1e293b;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 10px;
`,V=s.form`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`,C=s.h3`
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #334155;
  font-size: 1.1rem;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 8px;
`,t=s.div`
  margin-bottom: 1.5rem;
`,n=s.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 8px;
`,c=s.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`,g=s.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`,W=s.button`
  background: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
  &:hover { background: #2563eb; }
  &:disabled { background: #94a3b8; cursor: not-allowed; }
`,B=s.div`
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 6px;
  background: ${i=>i.error?"#fee2e2":"#dcfce7"};
  color: ${i=>i.error?"#991b1b":"#166534"};
  display: flex;
  align-items: center;
  gap: 8px;
`,q=s.img`
    max-width: 150px;
    border: 1px solid #ddd;
    padding: 5px;
    border-radius: 4px;
    margin-top: 10px;
    display: block;
`,Q=()=>{const{settings:i,refreshSettings:k}=I(),{token:f}=R(),[a,x]=m.useState({}),[j,_]=m.useState(!1),w=r=>r?r.startsWith("http")||r.startsWith("data:")?r:`${"https://sistema.multirepuestosrg.com/api".replace(/\/api$/,"")}${r.startsWith("/")?"":"/"}${r}`:null,[u,l]=m.useState(null),[h,y]=m.useState(!1);m.useEffect(()=>{i&&x(i)},[i]);const o=r=>{const{name:d,value:p}=r.target;x(b=>({...b,[d]:p}))},S=async r=>{const d=r.target.files[0];if(d){y(!0),l(null);try{const p=await H(f,d);x(b=>({...b,empresa_logo_url:p})),l({type:"success",text:"Logo subido correctamente. Recuerda Guardar Cambios."})}catch(p){console.error(p),l({type:"error",text:"Error al subir el logo."})}finally{y(!1)}}},F=async r=>{r.preventDefault(),_(!0),l(null);try{await A(f,a),await k(),l({type:"success",text:"Configuración actualizada correctamente"})}catch{l({type:"error",text:"Error al actualizar configuración"})}finally{_(!1)}};return e.jsxs(M,{children:[e.jsxs(U,{children:[e.jsx(v,{})," Configuración de Empresa"]}),e.jsxs(V,{onSubmit:F,children:[e.jsx(C,{children:"Datos Generales"}),e.jsxs(t,{children:[e.jsxs(n,{children:[e.jsx(v,{})," Nombre de la Empresa"]}),e.jsx(c,{name:"empresa_nombre",value:a.empresa_nombre||"",onChange:o,required:!0})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px"},children:[e.jsxs(t,{children:[e.jsxs(n,{children:[e.jsx(E,{})," RUC"]}),e.jsx(c,{name:"empresa_ruc",value:a.empresa_ruc||"",onChange:o})]}),e.jsxs(t,{children:[e.jsxs(n,{children:[e.jsx(L,{})," Teléfono(s)"]}),e.jsx(c,{name:"empresa_telefono",value:a.empresa_telefono||"",onChange:o})]})]}),e.jsxs(t,{children:[e.jsxs(n,{children:[e.jsx(P,{})," Dirección"]}),e.jsx(g,{name:"empresa_direccion",value:a.empresa_direccion||"",onChange:o,style:{minHeight:"80px"}})]}),e.jsxs(t,{children:[e.jsx(n,{children:"Eslogan"}),e.jsx(c,{name:"empresa_eslogan",value:a.empresa_eslogan||"",onChange:o})]}),e.jsxs(t,{children:[e.jsxs(n,{children:[e.jsx(z,{})," Logo del Ticket"]}),e.jsxs("div",{style:{display:"flex",gap:"10px",alignItems:"center"},children:[e.jsx(c,{type:"file",accept:"image/*",onChange:S,disabled:h}),h&&e.jsx("span",{children:"Subiendo..."})]}),a.empresa_logo_url&&e.jsx(q,{src:w(a.empresa_logo_url),alt:"Vista previa logo"}),e.jsx(c,{style:{marginTop:"10px"},name:"empresa_logo_url",value:a.empresa_logo_url||"",onChange:o,placeholder:"O ingresa una URL manual (https://...)"})]}),e.jsx(C,{children:"Personalización de Tickets"}),e.jsxs(t,{children:[e.jsxs(n,{children:[e.jsx(T,{})," Pie de Página (Ventas)"]}),e.jsx(g,{name:"ticket_sales_footer",value:a.ticket_sales_footer||"",onChange:o,placeholder:"Ej: ¡Gracias por su compra! Vuelva pronto.",style:{minHeight:"60px"}})]}),e.jsxs(t,{children:[e.jsxs(n,{children:[e.jsx($,{})," Pie de Página (Proformas)"]}),e.jsx(g,{name:"ticket_proforma_footer",value:a.ticket_proforma_footer||"",onChange:o,placeholder:"Ej: Cotización válida por 15 días.",style:{minHeight:"60px"}})]}),e.jsxs(t,{children:[e.jsxs(n,{children:[e.jsx(D,{})," Pie de Página (Traslados/Salidas)"]}),e.jsx(g,{name:"ticket_transfer_footer",value:a.ticket_transfer_footer||"",onChange:o,placeholder:"Ej: Salida de inventario autorizada.",style:{minHeight:"60px"}})]}),e.jsxs(W,{type:"submit",disabled:j||h,children:[e.jsx(G,{})," ",j?"Guardando...":"Guardar Cambios"]}),u&&e.jsx(B,{error:u.type==="error",children:u.text})]})]})};export{Q as default};

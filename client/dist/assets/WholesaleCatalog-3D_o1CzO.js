import{u as F,r as u,j as e,Y as N,I as E,w as T,a0 as _,O as B,A as C,a3 as q,bi as G,a7 as A,ba as L,s as a,m as z,am as h,n as O,D}from"./vendor-Bl8eSE-Q.js";import{u as R,a2 as k}from"./index-CjMKJdYy.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-DV8V3V31.js";const V=a.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f8fafc;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
`,Y=a.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`,P=a.button`
  background: #f1f5f9;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: #e2e8f0; transform: translateX(-2px); }
`,H=a.div`
  display: flex;
  gap: 15px;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`,U=a.div`
  position: relative;
  flex: 1;
  min-width: 250px;
  
  svg {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
  }

  input {
    width: 100%;
    padding: 12px 12px 12px 45px;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.2s;
    &:focus { border-color: #8b5cf6; }
  }
`,W=a.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
`,X=a(z.div)`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  overflow: hidden;
  ${o=>!o.$active&&`
    filter: grayscale(0.8) opacity(0.7);
    border-style: dashed;
  `}
`,J=a.div`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
`,K=a.div`
  flex: 1;
  h3 { margin: 0 0 5px 0; font-size: 1.15rem; color: #1e293b; line-height: 1.3; }
  small { color: #64748b; font-family: 'Roboto Mono', monospace; font-weight: 600; }
`,Q=a.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  background: #f8fafc;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
`,y=a.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  
  label { font-size: 0.75rem; color: #64748b; font-weight: 600; text-transform: uppercase; }
  span { font-size: 1rem; font-weight: 700; color: #1e293b; }
  
  &.featured {
    span { color: #8b5cf6; }
  }
`,Z=a.span`
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  background: ${o=>o.qty>10?"#dcfce7":o.qty>0?"#fff7ed":"#fee2e2"};
  color: ${o=>o.qty>10?"#166534":o.qty>0?"#9a3412":"#991b1b"};
`,ee=a.button`
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  color: #0369a1;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: #e0f2fe; }
`,S=a.button`
  background: ${o=>o.$active?"#8b5cf6":"white"};
  color: ${o=>o.$active?"white":"#8b5cf6"};
  border: 1px solid #8b5cf6;
  padding: 10px 20px;
  border-radius: 99px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 6px rgba(139, 92, 246, 0.2);
  &:hover { transform: translateY(-1px); box-shadow: 0 6px 12px rgba(139, 92, 246, 0.3); }
`,re=a.button`
  position: absolute;
  top: 15px;
  left: 15px;
  background: ${o=>o.$active?"#dcfce7":"#f1f5f9"};
  color: ${o=>o.$active?"#166534":"#64748b"};
  border: 1px solid ${o=>o.$active?"#bbf7d0":"#e2e8f0"};
  padding: 6px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.2s;
  &:hover { transform: scale(1.1); }
`,oe=a(z.div)`
  position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
  backdrop-filter: blur(4px); padding: 1rem;
`,ae=a.div`
  background: white; width: 100%; max-width: 600px;
  border-radius: 20px; padding: 2rem; position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`,d=a.div`
  display: flex; flex-direction: column; gap: 8px; margin-bottom: 1.25rem;
`,x=a.label`
  font-size: 0.9rem; font-weight: 600; color: #475569;
`,p=a.input`
  padding: 12px 14px; border: 1px solid #e2e8f0; border-radius: 10px;
  font-size: 1rem; color: #1e293b; outline: none;
  &:focus { border-color: #8b5cf6; box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1); }
`,ie=a.div`
  display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem;
  padding-top: 1.5rem; border-top: 1px solid #f1f5f9;
`,te=({product:o,onSave:l,onClose:c})=>{const[t,g]=u.useState({nombre:o.nombre,descripcion:o.descripcion||"",venta:o.venta,mayoreo:o.mayoreo||"",distribuidor:o.distribuidor||"",mayorista:o.mayorista||"",taller:o.taller||""}),n=i=>g({...t,[i.target.name]:i.target.value});return e.jsx(oe,{initial:{opacity:0},border:!0,animate:{opacity:1},exit:{opacity:0},onClick:c,children:e.jsxs(ae,{onClick:i=>i.stopPropagation(),children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem"},children:[e.jsxs("h2",{style:{margin:0,color:"#1e293b"},children:["Configurar Precios: ",o.codigo]}),e.jsx("button",{onClick:c,style:{border:"none",background:"none",cursor:"pointer",color:"#64748b"},children:e.jsx(O,{size:20})})]}),e.jsxs(d,{children:[e.jsx(x,{children:"Nombre del Producto"}),e.jsx(p,{name:"nombre",value:t.nombre,onChange:n})]}),e.jsxs(d,{children:[e.jsx(x,{children:"Descripción"}),e.jsx(p,{name:"descripcion",value:t.descripcion,onChange:n})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"},children:[e.jsxs(d,{children:[e.jsx(x,{children:"Precio Tienda (Público)"}),e.jsx(p,{type:"number",name:"venta",value:t.venta,onChange:n})]}),e.jsxs(d,{children:[e.jsx(x,{children:"Mayoreo"}),e.jsx(p,{type:"number",name:"mayoreo",value:t.mayoreo,onChange:n})]}),e.jsxs(d,{children:[e.jsx(x,{children:"Distribuidor"}),e.jsx(p,{type:"number",name:"distribuidor",value:t.distribuidor,onChange:n})]}),e.jsxs(d,{children:[e.jsx(x,{children:"Mayorista"}),e.jsx(p,{type:"number",name:"mayorista",value:t.mayorista,onChange:n})]})]}),e.jsxs(ie,{children:[e.jsx(P,{onClick:c,children:"Cancelar"}),e.jsxs(S,{$active:!0,onClick:()=>l(t),style:{borderRadius:"10px"},children:[e.jsx(D,{})," Guardar Cambios"]})]})]})})},de=()=>{const o=F(),{products:l,token:c,refreshProducts:t}=R(),[g,n]=u.useState(""),[i,$]=u.useState(!1),[f,j]=u.useState(null),v=u.useDeferredValue(g),w=u.useMemo(()=>{if(!l)return[];let r=i?l:l.filter(m=>!!m.catalogo_mayorista);const s=v.toLowerCase().trim();return s?r.filter(m=>(m.nombre||"").toLowerCase().includes(s)||(m.codigo||"").toLowerCase().includes(s)||(m.descripcion||"").toLowerCase().includes(s)):r},[l,v,i]),I=async r=>{try{const s=r.catalogo_mayorista?0:1;await k(r.id_producto,{...r,catalogo_mayorista:s},c),h.success(s?"Producto activado":"Producto ocultado"),t()}catch{h.error("Error al actualizar visibilidad")}},M=async r=>{try{await k(f.id_producto,{...f,...r,mayoreo:r.mayoreo||null,distribuidor:r.distribuidor||null,taller:r.taller||null,mayorista:r.mayorista||null},c),h.success("Producto actualizado"),j(null),t()}catch{h.error("Error al guardar cambios")}},b=r=>new Intl.NumberFormat("es-NI",{style:"currency",currency:"NIO",currencyDisplay:"code"}).format(Number(r||0)).replace("NIO","C$");return e.jsxs(V,{children:[e.jsxs(Y,{children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"20px"},children:[e.jsxs(P,{onClick:()=>o("/wholesale-menu"),children:[e.jsx(N,{})," Volver"]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[e.jsx(E,{size:28,color:"#8b5cf6"}),e.jsx("h1",{style:{margin:0,fontSize:"1.8rem",color:"#1e293b"},children:"Catálogo Mayorista"})]})]}),e.jsxs(S,{$active:i,onClick:()=>$(!i),children:[e.jsx(T,{})," ",i?"Finalizar Gestión":"Gestionar Catálogo"]})]}),e.jsx(H,{children:e.jsxs(U,{children:[e.jsx(_,{}),e.jsx("input",{type:"text",placeholder:"Buscar por nombre, código o descripción...",value:g,onChange:r=>n(r.target.value)})]})}),w.length===0?e.jsxs("div",{style:{textAlign:"center",padding:"5rem",background:"white",borderRadius:"16px",color:"#64748b"},children:[e.jsx(B,{size:64,style:{marginBottom:"1.5rem",opacity:.3}}),e.jsx("h3",{children:"No se encontraron productos"}),e.jsx("p",{children:i?"No hay productos en el inventario.":"Configura los productos para que aparezcan aquí."})]}):e.jsx(W,{children:e.jsx(C,{children:w.map(r=>e.jsxs(X,{$active:!!r.catalogo_mayorista,initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,scale:.95},children:[i&&e.jsx(re,{$active:!!r.catalogo_mayorista,onClick:()=>I(r),title:r.catalogo_mayorista?"Ocultar del catálogo":"Mostrar en catálogo",children:r.catalogo_mayorista?e.jsx(q,{}):e.jsx(G,{})}),e.jsxs(Z,{qty:r.existencia,children:["Stock: ",r.existencia]}),e.jsx(J,{children:e.jsxs(K,{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start"},children:[e.jsx("small",{children:r.codigo||"S/C"}),e.jsxs(ee,{onClick:()=>j(r),children:[e.jsx(A,{})," Editar"]})]}),e.jsx("h3",{children:r.nombre}),e.jsx("p",{style:{margin:"5px 0 0 0",fontSize:"0.9rem",color:"#64748b"},children:r.descripcion})]})}),e.jsxs(Q,{children:[e.jsxs(y,{children:[e.jsx("label",{children:"Precio Tienda"}),e.jsx("span",{children:b(r.venta||0)})]}),e.jsxs(y,{className:"featured",children:[e.jsx("label",{children:"Mayoreo"}),e.jsx("span",{children:b(r.mayoreo||0)})]}),e.jsxs(y,{className:"featured",children:[e.jsx("label",{children:"Distribuidor"}),e.jsx("span",{children:b(r.distribuidor||0)})]}),e.jsxs(y,{className:"featured",children:[e.jsx("label",{children:"Especial"}),e.jsx("span",{children:b(r.mayorista||0)})]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",fontSize:"0.85rem",color:"#94a3b8",marginTop:"auto"},children:[e.jsx(L,{}),e.jsx("span",{children:"Precios sujetos a cambios según promociones activas."})]})]},r.id_producto||r.id))})}),e.jsx(C,{children:f&&e.jsx(te,{product:f,onClose:()=>j(null),onSave:M})})]})};export{de as default};

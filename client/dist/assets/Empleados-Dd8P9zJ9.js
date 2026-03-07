import{r as n,j as e,A as M,am as d,s as r,m as C,W as A}from"./vendor-Bl8eSE-Q.js";import{u as _,t as I,V as L,W as N,X as O}from"./index-B613Eyqa.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-DV8V3V31.js";const V=()=>e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"m15 18-6-6 6-6"})}),w=r.div`
  padding: 2rem 4rem;
  background-color: #f8f9fa;
  min-height: 100vh;
  @media (max-width: 768px) {
    padding: 1rem;
    min-height: 100dvh;
  }
`,W=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  @media (max-width: 500px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
`,G=r.h1`
  font-size: 2.5rem;
  color: #343a40;
  @media (max-width: 768px) { font-size: 1.8rem; text-align: center; }
`,l=r.button`
  padding: 0.7rem 1.3rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9rem;
  transition: all 0.2s ease-in-out;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);

  &:active {
    transform: scale(0.98);
    box-shadow: none;
  }
`,P=r(A)`
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: #495057;
    font-weight: 600;
    margin-bottom: 2rem;
    &:hover { color: #007bff; }
    @media (max-width: 768px) {
      margin-bottom: 1.5rem; font-size: 1rem; align-self: flex-start;
    }
`,q=r(l)`
  background-color: #28a745;
  color: white;
  &:hover { background-color: #218838; }
  @media (max-width: 500px) { width: 100%; justify-content: center; }
`,y=r(l)`
  background: none; border: 1px solid #ffc107; color: #ffc107; padding: 0.5rem 1rem; margin-right: 0.5rem;
  &:hover { background-color: #ffc107; color: #212529; }
`,k=r(l)`
  background: none; border: 1px solid #dc3545; color: #dc3545; padding: 0.5rem 1rem;
  &:hover { background-color: #dc3545; color: white; }
`,R=r.div`
  display: none;
  @media (max-width: 768px) { display: flex; flex-direction: column; gap: 1rem; }
`,F=r.div`
  background-color: white;
  padding: 1rem 1.2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border-left: 5px solid #007bff;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.5rem;
`,H=r.table`
  width: 100%; border-collapse: collapse; background-color: white;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.07); border-radius: 12px; overflow: hidden;
  @media (max-width: 768px) { display: none; }
`,s=r.th` background-color: #343a40; color: white; padding: 1.2rem 1rem; text-align: left; font-weight: 600; `,a=r.td` padding: 1.2rem 1rem; border-bottom: 1px solid #dee2e6; color: #495057; `,v=r.tr` &:last-child ${a} { border-bottom: none; } &:hover { background-color: #f8f9fa; } `,X=r(C.div)`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.6); display: flex; justify-content: center; align-items: center; z-index: 1000;
`,$=r(C.form)`
  background: white; padding: 2.5rem; border-radius: 16px; width: 90%; max-width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  @media (max-width: 500px) { width: 95%; padding: 1.5rem; margin: 1rem; }
`,E=r.input`
  width: 100%; padding: 0.8rem 1rem; margin-bottom: 1.2rem; border-radius: 8px; border: 1px solid #ced4da; font-size: 1rem;
`,Y=()=>{const{token:c}=_(),[p,B]=n.useState([]),[S,g]=n.useState(!0),[T,i]=n.useState(!1),[h,f]=n.useState(null),[t,m]=n.useState({nombre:"",telefono:"",cargo:"Vendedor"}),x=async()=>{try{g(!0);const o=await I(c);B(Array.isArray(o)?o:[])}catch{d.error("Error al cargar empleados")}finally{g(!1)}};n.useEffect(()=>{x()},[]);const z=()=>{f(null),m({nombre:"",telefono:"",cargo:"Vendedor"}),i(!0)},u=o=>{f(o),m({nombre:o.nombre,telefono:o.telefono||"",cargo:o.cargo}),i(!0)},b=async o=>{if(window.confirm("¿Seguro que deseas eliminar este empleado?"))try{await L(o,c),d.success("Empleado eliminado"),x()}catch{d.error("Error al eliminar empleado")}},D=async o=>{o.preventDefault();try{h?await N(h.id_empleado,t,c):await O(t,c),d.success("Guardado correctamente"),i(!1),x()}catch(j){d.error(j.message||"Error al guardar")}};return S?e.jsx(w,{children:e.jsx("p",{children:"Cargando..."})}):e.jsxs(w,{children:[e.jsxs(P,{to:"/dashboard",children:[e.jsx(V,{})," Volver al Dashboard"]}),e.jsxs(W,{children:[e.jsx(G,{children:"Gestión de Empleados"}),e.jsx(q,{onClick:z,children:"+ Nuevo Empleado"})]}),e.jsxs(H,{children:[e.jsx("thead",{children:e.jsxs(v,{children:[e.jsx(s,{children:"ID"}),e.jsx(s,{children:"Nombre"}),e.jsx(s,{children:"Teléfono"}),e.jsx(s,{children:"Cargo"}),e.jsx(s,{children:"Acciones"})]})}),e.jsx("tbody",{children:p.map(o=>e.jsxs(v,{children:[e.jsx(a,{children:o.id_empleado}),e.jsx(a,{children:e.jsx("strong",{children:o.nombre})}),e.jsx(a,{children:o.telefono||"-"}),e.jsx(a,{children:o.cargo}),e.jsxs(a,{children:[e.jsx(y,{onClick:()=>u(o),children:"✏️ Editar"}),e.jsx(k,{onClick:()=>b(o.id_empleado),children:"🗑️"})]})]},o.id_empleado))})]}),e.jsx(R,{children:p.map(o=>e.jsxs(F,{children:[e.jsxs("div",{children:[e.jsx("strong",{children:o.nombre}),e.jsxs("div",{style:{fontSize:"0.85rem",color:"#666"},children:[o.cargo," - ",o.telefono]})]}),e.jsxs("div",{style:{display:"flex",gap:"0.5rem",alignItems:"center"},children:[e.jsx(y,{onClick:()=>u(o),style:{marginRight:0},children:"✏️"}),e.jsx(k,{onClick:()=>b(o.id_empleado),children:"🗑️"})]})]},o.id_empleado))}),e.jsx(M,{children:T&&e.jsx(X,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:()=>i(!1),children:e.jsxs($,{initial:{y:-50},animate:{y:0},exit:{y:50},onClick:o=>o.stopPropagation(),onSubmit:D,children:[e.jsx("h2",{style:{marginTop:0,marginBottom:"1.5rem"},children:h?"Editar Empleado":"Nuevo Empleado"}),e.jsx(E,{placeholder:"Nombre del empleado",value:t.nombre,onChange:o=>m({...t,nombre:o.target.value}),required:!0}),e.jsx(E,{placeholder:"Teléfono (Opcional)",value:t.telefono,onChange:o=>m({...t,telefono:o.target.value})}),e.jsxs("div",{style:{display:"flex",gap:"1rem",marginTop:"1rem"},children:[e.jsx(l,{type:"button",onClick:()=>i(!1),style:{background:"#eee",color:"#333",flex:1,justifyContent:"center"},children:"Cancelar"}),e.jsx(l,{type:"submit",style:{background:"#007bff",color:"white",flex:1,justifyContent:"center"},children:"Guardar"})]})]})})})]})};export{Y as default};

import{r as a,j as e,A as q,a as b,s as o,m as J,V as te}from"./vendor-Bq1Leo8N.js";import{A as j}from"./index-D7TF7e-p.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-D5JPV6N2.js";const ae=({closed:n})=>e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:n?e.jsxs(e.Fragment,{children:[e.jsx("path",{d:"M9.88 9.88a3 3 0 1 0 4.24 4.24"}),e.jsx("path",{d:"M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"}),e.jsx("path",{d:"M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"}),e.jsx("line",{x1:"2",y1:"2",x2:"22",y2:"22"})]}):e.jsxs(e.Fragment,{children:[e.jsx("path",{d:"M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"}),e.jsx("circle",{cx:"12",cy:"12",r:"3"})]})}),ne=()=>e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"m15 18-6-6 6-6"})}),E=o.div`
  padding: 2rem 4rem;
  background-color: #f8f9fa;
  min-height: 100vh;

  // 💡 MOBILE: Ajustar padding
  @media (max-width: 768px) {
    padding: 1rem;
    min-height: 100dvh;
  }
`,ie=o.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  // 💡 MOBILE: Apilar en pantallas pequeñas
  @media (max-width: 500px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
`,se=o.h1`
  font-size: 2.5rem;
  color: #343a40;

  // 💡 MOBILE: Reducir tamaño de fuente
  @media (max-width: 768px) {
    font-size: 1.8rem;
    text-align: center;
  }
`,l=o.button`
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
`,de=o(te)`
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: #495057;
    font-weight: 600;
    margin-bottom: 2rem;
    &:hover {
        color: #007bff;
    }

    // 💡 MOBILE: Centrar y hacer el botón más visible
    @media (max-width: 768px) {
      margin-bottom: 1.5rem;
      font-size: 1rem;
      align-self: flex-start;
    }
`,le=o(l)`
  background-color: #28a745;
  color: white;
  &:hover { background-color: #218838; }

  // 💡 MOBILE: Ocupar todo el ancho cuando apilado
  @media (max-width: 500px) {
    width: 100%;
    justify-content: center;
  }
`,B=o(l)`
  background: none;
  border: 1px solid #ffc107;
  color: #ffc107;
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  &:hover { 
    background-color: #ffc107;
    color: #212529;
  }
`,y=o(l)`
  background: none;
  border: 1px solid #dc3545;
  color: #dc3545;
  padding: 0.5rem 1rem;
  &:hover { 
    background-color: #dc3545;
    color: white;
  }
`,ce=o.div`
  display: none; /* Oculto por defecto */

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`,me=o.div`
  background-color: white;
  padding: 1rem 1.2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border-left: 5px solid ${n=>n.$roleColor||"#007bff"};
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas: 
    "name role"
    "id id"
    "actions actions";
  gap: 0.5rem;
`,pe=o.p`
  margin: 0;
  font-size: 0.9rem;
  color: #6c757d;
  strong {
    color: #343a40;
    font-weight: 700;
  }
`,he=o.p`
  grid-area: name;
  font-size: 1.1rem;
  font-weight: 700;
  color: #343a40;
  margin: 0;
`,ue=o.span`
  grid-area: role;
  text-align: right;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${n=>n.$roleColor};
`,xe=o.div`
  grid-area: actions;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.8rem;

  ${B}, ${y} {
    padding: 0.6rem 0.8rem;
    font-size: 0.8rem;
    margin-right: 0;
  }
`,ge=o.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.07);
  border-radius: 12px;
  overflow: hidden;

  @media (max-width: 768px) {
    display: none; /* Ocultar la tabla en móvil */
  }
`,w=o.th`
  background-color: #343a40;
  color: white;
  padding: 1.2rem 1rem;
  text-align: left;
  font-weight: 600;
`,p=o.td`
  padding: 1.2rem 1rem;
  border-bottom: 1px solid #dee2e6;
  color: #495057;
`,T=o.tr`
    &:last-child ${p} {
        border-bottom: none;
    }
    &:hover {
        background-color: #f8f9fa;
    }
`,N=o.p`
  font-size: 1.2rem;
  color: #6c757d;
`,R=o(J.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`,F=o(J.form)`
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

  // 💡 MOBILE: Ocupar más espacio en pantalla y ajuste de padding
  @media (max-width: 500px) {
    width: 95%;
    padding: 1.5rem;
    margin: 1rem;
  }
`,W=o.h2`
  margin-top: 0;
  margin-bottom: 2rem;
  color: #343a40;
  text-align: center;

  @media (max-width: 500px) {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
`,M=o.input`
  width: 100%;
  padding: 0.8rem 1rem;
  margin-bottom: 1.2rem;
  border-radius: 8px;
  border: 1px solid #ced4da;
  font-size: 1rem;

  // 💡 MOBILE: Fuente ligeramente más grande para tacto
  @media (max-width: 768px) {
    padding: 0.9rem 1rem;
    font-size: 1.05rem;
  }
`,fe=o.select`
  width: 100%;
  padding: 0.8rem 1rem;
  margin-bottom: 1.2rem;
  border-radius: 8px;
  border: 1px solid #ced4da;
  font-size: 1rem;

  // 💡 MOBILE: Fuente ligeramente más grande para tacto
  @media (max-width: 768px) {
    padding: 0.9rem 1rem;
    font-size: 1.05rem;
  }
`,G=o.div`
  position: relative;
  width: 100%;
`,be=o.span`
  position: absolute;
  right: 15px;
  top: 15px;
  cursor: pointer;
  user-select: none;
  color: #adb5bd;

  // 💡 MOBILE: Ajustar posición
  @media (max-width: 768px) {
    top: 17px;
    right: 18px;
  }
`,H=o.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;

  // 💡 MOBILE: Ocupar todo el ancho en móvil
  @media (max-width: 500px) {
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 1.5rem;

    ${l} {
      width: 100%;
      justify-content: center;
    }
  }
`,je=o(l)`
  background-color: #007bff;
  color: white;
  &:hover { background-color: #0069d9; }
`,Z=o(l)`
  background-color: #f8f9fa;
  color: #6c757d;
  border: 1px solid #ced4da;
  &:hover { background-color: #e2e6ea; }
`,we=o.p`
  color: #dc3545;
  font-size: 0.9rem;
  text-align: center;
  margin-top: -0.5rem;
  margin-bottom: 1rem;
  min-height: 1.2rem;
`,Ee=()=>{const[n,I]=a.useState([]),[K,z]=a.useState(!0),[O,k]=a.useState(null),[Q,c]=a.useState(!1),[i,S]=a.useState(null),[t,v]=a.useState({nombre_usuario:"",password:"",confirmPassword:"",rol:"Vendedor"}),[h,C]=a.useState(!1),[X,m]=a.useState(""),[Y,u]=a.useState(!1),[s,_]=a.useState(null),A=async()=>{try{z(!0),k(null);const g={headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}},{data:d}=await b.get(`${j}/users`,g);I(d)}catch{k("Error al cargar los usuarios.")}finally{z(!1)}};a.useEffect(()=>{A()},[]);const $=r=>{switch(r){case"Administrador":return"#dc3545";case"Contador":return"#ffc107";case"Vendedor":return"#007bff";default:return"#6c757d"}},x=r=>{v({...t,[r.target.name]:r.target.value})},ee=()=>{S(null),v({nombre_usuario:"",password:"",confirmPassword:"",rol:"Vendedor"}),m(""),C(!1),c(!0)},L=r=>{S(r),v({nombre_usuario:r.nombre_usuario,password:"",confirmPassword:"",rol:r.rol}),m(""),C(!1),c(!0)},P=r=>{_(r),u(!0)},re=async()=>{if(s)try{const g={headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}};await b.delete(`${j}/users/${s.id_usuario}`,g),I(n.filter(d=>d.id_usuario!==s.id_usuario)),u(!1),_(null)}catch{k("Error al eliminar el usuario.")}},oe=async r=>{var D,V;if(r.preventDefault(),m(""),(!i||t.password)&&t.password!==t.confirmPassword){m("Las contraseñas no coinciden.");return}const d={headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}};try{if(i){const f={rol:t.rol};t.password&&(f.password=t.password),await b.put(`${j}/users/${i.id_usuario}`,f,d)}else await b.post(`${j}/auth/register`,{nombre_usuario:t.nombre_usuario,password:t.password,rol:t.rol},d);c(!1),A()}catch(f){m(((V=(D=f.response)==null?void 0:D.data)==null?void 0:V.msg)||"Error al guardar. Verifique los datos.")}},U={hidden:{opacity:0,y:-50,scale:.95},visible:{opacity:1,y:0,scale:1},exit:{opacity:0,y:50,scale:.95}};return K?e.jsx(E,{children:e.jsx(N,{children:"Cargando usuarios..."})}):O?e.jsx(E,{children:e.jsx(N,{style:{color:"red"},children:O})}):e.jsxs(E,{children:[e.jsxs(de,{to:"/dashboard",children:[e.jsx(ne,{})," Volver al Dashboard"]}),e.jsxs(ie,{children:[e.jsx(se,{children:"Gestión de Usuarios"}),e.jsxs(le,{onClick:ee,children:[e.jsx("span",{style:{fontSize:"1.2rem"},children:"+"})," Crear Nuevo Usuario"]})]}),e.jsxs(ge,{children:[e.jsx("thead",{children:e.jsxs(T,{children:[e.jsx(w,{children:"ID"}),e.jsx(w,{children:"Nombre de Usuario"}),e.jsx(w,{children:"Rol"}),e.jsx(w,{children:"Acciones"})]})}),e.jsx("tbody",{children:n.map(r=>e.jsxs(T,{children:[e.jsx(p,{children:r.id_usuario}),e.jsx(p,{children:r.nombre_usuario}),e.jsx(p,{children:r.rol}),e.jsxs(p,{children:[e.jsx(B,{onClick:()=>L(r),children:"✏️ Editar"}),e.jsx(y,{onClick:()=>P(r),children:"🗑️ Eliminar"})]})]},r.id_usuario))})]}),e.jsx(ce,{children:n.map(r=>e.jsxs(me,{$roleColor:$(r.rol),children:[e.jsx(he,{children:r.nombre_usuario}),e.jsx(ue,{$roleColor:$(r.rol),children:r.rol}),e.jsxs(pe,{style:{gridArea:"id"},children:["ID: ",e.jsx("strong",{children:r.id_usuario})]}),e.jsxs(xe,{children:[e.jsx(B,{onClick:()=>L(r),children:"✏️ Editar"}),e.jsx(y,{onClick:()=>P(r),children:"🗑️ Eliminar"})]})]},r.id_usuario))}),e.jsx(q,{children:Q&&e.jsx(R,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:()=>c(!1),children:e.jsxs(F,{variants:U,initial:"hidden",animate:"visible",exit:"exit",onSubmit:oe,onClick:r=>r.stopPropagation(),children:[e.jsx(W,{children:i?"Editar Usuario":"Crear Nuevo Usuario"}),e.jsx(we,{children:X}),e.jsx(M,{type:"text",name:"nombre_usuario",placeholder:"Nombre de usuario",value:t.nombre_usuario,onChange:x,disabled:!!i,required:!0}),e.jsxs(G,{children:[e.jsx(M,{type:h?"text":"password",name:"password",placeholder:i?"Nueva contraseña (opcional)":"Contraseña",value:t.password,onChange:x,required:!i}),e.jsx(be,{onClick:()=>C(!h),children:e.jsx(ae,{closed:!h})})]}),(!i||i&&t.password)&&e.jsx(G,{children:e.jsx(M,{type:h?"text":"password",name:"confirmPassword",placeholder:"Confirmar contraseña",value:t.confirmPassword,onChange:x,required:!0})}),e.jsxs(fe,{name:"rol",value:t.rol,onChange:x,children:[e.jsx("option",{value:"Vendedor",children:"Vendedor"}),e.jsx("option",{value:"Contador",children:"Contador"}),e.jsx("option",{value:"Administrador",children:"Administrador"})]}),e.jsxs(H,{children:[e.jsx(Z,{type:"button",onClick:()=>c(!1),children:"Cancelar"}),e.jsx(je,{type:"submit",children:"Guardar Cambios"})]})]})})}),e.jsx(q,{children:Y&&e.jsx(R,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:()=>u(!1),children:e.jsxs(F,{as:"div",variants:U,initial:"hidden",animate:"visible",exit:"exit",onClick:r=>r.stopPropagation(),children:[e.jsx(W,{children:"Confirmar Eliminación"}),e.jsxs("p",{children:["¿Estás seguro de que quieres eliminar al usuario ",e.jsx("strong",{children:s==null?void 0:s.nombre_usuario}),"? Esta acción no se puede deshacer."]}),e.jsxs(H,{children:[e.jsx(Z,{onClick:()=>u(!1),children:"Cancelar"}),e.jsx(y,{style:{backgroundColor:"#dc3545",color:"white"},onClick:re,children:"Sí, Eliminar"})]})]})})})]})};export{Ee as default};

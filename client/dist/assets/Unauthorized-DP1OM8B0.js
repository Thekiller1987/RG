import{c as i,j as o,s as e,t as a,W as c}from"./vendor-Bl8eSE-Q.js";import"./scanner-vendor-DfxRpMWJ.js";const d=()=>o.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"64",height:"64",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[o.jsx("rect",{x:"3",y:"11",width:"18",height:"11",rx:"2",ry:"2"}),o.jsx("path",{d:"M7 11V7a5 5 0 0 1 10 0v4"})]}),l=a`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`,p=e.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
  text-align: center;
  padding: 2rem;
`,x=e.div`
  animation: ${l} 0.5s ease-out;
  background-color: white;
  padding: 3rem 4rem;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  color: #dc3545;
`,g=e.h1`
  font-size: 2.5rem;
  margin-top: 1.5rem;
  color: #343a40;
`,h=e.p`
  font-size: 1.2rem;
  color: #6c757d;
  margin-top: 0.5rem;
  margin-bottom: 2rem;
`,m=e(c)`
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: #007bff;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`,b=()=>{var n;const{state:r}=i(),s=(r==null?void 0:r.role)||"Desconocido",t=((n=r==null?void 0:r.allowed)==null?void 0:n.join(", "))||"Desconocido";return o.jsx(p,{children:o.jsxs(x,{children:[o.jsx(d,{}),o.jsx(g,{children:"Acceso Denegado"}),o.jsx(h,{children:"No tienes los permisos suficientes para acceder a esta página."}),r&&o.jsx("div",{style:{background:"#f8d7da",padding:"10px",borderRadius:"8px",marginBottom:"1rem",border:"1px solid #f5c6cb"},children:o.jsxs("p",{style:{margin:0,fontSize:"0.9rem",color:"#721c24"},children:[o.jsx("strong",{children:"Depuración:"})," Tu rol es ",o.jsx("code",{children:s})," y la página requiere uno de ",o.jsxs("code",{children:["[",t,"]"]}),". Si esto es incorrecto, por favor presiona ",o.jsx("strong",{children:"Ctrl + F5"})," para recargar el sistema."]})}),o.jsx(m,{to:"/dashboard",children:"Volver al Dashboard"})]})})};export{b as default};

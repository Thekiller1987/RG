import{j as e,V as i,I as t,H as l,aH as d,M as c,s as r,T as n}from"./vendor-bjMGIQJ7.js";import"./scanner-vendor-DfxRpMWJ.js";const x=r.div`
    padding: 2rem;
    background-color: #f0f2f5;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
`,p=r.div`
    width: 100%;
    max-width: 1000px;
`,h=r.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3rem;
    width: 100%;
`,m=r.h1`
    color: #8b5cf6;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 15px;
    font-size: 2.5rem;
`,f=r.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
`,o=r(n)`
    background: white;
    padding: 2rem;
    border-radius: 16px;
    text-decoration: none;
    color: inherit;
    box-shadow: 0 10px 25px rgba(0,0,0,0.05);
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    border: 2px solid transparent;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 35px rgba(139, 92, 246, 0.15);
        border-color: #8b5cf6;
    }

    h2 { margin: 1rem 0 0.5rem; color: #1e293b; }
    p { color: #64748b; margin: 0; }
`,s=r.div`
    background: ${a=>a.bg||"#f3e8ff"};
    color: ${a=>a.color||"#8b5cf6"};
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
`,g=r(n)`
    display: flex;
    align-items: center;
    gap: 8px;
    color: #64748b;
    text-decoration: none;
    font-weight: 600;
    padding: 10px 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    transition: all 0.2s;

    &:hover { color: #1e293b; transform: translateX(-2px); }
`,u=()=>e.jsx(x,{children:e.jsxs(p,{children:[e.jsx(h,{children:e.jsxs(g,{to:"/dashboard",children:[e.jsx(i,{})," Volver al Dashboard"]})}),e.jsxs("div",{style:{textAlign:"center",marginBottom:"3rem"},children:[e.jsxs(m,{style:{justifyContent:"center"},children:[e.jsx(t,{})," Módulo Mayorista"]}),e.jsx("p",{style:{color:"#64748b",fontSize:"1.1rem",marginTop:"10px"},children:"Área exclusiva para gestión de ventas al por mayor."})]}),e.jsxs(f,{children:[e.jsxs(o,{to:"/wholesale-pos",children:[e.jsx(s,{bg:"#fff7ed",color:"#ea580c",children:e.jsx(l,{})}),e.jsx("h2",{children:"Punto de Venta"}),e.jsx("p",{children:"Facturación y pedidos mayoristas"})]}),e.jsxs(o,{to:"/admin/wholesale-promotions",children:[e.jsx(s,{bg:"#eff6ff",color:"#3b82f6",children:e.jsx(t,{})}),e.jsx("h2",{children:"Promociones"}),e.jsx("p",{children:"Gestionar precios y ofertas"})]}),e.jsxs(o,{to:"/detailed-sales-report?tab=mayorista",children:[e.jsx(s,{bg:"#f0fdf4",color:"#16a34a",children:e.jsx(d,{})}),e.jsx("h2",{children:"Reportes"}),e.jsx("p",{children:"Ventas y rendimiento mayorista"})]}),e.jsxs(o,{to:"/wholesale-catalog",children:[e.jsx(s,{bg:"#fefce8",color:"#ca8a04",children:e.jsx(c,{})}),e.jsx("h2",{children:"Catálogo de Productos"}),e.jsx("p",{children:"Consultar precios mayoristas"})]})]})]})});export{u as default};

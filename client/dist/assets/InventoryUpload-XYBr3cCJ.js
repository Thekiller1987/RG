import{u as B,r as u,j as e,Y as M,s,aJ as U,aK as L,aa as N,ab as O,t as C,aL as Y,v as H,n as R}from"./vendor-Bl8eSE-Q.js";import{I as W}from"./index-B613Eyqa.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-DV8V3V31.js";const Z=C`from { opacity: 0; } to { opacity: 1; }`,_=C`from { transform: rotate(0deg); } to { transform: rotate(360deg); }`,q=s.div`
    padding: 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    box-sizing: border-box;

    @media (max-width: 768px) {
        padding: 1rem;
    }
`,G=s.div`
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
    gap: 1rem;
    width: 100%;
    max-width: 800px;
`,J=s.button`
    padding: 0.75rem 1.5rem;
    border: none;
    background: rgba(255, 255, 255, 0.9);
    color: #667eea;
    border-radius: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;

    &:hover {
        background: white;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }
`,K=s.div`
    background: rgba(255, 255, 255, 0.95);
    padding: 2.5rem;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: ${Z} 0.5s ease-out forwards;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    position: relative;
    box-sizing: border-box;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
`,Q=s.label`
    border: 3px dashed ${r=>r.hasFile?"#10b981":r.isDragOver?"#667eea":"#d1d5db"};
    border-radius: 16px;
    padding: 3rem 2rem;
    width: 100%;
    cursor: pointer;
    transition: all 0.3s ease;
    background: ${r=>r.hasFile?"rgba(16, 185, 129, 0.05)":"rgba(255, 255, 255, 0.8)"};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    text-align: center;
    min-height: 200px;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        transition: left 0.5s;
    }

    &:hover::before {
        left: 100%;
    }

    &:hover {
        border-color: #667eea;
        transform: translateY(-2px);
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
`,X=s.input` 
    display: none; 
`,ee=s.code` 
    display: block; 
    padding: 1rem; 
    background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
    color: #e2e8f0;
    border-radius: 12px; 
    font-size: 0.9em; 
    margin-top: 1rem; 
    font-family: 'Fira Code', 'Consolas', monospace;
    width: 100%;
    overflow-x: auto;
    border: 1px solid #4a5568;
    line-height: 1.4;
`,S=s(H)` 
    animation: ${_} 1s linear infinite; 
`,re=s.div`
    width: 100%;
    max-height: 400px;
    overflow: auto;
    margin-top: 2rem;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    background: white;
`,te=s.table`
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
    background: white;

    th, td {
        padding: 12px 15px;
        text-align: left;
        border-bottom: 1px solid #f1f5f9;
        white-space: nowrap;
    }

    th {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        position: sticky;
        top: 0;
        z-index: 10;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-size: 0.75rem;
    }

    tr:hover {
        background-color: #f8fafc;
    }

    td {
        color: #475569;
    }
`,ae=s.button`
    padding: 1.25rem 3rem;
    border: none;
    border-radius: 12px;
    background: ${r=>r.success?"linear-gradient(135deg, #10b981 0%, #059669 100%)":r.error?"linear-gradient(135deg, #ef4444 0%, #dc2626 100%)":r.disabled?"linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)":"linear-gradient(135deg, #667eea 0%, #764ba2 100%)"};
    color: white;
    cursor: ${r=>r.disabled?"not-allowed":"pointer"};
    font-weight: 600;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    margin-top: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.5s;
    }

    &:hover:not(:disabled)::before {
        left: 100%;
    }

    &:hover:not(:disabled) {
        transform: translateY(-3px);
        box-shadow: 0 12px 35px rgba(0,0,0,0.2);
    }

    &:active:not(:disabled) {
        transform: translateY(-1px);
    }
`,oe=s.p`
    font-size: 1.1rem;
    font-weight: 500;
    color: ${r=>{switch(r.status){case"success":return"#10b981";case"error":return"#ef4444";case"uploading":return"#667eea";case"parsing":return"#f59e0b";default:return"#6b7280"}}};
    text-align: center;
    margin: 1rem 0;
    padding: 1rem;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.3);
`,ne=s(R)`
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;
    color: #ef4444;
    z-index: 100;
    background: rgba(239, 68, 68, 0.1);
    border-radius: 50%;
    padding: 5px;
    transition: all 0.3s ease;

    &:hover {
        background: rgba(239, 68, 68, 0.2);
        transform: scale(1.1);
    }
`,v=r=>{if(typeof r!="string"||!r)return 0;let i=r.replace(/[$,]/g,"").trim();i=i.replace(",",".");const l=parseFloat(i);return isNaN(l)?0:parseFloat(l.toFixed(2))},se=(r,i)=>{const l=[];for(let n=0;n<r.length;n+=i)l.push(r.slice(n,n+i));return l},ge=()=>{const r=B(),[i,l]=u.useState(null),[n,h]=u.useState([]),[x,j]=u.useState(!1),[b,d]=u.useState(null),[P,c]=u.useState("Sube un archivo CSV con tus productos."),y=localStorage.getItem("token"),[k,f]=u.useState(!1),F=()=>{r(-1)},I=()=>{l(null),h([]),d(null),c("Sube un archivo CSV con tus productos.")},$=o=>{o.preventDefault(),f(!0)},D=o=>{o.preventDefault(),f(!1)},z=o=>{o.preventDefault(),f(!1);const t=o.dataTransfer.files;t.length>0&&w(t[0])},w=o=>{if(!o||!o.name.endsWith(".csv")){c("Error: Por favor, selecciona un archivo CSV."),d("error"),l(null),h([]);return}l(o),d("parsing"),c(`Leyendo archivo: ${o.name}...`),Y.parse(o,{header:!0,skipEmptyLines:!0,dynamicTyping:!1,complete:function(t){if(t.errors.length){c(`Error de lectura en línea ${t.errors[0].row}. Verifica el formato.`),d("error");return}const p=t.data.map(a=>({codigo:String(a.Código||"").trim(),nombre:String(a.Producto||"").trim(),costo:v(a["P. Costo"]),precio:v(a["P. Venta"]),mayoreo:v(a["P. Mayoreo"]),existencia:parseInt(a.Existencia||0,10),departamento:String(a.Departamento||"N/A"),proveedor:String(a.Proveedor||"N/A"),minimo:parseInt(a["Inv. Mínimo"]||0,10),maximo:parseInt(a["Inv. Máximo"]||0,10),tipo_venta:String(a["Tipo de Venta"]||"UNIDAD")})).filter(a=>a.codigo&&a.nombre);p.length===0?(c("Error: No se encontraron productos válidos en el archivo."),d("error")):(h(p),d("ready"),c(`✅ Archivo listo: ${p.length} productos listos para subir.`))}})},E=o=>{const t=o.target.files[0];o.target.value=null,w(t)},T=async()=>{if(n.length===0||x||!y){c("Error: No estás autenticado o no hay datos para subir."),d("error");return}j(!0),d("uploading");const t=se(n,500);let p=0,a=0;try{for(let g=0;g<t.length;g++){const m=t[g];c(`🚚 Procesando lote ${g+1} de ${t.length} (${p} / ${n.length} productos)...`);const ie=await W(m,y);p+=m.length,a++}d("success"),c(`🎉 ¡Carga Exitosa! Se procesaron ${p} productos en ${t.length} lotes.`)}catch(g){console.error("Error en la carga masiva (API):",g),d("error");const m=g.message.includes("HTTP")?`Error de conexión en el Lote ${a+1}. Posible Timeout. Verifique el backend.`:g.message;c(`❌ Error de Carga. ${a>0?`Se guardaron ${a} lotes (${p} productos). `:""}Error: ${m}`)}finally{j(!1),l(null),h([])}},A=()=>{switch(b){case"parsing":case"uploading":return e.jsx(S,{size:"2em",color:"#3b82f6"});case"ready":case"success":return e.jsx(O,{size:"2em",color:"#28a745"});case"error":return e.jsx(N,{size:"2em",color:"#dc3545"});default:return e.jsx(L,{size:"3em",color:"#6c757d"})}},V=()=>{if(n.length===0)return null;const o=n.slice(0,5);return e.jsxs(re,{children:[e.jsxs("h4",{style:{padding:"1rem",margin:0,background:"#f8fafc",borderBottom:"1px solid #e5e7eb"},children:[e.jsx(U,{style:{marginRight:"0.5rem"}}),"Previsualización (",n.length," filas totales)"]}),e.jsxs(te,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Código"}),e.jsx("th",{children:"Producto"}),e.jsx("th",{children:"P. Costo"}),e.jsx("th",{children:"P. Venta"}),e.jsx("th",{children:"Exist."}),e.jsx("th",{children:"Depto."})]})}),e.jsx("tbody",{children:o.map((t,p)=>e.jsxs("tr",{children:[e.jsx("td",{children:t.codigo}),e.jsx("td",{children:t.nombre}),e.jsx("td",{children:t.costo.toFixed(2)}),e.jsx("td",{children:t.precio.toFixed(2)}),e.jsx("td",{children:t.existencia}),e.jsx("td",{children:t.departamento})]},p))})]}),n.length>5&&e.jsxs("p",{style:{textAlign:"center",margin:"1rem 0",color:"#6b7280",fontSize:"0.8em",padding:"0.5rem",background:"#f8fafc"},children:["... y ",n.length-5," filas más."]})]})};return e.jsxs(q,{children:[e.jsxs(G,{children:[e.jsxs(J,{onClick:F,children:[e.jsx(M,{})," Regresar"]}),e.jsx("h1",{style:{fontSize:"1.8rem",color:"white",margin:0,textShadow:"0 2px 4px rgba(0,0,0,0.1)"},children:"Carga Masiva de Inventario"})]}),e.jsxs(K,{children:[i&&e.jsx(ne,{size:20,onClick:I,"aria-label":"Limpiar archivo"}),e.jsxs(Q,{htmlFor:"file-upload",hasFile:!!i,isDragOver:k,onDragOver:$,onDragLeave:D,onDrop:z,children:[A(),e.jsx("h3",{style:{margin:0,fontWeight:600,color:k?"#667eea":"#374151"},children:i?i.name:"Arrastra o haz clic para subir el archivo CSV"}),e.jsx("p",{style:{margin:0,fontSize:"0.9em",color:"#6b7280"},children:"Máximo 10,000 filas por carga."}),e.jsx(X,{id:"file-upload",type:"file",accept:".csv",onChange:E,disabled:x})]}),e.jsx(oe,{status:b,children:P}),V(),e.jsx(ae,{onClick:T,disabled:n.length===0||x,success:b==="success",error:b==="error",children:x?e.jsxs(e.Fragment,{children:[e.jsx(S,{}),"Procesando..."]}):`Subir ${n.length} Productos`}),e.jsx("h4",{style:{marginTop:"2rem",marginBottom:"0.5rem",color:"#374151",textAlign:"center"},children:"Formato Requerido del CSV"}),e.jsx(ee,{children:"Código, Producto, P. Costo, P. Venta, P. Mayoreo, Existencia, Departamento, Proveedor, Inv. Mínimo, Inv. Máximo, Tipo de Venta"})]})]})};export{ge as default};

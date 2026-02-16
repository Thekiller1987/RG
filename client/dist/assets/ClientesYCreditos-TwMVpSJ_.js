import{r as a,j as e,n as V,D as G,s as n,af as J,a9 as Y,J as M,K as R,ag as A,v as Z,S as q,X as K,ah as X,W as Q,a5 as O,Y as I,ai as P,V as F,U as ee}from"./vendor-BMIwBeBI.js";import{e as te,h as re,u as U,i as ne,j as se,k as oe,m as ie,n as ae}from"./index-C7JoirjO.js";import{T as W,A as le,S as de}from"./SalesHistoryModal--5quYzhC.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-qNamXCRA.js";import"./POS.styles-CI0-ztUL.js";import"./AlertModal-D3Gk2GaP.js";const ce=n.div`
  position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;z-index:50;
`,me=n.div`
  background:white;padding:2rem;border-radius:8px;width:400px;max-width:90%;
`,xe=n.div`display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;`,he=n.h2`margin:0;font-size:1.5rem;`,pe=n.button`border:none;background:none;color:#dc3545;font-size:1.2rem;cursor:pointer;`,ue=n.form`display:flex;flex-direction:column;gap:0.8rem;`,_=n.input`padding:0.6rem;border:1px solid #ccc;border-radius:6px;font-size:0.95rem;`,fe=n.button`
  padding:0.6rem 1rem;background:#007bff;color:white;border:none;border-radius:6px;font-weight:bold;display:flex;align-items:center;gap:0.5rem;justify-content:center;
  &:hover{opacity:0.85;}
`;function ge({client:r,onClose:v,onSave:h}){const[w,p]=a.useState(""),[m,j]=a.useState(""),[i,y]=a.useState(""),[u,g]=a.useState(""),C=localStorage.getItem("token");a.useEffect(()=>{r?(p(r.nombre||""),j(r.cedula||""),y(r.telefono||""),g(r.limite_credito||"")):(p(""),j(""),y(""),g(""))},[r]);const N=async s=>{s.preventDefault();const d={nombre:w,cedula:m,telefono:i,limite_credito:u===""?null:Number(u)};try{r?await te(r.id_cliente,d,C):await re(d,C),h&&h(),v()}catch(k){console.error(k),alert(`Error al guardar cliente: ${k.message}`)}};return e.jsx(ce,{children:e.jsxs(me,{children:[e.jsxs(xe,{children:[e.jsx(he,{children:r?"Editar Cliente":"Nuevo Cliente"}),e.jsx(pe,{onClick:v,children:e.jsx(V,{})})]}),e.jsxs(ue,{onSubmit:N,children:[e.jsx(_,{value:w,onChange:s=>p(s.target.value),placeholder:"Nombre",required:!0}),e.jsx(_,{value:m,onChange:s=>j(s.target.value),placeholder:"Cédula / RUC"}),e.jsx(_,{value:i,onChange:s=>y(s.target.value),placeholder:"Teléfono"}),e.jsx(_,{type:"number",step:"0.01",value:u,onChange:s=>g(s.target.value),placeholder:"Límite de crédito"}),e.jsxs(fe,{type:"submit",children:[e.jsx(G,{})," Guardar"]})]})]})})}const be=n.div`position: fixed; inset: 0; background-color: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 1000; padding: 1rem;`,je=n.div`background: #f4f7f6; color: #333; border-radius: 10px; width: 900px; max-width: 100%; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 10px 25px rgba(0,0,0,0.1);`,ye=n.div`padding: 1rem 1.5rem; border-bottom: 1px solid #dee2e6; display: flex; justify-content: space-between; align-items: center;`,Ce=n.h2`margin: 0; font-size: 1.5rem;`,ve=n.button`background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #888; &:hover{color:#333;}`,we=n.div`padding: 1.5rem; overflow-y: auto;`,ke=n.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;`,z=n.div`
  background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  border-left: 5px solid ${r=>r.color||"#ccc"};
  h3 { margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666; text-transform: uppercase; }
  p { margin: 0; font-size: 1.75rem; font-weight: bold; color: ${r=>r.color||"#333"}; }
`,$e=n(Z)`animation: spin 1s linear infinite; @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`,E=n.div`text-align: center; padding: 2rem; color: #6c757d;`,Se=n.div`
  background: white; border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem;
  border: 1px solid #e9ecef; box-shadow: 0 2px 4px rgba(0,0,0,0.04);
  border-left: 5px solid ${r=>r.$estado==="PAGADO"?"#28a745":r.$estado==="DEVUELTO"?"#ffc107":"#dc3545"};
`,Ne=n.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;
  .ticket-title { font-weight: 700; font-size: 1.1rem; color: #0056b3; }
  .ticket-date { font-size: 0.85rem; color: #6c757d; }
`,Te=n.div`
  width: 100%; height: 8px; background: #e9ecef; border-radius: 4px; overflow: hidden; margin: 0.5rem 0;
  .fill { height: 100%; background: ${r=>r.$pct>=100?"#28a745":"#007bff"}; border-radius: 4px; transition: width 0.3s; }
`,Ae=n.div`
  display: flex; gap: 1.5rem; flex-wrap: wrap; font-size: 0.9rem; color: #495057;
  .stat { display: flex; flex-direction: column; }
  .stat-label { font-size: 0.75rem; color: #6c757d; text-transform: uppercase; font-weight: 600; }
  .stat-value { font-weight: 700; font-size: 1.1rem; }
`,_e=n.span`
  font-size: 0.75rem; font-weight: 700; padding: 3px 10px; border-radius: 12px;
  background: ${r=>r.$type==="PAGADO"?"#d4edda":r.$type==="DEVUELTO"?"#fff3cd":"#f8d7da"};
  color: ${r=>r.$type==="PAGADO"?"#155724":r.$type==="DEVUELTO"?"#856404":"#721c24"};
`,ze=n.div`padding: 0; margin: 0.75rem 0 0;`,De=n.div`
  display: flex; gap: 0.75rem; padding: 0.5rem 0; border-bottom: 1px solid #f1f5f9;
  &:last-child { border-bottom: none; }
  .icon { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0;
    background: ${r=>r.$type==="credito"?"#dc3545":"#28a745"}; font-size: 0.8rem; }
  .content { flex: 1; }
  .amount { font-weight: 700; color: ${r=>r.$type==="credito"?"#dc3545":"#28a745"}; }
  .meta { font-size: 0.8rem; color: #6c757d; }
`,S=r=>`C$${Number(r||0).toFixed(2)}`,Fe=r=>r?new Date(r).toLocaleDateString("es-NI",{timeZone:"America/Managua",day:"2-digit",month:"2-digit",year:"numeric"}):"—",Ee=r=>r?new Date(r).toLocaleString("es-NI",{timeZone:"America/Managua",day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:!0}):"—";function Me({client:r,onClose:v,token:h}){const[w,p]=a.useState(!0),[m,j]=a.useState([]),[i,y]=a.useState([]),[u,g]=a.useState(null),{allUsers:C}=U(),[N,s]=a.useState(!1),[d,k]=a.useState(null),T=a.useCallback(async()=>{if(r){p(!0),g(null);try{const[t,l,f]=await Promise.all([ne(r.id_cliente,h),se(r.id_cliente,h),oe(r.id_cliente,h)]);j(Array.isArray(t)?t:[]);const D=(l||[]).map(o=>{let $=o.pagoDetalles||{};if(typeof $=="string")try{$=JSON.parse($)}catch{$={}}return{id:`c-${o.id_venta}`,fecha:new Date(o.fecha),tipo:"credito",descripcion:`Compra a crédito (Venta #${o.id_venta})`,monto:Number($.credito||o.total||0),userId:o.id_usuario,idVenta:o.id_venta}}),c=(f||[]).map(o=>({id:`a-${o.id_abono}`,fecha:new Date(o.fecha),tipo:"abono",descripcion:"Abono registrado",monto:Number(o.monto),userId:o.id_usuario||o.usuario}));y([...D,...c].sort((o,$)=>$.fecha-o.fecha))}catch(t){console.error("Error cargando historial:",t),g("No se pudo cargar el historial del cliente.")}finally{p(!1)}}},[r,h]);a.useEffect(()=>{T()},[T]);const b=a.useMemo(()=>{const t=i.filter(c=>c.tipo==="credito").reduce((c,o)=>c+o.monto,0),l=i.filter(c=>c.tipo==="abono").reduce((c,o)=>c+o.monto,0),f=m.filter(c=>c.saldoRestante>0).length,D=m.filter(c=>c.saldoRestante<=0).length;return{totalCredito:t,totalAbono:l,ticketsPendientes:f,ticketsPagados:D}},[i,m]);return r?e.jsxs(be,{onClick:v,children:[e.jsxs(je,{onClick:t=>t.stopPropagation(),children:[e.jsxs(ye,{children:[e.jsxs(Ce,{children:["Historial de ",r.nombre]}),e.jsx(ve,{onClick:v,children:e.jsx(V,{})})]}),e.jsxs(we,{children:[w&&e.jsxs(E,{children:[e.jsx($e,{size:30})," ",e.jsx("p",{children:"Cargando..."})]}),u&&e.jsx(E,{style:{color:"red"},children:u}),!w&&!u&&e.jsxs(e.Fragment,{children:[e.jsxs(ke,{children:[e.jsxs(z,{color:"#dc3545",children:[e.jsx("h3",{children:"Total Crédito"}),e.jsx("p",{children:S(b.totalCredito)})]}),e.jsxs(z,{color:"#28a745",children:[e.jsx("h3",{children:"Total Abonado"}),e.jsx("p",{children:S(b.totalAbono)})]}),e.jsxs(z,{color:"#007bff",children:[e.jsx("h3",{children:"Saldo Actual"}),e.jsx("p",{children:S(r.saldo_pendiente)})]}),e.jsxs(z,{color:b.ticketsPendientes>0?"#ffc107":"#28a745",children:[e.jsx("h3",{children:"Facturas"}),e.jsx("p",{style:{fontSize:"1.2rem"},children:b.ticketsPendientes>0?e.jsxs(e.Fragment,{children:[e.jsx(J,{style:{color:"#ffc107"}})," ",b.ticketsPendientes," pendiente",b.ticketsPendientes>1?"s":""]}):e.jsxs(e.Fragment,{children:[e.jsx(Y,{style:{color:"#28a745"}})," Todo pagado"]})})]})]}),m.length>0&&e.jsxs(e.Fragment,{children:[e.jsxs("h3",{style:{margin:"0 0 1rem",color:"#333",display:"flex",alignItems:"center",gap:"0.5rem"},children:[e.jsx(M,{})," Desglose por Factura"]}),m.map(t=>{const l=t.montoOriginal-t.saldoRestante,f=t.montoOriginal>0?l/t.montoOriginal*100:0;return e.jsxs(Se,{$estado:t.estado,children:[e.jsxs(Ne,{children:[e.jsxs("div",{children:[e.jsxs("span",{className:"ticket-title",children:["Venta #",t.idVenta]}),e.jsx(_e,{$type:t.estado,style:{marginLeft:"0.75rem"},children:t.estado})]}),e.jsx("span",{className:"ticket-date",children:Fe(t.fecha)})]}),e.jsx(Te,{$pct:f,children:e.jsx("div",{className:"fill",style:{width:`${Math.min(100,f)}%`}})}),e.jsxs(Ae,{children:[e.jsxs("div",{className:"stat",children:[e.jsx("span",{className:"stat-label",children:"Monto Original"}),e.jsx("span",{className:"stat-value",children:S(t.montoOriginal)})]}),e.jsxs("div",{className:"stat",children:[e.jsx("span",{className:"stat-label",children:"Pagado"}),e.jsx("span",{className:"stat-value",style:{color:"#28a745"},children:S(l)})]}),e.jsxs("div",{className:"stat",children:[e.jsx("span",{className:"stat-label",children:"Pendiente"}),e.jsx("span",{className:"stat-value",style:{color:t.saldoRestante>0?"#dc3545":"#28a745"},children:S(t.saldoRestante)})]}),e.jsxs("div",{className:"stat",children:[e.jsx("span",{className:"stat-label",children:"Progreso"}),e.jsxs("span",{className:"stat-value",children:[Math.round(f),"%"]})]})]})]},t.idVenta)})]}),e.jsx("h3",{style:{margin:"1.5rem 0 0.75rem",color:"#333"},children:"Historial Completo"}),e.jsx(ze,{children:i.length>0?i.map(t=>{const l=C.find(f=>(f.id_usuario??f.id)===t.userId);return e.jsxs(De,{$type:t.tipo,children:[e.jsx("div",{className:"icon",children:t.tipo==="credito"?e.jsx(R,{}):e.jsx(A,{})}),e.jsxs("div",{className:"content",children:[e.jsx("span",{className:"amount",children:S(t.monto)}),e.jsx("p",{style:{margin:"2px 0"},children:t.descripcion}),e.jsxs("span",{className:"meta",children:[Ee(t.fecha)," por ",e.jsx("strong",{children:(l==null?void 0:l.nombre_usuario)||"Sistema"})]})]})]},t.id)}):e.jsxs(E,{children:[e.jsx(M,{size:40}),e.jsx("p",{children:"No hay movimientos para mostrar."})]})})]})]})]}),N&&d&&e.jsx(W,{transaction:{estado:"ABONO_CREDITO",totalVenta:d.monto,fecha:d.fecha,id:d.id.split("-")[1],clientId:r.id_cliente,userId:d.userId},creditStatus:{remainingBalance:Number(r.saldo_pendiente||0)},clients:[r],users:C,onClose:()=>s(!1)})]}):null}const B=n.div`
    padding: 2rem 4rem;
    background: #f8f9fa;
    min-height: 100vh;
    @media(max-width: 992px) {
        padding: 1rem;
    }
`,Oe=n.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    border-bottom: 2px solid #e9ecef;
    padding-bottom: 1rem;
    flex-wrap: wrap;
    gap: 1rem;
`,Ie=n.h1`
    font-size: 2.5rem;
    color: #343a40;
    display: flex;
    align-items: center;
    gap: 1rem;
    @media(max-width: 992px) {
        font-size: 1.8rem;
    }
`,L=n.div`
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
`,x=n.button`
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    color: white;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.9rem;
    background: ${r=>r.primary?"#007bff":r.$delete?"#dc3545":r.$abono?"#17a2b8":(r.$refresh,"#6c757d")};
    &:hover:not(:disabled) {
        opacity: 0.85;
    }
    &:disabled {
        background: #adb5bd;
        cursor: not-allowed;
    }
`,Pe=n(ee)`
    padding: 0.7rem 1.3rem;
    background-color: #6c757d;
    color: white;
    border-radius: 8px;
    font-weight: bold;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    &:hover {
        background-color: #5a6268;
    }
`,Be=n.table`
    width: 100%;
    border-collapse: collapse;
    background: white;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    border-radius: 8px;
    overflow: hidden;
    @media(max-width: 992px) {
        display: none;
    }
    th, td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid #dee2e6;
        vertical-align: middle;
    }
    th {
        background: #f8f9fa;
        color: #495057;
        font-weight: 600;
        text-transform: uppercase;
        font-size: 0.8rem;
    }
`,Le=n.div`
    display: none;
    flex-direction: column;
    gap: 1rem;
    @media(max-width: 992px) {
        display: flex;
    }
`,He=n.div`
    background: white;
    border-radius: 12px;
    padding: 1.25rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    border: 1px solid #e9ecef;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
`,Ve=n.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 1px solid #f1f3f5;
    padding-bottom: 0.75rem;
    margin-bottom: 0.25rem;
`,Re=n.h3`
    font-size: 1.1rem;
    margin: 0;
    color: #343a40;
    font-weight: 700;
`,Ue=n.span`
    font-size: 0.85rem;
    color: #868e96;
    display: block;
    margin-top: 4px;
`,We=n.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
`,H=n.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
    span.label { font-size: 0.75rem; color: #adb5bd; text-transform: uppercase; font-weight: 600; }
    span.value { font-size: 1rem; font-weight: 600; color: #495057; }
    span.balance { font-size: 1.1rem; font-weight: 700; color: ${r=>r.isDebt?"#dc3545":"#28a745"}; }
`,Ge=n.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    margin-top: 0.5rem;
    padding-top: 1rem;
    border-top: 1px dashed #e9ecef;

    button {
        justify-content: center;
        width: 100%;
        font-size: 0.85rem;
    }
`;function et(){var b;const{clients:r,user:v,token:h,isLoading:w,refreshClients:p,cajaSession:m,allUsers:j}=U(),[i,y]=a.useState({name:null,data:null}),[u,g]=a.useState(null),C=a.useMemo(()=>m&&!m.closedAt,[m]),N=async t=>{if(t.saldo_pendiente>0){F.error("El cliente tiene saldo pendiente.");return}if(window.confirm("¿Seguro de eliminar este cliente?"))try{await ae(t.id_cliente,h),F.success("Cliente eliminado correctamente."),p()}catch(l){F.error(l.message||"Error al eliminar cliente.")}},s=(t,l=null)=>y({name:t,data:l}),d=()=>y({name:null,data:null}),k=t=>`C$${Number(t||0).toFixed(2)}`,T=t=>t===null?"∞":k(t);return w?e.jsx(B,{children:e.jsx("h1",{children:"Cargando..."})}):e.jsxs(B,{children:[e.jsxs(Oe,{children:[e.jsxs(Ie,{children:[e.jsx(q,{})," Clientes y Créditos"]}),e.jsxs(L,{children:[e.jsxs(x,{primary:!0,onClick:()=>s("client"),children:[e.jsx(K,{})," Crear Cliente"]}),e.jsxs(x,{$refresh:!0,onClick:p,children:[e.jsx(X,{})," Recargar"]}),e.jsxs(Pe,{to:"/dashboard",children:[e.jsx(Q,{})," Volver"]})]})]}),e.jsxs(Be,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"ID"}),e.jsx("th",{children:"Nombre"}),e.jsx("th",{children:"Teléfono"}),e.jsx("th",{children:"Límite"}),e.jsxs("th",{children:[e.jsx(R,{})," Saldo"]}),e.jsx("th",{children:"Acciones"})]})}),e.jsx("tbody",{children:r.map(t=>e.jsxs("tr",{children:[e.jsx("td",{children:t.id_cliente}),e.jsx("td",{children:t.nombre}),e.jsx("td",{children:t.telefono||"N/A"}),e.jsx("td",{children:T(t.limite_credito)}),e.jsx("td",{style:{fontWeight:"bold",color:t.saldo_pendiente>0?"#dc3545":"#28a745"},children:k(t.saldo_pendiente)}),e.jsx("td",{children:e.jsxs(L,{children:[e.jsx(x,{$abono:!0,disabled:!C||t.saldo_pendiente<=0,onClick:()=>s("abono",t),title:"Realizar Abono",children:e.jsx(A,{})}),e.jsx(x,{onClick:()=>s("client",t),title:"Editar Cliente",children:e.jsx(O,{})}),e.jsx(x,{primary:!0,onClick:()=>s("historial",t),title:"Ver Historial",children:e.jsx(I,{})}),e.jsx(x,{$refresh:!0,style:{background:"#6f42c1"},onClick:()=>s("tickets",t),title:"Ver Tickets",children:e.jsx(A,{})}),e.jsx(x,{$delete:!0,onClick:()=>N(t),title:"Eliminar Cliente",children:e.jsx(P,{})})]})})]},t.id_cliente))})]}),e.jsx(Le,{children:r.map(t=>e.jsxs(He,{children:[e.jsxs(Ve,{children:[e.jsxs("div",{children:[e.jsx(Re,{children:t.nombre}),e.jsxs(Ue,{children:["ID: ",t.id_cliente," • ",t.telefono||"Sin Teléfono"]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"flex-end"},children:[e.jsx("span",{style:{fontSize:"0.75rem",color:"#adb5bd",fontWeight:"600"},children:"SALDO"}),e.jsx("span",{style:{fontSize:"1.2rem",fontWeight:"bold",color:t.saldo_pendiente>0?"#dc3545":"#28a745"},children:k(t.saldo_pendiente)})]})]}),e.jsxs(We,{children:[e.jsxs(H,{children:[e.jsx("span",{className:"label",children:"Límite Crédito"}),e.jsx("span",{className:"value",children:T(t.limite_credito)})]}),e.jsxs(H,{children:[e.jsx("span",{className:"label",children:"Estado"}),e.jsx("span",{className:"value",style:{color:t.saldo_pendiente>0?"#e03131":"#2f9e44"},children:t.saldo_pendiente>0?"Con Deuda":"Al Día"})]})]}),e.jsxs(Ge,{children:[e.jsxs(x,{$abono:!0,disabled:!C||t.saldo_pendiente<=0,onClick:()=>s("abono",t),children:[e.jsx(A,{})," Abonar"]}),e.jsxs(x,{onClick:()=>s("client",t),children:[e.jsx(O,{})," Editar"]}),e.jsxs(x,{primary:!0,onClick:()=>s("historial",t),children:[e.jsx(I,{})," Historial"]}),e.jsxs(x,{$refresh:!0,style:{background:"#6f42c1"},onClick:()=>s("tickets",t),children:[e.jsx(A,{})," Tickets"]}),e.jsxs(x,{$delete:!0,style:{gridColumn:"span 2"},onClick:()=>N(t),children:[e.jsx(P,{})," Eliminar Cliente"]})]})]},t.id_cliente))}),i.name==="client"&&e.jsx(ge,{client:i.data,onClose:d,onSave:p}),i.name==="abono"&&e.jsx(le,{client:i.data,onClose:d,onAbonoSuccess:p,showAlert}),i.name==="historial"&&e.jsx(Me,{client:i.data,onClose:d,token:h}),i.name==="tickets"&&e.jsx(de,{onClose:d,initialClientId:(b=i.data)==null?void 0:b.id_cliente,clients:r,users:j,loadSales:async t=>{try{return await ie(h,t)}catch(l){return console.error(l),[]}},onReprintTicket:t=>{g(t)}}),u&&e.jsx(W,{isOpen:!0,transaction:u,onClose:()=>g(null),clients:r,users:j,currentUser:v})]})}export{et as default};

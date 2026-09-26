import{W as kt,r as i,j as e,A as te,X as Me,Y as eo,Z as to,$ as tt,a0 as oo,k as Ge,a1 as ct,a2 as dt,a3 as $t,a4 as Nt,a5 as ro,H as nt,a6 as Mt,a7 as ao,a8 as no,a9 as jt,aa as St,ab as Bt,ac as ot,ad as ne,s as y,m as ke,a as X,ae as io,M as so,P as lo,af as Ut,ag as co,ah as po,ai as xo,aj as mo,t as uo,ak as go,al as At,R as Be,v as fo,V as ho}from"./vendor-C6IkOdzt.js";import{u as bo,A as ee,g as it,f as Pt,s as st,d as yo}from"./index-4eRQBJWv.js";import{r as jo}from"./searchEngine-BMYcElFi.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-CINaEeII.js";const It=["0000ff00-0000-1000-8000-00805f9b34fb","0000ffe0-0000-1000-8000-00805f9b34fb","49535343-fe7d-4ae5-8fa9-9fafd205e455","e7810a71-73ae-499d-8c15-faa9aef0c3f2","000018f0-0000-1000-8000-00805f9b34fb","0000fee7-0000-1000-8000-00805f9b34fb","0000ae30-0000-1000-8000-00805f9b34fb"];function Vt(){return typeof navigator<"u"&&!!navigator.bluetooth}async function Rt(o=null){if(!Vt())throw new Error("Tu navegador no soporta Bluetooth Web. Usa Google Chrome o Microsoft Edge en tu PC.");try{const s=await navigator.bluetooth.requestDevice({acceptAllDevices:!0,optionalServices:It});o&&s.addEventListener("gattserverdisconnected",o);const f=await s.gatt.connect();let u=null;const m=d=>{let l=d.find(n=>(n.uuid.includes("ff02")||n.uuid.includes("ffe1"))&&(n.properties.write||n.properties.writeWithoutResponse));return l||(l=d.find(n=>n.properties.write)),l||(l=d.find(n=>n.properties.writeWithoutResponse)),l};for(const d of It)try{const n=await(await f.getPrimaryService(d)).getCharacteristics(),g=m(n);if(g){u=g;break}}catch{}if(!u)try{const d=await f.getPrimaryServices();for(const l of d){const n=await l.getCharacteristics(),g=m(n);if(g){u=g;break}}}catch(d){console.warn("Error al explorar servicios adicionales:",d)}if(!u)throw new Error(`Se conectó a "${s.name||"Dispositivo"}", pero no se encontró un canal de escritura de impresión compatible.`);return{device:s,server:f,characteristic:u,name:s.name||"Impresora Phomemo"}}catch(s){throw s.name==="NotFoundError"?new Error("Búsqueda cancelada: no se seleccionó ninguna impresora."):s}}function vo(o){o&&o.gatt&&o.gatt.connected&&o.gatt.disconnect()}async function wo(o,s){if(o.properties.write){if(typeof o.writeValueWithResponse=="function")try{await o.writeValueWithResponse(s);return}catch{}if(typeof o.writeValue=="function")try{await o.writeValue(s);return}catch{}}if(o.properties.writeWithoutResponse&&typeof o.writeValueWithoutResponse=="function"){await o.writeValueWithoutResponse(s);return}if(typeof o.writeValue=="function")await o.writeValue(s);else if(typeof o.writeValueWithoutResponse=="function")await o.writeValueWithoutResponse(s);else throw new Error("La característica Bluetooth no tiene permisos de escritura.")}async function Co(o,s,f=null){const m=s.length;let d=0;const n=o.properties.write?18:32;for(;d<m;){const g=s.slice(d,d+128);await wo(o,g),d+=128,f&&f(Math.min(100,Math.round(d/m*100))),await new Promise(h=>setTimeout(h,n))}}function ko(o,s,f,u,m,d,l=2){const n=s.split(" ");let g="";const h=[];for(let r=0;r<n.length;r++){const p=g+n[r]+" ";if(o.measureText(p).width>m&&r>0){if(h.push(g.trim()),g=n[r]+" ",h.length>=l)break}else g=p}if(g.trim()&&h.length<l&&h.push(g.trim()),h.length===l){let r=h[l-1];for(;o.measureText(r+"...").width>m&&r.length>0;)r=r.slice(0,-1);h[l-1]=r.trim()+"..."}return h.forEach((r,p)=>{o.fillText(r,f,u+p*d)}),h.length*d}function So(o,s={}){var v;const{showCompany:f=!0,showPrice:u=!0,showCategory:m=!1,codeType:d="barcode",storeName:l="MULTIREPUESTOS RG"}=s,n=384,g=200,h=document.createElement("canvas");h.width=n,h.height=g;const r=h.getContext("2d",{willReadFrequently:!0});r.fillStyle="#ffffff",r.fillRect(0,0,n,g),r.fillStyle="#000000",r.textAlign="center",r.textBaseline="top";let p=6;f?(r.font="bold 13px system-ui, -apple-system, sans-serif",r.letterSpacing="1px",r.fillText(l,n/2,p),p+=16):p+=4,r.font="bold 15px system-ui, -apple-system, sans-serif";const S=o.nombre||"Repuesto",F=ko(r,S,n/2,p,n-20,17,2);p+=F+4;const z=String(o.codigo_barras||o.codigo||"000000");if(d==="barcode"||d==="hybrid")try{const k=document.createElement("canvas");kt(k,z,{format:"CODE128",width:1.6,height:44,displayValue:!1,margin:0,background:"#ffffff",lineColor:"#000000"});const x=k.width,j=Math.min(x,n-24),P=(n-j)/2;r.drawImage(k,P,p,j,44),p+=47}catch(k){console.warn("Error dibujando código de barras en canvas:",k),p+=44}else p+=40;if(r.strokeStyle="#000000",r.lineWidth=1,r.beginPath(),r.moveTo(8,p),r.lineTo(n-8,p),r.stroke(),p+=4,r.textBaseline="middle",r.textAlign="left",r.font="bold 13px monospace, Courier",r.fillText(z,10,p+10),m&&o.categoria_nombre&&(r.font="normal 10px system-ui, sans-serif",r.fillText(String(o.categoria_nombre).slice(0,16),10,p+22)),u){const k=o.precio_venta??o.venta??o.precio??((v=o.__fmt)==null?void 0:v.venta)??0,x=typeof k=="string"&&k.includes("C$")?parseFloat(k.replace(/[^0-9.]/g,"")):parseFloat(k),j=!isNaN(x)&&x>0?`C$ ${x.toFixed(2)}`:"";j&&(r.textAlign="right",r.font="bold 18px system-ui, -apple-system, sans-serif",r.fillText(j,n-10,p+10))}return h}function No(o){const s=o.getContext("2d"),f=o.width,u=o.height,d=s.getImageData(0,0,f,u).data,l=Math.ceil(f/8),n=new Uint8Array(l*u);let g=0;for(let h=0;h<u;h++)for(let r=0;r<l;r++){let p=0;for(let S=0;S<8;S++){const F=r*8+S;if(F<f){const z=(h*f+F)*4,v=d[z],k=d[z+1],x=d[z+2],j=d[z+3],P=.299*v+.587*k+.114*x;j>128&&P<165&&(p|=1<<7-S)}}n[g++]=p}return n}function Ao(o){if(!o)return"m_series";const s=String(o).toUpperCase();return s.startsWith("Q")||s.includes("Q199")||s.includes("D30")||s.includes("D35")||s.includes("Q30")||s.includes("D110")?"d_series":s.includes("M02")||s.includes("T02")?"m02_series":"m_series"}function Po(o,s={}){const{protocol:f="m_series",speed:u=5,density:m=15,media:d=10}=s,l=o.width,n=o.height,g=Math.ceil(l/8),h=No(o),r=[];f==="d_series"?(r.push(new Uint8Array([27,64])),r.push(new Uint8Array([29,118,48,0,g&255,g>>8&255,n&255,n>>8&255])),r.push(h),r.push(new Uint8Array([27,100,0]))):f==="m02_series"?(r.push(new Uint8Array([27,64,27,97,1,31,17,2,4])),r.push(new Uint8Array([29,118,48,0,g&255,g>>8&255,n&255,n>>8&255])),r.push(h),r.push(new Uint8Array([27,100,2,27,100,2,31,17,8,31,17,14,31,17,7,31,17,9]))):f==="m_series_esc"?(r.push(new Uint8Array([27,64,27,78,13,u,27,78,4,m,31,17,d])),r.push(new Uint8Array([29,118,48,0,g&255,g>>8&255,n&255,n>>8&255])),r.push(h),r.push(new Uint8Array([31,240,5,0,31,240,3,0]))):f==="esc_pos_std"?(r.push(new Uint8Array([27,64])),r.push(new Uint8Array([29,118,48,0,g&255,g>>8&255,n&255,n>>8&255])),r.push(h),r.push(new Uint8Array([27,100,3]))):(r.push(new Uint8Array([27,78,13,u,27,78,4,m,31,17,d])),r.push(new Uint8Array([29,118,48,0,g&255,g>>8&255,n&255,n>>8&255])),r.push(h),r.push(new Uint8Array([31,240,5,0,31,240,3,0])));const p=r.reduce((z,v)=>z+v.length,0),S=new Uint8Array(p);let F=0;for(const z of r)S.set(z,F),F+=z.length;return S}async function _o(o,s,f={},u=null){if(!o)throw new Error("No hay ninguna impresora Bluetooth conectada.");if(!s||s.length===0)throw new Error("No hay etiquetas en la cola para imprimir.");const m=s.length;for(let d=0;d<m;d++){const l=s[d];u&&u({current:d+1,total:m,percentage:Math.round(d/m*100),labelName:l.nombre||"Repuesto"});const n=So(l,f),g=Po(n,f);await Co(o,g,h=>{if(u){const r=Math.round((d+h/100)/m*100);u({current:d+1,total:m,percentage:r,labelName:l.nombre||"Repuesto"})}}),d<m-1&&await new Promise(h=>setTimeout(h,800))}return u&&u({current:m,total:m,percentage:100,labelName:"¡Completado con éxito!"}),{success:!0,count:m}}const rt=({value:o,width:s=1.3,height:f=32,displayValue:u=!0,fontSize:m=10})=>{const d=i.useRef(null);return i.useEffect(()=>{if(d.current&&o)try{kt(d.current,String(o),{format:"CODE128",width:s,height:f,displayValue:u,fontSize:m,margin:0,background:"transparent",lineColor:"#000000",fontOptions:"bold",textMargin:1})}catch{try{const n=String(o).replace(/[^a-zA-Z0-9_-]/g,"")||"000000";kt(d.current,n,{format:"CODE128",width:s,height:f,displayValue:u,fontSize:m,margin:0})}catch{console.warn("No se pudo renderizar código de barras:",o)}}},[o,s,f,u,m]),e.jsx("svg",{ref:d,style:{maxWidth:"100%",height:"auto",display:"block",margin:"0 auto"}})},Fo=y(ke.div)`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
`,zo=y(ke.div)`
  background: #ffffff;
  width: 98vw;
  max-width: 1460px;
  height: 95vh;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  border: 1px solid #e2e8f0;
`,Eo=y.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1.5rem;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #ffffff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  .title-group {
    display: flex;
    align-items: center;
    gap: 12px;

    .icon-badge {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      color: #ffffff;
      box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
    }

    h2 {
      font-size: 1.15rem;
      font-weight: 700;
      margin: 0;
      letter-spacing: -0.01em;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    p {
      margin: 0;
      font-size: 0.78rem;
      color: #94a3b8;
    }
  }

  .actions-group {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`,$o=y.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #cbd5e1;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1.1rem;

  &:hover {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
    transform: rotate(90deg);
  }
`,vt=y.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 0.78rem;
  font-weight: 700;
  transition: all 0.2s;
  user-select: none;

  &.disconnected {
    background: rgba(59, 130, 246, 0.15);
    color: #93c5fd;
    border: 1px solid rgba(59, 130, 246, 0.3);
    cursor: pointer;

    &:hover {
      background: rgba(59, 130, 246, 0.25);
      color: #ffffff;
    }
  }

  &.connecting {
    background: rgba(234, 179, 8, 0.15);
    color: #fde047;
    border: 1px solid rgba(234, 179, 8, 0.3);
  }

  &.connected {
    background: rgba(34, 197, 94, 0.15);
    color: #86efac;
    border: 1px solid rgba(34, 197, 94, 0.3);
  }

  .disconnect-x {
    background: rgba(239, 68, 68, 0.25);
    border: none;
    color: #fca5a5;
    border-radius: 4px;
    padding: 2px 5px;
    font-size: 0.7rem;
    cursor: pointer;
    margin-left: 4px;
    transition: all 0.15s;

    &:hover {
      background: #ef4444;
      color: #ffffff;
    }
  }
`,Mo=y.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #cbd5e1;
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 0.78rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: #ffffff;
  }
`,Bo=y.div`
  display: grid;
  grid-template-columns: 440px 1fr;
  flex: 1;
  overflow: hidden;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
`,Io=y.div`
  background: #f8fafc;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`,Ro=y.div`
  padding: 0.85rem 1rem;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;

    svg {
      position: absolute;
      left: 12px;
      color: #94a3b8;
      font-size: 0.95rem;
    }

    input {
      width: 100%;
      padding: 9px 12px 9px 36px;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      font-size: 0.86rem;
      outline: none;
      transition: all 0.2s;
      background: #f8fafc;

      &:focus {
        border-color: #3b82f6;
        background: #ffffff;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
      }
    }
  }

  .autocomplete-results {
    margin-top: 8px;
    max-height: 180px;
    overflow-y: auto;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);

    .result-item {
      padding: 8px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #f1f5f9;
      cursor: pointer;
      transition: background 0.15s;

      &:hover {
        background: #eff6ff;
      }

      &:last-child {
        border-bottom: none;
      }

      .info {
        display: flex;
        flex-direction: column;
        gap: 2px;
        max-width: 300px;

        .name {
          font-size: 0.82rem;
          font-weight: 600;
          color: #1e293b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .meta {
          font-size: 0.74rem;
          color: #64748b;
          display: flex;
          gap: 8px;
        }
      }

      .add-btn {
        background: #dbeafe;
        color: #1d4ed8;
        border: none;
        border-radius: 6px;
        padding: 4px 8px;
        font-size: 0.75rem;
        font-weight: 600;
      }
    }
  }
`,Do=y.div`
  padding: 0.65rem 1rem;
  background: #f1f5f9;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .stats {
    font-size: 0.82rem;
    font-weight: 700;
    color: #334155;
    display: flex;
    align-items: center;
    gap: 6px;

    .badge {
      background: #3b82f6;
      color: #ffffff;
      padding: 2px 7px;
      border-radius: 12px;
      font-size: 0.75rem;
    }
  }

  .quick-actions {
    display: flex;
    gap: 6px;

    button {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 0.74rem;
      font-weight: 600;
      color: #475569;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      transition: all 0.15s;

      &:hover {
        background: #e2e8f0;
        color: #1e293b;
      }

      &.danger:hover {
        background: #fee2e2;
        color: #b91c1c;
        border-color: #fca5a5;
      }
    }
  }
`,qo=y.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 8px;
`,To=y.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  transition: all 0.2s;

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 2px 5px rgba(0,0,0,0.04);
  }

  .item-details {
    flex: 1;
    min-width: 0;

    .item-name {
      font-size: 0.83rem;
      font-weight: 600;
      color: #1e293b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .item-sub {
      font-size: 0.74rem;
      color: #64748b;
      display: flex;
      gap: 8px;
      margin-top: 2px;

      .code {
        font-family: monospace;
        background: #f1f5f9;
        padding: 1px 5px;
        border-radius: 4px;
        color: #334155;
      }

      .price {
        font-weight: 600;
        color: #059669;
      }
    }
  }

  .stepper {
    display: flex;
    align-items: center;
    gap: 4px;
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 2px 4px;

    button {
      width: 24px;
      height: 24px;
      border: none;
      background: #ffffff;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #475569;
      font-size: 0.75rem;
      transition: background 0.15s;

      &:hover {
        background: #e2e8f0;
        color: #0f172a;
      }
    }

    input {
      width: 36px;
      text-align: center;
      border: none;
      background: transparent;
      font-weight: 700;
      font-size: 0.85rem;
      color: #1e293b;
      outline: none;
    }
  }

  .stock-sync {
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    color: #1d4ed8;
    padding: 4px 6px;
    border-radius: 6px;
    font-size: 0.72rem;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 3px;

    &:hover {
      background: #dbeafe;
    }
  }

  .remove-btn {
    background: transparent;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    padding: 6px;
    border-radius: 6px;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      color: #ef4444;
      background: #fee2e2;
    }
  }
`,Lo=y.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #94a3b8;
  padding: 2rem;
  text-align: center;
  gap: 12px;

  svg {
    font-size: 3rem;
    color: #cbd5e1;
  }

  p {
    font-size: 0.9rem;
    margin: 0;
  }
`,Oo=y.div`
  display: flex;
  flex-direction: column;
  background: #f1f5f9;
  overflow: hidden;
`,Uo=y.div`
  padding: 0.75rem 1.25rem;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  .top-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .format-selector {
    display: flex;
    background: #f1f5f9;
    padding: 3px;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    gap: 4px;

    button {
      border: none;
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 0.82rem;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;

      &.active {
        background: #ffffff;
        color: #2563eb;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
      }

      &:not(.active) {
        background: transparent;
        color: #64748b;

        &:hover {
          color: #1e293b;
        }
      }
    }
  }

  .options-row {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
    justify-content: space-between;
  }

  .config-section {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: center;
  }

  .control-group {
    display: flex;
    flex-direction: column;
    gap: 3px;

    label {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #64748b;
    }

    select {
      padding: 5px 8px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: 600;
      color: #1e293b;
      background: #f8fafc;
      outline: none;

      &:focus {
        border-color: #3b82f6;
      }
    }
  }

  .toggles {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;

    .toggle-chip {
      display: flex;
      align-items: center;
      gap: 5px;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 4px 9px;
      font-size: 0.76rem;
      font-weight: 600;
      color: #475569;
      cursor: pointer;
      user-select: none;
      transition: all 0.15s;

      &.active {
        background: #eff6ff;
        border-color: #3b82f6;
        color: #1d4ed8;
      }
    }
  }

  .action-buttons {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .btn-bluetooth-print {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    color: #ffffff;
    border: none;
    border-radius: 10px;
    padding: 8px 16px;
    font-size: 0.86rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    transition: all 0.2s;

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .btn-pc-print {
    background: #ffffff;
    color: #334155;
    border: 1px solid #cbd5e1;
    border-radius: 10px;
    padding: 8px 14px;
    font-size: 0.84rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 7px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover:not(:disabled) {
      background: #f1f5f9;
      color: #0f172a;
      border-color: #94a3b8;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .btn-a4-print {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: #ffffff;
    border: none;
    border-radius: 10px;
    padding: 8px 16px;
    font-size: 0.86rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
    transition: all 0.2s;

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(16, 185, 129, 0.35);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`,Vo=y.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 1.25rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.8rem;
  color: #475569;

  .nav-group {
    display: flex;
    align-items: center;
    gap: 8px;

    button {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 4px 10px;
      font-size: 0.76rem;
      font-weight: 600;
      color: #334155;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;

      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      &:hover:not(:disabled) {
        background: #f1f5f9;
      }
    }
  }

  .view-toggles {
    display: flex;
    gap: 6px;

    button {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 3px 8px;
      font-size: 0.74rem;
      font-weight: 600;
      color: #475569;
      cursor: pointer;

      &.active {
        background: #e0f2fe;
        color: #0284c7;
        border-color: #38bdf8;
      }
    }
  }

  .paper-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
    color: #0284c7;
    background: #e0f2fe;
    padding: 3px 10px;
    border-radius: 12px;
  }
`,Wo=y.div`
  flex: 1;
  overflow: auto;
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #64748b;
  position: relative;
`,Ho=y.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
`,Dt=y.div`
  width: 384px;
  height: 196px;
  background: #ffffff;
  border-radius: 8px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.4);
  border: 1px solid #e2e8f0;
  position: relative;
  box-sizing: border-box;
  user-select: none;

  .dim-pill {
    position: absolute;
    top: -12px;
    left: 12px;
    background: #0f172a;
    color: #38bdf8;
    font-size: 0.65rem;
    font-weight: 800;
    padding: 2px 8px;
    border-radius: 10px;
    letter-spacing: 0.04em;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .company-title {
    font-size: 8pt;
    font-weight: 800;
    text-transform: uppercase;
    color: #000000;
    letter-spacing: 0.05em;
    line-height: 1;
    margin: 0;
  }

  .product-name {
    font-size: 9.5pt;
    font-weight: 800;
    color: #000000;
    line-height: 1.15;
    max-height: 2.3em;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    width: 100%;
    margin-top: 2px;
  }

  .code-area {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 2px 0;
  }

  .bottom-info {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #000000;
    padding-top: 3px;

    .code-text {
      font-size: 7.5pt;
      font-family: monospace;
      font-weight: 800;
      color: #000000;
    }

    .price-tag {
      font-size: 11pt;
      font-weight: 900;
      color: #000000;
    }

    .category-text {
      font-size: 6.5pt;
      color: #334155;
      text-transform: uppercase;
    }
  }
`,Go=y.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #cbd5e1;
  padding: 16px 20px;
  border-radius: 16px;
  gap: 14px;
  max-height: 68vh;
  overflow-y: auto;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.15);

  .reel-sticker-wrap {
    position: relative;

    &::after {
      content: "- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -";
      position: absolute;
      bottom: -10px;
      left: 0;
      right: 0;
      text-align: center;
      color: #64748b;
      font-size: 0.65rem;
      letter-spacing: 2px;
      overflow: hidden;
    }

    &:last-child::after {
      display: none;
    }
  }
`,Qo=y.div`
  width: 210mm;
  min-height: 297mm;
  height: 297mm;
  padding: 8mm;
  background: #ffffff;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
  box-sizing: border-box;
  display: grid;
  gap: 2mm;
  align-content: start;
  transform-origin: top center;

  &.layout-24 {
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: calc((281mm - (7 * 2mm)) / 8);
  }

  &.layout-40 {
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: calc((281mm - (9 * 2mm)) / 10);
  }

  &.layout-12 {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: calc((281mm - (5 * 2mm)) / 6);
  }
`,Yo=y.div`
  box-sizing: border-box;
  padding: 3mm;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  overflow: hidden;
  position: relative;
  background: #ffffff;

  &.paper-bond {
    border: 1px dashed #94a3b8;
    border-radius: 0;
  }

  &.paper-adhesive {
    border: 1px solid transparent;
    border-radius: 4px;
  }

  .company-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-bottom: 1.5mm;
    width: 100%;

    .company-logo {
      height: 18px;
      max-height: 18px;
      width: auto;
      object-fit: contain;
    }

    .company-title {
      font-size: 8pt;
      font-weight: 800;
      text-transform: uppercase;
      color: #1e293b;
      letter-spacing: 0.04em;
      line-height: 1;
      margin: 0;
    }
  }

  .product-name {
    font-size: 8pt;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.15;
    max-height: 2.3em;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    margin-bottom: 1.5mm;
  }

  .code-area {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1mm 0;

    &.hybrid {
      display: flex;
      align-items: center;
      justify-content: space-around;
      gap: 4px;
    }
  }

  .bottom-info {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1.5mm;
    padding-top: 1mm;
    border-top: 0.5px solid #e2e8f0;

    .code-text {
      font-size: 7.5pt;
      font-family: monospace;
      font-weight: 700;
      color: #334155;
    }

    .price-tag {
      font-size: 9.5pt;
      font-weight: 800;
      color: #059669;
      letter-spacing: -0.01em;
    }

    .category-text {
      font-size: 6.5pt;
      color: #64748b;
      text-transform: uppercase;
    }
  }
`,Jo=y.div`
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(4px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;

  .progress-card {
    background: #ffffff;
    border-radius: 16px;
    padding: 24px 30px;
    width: 360px;
    text-align: center;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);

    .icon-anim {
      font-size: 2.4rem;
      color: #2563eb;
      margin-bottom: 12px;
      animation: pulse 1.5s infinite;
    }

    h3 {
      font-size: 1.1rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 8px 0;
    }

    .label-desc {
      font-size: 0.82rem;
      color: #64748b;
      margin-bottom: 16px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .progress-bar-bg {
      width: 100%;
      height: 10px;
      background: #e2e8f0;
      border-radius: 5px;
      overflow: hidden;
      margin-bottom: 8px;

      .progress-bar-fill {
        height: 100%;
        background: linear-gradient(90deg, #3b82f6, #10b981);
        transition: width 0.3s ease;
      }
    }

    .percentage-text {
      font-size: 0.82rem;
      font-weight: 700;
      color: #1e293b;
    }

    .footer-note {
      font-size: 0.72rem;
      color: #94a3b8;
      margin-top: 10px;
    }
  }

  @keyframes pulse {
    0% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.15); opacity: 1; }
    100% { transform: scale(1); opacity: 0.8; }
  }
`,Ko=y.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.7);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`,Zo=y.div`
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);

  .header {
    background: #0f172a;
    color: #ffffff;
    padding: 14px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    h3 {
      font-size: 1.05rem;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    button {
      background: transparent;
      border: none;
      color: #94a3b8;
      font-size: 1.1rem;
      cursor: pointer;
      &:hover { color: #ffffff; }
    }
  }

  .body {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-height: 75vh;
    overflow-y: auto;

    .step-box {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 14px;
      background: #f8fafc;

      .step-title {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 700;
        font-size: 0.92rem;
        color: #1e293b;
        margin-bottom: 6px;

        .badge-number {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #2563eb;
          color: #ffffff;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      p {
        font-size: 0.82rem;
        color: #475569;
        line-height: 1.5;
        margin: 0 0 6px 0;
      }
    }
  }

  .footer {
    padding: 12px 20px;
    background: #f1f5f9;
    border-top: 1px solid #e2e8f0;
    text-align: right;

    button {
      background: #2563eb;
      color: #ffffff;
      border: none;
      padding: 8px 18px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 0.84rem;
      cursor: pointer;
      &:hover { background: #1d4ed8; }
    }
  }
`;function Xo({isOpen:o,onClose:s,products:f=[],categories:u=[],initialProduct:m=null}){const[d,l]=i.useState([]),[n,g]=i.useState(""),[h,r]=i.useState([]),[p,S]=i.useState("thermal_2x1"),[F,z]=i.useState("single"),[v,k]=i.useState(0),[x,j]=i.useState("bond"),[P,O]=i.useState("barcode"),[L,G]=i.useState("24"),[ie,de]=i.useState(!0),[q,pe]=i.useState(!0),[W,Qe]=i.useState(!0),[J,Ye]=i.useState(!1),[oe,Pe]=i.useState(0),[Je,ge]=i.useState(null),[_e,K]=i.useState(null),[fe,re]=i.useState("disconnected"),[Ke,ve]=i.useState(""),[Fe,Ze]=i.useState(!1),[he,Re]=i.useState({current:0,total:0,percentage:0,labelName:""}),[De,ze]=i.useState(!1),[Ee,qe]=i.useState(10),[Te,Le]=i.useState(15),[Oe,xe]=i.useState("m_series");i.useEffect(()=>{m&&o&&l([{product:m,quantity:Math.max(1,Number(m.existencia)||1)}])},[m,o]),i.useEffect(()=>{if(!n.trim()){r([]);return}const t=n.toLowerCase(),N=f.filter(b=>b.nombre&&b.nombre.toLowerCase().includes(t)||b.codigo&&b.codigo.toLowerCase().includes(t)||b.codigo_barras&&b.codigo_barras.toLowerCase().includes(t)).slice(0,10);r(N)},[n,f]);const se=i.useMemo(()=>L==="40"?40:L==="12"?12:24,[L]),A=i.useMemo(()=>{const t=[];return d.forEach(N=>{for(let b=0;b<N.quantity;b++)t.push(N.product)}),t},[d]),ae=Math.max(1,Math.ceil(A.length/se));i.useEffect(()=>{oe>=ae&&Pe(Math.max(0,ae-1))},[ae,oe]),i.useEffect(()=>{v>=A.length&&k(Math.max(0,A.length-1))},[A.length,v]);const $e=i.useMemo(()=>{const t=oe*se;return A.slice(t,t+se)},[A,oe,se]),Ue=A[v]||null,Q=t=>{l(N=>{const b=N.findIndex(_=>_.product.id_producto===t.id_producto);if(b>=0){const _=[...N];return _[b].quantity+=1,_}return[...N,{product:t,quantity:1}]}),g(""),r([])},Xe=(t,N)=>{l(b=>b.map(_=>{if(_.product.id_producto===t){const B=Math.max(1,_.quantity+N);return{..._,quantity:B}}return _}))},et=(t,N)=>{const b=Math.max(1,parseInt(N)||1);l(_=>_.map(B=>B.product.id_producto===t?{...B,quantity:b}:B))},Y=t=>{l(N=>N.map(b=>{if(b.product.id_producto===t){const _=Math.max(1,Number(b.product.existencia)||1);return{...b,quantity:_}}return b}))},we=t=>{l(N=>N.filter(b=>b.product.id_producto!==t))},Ve=()=>{l(t=>t.map(N=>({...N,quantity:1})))},xt=()=>{l(t=>t.map(N=>({...N,quantity:Math.max(1,Number(N.product.existencia)||1)})))},mt=()=>{l([]),Pe(0),k(0)},ut=async()=>{if(!Vt()){ne.error("Tu navegador no soporta Bluetooth Web. Usa Google Chrome o Microsoft Edge en tu PC.");return}try{re("connecting");const t=await Rt(()=>{ge(null),K(null),re("disconnected"),ve(""),ne("Impresora Bluetooth desconectada.")});ge(t.device),K(t.characteristic),ve(t.name),re("connected"),ne.success(`Conectado a ${t.name}`)}catch(t){re("disconnected"),t.message&&!t.message.includes("cancelada")&&ne.error(t.message||"No se pudo conectar a la impresora Bluetooth.")}},gt=()=>{Je&&vo(Je),ge(null),K(null),re("disconnected"),ve(""),ne("Impresora desconectada")},ft=async()=>{var N;if(A.length===0){ne.error("No hay etiquetas en la bandeja.");return}let t=_e;if(!t||fe!=="connected")try{re("connecting");const b=await Rt(()=>{ge(null),K(null),re("disconnected"),ve(""),ne("Impresora Bluetooth desconectada.")});t=b.characteristic,ge(b.device),K(b.characteristic),ve(b.name);const _=Ao(b.name);xe(_),re("connected"),ne.success(`Conectado a ${b.name}`)}catch(b){re("disconnected"),b.message&&!b.message.includes("cancelada")&&ne.error(b.message||"Error al conectar por Bluetooth");return}try{Ze(!0),Re({current:1,total:A.length,percentage:0,labelName:((N=A[0])==null?void 0:N.nombre)||"Repuesto"}),await _o(t,A,{showCompany:q,showPrice:W,showCategory:J,codeType:P,storeName:"MULTIREPUESTOS RG",density:Te,media:Ee,speed:5,protocol:Oe},b=>{Re(b)}),ne.success(`¡${A.length} etiquetas impresas en Phomemo con éxito!`)}catch(b){console.error("Error al imprimir por Bluetooth:",b),ne.error(`Error en la impresión: ${b.message}`)}finally{Ze(!1)}},ht=()=>{if(A.length===0)return;const t=document.createElement("iframe");t.style.position="fixed",t.style.right="0",t.style.bottom="0",t.style.width="0",t.style.height="0",t.style.border="0",document.body.appendChild(t);const N=t.contentWindow.document;let b="";A.forEach(B=>{var w;const T=B.codigo_barras||B.codigo||"000000",D=B.precio_venta??B.venta??B.precio??((w=B.__fmt)==null?void 0:w.venta)??0,U=typeof D=="string"&&D.includes("C$")?parseFloat(D.replace(/[^0-9.]/g,"")):parseFloat(D),Z=!isNaN(U)&&U>0?`C$ ${U.toFixed(2)}`:"",le=B.categoria_nombre||"";let a="";P==="barcode"?a=`<svg class="barcode-item" data-code="${T}"></svg>`:P==="qr"?a=`<div class="qr-item" data-code="${T}"></div>`:a=`
          <div style="display:flex;align-items:center;justify-content:space-around;width:100%;">
            <svg class="barcode-item" data-code="${T}" style="max-width:70%;height:10mm;"></svg>
            <div class="qr-item" data-code="${T}" style="width:11mm;height:11mm;"></div>
          </div>
        `,b+=`
        <div class="label-page-2x1">
          ${q?`
            <div class="company-header">
              <span class="company-title">Multirepuestos RG</span>
            </div>
          `:""}
          <div class="product-name">${B.nombre||"Repuesto"}</div>
          <div class="code-area">${a}</div>
          <div class="bottom-info">
            <span class="code-text">${T}</span>
            ${W&&Z?`<span class="price-tag">${Z}</span>`:""}
            ${J&&le?`<span class="category-text">${le}</span>`:""}
          </div>
        </div>
      `});const _=`
      @page {
        size: 50.8mm 25.4mm; /* Exactamente 2x1 pulgadas */
        margin: 0;
      }
      @media print {
        html, body {
          width: 50.8mm;
          margin: 0;
          padding: 0;
          background: #ffffff;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .label-page-2x1 {
          page-break-after: always;
          break-after: page;
        }
      }
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      body {
        font-family: system-ui, -apple-system, sans-serif;
        background: #ffffff;
        color: #000000;
      }
      .label-page-2x1 {
        width: 50.8mm;
        height: 25.4mm;
        max-width: 50.8mm;
        max-height: 25.4mm;
        padding: 1.2mm 2.2mm;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        text-align: center;
        overflow: hidden;
        page-break-after: always;
        break-after: page;
      }
      .company-header {
        width: 100%;
        line-height: 1;
        margin-bottom: 0.3mm;
      }
      .company-title {
        font-size: 6.5pt;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .product-name {
        font-size: 7.2pt;
        font-weight: 700;
        line-height: 1.1;
        max-height: 2.2em;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break: break-word;
        width: 100%;
      }
      .code-area {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0.4mm 0;
      }
      .code-area svg {
        max-width: 95%;
        height: 10mm;
      }
      .bottom-info {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-top: 0.5px solid #000;
        padding-top: 0.5mm;
        line-height: 1;
      }
      .code-text {
        font-size: 6.5pt;
        font-family: monospace;
        font-weight: 700;
      }
      .price-tag {
        font-size: 8pt;
        font-weight: 800;
      }
      .category-text {
        font-size: 5.5pt;
        text-transform: uppercase;
      }
    `;N.open(),N.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Etiquetas_2x1_Phomemo_Multirepuestos_RG</title>
          <style>${_}</style>
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"><\/script>
          <script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"><\/script>
        </head>
        <body>
          ${b}
          <script>
            window.onload = function() {
              document.querySelectorAll('.barcode-item').forEach(function(el) {
                var code = el.getAttribute('data-code');
                try {
                  JsBarcode(el, code, {
                    format: 'CODE128',
                    width: 1.5,
                    height: 38,
                    displayValue: false,
                    margin: 0
                  });
                } catch(e) {}
              });

              document.querySelectorAll('.qr-item').forEach(function(el) {
                var code = el.getAttribute('data-code');
                try {
                  new QRCode(el, {
                    text: code,
                    width: 40,
                    height: 40,
                    correctLevel: QRCode.CorrectLevel.M
                  });
                } catch(e) {}
              });

              setTimeout(function() {
                window.focus();
                window.print();
                setTimeout(function() {
                  window.frameElement.parentNode.removeChild(window.frameElement);
                }, 1000);
              }, 350);
            };
          <\/script>
        </body>
      </html>
    `),N.close()},bt=()=>{if(A.length===0)return;const t=document.createElement("iframe");t.style.position="fixed",t.style.right="0",t.style.bottom="0",t.style.width="0",t.style.height="0",t.style.border="0",document.body.appendChild(t);const N=t.contentWindow.document,b=[];for(let T=0;T<A.length;T+=se)b.push(A.slice(T,T+se));let _="";b.forEach(T=>{let D="";T.forEach(U=>{var V;const Z=U.codigo_barras||U.codigo||"000000",le=U.precio_venta??U.venta??U.precio??((V=U.__fmt)==null?void 0:V.venta)??0,a=typeof le=="string"&&le.includes("C$")?parseFloat(le.replace(/[^0-9.]/g,"")):parseFloat(le),w=!isNaN(a)&&a>0?`C$ ${a.toFixed(2)}`:"",c=U.categoria_nombre||"";let C="";P==="barcode"?C=`<svg class="barcode-item" data-code="${Z}"></svg>`:P==="qr"?C=`<div class="qr-item" data-code="${Z}"></div>`:C=`
            <div style="display:flex;align-items:center;justify-content:space-around;width:100%;">
              <svg class="barcode-item" data-code="${Z}" style="max-width:70%;"></svg>
              <div class="qr-item" data-code="${Z}" style="width:24mm;height:24mm;"></div>
            </div>
          `,D+=`
          <div class="label-card ${x==="bond"?"paper-bond":"paper-adhesive"}">
            ${q||ie?`
              <div class="company-header">
                ${ie?`<img src="/icons/logo.png" class="company-logo" alt="Logo" onerror="this.style.display='none'" />`:""}
                ${q?'<span class="company-title">Multirepuestos RG</span>':""}
              </div>
            `:""}
            <div class="product-name">${U.nombre||"Repuesto"}</div>
            <div class="code-area">${C}</div>
            <div class="bottom-info">
              <span class="code-text">${Z}</span>
              ${W&&w?`<span class="price-tag">${w}</span>`:""}
              ${J&&c?`<span class="category-text">${c}</span>`:""}
            </div>
          </div>
        `}),_+=`
        <div class="a4-sheet layout-${L}">
          ${D}
        </div>
      `});const B=`
      @page {
        size: A4 portrait;
        margin: 8mm;
      }
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      body {
        font-family: system-ui, -apple-system, sans-serif;
        background: #ffffff;
      }
      .a4-sheet {
        width: 194mm;
        height: 281mm;
        box-sizing: border-box;
        display: grid;
        gap: 2mm;
        page-break-after: always;
        break-after: page;
        align-content: start;
      }
      .a4-sheet.layout-24 {
        grid-template-columns: repeat(3, 1fr);
        grid-auto-rows: calc((281mm - (7 * 2mm)) / 8);
      }
      .a4-sheet.layout-40 {
        grid-template-columns: repeat(4, 1fr);
        grid-auto-rows: calc((281mm - (9 * 2mm)) / 10);
      }
      .a4-sheet.layout-12 {
        grid-template-columns: repeat(2, 1fr);
        grid-auto-rows: calc((281mm - (5 * 2mm)) / 6);
      }
      .label-card {
        padding: 2.5mm;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        text-align: center;
        overflow: hidden;
        position: relative;
        background: #ffffff;
      }
      .label-card.paper-bond {
        border: 1px dashed #94a3b8;
      }
      .label-card.paper-adhesive {
        border: 1px solid transparent;
      }
      .company-header {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        margin-bottom: 1mm;
        width: 100%;
      }
      .company-logo {
        height: 18px;
        max-height: 18px;
        width: auto;
        object-fit: contain;
      }
      .company-title {
        font-size: 8pt;
        font-weight: 800;
        text-transform: uppercase;
        color: #000;
        letter-spacing: 0.04em;
        line-height: 1;
        margin: 0;
      }
      .product-name {
        font-size: 8pt;
        font-weight: 700;
        color: #000;
        line-height: 1.15;
        max-height: 2.3em;
        overflow: hidden;
      }
      .code-area {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 1mm 0;
      }
      .bottom-info {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 1mm;
        border-top: 0.5px solid #ccc;
      }
      .code-text {
        font-size: 7pt;
        font-family: monospace;
        font-weight: 700;
        color: #000;
      }
      .price-tag {
        font-size: 8.5pt;
        font-weight: 800;
        color: #000;
      }
      .category-text {
        font-size: 6.5pt;
        color: #333;
        text-transform: uppercase;
      }
    `;N.open(),N.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Etiquetas_A4_Multirepuestos_RG</title>
          <style>${B}</style>
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"><\/script>
          <script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"><\/script>
        </head>
        <body>
          ${_}
          <script>
            window.onload = function() {
              document.querySelectorAll('.barcode-item').forEach(function(el) {
                var code = el.getAttribute('data-code');
                try {
                  JsBarcode(el, code, {
                    format: 'CODE128',
                    width: 1.4,
                    height: 30,
                    displayValue: false,
                    margin: 0
                  });
                } catch(e) {}
              });

              document.querySelectorAll('.qr-item').forEach(function(el) {
                var code = el.getAttribute('data-code');
                try {
                  new QRCode(el, {
                    text: code,
                    width: 48,
                    height: 48,
                    correctLevel: QRCode.CorrectLevel.M
                  });
                } catch(e) {}
              });

              setTimeout(function() {
                window.focus();
                window.print();
                setTimeout(function() {
                  window.frameElement.parentNode.removeChild(window.frameElement);
                }, 1000);
              }, 400);
            };
          <\/script>
        </body>
      </html>
    `),N.close()};return o?e.jsx(te,{children:e.jsx(Fo,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(zo,{initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs(Eo,{children:[e.jsxs("div",{className:"title-group",children:[e.jsx("div",{className:"icon-badge",children:e.jsx(Me,{})}),e.jsxs("div",{children:[e.jsx("h2",{children:"Generador de Etiquetas y Códigos de Barra"}),e.jsx("p",{children:"Imprime en Rollo Térmico 2x1'' (Phomemo Bluetooth) o en Hojas A4"})]})]}),e.jsxs("div",{className:"actions-group",children:[fe==="connected"?e.jsxs(vt,{className:"connected",title:"Conectado vía Bluetooth a la impresora",children:[e.jsx(eo,{})," ",Ke||"Phomemo Conectada",e.jsx("button",{className:"disconnect-x",onClick:gt,title:"Desconectar",children:"Desconectar"})]}):fe==="connecting"?e.jsxs(vt,{className:"connecting",children:[e.jsx(to,{className:"animate-spin"})," Conectando Bluetooth..."]}):e.jsxs(vt,{className:"disconnected",onClick:ut,title:"Haz clic para conectar tu Phomemo por Bluetooth desde la PC",children:[e.jsx(tt,{})," Conectar Phomemo"]}),e.jsxs(Mo,{onClick:()=>ze(!0),title:"Instrucciones para Phomemo en PC",children:[e.jsx(oo,{})," ¿Cómo usar Phomemo?"]}),e.jsx($o,{onClick:s,title:"Cerrar",children:e.jsx(Ge,{})})]})]}),e.jsxs(Bo,{children:[e.jsxs(Io,{children:[e.jsxs(Ro,{children:[e.jsxs("div",{className:"input-wrapper",children:[e.jsx(ct,{}),e.jsx("input",{type:"text",placeholder:"Buscar repuesto por nombre o código para añadir...",value:n,onChange:t=>g(t.target.value)})]}),h.length>0&&e.jsx("div",{className:"autocomplete-results",children:h.map(t=>e.jsxs("div",{className:"result-item",onClick:()=>Q(t),children:[e.jsxs("div",{className:"info",children:[e.jsx("span",{className:"name",children:t.nombre}),e.jsxs("span",{className:"meta",children:[e.jsxs("span",{children:["Código: ",t.codigo||t.codigo_barras||"N/A"]}),e.jsxs("span",{children:["Stock: ",t.existencia]}),e.jsxs("span",{children:["C$ ",t.precio_venta]})]})]}),e.jsxs("button",{className:"add-btn",children:[e.jsx(dt,{})," Añadir"]})]},t.id_producto))})]}),e.jsxs(Do,{children:[e.jsxs("div",{className:"stats",children:[e.jsx("span",{children:"Bandeja:"}),e.jsxs("span",{className:"badge",children:[d.length," productos"]}),e.jsxs("span",{style:{color:"#0284c7"},children:["(",A.length," etiquetas)"]})]}),e.jsxs("div",{className:"quick-actions",children:[e.jsx("button",{onClick:Ve,title:"Poner 1 etiqueta a cada producto",children:"1 a todos"}),e.jsxs("button",{onClick:xt,title:"Poner cantidad igual al stock de bodega",children:[e.jsx($t,{})," = Stock"]}),e.jsx("button",{className:"danger",onClick:mt,title:"Vaciar la lista",children:e.jsx(Nt,{})})]})]}),e.jsx(qo,{children:d.length===0?e.jsxs(Lo,{children:[e.jsx(Me,{}),e.jsx("p",{children:"No has añadido repuestos a la bandeja."}),e.jsx("span",{style:{fontSize:"0.8rem",color:"#94a3b8"},children:"Usa el buscador arriba para agregar productos a imprimir."})]}):d.map(t=>e.jsxs(To,{children:[e.jsxs("div",{className:"item-details",children:[e.jsx("div",{className:"item-name",title:t.product.nombre,children:t.product.nombre}),e.jsxs("div",{className:"item-sub",children:[e.jsx("span",{className:"code",children:t.product.codigo_barras||t.product.codigo||"S/C"}),e.jsxs("span",{className:"price",children:["C$ ",Number(t.product.precio_venta||0).toFixed(2)]}),e.jsxs("span",{style:{color:"#64748b"},children:["Bodega: ",t.product.existencia]})]})]}),e.jsxs("div",{className:"stepper",children:[e.jsx("button",{onClick:()=>Xe(t.product.id_producto,-1),children:e.jsx(ro,{})}),e.jsx("input",{type:"number",min:"1",value:t.quantity,onChange:N=>et(t.product.id_producto,N.target.value)}),e.jsx("button",{onClick:()=>Xe(t.product.id_producto,1),children:e.jsx(dt,{})})]}),e.jsxs("button",{className:"stock-sync",onClick:()=>Y(t.product.id_producto),title:"Igualar cantidad al stock físico",children:[e.jsx($t,{})," Stock"]}),e.jsx("button",{className:"remove-btn",onClick:()=>we(t.product.id_producto),title:"Quitar",children:e.jsx(Ge,{})})]},t.product.id_producto))})]}),e.jsxs(Oo,{children:[e.jsxs(Uo,{children:[e.jsxs("div",{className:"top-row",children:[e.jsxs("div",{className:"format-selector",children:[e.jsxs("button",{className:p==="thermal_2x1"?"active":"",onClick:()=>S("thermal_2x1"),children:[e.jsx(nt,{})," 🏷️ Rollo Térmico 2x1'' (Phomemo)"]}),e.jsxs("button",{className:p==="a4_sheet"?"active":"",onClick:()=>S("a4_sheet"),children:[e.jsx(Mt,{})," 📄 Hoja Completa A4"]})]}),e.jsx("div",{className:"action-buttons",children:p==="thermal_2x1"?e.jsxs(e.Fragment,{children:[e.jsxs("button",{className:"btn-bluetooth-print",disabled:A.length===0||Fe,onClick:ft,title:"Imprime de un solo tirón por Bluetooth directamente desde la PC",children:[e.jsx(tt,{}),fe==="connected"?`Imprimir ${A.length} por Bluetooth`:`Conectar e Imprimir ${A.length} (Bluetooth)`]}),e.jsxs("button",{className:"btn-pc-print",disabled:A.length===0||Fe,onClick:ht,title:"Imprime usando la impresora de Windows o cable USB configurada en 2x1''",children:[e.jsx(ao,{})," Diálogo PC (2x1'')"]})]}):e.jsxs("button",{className:"btn-a4-print",disabled:A.length===0,onClick:bt,children:[e.jsx(no,{})," Imprimir ",A.length," Etiquetas A4"]})})]}),e.jsx("div",{className:"options-row",children:e.jsxs("div",{className:"config-section",children:[e.jsxs("div",{className:"control-group",children:[e.jsx("label",{children:"Tipo de Código"}),e.jsxs("select",{value:P,onChange:t=>O(t.target.value),children:[e.jsx("option",{value:"barcode",children:"📊 Código de Barras (1D)"}),e.jsx("option",{value:"qr",children:"📱 Código QR (2D)"}),p==="a4_sheet"&&e.jsx("option",{value:"hybrid",children:"🔄 Híbrido (Barras + QR)"})]})]}),p==="thermal_2x1"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"control-group",children:[e.jsx("label",{children:"Protocolo de Impresora"}),e.jsxs("select",{value:Oe,onChange:t=>xe(t.target.value),children:[e.jsx("option",{value:"m_series",children:"🏷️ Phomemo Serie M (M110 / M120 / M220)"}),e.jsx("option",{value:"m_series_esc",children:"🏷️ Phomemo M110 (con Reset ESC @)"}),e.jsx("option",{value:"d_series",children:"🏷️ Phomemo Serie Q / D (Q199 / Q30 / D30)"}),e.jsx("option",{value:"m02_series",children:"🏷️ Phomemo Serie M02 / T02"}),e.jsx("option",{value:"esc_pos_std",children:"🏷️ ESC/POS Genérico"})]})]}),e.jsxs("div",{className:"control-group",children:[e.jsx("label",{children:"Tipo de Rollo"}),e.jsxs("select",{value:Ee,onChange:t=>qe(Number(t.target.value)),children:[e.jsx("option",{value:10,children:"🏷️ Con Separación (Gap 2x1)"}),e.jsx("option",{value:11,children:"📄 Rollo Continuo"})]})]})]}),p==="a4_sheet"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"control-group",children:[e.jsx("label",{children:"Tipo de Papel"}),e.jsxs("select",{value:x,onChange:t=>j(t.target.value),children:[e.jsx("option",{value:"bond",children:"📄 Papel Bond A4 (Líneas de Corte)"}),e.jsx("option",{value:"adhesive",children:"🏷️ Papel Adhesivo (Stickers A4)"})]})]}),e.jsxs("div",{className:"control-group",children:[e.jsx("label",{children:"Distribución A4"}),e.jsxs("select",{value:L,onChange:t=>G(t.target.value),children:[e.jsx("option",{value:"24",children:"24 por Hoja (3x8 - Estándar Góndola)"}),e.jsx("option",{value:"40",children:"40 por Hoja (4x10 - Repuesto Pequeño)"}),e.jsx("option",{value:"12",children:"12 por Hoja (2x6 - Grande / Baterías)"})]})]})]}),e.jsxs("div",{className:"toggles",children:[e.jsxs("div",{className:`toggle-chip ${W?"active":""}`,onClick:()=>Qe(!W),title:"Mostrar precio de venta C$",children:[W&&e.jsx(jt,{size:9})," Precio C$"]}),e.jsxs("div",{className:`toggle-chip ${q?"active":""}`,onClick:()=>pe(!q),title:"Mostrar Multirepuestos RG",children:[q&&e.jsx(jt,{size:9})," Empresa"]}),e.jsxs("div",{className:`toggle-chip ${J?"active":""}`,onClick:()=>Ye(!J),title:"Mostrar Categoría",children:[J&&e.jsx(jt,{size:9})," Categoría"]})]})]})})]}),e.jsx(Vo,{children:p==="thermal_2x1"?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"nav-group",children:[e.jsxs("button",{disabled:v===0,onClick:()=>k(t=>Math.max(0,t-1)),children:[e.jsx(St,{})," Anterior"]}),e.jsxs("span",{children:["Etiqueta ",e.jsx("strong",{children:A.length>0?v+1:0})," de ",e.jsx("strong",{children:A.length})]}),e.jsxs("button",{disabled:v>=A.length-1,onClick:()=>k(t=>Math.min(A.length-1,t+1)),children:["Siguiente ",e.jsx(Bt,{})]})]}),e.jsxs("div",{className:"view-toggles",children:[e.jsx("button",{className:F==="single"?"active":"",onClick:()=>z("single"),title:"Ver etiqueta individual ampliada",children:"🏷️ Vista Individual"}),e.jsx("button",{className:F==="reel"?"active":"",onClick:()=>z("reel"),title:"Ver tira continua del rollo",children:"🎞️ Tira de Rollo"})]}),e.jsxs("div",{className:"paper-indicator",children:[e.jsx(nt,{})," Rollo Térmico 2x1'' (50mm x 25mm) - Phomemo / Térmica"]})]}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"nav-group",children:[e.jsxs("button",{disabled:oe===0,onClick:()=>Pe(t=>Math.max(0,t-1)),children:[e.jsx(St,{})," Anterior"]}),e.jsxs("span",{children:["Hoja A4 ",e.jsx("strong",{children:oe+1})," de ",e.jsx("strong",{children:ae})]}),e.jsxs("button",{disabled:oe>=ae-1,onClick:()=>Pe(t=>Math.min(ae-1,t+1)),children:["Siguiente ",e.jsx(Bt,{})]})]}),e.jsxs("div",{className:"paper-indicator",children:[e.jsx(Mt,{}),x==="bond"?"Papel Bond con Guías de Corte Punteadas":"Papel de Etiquetas Autoadhesivas"]})]})}),e.jsx(Wo,{children:p==="thermal_2x1"?A.length===0?e.jsxs("div",{style:{color:"#e2e8f0",textAlign:"center"},children:[e.jsx(Me,{size:48,style:{opacity:.5,marginBottom:12}}),e.jsx("p",{children:"Agrega repuestos a la bandeja para previsualizar tu etiqueta 2x1''."})]}):F==="single"&&Ue?e.jsx(Ho,{children:(()=>{var D;const t=Ue,N=t.codigo_barras||t.codigo||"000000",b=t.precio_venta??t.venta??t.precio??((D=t.__fmt)==null?void 0:D.venta)??0,_=typeof b=="string"&&b.includes("C$")?parseFloat(b.replace(/[^0-9.]/g,"")):parseFloat(b),B=!isNaN(_)&&_>0?`C$ ${_.toFixed(2)}`:"",T=t.categoria_nombre||"";return e.jsxs(Dt,{children:[e.jsxs("div",{className:"dim-pill",children:[e.jsx(nt,{size:10})," 2x1 PULGADAS (50x25mm)"]}),q&&e.jsx("div",{className:"company-title",children:"Multirepuestos RG"}),e.jsx("div",{className:"product-name",title:t.nombre,children:t.nombre}),e.jsx("div",{className:"code-area",children:P==="barcode"?e.jsx(rt,{value:N,width:1.6,height:36,displayValue:!1}):e.jsx(ot,{value:N,size:44,level:"M"})}),e.jsxs("div",{className:"bottom-info",children:[e.jsx("span",{className:"code-text",children:N}),W&&B&&e.jsx("span",{className:"price-tag",children:B}),J&&T&&e.jsx("span",{className:"category-text",children:T})]})]})})()}):e.jsx(Go,{children:A.map((t,N)=>{var U;const b=t.codigo_barras||t.codigo||"000000",_=t.precio_venta??t.venta??t.precio??((U=t.__fmt)==null?void 0:U.venta)??0,B=typeof _=="string"&&_.includes("C$")?parseFloat(_.replace(/[^0-9.]/g,"")):parseFloat(_),T=!isNaN(B)&&B>0?`C$ ${B.toFixed(2)}`:"",D=t.categoria_nombre||"";return e.jsx("div",{className:"reel-sticker-wrap",children:e.jsxs(Dt,{children:[e.jsxs("div",{className:"dim-pill",children:["#",N+1," • 2x1''"]}),q&&e.jsx("div",{className:"company-title",children:"Multirepuestos RG"}),e.jsx("div",{className:"product-name",title:t.nombre,children:t.nombre}),e.jsx("div",{className:"code-area",children:P==="barcode"?e.jsx(rt,{value:b,width:1.6,height:36,displayValue:!1}):e.jsx(ot,{value:b,size:44,level:"M"})}),e.jsxs("div",{className:"bottom-info",children:[e.jsx("span",{className:"code-text",children:b}),W&&T&&e.jsx("span",{className:"price-tag",children:T}),J&&D&&e.jsx("span",{className:"category-text",children:D})]})]})},`${t.id_producto}-${N}`)})}):e.jsx(Qo,{className:`layout-${L}`,children:$e.map((t,N)=>{var U;const b=t.codigo_barras||t.codigo||"000000",_=t.precio_venta??t.venta??t.precio??((U=t.__fmt)==null?void 0:U.venta)??0,B=typeof _=="string"&&_.includes("C$")?parseFloat(_.replace(/[^0-9.]/g,"")):parseFloat(_),T=!isNaN(B)&&B>0?`C$ ${B.toFixed(2)}`:"",D=t.categoria_nombre||"";return e.jsxs(Yo,{className:`paper-${x}`,children:[(q||ie)&&e.jsxs("div",{className:"company-header",children:[ie&&e.jsx("img",{src:"/icons/logo.png",alt:"Logo",className:"company-logo",onError:Z=>{Z.target.style.display="none"}}),q&&e.jsx("span",{className:"company-title",children:"Multirepuestos RG"})]}),e.jsx("div",{className:"product-name",title:t.nombre,children:t.nombre}),e.jsxs("div",{className:`code-area ${P==="hybrid"?"hybrid":""}`,children:[P==="barcode"&&e.jsx(rt,{value:b,width:L==="40"?1:1.3,height:L==="40"?22:28,displayValue:!1}),P==="qr"&&e.jsx(ot,{value:b,size:L==="40"?38:46,level:"M"}),P==="hybrid"&&e.jsxs(e.Fragment,{children:[e.jsx("div",{style:{flex:1,maxWidth:"72%"},children:e.jsx(rt,{value:b,width:1,height:22,displayValue:!1})}),e.jsx(ot,{value:b,size:32,level:"M"})]})]}),e.jsxs("div",{className:"bottom-info",children:[e.jsx("span",{className:"code-text",children:b}),W&&T&&e.jsx("span",{className:"price-tag",children:T}),J&&D&&e.jsx("span",{className:"category-text",children:D})]})]},`${t.id_producto}-${N}`)})})})]})]}),Fe&&e.jsx(Jo,{children:e.jsxs("div",{className:"progress-card",children:[e.jsx("div",{className:"icon-anim",children:e.jsx(tt,{})}),e.jsx("h3",{children:"Imprimiendo en Phomemo..."}),e.jsxs("div",{className:"label-desc",children:["Etiqueta ",he.current," de ",he.total,":",e.jsxs("strong",{children:[" ",he.labelName]})]}),e.jsx("div",{className:"progress-bar-bg",children:e.jsx("div",{className:"progress-bar-fill",style:{width:`${Math.max(5,he.percentage)}%`}})}),e.jsxs("div",{className:"percentage-text",children:[he.percentage,"% completado"]}),e.jsx("div",{className:"footer-note",children:"No apagues la etiquetadora durante la impresión."})]})}),De&&e.jsx(Ko,{onClick:()=>ze(!1),children:e.jsxs(Zo,{onClick:t=>t.stopPropagation(),children:[e.jsxs("div",{className:"header",children:[e.jsxs("h3",{children:[e.jsx(tt,{})," Guía: ¿Cómo imprimir en Phomemo desde la PC?"]}),e.jsx("button",{onClick:()=>ze(!1),children:e.jsx(Ge,{})})]}),e.jsxs("div",{className:"body",children:[e.jsxs("div",{className:"step-box",children:[e.jsxs("div",{className:"step-title",children:[e.jsx("div",{className:"badge-number",children:"1"}),e.jsx("span",{children:"Opción A: Bluetooth Web Directo (¡Recomendado!)"})]}),e.jsxs("p",{children:[e.jsx("strong",{children:"1."})," Enciende tu etiquetadora Phomemo (M110, M120, M220, D30, etc.) y colócale el rollo de etiquetas 2x1 pulgadas (50x25mm)."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"2."})," En tu computadora con Google Chrome o Microsoft Edge, haz clic en el botón azul ",e.jsx("strong",{children:'"Conectar e Imprimir (Bluetooth)"'}),"."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"3."})," El navegador mostrará una ventana con los dispositivos Bluetooth. Elige tu Phomemo y haz clic en ",e.jsx("strong",{children:'"Vincular"'}),"."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"4."})," ¡Listo! Se imprimirán todas las etiquetas de tu lista ",e.jsx("strong",{children:"de un solo tirón"})," sin necesidad de tocar el celular ni de conectar la impresora a cada rato."]})]}),e.jsxs("div",{className:"step-box",children:[e.jsxs("div",{className:"step-title",children:[e.jsx("div",{className:"badge-number",children:"2"}),e.jsx("span",{children:"Opción B: Usar como Impresora de Windows o Cable USB"})]}),e.jsxs("p",{children:[e.jsx("strong",{children:"1."})," Si tienes instalados los drivers de Phomemo o el software ",e.jsx("em",{children:"Labelife"})," en tu computadora con Windows:"]}),e.jsxs("p",{children:[e.jsx("strong",{children:"2."})," Haz clic en el botón ",e.jsx("strong",{children:`"Diálogo PC (2x1'')"`}),"."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"3."})," En la ventana de impresión de Windows, selecciona tu impresora Phomemo y asegúrate de elegir el tamaño de papel ",e.jsx("strong",{children:"2x1 pulgadas o 50x25mm"})," con márgenes en 0."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"4."})," Presiona Imprimir y el rollo saldrá continuo de un solo tiro."]})]})]}),e.jsx("div",{className:"footer",children:e.jsx("button",{onClick:()=>ze(!1),children:"¡Entendido, volver al generador!"})})]})})]})})}):null}const wt=y.div`
  padding: 20px;
  background-color: #f8fafc;
  min-height: 100vh;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  
  @media(max-width: 640px) {
    padding: 10px;
  }
`,qt=y.div`
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  height: 60vh; opacity: 0.8; font-size: 1.1rem; color: #64748b;
  text-align: center;
`,pt=y(fo)`
  animation: ${uo`from {transform:rotate(0deg);} to {transform:rotate(360deg);}`} 0.8s linear infinite;
  font-size: 2.5rem; margin-bottom: 1.5rem; color: #3b82f6;
`,er=y(ho)`
  display: inline-flex; align-items: center; gap: 8px;
  color: #64748b; text-decoration: none; font-weight: 600; font-size: 0.95rem;
  padding: 8px 12px; margin-bottom: 1rem; border-radius: 8px;
  transition: all 0.2s;
  &:hover { color: #3b82f6; background: #eff6ff; transform: translateX(-4px); }
`,tr=y.div`
  display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  padding: 1rem 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  position: sticky; top: 10px; z-index: 40;
  border: 1px solid rgba(255,255,255,0.5);
  @media(min-width: 1024px) { flex-direction: row; justify-content: space-between; align-items: center; }
`,or=y.h1`
  font-size: 1.5rem; color: #1e293b; display: flex; align-items: center; gap: 0.75rem; margin: 0; font-weight: 800;
  svg { color: #3b82f6; }
`,rr=y.div`
  display: flex; gap: 0.75rem; flex-wrap: wrap;
`,ue=y.button`
  border: none;
  padding: 0.65rem 1.2rem; 
  border-radius: 99px;
  font-weight: 600; font-size: 0.9rem;
  cursor: pointer; display: flex; align-items: center; gap: 0.5rem; 
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  ${o=>o.primary&&`
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white;
    &:hover { box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); transform: translateY(-1px); }
  `}
  ${o=>o.secondary&&`
    background: white; color: #475569; border: 1px solid #cbd5e1;
    &:hover { border-color: #94a3b8; background: #f8fafc; color: #1e293b; }
  `}
  ${o=>o.tertiary&&`
    background: transparent; color: #64748b; border: 1px dashed #cbd5e1;
    &:hover { color: #3b82f6; border-color: #3b82f6; background: #eff6ff; }
  `}
  &:active { transform: translateY(0); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`,ar=y.div`
  display: flex; flex-direction: column; gap: 1rem; 
  background: white; padding: 1.25rem; 
  border-radius: 16px; 
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); 
  margin-bottom: 2rem;
  border: 1px solid #e2e8f0;
  @media(min-width: 1024px) { flex-direction: row; align-items: center; }
`,nr=y.div`
  position: relative; flex: 1; min-width: 250px;
`,ir=y.input`
  width: 100%; padding: 0.75rem 1rem 0.75rem 2.8rem; 
  border: 1px solid #cbd5e1; border-radius: 12px; 
  font-size: 0.95rem; background-color: #f8fafc;
  transition: all 0.2s; outline: none;
  &:focus { border-color: #3b82f6; background: white; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
`,Tt=y.button`
  width: 42px; height: 42px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: ${o=>o.$active?"#dbeafe":"#f1f5f9"};
  color: ${o=>o.$active?"#1d4ed8":"#64748b"};
  border: 1px solid ${o=>o.$active?"#bfdbfe":"transparent"};
  border-radius: 10px; cursor: pointer; transition: all 0.2s;
  &:hover { background: #e2e8f0; }
`,ce=y.select`
  padding: 0.7rem 1rem; border: 1px solid #cbd5e1; border-radius: 12px; 
  background-color: #f8fafc; color: #334155; outline: none; flex: 1;
  font-size: 0.9rem; cursor: pointer; width: 100%; box-sizing: border-box;
  &:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); background: white; }
`,sr=y.div`
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); 
  gap: 1.5rem;
  padding-bottom: 40px;
`,lr=y(ke.div)`
  background: white; border-radius: 16px; 
  overflow: hidden; 
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9; 
  display: flex; flex-direction: column; 
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  &:hover { 
    transform: translateY(-5px); 
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border-color: #e2e8f0;
  }
  .image-placeholder {
    height: 180px; background: #f8fafc; 
    display: flex; align-items: center; justify-content: center; 
    position: relative; cursor: zoom-in; border-bottom: 1px solid #f1f5f9;
    img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
    &:hover img { transform: scale(1.05); }
    .no-image-text { color: #cbd5e1; font-size: 3rem; }
    .overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.2); 
      display: flex; align-items: center; justify-content: center; 
      opacity: 0; transition: opacity 0.2s; color: white; font-size: 1.5rem; backdrop-filter: blur(2px); }
    &:hover .overlay { opacity: 1; }
  }
`,cr=y.div` padding: 1.25rem 1rem 0.5rem; `,dr=y.h3` font-size: 1.15rem; margin: 0; color: #0f172a; font-weight: 700; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; `,pr=y.div` font-size: 0.85rem; color: #64748b; font-family: monospace; letter-spacing: 0.05em; margin-top: 4px; `,xr=y.div` padding: 0.5rem 1rem 1.25rem; display: flex; flex-wrap: wrap; gap: 0.5rem; `,lt=y.div`
  background: white; border: 1px solid #e2e8f0;
  padding: 6px 10px; border-radius: 8px; 
  display: flex; flex-direction: column; align-items: flex-start; flex: 1; min-width: 80px;
  span { font-size: 0.65rem; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px; }
  strong { color: #334155; font-size: 1rem; font-weight: 700; }
`,mr=y(lt)`
  background: ${o=>o.$out?"#fef2f2":o.$low?"#fffbeb":"#f0fdf4"};
  border-color: ${o=>o.$out?"#fecaca":o.$low?"#fde68a":"#bbf7d0"};
  strong { color: ${o=>o.$out?"#b91c1c":o.$low?"#b45309":"#15803d"}; }
`,ur=y.div`
  margin-top: auto; padding: 1rem; background: #f8fafc; border-top: 1px solid #f1f5f9; display: flex; gap: 0.75rem;
`,at=y.button`
  flex: 1; padding: 0.6rem; border-radius: 10px; border: 1px solid; cursor: pointer; 
  font-size: 0.85rem; font-weight: 600; 
  display: flex; align-items: center; justify-content: center; gap: 6px;
  transition: all 0.2s;
  &.adjust { background: white; border-color: #cbd5e1; color: #475569; 
    &:hover { background: #f1f5f9; border-color: #94a3b8; color: #1e293b; } }
  &.edit { background: #f0f9ff; border-color: #bae6fd; color: #0284c7; 
    &:hover { background: #e0f2fe; border-color: #7dd3fc; color: #0369a1; } }
  &.delete { background: #fef2f2; border-color: #fecaca; color: #ef4444; 
    &:hover { background: #fee2e2; border-color: #fca5a5; color: #dc2626; } }
  &.label { background: #f5f3ff; border-color: #ddd6fe; color: #7c3aed; 
    &:hover { background: #ede9fe; border-color: #c4b5fd; color: #6d28d9; } }
`,je=y(ke.div)`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(15, 23, 42, 0.5); z-index: 50;
  display: flex; align-items: center; justify-content: center; padding: 0.75rem;
  backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
  overflow: hidden;
`,Se=y.div`
  background: white; width: 100%; max-width: ${o=>o.$large?"900px":"700px"};
  border-radius: 20px; padding: 1.75rem;
  max-height: 92vh; overflow-y: auto; overflow-x: hidden;
  box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  @media(max-width: 640px) { padding: 1.25rem; border-radius: 16px; max-width: 100%; }
`,Ne=y.h2`
  margin-top: 0; color: #0f172a; margin-bottom: 1.25rem; font-size: 1.35rem;
  display: flex; align-items: center; gap: 10px; font-weight: 800; letter-spacing: -0.02em;
`,Wt=y.div`
  background: #fef2f2; color: #991b1b; padding: 12px; border-radius: 10px;
  margin-bottom: 1.25rem; border: 1px solid #fecaca; font-size: 0.85rem; display: flex; gap: 8px; align-items: center;
`,Ht=y.div`
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.25rem;
  overflow: hidden;
  & > * { min-width: 0; }
  @media(min-width: 768px) { grid-template-columns: repeat(3, 1fr); }
  @media(max-width: 640px) { grid-template-columns: 1fr; gap: 0.75rem; }
`,E=y.div` display: flex; flex-direction: column; gap: 5px; min-width: 0; `,$=y.label` font-size: 0.82rem; font-weight: 600; color: #475569; `,R=y.input`
  width: 100%; box-sizing: border-box;
  padding: 9px 12px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 0.95rem; color: #1e293b;
  transition: all 0.2s;
  &:focus { outline: none; border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
  &:disabled { background: #f1f5f9; color: #94a3b8; }
`,Ie=y.div` display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; border-top: 1px solid #f1f5f9; padding-top: 1.25rem; flex-wrap: wrap; `,Ce=y.button`
  background: white; color: #64748b; border: 1.5px solid #e2e8f0;
  padding: 9px 18px; border-radius: 10px; font-weight: 600; cursor: pointer; font-size: 0.9rem;
  transition: all 0.2s;
  &:hover { background: #f8fafc; color: #1e293b; border-color: #cbd5e1; }
`,Ae=y.button`
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white; border: none;
  padding: 9px 22px; border-radius: 10px; font-weight: 600; cursor: pointer; font-size: 0.9rem;
  box-shadow: 0 4px 12px rgba(99,102,241,0.25);
  transition: all 0.2s;
  &:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(99,102,241,0.35); }
`,Gt=({currentImage:o,onImageChange:s})=>{const f=i.useRef(null),[u,m]=i.useState(o||null),[d,l]=i.useState(!1);i.useEffect(()=>{m(o)},[o]);const n=async h=>{const r=h.target.files[0];if(r){if(!r.type.startsWith("image/")){alert("Solo se permiten imágenes.");return}l(!0);try{const p=await g(r);m(p),s(p)}catch(p){console.error(p),alert("Error al procesar la imagen.")}finally{l(!1)}}},g=h=>new Promise((r,p)=>{const S=new FileReader;S.readAsDataURL(h),S.onload=F=>{const z=new Image;z.src=F.target.result,z.onload=()=>{const v=document.createElement("canvas"),k=500,x=k/z.width;v.width=k,v.height=z.height*x,v.getContext("2d").drawImage(z,0,0,v.width,v.height);const P=v.toDataURL("image/jpeg",.7);r(P)},z.onerror=v=>p(v)},S.onerror=F=>p(F)});return e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"10px",marginBottom:"1rem",border:"1px dashed #ccc",padding:"1rem",borderRadius:"8px"},children:[d?e.jsx(pt,{}):u?e.jsxs("div",{style:{position:"relative",width:"120px",height:"120px"},children:[e.jsx("img",{src:u,alt:"Preview",style:{width:"100%",height:"100%",objectFit:"cover",borderRadius:"8px",border:"1px solid #ddd"}}),e.jsx("button",{type:"button",onClick:h=>{h.stopPropagation(),m(null),s(null),f.current&&(f.current.value="")},style:{position:"absolute",top:"-8px",right:"-8px",background:"#dc3545",color:"white",border:"none",borderRadius:"50%",width:"24px",height:"24px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsx(Ge,{size:12})})]}):e.jsxs("div",{onClick:()=>f.current.click(),style:{cursor:"pointer",color:"#6c757d",display:"flex",flexDirection:"column",alignItems:"center"},children:[e.jsx(At,{size:32}),e.jsx("span",{style:{fontSize:"0.9rem",marginTop:"5px"},children:"Subir Foto"})]}),e.jsx("input",{type:"file",ref:f,onChange:n,accept:"image/*",style:{display:"none"}})]})},gr=({isOpen:o,productId:s,imageSrc:f,onClose:u})=>{const[m,d]=Be.useState(null),[l,n]=Be.useState(!1);return Be.useEffect(()=>{if(!o){d(null);return}if(f){d(f);return}if(!s)return;const g=localStorage.getItem("token");Pt(s,g).then(h=>d(h==null?void 0:h.imagen)).catch(()=>d(null)).finally(()=>n(!1))},[o,s,f]),o?e.jsx(je,{onClick:u,initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(ke.div,{initial:{scale:.8,opacity:0},animate:{scale:1,opacity:1},style:{position:"relative",maxWidth:"90%",maxHeight:"90vh",display:"flex",alignItems:"center",justifyContent:"center"},children:[e.jsx("button",{onClick:u,style:{position:"absolute",top:-15,right:-15,background:"white",width:30,height:30,borderRadius:"50%",border:"none",cursor:"pointer",fontWeight:"bold",zIndex:1},children:"X"}),l?e.jsxs("div",{style:{background:"white",borderRadius:"12px",padding:"3rem 4rem",display:"flex",flexDirection:"column",alignItems:"center",gap:"1rem",color:"#64748b"},children:[e.jsx(pt,{}),e.jsx("span",{style:{fontSize:"0.95rem",fontWeight:600},children:"Cargando imagen, espere por favor..."})]}):m?e.jsx("img",{src:m,alt:"Vista completa",style:{maxWidth:"100%",maxHeight:"80vh",borderRadius:"8px",boxShadow:"0 5px 20px rgba(0,0,0,0.5)"}}):e.jsxs("div",{style:{background:"white",borderRadius:"12px",padding:"3rem 4rem",color:"#94a3b8",textAlign:"center"},children:[e.jsx(At,{size:48,style:{marginBottom:"1rem"}}),e.jsx("p",{style:{margin:0},children:"Este producto no tiene imagen."})]})]})}):null},He=o=>String(o||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),fr=o=>{const[s,f]=Be.useState(()=>{const m=it(o);return m&&m!=="loading"&&m!=="none"?m:null}),u=Be.useRef(null);return Be.useEffect(()=>{const m=it(o);if(m&&m!=="loading"){f(m!=="none"?m:null);return}const d=u.current;if(!d)return;const l=new IntersectionObserver(n=>{if(n[0].isIntersecting){if(l.disconnect(),it(o)==="loading")return;st(o,"loading");const g=localStorage.getItem("token");Pt(o,g).then(h=>{const r=(h==null?void 0:h.imagen)||null;st(o,r||"none"),f(r||null)}).catch(()=>{st(o,"none"),f(null)})}},{rootMargin:"200px"});return l.observe(d),()=>l.disconnect()},[o]),{imgSrc:s,cardRef:u}},Ct=50,hr=500,br=({productId:o,productName:s,onViewFull:f})=>{const{imgSrc:u,cardRef:m}=fr(o);return e.jsx("div",{ref:m,className:"image-placeholder",onClick:()=>f(u),style:{cursor:"zoom-in"},children:u?e.jsxs(e.Fragment,{children:[e.jsx("img",{src:u,alt:s}),e.jsx("div",{className:"overlay",children:e.jsx(go,{})})]}):e.jsx("div",{className:"no-image-text",children:e.jsx(At,{})})})},yr=({isOpen:o,onClose:s,title:f,message:u})=>o?e.jsx(je,{onClick:s,initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(Se,{as:"div",onClick:m=>m.stopPropagation(),style:{maxWidth:"400px",textAlign:"center"},children:[e.jsx(Ne,{children:f}),e.jsx("p",{style:{color:"#4a5568",marginBottom:"20px"},children:u}),e.jsx(Ae,{onClick:s,style:{width:"100%"},children:"Aceptar"})]})}):null,Lt=({open:o,onCancel:s,onConfirm:f,title:u,message:m,confirmLabel:d,danger:l})=>o?e.jsx(je,{onClick:s,initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(Se,{as:"div",onClick:n=>n.stopPropagation(),style:{maxWidth:"450px"},children:[e.jsx(Ne,{style:{color:l?"#e53e3e":"#2d3748"},children:u}),e.jsx("div",{style:{marginBottom:"25px",color:"#4a5568"},children:m}),e.jsxs(Ie,{children:[e.jsx(Ce,{onClick:s,children:"Cancelar"}),e.jsx(Ae,{onClick:f,style:{background:l?"#e53e3e":"#3b82f6"},children:d||"Confirmar"})]})]})}):null,Ot=({title:o,items:s,onAdd:f,onDelete:u,onClose:m})=>{const[d,l]=i.useState(""),n=g=>{g.preventDefault(),d.trim()&&(f(d),l(""))};return e.jsx(je,{onClick:m,children:e.jsxs(Se,{onClick:g=>g.stopPropagation(),children:[e.jsx(Ne,{children:o}),e.jsxs("form",{onSubmit:n,style:{display:"flex",gap:"10px",marginBottom:"20px"},children:[e.jsx(R,{value:d,onChange:g=>l(g.target.value),placeholder:"Nuevo nombre...",style:{flex:1}}),e.jsxs(Ae,{type:"submit",children:[e.jsx(dt,{})," Agregar"]})]}),e.jsxs("div",{style:{maxHeight:"300px",overflowY:"auto",display:"flex",flexDirection:"column",gap:"8px"},children:[(Array.isArray(s)?s:[]).map((g,h)=>{const r=g.id_categoria||g.id_proveedor||h,p=g.nombre;return e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",padding:"10px",background:"#f7fafc",borderRadius:"8px",alignItems:"center"},children:[e.jsx("span",{children:p}),e.jsx("button",{onClick:()=>u(r),style:{color:"#e53e3e",background:"none",border:"none",cursor:"pointer"},children:e.jsx(Nt,{})})]},r)}),(!Array.isArray(s)||s.length===0)&&e.jsx("p",{style:{textAlign:"center",color:"#a0aec0"},children:"No hay elementos registrados."})]}),e.jsx(Ie,{children:e.jsx(Ce,{onClick:m,children:"Cerrar"})})]})})},jr=({isOpen:o,product:s,onClose:f,onConfirm:u})=>{const[m,d]=i.useState(""),[l,n]=i.useState(""),[g,h]=i.useState("");if(!o||!s)return null;const r=p=>{const S=p.target.value;h(S),n(S||"")};return e.jsx(je,{onClick:f,children:e.jsxs(Se,{onClick:p=>p.stopPropagation(),style:{maxWidth:"400px"},children:[e.jsxs(Ne,{children:["Ajustar Stock: ",s.nombre]}),e.jsx("div",{style:{marginBottom:"15px"},children:e.jsxs("p",{children:[e.jsx("strong",{children:"Stock Actual:"})," ",s.existencia]})}),e.jsxs(E,{style:{marginBottom:"15px"},children:[e.jsx($,{children:"Cantidad (Positivo para agregar, Negativo para restar)"}),e.jsx(R,{type:"number",value:m,onChange:p=>d(p.target.value),placeholder:"Ej: 10 o -5",autoFocus:!0})]}),e.jsxs(E,{style:{marginBottom:"10px"},children:[e.jsx($,{children:"Razón (Seleccionar)"}),e.jsxs(ce,{value:g,onChange:r,children:[e.jsx("option",{value:"",children:"-- Escribir manualmente --"}),e.jsx("option",{value:"Compra",children:"Compra / Resurtido"}),e.jsx("option",{value:"Ajuste Inventario",children:"Ajuste de Inventario"}),e.jsx("option",{value:"Devolución",children:"Devolución Cliente"}),e.jsx("option",{value:"Dañado",children:"Producto Dañado/Merma"}),e.jsx("option",{value:"Uso Interno",children:"Uso Interno"})]})]}),e.jsxs(E,{style:{marginBottom:"20px"},children:[e.jsx($,{children:"Razón (Manual)"}),e.jsx(R,{type:"text",value:l,onChange:p=>{n(p.target.value),h("")},placeholder:"Especifique el motivo..."})]}),e.jsxs(Ie,{children:[e.jsx(Ce,{onClick:f,children:"Cancelar"}),e.jsx(Ae,{onClick:()=>{const p=parseInt(m,10);!isNaN(p)&&p!==0&&l.trim()?u(s,p,l):alert("Debe ingresar una cantidad válida y una razón.")},children:"Aplicar Ajuste"})]})]})})},vr=({onClose:o})=>{const[s,f]=i.useState([]),[u,m]=i.useState(!0),[d,l]=i.useState(""),[n,g]=i.useState(""),[h,r]=i.useState(""),[p,S]=i.useState(""),F=i.useCallback(async()=>{var v;m(!0),l("");try{const k=localStorage.getItem("token"),x=new URLSearchParams;n&&x.append("startDate",n),h&&x.append("endDate",h),p&&x.append("search",p);const j=await X.get(`/api/products/inventory/history?${x.toString()}`,{headers:{Authorization:`Bearer ${k}`}});f(Array.isArray(j.data)?j.data:Array.isArray((v=j.data)==null?void 0:v.history)?j.data.history:[])}catch(k){console.error(k),l("No se pudo cargar el historial.")}finally{m(!1)}},[n,h,p]);i.useEffect(()=>{F()},[F]);const z=()=>{g(""),r(""),S("")};return e.jsx(je,{onClick:o,initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(Se,{onClick:v=>v.stopPropagation(),$large:!0,children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"},children:[e.jsxs(Ne,{style:{margin:0},children:[e.jsx(Ut,{})," Historial de Movimientos"]}),e.jsx("button",{onClick:o,style:{border:"none",background:"transparent",fontSize:"1.2rem",cursor:"pointer"},children:e.jsx(Ge,{})})]}),e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:"1rem",marginBottom:"1.5rem",background:"#f8fafc",padding:"1rem",borderRadius:"12px",border:"1px solid #e2e8f0"},children:[e.jsxs(E,{style:{flex:"1 1 200px"},children:[e.jsx($,{children:"Buscar por Código/Nombre"}),e.jsxs("div",{style:{position:"relative"},children:[e.jsx(ct,{style:{position:"absolute",left:"10px",top:"50%",transform:"translateY(-50%)",color:"#94a3b8"}}),e.jsx(R,{type:"text",placeholder:"Buscar...",value:p,onChange:v=>S(v.target.value),style:{paddingLeft:"32px"}})]})]}),e.jsxs(E,{style:{flex:"1 1 150px"},children:[e.jsx($,{children:"Fecha Inicio"}),e.jsx(R,{type:"date",value:n,onChange:v=>g(v.target.value)})]}),e.jsxs(E,{style:{flex:"1 1 150px"},children:[e.jsx($,{children:"Fecha Fin"}),e.jsx(R,{type:"date",value:h,onChange:v=>r(v.target.value)})]}),e.jsxs("div",{style:{display:"flex",alignItems:"flex-end",gap:"0.5rem"},children:[e.jsxs(Ae,{type:"button",onClick:F,style:{height:"42px",display:"flex",alignItems:"center",gap:"8px"},children:[e.jsx(ct,{})," Filtrar"]}),e.jsx(Ce,{type:"button",onClick:z,style:{height:"42px"},children:"Limpiar"})]})]}),u?e.jsx("div",{style:{textAlign:"center",padding:"2rem"},children:e.jsx(pt,{})}):d?e.jsx("div",{style:{color:"red",textAlign:"center"},children:d}):e.jsx("div",{style:{overflowX:"auto",maxHeight:"400px"},children:e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",fontSize:"0.9rem"},children:[e.jsx("thead",{style:{position:"sticky",top:0,zIndex:10},children:e.jsxs("tr",{style:{background:"#f7fafc",borderBottom:"2px solid #e2e8f0",textAlign:"left"},children:[e.jsx("th",{style:{padding:"10px"},children:"Fecha"}),e.jsx("th",{style:{padding:"10px"},children:"Producto"}),e.jsx("th",{style:{padding:"10px"},children:"Movimiento"}),e.jsx("th",{style:{padding:"10px"},children:"Detalles"}),e.jsx("th",{style:{padding:"10px"},children:"Usuario"})]})}),e.jsxs("tbody",{children:[(Array.isArray(s)?s:[]).map(v=>e.jsxs("tr",{style:{borderBottom:"1px solid #edf2f7"},children:[e.jsx("td",{style:{padding:"10px"},children:new Date(v.fecha).toLocaleString()}),e.jsx("td",{style:{padding:"10px",fontWeight:"600"},children:v.nombre_producto||v.codigo_producto||"N/A"}),e.jsx("td",{style:{padding:"10px"},children:e.jsx("span",{style:{padding:"2px 6px",borderRadius:"4px",fontSize:"0.8rem",fontWeight:"bold",background:v.tipo_movimiento==="VENTA"?"#c6f6d5":v.tipo_movimiento==="CREACION"?"#bee3f8":"#fed7d7",color:v.tipo_movimiento==="VENTA"?"#22543d":v.tipo_movimiento==="CREACION"?"#2b6cb0":"#822727"},children:v.tipo_movimiento})}),e.jsx("td",{style:{padding:"10px",color:"#4a5568"},children:v.detalles}),e.jsx("td",{style:{padding:"10px",color:"#718096"},children:v.nombre_usuario||"Sistema"})]},v.id_movimiento)),(!Array.isArray(s)||s.length===0)&&e.jsx("tr",{children:e.jsx("td",{colSpan:"5",style:{textAlign:"center",padding:"20px"},children:"No hay movimientos registrados para estos filtros."})})]})]})}),e.jsx(Ie,{children:e.jsx(Ce,{onClick:o,children:"Cerrar"})})]})})},wr=({isOpen:o,onClose:s,onSave:f,categories:u,providers:m,allProductsRaw:d})=>{const[l,n]=i.useState({codigo:"",nombre:"",costo:"",venta:"",mayoreo:"",id_categoria:"",existencia:"",minimo:"",maximo:"",tipo_venta:"Unidad",id_proveedor:"",descripcion:"",imagen:null}),[g,h]=i.useState(""),[r,p]=i.useState(""),S=k=>{const{name:x,value:j}=k.target,P={...l,[x]:j};if(x==="costo"||x==="venta"){const O=parseFloat(P.costo),L=parseFloat(P.venta);h(O>0&&L>0?((L-O)/O*100).toFixed(2):"")}n(P),p("")},F=k=>n(x=>({...x,imagen:k})),z=k=>{const x=k.target.value;h(x);const j=parseFloat(l.costo);j>0&&x&&n(P=>({...P,venta:(j*(1+parseFloat(x)/100)).toFixed(2)}))},v=k=>{k.preventDefault(),p("");const x=l;if(["codigo","nombre","costo","venta","existencia"].some(q=>!x[q]||!String(x[q]).trim())){p("Código, Nombre, Costo, Venta y Existencia son obligatorios.");return}const P=parseFloat(x.costo),O=parseFloat(x.venta),L=x.mayoreo?parseFloat(x.mayoreo):null,G=parseInt(x.existencia,10);if(x.minimo&&parseInt(x.minimo,10),x.maximo&&parseInt(x.maximo,10),[P,O,G].some(isNaN)){p("Costo, Venta y Existencia deben ser números válidos.");return}if(x.mayoreo&&isNaN(L)){p("Precio Mayoreo debe ser un número válido o estar vacío.");return}if(P<0||O<0||G<0){p("Precios y cantidades no pueden ser negativos.");return}if(O<P){p("El precio de venta no puede ser menor que el costo.");return}const de=(Array.isArray(d)?d:[]).find(q=>{var pe,W;return((pe=q.codigo)==null?void 0:pe.toLowerCase())===x.codigo.trim().toLowerCase()||((W=q.nombre)==null?void 0:W.toLowerCase())===x.nombre.trim().toLowerCase()});if(de){(de.codigo||"").toLowerCase()===x.codigo.trim().toLowerCase()?p(`Ya existe un producto con el código "${x.codigo}".`):p(`Ya existe un producto con el nombre "${x.nombre}".`);return}f({...x,mayoreo:x.mayoreo||null,minimo:x.minimo||null,maximo:x.maximo||null,id_categoria:x.id_categoria||null,id_proveedor:x.id_proveedor||null})};return o?e.jsx(je,{onClick:s,initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsx(ke.div,{initial:{y:-50,opacity:0},animate:{y:0,opacity:1},exit:{y:50,opacity:0},style:{width:"100%",maxWidth:"700px"},children:e.jsx(Se,{as:"div",onClick:k=>k.stopPropagation(),children:e.jsxs("form",{onSubmit:v,children:[e.jsx(Ne,{children:"Crear Nuevo Producto"}),r&&e.jsx(Wt,{children:r}),e.jsx(Gt,{currentImage:l.imagen,onImageChange:F}),e.jsxs(Ht,{children:[e.jsxs(E,{children:[e.jsx($,{children:"Código"}),e.jsx(R,{name:"codigo",value:l.codigo,onChange:S,required:!0})]}),e.jsxs(E,{children:[e.jsx($,{children:"Nombre"}),e.jsx(R,{name:"nombre",value:l.nombre,onChange:S,required:!0})]}),e.jsxs(E,{children:[e.jsx($,{children:"Costo (C$)"}),e.jsx(R,{type:"number",step:"0.01",name:"costo",value:l.costo,onChange:S,required:!0})]}),e.jsxs(E,{children:[e.jsx($,{children:"% Ganancia"}),e.jsx(R,{type:"number",step:"0.01",value:g,onChange:z,placeholder:"ej: 50"})]}),e.jsxs(E,{children:[e.jsx($,{children:"Precio Venta (C$)"}),e.jsx(R,{type:"number",step:"0.01",name:"venta",value:l.venta,onChange:S,required:!0})]}),e.jsxs(E,{children:[e.jsx($,{children:"Precio Mayoreo (C$)"}),e.jsx(R,{type:"number",step:"0.01",name:"mayoreo",value:l.mayoreo,onChange:S})]}),e.jsxs(E,{children:[e.jsx($,{children:"Existencia Inicial"}),e.jsx(R,{type:"number",inputMode:"numeric",pattern:"[0-9]*",name:"existencia",value:l.existencia,onChange:S,required:!0})]}),e.jsxs(E,{children:[e.jsx($,{children:"Stock Mínimo"}),e.jsx(R,{type:"number",inputMode:"numeric",pattern:"[0-9]*",name:"minimo",value:l.minimo,onChange:S})]}),e.jsxs(E,{children:[e.jsx($,{children:"Stock Máximo"}),e.jsx(R,{type:"number",inputMode:"numeric",pattern:"[0-9]*",name:"maximo",value:l.maximo,onChange:S})]}),e.jsxs(E,{children:[e.jsx($,{children:"Descripción"}),e.jsx(R,{name:"descripcion",value:l.descripcion,onChange:S,placeholder:"Detalles del producto"})]}),e.jsxs(E,{children:[e.jsx($,{children:"Categoría"}),e.jsxs(ce,{name:"id_categoria",value:l.id_categoria,onChange:S,children:[e.jsx("option",{value:"",children:"-- Sin Categoría --"}),(Array.isArray(u)?u:[]).map(k=>e.jsx("option",{value:k.id_categoria,children:k.nombre},k.id_categoria))]})]}),e.jsxs(E,{children:[e.jsx($,{children:"Proveedor"}),e.jsxs(ce,{name:"id_proveedor",value:l.id_proveedor,onChange:S,children:[e.jsx("option",{value:"",children:"-- Sin Proveedor --"}),(Array.isArray(m)?m:[]).map(k=>e.jsx("option",{value:k.id_proveedor,children:k.nombre},k.id_proveedor))]})]}),e.jsxs(E,{children:[e.jsx($,{children:"Tipo de Venta"}),e.jsxs(ce,{name:"tipo_venta",value:l.tipo_venta,onChange:S,children:[e.jsx("option",{value:"Unidad",children:"Unidad"}),e.jsx("option",{value:"Juego",children:"Juego"}),e.jsx("option",{value:"Kit",children:"Kit"})]})]})]}),e.jsxs(Ie,{children:[e.jsx(Ce,{type:"button",onClick:s,children:"Cancelar"}),e.jsx(Ae,{type:"submit",children:"Crear Producto"})]})]})})})}):null},Cr=({isOpen:o,onClose:s,onSave:f,productToEdit:u,categories:m,providers:d,allProductsRaw:l})=>{const[n,g]=i.useState({}),[h,r]=i.useState(""),[p,S]=i.useState("");i.useEffect(()=>{if(u){g({...u,mayoreo:u.mayoreo??"",minimo:u.minimo??"",maximo:u.maximo??"",id_categoria:u.id_categoria??"",id_proveedor:u.id_proveedor??"",descripcion:u.descripcion??"",imagen:u.imagen??null});const x=parseFloat(u.costo),j=parseFloat(u.venta);r(x>0&&j>0?((j-x)/x*100).toFixed(2):""),S("")}},[u]);const F=x=>{const{name:j,value:P}=x.target;if(j==="existencia")return;const O={...n,[j]:P};if(j==="costo"||j==="venta"){const L=parseFloat(O.costo),G=parseFloat(O.venta);r(L>0&&G>0?((G-L)/L*100).toFixed(2):"")}g(O),S("")},z=x=>g(j=>({...j,imagen:x})),v=x=>{const j=x.target.value;r(j);const P=parseFloat(n.costo);P>0&&j&&g(O=>({...O,venta:(P*(1+parseFloat(j)/100)).toFixed(2)}))},k=x=>{x.preventDefault(),S("");const j=n;if(!j.codigo||!j.nombre||!j.costo||!j.venta){S("Código, Nombre, Costo y Venta son obligatorios.");return}if(parseFloat(j.venta)<parseFloat(j.costo)){S("El precio de venta no puede ser menor que el costo.");return}if(l.find(G=>{var ie,de;return G.id_producto!==u.id_producto&&(((ie=G.codigo)==null?void 0:ie.toLowerCase())===j.codigo.trim().toLowerCase()||((de=G.nombre)==null?void 0:de.toLowerCase())===j.nombre.trim().toLowerCase())})){S("Ya existe otro producto con ese código o nombre.");return}const{existencia:O,...L}={...j,mayoreo:j.mayoreo||null,minimo:j.minimo||null,maximo:j.maximo||null,id_categoria:j.id_categoria||null,id_proveedor:j.id_proveedor||null};f(L,u.id_producto)};return!o||!u?null:e.jsx(je,{onClick:s,initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsx(ke.div,{initial:{y:-50,opacity:0},animate:{y:0,opacity:1},exit:{y:50,opacity:0},style:{width:"100%",maxWidth:"550px"},children:e.jsx(Se,{as:"div",onClick:x=>x.stopPropagation(),children:e.jsxs("form",{onSubmit:k,children:[e.jsx(Ne,{children:"Editar Producto"}),p&&e.jsx(Wt,{children:p}),e.jsx(Gt,{currentImage:n.imagen,onImageChange:z}),e.jsxs(Ht,{children:[e.jsxs(E,{children:[e.jsx($,{children:"Código"}),e.jsx(R,{name:"codigo",value:n.codigo||"",onChange:F,required:!0})]}),e.jsxs(E,{children:[e.jsx($,{children:"Nombre"}),e.jsx(R,{name:"nombre",value:n.nombre||"",onChange:F,required:!0})]}),e.jsxs(E,{children:[e.jsx($,{children:"Costo (C$)"}),e.jsx(R,{type:"number",step:"0.01",name:"costo",value:n.costo||"",onChange:F,required:!0})]}),e.jsxs(E,{children:[e.jsx($,{children:"% Ganancia"}),e.jsx(R,{type:"number",step:"0.01",value:h||"",onChange:v,placeholder:"ej: 50"})]}),e.jsxs(E,{children:[e.jsx($,{children:"Precio Venta (C$)"}),e.jsx(R,{type:"number",step:"0.01",name:"venta",value:n.venta||"",onChange:F,required:!0})]}),e.jsxs(E,{children:[e.jsx($,{children:"Precio Mayoreo (C$)"}),e.jsx(R,{type:"number",step:"0.01",name:"mayoreo",value:n.mayoreo||"",onChange:F})]}),e.jsxs(E,{children:[e.jsx($,{children:"Existencia"}),e.jsx(R,{name:"existencia",value:n.existencia||"",disabled:!0,style:{backgroundColor:"#f0f0f0"}}),e.jsx("small",{style:{marginTop:"5px",color:"#dc3545",fontWeight:"bold"},children:"¡Ajustar solo con el botón de stock!"})]}),e.jsxs(E,{children:[e.jsx($,{children:"Stock Mínimo"}),e.jsx(R,{type:"number",inputMode:"numeric",pattern:"[0-9]*",name:"minimo",value:n.minimo||"",onChange:F})]}),e.jsxs(E,{children:[e.jsx($,{children:"Stock Máximo"}),e.jsx(R,{type:"number",inputMode:"numeric",pattern:"[0-9]*",name:"maximo",value:n.maximo||"",onChange:F})]}),e.jsxs(E,{children:[e.jsx($,{children:"Descripción"}),e.jsx(R,{name:"descripcion",value:n.descripcion||"",onChange:F,placeholder:"Detalles del producto"})]}),e.jsxs(E,{children:[e.jsx($,{children:"Categoría"}),e.jsxs(ce,{name:"id_categoria",value:n.id_categoria||"",onChange:F,children:[e.jsx("option",{value:"",children:"-- Sin Categoría --"}),(Array.isArray(m)?m:[]).map(x=>e.jsx("option",{value:x.id_categoria,children:x.nombre},x.id_categoria))]})]}),e.jsxs(E,{children:[e.jsx($,{children:"Proveedor"}),e.jsxs(ce,{name:"id_proveedor",value:n.id_proveedor||"",onChange:F,children:[e.jsx("option",{value:"",children:"-- Sin Proveedor --"}),(Array.isArray(d)?d:[]).map(x=>e.jsx("option",{value:x.id_proveedor,children:x.nombre},x.id_proveedor))]})]}),e.jsxs(E,{children:[e.jsx($,{children:"Tipo de Venta"}),e.jsxs(ce,{name:"tipo_venta",value:n.tipo_venta||"Unidad",onChange:F,children:[e.jsx("option",{value:"Unidad",children:"Unidad"}),e.jsx("option",{value:"Juego",children:"Juego"}),e.jsx("option",{value:"Kit",children:"Kit"})]})]})]}),e.jsxs(Ie,{children:[e.jsx(Ce,{type:"button",onClick:s,children:"Cancelar"}),e.jsx(Ae,{type:"submit",children:"Guardar Cambios"})]})]})})})})},_r=()=>{var U,Z,le;const{globalReservations:o,socket:s}=bo(),[f,u]=i.useState([]),[m,d]=i.useState([]),[l,n]=i.useState([]),[g,h]=i.useState([]),[r,p]=i.useState(!1),[S,F]=i.useState(""),[z,v]=i.useState("description"),[k,x]=i.useState("name-asc"),j=i.useDeferredValue(S),P=i.useRef(null),[O,L]=i.useState(""),[G,ie]=i.useState(""),[de,q]=i.useState(null),pe=i.useMemo(()=>new Audio("/sounds/success.mp3"),[]),W=i.useMemo(()=>new Audio("/sounds/error.mp3"),[]),[Qe,J]=i.useState(!1),[Ye,oe]=i.useState(!1),[Pe,Je]=i.useState(null),[ge,_e]=i.useState(!1),[K,fe]=i.useState(null),[re,Ke]=i.useState(!1),[ve,Fe]=i.useState(!1),[Ze,he]=i.useState(!1),[Re,De]=i.useState(!1),[ze,Ee]=i.useState(null),[qe,Te]=i.useState({isOpen:!1,product:null}),[Le,Oe]=i.useState({isOpen:!1,title:"",message:""}),[xe,se]=i.useState({open:!1,product:null,detail:null}),[A,ae]=i.useState(1),[$e,Ue]=i.useState({isOpen:!1,imageUrl:null});i.useEffect(()=>{ae(1)},[j,O,G,z,k]),i.useEffect(()=>{window.scrollTo({top:0,behavior:"smooth"})},[A]);const Q=i.useCallback(({title:a,message:w,type:c})=>Oe({isOpen:!0,title:a,message:w,type:c}),[]),Xe=()=>Oe({isOpen:!1}),et=i.useCallback(async()=>{const a=localStorage.getItem("token"),c=(await X.get(`${ee}/products`,{headers:{Authorization:`Bearer ${a}`}})).data;if(Array.isArray(c))return c;if(c&&Array.isArray(c.products))return c.products;if(c&&Array.isArray(c.data))return c.data;if(c&&Array.isArray(c.items))return c.items;if(c&&(c.msg||c.message||c.error))throw new Error(c.msg||c.message||c.error);return[]},[]),Y=i.useCallback(async()=>{var a,w,c,C,I,V,We,yt;try{q(null);const M=localStorage.getItem("token"),[H,be,ye]=await Promise.all([et(),X.get(`${ee}/categories`,{headers:{Authorization:`Bearer ${M}`}}),X.get(`${ee}/providers`,{headers:{Authorization:`Bearer ${M}`}})]),_t=Array.isArray(H)?H:[];u(_t);const Qt=_t.map(me=>{if(!me||typeof me!="object")return null;const Ft=me.nombre??"",zt=me.codigo??"",Yt=me.descripcion??"",Jt=`${He(Ft)}|${He(zt)}|${He(Yt)}`,Kt=[He(Ft),He(zt)],Et=Number(me.costo||0),Zt=Number(me.venta||0),Xt=Number(me.existencia||0);return{...me,__fmt:{costo:`C$${Et.toFixed(2)}`,venta:`C$${Zt.toFixed(2)}`,costoTotal:`C$${(Et*Xt).toFixed(2)}`},q:Jt,qStarts:Kt}}).filter(Boolean);d(Qt),n(Array.isArray(be==null?void 0:be.data)?be.data:Array.isArray((a=be==null?void 0:be.data)==null?void 0:a.categories)?be.data.categories:[]),h(Array.isArray(ye==null?void 0:ye.data)?ye.data:Array.isArray((w=ye==null?void 0:ye.data)==null?void 0:w.providers)?ye.data.providers:[]),q(null)}catch(M){if(console.error("InventoryManagement fetchData error:",M),((c=M==null?void 0:M.response)==null?void 0:c.status)===401||((C=M==null?void 0:M.response)==null?void 0:C.status)===403)q("Tu sesión ha expirado o no es válida. Por favor inicia sesión nuevamente.");else{let H=((V=(I=M==null?void 0:M.response)==null?void 0:I.data)==null?void 0:V.msg)||((yt=(We=M==null?void 0:M.response)==null?void 0:We.data)==null?void 0:yt.message)||(M==null?void 0:M.message);(!H||typeof H!="string"||H.includes("is not a function")||H.includes("Cannot read properties")||H.includes("undefined"))&&(H="Error al cargar los datos del inventario. Por favor, verifica tu conexión e intenta de nuevo."),q(H)}}finally{p(!0)}},[et]);i.useEffect(()=>{Y()},[Y]),i.useEffect(()=>{if(!s)return;const a=()=>{Y()};return s.on("inventory_update",a),s.on("products:update",a),()=>{s.off("inventory_update",a),s.off("products:update",a)}},[s,Y]);const{filtered:we,totalFilteredCount:Ve}=i.useMemo(()=>{const a=z==="code",w=String(O||""),c=String(G||"");let C=Array.isArray(m)?m:[];w&&(C=C.filter(M=>String(M.id_categoria)===w)),c&&(C=C.filter(M=>String(M.id_proveedor)===c));let I=jo(C,j,a?["codigo","codigo_barras"]:["nombre","codigo","descripcion"],{strict:a});j||I.sort((M,H)=>{switch(k){case"name-asc":return(M.nombre||"").localeCompare(H.nombre||"");case"name-desc":return(H.nombre||"").localeCompare(M.nombre||"");case"stock-asc":return(M.existencia||0)-(H.existencia||0);case"stock-desc":return(H.existencia||0)-(M.existencia||0);case"price-asc":return(M.venta||0)-(H.venta||0);case"price-desc":return(H.venta||0)-(M.venta||0);default:return 0}});const V=I.length,We=(A-1)*Ct;return{filtered:I.slice(We,We+Ct),totalFilteredCount:V}},[m,j,O,G,A,z,k]),xt=()=>J(!0),mt=async a=>{let w=null;const c=it(a.id_producto);if(c&&c!=="loading"&&c!=="none")w=c;else if(c!=="none")try{const C=localStorage.getItem("token"),I=await Pt(a.id_producto,C);w=(I==null?void 0:I.imagen)||null,st(a.id_producto,w||"none")}catch{}Je({...a,imagen:w}),oe(!0)},ut=a=>{fe(a),_e(!0)},gt=async a=>{var w,c;try{console.log("CLIENT SENDING CREATE PAYLOAD:",{...a,imagenLength:a.imagen?a.imagen.length:"NULL"});const C=localStorage.getItem("token");await X.post(`${ee}/products`,a,{headers:{Authorization:`Bearer ${C}`}}),J(!1),pe.currentTime=0,pe.play().catch(I=>console.warn(I)),Q({title:"✅ Éxito",message:"Producto creado correctamente."}),await Y()}catch(C){console.error("CLIENT CREATE ERROR:",C),W.currentTime=0,W.play().catch(I=>console.warn(I)),Q({title:"❌ Error",message:((c=(w=C.response)==null?void 0:w.data)==null?void 0:c.msg)||"Error al crear el producto.",type:"error"})}},ft=async(a,w)=>{var c,C;try{console.log("CLIENT SENDING UPDATE PAYLOAD:",{...a,imagenLength:a.imagen?a.imagen.length:"NULL"});const I=localStorage.getItem("token");await X.put(`${ee}/products/${w}`,a,{headers:{Authorization:`Bearer ${I}`}}),oe(!1),yo(w),pe.currentTime=0,pe.play().catch(V=>console.warn(V)),Q({title:"✅ Éxito",message:"Producto actualizado correctamente."}),await Y()}catch(I){console.error("CLIENT UPDATE ERROR:",I),W.currentTime=0,W.play().catch(V=>console.warn(V)),Q({title:"❌ Error",message:((C=(c=I.response)==null?void 0:c.data)==null?void 0:C.msg)||"Error al actualizar el producto.",type:"error"})}},ht=async()=>{var a;if(K)try{const w=localStorage.getItem("token");await X.delete(`${ee}/products/${K.id_producto}`,{headers:{Authorization:`Bearer ${w}`}}),await Y(),_e(!1),fe(null),Q({title:"Éxito",message:`El producto ${K.nombre} fue eliminado.`})}catch(w){const c=(a=w==null?void 0:w.response)==null?void 0:a.data,C=(c==null?void 0:c.msg)||"No se pudo eliminar el producto.";Q({title:"Error",message:C,type:"error"}),c!=null&&c.reasons&&se({open:!0,product:K,detail:c.reasons})}},bt=async a=>{var w,c;try{const C=localStorage.getItem("token");await X.patch(`${ee}/products/${a.id_producto}/archive`,{},{headers:{Authorization:`Bearer ${C}`}}),se({open:!1,product:null,detail:null}),_e(!1),fe(null),await Y(),Q({title:"Archivado",message:`"${a.nombre}" fue archivado (inactivo).`})}catch(C){Q({title:"Error",message:((c=(w=C==null?void 0:C.response)==null?void 0:w.data)==null?void 0:c.msg)||"No se pudo archivar el producto.",type:"error"})}},t=async(a,w,c)=>{var C,I;try{const V=localStorage.getItem("token");await X.patch(`${ee}/products/${a.id_producto}/stock`,{cantidad:w,razon:c},{headers:{Authorization:`Bearer ${V}`}}),Te({isOpen:!1,product:null}),Q({title:"Éxito",message:"Stock actualizado correctamente."}),await Y()}catch(V){Q({title:"Error",message:((I=(C=V.response)==null?void 0:C.data)==null?void 0:I.msg)||"No se pudo ajustar el stock."})}},N=async a=>{var w,c;try{const C=localStorage.getItem("token");await X.post(`${ee}/categories`,{nombre:a},{headers:{Authorization:`Bearer ${C}`}}),await Y()}catch(C){Q({title:"Error",message:((c=(w=C.response)==null?void 0:w.data)==null?void 0:c.msg)||"No se pudo agregar la categoría."})}},b=async a=>{var w,c;try{const C=localStorage.getItem("token");await X.delete(`${ee}/categories/${a}`,{headers:{Authorization:`Bearer ${C}`}}),await Y()}catch(C){Q({title:"Error",message:((c=(w=C.response)==null?void 0:w.data)==null?void 0:c.msg)||"No se pudo eliminar la categoría. (Verifique que no esté en uso)"})}},_=async a=>{var w,c;try{const C=localStorage.getItem("token");await X.post(`${ee}/providers`,{nombre:a},{headers:{Authorization:`Bearer ${C}`}}),await Y()}catch(C){Q({title:"Error",message:((c=(w=C.response)==null?void 0:w.data)==null?void 0:c.msg)||"No se pudo agregar el proveedor."})}},B=async a=>{var w,c;try{const C=localStorage.getItem("token");await X.delete(`${ee}/providers/${a}`,{headers:{Authorization:`Bearer ${C}`}}),await Y()}catch(C){Q({title:"Error",message:((c=(w=C.response)==null?void 0:w.data)==null?void 0:c.msg)||"No se pudo eliminar el proveedor. (Verifique que no esté en uso)"})}};if(!r)return e.jsx(wt,{children:e.jsxs(qt,{children:[e.jsx(pt,{}),e.jsx("p",{children:"Cargando Inventario..."})]})});if(de)return e.jsx(wt,{children:e.jsxs(qt,{style:{color:"#c53030"},children:[e.jsx(io,{style:{fontSize:"2.5rem",marginBottom:"1rem",color:"#e53e3e"}}),e.jsx("p",{style:{marginBottom:"0.5rem",fontWeight:600,fontSize:"1.1rem"},children:de}),e.jsx("p",{style:{color:"#718096",fontSize:"0.9rem",marginBottom:"1.5rem"},children:"Verifica tu conexión a internet e intenta nuevamente."}),e.jsx(ue,{primary:!0,onClick:()=>{p(!1),q(null),Y()},children:"Reintentar"})]})});const T=we.length<=hr,D=Math.ceil(Ve/Ct);return e.jsxs(wt,{children:[e.jsxs(er,{to:"/dashboard",children:[e.jsx(St,{})," Volver al Dashboard"]}),e.jsxs(tr,{children:[e.jsxs(or,{children:[e.jsx(so,{})," Gestión de Inventario"]}),e.jsxs(rr,{children:[e.jsxs(ue,{primary:!0,onClick:xt,children:[e.jsx(dt,{})," Crear Producto"]}),e.jsxs(ue,{secondary:!0,onClick:()=>{Ee(null),De(!0)},title:"Generador de Etiquetas / QR en Hoja A4",children:[e.jsx(Me,{})," Etiquetas A4"]}),e.jsxs(ue,{secondary:!0,onClick:()=>Ke(!0),children:[e.jsx(nt,{})," Categorías"]}),e.jsxs(ue,{secondary:!0,onClick:()=>Fe(!0),children:[e.jsx(lo,{})," Proveedores"]}),e.jsxs(ue,{tertiary:!0,onClick:()=>he(!0),children:[e.jsx(Ut,{})," Historial"]})]})]}),e.jsxs(ar,{children:[e.jsxs("div",{style:{display:"flex",gap:"0.5rem"},children:[e.jsxs(nr,{style:{flex:1},children:[e.jsx(ct,{style:{position:"absolute",left:12,top:14,color:"#a0aec0"}}),e.jsx(ir,{ref:P,placeholder:z==="code"?"Buscar código...":"Buscar nombre...",value:S,onChange:a=>F(a.target.value),autoComplete:"off",autoCorrect:"off",spellCheck:!1})]}),e.jsx(Tt,{$active:z==="description",onClick:()=>v("description"),title:"Por Nombre",children:e.jsx(co,{})}),e.jsx(Tt,{$active:z==="code",onClick:()=>v("code"),title:"Por Código",children:e.jsx(Me,{})})]}),e.jsxs(ce,{value:O,onChange:a=>L(a.target.value),children:[e.jsx("option",{value:"",children:"Todas las categorías"}),(Array.isArray(l)?l:[]).map(a=>e.jsx("option",{value:a.id_categoria,children:a.nombre},a.id_categoria))]}),e.jsxs(ce,{value:G,onChange:a=>ie(a.target.value),children:[e.jsx("option",{value:"",children:"Todos los proveedores"}),(Array.isArray(g)?g:[]).map(a=>e.jsx("option",{value:a.id_proveedor,children:a.nombre},a.id_proveedor))]}),e.jsxs(ce,{value:k,onChange:a=>x(a.target.value),style:{border:"1px solid #6366f1",background:"#f5f3ff"},children:[e.jsxs("optgroup",{label:"Nombre",children:[e.jsx("option",{value:"name-asc",children:"Nombre (A-Z)"}),e.jsx("option",{value:"name-desc",children:"Nombre (Z-A)"})]}),e.jsxs("optgroup",{label:"Existencia",children:[e.jsx("option",{value:"stock-asc",children:"Existencia (Menor a Mayor)"}),e.jsx("option",{value:"stock-desc",children:"Existencia (Mayor a Menor)"})]}),e.jsxs("optgroup",{label:"Precio",children:[e.jsx("option",{value:"price-asc",children:"Precio (Menor a Mayor)"}),e.jsx("option",{value:"price-desc",children:"Precio (Mayor a Menor)"})]})]})]}),e.jsxs("div",{style:{textAlign:"right",marginBottom:".5rem",color:"#4a5568",fontWeight:"bold",fontSize:"0.9rem"},children:["Página ",A," de ",D||1," | Mostrando ",(Array.isArray(we)?we:[]).length," de ",Ve," productos filtrados"]}),e.jsx(sr,{children:(Array.isArray(we)?we:[]).map(a=>{const w=T?{initial:{opacity:0,y:12},animate:{opacity:1,y:0},transition:{duration:.12}}:{},c=a.existencia>0&&a.existencia<=(a.minimo||5),C=a.existencia<=0;return e.jsxs(lr,{...w,children:[e.jsx(br,{productId:a.id_producto,productName:a.nombre,onViewFull:I=>Ue({isOpen:!0,productId:a.id_producto,imageUrl:I})}),e.jsxs(cr,{children:[e.jsx(dr,{title:a.nombre,children:a.nombre}),e.jsxs(pr,{children:["Código: ",a.codigo]})]}),e.jsxs(xr,{children:[e.jsxs(lt,{children:[e.jsx("span",{children:"Costo"}),e.jsx("strong",{children:a.__fmt.costo})]}),e.jsxs(lt,{children:[e.jsx("span",{children:"Venta"}),e.jsx("strong",{children:a.__fmt.venta})]}),(()=>{var V;const I=Number(((V=o==null?void 0:o.totalByProduct)==null?void 0:V[a.id_producto])||0);return e.jsxs(mr,{$low:c,$out:C,children:[e.jsx("span",{children:"Existencia"}),e.jsxs("strong",{children:[a.existencia,I>0&&e.jsxs("span",{style:{fontSize:"0.72rem",color:"#f59e0b",display:"block",fontWeight:600},children:["(",I," en caja)"]})]})]})})(),e.jsxs(lt,{children:[e.jsx("span",{children:"Costo Total"}),e.jsx("strong",{children:a.__fmt.costoTotal})]})]}),e.jsxs(ur,{children:[e.jsx(at,{className:"label",title:"Generar Etiquetas A4",onClick:()=>{Ee(a),De(!0)},children:e.jsx(Me,{})}),e.jsxs(at,{className:"adjust",title:"Ajustar Stock",onClick:()=>Te({isOpen:!0,product:a}),children:[e.jsx(po,{}),e.jsx(xo,{style:{marginLeft:4}})]}),e.jsxs(at,{className:"edit",onClick:()=>mt(a),children:[e.jsx(mo,{})," Editar"]}),e.jsxs(at,{className:"delete",onClick:()=>ut(a),children:[e.jsx(Nt,{})," Eliminar"]})]})]},a.id_producto)})}),Ve>0&&e.jsxs("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",gap:"1.5rem",marginTop:"2rem",marginBottom:"3rem"},children:[e.jsx(ue,{secondary:!0,onClick:()=>ae(a=>Math.max(1,a-1)),disabled:A===1,children:"Anterior"}),e.jsx("div",{style:{display:"flex",gap:"8px"},children:[...Array(D)].map((a,w)=>{const c=w+1;return D>7&&c>2&&c<D-1&&Math.abs(c-A)>1?c===3||c===D-2?e.jsx("span",{children:"..."},c):null:e.jsx(ue,{secondary:c!==A,primary:c===A,style:{minWidth:"40px",padding:"0.5rem"},onClick:()=>ae(c),children:c},c)})}),e.jsx(ue,{secondary:!0,onClick:()=>ae(a=>Math.min(D,a+1)),disabled:A===D,children:"Siguiente"})]}),e.jsx(te,{children:Qe&&e.jsx(wr,{isOpen:Qe,onClose:()=>J(!1),onSave:gt,categories:l,providers:g,allProductsRaw:f})}),e.jsx(te,{children:Ye&&e.jsx(Cr,{isOpen:Ye,onClose:()=>oe(!1),onSave:ft,productToEdit:Pe,categories:l,providers:g,allProductsRaw:f})}),e.jsx(te,{children:ge&&e.jsx(Lt,{open:ge,title:"Confirmar Eliminación",message:`¿Estás seguro de que quieres eliminar el producto "${K==null?void 0:K.nombre}"?`,onCancel:()=>_e(!1),onConfirm:ht,confirmLabel:"Sí, eliminar",danger:!0})}),e.jsx(te,{children:xe.open&&e.jsx(Lt,{open:xe.open,title:"Eliminación bloqueada",message:e.jsxs("div",{style:{textAlign:"left",lineHeight:1.6},children:["Este producto tiene referencias y no puede eliminarse.",e.jsx("br",{}),e.jsx("strong",{children:"Referencias:"}),e.jsx("br",{}),"Ventas: ",((U=xe.detail)==null?void 0:U.ventas)??0,e.jsx("br",{}),"Compras: ",((Z=xe.detail)==null?void 0:Z.compras)??0,e.jsx("br",{}),"Movimientos (kardex): ",((le=xe.detail)==null?void 0:le.kardex)??0,e.jsx("br",{}),e.jsx("br",{}),"Puedes ",e.jsx("strong",{children:"archivarlo"})," para ocultarlo del sistema sin perder historial."]}),onCancel:()=>se({open:!1,product:null,detail:null}),onConfirm:()=>bt(xe.product),confirmLabel:"Archivar producto",danger:!1})}),e.jsx(te,{children:re&&e.jsx(Ot,{title:"Gestionar Categorías",items:l,onAdd:N,onDelete:b,onClose:()=>Ke(!1)})}),e.jsx(te,{children:ve&&e.jsx(Ot,{title:"Gestionar Proveedores",items:g,onAdd:_,onDelete:B,onClose:()=>Fe(!1)})}),e.jsx(te,{children:Ze&&e.jsx(vr,{onClose:()=>he(!1)})}),e.jsx(te,{children:qe.isOpen&&e.jsx(jr,{isOpen:qe.isOpen,product:qe.product,onClose:()=>Te({isOpen:!1,product:null}),onConfirm:t})}),e.jsx(te,{children:Le.isOpen&&e.jsx(yr,{isOpen:Le.isOpen,onClose:Xe,title:Le.title,message:Le.message})}),e.jsx(te,{children:$e.isOpen&&e.jsx(gr,{isOpen:$e.isOpen,productId:$e.productId,imageSrc:$e.imageUrl,onClose:()=>Ue({isOpen:!1,productId:null,imageUrl:null})})}),e.jsx(te,{children:Re&&e.jsx(Xo,{isOpen:Re,onClose:()=>{De(!1),Ee(null)},products:m,categories:l,initialProduct:ze})})]})};export{_r as default};

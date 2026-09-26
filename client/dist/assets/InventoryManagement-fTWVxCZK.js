import{W as St,r,j as e,A as te,X as Te,Y as to,Z as oo,$ as rt,a0 as ro,k as Je,a1 as pt,a2 as mt,a3 as Bt,a4 as At,a5 as ao,H as st,a6 as It,a7 as no,a8 as io,a9 as vt,aa as Nt,ab as Ft,ac as at,ad as ie,s as b,m as Ae,a as Z,ae as so,M as lo,P as co,af as Ut,ag as po,ah as mo,ai as xo,aj as uo,t as go,ak as fo,al as Pt,R as De,v as ho,V as bo}from"./vendor-C6IkOdzt.js";import{u as yo,A as ee,g as lt,f as zt,s as ct,d as jo}from"./index-Bh0OH_w0.js";import{r as vo}from"./searchEngine-BMYcElFi.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-CINaEeII.js";const Rt=["0000ff00-0000-1000-8000-00805f9b34fb","0000ffe0-0000-1000-8000-00805f9b34fb","49535343-fe7d-4ae5-8fa9-9fafd205e455","e7810a71-73ae-499d-8c15-faa9aef0c3f2","000018f0-0000-1000-8000-00805f9b34fb","0000fee7-0000-1000-8000-00805f9b34fb","0000ae30-0000-1000-8000-00805f9b34fb"];function Wt(){return typeof navigator<"u"&&!!navigator.bluetooth}async function Tt(o=null){if(!Wt())throw new Error("Tu navegador no soporta Bluetooth Web. Usa Google Chrome o Microsoft Edge en tu PC.");try{const l=await navigator.bluetooth.requestDevice({acceptAllDevices:!0,optionalServices:Rt});o&&l.addEventListener("gattserverdisconnected",o);const f=await l.gatt.connect();let d=null;for(const x of Rt)try{const n=await(await f.getPrimaryService(x)).getCharacteristics();for(const i of n)if(i.properties.write||i.properties.writeWithoutResponse){d=i;break}if(d)break}catch{}if(!d)try{const x=await f.getPrimaryServices();for(const u of x){const n=await u.getCharacteristics();for(const i of n)if(i.properties.write||i.properties.writeWithoutResponse){d=i;break}if(d)break}}catch(x){console.warn("Error al explorar servicios adicionales:",x)}if(!d)throw new Error(`Se conectó a "${l.name||"Dispositivo"}", pero no se encontró un canal de escritura de impresión compatible.`);return{device:l,server:f,characteristic:d,name:l.name||"Impresora Phomemo"}}catch(l){throw l.name==="NotFoundError"?new Error("Búsqueda cancelada: no se seleccionó ninguna impresora."):l}}function wo(o){o&&o.gatt&&o.gatt.connected&&o.gatt.disconnect()}async function Re(o,l){try{o.properties.writeWithoutResponse&&typeof o.writeValueWithoutResponse=="function"?await o.writeValueWithoutResponse(l):await o.writeValue(l)}catch{try{await o.writeValue(l)}catch(d){throw console.error("Error escribiendo en característica GATT:",d),d}}}function Co(o,l,f,d,x,u,n=2){const i=l.split(" ");let v="";const y=[];for(let p=0;p<i.length;p++){const m=v+i[p]+" ";if(o.measureText(m).width>x&&p>0){if(y.push(v.trim()),v=i[p]+" ",y.length>=n)break}else v=m}if(v.trim()&&y.length<n&&y.push(v.trim()),y.length===n){let p=y[n-1];for(;o.measureText(p+"...").width>x&&p.length>0;)p=p.slice(0,-1);y[n-1]=p.trim()+"..."}return y.forEach((p,m)=>{o.fillText(p,f,d+m*u)}),y.length*u}function ko(o,l={}){var w;const{showCompany:f=!0,showPrice:d=!0,showCategory:x=!1,codeType:u="barcode",storeName:n="MULTIREPUESTOS RG"}=l,i=384,v=200,y=document.createElement("canvas");y.width=i,y.height=v;const p=y.getContext("2d",{willReadFrequently:!0});p.fillStyle="#ffffff",p.fillRect(0,0,i,v),p.fillStyle="#000000",p.textAlign="center",p.textBaseline="top";let m=6;f?(p.font="bold 13px system-ui, -apple-system, sans-serif",p.letterSpacing="1px",p.fillText(n,i/2,m),m+=16):m+=4,p.font="bold 15px system-ui, -apple-system, sans-serif";const S=o.nombre||"Repuesto",_=Co(p,S,i/2,m,i-20,17,2);m+=_+4;const P=String(o.codigo_barras||o.codigo||"000000");if(u==="barcode"||u==="hybrid")try{const g=document.createElement("canvas");St(g,P,{format:"CODE128",width:1.6,height:44,displayValue:!1,margin:0,background:"#ffffff",lineColor:"#000000"});const s=g.width,j=Math.min(s,i-24),z=(i-j)/2;p.drawImage(g,z,m,j,44),m+=47}catch(g){console.warn("Error dibujando código de barras en canvas:",g),m+=44}else m+=40;if(p.strokeStyle="#000000",p.lineWidth=1,p.beginPath(),p.moveTo(8,m),p.lineTo(i-8,m),p.stroke(),m+=4,p.textBaseline="middle",p.textAlign="left",p.font="bold 13px monospace, Courier",p.fillText(P,10,m+10),x&&o.categoria_nombre&&(p.font="normal 10px system-ui, sans-serif",p.fillText(String(o.categoria_nombre).slice(0,16),10,m+22)),d){const g=o.precio_venta??o.venta??o.precio??((w=o.__fmt)==null?void 0:w.venta)??0,s=typeof g=="string"&&g.includes("C$")?parseFloat(g.replace(/[^0-9.]/g,"")):parseFloat(g),j=!isNaN(s)&&s>0?`C$ ${s.toFixed(2)}`:"";j&&(p.textAlign="right",p.font="bold 18px system-ui, -apple-system, sans-serif",p.fillText(j,i-10,m+10))}return y}function So(o){const l=o.getContext("2d"),f=o.width,d=o.height,u=l.getImageData(0,0,f,d).data,n=Math.ceil(f/8),i=new Uint8Array(n*d);let v=0;for(let y=0;y<d;y++)for(let p=0;p<n;p++){let m=0;for(let S=0;S<8;S++){const _=p*8+S;if(_<f){const P=(y*f+_)*4,w=u[P],g=u[P+1],s=u[P+2],j=u[P+3],z=.299*w+.587*g+.114*s;j>128&&z<165&&(m|=1<<7-S)}}i[v++]=m}return i}async function No(o,l,f={},d=null){const x=l.width,u=l.height,n=Math.ceil(x/8),i=So(l),v=f.speed??5,y=f.density??15,p=f.media??10;await Re(o,new Uint8Array([27,78,13,v])),await new Promise(g=>setTimeout(g,30)),await Re(o,new Uint8Array([27,78,4,y])),await new Promise(g=>setTimeout(g,30)),await Re(o,new Uint8Array([31,17,p])),await new Promise(g=>setTimeout(g,30));const m=new Uint8Array([29,118,48,0,n&255,n>>8&255,u&255,u>>8&255]);await Re(o,m),await new Promise(g=>setTimeout(g,20));const S=128,_=i.length;let P=0;for(;P<_;){const g=i.slice(P,P+S);await Re(o,g),P+=S,d&&d(Math.min(100,Math.round(P/_*100))),await new Promise(s=>setTimeout(s,20))}await new Promise(g=>setTimeout(g,300));const w=new Uint8Array([31,240,5,0,31,240,3,0]);await Re(o,w),await new Promise(g=>setTimeout(g,500))}async function Ao(o,l,f={},d=null){if(!o)throw new Error("No hay ninguna impresora Bluetooth conectada.");if(!l||l.length===0)throw new Error("No hay etiquetas en la cola para imprimir.");const x=l.length;for(let u=0;u<x;u++){const n=l[u];d&&d({current:u+1,total:x,percentage:Math.round(u/x*100),labelName:n.nombre||"Repuesto"});const i=ko(n,f);await No(o,i,f,v=>{if(d){const y=Math.round((u+v/100)/x*100);d({current:u+1,total:x,percentage:y,labelName:n.nombre||"Repuesto"})}}),u<x-1&&await new Promise(v=>setTimeout(v,600))}return d&&d({current:x,total:x,percentage:100,labelName:"¡Completado con éxito!"}),{success:!0,count:x}}const nt=({value:o,width:l=1.3,height:f=32,displayValue:d=!0,fontSize:x=10})=>{const u=r.useRef(null);return r.useEffect(()=>{if(u.current&&o)try{St(u.current,String(o),{format:"CODE128",width:l,height:f,displayValue:d,fontSize:x,margin:0,background:"transparent",lineColor:"#000000",fontOptions:"bold",textMargin:1})}catch{try{const i=String(o).replace(/[^a-zA-Z0-9_-]/g,"")||"000000";St(u.current,i,{format:"CODE128",width:l,height:f,displayValue:d,fontSize:x,margin:0})}catch{console.warn("No se pudo renderizar código de barras:",o)}}},[o,l,f,d,x]),e.jsx("svg",{ref:u,style:{maxWidth:"100%",height:"auto",display:"block",margin:"0 auto"}})},Po=b(Ae.div)`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
`,zo=b(Ae.div)`
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
`,_o=b.div`
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
`,$o=b.button`
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
`,wt=b.div`
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
`,Eo=b.button`
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
`,Mo=b.div`
  display: grid;
  grid-template-columns: 440px 1fr;
  flex: 1;
  overflow: hidden;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
`,Bo=b.div`
  background: #f8fafc;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`,Io=b.div`
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
`,Fo=b.div`
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
`,Ro=b.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 8px;
`,To=b.div`
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
`,Do=b.div`
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
`,qo=b.div`
  display: flex;
  flex-direction: column;
  background: #f1f5f9;
  overflow: hidden;
`,Lo=b.div`
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
`,Oo=b.div`
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
`,Vo=b.div`
  flex: 1;
  overflow: auto;
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #64748b;
  position: relative;
`,Uo=b.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
`,Dt=b.div`
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
`,Wo=b.div`
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
`,Ho=b.div`
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
`,Go=b.div`
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
`,Qo=b.div`
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
`,Yo=b.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.7);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`,Jo=b.div`
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
`;function Xo({isOpen:o,onClose:l,products:f=[],categories:d=[],initialProduct:x=null}){const[u,n]=r.useState([]),[i,v]=r.useState(""),[y,p]=r.useState([]),[m,S]=r.useState("thermal_2x1"),[_,P]=r.useState("single"),[w,g]=r.useState(0),[s,j]=r.useState("bond"),[z,L]=r.useState("barcode"),[q,G]=r.useState("24"),[se,pe]=r.useState(!0),[T,me]=r.useState(!0),[W,Xe]=r.useState(!0),[X,Ke]=r.useState(!1),[oe,$e]=r.useState(0),[Ze,fe]=r.useState(null),[Ee,K]=r.useState(null),[he,re]=r.useState("disconnected"),[et,Ce]=r.useState(""),[Me,tt]=r.useState(!1),[be,Le]=r.useState({current:0,total:0,percentage:0,labelName:""}),[Oe,Be]=r.useState(!1),[Ie,Ve]=r.useState(10),[Ue,We]=r.useState(15);r.useEffect(()=>{x&&o&&n([{product:x,quantity:Math.max(1,Number(x.existencia)||1)}])},[x,o]),r.useEffect(()=>{if(!i.trim()){p([]);return}const t=i.toLowerCase(),N=f.filter(h=>h.nombre&&h.nombre.toLowerCase().includes(t)||h.codigo&&h.codigo.toLowerCase().includes(t)||h.codigo_barras&&h.codigo_barras.toLowerCase().includes(t)).slice(0,10);p(N)},[i,f]);const xe=r.useMemo(()=>q==="40"?40:q==="12"?12:24,[q]),A=r.useMemo(()=>{const t=[];return u.forEach(N=>{for(let h=0;h<N.quantity;h++)t.push(N.product)}),t},[u]),le=Math.max(1,Math.ceil(A.length/xe));r.useEffect(()=>{oe>=le&&$e(Math.max(0,le-1))},[le,oe]),r.useEffect(()=>{w>=A.length&&g(Math.max(0,A.length-1))},[A.length,w]);const ae=r.useMemo(()=>{const t=oe*xe;return A.slice(t,t+xe)},[A,oe,xe]),ke=A[w]||null,Fe=t=>{n(N=>{const h=N.findIndex($=>$.product.id_producto===t.id_producto);if(h>=0){const $=[...N];return $[h].quantity+=1,$}return[...N,{product:t,quantity:1}]}),v(""),p([])},He=(t,N)=>{n(h=>h.map($=>{if($.product.id_producto===t){const I=Math.max(1,$.quantity+N);return{...$,quantity:I}}return $}))},Q=(t,N)=>{const h=Math.max(1,parseInt(N)||1);n($=>$.map(I=>I.product.id_producto===t?{...I,quantity:h}:I))},ut=t=>{n(N=>N.map(h=>{if(h.product.id_producto===t){const $=Math.max(1,Number(h.product.existencia)||1);return{...h,quantity:$}}return h}))},ot=t=>{n(N=>N.filter(h=>h.product.id_producto!==t))},Y=()=>{n(t=>t.map(N=>({...N,quantity:1})))},Se=()=>{n(t=>t.map(N=>({...N,quantity:Math.max(1,Number(N.product.existencia)||1)})))},Ge=()=>{n([]),$e(0),g(0)},gt=async()=>{if(!Wt()){ie.error("Tu navegador no soporta Bluetooth Web. Usa Google Chrome o Microsoft Edge en tu PC.");return}try{re("connecting");const t=await Tt(()=>{fe(null),K(null),re("disconnected"),Ce(""),ie("Impresora Bluetooth desconectada.")});fe(t.device),K(t.characteristic),Ce(t.name),re("connected"),ie.success(`Conectado a ${t.name}`)}catch(t){re("disconnected"),t.message&&!t.message.includes("cancelada")&&ie.error(t.message||"No se pudo conectar a la impresora Bluetooth.")}},ft=()=>{Ze&&wo(Ze),fe(null),K(null),re("disconnected"),Ce(""),ie("Impresora desconectada")},ht=async()=>{var N;if(A.length===0){ie.error("No hay etiquetas en la bandeja.");return}let t=Ee;if(!t||he!=="connected")try{re("connecting");const h=await Tt(()=>{fe(null),K(null),re("disconnected"),Ce(""),ie("Impresora Bluetooth desconectada.")});t=h.characteristic,fe(h.device),K(h.characteristic),Ce(h.name),re("connected"),ie.success(`Conectado a ${h.name}`)}catch(h){re("disconnected"),h.message&&!h.message.includes("cancelada")&&ie.error(h.message||"Error al conectar por Bluetooth");return}try{tt(!0),Le({current:1,total:A.length,percentage:0,labelName:((N=A[0])==null?void 0:N.nombre)||"Repuesto"}),await Ao(t,A,{showCompany:T,showPrice:W,showCategory:X,codeType:z,storeName:"MULTIREPUESTOS RG",density:Ue,media:Ie,speed:5},h=>{Le(h)}),ie.success(`¡${A.length} etiquetas impresas en Phomemo con éxito!`)}catch(h){console.error("Error al imprimir por Bluetooth:",h),ie.error(`Error en la impresión: ${h.message}`)}finally{tt(!1)}},bt=()=>{if(A.length===0)return;const t=document.createElement("iframe");t.style.position="fixed",t.style.right="0",t.style.bottom="0",t.style.width="0",t.style.height="0",t.style.border="0",document.body.appendChild(t);const N=t.contentWindow.document;let h="";A.forEach(I=>{var ye;const D=I.codigo_barras||I.codigo||"000000",V=I.precio_venta??I.venta??I.precio??((ye=I.__fmt)==null?void 0:ye.venta)??0,O=typeof V=="string"&&V.includes("C$")?parseFloat(V.replace(/[^0-9.]/g,"")):parseFloat(V),U=!isNaN(O)&&O>0?`C$ ${O.toFixed(2)}`:"",ce=I.categoria_nombre||"";let ne="";z==="barcode"?ne=`<svg class="barcode-item" data-code="${D}"></svg>`:z==="qr"?ne=`<div class="qr-item" data-code="${D}"></div>`:ne=`
          <div style="display:flex;align-items:center;justify-content:space-around;width:100%;">
            <svg class="barcode-item" data-code="${D}" style="max-width:70%;height:10mm;"></svg>
            <div class="qr-item" data-code="${D}" style="width:11mm;height:11mm;"></div>
          </div>
        `,h+=`
        <div class="label-page-2x1">
          ${T?`
            <div class="company-header">
              <span class="company-title">Multirepuestos RG</span>
            </div>
          `:""}
          <div class="product-name">${I.nombre||"Repuesto"}</div>
          <div class="code-area">${ne}</div>
          <div class="bottom-info">
            <span class="code-text">${D}</span>
            ${W&&U?`<span class="price-tag">${U}</span>`:""}
            ${X&&ce?`<span class="category-text">${ce}</span>`:""}
          </div>
        </div>
      `});const $=`
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
          <style>${$}</style>
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"><\/script>
          <script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"><\/script>
        </head>
        <body>
          ${h}
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
    `),N.close()},yt=()=>{if(A.length===0)return;const t=document.createElement("iframe");t.style.position="fixed",t.style.right="0",t.style.bottom="0",t.style.width="0",t.style.height="0",t.style.border="0",document.body.appendChild(t);const N=t.contentWindow.document,h=[];for(let D=0;D<A.length;D+=xe)h.push(A.slice(D,D+xe));let $="";h.forEach(D=>{let V="";D.forEach(O=>{var k;const U=O.codigo_barras||O.codigo||"000000",ce=O.precio_venta??O.venta??O.precio??((k=O.__fmt)==null?void 0:k.venta)??0,ne=typeof ce=="string"&&ce.includes("C$")?parseFloat(ce.replace(/[^0-9.]/g,"")):parseFloat(ce),ye=!isNaN(ne)&&ne>0?`C$ ${ne.toFixed(2)}`:"",a=O.categoria_nombre||"";let C="";z==="barcode"?C=`<svg class="barcode-item" data-code="${U}"></svg>`:z==="qr"?C=`<div class="qr-item" data-code="${U}"></div>`:C=`
            <div style="display:flex;align-items:center;justify-content:space-around;width:100%;">
              <svg class="barcode-item" data-code="${U}" style="max-width:70%;"></svg>
              <div class="qr-item" data-code="${U}" style="width:24mm;height:24mm;"></div>
            </div>
          `,V+=`
          <div class="label-card ${s==="bond"?"paper-bond":"paper-adhesive"}">
            ${T||se?`
              <div class="company-header">
                ${se?`<img src="/icons/logo.png" class="company-logo" alt="Logo" onerror="this.style.display='none'" />`:""}
                ${T?'<span class="company-title">Multirepuestos RG</span>':""}
              </div>
            `:""}
            <div class="product-name">${O.nombre||"Repuesto"}</div>
            <div class="code-area">${C}</div>
            <div class="bottom-info">
              <span class="code-text">${U}</span>
              ${W&&ye?`<span class="price-tag">${ye}</span>`:""}
              ${X&&a?`<span class="category-text">${a}</span>`:""}
            </div>
          </div>
        `}),$+=`
        <div class="a4-sheet layout-${q}">
          ${V}
        </div>
      `});const I=`
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
          <style>${I}</style>
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"><\/script>
          <script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"><\/script>
        </head>
        <body>
          ${$}
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
    `),N.close()};return o?e.jsx(te,{children:e.jsx(Po,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(zo,{initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs(_o,{children:[e.jsxs("div",{className:"title-group",children:[e.jsx("div",{className:"icon-badge",children:e.jsx(Te,{})}),e.jsxs("div",{children:[e.jsx("h2",{children:"Generador de Etiquetas y Códigos de Barra"}),e.jsx("p",{children:"Imprime en Rollo Térmico 2x1'' (Phomemo Bluetooth) o en Hojas A4"})]})]}),e.jsxs("div",{className:"actions-group",children:[he==="connected"?e.jsxs(wt,{className:"connected",title:"Conectado vía Bluetooth a la impresora",children:[e.jsx(to,{})," ",et||"Phomemo Conectada",e.jsx("button",{className:"disconnect-x",onClick:ft,title:"Desconectar",children:"Desconectar"})]}):he==="connecting"?e.jsxs(wt,{className:"connecting",children:[e.jsx(oo,{className:"animate-spin"})," Conectando Bluetooth..."]}):e.jsxs(wt,{className:"disconnected",onClick:gt,title:"Haz clic para conectar tu Phomemo por Bluetooth desde la PC",children:[e.jsx(rt,{})," Conectar Phomemo"]}),e.jsxs(Eo,{onClick:()=>Be(!0),title:"Instrucciones para Phomemo en PC",children:[e.jsx(ro,{})," ¿Cómo usar Phomemo?"]}),e.jsx($o,{onClick:l,title:"Cerrar",children:e.jsx(Je,{})})]})]}),e.jsxs(Mo,{children:[e.jsxs(Bo,{children:[e.jsxs(Io,{children:[e.jsxs("div",{className:"input-wrapper",children:[e.jsx(pt,{}),e.jsx("input",{type:"text",placeholder:"Buscar repuesto por nombre o código para añadir...",value:i,onChange:t=>v(t.target.value)})]}),y.length>0&&e.jsx("div",{className:"autocomplete-results",children:y.map(t=>e.jsxs("div",{className:"result-item",onClick:()=>Fe(t),children:[e.jsxs("div",{className:"info",children:[e.jsx("span",{className:"name",children:t.nombre}),e.jsxs("span",{className:"meta",children:[e.jsxs("span",{children:["Código: ",t.codigo||t.codigo_barras||"N/A"]}),e.jsxs("span",{children:["Stock: ",t.existencia]}),e.jsxs("span",{children:["C$ ",t.precio_venta]})]})]}),e.jsxs("button",{className:"add-btn",children:[e.jsx(mt,{})," Añadir"]})]},t.id_producto))})]}),e.jsxs(Fo,{children:[e.jsxs("div",{className:"stats",children:[e.jsx("span",{children:"Bandeja:"}),e.jsxs("span",{className:"badge",children:[u.length," productos"]}),e.jsxs("span",{style:{color:"#0284c7"},children:["(",A.length," etiquetas)"]})]}),e.jsxs("div",{className:"quick-actions",children:[e.jsx("button",{onClick:Y,title:"Poner 1 etiqueta a cada producto",children:"1 a todos"}),e.jsxs("button",{onClick:Se,title:"Poner cantidad igual al stock de bodega",children:[e.jsx(Bt,{})," = Stock"]}),e.jsx("button",{className:"danger",onClick:Ge,title:"Vaciar la lista",children:e.jsx(At,{})})]})]}),e.jsx(Ro,{children:u.length===0?e.jsxs(Do,{children:[e.jsx(Te,{}),e.jsx("p",{children:"No has añadido repuestos a la bandeja."}),e.jsx("span",{style:{fontSize:"0.8rem",color:"#94a3b8"},children:"Usa el buscador arriba para agregar productos a imprimir."})]}):u.map(t=>e.jsxs(To,{children:[e.jsxs("div",{className:"item-details",children:[e.jsx("div",{className:"item-name",title:t.product.nombre,children:t.product.nombre}),e.jsxs("div",{className:"item-sub",children:[e.jsx("span",{className:"code",children:t.product.codigo_barras||t.product.codigo||"S/C"}),e.jsxs("span",{className:"price",children:["C$ ",Number(t.product.precio_venta||0).toFixed(2)]}),e.jsxs("span",{style:{color:"#64748b"},children:["Bodega: ",t.product.existencia]})]})]}),e.jsxs("div",{className:"stepper",children:[e.jsx("button",{onClick:()=>He(t.product.id_producto,-1),children:e.jsx(ao,{})}),e.jsx("input",{type:"number",min:"1",value:t.quantity,onChange:N=>Q(t.product.id_producto,N.target.value)}),e.jsx("button",{onClick:()=>He(t.product.id_producto,1),children:e.jsx(mt,{})})]}),e.jsxs("button",{className:"stock-sync",onClick:()=>ut(t.product.id_producto),title:"Igualar cantidad al stock físico",children:[e.jsx(Bt,{})," Stock"]}),e.jsx("button",{className:"remove-btn",onClick:()=>ot(t.product.id_producto),title:"Quitar",children:e.jsx(Je,{})})]},t.product.id_producto))})]}),e.jsxs(qo,{children:[e.jsxs(Lo,{children:[e.jsxs("div",{className:"top-row",children:[e.jsxs("div",{className:"format-selector",children:[e.jsxs("button",{className:m==="thermal_2x1"?"active":"",onClick:()=>S("thermal_2x1"),children:[e.jsx(st,{})," 🏷️ Rollo Térmico 2x1'' (Phomemo)"]}),e.jsxs("button",{className:m==="a4_sheet"?"active":"",onClick:()=>S("a4_sheet"),children:[e.jsx(It,{})," 📄 Hoja Completa A4"]})]}),e.jsx("div",{className:"action-buttons",children:m==="thermal_2x1"?e.jsxs(e.Fragment,{children:[e.jsxs("button",{className:"btn-bluetooth-print",disabled:A.length===0||Me,onClick:ht,title:"Imprime de un solo tirón por Bluetooth directamente desde la PC",children:[e.jsx(rt,{}),he==="connected"?`Imprimir ${A.length} por Bluetooth`:`Conectar e Imprimir ${A.length} (Bluetooth)`]}),e.jsxs("button",{className:"btn-pc-print",disabled:A.length===0||Me,onClick:bt,title:"Imprime usando la impresora de Windows o cable USB configurada en 2x1''",children:[e.jsx(no,{})," Diálogo PC (2x1'')"]})]}):e.jsxs("button",{className:"btn-a4-print",disabled:A.length===0,onClick:yt,children:[e.jsx(io,{})," Imprimir ",A.length," Etiquetas A4"]})})]}),e.jsx("div",{className:"options-row",children:e.jsxs("div",{className:"config-section",children:[e.jsxs("div",{className:"control-group",children:[e.jsx("label",{children:"Tipo de Código"}),e.jsxs("select",{value:z,onChange:t=>L(t.target.value),children:[e.jsx("option",{value:"barcode",children:"📊 Código de Barras (1D)"}),e.jsx("option",{value:"qr",children:"📱 Código QR (2D)"}),m==="a4_sheet"&&e.jsx("option",{value:"hybrid",children:"🔄 Híbrido (Barras + QR)"})]})]}),m==="thermal_2x1"&&e.jsxs("div",{className:"control-group",children:[e.jsx("label",{children:"Tipo de Rollo"}),e.jsxs("select",{value:Ie,onChange:t=>Ve(Number(t.target.value)),children:[e.jsx("option",{value:10,children:"🏷️ Con Separación (Gap 2x1)"}),e.jsx("option",{value:11,children:"📄 Rollo Continuo"})]})]}),m==="a4_sheet"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"control-group",children:[e.jsx("label",{children:"Tipo de Papel"}),e.jsxs("select",{value:s,onChange:t=>j(t.target.value),children:[e.jsx("option",{value:"bond",children:"📄 Papel Bond A4 (Líneas de Corte)"}),e.jsx("option",{value:"adhesive",children:"🏷️ Papel Adhesivo (Stickers A4)"})]})]}),e.jsxs("div",{className:"control-group",children:[e.jsx("label",{children:"Distribución A4"}),e.jsxs("select",{value:q,onChange:t=>G(t.target.value),children:[e.jsx("option",{value:"24",children:"24 por Hoja (3x8 - Estándar Góndola)"}),e.jsx("option",{value:"40",children:"40 por Hoja (4x10 - Repuesto Pequeño)"}),e.jsx("option",{value:"12",children:"12 por Hoja (2x6 - Grande / Baterías)"})]})]})]}),e.jsxs("div",{className:"toggles",children:[e.jsxs("div",{className:`toggle-chip ${W?"active":""}`,onClick:()=>Xe(!W),title:"Mostrar precio de venta C$",children:[W&&e.jsx(vt,{size:9})," Precio C$"]}),e.jsxs("div",{className:`toggle-chip ${T?"active":""}`,onClick:()=>me(!T),title:"Mostrar Multirepuestos RG",children:[T&&e.jsx(vt,{size:9})," Empresa"]}),e.jsxs("div",{className:`toggle-chip ${X?"active":""}`,onClick:()=>Ke(!X),title:"Mostrar Categoría",children:[X&&e.jsx(vt,{size:9})," Categoría"]})]})]})})]}),e.jsx(Oo,{children:m==="thermal_2x1"?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"nav-group",children:[e.jsxs("button",{disabled:w===0,onClick:()=>g(t=>Math.max(0,t-1)),children:[e.jsx(Nt,{})," Anterior"]}),e.jsxs("span",{children:["Etiqueta ",e.jsx("strong",{children:A.length>0?w+1:0})," de ",e.jsx("strong",{children:A.length})]}),e.jsxs("button",{disabled:w>=A.length-1,onClick:()=>g(t=>Math.min(A.length-1,t+1)),children:["Siguiente ",e.jsx(Ft,{})]})]}),e.jsxs("div",{className:"view-toggles",children:[e.jsx("button",{className:_==="single"?"active":"",onClick:()=>P("single"),title:"Ver etiqueta individual ampliada",children:"🏷️ Vista Individual"}),e.jsx("button",{className:_==="reel"?"active":"",onClick:()=>P("reel"),title:"Ver tira continua del rollo",children:"🎞️ Tira de Rollo"})]}),e.jsxs("div",{className:"paper-indicator",children:[e.jsx(st,{})," Rollo Térmico 2x1'' (50mm x 25mm) - Phomemo / Térmica"]})]}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"nav-group",children:[e.jsxs("button",{disabled:oe===0,onClick:()=>$e(t=>Math.max(0,t-1)),children:[e.jsx(Nt,{})," Anterior"]}),e.jsxs("span",{children:["Hoja A4 ",e.jsx("strong",{children:oe+1})," de ",e.jsx("strong",{children:le})]}),e.jsxs("button",{disabled:oe>=le-1,onClick:()=>$e(t=>Math.min(le-1,t+1)),children:["Siguiente ",e.jsx(Ft,{})]})]}),e.jsxs("div",{className:"paper-indicator",children:[e.jsx(It,{}),s==="bond"?"Papel Bond con Guías de Corte Punteadas":"Papel de Etiquetas Autoadhesivas"]})]})}),e.jsx(Vo,{children:m==="thermal_2x1"?A.length===0?e.jsxs("div",{style:{color:"#e2e8f0",textAlign:"center"},children:[e.jsx(Te,{size:48,style:{opacity:.5,marginBottom:12}}),e.jsx("p",{children:"Agrega repuestos a la bandeja para previsualizar tu etiqueta 2x1''."})]}):_==="single"&&ke?e.jsx(Uo,{children:(()=>{var V;const t=ke,N=t.codigo_barras||t.codigo||"000000",h=t.precio_venta??t.venta??t.precio??((V=t.__fmt)==null?void 0:V.venta)??0,$=typeof h=="string"&&h.includes("C$")?parseFloat(h.replace(/[^0-9.]/g,"")):parseFloat(h),I=!isNaN($)&&$>0?`C$ ${$.toFixed(2)}`:"",D=t.categoria_nombre||"";return e.jsxs(Dt,{children:[e.jsxs("div",{className:"dim-pill",children:[e.jsx(st,{size:10})," 2x1 PULGADAS (50x25mm)"]}),T&&e.jsx("div",{className:"company-title",children:"Multirepuestos RG"}),e.jsx("div",{className:"product-name",title:t.nombre,children:t.nombre}),e.jsx("div",{className:"code-area",children:z==="barcode"?e.jsx(nt,{value:N,width:1.6,height:36,displayValue:!1}):e.jsx(at,{value:N,size:44,level:"M"})}),e.jsxs("div",{className:"bottom-info",children:[e.jsx("span",{className:"code-text",children:N}),W&&I&&e.jsx("span",{className:"price-tag",children:I}),X&&D&&e.jsx("span",{className:"category-text",children:D})]})]})})()}):e.jsx(Wo,{children:A.map((t,N)=>{var O;const h=t.codigo_barras||t.codigo||"000000",$=t.precio_venta??t.venta??t.precio??((O=t.__fmt)==null?void 0:O.venta)??0,I=typeof $=="string"&&$.includes("C$")?parseFloat($.replace(/[^0-9.]/g,"")):parseFloat($),D=!isNaN(I)&&I>0?`C$ ${I.toFixed(2)}`:"",V=t.categoria_nombre||"";return e.jsx("div",{className:"reel-sticker-wrap",children:e.jsxs(Dt,{children:[e.jsxs("div",{className:"dim-pill",children:["#",N+1," • 2x1''"]}),T&&e.jsx("div",{className:"company-title",children:"Multirepuestos RG"}),e.jsx("div",{className:"product-name",title:t.nombre,children:t.nombre}),e.jsx("div",{className:"code-area",children:z==="barcode"?e.jsx(nt,{value:h,width:1.6,height:36,displayValue:!1}):e.jsx(at,{value:h,size:44,level:"M"})}),e.jsxs("div",{className:"bottom-info",children:[e.jsx("span",{className:"code-text",children:h}),W&&D&&e.jsx("span",{className:"price-tag",children:D}),X&&V&&e.jsx("span",{className:"category-text",children:V})]})]})},`${t.id_producto}-${N}`)})}):e.jsx(Ho,{className:`layout-${q}`,children:ae.map((t,N)=>{var O;const h=t.codigo_barras||t.codigo||"000000",$=t.precio_venta??t.venta??t.precio??((O=t.__fmt)==null?void 0:O.venta)??0,I=typeof $=="string"&&$.includes("C$")?parseFloat($.replace(/[^0-9.]/g,"")):parseFloat($),D=!isNaN(I)&&I>0?`C$ ${I.toFixed(2)}`:"",V=t.categoria_nombre||"";return e.jsxs(Go,{className:`paper-${s}`,children:[(T||se)&&e.jsxs("div",{className:"company-header",children:[se&&e.jsx("img",{src:"/icons/logo.png",alt:"Logo",className:"company-logo",onError:U=>{U.target.style.display="none"}}),T&&e.jsx("span",{className:"company-title",children:"Multirepuestos RG"})]}),e.jsx("div",{className:"product-name",title:t.nombre,children:t.nombre}),e.jsxs("div",{className:`code-area ${z==="hybrid"?"hybrid":""}`,children:[z==="barcode"&&e.jsx(nt,{value:h,width:q==="40"?1:1.3,height:q==="40"?22:28,displayValue:!1}),z==="qr"&&e.jsx(at,{value:h,size:q==="40"?38:46,level:"M"}),z==="hybrid"&&e.jsxs(e.Fragment,{children:[e.jsx("div",{style:{flex:1,maxWidth:"72%"},children:e.jsx(nt,{value:h,width:1,height:22,displayValue:!1})}),e.jsx(at,{value:h,size:32,level:"M"})]})]}),e.jsxs("div",{className:"bottom-info",children:[e.jsx("span",{className:"code-text",children:h}),W&&D&&e.jsx("span",{className:"price-tag",children:D}),X&&V&&e.jsx("span",{className:"category-text",children:V})]})]},`${t.id_producto}-${N}`)})})})]})]}),Me&&e.jsx(Qo,{children:e.jsxs("div",{className:"progress-card",children:[e.jsx("div",{className:"icon-anim",children:e.jsx(rt,{})}),e.jsx("h3",{children:"Imprimiendo en Phomemo..."}),e.jsxs("div",{className:"label-desc",children:["Etiqueta ",be.current," de ",be.total,":",e.jsxs("strong",{children:[" ",be.labelName]})]}),e.jsx("div",{className:"progress-bar-bg",children:e.jsx("div",{className:"progress-bar-fill",style:{width:`${Math.max(5,be.percentage)}%`}})}),e.jsxs("div",{className:"percentage-text",children:[be.percentage,"% completado"]}),e.jsx("div",{className:"footer-note",children:"No apagues la etiquetadora durante la impresión."})]})}),Oe&&e.jsx(Yo,{onClick:()=>Be(!1),children:e.jsxs(Jo,{onClick:t=>t.stopPropagation(),children:[e.jsxs("div",{className:"header",children:[e.jsxs("h3",{children:[e.jsx(rt,{})," Guía: ¿Cómo imprimir en Phomemo desde la PC?"]}),e.jsx("button",{onClick:()=>Be(!1),children:e.jsx(Je,{})})]}),e.jsxs("div",{className:"body",children:[e.jsxs("div",{className:"step-box",children:[e.jsxs("div",{className:"step-title",children:[e.jsx("div",{className:"badge-number",children:"1"}),e.jsx("span",{children:"Opción A: Bluetooth Web Directo (¡Recomendado!)"})]}),e.jsxs("p",{children:[e.jsx("strong",{children:"1."})," Enciende tu etiquetadora Phomemo (M110, M120, M220, D30, etc.) y colócale el rollo de etiquetas 2x1 pulgadas (50x25mm)."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"2."})," En tu computadora con Google Chrome o Microsoft Edge, haz clic en el botón azul ",e.jsx("strong",{children:'"Conectar e Imprimir (Bluetooth)"'}),"."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"3."})," El navegador mostrará una ventana con los dispositivos Bluetooth. Elige tu Phomemo y haz clic en ",e.jsx("strong",{children:'"Vincular"'}),"."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"4."})," ¡Listo! Se imprimirán todas las etiquetas de tu lista ",e.jsx("strong",{children:"de un solo tirón"})," sin necesidad de tocar el celular ni de conectar la impresora a cada rato."]})]}),e.jsxs("div",{className:"step-box",children:[e.jsxs("div",{className:"step-title",children:[e.jsx("div",{className:"badge-number",children:"2"}),e.jsx("span",{children:"Opción B: Usar como Impresora de Windows o Cable USB"})]}),e.jsxs("p",{children:[e.jsx("strong",{children:"1."})," Si tienes instalados los drivers de Phomemo o el software ",e.jsx("em",{children:"Labelife"})," en tu computadora con Windows:"]}),e.jsxs("p",{children:[e.jsx("strong",{children:"2."})," Haz clic en el botón ",e.jsx("strong",{children:`"Diálogo PC (2x1'')"`}),"."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"3."})," En la ventana de impresión de Windows, selecciona tu impresora Phomemo y asegúrate de elegir el tamaño de papel ",e.jsx("strong",{children:"2x1 pulgadas o 50x25mm"})," con márgenes en 0."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"4."})," Presiona Imprimir y el rollo saldrá continuo de un solo tiro."]})]})]}),e.jsx("div",{className:"footer",children:e.jsx("button",{onClick:()=>Be(!1),children:"¡Entendido, volver al generador!"})})]})})]})})}):null}const Ct=b.div`
  padding: 20px;
  background-color: #f8fafc;
  min-height: 100vh;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  
  @media(max-width: 640px) {
    padding: 10px;
  }
`,qt=b.div`
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  height: 60vh; opacity: 0.8; font-size: 1.1rem; color: #64748b;
  text-align: center;
`,xt=b(ho)`
  animation: ${go`from {transform:rotate(0deg);} to {transform:rotate(360deg);}`} 0.8s linear infinite;
  font-size: 2.5rem; margin-bottom: 1.5rem; color: #3b82f6;
`,Ko=b(bo)`
  display: inline-flex; align-items: center; gap: 8px;
  color: #64748b; text-decoration: none; font-weight: 600; font-size: 0.95rem;
  padding: 8px 12px; margin-bottom: 1rem; border-radius: 8px;
  transition: all 0.2s;
  &:hover { color: #3b82f6; background: #eff6ff; transform: translateX(-4px); }
`,Zo=b.div`
  display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  padding: 1rem 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  position: sticky; top: 10px; z-index: 40;
  border: 1px solid rgba(255,255,255,0.5);
  @media(min-width: 1024px) { flex-direction: row; justify-content: space-between; align-items: center; }
`,er=b.h1`
  font-size: 1.5rem; color: #1e293b; display: flex; align-items: center; gap: 0.75rem; margin: 0; font-weight: 800;
  svg { color: #3b82f6; }
`,tr=b.div`
  display: flex; gap: 0.75rem; flex-wrap: wrap;
`,ge=b.button`
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
`,or=b.div`
  display: flex; flex-direction: column; gap: 1rem; 
  background: white; padding: 1.25rem; 
  border-radius: 16px; 
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); 
  margin-bottom: 2rem;
  border: 1px solid #e2e8f0;
  @media(min-width: 1024px) { flex-direction: row; align-items: center; }
`,rr=b.div`
  position: relative; flex: 1; min-width: 250px;
`,ar=b.input`
  width: 100%; padding: 0.75rem 1rem 0.75rem 2.8rem; 
  border: 1px solid #cbd5e1; border-radius: 12px; 
  font-size: 0.95rem; background-color: #f8fafc;
  transition: all 0.2s; outline: none;
  &:focus { border-color: #3b82f6; background: white; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
`,Lt=b.button`
  width: 42px; height: 42px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: ${o=>o.$active?"#dbeafe":"#f1f5f9"};
  color: ${o=>o.$active?"#1d4ed8":"#64748b"};
  border: 1px solid ${o=>o.$active?"#bfdbfe":"transparent"};
  border-radius: 10px; cursor: pointer; transition: all 0.2s;
  &:hover { background: #e2e8f0; }
`,de=b.select`
  padding: 0.7rem 1rem; border: 1px solid #cbd5e1; border-radius: 12px; 
  background-color: #f8fafc; color: #334155; outline: none; flex: 1;
  font-size: 0.9rem; cursor: pointer; width: 100%; box-sizing: border-box;
  &:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); background: white; }
`,nr=b.div`
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); 
  gap: 1.5rem;
  padding-bottom: 40px;
`,ir=b(Ae.div)`
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
`,sr=b.div` padding: 1.25rem 1rem 0.5rem; `,lr=b.h3` font-size: 1.15rem; margin: 0; color: #0f172a; font-weight: 700; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; `,cr=b.div` font-size: 0.85rem; color: #64748b; font-family: monospace; letter-spacing: 0.05em; margin-top: 4px; `,dr=b.div` padding: 0.5rem 1rem 1.25rem; display: flex; flex-wrap: wrap; gap: 0.5rem; `,dt=b.div`
  background: white; border: 1px solid #e2e8f0;
  padding: 6px 10px; border-radius: 8px; 
  display: flex; flex-direction: column; align-items: flex-start; flex: 1; min-width: 80px;
  span { font-size: 0.65rem; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px; }
  strong { color: #334155; font-size: 1rem; font-weight: 700; }
`,pr=b(dt)`
  background: ${o=>o.$out?"#fef2f2":o.$low?"#fffbeb":"#f0fdf4"};
  border-color: ${o=>o.$out?"#fecaca":o.$low?"#fde68a":"#bbf7d0"};
  strong { color: ${o=>o.$out?"#b91c1c":o.$low?"#b45309":"#15803d"}; }
`,mr=b.div`
  margin-top: auto; padding: 1rem; background: #f8fafc; border-top: 1px solid #f1f5f9; display: flex; gap: 0.75rem;
`,it=b.button`
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
`,we=b(Ae.div)`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(15, 23, 42, 0.5); z-index: 50;
  display: flex; align-items: center; justify-content: center; padding: 0.75rem;
  backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
  overflow: hidden;
`,Pe=b.div`
  background: white; width: 100%; max-width: ${o=>o.$large?"900px":"700px"};
  border-radius: 20px; padding: 1.75rem;
  max-height: 92vh; overflow-y: auto; overflow-x: hidden;
  box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  @media(max-width: 640px) { padding: 1.25rem; border-radius: 16px; max-width: 100%; }
`,ze=b.h2`
  margin-top: 0; color: #0f172a; margin-bottom: 1.25rem; font-size: 1.35rem;
  display: flex; align-items: center; gap: 10px; font-weight: 800; letter-spacing: -0.02em;
`,Ht=b.div`
  background: #fef2f2; color: #991b1b; padding: 12px; border-radius: 10px;
  margin-bottom: 1.25rem; border: 1px solid #fecaca; font-size: 0.85rem; display: flex; gap: 8px; align-items: center;
`,Gt=b.div`
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.25rem;
  overflow: hidden;
  & > * { min-width: 0; }
  @media(min-width: 768px) { grid-template-columns: repeat(3, 1fr); }
  @media(max-width: 640px) { grid-template-columns: 1fr; gap: 0.75rem; }
`,E=b.div` display: flex; flex-direction: column; gap: 5px; min-width: 0; `,M=b.label` font-size: 0.82rem; font-weight: 600; color: #475569; `,R=b.input`
  width: 100%; box-sizing: border-box;
  padding: 9px 12px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 0.95rem; color: #1e293b;
  transition: all 0.2s;
  &:focus { outline: none; border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
  &:disabled { background: #f1f5f9; color: #94a3b8; }
`,qe=b.div` display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; border-top: 1px solid #f1f5f9; padding-top: 1.25rem; flex-wrap: wrap; `,Ne=b.button`
  background: white; color: #64748b; border: 1.5px solid #e2e8f0;
  padding: 9px 18px; border-radius: 10px; font-weight: 600; cursor: pointer; font-size: 0.9rem;
  transition: all 0.2s;
  &:hover { background: #f8fafc; color: #1e293b; border-color: #cbd5e1; }
`,_e=b.button`
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white; border: none;
  padding: 9px 22px; border-radius: 10px; font-weight: 600; cursor: pointer; font-size: 0.9rem;
  box-shadow: 0 4px 12px rgba(99,102,241,0.25);
  transition: all 0.2s;
  &:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(99,102,241,0.35); }
`,Qt=({currentImage:o,onImageChange:l})=>{const f=r.useRef(null),[d,x]=r.useState(o||null),[u,n]=r.useState(!1);r.useEffect(()=>{x(o)},[o]);const i=async y=>{const p=y.target.files[0];if(p){if(!p.type.startsWith("image/")){alert("Solo se permiten imágenes.");return}n(!0);try{const m=await v(p);x(m),l(m)}catch(m){console.error(m),alert("Error al procesar la imagen.")}finally{n(!1)}}},v=y=>new Promise((p,m)=>{const S=new FileReader;S.readAsDataURL(y),S.onload=_=>{const P=new Image;P.src=_.target.result,P.onload=()=>{const w=document.createElement("canvas"),g=500,s=g/P.width;w.width=g,w.height=P.height*s,w.getContext("2d").drawImage(P,0,0,w.width,w.height);const z=w.toDataURL("image/jpeg",.7);p(z)},P.onerror=w=>m(w)},S.onerror=_=>m(_)});return e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"10px",marginBottom:"1rem",border:"1px dashed #ccc",padding:"1rem",borderRadius:"8px"},children:[u?e.jsx(xt,{}):d?e.jsxs("div",{style:{position:"relative",width:"120px",height:"120px"},children:[e.jsx("img",{src:d,alt:"Preview",style:{width:"100%",height:"100%",objectFit:"cover",borderRadius:"8px",border:"1px solid #ddd"}}),e.jsx("button",{type:"button",onClick:y=>{y.stopPropagation(),x(null),l(null),f.current&&(f.current.value="")},style:{position:"absolute",top:"-8px",right:"-8px",background:"#dc3545",color:"white",border:"none",borderRadius:"50%",width:"24px",height:"24px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsx(Je,{size:12})})]}):e.jsxs("div",{onClick:()=>f.current.click(),style:{cursor:"pointer",color:"#6c757d",display:"flex",flexDirection:"column",alignItems:"center"},children:[e.jsx(Pt,{size:32}),e.jsx("span",{style:{fontSize:"0.9rem",marginTop:"5px"},children:"Subir Foto"})]}),e.jsx("input",{type:"file",ref:f,onChange:i,accept:"image/*",style:{display:"none"}})]})},xr=({isOpen:o,productId:l,imageSrc:f,onClose:d})=>{const[x,u]=De.useState(null),[n,i]=De.useState(!1);return De.useEffect(()=>{if(!o){u(null);return}if(f){u(f);return}if(!l)return;const v=localStorage.getItem("token");zt(l,v).then(y=>u(y==null?void 0:y.imagen)).catch(()=>u(null)).finally(()=>i(!1))},[o,l,f]),o?e.jsx(we,{onClick:d,initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(Ae.div,{initial:{scale:.8,opacity:0},animate:{scale:1,opacity:1},style:{position:"relative",maxWidth:"90%",maxHeight:"90vh",display:"flex",alignItems:"center",justifyContent:"center"},children:[e.jsx("button",{onClick:d,style:{position:"absolute",top:-15,right:-15,background:"white",width:30,height:30,borderRadius:"50%",border:"none",cursor:"pointer",fontWeight:"bold",zIndex:1},children:"X"}),n?e.jsxs("div",{style:{background:"white",borderRadius:"12px",padding:"3rem 4rem",display:"flex",flexDirection:"column",alignItems:"center",gap:"1rem",color:"#64748b"},children:[e.jsx(xt,{}),e.jsx("span",{style:{fontSize:"0.95rem",fontWeight:600},children:"Cargando imagen, espere por favor..."})]}):x?e.jsx("img",{src:x,alt:"Vista completa",style:{maxWidth:"100%",maxHeight:"80vh",borderRadius:"8px",boxShadow:"0 5px 20px rgba(0,0,0,0.5)"}}):e.jsxs("div",{style:{background:"white",borderRadius:"12px",padding:"3rem 4rem",color:"#94a3b8",textAlign:"center"},children:[e.jsx(Pt,{size:48,style:{marginBottom:"1rem"}}),e.jsx("p",{style:{margin:0},children:"Este producto no tiene imagen."})]})]})}):null},Ye=o=>String(o||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),ur=o=>{const[l,f]=De.useState(()=>{const x=lt(o);return x&&x!=="loading"&&x!=="none"?x:null}),d=De.useRef(null);return De.useEffect(()=>{const x=lt(o);if(x&&x!=="loading"){f(x!=="none"?x:null);return}const u=d.current;if(!u)return;const n=new IntersectionObserver(i=>{if(i[0].isIntersecting){if(n.disconnect(),lt(o)==="loading")return;ct(o,"loading");const v=localStorage.getItem("token");zt(o,v).then(y=>{const p=(y==null?void 0:y.imagen)||null;ct(o,p||"none"),f(p||null)}).catch(()=>{ct(o,"none"),f(null)})}},{rootMargin:"200px"});return n.observe(u),()=>n.disconnect()},[o]),{imgSrc:l,cardRef:d}},kt=50,gr=500,fr=({productId:o,productName:l,onViewFull:f})=>{const{imgSrc:d,cardRef:x}=ur(o);return e.jsx("div",{ref:x,className:"image-placeholder",onClick:()=>f(d),style:{cursor:"zoom-in"},children:d?e.jsxs(e.Fragment,{children:[e.jsx("img",{src:d,alt:l}),e.jsx("div",{className:"overlay",children:e.jsx(fo,{})})]}):e.jsx("div",{className:"no-image-text",children:e.jsx(Pt,{})})})},hr=({isOpen:o,onClose:l,title:f,message:d})=>o?e.jsx(we,{onClick:l,initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(Pe,{as:"div",onClick:x=>x.stopPropagation(),style:{maxWidth:"400px",textAlign:"center"},children:[e.jsx(ze,{children:f}),e.jsx("p",{style:{color:"#4a5568",marginBottom:"20px"},children:d}),e.jsx(_e,{onClick:l,style:{width:"100%"},children:"Aceptar"})]})}):null,Ot=({open:o,onCancel:l,onConfirm:f,title:d,message:x,confirmLabel:u,danger:n})=>o?e.jsx(we,{onClick:l,initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(Pe,{as:"div",onClick:i=>i.stopPropagation(),style:{maxWidth:"450px"},children:[e.jsx(ze,{style:{color:n?"#e53e3e":"#2d3748"},children:d}),e.jsx("div",{style:{marginBottom:"25px",color:"#4a5568"},children:x}),e.jsxs(qe,{children:[e.jsx(Ne,{onClick:l,children:"Cancelar"}),e.jsx(_e,{onClick:f,style:{background:n?"#e53e3e":"#3b82f6"},children:u||"Confirmar"})]})]})}):null,Vt=({title:o,items:l,onAdd:f,onDelete:d,onClose:x})=>{const[u,n]=r.useState(""),i=v=>{v.preventDefault(),u.trim()&&(f(u),n(""))};return e.jsx(we,{onClick:x,children:e.jsxs(Pe,{onClick:v=>v.stopPropagation(),children:[e.jsx(ze,{children:o}),e.jsxs("form",{onSubmit:i,style:{display:"flex",gap:"10px",marginBottom:"20px"},children:[e.jsx(R,{value:u,onChange:v=>n(v.target.value),placeholder:"Nuevo nombre...",style:{flex:1}}),e.jsxs(_e,{type:"submit",children:[e.jsx(mt,{})," Agregar"]})]}),e.jsxs("div",{style:{maxHeight:"300px",overflowY:"auto",display:"flex",flexDirection:"column",gap:"8px"},children:[(Array.isArray(l)?l:[]).map((v,y)=>{const p=v.id_categoria||v.id_proveedor||y,m=v.nombre;return e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",padding:"10px",background:"#f7fafc",borderRadius:"8px",alignItems:"center"},children:[e.jsx("span",{children:m}),e.jsx("button",{onClick:()=>d(p),style:{color:"#e53e3e",background:"none",border:"none",cursor:"pointer"},children:e.jsx(At,{})})]},p)}),(!Array.isArray(l)||l.length===0)&&e.jsx("p",{style:{textAlign:"center",color:"#a0aec0"},children:"No hay elementos registrados."})]}),e.jsx(qe,{children:e.jsx(Ne,{onClick:x,children:"Cerrar"})})]})})},br=({isOpen:o,product:l,onClose:f,onConfirm:d})=>{const[x,u]=r.useState(""),[n,i]=r.useState(""),[v,y]=r.useState("");if(!o||!l)return null;const p=m=>{const S=m.target.value;y(S),i(S||"")};return e.jsx(we,{onClick:f,children:e.jsxs(Pe,{onClick:m=>m.stopPropagation(),style:{maxWidth:"400px"},children:[e.jsxs(ze,{children:["Ajustar Stock: ",l.nombre]}),e.jsx("div",{style:{marginBottom:"15px"},children:e.jsxs("p",{children:[e.jsx("strong",{children:"Stock Actual:"})," ",l.existencia]})}),e.jsxs(E,{style:{marginBottom:"15px"},children:[e.jsx(M,{children:"Cantidad (Positivo para agregar, Negativo para restar)"}),e.jsx(R,{type:"number",value:x,onChange:m=>u(m.target.value),placeholder:"Ej: 10 o -5",autoFocus:!0})]}),e.jsxs(E,{style:{marginBottom:"10px"},children:[e.jsx(M,{children:"Razón (Seleccionar)"}),e.jsxs(de,{value:v,onChange:p,children:[e.jsx("option",{value:"",children:"-- Escribir manualmente --"}),e.jsx("option",{value:"Compra",children:"Compra / Resurtido"}),e.jsx("option",{value:"Ajuste Inventario",children:"Ajuste de Inventario"}),e.jsx("option",{value:"Devolución",children:"Devolución Cliente"}),e.jsx("option",{value:"Dañado",children:"Producto Dañado/Merma"}),e.jsx("option",{value:"Uso Interno",children:"Uso Interno"})]})]}),e.jsxs(E,{style:{marginBottom:"20px"},children:[e.jsx(M,{children:"Razón (Manual)"}),e.jsx(R,{type:"text",value:n,onChange:m=>{i(m.target.value),y("")},placeholder:"Especifique el motivo..."})]}),e.jsxs(qe,{children:[e.jsx(Ne,{onClick:f,children:"Cancelar"}),e.jsx(_e,{onClick:()=>{const m=parseInt(x,10);!isNaN(m)&&m!==0&&n.trim()?d(l,m,n):alert("Debe ingresar una cantidad válida y una razón.")},children:"Aplicar Ajuste"})]})]})})},yr=({onClose:o})=>{const[l,f]=r.useState([]),[d,x]=r.useState(!0),[u,n]=r.useState(""),[i,v]=r.useState(""),[y,p]=r.useState(""),[m,S]=r.useState(""),_=r.useCallback(async()=>{var w;x(!0),n("");try{const g=localStorage.getItem("token"),s=new URLSearchParams;i&&s.append("startDate",i),y&&s.append("endDate",y),m&&s.append("search",m);const j=await Z.get(`/api/products/inventory/history?${s.toString()}`,{headers:{Authorization:`Bearer ${g}`}});f(Array.isArray(j.data)?j.data:Array.isArray((w=j.data)==null?void 0:w.history)?j.data.history:[])}catch(g){console.error(g),n("No se pudo cargar el historial.")}finally{x(!1)}},[i,y,m]);r.useEffect(()=>{_()},[_]);const P=()=>{v(""),p(""),S("")};return e.jsx(we,{onClick:o,initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(Pe,{onClick:w=>w.stopPropagation(),$large:!0,children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"},children:[e.jsxs(ze,{style:{margin:0},children:[e.jsx(Ut,{})," Historial de Movimientos"]}),e.jsx("button",{onClick:o,style:{border:"none",background:"transparent",fontSize:"1.2rem",cursor:"pointer"},children:e.jsx(Je,{})})]}),e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:"1rem",marginBottom:"1.5rem",background:"#f8fafc",padding:"1rem",borderRadius:"12px",border:"1px solid #e2e8f0"},children:[e.jsxs(E,{style:{flex:"1 1 200px"},children:[e.jsx(M,{children:"Buscar por Código/Nombre"}),e.jsxs("div",{style:{position:"relative"},children:[e.jsx(pt,{style:{position:"absolute",left:"10px",top:"50%",transform:"translateY(-50%)",color:"#94a3b8"}}),e.jsx(R,{type:"text",placeholder:"Buscar...",value:m,onChange:w=>S(w.target.value),style:{paddingLeft:"32px"}})]})]}),e.jsxs(E,{style:{flex:"1 1 150px"},children:[e.jsx(M,{children:"Fecha Inicio"}),e.jsx(R,{type:"date",value:i,onChange:w=>v(w.target.value)})]}),e.jsxs(E,{style:{flex:"1 1 150px"},children:[e.jsx(M,{children:"Fecha Fin"}),e.jsx(R,{type:"date",value:y,onChange:w=>p(w.target.value)})]}),e.jsxs("div",{style:{display:"flex",alignItems:"flex-end",gap:"0.5rem"},children:[e.jsxs(_e,{type:"button",onClick:_,style:{height:"42px",display:"flex",alignItems:"center",gap:"8px"},children:[e.jsx(pt,{})," Filtrar"]}),e.jsx(Ne,{type:"button",onClick:P,style:{height:"42px"},children:"Limpiar"})]})]}),d?e.jsx("div",{style:{textAlign:"center",padding:"2rem"},children:e.jsx(xt,{})}):u?e.jsx("div",{style:{color:"red",textAlign:"center"},children:u}):e.jsx("div",{style:{overflowX:"auto",maxHeight:"400px"},children:e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",fontSize:"0.9rem"},children:[e.jsx("thead",{style:{position:"sticky",top:0,zIndex:10},children:e.jsxs("tr",{style:{background:"#f7fafc",borderBottom:"2px solid #e2e8f0",textAlign:"left"},children:[e.jsx("th",{style:{padding:"10px"},children:"Fecha"}),e.jsx("th",{style:{padding:"10px"},children:"Producto"}),e.jsx("th",{style:{padding:"10px"},children:"Movimiento"}),e.jsx("th",{style:{padding:"10px"},children:"Detalles"}),e.jsx("th",{style:{padding:"10px"},children:"Usuario"})]})}),e.jsxs("tbody",{children:[(Array.isArray(l)?l:[]).map(w=>e.jsxs("tr",{style:{borderBottom:"1px solid #edf2f7"},children:[e.jsx("td",{style:{padding:"10px"},children:new Date(w.fecha).toLocaleString()}),e.jsx("td",{style:{padding:"10px",fontWeight:"600"},children:w.nombre_producto||w.codigo_producto||"N/A"}),e.jsx("td",{style:{padding:"10px"},children:e.jsx("span",{style:{padding:"2px 6px",borderRadius:"4px",fontSize:"0.8rem",fontWeight:"bold",background:w.tipo_movimiento==="VENTA"?"#c6f6d5":w.tipo_movimiento==="CREACION"?"#bee3f8":"#fed7d7",color:w.tipo_movimiento==="VENTA"?"#22543d":w.tipo_movimiento==="CREACION"?"#2b6cb0":"#822727"},children:w.tipo_movimiento})}),e.jsx("td",{style:{padding:"10px",color:"#4a5568"},children:w.detalles}),e.jsx("td",{style:{padding:"10px",color:"#718096"},children:w.nombre_usuario||"Sistema"})]},w.id_movimiento)),(!Array.isArray(l)||l.length===0)&&e.jsx("tr",{children:e.jsx("td",{colSpan:"5",style:{textAlign:"center",padding:"20px"},children:"No hay movimientos registrados para estos filtros."})})]})]})}),e.jsx(qe,{children:e.jsx(Ne,{onClick:o,children:"Cerrar"})})]})})},jr=({isOpen:o,onClose:l,onSave:f,categories:d,providers:x,allProductsRaw:u})=>{const[n,i]=r.useState({codigo:"",nombre:"",costo:"",venta:"",mayoreo:"",id_categoria:"",existencia:"",minimo:"",maximo:"",tipo_venta:"Unidad",id_proveedor:"",descripcion:"",imagen:null}),[v,y]=r.useState(""),[p,m]=r.useState(""),S=g=>{const{name:s,value:j}=g.target,z={...n,[s]:j};if(s==="costo"||s==="venta"){const L=parseFloat(z.costo),q=parseFloat(z.venta);y(L>0&&q>0?((q-L)/L*100).toFixed(2):"")}i(z),m("")},_=g=>i(s=>({...s,imagen:g})),P=g=>{const s=g.target.value;y(s);const j=parseFloat(n.costo);j>0&&s&&i(z=>({...z,venta:(j*(1+parseFloat(s)/100)).toFixed(2)}))},w=g=>{g.preventDefault(),m("");const s=n;if(["codigo","nombre","costo","venta","existencia"].some(T=>!s[T]||!String(s[T]).trim())){m("Código, Nombre, Costo, Venta y Existencia son obligatorios.");return}const z=parseFloat(s.costo),L=parseFloat(s.venta),q=s.mayoreo?parseFloat(s.mayoreo):null,G=parseInt(s.existencia,10);if(s.minimo&&parseInt(s.minimo,10),s.maximo&&parseInt(s.maximo,10),[z,L,G].some(isNaN)){m("Costo, Venta y Existencia deben ser números válidos.");return}if(s.mayoreo&&isNaN(q)){m("Precio Mayoreo debe ser un número válido o estar vacío.");return}if(z<0||L<0||G<0){m("Precios y cantidades no pueden ser negativos.");return}if(L<z){m("El precio de venta no puede ser menor que el costo.");return}const pe=(Array.isArray(u)?u:[]).find(T=>{var me,W;return((me=T.codigo)==null?void 0:me.toLowerCase())===s.codigo.trim().toLowerCase()||((W=T.nombre)==null?void 0:W.toLowerCase())===s.nombre.trim().toLowerCase()});if(pe){(pe.codigo||"").toLowerCase()===s.codigo.trim().toLowerCase()?m(`Ya existe un producto con el código "${s.codigo}".`):m(`Ya existe un producto con el nombre "${s.nombre}".`);return}f({...s,mayoreo:s.mayoreo||null,minimo:s.minimo||null,maximo:s.maximo||null,id_categoria:s.id_categoria||null,id_proveedor:s.id_proveedor||null})};return o?e.jsx(we,{onClick:l,initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsx(Ae.div,{initial:{y:-50,opacity:0},animate:{y:0,opacity:1},exit:{y:50,opacity:0},style:{width:"100%",maxWidth:"700px"},children:e.jsx(Pe,{as:"div",onClick:g=>g.stopPropagation(),children:e.jsxs("form",{onSubmit:w,children:[e.jsx(ze,{children:"Crear Nuevo Producto"}),p&&e.jsx(Ht,{children:p}),e.jsx(Qt,{currentImage:n.imagen,onImageChange:_}),e.jsxs(Gt,{children:[e.jsxs(E,{children:[e.jsx(M,{children:"Código"}),e.jsx(R,{name:"codigo",value:n.codigo,onChange:S,required:!0})]}),e.jsxs(E,{children:[e.jsx(M,{children:"Nombre"}),e.jsx(R,{name:"nombre",value:n.nombre,onChange:S,required:!0})]}),e.jsxs(E,{children:[e.jsx(M,{children:"Costo (C$)"}),e.jsx(R,{type:"number",step:"0.01",name:"costo",value:n.costo,onChange:S,required:!0})]}),e.jsxs(E,{children:[e.jsx(M,{children:"% Ganancia"}),e.jsx(R,{type:"number",step:"0.01",value:v,onChange:P,placeholder:"ej: 50"})]}),e.jsxs(E,{children:[e.jsx(M,{children:"Precio Venta (C$)"}),e.jsx(R,{type:"number",step:"0.01",name:"venta",value:n.venta,onChange:S,required:!0})]}),e.jsxs(E,{children:[e.jsx(M,{children:"Precio Mayoreo (C$)"}),e.jsx(R,{type:"number",step:"0.01",name:"mayoreo",value:n.mayoreo,onChange:S})]}),e.jsxs(E,{children:[e.jsx(M,{children:"Existencia Inicial"}),e.jsx(R,{type:"number",inputMode:"numeric",pattern:"[0-9]*",name:"existencia",value:n.existencia,onChange:S,required:!0})]}),e.jsxs(E,{children:[e.jsx(M,{children:"Stock Mínimo"}),e.jsx(R,{type:"number",inputMode:"numeric",pattern:"[0-9]*",name:"minimo",value:n.minimo,onChange:S})]}),e.jsxs(E,{children:[e.jsx(M,{children:"Stock Máximo"}),e.jsx(R,{type:"number",inputMode:"numeric",pattern:"[0-9]*",name:"maximo",value:n.maximo,onChange:S})]}),e.jsxs(E,{children:[e.jsx(M,{children:"Descripción"}),e.jsx(R,{name:"descripcion",value:n.descripcion,onChange:S,placeholder:"Detalles del producto"})]}),e.jsxs(E,{children:[e.jsx(M,{children:"Categoría"}),e.jsxs(de,{name:"id_categoria",value:n.id_categoria,onChange:S,children:[e.jsx("option",{value:"",children:"-- Sin Categoría --"}),(Array.isArray(d)?d:[]).map(g=>e.jsx("option",{value:g.id_categoria,children:g.nombre},g.id_categoria))]})]}),e.jsxs(E,{children:[e.jsx(M,{children:"Proveedor"}),e.jsxs(de,{name:"id_proveedor",value:n.id_proveedor,onChange:S,children:[e.jsx("option",{value:"",children:"-- Sin Proveedor --"}),(Array.isArray(x)?x:[]).map(g=>e.jsx("option",{value:g.id_proveedor,children:g.nombre},g.id_proveedor))]})]}),e.jsxs(E,{children:[e.jsx(M,{children:"Tipo de Venta"}),e.jsxs(de,{name:"tipo_venta",value:n.tipo_venta,onChange:S,children:[e.jsx("option",{value:"Unidad",children:"Unidad"}),e.jsx("option",{value:"Juego",children:"Juego"}),e.jsx("option",{value:"Kit",children:"Kit"})]})]})]}),e.jsxs(qe,{children:[e.jsx(Ne,{type:"button",onClick:l,children:"Cancelar"}),e.jsx(_e,{type:"submit",children:"Crear Producto"})]})]})})})}):null},vr=({isOpen:o,onClose:l,onSave:f,productToEdit:d,categories:x,providers:u,allProductsRaw:n})=>{const[i,v]=r.useState({}),[y,p]=r.useState(""),[m,S]=r.useState("");r.useEffect(()=>{if(d){v({...d,mayoreo:d.mayoreo??"",minimo:d.minimo??"",maximo:d.maximo??"",id_categoria:d.id_categoria??"",id_proveedor:d.id_proveedor??"",descripcion:d.descripcion??"",imagen:d.imagen??null});const s=parseFloat(d.costo),j=parseFloat(d.venta);p(s>0&&j>0?((j-s)/s*100).toFixed(2):""),S("")}},[d]);const _=s=>{const{name:j,value:z}=s.target;if(j==="existencia")return;const L={...i,[j]:z};if(j==="costo"||j==="venta"){const q=parseFloat(L.costo),G=parseFloat(L.venta);p(q>0&&G>0?((G-q)/q*100).toFixed(2):"")}v(L),S("")},P=s=>v(j=>({...j,imagen:s})),w=s=>{const j=s.target.value;p(j);const z=parseFloat(i.costo);z>0&&j&&v(L=>({...L,venta:(z*(1+parseFloat(j)/100)).toFixed(2)}))},g=s=>{s.preventDefault(),S("");const j=i;if(!j.codigo||!j.nombre||!j.costo||!j.venta){S("Código, Nombre, Costo y Venta son obligatorios.");return}if(parseFloat(j.venta)<parseFloat(j.costo)){S("El precio de venta no puede ser menor que el costo.");return}if(n.find(G=>{var se,pe;return G.id_producto!==d.id_producto&&(((se=G.codigo)==null?void 0:se.toLowerCase())===j.codigo.trim().toLowerCase()||((pe=G.nombre)==null?void 0:pe.toLowerCase())===j.nombre.trim().toLowerCase())})){S("Ya existe otro producto con ese código o nombre.");return}const{existencia:L,...q}={...j,mayoreo:j.mayoreo||null,minimo:j.minimo||null,maximo:j.maximo||null,id_categoria:j.id_categoria||null,id_proveedor:j.id_proveedor||null};f(q,d.id_producto)};return!o||!d?null:e.jsx(we,{onClick:l,initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsx(Ae.div,{initial:{y:-50,opacity:0},animate:{y:0,opacity:1},exit:{y:50,opacity:0},style:{width:"100%",maxWidth:"550px"},children:e.jsx(Pe,{as:"div",onClick:s=>s.stopPropagation(),children:e.jsxs("form",{onSubmit:g,children:[e.jsx(ze,{children:"Editar Producto"}),m&&e.jsx(Ht,{children:m}),e.jsx(Qt,{currentImage:i.imagen,onImageChange:P}),e.jsxs(Gt,{children:[e.jsxs(E,{children:[e.jsx(M,{children:"Código"}),e.jsx(R,{name:"codigo",value:i.codigo||"",onChange:_,required:!0})]}),e.jsxs(E,{children:[e.jsx(M,{children:"Nombre"}),e.jsx(R,{name:"nombre",value:i.nombre||"",onChange:_,required:!0})]}),e.jsxs(E,{children:[e.jsx(M,{children:"Costo (C$)"}),e.jsx(R,{type:"number",step:"0.01",name:"costo",value:i.costo||"",onChange:_,required:!0})]}),e.jsxs(E,{children:[e.jsx(M,{children:"% Ganancia"}),e.jsx(R,{type:"number",step:"0.01",value:y||"",onChange:w,placeholder:"ej: 50"})]}),e.jsxs(E,{children:[e.jsx(M,{children:"Precio Venta (C$)"}),e.jsx(R,{type:"number",step:"0.01",name:"venta",value:i.venta||"",onChange:_,required:!0})]}),e.jsxs(E,{children:[e.jsx(M,{children:"Precio Mayoreo (C$)"}),e.jsx(R,{type:"number",step:"0.01",name:"mayoreo",value:i.mayoreo||"",onChange:_})]}),e.jsxs(E,{children:[e.jsx(M,{children:"Existencia"}),e.jsx(R,{name:"existencia",value:i.existencia||"",disabled:!0,style:{backgroundColor:"#f0f0f0"}}),e.jsx("small",{style:{marginTop:"5px",color:"#dc3545",fontWeight:"bold"},children:"¡Ajustar solo con el botón de stock!"})]}),e.jsxs(E,{children:[e.jsx(M,{children:"Stock Mínimo"}),e.jsx(R,{type:"number",inputMode:"numeric",pattern:"[0-9]*",name:"minimo",value:i.minimo||"",onChange:_})]}),e.jsxs(E,{children:[e.jsx(M,{children:"Stock Máximo"}),e.jsx(R,{type:"number",inputMode:"numeric",pattern:"[0-9]*",name:"maximo",value:i.maximo||"",onChange:_})]}),e.jsxs(E,{children:[e.jsx(M,{children:"Descripción"}),e.jsx(R,{name:"descripcion",value:i.descripcion||"",onChange:_,placeholder:"Detalles del producto"})]}),e.jsxs(E,{children:[e.jsx(M,{children:"Categoría"}),e.jsxs(de,{name:"id_categoria",value:i.id_categoria||"",onChange:_,children:[e.jsx("option",{value:"",children:"-- Sin Categoría --"}),(Array.isArray(x)?x:[]).map(s=>e.jsx("option",{value:s.id_categoria,children:s.nombre},s.id_categoria))]})]}),e.jsxs(E,{children:[e.jsx(M,{children:"Proveedor"}),e.jsxs(de,{name:"id_proveedor",value:i.id_proveedor||"",onChange:_,children:[e.jsx("option",{value:"",children:"-- Sin Proveedor --"}),(Array.isArray(u)?u:[]).map(s=>e.jsx("option",{value:s.id_proveedor,children:s.nombre},s.id_proveedor))]})]}),e.jsxs(E,{children:[e.jsx(M,{children:"Tipo de Venta"}),e.jsxs(de,{name:"tipo_venta",value:i.tipo_venta||"Unidad",onChange:_,children:[e.jsx("option",{value:"Unidad",children:"Unidad"}),e.jsx("option",{value:"Juego",children:"Juego"}),e.jsx("option",{value:"Kit",children:"Kit"})]})]})]}),e.jsxs(qe,{children:[e.jsx(Ne,{type:"button",onClick:l,children:"Cancelar"}),e.jsx(_e,{type:"submit",children:"Guardar Cambios"})]})]})})})})},Ar=()=>{var ce,ne,ye;const{globalReservations:o,socket:l}=yo(),[f,d]=r.useState([]),[x,u]=r.useState([]),[n,i]=r.useState([]),[v,y]=r.useState([]),[p,m]=r.useState(!1),[S,_]=r.useState(""),[P,w]=r.useState("description"),[g,s]=r.useState("name-asc"),j=r.useDeferredValue(S),z=r.useRef(null),[L,q]=r.useState(""),[G,se]=r.useState(""),[pe,T]=r.useState(null),me=r.useMemo(()=>new Audio("/sounds/success.mp3"),[]),W=r.useMemo(()=>new Audio("/sounds/error.mp3"),[]),[Xe,X]=r.useState(!1),[Ke,oe]=r.useState(!1),[$e,Ze]=r.useState(null),[fe,Ee]=r.useState(!1),[K,he]=r.useState(null),[re,et]=r.useState(!1),[Ce,Me]=r.useState(!1),[tt,be]=r.useState(!1),[Le,Oe]=r.useState(!1),[Be,Ie]=r.useState(null),[Ve,Ue]=r.useState({isOpen:!1,product:null}),[We,xe]=r.useState({isOpen:!1,title:"",message:""}),[A,le]=r.useState({open:!1,product:null,detail:null}),[ae,ke]=r.useState(1),[Fe,He]=r.useState({isOpen:!1,imageUrl:null});r.useEffect(()=>{ke(1)},[j,L,G,P,g]),r.useEffect(()=>{window.scrollTo({top:0,behavior:"smooth"})},[ae]);const Q=r.useCallback(({title:a,message:C,type:c})=>xe({isOpen:!0,title:a,message:C,type:c}),[]),ut=()=>xe({isOpen:!1}),ot=r.useCallback(async()=>{const a=localStorage.getItem("token"),c=(await Z.get(`${ee}/products`,{headers:{Authorization:`Bearer ${a}`}})).data;if(Array.isArray(c))return c;if(c&&Array.isArray(c.products))return c.products;if(c&&Array.isArray(c.data))return c.data;if(c&&Array.isArray(c.items))return c.items;if(c&&(c.msg||c.message||c.error))throw new Error(c.msg||c.message||c.error);return[]},[]),Y=r.useCallback(async()=>{var a,C,c,k,F,J,Qe,jt;try{T(null);const B=localStorage.getItem("token"),[H,je,ve]=await Promise.all([ot(),Z.get(`${ee}/categories`,{headers:{Authorization:`Bearer ${B}`}}),Z.get(`${ee}/providers`,{headers:{Authorization:`Bearer ${B}`}})]),_t=Array.isArray(H)?H:[];d(_t);const Yt=_t.map(ue=>{if(!ue||typeof ue!="object")return null;const $t=ue.nombre??"",Et=ue.codigo??"",Jt=ue.descripcion??"",Xt=`${Ye($t)}|${Ye(Et)}|${Ye(Jt)}`,Kt=[Ye($t),Ye(Et)],Mt=Number(ue.costo||0),Zt=Number(ue.venta||0),eo=Number(ue.existencia||0);return{...ue,__fmt:{costo:`C$${Mt.toFixed(2)}`,venta:`C$${Zt.toFixed(2)}`,costoTotal:`C$${(Mt*eo).toFixed(2)}`},q:Xt,qStarts:Kt}}).filter(Boolean);u(Yt),i(Array.isArray(je==null?void 0:je.data)?je.data:Array.isArray((a=je==null?void 0:je.data)==null?void 0:a.categories)?je.data.categories:[]),y(Array.isArray(ve==null?void 0:ve.data)?ve.data:Array.isArray((C=ve==null?void 0:ve.data)==null?void 0:C.providers)?ve.data.providers:[]),T(null)}catch(B){if(console.error("InventoryManagement fetchData error:",B),((c=B==null?void 0:B.response)==null?void 0:c.status)===401||((k=B==null?void 0:B.response)==null?void 0:k.status)===403)T("Tu sesión ha expirado o no es válida. Por favor inicia sesión nuevamente.");else{let H=((J=(F=B==null?void 0:B.response)==null?void 0:F.data)==null?void 0:J.msg)||((jt=(Qe=B==null?void 0:B.response)==null?void 0:Qe.data)==null?void 0:jt.message)||(B==null?void 0:B.message);(!H||typeof H!="string"||H.includes("is not a function")||H.includes("Cannot read properties")||H.includes("undefined"))&&(H="Error al cargar los datos del inventario. Por favor, verifica tu conexión e intenta de nuevo."),T(H)}}finally{m(!0)}},[ot]);r.useEffect(()=>{Y()},[Y]),r.useEffect(()=>{if(!l)return;const a=()=>{Y()};return l.on("inventory_update",a),l.on("products:update",a),()=>{l.off("inventory_update",a),l.off("products:update",a)}},[l,Y]);const{filtered:Se,totalFilteredCount:Ge}=r.useMemo(()=>{const a=P==="code",C=String(L||""),c=String(G||"");let k=Array.isArray(x)?x:[];C&&(k=k.filter(B=>String(B.id_categoria)===C)),c&&(k=k.filter(B=>String(B.id_proveedor)===c));let F=vo(k,j,a?["codigo","codigo_barras"]:["nombre","codigo","descripcion"],{strict:a});j||F.sort((B,H)=>{switch(g){case"name-asc":return(B.nombre||"").localeCompare(H.nombre||"");case"name-desc":return(H.nombre||"").localeCompare(B.nombre||"");case"stock-asc":return(B.existencia||0)-(H.existencia||0);case"stock-desc":return(H.existencia||0)-(B.existencia||0);case"price-asc":return(B.venta||0)-(H.venta||0);case"price-desc":return(H.venta||0)-(B.venta||0);default:return 0}});const J=F.length,Qe=(ae-1)*kt;return{filtered:F.slice(Qe,Qe+kt),totalFilteredCount:J}},[x,j,L,G,ae,P,g]),gt=()=>X(!0),ft=async a=>{let C=null;const c=lt(a.id_producto);if(c&&c!=="loading"&&c!=="none")C=c;else if(c!=="none")try{const k=localStorage.getItem("token"),F=await zt(a.id_producto,k);C=(F==null?void 0:F.imagen)||null,ct(a.id_producto,C||"none")}catch{}Ze({...a,imagen:C}),oe(!0)},ht=a=>{he(a),Ee(!0)},bt=async a=>{var C,c;try{console.log("CLIENT SENDING CREATE PAYLOAD:",{...a,imagenLength:a.imagen?a.imagen.length:"NULL"});const k=localStorage.getItem("token");await Z.post(`${ee}/products`,a,{headers:{Authorization:`Bearer ${k}`}}),X(!1),me.currentTime=0,me.play().catch(F=>console.warn(F)),Q({title:"✅ Éxito",message:"Producto creado correctamente."}),await Y()}catch(k){console.error("CLIENT CREATE ERROR:",k),W.currentTime=0,W.play().catch(F=>console.warn(F)),Q({title:"❌ Error",message:((c=(C=k.response)==null?void 0:C.data)==null?void 0:c.msg)||"Error al crear el producto.",type:"error"})}},yt=async(a,C)=>{var c,k;try{console.log("CLIENT SENDING UPDATE PAYLOAD:",{...a,imagenLength:a.imagen?a.imagen.length:"NULL"});const F=localStorage.getItem("token");await Z.put(`${ee}/products/${C}`,a,{headers:{Authorization:`Bearer ${F}`}}),oe(!1),jo(C),me.currentTime=0,me.play().catch(J=>console.warn(J)),Q({title:"✅ Éxito",message:"Producto actualizado correctamente."}),await Y()}catch(F){console.error("CLIENT UPDATE ERROR:",F),W.currentTime=0,W.play().catch(J=>console.warn(J)),Q({title:"❌ Error",message:((k=(c=F.response)==null?void 0:c.data)==null?void 0:k.msg)||"Error al actualizar el producto.",type:"error"})}},t=async()=>{var a;if(K)try{const C=localStorage.getItem("token");await Z.delete(`${ee}/products/${K.id_producto}`,{headers:{Authorization:`Bearer ${C}`}}),await Y(),Ee(!1),he(null),Q({title:"Éxito",message:`El producto ${K.nombre} fue eliminado.`})}catch(C){const c=(a=C==null?void 0:C.response)==null?void 0:a.data,k=(c==null?void 0:c.msg)||"No se pudo eliminar el producto.";Q({title:"Error",message:k,type:"error"}),c!=null&&c.reasons&&le({open:!0,product:K,detail:c.reasons})}},N=async a=>{var C,c;try{const k=localStorage.getItem("token");await Z.patch(`${ee}/products/${a.id_producto}/archive`,{},{headers:{Authorization:`Bearer ${k}`}}),le({open:!1,product:null,detail:null}),Ee(!1),he(null),await Y(),Q({title:"Archivado",message:`"${a.nombre}" fue archivado (inactivo).`})}catch(k){Q({title:"Error",message:((c=(C=k==null?void 0:k.response)==null?void 0:C.data)==null?void 0:c.msg)||"No se pudo archivar el producto.",type:"error"})}},h=async(a,C,c)=>{var k,F;try{const J=localStorage.getItem("token");await Z.patch(`${ee}/products/${a.id_producto}/stock`,{cantidad:C,razon:c},{headers:{Authorization:`Bearer ${J}`}}),Ue({isOpen:!1,product:null}),Q({title:"Éxito",message:"Stock actualizado correctamente."}),await Y()}catch(J){Q({title:"Error",message:((F=(k=J.response)==null?void 0:k.data)==null?void 0:F.msg)||"No se pudo ajustar el stock."})}},$=async a=>{var C,c;try{const k=localStorage.getItem("token");await Z.post(`${ee}/categories`,{nombre:a},{headers:{Authorization:`Bearer ${k}`}}),await Y()}catch(k){Q({title:"Error",message:((c=(C=k.response)==null?void 0:C.data)==null?void 0:c.msg)||"No se pudo agregar la categoría."})}},I=async a=>{var C,c;try{const k=localStorage.getItem("token");await Z.delete(`${ee}/categories/${a}`,{headers:{Authorization:`Bearer ${k}`}}),await Y()}catch(k){Q({title:"Error",message:((c=(C=k.response)==null?void 0:C.data)==null?void 0:c.msg)||"No se pudo eliminar la categoría. (Verifique que no esté en uso)"})}},D=async a=>{var C,c;try{const k=localStorage.getItem("token");await Z.post(`${ee}/providers`,{nombre:a},{headers:{Authorization:`Bearer ${k}`}}),await Y()}catch(k){Q({title:"Error",message:((c=(C=k.response)==null?void 0:C.data)==null?void 0:c.msg)||"No se pudo agregar el proveedor."})}},V=async a=>{var C,c;try{const k=localStorage.getItem("token");await Z.delete(`${ee}/providers/${a}`,{headers:{Authorization:`Bearer ${k}`}}),await Y()}catch(k){Q({title:"Error",message:((c=(C=k.response)==null?void 0:C.data)==null?void 0:c.msg)||"No se pudo eliminar el proveedor. (Verifique que no esté en uso)"})}};if(!p)return e.jsx(Ct,{children:e.jsxs(qt,{children:[e.jsx(xt,{}),e.jsx("p",{children:"Cargando Inventario..."})]})});if(pe)return e.jsx(Ct,{children:e.jsxs(qt,{style:{color:"#c53030"},children:[e.jsx(so,{style:{fontSize:"2.5rem",marginBottom:"1rem",color:"#e53e3e"}}),e.jsx("p",{style:{marginBottom:"0.5rem",fontWeight:600,fontSize:"1.1rem"},children:pe}),e.jsx("p",{style:{color:"#718096",fontSize:"0.9rem",marginBottom:"1.5rem"},children:"Verifica tu conexión a internet e intenta nuevamente."}),e.jsx(ge,{primary:!0,onClick:()=>{m(!1),T(null),Y()},children:"Reintentar"})]})});const O=Se.length<=gr,U=Math.ceil(Ge/kt);return e.jsxs(Ct,{children:[e.jsxs(Ko,{to:"/dashboard",children:[e.jsx(Nt,{})," Volver al Dashboard"]}),e.jsxs(Zo,{children:[e.jsxs(er,{children:[e.jsx(lo,{})," Gestión de Inventario"]}),e.jsxs(tr,{children:[e.jsxs(ge,{primary:!0,onClick:gt,children:[e.jsx(mt,{})," Crear Producto"]}),e.jsxs(ge,{secondary:!0,onClick:()=>{Ie(null),Oe(!0)},title:"Generador de Etiquetas / QR en Hoja A4",children:[e.jsx(Te,{})," Etiquetas A4"]}),e.jsxs(ge,{secondary:!0,onClick:()=>et(!0),children:[e.jsx(st,{})," Categorías"]}),e.jsxs(ge,{secondary:!0,onClick:()=>Me(!0),children:[e.jsx(co,{})," Proveedores"]}),e.jsxs(ge,{tertiary:!0,onClick:()=>be(!0),children:[e.jsx(Ut,{})," Historial"]})]})]}),e.jsxs(or,{children:[e.jsxs("div",{style:{display:"flex",gap:"0.5rem"},children:[e.jsxs(rr,{style:{flex:1},children:[e.jsx(pt,{style:{position:"absolute",left:12,top:14,color:"#a0aec0"}}),e.jsx(ar,{ref:z,placeholder:P==="code"?"Buscar código...":"Buscar nombre...",value:S,onChange:a=>_(a.target.value),autoComplete:"off",autoCorrect:"off",spellCheck:!1})]}),e.jsx(Lt,{$active:P==="description",onClick:()=>w("description"),title:"Por Nombre",children:e.jsx(po,{})}),e.jsx(Lt,{$active:P==="code",onClick:()=>w("code"),title:"Por Código",children:e.jsx(Te,{})})]}),e.jsxs(de,{value:L,onChange:a=>q(a.target.value),children:[e.jsx("option",{value:"",children:"Todas las categorías"}),(Array.isArray(n)?n:[]).map(a=>e.jsx("option",{value:a.id_categoria,children:a.nombre},a.id_categoria))]}),e.jsxs(de,{value:G,onChange:a=>se(a.target.value),children:[e.jsx("option",{value:"",children:"Todos los proveedores"}),(Array.isArray(v)?v:[]).map(a=>e.jsx("option",{value:a.id_proveedor,children:a.nombre},a.id_proveedor))]}),e.jsxs(de,{value:g,onChange:a=>s(a.target.value),style:{border:"1px solid #6366f1",background:"#f5f3ff"},children:[e.jsxs("optgroup",{label:"Nombre",children:[e.jsx("option",{value:"name-asc",children:"Nombre (A-Z)"}),e.jsx("option",{value:"name-desc",children:"Nombre (Z-A)"})]}),e.jsxs("optgroup",{label:"Existencia",children:[e.jsx("option",{value:"stock-asc",children:"Existencia (Menor a Mayor)"}),e.jsx("option",{value:"stock-desc",children:"Existencia (Mayor a Menor)"})]}),e.jsxs("optgroup",{label:"Precio",children:[e.jsx("option",{value:"price-asc",children:"Precio (Menor a Mayor)"}),e.jsx("option",{value:"price-desc",children:"Precio (Mayor a Menor)"})]})]})]}),e.jsxs("div",{style:{textAlign:"right",marginBottom:".5rem",color:"#4a5568",fontWeight:"bold",fontSize:"0.9rem"},children:["Página ",ae," de ",U||1," | Mostrando ",(Array.isArray(Se)?Se:[]).length," de ",Ge," productos filtrados"]}),e.jsx(nr,{children:(Array.isArray(Se)?Se:[]).map(a=>{const C=O?{initial:{opacity:0,y:12},animate:{opacity:1,y:0},transition:{duration:.12}}:{},c=a.existencia>0&&a.existencia<=(a.minimo||5),k=a.existencia<=0;return e.jsxs(ir,{...C,children:[e.jsx(fr,{productId:a.id_producto,productName:a.nombre,onViewFull:F=>He({isOpen:!0,productId:a.id_producto,imageUrl:F})}),e.jsxs(sr,{children:[e.jsx(lr,{title:a.nombre,children:a.nombre}),e.jsxs(cr,{children:["Código: ",a.codigo]})]}),e.jsxs(dr,{children:[e.jsxs(dt,{children:[e.jsx("span",{children:"Costo"}),e.jsx("strong",{children:a.__fmt.costo})]}),e.jsxs(dt,{children:[e.jsx("span",{children:"Venta"}),e.jsx("strong",{children:a.__fmt.venta})]}),(()=>{var J;const F=Number(((J=o==null?void 0:o.totalByProduct)==null?void 0:J[a.id_producto])||0);return e.jsxs(pr,{$low:c,$out:k,children:[e.jsx("span",{children:"Existencia"}),e.jsxs("strong",{children:[a.existencia,F>0&&e.jsxs("span",{style:{fontSize:"0.72rem",color:"#f59e0b",display:"block",fontWeight:600},children:["(",F," en caja)"]})]})]})})(),e.jsxs(dt,{children:[e.jsx("span",{children:"Costo Total"}),e.jsx("strong",{children:a.__fmt.costoTotal})]})]}),e.jsxs(mr,{children:[e.jsx(it,{className:"label",title:"Generar Etiquetas A4",onClick:()=>{Ie(a),Oe(!0)},children:e.jsx(Te,{})}),e.jsxs(it,{className:"adjust",title:"Ajustar Stock",onClick:()=>Ue({isOpen:!0,product:a}),children:[e.jsx(mo,{}),e.jsx(xo,{style:{marginLeft:4}})]}),e.jsxs(it,{className:"edit",onClick:()=>ft(a),children:[e.jsx(uo,{})," Editar"]}),e.jsxs(it,{className:"delete",onClick:()=>ht(a),children:[e.jsx(At,{})," Eliminar"]})]})]},a.id_producto)})}),Ge>0&&e.jsxs("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",gap:"1.5rem",marginTop:"2rem",marginBottom:"3rem"},children:[e.jsx(ge,{secondary:!0,onClick:()=>ke(a=>Math.max(1,a-1)),disabled:ae===1,children:"Anterior"}),e.jsx("div",{style:{display:"flex",gap:"8px"},children:[...Array(U)].map((a,C)=>{const c=C+1;return U>7&&c>2&&c<U-1&&Math.abs(c-ae)>1?c===3||c===U-2?e.jsx("span",{children:"..."},c):null:e.jsx(ge,{secondary:c!==ae,primary:c===ae,style:{minWidth:"40px",padding:"0.5rem"},onClick:()=>ke(c),children:c},c)})}),e.jsx(ge,{secondary:!0,onClick:()=>ke(a=>Math.min(U,a+1)),disabled:ae===U,children:"Siguiente"})]}),e.jsx(te,{children:Xe&&e.jsx(jr,{isOpen:Xe,onClose:()=>X(!1),onSave:bt,categories:n,providers:v,allProductsRaw:f})}),e.jsx(te,{children:Ke&&e.jsx(vr,{isOpen:Ke,onClose:()=>oe(!1),onSave:yt,productToEdit:$e,categories:n,providers:v,allProductsRaw:f})}),e.jsx(te,{children:fe&&e.jsx(Ot,{open:fe,title:"Confirmar Eliminación",message:`¿Estás seguro de que quieres eliminar el producto "${K==null?void 0:K.nombre}"?`,onCancel:()=>Ee(!1),onConfirm:t,confirmLabel:"Sí, eliminar",danger:!0})}),e.jsx(te,{children:A.open&&e.jsx(Ot,{open:A.open,title:"Eliminación bloqueada",message:e.jsxs("div",{style:{textAlign:"left",lineHeight:1.6},children:["Este producto tiene referencias y no puede eliminarse.",e.jsx("br",{}),e.jsx("strong",{children:"Referencias:"}),e.jsx("br",{}),"Ventas: ",((ce=A.detail)==null?void 0:ce.ventas)??0,e.jsx("br",{}),"Compras: ",((ne=A.detail)==null?void 0:ne.compras)??0,e.jsx("br",{}),"Movimientos (kardex): ",((ye=A.detail)==null?void 0:ye.kardex)??0,e.jsx("br",{}),e.jsx("br",{}),"Puedes ",e.jsx("strong",{children:"archivarlo"})," para ocultarlo del sistema sin perder historial."]}),onCancel:()=>le({open:!1,product:null,detail:null}),onConfirm:()=>N(A.product),confirmLabel:"Archivar producto",danger:!1})}),e.jsx(te,{children:re&&e.jsx(Vt,{title:"Gestionar Categorías",items:n,onAdd:$,onDelete:I,onClose:()=>et(!1)})}),e.jsx(te,{children:Ce&&e.jsx(Vt,{title:"Gestionar Proveedores",items:v,onAdd:D,onDelete:V,onClose:()=>Me(!1)})}),e.jsx(te,{children:tt&&e.jsx(yr,{onClose:()=>be(!1)})}),e.jsx(te,{children:Ve.isOpen&&e.jsx(br,{isOpen:Ve.isOpen,product:Ve.product,onClose:()=>Ue({isOpen:!1,product:null}),onConfirm:h})}),e.jsx(te,{children:We.isOpen&&e.jsx(hr,{isOpen:We.isOpen,onClose:ut,title:We.title,message:We.message})}),e.jsx(te,{children:Fe.isOpen&&e.jsx(xr,{isOpen:Fe.isOpen,productId:Fe.productId,imageSrc:Fe.imageUrl,onClose:()=>He({isOpen:!1,productId:null,imageUrl:null})})}),e.jsx(te,{children:Le&&e.jsx(Xo,{isOpen:Le,onClose:()=>{Oe(!1),Ie(null)},products:x,categories:n,initialProduct:Be})})]})};export{Ar as default};

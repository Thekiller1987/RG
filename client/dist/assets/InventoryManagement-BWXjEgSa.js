import{W as kt,r,j as e,A as te,X as Le,Y as eo,Z as to,$ as nt,a0 as oo,k as Ke,a1 as xt,a2 as ut,a3 as Mt,a4 as Nt,a5 as ro,H as ct,a6 as Bt,a7 as ao,a8 as no,a9 as jt,aa as St,ab as It,ac as it,ad as ne,s as f,m as ze,a as Z,ae as io,M as so,P as lo,af as Vt,ag as co,ah as po,ai as mo,aj as xo,t as uo,ak as go,al as At,R as Oe,v as fo,V as ho}from"./vendor-C6IkOdzt.js";import{u as bo,A as ee,g as dt,f as Pt,s as pt,d as yo}from"./index-k4F39zjV.js";import{r as jo}from"./searchEngine-BMYcElFi.js";import"./scanner-vendor-DfxRpMWJ.js";import"./pdf-vendor-CINaEeII.js";const Ft=["0000ff00-0000-1000-8000-00805f9b34fb","0000ffe0-0000-1000-8000-00805f9b34fb","49535343-fe7d-4ae5-8fa9-9fafd205e455","e7810a71-73ae-499d-8c15-faa9aef0c3f2","000018f0-0000-1000-8000-00805f9b34fb","0000fee7-0000-1000-8000-00805f9b34fb","0000ae30-0000-1000-8000-00805f9b34fb"];function Ht(){return typeof navigator<"u"&&!!navigator.bluetooth}async function Rt(o=null){if(!Ht())throw new Error("Tu navegador no soporta Bluetooth Web. Usa Google Chrome o Microsoft Edge en tu PC.");try{const d=await navigator.bluetooth.requestDevice({acceptAllDevices:!0,optionalServices:Ft});o&&d.addEventListener("gattserverdisconnected",o);const h=await d.gatt.connect();let x=null;for(const c of Ft)try{const i=await(await h.getPrimaryService(c)).getCharacteristics();for(const n of i)if(n.properties.write||n.properties.writeWithoutResponse){x=n;break}if(x)break}catch{}if(!x)try{const c=await h.getPrimaryServices();for(const u of c){const i=await u.getCharacteristics();for(const n of i)if(n.properties.write||n.properties.writeWithoutResponse){x=n;break}if(x)break}}catch(c){console.warn("Error al explorar servicios adicionales:",c)}if(!x)throw new Error(`Se conectó a "${d.name||"Dispositivo"}", pero no se encontró un canal de escritura de impresión compatible.`);return{device:d,server:h,characteristic:x,name:d.name||"Impresora Phomemo"}}catch(d){throw d.name==="NotFoundError"?new Error("Búsqueda cancelada: no se seleccionó ninguna impresora."):d}}function vo(o){o&&o.gatt&&o.gatt.connected&&o.gatt.disconnect()}function wo(o,d,h,x,c,u,i=2){const n=d.split(" ");let w="";const j=[];for(let p=0;p<n.length;p++){const m=w+n[p]+" ";if(o.measureText(m).width>c&&p>0){if(j.push(w.trim()),w=n[p]+" ",j.length>=i)break}else w=m}if(w.trim()&&j.length<i&&j.push(w.trim()),j.length===i){let p=j[i-1];for(;o.measureText(p+"...").width>c&&p.length>0;)p=p.slice(0,-1);j[i-1]=p.trim()+"..."}return j.forEach((p,m)=>{o.fillText(p,h,x+m*u)}),j.length*u}function Co(o,d={}){var b;const{showCompany:h=!0,showPrice:x=!0,showCategory:c=!1,codeType:u="barcode",storeName:i="MULTIREPUESTOS RG"}=d,n=384,w=200,j=document.createElement("canvas");j.width=n,j.height=w;const p=j.getContext("2d",{willReadFrequently:!0});p.fillStyle="#ffffff",p.fillRect(0,0,n,w),p.fillStyle="#000000",p.textAlign="center",p.textBaseline="top";let m=6;h?(p.font="bold 13px system-ui, -apple-system, sans-serif",p.letterSpacing="1px",p.fillText(i,n/2,m),m+=16):m+=4,p.font="bold 15px system-ui, -apple-system, sans-serif";const N=o.nombre||"Repuesto",_=wo(p,N,n/2,m,n-20,17,2);m+=_+4;const I=String(o.codigo_barras||o.codigo||"000000");if(u==="barcode"||u==="hybrid")try{const v=document.createElement("canvas");kt(v,I,{format:"CODE128",width:1.6,height:44,displayValue:!1,margin:0,background:"#ffffff",lineColor:"#000000"});const s=v.width,y=v.height,A=Math.min(s,n-24),q=(n-A)/2;p.drawImage(v,q,m,A,44),m+=47}catch(v){console.warn("Error dibujando código de barras en canvas:",v),m+=44}else m+=40;if(p.strokeStyle="#000000",p.lineWidth=1,p.beginPath(),p.moveTo(8,m),p.lineTo(n-8,m),p.stroke(),m+=4,p.textBaseline="middle",p.textAlign="left",p.font="bold 13px monospace, Courier",p.fillText(I,10,m+10),c&&o.categoria_nombre&&(p.font="normal 10px system-ui, sans-serif",p.fillText(String(o.categoria_nombre).slice(0,16),10,m+22)),x){const v=o.precio_venta??o.venta??o.precio??((b=o.__fmt)==null?void 0:b.venta)??0,s=typeof v=="string"&&v.includes("C$")?parseFloat(v.replace(/[^0-9.]/g,"")):parseFloat(v),y=!isNaN(s)&&s>0?`C$ ${s.toFixed(2)}`:"";y&&(p.textAlign="right",p.font="bold 18px system-ui, -apple-system, sans-serif",p.fillText(y,n-10,m+10))}return j}function ko(o){const d=o.getContext("2d"),h=o.width,x=o.height,u=d.getImageData(0,0,h,x).data,i=Math.ceil(h/8),n=[];n.push(27,64),n.push(27,97,1),n.push(31,17,2,4);const w=i&255,j=i>>8&255,p=x&255,m=x>>8&255;n.push(29,118,48,0,w,j,p,m);for(let N=0;N<x;N++)for(let _=0;_<i;_++){let I=0;for(let b=0;b<8;b++){const v=_*8+b;if(v<h){const s=(N*h+v)*4,y=u[s],A=u[s+1],q=u[s+2],D=u[s+3],V=.299*y+.587*A+.114*q;D>128&&V<165&&(I|=1<<7-b)}}n.push(I)}return n.push(27,100,2),n.push(27,100,2),n.push(31,17,8),n.push(31,17,14),n.push(12),new Uint8Array(n)}async function So(o,d,h=null){const c=d.length;let u=0;for(;u<c;){const i=d.slice(u,u+120);o.properties.writeWithoutResponse?await o.writeValueWithoutResponse(i):await o.writeValue(i),u+=120,h&&h(Math.min(100,Math.round(u/c*100))),await new Promise(n=>setTimeout(n,15))}}async function No(o,d,h={},x=null){if(!o)throw new Error("No hay ninguna impresora Bluetooth conectada.");if(!d||d.length===0)throw new Error("No hay etiquetas en la cola para imprimir.");const c=d.length;for(let u=0;u<c;u++){const i=d[u];x&&x({current:u+1,total:c,percentage:Math.round(u/c*100),labelName:i.nombre||"Repuesto"});const n=Co(i,h),w=ko(n);await So(o,w),u<c-1&&await new Promise(j=>setTimeout(j,350))}return x&&x({current:c,total:c,percentage:100,labelName:"Completado"}),{success:!0,count:c}}const st=({value:o,width:d=1.3,height:h=32,displayValue:x=!0,fontSize:c=10})=>{const u=r.useRef(null);return r.useEffect(()=>{if(u.current&&o)try{kt(u.current,String(o),{format:"CODE128",width:d,height:h,displayValue:x,fontSize:c,margin:0,background:"transparent",lineColor:"#000000",fontOptions:"bold",textMargin:1})}catch{try{const n=String(o).replace(/[^a-zA-Z0-9_-]/g,"")||"000000";kt(u.current,n,{format:"CODE128",width:d,height:h,displayValue:x,fontSize:c,margin:0})}catch{console.warn("No se pudo renderizar código de barras:",o)}}},[o,d,h,x,c]),e.jsx("svg",{ref:u,style:{maxWidth:"100%",height:"auto",display:"block",margin:"0 auto"}})},Ao=f(ze.div)`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
`,Po=f(ze.div)`
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
`,zo=f.div`
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
`,_o=f.button`
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
`,vt=f.div`
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
`,$o=f.button`
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
`,Eo=f.div`
  display: grid;
  grid-template-columns: 440px 1fr;
  flex: 1;
  overflow: hidden;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
`,Mo=f.div`
  background: #f8fafc;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`,Bo=f.div`
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
`,Io=f.div`
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
`,Fo=f.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 8px;
`,Ro=f.div`
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
`,qo=f.div`
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
`,Do=f.div`
  display: flex;
  flex-direction: column;
  background: #f1f5f9;
  overflow: hidden;
`,To=f.div`
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
`,Lo=f.div`
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
`,Oo=f.div`
  flex: 1;
  overflow: auto;
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #64748b;
  position: relative;
`,Vo=f.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
`,qt=f.div`
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
`,Ho=f.div`
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
`,Uo=f.div`
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
`,Wo=f.div`
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
`,Go=f.div`
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
`,Qo=f.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.7);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`,Yo=f.div`
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
`;function Jo({isOpen:o,onClose:d,products:h=[],categories:x=[],initialProduct:c=null}){const[u,i]=r.useState([]),[n,w]=r.useState(""),[j,p]=r.useState([]),[m,N]=r.useState("thermal_2x1"),[_,I]=r.useState("single"),[b,v]=r.useState(0),[s,y]=r.useState("bond"),[A,q]=r.useState("barcode"),[D,V]=r.useState("24"),[ie,me]=r.useState(!0),[T,xe]=r.useState(!0),[U,Ze]=r.useState(!0),[J,Xe]=r.useState(!1),[oe,Me]=r.useState(0),[et,he]=r.useState(null),[Be,K]=r.useState(null),[be,re]=r.useState("disconnected"),[tt,ke]=r.useState(""),[Ie,ot]=r.useState(!1),[ye,He]=r.useState({current:0,total:0,percentage:0,labelName:""}),[Ue,Fe]=r.useState(!1);r.useEffect(()=>{c&&o&&i([{product:c,quantity:Math.max(1,Number(c.existencia)||1)}])},[c,o]),r.useEffect(()=>{if(!n.trim()){p([]);return}const t=n.toLowerCase(),S=h.filter(g=>g.nombre&&g.nombre.toLowerCase().includes(t)||g.codigo&&g.codigo.toLowerCase().includes(t)||g.codigo_barras&&g.codigo_barras.toLowerCase().includes(t)).slice(0,10);p(S)},[n,h]);const se=r.useMemo(()=>D==="40"?40:D==="12"?12:24,[D]),P=r.useMemo(()=>{const t=[];return u.forEach(S=>{for(let g=0;g<S.quantity;g++)t.push(S.product)}),t},[u]),le=Math.max(1,Math.ceil(P.length/se));r.useEffect(()=>{oe>=le&&Me(Math.max(0,le-1))},[le,oe]),r.useEffect(()=>{b>=P.length&&v(Math.max(0,P.length-1))},[P.length,b]);const Re=r.useMemo(()=>{const t=oe*se;return P.slice(t,t+se)},[P,oe,se]),We=P[b]||null,je=t=>{i(S=>{const g=S.findIndex(z=>z.product.id_producto===t.id_producto);if(g>=0){const z=[...S];return z[g].quantity+=1,z}return[...S,{product:t,quantity:1}]}),w(""),p([])},qe=(t,S)=>{i(g=>g.map(z=>{if(z.product.id_producto===t){const B=Math.max(1,z.quantity+S);return{...z,quantity:B}}return z}))},ae=(t,S)=>{const g=Math.max(1,parseInt(S)||1);i(z=>z.map(B=>B.product.id_producto===t?{...B,quantity:g}:B))},De=t=>{i(S=>S.map(g=>{if(g.product.id_producto===t){const z=Math.max(1,Number(g.product.existencia)||1);return{...g,quantity:z}}return g}))},Te=t=>{i(S=>S.filter(g=>g.product.id_producto!==t))},rt=()=>{i(t=>t.map(S=>({...S,quantity:1})))},G=()=>{i(t=>t.map(S=>({...S,quantity:Math.max(1,Number(S.product.existencia)||1)})))},ft=()=>{i([]),Me(0),v(0)},at=async()=>{if(!Ht()){ne.error("Tu navegador no soporta Bluetooth Web. Usa Google Chrome o Microsoft Edge en tu PC.");return}try{re("connecting");const t=await Rt(()=>{he(null),K(null),re("disconnected"),ke(""),ne("Impresora Bluetooth desconectada.")});he(t.device),K(t.characteristic),ke(t.name),re("connected"),ne.success(`Conectado a ${t.name}`)}catch(t){re("disconnected"),t.message&&!t.message.includes("cancelada")&&ne.error(t.message||"No se pudo conectar a la impresora Bluetooth.")}},Q=()=>{et&&vo(et),he(null),K(null),re("disconnected"),ke(""),ne("Impresora desconectada")},Se=async()=>{var S;if(P.length===0){ne.error("No hay etiquetas en la bandeja.");return}let t=Be;if(!t||be!=="connected")try{re("connecting");const g=await Rt(()=>{he(null),K(null),re("disconnected"),ke(""),ne("Impresora Bluetooth desconectada.")});t=g.characteristic,he(g.device),K(g.characteristic),ke(g.name),re("connected"),ne.success(`Conectado a ${g.name}`)}catch(g){re("disconnected"),g.message&&!g.message.includes("cancelada")&&ne.error(g.message||"Error al conectar por Bluetooth");return}try{ot(!0),He({current:1,total:P.length,percentage:0,labelName:((S=P[0])==null?void 0:S.nombre)||"Repuesto"}),await No(t,P,{showCompany:T,showPrice:U,showCategory:J,codeType:A,storeName:"MULTIREPUESTOS RG"},g=>{He(g)}),ne.success(`¡${P.length} etiquetas impresas en Phomemo con éxito!`)}catch(g){console.error("Error al imprimir por Bluetooth:",g),ne.error(`Error en la impresión: ${g.message}`)}finally{ot(!1)}},Ge=()=>{if(P.length===0)return;const t=document.createElement("iframe");t.style.position="fixed",t.style.right="0",t.style.bottom="0",t.style.width="0",t.style.height="0",t.style.border="0",document.body.appendChild(t);const S=t.contentWindow.document;let g="";P.forEach(B=>{var Ne;const L=B.codigo_barras||B.codigo||"000000",H=B.precio_venta??B.venta??B.precio??((Ne=B.__fmt)==null?void 0:Ne.venta)??0,O=typeof H=="string"&&H.includes("C$")?parseFloat(H.replace(/[^0-9.]/g,"")):parseFloat(H),X=!isNaN(O)&&O>0?`C$ ${O.toFixed(2)}`:"",ue=B.categoria_nombre||"";let ce="";A==="barcode"?ce=`<svg class="barcode-item" data-code="${L}"></svg>`:A==="qr"?ce=`<div class="qr-item" data-code="${L}"></div>`:ce=`
          <div style="display:flex;align-items:center;justify-content:space-around;width:100%;">
            <svg class="barcode-item" data-code="${L}" style="max-width:70%;height:10mm;"></svg>
            <div class="qr-item" data-code="${L}" style="width:11mm;height:11mm;"></div>
          </div>
        `,g+=`
        <div class="label-page-2x1">
          ${T?`
            <div class="company-header">
              <span class="company-title">Multirepuestos RG</span>
            </div>
          `:""}
          <div class="product-name">${B.nombre||"Repuesto"}</div>
          <div class="code-area">${ce}</div>
          <div class="bottom-info">
            <span class="code-text">${L}</span>
            ${U&&X?`<span class="price-tag">${X}</span>`:""}
            ${J&&ue?`<span class="category-text">${ue}</span>`:""}
          </div>
        </div>
      `});const z=`
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
    `;S.open(),S.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Etiquetas_2x1_Phomemo_Multirepuestos_RG</title>
          <style>${z}</style>
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"><\/script>
          <script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"><\/script>
        </head>
        <body>
          ${g}
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
    `),S.close()},ht=()=>{if(P.length===0)return;const t=document.createElement("iframe");t.style.position="fixed",t.style.right="0",t.style.bottom="0",t.style.width="0",t.style.height="0",t.style.border="0",document.body.appendChild(t);const S=t.contentWindow.document,g=[];for(let L=0;L<P.length;L+=se)g.push(P.slice(L,L+se));let z="";g.forEach(L=>{let H="";L.forEach(O=>{var Qe;const X=O.codigo_barras||O.codigo||"000000",ue=O.precio_venta??O.venta??O.precio??((Qe=O.__fmt)==null?void 0:Qe.venta)??0,ce=typeof ue=="string"&&ue.includes("C$")?parseFloat(ue.replace(/[^0-9.]/g,"")):parseFloat(ue),Ne=!isNaN(ce)&&ce>0?`C$ ${ce.toFixed(2)}`:"",de=O.categoria_nombre||"";let Ae="";A==="barcode"?Ae=`<svg class="barcode-item" data-code="${X}"></svg>`:A==="qr"?Ae=`<div class="qr-item" data-code="${X}"></div>`:Ae=`
            <div style="display:flex;align-items:center;justify-content:space-around;width:100%;">
              <svg class="barcode-item" data-code="${X}" style="max-width:70%;"></svg>
              <div class="qr-item" data-code="${X}" style="width:24mm;height:24mm;"></div>
            </div>
          `,H+=`
          <div class="label-card ${s==="bond"?"paper-bond":"paper-adhesive"}">
            ${T||ie?`
              <div class="company-header">
                ${ie?`<img src="/icons/logo.png" class="company-logo" alt="Logo" onerror="this.style.display='none'" />`:""}
                ${T?'<span class="company-title">Multirepuestos RG</span>':""}
              </div>
            `:""}
            <div class="product-name">${O.nombre||"Repuesto"}</div>
            <div class="code-area">${Ae}</div>
            <div class="bottom-info">
              <span class="code-text">${X}</span>
              ${U&&Ne?`<span class="price-tag">${Ne}</span>`:""}
              ${J&&de?`<span class="category-text">${de}</span>`:""}
            </div>
          </div>
        `}),z+=`
        <div class="a4-sheet layout-${D}">
          ${H}
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
    `;S.open(),S.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Etiquetas_A4_Multirepuestos_RG</title>
          <style>${B}</style>
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"><\/script>
          <script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"><\/script>
        </head>
        <body>
          ${z}
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
    `),S.close()};return o?e.jsx(te,{children:e.jsx(Ao,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(Po,{initial:{scale:.95,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.95,opacity:0},children:[e.jsxs(zo,{children:[e.jsxs("div",{className:"title-group",children:[e.jsx("div",{className:"icon-badge",children:e.jsx(Le,{})}),e.jsxs("div",{children:[e.jsx("h2",{children:"Generador de Etiquetas y Códigos de Barra"}),e.jsx("p",{children:"Imprime en Rollo Térmico 2x1'' (Phomemo Bluetooth) o en Hojas A4"})]})]}),e.jsxs("div",{className:"actions-group",children:[be==="connected"?e.jsxs(vt,{className:"connected",title:"Conectado vía Bluetooth a la impresora",children:[e.jsx(eo,{})," ",tt||"Phomemo Conectada",e.jsx("button",{className:"disconnect-x",onClick:Q,title:"Desconectar",children:"Desconectar"})]}):be==="connecting"?e.jsxs(vt,{className:"connecting",children:[e.jsx(to,{className:"animate-spin"})," Conectando Bluetooth..."]}):e.jsxs(vt,{className:"disconnected",onClick:at,title:"Haz clic para conectar tu Phomemo por Bluetooth desde la PC",children:[e.jsx(nt,{})," Conectar Phomemo"]}),e.jsxs($o,{onClick:()=>Fe(!0),title:"Instrucciones para Phomemo en PC",children:[e.jsx(oo,{})," ¿Cómo usar Phomemo?"]}),e.jsx(_o,{onClick:d,title:"Cerrar",children:e.jsx(Ke,{})})]})]}),e.jsxs(Eo,{children:[e.jsxs(Mo,{children:[e.jsxs(Bo,{children:[e.jsxs("div",{className:"input-wrapper",children:[e.jsx(xt,{}),e.jsx("input",{type:"text",placeholder:"Buscar repuesto por nombre o código para añadir...",value:n,onChange:t=>w(t.target.value)})]}),j.length>0&&e.jsx("div",{className:"autocomplete-results",children:j.map(t=>e.jsxs("div",{className:"result-item",onClick:()=>je(t),children:[e.jsxs("div",{className:"info",children:[e.jsx("span",{className:"name",children:t.nombre}),e.jsxs("span",{className:"meta",children:[e.jsxs("span",{children:["Código: ",t.codigo||t.codigo_barras||"N/A"]}),e.jsxs("span",{children:["Stock: ",t.existencia]}),e.jsxs("span",{children:["C$ ",t.precio_venta]})]})]}),e.jsxs("button",{className:"add-btn",children:[e.jsx(ut,{})," Añadir"]})]},t.id_producto))})]}),e.jsxs(Io,{children:[e.jsxs("div",{className:"stats",children:[e.jsx("span",{children:"Bandeja:"}),e.jsxs("span",{className:"badge",children:[u.length," productos"]}),e.jsxs("span",{style:{color:"#0284c7"},children:["(",P.length," etiquetas)"]})]}),e.jsxs("div",{className:"quick-actions",children:[e.jsx("button",{onClick:rt,title:"Poner 1 etiqueta a cada producto",children:"1 a todos"}),e.jsxs("button",{onClick:G,title:"Poner cantidad igual al stock de bodega",children:[e.jsx(Mt,{})," = Stock"]}),e.jsx("button",{className:"danger",onClick:ft,title:"Vaciar la lista",children:e.jsx(Nt,{})})]})]}),e.jsx(Fo,{children:u.length===0?e.jsxs(qo,{children:[e.jsx(Le,{}),e.jsx("p",{children:"No has añadido repuestos a la bandeja."}),e.jsx("span",{style:{fontSize:"0.8rem",color:"#94a3b8"},children:"Usa el buscador arriba para agregar productos a imprimir."})]}):u.map(t=>e.jsxs(Ro,{children:[e.jsxs("div",{className:"item-details",children:[e.jsx("div",{className:"item-name",title:t.product.nombre,children:t.product.nombre}),e.jsxs("div",{className:"item-sub",children:[e.jsx("span",{className:"code",children:t.product.codigo_barras||t.product.codigo||"S/C"}),e.jsxs("span",{className:"price",children:["C$ ",Number(t.product.precio_venta||0).toFixed(2)]}),e.jsxs("span",{style:{color:"#64748b"},children:["Bodega: ",t.product.existencia]})]})]}),e.jsxs("div",{className:"stepper",children:[e.jsx("button",{onClick:()=>qe(t.product.id_producto,-1),children:e.jsx(ro,{})}),e.jsx("input",{type:"number",min:"1",value:t.quantity,onChange:S=>ae(t.product.id_producto,S.target.value)}),e.jsx("button",{onClick:()=>qe(t.product.id_producto,1),children:e.jsx(ut,{})})]}),e.jsxs("button",{className:"stock-sync",onClick:()=>De(t.product.id_producto),title:"Igualar cantidad al stock físico",children:[e.jsx(Mt,{})," Stock"]}),e.jsx("button",{className:"remove-btn",onClick:()=>Te(t.product.id_producto),title:"Quitar",children:e.jsx(Ke,{})})]},t.product.id_producto))})]}),e.jsxs(Do,{children:[e.jsxs(To,{children:[e.jsxs("div",{className:"top-row",children:[e.jsxs("div",{className:"format-selector",children:[e.jsxs("button",{className:m==="thermal_2x1"?"active":"",onClick:()=>N("thermal_2x1"),children:[e.jsx(ct,{})," 🏷️ Rollo Térmico 2x1'' (Phomemo)"]}),e.jsxs("button",{className:m==="a4_sheet"?"active":"",onClick:()=>N("a4_sheet"),children:[e.jsx(Bt,{})," 📄 Hoja Completa A4"]})]}),e.jsx("div",{className:"action-buttons",children:m==="thermal_2x1"?e.jsxs(e.Fragment,{children:[e.jsxs("button",{className:"btn-bluetooth-print",disabled:P.length===0||Ie,onClick:Se,title:"Imprime de un solo tirón por Bluetooth directamente desde la PC",children:[e.jsx(nt,{}),be==="connected"?`Imprimir ${P.length} por Bluetooth`:`Conectar e Imprimir ${P.length} (Bluetooth)`]}),e.jsxs("button",{className:"btn-pc-print",disabled:P.length===0||Ie,onClick:Ge,title:"Imprime usando la impresora de Windows o cable USB configurada en 2x1''",children:[e.jsx(ao,{})," Diálogo PC (2x1'')"]})]}):e.jsxs("button",{className:"btn-a4-print",disabled:P.length===0,onClick:ht,children:[e.jsx(no,{})," Imprimir ",P.length," Etiquetas A4"]})})]}),e.jsx("div",{className:"options-row",children:e.jsxs("div",{className:"config-section",children:[e.jsxs("div",{className:"control-group",children:[e.jsx("label",{children:"Tipo de Código"}),e.jsxs("select",{value:A,onChange:t=>q(t.target.value),children:[e.jsx("option",{value:"barcode",children:"📊 Código de Barras (1D)"}),e.jsx("option",{value:"qr",children:"📱 Código QR (2D)"}),m==="a4_sheet"&&e.jsx("option",{value:"hybrid",children:"🔄 Híbrido (Barras + QR)"})]})]}),m==="a4_sheet"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"control-group",children:[e.jsx("label",{children:"Tipo de Papel"}),e.jsxs("select",{value:s,onChange:t=>y(t.target.value),children:[e.jsx("option",{value:"bond",children:"📄 Papel Bond A4 (Líneas de Corte)"}),e.jsx("option",{value:"adhesive",children:"🏷️ Papel Adhesivo (Stickers A4)"})]})]}),e.jsxs("div",{className:"control-group",children:[e.jsx("label",{children:"Distribución A4"}),e.jsxs("select",{value:D,onChange:t=>V(t.target.value),children:[e.jsx("option",{value:"24",children:"24 por Hoja (3x8 - Estándar Góndola)"}),e.jsx("option",{value:"40",children:"40 por Hoja (4x10 - Repuesto Pequeño)"}),e.jsx("option",{value:"12",children:"12 por Hoja (2x6 - Grande / Baterías)"})]})]})]}),e.jsxs("div",{className:"toggles",children:[e.jsxs("div",{className:`toggle-chip ${U?"active":""}`,onClick:()=>Ze(!U),title:"Mostrar precio de venta C$",children:[U&&e.jsx(jt,{size:9})," Precio C$"]}),e.jsxs("div",{className:`toggle-chip ${T?"active":""}`,onClick:()=>xe(!T),title:"Mostrar Multirepuestos RG",children:[T&&e.jsx(jt,{size:9})," Empresa"]}),e.jsxs("div",{className:`toggle-chip ${J?"active":""}`,onClick:()=>Xe(!J),title:"Mostrar Categoría",children:[J&&e.jsx(jt,{size:9})," Categoría"]})]})]})})]}),e.jsx(Lo,{children:m==="thermal_2x1"?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"nav-group",children:[e.jsxs("button",{disabled:b===0,onClick:()=>v(t=>Math.max(0,t-1)),children:[e.jsx(St,{})," Anterior"]}),e.jsxs("span",{children:["Etiqueta ",e.jsx("strong",{children:P.length>0?b+1:0})," de ",e.jsx("strong",{children:P.length})]}),e.jsxs("button",{disabled:b>=P.length-1,onClick:()=>v(t=>Math.min(P.length-1,t+1)),children:["Siguiente ",e.jsx(It,{})]})]}),e.jsxs("div",{className:"view-toggles",children:[e.jsx("button",{className:_==="single"?"active":"",onClick:()=>I("single"),title:"Ver etiqueta individual ampliada",children:"🏷️ Vista Individual"}),e.jsx("button",{className:_==="reel"?"active":"",onClick:()=>I("reel"),title:"Ver tira continua del rollo",children:"🎞️ Tira de Rollo"})]}),e.jsxs("div",{className:"paper-indicator",children:[e.jsx(ct,{})," Rollo Térmico 2x1'' (50mm x 25mm) - Phomemo / Térmica"]})]}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"nav-group",children:[e.jsxs("button",{disabled:oe===0,onClick:()=>Me(t=>Math.max(0,t-1)),children:[e.jsx(St,{})," Anterior"]}),e.jsxs("span",{children:["Hoja A4 ",e.jsx("strong",{children:oe+1})," de ",e.jsx("strong",{children:le})]}),e.jsxs("button",{disabled:oe>=le-1,onClick:()=>Me(t=>Math.min(le-1,t+1)),children:["Siguiente ",e.jsx(It,{})]})]}),e.jsxs("div",{className:"paper-indicator",children:[e.jsx(Bt,{}),s==="bond"?"Papel Bond con Guías de Corte Punteadas":"Papel de Etiquetas Autoadhesivas"]})]})}),e.jsx(Oo,{children:m==="thermal_2x1"?P.length===0?e.jsxs("div",{style:{color:"#e2e8f0",textAlign:"center"},children:[e.jsx(Le,{size:48,style:{opacity:.5,marginBottom:12}}),e.jsx("p",{children:"Agrega repuestos a la bandeja para previsualizar tu etiqueta 2x1''."})]}):_==="single"&&We?e.jsx(Vo,{children:(()=>{var H;const t=We,S=t.codigo_barras||t.codigo||"000000",g=t.precio_venta??t.venta??t.precio??((H=t.__fmt)==null?void 0:H.venta)??0,z=typeof g=="string"&&g.includes("C$")?parseFloat(g.replace(/[^0-9.]/g,"")):parseFloat(g),B=!isNaN(z)&&z>0?`C$ ${z.toFixed(2)}`:"",L=t.categoria_nombre||"";return e.jsxs(qt,{children:[e.jsxs("div",{className:"dim-pill",children:[e.jsx(ct,{size:10})," 2x1 PULGADAS (50x25mm)"]}),T&&e.jsx("div",{className:"company-title",children:"Multirepuestos RG"}),e.jsx("div",{className:"product-name",title:t.nombre,children:t.nombre}),e.jsx("div",{className:"code-area",children:A==="barcode"?e.jsx(st,{value:S,width:1.6,height:36,displayValue:!1}):e.jsx(it,{value:S,size:44,level:"M"})}),e.jsxs("div",{className:"bottom-info",children:[e.jsx("span",{className:"code-text",children:S}),U&&B&&e.jsx("span",{className:"price-tag",children:B}),J&&L&&e.jsx("span",{className:"category-text",children:L})]})]})})()}):e.jsx(Ho,{children:P.map((t,S)=>{var O;const g=t.codigo_barras||t.codigo||"000000",z=t.precio_venta??t.venta??t.precio??((O=t.__fmt)==null?void 0:O.venta)??0,B=typeof z=="string"&&z.includes("C$")?parseFloat(z.replace(/[^0-9.]/g,"")):parseFloat(z),L=!isNaN(B)&&B>0?`C$ ${B.toFixed(2)}`:"",H=t.categoria_nombre||"";return e.jsx("div",{className:"reel-sticker-wrap",children:e.jsxs(qt,{children:[e.jsxs("div",{className:"dim-pill",children:["#",S+1," • 2x1''"]}),T&&e.jsx("div",{className:"company-title",children:"Multirepuestos RG"}),e.jsx("div",{className:"product-name",title:t.nombre,children:t.nombre}),e.jsx("div",{className:"code-area",children:A==="barcode"?e.jsx(st,{value:g,width:1.6,height:36,displayValue:!1}):e.jsx(it,{value:g,size:44,level:"M"})}),e.jsxs("div",{className:"bottom-info",children:[e.jsx("span",{className:"code-text",children:g}),U&&L&&e.jsx("span",{className:"price-tag",children:L}),J&&H&&e.jsx("span",{className:"category-text",children:H})]})]})},`${t.id_producto}-${S}`)})}):e.jsx(Uo,{className:`layout-${D}`,children:Re.map((t,S)=>{var O;const g=t.codigo_barras||t.codigo||"000000",z=t.precio_venta??t.venta??t.precio??((O=t.__fmt)==null?void 0:O.venta)??0,B=typeof z=="string"&&z.includes("C$")?parseFloat(z.replace(/[^0-9.]/g,"")):parseFloat(z),L=!isNaN(B)&&B>0?`C$ ${B.toFixed(2)}`:"",H=t.categoria_nombre||"";return e.jsxs(Wo,{className:`paper-${s}`,children:[(T||ie)&&e.jsxs("div",{className:"company-header",children:[ie&&e.jsx("img",{src:"/icons/logo.png",alt:"Logo",className:"company-logo",onError:X=>{X.target.style.display="none"}}),T&&e.jsx("span",{className:"company-title",children:"Multirepuestos RG"})]}),e.jsx("div",{className:"product-name",title:t.nombre,children:t.nombre}),e.jsxs("div",{className:`code-area ${A==="hybrid"?"hybrid":""}`,children:[A==="barcode"&&e.jsx(st,{value:g,width:D==="40"?1:1.3,height:D==="40"?22:28,displayValue:!1}),A==="qr"&&e.jsx(it,{value:g,size:D==="40"?38:46,level:"M"}),A==="hybrid"&&e.jsxs(e.Fragment,{children:[e.jsx("div",{style:{flex:1,maxWidth:"72%"},children:e.jsx(st,{value:g,width:1,height:22,displayValue:!1})}),e.jsx(it,{value:g,size:32,level:"M"})]})]}),e.jsxs("div",{className:"bottom-info",children:[e.jsx("span",{className:"code-text",children:g}),U&&L&&e.jsx("span",{className:"price-tag",children:L}),J&&H&&e.jsx("span",{className:"category-text",children:H})]})]},`${t.id_producto}-${S}`)})})})]})]}),Ie&&e.jsx(Go,{children:e.jsxs("div",{className:"progress-card",children:[e.jsx("div",{className:"icon-anim",children:e.jsx(nt,{})}),e.jsx("h3",{children:"Imprimiendo en Phomemo..."}),e.jsxs("div",{className:"label-desc",children:["Etiqueta ",ye.current," de ",ye.total,":",e.jsxs("strong",{children:[" ",ye.labelName]})]}),e.jsx("div",{className:"progress-bar-bg",children:e.jsx("div",{className:"progress-bar-fill",style:{width:`${Math.max(5,ye.percentage)}%`}})}),e.jsxs("div",{className:"percentage-text",children:[ye.percentage,"% completado"]}),e.jsx("div",{className:"footer-note",children:"No apagues la etiquetadora durante la impresión."})]})}),Ue&&e.jsx(Qo,{onClick:()=>Fe(!1),children:e.jsxs(Yo,{onClick:t=>t.stopPropagation(),children:[e.jsxs("div",{className:"header",children:[e.jsxs("h3",{children:[e.jsx(nt,{})," Guía: ¿Cómo imprimir en Phomemo desde la PC?"]}),e.jsx("button",{onClick:()=>Fe(!1),children:e.jsx(Ke,{})})]}),e.jsxs("div",{className:"body",children:[e.jsxs("div",{className:"step-box",children:[e.jsxs("div",{className:"step-title",children:[e.jsx("div",{className:"badge-number",children:"1"}),e.jsx("span",{children:"Opción A: Bluetooth Web Directo (¡Recomendado!)"})]}),e.jsxs("p",{children:[e.jsx("strong",{children:"1."})," Enciende tu etiquetadora Phomemo (M110, M120, M220, D30, etc.) y colócale el rollo de etiquetas 2x1 pulgadas (50x25mm)."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"2."})," En tu computadora con Google Chrome o Microsoft Edge, haz clic en el botón azul ",e.jsx("strong",{children:'"Conectar e Imprimir (Bluetooth)"'}),"."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"3."})," El navegador mostrará una ventana con los dispositivos Bluetooth. Elige tu Phomemo y haz clic en ",e.jsx("strong",{children:'"Vincular"'}),"."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"4."})," ¡Listo! Se imprimirán todas las etiquetas de tu lista ",e.jsx("strong",{children:"de un solo tirón"})," sin necesidad de tocar el celular ni de conectar la impresora a cada rato."]})]}),e.jsxs("div",{className:"step-box",children:[e.jsxs("div",{className:"step-title",children:[e.jsx("div",{className:"badge-number",children:"2"}),e.jsx("span",{children:"Opción B: Usar como Impresora de Windows o Cable USB"})]}),e.jsxs("p",{children:[e.jsx("strong",{children:"1."})," Si tienes instalados los drivers de Phomemo o el software ",e.jsx("em",{children:"Labelife"})," en tu computadora con Windows:"]}),e.jsxs("p",{children:[e.jsx("strong",{children:"2."})," Haz clic en el botón ",e.jsx("strong",{children:`"Diálogo PC (2x1'')"`}),"."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"3."})," En la ventana de impresión de Windows, selecciona tu impresora Phomemo y asegúrate de elegir el tamaño de papel ",e.jsx("strong",{children:"2x1 pulgadas o 50x25mm"})," con márgenes en 0."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"4."})," Presiona Imprimir y el rollo saldrá continuo de un solo tiro."]})]})]}),e.jsx("div",{className:"footer",children:e.jsx("button",{onClick:()=>Fe(!1),children:"¡Entendido, volver al generador!"})})]})})]})})}):null}const wt=f.div`
  padding: 20px;
  background-color: #f8fafc;
  min-height: 100vh;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  
  @media(max-width: 640px) {
    padding: 10px;
  }
`,Dt=f.div`
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  height: 60vh; opacity: 0.8; font-size: 1.1rem; color: #64748b;
  text-align: center;
`,gt=f(fo)`
  animation: ${uo`from {transform:rotate(0deg);} to {transform:rotate(360deg);}`} 0.8s linear infinite;
  font-size: 2.5rem; margin-bottom: 1.5rem; color: #3b82f6;
`,Ko=f(ho)`
  display: inline-flex; align-items: center; gap: 8px;
  color: #64748b; text-decoration: none; font-weight: 600; font-size: 0.95rem;
  padding: 8px 12px; margin-bottom: 1rem; border-radius: 8px;
  transition: all 0.2s;
  &:hover { color: #3b82f6; background: #eff6ff; transform: translateX(-4px); }
`,Zo=f.div`
  display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  padding: 1rem 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  position: sticky; top: 10px; z-index: 40;
  border: 1px solid rgba(255,255,255,0.5);
  @media(min-width: 1024px) { flex-direction: row; justify-content: space-between; align-items: center; }
`,Xo=f.h1`
  font-size: 1.5rem; color: #1e293b; display: flex; align-items: center; gap: 0.75rem; margin: 0; font-weight: 800;
  svg { color: #3b82f6; }
`,er=f.div`
  display: flex; gap: 0.75rem; flex-wrap: wrap;
`,fe=f.button`
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
`,tr=f.div`
  display: flex; flex-direction: column; gap: 1rem; 
  background: white; padding: 1.25rem; 
  border-radius: 16px; 
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); 
  margin-bottom: 2rem;
  border: 1px solid #e2e8f0;
  @media(min-width: 1024px) { flex-direction: row; align-items: center; }
`,or=f.div`
  position: relative; flex: 1; min-width: 250px;
`,rr=f.input`
  width: 100%; padding: 0.75rem 1rem 0.75rem 2.8rem; 
  border: 1px solid #cbd5e1; border-radius: 12px; 
  font-size: 0.95rem; background-color: #f8fafc;
  transition: all 0.2s; outline: none;
  &:focus { border-color: #3b82f6; background: white; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
`,Tt=f.button`
  width: 42px; height: 42px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: ${o=>o.$active?"#dbeafe":"#f1f5f9"};
  color: ${o=>o.$active?"#1d4ed8":"#64748b"};
  border: 1px solid ${o=>o.$active?"#bfdbfe":"transparent"};
  border-radius: 10px; cursor: pointer; transition: all 0.2s;
  &:hover { background: #e2e8f0; }
`,pe=f.select`
  padding: 0.7rem 1rem; border: 1px solid #cbd5e1; border-radius: 12px; 
  background-color: #f8fafc; color: #334155; outline: none; flex: 1;
  font-size: 0.9rem; cursor: pointer; width: 100%; box-sizing: border-box;
  &:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); background: white; }
`,ar=f.div`
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); 
  gap: 1.5rem;
  padding-bottom: 40px;
`,nr=f(ze.div)`
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
`,ir=f.div` padding: 1.25rem 1rem 0.5rem; `,sr=f.h3` font-size: 1.15rem; margin: 0; color: #0f172a; font-weight: 700; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; `,lr=f.div` font-size: 0.85rem; color: #64748b; font-family: monospace; letter-spacing: 0.05em; margin-top: 4px; `,cr=f.div` padding: 0.5rem 1rem 1.25rem; display: flex; flex-wrap: wrap; gap: 0.5rem; `,mt=f.div`
  background: white; border: 1px solid #e2e8f0;
  padding: 6px 10px; border-radius: 8px; 
  display: flex; flex-direction: column; align-items: flex-start; flex: 1; min-width: 80px;
  span { font-size: 0.65rem; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px; }
  strong { color: #334155; font-size: 1rem; font-weight: 700; }
`,dr=f(mt)`
  background: ${o=>o.$out?"#fef2f2":o.$low?"#fffbeb":"#f0fdf4"};
  border-color: ${o=>o.$out?"#fecaca":o.$low?"#fde68a":"#bbf7d0"};
  strong { color: ${o=>o.$out?"#b91c1c":o.$low?"#b45309":"#15803d"}; }
`,pr=f.div`
  margin-top: auto; padding: 1rem; background: #f8fafc; border-top: 1px solid #f1f5f9; display: flex; gap: 0.75rem;
`,lt=f.button`
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
`,Ce=f(ze.div)`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(15, 23, 42, 0.5); z-index: 50;
  display: flex; align-items: center; justify-content: center; padding: 0.75rem;
  backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
  overflow: hidden;
`,_e=f.div`
  background: white; width: 100%; max-width: ${o=>o.$large?"900px":"700px"};
  border-radius: 20px; padding: 1.75rem;
  max-height: 92vh; overflow-y: auto; overflow-x: hidden;
  box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  @media(max-width: 640px) { padding: 1.25rem; border-radius: 16px; max-width: 100%; }
`,$e=f.h2`
  margin-top: 0; color: #0f172a; margin-bottom: 1.25rem; font-size: 1.35rem;
  display: flex; align-items: center; gap: 10px; font-weight: 800; letter-spacing: -0.02em;
`,Ut=f.div`
  background: #fef2f2; color: #991b1b; padding: 12px; border-radius: 10px;
  margin-bottom: 1.25rem; border: 1px solid #fecaca; font-size: 0.85rem; display: flex; gap: 8px; align-items: center;
`,Wt=f.div`
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.25rem;
  overflow: hidden;
  & > * { min-width: 0; }
  @media(min-width: 768px) { grid-template-columns: repeat(3, 1fr); }
  @media(max-width: 640px) { grid-template-columns: 1fr; gap: 0.75rem; }
`,$=f.div` display: flex; flex-direction: column; gap: 5px; min-width: 0; `,E=f.label` font-size: 0.82rem; font-weight: 600; color: #475569; `,R=f.input`
  width: 100%; box-sizing: border-box;
  padding: 9px 12px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 0.95rem; color: #1e293b;
  transition: all 0.2s;
  &:focus { outline: none; border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
  &:disabled { background: #f1f5f9; color: #94a3b8; }
`,Ve=f.div` display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; border-top: 1px solid #f1f5f9; padding-top: 1.25rem; flex-wrap: wrap; `,Pe=f.button`
  background: white; color: #64748b; border: 1.5px solid #e2e8f0;
  padding: 9px 18px; border-radius: 10px; font-weight: 600; cursor: pointer; font-size: 0.9rem;
  transition: all 0.2s;
  &:hover { background: #f8fafc; color: #1e293b; border-color: #cbd5e1; }
`,Ee=f.button`
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white; border: none;
  padding: 9px 22px; border-radius: 10px; font-weight: 600; cursor: pointer; font-size: 0.9rem;
  box-shadow: 0 4px 12px rgba(99,102,241,0.25);
  transition: all 0.2s;
  &:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(99,102,241,0.35); }
`,Gt=({currentImage:o,onImageChange:d})=>{const h=r.useRef(null),[x,c]=r.useState(o||null),[u,i]=r.useState(!1);r.useEffect(()=>{c(o)},[o]);const n=async j=>{const p=j.target.files[0];if(p){if(!p.type.startsWith("image/")){alert("Solo se permiten imágenes.");return}i(!0);try{const m=await w(p);c(m),d(m)}catch(m){console.error(m),alert("Error al procesar la imagen.")}finally{i(!1)}}},w=j=>new Promise((p,m)=>{const N=new FileReader;N.readAsDataURL(j),N.onload=_=>{const I=new Image;I.src=_.target.result,I.onload=()=>{const b=document.createElement("canvas"),v=500,s=v/I.width;b.width=v,b.height=I.height*s,b.getContext("2d").drawImage(I,0,0,b.width,b.height);const A=b.toDataURL("image/jpeg",.7);p(A)},I.onerror=b=>m(b)},N.onerror=_=>m(_)});return e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"10px",marginBottom:"1rem",border:"1px dashed #ccc",padding:"1rem",borderRadius:"8px"},children:[u?e.jsx(gt,{}):x?e.jsxs("div",{style:{position:"relative",width:"120px",height:"120px"},children:[e.jsx("img",{src:x,alt:"Preview",style:{width:"100%",height:"100%",objectFit:"cover",borderRadius:"8px",border:"1px solid #ddd"}}),e.jsx("button",{type:"button",onClick:j=>{j.stopPropagation(),c(null),d(null),h.current&&(h.current.value="")},style:{position:"absolute",top:"-8px",right:"-8px",background:"#dc3545",color:"white",border:"none",borderRadius:"50%",width:"24px",height:"24px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsx(Ke,{size:12})})]}):e.jsxs("div",{onClick:()=>h.current.click(),style:{cursor:"pointer",color:"#6c757d",display:"flex",flexDirection:"column",alignItems:"center"},children:[e.jsx(At,{size:32}),e.jsx("span",{style:{fontSize:"0.9rem",marginTop:"5px"},children:"Subir Foto"})]}),e.jsx("input",{type:"file",ref:h,onChange:n,accept:"image/*",style:{display:"none"}})]})},mr=({isOpen:o,productId:d,imageSrc:h,onClose:x})=>{const[c,u]=Oe.useState(null),[i,n]=Oe.useState(!1);return Oe.useEffect(()=>{if(!o){u(null);return}if(h){u(h);return}if(!d)return;const w=localStorage.getItem("token");Pt(d,w).then(j=>u(j==null?void 0:j.imagen)).catch(()=>u(null)).finally(()=>n(!1))},[o,d,h]),o?e.jsx(Ce,{onClick:x,initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(ze.div,{initial:{scale:.8,opacity:0},animate:{scale:1,opacity:1},style:{position:"relative",maxWidth:"90%",maxHeight:"90vh",display:"flex",alignItems:"center",justifyContent:"center"},children:[e.jsx("button",{onClick:x,style:{position:"absolute",top:-15,right:-15,background:"white",width:30,height:30,borderRadius:"50%",border:"none",cursor:"pointer",fontWeight:"bold",zIndex:1},children:"X"}),i?e.jsxs("div",{style:{background:"white",borderRadius:"12px",padding:"3rem 4rem",display:"flex",flexDirection:"column",alignItems:"center",gap:"1rem",color:"#64748b"},children:[e.jsx(gt,{}),e.jsx("span",{style:{fontSize:"0.95rem",fontWeight:600},children:"Cargando imagen, espere por favor..."})]}):c?e.jsx("img",{src:c,alt:"Vista completa",style:{maxWidth:"100%",maxHeight:"80vh",borderRadius:"8px",boxShadow:"0 5px 20px rgba(0,0,0,0.5)"}}):e.jsxs("div",{style:{background:"white",borderRadius:"12px",padding:"3rem 4rem",color:"#94a3b8",textAlign:"center"},children:[e.jsx(At,{size:48,style:{marginBottom:"1rem"}}),e.jsx("p",{style:{margin:0},children:"Este producto no tiene imagen."})]})]})}):null},Je=o=>String(o||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),xr=o=>{const[d,h]=Oe.useState(()=>{const c=dt(o);return c&&c!=="loading"&&c!=="none"?c:null}),x=Oe.useRef(null);return Oe.useEffect(()=>{const c=dt(o);if(c&&c!=="loading"){h(c!=="none"?c:null);return}const u=x.current;if(!u)return;const i=new IntersectionObserver(n=>{if(n[0].isIntersecting){if(i.disconnect(),dt(o)==="loading")return;pt(o,"loading");const w=localStorage.getItem("token");Pt(o,w).then(j=>{const p=(j==null?void 0:j.imagen)||null;pt(o,p||"none"),h(p||null)}).catch(()=>{pt(o,"none"),h(null)})}},{rootMargin:"200px"});return i.observe(u),()=>i.disconnect()},[o]),{imgSrc:d,cardRef:x}},Ct=50,ur=500,gr=({productId:o,productName:d,onViewFull:h})=>{const{imgSrc:x,cardRef:c}=xr(o);return e.jsx("div",{ref:c,className:"image-placeholder",onClick:()=>h(x),style:{cursor:"zoom-in"},children:x?e.jsxs(e.Fragment,{children:[e.jsx("img",{src:x,alt:d}),e.jsx("div",{className:"overlay",children:e.jsx(go,{})})]}):e.jsx("div",{className:"no-image-text",children:e.jsx(At,{})})})},fr=({isOpen:o,onClose:d,title:h,message:x})=>o?e.jsx(Ce,{onClick:d,initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(_e,{as:"div",onClick:c=>c.stopPropagation(),style:{maxWidth:"400px",textAlign:"center"},children:[e.jsx($e,{children:h}),e.jsx("p",{style:{color:"#4a5568",marginBottom:"20px"},children:x}),e.jsx(Ee,{onClick:d,style:{width:"100%"},children:"Aceptar"})]})}):null,Lt=({open:o,onCancel:d,onConfirm:h,title:x,message:c,confirmLabel:u,danger:i})=>o?e.jsx(Ce,{onClick:d,initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(_e,{as:"div",onClick:n=>n.stopPropagation(),style:{maxWidth:"450px"},children:[e.jsx($e,{style:{color:i?"#e53e3e":"#2d3748"},children:x}),e.jsx("div",{style:{marginBottom:"25px",color:"#4a5568"},children:c}),e.jsxs(Ve,{children:[e.jsx(Pe,{onClick:d,children:"Cancelar"}),e.jsx(Ee,{onClick:h,style:{background:i?"#e53e3e":"#3b82f6"},children:u||"Confirmar"})]})]})}):null,Ot=({title:o,items:d,onAdd:h,onDelete:x,onClose:c})=>{const[u,i]=r.useState(""),n=w=>{w.preventDefault(),u.trim()&&(h(u),i(""))};return e.jsx(Ce,{onClick:c,children:e.jsxs(_e,{onClick:w=>w.stopPropagation(),children:[e.jsx($e,{children:o}),e.jsxs("form",{onSubmit:n,style:{display:"flex",gap:"10px",marginBottom:"20px"},children:[e.jsx(R,{value:u,onChange:w=>i(w.target.value),placeholder:"Nuevo nombre...",style:{flex:1}}),e.jsxs(Ee,{type:"submit",children:[e.jsx(ut,{})," Agregar"]})]}),e.jsxs("div",{style:{maxHeight:"300px",overflowY:"auto",display:"flex",flexDirection:"column",gap:"8px"},children:[(Array.isArray(d)?d:[]).map((w,j)=>{const p=w.id_categoria||w.id_proveedor||j,m=w.nombre;return e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",padding:"10px",background:"#f7fafc",borderRadius:"8px",alignItems:"center"},children:[e.jsx("span",{children:m}),e.jsx("button",{onClick:()=>x(p),style:{color:"#e53e3e",background:"none",border:"none",cursor:"pointer"},children:e.jsx(Nt,{})})]},p)}),(!Array.isArray(d)||d.length===0)&&e.jsx("p",{style:{textAlign:"center",color:"#a0aec0"},children:"No hay elementos registrados."})]}),e.jsx(Ve,{children:e.jsx(Pe,{onClick:c,children:"Cerrar"})})]})})},hr=({isOpen:o,product:d,onClose:h,onConfirm:x})=>{const[c,u]=r.useState(""),[i,n]=r.useState(""),[w,j]=r.useState("");if(!o||!d)return null;const p=m=>{const N=m.target.value;j(N),n(N||"")};return e.jsx(Ce,{onClick:h,children:e.jsxs(_e,{onClick:m=>m.stopPropagation(),style:{maxWidth:"400px"},children:[e.jsxs($e,{children:["Ajustar Stock: ",d.nombre]}),e.jsx("div",{style:{marginBottom:"15px"},children:e.jsxs("p",{children:[e.jsx("strong",{children:"Stock Actual:"})," ",d.existencia]})}),e.jsxs($,{style:{marginBottom:"15px"},children:[e.jsx(E,{children:"Cantidad (Positivo para agregar, Negativo para restar)"}),e.jsx(R,{type:"number",value:c,onChange:m=>u(m.target.value),placeholder:"Ej: 10 o -5",autoFocus:!0})]}),e.jsxs($,{style:{marginBottom:"10px"},children:[e.jsx(E,{children:"Razón (Seleccionar)"}),e.jsxs(pe,{value:w,onChange:p,children:[e.jsx("option",{value:"",children:"-- Escribir manualmente --"}),e.jsx("option",{value:"Compra",children:"Compra / Resurtido"}),e.jsx("option",{value:"Ajuste Inventario",children:"Ajuste de Inventario"}),e.jsx("option",{value:"Devolución",children:"Devolución Cliente"}),e.jsx("option",{value:"Dañado",children:"Producto Dañado/Merma"}),e.jsx("option",{value:"Uso Interno",children:"Uso Interno"})]})]}),e.jsxs($,{style:{marginBottom:"20px"},children:[e.jsx(E,{children:"Razón (Manual)"}),e.jsx(R,{type:"text",value:i,onChange:m=>{n(m.target.value),j("")},placeholder:"Especifique el motivo..."})]}),e.jsxs(Ve,{children:[e.jsx(Pe,{onClick:h,children:"Cancelar"}),e.jsx(Ee,{onClick:()=>{const m=parseInt(c,10);!isNaN(m)&&m!==0&&i.trim()?x(d,m,i):alert("Debe ingresar una cantidad válida y una razón.")},children:"Aplicar Ajuste"})]})]})})},br=({onClose:o})=>{const[d,h]=r.useState([]),[x,c]=r.useState(!0),[u,i]=r.useState(""),[n,w]=r.useState(""),[j,p]=r.useState(""),[m,N]=r.useState(""),_=r.useCallback(async()=>{var b;c(!0),i("");try{const v=localStorage.getItem("token"),s=new URLSearchParams;n&&s.append("startDate",n),j&&s.append("endDate",j),m&&s.append("search",m);const y=await Z.get(`/api/products/inventory/history?${s.toString()}`,{headers:{Authorization:`Bearer ${v}`}});h(Array.isArray(y.data)?y.data:Array.isArray((b=y.data)==null?void 0:b.history)?y.data.history:[])}catch(v){console.error(v),i("No se pudo cargar el historial.")}finally{c(!1)}},[n,j,m]);r.useEffect(()=>{_()},[_]);const I=()=>{w(""),p(""),N("")};return e.jsx(Ce,{onClick:o,initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(_e,{onClick:b=>b.stopPropagation(),$large:!0,children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"},children:[e.jsxs($e,{style:{margin:0},children:[e.jsx(Vt,{})," Historial de Movimientos"]}),e.jsx("button",{onClick:o,style:{border:"none",background:"transparent",fontSize:"1.2rem",cursor:"pointer"},children:e.jsx(Ke,{})})]}),e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:"1rem",marginBottom:"1.5rem",background:"#f8fafc",padding:"1rem",borderRadius:"12px",border:"1px solid #e2e8f0"},children:[e.jsxs($,{style:{flex:"1 1 200px"},children:[e.jsx(E,{children:"Buscar por Código/Nombre"}),e.jsxs("div",{style:{position:"relative"},children:[e.jsx(xt,{style:{position:"absolute",left:"10px",top:"50%",transform:"translateY(-50%)",color:"#94a3b8"}}),e.jsx(R,{type:"text",placeholder:"Buscar...",value:m,onChange:b=>N(b.target.value),style:{paddingLeft:"32px"}})]})]}),e.jsxs($,{style:{flex:"1 1 150px"},children:[e.jsx(E,{children:"Fecha Inicio"}),e.jsx(R,{type:"date",value:n,onChange:b=>w(b.target.value)})]}),e.jsxs($,{style:{flex:"1 1 150px"},children:[e.jsx(E,{children:"Fecha Fin"}),e.jsx(R,{type:"date",value:j,onChange:b=>p(b.target.value)})]}),e.jsxs("div",{style:{display:"flex",alignItems:"flex-end",gap:"0.5rem"},children:[e.jsxs(Ee,{type:"button",onClick:_,style:{height:"42px",display:"flex",alignItems:"center",gap:"8px"},children:[e.jsx(xt,{})," Filtrar"]}),e.jsx(Pe,{type:"button",onClick:I,style:{height:"42px"},children:"Limpiar"})]})]}),x?e.jsx("div",{style:{textAlign:"center",padding:"2rem"},children:e.jsx(gt,{})}):u?e.jsx("div",{style:{color:"red",textAlign:"center"},children:u}):e.jsx("div",{style:{overflowX:"auto",maxHeight:"400px"},children:e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",fontSize:"0.9rem"},children:[e.jsx("thead",{style:{position:"sticky",top:0,zIndex:10},children:e.jsxs("tr",{style:{background:"#f7fafc",borderBottom:"2px solid #e2e8f0",textAlign:"left"},children:[e.jsx("th",{style:{padding:"10px"},children:"Fecha"}),e.jsx("th",{style:{padding:"10px"},children:"Producto"}),e.jsx("th",{style:{padding:"10px"},children:"Movimiento"}),e.jsx("th",{style:{padding:"10px"},children:"Detalles"}),e.jsx("th",{style:{padding:"10px"},children:"Usuario"})]})}),e.jsxs("tbody",{children:[(Array.isArray(d)?d:[]).map(b=>e.jsxs("tr",{style:{borderBottom:"1px solid #edf2f7"},children:[e.jsx("td",{style:{padding:"10px"},children:new Date(b.fecha).toLocaleString()}),e.jsx("td",{style:{padding:"10px",fontWeight:"600"},children:b.nombre_producto||b.codigo_producto||"N/A"}),e.jsx("td",{style:{padding:"10px"},children:e.jsx("span",{style:{padding:"2px 6px",borderRadius:"4px",fontSize:"0.8rem",fontWeight:"bold",background:b.tipo_movimiento==="VENTA"?"#c6f6d5":b.tipo_movimiento==="CREACION"?"#bee3f8":"#fed7d7",color:b.tipo_movimiento==="VENTA"?"#22543d":b.tipo_movimiento==="CREACION"?"#2b6cb0":"#822727"},children:b.tipo_movimiento})}),e.jsx("td",{style:{padding:"10px",color:"#4a5568"},children:b.detalles}),e.jsx("td",{style:{padding:"10px",color:"#718096"},children:b.nombre_usuario||"Sistema"})]},b.id_movimiento)),(!Array.isArray(d)||d.length===0)&&e.jsx("tr",{children:e.jsx("td",{colSpan:"5",style:{textAlign:"center",padding:"20px"},children:"No hay movimientos registrados para estos filtros."})})]})]})}),e.jsx(Ve,{children:e.jsx(Pe,{onClick:o,children:"Cerrar"})})]})})},yr=({isOpen:o,onClose:d,onSave:h,categories:x,providers:c,allProductsRaw:u})=>{const[i,n]=r.useState({codigo:"",nombre:"",costo:"",venta:"",mayoreo:"",id_categoria:"",existencia:"",minimo:"",maximo:"",tipo_venta:"Unidad",id_proveedor:"",descripcion:"",imagen:null}),[w,j]=r.useState(""),[p,m]=r.useState(""),N=v=>{const{name:s,value:y}=v.target,A={...i,[s]:y};if(s==="costo"||s==="venta"){const q=parseFloat(A.costo),D=parseFloat(A.venta);j(q>0&&D>0?((D-q)/q*100).toFixed(2):"")}n(A),m("")},_=v=>n(s=>({...s,imagen:v})),I=v=>{const s=v.target.value;j(s);const y=parseFloat(i.costo);y>0&&s&&n(A=>({...A,venta:(y*(1+parseFloat(s)/100)).toFixed(2)}))},b=v=>{v.preventDefault(),m("");const s=i;if(["codigo","nombre","costo","venta","existencia"].some(T=>!s[T]||!String(s[T]).trim())){m("Código, Nombre, Costo, Venta y Existencia son obligatorios.");return}const A=parseFloat(s.costo),q=parseFloat(s.venta),D=s.mayoreo?parseFloat(s.mayoreo):null,V=parseInt(s.existencia,10);if(s.minimo&&parseInt(s.minimo,10),s.maximo&&parseInt(s.maximo,10),[A,q,V].some(isNaN)){m("Costo, Venta y Existencia deben ser números válidos.");return}if(s.mayoreo&&isNaN(D)){m("Precio Mayoreo debe ser un número válido o estar vacío.");return}if(A<0||q<0||V<0){m("Precios y cantidades no pueden ser negativos.");return}if(q<A){m("El precio de venta no puede ser menor que el costo.");return}const me=(Array.isArray(u)?u:[]).find(T=>{var xe,U;return((xe=T.codigo)==null?void 0:xe.toLowerCase())===s.codigo.trim().toLowerCase()||((U=T.nombre)==null?void 0:U.toLowerCase())===s.nombre.trim().toLowerCase()});if(me){(me.codigo||"").toLowerCase()===s.codigo.trim().toLowerCase()?m(`Ya existe un producto con el código "${s.codigo}".`):m(`Ya existe un producto con el nombre "${s.nombre}".`);return}h({...s,mayoreo:s.mayoreo||null,minimo:s.minimo||null,maximo:s.maximo||null,id_categoria:s.id_categoria||null,id_proveedor:s.id_proveedor||null})};return o?e.jsx(Ce,{onClick:d,initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsx(ze.div,{initial:{y:-50,opacity:0},animate:{y:0,opacity:1},exit:{y:50,opacity:0},style:{width:"100%",maxWidth:"700px"},children:e.jsx(_e,{as:"div",onClick:v=>v.stopPropagation(),children:e.jsxs("form",{onSubmit:b,children:[e.jsx($e,{children:"Crear Nuevo Producto"}),p&&e.jsx(Ut,{children:p}),e.jsx(Gt,{currentImage:i.imagen,onImageChange:_}),e.jsxs(Wt,{children:[e.jsxs($,{children:[e.jsx(E,{children:"Código"}),e.jsx(R,{name:"codigo",value:i.codigo,onChange:N,required:!0})]}),e.jsxs($,{children:[e.jsx(E,{children:"Nombre"}),e.jsx(R,{name:"nombre",value:i.nombre,onChange:N,required:!0})]}),e.jsxs($,{children:[e.jsx(E,{children:"Costo (C$)"}),e.jsx(R,{type:"number",step:"0.01",name:"costo",value:i.costo,onChange:N,required:!0})]}),e.jsxs($,{children:[e.jsx(E,{children:"% Ganancia"}),e.jsx(R,{type:"number",step:"0.01",value:w,onChange:I,placeholder:"ej: 50"})]}),e.jsxs($,{children:[e.jsx(E,{children:"Precio Venta (C$)"}),e.jsx(R,{type:"number",step:"0.01",name:"venta",value:i.venta,onChange:N,required:!0})]}),e.jsxs($,{children:[e.jsx(E,{children:"Precio Mayoreo (C$)"}),e.jsx(R,{type:"number",step:"0.01",name:"mayoreo",value:i.mayoreo,onChange:N})]}),e.jsxs($,{children:[e.jsx(E,{children:"Existencia Inicial"}),e.jsx(R,{type:"number",inputMode:"numeric",pattern:"[0-9]*",name:"existencia",value:i.existencia,onChange:N,required:!0})]}),e.jsxs($,{children:[e.jsx(E,{children:"Stock Mínimo"}),e.jsx(R,{type:"number",inputMode:"numeric",pattern:"[0-9]*",name:"minimo",value:i.minimo,onChange:N})]}),e.jsxs($,{children:[e.jsx(E,{children:"Stock Máximo"}),e.jsx(R,{type:"number",inputMode:"numeric",pattern:"[0-9]*",name:"maximo",value:i.maximo,onChange:N})]}),e.jsxs($,{children:[e.jsx(E,{children:"Descripción"}),e.jsx(R,{name:"descripcion",value:i.descripcion,onChange:N,placeholder:"Detalles del producto"})]}),e.jsxs($,{children:[e.jsx(E,{children:"Categoría"}),e.jsxs(pe,{name:"id_categoria",value:i.id_categoria,onChange:N,children:[e.jsx("option",{value:"",children:"-- Sin Categoría --"}),(Array.isArray(x)?x:[]).map(v=>e.jsx("option",{value:v.id_categoria,children:v.nombre},v.id_categoria))]})]}),e.jsxs($,{children:[e.jsx(E,{children:"Proveedor"}),e.jsxs(pe,{name:"id_proveedor",value:i.id_proveedor,onChange:N,children:[e.jsx("option",{value:"",children:"-- Sin Proveedor --"}),(Array.isArray(c)?c:[]).map(v=>e.jsx("option",{value:v.id_proveedor,children:v.nombre},v.id_proveedor))]})]}),e.jsxs($,{children:[e.jsx(E,{children:"Tipo de Venta"}),e.jsxs(pe,{name:"tipo_venta",value:i.tipo_venta,onChange:N,children:[e.jsx("option",{value:"Unidad",children:"Unidad"}),e.jsx("option",{value:"Juego",children:"Juego"}),e.jsx("option",{value:"Kit",children:"Kit"})]})]})]}),e.jsxs(Ve,{children:[e.jsx(Pe,{type:"button",onClick:d,children:"Cancelar"}),e.jsx(Ee,{type:"submit",children:"Crear Producto"})]})]})})})}):null},jr=({isOpen:o,onClose:d,onSave:h,productToEdit:x,categories:c,providers:u,allProductsRaw:i})=>{const[n,w]=r.useState({}),[j,p]=r.useState(""),[m,N]=r.useState("");r.useEffect(()=>{if(x){w({...x,mayoreo:x.mayoreo??"",minimo:x.minimo??"",maximo:x.maximo??"",id_categoria:x.id_categoria??"",id_proveedor:x.id_proveedor??"",descripcion:x.descripcion??"",imagen:x.imagen??null});const s=parseFloat(x.costo),y=parseFloat(x.venta);p(s>0&&y>0?((y-s)/s*100).toFixed(2):""),N("")}},[x]);const _=s=>{const{name:y,value:A}=s.target;if(y==="existencia")return;const q={...n,[y]:A};if(y==="costo"||y==="venta"){const D=parseFloat(q.costo),V=parseFloat(q.venta);p(D>0&&V>0?((V-D)/D*100).toFixed(2):"")}w(q),N("")},I=s=>w(y=>({...y,imagen:s})),b=s=>{const y=s.target.value;p(y);const A=parseFloat(n.costo);A>0&&y&&w(q=>({...q,venta:(A*(1+parseFloat(y)/100)).toFixed(2)}))},v=s=>{s.preventDefault(),N("");const y=n;if(!y.codigo||!y.nombre||!y.costo||!y.venta){N("Código, Nombre, Costo y Venta son obligatorios.");return}if(parseFloat(y.venta)<parseFloat(y.costo)){N("El precio de venta no puede ser menor que el costo.");return}if(i.find(V=>{var ie,me;return V.id_producto!==x.id_producto&&(((ie=V.codigo)==null?void 0:ie.toLowerCase())===y.codigo.trim().toLowerCase()||((me=V.nombre)==null?void 0:me.toLowerCase())===y.nombre.trim().toLowerCase())})){N("Ya existe otro producto con ese código o nombre.");return}const{existencia:q,...D}={...y,mayoreo:y.mayoreo||null,minimo:y.minimo||null,maximo:y.maximo||null,id_categoria:y.id_categoria||null,id_proveedor:y.id_proveedor||null};h(D,x.id_producto)};return!o||!x?null:e.jsx(Ce,{onClick:d,initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsx(ze.div,{initial:{y:-50,opacity:0},animate:{y:0,opacity:1},exit:{y:50,opacity:0},style:{width:"100%",maxWidth:"550px"},children:e.jsx(_e,{as:"div",onClick:s=>s.stopPropagation(),children:e.jsxs("form",{onSubmit:v,children:[e.jsx($e,{children:"Editar Producto"}),m&&e.jsx(Ut,{children:m}),e.jsx(Gt,{currentImage:n.imagen,onImageChange:I}),e.jsxs(Wt,{children:[e.jsxs($,{children:[e.jsx(E,{children:"Código"}),e.jsx(R,{name:"codigo",value:n.codigo||"",onChange:_,required:!0})]}),e.jsxs($,{children:[e.jsx(E,{children:"Nombre"}),e.jsx(R,{name:"nombre",value:n.nombre||"",onChange:_,required:!0})]}),e.jsxs($,{children:[e.jsx(E,{children:"Costo (C$)"}),e.jsx(R,{type:"number",step:"0.01",name:"costo",value:n.costo||"",onChange:_,required:!0})]}),e.jsxs($,{children:[e.jsx(E,{children:"% Ganancia"}),e.jsx(R,{type:"number",step:"0.01",value:j||"",onChange:b,placeholder:"ej: 50"})]}),e.jsxs($,{children:[e.jsx(E,{children:"Precio Venta (C$)"}),e.jsx(R,{type:"number",step:"0.01",name:"venta",value:n.venta||"",onChange:_,required:!0})]}),e.jsxs($,{children:[e.jsx(E,{children:"Precio Mayoreo (C$)"}),e.jsx(R,{type:"number",step:"0.01",name:"mayoreo",value:n.mayoreo||"",onChange:_})]}),e.jsxs($,{children:[e.jsx(E,{children:"Existencia"}),e.jsx(R,{name:"existencia",value:n.existencia||"",disabled:!0,style:{backgroundColor:"#f0f0f0"}}),e.jsx("small",{style:{marginTop:"5px",color:"#dc3545",fontWeight:"bold"},children:"¡Ajustar solo con el botón de stock!"})]}),e.jsxs($,{children:[e.jsx(E,{children:"Stock Mínimo"}),e.jsx(R,{type:"number",inputMode:"numeric",pattern:"[0-9]*",name:"minimo",value:n.minimo||"",onChange:_})]}),e.jsxs($,{children:[e.jsx(E,{children:"Stock Máximo"}),e.jsx(R,{type:"number",inputMode:"numeric",pattern:"[0-9]*",name:"maximo",value:n.maximo||"",onChange:_})]}),e.jsxs($,{children:[e.jsx(E,{children:"Descripción"}),e.jsx(R,{name:"descripcion",value:n.descripcion||"",onChange:_,placeholder:"Detalles del producto"})]}),e.jsxs($,{children:[e.jsx(E,{children:"Categoría"}),e.jsxs(pe,{name:"id_categoria",value:n.id_categoria||"",onChange:_,children:[e.jsx("option",{value:"",children:"-- Sin Categoría --"}),(Array.isArray(c)?c:[]).map(s=>e.jsx("option",{value:s.id_categoria,children:s.nombre},s.id_categoria))]})]}),e.jsxs($,{children:[e.jsx(E,{children:"Proveedor"}),e.jsxs(pe,{name:"id_proveedor",value:n.id_proveedor||"",onChange:_,children:[e.jsx("option",{value:"",children:"-- Sin Proveedor --"}),(Array.isArray(u)?u:[]).map(s=>e.jsx("option",{value:s.id_proveedor,children:s.nombre},s.id_proveedor))]})]}),e.jsxs($,{children:[e.jsx(E,{children:"Tipo de Venta"}),e.jsxs(pe,{name:"tipo_venta",value:n.tipo_venta||"Unidad",onChange:_,children:[e.jsx("option",{value:"Unidad",children:"Unidad"}),e.jsx("option",{value:"Juego",children:"Juego"}),e.jsx("option",{value:"Kit",children:"Kit"})]})]})]}),e.jsxs(Ve,{children:[e.jsx(Pe,{type:"button",onClick:d,children:"Cancelar"}),e.jsx(Ee,{type:"submit",children:"Guardar Cambios"})]})]})})})})},Nr=()=>{var Ae,bt,Qe;const{globalReservations:o,socket:d}=bo(),[h,x]=r.useState([]),[c,u]=r.useState([]),[i,n]=r.useState([]),[w,j]=r.useState([]),[p,m]=r.useState(!1),[N,_]=r.useState(""),[I,b]=r.useState("description"),[v,s]=r.useState("name-asc"),y=r.useDeferredValue(N),A=r.useRef(null),[q,D]=r.useState(""),[V,ie]=r.useState(""),[me,T]=r.useState(null),xe=r.useMemo(()=>new Audio("/sounds/success.mp3"),[]),U=r.useMemo(()=>new Audio("/sounds/error.mp3"),[]),[Ze,J]=r.useState(!1),[Xe,oe]=r.useState(!1),[Me,et]=r.useState(null),[he,Be]=r.useState(!1),[K,be]=r.useState(null),[re,tt]=r.useState(!1),[ke,Ie]=r.useState(!1),[ot,ye]=r.useState(!1),[He,Ue]=r.useState(!1),[Fe,se]=r.useState(null),[P,le]=r.useState({isOpen:!1,product:null}),[Re,We]=r.useState({isOpen:!1,title:"",message:""}),[je,qe]=r.useState({open:!1,product:null,detail:null}),[ae,De]=r.useState(1),[Te,rt]=r.useState({isOpen:!1,imageUrl:null});r.useEffect(()=>{De(1)},[y,q,V,I,v]),r.useEffect(()=>{window.scrollTo({top:0,behavior:"smooth"})},[ae]);const G=r.useCallback(({title:a,message:k,type:l})=>We({isOpen:!0,title:a,message:k,type:l}),[]),ft=()=>We({isOpen:!1}),at=r.useCallback(async()=>{const a=localStorage.getItem("token"),l=(await Z.get(`${ee}/products`,{headers:{Authorization:`Bearer ${a}`}})).data;if(Array.isArray(l))return l;if(l&&Array.isArray(l.products))return l.products;if(l&&Array.isArray(l.data))return l.data;if(l&&Array.isArray(l.items))return l.items;if(l&&(l.msg||l.message||l.error))throw new Error(l.msg||l.message||l.error);return[]},[]),Q=r.useCallback(async()=>{var a,k,l,C,F,Y,Ye,yt;try{T(null);const M=localStorage.getItem("token"),[W,ve,we]=await Promise.all([at(),Z.get(`${ee}/categories`,{headers:{Authorization:`Bearer ${M}`}}),Z.get(`${ee}/providers`,{headers:{Authorization:`Bearer ${M}`}})]),zt=Array.isArray(W)?W:[];x(zt);const Qt=zt.map(ge=>{if(!ge||typeof ge!="object")return null;const _t=ge.nombre??"",$t=ge.codigo??"",Yt=ge.descripcion??"",Jt=`${Je(_t)}|${Je($t)}|${Je(Yt)}`,Kt=[Je(_t),Je($t)],Et=Number(ge.costo||0),Zt=Number(ge.venta||0),Xt=Number(ge.existencia||0);return{...ge,__fmt:{costo:`C$${Et.toFixed(2)}`,venta:`C$${Zt.toFixed(2)}`,costoTotal:`C$${(Et*Xt).toFixed(2)}`},q:Jt,qStarts:Kt}}).filter(Boolean);u(Qt),n(Array.isArray(ve==null?void 0:ve.data)?ve.data:Array.isArray((a=ve==null?void 0:ve.data)==null?void 0:a.categories)?ve.data.categories:[]),j(Array.isArray(we==null?void 0:we.data)?we.data:Array.isArray((k=we==null?void 0:we.data)==null?void 0:k.providers)?we.data.providers:[]),T(null)}catch(M){if(console.error("InventoryManagement fetchData error:",M),((l=M==null?void 0:M.response)==null?void 0:l.status)===401||((C=M==null?void 0:M.response)==null?void 0:C.status)===403)T("Tu sesión ha expirado o no es válida. Por favor inicia sesión nuevamente.");else{let W=((Y=(F=M==null?void 0:M.response)==null?void 0:F.data)==null?void 0:Y.msg)||((yt=(Ye=M==null?void 0:M.response)==null?void 0:Ye.data)==null?void 0:yt.message)||(M==null?void 0:M.message);(!W||typeof W!="string"||W.includes("is not a function")||W.includes("Cannot read properties")||W.includes("undefined"))&&(W="Error al cargar los datos del inventario. Por favor, verifica tu conexión e intenta de nuevo."),T(W)}}finally{m(!0)}},[at]);r.useEffect(()=>{Q()},[Q]),r.useEffect(()=>{if(!d)return;const a=()=>{Q()};return d.on("inventory_update",a),d.on("products:update",a),()=>{d.off("inventory_update",a),d.off("products:update",a)}},[d,Q]);const{filtered:Se,totalFilteredCount:Ge}=r.useMemo(()=>{const a=I==="code",k=String(q||""),l=String(V||"");let C=Array.isArray(c)?c:[];k&&(C=C.filter(M=>String(M.id_categoria)===k)),l&&(C=C.filter(M=>String(M.id_proveedor)===l));let F=jo(C,y,a?["codigo","codigo_barras"]:["nombre","codigo","descripcion"],{strict:a});y||F.sort((M,W)=>{switch(v){case"name-asc":return(M.nombre||"").localeCompare(W.nombre||"");case"name-desc":return(W.nombre||"").localeCompare(M.nombre||"");case"stock-asc":return(M.existencia||0)-(W.existencia||0);case"stock-desc":return(W.existencia||0)-(M.existencia||0);case"price-asc":return(M.venta||0)-(W.venta||0);case"price-desc":return(W.venta||0)-(M.venta||0);default:return 0}});const Y=F.length,Ye=(ae-1)*Ct;return{filtered:F.slice(Ye,Ye+Ct),totalFilteredCount:Y}},[c,y,q,V,ae,I,v]),ht=()=>J(!0),t=async a=>{let k=null;const l=dt(a.id_producto);if(l&&l!=="loading"&&l!=="none")k=l;else if(l!=="none")try{const C=localStorage.getItem("token"),F=await Pt(a.id_producto,C);k=(F==null?void 0:F.imagen)||null,pt(a.id_producto,k||"none")}catch{}et({...a,imagen:k}),oe(!0)},S=a=>{be(a),Be(!0)},g=async a=>{var k,l;try{console.log("CLIENT SENDING CREATE PAYLOAD:",{...a,imagenLength:a.imagen?a.imagen.length:"NULL"});const C=localStorage.getItem("token");await Z.post(`${ee}/products`,a,{headers:{Authorization:`Bearer ${C}`}}),J(!1),xe.currentTime=0,xe.play().catch(F=>console.warn(F)),G({title:"✅ Éxito",message:"Producto creado correctamente."}),await Q()}catch(C){console.error("CLIENT CREATE ERROR:",C),U.currentTime=0,U.play().catch(F=>console.warn(F)),G({title:"❌ Error",message:((l=(k=C.response)==null?void 0:k.data)==null?void 0:l.msg)||"Error al crear el producto.",type:"error"})}},z=async(a,k)=>{var l,C;try{console.log("CLIENT SENDING UPDATE PAYLOAD:",{...a,imagenLength:a.imagen?a.imagen.length:"NULL"});const F=localStorage.getItem("token");await Z.put(`${ee}/products/${k}`,a,{headers:{Authorization:`Bearer ${F}`}}),oe(!1),yo(k),xe.currentTime=0,xe.play().catch(Y=>console.warn(Y)),G({title:"✅ Éxito",message:"Producto actualizado correctamente."}),await Q()}catch(F){console.error("CLIENT UPDATE ERROR:",F),U.currentTime=0,U.play().catch(Y=>console.warn(Y)),G({title:"❌ Error",message:((C=(l=F.response)==null?void 0:l.data)==null?void 0:C.msg)||"Error al actualizar el producto.",type:"error"})}},B=async()=>{var a;if(K)try{const k=localStorage.getItem("token");await Z.delete(`${ee}/products/${K.id_producto}`,{headers:{Authorization:`Bearer ${k}`}}),await Q(),Be(!1),be(null),G({title:"Éxito",message:`El producto ${K.nombre} fue eliminado.`})}catch(k){const l=(a=k==null?void 0:k.response)==null?void 0:a.data,C=(l==null?void 0:l.msg)||"No se pudo eliminar el producto.";G({title:"Error",message:C,type:"error"}),l!=null&&l.reasons&&qe({open:!0,product:K,detail:l.reasons})}},L=async a=>{var k,l;try{const C=localStorage.getItem("token");await Z.patch(`${ee}/products/${a.id_producto}/archive`,{},{headers:{Authorization:`Bearer ${C}`}}),qe({open:!1,product:null,detail:null}),Be(!1),be(null),await Q(),G({title:"Archivado",message:`"${a.nombre}" fue archivado (inactivo).`})}catch(C){G({title:"Error",message:((l=(k=C==null?void 0:C.response)==null?void 0:k.data)==null?void 0:l.msg)||"No se pudo archivar el producto.",type:"error"})}},H=async(a,k,l)=>{var C,F;try{const Y=localStorage.getItem("token");await Z.patch(`${ee}/products/${a.id_producto}/stock`,{cantidad:k,razon:l},{headers:{Authorization:`Bearer ${Y}`}}),le({isOpen:!1,product:null}),G({title:"Éxito",message:"Stock actualizado correctamente."}),await Q()}catch(Y){G({title:"Error",message:((F=(C=Y.response)==null?void 0:C.data)==null?void 0:F.msg)||"No se pudo ajustar el stock."})}},O=async a=>{var k,l;try{const C=localStorage.getItem("token");await Z.post(`${ee}/categories`,{nombre:a},{headers:{Authorization:`Bearer ${C}`}}),await Q()}catch(C){G({title:"Error",message:((l=(k=C.response)==null?void 0:k.data)==null?void 0:l.msg)||"No se pudo agregar la categoría."})}},X=async a=>{var k,l;try{const C=localStorage.getItem("token");await Z.delete(`${ee}/categories/${a}`,{headers:{Authorization:`Bearer ${C}`}}),await Q()}catch(C){G({title:"Error",message:((l=(k=C.response)==null?void 0:k.data)==null?void 0:l.msg)||"No se pudo eliminar la categoría. (Verifique que no esté en uso)"})}},ue=async a=>{var k,l;try{const C=localStorage.getItem("token");await Z.post(`${ee}/providers`,{nombre:a},{headers:{Authorization:`Bearer ${C}`}}),await Q()}catch(C){G({title:"Error",message:((l=(k=C.response)==null?void 0:k.data)==null?void 0:l.msg)||"No se pudo agregar el proveedor."})}},ce=async a=>{var k,l;try{const C=localStorage.getItem("token");await Z.delete(`${ee}/providers/${a}`,{headers:{Authorization:`Bearer ${C}`}}),await Q()}catch(C){G({title:"Error",message:((l=(k=C.response)==null?void 0:k.data)==null?void 0:l.msg)||"No se pudo eliminar el proveedor. (Verifique que no esté en uso)"})}};if(!p)return e.jsx(wt,{children:e.jsxs(Dt,{children:[e.jsx(gt,{}),e.jsx("p",{children:"Cargando Inventario..."})]})});if(me)return e.jsx(wt,{children:e.jsxs(Dt,{style:{color:"#c53030"},children:[e.jsx(io,{style:{fontSize:"2.5rem",marginBottom:"1rem",color:"#e53e3e"}}),e.jsx("p",{style:{marginBottom:"0.5rem",fontWeight:600,fontSize:"1.1rem"},children:me}),e.jsx("p",{style:{color:"#718096",fontSize:"0.9rem",marginBottom:"1.5rem"},children:"Verifica tu conexión a internet e intenta nuevamente."}),e.jsx(fe,{primary:!0,onClick:()=>{m(!1),T(null),Q()},children:"Reintentar"})]})});const Ne=Se.length<=ur,de=Math.ceil(Ge/Ct);return e.jsxs(wt,{children:[e.jsxs(Ko,{to:"/dashboard",children:[e.jsx(St,{})," Volver al Dashboard"]}),e.jsxs(Zo,{children:[e.jsxs(Xo,{children:[e.jsx(so,{})," Gestión de Inventario"]}),e.jsxs(er,{children:[e.jsxs(fe,{primary:!0,onClick:ht,children:[e.jsx(ut,{})," Crear Producto"]}),e.jsxs(fe,{secondary:!0,onClick:()=>{se(null),Ue(!0)},title:"Generador de Etiquetas / QR en Hoja A4",children:[e.jsx(Le,{})," Etiquetas A4"]}),e.jsxs(fe,{secondary:!0,onClick:()=>tt(!0),children:[e.jsx(ct,{})," Categorías"]}),e.jsxs(fe,{secondary:!0,onClick:()=>Ie(!0),children:[e.jsx(lo,{})," Proveedores"]}),e.jsxs(fe,{tertiary:!0,onClick:()=>ye(!0),children:[e.jsx(Vt,{})," Historial"]})]})]}),e.jsxs(tr,{children:[e.jsxs("div",{style:{display:"flex",gap:"0.5rem"},children:[e.jsxs(or,{style:{flex:1},children:[e.jsx(xt,{style:{position:"absolute",left:12,top:14,color:"#a0aec0"}}),e.jsx(rr,{ref:A,placeholder:I==="code"?"Buscar código...":"Buscar nombre...",value:N,onChange:a=>_(a.target.value),autoComplete:"off",autoCorrect:"off",spellCheck:!1})]}),e.jsx(Tt,{$active:I==="description",onClick:()=>b("description"),title:"Por Nombre",children:e.jsx(co,{})}),e.jsx(Tt,{$active:I==="code",onClick:()=>b("code"),title:"Por Código",children:e.jsx(Le,{})})]}),e.jsxs(pe,{value:q,onChange:a=>D(a.target.value),children:[e.jsx("option",{value:"",children:"Todas las categorías"}),(Array.isArray(i)?i:[]).map(a=>e.jsx("option",{value:a.id_categoria,children:a.nombre},a.id_categoria))]}),e.jsxs(pe,{value:V,onChange:a=>ie(a.target.value),children:[e.jsx("option",{value:"",children:"Todos los proveedores"}),(Array.isArray(w)?w:[]).map(a=>e.jsx("option",{value:a.id_proveedor,children:a.nombre},a.id_proveedor))]}),e.jsxs(pe,{value:v,onChange:a=>s(a.target.value),style:{border:"1px solid #6366f1",background:"#f5f3ff"},children:[e.jsxs("optgroup",{label:"Nombre",children:[e.jsx("option",{value:"name-asc",children:"Nombre (A-Z)"}),e.jsx("option",{value:"name-desc",children:"Nombre (Z-A)"})]}),e.jsxs("optgroup",{label:"Existencia",children:[e.jsx("option",{value:"stock-asc",children:"Existencia (Menor a Mayor)"}),e.jsx("option",{value:"stock-desc",children:"Existencia (Mayor a Menor)"})]}),e.jsxs("optgroup",{label:"Precio",children:[e.jsx("option",{value:"price-asc",children:"Precio (Menor a Mayor)"}),e.jsx("option",{value:"price-desc",children:"Precio (Mayor a Menor)"})]})]})]}),e.jsxs("div",{style:{textAlign:"right",marginBottom:".5rem",color:"#4a5568",fontWeight:"bold",fontSize:"0.9rem"},children:["Página ",ae," de ",de||1," | Mostrando ",(Array.isArray(Se)?Se:[]).length," de ",Ge," productos filtrados"]}),e.jsx(ar,{children:(Array.isArray(Se)?Se:[]).map(a=>{const k=Ne?{initial:{opacity:0,y:12},animate:{opacity:1,y:0},transition:{duration:.12}}:{},l=a.existencia>0&&a.existencia<=(a.minimo||5),C=a.existencia<=0;return e.jsxs(nr,{...k,children:[e.jsx(gr,{productId:a.id_producto,productName:a.nombre,onViewFull:F=>rt({isOpen:!0,productId:a.id_producto,imageUrl:F})}),e.jsxs(ir,{children:[e.jsx(sr,{title:a.nombre,children:a.nombre}),e.jsxs(lr,{children:["Código: ",a.codigo]})]}),e.jsxs(cr,{children:[e.jsxs(mt,{children:[e.jsx("span",{children:"Costo"}),e.jsx("strong",{children:a.__fmt.costo})]}),e.jsxs(mt,{children:[e.jsx("span",{children:"Venta"}),e.jsx("strong",{children:a.__fmt.venta})]}),(()=>{var Y;const F=Number(((Y=o==null?void 0:o.totalByProduct)==null?void 0:Y[a.id_producto])||0);return e.jsxs(dr,{$low:l,$out:C,children:[e.jsx("span",{children:"Existencia"}),e.jsxs("strong",{children:[a.existencia,F>0&&e.jsxs("span",{style:{fontSize:"0.72rem",color:"#f59e0b",display:"block",fontWeight:600},children:["(",F," en caja)"]})]})]})})(),e.jsxs(mt,{children:[e.jsx("span",{children:"Costo Total"}),e.jsx("strong",{children:a.__fmt.costoTotal})]})]}),e.jsxs(pr,{children:[e.jsx(lt,{className:"label",title:"Generar Etiquetas A4",onClick:()=>{se(a),Ue(!0)},children:e.jsx(Le,{})}),e.jsxs(lt,{className:"adjust",title:"Ajustar Stock",onClick:()=>le({isOpen:!0,product:a}),children:[e.jsx(po,{}),e.jsx(mo,{style:{marginLeft:4}})]}),e.jsxs(lt,{className:"edit",onClick:()=>t(a),children:[e.jsx(xo,{})," Editar"]}),e.jsxs(lt,{className:"delete",onClick:()=>S(a),children:[e.jsx(Nt,{})," Eliminar"]})]})]},a.id_producto)})}),Ge>0&&e.jsxs("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",gap:"1.5rem",marginTop:"2rem",marginBottom:"3rem"},children:[e.jsx(fe,{secondary:!0,onClick:()=>De(a=>Math.max(1,a-1)),disabled:ae===1,children:"Anterior"}),e.jsx("div",{style:{display:"flex",gap:"8px"},children:[...Array(de)].map((a,k)=>{const l=k+1;return de>7&&l>2&&l<de-1&&Math.abs(l-ae)>1?l===3||l===de-2?e.jsx("span",{children:"..."},l):null:e.jsx(fe,{secondary:l!==ae,primary:l===ae,style:{minWidth:"40px",padding:"0.5rem"},onClick:()=>De(l),children:l},l)})}),e.jsx(fe,{secondary:!0,onClick:()=>De(a=>Math.min(de,a+1)),disabled:ae===de,children:"Siguiente"})]}),e.jsx(te,{children:Ze&&e.jsx(yr,{isOpen:Ze,onClose:()=>J(!1),onSave:g,categories:i,providers:w,allProductsRaw:h})}),e.jsx(te,{children:Xe&&e.jsx(jr,{isOpen:Xe,onClose:()=>oe(!1),onSave:z,productToEdit:Me,categories:i,providers:w,allProductsRaw:h})}),e.jsx(te,{children:he&&e.jsx(Lt,{open:he,title:"Confirmar Eliminación",message:`¿Estás seguro de que quieres eliminar el producto "${K==null?void 0:K.nombre}"?`,onCancel:()=>Be(!1),onConfirm:B,confirmLabel:"Sí, eliminar",danger:!0})}),e.jsx(te,{children:je.open&&e.jsx(Lt,{open:je.open,title:"Eliminación bloqueada",message:e.jsxs("div",{style:{textAlign:"left",lineHeight:1.6},children:["Este producto tiene referencias y no puede eliminarse.",e.jsx("br",{}),e.jsx("strong",{children:"Referencias:"}),e.jsx("br",{}),"Ventas: ",((Ae=je.detail)==null?void 0:Ae.ventas)??0,e.jsx("br",{}),"Compras: ",((bt=je.detail)==null?void 0:bt.compras)??0,e.jsx("br",{}),"Movimientos (kardex): ",((Qe=je.detail)==null?void 0:Qe.kardex)??0,e.jsx("br",{}),e.jsx("br",{}),"Puedes ",e.jsx("strong",{children:"archivarlo"})," para ocultarlo del sistema sin perder historial."]}),onCancel:()=>qe({open:!1,product:null,detail:null}),onConfirm:()=>L(je.product),confirmLabel:"Archivar producto",danger:!1})}),e.jsx(te,{children:re&&e.jsx(Ot,{title:"Gestionar Categorías",items:i,onAdd:O,onDelete:X,onClose:()=>tt(!1)})}),e.jsx(te,{children:ke&&e.jsx(Ot,{title:"Gestionar Proveedores",items:w,onAdd:ue,onDelete:ce,onClose:()=>Ie(!1)})}),e.jsx(te,{children:ot&&e.jsx(br,{onClose:()=>ye(!1)})}),e.jsx(te,{children:P.isOpen&&e.jsx(hr,{isOpen:P.isOpen,product:P.product,onClose:()=>le({isOpen:!1,product:null}),onConfirm:H})}),e.jsx(te,{children:Re.isOpen&&e.jsx(fr,{isOpen:Re.isOpen,onClose:ft,title:Re.title,message:Re.message})}),e.jsx(te,{children:Te.isOpen&&e.jsx(mr,{isOpen:Te.isOpen,productId:Te.productId,imageSrc:Te.imageUrl,onClose:()=>rt({isOpen:!1,productId:null,imageUrl:null})})}),e.jsx(te,{children:He&&e.jsx(Jo,{isOpen:He,onClose:()=>{Ue(!1),se(null)},products:c,categories:i,initialProduct:Fe})})]})};export{Nr as default};

import{s as o,ac as t,t as i,v as r,S as a}from"./vendor-j_myMsPa.js";const n=i`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;i`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;const d=i`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;o(r)`
  animation: ${d} 1s linear infinite;
`;const p=o.div`
  display: flex; flex-direction: column; height: 100vh;
  background: #f8fafc;
  font-family: 'Inter', sans-serif;
  color: #1e293b;
  overflow: hidden;
`,c=o.header`
  position: sticky; top: 0; z-index: 50;
  width: 100%; height: 64px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 1.5rem;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);

  .right-actions {
    display: flex; gap: 8px; align-items: center;
  }
`,l=o.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  height: calc(100vh - 64px);

  @media (max-width: 960px) {
    flex-direction: column;
    overflow-y: auto;
    height: auto;
    min-height: calc(100vh - 64px);
  }
`,f=o.div`
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #f8fafc;

  @media (max-width: 960px) {
    width: 100%;
    padding: 12px;
    overflow: visible;
  }
`,x=o.div`
  width: 420px;
  background: white;
  border-left: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 15px rgba(0,0,0,0.02);
  z-index: 40; /* Ensure it stays above main content if needed */
  
  @media (max-width: 960px) {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    border-left: none;
    border-top: none;
    flex: none;
    transform: translateY(${e=>e.isOpen?"0":"100%"});
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 2000; /* Highest z-index for modal-like behavior on mobile */
  }
`,b=o.button`
  display: none;
  @media (max-width: 960px) {
    display: flex; align-items: center; justify-content: space-between;
    position: fixed; bottom: 20px; left: 20px; right: 20px;
    background: #0f172a; color: white;
    padding: 16px 24px; border-radius: 16px; border: none;
    box-shadow: 0 10px 25px rgba(15, 23, 42, 0.4);
    z-index: 1000; font-weight: 700; font-size: 1rem; cursor: pointer;
    transition: transform 0.2s;
    &:active { transform: scale(0.98); }
  }
`,g=o.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 1.25rem;
  overflow-y: auto;
  padding: 4px;
  flex: 1;
  
  /* Evitar que el grid colapse o se estire raro */
  align-content: start;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
`,h=o.div`
  background: white;
  border-radius: 14px;
  overflow: hidden;
  position: relative;
  transition: all 0.2s;
  border: 1px solid #f1f5f9;
  display: flex; flex-direction: column;
  height: 280px; /* Altura fija para consistencia en el grid */

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 20px -5px rgba(0, 0, 0, 0.1);
    border-color: #3b82f6;

    .eye-icon { opacity: 1; transform: scale(1); }
  }

  ${e=>e.outOfStock&&t`
    opacity: 0.6; filter: grayscale(0.8);
    background: #f8fafc;
  `}

  .image-placeholder {
    width: 100%; height: 160px;
    background: #f8fafc;
    display: flex; align-items: center; justify-content: center;
    position: relative;
    border-bottom: 1px solid #f1f5f9;
    
    img { width: 100%; height: 100%; object-fit: contain; padding: 10px; }
    .no-image-icon { font-size: 2.5rem; color: #e2e8f0; }
  }

  .eye-icon {
    position: absolute; top: 10px; left: 10px; z-index: 20;
    background: white; border-radius: 50%;
    width: 32px; height: 32px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    color: #475569;
    opacity: 1; transform: scale(1);
    transition: all 0.2s;
    
    &:hover { color: #2563eb; transform: scale(1.1); }
  }

  .info {
    padding: 12px;
    flex-grow: 1;
    display: flex; flex-direction: column; gap: 4px;
    justify-content: space-between;
  }

  .product-name {
    font-weight: 600; font-size: 0.85rem; color: #334155; line-height: 1.3;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    height: 2.6em;
  }

  .price {
    font-weight: 800; color: #2563eb; font-size: 1.1rem;
  }

  @media (max-width: 768px) {
    height: 240px;
    .image-placeholder { height: 120px; }
    .eye-icon { opacity: 1; transform: scale(1); }
  }
`,m=o.div`
  position: absolute; top: 10px; right: 10px;
  background: ${e=>e.outOfStock?"#ef4444":e.lowstock?"#f59e0b":"#10b981"};
  color: white; font-size: 0.7rem; font-weight: 700;
  padding: 2px 8px; border-radius: 10px; z-index: 10;
`,u=o.input`
  width: 100%;
  padding: 12px 16px;
  border-radius: 10px;
  border: 2px solid #e2e8f0;
  background: white;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;
  
  &:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
`,w=o.button`
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 10px 20px; border-radius: 10px;
  font-weight: 600; font-size: 0.9rem;
  border: none; cursor: pointer;
  transition: all 0.2s;

  ${e=>e.primary&&t`
    background: #2563eb; color: white;
    &:hover { background: #1d4ed8; }
  `}

  ${e=>e.secondary&&t`
    background: white; color: #475569; border: 1px solid #e2e8f0;
    &:hover { background: #f8fafc; border-color: #cbd5e1; }
  `}

  ${e=>e.danger&&t`
    background: #fef2f2; color: #ef4444;
    &:hover { background: #fee2e2; }
  `}

  &:disabled { opacity: 0.5; cursor: not-allowed; }
`,y=o(a)`
  display: flex; align-items: center; gap: 6px;
  color: #64748b; text-decoration: none; font-weight: 600; font-size: 0.9rem;
  &:hover { color: #334155; }
`,v=o.div`
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px;
  background: white; border-bottom: 1px solid #f1f5f9;
  transition: background 0.2s;
  &:hover { background: #f8fafc; }
`,k=o.div`
  display: flex; align-items: center; gap: 8px;
  background: #f1f5f9; padding: 4px; border-radius: 8px;
`,z=o.button`
  width: 28px; height: 28px; border-radius: 6px;
  border: none; background: white;
  color: #64748b;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  cursor: pointer;
  &:hover { color: #3b82f6; }
`,j=o.div`
  display: flex; justify-content: space-between; align-items: center;
  padding: 8px 0;
  font-size: 0.9rem; color: #64748b; font-weight: 500;

  &.grand-total {
    font-size: 1.5rem; color: #0f172a; font-weight: 900;
    border-top: 1px solid #e2e8f0; margin-top: 8px; padding-top: 16px;
  }
`,$=o.div`
  background: #fef2f2; color: #991b1b; padding: 10px 14px; border-radius: 10px;
  font-size: 0.8rem; display: flex; align-items: center; gap: 8px;
  margin-bottom: 1rem; border: 1px solid #fee2e2;
`,C=o.div`
  display: flex; gap: 8px; overflow-x: auto; padding: 4px 0;
  margin-bottom: 8px;
  &::-webkit-scrollbar { height: 4px; }
`,B=o.div`
  padding: 6px 12px;
  border-radius: 8px 8px 0 0;
  background: ${e=>e.active?"white":"#e2e8f0"};
  color: ${e=>e.active?"#2563eb":"#64748b"};
  font-weight: ${e=>e.active?"700":"600"};
  font-size: 0.85rem;
  cursor: pointer;
  display: flex; align-items: center; gap: 6px;
  border: 1px solid ${e=>e.active?"#e2e8f0":"transparent"};
  border-bottom: none;
  transition: all 0.2s;
  min-width: 80px; justify-content: center;
  position: relative;
  
  &:hover {
    background: ${e=>e.active?"white":"#cbd5e1"};
    color: ${e=>e.active?"#1d4ed8":"#475569"};
  }

  /* Active tab looks connected to content below */
  ${e=>e.active&&t`
    box-shadow: 0 -2px 4px rgba(0,0,0,0.05);
    z-index: 10;
    &::after {
      content: ''; position: absolute; bottom: -2px; left: 0; right: 0;
      height: 4px; background: white;
    }
  `}
`,O=o.button`
  width: 32px; height: 32px;
  border-radius: 50%;
  border: 2px dashed #cbd5e1;
  background: transparent;
  color: #64748b;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: 4px;
  font-size: 0.8rem;

  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
    background: #eff6ff;
  }
`,P=o.div`
  position: fixed; inset: 0; z-index: 5000;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
`,S=o.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  width: 100%; max-width: 600px;
  max-height: 90vh; overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
  animation: ${n} 0.3s ease-out;

  h2 { margin-top: 0; color: #0f172a; }
`;export{w as B,x as C,c as H,$ as I,P as M,O as N,B as O,p as P,k as Q,z as R,u as S,C as T,S as a,y as b,l as c,f as d,v as e,j as f,b as g,g as h,h as i,m as j};

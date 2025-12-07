import React, { useState, useMemo, useEffect, useCallback } from 'react';
import styled, { css } from 'styled-components';
import {
  FaHistory, FaWindowClose, FaRegClock, FaUsers, FaFilter, FaSearch,
  FaAngleLeft, FaAngleRight, FaHandHoldingUsd, FaMoneyBillWave,
  FaRegCreditCard, FaExchangeAlt
} from 'react-icons/fa';

import {
  ModalOverlay,
  ModalContent as OriginalModalContent,
  Button as OriginalButton,
  SearchInput,
  InfoBox,
  Button
} from '../POS.styles.jsx';

import AlertModal from './AlertModal';
import AbonoCreditoModal from './AbonoCreditoModal';
import SaleDetailView from './SaleDetailView';

const todayLocal = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  const localDate = new Date(now.getTime() - offset);
  return localDate.toISOString().split('T')[0];
};

const money = (n) =>
  new Intl.NumberFormat('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    .format(Number(n || 0));

const getPaymentTypeLabel = (pagoDetalles) => {
  if (!pagoDetalles) return { label: 'N/A', icon: null };
  const { efectivo, tarjeta, transferencia, credito } = pagoDetalles;
  if (Number(credito) > 0) return { label: 'Crédito', icon: <FaRegCreditCard style={{ color: '#dc3545' }} /> };
  
  const methods = [];
  if (Number(efectivo) > 0) methods.push('Efectivo');
  if (Number(tarjeta) > 0) methods.push('Tarjeta');
  if (Number(transferencia) > 0) methods.push('Transferencia');

  if (methods.length === 1) {
    if (methods[0] === 'Efectivo') return { label: 'Efectivo', icon: <FaMoneyBillWave style={{ color: '#28a745' }} /> };
    if (methods[0] === 'Tarjeta') return { label: 'Tarjeta', icon: <FaRegCreditCard style={{ color: '#007bff' }} /> };
    return { label: 'Transferencia', icon: <FaExchangeAlt style={{ color: '#007bff' }} /> };
  }
  return { label: methods.length > 1 ? 'Mixto' : 'Contado', icon: <FaMoneyBillWave style={{ color: '#28a745' }} /> };
};

const safeItemName = (it, idx = 0) => it?.nombre ?? it?.name ?? it?.producto ?? it?.descripcion ?? `Item ${idx + 1}`;

/* STYLES */
const ModalContent = styled(OriginalModalContent)`
  width: 95%; max-width: 1400px; height: 90vh; display: flex; flex-direction: column; padding: 1.25rem;
  @media (max-width: 768px) { height: 95vh; padding: 1rem; }
`;
const Header = styled.div`display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid #dee2e6; h2 { margin: 0; display:flex; gap:8px; align-items:center; }`;
const FilterGrid = styled.div`display: grid; grid-template-columns: repeat(4, minmax(180px, 1fr)); gap: .75rem 1rem; margin-bottom: 1rem; label { display: block; font-size: .9rem; color: #6c757d; margin-bottom: .25rem; }`;
const Main = styled.div`display: grid; grid-template-columns: 380px 1fr; gap: 1rem; flex: 1; min-height: 0;`;
const LeftPanel = styled.div`background: #f8f9fa; border-radius: 12px; padding: .75rem; display: flex; flex-direction: column; min-height: 0;`;
const RightPanel = styled.div`background: #fff; border-radius: 12px; padding: 1rem; min-height: 0; box-shadow: 0 2px 10px rgba(0,0,0,.06);`;
const TopRow = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: .5rem; small { color: #6c757d; }`;
const List = styled.div`flex: 1; overflow: auto; padding-right: 4px; min-height: 200px;`;
const Pagination = styled.div`display: flex; justify-content: center; align-items: center; gap: .75rem; padding-top: .5rem; border-top: 1px solid #e9ecef;`;
const Row = styled.div`padding: .7rem .8rem; border-left: 5px solid ${p => p.$borderColor || '#6c757d'}; border-radius: 8px; background: ${p => p.selected ? '#e9f2ff' : '#fff'}; box-shadow: 0 1px 3px rgba(0,0,0,.05); margin-bottom: .6rem; cursor: pointer; &:hover { box-shadow: 0 2px 6px rgba(0,0,0,.1); } .top { display: flex; justify-content: space-between; gap: .75rem; font-weight: 700; font-size: .95rem; } .sub { color: #6c757d; font-size: .82rem; margin-top: 2px; }`;
const Pill = styled.span`display: inline-flex; align-items: center; justify-content: center; border-radius: 9999px; padding: .25rem .6rem; font-weight: 700; font-size: .8rem; ${p => p.$green && css`background:#e8f7ee; color:#198754;`} ${p => p.$red && css`background:#fdecec; color:#dc3545;`}`;

const SaleListItem = React.memo(({ sale, isSelected, onSelect, safeUsers, safeClients }) => {
  const statusColors = { COMPLETADA: '#28a745', CANCELADA: '#dc3545', DEVOLUCION: '#dc3545', ABONO_CREDITO: '#17a2b8' };
  const userName = safeUsers.find(u => (u.id_usuario ?? u.id) == sale.userId)?.nombre_usuario ?? 'N/A';
  const clientName = safeClients.find(c => c.id_cliente === (sale.clientId || sale.idCliente))?.nombre || 'Consumidor Final';
  
  let leftLabel = <>#{sale.id} - {sale.estado.replace('_', ' ')}</>;
  if (sale.estado === 'ABONO_CREDITO') leftLabel = <><FaHandHoldingUsd style={{ marginRight: 6 }} /> ABONO</>;
  // Hack visual: Si es devolución, que parezca cancelación
  if (sale.estado === 'DEVOLUCION') leftLabel = <>#{sale.id} - CANCELACIÓN</>;

  return (
    <Row onClick={() => onSelect(sale)} selected={isSelected} $borderColor={statusColors[sale.estado] || '#6c757d'}>
      <div className="top"><span>{leftLabel}</span><span>{getPaymentTypeLabel(sale.pagoDetalles).icon} C${money(Math.abs(Number(sale.totalVenta ?? sale.total ?? 0)))}</span></div>
      <div className="sub">{new Date(sale.fecha).toLocaleString('es-NI')} · <strong>{clientName}</strong> · {userName}</div>
    </Row>
  );
});

const ITEMS_PER_PAGE = 10;

function SalesHistoryModal({ dailySales = [], loadSales, onClose, isAdmin, users = [], clients = [], onReprintTicket, onCancelSale, onReturnItem, onAbonoSuccess }) {
  const [currentApiDate, setCurrentApiDate] = useState(todayLocal());
  const [filterDate, setFilterDate] = useState(todayLocal());
  const [salesData, setSalesData] = useState(Array.isArray(dailySales) ? dailySales : []);
  const [loadingSales, setLoadingSales] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showAbonoModal, setShowAbonoModal] = useState(false);

  // Estados locales para alertas/confirmaciones
  const [alertState, setAlertState] = useState({ open: false, title: '', message: '' });
  const [confirmState, setConfirmState] = useState({ open: false, title: '', message: '', onConfirm: null });
  const [promptState, setPromptState] = useState({ open: false, title: '', message: '', initialValue: '1', onConfirm: null });
  
  const openAlert = (t, m) => setAlertState({ open: true, title: t, message: m });
  const openConfirm = (t, m, cb) => setConfirmState({ open: true, title: t, message: m, onConfirm: cb });
  const openPrompt = (t, m, v, cb) => setPromptState({ open: true, title: t, message: m, initialValue: String(v), onConfirm: cb });
  
  const safeUsers = useMemo(() => Array.isArray(users) ? users : [], [users]);
  const safeClients = useMemo(() => Array.isArray(clients) ? clients : [], [clients]);

  const fetchSalesByDate = useCallback(async (date = null) => {
    if (!loadSales) return [];
    setLoadingSales(true);
    setCurrentApiDate(date);
    try {
      const data = await loadSales(date);
      setSalesData(Array.isArray(data) ? data : []);
      return data; // Retornamos los datos para usarlos en el handleReturn
    } catch (e) { openAlert('Error', 'Error cargando ventas.'); return []; }
    finally { setLoadingSales(false); }
  }, [loadSales]);

  useEffect(() => { fetchSalesByDate(searchTerm.length >= 2 ? null : filterDate); setCurrentPage(1); setSelectedSale(null); }, [filterDate, searchTerm]);
  
  const filteredSales = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return salesData.filter(s => {
      const cName = safeClients.find(c => c.id_cliente === (s.clientId || s.idCliente))?.nombre || '';
      return (!filterUser || String(s.userId) == filterUser) && (!filterStatus || s.estado === filterStatus) && (!q || String(s.id).includes(q) || cName.toLowerCase().includes(q));
    }).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }, [salesData, filterUser, filterStatus, searchTerm, safeClients]);

  const pageItems = filteredSales.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  useEffect(() => { if (!selectedSale || !pageItems.find(i => i.id === selectedSale.id)) setSelectedSale(pageItems[0] || null); }, [pageItems]);

  // --- FUNCIÓN CLAVE CORREGIDA PARA ELEVENTA ---
  const handleReturn = useCallback((item, index = 0) => {
    if (!selectedSale || !onReturnItem) return;
    const maxQty = Number(item?.quantity || item?.cantidad || 0);
    
    openPrompt('Cancelar Producto', `Cantidad a cancelar (máx. ${maxQty})`, '1', async (val) => {
      const qty = Number(val);
      if (qty <= 0 || qty > maxQty) { openAlert('Error', 'Cantidad inválida'); return; }
      
      try {
        // 1. LLAMADA AL BACKEND (Genera la devolución real)
        await onReturnItem(selectedSale, item, qty);
        openAlert('Éxito', 'Producto cancelado correctamente.');

        // 2. CREAR VERSIÓN "LIMPIA" DEL TICKET (Sin el artículo)
        const updatedItems = selectedSale.items.map(it => {
            const sameId = (it.id && it.id === item.id) || (it.id_producto && it.id_producto === item.id_producto);
            // Si coincide, restamos cantidad.
            if (it === item || sameId) {
                return { ...it, cantidad: (it.quantity || it.cantidad) - qty };
            }
            return it;
        }).filter(it => (it.quantity || it.cantidad) > 0); // SI ES 0, SE VA.

        // Calcular nuevo total visual (restando lo devuelto)
        const price = Number(item.precio || item.precio_unitario || 0);
        const deducted = price * qty;
        const currentTotal = Number(selectedSale.totalVenta || selectedSale.total || 0);
        
        // Objeto de venta modificado (ESTE ES EL QUE QUEREMOS VER)
        const cleanTicket = { 
            ...selectedSale, 
            items: updatedItems,
            totalVenta: currentTotal - deducted,
            total: currentTotal - deducted
        };

        // 3. ACTUALIZAR ESTADO LOCAL INMEDIATAMENTE
        setSelectedSale(cleanTicket);

        // 4. ESTRATEGIA DE FUSIÓN (MERGE) PARA EVITAR QUE LA BD LO SOBRESCRIBA
        // Cargamos los datos nuevos (para que aparezca el ticket amarillo nuevo)
        const freshData = await loadSales(currentApiDate);
        
        if (Array.isArray(freshData)) {
            // Recorremos los datos que vienen del servidor.
            // Si encontramos el ticket ID #343 (el original), NO usamos el del servidor,
            // usamos nuestro "cleanTicket" modificado.
            const mergedData = freshData.map(serverSale => {
                if (String(serverSale.id) === String(selectedSale.id)) {
                    return cleanTicket; // Inyectamos nuestra versión sin el artículo
                }
                return serverSale;
            });
            
            // Guardamos la lista fusionada
            setSalesData(mergedData);
        }

      } catch (e) { openAlert('Error', e.message || 'No se pudo cancelar.'); }
      finally { setPromptState(prev => ({ ...prev, open: false })); }
    });
  }, [selectedSale, onReturnItem, loadSales, currentApiDate]);

  const handleCancel = useCallback((id) => {
    const saleId = id || selectedSale?.id;
    if(!saleId) return;
    openConfirm('Cancelar Venta', `¿Cancelar venta #${saleId}?`, async () => {
       setConfirmState(p => ({...p, open:false}));
       try { await onCancelSale(saleId); openAlert('Éxito', 'Venta cancelada'); fetchSalesByDate(currentApiDate); }
       catch(e) { openAlert('Error', e.message); }
    });
  }, [selectedSale, onCancelSale, fetchSalesByDate, currentApiDate]);

  return (
    <ModalOverlay>
      <ModalContent>
        <Header><h2><FaHistory /> Historial</h2> <OriginalButton $cancel onClick={onClose}><FaWindowClose /></OriginalButton></Header>
        <FilterGrid>
          <div><label>Buscar:</label><SearchInput value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} placeholder="ID o Nombre..." /></div>
          <div><label>Fecha:</label><SearchInput type="date" value={filterDate} onChange={e=>setFilterDate(e.target.value)} /></div>
          {isAdmin && <div><label>Usuario:</label><SearchInput as="select" value={filterUser} onChange={e=>setFilterUser(e.target.value)}><option value="">Todos</option>{safeUsers.map(u=><option key={u.id} value={u.id}>{u.nombre_usuario}</option>)}</SearchInput></div>}
          <div><label>Estado:</label><SearchInput as="select" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}><option value="">Todos</option><option value="COMPLETADA">Completadas</option><option value="CANCELADA">Canceladas</option><option value="DEVOLUCION">Cancelaciones (Dev)</option></SearchInput></div>
        </FilterGrid>
        
        <Main>
          <LeftPanel>
            <TopRow><small>{filteredSales.length} resultados</small></TopRow>
            {!loadingSales ? <List>{pageItems.map(s => <SaleListItem key={s.id} sale={s} isSelected={selectedSale?.id === s.id} onSelect={setSelectedSale} safeUsers={safeUsers} safeClients={safeClients} />)}</List> : <InfoBox>Cargando...</InfoBox>}
            <Pagination>
              <OriginalButton disabled={currentPage===1} onClick={()=>setCurrentPage(p=>p-1)}><FaAngleLeft/></OriginalButton>
              <span>{currentPage} / {Math.max(1, Math.ceil(filteredSales.length/ITEMS_PER_PAGE))}</span>
              <OriginalButton disabled={currentPage * ITEMS_PER_PAGE >= filteredSales.length} onClick={()=>setCurrentPage(p=>p+1)}><FaAngleRight/></OriginalButton>
            </Pagination>
          </LeftPanel>

          {selectedSale ? (
             selectedSale.estado === 'ABONO_CREDITO' ? <RightPanel><h3>Abono</h3><OriginalButton onClick={()=>onReprintTicket(selectedSale)}>Imprimir</OriginalButton></RightPanel> :
             (selectedSale.estado === 'DEVOLUCION' || selectedSale.estado === 'CANCELADA') ? 
             <RightPanel>
                <h3>Ticket Cancelado/Devuelto #{selectedSale.id}</h3>
                <div style={{background:'#f8d7da', padding:10, borderRadius:8, color:'#721c24', fontWeight:'bold', marginBottom:10}}>ESTADO: CANCELACIÓN</div>
                <ul>{(selectedSale.items||[]).map((it,i)=><li key={i}>{safeItemName(it,i)} ({it.cantidad||it.quantity})</li>)}</ul>
                <p>Monto: C${money(Math.abs(selectedSale.totalVenta||0))}</p>
                <OriginalButton onClick={()=>onReprintTicket(selectedSale)}>Reimprimir</OriginalButton>
             </RightPanel> 
             :
             <SaleDetailView sale={selectedSale} client={safeClients.find(c=>c.id_cliente===(selectedSale.clientId||selectedSale.idCliente))} isAdmin={isAdmin} 
               onReturnItem={handleReturn} onCancelSale={handleCancel} onReprintTicket={()=>onReprintTicket(selectedSale)} 
               showConfirmation={({onConfirm})=>openConfirm('Confirmar','¿Seguro?',onConfirm)} 
               showPrompt={({title,message,defaultValue,onConfirm})=>openPrompt(title,message,defaultValue,onConfirm)} 
               showAlert={({title,message})=>openAlert(title,message)} />
          ) : <RightPanel />}
        </Main>

        {showAbonoModal && <AbonoCreditoModal onClose={()=>setShowAbonoModal(false)} />}
      </ModalContent>

      <AlertModal isOpen={alertState.open} onClose={()=>setAlertState(p=>({...p,open:false}))} title={alertState.title} message={alertState.message} />
      {confirmState.open && <div style={{position:'fixed',zIndex:9999,top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.5)',display:'flex',justifyContent:'center',alignItems:'center'}}>
          <div style={{background:'white',padding:20,borderRadius:8,maxWidth:400}}><h3>{confirmState.title}</h3><p>{confirmState.message}</p>
          <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}><Button $cancel onClick={()=>setConfirmState(p=>({...p,open:false}))}>No</Button><Button primary onClick={confirmState.onConfirm}>Si</Button></div></div>
      </div>}
      {promptState.open && <div style={{position:'fixed',zIndex:9999,top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.5)',display:'flex',justifyContent:'center',alignItems:'center'}}>
          <div style={{background:'white',padding:20,borderRadius:8,maxWidth:400}}><h3>{promptState.title}</h3><p>{promptState.message}</p>
          <input type="number" autoFocus style={{width:'100%',padding:8,marginBottom:10}} value={promptState.inputValue} onChange={(e)=>{promptState.initialValue=e.target.value; setPromptState({...promptState})}} />
          <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}><Button $cancel onClick={()=>setPromptState(p=>({...p,open:false}))}>Cancelar</Button><Button primary onClick={()=>promptState.onConfirm(promptState.initialValue)}>Aceptar</Button></div></div>
      </div>}
    </ModalOverlay>
  );
}

const LocalModal = ({ isOpen, children, maxWidth = 450 }) => {
  if (!isOpen) return null;
  return ( <ModalOverlay style={{ zIndex: 99999, backgroundColor: 'rgba(0,0,0,0.6)' }}><OriginalModalContent style={{ maxWidth: `${maxWidth}px`, textAlign: 'center' }}>{children}</OriginalModalContent></ModalOverlay> );
};
const LocalConfirm = ({ isOpen, title, message, onCancel, onConfirm }) => ( <LocalModal isOpen={isOpen}><h2 style={{ marginTop: 0 }}>{title}</h2><p style={{ color: '#6c757d', lineHeight: 1.5 }}>{message}</p><div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 10 }}><Button onClick={onCancel} $cancel>Cancelar</Button><Button onClick={onConfirm} primary>Aceptar</Button></div></LocalModal> );
const LocalPrompt = ({ isOpen, title, message, initialValue = '1', inputType = 'number', onCancel, onConfirm }) => {
  const [val, setVal] = useState(initialValue);
  useEffect(() => { setVal(initialValue); }, [initialValue, isOpen]);
  return ( <LocalModal isOpen={isOpen}><h2 style={{ marginTop: 0 }}>{title}</h2>{message && <p style={{ color: '#6c757d' }}>{message}</p>}<input style={{ width: '100%', padding: '.6rem', borderRadius: 8, border: '1px solid #dee2e6', margin: '8px 0 14px' }} type={inputType} value={val} onChange={e => setVal(e.target.value)} /><div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}><Button onClick={onCancel} $cancel>Cancelar</Button><Button onClick={() => onConfirm(val)} primary>Aceptar</Button></div></LocalModal> );
};

export default React.memo(SalesHistoryModal);
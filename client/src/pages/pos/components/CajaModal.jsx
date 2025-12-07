import React, { useMemo, useState } from 'react';
import { ModalOverlay, ModalContent, Button, SearchInput, TotalsRow } from '../POS.styles.jsx';
import { FaLockOpen, FaFileInvoiceDollar, FaRegCreditCard, FaMoneyBillWave, FaExchangeAlt, FaUserClock, FaPrint } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CajaModal = ({ currentUser, isCajaOpen, session, onOpenCaja, onCloseCaja, onClose, isAdmin, showConfirmation, showAlert, initialTasaDolar }) => {
  const [montoApertura, setMontoApertura] = useState('');
  const [tasaDolar, setTasaDolar] = useState(initialTasaDolar || 36.60);
  const [montoContado, setMontoContado] = useState('');
  const [viewingReport, setViewingReport] = useState(false);
  const navigate = useNavigate();

  const transactions = useMemo(() => Array.isArray(session?.transactions) ? session.transactions : [], [session]);

  const { cajaInicial, movimientoNetoEfectivo, efectivoEsperado, ventasContado, cancelaciones, entradas, salidas, abonos, totalNoEfectivo, totalCanceladoEfectivo } = useMemo(() => {
    const cajaInicialN = Number(session?.initialAmount || 0);
    const cls = { ventasContado: [], cancelaciones: [], entradas: [], salidas: [], abonos: [] };
    
    let netCash = 0; // Efectivo neto
    let tNoCash = 0; // Tarjeta, etc

    for (const tx of transactions) {
      const typeRaw = (tx.type || tx.estado || '').toLowerCase();
      const pd = tx.pagoDetalles || {};
      
      // Monto en efectivo reportado
      let ingresoCaja = Number(pd.ingresoCaja || 0);

      // --- LOGICA DE EGRESOS ---
      // Si es devolucion, cancelacion o salida -> RESTAMOS
      if (typeRaw.includes('devolucion') || typeRaw.includes('cancelacion') || typeRaw === 'salida') {
        
        // CORRECCION CRITICA: Si ingresoCaja es 0 (error común de backend), usamos el monto total
        if (ingresoCaja === 0) {
            ingresoCaja = Number(tx.amount || tx.total || tx.monto || 0);
        }

        // Siempre restamos
        netCash -= Math.abs(ingresoCaja);

        // Agrupamos visualmente
        if (typeRaw === 'salida') cls.salidas.push(tx);
        else cls.cancelaciones.push(tx); // Devoluciones van aqui
      } 
      else if (typeRaw === 'venta_credito') { /* Ignorar efectivo */ }
      else {
        // Ingresos
        netCash += Math.abs(ingresoCaja);
        if (typeRaw.includes('entrada')) cls.entradas.push(tx);
        else if (typeRaw.includes('abono')) cls.abonos.push(tx);
        else cls.ventasContado.push(tx);
      }

      // Sumar no efectivos
      tNoCash += (Number(pd.tarjeta||0) + Number(pd.transferencia||0) + Number(pd.credito||0));
    }

    const totalCanceladoEfectivo = cls.cancelaciones.reduce((acc, tx) => acc + Math.abs(Number(tx.pagoDetalles?.ingresoCaja || tx.amount || 0)), 0);

    return {
      cajaInicial: cajaInicialN,
      movimientoNetoEfectivo: netCash,
      efectivoEsperado: cajaInicialN + netCash,
      ventasContado: cls.ventasContado,
      cancelaciones: cls.cancelaciones,
      entradas: cls.entradas,
      salidas: cls.salidas,
      abonos: cls.abonos,
      totalNoEfectivo: tNoCash,
      totalCanceladoEfectivo
    };
  }, [transactions, session]);

  const diferencia = (Number(montoContado || 0) - efectivoEsperado);
  const handleOpen = () => onOpenCaja(parseFloat(montoApertura||0), Number(tasaDolar||36.60));
  const handleClose = () => onCloseCaja(Number(montoContado));
  const confirmClose = () => Math.abs(diferencia) > 0.01 ? showConfirmation({ title: 'Diferencia', message: `Diferencia de C$${diferencia.toFixed(2)}. ¿Cerrar?`, onConfirm: handleClose }) : handleClose();
  
  const printReport = () => {
    const w = window.open('','_blank');
    const fmt = n => `C$${Number(n||0).toFixed(2)}`;
    const rows = (list, c) => list.map(t => `<tr><td>${new Date(t.at).toLocaleTimeString()}</td><td>${t.note||t.type}</td><td style="text-align:right;color:${c}">${fmt(Math.abs(t.pagoDetalles?.ingresoCaja||t.amount||0))}</td></tr>`).join('');
    w.document.write(`<html><head><style>body{font-family:sans-serif;padding:20px}table{width:100%;border-collapse:collapse}td{border-bottom:1px solid #eee;padding:5px}</style></head><body><h2>Cierre de Caja</h2>
    <p><b>Inicio:</b> ${fmt(cajaInicial)}<br/><b>Neto:</b> ${fmt(movimientoNetoEfectivo)}<br/><b>Esperado:</b> ${fmt(efectivoEsperado)}<br/><b>Físico:</b> ${fmt(montoContado)}</p>
    <h3>Cancelaciones/Devoluciones (Restado)</h3><table>${rows(cancelaciones, 'red')}</table>
    <h3>Ventas Contado</h3><table>${rows(ventasContado, 'black')}</table>
    <script>window.print();window.close();</script></body></html>`);
    w.document.close();
  };

  return (
    <ModalOverlay>
      <ModalContent style={{maxWidth:700}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:20}}><h2>Gestión de Caja</h2><Button $cancel onClick={onClose}>X</Button></div>
        {!isCajaOpen ? (
           <div style={{display:'grid', gap:15}}>
             <label>Monto Inicial: <SearchInput type="number" value={montoApertura} onChange={e=>setMontoApertura(e.target.value)} autoFocus/></label>
             <label>Tasa Dólar: <SearchInput type="number" value={tasaDolar} onChange={e=>setTasaDolar(e.target.value)}/></label>
             <Button primary onClick={handleOpen} style={{marginTop:10, padding:15}}>ABRIR CAJA</Button>
           </div>
        ) : viewingReport ? (
           <div>
             <TotalsRow><span>Fondo Inicial:</span><span>C${cajaInicial.toFixed(2)}</span></TotalsRow>
             <TotalsRow><span>Movimiento Neto:</span><span>C${movimientoNetoEfectivo.toFixed(2)}</span></TotalsRow>
             <hr/>
             <TotalsRow $bold><span>Efectivo Esperado:</span><span>C${efectivoEsperado.toFixed(2)}</span></TotalsRow>
             <TotalsRow><span>Monto Físico:</span><span>C${Number(montoContado).toFixed(2)}</span></TotalsRow>
             <TotalsRow $bold style={{color: diferencia!==0?'red':'green'}}><span>Diferencia:</span><span>C${diferencia.toFixed(2)}</span></TotalsRow>
             
             <div style={{marginTop:15, color:'#dc3545', fontWeight:'bold'}}>Cancelaciones/Devoluciones: -C${totalCanceladoEfectivo.toFixed(2)}</div>
             <div style={{color:'#007bff'}}>Total Tarjeta/Transf: C${totalNoEfectivo.toFixed(2)}</div>

             <div style={{display:'flex', gap:10, marginTop:20}}>
               <Button primary style={{flex:1}} onClick={confirmClose}>CONFIRMAR Y CERRAR</Button>
               <Button onClick={printReport}>Imprimir</Button>
               <Button onClick={()=>setViewingReport(false)}>Volver</Button>
             </div>
           </div>
        ) : (
           <div>
             <TotalsRow $bold style={{background:'#eef', padding:10}}><span>Esperado en Caja:</span><span>C${efectivoEsperado.toFixed(2)}</span></TotalsRow>
             <div style={{margin:'20px 0'}}><label>¿Cuánto efectivo hay físico?</label><SearchInput type="number" value={montoContado} onChange={e=>setMontoContado(e.target.value)} placeholder="0.00" autoFocus /></div>
             <Button primary style={{width:'100%', padding:12}} onClick={()=>setViewingReport(true)}>Siguiente</Button>
           </div>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default CajaModal;
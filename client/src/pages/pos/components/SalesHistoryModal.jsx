// client/src/pages/POS/components/SalesHistoryModal.jsx
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

/* ───────────────────────── Helpers ───────────────────────── */
const todayLocal = () => {
  // Crea una fecha. new Date() ya usa la zona horaria del sistema.
  const now = new Date();

  // Formatea esa fecha al formato YYYY-MM-DD usando la zona horaria de Nicaragua.
  // Esto es más explícito y seguro que los cálculos manuales.
  const year = now.toLocaleString('en-US', { year: 'numeric', timeZone: 'America/Managua' });
  const month = now.toLocaleString('en-US', { month: '2-digit', timeZone: 'America/Managua' });
  const day = now.toLocaleString('en-US', { day: '2-digit', timeZone: 'America/Managua' });

  return `${year}-${month}-${day}`;
};

const money = (n) =>
  new Intl.NumberFormat('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    .format(Number(n || 0));

const getPaymentTypeLabel = (pagoDetalles) => {
  if (!pagoDetalles) return { label: 'N/A', icon: null };
  const { efectivo, tarjeta, transferencia, credito } = pagoDetalles;
  if (Number(credito) > 0) {
    return { label: 'Crédito', icon: <FaRegCreditCard style={{ color: '#dc3545' }} /> };
  }
  const methods = [];
  if (Number(efectivo) > 0) methods.push('Efectivo');
  if (Number(tarjeta) > 0) methods.push('Tarjeta');
  if (Number(transferencia) > 0) methods.push('Transferencia');

  if (methods.length === 1) {
    const m = methods[0];
    if (m === 'Efectivo') return { label: 'Efectivo', icon: <FaMoneyBillWave style={{ color: '#28a745' }} /> };
    if (m === 'Tarjeta') return { label: 'Tarjeta', icon: <FaRegCreditCard style={{ color: '#007bff' }} /> };
    return { label: 'Transferencia', icon: <FaExchangeAlt style={{ color: '#007bff' }} /> };
  }
  if (methods.length > 1) return { label: 'Mixto', icon: <FaMoneyBillWave style={{ color: '#ffc107' }} /> };
  return { label: 'Contado', icon: <FaMoneyBillWave style={{ color: '#28a745' }} /> };
};

const safeItemName = (it, idx = 0) =>
  it?.nombre ?? it?.name ?? it?.producto ?? it?.descripcion ?? `Item ${idx + 1}`;

/* ───────────────────────── Styled ───────────────────────── */
const ModalContent = styled(OriginalModalContent)`
  width: 95%;
  max-width: 1400px;
  height: 90vh;
  display: flex;
  flex-direction: column;
  padding: 1.25rem;

  @media (max-width: 768px) {
    height: 95vh;
    padding: 1rem;
  }
`;

const Header = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid #dee2e6;
  h2 { display: flex; align-items: center; gap: .5rem; margin: 0; }
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(180px, 1fr));
  gap: .75rem 1rem; margin-bottom: 1rem;

  @media (max-width: 1100px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 520px) { grid-template-columns: 1fr; }

  label { display: block; font-size: .9rem; color: #6c757d; margin-bottom: .25rem; }
`;

const Main = styled.div`
  display: grid; grid-template-columns: 380px 1fr; gap: 1rem; flex: 1; min-height: 0;
  @media (max-width: 1024px) { grid-template-columns: 1fr; }
`;

const LeftPanel = styled.div`
  background: #f8f9fa; border-radius: 12px; padding: .75rem; display: flex;
  flex-direction: column; min-height: 0;
`;

const RightPanel = styled.div`
  background: #fff; border-radius: 12px; padding: 1rem; min-height: 0;
  box-shadow: 0 2px 10px rgba(0,0,0,.06);
`;

const TopRow = styled.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: .5rem;
  small { color: #6c757d; }
`;

const List = styled.div`
  flex: 1; overflow: auto; padding-right: 4px; min-height: 200px;
`;

const Pagination = styled.div`
  display: flex; justify-content: center; align-items: center; gap: .75rem;
  padding-top: .5rem; border-top: 1px solid #e9ecef;
`;

const Row = styled.div`
  padding: .7rem .8rem; border-left: 5px solid ${p => p.$borderColor || '#6c757d'};
  border-radius: 8px; background: ${p => p.selected ? '#e9f2ff' : '#fff'};
  box-shadow: 0 1px 3px rgba(0,0,0,.05);
  margin-bottom: .6rem; cursor: pointer; transition: box-shadow .15s, background .15s;

  &:hover { box-shadow: 0 2px 6px rgba(0,0,0,.1); }

  .top {
    display: flex; justify-content: space-between; gap: .75rem; font-weight: 700; font-size: .95rem;
    word-break: break-word;
  }
  .sub { color: #6c757d; font-size: .82rem; margin-top: 2px; }
`;

const Pill = styled.span`
  display: inline-flex; align-items: center; justify-content: center;
  border-radius: 9999px; padding: .25rem .6rem; font-weight: 700; font-size: .8rem;
  ${p => p.$green && css`background:#e8f7ee; color:#198754;`}
  ${p => p.$red && css`background:#fdecec; color:#dc3545;`}
`;

/* ───────────────────────── Ítem de lista ───────────────────────── */
const SaleListItem = React.memo(function SaleListItem({
  sale, isSelected, onSelect, safeUsers, safeClients
}) {
  const statusColors = {
    COMPLETADA: '#28a745',
    CANCELADA: '#dc3545',
    DEVOLUCION: '#ffc107',
    ABONO_CREDITO: '#17a2b8',
  };

  const userName = useMemo(
    () => safeUsers.find(u => (u.id_usuario ?? u.id) == sale.userId)?.nombre_usuario ?? 'N/A',
    [safeUsers, sale.userId]
  );
  const clientName = useMemo(
    () => safeClients.find(c => c.id_cliente === (sale.clientId || sale.idCliente))?.nombre || 'Consumidor Final',
    [safeClients, sale.clientId, sale.idCliente]
  );

  // total normalizado y absoluto
  const totalRaw = Number(sale.totalVenta ?? sale.total_venta ?? sale.total ?? 0);
  const pay = getPaymentTypeLabel(sale.pagoDetalles);

  const leftLabel = sale.estado === 'ABONO_CREDITO'
    ? <><FaHandHoldingUsd style={{ marginRight: 6 }} /> ABONO</>
    : <>#{sale.id} - {sale.estado.replace('_', ' ')}</>;

  return (
    <Row
      onClick={() => onSelect(sale)}
      selected={isSelected}
      $borderColor={statusColors[sale.estado] || '#6c757d'}
      title={`Venta #${sale.id}`}
    >
      <div className="top">
        <span>{leftLabel}</span>
        <span>{pay.icon} C${money(Math.abs(totalRaw))}</span>
      </div>
      <div className="sub">
        {new Date(sale.fecha).toLocaleString('es-NI')} · Cliente: <strong>{clientName}</strong> · Vendedor: {userName}
      </div>
    </Row>
  );
});

/* ───────────────────────── Principal ───────────────────────── */
const ITEMS_PER_PAGE = 10;

function SalesHistoryModal({
  dailySales = [],
  loadSales,
  onClose,
  isAdmin,
  users = [],
  clients = [],
  onReprintTicket,
  onCancelSale,
  onReturnItem,   // firma: (selectedSale, item, qty)
  onAbonoSuccess,
}) {
  const [currentApiDate, setCurrentApiDate] = useState(todayLocal());
  const [filterDate, setFilterDate] = useState(todayLocal());
  const [salesData, setSalesData] = useState(Array.isArray(dailySales) ? dailySales : []);
  const [loadingSales, setLoadingSales] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const safeUsers = useMemo(() => (Array.isArray(users) ? users : []), [users]);
  const safeClients = useMemo(() => (Array.isArray(clients) ? clients : []), [clients]);

  const [selectedSale, setSelectedSale] = useState(null);
  const [showAbonoModal, setShowAbonoModal] = useState(false);

  // Alert/Confirm/Prompt
  const [alertState, setAlertState] = useState({ open: false, title: '', message: '' });
  const openAlert = (title, message) => setAlertState({ open: true, title, message });
  const closeAlert = () => setAlertState({ open: false, title: '', message: '' });

  const [confirmState, setConfirmState] = useState({ open: false, title: '', message: '', onConfirm: null });
  const openConfirm = (title, message, onConfirm) => setConfirmState({ open: true, title, message, onConfirm });
  const closeConfirm = () => setConfirmState({ open: false, title: '', message: '', onConfirm: null });

  const [promptState, setPromptState] = useState({ open: false, title: '', message: '', initialValue: '1', onConfirm: null });
  const openPrompt = (title, message, initialValue, onConfirm) =>
    setPromptState({ open: true, title, message, initialValue: String(initialValue ?? '1'), onConfirm });
  const closePrompt = () => setPromptState({ open: false, title: '', message: '', initialValue: '1', onConfirm: null });

  // Cargar ventas (por fecha o historial completo si hay búsqueda)
  const fetchSalesByDate = useCallback(async (date = null) => {
    if (!loadSales) return [];
    setLoadingSales(true);
    setCurrentApiDate(date);
    try {
      const data = await loadSales(date);
      const salesArray = Array.isArray(data) ? data : [];
      setSalesData(salesArray);
      return salesArray;
    } catch (error) {
      setSalesData([]);
      openAlert('Error', 'No se pudieron cargar las transacciones: ' + (error.message || 'Error de conexión.'));
      return [];
    } finally {
      setLoadingSales(false);
    }
  }, [loadSales]);

  useEffect(() => {
    const loadAllHistory = searchTerm && searchTerm.length >= 2;
    const dateToLoad = loadAllHistory ? null : filterDate;
    fetchSalesByDate(dateToLoad);
    setCurrentPage(1);
    setSelectedSale(null);
  }, [filterDate, fetchSalesByDate, searchTerm]);

  // Sincroniza HOY con dailySales si no hay búsqueda
  useEffect(() => {
    if (filterDate === todayLocal() && Array.isArray(dailySales) && !searchTerm) {
      setSalesData(dailySales);
    }
  }, [dailySales, filterDate, searchTerm]);

  // Filtros
  const filteredSales = useMemo(() => {
    const q = (searchTerm || '').toLowerCase();
    const out = (salesData || []).filter(s => {
      const clientId = s.clientId || s.idCliente;
      const clientName = safeClients.find(c => c.id_cliente === clientId)?.nombre || '';
      return (
        (!filterUser || String(s.userId) === String(filterUser)) &&
        (!filterStatus || s.estado === filterStatus) &&
        (!q || String(s.id).includes(q) || clientName.toLowerCase().includes(q))
      );
    });
    return out.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }, [salesData, filterUser, filterStatus, searchTerm, safeClients]);

  // Paginación
  const totalPages = Math.max(1, Math.ceil(filteredSales.length / ITEMS_PER_PAGE));
  const pageStart = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = filteredSales.slice(pageStart, pageStart + ITEMS_PER_PAGE);

  useEffect(() => {
    if (!selectedSale || !pageItems.some(item => item.id === selectedSale.id)) {
      setSelectedSale(pageItems[0] || null);
    }
  }, [pageItems, selectedSale]);

  const afterMutationRefresh = useCallback(async (keepSaleId = null) => {
    const updatedSalesData = await fetchSalesByDate(currentApiDate);
    if (keepSaleId) {
      const updated = (updatedSalesData || []).find(v => String(v.id) === String(keepSaleId));
      setSelectedSale(updated || null);
    } else {
      setSelectedSale(null);
    }
  }, [fetchSalesByDate, currentApiDate]);

  /* ========== Acciones ========== */

  // Cancelar
  const handleCancel = useCallback((saleIdParam) => {
    const saleId = saleIdParam || selectedSale?.id;
    if (!saleId || !selectedSale) return;

    if (selectedSale.estado === 'CANCELADA') {
      openAlert('Venta ya cancelada', `La venta #${saleId} ya fue cancelada.`);
      return;
    }
    if (!onCancelSale) {
      openAlert('Error de Configuración', 'onCancelSale no fue proporcionada.');
      return;
    }

    openConfirm(
      'Cancelar Venta',
      `¿Seguro que deseas cancelar la venta #${saleId}? Esta acción revierte inventario y no se puede deshacer.`,
      async () => {
        closeConfirm();
        try {
          await onCancelSale(saleId);
          openAlert('Éxito', `Venta #${saleId} cancelada.`);
          await afterMutationRefresh(null);
        } catch (error) {
          openAlert('Error al Cancelar', error.message || 'No se pudo cancelar la venta.');
        }
      }
    );
  }, [selectedSale, onCancelSale, afterMutationRefresh]);

  // Devolver (usa la firma: onReturnItem(selectedSale, item, qty))
  const handleReturn = useCallback((item, index = 0) => {
    if (!selectedSale) return;
    if (!onReturnItem) {
      openAlert('Error de Configuración', 'onReturnItem no fue proporcionada.');
      return;
    }

    const maxQty = Number(item?.quantity || item?.cantidad || 0);
    if (!Number.isFinite(maxQty) || maxQty <= 0) {
      openAlert('No se puede devolver', 'Este artículo no tiene cantidad disponible para devolver.');
      return;
    }

    openPrompt(
      'Devolver producto',
      `Cantidad a devolver para "${safeItemName(item, index)}" (máx. ${maxQty})`,
      '1',
      async (qtyStr) => {
        const qty = Number(qtyStr);
        if (!Number.isFinite(qty) || qty <= 0 || qty > maxQty) {
          openAlert('Cantidad inválida', `Ingresa un número entre 1 y ${maxQty}.`);
          return;
        }
        try {
          await onReturnItem(selectedSale, item, qty);
          openAlert('Éxito', `Se devolvieron ${qty} unidad(es) de ${safeItemName(item, index)}.`);
          await afterMutationRefresh(selectedSale.id);
        } catch (error) {
          const msg = (error?.message || '').toLowerCase();
          const cleaned =
            msg.includes('not found') || msg.includes('404')
              ? 'Ruta de API no encontrada. Verifica POST /api/sales/returns.'
              : (error.message || 'No se pudo devolver el producto.');
          openAlert('Error al Devolver', cleaned);
        } finally {
          closePrompt();
        }
      }
    );
  }, [selectedSale, onReturnItem, afterMutationRefresh]);

  // Reimprimir (tu lógica)
  const handleReprint = useCallback(() => {
    if (!selectedSale) return;
    onReprintTicket?.(selectedSale);
  }, [selectedSale, onReprintTicket]);

  /* ──────────────── Render ──────────────── */
  const statusCount = filteredSales.length;
  const showingCount = pageItems.length;

  return (
    <ModalOverlay data-history-modal>
      <ModalContent>
        <Header>
          <h2><FaHistory /> Historial de Transacciones</h2>
          <OriginalButton $cancel onClick={onClose}><FaWindowClose /></OriginalButton>
        </Header>

        <FilterGrid>
          <div>
            <label><FaSearch /> Buscar ID/Cliente:</label>
            <SearchInput
              type="text"
              placeholder="ID o nombre"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label><FaRegClock /> Fecha:</label>
            <SearchInput
              type="date"
              value={filterDate}
              onChange={e => setFilterDate(e.target.value)}
            />
          </div>
          {isAdmin && (
            <div>
              <label><FaUsers /> Usuario:</label>
              <SearchInput
                as="select"
                value={filterUser}
                onChange={e => setFilterUser(e.target.value)}
              >
                <option value="">Todos</option>
                {safeUsers.map(u => (
                  <option key={u.id_usuario ?? u.id} value={u.id_usuario ?? u.id}>
                    {u.nombre_usuario ?? u.nombre}
                  </option>
                ))}
              </SearchInput>
            </div>
          )}
          <div>
            <label><FaFilter /> Estado:</label>
            <SearchInput
              as="select"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="COMPLETADA">Completadas</option>
              <option value="CANCELADA">Canceladas</option>
              <option value="DEVOLUCION">Devoluciones</option>
              <option value="ABONO_CREDITO">Abonos</option>
            </SearchInput>
          </div>
        </FilterGrid>

        <Main>
          <LeftPanel>
            <TopRow>
              <small>
                {searchTerm ? <strong>Mostrando historial de búsqueda</strong> : `Resultados: ${statusCount}`}
              </small>
              <Pill $green>Mostrando {showingCount}</Pill>
            </TopRow>

            {loadingSales && (
              <InfoBox style={{ textAlign: 'center', margin: '.5rem 0' }}>
                Cargando transacciones…
              </InfoBox>
            )}

            {!loadingSales && (
              <List>
                {pageItems.length ? (
                  pageItems.map(sale => (
                    <SaleListItem
                      key={sale.id}
                      sale={sale}
                      isSelected={selectedSale?.id === sale.id}
                      onSelect={setSelectedSale}
                      safeUsers={safeUsers}
                      safeClients={safeClients}
                    />
                  ))
                ) : (
                  <p style={{ textAlign: 'center', color: '#6c757d', marginTop: '1rem' }}>
                    No se encontraron transacciones para la fecha y filtros seleccionados.
                  </p>
                )}
              </List>
            )}

            {totalPages > 1 && (
              <Pagination>
                <OriginalButton
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  title="Anterior"
                >
                  <FaAngleLeft />
                </OriginalButton>
                <span>Página {currentPage} de {totalPages}</span>
                <OriginalButton
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  title="Siguiente"
                >
                  <FaAngleRight />
                </OriginalButton>
              </Pagination>
            )}
          </LeftPanel>

          {selectedSale ? (
            selectedSale.estado === 'ABONO_CREDITO' ? (
              <RightPanel>
                <h3 style={{ marginTop: 0 }}>Detalle de Abono</h3>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '.75rem',
                  }}
                >
                  <div />
                  <OriginalButton onClick={handleReprint}>Imprimir Recibo</OriginalButton>
                </div>
              </RightPanel>
            ) : selectedSale.estado === 'DEVOLUCION' ? (
              <RightPanel>
                <h3 style={{ marginTop: 0 }}>
                  Detalle de Transacción #{selectedSale.id}
                </h3>

                <div className="box" style={{ marginTop: 10 }}>
                  <p>
                    <strong>Cliente:</strong>{' '}
                    {safeClients.find(
                      (c) =>
                        c.id_cliente ===
                        (selectedSale.clientId || selectedSale.idCliente)
                    )?.nombre || 'Consumidor Final'}
                  </p>
                  <p>
                    <strong>Fecha:</strong>{' '}
                    {new Date(selectedSale.fecha).toLocaleString('es-NI')}
                  </p>
                  <p>
                    <strong>Estado:</strong>{' '}
                    <span
                      style={{
                        background: '#fff3cd',
                        color: '#856404',
                        padding: '2px 8px',
                        borderRadius: 8,
                        fontWeight: 700,
                      }}
                    >
                      DEVOLUCIÓN
                    </span>
                  </p>
                </div>

                <div className="box" style={{ marginTop: 10 }}>
                  <h4 style={{ marginTop: 0 }}>Detalle de Devolución</h4>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {(selectedSale.items || []).map((it, i) => (
                      <li key={`${it.id || it.id_producto}-${i}`}>
                        <strong>
                          {safeItemName(it, i)}
                        </strong>{' '}
                        — {Number(it.quantity || it.cantidad || 0)} u. @ C$
                        {Number(it.precio || it.precio_unitario || 0).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                  <p style={{ marginTop: 8 }}>
                    Importe devuelto:{' '}
                    <strong>
                      C$
                      {(() => {
                        const totalNorm = Number(
                          (selectedSale.totalVenta ?? selectedSale.total_venta ?? selectedSale.total ?? 0)
                        );
                        return Math.abs(totalNorm).toFixed(2);
                      })()}
                    </strong>
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    gap: 10,
                    marginTop: 12,
                  }}
                >
                  <OriginalButton onClick={handleReprint}>
                    Reimprimir Ticket
                  </OriginalButton>
                </div>
              </RightPanel>
            ) : (
              <SaleDetailView
                sale={selectedSale}
                client={safeClients.find(
                  (c) =>
                    c.id_cliente ===
                    (selectedSale.clientId || selectedSale.idCliente)
                )}
                creditStatus={null}
                dailySales={salesData}
                isAdmin={isAdmin}
                onOpenAbonoModal={() => setShowAbonoModal(true)}
                onCancelSale={(saleId) => handleCancel(saleId)}
                onReturnItem={(item, index) => handleReturn(item, index)}
                onReprintTicket={handleReprint}
                showConfirmation={({ onConfirm }) =>
                  openConfirm('Confirmación', '¿Confirmar acción?', onConfirm)
                }
                showPrompt={({ title, message, defaultValue, onConfirm }) =>
                  openPrompt(title, message, defaultValue, onConfirm)
                }
                showAlert={({ title, message }) => openAlert(title, message)}
              />
            )
          ) : (
            <RightPanel />
          )}
        </Main>

        {showAbonoModal && selectedSale && (
          <AbonoCreditoModal
            client={safeClients.find(c => c.id_cliente === (selectedSale.clientId || selectedSale.idCliente))}
            onClose={() => setShowAbonoModal(false)}
            onAbonoSuccess={async () => {
              setShowAbonoModal(false);
              await afterMutationRefresh(selectedSale.id);
              onAbonoSuccess?.();
            }}
            showAlert={({ title, message }) => openAlert(title, message)}
          />
        )}
      </ModalContent>

      {/* Modales locales */}
      <AlertModal
        isOpen={alertState.open}
        onClose={closeAlert}
        title={alertState.title}
        message={alertState.message}
      />
      <LocalConfirm
        isOpen={!!confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        onCancel={closeConfirm}
        onConfirm={confirmState.onConfirm || closeConfirm}
      />
      <LocalPrompt
        isOpen={!!promptState.open}
        title={promptState.title}
        message={promptState.message}
        initialValue={promptState.initialValue}
        onCancel={closePrompt}
        onConfirm={(v) => { const fn = promptState.onConfirm; closePrompt(); fn && fn(v); }}
      />
    </ModalOverlay>
  );
}

/* ───────────────────────── Modales locales ───────────────────────── */
const LocalModal = ({ isOpen, children, maxWidth = 450 }) => {
  if (!isOpen) return null;
  return (
    <ModalOverlay style={{ zIndex: 99999, backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <OriginalModalContent style={{ maxWidth: `${maxWidth}px`, textAlign: 'center' }}>
        {children}
      </OriginalModalContent>
    </ModalOverlay>
  );
};

const LocalConfirm = ({ isOpen, title, message, onCancel, onConfirm }) => (
  <LocalModal isOpen={isOpen}>
    <h2 style={{ marginTop: 0 }}>{title}</h2>
    <p style={{ color: '#6c757d', lineHeight: 1.5 }}>{message}</p>
    <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 10 }}>
      <Button onClick={onCancel} $cancel>Cancelar</Button>
      <Button onClick={onConfirm} primary>Aceptar</Button>
    </div>
  </LocalModal>
);

const LocalPrompt = ({ isOpen, title, message, initialValue = '1', inputType = 'number', onCancel, onConfirm }) => {
  const [val, setVal] = useState(initialValue);
  useEffect(() => { setVal(initialValue); }, [initialValue, isOpen]);
  return (
    <LocalModal isOpen={isOpen}>
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      {message && <p style={{ color: '#6c757d' }}>{message}</p>}
      <input
        style={{ width: '100%', padding: '.6rem', borderRadius: 8, border: '1px solid #dee2e6', margin: '8px 0 14px' }}
        type={inputType}
        value={val}
        onChange={e => setVal(e.target.value)}
      />
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
        <Button onClick={onCancel} $cancel>Cancelar</Button>
        <Button onClick={() => onConfirm(val)} primary>Aceptar</Button>
      </div>
    </LocalModal>
  );
};

export default React.memo(SalesHistoryModal);

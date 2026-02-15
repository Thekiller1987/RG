// client/src/pages/DetailedSalesReport.jsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import {
    FaArrowLeft, FaSyncAlt, FaCalendarAlt, FaSearch,
    FaShoppingCart, FaUndoAlt, FaBarcode, FaFileInvoice,
    FaUser, FaClock, FaChevronDown, FaChevronUp
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

/* ================== CONFIG ================== */
const API_URL = '/api';

/* ================== HELPERS ================== */
function todayManagua() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const fmtMoney = (n) => `C$${Number(n || 0).toFixed(2)}`;

const fmtDT = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('es-NI', {
        timeZone: 'America/Managua',
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
    });
};

const fmtDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('es-NI', {
        timeZone: 'America/Managua',
        day: '2-digit', month: '2-digit', year: 'numeric'
    });
};

function useAuthToken() {
    const [token] = useState(() => localStorage.getItem('token') || null);
    return token;
}

/* ================== THEME ================== */
const theme = {
    primary: '#0f172a',
    secondary: '#475569',
    success: '#16a34a',
    danger: '#dc2626',
    warning: '#d97706',
    info: '#0284c7',
    bg: '#f8fafc',
    surface: '#ffffff',
    border: '#e2e8f0',
    text: '#1e293b',
    textLight: '#64748b'
};

/* ================== ANIMATIONS ================== */
const fadeIn = keyframes`from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); }`;

/* ================== STYLED COMPONENTS ================== */
const Container = styled.div`
  max-width: 1500px;
  margin: 0 auto;
  padding: 2rem;
  background: ${theme.bg};
  min-height: 100vh;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: ${theme.text};
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  background: white;
  padding: 1.25rem 2rem;
  border-radius: 12px;
  border: 1px solid ${theme.border};
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  flex-wrap: wrap;
  gap: 1rem;
`;

const BackButton = styled.button`
  background: white;
  border: 1px solid ${theme.border};
  width: 40px; height: 40px;
  border-radius: 8px;
  display: grid; place-items: center;
  cursor: pointer;
  color: ${theme.text};
  transition: all 0.2s;
  &:hover { background: ${theme.bg}; color: ${theme.primary}; }
`;

const TabBar = styled.div`
  display: flex;
  gap: 0;
  background: white;
  border-radius: 12px;
  border: 1px solid ${theme.border};
  overflow: hidden;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
`;

const Tab = styled.button`
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  background: ${props => props.active ? theme.primary : 'white'};
  color: ${props => props.active ? 'white' : theme.secondary};
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  border-right: 1px solid ${theme.border};
  &:last-child { border-right: none; }
  &:hover {
    background: ${props => props.active ? theme.primary : '#f1f5f9'};
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;

  input[type="date"], input[type="text"] {
    padding: 10px 14px;
    border: 1px solid ${theme.border};
    border-radius: 8px;
    font-family: inherit;
    font-size: 0.9rem;
    color: ${theme.text};
    background: white;
    outline: none;
    transition: border-color 0.2s;
    &:focus { border-color: ${theme.primary}; }
  }

  select {
    padding: 10px 14px;
    border: 1px solid ${theme.border};
    border-radius: 8px;
    font-family: inherit;
    font-size: 0.9rem;
    color: ${theme.text};
    background: white;
    outline: none;
    cursor: pointer;
  }
`;

const ActionBtn = styled.button`
  padding: 10px 18px;
  border: 1px solid ${theme.border};
  border-radius: 8px;
  background: ${props => props.variant === 'primary' ? theme.primary : 'white'};
  color: ${props => props.variant === 'primary' ? 'white' : theme.secondary};
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
  &:hover {
    background: ${props => props.variant === 'primary' ? '#1e293b' : theme.bg};
    transform: translateY(-1px);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${theme.border};
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  animation: ${fadeIn} 0.3s ease;

  thead {
    background: #f1f5f9;
    th {
      padding: 12px 16px;
      text-align: left;
      font-weight: 600;
      font-size: 0.8rem;
      color: ${theme.secondary};
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 2px solid ${theme.border};
      white-space: nowrap;
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid #f1f5f9;
      transition: background 0.15s;
      &:hover { background: #fafbfc; }
      &:last-child { border-bottom: none; }
    }
    td {
      padding: 10px 16px;
      font-size: 0.9rem;
      color: ${theme.text};
      vertical-align: top;
    }
  }

  .num { text-align: right; font-family: 'Roboto Mono', monospace; }
  .center { text-align: center; }
`;

const Badge = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  white-space: nowrap;
  ${props => {
        switch (props.type) {
            case 'COMPLETADA': return `background: #dcfce7; color: #166534;`;
            case 'DEVOLUCION': return `background: #fee2e2; color: #991b1b;`;
            case 'CANCELADA': return `background: #fef3c7; color: #92400e;`;
            default: return `background: #f1f5f9; color: #475569;`;
        }
    }}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: ${theme.textLight};
  background: white;
  border-radius: 12px;
  border: 1px solid ${theme.border};
  animation: ${fadeIn} 0.3s ease;
  p { margin: 0.5rem 0; }
  svg { font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.4; }
`;

const SummaryCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
  animation: ${fadeIn} 0.3s ease;
`;

const SummaryCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid ${theme.border};
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  
  .label {
    font-size: 0.8rem;
    color: ${theme.textLight};
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.03em;
    margin-bottom: 0.4rem;
  }
  .value {
    font-size: 1.4rem;
    font-weight: 700;
    color: ${props => props.color || theme.primary};
    font-family: 'Roboto Mono', monospace;
  }
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid ${theme.border};
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  margin-bottom: 1.5rem;
  animation: ${fadeIn} 0.3s ease;
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.82rem;
  color: ${theme.secondary};
  
  .item-row {
    display: flex;
    justify-content: space-between;
    padding: 2px 0;
    &:hover { color: ${theme.text}; }
  }
  .item-name { flex: 1; }
  .item-qty { width: 40px; text-align: center; color: ${theme.textLight}; }
  .item-price { width: 90px; text-align: right; font-family: 'Roboto Mono', monospace; }
`;

const ExpandBtn = styled.button`
  all: unset;
  cursor: pointer;
  color: ${theme.info};
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  &:hover { text-decoration: underline; }
`;

const LoadingOverlay = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${theme.textLight};
  font-size: 1rem;
`;

/* ================== COMPONENT ================== */
const DetailedSalesReport = () => {
    const token = useAuthToken();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('ventas'); // 'ventas' | 'devoluciones' | 'producto'
    const [startDate, setStartDate] = useState(todayManagua());
    const [endDate, setEndDate] = useState(todayManagua());
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(false);

    // Product search
    const [productCode, setProductCode] = useState('');
    const [productResult, setProductResult] = useState(null);
    const [productLoading, setProductLoading] = useState(false);

    // Expanded rows
    const [expandedRows, setExpandedRows] = useState({});

    const authHeader = useMemo(() => {
        const h = { 'Content-Type': 'application/json' };
        if (token) h.Authorization = `Bearer ${token}`;
        return h;
    }, [token]);

    const fetchSales = useCallback(async (tipo) => {
        setLoading(true);
        try {
            const params = { startDate, endDate };
            if (tipo) params.tipo = tipo;
            const res = await axios.get(`${API_URL}/reports/detailed-sales`, { headers: authHeader, params });
            setSales(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Error fetching detailed sales:', err);
            setSales([]);
        } finally {
            setLoading(false);
        }
    }, [authHeader, startDate, endDate]);

    const fetchProductHistory = useCallback(async () => {
        if (!productCode.trim()) return;
        setProductLoading(true);
        try {
            const res = await axios.get(`${API_URL}/reports/product-history`, {
                headers: authHeader,
                params: { code: productCode.trim() }
            });
            setProductResult(res.data);
        } catch (err) {
            console.error('Error fetching product history:', err);
            setProductResult({ product: null, history: [] });
        } finally {
            setProductLoading(false);
        }
    }, [authHeader, productCode]);

    // Auto-fetch on tab change or date change
    useEffect(() => {
        if (activeTab === 'ventas') fetchSales();
        else if (activeTab === 'devoluciones') fetchSales('DEVOLUCION');
    }, [activeTab, startDate, endDate, fetchSales]);

    const toggleExpand = (id) => {
        setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Stats
    const totalVentas = sales.reduce((s, v) => s + Number(v.totalVenta || 0), 0);
    const totalTransacciones = sales.length;

    const getPaymentMethod = (pd) => {
        if (!pd) return '—';
        const parts = [];
        if (pd.efectivo > 0) parts.push(`Efectivo: ${fmtMoney(pd.efectivo)}`);
        if (pd.tarjeta > 0) parts.push(`Tarjeta: ${fmtMoney(pd.tarjeta)}`);
        if (pd.transferencia > 0) parts.push(`Transf: ${fmtMoney(pd.transferencia)}`);
        if (pd.credito > 0) parts.push(`Crédito: ${fmtMoney(pd.credito)}`);
        if (pd.dolares > 0) parts.push(`USD: $${Number(pd.dolares).toFixed(2)}`);
        return parts.length ? parts.join(' | ') : 'Efectivo';
    };

    return (
        <Container>
            <Header>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <BackButton onClick={() => navigate('/dashboard')}>
                        <FaArrowLeft />
                    </BackButton>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: theme.primary }}>
                            Reportes de Ventas Detallado
                        </h1>
                        <p style={{ margin: '2px 0 0', color: theme.textLight, fontSize: '0.9rem' }}>
                            Ventas, devoluciones y seguimiento por producto
                        </p>
                    </div>
                </div>
                {loading && <span style={{ color: theme.textLight }}><FaSyncAlt className="icon-spin" /> Cargando...</span>}
            </Header>

            {/* TABS */}
            <TabBar>
                <Tab active={activeTab === 'ventas'} onClick={() => setActiveTab('ventas')}>
                    <FaShoppingCart /> Ventas Detalladas
                </Tab>
                <Tab active={activeTab === 'devoluciones'} onClick={() => setActiveTab('devoluciones')}>
                    <FaUndoAlt /> Devoluciones
                </Tab>
                <Tab active={activeTab === 'producto'} onClick={() => setActiveTab('producto')}>
                    <FaBarcode /> Buscar por Producto
                </Tab>
            </TabBar>

            {/* ───── TAB: VENTAS / DEVOLUCIONES ───── */}
            {(activeTab === 'ventas' || activeTab === 'devoluciones') && (
                <>
                    <FilterBar>
                        <FaCalendarAlt style={{ color: theme.primary }} />
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                        <span style={{ color: theme.textLight }}>a</span>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                        <ActionBtn variant="primary" onClick={() => activeTab === 'ventas' ? fetchSales() : fetchSales('DEVOLUCION')}>
                            <FaSyncAlt /> Buscar
                        </ActionBtn>
                    </FilterBar>

                    {/* Summary Cards */}
                    <SummaryCards>
                        <SummaryCard color={theme.primary}>
                            <div className="label">Total {activeTab === 'devoluciones' ? 'Devoluciones' : 'Ventas'}</div>
                            <div className="value">{fmtMoney(totalVentas)}</div>
                        </SummaryCard>
                        <SummaryCard color={theme.info}>
                            <div className="label">Transacciones</div>
                            <div className="value">{totalTransacciones}</div>
                        </SummaryCard>
                        <SummaryCard color={theme.success}>
                            <div className="label">Promedio por Venta</div>
                            <div className="value">{fmtMoney(totalTransacciones > 0 ? totalVentas / totalTransacciones : 0)}</div>
                        </SummaryCard>
                    </SummaryCards>

                    {loading ? (
                        <LoadingOverlay><FaSyncAlt /> Cargando datos...</LoadingOverlay>
                    ) : sales.length === 0 ? (
                        <EmptyState>
                            <FaFileInvoice />
                            <p>No se encontraron {activeTab === 'devoluciones' ? 'devoluciones' : 'ventas'} en este rango de fechas.</p>
                        </EmptyState>
                    ) : (
                        <Table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Fecha / Hora</th>
                                    <th>Estado</th>
                                    <th>Cliente</th>
                                    <th>Vendedor</th>
                                    <th>Productos</th>
                                    <th>Forma de Pago</th>
                                    <th className="num">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sales.map(sale => {
                                    const isExpanded = expandedRows[sale.id];
                                    const items = sale.items || [];
                                    const showItems = isExpanded ? items : items.slice(0, 2);
                                    return (
                                        <tr key={sale.id}>
                                            <td style={{ fontWeight: 600, color: theme.info }}>#{sale.id}</td>
                                            <td style={{ whiteSpace: 'nowrap', fontSize: '0.85rem' }}>{fmtDT(sale.fecha)}</td>
                                            <td><Badge type={sale.estado}>{sale.estado}</Badge></td>
                                            <td>
                                                {sale.clienteNombre ? (
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                        <FaUser style={{ color: theme.textLight, fontSize: '0.7rem' }} />
                                                        {sale.clienteNombre}
                                                    </span>
                                                ) : <span style={{ color: theme.textLight }}>Público General</span>}
                                            </td>
                                            <td style={{ fontSize: '0.85rem' }}>{sale.vendedorNombre || '—'}</td>
                                            <td>
                                                <ItemsList>
                                                    {showItems.map((item, i) => (
                                                        <div className="item-row" key={i}>
                                                            <span className="item-name">{item.nombre || '—'}</span>
                                                            <span className="item-qty">x{item.quantity}</span>
                                                            <span className="item-price">{fmtMoney(item.precio * item.quantity)}</span>
                                                        </div>
                                                    ))}
                                                    {items.length > 2 && (
                                                        <ExpandBtn onClick={() => toggleExpand(sale.id)}>
                                                            {isExpanded ? <><FaChevronUp /> Menos</> : <><FaChevronDown /> +{items.length - 2} más</>}
                                                        </ExpandBtn>
                                                    )}
                                                </ItemsList>
                                            </td>
                                            <td style={{ fontSize: '0.82rem', color: theme.secondary, maxWidth: 200 }}>
                                                {getPaymentMethod(sale.pagoDetalles)}
                                            </td>
                                            <td className="num" style={{ fontWeight: 700, fontSize: '1rem' }}>
                                                {fmtMoney(sale.totalVenta)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    )}
                </>
            )}

            {/* ───── TAB: BUSCAR POR PRODUCTO ───── */}
            {activeTab === 'producto' && (
                <>
                    <FilterBar>
                        <FaBarcode style={{ color: theme.primary }} />
                        <input
                            type="text"
                            placeholder="Ingresa código del producto..."
                            value={productCode}
                            onChange={e => setProductCode(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && fetchProductHistory()}
                            style={{ minWidth: 280 }}
                        />
                        <ActionBtn variant="primary" onClick={fetchProductHistory}>
                            <FaSearch /> Buscar
                        </ActionBtn>
                    </FilterBar>

                    {productLoading ? (
                        <LoadingOverlay><FaSyncAlt /> Buscando producto...</LoadingOverlay>
                    ) : productResult === null ? (
                        <EmptyState>
                            <FaBarcode />
                            <p>Ingresa un código de producto para ver su historial completo de ventas.</p>
                            <p style={{ fontSize: '0.85rem' }}>Verás exactamente cuándo, a quién y cuántas unidades se vendieron.</p>
                        </EmptyState>
                    ) : !productResult.product ? (
                        <EmptyState>
                            <FaSearch />
                            <p>No se encontró ningún producto con el código "{productCode}".</p>
                        </EmptyState>
                    ) : (
                        <>
                            {/* Product Info Card */}
                            <ProductCard>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div>
                                        <h2 style={{ margin: '0 0 4px', fontSize: '1.3rem', color: theme.primary }}>
                                            {productResult.product.nombre}
                                        </h2>
                                        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', color: theme.secondary, flexWrap: 'wrap' }}>
                                            <span><strong>Código:</strong> {productResult.product.codigo}</span>
                                            <span><strong>Precio:</strong> {fmtMoney(productResult.product.precio)}</span>
                                            <span><strong>Costo:</strong> {fmtMoney(productResult.product.costo)}</span>
                                            <span><strong>Stock Actual:</strong> {productResult.product.existencia} uds</span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.8rem', color: theme.textLight }}>Movimientos Encontrados</div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: theme.primary }}>
                                            {productResult.history.length}
                                        </div>
                                    </div>
                                </div>
                            </ProductCard>

                            {/* History Table */}
                            {productResult.history.length === 0 ? (
                                <EmptyState>
                                    <FaClock />
                                    <p>Este producto no tiene historial de ventas registrado.</p>
                                </EmptyState>
                            ) : (
                                <Table>
                                    <thead>
                                        <tr>
                                            <th># Factura</th>
                                            <th>Fecha / Hora</th>
                                            <th>Estado</th>
                                            <th>Tipo</th>
                                            <th>Cliente</th>
                                            <th>Vendedor</th>
                                            <th className="center">Cantidad</th>
                                            <th className="num">Precio Unit.</th>
                                            <th className="num">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productResult.history.map((h, i) => (
                                            <tr key={i}>
                                                <td style={{ fontWeight: 600, color: theme.info }}>#{h.idVenta}</td>
                                                <td style={{ whiteSpace: 'nowrap', fontSize: '0.85rem' }}>{fmtDT(h.fecha)}</td>
                                                <td><Badge type={h.estado}>{h.estado}</Badge></td>
                                                <td style={{ fontSize: '0.85rem' }}>{h.tipo_venta || '—'}</td>
                                                <td>
                                                    {h.clienteNombre ? (
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                            <FaUser style={{ color: theme.textLight, fontSize: '0.7rem' }} />
                                                            {h.clienteNombre}
                                                        </span>
                                                    ) : <span style={{ color: theme.textLight }}>Público General</span>}
                                                </td>
                                                <td style={{ fontSize: '0.85rem' }}>{h.vendedorNombre || '—'}</td>
                                                <td className="center" style={{ fontWeight: 600 }}>{h.cantidad}</td>
                                                <td className="num">{fmtMoney(h.precioUnitario)}</td>
                                                <td className="num" style={{ fontWeight: 700 }}>{fmtMoney(h.cantidad * h.precioUnitario)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </>
                    )}
                </>
            )}
        </Container>
    );
};

export default DetailedSalesReport;

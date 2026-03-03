/**
 * Centralized logic for cash register (Caja) statistics and totals.
 * Handles different transaction types, currency conversion, and hidden adjustments.
 * ★ BLINDADO: Cada campo es parseado con safe() para prevenir NaN/undefined/Infinity.
 */

// ★ SAFE: Helper antiNaN para parsear cualquier valor numérico
const safe = (v) => { const n = Number(v); return (isNaN(n) || !isFinite(n)) ? 0 : n; };

/**
 * Deduplicates transactions before calculation.
 * Handles both exact ID duplicates and fingerprint-based duplicates
 * (e.g., PEND-xxx optimistic entries that duplicate real server entries).
 */
function deduplicateTransactions(transactions) {
    if (!Array.isArray(transactions) || transactions.length === 0) return [];

    const seenIds = new Set();
    const fingerprints = new Set();
    const cleaned = [];

    for (const tx of transactions) {
        // 1. Skip exact ID duplicates
        if (tx.id && seenIds.has(tx.id)) continue;
        if (tx.id) seenIds.add(tx.id);

        // 2. Skip fingerprint duplicates (catches PEND-xxx vs real ID dupes)
        const pd = tx.pagoDetalles || {};
        const fp = `${(tx.type || '').toLowerCase()}|${safe(tx.amount).toFixed(2)}|${safe(pd.totalVenta).toFixed(2)}|${safe(pd.efectivo).toFixed(2)}|${safe(pd.tarjeta).toFixed(2)}|${safe(pd.credito).toFixed(2)}|${safe(pd.transferencia).toFixed(2)}`;

        if (fingerprints.has(fp)) continue;
        fingerprints.add(fp);

        cleaned.push(tx);
    }

    return cleaned;
}

export const calculateCajaStats = (transactions, initialAmount = 0, tasaDolar = 36.60) => {
    const cajaInicialN = Math.max(0, safe(initialAmount));
    const tasaRef = safe(tasaDolar) || 36.60;

    const cls = {
        ventasContado: [],
        devoluciones: [],
        cancelaciones: [],
        entradas: [],
        salidas: [],
        abonos: [],
        ajustes: []
    };

    let netCordobas = 0; // Physical Cash C$
    let netDolares = 0;  // Physical Cash $
    let tTarjeta = 0;
    let tTransf = 0;
    let tCredito = 0;

    let sumDevsCancels = 0;
    let tVentasDia = 0;
    let totalHidden = 0;

    // CRITICAL: Deduplicate BEFORE processing to prevent inflated totals
    const validTransactions = deduplicateTransactions(Array.isArray(transactions) ? transactions : []);

    for (const tx of validTransactions) {
        const t = (tx?.type || '').toLowerCase().trim();

        // Robust parsing of pagoDetalles
        let pd = tx?.pagoDetalles || {};
        if (typeof pd === 'string') {
            try { pd = JSON.parse(pd); } catch { pd = {}; }
        }
        if (!pd || typeof pd !== 'object') pd = {};

        // ── Fundamental Amounts (all safe-parsed) ──
        const txAmount = safe(tx.amount);
        const txTotalVenta = safe(pd.totalVenta) || txAmount;
        const txEfectivo = safe(pd.efectivo);
        const txDolares = safe(pd.dolares);
        const txCambio = safe(pd.cambio);
        const txIngresoCaja = safe(pd.ingresoCaja);
        const txTarjeta = safe(pd.tarjeta);
        const txTransf = safe(pd.transferencia);
        const txCredito = safe(pd.credito);

        // ── Revenue amount (for display/classification) ──
        let totalRevenue = txTotalVenta || txAmount;

        // Force negative sign for money-leaving transactions
        const isNegativeType = t === 'salida' || t.includes('devolucion') || t.includes('cancelacion') || t.includes('anulacion');
        if (isNegativeType) {
            totalRevenue = -Math.abs(totalRevenue);
        }

        const normalizedTx = { ...tx, pagoDetalles: pd, displayAmount: totalRevenue };

        // ══════════════════════════════════════════════════════
        // 1. ACCOUNTING TOTALS (Revenue Summary)
        // ══════════════════════════════════════════════════════
        if (t.startsWith('venta') || t.includes('abono') || t.includes('pedido') || t.includes('apartado')) {
            tTarjeta += txTarjeta;
            tTransf += txTransf;
            tCredito += txCredito;
        } else if (t === 'ajuste') {
            if (pd.target === 'tarjeta') tTarjeta += txAmount;
            if (pd.target === 'credito') tCredito += txAmount;
            if (pd.target === 'transferencia') tTransf += txAmount;
        }

        // ══════════════════════════════════════════════════════
        // 2. PHYSICAL CASH CALCULATIONS (blindado con 3 niveles de fallback)
        // ══════════════════════════════════════════════════════
        if (t.startsWith('venta')) {
            // ── TIER 1: Campos desglosados del PaymentModal ──
            if (txEfectivo > 0.001 || txDolares > 0.001 || txCambio > 0.001) {
                netCordobas += (txEfectivo - txCambio);
                netDolares += txDolares;
            }
            // ── TIER 2: ingresoCaja (ya calculado por PaymentModal, incluye dólares convertidos) ──
            else if (txIngresoCaja > 0.001) {
                netCordobas += txIngresoCaja;
                // NO sumar dólares aquí para evitar doble conteo
            }
            // ── TIER 3: Calcular residual (totalVenta - lo no-efectivo) ──
            else {
                const noEfectivoSum = txTarjeta + txTransf + txCredito;
                const residual = txTotalVenta - noEfectivoSum;
                if (residual > 0.001) {
                    netCordobas += residual;
                }
                // Si residual <= 0, fue todo tarjeta/transferencia/crédito → no cash
            }

        } else if (t.includes('abono')) {
            if (txDolares > 0.001) {
                netDolares += txDolares;
                netCordobas += txEfectivo;
            } else if (txEfectivo > 0.001) {
                netCordobas += txEfectivo;
            } else if (txIngresoCaja > 0.001) {
                netCordobas += txIngresoCaja;
            } else {
                const noEfectivo = txTarjeta + txTransf;
                netCordobas += Math.max(0, txAmount - noEfectivo);
            }

        } else if (t === 'entrada') {
            netCordobas += Math.abs(txAmount);

        } else if (t === 'salida') {
            netCordobas -= Math.abs(txAmount);

        } else if (t.includes('devolucion') || t.includes('cancelacion') || t.includes('anulacion')) {
            // Reversiones: sacar cash de la caja
            if (pd.ingresoCaja !== undefined && pd.ingresoCaja !== null) {
                netCordobas += safe(pd.ingresoCaja); // Será negativo para devoluciones
            } else if (txEfectivo > 0.001) {
                netCordobas -= txEfectivo;
            } else {
                const noEfectivo = txTarjeta + txTransf + txCredito;
                const cashPart = Math.abs(txAmount) - noEfectivo;
                if (cashPart > 0.001) {
                    netCordobas -= cashPart;
                }
            }

        } else if (t === 'ajuste') {
            if (pd.target === 'efectivo') {
                netCordobas += txAmount;
                if (pd.hidden) totalHidden += txAmount;
            } else if (pd.target === 'dolares') {
                netDolares += txAmount;
            }

        } else {
            // Fallback para cualquier otro tipo desconocido
            const noEfectivo = txTarjeta + txTransf + txCredito;
            const cashPart = txAmount - noEfectivo;
            if (Math.abs(cashPart) > 0.001) {
                netCordobas += cashPart;
            }
        }

        // ══════════════════════════════════════════════════════
        // 3. GLOBAL SALES TOTAL
        // ══════════════════════════════════════════════════════
        if (t.startsWith('venta') || t.includes('abono') || t === 'entrada') {
            tVentasDia += Math.abs(totalRevenue);
        } else if (t.includes('devolucion') || t.includes('cancelacion') || t.includes('anulacion')) {
            tVentasDia -= Math.abs(totalRevenue);
        }
        // ajustes NO afectan ventas totales (God Mode invisible)

        // ══════════════════════════════════════════════════════
        // 4. CLASSIFICATION for Lists
        // ══════════════════════════════════════════════════════
        if (t.startsWith('venta')) cls.ventasContado.push(normalizedTx);
        else if (t.includes('devolucion')) { cls.devoluciones.push(normalizedTx); sumDevsCancels += Math.abs(totalRevenue); }
        else if (t.includes('cancelacion') || t.includes('anulacion')) { cls.cancelaciones.push(normalizedTx); sumDevsCancels += Math.abs(totalRevenue); }
        else if (t === 'entrada') cls.entradas.push(normalizedTx);
        else if (t === 'salida') cls.salidas.push(normalizedTx);
        else if (t.includes('abono')) cls.abonos.push(normalizedTx);
        else if (t === 'ajuste') cls.ajustes.push(normalizedTx);
    }

    // ★ BLINDAJE FINAL: Clamp contra NaN en todos los totales
    netCordobas = safe(netCordobas);
    netDolares = safe(netDolares);
    tTarjeta = safe(tTarjeta);
    tTransf = safe(tTransf);
    tCredito = safe(tCredito);
    tVentasDia = safe(tVentasDia);
    totalHidden = safe(totalHidden);
    sumDevsCancels = safe(sumDevsCancels);

    const efectivoEsperadoCordobas = cajaInicialN + netCordobas;
    const efectivoEsperado = efectivoEsperadoCordobas + (netDolares * tasaRef);

    return {
        cajaInicial: cajaInicialN,
        netCordobas,
        netDolares,
        efectivoEsperado: safe(efectivoEsperado),
        efectivoEsperadoCordobas: safe(efectivoEsperadoCordobas),
        efectivoEsperadoDolares: netDolares,
        totalVentasDia: safe(tVentasDia),
        totalTarjeta: tTarjeta,
        totalTransferencia: tTransf,
        totalCredito: tCredito,
        totalNoEfectivo: safe(tTarjeta + tTransf + tCredito),
        sumDevolucionesCancelaciones: sumDevsCancels,
        totalHidden,
        tasaRef,
        lists: cls
    };
};

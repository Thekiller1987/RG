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
    const cleaned = [];

    for (const tx of transactions) {
        // Only skip if it has an ID and we've seen it (avoiding server duplicates)
        if (tx.id && seenIds.has(tx.id)) continue;
        if (tx.id) seenIds.add(tx.id);

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

    // Desglose de Ventas
    let vEfectivoC = 0; let vEfectivoD = 0;
    let vTarjeta = 0; let vTransf = 0; let vCredito = 0;

    // Desglose de Abonos
    let aEfectivoC = 0; let aEfectivoD = 0;
    let aTarjeta = 0; let aTransf = 0;

    let totalEntradasDia = 0;
    let totalSalidasDia = 0;

    for (const tx of validTransactions) {
        let t = (tx?.type || '').toLowerCase().trim();
        t = t.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

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
            if (pd.target === 'tarjeta') {
                tTarjeta += txAmount;
                vTarjeta += txAmount;
            } else if (pd.target === 'credito') {
                tCredito += txAmount;
                vCredito += txAmount;
            } else if (pd.target === 'transferencia') {
                tTransf += txAmount;
                vTransf += txAmount;
            }
        }

        // ══════════════════════════════════════════════════════
        // 2. PHYSICAL CASH CALCULATIONS (blindado con 3 niveles de fallback)
        // ══════════════════════════════════════════════════════
        if (t.startsWith('venta')) {
            // ── TIER 1: Campos desglosados del PaymentModal ──
            if (txEfectivo > 0.001 || txDolares > 0.001 || txCambio > 0.001) {
                netCordobas += (txEfectivo - txCambio);
                netDolares += txDolares;
                vEfectivoC += (txEfectivo - txCambio);
                vEfectivoD += txDolares;
            }
            // ── TIER 2: ingresoCaja (ya calculado por PaymentModal, incluye dólares convertidos) ──
            else if (txIngresoCaja > 0.001) {
                netCordobas += txIngresoCaja;
                vEfectivoC += txIngresoCaja;
                // NO sumar dólares aquí para evitar doble conteo
            }
            // ── TIER 3: Calcular residual (totalVenta - lo no-efectivo) ──
            else {
                const noEfectivoSum = txTarjeta + txTransf + txCredito;
                const residual = txTotalVenta - noEfectivoSum;
                if (residual > 0.001) {
                    netCordobas += residual;
                    vEfectivoC += residual;
                }
                // Si residual <= 0, fue todo tarjeta/transferencia/crédito → no cash
            }
            vTarjeta += txTarjeta;
            vTransf += txTransf;
            vCredito += txCredito;

        } else if (t.includes('abono') || t.includes('liquidación') || t.includes('liquidacion') || t.includes('pedido')) {
            if (txDolares > 0.001) {
                netDolares += txDolares;
                netCordobas += txEfectivo;
                aEfectivoD += txDolares;
                aEfectivoC += txEfectivo;
            } else if (txEfectivo > 0.001) {
                netCordobas += txEfectivo;
                aEfectivoC += txEfectivo;
            } else if (txIngresoCaja > 0.001) {
                netCordobas += txIngresoCaja;
                aEfectivoC += txIngresoCaja;
            } else {
                const noEfectivo = txTarjeta + txTransf;
                const cashPart = Math.max(0, txAmount - noEfectivo);
                netCordobas += cashPart;
                aEfectivoC += cashPart;
            }
            aTarjeta += txTarjeta;
            aTransf += txTransf;

        } else if (t === 'entrada') {
            netCordobas += Math.abs(txAmount);
            totalEntradasDia += Math.abs(txAmount);

        } else if (t === 'salida') {
            netCordobas -= Math.abs(txAmount);
            totalSalidasDia += Math.abs(txAmount);

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
            const isPairedWithEfectivo = (curTx, allTxs) => {
                if (curTx.pagoDetalles?.target !== 'ventas_totales') return false;
                const txTime = new Date(curTx.at || 0).getTime();
                return (allTxs || []).some(other => 
                    other !== curTx &&
                    (other.type || '').toLowerCase() === 'ajuste' &&
                    other.pagoDetalles?.target === 'efectivo' &&
                    Math.abs(Number(other.amount) - Number(curTx.amount)) < 0.01 &&
                    Math.abs(new Date(other.at || 0).getTime() - txTime) < 5000
                );
            };

            if (pd.target === 'efectivo') {
                netCordobas += txAmount;
                vEfectivoC += txAmount;
                if (pd.hidden) totalHidden += txAmount;
            } else if (pd.target === 'dolares') {
                netDolares += txAmount;
                vEfectivoD += txAmount;
            } else if (pd.target === 'tarjeta') {
                vTarjeta += txAmount;
                tTarjeta += txAmount;
            } else if (pd.target === 'credito') {
                vCredito += txAmount;
                tCredito += txAmount;
            } else if (pd.target === 'transferencia') {
                vTransf += txAmount;
                tTransf += txAmount;
            } else if (pd.target === 'ventas_totales') {
                // ventas_totales es contable: NUNCA modifica el dinero en mano (netCordobas)
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
        // 3. GLOBAL SALES TOTAL (ONLY VENTAS FACTURADAS NETAS - NO ABONOS)
        // ══════════════════════════════════════════════════════
        if (t.startsWith('venta')) {
            tVentasDia += Math.abs(totalRevenue);
        } else if (t.includes('devolucion') || t.includes('cancelacion') || t.includes('anulacion')) {
            tVentasDia -= Math.abs(totalRevenue);
        } else if (t === 'ajuste') {
            const isPaired = (curTx, allTxs) => {
                if (curTx.pagoDetalles?.target !== 'ventas_totales') return false;
                const txTime = new Date(curTx.at || 0).getTime();
                return (allTxs || []).some(other => 
                    other !== curTx &&
                    (other.type || '').toLowerCase() === 'ajuste' &&
                    other.pagoDetalles?.target === 'efectivo' &&
                    Math.abs(Number(other.amount) - Number(curTx.amount)) < 0.01 &&
                    Math.abs(new Date(other.at || 0).getTime() - txTime) < 5000
                );
            };

            if (pd.target === 'efectivo') {
                tVentasDia += txAmount;
            } else if (pd.target === 'dolares') {
                tVentasDia += (txAmount * tasaRef);
            } else if (pd.target === 'tarjeta' || pd.target === 'credito' || pd.target === 'transferencia') {
                tVentasDia += txAmount;
            } else if (pd.target === 'ventas_totales') {
                // Si viene de un par con efectivo, efectivo ya lo sumó a tVentasDia
                if (!isPaired(tx, validTransactions)) {
                    tVentasDia += txAmount;
                }
            }
        }

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
    vEfectivoC = safe(vEfectivoC);
    vEfectivoD = safe(vEfectivoD);
    vTarjeta = safe(vTarjeta);
    vTransf = safe(vTransf);
    vCredito = safe(vCredito);

    const efectivoEsperadoCordobas = cajaInicialN + netCordobas;
    const efectivoEsperado = efectivoEsperadoCordobas + (netDolares * tasaRef);

    const totalAbonosDia = safe(aEfectivoC + (aEfectivoD * tasaRef) + aTarjeta + aTransf);

    return {
        cajaInicial: cajaInicialN,
        netCordobas,
        netDolares,
        efectivoEsperado: safe(efectivoEsperado),
        efectivoEsperadoCordobas: safe(efectivoEsperadoCordobas),
        efectivoEsperadoDolares: netDolares,
        totalVentasDia: safe(tVentasDia),
        totalAbonosDia,
        totalEntradasDia: safe(totalEntradasDia),
        totalSalidasDia: safe(totalSalidasDia),
        totalTarjeta: tTarjeta,
        totalTransferencia: tTransf,
        totalCredito: tCredito,
        totalNoEfectivo: safe(tTarjeta + tTransf + tCredito),
        sumDevolucionesCancelaciones: sumDevsCancels,
        totalHidden,
        tasaRef,
        lists: cls,
        vEfectivoC: safe(vEfectivoC),
        vEfectivoD: safe(vEfectivoD),
        vTarjeta: safe(vTarjeta),
        vTransf: safe(vTransf),
        vCredito: safe(vCredito),
        aEfectivoC: safe(aEfectivoC),
        aEfectivoD: safe(aEfectivoD),
        aTarjeta: safe(aTarjeta),
        aTransf: safe(aTransf)
    };
};

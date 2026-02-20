/**
 * Centralized logic for cash register (Caja) statistics and totals.
 * Handles different transaction types, currency conversion, and hidden adjustments.
 */

export const calculateCajaStats = (transactions, initialAmount = 0, tasaDolar = 36.60) => {
    const cajaInicialN = Number(initialAmount || 0);
    const tasaRef = Number(tasaDolar || 36.60);

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
    let tVentasDia = 0; // Total Revenue (Sales + Abonos + Entries - Returns/Cancels)
    let totalHidden = 0;

    const validTransactions = Array.isArray(transactions) ? transactions : [];

    for (const tx of validTransactions) {
        const t = (tx?.type || '').toLowerCase();

        // Robust parsing of pagoDetalles
        let pd = tx?.pagoDetalles || {};
        if (typeof pd === 'string') {
            try { pd = JSON.parse(pd); } catch { pd = {}; }
        }
        if (!pd || typeof pd !== 'object') pd = {};

        // Fundamental Amounts
        // ingresoCaja: Physical cash movement. If missing, fallback to tx.amount
        let rawImpact = Number(pd.ingresoCaja !== undefined ? pd.ingresoCaja : (tx.amount || 0));
        // totalVenta: Accounting revenue. If missing, fallback to tx.amount
        let totalRevenue = Number(pd.totalVenta !== undefined ? pd.totalVenta : (tx.amount || 0));

        // Force negative sign for money-leaving transactions
        const isNegativeType = t === 'salida' || t.includes('devolucion') || t.includes('cancelacion') || t.includes('anulacion');
        if (isNegativeType) {
            rawImpact = -Math.abs(rawImpact);
            totalRevenue = -Math.abs(totalRevenue);
        }

        const normalizedTx = { ...tx, pagoDetalles: pd, displayAmount: totalRevenue };

        // 1. ACCOUNTING TOTALS (Revenue Summary)
        const txTarjeta = Number(pd.tarjeta || 0);
        const txTransf = Number(pd.transferencia || 0);
        const txCredito = Number(pd.credito || 0);

        // Only add to non-cash totals if it's a type that generates revenue
        if (t.startsWith('venta') || t.includes('abono') || t.includes('pedido') || t.includes('apartado')) {
            tTarjeta += txTarjeta;
            tTransf += txTransf;
            tCredito += txCredito;
        } else if (t === 'ajuste') {
            if (pd.target === 'tarjeta') tTarjeta += Number(tx.amount || 0);
            if (pd.target === 'credito') tCredito += Number(tx.amount || 0);
            if (pd.target === 'transferencia') tTransf += Number(tx.amount || 0);
        }

        // 2. PHYSICAL CASH CALCULATIONS
        if (t.startsWith('venta')) {
            if (pd.efectivo !== undefined || pd.dolares !== undefined) {
                netCordobas += (Number(pd.efectivo || 0) - Number(pd.cambio || 0));
                netDolares += Number(pd.dolares || 0);
            } else {
                // Fallback for legacy or un-broken down sales
                netCordobas += (rawImpact - txTarjeta - txTransf - txCredito);
            }
        } else if (t.includes('abono')) {
            if (pd.dolares !== undefined) {
                netDolares += Number(pd.dolares || 0);
                netCordobas += Number(pd.efectivo || 0);
            } else {
                netCordobas += rawImpact;
            }
        } else if (t === 'entrada') {
            netCordobas += Math.abs(rawImpact);
        } else if (t === 'salida') {
            netCordobas -= Math.abs(rawImpact);
        } else if (t.includes('devolucion') || t.includes('cancelacion') || t.includes('anulacion')) {
            // For reversions, we assume rawImpact (already negative) is the net cash reversal
            // If we had more detail we could reverse card/cash specifically, but usually it's cash.
            netCordobas += rawImpact;
        } else if (t === 'ajuste') {
            if (pd.target === 'efectivo') {
                netCordobas += rawImpact;
                if (pd.hidden) totalHidden += rawImpact;
            } else if (pd.target === 'dolares') {
                netDolares += rawImpact;
            }
        } else {
            // Fallback for any other type
            netCordobas += rawImpact;
        }

        // 3. GLOBAL SALES TOTAL
        if (t.startsWith('venta') || t.includes('abono') || t === 'entrada') {
            tVentasDia += Math.abs(totalRevenue);
        } else if (t.includes('devolucion') || t.includes('cancelacion') || t.includes('anulacion')) {
            tVentasDia -= Math.abs(totalRevenue);
        } else if (t === 'ajuste') {
            tVentasDia += totalRevenue;
        }

        // 4. CLASSIFICATION for Lists
        if (t.startsWith('venta')) cls.ventasContado.push(normalizedTx);
        else if (t.includes('devolucion')) { cls.devoluciones.push(normalizedTx); sumDevsCancels += Math.abs(totalRevenue); }
        else if (t.includes('cancelacion') || t.includes('anulacion')) { cls.cancelaciones.push(normalizedTx); sumDevsCancels += Math.abs(totalRevenue); }
        else if (t === 'entrada') cls.entradas.push(normalizedTx);
        else if (t === 'salida') cls.salidas.push(normalizedTx);
        else if (t.includes('abono')) cls.abonos.push(normalizedTx);
        else if (t === 'ajuste') cls.ajustes.push(normalizedTx);
    }

    const efectivoEsperadoCordobas = cajaInicialN + netCordobas;
    const efectivoEsperado = efectivoEsperadoCordobas + (netDolares * tasaRef);

    return {
        cajaInicial: cajaInicialN,
        netCordobas,
        netDolares,
        efectivoEsperado,
        efectivoEsperadoCordobas,
        efectivoEsperadoDolares: netDolares,
        totalVentasDia,
        totalTarjeta: tTarjeta,
        totalTransferencia: tTransf,
        totalCredito: tCredito,
        totalNoEfectivo: tTarjeta + tTransf + tCredito,
        sumDevolucionesCancelaciones: sumDevsCancels,
        totalHidden,
        tasaRef,
        lists: cls
    };
};

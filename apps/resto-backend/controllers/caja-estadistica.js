const { eq, and, gte, count, sum } = require("drizzle-orm");
const { db, pagos, facturas, gastos } = require("@restobar/database");

const getIngresos = async (req, res) => {
    const { periodo } = req.query;
    const all = await db.select().from(pagos).where(eq(pagos.estado, "completado")).orderBy(pagos.createdAt, "asc").all();

    const grouped = {};
    for (const p of all) {
        const d = new Date(p.createdAt);
        let key;
        if (periodo === "dia") key = d.toISOString().slice(0, 10);
        else if (periodo === "semana") { const start = new Date(d); start.setDate(d.getDate() - d.getDay()); key = start.toISOString().slice(0, 10); }
        else if (periodo === "mes") key = d.toISOString().slice(0, 7);
        else key = d.toISOString().slice(0, 4);

        if (!grouped[key]) grouped[key] = { periodo: key, total: 0, cantidad: 0 };
        grouped[key].total += p.monto;
        grouped[key].cantidad++;
    }

    res.json(Object.values(grouped));
};

const getMetodosPago = async (req, res) => {
    const all = await db.select().from(pagos).where(eq(pagos.estado, "completado")).all();
    const grouped = {};

    for (const p of all) {
        const m = p.metodo_pago || "efectivo";
        if (!grouped[m]) grouped[m] = { metodo_pago: m, cantidad: 0, total: 0 };
        grouped[m].cantidad++;
        grouped[m].total += p.monto;
    }

    res.json(Object.values(grouped));
};

const getResumenGastos = async (req, res) => {
    const all = await db.select().from(gastos).all();
    const grouped = {};

    for (const g of all) {
        const c = g.categoria || "otros";
        if (!grouped[c]) grouped[c] = { categoria: c, total: 0, cantidad: 0 };
        grouped[c].total += g.monto;
        grouped[c].cantidad++;
    }

    res.json(Object.values(grouped));
};

const getResumenGeneral = async (req, res) => {
    const { periodo } = req.query;
    let desde = null;
    const ahora = new Date();

    if (periodo === "hoy") desde = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate()).toISOString();
    else if (periodo === "semana") { const d = new Date(); d.setDate(ahora.getDate() - 7); desde = d.toISOString(); }
    else if (periodo === "mes") desde = new Date(ahora.getFullYear(), ahora.getMonth(), 1).toISOString();
    else if (periodo === "año") desde = new Date(ahora.getFullYear(), 0, 1).toISOString();

    let pagoFilter = eq(pagos.estado, "completado");
    if (desde) pagoFilter = and(pagoFilter, gte(pagos.createdAt, desde));

    const totalIngresos = db.select({ total: sum(pagos.monto) }).from(pagos).where(pagoFilter).get();
    const totalPagos = db.select({ total: count() }).from(pagos).where(pagoFilter).get();
    const totalFacturasCount = db.select({ total: count() }).from(facturas).get();

    let gastoFilter = undefined;
    if (desde) gastoFilter = gte(gastos.createdAt, desde);
    const totalGastos = gastoFilter
        ? db.select({ total: sum(gastos.monto) }).from(gastos).where(gastoFilter).get()
        : db.select({ total: sum(gastos.monto) }).from(gastos).get();

    res.json({
        totalIngresos: totalIngresos.total || 0,
        totalGastos: totalGastos.total || 0,
        ganancia: (totalIngresos.total || 0) - (totalGastos.total || 0),
        totalFacturas: totalFacturasCount.total || 0,
        totalPagos: totalPagos.total || 0,
    });
};

module.exports = { getIngresos, getMetodosPago, getResumenGastos, getResumenGeneral };

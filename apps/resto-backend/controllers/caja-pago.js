const { eq } = require("drizzle-orm");
const { db, now, pagos, facturas, orders, tables } = require("@restobar/database");

const getPagos = async (req, res) => {
    const result = await db.select().from(pagos).all();
    const withFactura = result.map(p => {
        const f = db.select().from(facturas).where(eq(facturas.pago_id, p.id)).get();
        return { ...p, Factum: f || null };
    });
    res.json(withFactura);
};

const getPagoById = async (req, res) => {
    const pago = db.select().from(pagos).where(eq(pagos.id, Number(req.params.id))).get();
    if (!pago) {
        res.status(404);
        throw new Error("Pago no encontrado");
    }
    const f = db.select().from(facturas).where(eq(facturas.pago_id, pago.id)).get();
    res.json({ ...pago, Factum: f || null });
};

const createPago = async (req, res) => {
    const { monto, metodo_pago, referencia, orderId } = req.body;

    const pago = db.insert(pagos).values({
        monto: Number(monto),
        metodo_pago,
        referencia,
        estado: "completado",
        orderId: orderId ? Number(orderId) : null,
        createdAt: now(),
        updatedAt: now(),
    }).returning().get();

    if (orderId) {
        const order = await db.select().from(orders).where(eq(orders.id, Number(orderId))).get();
        if (order) {
            await db.update(orders).set({ isPaid: true, updatedAt: now() }).where(eq(orders.id, Number(orderId))).run();
            if (order.tableId) {
                await db.update(tables).set({ occupied: false }).where(eq(tables.id, order.tableId)).run();
            }
        }
    }

    res.status(201).json(pago);
};

const anularPago = async (req, res) => {
    const pago = db.select().from(pagos).where(eq(pagos.id, Number(req.params.id))).get();
    if (!pago) {
        res.status(404);
        throw new Error("Pago no encontrado");
    }
    await db.update(pagos).set({ estado: "anulado", updatedAt: now() }).where(eq(pagos.id, Number(req.params.id))).run();
    const updated = db.select().from(pagos).where(eq(pagos.id, Number(req.params.id))).get();
    res.json(updated);
};

module.exports = { getPagos, getPagoById, createPago, anularPago };
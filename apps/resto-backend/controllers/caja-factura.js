const { eq, and, gte, lte, between, count } = require("drizzle-orm");
const { db, now, facturas, pagos } = require("@restobar/database");

const getFacturas = async (req, res) => {
    const { tipo, desde, hasta } = req.query;
    let conditions = [];

    if (tipo) conditions.push(eq(facturas.tipo, tipo));
    if (desde && hasta) conditions.push(between(facturas.createdAt, desde, hasta));

    const filter = conditions.length > 0 ? and(...conditions) : undefined;
    const result = filter
        ? await db.select().from(facturas).where(filter).all()
        : await db.select().from(facturas).all();

    const withPago = result.map(f => {
        const p = db.select().from(pagos).where(eq(pagos.id, f.pago_id)).get();
        return { ...f, Pago: p || null };
    });
    res.json(withPago);
};

const getFacturaById = async (req, res) => {
    const factura = db.select().from(facturas).where(eq(facturas.id, Number(req.params.id))).get();
    if (!factura) {
        res.status(404);
        throw new Error("Factura no encontrada");
    }
    const p = db.select().from(pagos).where(eq(pagos.id, factura.pago_id)).get();
    res.json({ ...factura, Pago: p || null });
};

const createFactura = async (req, res) => {
    const { tipo, cliente_nombre, cliente_ruc, subtotal, pago_id } = req.body;

    const igv = parseFloat((subtotal * 0.18).toFixed(2));
    const total = parseFloat((subtotal + igv).toFixed(2));

    const totalCount = db.select({ total: count() }).from(facturas).get();
    const numero = `${tipo === "factura" ? "F" : "B"}001-${String((totalCount.total || 0) + 1).padStart(6, "0")}`;

    const factura = db.insert(facturas).values({
        tipo, numero, cliente_nombre, cliente_ruc,
        subtotal: Number(subtotal), igv, total: Number(total),
        pago_id: Number(pago_id), createdAt: now(), updatedAt: now(),
    }).returning().get();

    res.status(201).json(factura);
};

module.exports = { getFacturas, getFacturaById, createFactura };

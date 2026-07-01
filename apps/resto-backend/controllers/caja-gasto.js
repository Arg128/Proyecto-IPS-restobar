const { eq, and, between } = require("drizzle-orm");
const { db, now, gastos } = require("@restobar/database");

const getGastos = async (req, res) => {
    const { categoria, desde, hasta } = req.query;
    let conditions = [];

    if (categoria) conditions.push(eq(gastos.categoria, categoria));
    if (desde && hasta) conditions.push(between(gastos.fecha, desde, hasta));

    const filter = conditions.length > 0 ? and(...conditions) : undefined;
    const result = filter
        ? await db.select().from(gastos).where(filter).orderBy(gastos.fecha, "desc").all()
        : await db.select().from(gastos).orderBy(gastos.fecha, "desc").all();
    res.json(result);
};

const getGastoById = async (req, res) => {
    const gasto = db.select().from(gastos).where(eq(gastos.id, Number(req.params.id))).get();
    if (!gasto) {
        res.status(404);
        throw new Error("Gasto no encontrado");
    }
    res.json(gasto);
};

const createGasto = async (req, res) => {
    const { descripcion, categoria, monto, fecha, comprobante } = req.body;
    const gasto = db.insert(gastos).values({
        descripcion, categoria, monto: Number(monto), fecha, comprobante,
        createdAt: now(), updatedAt: now(),
    }).returning().get();
    res.status(201).json(gasto);
};

const updateGasto = async (req, res) => {
    const gasto = db.select().from(gastos).where(eq(gastos.id, Number(req.params.id))).get();
    if (!gasto) {
        res.status(404);
        throw new Error("Gasto no encontrado");
    }
    const { descripcion, categoria, monto, fecha, comprobante } = req.body;
    db.update(gastos).set({
        descripcion, categoria, monto: Number(monto), fecha, comprobante,
        updatedAt: now(),
    }).where(eq(gastos.id, Number(req.params.id))).run();
    const updated = db.select().from(gastos).where(eq(gastos.id, Number(req.params.id))).get();
    res.json(updated);
};

const deleteGasto = async (req, res) => {
    const gasto = db.select().from(gastos).where(eq(gastos.id, Number(req.params.id))).get();
    if (!gasto) {
        res.status(404);
        throw new Error("Gasto no encontrado");
    }
    db.delete(gastos).where(eq(gastos.id, Number(req.params.id))).run();
    res.json({ message: "Gasto eliminado" });
};

module.exports = { getGastos, getGastoById, createGasto, updateGasto, deleteGasto };

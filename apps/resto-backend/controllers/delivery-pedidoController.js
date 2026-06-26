const { eq } = require("drizzle-orm");
const { db, now, pedidos } = require("@restobar/database");

const getPedidos = async (req, res) => {
    const result = db.select().from(pedidos).orderBy(pedidos.createdAt, "desc").all();
    res.json(result);
};

const getPedidoById = async (req, res) => {
    const pedido = db.select().from(pedidos).where(eq(pedidos.id, Number(req.params.id))).get();
    if (!pedido) {
        return res.status(404).json({ message: "Pedido no encontrado" });
    }
    res.json(pedido);
};

const createPedido = async (req, res) => {
    const { cliente, direccion, telefono, nota, total, productos } = req.body;
    const pedido = db.insert(pedidos).values({
        cliente, direccion, telefono, nota,
        total: Number(total),
        productos: productos ? JSON.stringify(productos) : null,
        estado: "Pendiente", isPaid: false,
        createdAt: now(), updatedAt: now(),
    }).returning().get();
    res.status(201).json(pedido);
};

const updateEstado = async (req, res) => {
    const pedido = db.select().from(pedidos).where(eq(pedidos.id, Number(req.params.id))).get();
    if (!pedido) {
        return res.status(404).json({ message: "Pedido no encontrado" });
    }
    db.update(pedidos).set({ estado: req.body.estado || pedido.estado, updatedAt: now() })
        .where(eq(pedidos.id, Number(req.params.id))).run();
    const updated = db.select().from(pedidos).where(eq(pedidos.id, Number(req.params.id))).get();
    res.json(updated);
};

const pagarPedido = async (req, res) => {
    const pedido = db.select().from(pedidos).where(eq(pedidos.id, Number(req.params.id))).get();
    if (!pedido) {
        return res.status(404).json({ message: "Pedido no encontrado" });
    }
    db.update(pedidos).set({
        isPaid: true, metodoPago: req.body.metodoPago || "efectivo",
        estado: "Entregado", updatedAt: now(),
    }).where(eq(pedidos.id, Number(req.params.id))).run();
    const updated = db.select().from(pedidos).where(eq(pedidos.id, Number(req.params.id))).get();
    res.json(updated);
};

module.exports = { getPedidos, getPedidoById, createPedido, updateEstado, pagarPedido };

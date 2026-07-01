const { eq } = require("drizzle-orm");
const { db, orders, orderProducts, products, eventosCoccion } = require("@restobar/database");

exports.obtenerPedidosPendientes = async (req, res) => {
    const allOrders = await db.select().from(orders).orderBy(orders.createdAt, "asc").all();
    if (!allOrders) {
      return
    }

    const result = await Promise.all(allOrders.map(async o => {
        const ops = await db.select().from(orderProducts).where(eq(orderProducts.orderId, o.id)).all();
        const prods = await Promise.all(ops.map(async op => {
            const prod = db.select().from(products).where(eq(products.id, op.productId)).get();
            const events = prod ? await db.select().from(eventosCoccion).where(eq(eventosCoccion.productId, prod.id)).orderBy(eventosCoccion.orden, "asc").all() : [];
            return { ...prod, OrderProduct: { quantity: op.quantity }, eventosCoccion: events };
        }));
        return { ...o, products: prods };
    }));

    res.json(result);
};

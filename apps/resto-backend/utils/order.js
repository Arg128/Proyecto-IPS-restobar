const { eq } = require("drizzle-orm");
const { db, products, tables, orders, orderProducts } = require("@restobar/database");

exports.stock = async (list) => {
    for (const item of list) {
        const prod = db.select().from(products).where(eq(products.id, Number(item.id))).get();
        if (!prod || prod.stock < item.quantity) return false;
    }
    return true;
};

exports.updateTable = async (id, occupied) => {
    db.update(tables).set({ occupied }).where(eq(tables.id, Number(id))).run();
};

exports.addProductsInOrder = async (order, prods) => {
    for (const p of prods) {
        db.insert(orderProducts).values({
            orderId: order.id,
            productId: Number(p.id),
            quantity: p.quantity || 1,
        }).run();
    }
};

exports.updateProductsStock = async (prods, condition) => {
    for (const p of prods) {
        const prod = db.select().from(products).where(eq(products.id, Number(p.id))).get();
        if (prod) {
            const delta = condition >= 1 ? p.quantity : -p.quantity;
            db.update(products).set({ stock: prod.stock + delta }).where(eq(products.id, Number(p.id))).run();
        }
    }
};

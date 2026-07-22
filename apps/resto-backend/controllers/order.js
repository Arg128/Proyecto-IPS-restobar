const { eq, and, or, like, gte, lt, count, sum } = require("drizzle-orm");
const { db, now, orders, clients, tables, orderProducts, products, users } = require("@restobar/database");

exports.createOrder = async (req, res) => {
    const { total, tableId, clientId, products: prods, delivery, note } = req.body;

    const created = await db.insert(orders).values({
        total: Number(total),
        tableId: delivery ? null : Number(tableId),
        userId: req.user.id,
        clientId: clientId ? Number(clientId) : null,
        delivery: delivery || false,
        note: note || null,
        createdAt: now(),
        updatedAt: now(),
    }).returning().get();

    for (const p of prods) {
        await db.insert(orderProducts).values({
            orderId: created.id,
            productId: Number(p.id),
            quantity: p.quantity || 1,
        }).run();

        const prod = await db.select().from(products).where(eq(products.id, Number(p.id))).get();
        if (prod) {
            await db.update(products).set({ stock: prod.stock - (p.quantity || 1) }).where(eq(products.id, Number(p.id))).run();
        }
    }

    if (!delivery && tableId) {
        await db.update(tables).set({ occupied: true }).where(eq(tables.id, Number(tableId))).run();
    }

    res.status(201).json(created);
};

exports.getOrders = async (req, res) => {
    const pageSize = 5;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword;
    const deliveryFilter = req.query.delivery === "true";

    let query = db.select().from(orders).limit(pageSize).offset(pageSize * (page - 1)).orderBy(orders.id, "desc");
    let countQuery = db.select({ total: count() }).from(orders);
    const conditions = [];

    if (deliveryFilter) conditions.push(eq(orders.delivery, true));

    if (keyword) {
        const pattern = `%${keyword}%`;
        conditions.push(or(like(orders.id, pattern), like(orders.total, pattern)));
    }

    if (conditions.length > 0) {
        const filter = and(...conditions);
        query = query.where(filter);
        countQuery = countQuery.where(filter);
    }

    const result = await query.all();
    const total = await countQuery.get();

    const withRelations = [];
    for (const o of result) {
        const client = o.clientId ? await db.select().from(clients).where(eq(clients.id, o.clientId)).get() : null;
        const table = o.tableId ? await db.select().from(tables).where(eq(tables.id, o.tableId)).get() : null;
        withRelations.push({ ...o, client: client || null, table: table || null });
    }

    res.json({ orders: withRelations, page, pages: Math.ceil(total.total / pageSize) });
};

exports.getOrder = async (req, res) => {
    const order = await db.select().from(orders).where(eq(orders.id, Number(req.params.id))).get();

    if (order) {
        const client = order.clientId ? await db.select().from(clients).where(eq(clients.id, order.clientId)).get() : null;
        const table = order.tableId ? await db.select().from(tables).where(eq(tables.id, order.tableId)).get() : null;
        const orderProds = await db.select().from(orderProducts).where(eq(orderProducts.orderId, order.id)).all();
        const productsWithQty = [];
        for (const op of orderProds) {
            const prod = await db.select().from(products).where(eq(products.id, op.productId)).get();
            productsWithQty.push({ ...prod, quantity: op.quantity });
        }
        res.json({ ...order, client, table, products: productsWithQty });
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
};

exports.updateOrderPay = async (req, res) => {
    const order = await db.select().from(orders).where(eq(orders.id, Number(req.params.id))).get();

    if (order) {
        if (order.tableId) {
            await db.update(tables).set({ occupied: false }).where(eq(tables.id, order.tableId)).run();
        }
        await db.update(orders).set({ isPaid: !order.isPaid, updatedAt: now() }).where(eq(orders.id, Number(req.params.id))).run();
        const updated = await db.select().from(orders).where(eq(orders.id, Number(req.params.id))).get();
        res.json(updated);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
};

exports.updateOrder = async (req, res) => {
    const order = await db.select().from(orders).where(eq(orders.id, Number(req.params.id))).get();
    const { total, clientId, tableId, delivery, products: prods, note } = req.body;

    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }

    const updates = {
        clientId: clientId !== undefined ? Number(clientId) : order.clientId,
        delivery: delivery !== undefined ? delivery : order.delivery,
        note: note !== undefined ? note : order.note,
        updatedAt: now(),
    };

    if (order.tableId !== Number(tableId)) {
        if (!order.tableId && !delivery) {
            await db.update(tables).set({ occupied: true }).where(eq(tables.id, Number(tableId))).run();
            updates.tableId = Number(tableId);
        } else if (order.tableId && delivery) {
            await db.update(tables).set({ occupied: false }).where(eq(tables.id, order.tableId)).run();
            updates.tableId = null;
        } else {
            if (order.tableId) await db.update(tables).set({ occupied: false }).where(eq(tables.id, order.tableId)).run();
            if (tableId) await db.update(tables).set({ occupied: true }).where(eq(tables.id, Number(tableId))).run();
            updates.tableId = tableId ? Number(tableId) : null;
        }
    }

    if (prods && Number(total) !== order.total) {
        const oldProds = await db.select().from(orderProducts).where(eq(orderProducts.orderId, order.id)).all();
        for (const op of oldProds) {
            const prod = await db.select().from(products).where(eq(products.id, op.productId)).get();
            if (prod) await db.update(products).set({ stock: prod.stock + op.quantity }).where(eq(products.id, op.productId)).run();
        }
        await db.delete(orderProducts).where(eq(orderProducts.orderId, order.id)).run();
        for (const p of prods) {
            await db.insert(orderProducts).values({ orderId: order.id, productId: Number(p.id), quantity: p.quantity || 1 }).run();
            const prod = await db.select().from(products).where(eq(products.id, Number(p.id))).get();
            if (prod) await db.update(products).set({ stock: prod.stock - (p.quantity || 1) }).where(eq(products.id, Number(p.id))).run();
        }
        updates.total = Number(total);
    }

    await db.update(orders).set(updates).where(eq(orders.id, Number(req.params.id))).run();
    const updated = await db.select().from(orders).where(eq(orders.id, Number(req.params.id))).get();
    res.status(200).json(updated);
};

exports.updateOrderDelivery = async (req, res) => {
    const order = await db.select().from(orders).where(eq(orders.id, Number(req.params.id))).get();

    if (order) {
        await db.update(orders).set({ delivery: !order.delivery, updatedAt: now() }).where(eq(orders.id, Number(req.params.id))).run();
        const updated = await db.select().from(orders).where(eq(orders.id, Number(req.params.id))).get();
        res.json(updated);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
};

exports.deleteOrder = async (req, res) => {
    const order = await db.select().from(orders).where(eq(orders.id, Number(req.params.id))).get();

    if (order) {
        await db.delete(orderProducts).where(eq(orderProducts.orderId, order.id)).run();
        await db.delete(orders).where(eq(orders.id, Number(req.params.id))).run();
        res.json({ message: "Order removed" });
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
};

exports.getStatistics = async (req, res) => {
    const TODAY_START = new Date();
    TODAY_START.setHours(0, 0, 0, 0);
    const NOW = new Date();
    const todayStartStr = TODAY_START.toISOString();
    const nowStr = NOW.toISOString();

    const sales = await db.select().from(orders).where(eq(orders.isPaid, true)).limit(5).all();

    const totalSales = await db.select({ total: sum(orders.total) }).from(orders).where(eq(orders.isPaid, true)).get();
    const deliveriesMade = await db.select({ total: count() }).from(orders).where(and(eq(orders.delivery, true), eq(orders.isPaid, true))).get();
    const totalOrdersPaid = await db.select({ total: count() }).from(orders).where(eq(orders.isPaid, true)).get();
    const todaySales = await db.select({ total: sum(orders.total) }).from(orders)
        .where(and(eq(orders.isPaid, true), gte(orders.updatedAt, todayStartStr))).get();
    const unpaidOrders = await db.select().from(orders).where(eq(orders.isPaid, false)).all();

    res.json({
        statistics: {
            total: totalSales.total || 0,
            today: todaySales.total || 0,
            orders: totalOrdersPaid.total || 0,
            deliveries: deliveriesMade.total || 0,
        },
        sales,
        orders: unpaidOrders,
    });
};

exports.getPendingOrders = async (req, res) => {
    const pendingOrders = await db
        .select({
            id: orders.id,
            total: orders.total,
            note: orders.note,
            createdAt: orders.createdAt,
            tableId: orders.tableId,
            tableName: tables.name,
            userId: orders.userId,
            userName: users.name,
        })
        .from(orders)
        .leftJoin(tables, eq(orders.tableId, tables.id))
        .leftJoin(users, eq(orders.userId, users.id))
        .where(eq(orders.isPaid, false))
        .all();

    res.json(pendingOrders);
};
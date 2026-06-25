const asyncHandler = require("express-async-handler");
const { Order, Client, Table } = require("../models");
const { Op } = require("sequelize");
const {
    stock,
    updateTable,
    addProductsInOrder,
    updateProductsStock,
} = require("../utils/order");

exports.createOrder = asyncHandler(async (req, res) => {
    const { total, tableId, clientId, products, delivery, note } = req.body;

    await stock(products);

    if (stock) {
        const createdOrder = await Order.create({
            total,
            tableId: !delivery ? tableId : null,
            userId: req.user.id,
            clientId: clientId,
            delivery: delivery,
            note: note,
        });

        await addProductsInOrder(createdOrder, products);

        if (!delivery) {
            await updateTable(createdOrder.tableId, true);
        }

        await updateProductsStock(products, -1);

        res.status(201).json(createdOrder);
    } else {
        res.status(400).json({ message: "There is no stock available" });
    }
});

exports.getOrders = asyncHandler(async (req, res) => {
    const pageSize = 5;
    const page = Number(req.query.pageNumber) || 1;
    const delivery = Boolean(req.query.delivery) || false;
    const keyword = req.query.keyword ? req.query.keyword : null;
    let options = {
        include: [
            { model: Client, as: "client" },
            { model: Table, as: "table" },
        ],
        attributes: {
            exclude: ["userId", "clientId", "tableId", "updatedAt"],
        },
        order: [["id", "DESC"]],
        offset: pageSize * (page - 1),
        limit: pageSize,
    };

    if (keyword) {
        options = {
            ...options,
            where: {
                [Op.or]: [
                    { id: { [Op.like]: `%${keyword}%` } },
                    { total: keyword },
                    { "$client.name$": { [Op.like]: `%${keyword}%` } },
                    { "$table.name$": { [Op.like]: `%${keyword}%` } },
                ],
            },
        };
    }

    if (delivery) {
        options = {
            ...options,
            where: {
                ...options.where,
                delivery: {
                    [Op.eq]: true,
                },
            },
        };
    }

    const count = await Order.count({ ...options });
    const orders = await Order.findAll({ ...options });

    res.json({ orders, page, pages: Math.ceil(count / pageSize) });
});

exports.getOrder = asyncHandler(async (req, res) => {
    const order = await Order.findByPk(req.params.id, {
        include: { all: true, nested: true },
    });
    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

exports.updateOrderPay = asyncHandler(async (req, res) => {
    const order = await Order.findByPk(req.params.id);

    if (order) {
        if (order.tableId) {
            const table = await Table.findByPk(order.tableId);
            table.occupied = false;
            table.save();
        }

        order.isPaid = !order.isPaid;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

exports.updateOrder = asyncHandler(async (req, res) => {
    const order = await Order.findByPk(req.params.id, {
        include: { all: true, nested: true },
    });
    const { total, clientId, tableId, delivery, products, note } = req.body;

    if (order) {
        order.clientId = clientId;
        order.delivery = delivery;
        order.note = note;

        if (order.tableId !== tableId) {
            if (!order.tableId && !delivery) {
                await updateTable(tableId, true);
                order.tableId = tableId;
            } else if (order.tableId && delivery) {
                await updateTable(order.tableId, false);
                order.tableId = null;
            } else {
                await updateTable(order.tableId, false);
                await updateTable(tableId, true);
                order.tableId = tableId;
            }
        }

        if (parseFloat(order.total) !== parseFloat(total)) {
            const oldProducts = await order.getProducts();
            if (oldProducts) {
                const formattedOldProducts = oldProducts.map((product) => {
                    product.quantity = product.OrderProduct.quantity;
                    return product;
                });

                await updateProductsStock(formattedOldProducts, 1);

                await order.setProducts(null);

                await addProductsInOrder(order, products);

                await updateProductsStock(products, -1);
            }
        }
        order.total = total;
        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

exports.updateOrderDelivery = asyncHandler(async (req, res) => {
    const order = await Order.findByPk(req.params.id);

    if (order) {
        order.delivery = !order.delivery;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

exports.deleteOrder = asyncHandler(async (req, res) => {
    const order = await Order.findByPk(req.params.id);

    if (order) {
        await order.destroy();
        res.json({ message: "Order removed" });
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

exports.getStatistics = asyncHandler(async (req, res) => {
    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const NOW = new Date();

    const sales = await Order.findAll({
        where: {
            isPaid: true,
        },
        limit: 5,
        include: { all: true, nested: true },
    });

    const totalSales = await Order.sum("total", {
        where: {
            isPaid: true,
        },
    });

    const deliveriesMade = await Order.count({
        where: {
            delivery: true,
            isPaid: true,
        },
    });

    const totalOrdersPaid = await Order.count({
        where: {
            isPaid: true,
        },
    });

    const todaySales = await Order.sum("total", {
        where: {
            updatedAt: {
                [Op.gt]: TODAY_START,
                [Op.lt]: NOW,
            },
            isPaid: true,
        },
    });

    const orders = await Order.findAll({
        where: {
            [Op.or]: [{ isPaid: false }],
        },
        include: { all: true, nested: true },
        attributes: {
            exclude: ["userId", "clientId", "tableId"],
        },
    });

    res.json({
        statistics: {
            total: totalSales,
            today: todaySales,
            orders: totalOrdersPaid,
            deliveries: deliveriesMade,
        },
        sales,
        orders,
    });
});

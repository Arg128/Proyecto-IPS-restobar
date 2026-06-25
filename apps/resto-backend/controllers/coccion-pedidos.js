const asyncHandler = require("express-async-handler");
const { Order, Product, EventoCoccion } = require("../models");

exports.obtenerPedidosPendientes = asyncHandler(async (req, res) => {
    const pedidos = await Order.findAll({
        include: [
            {
                model: Product,
                as: "products",
                through: { attributes: ["quantity"] },
                include: [
                    {
                        model: EventoCoccion,
                        as: "eventosCoccion",
                        order: [["orden", "ASC"]],
                    },
                ],
            },
        ],
        order: [["createdAt", "ASC"]],
    });
    res.json(pedidos);
});

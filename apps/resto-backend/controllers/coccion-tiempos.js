const asyncHandler = require("express-async-handler");
const { TiempoCoccion, EventoCoccion, Product } = require("../models");

exports.obtenerTiempos = asyncHandler(async (req, res) => {
    const tiempos = await TiempoCoccion.findAll({
        include: [{ model: Product, as: "producto" }],
    });
    res.json(tiempos);
});

exports.actualizarTiempo = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { tiempoPromedio } = req.body;

    const [tiempo] = await TiempoCoccion.findOrCreate({
        where: { productId },
        defaults: { productId, principal: tiempoPromedio },
    });

    if (tiempo.principal !== tiempoPromedio) {
        tiempo.principal = tiempoPromedio;
        await tiempo.save();
    }

    res.json(tiempo);
});

exports.obtenerEventosDeProducto = asyncHandler(async (req, res) => {
    const eventos = await EventoCoccion.findAll({
        where: { productId: req.params.productId },
        order: [["orden", "ASC"]],
    });
    res.json(eventos);
});

exports.configurarEventos = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { eventos } = req.body;

    await EventoCoccion.destroy({ where: { productId } });

    if (eventos && eventos.length > 0) {
        const nuevos = eventos.map((e, i) => ({
            productId: parseInt(productId),
            nombre: e.nombre,
            duracionSegundos: e.duracionSegundos || 0,
            orden: i,
        }));
        await EventoCoccion.bulkCreate(nuevos);
    }

    const creados = await EventoCoccion.findAll({
        where: { productId },
        order: [["orden", "ASC"]],
    });
    res.json(creados);
});

exports.obtenerProductos = asyncHandler(async (req, res) => {
    const productos = await Product.findAll({
        include: [
            { model: TiempoCoccion, as: "tiemposCoccion" },
            { model: EventoCoccion, as: "eventosCoccion" },
        ],
    });
    res.json(productos);
});

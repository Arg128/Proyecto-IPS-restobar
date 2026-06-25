const asyncHandler = require("express-async-handler");
const { Gasto } = require("../models");
const { Op } = require("sequelize");

const getGastos = asyncHandler(async (req, res) => {
    const { categoria, desde, hasta } = req.query;
    const where = {};

    if (categoria) where.categoria = categoria;
    if (desde && hasta) {
        where.fecha = {
            [Op.between]: [desde, hasta],
        };
    }

    const gastos = await Gasto.findAll({ where, order: [["fecha", "DESC"]] });
    res.json(gastos);
});

const getGastoById = asyncHandler(async (req, res) => {
    const gasto = await Gasto.findByPk(req.params.id);
    if (!gasto) {
        res.status(404);
        throw new Error("Gasto no encontrado");
    }
    res.json(gasto);
});

const createGasto = asyncHandler(async (req, res) => {
    const { descripcion, categoria, monto, fecha, comprobante } = req.body;
    const gasto = await Gasto.create({
        descripcion,
        categoria,
        monto,
        fecha,
        comprobante,
    });
    res.status(201).json(gasto);
});

const updateGasto = asyncHandler(async (req, res) => {
    const gasto = await Gasto.findByPk(req.params.id);
    if (!gasto) {
        res.status(404);
        throw new Error("Gasto no encontrado");
    }
    const { descripcion, categoria, monto, fecha, comprobante } = req.body;
    await gasto.update({ descripcion, categoria, monto, fecha, comprobante });
    res.json(gasto);
});

const deleteGasto = asyncHandler(async (req, res) => {
    const gasto = await Gasto.findByPk(req.params.id);
    if (!gasto) {
        res.status(404);
        throw new Error("Gasto no encontrado");
    }
    await gasto.destroy();
    res.json({ message: "Gasto eliminado" });
});

module.exports = { getGastos, getGastoById, createGasto, updateGasto, deleteGasto };

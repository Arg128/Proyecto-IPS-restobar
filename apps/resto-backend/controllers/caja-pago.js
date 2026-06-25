const asyncHandler = require("express-async-handler");
const { Pago, Factura } = require("../models");

const getPagos = asyncHandler(async (req, res) => {
    const pagos = await Pago.findAll({ include: [Factura] });
    res.json(pagos);
});

const getPagoById = asyncHandler(async (req, res) => {
    const pago = await Pago.findByPk(req.params.id, { include: [Factura] });
    if (!pago) {
        res.status(404);
        throw new Error("Pago no encontrado");
    }
    res.json(pago);
});

const createPago = asyncHandler(async (req, res) => {
    const { monto, metodo_pago, referencia } = req.body;
    const pago = await Pago.create({ monto, metodo_pago, referencia });
    res.status(201).json(pago);
});

const anularPago = asyncHandler(async (req, res) => {
    const pago = await Pago.findByPk(req.params.id);
    if (!pago) {
        res.status(404);
        throw new Error("Pago no encontrado");
    }
    pago.estado = "anulado";
    await pago.save();
    res.json(pago);
});

module.exports = { getPagos, getPagoById, createPago, anularPago };

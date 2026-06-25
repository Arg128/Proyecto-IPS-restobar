const asyncHandler = require("express-async-handler");
const { Factura, Pago } = require("../models");
const { Op } = require("sequelize");

const getFacturas = asyncHandler(async (req, res) => {
    const { tipo, desde, hasta } = req.query;
    const where = {};

    if (tipo) where.tipo = tipo;
    if (desde && hasta) {
        where.createdAt = {
            [Op.between]: [
                new Date(desde),
                new Date(hasta),
            ],
        };
    }

    const facturas = await Factura.findAll({ where, include: [Pago] });
    res.json(facturas);
});

const getFacturaById = asyncHandler(async (req, res) => {
    const factura = await Factura.findByPk(req.params.id, { include: [Pago] });
    if (!factura) {
        res.status(404);
        throw new Error("Factura no encontrada");
    }
    res.json(factura);
});

const createFactura = asyncHandler(async (req, res) => {
    const { tipo, cliente_nombre, cliente_ruc, subtotal, pago_id } = req.body;

    const igv = parseFloat((subtotal * 0.18).toFixed(2));
    const total = parseFloat((subtotal + igv).toFixed(2));

    const count = await Factura.count();
    const numero = `${tipo === "factura" ? "F" : "B"}001-${String(count + 1).padStart(6, "0")}`;

    const factura = await Factura.create({
        tipo,
        numero,
        cliente_nombre,
        cliente_ruc,
        subtotal,
        igv,
        total,
        pago_id,
    });

    res.status(201).json(factura);
});

module.exports = { getFacturas, getFacturaById, createFactura };

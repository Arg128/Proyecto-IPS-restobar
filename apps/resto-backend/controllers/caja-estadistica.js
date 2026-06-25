const asyncHandler = require("express-async-handler");
const { Pago, Factura, Gasto } = require("../models");
const { Op, fn, col, literal } = require("sequelize");

const getIngresos = asyncHandler(async (req, res) => {
    const { periodo } = req.query;

    let formato;
    if (periodo === "dia") formato = "%Y-%m-%d";
    else if (periodo === "semana") formato = "%Y-%u";
    else if (periodo === "mes") formato = "%Y-%m";
    else formato = "%Y";

    const ingresos = await Pago.findAll({
        attributes: [
            [fn("DATE_FORMAT", col("createdAt"), formato), "periodo"],
            [fn("SUM", col("monto")), "total"],
            [fn("COUNT", col("id")), "cantidad"],
        ],
        where: { estado: "completado" },
        group: [literal("periodo")],
        order: [[literal("periodo"), "ASC"]],
    });

    res.json(ingresos);
});

const getMetodosPago = asyncHandler(async (req, res) => {
    const metodos = await Pago.findAll({
        attributes: [
            "metodo_pago",
            [fn("COUNT", col("id")), "cantidad"],
            [fn("SUM", col("monto")), "total"],
        ],
        where: { estado: "completado" },
        group: ["metodo_pago"],
    });

    res.json(metodos);
});

const getResumenGastos = asyncHandler(async (req, res) => {
    const gastos = await Gasto.findAll({
        attributes: [
            "categoria",
            [fn("SUM", col("monto")), "total"],
            [fn("COUNT", col("id")), "cantidad"],
        ],
        group: ["categoria"],
    });

    res.json(gastos);
});

const getResumenGeneral = asyncHandler(async (req, res) => {
    const { periodo } = req.query;

    let fechaDesde = null;
    const ahora = new Date();

    if (periodo === "hoy") {
        fechaDesde = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
    } else if (periodo === "semana") {
        fechaDesde = new Date();
        fechaDesde.setDate(ahora.getDate() - 7);
    } else if (periodo === "mes") {
        fechaDesde = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    } else if (periodo === "año") {
        fechaDesde = new Date(ahora.getFullYear(), 0, 1);
    }

    const whereClausePago = fechaDesde
        ? { estado: "completado", createdAt: { [Op.gte]: fechaDesde } }
        : { estado: "completado" };

    const whereClauseGasto = fechaDesde
        ? { createdAt: { [Op.gte]: fechaDesde } }
        : {};

    const totalIngresos = await Pago.sum("monto", { where: whereClausePago });
    const totalGastos = await Gasto.sum("monto", { where: whereClauseGasto });
    const totalFacturas = await Factura.count();
    const totalPagos = await Pago.count({ where: whereClausePago });

    res.json({
        totalIngresos: totalIngresos || 0,
        totalGastos: totalGastos || 0,
        ganancia: (totalIngresos || 0) - (totalGastos || 0),
        totalFacturas,
        totalPagos,
    });
});

module.exports = { getIngresos, getMetodosPago, getResumenGastos, getResumenGeneral };

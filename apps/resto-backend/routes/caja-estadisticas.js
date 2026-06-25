const express = require("express");
const router = express.Router();
const { getIngresos, getMetodosPago, getResumenGastos, getResumenGeneral } = require("../controllers/caja-estadistica");

router.get("/ingresos", getIngresos);
router.get("/metodos-pago", getMetodosPago);
router.get("/gastos", getResumenGastos);
router.get("/resumen", getResumenGeneral);

module.exports = router;

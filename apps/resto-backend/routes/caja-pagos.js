const express = require("express");
const router = express.Router();
const { getPagos, getPagoById, createPago, anularPago } = require("../controllers/caja-pago");

router.get("/", getPagos);
router.get("/:id", getPagoById);
router.post("/", createPago);
router.put("/:id/anular", anularPago);

module.exports = router;

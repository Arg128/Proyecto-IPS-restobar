const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { obtenerPedidosPendientes } = require("../controllers/coccion-pedidos");

router.get("/", protect, obtenerPedidosPendientes);

module.exports = router;

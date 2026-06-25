const express = require("express");
const router = express.Router();
const {
    getPedidos,
    getPedidoById,
    createPedido,
    updateEstado,
    pagarPedido,
} = require("../controllers/delivery-pedidoController");

router.get("/", getPedidos);
router.get("/:id", getPedidoById);
router.post("/", createPedido);
router.put("/:id/estado", updateEstado);
router.put("/:id/pagar", pagarPedido);

module.exports = router;

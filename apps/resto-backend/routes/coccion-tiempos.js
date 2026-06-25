const express = require("express");
const router = express.Router();
const {
    obtenerTiempos,
    actualizarTiempo,
    obtenerEventosDeProducto,
    configurarEventos,
    obtenerProductos,
} = require("../controllers/coccion-tiempos");

router.get("/", obtenerTiempos);
router.get("/productos", obtenerProductos);
router.put("/:productId", actualizarTiempo);
router.get("/:productId/eventos", obtenerEventosDeProducto);
router.post("/:productId/eventos", configurarEventos);

module.exports = router;

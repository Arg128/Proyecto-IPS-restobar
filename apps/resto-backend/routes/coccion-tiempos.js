const express = require("express");
const router = express.Router();
const {
    obtenerTiempos,
    actualizarTiempo,
    obtenerEventosDeProducto,
    configurarEventos,
    obtenerProductos,
} = require("../controllers/coccion-tiempos");

const noCache = (req, res, next) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    next();
};

router.get("/", noCache, obtenerTiempos);
router.get("/productos", noCache, obtenerProductos);
router.put("/:productId", actualizarTiempo);
router.get("/:productId/eventos", obtenerEventosDeProducto);
router.post("/:productId/eventos", configurarEventos);
router.put("/:productId/eventos", configurarEventos);

module.exports = router;

const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
    obtenerRecetas,
    obtenerRecetaDeProducto,
    guardarReceta,
    subirCSV,
} = require("../controllers/coccion-receta");

const upload = multer({ storage: multer.memoryStorage() });

router.get("/", obtenerRecetas);
router.get("/:productId", obtenerRecetaDeProducto);
router.post("/:productId", guardarReceta);
router.post("/importar/csv", upload.single("archivo"), subirCSV);

module.exports = router;

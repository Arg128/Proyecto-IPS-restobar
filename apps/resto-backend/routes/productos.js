const express = require("express");
const router = express.Router();
const multer = require("multer");
const { protect } = require("../middleware/authMiddleware");
const {
    importarProductosCSV,
    listarProductos,
    listarCategorias,
} = require("../controllers/productos");

const upload = multer({ storage: multer.memoryStorage() });

router.get("/", protect, listarProductos);
router.get("/categorias", protect, listarCategorias);
router.post("/importar/csv", protect, upload.single("archivo"), importarProductosCSV);

module.exports = router;

const express = require("express");
const router = express.Router();
const multer = require("multer");
const { protect } = require("../middleware/authMiddleware");
const { importarProductosCSV } = require("../controllers/productos");
const { getProducts } = require("../controllers/product");
const { getCategories } = require("../controllers/category");

const upload = multer({ storage: multer.memoryStorage() });

router.get("/", protect, (req, res, next) => {
    req.query.all = "true";
    getProducts(req, res, next);
});
router.get("/categorias", protect, (req, res, next) => {
    req.query.all = "true";
    getCategories(req, res, next);
});
router.post("/importar/csv", protect, upload.single("archivo"), importarProductosCSV);

module.exports = router;

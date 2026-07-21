const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
} = require("../controllers/product");

const multer = require("multer");
const { importarProductosCSV } = require("../controllers/productos");
const { getCategories } = require("../controllers/category");

const upload = multer({ storage: multer.memoryStorage() });

const { runValidation } = require("../validators");
const { productCreateValidator } = require("../validators/product");

router
    .route("/")
    .get(protect, (req, res, next) => {
    req.query.all = "true";
    getProducts(req, res, next);
    })
    .post(protect, productCreateValidator, runValidation, createProduct)
    .get(protect, getProducts);

router
    .route("/:id")
    .get(protect, getProduct)
    .put(protect, updateProduct)
    .delete(protect, deleteProduct);


router.get("/categorias", protect, (req, res, next) => {
    req.query.all = "true";
    getCategories(req, res, next);
});
router.post("/importar/csv", protect, upload.single("archivo"), importarProductosCSV);

module.exports = router;

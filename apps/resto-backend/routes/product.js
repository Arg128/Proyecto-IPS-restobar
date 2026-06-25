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

const { runValidation } = require("../validators");
const { productCreateValidator } = require("../validators/product");

router
    .route("/")
    .post(protect, productCreateValidator, runValidation, createProduct)
    .get(protect, getProducts);

router
    .route("/:id")
    .get(protect, getProduct)
    .put(protect, updateProduct)
    .delete(protect, deleteProduct);

module.exports = router;

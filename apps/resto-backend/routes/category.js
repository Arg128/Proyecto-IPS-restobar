const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    createCategory,
    getCategory,
    getCategories,
    updateCategory,
    deleteCategory,
} = require("../controllers/category");

const { categoryCreateValidator } = require("../validators/category");
const { runValidation } = require("../validators");

router
    .route("/")
    .get(protect, getCategories)
    .post(protect, categoryCreateValidator, runValidation, createCategory);

router
    .route("/:id")
    .get(protect, getCategory)
    .put(protect, updateCategory)
    .delete(protect, deleteCategory);

module.exports = router;

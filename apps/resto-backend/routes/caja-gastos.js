const express = require("express");
const router = express.Router();
const { getGastos, getGastoById, createGasto, updateGasto, deleteGasto } = require("../controllers/caja-gasto");

router.get("/", getGastos);
router.get("/:id", getGastoById);
router.post("/", createGasto);
router.put("/:id", updateGasto);
router.delete("/:id", deleteGasto);

module.exports = router;

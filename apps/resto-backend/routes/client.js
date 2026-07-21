const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    registerClient,
    loginClient,
    createClient,
    getClients,
    getClient,
    updateClient,
    deleteClient,
} = require("../controllers/client");

const { runValidation } = require("../validators");
const {
    clientRegisterValidator,
    clientSigninValidator,
    clientCreateValidator,
} = require("../validators/client");

router.post("/register", clientRegisterValidator, runValidation, registerClient);
router.post("/login", clientSigninValidator, runValidation, loginClient);

router
    .route("/")
    .post(protect, clientCreateValidator, runValidation, createClient)
    .get(protect, getClients);

router
    .route("/:id")
    .get(protect, getClient)
    .put(protect, updateClient)
    .delete(protect, deleteClient);

module.exports = router;

const express = require("express");
const { loginCocina } = require("../controllers/coccion-user");
const router = express.Router();
const { runValidation } = require("../validators");
const { userSigninValidator } = require("../validators/user");

router.post("/login", userSigninValidator, runValidation, loginCocina);

module.exports = router;

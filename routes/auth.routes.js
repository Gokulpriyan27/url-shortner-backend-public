const express = require("express");
const { register,activateAccount, login, logout } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register",register);


router.get("/activate/:activationtoken",activateAccount);

router.post("/login",login)

router.get("/logout",logout)

module.exports = router;
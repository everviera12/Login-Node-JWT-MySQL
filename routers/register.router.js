const express = require("express");
const router = express.Router();
const connection = require("../database/db.mysql");
const authController = require("../controller/auth.controller");

// rutas para las vistas
router.get("/register", (req, res) => {
  res.render("register.ejs");
});

// rutas para los metodos del conrtolador
router.post("/register", authController.register);

module.exports = router;

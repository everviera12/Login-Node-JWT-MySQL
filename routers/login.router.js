const express = require("express");
const router = express.Router();
const connection = require("../database/db.mysql");
const authController = require("../controller/auth.controller");

// rutas para las vistas
router.get("/", (req, res) => {
  res.render("login.ejs", { alert: false });
});

// rutas para los metodos del conrtolador
router.post("/login", authController.login);

module.exports = router;

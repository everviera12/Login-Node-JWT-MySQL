const express = require("express");
const router = express.Router();
const connection = require("../database/db.mysql");
const authController = require("../controller/auth.controller");

// rutas para las vistas
// router.get("/dashboard",  (req, res) => {
//   res.render("dashboard.ejs", { alert: false });
// });

// rutas para los metodos del conrtolador
// router.get("/logout", authController.logout);





router.get("/dashboard", authController.idAuthenticated, (req, res) => {
  // Esta sería una ruta protegida que solo se alcanzaría si el usuario está autenticado
  res.render("dashboard.ejs");
});
router.get("/logout", authController.logout);

module.exports = router;

const jsonwebtoken = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const connection = require("../database/db.mysql");
const { promisify } = require("util");

// procedimiento para registrar
exports.register = async (req, res) => {
  try {
    // constante con los datos de la db
    const userData = {
      name: req.body.name,
      last_name_1: req.body.last_name_1,
      last_name_2: req.body.last_name_2,
      user_name: req.body.user_name,
      user_pass: req.body.user_pass,
    };

    // hash de la password
    userData.user_pass = await bcryptjs.hash(userData.user_pass, 8);

    connection.query(
      "INSERT INTO userData SET ?", // query para insertar los datos
      userData, // objeto con los datos de la db
      (error, results) => {
        if (error) {
          console.error("Error en el registro", error);
          return res.status(500).json({ error: "Error en el registro" });
        }

        // Si la operación de registro es exitosa muestra en consola los datos
        console.log(
          "Registro exitoso. Datos del usuario: " +
            JSON.stringify(
              {
                name: userData.name,
                last_name_1: userData.last_name_1,
                last_name_2: userData.last_name_2,
                user_name: userData.user_name,
              },
              null,
              2
            )
        );

        // reedirecciona a la ruta raiz cuando se generan los datos
        res.redirect("/");
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// procedimiento para login
exports.login = async (req, res) => {
  try {
    const userLogin = {
      user_name: req.body.user_name,
      user_pass: req.body.user_pass,
    };

    if (!userLogin.user_name || !userLogin.user_pass) {
      res.render("login", {
        alert: true,
        alertIcon: "warning",
        alertTitle: "Advertencia",
        alertMessage: "Inserta usuario/password",
        confirmationButton: false,
        timer: 1500, // Duración en milisegundos
        ruta: " ",
      });
    } else {
      connection.query(
        "SELECT * FROM userData WHERE user_name = ?",
        [userLogin.user_name],
        async (error, results) => {
          if (
            results.length == 0 ||
            !(await bcryptjs.compare(userLogin.user_pass, results[0].user_pass))
          ) {
            console.log(error);
            res.render("login", {
              alert: true,
              alertIcon: "error",
              alertTitle: "Error",
              alertMessage: "usuario y/o password incorrectos",
              confirmationButton: true,
              timer: 3500, // Duración en milisegundos
              ruta: "",
            });
          } else {
            const id = results[0].id_user;
            const token = jsonwebtoken.sign(
              { id_user: id },
              process.env.JWT_SECRETO,
              {
                expiresIn: process.env.JWT_TEMP_EX,
              }
            );

            console.log(
              "TOKEN " + token + " para el USUARIO " + userLogin.user_name
            );

            const cookieOptions = {
              expires: new Date(
                Date.now() + process.env.JWT_COOKIE_EX * 24 * 60 * 60 * 1000
              ),
              httpOnly: true,
            };
            res.cookie("jwtEver", token, cookieOptions);
            res.render("login", {
              alert: true,
              alertIcon: "success",
              alertTitle: "Éxito",
              alertMessage: "Inicio de sesión exitoso",
              confirmationButton: false,
              timer: 1500, // Duración en milisegundos
              ruta: "dashboard",
            });
          }
        }
      );
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// procedimiento para autenicar las credenciales
exports.idAuthenticated = async (req, res, next) => {
  if (req.cookies.jsonwebtoken) {
    try {
      const decode = await promisify(jsonwebtoken.verify)(
        req.cookies.jsonwebtoken,
        process.env.JWT_SECRETO
      );

      connection.query(
        "SELECT * FROM userData WHERE id = ?",
        [decode.id],
        (error, results) => {
          if (error) {
            console.error("Error en la consulta a la base de datos:", error);
            return res.status(500).json({ error: "Error en el servidor" });
          }
          if (results.length === 0) {
            return res.status(401).json({ error: "Usuario no autorizado" });
          }
          req.user_name = results[0];
          return next();
        }
      );
    } catch (error) {
      console.error("\x1b[31mCATCH ERROR", error, "\x1b[0m");
      res.status(500).json({ error: "Error en el servidor" });
    }
  } else {
    res.redirect("/");
  }
};

// logout
exports.logout = (req, res) => {
  res.clearCookie("jwtEver");
  return res.redirect("/");
};

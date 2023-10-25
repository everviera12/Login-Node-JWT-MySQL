const express = require("express"); // Importamos el módulo 'express'
const dotenv = require("dotenv");  // Importamos el módulo 'dotenv' para cargar variables de entorno
const cookieParser = require("cookie-parser"); // Importamos el módulo 'cookieParser' para gestionar cookies en solicitudes HTTP.


const app = express(); // Creamos una instancia de la aplicación Express.


app.set("view engine", "ejs"); // Configuración del motor de vistas EJS


app.use(express.static("public")); // Configuración para servir archivos estáticos desde la carpeta "public"


// Middleware para analizar datos de formularios con codificación URL y JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


dotenv.config({ path: "./env/.env" }); // Carga variables de entorno desde el archivo


// Middleware para gestionar cookies
app.use(cookieParser());


app.use("/", require("./routers/login.router")); // Configuramos ruta principal para utilizar las rutas definidas en el archivo "login.router".
app.use("/", require("./routers/register.router")); // Configuramos ruta principal para utilizar las rutas definidas en el archivo "register.router".



// app.use((req, res, next) => {
//   res.setHeader(
//     "Content-Security-Policy",
//     "font-src 'self' http://localhost:3000;"
//   );
//   next();
// });


// Inicia el servidor en el puerto 3000
app.listen(3000, () => {
  console.log("SERVER ON http://127.0.0.1:3000");
});


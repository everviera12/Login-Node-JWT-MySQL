const mysql = require("mysql");

const connection = mysql.createConnection({
  host: process.env.MYSQL_ADDON_HOST,
  database: process.env.MYSQL_ADDON_DB,
  user: process.env.MYSQL_ADDON_USER,
  password: process.env.MYSQL_ADDON_PASSWORD,
});

try {
  connection.connect((err) => {
    if (err) {
      console.log("\x1b[31mTYPE OF ERROR", err, "\x1b[0m");
    } else {
      console.log("\x1b[34mMYSQL DATABASE CONNECTED\x1b[0m");
    }
  });
} catch (error) {
  console.error("\x1b[31mCATCH ERROR", error, "\x1b[0m");
}

module.exports = connection;

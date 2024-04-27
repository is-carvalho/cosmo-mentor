const mysql = require("mysql");

//configurando conexão para que possa acessar o usuario e o banco de dados
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

connection.connect(function (err) {
  if (!err) {
    console.log("Banco de dados conectado...");
  } else {
    console.log("Error" + err);
  }
});

module.exports = connection;

const mysql = require("mysql");
require("dotenv").config();
const logger = require("./logger");

const method_name = "db";

var conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

conn.connect((err) => {
  if (err) {
    logger("Error connecting to Db", "???API_KEY???", method_name);
    console.log("Error connecting to Db");
    return;
  }
  console.log("Connection established");
});

module.exports = conn;

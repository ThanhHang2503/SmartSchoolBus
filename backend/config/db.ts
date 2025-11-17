import mysql = require("mysql2/promise");

export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "SSB",
  port: 3306,
});

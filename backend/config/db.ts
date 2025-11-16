import mysql = require("mysql2/promise");

export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "SSB",
  port: 3306,
});

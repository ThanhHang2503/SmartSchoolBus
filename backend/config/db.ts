import mysql = require("mysql2/promise");

export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123456", 
  database: "SSB",
  port: 3306,
});

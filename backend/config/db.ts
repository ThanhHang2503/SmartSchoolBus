import mysql = require("mysql2/promise");

export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",  
  database: "SSB",
  port: 3306,
});

//Kiểm tra kết nối
pool.query("SELECT DATABASE()").then(([rows]) => {
  console.log("Connected to DB:", rows);
});

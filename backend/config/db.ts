import mysql = require("mysql2/promise");

export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",  
  database: "SSB",
  port: 3306,
});

// export const pool = mysql.createPool({
//   host: "trolley.proxy.rlwy.net",
//   user: "root",
//   password: "YAdwdffgCPYQBGnGWuAUxYTIKBfQmdTc",  
//   database: "railway",
//   port: 40305,
// });

// Hàm thực hiện query
export const executeQuery = async (query: string, params: any[] = []) => {
  const [rows] = await pool.execute(query, params);
  return rows;
};

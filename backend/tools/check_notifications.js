const mysql = require('mysql2/promise');
(async () => {
  try {
    const pool = await mysql.createPool({ host: 'localhost', user: 'root', password: '', database: 'SSB', port: 3306 });
    const [tbRows] = await pool.query('SELECT * FROM ThongBao ORDER BY MaTB DESC LIMIT 20');
    const [ctRows] = await pool.query('SELECT * FROM CTTB ORDER BY ThoiGian DESC LIMIT 40');
    await pool.end();
  } catch (e) {
    // Silently handle DB errors
  } finally {
    process.exit(0);
  }
})();

const mysql = require('mysql2/promise');
(async () => {
  try {
    const pool = await mysql.createPool({ host: 'localhost', user: 'root', password: '', database: 'SSB', port: 3306 });
    const [tbRows] = await pool.query('SELECT * FROM ThongBao ORDER BY MaTB DESC LIMIT 20');
    const [ctRows] = await pool.query('SELECT * FROM CTTB ORDER BY ThoiGian DESC LIMIT 40');
    console.log('=== ThongBao (last 20) ===');
    console.table(tbRows);
    console.log('\n=== CTTB (last 40) ===');
    console.table(ctRows);
    await pool.end();
  } catch (e) {
    console.error('DB error', e);
  } finally {
    process.exit(0);
  }
})();

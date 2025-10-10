import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'SSB',
});

(async () => {
  try {
    const connection = await db.getConnection();
    console.log('Kết nối MySQL thành công');
    connection.release();
  } catch (err) {
    console.error('Lỗi kết nối MySQL:', err);
  }
})();
import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app: Application = express();
app.use(cors());
app.use(express.json());

// Định tuyến cho /students đến microservice Student (port 5001)
app.use('/students', createProxyMiddleware({
  target: 'http://localhost:5001',
  changeOrigin: true,
  pathRewrite: { '^/students': '' },
 
}));

// Route mặc định cho "/"
app.get('/', (req: Request, res: Response) => {
  res.send('API Gateway running - Access /students');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT} at ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`);
});
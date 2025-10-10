import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import busRoutes from './routes/busRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();
app.use(cors());
app.use(express.json());

// Route test
app.get('/', (req, res) => res.send('SmartSchoolBus API running'));

// Route cho xe buýt
app.use('/api/buses', busRoutes);

// Middleware xử lý lỗi
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Đã xảy ra lỗi server' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
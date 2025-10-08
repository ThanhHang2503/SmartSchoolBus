import express, { Request, Response, Application } from 'express';
import cors from 'cors'; // Đã cài đặt từ bước trước

const app: Application = express();
app.use(cors());
app.use(express.json());

// Định nghĩa route cho "/"
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

// Route cho API buses (nếu đã có)
interface Bus {
  id: number;
  name: string;
}

const buses: Bus[] = [{ id: 1, name: 'Bus A' }];

app.get('/api/buses', (req: Request, res: Response) => {
  res.json({ buses });
});

const PORT = 5000; // Đảm bảo cổng khớp với localhost:5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
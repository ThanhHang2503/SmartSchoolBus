import bodyParser from "body-parser";
import express from "express";
import busRoutes from "./bus/routes/busRoutes";
import studentRoutes from "./student/routes/studentRoutes";
import cors from 'cors';


const app = express();
// cors chạy ngay khi vừa khởi động app , nhận cổng frontend
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(bodyParser.json());

app.use("/buses", busRoutes);
app.use("/students", studentRoutes);
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

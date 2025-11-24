import cors from "cors";
import express from "express";

import accountRoutes from "./account/routes/accountRoutes";
import adminRoutes from "./admin/routes/adminRoutes";
import busRoutes from "./bus/routes/busRoutes";
import driverRoutes from "./driver/routes/driverRoutes";
import noticeRoutes from "./notice/routes/noticeRoutes";
import parentRoutes from "./parent/routes/parentRoutes";
import routeRoutes from "./route/routes/routeRoutes";
import stopRoutes from "./stop/routes/stopRoutes";
import statsRoutes from "./stats/routes/statsRoutes";
import studentRoutes from "./student/routes/studentRoutes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));


app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ĐĂNG KÝ CÁC ROUTE
app.use("/account", accountRoutes);
app.use("/admin", adminRoutes);
app.use("/buses", busRoutes);
app.use("/driver", driverRoutes);
app.use("/parent", parentRoutes);
app.use("/students", studentRoutes);

//PHU HUYNH
app.use("/parent", parentRoutes);

//LAY SO CHUYEN
app.use("/stats", statsRoutes);

//TUYEN DUONG
app.use("/route", routeRoutes);

// TRẠM DỪNG
app.use("/stop", stopRoutes);

//thong bao
app.use("/notice", noticeRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`SSB 1.0 Backend đang chạy tại http://localhost:${PORT}`);
});

import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import accountRoutes from "./account/routes/accountRoutes";
import adminRoutes from "./admin/routes/adminRoutes";
import busRoutes from "./bus/routes/busRoutes";
import driverRoutes from "./driver/routes/driverRoutes";
import parenttRoutes from "./parent/routes/parentRoutes";
// import routerRoutes from "./route/routes/routeRoutes";
import studentRoutes from "./student/routes/studentRoutes";
// import Layout from './../frontend/src/components/Layout';

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(bodyParser.json());

app.use("/buses", busRoutes);
app.use("/students", studentRoutes);

//TAI KHOAN
app.use("/account", accountRoutes);

//QUAN LY
app.use("/admin", adminRoutes);

//TAI XE
app.use("/driver", driverRoutes);

//PHU HUYNH
app.use("/parent", parenttRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

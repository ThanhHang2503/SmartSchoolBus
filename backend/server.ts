import bodyParser from "body-parser";
import express from "express";
import busRoutes from "./bus/routes/busRoutes";
import studentRoutes from "./student/routes/studentRoutes";
import routerRoutes from "./route/routes/routeRoutes";

const app = express();
app.use(bodyParser.json());

app.use("/buses", busRoutes);
app.use("/students", studentRoutes);
app.use("/routers", routerRoutes);
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import bodyParser from "body-parser";
import express from "express";
import busRoutes from "./bus/routes/busRoutes";

const app = express();
app.use(bodyParser.json());

app.use("/buses", busRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
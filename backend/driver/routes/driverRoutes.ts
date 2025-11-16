import express from "express";
import { getDrivers, getDriver } from "../controllers/driverController";

const router = express.Router();

router.get("/", getDrivers);
router.get("/:id", getDriver);

export default router;

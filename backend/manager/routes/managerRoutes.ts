import express from "express";
import { getManagers, getManager } from "../controllers/managerController";

const router = express.Router();

// 📌 GET /manager → lấy tất cả
router.get("/", getManagers);

// 📌 GET /manager/:id → lấy theo ID
router.get("/:id", getManager);

export default router;

import express from "express";
import { getBuses, getBus } from "../controllers/busController";

const router = express.Router();

router.get("/", getBuses);
router.get("/:id", getBus);

export default router;

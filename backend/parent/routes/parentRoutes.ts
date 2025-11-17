// backend/parent/parentRoutes.ts
import express from "express";
import { getParents, getParent } from "../controllers/parentController";

const router = express.Router();

router.get("/", getParents); // GET /parents
router.get("/:id", getParent); // GET /parents/:id

export default router;
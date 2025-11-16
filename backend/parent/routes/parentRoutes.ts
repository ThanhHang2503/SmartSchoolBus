import express from "express";
import { getParents, getParent } from "../controllers/parentController";

const router = express.Router();

router.get("/", getParents);
router.get("/:id", getParent);

export default router;

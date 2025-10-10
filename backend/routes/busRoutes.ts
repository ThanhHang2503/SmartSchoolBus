import express from "express";
import {
  getBuses,
  getBus,
  addBus,
  editBus,
  removeBus,
} from "../controllers/busController";

const router = express.Router();

router.get("/", getBuses);
router.get("/:id", getBus);
router.post("/", addBus);
router.put("/:id", editBus);
router.delete("/:id", removeBus);

export default router;

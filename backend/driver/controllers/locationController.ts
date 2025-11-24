import { Request, Response } from "express";
import { setDriverPosition, getDriverPosition } from "../locationStore";

// POST /driver/location
export const updateDriverLocation = (req: Request, res: Response) => {
  try {
    const { driverId, latitude, longitude } = req.body;
    if (!driverId || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ success: false, message: "driverId, latitude, longitude required" });
    }
    const id = Number(driverId);
    setDriverPosition(id, Number(latitude), Number(longitude));
    return res.json({ success: true });
  } catch (err) {
    console.error("updateDriverLocation error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /driver/location/:driverId
export const getDriverLocation = (req: Request, res: Response) => {
  try {
    const driverId = Number(req.params.driverId);
    if (!driverId) return res.status(400).json({ success: false, message: "driverId required" });
    const pos = getDriverPosition(driverId);
    if (!pos) return res.status(404).json({ success: false, message: "Position not found" });
    return res.json({ success: true, position: pos });
  } catch (err) {
    console.error("getDriverLocation error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


import { Request, Response } from "express";
import Bus from "../models/busModel";
import { buses } from "../hardcode_data/bus"; 

// Lấy tất cả bus
export const getAllBuses = (req: Request, res: Response) => {
  res.json(buses.map((b) => b.toJSON()));
};

// Lấy bus theo id
export const getBusById = (req: Request, res: Response) => {
  const bus = buses.find((b) => b.id === req.params.id);
  if (!bus) return res.status(404).json({ message: "Bus not found" });
  res.json(bus.toJSON());
};

// Thêm bus mới
export const createBus = (req: Request, res: Response) => {
  const { id, plateNumber, capacity } = req.body;

  if (!id || !plateNumber || !capacity)
    return res.status(400).json({ message: "Missing required fields" });

  if (buses.some((b) => b.id === id))
    return res.status(400).json({ message: "Bus ID already exists" });

  const newBus = new Bus({ id, plateNumber, capacity });
  buses.push(newBus);

  res.status(201).json(newBus.toJSON());
};

// Cập nhật bus
export const updateBus = (req: Request, res: Response) => {
  const bus = buses.find((b) => b.id === req.params.id);
  if (!bus) return res.status(404).json({ message: "Bus not found" });

  const { plateNumber, capacity, status, location } = req.body;

  if (plateNumber) bus.plateNumber = plateNumber;
  if (capacity) bus.capacity = capacity;
  if (status) bus.setStatus(status);
  if (location) bus.updateLocation(location);

  res.json(bus.toJSON());
};

// Xóa bus
export const deleteBus = (req: Request, res: Response) => {
  const index = buses.findIndex((b) => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Bus not found" });

  buses.splice(index, 1);
  res.status(204).send();
};

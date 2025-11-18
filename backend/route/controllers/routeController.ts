// backend/common/controllers/routeController.ts (hoặc backend/route/controllers/routeController.ts)
import { Request, Response } from "express";
import { getAllRoutes, getRouteById } from "../models/routeModel"; // Thay đổi đường dẫn import nếu cần

export const getRoutes = async (req: Request, res: Response) => {
  try {
    const routes = await getAllRoutes();
    res.json(routes);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách Tuyến Đường:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

export const getRoute = async (req: Request, res: Response) => {
  try {
    const route = await getRouteById(Number(req.params.id));
    if (!route) return res.status(404).json({ message: "Không tìm thấy Tuyến Đường này" });
    res.json(route);
  } catch (err) {
    console.error("Lỗi khi lấy thông tin Tuyến Đường:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
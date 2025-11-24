import type { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/asyncHandler';
import { ResponseHandler } from '../../utils/responseHandler';
import * as routeModel from '../models/routeModel';

// Lấy tất cả tuyến đường
export const getAllRoutes = asyncHandler(async (req: Request, res: Response) => {
  const routes = await routeModel.getAllRoutes();
  ResponseHandler.success(res, routes, 'Lấy danh sách tuyến đường thành công');
});

// Lấy tuyến đường theo ID
export const getRouteById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const route = await routeModel.getRouteById(id);
  
  if (!route) {
    return ResponseHandler.notFound(res, 'Không tìm thấy tuyến đường');
  }
  
  ResponseHandler.success(res, route, 'Lấy tuyến đường thành công');
});

// Lấy tuyến đường với danh sách trạm
export const getRouteWithStops = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const route = await routeModel.getRouteWithStops(id);
  
  if (!route) {
    return ResponseHandler.notFound(res, 'Không tìm thấy tuyến đường');
  }
  
  ResponseHandler.success(res, route, 'Lấy tuyến đường với danh sách trạm thành công');
});

// Tạo tuyến đường mới
export const addRoute = asyncHandler(async (req: Request, res: Response) => {
  const { NoiBatDau, NoiKetThuc, VanTocTB, DoDai } = req.body;
  
  if (!NoiBatDau || !NoiKetThuc || !VanTocTB || !DoDai) {
    return ResponseHandler.badRequest(res, 'Thiếu thông tin bắt buộc');
  }
  
  const maTD = await routeModel.createRoute({ NoiBatDau, NoiKetThuc, VanTocTB, DoDai });
  ResponseHandler.success(res, { MaTD: maTD }, 'Tạo tuyến đường thành công', 201);
});

// Thêm trạm vào tuyến đường
export const addStopToRoute = asyncHandler(async (req: Request, res: Response) => {
  const { MaTram, MaTD, ThuTuDung } = req.body;
  
  if (!MaTram || !MaTD || !ThuTuDung) {
    return ResponseHandler.badRequest(res, 'Thiếu thông tin bắt buộc');
  }
  
  await routeModel.addStopToRoute({ MaTram, MaTD, ThuTuDung });
  ResponseHandler.success(res, null, 'Thêm trạm vào tuyến đường thành công', 201);
});

// Cập nhật tuyến đường
export const updateRoute = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { NoiBatDau, NoiKetThuc, VanTocTB, DoDai } = req.body;
  
  const updated = await routeModel.updateRoute(id, { NoiBatDau, NoiKetThuc, VanTocTB, DoDai });
  
  if (!updated) {
    return ResponseHandler.notFound(res, 'Không tìm thấy tuyến đường');
  }
  
  ResponseHandler.success(res, null, 'Cập nhật tuyến đường thành công');
});

// Xóa trạm khỏi tuyến đường
export const removeStopFromRoute = asyncHandler(async (req: Request, res: Response) => {
  const { maTD, maTram } = req.params;
  
  const deleted = await routeModel.removeStopFromRoute(parseInt(maTD), parseInt(maTram));
  
  if (!deleted) {
    return ResponseHandler.notFound(res, 'Không tìm thấy trạm trong tuyến đường');
  }
  
  ResponseHandler.success(res, null, 'Xóa trạm khỏi tuyến đường thành công');
});

// Xóa tuyến đường
export const deleteRoute = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  
  const deleted = await routeModel.deleteRoute(id);
  
  if (!deleted) {
    return ResponseHandler.notFound(res, 'Không tìm thấy tuyến đường');
  }
  
  ResponseHandler.success(res, null, 'Xóa tuyến đường thành công');
});
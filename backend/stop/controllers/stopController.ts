import type { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/asyncHandler';
import { ResponseHandler } from '../../utils/responseHandler';
import * as stopModel from '../models/stopModel';

// Lấy tất cả trạm dừng
export const getAllStops = asyncHandler(async (req: Request, res: Response) => {
  const stops = await stopModel.getAllStops();
  ResponseHandler.success(res, stops, 'Lấy danh sách trạm dừng thành công');
});

// Lấy trạm dừng theo ID
export const getStopById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id!);
  const stop = await stopModel.getStopById(id);
  
  if (!stop) {
    return ResponseHandler.notFound(res, 'Không tìm thấy trạm dừng');
  }
  
  ResponseHandler.success(res, stop, 'Lấy trạm dừng thành công');
});

// Tạo trạm dừng mới
export const createStop = asyncHandler(async (req: Request, res: Response) => {
  const { TenTram, DiaChi, KinhDo, ViDo } = req.body;
  
  if (!TenTram || !DiaChi || KinhDo === undefined || ViDo === undefined) {
    return ResponseHandler.badRequest(res, 'Thiếu thông tin bắt buộc');
  }
  
  const maTram = await stopModel.createStop({ TenTram, DiaChi, KinhDo, ViDo });
  ResponseHandler.success(res, { MaTram: maTram }, 'Tạo trạm dừng thành công', 201);
});

// Cập nhật trạm dừng
export const updateStop = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id!);
  const { TenTram, DiaChi, KinhDo, ViDo } = req.body;
  
  const updated = await stopModel.updateStop(id, { TenTram, DiaChi, KinhDo, ViDo });
  
  if (!updated) {
    return ResponseHandler.notFound(res, 'Không tìm thấy trạm dừng');
  }
  
  ResponseHandler.success(res, null, 'Cập nhật trạm dừng thành công');
});

// Xóa trạm dừng
export const deleteStop = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id!);
  
  const deleted = await stopModel.deleteStop(id);
  
  if (!deleted) {
    return ResponseHandler.notFound(res, 'Không tìm thấy trạm dừng');
  }
  
  ResponseHandler.success(res, null, 'Xóa trạm dừng thành công');
});

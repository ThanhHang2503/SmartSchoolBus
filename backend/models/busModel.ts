import { db } from "../config/db";

export interface Bus {
  MaXe?: number;
  BienSo: string;
  SoCho: number;
  TinhTrang?: number;
  MaQL?: number;
}

// Kiểm tra MaQL tồn tại
const checkManagerExists = async (MaQL: number | null): Promise<boolean> => {
  if (!MaQL) return true; // MaQL có thể null
  const [rows]: any = await db.query("SELECT 1 FROM QuanLy WHERE MaQL = ?", [MaQL]);
  return rows.length > 0;
};

// Lấy tất cả bus
export const getAllBuses = async (): Promise<Bus[]> => {
  const [rows] = await db.query("SELECT * FROM XeBus");
  return rows as Bus[];
};

// Lấy 1 bus theo ID
export const getBusById = async (id: number): Promise<Bus | null> => {
  const [rows]: any = await db.query("SELECT * FROM XeBus WHERE MaXe = ?", [id]);
  return rows.length ? rows[0] : null;
};

// Thêm bus
export const createBus = async (bus: Bus): Promise<number> => {
  const { BienSo, SoCho, TinhTrang = 1, MaQL = null } = bus;
  if (!BienSo || !SoCho) throw new Error("Biển số và số chỗ là bắt buộc");
  if (!(await checkManagerExists(MaQL))) throw new Error("Quản lý không tồn tại");
  try {
    const [result]: any = await db.query(
      "INSERT INTO XeBus (BienSo, SoCho, TinhTrang, MaQL) VALUES (?, ?, ?, ?)",
      [BienSo, SoCho, TinhTrang, MaQL]
    );
    return result.insertId;
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") throw new Error("Biển số đã tồn tại");
    throw error;
  }
};

// Cập nhật bus
export const updateBus = async (id: number, bus: Partial<Bus>): Promise<boolean> => {
  if (bus.MaQL && !(await checkManagerExists(bus.MaQL))) throw new Error("Quản lý không tồn tại");
  try {
    const [result]: any = await db.query("UPDATE XeBus SET ? WHERE MaXe = ?", [bus, id]);
    return result.affectedRows > 0;
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") throw new Error("Biển số đã tồn tại");
    throw error;
  }
};

// Xóa bus
export const deleteBus = async (id: number): Promise<boolean> => {
  const [result]: any = await db.query("DELETE FROM XeBus WHERE MaXe = ?", [id]);
  return result.affectedRows > 0;
};
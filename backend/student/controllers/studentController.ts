import { Request, Response } from "express";
import {
  getAllStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent,
} from "../models/studentModel";

export const getStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const students = await getAllStudents();
    res.json(students);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách học sinh:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const getStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const student = await getStudentById(id);
    if (!student) {
      res.status(404).json({ message: "Không tìm thấy học sinh" });
      return;
    }
    res.json(student);
  } catch (err) {
    console.error("Lỗi khi lấy học sinh:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const createStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { hoTen, ngaySinh, lop, maPH } = req.body;
    const result = await addStudent(hoTen, ngaySinh, lop, maPH);
    res.status(201).json({ success: true, id: result.id });
  } catch (err) {
    console.error("Lỗi khi thêm học sinh:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const editStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const { hoTen, ngaySinh, lop, maPH } = req.body;
    await updateStudent(id, hoTen, ngaySinh, lop, maPH);
    res.json({ success: true, message: "Cập nhật thành công" });
  } catch (err) {
    console.error("Lỗi khi cập nhật học sinh:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const removeStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    await deleteStudent(id);
    res.json({ success: true, message: "Xóa thành công" });
  } catch (err) {
    console.error("Lỗi khi xóa học sinh:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

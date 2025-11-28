// backend/student/studentController.ts
import { Request, Response } from "express";
import { getAllStudents, getStudentById } from "../models/studentModel";

export const getStudents = async (req: Request, res: Response) => {
  try {
    const students = await getAllStudents();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

export const getStudent = async (req: Request, res: Response) => {
  try {
    const student = await getStudentById(Number(req.params.id));
    if (!student) return res.status(404).json({ message: "Không tìm thấy Học sinh này" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
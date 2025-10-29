import { Request, Response } from "express";
import Student from "../models/studentModel";
import { students } from "../hardcode_data/Student";

// Lấy tất cả student
export const getAllStudents = (req: Request, res: Response) => {
  res.json(students.map((s) => s.toJSON()));
};

// Lấy student theo id
export const getStudentById = (req: Request, res: Response) => {
  const student = students.find((s) => s.id === req.params.id);
  if (!student) return res.status(404).json({ message: "Student not found" });
  res.json(student.toJSON());
};

// Thêm student mới
export const createStudent = (req: Request, res: Response) => {
  const { name, grade, pickupStop, dropStop, parentContact, notes } = req.body;

  if (!name)
    return res.status(400).json({ message: "Missing required field: name" });

  const id = `stu-0${students.length + 1}`;

  const newStudent = new Student({
    id,
    name,
    grade,
    pickupStop,
    dropStop,
    parentContact,
    notes,
  });

  students.push(newStudent);

  res.status(201).json(newStudent.toJSON());
};

// Cập nhật student
export const updateStudent = (req: Request, res: Response) => {
  const student = students.find((s) => s.id === req.params.id);
  if (!student) return res.status(404).json({ message: "Student not found" });

  const { name, grade, pickupStop, dropStop, parentContact, notes } = req.body;

  if (name) student.name = name;
  if (grade) student.grade = grade;
  if (pickupStop) student.setPickupStop(pickupStop);
  if (dropStop) student.setDropStop(dropStop);
  if (parentContact) student.parentContact = parentContact;
  if (notes) student.notes = notes;

  res.json(student.toJSON());
};

// Xóa student
export const deleteStudent = (req: Request, res: Response) => {
  const index = students.findIndex((s) => s.id === req.params.id);
  if (index === -1)
    return res.status(404).json({ message: "Student not found" });

  students.splice(index, 1);
  res.status(204).send();
};

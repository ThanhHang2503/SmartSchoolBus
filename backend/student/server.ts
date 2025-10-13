import express, { Request, Response } from 'express';
import cors from 'cors'; // Thêm cors để hỗ trợ truy cập trực tiếp nếu cần
import { Student } from '../models/Student';
import students from '../hardcode_data/students';

const app = express();
const port = 5001;

// Middleware
app.use(cors()); // Thêm CORS để hỗ trợ truy cập trực tiếp (tùy chọn)
app.use(express.json());

// GET / - Lấy danh sách tất cả học sinh
app.get('/', (req: Request, res: Response) => {
  if (!Array.isArray(students)) {
    return res.status(500).json({ error: 'Data is not an array' });
  }
  res.json(students.map(student => student.toJSON()));
});

// GET /:id - Lấy thông tin học sinh theo ID
app.get('/:id', (req: Request, res: Response) => {
  const student = students.find(s => s.id === req.params.id);
  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }
  res.json(student.toJSON());
});

// POST / - Tạo học sinh mới
app.post('/', (req: Request, res: Response) => {
  const { id, name, grade, pickupStop, dropStop, parentContact, notes } = req.body;
  if (!id || !name) {
    return res.status(400).json({ message: 'ID and name are required' });
  }
  if (students.find(s => s.id === id)) {
    return res.status(400).json({ message: 'Student ID already exists' });
  }

  const newStudent = new Student({ id, name, grade, pickupStop, dropStop, parentContact, notes });
  students.push(newStudent);
  res.status(201).json(newStudent.toJSON());
});

// PUT /:id - Cập nhật thông tin học sinh
app.put('/:id', (req: Request, res: Response) => {
  const studentIndex = students.findIndex(s => s.id === req.params.id);
  if (studentIndex === -1) {
    return res.status(404).json({ message: 'Student not found' });
  }

  const { name, grade, pickupStop, dropStop, parentContact, notes } = req.body;
  const updatedStudent = new Student({
    id: req.params.id,
    name: name || students[studentIndex].name,
    grade: grade || students[studentIndex].grade,
    pickupStop: pickupStop || students[studentIndex].pickupStop,
    dropStop: dropStop || students[studentIndex].dropStop,
    parentContact: parentContact || students[studentIndex].parentContact,
    notes: notes || students[studentIndex].notes,
  });

  students[studentIndex] = updatedStudent;
  res.json(updatedStudent.toJSON());
});

// DELETE /:id - Xóa học sinh
app.delete('/:id', (req: Request, res: Response) => {
  const studentIndex = students.findIndex(s => s.id === req.params.id);
  if (studentIndex === -1) {
    return res.status(404).json({ message: 'Student not found' });
  }

  students.splice(studentIndex, 1);
  res.status(204).send();
});

// Khởi động server
app.listen(port, () => {
  console.log(`Student service running on http://localhost:${port} at ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`);
});
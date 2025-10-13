import { Student } from '../models/Student';

const stops = [
  { id: 'stop-1', name: 'Cổng A', lat: 10.776889, lng: 106.700806 },
  { id: 'stop-2', name: 'Cổng B', lat: 10.778000, lng: 106.701000 },
];

const students: Student[] = [
  new Student({
    id: 'stu-01',
    name: 'Nguyễn Văn A',
    grade: '3A',
    pickupStop: stops[0],
    dropStop: stops[1],
    parentContact: { name: 'Nguyễn Văn Bố', phone: '0909123456' },
  }),
];

export default students;
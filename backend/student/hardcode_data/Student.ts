import Student from "../models/studentModel";

const stops = [
  { id: "stop-1", name: "Cổng A", lat: 10.776889, lng: 106.700806 },
  { id: "stop-2", name: "Cổng B", lat: 10.778, lng: 106.701 },
  { id: "stop-3", name: "Cổng C", lat: 10.779, lng: 106.702 },
];

export const students: Student[] = [
  new Student({
    id: "stu-01",
    name: "Nguyễn Văn A",
    grade: "3A",
    pickupStop: stops[0],
    dropStop: stops[1],
    parentContact: { name: "Nguyễn Văn Bố", phone: "0909123456" },
  }),
  new Student({
    id: "stu-02",
    name: "Trần Thị B",
    grade: "4B",
    pickupStop: stops[1],
    dropStop: stops[2],
    parentContact: { name: "Trần Văn Mẹ", phone: "0909789123", email: "meb@gmail.com" },
    notes: "Học sinh mới, cần theo dõi điểm đón buổi sáng.",
  }),
];

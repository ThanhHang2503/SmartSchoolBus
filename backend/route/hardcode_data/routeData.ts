import { IRoute } from '../models/routeModel'
import { IStop } from '../models/istopModel'

// Dữ liệu hardcode các điểm dừng (stop)
const stopsA: IStop[] = [
  { id: 'S1', name: 'Stop 1 - Nguyen Trai', lat: 10.762622, lng: 106.660172 },
  { id: 'S2', name: 'Stop 2 - Le Loi', lat: 10.776530, lng: 106.700981 },
  { id: 'S3', name: 'Stop 3 - Cach Mang Thang 8', lat: 10.784182, lng: 106.683502 },
]

const stopsB: IStop[] = [
  { id: 'S4', name: 'Stop 1 - Dinh Tien Hoang', lat: 10.789789, lng: 106.695454 },
  { id: 'S5', name: 'Stop 2 - Dien Bien Phu', lat: 10.799532, lng: 106.688321 },
  { id: 'S6', name: 'Stop 3 - Hai Ba Trung', lat: 10.802114, lng: 106.695780 },
]

// Dữ liệu hardcode các tuyến xe (route)
export const routes: IRoute[] = [
  {
    id: 'R001',
    name: 'Morning Route A',
    stops: stopsA,
    estimatedDurationMinutes: 45,
    distanceMeters: 12000,
    notes: 'Tuyến chạy buổi sáng cho học sinh khu trung tâm',
  },
  {
    id: 'R002',
    name: 'Afternoon Route B',
    stops: stopsB,
    estimatedDurationMinutes: 35,
    distanceMeters: 9800,
    notes: 'Tuyến chạy buổi chiều cho học sinh khu phía Bắc',
  },
  {
    id: 'R003',
    name: 'Evening Route C',
    stops: [
      { id: 'S7', name: 'Stop 1 - Phan Dang Luu', lat: 10.811523, lng: 106.682325 },
      { id: 'S8', name: 'Stop 2 - Hoang Van Thu', lat: 10.802864, lng: 106.658785 },
    ],
    estimatedDurationMinutes: 25,
    distanceMeters: 7200,
    notes: 'Tuyến ngắn buổi tối cho học sinh học thêm',
  },
]

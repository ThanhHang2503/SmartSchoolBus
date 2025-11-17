// Tuyến đường - tương ứng với bảng TuyenDuong
export interface IRoute {
  MaTD: number           // Mã tuyến đường
  NoiBatDau: string      // Nơi bắt đầu
  NoiKetThuc: string     // Nơi kết thúc
  VanTocTB: number       // Vận tốc trung bình (km/h)
  DoDai: number          // Độ dài tuyến (km)
}

// Chi tiết tuyến đường - tương ứng với bảng CTTD (các trạm đi qua)
export interface IRouteDetail {
  MaTram: number         // Mã trạm
  MaTD: number           // Mã tuyến đường
  MaTramDon: number      // Mã trạm đón
  ThuTuDung: number      // Thứ tự dừng
}

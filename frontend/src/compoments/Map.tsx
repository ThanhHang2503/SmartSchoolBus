// src/components/MyMap.tsx

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; // Cần import L cho kiểu dữ liệu
import { useGeolocation } from '../mock/mockUserLocation'; // Import hook

// Đảm bảo bạn đã import CSS và sửa lỗi icon ở trên
import 'leaflet/dist/leaflet.css';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Xóa và thiết lập lại icon mặc định
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: iconUrl,
  iconRetinaUrl: iconRetinaUrl,
  shadowUrl: shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
// --- Kết thúc phần sửa lỗi icon ---


const MyMap: React.FC = () => {
  // Khai báo kiểu LatLngExpression cho TypeScript
  const {loading,error,latitude,longitude} = useGeolocation();
  if(loading){
    return <p>Đang lấy vị trí của bạn...</p>;
  }
  if(error){
    return <p>Lỗi: {error.message}</p>;
  }
  if (latitude === null || longitude === null) {
    // Trường hợp này gần như không xảy ra nếu logic hook đúng
    // nhưng cần thiết cho TypeScript
    return <p>Không thể xác định tọa độ...</p>;
  }
  const position: L.LatLngExpression = [latitude, longitude]; // Tọa độ TP. Hồ Chí Minh

  return (
    <MapContainer 
      center={position} 
      zoom={13} 
      style={{ height: '100%', width: '100%' }} // Bắt buộc phải set chiều cao
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          Đây là TP. Hồ Chí Minh. <br /> Chúc bạn code vui!
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MyMap;
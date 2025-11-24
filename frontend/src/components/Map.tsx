// src/components/MyMap.tsx

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { useGeolocation } from '../mock/mockUserLocation';
import { getRouteWithStops, type RouteWithStops } from '../api/routeApi';

// Import CSS và sửa lỗi icon
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
const iconUrl = 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png';

// Icon trạm dừng: chấm tròn màu đỏ
const stopIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: shadowUrl,
  iconSize: [15, 21],
  iconAnchor: [0, 0],
  popupAnchor: [0, 0],
  shadowSize: [0, 0]
});

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


interface MyMapProps {
  routeId?: number; // ID tuyến đường cần hiển thị (optional)
}

// Component để vẽ routing
const RoutingControl: React.FC<{ stops: Array<{ ViDo: number; KinhDo: number }> }> = ({ stops }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || stops.length < 2) return;

    // Tạo waypoints từ các trạm
    const waypoints = stops.map(stop => L.latLng(stop.ViDo, stop.KinhDo));

    // Tạo routing control
    const routingControl = L.Routing.control({
      waypoints,
      routeWhileDragging: false,
      addWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      lineOptions: {
        styles: [{ color: '#d21919ff', weight: 4, opacity: 0.7 }],
        extendToWaypoints: true,
        missingRouteTolerance: 0
      },
      createMarker: () => null // Ẩn marker mặc định
    }).addTo(map);

    return () => {
      if (map && routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [map, stops]);

  return null;
};

const MyMap: React.FC<MyMapProps> = ({ routeId = 1 }) => {
  const { loading, error, latitude, longitude } = useGeolocation();
  const [routeData, setRouteData] = useState<RouteWithStops | null>(null);
  const [loadingRoute, setLoadingRoute] = useState(false);

  // Lấy tuyến đường từ backend
  useEffect(() => {
    const fetchRoute = async () => {
      try {
        setLoadingRoute(true);
        const data = await getRouteWithStops(routeId);
        setRouteData(data);
      } catch (err) {
        console.error('Lỗi khi lấy tuyến đường:', err);
      } finally {
        setLoadingRoute(false);
      }
    };

    fetchRoute();
  }, [routeId]);

  // Hiển thị khi đang tải
  if (loading || loadingRoute) {
    return <p>Đang tải bản đồ...</p>;
  }

  // Hiển thị khi có lỗi
  if (error) {
    return <p>Lỗi: {error.message}</p>;
  }

  if (!latitude || !longitude) {
    return <p>Không thể lấy vị trí của bạn.</p>;
  }

  // Vị trí trung tâm (sử dụng trạm đầu tiên hoặc vị trí hiện tại)
  const centerPosition: L.LatLngExpression = routeData?.stops[0]
    ? [routeData.stops[0].ViDo, routeData.stops[0].KinhDo]
    : [latitude, longitude];

  // Sắp xếp các trạm theo thứ tự
  const sortedStops = routeData?.stops.sort((a, b) => a.ThuTuDung - b.ThuTuDung) || [];

  return (
    <MapContainer 
      center={centerPosition} 
      zoom={13} 
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Vẽ đường đi theo tuyến thực tế */}
      {sortedStops.length > 0 && <RoutingControl stops={sortedStops} />}

      {/* Hiển thị các trạm dừng */}
      {routeData?.stops
        .filter((stop: RouteWithStops['stops'][number]) => !(Math.abs(stop.ViDo - latitude) < 1e-6 && Math.abs(stop.KinhDo - longitude) < 1e-6))
        .map((stop: RouteWithStops['stops'][number]) => (
          <Marker 
            key={stop.MaTram} 
            position={[stop.ViDo, stop.KinhDo]}
            icon={stopIcon}
          >
            <Popup>
              <strong>{stop.TenTram}</strong>
              <br />
              Địa chỉ: {stop.DiaChi}
              <br />
              Thứ tự: {stop.ThuTuDung}
            </Popup>
          </Marker>
        ))}

      {/* Marker vị trí hiện tại */}
      <Marker position={[latitude, longitude]}>
        <Popup>
          Vị trí của bạn
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MyMap;
// src/components/MyMap.tsx

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
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
  useDriverPosition?: boolean; // when true, show driver's last known position (parent view)
  driverId?: number; // id of driver to track when useDriverPosition is true
}

// Component để vẽ routing
const RoutingControl: React.FC<{ stops: Array<{ ViDo: number; KinhDo: number }> }> = ({ stops }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || stops.length < 2) return;

    // Tạo waypoints từ các trạm
    const waypoints = stops.map(stop => L.latLng(stop.ViDo, stop.KinhDo));

    // Tạo routing control
    const routingControl = (L as any).Routing.control({
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
      // Avoid returning `null` from createMarker: returning null is known to
      // cause internal errors in some versions of leaflet-routing-machine
      // when it tries to remove layers. Create a non-interactive invisible
      // marker instead so the control can safely add/remove it.
      createMarker: (i: number, wp: any) => L.marker(wp.latLng, { interactive: false, opacity: 0 }),
      // Use the public OSRM demo by default (same as before). Keep a router
      // instance so we can attach error handling if needed.
      router: (L as any).Routing.osrmv1({ serviceUrl: 'https://router.project-osrm.org/route/v1' })
    }).addTo(map);

    // Prevent uncaught exceptions from bubbling when the router fails
    routingControl.on && routingControl.on('routingerror', (err: any) => {
      console.warn('Routing error from leaflet-routing-machine:', err);
    });

    return () => {
      if (map && routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [map, stops]);

  return null;
};

const MyMap: React.FC<MyMapProps> = ({ routeId = 1, useDriverPosition = false, driverId }) => {
  const { loading, error, latitude, longitude } = useGeolocation();
  // Auth to detect if current user is driver (to POST location)
  const { user: authUser } = useAuth();
  const [routeData, setRouteData] = useState<RouteWithStops | null>(null);
  const [loadingRoute, setLoadingRoute] = useState(false);

  // Driver position state (for parent view)
  const [driverPos, setDriverPos] = React.useState<{ latitude: number; longitude: number } | null>(null);

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

  // If this component is used by a driver (not parent), push updates to backend
  React.useEffect(() => {
    let mounted = true;
    // Only send driver location if this is the driver's own view (useDriverPosition is false)
    // and authUser.role indicates driver
    if (!useDriverPosition && authUser && authUser.role === 'driver' && latitude && longitude) {
      console.log('[MyMap] will POST driver location', { driverId: authUser.id, latitude, longitude });
      // dynamic import to avoid cycles
      import('../api/driverApi').then(mod => {
        const token = localStorage.getItem('token');
        mod.postDriverLocation(Number(authUser.id || authUser.MaTX || authUser.id), latitude, longitude, token)
          .then((res: any) => {
            if (mounted) console.log('[MyMap] postDriverLocation response', res);
          })
          .catch(err => {
            if (mounted) console.warn('[MyMap] Failed to post driver location', err);
          });
      }).catch(err => console.warn('driverApi import failed', err));
    }

    return () => { mounted = false; };
  }, [useDriverPosition, authUser, latitude, longitude]);

  // If used in parent mode, poll backend for driver's location
  React.useEffect(() => {
    if (!useDriverPosition || !driverId) return;
    let stopped = false;
    const poll = async () => {
      try {
        const mod = await import('../api/driverApi');
        const pos = await mod.getDriverLocation(Number(driverId));
        if (stopped) return;
        if (pos && pos.latitude !== undefined) {
          setDriverPos({ latitude: pos.latitude, longitude: pos.longitude });
        }
      } catch (err) {
        console.warn('poll driver location error', err);
      }
    };
    poll();
    const id = window.setInterval(poll, 2000);
    return () => { stopped = true; window.clearInterval(id); };
  }, [useDriverPosition, driverId]);

  // If we cannot get coordinates and we're not in parent tracking mode, we cannot render the map
  if (!useDriverPosition && (!latitude || !longitude)) {
    return <p>Không thể lấy vị trí của bạn.</p>;
  }

  // Vị trí trung tâm (sử dụng trạm đầu tiên > driverPos (parent) > local geolocation)
  let centerPosition: L.LatLngExpression | null = null;
  if (routeData?.stops && routeData.stops.length > 0) {
    const s0 = routeData.stops[0];
    if (s0 && s0.ViDo != null && s0.KinhDo != null) centerPosition = [s0.ViDo, s0.KinhDo];
  }
  if (!centerPosition) {
    if (useDriverPosition && driverPos) {
      centerPosition = [driverPos.latitude, driverPos.longitude];
    } else if (latitude && longitude) {
      centerPosition = [latitude, longitude];
    }
  }

  // Sắp xếp các trạm theo thứ tự
  const sortedStops = routeData?.stops.sort((a, b) => a.ThuTuDung - b.ThuTuDung) || [];

  // Component inside MapContainer to follow user's location updates
  const FollowUser: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
      if (!map) return;
      try {
        map.panTo([lat, lng]);
      } catch (e) {
        // ignore pan errors
      }
    }, [lat, lng, map]);
    return null;
  };

  if (!centerPosition) {
    return <p>Đang chờ vị trí để hiển thị bản đồ...</p>;
  }

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
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

        {/* Marker vị trí hiện tại (driver view) or driver's marker (parent view) */}
        {!useDriverPosition && latitude && longitude && (
          <>
            <Marker position={[latitude, longitude]}>
              <Popup>Vị trí của bạn</Popup>
            </Marker>
            {latitude && longitude && <FollowUser lat={latitude} lng={longitude} />}
          </>
        )}

        {useDriverPosition && driverPos && (
          <>
            <Marker position={[driverPos.latitude, driverPos.longitude]}>
              <Popup>Vị trí tài xế</Popup>
            </Marker>
            <FollowUser lat={driverPos.latitude} lng={driverPos.longitude} />
          </>
        )}
      </MapContainer>

      {/* Overlay messages for loading / error / no-route to avoid unmounting the map */}
      {(loading || loadingRoute) && (
        <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 1000, background: 'white', padding: 8, borderRadius: 6 }}>
          Đang tải bản đồ...
        </div>
      )}

      {error && (
        <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 1000, background: 'rgba(255,240,240,0.95)', padding: 8, borderRadius: 6 }}>
          Lỗi: {error.message}
        </div>
      )}

      {routeData === null && !loadingRoute && (
        <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 1000, background: 'rgba(250,250,210,0.95)', padding: 8, borderRadius: 6 }}>
          Không tìm thấy tuyến đường với id {routeId}.
        </div>
      )}
    </div>
  );
};

export default MyMap;
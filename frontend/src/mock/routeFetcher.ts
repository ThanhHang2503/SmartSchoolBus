import { Point } from './gpsSimulator';

// Lấy đường thực tế từ OSRM public API (driving profile)
// Points input: array of {lat, lng} waypoints
export async function fetchRouteFromOsrm(points: Point[]): Promise<Point[]> {
  if (!points || points.length < 2) throw new Error('At least 2 points required');

  // build coordinates string lon,lat;lon,lat;...
  const coords = points.map((p) => `${p.lng},${p.lat}`).join(';');
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`OSRM error: ${res.status}`);
  const data = await res.json();
  if (!data || !data.routes || data.routes.length === 0) throw new Error('No route found');

  const coordsGeo: number[][] = data.routes[0].geometry.coordinates; // [ [lon, lat], ... ]
  // convert to Point[]
  return coordsGeo.map((c) => ({ lat: c[1], lng: c[0] }));
}

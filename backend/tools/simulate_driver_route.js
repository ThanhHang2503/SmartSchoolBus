// Usage: node simulate_driver_route.js [routeId] [driverId] [intervalMs]
// Example: node simulate_driver_route.js 1 1 2000

const [,, routeIdArg='1', driverIdArg='1', intervalArg='2000'] = process.argv;
const routeId = Number(routeIdArg);
const driverId = Number(driverIdArg);
const intervalMs = Number(intervalArg);
const base = 'http://localhost:5000';

async function ensureFetch() {
  if (typeof fetch !== 'undefined') return fetch;
  try {
    // try dynamic import
    const nf = await import('node-fetch');
    return nf.default;
  } catch (e) {
    console.error('No fetch available. Please run with Node 18+ or install node-fetch (`npm i node-fetch`).');
    process.exit(1);
  }
}

async function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }

(async () => {
  const _fetch = await ensureFetch();
  console.log(`Fetching stops for route ${routeId}...`);
  const r = await _fetch(`${base}/route/${routeId}/stops`);
  if (!r.ok) {
    console.error('Failed to get route stops:', r.status, await r.text());
    process.exit(1);
  }
  const route = await r.json();
  // API returns { success, message, data }
  const stops = route?.data?.stops || [];
  if (!stops.length) {
    console.error('No stops found for route', routeId);
    process.exit(1);
  }
  // choose target stop = first stop
  const target = stops[0];
  const targetLat = Number(target.ViDo);
  const targetLon = Number(target.KinhDo);
  console.log('Target stop:', target.TenTram, targetLat, targetLon);

  // create a start point offset ~500m to the north (approx 0.0045 deg lat ~500m)
  const startLat = targetLat + 0.0045;
  const startLon = targetLon;

  const steps = 30;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lat = startLat + (targetLat - startLat) * t;
    const lon = startLon + (targetLon - startLon) * t;
    const body = { driverId, latitude: lat, longitude: lon };
    try {
      const res = await _fetch(`${base}/driver/location/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const txt = await res.text();
      console.log(`POST ${i}/${steps} -> ${lat.toFixed(6)},${lon.toFixed(6)} => ${res.status} ${txt}`);
    } catch (e) {
      console.error('POST error', e.message || e);
    }
    await sleep(intervalMs);
  }
  console.log('Simulation finished.');
  process.exit(0);
})();

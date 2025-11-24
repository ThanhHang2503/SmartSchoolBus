// Simple GPS simulator that walks a route (array of {lat, lng})
// Exports GpsSimulator class with start/stop and onPosition callback.

export interface Point {
  lat: number;
  lng: number;
}

export interface SimulatorOptions {
  speedMps?: number; // movement speed in meters/second (default 8 m/s ~ 28.8 km/h)
  intervalMs?: number; // update interval in ms (default 1000)
  loop?: boolean; // when reaching route end, loop back to start (default false)
}

function haversineDistance(a: Point, b: Point) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371000; // Earth radius meters
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const aa = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
  const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
  return R * c;
}

function interpolate(a: Point, b: Point, fraction: number): Point {
  return {
    lat: a.lat + (b.lat - a.lat) * fraction,
    lng: a.lng + (b.lng - a.lng) * fraction,
  };
}

export class GpsSimulator {
  private route: Point[];
  private speedMps: number;
  private intervalMs: number;
  private loop: boolean;
  private onPositionCb?: (pos: Point) => void;

  private segIndex = 0; // index of current segment start point
  private segProgress = 0; // meters traveled on current segment
  private timerId: number | null = null;

  constructor(route: Point[], opts?: SimulatorOptions) {
    if (!route || route.length < 2) throw new Error('Route must contain at least 2 points');
    this.route = route;
    this.speedMps = opts?.speedMps ?? 8;
    this.intervalMs = opts?.intervalMs ?? 1000;
    this.loop = opts?.loop ?? false;
  }

  onPosition(cb: (pos: Point) => void) {
    this.onPositionCb = cb;
  }

  start() {
    if (this.timerId != null) return; // already running
    // reset position to beginning
    this.segIndex = 0;
    this.segProgress = 0;
    // emit initial position
    this.emitPosition(this.route[0]);

    this.timerId = window.setInterval(() => this.tick(), this.intervalMs);
  }

  stop() {
    if (this.timerId != null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  private emitPosition(p: Point) {
    if (this.onPositionCb) this.onPositionCb(p);
  }

  private tick() {
    const from = this.route[this.segIndex];
    const to = this.route[this.segIndex + 1];
    const segLen = haversineDistance(from, to);
    const distThisTick = this.speedMps * (this.intervalMs / 1000);

    this.segProgress += distThisTick;

    if (this.segProgress >= segLen) {
      // move to next segment
      this.segIndex++;
      this.segProgress -= segLen;
      if (this.segIndex >= this.route.length - 1) {
        // reached end
        if (this.loop) {
          this.segIndex = 0;
        } else {
          // emit final point and stop
          this.emitPosition(this.route[this.route.length - 1]);
          this.stop();
          return;
        }
      }
    }

    const curFrom = this.route[this.segIndex];
    const curTo = this.route[this.segIndex + 1];
    const curSegLen = haversineDistance(curFrom, curTo) || 1; // avoid div0
    const fraction = Math.max(0, Math.min(1, this.segProgress / curSegLen));
    const pos = interpolate(curFrom, curTo, fraction);
    this.emitPosition(pos);
  }

  getCurrentPosition(): Point {
    const from = this.route[this.segIndex];
    const to = this.route[Math.min(this.segIndex + 1, this.route.length - 1)];
    const curSegLen = haversineDistance(from, to) || 1;
    const fraction = Math.max(0, Math.min(1, this.segProgress / curSegLen));
    return interpolate(from, to, fraction);
  }
}

/* Usage example:
import { GpsSimulator } from '.../frontend/src/mock/gpsSimulator';

const route = [
  { lat: 10.7769, lng: 106.6999 },
  { lat: 10.7720, lng: 106.6880 },
  { lat: 10.7795, lng: 106.6930 },
];

const sim = new GpsSimulator(route, { speedMps: 5, intervalMs: 1000, loop: true });
sim.onPosition((pos) => {
  console.log('sim pos', pos);
  // update marker on map, or feed to websocket
});
sim.start();
*/

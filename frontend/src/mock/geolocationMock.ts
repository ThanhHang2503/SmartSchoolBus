import { GpsSimulator, Point, SimulatorOptions } from './gpsSimulator';

export interface GeoMockOptions extends SimulatorOptions {
  startNow?: boolean; // start simulator immediately
}

function makePosition(p: Point): GeolocationPosition {
  return {
    coords: {
      latitude: p.lat,
      longitude: p.lng,
      altitude: null,
      accuracy: 5,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    },
    timestamp: Date.now(),
  } as GeolocationPosition;
}

export function installGeolocationMock(route: Point[], opts?: GeoMockOptions) {
  if (!route || route.length < 2) throw new Error('Route must contain at least 2 points');

  const sim = new GpsSimulator(route, opts);
  const callbacks = new Map<number, PositionCallback>();
  let nextWatchId = 1;

  // save original geolocation if present
  const originalGeolocation = (navigator as any).geolocation;

  // internal relay from simulator -> registered watchers
  sim.onPosition((p) => {
    const pos = makePosition(p);
    callbacks.forEach((cb) => {
      try {
        cb(pos);
      } catch (e) {
        // ignore
      }
    });
  });

  const mock: Geolocation = {
    getCurrentPosition(success: PositionCallback, error?: PositionErrorCallback, options?: PositionOptions) {
      try {
        const pos = makePosition(sim.getCurrentPosition());
        success(pos);
      } catch (err) {
        if (error) error({ code: 2, message: String(err) } as GeolocationPositionError);
      }
    },
    watchPosition(success: PositionCallback, error?: PositionErrorCallback, options?: PositionOptions) {
      const id = nextWatchId++;
      callbacks.set(id, success);
      return id;
    },
    clearWatch(id: number) {
      callbacks.delete(id);
    },
  } as unknown as Geolocation;

  // install mock
  (navigator as any).geolocation = mock;

  function start() {
    sim.start();
  }
  function stop() {
    sim.stop();
  }
  function uninstall() {
    // restore original geolocation
    (navigator as any).geolocation = originalGeolocation;
    stop();
  }

  if (opts?.startNow ?? true) start();

  return {
    start,
    stop,
    uninstall,
    simulator: sim,
  };
}

/* Usage example (dev only):
import { installGeolocationMock } from '../mock/geolocationMock';

const route = [
  { lat: 10.7769, lng: 106.6999 },
  { lat: 10.7720, lng: 106.6880 },
  { lat: 10.7795, lng: 106.6930 },
];

const controller = installGeolocationMock(route, { speedMps: 6, intervalMs: 1000, loop: true, startNow: true });

// Now any code using navigator.geolocation.getCurrentPosition / watchPosition
// will receive simulated locations.

// To stop and restore real geolocation:
// controller.uninstall();
*/

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
  let installedViaAssignment = false;
  const originalMethods: {
    getCurrentPosition?: any;
    watchPosition?: any;
    clearWatch?: any;
  } = {};

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

  // install mock: try direct assignment first; if navigator.geolocation is read-only,
  // patch the methods on the existing object instead and restore them on uninstall.
  try {
    (navigator as any).geolocation = mock;
    installedViaAssignment = true;
  } catch (assignErr) {
    // assignment failed (read-only). Try to patch methods on the existing object.
    if (originalGeolocation) {
      try {
        originalMethods.getCurrentPosition = originalGeolocation.getCurrentPosition?.bind(originalGeolocation);
        originalMethods.watchPosition = originalGeolocation.watchPosition?.bind(originalGeolocation);
        originalMethods.clearWatch = originalGeolocation.clearWatch?.bind(originalGeolocation);

        (originalGeolocation as any).getCurrentPosition = mock.getCurrentPosition.bind(mock);
        (originalGeolocation as any).watchPosition = mock.watchPosition.bind(mock);
        (originalGeolocation as any).clearWatch = mock.clearWatch.bind(mock);
        installedViaAssignment = false;
      } catch (patchErr) {
        throw new Error('Cannot install geolocation mock: navigator.geolocation is read-only and its methods cannot be patched');
      }
    } else {
      // no original geolocation object and assignment failed
      throw new Error('Cannot install geolocation mock: navigator.geolocation is not present and cannot be defined');
    }
  }

  function start() {
    sim.start();
  }
  function stop() {
    sim.stop();
  }
  function uninstall() {
    // restore original geolocation or restore patched methods
    try {
      if (installedViaAssignment) {
        (navigator as any).geolocation = originalGeolocation;
      } else if (originalGeolocation) {
        try {
          if (originalMethods.getCurrentPosition) (originalGeolocation as any).getCurrentPosition = originalMethods.getCurrentPosition;
          if (originalMethods.watchPosition) (originalGeolocation as any).watchPosition = originalMethods.watchPosition;
          if (originalMethods.clearWatch) (originalGeolocation as any).clearWatch = originalMethods.clearWatch;
        } catch (e) {
          // ignore restore errors
        }
      }
    } catch (e) {
      // ignore
    }
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

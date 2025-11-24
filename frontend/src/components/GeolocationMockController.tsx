"use client";

import { useEffect, useRef } from 'react';
import { installGeolocationMock } from '../mock/geolocationMock';
import { fetchRouteFromOsrm } from '../mock/routeFetcher';
import { GpsSimulator, Point } from '../mock/gpsSimulator';

// Persistent geolocation mock controller mounted at app root (Layout)
export default function GeolocationMockController() {
  const ctrlRef = useRef<any>(null);
  const origMethodsRef = useRef<any>(null);
  useEffect(() => {
    // only enable in non-production by default
    const isDev = process.env.NODE_ENV !== 'production';
    if (!isDev) return;

    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const wantSim = urlParams?.get('simulate') === '1' || localStorage.getItem('geolocationMock') === '1' || !!localStorage.getItem('geolocationMockConfig');
    if (!wantSim) return;

    let mounted = true;

    const baseRoute: Point[] = [
      { lat: 10.7769, lng: 106.6999 },
      { lat: 10.7720, lng: 106.6880 },
      { lat: 10.7795, lng: 106.6930 },
      { lat: 10.7769, lng: 106.6999 },
    ];

    (async () => {
      // allow persisted config to fully specify the route and options
      let route = baseRoute;
      let opts: any = { speedMps: 40 / 3.6, intervalMs: 250, loop: true, startNow: true };

      const cfgRaw = localStorage.getItem('geolocationMockConfig');
      if (cfgRaw) {
        try {
          const cfg = JSON.parse(cfgRaw);
          if (cfg.route && Array.isArray(cfg.route) && cfg.route.length > 0) {
            route = cfg.route;
          }
          if (cfg.opts) opts = { ...opts, ...cfg.opts };
        } catch (e) {
          // ignore parse errors and fallback to baseRoute
        }
      } else {
        try {
          const r = await fetchRouteFromOsrm(baseRoute);
          if (mounted) route = r;
        } catch (e) {
          // keep baseRoute
        }
      }

      if (!mounted) return;

      // try using installGeolocationMock
      try {
        const ctrl = installGeolocationMock(route, opts);
        ctrlRef.current = ctrl;
        // persist flag so other pages also enable
        try { localStorage.setItem('geolocationMock', '1'); } catch (e) {}
        // expose for debugging
        (window as any).__geoMockController = ctrl;
        return;
      } catch (err) {
        // fallback: monkey-patch existing navigator.geolocation methods
      }

      // FALLBACK: create simulator and monkey-patch methods
      try {
        const sim = new GpsSimulator(route, { speedMps: 40 / 3.6, intervalMs: 250, loop: true });
        const callbacks = new Map<number, PositionCallback>();
        let nextWatchId = 1;

        sim.onPosition((p) => {
          const pos: GeolocationPosition = {
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
          callbacks.forEach((cb) => {
            try { cb(pos); } catch (e) {}
          });
        });
        sim.start();

        const navGeo: any = (navigator as any).geolocation;
        if (navGeo) {
          origMethodsRef.current = {
            getCurrentPosition: navGeo.getCurrentPosition?.bind(navGeo),
            watchPosition: navGeo.watchPosition?.bind(navGeo),
            clearWatch: navGeo.clearWatch?.bind(navGeo),
          };

          navGeo.getCurrentPosition = (success: PositionCallback, error?: PositionErrorCallback) => {
            try { success(sim.getCurrentPosition() as unknown as GeolocationPosition); } catch (e) { if (error) error({ code: 2, message: String(e) } as GeolocationPositionError); }
          };
          navGeo.watchPosition = (success: PositionCallback) => {
            const id = nextWatchId++;
            callbacks.set(id, success);
            return id;
          };
          navGeo.clearWatch = (id: number) => callbacks.delete(id);

          const fallbackCtrl = {
            uninstall() {
              // restore
              try {
                if (origMethodsRef.current?.getCurrentPosition) navGeo.getCurrentPosition = origMethodsRef.current.getCurrentPosition;
                if (origMethodsRef.current?.watchPosition) navGeo.watchPosition = origMethodsRef.current.watchPosition;
                if (origMethodsRef.current?.clearWatch) navGeo.clearWatch = origMethodsRef.current.clearWatch;
              } catch (e) {}
              sim.stop();
              try { localStorage.removeItem('geolocationMock'); } catch (e) {}
            },
            simulator: sim,
          };
          ctrlRef.current = fallbackCtrl;
          (window as any).__geoMockController = fallbackCtrl;
        } else {
          // cannot patch, stop simulator
          sim.stop();
        }
      } catch (e) {
        // give up
      }
    })();

    return () => {
      mounted = false;
      // do NOT uninstall — persist across navigation; user must explicitly disable
    };
  }, []);

  return null;
}

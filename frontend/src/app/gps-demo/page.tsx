"use client";

import React, { useMemo, useEffect, useState } from 'react';
import MapWithGps from '../../components/MapWithGps';
import { fetchRouteFromOsrm } from '../../mock/routeFetcher';
import type { Point } from '../../mock/gpsSimulator';
import { getAllRoutes, getRouteWithStops, type RouteWithStops } from '../../api/routeApi';
import { installGeolocationMock } from '../../mock/geolocationMock';

export default function GpsDemoPage() {
  // read simulate flag from query param ?simulate=1
  const simulate = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('simulate') === '1';

  const baseRoute = useMemo<Point[]>(
    () => [
      { lat: 10.7769, lng: 106.6999 },
      { lat: 10.7720, lng: 106.6880 },
      { lat: 10.7795, lng: 106.6930 },
      { lat: 10.7769, lng: 106.6999 },
    ],
    []
  );

  // Robust numeric parser for coordinates coming from backend (handles strings and concatenated expressions)
  const parseCoord = (v: any): number => {
    if (typeof v === 'number') return v;
    if (typeof v !== 'string') return NaN;
    // Try direct conversion first for simple numeric strings
    const direct = Number(v);
    if (!isNaN(direct)) return direct;
    // Fallback: extract all numeric tokens and sum (for concatenated expressions like "10.7769000-0.00005517375867693177")
    const matches = v.match(/[+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g);
    if (!matches || matches.length === 0) return NaN;
    // If single match, return it; if multiple, sum them
    if (matches.length === 1) return Number(matches[0]);
    return matches.map(Number).reduce((a, b) => a + b, 0);
  };

  const stopsToPoints = (stops: RouteWithStops['stops'], useSwap: boolean) => {
    // Normal: ViDo=latitude, KinhDo=longitude
    // Swapped: values are reversed in DB, so read KinhDo as lat, ViDo as lng
    const points = stops.map(s => ({ 
      lat: parseCoord(useSwap ? s.KinhDo : s.ViDo),
      lng: parseCoord(useSwap ? s.ViDo : s.KinhDo)
    } as Point)).filter(p => !Number.isNaN(p.lat) && !Number.isNaN(p.lng));
    
    // Validate coordinates
    if (points.length > 0) {
      const first = points[0];
      if (Math.abs(first.lat) > 90 || Math.abs(first.lng) > 180) {
        console.error(`❌ Invalid coordinates! useSwap=${useSwap}, first point:`, first, 'from stop:', stops[0]);
        console.error('⚠️ Latitude must be -90 to 90, Longitude must be -180 to 180');
        console.error('💡 Try toggling the "Swap coords" checkbox');
      } else {
        console.log(`✅ Valid coords: useSwap=${useSwap}, first point:`, first);
      }
    }
    
    return points;
  };

  const [route, setRoute] = useState<Point[] | null>(null);
  const [previewStops, setPreviewStops] = useState<Array<{ lat: number; lng: number; name?: string }> | null>(null);
  const [swapCoords, setSwapCoords] = useState<boolean>(false);
  const [autoDetectedSwap, setAutoDetectedSwap] = useState<boolean | null>(null);
  const [availableRoutes, setAvailableRoutes] = useState<Array<{ id: number; NoiBatDau: string; NoiKetThuc: string }> | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<number | 'custom' | null>(null);
  const [speedKmh, setSpeedKmh] = useState<number>(40);
  const [loop, setLoop] = useState<boolean>(true);
  const [isGlobalMockActive, setIsGlobalMockActive] = useState<boolean>(() => !!localStorage.getItem('geolocationMockConfig'));
  const [driverId, setDriverId] = useState<number>(() => Number(localStorage.getItem('gpsDemoDriverId') || 1));
  const posterRef = React.useRef<number | null>(null);
  const driverIdRef = React.useRef<number>(driverId);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [lastPosted, setLastPosted] = useState<{ lat: number; lng: number; driverId: number; t: number } | null>(null);
  const toNumber = (v: any): number => {
    if (typeof v === 'number') return v;
    if (typeof v === 'string') {
      const matches = v.match(/[+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g);
      if (!matches) return NaN;
      return matches.map(Number).reduce((a, b) => a + b, 0);
    }
    return NaN;
  };
  useEffect(() => {
    let mounted = true;

    const loadRouteFromPoints = async (pts: Point[]) => {
      try {
        const r = await fetchRouteFromOsrm(pts);
        if (mounted) setRoute(r);
      } catch (e) {
        if (mounted) setRoute(pts);
      }
    };

    // If simulate mode, decide which route to use: selectedRouteId or default baseRoute
    if (simulate) {
      (async () => {
        try {
          // load available routes once
          if (!availableRoutes) {
            const routes = await getAllRoutes();
            if (!mounted) return;
            setAvailableRoutes(routes.map(r => ({ id: r.id, NoiBatDau: r.NoiBatDau, NoiKetThuc: r.NoiKetThuc })));
            // choose first route if none selected yet
            if (routes.length > 0 && selectedRouteId === null) {
              const firstId = routes[0].id;
              setSelectedRouteId(firstId);
              // proactively load the chosen route to avoid waiting for the other effect
              try {
                const routeWithStops = await getRouteWithStops(Number(firstId));
                if (routeWithStops && mounted) {
                  const detectedSwap = (() => {
                    try {
                      const sample = routeWithStops.stops[0];
                      const vi = Number(sample.ViDo);
                      return !isNaN(vi) && Math.abs(vi) > 90;
                    } catch { return false; }
                  })();
                  const useSwap = swapCoords || detectedSwap;
                  const ptsStops = stopsToPoints(routeWithStops.stops, useSwap);
                  await loadRouteFromPoints(ptsStops);
                  if (mounted) setPreviewStops(routeWithStops.stops.map(s => ({ lat: parseCoord(useSwap ? s.KinhDo : s.ViDo), lng: parseCoord(useSwap ? s.ViDo : s.KinhDo), name: s.TenTram })));
                }
              } catch (e) {
                // ignore — other logic will fallback
              }
            }
          }

          if (selectedRouteId === 'custom' || selectedRouteId === null) {
            // use base route fallback
            const r = await fetchRouteFromOsrm(baseRoute);
            if (mounted) setPreviewStops(null);
            if (mounted) setRoute(r);
          } else {
            // fetch route with stops from backend
            const routeWithStops = await getRouteWithStops(Number(selectedRouteId));
            if (routeWithStops && mounted) {
              // auto-detect swapped coords: ViDo should be latitude (~ -90..90)
              let detectedSwap = false;
              try {
                const sample = routeWithStops.stops[0];
                const vi = Number(sample.ViDo);
                if (!isNaN(vi) && Math.abs(vi) > 90) {
                  detectedSwap = true;
                }
              } catch (e) {
                detectedSwap = false;
              }
              if (detectedSwap) {
                console.warn('Auto-detected swapped coords for route stops; will apply swap for this load');
                setAutoDetectedSwap(true);
                // don't overwrite user's manual choice here if they already toggled
                if (!swapCoords) setSwapCoords(true);
              } else {
                setAutoDetectedSwap(false);
                // Auto-reset swap if coords are normal (not swapped)
                if (swapCoords) {
                  console.log('Coords are normal (ViDo < 90), disabling swap');
                  setSwapCoords(false);
                }
              }

              // decide swap for this run (use current swapCoords OR detected)
              const useSwap = swapCoords || detectedSwap;
              // build pts applying swap decision immediately (avoid async state timing)
              const ptsStops = stopsToPoints(routeWithStops.stops, useSwap);
              await loadRouteFromStops(ptsStops);
              // set preview stops using raw stops from backend (apply swap if enabled)
              if (mounted) setPreviewStops(routeWithStops.stops.map(s => ({ lat: parseCoord(useSwap ? s.KinhDo : s.ViDo), lng: parseCoord(useSwap ? s.ViDo : s.KinhDo), name: s.TenTram })));
            } else if (mounted) {
              // fallback
              const r = await fetchRouteFromOsrm(baseRoute);
              if (mounted) setPreviewStops(null);
              if (mounted) setRoute(r);
            }
          }
        } catch (e) {
          if (mounted) setRoute(baseRoute);
        }
      })();
    } else {
      setRoute(baseRoute);
    }
    return () => {
      mounted = false;
    };
  }, [simulate, baseRoute]);

  // reload route when selectedRouteId changes (simulate mode)
  useEffect(() => {
    if (!simulate || selectedRouteId == null) return;
    let mounted = true;
    (async () => {
      try {
        if (selectedRouteId === 'custom') {
          const r = await fetchRouteFromOsrm(baseRoute);
          if (mounted) setRoute(r);
          if (mounted) setPreviewStops(null);
          return;
        }
        const rws = await getRouteWithStops(Number(selectedRouteId));
        if (!mounted) return;
        if (rws) {
          const pts = stopsToPoints(rws.stops, swapCoords);
          try {
            const rr = await fetchRouteFromOsrm(pts);
            if (mounted) setRoute(rr);
            if (mounted) setPreviewStops(rws.stops.map(s => ({ lat: parseCoord(swapCoords ? s.KinhDo : s.ViDo), lng: parseCoord(swapCoords ? s.ViDo : s.KinhDo), name: s.TenTram })));
          } catch {
            if (mounted) setRoute(pts);
            if (mounted) setPreviewStops(rws.stops.map(s => ({ lat: parseCoord(swapCoords ? s.KinhDo : s.ViDo), lng: parseCoord(swapCoords ? s.ViDo : s.KinhDo), name: s.TenTram })));
          }
        }
      } catch (e) {
        console.warn('Failed to reload route for selectedRouteId', e);
      }
    })();
    return () => { mounted = false; };
  }, [selectedRouteId, simulate, baseRoute, swapCoords]);

  // If simulate is active and selectedRouteId exists but route remains null, try a targeted load and surface errors
  useEffect(() => {
    if (!simulate) return;
    if (selectedRouteId == null) return;
    if (route != null) return;
    let mounted = true;
    (async () => {
      try {
        setLoadError(null);
        if (selectedRouteId === 'custom') {
          const r = await fetchRouteFromOsrm(baseRoute);
          if (mounted) setRoute(r);
          return;
        }
        const rws = await getRouteWithStops(Number(selectedRouteId));
        if (!rws) {
          if (mounted) setLoadError('Không tìm thấy tuyến (backend trả về null)');
          return;
        }
        const pts = stopsToPoints(rws.stops, swapCoords);
        try {
          const rr = await fetchRouteFromOsrm(pts);
          if (mounted) setRoute(rr);
          if (mounted) setPreviewStops(rws.stops.map(s => ({ lat: parseCoord(swapCoords ? s.KinhDo : s.ViDo), lng: parseCoord(swapCoords ? s.ViDo : s.KinhDo), name: s.TenTram })));
        } catch (e: any) {
          // OSRM may fail; fallback to raw pts but record the error
          if (mounted) setRoute(pts);
          try { if (mounted) setPreviewStops(rws.stops.map(s => ({ lat: parseCoord(swapCoords ? s.KinhDo : s.ViDo), lng: parseCoord(swapCoords ? s.ViDo : s.KinhDo), name: s.TenTram }))); } catch {}
          if (mounted) setLoadError('OSRM routing failed, using stops as route');
        }
      } catch (e: any) {
        if (mounted) setLoadError(String(e?.message || e));
      }
    })();
    return () => { mounted = false; };
  }, [simulate, selectedRouteId, baseRoute, route]); // Removed swapCoords to avoid duplicate fetch

  // Start/stop global mock using installGeolocationMock and persist config
  const startGlobalMock = async (routeOverride?: Point[]) => {
    const usedRoute = routeOverride ?? route;
    if (!usedRoute) return;
    // sanitize route before passing to installGeolocationMock
    const sanitized = usedRoute.map(p => ({ lat: toNumber((p as any).lat), lng: toNumber((p as any).lng) } as Point)).filter(pt => Number.isFinite(pt.lat) && Number.isFinite(pt.lng));
    if (sanitized.length < 2) {
      throw new Error('Cannot start mock: route has insufficient numeric points');
    }
    try {
      // options: convert km/h to m/s
      const opts = { speedMps: speedKmh / 3.6, intervalMs: 250, loop, startNow: true };
      console.info('Starting global mock with', sanitized.length, 'points');
      const ctrl = installGeolocationMock(sanitized, opts as any);
      // persist full config so GeolocationMockController can pick it up across pages
      try {
        localStorage.setItem('geolocationMockConfig', JSON.stringify({ route: usedRoute, opts }));
        localStorage.setItem('geolocationMock', '1');
      } catch (e) {}
      (window as any).__geoMockController = ctrl;
      // ensure global pointer is the controller we set
      try { (window as any).__geoMockController = ctrl; } catch (e) {}
      setIsGlobalMockActive(true);
      try { localStorage.setItem('gpsDemoDriverId', String(driverId)); } catch (e) {}

      // start poster loop: if simulator is available, periodically POST current position to backend test endpoint
      try {
        // clear existing if any
        if (posterRef.current) { clearInterval(posterRef.current); posterRef.current = null; }
        const mapper = () => {
          try {
            const sim = (window as any).__geoMockController?.simulator;
            if (!sim || typeof sim.getCurrentPosition !== 'function') return;
            const p = sim.getCurrentPosition();
            const currentDriverId = Number(driverIdRef.current || Number(localStorage.getItem('gpsDemoDriverId') || 1));
            // POST to local backend dev test endpoint
            const payload = { driverId: currentDriverId, latitude: p.lat, longitude: p.lng };
            try { console.debug('[gps-demo] POST payload', payload); } catch (e) {}
            fetch('http://localhost:5000/driver/location/test', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            }).catch(() => {});
            try { setLastPosted({ lat: p.lat, lng: p.lng, driverId: currentDriverId, t: Date.now() }); } catch (e) {}
          } catch (e) {}
        };
        // post immediately then at interval
        mapper();
        posterRef.current = window.setInterval(mapper, 1000);
      } catch (e) {
        console.warn('Failed to start poster loop', e);
      }
    } catch (err) {
      console.error('Failed to start global mock', err);
      alert('Không thể start mock: ' + String(err));
    }
  };

  const stopGlobalMock = () => {
    try {
      try { (window as any).__geoMockController?.uninstall?.(); } catch (e) { console.warn('Error uninstalling geoMock', e); }
      try { delete (window as any).__geoMockController; } catch (e) {}
    } catch (e) {}
    try { localStorage.removeItem('geolocationMockConfig'); localStorage.removeItem('geolocationMock'); } catch (e) {}
    setIsGlobalMockActive(false);
    try { if (posterRef.current) { clearInterval(posterRef.current); posterRef.current = null; } } catch (e) {}
  };

  // keep driverIdRef in sync so poster uses up-to-date ID
  useEffect(() => { driverIdRef.current = driverId; try { localStorage.setItem('gpsDemoDriverId', String(driverId)); } catch (e) {} }, [driverId]);

  // If mock is active and route changes, restart mock so simulator uses new route
  useEffect(() => {
    if (!isGlobalMockActive) return;
    // restart only when route changes (to apply new route to geolocation mock)
    try {
      stopGlobalMock();
      // small delay to allow previous mock to fully uninstall
      const t = setTimeout(() => {
        startGlobalMock(route).catch((e) => console.warn('Failed to restart mock after route change', e));
      }, 200);
      return () => clearTimeout(t);
    } catch (e) {
      console.warn('Error while restarting mock after route change', e);
    }
  }, [route]);

  return (
    <main style={{ padding: 16 }}>
      <h1>GPS Demo</h1>
      <p>Mode: {simulate ? 'Simulator (simulate=1)' : 'Browser geolocation'}</p>
      <div style={{ maxWidth: 900 }}>
        {simulate && availableRoutes && (
          <div style={{ marginBottom: 8 }}>
            <label style={{ marginRight: 8 }}>Chọn tuyến để mock:</label>
            <select value={selectedRouteId ?? ''} onChange={(e) => {
              const v = e.target.value;
              if (v === 'custom') setSelectedRouteId('custom');
              else setSelectedRouteId(Number(v));
            }}>
              <option value="custom">Custom (base demo route)</option>
              {availableRoutes.map(r => (
                <option key={r.id} value={r.id}>{r.id} — {r.NoiBatDau} → {r.NoiKetThuc}</option>
              ))}
            </select>

            <span style={{ marginLeft: 12 }}>
              <label>Speed (km/h): </label>
              <input style={{ width: 80, marginLeft: 6 }} type="number" value={speedKmh} onChange={(e) => setSpeedKmh(Number(e.target.value))} />
            </span>

            <span style={{ marginLeft: 12 }}>
              <label>Loop: </label>
              <input type="checkbox" checked={loop} onChange={(e) => setLoop(e.target.checked)} />
            </span>
            <span style={{ marginLeft: 12 }}>
              <label title="Chỉ tích nếu database bị hoán đổi lat/lng (ViDo > 90)">Swap coords (ViDo ↔ KinhDo): </label>
              <input type="checkbox" checked={swapCoords} onChange={(e) => setSwapCoords(e.target.checked)} />
              {autoDetectedSwap === true && <em style={{ marginLeft: 6, color: '#b45309' }}>Auto-detected swap</em>}
              {autoDetectedSwap === false && swapCoords && <em style={{ marginLeft: 6, color: '#dc2626' }}>⚠️ Manual swap (coords may be invalid!)</em>}
            </span>

            <span style={{ marginLeft: 12 }}>
              <label>Driver ID: </label>
              <input style={{ width: 80, marginLeft: 6 }} type="number" value={driverId} onChange={(e) => setDriverId(Number(e.target.value))} />
            </span>

            <span style={{ marginLeft: 12 }}>
              {isGlobalMockActive ? (
                <button onClick={stopGlobalMock} style={{ marginLeft: 8 }}>Stop global mock</button>
              ) : (
                <button onClick={() => startGlobalMock()} style={{ marginLeft: 8 }}>Start global mock</button>
              )}
            </span>
            <span style={{ marginLeft: 12 }}>
              {lastPosted ? (
                <small>Last POST: {lastPosted.driverId} @ {lastPosted.lat.toFixed(6)},{lastPosted.lng.toFixed(6)}</small>
              ) : (
                <small>No posts yet</small>
              )}
            </span>
          </div>
        )}

        {route ? (
          <MapWithGps simulate={simulate} simulateRoute={route} height="600px" simulateSpeedKmh={speedKmh} previewStops={previewStops ?? undefined} skipNormalize={true} />
        ) : (
          <div>
            <p>Loading route...</p>
            {loadError && <p style={{ color: 'crimson' }}>Lỗi: {loadError}</p>}
          </div>
        )}
      </div>
      <p style={{ marginTop: 12 }}>Tip: append <code>?simulate=1</code> to URL to force simulation.</p>
    </main>
  );
}

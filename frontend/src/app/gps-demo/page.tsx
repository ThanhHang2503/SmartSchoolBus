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

  const [route, setRoute] = useState<Point[] | null>(null);
  const [availableRoutes, setAvailableRoutes] = useState<Array<{ id: number; NoiBatDau: string; NoiKetThuc: string }> | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<number | 'custom' | null>(null);
  const [speedKmh, setSpeedKmh] = useState<number>(40);
  const [loop, setLoop] = useState<boolean>(true);
  const [isGlobalMockActive, setIsGlobalMockActive] = useState<boolean>(() => !!localStorage.getItem('geolocationMockConfig'));
  useEffect(() => {
    let mounted = true;

    const loadRouteFromStops = async (stops: RouteWithStops['stops']) => {
      // convert stops to Point[] then attempt OSRM polyline
      const pts: Point[] = stops.map(s => ({ lat: s.ViDo, lng: s.KinhDo }));
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
              setSelectedRouteId(routes[0].id);
            }
          }

          if (selectedRouteId === 'custom' || selectedRouteId === null) {
            // use base route fallback
            const r = await fetchRouteFromOsrm(baseRoute);
            if (mounted) setRoute(r);
          } else {
            // fetch route with stops from backend
            const routeWithStops = await getRouteWithStops(Number(selectedRouteId));
            if (routeWithStops && mounted) {
              await loadRouteFromStops(routeWithStops.stops);
            } else if (mounted) {
              // fallback
              const r = await fetchRouteFromOsrm(baseRoute);
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
          return;
        }
        const rws = await getRouteWithStops(Number(selectedRouteId));
        if (!mounted) return;
        if (rws) {
          const pts = rws.stops.map(s => ({ lat: s.ViDo, lng: s.KinhDo }));
          try {
            const rr = await fetchRouteFromOsrm(pts);
            if (mounted) setRoute(rr);
          } catch {
            if (mounted) setRoute(pts);
          }
        }
      } catch (e) {
        console.warn('Failed to reload route for selectedRouteId', e);
      }
    })();
    return () => { mounted = false; };
  }, [selectedRouteId, simulate, baseRoute]);

  // Start/stop global mock using installGeolocationMock and persist config
  const startGlobalMock = async () => {
    if (!route) return;
    try {
      // options: convert km/h to m/s
      const opts = { speedMps: speedKmh / 3.6, intervalMs: 250, loop, startNow: true };
      const ctrl = installGeolocationMock(route, opts as any);
      // persist full config so GeolocationMockController can pick it up across pages
      try {
        localStorage.setItem('geolocationMockConfig', JSON.stringify({ route, opts }));
        localStorage.setItem('geolocationMock', '1');
      } catch (e) {}
      (window as any).__geoMockController = ctrl;
      setIsGlobalMockActive(true);
    } catch (err) {
      console.error('Failed to start global mock', err);
      alert('Không thể start mock: ' + String(err));
    }
  };

  const stopGlobalMock = () => {
    try {
      (window as any).__geoMockController?.uninstall?.();
    } catch (e) {}
    try { localStorage.removeItem('geolocationMockConfig'); localStorage.removeItem('geolocationMock'); } catch (e) {}
    setIsGlobalMockActive(false);
  };

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
              {isGlobalMockActive ? (
                <button onClick={stopGlobalMock} style={{ marginLeft: 8 }}>Stop global mock</button>
              ) : (
                <button onClick={startGlobalMock} style={{ marginLeft: 8 }}>Start global mock</button>
              )}
            </span>
          </div>
        )}

        {route ? (
          <MapWithGps simulate={simulate} simulateRoute={route} height="600px" simulateSpeedKmh={speedKmh} />
        ) : (
          <p>Loading route...</p>
        )}
      </div>
      <p style={{ marginTop: 12 }}>Tip: append <code>?simulate=1</code> to URL to force simulation.</p>
    </main>
  );
}

"use client";

import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Map as LeafletMap } from 'leaflet';
import { GpsSimulator, Point } from '../mock/gpsSimulator';

// Fix default marker icons for Leaflet
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });
} catch (e) {
  // ignore in environments where require isn't available
}

type Props = {
  simulate?: boolean;
  simulateRoute?: Point[];
  height?: string;
  simulateSpeedKmh?: number; // optional speed in km/h for simulator
};

export default function MapWithGps({ simulate = false, simulateRoute, height = '500px', simulateSpeedKmh }: Props) {
  const [pos, setPos] = useState<Point | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const simRef = useRef<GpsSimulator | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    if (!simulate && 'geolocation' in navigator) {
      // prefer browser geolocation
      watchIdRef.current = navigator.geolocation.watchPosition(
        (p) => setPos({ lat: p.coords.latitude, lng: p.coords.longitude }),
        (err) => {
          console.warn('Geolocation error, fallback to simulator if provided', err);
          if (simulateRoute) startSimulator();
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
      );
    } else {
      startSimulator();
    }

    function startSimulator() {
      if (!simulateRoute || simulateRoute.length < 2) {
        console.warn('simulateRoute missing or too short — simulator not started');
        return;
      }
      const speedMps = simulateSpeedKmh ? simulateSpeedKmh / 3.6 : 6; // convert km/h to m/s
      const sim = new GpsSimulator(simulateRoute, { speedMps, intervalMs: 1000, loop: true });
      sim.onPosition((p) => setPos(p));
      sim.start();
      simRef.current = sim;
    }

    return () => {
      if (watchIdRef.current != null && 'geolocation' in navigator) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      if (simRef.current) {
        simRef.current.stop();
        simRef.current = null;
      }
    };
  }, [simulate, simulateRoute, simulateSpeedKmh]);

  // when position changes, pan map to new position and ensure size invalidated
  useEffect(() => {
    if (!pos) return;
    const map = mapRef.current;
    if (!map) return;
    
    // Check if map container is still valid
    try {
      if (!map.getContainer() || !map.getContainer()._leaflet_id) {
        return;
      }
    } catch (e) {
      return;
    }
    
    try {
      map.panTo([pos.lat, pos.lng]);
      // calling invalidateSize can fix tiled artifacts when container layout changed
      setTimeout(() => {
        try {
          const currentMap = mapRef.current;
          if (currentMap && currentMap.getContainer() && currentMap.getContainer()._leaflet_id) {
            currentMap.invalidateSize();
          }
        } catch (e) {
          // ignore errors
        }
      }, 150);
    } catch (e) {
      // ignore errors
      console.warn('Error panning map:', e);
    }
  }, [pos]);

  const center: [number, number] = pos ? [pos.lat, pos.lng] : [10.7769, 106.6999];

  return (
    <div style={{ height }}>
      <MapContainer
        center={center}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        whenCreated={(map) => {
          mapRef.current = map;
          // ensure correct sizing after mount
          setTimeout(() => {
            try {
              if (map && map.getContainer() && map.getContainer()._leaflet_id) {
                map.invalidateSize();
              }
            } catch (e) {
              console.warn('Error invalidating map size:', e);
            }
          }, 200);
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {pos && <Marker position={[pos.lat, pos.lng]} />}
      </MapContainer>
    </div>
  );
}

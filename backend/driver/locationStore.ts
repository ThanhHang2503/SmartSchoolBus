type DriverPos = { latitude: number; longitude: number; updatedAt: number };

// Simple in-memory store for driver last known positions.
const driverPositions = new Map<number, DriverPos>();

// Recent notifications sent to avoid spamming: key -> timestamp
const recentNotifies = new Map<string, number>();

export const shouldNotify = (key: string, cooldownMs = 5 * 60 * 1000) => {
  const last = recentNotifies.get(key) || 0;
  const now = Date.now();
  if (now - last > cooldownMs) {
    recentNotifies.set(key, now);
    return true;
  }
  return false;
};

export const clearRecentNotifies = () => {
  recentNotifies.clear();
};

export const setDriverPosition = (driverId: number, latitude: number, longitude: number) => {
  driverPositions.set(driverId, { latitude, longitude, updatedAt: Date.now() });
};

export const getDriverPosition = (driverId: number): DriverPos | null => {
  const v = driverPositions.get(driverId);
  return v ?? null;
};

export const getAllDriverPositions = () => {
  const obj: Record<number, DriverPos> = {};
  for (const [k, v] of driverPositions.entries()) obj[k] = v;
  return obj;
};

export const clearDriverPositions = () => {
  driverPositions.clear();
};

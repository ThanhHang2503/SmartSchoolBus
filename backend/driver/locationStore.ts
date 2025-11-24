type DriverPos = { latitude: number; longitude: number; updatedAt: number };

// Simple in-memory store for driver last known positions.
const driverPositions = new Map<number, DriverPos>();

export const setDriverPosition = (driverId: number, latitude: number, longitude: number) => {
  driverPositions.set(driverId, { latitude, longitude, updatedAt: Date.now() });
};

export const getDriverPosition = (driverId: number): DriverPos | null => {
  const v = driverPositions.get(driverId);
  return v ?? null;
};

export const clearDriverPositions = () => {
  driverPositions.clear();
};

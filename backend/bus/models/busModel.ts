export interface ILocation {
  lat: number;
  lng: number;
  address?: string;
  timestamp?: string;
}

export interface IBus {
  id: string;
  plateNumber: string;
  capacity: number;
  status: string;
  location?: ILocation | null;
}

export default class Bus implements IBus {
  id: string;
  plateNumber: string;
  capacity: number;
  status: string;
  location?: ILocation | null;

  constructor({
    id,
    plateNumber,
    capacity,
    status = "idle",
    location = null,
  }: Partial<IBus> & { id: string; plateNumber: string; capacity: number }) {
    this.id = id;
    this.plateNumber = plateNumber;
    this.capacity = capacity;
    this.status = status;
    this.location = location;
  }

  updateLocation(location: ILocation) {
    this.location = {
      ...location,
      timestamp: location.timestamp || new Date().toISOString(),
    };
  }

  setStatus(status: string) {
    this.status = status;
  }

  toJSON() {
    return {
      id: this.id,
      plateNumber: this.plateNumber,
      capacity: this.capacity,
      status: this.status,
      location: this.location,
    };
  }
}

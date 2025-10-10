// models/Bus.tsx

export type BusStatus = 'idle' | 'enroute' | 'maintenance' | 'offline'

export interface ILocation {
  lat: number
  lng: number
  address?: string
  timestamp?: string // ISO
}

export interface IBus {
  id: string
  plateNumber: string
  capacity: number
  status: BusStatus
  currentLocation?: ILocation
  lastUpdated?: string // ISO string
  metadata?: Record<string, any>
}

/**
 * Bus class - model đơn giản cho Bus
 */
export class Bus implements IBus {
  id: string
  plateNumber: string
  capacity: number
  status: BusStatus
  currentLocation?: ILocation
  lastUpdated?: string
  metadata?: Record<string, any>

  constructor(params: {
    id: string
    plateNumber: string
    capacity?: number
    status?: BusStatus
    currentLocation?: ILocation
    metadata?: Record<string, any>
  }) {
    this.id = params.id
    this.plateNumber = params.plateNumber
    this.capacity = params.capacity ?? 0
    this.status = params.status ?? 'idle'
    this.currentLocation = params.currentLocation
    this.lastUpdated = params.currentLocation?.timestamp
    this.metadata = params.metadata
  }

  /** Cập nhật vị trí hiện tại của xe */
  updateLocation(location: ILocation) {
    this.currentLocation = {
      ...location,
      timestamp: location.timestamp ?? new Date().toISOString(),
    }
    this.lastUpdated = this.currentLocation.timestamp
  }

  /** Đổi trạng thái xe */
  setStatus(status: BusStatus) {
    this.status = status
  }

  toJSON() {
    return {
      id: this.id,
      plateNumber: this.plateNumber,
      capacity: this.capacity,
      status: this.status,
      currentLocation: this.currentLocation,
      lastUpdated: this.lastUpdated,
      metadata: this.metadata,
    }
  }
}

export default Bus

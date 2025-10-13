// models/Route.tsx
import type { IStop } from './Student' // tái sử dụng IStop

export interface IRoute {
  id: string
  name: string
  stops: IStop[]
  estimatedDurationMinutes?: number
  distanceMeters?: number
  notes?: string
}

/**
 * Route class - tuyến đường, gồm danh sách stops (điểm đón/trả)
 */
export class Route implements IRoute {
  id: string
  name: string
  stops: IStop[]
  estimatedDurationMinutes?: number
  distanceMeters?: number
  notes?: string

  constructor(params: {
    id: string
    name: string
    stops?: IStop[]
    estimatedDurationMinutes?: number
    distanceMeters?: number
    notes?: string
  }) {
    this.id = params.id
    this.name = params.name
    this.stops = params.stops ?? []
    this.estimatedDurationMinutes = params.estimatedDurationMinutes
    this.distanceMeters = params.distanceMeters
    this.notes = params.notes
  }

  /** Thêm một stop (ở cuối danh sách, sequence tự động) */
  addStop(stop: IStop) {
    const seq = this.stops.length + 1
    stop.sequence = stop.sequence ?? seq
    this.stops.push(stop)
    this.normalizeSequences()
  }

  /** Xóa stop theo id */
  removeStop(stopId: string) {
    this.stops = this.stops.filter((s) => s.id !== stopId)
    this.normalizeSequences()
  }

  /** Sắp xếp lại sequence của các stops */
  normalizeSequences() {
    this.stops = this.stops
      .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0))
      .map((s, idx) => ({ ...s, sequence: idx + 1 }))
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      stops: this.stops,
      estimatedDurationMinutes: this.estimatedDurationMinutes,
      distanceMeters: this.distanceMeters,
      notes: this.notes,
    }
  }
}

export default Route

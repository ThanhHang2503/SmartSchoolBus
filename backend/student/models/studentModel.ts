
export interface IContact {
  name?: string
  phone?: string
  email?: string
}

export interface IStop {
  id: string
  name?: string
  lat: number
  lng: number
  address?: string
  sequence?: number
}


export interface IStudent {
  id: string
  name: string
  grade?: string
  pickupStop?: IStop
  dropStop?: IStop
  parentContact?: IContact
  notes?: string
}

/**
 * Student class - model cho học sinh
 */
export class Student implements IStudent {
  id: string
  name: string
  grade?: string
  pickupStop?: IStop
  dropStop?: IStop
  parentContact?: IContact
  notes?: string

  constructor(params: {
    id: string
    name: string
    grade?: string
    pickupStop?: IStop
    dropStop?: IStop
    parentContact?: IContact
    notes?: string
  }) {
    this.id = params.id
    this.name = params.name
    this.grade = params.grade
    this.pickupStop = params.pickupStop
    this.dropStop = params.dropStop
    this.parentContact = params.parentContact
    this.notes = params.notes
  }

  /** Gán / cập nhật điểm đón */
  setPickupStop(stop: IStop) {
    this.pickupStop = stop
  }

  /** Gán / cập nhật điểm trả */
  setDropStop(stop: IStop) {
    this.dropStop = stop
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      grade: this.grade,
      pickupStop: this.pickupStop,
      dropStop: this.dropStop,
      parentContact: this.parentContact,
      notes: this.notes,
    }
  }
}

export default Student

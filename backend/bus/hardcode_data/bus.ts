import Bus from '../models/busModel'

export const buses = [
  new Bus({
    id: 'bus-01',
    plateNumber: '51B-12345',
    capacity: 40,
    status: 'idle',
  }),
  new Bus({
    id: 'bus-02',
    plateNumber: '51B-67890',
    capacity: 50,
    status: 'idle',
  }),
]

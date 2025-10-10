// example.tsx
import Bus from '../models/Bus'
import { Student } from '../models/Student'
import Route from '../models/Route'

const bus = new Bus({
  id: 'bus-01',
  plateNumber: '51B-12345',
  capacity: 40,
})

const stop1 = { id: 'stop-1', name: 'Cổng A', lat: 10.776889, lng: 106.700806 }
const stop2 = { id: 'stop-2', name: 'Cổng B', lat: 10.778000, lng: 106.701000 }

const route = new Route({ id: 'route-01', name: 'Tuyến A - B' })
route.addStop(stop1)
route.addStop(stop2)

const student = new Student({
  id: 'stu-01',
  name: 'Nguyễn Văn A',
  grade: '3A',
  pickupStop: stop1,
  dropStop: stop2,
  parentContact: { name: 'Bố Nguyễn', phone: '0909123456' },
})

bus.updateLocation({ lat: 10.777, lng: 106.7009, address: 'Trên đường', timestamp: new Date().toISOString() })
bus.setStatus('enroute')

console.log('Bus:', bus.toJSON())
console.log('Route:', route.toJSON())
console.log('Student:', student.toJSON())

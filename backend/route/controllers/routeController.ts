import { Request, Response } from 'express'
import { routes } from '../hardcode_data/routeData'
import { IRoute } from '../models/routeModel'

let routeData: IRoute[] = [...routes] // copy dữ liệu hardcode

// Lấy tất cả route
export const getAllRoutes = (req: Request, res: Response) => {
  res.json(routeData)
};

// Lấy route theo id
export const getRouteById = (req: Request, res: Response) => {
  const { id } = req.params
  const route = routeData.find(r => r.id === id)
  if (!route) {
    return res.status(404).json({ message: 'Route not found' })
  }
  res.json(route)
}

// Thêm mới một route
export const addRoute = (req: Request, res: Response) => {
  const newRoute: IRoute = req.body
  if (!newRoute.id || !newRoute.name) {
    return res.status(400).json({ message: 'Missing id or name' })
  }

  routeData.push(newRoute)
  res.status(201).json({ message: 'Route added successfully', data: newRoute })
}

// Cập nhật route
export const updateRoute = (req: Request, res: Response) => {
  const { id } = req.params
  const index = routeData.findIndex(r => r.id === id)
  if (index === -1) return res.status(404).json({ message: 'Route not found' })

  routeData[index] = { ...routeData[index], ...req.body }
  res.json({ message: 'Route updated', data: routeData[index] })
}

// Xóa route
export const deleteRoute = (req: Request, res: Response) => {
  const { id } = req.params
  const index = routeData.findIndex(r => r.id === id)
  if (index === -1) return res.status(404).json({ message: 'Route not found' })

  const deleted = routeData.splice(index, 1)
  res.json({ message: 'Route deleted', data: deleted[0] })
}

import { Request, Response } from 'express'
import { listOrdersForUser, findOrderById } from '../../repos/order.repo'

export const listOrders = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' })
  const orders = await listOrdersForUser(req.user._id.toString())
  res.json(orders)
}

export const getOrder = async (req: Request, res: Response) => {
  const order = await findOrderById(req.params.id)
  if (!order) return res.status(404).json({ message: 'Order not found' })
  if (order.userId.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' })
  }
  res.json(order)
}

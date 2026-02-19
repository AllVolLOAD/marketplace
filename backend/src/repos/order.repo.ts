import { OrderModel, IOrder } from '../models/order.model'
import { Types } from 'mongoose'
import { releaseStock } from '../lib/reservation'

export const createOrder = (order: Partial<IOrder>) => {
  return OrderModel.create(order)
}

export const findOrderById = (id: string) => {
  if (!Types.ObjectId.isValid(id)) return null
  return OrderModel.findById(id)
}

export const listOrdersForUser = (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) return []
  return OrderModel.find({ userId }).sort({ createdAt: -1 })
}

export const findOrderByStripeSession = (sessionId: string) => {
  return OrderModel.findOne({ 'stripe.sessionId': sessionId })
}

export const updateOrder = (id: string, payload: Partial<IOrder>) => {
  if (!Types.ObjectId.isValid(id)) return null
  return OrderModel.findByIdAndUpdate(id, payload, { new: true })
}

export const releaseExpiredReservations = (cutoff: Date) => {
  return OrderModel.find({
    status: 'pending_payment',
    'reservation.reservedUntil': { $lt: cutoff }
  }).then((orders) => {
    return Promise.all(
      orders.map(async (order) => {
        await Promise.all(
          order.items.map((item) => releaseStock(item.variantId.toString(), item.qty))
        )
        await OrderModel.findByIdAndUpdate(order._id, {
          status: 'payment_failed',
          reservation: { reservedUntil: null }
        })
        return order
      })
    )
  })
}

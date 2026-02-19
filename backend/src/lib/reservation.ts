import { ProductVariantModel } from '../models/variant.model'
import { Types } from 'mongoose'

export const reserveStock = async (
  variantId: string,
  qty: number
): Promise<{ ok: boolean; message?: string }> => {
  if (!Types.ObjectId.isValid(variantId)) {
    return { ok: false, message: 'Invalid variant' }
  }
  const variant = await ProductVariantModel.findOneAndUpdate(
    { _id: variantId, stock: { $gte: qty }, active: true },
    { $inc: { stock: -qty } },
    { new: true }
  )
  if (!variant) return { ok: false, message: 'Insufficient stock or variant missing' }
  return { ok: true }
}

export const releaseStock = async (variantId: string, qty: number) => {
  if (!Types.ObjectId.isValid(variantId)) return
  await ProductVariantModel.findByIdAndUpdate(variantId, { $inc: { stock: qty } })
}

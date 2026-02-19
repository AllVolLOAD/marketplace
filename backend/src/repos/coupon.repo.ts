import { CouponModel } from '../models/coupon.model'

export const findCoupon = (code: string) => {
  return CouponModel.findOne({ code: code.toUpperCase(), active: true })
}

export const listCoupons = () => {
  return CouponModel.find().lean()
}

export const upsertCoupon = (data: Partial<{ code: string; type: string; value: number; expiresAt: Date | null; minSubtotal: number | null; active: boolean }>) => {
  if (!data.code) return null
  return CouponModel.findOneAndUpdate(
    { code: data.code.toUpperCase() },
    data,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )
}

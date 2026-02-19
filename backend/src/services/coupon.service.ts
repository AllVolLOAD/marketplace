import { findCoupon, upsertCoupon } from '../repos/coupon.repo'
import { ICoupon } from '../models/coupon.model'

export const getCoupon = async (code: string): Promise<ICoupon | null> => {
  if (!code) return null
  return findCoupon(code)
}

export const createOrUpdateCoupon = (payload: Partial<ICoupon>) => {
  if (!payload.code) throw new Error('Code required')
  return upsertCoupon(payload)
}

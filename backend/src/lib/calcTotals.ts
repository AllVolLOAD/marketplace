import { IConfiguration } from '../models/configuration.model'
import { ICoupon } from '../models/coupon.model'

type CouponValidation = { valid: boolean; reason?: string }

export const validateCoupon = (coupon: ICoupon | null, subtotal: number): CouponValidation => {
  if (!coupon) return { valid: false, reason: 'Coupon not provided' }
  if (!coupon.active) return { valid: false, reason: 'Coupon inactive' }
  if (coupon.expiresAt && coupon.expiresAt < new Date()) return { valid: false, reason: 'Expired' }
  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) return { valid: false, reason: 'Minimum not met' }
  return { valid: true }
}

export type CalcTotalsResult = {
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
  currency: string
}

export const calcTotals = (
  subtotal: number,
  coupon: ICoupon | null,
  configuration: IConfiguration
): CalcTotalsResult => {
  let discount = 0
  if (coupon) {
    const validation = validateCoupon(coupon, subtotal)
    if (validation.valid) {
      discount =
        coupon.type === 'percent'
          ? Math.round((subtotal * coupon.value) / 100)
          : coupon.value
    }
  }
  const shippingBase = subtotal - discount
  const shipping =
    shippingBase >= configuration.shipping.freeFromSubtotal ? 0 : configuration.shipping.flatRate
  const taxable = shippingBase + shipping
  const tax = Math.round((taxable * configuration.tax.percent) / 100)
  const total = subtotal - discount + shipping + tax
  return {
    subtotal,
    discount,
    shipping,
    tax,
    total,
    currency: configuration.currency
  }
}

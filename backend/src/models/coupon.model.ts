import { Schema, model, Document } from 'mongoose'

export type CouponType = 'percent' | 'fixed'

export interface ICoupon extends Document {
  code: string
  type: CouponType
  value: number
  active: boolean
  expiresAt: Date | null
  minSubtotal: number | null
}

const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true },
    type: { type: String, enum: ['percent', 'fixed'], required: true },
    value: { type: Number, required: true },
    active: { type: Boolean, default: true },
    expiresAt: { type: Date, default: null },
    minSubtotal: { type: Number, default: null }
  },
  { timestamps: true }
)

export const CouponModel = model<ICoupon>('Coupon', couponSchema)

import { Schema, model, Document, Types } from 'mongoose'

export interface OrderItemSnapshot {
  variantId: Types.ObjectId
  skuSnapshot: string
  titleSnapshot: string
  optionsSnapshot: {
    size: string
    color: string
  }
  unitPrice: number
  qty: number
}

export interface OrderAmounts {
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
  currency: string
}

export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'cancelled'
  | 'shipped'
  | 'refunded'
  | 'payment_failed'
  | 'needs_attention'

export interface IOrder extends Document {
  userId: Types.ObjectId
  emailSnapshot: string
  items: OrderItemSnapshot[]
  amounts: OrderAmounts
  coupon: { codeSnapshot: string | null }
  status: OrderStatus
  shippingAddressSnapshot: {
    label: string
    fullName: string
    phone: string
    country: string
    city: string
    zip: string
    line1: string
    line2?: string
  }
  stripe: {
    sessionId: string | null
    paymentIntentId: string | null
    eventIds: string[]
  }
  reservation: {
    reservedUntil: Date | null
  }
  createdAt: Date
  updatedAt: Date
}

const addressSnapshotSchema = new Schema(
  {
    label: { type: String, required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String }
  },
  { _id: false }
)

const orderItemSchema = new Schema<OrderItemSnapshot>(
  {
    variantId: { type: Schema.Types.ObjectId, ref: 'ProductVariant', required: true },
    skuSnapshot: { type: String, required: true },
    titleSnapshot: { type: String, required: true },
    optionsSnapshot: {
      size: { type: String, required: true },
      color: { type: String, required: true }
    },
    unitPrice: { type: Number, required: true },
    qty: { type: Number, required: true }
  },
  { _id: false }
)

const amountsSchema = new Schema<OrderAmounts>(
  {
    subtotal: { type: Number, required: true },
    discount: { type: Number, required: true },
    shipping: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
    currency: { type: String, required: true }
  },
  { _id: false }
)

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    emailSnapshot: { type: String, required: true },
    items: { type: [orderItemSchema], required: true },
    amounts: { type: amountsSchema, required: true },
    coupon: {
      codeSnapshot: { type: String, default: null }
    },
    status: {
      type: String,
      enum: ['pending_payment', 'paid', 'cancelled', 'shipped', 'refunded', 'payment_failed', 'needs_attention'],
      default: 'pending_payment'
    },
    shippingAddressSnapshot: { type: addressSnapshotSchema, required: true },
    stripe: {
      sessionId: { type: String, default: null, sparse: true },
      paymentIntentId: { type: String, default: null },
      eventIds: { type: [String], default: [] }
    },
    reservation: {
      reservedUntil: { type: Date, default: null }
    }
  },
  { timestamps: true }
)

orderSchema.index({ 'stripe.sessionId': 1 }, { sparse: true, unique: true })
orderSchema.index({ userId: 1, createdAt: -1 })

export const OrderModel = model<IOrder>('Order', orderSchema)

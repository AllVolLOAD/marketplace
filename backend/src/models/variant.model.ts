import { Schema, model, Document, Types } from 'mongoose'

export interface VariantOptions {
  size: string
  color: string
}

export interface IProductVariant extends Document {
  productId: Types.ObjectId
  sku: string
  price: number
  currency: string
  options: VariantOptions
  stock: number
  active: boolean
  createdAt: Date
  updatedAt: Date
}

const VariantOptionsSchema = new Schema<VariantOptions>(
  {
    size: { type: String, required: true },
    color: { type: String, required: true }
  },
  { _id: false }
)

const productVariantSchema = new Schema<IProductVariant>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    sku: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    options: { type: VariantOptionsSchema, required: true },
    stock: { type: Number, required: true, min: 0 },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
)

productVariantSchema.index({ sku: 1 }, { unique: true })
productVariantSchema.index(
  { productId: 1, 'options.size': 1, 'options.color': 1 },
  { unique: true, sparse: true }
)

export const ProductVariantModel = model<IProductVariant>('ProductVariant', productVariantSchema)

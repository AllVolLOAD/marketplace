import { Schema, model, Document } from 'mongoose'

export interface IProduct extends Document {
  title: string
  description: string
  slug: string
  images: string[]
  categories: string[]
  tags: string[]
  active: boolean
  createdAt: Date
  updatedAt: Date
}

const productSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    images: { type: [String], default: [] },
    categories: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
)

productSchema.index({ title: 'text', tags: 'text', description: 'text' })

export const ProductModel = model<IProduct>('Product', productSchema)

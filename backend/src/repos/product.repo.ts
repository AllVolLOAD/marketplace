import { ProductModel, IProduct } from '../models/product.model'
import { ProductVariantModel, IProductVariant } from '../models/variant.model'
import { Types } from 'mongoose'

export const listProducts = async (filters: {
  category?: string
  tag?: string
  q?: string
  limit?: number
  offset?: number
}) => {
  const query: Record<string, any> = { active: true }
  if (filters.category) query.categories = filters.category
  if (filters.tag) query.tags = filters.tag
  if (filters.q) query.$text = { $search: filters.q }

  const cursor = ProductModel.find(query)
    .sort({ createdAt: -1 })
    .skip(filters.offset ?? 0)
    .limit(filters.limit ?? 20)

  return cursor.lean()
}

export const findProductBySlug = async (slug: string) => {
  return ProductModel.findOne({ slug, active: true }).lean()
}

export const createProduct = (payload: Partial<IProduct>) => {
  return ProductModel.create(payload)
}

export const findVariantsByProduct = async (productId: string) => {
  if (!Types.ObjectId.isValid(productId)) return []
  return ProductVariantModel.find({ productId, active: true }).lean()
}

export const findVariantById = (id: string) => {
  if (!Types.ObjectId.isValid(id)) return null
  return ProductVariantModel.findById(id)
}

export const createVariant = (payload: Partial<IProductVariant>) => {
  return ProductVariantModel.create(payload)
}

export const updateVariantStock = async (id: string, delta: number) => {
  if (!Types.ObjectId.isValid(id)) return null
  return ProductVariantModel.findByIdAndUpdate(
    id,
    { $inc: { stock: delta } },
    { new: true }
  )
}

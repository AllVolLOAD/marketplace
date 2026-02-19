import { Request, Response } from 'express'
import { getProducts, getProductDetail } from '../../services/product.service'

export const listProductsHandler = async (req: Request, res: Response) => {
  const { limit, offset, category, tag, q } = req.query
  const results = await getProducts({
    limit: Number(limit) || 20,
    offset: Number(offset) || 0,
    category: typeof category === 'string' ? category : undefined,
    tag: typeof tag === 'string' ? tag : undefined,
    q: typeof q === 'string' ? q : undefined
  })
  res.json(results)
}

export const getProductBySlug = async (req: Request, res: Response) => {
  const product = await getProductDetail(req.params.slug)
  if (!product) {
    return res.status(404).json({ message: 'Product not found' })
  }
  res.json(product)
}

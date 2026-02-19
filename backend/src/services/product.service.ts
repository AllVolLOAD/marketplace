import {
  listProducts,
  findProductBySlug,
  findVariantsByProduct
} from '../repos/product.repo'

export const getProducts = async (filters: Parameters<typeof listProducts>[0]) => {
  const products = await listProducts(filters)
  return Promise.all(
    products.map(async (product) => ({
      ...product,
      variants: await findVariantsByProduct(product._id.toString())
    }))
  )
}

export const getProductDetail = async (slug: string) => {
  const product = await findProductBySlug(slug)
  if (!product) return null
  const variants = await findVariantsByProduct(product._id.toString())
  return {
    ...product,
    variants
  }
}

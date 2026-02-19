import mongoose from 'mongoose'
import { config } from '../config'
import { ProductModel } from '../models/product.model'
import { ProductVariantModel } from '../models/variant.model'
import { ConfigurationModel } from '../models/configuration.model'
import { CouponModel } from '../models/coupon.model'

const products = [
  { title: 'Classic Tee', description: 'Soft cotton tee', categories: ['tops'], tags: ['casual'], slug: 'classic-tee' },
  { title: 'Logo Hoodie', description: 'Warm hoodie', categories: ['hoodies'], tags: ['warm', 'brand'], slug: 'logo-hoodie' },
  { title: 'Denim Jacket', description: 'Retro denim jacket', categories: ['outerwear'], tags: ['denim'], slug: 'denim-jacket' }
]

const sizes = ['S', 'M', 'L', 'XL']
const colors = ['Black', 'White', 'Olive']

export const runSeed = async () => {
  await mongoose.connect(config.mongoUri)
  await Promise.all([ProductModel.deleteMany({}), ProductVariantModel.deleteMany({}), ConfigurationModel.deleteMany({}), CouponModel.deleteMany({})])

  for (const product of products) {
    const created = await ProductModel.create({
      ...product,
      images: [`https://dummyimage.com/640x480/111/fff&text=${encodeURIComponent(product.title)}`],
      active: true
    })
    for (const size of sizes) {
      for (const color of colors) {
        await ProductVariantModel.create({
          productId: created._id,
          sku: `${created.slug}-${size}-${color}`.toUpperCase(),
          price: 2500 + Math.floor(Math.random() * 2000),
          currency: 'USD',
          options: { size, color },
          stock: 20,
          active: true
        })
      }
    }
  }

  await ConfigurationModel.create({
    shipping: { flatRate: 500, freeFromSubtotal: 10000 },
    tax: { percent: 8 },
    currency: 'USD'
  })

  await CouponModel.create([
    { code: 'SAVE10', type: 'percent', value: 10, active: true, expiresAt: null, minSubtotal: 2000 },
    { code: 'FLAT5', type: 'fixed', value: 500, active: true, expiresAt: null, minSubtotal: 5000 }
  ])

  console.log('Seed finished')
}

if (require.main === module) {
  runSeed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}

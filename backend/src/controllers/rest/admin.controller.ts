import { Request, Response } from 'express'
import { createProduct } from '../../repos/product.repo'
import { createVariant } from '../../repos/product.repo'
import { createOrUpdateCoupon } from '../../services/coupon.service'
import { updateConfiguration } from '../../services/configuration.service'

export const createProductHandler = async (req: Request, res: Response) => {
  const product = await createProduct(req.body)
  res.status(201).json(product)
}

export const createVariantHandler = async (req: Request, res: Response) => {
  const variant = await createVariant(req.body)
  res.status(201).json(variant)
}

export const upsertCouponHandler = async (req: Request, res: Response) => {
  const coupon = await createOrUpdateCoupon(req.body)
  res.json(coupon)
}

export const updateConfigurationHandler = async (req: Request, res: Response) => {
  const configuration = await updateConfiguration(req.body)
  res.json(configuration)
}

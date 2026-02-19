import { Request, Response } from 'express'
import { buildQuote, createCheckoutSession } from '../../services/checkout.service'

export const getQuote = async (req: Request, res: Response) => {
  try {
    const { items, couponCode } = req.body
    const quote = await buildQuote(items, couponCode)
    res.json(quote)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const createStripeSession = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' })
    const { address, items, couponCode } = req.body
    const result = await createCheckoutSession(
      req.user._id.toString(),
      req.user.email,
      address,
      items,
      couponCode
    )
    res.json(result)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

import { Request, Response } from 'express'
import Stripe from 'stripe'
import { config } from '../../config'
import { handleStripeWebhook } from '../../services/checkout.service'

const stripe = new Stripe(config.stripeSecret, {
  apiVersion: '2022-11-15'
})

export const stripeWebhookHandler = async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature']
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature ?? '',
      config.stripeWebhookSecret
    )
    await handleStripeWebhook(event)
    res.json({ received: true })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const stripeSuccess = (req: Request, res: Response) => {
  return res.json({ status: 'success', orderId: req.query.orderId })
}

export const stripeCancel = (req: Request, res: Response) => {
  return res.json({ status: 'cancel', orderId: req.query.orderId })
}

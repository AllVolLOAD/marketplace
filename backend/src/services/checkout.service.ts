import Stripe from 'stripe'
import { config } from '../config'
import { findVariantById } from '../repos/product.repo'
import { calcTotals, CalcTotalsResult } from '../lib/calcTotals'
import { getCoupon } from './coupon.service'
import { fetchConfiguration } from './configuration.service'
import { reserveStock } from '../lib/reservation'
import { createOrder, updateOrder, findOrderByStripeSession } from '../repos/order.repo'
import { Types } from 'mongoose'

const stripeClient = new Stripe(config.stripeSecret, {
  apiVersion: '2022-11-15'
})

export type QuoteItem = {
  variantId: string
  qty: number
}

const expandItems = async (items: QuoteItem[]) => {
  const details = await Promise.all(
    items.map(async (item) => {
      const variant = await findVariantById(item.variantId)
      if (!variant) throw new Error('Variant missing')
      return {
        variant,
        qty: item.qty
      }
    })
  )
  return details
}

export const buildQuote = async (items: QuoteItem[], couponCode?: string): Promise<CalcTotalsResult> => {
  const configuration = await fetchConfiguration()
  if (!configuration) throw new Error('Configuration missing')
  const lineup = await expandItems(items)
  const subtotal = lineup.reduce((acc, curr) => acc + curr.variant.price * curr.qty, 0)
  const coupon = couponCode ? await getCoupon(couponCode) : null
  return calcTotals(subtotal, coupon, configuration)
}

export const createCheckoutSession = async (
  userId: string,
  email: string,
  address: Record<string, string>,
  items: QuoteItem[],
  couponCode?: string
) => {
  const configuration = await fetchConfiguration()
  if (!configuration) throw new Error('Configuration missing')
  const lineup = await expandItems(items)
  const coupon = couponCode ? await getCoupon(couponCode) : null
  const subtotal = lineup.reduce((acc, curr) => acc + curr.variant.price * curr.qty, 0)
  const totals = calcTotals(subtotal, coupon, configuration)

  for (const entry of lineup) {
    const reservation = await reserveStock(entry.variant._id.toString(), entry.qty)
    if (!reservation.ok) throw new Error(reservation.message)
  }

  const order = await createOrder({
    userId: new Types.ObjectId(userId),
    emailSnapshot: email,
    items: lineup.map((entry) => ({
      variantId: entry.variant._id,
      skuSnapshot: entry.variant.sku,
      titleSnapshot: entry.variant.sku,
      optionsSnapshot: entry.variant.options,
      unitPrice: entry.variant.price,
      qty: entry.qty
    })),
    amounts: {
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping: totals.shipping,
      tax: totals.tax,
      total: totals.total,
      currency: totals.currency
    },
    coupon: { codeSnapshot: coupon?.code ?? null },
    status: 'pending_payment',
    shippingAddressSnapshot: {
      label: address.label ?? 'shipping',
      fullName: address.fullName ?? '',
      phone: address.phone ?? '',
      country: address.country ?? '',
      city: address.city ?? '',
      zip: address.zip ?? '',
      line1: address.line1 ?? '',
      line2: address.line2
    },
    stripe: { sessionId: null, paymentIntentId: null, eventIds: [] },
    reservation: { reservedUntil: new Date(Date.now() + 30 * 60000) }
  })

  const session = await stripeClient.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: lineup.map((entry) => ({
      price_data: {
        currency: entry.variant.currency ?? configuration.currency,
        product_data: {
          name: `${entry.variant.sku}`
        },
        unit_amount: entry.variant.price
      },
      quantity: entry.qty
    })),
    customer_email: email,
    success_url: `${config.clientUrl}/stripe/success?orderId=${order._id}`,
    cancel_url: `${config.clientUrl}/stripe/cancel?orderId=${order._id}`
  })

  await updateOrder(order._id.toString(), {
    stripe: { ...order.stripe, sessionId: session.id }
  })

  return { url: session.url, orderId: order._id.toString(), sessionId: session.id, totals }
}

export const handleStripeWebhook = async (event: Stripe.Event) => {
  if (event.type !== 'checkout.session.completed') return
  const session = event.data.object as Stripe.Checkout.Session
  const order = await findOrderByStripeSession(session.id ?? '')
  if (!order) return
  if (order.status === 'paid') return
  const paymentIntentId =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id ?? null
  await updateOrder(order._id.toString(), {
    status: 'paid',
    stripe: {
      ...order.stripe,
      paymentIntentId,
      eventIds: [...(order.stripe.eventIds ?? []), event.id]
    },
    reservation: { reservedUntil: null }
  })
}

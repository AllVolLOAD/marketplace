import { Router } from 'express'
import {
  registerUser,
  loginUser,
  getProfile
} from '../controllers/rest/auth.controller'
import {
  listProductsHandler,
  getProductBySlug
} from '../controllers/rest/product.controller'
import { getQuote, createStripeSession } from '../controllers/rest/checkout.controller'
import { listOrders, getOrder } from '../controllers/rest/order.controller'
import {
  createProductHandler,
  createVariantHandler,
  upsertCouponHandler,
  updateConfigurationHandler
} from '../controllers/rest/admin.controller'
import {
  stripeWebhookHandler,
  stripeSuccess,
  stripeCancel
} from '../controllers/rest/stripe.controller'
import { authenticate, requireAdmin } from '../middleware/auth.middleware'

const router = Router()

router.post('/auth/register', registerUser)
router.post('/auth/login', loginUser)
router.get('/auth/me', authenticate, getProfile)

router.get('/products', listProductsHandler)
router.get('/products/:slug', getProductBySlug)

router.post('/checkout/quote', getQuote)
router.post('/stripe/create-checkout-session', authenticate, createStripeSession)

router.get('/orders', authenticate, listOrders)
router.get('/orders/:id', authenticate, getOrder)

router.post('/admin/products', authenticate, requireAdmin, createProductHandler)
router.post('/admin/variants', authenticate, requireAdmin, createVariantHandler)
router.post('/admin/coupons', authenticate, requireAdmin, upsertCouponHandler)
router.put('/admin/configuration', authenticate, requireAdmin, updateConfigurationHandler)

router.post('/stripe/webhook', stripeWebhookHandler)
router.get('/stripe/success', stripeSuccess)
router.get('/stripe/cancel', stripeCancel)

export default router

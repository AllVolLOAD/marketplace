import dotenv from 'dotenv'

dotenv.config()

export const config = {
  port: Number(process.env.PORT ?? 4000),
  mongoUri: process.env.MONGO_URI ?? 'mongodb://localhost:27017/store',
  jwtSecret: process.env.JWT_SECRET ?? 'change_me',
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:3000',
  serverUrl: process.env.SERVER_URL ?? 'http://localhost:4000',
  stripeSecret: process.env.STRIPE_SECRET_KEY ?? '',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? ''
}

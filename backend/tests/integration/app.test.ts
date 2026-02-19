jest.mock('stripe')

import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

let app: import('express').Application
let mongod: MongoMemoryServer

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  process.env.MONGO_URI = mongod.getUri()
  const { runSeed } = await import('../../src/seed/seed')
  await runSeed()
  const { createApp } = await import('../../src/app')
  app = await createApp()
})

afterAll(async () => {
  await mongoose.disconnect()
  if (mongod) await mongod.stop()
})

describe('REST integration', () => {
  let token = ''
  it('allows register and login', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: 'secret', name: 'Tester' })
      .expect(201)
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'secret' })
      .expect(200)
    expect(login.body.token).toBeTruthy()
    token = login.body.token
  })

  it('lists products', async () => {
    const res = await request(app).get('/api/products').expect(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThan(0)
  })

  it('calculates quote and stripe session', async () => {
    const resProducts = await request(app).get('/api/products')
    const variantId = resProducts.body[0].variants[0]._id
    const address = {
      label: 'Home',
      fullName: 'Test User',
      phone: '1234567890',
      country: 'US',
      city: 'City',
      zip: '00000',
      line1: '123 Street'
    }
    const quote = await request(app)
      .post('/api/checkout/quote')
      .send({ items: [{ variantId, qty: 1 }], couponCode: 'SAVE10' })
      .expect(200)
    expect(quote.body.total).toBeGreaterThan(0)

    const session = await request(app)
      .post('/api/stripe/create-checkout-session')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: [{ variantId, qty: 1 }], address })
      .expect(200)
    expect(session.body.url).toContain('https://checkout.mock')

    await request(app)
      .post('/api/stripe/webhook')
      .set('stripe-signature', 'test')
      .send({
        type: 'checkout.session.completed',
        data: { object: { id: 'cs_mock' } }
      })
      .expect(200)
  })
})

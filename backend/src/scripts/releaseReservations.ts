import mongoose from 'mongoose'
import { config } from '../config'
import { releaseExpiredReservations } from '../repos/order.repo'

const run = async () => {
  await mongoose.connect(config.mongoUri)
  const cutoff = new Date(Date.now() - 30 * 60 * 1000)
  const orders = await releaseExpiredReservations(cutoff)
  console.log(`Released ${orders.length} reservations`)
  process.exit(0)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})

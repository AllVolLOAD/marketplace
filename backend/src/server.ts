import mongoose from 'mongoose'
import { config } from './config'
import { createApp } from './app'

const start = async () => {
  await mongoose.connect(config.mongoUri)
  const app = await createApp()
  app.listen(config.port, () => {
    console.log(`Backend listening on http://localhost:${config.port}`)
  })
}

start().catch((error) => {
  console.error('Failed to start server', error)
  process.exit(1)
})

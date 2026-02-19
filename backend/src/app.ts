import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { ApolloServer } from 'apollo-server-express'
import restRoutes from './routes/rest.routes'
import { typeDefs, resolvers } from './graphql'
import { verifyToken } from './services/auth.service'

export const createApp = async () => {
  const app = express()
  app.use(cors())
  app.use(helmet())
  app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use('/api', restRoutes)

  const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const header = req.headers.authorization ?? ''
      const token = header.startsWith('Bearer ') ? header.slice(7) : ''
      const user = token ? await verifyToken(token) : null
      return {
        user: user
          ? {
              id: user._id.toString(),
              email: user.email,
              name: user.name,
              role: user.role
            }
          : null
      }
    }
  })
  await apollo.start()
  apollo.applyMiddleware({ app: app as any, path: '/graphql' })
  return app
}

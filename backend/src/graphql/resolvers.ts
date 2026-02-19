import { ApolloError } from 'apollo-server-errors'
import { GraphQLResolveInfo } from 'graphql'
import { authenticate as authLogin, register as authRegister } from '../services/auth.service'
import { buildQuote, createCheckoutSession } from '../services/checkout.service'
import { getProducts, getProductDetail } from '../services/product.service'
import { fetchConfiguration } from '../services/configuration.service'
import { listOrdersForUser, findOrderById } from '../repos/order.repo'
import { getCoupon } from '../services/coupon.service'
import { QuoteItem } from '../services/checkout.service'

interface GraphQLContext {
  user?: { id: string; email: string; name: string; role: string }
  req?: any
}

export const resolvers = {
  Query: {
    profile: (_: unknown, __: unknown, context: GraphQLContext) => {
      if (!context.user) throw new ApolloError('Unauthorized', 'UNAUTHENTICATED')
      return context.user
    },
    configuration: async () => {
      const config = await fetchConfiguration()
      return config
    },
    products: async (_: unknown, args: any) => {
      return getProducts(args)
    },
    product: async (_: unknown, { slug }: { slug: string }) => {
      return getProductDetail(slug)
    },
    myOrders: async (_: unknown, __: unknown, context: GraphQLContext) => {
      if (!context.user) throw new ApolloError('Unauthorized', 'UNAUTHENTICATED')
      return listOrdersForUser(context.user.id)
    },
    order: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
      if (!context.user) throw new ApolloError('Unauthorized', 'UNAUTHENTICATED')
      const order = await findOrderById(id)
      if (!order) return null
      if (order.userId.toString() !== context.user.id && context.user.role !== 'admin') {
        throw new ApolloError('Forbidden', 'FORBIDDEN')
      }
      return order
    }
  },
  Mutation: {
    login: async (_: unknown, { email, password }: { email: string; password: string }) => {
      return authLogin(email, password)
    },
    createUser: async (_: unknown, { email, password, name }: { email: string; password: string; name: string }) => {
      const user = await authRegister(email, password, name)
      return {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    },
    placeOrder: async (_: unknown, { input }: { input: { items: QuoteItem[]; couponCode?: string; address: any } }, context: GraphQLContext) => {
      if (!context.user) throw new ApolloError('Unauthorized', 'UNAUTHENTICATED')
      const result = await createCheckoutSession(
        context.user.id,
        context.user.email,
        input.address,
        input.items,
        input.couponCode
      )
      return { url: result.url, orderId: result.orderId }
    },
    applyCoupon: async (_: unknown, { code }: { code: string }) => {
      const coupon = await getCoupon(code)
      if (!coupon) throw new ApolloError('Not found', 'NOT_FOUND')
      return coupon
    }
  },
  Product: {
    id: (parent: any) => parent._id,
    variants: async (parent: any) => parent.variants ?? []
  },
  Variant: {
    id: (parent: any) => parent._id
  },
  User: {
    id: (parent: any) => parent._id
  },
  Order: {
    id: (parent: any) => parent._id,
    amounts: (parent: any) => parent.amounts,
    items: (parent: any) => parent.items,
    shippingAddress: (parent: any) => parent.shippingAddressSnapshot
  }
}

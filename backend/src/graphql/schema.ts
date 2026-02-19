import { gql } from 'apollo-server-express'

export const typeDefs = gql`
  type Query {
    profile: User
    configuration: Configuration
    products(limit: Int, offset: Int, category: String, tag: String, q: String): [Product!]!
    product(slug: String!): Product
    myOrders: [Order!]!
    order(id: ID!): Order
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload!
    createUser(email: String!, password: String!, name: String!): User!
    placeOrder(input: PlaceOrderInput!): CheckoutPayload!
    applyCoupon(code: String!): Coupon!
  }

  type User {
    id: ID!
    email: String!
    name: String!
    role: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Variant {
    id: ID!
    sku: String!
    price: Float!
    currency: String!
    stock: Int!
    options: VariantOptions!
  }

  type VariantOptions {
    size: String!
    color: String!
  }

  type Product {
    id: ID!
    title: String!
    description: String!
    slug: String!
    images: [String!]!
    categories: [String!]!
    tags: [String!]!
    variants: [Variant!]!
  }

  type Configuration {
    shipping: Shipping!
    tax: Tax!
    currency: String!
  }

  type Shipping {
    flatRate: Float!
    freeFromSubtotal: Float!
  }

  type Tax {
    percent: Float!
  }

  type Order {
    id: ID!
    status: String!
    amounts: Amounts!
    items: [OrderItem!]!
    shippingAddress: ShippingAddress!
  }

  type OrderItem {
    titleSnapshot: String!
    optionsSnapshot: VariantOptions!
    qty: Int!
    unitPrice: Float!
  }

  type Amounts {
    subtotal: Float!
    discount: Float!
    shipping: Float!
    tax: Float!
    total: Float!
    currency: String!
  }

  type ShippingAddress {
    label: String!
    fullName: String!
    phone: String!
    country: String!
    city: String!
    zip: String!
    line1: String!
    line2: String
  }

  input PlaceOrderInput {
    items: [OrderItemInput!]!
    couponCode: String
    address: ShippingAddressInput!
  }

  input OrderItemInput {
    variantId: ID!
    qty: Int!
  }

  input ShippingAddressInput {
    label: String!
    fullName: String!
    phone: String!
    country: String!
    city: String!
    zip: String!
    line1: String!
    line2: String
  }

  type CheckoutPayload {
    url: String!
    orderId: ID!
  }

  type Coupon {
    code: String!
    type: String!
    value: Float!
    active: Boolean!
  }
`

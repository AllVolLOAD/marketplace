export class Webhook {
  static constructEvent(body: any, sig: string, secret: string) {
    return body
  }
}

export class CheckoutSessions {
  async create(args: any) {
    return {
      url: 'https://checkout.mock/success',
      id: 'cs_mock'
    }
  }
}

export class Stripe {
  checkout = {
    sessions: new CheckoutSessions()
  }
  static webhooks = Webhook
  constructor(secret: string, opts: any) {
    // noop
  }
}

export default Stripe

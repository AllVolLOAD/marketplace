import { calcTotals, validateCoupon } from '../../src/lib/calcTotals'

const configuration = {
  shipping: { flatRate: 500, freeFromSubtotal: 1000 },
  tax: { percent: 10 },
  currency: 'USD'
} as const

describe('calcTotals', () => {
  it('calculates shipping and tax correctly', () => {
    const subtotal = 1500
    const result = calcTotals(subtotal, null, configuration)
    expect(result.shipping).toBe(0)
    expect(result.tax).toBe(Math.round((subtotal * 0.1)))
    expect(result.total).toBe(result.subtotal + result.tax)
  })

  it('applies percent coupon', () => {
    const coupon = {
      code: 'SAVE10',
      type: 'percent' as const,
      value: 10,
      active: true,
      expiresAt: null,
      minSubtotal: null
    }
    const subtotal = 2000
    const result = calcTotals(subtotal, coupon as any, configuration)
    expect(result.discount).toBe(Math.round(2000 * 0.1))
  })

  it('validates coupon min subtotal', () => {
    const coupon = {
      code: 'MIN100',
      type: 'fixed' as const,
      value: 100,
      active: true,
      expiresAt: null,
      minSubtotal: 3000
    }
    const validation = validateCoupon(coupon as any, 2000)
    expect(validation.valid).toBe(false)
  })
})

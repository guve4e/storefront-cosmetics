import { describe, expect, it } from 'vitest'
import { AnalyticsEvent } from '../../../app/analytics/events/events'
import { analyticsRegistry } from '../../../app/analytics/registry/analytics-registry'

describe('analytics registry', () => {
  it('registers every analytics event', () => {
    for (const event of Object.values(AnalyticsEvent)) {
      expect(analyticsRegistry[event]).toBeTruthy()
      expect(analyticsRegistry[event].event).toBe(event)
      expect(analyticsRegistry[event].version).toBeGreaterThan(0)
      expect(typeof analyticsRegistry[event].validate).toBe('function')
    }
  })

  it('accepts a valid product analytics payload', () => {
    expect(() =>
      analyticsRegistry[AnalyticsEvent.AddToCart].validate({
        productId: 'local-hydrating',
        slug: 'hydrating',
        variant: 'local-hydrating',
        price: 44.99,
        quantity: 1,
        currency: 'EUR',
      }),
    ).not.toThrow()
  })

  it('rejects an invalid product analytics payload', () => {
    expect(() =>
      analyticsRegistry[AnalyticsEvent.AddToCart].validate({
        slug: 'hydrating',
      }),
    ).toThrow(/Analytics validation failed/)
  })

  it('accepts a valid checkout analytics payload', () => {
    expect(() =>
      analyticsRegistry[AnalyticsEvent.PaymentSelected].validate({
        paymentMethod: 'cash-on-delivery',
      }),
    ).not.toThrow()
  })

  it('rejects invalid checkout analytics payload shape', () => {
    expect(() =>
      analyticsRegistry[AnalyticsEvent.PaymentSelected].validate('cash'),
    ).toThrow(/payload must be an object/)
  })

  it('accepts a valid order analytics payload', () => {
    expect(() =>
      analyticsRegistry[AnalyticsEvent.OrderCompleted].validate({
        orderId: 'order_123',
        total: 89.98,
        currency: 'EUR',
        items: [
          {
            productId: 'local-hydrating',
            slug: 'hydrating',
            variant: 'local-hydrating',
            price: 44.99,
            quantity: 2,
          },
        ],
      }),
    ).not.toThrow()
  })

  it('rejects invalid order analytics payload', () => {
    expect(() =>
      analyticsRegistry[AnalyticsEvent.OrderCompleted].validate({
        orderId: 'order_123',
        total: 89.98,
      }),
    ).toThrow(/Analytics validation failed/)
  })
})

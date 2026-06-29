import { AnalyticsEvent } from '../events/events'
import {
  cartPayload,
  checkoutPayload,
  optionalObject,
  orderPayload,
  productPayload,
} from './validators'

export type AnalyticsEventCategory =
  | 'navigation'
  | 'commerce'
  | 'checkout'
  | 'order'
  | 'aurora'

export interface AnalyticsRegistryEntry {
  event: AnalyticsEvent
  version: number
  category: AnalyticsEventCategory
  validate: (payload: unknown) => void
}

export const analyticsRegistry: Record<AnalyticsEvent, AnalyticsRegistryEntry> = {
  [AnalyticsEvent.PageView]: {
    event: AnalyticsEvent.PageView,
    version: 1,
    category: 'navigation',
    validate: optionalObject(AnalyticsEvent.PageView),
  },

  [AnalyticsEvent.ProductView]: {
    event: AnalyticsEvent.ProductView,
    version: 1,
    category: 'commerce',
    validate: productPayload(AnalyticsEvent.ProductView),
  },

  [AnalyticsEvent.AddToCart]: {
    event: AnalyticsEvent.AddToCart,
    version: 1,
    category: 'commerce',
    validate: productPayload(AnalyticsEvent.AddToCart),
  },

  [AnalyticsEvent.RemoveFromCart]: {
    event: AnalyticsEvent.RemoveFromCart,
    version: 1,
    category: 'commerce',
    validate: productPayload(AnalyticsEvent.RemoveFromCart),
  },

  [AnalyticsEvent.CartView]: {
    event: AnalyticsEvent.CartView,
    version: 1,
    category: 'commerce',
    validate: cartPayload(AnalyticsEvent.CartView),
  },

  [AnalyticsEvent.CheckoutStarted]: {
    event: AnalyticsEvent.CheckoutStarted,
    version: 1,
    category: 'checkout',
    validate: checkoutPayload(AnalyticsEvent.CheckoutStarted),
  },

  [AnalyticsEvent.DeliverySelected]: {
    event: AnalyticsEvent.DeliverySelected,
    version: 1,
    category: 'checkout',
    validate: checkoutPayload(AnalyticsEvent.DeliverySelected),
  },

  [AnalyticsEvent.PaymentSelected]: {
    event: AnalyticsEvent.PaymentSelected,
    version: 1,
    category: 'checkout',
    validate: checkoutPayload(AnalyticsEvent.PaymentSelected),
  },

  [AnalyticsEvent.CheckoutReview]: {
    event: AnalyticsEvent.CheckoutReview,
    version: 1,
    category: 'checkout',
    validate: checkoutPayload(AnalyticsEvent.CheckoutReview),
  },

  [AnalyticsEvent.OrderCreated]: {
    event: AnalyticsEvent.OrderCreated,
    version: 1,
    category: 'order',
    validate: orderPayload(AnalyticsEvent.OrderCreated),
  },

  [AnalyticsEvent.OrderCompleted]: {
    event: AnalyticsEvent.OrderCompleted,
    version: 1,
    category: 'order',
    validate: orderPayload(AnalyticsEvent.OrderCompleted),
  },

  [AnalyticsEvent.AuroraStarted]: {
    event: AnalyticsEvent.AuroraStarted,
    version: 1,
    category: 'aurora',
    validate: optionalObject(AnalyticsEvent.AuroraStarted),
  },

  [AnalyticsEvent.AuroraRecommendation]: {
    event: AnalyticsEvent.AuroraRecommendation,
    version: 1,
    category: 'aurora',
    validate: optionalObject(AnalyticsEvent.AuroraRecommendation),
  },

  [AnalyticsEvent.AuroraAddToCart]: {
    event: AnalyticsEvent.AuroraAddToCart,
    version: 1,
    category: 'aurora',
    validate: productPayload(AnalyticsEvent.AuroraAddToCart),
  },
}

export function getAnalyticsRegistryEntry(event: AnalyticsEvent) {
  return analyticsRegistry[event]
}

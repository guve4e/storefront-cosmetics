import { AnalyticsService } from './analytics'
import { AnalyticsEvent } from '../events/events'
import type {
  ProductAnalyticsPayload,
  CheckoutAnalyticsPayload,
  OrderAnalyticsPayload,
} from '../events/payloads'

export class DomainAnalytics {
  constructor(private readonly analytics: AnalyticsService) {}

  pageViewed(payload?: Record<string, unknown>) {
    return this.analytics.page(payload)
  }

  productViewed(product: ProductAnalyticsPayload) {
    return this.analytics.track(AnalyticsEvent.ProductView, product)
  }

  addedToCart(product: ProductAnalyticsPayload) {
    return this.analytics.track(AnalyticsEvent.AddToCart, product)
  }

  removedFromCart(product: ProductAnalyticsPayload) {
    return this.analytics.track(AnalyticsEvent.RemoveFromCart, product)
  }

  cartViewed(payload?: { items: number; total?: number; currency?: string }) {
    return this.analytics.track(AnalyticsEvent.CartView, payload)
  }

  checkoutStarted(payload?: CheckoutAnalyticsPayload) {
    return this.analytics.track(AnalyticsEvent.CheckoutStarted, payload)
  }

  deliverySelected(payload: CheckoutAnalyticsPayload) {
    return this.analytics.track(AnalyticsEvent.DeliverySelected, payload)
  }

  paymentSelected(payload: CheckoutAnalyticsPayload) {
    return this.analytics.track(AnalyticsEvent.PaymentSelected, payload)
  }

  checkoutReviewed(payload?: CheckoutAnalyticsPayload) {
    return this.analytics.track(AnalyticsEvent.CheckoutReview, payload)
  }

  orderCreated(order: OrderAnalyticsPayload) {
    return this.analytics.track(AnalyticsEvent.OrderCreated, order)
  }

  orderCompleted(order: OrderAnalyticsPayload) {
    return this.analytics.track(AnalyticsEvent.OrderCompleted, order)
  }

  auroraStarted(payload?: Record<string, unknown>) {
    return this.analytics.track(AnalyticsEvent.AuroraStarted, payload)
  }

  auroraRecommendation(payload?: Record<string, unknown>) {
    return this.analytics.track(AnalyticsEvent.AuroraRecommendation, payload)
  }

  auroraAddedToCart(product: ProductAnalyticsPayload) {
    return this.analytics.track(AnalyticsEvent.AuroraAddToCart, product)
  }

  identify(user: Parameters<AnalyticsService['identify']>[0]) {
    return this.analytics.identify(user)
  }

  reset() {
    return this.analytics.reset()
  }
}

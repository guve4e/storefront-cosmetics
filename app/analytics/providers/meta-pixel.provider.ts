import type { AnalyticsProvider } from './analytics-provider'
import type { AnalyticsEnvelope, IdentifyPayload } from '../types/analytics'
import { AnalyticsEvent } from '../events/events'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    _fbq?: unknown
  }
}

const metaEventMap: Partial<Record<AnalyticsEvent, string>> = {
  [AnalyticsEvent.PageView]: 'PageView',
  [AnalyticsEvent.ProductView]: 'ViewContent',
  [AnalyticsEvent.AddToCart]: 'AddToCart',
  [AnalyticsEvent.CheckoutStarted]: 'InitiateCheckout',
  [AnalyticsEvent.PaymentSelected]: 'AddPaymentInfo',
  [AnalyticsEvent.OrderCompleted]: 'Purchase',
}

export class MetaPixelAnalyticsProvider implements AnalyticsProvider {
  name = 'meta-pixel'

  constructor(private readonly pixelId: string) {}

  page(event: AnalyticsEnvelope) {
    this.send(AnalyticsEvent.PageView, {
      page_path: event.context.page,
      locale: event.context.locale,
    })
  }

  track(event: AnalyticsEnvelope) {
    this.send(event.event, {
      ...(event.payload as Record<string, unknown> | undefined),
      event_category: event.category,
      event_version: event.version,
      currency: event.context.currency,
      page_path: event.context.page,
    })
  }

  identify(_user: IdentifyPayload) {}

  reset() {}

  private send(event: AnalyticsEvent, params: Record<string, unknown>) {
    if (!this.pixelId || !window.fbq) return

    const mappedEvent = metaEventMap[event]
    if (!mappedEvent) return

    window.fbq('track', mappedEvent, params)
  }
}

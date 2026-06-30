import type { AnalyticsProvider } from './analytics-provider'
import type { AnalyticsEnvelope, IdentifyPayload } from '../types/analytics'
import { AnalyticsEvent } from '../events/events'

declare global {
  interface Window {
    ttq?: {
      page?: () => void
      track?: (event: string, params?: Record<string, unknown>) => void
      identify?: (params: Record<string, unknown>) => void
      load?: (pixelId: string) => void
      queue?: unknown[]
    }
  }
}

const tiktokEventMap: Partial<Record<AnalyticsEvent, string>> = {
  [AnalyticsEvent.ProductView]: 'ViewContent',
  [AnalyticsEvent.AddToCart]: 'AddToCart',
  [AnalyticsEvent.CheckoutStarted]: 'InitiateCheckout',
  [AnalyticsEvent.PaymentSelected]: 'AddPaymentInfo',
  [AnalyticsEvent.OrderCompleted]: 'CompletePayment',
}

export class TikTokPixelAnalyticsProvider implements AnalyticsProvider {
  name = 'tiktok-pixel'

  constructor(private readonly pixelId: string) {}

  page(_event: AnalyticsEnvelope) {
    if (!this.pixelId || !window.ttq?.page) return
    window.ttq.page()
  }

  track(event: AnalyticsEnvelope) {
    if (!this.pixelId || !window.ttq?.track) return

    const mappedEvent = tiktokEventMap[event.event]
    if (!mappedEvent) return

    window.ttq.track(mappedEvent, {
      ...(event.payload as Record<string, unknown> | undefined),
      event_category: event.category,
      event_version: event.version,
      currency: event.context.currency,
      page_path: event.context.page,
    })
  }

  identify(user: IdentifyPayload) {
    if (!window.ttq?.identify) return

    window.ttq.identify({
      user_id: user.id,
      email: user.email,
      phone_number: user.phone,
    })
  }

  reset() {}
}

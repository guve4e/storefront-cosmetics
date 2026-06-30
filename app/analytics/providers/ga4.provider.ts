import type { AnalyticsProvider } from './analytics-provider'
import type { AnalyticsEnvelope, IdentifyPayload } from '../types/analytics'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export class GA4AnalyticsProvider implements AnalyticsProvider {
  name = 'ga4'

  constructor(private readonly measurementId: string) {}

  page(event: AnalyticsEnvelope) {
    this.send('page_view', {
      page_location: window.location.href,
      page_path: event.context.page,
      page_title: document.title,
      session_id: event.context.sessionId,
      locale: event.context.locale,
      currency: event.context.currency,
    })
  }

  track(event: AnalyticsEnvelope) {
    this.send(event.event, {
      ...event.payload,
      event_category: event.category,
      event_version: event.version,
      session_id: event.context.sessionId,
      locale: event.context.locale,
      currency: event.context.currency,
      page_path: event.context.page,
    })
  }

  identify(user: IdentifyPayload) {
    if (!user.id || !window.gtag) return
    window.gtag('set', { user_id: user.id })
  }

  reset() {}

  private send(eventName: string, params: Record<string, unknown>) {
    if (!this.measurementId || !window.gtag) return
    window.gtag('event', eventName, params)
  }
}

import type { AnalyticsProvider } from './analytics-provider'
import type { AnalyticsEnvelope, IdentifyPayload } from '../types/analytics'

const STORAGE_KEY = 'ava_analytics_debug_events'

export class DebugStorageAnalyticsProvider implements AnalyticsProvider {
  name = 'debug-storage'

  page(event: AnalyticsEnvelope) {
    this.record(event)
  }

  track(event: AnalyticsEnvelope) {
    this.record(event)
  }

  identify(user: IdentifyPayload) {
    if (!import.meta.client) return
    localStorage.setItem('ava_analytics_debug_identify', JSON.stringify(user))
  }

  reset() {
    if (!import.meta.client) return
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem('ava_analytics_debug_identify')
  }

  private record(event: AnalyticsEnvelope) {
    if (!import.meta.client) return

    const existing = localStorage.getItem(STORAGE_KEY)
    const events = existing ? JSON.parse(existing) : []

    events.push(event)

    localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
  }
}

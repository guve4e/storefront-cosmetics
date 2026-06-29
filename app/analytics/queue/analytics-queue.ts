import type { AnalyticsEnvelope } from '../types/analytics'
import type { AnalyticsProvider } from '../providers/analytics-provider'

export class AnalyticsQueue {
  private events: AnalyticsEnvelope[] = []
  private flushing = false

  enqueue(event: AnalyticsEnvelope) {
    this.events.push(event)
  }

  size() {
    return this.events.length
  }

  clear() {
    this.events = []
  }

  async flush(providers: AnalyticsProvider[], method: 'page' | 'track') {
    if (this.flushing) return

    this.flushing = true

    try {
      while (this.events.length > 0) {
        const batch = [...this.events]
        this.events = []

        for (const event of batch) {
          await Promise.allSettled(
            providers.map((provider) =>
              Promise.resolve().then(() => provider[method](event)),
            ),
          )
        }
      }
    } finally {
      this.flushing = false
    }
  }
}

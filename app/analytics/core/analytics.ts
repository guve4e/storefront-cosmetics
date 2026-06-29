import type { AnalyticsProvider } from '../providers/analytics-provider'
import type { AnalyticsEnvelope, IdentifyPayload } from '../types/analytics'
import { AnalyticsEvent } from '../events/events'
import { buildAnalyticsContext } from './context'
import { resetSession } from './session'
import { getAnalyticsRegistryEntry } from '../registry/analytics-registry'
import { AnalyticsQueue } from '../queue/analytics-queue'

export class AnalyticsService {
  private readonly queue = new AnalyticsQueue()

  constructor(private readonly providers: AnalyticsProvider[]) {}

  page(payload?: Record<string, unknown>) {
    return this.dispatch(AnalyticsEvent.PageView, payload, 'page')
  }

  track<TPayload>(event: AnalyticsEvent, payload?: TPayload) {
    return this.dispatch(event, payload, 'track')
  }

  identify(user: IdentifyPayload) {
    for (const provider of this.providers) {
      provider.identify(user)
    }
  }

  reset() {
    resetSession()

    for (const provider of this.providers) {
      provider.reset()
    }
  }

  private dispatch<TPayload>(
    event: AnalyticsEvent,
    payload: TPayload | undefined,
    method: 'page' | 'track',
  ) {
    const registryEntry = getAnalyticsRegistryEntry(event)

    registryEntry.validate(payload)

    const envelope: AnalyticsEnvelope<TPayload> = {
      event,
      context: buildAnalyticsContext(),
      payload,
    }

    this.queue.enqueue(envelope)
    void this.queue.flush(this.providers, method)
  }
}

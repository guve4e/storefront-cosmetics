import type { AnalyticsProvider } from './analytics-provider'
import type { AnalyticsEnvelope, IdentifyPayload } from '../types/analytics'

declare global {
  interface Window {
    __AVA_ANALYTICS_EVENTS__?: AnalyticsEnvelope[]
  }
}

export class ConsoleAnalyticsProvider implements AnalyticsProvider {
  name = 'console'

  page(event: AnalyticsEnvelope) {
    this.log('PAGE', event)
  }

  track(event: AnalyticsEnvelope) {
    this.log('TRACK', event)
  }

  identify(user: IdentifyPayload) {
    console.groupCollapsed('[Analytics] IDENTIFY')
    console.table(user)
    console.groupEnd()
  }

  reset() {
    console.info('[Analytics] RESET')
  }

  private log(type: string, event: AnalyticsEnvelope) {
    if (import.meta.client) {
      window.__AVA_ANALYTICS_EVENTS__ ||= []
      window.__AVA_ANALYTICS_EVENTS__.push(event)
    }

    console.info(`[AnalyticsEvent] ${event.event}`)
    console.groupCollapsed(`[Analytics] ${type}: ${event.event}`)
    console.log('Context', event.context)
    console.log('Payload', event.payload ?? {})
    console.groupEnd()
  }
}

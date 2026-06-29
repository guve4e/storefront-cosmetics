import type { AnalyticsEnvelope, IdentifyPayload } from '../types/analytics'

export interface AnalyticsProvider {
  name: string
  page(event: AnalyticsEnvelope): void | Promise<void>
  track(event: AnalyticsEnvelope): void | Promise<void>
  identify(user: IdentifyPayload): void | Promise<void>
  reset(): void | Promise<void>
}

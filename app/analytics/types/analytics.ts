import type { AnalyticsEvent } from '../events/events'

export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'unknown'

export interface AnalyticsContext {
  timestamp: string
  sessionId: string
  locale: string
  currency: string
  device: DeviceType
  page: string
  referrer: string | null
}

export interface AnalyticsEnvelope<TPayload = unknown> {
  event: AnalyticsEvent
  version?: number
  category?: string
  context: AnalyticsContext
  payload?: TPayload
}

export interface IdentifyPayload {
  id?: string
  email?: string
  phone?: string
  name?: string
}

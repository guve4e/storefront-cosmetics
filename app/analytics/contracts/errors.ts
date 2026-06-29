import { AnalyticsEvent } from '../events/events'

export class AnalyticsValidationError extends Error {
  constructor(
    public readonly event: AnalyticsEvent,
    public readonly problems: string[],
  ) {
    super(`Analytics validation failed for ${event}: ${problems.join(', ')}`)
    this.name = 'AnalyticsValidationError'
  }
}

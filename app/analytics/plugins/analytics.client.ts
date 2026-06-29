import { AnalyticsService } from '../core/analytics'
import { DomainAnalytics } from '../core/domain-analytics'
import { ConsoleAnalyticsProvider } from '../providers/console.provider'

export default defineNuxtPlugin(() => {
  const service = new AnalyticsService([
    new ConsoleAnalyticsProvider(),
  ])

  const analytics = new DomainAnalytics(service)

  return {
    provide: {
      analytics,
    },
  }
})

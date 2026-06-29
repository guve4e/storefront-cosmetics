import { defineNuxtPlugin } from '#app'
import { AnalyticsService } from '../analytics/core/analytics'
import { DomainAnalytics } from '../analytics/core/domain-analytics'
import { ConsoleAnalyticsProvider } from '../analytics/providers/console.provider'
import { DebugStorageAnalyticsProvider } from '../analytics/providers/debug-storage.provider'

export default defineNuxtPlugin((nuxtApp) => {
  const service = new AnalyticsService([
    new ConsoleAnalyticsProvider(),
    new DebugStorageAnalyticsProvider(),
  ])

  const analytics = new DomainAnalytics(service)

  nuxtApp.hook('page:finish', () => {
    analytics.pageViewed()
  })

  return {
    provide: {
      analytics,
    },
  }
})

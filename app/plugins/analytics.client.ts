import { defineNuxtPlugin } from '#app'
import { AnalyticsService } from '../analytics/core/analytics'
import { DomainAnalytics } from '../analytics/core/domain-analytics'
import { ConsoleAnalyticsProvider } from '../analytics/providers/console.provider'
import { DebugStorageAnalyticsProvider } from '../analytics/providers/debug-storage.provider'
import { GA4AnalyticsProvider } from '../analytics/providers/ga4.provider'

function installGA4(measurementId: string) {
  if (!measurementId || !import.meta.client) return

  window.dataLayer = window.dataLayer || []

  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args)
  }

  window.gtag('js', new Date())
  window.gtag('config', measurementId, {
    send_page_view: false,
  })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script)
}

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const ga4MeasurementId = String(config.public.ga4MeasurementId || '')

  installGA4(ga4MeasurementId)

  const providers = [
    new ConsoleAnalyticsProvider(),
    new DebugStorageAnalyticsProvider(),
  ]

  if (ga4MeasurementId) {
    providers.push(new GA4AnalyticsProvider(ga4MeasurementId))
  }

  const service = new AnalyticsService(providers)
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

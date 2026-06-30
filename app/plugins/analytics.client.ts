import { defineNuxtPlugin } from '#app'
import { AnalyticsService } from '../analytics/core/analytics'
import { DomainAnalytics } from '../analytics/core/domain-analytics'
import { ConsoleAnalyticsProvider } from '../analytics/providers/console.provider'
import { DebugStorageAnalyticsProvider } from '../analytics/providers/debug-storage.provider'
import { GA4AnalyticsProvider } from '../analytics/providers/ga4.provider'
import { MetaPixelAnalyticsProvider } from '../analytics/providers/meta-pixel.provider'
import { TikTokPixelAnalyticsProvider } from '../analytics/providers/tiktok-pixel.provider'
import { hasAnalyticsConsent } from '../analytics/consent/analytics-consent'

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

function installMetaPixel(pixelId: string) {
  if (!pixelId || !import.meta.client) return

  window.fbq = function fbq(...args: unknown[]) {
    window.fbq?.queue?.push(args)
  } as typeof window.fbq & { queue?: unknown[] }

  ;(window.fbq as typeof window.fbq & { queue?: unknown[] }).queue = []
  window._fbq = window.fbq

  window.fbq('init', pixelId)

  const script = document.createElement('script')
  script.async = true
  script.src = 'https://connect.facebook.net/en_US/fbevents.js'
  document.head.appendChild(script)
}

function installTikTokPixel(pixelId: string) {
  if (!pixelId || !import.meta.client) return

  window.ttq = window.ttq || { queue: [] }

  window.ttq.load = function load(id: string) {
    window.ttq?.queue?.push(['load', id])
  }

  window.ttq.page = function page() {
    window.ttq?.queue?.push(['page'])
  }

  window.ttq.track = function track(event: string, params?: Record<string, unknown>) {
    window.ttq?.queue?.push(['track', event, params])
  }

  window.ttq.identify = function identify(params: Record<string, unknown>) {
    window.ttq?.queue?.push(['identify', params])
  }

  window.ttq.load(pixelId)

  const script = document.createElement('script')
  script.async = true
  script.src = 'https://analytics.tiktok.com/i18n/pixel/events.js'
  document.head.appendChild(script)
}

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const ga4MeasurementId = String(config.public.ga4MeasurementId || '')
  const metaPixelId = String(config.public.metaPixelId || '')
  const tiktokPixelId = String(config.public.tiktokPixelId || '')

  const marketingConsent = hasAnalyticsConsent()

  if (marketingConsent) {
    installGA4(ga4MeasurementId)
    installMetaPixel(metaPixelId)
    installTikTokPixel(tiktokPixelId)
  }

  const providers = [
    new ConsoleAnalyticsProvider(),
    new DebugStorageAnalyticsProvider(),
  ]

  if (marketingConsent && ga4MeasurementId) {
    providers.push(new GA4AnalyticsProvider(ga4MeasurementId))
  }

  if (marketingConsent && metaPixelId) {
    providers.push(new MetaPixelAnalyticsProvider(metaPixelId))
  }

  if (marketingConsent && tiktokPixelId) {
    providers.push(new TikTokPixelAnalyticsProvider(tiktokPixelId))
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

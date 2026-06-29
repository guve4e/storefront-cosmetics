import { getSessionId } from './session'
import { getDeviceType } from '../utils/device'
import type { AnalyticsContext } from '../types/analytics'

function getLocale() {
  if (!import.meta.client) return 'bg'

  const pathLocale = window.location.pathname.split('/').filter(Boolean)[0]

  if (['bg', 'en'].includes(pathLocale)) return pathLocale

  return document.documentElement.lang || navigator.language.split('-')[0] || 'bg'
}

export function buildAnalyticsContext(): AnalyticsContext {
  return {
    timestamp: new Date().toISOString(),
    sessionId: getSessionId(),
    locale: getLocale(),
    currency: 'EUR',
    device: getDeviceType(),
    page: import.meta.client
      ? `${window.location.pathname}${window.location.search}`
      : '',
    referrer: import.meta.client ? document.referrer || null : null,
  }
}

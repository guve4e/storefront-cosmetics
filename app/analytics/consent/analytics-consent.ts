const CONSENT_KEY = 'ava_analytics_consent'

export type AnalyticsConsent = 'accepted' | 'rejected' | 'unknown'

export function getAnalyticsConsent(): AnalyticsConsent {
  if (!import.meta.client) return 'unknown'

  const value = localStorage.getItem(CONSENT_KEY)

  if (value === 'accepted' || value === 'rejected') return value

  return 'unknown'
}

export function setAnalyticsConsent(value: Exclude<AnalyticsConsent, 'unknown'>) {
  if (!import.meta.client) return

  localStorage.setItem(CONSENT_KEY, value)
}

export function hasAnalyticsConsent() {
  return getAnalyticsConsent() === 'accepted'
}

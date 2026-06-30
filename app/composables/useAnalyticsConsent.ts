import {
  getAnalyticsConsent,
  setAnalyticsConsent,
  type AnalyticsConsent,
} from '~/analytics/consent/analytics-consent'

export function useAnalyticsConsent() {
  const consent = ref<AnalyticsConsent>('unknown')

  onMounted(() => {
    consent.value = getAnalyticsConsent()
  })

  function accept() {
    setAnalyticsConsent('accepted')
    consent.value = 'accepted'
    window.location.reload()
  }

  function reject() {
    setAnalyticsConsent('rejected')
    consent.value = 'rejected'
  }

  return {
    consent,
    accept,
    reject,
  }
}

import type { DomainAnalytics } from '../core/domain-analytics'

export function useAnalytics(): DomainAnalytics {
  const nuxtApp = useNuxtApp()

  return nuxtApp.$analytics as DomainAnalytics
}

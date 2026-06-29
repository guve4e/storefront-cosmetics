import type { DeviceType } from '../types/analytics'

export function getDeviceType(): DeviceType {
  if (!import.meta.client) return 'unknown'

  const width = window.innerWidth

  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'

  return 'desktop'
}

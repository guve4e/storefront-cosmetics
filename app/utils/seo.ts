import { siteSeo } from '~/seo/site'

export function absoluteUrl(path = '/', baseUrl?: string) {
  const config = typeof useRuntimeConfig === 'function' ? useRuntimeConfig() : null
  const siteUrl = baseUrl || String(config?.public?.siteUrl || 'http://localhost:3001')
  const cleanBase = siteUrl.replace(/\/$/, '')
  const cleanPath = path.startsWith('/') ? path : `/${path}`

  return `${cleanBase}${cleanPath}`
}

export function buildTitle(title?: string) {
  return title ? `${title} | ${siteSeo.name}` : siteSeo.name
}

export function cleanDescription(description?: string) {
  return (description || siteSeo.description).replace(/\s+/g, ' ').trim()
}

export function parseSeoPrice(price: string | number) {
  if (typeof price === 'number') return price.toFixed(2)

  const value = Number(price.replace(',', '.').replace(/[^\d.]/g, ''))

  return Number.isFinite(value) ? value.toFixed(2) : '0.00'
}

import { serums } from '../../app/data/serums'
import { absoluteUrl } from '../../app/utils/seo'

export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')

  const config = useRuntimeConfig()
  const siteUrl = String(config.public.siteUrl || 'http://localhost:3001')

  const routes = [
    '/',
    '/cart',
    '/checkout',
    ...serums.map((serum) => `/serums/${serum.slug}`),
  ]

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${absoluteUrl(route, siteUrl)}</loc>
    <changefreq>${route === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${route === '/' ? '1.0' : route.startsWith('/serums') ? '0.8' : '0.4'}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`
})

import { test, expect } from './fixtures'

test('sitemap exposes canonical product URLs', async ({ page }) => {
  const response = await page.goto('/sitemap.xml')
  const body = await response?.text()

  expect(body).toContain('https://www.therainbowglow.com/')
  expect(body).toContain('https://www.therainbowglow.com/serums/hydrating')
})

test('robots exposes sitemap and blocks private routes', async ({ page }) => {
  const response = await page.goto('/robots.txt')
  const body = await response?.text()

  expect(body).toContain('Allow: /')
  expect(body).toContain('Disallow: /admin')
  expect(body).toContain('Disallow: /api')
  expect(body).toContain('Sitemap: https://www.therainbowglow.com/sitemap.xml')
})

test('serum page exposes product structured data', async ({ page }) => {
  await page.goto('/serums/hydrating')

  const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents()
  const product = jsonLd
    .map((text) => JSON.parse(text))
    .find((item) => item['@type'] === 'Product')

  expect(product).toBeTruthy()
  expect(product.name).toContain('Hydrating')
  expect(product.brand.name).toBe('AVA Cosmetica')
  expect(product.offers.priceCurrency).toBe('EUR')
  expect(product.offers.availability).toBe('https://schema.org/InStock')
  expect(product.offers.url).toBe('https://www.therainbowglow.com/serums/hydrating')
})

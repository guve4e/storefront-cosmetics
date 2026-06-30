import { test, expect } from './fixtures'
import AxeBuilder from '@axe-core/playwright'

test('home page has no serious accessibility violations', async ({ page }) => {
  await page.goto('/')

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze()

  expect(results.violations).toEqual([])
})

test('serum page has no serious accessibility violations', async ({ page }) => {
  await page.goto('/serums/hydrating')

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze()

  expect(results.violations).toEqual([])
})

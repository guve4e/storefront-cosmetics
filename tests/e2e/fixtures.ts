import { test as base } from '@playwright/test'

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(() => {
      localStorage.setItem('ava_analytics_consent', 'rejected')
    })

    await use(page)
  },
})

export { expect } from '@playwright/test'

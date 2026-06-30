import { expect, test } from '@playwright/test'

test('BG cart routes to BG checkout', async ({ page }) => {
  await page.goto('/bg')

  await page.getByRole('button', { name: /add to cart/i }).first().click()

  await page.goto('/bg/cart')

  const checkoutLink = page.locator('a[href="/bg/checkout"]').first()
  await expect(checkoutLink).toBeVisible()

  await checkoutLink.click()

  await expect(page).toHaveURL(/\/bg\/checkout/)
  await expect(page.getByRole('button', { name: /Еконт офис/ })).toBeVisible()
  await expect(page.getByRole('button', { name: /Спиди офис/ })).toBeVisible()
})

test('EN cart routes to EN checkout', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: /add to cart/i }).first().click()

  await page.goto('/cart')

  const checkoutLink = page.locator('a[href="/checkout"]').first()
  await expect(checkoutLink).toBeVisible()

  await checkoutLink.click()

  await expect(page).toHaveURL(/\/checkout/)
  await expect(page.getByText(/Shipping address/)).toBeVisible()
})

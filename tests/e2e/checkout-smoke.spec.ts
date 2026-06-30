import { expect, test } from '@playwright/test'

test('customer can add serum to cart and reach checkout', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByText('Eight signals')).toBeVisible()

  await page.getByRole('button', { name: /add to cart/i }).first().click()

  await page.goto('/cart')

  await expect(
    page.getByText(/Your ritual bag|Твоята|кошница/i)
  ).toBeVisible()

  await expect(page.getByText(/serum|серум/i).first()).toBeVisible()
  await expect(page.getByText(/total|subtotal|общо/i).first()).toBeVisible()

  const checkoutCta = page
    .locator('a,button')
    .filter({ hasText: /continue to checkout|checkout|поръчка|плащане/i })
    .first()

  await expect(checkoutCta).toBeVisible()
})

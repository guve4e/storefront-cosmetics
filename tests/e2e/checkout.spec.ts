import { expect, test } from '@playwright/test'

test.describe('AVA launch checkout smoke', () => {
  test('cart share link opens checkout with seeded product', async ({ page }) => {
    await page.goto('/bg/cart?items=vitamin-c:1')

    await expect(page.getByRole('heading', { name: /your ritual bag/i })).toBeVisible()
    await expect(page.getByText(/Vitamin C Serum/i).first()).toBeVisible()

    await page.getByRole('link', { name: /continue to checkout/i }).click()

    await expect(page).toHaveURL(/\/bg\/checkout/)
    await expect(page.getByRole('heading', { name: /Данни за доставка/i })).toBeVisible()
    await expect(page.getByText(/Vitamin C Serum/i).first()).toBeVisible()
  })

  test('checkout blocks empty cart submission', async ({ page }) => {
    await page.goto('/bg/checkout')

    await expect(page.getByText(/Your cart is empty/i)).toBeVisible()

    const submit = page.getByRole('button', { name: /Преглед на поръчката/i })
    await expect(submit).toBeDisabled()
  })

  test.skip('address delivery can reach order review modal - checkout UX still being redesigned', async ({ page }) => {
    await page.goto('/bg/cart?items=vitamin-c:1')
    await page.getByRole('link', { name: /continue to checkout/i }).click()

    await page.getByPlaceholder('Вашето име').fill('Тест Клиент')
    await page.getByPlaceholder('+359...').fill('0888123456')

    await page.getByTestId('delivery-method-address').click()
    await expect(page.getByTestId('active-delivery-method')).toHaveText('address')

    await expect(page.getByTestId('checkout-address-city')).toBeVisible()
    await page.getByTestId('checkout-address-city').fill('София')
    await page.getByTestId('checkout-address-line').fill('ул. Тест 1')

    await page.getByRole('button', { name: /Преглед на поръчката/i }).click()

    await expect(page.getByRole('heading', { name: /Преглед на поръчката/i })).toBeVisible()
    await expect(page.getByText('Тест Клиент')).toBeVisible()
    await expect(page.getByText('0888123456')).toBeVisible()
    await expect(page.getByText(/ул\. Тест 1/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /Потвърди поръчката/i })).toBeVisible()
  })
})

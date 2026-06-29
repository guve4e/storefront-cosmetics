import { test, expect } from '@playwright/test'

test('analytics emits product-cart funnel events', async ({ page }) => {
  await page.goto('/')

  await page.evaluate(() => {
    localStorage.removeItem('ava_analytics_debug_events')
  })

  await page.goto('/serums/hydrating')
  await expect(page.locator('.serum-detail-buy')).toBeVisible()

  await page.waitForFunction(() => {
    const raw = localStorage.getItem('ava_analytics_debug_events')
    return raw && JSON.parse(raw).some((event: any) => event.event === 'page_view')
  })

  await page.locator('.serum-detail-buy').getByRole('button', { name: /add to cart/i }).click()

  await page.waitForFunction(() => {
    const raw = localStorage.getItem('ava_analytics_debug_events')
    return raw && JSON.parse(raw).some((event: any) => event.event === 'add_to_cart')
  })

  await page.goto('/cart')
  await expect(page.locator('.cart-page')).toBeVisible()

  await page.waitForFunction(() => {
    const raw = localStorage.getItem('ava_analytics_debug_events')
    return raw && JSON.parse(raw).some((event: any) => event.event === 'cart_view')
  })

  const events = await page.evaluate(() => {
    const raw = localStorage.getItem('ava_analytics_debug_events')
    return raw ? JSON.parse(raw).map((event: any) => event.event) : []
  })

  console.log('Collected analytics events:', events)

  expect(events).toContain('page_view')
  expect(events).toContain('product_view')
  expect(events).toContain('add_to_cart')
  expect(events).toContain('cart_view')
})

test('analytics emits checkout decision events', async ({ page }) => {
  await page.goto('/cart?items=hydrating:1')

  await page.evaluate(() => {
    localStorage.removeItem('ava_analytics_debug_events')
  })

  await page.goto('/checkout')
  await expect(page.locator('.checkout-page')).toBeVisible()

  await page.waitForFunction(() => {
    const raw = localStorage.getItem('ava_analytics_debug_events')
    return raw && JSON.parse(raw).some((event: any) => event.event === 'checkout_started')
  })

  await page.getByTestId('delivery-method-address').click()

  await page.waitForFunction(() => {
    const raw = localStorage.getItem('ava_analytics_debug_events')
    return raw && JSON.parse(raw).some((event: any) => event.event === 'delivery_selected')
  })

  await page.locator('.payment-method').first().click()

  await page.waitForFunction(() => {
    const raw = localStorage.getItem('ava_analytics_debug_events')
    return raw && JSON.parse(raw).some((event: any) => event.event === 'payment_selected')
  })

  await page.getByPlaceholder('София').fill('София')
  await page.getByPlaceholder('Улица, номер, вход, апартамент').fill('ул. Тест 1')
  await page.getByPlaceholder('Вашето име').fill('Тест Клиент')
  await page.getByPlaceholder('+359...').fill('+359888123456')

  const events = await page.evaluate(() => {
    const raw = localStorage.getItem('ava_analytics_debug_events')
    return raw ? JSON.parse(raw).map((event: any) => event.event) : []
  })

  console.log('Collected checkout analytics events:', events)

  expect(events).toContain('checkout_started')
  expect(events).toContain('delivery_selected')
  expect(events).toContain('payment_selected')
})

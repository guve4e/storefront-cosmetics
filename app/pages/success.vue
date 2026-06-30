<template>
  <main class="success-page">
    <section class="success-card">
      <div class="eyebrow soft">ПОРЪЧКАТА Е ПРИЕТА</div>

      <h1>Благодарим.</h1>

      <p>
        Получихме вашата поръчка. Ще се свържем с вас при нужда относно доставката.
      </p>

      <div v-if="order" class="success-number">
        Поръчка #{{ order.orderNumber ?? shortId }}
      </div>

      <div v-if="order" class="success-summary">
        <span>Общо</span>
        <strong>{{ formatMoney(order.total) }}</strong>
      </div>

      <NuxtLink class="success-button" to="/">
        Продължи пазаруването
      </NuxtLink>
    </section>
  </main>
</template>

<script setup lang="ts">
const { formatMoney } = useStoreCurrency()
const analytics = useAnalytics()
const order = ref<any>(null)

onMounted(() => {

  const raw = sessionStorage.getItem('ava-last-order')
  order.value = raw ? JSON.parse(raw) : null

  if (!order.value) return

  analytics.orderCompleted({
    orderId: String(order.value.id ?? order.value.orderNumber ?? ''),
    total: Number(order.value.total ?? 0),
    currency: order.value.currency ?? 'EUR',
    items: Array.isArray(order.value.items)
      ? order.value.items.map((item: any) => ({
          productId: item.variantId ?? item.productId ?? item.slug,
          slug: item.slug,
          variant: item.variantId ?? item.variant ?? item.slug,
          price: Number(item.price ?? 0),
          quantity: Number(item.quantity ?? 1),
        }))
      : [],
  })
})

const shortId = computed(() =>
  order.value?.id ? String(order.value.id).slice(0, 8).toUpperCase() : ''
)
</script>

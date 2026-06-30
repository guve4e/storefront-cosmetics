<template>
  <main class="checkout-page">
    <FloatingCart />
    <CartDrawer />

    <NuxtLink class="checkout-back" :to="localePath('/cart')">
      ← Back to cart
    </NuxtLink>

    <div class="checkout-layout">
      <CheckoutForm />
      <CartSummary />
    </div>
  </main>
</template>


<script setup lang="ts">
const localePath = useLocalePath()
const analytics = useAnalytics()

onMounted(() => {
  analytics.checkoutStarted()
})
</script>

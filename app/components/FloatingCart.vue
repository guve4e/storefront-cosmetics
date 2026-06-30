<template>
  <button v-if="cart.count" class="floating-cart" @click="cartUi.open">
    <span class="cart-icon">◇</span>
    <span>{{ cart.count }} items</span>
    <strong>{{ formatMoney(cart.total) }}</strong>
  </button>
</template>

<script setup lang="ts">
const { formatMoney } = useStoreCurrency()
const cart = useCartStore()
const cartUi = useCartUiStore()
</script>

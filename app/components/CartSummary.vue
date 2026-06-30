<template>
  <aside class="checkout-summary">
    <div class="checkout-summary-head">
      <small>ORDER SUMMARY</small>
      <h2>Your ritual.</h2>
    </div>

    <div v-if="!cart.items.length" class="checkout-empty">
      Your cart is empty.
    </div>

    <div v-else class="checkout-items">
      <article
        v-for="item in cart.items"
        :key="item.variantId"
        class="checkout-item"
      >
        <div class="checkout-item-media" v-if="item.image">
          <img :src="item.image" :alt="item.name" />
        </div>

        <div>
          <h3>{{ item.name }}</h3>
          <p>Qty {{ item.quantity }}</p>
        </div>

        <strong>{{ formatMoney(lineTotal(item)) }}</strong>
      </article>
    </div>

    <div class="checkout-totals">
      <div>
        <span>Subtotal</span>
        <strong>{{ formatMoney(cart.total) }}</strong>
      </div>

      <div>
        <span>Shipping</span>
        <strong>Free</strong>
      </div>

      <div class="checkout-grand-total">
        <span>Total</span>
        <strong>{{ formatMoney(cart.total) }}</strong>
      </div>
    </div>

    <div class="cart-trust-row">
      <span>Cruelty free</span>
      <span>Easy returns</span>
      <span>Secure checkout</span>
    </div>
  </aside>
</template>

<script setup lang="ts">
const { formatMoney } = useStoreCurrency()
const cart = useCartStore()

function lineTotal(item: any) {
  return Number((item.price * item.quantity).toFixed(2))
}
</script>

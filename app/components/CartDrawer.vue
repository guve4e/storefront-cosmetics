<template>
  <Teleport to="body">
    <div v-if="cartUi.isOpen" class="cart-overlay" @click.self="cartUi.close">
      <aside class="cart-drawer">
        <div class="cart-drawer-head">
          <div>
            <small>AVA CART</small>
            <h3>Your ritual bag</h3>
          </div>

          <button class="cart-close" @click="cartUi.close">×</button>
        </div>

        <div v-if="!cart.items.length" class="cart-empty">
          Your cart is empty.
        </div>

        <div v-else class="cart-items">
          <article
            v-for="item in cart.items"
            :key="item.variantId"
            class="cart-item"
          >
            <div class="cart-item-media" v-if="item.image">
              <img :src="item.image" :alt="item.name" />
            </div>

            <div class="cart-item-main">
              <h4>{{ item.name }}</h4>
              <p>Qty {{ item.quantity }}</p>
            </div>

            <div class="cart-item-side">
              <strong>{{ formatMoney(item.price * item.quantity) }}</strong>
              <button @click="cart.remove(item.variantId)">Remove</button>
            </div>
          </article>
        </div>

        <div class="cart-drawer-footer">
          <div class="cart-total">
            <span>Total</span>
            <strong>{{ formatMoney(cart.total) }}</strong>
          </div>

          <NuxtLink class="checkout-button" :to="localePath('/cart')" @click="cartUi.close">
            View cart
          </NuxtLink>

          <NuxtLink class="cart-checkout-link" to="/checkout" @click="cartUi.close">
            Checkout directly
          </NuxtLink>

          <button class="cart-clear" @click="cart.clear">
            Clear cart
          </button>
        </div>
      </aside>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
const { formatMoney } = useStoreCurrency()
const cart = useCartStore()
const cartUi = useCartUiStore()
</script>

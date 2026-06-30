<template>
  <main class="cart-page">
    <FloatingCart />
    <CartDrawer />

    <NuxtLink class="cart-back" to="/">
      ← Continue shopping
    </NuxtLink>

    <section class="cart-page-shell">
      <div class="cart-page-main">
        <small>AVA CART</small>
        <h1>Your ritual bag.</h1>
        <p>
          Review your selected serums, share this ritual, or continue to checkout.
        </p>

        <div v-if="!cart.items.length" class="cart-page-empty">
          Your cart is empty.
        </div>

        <div v-else class="cart-page-items">
          <article
            v-for="item in cart.items"
            :key="item.variantId"
            class="cart-page-item"
          >
            <div class="cart-page-item-media" v-if="item.image">
              <img :src="item.image" :alt="item.name" />
            </div>

            <div class="cart-page-item-copy">
              <h3>{{ item.name }}</h3>
              <p>{{ productSubtitle(item.slug) }}</p>

              <div class="cart-qty-row">
                <button @click="decrease(item)">−</button>
                <span>{{ item.quantity }}</span>
                <button @click="increase(item)">+</button>
              </div>

              <button class="cart-remove" @click="removeItem(item)">
                Remove item
              </button>
            </div>

            <strong>{{ formatMoney(lineTotal(item)) }}</strong>
          </article>
        </div>
      </div>

      <aside class="cart-page-summary">
        <small>ORDER SUMMARY</small>
        <h2>Ready when you are.</h2>

        <div class="cart-page-total-row">
          <span>Subtotal</span>
          <strong>{{ formatMoney(cart.total) }}</strong>
        </div>

        <div class="cart-page-total-row">
          <span>Shipping</span>
          <strong>Free</strong>
        </div>

        <div class="cart-page-total-row grand">
          <span>Total</span>
          <strong>{{ formatMoney(cart.total) }}</strong>
        </div>

        <button
          class="checkout-submit"
          type="button"
          :disabled="!cart.items.length"
          @click="copyShareLink"
        >
          Copy share link
        </button>

        <NuxtLink class="checkout-submit cart-page-checkout" :to="localePath('/checkout')">
          Continue to checkout
        </NuxtLink>

        <p v-if="copied" class="share-confirmation">
          ✓ Routine link copied.
        </p>

        <div class="cart-trust-row">
          <span>Cruelty free</span>
          <span>Easy returns</span>
          <span>Secure checkout</span>
        </div>
      </aside>
    </section>
  </main>
</template>

<script setup lang="ts">
const { formatMoney } = useStoreCurrency()
import { serums } from '~/data/serums'

const cart = useCartStore()
const localePath = useLocalePath()
const route = useRoute()
const copied = ref(false)

function parsePrice(price: string) {
  const value = Number(price.replace(/[^\d.]/g, ''))
  return Number.isFinite(value) ? value : 0
}

const analytics = useAnalytics()

onMounted(() => {
  analytics.cartViewed({
    items: cart.items.length,
    total: cart.total,
    currency: 'EUR',
  })

  const items = String(route.query.items ?? '')

  if (!items) return

  cart.clear()

  for (const part of items.split(',')) {
    const [slug, qtyRaw] = part.split(':')
    const serum = serums.find((item) => item.slug === slug)
    const quantity = Number(qtyRaw || 1)

    if (!serum || !Number.isFinite(quantity)) continue

    cart.add({
      variantId: `local-${serum.slug}`,
      slug: serum.slug,
      name: serum.name,
      image: serum.images.cart,
      price: parsePrice(serum.price),
      quantity,
    })
  }
})

const shareUrl = computed(() => {
  const code = cart.shareCode()
  if (!code || !import.meta.client) return ''
  return `${window.location.origin}/cart?items=${encodeURIComponent(code)}`
})

function lineTotal(item: any) {
  return Number((item.price * item.quantity).toFixed(2))
}


function productSubtitle(slug: string) {
  const serum = serums.find((item) => item.slug === slug)
  return serum?.title ?? 'Crystal Pure serum'
}

function increase(item: any) {
  cart.add({
    ...item,
    quantity: 1,
  })

  analytics.addedToCart({
    productId: item.variantId,
    slug: item.slug,
    variant: item.variantId,
    price: item.price,
    quantity: 1,
    currency: 'EUR',
  })
}

function removeItem(item: any) {
  cart.remove(item.variantId)

  analytics.removedFromCart({
    productId: item.variantId,
    slug: item.slug,
    variant: item.variantId,
    price: item.price,
    quantity: item.quantity,
    currency: 'EUR',
  })
}

function decrease(item: any) {
  if (item.quantity <= 1) {
    removeItem(item)
    return
  }

  item.quantity -= 1
  cart.persist()

  analytics.removedFromCart({
    productId: item.variantId,
    slug: item.slug,
    variant: item.variantId,
    price: item.price,
    quantity: 1,
    currency: 'EUR',
  })
}


async function copyShareLink() {
  if (!shareUrl.value) return

  await navigator.clipboard.writeText(shareUrl.value)
  copied.value = true

  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

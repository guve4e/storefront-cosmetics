<template>
  <article class="serum-card store-card">
    <div v-if="serum.onSale" class="sale-badge">
      -{{ serum.discountPercent }}%
    </div>

    <NuxtLink class="serum-card-link" :to="localePath(`/serums/${serum.slug}`)">
      <div class="serum-card-media">
        <img
          v-if="serum.images?.card && !imageFailed"
          :src="serum.images?.card"
          :alt="locale === 'bg' ? serum.bgName : serum.name"
          @error="imageFailed = true"
        />
        <div v-else class="bottle" :class="serum.colorClass"></div>
      </div>

      <div class="type">{{ serum.signal }}</div>

      <h3>{{ locale === 'bg' ? serum.bgName : serum.name }}</h3>
      <p>{{ locale === 'bg' ? serum.bgTitle : serum.title }}</p>
    </NuxtLink>

    <div class="card-bottom store-bottom">
      <strong class="price-stack">
        <span class="current-price">{{ serum.price }}</span>
        <small v-if="serum.compareAtPrice" class="compare-price">
          {{ serum.compareAtPrice }}
        </small>
      </strong>

      <button class="add-cart-button" @click="addToCart">
        Add to cart
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
const props = defineProps<{
  serum: any
}>()

const localePath = useLocalePath()
const { locale } = useI18n()
const cart = useCartStore()
const analytics = useAnalytics()
const imageFailed = ref(false)

function parsePrice(price: string) {
  const cleaned = price
    .replace(',', '.')
    .replace(/[^\d.]/g, '')

  const value = Number(cleaned)
  return Number.isFinite(value) ? value : 0
}

function addToCart() {
  const item = {
    variantId: props.serum.variantId || `local-${props.serum.slug}`,
    slug: props.serum.slug,
    name: locale.value === 'bg' ? props.serum.bgName : props.serum.name,
    image: props.serum.images?.cart ?? props.serum.images?.card ?? null,
    price: parsePrice(props.serum.price),
    quantity: 1,
  }

  cart.add(item)

  analytics.addedToCart({
    productId: item.variantId,
    slug: item.slug,
    variant: item.variantId,
    price: item.price,
    quantity: item.quantity,
    currency: 'EUR',
  })
}
</script>

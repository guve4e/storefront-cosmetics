<template>
  <main class="serum-detail-page">
    <FloatingCart />
    <CartDrawer />

    <NuxtLink class="serum-back" to="/">
      ← Back to collection
    </NuxtLink>

    <section v-if="serum" class="serum-detail-hero">
      <div class="serum-detail-media">
        <img :src="serum.images.hero" :alt="displayName" />
      </div>

      <div class="serum-detail-copy">
        <div class="eyebrow soft">{{ serum.signal }}</div>
        <h1>{{ displayName }}</h1>
        <p>{{ displayDescription }}</p>

        <div class="serum-detail-benefits">
          <span v-for="benefit in serum.benefits" :key="benefit">
            {{ benefit }}
          </span>
          <span>{{ serum.details.volume }}</span>
          <span>{{ serum.details.availability }}</span>
        </div>

        <div class="serum-detail-buy">
          <strong>{{ serum.price }}</strong>
          <button class="add-cart-button" @click="addToCart">
            Add to cart
          </button>
        </div>
      </div>
    </section>


    <section v-if="serum" class="why-love">
      <div class="eyebrow soft">Why you'll love it</div>
      <h2>Small bottle. Big signal.</h2>

      <div class="why-love-grid">
        <article
          v-for="item in serum.love"
          :key="item.title"
        >
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </article>
      </div>
    </section>

    <section v-if="serum" class="serum-detail-section">
      <div>
        <div class="eyebrow soft">Ritual logic</div>
        <h2>Designed to fit inside a complete skincare routine.</h2>
      </div>

      <div class="serum-detail-info-grid">
        <article>
          <small>How to use</small>
          <p>{{ serum.details.directions }}</p>
        </article>

        <article>
          <small>Pairs well with</small>
          <p>{{ pairNames }}</p>
        </article>

        <article>
          <small>Warnings</small>
          <p>{{ serum.details.warnings }}</p>
        </article>
      </div>

      <div class="ingredient-grid">
        <article
          v-for="ingredient in serum.details.keyIngredients"
          :key="ingredient.name"
        >
          <small>Key ingredient</small>
          <h3>{{ ingredient.name }}</h3>
          <p>{{ ingredient.description }}</p>
        </article>
      </div>

      <div class="trust-row">
        <span v-for="item in serum.details.trust" :key="item">
          {{ item }}
        </span>
      </div>
    </section>

    <section v-if="related.length" class="serum-detail-related">
      <div class="section-head">
        <div>
          <div class="eyebrow soft">Pairs well with</div>
          <h2>Complete the ritual.</h2>
        </div>
      </div>

      <div class="cards">
        <SerumCard
          v-for="item in related"
          :key="item.slug"
          :serum="item"
        />
      </div>
    </section>

    <section v-else-if="!serum" class="serum-not-found">
      <h1>Serum not found.</h1>
      <NuxtLink to="/">Back home</NuxtLink>
    </section>
  </main>
</template>

<script setup lang="ts">
import { findSerum, serums } from '~/data/serums'
import { absoluteUrl, parseSeoPrice } from '~/utils/seo'
import { siteSeo } from '~/seo/site'

const route = useRoute()
const { locale } = useI18n()
const cart = useCartStore()
const analytics = useAnalytics()

const serum = computed(() => findSerum(String(route.params.slug)))

const displayName = computed(() =>
  locale.value === 'bg' ? serum.value?.bgName : serum.value?.name,
)

const displayDescription = computed(() =>
  locale.value === 'bg' ? serum.value?.bgDescription : serum.value?.description,
)

const related = computed(() =>
  serum.value
    ? serums.filter((item) => serum.value?.pairsWith.includes(item.slug))
    : [],
)

const pairNames = computed(() =>
  related.value
    .map((item) => (locale.value === 'bg' ? item.bgName : item.name))
    .join(', '),
)

const seoTitle = computed(() =>
  serum.value
    ? `${locale.value === 'bg' ? serum.value.bgName : serum.value.name} | ${siteSeo.productLine}`
    : siteSeo.productLine,
)

const seoDescription = computed(() =>
  serum.value
    ? locale.value === 'bg'
      ? serum.value.bgDescription
      : serum.value.description
    : siteSeo.description,
)

const seoImage = computed(() => serum.value?.images?.hero || serum.value?.images?.card || null)

useAvaSeo({
  title: seoTitle.value,
  description: seoDescription.value,
  path: `/serums/${String(route.params.slug)}`,
  image: seoImage.value,
  type: 'product',
})

useJsonLd({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: seoTitle.value,
  description: seoDescription.value,
  image: seoImage.value ? absoluteUrl(seoImage.value) : undefined,
  brand: {
    '@type': 'Brand',
    name: siteSeo.name,
  },
  offers: serum.value
    ? {
        '@type': 'Offer',
        price: parseSeoPrice(serum.value.price),
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        url: absoluteUrl(`/serums/${serum.value.slug}`),
      }
    : undefined,
})

function parsePrice(price: string) {
  const value = Number(price.replace(/[^\d.]/g, ''))
  return Number.isFinite(value) ? value : 0
}

onMounted(() => {

  if (!serum.value) return

  analytics.productViewed({
    productId: `local-${serum.value.slug}`,
    slug: serum.value.slug,
    variant: `local-${serum.value.slug}`,
    price: parsePrice(serum.value.price),
    currency: 'EUR',
  })
})

function addToCart() {
  if (!serum.value) return

  const item = {
    variantId: `local-${serum.value.slug}`,
    slug: serum.value.slug,
    name: locale.value === 'bg' ? serum.value.bgName : serum.value.name,
    image: serum.value.images.cart,
    price: parsePrice(serum.value.price),
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

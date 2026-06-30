<template>
  <section id="serums" class="collection">
    <div class="section-head">
      <div>
        <div class="eyebrow soft">The Crystal Pure™ collection</div>
        <h2>Eight signals. One intelligent ritual.</h2>
      </div>
      <p>
        Choose a single serum or let Aurora build a complete routine around your skin.
      </p>
    </div>

    <div class="cards">
      <SerumCard
        v-for="serum in displaySerums"
        :key="serum.slug"
        :serum="serum"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { serums as staticSerums } from '~/data/serums'

const { currency, formatMoney } = useStoreCurrency()

const { data: products } = await useFetch<any[]>('/api/products', {
  default: () => [],
})

function primaryVariant(product: any) {
  return (
    product.variants?.find((variant: any) => {
      const type = String(variant.attributes?.type || '').toLowerCase()
      return !type.includes('sample')
    }) || product.variants?.[0]
  )
}

function activePrice(variant: any) {
  const price = variant?.prices?.find(
    (item: any) => item.priceList?.currency === currency.value
  )

  if (!price) return null

  const amount = Number(price.regularPrice)
  const compareAtAmount = price.compareAtPrice
    ? Number(price.compareAtPrice)
    : null

  return {
    amount,
    compareAtAmount,
    formatted: formatMoney(amount),
    compareAtFormatted: compareAtAmount ? formatMoney(compareAtAmount) : null,
    onSale: !!compareAtAmount && compareAtAmount > amount,
    discountPercent:
      compareAtAmount && compareAtAmount > amount
        ? Math.round(((compareAtAmount - amount) / compareAtAmount) * 100)
        : null,
  }
}

const displaySerums = computed(() => {
  if (!products.value?.length) return staticSerums

  const allowed = products.value.filter((product: any) => {
    return staticSerums.some((item) => {
      return item.slug === product.slug || item.name === product.name
    })
  })

  return allowed.map((product: any) => {
    const staticSerum =
      staticSerums.find((item) => item.slug === product.slug) ||
      staticSerums.find((item) => item.name === product.name)

    const variant = primaryVariant(product)
    const price = activePrice(variant)

    return {
      ...(staticSerum || {}),
      id: product.id,
      slug: product.slug,
      name: product.name,
      bgName: staticSerum?.bgName || product.name,
      title: staticSerum?.title || product.description || '',
      bgTitle: staticSerum?.bgTitle || product.description || '',
      signal: staticSerum?.signal || 'SERUM',
      images: staticSerum?.images || {},
      colorClass: staticSerum?.colorClass || 'purple',
      price: price?.formatted || staticSerum?.price || '-',
      compareAtPrice: price?.compareAtFormatted || null,
      onSale: price?.onSale || false,
      discountPercent: price?.discountPercent || null,
      variantId: variant?.id,
      sku: variant?.sku,
      backendProduct: product,
    }
  })
})
</script>

export interface CartItem {
  variantId: string
  slug: string
  name: string
  image?: string | null
  price: number
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const hasLoaded = ref(false)

  function persist() {
    if (!import.meta.client) return
    localStorage.setItem('ava-cart', JSON.stringify(items.value))
  }

  function load() {
    if (!import.meta.client || hasLoaded.value) return

    const raw = localStorage.getItem('ava-cart')
    if (raw) {
      try {
        items.value = JSON.parse(raw)
      } catch {
        items.value = []
      }
    }

    hasLoaded.value = true
  }

  function add(item: CartItem) {
    const existing = items.value.find((x) => x.slug === item.slug)

    if (existing) {
      existing.quantity += item.quantity || 1
      existing.price = Number(item.price.toFixed(2))
      existing.variantId = item.variantId
      existing.image = item.image
      persist()
      return
    }

    items.value.push({
      ...item,
      price: Number(item.price.toFixed(2)),
      quantity: item.quantity || 1,
    })

    persist()
  }

  function remove(variantId: string) {
    items.value = items.value.filter((x) => x.variantId !== variantId)
    persist()
  }

  function clear() {
    items.value = []
    persist()
  }

  function shareCode() {
    return items.value
      .map((item) => `${item.slug}:${item.quantity}`)
      .join(',')
  }

  const count = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0),
  )

  const total = computed(() =>
    Number(
      items.value
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
        .toFixed(2),
    ),
  )

  return {
    items,
    hasLoaded,
    load,
    persist,
    add,
    remove,
    clear,
    shareCode,
    count,
    total,
  }
})

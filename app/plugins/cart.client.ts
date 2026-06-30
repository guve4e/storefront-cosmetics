export default defineNuxtPlugin(() => {
  const cart = useCartStore()
  cart.load()
})

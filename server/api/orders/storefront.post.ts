export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  return $fetch(`${config.public.apiBase}/orders/storefront`, {
    method: 'POST',
    body,
  })
})

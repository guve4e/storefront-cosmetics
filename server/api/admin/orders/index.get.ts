export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  return $fetch(`${config.public.apiBase}/orders`)
})

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const customerId = getRouterParam(event, 'customerId')
  const query = getQuery(event)

  return $fetch(
    `${config.public.apiBase}/aurora/recommendations/customer/${customerId}/routine`,
    {
      query,
    },
  )
})

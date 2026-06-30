export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const provider = encodeURIComponent(String(query.provider || 'econt'))
  const cityId = encodeURIComponent(String(query.cityId || ''))

  return await $fetch(
    `http://localhost:3100/shipping/offices?provider=${provider}&cityId=${cityId}`,
  )
})

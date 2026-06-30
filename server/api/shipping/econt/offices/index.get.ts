export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const cityId = encodeURIComponent(String(query.cityId || ''))

  return await $fetch(`http://localhost:3100/shipping/offices?provider=econt&cityId=${cityId}`)
})

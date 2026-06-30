export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const q = encodeURIComponent(String(query.query || ''))

  return await $fetch(`http://localhost:3100/shipping/cities?provider=econt&query=${q}`)
})

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const provider = encodeURIComponent(String(query.provider || 'econt'))
  const q = encodeURIComponent(String(query.query || ''))

  return await $fetch(
    `http://localhost:3100/shipping/cities?provider=${provider}&query=${q}`,
  )
})

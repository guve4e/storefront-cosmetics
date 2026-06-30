export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  return $fetch(`${config.public.apiBase}/aurora/recommendations/routine-preview`, {
    method: 'POST',
    body,
  })
})

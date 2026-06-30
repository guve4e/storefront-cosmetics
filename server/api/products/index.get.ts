const ACTIVE_STORE_ID = '30c23f3f-352c-480d-91df-81579ab2dab2'

export default defineEventHandler(async () => {
  return await $fetch(`http://localhost:3100/catalog/products?storeId=${ACTIVE_STORE_ID}`)
})

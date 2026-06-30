import { checkoutRegions, type CheckoutRegionCode } from '~/config/checkout-regions'

export function useCheckoutRegion() {
  const { locale } = useI18n()

  const regionCode = computed<CheckoutRegionCode>(() => {
    if (locale.value === 'bg') return 'BG'
    return 'US'
  })

  const region = computed(() => checkoutRegions[regionCode.value])

  return {
    regionCode,
    region,
  }
}

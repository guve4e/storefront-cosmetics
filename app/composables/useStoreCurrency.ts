export function useStoreCurrency() {
  const { locale } = useI18n()

  const currency = computed(() => {
    return locale.value === 'bg' ? 'EUR' : 'USD'
  })

  const moneyLocale = computed(() => {
    return locale.value === 'bg' ? 'bg-BG' : 'en-US'
  })

  function formatMoney(
    amount: number | string | null | undefined,
    overrideCurrency?: string | null,
  ) {
    const value = Number(amount || 0)
    const safeCurrency = overrideCurrency || currency.value || 'USD'

    return new Intl.NumberFormat(moneyLocale.value || 'en-US', {
      style: 'currency',
      currency: safeCurrency,
      maximumFractionDigits: 2,
    }).format(value)
  }

  return {
    currency,
    moneyLocale,
    formatMoney,
  }
}

export type CheckoutRegionCode = 'BG' | 'US' | 'EU'

export type DeliveryProvider = 'econt' | 'speedy' | 'manual' | 'standard'
export type DeliveryType = 'office' | 'address'
export type PaymentMethod = 'cash-on-delivery' | 'card'

export interface CheckoutRegionConfig {
  code: CheckoutRegionCode
  currency: 'EUR' | 'USD'
  country: string
  deliveryMethods: Array<{
    id: string
    provider: DeliveryProvider
    type: DeliveryType
    title: string
    description: string
  }>
  paymentMethods: Array<{
    id: PaymentMethod
    title: string
    description: string
  }>
}

export const checkoutRegions: Record<CheckoutRegionCode, CheckoutRegionConfig> = {
  BG: {
    code: 'BG',
    currency: 'EUR',
    country: 'BG',
    deliveryMethods: [
      {
        id: 'econt-office',
        provider: 'econt',
        type: 'office',
        title: 'Еконт офис',
        description: 'Получаване от удобен офис на Еконт.',
      },
      {
        id: 'speedy-office',
        provider: 'speedy',
        type: 'office',
        title: 'Спиди офис',
        description: 'Получаване от удобен офис на Спиди.',
      },
      {
        id: 'address',
        provider: 'manual',
        type: 'address',
        title: 'До адрес',
        description: 'Доставка до посочен от вас адрес.',
      },
    ],
    paymentMethods: [
      {
        id: 'cash-on-delivery',
        title: 'Наложен платеж',
        description: 'Плащате при получаване на пратката.',
      },
    ],
  },

  US: {
    code: 'US',
    currency: 'USD',
    country: 'US',
    deliveryMethods: [
      {
        id: 'address',
        provider: 'standard',
        type: 'address',
        title: 'Shipping address',
        description: 'Delivery to your address.',
      },
    ],
    paymentMethods: [
      {
        id: 'card',
        title: 'Card payment',
        description: 'Secure card checkout.',
      },
    ],
  },

  EU: {
    code: 'EU',
    currency: 'EUR',
    country: 'EU',
    deliveryMethods: [
      {
        id: 'address',
        provider: 'standard',
        type: 'address',
        title: 'Shipping address',
        description: 'Delivery inside the EU.',
      },
    ],
    paymentMethods: [
      {
        id: 'card',
        title: 'Card payment',
        description: 'Secure card checkout.',
      },
    ],
  },
}

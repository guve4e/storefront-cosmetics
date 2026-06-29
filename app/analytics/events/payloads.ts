export interface ProductAnalyticsPayload {
  productId: string
  slug: string
  variant?: string
  price: number
  quantity?: number
  currency: string
}

export interface CheckoutAnalyticsPayload {
  deliveryMethod?: string
  paymentMethod?: string
}

export interface OrderItemAnalyticsPayload {
  productId: string
  slug: string
  variant?: string
  price: number
  quantity: number
}

export interface OrderAnalyticsPayload {
  orderId: string
  total: number
  currency: string
  items: OrderItemAnalyticsPayload[]
}

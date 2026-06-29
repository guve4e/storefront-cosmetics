import type { AnalyticsEvent } from '../events/events'
import { AnalyticsValidationError } from '../contracts/errors'
import { isObject, requireArray, requireNumber, requireString } from '../contracts/assertions'

type Validator = (payload: unknown) => void

function failIfInvalid(
  event: AnalyticsEvent,
  payload: unknown,
  validate: (body: Record<string, unknown>, problems: string[]) => void,
) {
  const problems: string[] = []

  if (!isObject(payload)) {
    throw new AnalyticsValidationError(event, ['payload must be an object'])
  }

  validate(payload, problems)

  if (problems.length) {
    throw new AnalyticsValidationError(event, problems)
  }
}

export function optionalObject(_event: AnalyticsEvent): Validator {
  return (payload: unknown) => {
    if (payload === undefined) return
    if (!isObject(payload)) {
      throw new AnalyticsValidationError(_event, ['payload must be an object when provided'])
    }
  }
}

export function productPayload(event: AnalyticsEvent): Validator {
  return (payload: unknown) =>
    failIfInvalid(event, payload, (body, problems) => {
      requireString(body, 'productId', problems)
      requireString(body, 'slug', problems)
      requireNumber(body, 'price', problems)
      requireString(body, 'currency', problems)

      if (body.quantity !== undefined) requireNumber(body, 'quantity', problems)
      if (body.variant !== undefined && typeof body.variant !== 'string') {
        problems.push('variant must be a string when provided')
      }
    })
}

export function cartPayload(event: AnalyticsEvent): Validator {
  return (payload: unknown) =>
    failIfInvalid(event, payload, (body, problems) => {
      requireNumber(body, 'items', problems)

      if (body.total !== undefined) requireNumber(body, 'total', problems)
      if (body.currency !== undefined) requireString(body, 'currency', problems)
    })
}

export function checkoutPayload(event: AnalyticsEvent): Validator {
  return (payload: unknown) => {
    if (payload === undefined) return

    failIfInvalid(event, payload, (body, problems) => {
      if (body.deliveryMethod !== undefined) requireString(body, 'deliveryMethod', problems)
      if (body.paymentMethod !== undefined) requireString(body, 'paymentMethod', problems)
    })
  }
}

export function orderPayload(event: AnalyticsEvent): Validator {
  return (payload: unknown) =>
    failIfInvalid(event, payload, (body, problems) => {
      requireString(body, 'orderId', problems)
      requireNumber(body, 'total', problems)
      requireString(body, 'currency', problems)
      requireArray(body, 'items', problems)
    })
}

import { describe, expect, it } from 'vitest'
import { AnalyticsEvent } from '../../../app/analytics/events/events'
import { AnalyticsQueue } from '../../../app/analytics/queue/analytics-queue'
import type { AnalyticsEnvelope } from '../../../app/analytics/types/analytics'
import type { AnalyticsProvider } from '../../../app/analytics/providers/analytics-provider'

function event(name = AnalyticsEvent.PageView): AnalyticsEnvelope {
  return {
    event: name,
    version: 1,
    category: 'navigation',
    context: {
      timestamp: new Date().toISOString(),
      sessionId: 'test-session',
      locale: 'bg',
      currency: 'EUR',
      device: 'desktop',
      page: '/',
      referrer: null,
    },
    payload: {},
  }
}

describe('analytics queue', () => {
  it('enqueues events', () => {
    const queue = new AnalyticsQueue()

    queue.enqueue(event())

    expect(queue.size()).toBe(1)
  })

  it('clears events', () => {
    const queue = new AnalyticsQueue()

    queue.enqueue(event())
    queue.clear()

    expect(queue.size()).toBe(0)
  })

  it('flushes queued events to providers', async () => {
    const queue = new AnalyticsQueue()
    const received: AnalyticsEnvelope[] = []

    const provider: AnalyticsProvider = {
      name: 'test',
      page: (event) => received.push(event),
      track: (event) => received.push(event),
      identify: () => {},
      reset: () => {},
    }

    queue.enqueue(event())

    await queue.flush([provider], 'page')

    expect(received).toHaveLength(1)
    expect(queue.size()).toBe(0)
  })

  it('isolates provider failures', async () => {
    const queue = new AnalyticsQueue()
    const received: AnalyticsEnvelope[] = []

    const failingProvider: AnalyticsProvider = {
      name: 'failing',
      page: () => {
        throw new Error('provider failed')
      },
      track: () => {
        throw new Error('provider failed')
      },
      identify: () => {},
      reset: () => {},
    }

    const workingProvider: AnalyticsProvider = {
      name: 'working',
      page: (event) => received.push(event),
      track: (event) => received.push(event),
      identify: () => {},
      reset: () => {},
    }

    queue.enqueue(event())

    await queue.flush([failingProvider, workingProvider], 'page')

    expect(received).toHaveLength(1)
    expect(queue.size()).toBe(0)
  })
})

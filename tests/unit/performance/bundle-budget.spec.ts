import { describe, expect, it } from 'vitest'
import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const JS_ROOT = join(process.cwd(), '.output/public/_nuxt')
const MAX_JS_BUNDLE = 350 * 1024

describe('bundle budget', () => {
  it('largest javascript bundle stays under budget', () => {
    const bundles = readdirSync(JS_ROOT)
      .filter(file => file.endsWith('.js'))
      .map(file => ({
        file,
        size: statSync(join(JS_ROOT, file)).size,
      }))

    const largest = bundles.sort((a, b) => b.size - a.size)[0]

    expect(largest.size).toBeLessThan(MAX_JS_BUNDLE)
  })
})

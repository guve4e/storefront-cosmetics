import { describe, expect, it } from 'vitest'
import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const IMAGE_ROOT = join(process.cwd(), 'public/images')
const MAX_IMAGE_BYTES = 250 * 1024

function listImages(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)

    if (entry.isDirectory()) return listImages(path)

    return /\.(png|jpe?g|webp|svg)$/i.test(entry.name) ? [path] : []
  })
}

describe('image performance budget', () => {
  it('keeps public images under the launch size budget', () => {
    const oversized = listImages(IMAGE_ROOT)
      .map((path) => ({
        path: path.replace(process.cwd() + '/', ''),
        size: statSync(path).size,
      }))
      .filter((image) => image.size > MAX_IMAGE_BYTES)

    expect(oversized).toEqual([])
  })
})

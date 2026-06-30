import fs from 'node:fs'
import path from 'node:path'

const [, , source, slug, type = 'card'] = process.argv

if (!source || !slug) {
  console.error('Usage: node scripts/install-product-image.mjs <source-file> <slug> [card|hero|bottle]')
  process.exit(1)
}

const allowedTypes = new Set(['card', 'hero', 'bottle'])

if (!allowedTypes.has(type)) {
  console.error('Type must be one of: card, hero, bottle')
  process.exit(1)
}

const ext = type === 'bottle' ? '.png' : '.jpg'
const targetDir = path.join('public', 'images', 'products', slug)
const target = path.join(targetDir, `${type}${ext}`)

fs.mkdirSync(targetDir, { recursive: true })
fs.copyFileSync(source, target)

console.log(`Copied ${source} -> ${target}`)

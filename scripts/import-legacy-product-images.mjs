import fs from 'node:fs'
import path from 'node:path'

const sourceRoot =
  process.argv[2] || '/Applications/MAMP/htdocs/cp/root/images/products'

const mappings = [
  { slug: 'vitamin-c', legacy: 'vitcserum' },
  { slug: 'hydrating', legacy: 'hydserum' },
  { slug: 'hyaluronic', legacy: 'hyserum' },
  { slug: 'repair', legacy: 'iserum' },
  { slug: 'soothing', legacy: 'soothserum' },
  { slug: 'collagen', legacy: 'collagenserum' },
  { slug: 'anti-aging', legacy: 'antiageserum' },
  { slug: 'brightening', legacy: 'brserum' },
]

function findFile(dir, patterns) {
  for (const pattern of patterns) {
    const file = fs.readdirSync(dir).find((name) => pattern.test(name))
    if (file) return path.join(dir, file)
  }

  return null
}

function copyIfFound(source, target) {
  if (!source) {
    console.warn(`Missing source for ${target}`)
    return
  }

  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.copyFileSync(source, target)
  console.log(`Copied ${source} -> ${target}`)
}

for (const item of mappings) {
  const legacyDir = path.join(sourceRoot, item.legacy)
  const targetDir = path.join('public', 'images', 'products', item.slug)

  if (!fs.existsSync(legacyDir)) {
    console.warn(`Legacy folder missing: ${legacyDir}`)
    continue
  }

  const card = findFile(legacyDir, [/_2\.jpg$/i, /_1\.jpg$/i, /shop\.jpg$/i])
  const hero = findFile(legacyDir, [/main\.jpg$/i, /carousel_b\.jpg$/i, /carousel\.jpg$/i])
  const bottle = findFile(legacyDir, [/small\.jpg$/i])

  copyIfFound(card, path.join(targetDir, 'card.jpg'))
  copyIfFound(hero, path.join(targetDir, 'hero.jpg'))

  // Legacy small files are jpg, but our data currently expects bottle.png.
  // Use bottle.jpg for now and update data below.
  copyIfFound(bottle, path.join(targetDir, 'bottle.jpg'))
}

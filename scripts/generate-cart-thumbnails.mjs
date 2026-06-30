import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const root = 'public/images/products'
const size = 160

if (!fs.existsSync(root)) {
  console.error(`Missing folder: ${root}`)
  process.exit(1)
}

for (const slug of fs.readdirSync(root)) {
  const dir = path.join(root, slug)
  const card = path.join(dir, 'card.jpg')
  const out = path.join(dir, 'cart.png')

  if (!fs.existsSync(card)) {
    console.warn(`Missing card image for ${slug}`)
    continue
  }

  await sharp(card)
    .trim({ background: '#ffffff', threshold: 15 })
    .resize({
      width: size,
      height: size,
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .png()
    .toFile(out)

  console.log(`Generated ${out}`)
}

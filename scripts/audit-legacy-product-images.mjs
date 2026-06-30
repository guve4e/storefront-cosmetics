import fs from 'node:fs'
import path from 'node:path'

const root = process.argv[2] || '/Applications/MAMP/htdocs/cp/root/images/products'

function walk(dir) {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(full))
    else if (/\.(jpg|jpeg|png|webp)$/i.test(entry.name)) out.push(full)
  }
  return out
}

const files = walk(root)

const rows = files.map((file) => {
  const rel = path.relative(root, file)
  const parts = rel.split(path.sep)
  const folder = parts[0]
  const name = path.basename(file)
  const sizeKb = Math.round(fs.statSync(file).size / 1024)

  let role = 'other'
  if (/shop/i.test(name)) role = 'card'
  else if (/main|hero|carousel/i.test(name)) role = 'hero'
  else if (/small|bottle/i.test(name)) role = 'bottle'
  else if (/review|email/i.test(name)) role = 'marketing'

  return { folder, name, role, sizeKb, path: file }
})

console.table(rows)

const grouped = rows.reduce((acc, row) => {
  acc[row.folder] ??= []
  acc[row.folder].push(row)
  return acc
}, {})

for (const [folder, items] of Object.entries(grouped)) {
  console.log(`\n${folder}`)
  for (const item of items) {
    console.log(`  ${item.role.padEnd(10)} ${String(item.sizeKb).padStart(5)} KB  ${item.name}`)
  }
}

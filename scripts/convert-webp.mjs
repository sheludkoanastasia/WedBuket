/**
 * Конвертация PNG/JPG (и тяжёлых SVG) в WebP.
 * Оригиналы не удаляются — рядом появляются *.webp
 *
 * Запуск: node scripts/convert-webp.mjs
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const imagesRoot = path.join(__dirname, '..', 'public', 'images')

const EXT = new Set(['.png', '.jpg', '.jpeg', '.svg'])

/** Макс. ширина по относительному пути */
function maxWidthFor(relPosix) {
  const p = relPosix.replace(/\\/g, '/')
  if (p.includes('360 flowers')) return 900
  if (p.includes('wedding-bouquet')) return 1600
  if (p.includes('portfolio') || p.includes('about')) return 1200
  if (p.includes('textTexture')) return 1200
  if (p.toLowerCase().includes('wedbuket')) return 800
  return 1400
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await walk(full)))
    } else if (EXT.has(path.extname(entry.name).toLowerCase())) {
      files.push(full)
    }
  }
  return files
}

async function convertOne(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  const rel = path.relative(imagesRoot, filePath)
  const outPath = filePath.slice(0, -ext.length) + '.webp'
  const maxW = maxWidthFor(rel)

  // мелкие UI svg не трогаем
  if (ext === '.svg') {
    const base = path.basename(filePath).toLowerCase()
    if (!base.includes('wedbuket')) {
      return { skipped: true, rel }
    }
  }

  const input = sharp(filePath, { failOn: 'none', animated: false })
  const meta = await input.metadata()
  let pipeline = sharp(filePath, { failOn: 'none' })

  if (meta.width && meta.width > maxW) {
    pipeline = pipeline.resize({
      width: maxW,
      withoutEnlargement: true,
    })
  }

  await pipeline.webp({ quality: 78, effort: 4 }).toFile(outPath)

  const before = (await fs.stat(filePath)).size
  const after = (await fs.stat(outPath)).size
  return {
    rel,
    before,
    after,
    ratio: after / before,
  }
}

async function main() {
  const files = await walk(imagesRoot)
  console.log(`Найдено файлов: ${files.length}`)

  let saved = 0
  let converted = 0

  for (const file of files) {
    try {
      const result = await convertOne(file)
      if (result.skipped) continue
      converted += 1
      saved += result.before - result.after
      const kb = (n) => `${Math.round(n / 1024)}KB`
      console.log(
        `OK  ${result.rel}: ${kb(result.before)} → ${kb(result.after)} (${Math.round(result.ratio * 100)}%)`
      )
    } catch (err) {
      console.error(`FAIL ${path.relative(imagesRoot, file)}:`, err.message)
    }
  }

  console.log(
    `\nГотово: ${converted} webp. Экономия ~${Math.round(saved / 1024 / 1024)} MB (оригиналы на месте).`
  )
}

main()

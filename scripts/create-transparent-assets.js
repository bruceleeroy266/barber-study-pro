/**
 * Create transparent-background PNG derivatives from official ASCYN PRO logo sources.
 * Preserves originals. Outputs optimized web assets.
 */
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const SOURCE_DIR = path.join(__dirname, '..', 'public', 'brand', 'source')
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'brand')

// Exact source file paths from workspace media inbound
const FULL_LOGO_SRC = path.join(
  process.env.HOME || process.env.USERPROFILE,
  '.openclaw', 'workspace', 'media', 'inbound',
  'openclaw-staged-970f45ed-8509-48e8-9e8f-a0476bf9c5ba',
  'a3feabbc-29b5-494a-af4a-de39fc48ed82.jpg'
)

const AMARK_SRC = path.join(
  process.env.HOME || process.env.USERPROFILE,
  '.openclaw', 'workspace', 'media', 'inbound',
  'openclaw-staged-a044309a-faea-435c-bbfe-6fb2cdaeddc5',
  '6d0ed3fe-33ea-4e06-acd4-1b88679a7167.jpg'
)

async function removeBlackBackground(inputPath, outputPath, options = {}) {
  const { threshold = 12 } = options

  const image = sharp(inputPath)
  const { width, height } = await image.metadata()

  // Read raw RGBA data
  const raw = await image.raw().ensureAlpha().toBuffer()

  // Create output buffer with alpha
  const output = Buffer.alloc(width * height * 4)

  for (let i = 0; i < width * height; i++) {
    const r = raw[i * 4]
    const g = raw[i * 4 + 1]
    const b = raw[i * 4 + 2]

    // Detect near-black background
    const isBlack = r < threshold && g < threshold && b < threshold

    if (isBlack) {
      output[i * 4] = 0
      output[i * 4 + 1] = 0
      output[i * 4 + 2] = 0
      output[i * 4 + 3] = 0 // transparent
    } else {
      // Soft edge detection for anti-aliased edges
      const brightness = (r + g + b) / 3
      const isEdge = brightness < threshold + 35

      if (isEdge) {
        const alpha = Math.min(255, Math.max(0, (brightness / (threshold + 35)) * 255))
        output[i * 4] = r
        output[i * 4 + 1] = g
        output[i * 4 + 2] = b
        output[i * 4 + 3] = Math.round(alpha)
      } else {
        output[i * 4] = r
        output[i * 4 + 1] = g
        output[i * 4 + 2] = b
        output[i * 4 + 3] = 255
      }
    }
  }

  await sharp(output, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 9, quality: 100 })
    .toFile(outputPath)

  console.log(`Created: ${outputPath}`)
}

async function createResizedTransparent(inputPath, outputPath, targetWidth, options = {}) {
  const { threshold = 12 } = options

  // First get metadata
  const image = sharp(inputPath)
  const { width, height } = await image.metadata()
  const aspect = width / height
  const targetHeight = Math.round(targetWidth / aspect)

  // Resize first, then remove background (more efficient and cleaner)
  const resized = await image
    .resize(targetWidth, targetHeight, { fit: 'inside' })
    .raw()
    .ensureAlpha()
    .toBuffer({ resolveWithObject: true })

  const { data, info } = resized
  const w = info.width
  const h = info.height

  const output = Buffer.alloc(w * h * 4)

  for (let i = 0; i < w * h; i++) {
    const r = data[i * 4]
    const g = data[i * 4 + 1]
    const b = data[i * 4 + 2]

    const isBlack = r < threshold && g < threshold && b < threshold

    if (isBlack) {
      output[i * 4] = 0
      output[i * 4 + 1] = 0
      output[i * 4 + 2] = 0
      output[i * 4 + 3] = 0
    } else {
      const brightness = (r + g + b) / 3
      const isEdge = brightness < threshold + 30

      if (isEdge) {
        const alpha = Math.min(255, Math.max(0, (brightness / (threshold + 30)) * 255))
        output[i * 4] = r
        output[i * 4 + 1] = g
        output[i * 4 + 2] = b
        output[i * 4 + 3] = Math.round(alpha)
      } else {
        output[i * 4] = r
        output[i * 4 + 1] = g
        output[i * 4 + 2] = b
        output[i * 4 + 3] = 255
      }
    }
  }

  await sharp(output, { raw: { width: w, height: h, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(outputPath)

  console.log(`Created: ${outputPath} (${w}x${h})`)
}

async function main() {
  // Verify source files exist
  if (!fs.existsSync(FULL_LOGO_SRC)) {
    console.error('Full logo source not found:', FULL_LOGO_SRC)
    process.exit(1)
  }
  if (!fs.existsSync(AMARK_SRC)) {
    console.error('A-mark source not found:', AMARK_SRC)
    process.exit(1)
  }

  // Ensure directories exist
  fs.mkdirSync(SOURCE_DIR, { recursive: true })
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })

  // Preserve originals
  const preservedFull = path.join(SOURCE_DIR, 'ascyn-pro-full-logo.jpg')
  const preservedAMark = path.join(SOURCE_DIR, 'ascyn-pro-a-mark.jpg')
  fs.copyFileSync(FULL_LOGO_SRC, preservedFull)
  fs.copyFileSync(AMARK_SRC, preservedAMark)
  console.log('Originals preserved in:', SOURCE_DIR)

  // Get metadata
  const fullMeta = await sharp(FULL_LOGO_SRC).metadata()
  const aMarkMeta = await sharp(AMARK_SRC).metadata()
  console.log(`Full logo: ${fullMeta.width}x${fullMeta.height}`)
  console.log(`A-mark: ${aMarkMeta.width}x${aMarkMeta.height}`)

  // Create full-size transparent versions
  await removeBlackBackground(FULL_LOGO_SRC, path.join(OUTPUT_DIR, 'logo-full-transparent.png'), { threshold: 12 })
  await removeBlackBackground(AMARK_SRC, path.join(OUTPUT_DIR, 'logo-a-mark-transparent.png'), { threshold: 12 })

  // Create resized web-optimized versions for full logo
  // Full logo aspect ratio: 1024/512 = 2:1
  await createResizedTransparent(FULL_LOGO_SRC, path.join(OUTPUT_DIR, 'logo-full-512.png'), 512, { threshold: 12 })
  await createResizedTransparent(FULL_LOGO_SRC, path.join(OUTPUT_DIR, 'logo-full-256.png'), 256, { threshold: 12 })
  await createResizedTransparent(FULL_LOGO_SRC, path.join(OUTPUT_DIR, 'logo-full-128.png'), 128, { threshold: 12 })

  // A-mark sizes (aspect ~1.33:1)
  await createResizedTransparent(AMARK_SRC, path.join(OUTPUT_DIR, 'logo-a-mark-256.png'), 256, { threshold: 12 })
  await createResizedTransparent(AMARK_SRC, path.join(OUTPUT_DIR, 'logo-a-mark-128.png'), 128, { threshold: 12 })
  await createResizedTransparent(AMARK_SRC, path.join(OUTPUT_DIR, 'logo-a-mark-64.png'), 64, { threshold: 12 })

  console.log('\nAll assets created successfully.')
  console.log('\nFiles in', OUTPUT_DIR + ':')
  const files = fs.readdirSync(OUTPUT_DIR)
  files.forEach(f => {
    const stat = fs.statSync(path.join(OUTPUT_DIR, f))
    if (stat.isFile()) console.log(`  ${f} (${Math.round(stat.size / 1024)}KB)`)
  })
}

main().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})

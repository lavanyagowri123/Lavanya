// Generates PNG icons from SVG using the Canvas API via a headless approach.
// Run: node scripts/generate-icons.mjs
// Requires: npm install -D sharp

import sharp from 'sharp'
import { writeFileSync } from 'fs'

const svgIcon = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="80" fill="#FFF9C4"/>
  <!-- Ruled lines -->
  ${[160, 200, 240, 280, 320, 360].map(y =>
    `<line x1="80" y1="${y}" x2="432" y2="${y}" stroke="#C0392B" stroke-width="6" opacity="0.15"/>`
  ).join('')}
  <!-- Red margin line -->
  <line x1="130" y1="100" x2="130" y2="412" stroke="#C0392B" stroke-width="5" opacity="0.25"/>
  <!-- Stylized "M" initial / quill suggestion -->
  <text x="256" y="300"
        font-family="Georgia, serif"
        font-size="220"
        font-weight="bold"
        fill="#C0392B"
        opacity="0.85"
        text-anchor="middle"
        dominant-baseline="middle">✦</text>
</svg>`

async function generate() {
  const sizes = [
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 },
    { name: 'apple-touch-icon.png', size: 180 },
  ]

  for (const { name, size } of sizes) {
    const svg = Buffer.from(svgIcon(512))
    await sharp(svg)
      .resize(size, size)
      .png()
      .toFile(`public/icons/${name}`)
    console.log(`Generated public/icons/${name}`)
  }

  // Also copy apple-touch-icon to public root
  const svg = Buffer.from(svgIcon(512))
  await sharp(svg).resize(180, 180).png().toFile('public/apple-touch-icon.png')
  console.log('Generated public/apple-touch-icon.png')
}

generate().catch(console.error)

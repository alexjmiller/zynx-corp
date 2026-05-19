// Render public/og-image.svg → public/og-image.png at 1200x630.
// LinkedIn / X / older social platforms expect raster (PNG/JPG/GIF) for OG
// images; SVG works on Facebook, Slack, Discord but not LinkedIn.
//
// Run once whenever og-image.svg changes:  npm run build:og
//
// We use resvg-js because it's pure JS (no native deps) and renders SVG
// reliably without needing a headless browser.

import { Resvg } from '@resvg/resvg-js'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const svgPath = resolve(here, '..', 'public', 'og-image.svg')
const pngPath = resolve(here, '..', 'public', 'og-image.png')

const svg = readFileSync(svgPath, 'utf-8')

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  font: {
    // Use any sans-serif the OS has available; the SVG declares a stack
    // ending in 'sans-serif' so resvg will pick a reasonable fallback.
    loadSystemFonts: true,
    defaultFontFamily: 'Helvetica',
  },
  background: '#282828',
})

const png = resvg.render().asPng()
writeFileSync(pngPath, png)

console.log(`Wrote ${pngPath} (${png.length.toLocaleString()} bytes)`)

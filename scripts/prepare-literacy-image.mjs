import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const directory = new URL('../src/content/articles/literacy-rate-in-india/', import.meta.url);
const name = 'literacy-rate-in-india-state-wise-plfs-2025';
const source = new URL(`${name}.svg`, directory);
const output = new URL(`../public/images/${name}.png`, import.meta.url);
const data = JSON.parse(await readFile(new URL('data.json', directory), 'utf8'));
const svg = await readFile(source, 'utf8');
const states = data.rows.filter(row => row.type === 'State').sort((a, b) => b.combined[0] - a.combined[0] || a.name.localeCompare(b.name, 'en'));
const selected = [...states.slice(0, 3), ...states.slice(-3)];

for (const row of selected) {
  const bar = svg.match(new RegExp(`<rect data-state="${row.name}"[^>]*width="([\\d.]+)"`));
  if (!bar || Math.abs(Number(bar[1]) / 280 * 100 - row.combined[0]) > 0.001 || !svg.includes(`${row.combined[0].toFixed(1)}%`)) {
    throw new Error(`Featured SVG does not match the verified zero-based estimate for ${row.name}.`);
  }
}
if (!svg.includes(`${data.all_india.combined[0].toFixed(1)}%`)) {
  throw new Error('Featured SVG national percentage does not match the verified dataset.');
}

await sharp(fileURLToPath(source)).png({ compressionLevel: 9, palette: true }).toFile(fileURLToPath(output));
const metadata = await sharp(fileURLToPath(output)).metadata();
if (metadata.width !== 1200 || metadata.height !== 630) throw new Error('Share image must be 1200 x 630.');
console.log(`Prepared ${name}.png: ${metadata.width} x ${metadata.height}, ${(await stat(output)).size} bytes; verified six state bars and national percentage.`);

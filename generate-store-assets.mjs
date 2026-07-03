import sharp from 'sharp';
import fs from 'fs';

const assets = [
  { src: 'public/feature-graphic.svg', out: 'store-assets/feature-graphic.png', w: 1024, h: 500 },
  { src: 'public/screenshot-1.svg', out: 'store-assets/screenshot-1.png', w: 1080, h: 1920 },
  { src: 'public/screenshot-2.svg', out: 'store-assets/screenshot-2.png', w: 1080, h: 1920 },
  { src: 'public/app-icon.svg', out: 'store-assets/playstore-icon-512.png', w: 512, h: 512 },
];

if (!fs.existsSync('store-assets')) fs.mkdirSync('store-assets');

for (const { src, out, w, h } of assets) {
  await sharp(fs.readFileSync(src)).resize(w, h).png().toFile(out);
  console.log(`Generated ${out} (${w}x${h})`);
}

console.log('All Play Store assets generated in store-assets/ folder!');

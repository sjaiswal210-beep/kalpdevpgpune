import sharp from 'sharp';
import fs from 'fs';

const svg = fs.readFileSync('./public/app-icon.svg');

const sizes = [
  { name: 'public/pwa-192x192.png', size: 192 },
  { name: 'public/pwa-512x512.png', size: 512 },
  { name: 'public/apple-touch-icon.png', size: 180 },
  { name: 'public/favicon-32x32.png', size: 32 },
];

for (const { name, size } of sizes) {
  await sharp(svg).resize(size, size).png().toFile(name);
  console.log(`Generated ${name} (${size}x${size})`);
}

// Android launcher icons
const androidIcons = [
  { path: 'android/app/src/main/res/mipmap-mdpi/ic_launcher.png', size: 48 },
  { path: 'android/app/src/main/res/mipmap-hdpi/ic_launcher.png', size: 72 },
  { path: 'android/app/src/main/res/mipmap-xhdpi/ic_launcher.png', size: 96 },
  { path: 'android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png', size: 144 },
  { path: 'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png', size: 192 },
  { path: 'android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png', size: 48 },
  { path: 'android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png', size: 72 },
  { path: 'android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png', size: 96 },
  { path: 'android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png', size: 144 },
  { path: 'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png', size: 192 },
  { path: 'android/app/src/main/res/mipmap-mdpi/ic_launcher_foreground.png', size: 108 },
  { path: 'android/app/src/main/res/mipmap-hdpi/ic_launcher_foreground.png', size: 162 },
  { path: 'android/app/src/main/res/mipmap-xhdpi/ic_launcher_foreground.png', size: 216 },
  { path: 'android/app/src/main/res/mipmap-xxhdpi/ic_launcher_foreground.png', size: 324 },
  { path: 'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_foreground.png', size: 432 },
];

for (const { path, size } of androidIcons) {
  if (fs.existsSync(path.substring(0, path.lastIndexOf('/')))) {
    await sharp(svg).resize(size, size).png().toFile(path);
    console.log(`Generated ${path} (${size}x${size})`);
  }
}

// Play Store 512x512 icon
await sharp(svg).resize(512, 512).png().toFile('public/playstore-icon-512.png');
console.log('Generated Play Store icon (512x512)');

console.log('All icons generated!');

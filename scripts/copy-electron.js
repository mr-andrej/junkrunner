import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Copy electron folder to dist
const srcDir = path.join(__dirname, '..', 'electron');
const destDir = path.join(__dirname, '..', 'dist', 'electron');

// Create dest directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy all files from electron to dist/electron
fs.readdirSync(srcDir).forEach((file) => {
  const src = path.join(srcDir, file);
  const dest = path.join(destDir, file);
  fs.copyFileSync(src, dest);
  console.log(`Copied ${file} to dist/electron/`);
});

// Copy main-loader.cjs to dist
const loaderSrc = path.join(__dirname, '..', 'main-loader.cjs');
const loaderDest = path.join(__dirname, '..', 'dist', 'main-loader.cjs');
fs.copyFileSync(loaderSrc, loaderDest);
console.log('Copied main-loader.cjs to dist/');

console.log('Build complete: electron files copied to dist/');


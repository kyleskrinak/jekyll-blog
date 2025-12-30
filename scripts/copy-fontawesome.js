#!/usr/bin/env node
/**
 * Copy Font Awesome assets from node_modules to assets/fontawesome
 * Copies the CSS and fonts needed for Font Awesome icons
 */
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const sourceDir = path.join(__dirname, '..', 'node_modules', '@fortawesome', 'fontawesome-free');
const targetDir = path.join(__dirname, '..', 'assets', 'fontawesome');

// Ensure target directory exists
if (fs.existsSync(targetDir)) {
  fs.rmSync(targetDir, { recursive: true, force: true });
}
fs.mkdirSync(targetDir, { recursive: true });

// Copy CSS files (all.min.css and optionally all.css for reference)
const cssFiles = glob.sync(path.join(sourceDir, 'css', '*.min.css'));
cssFiles.forEach(file => {
  const fileName = path.basename(file);
  const dest = path.join(targetDir, 'css', fileName);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(file, dest);
  console.log(`Copied ${fileName}`);
});

// Copy font files (webfonts directory contains all font formats)
const fontFiles = glob.sync(path.join(sourceDir, 'webfonts', '*'));
fontFiles.forEach(file => {
  const fileName = path.basename(file);
  const dest = path.join(targetDir, 'webfonts', fileName);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(file, dest);
  console.log(`Copied webfont: ${fileName}`);
});

console.log(`Font Awesome vendored to ${targetDir}`);

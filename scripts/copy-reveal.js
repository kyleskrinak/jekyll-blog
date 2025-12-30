const fs = require('fs');
const path = require('path');
const glob = require('glob');
const mkdirp = require('mkdirp');

async function copy() {
  const srcBase = path.join(__dirname, '..', 'node_modules', 'reveal.js', 'dist');
  const dstBase = path.join(__dirname, '..', 'assets', 'reveal');
  if (!fs.existsSync(srcBase)) {
    console.error('reveal.js dist not found. Run `npm install` first.');
    process.exit(1);
  }

  // Clean destination
  if (fs.existsSync(dstBase)) {
    fs.rmSync(dstBase, { recursive: true, force: true });
  }
  mkdirp.sync(dstBase);

  const entries = glob.sync('**/*', { cwd: srcBase, nodir: true });
  for (const entry of entries) {
    const src = path.join(srcBase, entry);
    const dst = path.join(dstBase, entry);
    mkdirp.sync(path.dirname(dst));
    fs.copyFileSync(src, dst);
    console.log('Copied', entry);
  }
  console.log('Reveal.js vendored to', dstBase);
}

copy().catch(err => { console.error(err); process.exit(1); });

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const mkdirp = require('mkdirp');

async function copy() {
  const revealBase = path.join(__dirname, '..', 'node_modules', 'reveal.js');
  const menuBase = path.join(__dirname, '..', 'node_modules', 'reveal.js-menu');
  const srcDist = path.join(revealBase, 'dist');
  const srcPlugin = path.join(revealBase, 'plugin');
  const dstBase = path.join(__dirname, '..', 'assets', 'reveal');
  
  if (!fs.existsSync(srcDist)) {
    console.error('reveal.js dist not found. Run `npm install` first.');
    process.exit(1);
  }

  // Clean destination
  if (fs.existsSync(dstBase)) {
    fs.rmSync(dstBase, { recursive: true, force: true });
  }
  mkdirp.sync(dstBase);

  // Copy dist files
  const distEntries = glob.sync('**/*', { cwd: srcDist, nodir: true });
  for (const entry of distEntries) {
    const src = path.join(srcDist, entry);
    const dst = path.join(dstBase, entry);
    mkdirp.sync(path.dirname(dst));
    fs.copyFileSync(src, dst);
    console.log('Copied dist/', entry);
  }

  // Copy plugin files
  if (fs.existsSync(srcPlugin)) {
    const pluginEntries = glob.sync('**/*', { cwd: srcPlugin, nodir: true });
    for (const entry of pluginEntries) {
      const src = path.join(srcPlugin, entry);
      const dst = path.join(dstBase, 'plugin', entry);
      mkdirp.sync(path.dirname(dst));
      fs.copyFileSync(src, dst);
      console.log('Copied plugin/', entry);
    }
  }

  // Copy reveal.js-menu plugin
  if (fs.existsSync(menuBase)) {
    const menuEntries = glob.sync('**/*', { cwd: menuBase, nodir: true });
    for (const entry of menuEntries) {
      const src = path.join(menuBase, entry);
      const dst = path.join(dstBase, 'plugin', 'menu', entry);
      mkdirp.sync(path.dirname(dst));
      fs.copyFileSync(src, dst);
      console.log('Copied menu/', entry);
    }
  }
  
  console.log('Reveal.js vendored to', dstBase);
}

copy().catch(err => { console.error(err); process.exit(1); });

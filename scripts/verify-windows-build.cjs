'use strict';

// Verifies that both Windows packaging targets exist and contain the bundled models.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { version } = require('../package.json');

const root = path.resolve(__dirname, '..');
const out = path.join(root, 'dist');
const releases = [
  `Marble-Run-Maker-Setup-${version}-x64.exe`,
  `Marble-Run-Maker-Portable-${version}-x64.exe`,
];
const exeChecksums = [];
for (const name of releases) {
  const file = path.join(out, name);
  const info = fs.statSync(file);
  assert(info.isFile() && info.size > 1024 * 1024, `Windows artifact missing/too small: ${name}`);
  const fd = fs.openSync(file, 'r');
  const magic = Buffer.alloc(2);
  try { fs.readSync(fd, magic, 0, 2, 0); } finally { fs.closeSync(fd); }
  assert.equal(magic.toString(), 'MZ', `Not a valid Windows PE executable: ${name}`);
  const digest = crypto.createHash('sha256');
  const readFd = fs.openSync(file, 'r');
  const block = Buffer.alloc(1024 * 1024);
  try {
    let n;
    while ((n = fs.readSync(readFd, block, 0, block.length, null)) > 0) {
      digest.update(block.subarray(0, n));
    }
  } finally { fs.closeSync(readFd); }
  exeChecksums.push(`${digest.digest('hex')}  ${name}`);
  console.log(`Verified ${name} (${(info.size / 1048576).toFixed(1)} MiB)`);
}
const resources = path.join(out, 'win-unpacked', 'resources');
assert(fs.statSync(path.join(resources, 'app.asar')).isFile(), 'app.asar is missing from Windows build');
for (const edition of ['plain', 'japandi']) {
  const file = path.join(resources, 'site', 'Marbles', 'assets', 'profiles', `${edition}.3mf`);
  assert(fs.statSync(file).size > 1000000, `Missing high-res profile in Windows package: ${edition}`);
}
assert(fs.statSync(path.join(resources, 'site', 'Marbles', 'index.html')).isFile(), 'Website missing from Windows package');
fs.writeFileSync(path.join(out, 'SHA256SUMS.txt'), exeChecksums.join('\n') + '\n');
console.log('Both Windows targets and offline site/model resources verified.');

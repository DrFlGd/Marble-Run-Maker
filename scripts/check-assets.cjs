'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.join(__dirname, '..', 'Marbles');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const referenced = [...html.matchAll(/(?:src|href)="(\.\/assets\/[^\"]+)"/g)].map(match => match[1]);
assert(referenced.length >= 2, 'Missing JavaScript or CSS references');
for (const rel of referenced) {
  assert(fs.statSync(path.join(root, rel)).isFile(), `Missing asset: ${rel}`);
}
for (const edition of ['plain', 'japandi']) {
  const p = path.join(root, 'assets', 'profiles', `${edition}.3mf`);
  const stat = fs.statSync(p);
  assert(stat.size > 1000000, `Missing high-resolution ${edition} 3MF`);
  const fd = fs.openSync(p, 'r');
  const header = Buffer.alloc(4);
  fs.readSync(fd, header, 0, 4, 0);
  fs.closeSync(fd);
  assert.equal(header.toString('hex', 0, 2), '504b', `${edition} is not a ZIP/3MF archive`);
  console.log(`${edition}: ${(stat.size / 1048576).toFixed(1)} MiB, archive header verified`);
}
console.log(`Web interface assets verified: ${referenced.length} HTML references`);

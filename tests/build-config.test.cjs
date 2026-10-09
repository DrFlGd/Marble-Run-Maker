'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const pkg = require('../package.json');

test('Windows target filenames do not overwrite one another', () => {
  assert.notEqual(pkg.build.nsis.artifactName, pkg.build.portable.artifactName);
  assert.match(pkg.build.nsis.artifactName, /Setup/);
  assert.match(pkg.build.portable.artifactName, /Portable/);
  assert(pkg.build.extraResources.some(resource => resource.from === 'Marbles' && resource.to === 'site/Marbles'));
});

test('CI checks both Windows packages and their embedded models', () => {
  const workflow = fs.readFileSync(path.join(root, '.github', 'workflows', 'windows.yml'), 'utf8');
  assert.match(workflow, /lfs: true/);
  assert.match(workflow, /verify-windows-build\.cjs/);
  assert.match(workflow, /dist\/SHA256SUMS\.txt/);
});

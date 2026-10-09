'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { createLocalServer } = require('../electron/local-server.cjs');

const projectRoot = path.resolve(__dirname, '..');

test('desktop server serves website, 3MF archives, and blocks unrelated paths', async () => {
  const host = createLocalServer(projectRoot);
  const base = await host.listen();
  try {
    const redirect = await fetch(base, { redirect: 'manual' });
    assert.equal(redirect.status, 302);
    assert.equal(redirect.headers.get('location'), '/Marbles/');

    const index = await fetch(`${base}/Marbles/`);
    assert.equal(index.status, 200);
    assert.match(await index.text(), /Marble Run Builder 16 mm/);

    for (const edition of ['plain', 'japandi']) {
      const response = await fetch(`${base}/Marbles/assets/profiles/${edition}.3mf`, { method: 'HEAD' });
      assert.equal(response.status, 200);
      assert.equal(response.headers.get('content-type'), 'model/3mf');
      assert(Number(response.headers.get('content-length')) > 1000000);
    }
    assert.equal((await fetch(`${base}/package.json`)).status, 404);
    assert.equal((await fetch(`${base}/Marbles/assets/profiles/does-not-exist.3mf`)).status, 404);
  } finally {
    await host.close();
  }
});

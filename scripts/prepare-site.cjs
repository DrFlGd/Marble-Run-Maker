'use strict';

/**
 * Accept the official Marbles/ layout or an extracted upload under marbles/.
 * On Windows, Marbles and marbles resolve to the same folder; on Linux they do not.
 */
const fs = require('node:fs');
const path = require('node:path');

function prepareSite(projectRoot = path.resolve(__dirname, '..')) {
  const root = path.resolve(projectRoot);
  const target = path.join(root, 'Marbles');
  const candidates = [
    target,
    path.join(root, 'marbles'),
    path.join(root, 'marbles', 'Marbles'),
    path.join(root, 'marbles', 'marbles'),
    path.join(root, 'Marbles', 'Marbles'),
  ];
  const source = candidates.find(candidate =>
    fs.existsSync(path.join(candidate, 'index.html')) &&
    fs.statSync(path.join(candidate, 'index.html')).isFile()
  );
  if (!source) {
    throw new Error('Website not found. The repo must contain Marbles/index.html, marbles/index.html, or marbles/Marbles/index.html. Upload the extracted website to the main branch.');
  }
  if (!fs.existsSync(path.join(target, 'index.html'))) {
    fs.mkdirSync(target, { recursive: true });
    fs.cpSync(source, target, { recursive: true, force: true });
    if (!fs.existsSync(path.join(target, 'index.html'))) {
      throw new Error('Unable to normalize website directory: ' + source);
    }
    console.log('Prepared Marbles/ from ' + path.relative(root, source));
  } else {
    console.log('Website available: ' + path.relative(root, source));
  }
  return target;
}

if (require.main === module) {
  try { prepareSite(); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}

module.exports = { prepareSite };

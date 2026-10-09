'use strict';

const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { URL } = require('node:url');

const MIMES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.wasm': 'application/wasm',
  '.3mf': 'model/3mf',
  '.kbm': 'application/octet-stream',
};

/** Serve packaged assets to Electron only, without using file:// URLs. */
function createLocalServer(root) {
  const siteRoot = path.resolve(root);
  const server = http.createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Referrer-Policy', 'no-referrer');

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { Allow: 'GET, HEAD' }).end();
      return;
    }

    let pathname;
    try {
      pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    } catch {
      res.writeHead(400).end();
      return;
    }

    if (pathname === '/') {
      res.writeHead(302, { Location: '/Marbles/' }).end();
      return;
    }

    // Only publish the bundled Marbles/ directory, not arbitrary files.
    if (pathname !== '/Marbles' && !pathname.startsWith('/Marbles/')) {
      res.writeHead(404).end();
      return;
    }

    if (pathname.includes('\\') || pathname.includes('\0')) {
      res.writeHead(400).end();
      return;
    }

    const localPath = path.resolve(siteRoot, `.${pathname.endsWith('/') ? `${pathname}index.html` : pathname}`);
    if (!localPath.startsWith(`${siteRoot}${path.sep}`)) {
      res.writeHead(403).end();
      return;
    }

    try {
      let filePath = localPath;
      let info = await fs.promises.stat(filePath);
      if (info.isDirectory()) {
        filePath = path.join(filePath, 'index.html');
        info = await fs.promises.stat(filePath);
      }
      if (!info.isFile()) {
        res.writeHead(404).end();
        return;
      }
      res.writeHead(200, {
        'Content-Type': MIMES[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
        'Content-Length': info.size,
      });
      if (req.method === 'HEAD') {
        res.end();
      } else {
        const stream = fs.createReadStream(filePath);
        stream.on('error', () => res.destroy());
        stream.pipe(res);
      }
    } catch (error) {
      res.writeHead(error.code === 'ENOENT' ? 404 : 500).end();
    }
  });

  return {
    server,
    listen() {
      return new Promise((resolve, reject) => {
        server.once('error', reject);
        server.listen(0, '127.0.0.1', () => {
          server.removeListener('error', reject);
          resolve(`http://127.0.0.1:${server.address().port}`);
        });
      });
    },
    close() {
      return new Promise((resolve) => server.close(resolve));
    },
  };
}

module.exports = { createLocalServer };

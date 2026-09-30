import { createServer } from 'node:http';
import { readFile, realpath } from 'node:fs/promises';
import { extname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = fileURLToPath(new URL('../', import.meta.url));
const legacyRoot = fileURLToPath(new URL('../../../docs/', import.meta.url));
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

const server = createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    response.end();
    return;
  }

  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const legacy = pathname === '/legado' || pathname.startsWith('/legado/');
    const root = legacy ? legacyRoot : packageRoot;
    let localPath = legacy ? pathname.slice('/legado'.length) : pathname;
    if (localPath === '' || localPath === '/') localPath = '/index.html';
    if (localPath.includes('\\') || localPath.split('/').some(part => part.startsWith('.'))) {
      response.writeHead(403);
      response.end();
      return;
    }

    const path = await realpath(resolve(root, `.${localPath}`));
    const insideRoot = relative(await realpath(root), path);
    if (insideRoot.startsWith('..') || isAbsolute(insideRoot)) {
      response.writeHead(403);
      response.end();
      return;
    }

    const body = await readFile(path);
    response.writeHead(200, {
      'Content-Type': contentTypes[extname(path)] ?? 'application/octet-stream',
      'Content-Length': body.length,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch (error) {
    const status = error instanceof URIError ? 400 :
      ['ENOENT', 'ENOTDIR', 'EISDIR'].includes(error.code) ? 404 : 500;
    response.writeHead(status);
    response.end();
    if (status === 500) console.error(error);
  }
});

// Servidor de desenvolvimento local; não é infraestrutura de produção.
server.listen(5173, '127.0.0.1', () => {
  console.log('Memora: http://127.0.0.1:5173/');
  console.log('Beto:   http://127.0.0.1:5173/legado/');
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { cachePage, blockCellPage } from '../src/ui/cache-presentation.js';

test('página inclui vias vazias sem alterar a cache do motor e destaca o conjunto', () => {
  const stored = Object.freeze({ set: 14, way: 0, valid: true, tag: 1, block: 30, blockStart: 480, blockEnd: 495 });
  const cache = Object.freeze([stored]);
  const page = cachePage(cache, { cacheLines: 32, ways: 2 }, 0, 14);
  assert.equal(page.rows.length, 32);
  assert.equal(page.rows[0], stored);
  assert.equal(page.rows[1].valid, false);
  assert.equal(page.rows.filter(line => !line.valid).length, 31);
  assert.equal(cache.length, 1);
  assert.equal(page.rows[1].tag, null);
});

test('cache de 2^52 linhas é paginada e a última linha não perde precisão', () => {
  const total = 2 ** 52;
  const page = cachePage([], { cacheLines: total, ways: 1 }, total - 1);
  assert.equal(page.rows.length, 128);
  assert.equal(page.rows.at(-1).set, total - 1);
  assert.equal(page.end, total);
  assert.equal(cachePage([], { cacheLines: 32, ways: 1 }, 999).rows.length, 32);
});

test('células válidas e vazias são distintas e blocos enormes têm janela limitada', () => {
  const line = { valid: true, blockStart: 992 };
  const cells = blockCellPage(line, 16);
  assert.deepEqual(cells.cells.map(cell => cell.address), Array.from({ length: 16 }, (_, i) => 992 + i));
  assert.equal(blockCellPage({ valid: false }, 16).cells[0].address, null);
  const large = blockCellPage({ valid: true, blockStart: 0 }, 2 ** 52, 2 ** 52 - 1);
  assert.equal(large.cells.length, 16);
  assert.equal(large.cells.at(-1).address, 2 ** 52 - 1);
});

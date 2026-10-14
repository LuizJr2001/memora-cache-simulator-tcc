export const CACHE_PAGE_SIZE = 128;
export const BLOCK_PAGE_SIZE = 16;

/** Materializa somente a página visível, sem alocar a cache do motor. */
export function cachePage(cache, configuration, start = 0, currentSet = null) {
  const total = configuration.cacheLines;
  const pageStart = Math.max(0, Math.min(Math.floor(start / CACHE_PAGE_SIZE) * CACHE_PAGE_SIZE,
    Math.floor((total - 1) / CACHE_PAGE_SIZE) * CACHE_PAGE_SIZE));
  const end = Math.min(total, pageStart + CACHE_PAGE_SIZE);
  const occupied = new Map(cache.map(line => [line.set * configuration.ways + line.way, line]));
  const rows = [];
  for (let index = pageStart; index < end; index++) {
    rows.push(occupied.get(index) ?? { set: Math.floor(index / configuration.ways),
      way: index % configuration.ways, valid: false, tag: null, block: null });
  }
  rows.sort((a, b) => Number(b.set === currentSet) - Number(a.set === currentSet) || a.set - b.set || a.way - b.way);
  return { start: pageStart, end, total, rows };
}

/** Células vazias não têm endereço/tag armazenados; números representam células da MP. */
export function blockCellPage(line, cellsPerBlock, start = 0) {
  const pageStart = Math.max(0, Math.min(Math.floor(start / BLOCK_PAGE_SIZE) * BLOCK_PAGE_SIZE,
    Math.floor((cellsPerBlock - 1) / BLOCK_PAGE_SIZE) * BLOCK_PAGE_SIZE));
  const end = Math.min(cellsPerBlock, pageStart + BLOCK_PAGE_SIZE);
  const cells = [];
  for (let offset = pageStart; offset < end; offset++) {
    cells.push({ offset, address: line.valid ? line.blockStart + offset : null });
  }
  return { start: pageStart, end, total: cellsPerBlock, cells };
}

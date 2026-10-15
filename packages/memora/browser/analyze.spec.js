import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { HELP_CONTENT } from '../src/ui/help-content.js';

async function capture(page, name) {
  if (!process.env.MEMORA_ANALYSIS_SCREENSHOT_DIR) return;
  await mkdir(process.env.MEMORA_ANALYSIS_SCREENSHOT_DIR, { recursive: true });
  await page.screenshot({ path: resolve(process.env.MEMORA_ANALYSIS_SCREENSHOT_DIR, `${name}.png`), fullPage: true });
}
async function advance(page, count) { for (let i = 0; i < count; i++) await page.locator('#sim-next').click(); }
async function prepare(page, count = 20) {
  await page.locator('#load-example').click(); await page.locator('#prepare-input').click(); await advance(page, count);
}
async function open(page) { await page.locator('#go-analyze').click(); await expect(page.locator('#analysis-screen')).toBeVisible(); }
const before = (page, way) => page.locator(`#analysis-before-table tr[data-way="${way}"]`);
const after = (page, way) => page.locator(`#analysis-after-table tr[data-way="${way}"]`);

test.beforeEach(async ({ page }) => { await page.setViewportSize({ width: 1280, height: 900 }); await page.goto('/'); await page.evaluate(() => document.fonts.ready); });

test('Analisar orienta antes do primeiro acesso e a primeira carga mostra vaga livre', async ({ page }) => {
  await page.locator('#tab-analyze').click();
  await expect(page.locator('#analysis-screen')).toBeHidden();
  await prepare(page, 0); await expect(page.locator('#go-analyze')).toBeDisabled();
  for (let i = 0; i < 5; i++) await page.locator('#sim-step').click();
  await page.locator('#tab-analyze').click();
  await expect(page.locator('#analysis-screen')).toBeHidden();
  await page.locator('#sim-step').click(); await open(page);
  await expect(page.locator('#analysis-event-title')).toHaveText('Acesso 1 de 21 · endereço 0');
  await expect(before(page, 1)).toContainText('Usar via livre');
  expect(await before(page, 1).locator('td').nth(1).textContent()).toBe('0');
  expect(await after(page, 1).locator('td').nth(1).textContent()).toBe('1');
  await expect(page.locator('#analysis-out')).toHaveText('Nenhum bloco removido');
  await expect(page.locator('#analysis-in')).toContainText('0–15');
  await capture(page, 'primeira-carga');
  await page.locator('#analysis-return').click(); await page.locator('#sim-restart').click();
  await page.locator('#tab-analyze').click();
  await expect(page.locator('#analysis-screen')).toBeHidden(); await expect(page.locator('#go-analyze')).toBeDisabled();
});

test('acesso 20 preserva o bloco removido, a via e a decisão LRU nos dois snapshots', async ({ page }) => {
  await prepare(page); await open(page);
  await expect(page.locator('#tab-analyze')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#analysis-title')).toBeFocused();
  await expect(page.locator('#analysis-event-title')).toHaveText('Acesso 20 de 21 · endereço 3044');
  await expect(page.locator('#analysis-result')).toHaveText('✕ FALTA');
  await expect(page.locator('#analysis-tag')).toHaveText('11'); await expect(page.locator('#analysis-set')).toHaveText('14');
  await expect(page.locator('#analysis-offset')).toHaveText('4');
  await expect(before(page, 1)).toContainText('992–1007'); await expect(before(page, 1)).toContainText('SUBSTITUIR');
  await expect(before(page, 1)).toContainText('Menos recente'); await expect(before(page, 2)).toContainText('Mais recente');
  await expect(after(page, 1)).toContainText('3040–3055'); await expect(after(page, 1)).toContainText('Inserida');
  await expect(after(page, 1)).toContainText('Mais recente');
  await expect(page.locator('#analysis-out')).toHaveText('992–1007 · tag 3 · via 1');
  await expect(page.locator('#analysis-in')).toHaveText('3040–3055 · tag 11 · via 1');
  await expect(page.locator('.analysis-step-grid li')).toHaveCount(4);
  const styles = await page.evaluate(() => ({
    weights: [...document.querySelectorAll('#analysis-screen button')].map(n => getComputedStyle(n).fontWeight),
    family: getComputedStyle(document.querySelector('#analysis-title')).fontFamily,
    brand: document.querySelector('.brand-icon img').naturalWidth,
    slot: document.querySelector('.brand-icon img').getBoundingClientRect().width,
  }));
  expect(styles.weights.every(w => w === '700')).toBe(true); expect(styles.family).toContain('Inter');
  expect(styles.brand).toBe(30); expect(styles.slot).toBe(30);
  await capture(page, 'substituicao-lru');
});

test('revisão histórica avança pelos snapshots sem mudar os contadores ou reexecutar', async ({ page }) => {
  await prepare(page, 21); await page.getByRole('button', { name: 'Revisar acesso 19', exact: true }).click(); await open(page);
  await expect(page.locator('#analysis-result')).toHaveText('✓ ACERTO');
  await expect(page.locator('#analysis-out')).toHaveText('Nenhum bloco removido');
  await expect(page.locator('#analysis-in')).toContainText('Nenhum bloco carregado');
  await expect(before(page, 1)).toContainText('992–1007'); await expect(after(page, 1)).toContainText('992–1007');
  await capture(page, 'acerto-historico');
  await page.locator('#analysis-next').click(); await expect(page.locator('#analysis-event-title')).toContainText('Acesso 20 de 21');
  await expect(page.locator('#sim-progress')).toHaveText('21 / 21'); await expect(page.locator('#sim-misses')).toHaveText('9');
  await expect(page.locator('#analysis-out')).toContainText('992–1007');
  await page.locator('#analysis-next').click(); await expect(page.locator('#analysis-event-title')).toContainText('Acesso 21 de 21');
  await expect(page.locator('#analysis-next')).toBeDisabled(); await expect(page.locator('#analysis-in')).toContainText('96–111');
  await capture(page, 'ultimo-acesso');
  await page.locator('#analysis-return').click(); await expect(page.locator('#sim-progress')).toHaveText('21 / 21');
  await expect(page.locator('#history-table tr[data-access]')).toHaveCount(21);
});

test('próximo acesso no fim do histórico conclui uma etapa pendente sem duplicar', async ({ page }) => {
  await prepare(page, 19); for (let i = 0; i < 5; i++) await page.locator('#sim-step').click();
  await page.locator('#tab-analyze').click();
  await expect(page.locator('#analysis-event-title')).toContainText('Acesso 19 de 21');
  await expect(after(page, 1)).toContainText('992–1007');
  await page.locator('#analysis-next').click(); await expect(page.locator('#analysis-event-title')).toContainText('Acesso 20 de 21');
  await expect(page.locator('#sim-progress')).toHaveText('20 / 21'); await expect(page.locator('#sim-misses')).toHaveText('8');
  await expect(before(page, 1)).toContainText('992–1007'); await expect(after(page, 1)).toContainText('3040–3055');
  await expect(page.locator('#analysis-event-title')).toBeFocused();
  await page.locator('#analysis-next').click(); await expect(page.locator('#sim-progress')).toHaveText('21 / 21');
  await expect(page.locator('#analysis-next')).toBeDisabled();
});

test('Decimal/Binário é compartilhado nas três abas e mantém a seleção', async ({ page }) => {
  await prepare(page); await open(page); await page.locator('#analysis-binary').click();
  await expect(page.locator('#analysis-tag')).toHaveText('1011'); await expect(page.locator('#analysis-set')).toHaveText('1110');
  await expect(page.locator('#analysis-offset')).toHaveText('0100');
  await expect(page.locator('#analysis-out')).toHaveText('001111100000–001111101111 · tag 0011 · via 1');
  await expect(page.locator('#analysis-in')).toHaveText('101111100000–101111101111 · tag 1011 · via 1');
  await capture(page, 'formato-binario');
  await page.locator('#tab-simulate').click(); await expect(page.locator('#format-binary')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#tab-configure').click(); await page.locator('#tab-analyze').click();
  await expect(page.locator('#analysis-binary')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#analysis-event-title')).toContainText('Acesso 20 de 21');
  await page.locator('#analysis-decimal').click(); await page.locator('#analysis-return').click();
  await expect(page.locator('#format-decimal')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#sim-progress')).toHaveText('20 / 21');
});

test('trocar para análise pausa o relógio e as três abas têm navegação por teclado', async ({ page }) => {
  await page.clock.install(); await prepare(page, 1); await page.locator('#sim-play').click();
  await page.locator('#tab-simulate').focus(); await page.keyboard.press('ArrowRight');
  await expect(page.locator('#tab-analyze')).toBeFocused();
  await expect(page.locator('#analysis-screen')).toBeVisible();
  const beforeCount = await page.locator('#sim-progress').textContent(); await page.clock.fastForward(10000);
  await expect(page.locator('#sim-progress')).toHaveText(beforeCount);
  await page.keyboard.press('Home'); await expect(page.locator('#tab-configure')).toBeFocused();
  await page.keyboard.press('End'); await expect(page.locator('#tab-analyze')).toBeFocused();
  await page.locator('#analysis-return').click(); await expect(page.locator('#sim-play')).toContainText('Continuar');
});

test('editar a configuração descarta a análise anterior e exige novo acesso', async ({ page }) => {
  await prepare(page); await open(page); await page.locator('#tab-configure').click();
  await page.locator('#sequence').fill('16, 17'); await page.locator('#tab-analyze').click();
  await expect(page.locator('#analysis-screen')).toBeHidden();
  await page.locator('#prepare-input').click(); await page.locator('#tab-analyze').click();
  await expect(page.locator('#analysis-screen')).toBeHidden();
  await page.locator('#sim-next').click(); await open(page);
  await expect(page.locator('#analysis-event-title')).toHaveText('Acesso 1 de 2 · endereço 16');
  await expect(page.locator('#analysis-in')).toContainText('16–31');
  await expect(page.locator('#analysis-content')).not.toContainText('3040–3055');
});

for (const [mapping, policy, sequence, block, removed] of [
  ['direct', 'FIFO', '0,1,2,0,8', '8–9', '0–1'],
  ['fully-associative', 'FIFO', '0,2,0,4', '4–5', '0–1'],
  ['fully-associative', 'RANDOM', '0,2,0,4', '4–5', '0–1'],
]) test(`${mapping}/${policy}: decisão registrada sem LRU indevido`, async ({ page }) => {
  await page.addInitScript(() => { window.memoraRandomCalls = 0; Math.random = () => { window.memoraRandomCalls++; return 0; }; }); await page.reload();
  for (const [id, value] of [['memoryCells', '16'], ['cellsPerBlock', '2'], ['cacheLines', '2']]) await page.locator(`#${id}`).fill(value);
  await page.locator('#mapping').selectOption(mapping);
  if (mapping !== 'direct') await page.locator('#replacement').selectOption(policy);
  await page.locator('#sequence').fill(sequence); await page.locator('#prepare-input').click();
  await advance(page, sequence.split(',').length); await open(page);
  await expect(page.locator('.analysis-lru-column:visible')).toHaveCount(0);
  await expect(page.locator('#analysis-out')).toContainText(removed); await expect(page.locator('#analysis-in')).toContainText(block);
  await expect(page.locator('#analysis-before-description')).toContainText(mapping === 'direct' ? 'única posição' : policy === 'FIFO' ? 'entrou primeiro' : 'Random escolheu');
  if (policy === 'RANDOM') {
    expect(await page.evaluate(() => window.memoraRandomCalls)).toBe(1);
    await page.locator('#analysis-binary').click(); await page.locator('#analysis-return').click();
    await page.getByRole('button', { name: 'Revisar acesso 3', exact: true }).click(); await open(page);
    await page.locator('#analysis-next').click();
    expect(await page.evaluate(() => window.memoraRandomCalls)).toBe(1);
  }
  await capture(page, `politica-${mapping === 'direct' ? 'direto' : policy.toLowerCase()}`);
});

test('quatro ajudas mantêm exemplos fixos, Escape e foco de origem', async ({ page }) => {
  await prepare(page); await open(page);
  for (const key of ['analysis-decomposition', 'analysis-decision', 'analysis-snapshots', 'analysis-lru']) {
    const opener = page.locator(`#analysis-screen button[data-help="${key}"]`).first();
    await opener.click(); await expect(page.locator('#sheet-title')).toHaveText(HELP_CONTENT[key].title);
    for (const line of HELP_CONTENT[key].body[0].split('\n').filter(Boolean)) await expect(page.locator('#sheet-content')).toContainText(line);
    for (const line of HELP_CONTENT[key].body[1].split('\n').filter(Boolean)) await expect(page.locator('#sheet-content')).toContainText(line);
    if (key === 'analysis-lru') await capture(page, 'ajuda-lru-na-decisao');
    await page.keyboard.press('Escape'); await expect(opener).toBeFocused();
  }
  await page.locator('#analysis-next').click();
  await page.locator('#analysis-screen button[data-help="analysis-snapshots"]').last().click();
  await expect(page.locator('#sheet-content')).toContainText('Na via 1, o bloco 992–1007');
  await page.getByRole('button', { name: 'Fechar: Estado antes × depois' }).click();
  await expect(page.locator('#analysis-event-title')).toContainText('Acesso 21 de 21');
});

async function fits(page, viewport) {
  const geometry = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight,
    overflow: getComputedStyle(document.body).overflow,
    overlap: [...document.querySelectorAll('.analysis-snapshot')].some(n =>
      n.querySelector('.simulation-description').getBoundingClientRect().bottom > n.querySelector('.table-scroll').getBoundingClientRect().top + 1),
    outside: [...document.querySelectorAll('#analysis-screen button, .analysis-parts, .analysis-blocks, .attribution')].filter(n => {
      const r = n.getBoundingClientRect(); return r.width && r.height && !n.closest('.table-scroll') && (r.left < 0 || r.right > innerWidth + 1 || r.bottom > innerHeight + 1);
    }).map(n => n.id || n.className) }));
  expect(geometry.width).toBeLessThanOrEqual(viewport.width); expect(geometry.height).toBeLessThanOrEqual(viewport.height);
  expect(geometry.overflow).not.toBe('hidden'); expect(geometry.outside).toEqual([]); expect(geometry.overlap).toBe(false);
}
for (const viewport of [{ width: 1280, height: 720 }, { width: 1366, height: 768 }, { width: 1480, height: 742 }, { width: 1920, height: 1080 }]) {
  test(`Analisar cabe no desktop ${viewport.width} × ${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport); await prepare(page); await open(page); await fits(page, viewport);
    await capture(page, `desktop-${viewport.width}x${viewport.height}`);
    await page.locator('#analysis-binary').click(); await fits(page, viewport);
    await page.locator('#analysis-next').click(); await fits(page, viewport);
    await page.locator('#analysis-return').click(); await page.getByRole('button', { name: 'Revisar acesso 19', exact: true }).click();
    await open(page); await fits(page, viewport);
  });
}
for (const width of [1024, 801, 768, 390, 320]) {
  test(`Analisar responsivo e ajuda sem overflow horizontal em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 }); await prepare(page); await open(page); await page.locator('#analysis-binary').click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    if (width === 390) await capture(page, 'mobile-binario');
    await page.locator('#analysis-screen button[data-help="analysis-decomposition"]').click();
    const box = await page.getByRole('dialog').boundingBox(); expect(box.width).toBeLessThanOrEqual(width);
    await page.keyboard.press('Escape');
    const scroll = page.locator('.analysis-snapshot .table-scroll').first(); await scroll.focus(); await page.keyboard.press('ArrowRight');
    if (await scroll.evaluate(n => n.scrollWidth > n.clientWidth)) await expect.poll(() => scroll.evaluate(n => n.scrollLeft)).toBeGreaterThan(0);
  });
}

test('52 bits e campos de zero bits mantêm todos os dados sem alocar vias vazias', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  for (const [id, value] of [['memoryCells', '4503599627370496'], ['cellsPerBlock', '1'], ['cacheLines', '4503599627370496']]) await page.locator(`#${id}`).fill(value);
  await page.locator('#mapping').selectOption('fully-associative'); await page.locator('#sequence').fill('4503599627370495, 4503599627370495');
  await page.locator('#prepare-input').click(); await advance(page, 1); await open(page); await page.locator('#analysis-binary').click();
  await expect(page.locator('#analysis-tag')).toHaveText('1'.repeat(52)); await expect(page.locator('#analysis-offset')).toHaveText('—');
  await expect(page.locator('#analysis-set-label')).toHaveText('Sem bits de conjunto');
  await expect(page.locator('#analysis-before-table tbody tr')).toHaveCount(1);
  await expect(page.locator('#analysis-after-table tbody tr')).toHaveCount(1);
  await fits(page, { width: 1280, height: 720 }); await capture(page, 'endereco-52-bits');
  await page.locator('#analysis-next').click(); await expect(page.locator('#analysis-result')).toHaveText('✓ ACERTO');
});

test('muitas vias têm rolagem local navegável por teclado e conservam a página', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  for (const [id, value] of [['memoryCells', '128'], ['cellsPerBlock', '1'], ['cacheLines', '32']]) await page.locator(`#${id}`).fill(value);
  await page.locator('#mapping').selectOption('fully-associative'); await page.locator('#replacement').selectOption('FIFO');
  await page.locator('#sequence').fill(Array.from({ length: 33 }, (_, i) => i).join(', '));
  await page.locator('#prepare-input').click(); await advance(page, 33); await open(page);
  await expect(page.locator('#analysis-before-table tbody tr')).toHaveCount(32);
  await fits(page, { width: 1280, height: 720 });
  const scroll = page.locator('.analysis-snapshot .table-scroll').first(); await scroll.focus(); await page.keyboard.press('End');
  await expect.poll(() => scroll.evaluate(n => n.scrollTop)).toBeGreaterThan(0); expect(await page.evaluate(() => scrollY)).toBe(0);
  await capture(page, 'muitas-vias');
});

import { test, expect } from '@playwright/test';
import { configureReferenceScenario } from './reference-scenario.js';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const before = (page, way) => page.locator(`#analysis-before-table tr[data-way="${way}"]`);
const after = (page, way) => page.locator(`#analysis-after-table tr[data-way="${way}"]`);
async function prepare(page, count = 20) {
  await configureReferenceScenario(page);
  await page.locator('#prepare-input').click();
  for (let i = 0; i < count; i++) await page.locator('#sim-next').click();
}
async function open(page) {
  await page.locator('#access-comparison summary').click();
  await expect(page.locator('#access-comparison')).toHaveAttribute('open', '');
  await expect(page.locator('#simulation-screen')).toBeVisible();
}
async function capture(page, name) {
  if (!process.env.MEMORA_ANALYSIS_SCREENSHOT_DIR) return;
  await mkdir(process.env.MEMORA_ANALYSIS_SCREENSHOT_DIR, { recursive: true });
  await page.screenshot({path: resolve(process.env.MEMORA_ANALYSIS_SCREENSHOT_DIR, `${name}.png`), fullPage: true});
}

test.beforeEach(async ({page}) => {
  await page.setViewportSize({width:1280, height:900});
  await page.goto('/');
});

test('duas etapas e comparação contextual recolhida preservam a tabela da cache', async ({page}) => {
  await expect(page.getByRole('tab')).toHaveCount(2);
  await prepare(page, 0);
  await expect(page.locator('#access-comparison')).toBeHidden();
  await page.locator('#sim-next').click();
  await expect(page.locator('#access-comparison')).not.toHaveAttribute('open');
  await expect(page.locator('#cache-scroll')).toBeVisible();
  await open(page);
  await expect(page.locator('#cache-scroll')).toBeHidden();
  await expect(before(page,1)).toContainText('Usar via livre');
  await expect(after(page,1)).toContainText('0–15');
  await expect(page.locator('#analysis-out')).toHaveText('Nenhum bloco removido');
  await page.locator('#access-comparison summary').click();
  await expect(page.locator('#cache-scroll')).toBeVisible();
  await page.locator('#tab-configure').focus();
  await page.keyboard.press('End');
  await expect(page.locator('#tab-simulate')).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#tab-configure')).toBeFocused();
});

test('comparação LRU conserva antes/depois, vítima e recência sem repetir o roteiro', async ({page}) => {
  await prepare(page); await open(page);
  await expect(page.locator('#analysis-event-title')).toHaveText('Acesso 20 de 21 · endereço 3044');
  await expect(before(page,1)).toContainText('992–1007');
  await expect(before(page,1)).toContainText('SUBSTITUIR');
  await expect(before(page,1)).toContainText('Menos recente');
  await expect(after(page,1)).toContainText('3040–3055');
  await expect(after(page,1)).toContainText('Mais recente');
  await expect(page.locator('#analysis-out')).toHaveText('992–1007 · tag 3 · via 1');
  await expect(page.locator('#analysis-in')).toHaveText('3040–3055 · tag 11 · via 1');
  await expect(page.locator('.analysis-step-grid')).toHaveCount(0);
  await expect(page.locator('#access-detail-steps li')).toHaveCount(6);
  await capture(page, 'comparacao-lru');
});

test('navegação compara só acessos realizados e sincroniza histórico, sem executar o seguinte', async ({page}) => {
  await prepare(page, 2); await open(page);
  await expect(page.locator('#comparison-next')).toBeDisabled();
  await page.locator('#comparison-previous').click();
  await expect(page.locator('#analysis-event-title')).toContainText('Acesso 1 de 21');
  await expect(page.getByRole('button', {name:'Revisar acesso 1',exact:true})).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('#comparison-previous')).toBeDisabled();
  await page.locator('#comparison-next').click();
  await expect(page.locator('#analysis-event-title')).toContainText('Acesso 2 de 21');
  await expect(page.locator('#comparison-next')).toBeDisabled();
  await expect(page.locator('#sim-progress')).toHaveText('2 / 21');
  await expect(page.locator('#history-table tr[data-access]')).toHaveCount(2);
});

test('seleção de várias substituições e Decimal/Binário usam o mesmo acesso e estado', async ({page}) => {
  await page.locator('#cacheLines').fill('4');
  await page.locator('#mapping').selectOption('set-associative');
  await page.locator('#ways').selectOption('2');
  await page.locator('#replacement').selectOption('LRU');
  await page.locator('#sequence').fill('0, 16, 32, 48, 0, 64, 16, 80, 32, 96, 48, 112, 64, 128, 80, 144');
  await page.locator('#prepare-input').click(); await page.locator('#sim-finish').click();
  await page.getByRole('button', {name:'Revisar acesso 6',exact:true}).click();
  await open(page);
  await expect(page.locator('#analysis-out')).toContainText('32–47');
  await expect(page.locator('#analysis-in')).toContainText('64–79');
  await page.locator('#comparison-next').click();
  await page.locator('#comparison-next').click();
  await expect(page.locator('#analysis-out')).toContainText('48–63');
  await expect(page.locator('#analysis-in')).toContainText('80–95');
  await page.locator('#format-binary').click();
  await expect(page.locator('#analysis-event-title')).toContainText('000001010000');
  await expect(page.locator('#sim-address')).toHaveText('000001010000');
  await expect(page.locator('#sim-progress')).toHaveText('16 / 16');
  await expect(page.locator('#sim-hits')).toHaveText('2');
  await expect(page.locator('#sim-misses')).toHaveText('14');
  await capture(page,'comparacao-varias-binario');
});

for (const [mapping,replacement] of [['direct','FIFO'],['fully-associative','FIFO'],['fully-associative','RANDOM']]) {
  test(`comparação ${mapping}/${replacement} preserva política e não inventa LRU`, async ({page}) => {
    await page.addInitScript(() => {Math.random = () => 0;}); await page.reload();
    await page.locator('#memoryCells').fill('16'); await page.locator('#cellsPerBlock').fill('1');
    await page.locator('#cacheLines').fill('2'); await page.locator('#mapping').selectOption(mapping);
    if(mapping !== 'direct') await page.locator('#replacement').selectOption(replacement);
    await page.locator('#sequence').fill('0, 1, 2');
    await page.locator('#prepare-input').click(); await page.locator('#sim-finish').click(); await open(page);
    await expect(page.locator('#analysis-out')).toContainText('0');
    await expect(page.locator('#analysis-in')).toContainText('2');
    await expect(page.locator('.analysis-lru-column:visible')).toHaveCount(0);
  });
}

test('abrir e revisar preservam a microetapa pendente; reinício e nova configuração limpam comparação', async ({page}) => {
  await page.clock.install(); await prepare(page, 19);
  await page.locator('#sim-play').click(); await page.clock.runFor(800);
  await expect(page.locator('#sim-play')).toHaveText('Ⅱ Pausar');
  await expect(page.locator('#sim-progress')).toHaveText('19 / 21');
  await open(page);
  await expect(page.locator('#sim-play')).toHaveText('▶ Continuar');
  await page.clock.runFor(2000);
  await expect(page.locator('#sim-progress')).toHaveText('19 / 21');
  await expect(page.locator('#analysis-event-title')).toContainText('Acesso 19 de 21');
  await expect(page.locator('#comparison-next')).toBeDisabled();
  await page.locator('#comparison-previous').click();
  await page.locator('#show-live').click();
  await page.locator('#sim-next').click();
  await expect(page.locator('#sim-progress')).toHaveText('20 / 21');
  await expect(page.locator('#analysis-out')).toContainText('992–1007');
  await page.locator('#sim-play').click();
  await expect(page.locator('#access-comparison')).not.toHaveAttribute('open');
  await page.locator('#sim-restart').click();
  await expect(page.locator('#access-comparison')).toBeHidden();
  await expect(page.locator('#access-comparison')).not.toHaveAttribute('open');
  await page.locator('#tab-configure').click(); await page.locator('#sequence').fill('0, 1');
  await page.locator('#prepare-input').click();
  await expect(page.locator('#access-comparison')).toBeHidden();
});

test('comparação é operável por teclado e mantém ajuda e foco', async ({page}) => {
  await prepare(page, 20);
  await page.locator('#access-comparison summary').focus(); await page.keyboard.press('Enter');
  await expect(page.locator('#analysis-before-table')).toBeVisible();
  const help=page.locator('#access-comparison button[data-help="analysis-snapshots"]').first();
  await help.click(); await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape'); await expect(help).toBeFocused();
  await page.locator('#access-comparison summary').focus(); await page.keyboard.press('Enter');
  await expect(page.locator('#cache-scroll')).toBeVisible();
});

for (const [width,height] of [[1280,720],[1366,768],[1920,1080],[801,900],[390,900],[320,900]]) {
  test(`comparação cabe no cartão e mantém rolagem local em ${width}x${height}`, async ({page}) => {
    await page.setViewportSize({width,height}); await prepare(page); await open(page);
    await expect(page.locator('#analysis-before-table')).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    if(width>1100) expect(await page.evaluate(()=>document.documentElement.scrollHeight)).toBeLessThanOrEqual(height);
    await capture(page,`comparacao-${width}x${height}`);
  });
}

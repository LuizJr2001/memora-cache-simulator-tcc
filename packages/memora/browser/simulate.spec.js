import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { HELP_CONTENT } from '../src/ui/help-content.js';
import { EXAMPLE_ADDRESSES } from '../src/core/addresses.js';

async function screenshot(page, name) {
  if (!process.env.MEMORA_SIMULATION_SCREENSHOT_DIR) return;
  await mkdir(process.env.MEMORA_SIMULATION_SCREENSHOT_DIR, { recursive: true });
  await page.screenshot({ path: resolve(process.env.MEMORA_SIMULATION_SCREENSHOT_DIR, `${name}.png`), fullPage: true });
}
async function prepare(page) {
  await page.locator('#load-example').click(); await page.locator('#prepare-input').click();
  await expect(page.locator('#simulation-screen')).toBeVisible();
}
async function advance(page, count) {
  for (let i = 0; i < count; i++) await page.locator('#sim-next').click();
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/'); await page.evaluate(() => document.fonts.ready);
});

test('entrada preparada abre Simular vazio e preserva os assets e o sistema visual', async ({ page }) => {
  await prepare(page);
  await expect(page.locator('#sim-progress')).toHaveText('0 / 21');
  await expect(page.locator('#sim-hits')).toHaveText('0'); await expect(page.locator('#sim-misses')).toHaveText('0');
  await expect(page.locator('#sim-hit-rate')).toHaveText('—');
  await expect(page.locator('#cache-table tbody tr[data-valid="1"]')).toHaveCount(0); await expect(page.locator('#history-empty')).toBeVisible();
  await expect(page.locator('#sim-address')).toHaveText('—');
  await expect(page.locator('#tab-simulate')).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tab', { name: '3 Analisar' })).toBeEnabled();
  await expect.poll(() => page.evaluate(() => performance.getEntriesByType('resource').some(entry => entry.initiatorType === 'css' && entry.name.endsWith('/src/assets/speed-knob.svg')))).toBe(true);
  const assets = await page.evaluate(async () => {
    const response = await fetch('./src/assets/speed-knob.svg');
    const svg = new DOMParser().parseFromString(await response.text(), 'image/svg+xml').documentElement;
    return { brand: document.querySelector('.brand-icon img').naturalWidth,
      font: getComputedStyle(document.querySelector('#sim-play')).fontFamily,
      weights: [...document.querySelectorAll('#simulation-screen button')].map(n => getComputedStyle(n).fontWeight),
      width: svg.getAttribute('width'), height: svg.getAttribute('height') };
  });
  expect(assets.brand).toBe(30); expect(assets.font).toContain('Inter');
  expect(assets.weights.every(weight => weight === '700')).toBe(true);
  expect(assets.width).toBe('14'); expect(assets.height).toBe('14');
  await screenshot(page, 'antes-de-iniciar');
});

test('seis microetapas não antecipam estatísticas e o próximo acesso não duplica o atual', async ({ page }) => {
  await prepare(page);
  for (const label of ['Decompor endereço', 'Buscar tag no conjunto', 'Resultado do acesso', 'Selecionar linha', 'Atualizar cache']) {
    await page.locator('#sim-step').click(); await expect(page.locator('#sim-status')).toContainText(label);
    await expect(page.locator('#sim-progress')).toHaveText('0 / 21');
  }
  await expect(page.locator('#cache-table tbody tr[data-valid="1"]')).toHaveCount(1);
  await expect(page.locator('#history-table tbody [data-pending]')).toHaveCount(1);
  await page.locator('#sim-next').click(); await expect(page.locator('#sim-progress')).toHaveText('1 / 21');
  await expect(page.locator('#sim-misses')).toHaveText('1');
  await page.locator('#sim-next').click(); await expect(page.locator('#sim-progress')).toHaveText('2 / 21');
  await expect(page.locator('#sim-hits')).toHaveText('1');
});

test('cenário didático reproduz LRU, substituição e conclusão com histórico completo', async ({ page }) => {
  await prepare(page); await advance(page, 19);
  await expect(page.locator('#sim-progress')).toHaveText('19 / 21');
  await expect(page.locator('#sim-hits')).toHaveText('12'); await expect(page.locator('#sim-misses')).toHaveText('7');
  await expect(page.locator('#sim-hit-rate')).toHaveText('63,2%'); await expect(page.locator('#sim-used-lines')).toHaveText('7 / 32');
  await expect(page.locator('#sim-address')).toHaveText('2018'); await expect(page.locator('#sim-tag')).toHaveText('7');
  await expect(page.locator('#sim-set')).toHaveText('14'); await expect(page.locator('#sim-offset')).toHaveText('2');
  const via1 = page.locator('#cache-table tr[data-set="14"][data-way="1"]');
  const via2 = page.locator('#cache-table tr[data-set="14"][data-way="2"]');
  await expect(via1).toContainText('992–1007'); await expect(via1).toContainText('Próx. substituição');
  await expect(via2).toContainText('2016–2031'); await expect(via2).toContainText('Mais recente');
  await screenshot(page, 'acesso-19-lru');
  for (let i = 0; i < 4; i++) await page.locator('#sim-step').click();
  await expect(page.locator('#history-state')).toContainText('LRU escolhe a via 1, com o bloco 992–1007');
  await screenshot(page, 'selecao-vitima');
  await page.locator('#sim-step').click(); await expect(via1).toContainText('3040–3055');
  await expect(page.locator('#sim-progress')).toHaveText('19 / 21');
  await screenshot(page, 'atualizando-cache');
  await page.locator('#sim-next').click();
  await expect(page.locator('#history-table tr[data-access="20"]')).toContainText('Substitui o bloco 992–1007 da via 1 pelo bloco 3040–3055');
  await expect(page.locator('#sim-misses')).toHaveText('8');
  await page.locator('#sim-next').click(); await expect(page.locator('#simulation-complete')).toBeVisible();
  await expect(page.locator('#sim-progress')).toHaveText('21 / 21');
  await expect(page.locator('#sim-hits')).toHaveText('12'); await expect(page.locator('#sim-misses')).toHaveText('9');
  await expect(page.locator('#sim-hit-rate')).toHaveText('57,1%'); await expect(page.locator('#sim-used-lines')).toHaveText('8 / 32');
  await expect(page.locator('#history-table tr[data-access]')).toHaveCount(21);
  await expect(page.locator('#history-table tr[data-access]').first()).toHaveAttribute('data-access', '21');
  await expect(page.locator('#sim-next')).toBeDisabled(); await expect(page.locator('#sim-step')).toBeDisabled();
  await expect(page.locator('#sim-address')).toHaveText('—'); await screenshot(page, 'simulacao-concluida');
});

test('revisão e filtro usam snapshots sem reexecutar ou mudar as estatísticas', async ({ page }) => {
  await prepare(page); await advance(page, 19);
  for (let i = 0; i < 4; i++) await page.locator('#sim-step').click();
  await expect(page.locator('#history-state')).toContainText('LRU escolhe a via 1');
  await page.getByRole('button', { name: 'Revisar acesso 19', exact: true }).click();
  await expect(page.locator('#history-state')).toContainText('A via 2 é a mais recente');
  await expect(page.locator('#cache-table tr[data-set="14"][data-way="2"]')).toContainText('Mantida');
  await expect(page.locator('#history-table [data-pending]')).toHaveCount(0);
  await expect(page.locator('#sim-progress')).toHaveText('19 / 21');
  await page.locator('#show-live').click();
  await expect(page.locator('#history-state')).toContainText('LRU escolhe a via 1');
  await expect(page.locator('#history-table [data-pending]')).toHaveCount(1);
  await advance(page, 2);
  await page.getByRole('button', { name: 'Revisar acesso 19', exact: true }).click();
  await expect(page.locator('#current-address-heading')).toHaveText('Acesso 19 em revisão');
  await expect(page.locator('#sim-progress')).toHaveText('21 / 21');
  await expect(page.locator('#cache-table tr[data-set="14"][data-way="1"]')).toContainText('992–1007');
  await expect(page.locator('#cache-table tr[data-set="14"][data-way="2"]')).toContainText('2016–2031');
  await screenshot(page, 'revisao-acesso');
  await page.locator('#show-live').click(); await expect(page.locator('#sim-address')).toHaveText('—');
  await page.locator('#review-replacements').click();
  await expect(page.locator('#history-table tr[data-access]')).toHaveCount(1);
  await expect(page.locator('#history-description')).toHaveText('1 substituição · selecione para revisar');
  await expect(page.locator('#current-address-heading')).toHaveText('Acesso 20 em revisão');
  await expect(page.locator('#sim-progress')).toHaveText('21 / 21');
  await page.locator('#show-all-history').click(); await expect(page.locator('#history-table tr[data-access]')).toHaveCount(21);
});

test('Decimal/Binário altera endereço, tag, conjunto, blocos e explicações sem reiniciar', async ({ page }) => {
  await prepare(page); await advance(page, 20);
  await page.locator('#format-binary').click();
  await expect(page.locator('#format-binary')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#sim-address')).toHaveText('101111100100');
  await expect(page.locator('#sim-tag')).toHaveText('1011'); await expect(page.locator('#sim-set')).toHaveText('1110');
  await expect(page.locator('#sim-offset')).toHaveText('0100');
  await expect(page.locator('#history-table tr[data-access="20"]')).toContainText('001111100000–001111101111');
  await expect(page.locator('#history-table tr[data-access="20"]')).toContainText('101111100000–101111101111');
  await expect(page.locator('#sim-progress')).toHaveText('20 / 21'); await expect(page.locator('#sim-misses')).toHaveText('8');
  await screenshot(page, 'formato-binario');
  await page.locator('#format-decimal').click(); await expect(page.locator('#sim-address')).toHaveText('3044');
  await expect(page.locator('#history-table tr[data-access="20"]')).toContainText('992–1007');
});

test('play, pause, velocidade e navegação cancelam o relógio e preservam o andamento', async ({ page }) => {
  await page.clock.install(); await prepare(page); await page.locator('#sim-play').click();
  await expect(page.locator('#sim-status')).toContainText('Decompor endereço');
  await page.clock.runFor(400); await page.locator('#sim-play').click();
  const status = await page.locator('#sim-status').textContent();
  await page.clock.runFor(2000); await expect(page.locator('#sim-status')).toHaveText(status);
  await page.locator('#sim-speed').focus(); await page.keyboard.press('End');
  await expect(page.locator('#sim-speed')).toHaveValue('10');
  await page.locator('#sim-detailed').uncheck(); await page.locator('#sim-play').click();
  await expect(page.locator('#sim-progress')).toHaveText('1 / 21');
  await page.locator('#tab-configure').click(); await page.clock.runFor(2000);
  await page.locator('#tab-simulate').click(); await expect(page.locator('#sim-progress')).toHaveText('1 / 21');
  await expect(page.locator('#sim-play')).toHaveText('▶ Continuar');
  await page.locator('#sim-restart').click(); await expect(page.locator('#sim-progress')).toHaveText('0 / 21');
  await expect(page.locator('#history-table tr[data-access]')).toHaveCount(0); await expect(page.locator('#cache-table tbody tr[data-valid="1"]')).toHaveCount(0);
});

test('mudança da configuração invalida a simulação antiga e nova preparação inicia em zero', async ({ page }) => {
  await prepare(page); await advance(page, 2); await page.locator('#tab-configure').click();
  await expect(page.locator('#sequence')).toHaveValue(EXAMPLE_ADDRESSES.join(', '));
  await page.locator('#sequence').fill('0, 1'); await page.locator('#tab-simulate').click(); await expect(page.locator('#navigation-warning')).toBeVisible();
  await page.locator('#prepare-input').click(); await expect(page.locator('#sim-progress')).toHaveText('0 / 2');
  await expect(page.locator('#sim-hits')).toHaveText('0'); await expect(page.locator('#cache-table tbody tr[data-valid="1"]')).toHaveCount(0);
  await page.locator('#tab-configure').focus(); await page.keyboard.press('ArrowRight');
  await expect(page.locator('#tab-simulate')).toBeFocused();
  await page.keyboard.press('ArrowLeft'); await expect(page.locator('#configuration-screen')).toBeVisible();
  await page.locator('#memoryCells').fill('100'); await expect(page.locator('#prepare-input')).toBeDisabled();
  await page.locator('#tab-simulate').click(); await expect(page.locator('#navigation-warning')).toBeVisible();
});

for (const [mapping, replacement, victim] of [['direct', 'FIFO', '0–0'], ['fully-associative', 'FIFO', '0–0'], ['fully-associative', 'RANDOM', '1–1']]) {
  test(`${mapping}/${replacement}: regra real e ausência de LRU indevido`, async ({ page }) => {
    await page.addInitScript(() => { Math.random = () => .999999; }); await page.reload();
    await page.locator('#memoryCells').fill('16'); await page.locator('#cellsPerBlock').fill('1');
    await page.locator('#cacheLines').fill('2'); await page.locator('#mapping').selectOption(mapping);
    if (mapping !== 'direct') await page.locator('#replacement').selectOption(replacement);
    await page.locator('#sequence').fill('0, 1, 0, 2'); await page.locator('#prepare-input').click();
    await advance(page, 4);
    await expect(page.locator('#history-table tr[data-access="4"]')).toContainText(`bloco ${victim}`);
    await expect(page.locator('#cache-table').getByRole('columnheader', { name: /LRU/ })).toHaveCount(0);
    await expect(page.locator('#sim-hits')).toHaveText('1'); await expect(page.locator('#sim-misses')).toHaveText('3');
  });
}

test('três ajudas têm texto fixo, Escape e foco; Glossário encadeado retorna à origem', async ({ page }) => {
  await prepare(page); await advance(page, 19);
  for (const key of ['cache', 'history', 'lru']) {
    const opener = page.locator(`button[data-help="${key}"]`); await opener.click();
    await expect(page.locator('#sheet-title')).toHaveText(HELP_CONTENT[key].title);
    for (const line of HELP_CONTENT[key].body[0].split('\n').filter(Boolean)) await expect(page.locator('#sheet-content')).toContainText(line);
    await expect(page.locator('#sheet-content')).toContainText(HELP_CONTENT[key].body[1]);
    await expect(page.locator('#close-sheet')).toBeFocused();
    if (key === 'lru') {
      await screenshot(page, 'ajuda-lru');
      await page.getByRole('button', { name: 'Abrir glossário completo' }).click();
      await expect(page.locator('#sheet-title')).toHaveText('Glossário');
    }
    await page.keyboard.press('Escape'); await expect(opener).toBeFocused();
    await expect(page.locator('#sim-progress')).toHaveText('19 / 21');
  }
});

test('ajuda aberta durante reprodução pausa e restaura o foco do LRU', async ({ page }) => {
  await page.clock.install(); await prepare(page); await page.locator('#sim-play').click();
  const opener = page.locator('#lru-help'); await opener.click();
  const before = await page.locator('#sim-progress').textContent();
  await page.clock.runFor(3000); await page.keyboard.press('Escape');
  await expect(opener).toBeFocused(); await expect(page.locator('#sim-progress')).toHaveText(before);
  await expect(page.locator('#sim-play')).toHaveText('▶ Continuar');
});

for (const viewport of [{ width: 1280, height: 720 }, { width: 1366, height: 768 }, { width: 1480, height: 742 }, { width: 1920, height: 1080 }]) {
  test(`layout Simular cabe no desktop ${viewport.width} × ${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport); await prepare(page);
    async function fits() {
      const data = await page.evaluate(() => ({ width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight, overflow: getComputedStyle(document.body).overflow,
        cacheHeight: document.querySelector('.cache-scroll').clientHeight,
        outside: [...document.querySelectorAll('#simulation-screen button, #simulation-screen input, .attribution')].filter(n => {
          const r = n.getBoundingClientRect(); if (!r.width || !r.height || n.closest('.table-scroll')) return false;
          return r.x < 0 || r.right > innerWidth + 1 || r.bottom > innerHeight + 1;
        }).map(n => n.id) }));
      expect(data.width).toBeLessThanOrEqual(viewport.width); expect(data.height).toBeLessThanOrEqual(viewport.height);
      expect(data.overflow).not.toBe('hidden'); expect(data.outside).toEqual([]); expect(data.cacheHeight).toBeGreaterThanOrEqual(160);
    }
    await fits(); await advance(page, 19); await fits(); await screenshot(page, `layout-${viewport.width}x${viewport.height}`);
    await advance(page, 2); await fits(); await screenshot(page, `concluida-${viewport.width}x${viewport.height}`);
    await page.locator('.history-scroll').focus(); await page.keyboard.press('End');
    await expect.poll(() => page.locator('.history-scroll').evaluate(n => n.scrollTop)).toBeGreaterThan(0);
    expect(await page.evaluate(() => scrollY)).toBe(0);
    await page.getByRole('button', { name: 'Revisar acesso 1', exact: true }).click();
    await fits(); await expect(page.locator('#sim-progress')).toHaveText('21 / 21');
  });
}

for (const width of [1024, 801, 768, 390, 320]) {
  test(`Simular e tabelas sem overflow horizontal em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 }); await prepare(page); await advance(page, 20);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await page.locator('#format-binary').click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    const review = page.getByRole('button', { name: 'Revisar acesso 20', exact: true });
    expect(await review.evaluate(n => n.getBoundingClientRect().height)).toBeLessThanOrEqual(30);
    expect(await review.evaluate(n => n.scrollWidth <= n.clientWidth)).toBe(true);
    if (width === 390) await screenshot(page, 'mobile-binario');
    await page.locator('button[data-help="history"]').click();
    const sheet = await page.getByRole('dialog').boundingBox(); expect(sheet.width).toBeLessThanOrEqual(width);
    await page.keyboard.press('Escape');
  });
}

test('endereços de 52 bits e cache enorme mantêm renderização paginada', async ({ page }) => {
  for (const [id, value] of [['memoryCells', '4503599627370496'], ['cellsPerBlock', '1'], ['cacheLines', '4503599627370496']]) await page.locator(`#${id}`).fill(value);
  await page.locator('#mapping').selectOption('fully-associative');
  await page.locator('#sequence').fill('0, 4503599627370495, 4503599627370495');
  await page.locator('#prepare-input').click(); await advance(page, 2);
  await expect(page.locator('#cache-table tbody tr')).toHaveCount(128);
  await expect(page.locator('#cache-table tbody tr[data-valid="1"]')).toHaveCount(2);
  await page.locator('#format-binary').click(); await expect(page.locator('#sim-address')).toHaveText('1'.repeat(52));
  await expect(page.locator('#sim-tag')).toHaveText('1'.repeat(52));
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(1280);
  await page.locator('#sim-next').click(); await expect(page.locator('#sim-hits')).toHaveText('1');
});


test('abas orientam campos pendentes e exigem iniciar a simulação', async ({ page }) => {
  await page.locator('#tab-simulate').click();
  await expect(page.locator('#navigation-warning')).toHaveText('Configuração pendente. Complete ou corrija os campos destacados para continuar.');
  await expect(page.locator('#simulation-screen')).toBeHidden();
  await page.locator('#memoryCells').fill('');
  await page.locator('#tab-analyze').click();
  await expect(page.locator('#navigation-warning')).toHaveText('Configuração pendente. Complete ou corrija os campos destacados para continuar.');
  await expect(page.locator('#navigation-warning')).toHaveCSS('color', 'rgb(185, 28, 28)');
  await page.locator('#load-example').click();
  await expect(page.locator('#navigation-warning')).toContainText('Clique em Iniciar simulação');
  await page.locator('#tab-simulate').click();
  await expect(page.locator('#simulation-screen')).toBeHidden();
  await page.locator('#prepare-input').click();
  await expect(page.locator('#simulation-screen')).toBeVisible();
});

test('aviso de análise permanece em Simular e desaparece ao iniciar ou avançar', async ({ page }) => {
  await prepare(page);
  await page.locator('#tab-analyze').click();
  await expect(page.locator('#simulation-screen')).toBeVisible();
  await expect(page.locator('#configuration-screen')).toBeHidden();
  await expect(page.locator('#tab-simulate')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#simulation-analysis-warning')).toBeVisible();
  await expect(page.locator('#simulation-analysis-warning')).toContainText('nesta tela');
  await expect(page.locator('#navigation-warning')).toBeHidden();
  await page.locator('#sim-play').click();
  await expect(page.locator('#simulation-analysis-warning')).toBeHidden();
  await page.locator('#sim-play').click();
  await page.locator('#tab-analyze').click();
  await expect(page.locator('#simulation-analysis-warning')).toBeVisible();
  await page.locator('#sim-step').click();
  await expect(page.locator('#simulation-analysis-warning')).toBeHidden();
});


test('Etapas detalhadas muda apresentação e avanço manual sem perder o acesso atual', async ({ page }) => {
  await prepare(page);
  await expect(page.locator('#access-details')).toBeVisible();
  await page.locator('#sim-step').click();
  await expect(page.locator('#access-detail-steps [aria-current="step"]')).toContainText('Decompor endereço');
  await expect(page.locator('#access-binary')).toContainText('Deslocamento');
  await expect(page.locator('#sim-progress')).toHaveText('0 / 21');
  await page.locator('#sim-step').click();
  await expect(page.locator('#access-detail-steps [aria-current="step"]')).toContainText('Nenhuma linha válida');
  await page.locator('#sim-detailed').uncheck();
  await expect(page.locator('#access-details')).toBeHidden();
  await expect(page.locator('#sim-mode-description')).toContainText('Resumido');
  await expect(page.locator('#sim-speed-label')).toHaveText('Velocidade (5 acessos/segundo)');
  await page.locator('#sim-step').click();
  await expect(page.locator('#sim-progress')).toHaveText('1 / 21');
  await expect(page.locator('#history-table tr[data-access="1"]')).toContainText('Falta compulsória');
  await page.locator('#sim-detailed').check();
  await expect(page.locator('#access-details')).toBeVisible();
  await page.locator('#sim-step').click();
  await expect(page.locator('#sim-progress')).toHaveText('1 / 21');
  await page.locator('#sim-next').click();
  await expect(page.locator('#sim-hits')).toHaveText('1');
  await expect(page.locator('#access-detail-steps')).toContainText('V=1');
});


test('cache mostra 32 linhas com V=0 e células, e revisão recupera o bloco anterior', async ({ page }) => {
  await page.locator('#mapping').selectOption('direct');
  await page.locator('#sequence').fill('996, 2017, 996');
  await page.locator('#prepare-input').click();
  await expect(page.locator('#cache-table tbody tr')).toHaveCount(32);
  await expect(page.locator('#cache-table tbody tr[data-valid="0"]')).toHaveCount(32);
  await expect(page.locator('#cache-table .cache-cell[data-address]')).toHaveCount(0);
  await advance(page, 1);
  const line = page.locator('#cache-table tr[data-set="30"]');
  await expect(line).toHaveAttribute('data-valid', '1');
  await expect(line.locator('.cache-cell')).toHaveCount(16);
  await expect(line.locator('.cache-cell').first()).toHaveText('992');
  await expect(line.locator('.cache-cell').last()).toHaveText('1007');
  await expect(line.locator('.accessed-cell')).toHaveText('996');
  await advance(page, 2);
  await page.getByRole('button', { name: 'Revisar acesso 2', exact: true }).click();
  await expect(line.locator('.cache-cell').first()).toHaveText('2016');
  await expect(line.locator('.accessed-cell')).toHaveText('2017');
  await expect(page.locator('#sim-progress')).toHaveText('3 / 3');
  await page.locator('#show-live').click();
  await expect(line.locator('.cache-cell').first()).toHaveText('992');
  await page.locator('#format-binary').click();
  await expect(line.locator('.accessed-cell')).toHaveText('001111100100');
});

test('paginação de linhas e células permite navegar em cache e blocos grandes', async ({ page }) => {
  await page.locator('#cellsPerBlock').fill('1024');
  await page.locator('#memoryCells').fill('1048576');
  await page.locator('#cacheLines').fill('512');
  await page.locator('#mapping').selectOption('direct');
  await page.locator('#sequence').fill('1000');
  await page.locator('#prepare-input').click(); await advance(page, 1);
  await expect(page.locator('#cache-table tbody tr')).toHaveCount(128);
  await expect(page.locator('#cache-table tr[data-set="0"] .accessed-cell')).toHaveText('1000');
  await page.getByRole('button', { name: 'Células anteriores da linha 0, via 1', exact: true }).click();
  await expect(page.locator('#cache-table tr[data-set="0"] .cache-cell').first()).toHaveText('976');
  await page.locator('#cache-next').click();
  await expect(page.locator('#cache-table tbody tr[data-set="128"]')).toHaveCount(1);
  await page.locator('#cache-line-jump').fill('511'); await page.locator('#cache-jump-form button').click();
  await expect(page.locator('#cache-table tbody tr[data-set="511"]')).toHaveCount(1);
  await expect(page.locator('#cache-next')).toBeDisabled();
  await expect(page.locator('#sim-used-lines')).toHaveText('1 / 512');
});

test('navegação das células preserva foco pelo teclado, inclusive no fim do bloco', async ({ page }) => {
  await page.locator('#cellsPerBlock').fill('32');
  await page.locator('#mapping').selectOption('direct');
  await page.locator('#sequence').fill('0');
  await page.locator('#prepare-input').click(); await advance(page, 1);
  const next = page.getByRole('button', { name: 'Próximas células da linha 0, via 1', exact: true });
  const previous = page.getByRole('button', { name: 'Células anteriores da linha 0, via 1', exact: true });
  await next.focus(); await page.keyboard.press('Enter');
  await expect(page.locator('#cache-table tr[data-set="0"] .cache-cell').first()).toHaveText('16');
  await expect(next).toBeDisabled(); await expect(previous).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#cache-table tr[data-set="0"] .cache-cell').first()).toHaveText('0');
  await expect(previous).toBeDisabled(); await expect(next).toBeFocused();
  await expect(page.locator('#sim-progress')).toHaveText('1 / 1');
});

test('uma nova simulação limpa a linha informada e o aviso de paginação anterior', async ({ page }) => {
  await page.locator('#memoryCells').fill('1048576');
  await page.locator('#cacheLines').fill('512');
  await page.locator('#mapping').selectOption('direct');
  await page.locator('#sequence').fill('0'); await page.locator('#prepare-input').click();
  await page.locator('#cache-line-jump').fill('512'); await page.locator('#cache-jump-form button').click();
  await expect(page.locator('#cache-line-jump')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#cache-jump-error')).toContainText('0 e 511');
  await page.locator('#tab-configure').click(); await page.locator('#sequence').fill('1');
  await page.locator('#prepare-input').click();
  await expect(page.locator('#cache-line-jump')).toHaveValue('');
  await expect(page.locator('#cache-line-jump')).toHaveAttribute('aria-invalid', 'false');
  await expect(page.locator('#cache-jump-error')).toBeEmpty();
  await expect(page.locator('#sim-progress')).toHaveText('0 / 1');
});

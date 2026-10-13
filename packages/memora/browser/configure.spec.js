import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { EXAMPLE_ADDRESSES, MAX_ADDRESSES, MAX_SEQUENCE_CHARACTERS } from '../src/core/addresses.js';
import { HELP_CONTENT } from '../src/ui/help-content.js';

async function screenshot(page, name) {
  if (!process.env.MEMORA_SCREENSHOT_DIR) return;
  await mkdir(process.env.MEMORA_SCREENSHOT_DIR, { recursive: true });
  await page.screenshot({ path: resolve(process.env.MEMORA_SCREENSHOT_DIR, `${name}.png`), fullPage: true });
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#configuration-status')).toHaveText('Configuração válida · informe os endereços');
});

test('exemplo didático libera uma entrada válida e usa os assets/fontes locais', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'Iniciar simulação' })).toBeDisabled();
  await page.getByRole('button', { name: 'Carregar exemplo didático' }).click();
  await expect(page.getByLabel('Endereços a acessar', { exact: true })).toHaveValue(EXAMPLE_ADDRESSES.join(', '));
  await expect(page.locator('#sequence-feedback')).toContainText('21 endereços válidos');
  await expect(page.locator('#prepare-input')).toBeEnabled();
  await expect(page.locator('#tag-label')).toHaveText('Tag · 4 bits');
  await page.evaluate(() => document.fonts.ready);
  const assets = await page.evaluate(() => ({
    font: document.fonts.check('14px Inter'),
    fontsLoaded: [...document.fonts].some(font => font.family === 'Inter' && font.status === 'loaded'),
    image: document.querySelector('.brand-icon img').naturalWidth,
    informationRing: document.querySelector('#note-ring').naturalWidth,
    fontWeight: getComputedStyle(document.querySelector('#prepare-input')).fontWeight,
    fieldRadius: getComputedStyle(document.querySelector('#memoryCells')).borderRadius,
    tabWeight: getComputedStyle(document.querySelector('.stage-tab')).fontWeight,
  }));
  expect(assets).toEqual({ font: true, fontsLoaded: true, image: 30, informationRing: 20, fontWeight: '700', fieldRadius: '0px', tabWeight: '700' });
  await screenshot(page, 'configuracao-valida');
});

test('mapeamentos condicionais e escolhas preservadas ao voltar para conjunto', async ({ page }) => {
  await page.locator('#load-example').click();
  await page.getByLabel('Vias por conjunto', { exact: true }).selectOption('4');
  await page.getByLabel('Substituição', { exact: true }).selectOption('FIFO');
  await page.getByLabel('Mapeamento', { exact: true }).selectOption('direct');
  await expect(page.locator('#ways')).toBeDisabled();
  await expect(page.locator('#ways')).toHaveValue('1');
  await expect(page.locator('#replacement')).toBeDisabled();
  await expect(page.locator('#replacement')).toHaveValue('');
  await expect(page.locator('#index-label')).toHaveText('Linha · 5 bits');
  await screenshot(page, 'mapeamento-direto');
  await page.locator('#mapping').selectOption('fully-associative');
  await expect(page.locator('#ways')).toHaveValue('32');
  await expect(page.locator('#replacement')).toBeEnabled();
  await expect(page.locator('#index-label')).toHaveText('Sem bits de conjunto');
  await screenshot(page, 'totalmente-associativo');
  await page.locator('#cacheLines').fill('64');
  await expect(page.locator('#ways')).toHaveValue('64');
  await page.locator('#cacheLines').fill('32');
  await page.locator('#mapping').selectOption('set-associative');
  await expect(page.locator('#ways')).toBeEnabled();
  await expect(page.locator('#ways')).toHaveValue('4');
  await expect(page.locator('#replacement')).toHaveValue('FIFO');
  await expect(page.locator('#index-label')).toHaveText('Conjunto · 3 bits');
  await screenshot(page, 'por-conjunto');
});

test('erros próximos aos campos bloqueiam inclusive a preparação via submit', async ({ page }) => {
  await page.locator('#load-example').click();
  await page.locator('#ways').selectOption('4');
  await page.locator('#cacheLines').fill('2');
  await page.locator('#memoryCells').fill('100');
  await page.locator('#sequence').fill('-1, 4096, abc, 20');
  for (const field of ['memoryCells', 'ways', 'sequence']) await expect(page.locator(`#${field}`)).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#memoryCells-feedback')).toContainText('não é potência de 2');
  await expect(page.locator('#ways-feedback')).toContainText('não podem exceder');
  await expect(page.locator('#sequence-feedback')).toContainText('Corrija o total de células');
  await expect(page.locator('#tag-label')).toHaveText('Tag indisponível');
  await expect(page.locator('#prepare-input')).toBeDisabled();
  await expect(page.locator('#open-generator')).toBeDisabled();
  await page.evaluate(() => {
    window.preparedCount = 0;
    document.addEventListener('memora:input-prepared', () => window.preparedCount++);
    document.querySelector('#configure-form').requestSubmit();
  });
  expect(await page.evaluate(() => window.preparedCount)).toBe(0);
  await expect(page.locator('#memoryCells')).toBeFocused();
  await screenshot(page, 'casos-invalidos');
  await page.locator('#load-example').click();
  await expect(page.locator('#error-summary')).toBeHidden();
  await expect(page.locator('#prepare-input')).toBeEnabled();
});

test('geração usa o limite recém-editado e erros preservam a sequência', async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => .999; });
  await page.reload();
  await page.locator('#load-example').click();
  await page.locator('#validate-parameters').click();
  await page.locator('#memoryCells').fill('512');
  await page.locator('#open-generator').click();
  await page.getByLabel('Quantidade de endereços').fill('1001');
  await page.getByRole('dialog').getByRole('button', { name: 'Gerar endereços', exact: true }).click();
  await expect(page.locator('#generation-feedback')).toContainText('entre 1 e 1000');
  await expect(page.locator('#sequence')).toHaveValue(EXAMPLE_ADDRESSES.join(', '));
  await page.getByLabel('Quantidade de endereços').fill('3');
  await page.getByLabel('Quantidade de endereços').press('Enter');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(page.locator('#open-generator')).toBeFocused();
  await expect(page.locator('#sequence')).toHaveValue('511, 511, 511');
  await expect(page.locator('#prepare-input')).toBeEnabled();
});

test('fluxo de configurar e preparar por teclado, com foco visível', async ({ page }) => {
  await page.locator('#load-example').focus(); await page.keyboard.press('Space');
  await page.locator('#mapping').focus(); await page.keyboard.press('ArrowUp'); await page.keyboard.press('ArrowUp');
  await expect(page.locator('#mapping')).toHaveValue('direct');
  await expect(page.locator('#ways')).toBeDisabled();
  await page.locator('#sequence').focus();
  await page.keyboard.press('ControlOrMeta+A'); await page.keyboard.type('2018');
  await page.locator('#prepare-input').focus();
  expect(await page.locator('#prepare-input').evaluate(node => getComputedStyle(node).outlineStyle)).toBe('solid');
  await page.keyboard.press('Enter');
  await expect(page.locator('#configuration-status')).toHaveText('Entrada preparada para simular');
});

test('limites do núcleo bloqueiam a interface sem truncar a entrada colada', async ({ page }) => {
  const sequence = page.locator('#sequence');
  const tooMany = Array(MAX_ADDRESSES + 1).fill('0').join(', ');
  await sequence.fill(tooMany);
  await expect(sequence).toHaveValue(tooMany);
  await expect(page.locator('#sequence-feedback')).toContainText(`no máximo ${MAX_ADDRESSES} endereços`);
  await expect(page.locator('#prepare-input')).toBeDisabled();
  const tooLong = '0'.repeat(MAX_SEQUENCE_CHARACTERS + 1);
  await sequence.fill(tooLong);
  await expect(sequence).toHaveValue(tooLong);
  await expect(page.locator('#sequence-feedback')).toContainText(`no máximo ${MAX_SEQUENCE_CHARACTERS} caracteres`);
  await expect(page.locator('#prepare-input')).toBeDisabled();
});

test('entrada preparada usa o contrato do núcleo e permanece na Tela 1', async ({ page }) => {
  await page.locator('#load-example').click();
  await page.evaluate(() => document.addEventListener('memora:input-prepared', event => {
    window.prepared = { input: event.detail, frozen: Object.isFrozen(event.detail) && Object.isFrozen(event.detail.addresses) };
  }));
  await page.locator('#prepare-input').click();
  const prepared = await page.evaluate(() => window.prepared);
  expect(prepared.frozen).toBe(true);
  expect(prepared.input.addresses).toEqual(EXAMPLE_ADDRESSES);
  expect(prepared.input.configuration.mapping).toBe('set-associative');
  expect(prepared.input.layout.tagBits).toBe(4);
  expect(Object.hasOwn(prepared.input, 'cache')).toBe(false);
  await expect(page.locator('#configuration-status')).toHaveText('Entrada preparada para simular');
  await expect(page.locator('.stage-tabs [aria-current]')).toHaveText('1 Configurar');
  await expect(page.locator('.stage-tabs [aria-disabled="true"]')).toHaveCount(2);
  await page.locator('#sequence').fill('2018');
  await expect(page.locator('#configuration-status')).toHaveText('Configuração pronta para simular');
  await expect(page.locator('#tag-value')).toHaveText('0111');
  await expect(page.locator('#index-value')).toHaveText('1110');
  await expect(page.locator('#offset-value')).toHaveText('0010');
});

test('todas as ajudas têm textos estáticos, teclado, Escape e retorno do foco', async ({ page }) => {
  await page.locator('#memoryCells').fill('8192');
  await page.locator('#sequence').fill('2018, 3044');
  for (const [key, help] of Object.entries(HELP_CONTENT)) {
    const opener = page.locator(`[data-help="${key}"]`);
    await opener.focus(); await opener.press('Enter');
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(page.locator('#sheet-title')).toHaveText(help.title);
    if (!['glossary', 'quick'].includes(key)) {
      await expect(dialog.getByRole('heading', { name: 'Descrição', exact: true })).toBeVisible();
      await expect(dialog.getByRole('heading', { name: 'Exemplo didático', exact: true })).toBeVisible();
      await expect(page.locator('#sheet-content')).toContainText(help.body[1].split('\n')[0]);
    }
    await expect(page.locator('#close-sheet')).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    expect(await page.evaluate(() => document.querySelector('#side-sheet').contains(document.activeElement))).toBe(true);
    await page.keyboard.press('Tab');
    await expect(page.locator('#close-sheet')).toBeFocused();
    if (key === 'bytesPerCell') await screenshot(page, 'side-sheet');
    if (key === 'quick') {
      await expect(dialog.getByRole('link')).toHaveCount(2);
      await screenshot(page, 'ajuda-rapida');
    }
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden(); await expect(opener).toBeFocused();
    await expect(page.locator('#memoryCells')).toHaveValue('8192');
    await expect(page.locator('#sequence')).toHaveValue('2018, 3044');
  }
});

test('fechar pelo botão e pelo scrim preserva dados e foco', async ({ page }) => {
  await page.locator('#load-example').click();
  const opener = page.locator('[data-help="ways"]');
  await opener.click(); await page.locator('#close-sheet').click(); await expect(opener).toBeFocused();
  await opener.click(); await page.mouse.click(20, 300); await expect(page.getByRole('dialog')).toBeHidden();
  await expect(opener).toBeFocused(); await expect(page.locator('#ways')).toHaveValue('2');
});

test('GitHub fica na Ajuda rápida, sem ação duplicada no cabeçalho', async ({ page }) => {
  await expect(page.locator('.global-actions').getByRole('link', { name: /GitHub/ })).toHaveCount(0);
  await expect(page.locator('.global-actions button')).toHaveCount(2);
  await page.locator('[data-help="quick"]').click();
  await expect(page.getByRole('dialog').getByRole('link', { name: /Abrir GitHub/ })).toBeVisible();
});

for (const viewport of [{ width: 1280, height: 720 }, { width: 1366, height: 768 }, { width: 1480, height: 742 }, { width: 1536, height: 864 }]) {
  test(`Tela 1 inteira sem rolagem em ${viewport.width} × ${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    async function fits() {
      const geometry = await page.evaluate(() => {
        const controls = [...document.querySelectorAll('.topbar, .stage-tabs, .intro, .panel, .attribution, #configure-form input, #configure-form select, #configure-form textarea, #configure-form button')];
        return {
          height: document.documentElement.scrollHeight, width: document.documentElement.scrollWidth,
          overflow: getComputedStyle(document.body).overflow,
          outside: controls.filter(n => { const r = n.getBoundingClientRect(); return r.top < 0 || r.bottom > innerHeight + 1 || r.left < 0 || r.right > innerWidth + 1; }).map(n => n.id || n.className),
        };
      });
      expect(geometry.height).toBeLessThanOrEqual(viewport.height);
      expect(geometry.width).toBeLessThanOrEqual(viewport.width);
      expect(geometry.overflow).not.toBe('hidden');
      expect(geometry.outside).toEqual([]);
    }
    await fits();
    await page.locator('#load-example').click();
    for (const mapping of ['set-associative', 'direct', 'fully-associative']) {
      await page.locator('#mapping').selectOption(mapping); await fits();
    }
    await page.locator('#mapping').selectOption('set-associative');
    await page.locator('#ways').selectOption('4'); await page.locator('#cacheLines').fill('2');
    await page.locator('#memoryCells').fill('100'); await page.locator('#sequence').fill('-1, 4096, abc, 20');
    await fits();
    for (const id of ['bytesPerCell', 'memoryCells', 'cellsPerBlock', 'cacheLines']) await page.locator(`#${id}`).fill('');
    await page.locator('#sequence').fill('-1, abc, -2, def, -3, xyz');
    await fits();
    await page.locator('#sequence').fill('x'.repeat(2000));
    await fits();
    if (viewport.height <= 800) {
      await page.locator('#sequence-feedback').focus(); await page.keyboard.press('PageDown');
      await expect.poll(() => page.locator('#sequence-feedback').evaluate(node => node.scrollTop)).toBeGreaterThan(0);
      expect(await page.evaluate(() => scrollY)).toBe(0);
    }
  });
}

test('zero bits e entradas sem inteiros válidos não geram dados fictícios', async ({ page }) => {
  await page.locator('#mapping').selectOption('direct');
  for (const id of ['memoryCells', 'cacheLines', 'cellsPerBlock']) await page.locator(`#${id}`).fill('1');
  await page.locator('#sequence').fill('0');
  await expect(page.locator('#prepare-input')).toBeEnabled();
  for (const part of ['tag', 'index', 'offset']) await expect(page.locator(`#${part}-label`)).toContainText('Sem bits');
  await page.locator('#sequence').fill('<img src=x onerror=alert(1)>');
  await expect(page.locator('#prepare-input')).toBeDisabled();
  await expect(page.locator('#sequence-feedback img')).toHaveCount(0);
  await expect(page.locator('#sequence-feedback')).toContainText('não é um inteiro não negativo');
});

for (const width of [768, 390, 320]) {
  test(`layout e ajudas sem sobreposição ou scroll horizontal em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.locator('#load-example').click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const panels = await page.locator('.panel').evaluateAll(nodes => nodes.map(n => ({ top: n.getBoundingClientRect().top, bottom: n.getBoundingClientRect().bottom })));
    expect(panels[1].top).toBeGreaterThanOrEqual(panels[0].bottom);
    if (width === 390) await screenshot(page, 'mobile');
    await page.locator('[data-help="quick"]').click();
    const rect = await page.getByRole('dialog').boundingBox();
    expect(rect.x).toBeGreaterThanOrEqual(0); expect(rect.width).toBeLessThanOrEqual(width);
    await page.locator('#sheet-content').focus(); await page.keyboard.press('PageDown');
    await page.keyboard.press('Escape'); await expect(page.locator('[data-help="quick"]')).toBeFocused();
    if (width === 390) {
      await page.locator('#memoryCells').fill('100'); await page.locator('#sequence').fill('-1, abc');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await screenshot(page, 'mobile-erros');
    }
  });
}


for (const viewport of [
  { width: 1280, height: 720 },
  { width: 1366, height: 768 },
  { width: 1480, height: 742 },
  { width: 1920, height: 1080 },
]) {
  test(`distribuição horizontal fluida em ${viewport.width} × ${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.locator('#load-example').click();
    const readBounds = () => page.evaluate(() => {
      const rect = selector => {
        const r = document.querySelector(selector).getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom };
      };
      return {
        left: rect('.parameters-panel'),
        right: rect('.sequence-panel'),
        main: rect('main'), tabs: rect('.stage-tabs'),
        intro: rect('.intro'), footer: rect('.attribution'),
        memoryFields: [...document.querySelectorAll('.memory-group .field')].map(n => {
          const r = n.getBoundingClientRect();
          return { x: r.x, y: r.y, right: r.right };
        }),
        pageWidth: document.documentElement.scrollWidth,
        pageHeight: document.documentElement.scrollHeight,
      };
    });
    async function expectGeometry() {
      const g = await readBounds();
      const side = Math.min(32, Math.max(20, viewport.width * .01875));
      expect(g.main.width).toBeCloseTo(viewport.width, 0);
      expect(g.left.x).toBeCloseTo(side, 0);
      expect(viewport.width - g.right.right).toBeCloseTo(side, 0);
      expect(g.right.x - g.left.right).toBeGreaterThanOrEqual(23);
      expect(g.right.x - g.left.right).toBeLessThanOrEqual(33);
      expect(g.right.width / g.left.width).toBeGreaterThan(1.18);
      expect(g.right.width / g.left.width).toBeLessThan(1.30);
      expect(g.tabs.x).toBeCloseTo(g.left.x, 0);
      expect(g.intro.x).toBeCloseTo(g.left.x, 0);
      expect(g.footer.x).toBeCloseTo(g.left.x, 0);
      expect(g.memoryFields).toHaveLength(3);
      expect(g.memoryFields[0].y).toBeCloseTo(g.memoryFields[1].y, 0);
      expect(g.memoryFields[1].y).toBeCloseTo(g.memoryFields[2].y, 0);
      expect(g.memoryFields[0].right).toBeLessThan(g.memoryFields[1].x);
      expect(g.memoryFields[1].right).toBeLessThan(g.memoryFields[2].x);
      expect(g.pageWidth).toBeLessThanOrEqual(viewport.width);
      expect(g.pageHeight).toBeLessThanOrEqual(viewport.height);
    }
    await expectGeometry();
    await screenshot(page, `layout-${viewport.width}x${viewport.height}`);
    for (const mapping of ['direct', 'fully-associative', 'set-associative']) {
      await page.locator('#mapping').selectOption(mapping);
      await expectGeometry();
    }
    await page.locator('#memoryCells').fill('100');
    await page.locator('#sequence').fill('-1, abc, 4096');
    await expectGeometry();
    await page.locator('[data-help="bytesPerCell"]').click();
    await expect(page.getByRole('dialog')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
  });
}

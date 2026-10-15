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
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('#configuration-status')).toHaveText('Configuração válida');
});

test('exemplo didático libera uma entrada válida e usa os assets/fontes locais', async ({ page }) => {
  await expect(page.getByRole('button', { name: /Validar parâmetros|Parâmetros validados/ })).toHaveCount(0);
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
  await page.getByLabel('Bytes por célula', { exact: true }).fill('3');
  await expect(page.locator('#bytesPerCell')).toHaveAttribute('aria-invalid', 'false');
  await expect(page.locator('#bytesPerCell-feedback')).toHaveText('Valor válido: 3 bytes');
  await expect(page.locator('#prepare-input')).toBeEnabled();
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

test('entrada preparada usa o contrato do núcleo e abre a Tela 2 sem executar acessos', async ({ page }) => {
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
  await expect(page.locator('.stage-tabs [aria-current]')).toHaveText('2 Simular');
  await expect(page.locator('.stage-tabs [aria-disabled="true"]')).toHaveCount(0);
  await expect(page.locator('#sim-progress')).toHaveText('0 / 21');
  await page.locator('#tab-configure').click();
  await page.locator('#sequence').fill('2018');
  await expect(page.locator('#configuration-status')).toHaveText('Configuração pronta para simular');
  await expect(page.locator('#tag-value')).toHaveText('0111');
  await expect(page.locator('#index-value')).toHaveText('1110');
  await expect(page.locator('#offset-value')).toHaveText('0010');
});

test('todas as ajudas têm textos estáticos, Escape e retorno do foco', async ({ page }) => {
  await page.locator('#memoryCells').fill('8192');
  await page.locator('#sequence').fill('2018, 3044');
  for (const [key, help] of Object.entries(HELP_CONTENT)) {
    if (['lru', 'cache', 'history'].includes(key) || key.startsWith('analysis-')) continue;
    const opener = page.locator(`[data-help="${key}"]`);
    await opener.click();
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

test('ajuda contextual acessível por teclado e com retorno do foco', async ({ page }) => {
  const opener = page.locator('[data-help="bytesPerCell"]');
  await opener.focus();
  await expect(opener).toBeFocused();
  await opener.press('Enter');
  await expect(page.locator('#sheet-title')).toHaveText('Bytes por célula');
  await expect(page.locator('#close-sheet')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(opener).toBeFocused();
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

for (const viewport of [{ width: 801, height: 720 }, { width: 1024, height: 768 }, { width: 1180, height: 720 }, { width: 1280, height: 720 }, { width: 1366, height: 768 }, { width: 1480, height: 742 }, { width: 1536, height: 864 }]) {
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
    if (viewport.width <= 1180) await screenshot(page, `layout-${viewport.width}x${viewport.height}`);
    for (const mapping of ['set-associative', 'direct', 'fully-associative']) {
      await page.locator('#mapping').selectOption(mapping); await fits();
    }
    await page.locator('#mapping').selectOption('set-associative');
    await page.locator('#ways').selectOption('4'); await page.locator('#cacheLines').fill('2');
    await page.locator('#memoryCells').fill('100'); await page.locator('#sequence').fill('-1, 4096, abc, 20');
    await fits();
    if (viewport.width === 801) {
      await page.locator('#memoryCells-feedback').focus(); await page.keyboard.press('PageDown');
      await expect.poll(() => page.locator('#memoryCells-feedback').evaluate(node => node.scrollTop)).toBeGreaterThan(0);
      expect(await page.evaluate(() => scrollY)).toBe(0);
      await screenshot(page, 'erros-801x720');
    }
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

test('prévia identifica o primeiro endereço e não mantém valor antigo após erros', async ({ page }) => {
  const label = page.locator('#preview-label');
  await expect(label).toBeVisible();
  await expect(label).toHaveText('Prévia indisponível');
  await page.locator('#sequence').fill('2018, 3044');
  await expect(label).toHaveText('Primeiro endereço: 2.018');
  await expect(page.locator('#preview-address')).toHaveText('Decomposição binária do primeiro endereço da sequência: 2018');
  await expect(page.locator('#tag-value')).toHaveText('0111');
  await expect(page.locator('#index-value')).toHaveText('1110');
  await expect(page.locator('#offset-value')).toHaveText('0010');
  await screenshot(page, 'previa-endereco');
  await page.locator('#sequence').fill('3044, 2018');
  await expect(label).toHaveText('Primeiro endereço: 3.044');
  await page.locator('#sequence').fill('abc, 2018');
  await expect(label).toHaveText('Prévia indisponível');
  await expect(page.locator('#tag-value')).toHaveText('—');
  await page.locator('#sequence').fill('2018');
  await page.locator('#memoryCells').fill('100');
  await expect(label).toHaveText('Prévia indisponível');
  await page.locator('#load-example').click();
  await expect(label).toHaveText('Primeiro endereço: 0');
});

test('endereço válido de 52 bits mantém todos os bits e ações dentro do desktop', async ({ page }) => {
  await page.locator('#memoryCells').fill('4503599627370496');
  await page.locator('#sequence').fill('4503599627370495');
  await expect(page.locator('#preview-label')).toHaveText('Primeiro endereço: 4.503.599.627.370.495');
  for (const viewport of [{ width: 1280, height: 720 }, { width: 1366, height: 768 }, { width: 1480, height: 742 }, { width: 1920, height: 1080 }]) {
    await page.setViewportSize(viewport);
    for (const mapping of ['set-associative', 'direct', 'fully-associative']) {
      await page.locator('#mapping').selectOption(mapping);
      await expect(page.locator('#prepare-input')).toBeEnabled();
      const values = await page.locator('.information-card output').allTextContents();
      expect(values.filter(value => value !== '—').join('')).toBe('1'.repeat(52));
      const geometry = await page.evaluate(() => ({
        height: document.documentElement.scrollHeight,
        width: document.documentElement.scrollWidth,
        bodyOverflow: getComputedStyle(document.body).overflow,
        clipped: [...document.querySelectorAll('.decomposition-heading, .information-card, .information-card output, #prepare-input, .attribution')].some(node => {
          const r = node.getBoundingClientRect();
          return r.left < 0 || r.right > innerWidth || r.top < 0 || r.bottom > innerHeight;
        }),
      }));
      expect(geometry.height).toBeLessThanOrEqual(viewport.height);
      expect(geometry.width).toBeLessThanOrEqual(viewport.width);
      expect(geometry.bodyOverflow).not.toBe('hidden');
      expect(geometry.clipped).toBe(false);
      if (viewport.width === 1280 && mapping === 'set-associative') await screenshot(page, 'endereco-52-bits');
    }
  }
});

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


for (const viewport of [
  { width: 1280, height: 720 },
  { width: 1366, height: 768 },
  { width: 1480, height: 742 },
  { width: 1920, height: 1080 },
]) {
  test(`painéis até rodapé e textarea expandido estável em ${viewport.width} × ${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    const geometry = () => page.evaluate(() => {
      const rect = selector => {
        const r = document.querySelector(selector).getBoundingClientRect();
        return { x: r.x, y: r.y, right: r.right, bottom: r.bottom, height: r.height };
      };
      return {
        parameters: rect('.parameters-panel'),
        sequence: rect('.sequence-panel'),
        cacheGroup: rect('.cache-group'),
        address: rect('#sequence'),
        feedback: rect('#sequence-feedback'),
        summary: rect('.configuration-summary'),
        helpNote: rect('.sequence-panel .information-note'),
        footer: rect('.attribution'),
        resize: getComputedStyle(document.querySelector('#sequence')).resize,
        height: document.documentElement.scrollHeight,
        width: document.documentElement.scrollWidth,
      };
    });
    const initial = await geometry();
    async function check() {
      const g = await geometry();
      expect(g.parameters.bottom).toBeCloseTo(g.sequence.bottom, 0);
      expect(g.parameters.bottom - g.cacheGroup.bottom).toBeGreaterThanOrEqual(11);
      expect(g.parameters.bottom - g.cacheGroup.bottom).toBeLessThanOrEqual(26);
      expect(g.sequence.bottom - g.helpNote.bottom).toBeLessThanOrEqual(18);
      expect(g.footer.y - g.parameters.bottom).toBeGreaterThanOrEqual(6);
      expect(viewport.height - g.footer.bottom).toBeGreaterThanOrEqual(0);
      expect(viewport.height - g.footer.bottom).toBeLessThanOrEqual(18);
      expect(g.address.height).toBeGreaterThanOrEqual(72);
      expect(g.address).toEqual(initial.address);
      expect(g.parameters).toEqual(initial.parameters);
      expect(g.sequence).toEqual(initial.sequence);
      expect(g.summary).toEqual(initial.summary);
      expect(g.summary.y - g.feedback.bottom).toBeGreaterThanOrEqual(8);
      expect(g.summary.y - g.feedback.bottom).toBeLessThanOrEqual(16);
      expect(g.resize).toBe('none');
      expect(g.height).toBeLessThanOrEqual(viewport.height);
      expect(g.width).toBeLessThanOrEqual(viewport.width);
    }
    await check();
    await page.locator('#load-example').click();
    for (const mapping of ['direct', 'fully-associative', 'set-associative']) {
      await page.locator('#mapping').selectOption(mapping);
      await check();
    }
    await page.locator('#memoryCells').fill('100');
    await page.locator('#sequence').fill('-1, 4096, abc, 20');
    await check();
    await page.locator('[data-help="quick"]').click();
    await expect(page.getByRole('dialog')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
  });
}

test('respiro discreto entre rótulo, input e dica sem scroll no desktop', async ({ page }) => {
  for (const viewport of [{ width: 1280, height: 720 }, { width: 1920, height: 1080 }]) {
    await page.setViewportSize(viewport);
    await page.locator('#load-example').click();
    const measure = () => page.evaluate(() => {
      const gap = (a, b) => {
        const one = document.querySelector(a).getBoundingClientRect();
        const two = document.querySelector(b).getBoundingClientRect();
        return Math.round(two.top - one.bottom);
      };
      return {
        beforeInput: gap('.memory-group .field-heading', '.memory-group input'),
        afterInput: gap('.memory-group input', '.memory-group .field-feedback'),
        sequenceBefore: gap('.sequence-field .field-heading', '#sequence'),
        sequenceAfter: gap('#sequence', '.sequence-field .field-feedback'),
        pageHeight: document.documentElement.scrollHeight,
      };
    });
    const g = await measure();
    expect(g.beforeInput).toBe(6);
    expect(g.afterInput).toBe(8);
    expect(g.sequenceBefore).toBe(viewport.height <= 850 ? 4 : 6);
    expect(g.sequenceAfter).toBe(viewport.height <= 850 ? 4 : 8);
    expect(g.pageHeight).toBeLessThanOrEqual(viewport.height);
    for (const mapping of ['direct', 'fully-associative', 'set-associative']) {
      await page.locator('#mapping').selectOption(mapping);
      expect(await measure()).toEqual(g);
    }
    await page.locator('#memoryCells').fill('100');
    await page.locator('#sequence').fill('-1, 4096, abc, 20');
    expect(await measure()).toEqual(g);
  }
});

for (const viewport of [
  { width: 1280, height: 720 },
  { width: 1366, height: 768 },
  { width: 1480, height: 742 },
  { width: 1920, height: 1080 },
]) {
  test(`prévia junto dos botões e seções bem distribuídas em ${viewport.width} × ${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.locator('#load-example').click();
    const inspect = () => page.evaluate(() => {
      const rect = selector => document.querySelector(selector).getBoundingClientRect();
      const cards = rect('.decomposition-grid');
      const buttons = rect('.sequence-actions');
      const note = rect('.sequence-panel .information-note');
      const summary = rect('.configuration-summary');
      const panel = rect('.sequence-panel');
      const bottom = rect('.sequence-bottom');
      return {
        previewToActions: buttons.top - cards.bottom,
        buttonsToNote: note.top - buttons.bottom,
        noteToPanel: panel.bottom - note.bottom,
        summaryToPreview: rect('.decomposition').top - summary.bottom,
        bottomToPanel: panel.bottom - bottom.bottom,
        fullHeight: document.documentElement.scrollHeight,
        fullWidth: document.documentElement.scrollWidth,
      };
    });
    async function verify() {
      const g = await inspect();
      expect(g.previewToActions).toBeGreaterThanOrEqual(8);
      expect(g.previewToActions).toBeLessThanOrEqual(20);
      expect(g.buttonsToNote).toBeGreaterThanOrEqual(3);
      expect(g.buttonsToNote).toBeLessThanOrEqual(18);
      expect(g.noteToPanel).toBeGreaterThanOrEqual(8);
      expect(g.noteToPanel).toBeLessThanOrEqual(20);
      expect(g.bottomToPanel).toBeCloseTo(g.noteToPanel, 0);
      expect(g.summaryToPreview).toBeGreaterThanOrEqual(0);
      expect(g.fullHeight).toBeLessThanOrEqual(viewport.height);
      expect(g.fullWidth).toBeLessThanOrEqual(viewport.width);
    }
    await verify();
    for (const mapping of ['direct', 'fully-associative', 'set-associative']) {
      await page.locator('#mapping').selectOption(mapping);
      await verify();
    }
    await page.locator('#memoryCells').fill('100');
    await page.locator('#sequence').fill('-1, 4096, abc, 20');
    await verify();
    await page.locator('[data-help="quick"]').click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
  });
}

for (const viewport of [
  { width: 1280, height: 720 },
  { width: 1366, height: 768 },
  { width: 1480, height: 742 },
  { width: 1920, height: 1080 },
]) {
  test(`erros localizados sem banner redundante em ${viewport.width} × ${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.locator('#load-example').click();
    await page.locator('#memoryCells').fill('100');
    await page.locator('#sequence').fill('-1, 4096, abc, 20');
    await expect(page.locator('#intro-description')).toBeVisible();
    await expect(page.locator('#error-summary')).toHaveClass('sr-only');
    const visualAlert = await page.locator('#error-summary').evaluate(node => ({
      width: node.getBoundingClientRect().width,
      height: node.getBoundingClientRect().height,
      clipPath: getComputedStyle(node).clipPath,
    }));
    expect(visualAlert.width).toBeLessThanOrEqual(1);
    expect(visualAlert.height).toBeLessThanOrEqual(1);
    expect(visualAlert.clipPath).toBe('inset(50%)');
    await expect(page.locator('#error-summary')).toContainText('erros impedem a simulação');
    await expect(page.locator('#memoryCells')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#memoryCells-feedback')).toContainText('não é potência de 2');
    await expect(page.locator('#sequence')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#sequence-feedback')).toHaveClass(/error-text/);
    expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThanOrEqual(viewport.height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);
    await screenshot(page, `erros-sem-banner-${viewport.width}x${viewport.height}`);
  });
}

for (const viewport of [
  { width: 1280, height: 720 },
  { width: 1366, height: 768 },
  { width: 1480, height: 742 },
  { width: 1920, height: 1080 },
]) {
  test(`ícone de erro centralizado no resumo em ${viewport.width} × ${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.locator('#load-example').click();
    await page.locator('#memoryCells').fill('100');
    await expect(page.locator('#configuration-status')).toHaveText('Configuração com erros');
    const geometry = await page.evaluate(() => {
      const card = document.querySelector('.configuration-summary').getBoundingClientRect();
      const symbol = document.querySelector('#configuration-symbol').getBoundingClientRect();
      const title = document.querySelector('#configuration-status').getBoundingClientRect();
      const detail = document.querySelector('#configuration-detail').getBoundingClientRect();
      return {
        diff: Math.abs((card.top + card.bottom) / 2 - (symbol.top + symbol.bottom) / 2),
        symbolAlignment: getComputedStyle(document.querySelector('#configuration-symbol')).alignSelf,
        textOrder: title.bottom < detail.top,
        pageHeight: document.documentElement.scrollHeight,
        pageWidth: document.documentElement.scrollWidth,
      };
    });
    expect(geometry.symbolAlignment).toBe('center');
    expect(geometry.diff).toBeLessThanOrEqual(2);
    expect(geometry.textOrder).toBe(true);
    expect(geometry.pageHeight).toBeLessThanOrEqual(viewport.height);
    expect(geometry.pageWidth).toBeLessThanOrEqual(viewport.width);
    await screenshot(page, `alerta-centralizado-${viewport.width}x${viewport.height}`);
  });
}

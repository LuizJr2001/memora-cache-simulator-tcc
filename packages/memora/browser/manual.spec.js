import { test, expect } from '@playwright/test';

test('manual abre em Configurar sem alterar campos e retorna foco ao acionador', async ({ page }) => {
  await page.goto('/');
  await page.locator('#sequence').fill('0, 16, 32, 48');
  const opener = page.locator('#open-manual');
  await opener.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('.manual-title')).toHaveText('1 · Configurar');
  await expect(page.locator('.manual-steps li')).toHaveCount(5);
  await expect(page.locator('#close-sheet')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(opener).toBeFocused();
  await expect(page.locator('#sequence')).toHaveValue('0, 16, 32, 48');
});

test('manual abre na etapa atual, alterna seções e preserva histórico e totais', async ({ page }) => {
  await page.goto('/');
  await page.locator('#load-example').click();
  await page.locator('#prepare-input').click();
  await page.locator('#sim-next').click();
  const progress = await page.locator('#sim-progress').textContent();
  const hits = await page.locator('#sim-hits').textContent();
  const misses = await page.locator('#sim-misses').textContent();
  const rows = await page.locator('#history-table tr[data-access]').count();
  await page.locator('#open-manual').click();
  await expect(page.locator('.manual-title')).toHaveText('2 · Simular');
  await expect(page.locator('.manual-steps li')).toHaveCount(10);
  await page.locator('[data-manual-tab="configure"]').click();
  await expect(page.locator('.manual-title')).toHaveText('1 · Configurar');
  await page.locator('[data-manual-tab="simulate"]').click();
  await expect(page.locator('.manual-title')).toHaveText('2 · Simular');
  await page.locator('#close-sheet').click();
  await expect(page.locator('#open-manual')).toBeFocused();
  await expect(page.locator('#sim-progress')).toHaveText(progress);
  await expect(page.locator('#sim-hits')).toHaveText(hits);
  await expect(page.locator('#sim-misses')).toHaveText(misses);
  await expect(page.locator('#history-table tr[data-access]')).toHaveCount(rows);
});

test('capturas carregam e manual permite leitura em viewport estreita', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.locator('#open-manual').click();
  for (const screen of ['configure', 'simulate']) {
    await page.locator(`[data-manual-tab="${screen}"]`).click();
    const images = page.locator('.manual-frame img');
    for (let i=0; i<await images.count(); i++) {
      const image=images.nth(i);
      await expect.poll(()=>image.evaluate(el=>el.complete && el.naturalWidth>0)).toBe(true);
      const size=await image.boundingBox();
      expect(size.width).toBeLessThanOrEqual(390);
    }
  }
  await page.keyboard.press('Escape');
  await expect(page.locator('#open-manual')).toBeFocused();
});

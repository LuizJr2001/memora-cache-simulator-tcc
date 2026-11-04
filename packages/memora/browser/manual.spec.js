import { expect, test } from '@playwright/test';

for (const width of [1280, 320]) {
  test(`Manual abre na etapa atual e preserva configuração e acesso selecionado em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/');
    const opener = page.getByRole('button', { name: 'Manual', exact: true });
    const dialog = page.getByRole('dialog', { name: 'Manual visual do Memora' });
    const configure = dialog.getByRole('button', { name: 'Configurar', exact: true });
    const simulate = dialog.getByRole('button', { name: 'Simular', exact: true });
    const sequence = page.locator('#sequence');
    await sequence.fill('0, 1, 512, 513, 16');

    await opener.focus();
    await page.keyboard.press('Enter');
    await expect(configure).toHaveAttribute('aria-pressed', 'true');
    await expect(dialog.getByRole('listitem')).toHaveCount(5);
    await expect(dialog.getByRole('img')).toHaveCount(1);
    expect(await dialog.getByRole('img').evaluate(img => img.decode().then(() => img.naturalWidth))).toBeGreaterThan(width === 320 ? 320 : 800);

    await simulate.focus();
    await page.keyboard.press('Space');
    await expect(simulate).toBeFocused();
    await expect(simulate).toHaveAttribute('aria-pressed', 'true');
    await expect(dialog.getByRole('listitem')).toHaveCount(10);
    for (const image of await dialog.getByRole('img').all()) {
      await image.evaluate(node => node.decode());
    }
    const original = dialog.getByRole('link', { name: /captura de .*Comparar uma substituição/ });
    await expect(original).toHaveAttribute('href', /simular-substituicao\.png$/);
    await expect(original).toHaveAttribute('target', '_blank');
    expect(await dialog.locator('#sheet-content').evaluate(node => node.scrollWidth)).toBeLessThanOrEqual(
      await dialog.locator('#sheet-content').evaluate(node => node.clientWidth)
    );
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(opener).toBeFocused();
    await expect(sequence).toHaveValue('0, 1, 512, 513, 16');

    await page.locator('#prepare-input').click();
    await page.locator('#sim-finish').click();
    await page.getByRole('button', { name: 'Analisar acesso 3', exact: true }).click();
    const simulationState = () => page.locator(
      '#sim-progress, #sim-hits, #sim-misses, #history-table, #analysis-before-table, #analysis-after-table'
    ).allTextContents();
    const snapshot = await simulationState();
    await opener.click();
    await expect(simulate).toHaveAttribute('aria-pressed', 'true');
    await dialog.getByRole('button', { name: /Fechar/ }).click();
    await expect(opener).toBeFocused();
    await expect(page.getByRole('button', { name: 'Analisar acesso 3', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#access-comparison')).toHaveAttribute('open', '');
    expect(await simulationState()).toEqual(snapshot);
  });
}

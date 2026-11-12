import { test, expect } from '@playwright/test';

test('editor em blocos valida cada item, conserva texto ao cancelar e aplica edição pelo teclado', async ({ page }) => {
  await page.goto('/');
  const original = await page.locator('#sequence').inputValue();
  await page.getByRole('button', { name: 'Editar em blocos', exact: true }).click();
  await page.getByLabel('Endereço 1', { exact: true }).fill('1,2');
  await expect(page.getByRole('button', { name: 'Aplicar sequência' })).toBeDisabled();
  await page.keyboard.press('Escape');
  await expect(page.locator('#sequence')).toHaveValue(original);
  await page.getByRole('button', { name: 'Editar em blocos', exact: true }).click();
  await page.getByLabel('Endereço 1', { exact: true }).fill('4096');
  await expect(page.getByRole('button', { name: 'Aplicar sequência' })).toBeDisabled();
  await page.getByLabel('Endereço 1', { exact: true }).fill('2');
  await page.getByRole('button', { name: 'Adicionar endereço' }).click();
  await expect(page.getByLabel('Endereço 22', { exact: true })).toBeFocused();
  await page.getByLabel('Endereço 22', { exact: true }).fill('3');
  await page.getByRole('button', { name: 'Remover endereço 2', exact: true }).click();
  await page.getByRole('button', { name: 'Aplicar sequência' }).focus();
  await page.keyboard.press('Enter');
  const expected = original.split(', ').map(Number); expected[0] = 2; expected.splice(1, 1); expected.push(3);
  await expect(page.locator('#sequence')).toHaveValue(expected.join(', '));
  await expect(page.getByRole('button', { name: 'Editar em blocos', exact: true })).toBeFocused();
  await expect(page.locator('#prepare-input')).toBeEnabled();
});

test('editor não trunca sequências acima do limite e mapeamentos apresentam explicações curtas', async ({ page }) => {
  await page.goto('/');
  const sequence = Array(1001).fill('0').join(', ');
  await page.locator('#sequence').fill(sequence);
  await page.getByRole('button', { name: 'Editar em blocos', exact: true }).click();
  await expect(page.getByText('Use no máximo 1000 endereços. Reduza a sequência no campo de texto; nenhum endereço foi alterado.')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#sequence')).toHaveValue(sequence);
  for (const [mapping, description] of [
    ['direct', 'Cada bloco tem uma única linha possível'],
    ['fully-associative', 'Cada bloco pode ocupar qualquer linha da cache'],
    ['set-associative', 'Cada bloco pode ocupar qualquer via do seu conjunto'],
  ]) {
    await page.locator('#mapping').selectOption(mapping);
    await expect(page.locator('#mapping-feedback')).toHaveText(description);
  }
});

test('controle aceita 0,25 passos por segundo e distingue o modo de acessos', async ({ page }) => {
  await page.goto('/');
  await page.locator('#prepare-input').click();
  await page.locator('#sim-speed').fill('0.25');
  await expect(page.locator('#sim-speed-label')).toHaveText('Velocidade (0,25 passos/segundo)');
  await page.locator('#sim-detailed').uncheck();
  await expect(page.locator('#sim-speed-label')).toHaveText('Velocidade (0,25 acessos/segundo)');
  await expect(page.locator('#sim-progress')).toHaveText('0 / 21');
});

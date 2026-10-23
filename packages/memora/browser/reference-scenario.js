import { EXAMPLE_CONFIGURATION } from '../src/core/configuration.js';
import { EXAMPLE_ADDRESSES } from '../src/core/addresses.js';

// Configure o cenário LRU de referência explicitamente, sem usar o preset do Beto.
export async function configureReferenceScenario(page) {
  for (const field of ['bytesPerCell', 'memoryCells', 'cellsPerBlock', 'cacheLines']) {
    await page.locator(`#${field}`).fill(String(EXAMPLE_CONFIGURATION[field]));
  }
  for (const field of ['mapping', 'ways', 'replacement']) {
    await page.locator(`#${field}`).selectOption(String(EXAMPLE_CONFIGURATION[field]));
  }
  await page.locator('#sequence').fill(EXAMPLE_ADDRESSES.join(', '));
}

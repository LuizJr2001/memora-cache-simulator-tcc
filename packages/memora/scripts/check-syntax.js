import { readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const packageRoot = new URL('../', import.meta.url);

async function javascriptFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const results = await Promise.all(entries.map(entry => {
    const url = new URL(entry.name, directory);
    if (entry.isDirectory()) return javascriptFiles(new URL(`${entry.name}/`, directory));
    return entry.isFile() && entry.name.endsWith('.js') ? [url] : [];
  }));
  return results.flat();
}

const files = [...(await Promise.all(['scripts/', 'src/', 'tests/', 'browser/'].map(path =>
  javascriptFiles(new URL(path, packageRoot)),
))).flat(), new URL('playwright.config.js', packageRoot)].sort((a, b) => a.pathname.localeCompare(b.pathname));

for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', fileURLToPath(file)], { stdio: 'inherit' });
  if (result.error || result.status !== 0) {
    if (result.error) console.error(result.error.message);
    process.exit(1);
  }
}
console.log(`Sintaxe verificada: ${files.length} arquivos JavaScript`);

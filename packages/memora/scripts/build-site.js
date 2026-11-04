import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = new URL('../', import.meta.url);
const repositoryRoot = new URL('../../../', import.meta.url);
const output = new URL('_site/', repositoryRoot);

const source = new URL('src/', packageRoot);
const sourcePath = fileURLToPath(source);
const html = await readFile(new URL('index.html', packageRoot), 'utf8');
const files = (await readdir(source, { recursive: true, withFileTypes: true }))
  .filter(entry => entry.isFile() && entry.name !== 'README.md')
  .map(entry => relative(sourcePath, resolve(entry.parentPath, entry.name)))
  .sort();
const hash = createHash('sha256').update(html);
for (const file of files) {
  const contentHash = createHash('sha256').update(await readFile(resolve(sourcePath, file))).digest('hex');
  hash.update(JSON.stringify([file, contentHash]));
}
// Uma URL por versão mantém HTML, módulos importados e estilos em sincronia.
const assets = `src-${hash.digest('hex').slice(0, 16)}`;

// Publica a aplicação, sem incluir o legado, testes ou materiais da pesquisa.
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await writeFile(new URL('index.html', output), html.replaceAll('"./src/', `"./${assets}/`));
await cp(source, new URL(`${assets}/`, output), {
  recursive: true,
  filter: source => !source.endsWith('README.md'),
});
await cp(new URL('LICENSE', repositoryRoot), new URL('LICENSE', output));
await writeFile(new URL('.nojekyll', output), '');

console.log(`Site estático preparado em ${fileURLToPath(output)}`);

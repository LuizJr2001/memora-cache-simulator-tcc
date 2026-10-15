import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const packageRoot = new URL('../', import.meta.url);
const repositoryRoot = new URL('../../../', import.meta.url);
const output = new URL('_site/', repositoryRoot);

// Publica a aplicação, sem incluir o legado, testes ou materiais da pesquisa.
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(new URL('index.html', packageRoot), new URL('index.html', output));
await cp(new URL('src/', packageRoot), new URL('src/', output), {
  recursive: true,
  filter: source => !source.endsWith('README.md'),
});
await cp(new URL('LICENSE', repositoryRoot), new URL('LICENSE', output));
await writeFile(new URL('.nojekyll', output), '');

console.log(`Site estático preparado em ${fileURLToPath(output)}`);

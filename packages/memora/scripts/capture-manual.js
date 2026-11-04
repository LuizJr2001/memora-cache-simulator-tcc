// Gera capturas reais e anotadas para o Manual visual (#83).
// Rode: npm ci && npx playwright install chromium && node packages/memora/scripts/capture-manual.js
import { chromium } from '@playwright/test';
import { spawn, execFileSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { EXAMPLE_CONFIGURATION } from '../src/core/configuration.js';
import { EXAMPLE_ADDRESSES } from '../src/core/addresses.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = join(root, 'src/assets/manual');
const server = spawn(process.execPath, ['scripts/dev-server.js'], {
  cwd: root, stdio: ['ignore', 'pipe', 'pipe'],
});
let browser;
server.stderr.on('data', chunk => process.stderr.write(chunk));

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    if (server.exitCode !== null) throw new Error('Servidor Memora encerrou antes das capturas');
    try {
      const response = await fetch('http://127.0.0.1:5173/');
      if (response.ok) return;
    } catch { /* aguardando inicialização */ }
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  throw new Error('Servidor Memora indisponível em 127.0.0.1:5173');
}

async function capture(page, filename, selectors, first = 1) {
  // Setas e números são desenhados sobre elementos reais, no DOM do Chromium.
  const missing = await page.evaluate(({ selectors, first }) => {
    const ns = 'http://www.w3.org/2000/svg';
    const overlay = document.createElement('div');
    overlay.id = 'manual-capture-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:2147483647;pointer-events:none';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', `0 0 ${innerWidth} ${innerHeight}`);
    svg.style.cssText = 'width:100%;height:100%;overflow:hidden';
    const defs = document.createElementNS(ns, 'defs');
    const tip = document.createElementNS(ns, 'marker');
    tip.setAttribute('id','manual-arrow-tip');
    tip.setAttribute('markerWidth','6');tip.setAttribute('markerHeight','6');
    tip.setAttribute('refX','5');tip.setAttribute('refY','3');tip.setAttribute('orient','auto');
    const arrow = document.createElementNS(ns,'path');
    arrow.setAttribute('d','M0 0 L6 3 L0 6 Z');
    arrow.setAttribute('fill','#4d2ba7');
    tip.append(arrow); defs.append(tip); svg.append(defs);
    const unresolved=[];
    for (const [index, selector] of selectors.entries()) {
      const element=document.querySelector(selector);
      if (!element) { unresolved.push(selector); continue; }
      const rect=element.getBoundingClientRect();
      if (!rect.width || !rect.height) { unresolved.push(selector+' (oculto)'); continue; }
      const cx=Math.max(12,Math.min(innerWidth-12,rect.left+rect.width/2));
      const cy=Math.max(12,Math.min(innerHeight-12,rect.top+rect.height/2));
      const dx=index%2===0 ? -42 : 42;
      const dy=index%3===0 ? -48 : 48;
      const bx=Math.max(23,Math.min(innerWidth-23,cx+dx));
      const by=Math.max(23,Math.min(innerHeight-23,cy+dy));
      const line=document.createElementNS(ns,'line');
      for(const [name,value] of Object.entries({x1:bx,y1:by,x2:cx,y2:cy,stroke:'#4d2ba7','stroke-width':'3','marker-end':'url(#manual-arrow-tip)'}))line.setAttribute(name,String(value));
      svg.append(line);
      const badge=document.createElementNS(ns,'circle');
      for(const [name,value] of Object.entries({cx:bx,cy:by,r:18,fill:'#4d2ba7',stroke:'white','stroke-width':'3'}))badge.setAttribute(name,String(value));
      svg.append(badge);
      const text=document.createElementNS(ns,'text');
      text.setAttribute('x',String(bx));text.setAttribute('y',String(by+6));
      text.setAttribute('text-anchor','middle');text.setAttribute('font-size','17');
      text.setAttribute('font-weight','700');text.setAttribute('font-family','Arial, sans-serif');
      text.setAttribute('fill','white');text.textContent=String(first+index);svg.append(text);
    }
    overlay.append(svg);document.body.append(overlay);
    return unresolved;
  }, { selectors, first });
  if (missing.length) throw new Error(`Marcadores ausentes em ${filename}: ${missing.join(', ')}`);
  await page.screenshot({ path: join(output, filename), animations: 'disabled' });
  await page.evaluate(() => document.getElementById('manual-capture-overlay')?.remove());
  console.log('Captura gerada:', filename);
}

try {
  await mkdir(output, { recursive: true });
  await waitForServer();
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
  await page.locator('#load-example').click();
  for (const field of ['bytesPerCell', 'memoryCells', 'cellsPerBlock', 'cacheLines']) {
    await page.locator(`#${field}`).fill(String(EXAMPLE_CONFIGURATION[field]));
  }
  for (const field of ['mapping','ways','replacement']) {
    await page.locator(`#${field}`).selectOption(String(EXAMPLE_CONFIGURATION[field]));
  }
  await page.locator('#sequence').fill(EXAMPLE_ADDRESSES.join(', '));
  if (!await page.locator('#prepare-input').isEnabled()) throw new Error('Configuração inválida');
  await capture(page,'configurar.png',['#load-example','.memory-group','#mapping','#sequence','#prepare-input']);
  await page.locator('#prepare-input').click();
  await page.locator('#sim-next').click();
  await page.locator('#sim-next').click();
  await capture(page,'simular.png',['#sim-play','#sim-next','#sim-detailed','#sim-speed','#cache-heading','#history-heading']);
  await page.locator('#sim-finish').click();
  const analyze = page.getByRole('button',{name:'Analisar acesso 20',exact:true});
  await analyze.click();
  if (!await page.locator('#access-comparison').evaluate(element=>element.open)) throw new Error('Comparação não aberta pelo botão Analisar');
  await capture(page,'comparacao.png',['#history-table [data-review="20"]','#access-comparison summary','#show-live'],7);
  await page.locator('#show-live').click();
  if (await page.locator('#sim-progress').textContent() !== '21 / 21') throw new Error('Conclusão inesperada');
  await capture(page,'conclusao.png',['#sim-progress'],10);
  const revision = execFileSync('git', ['rev-parse', 'HEAD'], {cwd:root,encoding:'utf8'}).trim();
  const metadata = { revision, viewport:'1600x900', browser:'Chromium / Playwright', scenario: 'EXAMPLE_CONFIGURATION + EXAMPLE_ADDRESSES; mapeamento por conjunto, 2 vias, LRU, 21 acessos', files:['configurar.png','simular.png','comparacao.png','conclusao.png'], annotations: '1–5 Configurar; 1–6 Simular; 7–9 Comparação; 10 Conclusão' };
  await writeFile(join(output,'metadata.json'),JSON.stringify(metadata,null,2)+'\\n');
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}

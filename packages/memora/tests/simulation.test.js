import test from 'node:test';
import assert from 'node:assert/strict';
import { EXAMPLE_CONFIGURATION } from '../src/core/configuration.js';
import { EXAMPLE_ADDRESSES } from '../src/core/addresses.js';
import { prepareSimulationInput } from '../src/core/input.js';
import { createSimulation, lruState, SIMULATION_PHASES } from '../src/core/simulation.js';

const input = (addresses, changes = {}) => prepareSimulationInput({ ...EXAMPLE_CONFIGURATION, ...changes }, addresses.join(', ')).input;
function run(addresses, changes = {}, options = {}) {
  const engine = createSimulation(input(addresses, changes), options);
  while (!engine.view().done) engine.nextAccess();
  return engine.view();
}
const small = { memoryCells: 16, cellsPerBlock: 1, cacheLines: 2, ways: 2 };

test('cenário da v2 termina em 12 acertos e 9 faltas e preserva a substituição do acesso 20', () => {
  const state = run(EXAMPLE_ADDRESSES);
  assert.deepEqual(state.statistics, { processed: 21, total: 21, hits: 12, misses: 9,
    hitRate: 12 / 21, usedLines: 8, totalLines: 32 });
  const access19 = state.history[18], access20 = state.history[19], access21 = state.history[20];
  assert.equal(access19.address, 2018); assert.equal(access19.result, 'hit');
  assert.equal(access19.after.statistics.hits, 12); assert.equal(access19.after.statistics.misses, 7);
  assert.equal(access20.address, 3044); assert.equal(access20.reason, 'LRU'); assert.equal(access20.way, 0);
  assert.deepEqual([access20.lineBefore.blockStart, access20.lineBefore.blockEnd, access20.lineBefore.tag], [992, 1007, 3]);
  assert.deepEqual([access20.lineAfter.blockStart, access20.lineAfter.blockEnd, access20.lineAfter.tag], [3040, 3055, 11]);
  assert.equal(access20.after.statistics.misses, 8);
  assert.equal(access21.address, 96); assert.equal(access21.reason, 'free');
});

test('regressão do direto: falta/acerto/falta/acerto/falta, removendo 0–1 antes de inserir 8–9', () => {
  const state = run([0, 1, 2, 0, 8], { memoryCells: 16, cellsPerBlock: 2, cacheLines: 2, mapping: 'direct' });
  assert.deepEqual(state.history.map(a => a.result), ['miss', 'hit', 'miss', 'hit', 'miss']);
  assert.equal(state.lastAccess.way, 0); assert.equal(state.lastAccess.reason, 'direct');
  assert.deepEqual([state.lastAccess.lineBefore.blockStart, state.lastAccess.lineBefore.blockEnd], [0, 1]);
  assert.deepEqual([state.lastAccess.lineAfter.blockStart, state.lastAccess.lineAfter.blockEnd], [8, 9]);
  assert.equal(lruState(state.cache, state.configuration), null);
});

test('regressão Random totalmente associativo tem vítima e estatísticas determinísticas', () => {
  let calls = 0;
  const state = run([0, 1, 0, 2], { ...small, mapping: 'fully-associative', replacement: 'RANDOM' },
    { random: () => { calls++; return 0; } });
  assert.deepEqual(state.history.map(a => a.result), ['miss', 'miss', 'hit', 'miss']);
  assert.equal(calls, 1); assert.equal(state.lastAccess.lineBefore.blockStart, 0);
  assert.equal(state.lastAccess.lineAfter.blockStart, 2); assert.equal(state.lastAccess.way, 0);
  assert.equal(lruState(state.cache, state.configuration), null);
});

test('regressão por conjunto/LRU 0,2,0,4 remove o bloco 2 e não o bloco 4', () => {
  const state = run([0, 2, 0, 4], { ...small, cacheLines: 4, mapping: 'set-associative', replacement: 'LRU' });
  assert.deepEqual(state.history.map(a => a.result), ['miss', 'miss', 'hit', 'miss']);
  assert.equal(state.lastAccess.lineBefore.blockStart, 2); assert.equal(state.lastAccess.lineAfter.blockStart, 4);
  assert.equal(state.lastAccess.decomposition.set, 0); assert.equal(state.lastAccess.way, 1);
  const ranks = lruState(state.cache, state.configuration);
  assert.equal(ranks.find(r => r.newest).way, 1); assert.equal(ranks.find(r => r.candidate).way, 0);
});

for (const [replacement, evicted] of [['FIFO', 0], ['LRU', 1], ['RANDOM', 1]]) {
  test(`${replacement}: acerto não altera ordem FIFO; recência e escolha de vítima seguem a política`, () => {
    const state = run([0, 1, 0, 2], { ...small, mapping: 'fully-associative', replacement }, { random: () => .999999 });
    assert.equal(state.statistics.hits, 1); assert.equal(state.statistics.misses, 3);
    assert.equal(state.lastAccess.lineBefore.blockStart, evicted);
    assert.equal(state.lastAccess.lineAfter.blockStart, 2);
    if (replacement !== 'LRU') assert.equal(lruState(state.cache, state.configuration), null);
  });
}

test('microetapas só alteram a cache em Atualizar e só contabilizam o acesso ao concluir', () => {
  const engine = createSimulation(input([0]));
  for (const phase of SIMULATION_PHASES) {
    const state = engine.step(); assert.equal(state.phase, phase);
    assert.equal(state.cache.length, ['update', 'complete'].includes(phase) ? 1 : 0);
    assert.equal(state.statistics.processed, phase === 'complete' ? 1 : 0);
  }
  assert.equal(engine.view().done, true);
  engine.step(); engine.nextAccess(); assert.equal(engine.view().history.length, 1);
});

test('Próximo acesso termina uma microetapa pendente sem duplicar ou pular acessos', () => {
  const engine = createSimulation(input([0, 1, 16])); engine.step(); engine.step();
  assert.equal(engine.nextAccess().statistics.processed, 1);
  assert.equal(engine.nextAccess().statistics.processed, 2);
  assert.equal(engine.nextAccess().statistics.processed, 3);
  assert.deepEqual(engine.view().history.map(a => a.address), [0, 1, 16]);
});

test('snapshots, linhas e estatísticas anteriores ficam imutáveis após substituição e reinício', () => {
  const engine = createSimulation(input([0, 1, 0, 2], { ...small, mapping: 'fully-associative' }));
  engine.nextAccess(); const old = engine.view();
  while (!engine.view().done) engine.nextAccess();
  const last = engine.view().lastAccess;
  assert.equal(last.before.cache.find(l => l.way === last.way).blockStart, 1);
  assert.equal(last.lineBefore.blockStart, 1); assert.equal(last.lineAfter.blockStart, 2);
  assert.throws(() => { last.lineBefore.blockStart = 99; }, TypeError);
  assert.throws(() => last.before.cache.push(last.lineAfter), TypeError);
  assert.throws(() => { last.before.statistics.hits = 99; }, TypeError);
  engine.reset(); assert.equal(old.cache[0].blockStart, 0); assert.equal(last.lineBefore.blockStart, 1);
  assert.equal(engine.view().statistics.processed, 0); assert.equal(engine.view().cache.length, 0);
});

test('cache e blocos enormes usam representação esparsa sem alocar todas as linhas ou células', () => {
  const max = 2 ** 52;
  const state = run([0, max - 1, max - 1], { memoryCells: max, cellsPerBlock: 1,
    cacheLines: max, mapping: 'fully-associative', replacement: 'LRU' });
  assert.equal(state.cache.length, 2); assert.equal(state.lastAccess.lineAfter.tag, max - 1);
  assert.equal(state.statistics.hits, 1); assert.equal(state.statistics.misses, 2);
  const hugeBlock = run([0, max - 1], { memoryCells: max, cellsPerBlock: max, cacheLines: 1, mapping: 'direct' });
  assert.equal(hugeBlock.statistics.hits, 1); assert.equal(hugeBlock.cache[0].blockEnd, max - 1);
});

test('campos de zero bits e endereço zero funcionam nos três mapeamentos', () => {
  for (const mapping of ['direct', 'fully-associative', 'set-associative']) {
    const state = run([0, 0], { memoryCells: 1, cellsPerBlock: 1, cacheLines: 1, ways: 1, mapping });
    assert.equal(state.statistics.hits, 1); assert.equal(state.statistics.misses, 1);
    assert.equal(state.lastAccess.decomposition.tag, 0); assert.equal(state.lastAccess.decomposition.set, 0);
  }
});

test('Random inválido falha antes de modificar a linha ou contabilizar o acesso', () => {
  let draw = 1;
  const engine = createSimulation(input([0, 1, 2], { ...small, replacement: 'RANDOM' }), { random: () => draw });
  engine.nextAccess(); engine.nextAccess(); const before = engine.view();
  assert.throws(() => engine.nextAccess(), RangeError);
  assert.deepEqual(engine.view().cache, before.cache); assert.equal(engine.view().statistics.processed, 2);
  draw = 0; engine.nextAccess(); assert.equal(engine.view().lastAccess.lineBefore.blockStart, 0);
});

test('entrada forjada ou inválida não cria simulação e layout recebido não substitui a validação', () => {
  for (const bad of [null, {}, { configuration: EXAMPLE_CONFIGURATION, addresses: [] },
    { configuration: EXAMPLE_CONFIGURATION, addresses: [4096] },
    { configuration: { ...EXAMPLE_CONFIGURATION, memoryCells: 100 }, addresses: [0] }]) {
    assert.throws(() => createSimulation(bad), RangeError);
  }
  const state = createSimulation({ ...input([0]), layout: { tagBits: 99 } }).view();
  assert.equal(state.layout.tagBits, 4);
});

test('mil acessos não materializam o total de linhas e mantêm histórico completo', () => {
  const state = run(Array.from({ length: 1000 }, (_, i) => i), { memoryCells: 2048,
    cellsPerBlock: 1, cacheLines: 2048, ways: 2 });
  assert.equal(state.history.length, 1000); assert.equal(state.cache.length, 1000);
  assert.equal(state.statistics.misses, 1000); assert.equal(state.statistics.processed, 1000);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { prepareSimulationInput } from '../src/core/input.js';
import { EXAMPLE_CONFIGURATION } from '../src/core/configuration.js';
import { EXAMPLE_ADDRESSES } from '../src/core/addresses.js';
import { createSimulation } from '../src/core/simulation.js';
import { createAnalysisModel } from '../src/ui/analysis-model.js';

function engine(addresses = EXAMPLE_ADDRESSES, changes = {}, options) {
  return createSimulation(prepareSimulationInput({ ...EXAMPLE_CONFIGURATION, ...changes }, addresses.join(', ')).input, options);
}
function finish(sim) { while (!sim.view().done) sim.nextAccess(); return sim.view(); }

test('análise sem simulação ou sem acesso concluído não inventa dados', () => {
  assert.equal(createAnalysisModel(null), null);
  const sim = engine([0]); sim.step();
  assert.equal(createAnalysisModel(sim.view()), null);
});

test('substituição LRU lê os dois snapshots sem escolher novamente a vítima', () => {
  const state = finish(engine()), old = JSON.stringify(state);
  const model = createAnalysisModel({ ...state, selectedAccess: state.history[19] });
  assert.equal(model.kind, 'replacement'); assert.equal(model.useLru, true);
  assert.equal(model.beforeRows.find(r => r.selected).line.blockStart, 992);
  assert.equal(model.beforeRows.find(r => r.selected).rank.rank, 2);
  assert.equal(model.afterRows.find(r => r.selected).line.blockStart, 3040);
  assert.equal(model.afterRows.find(r => r.selected).rank.rank, 1);
  assert.equal(model.beforeRows.find(r => r.selected).way, 0);
  assert.equal(JSON.stringify(state), old);
  assert.throws(() => model.beforeRows.push({}), TypeError);
});

test('histórico selecionado prevalece sobre o último acesso e a etapa pendente', () => {
  const sim = engine(); for (let i = 0; i < 19; i++) sim.nextAccess();
  for (let i = 0; i < 5; i++) sim.step();
  const state = sim.view(), record = state.history[18];
  const model = createAnalysisModel({ ...state, selectedAccess: record });
  assert.equal(model.access, record); assert.equal(model.kind, 'hit');
  assert.equal(model.afterRows.find(r => r.way === 0).line.blockStart, 992);
  assert.equal(state.cache.find(l => l.set === 14 && l.way === 0).blockStart, 3040);
  assert.equal(state.statistics.processed, 19); assert.equal(model.canNext, false);
  assert.equal(model.canPrevious, true);
});

test('linha livre tem uma vaga inválida projetada e não uma remoção fictícia', () => {
  const sim = engine([0], { memoryCells: 2 ** 52, cellsPerBlock: 1, cacheLines: 2 ** 52, mapping: 'fully-associative' });
  const state = sim.nextAccess(), model = createAnalysisModel(state);
  assert.equal(model.kind, 'free'); assert.equal(model.beforeRows.length, 1);
  assert.equal(model.beforeRows[0].line, null); assert.equal(state.lastAccess.before.cache.length, 0);
  assert.equal(model.afterRows.length, 1); assert.equal(model.afterRows[0].line.valid, true);
  assert.equal(model.canNext, false);
});

test('acerto preserva o bloco e atualiza a recência somente no snapshot posterior', () => {
  const state = finish(engine([0, 1, 0], { memoryCells: 16, cellsPerBlock: 1, cacheLines: 2, mapping: 'fully-associative' }));
  const model = createAnalysisModel(state);
  assert.equal(model.kind, 'hit'); assert.equal(model.beforeRows[0].rank.rank, 2);
  assert.equal(model.afterRows[0].rank.rank, 1);
  assert.equal(model.access.lineBefore.blockStart, model.access.lineAfter.blockStart);
  assert.equal(model.access.replaced, false);
});

test('direto, FIFO e Random não recebem estado LRU indevido', () => {
  for (const [mapping, replacement] of [['direct', 'LRU'], ['fully-associative', 'FIFO'], ['fully-associative', 'RANDOM']]) {
    const state = finish(engine([0, 1, 2], { memoryCells: 16, cellsPerBlock: 1, cacheLines: 2, mapping, replacement }, { random: () => 0 }));
    const model = createAnalysisModel(state);
    assert.equal(model.kind, 'replacement'); assert.equal(model.useLru, false);
    assert.ok(model.beforeRows.every(r => r.rank === null));
    assert.equal(model.access.lineBefore.blockStart, 0);
  }
});

test('projeção mostra só o conjunto consultado e preserva a disponibilidade histórica', () => {
  const state = finish(engine());
  const model = createAnalysisModel({ ...state, selectedAccess: state.history[19] });
  assert.ok(model.beforeRows.every(r => r.line.set === 14));
  assert.equal(model.beforeRows.length, 2); assert.equal(model.canNext, true);
  assert.equal(createAnalysisModel(state).canNext, false);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { prepareSimulationInput } from '../src/core/input.js';
import { DEFAULT_CONFIGURATION } from '../src/core/configuration.js';
import { createSimulation } from '../src/core/simulation.js';
import { explainSimulationAccess } from '../src/ui/simulation-explanation.js';

function run(mapping, replacement, sequence) {
  const prepared = prepareSimulationInput({ ...DEFAULT_CONFIGURATION, memoryCells: 16, cellsPerBlock: 1, cacheLines: 2, ways: 2, mapping, replacement }, sequence);
  const engine = createSimulation(prepared.input, { random: () => 0 });
  while (!engine.view().done) engine.nextAccess();
  return engine.view();
}
function explanation(state, index, format) {
  return explainSimulationAccess(state.history[index], state.configuration, state.layout, state.history, format);
}

test('compulsória só no primeiro acesso ao bloco; releitura ausente e acerto usam snapshots corretos', () => {
  const state = run('direct', 'FIFO', '0, 2, 0, 0');
  assert.match(explanation(state, 0).summary, /compulsória/);
  assert.doesNotMatch(explanation(state, 2).summary, /compulsória/);
  assert.match(explanation(state, 2).summary, /bloco 2–2.*bloco 0–0/);
  assert.match(explanation(state, 3).summary, /ACERTO: V=1 e tag coincidente/);
  assert.match(explanation(state, 3).steps[1].body, /V=1, tag 0 = 0/);
});

for (const [policy, criterion] of [['FIFO', 'carregado há mais tempo'], ['LRU', 'usado há mais tempo'], ['RANDOM', 'aleatoriamente']]) {
  test(`${policy}: explica critério e bloco anterior preservado`, () => {
    const state = run('fully-associative', policy, '0, 1, 0, 2');
    const detail = explanation(state, 3);
    assert.match(detail.steps[3].body, new RegExp(criterion));
    const removed = policy === 'LRU' ? 1 : 0;
    assert.match(detail.summary, new RegExp(`bloco ${removed}–${removed}.*bloco 2–2`));
    assert.deepEqual(detail.binary.map(part => part.label), ['Tag']);
    assert.equal(detail.binary[0].value, '0010');
  });
}

test('explicação em binário mantém bits acima de 32 e não modifica snapshots', () => {
  const input = prepareSimulationInput({ ...DEFAULT_CONFIGURATION, memoryCells: 2 ** 52 }, `${2 ** 52 - 1}`).input;
  const engine = createSimulation(input); engine.nextAccess(); const state = engine.view();
  const before = JSON.stringify(state);
  const detail = explanation(state, 0, 'binary');
  assert.equal(detail.binary.map(part => part.value).join('').length, 52);
  assert.equal(detail.binary.map(part => part.value).join(''), '1'.repeat(52));
  assert.equal(JSON.stringify(state), before);
});

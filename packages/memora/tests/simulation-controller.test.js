import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_CONFIGURATION } from '../src/core/configuration.js';
import { prepareSimulationInput } from '../src/core/input.js';
import { createSimulationController } from '../src/ui/simulation-controller.js';

const input = () => prepareSimulationInput(DEFAULT_CONFIGURATION, '0, 1, 16').input;
function setup() {
  const tasks = new Map(); let id = 0;
  const controller = createSimulationController(input(), { schedule: (fn, delay) => {
    const key = ++id; tasks.set(key, { fn, delay }); return key;
  }, cancel: key => tasks.delete(key) });
  return { controller, tasks, tick() { const [key, task] = tasks.entries().next().value; tasks.delete(key); task.fn(); } };
}

test('play/pause preservam microetapa e impedem avanço por callbacks antigos', () => {
  const { controller: c, tasks, tick } = setup();
  c.play(); assert.equal(c.view().phase, 'decompose'); assert.equal(tasks.size, 1);
  const stale = tasks.values().next().value.fn;
  c.pause(); assert.equal(tasks.size, 0); const paused = c.view(); stale();
  assert.equal(c.view().phase, paused.phase); assert.equal(c.view().statistics.processed, 0);
  c.play(); assert.equal(c.view().phase, 'search'); tick(); assert.equal(c.view().phase, 'result');
});

test('passo manual cancela o relógio, próximo acesso conclui só o pendente e parar preserva progresso', () => {
  const { controller: c, tasks } = setup();
  c.play(); c.nextStep(); assert.equal(tasks.size, 0); assert.equal(c.view().phase, 'search');
  c.nextAccess(); assert.equal(c.view().statistics.processed, 1);
  c.play(); c.stop(); assert.equal(tasks.size, 0); assert.equal(c.view().status, 'stopped');
  assert.equal(c.view().statistics.processed, 1); assert.equal(c.view().cache.length, 1);
});

test('velocidade mantém um relógio e etapas detalhadas mudam o ritmo, não o resultado', () => {
  const { controller: c, tasks, tick } = setup();
  c.play(); c.setSpeed(10); assert.equal(tasks.size, 1); assert.equal(tasks.values().next().value.delay, 100);
  c.setDetailed(false); tick(); assert.equal(c.view().statistics.processed, 1);
  tick(); tick(); assert.equal(c.view().done, true); assert.equal(tasks.size, 0);
  assert.equal(c.view().statistics.hits, 1); assert.equal(c.view().statistics.misses, 2);
});

test('formato e revisão do histórico não alteram a execução nem as estatísticas', () => {
  const { controller: c } = setup(); c.nextAccess(); c.nextAccess();
  const before = c.view(); c.setFormat('binary'); c.selectAccess(1);
  assert.deepEqual(c.view().cache, before.cache); assert.deepEqual(c.view().statistics, before.statistics);
  assert.equal(c.view().selectedAccess.address, 0); assert.equal(c.view().selectedAccess.after.statistics.processed, 1);
  c.showLive(); assert.equal(c.view().selectedAccess, null); c.nextAccess(); assert.equal(c.view().done, true);
});

test('reiniciar zera dados e preserva preferências; descartar cancela callbacks', () => {
  const { controller: c, tasks } = setup(); c.setFormat('binary'); c.setSpeed(8); c.setDetailed(false);
  c.nextAccess(); c.play(); const stale = tasks.values().next().value.fn;
  c.restart(); stale(); assert.equal(c.view().statistics.processed, 0); assert.equal(c.view().history.length, 0);
  assert.equal(c.view().format, 'binary'); assert.equal(c.view().speed, 8); assert.equal(c.view().detailed, false);
  c.play(); const detached = tasks.values().next().value.fn; c.dispose(); detached(); assert.equal(tasks.size, 0);
});

test('controles rejeitam preferências e acessos inexistentes', () => {
  const { controller: c } = setup();
  assert.throws(() => c.setSpeed(0), RangeError); assert.throws(() => c.setSpeed(11), RangeError);
  assert.throws(() => c.setFormat('hex'), TypeError); assert.throws(() => c.selectAccess(1), RangeError);
});

test('velocidade inicial é 5 etapas por segundo e reprograma o relógio ao ajustar', () => {
  const { controller: c, tasks } = setup();
  assert.equal(c.view().speed, 5);
  c.play();
  assert.equal(tasks.values().next().value.delay, 200);
  c.setSpeed(1);
  assert.equal(tasks.size, 1);
  assert.equal(tasks.values().next().value.delay, 1000);
  c.setSpeed(10);
  assert.equal(tasks.size, 1);
  assert.equal(tasks.values().next().value.delay, 100);
});

test('avanço manual segue modo detalhado e troca no meio do acesso sem duplicar contagem', () => {
  const { controller: c } = setup();
  c.nextStep(); assert.equal(c.view().phase, 'decompose');
  assert.equal(c.view().statistics.processed, 0);
  c.setDetailed(false); c.nextStep(); assert.equal(c.view().statistics.processed, 1);
  c.nextStep(); assert.equal(c.view().statistics.processed, 2);
  c.setDetailed(true); c.nextStep(); assert.equal(c.view().phase, 'decompose');
  assert.equal(c.view().statistics.processed, 2);
  c.nextAccess(); assert.equal(c.view().statistics.processed, 3);
  assert.equal(c.view().statistics.hits, 1);
});


test('ir ao final preserva snapshots e conclui o acesso pendente sem duplicar nem renderizar cada fase', () => {
  const expected = createSimulationController(input());
  while (!expected.view().done) expected.nextAccess();
  let renders = 0;
  const c = createSimulationController(input(), { onChange: () => renders++ });
  for (let i = 0; i < 5; i++) c.nextStep();
  const before = renders;
  const final = c.finish();
  assert.equal(final.status, 'finished'); assert.equal(final.done, true);
  assert.equal(renders, before + 1);
  assert.deepEqual(final.history, expected.view().history);
  assert.deepEqual(final.cache, expected.view().cache);
  assert.deepEqual(final.statistics, expected.view().statistics);
  c.finish(); assert.deepEqual(c.view().history, final.history);
  c.restart(); assert.equal(c.view().statistics.processed, 0);
  assert.equal(c.finish().history.length, 3);
});

test('ir ao final cancela reprodução e callbacks antigos, limpa revisão e respeita descarte', () => {
  const { controller: c, tasks } = setup();
  c.play(); const stale = tasks.values().next().value.fn;
  c.finish(); assert.equal(tasks.size, 0);
  const final = c.view(); stale(); assert.deepEqual(c.view(), final);
  c.restart(); c.nextAccess(); c.selectAccess(1); c.finish();
  assert.equal(c.view().selected, null); assert.equal(c.view().history.length, 3);
  c.restart(); c.dispose(); c.finish(); assert.equal(c.view().statistics.processed, 0);
});

test('ir ao final interrompe no erro do motor sem entrar em loop ou inventar conclusão', () => {
  const prepared = prepareSimulationInput({ ...DEFAULT_CONFIGURATION, mapping: 'fully-associative',
    cacheLines: 1, ways: 1, replacement: 'RANDOM' }, '0, 16').input;
  const c = createSimulationController(prepared, { random: () => 1 });
  const state = c.finish();
  assert.equal(state.done, false); assert.equal(state.status, 'paused');
  assert.match(state.error, /Random/); assert.equal(state.statistics.processed, 1);
  assert.equal(state.history.length, 1);
});

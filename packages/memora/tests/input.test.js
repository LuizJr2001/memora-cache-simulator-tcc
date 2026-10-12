import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_CONFIGURATION, decomposeAddress } from '../src/core/configuration.js';
import { EXAMPLE_ADDRESSES } from '../src/core/addresses.js';
import { prepareSimulationInput } from '../src/core/input.js';

test('prepara o cenário didático completo sem criar estado de cache', () => {
  const result = prepareSimulationInput(DEFAULT_CONFIGURATION, EXAMPLE_ADDRESSES.join(', '));
  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, { fields: {}, sequence: [] });
  assert.equal(result.input.addresses.length, 21);
  assert.deepEqual(result.input.addresses, EXAMPLE_ADDRESSES);
  assert.deepEqual(decomposeAddress(result.input.addresses[19], result.input.configuration), {
    address: 3044, block: 190, set: 14, tag: 11, offset: 4,
    blockStart: 3040, blockEnd: 3055,
  });
});

test('configurações inválidas não liberam dados para execução', () => {
  const raw = { ...DEFAULT_CONFIGURATION, memoryCells: 100, cacheLines: 3 };
  const result = prepareSimulationInput(raw, '0, 1');
  assert.equal(result.ok, false);
  assert.equal(result.input, null);
  assert.ok(result.errors.fields.memoryCells);
  assert.ok(result.errors.fields.cacheLines);
  assert.deepEqual(result.errors.sequence, []);
  assert.equal(raw.memoryCells, 100);
});

test('a sequência inválida da issue #26 é bloqueada com quatro posições de erro', () => {
  const raw = { ...DEFAULT_CONFIGURATION, memoryCells: 16, cellsPerBlock: 4, cacheLines: 2 };
  const result = prepareSimulationInput(raw, '-1,16,abc,');
  assert.equal(result.ok, false);
  assert.equal(result.input, null);
  assert.deepEqual(result.errors.fields, {});
  assert.deepEqual(result.errors.sequence.map(error => error.position), [1, 2, 3, 4]);
});

test('mudar a memória recalcula o intervalo sem reaproveitar a configuração anterior', () => {
  const first = prepareSimulationInput(DEFAULT_CONFIGURATION, '2018');
  const smaller = { ...DEFAULT_CONFIGURATION, memoryCells: 16, cellsPerBlock: 4, cacheLines: 2 };
  const rejected = prepareSimulationInput(smaller, '2018');
  assert.equal(rejected.ok, false);
  assert.equal(rejected.input, null);
  assert.match(rejected.errors.sequence[0].message, /0 a 15/);
  const accepted = prepareSimulationInput(smaller, '15');
  assert.equal(accepted.ok, true);
  assert.equal(accepted.input.layout.addressBits, 4);
  assert.equal(first.input.layout.addressBits, 12);
  assert.deepEqual(first.input.addresses, [2018]);
});

test('normaliza os campos condicionais dos três mapeamentos sem alterar a entrada', () => {
  for (const mapping of ['direct', 'fully-associative', 'set-associative']) {
    const raw = {
      ...DEFAULT_CONFIGURATION, mapping,
      ways: mapping === 'set-associative' ? '4' : 'valor de campo desabilitado',
    };
    const before = { ...raw };
    const result = prepareSimulationInput(raw, '0, 3044');
    assert.equal(result.ok, true);
    assert.deepEqual(raw, before);
    assert.equal(result.input.configuration.ways,
      mapping === 'direct' ? 1 : mapping === 'fully-associative' ? 32 : 4);
    assert.ok(Object.values(result.input.layout).every(Number.isSafeInteger));
  }
});

test('a entrada pronta fica isolada de edições posteriores do formulário', () => {
  const raw = { ...DEFAULT_CONFIGURATION };
  const { input } = prepareSimulationInput(raw, '0,1');
  raw.memoryCells = 16;
  assert.equal(input.configuration.memoryCells, 4096);
  assert.throws(() => input.addresses.push(2), TypeError);
  assert.throws(() => { input.configuration.ways = 4; }, TypeError);
  assert.deepEqual(input.addresses, [0, 1]);
});

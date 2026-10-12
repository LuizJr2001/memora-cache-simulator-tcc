import test from 'node:test';
import assert from 'node:assert/strict';
import { createConfigurationController } from '../src/ui/configuration-controller.js';
import { DEFAULT_CONFIGURATION } from '../src/core/configuration.js';
import { EXAMPLE_ADDRESSES, MAX_ADDRESSES } from '../src/core/addresses.js';
import { prepareSimulationInput } from '../src/core/input.js';

test('início bloqueado sem sequência; o exemplo restaura parâmetros e todos os 21 endereços', () => {
  const screen = createConfigurationController();
  assert.equal(screen.view().canStart, false);
  screen.setField('memoryCells', '100');
  screen.setSequence('-1, abc');
  const view = screen.loadExample();
  assert.deepEqual(view.raw, DEFAULT_CONFIGURATION);
  assert.deepEqual(view.addresses.addresses, EXAMPLE_ADDRESSES);
  assert.equal(view.canStart, true);
  assert.deepEqual([view.parameters.layout.tagBits, view.parameters.layout.indexBits, view.parameters.layout.offsetBits], [4, 4, 4]);
});

test('trocar mapeamentos apresenta os valores normalizados e preserva as escolhas ajustáveis', () => {
  const screen = createConfigurationController(); screen.loadExample();
  screen.setField('ways', '4'); screen.setField('replacement', 'FIFO');
  let view = screen.setField('mapping', 'direct');
  assert.equal(view.waysEditable, false); assert.equal(view.replacementEditable, false);
  assert.equal(view.waysValue, '1'); assert.equal(view.parameters.configuration.replacement, null);
  assert.equal(view.parameters.layout.indexBits, 5);
  view = screen.setField('mapping', 'fully-associative');
  assert.equal(view.waysValue, '32'); assert.equal(view.parameters.layout.indexBits, 0);
  assert.equal(view.replacementEditable, true);
  view = screen.setField('mapping', 'set-associative');
  assert.equal(view.waysEditable, true); assert.equal(view.waysValue, '4');
  assert.equal(view.replacementValue, 'FIFO'); assert.equal(view.parameters.layout.indexBits, 3);
});

test('totalmente associativo acompanha alterações no número de linhas', () => {
  const screen = createConfigurationController(); screen.loadExample();
  screen.setField('mapping', 'fully-associative');
  const view = screen.setField('cacheLines', '64');
  assert.equal(view.waysValue, '64'); assert.equal(view.parameters.configuration.ways, 64);
  assert.equal(view.parameters.layout.setCount, 1);
});

test('reduzir linhas não corrige silenciosamente vias inválidas nem libera o início', () => {
  const screen = createConfigurationController(); screen.loadExample();
  screen.setField('ways', '4');
  const view = screen.setField('cacheLines', '2');
  assert.equal(view.waysValue, '4'); assert.equal(view.canStart, false);
  assert.ok(view.parameters.errors.ways); assert.equal(view.preview, null);
  assert.deepEqual(view.waysOptions, ['1', '2']);
});

test('geração usa a memória atual após editar parâmetros já validados', () => {
  const screen = createConfigurationController({ random: () => .999 });
  screen.loadExample(); screen.validateParameters(); screen.setField('memoryCells', '256');
  assert.equal(screen.view().parametersConfirmed, false);
  assert.equal(screen.view().canStart, false); // a sequência anterior ultrapassa a nova memória
  const generated = screen.generate(3);
  assert.equal(generated.ok, true); assert.deepEqual(generated.view.addresses.addresses, [255, 255, 255]);
  assert.equal(generated.view.canStart, true);
});

test('quantidades e parâmetros inválidos preservam a sequência durante geração', () => {
  const screen = createConfigurationController(); screen.loadExample();
  const original = screen.view().sequence;
  for (const count of [0, MAX_ADDRESSES + 1, 1.5, NaN]) {
    assert.equal(screen.generate(count).ok, false); assert.equal(screen.view().sequence, original);
  }
  screen.setField('memoryCells', '100');
  assert.equal(screen.generate(3).ok, false); assert.equal(screen.view().sequence, original);
});

test('erros do núcleo aparecem por campo; sequência não usa limite de memória inválida', () => {
  const screen = createConfigurationController();
  screen.setField('memoryCells', '100'); screen.setField('ways', '3'); screen.setSequence('-1, 4096, abc');
  const view = screen.view();
  assert.ok(view.parameters.errors.memoryCells); assert.ok(view.parameters.errors.ways);
  assert.ok(view.addresses.errors.some(e => e.message.includes('Corrija o total de células')));
  assert.ok(!view.addresses.errors.some(e => e.message.includes('fora do intervalo')));
  assert.equal(view.canStart, false); assert.equal(screen.prepare().input, null);
});

test('preparação fornece exatamente a entrada imutável do núcleo sem executar acessos', () => {
  const deliveries = [];
  const screen = createConfigurationController({ onPrepared: input => deliveries.push(input) });
  screen.loadExample();
  const result = screen.prepare();
  assert.deepEqual(result, prepareSimulationInput(DEFAULT_CONFIGURATION, EXAMPLE_ADDRESSES.join(', ')));
  assert.equal(deliveries.length, 1); assert.equal(screen.view().preparedInput, deliveries[0]);
  assert.ok(Object.isFrozen(deliveries[0])); assert.ok(Object.isFrozen(deliveries[0].addresses));
  assert.ok(!Object.hasOwn(deliveries[0], 'cache'));
  screen.setSequence('4096');
  assert.equal(screen.view().preparedInput, null); assert.equal(screen.prepare().ok, false);
  assert.equal(deliveries.length, 1);
});

test('alterar configuração invalida a entrada preparada e atualiza a decomposição', () => {
  const screen = createConfigurationController(); screen.loadExample(); screen.setSequence('2018'); screen.prepare();
  assert.deepEqual([screen.view().preview.tag, screen.view().preview.set, screen.view().preview.offset], [7, 14, 2]);
  const view = screen.setField('mapping', 'direct');
  assert.equal(view.preparedInput, null);
  assert.deepEqual([view.preview.tag, view.preview.set, view.preview.offset], [3, 30, 2]);
});

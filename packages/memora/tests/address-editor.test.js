import test from 'node:test';
import assert from 'node:assert/strict';
import { addressTokens, MAX_ADDRESSES, MAX_SEQUENCE_CHARACTERS } from '../src/core/addresses.js';
import { validateAddressBlocks } from '../src/ui/address-editor.js';

test('blocos preservam ordem, repetições, vazios e limites do campo textual', () => {
  const tokens = addressTokens('0, 1\n16, 16, , 4096');
  assert.deepEqual(tokens, ['0', '1', '16', '16', '', '4096']);
  assert.deepEqual(validateAddressBlocks(tokens, 4096).errors.map(e => e.position), [5, 6]);
  const valid = validateAddressBlocks(['0', '1', '16', '16', '4095'], 4096);
  assert.equal(valid.ok, true); assert.deepEqual(valid.addresses, [0, 1, 16, 16, 4095]);
  assert.equal(validateAddressBlocks(['0', '4096'], 8192).ok, true);
  assert.equal(validateAddressBlocks(['0'], undefined).ok, false);
  assert.equal(validateAddressBlocks(Array(MAX_ADDRESSES + 1).fill('0'), 4096).ok, false);
  assert.equal(validateAddressBlocks(['0'.repeat(MAX_SEQUENCE_CHARACTERS + 1)], 4096).ok, false);
});

test('cada bloco representa um único endereço e não aceita separadores, notações ou valores inválidos', () => {
  for (const value of ['', ' ', '1,2', '1 2', '1\n2', '-1', '2.5', '1e3', 'abc', '4096']) {
    const result = validateAddressBlocks(['0', value, '3'], 4096);
    assert.equal(result.ok, false, value); assert.equal(result.errors[0].position, 2);
  }
});

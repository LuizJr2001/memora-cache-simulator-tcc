import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateAddresses, generateAddresses, MAX_ADDRESSES, MAX_SEQUENCE_CHARACTERS,
} from '../src/core/addresses.js';

test('rejeita notações ambíguas e mantém o valor e a posição de cada erro', () => {
  const tokens = ['-1', '+1', '1.0', '1e2', '0x10', 'abc', String(2 ** 53)];
  const result = validateAddresses(tokens.join(', '), 4096);
  assert.equal(result.ok, false);
  assert.deepEqual(result.addresses, []);
  assert.deepEqual(result.errors.map(error => error.position), [1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(result.errors.map(error => error.value), tokens);
});

test('aceita zero e o último endereço da memória, inclusive acima de 32 bits', () => {
  for (const cells of [1, 16, 4096, 2 ** 40]) {
    const result = validateAddresses(`0, ${cells - 1}`, cells);
    assert.equal(result.ok, true);
    assert.deepEqual(result.addresses, [0, cells - 1]);
    assert.equal(validateAddresses(String(cells), cells).ok, false);
  }
});

test('o limite permite 1000 endereços de 16 dígitos sem truncar a sequência', () => {
  const lastAddress = 2 ** 52 - 1;
  const text = Array(MAX_ADDRESSES).fill(lastAddress).join(', ');
  assert.ok(text.length <= MAX_SEQUENCE_CHARACTERS);
  const result = validateAddresses(text, 2 ** 52);
  assert.equal(result.ok, true);
  assert.equal(result.addresses.length, 1000);
  assert.ok(result.addresses.every(address => address === lastAddress));
  const tooMany = validateAddresses(Array(1001).fill(0).join(','), 4096);
  assert.equal(tooMany.ok, false);
  assert.deepEqual(tooMany.addresses, []);
  assert.match(tooMany.errors[0].message, /1000/);
});

test('limita texto excessivo antes de montar a lista de endereços', () => {
  assert.equal(validateAddresses('0'.padEnd(MAX_SEQUENCE_CHARACTERS, ' '), 16).ok, true);
  const tooLong = validateAddresses(','.repeat(MAX_SEQUENCE_CHARACTERS + 1), 16);
  assert.equal(tooLong.ok, false);
  assert.deepEqual(tooLong.addresses, []);
  assert.equal(tooLong.errors.length, 1);
  assert.match(tooLong.errors[0].message, /18000 caracteres/);
  for (const value of [null, undefined, 0, [], {}, '   ']) {
    assert.equal(validateAddresses(value, 16).ok, false);
  }
});

test('geração usa uma fonte controlável e nunca ultrapassa a memória', () => {
  const cells = 2 ** 40;
  const samples = [0, 0.5, 1 - Number.EPSILON / 2];
  const addresses = generateAddresses(3, cells, () => samples.shift());
  assert.deepEqual(addresses, [0, cells / 2, cells - 1]);
  assert.ok(addresses.every(value => Number.isSafeInteger(value) && value >= 0 && value < cells));
});

test('geração rejeita parâmetros e fontes inválidas sem iniciar o trabalho', () => {
  let calls = 0;
  const source = () => { calls += 1; return 0; };
  for (const count of [0, -1, 1.5, '3', 1001, Infinity]) {
    assert.throws(() => generateAddresses(count, 16, source), RangeError);
  }
  for (const cells of [0, -1, 2.5, '16', Infinity, 2 ** 53]) {
    assert.throws(() => generateAddresses(3, cells, source), RangeError);
  }
  assert.equal(calls, 0);
  for (const source of [null, 0, {}, 'random']) {
    assert.throws(() => generateAddresses(1, 16, source), RangeError);
  }
  for (const sample of [-0.1, 1, NaN, Infinity, '0.5']) {
    assert.throws(() => generateAddresses(1, 16, () => sample), RangeError);
  }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_CONFIGURATION as base, validateConfiguration, decomposeAddress, isPowerOfTwo } from '../src/core/configuration.js';
import { validateAddresses, generateAddresses, EXAMPLE_ADDRESSES, MAX_ADDRESSES } from '../src/core/addresses.js';

test('o exemplo do Figma produz 12 bits, distribuídos em 4/4/4', () => {
  const result = validateConfiguration(base);
  assert.equal(result.ok, true);
  assert.deepEqual(result.layout, { addressBits: 12, tagBits: 4, indexBits: 4, offsetBits: 4, setCount: 16, blockCount: 256, maxAddress: 4095, memoryBytes: 4096 });
  assert.deepEqual(decomposeAddress(3044, base), { address: 3044, block: 190, set: 14, tag: 11, offset: 4, blockStart: 3040, blockEnd: 3055 });
});

test('direto fixa uma via e não aplica política de substituição', () => {
  const result = validateConfiguration({ ...base, mapping: 'direct', ways: 'abc', replacement: 'invalid' });
  assert.equal(result.ok, true);
  assert.equal(result.configuration.ways, 1);
  assert.equal(result.configuration.replacement, null);
  assert.equal(result.layout.indexBits, 5);
  assert.equal(result.layout.tagBits, 3);
});

test('totalmente associativo fixa todas as linhas no único conjunto', () => {
  const result = validateConfiguration({ ...base, mapping: 'fully-associative', cacheLines: '64', ways: 'abc' });
  assert.equal(result.ok, true);
  assert.equal(result.configuration.ways, 64);
  assert.equal(result.layout.setCount, 1);
  assert.equal(result.layout.indexBits, 0);
  assert.equal(result.layout.tagBits, 8);
});

test('quatro vias produzem oito conjuntos e bits 5/3/4', () => {
  const { layout } = validateConfiguration({ ...base, ways: '4' });
  assert.equal(layout.setCount, 8);
  assert.deepEqual([layout.tagBits, layout.indexBits, layout.offsetBits], [5, 3, 4]);
});

for (const field of ['bytesPerCell', 'memoryCells', 'cellsPerBlock', 'cacheLines', 'ways']) {
  test(`${field}: rejeita entradas vazias, zero, negativas, fracionárias ou ambíguas`, () => {
    for (const value of ['', ' ', null, undefined, 0, -1, 2.5, '2.0', '1e3', '0x10', 'abc', NaN, Infinity, true, Number.MAX_SAFE_INTEGER + 1]) {
      const result = validateConfiguration({ ...base, [field]: value });
      assert.equal(result.ok, false, String(value));
      assert.ok(result.errors[field]);
      assert.equal(result.layout, null);
      assert.equal(result.configuration, null);
    }
  });
}

test('rejeita os defeitos de bits fracionários descritos na issue #25', () => {
  for (const input of [{ memoryCells: 100 }, { cacheLines: 3 }, { ways: 3 }, { ways: 64 }, { cellsPerBlock: 8192 }, { memoryCells: 16, cacheLines: 32 }]) {
    const result = validateConfiguration({ ...base, ...input });
    assert.equal(result.ok, false);
    assert.equal(result.layout, null);
  }
});

test('aceita bytes por célula não potência de dois e mantém endereçamento por célula', () => {
  const result = validateConfiguration({ ...base, bytesPerCell: 3 });
  assert.equal(result.ok, true);
  assert.equal(result.layout.memoryBytes, 12288);
  assert.equal(result.layout.addressBits, 12);
  assert.equal(result.layout.maxAddress, 4095);
});

test('trata corretamente potências de dois acima dos 32 bits sem arredondar vizinhos', () => {
  assert.equal(isPowerOfTwo(2 ** 40), true);
  assert.equal(isPowerOfTwo(2 ** 40 + 1), false);
  assert.equal(isPowerOfTwo(2 ** 50 + 1), false);
  assert.equal(isPowerOfTwo(0), false);
  assert.equal(isPowerOfTwo(-2), false);
  assert.equal(isPowerOfTwo(2 ** 53), false);
  const result = validateConfiguration({ ...base, memoryCells: 2 ** 40 });
  assert.equal(result.ok, true);
  assert.equal(result.layout.addressBits, 40);
  assert.equal(validateConfiguration({ ...base, bytesPerCell: 8192, memoryCells: 2 ** 40 }).ok, false);
});

test('decomposição dos três mapeamentos recompõe todos os endereços de uma memória pequena', () => {
  for (const mapping of ['direct', 'fully-associative', 'set-associative']) {
    const input = { ...base, memoryCells: 64, cellsPerBlock: 4, cacheLines: 4, mapping };
    const { layout } = validateConfiguration(input);
    for (let address = 0; address < 64; address++) {
      const fields = decomposeAddress(address, input);
      assert.equal(((fields.tag * layout.setCount + fields.set) * 4) + fields.offset, address);
      assert.ok(fields.set < layout.setCount);
      assert.ok(fields.offset < 4);
      assert.equal(fields.blockEnd - fields.blockStart, 3);
    }
  }
});

test('aceita campos de zero bits e bloqueia decomposição com entradas inválidas', () => {
  const smallest = { ...base, memoryCells: 1, cellsPerBlock: 1, cacheLines: 1, ways: 1 };
  const result = validateConfiguration(smallest);
  assert.equal(result.ok, true);
  assert.deepEqual([result.layout.tagBits, result.layout.indexBits, result.layout.offsetBits], [0, 0, 0]);
  for (const address of [-1, 4096, 2.5, '1', NaN]) assert.throws(() => decomposeAddress(address, base), RangeError);
  assert.throws(() => decomposeAddress(0, { ...base, memoryCells: 100 }), RangeError);
  for (const raw of [null, undefined, {}, { ...base, mapping: 'unknown' }, { ...base, replacement: 'unknown' }]) assert.equal(validateConfiguration(raw).ok, false);
});

test('sequências usam vírgulas, espaços e quebras de linha; itens vazios continuam inválidos', () => {
  assert.deepEqual(validateAddresses('0, 1  16\n17', 4096).addresses, [0, 1, 16, 17]);
  assert.equal(validateAddresses(EXAMPLE_ADDRESSES.join(', '), 4096).ok, true);
  const result = validateAddresses('-1,16,abc,', 16);
  assert.equal(result.ok, false);
  assert.deepEqual(result.errors.map(e => e.position), [1, 2, 3, 4]);
  assert.deepEqual(result.addresses, []);
  assert.equal(validateAddresses('0,,1', 4096).ok, false);
  assert.equal(validateAddresses('0, 1.0', 4096).ok, false);
  assert.equal(validateAddresses('', 4096).ok, false);
  assert.equal(validateAddresses('0', null).ok, false);
});

test('geração controlada respeita quantidade e limites, sem depender da sequência anterior', () => {
  assert.deepEqual(generateAddresses(3, 16, () => 0), [0, 0, 0]);
  assert.deepEqual(generateAddresses(2, 16, () => 0.999), [15, 15]);
  assert.equal(generateAddresses(MAX_ADDRESSES, 16).length, MAX_ADDRESSES);
  for (const count of [0, -1, 1.5, MAX_ADDRESSES + 1, NaN]) assert.throws(() => generateAddresses(count, 16), RangeError);
  assert.throws(() => generateAddresses(1, 0), RangeError);
  assert.throws(() => generateAddresses(1, 16, () => 1), RangeError);
  assert.equal(validateAddresses(Array(MAX_ADDRESSES + 1).fill(0).join(','), 16).ok, false);
});

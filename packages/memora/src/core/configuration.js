/**
 * Configuração e decomposição adaptadas de docs/scripts.js (Beto).
 * Origem: Leandro Gabriel e colaboradores, 2022 — licença MIT, ../../../../LICENSE.
 * Endereços identificam células; bytes por célula não altera os bits do endereço.
 */
export const DEFAULT_CONFIGURATION = Object.freeze({
  bytesPerCell: 1,
  memoryCells: 4096,
  cellsPerBlock: 16,
  cacheLines: 32,
  mapping: 'set-associative',
  ways: 2,
  replacement: 'LRU',
});

export const MAPPINGS = Object.freeze(['direct', 'fully-associative', 'set-associative']);
export const REPLACEMENTS = Object.freeze(['FIFO', 'LRU', 'RANDOM']);

export function isPowerOfTwo(value) {
  return Number.isSafeInteger(value) && value > 0 &&
    (BigInt(value) & (BigInt(value) - 1n)) === 0n;
}

function positiveInteger(value) {
  if (typeof value === 'string') {
    const text = value.trim();
    if (!/^\d+$/.test(text)) return null;
    value = Number(text);
  }
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0 ? value : null;
}

export function validateConfiguration(raw = {}) {
  raw = raw && typeof raw === 'object' ? raw : {};
  const errors = {};
  const configuration = {};
  const labels = {
    bytesPerCell: 'Bytes por célula', memoryCells: 'Total de células',
    cellsPerBlock: 'Células por bloco', cacheLines: 'Número de linhas', ways: 'Vias por conjunto',
  };
  function read(field, powerOfTwo = false) {
    const value = positiveInteger(raw[field]);
    if (value === null) errors[field] = `${labels[field]}: informe um inteiro positivo, sem casas decimais`;
    else if (powerOfTwo && !isPowerOfTwo(value)) {
      errors[field] = `${value} não é potência de 2. Use valores como 1, 2, 4, 8, 16 ou 32`;
    }
    configuration[field] = value;
    return value;
  }
  read('bytesPerCell');
  read('memoryCells', true);
  read('cellsPerBlock', true);
  read('cacheLines', true);

  if (!MAPPINGS.includes(raw.mapping)) errors.mapping = 'Selecione um dos três mapeamentos disponíveis';
  configuration.mapping = raw.mapping;
  if (raw.mapping === 'direct') {
    configuration.ways = 1;
    configuration.replacement = null;
  } else {
    configuration.ways = raw.mapping === 'fully-associative' ? configuration.cacheLines : read('ways', true);
    if (!REPLACEMENTS.includes(raw.replacement)) errors.replacement = 'Selecione FIFO, LRU ou Random';
    configuration.replacement = raw.replacement;
  }

  if (!errors.memoryCells && !errors.cellsPerBlock && configuration.cellsPerBlock > configuration.memoryCells) {
    errors.cellsPerBlock = 'O bloco não pode ter mais células que a memória principal. Reduza o bloco';
  }
  if (!errors.cacheLines && !errors.ways && !errors.mapping) {
    if (configuration.ways > configuration.cacheLines) {
      errors.ways = 'As vias não podem exceder o número de linhas da cache';
    } else if (configuration.cacheLines % configuration.ways !== 0) {
      errors.ways = 'As vias devem dividir exatamente o número de linhas da cache';
    }
  }
  if (!errors.bytesPerCell && !errors.memoryCells &&
      !Number.isSafeInteger(configuration.bytesPerCell * configuration.memoryCells)) {
    errors.bytesPerCell = 'A capacidade em bytes excede a precisão suportada. Reduza os bytes por célula ou o total de células';
  }

  if (Object.keys(errors).length) return { ok: false, errors, configuration: null, layout: null };

  const setCount = configuration.cacheLines / configuration.ways;
  const addressBits = Math.log2(configuration.memoryCells);
  const offsetBits = Math.log2(configuration.cellsPerBlock);
  const indexBits = Math.log2(setCount);
  const tagBits = addressBits - offsetBits - indexBits;
  if (tagBits < 0) {
    errors.cacheLines = 'Há mais conjuntos que blocos na memória principal. Reduza as linhas, aumente as vias ou reduza o bloco';
    return { ok: false, errors, configuration: null, layout: null };
  }
  const layout = Object.freeze({
    addressBits, tagBits, indexBits, offsetBits, setCount,
    blockCount: configuration.memoryCells / configuration.cellsPerBlock,
    maxAddress: configuration.memoryCells - 1,
    memoryBytes: configuration.bytesPerCell * configuration.memoryCells,
  });
  return { ok: true, errors, configuration: Object.freeze(configuration), layout };
}

export function decomposeAddress(address, rawConfiguration) {
  const result = validateConfiguration(rawConfiguration);
  if (!result.ok) throw new RangeError('Configuração inválida. Corrija os parâmetros antes de decompor o endereço');
  if (!Number.isSafeInteger(address) || address < 0 || address > result.layout.maxAddress) {
    throw new RangeError(`O endereço deve ser um inteiro entre 0 e ${result.layout.maxAddress}`);
  }
  const { cellsPerBlock } = result.configuration;
  const block = Math.floor(address / cellsPerBlock);
  const set = block % result.layout.setCount;
  const tag = Math.floor(block / result.layout.setCount);
  return Object.freeze({
    address, block, set, tag, offset: address % cellsPerBlock,
    blockStart: block * cellsPerBlock, blockEnd: (block + 1) * cellsPerBlock - 1,
  });
}

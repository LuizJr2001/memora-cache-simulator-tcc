// Validação da sequência para a Tela 1; acesso e substituição serão implementados separadamente.
export const MAX_ADDRESSES = 1000;
// 16 dígitos por endereço seguro mais até 2 caracteres de separação.
export const MAX_SEQUENCE_CHARACTERS = MAX_ADDRESSES * 18;
export const DEFAULT_GENERATION_COUNT = 32;
export const DEFAULT_ADDRESSES = Object.freeze([
  0, 1, 6, 7, 8, 9, 992, 993, 994, 481, 482, 0, 1, 2, 996, 224, 225, 2017, 2018, 4064, 996,
]);
export const EXAMPLE_ADDRESSES = Object.freeze([
  0, 1, 16, 17, 32, 33, 48, 49, 64, 65, 992, 993, 2016, 2017, 2, 18, 34, 994, 2018, 3044, 96,
]);

export function validateAddresses(text, memoryCells) {
  const errors = [];
  const addresses = [];
  const limitKnown = Number.isSafeInteger(memoryCells) && memoryCells > 0;
  if (typeof text !== 'string' || text.length === 0) {
    return { ok: false, errors: [{ position: 1, value: '', message: 'Informe pelo menos um endereço' }], addresses: [] };
  }
  if (text.length > MAX_SEQUENCE_CHARACTERS) {
    return { ok: false, errors: [{ message: `Use no máximo ${MAX_SEQUENCE_CHARACTERS} caracteres na sequência` }], addresses: [] };
  }
  if (!text.trim()) {
    return { ok: false, errors: [{ position: 1, value: '', message: 'Informe pelo menos um endereço' }], addresses: [] };
  }
  // Vírgulas preservam itens vazios; espaços e quebras de linha separam itens sem criar vazios.
  const tokens = text.split(',').flatMap(part => part.trim() ? part.trim().split(/\s+/) : ['']);
  if (tokens.length > MAX_ADDRESSES) {
    return { ok: false, errors: [{ message: `Use no máximo ${MAX_ADDRESSES} endereços por sequência` }], addresses: [] };
  }
  tokens.forEach((token, index) => {
    const value = /^\d+$/.test(token) ? Number(token) : NaN;
    let message;
    if (!Number.isSafeInteger(value)) message = `Item ${index + 1}: “${token || 'vazio'}” não é um inteiro não negativo`;
    else if (limitKnown && value >= memoryCells) message = `Item ${index + 1}: ${value} está fora do intervalo de 0 a ${memoryCells - 1}`;
    if (message) errors.push({ position: index + 1, value: token, message });
    else addresses.push(value);
  });
  if (!limitKnown) errors.push({ message: 'Corrija o total de células para validar o limite dos endereços' });
  return { ok: errors.length === 0, errors, addresses: errors.length ? [] : addresses };
}

export function generateAddresses(count, memoryCells, random = Math.random) {
  if (!Number.isSafeInteger(count) || count < 1 || count > MAX_ADDRESSES ||
      !Number.isSafeInteger(memoryCells) || memoryCells < 1) {
    throw new RangeError(`Informe uma quantidade entre 1 e ${MAX_ADDRESSES} e uma memória válida`);
  }
  if (typeof random !== 'function') throw new RangeError('Informe uma fonte aleatória válida');
  return Array.from({ length: count }, () => {
    const sample = random();
    if (!Number.isFinite(sample) || sample < 0 || sample >= 1) throw new RangeError('A fonte aleatória deve produzir valores entre 0 (inclusive) e 1 (exclusive)');
    return Math.floor(sample * memoryCells);
  });
}

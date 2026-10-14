import { DEFAULT_CONFIGURATION, decomposeAddress, isPowerOfTwo, validateConfiguration } from '../core/configuration.js';
import { EXAMPLE_ADDRESSES, generateAddresses, validateAddresses } from '../core/addresses.js';
import { prepareSimulationInput } from '../core/input.js';

/** Estado da Tela 1, sem regras da cache e sem dependência de DOM */
export function createConfigurationController({ random = Math.random, onPrepared = () => {} } = {}) {
  let raw = { ...DEFAULT_CONFIGURATION };
  let sequence = '';
  let preparedInput = null;
  let parametersConfirmed = false;

  function view() {
    const parameters = validateConfiguration(raw);
    // O núcleo já validou este campo, mesmo quando outro parâmetro está errado
    const memoryCells = parameters.errors.memoryCells ? undefined : Number(raw.memoryCells);
    const addresses = validateAddresses(sequence, memoryCells);
    const configuration = parameters.configuration;
    const waysOptions = [];
    if (isPowerOfTwo(Number(raw.cacheLines))) {
      for (let ways = 1; ways <= Number(raw.cacheLines); ways *= 2) {
        const candidate = validateConfiguration({ ...raw, mapping: 'set-associative', ways });
        if (!candidate.errors.ways) waysOptions.push(String(ways));
      }
    }
    return {
      raw: { ...raw }, sequence, preparedInput, parametersConfirmed,
      parameters, addresses,
      canStart: parameters.ok && addresses.ok,
      waysEditable: raw.mapping === 'set-associative',
      replacementEditable: raw.mapping !== 'direct',
      // Estes estados apresentam as normalizações definidas pelo núcleo
      waysValue: String(configuration?.ways ?? (raw.mapping === 'direct' ? 1 :
        raw.mapping === 'fully-associative' ? raw.cacheLines : raw.ways)),
      replacementValue: raw.mapping === 'direct' ? '' : raw.replacement,
      waysOptions,
      preview: parameters.ok && addresses.ok ? decomposeAddress(addresses.addresses[0], configuration) : null,
    };
  }

  function invalidate() { preparedInput = null; parametersConfirmed = false; }
  return {
    view,
    setField(field, value) {
      if (!Object.hasOwn(DEFAULT_CONFIGURATION, field)) throw new TypeError('Campo de configuração desconhecido');
      raw = { ...raw, [field]: value };
      invalidate();
      return view();
    },
    setSequence(value) { sequence = value; invalidate(); return view(); },
    validateParameters() { parametersConfirmed = validateConfiguration(raw).ok; return view(); },
    loadExample() {
      raw = { ...DEFAULT_CONFIGURATION };
      sequence = EXAMPLE_ADDRESSES.join(', ');
      invalidate();
      return view();
    },
    generate(count) {
      const parameters = validateConfiguration(raw);
      if (!parameters.ok) return { ok: false, message: 'Corrija os parâmetros antes de gerar endereços' };
      try {
        // Revalida os parâmetros atuais; não usa limites de uma validação anterior
        const generated = generateAddresses(count, parameters.configuration.memoryCells, random);
        sequence = generated.join(', ');
        invalidate();
        return { ok: true, view: view() };
      } catch (error) {
        if (!(error instanceof RangeError)) throw error;
        return { ok: false, message: error.message };
      }
    },
    prepare() {
      preparedInput = null;
      const result = prepareSimulationInput(raw, sequence);
      if (result.ok) {
        preparedInput = result.input;
        onPrepared(preparedInput);
      }
      return result;
    },
  };
}

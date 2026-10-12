import { validateConfiguration } from './configuration.js';
import { validateAddresses } from './addresses.js';

/**
 * Prepara os dados de entrada sem criar ou alterar a cache.
 * A interface só deve encaminhar input ao motor quando ok for true.
 */
export function prepareSimulationInput(rawConfiguration, sequence) {
  const parameters = validateConfiguration(rawConfiguration);
  if (!parameters.ok) {
    return { ok: false, errors: { fields: parameters.errors, sequence: [] }, input: null };
  }

  const result = validateAddresses(sequence, parameters.configuration.memoryCells);
  if (!result.ok) {
    return { ok: false, errors: { fields: {}, sequence: result.errors }, input: null };
  }

  return {
    ok: true,
    errors: { fields: {}, sequence: [] },
    input: Object.freeze({
      configuration: parameters.configuration,
      layout: parameters.layout,
      addresses: Object.freeze(result.addresses),
    }),
  };
}

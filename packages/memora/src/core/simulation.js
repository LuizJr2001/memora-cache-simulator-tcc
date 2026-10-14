/**
 * Execução extraída e adaptada de docs/scripts.js (Beto).
 * Origem: Leandro Gabriel e colaboradores, 2022 — licença MIT, ../../../../LICENSE.
 * Sem DOM, temporizadores ou alocação de células/linhas vazias da memória.
 */
import { decomposeAddress } from './configuration.js';
import { prepareSimulationInput } from './input.js';
import { MAX_ADDRESSES } from './addresses.js';

export const SIMULATION_PHASES = Object.freeze(['decompose', 'search', 'result', 'select', 'update', 'complete']);

export function createSimulation(input, { random = Math.random } = {}) {
  if (!Array.isArray(input?.addresses) || !input.addresses.length || input.addresses.length > MAX_ADDRESSES) {
    throw new RangeError('Prepare uma sequência válida antes de iniciar');
  }
  const prepared = prepareSimulationInput(input.configuration, input.addresses.join(', '));
  if (!prepared.ok) throw new RangeError('Prepare parâmetros e endereços válidos antes de iniciar');
  if (typeof random !== 'function') throw new TypeError('A fonte aleatória deve ser uma função');
  const source = prepared.input;
  const { configuration, layout, addresses } = source;
  let sets, history, processed, hits, misses, usedLines, phase, pending;

  function cacheSnapshot() {
    return Object.freeze([...sets.values()].flatMap(set => [...set.values()])
      .sort((a, b) => a.set - b.set || a.way - b.way));
  }

  function statistics() {
    return Object.freeze({ processed, total: addresses.length, hits, misses,
      hitRate: processed ? hits / processed : null, usedLines, totalLines: configuration.cacheLines });
  }

  function snapshot() { return Object.freeze({ cache: cacheSnapshot(), statistics: statistics() }); }

  function view() {
    return Object.freeze({ input: source, configuration, layout, phase,
      done: processed === addresses.length, statistics: statistics(), cache: cacheSnapshot(),
      history: Object.freeze([...history]), lastAccess: history.at(-1) ?? null,
      current: pending ? Object.freeze({ ...pending }) : null });
  }

  function reset() {
    sets = new Map(); history = []; processed = 0; hits = 0; misses = 0;
    usedLines = 0; phase = 'ready'; pending = null;
    return view();
  }

  function selectLine() {
    const set = sets.get(pending.decomposition.set) ?? new Map();
    if (pending.result === 'hit') return { way: pending.foundWay, reason: 'hit' };
    // As vias são ocupadas em ordem e nunca são removidas individualmente
    if (set.size < configuration.ways) return { way: set.size, reason: 'free' };
    if (configuration.mapping === 'direct') return { way: 0, reason: 'direct' };
    if (configuration.replacement === 'RANDOM') {
      const draw = random();
      if (typeof draw !== 'number' || !Number.isFinite(draw) || draw < 0 || draw >= 1) {
        throw new RangeError('A fonte Random deve retornar um número entre 0 e 1, sem incluir 1');
      }
      return { way: Math.floor(draw * configuration.ways), reason: 'RANDOM', randomDraw: draw };
    }
    const key = configuration.replacement === 'FIFO' ? 'insertedAt' : 'lastUsed';
    const victim = [...set.values()].reduce((a, b) => b[key] < a[key] ||
      (b[key] === a[key] && b.way < a.way) ? b : a);
    return { way: victim.way, reason: configuration.replacement };
  }

  function step() {
    if (processed === addresses.length) return view();
    if (!pending) {
      pending = { number: processed + 1, address: addresses[processed],
        decomposition: decomposeAddress(addresses[processed], configuration), before: snapshot(),
        result: null, foundWay: null, way: null, reason: null, lineBefore: null, lineAfter: null };
      phase = 'decompose';
    } else if (phase === 'decompose') {
      const set = sets.get(pending.decomposition.set);
      const found = set && [...set.values()].find(line => line.tag === pending.decomposition.tag);
      pending.foundWay = found?.way ?? null;
      phase = 'search';
    } else if (phase === 'search') {
      pending.result = pending.foundWay === null ? 'miss' : 'hit';
      phase = 'result';
    } else if (phase === 'result') {
      const selection = selectLine();
      Object.assign(pending, selection);
      pending.lineBefore = sets.get(pending.decomposition.set)?.get(selection.way) ?? null;
      phase = 'select';
    } else if (phase === 'select') {
      const { set: setIndex, tag, block, blockStart, blockEnd } = pending.decomposition;
      const set = sets.get(setIndex) ?? new Map();
      const stamp = processed + 1;
      const line = Object.freeze({ set: setIndex, way: pending.way, valid: true, tag, block,
        blockStart, blockEnd, insertedAt: pending.result === 'hit' ? pending.lineBefore.insertedAt : stamp,
        lastUsed: stamp });
      if (!set.has(pending.way)) usedLines++;
      set.set(pending.way, line); sets.set(setIndex, set);
      pending.lineAfter = line;
      phase = 'update';
    } else if (phase === 'update') {
      processed++;
      if (pending.result === 'hit') hits++; else misses++;
      const record = Object.freeze({ ...pending, replaced: pending.result === 'miss' && pending.lineBefore !== null,
        after: snapshot() });
      history.push(record);
      pending = null; phase = 'complete';
    }
    return view();
  }

  function nextAccess() {
    const start = processed;
    while (processed === start && processed < addresses.length) step();
    return view();
  }

  reset();
  return Object.freeze({ view, step, nextAccess, reset });
}

/** Posições LRU por conjunto, sem misturar recência com ordem FIFO */
export function lruState(cache, configuration) {
  if (configuration.mapping === 'direct' || configuration.replacement !== 'LRU') return null;
  const sets = new Map();
  for (const line of cache) {
    if (!sets.has(line.set)) sets.set(line.set, []);
    sets.get(line.set).push(line);
  }
  const state = [];
  for (const [set, lines] of sets) {
    lines.sort((a, b) => b.lastUsed - a.lastUsed || a.way - b.way);
    lines.forEach((line, index) => state.push(Object.freeze({ set, way: line.way, rank: index + 1,
      newest: index === 0, candidate: lines.length === configuration.ways && index === lines.length - 1 })));
  }
  return Object.freeze(state);
}

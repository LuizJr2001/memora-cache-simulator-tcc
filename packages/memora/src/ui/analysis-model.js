import { lruState } from '../core/simulation.js';

/** Projeção de um acesso concluído; não executa nem escolhe novamente uma vítima */
export function createAnalysisModel(state) {
  const access = state?.selectedAccess ?? state?.lastAccess;
  if (!access) return null;
  const config = state.configuration;
  const useLru = config.mapping !== 'direct' && config.replacement === 'LRU';
  const kind = access.result === 'hit' ? 'hit' : access.replaced ? 'replacement' : 'free';
  function rows(snapshot, before) {
    const lines = snapshot.cache.filter(line => line.set === access.decomposition.set);
    const ranks = new Map((lruState(lines, config) ?? []).map(rank => [rank.way, rank]));
    const result = lines.map(line => Object.freeze({ line, way: line.way,
      selected: line.way === access.way, rank: ranks.get(line.way) ?? null }));
    // Uma única vaga escolhida é representada, sem materializar todas as vias vazias
    if (before && !lines.some(line => line.way === access.way)) {
      result.push(Object.freeze({ line: null, way: access.way, selected: true, rank: null }));
    }
    return Object.freeze(result.sort((a, b) => a.way - b.way));
  }
  return Object.freeze({ access, config, layout: state.layout, useLru, kind,
    beforeRows: rows(access.before, true), afterRows: rows(access.after, false),
    canNext: access.number < state.history.length || !state.done });
}

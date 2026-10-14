import { createAnalysisModel } from './analysis-model.js';

export function mountAnalyzeScreen(document, { onReturn = () => {}, onNext = () => {}, onFormat = () => {} } = {}) {
  const byId = id => document.getElementById(id);
  function text(id, value) { const node = byId(id); if (node.textContent !== value) node.textContent = value; }
  function render(state) {
    const model = createAnalysisModel(state);
    byId('analysis-empty').hidden = Boolean(model); byId('analysis-content').hidden = !model;
    if (!model) return;
    const { access: a, config, layout, kind, useLru } = model;
    const numeric = (value, width = layout.addressBits) => state.format === 'binary' ?
      value.toString(2).padStart(Math.max(1, width), '0') : String(value);
    const range = line => line.blockStart === line.blockEnd ? numeric(line.blockStart) : `${numeric(line.blockStart)}–${numeric(line.blockEnd)}`;
    const part = (value, width) => width === 0 ? '—' : numeric(value, width);
    const direct = config.mapping === 'direct';
    const place = `${direct ? 'linha' : 'conjunto'} ${numeric(a.decomposition.set, layout.indexBits)}`;
    const policy = a.reason === 'RANDOM' ? 'Random' : a.reason;
    const via = `via ${a.way + 1}`;
    text('analysis-subtitle', `Acompanhe ${kind === 'hit' ? 'o acerto' : 'a falta'} no endereço ${numeric(a.address)} e veja exatamente o que muda`);
    text('analysis-event-title', `Acesso ${a.number} de ${state.statistics.total} · endereço ${numeric(a.address)}`);
    text('analysis-result', kind === 'hit' ? '✓ ACERTO' : '✕ FALTA');
    byId('analysis-result').classList.toggle('is-hit', kind === 'hit');
    text('analysis-event-description', kind === 'hit' ?
      `Tag ${numeric(a.decomposition.tag, layout.tagBits)} encontrada na ${via} do ${place} · bloco ${range(a.lineAfter)} já presente` :
      kind === 'free' ? `Tag ${numeric(a.decomposition.tag, layout.tagBits)} não está no ${place} · a ${via} está livre e recebe o bloco` :
        direct ? `O novo bloco usa a ${place} · o mapeamento direto determina a única via a substituir` :
          `Tag ${numeric(a.decomposition.tag, layout.tagBits)} não está no ${place} · sem via livre, ${policy} escolhe a ${via}`);
    for (const format of ['decimal', 'binary']) {
      const selected = state.format === format;
      byId(`analysis-${format}`).setAttribute('aria-pressed', String(selected));
      text(`analysis-${format}`, `${selected ? '✓ ' : ''}${format === 'decimal' ? 'Decimal' : 'Binário'}`);
    }
    text('analysis-decomposition-description', `${numeric(a.address)} → tag ${part(a.decomposition.tag, layout.tagBits)} · ${place} · deslocamento ${part(a.decomposition.offset, layout.offsetBits)}`);
    for (const [id, label, value, width] of [
      ['tag', 'Tag', a.decomposition.tag, layout.tagBits],
      ['set', direct ? 'Linha' : 'Conjunto', a.decomposition.set, layout.indexBits],
      ['offset', 'Deslocamento', a.decomposition.offset, layout.offsetBits],
    ]) {
      text(`analysis-${id}`, part(value, width));
      text(`analysis-${id}-label`, width ? `${label} · ${width} ${width === 1 ? 'bit' : 'bits'}` : `Sem bits de ${label.toLowerCase()}`);
    }
    text('analysis-before-title', kind === 'replacement' ? 'Antes da substituição' : 'Antes do acesso');
    text('analysis-after-title', kind === 'replacement' ? 'Depois da substituição' : 'Depois do acesso');
    const choice = kind === 'hit' ? `A ${via} já contém o bloco e será mantida` : kind === 'free' ?
      `A ${via} está livre · nenhum bloco será removido` : direct ?
        `A ${via} é a única posição possível nesta linha` : policy === 'LRU' ?
          `A ${via} é a menos recente e será a vítima LRU` : policy === 'FIFO' ?
            `A ${via} entrou primeiro, no acesso ${a.lineBefore.insertedAt}` :
            `Random escolheu a ${via} entre as vias ocupadas`;
    text('analysis-before-description', choice);
    text('analysis-after-description', kind === 'hit' ?
      `A ${via} mantém o bloco${useLru ? ' e passa a ser a mais recente' : ' · nenhum bloco foi carregado'}` :
      `A ${via} recebe o bloco${useLru ? ' e passa a ser a mais recente' : ''}`);
    for (const side of ['before', 'after']) {
      const table = byId(`analysis-${side}-table`);
      table.querySelector('.analysis-lru-column').hidden = !useLru;
      const fragment = document.createDocumentFragment();
      for (const row of model[`${side}Rows`]) {
        const tr = document.createElement('tr'); tr.dataset.way = row.way + 1;
        if (row.selected) tr.className = side === 'before' && kind === 'replacement' ? 'analysis-victim' : side === 'after' ? 'analysis-updated' : 'analysis-chosen';
        const decision = !row.selected ? side === 'before' ? 'Manter' : 'Mantida' : side === 'after' ?
          kind === 'hit' ? 'Mantida' : 'Inserida' : kind === 'replacement' ? 'SUBSTITUIR' : kind === 'free' ? 'Usar via livre' : 'Manter';
        const recency = !row.rank ? '—' : row.rank.newest && row.rank.candidate ? '1 · Única via' :
          row.rank.newest ? '1 · Mais recente' : row.rank.candidate ? `${row.rank.rank} · Menos recente` : String(row.rank.rank);
        for (const value of [String(row.way + 1), row.line ? '1' : '0', row.line ? numeric(row.line.tag, layout.tagBits) : '—',
          row.line ? range(row.line) : '—', ...(useLru ? [recency] : []), decision]) {
          const td = document.createElement('td'); td.textContent = value; tr.append(td);
        }
        fragment.append(tr);
      }
      table.tBodies[0].replaceChildren(fragment);
    }
    text('analysis-out', kind === 'replacement' ? `${range(a.lineBefore)} · tag ${numeric(a.lineBefore.tag, layout.tagBits)} · ${via}` : 'Nenhum bloco removido');
    text('analysis-in', kind === 'hit' ? `Nenhum bloco carregado · ${range(a.lineAfter)} mantido` :
      `${range(a.lineAfter)} · tag ${numeric(a.lineAfter.tag, layout.tagBits)} · ${via}`);
    text('analysis-steps-title', kind === 'replacement' ? 'Como ocorre uma substituição?' : kind === 'hit' ? 'Como ocorre um acerto?' : 'Como um bloco entra na cache?');
    text('analysis-step-1-title', direct ? 'Localizar linha' : 'Localizar conjunto');
    text('analysis-step-1', `Identifique o ${place} a partir do endereço`);
    text('analysis-step-2', kind === 'hit' ? 'A tag coincide com uma via válida · o acesso é um acerto' : 'Nenhuma tag coincide com uma via válida · o acesso é uma falta');
    text('analysis-step-3-title', kind === 'hit' ? 'Manter bloco' : kind === 'free' ? 'Usar via livre' : direct ? 'Usar linha mapeada' : 'Aplicar política');
    text('analysis-step-3', choice);
    text('analysis-step-4', kind === 'hit' ? useLru ? 'Mantenha o bloco e atualize sua recência' : 'Mantenha o bloco e registre o acerto' :
      `Carregue ${range(a.lineAfter)} na ${via} e atualize os metadados`);
    byId('analysis-next').disabled = !model.canNext;
  }
  byId('analysis-return').addEventListener('click', onReturn);
  byId('analysis-next').addEventListener('click', onNext);
  for (const format of ['decimal', 'binary']) byId(`analysis-${format}`).addEventListener('click', () => onFormat(format));
  render(null);
  return { render };
}

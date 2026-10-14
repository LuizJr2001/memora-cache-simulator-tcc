import { createSimulationController } from './simulation-controller.js';
import { lruState } from '../core/simulation.js';

const phaseLabels = { decompose: 'Decompor endereço', search: 'Buscar tag no conjunto', result: 'Resultado do acesso',
  select: 'Selecionar linha', update: 'Atualizar cache', complete: 'Estado atualizado' };
const number = value => new Intl.NumberFormat('pt-BR').format(value);

export function mountSimulateScreen(document, { onConfigure = () => {}, random = Math.random } = {}) {
  const byId = id => document.getElementById(id);
  const root = byId('simulation-screen');
  let controller = null, onlyReplacements = false, previousDone = false;
  function text(id, value) { const node = byId(id); if (node.textContent !== value) node.textContent = value; }
  function element(tag, content, className) {
    const node = document.createElement(tag); if (content !== undefined) node.textContent = content;
    if (className) node.className = className; return node;
  }

  function render(state) {
    const { statistics: stats, configuration: config, layout, selectedAccess, lastAccess } = state;
    const current = selectedAccess ? null : state.current;
    const numeric = (value, width = layout.addressBits) => state.format === 'binary' ?
      value.toString(2).padStart(Math.max(1, width), '0') : String(value);
    const range = line => `${numeric(line.blockStart)}–${numeric(line.blockEnd)}`;
    const explain = access => !access?.result ? 'Lendo o endereço e consultando a cache' : access.result === 'hit' ?
      `Endereço já presente no bloco ${range(access.decomposition)}` : access.lineBefore ?
        `${access.reason === 'direct' ? 'Mapeamento direto' : access.reason === 'RANDOM' ? 'Random' : access.reason} substitui ${range(access.lineBefore)} por ${range(access.decomposition)}` :
        `Bloco ${range(access.decomposition)} carregado em linha livre`;
    const focus = selectedAccess ?? current ?? lastAccess;
    const address = selectedAccess ?? current ?? (state.done ? null : lastAccess);
    const cache = selectedAccess?.after.cache ?? state.cache;
    const set = focus?.decomposition.set;
    const useLru = config.mapping !== 'direct' && config.replacement === 'LRU';
    const ranks = lruState(cache, config) ?? [];
    const currentSet = set === undefined ? null : numeric(set, layout.indexBits);
    const currentBadge = `${state.done && !selectedAccess ? 'Último conjunto' : 'Conjunto atual'} · ${currentSet}`;

    text('sim-progress', `${stats.processed} / ${stats.total}`); text('sim-hits', number(stats.hits));
    text('sim-misses', number(stats.misses)); text('sim-hit-rate', stats.hitRate === null ? '—' :
      new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(stats.hitRate));
    text('sim-used-lines', `${number(stats.usedLines)} / ${number(stats.totalLines)}`);
    text('simulation-subtitle', selectedAccess ? `Revisando acesso ${selectedAccess.number} de ${stats.total} · execução preservada em ${stats.processed} / ${stats.total}` :
      state.done ? `${stats.total} de ${stats.total} · simulação concluída` : focus ?
        `Acesso ${focus.number} de ${stats.total} · endereço atual: ${numeric(focus.address)}` :
        `Pronto para iniciar · ${stats.total} endereços carregados`);

    text('sim-play', state.done ? '✓ Concluído' : state.status === 'running' ? 'Ⅱ Pausar' :
      state.status === 'ready' ? '▶ Iniciar' : '▶ Continuar');
    byId('sim-play').disabled = state.done;
    byId('sim-stop').disabled = state.status === 'ready' || state.status === 'stopped' || state.done;
    byId('sim-restart').disabled = state.status === 'ready' && stats.processed === 0;
    byId('sim-step').disabled = state.done; byId('sim-next').disabled = state.done;
    byId('sim-detailed').checked = state.detailed; byId('sim-speed').value = state.speed;
    const speedLabel = `${state.speed} ${state.speed === 1 ? 'etapa' : 'etapas'}/segundo`;
    text('sim-speed-label', `Velocidade (${speedLabel})`);
    byId('sim-speed').setAttribute('aria-valuetext', speedLabel);
    for (const format of ['decimal', 'binary']) {
      byId(`format-${format}`).setAttribute('aria-pressed', String(state.format === format));
      text(`format-${format}`, `${state.format === format ? '✓ ' : ''}${format === 'decimal' ? 'Decimal' : 'Binário'}`);
    }
    byId('simulation-complete').hidden = !state.done || Boolean(selectedAccess);
    root.classList.toggle('is-complete', state.done && !selectedAccess);
    byId('sim-status').parentElement.hidden = state.done && !selectedAccess;
    text('completion-detail', `Todos os ${stats.total} acessos foram processados`);
    byId('review-replacements').disabled = !state.history.some(a => a.replaced);
    const step = current ? phaseLabels[state.phase] : stats.processed ? 'Estado atualizado' : 'Pronto para iniciar';
    const resultText = current?.result === 'hit' ? 'ACERTO' : current?.result === 'miss' ? 'FALTA' : '';
    text('sim-status', state.error ? `⚠ ${state.error}` : selectedAccess ? `Revisão do acesso ${selectedAccess.number} · ${explain(selectedAccess)}` :
      current ? `${step}${resultText ? ` · ${resultText}` : ''} · endereço ${numeric(current.address)}` :
      state.done ? '✓ Simulação concluída' : lastAccess ? `${state.status === 'stopped' ? 'Execução parada · ' : '✓ Acesso concluído · '}${explain(lastAccess)}` :
      'Pronto para iniciar · nenhum acesso foi processado');
    byId('sim-status').classList.toggle('error-text', Boolean(state.error));
    for (const id of ['status-set', 'address-set', 'cache-set']) {
      byId(id).hidden = currentSet === null; text(id, currentBadge);
    }

    text('current-address-heading', selectedAccess ? `Acesso ${selectedAccess.number} em revisão` : address ? 'Endereço atual' :
      state.done ? 'Nenhum acesso em andamento' : 'Próximo acesso');
    text('current-address-description', selectedAccess ? `Cache após o acesso ${selectedAccess.number} · ${explain(selectedAccess)}` :
      address ? `Veja como ${numeric(address.address)} é decomposto antes da consulta` : state.done ?
        'A execução terminou. Consulte o histórico ou revise uma substituição' :
        'O primeiro endereço será decomposto quando a simulação começar');
    byId('show-live').hidden = !selectedAccess;
    const parts = address?.decomposition;
    text('sim-address', address ? numeric(address.address) : '—');
    for (const [id, label, width, value] of [
      ['tag', 'Tag', layout.tagBits, parts?.tag],
      ['set', config.mapping === 'direct' ? 'Linha' : 'Conjunto', layout.indexBits, parts?.set],
      ['offset', 'Desloc.', layout.offsetBits, parts?.offset],
    ]) {
      text(`sim-${id}`, value === undefined || width === 0 ? '—' : numeric(value, width));
      text(`sim-${id}-label`, width === 0 ? `Sem bits de ${label === 'Desloc.' ? 'deslocamento' : label.toLowerCase()}` : `${label} · ${width} ${width === 1 ? 'bit' : 'bits'}`);
    }

    text('cache-description', selectedAccess ? `Estado após o acesso ${selectedAccess.number} · conjunto revisado primeiro` :
      cache.length ? 'Linhas ocupadas · conjunto atual primeiro. Role para ver os demais conjuntos populados' :
        'A cache começa vazia. As linhas aparecerão conforme os blocos forem carregados');
    const table = byId('cache-table'), head = element('tr');
    for (const label of [config.mapping === 'direct' ? 'Linha' : 'Conj.', 'Via', 'Válido', 'Tag', 'Bloco armazenado', ...(useLru ? ['LRU'] : []), 'Ação']) {
      const th = element('th', label); th.scope = 'col';
      if (label === 'LRU') { const help = element('button', '?', 'help-button'); help.type = 'button'; help.dataset.help = 'lru'; help.id = 'lru-help'; help.setAttribute('aria-label', 'Ajuda: Estado LRU'); th.append(' ', help); }
      head.append(th);
    }
    const activeHelp = document.activeElement?.id === 'lru-help';
    const columns = `${config.mapping === 'direct'}:${useLru}`;
    if (table.dataset.columns !== columns) { table.tHead.replaceChildren(head); table.dataset.columns = columns; }
    const rows = [...cache].sort((a, b) => Number(b.set === set) - Number(a.set === set) || a.set - b.set || a.way - b.way);
    const body = document.createDocumentFragment();
    for (const line of rows) {
      const rank = ranks.find(r => r.set === line.set && r.way === line.way);
      const chosen = focus && line.set === focus.decomposition.set && line.way === focus.way;
      const selectedVictim = current && state.phase === 'select' && current.result === 'miss' && chosen;
      const updated = chosen && (selectedAccess || !current || state.phase === 'update');
      const candidate = rank?.candidate && line.set === set && !chosen;
      const tr = element('tr', undefined, `cache-row${line.set === set ? ' current-set' : ''}${selectedVictim || candidate ? ' candidate-row' : ''}${updated ? ' updated-row' : ''}`);
      tr.dataset.set = line.set; tr.dataset.way = line.way + 1;
      const lru = !rank ? '—' : line.set !== set ? `${rank.rank}` : rank.newest && rank.candidate ? '1 · Única via' :
        rank.newest ? '1 · Mais recente' : rank.candidate ? `${rank.rank} · Próx. substituição` : `${rank.rank} · Menos recente`;
      const action = selectedVictim ? 'Selecionada' : updated ? focus.result === 'hit' ? 'Mantida' : focus.lineBefore ? 'Substituída' : 'Nova' :
        candidate ? 'Candidata' : 'Mantida';
      for (const value of [numeric(line.set, layout.indexBits), String(line.way + 1), '1', numeric(line.tag, layout.tagBits), range(line), ...(useLru ? [lru] : []), action]) tr.append(element('td', value));
      body.append(tr);
    }
    table.tBodies[0].replaceChildren(body); byId('cache-empty').hidden = cache.length !== 0;
    if (activeHelp && byId('lru-help')) byId('lru-help').focus({ preventScroll: true });

    const historyBody = byId('history-table').tBodies[0], historyRows = document.createDocumentFragment();
    const activeReview = document.activeElement?.dataset.review;
    const visible = [...state.history].reverse().filter(a => !onlyReplacements || a.replaced);
    if (current && !onlyReplacements) {
      const tr = element('tr', undefined, 'pending-row'); tr.dataset.pending = 'true';
      for (const value of [current.number, numeric(current.address), current.result ? resultText : '→ Lendo', step]) tr.append(element('td', String(value)));
      historyRows.append(tr);
    }
    for (const access of visible) {
      const tr = element('tr', undefined, `history-row ${access.result === 'hit' ? 'hit-row' : 'miss-row'}${access.number === state.selected ? ' selected-access' : ''}`);
      tr.dataset.access = access.number;
      const first = element('td'), button = element('button', String(access.number), 'review-access');
      button.type = 'button'; button.dataset.review = access.number; button.setAttribute('aria-label', `Revisar acesso ${access.number}`);
      button.setAttribute('aria-pressed', String(access.number === state.selected)); first.append(button); tr.append(first);
      tr.append(element('td', numeric(access.address)), element('td', access.result === 'hit' ? '✓ ACERTO' : '✕ FALTA', 'access-result'), element('td', explain(access)));
      historyRows.append(tr);
    }
    historyBody.replaceChildren(historyRows);
    if (activeReview) historyBody.querySelector(`[data-review="${activeReview}"]`)?.focus({ preventScroll: true });
    byId('history-empty').hidden = state.history.length !== 0 || Boolean(current);
    byId('show-all-history').hidden = !onlyReplacements;
    text('history-description', onlyReplacements ? `${visible.length} ${visible.length === 1 ? 'substituição' : 'substituições'} · selecione para revisar` :
      state.history.length ? 'Selecione um acesso para revisar · mais recente primeiro' : 'Os acessos aparecerão aqui após o início da simulação');
    text('history-state-title', selectedAccess ? `Estado após o acesso ${selectedAccess.number}` : 'Estado atual');
    let summary = focus ? explain(focus) : 'A cache está vazia e os contadores estão zerados';
    if (current && !['update'].includes(state.phase)) {
      summary = state.phase === 'select' ? current.reason === 'hit' ? `A via ${current.way + 1} já contém o bloco; sua recência será atualizada` :
        current.lineBefore ? `${current.reason === 'direct' ? 'O mapeamento direto' : current.reason === 'RANDOM' ? 'Random' : current.reason} escolhe a via ${current.way + 1}, com o bloco ${range(current.lineBefore)}` :
          `A via ${current.way + 1} está livre e receberá o bloco ${range(current.decomposition)}` :
        `${phaseLabels[state.phase]} · o acesso ainda não foi contabilizado`;
    } else if (focus && useLru && focus.way !== null) {
      const candidate = ranks.find(r => r.set === focus.decomposition.set && r.candidate && r.way !== focus.way);
      summary = config.ways === 1 ? `A via ${focus.way + 1} é a única via do conjunto e será substituída em caso de falta` :
        `A via ${focus.way + 1} é a mais recente${candidate ? `; a via ${candidate.way + 1}, com ${range(cache.find(l => l.set === candidate.set && l.way === candidate.way))}, é candidata à próxima substituição` : '; uma via livre será usada antes de substituir um bloco'}`;
    }
    text('history-state', summary);
    if (state.done && !previousDone && !root.hidden) byId('completion-title').focus({ preventScroll: true });
    previousDone = state.done;
  }

  root.addEventListener('click', event => {
    const review = event.target.closest?.('button[data-review]');
    if (review) controller?.selectAccess(Number(review.dataset.review));
  });
  byId('sim-play').addEventListener('click', () => {
    if (controller?.view().status === 'running') controller.pause();
    else if (controller && !controller.view().done) {
      byId('simulation-analysis-warning').hidden = true;
      controller.play();
    }
  });
  for (const [id, method] of [['sim-stop', 'stop'], ['sim-restart', 'restart'], ['sim-step', 'nextStep'], ['sim-next', 'nextAccess'], ['show-live', 'showLive']]) {
    byId(id).addEventListener('click', () => {
      if (method === 'restart') onlyReplacements = false;
      if (controller && ['nextStep', 'nextAccess'].includes(method)) byId('simulation-analysis-warning').hidden = true;
      controller?.[method]();
    });
  }
  for (const format of ['decimal', 'binary']) byId(`format-${format}`).addEventListener('click', () => controller?.setFormat(format));
  byId('sim-speed').addEventListener('input', () => controller?.setSpeed(Number(byId('sim-speed').value)));
  byId('sim-detailed').addEventListener('change', () => controller?.setDetailed(byId('sim-detailed').checked));
  byId('new-simulation').addEventListener('click', onConfigure);
  byId('review-replacements').addEventListener('click', () => {
    const last = controller?.view().history.findLast(a => a.replaced);
    if (last) { onlyReplacements = true; controller.selectAccess(last.number); byId('current-address-heading').focus({ preventScroll: true }); }
  });
  byId('show-all-history').addEventListener('click', () => { onlyReplacements = false; if (controller) render(controller.view()); });
  document.addEventListener('memora:help-open', () => { if (!root.hidden) controller?.pause(); });
  return {
    prepare(input) { byId('simulation-analysis-warning').hidden = true; controller?.dispose(); onlyReplacements = false; previousDone = false;
      controller = createSimulationController(input, { random, onChange: render }); render(controller.view()); },
    showAnalysisWarning() {
      text('simulation-analysis-warning', 'A análise detalhada ainda não está disponível nesta versão. Acompanhe os resultados da simulação nesta tela.');
      byId('simulation-analysis-warning').hidden = false;
    },
    pause() { controller?.pause(); },
    invalidate() { controller?.dispose(); controller = null; },
    view() { return controller?.view() ?? null; },
  };
}

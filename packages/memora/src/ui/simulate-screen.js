import { createSimulationController } from './simulation-controller.js';
import { lruState } from '../core/simulation.js';
import { explainSimulationAccess } from './simulation-explanation.js';
import { cachePage, blockCellPage, CACHE_PAGE_SIZE, BLOCK_PAGE_SIZE } from './cache-presentation.js';

const phaseLabels = { decompose: 'Decompor endereço', search: 'Buscar tag no conjunto', result: 'Resultado do acesso',
  select: 'Selecionar linha', update: 'Atualizar cache', complete: 'Estado atualizado' };
const number = value => new Intl.NumberFormat('pt-BR').format(value);

export function mountSimulateScreen(document, { onAnalyze = () => {}, onChange = () => {}, random = Math.random } = {}) {
  const byId = id => document.getElementById(id);
  const root = byId('simulation-screen');
  let controller = null;
  let cacheStart = 0, lastFocus = null;
  const cellStarts = new Map();
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
    const explain = access => explainSimulationAccess(access, config, layout, state.history, state.format)?.summary ?? 'Nenhum acesso iniciado';
    const focus = selectedAccess ?? current ?? lastAccess;
    const address = selectedAccess ?? current ?? (state.done ? null : lastAccess);
    const cache = selectedAccess?.after.cache ?? state.cache;
    const set = focus?.decomposition.set;
    const useLru = config.mapping !== 'direct' && config.replacement === 'LRU';
    const ranks = lruState(cache, config) ?? [];
    const currentSet = set === undefined ? null : numeric(set, layout.indexBits);
    const placeLabel = config.mapping === 'direct' ? 'Linha' : 'Conjunto';
    const currentBadge = `${placeLabel} ${state.done && !selectedAccess ? 'final' : 'atual'} · ${currentSet}`;

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
    byId('sim-play').classList.toggle('is-finished', state.done);
    byId('go-analyze').disabled = !state.history.length;
    byId('sim-stop').disabled = state.status === 'ready' || state.status === 'stopped' || state.done;
    byId('sim-restart').disabled = state.status === 'ready' && stats.processed === 0;
    byId('sim-step').disabled = state.done; byId('sim-next').disabled = state.done;
    text('sim-step', state.detailed ? 'Próxima etapa' : 'Avançar acesso');
    text('sim-mode-description', state.detailed ? '(avança uma etapa e explica a decisão)' : '(avança um acesso completo)');
    root.classList.toggle('is-detailed', state.detailed);
    byId('sim-detailed').checked = state.detailed; byId('sim-speed').value = state.speed;
    const unit = state.detailed ? (state.speed === 1 ? 'etapa' : 'etapas') : (state.speed === 1 ? 'acesso' : 'acessos');
    const speedLabel = `${state.speed} ${unit}/segundo`;
    text('sim-speed-label', `Velocidade (${speedLabel})`);
    byId('sim-speed').setAttribute('aria-valuetext', speedLabel);
    for (const format of ['decimal', 'binary']) {
      byId(`format-${format}`).setAttribute('aria-pressed', String(state.format === format));
      text(`format-${format}`, `${state.format === format ? '✓ ' : ''}${format === 'decimal' ? 'Decimal' : 'Binário'}`);
    }
    root.classList.toggle('is-complete', state.done && !selectedAccess);
    const step = current ? phaseLabels[state.phase] : stats.processed ? 'Estado atualizado' : 'Pronto para iniciar';
    const resultText = current?.result === 'hit' ? 'ACERTO' : current?.result === 'miss' ? 'FALTA' : '';
    text('sim-status', state.error ? `⚠ ${state.error}` : selectedAccess ? `Revisão do acesso ${selectedAccess.number} · ${explain(selectedAccess)}` :
      current ? `${step}${resultText ? ` · ${resultText}` : ''} · endereço ${numeric(current.address)}` :
      state.done ? '✓ Simulação concluída' : lastAccess ? `${state.status === 'stopped' ? 'Execução parada · ' : '✓ Acesso concluído · '}${explain(lastAccess)}` :
      'Pronto para iniciar · nenhum acesso foi processado');
    byId('sim-status').classList.toggle('error-text', Boolean(state.error));
    byId('sim-status').classList.toggle('sr-only', !state.error);
    for (const id of ['address-set', 'cache-set']) {
      byId(id).hidden = currentSet === null; text(id, currentBadge);
    }

    text('current-address-heading', selectedAccess ? `Acesso ${selectedAccess.number} em revisão` : address ? 'Endereço atual' :
      state.done ? 'Nenhum acesso em andamento' : 'Próximo acesso');
    text('current-address-description', selectedAccess ? `Cache após o acesso ${selectedAccess.number} · ${explain(selectedAccess)}` :
      address ? `Veja como ${numeric(address.address)} é decomposto antes da consulta` : state.done ?
        'A execução terminou. Consulte o histórico ou abra Analisar' :
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

    const focusKey = focus ? `${focus.number}:${focus.way ?? focus.foundWay ?? 0}:${state.selected}` : null;
    if (focus && focusKey !== lastFocus) {
      cacheStart = Math.floor((focus.decomposition.set * config.ways + (focus.way ?? focus.foundWay ?? 0)) / CACHE_PAGE_SIZE) * CACHE_PAGE_SIZE;
      lastFocus = focusKey; cellStarts.clear();
    }
    const page = cachePage(cache, config, cacheStart, set);
    cacheStart = page.start;
    text('cache-description', selectedAccess ? `Estado após o acesso ${selectedAccess.number} · V=0 indica linha vazia` :
      `Todas as linhas, inclusive vazias (V=0) · ${config.mapping === 'direct' ? 'linha' : 'conjunto'} atual primeiro`);
    byId('cache-navigation').hidden = config.cacheLines <= CACHE_PAGE_SIZE;
    byId('cache-prev').disabled = page.start === 0;
    byId('cache-next').disabled = page.end === page.total;
    text('cache-page-summary', `Linhas ${number(page.start)}–${number(page.end - 1)} de ${number(page.total)} (índices a partir de 0)`);
    const table = byId('cache-table'), head = element('tr');
    const activeCellButton = table.contains(document.activeElement) && document.activeElement?.dataset.cells ? {
      key: document.activeElement.dataset.cells,
      label: document.activeElement.getAttribute('aria-label'),
    } : null;
    for (const label of [config.mapping === 'direct' ? 'Linha' : 'Conj.', 'Via', 'V', 'Tag', 'Bloco armazenado', ...(useLru ? ['LRU'] : []), 'Ação']) {
      const th = element('th', label); th.scope = 'col';
      if (label === 'V') { th.title = 'Validade: 0 indica linha vazia; 1 indica bloco carregado'; th.setAttribute('aria-label', 'Bit de validade'); }
      if (label === 'LRU') { const help = element('button', '?', 'help-button'); help.type = 'button'; help.dataset.help = 'lru'; help.id = 'lru-help'; help.setAttribute('aria-label', 'Ajuda: Estado LRU'); th.append(' ', help); }
      head.append(th);
    }
    const activeHelp = document.activeElement?.id === 'lru-help';
    const columns = `${config.mapping === 'direct'}:${useLru}`;
    if (table.dataset.columns !== columns) { table.tHead.replaceChildren(head); table.dataset.columns = columns; }
    const rows = page.rows;
    const body = document.createDocumentFragment();
    for (const line of rows) {
      const rank = ranks.find(r => r.set === line.set && r.way === line.way);
      const chosen = focus && line.set === focus.decomposition.set && line.way === focus.way;
      const selectedVictim = current && state.phase === 'select' && current.result === 'miss' && chosen;
      const updated = line.valid && chosen && (selectedAccess || !current || state.phase === 'update');
      const candidate = rank?.candidate && line.set === set && !chosen;
      const tr = element('tr', undefined, `cache-row${line.set === set ? ' current-set' : ''}${selectedVictim || candidate ? ' candidate-row' : ''}${updated ? ' updated-row' : ''}`);
      tr.dataset.set = line.set; tr.dataset.way = line.way + 1; tr.dataset.valid = String(Number(line.valid));
      if (!line.valid) tr.classList.add('empty-cache-row');
      const lru = !rank ? '—' : line.set !== set ? `${rank.rank}` : rank.newest && rank.candidate ? '1 · Única via' :
        rank.newest ? '1 · Mais recente' : rank.candidate ? `${rank.rank} · Próx. substituição` : `${rank.rank} · Menos recente`;
      const action = !line.valid ? selectedVictim ? 'Será preenchida' : 'Vazia' : selectedVictim ? 'Selecionada' : updated ? focus.result === 'hit' ? 'Mantida' : focus.lineBefore ? 'Substituída' : 'Nova' :
        candidate ? 'Candidata' : 'Mantida';
      for (const value of [numeric(line.set, layout.indexBits), String(line.way + 1), String(Number(line.valid)), line.valid ? numeric(line.tag, layout.tagBits) : '—']) tr.append(element('td', value));
      const block = element('td', undefined, 'cache-block');
      const key = `${line.set}:${line.way}:${line.valid ? line.block : 'empty'}`;
      const inBlock = line.valid && focus && focus.address >= line.blockStart && focus.address <= line.blockEnd;
      const cellStart = cellStarts.get(key) ?? (inBlock ? focus.decomposition.offset : 0);
      const cells = blockCellPage(line, config.cellsPerBlock, cellStart);
      block.append(element('span', line.valid ? range(line) : 'Bloco não carregado', 'block-range'));
      const strip = element('div', undefined, 'cache-cells');
      strip.setAttribute('aria-label', 'Células do bloco (endereços da memória principal)');
      strip.tabIndex = 0;
      for (const cell of cells.cells) {
        const selected = inBlock && cell.address === focus.address;
        const box = element('span', cell.address === null ? '—' : numeric(cell.address), `cache-cell${selected ? ' accessed-cell' : ''}`);
        box.dataset.offset = cell.offset;
        if (cell.address !== null) box.dataset.address = cell.address;
        box.title = cell.address === null ? `Célula vazia · deslocamento ${cell.offset}` : `Endereço ${cell.address} · deslocamento ${cell.offset}`;
        if (selected) box.setAttribute('aria-label', `Endereço ${cell.address}, célula do acesso atual`);
        strip.append(box);
      }
      block.append(strip);
      if (cells.total > BLOCK_PAGE_SIZE) {
        const navigation = element('div', undefined, 'cell-navigation');
        for (const [label, start, disabled] of [['←', cells.start - BLOCK_PAGE_SIZE, cells.start === 0], ['→', cells.end, cells.end === cells.total]]) {
          const button = element('button', label); button.type = 'button'; button.disabled = disabled;
          button.dataset.cells = key; button.dataset.start = start;
          button.setAttribute('aria-label', `${label === '←' ? 'Células anteriores' : 'Próximas células'} da ${config.mapping === 'direct' ? 'linha' : 'conjunto'} ${line.set}, via ${line.way + 1}`);
          navigation.append(button);
        }
        navigation.insertBefore(element('span', `Deslocamentos ${cells.start}–${cells.end - 1} / ${number(cells.total)}`), navigation.lastChild);
        block.append(navigation);
      }
      tr.append(block);
      for (const value of [...(useLru ? [lru] : []), action]) tr.append(element('td', value));
      if (line.valid && state.detailed && current && line.set === set && ['search', 'result', 'select'].includes(state.phase)) {
        tr.children[3].classList.add(line.tag === current.decomposition.tag ? 'tag-match' : 'tag-mismatch');
      }
      body.append(tr);
    }
    table.tBodies[0].replaceChildren(body); byId('cache-empty').hidden = true;
    const accessedCell = table.querySelector('.accessed-cell');
    if (accessedCell) {
      const strip = accessedCell.parentElement;
      strip.scrollLeft = accessedCell.getBoundingClientRect().left - strip.getBoundingClientRect().left - strip.clientWidth / 2 + accessedCell.clientWidth / 2;
    }
    if (activeHelp && byId('lru-help')) byId('lru-help').focus({ preventScroll: true });
    if (activeCellButton) {
      const buttons = [...table.querySelectorAll('button[data-cells]')].filter(button => button.dataset.cells === activeCellButton.key);
      const same = buttons.find(button => button.getAttribute('aria-label') === activeCellButton.label && !button.disabled);
      const target = same ?? buttons.find(button => !button.disabled);
      target?.focus({ preventScroll: true });
    }

    const historyBody = byId('history-table').tBodies[0], historyRows = document.createDocumentFragment();
    const activeReview = document.activeElement?.dataset.review;
    const visible = [...state.history].reverse();
    if (current) {
      const tr = element('tr', undefined, 'pending-row'); tr.dataset.pending = 'true';
      for (const value of [current.number, numeric(current.address), current.result ? resultText : '→ Lendo', state.detailed ? explainSimulationAccess(current, config, layout, state.history, state.format).steps.find(item => item.phase === state.phase)?.body ?? step : step]) tr.append(element('td', String(value)));
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
    text('history-description', state.history.length ? 'Selecione um acesso para revisar · mais recente primeiro' : 'Os acessos aparecerão aqui após o início da simulação');
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

    const detail = explainSimulationAccess(focus, config, layout, state.history, state.format);
    byId('access-details').hidden = !state.detailed;
    byId('access-details-empty').hidden = Boolean(detail);
    const timeline = byId('access-detail-steps');
    const binary = byId('access-binary');
    timeline.replaceChildren(); binary.replaceChildren();
    if (detail) {
      for (const part of detail.binary) {
        const group = element('span', undefined, 'binary-part');
        group.append(element('strong', part.value), element('small', `${part.label} · ${part.width} bits`));
        binary.append(group);
      }
      const phases = detail.steps.map(item => item.phase);
      const active = current ? phases.indexOf(state.phase) : phases.length - 1;
      for (const [index, item] of detail.steps.entries()) {
        const li = element('li', undefined, index === active ? 'active-phase' : index < active ? 'completed-phase' : 'future-phase');
        const title = element('strong', `${index < active || (!current && index === active) ? '✓ ' : ''}${item.title}`);
        li.append(title);
        if (index <= active) li.append(element('p', item.body));
        if (index === active && current) li.setAttribute('aria-current', 'step');
        timeline.append(li);
      }
    }
    const detailPhase = `${focus?.number}:${state.phase}:${state.selected}`;
    if (current && detail && state.detailed && byId('access-details').dataset.phase !== detailPhase) {
      const activeItem = timeline.querySelector('[aria-current="step"]');
      if (activeItem) {
        const panel = byId('access-details');
        panel.scrollTop += activeItem.getBoundingClientRect().top - panel.getBoundingClientRect().top - 28;
      }
    }
    byId('access-details').dataset.phase = detailPhase;
    onChange(state);
  }

  root.addEventListener('click', event => {
    const cellButton = event.target.closest?.('button[data-cells]');
    if (cellButton && controller) {
      cellStarts.set(cellButton.dataset.cells, Number(cellButton.dataset.start));
      controller.pause(); render(controller.view());
    }
    const review = event.target.closest?.('button[data-review]');
    if (review) controller?.selectAccess(Number(review.dataset.review));
  });
  for (const [id, direction] of [['cache-prev', -1], ['cache-next', 1]]) {
    byId(id).addEventListener('click', () => {
      if (!controller) return;
      controller.pause(); cacheStart += direction * CACHE_PAGE_SIZE;
      render(controller.view()); byId('cache-scroll').scrollTop = 0;
    });
  }
  byId('cache-jump-form').addEventListener('submit', event => {
    event.preventDefault();
    if (!controller) return;
    const input = byId('cache-line-jump'), value = input.value.trim();
    const index = /^\d+$/.test(value) ? Number(value) : NaN;
    const total = controller.view().configuration.cacheLines;
    if (!Number.isSafeInteger(index) || index < 0 || index >= total) {
      input.setAttribute('aria-invalid', 'true');
      text('cache-jump-error', `Informe uma linha entre 0 e ${number(total - 1)}`);
      return;
    }
    input.setAttribute('aria-invalid', 'false'); text('cache-jump-error', '');
    controller.pause(); cacheStart = index; render(controller.view()); byId('cache-scroll').scrollTop = 0;
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
      if (method === 'restart') { cacheStart = 0; lastFocus = null; cellStarts.clear(); }
      if (controller && ['nextStep', 'nextAccess'].includes(method)) byId('simulation-analysis-warning').hidden = true;
      controller?.[method]();
    });
  }
  for (const format of ['decimal', 'binary']) byId(`format-${format}`).addEventListener('click', () => controller?.setFormat(format));
  byId('sim-speed').addEventListener('input', () => controller?.setSpeed(Number(byId('sim-speed').value)));
  byId('sim-detailed').addEventListener('change', () => controller?.setDetailed(byId('sim-detailed').checked));
  byId('go-analyze').addEventListener('click', onAnalyze);
  document.addEventListener('memora:help-open', () => { if (!root.hidden) controller?.pause(); });
  return {
    prepare(input) { cacheStart = 0; lastFocus = null; cellStarts.clear(); byId('simulation-analysis-warning').hidden = true;
      byId('cache-line-jump').value = ''; byId('cache-line-jump').setAttribute('aria-invalid', 'false'); text('cache-jump-error', '');
      controller?.dispose();
      controller = createSimulationController(input, { random, onChange: render }); render(controller.view()); },
    showAnalysisWarning() {
      text('simulation-analysis-warning', 'Processe ao menos um acesso para analisar a decisão da cache. Clique em Iniciar ou Próximo acesso.');
      byId('simulation-analysis-warning').hidden = false;
    },
    pause() { controller?.pause(); },
    selectAccess(number) { controller?.selectAccess(number); },
    nextAccess() { controller?.nextAccess(); },
    setFormat(format) { controller?.setFormat(format); },
    invalidate() { controller?.dispose(); controller = null; },
    view() { return controller?.view() ?? null; },
  };
}


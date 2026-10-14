import { createSimulation } from '../core/simulation.js';

/** Relógio e seleção da Tela 2; regras da cache pertencem somente ao motor */
export function createSimulationController(input, {
  random = Math.random, schedule = setTimeout, cancel = clearTimeout, onChange = () => {},
} = {}) {
  const engine = createSimulation(input, { random });
  let timer = null, generation = 0, disposed = false;
  let status = 'ready', format = 'decimal', detailed = true, speed = 5, selected = null, error = null;

  function view() {
    const state = engine.view();
    return Object.freeze({ ...state, status, format, detailed, speed, selected,
      selectedAccess: selected === null ? null : state.history[selected - 1], error });
  }
  function emit() { const state = view(); if (!disposed) onChange(state); return state; }
  function stopClock() { generation++; if (timer !== null) cancel(timer); timer = null; }
  function advance(wholeAccess) {
    selected = null; error = null;
    try { wholeAccess ? engine.nextAccess() : engine.step(); }
    catch (failure) { stopClock(); status = 'paused'; error = failure.message; }
    if (engine.view().done) { stopClock(); status = 'finished'; }
  }
  function queue() {
    if (disposed || status !== 'running') return;
    const token = generation;
    timer = schedule(() => {
      if (disposed || token !== generation || status !== 'running') return;
      timer = null;
      advance(!detailed); emit(); queue();
    }, 1000 / speed);
  }
  function pause() {
    stopClock();
    if (status === 'running') { status = 'paused'; return emit(); }
    return view();
  }
  function manual(wholeAccess) {
    if (disposed) return view();
    stopClock(); status = engine.view().done ? 'finished' : 'paused';
    advance(wholeAccess); return emit();
  }

  return Object.freeze({
    view, pause,
    play() {
      if (disposed || engine.view().done || status === 'running') return view();
      stopClock(); selected = null; error = null; status = 'running';
      advance(!detailed); emit(); queue(); return view();
    },
    stop() { stopClock(); if (!engine.view().done) status = 'stopped'; return emit(); },
    restart() { stopClock(); engine.reset(); status = 'ready'; selected = null; error = null; return emit(); },
    nextStep: () => manual(!detailed),
    nextAccess: () => manual(true),
    setSpeed(value) {
      if (!Number.isInteger(value) || value < 1 || value > 10) throw new RangeError('Velocidade deve estar entre 1 e 10');
      stopClock(); speed = value; queue(); return emit();
    },
    setDetailed(value) { detailed = Boolean(value); return emit(); },
    setFormat(value) {
      if (!['decimal', 'binary'].includes(value)) throw new TypeError('Formato de exibição desconhecido');
      format = value; return emit();
    },
    selectAccess(number) {
      if (!Number.isInteger(number) || !engine.view().history[number - 1]) throw new RangeError('Selecione um acesso já processado');
      stopClock(); if (status === 'running') status = 'paused'; selected = number; return emit();
    },
    showLive() { selected = null; return emit(); },
    dispose() { stopClock(); disposed = true; },
  });
}

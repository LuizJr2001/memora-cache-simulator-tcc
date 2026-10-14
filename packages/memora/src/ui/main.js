import { mountConfigureScreen } from './configure-screen.js';
import { mountSimulateScreen } from './simulate-screen.js';
import { mountAnalyzeScreen } from './analyze-screen.js';
import { createSideSheet } from './side-sheet.js';

const sheet = createSideSheet(document);
const views = ['configuration-screen', 'simulation-screen', 'analysis-screen'].map(id => document.getElementById(id));
const tabs = ['tab-configure', 'tab-simulate', 'tab-analyze'].map(id => document.getElementById(id));
const screens = ['configure', 'simulate', 'analyze'];
const analyzer = mountAnalyzeScreen(document, {
  onReturn: () => navigate('simulate'),
  onFormat: format => simulator.setFormat(format),
  onNext() {
    const state = simulator.view();
    const access = state?.selectedAccess ?? state?.lastAccess;
    if (!access) return;
    if (access.number < state.history.length) simulator.selectAccess(access.number + 1);
    else if (!state.done) {
      simulator.nextAccess();
      const updated = simulator.view();
      if (updated.history.length > access.number) simulator.selectAccess(updated.lastAccess.number);
    }
    document.getElementById('analysis-event-title').focus({ preventScroll: true });
    window.scrollTo(0, 0);
  },
});
const simulator = mountSimulateScreen(document, {
  onConfigure: () => navigate('configure'), onAnalyze: () => navigate('analyze'),
  onChange(state) {
    setAvailable(2, Boolean(state?.history.length));
    analyzer.render(state);
  },
});

function setAvailable(index, available) {
  tabs[index].disabled = !available;
  if (available) tabs[index].parentElement.removeAttribute('aria-disabled');
  else tabs[index].parentElement.setAttribute('aria-disabled', 'true');
}
function navigate(screen) {
  const index = screens.indexOf(screen), state = simulator.view();
  if (index < 0 || (index > 0 && !state) || (index === 2 && !state.history.length)) return;
  simulator.pause();
  if (screen === 'analyze' && !state.selectedAccess) simulator.selectAccess(state.lastAccess.number);
  views.forEach((view, i) => { view.hidden = i !== index; });
  const main = document.querySelector('main');
  main.classList.toggle('is-simulating', screen === 'simulate');
  main.classList.toggle('is-analyzing', screen === 'analyze');
  tabs.forEach((tab, i) => {
    const selected = i === index;
    tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1;
    tab.parentElement.classList.toggle('current', selected);
    if (selected) tab.parentElement.setAttribute('aria-current', 'step'); else tab.parentElement.removeAttribute('aria-current');
  });
  const target = ['configurar', 'simulation-title', 'analysis-title'][index];
  const skip = document.querySelector('.skip-link');
  skip.textContent = ['Ir para a configuração', 'Ir para a simulação', 'Ir para a análise'][index];
  skip.href = `#${target}`;
  document.getElementById(target).focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

mountConfigureScreen(document, { sideSheet: sheet,
  onPrepared(input) { simulator.prepare(input); setAvailable(1, true); navigate('simulate'); },
  onInvalidated() { simulator.invalidate(); analyzer.render(null); setAvailable(1, false); setAvailable(2, false); },
});
tabs.forEach((tab, index) => tab.addEventListener('click', () => navigate(screens[index])));
document.querySelector('.stage-tabs').addEventListener('keydown', event => {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  const available = tabs.filter(tab => !tab.disabled);
  const index = available.indexOf(document.activeElement);
  if (index === -1) return;
  event.preventDefault();
  const next = event.key === 'Home' ? available[0] : event.key === 'End' ? available.at(-1) :
    available[(index + (event.key === 'ArrowRight' ? 1 : -1) + available.length) % available.length];
  next.click(); next.focus();
});

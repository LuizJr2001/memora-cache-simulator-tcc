import { mountConfigureScreen } from './configure-screen.js';
import { mountSimulateScreen } from './simulate-screen.js';
import { mountAccessComparison } from './access-comparison.js';
import { createSideSheet } from './side-sheet.js';

const sheet = createSideSheet(document);
const views = ['configuration-screen', 'simulation-screen'].map(id => document.getElementById(id));
const tabs = ['tab-configure', 'tab-simulate'].map(id => document.getElementById(id));
const screens = ['configure', 'simulate'];
const comparison = mountAccessComparison(document, {
  onOpen: () => simulator.pause(),
  onSelect: number => simulator.selectAccess(number),
});
const simulator = mountSimulateScreen(document, { onChange: state => comparison.render(state) });

function navigate(screen) {
  const index = screens.indexOf(screen), state = simulator.view();
  if (index < 0 || (index > 0 && !state)) return;
  simulator.pause();
  views.forEach((view, i) => { view.hidden = i !== index; });
  const main = document.querySelector('main');
  main.classList.toggle('is-simulating', screen === 'simulate');
  tabs.forEach((tab, i) => {
    const selected = i === index;
    tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1;
    tab.parentElement.classList.toggle('current', selected);
    if (selected) tab.parentElement.setAttribute('aria-current', 'step'); else tab.parentElement.removeAttribute('aria-current');
  });
  const target = ['configurar', 'simulation-title'][index];
  const skip = document.querySelector('.skip-link');
  skip.textContent = ['Ir para a configuração', 'Ir para a simulação'][index];
  skip.href = `#${target}`;
  document.getElementById(target).focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

const configuration = mountConfigureScreen(document, { sideSheet: sheet,
  onPrepared(input) { simulator.prepare(input); navigate('simulate'); },
  onInvalidated() { simulator.invalidate(); comparison.render(null); },
});
tabs.forEach((tab, index) => tab.addEventListener('click', () => {
  const state = simulator.view();
  if (index > 0 && !state) configuration.showNavigationWarning();
  else navigate(screens[index]);
}));
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


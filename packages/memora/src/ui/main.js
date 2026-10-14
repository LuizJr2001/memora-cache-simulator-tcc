import { mountConfigureScreen } from './configure-screen.js';
import { mountSimulateScreen } from './simulate-screen.js';
import { createSideSheet } from './side-sheet.js';

const sheet = createSideSheet(document);
const configureView = document.getElementById('configuration-screen');
const simulationView = document.getElementById('simulation-screen');
const tabs = [document.getElementById('tab-configure'), document.getElementById('tab-simulate')];
const simulator = mountSimulateScreen(document, { onConfigure: () => navigate('configure') });

function navigate(screen) {
  if (screen === 'simulate' && !simulator.view()) return;
  simulator.pause();
  configureView.hidden = screen !== 'configure'; simulationView.hidden = screen !== 'simulate';
  document.querySelector('main').classList.toggle('is-simulating', screen === 'simulate');
  tabs.forEach((tab, index) => {
    const selected = index === (screen === 'configure' ? 0 : 1);
    tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1;
    tab.parentElement.classList.toggle('current', selected);
    if (selected) tab.parentElement.setAttribute('aria-current', 'step'); else tab.parentElement.removeAttribute('aria-current');
  });
  const skip = document.querySelector('.skip-link');
  skip.textContent = screen === 'configure' ? 'Ir para a configuração' : 'Ir para a simulação';
  document.getElementById(screen === 'configure' ? 'configurar' : 'simulation-title').focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

mountConfigureScreen(document, { sideSheet: sheet,
  onPrepared(input) {
    simulator.prepare(input); tabs[1].disabled = false; tabs[1].parentElement.removeAttribute('aria-disabled');
    navigate('simulate');
  },
  onInvalidated() {
    simulator.invalidate(); tabs[1].disabled = true; tabs[1].parentElement.setAttribute('aria-disabled', 'true');
  },
});
tabs[0].addEventListener('click', () => navigate('configure'));
tabs[1].addEventListener('click', () => navigate('simulate'));
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

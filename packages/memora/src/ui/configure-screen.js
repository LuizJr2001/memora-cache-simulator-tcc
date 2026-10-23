import { DEFAULT_CONFIGURATION } from '../core/configuration.js';
import { DEFAULT_GENERATION_COUNT, MAX_ADDRESSES } from '../core/addresses.js';
import { createConfigurationController } from './configuration-controller.js';
import { createSideSheet } from './side-sheet.js';

const number = value => new Intl.NumberFormat('pt-BR').format(value);
const bits = value => `${value} ${value === 1 ? 'bit' : 'bits'}`;

export function mountConfigureScreen(document, { random = Math.random, onPrepared = () => {}, onInvalidated = () => {}, sideSheet } = {}) {
  const byId = id => document.getElementById(id);
  const form = byId('configure-form');
  const sheet = sideSheet ?? createSideSheet(document);
  const controller = createConfigurationController({ random, onInvalidated, onPrepared(input) {
    navigationAttempted = false;
    byId("navigation-warning").hidden = true;
    onPrepared(input);
    // Contrato para a próxima etapa; não cria cache nem executa acessos
    form.dispatchEvent(new document.defaultView.CustomEvent('memora:input-prepared', { detail: input, bubbles: true }));
  } });
  let sequenceEdited = false;
  let navigationAttempted = false;
  function renderNavigationWarning() {
    const view = controller.view();
    const warning = byId('navigation-warning');
    warning.hidden = !navigationAttempted;
    warning.textContent = !navigationAttempted ? '' : !view.canStart
      ? 'Configuração pendente. Complete ou corrija os campos destacados para continuar.'
      : 'Configuração pronta. Clique em Iniciar simulação para continuar.';
  }

  function setText(id, text) { if (byId(id).textContent !== text) byId(id).textContent = text; }
  function setValue(element, value) { if (element.value !== String(value)) element.value = value; }
  function feedback(field, message, error) {
    const target = byId(`${field}-feedback`);
    target.classList.toggle('error-text', Boolean(error));
    target.tabIndex = error ? 0 : -1;
    byId(field).setAttribute('aria-invalid', String(Boolean(error)));
    setText(`${field}-feedback`, error ? `⚠ ${error}` : message);
  }

  function render() {
    const view = controller.view();
    const { parameters, addresses, raw, preview } = view;
    const { configuration: c, layout: l, errors } = parameters;
    for (const field of Object.keys(DEFAULT_CONFIGURATION)) {
      if (!['ways', 'replacement'].includes(field)) setValue(byId(field), raw[field]);
    }
    setValue(byId('sequence'), view.sequence);
    const ways = byId('ways');
    const options = view.waysEditable ? [...new Set([...view.waysOptions, view.waysValue])] : [view.waysValue];
    const signature = options.join(',');
    if (ways.dataset.options !== signature) {
      ways.replaceChildren(...options.map(value => {
        const option = document.createElement('option'); option.value = value; option.textContent = value; return option;
      }));
      ways.dataset.options = signature;
    }
    setValue(ways, view.waysValue);
    ways.disabled = !view.waysEditable;
    setValue(byId('replacement'), view.replacementValue);
    byId('replacement').disabled = !view.replacementEditable;

    feedback('bytesPerCell', `Valor válido: ${raw.bytesPerCell} ${Number(raw.bytesPerCell) === 1 ? 'byte' : 'bytes'}`, errors.bytesPerCell);
    feedback('memoryCells', l ? `${bits(l.addressBits)} de endereço` : 'O total de células define o intervalo de endereços', errors.memoryCells);
    feedback('cellsPerBlock', l ? `${bits(l.offsetBits)} para deslocamento` : 'Defina a memória', errors.cellsPerBlock);
    feedback('cacheLines', l ? 'Capacidade compatível' : 'Defina a capacidade da cache', errors.cacheLines);
    feedback('mapping', '', errors.mapping);
    const wayHint = c ? c.mapping === 'direct' ? '1 via · valor fixo' :
      c.mapping === 'fully-associative' ? `${c.ways} vias · 1 conjunto · valor fixo` :
      `${c.ways} vias · ${l.setCount} conjuntos · valor ajustável` : 'Revise os parâmetros';
    feedback('ways', wayHint, errors.ways);
    feedback('replacement', raw.mapping === 'direct' ? 'Não se aplica ao mapeamento direto' :
      raw.replacement === 'LRU' ? 'Estado LRU visível na simulação' : 'A política escolhe a linha a substituir', errors.replacement);

    const showSequenceErrors = !addresses.ok && (sequenceEdited || view.sequence.length > 0);
    byId('sequence').setAttribute('aria-invalid', String(showSequenceErrors));
    const sequenceFeedback = byId('sequence-feedback');
    sequenceFeedback.className = `field-feedback ${addresses.ok ? 'success-text' : showSequenceErrors ? 'error-text' : ''}`;
    sequenceFeedback.replaceChildren();
    if (addresses.ok) {
      sequenceFeedback.textContent = `✓ ${addresses.addresses.length} ${addresses.addresses.length === 1 ? 'endereço válido' : 'endereços válidos'} · todos entre 0 e ${number(Number(raw.memoryCells) - 1)}`;
    } else if (showSequenceErrors) {
      const list = document.createElement('ul');
      for (const error of addresses.errors.slice(0, 5)) {
        const li = document.createElement('li'); li.textContent = `⚠ ${error.message}`; list.append(li);
      }
      if (addresses.errors.length > 5) {
        const li = document.createElement('li'); li.textContent = `Mais ${addresses.errors.length - 5} erros na sequência`; list.append(li);
      }
      sequenceFeedback.append(list);
    } else sequenceFeedback.textContent = 'Informe pelo menos um endereço para iniciar';

    const errorCount = Object.keys(errors).length + (showSequenceErrors ? addresses.errors.length : 0);
    const errorSummary = byId('error-summary');
    errorSummary.hidden = errorCount === 0;
    form.classList.toggle('has-errors', errorCount > 0);
    sequenceFeedback.tabIndex = showSequenceErrors ? 0 : -1;
    errorSummary.textContent = errorCount ? `⚠ ${errorCount} ${errorCount === 1 ? 'erro impede' : 'erros impedem'} a simulação — revise os campos indicados` : '';
    byId('prepare-input').disabled = !view.canStart;
    byId('open-generator').disabled = !parameters.ok;

    setText('configuration-status', !parameters.ok ? 'Configuração com erros' : view.preparedInput ?
      'Entrada preparada para simular' : view.canStart ? 'Configuração pronta para simular' : 'Configuração válida');
    setText('configuration-detail', l ? view.preparedInput ? `${view.preparedInput.addresses.length} endereços preparados para a próxima etapa` : !addresses.ok ? 'Informe endereços válidos para ver a prévia' :
      `${bits(l.addressBits)}: ${l.tagBits} para tag, ${l.indexBits} para ${c.mapping === 'direct' ? 'linha' : 'conjunto'} e ${l.offsetBits} para deslocamento` :
      'Corrija os campos destacados para continuar');
    setText('configuration-symbol', !parameters.ok ? '⚠' : view.canStart || view.preparedInput ? '✓' : '!');
    byId('configuration-symbol').classList.toggle('error-text', !parameters.ok);
    const mappingDescription = {
      direct: 'Mapeamento direto',
      'fully-associative': 'Mapeamento totalmente associativo',
      'set-associative': 'Mapeamento por conjunto',
    };
    setText('decomposition-mapping', mappingDescription[raw.mapping] ?? 'Selecione um mapeamento');
    const indexName = raw.mapping === 'direct' ? 'Linha' : 'Conjunto';
    for (const [part, label, width, value] of [
      ['tag', 'Tag', l?.tagBits, preview?.tag],
      ['index', indexName, l?.indexBits, preview?.set],
      ['offset', 'Deslocamento', l?.offsetBits, preview?.offset],
    ]) {
      setText(`${part}-value`, !l || width === 0 || value === undefined ? '—' : value.toString(2).padStart(width, '0'));
      setText(`${part}-label`, !l ? `${label} indisponível` : width === 0 ? `Sem bits de ${label.toLowerCase()}` : `${label} · ${bits(width)}`);
    }
    setText('preview-address', preview ? `Decomposição binária do primeiro endereço da sequência: ${preview.address}` : 'Os bits são calculados com os parâmetros válidos; os valores aparecem após informar endereços válidos');
    byId('note-ring').src = './src/assets/information-ring.svg';
    setText('note-symbol', 'i');
    byId('note-symbol').classList.remove('error-text');
    setText('note-text', 'As interrogações abrem ajuda contextual sem tirar você desta etapa');
    renderNavigationWarning();
    return view;
  }

  form.addEventListener('input', event => {
    const { name, value } = event.target;
    if (name === 'sequence') { sequenceEdited = true; controller.setSequence(value); }
    else if (Object.hasOwn(DEFAULT_CONFIGURATION, name)) controller.setField(name, value);
    else return;
    setText('action-status', '');
    render();
  });
  byId('load-example').addEventListener('click', () => {
    sequenceEdited = true; controller.loadExample(); render();
    setText('action-status', 'Exemplo didático carregado com 21 endereços');
  });
  form.addEventListener('submit', event => {
    event.preventDefault(); sequenceEdited = true;
    const result = controller.prepare(); render();
    if (result.ok) setText('action-status', `Entrada preparada com ${result.input.addresses.length} endereços`);
    else {
      const firstField = Object.keys(result.errors.fields)[0] ?? 'sequence';
      byId(firstField).focus();
    }
  });
  byId('open-generator').addEventListener('click', () => {
    sheet.open('Gerar endereços aleatórios', parent => {
      const generator = document.createElement('form');
      generator.noValidate = true;
      generator.className = 'generator-form';
      const hint = document.createElement('p');
      hint.textContent = `Defina uma quantidade entre 1 e ${number(MAX_ADDRESSES)}. Os endereços serão sorteados entre 0 e ${number(Number(controller.view().raw.memoryCells) - 1)} e substituirão o conteúdo de Endereços a acessar. Pode haver repetições`;
      const label = document.createElement('label');
      label.htmlFor = 'address-count'; label.textContent = 'Quantidade de endereços';
      const count = document.createElement('input');
      count.id = 'address-count'; count.type = 'text'; count.inputMode = 'numeric'; count.value = String(DEFAULT_GENERATION_COUNT);
      count.setAttribute('aria-describedby', 'generation-feedback');
      const message = document.createElement('p'); message.id = 'generation-feedback'; message.className = 'field-feedback'; message.setAttribute('role', 'status');
      const submit = document.createElement('button'); submit.type = 'submit'; submit.className = 'button-primary'; submit.textContent = 'Gerar endereços aleatórios';
      generator.append(hint, label, count, message, submit);
      generator.addEventListener('submit', event => {
        event.preventDefault();
        const result = controller.generate(Number(count.value.trim()) || NaN);
        if (!result.ok) {
          message.textContent = `⚠ ${result.message}`; message.classList.add('error-text');
          count.setAttribute('aria-invalid', 'true'); count.focus(); return;
        }
        sequenceEdited = true; render(); sheet.close();
        setText('action-status', `${result.view.addresses.addresses.length} endereços aleatórios inseridos em Endereços a acessar`);
      });
      parent.append(generator);
    });
  });
  render();
  return { ...controller, showNavigationWarning() { navigationAttempted = true; sequenceEdited = true; render(); } };
}

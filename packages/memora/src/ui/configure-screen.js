import { DEFAULT_CONFIGURATION } from '../core/configuration.js';
import { EXAMPLE_ADDRESSES, MAX_ADDRESSES } from '../core/addresses.js';
import { createConfigurationController } from './configuration-controller.js';
import { createSideSheet } from './side-sheet.js';

const number = value => new Intl.NumberFormat('pt-BR').format(value);
const bits = value => `${value} ${value === 1 ? 'bit' : 'bits'}`;

export function mountConfigureScreen(document, { random = Math.random, onPrepared = () => {} } = {}) {
  const byId = id => document.getElementById(id);
  const form = byId('configure-form');
  const sheet = createSideSheet(document);
  const controller = createConfigurationController({ random, onPrepared(input) {
    onPrepared(input);
    // Contrato para a próxima etapa; não cria cache nem executa acessos
    form.dispatchEvent(new document.defaultView.CustomEvent('memora:input-prepared', { detail: input, bubbles: true }));
  } });
  let sequenceEdited = false;

  function setText(id, text) { if (byId(id).textContent !== text) byId(id).textContent = text; }
  function setValue(element, value) { if (element.value !== String(value)) element.value = value; }
  function feedback(field, message, error) {
    const target = byId(`${field}-feedback`);
    target.classList.toggle('error-text', Boolean(error));
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
    feedback('cellsPerBlock', l ? `${bits(l.offsetBits)} para deslocamento` : 'Use um tamanho compatível com a memória', errors.cellsPerBlock);
    feedback('cacheLines', l ? 'Capacidade compatível' : 'Defina a capacidade da cache', errors.cacheLines);
    feedback('mapping', '', errors.mapping);
    const wayHint = c ? c.mapping === 'direct' ? '1 linha por conjunto · fixo no mapeamento direto' :
      c.mapping === 'fully-associative' ? `${c.ways} vias · todas as ${c.cacheLines} linhas · 1 conjunto · valor fixo` :
      `${c.ways} vias · ${l.setCount} conjuntos · valor ajustável` : 'Corrija os parâmetros para calcular os conjuntos';
    feedback('ways', wayHint, errors.ways);
    feedback('replacement', raw.mapping === 'direct' ? 'Cada bloco possui uma única linha possível' :
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
    byId('intro-description').hidden = errorCount > 0;
    form.classList.toggle('has-errors', errorCount > 0);
    sequenceFeedback.tabIndex = showSequenceErrors ? 0 : -1;
    errorSummary.textContent = errorCount ? `⚠ ${errorCount} ${errorCount === 1 ? 'erro impede' : 'erros impedem'} a simulação — revise os campos indicados` : '';
    const validate = byId('validate-parameters');
    validate.disabled = !parameters.ok;
    validate.textContent = !parameters.ok ? 'Corrija os erros para continuar' :
      view.parametersConfirmed ? 'Parâmetros validados ✓' : 'Validar parâmetros';
    byId('prepare-input').disabled = !view.canStart;
    byId('open-generator').disabled = !parameters.ok;

    setText('configuration-status', !parameters.ok ? 'Configuração com erros' : view.preparedInput ?
      'Entrada preparada para simular' : view.canStart ? 'Configuração pronta para simular' : 'Configuração válida · informe os endereços');
    setText('configuration-detail', l ? view.preparedInput ? `${view.preparedInput.addresses.length} endereços preparados para a próxima etapa` :
      `${bits(l.addressBits)}: ${l.tagBits} para tag, ${l.indexBits} para ${c.mapping === 'direct' ? 'linha' : 'conjunto'} e ${l.offsetBits} para deslocamento` :
      'Corrija os campos destacados antes de calcular a decomposição ou iniciar a simulação');
    setText('configuration-symbol', !parameters.ok ? '⚠' : view.preparedInput ? '✓' : '◇');
    byId('configuration-symbol').classList.toggle('error-text', !parameters.ok);
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
    const invalid = !parameters.ok || showSequenceErrors;
    byId('note-ring').src = invalid ? './src/assets/error-ring.svg' : './src/assets/information-ring.svg';
    setText('note-symbol', invalid ? '!' : 'i');
    byId('note-symbol').classList.toggle('error-text', invalid);
    setText('note-text', invalid ? 'Corrija os campos indicados para liberar a simulação' : raw.mapping === 'direct' ?
      'No mapeamento direto, cada bloco da memória principal possui uma única linha possível na cache' :
      'As interrogações abrem ajuda contextual sem tirar você desta etapa');
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
  document.querySelectorAll('[data-help]').forEach(button => {
    button.addEventListener('click', () => sheet.showHelp(button.dataset.help));
  });
  byId('load-example').addEventListener('click', () => {
    sequenceEdited = true; controller.loadExample(); render();
    setText('action-status', 'Exemplo didático carregado com 21 endereços');
  });
  byId('validate-parameters').addEventListener('click', () => {
    controller.validateParameters(); render(); setText('action-status', 'Parâmetros validados');
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
    sheet.open('Gerar endereços', parent => {
      const generator = document.createElement('form');
      generator.noValidate = true;
      generator.className = 'generator-form';
      const hint = document.createElement('p');
      hint.textContent = `Defina uma quantidade entre 1 e ${number(MAX_ADDRESSES)} para gerar endereços na memória configurada`;
      const label = document.createElement('label');
      label.htmlFor = 'address-count'; label.textContent = 'Quantidade de endereços';
      const count = document.createElement('input');
      count.id = 'address-count'; count.type = 'text'; count.inputMode = 'numeric'; count.value = String(EXAMPLE_ADDRESSES.length);
      count.setAttribute('aria-describedby', 'generation-feedback');
      const message = document.createElement('p'); message.id = 'generation-feedback'; message.className = 'field-feedback'; message.setAttribute('role', 'status');
      const submit = document.createElement('button'); submit.type = 'submit'; submit.textContent = 'Gerar endereços';
      generator.append(hint, label, count, message, submit);
      generator.addEventListener('submit', event => {
        event.preventDefault();
        const result = controller.generate(Number(count.value.trim()) || NaN);
        if (!result.ok) {
          message.textContent = `⚠ ${result.message}`; message.classList.add('error-text');
          count.setAttribute('aria-invalid', 'true'); count.focus(); return;
        }
        sequenceEdited = true; render(); sheet.close();
        setText('action-status', `${result.view.addresses.addresses.length} endereços gerados`);
      });
      parent.append(generator);
    });
  });
  render();
  return controller;
}

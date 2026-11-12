import { addressTokens, MAX_ADDRESSES, MAX_SEQUENCE_CHARACTERS, validateAddresses } from '../core/addresses.js';

export function validateAddressBlocks(values, memoryCells) {
  const sequence = values.join(', ');
  const combined = validateAddresses(sequence, memoryCells);
  if (!Number.isSafeInteger(memoryCells) || memoryCells < 1) return combined;
  const errors = values.flatMap((value, index) => {
    const one = validateAddresses(value, memoryCells);
    return !one.ok || one.addresses.length !== 1 ? [{ position: index + 1,
      message: `Endereço ${index + 1}: informe um único inteiro entre 0 e o limite da memória` }] : [];
  });
  return { ...combined, ok: combined.ok && errors.length === 0,
    errors: errors.length ? errors : combined.errors };
}

/** Edição opcional em rascunho: fechar sem aplicar conserva a sequência original. */
export function openAddressEditor(document, sheet, { sequence, memoryCells, onApply }) {
  sheet.open('Editar endereços em blocos', parent => {
    function element(tag, text, className) {
      const node = document.createElement(tag);
      if (text !== undefined) node.textContent = text;
      if (className) node.className = className;
      return node;
    }
    if (sequence.length > MAX_SEQUENCE_CHARACTERS) {
      parent.append(element('p', `A sequência excede ${MAX_SEQUENCE_CHARACTERS} caracteres. Reduza o texto antes de abrir o editor; nenhum endereço foi alterado.`));
      return;
    }
    const values = sequence.trim() ? addressTokens(sequence) : [''];
    if (values.length > MAX_ADDRESSES) {
      parent.append(element('p', `Use no máximo ${MAX_ADDRESSES} endereços. Reduza a sequência no campo de texto; nenhum endereço foi alterado.`));
      return;
    }
    const hint = element('p', 'Edite um endereço por bloco ou remova os que não precisar. Aplicar sequência atualiza o campo de texto; fechar sem aplicar descarta estas alterações.');
    const form = element('form'); form.noValidate = true;
    const blocks = element('div', undefined, 'address-blocks');
    const feedback = element('p', undefined, 'field-feedback');
    feedback.id = 'address-editor-feedback'; feedback.setAttribute('role', 'status');
    const actions = element('div', undefined, 'address-editor-actions');
    const add = element('button', 'Adicionar endereço'); add.type = 'button';
    const apply = element('button', 'Aplicar sequência'); apply.type = 'submit';
    let inputs = [];
    function validate() {
      const result = validateAddressBlocks(values, memoryCells);
      const positions = new Set(result.errors.map(error => error.position));
      inputs.forEach((input, index) => input.setAttribute('aria-invalid', String(positions.has(index + 1))));
      feedback.textContent = result.ok ? `✓ ${values.length} endereços válidos` : result.errors.slice(0, 3).map(error => error.message).join(' · ');
      feedback.classList.toggle('error-text', !result.ok);
      apply.disabled = !result.ok;
      add.disabled = values.length >= MAX_ADDRESSES;
      return result;
    }
    function render(focusIndex) {
      blocks.replaceChildren(); inputs = [];
      values.forEach((value, index) => {
        const block = element('div', undefined, 'address-block');
        const label = element('label', `Endereço ${index + 1}`);
        const input = element('input'); input.type = 'text'; input.inputMode = 'numeric';
        input.id = `address-block-${index + 1}`; input.value = value;
        input.setAttribute('aria-describedby', feedback.id); label.htmlFor = input.id;
        const remove = element('button', 'Remover'); remove.type = 'button'; remove.className = 'compact';
        remove.setAttribute('aria-label', `Remover endereço ${index + 1}`);
        input.addEventListener('input', () => { values[index] = input.value; validate(); });
        remove.addEventListener('click', () => {
          values.splice(index, 1);
          if (!values.length) values.push('');
          render(Math.min(index, values.length - 1));
        });
        inputs.push(input); block.append(label, input, remove); blocks.append(block);
      });
      validate(); if (focusIndex !== undefined) inputs[focusIndex]?.focus();
    }
    add.addEventListener('click', () => {
      if (values.length >= MAX_ADDRESSES) return;
      values.push(''); render(values.length - 1);
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!validate().ok) { inputs.find(input => input.getAttribute('aria-invalid') === 'true')?.focus(); return; }
      onApply(values.join(', ')); sheet.close();
    });
    actions.append(add, apply); form.append(blocks, feedback, actions); parent.append(hint, form); render();
  });
}

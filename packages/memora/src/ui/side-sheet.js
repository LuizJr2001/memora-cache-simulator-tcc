import { HELP_CONTENT } from './help-content.js';

export function createSideSheet(document) {
  const dialog = document.getElementById('side-sheet');
  const title = document.getElementById('sheet-title');
  const content = document.getElementById('sheet-content');
  const close = document.getElementById('close-sheet');
  let opener = null;
  let previousOverflow = '';

  function open(name, build, wide = false) {
    if (!dialog.open) {
      opener = document.activeElement;
      previousOverflow = document.body.style.overflow;
    }
    title.textContent = name;
    close.setAttribute('aria-label', `Fechar: ${name}`);
    dialog.classList.toggle('wide', wide);
    content.replaceChildren();
    build(content);
    content.scrollTop = 0;
    document.body.style.overflow = 'hidden';
    if (!dialog.open) dialog.showModal();
    dialog.dispatchEvent(new document.defaultView.CustomEvent('memora:help-open', { bubbles: true }));
    close.focus();
  }

  function paragraphs(parent, text, emphasize = false) {
    for (const block of text.split('\n\n')) {
      const p = document.createElement('p');
      block.split('\n').forEach((line, index) => {
        if (index) p.append(document.createElement('br'));
        const separator = line.indexOf(':');
        if (emphasize && separator > 0) {
          const strong = document.createElement('strong');
          strong.textContent = line.slice(0, separator + 1);
          p.append(strong, document.createTextNode(line.slice(separator + 1)));
        } else p.append(document.createTextNode(line));
      });
      parent.append(p);
    }
  }

  function card(parent, heading, text, emphasize = false) {
    const section = document.createElement('section');
    section.className = 'help-card';
    if (heading) {
      const h = document.createElement('h3');
      h.textContent = heading;
      section.append(h);
    }
    if (text) paragraphs(section, text, emphasize);
    parent.append(section);
    return section;
  }

  function showHelp(key) {
    const help = HELP_CONTENT[key];
    if (!help) return;
    open(help.title, parent => {
      if (key === 'glossary') {
        paragraphs(parent, 'Consulte os termos usados na configuração, simulação e análise');
        const list = document.createElement('dl');
        list.className = 'help-card glossary';
        for (const term of help.body[0].split('\n\n')) {
          const separator = term.indexOf(':');
          const entry = document.createElement('div');
          const dt = document.createElement('dt');
          const dd = document.createElement('dd');
          dt.textContent = term.slice(0, separator + 1);
          dd.textContent = term.slice(separator + 1).trim();
          entry.append(dt, dd);
          list.append(entry);
        }
        parent.append(list);
      } else if (key === 'quick') {
        const flow = card(parent, '', '');
        for (const step of help.body[0].split('\n\n')) {
          const [heading, text] = step.split('\n');
          const group = document.createElement('div');
          const h = document.createElement('h3');
          h.textContent = heading;
          group.append(h);
          paragraphs(group, text);
          flow.append(group);
        }
        flow.classList.add('quick-flow');
        const guidance = document.createElement('div');
        guidance.className = 'quick-guidance';
        paragraphs(guidance, 'Use ? para consultar um campo, “Como funciona?” para entender os parâmetros e o Glossário para ver definições');
        parent.append(guidance);
        const links = document.createElement('section');
        links.className = 'external-help';
        const h = document.createElement('h3');
        h.textContent = 'Ajuda externa';
        links.append(h);
        const actions = document.createElement('div');
        actions.className = 'external-actions';
        for (const [label, href] of [
          ['Abrir simulador original', 'https://simuladorcache.leandrogabriel.net/'],
          ['Abrir GitHub', 'https://github.com/LuizJr2001/memora-cache-simulator-tcc'],
        ]) {
          const a = document.createElement('a');
          a.className = 'button';
          a.textContent = `${label} ↗`;
          a.href = href;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.setAttribute('aria-label', `${label} — abre em nova aba`);
          actions.append(a);
        }
        links.append(actions);
        parent.append(links);
      } else {
        card(parent, 'Descrição', help.body[0], key === 'how');
        card(parent, 'Exemplo didático', help.body[1], key === 'how');
        if (key === 'lru') {
          const button = document.createElement('button');
          button.type = 'button'; button.dataset.help = 'glossary';
          button.className = 'sheet-glossary'; button.textContent = 'Abrir glossário completo';
          parent.append(button);
        }
      }
    }, ['how', 'glossary', 'quick'].includes(key));
  }

  close.addEventListener('click', () => dialog.close());
  document.addEventListener('click', event => {
    const button = event.target.closest?.('button[data-help]');
    if (button && !button.disabled) showHelp(button.dataset.help);
  });
  // Escape usa o evento cancel nativo do dialog; a restauração é comum a todas as saídas
  dialog.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    if (opener?.isConnected) opener.focus();
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right ||
        event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll('button:not(:disabled), a[href], input:not(:disabled), [tabindex="0"]')];
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  return { open, showHelp, close: () => dialog.close() };
}

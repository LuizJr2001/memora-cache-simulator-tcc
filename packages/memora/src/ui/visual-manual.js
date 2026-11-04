const sections = {
  configure: {
    label: 'Configurar',
    figures: [{
      title: 'Preparar um exemplo',
      image: 'configurar.png',
      alt: 'Tela Configurar com os parâmetros à esquerda e a sequência e a prévia do endereço à direita.',
      steps: [
        'Clique em Carregar exemplo didático para restaurar os parâmetros e endereços do exemplo.',
        'Confira a memória principal e a cache. Para repetir este exemplo, mantenha 1 byte por célula, 4.096 células, 16 células por bloco, 32 linhas e mapeamento Direto.',
        'No campo Endereços a acessar, substitua a sequência por 0, 1, 512, 513, 16.',
        'Na prévia da divisão do endereço, confira quantos bits correspondem à Tag, à Linha e ao Deslocamento. Os valores exibidos são os do primeiro endereço da sequência.',
        'Clique em Iniciar simulação para abrir Simular com os parâmetros escolhidos.',
      ],
    }],
  },
  simulate: {
    label: 'Simular',
    figures: [{
      title: 'Controlar a execução',
      image: 'simular-controles.png',
      alt: 'Controles da simulação em pausa após o primeiro acesso.',
      steps: [
        'Use Iniciar para reproduzir a sequência. O mesmo botão vira Pausar durante a execução e Continuar após a pausa.',
        'Use Próximo acesso para avançar um endereço ou Ir ao final para processar os acessos restantes.',
        'Ative Etapas detalhadas para acompanhar a decomposição do endereço, a consulta e a atualização da cache.',
        'Ajuste a Velocidade. Com etapas detalhadas, ela indica passos por segundo. No modo resumido, indica acessos por segundo.',
      ],
    }, {
      title: 'Ler os resultados',
      image: 'simular-resultado.png',
      alt: 'Simulação concluída com progresso 5 de 5, tabela de cache e histórico de acessos.',
      steps: [
        'Consulte Memória cache para ver as linhas e os blocos armazenados. V=0 indica uma linha vazia.',
        'O Histórico de acessos lista o resultado e a explicação de cada endereço, do mais recente ao mais antigo.',
        'Confira Progresso (finalizado), a indicação Concluído e os totais de acertos e faltas.',
      ],
    }, {
      title: 'Comparar uma substituição',
      image: 'simular-substituicao.png',
      alt: 'Detalhes do acesso 3 com o bloco removido, o novo bloco e os estados da linha antes e depois.',
      steps: [
        'Após concluir a sequência do exemplo, use Analisar abaixo do Nº 3 no histórico. O endereço 512 substitui o bloco 0–15 pelo bloco 512–527 na linha 0.',
        'Compare Sai da cache e Entra na cache com as tabelas Antes da substituição e Depois da substituição. Acesso anterior e Acesso seguinte percorrem os registros já processados.',
        'Use Voltar ao estado atual para retornar à execução com o progresso, o histórico e os totais preservados.',
      ],
    }],
  },
};

export function renderVisualManual(parent, initialStage) {
  const document = parent.ownerDocument;
  const nav = document.createElement('div');
  nav.className = 'manual-navigation';
  nav.setAttribute('role', 'group');
  nav.setAttribute('aria-label', 'Seções do manual');
  const guide = document.createElement('section');
  guide.className = 'manual-guide';
  const buttons = new Map();

  function show(stage) {
    for (const [key, button] of buttons) button.setAttribute('aria-pressed', String(key === stage));
    guide.replaceChildren();
    let number = 1;
    for (const { title, image, alt, steps } of sections[stage].figures) {
      const heading = document.createElement('h3');
      heading.textContent = title;
      const screenshot = document.createElement('img');
      screenshot.src = new URL(`../assets/manual/${image}`, import.meta.url).href;
      screenshot.alt = alt;
      const link = document.createElement('a');
      link.href = screenshot.src;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'Abrir captura em tamanho original (nova aba)';
      link.setAttribute('aria-label', `Abrir captura de “${title}” em tamanho original (nova aba)`);
      const list = document.createElement('ol');
      list.start = number;
      for (const step of steps) {
        const item = document.createElement('li');
        item.textContent = step;
        list.append(item);
      }
      number += steps.length;
      guide.append(heading, screenshot, link, list);
    }
  }

  for (const [key, { label }] of Object.entries(sections)) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.addEventListener('click', () => show(key));
    buttons.set(key, button);
    nav.append(button);
  }
  parent.append(nav, guide);
  show(initialStage);
}

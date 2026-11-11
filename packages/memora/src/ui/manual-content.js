// Manual da interface: imagens geradas por scripts/capture-manual.js.
// Usamos import.meta.url para manter as URLs válidas no build com assets versionados.
const image = filename => new URL(`../assets/manual/${filename}`, import.meta.url).href;

export const MANUAL_PAGES = {
  configure: {
    title: '1 · Configurar',
    introduction: 'Prepare um cenário didático antes de iniciar. Você pode preencher os parâmetros manualmente ou usar o exemplo pronto.',
    frames: [{
      image: image('configurar.png'),
      alt: 'Tela Configurar com marcadores 1 a 5: exemplo, memória, mapeamento, endereços e início.',
      caption: 'Cenário de referência: 4096 células, blocos de 16, cache de 32 linhas, 2 vias, LRU e 21 endereços.',
      steps: [
        ['Carregar exemplo didático', 'Use o botão no alto da tela para preencher automaticamente os campos com o cenário de referência.'],
        ['Conferir a memória e a cache', 'Verifique Bytes por célula, Total de células, Células por bloco e Número de linhas. Cada campo tem uma ajuda contextual (?).'],
        ['Escolher o mapeamento', 'Para o exemplo de substituição, utilize Por conjunto, 2 vias por conjunto e a política LRU.'],
        ['Editar endereços e conferir a prévia', 'Em Endereços a acessar, edite a sequência se desejar. A seção Como o endereço será dividido mostra Tag, Conjunto/Linha e Deslocamento.'],
        ['Iniciar simulação', 'Quando os dados forem válidos, clique em Iniciar simulação; a etapa Simular será aberta com a sequência carregada.'],
      ],
      markers: ['#load-example', '.memory-group', '#mapping', '#sequence', '#prepare-input'],
    }],
  },
  simulate: {
    title: '2 · Simular',
    introduction: 'A simulação conserva o ponto de execução e permite examinar cada acesso sem alterar os resultados.',
    frames: [{
      image: image('simular.png'),
      alt: 'Tela Simular com marcadores 1 a 6: reprodução, avanço, detalhes, velocidade, cache e histórico.',
      caption: 'Exemplo de execução após os primeiros acessos, com acertos, faltas e histórico visíveis.',
      steps: [
        ['Iniciar, pausar e continuar', 'Use Iniciar para reproduzir. Durante a reprodução, o mesmo botão permite Pausar; em seguida, Continuar retoma sem zerar os contadores.'],
        ['Avançar e ir ao final', 'Próximo acesso processa o próximo endereço; Ir ao final conclui a sequência. Reiniciar limpa o estado para uma nova execução.'],
        ['Ativar etapas detalhadas', 'A caixa Etapas detalhadas revela a decomposição do endereço, a busca, a decisão e a atualização da cache.'],
        ['Regular a velocidade', 'Mova o controle de velocidade para acompanhar as microetapas mais devagar ou mais rápido.'],
        ['Examinar a memória cache', 'A tabela apresenta validade, tag, bloco e, quando aplicável, a recência LRU de cada via.'],
        ['Consultar o histórico', 'Os acessos aparecem do mais recente ao mais antigo. Selecione Analisar abaixo de Nº N para abrir seus detalhes e o antes/depois.'],
      ],
      markers: ['#sim-play', '#sim-next', '#sim-detailed', '#sim-speed', '#cache-heading', '#history-heading'],
    }, {
      image: image('comparacao.png'),
      alt: 'Simulação com acesso 20 selecionado; o marcador 9 indica o retorno no cabeçalho de Memória cache.',
      caption: 'No cenário LRU, analisar o acesso 20 evidencia a substituição do bloco 992–1007 pelo bloco 3040–3055.',
      steps: [
        ['Analisar a substituição', 'No histórico, clique em Analisar no acesso Nº 20. A comparação abre junto da memória cache, mostrando o acesso selecionado.'],
        ['Comparar antes e depois', 'Confira Sai da cache e Entra na cache e as tabelas Antes da substituição e Depois da substituição. Use Acesso anterior/seguinte para navegar entre registros.'],
        ['Voltar ao estado atual', 'No cabeçalho de Memória cache, clique em Voltar ao estado atual para sair da análise e retomar a consulta da cache da execução. O progresso e os totais ficam preservados.'],
      ],
      markers: ['#history-table [data-review="20"]', '#access-comparison summary', '#show-live'],
      start: 7,
    }, {
      image: image('conclusao.png'),
      alt: 'Simulação concluída com marcador 10 no progresso finalizado e os totais preservados.',
      caption: 'Ao concluir os 21 acessos, o progresso mostra 21 / 21 e a simulação fica disponível para análise do histórico.',
      steps: [['Reconhecer a conclusão', 'O progresso indica 21 / 21 e o estado concluído. Os totais de acertos e faltas ficam visíveis; ainda é possível usar Analisar nos acessos já realizados.']],
      markers: ['#sim-progress'],
      start: 10,
    }],
  },
};

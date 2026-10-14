# Interface Memora

Esta pasta implementa Configurar e Simular, conforme a #35, em HTML/CSS e
módulos ES. A Tela 1 foi integrada à `main` pelo PR #43; a Tela 2 está na branch
`feature/35-tela-2`, em revisão no PR #44. Analisar tem entrega separada no PR #45.

Referência: [especificação v2](../../../../docs/prototipo-v2-especificacao.md)
e o Figma nela indicado. Refinamentos de UX são acompanhados na #37.
Os tokens SDS, Inter local, botões em Bold 700, campos retos e balões azuis
são compartilhados entre as duas telas.

## Configurar

`configuration-controller.js` mantém os dados editáveis e consome validação,
geração, decomposição e `prepareSimulationInput` de `src/core`, sem criar cache.
`configure-screen.js` apresenta os resultados e emite `memora:input-prepared`
somente com entrada válida. Aceita `onPrepared`, `onInvalidated`, `random` e um
`sideSheet` compartilhado. O controlador chama `onInvalidated` ao alterar os
dados; a integração descarta a simulação antiga até a próxima preparação.
Parâmetros e sequência são validados a cada edição, sem botão de confirmação
nem estado `parametersConfirmed`. A geração usa a memória atual e o início
revalida a entrada completa no núcleo antes de emitir o evento.

Erros ficam junto aos campos, com borda e texto específicos. O resumo global
é reservado a leitores de tela (`sr-only`, `role=status`, `aria-live=polite`),
sem banner vermelho redundante. O símbolo de Configuração com erros é
centralizado verticalmente, sem deslocar os textos.

A prévia binária identifica o primeiro endereço de uma sequência integralmente
válida; campos de zero bits usam traço. `#preview-label` identifica o endereço
em decimal e a descrição acessível conserva seu valor completo. Entrada inválida
mostra Prévia indisponível. Erros extensos têm rolagem local por teclado nas
larguras intermediárias, conforme o relatório da Tela 1.

## Simular

`simulation-controller.js` consome `createSimulation` e controla somente
relógio, preferências, estado de execução e acesso selecionado. Aceita
`random`, `schedule`, `cancel` e `onChange` para verificação determinística.
Seu token de geração invalida callbacks antigos após pausa, avanço manual,
reinício, troca de tela ou descarte da simulação.

- `play` alterna com `pause`; `stop` preserva o andamento e identifica a parada
- `restart` zera motor e seleção, preservando formato, velocidade e modo detalhado
- `nextStep` avança uma fase; `nextAccess` conclui somente o acesso pendente
- `setSpeed` aceita inteiros de 1 a 10; cada pulso avança uma fase ou um acesso
  conforme `setDetailed`
- `selectAccess` pausa e seleciona um registro existente; `showLive` retira a seleção
- `setFormat` muda apresentação sem reexecutar dados; `dispose` cancela o relógio

`simulate-screen.js` apresenta contadores, fases, endereço decomposto, cache
ocupada e histórico completo, com o acesso mais recente primeiro. Decimal/Binário
altera endereço, tag, conjunto/linha, deslocamento, intervalos e explicações;
estatísticas, número do acesso e via continuam decimais. Campos de zero bits
são identificados sem inventar bits.

LRU aparece apenas com mapeamento associativo e política LRU. A posição 1
significa mais recente; candidata só aparece quando não há via livre. A seleção
da vítima usa `lineBefore`; a linha inserida usa `lineAfter`. A execução e o
histórico preservam intervalos e estatísticas anteriores à mutação (#30).

O número do acesso é um botão de revisão: mostra a cache de `after`, sem mudar
os contadores atuais. O subtítulo explicita essa diferença. Voltar à execução
restaura o estado atual, sem avançar o motor. Revisar substituições filtra os
registros após a conclusão; Mostrar todos remove o filtro. Esses controles
funcionam na Tela 2. O botão Analisar e a terceira aba ficam desabilitados até a
próxima entrega, que consumirá os snapshots já disponíveis.

A cache é esparsa e apresenta somente linhas ocupadas. Cache e histórico têm
scroll local acessível por teclado. O desktop foi verificado sem scroll da
página nas quatro resoluções do relatório; larguras menores usam fluxo vertical.
Textos são inseridos via `textContent`, sem interpretar entrada como HTML.

## Navegação e ajuda compartilhadas

`main.js` prepara Simular e habilita a segunda aba somente com entrada válida.
Voltar para Configurar pausa a execução e preserva o estado enquanto não houver
edição. Setas, Home e End percorrem as abas disponíveis, com seleção e foco
visíveis. A preparação continua sem executar acessos automaticamente.

`side-sheet.js` usa `dialog` nativo com foco contido, Escape, botão de fechar,
scrim e retorno à origem. A delegação de `button[data-help]` atende também a
controles renderizados dinamicamente. Abrir ajuda em Simular pausa o relógio.
O evento `memora:help-open` comunica essa abertura; o Glossário aberto pela
ajuda LRU preserva o controle de origem para o retorno de foco.

`help-content.js` contém **14 ajudas estáticas** disponíveis nessas duas etapas:
8 campos de Configurar, Como funciona?, Glossário, Ajuda rápida, Estado LRU,
Memória cache e Histórico de acessos. Usa os textos visíveis da v2 e exemplos
fixos, inclusive a correção das vias do cenário. As quatro ajudas de Analisar
ficam para a próxima entrega.

Ver [relatório da Tela 2](../../docs/verificacao-tela-2.md): 58 testes Node e
67 cenários Chromium aprovados localmente, incluindo a regressão da Tela 1.

### Orientação ao navegar com configuração pendente

Simular e Analisar aceitam cliques e navegação por teclado mesmo antes de preparar a entrada. A tentativa mantém Configurar visível e mostra um aviso vermelho abaixo da introdução, indicando a configuração pendente sem repetir os nomes dos campos, que já apresentam destaque e legenda próprios. O aviso acompanha a edição e, com dados válidos, pede clicar em Iniciar simulação. A preparação bem-sucedida limpa o aviso. Analisar continua sem tela implementada nesta branch; com entrada preparada, informa essa disponibilidade.

No desktop, os grupos de parâmetros recebem espaço proporcional ao conteúdo: memória principal com peso 1 e cache com peso 2, incluindo maior separação entre as duas linhas de campos da cache.

Validação desta alteração: 58 testes Node aprovados e sintaxe de 22 arquivos verificada. Cenário Playwright adicionado para as abas e pendências; execução visual pendente porque o download do Chromium foi bloqueado/truncado no ambiente.

# Interface Memora

Esta pasta implementa Configurar, Simular e Analisar, conforme a #35, em
HTML/CSS e módulos ES. A Tela 3 está em `feature/35-tela-3`, baseada no
PR #44 (Tela 2). A Tela 1 foi integrada pelo PR #43 à `main`, agora base do PR #44.
A integração das telas 2 e 3 segue em revisão.

Referência: [especificação v2](../../../../docs/prototipo-v2-especificacao.md)
e o Figma nela indicado. Refinamentos de UX são acompanhados na #37.
Os tokens SDS, Inter local, botões em Bold 700, campos retos e balões azuis
são compartilhados entre as três telas.

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
funcionam na Tela 2. O botão Analisar e a terceira aba habilitam após o primeiro
acesso concluído e abrem o registro selecionado, ou o último concluído.

A cache é esparsa e apresenta somente linhas ocupadas. Cache e histórico têm
scroll local acessível por teclado. O desktop foi verificado sem scroll da
página nas quatro resoluções do relatório; larguras menores usam fluxo vertical.
Textos são inseridos via `textContent`, sem interpretar entrada como HTML.

## Analisar

`analysis-model.js` projeta o acesso selecionado, ou o último concluído, sem
chamar o motor ou sortear outra vítima. `createAnalysisModel(state)` retorna
`null` sem acesso concluído e, nos demais casos, acesso, configuração, layout,
tipo (`hit`, `free`, `replacement`), relevância do LRU, linhas antes/depois e
possibilidade de avançar. O acesso selecionado prevalece sobre a etapa pendente.

As linhas são filtradas pelo conjunto consultado; uma vaga escolhida ainda
vazia é representada por uma única linha com `line: null`. Não há criação de
linhas vazias proporcionais ao tamanho da configuração. A recência é derivada
separadamente de cada snapshot, sem alterar os registros.

`analyze-screen.js` apresenta evento, decomposição, dois quadros, Sai/Entra e
quatro passos. Narrativas usam `reason`, `lineBefore` e `lineAfter` gravados;
acertos e cargas em vaga livre não são chamados de substituição. LRU só aparece
quando aplicável. Os exemplos das quatro ajudas continuam fixos.

`main.js` integra análise ao mesmo controlador de Simular. Próximo acesso seleciona
o registro seguinte já existente; somente no fim do histórico chama `nextAccess`
e seleciona o novo registro concluído. Uma etapa pendente é concluída uma única
vez, sem duplicação. No fim da sequência, o botão é desabilitado. A troca de
formato e de abas preserva a seleção; voltar a Simular não retoma o relógio.
Editar a configuração ou reiniciar remove a disponibilidade da análise antiga.

As tabelas têm scroll local e cabeçalhos fixos. Valores binários são completos,
com intervalos inicial–final, como em Simular; blocos de uma célula usam um único
valor. Resumos evitam repetir intervalos extensos, mantendo os dados nas tabelas
e nos cartões. O layout compacto preserva ações e rodapé em 1280 × 720.

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

`help-content.js` contém **18 ajudas estáticas**: 8 campos de Configurar,
Como funciona?, Glossário, Ajuda rápida, Estado LRU, Memória cache, Histórico
de acessos e as quatro de Analisar: Decisão de substituição, Estado antes ×
depois, LRU na decisão e Decomposição do endereço. Usa os textos visíveis da
v2, com exemplos fixos e identificação das vias coerente com a execução.

Ver [relatório da Tela 3](../../docs/verificacao-tela-3.md): 65 testes Node e
89 cenários Chromium aprovados localmente, com a regressão das três telas.

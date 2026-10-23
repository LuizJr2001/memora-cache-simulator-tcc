# Interface Memora

Esta pasta implementa Configurar, Simular e Analisar, conforme a #35, em
HTML/CSS e módulos ES. As três telas estão integradas à `main` pelos PRs
#43 (Configurar), #44 (Simular) e #45 (Analisar), desde 14/10/2026.

Referência: [especificação v2](../../../../docs/prototipo-v2-especificacao.md)
e o Figma nela indicado. Refinamentos de UX são acompanhados na #37.
Os tokens SDS, Inter local, botões em Bold 700, campos retos e balões azuis
são compartilhados entre as três telas.

## Configurar

O controlador abre com `DEFAULT_CONFIGURATION` e `DEFAULT_ADDRESSES`: cenário
direto do Beto, com os 21 acessos preenchidos. FIFO permanece selecionado e
desabilitado no direto; o núcleo normaliza a política para `null`. Ao trocar
para um mapeamento associativo, a preferência FIFO fica editável. O gerador
usa `DEFAULT_GENERATION_COUNT = 32`. Carregar exemplo didático restaura
`DEFAULT_CONFIGURATION` e `DEFAULT_ADDRESSES`, os mesmos valores da abertura,
e invalida qualquer entrada preparada. O cenário associativo de referência
é configurado explicitamente nos testes de políticas. Ver
[valores iniciais](../../README.md#configuração-inicial).

`configuration-controller.js` mantém os dados editáveis e consome validação,
geração, decomposição e `prepareSimulationInput` de `src/core`, sem criar cache.
`configure-screen.js` apresenta os resultados e emite `memora:input-prepared`
somente com entrada válida. Aceita `onPrepared`, `onInvalidated`, `random` e um
`sideSheet` compartilhado. O controlador chama `onInvalidated` ao alterar os
dados; a integração descarta a simulação antiga até a próxima preparação.
Parâmetros e sequência são validados a cada edição, sem botão de confirmação
nem estado `parametersConfirmed`. **Gerar endereços aleatórios** usa a memória
atual e substitui **Endereços a acessar**, com possíveis repetições. O painel
informa a quantidade permitida, o intervalo de valores e a substituição da
sequência. O início revalida a entrada completa no núcleo antes de emitir o evento.

Erros ficam junto aos campos, com borda e texto específicos. O resumo global
é reservado a leitores de tela (`sr-only`, `role=status`, `aria-live=polite`),
sem repetir a lista de campos no aviso de navegação. O símbolo de Configuração com erros é
centralizado verticalmente, sem deslocar os textos.

A prévia binária usa o primeiro endereço de uma sequência integralmente
válida; campos de zero bits usam traço. A origem permanece na descrição acessível
`#preview-address`, sem um rótulo visível de Primeiro endereço. Entrada inválida
limpa os valores dos cartões. Erros extensos têm rolagem local por teclado nas
larguras intermediárias, conforme o relatório da Tela 1.

`#decomposition-mapping` identifica o mapeamento atual. Os cartões mostram Tag/Linha/Deslocamento no
direto, Tag/Conjunto/Deslocamento por conjunto e Tag/Deslocamento no totalmente
associativo. O título é COMO O ENDEREÇO SERÁ DIVIDIDO DE ACORDO COM O MAPEAMENTO.
A linha de contexto mostra o mapeamento. A descrição acessível é associada aos
cartões por `aria-describedby` e atualizada
com os parâmetros. O rodapé e Como funciona?
identificam o Memora como aprimoramento do simulador educacional Beto;
a licença do código permanece MIT.

`#open-generator` fica em `.sequence-field-actions`, antes da ajuda do campo
Endereços a acessar, com 16 px entre os controles. Em telas pequenas,
o grupo pode ir para a linha abaixo do rótulo. `.sequence-actions` contém apenas
`#prepare-input`, ocupando 100% da largura disponível e com o texto centralizado. O gerador mantém o mesmo
listener, a validação e o retorno de foco após fechar o painel.

## Simular

`simulation-controller.js` consome `createSimulation` e controla somente
relógio, preferências, estado de execução e acesso selecionado. Aceita
`random`, `schedule`, `cancel` e `onChange` para verificação determinística.
Seu token de geração invalida callbacks antigos após pausa, avanço manual,
reinício, troca de tela ou descarte da simulação.

- `play` alterna com `pause`; `stop` preserva o andamento e identifica a parada
- `restart` zera motor e seleção, preservando formato, velocidade e modo detalhado
- `nextStep` avança uma fase no modo detalhado ou um acesso no resumido;
  `nextAccess` conclui somente o acesso pendente
- `setSpeed` aceita inteiros de 1 a 10; cada pulso avança uma fase ou um acesso
  conforme `setDetailed`
- `selectAccess` pausa e seleciona um registro existente; `showLive` retira a seleção
- `setFormat` muda apresentação sem reexecutar dados; `dispose` cancela o relógio

`simulate-screen.js` apresenta contadores, fases, endereço decomposto, cache
completa e histórico, com o acesso mais recente primeiro. Decimal/Binário
altera endereço, tag, conjunto/linha, deslocamento, intervalos e explicações;
estatísticas, número do acesso e via continuam decimais. Campos de zero bits
são identificados sem inventar bits.

LRU aparece apenas com mapeamento associativo e política LRU. A posição 1
significa mais recente; candidata só aparece quando não há via livre. A seleção
da vítima usa `lineBefore`; a linha inserida usa `lineAfter`. A execução e o
histórico preservam intervalos e estatísticas anteriores à mutação (#30).

O número do acesso é um botão de revisão: mostra a cache de `after`, sem mudar
os contadores atuais. O subtítulo explicita essa diferença. Voltar à execução
restaura o estado atual, sem avançar o motor. Ao terminar, o controle de reprodução
mostra ✓ Concluído em verde e permanece desabilitado, sem um balão separado.
Reiniciar restaura a aparência inicial. O histórico permanece completo.
A terceira aba abre a análise do acesso selecionado ou do último concluído.
Antes do primeiro acesso, orienta a iniciar/avançar na própria Tela 2.

O motor mantém a cache esparsa; a interface apresenta também linhas vazias com V=0 e células de cada bloco. Cache e histórico têm
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

`main.js` prepara o conteúdo de Simular somente com entrada válida; as abas
aceitam navegação antes da preparação para orientar sobre a pendência.
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

Ver [revisão geral do PR #44](../../docs/revisao-pr44.md): 68 testes Node e
74 cenários Chromium aprovados localmente, incluindo a regressão da Tela 1.

### Orientação ao navegar com configuração pendente

Simular e Analisar aceitam cliques e navegação por teclado mesmo antes de preparar a entrada. A tentativa mantém Configurar visível e mostra um aviso vermelho abaixo da introdução, indicando a configuração pendente sem repetir os nomes dos campos, que já apresentam destaque e legenda próprios. O aviso acompanha a edição e, com dados válidos, pede clicar em Iniciar simulação. A preparação bem-sucedida limpa o aviso. Com entrada preparada e nenhum acesso concluído, o aviso vermelho pede processar o primeiro acesso e mantém Simular ativa. Após concluir um acesso, Analisar abre os snapshots reais. Iniciar/Continuar, Próxima etapa ou Próximo acesso removem o aviso; uma nova preparação também o limpa.

No desktop, os grupos de parâmetros recebem espaço proporcional ao conteúdo: memória principal com peso 1 e cache com peso 2, incluindo maior separação entre as duas linhas de campos da cache.

As pendências, seus avisos e os refinamentos do layout foram incluídos na suíte
completa de Configurar e na revisão geral do PR #44.

### Etapas detalhadas — revisão de 14/10/2026

A opção afeta tanto a reprodução automática quanto o avanço manual: marcada percorre as seis fases; desmarcada conclui um acesso por avanço. O botão passa a indicar Avançar acesso no modo resumido. Trocar de modo durante um acesso conclui apenas a entrada pendente, sem duplicar estatísticas. A taxa indica etapas/segundo ou acessos/segundo conforme o modo, com valor inicial 5.

O modo detalhado mostra o endereço binário dividido em Tag, Linha/Conjunto e Deslocamento, um roteiro das seis fases e a explicação da fase atual. Durante a consulta, as tags coincidentes e diferentes recebem destaques próprios. O roteiro tem rolagem local e acompanha a fase, sem rolar a página. Ao revisar um acesso, usa o snapshot original. O modo resumido esconde o roteiro e mantém as descrições do histórico.

As explicações incluem validade e comparação de tags, primeiro acesso ao bloco (falta compulsória), linha livre, critérios FIFO/LRU/Random e os blocos anterior/novo. Uma releitura de bloco removido não é rotulada como compulsória. As explicações são derivadas dos dados do motor, sem executar novamente a cache. O detalhamento não altera políticas, resultados ou contagens.


### Cache completa e células — revisão de 14/10/2026

A tabela mostra todas as 32 linhas do exemplo, incluindo vias vazias (V=0, tag sem valor e células com —). Linhas carregadas mantêm o intervalo e mostram os endereços de cada célula da memória principal, com a célula do acesso atual destacada. A revisão de histórico usa o snapshot after e restaura as células do acesso revisado sem alterar as estatísticas.

Caches com mais de 128 linhas usam páginas de até 128 linhas, botões Anteriores/Próximas e Ir à linha (índice a partir de 0). A execução acompanha a página da linha consultada. Blocos maiores que 16 células têm navegação por janelas de 16, iniciando na janela do deslocamento atual. Valores em binário não são quebrados dentro das células; rolagem horizontal local permite ler o número completo. As áreas têm foco por teclado.

A representação continua usando endereços das células, como o Beto, e não valores arbitrários de bytes. Vias vazias só existem na apresentação; o motor e os snapshots continuam esparsos e imutáveis. A contagem de linhas usadas inclui apenas linhas válidas.

As setas de navegação das células preservam o foco do teclado após redesenhar
a tabela; ao atingir um limite do bloco, o foco segue para a seta disponível.
Preparar uma nova simulação limpa o campo Ir à linha e seu aviso anterior.

Verificação atual: 68 testes Node e 74 cenários Chromium (45 Configurar e 29
Simular). Layout, formatos, revisão, substituição, avisos e navegação em
configurações grandes verificados; desktop sem scroll da página nas quatro
resoluções existentes. Capturas atuais no relatório de revisão geral.

A tela Simular mantém a explicação de cada acesso no histórico, sem uma faixa visual de status duplicada abaixo dos controles. O status continua anunciado por leitores de tela; erros de execução permanecem visíveis. O conjunto/linha em foco continua indicado no cabeçalho da cache.


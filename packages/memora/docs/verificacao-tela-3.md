# Verificação da Tela 3 — Analisar

Data: **14/10/2026**. Branch `feature/35-tela-3`, baseada no commit
`4d9c3eafc3139004dc92ee2c0614c6c700130f69` da Tela 2,
[PR #44](https://github.com/LuizJr2001/memora-cache-simulator-tcc/pull/44), que
depende da Tela 1 do [PR #43](https://github.com/LuizJr2001/memora-cache-simulator-tcc/pull/43).
Os PRs estão em revisão; a entrega não foi integrada à `main` ou publicada.

Rastreabilidade: #35 (interface), #28 (LRU), #30 (bloco anterior), #31
(regressão), #37 (UX) e #22 (planejamento). A avaliação externa #33 continua
em paralelo; testes automatizados não representam aprovação dos participantes.

## Referência e implementação

Fonte: [Tela 3 na v2 do Figma](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-6473),
seção Analisar `311:6465`. Foram consultadas a tela principal, a variante
Decimal/Binário `311:7318` e as quatro ajudas: `311:6786`, `311:6956`,
`311:7126` e `311:7296`.

A implementação usa HTML/CSS e módulos ES do mesmo pacote Memora. Reutiliza
abas, botões, Card/side sheet, tokens SDS e Inter local em vez de introduzir
React/Tailwind ou novas dependências. Os textos visíveis dos slots de ajuda
prevalecem sobre propriedades antigas de exemplo no Code Connect.
Todos os rótulos de ações/abas usam Inter em peso 700.

A marca é o mesmo asset `memora.png`: preenchimentos dos nós `311:6476` e
`311:17` conferidos como idênticos, arquivo local não vazio e slot renderizado
em **30 × 30 px**. Não há outro asset estático novo na Tela 3. Os ícones de
ajuda/fechar e passos seguem os componentes nativos já usados no projeto.

`analysis-model.js` projeta o registro escolhido e seus dois snapshots, sem
executar acessos. `analyze-screen.js` apresenta os resultados; `main.js` liga
essa tela ao controlador existente de Simular. O código executável do núcleo,
os arquivos do Beto e a licença foram preservados.

## Comportamentos entregues

| Parte | Comportamento |
|---|---|
| Disponibilidade | Aba/botão Analisar habilitam após o primeiro acesso concluído |
| Acesso selecionado | Usa a seleção do histórico, ou o último concluído; não usa dados incompletos da microetapa pendente |
| Evento e decomposição | Endereço, resultado, tag, conjunto/linha, deslocamento e quantidade de bits |
| Antes e Depois | Snapshots independentes do conjunto consultado, validade, tag, bloco, recência aplicável e decisão |
| Sai/Entra | Bloco anterior preservado; bloco carregado identificado; acerto/linha livre sem remoção fictícia |
| Quatro passos | Localizar, verificar acerto, aplicar política/manter/usar vaga e atualizar |
| Políticas | LRU, FIFO e Random usam a decisão gravada; direto explica a única posição possível |
| Próximo acesso | Primeiro percorre registros salvos; somente no fim do histórico conclui um novo acesso |
| Navegação | Três abas, retorno a Simular, setas/Home/End, foco de entrada e após avanço |
| Formato | Decimal/Binário compartilhado; endereço, partes, blocos e explicações convertidos |
| Ajuda | Quatro side sheets estáticos, com Descrição e Exemplo didático, Escape e retorno de foco |

Entrar em Analisar pausa o relógio. Voltar a Simular preserva seleção e
andamento, sem retomar automaticamente a execução. Editar a configuração
invalida a análise anterior; reiniciar zera a disponibilidade até outro acesso
ser concluído. O botão Próximo acesso fica desabilitado no último registro
quando toda a sequência já foi processada.

A revisão não altera estatísticas nem sorteia outra vítima Random. Quando uma
microetapa está pendente, a análise ainda mostra o último registro completo;
ao solicitar outro acesso no fim do histórico, conclui apenas o pendente.
Os testes cobrem inclusive a fase em que a cache já foi atualizada, mas o
acesso ainda não foi contabilizado.

As tabelas mostram as vias ocupadas do conjunto consultado. Uma vaga escolhida
na carga inicial é projetada como uma única linha Válido 0 no quadro Antes;
Depois contém a linha real. Não há materialização de todas as vias vazias de
uma configuração enorme. As tabelas usam rolagem local com cabeçalho fixo.

## Cenário didático e correção do Figma

Configuração: 4096 células, 1 byte/célula, blocos de 16, 32 linhas, 2 vias e LRU.
A sequência mantém os 21 endereços do exemplo da v2.

| Registro analisado | Resultado esperado e obtido |
|---|---|
| 19 · 2018 | ACERTO; via 2 fica mais recente; nenhum bloco removido ou carregado |
| 20 · 3044 · Antes | Via 1: 992–1007, tag 3, menos recente, SUBSTITUIR; via 2: 2016–2031, tag 7, Manter |
| 20 · 3044 · Depois | Via 1: 3040–3055, tag 11, mais recente, Inserida; via 2 mantida |
| 21 · 96 | FALTA em vaga livre; carrega 96–111, sem remover um bloco |
| Após concluir e revisar | Permanecem 12 acertos, 9 faltas, 57,1%, 8/32 linhas e 21 registros |

A identificação das vias já corrigida em Simular foi reconciliada em Analisar:
**58 textos visíveis** da seção, incluindo tela principal, variantes, fundos
das ajudas, resumos, referências binárias e exemplos de Antes × depois/LRU.
A via 1 contém o bloco 992–1007 antes do acesso 20; a via 2 contém 2016–2031.
O estilo, a geometria, a ajuda geral e a V1.2 foram preservados; a tela
principal foi conferida visualmente após a correção.

Os números de via são ordinais, sem confundir com a posição LRU. A posição 1
significa mais recente. LRU e suas ajudas de coluna não aparecem com direto,
FIFO ou Random. Os exemplos dos side sheets são fixos, mesmo após avançar
para outro acesso.

## Verificação executada

Ambiente local: **Node 24.19.0**, **Playwright 1.64.0** e
**Chromium 153.0.8010.0**, em modo headless. Comandos na raiz:

```bash
npm ci
npm run check
npm test
npx playwright install chromium
npm run test:ui --workspace @memora/simulator
```

Neste ambiente foi usado Chromium já instalado via `MEMORA_CHROMIUM_PATH`.
`MEMORA_ANALYSIS_SCREENSHOT_DIR` define a pasta opcional das capturas de Analisar.
As variáveis das telas anteriores continuam disponíveis.

| Verificação | Resultado |
|---|---|
| Sintaxe | **26 arquivos JavaScript** aprovados |
| Node | **65/65**: 58 existentes e 7 da projeção de análise |
| Chromium | **89/89**: 45 de Configurar, 22 de Simular e 22 de Analisar |

Após a regressão completa, os 22 cenários de Analisar passaram novamente com
um ajuste de resumo/layout para dados de 52 bits e uma verificação explícita
contra sobreposição entre descrições e tabelas. Os intervalos completos
permanecem nos dados; blocos de uma célula usam um único valor.

A cobertura inclui seleção durante microetapa, ordem dos snapshots, acerto,
linha livre, substituição, FIFO/Random/direto, conversão de formato, pausa,
navegação, mudança da configuração, reinício, exemplos estáticos, Escape/foco,
52 bits, campos de zero bits e muitas vias. O teste Random conta os sorteios:
revisar, mudar formato e avançar por registros existentes mantém a mesma
quantidade de chamadas, sem escolher a vítima outra vez.

Desktop: **1280 × 720, 1366 × 768, 1480 × 742 e 1920 × 1080**, nos estados
de substituição decimal/binária, acerto histórico e última carga. A página
não exige scroll nesses cenários, não oculta seu overflow e mantém ações e
rodapé no viewport. Tabelas com muitas vias rolam localmente por teclado.

Larguras **1024, 801, 768, 390 e 320 px**: fluxo vertical quando necessário,
sem overflow horizontal da página; tabelas e side sheets mantêm rolagem própria.
O caso de 52 bits preserva todos os dígitos e os rótulos de campos sem bits.
A ausência de sobreposição é medida e foi conferida visualmente.

Os resultados são locais, sem declarar execução de CI remota, avaliação com
participantes, auditoria completa WCAG ou cobertura de outros navegadores.

## Capturas

As 16 capturas foram produzidas pela suíte. Tela principal, binário, desktop
compacto, ajuda LRU, mobile e limite de 52 bits foram inspecionados visualmente.

| Estado | Captura |
|---|---|
| Substituição LRU · 1280 × 900 | [Abrir](screenshots/tela-3/substituicao-lru.png) |
| Primeira carga · vaga livre | [Abrir](screenshots/tela-3/primeira-carga.png) |
| Acerto histórico · acesso 19 | [Abrir](screenshots/tela-3/acerto-historico.png) |
| Último acesso · 21 | [Abrir](screenshots/tela-3/ultimo-acesso.png) |
| Binário | [Abrir](screenshots/tela-3/formato-binario.png) |
| Direto | [Abrir](screenshots/tela-3/politica-direto.png) |
| FIFO | [Abrir](screenshots/tela-3/politica-fifo.png) |
| Random · revisão sem novo sorteio | [Abrir](screenshots/tela-3/politica-random.png) |
| Ajuda · LRU na decisão | [Abrir](screenshots/tela-3/ajuda-lru-na-decisao.png) |
| Desktop · 1280 × 720 | [Abrir](screenshots/tela-3/desktop-1280x720.png) |
| Desktop · 1366 × 768 | [Abrir](screenshots/tela-3/desktop-1366x768.png) |
| Desktop · 1480 × 742 | [Abrir](screenshots/tela-3/desktop-1480x742.png) |
| Desktop · 1920 × 1080 | [Abrir](screenshots/tela-3/desktop-1920x1080.png) |
| Mobile · 390 px | [Abrir](screenshots/tela-3/mobile-binario.png) |
| Endereço de 52 bits · 1280 × 720 | [Abrir](screenshots/tela-3/endereco-52-bits.png) |
| Muitas vias · scroll local | [Abrir](screenshots/tela-3/muitas-vias.png) |

## Continuidade

As três telas e as 18 ajudas estão implementadas nas branches em revisão.
A próxima etapa é revisar/integrar as dependências, consolidar a avaliação e
incorporar os retornos. Publicação, escrita/dirty bit, exportação e comparação
entre configurações não fazem parte desta entrega. As issues permanecem
abertas até os respectivos critérios de integração/avaliação serem cumpridos.

# Tela 1 — Configurar: verificação da entrega

Data: 12/10/2026 · Refs #35 e #37

A interface está restrita a `packages/memora`, com a atualização do lockfile na raiz.
O núcleo do PR #41 e os arquivos executáveis do Beto foram preservados.

## Referências e escopo

- [Tela 1](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-14)
- [Página v2](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-2)
- [Direto](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-1354), [totalmente associativo](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-1474), [por conjunto](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-1594) e [casos inválidos](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-1225)
- [Especificação v2](../../../docs/prototipo-v2-especificacao.md) e [decisão SDS](../../../docs/decisoes/002-simple-design-system.md)

Os campos e a sequência usam as validações existentes. A geração recebe a
memória configurada no momento da ação; vias e substituição apresentam os valores
normalizados pelo núcleo. A prévia binária decompõe o primeiro endereço válido.

As 8 ajudas de campo, Como funciona?, Glossário e Ajuda rápida usam os textos
visíveis da v2. Foram consultados os textos dos slots dos Cards, porque as
propriedades de Code Connect ainda apresentavam conteúdo anterior. A ajuda
continua estática mesmo quando a memória e os endereços são alterados.

Iniciar simulação chama `prepareSimulationInput`. O callback `onPrepared` e o
evento `memora:input-prepared` entregam a entrada imutável. A confirmação fica na
Tela 1, e editar dados invalida a entrada preparada. As etapas Simular e Analisar
aparecem sem navegação ativa. Esta entrega não executa cache ou políticas.

Adaptações para funcionamento: sequência inicialmente vazia; diálogo de geração
com quantidade; resumo de erros sob o título, substituindo a descrição enquanto
houver erros; painéis empilhados em telas menores.

Na revisão de 12/10, os três campos de memória principal passaram a ocupar uma
linha, o cabeçalho ficou com 52 px e foram reduzidos os intervalos entre os grupos.
A Tela 1, suas variantes SDS e as telas de fundo das ajudas no Figma usam
1280 × 720. Os 40 cabeçalhos da v2 oferecem apenas Glossário e Ajuda rápida;
Abrir GitHub permanece na ajuda. A V1.2 foi preservada.

O código adapta os intervalos à altura disponível. Validações usam espaço mais
compacto sem reduzir a fonte. Mensagens extensas da sequência têm rolagem local
com foco e PageDown, preservando o texto completo e as ações visíveis.

## Resultados

Ambiente: Node.js 24.19.0, Playwright 1.64.0 e Chromium 153.0.8010.0, Linux.

| Verificação | Resultado |
|---|---|
| `npm ci` | Instalação pelo lockfile concluída |
| `npm run check` | 16 arquivos JavaScript com sintaxe válida |
| `npm test` | 37 testes passaram: 28 existentes + 9 do controlador |
| `npm run test:ui --workspace @memora/simulator` | 18 cenários passaram no Chromium |
| `git diff --check` | Sem problemas de whitespace |
| Diff dos três arquivos do Beto e de `src/core` | Sem alterações |

Os cenários de navegador cobrem exemplo, três mapeamentos, alteração das vias,
troca de política, geração após editar memória, mensagens e bloqueio, preparação,
zero bits, entradas coladas acima dos limites, conteúdo seguro, operação por
teclado, as 11 ajudas, contenção/restauração de foco e fechamento por Escape,
botão e scrim. A página inteira foi verificada sem rolagem em 1280 × 720,
1366 × 768, 1480 × 742 e 1536 × 864: estado inicial, exemplo, três mapeamentos,
erros simultâneos, quatro parâmetros vazios e mensagens extensas. Os testes
medem os limites dos controles e a altura real do documento, sem ocultar o
overflow da página. O link GitHub foi conferido apenas na Ajuda rápida.
Foram verificados layouts de 768, 390 e 320 px, sem scroll horizontal ou
sobreposição entre os painéis. Inter local, peso 700 em ações/abas,
cantos retos dos campos e assets carregados também têm verificação no navegador.

Os assets locais correspondem aos slots do Figma: marca de 30 × 30 px e aros
de informação/erro de 20 × 20 px, com as dimensões renderizadas conferidas.

| Par de texto/fundo | Contraste calculado |
|---|---|
| Informação `#1E1E1E` / `#F1F6FD` | 15,35:1 |
| Botão `#F5F5F5` / `#2C2C2C` | 12,81:1 |
| Erro `#B91C1C` / branco | 6,47:1 |
| Validação positiva `#00805B` / branco | 4,95:1 |
| Texto secundário sobre a página `#707070` / `#F5F5F5` | 4,54:1 |
| Texto secundário `#757575` / branco | 4,61:1 |

O tom secundário sobre a página usa um alias local mais escuro para atingir
4,5:1. A conferência é limitada aos pares indicados e aos comportamentos testados;
não representa auditoria completa de acessibilidade ou aprovação da avaliação #33.
Safari, Firefox e as telas seguintes não foram verificados nesta entrega.

## Capturas revisadas

![Configuração válida](screenshots/tela-1/configuracao-valida.png)

| Estado | Captura |
|---|---|
| Mapeamento direto | [mapeamento-direto.png](screenshots/tela-1/mapeamento-direto.png) |
| Totalmente associativo | [totalmente-associativo.png](screenshots/tela-1/totalmente-associativo.png) |
| Por conjunto, 4 vias | [por-conjunto.png](screenshots/tela-1/por-conjunto.png) |
| Erros de parâmetros e sequência | [casos-invalidos.png](screenshots/tela-1/casos-invalidos.png) |
| Side sheet, foco no botão de fechar | [side-sheet.png](screenshots/tela-1/side-sheet.png) |
| Ajuda rápida e links externos | [ajuda-rapida.png](screenshots/tela-1/ajuda-rapida.png) |
| Mobile válido, 390 px | [mobile.png](screenshots/tela-1/mobile.png) |
| Mobile com erros, 390 px | [mobile-erros.png](screenshots/tela-1/mobile-erros.png) |

Para reproduzir, siga [README](../README.md). Para regenerar as capturas,
defina `MEMORA_SCREENSHOT_DIR` ao executar os testes de navegador.

## Ajuste horizontal fluido — 12/10/2026 (PR #43)

O limite `max-width: 1280px` do elemento `main` concentrava a Tela 1 em
monitores largos, com margens de até 320 px de cada lado em 1920 px.
Foi removido apenas esse gargalo, passando a ocupar toda a largura disponível
com `padding-inline: clamp(20px, 1.875vw, 32px)`.
A proporção de colunas `520:648` e o intervalo de 24–32 px entre os painéis
foram preservados. Abas, título, exemplo e atribuição herdam o novo alinhamento
do contêiner. Não foram modificados HTML, núcleo, validações, foco ou ajuda.

No Figma v2, **17 representações SDS de Tela 1** foram ajustadas:
tela principal, ajudas de campos, três mapeamentos, casos inválidos,
variante SDS e três fundos de ajuda geral. Em 1280 px há 24 px de cada lado,
24 px entre os painéis, e largura útil de 1232 px. Todos os componentes
alterados permanecem contidos nos respectivos painéis, inclusive com
side sheet de Ajuda rápida aberta. O frame de referência amplo de
1920 × 1080 mantém margens de 32 px e a mesma distribuição de colunas.
As telas 2/3, variantes Carbon/USWDS e Material 3 e a V1.2 não foram alteradas.

**Validação executada no GitHub Actions:**
[execução aprovada](https://github.com/LuizJr2001/memora-cache-simulator-tcc/actions/runs/38326007472)
(Node 24, Chromium, instalação por `npm ci`, `npm run check`,
`npm test`, `npm run test:ui --workspace @memora/simulator` e `git diff --check`).
Os **37 testes Node e 22 cenários Chromium passaram**. Os quatro novos cenários
verificam geometria do contêiner, alinhamento, margens, proporções,
os três campos de memória lado a lado, ausência de rolagem,
três mapeamentos, mensagens de erro e ajuda modal em
1280 × 720, 1366 × 768, 1480 × 742 e 1920 × 1080.
Os demais 18 cenários continuam cobrindo fluxo por teclado,
ajudas, foco, entradas válidas e inválidas e telas menores.

**Capturas da implementação atualizada** (além das nove originais regeneradas):

| Área útil | Arquivo |
|---|---|
| 1280 × 720 | [layout-1280x720.png](screenshots/tela-1/layout-1280x720.png) |
| 1366 × 768 | [layout-1366x768.png](screenshots/tela-1/layout-1366x768.png) |
| 1480 × 742 | [layout-1480x742.png](screenshots/tela-1/layout-1480x742.png) |
| 1920 × 1080 | [layout-1920x1080.png](screenshots/tela-1/layout-1920x1080.png) |

Esta atualização preserva os arquivos executáveis do Beto, `src/core`,
as funcionalidades de Configurar, o SDS, Inter e as ações de navegação.
O PR #43 segue aberto para revisão, assim como #35 e #37.

## Distribuição vertical e tamanho estável da sequência — 12/10/2026

Após a revisão horizontal, as duas colunas passaram a preencher também a altura
útil do desktop, com `main` como flex container e `configuration-grid` flexível.
O painel Parâmetros agora reparte o espaço livre entre cabeçalho, Memória
principal, Memória cache e o botão Validar parâmetros, que fica próximo à borda
inferior em vez de solto no meio do painel. O painel Sequência de endereços
acompanha a mesma altura; as ações e a nota de orientação ficam próximas da base.

O campo editável `#sequence` ganhou **altura fixa sem redimensionamento manual**
(`resize: none`): **96 px** quando a altura útil do desktop é de até
800 px e **120 px** nos desktops mais altos. A altura permanece igual em
mapeamentos, exemplo didático e erros; a área tem rolagem interna quando
houver mais endereços que o espaço visível. O conteúdo e as validações são
preservados. Mensagens de erro numerosas ficam completas dentro de sua
área de rolagem local e podem ser percorridas por teclado, sem aumentar a página.

O Figma v2 recebeu a mesma revisão nas 17 representações SDS da Tela 1,
incluindo as variantes de mapeamento, inválidos e fundos das ajudas.
A referência ampla de **1920 × 1080** também foi estendida até perto da base,
com a distribuição vertical correspondente.

**Validação efetivamente executada:**
[GitHub Actions — 37 Node + 26 Chromium aprovados](https://github.com/LuizJr2001/memora-cache-simulator-tcc/actions/runs/38327478741).
Os novos cenários avaliam em **1280 × 720, 1366 × 768, 1480 × 742 e
1920 × 1080**: altura fixa do textarea, ausência de rolagem de página,
alinhamento inferior de Validar parâmetros, igualdade de altura dos painéis,
aproximação da nota inferior, três mapeamentos, erros e side sheet.
A suíte anterior também cobre entradas vazias, mensagens de erro extensas,
foco, teclado, ajudas e telas pequenas.

Capturas de desktop e das variantes foram **renovadas na branch**; consulte
as imagens na seção anterior. Não foram alterados o núcleo, os executáveis
do Beto, nem as telas 2 e 3. O PR #43 e as issues #35/#37 permanecem abertos.

## Refinamento de espaçamento dos campos — 12/10/2026

Os espaços entre **rótulo e controle** passaram de **4 para 6 px** e entre
**controle e dica/validação** de **6 para 8 px** em `packages/memora/src/styles/base.css`.
As regras de sequências no desktop foram sincronizadas. Estados de erro mantêm
o espaçamento compacto entre rótulos e caixas, preservando as mensagens
completas e o requisito de ausência de rolagem em áreas úteis pequenas;
nesses estados o `padding-block` dos painéis foi reduzido de 12 para
10 px para compensar o espaço adicional entre campo e dica.

No **Figma v2** foram ajustadas **17 representações SDS da Tela 1**
(incluindo mapeamentos, inválidos e fundos das ajudas) e a
referência de **1920 × 1080**, sem alterar cores, fontes, tamanhos de
controles, alinhamento do `?` ou posição de Validar parâmetros.
As variantes com erros foram compactadas para evitar sobreposição de
mensagens extensas com o botão inferior.

**Validação:** [GitHub Actions — execução aprovada](https://github.com/LuizJr2001/memora-cache-simulator-tcc/actions/runs/38328328048):
**37 testes Node + 28 cenários Chromium**, sem falhas. O novo cenário
mede os espaçamentos reais entre rótulo/campo/dica em 1280 × 720 e
1920 × 1080; os anteriores verificam quatro áreas úteis,
os três mapeamentos, erros extensos, side sheets,
retorno do foco, navegação por teclado e telas menores.
As **13 capturas foram regeneradas** na branch do PR #43.
As telas 2/3, o Beto e `src/core` não foram modificados.

## Distribuição vertical dos balões e botões — 12/10/2026

O espaçamento excessivo entre os cartões **Tag**, **Conjunto** e
**Deslocamento** e os botões **Gerar endereços/Iniciar simulação** foi
eliminado. Os elementos de decomposição, ações e nota didática agora
formam o grupo semântico `.sequence-bottom` no HTML. No desktop,
o painel `.sequence-panel` distribui verticalmente quatro blocos:
cabeçalho, entrada de endereços, resumo de configuração e grupo
inferior. A margem automática anteriormente aplicada às ações
foi removida; a distância entre os cartões e os botões fica em
**12 px para altura útil até 800 px** e **16 px acima disso**.
A nota didática permanece próxima da borda inferior, sem
grandes espaços em branco entre os cartões e botões. No mobile,
`display: contents` mantém a estrutura visual e os espaçamentos
existentes.

O **Figma vigente** foi sincronizado nas 17 variantes e fundos SDS da
Tela 1 em 1280×720 (12 px entre cartões e ações), além do frame amplo
1920×1080 (16 px entre cartões e ações), redistribuindo também
campo de endereços, resumo e decomposição para aproveitar
harmonicamente a altura disponível.

**Testes executados:** [GitHub Actions aprovado](https://github.com/LuizJr2001/memora-cache-simulator-tcc/actions/runs/38328900235):
37 testes Node e **32 cenários Chromium** aprovados.
Os quatro cenários adicionados verificam em **1280×720, 1366×768,
1480×742 e 1920×1080** a distância entre cartões/botões/nota,
a ausência de rolagem vertical e horizontal, os três mapeamentos,
erros de entrada e side sheet de Ajuda rápida. Foram regeneradas
as capturas de referência na branch do PR #43.

Alterações limitadas a `packages/memora`. Preservados os estilos
SDS, a fonte Inter, os controles, a lógica de validação,
o núcleo `src/core`, o simulador original Beto e as telas 2/3.
O PR #43 e as issues #35 e #37 continuam abertos.

## Remoção do aviso geral de erros sob o título — 12/10/2026

Foi removido visualmente o aviso global redundante do cabeçalho
(`⚠ N erros impedem a simulação — revise os campos indicados`).
O subtítulo permanente **"Defina a arquitetura ou carregue um exemplo
pronto para começar"** volta a aparecer normalmente mesmo quando há
erros. Cada campo inválido mantém sua borda vermelha e mensagem local;
os botões continuam bloqueados quando a configuração é inválida.
A informação resumida permanece exclusivamente em região `sr-only`,
`role="status"`, `aria-live="polite"`, acessível a leitores de tela,
sem ocupar espaço visual.

No Figma vigente, a variante **Tela 1.9 — Casos inválidos** recebeu a
remoção do grupo `Pendências` e a reexibição do subtítulo existente.
O restante da Tela 1, ajudas, mapeamentos e a distribuição dos painéis
não foram modificados.

**Verificação executada:** [GitHub Actions aprovado](https://github.com/LuizJr2001/memora-cache-simulator-tcc/actions/runs/38329559501).
Os **37 testes Node e 36 cenários Chromium passaram**. Quatro cenários
adicionais verificam em 1280×720, 1366×768, 1480×742 e 1920×1080 que
a descrição permanece visível, o resumo geral ocupa no máximo 1 px
e usa `clip-path: inset(50%)`, as mensagens de campo continuam
presentes e não há rolagem da página. Quatro novas capturas dos estados
inválidos sem banner foram gravadas em `screenshots/tela-1/` e as
capturas existentes afetadas foram renovadas. PR #43 e issues #35/#37
continuam abertos.

## Centralização do ícone de alerta do resumo — 12/10/2026

O ícone vermelho do cartão **Configuração com erros** foi centralizado
verticalmente em relação à altura do cartão, mantendo inalteradas as
posições do título, da descrição, as cores e as dimensões do componente.
No CSS da Tela 1, o seletor `.configuration-summary > span`
passou a utilizar `align-self: center`, sem alterar o
`align-items: start` do cartão para seu bloco textual.

No Figma vigente, a variante **Tela 1.9 — Casos inválidos** teve o
anel de alerta reposicionado em **y=22 px** e o glifo em **y=24 px**
dentro do cartão de 64 px, alinhados pelos respectivos centros.
Os demais componentes, telas e fundos não foram modificados.

**Verificação executada:** [GitHub Actions aprovado](https://github.com/LuizJr2001/memora-cache-simulator-tcc/actions/runs/38330126743):
**37 testes Node e 40 cenários Chromium**, todos aprovados.
Os quatro cenários novos conferem em 1280×720, 1366×768,
1480×742 e 1920×1080 que a diferença vertical entre os
centros do símbolo e do cartão é de no máximo **2 px**,
que a ordem visual do título/descrição é preservada e que a
página não ganhou rolagem vertical nem horizontal.
Quatro capturas adicionais `alerta-centralizado-*.png`
foram registradas junto às demais capturas renovadas.

Escopo restrito a `packages/memora`, sem alterações no Beto,
núcleo `src/core`, telas 2/3 ou funcionalidades da Tela 1.
PR #43 e issues #35/#37 mantidos abertos.

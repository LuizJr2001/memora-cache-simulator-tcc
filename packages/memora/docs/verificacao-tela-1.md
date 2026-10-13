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

# Verificação da Tela 2 — Simular

Data: **14/10/2026**. Entrega em `feature/35-tela-2`, baseada no commit
`d9258a975c190e1f62051b67a85b601f0cd6e1e3` da Tela 1.
O [PR #43](https://github.com/LuizJr2001/memora-cache-simulator-tcc/pull/43)
ainda está aberto; o PR desta entrega usa `feature/35-tela-1` como base.
A implementação permanece em revisão, sem integração à `main` ou publicação.

Rastreabilidade: #35 (interface), #28 (LRU), #30 (bloco removido), #31
(regressão), #37 (UX) e #22 (planejamento). A avaliação externa #33 permanece
em paralelo; testes automatizados não representam aprovação dos participantes.

## Referência e escopo

Fonte: [v2 no Figma](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-1720),
seção Simular `311:1712`. Foram consultados a tela principal `311:1720`,
os estados inicial `311:3785` e concluído `311:4125`, Decimal/Binário,
as variantes de fases e as ajudas LRU, Memória cache e Histórico de acessos.

A implementação reutiliza a stack HTML/CSS/módulos ES e os tokens SDS da
Tela 1. O cabeçalho compartilhado tem 52 px e as margens são fluidas.
Cards e abas de Code Connect foram adaptados aos componentes nativos existentes;
os textos visíveis dos slots do Figma orientam as ajudas. Inter é servida
localmente e os rótulos de todos os botões/abas usam peso 700.
A marca e o thumb de velocidade de 14 × 14 são exports do Figma, conforme
[o registro dos assets](../src/assets/README.md).

| Parte | Comportamento entregue |
|---|---|
| Motor sem DOM | Direto, totalmente associativo e por conjunto; FIFO, LRU e Random |
| Cache | Linhas ocupadas, validade, tag, bloco, via, recência e destaques do conjunto |
| Estatísticas | Processados/total, acertos, faltas, taxa e linhas usadas |
| Controles | Iniciar/Continuar/Pausar, Parar, Reiniciar, Próxima etapa e Próximo acesso |
| Fases | Decompor, buscar, determinar resultado, selecionar linha, atualizar cache e concluir |
| Ritmo | Velocidade 1–10 pulsos/s; modo detalhado avança fases, modo simples avança acessos |
| Histórico | Todos os acessos concluídos, mais recente primeiro, e acesso em processamento |
| Revisão | Snapshot após o acesso; contadores atuais preservados e identificados no subtítulo |
| Conclusão | Resumo final, filtro de substituições e retorno para configurar |
| Formato | Decimal/Binário para dados e explicações, preservado entre as abas |
| Ajuda | Estado LRU, Memória cache e Histórico, além das 11 ajudas já existentes |
| Navegação | Abas Configurar/Simular por clique ou teclado; pausa ao sair/abrir ajuda |

A preparação da Tela 1 abre Simular em **0/total**, sem execução automática.
Editar parâmetros ou sequência invalida a simulação antiga. A nova preparação
cria outra cache vazia. Parar preserva o acesso pendente; Reiniciar zera os dados.
Próximo acesso conclui exatamente um acesso, mesmo após algumas microetapas.
A cache e as linhas usadas mudam na fase Atualizar; progresso, acertos, faltas
e histórico confirmam o acesso na fase Concluir. No modo automático, callbacks antigos são cancelados por
identificador de geração, evitando avanços após pausa ou descarte.

## Cenário didático e ajuste de referência

Configuração: 4096 células, 1 byte/célula, bloco de 16 células, 32 linhas,
2 vias por conjunto, LRU. Sequência:

```text
0, 1, 16, 17, 32, 33, 48, 49, 64, 65, 992, 993, 2016, 2017, 2, 18, 34, 994, 2018, 3044, 96
```

| Ponto de controle | Resultado verificado |
|---|---|
| Após 19 · endereço 2018 | 12 acertos, 7 faltas, 63,2%, 7/32 linhas |
| Decomposição de 2018 | Tag 7, conjunto 14, deslocamento 2; 4/4/4 bits |
| LRU após 19 | Via 2 (2016–2031) mais recente; via 1 (992–1007) candidata |
| Acesso 20 · endereço 3044 | Na via 1, remove 992–1007 (tag 3) e insere 3040–3055 (tag 11) |
| Após 20 | 12 acertos, 8 faltas; o snapshot anterior ainda contém 992–1007 |
| Após 21 · endereço 96 | 12 acertos, 9 faltas, 57,1%, 8/32 linhas e 21 registros |

O desenho estático identificava as vias ao contrário da ordem em que a
sequência ocupa as vagas: 992 entra primeiro, no acesso 11, e 2016 entra
no acesso 13. O motor usa a primeira via livre, apresentada como via 1.
Foram corrigidos **48 textos visíveis da seção Simular**: números de via,
resumos, estados, referências binárias e exemplo da ajuda LRU. A ajuda do
histórico agora indica revisar os detalhes do acesso, coerente com a revisão
na própria Tela 2. Estilos, geometria e V1.2 foram preservados; a tela principal
foi conferida visualmente após a correção. A seção Analisar será reconciliada
com esses números de via na implementação da Tela 3.

## Preservação do bloco anterior e políticas

Cada registro guarda `before`, `after`, `lineBefore` e `lineAfter`. Objetos e
arrays expostos são congelados; atualizar ou reiniciar cria novos estados,
sem reescrever as referências históricas. A revisão não chama novamente o motor.
A cache armazena apenas linhas ocupadas e intervalos numéricos dos blocos,
sem alocar todas as linhas/células de uma configuração grande.

| Regressão | Resultado esperado e obtido |
|---|---|
| Direto, bloco de 2, sequência `0,1,2,0,8` | Falta/acerto/falta/acerto/falta; remove 0–1, insere 8–9 |
| Totalmente associativo, 2 vias, Random, `0,1,0,2`, fonte `() => 0` | Falta/falta/acerto/falta; remove 0, insere 2 na primeira via |
| Por conjunto, 4 linhas/2 vias, LRU, `0,2,0,4` | Falta/falta/acerto/falta; remove 2, insere 4 |
| FIFO e LRU, `0,1,0,2`, 2 vias | FIFO remove 0; LRU remove 1; acerto não muda a inserção FIFO |
| Random inválido | Erro antes de alterar linha ou contabilizar o acesso |
| Memória/cache de 2^52, sequência curta | Apenas linhas ocupadas; todos os 52 bits preservados |
| 1000 endereços distintos | Histórico completo, sem materializar linhas vazias |

LRU usa posição 1 para mais recente. A candidata só é indicada em um conjunto
cheio e o campo não aparece com direto, FIFO ou Random. A via escolhida e o
bloco inserido têm destaques distintos durante as fases, com texto e cor.

## Verificação executada

Ambiente: Node **24.19.0**, Playwright **1.64.0** e Chromium **153.0.8010.0**,
localmente em modo headless. Comandos a partir da raiz:

```bash
npm ci
npm run check
npm test
npx playwright install chromium
npm run test:ui --workspace @memora/simulator
```

Neste ambiente, foi usado Chromium já instalado via `MEMORA_CHROMIUM_PATH`.
As variáveis opcionais `MEMORA_SCREENSHOT_DIR` e
`MEMORA_SIMULATION_SCREENSHOT_DIR` permitem registrar as capturas.

| Verificação | Resultado |
|---|---|
| Sintaxe | 22 arquivos JavaScript aprovados |
| Node | **58/58**: 28 de configuração/entradas, 9 do controlador de Configurar, 15 da execução e 6 do controlador de Simular |
| Chromium | **67/67**: 45 de Configurar e 22 de Simular |

Além dos resultados do motor, os testes no navegador verificam os seis passos,
revisão/filtro, inclusive durante uma microetapa pausada sem misturar seus
dados com o snapshot selecionado, troca de formato sem reinício, relógio controlado,
velocidade, pausa ao navegar/abrir ajuda, invalidação da configuração, entrada
inválida bloqueada, fontes/assets, negrito, teclado, Escape e retorno de foco,
inclusive no Glossário aberto pela ajuda LRU.

O desktop foi medido em **1280 × 720, 1366 × 768, 1480 × 742 e 1920 × 1080**,
antes do início, no acesso 19, concluído e ao revisar um acesso antigo. As ações
e o rodapé ficam no viewport, sem ocultar overflow da página. Cache e histórico
rolam localmente; foi verificado o acesso por teclado ao restante do histórico.
Nos desktops baixos, a descrição repetida do endereço é omitida e os quatro
cartões vazios ficam compactados ao concluir; reaparecem na revisão de um acesso.

Em **1024, 801, 768, 390 e 320 px**, a página tem fluxo vertical quando
necessário e as tabelas rolagem local, sem overflow horizontal da página.
O modo binário e os side sheets foram incluídos nesses cenários. Os números
dos botões de revisão permanecem em uma linha nas larguras menores.
A regressão da Tela 1 mantém os limites e viewports de seu próprio relatório.

Os resultados são locais. Não representam uma execução de CI remota, uma
auditoria completa WCAG ou cobertura de outros navegadores.

## Capturas da implementação

As 17 capturas abaixo foram produzidas pelos testes e revisadas por amostragem
nos estados principais, desktop compacto, ajuda e mobile.

| Estado | Captura |
|---|---|
| Antes de iniciar · 1280 × 900 | [Abrir](screenshots/tela-2/antes-de-iniciar.png) |
| Após 19 · LRU | [Abrir](screenshots/tela-2/acesso-19-lru.png) |
| Seleção da vítima · acesso 20 | [Abrir](screenshots/tela-2/selecao-vitima.png) |
| Atualização da cache · acesso 20 | [Abrir](screenshots/tela-2/atualizando-cache.png) |
| Conclusão · 1280 × 900 | [Abrir](screenshots/tela-2/simulacao-concluida.png) |
| Revisão do acesso 19 após concluir | [Abrir](screenshots/tela-2/revisao-acesso.png) |
| Binário | [Abrir](screenshots/tela-2/formato-binario.png) |
| Ajuda LRU | [Abrir](screenshots/tela-2/ajuda-lru.png) |
| Mobile · 390 px · binário | [Abrir](screenshots/tela-2/mobile-binario.png) |
| Desktop · 1280 × 720 | [Abrir](screenshots/tela-2/layout-1280x720.png) |
| Conclusão · 1280 × 720 | [Abrir](screenshots/tela-2/concluida-1280x720.png) |
| Desktop · 1366 × 768 | [Abrir](screenshots/tela-2/layout-1366x768.png) |
| Conclusão · 1366 × 768 | [Abrir](screenshots/tela-2/concluida-1366x768.png) |
| Desktop · 1480 × 742 | [Abrir](screenshots/tela-2/layout-1480x742.png) |
| Conclusão · 1480 × 742 | [Abrir](screenshots/tela-2/concluida-1480x742.png) |
| Desktop · 1920 × 1080 | [Abrir](screenshots/tela-2/layout-1920x1080.png) |
| Conclusão · 1920 × 1080 | [Abrir](screenshots/tela-2/concluida-1920x1080.png) |

## Próxima entrega

A Tela 3 — Analisar e suas quatro ajudas ainda não estão implementadas. Sua aba
e o botão correspondente permanecem desabilitados. O histórico já contém os
snapshots necessários; a próxima entrega deve reconciliar os números de via
estáticos no Figma e verificar a comparação antes/depois e seus estados.
Não foram incluídos escrita/dirty bit, exportação, publicação ou avaliação
com participantes. As issues permanecem abertas para revisão e integração.

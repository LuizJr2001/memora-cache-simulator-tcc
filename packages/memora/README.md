# Pacote Memora

Pacote npm privado `@memora/simulator`, dentro do mesmo repositório do TCC.
A Tela 1 — Configurar implementa parâmetros, os três mapeamentos, entrada e
geração de endereços, exemplo didático, decomposição e as 11 ajudas acessíveis
por esta etapa. A interface usa as APIs de configuração/endereços do PR #41.
Iniciar simulação prepara uma entrada válida e abre a **Tela 2 — Simular**, em
estado inicial, sem executar acessos automaticamente. A Tela 2 implementa os
três mapeamentos, FIFO/LRU/Random, controles, microetapas, histórico, revisão por
snapshot e Decimal/Binário. A **Tela 3 — Analisar** compara snapshots reais
antes/depois, explica a decisão, mostra Sai/Entra e quatro passos didáticos,
com casos de acerto, linha livre e substituição e suas quatro ajudas.

A entrega atual está na branch `feature/35-tela-3`, baseada no commit
`4d9c3ea` de `feature/35-tela-2` (PR #44), que depende da Tela 1 do PR #43.
Os três PRs devem ser integrados após revisão, na ordem das dependências;
a versão completa ainda não está na `main`.

## Executar

Requer Node.js 22 ou superior e npm. Na raiz do repositório:

```bash
npm ci
npm run dev
```

- Memora: http://127.0.0.1:5173/
- Beto para comparação: http://127.0.0.1:5173/legado/
- Encerrar: `Ctrl+C`

O servidor usa apenas módulos nativos do Node e escuta no computador local.
A aplicação usa HTML, CSS e módulos ES, sem framework nem dependências de runtime.
Playwright é uma dependência exclusiva de desenvolvimento para testes no navegador.
O servidor não é uma infraestrutura de produção.

## Verificar

```bash
npm run check
npm test
```

`check` verifica a sintaxe dos módulos em `scripts`, `src`, `tests`, `browser` e da configuração Playwright. `test`
executa **65 testes Node**: 28 de configuração/entradas, 9 do controlador da
Tela 1, 15 da execução da cache, 6 do controlador da Tela 2 e 7 da projeção de análise. A suíte cobre
vítimas, contadores, snapshots imutáveis, Random controlado, limites e relógio.

Para verificar a interface no Chromium:

```bash
npx playwright install chromium
npm run test:ui --workspace @memora/simulator
```

A branch `feature/35-tela-3` executa **89 cenários Chromium**: 45 da Tela 1,
22 da Tela 2 e 22 da Tela 3. A regressão da Tela 1 inclui
três mapeamentos, exemplo, validações/bloqueio, geração e preparação de entrada,
11 ajudas, teclado/foco, limites, composição responsiva e estados inválidos.
Também mede largura e altura em **801 × 720, 1024 × 768, 1180 × 720,
1280 × 720, 1366 × 768, 1480 × 742, 1536 × 864 e 1920 × 1080**,
além dos layouts menores de 768, 390 e 320 px. Os testes
adicionais verificam espaçamento dos campos, cartões de decomposição próximos
aos botões, ausência de aviso vermelho geral visível e centralização vertical
do ícone de alerta. A regressão inclui a identificação do primeiro endereço,
a remoção de prévias antigas após erros, 52 bits completos nos três mapeamentos
e navegação por teclado nos erros locais. O servidor local é iniciado pelos testes.
`MEMORA_CHROMIUM_PATH` permite usar um Chromium já instalado, e
`MEMORA_SCREENSHOT_DIR` define onde guardar as capturas da Tela 1.
`MEMORA_SIMULATION_SCREENSHOT_DIR` guarda as da Tela 2. Nesta última,
1280 × 720, 1366 × 768, 1480 × 742 e 1920 × 1080 mantêm as ações e o rodapé
no viewport; cache e histórico têm rolagem local. Em 1024, 801, 768, 390 e
320 px, a página pode rolar verticalmente, sem overflow horizontal da página.
Os testes incluem início, seis microetapas, conclusão, revisão sem reexecução,
políticas, formato, cancelamento do relógio, ajudas e entrada de 52 bits.
`MEMORA_ANALYSIS_SCREENSHOT_DIR` guarda as capturas da Tela 3. A análise cobre
os mesmos quatro desktops e cinco larguras menores, snapshots, decisão por
política, navegação histórica, avanço do acesso pendente, invalidação da
entrada, quatro ajudas e rolagem local com muitas vias.

## Organização

- `src/core/`: configuração, endereçamento, entrada, execução, políticas,
  estatísticas e snapshots, sem DOM nem temporizadores.
- `src/ui/`: telas Configurar/Simular/Analisar, controladores, projeção dos
  snapshots, navegação, side sheet e textos estáticos das 18 ajudas.
- `src/styles/`: tokens SDS, aliases Memora e layout responsivo.
- `src/assets/`: marca, aros e controle de velocidade exportados do Figma; Inter local com licença OFL.
- `scripts/`: ferramentas de desenvolvimento.
- `tests/`: testes de comportamento do núcleo.
- `browser/`: testes de integração da interface com Playwright.

APIs, regras e limites: [src/core/README.md](src/core/README.md).
A sequência está limitada a 1000 endereços e 18000 caracteres; a interface deve
consumir esses limites e apresentar os erros próximos aos campos.

## Fluxo entre Configurar e Simular

`mountConfigureScreen(document, { onPrepared, random })` em `src/ui/configure-screen.js`
integra o formulário ao núcleo. `onPrepared(input)` e o evento DOM
`memora:input-prepared` (emitido no formulário e propagado) entregam exatamente
`prepareSimulationInput(...).input`: configuração normalizada, layout e endereços
imutáveis. O controlador mantém essa entrada até a próxima edição dos dados.
A entrada inválida nunca emite o evento nem chama o callback.

O callback cria a simulação e habilita a aba Simular. Voltar a Configurar pausa
a execução e preserva o estado; qualquer edição invalida a simulação anterior,
exigindo nova preparação. As abas ativas funcionam por clique, setas, Home e End.
A aba Analisar e o botão correspondente habilitam após o primeiro acesso concluído.

Iniciar/Continuar alterna com Pausar; Parar preserva o ponto atual; Reiniciar
zera cache, histórico e contadores. Próxima etapa avança uma das seis fases;
Próximo acesso termina apenas o acesso pendente. Etapas detalhadas determina
se cada pulso automático avança uma fase ou um acesso completo. Velocidade
ajusta de 1 a 10 pulsos/s, sem exibir esse detalhe técnico como rótulo na tela.
Abrir ajuda ou revisar um acesso pausa a execução.

O número de cada acesso no histórico permite revisar a cache após aquele acesso.
Os contadores permanecem os da execução atual, identificada no subtítulo.
Voltar à execução restaura a visualização atual, sem reprocessar acessos.
Revisar substituições filtra o histórico após a conclusão; Mostrar todos retira
o filtro. Decimal/Binário muda somente a apresentação e é preservado ao navegar.

Abrir/fechar ajuda preserva dados; Escape, botão de fechar e scrim restauram o
foco. As ajudas Estado LRU, Memória cache e Histórico de acessos usam os textos
visíveis e os exemplos fixos da v2. A ajuda LRU permite abrir o Glossário.

Decisão e sequência de implementação:
[003-pacote-memora.md](../../docs/decisoes/003-pacote-memora.md).

## Analisar

Abra pelo botão Analisar decisão de substituição ou pela terceira aba.
A Tela 3 usa o acesso selecionado no histórico, ou o último concluído. A execução
pausa e a etapa pendente permanece preservada. Os quadros mostram o conjunto
consultado antes/depois, distinguindo o bloco removido do inserido e os
metadados reais. LRU aparece somente quando aplicável; FIFO, Random e direto
têm explicações próprias. Acertos e vias livres não inventam uma remoção.

Próximo acesso percorre primeiro os registros já salvos, sem executar novamente.
Ao chegar ao último registro, conclui exatamente um novo acesso da simulação,
inclusive uma microetapa pendente. Ao final, o botão fica desabilitado. Voltar
à simulação preserva a seleção e os contadores. Decimal/Binário é compartilhado
entre as telas. Editar a entrada ou reiniciar descarta a análise anterior.

As quatro ajudas completam os 18 side sheets da v2. A comparação lista somente
as vias ocupadas e, na carga inicial, a vaga escolhida, representada com Válido 0;
não aloca uma tabela com todas as vias possíveis de uma configuração enorme.

## Referência visual

A [Tela 3 no Figma](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-6473)
e suas variantes orientam a análise. O [relatório da Tela 3](docs/verificacao-tela-3.md)
registra **65 testes Node e 89 cenários Chromium** aprovados localmente,
16 capturas e as 58 correções de textos de via na seção Analisar do Figma.


A [Tela 2 no Figma](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-1720)
e suas variantes guiam a nova entrega. O [relatório da Tela 2](docs/verificacao-tela-2.md)
registra resultados, capturas e a correção dos números de via no exemplo estático.
A verificação local de 14/10 aprovou **58 testes Node e 67 cenários Chromium**;
esses resultados não substituem a avaliação externa nem declaram CI remota.


A implementação e as capturas do [PR #43](https://github.com/LuizJr2001/memora-cache-simulator-tcc/pull/43)
estão documentadas no [relatório da Tela 1](docs/verificacao-tela-1.md),
com a verificação local de 14/10: **37 testes Node e 45 cenários Chromium**,
todos aprovados. O relatório distingue essa execução dos registros anteriores da CI.
Esta implementação está **na branch do PR**, ainda não integrada à `main`.


A [especificação v2](../../docs/prototipo-v2-especificacao.md) e a issue #37
registram a referência vigente para #35: abas, controles e ajuda contextual.
A [Tela 1](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-14),
suas variantes e os textos visíveis das ajudas na página v2 guiam esta entrega.
Os componentes React de Code Connect foram adaptados para HTML/CSS nativos,
mantendo a stack e os tokens SDS. Os exemplos das ajudas são estáticos.
No desktop, os três campos de memória principal ocupam uma linha. O layout
é fluido na largura e ocupa a altura útil da janela, mantendo os painéis
**Parâmetros** e **Sequência de endereços** alinhados até a base. O botão
**Validar parâmetros** fica próximo à borda inferior do painel esquerdo;
no direito, os cartões Tag/Conjunto/Deslocamento ficam próximos dos botões de
ação (12 px em desktop baixo, 16 px em desktop alto). O textarea mantém
altura fixa de 96 px em viewports desktop de até 800 px de altura e de
120 px acima disso, com rolagem interna e sem alça de redimensionamento.
Rótulo/campo e campo/dica têm espaçamento base de 6 px e 8 px,
respectivamente, com compactação específica para erros.

Nos estados inválidos, as **bordas e mensagens de erro ficam junto aos campos**;
não se exibe banner vermelho redundante sob o título. O resumo geral de erros
permanece anunciado exclusivamente a leitores de tela (`sr-only`, `aria-live`),
enquanto o subtítulo comum segue visível. O ícone de alerta do card
**Configuração com erros** é centralizado verticalmente, sem deslocar título
ou descrição. O cabeçalho oferece Glossário e Ajuda rápida, com Abrir GitHub
somente nesta última. Em telas menores, os painéis são empilhados.
A avaliação #33 permanece em paralelo.

## Origem

O simulador original é o [Beto, de Leandro Gabriel e colaboradores](https://github.com/leo150250/simuladorCache).
O código do legado permanece em `docs/`. A extração e adaptação do motor deve
preservar essa atribuição e a [licença MIT do repositório](../../LICENSE).

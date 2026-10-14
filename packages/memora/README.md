# Pacote Memora

Pacote npm privado `@memora/simulator`, dentro do mesmo repositório do TCC.
A Tela 1 — Configurar implementa parâmetros, os três mapeamentos, entrada e
geração de endereços, exemplo didático, decomposição e as 11 ajudas acessíveis
por esta etapa. A interface usa as APIs de configuração/endereços do PR #41.
Iniciar simulação prepara uma entrada válida, sem executar acessos à cache.
As telas Simular e Analisar e a execução seguem nas próximas entregas da #35.

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
executa os 28 testes do núcleo e 9 testes de integração do controlador da Tela 1,
com o runner nativo do Node. A regressão da execução da cache será acrescentada na #31.

Para verificar a interface no Chromium:

```bash
npx playwright install chromium
npm run test:ui --workspace @memora/simulator
```

A suíte atual da branch `feature/35-tela-1` executa **45 cenários Chromium**, incluindo
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
`MEMORA_SCREENSHOT_DIR` define onde guardar as capturas opcionais.

## Organização

- `src/core/`: configuração, endereçamento e preparação de entrada sem DOM;
  execução, políticas, estatísticas e snapshots em migração.
- `src/ui/`: controlador e interface da Tela 1, side sheet e conteúdo estático das ajudas.
- `src/styles/`: tokens SDS, aliases Memora e layout responsivo.
- `src/assets/`: marca e aros exportados do Figma; Inter local com licença OFL.
- `scripts/`: ferramentas de desenvolvimento.
- `tests/`: testes de comportamento do núcleo.
- `browser/`: testes de integração da interface com Playwright.

APIs, regras e limites: [src/core/README.md](src/core/README.md).
A sequência está limitada a 1000 endereços e 18000 caracteres; a interface deve
consumir esses limites e apresentar os erros próximos aos campos.

## Preparação para a próxima etapa

`mountConfigureScreen(document, { onPrepared, random })` em `src/ui/configure-screen.js`
integra o formulário ao núcleo. `onPrepared(input)` e o evento DOM
`memora:input-prepared` (emitido no formulário e propagado) entregam exatamente
`prepareSimulationInput(...).input`: configuração normalizada, layout e endereços
imutáveis. O controlador mantém essa entrada até a próxima edição dos dados.
A entrada inválida nunca emite o evento nem chama o callback.

As abas Simular/Analisar indicam etapas futuras, sem links ou navegação ativa.
A confirmação da preparação permanece na Tela 1. Abrir/fechar ajuda preserva
o formulário; Escape, botão de fechar e scrim restauram o foco de abertura.

Decisão e sequência de implementação:
[003-pacote-memora.md](../../docs/decisoes/003-pacote-memora.md).

## Referência visual

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

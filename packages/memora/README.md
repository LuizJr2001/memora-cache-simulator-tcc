# Pacote Memora

Pacote npm privado `@memora/simulator`, dentro do mesmo repositório do TCC.
A Tela 1 — Configurar implementa parâmetros, os três mapeamentos, entrada e
geração de endereços aleatórios, exemplo didático, decomposição e as 11 ajudas acessíveis
por esta etapa. A interface usa as APIs de configuração/endereços do PR #41.
Iniciar simulação prepara uma entrada válida e abre a **Tela 2 — Simular**, em
estado inicial, sem executar acessos automaticamente. A Tela 2 implementa os
três mapeamentos, FIFO/LRU/Random, controles, microetapas, histórico, revisão por
snapshot e Decimal/Binário. A comparação antes/depois fica recolhida no cartão
Memória cache da própria simulação e acompanha o acesso selecionado no histórico.
O fluxo atual tem somente Configurar e Simular; a antiga Tela 3 foi integrada
sem repetir a decomposição do endereço e o passo a passo.

As três telas foram integradas à `main` pelos PRs #43, #44 e #45 em 14/10/2026.
O PR #47 acrescentou a publicação no
[GitHub Pages](https://luizjr2001.github.io/memora-cache-simulator-tcc/).
Datas, evidências e pendências estão no
[histórico de desenvolvimento](../../docs/historico-desenvolvimento.md).

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

## Publicação estática

Na raiz do repositório, `npm run build` prepara `_site/` com HTML, módulos ES,
estilos, imagens, fonte e licenças. A aplicação publicada executa a simulação
no navegador, sem depender do servidor de desenvolvimento.
O workflow de GitHub Pages verifica e publica alterações da `main`;
pull requests executam apenas as verificações e a preparação.
Consulte o [guia de publicação](../../docs/publicacao-github-pages.md).

## Verificar

```bash
npm run check
npm test
```

`check` verifica a sintaxe dos módulos em `scripts`, `src`, `tests`, `browser` e da configuração Playwright. `test`
executa **75 testes Node** de configuração/entradas, controladores, execução,
explicações e apresentação da cache. A suíte cobre vítimas, contadores,
snapshots imutáveis, Random controlado, limites, relógio e troca de modo.

Para verificar a interface no Chromium:

```bash
npx playwright install chromium
npm run test:ui --workspace @memora/simulator
```

A versão integrada contém **93 cenários Chromium**: 46 Configurar,
32 Simular e 15 de comparação contextual. A regressão da Tela 1 inclui
três mapeamentos, exemplo, validações/bloqueio, geração e preparação de entrada,
11 ajudas, teclado/foco, limites, composição responsiva e estados inválidos.
Também mede largura e altura em **801 × 720, 1024 × 768, 1180 × 720,
1280 × 720, 1366 × 768, 1480 × 742, 1536 × 864 e 1920 × 1080**,
além dos layouts menores de 768, 390 e 320 px. Os testes
adicionais verificam espaçamento dos campos, textarea expandido e estável entre
validações, cartões próximos aos botões e centralização vertical do ícone de
alerta. A regressão inclui a identificação do primeiro endereço,
a remoção de prévias antigas após erros, 52 bits completos nos três mapeamentos
e navegação por teclado nos erros locais. O servidor local é iniciado pelos testes.
`MEMORA_CHROMIUM_PATH` permite usar um Chromium já instalado, e
`MEMORA_SCREENSHOT_DIR` define onde guardar as capturas da Tela 1.
`MEMORA_SIMULATION_SCREENSHOT_DIR` guarda as da Tela 2. Nesta última,
1280 × 720, 1366 × 768, 1480 × 742 e 1920 × 1080 mantêm as ações e o rodapé
no viewport; cache e histórico têm rolagem local. Em 1024, 801, 768, 390 e
320 px, a página pode rolar verticalmente, sem overflow horizontal da página.
Os testes incluem início, seis microetapas, conclusão, revisão sem reexecução,
políticas, formato, cancelamento do relógio, ajudas, entrada de 52 bits, avisos
de navegação, cache completa, células e paginação por teclado.

## Organização

- `src/core/`: configuração, endereçamento, entrada, execução, políticas,
  estatísticas e snapshots, sem DOM nem temporizadores.
- `src/ui/`: telas Configurar/Simular e comparação contextual, controladores, projeção dos
  snapshots, navegação, side sheet e textos estáticos das 16 ajudas.
- `src/styles/`: tokens SDS, aliases Memora e layout responsivo.
- `src/assets/`: marca, aros e controle de velocidade exportados do Figma; Inter local com licença OFL.
- `scripts/`: ferramentas de desenvolvimento.
- `tests/`: testes de comportamento do núcleo.
- `browser/`: testes de integração da interface com Playwright.

APIs, regras e limites: [src/core/README.md](src/core/README.md).
A sequência está limitada a 1000 endereços e 18000 caracteres; a interface deve
consumir esses limites e apresentar os erros próximos aos campos.

## Configuração inicial

Ao abrir o Memora, o formulário recebe os valores iniciais do Beto:

| Campo | Valor inicial |
|---|---|
| Bytes por célula | 1 |
| Total de células | 4096 |
| Células por bloco | 16 |
| Linhas da cache | 32 |
| Mapeamento | Direto, com 1 via |
| Substituição | FIFO selecionado; desabilitado no direto, que tem uma única linha possível |
| Quantidade no gerador aleatório | 32 |
| Velocidade e modo | 5 etapas/segundo; etapas detalhadas |

**Endereços a acessar** já contém:

```text
0, 1, 6, 7, 8, 9, 992, 993, 994, 481, 482, 0, 1, 2, 996, 224, 225, 2017, 2018, 4064, 996
```

São 21 acessos válidos; **Iniciar simulação** fica disponível ao abrir.
A divisão inicial tem 3 bits de tag, 5 de linha e 4 de deslocamento. O botão
prepara a entrada e abre Simular em 0/21, aguardando o primeiro avanço.
Essa sequência completa resulta em 13 acertos, 8 faltas e 3/32 linhas usadas.

**Carregar exemplo didático** restaura os mesmos parâmetros e os 21 endereços
do Beto usados na abertura, inclusive após edições inválidas. A ação invalida
a simulação anterior e exige uma nova preparação. O cenário por conjunto/LRU
permanece como referência das ajudas e dos testes, configurado explicitamente.
Os [testes e capturas da configuração inicial](docs/verificacao-configuracao-inicial.md)
registram a implementação anterior a essa unificação.

## Fluxo entre Configurar e Simular

**Gerar endereços aleatórios** abre um painel com quantidade inicial 32, que aceita de 1 a 1000
endereços. O botão fica ao lado esquerdo da interrogação no cabeçalho de
**Endereços a acessar**. A ação sorteia valores entre 0 e total de células − 1, pode repetir
endereços e substitui o conteúdo de **Endereços a acessar**. O painel explicita
o intervalo atual e essa substituição antes da geração. O exemplo didático
permanece uma sequência fixa independente da geração aleatória.

Em **COMO O ENDEREÇO SERÁ DIVIDIDO DE ACORDO COM O MAPEAMENTO**, a linha de
contexto identifica o mapeamento selecionado, sem o rótulo Primeiro endereço. Os cartões
apresentam sua divisão: direto usa Tag/Linha/Deslocamento; por conjunto usa Tag/Conjunto/Deslocamento;
totalmente associativo usa Tag/Deslocamento, sem bits de conjunto. Os cartões
calculam as larguras a partir dos parâmetros e usam o primeiro endereço válido.
**Iniciar simulação** ocupa toda a largura disponível abaixo da prévia,
alinhado às bordas do campo de endereços, com o texto centralizado.
O gerador mantém 16 px de distância da interrogação.

`mountConfigureScreen(document, { onPrepared, random })` em `src/ui/configure-screen.js`
integra o formulário ao núcleo. `onPrepared(input)` e o evento DOM
`memora:input-prepared` (emitido no formulário e propagado) entregam exatamente
`prepareSimulationInput(...).input`: configuração normalizada, layout e endereços
imutáveis. O controlador mantém essa entrada até a próxima edição dos dados.
A entrada inválida nunca emite o evento nem chama o callback.

O callback cria a simulação e libera seu conteúdo. Voltar a Configurar pausa
a execução e preserva o estado; qualquer edição invalida a simulação anterior,
exigindo nova preparação. As abas ativas funcionam por clique, setas, Home e End.
Antes da preparação, Simular mantém Configurar e mostra um aviso vermelho de pendência.
A comparação aparece após o primeiro acesso concluído e fica recolhida por padrão.

Iniciar/Continuar alterna com Pausar; Parar preserva o ponto atual; Reiniciar
zera cache, histórico e contadores. Etapas detalhadas marcada avança uma das
seis fases por pulso automático; desmarcada avança um acesso
completo por pulso. Próximo acesso é o único avanço manual e termina a entrada
pendente. Ir ao final conclui os restantes. A velocidade começa em 5 e varia de 1 a 10, com passos/segundo ou
acessos/segundo no rótulo conforme o modo.
Abrir ajuda ou revisar um acesso pausa a execução.

O número de cada acesso no histórico permite revisar a cache após aquele acesso.
Os contadores permanecem os da execução atual, identificada no subtítulo.
Voltar à execução restaura a visualização atual, sem reprocessar acessos.
Ao concluir, o controle de reprodução mostra **✓ Concluído** no estilo desabilitado; Progresso fica verde e mostra (finalizado) e fica
desabilitado, sem um balão separado de conclusão. Reiniciar restaura o estado
inicial. Decimal/Binário muda somente a apresentação e é preservado ao navegar.

Abrir/fechar ajuda preserva dados; Escape, botão de fechar e scrim restauram o
foco. As ajudas Estado LRU, Memória cache e Histórico de acessos usam os textos
visíveis e os exemplos fixos da v2. A ajuda LRU permite abrir o Glossário.

Decisão e sequência de implementação:
[003-pacote-memora.md](../../docs/decisoes/003-pacote-memora.md).

## Comparar antes e depois

Selecione um acesso no histórico e expanda **Comparar antes e depois** no cartão
Memória cache. A comparação ocupa o lugar da tabela enquanto aberta; recolher
restaura a tabela. O histórico, os controles e as estatísticas permanecem visíveis.

A comparação usa os snapshots reais do acesso selecionado, ou do último concluído,
sem executar acessos. Mostra somente o conjunto consultado, Sai/Entra e a escolha
por LRU, FIFO, Random ou mapeamento direto. Acertos e vias livres não inventam remoções.
O passo a passo e a decomposição continuam nos componentes existentes de Simular.

**Acesso anterior** e **Acesso seguinte** selecionam apenas registros já concluídos,
sincronizando cache, histórico e comparação. O último registro desabilita Acesso
seguinte mesmo que a simulação esteja incompleta. Não há execução por esses controles.
Abrir a comparação pausa a reprodução; retomá-la recolhe a comparação. Revisar não
altera contadores nem perde uma microetapa pendente. Reiniciar ou editar a configuração
limpa os dados antigos. Decimal/Binário usa o seletor global de Simular.

Veja a [decisão 004](../../docs/decisoes/004-analise-contextual.md). O Figma e os
relatórios das três telas abaixo permanecem como referência histórica da versão anterior.

## Referência visual

A [Tela 3 no Figma](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-6473)
e suas variantes orientam a análise. O [relatório da Tela 3](docs/verificacao-tela-3.md)
registra a revisão de 14/10 com **75 testes Node e 96 cenários Chromium**, além do histórico de validação,
16 capturas e as 58 correções de textos de via na seção Analisar do Figma.


A [Tela 2 no Figma](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-1720)
e suas variantes orientam a interface. O [relatório da Tela 2](docs/verificacao-tela-2.md)
registra resultados, capturas e a correção dos números de via no exemplo estático.
A [revisão geral do PR #44](docs/revisao-pr44.md) registra a verificação local
daquela entrega em 14/10: **68 testes Node e 74 cenários Chromium** aprovados, incluindo
as duas telas. Esses resultados não substituem a avaliação externa.


A implementação e as capturas do [PR #43](https://github.com/LuizJr2001/memora-cache-simulator-tcc/pull/43)
estão documentadas no [relatório da Tela 1](docs/verificacao-tela-1.md),
com a verificação local de 14/10: **37 testes Node e 45 cenários Chromium**,
todos aprovados. O relatório distingue essa execução dos registros anteriores da CI.
A Tela 1 já foi integrada à `main`; seus refinamentos posteriores fazem parte do PR #44.


A [especificação v2](../../docs/prototipo-v2-especificacao.md) e a issue #37
registram a referência vigente para #35: abas, controles e ajuda contextual.
A [Tela 1](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-14),
suas variantes e os textos visíveis das ajudas na página v2 guiam esta entrega.
Os componentes React de Code Connect foram adaptados para HTML/CSS nativos,
mantendo a stack e os tokens SDS. Os exemplos das ajudas são estáticos.
No desktop, os três campos de memória principal ocupam uma linha. O layout
é fluido na largura e ocupa a altura útil da janela, mantendo os painéis
**Parâmetros** e **Sequência de endereços** alinhados até a base. Os grupos de
memória principal e cache se distribuem no painel esquerdo, sem botão de
confirmação: parâmetros e sequência são validados automaticamente ao editar,
a prévia se atualiza com entrada válida e **Iniciar simulação** revalida tudo
antes de avançar. No direito, os cartões Tag/Conjunto/Deslocamento ficam próximos
de Iniciar simulação (10 px em desktop baixo, 16 px em desktop alto), enquanto
a geração permanece junto do campo de endereços. O textarea ocupa
o espaço livre do painel, com mínimo de 72 px, rolagem interna e sem alça de
redimensionamento. A altura permanece igual ao alternar entrada vazia, válida
ou inválida na mesma janela. Rótulo/campo e campo/dica têm espaçamento base de
6 px e 8 px, respectivamente; na sequência, notebooks de até 850 px de altura
usam 4 px em ambos, inclusive nos estados inválidos.

Nos estados inválidos, as **bordas e mensagens de erro ficam junto aos campos**;
o aviso vermelho sob o título aparece apenas ao tentar avançar sem preparar
a configuração e não repete os campos. O resumo geral de erros
permanece anunciado exclusivamente a leitores de tela (`sr-only`, `aria-live`),
enquanto o subtítulo comum segue visível. O ícone de alerta do card
**Configuração com erros** é centralizado verticalmente, sem deslocar título
ou descrição. O cabeçalho oferece Glossário e Ajuda rápida, com Abrir GitHub
somente nesta última. Em telas menores, os painéis são empilhados.
A avaliação #33 permanece em paralelo.

## Origem

O Memora é baseado no [Beto, simulador educacional de memória cache de Leandro Gabriel e colaboradores](https://github.com/leo150250/simuladorCache).
O rodapé e a ajuda Como funciona? explicitam essa origem. MIT identifica a licença do código.
O código do legado permanece em `docs/`. A extração e adaptação do motor deve
preservar essa atribuição e a [licença MIT do repositório](../../LICENSE).



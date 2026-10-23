# Memora — histórico de desenvolvimento

**Consolidação:** 23/10/2026. As datas usam o horário de Brasília
(`America/Sao_Paulo`, UTC−3). Atividades relatadas nas conversas são registradas
pela data em que ocorreram; integração e publicação são conferidas no Git.
O horário UTC do GitHub pode cair no dia seguinte.

## Situação consolidada

O fluxo vigente é **Configurar → Simular**, com comparação antes/depois
integrada ao cartão Memória cache pelo PR #60. As três telas anteriores foram
integradas em 14/10 e permanecem como referência histórica. O [Memora online](https://luizjr2001.github.io/memora-cache-simulator-tcc/)
é publicado pelo GitHub Pages, com atualização automática após sintaxe, testes
Node e build. O Beto em `docs/` continua disponível para comparação local.

O código funcional e as verificações técnicas estão documentados. O artigo
em LaTeX incorpora a implementação e o levantamento de 13 respostas do Beto.
A avaliação externa do Memora e a inspeção formal com severidade permanecem
pendentes. Consulte o [estado atual](estado-atual.md) e o [artigo](../tcc/README.md).

## Marcos e evidências

| Data de 2026 | Marco | Evidência e alcance |
|---|---|---|
| 23/09 | Elaboração inicial do protótipo concluída, com atraso em relação ao planejamento | Registro do autor consolidado no [replanejamento](https://github.com/LuizJr2001/memora-cache-simulator-tcc/issues/22) e na [especificação v2](prototipo-v2-especificacao.md); avaliação externa ainda pendente |
| 25/09 | Adoção do nome Memora e do Simple Design System | [Decisão 001](decisoes/001-nome-memora.md) e [decisão 002](decisoes/002-simple-design-system.md); origem no Beto preservada |
| 30/09 | Registro do desenvolvimento em paralelo à avaliação | [Commit `9b170c2`](https://github.com/LuizJr2001/memora-cache-simulator-tcc/commit/9b170c2) e [decisão 003](decisoes/003-pacote-memora.md); protótipo estático e implementação são entregas distintas |
| 02/10 | Reunião de UX com a orientação | Refinamentos acompanhados na [#37](https://github.com/LuizJr2001/memora-cache-simulator-tcc/issues/37) |
| 08–09/10 | Organização da v2 e simplificação da interface | Fluxo 1→2→3, abas, variantes, ajudas, linguagem e pontuação na [especificação v2](prototipo-v2-especificacao.md) |
| 11/10 | Consolidação da v2, Inter/Bold e textos de ajuda | [PR #38](https://github.com/LuizJr2001/memora-cache-simulator-tcc/pull/38), [#39](https://github.com/LuizJr2001/memora-cache-simulator-tcc/pull/39) e [#40](https://github.com/LuizJr2001/memora-cache-simulator-tcc/pull/40) |
| 12/10 | Base isolada e núcleo de configuração integrados | [PR #36](https://github.com/LuizJr2001/memora-cache-simulator-tcc/pull/36) e [#41](https://github.com/LuizJr2001/memora-cache-simulator-tcc/pull/41): workspace, servidor local, validação, geração, decomposição e `prepareSimulationInput` |
| 12/10 | Cores informativas e de consulta padronizadas | [PR #42](https://github.com/LuizJr2001/memora-cache-simulator-tcc/pull/42); dados/ajudas em azul claro e indicadores de conjunto com identidade compartilhada |
| 12–14/10 | Implementação e refinamentos de Configurar | [PR #43](https://github.com/LuizJr2001/memora-cache-simulator-tcc/pull/43), integrado em 14/10: três mapeamentos, exemplo, erros locais, ajudas, layout desktop e prévia do primeiro endereço, incluindo 52 bits |
| 14/10 | Simular integrado à `main` | [PR #44](https://github.com/LuizJr2001/memora-cache-simulator-tcc/pull/44): execução real, políticas, seis etapas, modo resumido, velocidade inicial 5, histórico, snapshots, cache com células e validação automática sem confirmação manual |
| 14/10 | Analisar integrado à `main` | [PR #45](https://github.com/LuizJr2001/memora-cache-simulator-tcc/pull/45): Antes/Depois, Sai/Entra, quatro passos didáticos, acerto/via livre/substituição e conclusão das 18 ajudas |
| 14/10 à noite | Publicação no GitHub Pages | [PR #47](https://github.com/LuizJr2001/memora-cache-simulator-tcc/pull/47) e [execução concluída com sucesso](https://github.com/LuizJr2001/memora-cache-simulator-tcc/actions/runs/38663768957); em UTC, o registro da publicação é de **15/10**, entre 01h06 e 01h13 |
| 18/10 | Revisão dos textos de Configurar e da documentação | Geração identificada como aleatória, destino da sequência explícito, divisão por mapeamento e apresentação da origem no simulador educacional Beto |
| 18/10 | Refinamento do título e das ações da sequência | Título completo da divisão de acordo com o mapeamento; geração à esquerda da interrogação de Endereços a acessar; Iniciar simulação centralizado. [Relatório](../packages/memora/docs/verificacao-acoes-enderecos.md) |
| 18/10 | Espaçamento do gerador e largura da ação principal | Gerador separado da ajuda por 16 px, rótulo Primeiro endereço removido e Iniciar simulação ocupando a largura disponível, com texto centralizado. [Relatório](../packages/memora/docs/verificacao-largura-iniciar.md) |
| 22/10 | Mais espaço lateral no botão de geração | Padding horizontal ampliado de 4 para 16 px em cada lado, com distância de 16 px até a ajuda e encaixe conferido de 320 a 1920 px. [Relatório atualizado](../packages/memora/docs/verificacao-largura-iniciar.md#refinamento-do-gerador--22102026) |
| 22/10 | Configuração inicial baseada no Beto | Abertura com mapeamento direto, 21 acessos originais, FIFO como preferência e quantidade inicial 32 no gerador. O botão inicialmente carregava por conjunto/LRU; em 23/10 foi unificado com os valores de abertura do Beto. [Verificação](../packages/memora/docs/verificacao-configuracao-inicial.md) |
| 23/10 | Restauração do exemplo inicial e simplificação de Simular | PRs #51, #53, #55 e #57–#59: abertura e botão de exemplo usam o Beto; removidos blocos redundantes; Progresso verde ao concluir; Parar somente em reprodução; unidade passos/acessos por segundo |
| 23/10 | Análise integrada à simulação | [PR #60](https://github.com/LuizJr2001/memora-cache-simulator-tcc/pull/60) e [decisão 004](decisoes/004-analise-contextual.md): duas etapas, comparação recolhível, revisão sem execução e 16 ajudas |
| 23/10 | Botões preenchidos em roxo | [PR #61](https://github.com/LuizJr2001/memora-cache-simulator-tcc/pull/61) e [#62](https://github.com/LuizJr2001/memora-cache-simulator-tcc/pull/62): `#75609A` e texto branco em todas as ações; a proposta de secundários com contorno foi substituída |
| 23/10 | Consolidação documental e artigo | Atualização dos guias, decisões, resultados dos dois cenários e fonte LaTeX; questionário já coletado diferenciado da avaliação posterior do Memora |

## Comportamentos consolidados

- **Abertura:** 1 byte por célula, 4096 células, blocos de 16, 32 linhas e
  mapeamento direto. Os 21 acessos do Beto já vêm preenchidos; Iniciar simulação
  fica disponível. FIFO fica selecionado e desabilitado no direto, e o gerador
  apresenta quantidade 32. A reprodução mantém velocidade 5 e etapas detalhadas.
- **Configurar:** parâmetros e sequência são validados ao editar. Iniciar
  simulação prepara a entrada imutável e abre Simular, sem executar um acesso
  automaticamente. Editar depois invalida a simulação anterior.
- **Geração:** Gerar endereços aleatórios sorteia valores na memória atual e
  substitui Endereços a acessar; aceita de 1 a 1000 endereços e pode repetir
  valores. O exemplo didático conserva sua sequência fixa de 21 acessos.
- **Decomposição:** direto usa tag/linha/deslocamento; por conjunto usa
  tag/conjunto/deslocamento; totalmente associativo usa tag/deslocamento, sem
  bits de conjunto. A arquitetura define a largura dos campos, que podem ter
  zero bits. A prévia usa o primeiro endereço de uma sequência válida.
- **Simular:** modo detalhado avança uma das seis etapas; modo resumido avança
  um acesso completo. Próximo acesso conclui um acesso nos dois modos; Parar só fica habilitado durante reprodução automática. O rótulo de velocidade indica passos/segundo ou
  acessos/segundo, com valor inicial 5. Cache e histórico têm rolagem local.
- **Comparação em Simular:** snapshots reais permitem explicar a escolha sem repetir a
  execução ou sortear novamente uma vítima Random. Acerto e carga em via livre
  recebem explicações próprias, sem inventar uma substituição.
- **Origem:** o Memora aprimora o [Beto](https://github.com/leo150250/simuladorCache),
  simulador educacional de memória cache de Leandro Gabriel e colaboradores.
  MIT é a licença do código.

No exemplo inicial do Beto e no botão Carregar exemplo didático, o resultado
é **13 acertos, 8 faltas, 61,9% e 3/32 linhas usadas**. O cenário por conjunto/LRU
das ajudas e dos testes usa outra sequência e termina em **12 acertos, 9 faltas,
57,1% e 8/32 linhas**. No acesso 20 desse segundo cenário, a via 1 do conjunto 14
troca **992–1007 (tag 3)** por **3040–3055 (tag 11)**; a via 2 mantém 2016–2031.
Os [dois cenários reproduzíveis](estado-atual.md#cenários-reproduzíveis) registram
os parâmetros e endereços sem atribuir o resultado LRU à abertura direta.

## Evidências de verificação

Os resultados abaixo pertencem às entregas indicadas, não são contagens
cumulativas nem uma declaração de que todas as execuções anteriores da CI
passaram. Os relatórios mantêm os registros originais.

| Entrega | Verificação documentada | Relatório |
|---|---|---|
| Configurar, revisão final do PR #43 | 37 testes Node e 45 cenários Chromium | [Tela 1](../packages/memora/docs/verificacao-tela-1.md) |
| Simular, revisão final do PR #44 | 68 testes Node e 74 cenários Chromium, incluindo Configurar | [Revisão geral](../packages/memora/docs/revisao-pr44.md) |
| Analisar e fluxo completo do PR #45 | 75 testes Node e 96 cenários Chromium, incluindo as três telas | [Tela 3](../packages/memora/docs/verificacao-tela-3.md) |
| Preparação e publicação do PR #47 | Sintaxe, 75 testes Node, build e deploy com sucesso | [Guia de publicação](publicacao-github-pages.md) e [GitHub Actions](https://github.com/LuizJr2001/memora-cache-simulator-tcc/actions/runs/38663768957) |
| Textos e documentação, 18/10 | Sintaxe, 75 testes Node, 96 cenários Chromium e build aprovados localmente | [Relatório e cinco capturas](../packages/memora/docs/verificacao-textos-configuracao.md) |
| Configuração inicial, 22–23/10 | Sintaxe, 75 testes Node, 97 cenários Chromium verificados, incluindo reexecução isolada de dois timeouts, e build aprovado | [Relatório e quatro capturas](../packages/memora/docs/verificacao-configuracao-inicial.md) |
| Integração da comparação, PR #60 | 78 testes Node e 93 cenários Chromium (46 + 32 + 15), sintaxe e build | [Decisão 004](decisoes/004-analise-contextual.md) e [PR #60](https://github.com/LuizJr2001/memora-cache-simulator-tcc/pull/60) |
| Cores dos botões, PRs #61/#62 | Sintaxe, 78 testes Node e build; nova inspeção visual da paleta pendente | [PR #61](https://github.com/LuizJr2001/memora-cache-simulator-tcc/pull/61) e [#62](https://github.com/LuizJr2001/memora-cache-simulator-tcc/pull/62) |

Firefox/Safari e avaliação com participantes não são comprovados por esses
testes Chromium. O [guia de contribuição](../CONTRIBUTING.md) descreve como
executar as suítes e registrar novas verificações separadamente.

## Pendências acadêmicas e de escopo

- Consolidar o retorno da orientação e realizar/registrar a avaliação com
  estudantes conforme [#33](https://github.com/LuizJr2001/memora-cache-simulator-tcc/issues/33)
  e a avaliação da versão funcional na [#23](https://github.com/LuizJr2001/memora-cache-simulator-tcc/issues/23).
- Registrar a inspeção formal, dificuldades observadas e decisões decorrentes,
  sem tratar inspeções visuais ou testes automatizados como aprovação externa.
- Revisar com a orientação o [artigo atualizado](../tcc/README.md) e incorporar
  os resultados da avaliação externa quando existirem, conforme
  [#24](https://github.com/LuizJr2001/memora-cache-simulator-tcc/issues/24).
- Manter leitura/escrita, políticas de escrita e dirty bit como trabalho futuro
  na [#32](https://github.com/LuizJr2001/memora-cache-simulator-tcc/issues/32);
  exportação e comparação entre configurações não são funcionalidades entregues.

A existência da implementação e da publicação não fecha automaticamente as
issues de pesquisa, avaliação ou regressão com critérios adicionais.


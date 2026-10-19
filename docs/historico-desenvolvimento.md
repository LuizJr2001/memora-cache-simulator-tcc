# Memora — histórico de desenvolvimento

**Consolidação:** 18/10/2026. As datas usam o horário de Brasília
(`America/Sao_Paulo`, UTC−3). Atividades relatadas nas conversas são registradas
pela data em que ocorreram; integração e publicação são conferidas no Git.
O horário UTC do GitHub pode cair no dia seguinte.

## Situação consolidada

As telas **Configurar, Simular e Analisar** estão implementadas e integradas à
`main`. O [Memora online](https://luizjr2001.github.io/memora-cache-simulator-tcc/)
é publicado pelo GitHub Pages, com atualização automática após sintaxe, testes
Node e build. O Beto em `docs/` continua disponível para comparação local.

O código funcional e as verificações técnicas estão documentados. A avaliação
externa, a inspeção formal com severidade e a incorporação dos resultados ao
artigo continuam em andamento ou pendentes nas issues correspondentes.

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

## Comportamentos consolidados

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
  um acesso completo. O rótulo de velocidade indica etapas/segundo ou
  acessos/segundo, com valor inicial 5. Cache e histórico têm rolagem local.
- **Analisar:** snapshots reais permitem explicar a escolha sem repetir a
  execução ou sortear novamente uma vítima Random. Acerto e carga em via livre
  recebem explicações próprias, sem inventar uma substituição.
- **Origem:** o Memora aprimora o [Beto](https://github.com/leo150250/simuladorCache),
  simulador educacional de memória cache de Leandro Gabriel e colaboradores.
  MIT é a licença do código.

No exemplo didático, o resultado completo é **12 acertos, 9 faltas, 57,1% e
8/32 linhas usadas**. O acesso 20 remove **992–1007 (tag 3)** e insere
**3040–3055 (tag 11)** na **via 1 do conjunto 14**; a via 2 mantém 2016–2031.
As referências estáticas de vias do Figma foram reconciliadas durante as
entregas das telas 2 e 3.

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

Firefox/Safari e avaliação com participantes não são comprovados por esses
testes Chromium. O [guia de contribuição](../CONTRIBUTING.md) descreve como
executar as suítes e registrar novas verificações separadamente.

## Pendências acadêmicas e de escopo

- Consolidar o retorno da orientação e realizar/registrar a avaliação com
  estudantes conforme [#33](https://github.com/LuizJr2001/memora-cache-simulator-tcc/issues/33)
  e a avaliação da versão funcional na [#23](https://github.com/LuizJr2001/memora-cache-simulator-tcc/issues/23).
- Registrar a inspeção formal, dificuldades observadas e decisões decorrentes,
  sem tratar inspeções visuais ou testes automatizados como aprovação externa.
- Incorporar decisões, método, evidências e resultados ao artigo, conforme
  [#24](https://github.com/LuizJr2001/memora-cache-simulator-tcc/issues/24).
- Manter leitura/escrita, políticas de escrita e dirty bit como trabalho futuro
  na [#32](https://github.com/LuizJr2001/memora-cache-simulator-tcc/issues/32);
  exportação e comparação entre configurações não são funcionalidades entregues.

A existência da implementação e da publicação não fecha automaticamente as
issues de pesquisa, avaliação ou regressão com critérios adicionais.

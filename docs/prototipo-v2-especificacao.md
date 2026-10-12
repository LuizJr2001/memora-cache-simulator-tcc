# Memora — Especificação visual do protótipo v2

**Consolidação documental:** 11/10/2026  
**Figma vigente:** [página v2](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-2)  
**Revisões e evidências:** [issue #37](https://github.com/LuizJr2001/memora-cache-simulator-tcc/issues/37)

A página v2 é a referência provisória para a implementação das telas do Memora. Reúne a organização e os refinamentos de UX realizados em 08–09/10, após a reunião com Glívia em 02/10, e os ajustes de espaçamento da Ajuda rápida e de tipografia em 11/10. A [V1.2](prototipo-v1-2-especificacao.md) permanece como histórico e referência técnica do cenário didático.

A entrega no Figma contém telas estáticas. A aparência de abas, botões e side sheets especifica a interface; a navegação, a execução real e a operação por teclado serão implementadas em código. A avaliação externa segue na #33. As revisões visuais não representam aprovação dos participantes ou conclusão da implementação.

## Organização da página

- Telas principais à esquerda e seus side sheets à direita, em blocos separados por etapa
- Fluxo Configurar → Simular → Analisar indicado por setas com títulos laterais
- Blocos de variantes dos mapeamentos, erros de preenchimento/completude, Decimal/Binário, estado inicial/concluído e etapas da execução
- Blocos próprios para design system, comparação Beto × Memora e marca
- Página V1.2 preservada como referência anterior

| Etapa | Referência principal | Estados e conteúdos a implementar |
|---|---|---|
| 1 · Configurar | [Tela 1](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-14) | Memória principal, bloco, cache, três mapeamentos, vias condicionais, sequência, exemplo pronto, validações inline e bloqueio da execução |
| 2 · Simular | [Tela 2](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-1720) | Antes de iniciar, controles, velocidade, microetapas, conjunto atual, cache com scroll, validade/tag/bloco/LRU, histórico e conclusão |
| 3 · Analisar | [Tela 3](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-6473) | Acesso selecionado, snapshots antes/depois, bloco removido/inserido, recência e quatro passos didáticos |

Decimal/Binário altera apenas a apresentação de endereços, tags e blocos. A escolha deve ser preservada ao trocar de tela. A cache usa scroll local; o antigo botão Ver cache completa permanece removido.

## Sistema visual e componentes

O projeto mantém o **Simple Design System (SDS)** e a família **Inter**. As adaptações locais são registradas na [decisão 002](decisoes/002-simple-design-system.md). Forma, cor, texto e símbolos trabalham juntos para distinguir ação, preenchimento, informação e estado.

| Família | Forma e estado vigente | Tokens e aparência |
|---|---|---|
| Botões de ação | Pílula; texto Inter Bold (700), centralizado; estado desabilitado distinguível | `Radius/Full`, `Background/Brand/Default`, `Text/Brand/On Brand`; carvão `#2C2C2C` e texto `#F5F5F5` |
| Ajuda e fechar side sheet | Circular, com `?` ou `×` em Inter Bold (700), centralizado | Mesma identidade dos botões |
| Campos e seletores | Cantos retos, raio zero | `Radius/Campo` da coleção Memora · Extensões do SDS; branco com borda cinza e sinais de erro |
| Abas | Todos os rótulos em Inter Bold (700); cantos arredondados no topo; aba atual elevada, destacada e ligada ao conteúdo | Base Tab do SDS; componente `Memora/Navegação/Abas`, com três estados de seleção |
| Decimal/Binário | Mesma base dos botões; exatamente uma opção marcada | Símbolo `✓` junto ao rótulo atual |
| Balões de ajuda | Card SDS, raio de 16 px, sem borda | `Background/Ajuda` → `Blue/100`, `#F1F6FD`; texto `#1E1E1E`; `Radius/400` |

Os botões compartilham cor e forma em todas as etapas. A aba atual é reconhecida também pela forma e pela ligação ao conteúdo. A interface dispensa a instrução Clique nas abas para trocar de tela.

A codificação didática do Figma permanece: Tag violeta, Conjunto ciano, Deslocamento teal, LENDO azul, ACERTO verde, FALTA âmbar e erros de entrada/configuração em vermelho. A cor deve acompanhar rótulos e símbolos; a implementação ainda deve verificar contraste, foco e estados de interação.

### Tipografia — revisão em 11/10/2026

- **Inter é a única família** de todos os textos editáveis da v2: telas, variantes, side sheets, exemplos de componentes e valores técnicos, incluindo Decimal/Binário
- **Rótulos de botões e abas sempre em Bold (700)**, incluindo ações globais, controles da simulação, ajuda/fechar, links de ação e seleção do formato numérico; o peso é mantido nos estados selecionado e desabilitado
- Títulos, corpo, campos e dados mantêm a hierarquia de pesos definida para cada função; o negrito dos controles não se estende a todos os textos
- Estilos compartilhados: `Memora/SDS/Ações/12 Bold`, `13 Bold`, `14 Bold` e `16 Bold`; `Memora/SDS/Abas/16 Bold`, com entrelinha de 140%; entradas com `Memora/SDS/Entradas/13 Regular`
- Tamanhos, entrelinhas, cores e espaçamentos existentes foram preservados, assim como os textos e a centralização dos controles

**Conferência no Figma:** 4.833 nós de texto em Inter e 681 rótulos de ações/abas em Bold (700), sem divergência de família ou peso nesse escopo. A verificação não encontrou textos fora dos controles nem contêineres de ação descentralizados. Foram conferidas visualmente as três telas principais e a variante Decimal/Binário.

A implementação #35 deve carregar Inter e aplicar `font-weight: 700` aos rótulos de ações e abas. Esta revisão especifica o Figma; a aplicação no código e a validação responsiva continuam pendentes.

## Ajuda contextual e microcopy

Os 18 side sheets usam títulos com o nome do campo ou botão correspondente. Foram removidos rótulos redundantes como AJUDA CONTEXTUAL e AJUDA GERAL. Os textos orientam diretamente quem usa o simulador: Defina, Veja, Acompanhe e Compare.

Nos 15 side sheets de campo/resultado, a estrutura é **Descrição + Exemplo didático**. A descrição reúne explicação, regras/limitações e efeito na simulação, com redução de repetições. O antigo balão Na simulação foi incorporado à descrição. Os exemplos continuam fixos; os resultados reais pertencem às telas da simulação e da análise.

| Etapa | Side sheet | Estrutura |
|---|---|---|
| Configurar | [Bytes por célula](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-251) | Descrição e Exemplo didático |
| Configurar | [Total de células](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-386) | Descrição e Exemplo didático |
| Configurar | [Células por bloco](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-521) | Descrição e Exemplo didático |
| Configurar | [Número de linhas](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-656) | Descrição e Exemplo didático |
| Configurar | [Mapeamento](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-792) | Descrição e Exemplo didático |
| Configurar | [Vias por conjunto](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-927) | Descrição e Exemplo didático |
| Configurar | [Substituição](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-1062) | Descrição e Exemplo didático |
| Configurar | [Endereços a acessar](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-1197) | Descrição e Exemplo didático |
| Simular | [Estado LRU](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-2383) | Descrição e Exemplo didático |
| Simular | [Memória cache](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-2736) | Descrição e Exemplo didático |
| Simular | [Histórico de acessos](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-3082) | Descrição e Exemplo didático |
| Analisar | [Decisão de substituição](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-6786) | Descrição e Exemplo didático |
| Analisar | [Estado antes × depois](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-6956) | Descrição e Exemplo didático |
| Analisar | [LRU na decisão](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-7126) | Descrição e Exemplo didático |
| Analisar | [Decomposição do endereço](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-7296) | Descrição e Exemplo didático |
| Geral | [Como funciona?](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-7771) | Descrição e Exemplo didático |
| Geral | [Glossário](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-7907) | Uma lista com 12 termos |
| Geral | [Ajuda rápida](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-8070) | Um Card com três passos, orientação curta e links |

**Contagem vigente:** 34 instâncias de Card nos 18 side sheets: 30 nas ajudas de campo/resultado, 2 em Como funciona?, 1 no Glossário e 1 na Ajuda rápida.

### Como funciona?

Painel de 500 px, alinhado à largura da Ajuda rápida. Mantém dois balões: Descrição e Exemplo didático. O conteúdo essencial de Do endereço à cache foi resumido na descrição. ACERTO e FALTA aparecem destacados, e o exemplo organiza a arquitetura em linhas de Memória, Cache e Endereço.

### Ajuda rápida

Um único Card reúne Configurar, Simular e Analisar. A orientação contextual fica em texto curto abaixo dele; os links para o simulador original e o GitHub permanecem agrupados, com símbolo de link externo. Foram retirados a introdução repetitiva e o aviso de abertura em nova aba.

**Espaçamento revisado em 11/10:** os parágrafos dos três passos usam `Space/200` (8 px), ampliando a separação entre título e instrução e entre etapas. Os grupos de fluxo, orientação e links têm separação efetiva de 32 px, composta por intervalos e padding de `Space/400` (16 px). A revisão preservou o texto e foi conferida por screenshot; o conteúdo termina em 532 px dentro do painel de 900 px.

### Padrão dos balões e textos

- Corpo com Body Small do SDS e destaques com Body Small Strong
- Conteúdo em Auto Layout, com altura conforme o texto e largura de leitura preservada
- Mesmo azul claro em todos os balões, incluindo Glossário e Ajuda rápida
- Pontos finais retirados do encerramento dos textos/linhas; pontuação interna, abreviações e separadores numéricos preservados
- Fórmulas, regras dos mapeamentos e exemplos didáticos preservados nas ajudas pertinentes

## Cenário didático de referência

O cenário de comparação continua o da V1.2: 4096 células de 1 byte, blocos de 16 células, 32 linhas, mapeamento associativo por conjunto, 2 vias e LRU. São 12 bits de endereço: 4 de tag, 4 de conjunto e 4 de deslocamento.

A sequência é `0, 1, 16, 17, 32, 33, 48, 49, 64, 65, 992, 993, 2016, 2017, 2, 18, 34, 994, 2018, 3044, 96`.

- Acesso 19: 2018; 12 acertos e 7 faltas
- Acesso 20: 3044; sai 992–1007 e entra 3040–3055; 12 acertos e 8 faltas
- Acesso 21: 96; estado final com 12 acertos, 9 faltas, taxa de 57,1% e 8/32 linhas usadas

Esses valores são pontos de controle reproduzíveis para #28, #30 e #31. Na aplicação funcional, o motor deve produzir os resultados e preservar os snapshots anteriores à mutação.

## Relação com as heurísticas de Nielsen

| Heurística | Decisão de projeto relacionada |
|---|---|
| 1 · Visibilidade do estado | Aba atual, progresso, resultados, conjunto atual, LRU e término explícitos |
| 2 · Correspondência com o mundo real | Termos didáticos, relação endereço/cache e instruções dirigidas ao usuário |
| 3 · Controle e liberdade | Troca entre etapas, fechamento de ajudas e controles da execução |
| 4 · Consistência e padrões | Componentes SDS, identidade comum de botões/campos e estrutura compartilhada das ajudas |
| 5 · Prevenção de erros | Regras condicionais, validação antecipada e execução bloqueada em configurações inválidas |
| 6 · Reconhecimento | Estado da cache, histórico, LRU e opção Decimal/Binário reconhecíveis |
| 7 · Flexibilidade e eficiência | Exemplo pronto, geração de endereços, velocidade e avanço por etapa/acesso |
| 8 · Estética e minimalismo | Remoção de repetições, integração de balões e espaçamento entre grupos de texto |
| 9 · Recuperação de erros | Mensagens próximas dos campos e orientação para corrigir valores |
| 10 · Ajuda e documentação | Side sheets, Glossário, Ajuda rápida e links de referência |

As associações registram decisões do redesign. A inspeção formal com severidade e a avaliação dos participantes continuam como atividades a concluir; esta tabela não declara validação externa ou auditoria completa de acessibilidade.

## Histórico e rastreabilidade

| Data | Marco | Registro |
|---|---|---|
| 23/09 | Elaboração inicial concluída, após desvio de 8 dias em relação a 15/09 | #22 e #29 |
| 25/09 | Nome Memora e adoção do SDS | Decisões 001 e 002 |
| 30/09 | Código iniciado como frente paralela à avaliação; base de pacote proposta | #22, #34 e PR #36 |
| 02/10 | Reunião de UX com Glívia | #37 |
| 08/10 | Página v2, blocos, setas e pontuação | #37 |
| 09/10 | Abas, identidade dos controles, microcopy e simplificação dos side sheets | #37 |
| 11/10 | Mais espaçamento na Ajuda rápida e sincronização documental | #37 e revisão desta especificação |

## Implementação e avaliação

- #22 — calendário, metas e replanejamento
- #29 — elaboração e consolidação do protótipo
- #33 — avaliação com orientação e estudantes
- #34 — base do pacote `packages/memora`; proposta disponível no PR #36, ainda draft
- #35 — implementação funcional das telas e dos side sheets desta v2
- #37 — decisões e refinamentos de UX após a reunião
- #25–#28, #30 e #31 — regras, correções, LRU e regressão
- #24 — incorporação das decisões e evidências ao artigo

A implementação consumirá o motor em `src/core`, mantendo interface e interação em `src/ui`. Trocar de aba ou formato numérico deve preservar o estado; as ajudas devem abrir/fechar por teclado e restaurar o foco. Cada entrega visual deve registrar referência, screenshots e verificações dos estados envolvidos.

A avaliação do protótipo continua com telas/imagens estáticas, da Tela 1 para a Tela 3, da esquerda para a direita. O Figma é apoio opcional para consultar detalhes; a avaliação da versão funcional pertence à etapa seguinte (#23). O código, a regressão, a consolidação da avaliação e a atualização do artigo permanecem pendentes nas respectivas issues.

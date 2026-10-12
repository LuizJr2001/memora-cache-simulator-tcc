# Memora — Histórico da especificação visual V1.2

**Atualização:** 30/09/2026  
**Figma:** https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=92-2

**Referência vigente:** [especificação v2](prototipo-v2-especificacao.md) e [página v2 no Figma](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-2). Este documento preserva as decisões e o cenário da V1.2; as regras visuais revisadas em outubro estão na v2.

Este documento consolida a especificação visual da V1.2 do **Memora**, nova identidade do projeto de aprimoramento do simulador educacional de memória cache, após revisão do sistema legado, questionário com usuários, inspeção heurística de Nielsen e refinamentos sucessivos no Figma.

> Importante: este documento descreve a **especificação de interface e comportamento esperado**. Não significa que todos os itens já estejam implementados no código.

## 0. Identidade do projeto

A partir de **25/09/2026**, a proposta aprimorada passa a se chamar **Memora**.

O nome foi adotado para separar visual e conceitualmente a nova proposta do sistema legado, sem apagar sua origem. A marca visível da nova interface passa a ser Memora; telas comparativas usam **simulador legado × Memora**; e materiais históricos podem continuar mencionando **Beto** quando isso for necessário para preservar contexto e fidelidade documental.

A decisão completa está registrada em `docs/decisoes/001-nome-memora.md`.

## 0.1 Sistema visual adotado

Após comparação de alternativas de design system, o protótipo passou a adotar o **Simple Design System (SDS)** como principal referência visual para as telas do Memora.

A adoção do SDS não significa copiar uma biblioteca pronta. O sistema é usado como referência para:

- superfícies claras e neutras;
- cartões com bordas discretas e raio de 8 px;
- hierarquia baseada em tipografia, espaçamento e contraste, evitando excesso de decoração;
- botões primários escuros e ações secundárias claras;
- campos com bordas simples e alinhamento consistente;
- estados desabilitados visíveis, mas sem competir com ações disponíveis;
- ícones de ajuda posicionados próximos ao limite direito dos respectivos componentes;
- setas de campos de seleção alinhadas à borda direita;
- cabeçalho, indicador de etapas e side sheets consistentes entre Configurar, Simular e Analisar.

As cores didáticas específicas do domínio foram preservadas sobre essa base visual:

- **Tag** — violeta;
- **Conjunto** — ciano;
- **Deslocamento** — teal;
- **LENDO** — azul;
- **ACERTO** — verde;
- **FALTA** — âmbar;
- **ERRO** — vermelho.

A decisão de adotar SDS está registrada em `docs/decisoes/002-simple-design-system.md`.

## 0.2 Marca e ícone

A marca visível do projeto é **Memora**.

O antigo bloco com a letra “B” foi removido. O cabeçalho utiliza agora um **ícone próprio de memória/cache**, fornecido no Figma e reaproveitado como fonte única para todas as telas. O ícone é redimensionado dentro do bloco de marca, preservando o mesmo arquivo visual em vez de recriações vetoriais aproximadas.

## 1. Estrutura geral

O protótipo mantém o fluxo:

1. **Configurar**
2. **Simular**
3. **Analisar**

A proposta reduz a densidade visual sem remover conteúdo didático, usando agrupamento, scroll local e divulgação progressiva.

## 2. Tela 0 — comparação legado × proposta

A tela de comparação foi atualizada para refletir o estado atual da proposta:

- estado inicial antes da primeira simulação;
- três mapeamentos explicitados;
- vias configuráveis/fixas conforme o mapeamento;
- ajuda contextual estática;
- cache com scroll;
- visualização Decimal/Binário;
- estados LENDO, ACERTO e FALTA;
- tela de configuração inválida;
- análise antes/depois e fluxo genérico de substituição.

## 3. Configuração

A Tela 1 e suas variantes foram convertidas para o padrão SDS, incluindo:

- tela principal;
- totalmente associativo;
- associativo por conjunto;
- mapeamento direto;
- casos inválidos;
- ajudas contextuais 1.1–1.8;
- overlays de Como funciona?, Glossário e Ajuda rápida.

A revisão também corrigiu alinhamento dos seletores, ícones de ajuda, botões inferiores, mensagens de erro e espaçamentos entre rótulos e campos.

### 3.1 Mapeamentos

Foram especificados três estados:

- **Direto:** 1 linha por conjunto, fixa; política de substituição não se aplica.
- **Associativo por conjunto:** vias por conjunto configuráveis; exemplo de 4 vias = 8 conjuntos.
- **Totalmente associativo:** 1 conjunto; todas as 32 linhas são vias; valor fixo.

A decomposição do endereço muda conforme o mapeamento.

### 3.2 Casos inválidos

A tela de erro foi redesenhada para evitar sobreposição e mostrar:

- campo inválido com borda vermelha;
- mensagem inline próxima ao campo;
- resumo de pendências;
- decomposição indisponível;
- execução bloqueada.

Exemplos representados:

- total de células não potência de 2;
- número de vias incompatível com o total de linhas;
- endereços negativos, fora do intervalo ou não numéricos.

### 3.3 Ajuda contextual

Os side sheets da Tela 1 foram padronizados como conteúdo **estático e documental**:

1. regra/limitação;
2. exemplo didático fixo;
3. efeito na simulação.

O campo **Endereços a acessar** usa esse mesmo nome na ajuda contextual.

Também existem:

- **Glossário**;
- **Ajuda rápida**;
- link **GitHub**;
- link externo para o **simulador original**.

## 4. Simulação

Todas as telas da etapa Simular foram convertidas para SDS:

- estado antes de iniciar;
- execução principal;
- microetapas;
- ajudas contextuais;
- modo binário;
- estado concluído.

A revisão padronizou métricas, controles, histórico, tabela da cache, estados vazios, ações desabilitadas e side sheets. O estado concluído preserva a barra de controles e apresenta o término sem sobrepor o histórico.

### 4.1 Estado antes de iniciar

Foi criada a tela **2.0 — Antes de iniciar**, com:

- progresso 0/21;
- acertos e faltas em zero;
- taxa de acerto indisponível;
- cache vazia;
- histórico vazio;
- botão **Iniciar** habilitado;
- ações dependentes da execução desabilitadas.

### 4.2 Cache

A cache principal agora possui:

- scroll vertical;
- conjunto atual destacado;
- várias linhas visíveis simultaneamente;
- colunas de conjunto, via, validade, tag, bloco, LRU e ação;
- seletor Decimal/Binário.

O botão **Ver cache completa** foi removido por redundância e a antiga Tela 2.B foi removida.

### 4.3 Estados de acesso

O histórico e os microestados usam semântica consistente:

- **LENDO** — azul;
- **ACERTO** — verde;
- **FALTA** — âmbar;
- **ERRO / configuração inválida** — vermelho.

A falta de cache é tratada como resultado normal da simulação, não como erro do estudante. O resultado não depende apenas da cor: há texto, símbolo e contexto.

### 4.4 Ajuda da simulação

As ajudas de Estado LRU, Memória cache e Histórico foram padronizadas como documentação estática:

- interpretação;
- exemplo didático;
- por que isso é útil.

Nenhuma delas depende do acesso atual.

## 5. Análise

Todas as telas da etapa Analisar foram convertidas para SDS, incluindo as ajudas 3.1–3.4 e a demonstração binária.

A organização final usa superfícies neutras, botão primário escuro, cartões antes/depois, destaque semântico para bloco que sai/entra e quatro passos didáticos estáticos.

A Tela 3 mantém os dados dinâmicos necessários:

- endereço analisado;
- estado antes/depois;
- bloco que sai;
- bloco que entra;
- atualização de recência.

A explicação didática foi simplificada para um fluxo estático de quatro passos:

1. **Localizar conjunto**
2. **Verificar acerto**
3. **Aplicar política**
4. **Atualizar cache**

Isso evita lógica textual excessivamente dinâmica na implementação.

As ajudas 3.1–3.4 também foram padronizadas com:

- regra/interpretação;
- exemplo didático fixo;
- por que isso é útil.

## 6. Legibilidade e consistência

A V1.2 usa:

- Inter como família principal;
- IBM Plex Mono para binários e valores técnicos;
- textos principais ampliados;
- botões globais homogêneos;
- side sheets com cards consistentes;
- alinhamento e espaçamento revisados;
- correções de overflow e sobreposição em telas 1, 2 e 3;
- padronização visual das três etapas pelo Simple Design System;
- alinhamento de setas de seleção e ícones de ajuda;
- estados finais e inválidos revisados para evitar elementos fora do container;
- ícone de marca único reutilizado em todos os cabeçalhos;
- cores conceituais separadas de cores de estado;
- vermelho reservado a erros reais de entrada/configuração.

## 7. Relação com issues

A especificação visual se relaciona diretamente com:

- #25 — validação dos parâmetros;
- #26 — validação dos endereços;
- #28 — estado LRU e linha candidata;
- #29 — reorganização visual, ajuda contextual, identidade visual e adoção do SDS;
- #30 — preservação do bloco removido antes da mutação;
- #31 — regressão dos mapeamentos e políticas;
- #32 — load/store, dirty bit e políticas de escrita permanecem como trabalho futuro.

## 8. Status

A V1.2 permanece como **referência histórica**. A implementação e a avaliação devem consultar a [especificação v2](prototipo-v2-especificacao.md), que consolida os refinamentos posteriores.

### Atualização do planejamento — 30/09/2026

Conforme informado pelo autor, a elaboração inicial do protótipo foi concluída em **23/09/2026**, após demandar mais tempo do que o previsto para 15/09. Os registros de revisões e decisões de 24–25/09 permanecem como refinamentos posteriores.

Enquanto a avaliação externa é aguardada na [issue #33](https://github.com/LuizJr2001/memora-cache-simulator-tcc/issues/33), foi decidido iniciar o código em paralelo. O feedback poderá gerar ajustes no protótipo e na implementação, registrados nas issues e nos pull requests correspondentes. A conclusão da prototipação não equivale à aprovação externa, ao congelamento definitivo da interface ou à conclusão do código.

O cronograma revisto e o impacto sobre os marcos técnicos estão registrados na [issue #22](https://github.com/LuizJr2001/memora-cache-simulator-tcc/issues/22).

Ainda dependem de código e testes:

- validações reais;
- regras condicionais dos mapeamentos;
- atualização dinâmica da cache;
- cálculo e atualização de LRU;
- histórico;
- fluxo LENDO → ACERTO/FALTA;
- persistência/atualização dos estados;
- testes de regressão.

# Decisão 002 — Adoção do Simple Design System

**Status:** aceita  
**Data da adoção:** 25/09/2026  
**Regras vigentes atualizadas:** 23/10/2026

> A descrição do Figma preserva as revisões de 12–14/10. Na aplicação, o PR #60 reduziu o fluxo a Configurar → Simular com comparação contextual e 16 ajudas. Os PRs #61/#62 substituíram os botões carvão por roxo preenchido. Os dados e datas de inspeção do Figma abaixo não são novas verificações da aplicação.

**Escopo:** protótipo visual, componentes de interface e implementação funcional

## Contexto

Durante o refinamento do protótipo do Memora foram comparadas alternativas de organização visual inspiradas em diferentes design systems. O objetivo não era copiar integralmente um sistema externo, mas encontrar uma base consistente para reduzir ruído visual, melhorar alinhamento e facilitar a implementação.

Foram avaliadas referências inspiradas em:

- Carbon Design System;
- Material 3;
- Simple Design System (SDS).

A variante baseada em SDS apresentou melhor aderência à proposta desejada para o Memora: interface acadêmica/técnica, neutra, legível e com baixa carga decorativa.

## Decisão

O **Simple Design System (SDS)** passa a ser a principal referência visual do protótipo.

A adoção vale para as três etapas principais:

1. Configurar;
2. Simular;
3. Analisar.

## Regras consolidadas

### Estrutura

- fundo geral cinza-claro;
- superfícies principais brancas;
- balões de ajuda com raio de 16 px (`Radius/400`);
- bordas discretas;
- hierarquia construída principalmente por tipografia, espaçamento e contraste.

### Cabeçalho e fluxo

- cabeçalho branco;
- marca Memora à esquerda;
- Glossário e Ajuda rápida à direita; Abrir GitHub disponível dentro da Ajuda rápida;
- navegação por abas Configurar, Simular e Analisar, com aparência de navegador;
- aba atual elevada, destacada e conectada ao conteúdo; as demais são destinos reconhecíveis;
- componente `Memora/Navegação/Abas`, com três variantes, baseado em Tab do SDS.

### Configurar sem rolagem no desktop — revisão em 12/10/2026

A Tela 1 e suas representações SDS na v2 passam de 1280 × 900 para
1280 × 720. O cabeçalho tem 52 px, os três campos de memória principal ficam
lado a lado e os painéis usam intervalos menores. As abas mantêm sua forma,
pesos e destaque da etapa atual. Os erros ficam junto aos campos; a contagem
geral é reservada aos leitores de tela.

A implementação adapta o espaço à altura disponível, com controles de 36 px
em desktops de até 800 px de altura útil e textos em seus tamanhos legíveis.
Os estados de validação reservam espaço para mensagens próximas dos campos.
Textos extensos da sequência usam rolagem local por teclado. Telas menores
mantêm painéis empilhados e fluxo vertical.

O botão GitHub foi retirado dos 40 cabeçalhos da v2, porque repete o link
Abrir GitHub da Ajuda rápida. A organização dos links na ajuda foi preservada.
A revisão do Figma e a implementação são rastreáveis no PR #43 e nas #35/#37.

Em 14/10, foram corrigidos os encaixes em 801 × 720, 1024 × 768 e no
endereço de 52 bits em 1280 × 720. Entre 801 e 1200 px, o cabeçalho organiza
título/botão e orientação em duas linhas; espaçamento e proporções dos cartões
se ajustam, sem reduzir fontes ou esconder bits. Erros longos de parâmetros
podem rolar localmente, com foco por teclado, em áreas úteis pequenas.

A prévia recebe o rótulo **Primeiro endereço: …**; entradas inválidas mostram
**Prévia indisponível**. O novo componente `Memora/Configurar/Prévia do endereço`
reutiliza `Text/Default/Secondary`, Inter Regular 12 px e entrelinha de 16 px.
Não é um botão e mantém peso regular. As 18 representações SDS de Configurar
foram sincronizadas: Por conjunto habilita vias/substituição; Direto desabilita
ambas; Totalmente associativo fixa vias e permite escolher substituição.

### Controles

- na aplicação, todos os botões de ação usam roxo `#75609A`, texto branco `#FFFFFF` em Inter Bold (700) e pílula `Radius/Full`; o carvão `#2C2C2C` registra a referência anterior do Figma;
- ajuda e fechar side sheet circulares, com a mesma identidade;
- campos e seletores com cantos retos, raio zero (`Radius/Campo`), branco e borda cinza;
- estado desabilitado distinguível por menor opacidade, com verificação de contraste ainda necessária;
- textos centralizados;
- setas de selects próximas à borda direita;
- ícones de ajuda próximos ao canto direito do componente relacionado;
- Decimal/Binário com a mesma base visual de botão e símbolo `✓` na opção selecionada.

### Cores semânticas

Em 12/10/2026, os balões informativos das três etapas foram reunidos na mesma família de cor dos side sheets. Tag, Conjunto/Linha e Deslocamento deixam de receber violeta, ciano e teal; os rótulos e a posição identificam as partes do endereço.

- **Informação:** `Background/Informação` e `Background/Ajuda` são aliases do mesmo `Blue/100` do SDS, `#F1F6FD`; texto neutro `Text/Default/Default`, `#1E1E1E`
- **Consulta:** `Accent/Consulta` é alias de `Blue/800`, `#224A8A`; relaciona badges, indicadores laterais e bordas das linhas do conjunto atual
- **Leitura em andamento:** família azul acompanhada de LENDO
- **Condição positiva:** família verde acompanhada de ACERTO ou validação; os destaques existentes de recência/manutenção/inserção nas tabelas permanecem por enquanto
- **Falta/substituição pendente:** família âmbar acompanhada de FALTA, Candidata ou indicação de substituição
- **Erro de entrada/configuração:** família vermelha acompanhada de mensagem para corrigir dados
- **Ação:** roxo preenchido `#75609A`, com hover `#655184` e clique/seleção `#56436F` na aplicação (PRs #61/#62); as abas preservam sua geometria e tratamento próprios

`Background/Informação` tem escopos de preenchimento de frame/forma; `Accent/Consulta` tem escopos de preenchimento de frame/forma/texto e borda. Ambos usam aliases, sem duplicar os valores primitivos, e sintaxe WEB `var(--memora-info-background)` e `var(--memora-current-set-accent)`. As bordas informativas reutilizam `Border/Default/Default`. A revisão preservou Inter, pesos, textos e geometria.

**Opções a avaliar, ainda não aplicadas:** laranja para FALTA, mantendo vermelho para dados inválidos; tons neutros para recência/Mantida/Inserida nas tabelas, reservando o verde dos resultados para ACERTO. A falta na cache é um resultado esperado que exige buscar o bloco. Âmbar continua vigente até uma eventual revisão rastreável.

A justificativa combina [semelhança da Gestalt](https://www.nngroup.com/articles/gestalt-similarity/) e [consistência e padrões de Nielsen](https://www.nngroup.com/articles/consistency-and-standards/). Convenções de [indicadores de estado do Carbon](https://www.carbondesignsystem.com/building-blocks/core/patterns/status-indicators) apoiam a discussão; não substituem o SDS nem determinam a cor de falta na cache. As [WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) exigem sinais além de cor. Os pares alterados passaram pelo [contraste mínimo de texto](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html): 15,32:1 para informação e 8,00:1 para badges de consulta sobre azul claro. A verificação é limitada aos pares modificados; foco, interação e contraste dos demais estados continuam a validar na #35.

### Tipografia

- Inter como única família para todos os textos editáveis da v2, inclusive valores técnicos, Decimal/Binário, variantes, side sheets e exemplos de componentes;
- rótulos de botões, ajuda/fechar, links de ação, seletores de formato e todas as abas em Bold (700), inclusive nos estados selecionado e desabilitado;
- títulos, corpo, campos e dados preservam seus pesos conforme a hierarquia de cada função;
- estilos compartilhados `Memora/SDS/Ações/{12,13,14,16} Bold`, `Memora/SDS/Abas/16 Bold` e `Memora/SDS/Entradas/13 Regular`;
- tamanhos, entrelinhas e alinhamentos preservados; a diferenciação da aba atual continua pela forma, cor e ligação ao conteúdo.

O negrito uniforme dos controles é uma adaptação local do Memora sobre o SDS. A revisão de 11/10/2026 verificou 4.833 nós de texto em Inter e 681 rótulos de ações/abas em Bold (700), sem divergências de família/peso, cortes nos controles ou descentralização. A regra deve ser reproduzida na implementação #35.

### Side sheets

- superfície branca;
- fundo da tela preservado com scrim;
- Cards SDS com raio de 16 px e fundo único `Background/Ajuda` → `Blue/100` (`#F1F6FD`), com texto `#1E1E1E`;
- corpo Body Small e destaques Body Small Strong, em Inter;
- conteúdo estático/documental e linguagem dirigida ao usuário;
- título com o nome do campo/botão; Descrição reúne explicação, regras e efeito na simulação; Exemplo didático fica separado;
- 18 side sheets, com 34 Cards na revisão visual de 14/10;
- Como funciona? com dois Cards e largura de 500 px;
- Glossário em uma lista com 12 termos; Ajuda rápida em um Card com três passos, orientação curta e links;
- espaçamento dos parágrafos da Ajuda rápida com `Space/200` (8 px) e separação efetiva de 32 px entre os grupos, usando intervalos/padding de `Space/400` (16 px).

## Referência visual e estado da aplicação

A [especificação v2](../prototipo-v2-especificacao.md) e a [issue #37](https://github.com/LuizJr2001/memora-cache-simulator-tcc/issues/37) consolidam as revisões de outubro. Os raios, a identidade comum de botão e os agrupamentos são decisões locais do Memora sobre a base SDS. A aplicação no Figma permanece uma entrega visual histórica; a implementação funcional está na `main`. Avaliação externa (#33) e verificação integral de acessibilidade permanecem pendentes.

## Aplicação realizada

O padrão SDS foi aplicado a:

- todas as variantes da Tela 1;
- casos inválidos e ajudas da Tela 1;
- todas as variantes da Tela 2, incluindo pré-início, microetapas, conclusão e binário;
- ajudas da Tela 2;
- todas as variantes da Tela 3;
- ajudas da Tela 3;
- demonstração binária da Tela 3.

Também foram corrigidos durante a conversão:

- alinhamentos;
- sobreposições;
- elementos fora dos containers;
- botões descentralizados;
- duplicidade visual de cabeçalhos;
- estados finais da simulação;
- espaçamento entre rótulos, helpers e campos.

## Consequências

- novos componentes devem seguir esse padrão antes de introduzir estilos próprios;
- a implementação deve priorizar consistência entre estados, não reprodução pixel a pixel do Figma;
- contraste de pares específicos e navegação/foco têm verificações técnicas registradas; a avaliação integral de acessibilidade permanece pendente;
- alterações futuras no design system devem ser registradas antes de propagá-las para todas as telas.

## Atualização funcional — 23/10/2026

A comparação antes/depois foi integrada a Simular no PR #60. As três telas e
18 ajudas descritas no Figma são históricas; o código contém duas etapas e 16
ajudas estáticas. O rótulo visível Primeiro endereço foi removido da prévia,
com origem preservada na descrição acessível.

Os botões preenchidos em roxo mantêm a informação em azul claro visualmente
distinta das ações. A mudança foi integrada nos PRs #61/#62; a proposta
intermediária de botões secundários apenas com contorno foi substituída.
O contraste branco/roxo principal calculado é 5,39:1; nos estados hover e ativo,
6,85:1 e 8,65:1. Esses valores verificam apenas esses pares, sem constituir
uma auditoria completa de acessibilidade. Sintaxe, 78 testes Node e build foram
executados; uma nova inspeção visual da paleta em Chromium ficou pendente.

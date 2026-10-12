# Decisão 002 — Adoção do Simple Design System

**Status:** aceita  
**Data da adoção:** 25/09/2026  
**Regras vigentes atualizadas:** 12/10/2026

**Escopo:** protótipo visual, componentes de interface e futura implementação

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
- ações globais à direita;
- navegação por abas Configurar, Simular e Analisar, com aparência de navegador;
- aba atual elevada, destacada e conectada ao conteúdo; as demais são destinos reconhecíveis;
- componente `Memora/Navegação/Abas`, com três variantes, baseado em Tab do SDS.

### Controles

- botões de ação com a mesma cor e forma: carvão `#2C2C2C`, texto `#F5F5F5` em Inter Bold (700) e pílula `Radius/Full`;
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
- **Ação:** mantém a identidade carvão dos botões

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
- 18 side sheets, com 34 Cards na revisão vigente;
- Como funciona? com dois Cards e largura de 500 px;
- Glossário em uma lista com 12 termos; Ajuda rápida em um Card com três passos, orientação curta e links;
- espaçamento dos parágrafos da Ajuda rápida com `Space/200` (8 px) e separação efetiva de 32 px entre os grupos, usando intervalos/padding de `Space/400` (16 px).

## Referência vigente

A [especificação v2](../prototipo-v2-especificacao.md) e a [issue #37](https://github.com/LuizJr2001/memora-cache-simulator-tcc/issues/37) consolidam as revisões de outubro. Os raios, a identidade comum de botão e os agrupamentos são decisões locais do Memora sobre a base SDS. A aplicação no Figma permanece uma entrega visual; avaliação externa (#33), implementação (#35) e acessibilidade funcional seguem em andamento.

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
- acessibilidade, contraste, foco e navegação por teclado ainda precisam ser validados no código;
- alterações futuras no design system devem ser registradas antes de propagá-las para todas as telas.

# Decisão 002 — Adoção do Simple Design System

**Status:** aceita  
**Data da adoção:** 25/09/2026  
**Regras vigentes atualizadas:** 11/10/2026  
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

- botões de ação com a mesma cor e forma: carvão `#2C2C2C`, texto `#F5F5F5` e pílula `Radius/Full`;
- ajuda e fechar side sheet circulares, com a mesma identidade;
- campos e seletores com cantos retos, raio zero (`Radius/Campo`), branco e borda cinza;
- estado desabilitado distinguível por menor opacidade, com verificação de contraste ainda necessária;
- textos centralizados;
- setas de selects próximas à borda direita;
- ícones de ajuda próximos ao canto direito do componente relacionado;
- Decimal/Binário com a mesma base visual de botão e símbolo `✓` na opção selecionada.

### Cores didáticas

A base neutra do SDS não substitui a codificação pedagógica do Memora:

- Tag — violeta;
- Conjunto — ciano;
- Deslocamento — teal;
- LENDO — azul;
- ACERTO — verde;
- FALTA — âmbar;
- ERRO — vermelho.

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

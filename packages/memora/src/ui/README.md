# Interface Memora

Esta pasta implementa a Tela 1 — Configurar e seus side sheets, conforme #35.
Simular, Analisar e a execução da cache continuam pendentes.

Referência: [especificação v2](../../../../docs/prototipo-v2-especificacao.md) e o Figma nela indicado; refinamentos de UX acompanhados na #37.
Consultar a especificação e o design atualizado antes de implementar cada tela.
As abas, a identidade dos controles, a estrutura dos 18 side sheets e o
espaçamento da Ajuda rápida seguem a revisão vigente.

`configuration-controller.js` mantém dados editáveis e consome as validações,
geração, decomposição e `prepareSimulationInput` de `src/core`. Não cria cache.
`configure-screen.js` liga esse controlador ao DOM, apresenta mensagens e emite
`memora:input-prepared` somente com uma entrada válida.
As validações continuam junto aos campos, com borda vermelha e feedback
específico; não há aviso geral vermelho visível no título. O resumo global
permanece reservado aos leitores de tela (`sr-only`, `role=status`,
`aria-live=polite`), e o subtítulo introdutório não desaparece em erros.
O símbolo `#configuration-symbol` é centralizado verticalmente no cartão
**Configuração com erros** por `align-self: center`, sem alterar a posição
dos textos. A estrutura `.sequence-bottom` reúne decomposição, botões
e nota para evitar espaçamento excessivo entre cartões e ações. A decomposição é uma
prévia binária do primeiro endereço de uma sequência válida; campos de zero bits usam um traço.
`#preview-label` identifica esse endereço em decimal; parâmetros ou sequência
inválidos exibem Prévia indisponível. A descrição completa permanece em
`#preview-address`, associada aos cartões para leitores de tela.
Em larguras intermediárias, erros extensos dos parâmetros têm rolagem local
e recebem foco por teclado, preservando o texto e a altura da página.
O futuro seletor Decimal/Binário pertence às telas seguintes.

`side-sheet.js` usa um dialog modal nativo, com foco contido, Escape e retorno do
foco. `help-content.js` contém os textos visíveis da v2: 8 ajudas de campo,
Como funciona?, Glossário e Ajuda rápida. O foco inicial é o botão de fechar;
o conteúdo tem scroll e pode receber foco para operação por teclado.
Side sheets apresentam conteúdo didático estático; a análise antes/depois usa
snapshots do motor, preservando os valores removidos antes da mutação (#30).

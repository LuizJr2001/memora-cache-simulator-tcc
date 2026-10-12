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
`memora:input-prepared` somente com uma entrada válida. A decomposição é uma
prévia binária do primeiro endereço da sequência; campos de zero bits usam um traço.
O futuro seletor Decimal/Binário pertence às telas seguintes.

`side-sheet.js` usa um dialog modal nativo, com foco contido, Escape e retorno do
foco. `help-content.js` contém os textos visíveis da v2: 8 ajudas de campo,
Como funciona?, Glossário e Ajuda rápida. O foco inicial é o botão de fechar;
o conteúdo tem scroll e pode receber foco para operação por teclado.
Side sheets apresentam conteúdo didático estático; a análise antes/depois usa
snapshots do motor, preservando os valores removidos antes da mutação (#30).

# Interface Memora

Esta pasta receberá as telas Configurar, Simular e Analisar e os componentes de
ajuda contextual, conforme #35. As telas ainda não estão implementadas.

Referência: [especificação v2](../../../../docs/prototipo-v2-especificacao.md) e o Figma nela indicado; refinamentos de UX acompanhados na #37.
Consultar a especificação e o design atualizado antes de implementar cada tela.
As abas, a identidade dos controles, a estrutura dos 18 side sheets e o
espaçamento da Ajuda rápida seguem a revisão vigente.

A interface consome o motor de `src/core`, controla execução e seleção do acesso
e formata valores para Decimal/Binário. Não decide qual bloco deve ser removido.
Side sheets apresentam conteúdo didático estático; a análise antes/depois usa
snapshots do motor, preservando os valores removidos antes da mutação (#30).

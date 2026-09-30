# Interface Memora

Esta pasta receberá as telas Configurar, Simular e Analisar e os componentes de
ajuda contextual, conforme #35. As telas ainda não estão implementadas.

Referência: `docs/prototipo-v1-2-especificacao.md` e o Figma nela indicado.
Consultar a especificação e o design atualizado antes de implementar cada tela.

A interface consome o motor de `src/core`, controla execução e seleção do acesso
e formata valores para Decimal/Binário. Não decide qual bloco deve ser removido.
Side sheets apresentam conteúdo didático estático; a análise antes/depois usa
snapshots do motor, preservando os valores removidos antes da mutação (#30).

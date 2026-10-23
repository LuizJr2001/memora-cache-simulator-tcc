# 004 — Integrar a análise à simulação

Data: 23/10/2026. Estado: proposta implementada para revisão por PR.

## Evidência e decisão

Ao testar a sequência com dez substituições, o autor questionou a utilidade da
terceira etapa. A inspeção do fluxo confirmou que Simular já apresenta histórico,
decomposição, roteiro e motivo da decisão. Analisar repetia esses elementos e
exigia trocar de tela para ver os snapshots; seu Próximo acesso também podia
executar um acesso novo, misturando revisão e execução.

O fluxo passa a **Configurar → Simular**. O ganho educacional específico da análise
— comparar os estados reais antes/depois — é preservado em **Comparar antes e depois**,
recolhido no cartão Memória cache. Aberto, ocupa o lugar da tabela, sem acrescentar
outro painel permanente nem repetir decomposição e roteiro. Selecionar o histórico
atualiza a comparação; recolher restaura a tabela.

## Comportamento

- Comparação disponível após um acesso concluído, inclusive acerto ou via livre.
- Snapshots, vítima, blocos Sai/Entra e recência LRU preservados; FIFO, Random e direto mantêm seus critérios.
- Acesso anterior/seguinte revisam apenas registros existentes e nunca executam a simulação.
- Revisão sincroniza histórico e cache; contadores permanecem os da execução atual.
- Abrir pausa a reprodução; retomar recolhe a comparação. Etapas pendentes são preservadas.
- Reiniciar ou alterar a configuração limpa a comparação. Decimal/Binário é compartilhado.

## Limites e validação

A mudança reduz a troca de contexto sem retirar a comparação usada para explicar
substituições. O protótipo de três telas e seus relatórios permanecem históricos;
esta decisão não registra validação externa com estudantes. A regressão verifica
snapshots e políticas, navegação sem execução, teclado/foco, reset, entradas grandes
e layout responsivo. A avaliação com orientação e estudantes continua necessária
para medir a clareza do fluxo integrado.

Validação local: 78 testes Node e 93 cenários Chromium aprovados; sintaxe e build estático verificados. Layout, teclado e snapshots inspecionados em desktop e telas menores.

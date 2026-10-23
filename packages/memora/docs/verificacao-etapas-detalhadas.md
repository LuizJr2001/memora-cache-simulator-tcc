# Etapas detalhadas — 14/10/2026

## Problema e comportamento

O controle alterava somente o avanço automático; o passo manual permanecia uma microetapa e não havia mudança visível no conteúdo. O histórico omitia validade, comparação de tags e o motivo da escolha da vítima.

A opção agora alterna apresentação e avanço manual/automático. Marcada: seis fases, decomposição binária agrupada, explicações e destaque de tags. Desmarcada: um acesso por avanço, roteiro oculto e resumo preservado. Alterar o modo mantém o acesso pendente e não duplica a contagem. A taxa acompanha a unidade (etapas ou acessos por segundo).

Na revisão de 23/10/2026, a descrição do modo passou a ficar junto de **Etapas detalhadas**, entre parênteses: **avança uma etapa e explica a decisão** quando marcada e **avança um acesso completo** quando desmarcada. O botão de conclusão usa fundo cinza, com check e texto verdes. A tabela da cache preenche a altura disponível do cartão, sem o limite de altura do layout anterior, mantendo a rolagem interna.

As descrições distinguem primeira leitura do bloco, acerto, bloco ausente após remoção, linha livre e substituição. FIFO usa ordem de chegada; LRU usa recência; Random usa a escolha já realizada pelo motor. Os textos preservam os intervalos antes e depois da substituição. A classificação compulsória usa os blocos acessados anteriormente, inclusive ao revisar snapshots antigos.

## Verificação

- Sintaxe: 24 arquivos JavaScript.
- 65 testes Node: políticas, snapshots, troca de modo no meio do acesso, um relógio por execução, taxa inicial de 5 e explicações (inclusive 52 bits).
- 25/25 cenários Chromium da suíte Simular aprovados: modo marcado/desmarcado, seis fases, estatísticas, políticas, revisão, teclado, ajuda, formato e aviso de análise.
- Desktop sem scroll da página em 1280×720, 1366×768, 1480×742 e 1920×1080, incluindo execução concluída e revisão. Cache permanece com pelo menos 160 px de rolagem local.
- Sem overflow horizontal em 1024, 801, 768, 390 e 320 px.
- Capturas de estado, seleção da vítima e conclusão inspecionadas em Chromium 153.
- Compatibilidade do contrato Configurar → Simular: 1/1 cenário Chromium aprovado.

A observação externa com estudantes e os testes em Firefox/Safari permanecem pendentes.

Refs #35, #30, #31

# 005 — Sugestões complementares de reprodução e configuração

Data: 11/11/2026. Origem: fichas P05 e P06 consolidadas no PR #96; execução na #97. O retorno ao estado atual já foi integrado no PR #95.

## Decisão

- Oferecer de 0,25 a 10 passos/acessos por segundo em intervalos de 0,25. A abertura continua em 5. No mínimo, há quatro segundos entre pulsos. Uma mudança de velocidade cancela o relógio anterior; os snapshots e os resultados não mudam.
- Mostrar junto ao seletor uma explicação breve do mapeamento selecionado. As ajudas completas continuam disponíveis.
- Oferecer **Editar em blocos** no painel da sequência, sem retirar o campo textual, a colagem ou o gerador. O painel lateral edita um rascunho; **Aplicar sequência** atualiza o campo e invalida uma simulação preparada. Fechar sem aplicar conserva a entrada anterior.
- Reutilizar o fracionamento e a validação do núcleo. Cada bloco deve conter um endereço; separadores dentro de um bloco são rejeitados. Ordem, repetições, itens vazios e valores fora do limite são preservados para correção. Não truncar entradas acima de 1000 endereços/18000 caracteres.

## Alcance

As sugestões são hipóteses de melhoria e não resultados de uma nova avaliação. Não alterar P01–P07 nem converter a satisfação relatada em nota. A descoberta do editor e a adequação do novo ritmo precisam de reobservação na #70, com versão/commit e intervenções registrados.

## Verificação desta revisão

Sintaxe, 81 testes Node e build executados localmente. Os testes incluem os limites do editor, separadores inseridos em um único bloco, valores inválidos e a preservação do relógio e do resultado em velocidade 0,25. Foram acrescentados três cenários Playwright para os novos fluxos.

O Chromium de testes não pôde iniciar no ambiente de execução por restrição de sockets. O navegador remoto também não alcança o servidor local. Logo, os cenários de navegador, a inspeção visual e a atualização das capturas permanecem pendentes. As imagens anteriores são ilustrações históricas; não comprovam esta revisão. A CI remota não iniciava na última conferência; não declarar os checks aprovados sem nova evidência.

## Continuação após a integração — 11/11/2026

O PR #99 foi integrado. O navegador remoto alcançou o build estático pelo serviço de prévia gerenciada, após a primeira tentativa com o servidor de desenvolvimento não atender à porta exigida. Não foram alteradas permissões de rede nem o código funcional para contornar a restrição. Foram aprovadas 42 verificações manuais Chromium/CUA, incluindo os três fluxos novos, e geradas quatro capturas atuais com geometria DOM e marcadores SVG. A suíte de 101 casos foi somente coletada; não atribuir a ela os resultados manuais. Ver [registro](../verificacoes/2026-11-11-manual/README.md). A reobservação com estudantes continua na #70.

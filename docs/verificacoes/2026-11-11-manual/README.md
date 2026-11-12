# Verificação manual do Memora — 11/11/2026

Base integrada: `40fcdfacbbf3fde3b68bb0d4e9302be9d33daefe`, após PRs #99 e #100.

## Resultados

- `npm run check`: 38 arquivos JavaScript aprovados.
- `npm test`: 81 testes Node aprovados, sem falhas ou casos ignorados.
- `npm run build`: build estático concluído.
- `npm run test:ui --workspace @memora/simulator -- --list`: 101 casos em cinco arquivos coletados; **não executados integralmente nesta sessão**.
- Chromium/CUA sobre o build estático de produção: **42 verificações manuais aprovadas**, registradas em [verificacoes-cua.json](verificacoes-cua.json). Não somar essa quantidade aos testes Node nem reportá-la como aprovação do Playwright.
- Quatro novas capturas, em 1363 × 936, com marcadores 1–10 e geometrias lidas no DOM. Origem, hashes e alvos estão em [metadata.json](../../../packages/memora/src/assets/manual/metadata.json).

## Cobertura manual

Editor em blocos: rejeição de múltiplos endereços em um item e valores fora da memória, descarte por Escape, adição e remoção, ordem e repetições, aplicação pelo teclado e retorno de foco. O limite de 1001 itens foi rejeitado sem truncamento.

Configuração: explicações dos três mapeamentos, erro bloqueando preparo e restauração do exemplo. Reprodução: mínimo de 0,25, rótulos de passos/acessos, pausa, avanço, reinício e preservação do andamento ao consultar ajuda.

Execução: gabaritos nos três mapeamentos. O cenário LRU de 21 acessos resultou em 12 acertos e 9 faltas. Analisar o acesso 20 mostrou 992–1007 antes e 3040–3055 depois; navegar, alternar formato e retornar ao estado atual preservaram os totais. O retorno fechou a comparação e devolveu o foco ao cabeçalho da cache.

Manual: abertura contextual, cinco/dez passos, troca de seção, imagens carregadas, fechamento, foco e parâmetros preservados. A apresentação foi inspecionada no viewport informado. Não houve nova verificação de todos os tamanhos responsivos, Firefox ou Safari.

## Método e limites

O servidor de desenvolvimento usa 5173 e não aceita os argumentos de porta injetados pela prévia gerenciada; a primeira abertura foi encerrada por timeout. O build estático foi então servido pelo próprio serviço de prévia, sem mudar permissões ou modificar a lógica da aplicação. Todas as ações de navegador foram feitas pelo CUA.

As imagens JPEG reais do navegador receberam apenas marcadores técnicos vetoriais, posicionados por geometria DOM, e foram convertidas para PNG para manter o contrato do manual. Textos, números e resultados da interface não foram retocados. As capturas de Simular e Conclusão foram conferidas após a apresentação do estado atualizado, corrigindo uma defasagem inicial de quadro da captura remota.

Mensagens de erro da extensão do ambiente foram separadas por origem dos logs da aplicação, conforme o JSON. Não houve alteração no Memora para ocultá-las. Nos logs consultados não havia erro atribuído à aplicação.

O GitHub Actions segue sem iniciar os jobs por bloqueio da conta. A verificação manual não elimina a pendência de execução integral da suíte automatizada. A inspeção heurística formal, a reobservação com estudantes e a avaliação de aprendizagem permanecem em aberto. As fichas, CSVs e figuras históricas do artigo não foram alterados por esta atualização do manual.

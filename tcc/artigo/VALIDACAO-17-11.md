# Validação da revisão de 17/11/2026

Base: PR #106 em `d65e3984073e7bed9196743905df505f4424b7cd`. Continuação editorial após a concordância de Poliana com os comentários de Glívia. As orientações e seus encaminhamentos estão em [REVISAO-POLIANA-17-11.md](REVISAO-POLIANA-17-11.md).

## Conferências da entrega

- PDF compilado com pdfLaTeX e BibTeX por latexmk: **42 páginas físicas**.
- Introdução abre pelo estudo de memória cache. Fundamentação em 2.1 Memória cache e 2.2 Software educacional, com remissões corretas; removida a subseção e a remissão `sec:conceitos-ihc`.
- Parágrafo de usabilidade ao final de software educacional; explicações referenciadas dos métodos nas subseções 5.3 (inspeção) e 7.1 (avaliação).
- Agradecimentos na página física 42, com título centralizado sem número e declaração do apoio de ChatGPT e Codex à redação, ao código, à documentação e às verificações técnicas. Destino de navegação próprio no PDF.
- Resumo, abstract e palavras-chave preservados na abertura; quatro links das notas do título/autoria conferidos para `nota-autoria.1` a `nota-autoria.4`.
- Log final sem citações/referências indefinidas, rótulos/destinos duplicados, caracteres ausentes ou caixas excedentes/insuficientes. Permanece o aviso de depreciação de `addtodef` do memoir.
- Todas as páginas renderizadas para conferência; páginas com alterações inspecionadas em detalhe. Sem cortes ou sobreposições identificados nos trechos alterados.
- Os quatro CSVs de `dados/`, os sete PDFs públicos das fichas, as figuras e os instrumentos coincidem byte a byte com a base. Os seis gráficos do levantamento, a matriz de tarefas e os critérios da entrevista foram preservados.
- Pacote Overleaf com **65 arquivos**, confrontados byte a byte com os fontes. ZIP extraído em diretório limpo e recompilado: 42 páginas, texto idêntico e quatro links de autoria preservados.
- `git diff --check` aprovado. Nenhuma alteração funcional no simulador; não foram executados novos testes da aplicação para esta revisão editorial.

O ZIP contém fontes, bibliografia, figuras, dados anonimizados, instrumentos, scripts e registros de revisão. O PDF compilado do artigo, os auxiliares e os documentos privados das docentes permanecem fora do pacote.

## Estado acadêmico e publicação

A decisão estrutural da #105 está resolvida pela mensagem de Poliana de 17/11 e aplicada nesta continuação, preparada após a integração do PR #106 à main no commit `7ac90f9e8974c8085316d8b91429638b009c3be7`. As alterações de 17/11 são publicadas em um novo PR. Sua integração, o envio do novo PDF à orientadora, a leitura e a liberação para a banca são etapas distintas. Não se declara envio ou liberação final nesta entrega.

A compilação e a inspeção aqui registradas são locais. Não comprovam execução de GitHub Actions nem publicação no Pages. O prazo informado para a banca é 18/11/2026, após a liberação de Poliana, conforme a #22.

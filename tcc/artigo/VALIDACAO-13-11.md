# Validação da revisão de 13/11/2026 — PDF e áudios

Esta validação substitui o registro da primeira revisão do mesmo dia. A base editorial incorpora o PDF `revPoliana13-11` e as orientações dos seis áudios, preservando as exclusões já conferidas no PDF anterior. As fontes foram reorganizadas em módulos LaTeX de `secoes/`.

## Compilação e apresentação

- pdfLaTeX/BibTeX por latexmk, classe abnTeX2 em modo artigo e hifenização em português.
- PDF com 41 páginas físicas: abertura e corpo 1–28; referências 29–30; Apêndice A 31–33, B 34, C 35–36, D 37–40; Anexo A 41.
- Sem citações/referências indefinidas, rótulos/destinos duplicados, caracteres ausentes e caixas excedentes ou insuficientes no log final.
- Todas as páginas renderizadas e inspecionadas. Conferência ampliada do método, resultados, prioridades, diagnóstico, referências e apêndices. Questionário completo sem divisões de alternativas de uma pergunta entre páginas; protótipos reunidos na mesma página e cenários técnicos sem parágrafo órfão.
- Referências em duas páginas, com fonte de 12 pt e ajuste do espaçamento da lista. Entradas dos TCCs identificadas como Trabalho de Conclusão de Curso, sem classificação como dissertação de mestrado.
- Apêndices na ordem da primeira remissão. Hiperlinks internos e limites dos blocos de texto válidos.
- Apenas o aviso de depreciação `addtodef` da combinação memoir/abnTeX2 instalada; não afeta a composição.

## Dados e reprodutibilidade

- Os CSVs de tempos e avaliação rápida são idênticos byte a byte à base Git. Os rótulos históricos original/complementar não aparecem como rodadas no artigo ou no gráfico.
- Matriz comparativa com os mesmos 105 valores da revisão anterior.
- Cópia íntegra do levantamento anonimizado com 13 registros; seis gráficos regenerados de forma independente dos dados da avaliação. Alternativas não selecionadas aparecem com zero; múltipla seleção usa denominador 13.
- Avaliação rápida: cinco C e dois SR em C1–C3; quatro C e três SR em C4, com base sete. Satisfação textual de P07 preservada como texto.
- Pacote Overleaf extraído em pasta limpa e compilado. Texto e paginação da recompilação idênticos ao PDF entregue. Todos os fontes e figuras estão incluídos; auxiliares de compilação e dados identificados não integram o ZIP.
- `git diff --check` e `git diff --cached --check` aprovados. Esta revisão editorial não executou testes da aplicação; os 78 testes Node e 94 cenários Chromium citados são registros históricos do desenvolvimento.

SHA-256 do PDF entregue: `3743df465cf13a34deb919b405c153a4c0fb6516aac6a333df0bace013c8ade0`.

## Limites de fonte

O formulário web está fechado. O Apêndice A é uma reconstrução textual dos enunciados, campos e alternativas verificados, incluindo consentimento, coleta de e-mail e escala 1–4. Não é captura integral da interface original. Nenhum e-mail de participante foi incluído.

A apresentação em abnTeX2 foi recomposta a partir do PDF de Hugo Barbosa. O arquivo-fonte exato do modelo do Moodle não foi disponibilizado; não se declara identidade com esse fonte ou aprovação docente. Datas de submissão e aprovação continuam vazias.

# Validação da revisão de 16/11/2026

Base remota: `main` em `3fa38257fa41255feccc5c17a0641a00778a7b15`, com #103 e #104 integrados. Alteração editorial do artigo, gráficos e acompanhamento; não houve mudança no simulador ou nova avaliação com participantes.

## Conferências realizadas

- PDF compilado com pdfLaTeX/BibTeX via latexmk: **41 páginas físicas**.
- Resumo, abstract e palavras-chave completos na primeira página. Preservadas as quatro ações GoTo distintas para `nota-autoria.1` a `nota-autoria.4`.
- Sem referências/citações indefinidas, rótulos/destinos duplicados, caracteres ausentes ou caixas excedentes/insuficientes. Permanece apenas um aviso de depreciação de macro do memoir.
- Páginas renderizadas e conferidas; detalhes da abertura, figuras e páginas alteradas inspecionados. Cabeçalho da entrevista no apêndice protegido contra isolamento no fim da página.
- Seis gráficos do levantamento regenerados, com as mesmas contagens. Barras de múltipla seleção ordenadas por frequência e sem grade de fundo; escalas ordinais mantêm sua ordem própria.
- Matriz documental de tarefas com 28 células únicas P01–P07 × T1–T4, evidência e página de origem. Contagens C/R/I: T1 = 2/5/0; T2 = 1/4/2; T3 = 5/2/0; T4 = 2/4/1.
- Critérios da entrevista preservados: C1–C3 têm C=5 e SR=2; C4 tem C=4 e SR=3; denominador sete. Nenhuma conversão de resposta qualitativa em código.
- Três CSVs originais e sete PDFs públicos das fichas iguais byte a byte à base. Preservados os 105 valores da matriz de funcionalidades (15 linhas × 7 ferramentas).
- Pacote Overleaf extraído em diretório limpo, arquivos confrontados com os fontes e recompilação concluída com texto idêntico nas 41 páginas. Abertura e links de autoria também conferidos nessa recompilação.
- `git diff --check` aprovado. O ZIP contém fontes, figuras, dados anonimizados, instrumentos e registros de revisão; não contém o PDF compilado do artigo, arquivos auxiliares ou os PDFs/transcrições de revisão das docentes.

## Conciliação e limites

Os seis gráficos pedidos por Poliana foram mantidos com análise complementar, atendendo à alternativa apresentada por Glívia. A estrutura da fundamentação permanece com três subseções; sua mudança depende da decisão de Poliana na #105. A rastreabilidade das 100 anotações está em [REVISAO-GLIVIA-16-11.md](REVISAO-GLIVIA-16-11.md).

O sucesso local não representa execução do GitHub Actions, publicação do site, aprovação docente ou envio à banca. Artigo e ZIP correspondem à revisão preparada para integração por PR.

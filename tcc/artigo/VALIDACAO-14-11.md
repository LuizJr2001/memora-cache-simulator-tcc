# Validação da revisão de 14/11/2026

## Resultado

- Artigo compilado por pdfLaTeX/BibTeX via latexmk: **41 páginas físicas**.
- Questionário em branco compilado a partir do mesmo módulo LaTeX do Apêndice A: **3 páginas**.
- Logs finais sem citações/remissões indefinidas, rótulos duplicados, caracteres ausentes ou caixas excedentes/insuficientes. O único aviso da classe é a depreciação de addtodef na combinação memoir/abnTeX2.
- Título, autoria, notas com recuo suspenso, ordem/centralização dos resumos, recuo de parágrafo e paginação confrontados com o PDF de Hugo confirmado pelo autor.
- Páginas renderizadas para inspeção. Conferência ampliada da abertura, tabelas, gráficos alterados, Apêndice A e questionário em branco.
- Todas as ocorrências de tag/hit/miss e plurais no Apêndice A foram conferidas nos objetos de texto do PDF como itálicas.
- O PDF em branco contém os seis enunciados do levantamento, o campo de e-mail corrigido, a escala 1–4 e nenhum valor de e-mail de participante.
- Os três CSVs do artigo permanecem idênticos byte a byte à base Git. Tempos, códigos da avaliação e quantidades não foram alterados.
- O pacote inclui main.tex na raiz, módulos, bibliografia, figuras, dados anonimizados, PDF/LaTeX do questionário e os campos em JSON. Os 58 arquivos foram conferidos byte a byte com os fontes. O ZIP extraído em diretório limpo recompilou em 41 páginas, com texto extraído idêntico ao PDF entregue e sem os avisos acima.
- A alteração é editorial e de empacotamento. Não foi executada uma nova avaliação com estudantes nem a suíte da aplicação.

## Arquivos entregues

SHA-256 do PDF do artigo: `a91b64024c4945780db945c93e1a34bcae97a240395f1243279b48581626378f`.

SHA-256 do questionário em branco: `993289cb728c75f9046525bc1097def30a8dd5fc480afc698666c327aa641dad`.

## Limites e publicação

O modelo de referência está identificado por confirmação expressa do autor. Isso não equivale a aprovação desta versão por Poliana ou Glívia. O PDF do questionário é uma reprodução textual conferida com os arquivos da coleta; não foi recuperada uma captura integral do formulário web e sua configuração visual. A origem está documentada em `research/survey-2026/QUESTIONARIO-APLICADO.md`.

A validação foi local. O workflow foi atualizado para regenerar o questionário antes de montar o ZIP, mas sua execução no GitHub depende das condições da conta. A integração do PR e os envios à Glívia e à banca são etapas distintas.

## Complemento — hiperlinks das notas de abertura

Os quatro sobrescritos do título e da autoria agora usam links internos com destinos próprios nas respectivas notas. A configuração utiliza os hooks de marcas do memoir e comandos do hyperref; não altera a numeração das notas do corpo.

Validação da recompilação: 41 páginas, texto extraído idêntico em todas as páginas ao PDF anterior, quatro novas ações GoTo com destinos distintos conferidos nas notas 1–4 e todos os 195 links anteriores preservados (tolerância geométrica de 0,01 pt). A primeira página foi renderizada e inspecionada; os quatro números aparecem em azul. Log sem referências/citações indefinidas, caracteres ausentes, caixas excedentes/insuficientes ou destinos duplicados. O ZIP foi recomposto a partir dos mesmos fontes; a cópia extraída em pasta limpa foi recompilada e seus quatro links também foram conferidos.

# Artigo Memora — ABNT/abnTeX2

Fonte consolidado em 23/10/2026, com implementação até o PR #62 e levantamento
do Beto já coletado. A avaliação externa do Memora permanece pendente.

No Overleaf, use pdfLaTeX, `main.tex` como principal e BibTeX para
`referencias.bib`. Localmente, com abnTeX2 e português instalados:

```bash
latexmk -pdf -interaction=nonstopmode -halt-on-error main.tex
```

O artigo distingue o Beto original, o Memora funcional, os testes técnicos e
a avaliação pendente. Os instrumentos são um roteiro preliminar e um modelo
de inspeção; seus exemplos não são achados confirmados. Os enunciados aplicados
e as 13 respostas anonimizadas estão no repositório do projeto em
`research/survey-2026/`, citado no artigo.

`figuras/beto_tela.pdf` é um recurso histórico preservado do pacote anterior.
Novas capturas devem indicar a versão e a data; imagens antigas de três telas
ou botões carvão não devem ilustrar silenciosamente a interface atual.

No repositório, edite `tcc/artigo/` e execute `python3 tcc/empacotar_artigo.py`
a partir da raiz para regenerar `tcc/tcc-atual.zip`. O pacote fonte não inclui
PDF compilado ou arquivos auxiliares.

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


## Próxima avaliação — planejamento de 23/10/2026

A [issue #64](https://github.com/LuizJr2001/memora-cache-simulator-tcc/issues/64)
acompanha a comparação exploratória com **2 ou 3 alunos que já utilizaram o
Beto**, mais **Poliana como avaliadora complementar**, analisada separadamente.
A seção de plano de avaliação no artigo e o instrumento
`instrumentos/avaliacao_comparativa_memora_beto.md` (relativo a `tcc/artigo/`)
registram tarefas, questionários, entrevista, ficha e limites, adaptados do
MedSimples de André Macedo (2025). São instrumentos planejados, sem coleta
ou resultados comparativos já realizados. O calendário está na issue #22.

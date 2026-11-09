# Artigo Memora — revisão de 09/11/2026

O projeto usa o template SBC de uma coluna e a organização acadêmica inspirada no estudo MedSimples de André Macedo. Esta revisão integra as sete fichas P01–P07, com quatro casos complementares à rodada original. O levantamento anterior sobre o Beto tem 13 respostas e é analisado separadamente.

## Abrir no Overleaf

Importe `tcc-atual.zip` como projeto. Selecione `main.tex` e o compilador pdfLaTeX. A bibliografia usa BibTeX. Veja [APENDICES.md](APENDICES.md) para a organização de figuras e instrumentos e [TEMPLATE.md](TEMPLATE.md) para a decisão do modelo.

Compilação local neste diretório:

```bash
latexmk -pdf -interaction=nonstopmode -halt-on-error main.tex
```

Regeneração dos gráficos, com Python e matplotlib:

```bash
python3 scripts/gerar_avaliacao_rapida.py
python3 scripts/gerar_tempos_tarefas.py
```

Na raiz do repositório, gere o pacote com `python3 tcc/empacotar_artigo.py`. O workflow do artigo compila o PDF e prepara o ZIP como artefatos do GitHub Actions.

## Dados da avaliação

- C1–C3 têm cinco respostas C em sete participantes. C4 tem quatro respostas C em sete. A satisfação de P07 foi registrada em texto.
- Os tempos descrevem as tarefas. As sessões diferiram em condução e tiveram lacunas de versão e ambiente.
- As fichas públicas estão indexadas em `research/evaluation-2026/fichas/` no repositório. O ZIP contém matrizes e gráficos anonimizados.
- Os instrumentos preservam o planejamento. O artigo descreve o procedimento efetivamente documentado.

Veja [dados/PROVENIENCIA.md](dados/PROVENIENCIA.md) para a apuração e [REVISAO-EDITORIAL.md](REVISAO-EDITORIAL.md) para o histórico.

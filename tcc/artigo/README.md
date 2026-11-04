# Artigo Memora — SBC (#84)

Fechamento #84 sobre a revisão #78–#81 de 04/11/2026 e as capturas do PR #87. As figuras principais do Memora atual ficam no corpo, os instrumentos nos Apêndices A/B, os protótipos e capturas complementares no C, o manual visual no D e as reproduções documentais no Anexo A. A V1 foi reconciliada com o repositório; este diretório é a fonte única do artigo. Consulte [TEMPLATE.md](TEMPLATE.md) para decisão do modelo, fontes, origem do código e limites das entrevistas.

No Overleaf: importar `tcc/tcc-atual.zip`, usar pdfLaTeX, `main.tex` e BibTeX. O estilo SBC e quatro capturas anotadas em `figuras/manual/` estão incluídos após empacotamento. Consulte `APENDICES.md` e o workflow `artigo-overleaf.yml`.

```bash
latexmk -pdf -interaction=nonstopmode -halt-on-error main.tex
```

Para regenerar o gráfico (Python com matplotlib):

```bash
python3 scripts/gerar_avaliacao_rapida.py
```

Na raiz do repositório, regenere o pacote com `python3 tcc/empacotar_artigo.py`.

O levantamento do Beto tem 13 respostas; a rodada exploratória do Memora tem três participantes, apenas um com códigos C/P/N/X. Comentários não viram notas. Os hashes das versões das sessões não foram registrados; não atribuir a elas a captura posterior do PR 71. Instrumentos em `instrumentos/` são planejamento histórico; enunciados aplicados e limitações estão no artigo.

O workflow **Artigo SBC e Overleaf (#84)** publica PDF e ZIP em um único artefato do GitHub Actions após compilação. A interface com **Analisar** e o manual é posterior às entrevistas P01–P03; não atribuir a nova versão aos participantes.

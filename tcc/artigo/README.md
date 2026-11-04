# Artigo Memora — SBC

Revisão #78–#81 de 04/11/2026. A V1 foi reconciliada com o repositório; este diretório é a fonte única do artigo. Consulte [TEMPLATE.md](TEMPLATE.md) para decisão do modelo, fontes, origem do código e limites das entrevistas.

No Overleaf: pdfLaTeX, `main.tex` e BibTeX. O estilo SBC está incluído.

```bash
latexmk -pdf -interaction=nonstopmode -halt-on-error main.tex
```

Para regenerar o gráfico (Python com matplotlib):

```bash
python3 scripts/gerar_avaliacao_rapida.py
```

Na raiz do repositório, regenere o pacote com `python3 tcc/empacotar_artigo.py`.

O levantamento do Beto tem 13 respostas; a rodada exploratória do Memora tem três participantes, apenas um com códigos C/P/N/X. Comentários não viram notas. Os hashes das versões das sessões não foram registrados; não atribuir a elas a captura posterior do PR 71. Instrumentos em `instrumentos/` são planejamento histórico; enunciados aplicados e limitações estão no artigo.

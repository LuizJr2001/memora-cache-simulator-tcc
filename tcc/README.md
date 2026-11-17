# Artigo do TCC — Memora

A revisão de 17/11/2026 incorpora os comentários de Glívia de 16/11 e as orientações posteriores de Poliana. O artigo usa abnTeX2 em modo artigo e reúne comparação técnica, levantamento de 13 respostas sobre o Beto, implementação e sete entrevistas individuais sobre o Memora em um único ciclo.

## Fontes e pacote para Overleaf

- [Fonte LaTeX](artigo/main.tex) e [bibliografia](artigo/referencias.bib).
- [Pacote para importar no Overleaf](tcc-atual.zip), com `main.tex` na raiz.
- [Guia do artigo](artigo/README.md) e [composição do modelo abnTeX2](artigo/TEMPLATE.md).
- [Dados, proveniência e critérios de apuração](artigo/dados/PROVENIENCIA.md).
- [Síntese da avaliação](../research/evaluation-2026/README.md) e [fichas públicas](../research/evaluation-2026/fichas/README.md).

Edite o fonte em `tcc/artigo/`. Da raiz do repositório, execute:

```bash
python3 tcc/empacotar_artigo.py
```

O ZIP reúne os fontes, as figuras, os dados anonimizados e os instrumentos. O PDF compilado do artigo e os arquivos auxiliares ficam fora do pacote. O PDF em branco do questionário integra os instrumentos.

## Compilação

No Overleaf, importe o ZIP, selecione `main.tex` e pdfLaTeX. A bibliografia é processada com BibTeX. Localmente, use TeX Live com suporte a português brasileiro e os pacotes listados no [workflow do artigo](../.github/workflows/artigo-overleaf.yml).

```bash
cd tcc/artigo
latexmk -pdf -interaction=nonstopmode -halt-on-error main.tex
```

## Avaliação e acompanhamento

A [#64](https://github.com/LuizJr2001/memora-cache-simulator-tcc/issues/64) registra o plano inicial e a execução exploratória efetiva. As tarefas observadas ocorreram no Memora e as referências ao Beto foram retrospectivas. A [#70](https://github.com/LuizJr2001/memora-cache-simulator-tcc/issues/70) acompanha a descoberta da comparação e do retorno ao estado atual. A [#22](https://github.com/LuizJr2001/memora-cache-simulator-tcc/issues/22) mantém o calendário do TCC.

## Revisão de 17/11 e próximos prazos

O retorno de Glívia foi integrado no PR #106. Em 17/11, Poliana concordou com os comentários e autorizou reorganizar a fundamentação: memória cache antes de software educacional e retirada da subseção isolada de IHC. O pacote incorpora essa decisão, o parágrafo de usabilidade, explicações dos métodos nos locais de aplicação e agradecimentos com declaração de uso de IA. A [conferência das orientações](artigo/REVISAO-POLIANA-17-11.md) documenta a resolução da [#105](https://github.com/LuizJr2001/memora-cache-simulator-tcc/issues/105).

- **15/11**: envio anterior à Glívia, confirmado na correspondência.
- **16/11**: recebimento dos comentários e revisão do artigo.
- **17/11**: autorização de Poliana para os ajustes; PDF resultante preparado para sua nova leitura.
- Próximo passo: encaminhar o PDF a Poliana e registrar sua liberação.
- Até **18/11**: encaminhamento à banca, após a liberação; novo envio ainda não registrado.

Datas de 2026, horário de Brasília. Consulte [VALIDACAO-17-11.md](artigo/VALIDACAO-17-11.md) para a verificação do PDF e do pacote.

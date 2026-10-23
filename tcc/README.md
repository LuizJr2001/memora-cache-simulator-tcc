# Artigo do TCC — Memora

Consolidação: **23/10/2026**, com implementação até o PR #62. O artigo mantém
o título acadêmico, autoria, fundamentação e comparação documental com o Beto
e os simuladores relacionados. Incorpora o levantamento de requisitos já
coletado, a implementação e os limites das evidências disponíveis.

## Fontes e pacote para Overleaf

- [`artigo/main.tex`](artigo/main.tex): fonte principal revisável no GitHub.
- [`artigo/referencias.bib`](artigo/referencias.bib): referências autor-data.
- [`artigo/instrumentos/`](artigo/instrumentos/): roteiro preliminar e modelo
  de inspeção, identificados como instrumentos, não resultados.
- [`tcc-atual.zip`](tcc-atual.zip): cópia sincronizada de `artigo/`, pronta para
  importar no Overleaf; `main.tex` está na raiz interna do ZIP.

Edite os arquivos em `artigo/`. Após a edição, execute **na raiz do repositório**:

```bash
python3 tcc/empacotar_artigo.py
```

O empacotador inclui apenas fontes e recursos, com ordem e datas fixas para
evitar diferenças artificiais no ZIP. Não inclui PDF compilado, logs ou caches.
O PDF original do Beto em `figuras/` é um recurso histórico de entrada.

## Compilação

No Overleaf, importe o ZIP em um projeto novo ou atualize os arquivos do projeto
existente. Selecione **pdfLaTeX**, **main.tex** e compilação da bibliografia com
BibTeX. O modelo usa `abntex2`, `abntex2cite` e português brasileiro.

Localmente, com TeX Live e os pacotes abnTeX2 e de português instalados:

```bash
cd tcc/artigo
latexmk -pdf -interaction=nonstopmode -halt-on-error main.tex
```

Alternativa: pdfLaTeX → BibTeX → pdfLaTeX → pdfLaTeX. Confira no log referências
e citações indefinidas, caixas que ultrapassem as margens e mensagens de erro;
renderize o PDF e inspecione também as páginas das tabelas em paisagem.
Os arquivos compilados são locais; não devem ser incluídos no pacote fonte.

## O que foi atualizado

- Resumo e abstract passam de proposta preliminar a relato do estado atual.
- O levantamento sobre o Beto é descrito como realizado: 13 respostas,
  datas, anonimização, contagens e percentuais derivados do CSV público.
- A implementação modular, validação, limites, snapshots, controles, cache e
  ajuda contextual são descritos com seu comportamento atual.
- O fluxo vigente tem duas etapas, com comparação recolhível em Simular;
  três telas e 18 ajudas são identificadas como histórico do protótipo.
- O artigo diferencia o exemplo direto do Beto do cenário associativo/LRU e
  registra resultados determinísticos próprios de cada sequência.
- As cores dos botões e o alcance do cálculo de contraste estão registrados.
- Testes Node, cenários Chromium, build e execução no CI são diferenciados de
  avaliação com estudantes, aprendizagem e conformidade de acessibilidade.

## Evidências e pendências

Os números do questionário vêm de
[`research/survey-2026/respostas-anonimizadas.csv`](../research/survey-2026/respostas-anonimizadas.csv).
As questões de múltipla seleção usam denominador 13; uma pessoa pode marcar
várias alternativas. A escala de utilidade efetivamente aplicada vai de 1 a 4.
O roteiro preliminar guardado em `instrumentos/` não substitui o CSV aplicado.

A avaliação posterior do Memora com estudantes e a inspeção formal consolidada
com severidades permanecem pendentes. A comparação bibliográfica preserva as
datas das fontes originais; ela não implica um novo teste de todos os simuladores.
Os registros de execução técnica são datados. A nova paleta dos PRs #61/#62 não
recebeu inspeção visual em Chromium nesta revisão.

Consulte o [estado atual](../docs/estado-atual.md), o
[histórico](../docs/historico-desenvolvimento.md) e a
[decisão 004](../docs/decisoes/004-analise-contextual.md).


## Próxima avaliação — planejamento de 23/10/2026

A [issue #64](https://github.com/LuizJr2001/memora-cache-simulator-tcc/issues/64)
acompanha a comparação exploratória com **2 ou 3 alunos que já utilizaram o
Beto**, mais **Poliana como avaliadora complementar**, analisada separadamente.
A seção de plano de avaliação no artigo e o instrumento
`instrumentos/avaliacao_comparativa_memora_beto.md` (relativo a `tcc/artigo/`)
registram tarefas, questionários, entrevista, ficha e limites, adaptados do
MedSimples de André Macedo (2025). São instrumentos planejados, sem coleta
ou resultados comparativos já realizados. O calendário está na issue #22.

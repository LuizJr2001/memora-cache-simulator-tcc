# Fechamento #84: figuras, apêndices e pacote Overleaf

Revisão de 11/11: as figuras de cada apêndice usam letra e número próprios (por exemplo, C-1 e D-1); as do anexo usam Anexo A-1 e Anexo A-2, com destinos de hiperlink distintos. As divisões continuam começando em nova página. O corpo e a proveniência das imagens foram preservados.

Base editorial: artigo SBC das issues #78–#81, consolidado no PR #85.
Base visual: manual da interface atualizada das issues #82–#83, PR #87.

Organização:
- Corpo: gráficos do levantamento e avaliação, Beto e telas principais do Memora atual, com distinção entre capturas ilustrativas e as sessões P01–P07.
- Apêndice A: enunciados aplicados no questionário do Beto, derivados do CSV anonimizado.
- Apêndice B: perfil, T1–T4, entrevista e avaliação rápida C1–C4; tabela real das fichas A/B/C e sequência comum A/B recuperadas de mensagem enviada em 28/10/2026, sem dados pessoais; não há comprovação documental de distribuição idêntica a todos os participantes.
- Apêndice C: protótipos do Figma, etapa intermediária do PR #71 e capturas próprias complementares.
- Apêndice D: manual visual atualizado com quatro capturas do navegador anotadas.
- Anexo A: imagens reproduzidas de documentação externa (Ripes e SMPCache), com atribuição.

Capturas de `packages/memora/src/assets/manual/`. A comparação de acesso foi atualizada em 09/11 para ilustrar o retorno no cartão Memória cache (#70).
Metadados: packages/memora/src/assets/manual/metadata.json.

Compilação e ZIP:
python3 tcc/empacotar_artigo.py
cd tcc/artigo && latexmk -pdf -interaction=nonstopmode -halt-on-error main.tex

O workflow Artigo SBC e Overleaf (#84) gera PDF e ZIP como artefatos de GitHub Actions após compilação e checagem.
As figuras ilustram versões da interface. As fichas P01–P07 têm registros independentes das capturas.

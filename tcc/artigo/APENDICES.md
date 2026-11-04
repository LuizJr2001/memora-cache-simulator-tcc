# Fechamento #84: figuras, apêndices e pacote Overleaf

Base editorial: artigo SBC das issues #78–#81, consolidado no PR #85.
Base visual: manual da interface atualizada das issues #82–#83, PR #87.

Organização:
- Corpo: gráficos do levantamento e avaliação, Beto e telas principais do Memora atual, com distinção da rodada original P01–P03.
- Apêndice A: enunciados aplicados no questionário do Beto, derivados do CSV anonimizado.
- Apêndice B: perfil, T1–T4, entrevista e avaliação rápida C1–C4; tabela real das fichas A/B/C e sequência comum A/B recuperadas de mensagem enviada em 28/10/2026, sem dados pessoais; não há comprovação documental de distribuição idêntica a todos os participantes.
- Apêndice C: protótipos do Figma, etapa intermediária do PR #71 e capturas próprias complementares.
- Apêndice D: manual visual atualizado com quatro capturas do navegador anotadas.
- Anexo A: imagens reproduzidas de documentação externa (Ripes e SMPCache), com atribuição.

Capturas importadas sem regenerar: arquivos de packages/memora/src/assets/manual/.
Metadados: packages/memora/src/assets/manual/metadata.json.

Compilação e ZIP:
python3 tcc/empacotar_artigo.py
cd tcc/artigo && latexmk -pdf -interaction=nonstopmode -halt-on-error main.tex

O workflow Artigo SBC e Overleaf (#84) gera PDF e ZIP como artefatos de GitHub Actions após compilação e checagem.
Não há reivindicação de que a interface posterior ao PR #87 foi avaliada pelos participantes da rodada P01–P03.

# Apresentação da defesa do Memora

A revisão de 18/11/2026 reorganiza a exposição a partir do artigo: contexto e objetivos, fundamentação, comparação dos simuladores, escolha do Beto, necessidades dos estudantes, inspeção, protótipos, implementação e resultados.

A versão tem **30 slides principais** e **9 slides de apoio ocultos**, com distribuição sugerida de **30 minutos**. O slide 18 contém a demonstração guiada de **2min30s**. O vídeo usa capturas reais da aplicação, mudanças de foco e legendas, sem narração gravada ou alegação de gravação contínua.

## Conteúdo versionado

- `slides.json`: sequência, fontes e notas de fala.
- `ROTEIRO-30-MIN.md`: tempos e fala sugerida.
- `REVISAO-18-11.md`: relação entre os apontamentos e sua aplicação.
- `assets/`: telas reais, protótipos e logo institucional.
- `video-cenas.json` e `video-legendas.srt`: sequência e texto do vídeo.
- `scripts/`: geração editável dos slides e preparação do vídeo.

As tabelas de tarefas e critérios reproduzem os CSV do artigo no commit `c708b2a1dd56a2bf18402dbdc454ef293bb38257`. R indica ressalva documentada, e I indica registro insuficiente. A classificação não equivale a uma taxa padronizada de sucesso autônomo. As entrevistas sustentam resultados de uso e utilidade percebida.

## Fontes visuais

A abertura segue a direção visual da apresentação TutorAndCoder de Antônio José Peixoto Chaves: fundo claro, tipografia sem serifa, títulos em azul e identificação do CEFET-MG. O logo foi extraído dessa referência e preservado.

A captura do Beto vem do artigo. Os protótipos vêm da apresentação anterior e correspondem ao projeto no Figma. As capturas do Memora e do GitHub foram obtidas em 18/11/2026. A página pública de Projects indicou ausência de quadros vinculados; o slide 17 mostra a lista real de pull requests integrados.

## Regeneração

Dependências: Node com `@oai/artifact-tool`, Python com `lxml`, FFmpeg e fontes Arial compatíveis. Os caminhos para Node e seus módulos podem ser fornecidos pelo runtime do Codex.

1. Executar `python3 scripts/build_video.py`.
2. Gerar o pôster em `assets/video-poster.png` a partir do MP4, caso o vídeo tenha mudado.
3. Executar `node scripts/build_deck.mjs`. A variável opcional `MEMORA_PRESENTATION_SOURCE` permite importar a apresentação anterior e reutilizar seus masters. Sem ela, o script usa uma tela de 1280 × 720.
4. Executar `python3 scripts/embed_video.py`. O resultado é `.build/multimedia.pptx`.
5. Validar o pacote e salvar uma cópia do PPTX. Exportar o PDF com slides ocultos incluídos para conservar o apoio.

O vídeo é incorporado como mídia nativa no PowerPoint, com reprodução em tela cheia acionada na imagem do slide 18. O MP4 avulso permite reprodução externa. O PDF apresenta uma imagem estática no lugar do vídeo.

## Conferência

Foram conferidos o pacote PPTX, as relações da mídia, os 23 objetos de tabela editáveis, os nove slides ocultos, os dados de T1–T4 e C1–C4 contra os CSV e a duração do vídeo de 150 segundos. Os slides foram renderizados e o PPTX foi aberto pelo LibreOffice para exportação de um PDF com 39 páginas. A reprodução do vídeo no PowerPoint deve integrar o ensaio no computador da apresentação.


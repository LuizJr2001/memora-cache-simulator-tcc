> Registro da revisão anterior. A organização e os resultados desta entrega são atualizados em [REVISAO-POLIANA-AUDIOS-13-11.md](REVISAO-POLIANA-AUDIOS-13-11.md) e [VALIDACAO-13-11.md](VALIDACAO-13-11.md).

# Verificação da revisão docente — 11/11/2026

Base Git: `38408d36b17d128ecb817ebe9c6a51f1cc6eef77`, após PRs #95 e #96. Proposta de interface separada no PR #99, não integrada a esta base.

- Compilação pdfLaTeX/BibTeX via latexmk concluída: **38 páginas**.
- Corpo: páginas físicas 1–24; referências: 25–26; apêndices e anexo: 27–38. O corpo, isoladamente, supera o mínimo de 14 páginas da alternativa SBC citada na decisão histórica.
- Abertura: três autores com vínculos em notas, Resumo antes de Abstract, títulos centralizados e resumo sem contagens de participantes. Ambos os resumos permanecem na primeira página.
- Tabelas comparativas 1 e 2 na mesma página física (7), com 105 marcadores preservados ao transpor a matriz.
- Figuras de apêndices/anexo numeradas por divisão e com âncoras distintas; divisões iniciadas em novas páginas.
- Log final sem citações ou remissões indefinidas, rótulos duplicados, caracteres ausentes ou caixas excedentes. Fontes de texto incorporadas ao PDF.
- Todas as páginas renderizadas para inspeção; abertura, comparação, resultados, referências e apêndices conferidos. Corrigidos excesso de largura de tabela, quebra inadequada no e-mail do autor e página quase vazia entre a descrição e o comparativo. O ajuste de alinhamento vertical evita esticar espaços para completar a página; controle de linhas órfãs/viúvas acrescentado no estilo local.
- Conferência programática confirma ausência de alterações nos CSVs, nas fichas públicas P01–P07 e nas figuras de pesquisa. A matriz funcional mantém os 105 valores da base; o checklist cobre C01–C75.
- `git diff --check` aprovado. O ZIP é regenerado por `tcc/empacotar_artigo.py`, conferido contra os fontes e compilado em diretório limpo antes da entrega.

## Limites que permanecem

C01 depende do arquivo exato do modelo do Moodle: o PDF aplica os elementos explicitados por Poliana, mas sua equivalência integral ao modelo institucional não está confirmada. Não houve envio de e-mail nem aprovação externa da formatação.

A inspeção heurística formal, a avaliação de aprendizagem e a reobservação das alterações de interface continuam pendentes. Os testes técnicos históricos citados no artigo não são apresentados como executados nesta revisão editorial. O PR #99 possui 81 testes locais aprovados; os cenários de navegador e novas capturas dessa proposta ainda dependem de execução em ambiente compatível. O GitHub Actions não iniciou os jobs por bloqueio da conta.

## Ambiente local

A distribuição TeX do ambiente não tinha seus índices e formatos prontos nem a definição de português. A compilação utilizou arquivos de suporte e formato pdfLaTeX preparados fora do repositório, com os fontes oficiais de Babel/português e hifenização. Não há caminhos locais ou dependências desse reparo no ZIP; ele usa os pacotes normais do Overleaf/TeX Live. Os estilos `sbc-template.sty` e `sbc.bst` de origem foram preservados.

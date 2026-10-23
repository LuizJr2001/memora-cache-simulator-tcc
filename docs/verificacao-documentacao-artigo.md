# Verificação da consolidação documental e do artigo

Data: **23/10/2026**. Base funcional: `main`, após o PR #62.

## Escopo

Atualização dos READMEs, decisões, histórico, especificação visual, publicação,
contribuição e relação com os dados de pesquisa. A documentação atual diferencia
o fluxo de duas etapas dos registros históricos de três telas, os dois cenários
de simulação e a paleta roxa dos botões.

O artigo em `tcc/artigo/` foi extraído do pacote anterior para permitir revisão
textual no GitHub. Foram atualizados resumo/abstract, método, coleta e análise
descritiva do questionário, implementação, cenários, verificação, limitações e
considerações finais. A fundamentação e as referências dos trabalhos relacionados
foram preservadas; a tabela geral foi compactada para evitar fragmentação em
páginas quase vazias. Título, autoria, modelo abnTeX2 e atribuição ao Beto foram
mantidos. `tcc/tcc-atual.zip` é sincronizado com esses fontes.

## Conferências realizadas

- `npm run check`: sintaxe de 32 arquivos JavaScript aprovada.
- `npm test`: **78 testes aprovados**.
- `npm run build`: aplicação estática preparada com sucesso.
- `npm run test:ui --workspace @memora/simulator -- --list`: **93 cenários**
  disponíveis; esta revisão documental não executou Chromium. A execução completa
  anterior está registrada no PR #60.
- Dois cenários executados diretamente pelo núcleo: Beto com 21 acessos,
  13 acertos, 8 faltas e 3/32 linhas; referência LRU com 21 acessos, 12 acertos,
  9 faltas e 8/32 linhas.
- Dados do formulário lidos do CSV público: 13 registros; contagens das
  alternativas, percentuais com denominador 13, perfil e escala de utilidade
  conferidos. Nenhum dado identificável foi acrescentado.
- LaTeX compilado com pdfLaTeX e BibTeX, em TeX Live 2023, com abnTeX2 e
  suporte Babel/hifenização em português. Referências estabilizadas; sem erros,
  citações indefinidas ou caixas que ultrapassem a largura disponível.
- PDF de **20 páginas** renderizado com Poppler e inspecionado, incluindo
  resumos, tabelas em paisagem, resultados do levantamento, escopo e referências.
  O PDF de conferência não integra o pacote fonte.
- ZIP conferido contra `tcc/artigo/`, sem auxiliares de compilação; geração
  determinística pelo empacotador. Links relativos dos documentos alterados e
  `git diff --check` conferidos.

Os pacotes LaTeX ausentes no ambiente foram disponibilizados temporariamente
a partir dos projetos abnTeX2 e Babel/CTAN; esses arquivos de dependência não
foram adicionados ao repositório. A [compilação para uso](../tcc/README.md#compilação)
está documentada para uma instalação TeX Live completa ou para o Overleaf.

## Limites

Esta revisão não executa avaliação externa, não atribui severidades a uma
inspeção formal pendente e não mede aprendizagem. Também não constitui novo
teste de todos os simuladores relacionados, nova conferência do Figma ou teste
visual da paleta dos PRs #61/#62. As evidências técnicas anteriores conservam
suas datas. As issues acadêmicas não são encerradas por esta consolidação.

Referências internas: [estado atual](estado-atual.md),
[histórico](historico-desenvolvimento.md),
[artigo e pacote Overleaf](../tcc/README.md) e
[levantamento do Beto](../research/survey-2026/README.md).

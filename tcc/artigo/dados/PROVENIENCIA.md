# Proveniência dos dados de avaliação

A análise cruza as sete [fichas públicas](../../../research/evaluation-2026/fichas/README.md) com as anotações e transcrições consolidadas. A avaliação consistiu em um único ciclo de sete entrevistas individuais. Os rótulos históricos `original` e `complementar`, preservados nos CSVs, indicam a consolidação dos registros no artigo; não definem rodadas, condições experimentais ou duas amostras.

| Consolidação histórica | Casos | Observações sobre o registro |
| --- | --- | --- |
| `original` | P01–P03 | Primeiros registros incorporados ao artigo. T4 de P01 sem tempo anotado. T4 de P02 tem tempo e descrição parcial. |
| `complementar` | P04–P07 | Incorporação posterior das fichas ao texto. A data efetiva de P04 ficou sem registro. |

## Tempos e intervenções

- `tempos-tarefas.csv` contém segundos anotados por tarefa. As somas cobrem as tarefas com tempo registrado. P04, P05, P06 e P07 somam, respectivamente, 330, 300, 370 e 441 segundos.
- P04 e P05 desativaram etapas detalhadas em T2 por orientação. P06 recebeu instrução sobre esse modo e indicação do acesso 5 em T3. Em T2, P07 recebeu a indicação do acesso 3. P07 acompanhou T3 sem o passo a passo.
- P05 verbalizou 2 acertos, 6 faltas, 25% e progresso finalizado. Os registros de P04, P06 e P07 não fornecem totais numéricos com a mesma precisão. A apuração usa somente o que foi registrado.
- O commit, as condições do ambiente e a duração total não foram documentados de modo completo. O tempo anotado depende da condução. Capturas ilustrativas do artigo têm origem independente das entrevistas.

## Avaliação rápida

`avaliacao-rapida.csv` registra C (atende completamente), P (parcialmente), N (não atende) e X (não conseguiu avaliar). SR indica ausência de uma alternativa registrada. P02 e P03 têm relatos em texto. P07 marcou C1–C3 como C e respondeu “Muito positiva” em C4, sem alternativa registrada.

| Critérios | C | SR | Denominador |
| --- | ---: | ---: | ---: |
| C1, C2 e C3, cada um | 5 (71,4%) | 2 (28,6%) | 7 |
| C4 | 4 (57,1%) | 3 (42,9%) | 7 |

P01 e P04–P06 têm C nos quatro critérios. As alternativas de P04 em C3 e de P05 em C2/C4 se apoiam nas anotações consolidadas. Não há registros P, N ou X. O gráfico usa todos os participantes como base e mostra separadamente a cobertura de códigos.

## Respostas abertas

A unidade de leitura é participante por pergunta (Q1–Q4). Uma resposta pode conter mais de um tema. As sínteses distinguem ação observada, relato, intervenção e sugestão. As falas diretas vêm das notas ou transcrições indicadas no artigo. A comparação com o Beto é retrospectiva e a utilidade para estudar é uma percepção dos participantes.

## Levantamento de requisitos do Beto

`levantamento-beto.csv` é uma cópia íntegra do CSV anonimizado de `research/survey-2026/respostas-anonimizadas.csv`. Contém 13 respostas, sem e-mail e sem horário. Os seis gráficos do levantamento são gerados por `scripts/gerar_levantamento.py`; cada alternativa é contabilizada uma vez por respondente e o denominador é 13. As perguntas de múltipla seleção podem somar mais de 100%. O gráfico de melhorias inclui as 15 alternativas verificadas no instrumento; o de configuração inclui também a resposta livre registrada em Outro. Respostas abertas são discutidas qualitativamente.

O questionário no Apêndice A reproduz os enunciados e as alternativas verificadas no CSV, nos gráficos agregados e no material de revisão do formulário. A escala efetivamente aplicada foi 1–4. A minuta de instrumento em `instrumentos/` é histórica e não substitui essa versão. O formulário web está fechado; a reconstrução é textual e não uma captura integral da interface original.

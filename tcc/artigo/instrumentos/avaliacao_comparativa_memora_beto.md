# Avaliação comparativa exploratória — Memora e Beto

**Estado:** protocolo planejado em 23/10/2026; revisão pela orientação e coleta pendentes. Referências: #64 (versão funcional), #22 (calendário), #33 (protótipo estático), #24 (levantamento anterior).

## Objetivo e participantes

Investigar usabilidade e apoio à compreensão sem assumir superioridade. Participarão **2 ou 3 alunos que já utilizaram o Beto**, mais **Poliana em avaliação complementar**, separada dos alunos. A coleta não se confunde com as 13 respostas históricas.

Referência principal: MACEDO, André Guilherme de Almeida. *Proposta de um app para auxiliar no controle de medicação de pessoas idosas*. CEFET-MG, 2025, seção 7.1 e apêndices A–E. Adaptação de preparação, tarefas observadas e avaliação pós-teste. Os 11 critérios não são escala validada nem as dez heurísticas de Nielsen.

## Preparação e condução

- Alinhar consentimento, convite e tratamento dos dados com a orientação. Não publicar contatos, termos assinados ou gravações identificáveis.
- Registrar versão/commit das duas ferramentas, equipamento, navegador, data, cenário e ordem.
- Com 2 alunos, um em cada ordem; com 3, distribuição 2/1, quando possível. A experiência prévia permanece uma limitação. Registrar desvios.
- Reaplicar as tarefas no Beto: lembrança não substitui observação atual. Padronizar instruções, sem anunciar Memora como superior.
- Preparar cenários equivalentes determinísticos contendo acerto, falta e substituição. Evitar política aleatória na comparação principal. Alternar cenários entre ferramentas, registrando a distribuição.
- Antes da coleta, preencher para cada cenário: bytes por célula, total de células, células por bloco, linhas, mapeamento, vias, política, sequência de endereços, acessos de referência e respostas esperadas. Conferir unidades e gabarito nos dois sistemas.
- Definir início/término e limite de tempo por tarefa, critério de erro e condição para oferecer ajuda. Não ensinar o caminho; registrar toda ajuda.
- Se usar verbalização em voz alta, aplicar nas duas ferramentas e considerar seu efeito no tempo.
- Sequência: caracterização → primeira ferramenta/tarefas/questionário → segunda ferramenta/tarefas/questionário → entrevista.

**Apresentação:** “Estamos avaliando dois simuladores de memória cache. Avaliamos as ferramentas, não seu desempenho acadêmico. Dificuldades e críticas são úteis. Sua participação é voluntária e pode ser interrompida.”

## Caracterização inicial

1. Qual curso e período está cursando?
2. Já estudou memória cache? Em qual disciplina ou contexto?
3. Como avalia seu conhecimento: nenhum, básico, intermediário ou avançado?
4. Quando utilizou o Beto pela última vez, com que frequência e para quais atividades? Já utilizou Memora ou outro simulador?
5. Já estudou mapeamento direto, associativo, por conjunto e políticas de substituição?

## Tarefas comuns

| Código | Enunciado ao aluno | Observação |
|---|---|---|
| T1 | Configure o simulador conforme a ficha e informe a sequência. | Campos, rótulos, configuração e ajuda. |
| T2 | Inicie a simulação e acompanhe os primeiros acessos. | Acesso atual e estado de execução. |
| T3 | Identifique um acerto e uma falta. Explique o que ocorreu em cada caso. | Identificação e explicação, além das cores. |
| T4 | Para o endereço indicado, identifique o bloco da memória principal e sua posição na cache. | Relação endereço/bloco/posição. |
| T5 | Localize uma substituição. Qual bloco saiu, qual entrou e por quê? | Mudança de estado e regra/política. |
| T6 | Ao terminar, informe o total de acertos e faltas e explique um resultado observado. | Localização e interpretação. |

Recursos exclusivos do Memora podem ser explorados depois, sem penalizar o Beto por não ter o mesmo caminho. O Memora atual tem Configurar e Simular; a comparação está em Simular, sem aba separada Analisar.

## Questionário após cada ferramenta

Participante: ____ | Ferramenta/commit: ____ | Ordem: ____ | Cenário: ____

C = atende completamente; P = atende parcialmente; N = não atende; NA = não se aplica ou não consegui avaliar. Marcar uma opção por linha.

| Critério | Pergunta adaptada | Resposta |
|---|---|---|
| 1. Facilidade de aprendizado | Foi fácil entender como realizar as tarefas no simulador? | C / P / N / NA |
| 2. Facilidade de uso | Você conseguiu realizar as tarefas sem dificuldades de interação? | C / P / N / NA |
| 3. Flexibilidade | Os recursos permitiram acompanhar a simulação da maneira de que você precisava? | C / P / N / NA |
| 4. Produtividade | Você conseguiu realizar as tarefas sem etapas desnecessárias? | C / P / N / NA |
| 5. Tratamento de erros e auxílio | Quando teve uma dúvida ou cometeu um erro, encontrou orientação para continuar? | C / P / N / NA |
| 6. Navegabilidade | Foi fácil localizar as configurações, a simulação e os resultados? | C / P / N / NA |
| 7. Legibilidade | Os textos, números, tabelas e demais elementos estavam fáceis de ler? | C / P / N / NA |
| 8. Previsibilidade e consistência | Os controles e elementos se comportaram como você esperava? | C / P / N / NA |
| 9. Utilidade | Os recursos foram úteis para resolver as tarefas propostas? | C / P / N / NA |
| 10. Segurança de uso | Você conseguiu corrigir ações equivocadas sem perder inesperadamente o que estava fazendo? | C / P / N / NA |
| 11. Satisfação | Você ficou satisfeito com a experiência de uso do simulador? | C / P / N / NA |

O primeiro item não mede primeiro uso equivalente: os alunos já conhecem o Beto. Segurança refere-se à recuperação de ações e preservação do trabalho.

Perguntas adicionais, analisadas separadamente:

12. O simulador ajudou a entender por que um acesso resultou em acerto ou falta? C / P / N / NA.
13. O simulador ajudou a entender por que um bloco da cache foi substituído? C / P / N / NA.

Comentário opcional: ____

## Entrevista comparativa

1. Como foi sua experiência em cada simulador?
2. Em quais tarefas você encontrou mais dificuldade? O que aconteceu?
3. Em qual simulador foi mais fácil entender o que estava acontecendo a cada acesso? Por quê? Pode responder “nos dois igualmente” ou “em nenhum”.
4. Houve alguma informação que você encontrou com facilidade em um simulador e teve dificuldade para encontrar no outro?
5. Algum texto, símbolo, cor ou controle causou confusão? Qual?
6. Qual simulador você escolheria para estudar memória cache? Por quê? Pode responder “qualquer um” ou “nenhum”.
7. Há algo no Beto que você gostaria de manter no Memora? E o que mudaria no Memora?

Aprofundar com “O que esperava que acontecesse?” ou “Pode mostrar onde ocorreu?”. Evitar perguntas que antecipem elogios ou preferência.

## Ficha de observação — repetir por aluno/ferramenta

Participante: ____ | Data: ____ | Ferramenta/commit: ____ | Ordem/cenário: ____ | Ambiente: ____

Conclusão: sem erro / com erro / não concluída. Ajuda registrada separadamente. Resposta conceitual: correta / parcial / incorreta / NA. Gabarito deve definir elementos esperados antes da coleta.

| Tarefa | Conclusão | Tempo | Ajuda | Resposta conceitual | Dificuldades/episódios |
|---|---|---|---|---|---|
| T1 | | | | NA | |
| T2 | | | | NA | |
| T3 | | | | | |
| T4 | | | | | |
| T5 | | | | | |
| T6 | | | | | |

Falas anonimizadas: ____

## Avaliação complementar — Poliana

Registrar relação com o projeto, experiência e modo: uso direto, demonstração ou revisão do protocolo. Não pressupor especialização em usabilidade, comparar tempos com os dos alunos ou incluí-la nos seus denominadores.

1. As instruções e os termos estão claros? Quais geram dúvidas?
2. A organização ajuda a acompanhar a simulação? Onde falta ou sobra informação?
3. Quais diferenças entre ferramentas facilitam ou dificultam as tarefas?
4. Algo no Memora pode levar a interpretação equivocada? Admitir impossibilidade de avaliar conteúdo técnico.
5. As tarefas e perguntas são adequadas ao público? O que ajustaria?
6. Quais melhorias priorizaria antes de utilizar com mais alunos?

Apresentar em seção própria, registrando convergências e divergências, sem tratar esta contribuição como validação automática dos alunos.

## Análise e calendário

Cada aluno é um caso comparado consigo mesmo. Priorizar contagens absolutas (ex.: “2 dos 3”), episódios e temas explícitos das entrevistas. Preservar divergências. Tempo sofre efeito de experiência e repetição; abandono rápido não é eficiência. Não generalizar ou alegar superioridade estatística. Preferência, usabilidade, apoio percebido e explicação correta são evidências distintas, sem comprovação de aprendizagem duradoura.

Metas internas em 23/10/2026, sujeitas à revisão e disponibilidade:

- 23–25/10: revisar protocolo, ensaiar cenários e preparar fichas.
- 26/10–01/11: sessões com alunos e contribuição complementar de Poliana.
- 02–08/11: anonimização, análise e priorização de ajustes.
- 09–15/11: resultados no artigo e preparação da defesa.

São previsões, não agendamentos confirmados. Registrar desvios na #64 e atualizar a #22.

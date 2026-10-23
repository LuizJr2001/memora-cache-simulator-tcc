> **Roteiro preliminar histórico.** O levantamento foi aplicado de maio a junho de 2026 e contém 13 respostas. Este arquivo não transcreve a versão efetivamente aplicada: os enunciados e respostas estão em `research/survey-2026/respostas-anonimizadas.csv` no repositório. A escala aplicada de utilidade foi de 1 a 4, e não de 1 a 5 como proposto abaixo. Não reutilizar o roteiro como resultado da pesquisa ou instrumento já validado de avaliação do Memora.

# Questionário Google Forms - Levantamento de requisitos do Beto

**Título sugerido:** Levantamento de requisitos para aprimoramento do simulador Beto

**Descrição sugerida para o formulário:**
Este formulário tem como objetivo coletar percepções de estudantes sobre a versão atual do simulador Beto, utilizado para apoio ao ensino de memória cache. As respostas serão usadas apenas para fins acadêmicos, com o objetivo de levantar requisitos e priorizar melhorias de interface, usabilidade e apoio ao aprendizado.

## Configuração recomendada

- Coletar e-mails: não obrigatório, a menos que a orientadora solicite.
- Perguntas obrigatórias: perguntas 1 a 5.
- Em perguntas de múltipla seleção, habilitar opção **Outro**.
- Escala opcional: 1 = discordo totalmente / 5 = concordo totalmente.

## Pergunta 0 - Perfil rápido (opcional)

**Tipo:** múltipla escolha

Qual é sua familiaridade com memória cache?

- Nenhuma ou muito baixa
- Básica, já vi o conteúdo em aula
- Intermediária, consigo resolver exercícios simples
- Alta, já implementei ou estudei simuladores/arquitetura com mais profundidade

## Pergunta 1 - Configuração da simulação

**Tipo:** caixas de seleção

Após utilizar o Beto, quais dificuldades você encontrou ao configurar uma simulação?

- Entender o significado dos campos de configuração
- Saber quais valores são válidos
- Escolher o tipo de mapeamento
- Escolher a política de substituição
- Entender a relação entre memória principal, bloco e linhas de cache
- Campos desalinhados ou visualmente confusos
- Falta de mensagens de erro claras
- Não encontrei dificuldades nessa etapa
- Outro: _______

## Pergunta 2 - Entendimento da execução

**Tipo:** caixas de seleção

Durante a execução da simulação, quais informações você sentiu falta para entender cada acesso à memória?

- Campo de tag do endereço
- Índice/conjunto acessado
- Deslocamento dentro do bloco
- Indicação clara de hit/miss
- Linha ou via escolhida
- Motivo da substituição realizada
- Valor/estado LRU de cada linha ou via
- Bit de validade
- Dirty bit/bit de sujeira
- Histórico passo a passo dos acessos
- Não senti falta de informações nessa etapa
- Outro: _______

## Pergunta 3 - Problemas de usabilidade/UX

**Tipo:** caixas de seleção

Quais problemas de usabilidade ou experiência de uso você percebeu ao usar o Beto?

- Falta de feedback após executar uma ação
- Mensagens pouco claras
- Termos técnicos sem explicação suficiente
- Dificuldade para encontrar botões ou controles
- Dificuldade para corrigir um erro
- Inconsistência visual entre telas/campos
- Excesso de informação na tela
- Desalinhamento de campos ou rótulos
- Falta de ajuda/documentação dentro da interface
- Não percebi problemas de usabilidade
- Outro: _______

## Pergunta 4 - Priorização de melhorias

**Tipo:** caixas de seleção

Quais melhorias você considera mais importantes para uma nova versão do Beto?

- Validação de entradas antes de iniciar a simulação
- Mensagens de erro mais didáticas
- Reorganização visual dos campos de configuração
- Explicação/decomposição do endereço em tag, índice e deslocamento
- Tabela de histórico com cada acesso executado
- Visualização do estado LRU
- Exibição do bit de validade
- Suporte a operações de leitura e escrita (load/store)
- Suporte a dirty bit e políticas de escrita
- Comparação entre duas configurações de cache
- Exemplos prontos de simulação
- Exportação dos resultados
- Outro: _______

## Pergunta 5 - Campo aberto

**Tipo:** resposta longa

De forma geral, o que mais atrapalhou ou poderia melhorar sua experiência de uso com o Beto?

## Pergunta 6 - Avaliação geral (opcional)

**Tipo:** escala linear de 1 a 5

De 1 a 5, quão útil você considera o Beto para entender memória cache?

- 1 = nada útil
- 5 = muito útil

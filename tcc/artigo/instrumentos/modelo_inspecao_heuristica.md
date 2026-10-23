> **Instrumento, não resultado.** As linhas P01–P03 são exemplos de registro de problemas do Beto e não achados confirmados com severidade atribuída. A inspeção formal consolidada e a avaliação externa do Memora permanecem pendentes em 23/10/2026. Para a aplicação atual, registrar versão/data e incluir comparação contextual dentro de Simular, revisão sem execução, conclusão e controles de reprodução.

# Modelo de inspeção heurística - Beto

## Objetivo

Identificar problemas potenciais de usabilidade/UX na versão atual do simulador Beto e transformar os problemas encontrados em melhorias priorizadas para implementação.

## Cenários de avaliação

1. Configurar e executar uma cache com mapeamento direto.
2. Configurar e executar uma cache associativa por conjunto com política LRU.
3. Inserir propositalmente valores inválidos, como tamanhos que não sejam potência de dois.
4. Interpretar hit/miss, tag, índice/conjunto e deslocamento de um acesso.
5. Observar uma substituição e tentar explicar por que a linha/via foi escolhida.

## Heurísticas/princípios para guiar a inspeção

Baseadas em Nielsen e adaptadas para o contexto do Beto:

1. Visibilidade do estado do sistema: a interface mostra claramente o que aconteceu em cada passo?
2. Correspondência com o mundo real/conceitos de AOC: os termos e representações ajudam o estudante a entender memória cache?
3. Controle e liberdade do usuário: é fácil desfazer, reiniciar ou corrigir uma configuração?
4. Consistência e padrões: campos, rótulos, botões e resultados seguem um padrão?
5. Prevenção de erros: a ferramenta impede configurações inválidas antes de executar?
6. Reconhecimento em vez de memorização: o estudante vê tag, índice, offset, LRU e outros dados sem precisar memorizar tudo?
7. Flexibilidade e eficiência de uso: a ferramenta atende tanto iniciantes quanto usuários mais avançados?
8. Estética e design minimalista: a tela evita excesso, desalinhamento e ruído visual?
9. Ajuda para reconhecer, diagnosticar e corrigir erros: as mensagens explicam o problema e indicam solução?
10. Ajuda e documentação: há apoio suficiente para entender campos e resultados?

## Tabela de registro dos problemas

| ID | Cenário/tarefa | Local da interface | Descrição do problema | Evidência/print | Heurística violada | Gravidade | Prioridade | Dificuldade de implementação | Correção proposta | Status |
|---|---|---|---|---|---|---|---|---|---|---|
| P01 | Configurar simulação | Campos de configuração | Campos desalinhados dificultam associação entre rótulo e entrada. | Inserir print | Consistência; estética; facilidade de uso | Pequena/Grande | Alta | Baixa | Reorganizar campos em grid e alinhar rótulos. | Pendente |
| P02 | Inserir valor inválido | Campo de tamanho de bloco | Valor inválido não recebe feedback claro antes da simulação. | Inserir print | Prevenção de erros; ajuda na recuperação | Grande | Alta | Média | Validar entrada e indicar valores aceitos. | Pendente |
| P03 | Interpretar LRU | Tabela da cache | A política LRU é aplicada, mas o estado LRU não é visível. | Inserir print | Visibilidade do estado; reconhecimento em vez de memorização | Grande | Alta | Média | Criar coluna/indicador de estado LRU por linha/via. | Pendente |

## Escala de gravidade sugerida

- Cosmético: problema pequeno, não prejudica muito a tarefa.
- Pequeno: atrapalha a experiência, mas há contorno simples.
- Grande: prejudica a execução ou compreensão da tarefa.
- Catastrófico: impede o uso ou leva a erro grave de interpretação.

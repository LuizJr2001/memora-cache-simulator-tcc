# Metodologia de trabalho

Este guia descreve como planejar, desenvolver, revisar e registrar as atividades do projeto **Memora** durante o Trabalho de Conclusão de Curso.

A metodologia adotada combina:

- **Kanban**, para visualizar e limitar o trabalho em andamento;
- **GitHub Issues**, para registrar requisitos, defeitos, pesquisas e tarefas acadêmicas;
- **GitHub Projects**, para organizar e priorizar o backlog;
- **GitHub Flow**, para desenvolver em branches curtas e integrar mudanças por pull requests;
- **Conventional Commits**, para manter um histórico claro e rastreável.

O objetivo é manter um processo leve, compatível com um projeto acadêmico individual e capaz de relacionar requisitos, implementação, validação e resultados do TCC.

## 1. Organização do GitHub Project

Use o GitHub Project do repositório como quadro Kanban. A configuração recomendada contém as seguintes etapas:

| Etapa | Finalidade |
|---|---|
| **Backlog** | Reúne tudo que pode ser realizado, ainda sem compromisso de execução |
| **Priorizado** | Contém os itens selecionados para as próximas semanas |
| **Em andamento** | Mostra o trabalho que está sendo executado |
| **Em revisão** | Reúne alterações com pull request aberto ou aguardando validação |
| **Concluído** | Contém itens implementados, verificados e integrados |
| **Descartado** | Registra itens inviáveis, duplicados ou removidos do escopo |

Mantenha, preferencialmente, apenas uma ou duas issues em **Em andamento**. Novas demandas devem entrar primeiro no backlog e ser priorizadas antes do início.

## 2. Níveis de planejamento

### Milestones

Milestones representam etapas relevantes do TCC e agrupam issues que contribuem para a mesma entrega.

Sugestão inicial:

1. **M1 — Diagnóstico e levantamento**
2. **M2 — Correções essenciais**
3. **M3 — Melhorias educacionais**
4. **M4 — Avaliação com usuários**
5. **M5 — Entrega final do TCC**

As datas devem acompanhar o cronograma acadêmico e podem ser ajustadas após reuniões de orientação.

### Issues

Cada issue deve representar uma entrega pequena, verificável e com objetivo único. Exemplos:

- validar configurações que não sejam potências de dois;
- corrigir desalinhamento dos campos;
- exibir tag, índice/conjunto e deslocamento;
- registrar o histórico dos acessos;
- exibir o estado da política LRU;
- realizar uma inspeção heurística;
- analisar as respostas do questionário com estudantes.

Use checklists dentro da issue para passos menores. Não é necessário criar uma issue para cada detalhe operacional.

## 3. Tipos de issue

### História de usuário

Use para funcionalidades com benefício perceptível para estudantes ou docentes.

```markdown
Como estudante de Arquitetura de Computadores,
quero visualizar a decomposição do endereço,
para compreender como a cache identifica bloco, conjunto e posição.

## Critérios de aceitação

- [ ] Exibe tag, índice/conjunto e deslocamento
- [ ] Funciona nos três tipos de mapeamento
- [ ] Acompanha cada acesso executado
- [ ] Utiliza rótulos compreensíveis
```

### Relato de defeito

Use quando o comportamento atual estiver incorreto.

```markdown
## Problema

A interface aceita valores que não são potências de dois.

## Comportamento atual

A simulação gera valores decimais e pode desorganizar a interface.

## Comportamento esperado

A execução é impedida e uma mensagem didática é apresentada.

## Como reproduzir

1. ...
2. ...
3. ...
```

### Tarefa acadêmica ou de pesquisa

Use para atividades que não geram diretamente uma funcionalidade.

```markdown
## Objetivo

Executar uma inspeção heurística da tela de configuração.

## Entregável

Tabela contendo problema, heurística violada, severidade e recomendação.

## Critérios de conclusão

- [ ] Todas as telas do escopo foram avaliadas
- [ ] Os problemas receberam nível de severidade
- [ ] As recomendações foram registradas no TCC
```

## 4. Labels

Use poucas labels e combine uma de cada grupo quando fizer sentido.

| Grupo | Labels sugeridas |
|---|---|
| Tipo | `feature`, `bug`, `research`, `ux`, `documentation`, `test`, `technical-debt` |
| Prioridade | `priority: high`, `priority: medium`, `priority: low` |
| Área | `area: simulation`, `area: interface`, `area: cache`, `area: tcc` |

A prioridade deve considerar o valor educacional, a gravidade do problema, as evidências coletadas e o esforço necessário.

## 5. Priorização

Classifique os itens usando valor educacional e esforço:

| Valor educacional | Esforço | Orientação |
|---|---|---|
| Alto | Baixo | Fazer primeiro |
| Alto | Alto | Planejar e dividir |
| Baixo | Baixo | Fazer se houver tempo |
| Baixo | Alto | Descartar ou registrar como trabalho futuro |

Ordem inicial adotada para o Memora (registro de planejamento):

1. validação das configurações;
2. correção de erros e desalinhamentos;
3. decomposição visual dos endereços;
4. histórico de hits, misses e substituições;
5. estado LRU e bit de validade;
6. estatísticas da simulação;
7. escrita, dirty bit e políticas de escrita;
8. exportação e comparação entre configurações.

Situação em 23/10/2026: itens 1–6 estão implementados; escrita/dirty bit, exportação e comparação entre configurações permanecem futuros. O levantamento do Beto já contém 13 respostas; a avaliação externa do Memora e a consolidação formal da inspeção continuam pendentes. O [histórico](docs/historico-desenvolvimento.md) e o [artigo](tcc/README.md) registram o estado das evidências. A prioridade deve ser revista conforme a orientação e a avaliação da versão funcional.

## 6. Fluxo de desenvolvimento

Toda alteração deve seguir este ciclo:

1. criar ou selecionar uma issue;
2. definir prioridade, labels, milestone e critérios de aceitação;
3. mover a issue para **Em andamento**;
4. atualizar a branch `main`;
5. criar uma branch curta vinculada à issue;
6. realizar commits pequenos seguindo Conventional Commits;
7. abrir um pull request;
8. mover a issue para **Em revisão**;
9. validar os critérios de aceitação;
10. integrar o pull request na `main`;
11. excluir a branch e mover a issue para **Concluído**.

### Exemplo de branch

Para a issue 12:

```bash
git switch main
git pull origin main
git switch -c feature/12-decomposicao-endereco
```

O número da issue é recomendado porque facilita a rastreabilidade.

### Exemplos de commits

```text
feat(address): calcula campos do endereço
feat(ui): exibe tag índice e deslocamento
test(address): cobre decomposição no mapeamento direto
```

Consulte [CONTRIBUTING.md](CONTRIBUTING.md) para a lista completa de prefixos e tipos de commit.

## 7. Pull requests

Cada pull request deve ter um objetivo principal e referenciar sua issue com `Closes #N`.

Título:

```text
feat(address): exibe decomposição dos endereços
```

Corpo:

```markdown
Closes #12

## O que mudou

- calcula tag, índice e deslocamento;
- apresenta os campos durante a simulação;
- adapta a visualização aos tipos de mapeamento.

## Por que

Explique o requisito, problema ou evidência que motivou a mudança.

## Como validar

1. Selecione o mapeamento direto.
2. Configure a memória e o tamanho do bloco.
3. Execute uma sequência de endereços.
4. Confira os campos apresentados.

## Critérios atendidos

- [x] ...
```

Use preferencialmente **Squash and merge**, mantendo um commit significativo por entrega na `main`. Exclua a branch depois da integração.

## 8. Definição de pronto

Uma issue de desenvolvimento só pode ser considerada concluída quando:

- os critérios de aceitação foram atendidos;
- os cenários afetados foram testados;
- não há erros conhecidos introduzidos pela mudança;
- a documentação foi atualizada, quando necessário;
- o pull request foi integrado à `main`;
- o resultado relevante para o TCC foi registrado.

Para uma tarefa acadêmica, a definição de pronto deve indicar explicitamente o entregável esperado, como tabela, análise, seção do texto ou conjunto de evidências.

## 9. Rastreabilidade acadêmica

Para demonstrar a relação entre pesquisa e desenvolvimento, cada requisito deve registrar, sempre que possível:

- **origem:** questionário, inspeção de IHC, literatura, orientação ou problema técnico;
- **evidência:** resultado, observação ou referência que justifica a demanda;
- **decisão:** prioridade, adiamento ou descarte;
- **implementação:** issue, branch, commits e pull request;
- **validação:** teste, inspeção ou avaliação com usuários;
- **resultado acadêmico:** seção, tabela ou discussão correspondente no TCC.

Esse registro permite explicar não apenas o que foi implementado, mas por que cada melhoria foi escolhida e como seu resultado foi verificado.

## 10. Rotina recomendada

### No início da semana

- revisar o backlog;
- selecionar os itens de maior prioridade;
- confirmar critérios de aceitação;
- limitar o trabalho em andamento.

### Durante a execução

- atualizar o estado das issues;
- fazer commits pequenos;
- registrar decisões e descobertas na issue;
- evitar mudanças fora do escopo da branch.

### Ao finalizar

- revisar o diff;
- executar os testes aplicáveis;
- abrir o pull request;
- verificar os critérios de aceitação;
- registrar evidências úteis ao texto do TCC.

### Após reunião de orientação ou coleta de dados

- criar ou atualizar issues;
- registrar a origem das novas demandas;
- revisar prioridades;
- documentar itens descartados e sua justificativa.

## 11. Regra prática

Para qualquer atividade relevante, deve ser possível responder:

1. Qual problema ou requisito originou este trabalho?
2. Onde ele está registrado?
3. Como foi priorizado?
4. Em qual branch e pull request foi desenvolvido?
5. Como foi validado?
6. Onde seu resultado aparece no TCC?

Se essas respostas estiverem registradas, o trabalho estará organizado e rastreável.

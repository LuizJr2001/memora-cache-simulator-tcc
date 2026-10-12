# Guia de contribuição

Este documento define o fluxo de branches e commits utilizado no projeto **Memora**.

## Branches

Use `main` como branch estável. Antes de iniciar uma tarefa, atualize-a e crie uma branch específica:

```bash
git switch main
git pull origin main
git switch -c feature/nome-da-tarefa
```

Prefixos adotados:

- `feature/`: nova funcionalidade ou melhoria;
- `bugfix/`: correção de defeito não crítico;
- `hotfix/`: correção crítica e urgente;
- `docs/`: documentação;
- `refactor/`: refatoração sem alteração de comportamento;
- `test/`: testes;
- `chore/`: manutenção e tarefas auxiliares.

Use letras minúsculas, nomes objetivos e palavras separadas por hífen, por exemplo `feature/historico-acessos`.

## Commits

Todas as mensagens devem seguir o padrão [Conventional Commits 1.0.0](https://www.conventionalcommits.org/pt-br/v1.0.0/):

```text
<tipo>(escopo opcional): <descrição curta>
```

Tipos recomendados:

- `feat`: nova funcionalidade;
- `fix`: correção de defeito;
- `docs`: documentação;
- `refactor`: alteração interna sem nova funcionalidade ou correção;
- `test`: testes;
- `style`: formatação sem mudança de comportamento;
- `perf`: melhoria de desempenho;
- `build`: sistema de build ou dependências;
- `ci`: integração contínua;
- `chore`: manutenção;
- `revert`: reversão de commit.

Escreva a descrição no imperativo, de forma curta e sem ponto final:

```text
feat(simulation): adiciona histórico de acessos
fix(validation): rejeita tamanho de bloco inválido
docs: detalha fluxo de contribuição
```

Para mudança incompatível, use `!` ou o rodapé `BREAKING CHANGE:`:

```text
feat(config)!: altera formato das configurações salvas
```

## Pull requests

Antes de abrir um pull request:

1. mantenha a alteração restrita ao objetivo da branch;
2. verifique a execução do simulador e os cenários afetados;
3. revise o diff e remova arquivos temporários;
4. atualize a documentação quando houver mudança de comportamento;
5. use um título de pull request compatível com Conventional Commits.

Descreva no pull request o que mudou, por que a alteração é necessária e como ela foi validada.

## Desenvolvimento do pacote Memora

O novo pacote fica em `packages/memora`; a aplicação legada em `docs/` serve para comparação. A [decisão 003](docs/decisoes/003-pacote-memora.md) detalha a separação entre motor e interface e a ordem de migração.

Requer Node.js 22 ou superior e npm. Execute na raiz:

```bash
npm ci
npm run dev
```

Memora: http://127.0.0.1:5173/ — Beto: http://127.0.0.1:5173/legado/.

Antes do PR, execute `npm run check`. Nesta base isso verifica apenas a sintaxe do servidor; não substitui regressão da simulação. Os testes de regras e controles serão adicionados nas entregas relacionadas à #31. Entregas parciais devem usar `Refs #N`, reservando `Closes #N` para todos os critérios atendidos.


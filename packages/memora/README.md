# Pacote Memora

Pacote npm privado `@memora/simulator`, dentro do mesmo repositório do TCC.
Esta entrega configura apenas a base de desenvolvimento. As telas do Figma e
o motor migrado ainda serão implementados.

## Executar

Requer Node.js 22 ou superior e npm. Na raiz do repositório:

```bash
npm ci
npm run dev
```

- Memora: http://127.0.0.1:5173/
- Beto para comparação: http://127.0.0.1:5173/legado/
- Encerrar: `Ctrl+C`

O servidor usa apenas módulos nativos do Node e escuta no computador local.
Não há dependências externas nesta base. Não é um servidor de produção.

## Verificar

```bash
npm run check
```

Nesta entrega, `check` verifica a sintaxe do servidor. Não constitui teste de
simulação, de usabilidade ou de fidelidade ao Figma. Os testes de comportamento
serão incluídos com a extração do motor, seguindo a issue #31.

## Organização

- `src/core/`: regras e estado da simulação, sem DOM; migração pendente.
- `src/ui/`: telas, componentes, controles e formatação; implementação pendente.
- `src/styles/`: estilos da página inicial; tokens do design serão implementados com as telas.
- `scripts/`: ferramentas de desenvolvimento.

Decisão e sequência de implementação:
[003-pacote-memora.md](../../docs/decisoes/003-pacote-memora.md).

## Origem

O simulador original é o [Beto, de Leandro Gabriel e colaboradores](https://github.com/leo150250/simuladorCache).
O código do legado permanece em `docs/`. A extração e adaptação do motor deve
preservar essa atribuição e a [licença MIT do repositório](../../LICENSE).

# Pacote Memora

Pacote npm privado `@memora/simulator`, dentro do mesmo repositório do TCC.
A base de desenvolvimento e o núcleo de configuração/endereços estão implementados.
As APIs validam parâmetros e sequências antes de fornecer dados para execução.
A interface do Figma e a execução da cache seguem nas próximas entregas.

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
npm test
```

`check` verifica a sintaxe dos módulos em `scripts`, `src` e `tests`. `test`
executa os 28 testes do núcleo com o runner nativo do Node: configurações,
decomposição, sequências, limites e geração controlada. A regressão da execução
da cache e dos controles será acrescentada na #31.

## Organização

- `src/core/`: configuração, endereçamento e preparação de entrada sem DOM;
  execução, políticas, estatísticas e snapshots em migração.
- `src/ui/`: telas, componentes, controles e formatação; implementação pendente.
- `src/styles/`: estilos da página inicial; tokens do design serão implementados com as telas.
- `scripts/`: ferramentas de desenvolvimento.
- `tests/`: testes de comportamento do núcleo.

APIs, regras e limites: [src/core/README.md](src/core/README.md).
A sequência está limitada a 1000 endereços e 18000 caracteres; a interface deve
consumir esses limites e apresentar os erros próximos aos campos.

Decisão e sequência de implementação:
[003-pacote-memora.md](../../docs/decisoes/003-pacote-memora.md).

## Referência visual

A [especificação v2](../../docs/prototipo-v2-especificacao.md) e a issue #37
registram a referência vigente para #35: abas, controles e ajuda contextual.
A avaliação #33 permanece em paralelo; esta base ainda não implementa essas telas.

## Origem

O simulador original é o [Beto, de Leandro Gabriel e colaboradores](https://github.com/leo150250/simuladorCache).
O código do legado permanece em `docs/`. A extração e adaptação do motor deve
preservar essa atribuição e a [licença MIT do repositório](../../LICENSE).

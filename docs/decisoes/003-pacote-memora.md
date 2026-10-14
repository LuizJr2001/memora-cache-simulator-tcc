# 003 — Pacote Memora e evolução gradual do Beto

Data: 30/09/2026. Origem: preferência do autor por um novo pacote.
Issues: #34 (base), #35 (interface), #25–#28, #30 e #31 (regras e testes).

## Contexto

O código executável atual fica em `docs/index.html`, `docs/scripts.js` e
`docs/style.css`. Na base do Beto não havia pacote npm, framework ou suíte automatizada.
`scripts.js` mistura regras da cache, estado global, temporizadores e criação de
elementos HTML. A especificação v2 descreve a nova interface, ainda em avaliação.
Referência: [protótipo v2](../prototipo-v2-especificacao.md), #35 e #37.

## Decisão

Criar `packages/memora`, um pacote npm privado, no mesmo repositório. Começar
com HTML, CSS e JavaScript em módulos ES, aproveitando as tecnologias atuais e
sem introduzir framework nesta primeira entrega. Essa escolha pode ser revista
com evidência de necessidade; não exige reescrever o motor.

O Beto continua disponível em `docs/` como referência executável. O Memora
terá uma nova camada de interface e receberá gradualmente a lógica extraída e
adaptada do Beto. A coexistência é uma estratégia de transição e comparação;
não é uma decisão de manter dois motores independentes permanentemente.

O pacote é privado para evitar publicação acidental no npm. Uma nova pasta ou
um namespace npm não exigem um novo repositório Git.

## Limites entre módulos

- `src/core/`: validação, endereçamento, conjuntos, linhas, políticas, acessos,
  estatísticas e snapshots. Sem DOM nem temporizadores. Random recebe uma fonte
  aleatória injetável para regressão determinística.
- `src/ui/`: telas e componentes, controlador de execução, seleção de acesso,
  histórico e apresentação Decimal/Binário. Consome os resultados do motor.
- `src/styles/`: tokens e estilos compartilhados, a implementar a partir da
  especificação SDS e do Figma.

Preservar os valores anteriores à mutação (#30), separando o estado atual da
cache dos snapshots usados na tela Analisar. Ajuda contextual é conteúdo fixo;
resultados de simulação e estatísticas são dados reais.

## Primeira entrega

Workspace, pacote privado, servidor local e página inicial de desenvolvimento.
As pastas do motor e da interface são pontos de organização: não contêm ainda
funcionalidades migradas. Esta entrega não fecha as issues de funcionalidades.

## Sequência de trabalho

1. #34 — integrar a base do pacote após revisão.
2. #25 + #31 — extrair/adaptar configuração e validação com testes de limites e
   dos três mapeamentos; integrar à Tela 1, acompanhada em #35.
3. #26 + #27 — validar a sequência, definir limite de geração e corrigir o fluxo
   editar → gerar, com mensagens próximas dos campos.
4. #30 + #31 — extrair/adaptar a execução por acesso, preservar bloco removido
   e verificar hits, misses, estatísticas e escolha de linha nos cenários base.
5. #35 + #28 — implementar Simular, controles e exposição do estado LRU.
6. #35 — implementar Analisar e completar os side sheets, Glossário e Ajuda rápida.
7. #31 — consolidar regressão dos controles, alterações entre execuções e
   estados inválidos; registrar evidências por entrega.

Não aguardar #33 para começar. Incorporar o feedback do protótipo por ajustes
rastreáveis. Load/store, políticas de escrita e dirty bit (#32) continuam fora
do escopo essencial.

## Progresso — 12/10/2026

A base foi integrada pelo [PR #36](https://github.com/LuizJr2001/memora-cache-simulator-tcc/pull/36).
O [PR #41](https://github.com/LuizJr2001/memora-cache-simulator-tcc/pull/41) introduz configuração, decomposição, validação/geração de
endereços e preparação de entrada, com 28 testes automatizados e sem DOM.
As [APIs do núcleo](../../packages/memora/src/core/README.md) documentam o
contrato e os limites de 1000 endereços e 18000 caracteres.

A integração com a Tela 1 permanece na #35. Execução, snapshots anteriores,
políticas e controles serão extraídos nas entregas seguintes; esta etapa não
completa a regressão da simulação da #31.

## Progresso — 14/10/2026 · telas Configurar e Simular

A Tela 1 está implementada no PR #43, ainda em revisão. A branch
`feature/35-tela-2` parte do seu commit `d9258a9` e acrescenta a Tela 2:
motor de execução esparso, FIFO/LRU/Random, snapshots imutáveis, controles,
histórico, revisão de acessos, Decimal/Binário e três novas ajudas.
O PR da Tela 2 usa a branch da Tela 1 como base temporária; não declara
integração à `main` nem conclusão da #35.

A separação prevista foi mantida: `src/core/simulation.js` não conhece DOM ou
relógio; `src/ui/simulation-controller.js` controla tempo e seleção;
`src/ui/simulate-screen.js` apresenta os dados. O núcleo de configuração foi
reutilizado. O Beto executável, a licença e as atribuições foram preservados.

Verificação local: **58 testes Node e 67 cenários Chromium** aprovados.
[Evidências da Tela 2](../../packages/memora/docs/verificacao-tela-2.md).
Analisar e suas quatro ajudas continuam como próxima entrega; a avaliação #33
segue em paralelo e a publicação em produção ainda não foi definida.

## Progresso — 14/10/2026 · Tela 3 e fluxo completo

`feature/35-tela-3` parte do commit `4d9c3ea` da Tela 2 (PR #44), que depende
da Tela 1 (PR #43). A análise lê os snapshots existentes sem duplicar o motor.
A projeção pura fica em `src/ui/analysis-model.js`; a apresentação em
`src/ui/analyze-screen.js`; a navegação permanece em `src/ui/main.js`.

Analisar cobre substituições, acertos e cargas em vaga livre. Próximo acesso
percorre registros salvos antes de executar um acesso novo; a vítima Random
não é sorteada outra vez durante a revisão. Os quatro side sheets completam
as 18 ajudas da v2. Os 58 textos de via da seção Analisar no Figma foram
sincronizados com a sequência real.

O fluxo das três telas foi verificado com **65 testes Node e 89 cenários
Chromium**. [Relatório da Tela 3](../../packages/memora/docs/verificacao-tela-3.md).
Núcleo executável, Beto e licença foram preservados. A integração dos PRs,
a avaliação com participantes e a publicação permanecem como próximos passos.

## Como trabalhar

Seguir `CONTRIBUTING.md` e `WORKFLOW.md`: uma ou duas issues em andamento,
branches curtas a partir de `main`, commits convencionais, PR por entrega e
verificação dos critérios antes de integrar. Exemplo da próxima branch:

```bash
git switch main
git pull origin main
git switch -c feature/25-validacao-configuracao-memora
```

Relacionar cada PR à issue de comportamento e a #35 quando incluir uma tela.
Fechar uma issue apenas quando seus critérios completos estiverem atendidos;
usar `Refs #N` em entregas parciais. Registrar screenshots e verificações nos
PRs visuais, e resultados esperados/reais nos PRs do motor.

## Publicação e atribuição

O servidor local mostra Memora em `/` e o Beto em `/legado/`. A configuração de
GitHub Pages e os arquivos executáveis de `docs/` não são alterados nesta base.
O pacote fora de `docs/` não é automaticamente publicado pelo Pages atual.
Decidir o caminho de build/publicação somente quando houver uma versão
funcional testada; o link local de comparação não define uma rota de produção.

Manter a licença MIT original, a autoria de Leandro Gabriel e colaboradores e
a identificação da origem nos módulos adaptados. A versão legada é a base de
comparação, não uma referência correta para os defeitos já registrados.


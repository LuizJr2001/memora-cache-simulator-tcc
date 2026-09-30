# 003 — Pacote Memora e evolução gradual do Beto

Data: 30/09/2026. Origem: preferência do autor por um novo pacote.
Issues: #34 (base), #35 (interface), #25–#28, #30 e #31 (regras e testes).

## Contexto

O código executável atual fica em `docs/index.html`, `docs/scripts.js` e
`docs/style.css`. Não existe pacote npm, framework ou suíte automatizada.
`scripts.js` mistura regras da cache, estado global, temporizadores e criação de
elementos HTML. O protótipo V1.2 descreve uma interface nova, ainda em avaliação.

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

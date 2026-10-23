# Verificação da configuração inicial do Memora

**Solicitação e implementação:** 22/10/2026. **Verificação final:** 23/10/2026,
horário de Brasília. Refs #35 e #37.

## Valores de abertura

A abertura usa os valores do Beto apresentados pelo autor, também disponíveis
no [HTML legado](../../../docs/index.html): 1 byte por célula, 4096 células,
blocos de 16, 32 linhas, mapeamento direto e a sequência:

```text
0, 1, 6, 7, 8, 9, 992, 993, 994, 481, 482, 0, 1, 2, 996, 224, 225, 2017, 2018, 4064, 996
```

Iniciar simulação fica disponível ao abrir. A prévia calcula 3 bits de tag,
5 de linha e 4 de deslocamento. A preparação abre Simular em 0/21; a reprodução
usa velocidade 5 e etapas detalhadas. Os 21 acessos terminam em 13 acertos,
8 faltas e 3/32 linhas usadas.

FIFO aparece selecionado e desabilitado no direto, com a indicação de que a
política não se aplica a esse mapeamento. Ao escolher um mapeamento associativo,
FIFO fica editável. O núcleo mantém `replacement: null` no direto.
O gerador apresenta quantidade inicial 32.

Carregar exemplo didático usa seu cenário fixo por conjunto, com 2 vias e LRU:
12 acertos, 9 faltas e 8/32 linhas usadas. As constantes de abertura e do
exemplo são independentes; as ajudas mantêm esse cenário de referência.

## Verificação local

Ambiente: Node.js 24.19.0, Playwright 1.64.0 e Chromium 153.0.8010.0.

- Sintaxe dos 31 arquivos JavaScript, 75 testes Node e build estático aprovados.
- A regressão Chromium cobre a abertura, a quantidade inicial do gerador,
  alternância de mapeamentos, preparação sem avanço automático e os 21 acessos
  até a conclusão. Também mantém os cenários das três telas e do exemplo LRU.
- Foram verificados **97 cenários Chromium**: 46 de Configurar, 29 de Simular
  e 22 de Analisar. Na execução completa com um worker, 95 passaram e dois
  excederam o limite de 30 segundos. Esses dois passaram na reexecução isolada
  com limite de 60 segundos, em 6,6 e 1,7 segundos, sem alteração da aplicação.
- Os testes de estado vazio agora apagam a sequência explicitamente; o teste
  de reprodução usa relógio virtual pausado para controlar cada avanço.
- Abertura conferida em 801 × 720, 1024 × 768, 1180 × 720, 1280 × 720,
  1366 × 768, 1480 × 742, 1920 × 1080 e larguras de 390 e 320 px. Desktop
  sem rolagem da página; nenhum overflow horizontal.
- Botão de início ocupa a largura dos cartões, gerador mantém 16 px de
  espaço lateral e distância de 16 px até a ajuda. Geração e retorno do foco
  conferidos, sem erros JavaScript.
- Os links relativos dos documentos alterados e `git diff --check` passaram.

## Capturas inspecionadas

| Estado | Evidência |
|---|---|
| Abertura em 1280 × 720 | [Captura](screenshots/configuracao-inicial/configurar-1280x720.png) |
| Abertura em 801 × 720 | [Captura](screenshots/configuracao-inicial/configurar-801x720.png) |
| Abertura em 320 px | [Captura](screenshots/configuracao-inicial/configurar-320px.png) |
| Gerador com quantidade 32 | [Captura](screenshots/configuracao-inicial/gerador-32-enderecos.png) |

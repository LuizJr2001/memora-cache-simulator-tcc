# Núcleo da simulação Memora

A configuração e a decomposição do Beto foram adaptadas para módulos ES sem DOM.
A origem e a licença MIT estão identificadas em `configuration.js` e no
[LICENSE](../../../../LICENSE).

`simulation.js` acrescenta execução, políticas, estatísticas e snapshots ao
núcleo, também com atribuição ao Beto e sem DOM ou temporizadores.
A referência visual é a
[especificação v2](../../../../docs/prototipo-v2-especificacao.md).

## APIs

| Módulo | API | Resultado |
|---|---|---|
| `configuration.js` | `validateConfiguration(raw)` | Parâmetros normalizados e layout, ou erros associados aos campos |
| `configuration.js` | `decomposeAddress(address, raw)` | Bloco, conjunto, tag, deslocamento e intervalo de células |
| `addresses.js` | `validateAddresses(text, memoryCells)` | Sequência válida ou erros com valor e posição |
| `addresses.js` | `generateAddresses(count, memoryCells, random?)` | Nova sequência, com fonte aleatória controlável |
| `input.js` | `prepareSimulationInput(raw, text)` | Entrada pronta e imutável; `input: null` quando houver erro |
| `simulation.js` | `createSimulation(input, { random }?)` | Motor com `view()`, `step()`, `nextAccess()` e `reset()` |
| `simulation.js` | `lruState(cache, configuration)` | Posições por conjunto; `null` no direto ou com FIFO/Random |

A interface deve usar `prepareSimulationInput` antes de criar uma simulação.
O retorno tem `ok`, `errors.fields`, `errors.sequence` e `input`. A configuração
é validada primeiro, para evitar mensagens de intervalo baseadas em parâmetros
inválidos. Esses módulos não criam ou modificam uma cache.

## Regras

- Inteiros positivos e seguros; potências de 2 em células, bloco, linhas e vias
- Bytes por célula é inteiro positivo; o endereço identifica a célula, sem
  multiplicar o intervalo de endereços por esse valor
- Bloco limitado pela memória e vias compatíveis com as linhas
- Quantidades inteiras e não negativas de bits, incluindo campos de zero bits
- Capacidade em bytes dentro da precisão dos inteiros de JavaScript

| Mapeamento | Vias normalizadas | Substituição |
|---|---|---|
| Direto | 1 | `null`, sem escolha entre linhas |
| Totalmente associativo | Total de linhas | FIFO, LRU ou RANDOM |
| Por conjunto | Valor que divide o total de linhas | FIFO, LRU ou RANDOM |

A decomposição usa divisão e resto, sem operações bit a bit limitadas a 32 bits.
O cenário didático mantém 4096 células, blocos de 16, 32 linhas, 2 vias e LRU:
12 bits de endereço divididos em 4 de tag, 4 de conjunto e 4 de deslocamento.
O endereço 3044 corresponde a bloco 190, tag 11, conjunto 14 e deslocamento 4.

## Sequências e geração

Aceitam vírgulas, espaços e quebras de linha. Itens vazios entre vírgulas,
negativos, frações, texto, notação hexadecimal/exponencial e valores fora de
`0..memoryCells - 1` são rejeitados. Uma sequência com erro não libera uma
lista parcialmente válida.

Limites definidos para a primeira implementação:

- `MAX_ADDRESSES = 1000`, para entrada manual e geração
- `MAX_SEQUENCE_CHARACTERS = 18000`, verificado antes de separar os itens

O limite de caracteres permite 1000 endereços de 16 dígitos separados por
vírgula e espaço e evita trabalho excessivo com texto colado. É uma decisão
de implementação da #26, ajustável com evidências da versão funcional.

A geração recebe uma função que retorna um número finito entre 0, inclusive,
e 1, exclusivo. O padrão é `Math.random`. Parâmetros inválidos geram
`RangeError`; a interface deve apresentar a mensagem sem substituir a entrada.
Essa fonte controla a geração de endereços. A política Random recebe outra
fonte, pelo argumento de `createSimulation`, e só a consulta em substituições
com o conjunto cheio. O padrão de ambas é `Math.random`.

## Execução, políticas e snapshots

O motor revalida configuração e endereços e recalcula o layout recebido.
`createSimulation` começa com cache vazia e zero acessos processados.
`step()` percorre `decompose → search → result → select → update → complete`.
A cache e a quantidade de linhas ocupadas mudam em `update`; progresso,
acertos, faltas e histórico confirmam o acesso em `complete`. `nextAccess()` conclui exatamente um acesso, inclusive quando uma
microetapa já está pendente; após o fim, ambos são operações sem efeito.

Vias livres são ocupadas em ordem crescente. Direto sempre usa a única via da
linha; FIFO escolhe a menor data de inserção; LRU, a menor data de último uso;
Random, `floor(random() * ways)`. Empates determinísticos usam a menor via.
Acertos atualizam recência, preservando a data original de inserção FIFO.
Uma fonte Random inválida lança `RangeError` antes de modificar a cache ou
contabilizar o acesso.

`view()` retorna configuração/layout, fase, estatísticas, cache, histórico,
acesso pendente e último acesso. Cada registro do histórico contém:

- `number`, `address`, `decomposition`, `result`, `reason`, `way` e `replaced`
- `lineBefore` e `lineAfter`, com os intervalos removido e inserido preservados
- `before` e `after`, cada qual com `cache` e `statistics`

Os objetos e arrays expostos são imutáveis. Cada atualização cria outra linha;
reiniciar não modifica referências antigas. Vias são zero-based no núcleo e
apresentadas como 1, 2, … na interface. `lruState` usa posição 1 para a via mais
recente e só indica candidata à substituição quando o conjunto está cheio.
Não se confunde essa posição com o número da via.

A cache é esparsa: só linhas ocupadas são armazenadas, com os limites numéricos
de cada bloco, sem materializar suas células. Uma configuração de 2^52 linhas
não cria 2^52 objetos. Os snapshots compartilham as linhas imutáveis, mas
preservam arrays por acesso; o limite de 1000 endereços também limita esse custo.

O exemplo da v2 termina em 12 acertos, 9 faltas, taxa de 57,1% e 8/32 linhas.
No acesso 20, a via 1 do conjunto 14 troca 992–1007 por 3040–3055.
Ver [relatório da Tela 2](../../docs/verificacao-tela-2.md) para os cenários de
regressão da #30 e a correção de referência no Figma.

## Testar

Na raiz do repositório:

```bash
npm ci
npm run check
npm test
```

São 58 testes Node no pacote: 28 de configuração/entradas, 9 do controlador de
Configurar, 15 de execução e 6 do controlador de Simular. Cobrem os três
mapeamentos, FIFO/LRU/Random, vítimas, estatísticas, fontes controladas, snapshots,
seis fases, relógio, reinício e limites. A regressão visual roda separadamente
com Playwright, conforme o README do pacote. Tela 3 e sua regressão seguem na #35/#31.

Implementação: [PR #41](https://github.com/LuizJr2001/memora-cache-simulator-tcc/pull/41); #25, #26, #27, #31 e #35.

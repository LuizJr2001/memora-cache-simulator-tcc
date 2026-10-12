# Núcleo de configuração e endereçamento

A configuração e a decomposição do Beto foram adaptadas para módulos ES sem DOM.
A origem e a licença MIT estão identificadas em `configuration.js` e no
[LICENSE](../../../../LICENSE).

A execução da cache, as políticas, as estatísticas e os snapshots serão
extraídos nas próximas entregas. A referência visual é a
[especificação v2](../../../../docs/prototipo-v2-especificacao.md).

## APIs

| Módulo | API | Resultado |
|---|---|---|
| `configuration.js` | `validateConfiguration(raw)` | Parâmetros normalizados e layout, ou erros associados aos campos |
| `configuration.js` | `decomposeAddress(address, raw)` | Bloco, conjunto, tag, deslocamento e intervalo de células |
| `addresses.js` | `validateAddresses(text, memoryCells)` | Sequência válida ou erros com valor e posição |
| `addresses.js` | `generateAddresses(count, memoryCells, random?)` | Nova sequência, com fonte aleatória controlável |
| `input.js` | `prepareSimulationInput(raw, text)` | Entrada pronta e imutável; `input: null` quando houver erro |

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
Essa fonte controla a geração de endereços; a política Random da cache será
implementada separadamente.

## Testar

Na raiz do repositório:

```bash
npm ci
npm run check
npm test
```

São 28 testes de configuração, limites, decomposição dos três mapeamentos,
sequências, geração e preparação de entrada. Hits/misses, vítimas, estatísticas
e controles seguem na regressão das próximas entregas da #31.

Implementação: [PR #41](https://github.com/LuizJr2001/memora-cache-simulator-tcc/pull/41); #25, #26, #27, #31 e #35.

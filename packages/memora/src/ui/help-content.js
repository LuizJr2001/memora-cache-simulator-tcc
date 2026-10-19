// Textos da v2 do Figma; esclarecimentos de Configurar e origem em 18/10/2026
// Descrição explica a regra; o exemplo é fixo e não usa a configuração atual
export const HELP_CONTENT = {
  "analysis-decision": {
    "title": "Decisão de substituição",
    "node": "311:6786",
    "body": [
      "Revise a política e a via escolhida quando uma falta exige substituir um bloco\n\nOs passos mostram a escolha da vítima e a atualização da cache",
      "Endereço 3044 → conjunto 14 cheio → LRU escolhe o bloco 992–1007 → entra o bloco 3040–3055"
    ]
  },
  "analysis-snapshots": {
    "title": "Estado antes × depois",
    "node": "311:6956",
    "body": [
      "Antes: estado usado para escolher a via\nDepois: estado após carregar o novo bloco\n\nCompare o bloco removido, o inserido e a recência das vias",
      "Na via 1, o bloco 992–1007 é removido e o bloco 3040–3055 é inserido. A tag muda de 3 para 11"
    ]
  },
  "analysis-lru": {
    "title": "LRU na decisão",
    "node": "311:7126",
    "body": [
      "Com o conjunto cheio, uma falta substitui a via que ficou há mais tempo sem ser acessada\n\nA escolha considera a ordem de uso em Antes, anterior à atualização da cache",
      "A via 2 foi acessada depois da via 1. Sem via livre, a próxima falta substitui a via 1"
    ]
  },
  "analysis-decomposition": {
    "title": "Decomposição do endereço",
    "node": "311:7296",
    "body": [
      "Tag: usada para identificar o bloco\nConjunto: indica onde procurar\nDeslocamento: seleciona a célula dentro do bloco\n\nA quantidade de bits depende da arquitetura e do mapeamento",
      "2018 = 0111 | 1110 | 0010\nTag 7 · Conjunto 14 · Deslocamento 2\nSão 4 bits para cada parte"
    ]
  },
  "bytesPerCell": {
    "title": "Bytes por célula",
    "node": "311:251",
    "body": [
      "Defina quantos bytes há em cada célula endereçável\n\nUse um número inteiro positivo",
      "4096 células × 1 byte = 4096 bytes (4 KiB)"
    ]
  },
  "memoryCells": {
    "title": "Total de células",
    "node": "311:386",
    "body": [
      "Defina o total de células da memória principal. Os endereços vão de 0 a total de células − 1\n\nUse uma potência de 2: bits de endereço = log₂(total de células)",
      "4096 células → 12 bits de endereço e intervalo de 0 a 4095"
    ]
  },
  "cellsPerBlock": {
    "title": "Células por bloco",
    "node": "311:521",
    "body": [
      "Defina quantas células consecutivas formam um bloco transferido para a cache\n\nO tamanho deve ser compatível com a memória e uma potência de 2: bits de deslocamento = log₂(células por bloco)",
      "16 células por bloco → 4 bits de deslocamento\nO bloco 992–1007 contém 16 células"
    ]
  },
  "cacheLines": {
    "title": "Número de linhas",
    "node": "311:656",
    "body": [
      "Defina quantas linhas a cache terá. Cada linha armazena um bloco\n\nNo mapeamento por conjunto, o total de linhas deve ser divisível pelo número de vias: conjuntos = linhas ÷ vias",
      "32 linhas × 16 células por bloco = 512 células de dados na cache"
    ]
  },
  "mapping": {
    "title": "Mapeamento",
    "node": "311:792",
    "body": [
      "O mapeamento define onde procurar o bloco e como dividir o endereço\n\nDireto: tag | linha | deslocamento; uma única linha possível\nTotalmente associativo: tag | deslocamento; qualquer linha, sem bits de conjunto\nPor conjunto: tag | conjunto | deslocamento; qualquer via do conjunto correspondente",
      "No exemplo por conjunto, o bloco 190 só pode ocupar uma das 2 vias do conjunto 14"
    ]
  },
  "ways": {
    "title": "Vias por conjunto",
    "node": "311:927",
    "body": [
      "Defina quantas linhas haverá em cada conjunto. O número de vias deve dividir o total de linhas\n\nDireto: 1 via por conjunto\nTotalmente associativo: todas as linhas em um único conjunto",
      "32 linhas ÷ 2 vias = 16 conjuntos\nSão 4 bits para identificar o conjunto"
    ]
  },
  "replacement": {
    "title": "Substituição",
    "node": "311:1062",
    "body": [
      "Escolha a política usada quando uma falta exige substituir um bloco e não há linha livre\n\nNo direto, há apenas uma linha possível. Nos mapeamentos associativos, escolha LRU, FIFO ou Random",
      "Com 2 vias e LRU, a falta no endereço 3044 substitui o bloco 992–1007, usado há mais tempo"
    ]
  },
  "sequence": {
    "title": "Endereços a acessar",
    "node": "311:1197",
    "body": [
      "Informe a sequência de endereços que você quer simular ou use Gerar endereços aleatórios para preencher Endereços a acessar\n\nA geração substitui a sequência atual e pode repetir endereços. Use inteiros de 0 a total de células − 1; corrija entradas inválidas antes de iniciar",
      "A sequência fixa do exemplo tem 21 endereços entre 0 e 4095 e reproduz uma substituição LRU"
    ]
  },
  "how": {
    "title": "Como funciona?",
    "node": "311:7771",
    "body": [
      "O Memora aprimora o Beto, simulador educacional de memória cache de Leandro Gabriel e colaboradores, com validação, explicações e análise dos acessos\n\nEm cada acesso, o endereço é dividido conforme o mapeamento\n\nACERTO: o bloco é encontrado em uma linha válida\nFALTA: o bloco precisa ser carregado; com o conjunto cheio, uma linha é substituída",
      "Memória: 4096 células de 1 byte e blocos de 16 células\nCache: mapeamento por conjunto, 32 linhas, 2 vias e LRU\nEndereço: 12 bits — 4 de tag, 4 de conjunto e 4 de deslocamento"
    ]
  },
  "lru": {
    "title": "Estado LRU",
    "node": "311:2383",
    "body": [
      "Mais recente: via acessada por último\nPróxima substituição: via menos recente, candidata a sair quando não houver via livre\n\nEssas indicações aparecem apenas com a política LRU",
      "Em um conjunto com 2 vias, após acessar 2018, a via 2 (bloco 2016–2031) fica mais recente; a via 1 (bloco 992–1007) passa a ser candidata à próxima substituição"
    ]
  },
  "cache": {
    "title": "Memória cache",
    "node": "311:2736",
    "body": [
      "Veja os blocos armazenados e os metadados de cada linha\n\nVálido: indica se a linha contém um bloco válido\nTag: usada para identificar o bloco\nBloco armazenado: intervalo de células do bloco\nLRU: ordem de uso das vias, disponível com a política LRU",
      "No conjunto 14, a tag 7 identifica o bloco 2016–2031; a tag 3 identifica o bloco 992–1007"
    ]
  },
  "history": {
    "title": "Histórico de acessos",
    "node": "311:3082",
    "body": [
      "Veja a ordem dos acessos, seus resultados e as explicações\n\nSelecione uma linha para revisar os detalhes do acesso",
      "Endereço 2018 → ACERTO: o bloco 2016–2031 já está na cache"
    ]
  },
  "glossary": {
    "title": "Glossário",
    "node": "311:7907",
    "body": [
      "Acerto (hit): O dado já está em uma linha válida da cache com a tag esperada\n\nFalta (miss): O bloco ainda não está disponível na posição consultada e precisa ser carregado\n\nBloco: Grupo de células transferido entre memória principal e cache\n\nLinha: Posição física da cache que armazena um bloco e seus metadados\n\nVia: Uma das linhas possíveis dentro de um conjunto associativo\n\nTag: Parte do endereço usada para identificar qual bloco está armazenado\n\nConjunto: Grupo de linhas da cache no qual um endereço pode ser procurado\n\nDeslocamento: Bits que selecionam a célula ou byte dentro do bloco\n\nVálido: Indica se o conteúdo da linha pode ser considerado durante a busca\n\nLRU: Substitui a linha usada há mais tempo entre as candidatas do conjunto\n\nFIFO: Substitui a linha que entrou primeiro entre as candidatas\n\nRandom: Seleciona aleatoriamente uma linha candidata à substituição"
    ]
  },
  "quick": {
    "title": "Ajuda rápida",
    "node": "311:8070",
    "body": [
      "1 · Configurar\nDefina a arquitetura e os endereços, ou carregue o exemplo didático\n\n2 · Simular\nAcompanhe os acessos, a cache e o histórico\n\n3 · Analisar\nCompare a cache antes e depois de uma substituição"
    ]
  }
};

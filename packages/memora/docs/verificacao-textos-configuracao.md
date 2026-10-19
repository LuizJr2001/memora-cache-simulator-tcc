# Verificação dos textos de Configurar e da documentação

**Data:** 18/10/2026. Referências: #35 e #37.

## Resultado

Configurar identifica a geração como aleatória e informa que os valores
substituem **Endereços a acessar**, dentro do intervalo da memória atual e com
possíveis repetições. A prévia explicita Tag/Linha/Deslocamento no direto,
Tag/Conjunto/Deslocamento por conjunto e Tag/Deslocamento no totalmente
associativo. O rodapé e Como funciona? apresentam a origem no simulador Beto.

O espaço entre o resumo e a decomposição foi compactado nos desktops de
801 a 1050 px com até 850 px de altura, acomodando o texto maior do botão e a
explicação do mapeamento. O layout de 801 × 720 continua inteiro na janela,
sem ocultar o overflow da página ou reduzir a fonte.

READMEs, contribuição, especificação v2, decisão de arquitetura e publicação
agora registram as três telas e o Pages como integrados. O
[histórico do projeto](../../../docs/historico-desenvolvimento.md) consolida
datas, decisões e evidências, preservando as pendências acadêmicas.

## Verificação local

Ambiente: Node.js **24.19.0**, Playwright **1.64.0** e Chromium **153.0.8010.0**.
Um Chromium já disponível pode ser selecionado por `MEMORA_CHROMIUM_PATH`.

| Verificação | Resultado |
|---|---|
| `npm run check` | Sintaxe válida em 31 arquivos JavaScript |
| `npm test` | 75/75 testes Node aprovados |
| `npm run test:ui --workspace @memora/simulator -- --workers=3` | 96/96 cenários Chromium aprovados: 45 Configurar, 29 Simular e 22 Analisar |
| `npm run build` | Publicação estática preparada com sucesso após o ajuste de layout |
| `git diff --check` | Sem problemas de whitespace |
| Links relativos dos documentos alterados | Destinos locais conferidos |

A conferência adicional percorreu os três mapeamentos em **801 × 720,
1024 × 768, 1280 × 720, 1366 × 768, 1480 × 742 e 1920 × 1080**: nenhuma
rolagem da página. Em **320 × 900**, o fluxo vertical permanece sem overflow
horizontal. As cinco capturas abaixo foram inspecionadas visualmente.

Com a memória alterada para **512 células**, o gerador informou **0 a 511**.
Uma fonte controlada de aleatoriedade produziu **511, 511, 511**, substituindo
a sequência anterior, fechando o painel e anunciando o destino em
`action-status`. A origem no Beto aparece na ajuda; não ocorreram erros de
execução JavaScript na conferência.

Os arquivos executáveis do Beto, `LICENSE` e `src/core` não têm diferenças
em relação à base desta revisão. A avaliação externa continua nas issues
próprias; estes resultados são de verificação técnica local.

## Capturas

| Estado | Evidência |
|---|---|
| Configurar em 1280 × 720 | [Captura](screenshots/textos-configuracao/configurar-1280x720.png) |
| Configurar em 801 × 720 | [Captura](screenshots/textos-configuracao/configurar-801x720.png) |
| Fluxo vertical em 320 px | [Captura](screenshots/textos-configuracao/configurar-320px.png) |
| Geração aleatória com memória de 512 células | [Captura](screenshots/textos-configuracao/gerar-enderecos-aleatorios.png) |
| Origem no Beto em Como funciona? | [Captura](screenshots/textos-configuracao/origem-beto.png) |

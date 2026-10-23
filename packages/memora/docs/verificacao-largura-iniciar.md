# Verificação do espaçamento e da ação Iniciar simulação

**Data:** 18/10/2026. Refinamento após o PR #49. Refs #35 e #37.

## Resultado

- **Gerar endereços aleatórios** fica a **16 px** da interrogação.
- O rótulo visível **Primeiro endereço: …** foi removido da prévia. A origem
  dos valores continua disponível na descrição acessível dos cartões.
- **Iniciar simulação** ocupa toda a largura disponível, alinhado às bordas do
  campo de endereços, com texto centralizado.
- Em desktops estreitos, o rótulo Endereços a acessar pode quebrar em duas
  linhas; os espaçamentos locais se ajustam para manter a tela sem rolagem.

## Verificação local

Ambiente: Node.js 24.19.0, Playwright 1.64.0 e Chromium 153.0.8010.0.

| Verificação | Resultado |
|---|---|
| `npm run check` | 31 arquivos JavaScript com sintaxe válida |
| `npm test` | 75 testes Node aprovados |
| Suíte Chromium de Configurar | 45 cenários aprovados, incluindo 801 × 720, 52 bits, validação, teclado e foco |
| `npm run build` | Publicação estática preparada com sucesso |
| `git diff --check` | Sem problemas de whitespace |

Os três mapeamentos foram conferidos em **801 × 720, 1024 × 768, 1180 × 720,
1280 × 720, 1366 × 768, 1480 × 742 e 1920 × 1080**, sem rolagem da página.
Em **390 e 320 px**, o fluxo permanece vertical, sem overflow horizontal.

Em todas essas larguras, o intervalo entre gerador e ajuda foi de 16 px; o
botão Iniciar simulação teve a mesma largura do campo e ficou centralizado no
painel, com diferença inferior a 1 px. Nenhum rótulo visível do primeiro endereço
permaneceu. Geração e retorno de foco foram conferidos, sem erros JavaScript.

## Capturas inspecionadas

| Layout | Evidência |
|---|---|
| 1280 × 720 | [Captura](screenshots/largura-iniciar/configurar-1280x720.png) |
| 801 × 720 | [Captura](screenshots/largura-iniciar/configurar-801x720.png) |
| 320 px, fluxo vertical | [Captura](screenshots/largura-iniciar/configurar-320px.png) |

## Refinamento do gerador — 22/10/2026

O botão **Gerar endereços aleatórios** recebeu **16 px de espaço interno em
cada lateral**, antes 4 px, para afastar o texto das bordas. O botão ficou
24 px mais largo; a distância até a interrogação permanece em 16 px.

Sintaxe, 75 testes Node, 45 cenários Chromium de Configurar e build foram
verificados novamente. Os três mapeamentos foram inspecionados nas nove
dimensões acima, com 16 px de padding lateral, sem overflow horizontal e sem
rolagem da página no desktop. A geração e o retorno de foco também passaram,
sem erros JavaScript.

| Layout atualizado | Evidência |
|---|---|
| 1280 × 720 | [Captura](screenshots/gerador-espacamento/configurar-1280x720.png) |
| 801 × 720 | [Captura](screenshots/gerador-espacamento/configurar-801x720.png) |
| 320 px, fluxo vertical | [Captura](screenshots/gerador-espacamento/configurar-320px.png) |

# Verificação do título e das ações de endereços

**Data:** 18/10/2026. Refinamento após a integração do PR #48. Refs #35 e #37.

## Comportamento

- Título completo: **COMO O ENDEREÇO SERÁ DIVIDIDO DE ACORDO COM O MAPEAMENTO**.
- **Gerar endereços aleatórios** fica junto de **Endereços a acessar**,
  imediatamente à esquerda da interrogação e alinhado ao centro dela.
- **Iniciar simulação** fica centralizado horizontalmente no painel, abaixo
  dos cartões, com largura máxima de 364 px.
- A linha de contexto identifica o mapeamento selecionado e o primeiro
  endereço; os cartões apresentam as partes e as respectivas quantidades de bits.
- Nas telas menores, o grupo gerador/ajuda pode ocupar a linha abaixo do
  rótulo, preservando a ordem e os textos completos.

## Conferência local

Node.js 24.19.0, Playwright 1.64.0 e Chromium 153.0.8010.0.

| Verificação | Resultado |
|---|---|
| `npm run check` | Sintaxe válida em 31 arquivos JavaScript |
| `npm test` | 75 testes Node aprovados |
| Configurar, suíte completa | 45 cenários Chromium aprovados, incluindo 801 × 720 e 52 bits |
| Interface, três telas, com `--workers=3` | 96 cenários Chromium aprovados |
| `npm run build` | Publicação estática preparada com sucesso |
| `git diff --check` | Sem problemas de whitespace |

A conferência adicional percorreu os três mapeamentos em **801 × 720,
1024 × 768, 1180 × 720, 1280 × 720, 1366 × 768, 1480 × 742 e 1920 × 1080**,
sem rolagem da página. **390 e 320 px** mantêm fluxo vertical sem overflow
horizontal. O título permanece completo, com quebra de linha quando necessário.

Em todas essas larguras, o gerador permanece à esquerda da ajuda, com seus
centros verticais alinhados; o desvio horizontal do centro de Iniciar simulação
em relação ao painel ficou abaixo de 1 px. A geração preencheu a sequência e
devolveu o foco ao botão após fechar o painel, sem erros JavaScript.

## Capturas inspecionadas

| Layout | Evidência |
|---|---|
| 1280 × 720 | [Captura](screenshots/acoes-enderecos/configurar-1280x720.png) |
| 801 × 720 | [Captura](screenshots/acoes-enderecos/configurar-801x720.png) |
| 320 px, fluxo vertical | [Captura](screenshots/acoes-enderecos/configurar-320px.png) |

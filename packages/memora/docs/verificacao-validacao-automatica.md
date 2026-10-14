# Configurar — validação automática sem confirmação

Data: **14/10/2026** · Refs #35 e #37 · PRs #44 e #45

O botão **Validar parâmetros** foi removido porque os campos já são validados
ao editar. A mudança está nas branches `feature/35-tela-2` e
`feature/35-tela-3`; entra na `main` com a integração dessas entregas.
A Tela 1 original já foi integrada pelo PR #43.

## Comportamento e layout

- Parâmetros e sequência continuam validados a cada edição, com erros junto aos campos
- A prévia usa o primeiro endereço somente quando a entrada é válida
- Gerar endereços usa a memória atual; Iniciar simulação revalida tudo antes de avançar
- Foram removidos o listener da ação e o estado de confirmação manual do controlador
- No desktop, cabeçalho, memória principal e memória cache repartem a altura do painel; o grupo cache termina junto à base
- Painéis, textarea fixo, teclado, foco, ajudas e bloqueio de entradas inválidas continuam funcionando

O [Figma v2](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-14)
recebeu a mesma revisão em **18 representações SDS**: principal, três mapeamentos,
estado com erros, oito ajudas de campo, três fundos de ajuda global, referência SDS
e desktop amplo. Foram removidas também as variantes da ação que exibiam
Parâmetros validados, Corrija os erros para continuar e Continuar para a sequência.
Os grupos existentes foram redistribuídos. A conferência visual passou.
As referências históricas e as alternativas de design system foram preservadas.

## Verificação local

| Base verificada | Sintaxe | Testes Node | Cenários Chromium |
|---|---|---|---|
| Tela 2 | 22 arquivos JS | 58 aprovados | 67 aprovados: 45 Configurar + 22 Simular |
| Tela 3 | 26 arquivos JS | 65 aprovados | 67 aprovados: 45 Configurar + 22 Analisar |

A regressão da Tela 2 usa `npm run test:ui --workspace @memora/simulator`.
Na Tela 3 foram executadas as suítes afetadas com
`npm exec --workspace @memora/simulator -- playwright test browser/configure.spec.js browser/analyze.spec.js`.
Os números da revisão anterior completa da Tela 3 estão no seu relatório próprio.

As verificações cobrem validação ao editar, geração sem confirmação,
preparação válida e submit inválido, prévia, três mapeamentos, ajudas e teclado.
Os testes de geometria mantêm os dois painéis alinhados, o último grupo de
parâmetros junto à base, textarea estável e ausência de scroll em
801 × 720, 1024 × 768 e desktops maiores, incluindo endereço de 52 bits.
Telas pequenas mantêm fluxo vertical sem overflow horizontal.
`git diff --check` passou; os arquivos executáveis do Beto e `src/core` não mudaram.

## Capturas atuais

| Estado | Evidência |
|---|---|
| Exemplo válido — 1280 × 720 | [Configuração](screenshots/validacao-automatica/configuracao-valida.png) |
| Erros locais e ações bloqueadas — 801 × 720 | [Erros](screenshots/validacao-automatica/erros-801x720.png) |
| Painéis até a base — 1920 × 1080 | [Desktop amplo](screenshots/validacao-automatica/desktop-1920x1080.png) |

Estas capturas substituem a referência visual do botão na implementação vigente.
Os relatórios anteriores conservam o histórico das revisões.


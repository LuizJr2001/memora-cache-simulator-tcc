# Manual visual do Memora — Configurar e Simular

Este manual integra o painel **Manual** da aplicação. As imagens em `src/assets/manual/` são capturadas **do navegador real** pelo script `scripts/capture-manual.js`, com setas e números; cada marcador possui instrução textual equivalente em `src/ui/manual-content.js`.

## Cenário reproduzível

- Fonte: `EXAMPLE_CONFIGURATION` e `EXAMPLE_ADDRESSES`, em `src/core/`.
- Para a comparação LRU: mapeamento por conjunto, 2 vias e LRU; sequência de 21 endereços. No acesso 20, sai o bloco **992–1007** e entra **3040–3055**.
- Captura padrão: Chromium headless, 1600 × 900, zoom 100%, interface em português, com mudanças da issue #82 (**Analisar**, **Detalhes do acesso N**).
- Arquivos: `configurar.png`, `simular.png`, `comparacao.png`, `conclusao.png`.

## Capturas para o artigo

![Configurar — marcadores 1 a 5](../src/assets/manual/configurar.png)

![Simular — marcadores 1 a 6](../src/assets/manual/simular.png)

![Comparar antes e depois — marcadores 7 a 9](../src/assets/manual/comparacao.png)

![Conclusão — marcador 10](../src/assets/manual/conclusao.png)

Para regenerar todas as imagens a partir do código atual, execute na raiz:

```bash
npm ci
npx playwright install chromium
node packages/memora/scripts/capture-manual.js
```

Não alterar manualmente os textos das capturas. A geração automatizada registra o cenário e coloca as anotações sobre os elementos reais da interface. O workflow de validação deve ser consultado antes de reutilizar imagens no apêndice.

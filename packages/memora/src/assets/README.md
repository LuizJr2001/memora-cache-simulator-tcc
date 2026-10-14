# Assets das telas Memora

- `memora.png`: exportação PNG em escala 1 do nó `311:17` no Figma v2
- `information-ring.svg`: SVG do nó `311:124`, com dimensões nativas de 20 × 20
- `error-ring.svg`: SVG do nó `311:1335`, com dimensões nativas de 20 × 20
- `speed-knob.svg`: SVG do nó `311:1776`, nativo de 14 × 14, usado pelo range de Velocidade

Os assets foram exportados pelo Plugin API porque os links temporários de download
não estavam acessíveis neste ambiente. Não foram redesenhados; os símbolos i/!
são textos separados, como no Figma. A marca ocupa o mesmo slot de 30 × 30.
Na Tela 2, o link temporário do SVG retornou HTML; o mesmo nó foi então
exportado diretamente pelo Plugin API. O navegador carrega o asset local como
imagem de fundo do thumb de 14 × 14; não há dependência de URLs temporárias.

`fonts/InterVariable.woff2` é a fonte Inter original de
https://github.com/rsms/inter/tree/master/docs/font-files
revisão `353b61b9f4430d5f420d56605a6e7993e0941470`
Copyright © The Inter Project Authors, sob SIL Open Font License 1.1,
preservada em `fonts/OFL.txt`. A fonte é servida localmente, sem Google Fonts.

Referência: https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-14

A Tela 3 reutiliza `memora.png`: o preenchimento de imagem do nó `311:6476`
é idêntico ao de `311:17`. Não há outro asset estático novo nessa tela. O
slot e a imagem local foram verificados no navegador em 30 × 30 px; abas,
botões e Cards reutilizam os componentes HTML/CSS existentes.

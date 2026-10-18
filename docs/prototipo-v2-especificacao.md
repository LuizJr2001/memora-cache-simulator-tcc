# Memora — Especificação visual do protótipo v2

**Consolidação documental:** 18/10/2026

**Figma vigente:** [página v2](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-2)  
**Revisões e evidências:** [issue #37](https://github.com/LuizJr2001/memora-cache-simulator-tcc/issues/37)

A página v2 é a referência provisória para a implementação das telas do Memora. Reúne a organização e os refinamentos de UX realizados em 08–09/10, após a reunião com Glívia em 02/10, as revisões de espaçamento, tipografia e textos de ajuda em 11/10 e a padronização das cores informativas em 12/10. A [V1.2](prototipo-v1-2-especificacao.md) permanece como histórico e referência técnica do cenário didático.

A entrega no Figma contém telas estáticas. A navegação, a execução real e a
operação por teclado estão implementadas em código e integradas à `main` pelos
PRs #43, #44 e #45. A publicação foi adicionada no PR #47. A avaliação externa
segue na #33; o [histórico de desenvolvimento](historico-desenvolvimento.md)
distingue os marcos técnicos das atividades acadêmicas pendentes.

## Organização da página

- Telas principais à esquerda e seus side sheets à direita, em blocos separados por etapa
- Fluxo Configurar → Simular → Analisar indicado por setas com títulos laterais
- Blocos de variantes dos mapeamentos, erros de preenchimento/completude, Decimal/Binário, estado inicial/concluído e etapas da execução
- Blocos próprios para design system, comparação Beto × Memora e marca
- Página V1.2 preservada como referência anterior

| Etapa | Referência principal | Estados e conteúdos implementados |
|---|---|---|
| 1 · Configurar | [Tela 1](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-14) | Memória principal, bloco, cache, três mapeamentos, vias condicionais, sequência, exemplo pronto, validações inline e bloqueio da execução |
| 2 · Simular | [Tela 2](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-1720) | Antes de iniciar, controles, velocidade, microetapas, conjunto atual, cache com scroll, validade/tag/bloco/LRU, histórico e conclusão |
| 3 · Analisar | [Tela 3](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-6473) | Acesso selecionado, snapshots antes/depois, bloco removido/inserido, recência e quatro passos didáticos |

O controle de ritmo da Tela 2 usa **Velocidade**, junto à barra de ajuste.
Na aplicação, o rótulo inclui o valor atual: **Velocidade (5 etapas/segundo)**
no modo detalhado e **Velocidade (5 acessos/segundo)** no resumido. O valor
inicial é 5; a reprodução funcional foi integrada no PR #44.

Decimal/Binário altera apenas a apresentação de endereços, tags e blocos. A escolha deve ser preservada ao trocar de tela. A cache usa scroll local; o antigo botão Ver cache completa permanece removido.

### Tela 1 — distribuição responsiva e estados de configuração (12/10/2026)

A referência de Configurar usa **1280 × 720**, com cabeçalho de 52 px,
mais uma variante ampla de **1920 × 1080**. As **17 representações SDS**
(tela principal, mapeamentos, invalidações, ajudas e fundos) seguem a mesma
linguagem visual. **Bytes por célula**, **Total de células** e **Células por
bloco** permanecem em uma linha no desktop. O conteúdo utiliza a largura
disponível, com margens equilibradas (24 px no frame de 1280 px e 32 px
na referência ampla) e intervalo definido entre os dois painéis. No
mobile, os painéis se empilham sem rolagem horizontal.

A orientação de Parâmetros é **Use potências de 2, exceto em bytes por célula**.
Bytes por célula aceita qualquer inteiro positivo, conforme o núcleo do PR #41;
total de células, células por bloco, linhas e vias devem ser potências de 2.
As ajudas e validações próximas dos campos detalham as demais condições.

No desktop, os painéis **Parâmetros** e **Sequência de endereços** têm
a mesma altura e terminam próximos ao rodapé. Os grupos de campos de
Parâmetros se distribuem verticalmente entre cabeçalho, memória principal e
memória cache, com o último grupo próximo à borda inferior. A validação acontece
automaticamente ao editar os campos; não há botão **Validar parâmetros** nem
estado de confirmação manual. A prévia acompanha a configuração e a sequência
válidas, e **Iniciar simulação** revalida a entrada completa antes de avançar.
Na Sequência, os cartões **Tag, Conjunto/Linha
e Deslocamento** permanecem junto dos botões **Gerar endereços aleatórios** e
**Iniciar simulação**: intervalo base de 12 px nas alturas úteis até 800 px
e 16 px nas maiores, com 8 px nas larguras intermediárias compactas.
A nota didática fica na parte inferior.

O campo de endereços é editável, porém não é redimensionável. No desktop,
ocupa o espaço livre do painel, com mínimo de **72 px**, rolagem interna e
geometria estável entre entrada vazia, válida e inválida.
O afastamento base entre rótulo e controle é de **6 px** e entre
controle e dica é de **8 px**. Os estados inválidos podem usar
espaçamentos mais compactos para evitar rolagem da página.

**Mensagens de erro são localizadas.** Campos inválidos recebem borda
e texto vermelho próprios; não há banner geral vermelho sob o título
da tela. A descrição introdutória permanece visível, e a contagem
geral de erros é mantida apenas para leitores de tela, sem ocupar
espaço visual. No cartão **Configuração com erros**, o ícone
vermelho é centralizado verticalmente em relação ao cartão,
mantendo o alinhamento dos dois textos.

Os **40 cabeçalhos da v2** contêm apenas Glossário e Ajuda rápida;
o link GitHub permanece exclusivamente dentro da Ajuda rápida.
A V1.2 conserva a organização histórica. A Tela 1 funcional está
integrada à `main` pelo [PR #43](https://github.com/LuizJr2001/memora-cache-simulator-tcc/pull/43);
Simular foi integrado pelo PR #44, incluindo a remoção da confirmação manual.

### Textos de Configurar na versão funcional — 18/10/2026

O botão e o painel usam **Gerar endereços aleatórios**. O painel explica que
a ação substitui o conteúdo de **Endereços a acessar**, solicita de 1 a 1000
endereços e informa o intervalo da memória atual. Repetições são possíveis;
o exemplo didático permanece fixo.

Sob **COMO O ENDEREÇO SERÁ DIVIDIDO**, a descrição acompanha o mapeamento:

| Mapeamento | Descrição |
|---|---|
| Direto | Direto: tag \| linha \| deslocamento |
| Totalmente associativo | Totalmente associativo: tag \| deslocamento |
| Por conjunto | Por conjunto: tag \| conjunto \| deslocamento |

No totalmente associativo, o cartão central continua indicando **Sem bits de
conjunto**. As larguras dos demais campos vêm dos parâmetros válidos; a prévia
identifica o primeiro endereço. A ajuda Mapeamento detalha onde procurar o bloco.

O rodapé identifica a origem no **simulador educacional de memória cache Beto**,
de Leandro Gabriel e colaboradores. **Como funciona?** explica que o Memora
aprimora essa ferramenta com validação, explicações e análise. MIT identifica
a licença do código. Esta seção registra a revisão textual da aplicação;
as conferências do Figma mantêm as datas indicadas nas respectivas seções.

O comportamento implementado foi verificado em **1280 × 720,
1366 × 768, 1480 × 742 e 1920 × 1080**, nos três mapeamentos,
com erros e side sheets; mensagens extensas continuam
navegáveis por teclado. [Evidências, capturas e resultados:
37 testes Node e 45 cenários Chromium](../packages/memora/docs/verificacao-tela-1.md).
A aprovação automatizada não equivale à avaliação externa prevista na #33.

### Tela 1 — correção das exceções e identificação da prévia (14/10/2026)

As larguras intermediárias de **801 a 1200 px** mantêm os dois painéis e
os três campos de memória lado a lado. No cabeçalho de Parâmetros, título e
Como funciona? ficam na primeira linha; a orientação ocupa a largura abaixo.
Os intervalos se ajustam à altura útil, preservando Inter, os tamanhos dos
textos e a geometria estável do textarea. Até 800 px de largura, os painéis
continuam empilhados, com fluxo vertical.

A decomposição identifica **Primeiro endereço: …**, em decimal e com
separadores brasileiros. Usa o primeiro item de uma sequência integralmente
válida; parâmetros ou sequência inválidos exibem **Prévia indisponível**,
sem manter o endereço anterior. A descrição acessível mantém o valor completo
e a relação com a sequência. Os cartões preservam todos os bits, inclusive
quando a tag precisa quebrar linha.

Os textos de apoio foram encurtados: **Separe por vírgula, espaço ou quebra
de linha**, **1 via · valor fixo** no direto e **32 vias · 1 conjunto · valor
fixo** no cenário totalmente associativo de 32 linhas. Sem endereços válidos,
o resumo orienta a informá-los; com parâmetros inválidos, pede a correção dos
campos destacados. A regra e os valores continuam vindo do núcleo.

| Mapeamento | Vias por conjunto | Substituição |
|---|---|---|
| Direto | Fixo em 1, desabilitado | Não se aplica, desabilitada |
| Totalmente associativo | Fixo no total de linhas, desabilitado | Editável |
| Por conjunto | Editável | Editável |

Esses estados e a prévia foram sincronizados nas **18 representações SDS**
(17 de 1280 × 720 e a referência ampla). O componente reutilizável
[Memora/Configurar/Prévia do endereço](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=721-594)
usa Inter Regular 12 px, entrelinha de 16 px e `Text/Default/Secondary` do SDS.
O título e a prévia formam uma linha com auto-layout. V1.2 e as duas
alternativas de design system foram preservadas nesta revisão.

Em larguras intermediárias com até 800 px de altura útil, erros extensos dos
parâmetros têm duas linhas visíveis e rolagem local. O texto permanece completo,
e o foco por teclado permite percorrê-lo com PageDown. A página mantém as ações
visíveis sem ocultar seu overflow.

A regressão acrescenta **801 × 720, 1024 × 768 e 1180 × 720**, além dos
desktops já cobertos, com estado inicial, três mapeamentos, erros simultâneos,
campos vazios e mensagens extensas. O endereço **4503599627370495** em memória
de **2^52 células** foi verificado nos três mapeamentos em quatro desktops,
começando por 1280 × 720. São **37 testes Node e 45 cenários Chromium** aprovados
localmente, com 27 capturas atualizadas no relatório do PR #43.

### Tela 2 — implementação funcional e referência corrigida (14/10/2026)

A Tela 2, integrada à `main` pelo PR #44 após o PR #43, implementa Simular:
três mapeamentos, FIFO/LRU/Random, seis fases por acesso, execução automática,
pausa/parada/reinício, avanço por fase/acesso, velocidade, cache, contadores,
histórico completo e Decimal/Binário. A mudança de formato preserva a execução
e a escolha ao voltar para Configurar. Editar a configuração invalida a
simulação antiga e exige preparar outra entrada.

A revisão pelo número do acesso apresenta a cache após aquele acesso, com
os contadores atuais preservados e essa distinção no subtítulo. O motor
armazena os snapshots antes/depois usados pela Tela 3, sem reexecutar o
histórico. Analisar fica disponível após o primeiro acesso concluído;
antes disso, a tentativa orienta a iniciar/avançar na própria Tela 2.
As três ajudas de Simular usam os textos visíveis, com exemplos fixos.

A composição segue a v2 de 1280 × 900, adaptada ao cabeçalho compartilhado
de 52 px e às margens fluidas já implementadas em Configurar. Em desktop
baixo, intervalos e cartões vazios do estado concluído são compactados;
campos e textos essenciais permanecem disponíveis. Cache e histórico têm
rolagem local. Em larguras até 1100 px, a página pode rolar verticalmente;
até 800 px os painéis são empilhados, sem overflow horizontal da página.

**Correção técnica do cenário didático:** a primeira via livre recebe
992–1007 no acesso 11, e a segunda recebe 2016–2031 no acesso 13.
Assim, no acesso 19 a **via 2** é a mais recente, e a **via 1** é candidata;
no acesso 20 a via 1 recebe 3040–3055. Foram corrigidos **48 textos visíveis**
na seção Simular (`311:1712`), incluindo variantes, fundos das ajudas,
resumos e exemplo LRU. O texto do histórico agora indica revisar os detalhes
do acesso, compatível com a revisão na própria Tela 2. Estilos e geometria
foram preservados e a tela principal foi conferida visualmente.
V1.2 permanece histórica. As referências estáticas de vias da Tela 3 foram reconciliadas na entrega
seguinte, conforme o registro abaixo.

Verificação local: sintaxe de 22 arquivos, **58 testes Node e 67 cenários
Chromium**, com capturas e limites no [relatório da Tela 2](../packages/memora/docs/verificacao-tela-2.md).
Esse é o registro da primeira verificação da Tela 2. A revisão final do PR #44
registrou 68 testes Node e 74 cenários Chromium no
[relatório de revisão geral](../packages/memora/docs/revisao-pr44.md).
A integração ocorreu em 14/10; a avaliação externa permanece separada.

### Tela 3 — análise funcional dos snapshots (14/10/2026)

A Tela 3, integrada à `main` pelo PR #45 após o PR #44, implementa a análise
do acesso selecionado ou do último concluído. O quadro Antes usa o snapshot
anterior à atualização; Depois usa o posterior. Sai/Entra e a explicação usam
os blocos preservados, sem reexecutar o acesso ou sortear novamente a vítima.

Os quatro passos se adaptam a substituição, acerto e linha livre. Direto,
FIFO e Random têm explicações próprias e não exibem LRU indevido. A comparação
lista as vias ocupadas do conjunto consultado e, quando necessário, somente
a vaga escolhida, com Válido 0 no estado anterior. As tabelas têm scroll local,
sem criar todas as linhas de uma configuração enorme.

Analisar habilita após o primeiro acesso concluído. Próximo acesso consulta
o registro seguinte já salvo; no fim do histórico, conclui exatamente um novo
acesso, incluindo a microetapa pendente. Ao final da sequência, fica desabilitado.
Voltar ou trocar de aba preserva a seleção e mantém o relógio pausado.
Decimal/Binário é compartilhado com Simular. Editar a entrada/reiniciar invalida
a análise anterior.

As quatro ajudas completam os **18 side sheets**. Reutilizam o mesmo renderer
Card, o dialog, as cores e os exemplos fixos da v2. Foram corrigidos **58 textos
visíveis na seção Analisar**, incluindo números de via, variantes, fundos e
exemplos de Antes × depois/LRU. A via 1 é a vítima do acesso 20; a via 2 contém
2016–2031. Geometria, estilos, ajuda geral e V1.2 foram preservados.

A composição segue a referência de 1280 × 900, adaptada ao cabeçalho de 52 px
e às margens fluidas compartilhadas. Ações e rodapé cabem nos quatro desktops,
começando em 1280 × 720. Os resumos evitam repetir intervalos extensos;
os valores completos permanecem nas tabelas e em Sai/Entra. Binário usa
intervalos inicial–final, como em Simular; bloco de uma célula usa um único valor.
Larguras menores usam fluxo vertical e rolagem local nas tabelas.

Verificação local: sintaxe de **26 arquivos**, **65 testes Node e 89 cenários
Chromium**; [relatório e 16 capturas](../packages/memora/docs/verificacao-tela-3.md).
Esse é o registro inicial da Tela 3. A revisão final documentou **75 testes
Node e 96 cenários Chromium**. As três telas foram integradas em 14/10 e
publicadas pelo PR #47; a avaliação externa continua pendente.

## Sistema visual e componentes

O projeto mantém o **Simple Design System (SDS)** e a família **Inter**. As adaptações locais são registradas na [decisão 002](decisoes/002-simple-design-system.md). Forma, cor, texto e símbolos trabalham juntos para distinguir ação, preenchimento, informação e estado.

| Família | Forma e estado vigente | Tokens e aparência |
|---|---|---|
| Botões de ação | Pílula; texto Inter Bold (700), centralizado; estado desabilitado distinguível | `Radius/Full`, `Background/Brand/Default`, `Text/Brand/On Brand`; carvão `#2C2C2C` e texto `#F5F5F5` |
| Ajuda e fechar side sheet | Circular, com `?` ou `×` em Inter Bold (700), centralizado | Mesma identidade dos botões |
| Campos e seletores | Cantos retos, raio zero | `Radius/Campo` da coleção Memora · Extensões do SDS; branco com borda cinza e sinais de erro |
| Abas | Todos os rótulos em Inter Bold (700); cantos arredondados no topo; aba atual elevada, destacada e ligada ao conteúdo | Base Tab do SDS; componente `Memora/Navegação/Abas`, com três estados de seleção |
| Decimal/Binário | Mesma base dos botões; exatamente uma opção marcada | Símbolo `✓` junto ao rótulo atual |
| Balões de ajuda | Card SDS, raio de 16 px, sem borda | `Background/Ajuda` → `Blue/100`, `#F1F6FD`; texto `#1E1E1E`; `Radius/400` |

Os botões compartilham cor e forma em todas as etapas. A aba atual é reconhecida também pela forma e pela ligação ao conteúdo. A interface dispensa a instrução Clique nas abas para trocar de tela.

### Cores semânticas — revisão em 12/10/2026

A cor identifica a função do conteúdo. A divisão anterior de Tag em violeta, Conjunto em ciano e Deslocamento em teal foi retirada das telas e variantes das três etapas na v2. Esses dados são informações derivadas, reconhecidas pelos rótulos e pela posição, e compartilham o azul claro dos side sheets.

| Função | Cor vigente | Uso e significado |
|---|---|---|
| Informação e explicação | Azul claro `#F1F6FD`, texto `#1E1E1E` | Endereço, Tag, Conjunto/Linha e Deslocamento; resumo da configuração; nota didática; quatro passos explicativos e caixas Sai/Entra |
| Conjunto em consulta | Azul SDS `#224A8A` | Mesmo destaque nos badges Conjunto consultado/atual, indicadores laterais e bordas das linhas do conjunto atual |
| Leitura em andamento | Família azul e rótulo LENDO | Acesso em processamento, distinto de um resultado final |
| Resultado/condição positiva | Família verde e rótulo correspondente | ACERTO e validações bem-sucedidas; nas tabelas, os destaques de recência/manutenção/inserção permanecem nesta revisão |
| Falta ou substituição pendente | Família âmbar e rótulo correspondente | FALTA, Candidata e substituição pendente; não significam entrada inválida |
| Entrada/configuração inválida | Família vermelha e mensagem próxima do campo | Situação que exige corrigir dados antes de executar |
| Ação | Carvão `#2C2C2C`, texto `#F5F5F5` | Identidade compartilhada dos botões; negrito, forma e rótulo indicam a ação |

Os balões das telas usam o novo alias **`Background/Informação`**, e os side sheets mantêm **`Background/Ajuda`**: ambos apontam para o mesmo `Blue/100` do SDS. O destaque de consulta usa **`Accent/Consulta` → `Blue/800`**. Os nomes CSS previstos são `--memora-info-background` e `--memora-current-set-accent`; os tokens e os comportamentos serão reproduzidos na #35. A borda neutra reutiliza `Border/Default/Default`.

**Conferência:** 121 caixas de dados, 28 cartões de passos, 14 caixas Sai/Entra e 32 resumos/notas receberam a identidade informativa; 36 badges e 25 indicadores/bordas de conjunto receberam a identidade de consulta. Não restaram caixas de decomposição com as antigas cores nas três seções de etapas. As três telas principais e uma variante binária com side sheet foram revisadas visualmente. Textos, fonte Inter, pesos e geometria foram preservados. O contraste é de **15,32:1** para texto neutro sobre azul claro e **8,00:1** para texto de consulta sobre esse fundo; esses resultados não representam uma auditoria completa da interface.

**Proposta para avaliar:** usar laranja escuro sobre fundo claro para FALTA, em vez de âmbar, distinguindo a necessidade de buscar um bloco do erro de preenchimento. A falta é um resultado normal da cache. O âmbar permanece aplicado; a troca para laranja é uma opção local a comparar com os participantes, não uma exigência de acessibilidade. Também convém avaliar tons neutros para recência/Mantida/Inserida nas tabelas, reservando o verde dos resultados para ACERTO. Os nomes de coluna, rótulos e posição devem explicar recência e substituição.

A regra se apoia no [princípio de semelhança da Gestalt](https://www.nngroup.com/articles/gestalt-similarity/) e na [heurística de consistência e padrões](https://www.nngroup.com/articles/consistency-and-standards/): funções relacionadas compartilham sinais visuais. O [Carbon — Status indicators](https://www.carbondesignsystem.com/building-blocks/core/patterns/status-indicators) oferece convenções de estados como referência teórica; a base de componentes do Memora continua sendo SDS. Essas convenções não impõem uma cor específica para falta na cache.

Pelas [WCAG 2.2 — Uso de cor](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html), cor deve acompanhar texto, símbolo ou outro sinal visual. ACERTO/FALTA, os símbolos e os rótulos de conjunto continuam necessários. O [contraste mínimo de texto](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) deve ser verificado na implementação: 4,5:1 para texto normal e 3:1 para texto grande.

### Tipografia — revisão em 11/10/2026

- **Inter é a única família** de todos os textos editáveis da v2: telas, variantes, side sheets, exemplos de componentes e valores técnicos, incluindo Decimal/Binário
- **Rótulos de botões e abas sempre em Bold (700)**, incluindo ações globais, controles da simulação, ajuda/fechar, links de ação e seleção do formato numérico; o peso é mantido nos estados selecionado e desabilitado
- Títulos, corpo, campos e dados mantêm a hierarquia de pesos definida para cada função; o negrito dos controles não se estende a todos os textos
- Estilos compartilhados: `Memora/SDS/Ações/12 Bold`, `13 Bold`, `14 Bold` e `16 Bold`; `Memora/SDS/Abas/16 Bold`, com entrelinha de 140%; entradas com `Memora/SDS/Entradas/13 Regular`
- Tamanhos, entrelinhas, cores e espaçamentos existentes foram preservados, assim como os textos e a centralização dos controles

**Conferência no Figma:** 4.833 nós de texto em Inter e 681 rótulos de ações/abas em Bold (700), sem divergência de família ou peso nesse escopo. A verificação não encontrou textos fora dos controles nem contêineres de ação descentralizados. Foram conferidas visualmente as três telas principais e a variante Decimal/Binário.

A implementação integrada carrega Inter local e aplica `font-weight: 700`
às ações e abas das três telas. A avaliação externa permanece pendente.

## Ajuda contextual e microcopy

Os 18 side sheets usam títulos com o nome do campo ou botão correspondente. Foram removidos rótulos redundantes como AJUDA CONTEXTUAL e AJUDA GERAL. Os textos orientam diretamente quem usa o simulador: Defina, Veja, Acompanhe e Compare.

Nos 15 side sheets de campo/resultado, a estrutura é **Descrição + Exemplo didático**. A descrição reúne explicação, regras/limitações e efeito na simulação, com redução de repetições. O antigo balão Na simulação foi incorporado à descrição. Os exemplos continuam fixos; os resultados reais pertencem às telas da simulação e da análise.

| Etapa | Side sheet | Estrutura |
|---|---|---|
| Configurar | [Bytes por célula](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-251) | Descrição e Exemplo didático |
| Configurar | [Total de células](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-386) | Descrição e Exemplo didático |
| Configurar | [Células por bloco](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-521) | Descrição e Exemplo didático |
| Configurar | [Número de linhas](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-656) | Descrição e Exemplo didático |
| Configurar | [Mapeamento](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-792) | Descrição e Exemplo didático |
| Configurar | [Vias por conjunto](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-927) | Descrição e Exemplo didático |
| Configurar | [Substituição](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-1062) | Descrição e Exemplo didático |
| Configurar | [Endereços a acessar](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-1197) | Descrição e Exemplo didático |
| Simular | [Estado LRU](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-2383) | Descrição e Exemplo didático |
| Simular | [Memória cache](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-2736) | Descrição e Exemplo didático |
| Simular | [Histórico de acessos](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-3082) | Descrição e Exemplo didático |
| Analisar | [Decisão de substituição](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-6786) | Descrição e Exemplo didático |
| Analisar | [Estado antes × depois](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-6956) | Descrição e Exemplo didático |
| Analisar | [LRU na decisão](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-7126) | Descrição e Exemplo didático |
| Analisar | [Decomposição do endereço](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-7296) | Descrição e Exemplo didático |
| Geral | [Como funciona?](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-7771) | Descrição e Exemplo didático |
| Geral | [Glossário](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-7907) | Uma lista com 12 termos |
| Geral | [Ajuda rápida](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-8070) | Um Card com três passos, orientação curta e links |

**Contagem vigente:** 34 instâncias de Card nos 18 side sheets: 30 nas ajudas de campo/resultado, 2 em Como funciona?, 1 no Glossário e 1 na Ajuda rápida.

### Como funciona?

Painel de 500 px, alinhado à largura da Ajuda rápida. Mantém dois balões: Descrição e Exemplo didático. O conteúdo essencial de Do endereço à cache foi resumido na descrição. ACERTO e FALTA aparecem destacados, e o exemplo organiza a arquitetura em linhas de Memória, Cache e Endereço.

### Ajuda rápida

Um único Card reúne Configurar, Simular e Analisar. A orientação contextual fica em texto curto abaixo dele; os links para o simulador original e o GitHub permanecem agrupados, com símbolo de link externo. Foram retirados a introdução repetitiva e o aviso de abertura em nova aba.

**Espaçamento revisado em 11/10:** os parágrafos dos três passos usam `Space/200` (8 px), ampliando a separação entre título e instrução e entre etapas. Os grupos de fluxo, orientação e links têm separação efetiva de 32 px, composta por intervalos e padding de `Space/400` (16 px). A revisão preservou o texto e foi conferida por screenshot; o conteúdo termina em 532 px dentro do painel de 900 px.

### Padrão dos balões e textos

- Corpo com Body Small do SDS e destaques com Body Small Strong
- Conteúdo em Auto Layout, com altura conforme o texto e largura de leitura preservada
- Mesmo azul claro em todos os balões, incluindo Glossário e Ajuda rápida
- Pontos finais retirados do encerramento dos textos/linhas; pontuação interna, abreviações e separadores numéricos preservados
- Fórmulas, regras dos mapeamentos e exemplos didáticos preservados nas ajudas pertinentes

### Revisão de redundância — 11/10/2026

Foram lidos os 18 side sheets. Dezesseis tiveram a redação ajustada: 31 textos de Descrição/Exemplo didático passaram de 1.283 para 715 palavras (redução de aproximadamente 44% nesses trechos). Glossário e Ajuda rápida foram preservados por já cumprirem funções distintas e concisas.

A Descrição explica o componente e suas regras; o Exemplo didático demonstra essas regras com dados do cenário de referência. Foram retiradas introduções que repetiam o título, instruções genéricas de acompanhamento e explicações repetidas dentro de um mesmo painel. A informação necessária para consultar uma ajuda isoladamente permanece disponível.

| Ajuda | Foco da revisão |
|---|---|
| Bytes por célula | Unidade e inteiro positivo; exemplo de capacidade: 4096 células × 1 byte = 4 KiB |
| Número de linhas | Quantidade de blocos armazenáveis; exemplo de 512 células de dados, sem repetir o exemplo de vias/conjuntos |
| Mapeamento e Vias por conjunto | Posições permitidas e quantidade de vias; explicação da política permanece em Substituição |
| Estado LRU | Significado de Mais recente e Próxima substituição; critério da escolha detalhado em LRU na decisão |
| Memória cache | Leitura das colunas Válido, Tag, Bloco armazenado e LRU |
| Histórico de acessos | Ordem, resultado e revisão do acesso; exemplo concreto de ACERTO no endereço 2018 |
| Decisão e Estado antes × depois | Escolha da vítima e comparação dos blocos 992–1007 e 3040–3055, com tags 3 e 11 |
| Decomposição do endereço | Função de cada parte e exemplo `2018 = 0111 \| 1110 \| 0010` (tag 7, conjunto 14, deslocamento 2) |
| Como funciona? | Busca, acerto e falta; a orientação sobre o fluxo permanece na Ajuda rápida |

A estrutura permanece em **18 side sheets e 34 Cards**, com os estilos SDS, Inter, cores e espaçamentos anteriores. A conferência dos textos não encontrou conteúdo fora dos painéis; a Tela 2, Estado LRU, Decomposição do endereço e Como funciona? passaram pela revisão visual. Os exemplos são estáticos e não usam os dados do acesso selecionado.

## Cenário didático de referência

O cenário de comparação continua o da V1.2: 4096 células de 1 byte, blocos de 16 células, 32 linhas, mapeamento associativo por conjunto, 2 vias e LRU. São 12 bits de endereço: 4 de tag, 4 de conjunto e 4 de deslocamento.

A sequência é `0, 1, 16, 17, 32, 33, 48, 49, 64, 65, 992, 993, 2016, 2017, 2, 18, 34, 994, 2018, 3044, 96`.

- Acesso 19: 2018 na via 2 do conjunto 14; 12 acertos e 7 faltas; via 1 candidata
- Acesso 20: 3044; na via 1 sai 992–1007 e entra 3040–3055; 12 acertos e 8 faltas
- Acesso 21: 96; estado final com 12 acertos, 9 faltas, taxa de 57,1% e 8/32 linhas usadas

Esses valores são pontos de controle reproduzíveis para #28, #30 e #31. Na aplicação funcional, o motor deve produzir os resultados e preservar os snapshots anteriores à mutação.

## Relação com as heurísticas de Nielsen

| Heurística | Decisão de projeto relacionada |
|---|---|
| 1 · Visibilidade do estado | Aba atual, progresso, resultados, conjunto atual, LRU e término explícitos |
| 2 · Correspondência com o mundo real | Termos didáticos, relação endereço/cache e instruções dirigidas ao usuário |
| 3 · Controle e liberdade | Troca entre etapas, fechamento de ajudas e controles da execução |
| 4 · Consistência e padrões | Componentes SDS, identidade comum de botões/campos e estrutura compartilhada das ajudas |
| 5 · Prevenção de erros | Regras condicionais, validação antecipada e execução bloqueada em configurações inválidas |
| 6 · Reconhecimento | Estado da cache, histórico, LRU e opção Decimal/Binário reconhecíveis |
| 7 · Flexibilidade e eficiência | Exemplo pronto, geração de endereços, velocidade e avanço por etapa/acesso |
| 8 · Estética e minimalismo | Remoção de repetições, integração de balões e espaçamento entre grupos de texto |
| 9 · Recuperação de erros | Mensagens próximas dos campos e orientação para corrigir valores |
| 10 · Ajuda e documentação | Side sheets, Glossário, Ajuda rápida e links de referência |

As associações registram decisões do redesign. A inspeção formal com severidade e a avaliação dos participantes continuam como atividades a concluir; esta tabela não declara validação externa ou auditoria completa de acessibilidade.

## Histórico e rastreabilidade

| Data | Marco | Registro |
|---|---|---|
| 23/09 | Elaboração inicial concluída, após desvio de 8 dias em relação a 15/09 | #22 e #29 |
| 25/09 | Nome Memora e adoção do SDS | Decisões 001 e 002 |
| 30/09 | Código iniciado como frente paralela à avaliação; base de pacote proposta | #22, #34 e PR #36 |
| 02/10 | Reunião de UX com Glívia | #37 |
| 08/10 | Página v2, blocos, setas e pontuação | #37 |
| 09/10 | Abas, identidade dos controles, microcopy e simplificação dos side sheets | #37 |
| 11/10 | Espaçamento da Ajuda rápida, Inter/Bold, rótulo Velocidade, revisão dos textos de ajuda e sincronização documental | #37 e revisão desta especificação |
| 12/10 | Azul informativo compartilhado com os side sheets e indicadores de consulta com a mesma identidade; pesquisa e proposta de cor para FALTA | #37 e decisão 002 |
| 12/10 | Configurar em 1280 × 720; memória principal em uma linha; GitHub apenas na Ajuda rápida; conferência no Figma e no código | #35, #37 e PR #43 |
| 14/10 | Correção de encaixe em larguras intermediárias e endereço de 52 bits; prévia com endereço explícito e campos condicionais sincronizados em 18 telas SDS | #35, #37 e PR #43 |
| 14/10 | Tela 2 implementada em branch dependente do PR #43; motor, políticas, controles e snapshots; identificação das vias corrigida na seção Simular | #35, #28, #30, #31 e #37 |
| 14/10 | Tela 3 implementada em branch dependente do PR #44; comparação dos snapshots, quatro ajudas e navegação; vias de Analisar reconciliadas | #35, #28, #30, #31 e #37 |
| 14/10 | Três telas integradas à `main`; publicação concluída no GitHub Pages à noite, com registro em 15/10 UTC | PRs #43, #44, #45 e #47 |
| 18/10 | Textos da aplicação explicitam geração aleatória, destino da sequência, divisão conforme o mapeamento e origem no Beto; documentação consolidada | #35, #37 e [histórico](historico-desenvolvimento.md) |

## Implementação e avaliação

- #22 — calendário, metas e replanejamento
- #29 — elaboração e consolidação do protótipo
- #33 — avaliação com orientação e estudantes
- #34 — base do pacote `packages/memora`, integrada à main pelo PR #36 em 12/10; núcleo de configuração/endereços acrescentado no PR #41
- #35 — implementação funcional das telas e dos side sheets desta v2
- #37 — decisões e refinamentos de UX após a reunião
- #25–#28, #30 e #31 — regras, correções, LRU e regressão
- #24 — incorporação das decisões e evidências ao artigo

As telas Configurar/Simular/Analisar consomem o motor em `src/core`, mantendo
interface e interação em `src/ui`, na versão integrada à `main`. Trocar de aba
ou formato numérico preserva o estado; as ajudas abrem/fecham por teclado e
restauram o foco. Cada entrega visual registra referências e verificações.

O material inicial de avaliação do protótipo contém telas/imagens estáticas,
da Tela 1 para a Tela 3, da esquerda para a direita. O Figma continua como
referência visual; a aplicação publicada permite avaliar a interação funcional
na #23. A consolidação da avaliação e a atualização do artigo permanecem
pendentes nas respectivas issues. Implementação, integração e publicação já
estão concluídas no escopo das três telas.

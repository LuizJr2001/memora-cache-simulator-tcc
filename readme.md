# Memora — Simulador Educacional de Memória Cache

O **Memora** é um simulador educacional de memória cache, gratuito e de código aberto, baseado no **Beto**, de Leandro Gabriel e colaboradores. Apoia disciplinas de Arquitetura e Organização de Computadores com configuração validada, execução passo a passo e análise das decisões da cache.

**[Abrir o Memora](https://luizjr2001.github.io/memora-cache-simulator-tcc/)** · O fluxo tem duas etapas — Configurar e Simular — com comparação antes/depois integrada à revisão de acessos. A avaliação externa da versão aprimorada continua pendente. O [artigo em LaTeX](tcc/README.md) incorpora o levantamento de requisitos e a implementação até 23/10/2026.

O Memora é a nova identidade do projeto de avaliação e aprimoramento do simulador **Beto**, preservando sua origem acadêmica e seu legado técnico, mas distinguindo a proposta revisada do sistema original.

Este repositório mantém a evolução do simulador no contexto do Trabalho de Conclusão de Curso **“Avaliação e aprimoramento de um simulador educacional de memória cache para apoio ao ensino de hierarquia de memória”**, de Luiz Carlos dos Santos Júnior.

## Decisão de identidade

A partir de **25/09/2026**, a proposta aprimorada passa a se chamar **Memora**.

A mudança de nome busca diferenciar claramente a nova proposta visual e educacional do simulador legado, dar identidade própria à evolução do projeto e, ao mesmo tempo, preservar a atribuição do Beto original. Materiais históricos, respostas do levantamento, capturas e arquivos do sistema original continuam usando o nome Beto quando isso for necessário para manter a fidelidade documental.

A decisão está detalhada em [docs/decisoes/001-nome-memora.md](docs/decisoes/001-nome-memora.md).

## Objetivo do projeto

O trabalho não propõe reconstruir o sistema legado do zero. Seu objetivo é avaliar a ferramenta existente, identificar lacunas técnicas e de Interação Humano-Computador (IHC), priorizar requisitos e implementar melhorias que tornem a simulação mais robusta, clara e útil para estudantes.

As principais frentes do trabalho são:

- validar configurações e apresentar mensagens de erro didáticas;
- melhorar a organização visual e corrigir desalinhamentos da interface;
- tornar explícita a decomposição dos endereços em *tag*, índice/conjunto e deslocamento;
- registrar o histórico dos acessos e destacar *hits*, *misses* e substituições;
- exibir metadados internos, como estado LRU e bit de validade;
- manter operações de leitura/escrita, políticas de escrita e *dirty bit* como trabalho futuro, fora do escopo essencial (#32);
- oferecer estatísticas da execução; exportação, gráficos e comparação entre configurações permanecem como trabalhos futuros;
- avaliar a usabilidade e a experiência de uso por inspeção heurística e levantamento de requisitos com estudantes.

## Funcionalidades do Memora

| Etapa | O que está implementado |
|---|---|
| **Configurar** | Três mapeamentos, vias e substituição condicionais, validação ao editar, sequência manual, geração aleatória e exemplo didático de 21 endereços. A prévia calcula a divisão a partir do primeiro endereço, sem exibir um rótulo adicional para ele. |
| **Simular** | Direto, totalmente associativo e por conjunto; FIFO, LRU e Random; seis etapas por acesso ou avanço resumido; início, pausa, parada e reinício; velocidade inicial 5; estatísticas, cache com linhas vazias/células e histórico revisável. |
| **Comparação em Simular** | Ao selecionar um acesso no histórico, expanda Comparar antes e depois no cartão da cache. Mostra snapshots, Sai/Entra e política; a navegação percorre somente acessos já realizados. |
| **Recursos compartilhados** | Decimal/Binário compartilhado pela simulação e comparação, navegação com preservação do estado, 16 ajudas contextuais, Glossário, Ajuda rápida, teclado/foco e layout responsivo. |

**Gerar endereços aleatórios** preenche o campo **Endereços a acessar**,
substituindo a sequência atual. O botão fica junto ao rótulo desse campo,
com 16 px de distância da ajuda; **Iniciar simulação** ocupa a largura disponível
abaixo da prévia, com o texto centralizado.
A quantidade começa em 32 e pode variar de 1 a 1000; cada valor
é sorteado entre 0 e total de células − 1, com possíveis repetições. O exemplo didático é fixo;
a geração aleatória não garante acertos ou substituições específicos.

Ao abrir, o Memora usa os valores iniciais do Beto: 1 byte por célula,
4096 células, blocos de 16, 32 linhas e mapeamento direto. Os 21 endereços
originais já vêm preenchidos, liberando **Iniciar simulação**. FIFO aparece
selecionado e desabilitado no direto; fica disponível ao escolher um mapeamento
associativo. A execução começa com velocidade 5 e etapas detalhadas.
Os [padrões completos e a sequência](packages/memora/README.md#configuração-inicial)
estão documentados no pacote.

| Mapeamento | Como o endereço será dividido |
|---|---|
| Direto | Tag · Linha · Deslocamento |
| Totalmente associativo | Tag · Deslocamento; sem bits de conjunto |
| Por conjunto | Tag · Conjunto · Deslocamento |

A quantidade de bits depende dos parâmetros; campos de zero bits são
identificados na prévia. O exemplo de abertura e o botão **Carregar exemplo didático**
usam os mesmos valores do Beto e terminam em **21 acessos, 13 acertos, 8 faltas,
61,9% de acerto e 3/32 linhas usadas**.

O cenário por conjunto/LRU das ajudas e dos testes é diferente: usa duas vias e
termina em **12 acertos, 9 faltas, 57,1% e 8/32 linhas**. No acesso 20 desse cenário,
a via 1 do conjunto 14 troca **992–1007 por 3040–3055**. Veja os parâmetros e as
duas sequências no [estado atual](docs/estado-atual.md#cenários-reproduzíveis).

## Funcionalidades do legado disponível

A aplicação legada Beto em `docs/` permite configurar e acompanhar, em tempo real ou passo a passo:

- mapeamento direto, totalmente associativo e associativo por conjunto;
- políticas de substituição FIFO, LRU e aleatória;
- parâmetros da memória principal, dos blocos e da cache;
- sequências de endereços de acesso;
- execução por meio dos controles *play*, *pause*, *stop* e *step*;
- visualização de acertos e faltas de cache.

## Tecnologias

- HTML5
- CSS3
- JavaScript

Para consultar o legado, abra [`docs/index.html`](docs/index.html) em um navegador.

## Acesso online e publicação

Endereço público do Memora: [luizjr2001.github.io/memora-cache-simulator-tcc](https://luizjr2001.github.io/memora-cache-simulator-tcc/).

A publicação usa GitHub Pages e é atualizada automaticamente após alterações
na `main`, depois da verificação de sintaxe e dos testes Node.
`npm run build` prepara `_site/` apenas com a aplicação e suas licenças.
O Beto legado e seu domínio histórico não fazem parte dessa publicação.
Consulte o [guia de publicação](docs/publicacao-github-pages.md) para a ativação
inicial, conferência local e diagnóstico.

## Estado atual e referência visual

**Comportamento vigente:** [estado atual da aplicação](docs/estado-atual.md), [decisão 004](docs/decisoes/004-analise-contextual.md) e código da `main`. **Referência visual histórica:** [especificação do protótipo v2](docs/prototipo-v2-especificacao.md) e [página v2 no Figma](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-2). A [V1.2](docs/prototipo-v1-2-especificacao.md) permanece como histórico.

| Frente | Situação registrada |
|---|---|
| Protótipo histórico | Três telas e 18 side sheets na v2; a aplicação foi simplificada para Configurar → Simular no PR #60 |
| UX | Duas abas, botões em pílula preenchidos em roxo com texto branco, campos retos, balões azuis e comparação recolhível; revisão na [#37](https://github.com/LuizJr2001/memora-cache-simulator-tcc/issues/37) |
| Ajuda | 16 ajudas estáticas na aplicação; os 18 side sheets e 34 Cards pertencem ao protótipo histórico |
| Avaliação | Retorno da orientação em consolidação e avaliação com estudantes pendente na [#33](https://github.com/LuizJr2001/memora-cache-simulator-tcc/issues/33); Figma e imagens são referências do protótipo, e a versão funcional está disponível online |
| Base do código | Pacote privado e servidor local integrados pelo [PR #36](https://github.com/LuizJr2001/memora-cache-simulator-tcc/pull/36); estrutura `src/core` / `src/ui` |
| Implementação | Núcleo no [PR #41](https://github.com/LuizJr2001/memora-cache-simulator-tcc/pull/41); Configurar, Simular e Analisar integrados à `main` pelos [PRs #43](https://github.com/LuizJr2001/memora-cache-simulator-tcc/pull/43), [#44](https://github.com/LuizJr2001/memora-cache-simulator-tcc/pull/44) e [#45](https://github.com/LuizJr2001/memora-cache-simulator-tcc/pull/45) em 14/10/2026; comparação integrada em Simular pelo PR #60 em 23/10 |
| Verificação técnica | Suíte atual: 78 testes Node e 93 cenários Chromium (46 Configurar, 32 Simular, 15 comparação); a execução completa de Chromium está registrada no PR #60. Revisões de cor #61/#62 executaram sintaxe, Node e build, sem nova validação visual |
| Publicação | GitHub Pages configurado no [PR #47](https://github.com/LuizJr2001/memora-cache-simulator-tcc/pull/47), com atualização automática na `main` e sintaxe/testes/build antes do deploy |

A revisão de 08–12/10 contempla organização da página, fluxo com setas, pontuação, estados das abas, identidade dos componentes, simplificação dos side sheets, espaçamento da Ajuda rápida, Inter/Bold, rótulo Velocidade e cores semânticas. Informações usam o mesmo azul claro dos side sheets; os indicadores do conjunto consultado compartilham um azul do SDS. A [decisão SDS](docs/decisoes/002-simple-design-system.md) registra os tokens, as justificativas e as propostas de cor ainda em avaliação.

Em 14/10, foram corrigidos os casos de scroll em larguras intermediárias e
com endereço de 52 bits. A prévia agora identifica o primeiro endereço utilizado,
e os campos condicionais foram sincronizados nas 18 representações SDS do Figma.
O [relatório da Tela 1](packages/memora/docs/verificacao-tela-1.md) registra a
regressão e as 27 capturas, incluindo erros com rolagem local por teclado.

A elaboração inicial terminou em 23/09, após demandar mais tempo que o previsto.
O desenvolvimento seguiu em paralelo à avaliação, conforme a [#22](https://github.com/LuizJr2001/memora-cache-simulator-tcc/issues/22).
O [histórico de desenvolvimento](docs/historico-desenvolvimento.md) reúne datas,
decisões, PRs e pendências até 23/10/2026. O [artigo](tcc/README.md) foi
atualizado com o método, as 13 respostas do levantamento do Beto, a implementação
e os limites da verificação. A avaliação do Memora com estudantes permanece pendente.

## Base de desenvolvimento do pacote

O pacote privado `@memora/simulator` fica em `packages/memora`, no mesmo repositório. A base foi integrada pelo PR #36. O núcleo já valida parâmetros e sequências, calcula a decomposição e gera endereços dentro de limites documentados. A Tela 1 foi integrada à `main` pelo PR #43, incluindo
os três mapeamentos, validação inline, decomposição didática, endereços,
ajudas, prévia e preparação de entrada imutável; a preparação abre Simular
sem processar um acesso automaticamente.
Parâmetros e sequência são validados automaticamente ao editar os campos,
sem ação manual de confirmação; Iniciar simulação revalida a entrada completa.
O layout fluido e os refinamentos dos estados inválidos estão descritos
no [README do pacote](packages/memora/README.md) e no
[relatório de verificação da Tela 1](packages/memora/docs/verificacao-tela-1.md).
A Tela 2 conecta essa entrada à execução real, com controles,
cache, LRU, histórico e revisão por snapshots, preservando o Beto em `docs/`.
O [relatório da Tela 2](packages/memora/docs/verificacao-tela-2.md) registra a
verificação e a correção dos números de via no cenário estático do Figma.
Historicamente, a Tela 3 acrescentou Analisar: comparação antes/depois,
blocos Sai/Entra, quatro passos didáticos, acerto/linha livre/substituição e
quatro ajudas. Em 23/10, a comparação foi incorporada ao cartão da cache em Simular, sem repetir decomposição e roteiro. A [decisão 004](docs/decisoes/004-analise-contextual.md) registra a mudança. O [relatório da Tela 3](packages/memora/docs/verificacao-tela-3.md)
registra a regressão e a sincronização das vias no Figma. O motor foi preservado.

Use Node.js 22 ou superior e npm:

```bash
git fetch origin
git switch main
git pull --ff-only origin main
npm ci
npm run dev
```

Memora: http://127.0.0.1:5173/ — Beto para comparação: http://127.0.0.1:5173/legado/.

Use **Iniciar simulação** com os valores iniciais ou carregue o exemplo na Tela 1 para abrir Simular.
As duas etapas e a comparação integrada partem da `main`; não é necessário usar as antigas branches de implementação.

`npm run check` verifica a sintaxe dos arquivos JavaScript do pacote.
`npm test` executa **78 testes Node**, incluindo execução, controladores, apresentação e análise,
e `npm run test:ui --workspace @memora/simulator` executa **93 cenários Chromium**
na versão integrada. Instale antes o navegador com `npx playwright install chromium`.
A [revisão geral do PR #44](packages/memora/docs/revisao-pr44.md) registra o fluxo verificado, as correções finais e capturas atuais.
A [verificação da Tela 3](packages/memora/docs/verificacao-tela-3.md) registra sua regressão e integração com a Tela 2. Consulte as [APIs e limites](packages/memora/src/core/README.md), incluindo 1000 endereços e 18000 caracteres por sequência. A especificação v2 registra a base visual; as decisões posteriores e o estado atual registram as diferenças da aplicação.

## Estrutura do repositório

```text
.
├── docs/               # aplicação legada, especificações e decisões
├── packages/memora/    # pacote privado, núcleo, interface e testes
├── research/           # dados anonimizados do levantamento
├── tcc/                # material acadêmico do Trabalho de Conclusão de Curso
├── CONTRIBUTING.md     # convenções de branches, commits e contribuição
├── WORKFLOW.md         # metodologia, Kanban, issues e rastreabilidade
├── LICENSE
└── readme.md
```

## Fluxo de desenvolvimento

O planejamento das atividades utiliza **Kanban no GitHub Projects**, com requisitos, defeitos e tarefas acadêmicas registrados como issues. Consulte [WORKFLOW.md](WORKFLOW.md) para configurar o quadro, escrever e priorizar issues, definir critérios de aceitação e manter a rastreabilidade entre pesquisa, implementação e validação.

A branch `main` representa a versão estável do projeto. O desenvolvimento deve ocorrer em branches curtas, criadas a partir dela e nomeadas com um prefixo descritivo:

| Prefixo | Uso | Exemplo |
|---|---|---|
| `feature/` | nova funcionalidade ou melhoria | `feature/validacao-configuracoes` |
| `bugfix/` | correção de defeito não crítico | `bugfix/atualizacao-enderecos` |
| `hotfix/` | correção crítica e urgente | `hotfix/falha-simulacao` |
| `docs/` | alteração exclusivamente documental | `docs/guia-contribuicao` |
| `refactor/` | refatoração sem mudança funcional | `refactor/logica-mapeamento` |
| `test/` | criação ou ajuste de testes | `test/politica-lru` |

Os nomes devem usar letras minúsculas e palavras separadas por hífen.

## Padrão de commits

O projeto adota o padrão [Conventional Commits 1.0.0](https://www.conventionalcommits.org/pt-br/v1.0.0/):

```text
<tipo>(escopo opcional): <descrição curta>
```

Exemplos:

```text
feat(cache): exibe estado lru por linha
fix(config): valida valores que não são potências de dois
docs: atualiza instruções de contribuição
refactor(mapping): simplifica cálculo do índice
test(lru): cobre substituição em conjunto cheio
```

Os tipos mais usados são `feat`, `fix`, `docs`, `refactor`, `test`, `style`, `perf`, `build`, `ci`, `chore` e `revert`. Mudanças incompatíveis devem usar `!` após o tipo/escopo ou incluir `BREAKING CHANGE:` no rodapé do commit.

Consulte [CONTRIBUTING.md](CONTRIBUTING.md) para as convenções técnicas e [WORKFLOW.md](WORKFLOW.md) para a metodologia completa de organização do trabalho.

## Origem e licença

O **Beto**, sistema legado que deu origem ao Memora, foi originalmente desenvolvido por Leandro Gabriel e colaboradores. O projeto original está disponível em [leo150250/simuladorCache](https://github.com/leo150250/simuladorCache).

A adoção do nome Memora não altera a atribuição da ferramenta original nem a rastreabilidade acadêmica das evidências coletadas durante o TCC.

Este projeto é distribuído sob a licença [MIT](LICENSE).


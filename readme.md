# Memora — Simulador Educacional de Memória Cache

O **Memora** é o projeto de avaliação e aprimoramento de um simulador educacional de memória cache, gratuito e de código aberto, para apoiar disciplinas de Arquitetura e Organização de Computadores. A nova interface está prototipada no Figma e sua implementação funcional está em andamento.

O Memora é a nova identidade do projeto de avaliação e aprimoramento do simulador **Beto**, preservando sua origem acadêmica e seu legado técnico, mas distinguindo a proposta revisada do sistema original.

Este repositório mantém a evolução do simulador no contexto do Trabalho de Conclusão de Curso **“Avaliação e aprimoramento de um simulador educacional de memória cache para apoio ao ensino de hierarquia de memória”**, de Luiz Carlos dos Santos Júnior.

## Decisão de identidade

A partir de **25/09/2026**, a proposta aprimorada passa a se chamar **Memora**.

A mudança de nome busca diferenciar claramente a nova proposta visual e educacional do simulador legado, dar identidade própria à evolução do projeto e, ao mesmo tempo, preservar a atribuição do Beto original. Materiais históricos, respostas do levantamento, capturas e arquivos do sistema original continuam usando o nome Beto quando isso for necessário para manter a fidelidade documental.

A decisão está detalhada em [docs/decisoes/001-nome-memora.md](docs/decisoes/001-nome-memora.md).

## Objetivo do projeto

O trabalho não propõe reconstruir o sistema legado do zero. Seu objetivo é avaliar a ferramenta existente, identificar lacunas técnicas e de Interação Humano-Computador (IHC), priorizar requisitos e implementar melhorias que tornem a simulação mais robusta, clara e útil para estudantes.

As principais frentes previstas são:

- validar configurações e apresentar mensagens de erro didáticas;
- melhorar a organização visual e corrigir desalinhamentos da interface;
- tornar explícita a decomposição dos endereços em *tag*, índice/conjunto e deslocamento;
- registrar o histórico dos acessos e destacar *hits*, *misses* e substituições;
- exibir metadados internos, como estado LRU e bit de validade;
- manter operações de leitura/escrita, políticas de escrita e *dirty bit* como trabalho futuro, fora do escopo essencial (#32);
- oferecer estatísticas, exportação de resultados e comparação entre configurações, conforme a viabilidade técnica;
- avaliar a usabilidade e a experiência de uso por inspeção heurística e levantamento de requisitos com estudantes.

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

## Estado atual e referência visual

**Referência vigente:** [especificação do protótipo v2](docs/prototipo-v2-especificacao.md) e [página v2 no Figma](https://www.figma.com/design/Zm8dzyoG0yhkbEkC01Zvu0?node-id=311-2). A [V1.2](docs/prototipo-v1-2-especificacao.md) permanece como histórico.

| Frente | Situação registrada |
|---|---|
| Protótipo | Telas Configurar, Simular e Analisar, variantes e 18 side sheets na v2 |
| UX | Abas de navegador, botões em pílula, campos de cantos retos, balões azuis, linguagem direta e textos reduzidos; revisão na [#37](https://github.com/LuizJr2001/memora-cache-simulator-tcc/issues/37) |
| Ajuda | 34 Cards: Descrição + Exemplo didático nas ajudas pertinentes; Glossário em lista e Ajuda rápida em um único Card |
| Avaliação | Retorno da orientação e dos estudantes em consolidação na [#33](https://github.com/LuizJr2001/memora-cache-simulator-tcc/issues/33); imagens estáticas e Figma como apoio |
| Base do código | Pacote privado e servidor local integrados pelo [PR #36](https://github.com/LuizJr2001/memora-cache-simulator-tcc/pull/36); estrutura `src/core` / `src/ui` |
| Implementação | Núcleo de configuração e entradas integrado no [PR #41](https://github.com/LuizJr2001/memora-cache-simulator-tcc/pull/41); **Tela 1 — Configurar implementada na branch do [PR #43](https://github.com/LuizJr2001/memora-cache-simulator-tcc/pull/43)**, ainda em revisão, com 37 testes Node e 40 cenários Chromium aprovados. A execução da cache, telas 2/3, LRU e snapshots seguem nas próximas entregas (#25–#28, #30, #31 e #35). |

A revisão de 08–12/10 contempla organização da página, fluxo com setas, pontuação, estados das abas, identidade dos componentes, simplificação dos side sheets, espaçamento da Ajuda rápida, Inter/Bold, rótulo Velocidade e cores semânticas. Informações usam o mesmo azul claro dos side sheets; os indicadores do conjunto consultado compartilham um azul do SDS. A [decisão SDS](docs/decisoes/002-simple-design-system.md) registra os tokens, as justificativas e as propostas de cor ainda em avaliação.

A elaboração inicial terminou em 23/09, após demandar mais tempo que o previsto. O desenvolvimento segue em paralelo à avaliação, conforme a [#22](https://github.com/LuizJr2001/memora-cache-simulator-tcc/issues/22). A implementação, a avaliação completa e a atualização do artigo permanecem como entregas a concluir.

## Base de desenvolvimento do pacote

O pacote privado `@memora/simulator` fica em `packages/memora`, no mesmo repositório. A base foi integrada pelo PR #36. O núcleo já valida parâmetros e sequências, calcula a decomposição e gera endereços dentro de limites documentados. A Tela 1 já dispõe de formulário funcional na branch do PR #43, incluindo
os três mapeamentos, validação inline, decomposição didática, endereços,
ajudas, prévia e preparação de entrada imutável; **não executa a simulação**.
O layout fluido e os refinamentos dos estados inválidos estão descritos
no [README do pacote](packages/memora/README.md) e no
[relatório de verificação da Tela 1](packages/memora/docs/verificacao-tela-1.md).
As telas seguintes e a execução da cache serão integradas gradualmente.

Use Node.js 22 ou superior e npm:

```bash
git fetch origin
git switch main
npm ci
npm run dev
```

Memora: http://127.0.0.1:5173/ — Beto para comparação: http://127.0.0.1:5173/legado/.

Para conferir os ajustes ainda não integrados à `main`, atualize a branch
`feature/35-tela-1` (`git switch feature/35-tela-1` e
`git pull origin feature/35-tela-1`) antes de iniciar o servidor.
O PR #43 e as issues #35/#37 permanecem abertos.

`npm run check` verifica a sintaxe dos arquivos JavaScript do pacote.
`npm test` executa **37 testes Node** (28 do núcleo e 9 de integração da Tela 1),
e `npm run test:ui --workspace @memora/simulator` executa **40 cenários Chromium**
na branch do PR #43. A regressão da execução da cache e das políticas será
ampliada na #31. Consulte as [APIs e limites](packages/memora/src/core/README.md), incluindo 1000 endereços e 18000 caracteres por sequência. A especificação v2 orienta a interface funcional da #35.

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

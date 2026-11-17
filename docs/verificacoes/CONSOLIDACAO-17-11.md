# Consolidação de critérios — 17/11/2026

Base funcional examinada: dc0de9d62066587f0d2ca5598b2483030e91f3c3.
A branch de verificação acrescenta somente CI e documentação; não altera os sete
registros de estudantes, os dados do levantamento ou os fontes LaTeX.

## Resultados locais

- Node 24.22.1: sintaxe de 38 arquivos, 81 testes Node e build aprovados.
- Playwright: tentativa dos 101 casos terminou em falha de inicialização do Chromium
  156.0.8078.79. Mensagem: `socket() failed: Operation not permitted (1)`.
  Nenhuma asserção de interface foi executada com sucesso nessa tentativa.
- A execução remota e suas capturas devem ser consultadas no PR #108. Seu resultado
  é independente do bloqueio local; não atribuir capturas antigas à revisão atual.

## Matriz de critérios técnicos e acadêmicos

| Critério das issues | Implementação/critério vigente | Verificação correspondente | Decisão |
| --- | --- | --- | --- |
| #29: telas, variantes, design system e ajudas | Especificação v2 e #38; elaboração inicial em 23/09 | docs/prototipo-v2-especificacao.md | Entrega de prototipação produzida; aprovação completa está em #33 |
| #35/#37: três telas e abas | #43/#44/#45; #60 incorporou Analisar a Simular | comparison.spec.js: duas etapas e comparação contextual | Requisito de terceira tela substituído pela decisão 004 |
| Validação automática e mensagens locais | Configurar valida sem botão adicional | configure.spec.js: erros próximos aos campos, submit, limites | Critério verificável tecnicamente |
| Identidade e tipografia | Inter, ações Bold 700, campos retos; roxo preenchido substitui preto/cinza | configure.spec.js: assets/fontes; simulate.spec.js: sistema visual | Cores históricas superadas por #61/#62 |
| Ajuda contextual | 16 ajudas na interface funcional, Escape e retorno do foco | configure.spec.js, simulate.spec.js, manual.spec.js | Contagem histórica de 18 não define a arquitetura vigente |
| Estados e conclusão | Texto e símbolos, contadores e Progresso concluído | simulate.spec.js: cenário LRU e conclusão | Não é auditoria integral de acessibilidade |
| Layout e tabelas | Desktop sem sobreposição; rolagem local e adaptação em telas estreitas | configure/simulate/comparison.spec.js: geometrias de 320 a 1920 px | Asserção geométrica não equivale a aprovação estética docente |
| Histórico e antes/depois | Analisar seleciona snapshot, preserva estatísticas e oferece retorno | comparison.spec.js: vítima, navegação, teclado, foco | Critérios técnicos separados da descoberta por usuários |
| #97: ritmo, editor, mapeamento | 0,25 a 10; editor opcional; explicações breves | complementary.spec.js: três casos | Nova usabilidade percebida depende de #70 |
| #33: clareza e aprovação do fluxo | Sete sessões exploratórias e revisões docentes documentadas | research/evaluation-2026/README.md | Não cobre automaticamente todo o roteiro estático; aceite integral não presumido |
| #67/#68/#70: descoberta sem direcionamento após ajustes | Roteiro de reobservação preparado | REOBSERVACAO-POS-AJUSTES.md | Requer novas sessões reais; não preenchido por IA |

## Formulário original — busca e confronto documental

Foram examinados o instrumento textual versionado e o candidato de 16/05
`questionario_google_forms_beto_revisado_glivia_poliana.pdf`, recuperado dos materiais
do autor. Esse documento é um roteiro com “configuração recomendada”, não uma captura
do formulário aplicado. Ele confirma a proposta de escala 1–4 e a redação de vários
itens, mas não permite certificar visual, obrigatoriedade ou alternativas não escolhidas.
Há diferenças: a coleta aplicada contém campo de e-mail, segundo perfil (disciplinas)
e redações de familiaridade e perguntas 2/4 distintas da proposta.

Busca por formulários nativos no Drive não retornou cópia acessível. Foi localizada
a planilha de respostas e consultados seus metadados, sem publicar respostas ou
identificadores. Os metadados não fornecem o formulário completo. Por isso, #98
permanece pendente: é necessário o link original do Forms ou uma exportação integral
em branco, incluindo todas as seções, alternativas e regras de ramificação.

Os gráficos/CSV e o roteiro preliminar não foram promovidos a fonte integral.
Não houve nova coleta, envio de convite, nova aprovação docente ou alteração do artigo.

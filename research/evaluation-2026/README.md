# Avaliação funcional do Memora — encaminhamentos de P01–P03

Síntese de encaminhamento em **03/11/2026**, baseada nas versões atuais das
fichas internas `Ficha_Avaliacao_Memora_P01.pdf`,
`Ficha_Avaliacao_Memora_P02.pdf` e `Ficha_Avaliacao_Memora_P03.pdf`.
As fichas identificadas e as transcrições não integram o repositório público.
Os códigos abaixo são os usados nos resultados; não relacioná-los a contatos.

## Evidências e decisões

| Evidência nas fichas | Interpretação e encaminhamento | Issue |
| --- | --- | --- |
| P02 e P03 não perceberam que o marcador circular do histórico era clicável; houve indicação direta do entrevistador | Dar à ação o texto visível Revisar, com número separado e seleção acessível | #67 |
| P03 teve dificuldade para localizar a troca e o antes/depois em T2 | Abrir a comparação ao revisar e antecipar os blocos Sai/Entra às tabelas | #68 |
| P02 questionou a diferença entre Parar e Pausar | Código da base `cb44cb7` confirma que ambos preservam o ponto; remover o comando visual redundante e manter pausa/retomada e Reiniciar | #69 |
| P03 precisou de direcionamento para identificar o que mudou ao alterar a memória em T4 | Reobservar a divisão do endereço sem indicação de caminho antes de definir um novo destaque | #70 |
| P03 sugeriu mais/menos por unidade e mais espaço, sem identificação segura do controle/região | Confirmar o alvo nas próximas sessões antes de alterar campos ou layout | #70 |
| P01/T1 teve enunciado impreciso; a ficha revisada não confirma texto cortado | Corrigir a condução e não registrar esses pontos como defeitos confirmados da interface | #70 |

P01 relatou experiência favorável e não indicou ajuste prioritário. Em P02, a
revisão foi aberta com ajuda, mas a demonstração completa do antes/depois não
está registrada. Essa ausência não equivale a uma falha observada.

## Escopo da implementação

O histórico passa a ter a ação Revisar abaixo do número de cada acesso.
Ela seleciona o snapshot e abre o antes/depois, com foco preservado no botão.
O painel pode ser recolhido e reaberto, inclusive para o mesmo acesso.
Voltar ao estado atual e retomar a reprodução recolhem a comparação.
Sai/Entra aparecem antes das tabelas; acerto e uso de via livre continuam sem
remoção de bloco. Contadores e microetapas pendentes não são reexecutados.

Iniciar/Pausar/Continuar ficam em um único botão. Reiniciar zera cache, histórico
e contadores. A API `stop()` é preservada no controlador; as regras de cache
não mudam. A interface conserva o padrão de ações preenchidas em roxo.

## Próxima verificação

A #82 altera o rótulo do botão para **Analisar** e a consulta passa a mostrar
**Detalhes do acesso N**. Na próxima rodada da #70, pedir a tarefa de localizar
e comparar uma substituição antes de indicar o botão ou apresentar o Manual.
Registrar se o participante encontrou a ação sozinho, consultou a ajuda ou
precisou de intervenção. Identificar a versão pelo commit publicado.

A #70 acompanha a descoberta dos recursos, a compreensão dos controles e as
sugestões ainda imprecisas. Pedir a revisão de uma substituição sem dizer onde
clicar e registrar qualquer ajuda. Anotar versão/commit, ambiente e data de cada
sessão; identificar os casos que usam a versão modificada separadamente dos
registros P01–P03. Os testes de software verificam o comportamento da aplicação,
mas não demonstram descoberta autônoma ou melhoria de usabilidade.

## Limites para o TCC

- A coleta observada é exploratória, por tarefas no Memora. A comparação com
  Beto em P01/P02 é retrospectiva; P03 nunca o utilizou. Não houve comparação
  controlada entre as duas ferramentas documentada nestas fichas.
- Tempos são contextuais; faltam alguns registros e houve intervenções do
  entrevistador. Não substituir dados ausentes pelo gabarito dos cenários.
- Respostas qualitativas sem alternativa marcada permanecem qualitativas;
  não convertê-las em notas ou evidência de ganho de aprendizagem.
- As mudanças propostas ainda precisam de integração e observação com usuários.
  Não atualizar as fichas originais para representar a interface modificada.

Rastreabilidade: avaliação #64; implementação #67–#69; verificação posterior #70.

## Apuração editorial — 04/11/2026 (#81)

As fichas P01 (revisada), P02 e P03 foram conferidas para a revisão do artigo.
A [matriz anonimizada](../../tcc/artigo/dados/avaliacao-rapida.csv) registra C
nos quatro critérios apenas para P01 e SR (sem código registrado) para P02/P03.
Por critério, C=1/3 (33,3%) e SR=2/3 (66,7%); P, N e X têm zero registros.
As respostas qualitativas não foram convertidas em C. SR é diferente de X.

O [registro editorial](../../tcc/artigo/TEMPLATE.md) documenta a codificação por
pergunta, as fontes das falas e a ausência de versão/ambiente nas sessões.
O artigo preserva a rodada original; não atribui a ela um commit presumido nem
considera as alterações do PR #71 uma validação com participantes. O PR #71 já
foi integrado; a reobservação com usuários permanece vinculada à #70.

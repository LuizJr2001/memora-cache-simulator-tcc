# Situação editorial vigente

A revisão docente de 11/11 está detalhada em [REVISAO-POLIANA-10-11.md](REVISAO-POLIANA-10-11.md). A decisão de modelo foi reaberta pelo comentário C01: a base SBC recebeu os ajustes explícitos solicitados, mas depende de conferência com o arquivo exato do Moodle. Consulte [TEMPLATE.md](TEMPLATE.md) antes de afirmar conformidade.

---

# Revisão editorial do artigo Memora — SBC e referência MedSimples

Registro histórico: a versão anterior manteve o template SBC de uma coluna: `sbc-template.sty`, `sbc.bst`, classe `article` A4 e bibliografia BibTeX. Não é uma mudança para ABNT, monografia ou duas colunas.

O artigo de André Guilherme de Almeida Macedo sobre o MedSimples (2025) foi usado como **referência de organização acadêmica**, sem transcrever sua redação: introdução/objetivos, fundamentação, trabalhos relacionados, metodologia, desenvolvimento, avaliação de usuários e conclusão, com instrumentos nos apêndices.

Ajustes da base de 04/11/2026 (anteriores à atualização abaixo):

- A fundamentação sobre memória cache e o levantamento teórico de software educacional/IHC estão na mesma seção.
- A seleção das ferramentas, suas descrições e a matriz de funcionalidades compõem a seção de trabalhos relacionados.
- A metodologia apresenta seis etapas rastreáveis, com tabela, e separa procedimento da apresentação dos resultados do questionário.
- Os resultados do levantamento com 13 respostas têm seção própria; gráficos e tabelas permanecem no corpo.
- O capítulo de avaliação reúne verificação técnica, método com estudantes, perfil anonimizado, tempos por tarefa, entrevista/avaliação rápida e mudanças decorrentes.
- Na base de 04/11/2026, a avaliação abrangia P01-P03; a atualização de 05/11/2026, descrita abaixo, amplia a análise para P01-P05 sem presumir versões das sessões.
- O perfil dos participantes recebeu uma tabela própria e a paginação foi revisada.
- A referência cruzada para o Anexo A teve o destino de hiperlink corrigido.
- As telas atuais do Memora e demais imagens permanecem nos mesmos lugares, conforme decisões editoriais das issues #78–#84.

Para compilar no Overleaf: importar este ZIP como projeto, usar `main.tex` com pdfLaTeX + BibTeX. O PDF fornecido foi compilado localmente e teve as páginas-chave inspecionadas.

## Atualização de 05/11/2026 - novas sessões

A base desta revisão é o pacote SBC de 04/11/2026. Foram incorporadas as fichas consolidadas de P04 e P05, sem presumir dados ausentes.
- Cinco participantes nas seções pertinentes; rodadas distinguidas.
- Perfis, tempos e gráficos regenerados a partir dos CSVs.
- Avaliação rápida: três códigos C e dois SR por critério; 60%/40% no conjunto.
- Relatos e falas com destaque para histórico, comparação, manual e configuração para exercícios.
- Crítica à velocidade 2 e proposta de endereços em blocos preservadas como resultados; sem afirmar implementação.
- Intervenções, desativação de etapas detalhadas e lacunas de versão explicitadas.
- Discussão e conclusão revistas sem atribuir causalidade entre versões nem ganho de aprendizagem.
- Mantidos template, levantamento de 13 respostas, referências e material visual anterior.
- Fichas nominativas excluídas do pacote; dados de análise anonimizados.

## Atualização de 09/11/2026

- Sincronização do fonte com a revisão Overleaf de 05/11 e as fichas complementares P06 e P07.
- Resumo, método, perfis, tempos, escala, discussão e conclusão passam a abranger sete sessões.
- Os gráficos são gerados a partir dos CSVs. O critério de satisfação conserva a resposta qualitativa de P07 em texto.
- A análise do histórico separa reconhecer a ação, encontrar o acesso e retornar à execução.
- Os instrumentos e o levantamento anterior sobre o Beto mantêm suas datas e bases.


## Atualização de 11/11/2026 — PDF de Poliana

- Título limitado à memória cache; autoras e notas identificadas; Resumo/Abstract reescritos e reordenados.
- Introdução com contexto, problema, objetivo geral/específicos e remissões às nove seções.
- Fundamentação em software educacional (2.1), cache (2.2) e IHC (2.3), sem descrições das ferramentas na teoria.
- Ferramentas em texto fluido e comparação concentrada ao final; matriz transposta sem alterar seus valores.
- Seleção e justificativa da base como primeira subseção da metodologia.
- Referências solicitadas acrescentadas com metadados conferidos e URLs efetivamente impressas.
- Palavra adotada no texto conceitual; transcrições históricas conservam célula e recebem explicação da equivalência.
- Figuras numeradas por apêndice/anexo, com âncoras independentes.
- Sete sessões, CSVs, escala, tempos e limites metodológicos preservados; corrigida uma menção residual a três sessões na tabela de escopo.
- PR #99 tratado como proposta de interface, com verificação visual e reavaliação de uso pendentes.

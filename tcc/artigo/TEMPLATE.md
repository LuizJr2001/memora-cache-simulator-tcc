# Formatação do artigo - revisão de 13/11/2026

A referência desta revisão é o PDF **TCC de Hugo Barbosa**, enviado por Poliana como exemplo de apresentação de artigo. O fonte passa a usar `abntex2` em modo `article`, fonte Latin Modern e bibliografia autor-data com `abntex2cite`. A composição deixou de depender de `sbc-template.sty`, `sbc.bst` e `revisao-abertura.sty`.

| Elemento | Composição atual |
| --- | --- |
| Abertura | Título em português e nota sobre a natureza do artigo; autor, orientadora e coorientadora centralizados |
| Vínculos | Notas de rodapé com informações acadêmicas e e-mails conhecidos |
| Resumos | RESUMO antes de ABSTRACT, títulos centralizados e palavras-chave nos dois idiomas |
| Corpo | Uma coluna, fonte de 12 pt, recuo de parágrafo e seções principais em maiúsculas |
| Referências | Autor-data e lista bibliográfica em abnTeX2; URL e data de acesso em campos próprios |
| Apêndices e anexo | Início em nova página; remissões por letra e figuras com numeração própria |
| Submissão/aprovação | Macros vazias no preâmbulo; nenhuma data foi inventada |

A apresentação foi recomposta a partir do PDF, não do arquivo-fonte do aluno. O ZIP exato do modelo do Moodle não consta nos materiais disponíveis. Esta revisão não declara identidade com esse arquivo nem aprovação institucional. Quando ele estiver disponível, conferir sobretudo margens, campos de submissão/aprovação, titulações e regras específicas de referências.

A revisão inicial conferiu as 133 anotações de `revPoliana10-11`, incluindo 56 exclusões. A versão atual incorpora também o PDF `revPoliana13-11` (186 objetos, incluindo 72 exclusões) e as orientações dos seis áudios. O acompanhamento dessas marcações consta em [REVISAO-POLIANA-13-11.md](REVISAO-POLIANA-13-11.md). As exclusões valem para os trechos e contextos marcados: uma palavra riscada em uma frase não proíbe seu uso técnico no restante do artigo.

## Histórico anterior, preservado para rastreabilidade

As decisões abaixo pertencem às revisões anteriores e foram superadas pela orientação de 12/11 e pelo exemplo de Hugo. Não definem o template corrente.

# Situação vigente da formatação — 11/11/2026

O comentário C01 do PDF `revPoliana10-11` informa que a abertura anterior não corresponde ao modelo obrigatório disponibilizado no Moodle. Essa orientação específica supera a conclusão operacional de 04/11 abaixo. O arquivo exato do modelo do Moodle ainda não integra os materiais disponíveis; portanto, a conformidade integral **não está confirmada**.

Nesta revisão foram aplicados os requisitos explicitados por Poliana: inclusão da orientadora e coorientadora como autoras, notas de rodapé com vínculo e e-mail, Resumo antes de Abstract e ambos os títulos centralizados. O título foi limitado ao ensino de memória cache. As notas informam apenas dados conhecidos, sem inventar titulação acadêmica.

`sbc-template.sty` e `sbc.bst` permanecem como base de composição. O pequeno arquivo `revisao-abertura.sty` isola as adequações da abertura, sem alterar o estilo de origem. A ordem dos elementos, o conteúdo de eventuais outros campos e a configuração final das notas devem ser confrontados com o modelo institucional quando ele estiver disponível. Não se afirma aprovação por Natália, Poliana ou Glívia.

O corpo conserva uma coluna, fonte e margens da base SBC. As figuras dos apêndices usam letra e número próprios e as do anexo usam `Anexo A-1`, com destinos de hiperlink independentes. Veja `REVISAO-POLIANA-10-11.md` e `VALIDACAO-11-11.md`.

---

## Registro histórico de 04/11 (não substitui a pendência vigente)

# Modelo de entrega e reconciliação — 04/11/2026 (#78–#81)

## Decisão

Adotar o template SBC de uma coluna para esta revisão do artigo. A Resolução ENGCOMP 001/20, anexo, art. 1º, §1º, admite ACM/IEEE (duas colunas) ou SBC (uma). O abnTeX2 da V1 não corresponde a esses modelos; não foi localizada autorização específica para sua utilização. Esta é uma adequação à alternativa prevista na resolução, não uma alegação de aprovação individual pela orientação.

Fonte: https://www.eng-computacao.bh.cefetmg.br/wp-content/uploads/sites/188/2022/08/Resolucao_Engcomp_01_20-CriteriosTCCFormatoArtigo.docx-Documentos-Google.pdf

O §3º exige ao menos 14 páginas para TCC II em SBC, excluídas as referências. A conferência usa conservadoramente apenas o corpo anterior às referências, sem depender dos apêndices.

## Abertura e metadados

| Elemento | Decisão | Fundamento |
| --- | --- | --- |
| Título em português | Um título na abertura | SBC, seção 2: título, autores e instituição na primeira página |
| Segundo título em inglês | Não exibir | Não exigido pelo template consultado; a resolução remete ao template |
| Abstract e Resumo | Ambos na primeira página, até 10 linhas cada | SBC, abertura e seção 2 |
| Palavras-chave | Mantidas nos metadados PDF, omitidas do corpo | Não exigidas no texto das instruções SBC; o estilo disponibiliza comandos opcionais |
| Autoria e instituição | Preservadas na primeira página | SBC, seção 2 |
| Depósito institucional | Não confundir com o artigo | As fontes acima não definem campos do formulário de depósito; título traduzido/palavras-chave podem ser solicitados separadamente. Não foi comprovada uma exigência adicional de depósito nesta revisão |

Instruções: https://www.sbgames.org/arquivos/Template_SBC/sbc_template.pdf
Arquivos `sbc-template.sty` e `sbc.bst` obtidos de:
https://www.sbgames.org/arquivos/Template_SBC/template-latex/
O estilo identifica atualização de dezembro de 2017. Margens, fonte e abertura são controladas pelo estilo, não por ajustes locais para atingir páginas.

## Base editorial única

Base Git: `188348a` (main consultada). A main ainda descrevia avaliação pendente. Foi incorporada a V1 Overleaf de 04/11/2026, versão 2, SHA-256 `b1194df645a0b5d12bbd79f3f7bd1152df89228863285d9afe6d2c012313d01d`, com figuras e bibliografia, antes da revisão. Não foram alterados os instrumentos históricos nem o código do simulador. A seção de implementação descreve o percurso e a rodada original; a figura do PR 71 conserva hash/data e não representa a versão das entrevistas.

A partir daqui, `tcc/artigo/` é a única fonte do PDF e de `tcc/tcc-atual.zip`. O empacotador inclui o estilo SBC, bibliografia, dados anonimizados, script e figuras. Auxiliares de compilação ficam fora do pacote.

## Evidências de origem e escopo

- `LICENSE`: MIT, copyright 2022 Leandro Gabriel; atribuição acadêmica preservada a Gabriel, Vieira e Martins (2022).
- `docs/decisoes/003-pacote-memora.md`: extração/adaptação da base Beto, coexistência em `docs/` e `packages/memora`, separação core/UI, PRs 36/41/43/44/45.
- Código em `packages/memora/src/core/` e `src/ui/`, documentação e histórico: mapeamentos e políticas existentes, validação, snapshots e apresentação.
- Escrita/dirty bit (#32), gráficos da execução, exportação e comparação entre configurações são futuro; validade exibida já pertence à implementação.
- As duas autocitações de produtos deste TCC foram removidas. Links e remissões internas substituem-nas sem remover trabalhos externos.

## Entrevistas e limites na revisão de 04/11

Conferidas as fichas P01 (versão 1 revisada), P02 e P03 disponíveis em 04/11/2026. Documentos identificados não são copiados para o Git. A matriz pública em `dados/avaliacao-rapida.csv` mantém apenas códigos anônimos. C/P/N/X são alternativas; SR é ausência de código, não X. Cada critério: C=1, P=N=X=0, SR=2, n=3. Não converter comentários em C.

Q1/Q2/Q4: três respostas; Q3: duas respostas específicas e uma ausência. Codificar por pergunta e participante, sem juntar observação de tarefa com fala pós-uso. Q1 e Q4 repetem o tema descoberta do histórico em P02/P03; isso não é contado como quatro pessoas. Falas P02/P03 provêm de transcrição sem conferência de áudio; P01 é anotação literal confirmada pelo entrevistador. Demais sínteses são paráfrases.

Rodada original P01–P03: versão/commit não registrados. A lacuna permanece explícita. PR 71 e alterações posteriores são intervenções de interface, não uma segunda rodada de evidência de uso. #64 e #70 acompanham avaliação e reobservação. Novas sessões precisam registrar data, versão, ambiente e ajuda sem reescrever as anteriores.

## Consolidação de 09/11/2026

A avaliação do artigo passa a abranger P01–P07. A revisão aproveita a versão Overleaf de 05/11, que já incluía P04 e P05, e acrescenta P06 e P07. A [proveniência](dados/PROVENIENCIA.md) registra a apuração atual, a resposta qualitativa de P07 em C4 e as diferenças na condução. O formato SBC e a organização dos apêndices seguem a decisão de 04/11.

## Destinos públicos

Os quatro destinos (Memora, repositório Memora, Beto e repositório original) retornaram HTTP 200 na conferência de 04/11/2026. URLs completas aparecem em notas no artigo, com quebra via xurl.

Compatibilidade: acrescentado ramo falso vazio ao `\@ifpackageloaded` do hook final de `sbc-template.sty`, para não consumir o próximo token nos hooks LaTeX atuais. Nenhuma regra visual foi alterada.

## Verificação da revisão de 04/11

- pdfLaTeX/BibTeX via latexmk: 29 páginas; corpo nas páginas físicas 1–25, referências 26–27 e apêndices 28–29. Mínimo SBC de 14 páginas atendido sem contar referências/apêndices.
- Abstract com 7 linhas e Resumo com 8 linhas, ambos na primeira página. Um título em português. Fonte Times, uma coluna e margens do estilo SBC.
- Páginas renderizadas e conferidas: abertura, notas/URLs, tabelas, gráfico da escala (p. 22), referências e apêndices. Sem referências indefinidas ou caixas excedentes no log final.
- `npm run check` e `npm test`: aprovados, 78 testes. Não se atribui esta execução à versão das entrevistas nem se repete a suíte de navegador para alteração editorial.
- Os 94 cenários Chromium citados no artigo são a verificação histórica do PR #71, conferida na descrição daquele PR, não testes executados nesta revisão.

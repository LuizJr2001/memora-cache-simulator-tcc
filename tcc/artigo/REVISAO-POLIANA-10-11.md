# Revisão dos apontamentos de Poliana — PDF de 10/11/2026

Base: `main` após PRs #95 e #96 (`38408d36`). O PDF anotado foi confrontado com o fonte atual; algumas sugestões se referem a uma versão anterior com menos entrevistas. Os sete casos P01–P07, os CSVs e as fichas públicas foram preservados.

Foram identificadas 133 anotações no PDF, das quais 75 possuem comentário textual. Os identificadores C01–C75 abaixo seguem a ordem de leitura das páginas, sem publicar o documento anotado. Marcações gráficas sem comentário (incluindo trechos riscados) foram consideradas na reescrita das seções correspondentes, especialmente na retirada das justificativas do TCC das descrições de ferramentas.

**Pendência de C01:** não foi fornecido o arquivo exato do modelo citado no Moodle. Esta versão aplica os elementos explicitados no comentário docente sobre autoria, rodapé, resumo e abstract, mantendo o estilo SBC como base técnica provisória. Não se declara equivalência integral ao modelo institucional. A confirmação da formatação pela coordenação continua pendente; nenhum e-mail foi enviado por esta revisão.

**Precisão do método:** a revisão de interface acompanhada pela orientação foi descrita. Não foi inventado um relatório de inspeção heurística formal nem resultado de aprendizagem. As propostas do PR #99 estão separadas do código integrado e dos resultados das entrevistas.

| ID | Página do PDF | Pedido | Tratamento | Local/observação |
| --- | --- | --- | --- | --- |
| C01 | 1 | Abertura e modelo institucional | Parcial | Autoria, notas com vínculo e e-mails, resumo antes do abstract e títulos centralizados. Falta confrontar com o arquivo exato do Moodle; ver TEMPLATE.md. |
| C02 | 1 | Contexto, problema e verbo do objetivo no resumo | Aplicado | Resumo/Abstract: ferramentas educacionais, abstração e objetivo explícito. |
| C03 | 1 | Objetivo de propor o Memora a partir do Beto | Aplicado | Resumo, introdução e considerações finais alinhados. |
| C04 | 1 | Síntese metodológica sem quantidades no resumo | Aplicado com precisão metodológica | O resumo descreve revisão de interface; não declara inspeção heurística formal concluída, pois não há laudo. |
| C05 | 1 | Síntese dos requisitos e do retorno das entrevistas | Aplicado | Resumo destaca prioridades de interface, avaliações favoráveis e dificuldades observadas; dados detalhados ficam nos resultados. |
| C06 | 1 | Regência: apoio ao ensino | Aplicado | Título e abertura. |
| C07 | 1 | Contextualização de software para ensino | Aplicado | Primeiro parágrafo da introdução, com Godoi/Padovani e Araújo/Freitas. |
| C08 | 1 | Referência de arquitetura no problema | Aplicado | Patterson/Hennessy, edição e autoria verificadas na editora. |
| C09 | 1 | URL do Beto em nota na primeira menção | Aplicado | Introdução, primeira apresentação detalhada da ferramenta. |
| C10 | 1 | Acesso gratuito e código aberto | Aplicado | Introdução e trabalhos relacionados. |
| C11 | 1 | Reescrita da formulação sobre o repositório | Aplicado | Descrição direta da implementação, com fonte. |
| C12 | 1 | Tempo verbal: foi desenvolvido | Aplicado | Introdução e descrição do Beto. |
| C13 | 1 | Exemplos de parâmetros configuráveis | Aplicado | Parênteses na introdução; palavras por bloco, linhas, mapeamento e política. |
| C14 | 1 | Execução em tempo real e passo a passo | Aplicado | Introdução. |
| C15 | 1 | Conceitos simultâneos de memória cache | Aplicado | Problema descrito de forma concisa na introdução. |
| C16 | 1 | Panorama de simuladores antes da escolha | Aplicado com delimitação da afirmação | Introdução apresenta diversidade e critérios. Não afirma ausência em todos os livros, para a qual não há levantamento bibliográfico exaustivo. |
| C17 | 1 | Título restrito ao ensino de memória cache | Aplicado | Retirada a expressão hierarquia de memória do título; escopo de um nível explícito. |
| C18 | 2 | Motivação de usabilidade, base preservada e um nível | Aplicado com delimitação da hipótese | Introdução vincula hipótese ao levantamento, sem declarar baixa adoção universal do Beto; multinível incluído nos trabalhos futuros. |
| C19 | 2 | Nome após melhorias e licença MIT | Aplicado | Introdução e implementação; condições da licença referenciadas na OSI. |
| C20 | 2 | Remissão à implementação | Aplicado | Introdução remete à Seção 6 por referência cruzada. |
| C21 | 2 | Objetivos específicos junto ao geral | Aplicado | Objetivos reunidos no mesmo parágrafo da introdução. |
| C22 | 2 | Organização de todas as seções do artigo | Aplicado | Último parágrafo da introdução enumera Seções 2–9. |
| C23 | 2 | Software educacional na fundamentação | Aplicado | Subseção 2.1. |
| C24 | 2 | Definir hierarquia antes de cache | Aplicado | Início da subseção 2.2. |
| C25 | 2 | Posição entre processador e memória principal | Aplicado | Definição de cache na subseção 2.2. |
| C26 | 2 | Capacidade menor e princípios de localidade | Aplicado | Subseção 2.2 relaciona capacidade e seleção. |
| C27 | 2 | Transferência de blocos de palavras | Aplicado | Subseção 2.2. |
| C28 | 2 | Terminologia: palavra | Aplicado com preservação documental | Teoria e descrição do modelo usam palavra. Rótulos transcritos do instrumento original preservam célula, com equivalência explicada na implementação e no Apêndice B. |
| C29 | 2 | Solicitação pelo processador | Aplicado | Definição de acerto e falta na subseção 2.2. |
| C30 | 2 | Referência sobre métricas de cache de 2021 | Aplicado | Sonia et al. (2021), DOI e ordem dos seis autores conferidos no manuscrito; o sobrenome Alsharef não é o primeiro nome na folha do artigo. |
| C31 | 3 | Endereço da memória principal | Aplicado | Explicação conceitual da decomposição. |
| C32 | 3 | Campos ao mapear para cache | Aplicado | Explicação conceitual após mapeamentos. |
| C33 | 3 | Survey de Barbhuiya/Das/Roy | Aplicado | Citado com 2024, ano de publicação informado pela Springer; AMRIT 2023 é o evento. |
| C34 | 3 | Ajuste de início de frase | Aplicado | Trecho reescrito na reorganização da subseção 2.2. |
| C35 | 3 | Palavra em lugar de célula na teoria | Aplicado | Subseção 2.2 e exemplo didático da implementação. |
| C36 | 3 | Simplificar explicação do endereçamento | Aplicado | Removidas fórmulas da fundamentação; implementação explica a convenção com 4096 palavras e endereços 0–4095. |
| C37 | 3 | Mapeamentos antes dos campos do endereço | Aplicado | Ordem da subseção 2.2. |
| C38 | 3 | Termo técnico para faltas | Aplicado | Definição de falta com miss em itálico. |
| C39 | 3 | Itálico em hit, miss e tag | Aplicado | Texto corrente, rótulos discutidos e exemplos; bibliografia conserva títulos originais. |
| C40 | 3 | Linguagem formal nos mapeamentos | Aplicado | Descrições em prosa técnica, sem lista informal. |
| C41 | 3 | Justificativa de clareza no método | Aplicado | Critérios de seleção e escolha da base na subseção 4.1. |
| C42 | 3 | Substituição após associatividade | Aplicado | Seleção restrita ao conjunto ou à cache totalmente associativa, após definição dos mapeamentos. |
| C43 | 4 | Software educacional como 2.1 | Aplicado | Subseção 2.1. |
| C44 | 4 | Referência de Kumar/Singh | Aplicado | Políticas de substituição, DOI 10.1109/ICETECH.2016.7569243, páginas 210–214 conforme metadados do editor/Crossref. |
| C45 | 4 | Retirar diferenças de ferramentas da teoria | Aplicado | Ripes descrito em trabalhos relacionados e convenção do Memora na implementação. |
| C46 | 4 | Métricas explicadas conceitualmente | Aplicado | Último parágrafo da subseção 2.2. |
| C47 | 4 | Desenvolvimento de software educacional e referência | Aplicado | Subseção 2.1, vinculada à avaliação didático-pedagógica e ergonômica. |
| C48 | 4 | Preservar o trecho aprovado sobre qualidade de uso | Preservado | Mantida a formulação aprovada no parágrafo baseado em Godoi/Padovani. |
| C49 | 4 | Reformular apresentação do survey de simuladores | Aplicado | Último parágrafo da subseção 2.1. |
| C50 | 5 | IHC como subseção 2.3 | Aplicado | Subseção 2.3. |
| C51 | 5 | Critérios como primeira parte da metodologia | Aplicado | Subseção 4.1. |
| C52 | 5 | Aprofundar teoria de IHC e inspeção | Aplicado | Definições, usabilidade/experiência, heurísticas e distinção entre inspeção e teste com usuários. |
| C53 | 6 | Apresentar a seção de ferramentas | Aplicado | Parágrafo introdutório de trabalhos relacionados. |
| C54 | 6 | Texto fluido sem subtítulos de cada ferramenta | Aplicado | Sete ferramentas descritas em parágrafos antes do comparativo. |
| C55 | 6 | Controles descritos em português | Aplicado | Descrição do Beto em trabalhos relacionados. |
| C56 | 6 | Identificar captura e fonte do Beto | Aplicado | Legenda e fonte da Figura 1. |
| C57 | 6 | Informar software livre e MIT do Beto | Aplicado | Introdução e trabalhos relacionados. |
| C58 | 7 | Figura junto à apresentação do ParaCache | Aplicado | Referência cruzada na primeira menção; numeração própria do apêndice. |
| C59 | 7 | Regência de voltado à memória | Aplicado | Descrição do ParaCache. |
| C60 | 7 | Associatividade de duas e quatro vias | Aplicado | Descrição do ParaCache. |
| C61 | 7 | Explicar load e store como transferência de dados | Aplicado | Descrição do ParaCache. |
| C62 | 7 | Opções de política de substituição | Aplicado | Descrição do ParaCache. |
| C63 | 7 | Explicitar conjunto de instruções | Aplicado | Ripes: conjunto de instruções RISC-V. |
| C64 | 7 | Caches L1 de dados e instruções separadas | Aplicado | Descrição do Ripes. |
| C65 | 7 | Referência à figura do Ripes | Aplicado | Primeira menção em trabalhos relacionados. |
| C66 | 7 | Referência à figura do SMPCache | Aplicado | Primeira menção em trabalhos relacionados. |
| C67 | 8 | Referência à figura do Dinero IV | Aplicado | Primeira menção em trabalhos relacionados. |
| C68 | 8 | Explicitar arquitetura de conjunto de instruções MIPS | Aplicado | Descrição do Cache Simulator em Python. |
| C69 | 8 | Referência à figura da ferramenta MIPS | Aplicado | Primeira menção em trabalhos relacionados. |
| C70 | 8 | Ausência de interface gráfica | Aplicado | Dinero IV e Cache Simulator: execução por linha de comando. |
| C71 | 9 | Subseção comparativa e duas tabelas legíveis | Aplicado | Subseção 3.1: características e matriz transposta, preservando os 105 marcadores da base; discussão após as tabelas. |
| C72 | 9 | Retirar justificativas do TCC das descrições | Aplicado | Descrições tratam apenas das ferramentas; comparação ao final e escolha na metodologia. |
| C73 | 11 | Justificar escolha e recorte da base | Aplicado | Subseção 4.1 distingue visibilidade do estado e ampliações funcionais. |
| C74 | 28 | Corrigir referência da página do Beto | Aplicado | Gabriel, Leandro; título; sem data de publicação informada; URL e acesso no campo note, efetivamente impresso pelo estilo BibTeX. |
| C75 | 41 | Numeração própria de figuras em apêndices/anexos | Aplicado | Figuras C-1… e D-1…; Anexo A-1…; contadores e destinos de hiperlink reiniciados por divisão. |

## Verificação

O resultado de compilação, paginação, inspeção visual e sincronização do pacote é registrado em `VALIDACAO-11-11.md` após a conferência. Os dados de participantes e as figuras de pesquisa não são regenerados por mudanças de redação. A matriz funcional foi apenas transposta; os 105 valores foram preservados.

## Fontes conferidas para os novos ajustes bibliográficos

- Patterson/Hennessy: [catálogo da editora](https://shop.elsevier.com/books/computer-organization-and-design-enhanced/patterson/978-0-12-801285-7), 5ª edição ampliada, 2014.
- Sonia e colaboradores: [manuscrito depositado pela autora](https://www.researchgate.net/publication/352825606_Cache_Memory_An_Analysis_on_Performance_Issues), folha inicial com Sonia antes de Ahmad Alsharef; 2021, 184–188.
- Barbhuiya/Das/Roy: [Springer](https://link.springer.com/chapter/10.1007/978-3-031-47221-3_12), publicação em 16/04/2024, evento AMRIT 2023, páginas 126–138.
- Kumar/Singh: [IEEE](https://ieeexplore.ieee.org/abstract/document/7569243) e metadados DOI/Crossref, 2016, 210–214.
- Nielsen: [princípios de usabilidade](https://www.nngroup.com/articles/ten-usability-heuristics/), publicação original de 1994, revisão de 2024.
- [Texto da licença MIT na OSI](https://opensource.org/license/mit).

# Roteiro da defesa do Memora

Duração sugerida: **30 minutos**, incluindo a demonstração guiada de **2min30s**. Slides 31–39 são de apoio e ficam ocultos no modo de apresentação.

O vídeo usa capturas reais com mudanças de foco e legendas. Não contém narração gravada. Durante a apresentação, comentar o fluxo com as notas do slide 18.

## Slide 01 — Memora: aprimoramento de um simulador para apoio ao ensino de memória cache

**00:00–00:40 (40 s)**

Apresento o Memora, resultado do aprimoramento da usabilidade do simulador Beto. O ponto de partida foi uma ferramenta já usada no curso. Meu trabalho ligou necessidades dos estudantes, decisões de interface e observação de uso. Vou percorrer esse caminho e destacar o que construí.

## Slide 02 — Dificuldade de acompanhar um conjunto de acessos

**00:40–01:40 (60 s)**

O conteúdo exige relacionar vários acessos, não apenas identificar um acerto ou uma falta isolada. Neste exemplo, os endereços 0 e 2 disputam a mesma linha. Para explicar o terceiro acesso, precisamos lembrar o que o segundo retirou da cache. Essa passagem do endereço para a mudança de estado é o problema que orientou o trabalho.

## Slide 03 — Objetivos do trabalho

**01:40–02:40 (60 s)**

O objetivo geral é aprimorar a usabilidade do simulador de memória cache Beto, dando origem ao Memora. Os objetivos específicos que organizam essa entrega são caracterizar as ferramentas existentes, identificar necessidades dos usuários e implementar uma interface que explicite ações e estados. A observação com estudantes aparece adiante como parte do processo de examinar e refinar essa interface.

## Slide 04 — Memória cache

**02:40–03:40 (60 s)**

A cache mantém uma parcela dos dados da memória principal próxima do processador. O uso de blocos explora as localidades temporal e espacial. O mapeamento limita onde cada bloco pode ficar, e a política escolhe uma posição quando é necessário substituir. Na interface, a decomposição do endereço e os metadados precisam tornar essas regras observáveis. Aqui não estou apresentando um modelo novo de cache, mas os conceitos que a ferramenta representa.

## Slide 05 — Softwares educacionais e usabilidade

**03:40–04:30 (50 s)**

Simuladores são softwares educacionais que permitem experimentar configurações e observar processos internos. Para que o estudante explore o conteúdo, precisa entender os campos, reconhecer os controles e interpretar o retorno. Por isso a usabilidade faz parte do problema. Minha investigação observou essas condições de uso e a utilidade percebida, sem aplicar um teste de ganho de aprendizagem.

## Slide 06 — Trabalhos relacionados: ferramentas analisadas

**04:30–05:25 (55 s)**

Analisei sete ferramentas. A tabela situa o recorte de cada uma: Beto e ParaCache têm acesso web, Ripes e QtMips integram cache e processador, SMPCache aborda multiprocessadores, e Dinero e Cache Simulator trabalham com rastros ou saída textual. Essa caracterização impede tratar quantidade de funcionalidades como uma medida única de qualidade. A escolha depende do que se quer ensinar e da possibilidade de modificar a base.

## Slide 07 — Trabalhos relacionados: recursos de simulação

**05:25–06:20 (55 s)**

A matriz compara um recorte dos recursos documentados. Todos os simuladores do recorte representam os mapeamentos clássicos, com suporte parcial identificado no QtMips. O Beto já oferece as políticas necessárias ao trabalho. Outras ferramentas ajudam a identificar recursos como escrita e visibilidade da recência. A análise não é um ranking: um recurso não identificado na documentação não significa incapacidade provada da ferramenta.

## Slide 08 — Por que o simulador Beto foi escolhido

**06:20–06:55 (35 s)**

O Beto foi uma escolha adequada à pergunta do trabalho: já era usado em AOC no CEFET, tinha acesso web em português e disponibilizava código com licença MIT. Além disso, já implementava os três mapeamentos e as políticas clássicas para um nível de cache. Isso permitiu concentrar o esforço no aprimoramento da interação, preservando uma base funcional existente.

## Slide 09 — A interface original do simulador Beto

**06:55–07:50 (55 s)**

Esta é a interface original em tamanho maior. Os parâmetros, o detalhamento do endereço e a execução compartilham a mesma tela. O objetivo não é desqualificar a ferramenta: o levantamento mostrou que os estudantes a consideravam útil. O problema era organizar o acesso à informação e tornar decisões e controles mais compreensíveis. Vou mostrar como os estudantes descreveram essas necessidades.

## Slide 10 — Metodologia

**07:50–08:45 (55 s)**

O processo liga diagnóstico, projeto e verificação. Primeiro caracterizei as ferramentas e consultei estudantes. A inspeção relacionou as dificuldades aos componentes da interface. Depois elaborei protótipos, revisei-os com as docentes e implementei incrementalmente. Por fim, observei tarefas e entrevistei os estudantes para localizar dificuldades e orientar ajustes. A cronologia completa permanece no apoio.

## Slide 11 — O que os estudantes pediram no Beto

**08:45–10:00 (75 s)**

O questionário recebeu 13 respostas. Doze estudantes declararam familiaridade intermediária ou avançada, e todos atribuíram utilidade 3 ou 4 ao Beto na escala de 1 a 4. Ao mesmo tempo, pediram mais explicação, ajuda e visibilidade do estado. A tabela mostra frequências de escolhas independentes. Pedidos de escrita também surgiram, mas implicariam ampliar o modelo. Priorizei as melhorias de usabilidade dentro do prazo do TCC.

## Slide 12 — Requisitos da inspeção de usabilidade

**10:00–11:05 (65 s)**

A inspeção heurística é um exame da interface orientado por princípios de usabilidade. Não atribuí severidades numéricas. Relacionei os problemas a ações concretas: prevenir entradas incompatíveis, explicar termos, mostrar os estados e oferecer controle da execução. Ela complementa o levantamento porque aproxima o relato do estudante do componente que pode ser alterado.

## Slide 13 — Do Beto ao Memora: prioridades do aprimoramento

**11:05–12:05 (60 s)**

A ordem de desenvolvimento acompanhou o fluxo de uso. Uma configuração precisa ser válida antes de produzir resultados interpretáveis. Em seguida, organizei as informações e o apoio. A explicitação dos metadados e a revisão dos acessos completam o acompanhamento. São decisões que preservam o modelo de um nível de cache e respondem ao levantamento e à inspeção.

## Slide 14 — Protótipo: separar a configuração

**12:05–13:00 (55 s)**

No Figma, representei os campos, as ajudas, os erros e as etapas de uso antes de implementar os comportamentos. As docentes de Arquitetura de Computadores e IHC revisaram os protótipos. Os comentários levaram a ajustes na navegação, na diferença entre campos e botões e na linguagem das ajudas. A tela mostra a proposta de configuração separada da execução.

## Slide 15 — Protótipo: explicitar a revisão do acesso

**13:00–14:00 (60 s)**

A revisão de uma substituição precisava mostrar qual bloco sai, qual entra e por quê. O protótipo representava Configurar, Simular e Analisar. Na implementação, integrei a comparação à tela Simular, como uma ação do histórico. Assim, a aplicação final tem duas etapas, preservando a consulta antes e depois no próprio contexto do acesso.

## Slide 16 — Implementação do Memora

**14:00–14:55 (55 s)**

Implementei uma aplicação web estática com HTML, CSS e módulos JavaScript. Separei as regras da cache dos controles e da apresentação. O núcleo valida, decompõe endereços e processa acessos. Os controladores organizam reprodução e revisão. Cada acesso guarda estados antes e depois, permitindo consultar o histórico sem recalcular a simulação ou alterar seus contadores.

## Slide 17 — Organização do desenvolvimento no GitHub

**14:55–15:40 (45 s)**

Organizei requisitos e tarefas em issues e desenvolvi mudanças em branches curtas. Os pull requests reúnem a implementação, a justificativa e a verificação. A captura mostra entregas efetivamente integradas, incluindo a consolidação das entrevistas, os ajustes da interface e a regressão. O fluxo de trabalho documenta Kanban, mas a página pública não apresenta um Projects vinculado. Por isso esta evidência é a lista real de entregas, não um quadro reconstruído.

## Slide 18 — Demonstração do fluxo do Memora

**15:40–18:10 (150 s)**

Reproduzir o vídeo guiado de 2 minutos e 30 segundos. Comentar: configuração e validação; exemplo associativo com duas vias e LRU; uma falta inicial e o acerto seguinte; conclusão dos 21 acessos; revisão do acesso 20, que troca 992–1007 por 3040–3055; retorno ao estado atual; alteração do mapeamento e da divisão do endereço. O vídeo usa capturas reais com pausas para explicação. As telas estáticas estão nos slides de apoio.

## Slide 19 — Avaliação exploratória com estudantes

**18:10–19:20 (70 s)**

Sete estudantes de Engenharia de Computação participaram de entrevistas individuais, todos no primeiro uso do Memora. Cinco conheciam o Beto. O procedimento combinou observação de quatro tarefas e entrevista pós-teste. As tarefas percorrem configuração, execução e revisão, mudança de mapeamento e alteração da memória principal. A amostra foi por conveniência e as sete entrevistas compõem um único ciclo exploratório.

## Slide 20 — Resultados das tarefas

**19:20–20:40 (80 s)**

A tabela resume as evidências registradas nas sete fichas. C é conclusão registrada. R inclui dificuldade, orientação operacional ou variação da instrução. I é registro insuficiente para confirmar a conclusão integral. T3 reúne mais conclusões registradas sem ressalva. T2 concentra ressalvas e lacunas, especialmente na descoberta da revisão. Ressalvas em T1 também incluem problemas de condução do enunciado. Não são taxas padronizadas de sucesso autônomo.

## Slide 21 — Maiores dificuldades observadas

**20:40–21:50 (70 s)**

As principais dificuldades se relacionaram à revisão e ao controle. P02 e P03 não reconheceram o marcador circular como uma ação. P05 reconheceu Analisar, mas considerou rápida a reprodução. P06 valorizou as explicações e precisou de ajuda para retornar ao estado atual. T2 exigia realizar várias ações, então destaquei esses episódios em vez de atribuir todo o resultado a uma única causa.

## Slide 22 — Resultados da entrevista pós-teste

**21:50–23:10 (80 s)**

A entrevista incluiu quatro critérios. A tabela usa sete participantes como denominador e preserva respostas sem código. Cinco registraram atende completamente para controles, clareza e visualização. Em satisfação são quatro códigos, porque P07 respondeu Muito positiva em texto. P02 e P03 têm respostas textuais nos quatro critérios. Não converti esses textos em notas nem interpretei a ausência de código como uma avaliação negativa.

## Slide 23 — O que as entrevistas ajudam a interpretar

**23:10–24:20 (70 s)**

As falas complementam a tabela. A avaliação geral favorável não elimina um problema específico de controle, como o ritmo. A comparação com o Beto expressa a lembrança de uso anterior, e a fala de P07 expressa utilidade percebida para revisão. A evidência permite valorizar a organização e as explicações, mantendo a distinção entre percepção de apoio e aprendizagem medida.

## Slide 24 — Ajustes realizados a partir das entrevistas

**24:20–25:35 (75 s)**

Os achados viraram alterações concretas. Troquei a ação pouco reconhecida por Analisar com identificação do acesso. Simplifiquei os controles, destaquei o retorno à cache atual e acrescentei ritmos mais lentos. Também incluí o editor opcional de endereços e a ajuda próxima ao mapeamento. Essas mudanças estão implementadas. A reobservação é uma continuidade específica para verificar a descoberta após os ajustes.

## Slide 25 — Alcance da avaliação

**25:35–26:30 (55 s)**

O resultado é um conjunto de evidências de uso e de decisões de interface. As sete entrevistas ajudam a localizar dificuldades e compreender o apoio percebido. A amostra e as intervenções limitam a generalização. As apreciações do Beto são retrospectivas, pois não houve tarefas equivalentes nas duas ferramentas. A avaliação não foi desenhada para medir ganho de aprendizagem. Essa delimitação sustenta a contribuição sem prometer um resultado que não foi observado.

## Slide 26 — Verificação técnica da aplicação após os ajustes

**26:30–27:25 (55 s)**

Depois dos ajustes, as verificações técnicas cobriram as regras e as interações. O registro de 17 de novembro informa 81 testes Node e 101 cenários Playwright aprovados. Uma falha real de layout em 801 por 720 foi identificada e corrigida antes da regressão integral. Esses resultados são posteriores à redação do artigo, que registrava a suíte anterior. Testes funcionais não substituem a reobservação com usuários.

## Slide 27 — Contribuições do trabalho

**27:25–28:35 (70 s)**

A principal entrega é o Memora: uma evolução web livre do Beto, com configuração validada, ajuda contextual, controle de execução e comparação por acesso. A segunda contribuição é ligar as necessidades dos usuários às decisões de projeto e aos resultados observados. O trabalho também deixa instrumentos, fichas anonimizadas e manual para continuidade. Novos estudantes podem reobservar os ajustes e ampliar o modelo sem reconstruir essa base.

## Slide 28 — Experiências e desafios do desenvolvimento

**28:35–29:25 (50 s)**

O desafio foi transformar conceitos de cache em estados visuais e ações compreensíveis. O protótipo permitiu discutir essas decisões com as docentes antes da implementação completa. No desenvolvimento, precisei manter coerência entre regras, controles e histórico. Nas entrevistas, aprendi a distinguir dificuldades do conteúdo, problemas de interação e efeitos da condução. Esse percurso conecta o que construí ao que observei durante o uso.

## Slide 29 — Referências selecionadas

**29:25–29:45 (20 s)**

Estas são as referências centrais para cache, software educacional, inspeção e metodologia. A bibliografia completa está no artigo.

## Slide 30 — Agradecimentos

**29:45–30:00 (15 s)**

Agradeço à orientação, à coorientação, aos estudantes participantes, aos autores do Beto e à banca. Encerro reforçando a entrega: um simulador aprimorado e um percurso documentado que liga necessidades, interface e avaliação de uso.

## Uso dos slides de apoio

- 31: Cronologia do projeto
- 32: Memora: configurar um cenário
- 33: Memora: acompanhar a simulação
- 34: Memora: revisar uma substituição
- 35: Cenário da demonstração LRU
- 36: Realização das tarefas por participante
- 37: Respostas aos critérios por participante
- 38: Instrumentos e registros da pesquisa
- 39: Uso de inteligência artificial

## Preparação para o ensaio

Abrir o PPTX no PowerPoint, iniciar o modo de apresentação e testar o vídeo do slide 18. O MP4 avulso permite reproduzir a demonstração em outro player. No PDF, a página do vídeo é uma imagem estática.

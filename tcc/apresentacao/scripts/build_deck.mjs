import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';

import {Presentation, PresentationFile, FileBlob} from '@oai/artifact-tool';

const root=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');
const b=path.join(root,'.build'), out=path.join(root,'dist'), assetDir=path.join(root,'assets');
await fs.mkdir(b,{recursive:true});
const source=process.env.MEMORA_PRESENTATION_SOURCE;
const p=source ? await PresentationFile.importPptx(await FileBlob.load(source)) : Presentation.create({slideSize:{width:1280,height:720}});
const blank=p.layouts.items.find(x=>x.name==='Blank');
p.slides.keep([]);
const C={navy:'#0B2F4F',blue:'#287FB4',body:'#243746',muted:'#526575',light:'#EEF5FA',line:'#CBD9E3',amber:'#FFF0CE',green:'#E4F4EE',white:'#FFFFFF',purple:'#75609A'};
const font='Arial'; let all=[], tables=[]; const nop={style:'solid',fill:'none',width:0};
function txt(s,name,t,x,y,w,h,size=25,bold=false,color=C.body,align='left'){
 const a=s.shapes.add({name,geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:nop});
 a.text=t; a.text.style={fontSize:size,typeface:font,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',insets:0,wrap:'square'};return a;
}
function slide(title,section,sourceNote,notes,seconds=55,hidden=false){
 const s=p.slides.add({layoutId:blank?.id});s.background.fill=C.white;s.hidden=hidden;
 const n=all.length+1;
 txt(s,'section',section.toUpperCase(),64,30,1120,22,14,true,C.blue);
 txt(s,'title',title,64,69,1152,82,title.length>60?37:41,true,C.navy);
 txt(s,'footer','Memora · Engenharia de Computação · CEFET-MG',64,686,930,18,13,false,C.muted);
 txt(s,'page',hidden?'Apoio '+String(n-30).padStart(2,'0'):String(n).padStart(2,'0')+' / 30',1100,686,116,18,13,false,C.muted,'right');
 s.speakerNotes.text=(hidden?'Slide de apoio.':'Tempo sugerido: '+seconds+' segundos.')+'\n\n'+notes+'\n\nFontes: '+sourceNote;
 all.push({n,title,section,sourceNote,notes,seconds:hidden?0:seconds,hidden,id:s.id});return s;
}
function label(s,t,y=636){txt(s,'takeaway',t,64,y,1152,42,23,true,C.navy);}
function para(s,t,x=64,y=170,w=1152,h=90,size=27,color=C.body){return txt(s,'body-'+s.shapes.items.length,t,x,y,w,h,size,false,color);}
function table(s,values,widths,{x=64,y=174,w=1152,h=416,size=23,rowHeights,centerCols=[],highlightRows=[],fills={}}={}){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,values,columnWidths:widths});
 t.styleOptions={headerRow:false,bandedRows:false};
 t.borders.assign({style:'solid',fill:C.line,width:0.7});
 for(let r=0;r<values.length;r++){
  if(rowHeights)t.rows[r].height=rowHeights[r];
  for(let c=0;c<values[0].length;c++){
   let cell=t.getCell(r,c);cell.fill=r===0?C.navy:(highlightRows.includes(r)?'#DAECF8':r%2?C.light:C.white);
   cell.text.style={typeface:font,fontSize:size,bold:r===0||c===0,color:r===0?C.white:C.body,alignment:centerCols.includes(c)?'center':'left',verticalAlignment:'middle',insets:{left:12,right:10,top:8,bottom:8},autoFit:'none'};
   if(fills[r+','+c])cell.fill=fills[r+','+c];
  }
 }
 tables.push(all.length);return t;
}
function pic(s,name,file,x=64,y=158,w=1152,h=490){const target=path.isAbsolute(file)?file:path.join(assetDir,file);return s.images.add({name,blob:new Uint8Array(fsSync.readFileSync(target)),contentType:/\.png$/i.test(target)?'image/png':'image/jpeg',alt:name,fit:'contain',position:{left:x,top:y,width:w,height:h}});}
const art='https://github.com/LuizJr2001/memora-cache-simulator-tcc/blob/c708b2a1dd56a2bf18402dbdc454ef293bb38257/tcc/artigo/';
const gh='https://github.com/LuizJr2001/memora-cache-simulator-tcc';
let s;
// 1
s=slide('','Trabalho de conclusão de curso',art+'main.tex. Identidade visual inspirada na apresentação TutorAndCoder de Antônio José Peixoto Chaves. Logo CEFET-MG extraído do PDF de referência.','Apresento o Memora, resultado do aprimoramento da usabilidade do simulador Beto. O ponto de partida foi uma ferramenta já usada no curso. Meu trabalho ligou necessidades dos estudantes, decisões de interface e observação de uso. Vou percorrer esse caminho e destacar o que construí.',40);
txt(s,'cover-memora','Memora:',64,178,1110,76,60,true,C.navy);
txt(s,'cover-title','aprimoramento de um simulador\npara apoio ao ensino de memória cache',64,259,1130,146,44,true,C.navy);
txt(s,'author','Luiz Carlos dos Santos Júnior',64,475,990,38,28,true,C.body);
txt(s,'advisors','Orientadora: Poliana Aparecida Corrêa de Oliveira\nCoorientadora: Glívia Angélica Rodrigues Barbosa',64,524,1000,72,23,false,C.muted);
txt(s,'date','24 de novembro de 2026',64,625,850,32,23,false,C.body);
pic(s,'Símbolo do CEFET-MG','cefet_logo.png',1070,558,145,100);
// 2
s=slide('Dificuldade de acompanhar um conjunto de acessos','Contexto',art+'main.tex, Introdução e §2.1. Exemplo didático elaborado para esta apresentação.','O conteúdo exige relacionar vários acessos, não apenas identificar um acerto ou uma falta isolada. Neste exemplo, os endereços 0 e 2 disputam a mesma linha. Para explicar o terceiro acesso, precisamos lembrar o que o segundo retirou da cache. Essa passagem do endereço para a mudança de estado é o problema que orientou o trabalho.',65);
para(s,'Um novo endereço pode modificar o estado necessário para interpretar o próximo acesso.',64,162,1140,76,28);
table(s,[['Acesso','Resultado','Estado da linha 0'],['1. Endereço 0','Falta','Recebe o bloco 0'],['2. Endereço 2','Falta com substituição','Bloco 2 ocupa o lugar do bloco 0'],['3. Endereço 0','Falta com substituição','Bloco 0 precisa ser carregado novamente']],[245,360,547],{y:264,h:287,size:25});
para(s,'Exemplo: mapeamento direto, duas linhas e uma célula por bloco.',64,573,1152,40,22,C.muted);
label(s,'Como tornar cada decisão e sua relação com o estado anterior mais claras?');
// 3
s=slide('Objetivos do trabalho','Objetivos',art+'main.tex, Introdução. Síntese dos objetivos centrados no aprimoramento da ferramenta.','O objetivo geral é aprimorar a usabilidade do simulador de memória cache Beto, dando origem ao Memora. Os objetivos específicos que organizam essa entrega são caracterizar as ferramentas existentes, identificar necessidades dos usuários e implementar uma interface que explicite ações e estados. A observação com estudantes aparece adiante como parte do processo de examinar e refinar essa interface.',60);
txt(s,'general-label','Objetivo geral',64,174,1100,36,25,true,C.blue);
para(s,'Aprimorar a usabilidade do simulador de memória cache Beto, dando origem ao Memora.',64,222,1140,90,34);
txt(s,'specific-label','Objetivos específicos',64,353,1100,36,25,true,C.blue);
para(s,'Caracterizar os recursos dos simuladores relacionados.\nIdentificar as necessidades dos usuários do Beto.\nImplementar uma interface que explicite a configuração, a execução e a revisão dos acessos.',64,405,1130,191,28);
// 4
s=slide('Memória cache','Fundamentação teórica',art+'main.tex, §2.1. Patterson e Hennessy (2014).','A cache mantém uma parcela dos dados da memória principal próxima do processador. O uso de blocos explora as localidades temporal e espacial. O mapeamento limita onde cada bloco pode ficar, e a política escolhe uma posição quando é necessário substituir. Na interface, a decomposição do endereço e os metadados precisam tornar essas regras observáveis. Aqui não estou apresentando um modelo novo de cache, mas os conceitos que a ferramenta representa.',70);
para(s,'A cache mantém blocos da memória principal para atender acessos do processador com menor latência.',64,163,1140,80,29);
table(s,[['Conceito','Papel na simulação'],['Mapeamento','Define as linhas ou vias elegíveis para cada bloco'],['Tag, índice e deslocamento','Identificam o bloco, a posição e a célula acessada'],['Acerto e falta','Indicam a presença ou ausência do bloco válido'],['FIFO, LRU e aleatória','Escolhem o bloco substituído quando não há posição livre']],[370,782],{y:265,h:322,size:25});
label(s,'O estudante precisa relacionar endereço, regra aplicada e estado da cache');
// 5
s=slide('Softwares educacionais e usabilidade','Fundamentação teórica',art+'main.tex, §2.2. Godoi e Padovani (2009), Araújo e Freitas (2017), Nielsen (1993), Barbosa e Silva (2010).','Simuladores são softwares educacionais que permitem experimentar configurações e observar processos internos. Para que o estudante explore o conteúdo, precisa entender os campos, reconhecer os controles e interpretar o retorno. Por isso a usabilidade faz parte do problema. Minha investigação observou essas condições de uso e a utilidade percebida, sem aplicar um teste de ganho de aprendizagem.',50);
txt(s,'edu','Simular permite explorar o conteúdo',64,182,1140,49,32,true,C.navy);
para(s,'Variação de parâmetros e observação dos estados internos da cache.',64,240,1130,74,29);
txt(s,'usable','A interface condiciona essa exploração',64,358,1140,49,32,true,C.navy);
para(s,'Campos compreensíveis, controles reconhecíveis e retorno das ações ajudam a acompanhar o fenômeno representado.',64,416,1130,98,29);
label(s,'O foco do Memora é melhorar as condições de interação com a simulação');
// 6
s=slide('Trabalhos relacionados: ferramentas analisadas','Trabalhos relacionados',art+'secoes/desenvolvimento.tex, Tabela 1. Documentação original referenciada no artigo.','Analisei sete ferramentas. A tabela situa o recorte de cada uma: Beto e ParaCache têm acesso web, Ripes e QtMips integram cache e processador, SMPCache aborda multiprocessadores, e Dinero e Cache Simulator trabalham com rastros ou saída textual. Essa caracterização impede tratar quantidade de funcionalidades como uma medida única de qualidade. A escolha depende do que se quer ensinar e da possibilidade de modificar a base.',60);
table(s,[['Ferramenta','Acesso e licença','Finalidade observada'],['Beto','Web, português, MIT','Visualização educacional de memória cache'],['ParaCache','Web gratuito','Cache, memória virtual e escrita'],['Ripes','Aplicação gráfica, MIT','RISC-V e visualização dos estados de cache'],['SMPCache','Windows, acadêmico','Cache em multiprocessadores e coerência'],['Dinero IV','Linha de comando, não comercial','Análise por rastros e cache multinível'],['Cache Simulator','Python, MIT','Cache para MIPS e resultados textuais'],['QtMips','Aplicação gráfica, GPL-3.0','CPU MIPS, pipeline e cache']],[230,390,532],{y:161,h:470,size:22,highlightRows:[1]});
// 7
s=slide('Trabalhos relacionados: recursos de simulação','Trabalhos relacionados',art+'secoes/desenvolvimento.tex, Tabela 2. Recorte de oito recursos, preservando os códigos do artigo.','A matriz compara um recorte dos recursos documentados. Todos os simuladores do recorte representam os mapeamentos clássicos, com suporte parcial identificado no QtMips. O Beto já oferece as políticas necessárias ao trabalho. Outras ferramentas ajudam a identificar recursos como escrita e visibilidade da recência. A análise não é um ranking: um recurso não identificado na documentação não significa incapacidade provada da ferramenta.',65);
table(s,[['Recurso','Beto','Para-\nCache','Ripes','SMP-\nCache','Dinero\nIV','Python','QtMips'],['Três mapeamentos','X','X','X','X','X','X','P'],['FIFO','X','X','P','X','X','—','P'],['LRU','X','X','X','X','X','X','P'],['Aleatória','X','X','P','X','P','—','—'],['Load/store','—','X','X','X','X','P','X'],['Políticas de escrita','—','X','X','X','X','—','P'],['Estado LRU visível','—','—','X','P','—','—','—'],['Histórico por acesso','P','X','X','X','X','X','P']],[312,120,120,120,120,120,120,120],{y:157,h:434,size:21,centerCols:[1,2,3,4,5,6,7]});
para(s,'X: identificado    P: parcial ou a confirmar    —: não identificado',64,615,1152,37,22,C.muted);
// 8
s=slide('Por que o simulador Beto foi escolhido','Escolha da base',art+'main.tex, Introdução; secoes/desenvolvimento.tex, §5.1. Gabriel, Vieira e Martins (2022).','O Beto foi uma escolha adequada à pergunta do trabalho: já era usado em AOC no CEFET, tinha acesso web em português e disponibilizava código com licença MIT. Além disso, já implementava os três mapeamentos e as políticas clássicas para um nível de cache. Isso permitiu concentrar o esforço no aprimoramento da interação, preservando uma base funcional existente.',35);
table(s,[['Critério','Adequação ao projeto'],['Contexto de uso','Estudantes do CEFET-MG já utilizavam o Beto em AOC'],['Acesso','Aplicação web gratuita, em português'],['Possibilidade de evolução','Código disponível com licença MIT'],['Base funcional','Um nível de cache, três mapeamentos e políticas clássicas']],[365,787],{y:179,h:350,size:27});
label(s,'A base existente permitiu concentrar o desenvolvimento na usabilidade',587);
// 9
s=slide('A interface original do simulador Beto','Ponto de partida',art+'figuras/beto_tela.pdf. Captura histórica preservada no artigo, Figura 1.','Esta é a interface original em tamanho maior. Os parâmetros, o detalhamento do endereço e a execução compartilham a mesma tela. O objetivo não é desqualificar a ferramenta: o levantamento mostrou que os estudantes a consideravam útil. O problema era organizar o acesso à informação e tornar decisões e controles mais compreensíveis. Vou mostrar como os estudantes descreveram essas necessidades.',55);
pic(s,'Interface original do simulador Beto','beto.png',64,135,1152,510);
para(s,'Parâmetros, detalhamento do endereço e execução compartilhavam uma tela.',64,645,1152,32,22,C.muted);
// 10
s=slide('Metodologia','Metodologia',art+'secoes/metodologia.tex. Organização apoiada em Macedo (2025) e Chaves (2026).','O processo liga diagnóstico, projeto e verificação. Primeiro caracterizei as ferramentas e consultei estudantes. A inspeção relacionou as dificuldades aos componentes da interface. Depois elaborei protótipos, revisei-os com as docentes e implementei incrementalmente. Por fim, observei tarefas e entrevistei os estudantes para localizar dificuldades e orientar ajustes. A cronologia completa permanece no apoio.',55);
const steps=[['01','Análise comparativa','Caracterizar recursos e selecionar a base'],['02','Levantamento de requisitos','Consultar estudantes e definir prioridades'],['03','Inspeção de usabilidade','Examinar a interface pelas heurísticas de Nielsen'],['04','Prototipação','Representar telas e revisar com docentes'],['05','Implementação','Construir a interface e testar os comportamentos'],['06','Avaliação','Observar tarefas e realizar entrevistas pós-teste']];
steps.forEach((r,i)=>{const x=i<3?64:668;const y=177+(i%3)*154;txt(s,'num'+i,r[0],x,y,65,55,38,true,C.blue);txt(s,'step'+i,r[1],x+83,y,460,48,28,true,C.navy);txt(s,'stepdesc'+i,r[2],x+83,y+53,460,67,24,false,C.body);});
// 11
s=slide('O que os estudantes pediram no Beto','Levantamento de requisitos',art+'secoes/desenvolvimento.tex, §5.2; dados/levantamento-beto.csv.','O questionário recebeu 13 respostas. Doze estudantes declararam familiaridade intermediária ou avançada, e todos atribuíram utilidade 3 ou 4 ao Beto na escala de 1 a 4. Ao mesmo tempo, pediram mais explicação, ajuda e visibilidade do estado. A tabela mostra frequências de escolhas independentes. Pedidos de escrita também surgiram, mas implicariam ampliar o modelo. Priorizei as melhorias de usabilidade dentro do prazo do TCC.',80);
para(s,'13 respondentes. Doze com familiaridade intermediária ou avançada.',64,153,1152,41,25);
table(s,[['Melhoria solicitada','Respostas','Encaminhamento'],['Recência LRU por linha ou via','10 / 13','Explicitar o estado da substituição'],['Ajuda ou documentação','9 / 13','Ajuda contextual, Glossário e manual'],['Dirty bit e políticas de escrita','8 / 13','Continuidade do modelo de simulação'],['Mensagens de erro didáticas','7 / 13','Validação e orientação junto ao campo'],['Explicação dos termos','7 / 13','Descrições e exemplos na interface'],['Leitura e escrita (load/store)','7 / 13','Continuidade do modelo de simulação']],[465,175,512],{y:213,h:384,size:24,centerCols:[1]});
para(s,'Múltipla seleção: as frequências não formam uma ordenação individual de prioridades.',64,623,1152,47,22,C.muted);
// 12
s=slide('Requisitos da inspeção de usabilidade','Inspeção de usabilidade',art+'secoes/inspecao-prototipacao.tex, §5.3 e Tabela 3. Nielsen (1994).','A inspeção heurística é um exame da interface orientado por princípios de usabilidade. Não atribuí severidades numéricas. Relacionei os problemas a ações concretas: prevenir entradas incompatíveis, explicar termos, mostrar os estados e oferecer controle da execução. Ela complementa o levantamento porque aproxima o relato do estudante do componente que pode ser alterado.',65);
para(s,'Inspeção qualitativa orientada pelas heurísticas de Nielsen.',64,153,1152,45,26);
table(s,[['Necessidade identificada','Princípio de usabilidade','Requisito de interface'],['Entradas incompatíveis e retorno insuficiente','Prevenção e recuperação de erros','Validar durante a edição e orientar a correção'],['Campos e termos difíceis de interpretar','Correspondência e ajuda','Agrupar campos e oferecer exemplos contextuais'],['Recência e estados pouco visíveis','Visibilidade do estado','Explicitar decomposição, validade e recência LRU'],['Dificuldade para seguir ou retomar acessos','Controle e reconhecimento','Oferecer avanço, histórico e comparação antes/depois']],[408,347,397],{y:217,h:392,size:24});
// 13
s=slide('Do Beto ao Memora: prioridades do aprimoramento','Definição do escopo',art+'secoes/desenvolvimento.tex, Tabela 4; secoes/implementacao.tex.','A ordem de desenvolvimento acompanhou o fluxo de uso. Uma configuração precisa ser válida antes de produzir resultados interpretáveis. Em seguida, organizei as informações e o apoio. A explicitação dos metadados e a revisão dos acessos completam o acompanhamento. São decisões que preservam o modelo de um nível de cache e respondem ao levantamento e à inspeção.',60);
table(s,[['Prioridade','No Memora'],['1. Configuração válida','Validação durante a edição e mensagens próximas aos campos'],['2. Organização e ajuda','Separação das atividades e explicações no contexto de uso'],['3. Estados explícitos','Endereço decomposto, validade e recência LRU'],['4. Acompanhamento e revisão','Controles da execução, histórico e comparação antes/depois']],[390,762],{y:178,h:372,size:26});
para(s,'O recorte preserva um nível de cache e as políticas já existentes no Beto.',64,590,1152,54,25,C.muted);
// 14
s=slide('Protótipo: separar a configuração','Prototipação e revisão docente',art+'secoes/inspecao-prototipacao.tex, §5.4 e Apêndice B. Captura original do Figma na apresentação anterior.','No Figma, representei os campos, as ajudas, os erros e as etapas de uso antes de implementar os comportamentos. As docentes de Arquitetura de Computadores e IHC revisaram os protótipos. Os comentários levaram a ajustes na navegação, na diferença entre campos e botões e na linguagem das ajudas. A tela mostra a proposta de configuração separada da execução.',55);
pic(s,'Protótipo de configuração elaborado no Figma','prototype_0.png',64,137,1152,478);
para(s,'Revisões docentes orientaram ajustes em navegação, controles e ajuda.',64,627,1152,42,24,C.navy);
// 15
s=slide('Protótipo: explicitar a revisão do acesso','Prototipação e revisão docente',art+'secoes/inspecao-prototipacao.tex, §5.4 e Apêndice B. Recorte da tela de análise do protótipo.','A revisão de uma substituição precisava mostrar qual bloco sai, qual entra e por quê. O protótipo representava Configurar, Simular e Analisar. Na implementação, integrei a comparação à tela Simular, como uma ação do histórico. Assim, a aplicação final tem duas etapas, preservando a consulta antes e depois no próprio contexto do acesso.',60);
pic(s,'Protótipo da comparação antes e depois','prototype_review_focus.png',64,166,1152,430);
para(s,'O protótipo previa três telas. Na aplicação, a revisão integra Simular.',64,627,1152,45,24,C.navy);
// 16
s=slide('Implementação do Memora','Implementação',art+'secoes/implementacao.tex, §6.1. Código em packages/memora/src.','Implementei uma aplicação web estática com HTML, CSS e módulos JavaScript. Separei as regras da cache dos controles e da apresentação. O núcleo valida, decompõe endereços e processa acessos. Os controladores organizam reprodução e revisão. Cada acesso guarda estados antes e depois, permitindo consultar o histórico sem recalcular a simulação ou alterar seus contadores.',55);
para(s,'Aplicação web estática em HTML, CSS e módulos JavaScript.',64,158,1152,45,27);
table(s,[['Parte da aplicação','Responsabilidade'],['Núcleo (src/core)','Validação, decomposição dos endereços e regras de cache'],['Controladores','Preparação, reprodução e seleção do acesso em revisão'],['Interface (src/ui)','Campos, controles, cache, histórico e ajudas']],[390,762],{y:237,h:270,size:26});
label(s,'Cada acesso conserva o estado da cache antes e depois',560);
para(s,'A revisão consulta os registros e preserva os contadores da execução.',64,614,1152,42,24,C.muted);
// 17
s=slide('Organização do desenvolvimento no GitHub','Implementação e acompanhamento',gh+'/blob/main/WORKFLOW.md; captura real de '+gh+'/pulls?q=is%3Apr+is%3Amerged, em 18/11/2026.','Organizei requisitos e tarefas em issues e desenvolvi mudanças em branches curtas. Os pull requests reúnem a implementação, a justificativa e a verificação. A captura mostra entregas efetivamente integradas, incluindo a consolidação das entrevistas, os ajustes da interface e a regressão. O fluxo de trabalho documenta Kanban, mas a página pública não apresenta um Projects vinculado. Por isso esta evidência é a lista real de entregas, não um quadro reconstruído.',45);
pic(s,'Entregas integradas no GitHub','github-prs-focus.jpg',64,156,808,493);
txt(s,'gh-issues','Issues',912,192,280,40,28,true,C.navy);para(s,'Requisitos e critérios de aceitação',912,241,280,95,25);
txt(s,'gh-prs','Pull requests',912,369,280,40,28,true,C.navy);para(s,'Mudanças, revisão e verificações',912,418,280,100,25);
// 18
s=slide('Demonstração do fluxo do Memora','Aplicação', 'Capturas reais da aplicação publicada em 18/11/2026. Cenário LRU definido em packages/memora/browser/reference-scenario.js. Vídeo guiado com mudanças de foco, sem narração gravada.','Reproduzir o vídeo guiado de 2 minutos e 30 segundos. Comentar: configuração e validação; exemplo associativo com duas vias e LRU; uma falta inicial e o acerto seguinte; conclusão dos 21 acessos; revisão do acesso 20, que troca 992–1007 por 3040–3055; retorno ao estado atual; alteração do mapeamento e da divisão do endereço. O vídeo usa capturas reais com pausas para explicação. As telas estáticas estão nos slides de apoio.',150);
pic(s,'video-poster','video-poster.png',0,0,1280,720);
// 19
s=slide('Avaliação exploratória com estudantes','Avaliação',art+'secoes/avaliacao.tex, §§7.1–7.2 e Apêndice C. Barbosa e Silva (2010).','Sete estudantes de Engenharia de Computação participaram de entrevistas individuais, todos no primeiro uso do Memora. Cinco conheciam o Beto. O procedimento combinou observação de quatro tarefas e entrevista pós-teste. As tarefas percorrem configuração, execução e revisão, mudança de mapeamento e alteração da memória principal. A amostra foi por conveniência e as sete entrevistas compõem um único ciclo exploratório.',70);
para(s,'7 estudantes. Primeiro uso do Memora. Cinco já conheciam o Beto.',64,151,1152,45,27);
table(s,[['Tarefa','Objetivo observado'],['T1. Configuração e ajuda','Carregar o exemplo, seguir a ficha A e localizar uma explicação'],['T2. Execução e histórico','Acompanhar acessos, revisar uma substituição e conferir os totais'],['T3. Mudança de mapeamento','Reconfigurar com a ficha B e observar as diferenças'],['T4. Memória principal','Aplicar a ficha C e observar a divisão do endereço']],[380,772],{y:219,h:370,size:25});
para(s,'Observação das tarefas e entrevista pós-teste. Amostra por conveniência.',64,623,1152,40,23,C.muted);
// 20
s=slide('Resultados das tarefas','Resultados',art+'secoes/avaliacao.tex, §7.3.1 e Figura 14; dados/conclusao-tarefas.csv.','A tabela resume as evidências registradas nas sete fichas. C é conclusão registrada. R inclui dificuldade, orientação operacional ou variação da instrução. I é registro insuficiente para confirmar a conclusão integral. T3 reúne mais conclusões registradas sem ressalva. T2 concentra ressalvas e lacunas, especialmente na descoberta da revisão. Ressalvas em T1 também incluem problemas de condução do enunciado. Não são taxas padronizadas de sucesso autônomo.',90);
table(s,[['Tarefa','C','R','I'],['T1. Configuração e ajuda','2','5','0'],['T2. Execução e consulta ao histórico','1','4','2'],['T3. Mudança de mapeamento','5','2','0'],['T4. Memória principal e divisão do endereço','2','4','1']],[714,146,146,146],{y:176,h:333,size:26,centerCols:[1,2,3],highlightRows:[2]});
para(s,'C: conclusão registrada. R: conclusão com ressalva documentada.\nI: registro insuficiente para confirmar a conclusão integral.',64,545,1152,75,24);
para(s,'R inclui orientação e variação do roteiro. I não equivale a insucesso.',64,637,1152,36,23,C.muted);
// 21
s=slide('Maiores dificuldades observadas','Resultados das tarefas',art+'secoes/avaliacao.tex, §7.3.1; fichas P02, P03, P05 e P06.','As principais dificuldades se relacionaram à revisão e ao controle. P02 e P03 não reconheceram o marcador circular como uma ação. P05 reconheceu Analisar, mas considerou rápida a reprodução. P06 valorizou as explicações e precisou de ajuda para retornar ao estado atual. T2 exigia realizar várias ações, então destaquei esses episódios em vez de atribuir todo o resultado a uma única causa.',70);
table(s,[['Participantes','Episódio observado','Implicação para a interface'],['P02 e P03','Marcador circular do histórico não reconhecido como botão','Explicitar a ação de revisar o acesso'],['P05','Dificuldade para ler as etapas no ritmo da reprodução','Oferecer ritmos mais lentos'],['P06','Pediu ajuda para voltar ao estado atual','Dar destaque ao comando de retorno']],[220,502,430],{y:181,h:336,size:26});
label(s,'T2 exigia executar, encontrar um evento anterior e interpretar a comparação',562);
para(s,'As fichas também registram intervenções e variações de condução.',64,625,1152,40,23,C.muted);
// 22
s=slide('Resultados da entrevista pós-teste','Resultados das entrevistas',art+'secoes/avaliacao.tex, §7.3.2 e Figura 15; dados/avaliacao-rapida.csv.','A entrevista incluiu quatro critérios. A tabela usa sete participantes como denominador e preserva respostas sem código. Cinco registraram atende completamente para controles, clareza e visualização. Em satisfação são quatro códigos, porque P07 respondeu Muito positiva em texto. P02 e P03 têm respostas textuais nos quatro critérios. Não converti esses textos em notas nem interpretei a ausência de código como uma avaliação negativa.',80);
table(s,[['Critério','Atende completamente','Sem código registrado'],['C1. Facilidade de começar e usar controles','5 / 7 (71,4%)','2 / 7 (28,6%)'],['C2. Clareza das informações','5 / 7 (71,4%)','2 / 7 (28,6%)'],['C3. Visualização de mapeamentos e parâmetros','5 / 7 (71,4%)','2 / 7 (28,6%)'],['C4. Satisfação','4 / 7 (57,1%)','3 / 7 (42,9%)']],[610,271,271],{y:176,h:353,size:24,centerCols:[1,2]});
para(s,'P07 respondeu “Muito positiva” em satisfação, sem marcar uma alternativa.\nRespostas qualitativas permanecem como texto.',64,565,1152,76,24);
para(s,'Não houve códigos de atendimento parcial, não atendimento ou impossibilidade de avaliar.',64,647,1152,30,20,C.muted);
// 23
s=slide('O que as entrevistas ajudam a interpretar','Resultados das entrevistas',art+'secoes/avaliacao.tex, §7.3.2; citações literais das fichas P01, P05 e P07.','As falas complementam a tabela. A avaliação geral favorável não elimina um problema específico de controle, como o ritmo. A comparação com o Beto expressa a lembrança de uso anterior, e a fala de P07 expressa utilidade percebida para revisão. A evidência permite valorizar a organização e as explicações, mantendo a distinção entre percepção de apoio e aprendizagem medida.',70);
table(s,[['Tema','Evidência da entrevista','Interpretação'],['Organização','P01: “é bem intuitivo e melhor que o Beto”','Comparação retrospectiva com a ferramenta conhecida'],['Ritmo de leitura','P05: “no dois ele ainda é muito rápido”','Percepção favorável coexistiu com dificuldade de controle'],['Revisão de conteúdo','P07: “só com esse simulador eu consigo relembrar o conteúdo sabe”','Utilidade percebida para retomar conceitos']],[245,510,397],{y:182,h:365,size:25});
label(s,'As entrevistas explicam episódios que a síntese numérica não distingue',592);
// 24
s=slide('Ajustes realizados a partir das entrevistas','Refinamento da aplicação',art+'secoes/avaliacao.tex, §7.4 e Tabela 6. PRs #71, #87, #95 e #99.','Os achados viraram alterações concretas. Troquei a ação pouco reconhecida por Analisar com identificação do acesso. Simplifiquei os controles, destaquei o retorno à cache atual e acrescentei ritmos mais lentos. Também incluí o editor opcional de endereços e a ajuda próxima ao mapeamento. Essas mudanças estão implementadas. A reobservação é uma continuidade específica para verificar a descoberta após os ajustes.',75);
table(s,[['Observação nas entrevistas','Alteração implementada'],['P02/P03: dificuldade para abrir um acesso','Botão textual Analisar associado ao número do acesso'],['P02: dúvida entre Parar e Pausar','Simplificação dos comandos e estados de reprodução'],['P06: dificuldade para retornar','Voltar ao estado atual no cabeçalho da cache'],['P05: reprodução rápida','Velocidade mínima de 0,25 passo ou acesso por segundo'],['P05: edição dos endereços','Editor opcional por endereço, com validação'],['P06: explicação dos mapeamentos','Ajuda próxima ao seletor de mapeamento']],[520,632],{y:162,h:446,size:24});
para(s,'A reobservação com estudantes permitirá examinar o efeito dos ajustes.',64,633,1152,39,23,C.muted);
// 25
s=slide('Alcance da avaliação','Discussão dos resultados',art+'main.tex, §8; secoes/avaliacao.tex, §§7.1 e 7.4.','O resultado é um conjunto de evidências de uso e de decisões de interface. As sete entrevistas ajudam a localizar dificuldades e compreender o apoio percebido. A amostra e as intervenções limitam a generalização. As apreciações do Beto são retrospectivas, pois não houve tarefas equivalentes nas duas ferramentas. A avaliação não foi desenhada para medir ganho de aprendizagem. Essa delimitação sustenta a contribuição sem prometer um resultado que não foi observado.',55);
table(s,[['Evidências produzidas','Condições de interpretação'],['Uso da configuração, execução e revisão','Sete estudantes de um curso, por conveniência'],['Dificuldades de navegação e controle','Intervenções e variações de roteiro registradas nas fichas'],['Apreciações sobre organização e explicações','Comparação com o Beto apoiada na experiência anterior'],['Utilidade percebida para revisar o conteúdo','Ganho de aprendizagem exige um protocolo próprio']],[565,587],{y:178,h:361,size:26});
label(s,'As evidências orientam melhorias de interface e sua continuidade',594);
// 26
s=slide('Verificação técnica da aplicação após os ajustes','Verificação técnica',gh+'/blob/main/docs/verificacoes/CONSOLIDACAO-17-11.md; PR #108; workflows 44191343998 e 44192004741.','Depois dos ajustes, as verificações técnicas cobriram as regras e as interações. O registro de 17 de novembro informa 81 testes Node e 101 cenários Playwright aprovados. Uma falha real de layout em 801 por 720 foi identificada e corrigida antes da regressão integral. Esses resultados são posteriores à redação do artigo, que registrava a suíte anterior. Testes funcionais não substituem a reobservação com usuários.',55);
table(s,[['Verificação','Resultado registrado em 17/11'],['Regras e controladores (Node)','81 de 81 testes aprovados'],['Interações e layout (Playwright)','101 de 101 cenários aprovados'],['Publicação','Aplicação disponível no GitHub Pages'],['Regressão de layout','Correção e nova verificação em 801 × 720']],[530,622],{y:182,h:340,size:28});
para(s,'Suíte atualizada após a redação do artigo, que registrava 78 testes Node e 94 cenários Chromium.',64,562,1152,77,24);
label(s,'Verificação funcional complementa a avaliação com estudantes',637);
// 27
s=slide('Contribuições do trabalho','Conclusão',art+'main.tex, §9 e seções de desenvolvimento e avaliação.','A principal entrega é o Memora: uma evolução web livre do Beto, com configuração validada, ajuda contextual, controle de execução e comparação por acesso. A segunda contribuição é ligar as necessidades dos usuários às decisões de projeto e aos resultados observados. O trabalho também deixa instrumentos, fichas anonimizadas e manual para continuidade. Novos estudantes podem reobservar os ajustes e ampliar o modelo sem reconstruir essa base.',70);
txt(s,'contrib-1','Uma ferramenta disponível para uso',64,174,1152,49,34,true,C.navy);
para(s,'Simulador web livre, em português, com configuração validada, ajuda contextual e revisão dos estados da cache.',64,237,1140,91,29);
txt(s,'contrib-2','Um processo documentado de aprimoramento',64,369,1152,49,34,true,C.navy);
para(s,'Levantamento, inspeção, protótipos, implementação e sete entrevistas relacionam problemas de uso a decisões de interface.',64,432,1140,100,29);
para(s,'Continuidade: reobservar os ajustes e ampliar o modelo com escrita e múltiplos níveis.',64,607,1152,66,23,C.muted);
// 28
s=slide('Experiências e desafios do desenvolvimento','Relato do trabalho',art+'secoes/inspecao-prototipacao.tex; secoes/implementacao.tex; secoes/avaliacao.tex; documentação do desenvolvimento.','O desafio foi transformar conceitos de cache em estados visuais e ações compreensíveis. O protótipo permitiu discutir essas decisões com as docentes antes da implementação completa. No desenvolvimento, precisei manter coerência entre regras, controles e histórico. Nas entrevistas, aprendi a distinguir dificuldades do conteúdo, problemas de interação e efeitos da condução. Esse percurso conecta o que construí ao que observei durante o uso.',50);
table(s,[['Desafio','Resposta desenvolvida no trabalho'],['Representar estados e decisões da cache','Protótipos discutidos com docentes e refinados antes da versão final'],['Construir a interface sem perder coerência funcional','Separação das regras, controladores e apresentação'],['Interpretar as entrevistas com rigor','Relação entre episódios, comentários e limites dos registros'],['Manter a evolução verificável','Versionamento, documentação e testes de regressão']],[515,637],{y:183,h:384,size:26});
// 29
s=slide('Referências selecionadas','Referências',art+'referencias.bib.','Estas são as referências centrais para cache, software educacional, inspeção e metodologia. A bibliografia completa está no artigo.',20);
const refs=[
['Patterson e Hennessy (2014)','Computer Organization and Design, 5ª edição.'],
['Gabriel, Vieira e Martins (2022)','Beto, o simulador de memória cache. XI CBIE.'],
['Brais, Kalayappan e Panda (2020)','A Survey of Cache Simulators. ACM Computing Surveys.'],
['Godoi e Padovani (2009)','Avaliação de material didático digital centrada no usuário.'],
['Nielsen (1993; 1994)','Usability Engineering; 10 Usability Heuristics.'],
['Barbosa e Silva (2010)','Interação Humano-Computador.'],
['Macedo (2025); Chaves (2026)','TCCs MedSimples e TutorAndCoder. CEFET-MG.']];
refs.forEach((r,i)=>{let y=162+i*70;txt(s,'ref-'+i,r[0],64,y,1152,30,25,true,C.navy);txt(s,'refdesc-'+i,r[1],64,y+32,1152,28,22,false,C.muted);});
// 30
s=slide('','Agradecimentos',gh+'; aplicação publicada em https://luizjr2001.github.io/memora-cache-simulator-tcc/.','Agradeço à orientação, à coorientação, aos estudantes participantes, aos autores do Beto e à banca. Encerro reforçando a entrega: um simulador aprimorado e um percurso documentado que liga necessidades, interface e avaliação de uso.',15);
txt(s,'thanks','Obrigado pela atenção',64,238,1140,90,61,true,C.navy);
txt(s,'thanks-author','Luiz Carlos dos Santos Júnior',64,368,1140,45,31,true,C.body);
txt(s,'thanks-links','Simulador e repositório',64,482,1140,41,26,true,C.blue);
let l1=txt(s,'simulator-link','Abrir o Memora',64,540,610,39,27,false,C.blue);l1.hyperlink={uri:'https://luizjr2001.github.io/memora-cache-simulator-tcc/',isExternal:true};
let l2=txt(s,'repo-link','Consultar o projeto no GitHub',64,598,850,39,27,false,C.blue);l2.hyperlink={uri:gh,isExternal:true};
// SUPPORT
s=slide('Cronologia do projeto','Apoio',gh+'/blob/main/docs/historico-desenvolvimento.md; issue #22.','Consultar se houver perguntas sobre datas. As datas descrevem registros de trabalho, não etapas de avaliação independentes.',0,true);
table(s,[['Período','Marco'],['20/05 a 17/06','Questionário sobre o Beto'],['23 a 25/09','Primeiro protótipo e adoção do nome Memora'],['02/10','Revisão da interface com as docentes'],['12 a 14/10','Núcleo, telas e primeira publicação'],['23/10','Integração da revisão à etapa Simular'],['28–29/10 e 05/11','Sete entrevistas com estudantes, em um ciclo'],['09 a 17/11','Consolidação, ajustes, revisão do artigo e regressão']],[290,862],{y:161,h:470,size:24});
s=slide('Memora: configurar um cenário','Apoio', 'Captura da versão publicada em 18/11/2026.','Mostrar os parâmetros, a sequência, a validação e a decomposição. Há também exemplo didático, editor opcional e ajuda contextual.',0,true);
pic(s,'Tela atual de configuração','demo-04.jpg',48,142,1184,520);
s=slide('Memora: acompanhar a simulação','Apoio','Captura da versão publicada em 18/11/2026.','Explicar a execução, a decomposição do endereço, os estados da cache e o histórico. A imagem mostra o segundo acesso, um acerto após a primeira falta.',0,true);
pic(s,'Tela atual de simulação','demo-07.jpg',48,142,1184,520);
s=slide('Memora: revisar uma substituição','Apoio','Capturas da versão publicada em 18/11/2026.','No acesso 20, a tag 11 não está presente no conjunto 14. A política LRU seleciona a via 1, com o bloco 992–1007, e carrega 3040–3055. A revisão preserva as estatísticas da execução.',0,true);
pic(s,'Comparação antes e depois do acesso 20','demo-10.jpg',48,142,1184,520);
s=slide('Cenário da demonstração LRU','Apoio',gh+'/blob/main/packages/memora/browser/reference-scenario.js; src/core/configuration.js e addresses.js.','Cenário reproduzível usado no vídeo. O acesso 3044 provoca uma substituição na via 1 do conjunto 14.',0,true);
table(s,[['Parâmetro','Valor'],['Memória principal / bloco','4096 células / 16 células por bloco'],['Cache / mapeamento','32 linhas / por conjunto, duas vias, LRU'],['Tag / conjunto / deslocamento','4 bits / 4 bits / 4 bits'],['Resultado de 21 acessos','12 acertos, 9 faltas, 57,1% de acerto'],['Substituição no acesso 20','Sai 992–1007; entra 3040–3055 na via 1']],[474,678],{y:170,h:365,size:25});
para(s,'Sequência: 0, 1, 16, 17, 32, 33, 48, 49, 64, 65, 992, 993, 2016, 2017, 2, 18, 34, 994, 2018, 3044, 96',64,573,1152,90,23);
s=slide('Realização das tarefas por participante','Apoio',art+'dados/conclusao-tarefas.csv; secoes/avaliacao.tex, §7.3.1.','Cada célula reproduz a classificação retrospectiva baseada na evidência documental. C não é medida padronizada de autonomia e I não significa tarefa não concluída.',0,true);
const mt=[['Participante','T1','T2','T3','T4'],['P01','R','C','C','C'],['P02','C','I','C','I'],['P03','R','R','R','R'],['P04','R','R','C','R'],['P05','R','R','C','C'],['P06','C','I','R','R'],['P07','R','R','C','R']];
const fills={};mt.slice(1).forEach((r,i)=>r.slice(1).forEach((v,j)=>fills[(i+1)+','+(j+1)]=v==='C'?C.green:v==='R'?C.amber:C.light));
table(s,mt,[400,188,188,188,188],{y:160,h:418,size:26,centerCols:[1,2,3,4],fills});
para(s,'C: conclusão registrada. R: ressalva documentada. I: registro insuficiente.',64,615,1152,42,23);
s=slide('Respostas aos critérios por participante','Apoio',art+'dados/avaliacao-rapida.csv; secoes/avaliacao.tex, §7.3.2.','C significa atende completamente. SR indica ausência de alternativa codificada, não uma alternativa da escala. P02 e P03 responderam em texto. P07 respondeu qualitativamente ao critério de satisfação.',0,true);
table(s,[['Participante','C1','C2','C3','C4'],['P01','C','C','C','C'],['P02','SR','SR','SR','SR'],['P03','SR','SR','SR','SR'],['P04','C','C','C','C'],['P05','C','C','C','C'],['P06','C','C','C','C'],['P07','C','C','C','SR']],[400,188,188,188,188],{y:160,h:418,size:26,centerCols:[1,2,3,4]});
para(s,'C1: controles. C2: clareza. C3: visualização. C4: satisfação.',64,607,1152,38,23);
s=slide('Instrumentos e registros da pesquisa','Apoio',art+'main.tex, Apêndices A–D; research/survey-2026 e research/evaluation-2026.','O material de pesquisa está organizado em apêndices e no repositório. As fichas individuais usam códigos P01 a P07 para preservar a identificação dos estudantes.',0,true);
table(s,[['Material','Conteúdo'],['Apêndice A','Questionário sobre o Beto e dados anonimizados de 13 respostas'],['Apêndice B','Protótipos e estados discutidos com as docentes'],['Apêndice C','Quatro tarefas, fichas A/B/C e perguntas da entrevista pós-teste'],['Apêndice D','Manual visual de configuração, execução e revisão'],['Repositório','Sete fichas anonimizadas da avaliação do Memora']],[350,802],{y:178,h:394,size:26});
s=slide('Uso de inteligência artificial','Apoio',art+'main.tex, Agradecimentos.','Conforme declarado no artigo, ChatGPT e Codex apoiaram a organização e revisão do texto, a implementação e revisão do código, a documentação e as verificações técnicas. A seleção de sugestões, a interpretação dos dados e a responsabilidade pelo trabalho permanecem com o autor. Não atribuir às ferramentas a participação em entrevistas nem a geração de evidências empíricas.',0,true);
para(s,'ChatGPT e Codex apoiaram a organização e revisão do texto, a implementação e revisão de código, a documentação e as verificações técnicas.',64,190,1140,150,32);
txt(s,'responsibility','Responsabilidade do autor',64,408,1140,47,32,true,C.navy);
para(s,'Seleção das sugestões, interpretação dos dados e responsabilidade pelo conteúdo e pelos resultados apresentados.',64,475,1140,123,29);
const timeAdjustments={2:-5,4:-10,6:-5,7:-10,11:-5,20:-10};
for(const item of all){if(timeAdjustments[item.n]){const old=item.seconds;item.seconds+=timeAdjustments[item.n];p.slides.items[item.n-1].speakerNotes.text=p.slides.items[item.n-1].speakerNotes.text.replace('Tempo sugerido: '+old+' segundos.','Tempo sugerido: '+item.seconds+' segundos.');}}
await fs.mkdir(out,{recursive:true});await fs.mkdir(path.join(b,'renders'),{recursive:true});
await fs.writeFile(path.join(b,'slide_manifest.json'),JSON.stringify(all,null,2));
await fs.writeFile(path.join(b,'deck.proto.json'),JSON.stringify(p.toProto()));
await (await PresentationFile.exportPptx(p)).save(path.join(b,'draft.pptx'));
console.log('BUILT',all.length,'MAIN',all.filter(x=>!x.hidden).length,'SECONDS',all.reduce((a,x)=>a+x.seconds,0));
for(let i=0;i<p.slides.items.length;i++){
 const slide=p.slides.items[i];
 const png=await p.export({slide,format:'png',scale:1});
 await fs.writeFile(path.join(b,'renders',String(i+1).padStart(2,'0')+'.png'),new Uint8Array(await png.arrayBuffer()));
 const lay=await slide.export({format:'layout'});await fs.writeFile(path.join(b,'renders',String(i+1).padStart(2,'0')+'.json'),await lay.text());
}
console.log('RENDERED');
await fs.writeFile(path.join(b,'table_owners.json'),JSON.stringify(tables));


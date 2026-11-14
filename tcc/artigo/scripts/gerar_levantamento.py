"""Regenera os seis gráficos do levantamento anonimizado (13 respostas)."""

from pathlib import Path
import csv, textwrap
from collections import Counter
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

ARTICLE=Path(__file__).resolve().parents[1]
DATA=ARTICLE/'dados'
FIG=ARTICLE/'figuras'
with (DATA/'levantamento-beto.csv').open(encoding='utf-8-sig', newline='') as f:
    reader=csv.DictReader(f); columns=reader.fieldnames; rows=list(reader)
assert len(rows)==13
N=len(rows)
OPTIONS={
 'configuracao': [
 'Entender o significado dos campos de configuração','Saber quais valores eram válidos para os campos','Escolher o tipo de mapeamento','Escolher a política de substituição','Entender a relação entre memória principal, bloco e linhas de cache','Identificar quais campos precisavam ser preenchidos antes de iniciar a simulação','Campos desalinhados ou visualmente confusos','Falta de mensagens de erro claras quando algum valor estava incorreto','Não encontrei dificuldades nessa etapa'],
 'informacoes': [
 'Campo de tag do endereço','Índice ou conjunto acessado','Deslocamento dentro do bloco','Indicação mais clara de acerto (hit) ou falta (miss)','Linha ou via escolhida na cache','Motivo da substituição realizada','Valor ou estado LRU de cada linha ou via','Bit de validade','Dirty bit/bit de sujeira','Histórico passo a passo dos acessos realizados','Estatísticas finais, como quantidade de hits, misses e taxa de acerto','Não senti falta de informações nessa etapa'],
 'usabilidade': [
 'Falta de feedback após executar uma ação','Mensagens pouco claras','Termos técnicos sem explicação suficiente','Dificuldade para encontrar botões ou controles','Dificuldade para corrigir um erro durante a configuração ou execução','Inconsistência visual entre telas/campos','Excesso de informação na tela','Desalinhamento de campos ou rótulos','Falta de ajuda, instruções ou documentação dentro da interface','Não percebi problemas de usabilidade'],
 'prioridades': [
 'Melhorar a validação de entradas antes de iniciar a simulação','Apresentar mensagens de erro mais claras e didáticas','Reorganizar visualmente os campos de configuração','Explicar melhor os termos técnicos usados na interface','Mostrar a decomposição do endereço em tag, índice/conjunto e deslocamento','Exibir uma tabela de histórico com cada acesso executado','Mostrar de forma mais clara quando ocorreu hit ou miss','Mostrar a linha ou via escolhida em cada acesso','Exibir o valor ou estado LRU de cada linha ou via','Exibir o bit de validade','Incluir suporte a operações de leitura e escrita (load/store)','Incluir suporte a dirty bit e políticas de escrita','Apresentar estatísticas finais da simulação, como hits, misses e taxa de acerto','Disponibilizar exemplos prontos de simulação','Melhorar a ajuda ou documentação dentro da própria interface']}
SHORT={
 'configuracao':['Significado dos campos','Valores válidos dos campos','Escolha do mapeamento','Escolha da política de substituição','Relação entre memória, blocos e linhas','Campos necessários para começar','Campos desalinhados ou confusos','Mensagens de erro pouco claras','Sem dificuldades','Outro: parâmetros incompatíveis'],
 'informacoes':['Tag do endereço','Índice ou conjunto','Deslocamento no bloco','Indicação de acerto ou falta','Linha ou via escolhida','Motivo da substituição','Recência LRU por linha ou via','Bit de validade','Bit de modificação (dirty bit)','Histórico passo a passo','Estatísticas finais','Sem informações ausentes'],
 'usabilidade':['Retorno após as ações','Mensagens pouco claras','Termos sem explicação','Localização dos controles','Correção de erros','Inconsistência entre telas/campos','Excesso de informação','Desalinhamento de campos','Ausência de ajuda ou documentação','Sem problemas percebidos'],
 'prioridades':['Validação das entradas','Mensagens de erro didáticas','Organização dos campos','Explicação dos termos','Decomposição do endereço','Histórico por acesso','Indicação de acerto ou falta','Linha ou via escolhida','Recência LRU por linha ou via','Bit de validade','Leitura e escrita (load/store)','Dirty bit e políticas de escrita','Estatísticas finais','Exemplos prontos','Ajuda ou documentação']}
results={}
for name, col in [('configuracao',4),('informacoes',5),('usabilidade',6),('prioridades',7)]:
    counter=Counter(x.strip() for row in rows for x in row[columns[col]].split(';') if x.strip())
    unknown=set(counter)-set(OPTIONS[name])
    if name=='configuracao':
        assert len(unknown)==1
        extra=next(iter(unknown)); opts=OPTIONS[name]+[extra]
    else:
        assert not unknown, (name,unknown)
        opts=OPTIONS[name]
    results[name]=[{'option':x,'short':SHORT[name][i],'n':counter[x],'pct':counter[x]*100/N} for i,x in enumerate(opts)]

plt.rcParams.update({'font.family':'DejaVu Sans','font.size':9,'axes.spines.top':False,'axes.spines.right':False,'axes.spines.left':False,'axes.labelcolor':'#334155','text.color':'#1e293b','pdf.fonttype':42,'ps.fonttype':42})
PURPLE='#75609A'; GRAY='#9AA4B2'
def fmt(n):return f'{n} ({100*n/N:.1f}%)'.replace('.',',')
def bars(name, filename):
    values=results[name];h=max(2.6,len(values)*0.30+0.65)
    fig,ax=plt.subplots(figsize=(6.3,h))
    ys=np.arange(len(values));pcts=[v['pct'] for v in values]
    ax.barh(ys,pcts,color=PURPLE,height=.61)
    ax.set_yticks(ys,[textwrap.fill(v['short'],32) for v in values]);ax.invert_yaxis();ax.tick_params(axis='y',length=0,labelsize=9)
    ax.set_xlim(0,100);ax.set_xticks([0,25,50,75,100]);ax.set_xlabel('Participantes (%)');ax.xaxis.grid(True,color='#e2e8f0',linewidth=.6);ax.set_axisbelow(True)
    for y,v in zip(ys,values):ax.text(v['pct']+1.3,y,fmt(v['n']),va='center',fontsize=8.5)
    fig.subplots_adjust(left=.39,right=.97,top=.98,bottom=.15 if h<3.2 else .11)
    fig.savefig(FIG/filename,bbox_inches='tight',pad_inches=.05);plt.close(fig)
for name,file in [('configuracao','levantamento-configuracao.pdf'),('informacoes','levantamento-informacoes.pdf'),('usabilidade','levantamento-usabilidade.pdf'),('prioridades','prioridades-beto.pdf')]:bars(name,file)

profile=[('Familiaridade com memória cache',2,['Nenhuma','Básica','Intermediária','Avançada']),('Vínculo com as disciplinas',3,['Cursando somente AOCII','Cursando somente LAOCII','Cursando AOCII e LAOCII','Ex-aluno AOCII e/ou LAOCII'])]
fig,axes=plt.subplots(2,1,figsize=(6.3,3.4))
for ax,(title,col,opts) in zip(axes,profile):
    c=Counter(r[columns[col]] for r in rows);y=np.arange(len(opts));vals=[c[o]*100/N for o in opts]
    ax.barh(y,vals,color=PURPLE,height=.55);ax.set_yticks(y,opts,fontsize=8.5);ax.invert_yaxis();ax.set_xlim(0,100);ax.tick_params(axis='y',length=0);ax.set_xticks([0,25,50,75,100]);ax.xaxis.grid(True,color='#e2e8f0',linewidth=.6);ax.set_axisbelow(True);ax.set_title(title,loc='left',fontsize=9.5,pad=8)
    for yi,o,v in zip(y,opts,vals):ax.text(v+1.5,yi,fmt(c[o]),va='center',fontsize=8.5)
axes[1].set_xlabel('Participantes (%)');fig.subplots_adjust(left=.39,right=.97,top=.94,bottom=.13,hspace=.65);fig.savefig(FIG/'levantamento-perfil.pdf',bbox_inches='tight',pad_inches=.05);plt.close(fig)
utility=Counter(int(r[columns[9]]) for r in rows);assert utility=={3:4,4:9}
fig,ax=plt.subplots(figsize=(6.3,2.25));ax.bar([1,2,3,4],[utility[x]*100/N for x in [1,2,3,4]],color=PURPLE,width=.58);ax.set_ylim(0,100);ax.set_yticks([0,25,50,75,100]);ax.set_ylabel('Participantes (%)');ax.set_xlabel('Valor assinalado na escala de 1 a 4');ax.set_xticks([1,2,3,4]);ax.yaxis.grid(True,color='#e2e8f0',linewidth=.6);ax.set_axisbelow(True)
for x in [1,2,3,4]:ax.text(x,utility[x]*100/N+2,fmt(utility[x]),ha='center',fontsize=9)
fig.tight_layout();fig.savefig(FIG/'levantamento-utilidade.pdf',bbox_inches='tight',pad_inches=.05);plt.close(fig)


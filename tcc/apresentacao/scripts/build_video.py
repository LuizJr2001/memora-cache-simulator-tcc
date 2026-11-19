import json,subprocess,concurrent.futures
from pathlib import Path
project=Path(__file__).resolve().parents[1]
b=project/'assets'
out=project/'dist';out.mkdir(exist_ok=True)
work=project/'.build/video';work.mkdir(parents=True,exist_ok=True)
scenes=[
('demo-01.jpg',7,None,'Configurar','Parâmetros e sequência de endereços em uma etapa própria.'),
('demo-02.jpg',10,[15,165,605,370],'Validar antes de executar','Zero células por bloco gera orientação e impede a execução.'),
('demo-04.jpg',10,None,'Preparar o cenário LRU','4096 células, blocos de 16, 32 linhas e duas vias por conjunto.'),
('demo-04.jpg',8,[18,495,595,394],'Selecionar o mapeamento','Por conjunto, com duas vias e política de substituição LRU.'),
('demo-04.jpg',8,[625,565,715,313],'Conferir a decomposição','O endereço de 12 bits se divide em tag, conjunto e deslocamento.'),
('demo-05.jpg',8,None,'Iniciar o acompanhamento','A cache começa vazia. Os controles permitem avançar um acesso.'),
('demo-06.jpg',10,[20,110,1315,795],'Acesso 1: falta','O endereço 0 carrega o bloco 0–15 em uma via livre.'),
('demo-07.jpg',10,[20,110,1315,795],'Acesso 2: acerto','O endereço 1 pertence ao bloco 0–15, que já está na cache.'),
('demo-08.jpg',8,[15,110,1335,795],'Concluir a sequência','21 acessos: 12 acertos, 9 faltas e taxa de acerto de 57,1%.'),
('demo-09.jpg',10,[883,175,450,450],'Revisar o histórico','Analisar seleciona o acesso 20, sem mudar os totais da execução.'),
('demo-09.jpg',14,[20,496,840,395],'Antes da substituição','A via 1 do conjunto 14 contém 992–1007, o bloco menos recente.'),
('demo-10.jpg',14,[20,496,840,395],'Depois da substituição','O bloco 3040–3055 ocupa a via 1. A via 2 permanece no conjunto.'),
('demo-11.jpg',10,[20,110,1315,795],'Voltar ao estado atual','O retorno destacado permite continuar a consultar a cache final.'),
('demo-12.jpg',13,[625,566,715,313],'Reconfigurar o cenário','Totalmente associativo: 8 bits de tag e nenhum bit de conjunto.'),
('demo-12.jpg',10,None,'Explorar outras configurações','A mudança dos parâmetros atualiza a divisão do endereço antes da execução.')
]
font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
bold='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
def render(item):
 i,(name,dur,crop,title,cap)=item
 stem=f'{i:02}'
 (work/(stem+'-title.txt')).write_text(title)
 (work/(stem+'-cap.txt')).write_text(cap)
 # Screenshots are unchanged evidence, cropped only to focus the relevant component.
 filters=[]
 if crop:filters.append('crop='+':'.join(map(str,[crop[2],crop[3],crop[0],crop[1]])))
 filters += ['scale=1800:850:force_original_aspect_ratio=decrease','pad=1920:1080:(ow-iw)/2:105+(850-ih)/2:color=white',
 f"drawbox=x=0:y=0:w=iw:h=86:color=0x0B2F4F:t=fill",
 f"drawtext=fontfile={bold}:textfile={work/(stem+'-title.txt')}:fontsize=38:fontcolor=white:x=58:y=22",
 f"drawtext=fontfile={font}:text='Memora':fontsize=27:fontcolor=0xBBDCF2:x=w-tw-58:y=30",
 f"drawbox=x=0:y=971:w=iw:h=109:color=0xEEF5FA:t=fill",
 f"drawtext=fontfile={font}:textfile={work/(stem+'-cap.txt')}:fontsize=29:fontcolor=0x0B2F4F:x=(w-tw)/2:y=1008",
 f"fade=t=in:st=0:d=0.22",f"fade=t=out:st={dur-.22}:d=0.22"]
 cmd=['ffmpeg','-y','-loglevel','error','-loop','1','-framerate','12','-i',str(b/name),'-vf',','.join(filters),'-t',str(dur),'-r','24','-c:v','libx264','-preset','veryfast','-tune','stillimage','-crf','23','-pix_fmt','yuv420p','-threads','2',str(work/(stem+'.mp4'))]
 subprocess.run(cmd,check=True)
 return stem
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
 for name in pool.map(render,enumerate(scenes,1)):print('scene',name,flush=True)
(work/'concat.txt').write_text(''.join("file '"+str(work/f'{i:02}.mp4')+"'\n" for i in range(1,len(scenes)+1)))
target=out/'Memora_Demonstracao_2min30.mp4'
subprocess.run(['ffmpeg','-y','-loglevel','error','-f','concat','-safe','0','-i',str(work/'concat.txt'),'-c','copy','-movflags','+faststart',str(target)],check=True)
time=0
def tc(t):
 return f'{int(t)//3600:02}:{int(t)//60%60:02}:{int(t)%60:02},000'
srt=[]
for i,sc in enumerate(scenes,1):
 srt.append(f'{i}\n{tc(time)} --> {tc(time+sc[1])}\n{sc[3]}\n{sc[4]}\n')
 time+=sc[1]
(work/'legendas.srt').write_text('\n'.join(srt))
(work/'cenas.json').write_text(json.dumps([{'imagem':x[0],'segundos':x[1],'recorte':x[2],'titulo':x[3],'legenda':x[4]} for x in scenes],ensure_ascii=False,indent=2))
print('VIDEO',target,'DURATION',time,flush=True)


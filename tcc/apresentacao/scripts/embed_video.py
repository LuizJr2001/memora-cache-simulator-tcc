# Embedding follows Microsoft Learn:
# https://learn.microsoft.com/en-us/office/open-xml/presentation/how-to-add-a-video-to-a-slide-in-a-presentation
import zipfile,hashlib
from pathlib import Path
from lxml import etree as E
root=Path(__file__).resolve().parents[1]
b=root/'.build'; out=root/'dist'
ns={'p':'http://schemas.openxmlformats.org/presentationml/2006/main','a':'http://schemas.openxmlformats.org/drawingml/2006/main','r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships','p14':'http://schemas.microsoft.com/office/powerpoint/2010/main','rel':'http://schemas.openxmlformats.org/package/2006/relationships'}
def tag(k,s):return '{'+ns[k]+'}'+s
with zipfile.ZipFile(b/'draft.pptx') as z: data={i.filename:z.read(i) for i in z.infolist()}
slide=E.fromstring(data['ppt/slides/slide18.xml'])
pic=slide.find('.//p:pic',ns);assert pic is not None
nv=pic.find('p:nvPicPr',ns);cnv=nv.find('p:cNvPr',ns);sid=cnv.get('id');cnv.set('name','Memora_Demonstracao_2min30.mp4')
cnv.insert(0,E.Element(tag('a','hlinkClick'),{'action':'ppaction://media'}))
app=nv.find('p:nvPr',ns)
app.append(E.Element(tag('a','videoFile'),{tag('r','link'):'rIdMemoraVideo'}))
tree=slide.find('p:cSld/p:spTree',ns)
for item in list(tree):
 if item.tag not in {tag('p','nvGrpSpPr'),tag('p','grpSpPr'),tag('p','pic')}:tree.remove(item)
exl=E.SubElement(app,tag('p','extLst'))
ex=E.SubElement(exl,tag('p','ext'),uri='{DAA4B4D4-6D71-4841-9C94-3DE7FCFB9230}')
E.SubElement(ex,tag('p14','media'),{tag('r','embed'):'rIdMemoraMedia'},nsmap={'p14':ns['p14']})
timing=E.SubElement(slide,tag('p','timing'))
tn=E.SubElement(timing,tag('p','tnLst'));par=E.SubElement(tn,tag('p','par'))
ct=E.SubElement(par,tag('p','cTn'),id='1',dur='indefinite',restart='never',nodeType='tmRoot')
child=E.SubElement(ct,tag('p','childTnLst'));video=E.SubElement(child,tag('p','video'),fullScrn='1')
cm=E.SubElement(video,tag('p','cMediaNode'),vol='0',showWhenStopped='1')
ct2=E.SubElement(cm,tag('p','cTn'),id='2',fill='hold',display='0')
st=E.SubElement(ct2,tag('p','stCondLst'));E.SubElement(st,tag('p','cond'),delay='indefinite')
tgt=E.SubElement(cm,tag('p','tgtEl'));E.SubElement(tgt,tag('p','spTgt'),spid=sid)
rels=E.fromstring(data['ppt/slides/_rels/slide18.xml.rels'])
for rid,typ in [('rIdMemoraVideo','http://schemas.openxmlformats.org/officeDocument/2006/relationships/video'),('rIdMemoraMedia','http://schemas.microsoft.com/office/2007/relationships/media')]:
 E.SubElement(rels,tag('rel','Relationship'),Id=rid,Type=typ,Target='../media/memora-demo.mp4')
cts=E.fromstring(data['[Content_Types].xml'])
ctns='http://schemas.openxmlformats.org/package/2006/content-types'
if not any(x.get('Extension')=='mp4' for x in cts):E.SubElement(cts,'{'+ctns+'}Default',Extension='mp4',ContentType='video/mp4')
data['ppt/slides/slide18.xml']=E.tostring(slide,xml_declaration=True,encoding='utf-8')
data['ppt/slides/_rels/slide18.xml.rels']=E.tostring(rels,xml_declaration=True,encoding='utf-8')
data['[Content_Types].xml']=E.tostring(cts,xml_declaration=True,encoding='utf-8')
data['ppt/media/memora-demo.mp4']=(out/'Memora_Demonstracao_2min30.mp4').read_bytes()
with zipfile.ZipFile(b/'multimedia.pptx','w',zipfile.ZIP_DEFLATED) as z:
 for name,content in data.items():z.writestr(name,content)
print('Embedded video SHA256',hashlib.sha256(data['ppt/media/memora-demo.mp4']).hexdigest())


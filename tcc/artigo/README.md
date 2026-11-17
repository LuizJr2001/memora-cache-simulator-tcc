# Artigo Memora — revisão de 16/11/2026

Esta versão incorpora a revisão de Glívia de 16/11 e a transcrição fornecida dos áudios, preservando as orientações anteriores de Poliana. A conciliação e os 100 objetos de anotação estão em [REVISAO-GLIVIA-16-11.md](REVISAO-GLIVIA-16-11.md). A mudança estrutural da fundamentação depende da decisão registrada na [#105](https://github.com/LuizJr2001/memora-cache-simulator-tcc/issues/105). O artigo usa abnTeX2 em modo artigo, recomposto a partir do exemplo de Hugo Barbosa. O autor confirmou esse PDF como o modelo institucional em 14/11; a apresentação foi conferida e ajustada a essa referência.

## Estrutura atual

1. Introdução, fundamentação e descrição dos trabalhos relacionados.
2. Metodologia: diagrama de seis etapas e explicação de cada uma.
3. Definição de escopo e requisitos: comparação e escolha do Beto, levantamento de 13 respostas com todos os resultados, prioridades numeradas, inspeção qualitativa e protótipo revisado por docentes.
4. Implementação: HTML/CSS/JavaScript, organização da aplicação, funcionalidades e verificação técnica em alto nível.
5. Avaliação do Memora: preparação, sete entrevistas individuais de um único ciclo, indicadores de realização das tarefas, entrevista pós-teste, análise e ajustes de interface.
6. Discussão, conclusão, referências, apêndices e anexo.

## Overleaf e compilação

Importe o ZIP como projeto, selecione `main.tex` e use pdfLaTeX com BibTeX. Os arquivos de `secoes/` compõem o artigo e devem ser mantidos no projeto. Em uma instalação TeX Live completa:

```bash
latexmk -pdf -interaction=nonstopmode -halt-on-error main.tex
```

Para regenerar os gráficos com Python e matplotlib:

```bash
python3 scripts/gerar_levantamento.py
python3 scripts/gerar_conclusao_tarefas.py
python3 scripts/gerar_avaliacao_rapida.py
```

Da raiz do repositório, `python3 tcc/empacotar_artigo.py` sincroniza o ZIP, incluindo dados anonimizados, figuras, bibliografia e fontes. Os arquivos auxiliares e o PDF compilado ficam fora do pacote.

## Dados e fontes

O levantamento de requisitos e a avaliação com estudantes têm bases distintas: 13 respostas sobre o Beto e sete entrevistas sobre o Memora. Os tempos e códigos das entrevistas foram preservados. Os rótulos `original`/`complementar` nos CSVs são históricos da consolidação documental, sem representar duas rodadas de teste. Consulte [dados/PROVENIENCIA.md](dados/PROVENIENCIA.md).

As capturas da aplicação são ilustrativas e não representam a tela de cada entrevista. Os ajustes de reprodução, edição e ajuda integrados na evolução da aplicação ainda precisam ser reavaliados com estudantes.

## Conferência editorial

- [Revisão dos novos comentários e áudios](REVISAO-POLIANA-AUDIOS-13-11.md).
- [Conferência anterior das 56 exclusões](REVISAO-POLIANA-13-11.md).
- [Revisão de modelo, questionário e itálicos](REVISAO-14-11.md).
- [Validação desta entrega](VALIDACAO-16-11.md).
- [Validação histórica de 14/11](VALIDACAO-14-11.md).
- [Questionário em branco](instrumentos/questionario-aplicado.pdf) e [enunciados conferidos](instrumentos/questionario-aplicado.json).
- [Validação histórica de 13/11](VALIDACAO-13-11.md).
- [Organização dos apêndices](APENDICES.md) e [composição do modelo](TEMPLATE.md).

As macros `datasubmissao` e `dataaprovacao` só devem receber datas confirmadas pela disciplina.

## Revisão e entrega

O artigo foi encaminhado à Glívia em **15/11** e a resposta com comentários foi recebida em **16/11**, conforme a correspondência conferida. A revisão de 16/11 incorpora esse retorno. O prazo informado para encaminhar à banca continua sendo **18/11/2026**, horário de Brasília. Não foi realizado novo envio nesta execução. A [issue de calendário](https://github.com/LuizJr2001/memora-cache-simulator-tcc/issues/22) acompanha os marcos. A integração das mudanças e a decisão da fundamentação não são apresentadas como aprovação docente.

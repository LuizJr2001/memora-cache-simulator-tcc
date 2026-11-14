# Artigo Memora — revisão de 13/11/2026

Esta versão incorpora o PDF `revPoliana13-11` e as orientações dos seis áudios. O artigo usa abnTeX2 em modo artigo, recomposto a partir do exemplo de Hugo Barbosa. O fonte exato do modelo do Moodle ainda deve ser confrontado com essa apresentação.

## Estrutura atual

1. Introdução, fundamentação e descrição dos trabalhos relacionados.
2. Metodologia: diagrama de seis etapas e explicação de cada uma.
3. Desenvolvimento: comparação e escolha do Beto, levantamento de 13 respostas com todos os resultados, prioridades numeradas, inspeção qualitativa e protótipo revisado por docentes.
4. Implementação: HTML/CSS/JavaScript, organização da aplicação, funcionalidades e verificação técnica em alto nível.
5. Avaliação do Memora: preparação, sete entrevistas individuais de um único ciclo, análise dos resultados e ajustes de interface.
6. Discussão, conclusão, referências, apêndices e anexo.

## Overleaf e compilação

Importe o ZIP como projeto, selecione `main.tex` e use pdfLaTeX com BibTeX. Os arquivos de `secoes/` compõem o artigo e devem ser mantidos no projeto. Em uma instalação TeX Live completa:

```bash
latexmk -pdf -interaction=nonstopmode -halt-on-error main.tex
```

Para regenerar os gráficos com Python e matplotlib:

```bash
python3 scripts/gerar_levantamento.py
python3 scripts/gerar_tempos_tarefas.py
python3 scripts/gerar_avaliacao_rapida.py
```

Da raiz do repositório, `python3 tcc/empacotar_artigo.py` sincroniza o ZIP, incluindo dados anonimizados, figuras, bibliografia e fontes. Os arquivos auxiliares e o PDF compilado ficam fora do pacote.

## Dados e fontes

O levantamento de requisitos e a avaliação com estudantes têm bases distintas: 13 respostas sobre o Beto e sete entrevistas sobre o Memora. Os tempos e códigos das entrevistas foram preservados. Os rótulos `original`/`complementar` nos CSVs são históricos da consolidação documental, sem representar duas rodadas de teste. Consulte [dados/PROVENIENCIA.md](dados/PROVENIENCIA.md).

As capturas da aplicação são ilustrativas e não representam a tela de cada entrevista. Os ajustes de reprodução, edição e ajuda integrados na evolução da aplicação ainda precisam ser reavaliados com estudantes.

## Conferência editorial

- [Revisão dos novos comentários e áudios](REVISAO-POLIANA-AUDIOS-13-11.md).
- [Conferência anterior das 56 exclusões](REVISAO-POLIANA-13-11.md).
- [Validação desta entrega](VALIDACAO-13-11.md).
- [Organização dos apêndices](APENDICES.md) e [composição do modelo](TEMPLATE.md).

As macros `datasubmissao` e `dataaprovacao` só devem receber datas confirmadas pela disciplina.

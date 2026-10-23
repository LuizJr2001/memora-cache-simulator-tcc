# Memora — estado atual da aplicação

Consolidação: **23/10/2026**, após os PRs #60, #61 e #62. Este documento
descreve o código integrado à `main`. O Figma v2, as antigas três telas e os
relatórios datados continuam como registros históricos.

## Fluxo e recursos

1. **Configurar:** valida parâmetros e sequência ao editar, mostra erros junto
   dos campos e prepara uma entrada imutável ao clicar em Iniciar simulação.
   A preparação abre Simular em 0 acessos, sem iniciar a reprodução.
2. **Simular:** mostra cache, células, validade, LRU quando aplicável, histórico,
   decomposição e estatísticas. A comparação antes/depois fica recolhida no
   cartão Memória cache e usa os snapshots do acesso selecionado.

Revisar o histórico ou navegar pela comparação não processa acessos nem altera
os contadores. A vítima Random permanece a mesma do registro original. Acesso
anterior/seguinte percorrem somente acessos concluídos. Abrir a comparação ou
a ajuda pausa a reprodução; retomar recolhe a comparação. Reiniciar ou editar
a configuração limpa a execução anterior. A [decisão 004](decisoes/004-analise-contextual.md)
registra a incorporação da antiga etapa Analisar à simulação.

| Controle/estado | Comportamento atual |
|---|---|
| Iniciar/Continuar/Pausar | Controla a reprodução automática |
| Parar | Só fica habilitado durante reprodução automática; preserva o andamento |
| Reiniciar | Zera cache, histórico e contadores |
| Próximo acesso | Conclui um acesso completo, inclusive se houver microetapa pendente |
| Ir ao final | Conclui os acessos restantes e preserva os registros |
| Etapas detalhadas | Reprodução em seis passos por acesso, com roteiro e explicações |
| Sem detalhamento | Reprodução de um acesso completo por pulso |
| Velocidade | De 1 a 10; inicial 5; passos/segundo ou acessos/segundo conforme o modo |
| Conclusão | Reprodução desabilitada como ✓ Concluído; Progresso verde e finalizado |
| Decimal/Binário | Altera apresentação na simulação e na comparação, sem reexecutar |

O status normal é anunciado a leitores de tela, sem repetir em uma faixa o
que já aparece no histórico. Erros de execução continuam visíveis. Há 16 ajudas
estáticas, com fechamento por Escape e retorno de foco.

## Identidade visual vigente

Todos os botões de ação e ajuda e os links com aparência de botão usam **roxo
preenchido `#75609A` e texto branco `#FFFFFF`**. Hover usa `#655184`, clique e
seleção usam `#56436F`; desabilitados têm menor opacidade. As abas mantêm o
desenho de navegador. Os balões informativos e as ajudas continuam em azul claro;
as cores de acerto, falta e erro não foram alteradas pelos PRs #61/#62.

O contraste calculado branco/roxo é 5,39:1 no estado normal, 6,85:1 no hover e
8,65:1 no ativo. Isso verifica os pares indicados, não a acessibilidade de toda
a aplicação. A nova paleta ainda não recebeu uma inspeção visual em Chromium
nesta sequência de revisões.

## Cenários reproduzíveis

Os cenários abaixo têm parâmetros e sequências diferentes. Os resultados não
devem ser intercambiados na documentação, nas ajudas ou no artigo.

| Parâmetro/resultado | Abertura e Carregar exemplo didático | Referência das ajudas e testes |
|---|---|---|
| Bytes por célula / células / células por bloco | 1 / 4096 / 16 | 1 / 4096 / 16 |
| Linhas / mapeamento / vias | 32 / direto / 1 | 32 / por conjunto / 2 |
| Substituição | Não se aplica; FIFO permanece como preferência do formulário | LRU |
| Bits tag / linha ou conjunto / deslocamento | 3 / 5 / 4 | 4 / 4 / 4 |
| Acessos / acertos / faltas | 21 / 13 / 8 | 21 / 12 / 9 |
| Taxa de acerto / linhas usadas | 61,9% / 3 de 32 | 57,1% / 8 de 32 |

Sequência inicial do Beto, restaurada também pelo botão de exemplo:

```text
0, 1, 6, 7, 8, 9, 992, 993, 994, 481, 482, 0, 1, 2, 996, 224, 225, 2017, 2018, 4064, 996
```

Sequência do cenário associativo/LRU, a configurar explicitamente:

```text
0, 1, 16, 17, 32, 33, 48, 49, 64, 65, 992, 993, 2016, 2017, 2, 18, 34, 994, 2018, 3044, 96
```

No acesso 20 do cenário LRU, a via 1 do conjunto 14 troca o bloco de células
992–1007 (tag 3) por 3040–3055 (tag 11); a via 2 mantém 2016–2031.
Essa situação não descreve o acesso 20 do exemplo direto do Beto.

O endereço identifica uma **célula**, sem multiplicar a quantidade de endereços
por bytes por célula. A cache é esparsa no núcleo; a interface pagina caches
acima de 128 linhas e blocos acima de 16 células. Sequências aceitam até 1000
endereços e 18000 caracteres. Consulte as [APIs e regras](../packages/memora/src/core/README.md).

## Evidências e limites

- **Implementação:** HTML/CSS e módulos ES; núcleo sem DOM, controladores com
  relógio e apresentação por snapshots; publicação estática no GitHub Pages.
- **Suítes atuais:** 78 testes Node e 93 cenários Chromium (46 Configurar,
  32 Simular e 15 comparação). O PR #60 registra a execução completa de Chromium.
- **Cores #61/#62:** sintaxe, 78 testes Node e build aprovados; sem nova execução
  visual em navegador. As capturas históricas não comprovam a nova paleta.
- **Pesquisa:** 13 respostas sobre o Beto, coletadas de maio a junho; ver
  [dados anonimizados](../research/survey-2026/README.md). Esse levantamento não
  é uma avaliação posterior do Memora.
- **Artigo:** [fonte LaTeX e pacote Overleaf](../tcc/README.md) atualizados com
  decisões, implementação e evidências disponíveis até esta data.
- **Pendente:** avaliação do Memora com estudantes, consolidação formal da
  inspeção com severidade, verificação em Firefox/Safari e medição de resultados
  de aprendizagem. Escrita, dirty bit, gráficos, exportação e comparação entre
  configurações permanecem trabalhos futuros.

O [histórico](historico-desenvolvimento.md) mantém a sequência dos marcos e a
origem de cada execução. Mudanças documentais não encerram automaticamente as
issues acadêmicas.

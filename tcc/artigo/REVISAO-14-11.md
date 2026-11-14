# Revisão de 14/11/2026 — modelo, instrumento e itálicos

## Modelo institucional confirmado

O autor identificou expressamente o PDF **TCC___Hugo_Barbosa__Atualizado_-1 (1).pdf** como o modelo institucional desta entrega. Essa confirmação substitui a pendência de identificação registrada em 13/11. A composição continua em abnTeX2, modo artigo, seguindo o PDF fornecido, sem exigir um novo arquivo-fonte para reconhecer a referência indicada pelo autor.

SHA-256 do PDF de referência: `a5ba44920067aacc972cc7c42b649fb5cae4b77e0759bd01be306b89ce23454e`.

Foram conferidos A4, margens nominais de 3 cm superior/esquerda e 2 cm inferior/direita, Latin Modern 12 pt no corpo, títulos principais em maiúsculas, subtítulos sem serifa, autoria centralizada, notas da abertura, RESUMO antes de ABSTRACT e palavras-chave. O recuo foi ajustado para 1,25 cm; a paginação para 12 pt no canto superior direito; as notas de autoria passaram a ter recuo suspenso. A posição e a entrelinha do título foram aproximadas das medidas do PDF de referência.

As datas de submissão e aprovação continuam vazias: os prazos de revisão/envio não equivalem a datas de submissão/aprovação do artigo. A confirmação do modelo pelo autor não é apresentada como aprovação desta versão pelas docentes.

## Instrumento aplicado

Foram localizados os quatro ZIPs do CSV original, todos com as mesmas 13 respostas, e confrontados seus cabeçalhos com o instrumento do Apêndice A. O campo de e-mail foi corrigido para **Insira seu e-mail para registro**; os enunciados de consentimento e da pergunta aberta mantêm a redação do cabeçalho. A escala aplicada 1–4 foi preservada.

Foram adicionados ao projeto um registro estruturado dos dez campos/enunciados e um PDF em branco gerado do próprio Apêndice A. Ambos integram também o pacote Overleaf. Nenhuma resposta identificada foi adicionada. O roteiro preliminar de 16/05, cuja escala era 1–5, não foi utilizado como formulário aplicado.

O PDF em branco é uma reprodução textual com origem documentada. A interface completa e as alternativas nunca selecionadas não podem ser certificadas apenas pelo CSV; a limitação e a distinção entre instrumento e roteiro preliminar estão em `research/survey-2026/QUESTIONARIO-APLICADO.md`. Não se declara recuperada uma captura integral do Google Forms.

## Itálicos

As ocorrências de tag, hit, miss e plurais no Apêndice A receberam itálico, assim como os termos estrangeiros load/store, dirty bit e feedback. Os rótulos de gráficos com termos estrangeiros também foram formatados. As palavras e os dados coletados não foram modificados; capturas históricas de interfaces permanecem imagens de suas fontes.

## Prazos informados pelo autor em 14/11

| Data e horário de Brasília | Entrega ou atividade | Estado |
| --- | --- | --- |
| Até domingo, 15/11, à noite | Encaminhar o artigo final para Glívia | Planejado; envio não realizado nesta revisão |
| Segunda-feira, 16/11, a partir de 08h | Leitura por Glívia | Disponibilidade informada pelo autor |
| Até quarta-feira, 18/11 | Encaminhar o artigo à banca | Prazo informado pelo autor |
| Terça-feira, 24/11, 09h30 | Defesa online | Agendamento anterior preservado na issue de calendário |

As datas são acompanhadas na issue #22. O envio de arquivos às docentes ou à banca não faz parte das ações realizadas neste PR.

## Complemento — navegação nas notas da abertura

Após a integração do PR #103, foram adicionados hiperlinks aos quatro números sobrescritos do título e da autoria. Cada número leva à nota de rodapé correspondente na primeira página, como no modelo indicado. A correção contorna a desativação dos hiperlinks automáticos pelo hyperref durante maketitle usando as marcas de autoria do memoir e destinos nomeados exclusivos. Os links do corpo e o texto do artigo foram preservados.

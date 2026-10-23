# Publicação do Memora no GitHub Pages

O Memora usa hospedagem estática: o GitHub entrega HTML, CSS, JavaScript,
imagens e a fonte local, e a simulação é executada no navegador do visitante.
O computador do desenvolvedor pode ficar desligado após a publicação.

Endereço padrão: https://luizjr2001.github.io/memora-cache-simulator-tcc/

## Publicação realizada

O workflow foi integrado à `main` pelo [PR #47](https://github.com/LuizJr2001/memora-cache-simulator-tcc/pull/47).
A [execução de publicação](https://github.com/LuizJr2001/memora-cache-simulator-tcc/actions/runs/38663768957)
terminou com sucesso na noite de **14/10/2026 em Brasília** — **15/10/2026 em UTC**.
O fluxo atual no endereço acima é Configurar → Simular, com comparação antes/depois no cartão da cache (PR #60). Os passos de ativação a
seguir ficam como referência de configuração. O
[histórico do projeto](historico-desenvolvimento.md) reúne os marcos anteriores.

## Ativação inicial

1. Integre o workflow `.github/workflows/deploy.yml` à `main`.
2. No repositório, acesse **Settings → Pages**.
3. Em **Build and deployment → Source**, selecione **GitHub Actions**.
4. Deixe **Custom domain** vazio para usar o endereço gratuito do GitHub.
5. Em **Actions → Publicar Memora no GitHub Pages**, acompanhe a execução.
   Se a primeira tentativa ocorreu antes de ativar Pages, use **Re-run all jobs**.
   Também é possível iniciar uma publicação em **Run workflow**, escolhendo `main`.
6. Após a etapa de publicação ficar verde, abra o endereço público e confira
   Configurar, Simular e a comparação contextual de um acesso concluído. O domínio `github.io` usa HTTPS.

O workflow usa o `GITHUB_TOKEN` fornecido automaticamente pelo GitHub.
Nenhum token pessoal ou segredo adicional precisa ser cadastrado.

## Atualizações

Cada push ou merge na `main` executa a verificação de sintaxe, os testes Node
e a preparação dos arquivos. A publicação só ocorre quando essas etapas passam.
Pull requests executam as verificações e preparam o site, sem publicar em produção.
Uma execução manual também só publica quando a branch selecionada é `main`.

## Arquivos publicados

Na raiz do repositório, execute:

```bash
npm run build
```

O comando gera `_site/` com o `index.html` do pacote, os arquivos de `src/`
necessários à aplicação, as licenças MIT e OFL e `.nojekyll`.
Os caminhos relativos permitem abrir o site sob o nome do repositório.
`_site/` é gerada novamente a cada execução e não é versionada.

Para conferir a publicação localmente:

```bash
python3 -m http.server 8080 --directory _site
```

Abra http://localhost:8080/ e encerre com `Ctrl+C`.
Esse comando serve apenas para conferência local; a hospedagem pública é o Pages.

O pacote publicado não contém o Beto de `docs/`, o servidor de desenvolvimento,
testes, relatórios, capturas, pesquisa ou materiais do TCC.
O arquivo histórico `docs/CNAME` pertence ao endereço do Beto original e não
é copiado para `_site/`. Ele não deve ser usado como domínio do Memora.

## Diagnóstico

- **Erro na etapa Configurar GitHub Pages:** confira se Source está como
  GitHub Actions em Settings → Pages e execute novamente o workflow.
- **Erro de permissão no deploy:** confira se o job mantém `pages: write`,
  `id-token: write` e o ambiente `github-pages`. Caso haja uma regra de aprovação
  nesse ambiente, conclua a revisão solicitada pelo GitHub.
- **Site antigo após um merge:** confira se os dois jobs da execução mais
  recente na `main` terminaram com sucesso e recarregue o navegador.
- **Domínio próprio no futuro:** configure um domínio que você controla em
  Settings → Pages e no DNS do provedor. O registro do domínio é separado da
  hospedagem, e o domínio do autor do Beto não deve ser reutilizado.

Referências: [workflows para Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
e [HTTPS no Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https).

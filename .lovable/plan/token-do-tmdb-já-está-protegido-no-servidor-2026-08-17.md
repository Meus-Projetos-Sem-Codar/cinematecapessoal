# Token do TMDB: já está protegido no servidor

## Situação atual (verificada agora)

O token **não está exposto no front-end**. Ele já vive apenas no back-end:

- O token é lido de `TMDB_BEARER_TOKEN`, um secret do back-end, dentro do handler da função de servidor (`src/lib/tmdb.functions.ts`).
- Nenhum arquivo do app referencia o token no navegador: não existe variável `VITE_TMDB_*` nem chamada direta a `api.themoviedb.org` no código do cliente.
- O navegador só chama a própria função do servidor do app; é o servidor que chama o TMDB com o cabeçalho de autorização.

Ou seja, o pedido de "mover o token para o back-end" já está atendido pela arquitetura atual. Não há mudança de código necessária.

Observação: neste app o servidor é a função de servidor do próprio TanStack Start (não uma Edge Function separada). O efeito de segurança é o mesmo — e é o padrão recomendado aqui.

## O que eu faço, se você aprovar

Uma verificação prática e um relatório, sem alterar código:

1. Rodar um teste automatizado de navegador na página inicial e no modal "Ver detalhes", capturando **todas** as requisições de rede e cabeçalhos enviados pelo navegador.
2. Confirmar que: nenhuma requisição sai para `api.themoviedb.org` a partir do navegador, e nenhum cabeçalho/corpo/URL contém o token.
3. Conferir também que o token não aparece nos arquivos JavaScript entregues ao navegador (busca no bundle servido).
4. Te entregar o resultado com o passo a passo para você mesma confirmar no DevTools.

## Como você confirma no DevTools (passo a passo)

1. Abra `cinematecapessoal.lovable.app` numa aba normal (não dentro do editor).
2. F12 → aba **Network** → recarregue a página.
3. Filtre por `themoviedb` — não deve aparecer nenhuma requisição. As chamadas de filmes aparecem como requisições para o próprio domínio do app.
4. Clique numa dessas requisições → abas **Headers** e **Payload**: não há `Authorization: Bearer ...` com o token do TMDB.
5. Aba **Sources** (ou Network → filtro JS) → Ctrl+F por um trecho do token: nenhum resultado.

## Detalhes técnicos

- `src/lib/tmdb.functions.ts` usa `createServerFn` com `process.env.TMDB_BEARER_TOKEN` lido dentro de `.handler()` (nunca em escopo de módulo), então o valor nunca entra no bundle do cliente.
- Variáveis sem o prefixo `VITE_` não são expostas ao navegador pelo Vite; o secret está registrado no back-end do projeto.

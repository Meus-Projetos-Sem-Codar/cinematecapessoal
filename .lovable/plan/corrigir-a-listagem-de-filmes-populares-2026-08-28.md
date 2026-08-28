# Corrigir a listagem de filmes populares

## O problema

A página inicial está vazia porque a chamada atual vai para `postman-echo.com`, que é apenas um serviço de teste: ele devolve exatamente o que recebe. Confirmado por teste direto — a resposta traz só `{"name":"CineList","page":1,"language":"pt-BR"}`, sem nenhum filme. Logo, a lista não tem o que exibir.

## A correção

Voltar a buscar os filmes no seu webhook do n8n:

- Endpoint: `https://kamilla.app.n8n.cloud/webhook/tmdb` (POST, `language=pt-BR`, com a página solicitada)
- Manter o envio do `Authorization: Bearer` do usuário logado, como está hoje
- Manter a paginação ("Carregar mais") funcionando com `page`
- Tratar a resposta tanto se vier como objeto quanto como array (o n8n costuma responder em array)
- Se o webhook responder sem filmes, mostrar uma mensagem clara na tela em vez de página em branco

Tudo continua acontecendo no servidor: o navegador não fala com o n8n nem com o TMDB, e nenhum token é exposto.

## Detalhes técnicos

- Arquivo: `src/lib/tmdb.functions.ts`, server function `getPopularMovies`
- Trocar a URL de `https://postman-echo.com/post` para o webhook do n8n, com `language` e `page` na query string
- Normalizar o payload: aceitar `{results,page,total_pages,total_results}` diretamente, dentro de `data`/`json`, ou como primeiro item de um array
- `src/routes/index.tsx`: adicionar estado vazio ("nenhum filme retornado") quando a busca funciona mas vem sem resultados

# Voltar às configurações originais: chamar TMDB direto, sem n8n

## O que vou fazer

1. Em `src/lib/tmdb.functions.ts`, reverter a função `getPopularMovies` para chamar a API do TMDB diretamente:
   - Endpoint: `https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=<pagina>`
   - Autenticação: usar o secret de servidor `TMDB_BEARER_TOKEN` (já configurado e seguro)
   - Remover o encaminhamento do `Authorization` do usuário logado.
   - Manter a paginação e o tratamento da resposta.

2. Remover o requisito de login da função `getPopularMovies`, para que a página inicial (`/`) continue pública — qualquer visitante vê os filmes populares.

3. Manter `getMovieDetails` inalterado, pois ele já chama o TMDB diretamente.

4. Testar:
   - Página inicial carrega a lista de filmes populares.
   - Botão "Carregar mais" traz mais filmes.
   - Nenhuma requisição é feita para `kamilla.app.n8n.cloud`.
   - O token do TMDB não aparece no navegador.

## Resultado esperado

O app volta a buscar filmes diretamente do TMDB pelo servidor, sem depender do n8n, e continua seguro: o token do TMDB permanece só no backend.

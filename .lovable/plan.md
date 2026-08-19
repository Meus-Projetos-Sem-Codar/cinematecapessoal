# Sobre o "GET" que aparece no DevTools e a segurança do token TMDB

## O que você está vendo no DevTools

O `GET` que aparece na inspeção da página **não é a chamada ao seu webhook do n8n**. É a chamada que o navegador faz para o **servidor do próprio app** (endereço que começa com `/_serverFn/...`). Só o servidor conversa com o n8n — o navegador nunca fala com `kamilla.app.n8n.cloud`. Por isso você não vê o "curl" na aba Network: essa parte acontece fora do navegador.

Fluxo atual:

```text
Navegador  --GET /_serverFn/...-->  Servidor do app  --POST--> kamilla.app.n8n.cloud/webhook/tmdb
```

## Verificação que acabei de fazer no webhook

Testei o endereço direto, dos dois jeitos:

- `POST` → responde **200** (funciona, é assim que o app chama hoje)
- `GET` → responde **404** (o webhook não aceita GET)

Ou seja: o seu comando curl, como está escrito (sem `--request POST`), não funcionaria; o app está chamando do jeito certo, com POST, e os filmes estão chegando normalmente (confirmado nos dados de rede: títulos em pt-BR, página 1).

## O token TMDB está seguro?

**Sim, o token do TMDB não está exposto ao usuário.** Ele fica guardado como **secret de runtime** do Lovable Cloud (`TMDB_BEARER_TOKEN`) e só é lido dentro do `.handler()` da server function em `src/lib/tmdb.functions.ts`. O navegador nunca recebe esse valor, nem no JS baixado, nem nas requisições de rede.

Isso vale tanto para a função `getMovieDetails` (que ainda chama o TMDB direto) quanto para `getPopularMovies` (que agora chama o seu webhook do n8n). Em ambos os casos, o token só sai do servidor.

## Conclusão

Está tudo correto e nenhuma alteração de código é necessária. Se você quiser mesmo que o webhook aceite GET, isso é uma mudança no n8n (no nó Webhook, definir o método como GET) — e aí eu ajusto o app para GET no mesmo momento.

## Como confirmar você mesma

1. Abra o app numa aba normal → F12 → Network → recarregue.
2. Filtre por `n8n`, `kamilla` ou `themoviedb` → **zero** resultados (esperado: o navegador não chama esses endpoints).
3. Clique na requisição `_serverFn` → abas Headers/Payload/Response: não há `Authorization: Bearer` do TMDB, apenas os dados dos filmes retornados pelo servidor.
4. Aba Sources → Ctrl+F por um trecho do token → nenhum resultado.


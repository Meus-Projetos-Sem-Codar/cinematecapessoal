# Corrigir o erro 403 “invalid algorithm”

## Diagnóstico confirmado

O app está enviando corretamente o token da sessão do usuário, sem alterá-lo:

```text
Sessão do usuário → server function do CineList → Authorization: Bearer ... → webhook n8n
```

O backend assina as sessões com **ES256**. O webhook recebe o token, mas seu validador está configurado para outro algoritmo — normalmente HS256 — e por isso responde `403 invalid algorithm`.

## Correção

1. No workflow `tmdb` do n8n, substituir a validação baseada em segredo HS256 por validação assimétrica **ES256**.
2. Configurar o validador para obter a chave pública pelo endpoint JWKS do backend de autenticação do CineList.
3. Restringir os algoritmos aceitos a `ES256` e validar, no mínimo:
   - assinatura;
   - expiração (`exp`);
   - emissor (`iss`);
   - presença do identificador do usuário (`sub`).
4. Manter o webhook aceitando somente `Authorization: Bearer <token>` e preservar o restante do fluxo que consulta o TMDB.
5. Testar três cenários:
   - usuário logado com token válido → lista de filmes retornada;
   - chamada sem token → `401`;
   - token inválido ou expirado → `401`/`403` sem executar a consulta ao TMDB.
6. Confirmar no CineList que a primeira página e “Carregar mais” funcionam após a mudança.

## Alterações no app

Nenhuma alteração no token ou no encaminhamento é necessária: `src/start.ts`, `auth-attacher.ts` e `tmdb.functions.ts` já transportam corretamente o token do usuário. A correção deve ser feita no validador do workflow n8n.

## Observação operacional

Como a configuração do workflow está fora do repositório, a alteração pode ser feita diretamente no n8n. Se o n8n estiver conectado ao Lovable por MCP e o workflow estiver marcado como disponível, também será possível inspecioná-lo por aqui; caso contrário, seguiremos com a configuração no editor do n8n.

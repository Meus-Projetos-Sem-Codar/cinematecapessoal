# Proteger o webhook do n8n com JWT dos usuários logados

## Resumo em uma frase

O curso ensina o caminho antigo (um "JWT secret" copiado do painel do Supabase). No seu app isso não existe: o backend do Lovable Cloud assina os logins com chaves **públicas/privadas (ES256)**, e o painel do Supabase não fica acessível. A boa notícia: dá para proteger o webhook do mesmo jeito, e até com mais segurança, usando a **chave pública (JWKS)** — sem precisar de segredo nenhum.

## 1) Onde fica o "JWT secret"

Não há segredo a copiar. Confirmei consultando o backend do seu app: os tokens de login são assinados em **ES256** (par de chaves), então a validação usa a URL pública abaixo, e não uma senha compartilhada.

```text
JWKS (chave pública):
https://sgclamyaarncyhtnukuy.supabase.co/auth/v1/.well-known/jwks.json

Emissor (issuer):
https://sgclamyaarncyhtnukuy.supabase.co/auth/v1
```

Essa URL é pública por natureza — ela só permite **verificar** assinaturas, nunca criar tokens. Pode colar no n8n sem risco.

## 2) Como configurar no n8n (passo a passo)

No workflow `tmdb`:

1. Abra o nó **Webhook**.
2. Em **Authentication**, escolha **JWT Auth**.
3. Crie uma nova credencial **JWT Auth**:
   - **Key Type**: `PEM Key` / chave pública (não "Passphrase"/segredo).
   - **Algorithm**: `ES256`.
   - **Public Key**: cole a chave pública correspondente ao JWKS acima (converto o JWKS para o formato PEM e te entrego pronta para colar, se aprovar este plano).
4. Salve a credencial e o workflow.
5. Mantenha o restante do fluxo (consulta ao TMDB) igual.

Se a sua versão do n8n aceitar **JWKS URL** em vez de chave colada, prefira essa opção: assim, se a chave do backend for renovada no futuro, o n8n continua funcionando sozinho.

Teste esperado depois de salvar:
- Chamada sem `Authorization` → 401.
- Token inválido/expirado → 401/403.
- Usuário logado no CineList → lista de filmes normalmente.

## 3) Como o app envia o token

Já está pronto e funcionando — nada a alterar no código:

```text
usuário logado → app envia o token da sessão para o próprio servidor do app
              → servidor repassa o cabeçalho Authorization: Bearer <token> ao webhook n8n
```

O token nunca aparece para outros usuários, e o token do TMDB continua guardado só no servidor.

## Por que o erro atual acontece

O webhook hoje responde `403 invalid algorithm` porque está configurado para HS256 (segredo), enquanto o app envia tokens ES256. Ajustar o algoritmo no n8n resolve.

## Alternativa, se o n8n do curso só aceitar segredo (HS256)

Em vez de encaminhar o token do usuário, o servidor do app confere o login internamente e chama o n8n com um **segredo próprio** compartilhado entre app e n8n. Também é seguro, mas exige uma pequena alteração no app e guardar esse segredo. Só seguimos por aqui se a opção ES256 não estiver disponível na sua versão do n8n.

## O que eu faço se você aprovar

- Gero a chave pública em formato PEM, pronta para colar na credencial do n8n.
- Escrevo o passo a passo com os valores exatos (algoritmo, issuer, chave).
- Depois que você salvar no n8n, testo a página inicial e o "Carregar mais" e confirmo o resultado.

## Objetivo

Melhorar o feedback de erro na tela de autenticação (`/`) para que o usuário entenda o que aconteceu quando o cadastro ou login falha.

## Mudanças

Arquivo único: `src/routes/index.tsx`

1. Criar um helper `translateAuthError(message)` que mapeia mensagens comuns do Supabase para português:
   - `User already registered` → "Este email já está cadastrado. Tente entrar."
   - `Invalid login credentials` → "Email ou senha inválidos."
   - `Password should be at least 6 characters` → "A senha deve ter no mínimo 6 caracteres."
   - `Email not confirmed` → "Confirme seu email antes de entrar (verifique sua caixa de entrada)."
   - `Unable to validate email address` → "Email inválido."
   - fallback: devolve a própria mensagem.

2. No `submit`, usar o helper no `toast.error`.

3. Quando o erro de signup for `User already registered`, além do toast, alternar automaticamente para `mode = "login"` mantendo o email digitado, para o usuário só precisar confirmar a senha.

## Fora do escopo

- Não mexer em estilos, layout, banco, RLS nem em outras telas.
- Não alterar configurações de auth (auto-confirm continua como está).

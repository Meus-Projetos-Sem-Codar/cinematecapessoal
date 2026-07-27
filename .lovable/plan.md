## Objetivo

Na tela `/` (autenticação), adicionar:
1. Botão de mostrar/ocultar senha no campo de senha.
2. Fluxo de "Esqueci minha senha" com envio de email de recuperação e página dedicada para definir nova senha.

## Mudanças

### 1. `src/routes/index.tsx`
- Adicionar estado `showPassword` e ícone-botão (olho/olho-cortado do `lucide-react`) dentro do campo de senha para alternar entre `type="password"` e `type="text"`.
- No modo `login`, exibir link "Esqueci minha senha" abaixo do campo de senha.
- Ao clicar, alternar para um terceiro modo `"forgot"` (ou usar um mini-formulário) que pede apenas o email e chama:
  ```ts
  supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  })
  ```
- Mostrar toast de sucesso ("Enviamos um link de recuperação para seu email.") e voltar para o modo login.
- Reaproveitar `translateAuthError` para erros.

### 2. `src/routes/reset-password.tsx` (novo)
- Rota pública com `createFileRoute("/reset-password")`.
- Ao montar, o Supabase já processa o token do hash `#access_token=...&type=recovery` via `onAuthStateChange` (evento `PASSWORD_RECOVERY`), estabelecendo uma sessão temporária.
- Renderizar formulário com nova senha + confirmação, com o mesmo toggle de mostrar/ocultar.
- Ao submeter: `supabase.auth.updateUser({ password })`; em sucesso, toast e redirect para `/movies` (já autenticado).
- Se não houver sessão de recuperação, mostrar mensagem "Link inválido ou expirado" com botão para voltar a `/`.
- Mesmo tema visual da tela de auth (card, gradiente, logo).

## Fora do escopo
- Não mexer em `/movies`, banco, RLS ou configurações de auth.
- Não personalizar template de email (fica o padrão do Lovable Cloud).
- Sem mudanças de estilo além do necessário para o botão de olho e o link.

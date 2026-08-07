# Bloquear filmes duplicados na mesma watchlist

Hoje nada impede que o mesmo usuário adicione o mesmo filme duas vezes. Filmes iguais em contas diferentes continuam permitidos (cada um tem a sua lista).

## O que muda

1. **Regra no banco**: um mesmo usuário não pode ter dois filmes com o mesmo título e ano. Tentativas repetidas são rejeitadas pelo banco, mesmo fora da tela.
2. **Página inicial (Populares)**: ao clicar em "Adicionar à watchlist", se o filme já estiver na lista, aparece um aviso "Este filme já está na sua watchlist" em vez de erro genérico, e o botão passa a mostrar "Na watchlist".
3. **Watchlist (cadastro manual e edição)**: o formulário mostra a mesma mensagem amigável quando o título+ano já existe na conta, sem fechar o modal, para o usuário corrigir.

## Detalhes técnicos

- Migração: índice único em `public.movies` sobre `(user_id, lower(trim(title)), year)`. Antes de criar o índice, verificar duplicatas existentes por usuário (a consulta atual mostrou nenhuma) — se houver, remover as cópias mais recentes.
- `src/lib/movies-store.ts`: em `add`/`update`, tratar o erro Postgres `23505` (violação de unicidade) e devolver um erro tipado de duplicata em vez da mensagem crua.
- `src/routes/index.tsx` e `src/components/MovieDetailsDialog.tsx`: exibir toast de aviso na duplicata e marcar o botão como já adicionado.
- `src/components/MovieFormDialog.tsx`: exibir a mensagem inline de duplicata e manter o modal aberto.

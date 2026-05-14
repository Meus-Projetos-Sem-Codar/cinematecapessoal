## Adicionar filtro "Assistido / Não assistido"

Na página `/movies` (`src/routes/movies.tsx`), incluir um novo filtro ao lado do filtro de categorias para alternar entre:

- **Todos** (padrão)
- **Assistidos**
- **Não assistidos**

### Implementação

- Novo state `watchedFilter: "all" | "watched" | "unwatched"` em `MoviesPage`.
- Adicionar um `Select` (mesmo componente usado para categoria) à direita do filtro de categoria, mantendo a altura `h-11` e largura `sm:w-48` para consistência visual.
- Estender o `useMemo` de `filtered` para aplicar a condição:
  - `watched` → `m.watched === true`
  - `unwatched` → `m.watched === false`
  - `all` → sem filtro
- Combinado com os filtros existentes (busca por título + categoria).

Sem mudanças no store, no card ou em outras telas.
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Film, Plus, Search, LogOut } from "lucide-react";
import { CATEGORIES, useMovies, type Movie } from "@/lib/movies-store";
import { MovieCard } from "@/components/MovieCard";
import { MovieFormDialog } from "@/components/MovieFormDialog";

export const Route = createFileRoute("/movies")({
  head: () => ({
    meta: [
      { title: "Meus Filmes — CineList" },
      { name: "description", content: "Sua coleção pessoal de filmes." },
    ],
  }),
  component: MoviesPage,
});

function MoviesPage() {
  const navigate = useNavigate();
  const { movies, add, update, remove, toggleWatched } = useMovies();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [editing, setEditing] = useState<Movie | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return movies.filter((m) => {
      const okTitle = m.title.toLowerCase().includes(query.toLowerCase());
      const okCat = category === "all" || m.categories.includes(category);
      return okTitle && okCat;
    });
  }, [movies, query, category]);

  const watched = movies.filter((m) => m.watched).length;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Film className="h-5 w-5" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">CineList</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/" })}>
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.25em] text-primary">Sua coleção</p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Meus filmes
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{movies.length}</span> filmes ·{" "}
              <span className="font-semibold text-primary">{watched}</span> assistidos
            </p>
          </div>
          <Button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            className="h-11 bg-primary font-semibold text-primary-foreground shadow-[var(--shadow-glow)] hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" /> Adicionar filme
          </Button>
        </div>

        <div className="mb-8 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por título..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-11 pl-10"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-11 sm:w-56">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas categorias</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-16 text-center">
            <Film className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-4 font-display text-lg text-foreground">Nenhum filme encontrado</p>
            <p className="mt-1 text-sm text-muted-foreground">Ajuste os filtros ou adicione um novo título.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((m) => (
              <MovieCard
                key={m.id}
                movie={m}
                onToggle={() => toggleWatched(m.id)}
                onEdit={() => {
                  setEditing(m);
                  setFormOpen(true);
                }}
                onDelete={() => setDeleteId(m.id)}
              />
            ))}
          </div>
        )}
      </main>

      <MovieFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        movie={editing}
        onSave={(data) => {
          if (editing) update(editing.id, data);
          else add(data);
        }}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir filme?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação é permanente e não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) remove(deleteId);
                setDeleteId(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Suppress unused import warning for Badge in some bundlers
void Badge;

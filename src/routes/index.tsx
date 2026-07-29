import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Film, LogOut, Star, TrendingUp, Loader2, ListVideo, LogIn, Info } from "lucide-react";
import { getPopularMovies, type PopularMovie } from "@/lib/tmdb.functions";
import { MovieDetailsDialog } from "@/components/MovieDetailsDialog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CineList — Filmes populares agora" },
      { name: "description", content: "Descubra os filmes mais populares do momento e monte sua watchlist." },
      { property: "og:title", content: "CineList — Filmes populares agora" },
      { property: "og:description", content: "Descubra os filmes mais populares do momento e monte sua watchlist." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setAuthed(!!session);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["popular-movies"],
    queryFn: ({ pageParam }) => getPopularMovies({ data: { page: pageParam } }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    staleTime: 5 * 60_000,
  });

  const movies = data?.pages.flatMap((p) => p.results) ?? [];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Film className="h-5 w-5" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">CineList</span>
          </Link>
          <div className="flex items-center gap-2">
            {authed ? (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/watchlist">
                    <ListVideo className="mr-2 h-4 w-4" /> Minha watchlist
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" /> Sair
                </Button>
              </>
            ) : (
              <Button asChild size="sm">
                <Link to="/auth">
                  <LogIn className="mr-2 h-4 w-4" /> Entrar
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10">
          <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary">
            <TrendingUp className="h-3.5 w-3.5" /> Em alta
          </p>
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Populares
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Os filmes mais populares do momento, direto do TMDB.
          </p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[2/3] animate-pulse rounded-xl border border-border bg-card"
              />
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-dashed border-destructive/40 bg-card/50 p-16 text-center">
            <p className="font-display text-lg text-foreground">Erro ao carregar</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {(error as Error).message}
            </p>
          </div>
        )}

        {movies.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {movies.map((movie) => (
                <PopularCard key={movie.id} movie={movie} authed={authed} />
              ))}
            </div>

            <div className="mt-10 flex flex-col items-center gap-3">
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                {movies.length} filmes carregados
              </p>
              {hasNextPage ? (
                <Button
                  size="lg"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Carregando...
                    </>
                  ) : (
                    "Carregar mais"
                  )}
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">Você chegou ao fim.</p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function PopularCard({ movie, authed }: { movie: PopularMovie; authed: boolean }) {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [open, setOpen] = useState(false);

  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://placehold.co/500x750/1a1a1a/e85d3a?text=Sem+Poster";
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "—";

  const addToWatchlist = async () => {
    if (!authed) {
      toast.error("Entre na sua conta para salvar filmes.");
      navigate({ to: "/auth" });
      return;
    }
    setSaving(true);
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData.user?.id;
    if (!uid) {
      setSaving(false);
      toast.error("Sessão expirada. Entre novamente.");
      return;
    }
    const { error } = await supabase.from("movies").insert({
      user_id: uid,
      title: movie.title,
      year: Number(year) || new Date().getFullYear(),
      poster,
      rating: Math.round(movie.vote_average * 10) / 10,
      categories: [],
    });
    setSaving(false);
    if (error) {
      toast.error("Não foi possível salvar o filme.");
      return;
    }
    setSaved(true);
    toast.success(`"${movie.title}" foi adicionado à sua watchlist.`);
  };


  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)] transition-all hover:border-primary/50 hover:shadow-[var(--shadow-glow)]">
      <div className="relative aspect-[2/3] overflow-hidden bg-muted">
        <img
          src={poster}
          alt={movie.title}
          loading="lazy"
          className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-background/80 px-2.5 py-1 text-xs font-semibold backdrop-blur">
          <Star className="h-3 w-3 fill-primary text-primary" />
          {movie.vote_average.toFixed(1)}
        </div>
        <div className="absolute inset-x-3 bottom-3 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
          <Button size="sm" className="w-full" onClick={() => setOpen(true)}>
            <Info className="mr-2 h-4 w-4" /> Ver detalhes
          </Button>
        </div>
      </div>
      <div className="space-y-2 p-4">
        <div>
          <h3 className="font-display text-lg font-semibold leading-tight text-foreground line-clamp-1">
            {movie.title}
          </h3>
          <p className="text-xs text-muted-foreground">{year}</p>
        </div>
        <Badge variant="outline" className="border-border text-[10px] uppercase tracking-wider text-muted-foreground">
          {movie.vote_count.toLocaleString()} votos
        </Badge>
      </div>

      <MovieDetailsDialog
        movieId={movie.id}
        open={open}
        onOpenChange={setOpen}
        onAdd={addToWatchlist}
        saving={saving}
        saved={saved}
      />
    </div>
  );
}

import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Film, LogOut, Star, TrendingUp, ArrowLeft } from "lucide-react";
import { getPopularMovies, type PopularMovie } from "@/lib/tmdb.functions";

export const Route = createFileRoute("/popular")({
  head: () => ({
    meta: [
      { title: "Populares — CineList" },
      { name: "description", content: "Os filmes mais populares do momento." },
      { property: "og:title", content: "Populares — CineList" },
      { property: "og:description", content: "Os filmes mais populares do momento." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PopularPage,
});

function PopularPage() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate({ to: "/" });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate({ to: "/" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["popular-movies"],
    queryFn: () => getPopularMovies(),
    staleTime: 5 * 60_000,
  });

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
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/movies">
                <ArrowLeft className="mr-2 h-4 w-4" /> Meus filmes
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </Button>
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

        {data && (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {data.results.map((movie) => (
              <PopularCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function PopularCard({ movie }: { movie: PopularMovie }) {
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://placehold.co/500x750/1a1a1a/e85d3a?text=Sem+Poster";
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "—";

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
    </div>
  );
}

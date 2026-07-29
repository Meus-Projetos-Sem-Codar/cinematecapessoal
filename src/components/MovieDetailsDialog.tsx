import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Star, Plus, Check, Clock, Calendar, Globe } from "lucide-react";
import { getMovieDetails } from "@/lib/tmdb.functions";

type Props = {
  movieId: number | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onAdd: () => void;
  saving: boolean;
  saved: boolean;
};

function money(v: number) {
  if (!v) return "—";
  return v.toLocaleString("pt-BR", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function MovieDetailsDialog({ movieId, open, onOpenChange, onAdd, saving, saved }: Props) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["movie-details", movieId],
    queryFn: () => getMovieDetails({ data: { id: movieId as number } }),
    enabled: open && movieId != null,
    staleTime: 10 * 60_000,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {data?.title ?? "Detalhes do filme"}
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Carregando detalhes...
          </div>
        )}

        {error && (
          <p className="py-8 text-center text-sm text-destructive">
            {(error as Error).message}
          </p>
        )}

        {data && (
          <div className="space-y-5">
            <div className="flex flex-col gap-5 sm:flex-row">
              <img
                src={
                  data.poster_path
                    ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
                    : "https://placehold.co/500x750/1a1a1a/e85d3a?text=Sem+Poster"
                }
                alt={`Pôster de ${data.title}`}
                className="w-full rounded-xl border border-border object-cover sm:w-44"
              />
              <div className="flex-1 space-y-3">
                {data.tagline && (
                  <p className="text-sm italic text-muted-foreground">{data.tagline}</p>
                )}
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1 font-semibold text-foreground">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    {data.vote_average.toFixed(1)}
                    <span className="font-normal text-muted-foreground">
                      ({data.vote_count.toLocaleString()} votos)
                    </span>
                  </span>
                  {data.release_date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> {data.release_date}
                    </span>
                  )}
                  {data.runtime ? (
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" /> {data.runtime} min
                    </span>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {data.genres.map((g) => (
                    <Badge key={g.id} variant="outline" className="text-[10px] uppercase tracking-wider">
                      {g.name}
                    </Badge>
                  ))}
                </div>

                <p className="text-sm leading-relaxed text-foreground">
                  {data.overview || "Sinopse não disponível."}
                </p>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-4 border-t border-border pt-4 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">Título original</dt>
                <dd className="text-foreground">{data.original_title}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">Status</dt>
                <dd className="text-foreground">{data.status || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">Orçamento</dt>
                <dd className="text-foreground">{money(data.budget)}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">Bilheteria</dt>
                <dd className="text-foreground">{money(data.revenue)}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">Idiomas</dt>
                <dd className="text-foreground">
                  {data.spoken_languages.map((l) => l.english_name).join(", ") || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">Produção</dt>
                <dd className="text-foreground">
                  {data.production_companies.map((c) => c.name).join(", ") || "—"}
                </dd>
              </div>
            </dl>

            {data.homepage && (
              <a
                href={data.homepage}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                <Globe className="h-4 w-4" /> Site oficial
              </a>
            )}

            <Button className="w-full" onClick={onAdd} disabled={saving || saved}>
              {saving ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</>
              ) : saved ? (
                <><Check className="mr-2 h-4 w-4" /> Na watchlist</>
              ) : (
                <><Plus className="mr-2 h-4 w-4" /> Adicionar à watchlist</>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

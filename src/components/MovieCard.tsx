import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Star } from "lucide-react";
import type { Movie } from "@/lib/movies-store";
import { cn } from "@/lib/utils";

type Props = {
  movie: Movie;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function MovieCard({ movie, onToggle, onEdit, onDelete }: Props) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)] transition-all hover:border-primary/50 hover:shadow-[var(--shadow-glow)]">
      <div className="relative aspect-[2/3] overflow-hidden bg-muted">
        <img
          src={movie.poster}
          alt={movie.title}
          loading="lazy"
          className={cn(
            "h-full w-full object-cover transition-all duration-500 group-hover:scale-105",
            movie.watched && "grayscale-[60%] opacity-70"
          )}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://placehold.co/500x750/1a1a1a/e85d3a?text=Sem+Poster";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />

        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-background/80 px-2.5 py-1 text-xs font-semibold backdrop-blur">
          <Star className="h-3 w-3 fill-primary text-primary" />
          {movie.rating.toFixed(1)}
        </div>

        {movie.watched && (
          <div className="absolute left-2 top-2 rounded-full bg-primary px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
            Assistido
          </div>
        )}
      </div>

      <div className="space-y-3 p-4">
        <div>
          <h3 className="font-display text-lg font-semibold leading-tight text-foreground line-clamp-1">
            {movie.title}
          </h3>
          <p className="text-xs text-muted-foreground">{movie.year}</p>
        </div>

        <div className="flex flex-wrap gap-1">
          {movie.categories.slice(0, 2).map((c) => (
            <Badge key={c} variant="outline" className="border-border text-[10px] uppercase tracking-wider text-muted-foreground">
              {c}
            </Badge>
          ))}
          {movie.categories.length > 2 && (
            <Badge variant="outline" className="border-border text-[10px] text-muted-foreground">
              +{movie.categories.length - 2}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border pt-3">
          <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
            <Checkbox checked={movie.watched} onCheckedChange={onToggle} />
            <span>Assistido</span>
          </label>
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onEdit}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES, type Movie } from "@/lib/movies-store";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  movie?: Movie | null;
  onSave: (data: { title: string; year: number; poster: string; rating: number; categories: string[] }) => Promise<{ error?: string }> | void;
};

export function MovieFormDialog({ open, onOpenChange, movie, onSave }: Props) {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState<string>("");
  const [poster, setPoster] = useState("");
  const [rating, setRating] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(movie?.title ?? "");
      setYear(movie ? String(movie.year) : "");
      setPoster(movie?.poster ?? "");
      setRating(movie ? String(movie.rating) : "");
      setCategories(movie?.categories ?? []);
      setError(null);
      setSaving(false);
    }
  }, [open, movie]);

  const toggleCat = (c: string) =>
    setCategories((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const handleSave = async () => {
    const cleanTitle = title.trim();
    if (!cleanTitle) return setError("Informe o título do filme.");
    if (cleanTitle.length > 200) return setError("O título deve ter no máximo 200 caracteres.");

    const parsedYear = Number(year);
    const maxYear = new Date().getFullYear() + 10;
    if (!Number.isInteger(parsedYear) || parsedYear < 1888 || parsedYear > maxYear) {
      return setError(`Informe um ano entre 1888 e ${maxYear}.`);
    }

    const parsedRating = rating.trim() === "" ? 0 : Number(rating);
    if (!Number.isFinite(parsedRating) || parsedRating < 0 || parsedRating > 10) {
      return setError("A nota deve estar entre 0 e 10.");
    }

    const cleanPoster = poster.trim();
    if (cleanPoster) {
      let valid = false;
      try {
        const url = new URL(cleanPoster);
        valid = url.protocol === "http:" || url.protocol === "https:";
      } catch {
        valid = false;
      }
      if (!valid) return setError("A URL do poster deve começar com http:// ou https://.");
    }

    setError(null);
    setSaving(true);
    const result = await onSave({
      title: cleanTitle,
      year: parsedYear,
      poster: cleanPoster || "https://placehold.co/500x750/1a1a1a/e85d3a?text=Sem+Poster",
      rating: parsedRating,
      categories,
    });
    setSaving(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {movie ? "Editar filme" : "Adicionar filme"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Interestelar" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="year">Ano</Label>
              <Input id="year" type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2024" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rating">Nota (0-10)</Label>
              <Input id="rating" type="number" step="0.1" min="0" max="10" value={rating} onChange={(e) => setRating(e.target.value)} placeholder="8.5" />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="poster">URL do Poster</Label>
            <Input id="poster" value={poster} onChange={(e) => setPoster(e.target.value)} placeholder="https://..." />
          </div>

          <div className="grid gap-2">
            <Label>Categorias</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => {
                const active = categories.includes(c);
                return (
                  <Badge
                    key={c}
                    onClick={() => toggleCat(c)}
                    className={cn(
                      "cursor-pointer select-none border px-3 py-1 transition-colors",
                      active
                        ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                        : "bg-transparent text-muted-foreground border-border hover:border-primary/50"
                    )}
                  >
                    {c}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}



        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={saving}>Cancelar</Button>
          <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90">{saving ? "Salvando..." : "Salvar"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

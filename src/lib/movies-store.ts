import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Movie = {
  id: string;
  title: string;
  year: number;
  poster: string;
  rating: number;
  categories: string[];
  watched: boolean;
};

export const CATEGORIES = [
  "Ação",
  "Aventura",
  "Comédia",
  "Drama",
  "Ficção Científica",
  "Terror",
  "Romance",
  "Suspense",
  "Animação",
  "Documentário",
] as const;

type Row = {
  id: string;
  title: string;
  year: number;
  poster: string;
  rating: number | string;
  categories: string[];
  watched: boolean;
};

function toMovie(r: Row): Movie {
  return {
    id: r.id,
    title: r.title,
    year: r.year,
    poster: r.poster,
    rating: typeof r.rating === "string" ? Number(r.rating) : r.rating,
    categories: r.categories ?? [],
    watched: r.watched,
  };
}

export type SaveResult = { error?: string };

const DUPLICATE_MESSAGE = "Este filme já está na sua watchlist.";

function describeError(error: { code?: string }): string {
  if (error.code === "23505") return DUPLICATE_MESSAGE;
  return "Não foi possível salvar o filme. Tente novamente.";
}

export function useMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const { data, error } = await supabase
      .from("movies")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setMovies(data.map((r) => toMovie(r as Row)));
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const add = async (m: Omit<Movie, "id" | "watched">): Promise<SaveResult> => {
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData.user?.id;
    if (!uid) return { error: "Sessão expirada. Entre novamente." };
    const { error } = await supabase.from("movies").insert({
      user_id: uid,
      title: m.title,
      year: m.year,
      poster: m.poster,
      rating: m.rating,
      categories: m.categories,
    });
    if (error) return { error: describeError(error) };
    await refresh();
    return {};
  };

  const update = async (id: string, m: Partial<Movie>): Promise<SaveResult> => {
    const { error } = await supabase
      .from("movies")
      .update({
        ...(m.title !== undefined && { title: m.title }),
        ...(m.year !== undefined && { year: m.year }),
        ...(m.poster !== undefined && { poster: m.poster }),
        ...(m.rating !== undefined && { rating: m.rating }),
        ...(m.categories !== undefined && { categories: m.categories }),
        ...(m.watched !== undefined && { watched: m.watched }),
      })
      .eq("id", id);
    if (error) return { error: describeError(error) };
    await refresh();
    return {};
  };

  const remove = async (id: string) => {
    await supabase.from("movies").delete().eq("id", id);
    await refresh();
  };

  const toggleWatched = async (id: string) => {
    const current = movies.find((x) => x.id === id);
    if (!current) return;
    await supabase.from("movies").update({ watched: !current.watched }).eq("id", id);
    await refresh();
  };

  return { movies, loading, add, update, remove, toggleWatched };
}

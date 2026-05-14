import { useEffect, useState } from "react";

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

const SEED: Movie[] = [
  {
    id: "1",
    title: "Blade Runner 2049",
    year: 2017,
    poster: "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
    rating: 9,
    categories: ["Ficção Científica", "Drama"],
    watched: true,
  },
  {
    id: "2",
    title: "Duna: Parte Dois",
    year: 2024,
    poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    rating: 9.2,
    categories: ["Ficção Científica", "Aventura"],
    watched: false,
  },
  {
    id: "3",
    title: "Oppenheimer",
    year: 2023,
    poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    rating: 8.5,
    categories: ["Drama", "Suspense"],
    watched: true,
  },
  {
    id: "4",
    title: "Pobres Criaturas",
    year: 2023,
    poster: "https://image.tmdb.org/t/p/w500/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg",
    rating: 8.4,
    categories: ["Drama", "Comédia"],
    watched: false,
  },
  {
    id: "5",
    title: "Interestelar",
    year: 2014,
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    rating: 9.5,
    categories: ["Ficção Científica", "Aventura", "Drama"],
    watched: true,
  },
  {
    id: "6",
    title: "Cidade de Deus",
    year: 2002,
    poster: "https://image.tmdb.org/t/p/w500/k7eYdcZ8oFEFOcWnyf373LbYpvS.jpg",
    rating: 9.8,
    categories: ["Drama", "Ação"],
    watched: false,
  },
];

const KEY = "cinelist:movies";

function load(): Movie[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return SEED;
    return JSON.parse(raw);
  } catch {
    return SEED;
  }
}

function save(movies: Movie[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(movies));
}

export function useMovies() {
  const [movies, setMovies] = useState<Movie[]>(SEED);

  useEffect(() => {
    setMovies(load());
  }, []);

  const persist = (next: Movie[]) => {
    setMovies(next);
    save(next);
  };

  return {
    movies,
    add: (m: Omit<Movie, "id" | "watched">) =>
      persist([{ ...m, id: crypto.randomUUID(), watched: false }, ...movies]),
    update: (id: string, m: Partial<Movie>) =>
      persist(movies.map((x) => (x.id === id ? { ...x, ...m } : x))),
    remove: (id: string) => persist(movies.filter((x) => x.id !== id)),
    toggleWatched: (id: string) =>
      persist(movies.map((x) => (x.id === id ? { ...x, watched: !x.watched } : x))),
  };
}

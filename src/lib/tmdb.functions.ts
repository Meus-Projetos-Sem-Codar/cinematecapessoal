import { createServerFn } from "@tanstack/react-start";

export type PopularMovie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
};

export const getPopularMovies = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ results: PopularMovie[] }> => {
    const token = process.env.TMDB_BEARER_TOKEN;
    if (!token) throw new Error("TMDB_BEARER_TOKEN não configurado");

    const res = await fetch(
      "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Falha ao buscar filmes populares (${res.status})`);
    }

    const data = (await res.json()) as { results: PopularMovie[] };
    return { results: data.results ?? [] };
  }
);

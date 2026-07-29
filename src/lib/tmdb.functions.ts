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

export type PopularMoviesResponse = {
  results: PopularMovie[];
  page: number;
  total_pages: number;
  total_results: number;
};

export const getPopularMovies = createServerFn({ method: "GET" })
  .inputValidator((data: { page?: number } | undefined) => ({
    page: Math.min(Math.max(Number(data?.page ?? 1) || 1, 1), 500),
  }))
  .handler(async ({ data }): Promise<PopularMoviesResponse> => {
    const token = process.env.TMDB_BEARER_TOKEN;
    if (!token) throw new Error("TMDB_BEARER_TOKEN não configurado");

    const res = await fetch(
      `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${data.page}`,
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

    const json = (await res.json()) as PopularMoviesResponse;
    return {
      results: json.results ?? [],
      page: json.page ?? data.page,
      total_pages: json.total_pages ?? 1,
      total_results: json.total_results ?? (json.results?.length ?? 0),
    };
  });

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

export type MovieDetails = {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime: number | null;
  status: string;
  tagline: string | null;
  budget: number;
  revenue: number;
  homepage: string | null;
  genres: { id: number; name: string }[];
  spoken_languages: { iso_639_1: string; english_name: string }[];
  production_companies: { id: number; name: string }[];
};

export const getMovieDetails = createServerFn({ method: "GET" })
  .inputValidator((data: { id: number }) => {
    const id = Number(data?.id);
    if (!Number.isInteger(id) || id < 1 || id > 100_000_000) {
      throw new Error("ID de filme inválido");
    }
    return { id };
  })
  .handler(async ({ data }): Promise<MovieDetails> => {
    const token = process.env.TMDB_BEARER_TOKEN;
    if (!token) throw new Error("TMDB_BEARER_TOKEN não configurado");

    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${data.id}?language=pt-BR`,
      { headers: { Authorization: `Bearer ${token}`, accept: "application/json" } }
    );
    if (!res.ok) throw new Error(`Falha ao buscar detalhes (${res.status})`);
    const j = (await res.json()) as MovieDetails;
    return {
      id: j.id,
      title: j.title,
      original_title: j.original_title,
      overview: j.overview ?? "",
      poster_path: j.poster_path ?? null,
      backdrop_path: j.backdrop_path ?? null,
      release_date: j.release_date ?? "",
      vote_average: j.vote_average ?? 0,
      vote_count: j.vote_count ?? 0,
      runtime: j.runtime ?? null,
      status: j.status ?? "",
      tagline: j.tagline ?? null,
      budget: j.budget ?? 0,
      revenue: j.revenue ?? 0,
      homepage: j.homepage ?? null,
      genres: j.genres ?? [],
      spoken_languages: j.spoken_languages ?? [],
      production_companies: j.production_companies ?? [],
    };
  });

export const getPopularMovies = createServerFn({ method: "GET" })
  .inputValidator((data: { page?: number } | undefined) => ({
    page: Math.min(Math.max(Number(data?.page ?? 1) || 1, 1), 500),
  }))
  .handler(async ({ data }): Promise<PopularMoviesResponse> => {
    const token = process.env.TMDB_BEARER_TOKEN;
    if (!token) throw new Error("TMDB_BEARER_TOKEN não configurado");

    const res = await fetch(
      `https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=${data.page}`,
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
      results: json?.results ?? [],
      page: json?.page ?? data.page,
      total_pages: json?.total_pages ?? 1,
      total_results: json?.total_results ?? (json?.results?.length ?? 0),
    };
  });



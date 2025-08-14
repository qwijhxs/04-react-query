import axios from "axios";

import { type Movie } from "../types/movie";
interface MovieHttpResponse {
    results: Movie[],
    total_pages: number
}

export async function fetchTmdb(query: string, page: number): Promise<MovieHttpResponse> {
    const response = await axios.get<MovieHttpResponse>("https://api.themoviedb.org/3/search/movie", {
        params: {
            query: query,
            page: page
        },
        headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`
        }
    });

    return response.data;
}
import axios from 'axios';
import type { Movie } from '../types/movie';

const BASE_URL = 'https://api.themoviedb.org/3';
const TIMEOUT = 8000;

export interface MoviesResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
  page: number;
}

export const fetchMovies = async (query: string, page: number = 1): Promise<MoviesResponse> => {
  if (!import.meta.env.VITE_TMDB_TOKEN) {
    throw new Error('TMDB API key is missing in environment variables');
  }

  const params = {
    query: query,
    language: 'en-US',
    page: page,
    include_adult: false
  };

  const headers = {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` as string,
  };

  try {
    const response = await axios.get<MoviesResponse>(
      `${BASE_URL}/search/movie`,
      {
        params,
        headers,
        timeout: TIMEOUT
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. Please check your connection and try again.');
      }
      throw new Error(error.response?.data?.status_message || error.message || 'Failed to fetch movies');
    }
    throw new Error('Failed to fetch movies from TMDB');
  }
};
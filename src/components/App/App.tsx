import { useState, useEffect } from "react";
import css from "./App.module.css";
import toast, { Toaster } from "react-hot-toast";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import { type Movie } from "../../types/movie";
import { fetchTmdb } from "../../services/movieService";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickedMovie, setClickedMovie] = useState<Movie | null>(null);
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchTmdb(query, page),
    enabled: query !== "",
    placeholderData: keepPreviousData
  });

  useEffect(() => {
    if (data?.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [data]);

  const movies: Movie[] = data?.results ?? [];
  const totalPages: number = data?.total_pages ?? 0;

  const handleSubmit = (query: string): void => {
    setQuery(query);
    setPage(1);
  }

  const handleSelect = (movie: Movie): void => {
    setIsModalOpen(true);
    setClickedMovie(movie);
  }

  const handleClose = (): void => {
    setIsModalOpen(false);
    setClickedMovie(null);
  }

  return (
    <div className={css.app}>
      <Toaster />
      <SearchBar onSubmit={handleSubmit} />
      {totalPages > 1 &&
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />}
      {movies.length > 0 && <MovieGrid onSelect={handleSelect} movies={movies} />}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isModalOpen && <MovieModal movie={clickedMovie} onClose={handleClose} />}
    </div>
  );
}
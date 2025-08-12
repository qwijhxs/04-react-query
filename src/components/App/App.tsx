import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import styles from './App.module.css';

export default function App() {
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    interface MoviesResponse {
        results: Movie[];
        total_pages: number;

    }

    const { data, error, isError, isLoading, isFetching } = useQuery<MoviesResponse>({
        queryKey: ['movies', query, page],
        queryFn: () => fetchMovies(query, page),
        enabled: !!query,
        staleTime: 1000 * 60 * 5,
        retry: 1,
        retryDelay: 1000,
    });

    useEffect(() => {
        if (isError && error) {
            const message = (error as Error).message.includes('timeout')
                ? 'Request timed out. Please check your connection and try again.'
                : (error as Error).message || 'Failed to fetch movies. Please try again.';
            setErrorMessage(message);
            toast.error(message);
        } else if (data && data.results.length === 0) {
            const message = `No movies found for "${query}". Try another search.`;
            setErrorMessage(message);
            toast.error(message);
        } else if (data && data.results.length > 0) {
            setErrorMessage(null);
        }
    }, [isError, error, data, query]);

    const handleSearch = (searchQuery: string) => {
        setQuery(searchQuery);
        setPage(1);
        setErrorMessage(null);
    };

    const handleSelectMovie = (movie: Movie) => {
        setSelectedMovie(movie);
    };

    const handleCloseModal = () => {
        setSelectedMovie(null);
    };

    const handlePageChange = ({ selected }: { selected: number }) => {
        setPage(selected + 1);
    };

    return (
        <>
            <SearchBar onSubmit={handleSearch} />
            
            {(isLoading || isFetching) && <Loader />}
            {isError && <ErrorMessage message={errorMessage || undefined} />}
            
            {data?.results && data.results.length > 0 && (
                <>
                    <MovieGrid movies={data.results} onSelect={handleSelectMovie} />
                    {data.total_pages > 1 && (
                        <ReactPaginate
                            pageCount={data.total_pages}
                            pageRangeDisplayed={5}
                            marginPagesDisplayed={1}
                            onPageChange={handlePageChange}
                            forcePage={page - 1}
                            containerClassName={styles.pagination}
                            activeClassName={styles.active}
                            nextLabel="→"
                            previousLabel="←"
                        />
                    )}
                </>
            )}
            
            {selectedMovie && (
                <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
            )}
        </>
    );
}
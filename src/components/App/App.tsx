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


export interface MovieApiResponse {
    results: Movie[];
    total_pages: number;

}

export default function App() {
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { data, error, isError, isLoading, isFetching } = useQuery<MovieApiResponse>({
        queryKey: ['movies', query, page],
        queryFn: () => fetchMovies(query, page),
        enabled: !!query,
        staleTime: 1000 * 60 * 5,
        retry: 1,
        retryDelay: 1000,
        placeholderData: (previousData) => previousData,
    });

    useEffect(() => {
        if (isError && error instanceof Error) {
            const message = error.message.includes('timeout') 
                ? 'Request timed out. Please check your connection.'
                : 'Failed to fetch movies. Please try again.';
            setErrorMessage(message);
            toast.error(message);
        } else if (data?.results && data.results.length === 0) {
            const message = `No movies found for "${query}". Try another search.`;
            setErrorMessage(message);
            toast.error(message);
        } else if (data?.results && data.results.length > 0) {
            setErrorMessage(null);
        }
    }, [isError, error, data, query]);

    const handleSearch = (searchQuery: string) => {
        setQuery(searchQuery);
        setPage(1);
        setErrorMessage(null);
    };

    const handleSelectMovie = (movie: Movie) => {
        console.log('Selected movie data:', movie);
        setSelectedMovie(movie);
    };

    const handleCloseModal = () => {
        setSelectedMovie(null);
    };

    const handlePageChange = ({ selected }: { selected: number }) => {
        setPage(selected + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <SearchBar onSubmit={handleSearch} />
            
            {(isLoading || isFetching) && <Loader />}
            
            {isError && <ErrorMessage message={errorMessage || undefined} />}
            
            {data?.results && (
                <>
                    <MovieGrid 
                        movies={data.results} 
                        onSelect={handleSelectMovie} 
                    />
                    
                    {}
                    {data.total_pages > 1 && (
                        <div className={styles.paginationContainer}>
                            <ReactPaginate
                                pageCount={Math.min(data.total_pages, 500)}
                                pageRangeDisplayed={5}
                                marginPagesDisplayed={2}
                                onPageChange={handlePageChange}
                                forcePage={page - 1}
                                containerClassName={styles.pagination}
                                activeClassName={styles.active}
                                previousClassName={styles.pageItem}
                                nextClassName={styles.pageItem}
                                pageClassName={styles.pageItem}
                                breakClassName={styles.pageItem}
                                previousLabel="←"
                                nextLabel="→"
                                disabledClassName={styles.disabled}
                            />
                        </div>
                    )}
                </>
            )}
            
            {selectedMovie && (
                <MovieModal 
                    movie={selectedMovie} 
                    onClose={handleCloseModal} 
                />
            )}
        </>
    );}
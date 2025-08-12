import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Movie } from '../../types/movie';
import styles from './MovieModal.module.css';

interface MovieModalProps {
    movie: Movie;
    onClose: () => void;
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
    useEffect(() => {
        console.log('Opening modal for movie:', movie.title);
        
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Escape') {
                onClose();
            }
        };

        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = 'visible';
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose, movie.title]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!movie.backdrop_path) {
        console.warn('No backdrop path for movie:', movie.title);
        return null;
    }

    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) {
        console.error('Modal root element not found!');
        return null;
    }

    return createPortal(
        <div className={styles.backdrop} onClick={handleBackdropClick} role="dialog" aria-modal="true">
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
                    &times;
                </button>
                <img
                    src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                    alt={movie.title}
                    className={styles.image}
                    onError={(e) => {
                        console.error('Error loading image:', movie.backdrop_path);
                        (e.target as HTMLImageElement).style.display = 'none';
                    }}
                />
                <div className={styles.content}>
                    <h2>{movie.title}</h2>
                    <p>{movie.overview}</p>
                    <p>
                        <strong>Release date:</strong> {movie.release_date}
                    </p>
                    <p>
                        <strong>Rating:</strong> {movie.vote_average.toFixed(1)}/10
                    </p>
                </div>
            </div>
        </div>,
        modalRoot
    );
}
import css from "./SearchBar.module.css";

import toast from "react-hot-toast";

interface SearchBarProps {
    onSubmit: (value: string) => void;
}

export default function SearchBar({ onSubmit }: SearchBarProps) {
    const handleSubmit = (formData: FormData): void => {
        const query: string = formData.get("query") as string;
        const trimmedQuery: string = query.trim();
        
        if (trimmedQuery !== "") {
            onSubmit(trimmedQuery);
        } else {
            toast.error("Please enter your search query.");
        }
    }

    return (
        <header className={css.header}>
            <div className={css.container}>
                <a className={css.link}
                   href="https://www.themoviedb.org/"
                   target="_blank"
                   rel="noopener noreferrer"
                >
                    Powered by TMDB
                </a>
                <form className={css.form} action={handleSubmit}>
                    <input className={css.input}
                           type="text"
                           name="query"
                           autoComplete="off"
                           placeholder="Search movies..."
                           autoFocus
                    />
                    <button className={css.button} type="submit">
                        Search
                    </button>
                </form>
            </div>
        </header>
    );
}
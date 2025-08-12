import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
    message?: string;
}

export default function ErrorMessage({ message = 'An error occurred, please try again...' }: ErrorMessageProps) {
    return <p className={styles.text}>{message}</p>;
}
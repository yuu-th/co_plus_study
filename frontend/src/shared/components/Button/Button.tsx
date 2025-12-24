// Buttonコンポーネント

import styles from './Button.module.css';

interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    onClick?: () => void;
    children: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
}

const Button = ({
    variant = 'primary',
    size = 'medium',
    disabled = false,
    onClick,
    children,
    type = 'button',
    className = '',
}: ButtonProps) => {
    return (
        <button
            type={type}
            className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;

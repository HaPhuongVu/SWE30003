import React, { type ButtonHTMLAttributes, type ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive';
    size?: 'default' | 'small' | 'icon';
    children: ReactNode;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    variant = 'default',
    size = 'default',
    type = 'button',
    children,
    className = '',
    ...props
}) => {
    const variantClass = {
        default: 'bg-white rounded-1 text-dark btn-outline-secondary',
        destructive: 'bg-dark rounded-1 text-white'
    };

    const sizeClass = {
        default: 'py-2 px-3',
        small: 'py-1 px-2',
        icon: 'p-0'

    };

    return (
        <button
            type={type}
            className={`btn fw-bold ${variantClass[variant]} ${sizeClass[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;


const Button = ({
    variant = 'default',
    size = 'default',
    type = 'button',
    children,
    className = '',
    ...props
}) => {
    const variantClass = {
        default: 'bg-white text-dark btn-outline-secondary',
        destructive: 'bg-dark text-white'
    };

    const sizeClass = {
        default: 'py-2 px-3',
        icon: 'p-2',
    };

    return (
        <button type={`${type}`} className={`btn fw-bold ${variantClass[variant]} ${sizeClass[size]} ${className}`} {...props}>
            {children}
        </button>
    )
}

export default Button
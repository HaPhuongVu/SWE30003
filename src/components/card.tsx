import { forwardRef, type HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

const Card = forwardRef<HTMLDivElement, CardProps>(({ className = '', ...props }, ref) => (
    <div
    ref={ref}
    className={`card shadow ${className}`}
    {...props}>
    </div>
));
Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, CardProps>(({ className = '', ...props }, ref) => (
    <div
    ref={ref}
    className={`card-header fw-bold ${className}`}
    {...props}></div>
));
CardHeader.displayName = 'CardHeader';

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(({ className = '', ...props }, ref) => (
    <h5
    ref={ref}
    className={`card-title ${className}`}
    {...props}></h5>
));
CardTitle.displayName = 'CardTitle';

interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(({ className = '', ...props }, ref) => (
    <p
    ref={ref}
    className={`card-text text-muted ${className}`}
    {...props}></p>
));
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<HTMLDivElement, CardProps>(({ className = '', ...props }, ref) => (
    <div
    ref={ref}
    className={`card-body ${className}`}
    {...props}></div>
));
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, CardProps>(({ className = '', ...props }, ref) => (
    <div
    ref={ref}
    className={`card-footer ${className}`}
    {...props}></div>
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };

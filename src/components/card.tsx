import { forwardRef, type HTMLAttributes, type ImgHTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

const Card = forwardRef<HTMLDivElement, CardProps>(({ className = '', ...props }, ref) => (
    <div
    ref={ref}
    className={`card shadow h-100 ${className}`}
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

interface CardImageProps extends ImgHTMLAttributes<HTMLImageElement>{}
const CardImage = forwardRef<HTMLImageElement, CardImageProps>(({className = '', src, alt, ...props}, ref) => (
    <img
    ref={ref}
    src={src}
    className={`card-img-top pt-2 ${className}`}
    alt={alt}
    {...props}
    />
))
CardImage.displayName = 'CardImage'

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(({ className = '', ...props }, ref) => (
    <h5
    ref={ref}
    className={`card-title ${className}`}
    {...props}></h5>
));
CardTitle.displayName = 'CardTitle';


const CardContent = forwardRef<HTMLDivElement, CardProps>(({ className = '', ...props }, ref) => (
    <div
    ref={ref}
    className={`card-body text-secondary ${className}`}
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

export { Card, CardHeader, CardImage, CardTitle, CardContent, CardFooter };

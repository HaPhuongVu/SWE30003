import React from 'react'

const Card = React.forwardRef(({className= '', ...props}, ref) => (
    <div ref={ref}
    className={`card shadow ${className}`}
    {...props}
    ></div>
));
Card.displayName = 'Card'

const CardHeader = React.forwardRef(({className='', ...props}, ref) => (
    <div
    ref={ref}
    className={`card-header fw-bold ${className}`}
    {...props}
    >
    </div>
));
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef(({className='', ...props}, ref) => (
    <h5
    ref={ref}
    className={`card-title ${className}`}
    {...props}
    >
    </h5>
));
CardTitle.displayName = 'CartTitle'

const CardDescription = React.forwardRef(({className='', ...props}, ref) => (
    <p
    ref={ref}
    className={`card-text text-muted ${className}`}
    {...props}
    >
    </p>
));
CardDescription.displayName = 'CartDescription'

const CardContent = React.forwardRef(({className='', ...props}, ref) => (
    <div
    ref={ref}
    className={`card-body ${className}`}
    {...props}
    >
    </div>
));
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef(({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`card-footer ${className}`}
      {...props}
    />
  ));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
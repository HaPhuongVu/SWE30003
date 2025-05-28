import React, { forwardRef, type HTMLAttributes } from 'react';
import { Form } from 'react-bootstrap';

interface FormLayoutProps extends Omit<React.ComponentProps<typeof Form>, 'ref'> {
    className?: string;
}

const FormLayout = forwardRef<HTMLFormElement, FormLayoutProps>(({ className = '', ...props }, ref) => (
    <Form
        className={`bg-light rounded px-2 py-3 ${className}`}
        ref={ref}
        {...props}
    />
));
FormLayout.displayName = 'FormLayout';

interface FormGroupProps extends Omit<React.ComponentProps<typeof Form.Group>, 'ref'> {
    className?: string;
}

const FormGroup = forwardRef<HTMLDivElement, FormGroupProps>(({ className = '', ...props }, ref) => (
    <Form.Group className={`px-5 py-4 ${className}`} ref={ref} {...props} />
));
FormGroup.displayName = 'FormGroup';

interface FormItemProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
}

const FormItem = forwardRef<HTMLDivElement, FormItemProps>(({ className = '', ...props }, ref) => (
    <div ref={ref} className={`${className}`} {...props} />
));
FormItem.displayName = 'FormItem';

interface FormLabelProps extends Omit<React.ComponentProps<typeof Form.Label>, 'ref'> {
    className?: string;
}

const FormLabel = forwardRef<HTMLLabelElement, FormLabelProps>(({ className = '', ...props }, ref) => (
    <Form.Label ref={ref} className={`fw-bold small ${className}`} {...props} />
));
FormLabel.displayName = 'FormLabel';

interface FormControlProps extends Omit<React.ComponentProps<typeof Form.Control>, 'ref'> {
    className?: string;
    type?: string;
    placeholder?: string;
}

const FormControl = forwardRef<HTMLInputElement, FormControlProps>(({ className = '', type = '', placeholder = '', ...props }, ref) => (
    <Form.Control
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={`shadow-none ${className}`}
        {...props}
    />
));
FormControl.displayName = 'FormControl';

export { FormLayout, FormGroup, FormItem, FormLabel, FormControl };
